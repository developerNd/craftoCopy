// Custom hook for template operations
import { useTemplateStore } from '../stores/templateStore';
import { Template, TemplateFilters } from '../types';

/**
 * Custom hook for managing templates
 * Provides easy access to template store and operations
 */
export const useTemplates = () => {
  const {
    templates,
    categories,
    favorites,
    recentTemplates,
    isLoading,
    error,
    filters,
    loadTemplates,
    loadCategories,
    loadTemplateById,
    searchTemplates,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addToRecent,
    setFilters,
    clearFilters,
    getFilteredTemplates,
    getTemplatesByCategory,
    getFavoriteTemplates,
    getRecentTemplates,
  } = useTemplateStore();

  return {
    // State
    templates,
    categories,
    favorites,
    recentTemplates,
    isLoading,
    error,
    filters,

    // Actions
    loadTemplates,
    loadCategories,
    loadTemplateById,
    searchTemplates,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addToRecent,
    setFilters,
    clearFilters,

    // Computed
    filteredTemplates: getFilteredTemplates(),
    favoriteTemplates: getFavoriteTemplates(),
    recentTemplatesList: getRecentTemplates(),

    // Helper functions
    getTemplatesByCategory,
    toggleFavorite: (templateId: string) => {
      if (isFavorite(templateId)) {
        removeFromFavorites(templateId);
      } else {
        addToFavorites(templateId);
      }
    },
  };
};

export default useTemplates;
