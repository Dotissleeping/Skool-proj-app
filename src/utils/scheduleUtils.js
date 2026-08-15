import { DAYS_OF_WEEK } from './timeUtils';

const DEFAULT_RANGE_START = 7 * 60; // 07:00 AM
const DEFAULT_RANGE_END = 17 * 60; // 05:00 PM

/**
 * Determines the timetable's visible time range from the current
 * schedules. Falls back to 07:00 AM–05:00 PM when there are none, and
 * always expands (never shrinks below the default) to fit any class that
 * starts earlier or ends later, rounded out to the nearest hour
 * (spec section 13).
 */
export function getTimetableRange(schedules) {
  if (!schedules || schedules.length === 0) {
    return { start: DEFAULT_RANGE_START, end: DEFAULT_RANGE_END };
  }

  const earliestStart = Math.min(...schedules.map((s) => s.start_time));
  const latestEnd = Math.max(...schedules.map((s) => s.end_time));

  const start = Math.min(DEFAULT_RANGE_START, Math.floor(earliestStart / 60) * 60);
  const end = Math.max(DEFAULT_RANGE_END, Math.ceil(latestEnd / 60) * 60);

  return { start, end };
}

/**
 * Hour marks (in minutes-from-midnight) between a start/end range,
 * inclusive of both ends — used to draw the grid's hour rows.
 */
export function getHourMarks(rangeStart, rangeEnd) {
  const marks = [];
  for (let m = rangeStart; m <= rangeEnd; m += 60) {
    marks.push(m);
  }
  return marks;
}

/**
 * Deterministically maps a subject name to one of the theme's schedule
 * block tint indexes, so the same subject always gets the same shade
 * across the whole grid.
 */
export function getTintIndexForSubject(subjectName, tintCount) {
  let hash = 0;
  for (let i = 0; i < subjectName.length; i++) {
    hash = (hash * 31 + subjectName.charCodeAt(i)) % 997;
  }
  return hash % tintCount;
}

/**
 * Returns a new array of schedule rows sorted chronologically by
 * start_time (ascending). Used to order today's classes and any other
 * per-day schedule list before display.
 */
export function sortByStartTime(schedules) {
  if (!schedules) return [];
  return [...schedules].sort((a, b) => a.start_time - b.start_time);
}

/**
 * Groups flat schedule rows (one row per day) into one entry per class
 * (group_id), collecting all the days a class occurs on into a single
 * `days` array. This is what powers the `classes` list returned by
 * useSchedule().
 *
 * NOTE: field names below (group_id, subject_name, start_time, end_time,
 * day) assume getAllSchedules() returns snake_case columns straight from
 * SQLite. If scheduleRepository.js maps them to camelCase before
 * returning, these need to change to match — see the repository file.
 */
export function groupSchedulesByGroupId(schedules) {
  if (!schedules || schedules.length === 0) return [];

  const groupsMap = new Map();

  for (const row of schedules) {
    const existing = groupsMap.get(row.group_id);
    if (existing) {
      existing.days.push(row.day);
    } else {
      groupsMap.set(row.group_id, {
        groupId: row.group_id,
        subjectName: row.subject_name,
        startTime: row.start_time,
        endTime: row.end_time,
        days: [row.day],
      });
    }
  }

  return Array.from(groupsMap.values());
}