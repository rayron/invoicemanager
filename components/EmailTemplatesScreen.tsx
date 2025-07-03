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
  Switch,
} from 'react-native';

// Types
export interface EmailTemplate {
  id: string;
  name: string;
  type: 'invoice' | 'reminder' | 'thank_you' | 'welcome' | 'custom';
  subject: string;
  htmlBody: string;
  textBody: string;
  isDefault: boolean;
  isActive: boolean;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateVariable {
  name: string;
  description: string;
  example: string;
  required: boolean;
}

interface EmailTemplatesScreenProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (templates: EmailTemplate[]) => void;
}

const TEMPLATE_TYPES = [
  { value: 'invoice', label: 'Invoice Email', description: 'Sent when invoices are created and sent to clients' },
  { value: 'reminder', label: 'Payment Reminder', description: 'Sent for overdue payments' },
  { value: 'thank_you', label: 'Thank You', description: 'Sent after payment is received' },
  { value: 'welcome', label: 'Welcome Email', description: 'Sent to new clients' },
  { value: 'custom', label: 'Custom Template', description: 'Custom email template for any purpose' },
] as const;

const AVAILABLE_VARIABLES: TemplateVariable[] = [
  { name: '{{client_name}}', description: "Client's full name", example: 'John Doe', required: false },
  { name: '{{client_email}}', description: "Client's email address", example: 'john@example.com', required: false },
  { name: '{{client_company}}', description: "Client's company name", example: 'Acme Corp', required: false },
  { name: '{{invoice_number}}', description: 'Invoice number', example: 'INV-001', required: true },
  { name: '{{invoice_date}}', description: 'Invoice creation date', example: 'July 3, 2025', required: true },
  { name: '{{invoice_due_date}}', description: 'Invoice due date', example: 'July 31, 2025', required: true },
  { name: '{{invoice_total}}', description: 'Invoice total amount', example: '$1,250.00', required: true },
  { name: '{{invoice_subtotal}}', description: 'Invoice subtotal', example: '$1,000.00', required: false },
  { name: '{{invoice_tax}}', description: 'Tax amount', example: '$250.00', required: false },
  { name: '{{invoice_items}}', description: 'List of invoice items', example: 'Web Development, Design', required: false },
  { name: '{{business_name}}', description: 'Your business name', example: 'Your Software Business', required: false },
  { name: '{{business_email}}', description: 'Your business email', example: 'billing@yourbusiness.com', required: false },
  { name: '{{business_phone}}', description: 'Your business phone', example: '+1 (555) 123-0000', required: false },
  { name: '{{business_address}}', description: 'Your business address', example: '123 Business St', required: false },
  { name: '{{payment_amount}}', description: 'Payment amount received', example: '$500.00', required: false },
  { name: '{{payment_date}}', description: 'Payment date', example: 'July 15, 2025', required: false },
  { name: '{{days_overdue}}', description: 'Days past due', example: '15', required: false },
];

