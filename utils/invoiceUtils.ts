import { Invoice, InvoiceItem, InvoiceStatus, Payment, Client } from '../types';
import { formatDate, getCurrentDate, addDays, isPastDue, getDaysBetween } from './dateUtils';

// Invoice number generation patterns
export type InvoiceNumberPattern = 'sequential' | 'yearly' | 'monthly' | 'custom';

export interface InvoiceNumberConfig {
    pattern: InvoiceNumberPattern;
    prefix?: string;
    suffix?: string;
    digits?: number;
    separator?: string;
}

export interface InvoiceTotals {
    subtotal: number;
    tax: number;
    discount?: number;
    total: number;
}

export interface InvoiceValidationError {
    field: string;
    message: string;
    code: string;
}

export interface InvoiceValidationResult {
    isValid: boolean;
    errors: InvoiceValidationError[];
    warnings?: string[];
}

export interface InvoiceStatistics {
    totalInvoices: number;
    totalRevenue: number;
    averageInvoiceValue: number;
    paidInvoices: number;
    pendingInvoices: number;
    overdueInvoices: number;
    draftInvoices: number;
    totalPaidAmount: number;
    totalOutstanding: number;
    paymentRate: number; // percentage of invoices paid
}

/**
 * Default invoice number configuration
 */
const DEFAULT_INVOICE_CONFIG: InvoiceNumberConfig = {
    pattern: 'yearly',
    prefix: 'INV',
    digits: 3,
    separator: '-',
};

/**
 * Generates a unique invoice number based on configuration
 */
export const generateInvoiceNumber = (
    existingInvoices: Invoice[],
    config: Partial<InvoiceNumberConfig> = {}
): string => {
    const finalConfig = { ...DEFAULT_INVOICE_CONFIG, ...config };
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    let pattern: string;
    let existingNumbers: number[] = [];

    switch (finalConfig.pattern) {
        case 'sequential':
            pattern = finalConfig.prefix || 'INV';
            existingNumbers = existingInvoices
                .map(inv => {
                    const match = inv.invoiceNumber.match(new RegExp(`^${pattern}${finalConfig.separator}(\\d+)$`));
                    return match ? parseInt(match[1]) : 0;
                })
                .filter(num => num > 0);
            break;

        case 'yearly':
            const yearSuffix = year.toString().slice(-2);
            pattern = `${finalConfig.prefix}${finalConfig.separator}${yearSuffix}`;
            existingNumbers = existingInvoices
                .filter(inv => inv.invoiceNumber.startsWith(pattern))
                .map(inv => {
                    const match = inv.invoiceNumber.match(new RegExp(`^${pattern}${finalConfig.separator}(\\d+)$`));
                    return match ? parseInt(match[1]) : 0;
                })
                .filter(num => num > 0);
            break;

        case 'monthly':
            const monthStr = month.toString().padStart(2, '0');
            pattern = `${finalConfig.prefix}${finalConfig.separator}${year}${monthStr}`;
            existingNumbers = existingInvoices
                .filter(inv => inv.invoiceNumber.startsWith(pattern))
                .map(inv => {
                    const match = inv.invoiceNumber.match(new RegExp(`^${pattern}${finalConfig.separator}(\\d+)$`));
                    return match ? parseInt(match[1]) : 0;
                })
                .filter(num => num > 0);
            break;

        case 'custom':
            return `${finalConfig.prefix}${finalConfig.separator}${Date.now()}${finalConfig.suffix || ''}`;

        default:
            throw new Error(`Unknown invoice number pattern: ${finalConfig.pattern}`);
    }

    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    const paddedNumber = nextNumber.toString().padStart(finalConfig.digits || 3, '0');

    return `${pattern}${finalConfig.separator}${paddedNumber}${finalConfig.suffix || ''}`;
};

/**
 * Calculates invoice totals with tax and optional discount
 */
