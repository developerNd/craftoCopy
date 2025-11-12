import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Template } from '../types';
import { useTemplateStore } from '../stores';
import TemplateRenderer from '../components/TemplateRenderer';

type BrowseScreenRouteProp = RouteProp<RootStackParamList, 'Browse'>;
type BrowseScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Browse'>;

export default function BrowseScreen() {
  const navigation = useNavigation<BrowseScreenNavigationProp>();
  const route = useRoute<BrowseScreenRouteProp>();
  const { categoryId } = route.params;
  
  const { templates, categories, getTemplatesByCategory, isLoading } = useTemplateStore();
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

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

  const renderTemplate = ({ item }: { item: Template }) => (
    <TouchableOpacity
      style={styles.templateCard}
      onPress={() => handleTemplatePress(item.id)}
    >
      <View style={styles.templatePreview}>
        <TemplateRenderer 
          template={item} 
          scale={0.2}
          showPlaceholders={true}
        />
      </View>
      <View style={styles.templateInfo}>
        <Text style={styles.templateTitle} numberOfLines={2}>
          {item.elements.find(el => el.type === 'text' && el.text)?.text || 'Template'}
        </Text>
        <Text style={styles.templateCategory}>
          {item.category} • {item.subcategory}
        </Text>
        {item.isPremium && (
          <Text style={styles.premiumBadge}>⭐ Premium</Text>
        )}
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
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getCategoryName()}</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={filteredTemplates}
        renderItem={renderTemplate}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.templatesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
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
  templatesList: {
    padding: 16,
  },
  templateCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  templatePreview: {
    height: 200,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateInfo: {
    padding: 12,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  templateCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  premiumBadge: {
    fontSize: 10,
    color: '#ffd700',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
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