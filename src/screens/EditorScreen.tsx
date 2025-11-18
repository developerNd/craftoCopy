import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  ScrollView,
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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function EditorScreen() {
  const navigation = useNavigation<EditorScreenNavigationProp>();
  const route = useRoute<EditorScreenRouteProp>();
  const { templateId, initialData } = route.params;

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
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  useEffect(() => {
    loadTemplateData();
    calculateScale();
  }, [templateId]);


  const loadTemplateData = async () => {
    const templateData = await loadTemplateById(templateId);
    if (templateData) {
      loadTemplate(templateData);

      // Apply initial data if provided
      if (initialData) {
        applyInitialData(initialData);
      }
    } else {
      Alert.alert('Error', 'Template not found', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  const applyInitialData = (data: any) => {
    // Apply data to template elements based on their IDs
    setTimeout(() => {
      const currentElements = editorStore.getState().elements;

      currentElements.forEach((element) => {
        const elementId = element.id.toLowerCase();

        // Apply name
        if (data.name && elementId.includes('name') && element.type === 'text') {
          updateElement(element.id, { text: data.name });
        }

        // Apply about/description
        if (data.about && (elementId.includes('about') || elementId.includes('description')) && element.type === 'text') {
          updateElement(element.id, { text: data.about });
        }

        // Apply image
        if (data.imageUrl && (elementId.includes('photo') || elementId.includes('image')) && element.type === 'image') {
          updateElement(element.id, { url: data.imageUrl, placeholder: false });
        }

        // Apply date
        if (data.date && elementId.includes('date') && element.type === 'text') {
          updateElement(element.id, { text: data.date });
        }

        // Apply phone
        if (data.phone && elementId.includes('phone') && element.type === 'text') {
          updateElement(element.id, { text: data.phone });
        }

        // Apply email
        if (data.email && elementId.includes('email') && element.type === 'text') {
          updateElement(element.id, { text: data.email });
        }

        // Apply address
        if (data.address && elementId.includes('address') && element.type === 'text') {
          updateElement(element.id, { text: data.address });
        }
      });
    }, 500); // Small delay to ensure template is fully loaded
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

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 1.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.3));
  };

  const handleResetZoom = () => {
    calculateScale();
  };

  const handleLayerUp = () => {
    if (selectedElementId) {
      saveToHistory();
      bringToFront(selectedElementId);
    }
  };

  const handleLayerDown = () => {
    if (selectedElementId) {
      saveToHistory();
      sendToBack(selectedElementId);
    }
  };

  const handleDuplicate = () => {
    if (selectedElementId) {
      saveToHistory();
      duplicateElement(selectedElementId);
    }
  };

  const handleDelete = () => {
    if (selectedElementId) {
      Alert.alert('Delete Element', 'Are you sure you want to delete this element?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            saveToHistory();
            removeElement(selectedElementId);
          },
        },
      ]);
    }
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
      {/* Header with advanced controls */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Edit Template</Text>
          <Text style={styles.headerSubtitle}>
            {selectedElement ? `Selected: ${selectedElement.type}` : 'Tap to select'}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowLayersPanel(!showLayersPanel)}
          >
            <Text style={styles.headerButtonText}>☰</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.editorContainer}>
        {/* Canvas Area */}
        <View style={styles.canvasWrapper}>
          <ScrollView
            style={styles.canvasScroll}
            contentContainerStyle={styles.canvasScrollContent}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
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
          </ScrollView>

          {/* Zoom Controls */}
          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
              <Text style={styles.zoomButtonText}>−</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.zoomButton} onPress={handleResetZoom}>
              <Text style={styles.zoomButtonPercentage}>{Math.round(scale * 100)}%</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
              <Text style={styles.zoomButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Actions (when element is selected) */}
          {selectedElement && showQuickActions && (
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickActionButton} onPress={handleLayerUp}>
                <Text style={styles.quickActionText}>⬆️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton} onPress={handleLayerDown}>
                <Text style={styles.quickActionText}>⬇️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton} onPress={handleDuplicate}>
                <Text style={styles.quickActionText}>📋</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton} onPress={handleDelete}>
                <Text style={styles.quickActionText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Layers Panel (Slide-in) */}
        {showLayersPanel && (
          <View style={styles.layersPanel}>
            <View style={styles.layersPanelHeader}>
              <Text style={styles.layersPanelTitle}>Layers</Text>
              <TouchableOpacity onPress={() => setShowLayersPanel(false)}>
                <Text style={styles.layersPanelClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.layersList}>
              {elements.map((element, index) => (
                <TouchableOpacity
                  key={element.id}
                  style={[
                    styles.layerItem,
                    element.id === selectedElementId && styles.layerItemSelected,
                  ]}
                  onPress={() => selectElement(element.id)}
                >
                  <Text style={styles.layerIcon}>
                    {element.type === 'image' ? '🖼️' :
                     element.type === 'text' ? '📝' :
                     element.type === 'shape' ? '⬛' : '📄'}
                  </Text>
                  <View style={styles.layerInfo}>
                    <Text style={styles.layerName}>
                      {element.type === 'text' ? element.text || 'Text' :
                       element.type === 'image' ? (element.placeholder ? 'Image Placeholder' : 'Image') :
                       element.type}
                    </Text>
                    <Text style={styles.layerType}>{element.type}</Text>
                  </View>
                  {element.locked && <Text style={styles.layerLock}>🔒</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Enhanced Toolbar */}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6200EE',
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerButtonText: {
    fontSize: 20,
    color: '#6200EE',
  },
  editorContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  canvasWrapper: {
    flex: 1,
    position: 'relative',
  },
  canvasScroll: {
    flex: 1,
  },
  canvasScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  zoomControls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  zoomButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  zoomButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  zoomButtonPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  quickActions: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  quickActionButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  quickActionText: {
    fontSize: 20,
  },
  layersPanel: {
    width: 250,
    backgroundColor: '#fff',
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  layersPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  layersPanelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  layersPanelClose: {
    fontSize: 20,
    color: '#666',
  },
  layersList: {
    flex: 1,
  },
  layerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  layerItemSelected: {
    backgroundColor: '#f0f0ff',
    borderLeftWidth: 3,
    borderLeftColor: '#6200EE',
  },
  layerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  layerInfo: {
    flex: 1,
  },
  layerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  layerType: {
    fontSize: 11,
    color: '#999',
    textTransform: 'capitalize',
  },
  layerLock: {
    fontSize: 16,
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
