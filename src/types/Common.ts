// Navigation types

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Browse: { categoryId?: string };
  TemplatePreview: { templateId: string };
  Editor: { templateId: string; initialData?: any };
  Export: { templateId: string };
  Profile: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Browse: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type BrowseStackParamList = {
  CategoryList: undefined;
  TemplateList: { category: string; subcategory?: string };
  Search: undefined;
};

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Common types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}
