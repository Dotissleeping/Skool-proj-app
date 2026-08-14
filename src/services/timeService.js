// src/services/timeService.js
//
// Reads the device's actual local date/time/timezone — never hardcoded,
// never requires internet. JS's `Date` already reflects the phone's
// current timezone setting, so plain Date methods are all we need; this
// file just gives the rest of the app a consistent, testable interface
// (and the school-day weekday naming used by DAYS_OF_WEEK).

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * Current local Date. Accepts an override for testing; defaults to now.
 */
export function getNow() {
  return new Date();
}

/**
 * Current time as minutes-from-midnight, in the device's local time.
 */
export function getCurrentMinutes(date = getNow()) {
  return date.getHours() * 60 + date.getMinutes();
}

/**
 * Current weekday name (e.g. "Wednesday"), in the device's local
 * timezone. Note this can be "Sunday", which the schedule system treats
 * as a day with no classes since DAYS_OF_WEEK only covers Mon–Sat.
 */
export function getCurrentWeekday(date = getNow()) {
  return WEEKDAY_NAMES[date.getDay()];
}

/**
 * Current local date formatted as e.g. "August 14, 2026".
 */
export function getCurrentDateLabel(date = getNow()) {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}