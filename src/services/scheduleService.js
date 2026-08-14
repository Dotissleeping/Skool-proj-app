// src/services/scheduleService.js
//
// Combines schedule rows with the current local time to answer the
// questions the dashboard needs: today's classes, current class, next
// class, and how many subjects are scheduled today (spec sections 16-18).
// Pure functions — no SQLite here, just schedules[] in, answers out — so
// they're easy to reuse from both HomeScreen and tests.

import { sortByStartTime } from '../utils/scheduleUtils';

/**
 * Returns today's schedule rows (matching `weekday`), sorted
 * chronologically. Empty array on weekends with no classes (e.g. Sunday).
 */
export function getTodaysSchedule(schedules, weekday) {
  const todays = schedules.filter((row) => row.day === weekday);
  return sortByStartTime(todays);
}

/**
 * Determines the current and/or next class for today, given the current
 * time (minutes-from-midnight). Returns:
 *   { current: row | null, next: row | null }
 * - `current` is set when `now` falls within a class's start/end range.
 * - `next` is the soonest upcoming class after `now` (set whether or not
 *   there's a current class, so the UI can still preview what's coming).
 */
export function getCurrentAndNextClass(todaysSchedule, currentMinutes) {
  let current = null;
  let next = null;

  for (const row of todaysSchedule) {
    if (currentMinutes >= row.start_time && currentMinutes < row.end_time) {
      current = row;
    } else if (row.start_time > currentMinutes) {
      if (!next || row.start_time < next.start_time) {
        next = row;
      }
    }
  }

  return { current, next };
}

/**
 * Number of subjects scheduled today (spec section 18).
 */
export function getSubjectCountToday(todaysSchedule) {
  return todaysSchedule.length;
}

/**
 * Minutes remaining until a class starts, for "Starts in 35 minutes"
 * style copy. Returns 0 or less if it has already started.
 */
export function getMinutesUntil(row, currentMinutes) {
  if (!row) return null;
  return row.start_time - currentMinutes;
}