export const calculateInvoiceTotals = (
    items: InvoiceItem[],
    taxRate: number = 0.1,
    discountAmount: number = 0,
    discountIsPercentage: boolean = false
): InvoiceTotals => {
    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => {
        return sum + (item.quantity * item.rate);
    }, 0);

    // Calculate discount
    let discount = 0;
    if (discountAmount > 0) {
        discount = discountIsPercentage
            ? (subtotal * discountAmount / 100)
            : discountAmount;
    }

    // Apply discount to subtotal
    const discountedSubtotal = Math.max(0, subtotal - discount);

    // Calculate tax on discounted amount
    const tax = discountedSubtotal * taxRate;

    // Calculate total
    const total = discountedSubtotal + tax;

    return {
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        discount: discount > 0 ? Number(discount.toFixed(2)) : undefined,
        total: Number(total.toFixed(2))
    };
};

/**
 * Updates invoice status based on payments and due date
 */
export const updateInvoiceStatus = (
    invoice: Invoice,
    payments: Payment[]
): InvoiceStatus => {
    // Don't change draft status automatically
    if (invoice.status === 'draft') {
        return 'draft';
    }

    // Calculate total paid amount
    const invoicePayments = payments.filter(p => p.invoiceId === invoice.id);
    const totalPaid = invoicePayments.reduce((sum, p) => sum + p.amount, 0);

    // Check if fully paid
    if (totalPaid >= invoice.total) {
        return 'paid';
    }

    // Check if overdue
    if (isPastDue(invoice.dueDate)) {
        return 'overdue';
    }

    // Default to sent status
    return 'sent';
};

/**
 * Gets overdue invoices
 */
export const getOverdueInvoices = (invoices: Invoice[]): Invoice[] => {
    return invoices.filter(invoice => {
        return invoice.status !== 'paid' &&
            invoice.status !== 'draft' &&
            isPastDue(invoice.dueDate);
    });
};

/**
 * Gets invoices due soon (within specified days)
 */
export const getInvoicesDueSoon = (
    invoices: Invoice[],
    days: number = 7
): Invoice[] => {
    const today = new Date();
    const futureDate = addDays(getCurrentDate(), days);

    return invoices.filter(invoice => {
        if (invoice.status === 'paid' || invoice.status === 'draft') {
            return false;
        }

        const dueDate = new Date(invoice.dueDate);
        return dueDate >= today && dueDate <= new Date(futureDate);
    });
};

/**
 * Calculates outstanding amount for an invoice
 */
export const getOutstandingAmount = (
    invoice: Invoice,
    payments: Payment[]
): number => {
    const invoicePayments = payments.filter(p => p.invoiceId === invoice.id);
    const totalPaid = invoicePayments.reduce((sum, p) => sum + p.amount, 0);
    return Math.max(0, invoice.total - totalPaid);
};

/**
 * Gets payment percentage for an invoice
 */
export const getPaymentPercentage = (
    invoice: Invoice,
    payments: Payment[]
): number => {
    if (invoice.total === 0) return 100;

    const invoicePayments = payments.filter(p => p.invoiceId === invoice.id);
    const totalPaid = invoicePayments.reduce((sum, p) => sum + p.amount, 0);
    return Math.min(100, (totalPaid / invoice.total) * 100);
};

/**
 * Validates invoice data comprehensively
 */
