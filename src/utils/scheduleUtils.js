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