// src/services/downloadService.js
//
// Detects/downloads files from a portal, saves them into an
// app-accessible folder, and records their metadata in SQLite. Portal
// download URLs aren't guaranteed to end in a recognizable extension
// (spec section 23), so filename/MIME type are best-effort guesses via
// fileUtils.

import * as FileSystem from 'expo-file-system';
import { deriveFilenameFromUrl, guessMimeType } from '../utils/fileUtils';
import { addDownload } from '../database/downloadsRepository';

const DOWNLOADS_DIR = `${FileSystem.documentDirectory}downloads/`;

async function ensureDownloadsDir() {
  const info = await FileSystem.getInfoAsync(DOWNLOADS_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(DOWNLOADS_DIR, { intermediates: true });
  }
}

/**
 * Downloads a file from `url` into the app's downloads folder, records
 * it in SQLite, and returns the new download record. `onProgress`
 * (optional) receives a 0–1 fraction for a simple progress indicator.
 *
 * Throws on failure — callers should catch and show a friendly error
 * (spec section 37), not crash.
 */
export async function downloadFile({ url, sourcePortal, onProgress }) {
  await ensureDownloadsDir();

  const filename = deriveFilenameFromUrl(url);
  const destinationUri = `${DOWNLOADS_DIR}${Date.now()}_${filename}`;

  const downloadResumable = FileSystem.createDownloadResumable(
    url,
    destinationUri,
    {},
    (progressEvent) => {
      if (onProgress && progressEvent.totalBytesExpectedToWrite > 0) {
        onProgress(progressEvent.totalBytesWritten / progressEvent.totalBytesExpectedToWrite);
      }
    }
  );

  let result;
  try {
    result = await downloadResumable.downloadAsync();
  } catch (error) {
    // Clean up any partial file so it doesn't linger (spec section 37:
    // "Clean up incomplete downloads.")
    await FileSystem.deleteAsync(destinationUri, { idempotent: true });
    throw error;
  }

  if (!result || !result.uri) {
    await FileSystem.deleteAsync(destinationUri, { idempotent: true });
    throw new Error('Download did not complete.');
  }

  const fileInfo = await FileSystem.getInfoAsync(result.uri);
  const mimeType = guessMimeType(filename);

  const id = addDownload({
    filename,
    filePath: result.uri,
    mimeType,
    fileSize: fileInfo.exists ? fileInfo.size : null,
    sourcePortal,
  });

  return {
    id,
    filename,
    filePath: result.uri,
    mimeType,
    fileSize: fileInfo.exists ? fileInfo.size : null,
    sourcePortal,
  };
}