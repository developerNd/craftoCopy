import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';

interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (imageUri: string) => void;
}

export default function ImagePickerModal({
  visible,
  onClose,
  onSelect,
}: ImagePickerModalProps) {
  const [loading, setLoading] = useState(false);


  const handleImagePicker = (response: ImagePickerResponse) => {
    if (response.didCancel) {
      return;
    }

    if (response.errorCode || response.errorMessage) {
      const errorMessage = response.errorMessage || `Error code: ${response.errorCode}`;
      console.error('[ImagePickerModal] Error:', response.errorCode, errorMessage);
      Alert.alert('Error', `Failed to load image: ${errorMessage}`);
      setLoading(false);
      return;
    }

    const asset = response.assets?.[0];
    if (asset?.uri) {
      setLoading(true);
      setTimeout(() => {
        onSelect(asset.uri);
        setLoading(false);
        onClose();
      }, 100);
    } else {
      setLoading(false);
      Alert.alert('Error', 'No image was selected. Please try again.');
    }
  };

  const getGalleryPermission = () => {
    if (Platform.OS === 'ios') {
      return PERMISSIONS.IOS.PHOTO_LIBRARY;
    }
    // Android 13+ (API 33+)
    if (Platform.Version >= 33) {
      return PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
    }
    // Android 12 and below
    return PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
  };

  const requestGalleryPermission = async () => {
    setLoading(true);
    
    try {
      const permission = getGalleryPermission();
      const result = await check(permission);
      
      if (result === RESULTS.GRANTED) {
        setLoading(false);
        openGallery();
      } else if (result === RESULTS.DENIED) {
        const requestResult = await request(permission);
        
        if (requestResult === RESULTS.GRANTED) {
          setLoading(false);
          openGallery();
        } else {
          setLoading(false);
          Alert.alert(
            'Permission Required',
            'Gallery access is required to select images. Please grant permission in settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => openSettings() },
            ]
          );
        }
      } else {
        setLoading(false);
        Alert.alert(
          'Permission Required',
          'Please enable gallery access in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() },
          ]
        );
      }
    } catch (error: any) {
      console.error('[ImagePickerModal] Error requesting gallery permission:', error);
      setLoading(false);
      // Fallback: try to open gallery directly
      openGallery();
    }
  };

  const requestCameraPermission = async () => {
    setLoading(true);
    
    try {
      const permission = Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;
      
      const result = await check(permission);
      
      if (result === RESULTS.GRANTED) {
        setLoading(false);
        openCamera();
      } else if (result === RESULTS.DENIED) {
        const requestResult = await request(permission);
        
        if (requestResult === RESULTS.GRANTED) {
          setLoading(false);
          openCamera();
        } else {
          setLoading(false);
          Alert.alert(
            'Permission Required',
            'Camera access is required to take photos. Please grant permission in settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => openSettings() },
            ]
          );
        }
      } else {
        setLoading(false);
        Alert.alert(
          'Permission Required',
          'Please enable camera access in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() },
          ]
        );
      }
    } catch (error: any) {
      console.error('[ImagePickerModal] Error requesting camera permission:', error);
      setLoading(false);
      // Fallback: try to open camera directly
      openCamera();
    }
  };

  const openGallery = () => {
    try {
      launchImageLibrary(
        {
          mediaType: 'photo',
          quality: 0.8,
          maxWidth: 1080,
          maxHeight: 1920,
          selectionLimit: 1,
          includeBase64: false,
        },
        handleImagePicker
      );
    } catch (error: any) {
      console.error('[ImagePickerModal] Error launching image library:', error);
      Alert.alert('Error', `Failed to open gallery: ${error.message || 'Unknown error'}`);
      setLoading(false);
    }
  };

  const openCamera = () => {
    try {
      launchCamera(
        {
          mediaType: 'photo',
          quality: 0.8,
          maxWidth: 1080,
          maxHeight: 1920,
          saveToPhotos: false,
          includeBase64: false,
        },
        handleImagePicker
      );
    } catch (error: any) {
      console.error('[ImagePickerModal] Error launching camera:', error);
      Alert.alert('Error', `Failed to open camera: ${error.message || 'Unknown error'}`);
      setLoading(false);
    }
  };

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
            <Text style={styles.title}>Select Image</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200EE" />
                <Text style={styles.loadingText}>Processing...</Text>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={requestCameraPermission}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionIcon}>📷</Text>
                  <Text style={styles.optionText}>Take Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={requestGalleryPermission}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionIcon}>🖼️</Text>
                  <Text style={styles.optionText}>Choose from Gallery</Text>
                </TouchableOpacity>
              </>
            )}
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
    paddingBottom: 40,
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
    padding: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 12,
  },
  optionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
