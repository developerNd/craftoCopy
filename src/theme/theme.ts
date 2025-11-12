import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import { ThemeColors } from '../types';

// Custom color palette based on PRD specifications
const lightColors: ThemeColors = {
  primary: '#6200EE',
  secondary: '#03DAC6',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#000000',
  textSecondary: '#666666',
  border: '#E0E0E0',
  error: '#B00020',
  success: '#4CAF50',
  warning: '#FF9800',
};

const darkColors: ThemeColors = {
  primary: '#BB86FC',
  secondary: '#03DAC6',
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  border: '#333333',
  error: '#CF6679',
  success: '#4CAF50',
  warning: '#FF9800',
};

// Font configuration
const fontConfig = {
  web: {
    regular: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '500' as const,
    },
    light: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '300' as const,
    },
    thin: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '100' as const,
    },
  },
  ios: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500' as const,
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300' as const,
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100' as const,
    },
  },
  android: {
    regular: {
      fontFamily: 'Roboto',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'Roboto',
      fontWeight: '500' as const,
    },
    light: {
      fontFamily: 'Roboto',
      fontWeight: '300' as const,
    },
    thin: {
      fontFamily: 'Roboto',
      fontWeight: '100' as const,
    },
  },
};

// Light theme
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: lightColors.primary,
    secondary: lightColors.secondary,
    background: lightColors.background,
    surface: lightColors.surface,
    onSurface: lightColors.text,
    onBackground: lightColors.text,
    error: lightColors.error,
    onError: '#FFFFFF',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    outline: lightColors.border,
  },
  fonts: configureFonts({ config: fontConfig }),
};

// Dark theme
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: darkColors.primary,
    secondary: darkColors.secondary,
    background: darkColors.background,
    surface: darkColors.surface,
    onSurface: darkColors.text,
    onBackground: darkColors.text,
    error: darkColors.error,
    onError: '#000000',
    onPrimary: '#000000',
    onSecondary: '#000000',
    outline: darkColors.border,
  },
  fonts: configureFonts({ config: fontConfig }),
};

// Export colors for use in custom components
export { lightColors, darkColors };
