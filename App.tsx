import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { EmailTemplatesScreen, EmailTemplate } from './components/EmailTemplatesScreen';

// Types
interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  address: string;
  phone: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  clientId: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes: string;
}

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: string;
  notes: string;
}




const App: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'clients' | 'invoices' | 'payments'>('dashboard');
  const [showClientModal, setShowClientModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<string | null>(null);
const [showEmailTemplates, setShowEmailTemplates] = useState(false);  
  // Initialize with sample data
  useEffect(() => {
    const sampleClients: Client[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Tech Corp',
        address: '123 Main St, City, State 12345',
        phone: '555-0123',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@startup.com',
        company: 'Startup Inc',
        address: '456 Oak Ave, City, State 67890',
        phone: '555-0456',
      },
    ];

    const sampleInvoices: Invoice[] = [
      {
        id: '1',
        clientId: '1',
        invoiceNumber: 'INV-001',
        date: '2025-07-01',
        dueDate: '2025-07-31',
        items: [
          {
            id: '1',
            description: 'Web Development',
            quantity: 40,
            rate: 100,
            amount: 4000,
          },
          {
            id: '2',
            description: 'UI/UX Design',
            quantity: 20,
            rate: 80,
            amount: 1600,
          },
        ],
        subtotal: 5600,
        tax: 560,
        total: 6160,
        status: 'sent',
        notes: 'Monthly development services',
      },
    ];

    setClients(sampleClients);
    setInvoices(sampleInvoices);
  }, []);

  // Client Management
  const saveClient = (clientData: Omit<Client, 'id'>) => {
    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? { ...clientData, id: editingClient.id } : c));
    } else {
      const newClient: Client = {
        ...clientData,
        id: Date.now().toString(),
      };
      setClients([...clients, newClient]);
    }
    setShowClientModal(false);
    setEditingClient(null);
  };

  const deleteClient = (id: string) => {
    Alert.alert(
      'Delete Client',
      'Are you sure you want to delete this client?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => setClients(clients.filter(c => c.id !== id)) }
      ]
    );
  };

  // Invoice Management
  const saveInvoice = (invoiceData: Omit<Invoice, 'id'>) => {
    if (editingInvoice) {
      setInvoices(invoices.map(i => i.id === editingInvoice.id ? { ...invoiceData, id: editingInvoice.id } : i));
    } else {
      const newInvoice: Invoice = {
        ...invoiceData,
        id: Date.now().toString(),
      };
      setInvoices([...invoices, newInvoice]);
    }
    setShowInvoiceModal(false);
    setEditingInvoice(null);
  };

  const deleteInvoice = (id: string) => {
    Alert.alert(
      'Delete Invoice',
      'Are you sure you want to delete this invoice?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => setInvoices(invoices.filter(i => i.id !== id)) }
      ]
    );
  };

  const sendInvoice = (invoiceId: string) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    const client = clients.find(c => c.id === invoice?.clientId);
    
    if (invoice && client) {
      Alert.alert(
        'Invoice Sent',
        `Invoice ${invoice.invoiceNumber} has been sent to ${client.email}`,
        [{ text: 'OK' }]
      );
      
      setInvoices(invoices.map(i => 
        i.id === invoiceId ? { ...i, status: 'sent' } : i
      ));
    }
  };

  // Payment Management
  const addPayment = (paymentData: Omit<Payment, 'id'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: Date.now().toString(),
    };
    setPayments([...payments, newPayment]);
    
    // Update invoice status if fully paid
    const invoice = invoices.find(i => i.id === paymentData.invoiceId);
    if (invoice) {
      const totalPaid = payments
        .filter(p => p.invoiceId === paymentData.invoiceId)
        .reduce((sum, p) => sum + p.amount, 0) + paymentData.amount;
      
      if (totalPaid >= invoice.total) {
        setInvoices(invoices.map(i => 
          i.id === paymentData.invoiceId ? { ...i, status: 'paid' } : i
        ));
      }
    }
    
    setShowPaymentModal(false);
    setSelectedInvoiceForPayment(null);
  };

  // Dashboard Stats
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
  const pendingInvoices = invoices.filter(inv => inv.status === 'sent').length;
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Invoice Manager</Text>
      </View>

      {/* Navigation */}
      <View style={styles.nav}>
        <TouchableOpacity 
          style={[styles.navButton, currentView === 'dashboard' && styles.navButtonActive]}
          onPress={() => setCurrentView('dashboard')}
        >
          <Text style={[styles.navButtonText, currentView === 'dashboard' && styles.navButtonTextActive]}>
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, currentView === 'clients' && styles.navButtonActive]}
          onPress={() => setCurrentView('clients')}
        >
          <Text style={[styles.navButtonText, currentView === 'clients' && styles.navButtonTextActive]}>
            Clients
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, currentView === 'invoices' && styles.navButtonActive]}
          onPress={() => setCurrentView('invoices')}
        >
          <Text style={[styles.navButtonText, currentView === 'invoices' && styles.navButtonTextActive]}>
            Invoices
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, currentView === 'payments' && styles.navButtonActive]}
          onPress={() => setCurrentView('payments')}
        >
          <Text style={[styles.navButtonText, currentView === 'payments' && styles.navButtonTextActive]}>
            Payments
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content}>
        {currentView === 'dashboard' && (
          <DashboardView 
            totalRevenue={totalRevenue}
            paidInvoices={paidInvoices}
            pendingInvoices={pendingInvoices}
            totalPaid={totalPaid}
            recentInvoices={invoices.slice(-5)}
            clients={clients}
          />
        )}
        
        {currentView === 'clients' && (
          <ClientsView 
            clients={clients}
            onAddClient={() => setShowClientModal(true)}
            onEditClient={(client) => {
              setEditingClient(client);
              setShowClientModal(true);
            }}
            onDeleteClient={deleteClient}
          />
        )}
        
        {currentView === 'invoices' && (
          <InvoicesView 
            invoices={invoices}
            clients={clients}
            onAddInvoice={() => setShowInvoiceModal(true)}
            onEditInvoice={(invoice) => {
              setEditingInvoice(invoice);
              setShowInvoiceModal(true);
            }}
            onDeleteInvoice={deleteInvoice}
            onSendInvoice={sendInvoice}
            onAddPayment={(invoiceId) => {
              setSelectedInvoiceForPayment(invoiceId);
              setShowPaymentModal(true);
            }}
          />
        )}
        
        {currentView === 'payments' && (
          <PaymentsView 
            payments={payments}
            invoices={invoices}
            clients={clients}
          />
        )}
      </ScrollView>

      {/* Modals */}
      <ClientModal
        visible={showClientModal}
        client={editingClient}
        onSave={saveClient}
        onCancel={() => {
          setShowClientModal(false);
          setEditingClient(null);
        }}
      />
      
      <InvoiceModal
        visible={showInvoiceModal}
        invoice={editingInvoice}
        clients={clients}
        onSave={saveInvoice}
        onCancel={() => {
          setShowInvoiceModal(false);
          setEditingInvoice(null);
        }}
      />
      
      <PaymentModal
        visible={showPaymentModal}
        invoiceId={selectedInvoiceForPayment}
        onSave={addPayment}
        onCancel={() => {
          setShowPaymentModal(false);
          setSelectedInvoiceForPayment(null);
        }}
      />
    </View>
  );
};

