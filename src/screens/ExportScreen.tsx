import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useExportStore } from '../stores';
import { useEditorStore } from '../stores/editorStore';
import { ExportService } from '../services';
import TemplateRenderer from '../components/TemplateRenderer';

type ExportScreenRouteProp = RouteProp<RootStackParamList, 'Export'>;
type ExportScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Export'>;

export default function ExportScreen() {
  const navigation = useNavigation<ExportScreenNavigationProp>();
  const route = useRoute<ExportScreenRouteProp>();
  const { templateId } = route.params;
  
  const templateRef = useRef<View>(null);
  const { 
    isExporting, 
    exportProgress, 
    lastExport, 
    setExporting, 
    setProgress, 
    setLastExport,
    setError 
  } = useExportStore();
  
  // Get the current template and elements from editor store (includes all edits)
  const { template, elements } = useEditorStore();
  
  useEffect(() => {
    // If template not loaded in editor, go back
    if (!template && !isExporting) {
      Alert.alert('Error', 'Template not found. Please edit the template first.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  }, [template, navigation]);
  
  const [selectedFormat, setSelectedFormat] = useState<'png' | 'jpg'>('png');
  const [selectedQuality, setSelectedQuality] = useState(0.9);

  if (!template) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.errorText}>Loading template...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Create export template with updated elements from editor store
  const exportTemplate = {
    ...template,
    elements: elements.map(el => {
      const { isSelected, isEditing, ...element } = el;
      return element;
    })
  };
  
  console.log('[ExportScreen] Export template:', {
    id: exportTemplate.id,
    elementsCount: exportTemplate.elements.length,
    imageElements: exportTemplate.elements.filter(el => el.type === 'image').map(el => ({
      id: el.id,
      hasUrl: !!el.url,
      url: el.url,
    })),
  });

  const handleExport = async () => {
    if (!templateRef.current) {
      Alert.alert('Error', 'Template view not ready');
      return;
    }

    try {
      setExporting(true);
      setProgress(0);

      const options = {
        templateId: template.id,
        format: selectedFormat,
        quality: selectedQuality,
        width: template.dimensions.width,
        height: template.dimensions.height,
      };

      setProgress(30);
      
      // Wait a bit for the view to render
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProgress(50);
      const exportResult = await ExportService.exportTemplate(templateRef, options);
      
      if (exportResult) {
        setLastExport(exportResult);
        setProgress(100);
        
        Alert.alert(
          'Export Successful!',
          'Your template has been exported successfully.',
          [
            { text: 'OK' },
            { 
              text: 'Share', 
              onPress: () => handleShare(exportResult) 
            },
            { 
              text: 'Save to Gallery', 
              onPress: () => handleSaveToGallery(exportResult) 
            },
          ]
        );
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      setError(errorMessage);
      Alert.alert('Export Failed', errorMessage);
    } finally {
      setExporting(false);
    }
  };

  const handleShare = async (exportResult: any) => {
    try {
      const success = await ExportService.shareTemplate(exportResult);
      if (!success) {
        Alert.alert('Share Failed', 'Unable to share the template');
      }
    } catch (error) {
      Alert.alert('Share Failed', 'An error occurred while sharing');
    }
  };

  const handleSaveToGallery = async (exportResult: any) => {
    try {
      const success = await ExportService.saveToGallery(exportResult);
      if (!success) {
        Alert.alert('Save Failed', 'Unable to save to gallery');
      }
    } catch (error) {
      Alert.alert('Save Failed', 'An error occurred while saving');
    }
  };

  const handleExportMultiple = async () => {
    if (!templateRef.current) {
      Alert.alert('Error', 'Template view not ready');
      return;
    }

    try {
      setExporting(true);
      setProgress(0);

      const exports = await ExportService.exportMultipleFormats(
        templateRef, 
        template.id, 
        ['png', 'jpg']
      );

      if (exports.length > 0) {
        setProgress(100);
        Alert.alert(
          'Export Complete!',
          `Successfully exported ${exports.length} formats.`,
          [
            { text: 'OK' },
            { 
              text: 'Share All', 
              onPress: async () => {
                for (const exportResult of exports) {
                  await ExportService.shareTemplate(exportResult);
                }
              }
            },
          ]
        );
      } else {
        throw new Error('No exports completed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      setError(errorMessage);
      Alert.alert('Export Failed', errorMessage);
    } finally {
      setExporting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Export Template</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Template Preview - Scaled down for display */}
        <View style={styles.previewContainer}>
          <View style={styles.previewWrapper}>
            <TemplateRenderer 
              template={exportTemplate} 
              scale={0.25}
              showPlaceholders={false}
            />
          </View>
        </View>

        {/* Hidden full-size view for export */}
        <View 
          ref={templateRef} 
          collapsable={false} 
          style={styles.exportView}
          pointerEvents="none"
        >
          <TemplateRenderer 
            template={exportTemplate} 
            scale={1.0}
            showPlaceholders={false}
          />
        </View>

        {/* Export Options */}
        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>Export Options</Text>
          
          {/* Format Selection */}
          <View style={styles.optionGroup}>
            <Text style={styles.optionLabel}>Format</Text>
            <View style={styles.formatButtons}>
              <TouchableOpacity
                style={[
                  styles.formatButton,
                  selectedFormat === 'png' && styles.formatButtonActive
                ]}
                onPress={() => setSelectedFormat('png')}
              >
                <Text style={[
                  styles.formatButtonText,
                  selectedFormat === 'png' && styles.formatButtonTextActive
                ]}>
                  PNG
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.formatButton,
                  selectedFormat === 'jpg' && styles.formatButtonActive
                ]}
                onPress={() => setSelectedFormat('jpg')}
              >
                <Text style={[
                  styles.formatButtonText,
                  selectedFormat === 'jpg' && styles.formatButtonTextActive
                ]}>
                  JPG
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quality Selection */}
          <View style={styles.optionGroup}>
            <Text style={styles.optionLabel}>Quality: {Math.round(selectedQuality * 100)}%</Text>
            <View style={styles.qualityButtons}>
              {[0.7, 0.8, 0.9, 1.0].map(quality => (
                <TouchableOpacity
                  key={quality}
                  style={[
                    styles.qualityButton,
                    selectedQuality === quality && styles.qualityButtonActive
                  ]}
                  onPress={() => setSelectedQuality(quality)}
                >
                  <Text style={[
                    styles.qualityButtonText,
                    selectedQuality === quality && styles.qualityButtonTextActive
                  ]}>
                    {Math.round(quality * 100)}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Export Progress */}
        {isExporting && (
          <View style={styles.progressContainer}>
            <ActivityIndicator size="large" color="#6200EE" />
            <Text style={styles.progressText}>
              Exporting... {Math.round(exportProgress || 0)}%
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.exportButton, isExporting && styles.buttonDisabled]} 
            onPress={handleExport}
            disabled={isExporting}
          >
            <Text style={styles.exportButtonText}>
              {isExporting ? 'Exporting...' : '📤 Export Template'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.multipleButton, isExporting && styles.buttonDisabled]} 
            onPress={handleExportMultiple}
            disabled={isExporting}
          >
            <Text style={styles.multipleButtonText}>
              📦 Export All Formats
            </Text>
          </TouchableOpacity>
        </View>

        {/* Last Export Info */}
        {lastExport && (
          <View style={styles.lastExportContainer}>
            <Text style={styles.lastExportTitle}>Last Export</Text>
            <Text style={styles.lastExportText}>
              Format: {lastExport.format?.toUpperCase() || 'N/A'}
            </Text>
            <Text style={styles.lastExportText}>
              Size: {lastExport.fileSize ? `${(lastExport.fileSize / 1024).toFixed(1)} KB` : 'N/A'}
            </Text>
            <Text style={styles.lastExportText}>
              Dimensions: {lastExport.dimensions ? `${lastExport.dimensions.width} × ${lastExport.dimensions.height}` : 'N/A'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 60,
  },
  previewContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 400,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportView: {
    position: 'absolute',
    left: -2000,
    top: -2000,
    width: 1080,
    height: 1920,
  },
  optionsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  optionGroup: {
    marginBottom: 20,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  formatButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  formatButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  formatButtonActive: {
    borderColor: '#6200EE',
    backgroundColor: '#6200EE',
  },
  formatButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  formatButtonTextActive: {
    color: '#fff',
  },
  qualityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  qualityButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  qualityButtonActive: {
    borderColor: '#6200EE',
    backgroundColor: '#6200EE',
  },
  qualityButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  qualityButtonTextActive: {
    color: '#fff',
  },
  progressContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
  },
  progressText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  actionsContainer: {
    padding: 16,
    gap: 12,
  },
  exportButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  multipleButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  multipleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  lastExportContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lastExportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  lastExportText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});