export const validateInvoice = (
    invoice: Partial<Invoice>,
    clients: Client[] = [],
    existingInvoices: Invoice[] = []
): InvoiceValidationResult => {
    const errors: InvoiceValidationError[] = [];
    const warnings: string[] = [];

    // Required field validations
    if (!invoice.clientId) {
        errors.push({
            field: 'clientId',
            message: 'Client is required',
            code: 'REQUIRED_FIELD'
        });
    } else {
        // Check if client exists
        const clientExists = clients.some(c => c.id === invoice.clientId);
        if (!clientExists) {
            errors.push({
                field: 'clientId',
                message: 'Selected client does not exist',
                code: 'INVALID_CLIENT'
            });
        }
    }

    if (!invoice.invoiceNumber?.trim()) {
        errors.push({
            field: 'invoiceNumber',
            message: 'Invoice number is required',
            code: 'REQUIRED_FIELD'
        });
    } else {
        // Check for duplicate invoice numbers
        const duplicate = existingInvoices.find(
            inv => inv.invoiceNumber === invoice.invoiceNumber && inv.id !== invoice.id
        );
        if (duplicate) {
            errors.push({
                field: 'invoiceNumber',
                message: 'Invoice number already exists',
                code: 'DUPLICATE_INVOICE_NUMBER'
            });
        }
    }

    if (!invoice.date) {
        errors.push({
            field: 'date',
            message: 'Invoice date is required',
            code: 'REQUIRED_FIELD'
        });
    }

    if (!invoice.dueDate) {
        errors.push({
            field: 'dueDate',
            message: 'Due date is required',
            code: 'REQUIRED_FIELD'
        });
    }

    // Date validations
    if (invoice.date && invoice.dueDate) {
        const invoiceDate = new Date(invoice.date);
        const dueDate = new Date(invoice.dueDate);

        if (dueDate < invoiceDate) {
            errors.push({
                field: 'dueDate',
                message: 'Due date cannot be before invoice date',
                code: 'INVALID_DATE_RANGE'
            });
        }

        // Warning for very long payment terms
        const daysDiff = getDaysBetween(invoice.date, invoice.dueDate);
        if (daysDiff > 90) {
            warnings.push('Payment terms exceed 90 days, which may affect cash flow');
        }

        // Warning for past due date
        if (isPastDue(invoice.dueDate)) {
            warnings.push('Due date is in the past');
        }
    }

    // Items validation
    if (!invoice.items || invoice.items.length === 0) {
        errors.push({
            field: 'items',
            message: 'At least one invoice item is required',
            code: 'REQUIRED_FIELD'
        });
    } else {
        invoice.items.forEach((item, index) => {
            if (!item.description?.trim()) {
                errors.push({
                    field: `items.${index}.description`,
                    message: `Item ${index + 1}: Description is required`,
                    code: 'REQUIRED_FIELD'
                });
            }

            if (item.quantity <= 0) {
                errors.push({
                    field: `items.${index}.quantity`,
                    message: `Item ${index + 1}: Quantity must be greater than 0`,
                    code: 'INVALID_QUANTITY'
                });
            }

            if (item.rate < 0) {
                errors.push({
                    field: `items.${index}.rate`,
                    message: `Item ${index + 1}: Rate cannot be negative`,
                    code: 'INVALID_RATE'
                });
            }

            // Warning for very high quantities or rates
            if (item.quantity > 1000) {
                warnings.push(`Item ${index + 1}: Unusually high quantity (${item.quantity})`);
            }

            if (item.rate > 10000) {
                warnings.push(`Item ${index + 1}: Unusually high rate ($${item.rate})`);
            }
        });
    }

    // Total validation
    if (invoice.total !== undefined && invoice.total < 0) {
        errors.push({
            field: 'total',
            message: 'Total amount cannot be negative',
            code: 'INVALID_TOTAL'
        });
    }

    // Warning for very large invoices
    if (invoice.total && invoice.total > 100000) {
        warnings.push('Invoice total exceeds $100,000');
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings: warnings.length > 0 ? warnings : undefined
    };
};

/**
 * Formats currency values consistently
 */
export const formatCurrency = (
    amount: number,
    currency: string = 'USD',
    locale: string = 'en-US'
): string => {
    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
        }).format(amount);
    } catch (error) {
        // Fallback formatting
        return `$${amount.toFixed(2)}`;
    }
};

/**
 * Calculates days until due date
 */
export const getDaysUntilDue = (dueDate: string): number => {
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Gets invoice age (days since created)
 */
export const getInvoiceAge = (invoiceDate: string): number => {
    return getDaysBetween(invoiceDate, getCurrentDate());
};

/**
 * Filters invoices by status
 */
export const filterInvoicesByStatus = (
    invoices: Invoice[],
    status: InvoiceStatus | 'all'
): Invoice[] => {
    if (status === 'all') {
        return invoices;
    }
    return invoices.filter(invoice => invoice.status === status);
};

/**
 * Filters invoices by date range
 */
export const filterInvoicesByDateRange = (
    invoices: Invoice[],
    startDate: string,
    endDate: string,
    dateField: 'date' | 'dueDate' = 'date'
): Invoice[] => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return invoices.filter(invoice => {
        const invoiceDate = new Date(invoice[dateField]);
        return invoiceDate >= start && invoiceDate <= end;
    });
};

