// src/components/LoadingView.jsx
//
// Reusable loading state — small spinner + optional label. Used while
// SQLite loads, portals load, downloads process, etc.

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function LoadingView({ label }) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={theme.colors.accent} />
      {label ? (
        <Text style={[theme.typography.bodySmall, styles.label, { color: theme.colors.textSecondary }]}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  label: {
    marginTop: 10,
  },
});