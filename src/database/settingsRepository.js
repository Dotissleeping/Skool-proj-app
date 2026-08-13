// src/database/settingsRepository.js
//
// Simple key-value storage for student info + app preferences
// (student name, theme mode, "save portal login" toggle). Passwords are
// NEVER stored here — those go through secureStorageService
// (expo-secure-store) instead.

import { getDatabase } from './database';

const KEYS = {
  STUDENT_NAME: 'student_name',
  THEME_MODE: 'theme_mode', // 'light' | 'dark' | 'system'
  SAVE_LOGIN_ENABLED: 'save_login_enabled', // 'true' | 'false'
};

function getRaw(key) {
  const db = getDatabase();
  const row = db.getFirstSync(`SELECT value FROM settings WHERE key = ?;`, [key]);
  return row ? row.value : null;
}

function setRaw(key, value) {
  const db = getDatabase();
  db.runSync(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value;`,
    [key, value]
  );
}

export function getStudentName() {
  return getRaw(KEYS.STUDENT_NAME) || '';
}

export function setStudentName(name) {
  setRaw(KEYS.STUDENT_NAME, name);
}

export function getThemeMode() {
  return getRaw(KEYS.THEME_MODE) || 'system';
}

export function setThemeMode(mode) {
  setRaw(KEYS.THEME_MODE, mode);
}

export function getSaveLoginEnabled() {
  return getRaw(KEYS.SAVE_LOGIN_ENABLED) === 'true';
}

export function setSaveLoginEnabled(enabled) {
  setRaw(KEYS.SAVE_LOGIN_ENABLED, enabled ? 'true' : 'false');
}

export const SETTINGS_KEYS = KEYS;