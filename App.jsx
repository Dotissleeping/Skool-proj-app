// App.jsx
//
// Root entry point. Kept intentionally thin — all real logic lives in
// src/. Database init/migrations run once at module load, BEFORE any
// component renders — this guarantees every screen (and useTheme, which
// reads the saved theme preference on its very first render) can safely
// assume the schema already exists.

import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/hooks/useTheme';
import AppNavigation from './src/navigation/AppNavigation';
import { initDatabase } from './src/database/migrations';

try {
  initDatabase();
} catch (error) {
  console.error('Database init failed:', error);
  // Fail open: the app still renders. Screens that need data will show
  // their own empty/error states rather than the whole app being stuck.
}

function ThemedStatusBar() {
  const { theme } = useTheme();
  return <StatusBar style={theme.isDark ? 'light' : 'dark'} />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemedStatusBar />
          <AppNavigation />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}