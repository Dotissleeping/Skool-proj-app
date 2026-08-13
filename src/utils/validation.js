// src/utils/validation.js
//
// Validation for the Add/Edit Schedule form (spec section 9).

/**
 * Validates a schedule form. Returns { valid, errors } where errors is a
 * map of field -> message (only for invalid fields).
 */
export function validateScheduleForm({ subjectName, days, startTime, endTime }) {
  const errors = {};

  if (!subjectName || !subjectName.trim()) {
    errors.subjectName = 'Subject name cannot be empty.';
  }

  if (!days || days.length === 0) {
    errors.days = 'Select at least one day.';
  }

  if (typeof startTime !== 'number' || typeof endTime !== 'number') {
    errors.time = 'Start and end time are required.';
  } else if (startTime >= endTime) {
    errors.time = 'Start time must be before end time.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}