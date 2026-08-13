// src/database/scheduleRepository.js
//
// All SQLite access for the `schedules` table lives here. Screens/hooks
// should never write raw SQL — they call these functions instead.
//
// A single "class" the user adds (e.g. CC106 on Mon/Wed/Fri) is stored as
// one row PER selected day, sharing the same `group_id`. This keeps the
// table simple to query by day (for the timetable/today's-classes list)
// while still letting Edit/Delete act on "the class" as a whole.
//
// start_time / end_time are stored as minutes-from-midnight integers
// (e.g. 08:00 AM = 480), matching timeService's internal format.

import { getDatabase } from './database';

function generateGroupId() {
  return `sch_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

function nowIso() {
  return new Date().toISOString();
}

/**
 * Returns every schedule row, sorted by day then start time.
 */
export function getAllSchedules() {
  const db = getDatabase();
  return db.getAllSync(
    `SELECT * FROM schedules ORDER BY day ASC, start_time ASC;`
  );
}

/**
 * Returns schedule rows for a single weekday (e.g. "Wednesday"),
 * sorted chronologically.
 */
export function getSchedulesByDay(day) {
  const db = getDatabase();
  return db.getAllSync(
    `SELECT * FROM schedules WHERE day = ? ORDER BY start_time ASC;`,
    [day]
  );
}

/**
 * Returns all rows belonging to one class (all its selected days).
 */
export function getScheduleGroup(groupId) {
  const db = getDatabase();
  return db.getAllSync(
    `SELECT * FROM schedules WHERE group_id = ? ORDER BY 
       CASE day
         WHEN 'Monday' THEN 1 WHEN 'Tuesday' THEN 2 WHEN 'Wednesday' THEN 3
         WHEN 'Thursday' THEN 4 WHEN 'Friday' THEN 5 WHEN 'Saturday' THEN 6
         ELSE 7 END;`,
    [groupId]
  );
}

/**
 * Creates a new class. `days` is an array of weekday strings
 * (e.g. ["Monday", "Wednesday", "Friday"]) — one row is inserted per day,
 * all sharing a new group_id. Returns the group_id.
 */
export function addSchedule({ subjectName, days, startTime, endTime }) {
  const db = getDatabase();
  const groupId = generateGroupId();
  const timestamp = nowIso();

  db.withTransactionSync(() => {
    for (const day of days) {
      db.runSync(
        `INSERT INTO schedules
           (group_id, subject_name, day, start_time, end_time, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [groupId, subjectName, day, startTime, endTime, timestamp, timestamp]
      );
    }
  });

  return groupId;
}

/**
 * Replaces every row for a class with a fresh set matching the new
 * subject/days/start/end (simplest correct way to handle "the days
 * changed" without diffing row-by-row).
 */
export function updateScheduleGroup(groupId, { subjectName, days, startTime, endTime }) {
  const db = getDatabase();
  const timestamp = nowIso();

  db.withTransactionSync(() => {
    db.runSync(`DELETE FROM schedules WHERE group_id = ?;`, [groupId]);
    for (const day of days) {
      db.runSync(
        `INSERT INTO schedules
           (group_id, subject_name, day, start_time, end_time, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [groupId, subjectName, day, startTime, endTime, timestamp, timestamp]
      );
    }
  });
}

/**
 * Deletes every row belonging to a class (all its days).
 */
export function deleteScheduleGroup(groupId) {
  const db = getDatabase();
  db.runSync(`DELETE FROM schedules WHERE group_id = ?;`, [groupId]);
}

/**
 * Deletes every schedule row. Used by Settings > Clear All Schedule.
 */
export function clearAllSchedules() {
  const db = getDatabase();
  db.runSync(`DELETE FROM schedules;`);
}

/**
 * Finds existing rows on the same day whose time range overlaps the given
 * range, excluding rows from `excludeGroupId` (so editing a class doesn't
 * flag itself as a conflict). Used for the schedule-conflict warning.
 */
export function findOverlappingSchedules({ day, startTime, endTime, excludeGroupId = null }) {
  const db = getDatabase();
  return db.getAllSync(
    `SELECT * FROM schedules
     WHERE day = ?
       AND group_id IS NOT ?
       AND start_time < ?
       AND end_time > ?;`,
    [day, excludeGroupId ?? '', endTime, startTime]
  );
}