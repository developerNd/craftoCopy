import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EditorElement, TextEditorOptions } from '../../types';

interface TextEditorModalProps {
  visible: boolean;
  element: EditorElement | null;
  onClose: () => void;
  onSave: (options: TextEditorOptions & { text: string }) => void;
}

const FONTS = [
  { name: 'System', value: 'System' },
  { name: 'Poppins Bold', value: 'Poppins-Bold' },
  { name: 'Poppins Regular', value: 'Poppins-Regular' },
  { name: 'Roboto Bold', value: 'Roboto-Bold' },
  { name: 'Roboto Regular', value: 'Roboto-Regular' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Playfair Display', value: 'PlayfairDisplay' },
  { name: 'Open Sans', value: 'OpenSans' },
];

const COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#FFD700', '#FF6347', '#4169E1', '#32CD32', '#FF1493',
];

export default function TextEditorModal({
  visible,
  element,
  onClose,
  onSave,
}: TextEditorModalProps) {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(32);
  const [fontFamily, setFontFamily] = useState('System');
  const [color, setColor] = useState('#000000');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [shadow, setShadow] = useState(false);

  useEffect(() => {
    if (element) {
      setText(element.text || element.placeholderText || '');
      setFontSize(element.fontSize || 32);
      setFontFamily(element.fontFamily || 'System');
      setColor(element.color || '#000000');
      setAlignment(element.alignment || 'left');
      setBold((element as any).bold || false);
      setItalic((element as any).italic || false);
      setUnderline((element as any).underline || false);
      setShadow((element as any).shadow || false);
    }
  }, [element]);

  const handleSave = () => {
    if (!element) return;

    if (element.maxLength && text.length > element.maxLength) {
      Alert.alert('Error', `Text cannot exceed ${element.maxLength} characters`);
      return;
    }

    onSave({
      text,
      fontSize,
      fontFamily,
      color,
      alignment,
      bold,
      italic,
      underline,
      shadow,
    });
    onClose();
  };

  if (!element) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Text</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Text Input */}
            <View style={styles.section}>
              <Text style={styles.label}>Text</Text>
              <TextInput
                style={styles.textInput}
                value={text}
                onChangeText={setText}
                placeholder={element.placeholderText || 'Enter text'}
                multiline
                maxLength={element.maxLength}
              />
              {element.maxLength && (
                <Text style={styles.characterCount}>
                  {text.length} / {element.maxLength}
                </Text>
              )}
            </View>

            {/* Font Size */}
            <View style={styles.section}>
              <Text style={styles.label}>Font Size: {fontSize}px</Text>
              <View style={styles.sizeControls}>
                <TouchableOpacity
                  style={styles.sizeButton}
                  onPress={() => setFontSize(Math.max(12, fontSize - 2))}
                >
                  <Text style={styles.sizeButtonText}>−</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sizeButton}
                  onPress={() => setFontSize(Math.min(120, fontSize + 2))}
                >
                  <Text style={styles.sizeButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Font Family */}
            <View style={styles.section}>
              <Text style={styles.label}>Font Family</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {FONTS.map((font) => (
                  <TouchableOpacity
                    key={font.value}
                    style={[
                      styles.fontButton,
                      fontFamily === font.value && styles.fontButtonActive,
                    ]}
                    onPress={() => setFontFamily(font.value)}
                  >
                    <Text
                      style={[
                        styles.fontButtonText,
                        fontFamily === font.value && styles.fontButtonTextActive,
                      ]}
                    >
                      {font.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Color Picker */}
            <View style={styles.section}>
              <Text style={styles.label}>Text Color</Text>
              <View style={styles.colorGrid}>
                {COLORS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.colorButton,
                      { backgroundColor: c },
                      color === c && styles.colorButtonActive,
                    ]}
                    onPress={() => setColor(c)}
                  />
                ))}
              </View>
              <TextInput
                style={styles.colorInput}
                value={color}
                onChangeText={setColor}
                placeholder="#000000"
              />
            </View>

            {/* Alignment */}
            <View style={styles.section}>
              <Text style={styles.label}>Alignment</Text>
              <View style={styles.alignmentRow}>
                {(['left', 'center', 'right'] as const).map((align) => (
                  <TouchableOpacity
                    key={align}
                    style={[
                      styles.alignmentButton,
                      alignment === align && styles.alignmentButtonActive,
                    ]}
                    onPress={() => setAlignment(align)}
                  >
                    <Text style={styles.alignmentButtonText}>
                      {align === 'left' ? '⬅' : align === 'center' ? '⬌' : '➡'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Text Effects */}
            <View style={styles.section}>
              <Text style={styles.label}>Text Effects</Text>
              <View style={styles.effectsRow}>
                <TouchableOpacity
                  style={[styles.effectButton, bold && styles.effectButtonActive]}
                  onPress={() => setBold(!bold)}
                >
                  <Text style={[styles.effectButtonText, { fontWeight: 'bold' }]}>B</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.effectButton, italic && styles.effectButtonActive]}
                  onPress={() => setItalic(!italic)}
                >
                  <Text style={[styles.effectButtonText, { fontStyle: 'italic' }]}>I</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.effectButton, underline && styles.effectButtonActive]}
                  onPress={() => setUnderline(!underline)}
                >
                  <Text style={[styles.effectButtonText, { textDecorationLine: 'underline' }]}>
                    U
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.effectButton, shadow && styles.effectButtonActive]}
                  onPress={() => setShadow(!shadow)}
                >
                  <Text style={styles.effectButtonText}>S</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Preview */}
            <View style={styles.section}>
              <Text style={styles.label}>Preview</Text>
              <View style={styles.previewContainer}>
                <Text
                  style={[
                    styles.previewText,
                    {
                      fontSize,
                      fontFamily,
                      color,
                      textAlign: alignment,
                      fontWeight: bold ? 'bold' : 'normal',
                      fontStyle: italic ? 'italic' : 'normal',
                      textDecorationLine: underline ? 'underline' : 'none',
                      textShadowColor: shadow ? '#000000' : 'transparent',
                      textShadowOffset: shadow ? { width: 2, height: 2 } : undefined,
                      textShadowRadius: shadow ? 3 : 0,
                    },
                  ]}
                >
                  {text || 'Preview text'}
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
  sizeControls: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeButtonText: {
    fontSize: 24,
    color: '#333',
  },
  fontButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  fontButtonActive: {
    backgroundColor: '#6200EE',
  },
  fontButtonText: {
    fontSize: 14,
    color: '#333',
  },
  fontButtonTextActive: {
    color: '#fff',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorButtonActive: {
    borderColor: '#6200EE',
    borderWidth: 3,
  },
  colorInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  alignmentRow: {
    flexDirection: 'row',
    gap: 12,
  },
  alignmentButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  alignmentButtonActive: {
    backgroundColor: '#6200EE',
  },
  alignmentButtonText: {
    fontSize: 20,
  },
  effectsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  effectButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  effectButtonActive: {
    backgroundColor: '#6200EE',
  },
  effectButtonText: {
    fontSize: 18,
    color: '#333',
  },
  previewContainer: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    minHeight: 100,
    justifyContent: 'center',
  },
  previewText: {
    fontSize: 24,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#6200EE',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

