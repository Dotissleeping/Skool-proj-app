// src/database/database.js
//
// Opens (and caches) the single SQLite connection used by the whole app.
// Screens/services should never import expo-sqlite directly — always go
// through this file or a repository, so the connection stays centralized.

import * as SQLite from 'expo-sqlite';

const DB_NAME = 'skool.db';

let dbInstance = null;

/**
 * Returns the shared SQLite database instance, opening it on first call.
 */
export function getDatabase() {
  if (!dbInstance) {
    dbInstance = SQLite.openDatabaseSync(DB_NAME);
  }
  return dbInstance;
}