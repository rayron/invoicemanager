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
import { Payment, PaymentMethod } from '../types';
import { styles } from '../styles';
import { getCurrentDate, formatDate } from '../utils/dateUtils';

interface PaymentModalProps {
  visible: boolean;
  invoiceId: string | null;
  invoiceNumber?: string;
  invoiceTotal?: number;
  onSave: (payment: Omit<Payment, 'id'>) => void;
  onCancel: () => void;
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'check', label: 'Check' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'other', label: 'Other' },
];

export const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  invoiceId,
  invoiceNumber,
  invoiceTotal,
  onSave,
  onCancel
}) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('bank_transfer');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (visible) {
      setAmount(invoiceTotal ? invoiceTotal.toString() : '');
      setDate(getCurrentDate());
      setMethod('bank_transfer');
      setReference('');
      setNotes('');
      setErrors({});
    }
  }, [visible, invoiceTotal]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const amountValue = parseFloat(amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        newErrors.amount = 'Amount must be a valid positive number';
      } else if (invoiceTotal && amountValue > invoiceTotal) {
        newErrors.amount = `Amount cannot exceed invoice total ($${invoiceTotal.toFixed(2)})`;
      }
    }

    if (!date) {
      newErrors.date = 'Payment date is required';
    } else {
      const paymentDate = new Date(date);
      const today = new Date();
      if (paymentDate > today) {
        newErrors.date = 'Payment date cannot be in the future';
      }
    }

    if (!method) {
      newErrors.method = 'Payment method is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!invoiceId) {
      Alert.alert('Error', 'No invoice selected');
      return;
    }

    if (validateForm()) {
      onSave({
        invoiceId,
        amount: parseFloat(amount),
        date,
        method,
        reference: reference.trim(),
        notes: notes.trim(),
      });
    }
  };

  const handleCancel = () => {
    const hasChanges = amount || reference || notes || method !== 'bank_transfer';
    
    if (hasChanges) {
      Alert.alert(
        'Discard Payment',
        'Are you sure you want to discard this payment?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: onCancel }
        ]
      );
    } else {
      onCancel();
    }
  };

  const setFullAmount = () => {
    if (invoiceTotal) {
      setAmount(invoiceTotal.toString());
    }
  };

  const selectedMethodLabel = PAYMENT_METHODS.find(m => m.value === method)?.label || method;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet">
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Record Payment</Text>
          {invoiceNumber && (
            <Text style={styles.modalSubtitle}>Invoice: {invoiceNumber}</Text>
          )}
        </View>
        
        {/* Content */}
        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Amount Field */}
          <View style={styles.inputGroup}>
            <View style={styles.amountHeader}>
              <Text style={styles.inputLabel}>Payment Amount *</Text>
              {invoiceTotal && (
                <TouchableOpacity onPress={setFullAmount} style={styles.fullAmountButton}>
                  <Text style={styles.fullAmountButtonText}>
                    Full Amount (${invoiceTotal.toFixed(2)})
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              style={[styles.input, styles.amountInput, errors.amount && styles.inputError]}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              selectTextOnFocus
            />
            {errors.amount && (
              <Text style={styles.inputErrorText}>{errors.amount}</Text>
            )}
            {invoiceTotal && (
              <Text style={styles.inputHelperText}>
                Invoice total: ${invoiceTotal.toFixed(2)}
              </Text>
            )}
          </View>

          {/* Date Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Payment Date *</Text>
            <TextInput
              style={[styles.input, errors.date && styles.inputError]}
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={setDate}
            />
            {errors.date && (
              <Text style={styles.inputErrorText}>{errors.date}</Text>
            )}
            <Text style={styles.inputHelperText}>
              Today: {formatDate(getCurrentDate(), 'long')}
            </Text>
          </View>
          
          {/* Payment Method */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Payment Method *</Text>
            {errors.method && (
              <Text style={styles.inputErrorText}>{errors.method}</Text>
            )}
            <View style={styles.paymentMethodGrid}>
              {PAYMENT_METHODS.map(paymentMethod => (
                <TouchableOpacity
                  key={paymentMethod.value}
                  style={[
                    styles.paymentMethodOption,
                    method === paymentMethod.value && styles.paymentMethodOptionSelected
                  ]}
                  onPress={() => setMethod(paymentMethod.value)}
                >
                  <Text style={[
                    styles.paymentMethodText,
                    method === paymentMethod.value && styles.paymentMethodTextSelected
                  ]}>
                    {paymentMethod.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.selectedMethodText}>
              Selected: {selectedMethodLabel}
            </Text>
          </View>

          {/* Reference Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Reference Number
              {method === 'check' && ' (Check #)'}
              {method === 'bank_transfer' && ' (Transfer ID)'}
              {method === 'credit_card' && ' (Transaction ID)'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={
                method === 'check' ? 'Check number' :
                method === 'bank_transfer' ? 'Transfer reference' :
                method === 'credit_card' ? 'Transaction ID' :
                'Reference number'
              }
              value={reference}
              onChangeText={setReference}
              autoCapitalize="characters"
            />
          </View>

          {/* Notes Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Additional payment details..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Payment Summary */}
          <View style={styles.paymentSummary}>
            <Text style={styles.summaryTitle}>Payment Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount:</Text>
              <Text style={styles.summaryValue}>
                ${amount ? parseFloat(amount).toFixed(2) : '0.00'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Method:</Text>
              <Text style={styles.summaryValue}>{selectedMethodLabel}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date:</Text>
              <Text style={styles.summaryValue}>
                {date ? formatDate(date, 'long') : 'Not set'}
              </Text>
            </View>
            {reference && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Reference:</Text>
                <Text style={styles.summaryValue}>{reference}</Text>
              </View>
            )}
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
              (!amount || !date || !method) && styles.saveButtonDisabled
            ]} 
            onPress={handleSave}
            disabled={!amount || !date || !method}
          >
            <Text style={[
              styles.saveButtonText,
              (!amount || !date || !method) && styles.saveButtonTextDisabled
            ]}>
              Record Payment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};