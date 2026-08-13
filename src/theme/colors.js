// src/theme/colors.js
//
// Centralized color palettes for Skool.
// Light mode: soft cream background, dark text, muted school red.
// Dark mode: near-black background, light text, muted red accent.
// (Not a simple inversion — surfaces, borders, and accent tints are tuned separately.)
//
// NOTE: The "school red" values below are a reasonable neutral default inspired by
// the reference portal screenshot. Swap `accent` (and its tints) if the real school
// brand red is provided later — nothing else in the app should need to change.

const schoolRed = {
  50: '#FBECEC',
  100: '#F5D2D2',
  200: '#E9A8A8',
  300: '#DC7E7E',
  400: '#CE5B5B',
  500: '#B84343', // primary accent
  600: '#9A3535',
  700: '#7C2A2A',
  800: '#5E2020',
  900: '#401616',
};

export const lightColors = {
  mode: 'light',

  background: '#FDFBF8', // soft cream
  surface: '#FFFFFF',
  surfaceAlt: '#F7F2ED',

  textPrimary: '#2A2422',
  textSecondary: '#6B615C',
  textMuted: '#9A8F89',

  border: '#EAE1DA',
  gridLine: '#EEE6DF',

  accent: schoolRed[500],
  accentSoft: schoolRed[100],
  accentMuted: schoolRed[50],
  accentText: schoolRed[700],

  success: '#3F8F5F',
  warning: '#B8863F',
  danger: '#B84343',

  tabInactive: '#9A8F89',
  tabActive: schoolRed[500],

  scheduleBlockTints: [
    'rgba(184, 67, 67, 0.16)',
    'rgba(184, 67, 67, 0.24)',
    'rgba(206, 91, 91, 0.20)',
    'rgba(184, 67, 67, 0.30)',
    'rgba(154, 53, 53, 0.18)',
    'rgba(220, 126, 126, 0.26)',
  ],
};

export const darkColors = {
  mode: 'dark',

  background: '#17140F',
  surface: '#211D19',
  surfaceAlt: '#2A2521',

  textPrimary: '#F2ECE6',
  textSecondary: '#C4BAB2',
  textMuted: '#8A8078',

  border: '#332C26',
  gridLine: '#2C2620',

  accent: schoolRed[400],
  accentSoft: 'rgba(206, 91, 91, 0.22)',
  accentMuted: 'rgba(206, 91, 91, 0.12)',
  accentText: schoolRed[200],

  success: '#5FAE7F',
  warning: '#D6A868',
  danger: '#DC7E7E',

  tabInactive: '#8A8078',
  tabActive: schoolRed[400],

  scheduleBlockTints: [
    'rgba(206, 91, 91, 0.24)',
    'rgba(206, 91, 91, 0.32)',
    'rgba(220, 126, 126, 0.26)',
    'rgba(184, 67, 67, 0.34)',
    'rgba(233, 168, 168, 0.20)',
    'rgba(206, 91, 91, 0.40)',
  ],
};

export const rawSchoolRed = schoolRed;