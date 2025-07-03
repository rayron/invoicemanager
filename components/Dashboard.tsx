import React from 'react';
import { View, Text } from 'react-native';
import { Invoice, Client } from '../types';
import { styles, getStatusColor } from '../styles';

interface DashboardProps {
  totalRevenue: number;
  paidInvoices: number;
  pendingInvoices: number;
  totalPaid: number;
  recentInvoices: Invoice[];
  clients: Client[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  totalRevenue,
  paidInvoices,
  pendingInvoices,
  totalPaid,
  recentInvoices,
  clients
}) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>Dashboard</Text>
      
      {/* Stats Cards */}
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

      {/* Recent Invoices */}
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
};