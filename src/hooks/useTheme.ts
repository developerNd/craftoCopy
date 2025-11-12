// Custom hook for theme management
import { useColorScheme } from 'react-native';
import { Colors } from '../constants';

/**
 * Custom hook for managing app theme
 * Provides theme colors and utilities
 */
export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const theme = {
    colors: {
      ...Colors,
      background: isDark ? Colors.background.dark : Colors.background.light,
      surface: isDark ? Colors.grey[900] : Colors.white,
      text: isDark ? Colors.text.light : Colors.text.primary,
      textSecondary: isDark ? Colors.grey[400] : Colors.text.secondary,
      border: isDark ? Colors.grey[700] : Colors.border.light,
    },
    isDark,
    isLight: !isDark,
  };

  return theme;
};

export default useTheme;
