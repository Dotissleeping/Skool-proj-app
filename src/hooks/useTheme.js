// src/hooks/useTheme.js
//
// Provides the active theme (light/dark) to the whole app based on the
// user's preference (Light / Dark / System), persisted to SQLite via
// settingsRepository. The initial value is read synchronously on first
// render — safe because App.jsx guarantees the database schema exists
// before this ever mounts.

import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { themes, THEME_MODES } from '../theme/theme';
import { getThemeMode, setThemeMode as persistThemeMode } from '../database/settingsRepository';

const ThemeContext = createContext(null);

function readInitialThemeMode() {
  try {
    return getThemeMode();
  } catch (error) {
    return THEME_MODES.SYSTEM;
  }
}

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [themeMode, setThemeModeState] = useState(readInitialThemeMode);

  const resolvedMode = useMemo(() => {
    if (themeMode === THEME_MODES.SYSTEM) {
      return systemScheme === 'dark' ? 'dark' : 'light';
    }
    return themeMode;
  }, [themeMode, systemScheme]);

  const theme = themes[resolvedMode];

  function setThemeMode(mode) {
    setThemeModeState(mode);
    try {
      persistThemeMode(mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  }

  const value = useMemo(
    () => ({
      theme,
      themeMode, // the user's stored preference: light | dark | system
      resolvedMode, // the actual palette in use right now
      setThemeMode,
    }),
    [theme, themeMode, resolvedMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}