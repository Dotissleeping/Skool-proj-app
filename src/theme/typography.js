// src/theme/typography.js
//
// Type scale for Skool. Uses the system font for now (fast startup, no font
// loading delay). Custom fonts can be dropped into assets/fonts later and
// loaded via expo-font without touching call sites — everything reads from
// this file.

export const fontFamily = {
  regular: undefined, // undefined = platform default system font
  medium: undefined,
  semibold: undefined,
  bold: undefined,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: '700', lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  subtitle: { fontSize: 15, fontWeight: '600', lineHeight: 20 },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 21 },
  bodySmall: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
  caption: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
  label: { fontSize: 13, fontWeight: '600', lineHeight: 18, letterSpacing: 0.2 },
  statNumber: { fontSize: 32, fontWeight: '700', lineHeight: 36 },
};