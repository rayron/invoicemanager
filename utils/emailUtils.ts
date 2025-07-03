import * as MailComposer from 'expo-mail-composer';
import { Alert, Platform, Linking } from 'react-native';
import { Invoice, Client, BusinessInfo } from '../types';
import { formatDate } from './dateUtils';

export interface EmailOptions {
    invoice: Invoice;
    client: Client;
    business?: BusinessInfo;
}

export interface EmailTemplate {
    subject: string;
    body: string;
    isHtml?: boolean;
}

export interface EmailValidationResult {
    isValid: boolean;
    error?: string;
}

// Default business information
const DEFAULT_BUSINESS: BusinessInfo = {
    name: 'Your Software Business',
    email: 'billing@yourbusiness.com',
    phone: '+1 (555) 123-0000',
    address: '123 Business Street, City, State 12345',
    website: 'www.yourbusiness.com',
    taxId: '12-3456789',
};

/**
 * Validates an email address format
 */
export const validateEmailAddress = (email: string): EmailValidationResult => {
    if (!email || !email.trim()) {
        return { isValid: false, error: 'Email address is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email.trim());

    return {
        isValid,
        error: isValid ? undefined : 'Please enter a valid email address'
    };
};

/**
 * Generates invoice email subject line
 */
export const generateInvoiceEmailSubject = (
    invoiceNumber: string,
    businessName?: string
): string => {
    const company = businessName || DEFAULT_BUSINESS.name;
    return `Invoice ${invoiceNumber} from ${company}`;
};

/**
 * Generates professional invoice email body
 */
export const generateInvoiceEmailBody = (
    invoice: Invoice,
    client: Client,
    business?: BusinessInfo
): string => {
    const businessInfo = { ...DEFAULT_BUSINESS, ...business };

    const itemsList = invoice.items
        .map(item => `• ${item.description} - Qty: ${item.quantity} @ $${item.rate.toFixed(2)} = $${item.amount.toFixed(2)}`)
        .join('\n');

    const paymentInstructions = generatePaymentInstructions(businessInfo);

    return `
Dear ${client.name},

I hope this email finds you well. Please find the details for invoice ${invoice.invoiceNumber} below.

INVOICE DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Invoice Number: ${invoice.invoiceNumber}
Date: ${formatDate(invoice.date, 'long')}
Due Date: ${formatDate(invoice.dueDate, 'long')}

Bill To:
${client.name}
${client.company ? client.company : ''}
${client.email}

ITEMS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${itemsList}

SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal: $${invoice.subtotal.toFixed(2)}
Tax: $${invoice.tax.toFixed(2)}
TOTAL: $${invoice.total.toFixed(2)}

${invoice.notes ? `\nNOTES:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${invoice.notes}\n` : ''}
PAYMENT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${paymentInstructions}

If you have any questions about this invoice, please don't hesitate to contact us.

Thank you for your business!

Best regards,
${businessInfo.name}
${businessInfo.phone ? `Phone: ${businessInfo.phone}` : ''}
${businessInfo.email ? `Email: ${businessInfo.email}` : ''}
${businessInfo.website ? `Website: ${businessInfo.website}` : ''}
${businessInfo.address ? `Address: ${businessInfo.address}` : ''}
  `.trim();
};

/**
 * Generates HTML email body for better formatting
 */
export const generateInvoiceEmailBodyHTML = (
    invoice: Invoice,
    client: Client,
    business?: BusinessInfo
): string => {
    const businessInfo = { ...DEFAULT_BUSINESS, ...business };

    const itemsTable = invoice.items
        .map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.description}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.rate.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$${item.amount.toFixed(2)}</td>
      </tr>
    `)
        .join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2196F3; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .invoice-details { background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .client-info { margin-bottom: 20px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table th { background-color: #2196F3; color: white; padding: 12px; text-align: left; }
        .totals { background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .total-final { font-weight: bold; font-size: 18px; color: #2196F3; border-top: 2px solid #2196F3; padding-top: 8px; }
        .footer { background-color: #f8f9fa; padding: 15px; border-radius: 8px; font-size: 14px; }
        .notes { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${businessInfo.name}</h1>
        <p>Invoice ${invoice.invoiceNumber}</p>
      </div>

      <div class="invoice-details">
        <div style="display: flex; justify-content: space-between;">
          <div>
            <strong>Invoice Number:</strong> ${invoice.invoiceNumber}<br>
            <strong>Date:</strong> ${formatDate(invoice.date, 'long')}<br>
            <strong>Due Date:</strong> ${formatDate(invoice.dueDate, 'long')}
          </div>
        </div>
      </div>

      <div class="client-info">
        <h3>Bill To:</h3>
        <strong>${client.name}</strong><br>
        ${client.company ? `${client.company}<br>` : ''}
        ${client.email}<br>
        ${client.address ? `${client.address}` : ''}
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Rate</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsTable}
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>$${invoice.subtotal.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Tax:</span>
          <span>$${invoice.tax.toFixed(2)}</span>
        </div>
        <div class="total-row total-final">
          <span>Total:</span>
          <span>$${invoice.total.toFixed(2)}</span>
        </div>
      </div>

      ${invoice.notes ? `
        <div class="notes">
          <h4>Notes:</h4>
          <p>${invoice.notes}</p>
        </div>
      ` : ''}

      <div class="footer">
        <h4>Payment Information:</h4>
        <p>${generatePaymentInstructions(businessInfo)}</p>
        
        <hr style="margin: 20px 0;">
        
        <p>
          <strong>${businessInfo.name}</strong><br>
          ${businessInfo.phone ? `Phone: ${businessInfo.phone}<br>` : ''}
          ${businessInfo.email ? `Email: ${businessInfo.email}<br>` : ''}
          ${businessInfo.website ? `Website: ${businessInfo.website}<br>` : ''}
          ${businessInfo.address ? `Address: ${businessInfo.address}` : ''}
        </p>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generates payment instructions
 */
export const generatePaymentInstructions = (business: BusinessInfo): string => {
    return `
Please remit payment by the due date above. Payment can be made via:

• Bank Transfer: Contact us for banking details
• Check: Make payable to "${business.name}"
• Online Payment: Visit ${business.website || 'our website'} for online payment options
• Credit Card: Contact us to process payment by phone

For any payment questions, please contact us at ${business.email || business.phone}.
  `.trim();
};

/**
 * Sends invoice email using device's email app
 */
export const sendInvoiceEmail = async (options: EmailOptions): Promise<boolean> => {
    try {
        const { invoice, client, business } = options;

        // Validate email address
        const emailValidation = validateEmailAddress(client.email);
        if (!emailValidation.isValid) {
            Alert.alert('Invalid Email', emailValidation.error || 'Invalid email address');
            return false;
        }

        // Check if mail is available
        const isAvailable = await MailComposer.isAvailableAsync();

        if (!isAvailable) {
            // Fallback to mailto link
            return await sendEmailViaMailto(options);
        }

        const subject = generateInvoiceEmailSubject(invoice.invoiceNumber, business?.name);
        const body = generateInvoiceEmailBody(invoice, client, business);
        const htmlBody = generateInvoiceEmailBodyHTML(invoice, client, business);

        const mailOptions: MailComposer.MailComposerOptions = {
            recipients: [client.email],
            subject,
            body: htmlBody,
            isHtml: true,
        };

        const result = await MailComposer.composeAsync(mailOptions);

        if (result.status === MailComposer.MailComposerStatus.SENT) {
            Alert.alert(
                'Email Sent',
                `Invoice ${invoice.invoiceNumber} has been sent to ${client.email}`,
                [{ text: 'OK' }]
            );
            return true;
        } else if (result.status === MailComposer.MailComposerStatus.CANCELLED) {
            // User cancelled, don't show an error
            return false;
        } else {
            Alert.alert(
                'Email Failed',
                'There was an issue sending the email. Please try again.',
                [{ text: 'OK' }]
            );
            return false;
        }
    } catch (error) {
        console.error('Error sending email:', error);
        Alert.alert(
            'Email Error',
            'Failed to send email. Please check your email configuration.',
            [{ text: 'OK' }]
        );
        return false;
    }
};

/**
 * Fallback method using mailto links (works on all platforms)
 */
export const sendEmailViaMailto = async (options: EmailOptions): Promise<boolean> => {
    try {
        const { invoice, client, business } = options;

        const subject = generateInvoiceEmailSubject(invoice.invoiceNumber, business?.name);
        const body = generateInvoiceEmailBody(invoice, client, business);

        const mailtoUrl = generateMailtoUrl(client.email, subject, body);

        const canOpen = await Linking.canOpenURL(mailtoUrl);
        if (canOpen) {
            await Linking.openURL(mailtoUrl);
            return true;
        } else {
            Alert.alert(
                'Email Not Available',
                'No email app is configured on this device. Please set up an email account.',
                [{ text: 'OK' }]
            );
            return false;
        }
    } catch (error) {
        console.error('Error opening mailto link:', error);
        Alert.alert(
            'Email Error',
            'Unable to open email app. Please check your device settings.',
            [{ text: 'OK' }]
        );
        return false;
    }
};

/**
 * Generates a mailto URL
 */
export const generateMailtoUrl = (
    email: string,
    subject: string,
    body: string
): string => {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
};

/**
 * Sends a payment reminder email
 */
export const sendReminderEmail = async (
    invoice: Invoice,
    client: Client,
    business?: BusinessInfo
): Promise<boolean> => {
    const businessInfo = { ...DEFAULT_BUSINESS, ...business };

    const reminderSubject = `Payment Reminder: Invoice ${invoice.invoiceNumber} - ${businessInfo.name}`;
    const daysOverdue = Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24));

    const reminderBody = `
Dear ${client.name},

This is a friendly reminder that invoice ${invoice.invoiceNumber} is now ${daysOverdue} day(s) overdue.

INVOICE DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Invoice Number: ${invoice.invoiceNumber}
Original Due Date: ${formatDate(invoice.dueDate, 'long')}
Amount Due: $${invoice.total.toFixed(2)}
Days Overdue: ${daysOverdue}

Please remit payment at your earliest convenience. If you have already sent payment, please disregard this notice.

If you have any questions or concerns about this invoice, please contact us immediately at ${businessInfo.email} or ${businessInfo.phone}.

${generatePaymentInstructions(businessInfo)}

Thank you for your prompt attention to this matter.

Best regards,
${businessInfo.name}
${businessInfo.email}
${businessInfo.phone}
  `.trim();

    try {
        const isAvailable = await MailComposer.isAvailableAsync();

        if (!isAvailable) {
            const mailtoUrl = generateMailtoUrl(client.email, reminderSubject, reminderBody);
            const canOpen = await Linking.canOpenURL(mailtoUrl);
            if (canOpen) {
                await Linking.openURL(mailtoUrl);
                return true;
            }
            return false;
        }

        const result = await MailComposer.composeAsync({
            recipients: [client.email],
            subject: reminderSubject,
            body: reminderBody,
            isHtml: false,
        });

        return result.status === MailComposer.MailComposerStatus.SENT;
    } catch (error) {
        console.error('Error sending reminder email:', error);
        return false;
    }
};

/**
 * Sends a thank you email after payment
 */
export const sendPaymentThankYouEmail = async (
    invoice: Invoice,
    client: Client,
    paymentAmount: number,
    business?: BusinessInfo
): Promise<boolean> => {
    const businessInfo = { ...DEFAULT_BUSINESS, ...business };

    const subject = `Payment Received - Invoice ${invoice.invoiceNumber} - ${businessInfo.name}`;
    const body = `
Dear ${client.name},

Thank you for your payment! We have received your payment of $${paymentAmount.toFixed(2)} for invoice ${invoice.invoiceNumber}.

PAYMENT CONFIRMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Invoice Number: ${invoice.invoiceNumber}
Payment Amount: $${paymentAmount.toFixed(2)}
Invoice Total: $${invoice.total.toFixed(2)}
Payment Date: ${formatDate(new Date().toISOString(), 'long')}
Status: ${paymentAmount >= invoice.total ? 'PAID IN FULL' : 'PARTIAL PAYMENT'}

${paymentAmount < invoice.total ? `
Outstanding Balance: $${(invoice.total - paymentAmount).toFixed(2)}
` : ''}

We appreciate your business and look forward to working with you again.

If you have any questions about this payment or need a receipt, please contact us at ${businessInfo.email}.

Best regards,
${businessInfo.name}
${businessInfo.email}
${businessInfo.phone}
  `.trim();

    try {
        const options: EmailOptions = {
            invoice,
            client,
            business: businessInfo,
        };

        // Use the same sending mechanism as invoice emails
        const isAvailable = await MailComposer.isAvailableAsync();

        if (!isAvailable) {
            const mailtoUrl = generateMailtoUrl(client.email, subject, body);
            const canOpen = await Linking.canOpenURL(mailtoUrl);
            if (canOpen) {
                await Linking.openURL(mailtoUrl);
                return true;
            }
            return false;
        }

        const result = await MailComposer.composeAsync({
            recipients: [client.email],
            subject,
            body,
            isHtml: false,
        });

        return result.status === MailComposer.MailComposerStatus.SENT;
    } catch (error) {
        console.error('Error sending thank you email:', error);
        return false;
    }
};

/**
 * Validates email configuration
 */
export const validateEmailConfiguration = async (): Promise<{
    isConfigured: boolean;
    method: 'native' | 'mailto' | 'none';
    error?: string;
}> => {
    try {
        const isMailAvailable = await MailComposer.isAvailableAsync();

        if (isMailAvailable) {
            return {
                isConfigured: true,
                method: 'native',
            };
        }

        // Test if mailto links work
        const testMailto = 'mailto:test@example.com';
        const canOpenMailto = await Linking.canOpenURL(testMailto);

        if (canOpenMailto) {
            return {
                isConfigured: true,
                method: 'mailto',
            };
        }

        return {
            isConfigured: false,
            method: 'none',
            error: 'No email capability detected on this device',
        };
    } catch (error) {
        return {
            isConfigured: false,
            method: 'none',
            error: 'Error checking email configuration',
        };
    }
};

/**
 * Formats multiple email addresses
 */
export const formatEmailList = (emails: string[]): string[] => {
    return emails
        .map(email => email.trim().toLowerCase())
        .filter(email => validateEmailAddress(email).isValid);
};

/**
 * Creates email template
 */
export const createEmailTemplate = (
    templateType: 'invoice' | 'reminder' | 'thank_you',
    variables: Record<string, any>
): EmailTemplate => {
    switch (templateType) {
        case 'invoice':
            return {
                subject: generateInvoiceEmailSubject(variables.invoiceNumber, variables.businessName),
                body: generateInvoiceEmailBody(variables.invoice, variables.client, variables.business),
                isHtml: false,
            };
        case 'reminder':
            return {
                subject: `Payment Reminder: Invoice ${variables.invoiceNumber}`,
                body: `Payment reminder for invoice ${variables.invoiceNumber}`,
                isHtml: false,
            };
        case 'thank_you':
            return {
                subject: `Payment Received - Invoice ${variables.invoiceNumber}`,
                body: `Thank you for your payment of $${variables.amount}`,
                isHtml: false,
            };
        default:
            throw new Error(`Unknown template type: ${templateType}`);
    }
};