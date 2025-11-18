import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Template, Element } from '../types';
import { Colors } from '../constants/colors';
import ImagePickerModal from './editor/ImagePickerModal';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TemplateInfoDrawerProps {
  visible: boolean;
  template: Template;
  onClose: () => void;
  onSave: (templateId: string, info: TemplateInfo) => void;
}

export interface TemplateInfo {
  name?: string;
  about?: string;
  imageUrl?: string;
  date?: string;
  phone?: string;
  email?: string;
  address?: string;
  customFields: { [key: string]: string };
}

export default function TemplateInfoDrawer({
  visible,
  template,
  onClose,
  onSave,
}: TemplateInfoDrawerProps) {
  const [formData, setFormData] = useState<TemplateInfo>({
    name: '',
    about: '',
    imageUrl: '',
    date: '',
    phone: '',
    email: '',
    address: '',
    customFields: {},
  });

  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const [editableFields, setEditableFields] = useState<string[]>([]);

  useEffect(() => {
    if (visible && template) {
      // Extract editable fields from template elements
      const fields = extractEditableFields(template);
      setEditableFields(fields);
      resetForm();
    }
  }, [visible, template]);

  const extractEditableFields = (template: Template): string[] => {
    const fields: string[] = [];

    template.elements.forEach((element: Element) => {
      // Check if element has placeholder or is editable
      if (element.placeholder || element.editable) {
        // Add common field types based on element id/type
        const id = element.id.toLowerCase();

        if (id.includes('name') && !fields.includes('name')) fields.push('name');
        if ((id.includes('about') || id.includes('description')) && !fields.includes('about')) fields.push('about');
        if ((id.includes('photo') || id.includes('image')) && !fields.includes('image')) fields.push('image');
        if (id.includes('date') && !fields.includes('date')) fields.push('date');
        if (id.includes('phone') && !fields.includes('phone')) fields.push('phone');
        if (id.includes('email') && !fields.includes('email')) fields.push('email');
        if (id.includes('address') && !fields.includes('address')) fields.push('address');
      }
    });

    // Always include name and about as default if not already present
    if (!fields.includes('name')) fields.unshift('name');
    if (!fields.includes('about')) fields.push('about'); // Changed to push to maintain order

    return fields;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      about: '',
      imageUrl: '',
      date: '',
      phone: '',
      email: '',
      address: '',
      customFields: {},
    });
  };

  const handleInputChange = (field: keyof TemplateInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCustomFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [fieldName]: value,
      },
    }));
  };

  const handleImageSelect = (imageUri: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: imageUri,
    }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.name?.trim()) {
      Alert.alert('Validation Error', 'Please enter a name');
      return;
    }

    onSave(template.id, formData);
  };

  const renderFieldInput = (field: string) => {
    switch (field) {
      case 'name':
        return (
          <View key="name" style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter name"
              placeholderTextColor="#999"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
          </View>
        );

      case 'about':
        return (
          <View key="about" style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>About</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter description or message"
              placeholderTextColor="#999"
              value={formData.about}
              onChangeText={(value) => handleInputChange('about', value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        );

      case 'image':
        return (
          <View key="image" style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Image</Text>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => setImagePickerVisible(true)}
            >
              {formData.imageUrl ? (
                <View style={styles.imagePreview}>
                  <Text style={styles.imagePreviewText}>Image selected ✓</Text>
                  <Text style={styles.changeImageText}>Tap to change</Text>
                </View>
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderIcon}>📷</Text>
                  <Text style={styles.imagePlaceholderText}>Select Image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        );

      case 'date':
        return (
          <View key="date" style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Date</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#999"
              value={formData.date}
              onChangeText={(value) => handleInputChange('date', value)}
            />
          </View>
        );

      case 'phone':
        return (
          <View key="phone" style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#999"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              keyboardType="phone-pad"
            />
          </View>
        );

      case 'email':
        return (
          <View key="email" style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email address"
              placeholderTextColor="#999"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        );

      case 'address':
        return (
          <View key="address" style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter address"
              placeholderTextColor="#999"
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <View style={styles.drawer}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Edit Template</Text>
              <Text style={styles.subtitle}>
                {template.title || `${template.category} - ${template.subcategory}`}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView
            style={styles.formContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.formDescription}>
              Fill in the details below. These will be added to the template when you edit it.
            </Text>

            {editableFields.map(field => renderFieldInput(field))}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save & Edit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Image Picker Modal */}
        <ImagePickerModal
          visible={imagePickerVisible}
          onClose={() => setImagePickerVisible(false)}
          onSelect={handleImageSelect}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.85,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
    lineHeight: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  imageButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  imagePlaceholder: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  imagePreview: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f5e9',
  },
  imagePreviewText: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '600',
    marginBottom: 4,
  },
  changeImageText: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
