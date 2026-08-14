// src/components/ScheduleBlock.jsx
//
// A single positioned block inside the timetable grid. Purely
// presentational — ScheduleGrid computes top/left/width/height and passes
// them in via `style`, so this component never does grid math itself.

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function ScheduleBlock({ subjectName, timeLabel, tintColor, style, onPress }) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.block,
        {
          backgroundColor: tintColor,
          borderColor: theme.colors.accent,
        },
        style,
      ]}
    >
      <Text
        numberOfLines={2}
        style={[theme.typography.caption, { color: theme.colors.accentText, fontWeight: '700' }]}
      >
        {subjectName}
      </Text>
      {timeLabel ? (
        <Text
          numberOfLines={1}
          style={[theme.typography.caption, { color: theme.colors.accentText, marginTop: 2, opacity: 0.85 }]}
        >
          {timeLabel}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  block: {
    position: 'absolute',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 4,
    overflow: 'hidden',
  },
});