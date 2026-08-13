// src/screens/EditScheduleScreen.jsx
//
// Edit/delete an existing class. Receives groupId via route.params,
// preloads its current values, and reuses the same validation/conflict
// logic as Add.

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useSchedule } from '../hooks/useSchedule';
import AppHeader from '../components/AppHeader';
import TimePicker from '../components/TimePicker';
import { DAYS_OF_WEEK } from '../utils/timeUtils';
import { validateScheduleForm } from '../utils/validation';

export default function EditScheduleScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { getClass, updateClass, deleteClass, checkConflicts } = useSchedule();
  const groupId = route?.params?.groupId;

  const [subjectName, setSubjectName] = useState('');
  const [days, setDays] = useState([]);
  const [startTime, setStartTime] = useState(480);
  const [endTime, setEndTime] = useState(600);
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const existing = getClass(groupId);
    if (!existing) {
      setNotFound(true);
      return;
    }
    setSubjectName(existing.subjectName);
    setDays(existing.days);
    setStartTime(existing.startTime);
    setEndTime(existing.endTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  function toggleDay(day) {
    setDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  }

  function handleSave() {
    const { valid, errors: formErrors } = validateScheduleForm({
      subjectName,
      days,
      startTime,
      endTime,
    });
    setErrors(formErrors);
    if (!valid) return;

    const conflicts = checkConflicts({ days, startTime, endTime, excludeGroupId: groupId });
    if (conflicts.length > 0) {
      const first = conflicts[0];
      Alert.alert(
        'Schedule Conflict',
        `${first.conflictingSubject} already runs at this time on ${first.day}.\n\nAre you sure you want to save this change?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Save Anyway', style: 'destructive', onPress: saveChanges },
        ]
      );
      return;
    }

    saveChanges();
  }

  function saveChanges() {
    updateClass(groupId, { subjectName: subjectName.trim(), days, startTime, endTime });
    navigation.goBack();
  }

  function handleDelete() {
    Alert.alert('Delete Class', `Delete ${subjectName || 'this class'}? This can't be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteClass(groupId);
          navigation.goBack();
        },
      },
    ]);
  }

  if (notFound) {
    return (
      <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
        <AppHeader title="Edit Schedule" onBack={() => navigation.goBack()} />
        <View style={styles.content}>
          <Text style={{ color: theme.colors.textSecondary }}>This class could not be found.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <AppHeader title="Edit Schedule" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[theme.typography.label, { color: theme.colors.textSecondary }]}>
          Subject Name
        </Text>
        <TextInput
          value={subjectName}
          onChangeText={setSubjectName}
          placeholder="e.g. CC106"
          placeholderTextColor={theme.colors.textMuted}
          style={[
            styles.input,
            {
              color: theme.colors.textPrimary,
              backgroundColor: theme.colors.surface,
              borderColor: errors.subjectName ? theme.colors.danger : theme.colors.border,
            },
          ]}
        />
        {errors.subjectName ? (
          <Text style={[theme.typography.caption, { color: theme.colors.danger, marginTop: 4 }]}>
            {errors.subjectName}
          </Text>
        ) : null}

        <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginTop: 18 }]}>
          Day/s
        </Text>
        <View style={styles.dayRow}>
          {DAYS_OF_WEEK.map((day) => {
            const active = days.includes(day);
            return (
              <TouchableOpacity
                key={day}
                onPress={() => toggleDay(day)}
                style={[
                  styles.dayChip,
                  {
                    backgroundColor: active ? theme.colors.accent : theme.colors.surfaceAlt,
                    borderColor: active ? theme.colors.accent : theme.colors.border,
                  },
                ]}
              >
                <Text style={{ color: active ? '#FFFFFF' : theme.colors.textPrimary, fontWeight: '600' }}>
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.days ? (
          <Text style={[theme.typography.caption, { color: theme.colors.danger, marginTop: 4 }]}>
            {errors.days}
          </Text>
        ) : null}

        <View style={{ marginTop: 18 }}>
          <TimePicker label="Start Time" valueMinutes={startTime} onChange={setStartTime} />
          <TimePicker label="End Time" valueMinutes={endTime} onChange={setEndTime} />
        </View>
        {errors.time ? (
          <Text style={[theme.typography.caption, { color: theme.colors.danger, marginBottom: 8 }]}>
            {errors.time}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.colors.accent }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={[styles.deleteButtonText, { color: theme.colors.danger }]}>
            DELETE CLASS
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginTop: 6,
  },
  dayRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  dayChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: 8,
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.4,
  },
  deleteButton: {
    marginTop: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.4,
  },
});