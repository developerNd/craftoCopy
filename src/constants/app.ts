// App-level constants for Craftify based on PRD

export const APP_NAME = 'Craftify';
export const APP_TAGLINE = 'Create. Personalize. Share.';
export const APP_VERSION = '1.0.0';

// API Configuration (to be replaced with actual backend URLs)
export const API_BASE_URL = __DEV__
  ? 'http://localhost:1337/api/v1'
  : 'https://api.craftify.com/api/v1';

export const CDN_BASE_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://cdn.craftify.com';

// Feature Flags
export const FEATURES = {
  VIDEO_TEMPLATES: false, // Phase 2 feature
  AI_BACKGROUND_REMOVAL: false, // Phase 2 feature
  CUSTOM_TEMPLATES: false, // Enterprise feature
  OFFLINE_MODE: true,
  PREMIUM_FEATURES: true,
};

// Limits based on PRD
export const LIMITS = {
  FREE_EXPORTS_PER_DAY: 5,
  MAX_RECENT_TEMPLATES: 20,
  MAX_FAVORITES: 100,
  MAX_IMAGE_SIZE_MB: 25,
  MAX_VIDEO_LENGTH_SECONDS: 30,
  VIDEO_PROCESSING_TIMEOUT_MS: 60000,
  TEMPLATE_CACHE_SIZE_MB: 100,
};

// Subscription Tiers (prices in INR)
export const SUBSCRIPTION_TIERS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: {
      templates: 50,
      exportsPerDay: 5,
      resolution: '720p',
      watermark: true,
      videoTemplates: false,
      backgroundRemoval: false,
      customStickers: false,
    },
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    priceMonthly: 99,
    priceAnnual: 799,
    features: {
      templates: 500,
      exportsPerDay: -1, // Unlimited
      resolution: '1080p',
      watermark: false,
      videoTemplates: true,
      backgroundRemoval: true,
      backgroundRemovalUses: 10,
      customStickers: 5,
      prioritySupport: true,
    },
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 1999,
    features: {
      templates: -1, // Unlimited
      customTemplates: 10,
      exportsPerDay: -1,
      resolution: '1080p',
      watermark: false,
      videoTemplates: true,
      backgroundRemoval: true,
      backgroundRemovalUses: -1, // Unlimited
      customStickers: -1,
      bulkExport: 100,
      brandKit: true,
      apiAccess: true,
      teamMembers: 5,
      dedicatedSupport: true,
    },
  },
};

// Template Categories from PRD
export const TEMPLATE_CATEGORIES = {
  FESTIVALS: {
    id: 'festivals',
    name: 'Festivals',
    icon: 'celebration',
    templateCount: 150,
    subcategories: [
      'Diwali',
      'Holi',
      'Eid',
      'Christmas',
      'Pongal',
      'Onam',
      'Durga Puja',
      'Ganesh Chaturthi',
      'Raksha Bandhan',
    ],
  },
  DAILY_WISHES: {
    id: 'daily-wishes',
    name: 'Daily Wishes',
    icon: 'sun',
    templateCount: 100,
    subcategories: [
      'Good Morning',
      'Good Night',
      'Motivational',
      'Birthday',
      'Anniversary',
    ],
  },
  BUSINESS: {
    id: 'business',
    name: 'Business Promotions',
    icon: 'store',
    templateCount: 120,
    subcategories: [
      'Sale Announcements',
      'New Arrival',
      'Offer Banners',
      'Menu Cards',
      'Store Timings',
    ],
  },
  SOCIAL_MEDIA: {
    id: 'social-media',
    name: 'Social Media',
    icon: 'share',
    templateCount: 80,
    subcategories: [
      'Instagram Stories',
      'Facebook Posts',
      'LinkedIn Banners',
      'YouTube Thumbnails',
    ],
  },
  EVENTS: {
    id: 'events',
    name: 'Events',
    icon: 'event',
    templateCount: 50,
    subcategories: [
      'Wedding Invitations',
      'Party Invites',
      'Announcements',
    ],
  },
};