/**
 * Searches invoices by various criteria
 */
export const searchInvoices = (
    invoices: Invoice[],
    clients: Client[],
    searchTerm: string
): Invoice[] => {
    if (!searchTerm.trim()) {
        return invoices;
    }

    const term = searchTerm.toLowerCase();

    return invoices.filter(invoice => {
        const client = clients.find(c => c.id === invoice.clientId);
        const clientName = client?.name?.toLowerCase() || '';
        const clientCompany = client?.company?.toLowerCase() || '';
        const clientEmail = client?.email?.toLowerCase() || '';
        const invoiceNumber = invoice.invoiceNumber.toLowerCase();
        const notes = invoice.notes?.toLowerCase() || '';

        // Search in item descriptions
        const itemDescriptions = invoice.items
            .map(item => item.description.toLowerCase())
            .join(' ');

        return (
            clientName.includes(term) ||
            clientCompany.includes(term) ||
            clientEmail.includes(term) ||
            invoiceNumber.includes(term) ||
            notes.includes(term) ||
            itemDescriptions.includes(term) ||
            invoice.total.toString().includes(term)
        );
    });
};

/**
 * Sorts invoices by various criteria
 */
export const sortInvoices = (
    invoices: Invoice[],
    sortBy: 'date' | 'dueDate' | 'total' | 'status' | 'invoiceNumber' | 'client',
    order: 'asc' | 'desc' = 'desc',
    clients: Client[] = []
): Invoice[] => {
    return [...invoices].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case 'date':
                comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
                break;
            case 'dueDate':
                comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                break;
            case 'total':
                comparison = a.total - b.total;
                break;
            case 'status':
                const statusOrder = { draft: 0, sent: 1, overdue: 2, paid: 3 };
                comparison = statusOrder[a.status] - statusOrder[b.status];
                break;
            case 'invoiceNumber':
                comparison = a.invoiceNumber.localeCompare(b.invoiceNumber);
                break;
            case 'client':
                const clientA = clients.find(c => c.id === a.clientId)?.name || '';
                const clientB = clients.find(c => c.id === b.clientId)?.name || '';
                comparison = clientA.localeCompare(clientB);
                break;
            default:
                return 0;
        }

        return order === 'asc' ? comparison : -comparison;
    });
};

/**
 * Creates a new invoice item with default values
 */
export const createInvoiceItem = (
    description: string = '',
    quantity: number = 1,
    rate: number = 0
): InvoiceItem => {
    return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        description,
        quantity,
        rate,
        amount: quantity * rate
    };
};

/**
 * Updates invoice item amount when quantity or rate changes
 */
export const updateInvoiceItemAmount = (item: InvoiceItem): InvoiceItem => {
    return {
        ...item,
        amount: Number((item.quantity * item.rate).toFixed(2))
    };
};

/**
 * Duplicates an invoice item
 */
