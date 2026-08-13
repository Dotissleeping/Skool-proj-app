// App.jsx
//
// Root entry point. Kept intentionally thin — all real logic lives in
// src/. This file wires up global providers (gesture handler root, safe
// area, theme, navigation), the status bar, and runs SQLite init/migrations
// once before the app is shown (per the startup flow in the spec).

import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/hooks/useTheme';
import AppNavigation from './src/navigation/AppNavigation';
import LoadingView from './src/components/LoadingView';
import { initDatabase } from './src/database/migrations';

function ThemedStatusBar() {
  const { theme } = useTheme();
  return <StatusBar style={theme.isDark ? 'light' : 'dark'} />;
}

function ThemedLoadingGate({ ready, children }) {
  const { theme } = useTheme();
  if (!ready) {
    return (
      <>
        <ThemedStatusBar />
        <LoadingView label="Setting up Skool..." />
      </>
    );
  }
  return children;
}

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    try {
      initDatabase();
      setDbReady(true);
    } catch (error) {
      console.error('Database init failed:', error);
      setDbError(error);
      // Fail open: still let the app render so the person isn't stuck on
      // a blank screen. Screens that need data will show their own
      // empty/error states.
      setDbReady(true);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemedLoadingGate ready={dbReady}>
            <ThemedStatusBar />
            <AppNavigation />
          </ThemedLoadingGate>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}