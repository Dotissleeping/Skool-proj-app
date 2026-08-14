// src/components/ScheduleGrid.jsx
//
// The automatic timetable grid. Time column on the left stays fixed
// while day columns scroll horizontally (both scroll vertically together
// since they're siblings inside one outer ScrollView). Block position and
// height are always computed from day/start_time/end_time — never
// hardcoded (spec sections 11-14).

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import ScheduleBlock from './ScheduleBlock';
import { DAYS_OF_WEEK, minutesToLabel, formatTimeRange } from '../utils/timeUtils';
import { getTimetableRange, getHourMarks, getTintIndexForSubject } from '../utils/scheduleUtils';

const HOUR_HEIGHT = 60;
const DAY_COLUMN_WIDTH = 108;
const TIME_COLUMN_WIDTH = 60;
const HEADER_HEIGHT = 36;

export default function ScheduleGrid({ schedules, onBlockPress }) {
  const { theme } = useTheme();

  const range = getTimetableRange(schedules);
  const hourMarks = getHourMarks(range.start, range.end);
  const gridHeight = ((range.end - range.start) / 60) * HOUR_HEIGHT;
  const gridWidth = DAYS_OF_WEEK.length * DAY_COLUMN_WIDTH;

  function minutesToY(minutes) {
    return ((minutes - range.start) / 60) * HOUR_HEIGHT;
  }

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.verticalContent}>
      <View style={styles.row}>
        {/* Fixed time column */}
        <View style={{ width: TIME_COLUMN_WIDTH }}>
          <View style={{ height: HEADER_HEIGHT }} />
          <View style={{ height: gridHeight }}>
            {hourMarks.map((mark) => (
              <Text
                key={mark}
                style={[
                  theme.typography.caption,
                  {
                    position: 'absolute',
                    top: minutesToY(mark) - 7,
                    color: theme.colors.textMuted,
                    width: TIME_COLUMN_WIDTH - 8,
                  },
                ]}
              >
                {minutesToLabel(mark)}
              </Text>
            ))}
          </View>
        </View>

        {/* Horizontally scrollable day columns */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ width: gridWidth }}>
            {/* Day header row */}
            <View style={[styles.headerRow, { height: HEADER_HEIGHT, borderColor: theme.colors.border }]}>
              {DAYS_OF_WEEK.map((day) => (
                <View key={day} style={{ width: DAY_COLUMN_WIDTH, alignItems: 'center' }}>
                  <Text style={[theme.typography.label, { color: theme.colors.textSecondary }]}>
                    {day.slice(0, 3).toUpperCase()}
                  </Text>
                </View>
              ))}
            </View>

            {/* Grid body */}
            <View style={{ width: gridWidth, height: gridHeight }}>
              {/* Horizontal hour lines */}
              {hourMarks.map((mark) => (
                <View
                  key={mark}
                  style={{
                    position: 'absolute',
                    top: minutesToY(mark),
                    left: 0,
                    right: 0,
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: theme.colors.gridLine,
                  }}
                />
              ))}

              {/* Vertical day-separator lines */}
              {DAYS_OF_WEEK.map((day, index) => (
                <View
                  key={day}
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: index * DAY_COLUMN_WIDTH,
                    width: StyleSheet.hairlineWidth,
                    backgroundColor: theme.colors.gridLine,
                  }}
                />
              ))}

              {/* Class blocks, positioned automatically from day/start/end */}
              {schedules.map((row) => {
                const dayIndex = DAYS_OF_WEEK.indexOf(row.day);
                if (dayIndex === -1) return null;

                const top = minutesToY(row.start_time) + 2;
                const height = Math.max(
                  ((row.end_time - row.start_time) / 60) * HOUR_HEIGHT - 4,
                  22
                );
                const tintIndex = getTintIndexForSubject(
                  row.subject_name,
                  theme.colors.scheduleBlockTints.length
                );

                return (
                  <ScheduleBlock
                    key={row.id}
                    subjectName={row.subject_name}
                    timeLabel={formatTimeRange(row.start_time, row.end_time)}
                    tintColor={theme.colors.scheduleBlockTints[tintIndex]}
                    onPress={() => onBlockPress && onBlockPress(row.group_id)}
                    style={{
                      top,
                      left: dayIndex * DAY_COLUMN_WIDTH + 3,
                      width: DAY_COLUMN_WIDTH - 6,
                      height,
                    }}
                  />
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  verticalContent: { paddingBottom: 30 },
  row: { flexDirection: 'row' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});