export const duplicateInvoiceItem = (item: InvoiceItem): InvoiceItem => {
    return {
        ...item,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
};

/**
 * Calculates invoice statistics
 */
export const calculateInvoiceStatistics = (
    invoices: Invoice[],
    payments: Payment[]
): InvoiceStatistics => {
    const totalInvoices = invoices.length;
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const averageInvoiceValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;

    const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
    const pendingInvoices = invoices.filter(inv => inv.status === 'sent').length;
    const overdueInvoices = getOverdueInvoices(invoices).length;
    const draftInvoices = invoices.filter(inv => inv.status === 'draft').length;

    const totalPaidAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalOutstanding = invoices.reduce((sum, inv) => {
        return sum + getOutstandingAmount(inv, payments);
    }, 0);

    const paymentRate = totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0;

    return {
        totalInvoices,
        totalRevenue,
        averageInvoiceValue,
        paidInvoices,
        pendingInvoices,
        overdueInvoices,
        draftInvoices,
        totalPaidAmount,
        totalOutstanding,
        paymentRate
    };
};

/**
 * Gets invoice summary by period
 */
export const getInvoiceSummaryByPeriod = (
    invoices: Invoice[],
    period: 'week' | 'month' | 'quarter' | 'year' = 'month'
): Record<string, { count: number; total: number; paid: number }> => {
    const summary: Record<string, { count: number; total: number; paid: number }> = {};

    invoices.forEach(invoice => {
        const date = new Date(invoice.date);
        let key: string;

        switch (period) {
            case 'week':
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                key = weekStart.toISOString().split('T')[0];
                break;
            case 'month':
                key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                break;
            case 'quarter':
                const quarter = Math.floor(date.getMonth() / 3) + 1;
                key = `${date.getFullYear()}-Q${quarter}`;
                break;
            case 'year':
                key = date.getFullYear().toString();
                break;
        }

        if (!summary[key]) {
            summary[key] = { count: 0, total: 0, paid: 0 };
        }

        summary[key].count++;
        summary[key].total += invoice.total;
        if (invoice.status === 'paid') {
            summary[key].paid += invoice.total;
        }
    });

    return summary;
};

/**
 * Generates a payment schedule suggestion
 */
export const generatePaymentSchedule = (
    invoice: Invoice,
    installments: number = 3
): Array<{ dueDate: string; amount: number; description: string }> => {
    if (installments <= 1) {
        return [{
            dueDate: invoice.dueDate,
            amount: invoice.total,
            description: 'Full payment'
        }];
    }

    const installmentAmount = Math.round((invoice.total / installments) * 100) / 100;
    const lastInstallmentAmount = invoice.total - (installmentAmount * (installments - 1));

    const schedule = [];
    const invoiceDate = new Date(invoice.date);

    for (let i = 0; i < installments; i++) {
        const daysToAdd = Math.round((getDaysBetween(invoice.date, invoice.dueDate) / installments) * (i + 1));
        const dueDate = addDays(invoice.date, daysToAdd);

        schedule.push({
            dueDate,
            amount: i === installments - 1 ? lastInstallmentAmount : installmentAmount,
            description: `Payment ${i + 1} of ${installments}`
        });
    }

    return schedule;
};

/**
 * Estimates next invoice number
 */
export const getNextInvoiceNumber = (
    existingInvoices: Invoice[],
    config?: Partial<InvoiceNumberConfig>
): string => {
    return generateInvoiceNumber(existingInvoices, config);
};

/**
 * Validates invoice number format
 */
export const validateInvoiceNumber = (
    invoiceNumber: string,
    config: Partial<InvoiceNumberConfig> = {}
): { isValid: boolean; error?: string } => {
    const finalConfig = { ...DEFAULT_INVOICE_CONFIG, ...config };

    if (!invoiceNumber.trim()) {
        return { isValid: false, error: 'Invoice number is required' };
    }

    // Check if it matches the expected pattern
    const prefix = finalConfig.prefix || 'INV';
    const separator = finalConfig.separator || '-';

    const pattern = new RegExp(`^${prefix}${separator}.+`);
    if (!pattern.test(invoiceNumber)) {
        return {
            isValid: false,
            error: `Invoice number must start with "${prefix}${separator}"`
        };
    }

    return { isValid: true };
};

/**
 * Creates a duplicate invoice with new number and date
 */
export const duplicateInvoice = (
    invoice: Invoice,
    existingInvoices: Invoice[],
    config?: Partial<InvoiceNumberConfig>
): Omit<Invoice, 'id'> => {
    const newInvoiceNumber = generateInvoiceNumber(existingInvoices, config);
    const currentDate = getCurrentDate();
    const newDueDate = addDays(currentDate, 30); // 30 days from now

    return {
        ...invoice,
        invoiceNumber: newInvoiceNumber,
        date: currentDate,
        dueDate: newDueDate,
        status: 'draft',
        items: invoice.items.map(item => ({
            ...item,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
        }))
    };
};