const DEFAULT_TEMPLATES: Partial<EmailTemplate>[] = [
  {
    name: 'Professional Invoice',
    type: 'invoice',
    subject: 'Invoice {{invoice_number}} from {{business_name}}',
    htmlBody: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #2196F3; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h1 style="margin: 0;">{{business_name}}</h1>
    <p style="margin: 5px 0 0 0;">Invoice {{invoice_number}}</p>
  </div>
  
  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <h3 style="margin: 0 0 10px 0;">Invoice Details</h3>
    <p><strong>Invoice Number:</strong> {{invoice_number}}</p>
    <p><strong>Date:</strong> {{invoice_date}}</p>
    <p><strong>Due Date:</strong> {{invoice_due_date}}</p>
  </div>
  
  <div style="margin-bottom: 20px;">
    <h3>Bill To:</h3>
    <p><strong>{{client_name}}</strong><br>
    {{client_company}}<br>
    {{client_email}}</p>
  </div>
  
  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <h3 style="margin: 0 0 10px 0;">Amount Due</h3>
    <p style="font-size: 24px; font-weight: bold; color: #2196F3; margin: 0;">{{invoice_total}}</p>
  </div>
  
  <div style="margin-bottom: 20px;">
    <p>Dear {{client_name}},</p>
    <p>Please find attached invoice {{invoice_number}} for services rendered. Payment is due by {{invoice_due_date}}.</p>
    <p>If you have any questions, please contact us at {{business_email}}.</p>
    <p>Thank you for your business!</p>
  </div>
  
  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; font-size: 12px;">
    <p><strong>{{business_name}}</strong><br>
    {{business_email}}<br>
    {{business_phone}}<br>
    {{business_address}}</p>
  </div>
</div>`,
    textBody: `Invoice {{invoice_number}} from {{business_name}}

Dear {{client_name}},

Please find the details for invoice {{invoice_number}} below.

Invoice Details:
- Invoice Number: {{invoice_number}}
- Date: {{invoice_date}}
- Due Date: {{invoice_due_date}}
- Amount: {{invoice_total}}

Bill To:
{{client_name}}
{{client_company}}
{{client_email}}

Payment is due by {{invoice_due_date}}. If you have any questions, please contact us at {{business_email}}.

Thank you for your business!

{{business_name}}
{{business_email}}
{{business_phone}}
{{business_address}}`,
    isDefault: true,
    isActive: true,
  },
  {
    name: 'Payment Reminder',
    type: 'reminder',
    subject: 'Payment Reminder - Invoice {{invoice_number}} ({{days_overdue}} days overdue)',
    htmlBody: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #FF9800; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h1 style="margin: 0;">Payment Reminder</h1>
    <p style="margin: 5px 0 0 0;">Invoice {{invoice_number}}</p>
  </div>
  
  <div style="background-color: #fff3e0; border-left: 4px solid #FF9800; padding: 15px; margin-bottom: 20px;">
    <h3 style="margin: 0 0 10px 0; color: #FF9800;">Payment Overdue</h3>
    <p style="margin: 0;"><strong>{{days_overdue}} days</strong> past due date</p>
  </div>
  
  <div style="margin-bottom: 20px;">
    <p>Dear {{client_name}},</p>
    <p>This is a friendly reminder that invoice {{invoice_number}} is now <strong>{{days_overdue}} days overdue</strong>.</p>
    
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
      <p><strong>Invoice Details:</strong></p>
      <p>Invoice Number: {{invoice_number}}<br>
      Original Due Date: {{invoice_due_date}}<br>
      Amount Due: {{invoice_total}}</p>
    </div>
    
    <p>Please remit payment at your earliest convenience. If you have already sent payment, please disregard this notice.</p>
    <p>If you have any questions or concerns, please contact us immediately at {{business_email}}.</p>
  </div>
  
  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
    <p style="margin: 0;"><strong>{{business_name}}</strong><br>
    {{business_email}} | {{business_phone}}</p>
  </div>
</div>`,
    textBody: `Payment Reminder - Invoice {{invoice_number}}

Dear {{client_name}},

This is a friendly reminder that invoice {{invoice_number}} is now {{days_overdue}} days overdue.

Invoice Details:
- Invoice Number: {{invoice_number}}
- Original Due Date: {{invoice_due_date}}
- Amount Due: {{invoice_total}}
- Days Overdue: {{days_overdue}}

Please remit payment at your earliest convenience. If you have already sent payment, please disregard this notice.

If you have any questions or concerns, please contact us immediately.

{{business_name}}
{{business_email}}
{{business_phone}}`,
    isDefault: true,
    isActive: true,
  },
];