// Dashboard Component
const DashboardView: React.FC<{
  totalRevenue: number;
  paidInvoices: number;
  pendingInvoices: number;
  totalPaid: number;
  recentInvoices: Invoice[];
  clients: Client[];
}> = ({ totalRevenue, paidInvoices, pendingInvoices, totalPaid, recentInvoices, clients }) => (
  <View>
    <Text style={styles.sectionTitle}>Dashboard</Text>
    
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>${totalRevenue.toLocaleString()}</Text>
        <Text style={styles.statLabel}>Total Revenue</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>${totalPaid.toLocaleString()}</Text>
        <Text style={styles.statLabel}>Paid Amount</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{paidInvoices}</Text>
        <Text style={styles.statLabel}>Paid Invoices</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{pendingInvoices}</Text>
        <Text style={styles.statLabel}>Pending Invoices</Text>
      </View>
    </View>

    <Text style={styles.sectionTitle}>Recent Invoices</Text>
    {recentInvoices.map(invoice => {
      const client = clients.find(c => c.id === invoice.clientId);
      return (
        <View key={invoice.id} style={styles.invoiceCard}>
          <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
          <Text style={styles.clientName}>{client?.name}</Text>
          <Text style={styles.invoiceAmount}>${invoice.total.toLocaleString()}</Text>
          <Text style={[styles.invoiceStatus, { color: getStatusColor(invoice.status) }]}>
            {invoice.status.toUpperCase()}
          </Text>
        </View>
      );
    })}
  </View>
);

