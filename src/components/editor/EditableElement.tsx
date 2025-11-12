import React, { useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, PanResponder } from 'react-native';
import { EditorElement } from '../../types';

interface EditableElementProps {
  element: EditorElement;
  scale: number;
  onSelect: () => void;
  onDoubleTap: () => void;
  onLongPress: () => void;
  onMove: (position: { x: number; y: number }) => void;
  onResize: (size: { width: number; height: number }) => void;
  onRotate: (rotation: number) => void;
  showPlaceholders?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export default function EditableElement({
  element,
  scale,
  onSelect,
  onDoubleTap,
  onLongPress,
  onMove,
  onResize,
  onRotate,
  showPlaceholders = true,
}: EditableElementProps) {
  const [gestureState, setGestureState] = useState({
    translateX: 0,
    translateY: 0,
    scale: 1,
    rotation: element.rotation || 0,
  });

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastTapRef = useRef(0);

  const getElementSize = () => {
    if (element.size) {
      return element.size;
    }
    if (element.type === 'text') {
      const text = element.text || element.placeholderText || '';
      const fontSize = element.fontSize || 16;
      const estimatedWidth = Math.max(text.length * fontSize * 0.6, 200);
      const estimatedHeight = fontSize * 1.5;
      return { width: estimatedWidth, height: estimatedHeight };
    }
    return { width: 100, height: 100 };
  };

  // PanResponder for drag gestures - only captures when movement detected
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only capture if there's significant movement (drag detected)
        const moveThreshold = 10;
        const isSignificantMove = Math.abs(gestureState.dx) > moveThreshold || Math.abs(gestureState.dy) > moveThreshold;
        if (isSignificantMove && !element.locked) {
          if (!isDragging.current) {
            isDragging.current = true;
          }
        }
        return isSignificantMove && !element.locked;
      },
      onPanResponderGrant: (evt) => {
        dragStart.current = {
          x: evt.nativeEvent.pageX,
          y: evt.nativeEvent.pageY,
        };
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!element.locked && isDragging.current) {
          setGestureState((prev) => ({
            ...prev,
            translateX: gestureState.dx / scale,
            translateY: gestureState.dy / scale,
          }));
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (isDragging.current && !element.locked) {
          const newPosition = {
            x: element.position.x + gestureState.dx / scale,
            y: element.position.y + gestureState.dy / scale,
          };
          onMove(newPosition);
        }
        isDragging.current = false;
        setGestureState((prev) => ({ ...prev, translateX: 0, translateY: 0 }));
      },
      onPanResponderTerminate: () => {
        isDragging.current = false;
        setGestureState((prev) => ({ ...prev, translateX: 0, translateY: 0 }));
      },
    })
  ).current;

  const handleTap = () => {
    // Only handle tap if not dragging
    if (isDragging.current) {
      return;
    }
    
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      onDoubleTap();
      lastTapRef.current = 0;
    } else {
      onSelect();
      lastTapRef.current = now;
    }
  };

  const handleLongPress = () => {
    if (!isDragging.current && !element.locked) {
      console.log('[EditableElement] Long press detected');
      onLongPress();
    }
  };

  const renderElement = () => {
    const elementSize = getElementSize();
    
    const elementStyle = {
      width: '100%',
      height: '100%',
      opacity: element.opacity || 1,
      transform: [
        { translateX: gestureState.translateX * scale },
        { translateY: gestureState.translateY * scale },
        { scale: gestureState.scale },
        { rotate: `${gestureState.rotation}deg` },
      ],
    };

    switch (element.type) {
      case 'text':
        return (
          <Text
            style={[
              elementStyle,
              {
                fontSize: (element.fontSize || 16) * scale,
                fontFamily: element.fontFamily || 'System',
                color: element.color || '#000000',
                textAlign: element.alignment || 'left',
                maxWidth: '100%',
                fontWeight: (element as any).bold ? 'bold' : 'normal',
                fontStyle: (element as any).italic ? 'italic' : 'normal',
                textDecorationLine: (element as any).underline ? 'underline' : 'none',
                textShadowColor: (element as any).shadow ? '#000000' : 'transparent',
                textShadowOffset: (element as any).shadow ? { width: 2, height: 2 } : undefined,
                textShadowRadius: (element as any).shadow ? 3 : 0,
              },
            ]}
            numberOfLines={0}
          >
            {element.text || element.placeholderText || ''}
          </Text>
        );

      case 'image':
        if (element.url) {
          return (
            <Image
              key={`image-${element.id}-${element.url}`}
              source={{ uri: element.url }}
              style={[
                elementStyle,
                {
                  borderRadius: element.shape === 'circle' ? 9999 : 0,
                  borderWidth: element.border?.width ? element.border.width * scale : 0,
                  borderColor: element.border?.color || 'transparent',
                },
              ]}
              resizeMode="cover"
              onLoad={() => {
                console.log('[EditableElement] Image loaded:', element.id);
              }}
              onError={(error) => {
                console.error('[EditableElement] Image load failed:', element.id, error.nativeEvent?.error || 'Unknown error');
              }}
            />
          );
        } else {
          return (
            <View
              style={[
                elementStyle,
                styles.imagePlaceholder,
                {
                  borderRadius: element.shape === 'circle' ? 9999 : 8,
                  borderWidth: element.border?.width ? element.border.width * scale : 2,
                  borderColor: element.border?.color || '#ccc',
                  borderStyle: 'dashed',
                },
              ]}
            >
              <Text style={styles.placeholderText}>📷</Text>
              {element.placeholder && (
                <Text style={styles.placeholderLabel}>Tap to add image</Text>
              )}
            </View>
          );
        }

      case 'shape':
        return (
          <View
            style={[
              elementStyle,
              {
                backgroundColor: element.color || '#000000',
                borderRadius: element.shape === 'circle'
                  ? ((elementSize.width * gestureState.scale) * scale) / 2
                  : 0,
                borderWidth: element.border?.width ? element.border.width * scale : 0,
                borderColor: element.border?.color || 'transparent',
              },
            ]}
          />
        );

      case 'sticker':
        return (
          <View
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

  const elementSize = getElementSize();

  return (
    <View
      style={[
        {
          position: 'absolute',
          left: element.position.x * scale,
          top: element.position.y * scale,
          width: elementSize.width * scale,
          height: elementSize.height * scale,
          zIndex: element.zIndex || 0,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleTap}
        onLongPress={handleLongPress}
        delayLongPress={500}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          {renderElement()}
          {element.isSelected && (
            <View
              style={[
                {
                  position: 'absolute',
                  left: -4,
                  top: -4,
                  width: elementSize.width * scale + 8,
                  height: elementSize.height * scale + 8,
                  borderWidth: 2,
                  borderColor: '#6200EE',
                  borderStyle: 'dashed',
                },
              ]}
              pointerEvents="none"
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  imagePlaceholder: {
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  placeholderText: {
    fontSize: 24,
    color: '#6c757d',
  },
  placeholderLabel: {
    fontSize: 10,
    color: '#6c757d',
    marginTop: 4,
  },
  stickerPlaceholder: {
    backgroundColor: '#fff3cd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
    flex: 1,
  },
  stickerText: {
    fontSize: 20,
  },
});
