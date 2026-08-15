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
  // v2: downloads metadata table
  `
    CREATE TABLE IF NOT EXISTS downloads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      file_path TEXT NOT NULL,
      mime_type TEXT,
      file_size INTEGER,
      download_date TEXT NOT NULL,
      source_portal TEXT
    );
  `,
];

export function initDatabase() {
  const db = getDatabase();

  // Create migrations tracker table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version INTEGER NOT NULL UNIQUE,
      applied_at TEXT NOT NULL
    );
  `);

  // Get current version
  const lastMigration = db.getFirstSync(
    `SELECT MAX(version) as version FROM _migrations;`
  );
  const currentVersion = lastMigration?.version ?? -1;

  // Apply any pending migrations
  db.withTransactionSync(() => {
    MIGRATIONS.forEach((sql, index) => {
      if (index > currentVersion) {
        db.execSync(sql);
        db.runSync(
          `INSERT INTO _migrations (version, applied_at) VALUES (?, ?);`,
          [index, new Date().toISOString()]
        );
      }
    });
  });
}