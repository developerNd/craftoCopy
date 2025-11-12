import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

interface ContextMenuProps {
  visible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onLock: () => void;
  onUnlock: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  isLocked?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ContextMenu({
  visible,
  position,
  onClose,
  onDuplicate,
  onDelete,
  onLock,
  onUnlock,
  onBringToFront,
  onSendToBack,
  isLocked = false,
}: ContextMenuProps) {
  if (!visible) return null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  const menuStyle = {
    position: 'absolute' as const,
    left: Math.min(position.x, screenWidth - 200),
    top: Math.min(position.y, screenHeight - 300),
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.menu, menuStyle]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleAction(onDuplicate)}
          >
            <Text style={styles.menuIcon}>📋</Text>
            <Text style={styles.menuText}>Duplicate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleAction(isLocked ? onUnlock : onLock)}
          >
            <Text style={styles.menuIcon}>{isLocked ? '🔓' : '🔒'}</Text>
            <Text style={styles.menuText}>{isLocked ? 'Unlock' : 'Lock'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleAction(onBringToFront)}
          >
            <Text style={styles.menuIcon}>⬆️</Text>
            <Text style={styles.menuText}>Bring to Front</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleAction(onSendToBack)}
          >
            <Text style={styles.menuIcon}>⬇️</Text>
            <Text style={styles.menuText}>Send to Back</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={[styles.menuItem, styles.dangerItem]}
            onPress={() => handleAction(onDelete)}
          >
            <Text style={styles.menuIcon}>🗑️</Text>
            <Text style={[styles.menuText, styles.dangerText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },
  dangerItem: {
    backgroundColor: '#fff5f5',
  },
  dangerText: {
    color: '#e74c3c',
  },
});

