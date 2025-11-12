import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { Template, Element } from '../types';

interface TemplateRendererProps {
  template: Template;
  scale?: number;
  showPlaceholders?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export default function TemplateRenderer({ 
  template, 
  scale = 1, 
  showPlaceholders = true 
}: TemplateRendererProps) {
  // Add safety checks for template dimensions
  if (!template.dimensions) {
    console.warn('Template missing dimensions:', template);
    return null;
  }

  const canvasWidth = (template.dimensions.width || 1080) * scale;
  const canvasHeight = (template.dimensions.height || 1920) * scale;

  const renderElement = (element: Element) => {
    // Add safety checks for required properties
    if (!element.position) {
      console.warn('Element missing position:', element);
      return null;
    }

    // Calculate default size for text elements if missing
    const getElementSize = () => {
      if (element.size) {
        return element.size;
      }
      // For text elements without size, calculate based on content
      if (element.type === 'text') {
        const text = element.text || element.placeholderText || '';
        const fontSize = element.fontSize || 16;
        // Estimate: roughly 0.6 * fontSize per character, minimum width 200px
        const estimatedWidth = Math.max(text.length * fontSize * 0.6, 200);
        const estimatedHeight = fontSize * 1.5; // Line height
        return { width: estimatedWidth, height: estimatedHeight };
      }
      // Default size for other elements
      return { width: 100, height: 100 };
    };

    const elementSize = getElementSize();

    const elementStyle = {
      position: 'absolute' as const,
      left: (element.position.x || 0) * scale,
      top: (element.position.y || 0) * scale,
      width: elementSize.width * scale,
      height: elementSize.height * scale,
      opacity: element.opacity || 1,
      transform: element.rotation ? [{ rotate: `${element.rotation}deg` }] : undefined,
    };

    switch (element.type) {
      case 'text':
        return (
          <Text
            key={element.id}
            style={[
              elementStyle,
              {
                fontSize: (element.fontSize || 16) * scale,
                fontFamily: element.fontFamily || 'System',
                color: element.color || '#000000',
                textAlign: element.alignment || 'left',
                maxWidth: elementSize.width * scale,
              },
            ]}
            numberOfLines={0}
          >
            {element.text || element.placeholderText || ''}
          </Text>
        );

      case 'image':
        // Only render images with URLs in TemplateRenderer (used for background layer)
        // Placeholders are handled by EditableElement
        if (element.url) {
          return (
            <Image
              key={element.id}
              source={{ uri: element.url }}
              style={[
                elementStyle,
                {
                  borderRadius: element.shape === 'circle' ? (elementSize.width * scale) / 2 : 0,
                  borderWidth: element.border?.width ? element.border.width * scale : 0,
                  borderColor: element.border?.color || 'transparent',
                },
              ]}
              resizeMode="cover"
            />
          );
        }
        // Don't render placeholders here - EditableElement handles them
        return null;

      case 'shape':
        return (
          <View
            key={element.id}
            style={[
              elementStyle,
              {
                backgroundColor: element.color || '#000000',
                borderRadius: element.shape === 'circle' ? (elementSize.width * scale) / 2 : 0,
                borderWidth: element.border?.width ? element.border.width * scale : 0,
                borderColor: element.border?.color || 'transparent',
              },
            ]}
          />
        );

      case 'sticker':
        return (
          <View
            key={element.id}
            style={[
              elementStyle,
              styles.stickerPlaceholder,
            ]}
          >
            <Text style={styles.stickerText}>🎨</Text>
          </View>
        );

      default:
        return null;
    }
  };

  const renderBackground = () => {
    if (template.background.type === 'color') {
      return (
        <View
          style={[
            styles.background,
            {
              width: canvasWidth,
              height: canvasHeight,
              backgroundColor: template.background.color,
            },
          ]}
        />
      );
    } else if (template.background.type === 'image' && template.background.url) {
      return (
        <Image
          source={{ uri: template.background.url }}
          style={[
            styles.background,
            {
              width: canvasWidth,
              height: canvasHeight,
            },
          ]}
          resizeMode="cover"
        />
      );
    }
    return (
      <View
        style={[
          styles.background,
          {
            width: canvasWidth,
            height: canvasHeight,
            backgroundColor: '#f0f0f0',
          },
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.canvas}>
        {renderBackground()}
        {/* Only render non-image elements and images with URLs in TemplateRenderer */}
        {template.elements
          .filter((element) => {
            // Skip image placeholders - they're handled by EditableElement
            if (element.type === 'image' && !element.url) {
              return false;
            }
            return true;
          })
          .map(renderElement)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  imagePlaceholder: {
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 24,
    color: '#6c757d',
  },
  stickerPlaceholder: {
    backgroundColor: '#fff3cd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  stickerText: {
    fontSize: 20,
  },
});
