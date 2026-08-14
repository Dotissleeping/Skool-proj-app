// src/screens/ScheduleScreen.jsx
//
// Renders the automatic timetable grid (ScheduleGrid). The grid always
// shows, even with zero classes, using the default 07:00 AM–05:00 PM
// range — tapping a class block opens Edit; the + button opens Add.

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useSchedule } from '../hooks/useSchedule';
import AppHeader from '../components/AppHeader';
import ScheduleGrid from '../components/ScheduleGrid';

export default function ScheduleScreen({ navigation }) {
  const { theme } = useTheme();
  const { schedules, refresh } = useSchedule();

  // Each screen holds its own useSchedule() state, so refetch whenever
  // this screen regains focus (e.g. after returning from Add/Edit).
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', refresh);
    return unsubscribe;
  }, [navigation, refresh]);

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <AppHeader
        title="Schedule"
        rightAction={
          <TouchableOpacity onPress={() => navigation.navigate('AddSchedule')} hitSlop={12}>
            <Ionicons name="add-circle" size={26} color={theme.colors.accent} />
          </TouchableOpacity>
        }
      />
      <ScheduleGrid
        schedules={schedules}
        onBlockPress={(groupId) => navigation.navigate('EditSchedule', { groupId })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});