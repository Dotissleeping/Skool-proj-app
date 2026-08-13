// src/hooks/useTheme.js
//
// Provides the active theme (light/dark) to the whole app based on the
// user's preference (Light / Dark / System). In later phases, `themeMode`
// will be loaded from and persisted to SQLite via settingsRepository — for
// now it lives in memory, defaulting to "system".

import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { themes, THEME_MODES } from '../theme/theme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [themeMode, setThemeMode] = useState(THEME_MODES.SYSTEM);

  const resolvedMode = useMemo(() => {
    if (themeMode === THEME_MODES.SYSTEM) {
      return systemScheme === 'dark' ? 'dark' : 'light';
    }
    return themeMode;
  }, [themeMode, systemScheme]);

  const theme = themes[resolvedMode];

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