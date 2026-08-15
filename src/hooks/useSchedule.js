// src/hooks/useSchedule.js
//
// Exposes schedule data + CRUD actions to screens, backed by
// scheduleRepository. Screens should use this hook instead of calling the
// repository directly, so loading/refresh logic lives in one place.

import { useCallback, useEffect, useState } from 'react';
import {
  getAllSchedules,
  getScheduleGroup,
  addSchedule,
  updateScheduleGroup,
  deleteScheduleGroup,
  findOverlappingSchedules,
  clearAllSchedules,
} from '../database/scheduleRepository';
import { groupSchedulesByGroupId } from '../utils/scheduleUtils';

export function useSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    try {
      const rows = getAllSchedules();
      setSchedules(rows);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const classes = groupSchedulesByGroupId(schedules);

  /**
   * Checks for time-overlap conflicts across all selected days.
   * Returns an array of { day, conflictingSubject } — empty if none.
   */
  function checkConflicts({ days, startTime, endTime, excludeGroupId = null }) {
    const conflicts = [];
    for (const day of days) {
      const overlaps = findOverlappingSchedules({ day, startTime, endTime, excludeGroupId });
      overlaps.forEach((row) =>
        conflicts.push({ day, conflictingSubject: row.subject_name })
      );
    }
    return conflicts;
  }

  function addClass({ subjectName, days, startTime, endTime }) {
    const groupId = addSchedule({ subjectName, days, startTime, endTime });
    refresh();
    return groupId;
  }

  function updateClass(groupId, { subjectName, days, startTime, endTime }) {
    updateScheduleGroup(groupId, { subjectName, days, startTime, endTime });
    refresh();
  }

  function deleteClass(groupId) {
    deleteScheduleGroup(groupId);
    refresh();
  }

  function clearAll() {
    clearAllSchedules();
    refresh();
  }

  function getClass(groupId) {
    const rows = getScheduleGroup(groupId);
    if (rows.length === 0) return null;
    return {
      groupId,
      subjectName: rows[0].subject_name,
      startTime: rows[0].start_time,
      endTime: rows[0].end_time,
      days: rows.map((r) => r.day),
    };
  }

  return {
    schedules, // raw rows (one per day)
    classes, // grouped by class (one per group_id)
    loading,
    refresh,
    checkConflicts,
    addClass,
    updateClass,
    deleteClass,
    clearAll,
    getClass,
  };
}