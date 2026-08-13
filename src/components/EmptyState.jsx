// src/components/EmptyState.jsx
//
// Reusable empty state (no schedule yet, no downloads yet, etc.)

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export default function EmptyState({ icon = 'file-tray-outline', title, description }) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.accentMuted }]}>
        <Ionicons name={icon} size={28} color={theme.colors.accent} />
      </View>
      <Text style={[theme.typography.subtitle, { color: theme.colors.textPrimary, marginTop: 14 }]}>
        {title}
      </Text>
      {description ? (
        <Text
          style={[
            theme.typography.bodySmall,
            { color: theme.colors.textSecondary, marginTop: 6, textAlign: 'center' },
          ]}
        >
          {description}
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
    padding: 32,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});