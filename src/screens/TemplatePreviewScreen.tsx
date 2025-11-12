import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Template } from '../types';
import { useTemplateStore } from '../stores';
import TemplateRenderer from '../components/TemplateRenderer';

type TemplatePreviewScreenRouteProp = RouteProp<RootStackParamList, 'TemplatePreview'>;
type TemplatePreviewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TemplatePreview'>;

const { width: screenWidth } = Dimensions.get('window');

export default function TemplatePreviewScreen() {
  const navigation = useNavigation<TemplatePreviewScreenNavigationProp>();
  const route = useRoute<TemplatePreviewScreenRouteProp>();
  const { templateId } = route.params;
  
  const { loadTemplateById, addToFavorites, removeFromFavorites, isFavorite } = useTemplateStore();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplate();
  }, [templateId]);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedTemplate = await loadTemplateById(templateId);
      if (loadedTemplate) {
        setTemplate(loadedTemplate);
      } else {
        setError('Template not found');
      }
    } catch (err) {
      setError('Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTemplate = () => {
    if (template) {
      navigation.navigate('Editor', { templateId: template.id });
    }
  };

  const handleToggleFavorite = () => {
    if (template) {
      if (isFavorite(template.id)) {
        removeFromFavorites(template.id);
      } else {
        addToFavorites(template.id);
      }
    }
  };

  const handleShareTemplate = () => {
    Alert.alert('Share', 'Share functionality will be implemented soon!');
  };

  const calculateScale = () => {
    if (!template) return 0.3;
    const maxWidth = screenWidth - 40;
    const maxHeight = 400;
    const scaleX = maxWidth / template.dimensions.width;
    const scaleY = maxHeight / template.dimensions.height;
    return Math.min(scaleX, scaleY, 0.4);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.loadingText}>Loading template...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !template) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Template not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadTemplate}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const scale = calculateScale();

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
          <Text style={styles.headerTitle}>Template Preview</Text>
          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={handleToggleFavorite}
          >
            <Text style={styles.favoriteButtonText}>
              {isFavorite(template.id) ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Template Preview */}
        <View style={styles.previewContainer}>
          <TemplateRenderer 
            template={template} 
            scale={scale}
            showPlaceholders={true}
          />
        </View>

        {/* Template Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.templateTitle}>
            {template.elements.find(el => el.type === 'text' && el.text?.includes('Happy'))?.text || 'Template'}
          </Text>
          <Text style={styles.templateCategory}>
            {template.category} • {template.subcategory}
          </Text>
          <Text style={styles.templateDescription}>
            {template.tags.join(', ')}
          </Text>
          
          {template.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>⭐ Premium</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={handleEditTemplate}
          >
            <Text style={styles.editButtonText}>✏️ Edit Template</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.shareButton} 
            onPress={handleShareTemplate}
          >
            <Text style={styles.shareButtonText}>📤 Share</Text>
          </TouchableOpacity>
        </View>

        {/* Template Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Template Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Aspect Ratio:</Text>
            <Text style={styles.detailValue}>{template.aspectRatio}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Dimensions:</Text>
            <Text style={styles.detailValue}>
              {template.dimensions.width} × {template.dimensions.height}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Elements:</Text>
            <Text style={styles.detailValue}>{template.elements.length}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Downloads:</Text>
            <Text style={styles.detailValue}>{template.metadata.downloads.toLocaleString()}</Text>
          </View>
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  favoriteButton: {
    padding: 8,
  },
  favoriteButtonText: {
    fontSize: 20,
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
  },
  infoContainer: {
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
  templateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  templateCategory: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  templateDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  premiumBadge: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  premiumText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    margin: 16,
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#6200EE',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  detailsContainer: {
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
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
});