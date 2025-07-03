import React from 'react';
import { View, Text } from 'react-native';
import { Payment, Invoice, Client } from '../types';
import { styles } from '../styles';
import { formatDate } from '../utils/dateUtils';

interface PaymentsViewProps {
  payments: Payment[];
  invoices: Invoice[];
  clients: Client[];
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  payments,
  invoices,
  clients
}) => {
  // Calculate payment statistics
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paymentCount = payments.length;
  const averagePayment = paymentCount > 0 ? totalPayments / paymentCount : 0;

  // Group payments by month for better organization
  const paymentsByMonth = payments.reduce((groups, payment) => {
    const month = new Date(payment.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
    if (!groups[month]) {
      groups[month] = [];
    }
    groups[month].push(payment);
    return groups;
  }, {} as Record<string, Payment[]>);

  return (
    <View>
      <Text style={styles.sectionTitle}>Payments</Text>
      
      {/* Payment Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${totalPayments.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Received</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{paymentCount}</Text>
          <Text style={styles.statLabel}>Total Payments</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${averagePayment.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Average Payment</Text>
        </View>
      </View>

      {/* Payments by Month */}
      {Object.entries(paymentsByMonth)
        .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
        .map(([month, monthPayments]) => (
          <View key={month} style={styles.monthSection}>
            <Text style={styles.monthTitle}>{month}</Text>
            <Text style={styles.monthSubtitle}>
              {monthPayments.length} payment(s) • $
              {monthPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
            </Text>
            
            {monthPayments.map(payment => {
              const invoice = invoices.find(i => i.id === payment.invoiceId);
              const client = clients.find(c => c.id === invoice?.clientId);
              
              return (
                <View key={payment.id} style={styles.paymentCard}>
                  <View style={styles.paymentHeader}>
                    <Text style={styles.invoiceNumber}>
                      {invoice?.invoiceNumber || 'Unknown Invoice'}
                    </Text>
                    <Text style={styles.paymentAmount}>
                      ${payment.amount.toLocaleString()}
                    </Text>
                  </View>
                  
                  <View style={styles.paymentDetails}>
                    <Text style={styles.clientName}>{client?.name || 'Unknown Client'}</Text>
                    <Text style={styles.clientCompany}>{client?.company}</Text>
                  </View>
                  
                  <View style={styles.paymentMeta}>
                    <Text style={styles.paymentDate}>
                      Date: {formatDate(payment.date, 'long')}
                    </Text>
                    <Text style={styles.paymentMethod}>
                      Method: {payment.method}
                    </Text>
                    {payment.notes && (
                      <Text style={styles.paymentNotes}>
                        Notes: {payment.notes}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      
      {/* Empty State */}
      {payments.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No payments yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Payments will appear here once you start receiving them
          </Text>
        </View>
      )}
    </View>
  );
};