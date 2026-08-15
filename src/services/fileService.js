// src/services/fileService.js
//
// Open/share/delete helpers around expo-file-system and expo-sharing.
// "Open" and "Share" both go through the OS share sheet (Sharing.shareAsync)
// — on both platforms this lets the person pick a compatible app to view
// the file in, which is the lightest-weight way to support arbitrary
// document types without extra native dependencies.

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

/**
 * Opens a downloaded file using the OS's "open with" / share sheet.
 * Returns { ok: true } or { ok: false, reason } — never throws, so
 * callers can show a friendly message instead of crashing (spec
 * section 25: "show a friendly error instead of crashing").
 */
export async function openFile(fileUri, mimeType) {
  try {
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      return { ok: false, reason: 'Sharing is not available on this device.' };
    }
    await Sharing.shareAsync(fileUri, {
      mimeType,
      dialogTitle: 'Open with',
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: 'No compatible app was found to open this file.' };
  }
}

/**
 * Shares a downloaded file (spec section 24/38 — only ever shared when
 * the user explicitly chooses to).
 */
export async function shareFile(fileUri, mimeType) {
  try {
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      return { ok: false, reason: 'Sharing is not available on this device.' };
    }
    await Sharing.shareAsync(fileUri, {
      mimeType,
      dialogTitle: 'Share file',
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: 'This file could not be shared.' };
  }
}

/**
 * Deletes a file from device storage. Safe to call even if the file was
 * already removed (idempotent).
 */
export async function deleteFileFromDisk(fileUri) {
  try {
    await FileSystem.deleteAsync(fileUri, { idempotent: true });
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: 'Could not delete this file.' };
  }
}