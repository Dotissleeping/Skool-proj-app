// src/database/migrations.js
//
// Creates/upgrades the SQLite schema on startup. Uses PRAGMA user_version
// as a simple migration counter — each migration bumps it by 1, and only
// migrations above the current version run, so this is safe to call every
// app launch.

import { getDatabase } from './database';

const MIGRATIONS = [
  // v1: schedules + settings tables
  `
    CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id TEXT NOT NULL,
      subject_name TEXT NOT NULL,
      day TEXT NOT NULL,
      start_time INTEGER NOT NULL,
      end_time INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_schedules_day ON schedules(day);
    CREATE INDEX IF NOT EXISTS idx_schedules_group_id ON schedules(group_id);

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT
    );
  `,
];

/**
 * Runs any migrations newer than the database's current user_version.
 * Safe to call on every app startup.
 */
export function runMigrations() {
  const db = getDatabase();

  const row = db.getFirstSync('PRAGMA user_version;');
  const currentVersion = row ? row.user_version : 0;

  for (let version = currentVersion; version < MIGRATIONS.length; version++) {
    const sql = MIGRATIONS[version];
    db.execSync(sql);
    db.execSync(`PRAGMA user_version = ${version + 1};`);
  }
}

/**
 * Full startup init: open the DB connection and bring the schema up to date.
 * Call this once, before reading/writing any schedule or settings data.
 */
export function initDatabase() {
  getDatabase();
  runMigrations();
}