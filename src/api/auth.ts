// Authentication API endpoints
import { apiClient } from './client';
import { API_ENDPOINTS } from '../config/api';
import { User } from '../types';

export interface LoginCredentials {
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
  provider?: 'google' | 'phone' | 'email';
}

export interface RegisterData {
  email?: string;
  phone?: string;
  displayName: string;
  password?: string;
}

/**
 * Authentication API
 * Handles all auth-related API calls
 */
export const AuthAPI = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    return apiClient.post(API_ENDPOINTS.AUTH_LOGIN, credentials);
  },

  /**
   * Register new user
   */
  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    return apiClient.post(API_ENDPOINTS.AUTH_REGISTER, data);
  },

  /**
   * Verify email/phone
   */
  verify: async (code: string): Promise<{ verified: boolean }> => {
    return apiClient.post(API_ENDPOINTS.AUTH_VERIFY, { code });
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    return apiClient.post(API_ENDPOINTS.AUTH_LOGOUT);
  },

  /**
   * Refresh auth token
   */
  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    return apiClient.post(API_ENDPOINTS.AUTH_REFRESH, { refreshToken });
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    return apiClient.get(API_ENDPOINTS.USER_PROFILE);
  },

  /**
   * Update user profile
   */
  updateProfile: async (updates: Partial<User>): Promise<User> => {
    return apiClient.put(API_ENDPOINTS.USER_PROFILE, updates);
  },
};

export default AuthAPI;
