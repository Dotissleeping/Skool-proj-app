// src/services/scheduleFileService.js
//
// Exports the current schedule as an actual file on disk (using the
// native Share sheet so it can be sent via WhatsApp, Drive, Bluetooth,
// Files, etc.), and imports one back in via the native file picker.
//
// Scoped to schedule data only (not a raw copy of the whole SQLite db)
// so a shared file never accidentally carries the sender's saved portal
// password or other personal settings — just their classes.

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

const FILE_TAG = 'skool-schedule';
const FILE_VERSION = 1;
const EXPORT_FILENAME = 'skool-schedule.json';

/**
 * Writes the current classes to a file and opens the native share sheet
 * so the user can send it to a classmate through any app that accepts
 * file attachments.
 */
export async function exportScheduleFile(classes) {
  if (!classes || classes.length === 0) {
    throw new Error("You haven't added any classes yet.");
  }

  const payload = {
    app: FILE_TAG,
    version: FILE_VERSION,
    exportedAt: new Date().toISOString(),
    classes: classes.map((c) => ({
      subjectName: c.subjectName,
      days: c.days,
      startTime: c.startTime,
      endTime: c.endTime,
    })),
  };

  const fileUri = `${FileSystem.cacheDirectory}${EXPORT_FILENAME}`;
  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(payload, null, 2), {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new Error('Sharing is not available on this device.');
  }

  await Sharing.shareAsync(fileUri, {
    mimeType: 'application/json',
    dialogTitle: 'Share Skool Schedule',
  });
}

/**
 * Opens the native file picker, reads the selected schedule file, and
 * returns the parsed classes ready to import. Returns null if the user
 * cancels the picker (not an error).
 */
export async function importScheduleFile() {
  const result = await DocumentPicker.getDocumentAsync({
    type: ['application/json', '*/*'],
    copyToCacheDirectory: true,
  });

  if (result.canceled) {
    return null;
  }

  const file = result.assets?.[0];
  if (!file?.uri) {
    throw new Error('Could not read the selected file.');
  }

  const text = await FileSystem.readAsStringAsync(file.uri, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  return parseScheduleFileContents(text);
}

function parseScheduleFileContents(text) {
  let data;
  try {
    data = JSON.parse((text || '').trim());
  } catch (e) {
    throw new Error("That doesn't look like a valid Skool schedule file.");
  }

  if (!data || data.app !== FILE_TAG || !Array.isArray(data.classes)) {
    throw new Error("That doesn't look like a valid Skool schedule file.");
  }

  const classes = data.classes.filter(
    (c) =>
      c &&
      typeof c.subjectName === 'string' &&
      c.subjectName.trim().length > 0 &&
      Array.isArray(c.days) &&
      c.days.length > 0 &&
      typeof c.startTime === 'number' &&
      typeof c.endTime === 'number' &&
      c.endTime > c.startTime
  );

  if (classes.length === 0) {
    throw new Error('No valid classes were found in that file.');
  }

  return classes;
}