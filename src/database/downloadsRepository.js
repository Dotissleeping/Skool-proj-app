// src/database/downloadsRepository.js
//
// SQLite access for the `downloads` table — metadata only (filename,
// path, mime type, size, date, source portal). The actual file bytes
// live in app file storage; see fileService/downloadService.

import { getDatabase } from './database';

function nowIso() {
  return new Date().toISOString();
}

/**
 * Returns every download record, most recent first.
 */
export function getAllDownloads() {
  const db = getDatabase();
  return db.getAllSync(`SELECT * FROM downloads ORDER BY download_date DESC;`);
}

/**
 * Inserts a new download record after a file has been saved to disk.
 */
export function addDownload({ filename, filePath, mimeType, fileSize, sourcePortal }) {
  const db = getDatabase();
  const result = db.runSync(
    `INSERT INTO downloads (filename, file_path, mime_type, file_size, download_date, source_portal)
     VALUES (?, ?, ?, ?, ?, ?);`,
    [filename, filePath, mimeType ?? null, fileSize ?? null, nowIso(), sourcePortal ?? null]
  );
  return result.lastInsertRowId;
}

/**
 * Deletes a single download record (its file should be removed
 * separately via fileService before calling this).
 */
export function deleteDownload(id) {
  const db = getDatabase();
  db.runSync(`DELETE FROM downloads WHERE id = ?;`, [id]);
}

/**
 * Deletes every download record. Used by Settings > Clear Downloads
 * (files themselves should already be deleted by the caller first).
 */
export function clearAllDownloadRecords() {
  const db = getDatabase();
  db.runSync(`DELETE FROM downloads;`);
}