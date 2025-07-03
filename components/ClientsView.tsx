import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Client } from '../types';
import { styles } from '../styles';

interface ClientsViewProps {
  clients: Client[];
  onAddClient: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  onAddClient,
  onEditClient,
  onDeleteClient
}) => {
  return (
    <View>
      {/* Header with Add Button */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Clients</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddClient}>
          <Text style={styles.addButtonText}>Add Client</Text>
        </TouchableOpacity>
      </View>
      
      {/* Clients List */}
      {clients.map(client => (
        <View key={client.id} style={styles.clientCard}>
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>{client.name}</Text>
            <Text style={styles.clientCompany}>{client.company}</Text>
            <Text style={styles.clientEmail}>{client.email}</Text>
            <Text style={styles.clientPhone}>{client.phone}</Text>
            <Text style={styles.clientAddress}>{client.address}</Text>
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
      
      {/* Empty State */}
      {clients.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No clients yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Add your first client to start creating invoices
          </Text>
        </View>
      )}
    </View>
  );
};