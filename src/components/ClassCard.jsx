// src/components/ClassCard.jsx
//
// A single row in "Today's Classes" — time range + subject name.
// Optionally tappable (Home links it to Edit Schedule).

import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { formatTimeRange } from '../utils/timeUtils';

export default function ClassCard({ startTime, endTime, subjectName, onPress }) {
  const { theme } = useTheme();

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>
        {formatTimeRange(startTime, endTime)}
      </Text>
      <Text style={[theme.typography.subtitle, { color: theme.colors.textPrimary, marginTop: 3 }]}>
        {subjectName}
      </Text>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
});