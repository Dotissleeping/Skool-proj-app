// src/screens/ScheduleScreen.jsx
//
// TEMPORARY: shows a simple list of saved classes so Add/Edit/Delete can
// be tested end-to-end. This gets replaced by the real automatic
// timetable grid in Phase 5 (ScheduleGrid.jsx).

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useSchedule } from '../hooks/useSchedule';
import AppHeader from '../components/AppHeader';
import EmptyState from '../components/EmptyState';
import { formatTimeRange } from '../utils/timeUtils';

export default function ScheduleScreen({ navigation }) {
  const { theme } = useTheme();
  const { classes, refresh } = useSchedule();

  // Refresh the list every time this screen regains focus (e.g. after
  // returning from Add/Edit, since each screen holds its own hook state).
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

      {classes.length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          title="No classes yet"
          description="Tap the + button above to add your first class."
        />
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.groupId}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}
              onPress={() => navigation.navigate('EditSchedule', { groupId: item.groupId })}
            >
              <Text style={[theme.typography.subtitle, { color: theme.colors.textPrimary }]}>
                {item.subjectName}
              </Text>
              <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary, marginTop: 4 }]}>
                {formatTimeRange(item.startTime, item.endTime)}
              </Text>
              <Text style={[theme.typography.caption, { color: theme.colors.accentText, marginTop: 6 }]}>
                {item.days.join(', ')}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { padding: 20 },
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 12,
  },
});