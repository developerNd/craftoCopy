import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Template, EditorElement } from '../../types';
import TemplateRenderer from '../TemplateRenderer';
import EditableElement from './EditableElement';

interface EditorCanvasProps {
  template: Template;
  elements: EditorElement[];
  scale: number;
  selectedElementId: string | null;
  onElementSelect: (elementId: string | null) => void;
  onElementDoubleTap: (elementId: string) => void;
  onElementLongPress: (elementId: string) => void;
  onElementMove: (elementId: string, position: { x: number; y: number }) => void;
  onElementResize: (elementId: string, size: { width: number; height: number }) => void;
  onElementRotate: (elementId: string, rotation: number) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function EditorCanvas({
  template,
  elements,
  scale,
  selectedElementId,
  onElementSelect,
  onElementDoubleTap,
  onElementLongPress,
  onElementMove,
  onElementResize,
  onElementRotate,
}: EditorCanvasProps) {
  const canvasWidth = template.dimensions.width * scale;
  const canvasHeight = template.dimensions.height * scale;

  // Sort elements by zIndex for proper layering
  const sortedElements = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  
  // Debug: Log all image elements
  const imageElements = sortedElements.filter(el => el.type === 'image');
  console.log('[EditorCanvas] All image elements in template:', imageElements.map(el => ({
    id: el.id,
    position: el.position,
    hasUrl: !!el.url,
    placeholder: el.placeholder,
    locked: el.locked,
  })));

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        maximumZoomScale={2}
        minimumZoomScale={0.5}
        bouncesZoom={true}
      >
        <View
          style={[
            styles.canvas,
            {
              width: canvasWidth,
              height: canvasHeight,
            },
          ]}
        >
          {/* Background */}
          <TemplateRenderer
            template={template}
            scale={scale}
            showPlaceholders={false}
          />

          {/* Editable Elements */}
          {sortedElements.map((element) => (
            <EditableElement
              key={`${element.id}-${element.url || 'no-url'}`}
              element={element}
              scale={scale}
              onSelect={() => onElementSelect(element.id)}
              onDoubleTap={() => onElementDoubleTap(element.id)}
              onLongPress={() => onElementLongPress(element.id)}
              onMove={(position) => onElementMove(element.id, position)}
              onResize={(size) => onElementResize(element.id, size)}
              onRotate={(rotation) => onElementRotate(element.id, rotation)}
              showPlaceholders={true}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  canvas: {
    position: 'relative',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});

