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
import { Client } from '../types';
import { styles } from '../styles';
import { validateEmailAddress } from '../utils/emailUtils';

interface ClientModalProps {
  visible: boolean;
  client: Client | null;
  onSave: (client: Omit<Client, 'id'>) => void;
  onCancel: () => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  visible,
  client,
  onSave,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    setErrors({});
  }, [client, visible]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmailAddress(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (phone && !/^[\d\s\-\+\(\)]+$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        company: company.trim(),
        address: address.trim(),
        phone: phone.trim()
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

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet">
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {client ? 'Edit Client' : 'Add Client'}
          </Text>
        </View>
        
        {/* Content */}
        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Name Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Enter client name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              returnKeyType="next"
            />
            {errors.name && (
              <Text style={styles.inputErrorText}>{errors.name}</Text>
            )}
          </View>

          {/* Email Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Enter email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
            {errors.email && (
              <Text style={styles.inputErrorText}>{errors.email}</Text>
            )}
          </View>

          {/* Company Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Company</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter company name"
              value={company}
              onChangeText={setCompany}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          {/* Phone Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              placeholder="Enter phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              returnKeyType="next"
            />
            {errors.phone && (
              <Text style={styles.inputErrorText}>{errors.phone}</Text>
            )}
          </View>

          {/* Address Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter full address"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              returnKeyType="done"
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
              (!name.trim() || !email.trim()) && styles.saveButtonDisabled
            ]} 
            onPress={handleSave}
            disabled={!name.trim() || !email.trim()}
          >
            <Text style={[
              styles.saveButtonText,
              (!name.trim() || !email.trim()) && styles.saveButtonTextDisabled
            ]}>
              {client ? 'Update' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};