export const EmailTemplatesScreen: React.FC<EmailTemplatesScreenProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  useEffect(() => {
    // Initialize with default templates
    const initialTemplates: EmailTemplate[] = DEFAULT_TEMPLATES.map((template, index) => ({
      id: (index + 1).toString(),
      name: template.name!,
      type: template.type!,
      subject: template.subject!,
      htmlBody: template.htmlBody!,
      textBody: template.textBody!,
      isDefault: template.isDefault!,
      isActive: template.isActive!,
      variables: extractVariables(template.subject! + ' ' + template.htmlBody! + ' ' + template.textBody!),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    setTemplates(initialTemplates);
  }, []);

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{\{[^}]+\}\}/g);
    return matches ? [...new Set(matches)] : [];
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setShowEditor(true);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setShowEditor(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template?.isDefault) {
      Alert.alert('Cannot Delete', 'Default templates cannot be deleted.');
      return;
    }

    Alert.alert(
      'Delete Template',
      'Are you sure you want to delete this email template?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTemplates(templates.filter(t => t.id !== templateId));
          },
        },
      ]
    );
  };

  const handleToggleActive = (templateId: string) => {
    setTemplates(templates.map(t =>
      t.id === templateId ? { ...t, isActive: !t.isActive } : t
    ));
  };

  const handlePreview = (template: EmailTemplate) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  };

  const handleSaveTemplate = (templateData: Partial<EmailTemplate>) => {
    if (editingTemplate) {
      // Update existing template
      setTemplates(templates.map(t =>
        t.id === editingTemplate.id
          ? {
              ...t,
              ...templateData,
              variables: extractVariables(
                (templateData.subject || '') +
                ' ' + (templateData.htmlBody || '') +
                ' ' + (templateData.textBody || '')
              ),
              updatedAt: new Date().toISOString(),
            }
          : t
      ));
    } else {
      // Create new template
      const newTemplate: EmailTemplate = {
        id: Date.now().toString(),
        name: templateData.name || 'New Template',
        type: templateData.type || 'custom',
        subject: templateData.subject || '',
        htmlBody: templateData.htmlBody || '',
        textBody: templateData.textBody || '',
        isDefault: false,
        isActive: true,
        variables: extractVariables(
          (templateData.subject || '') +
          ' ' + (templateData.htmlBody || '') +
          ' ' + (templateData.textBody || '')
        ),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTemplates([...templates, newTemplate]);
    }
    setShowEditor(false);
    setEditingTemplate(null);
  };

  const handleSaveAndClose = () => {
    onSave?.(templates);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Email Templates</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.headerButton}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Manage Email Templates</Text>
              <TouchableOpacity style={styles.createButton} onPress={handleCreateTemplate}>
                <Text style={styles.createButtonText}>+ New Template</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionDescription}>
              Create and customize email templates for invoices, reminders, and other communications.
            </Text>
          </View>

          {/* Template List */}
          <View style={styles.templateList}>
            {templates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onEdit={() => handleEditTemplate(template)}
                onDelete={() => handleDeleteTemplate(template.id)}
                onToggleActive={() => handleToggleActive(template.id)}
                onPreview={() => handlePreview(template)}
              />
            ))}
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveAndClose}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Template Editor Modal */}
        <TemplateEditor
          visible={showEditor}
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onCancel={() => {
            setShowEditor(false);
            setEditingTemplate(null);
          }}
        />

        {/* Template Preview Modal */}
        <TemplatePreview
          visible={showPreview}
          template={previewTemplate}
          onClose={() => {
            setShowPreview(false);
            setPreviewTemplate(null);
          }}
        />
      </View>
    </Modal>
  );
};

