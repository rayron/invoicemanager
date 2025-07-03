import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert
} from 'react-native';
import { Invoice, InvoiceItem, Client } from '../types';
import { styles } from '../styles';
import { generateInvoiceNumber, calculateInvoiceTotals, createInvoiceItem } from '../utils/invoiceUtils';
import { getCurrentDate, addDays, formatDate } from '../utils/dateUtils';

interface InvoiceModalProps {
  visible: boolean;
  invoice: Invoice | null;
  clients: Client[];
  onSave: (invoice: Omit<Invoice, 'id'>) => void;
  onCancel: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  visible,
  invoice,
  clients,
  onSave,
  onCancel
}) => {
  const [clientId, setClientId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [date, setDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [notes, setNotes] = useState('');
  const [taxRate, setTaxRate] = useState(0.1); // 10% default
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (invoice) {
      setClientId(invoice.clientId);
      setInvoiceNumber(invoice.invoiceNumber);
      setDate(invoice.date);
      setDueDate(invoice.dueDate);
      setItems(invoice.items);
      setNotes(invoice.notes);
      setTaxRate(invoice.tax / invoice.subtotal || 0.1);
    } else {
      resetForm();
    }
    setErrors({});
  }, [invoice, visible]);

  const resetForm = () => {
    setClientId('');
    setInvoiceNumber(generateInvoiceNumber([])); // Pass existing invoices in real app
    setDate(getCurrentDate());
    setDueDate(addDays(getCurrentDate(), 30)); // 30 days from now
    setItems([createInvoiceItem()]);
    setNotes('');
    setTaxRate(0.1);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!clientId) {
      newErrors.client = 'Please select a client';
    }

    if (!invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'Invoice number is required';
    }

    if (!date) {
      newErrors.date = 'Invoice date is required';
    }

    if (!dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (date && dueDate && new Date(dueDate) < new Date(date)) {
      newErrors.dueDate = 'Due date must be after invoice date';
    }

    if (items.length === 0) {
      newErrors.items = 'At least one item is required';
    } else {
      items.forEach((item, index) => {
        if (!item.description.trim()) {
          newErrors[`item_${index}_description`] = `Item ${index + 1} description is required`;
        }
        if (item.quantity <= 0) {
          newErrors[`item_${index}_quantity`] = `Item ${index + 1} quantity must be greater than 0`;
        }
        if (item.rate < 0) {
          newErrors[`item_${index}_rate`] = `Item ${index + 1} rate cannot be negative`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addItem = () => {
    setItems([...items, createInvoiceItem()]);
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
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    } else {
      Alert.alert('Cannot Remove', 'At least one item is required');
    }
  };

  const duplicateItem = (id: string) => {
    const itemToDuplicate = items.find(item => item.id === id);
    if (itemToDuplicate) {
      const newItem = createInvoiceItem(
        itemToDuplicate.description,
        itemToDuplicate.quantity,
        itemToDuplicate.rate
      );
      setItems([...items, newItem]);
    }
  };

  const { subtotal, tax, total } = calculateInvoiceTotals(items, taxRate);

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        clientId,
        invoiceNumber: invoiceNumber.trim(),
        date,
        dueDate,
        items,
        subtotal,
        tax,
        total,
        status: 'draft',
        notes: notes.trim(),
      });
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: onCancel }
      ]
    );
  };

  const selectedClient = clients.find(c => c.id === clientId);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {invoice ? 'Edit Invoice' : 'Create Invoice'}
          </Text>
        </View>
        
        {/* Content */}
        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Client Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Client *</Text>
            {errors.client && (
              <Text style={styles.inputErrorText}>{errors.client}</Text>
            )}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.clientSelector}
            >
              {clients.map(client => (
                <TouchableOpacity
                  key={client.id}
                  style={[
                    styles.clientOption,
                    clientId === client.id && styles.clientOptionSelected
                  ]}
                  onPress={() => setClientId(client.id)}
                >
                  <Text style={[
                    styles.clientOptionText,
                    clientId === client.id && styles.clientOptionTextSelected
                  ]}>
                    {client.name}
                  </Text>
                  <Text style={styles.clientOptionCompany}>{client.company}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {selectedClient && (
              <View style={styles.selectedClientInfo}>
                <Text style={styles.selectedClientText}>
                  {selectedClient.name} • {selectedClient.email}
                </Text>
              </View>
            )}
          </View>

          {/* Invoice Details */}
          <View style={styles.invoiceDetailsRow}>
            <View style={styles.inputGroupHalf}>
              <Text style={styles.inputLabel}>Invoice Number *</Text>
              <TextInput
                style={[styles.input, errors.invoiceNumber && styles.inputError]}
                placeholder="INV-001"
                value={invoiceNumber}
                onChangeText={setInvoiceNumber}
                autoCapitalize="characters"
              />
              {errors.invoiceNumber && (
                <Text style={styles.inputErrorText}>{errors.invoiceNumber}</Text>
              )}
            </View>
            
            <View style={styles.inputGroupHalf}>
              <Text style={styles.inputLabel}>Tax Rate (%)</Text>
              <TextInput
                style={styles.input}
                placeholder="10"
                value={(taxRate * 100).toString()}
                onChangeText={(text) => setTaxRate(parseFloat(text) / 100 || 0)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.invoiceDetailsRow}>
            <View style={styles.inputGroupHalf}>
              <Text style={styles.inputLabel}>Date *</Text>
              <TextInput
                style={[styles.input, errors.date && styles.inputError]}
                placeholder="YYYY-MM-DD"
                value={date}
                onChangeText={setDate}
              />
              {errors.date && (
                <Text style={styles.inputErrorText}>{errors.date}</Text>
              )}
            </View>
            
            <View style={styles.inputGroupHalf}>
              <Text style={styles.inputLabel}>Due Date *</Text>
              <TextInput
                style={[styles.input, errors.dueDate && styles.inputError]}
                placeholder="YYYY-MM-DD"
                value={dueDate}
                onChangeText={setDueDate}
              />
              {errors.dueDate && (
                <Text style={styles.inputErrorText}>{errors.dueDate}</Text>
              )}
            </View>
          </View>
          
          {/* Items Section */}
          <View style={styles.itemsSection}>
            <View style={styles.itemsHeader}>
              <Text style={styles.inputLabel}>Items *</Text>
              <TouchableOpacity style={styles.addItemButton} onPress={addItem}>
                <Text style={styles.addItemButtonText}>+ Add Item</Text>
              </TouchableOpacity>
            </View>
            
            {errors.items && (
              <Text style={styles.inputErrorText}>{errors.items}</Text>
            )}
            
            {items.map((item, index) => (
              <View key={item.id} style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>Item {index + 1}</Text>
                  <View style={styles.itemActions}>
                    <TouchableOpacity 
                      style={styles.duplicateItemButton}
                      onPress={() => duplicateItem(item.id)}
                    >
                      <Text style={styles.duplicateItemText}>Duplicate</Text>
                    </TouchableOpacity>
                    {items.length > 1 && (
                      <TouchableOpacity 
                        style={styles.removeItemButton}
                        onPress={() => removeItem(item.id)}
                      >
                        <Text style={styles.removeItemText}>Remove</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                
                <TextInput
                  style={[
                    styles.input, 
                    errors[`item_${index}_description`] && styles.inputError
                  ]}
                  placeholder="Description of work/service"
                  value={item.description}
                  onChangeText={(text) => updateItem(item.id, 'description', text)}
                  multiline
                />
                {errors[`item_${index}_description`] && (
                  <Text style={styles.inputErrorText}>
                    {errors[`item_${index}_description`]}
                  </Text>
                )}
                
                <View style={styles.itemDetailsRow}>
                  <View style={styles.itemInput}>
                    <Text style={styles.itemInputLabel}>Quantity</Text>
                    <TextInput
                      style={[
                        styles.input, 
                        styles.itemNumberInput,
                        errors[`item_${index}_quantity`] && styles.inputError
                      ]}
                      placeholder="1"
                      value={item.quantity.toString()}
                      onChangeText={(text) => updateItem(item.id, 'quantity', parseFloat(text) || 0)}
                      keyboardType="numeric"
                    />
                    {errors[`item_${index}_quantity`] && (
                      <Text style={styles.inputErrorText}>
                        {errors[`item_${index}_quantity`]}
                      </Text>
                    )}
                  </View>
                  
                  <View style={styles.itemInput}>
                    <Text style={styles.itemInputLabel}>Rate ($)</Text>
                    <TextInput
                      style={[
                        styles.input, 
                        styles.itemNumberInput,
                        errors[`item_${index}_rate`] && styles.inputError
                      ]}
                      placeholder="0.00"
                      value={item.rate.toString()}
                      onChangeText={(text) => updateItem(item.id, 'rate', parseFloat(text) || 0)}
                      keyboardType="numeric"
                    />
                    {errors[`item_${index}_rate`] && (
                      <Text style={styles.inputErrorText}>
                        {errors[`item_${index}_rate`]}
                      </Text>
                    )}
                  </View>
                  
                  <View style={styles.itemInput}>
                    <Text style={styles.itemInputLabel}>Amount</Text>
                    <Text style={styles.itemAmount}>
                      ${item.amount.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          
          {/* Totals */}
          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax ({(taxRate * 100).toFixed(1)}%):</Text>
              <Text style={styles.totalValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.totalRow, styles.totalRowFinal]}>
              <Text style={styles.totalLabelFinal}>Total:</Text>
              <Text style={styles.totalValueFinal}>${total.toFixed(2)}</Text>
            </View>
          </View>
          
          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Additional notes or terms..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Helper Text */}
          <Text style={styles.helperText}>
            * Required fields
          </Text>
        </ScrollView>
        
        {/* Actions */}
        <View style={styles.modalActions}>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.saveButton,
              (!clientId || !invoiceNumber.trim() || items.length === 0) && styles.saveButtonDisabled
            ]} 
            onPress={handleSave}
            disabled={!clientId || !invoiceNumber.trim() || items.length === 0}
          >
            <Text style={[
              styles.saveButtonText,
              (!clientId || !invoiceNumber.trim() || items.length === 0) && styles.saveButtonTextDisabled
            ]}>
              {invoice ? 'Update Invoice' : 'Save Invoice'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};