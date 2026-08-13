// src/utils/scheduleUtils.js
//
// Pure helpers for working with arrays of schedule rows (as returned by
// scheduleRepository). No SQLite here — just sorting/grouping logic so
// screens and services stay simple.

import { DAYS_OF_WEEK } from './timeUtils';

/**
 * Sorts schedule rows chronologically by start time.
 */
export function sortByStartTime(schedules) {
  return [...schedules].sort((a, b) => a.start_time - b.start_time);
}

/**
 * Groups a flat list of schedule rows (one row per day, per
 * scheduleRepository's storage model) back into "classes" by group_id,
 * so the UI can show one card per class instead of one per day-row.
 */
export function groupSchedulesByGroupId(schedules) {
  const groups = new Map();

  for (const row of schedules) {
    if (!groups.has(row.group_id)) {
      groups.set(row.group_id, {
        groupId: row.group_id,
        subjectName: row.subject_name,
        startTime: row.start_time,
        endTime: row.end_time,
        days: [],
      });
    }
    groups.get(row.group_id).days.push(row.day);
  }

  const result = Array.from(groups.values());
  result.forEach((group) => {
    group.days.sort((a, b) => DAYS_OF_WEEK.indexOf(a) - DAYS_OF_WEEK.indexOf(b));
  });
  return result;
}