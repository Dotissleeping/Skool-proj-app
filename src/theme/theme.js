// src/theme/theme.js
//
// Combines colors + typography + spacing into single light/dark theme
// objects. `useTheme()` (see src/hooks/useTheme.js) is the only thing
// screens/components should import from — never colors.js directly —
// so theme switching stays centralized.

import { lightColors, darkColors } from './colors';
import { typography, fontFamily } from './typography';
import { spacing, radius, layout } from './spacing';

function buildTheme(colors) {
  return {
    colors,
    typography,
    fontFamily,
    spacing,
    radius,
    layout,
    isDark: colors.mode === 'dark',
  };
}

export const lightTheme = buildTheme(lightColors);
export const darkTheme = buildTheme(darkColors);

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

// Theme preference options surfaced in Settings.
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};