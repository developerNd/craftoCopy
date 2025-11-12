import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useTemplateStore } from '../stores';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { 
    templates,
    categories, 
    getRecentTemplates, 
    getFavoriteTemplates, 
    loadTemplates, 
    loadCategories,
    isLoading 
  } = useTemplateStore();

  useEffect(() => {
    loadTemplates();
    loadCategories();
  }, [loadTemplates, loadCategories]);

  const recentTemplates = getRecentTemplates();
  const favoriteTemplates = getFavoriteTemplates();

  const handleCategoryPress = (categoryId: string) => {
    navigation.navigate('Browse', { categoryId });
  };

  const handleTemplatePress = (templateId: string) => {
    navigation.navigate('TemplatePreview', { templateId });
  };

  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item.id)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryCount}>{item.templateCount} templates</Text>
    </TouchableOpacity>
  );

  const renderTemplate = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.templateCard}
      onPress={() => handleTemplatePress(item.id)}
    >
      <View style={styles.templatePlaceholder}>
        <Text style={styles.templateIcon}>📄</Text>
      </View>
      <Text style={styles.templateName} numberOfLines={2}>
        {item.elements?.find((el: any) => el.type === 'text' && el.text)?.text || 'Template'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back!</Text>
          <Text style={styles.subtitle}>What would you like to create today?</Text>
          <Text style={styles.debugText}>
            Templates loaded: {templates.length} | Categories: {categories.length}
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6200EE" />
            <Text style={styles.loadingText}>Loading templates...</Text>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <FlatList
                data={categories}
                renderItem={renderCategory}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesList}
              />
            </View>

            {recentTemplates.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Templates</Text>
                <FlatList
                  data={recentTemplates.slice(0, 5)}
                  renderItem={renderTemplate}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.templatesList}
                />
              </View>
            )}

            {favoriteTemplates.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Favorites</Text>
                <FlatList
                  data={favoriteTemplates.slice(0, 5)}
                  renderItem={renderTemplate}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.templatesList}
                />
              </View>
            )}

            {templates.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sample Templates</Text>
                <FlatList
                  data={templates.slice(0, 5)}
                  renderItem={renderTemplate}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.templatesList}
                />
              </View>
            )}
          </>
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
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  debugText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  templatesList: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#666',
  },
  templateCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: 12,
    width: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templatePlaceholder: {
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateIcon: {
    fontSize: 24,
  },
  templateName: {
    fontSize: 14,
    color: '#333',
    padding: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});
