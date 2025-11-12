// API service for template management
import { Template, TemplateFilters, PaginatedResponse, ApiResponse } from '../types';

const API_BASE_URL = 'https://api.craftify.com/v1'; // Replace with actual API URL

class TemplateService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Get templates with filters and pagination
  async getTemplates(
    page: number = 1,
    limit: number = 20,
    filters?: TemplateFilters
  ): Promise<PaginatedResponse<Template>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.category && { category: filters.category }),
        ...(filters?.subcategory && { subcategory: filters.subcategory }),
        ...(filters?.isPremium !== undefined && { isPremium: filters.isPremium.toString() }),
        ...(filters?.search && { search: filters.search }),
        ...(filters?.sortBy && { sortBy: filters.sortBy }),
      });

      const response = await fetch(`${this.baseUrl}/templates?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  // Get a specific template by ID
  async getTemplate(id: string): Promise<Template> {
    try {
      const response = await fetch(`${this.baseUrl}/templates/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<Template> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  }

  // Get template categories
  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/templates/categories`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<string[]> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Search templates
  async searchTemplates(query: string, filters?: TemplateFilters): Promise<Template[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        ...(filters?.category && { category: filters.category }),
        ...(filters?.isPremium !== undefined && { isPremium: filters.isPremium.toString() }),
      });

      const response = await fetch(`${this.baseUrl}/templates/search?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<Template[]> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error searching templates:', error);
      throw error;
    }
  }

  // Upload user image
  async uploadImage(imageUri: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      } as any);

      const response = await fetch(`${this.baseUrl}/uploads`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<{ url: string }> = await response.json();
      return data.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
}

export default new TemplateService();
