import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useEditorStore, editorStore } from '../stores/editorStore';
import { useTemplateStore } from '../stores';
import EditorCanvas from '../components/editor/EditorCanvas';
import EditorToolbar from '../components/editor/EditorToolbar';
import TextEditorModal from '../components/editor/TextEditorModal';
import ImagePickerModal from '../components/editor/ImagePickerModal';
import ContextMenu from '../components/editor/ContextMenu';

type EditorScreenRouteProp = RouteProp<RootStackParamList, 'Editor'>;
type EditorScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Editor'>;

const { width: screenWidth } = Dimensions.get('window');

export default function EditorScreen() {
  const navigation = useNavigation<EditorScreenNavigationProp>();
  const route = useRoute<EditorScreenRouteProp>();
  const { templateId } = route.params;

  const {
    template,
    elements,
    selectedElementId,
    isLoading,
    loadTemplate,
    selectElement,
    updateElement,
    removeElement,
    duplicateElement,
    replaceImage,
    updateTextElement,
    bringToFront,
    sendToBack,
    undo,
    redo,
    canUndo,
    canRedo,
    saveToHistory,
  } = useEditorStore();

  const { loadTemplateById } = useTemplateStore();

  const [scale, setScale] = useState(0.5);
  const [textEditorVisible, setTextEditorVisible] = useState(false);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    loadTemplateData();
    calculateScale();
  }, [templateId]);


  const loadTemplateData = async () => {
    const templateData = await loadTemplateById(templateId);
    if (templateData) {
      loadTemplate(templateData);
    } else {
      Alert.alert('Error', 'Template not found', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  const calculateScale = () => {
    if (!template) return;
    const maxWidth = screenWidth - 40;
    const maxHeight = 600;
    const scaleX = maxWidth / template.dimensions.width;
    const scaleY = maxHeight / template.dimensions.height;
    setScale(Math.min(scaleX, scaleY, 0.6));
  };

  useEffect(() => {
    if (template) {
      calculateScale();
    }
  }, [template]);

  const handleElementSelect = (elementId: string | null) => {
    selectElement(elementId);
  };

  const handleElementDoubleTap = (elementId: string) => {
    const element = elements.find((el) => el.id === elementId);
    if (!element) return;

    // Ensure element is selected before opening editor
    selectElement(elementId);

    if (element.type === 'text') {
      setTextEditorVisible(true);
    } else if (element.type === 'image' && element.placeholder) {
      setImagePickerVisible(true);
    }
  };

  const handleElementSingleTap = (elementId: string) => {
    console.log('[EditorScreen] Tap on element:', elementId);
    const element = elements.find((el) => el.id === elementId);
    if (!element) {
      console.log('[EditorScreen] Element not found:', elementId);
      return;
    }

    console.log('[EditorScreen] Element found:', {
      id: element.id,
      type: element.type,
      placeholder: element.placeholder,
      hasUrl: !!element.url,
      position: element.position,
    });

    // Select the element first
    selectElement(elementId);
    
    // Verify selection was set
    setTimeout(() => {
      const selectedId = editorStore.getState().selectedElementId;
      console.log('[EditorScreen] Selected ID after selectElement:', selectedId);
      
      // For image placeholders OR images without URL, open picker
      if (element.type === 'image') {
        const isPlaceholder = element.placeholder || !element.url;
        console.log('[EditorScreen] Image element - isPlaceholder:', isPlaceholder);
        if (isPlaceholder) {
          console.log('[EditorScreen] Opening image picker');
          setImagePickerVisible(true);
        }
      } else if (element.type === 'text' && element.editable) {
        // For editable text, open text editor
        setTextEditorVisible(true);
      }
    }, 100);
  };

  const handleElementLongPress = (elementId: string) => {
    const element = elements.find((el) => el.id === elementId);
    if (!element || element.locked) return;

    // Get element position for context menu
    const elementPosition = element.position;
    setContextMenuPosition({
      x: elementPosition.x * scale + 100,
      y: elementPosition.y * scale + 100,
    });
    setContextMenuVisible(true);
  };

  const handleElementMove = (elementId: string, position: { x: number; y: number }) => {
    const element = elements.find((el) => el.id === elementId);
    if (element?.locked) return;

    saveToHistory();
    updateElement(elementId, { position });
  };

  const handleElementResize = (elementId: string, size: { width: number; height: number }) => {
    const element = elements.find((el) => el.id === elementId);
    if (element?.locked) return;

    saveToHistory();
    updateElement(elementId, { size });
  };

  const handleElementRotate = (elementId: string, rotation: number) => {
    const element = elements.find((el) => el.id === elementId);
    if (element?.locked) return;

    saveToHistory();
    updateElement(elementId, { rotation });
  };

  const handleTextSave = (options: any) => {
    if (!selectedElementId) return;

    saveToHistory();
    updateTextElement(selectedElementId, options);
    updateElement(selectedElementId, {
      text: options.text,
      fontSize: options.fontSize,
      fontFamily: options.fontFamily,
      color: options.color,
      alignment: options.alignment,
      bold: options.bold,
      italic: options.italic,
      underline: options.underline,
      shadow: options.shadow,
    });
  };

  const handleImageSelect = (imageUri: string) => {
    // Get the current selected element ID from the store (might have changed)
    const currentSelectedId = editorStore.getState().selectedElementId;
    const elementIdToUpdate = currentSelectedId || selectedElementId;
    
    if (!elementIdToUpdate) {
      Alert.alert('Error', 'No element selected. Please select an image element first.');
      return;
    }

    const element = elements.find((el) => el.id === elementIdToUpdate);
    if (!element || element.type !== 'image') {
      Alert.alert('Error', 'Selected element is not an image. Please select an image element first.');
      return;
    }

    try {
      saveToHistory();
      
      // Update element with new URL and remove placeholder flag
      updateElement(elementIdToUpdate, {
        url: imageUri,
        placeholder: false,
      });
      
      // Also call replaceImage for store consistency
      replaceImage(elementIdToUpdate, imageUri);
    } catch (error: any) {
      console.error('[EditorScreen] Error updating image:', error);
      Alert.alert('Error', `Failed to update image: ${error.message || 'Unknown error'}`);
    }
  };

  const handleContextMenuAction = (action: 'duplicate' | 'delete' | 'lock' | 'unlock' | 'front' | 'back') => {
    if (!selectedElementId) return;

    const element = elements.find((el) => el.id === selectedElementId);
    if (!element) return;

    saveToHistory();

    switch (action) {
      case 'duplicate':
        duplicateElement(selectedElementId);
        break;
      case 'delete':
        Alert.alert('Delete Element', 'Are you sure you want to delete this element?', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => removeElement(selectedElementId),
          },
        ]);
        break;
      case 'lock':
        updateElement(selectedElementId, { locked: true });
        break;
      case 'unlock':
        updateElement(selectedElementId, { locked: false });
        break;
      case 'front':
        bringToFront(selectedElementId);
        break;
      case 'back':
        sendToBack(selectedElementId);
        break;
    }
  };

  const handleExport = () => {
    // Navigate to export screen with current template
    navigation.navigate('Export', { templateId: template?.id || templateId });
  };

  const handleFilter = () => {
    Alert.alert('Filters', 'Filter functionality will be implemented soon!');
  };

  const handleSticker = () => {
    Alert.alert('Stickers', 'Sticker functionality will be implemented soon!');
  };

  if (isLoading || !template) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.loadingText}>Loading template...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const selectedElement = selectedElementId
    ? elements.find((el) => el.id === selectedElementId)
    : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Template</Text>
      </View>

      <EditorCanvas
        template={template}
        elements={elements}
        scale={scale}
        selectedElementId={selectedElementId}
        onElementSelect={handleElementSingleTap}
        onElementDoubleTap={handleElementDoubleTap}
        onElementLongPress={handleElementLongPress}
        onElementMove={handleElementMove}
        onElementResize={handleElementResize}
        onElementRotate={handleElementRotate}
      />

      <EditorToolbar
        canUndo={canUndo()}
        canRedo={canRedo()}
        onUndo={undo}
        onRedo={redo}
        onFilter={handleFilter}
        onSticker={handleSticker}
        onExport={handleExport}
        isPremium={template.isPremium || false}
      />

      {/* Modals */}
      <TextEditorModal
        visible={textEditorVisible}
        element={selectedElement || null}
        onClose={() => setTextEditorVisible(false)}
        onSave={handleTextSave}
      />

      <ImagePickerModal
        visible={imagePickerVisible}
        onClose={() => setImagePickerVisible(false)}
        onSelect={handleImageSelect}
      />

      <ContextMenu
        visible={contextMenuVisible}
        position={contextMenuPosition}
        onClose={() => setContextMenuVisible(false)}
        onDuplicate={() => handleContextMenuAction('duplicate')}
        onDelete={() => handleContextMenuAction('delete')}
        onLock={() => handleContextMenuAction('lock')}
        onUnlock={() => handleContextMenuAction('unlock')}
        onBringToFront={() => handleContextMenuAction('front')}
        onSendToBack={() => handleContextMenuAction('back')}
        isLocked={selectedElement?.locked || false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});
