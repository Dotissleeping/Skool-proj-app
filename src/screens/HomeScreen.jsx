// src/screens/HomeScreen.jsx
//
// Real dashboard: welcome message, today's classes, current/next class,
// subject count, and quick actions — all derived from device-local time
// and the schedule database (spec section 5).

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useSchedule } from '../hooks/useSchedule';
import { useLocalTime } from '../hooks/useLocalTime';
import { getStudentName } from '../database/settingsRepository';
import {
  getTodaysSchedule,
  getCurrentAndNextClass,
  getSubjectCountToday,
  getMinutesUntil,
} from '../services/scheduleService';
import { minutesToLabel, formatTimeRange } from '../utils/timeUtils';

import AppHeader from '../components/AppHeader';
import ClassCard from '../components/ClassCard';
import StatCard from '../components/StatCard';
import QuickAction from '../components/QuickAction';
import EmptyState from '../components/EmptyState';

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const { schedules, refresh } = useSchedule();
  const { currentMinutes, currentWeekday } = useLocalTime();
  const [studentName, setStudentName] = useState('');

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refresh();
      setStudentName(getStudentName());
    });
    return unsubscribe;
  }, [navigation, refresh]);

  const todaysSchedule = getTodaysSchedule(schedules, currentWeekday);
  const { current, next } = getCurrentAndNextClass(todaysSchedule, currentMinutes);
  const subjectCount = getSubjectCountToday(todaysSchedule);

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <AppHeader title="Home" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[theme.typography.h2, { color: theme.colors.textPrimary }]}>
          Welcome, {studentName ? studentName : 'Student'}
        </Text>

        <Text style={[theme.typography.label, styles.sectionLabel, { color: theme.colors.textSecondary }]}>
          Today's Classes
        </Text>
        {todaysSchedule.length === 0 ? (
          <EmptyState
            icon="calendar-outline"
            title="No classes today"
            description="Nothing scheduled for today — enjoy the break."
          />
        ) : (
          todaysSchedule.map((row) => (
            <ClassCard
              key={row.id}
              startTime={row.start_time}
              endTime={row.end_time}
              subjectName={row.subject_name}
              onPress={() => navigation.navigate('Schedule', { screen: 'EditSchedule', params: { groupId: row.group_id } })}
            />
          ))
        )}

        {current ? (
          <StatCard
            label="CURRENT CLASS"
            value={current.subject_name}
            subtitle={formatTimeRange(current.start_time, current.end_time)}
          />
        ) : next ? (
          <StatCard
            label="NEXT CLASS"
            value={next.subject_name}
            subtitle={`${minutesToLabel(next.start_time)} · Starts in ${getMinutesUntil(next, currentMinutes)} min`}
          />
        ) : todaysSchedule.length > 0 ? (
          <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginBottom: 14 }]}>
            No more classes today.
          </Text>
        ) : null}

        <StatCard value={String(subjectCount)} label="Subjects Today" centered />

        <View style={styles.quickActionsRow}>
          <QuickAction
            icon="calendar-outline"
            label="Schedule"
            onPress={() => navigation.navigate('Schedule')}
            style={{ marginRight: 10 }}
          />
          <QuickAction icon="globe-outline" label="Portals" onPress={() => navigation.navigate('Portals')} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  sectionLabel: { marginTop: 22, marginBottom: 10 },
  quickActionsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
});