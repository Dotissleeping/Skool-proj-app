// src/components/TimePicker.jsx
//
// Lightweight time picker — no extra dependency. Three chip rows
// (hour / minute / AM-PM) the user taps through. Value and onChange work
// in minutes-from-midnight, matching the app's internal time format.

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { minutesToParts, partsToMinutes } from '../utils/timeUtils';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
const PERIODS = ['AM', 'PM'];

function Chip({ label, active, onPress, theme }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? theme.colors.accent : theme.colors.surfaceAlt,
          borderColor: active ? theme.colors.accent : theme.colors.border,
        },
      ]}
    >
      <Text
        style={[
          theme.typography.bodySmall,
          { color: active ? '#FFFFFF' : theme.colors.textPrimary, fontWeight: '600' },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function TimePicker({ label, valueMinutes, onChange }) {
  const { theme } = useTheme();
  const parts = minutesToParts(valueMinutes);

  function update(partial) {
    const nextParts = { ...parts, ...partial };
    onChange(partsToMinutes(nextParts));
  }

  return (
    <View style={styles.container}>
      <Text style={[theme.typography.label, { color: theme.colors.textSecondary }]}>
        {label}
      </Text>

      <Text style={[theme.typography.h3, { color: theme.colors.textPrimary, marginTop: 4, marginBottom: 8 }]}>
        {String(parts.hour12).padStart(2, '0')}:{String(parts.minute).padStart(2, '0')} {parts.period}
      </Text>

      <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginBottom: 4 }]}>
        Hour
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {HOURS.map((h) => (
          <Chip key={h} label={String(h)} active={h === parts.hour12} onPress={() => update({ hour12: h })} theme={theme} />
        ))}
      </ScrollView>

      <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginTop: 10, marginBottom: 4 }]}>
        Minute
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {MINUTES.map((m) => (
          <Chip
            key={m}
            label={String(m).padStart(2, '0')}
            active={m === parts.minute}
            onPress={() => update({ minute: m })}
            theme={theme}
          />
        ))}
      </ScrollView>

      <View style={[styles.row, { marginTop: 10 }]}>
        {PERIODS.map((p) => (
          <Chip key={p} label={p} active={p === parts.period} onPress={() => update({ period: p })} theme={theme} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: 8,
  },
});