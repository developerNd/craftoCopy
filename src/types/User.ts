// User types based on PRD specifications

export type SubscriptionTier = 'free' | 'premium' | 'enterprise';

export interface UserPreferences {
  language: string;
  notifications: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  displayName: string;
  photoURL?: string;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiry?: Date;
  exportsToday: number;
  createdAt: Date;
  lastLoginAt: Date;
  favorites: string[]; // Template IDs
  preferences: UserPreferences;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
}

export interface RegisterData {
  email: string;
  phone?: string;
  displayName: string;
  password?: string;
}
