// Permission utilities for camera, gallery, storage
import { Platform, Alert, Linking } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, Permission } from 'react-native-permissions';

/**
 * Permission types
 */
export type PermissionType = 'camera' | 'gallery' | 'storage';

/**
 * Get platform-specific permission
 */
const getPermission = (type: PermissionType): Permission => {
  const permissions = {
    camera: Platform.select({
      ios: PERMISSIONS.IOS.CAMERA,
      android: PERMISSIONS.ANDROID.CAMERA,
    }),
    gallery: Platform.select({
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    }),
    storage: Platform.select({
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    }),
  };

  return permissions[type] as Permission;
};

/**
 * Permission messages
 */
const getPermissionMessage = (type: PermissionType): { title: string; message: string } => {
  const messages = {
    camera: {
      title: 'Camera Permission Required',
      message: 'Craftify needs access to your camera to take photos for templates. Please grant permission in Settings.',
    },
    gallery: {
      title: 'Gallery Permission Required',
      message: 'Craftify needs access to your photo library to select images for templates. Please grant permission in Settings.',
    },
    storage: {
      title: 'Storage Permission Required',
      message: 'Craftify needs access to storage to save exported images. Please grant permission in Settings.',
    },
  };

  return messages[type];
};

/**
 * Check if permission is granted
 */
export const checkPermission = async (type: PermissionType): Promise<boolean> => {
  try {
    const permission = getPermission(type);
    const result = await check(permission);
    return result === RESULTS.GRANTED;
  } catch (error) {
    console.error(`Error checking ${type} permission:`, error);
    return false;
  }
};

/**
 * Request permission
 */
export const requestPermission = async (type: PermissionType): Promise<boolean> => {
  try {
    const permission = getPermission(type);
    const result = await request(permission);
    return result === RESULTS.GRANTED;
  } catch (error) {
    console.error(`Error requesting ${type} permission:`, error);
    return false;
  }
};

/**
 * Check and request permission with user-friendly messages
 */
export const ensurePermission = async (type: PermissionType): Promise<boolean> => {
  // Check if permission is already granted
  const hasPermission = await checkPermission(type);
  if (hasPermission) {
    return true;
  }

  // Request permission
  const granted = await requestPermission(type);
  if (granted) {
    return true;
  }

  // Show alert if permission denied
  const { title, message } = getPermissionMessage(type);
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Open Settings',
        onPress: () => Linking.openSettings(),
      },
    ]
  );

  return false;
};

/**
 * Request multiple permissions
 */
export const ensureMultiplePermissions = async (
  types: PermissionType[]
): Promise<boolean> => {
  const results = await Promise.all(types.map(type => ensurePermission(type)));
  return results.every(result => result === true);
};

export default {
  checkPermission,
  requestPermission,
  ensurePermission,
  ensureMultiplePermissions,
};
