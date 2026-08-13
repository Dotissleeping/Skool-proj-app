// src/utils/timeUtils.js
//
// Pure time helpers. Internal time representation is minutes-from-midnight
// (e.g. 08:00 AM = 480), per spec section 35 — this keeps schedule
// comparisons/sorting/overlap checks reliable everywhere in the app.

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * Converts minutes-from-midnight into { hour12, minute, period }.
 * e.g. 480 -> { hour12: 8, minute: 0, period: 'AM' }
 */
export function minutesToParts(totalMinutes) {
  const clamped = ((totalMinutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(clamped / 60);
  const minute = clamped % 60;
  const period = hour24 < 12 ? 'AM' : 'PM';
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return { hour12, minute, period };
}

/**
 * Converts { hour12, minute, period } back into minutes-from-midnight.
 */
export function partsToMinutes({ hour12, minute, period }) {
  let hour24 = hour12 % 12;
  if (period === 'PM') hour24 += 12;
  return hour24 * 60 + minute;
}

/**
 * Formats minutes-from-midnight as a display string, e.g. "08:00 AM".
 */
export function minutesToLabel(totalMinutes) {
  const { hour12, minute, period } = minutesToParts(totalMinutes);
  const hh = String(hour12).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  return `${hh}:${mm} ${period}`;
}

/**
 * Formats a start/end minute pair as "08:00 AM – 10:00 AM".
 */
export function formatTimeRange(startMinutes, endMinutes) {
  return `${minutesToLabel(startMinutes)} – ${minutesToLabel(endMinutes)}`;
}