// Clients Component
const ClientsView: React.FC<{
  clients: Client[];
  onAddClient: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}> = ({ clients, onAddClient, onEditClient, onDeleteClient }) => (
  <View>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Clients</Text>
      <TouchableOpacity style={styles.addButton} onPress={onAddClient}>
        <Text style={styles.addButtonText}>Add Client</Text>
      </TouchableOpacity>
    </View>
    
    {clients.map(client => (
      <View key={client.id} style={styles.clientCard}>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{client.name}</Text>
          <Text style={styles.clientCompany}>{client.company}</Text>
          <Text style={styles.clientEmail}>{client.email}</Text>
        </View>
        <View style={styles.clientActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => onEditClient(client)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => onDeleteClient(client.id)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    ))}
  </View>
);

// Invoices Component
const InvoicesView: React.FC<{
  invoices: Invoice[];
  clients: Client[];
  onAddInvoice: () => void;
  onEditInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (id: string) => void;
  onSendInvoice: (id: string) => void;
  onAddPayment: (invoiceId: string) => void;
}> = ({ invoices, clients, onAddInvoice, onEditInvoice, onDeleteInvoice, onSendInvoice, onAddPayment }) => (
  <View>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Invoices</Text>
      <TouchableOpacity style={styles.addButton} onPress={onAddInvoice}>
        <Text style={styles.addButtonText}>Create Invoice</Text>
      </TouchableOpacity>
    </View>
    
    {invoices.map(invoice => {
      const client = clients.find(c => c.id === invoice.clientId);
      return (
        <View key={invoice.id} style={styles.invoiceCard}>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
            <Text style={styles.clientName}>{client?.name}</Text>
            <Text style={styles.invoiceDate}>Due: {invoice.dueDate}</Text>
            <Text style={styles.invoiceAmount}>${invoice.total.toLocaleString()}</Text>
            <Text style={[styles.invoiceStatus, { color: getStatusColor(invoice.status) }]}>
              {invoice.status.toUpperCase()}
            </Text>
          </View>
          <View style={styles.invoiceActions}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => onEditInvoice(invoice)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            {invoice.status === 'draft' && (
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={() => onSendInvoice(invoice.id)}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            )}
            {invoice.status === 'sent' && (
              <TouchableOpacity 
                style={styles.paymentButton}
                onPress={() => onAddPayment(invoice.id)}
              >
                <Text style={styles.paymentButtonText}>Add Payment</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => onDeleteInvoice(invoice.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    })}
  </View>
);

// Payments Component
const PaymentsView: React.FC<{
  payments: Payment[];
  invoices: Invoice[];
  clients: Client[];
}> = ({ payments, invoices, clients }) => (
  <View>
    <Text style={styles.sectionTitle}>Payments</Text>
    
    {payments.map(payment => {
      const invoice = invoices.find(i => i.id === payment.invoiceId);
      const client = clients.find(c => c.id === invoice?.clientId);
      return (
        <View key={payment.id} style={styles.paymentCard}>
          <Text style={styles.invoiceNumber}>{invoice?.invoiceNumber}</Text>
          <Text style={styles.clientName}>{client?.name}</Text>
          <Text style={styles.paymentAmount}>${payment.amount.toLocaleString()}</Text>
          <Text style={styles.paymentDate}>{payment.date}</Text>
          <Text style={styles.paymentMethod}>{payment.method}</Text>
        </View>
      );
    })}
  </View>
);

// Modal Components
const ClientModal: React.FC<{
  visible: boolean;
  client: Client | null;
  onSave: (client: Omit<Client, 'id'>) => void;
  onCancel: () => void;
}> = ({ visible, client, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (client) {
      setName(client.name);
      setEmail(client.email);
      setCompany(client.company);
      setAddress(client.address);
      setPhone(client.phone);
    } else {
      setName('');
      setEmail('');
      setCompany('');
      setAddress('');
      setPhone('');
    }
  }, [client]);

  const handleSave = () => {
    if (name.trim() && email.trim()) {
      onSave({ name, email, company, address, phone });
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {client ? 'Edit Client' : 'Add Client'}
          </Text>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Name *"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email *"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Company"
            value={company}
            onChangeText={setCompany}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </ScrollView>
        
        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const InvoiceModal: React.FC<{
  visible: boolean;
  invoice: Invoice | null;
  clients: Client[];
  onSave: (invoice: Omit<Invoice, 'id'>) => void;
  onCancel: () => void;
}> = ({ visible, invoice, clients, onSave, onCancel }) => {
  const [clientId, setClientId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [date, setDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (invoice) {
      setClientId(invoice.clientId);
      setInvoiceNumber(invoice.invoiceNumber);
      setDate(invoice.date);
      setDueDate(invoice.dueDate);
      setItems(invoice.items);
      setNotes(invoice.notes);
    } else {
      setClientId('');
      setInvoiceNumber(`INV-${Date.now().toString().slice(-6)}`);
      setDate(new Date().toISOString().split('T')[0]);
      setDueDate('');
      setItems([]);
      setNotes('');
    }
  }, [invoice]);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleSave = () => {
    if (clientId && invoiceNumber && date && dueDate && items.length > 0) {
      onSave({
        clientId,
        invoiceNumber,
        date,
        dueDate,
        items,
        subtotal,
        tax,
        total,
        status: 'draft',
        notes,
      });
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {invoice ? 'Edit Invoice' : 'Create Invoice'}
          </Text>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <Text style={styles.inputLabel}>Client</Text>
          <View style={styles.pickerContainer}>
            {clients.map(client => (
              <TouchableOpacity
                key={client.id}
                style={[
                  styles.pickerOption,
                  clientId === client.id && styles.pickerOptionSelected
                ]}
                onPress={() => setClientId(client.id)}
              >
                <Text style={styles.pickerOptionText}>{client.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Invoice Number"
            value={invoiceNumber}
            onChangeText={setInvoiceNumber}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Due Date (YYYY-MM-DD)"
            value={dueDate}
            onChangeText={setDueDate}
          />
          
          <Text style={styles.inputLabel}>Items</Text>
          {items.map(item => (
            <View key={item.id} style={styles.itemContainer}>
              <TextInput
                style={styles.itemInput}
                placeholder="Description"
                value={item.description}
                onChangeText={(text) => updateItem(item.id, 'description', text)}
              />
              <View style={styles.itemRow}>
                <TextInput
                  style={styles.itemNumberInput}
                  placeholder="Qty"
                  value={item.quantity.toString()}
                  onChangeText={(text) => updateItem(item.id, 'quantity', parseInt(text) || 0)}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.itemNumberInput}
                  placeholder="Rate"
                  value={item.rate.toString()}
                  onChangeText={(text) => updateItem(item.id, 'rate', parseFloat(text) || 0)}
                  keyboardType="numeric"
                />
                <Text style={styles.itemAmount}>${item.amount.toFixed(2)}</Text>
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                  <Text style={styles.removeItemText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          
          <TouchableOpacity style={styles.addItemButton} onPress={addItem}>
            <Text style={styles.addItemButtonText}>Add Item</Text>
          </TouchableOpacity>
          
          <View style={styles.totalsContainer}>
            <Text style={styles.totalText}>Subtotal: ${subtotal.toFixed(2)}</Text>
            <Text style={styles.totalText}>Tax: ${tax.toFixed(2)}</Text>
            <Text style={styles.totalTextBold}>Total: ${total.toFixed(2)}</Text>
          </View>
          
          <TextInput
            style={styles.textArea}
            placeholder="Notes"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </ScrollView>
        
        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const PaymentModal: React.FC<{
  visible: boolean;
  invoiceId: string | null;
  onSave: (payment: Omit<Payment, 'id'>) => void;
  onCancel: () => void;
}> = ({ visible, invoiceId, onSave, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [method, setMethod] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (visible) {
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setMethod('');
      setNotes('');
    }
  }, [visible]);

  const handleSave = () => {
    if (invoiceId && amount && date && method) {
      onSave({
        invoiceId,
        amount: parseFloat(amount),
        date,
        method,
        notes,
      });
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Add Payment</Text>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
          />
          
          <Text style={styles.inputLabel}>Payment Method</Text>
          <View style={styles.pickerContainer}>
            {['Cash', 'Check', 'Bank Transfer', 'Credit Card', 'PayPal'].map(paymentMethod => (
              <TouchableOpacity
                key={paymentMethod}
                style={[
                  styles.pickerOption,
                  method === paymentMethod && styles.pickerOptionSelected
                ]}
                onPress={() => setMethod(paymentMethod)}
              >
                <Text style={styles.pickerOptionText}>{paymentMethod}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TextInput
            style={styles.textArea}
            placeholder="Notes"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </ScrollView>
        
        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Utility Functions
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'paid':
      return '#4CAF50';
    case 'sent':
      return '#FF9800';
    case 'overdue':
      return '#F44336';
    default:
      return '#9E9E9E';
  }
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 44 : 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  nav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  navButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  navButtonText: {
    fontSize: 14,
    color: '#666',
  },
  navButtonTextActive: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 4,
    flex: 1,
    minWidth: 150,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  clientCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  clientCompany: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  clientEmail: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  clientActions: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  invoiceCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  invoiceInfo: {
    marginBottom: 12,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  invoiceDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  invoiceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginTop: 4,
  },
  invoiceStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  invoiceActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sendButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  paymentButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  paymentButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  paymentCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 4,
  },
  paymentDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  paymentMethod: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    backgroundColor: '#2196F3',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 44 : 16,
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#9E9E9E',
    paddingVertical: 12,
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 4,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  pickerContainer: {
    marginBottom: 12,
  },
  pickerOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 4,
  },
  pickerOptionSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  pickerOptionText: {
    fontSize: 16,
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  itemInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    fontSize: 14,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemNumberInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    width: 60,
    marginRight: 8,
    textAlign: 'center',
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
    minWidth: 80,
  },
  removeItemText: {
    color: '#F44336',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addItemButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  addItemButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  totalsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 16,
    marginBottom: 16,
  },
  totalText: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'right',
  },
  totalTextBold: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'right',
    color: '#2196F3',
  },
});

export default App;