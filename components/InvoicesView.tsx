import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Invoice, Client } from '../types';
import { styles, getStatusColor } from '../styles';

interface InvoicesViewProps {
  invoices: Invoice[];
  clients: Client[];
  onAddInvoice: () => void;
  onEditInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (id: string) => void;
  onSendInvoice: (id: string) => void;
  onAddPayment: (invoiceId: string) => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  clients,
  onAddInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onSendInvoice,
  onAddPayment
}) => {
  return (
    <View>
      {/* Header with Add Button */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Invoices</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddInvoice}>
          <Text style={styles.addButtonText}>Create Invoice</Text>
        </TouchableOpacity>
      </View>
      
      {/* Invoices List */}
      {invoices.map(invoice => {
        const client = clients.find(c => c.id === invoice.clientId);
        return (
          <View key={invoice.id} style={styles.invoiceCard}>
            <View style={styles.invoiceInfo}>
              <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
              <Text style={styles.clientName}>{client?.name}</Text>
              <Text style={styles.clientCompany}>{client?.company}</Text>
              <Text style={styles.invoiceDate}>
                Date: {new Date(invoice.date).toLocaleDateString()}
              </Text>
              <Text style={styles.invoiceDate}>
                Due: {new Date(invoice.dueDate).toLocaleDateString()}
              </Text>
              <Text style={styles.invoiceAmount}>
                ${invoice.total.toLocaleString()}
              </Text>
              <View style={[
                styles.statusBadge,
                invoice.status === 'draft' && styles.statusDraft,
                invoice.status === 'sent' && styles.statusSent,
                invoice.status === 'paid' && styles.statusPaid,
                invoice.status === 'overdue' && styles.statusOverdue,
              ]}>
                <Text style={[
                  styles.statusText,
                  invoice.status === 'draft' && styles.statusTextDraft,
                  invoice.status === 'sent' && styles.statusTextSent,
                  invoice.status === 'paid' && styles.statusTextPaid,
                  invoice.status === 'overdue' && styles.statusTextOverdue,
                ]}>
                  {invoice.status.toUpperCase()}
                </Text>
              </View>
              
              {/* Invoice Items Summary */}
              <View style={styles.invoiceItemsSummary}>
                <Text style={styles.invoiceItemsTitle}>Items:</Text>
                {invoice.items.slice(0, 2).map(item => (
                  <Text key={item.id} style={styles.invoiceItemText}>
                    • {item.description} (Qty: {item.quantity})
                  </Text>
                ))}
                {invoice.items.length > 2 && (
                  <Text style={styles.invoiceItemText}>
                    ... and {invoice.items.length - 2} more item(s)
                  </Text>
                )}
              </View>
            </View>
            
            {/* Action Buttons */}
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
              
              {(invoice.status === 'sent' || invoice.status === 'overdue') && (
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
      
      {/* Empty State */}
      {invoices.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No invoices yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Create your first invoice to get started
          </Text>
        </View>
      )}
    </View>
  );
};