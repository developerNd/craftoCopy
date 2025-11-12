// Dimension constants for Craftify app
import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 48,
};

export const IconSize = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
};

// Touch target sizes (per iOS/Android guidelines)
export const TouchTarget = {
  min: 44, // Minimum touch target size
  default: 48,
};

// Screen dimensions
export const Screen = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isLargeDevice: SCREEN_WIDTH >= 768,
};

// Template dimensions (based on PRD)
export const TemplateDimensions = {
  square: { width: 1080, height: 1080 }, // 1:1 for Instagram
  portrait: { width: 1080, height: 1920 }, // 9:16 for Stories
  landscape: { width: 1920, height: 1080 }, // 16:9 for YouTube
};

// Export quality settings
export const ExportQuality = {
  free: {
    width: 720,
    height: 1280,
    quality: 0.8,
  },
  premium: {
    width: 1080,
    height: 1920,
    quality: 0.95,
  },
};

// Animation durations
export const AnimationDuration = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Platform-specific values
export const PlatformSpacing = {
  statusBar: Platform.select({
    ios: 20,
    android: 0,
  }),
  headerHeight: Platform.select({
    ios: 44,
    android: 56,
  }),
  tabBarHeight: Platform.select({
    ios: 49,
    android: 56,
  }),
};

export default {
  Spacing,
  BorderRadius,
  FontSize,
  IconSize,
  TouchTarget,
  Screen,
  TemplateDimensions,
  ExportQuality,
  AnimationDuration,
  PlatformSpacing,
};
