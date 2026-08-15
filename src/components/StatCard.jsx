// src/components/StatCard.jsx
//
// Flexible stat/info card. Used two ways on Home:
//   - Subject count: <StatCard value="5" label="Subjects Today" centered />
//   - Current/Next class panel: <StatCard label="NEXT CLASS" value="PF102" subtitle="10:00 AM · Starts in 35 minutes" />

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function StatCard({ label, value, subtitle, centered = false }) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.accentMuted,
          borderColor: theme.colors.accentSoft,
          alignItems: centered ? 'center' : 'flex-start',
        },
      ]}
    >
      <Text
        style={[
          theme.typography.label,
          { color: theme.colors.accentText, textAlign: centered ? 'center' : 'left' },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          centered ? theme.typography.statNumber : theme.typography.h2,
          { color: theme.colors.textPrimary, marginTop: 6, textAlign: centered ? 'center' : 'left' },
        ]}
      >
        {value}
      </Text>
      {subtitle ? (
        <Text
          style={[
            theme.typography.bodySmall,
            { color: theme.colors.textSecondary, marginTop: 4, textAlign: centered ? 'center' : 'left' },
          ]}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 14,
  },
});