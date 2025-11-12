import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { ImagePickerService, ImagePickerOptions, ImagePickerResult } from '../services/ImagePickerService';

interface ImagePickerProps {
  onImageSelected: (result: ImagePickerResult) => void;
  onError?: (error: string) => void;
  options?: ImagePickerOptions;
  style?: any;
  text?: string;
  disabled?: boolean;
}

export default function ImagePicker({
  onImageSelected,
  onError,
  options = {},
  style,
  text = 'Select Image',
  disabled = false,
}: ImagePickerProps) {
  const handlePress = async () => {
    if (disabled) return;

    try {
      const result = await ImagePickerService.showImagePicker(options);
      if (result) {
        onImageSelected(result);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to select image';
      onError?.(errorMessage);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={handlePress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled && styles.disabledText]}>
        📷 {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  disabledText: {
    color: '#666',
  },
});
