// Template API endpoints
import { apiClient } from './client';
import { API_ENDPOINTS } from '../config/api';
import { Template, TemplateFilters } from '../types';

/**
 * Template API
 * Handles all template-related API calls
 */
export const TemplateAPI = {
  /**
   * Get all templates with optional filters
   */
  getTemplates: async (filters?: TemplateFilters): Promise<Template[]> => {
    return apiClient.get<Template[]>(API_ENDPOINTS.TEMPLATES, filters);
  },

  /**
   * Get template by ID
   */
  getTemplateById: async (id: string): Promise<Template> => {
    return apiClient.get<Template>(API_ENDPOINTS.TEMPLATE_BY_ID(id));
  },

  /**
   * Search templates
   */
  searchTemplates: async (query: string): Promise<Template[]> => {
    return apiClient.get<Template[]>(API_ENDPOINTS.TEMPLATE_SEARCH, { q: query });
  },

  /**
   * Get template categories
   */
  getCategories: async () => {
    return apiClient.get(API_ENDPOINTS.CATEGORIES);
  },

  /**
   * Add template to favorites
   */
  addToFavorites: async (templateId: string) => {
    return apiClient.post(API_ENDPOINTS.USER_FAVORITES, { templateId });
  },

  /**
   * Remove template from favorites
   */
  removeFromFavorites: async (templateId: string) => {
    return apiClient.delete(`${API_ENDPOINTS.USER_FAVORITES}/${templateId}`);
  },

  /**
   * Get user's favorite templates
   */
  getFavorites: async () => {
    return apiClient.get(API_ENDPOINTS.USER_FAVORITES);
  },
};

export default TemplateAPI;