// Aspect Ratios
export const ASPECT_RATIOS = {
  SQUARE: { ratio: '1:1', width: 1080, height: 1080, name: 'Square (Instagram)' },
  PORTRAIT: { ratio: '9:16', width: 1080, height: 1920, name: 'Portrait (Stories)' },
  LANDSCAPE: { ratio: '16:9', width: 1920, height: 1080, name: 'Landscape (YouTube)' },
};

// Export Formats
export const EXPORT_FORMATS = {
  PNG: 'png',
  JPEG: 'jpg',
  MP4: 'mp4',
};

// Share Platforms
export const SHARE_PLATFORMS = {
  WHATSAPP: 'whatsapp',
  INSTAGRAM: 'instagram',
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
  LINKEDIN: 'linkedin',
  EMAIL: 'email',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'No internet connection. Please check your network.',
  TEMPLATE_LOAD_FAILED: 'Failed to load template. Please try again.',
  EXPORT_FAILED: 'Export failed. Please try again.',
  PAYMENT_FAILED: 'Payment failed. Please try again or use a different payment method.',
  STORAGE_PERMISSION: 'Storage permission required to save images.',
  CAMERA_PERMISSION: 'Camera permission required to take photos.',
  IMAGE_TOO_LARGE: 'Image size exceeds 25MB limit.',
  INSUFFICIENT_STORAGE: 'Not enough storage space on device.',
  PREMIUM_REQUIRED: 'This feature requires a Premium subscription.',
  EXPORT_LIMIT_REACHED: 'Daily export limit reached. Upgrade to Premium for unlimited exports.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  EXPORT_SUCCESS: 'Export successful!',
  TEMPLATE_SAVED: 'Template saved to favorites.',
  SUBSCRIPTION_SUCCESS: 'Subscription activated successfully!',
  IMAGE_SAVED: 'Image saved to gallery.',
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_DATA: '@craftify:user',
  AUTH_TOKEN: '@craftify:token',
  TEMPLATES_CACHE: '@craftify:templates',
  FAVORITES: '@craftify:favorites',
  RECENT: '@craftify:recent',
  SETTINGS: '@craftify:settings',
  ONBOARDING_COMPLETED: '@craftify:onboarding',
};

// Analytics Events (from PRD)
export const ANALYTICS_EVENTS = {
  APP_OPENED: 'app_opened',
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  LOGIN_COMPLETED: 'login_completed',
  CATEGORY_VIEWED: 'category_viewed',
  TEMPLATE_VIEWED: 'template_viewed',
  TEMPLATE_SEARCHED: 'template_searched',
  TEMPLATE_FAVORITED: 'template_favorited',
  EDITOR_OPENED: 'editor_opened',
  IMAGE_REPLACED: 'image_replaced',
  TEXT_EDITED: 'text_edited',
  FILTER_APPLIED: 'filter_applied',
  STICKER_ADDED: 'sticker_added',
  EXPORT_STARTED: 'export_started',
  EXPORT_COMPLETED: 'export_completed',
  EXPORT_FAILED: 'export_failed',
  SHARE_COMPLETED: 'share_completed',
  SAVED_TO_GALLERY: 'saved_to_gallery',
  PAYWALL_VIEWED: 'paywall_viewed',
  PRICING_VIEWED: 'pricing_viewed',
  SUBSCRIPTION_STARTED: 'subscription_started',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  TRIAL_STARTED: 'trial_started',
  TRIAL_CONVERTED: 'trial_converted',
  PREMIUM_FEATURE_CLICKED: 'premium_feature_clicked',
};

export default {
  APP_NAME,
  APP_TAGLINE,
  APP_VERSION,
  API_BASE_URL,
  CDN_BASE_URL,
  FEATURES,
  LIMITS,
  SUBSCRIPTION_TIERS,
  TEMPLATE_CATEGORIES,
  ASPECT_RATIOS,
  EXPORT_FORMATS,
  SHARE_PLATFORMS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  ANALYTICS_EVENTS,
};
