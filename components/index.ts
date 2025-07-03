// Component exports for easier importing
export { Dashboard } from './Dashboard';
export { ClientsView } from './ClientsView';
export { InvoicesView } from './InvoicesView';
export { PaymentsView } from './PaymentsView';
export { ClientModal } from './ClientModal';
export { InvoiceModal } from './InvoiceModal';
export { PaymentModal } from './PaymentModal';
export { Navigation } from './Navigation';

// Re-export types for convenience
export type {
    Client,
    Invoice,
    InvoiceItem,
    Payment,
    PaymentMethod,
    InvoiceStatus,
    ViewType
} from '../types';