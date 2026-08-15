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
  // v2: downloads metadata table (spec section 25). The actual PDF/DOCX
  // bytes live in app file storage, NOT here — this is metadata only.
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