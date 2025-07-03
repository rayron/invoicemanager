// Client Types
export interface Client {
    id: string;
    name: string;
    email: string;
    company: string;
    address: string;
    phone: string;
    createdAt?: string;
    updatedAt?: string;
}

// Invoice Types
export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
    id: string;
    clientId: string;
    invoiceNumber: string;
    date: string;
    dueDate: string;
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: InvoiceStatus;
    notes: string;
    createdAt?: string;
    updatedAt?: string;
    sentAt?: string;
    paidAt?: string;
}

// Payment Types
export type PaymentMethod = 'cash' | 'check' | 'bank_transfer' | 'credit_card' | 'paypal' | 'other';

export interface Payment {
    id: string;
    invoiceId: string;
    amount: number;
    date: string;
    method: PaymentMethod;
    notes: string;
    reference?: string;
    createdAt?: string;
}

// Business Types
export interface BusinessInfo {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    taxId?: string;
    logo?: string;
}

// App State Types
export interface AppState {
    clients: Client[];
    invoices: Invoice[];
    payments: Payment[];
    business: BusinessInfo;
}

// Modal Props Types
export interface ClientModalProps {
    visible: boolean;
    client: Client | null;
    onSave: (client: Omit<Client, 'id'>) => void;
    onCancel: () => void;
}

export interface InvoiceModalProps {
    visible: boolean;
    invoice: Invoice | null;
    clients: Client[];
    onSave: (invoice: Omit<Invoice, 'id'>) => void;
    onCancel: () => void;
}

export interface PaymentModalProps {
    visible: boolean;
    invoiceId: string | null;
    onSave: (payment: Omit<Payment, 'id'>) => void;
    onCancel: () => void;
}

// View Props Types
export interface DashboardViewProps {
    totalRevenue: number;
    paidInvoices: number;
    pendingInvoices: number;
    totalPaid: number;
    recentInvoices: Invoice[];
    clients: Client[];
}

export interface ClientsViewProps {
    clients: Client[];
    onAddClient: () => void;
    onEditClient: (client: Client) => void;
    onDeleteClient: (id: string) => void;
}

export interface InvoicesViewProps {
    invoices: Invoice[];
    clients: Client[];
    onAddInvoice: () => void;
    onEditInvoice: (invoice: Invoice) => void;
    onDeleteInvoice: (id: string) => void;
    onSendInvoice: (id: string) => void;
    onAddPayment: (invoiceId: string) => void;
}

export interface PaymentsViewProps {
    payments: Payment[];
    invoices: Invoice[];
    clients: Client[];
}

// Navigation Types
export type ViewType = 'dashboard' | 'clients' | 'invoices' | 'payments';

// Utility Types
export interface ValidationError {
    field: string;
    message: string;
}

export interface FormValidation {
    isValid: boolean;
    errors: ValidationError[];
}

// Email Types
export interface EmailData {
    to: string;
    subject: string;
    body: string;
    attachments?: string[];
}

// Statistics Types
export interface DashboardStats {
    totalRevenue: number;
    totalPaid: number;
    totalOutstanding: number;
    invoiceCount: number;
    paidInvoiceCount: number;
    pendingInvoiceCount: number;
    overdueInvoiceCount: number;
    clientCount: number;
    averageInvoiceValue: number;
}