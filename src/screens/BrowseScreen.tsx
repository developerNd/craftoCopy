import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Template } from '../types';
import { useTemplateStore } from '../stores';
import TemplateRenderer from '../components/TemplateRenderer';

type BrowseScreenRouteProp = RouteProp<RootStackParamList, 'Browse'>;
type BrowseScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Browse'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function BrowseScreen() {
  const navigation = useNavigation<BrowseScreenNavigationProp>();
  const route = useRoute<BrowseScreenRouteProp>();
  const { categoryId } = route.params;

  const { templates, categories, getTemplatesByCategory, isLoading } = useTemplateStore();
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  useEffect(() => {
    loadTemplates();
  }, [categoryId]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      if (categoryId) {
        const categoryTemplates = getTemplatesByCategory(categoryId);
        setFilteredTemplates(categoryTemplates);
      } else {
        setFilteredTemplates(templates);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplatePress = (templateId: string) => {
    navigation.navigate('TemplatePreview', { templateId });
  };

  const renderTemplateList = ({ item }: { item: Template }) => (
    <TouchableOpacity
      style={styles.templateCardList}
      onPress={() => handleTemplatePress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.templatePreviewList}>
        <TemplateRenderer
          template={item}
          scale={0.15}
          showPlaceholders={true}
        />
      </View>
      <View style={styles.templateInfoList}>
        <View style={styles.templateHeader}>
          <Text style={styles.templateTitleList} numberOfLines={2}>
            {item.elements.find(el => el.type === 'text' && el.text)?.text || 'Template'}
          </Text>
          {item.isPremium && (
            <View style={styles.premiumBadgeContainer}>
              <Text style={styles.premiumBadge}>⭐ Premium</Text>
            </View>
          )}
        </View>
        <Text style={styles.templateCategoryList}>
          {item.category} • {item.subcategory}
        </Text>
        <View style={styles.templateMeta}>
          <Text style={styles.templateMetaText}>
            {item.metadata.downloads.toLocaleString()} downloads
          </Text>
          <Text style={styles.templateMetaText}>•</Text>
          <Text style={styles.templateMetaText}>
            {item.dimensions.width}x{item.dimensions.height}
          </Text>
        </View>
        <View style={styles.templateTags}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const getCategoryName = () => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'All Templates';
  };

  if (loading || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.loadingText}>Loading templates...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{getCategoryName()}</Text>
            <Text style={styles.headerSubtitle}>{filteredTemplates.length} templates</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      <FlatList
        data={filteredTemplates}
        renderItem={renderTemplateList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.templatesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No templates found</Text>
            <Text style={styles.emptySubtext}>
              Try selecting a different category
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6200EE',
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  placeholder: {
    width: 60,
  },
  templatesList: {
    padding: 16,
  },
  templateCardList: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  templatePreviewList: {
    width: 120,
    height: 180,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  templateInfoList: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  templateTitleList: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  templateCategoryList: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  templateMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  templateMetaText: {
    fontSize: 11,
    color: '#999',
    marginRight: 6,
  },
  templateTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#666',
  },
  premiumBadgeContainer: {
    marginLeft: 8,
  },
  premiumBadge: {
    fontSize: 10,
    color: '#ffd700',
    fontWeight: 'bold',
    backgroundColor: '#fff8dc',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});