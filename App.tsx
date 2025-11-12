/**
 * Craftify - Personalized Template Creator App
 * Based on PRD specifications
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation/AppNavigator';
import ThemeProvider from './src/theme/ThemeProvider';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Navigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
