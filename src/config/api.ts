// API Configuration for Craftify
// Handles all API-related configurations and axios setup

import { API_BASE_URL, CDN_BASE_URL } from '../constants';

/**
 * API Endpoints based on PRD specifications
 */
export const API_ENDPOINTS = {
  // Template endpoints
  TEMPLATES: '/templates',
  TEMPLATE_BY_ID: (id: string) => `/templates/${id}`,
  TEMPLATE_SEARCH: '/templates/search',
  CATEGORIES: '/categories',

  // User endpoints
  USER_PROFILE: '/user/profile',
  USER_FAVORITES: '/user/favorites',
  USER_RECENT: '/user/recent',

  // Auth endpoints
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_VERIFY: '/auth/verify',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REFRESH: '/auth/refresh',

  // Subscription endpoints
  SUBSCRIPTIONS: '/subscriptions',
  SUBSCRIPTION_STATUS: '/subscriptions/status',
  SUBSCRIPTION_CANCEL: '/subscriptions/cancel',

  // Upload endpoints
  UPLOAD_IMAGE: '/uploads/image',
  UPLOAD_VIDEO: '/uploads/video',

  // Export endpoints
  EXPORT: '/exports',
  EXPORT_BY_ID: (id: string) => `/exports/${id}`,

  // Analytics
  ANALYTICS_EVENT: '/analytics/event',
};

/**
 * API Configuration
 */
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

/**
 * CDN Configuration
 */
export const cdnConfig = {
  baseURL: CDN_BASE_URL,
  templateThumbnails: `${CDN_BASE_URL}/templates/thumbnails`,
  templateFull: `${CDN_BASE_URL}/templates/full`,
  userUploads: `${CDN_BASE_URL}/uploads`,
  exports: `${CDN_BASE_URL}/exports`,
};

/**
 * Request interceptor configuration
 * Adds authentication token to all requests
 */
export const getAuthHeader = (token: string | null) => {
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Rate limiting configuration (based on PRD)
 */
export const RATE_LIMITS = {
  TEMPLATE_FETCH: 100, // per minute per user
  EXPORT: 50, // per hour per user
  UPLOAD: 20, // per hour per user
};

/**
 * Retry configuration for failed requests
 */
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryOn: [408, 429, 500, 502, 503, 504], // HTTP status codes to retry on
};

export default {
  API_ENDPOINTS,
  apiConfig,
  cdnConfig,
  getAuthHeader,
  RATE_LIMITS,
  RETRY_CONFIG,
};
