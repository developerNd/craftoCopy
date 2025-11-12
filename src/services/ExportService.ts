import { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import { Platform, Alert, View, Linking, PermissionsAndroid } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Share from 'react-native-share';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

interface ExportOptions {
  templateId: string;
  format: 'png' | 'jpg';
  quality: number;
  width: number;
  height: number;
}

interface Export {
  id: string;
  templateId: string;
  format: 'png' | 'jpg';
  quality: number;
  dimensions: {
    width: number;
    height: number;
  };
  filePath: string;
  fileSize: number;
  createdAt: string;
  metadata: {
    deviceInfo: string;
    appVersion: string;
  };
}

export class ExportService {
  static async exportTemplate(
    viewRef: React.RefObject<View> | React.RefObject<any>,
    options: ExportOptions
  ): Promise<Export | null> {
    if (!viewRef.current) {
      throw new Error('View ref is not available');
    }
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `craftify-${timestamp}.${options.format}`;
      
      // Generate file path
      // On Android, use cache directory which FileProvider can access
      const filePath = Platform.OS === 'ios' 
        ? `${RNFS.DocumentDirectoryPath}/${fileName}`
        : `${RNFS.CachesDirectoryPath}/${fileName}`;

      // Capture the view
      const uri = await captureRef(viewRef, {
        format: options.format,
        quality: options.quality,
        result: 'tmpfile',
        width: options.width,
        height: options.height,
      });

      // Copy to final location
      await RNFS.copyFile(uri, filePath);

      // Get file info
      const fileInfo = await RNFS.stat(filePath);

      const exportResult: Export = {
        id: `export_${Date.now()}`,
        templateId: options.templateId,
        format: options.format,
        quality: options.quality,
        dimensions: {
          width: options.width || 1080,
          height: options.height || 1920,
        },
        filePath,
        fileSize: fileInfo.size,
        createdAt: new Date().toISOString(),
        metadata: {
          deviceInfo: Platform.OS,
          appVersion: '1.0.0',
        },
      };

      return exportResult;
    } catch (error) {
      console.error('Export failed:', error);
      throw new Error('Failed to export template');
    }
  }

  static async shareTemplate(exportResult: Export): Promise<boolean> {
    try {
      const shareUrl = Platform.OS === 'ios' ? exportResult.filePath : `file://${exportResult.filePath}`;
      
      const result = await Share.open({
        url: shareUrl,
        type: exportResult.format === 'png' ? 'image/png' : 'image/jpeg',
        title: 'Share Template',
        message: 'Check out this template I created with Craftify!',
      });
      
      return result.action === Share.ShareAction.sharedAction;
    } catch (error) {
      console.error('Share failed:', error);
      return false;
    }
  }

  static async saveToGallery(exportResult: Export): Promise<boolean> {
    try {
      // Ensure file path is correct format
      let filePath = exportResult.filePath;
      if (filePath.startsWith('file://')) {
        filePath = filePath.replace('file://', '');
      }
      
      console.log('[ExportService] Saving to gallery:', filePath);
      
      // Check if file exists
      const fileExists = await RNFS.exists(filePath);
      console.log('[ExportService] File exists:', fileExists, 'at path:', filePath);
      
      if (!fileExists) {
        throw new Error(`File does not exist: ${filePath}`);
      }
      
      if (Platform.OS === 'android') {
        // Request permission using PermissionsAndroid (required for CameraRoll)
        let permission;
        if (Platform.Version >= 33) {
          permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
        } else {
          permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
        }
        
        try {
          const granted = await PermissionsAndroid.request(permission, {
            title: 'Gallery Permission',
            message: 'Craftify needs access to your gallery to save templates.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          });
          
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn('[ExportService] Permission not granted');
            Alert.alert(
              'Permission Required',
              'Gallery access is required to save images. Please enable it in settings.',
              [{ text: 'OK' }]
            );
            return false;
          }
        } catch (permError) {
          console.error('[ExportService] Permission request error:', permError);
          Alert.alert(
            'Permission Error',
            'Failed to request gallery permission. Please enable it in app settings.',
            [{ text: 'OK' }]
          );
          return false;
        }
        
        // Use CameraRoll.save() which handles MediaStore API properly
        try {
          const savedUri = await CameraRoll.save(`file://${filePath}`, {
            type: 'photo',
            album: 'Craftify',
          });
          
          console.log('[ExportService] ✅ Saved to gallery:', savedUri);
          
          Alert.alert(
            'Saved to Gallery!',
            'Template has been saved to your device gallery. You can find it in the Gallery or Photos app.',
            [{ text: 'OK' }]
          );
          
          return true;
        } catch (cameraRollError: any) {
          console.error('[ExportService] ❌ CameraRoll.save failed:', cameraRollError);
          throw cameraRollError;
        }
      } else {
        // iOS: Use CameraRoll or share sheet
        try {
          // Request iOS permission
          const permission = PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY;
          const permissionResult = await check(permission);
          
          if (permissionResult !== RESULTS.GRANTED) {
            const requestResult = await request(permission);
            if (requestResult !== RESULTS.GRANTED) {
              Alert.alert(
                'Permission Required',
                'Gallery access is required to save images. Please enable it in settings.',
                [{ text: 'OK' }]
              );
              return false;
            }
          }
          
          // Use CameraRoll for iOS as well
          const savedUri = await CameraRoll.save(`file://${filePath}`, {
            type: 'photo',
            album: 'Craftify',
          });
          
          console.log('[ExportService] ✅ Saved to gallery:', savedUri);
          
          Alert.alert('Success', 'Template saved to gallery successfully!', [{ text: 'OK' }]);
          return true;
        } catch (cameraRollError: any) {
          console.error('[ExportService] ❌ CameraRoll.save failed:', cameraRollError);
          
          // Fallback to share sheet for iOS
          const shareUrl = `file://${filePath}`;
          const shareOptions: any = {
            url: shareUrl,
            type: exportResult.format === 'png' ? 'image/png' : 'image/jpeg',
            filename: `craftify-template.${exportResult.format}`,
            message: 'Save this template',
            title: 'Save Template to Gallery',
          };
          
          try {
            const result = await Share.open(shareOptions);
            if (result.action === Share.ShareAction.sharedAction || result.action === Share.ShareAction.dismissedAction) {
              Alert.alert('Success', 'Template shared successfully!', [{ text: 'OK' }]);
              return true;
            }
            return false;
          } catch (shareError: any) {
            throw cameraRollError; // Throw original error
          }
        }
      }
    } catch (error: any) {
      console.error('[ExportService] Save to gallery failed:', error);
      console.error('[ExportService] Error details:', error.message, error.stack);
      
      Alert.alert(
        'Error',
        `Failed to save to gallery: ${error.message || 'Unknown error'}. Please ensure the app has gallery permissions.`,
        [{ text: 'OK' }]
      );
      return false;
    }
  }

  static async exportMultipleFormats(
    viewRef: React.RefObject<any>,
    templateId: string,
    formats: ('png' | 'jpg')[] = ['png', 'jpg']
  ): Promise<Export[]> {
    const exports: Export[] = [];

    for (const format of formats) {
      try {
        const options: ExportOptions = {
          templateId,
          format,
          quality: format === 'jpg' ? 0.9 : 1.0,
          width: 1080,
          height: 1920,
        };

        const exportResult = await this.exportTemplate(viewRef, options);
        if (exportResult) {
          exports.push(exportResult);
        }
      } catch (error) {
        console.error(`Failed to export ${format}:`, error);
      }
    }

    return exports;
  }

  static async cleanupExports(): Promise<void> {
    try {
      const exportDir = Platform.OS === 'ios' 
        ? RNFS.DocumentDirectoryPath 
        : RNFS.CachesDirectoryPath;

      const files = await RNFS.readDir(exportDir);
      const craftifyFiles = files.filter(file => 
        file.name.startsWith('craftify-') && 
        (file.name.endsWith('.png') || file.name.endsWith('.jpg'))
      );

      // Keep only the last 10 exports
      if (craftifyFiles.length > 10) {
        const sortedFiles = craftifyFiles.sort((a, b) => 
          b.mtime.getTime() - a.mtime.getTime()
        );
        
        const filesToDelete = sortedFiles.slice(10);
        for (const file of filesToDelete) {
          await RNFS.unlink(file.path);
        }
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }

  static async getExportHistory(): Promise<Export[]> {
    try {
      const exportDir = Platform.OS === 'ios' 
        ? RNFS.DocumentDirectoryPath 
        : RNFS.CachesDirectoryPath;

      const files = await RNFS.readDir(exportDir);
      const craftifyFiles = files.filter(file => 
        file.name.startsWith('craftify-') && 
        (file.name.endsWith('.png') || file.name.endsWith('.jpg'))
      );

      return craftifyFiles.map(file => ({
        id: `export_${file.mtime.getTime()}`,
        templateId: 'unknown',
        format: file.name.endsWith('.png') ? 'png' : 'jpg',
        quality: 0.9,
        dimensions: { width: 1080, height: 1920 },
        filePath: file.path,
        fileSize: file.size,
        createdAt: file.mtime.toISOString(),
        metadata: {
          deviceInfo: Platform.OS,
          appVersion: '1.0.0',
        },
      }));
    } catch (error) {
      console.error('Failed to get export history:', error);
      return [];
    }
  }
}
