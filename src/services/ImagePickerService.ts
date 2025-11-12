import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { Platform, Alert, Linking } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export interface ImagePickerOptions {
  mediaType?: MediaType;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  allowsEditing?: boolean;
  aspect?: [number, number];
}

export interface ImagePickerResult {
  uri: string;
  width: number;
  height: number;
  fileSize?: number;
  type?: string;
}

export class ImagePickerService {
  static async requestCameraPermission(): Promise<boolean> {
    try {
      const permission = Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.CAMERA 
        : PERMISSIONS.ANDROID.CAMERA;

      const result = await check(permission);
      
      if (result === RESULTS.GRANTED) {
        return true;
      }

      if (result === RESULTS.DENIED) {
        const requestResult = await request(permission);
        return requestResult === RESULTS.GRANTED;
      }

      if (result === RESULTS.BLOCKED || result === RESULTS.UNAVAILABLE) {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to take photos. Please enable it in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
        return false;
      }

      return false;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  }

  static async requestPhotoLibraryPermission(): Promise<boolean> {
    try {
      const permission = Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.PHOTO_LIBRARY 
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

      const result = await check(permission);
      
      if (result === RESULTS.GRANTED) {
        return true;
      }

      if (result === RESULTS.DENIED) {
        const requestResult = await request(permission);
        return requestResult === RESULTS.GRANTED;
      }

      if (result === RESULTS.BLOCKED || result === RESULTS.UNAVAILABLE) {
        Alert.alert(
          'Permission Required',
          'Photo library permission is required to select images. Please enable it in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
        return false;
      }

      return false;
    } catch (error) {
      console.error('Error requesting photo library permission:', error);
      return false;
    }
  }

  static async pickFromGallery(options: ImagePickerOptions = {}): Promise<ImagePickerResult | null> {
    try {
      const hasPermission = await this.requestPhotoLibraryPermission();
      if (!hasPermission) {
        return null;
      }

      const defaultOptions = {
        mediaType: 'photo' as MediaType,
        quality: 0.8,
        maxWidth: 2048,
        maxHeight: 2048,
        allowsEditing: true,
        aspect: [1, 1] as [number, number],
        ...options,
      };

      return new Promise((resolve) => {
        launchImageLibrary(defaultOptions, (response: ImagePickerResponse) => {
          if (response.didCancel || response.errorMessage) {
            resolve(null);
            return;
          }

          if (response.assets && response.assets.length > 0) {
            const asset = response.assets[0];
            resolve({
              uri: asset.uri || '',
              width: asset.width || 0,
              height: asset.height || 0,
              fileSize: asset.fileSize,
              type: asset.type,
            });
          } else {
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      return null;
    }
  }

  static async takePhoto(options: ImagePickerOptions = {}): Promise<ImagePickerResult | null> {
    try {
      const hasPermission = await this.requestCameraPermission();
      if (!hasPermission) {
        return null;
      }

      const defaultOptions = {
        mediaType: 'photo' as MediaType,
        quality: 0.8,
        maxWidth: 2048,
        maxHeight: 2048,
        allowsEditing: true,
        aspect: [1, 1] as [number, number],
        ...options,
      };

      return new Promise((resolve) => {
        launchCamera(defaultOptions, (response: ImagePickerResponse) => {
          if (response.didCancel || response.errorMessage) {
            resolve(null);
            return;
          }

          if (response.assets && response.assets.length > 0) {
            const asset = response.assets[0];
            resolve({
              uri: asset.uri || '',
              width: asset.width || 0,
              height: asset.height || 0,
              fileSize: asset.fileSize,
              type: asset.type,
            });
          } else {
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    }
  }

  static async showImagePicker(options: ImagePickerOptions = {}): Promise<ImagePickerResult | null> {
    return new Promise((resolve) => {
      Alert.alert(
        'Select Image',
        'Choose how you want to add an image',
        [
          {
            text: 'Camera',
            onPress: async () => {
              const result = await this.takePhoto(options);
              resolve(result);
            },
          },
          {
            text: 'Photo Library',
            onPress: async () => {
              const result = await this.pickFromGallery(options);
              resolve(result);
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(null),
          },
        ],
        { cancelable: true }
      );
    });
  }

  static async pickMultipleImages(options: ImagePickerOptions = {}): Promise<ImagePickerResult[]> {
    try {
      const hasPermission = await this.requestPhotoLibraryPermission();
      if (!hasPermission) {
        return [];
      }

      const defaultOptions = {
        mediaType: 'photo' as MediaType,
        quality: 0.8,
        maxWidth: 2048,
        maxHeight: 2048,
        allowsEditing: false,
        selectionLimit: 10,
        ...options,
      };

      return new Promise((resolve) => {
        launchImageLibrary(defaultOptions, (response: ImagePickerResponse) => {
          if (response.didCancel || response.errorMessage) {
            resolve([]);
            return;
          }

          if (response.assets && response.assets.length > 0) {
            const results = response.assets.map(asset => ({
              uri: asset.uri || '',
              width: asset.width || 0,
              height: asset.height || 0,
              fileSize: asset.fileSize,
              type: asset.type,
            }));
            resolve(results);
          } else {
            resolve([]);
          }
        });
      });
    } catch (error) {
      console.error('Error picking multiple images:', error);
      return [];
    }
  }
}