// Template Card Component
const TemplateCard: React.FC<{
  template: EmailTemplate;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  onPreview: () => void;
}> = ({ template, onEdit, onDelete, onToggleActive, onPreview }) => {
  const typeInfo = TEMPLATE_TYPES.find(t => t.value === template.type);

  return (
    <View style={styles.templateCard}>
      <View style={styles.templateHeader}>
        <View style={styles.templateInfo}>
          <Text style={styles.templateName}>{template.name}</Text>
          <Text style={styles.templateType}>{typeInfo?.label}</Text>
          {template.isDefault && (
            <Text style={styles.defaultBadge}>Default</Text>
          )}
        </View>
        <Switch
          value={template.isActive}
          onValueChange={onToggleActive}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={template.isActive ? '#2196F3' : '#f4f3f4'}
        />
      </View>

      <Text style={styles.templateSubject}>Subject: {template.subject}</Text>
      <Text style={styles.templateVariables}>
        Variables: {template.variables.length > 0 ? template.variables.join(', ') : 'None'}
      </Text>

      <View style={styles.templateActions}>
        <TouchableOpacity style={styles.previewButton} onPress={onPreview}>
          <Text style={styles.previewButtonText}>Preview</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        {!template.isDefault && (
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Template Editor Component
const TemplateEditor: React.FC<{
  visible: boolean;
  template: EmailTemplate | null;
  onSave: (template: Partial<EmailTemplate>) => void;
  onCancel: () => void;
}> = ({ visible, template, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<EmailTemplate['type']>('custom');
  const [subject, setSubject] = useState('');
  const [htmlBody, setHtmlBody] = useState('');
  const [textBody, setTextBody] = useState('');
  const [showVariables, setShowVariables] = useState(false);

  useEffect(() => {
    if (template) {
      setName(template.name);
      setType(template.type);
      setSubject(template.subject);
      setHtmlBody(template.htmlBody);
      setTextBody(template.textBody);
    } else {
      setName('');
      setType('custom');
      setSubject('');
      setHtmlBody('');
      setTextBody('');
    }
  }, [template, visible]);

  const handleSave = () => {
    if (!name.trim() || !subject.trim()) {
      Alert.alert('Error', 'Please fill in the template name and subject.');
      return;
    }

    onSave({
      name: name.trim(),
      type,
      subject: subject.trim(),
      htmlBody: htmlBody.trim(),
      textBody: textBody.trim(),
    });
  };

  const insertVariable = (variable: string) => {
    // Insert variable at cursor position in currently focused field
    // For simplicity, we'll append to the subject field
    setSubject(prev => prev + variable);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.headerButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {template ? 'Edit Template' : 'New Template'}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.headerButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Template Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Template Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter template name"
            />
          </View>

          {/* Template Type */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Template Type</Text>
            <View style={styles.typeSelector}>
              {TEMPLATE_TYPES.map(typeOption => (
                <TouchableOpacity
                  key={typeOption.value}
                  style={[
                    styles.typeOption,
                    type === typeOption.value && styles.typeOptionSelected,
                  ]}
                  onPress={() => setType(typeOption.value)}
                >
                  <Text
                    style={[
                      styles.typeOptionText,
                      type === typeOption.value && styles.typeOptionTextSelected,
                    ]}
                  >
                    {typeOption.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Variables Helper */}
          <View style={styles.formGroup}>
            <TouchableOpacity
              style={styles.variablesToggle}
              onPress={() => setShowVariables(!showVariables)}
            >
              <Text style={styles.variablesToggleText}>
                {showVariables ? '▼' : '▶'} Available Variables
              </Text>
            </TouchableOpacity>

            {showVariables && (
              <View style={styles.variablesList}>
                {AVAILABLE_VARIABLES.map(variable => (
                  <TouchableOpacity
                    key={variable.name}
                    style={styles.variableItem}
                    onPress={() => insertVariable(variable.name)}
                  >
                    <Text style={styles.variableName}>{variable.name}</Text>
                    <Text style={styles.variableDescription}>{variable.description}</Text>
                    <Text style={styles.variableExample}>Example: {variable.example}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Subject */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Subject *</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder="Enter email subject"
              multiline
            />
          </View>

          {/* HTML Body */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>HTML Body</Text>
            <TextInput
              style={styles.textArea}
              value={htmlBody}
              onChangeText={setHtmlBody}
              placeholder="Enter HTML email content..."
              multiline
              numberOfLines={10}
            />
          </View>

          {/* Text Body */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Plain Text Body</Text>
            <TextInput
              style={styles.textArea}
              value={textBody}
              onChangeText={setTextBody}
              placeholder="Enter plain text email content..."
              multiline
              numberOfLines={8}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

// Template Preview Component
const TemplatePreview: React.FC<{
  visible: boolean;
  template: EmailTemplate | null;
  onClose: () => void;
}> = ({ visible, template, onClose }) => {
  const [viewMode, setViewMode] = useState<'html' | 'text'>('html');

  if (!template) return null;

  // Sample data for preview
  const sampleData = {
    '{{client_name}}': 'John Doe',
    '{{client_email}}': 'john@example.com',
    '{{client_company}}': 'Acme Corporation',
    '{{invoice_number}}': 'INV-001',
    '{{invoice_date}}': 'July 3, 2025',
    '{{invoice_due_date}}': 'July 31, 2025',
    '{{invoice_total}}': '$1,250.00',
    '{{invoice_subtotal}}': '$1,000.00',
    '{{invoice_tax}}': '$250.00',
    '{{business_name}}': 'Your Software Business',
    '{{business_email}}': 'billing@yourbusiness.com',
    '{{business_phone}}': '+1 (555) 123-0000',
    '{{business_address}}': '123 Business Street, City, State 12345',
    '{{payment_amount}}': '$500.00',
    '{{payment_date}}': 'July 15, 2025',
    '{{days_overdue}}': '15',
  };

  const replaceVariables = (content: string): string => {
    let result = content;
    Object.entries(sampleData).forEach(([variable, value]) => {
      result = result.replace(new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g'), value);
    });
    return result;
  };

  const previewSubject = replaceVariables(template.subject);
  const previewContent = viewMode === 'html'
    ? replaceVariables(template.htmlBody)
    : replaceVariables(template.textBody);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.headerButton}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Preview: {template.name}</Text>
          <View style={styles.viewModeToggle}>
            <TouchableOpacity
              style={[styles.toggleButton, viewMode === 'html' && styles.toggleButtonActive]}
              onPress={() => setViewMode('html')}
            >
              <Text style={[styles.toggleButtonText, viewMode === 'html' && styles.toggleButtonTextActive]}>
                HTML
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, viewMode === 'text' && styles.toggleButtonActive]}
              onPress={() => setViewMode('text')}
            >
              <Text style={[styles.toggleButtonText, viewMode === 'text' && styles.toggleButtonTextActive]}>
                Text
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.previewContainer}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewSubject}>Subject: {previewSubject}</Text>
            </View>

            <View style={styles.previewContent}>
              {viewMode === 'html' ? (
                <Text style={styles.htmlPreview}>{previewContent}</Text>
              ) : (
                <Text style={styles.textPreview}>{previewContent}</Text>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  templateList: {
    gap: 12,
  },
  templateCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  templateType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  defaultBadge: {
    fontSize: 12,
    color: '#2196F3',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  templateSubject: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  templateVariables: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  templateActions: {
    flexDirection: 'row',
    gap: 8,
  },
  previewButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  previewButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
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
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    minHeight: 44,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    backgroundColor: 'white',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  typeOptionSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  typeOptionText: {
    fontSize: 14,
    color: '#666',
  },
  typeOptionTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  variablesToggle: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  variablesToggleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  variablesList: {
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 8,
    maxHeight: 200,
  },
  variableItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  variableName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  variableDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  variableExample: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  toggleButtonActive: {
    backgroundColor: 'white',
  },
  toggleButtonText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  toggleButtonTextActive: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  previewContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewHeader: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  previewSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  previewContent: {
    padding: 16,
  },
  htmlPreview: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  textPreview: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});

export default EmailTemplatesScreen;