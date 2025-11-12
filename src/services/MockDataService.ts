// Mock data service for testing templates
import { Template, TemplateCategory } from '../types';

// Sample template categories
export const mockCategories: TemplateCategory[] = [
  {
    id: 'festivals',
    name: 'Festivals',
    icon: '🎉',
    templateCount: 150,
    subcategories: ['diwali', 'holi', 'eid', 'christmas', 'pongal', 'onam'],
  },
  {
    id: 'daily',
    name: 'Daily Wishes',
    icon: '🌅',
    templateCount: 100,
    subcategories: ['good-morning', 'good-night', 'motivational', 'birthday'],
  },
  {
    id: 'business',
    name: 'Business',
    icon: '💼',
    templateCount: 120,
    subcategories: ['sale', 'announcement', 'menu', 'timings'],
  },
  {
    id: 'social',
    name: 'Social Media',
    icon: '📱',
    templateCount: 80,
    subcategories: ['instagram', 'facebook', 'linkedin', 'youtube'],
  },
  {
    id: 'events',
    name: 'Events',
    icon: '🎊',
    templateCount: 50,
    subcategories: ['wedding', 'party', 'announcement', 'invitation'],
  },
];

// Sample templates
export const mockTemplates: Template[] = [
  {
    id: 'diwali_001',
    version: '1.0',
    type: 'image',
    category: 'festivals',
    subcategory: 'diwali',
    tags: ['diwali', 'traditional', 'gold', 'diyas', 'festival'],
    isPremium: false,
    aspectRatio: '9:16',
    dimensions: { width: 1080, height: 1920 },
    background: {
      type: 'color',
      color: '#1a0f0a',
    },
    elements: [
      {
        id: 'user_photo',
        type: 'image',
        position: { x: 440, y: 300 },
        size: { width: 200, height: 200 },
        placeholder: true,
        locked: false,
        shape: 'circle',
        border: { width: 4, color: '#ffd700' },
      },
      {
        id: 'greeting_text',
        type: 'text',
        position: { x: 290, y: 600 },
        text: 'Happy Diwali!',
        fontSize: 48,
        fontFamily: 'Poppins-Bold',
        color: '#ffd700',
        alignment: 'center',
        editable: true,
        maxLength: 50,
      },
      {
        id: 'user_name',
        type: 'text',
        position: { x: 290, y: 800 },
        text: 'Your Name',
        fontSize: 32,
        fontFamily: 'Roboto-Regular',
        color: '#ffffff',
        alignment: 'center',
        editable: true,
        placeholderText: 'Enter your name',
      },
      {
        id: 'decoration_1',
        type: 'shape',
        position: { x: 50, y: 100 },
        size: { width: 100, height: 100 },
        shape: 'circle',
        color: '#ffd700',
        opacity: 0.3,
      },
      {
        id: 'decoration_2',
        type: 'shape',
        position: { x: 930, y: 200 },
        size: { width: 80, height: 80 },
        shape: 'circle',
        color: '#ffd700',
        opacity: 0.3,
      },
    ],
    metadata: {
      createdAt: '2025-09-01',
      popularity: 8542,
      downloads: 12430,
      language: 'en',
    },
  },
  {
    id: 'good_morning_001',
    version: '1.0',
    type: 'image',
    category: 'daily',
    subcategory: 'good-morning',
    tags: ['morning', 'sunrise', 'motivational', 'daily'],
    isPremium: false,
    aspectRatio: '9:16',
    dimensions: { width: 1080, height: 1920 },
    background: {
      type: 'color',
      color: '#87CEEB',
    },
    elements: [
      {
        id: 'sun_icon',
        type: 'shape',
        position: { x: 400, y: 200 },
        size: { width: 120, height: 120 },
        shape: 'circle',
        color: '#FFD700',
      },
      {
        id: 'greeting_text',
        type: 'text',
        position: { x: 100, y: 400 },
        text: 'Good Morning!',
        fontSize: 42,
        fontFamily: 'Poppins-Bold',
        color: '#2C3E50',
        alignment: 'center',
        editable: true,
        maxLength: 30,
      },
      {
        id: 'motivational_text',
        type: 'text',
        position: { x: 80, y: 600 },
        text: 'Start your day with positivity',
        fontSize: 24,
        fontFamily: 'Roboto-Regular',
        color: '#34495E',
        alignment: 'center',
        editable: true,
        maxLength: 50,
      },
      {
        id: 'user_name',
        type: 'text',
        position: { x: 120, y: 800 },
        text: 'Your Name',
        fontSize: 28,
        fontFamily: 'Roboto-Regular',
        color: '#2C3E50',
        editable: true,
        placeholderText: 'Enter your name',
      },
    ],
    metadata: {
      createdAt: '2025-09-15',
      popularity: 6234,
      downloads: 8920,
      language: 'en',
    },
  },
  {
    id: 'business_sale_001',
    version: '1.0',
    type: 'image',
    category: 'business',
    subcategory: 'sale',
    tags: ['sale', 'discount', 'business', 'promotion'],
    isPremium: true,
    aspectRatio: '9:16',
    dimensions: { width: 1080, height: 1920 },
    background: {
      type: 'color',
      color: '#E74C3C',
    },
    elements: [
      {
        id: 'sale_badge',
        type: 'shape',
        position: { x: 390, y: 100 },
        size: { width: 300, height: 120 },
        shape: 'rectangle',
        color: '#F39C12',
      },
      {
        id: 'sale_text',
        type: 'text',
        position: { x: 390, y: 120 },
        text: '50% OFF',
        fontSize: 48,
        fontFamily: 'Poppins-Bold',
        color: '#FFFFFF',
        alignment: 'center',
        editable: true,
        maxLength: 20,
      },
      {
        id: 'product_image',
        type: 'image',
        position: { x: 390, y: 400 },
        size: { width: 300, height: 300 },
        placeholder: true,
        locked: false,
        shape: 'rectangle',
        border: { width: 3, color: '#FFFFFF' },
      },
      {
        id: 'product_name',
        type: 'text',
        position: { x: 290, y: 750 },
        text: 'Product Name',
        fontSize: 36,
        fontFamily: 'Poppins-Bold',
        color: '#FFFFFF',
        alignment: 'center',
        editable: true,
        maxLength: 30,
      },
      {
        id: 'shop_name',
        type: 'text',
        position: { x: 290, y: 850 },
        text: 'Your Shop Name',
        fontSize: 28,
        fontFamily: 'Roboto-Regular',
        color: '#FFFFFF',
        alignment: 'center',
        editable: true,
        placeholderText: 'Enter shop name',
      },
    ],
    metadata: {
      createdAt: '2025-10-01',
      popularity: 4567,
      downloads: 6780,
      language: 'en',
    },
  },
  {
    id: 'instagram_story_001',
    version: '1.0',
    type: 'image',
    category: 'social',
    subcategory: 'instagram',
    tags: ['instagram', 'story', 'social', 'trending'],
    isPremium: false,
    aspectRatio: '9:16',
    dimensions: { width: 1080, height: 1920 },
    background: {
      type: 'color',
      color: '#8E44AD',
    },
    elements: [
      {
        id: 'user_photo',
        type: 'image',
        position: { x: 465, y: 200 },
        size: { width: 150, height: 150 },
        placeholder: true,
        locked: false,
        shape: 'circle',
        border: { width: 3, color: '#FFFFFF' },
      },
      {
        id: 'main_text',
        type: 'text',
        position: { x: 290, y: 400 },
        text: 'Check this out!',
        fontSize: 38,
        fontFamily: 'Poppins-Bold',
        color: '#FFFFFF',
        alignment: 'center',
        editable: true,
        maxLength: 30,
      },
      {
        id: 'sub_text',
        type: 'text',
        position: { x: 80, y: 500 },
        text: 'Swipe up to see more',
        fontSize: 20,
        fontFamily: 'Roboto-Regular',
        color: '#BDC3C7',
        alignment: 'center',
        editable: true,
        maxLength: 40,
      },
      {
        id: 'hashtag',
        type: 'text',
        position: { x: 100, y: 700 },
        text: '#trending',
        fontSize: 24,
        fontFamily: 'Roboto-Regular',
        color: '#3498DB',
        alignment: 'center',
        editable: true,
        maxLength: 20,
      },
    ],
    metadata: {
      createdAt: '2025-10-10',
      popularity: 7890,
      downloads: 11200,
      language: 'en',
    },
  },
  {
    id: 'wedding_invite_001',
    version: '1.0',
    type: 'image',
    category: 'events',
    subcategory: 'wedding',
    tags: ['wedding', 'invitation', 'elegant', 'celebration'],
    isPremium: true,
    aspectRatio: '9:16',
    dimensions: { width: 1080, height: 1920 },
    background: {
      type: 'color',
      color: '#F8F9FA',
    },
    elements: [
      {
        id: 'couple_photo',
        type: 'image',
        position: { x: 390, y: 200 },
        size: { width: 300, height: 300 },
        placeholder: true,
        locked: false,
        shape: 'rectangle',
        border: { width: 3, color: '#E91E63' },
      },
      {
        id: 'invitation_text',
        type: 'text',
        position: { x: 290, y: 550 },
        text: 'You\'re Invited!',
        fontSize: 36,
        fontFamily: 'Poppins-Bold',
        color: '#E91E63',
        alignment: 'center',
        editable: true,
        maxLength: 25,
      },
      {
        id: 'couple_names',
        type: 'text',
        position: { x: 100, y: 650 },
        text: 'John & Jane',
        fontSize: 32,
        fontFamily: 'Poppins-Bold',
        color: '#2C3E50',
        alignment: 'center',
        editable: true,
        maxLength: 30,
      },
      {
        id: 'date_text',
        type: 'text',
        position: { x: 100, y: 750 },
        text: 'December 25, 2025',
        fontSize: 24,
        fontFamily: 'Roboto-Regular',
        color: '#7F8C8D',
        alignment: 'center',
        editable: true,
        maxLength: 30,
      },
      {
        id: 'venue_text',
        type: 'text',
        position: { x: 100, y: 850 },
        text: 'Grand Palace Hotel',
        fontSize: 22,
        fontFamily: 'Roboto-Regular',
        color: '#7F8C8D',
        alignment: 'center',
        editable: true,
        maxLength: 40,
      },
    ],
    metadata: {
      createdAt: '2025-10-15',
      popularity: 3456,
      downloads: 5670,
      language: 'en',
    },
  },
];

// Mock data service functions
export class MockDataService {
  static async getTemplates(): Promise<Template[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockTemplates];
  }

  static async getTemplateById(id: string): Promise<Template | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTemplates.find(template => template.id === id) || null;
  }

  static async getTemplatesByCategory(category: string): Promise<Template[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockTemplates.filter(template => template.category === category);
  }

  static async getCategories(): Promise<TemplateCategory[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockCategories];
  }

  static async searchTemplates(query: string): Promise<Template[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const searchLower = query.toLowerCase();
    return mockTemplates.filter(template =>
      template.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      template.category.toLowerCase().includes(searchLower) ||
      template.subcategory.toLowerCase().includes(searchLower) ||
      template.elements.some(element => 
        element.type === 'text' && 
        element.text?.toLowerCase().includes(searchLower)
      )
    );
  }

  static async getPopularTemplates(): Promise<Template[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockTemplates].sort((a, b) => b.metadata.popularity - a.metadata.popularity);
  }

  static async getRecentTemplates(): Promise<Template[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockTemplates].sort((a, b) => 
      new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime()
    );
  }
}
