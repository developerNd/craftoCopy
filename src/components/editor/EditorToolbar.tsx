import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface EditorToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onFilter: () => void;
  onSticker: () => void;
  onExport: () => void;
  isPremium: boolean;
}

export default function EditorToolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onFilter,
  onSticker,
  onExport,
  isPremium,
}: EditorToolbarProps) {
  const handleFilter = () => {
    if (!isPremium) {
      Alert.alert('Premium Feature', 'Filters are available for premium users only.');
      return;
    }
    onFilter();
  };

  const handleSticker = () => {
    if (!isPremium) {
      Alert.alert('Premium Feature', 'Stickers are available for premium users only.');
      return;
    }
    onSticker();
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.toolbar}
      >
        {/* Undo/Redo */}
        <TouchableOpacity
          style={[styles.toolButton, !canUndo && styles.toolButtonDisabled]}
          onPress={onUndo}
          disabled={!canUndo}
        >
          <Text style={styles.toolIcon}>↶</Text>
          <Text style={styles.toolLabel}>Undo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolButton, !canRedo && styles.toolButtonDisabled]}
          onPress={onRedo}
          disabled={!canRedo}
        >
          <Text style={styles.toolIcon}>↷</Text>
          <Text style={styles.toolLabel}>Redo</Text>
        </TouchableOpacity>

        {/* Filters */}
        <TouchableOpacity style={styles.toolButton} onPress={handleFilter}>
          <Text style={styles.toolIcon}>🎨</Text>
          <Text style={styles.toolLabel}>Filters</Text>
          {!isPremium && <Text style={styles.premiumBadge}>⭐</Text>}
        </TouchableOpacity>

        {/* Stickers */}
        <TouchableOpacity style={styles.toolButton} onPress={handleSticker}>
          <Text style={styles.toolIcon}>✨</Text>
          <Text style={styles.toolLabel}>Stickers</Text>
          {!isPremium && <Text style={styles.premiumBadge}>⭐</Text>}
        </TouchableOpacity>

        {/* Export */}
        <TouchableOpacity style={styles.exportButton} onPress={onExport}>
          <Text style={styles.exportButtonText}>📤 Export</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  toolButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    minWidth: 70,
    position: 'relative',
  },
  toolButtonDisabled: {
    opacity: 0.5,
  },
  toolIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  toolLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  premiumBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    fontSize: 12,
  },
  exportButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#6200EE',
    marginLeft: 8,
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

