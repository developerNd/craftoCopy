import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Template, TemplateFilters, TemplateCategory } from '../types';
import { MockDataService } from '../services/MockDataService';
import { createAsyncStorage } from '../utils/storage';

interface TemplateStore {
  templates: Template[];
  categories: TemplateCategory[];
  favorites: string[];
  recentTemplates: string[];
  isLoading: boolean;
  error: string | null;
  filters: TemplateFilters;
  
  // Actions
  setTemplates: (templates: Template[]) => void;
  addTemplate: (template: Template) => void;
  updateTemplate: (id: string, updates: Partial<Template>) => void;
  removeTemplate: (id: string) => void;
  
  setCategories: (categories: TemplateCategory[]) => void;
  
  // Async actions
  loadTemplates: () => Promise<void>;
  loadCategories: () => Promise<void>;
  loadTemplateById: (id: string) => Promise<Template | null>;
  searchTemplates: (query: string) => Promise<Template[]>;
  
  addToFavorites: (templateId: string) => void;
  removeFromFavorites: (templateId: string) => void;
  isFavorite: (templateId: string) => boolean;
  
  addToRecent: (templateId: string) => void;
  clearRecent: () => void;
  
  setFilters: (filters: Partial<TemplateFilters>) => void;
  clearFilters: () => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed getters
  getFilteredTemplates: () => Template[];
  getTemplatesByCategory: (category: string) => Template[];
  getFavoriteTemplates: () => Template[];
  getRecentTemplates: () => Template[];
}

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set, get) => ({
      templates: [],
      categories: [],
      favorites: [],
      recentTemplates: [],
      isLoading: false,
      error: null,
      filters: {},

      setTemplates: (templates) => set({ templates }),
      
      addTemplate: (template) => set((state) => ({
        templates: [...state.templates, template],
      })),
      
      updateTemplate: (id, updates) => set((state) => ({
        templates: state.templates.map((template) =>
          template.id === id ? { ...template, ...updates } : template
        ),
      })),
      
      removeTemplate: (id) => set((state) => ({
        templates: state.templates.filter((template) => template.id !== id),
      })),

      setCategories: (categories) => set({ categories }),

      addToFavorites: (templateId) => set((state) => ({
        favorites: [...state.favorites, templateId],
      })),

      removeFromFavorites: (templateId) => set((state) => ({
        favorites: state.favorites.filter((id) => id !== templateId),
      })),

      isFavorite: (templateId) => {
        const state = get();
        return state.favorites.includes(templateId);
      },

      addToRecent: (templateId) => set((state) => {
        const recent = state.recentTemplates.filter((id) => id !== templateId);
        return {
          recentTemplates: [templateId, ...recent].slice(0, 20), // Keep last 20
        };
      }),

      clearRecent: () => set({ recentTemplates: [] }),

      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters },
      })),

      clearFilters: () => set({ filters: {} }),

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Async actions
      loadTemplates: async () => {
        set({ isLoading: true, error: null });
        try {
          const templates = await MockDataService.getTemplates();
          set({ templates, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load templates',
            isLoading: false 
          });
        }
      },

      loadCategories: async () => {
        try {
          const categories = await MockDataService.getCategories();
          set({ categories });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load categories'
          });
        }
      },

      loadTemplateById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const template = await MockDataService.getTemplateById(id);
          if (template) {
            get().addToRecent(id);
          }
          set({ isLoading: false });
          return template;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load template',
            isLoading: false 
          });
          return null;
        }
      },

      searchTemplates: async (query: string) => {
        set({ isLoading: true, error: null });
        try {
          const templates = await MockDataService.searchTemplates(query);
          set({ isLoading: false });
          return templates;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Search failed',
            isLoading: false 
          });
          return [];
        }
      },

      getFilteredTemplates: () => {
        const state = get();
        let filtered = [...state.templates];

        if (state.filters.category) {
          filtered = filtered.filter((template) =>
            template.category === state.filters.category
          );
        }

        if (state.filters.subcategory) {
          filtered = filtered.filter((template) =>
            template.subcategory === state.filters.subcategory
          );
        }

        if (state.filters.isPremium !== undefined) {
          filtered = filtered.filter((template) =>
            template.isPremium === state.filters.isPremium
          );
        }

        if (state.filters.search) {
          const searchLower = state.filters.search.toLowerCase();
          filtered = filtered.filter((template) =>
            template.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
            template.category.toLowerCase().includes(searchLower) ||
            template.subcategory.toLowerCase().includes(searchLower)
          );
        }

        // Sort
        if (state.filters.sortBy) {
          switch (state.filters.sortBy) {
            case 'popular':
              filtered.sort((a, b) => b.metadata.popularity - a.metadata.popularity);
              break;
            case 'newest':
              filtered.sort((a, b) => 
                new Date(b.metadata.createdAt).getTime() - 
                new Date(a.metadata.createdAt).getTime()
              );
              break;
            case 'trending':
              filtered.sort((a, b) => b.metadata.downloads - a.metadata.downloads);
              break;
          }
        }

        return filtered;
      },

      getTemplatesByCategory: (category) => {
        const state = get();
        return state.templates.filter((template) => template.category === category);
      },

      getFavoriteTemplates: () => {
        const state = get();
        return state.templates.filter((template) =>
          state.favorites.includes(template.id)
        );
      },

      getRecentTemplates: () => {
        const state = get();
        return state.templates.filter((template) =>
          state.recentTemplates.includes(template.id)
        );
      },
    }),
    {
      name: 'template-storage',
      storage: createAsyncStorage(),
      partialize: (state) => ({
        favorites: state.favorites,
        recentTemplates: state.recentTemplates,
        filters: state.filters,
      }),
    }
  )
);
