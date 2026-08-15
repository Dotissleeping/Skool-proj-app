// src/utils/fileUtils.js
//
// Pure helpers: guessing a filename + MIME type from a download URL.
// Portal download URLs aren't guaranteed to end in .pdf/.docx (spec
// section 23), so this is a best-effort heuristic, not a guarantee.

const MIME_TYPES = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  txt: 'text/plain',
};

const DEFAULT_EXTENSION = 'pdf'; // most common school-document type; used only when the URL gives no clue at all
const DEFAULT_MIME_TYPE = 'application/octet-stream';

/**
 * Strips unsafe/awkward characters from a filename so it's safe to use
 * as a file system path segment.
 */
export function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._\- ]/g, '_').trim() || `download_${Date.now()}`;
}

/**
 * Returns the lowercase file extension (without the dot), or null if
 * none can be determined.
 */
export function getExtension(filename) {
  const match = /\.([a-zA-Z0-9]+)$/.exec(filename);
  return match ? match[1].toLowerCase() : null;
}

/**
 * Maps a file extension to a MIME type, falling back to a generic
 * binary type for anything unrecognized.
 */
export function guessMimeType(filename) {
  const ext = getExtension(filename);
  return (ext && MIME_TYPES[ext]) || DEFAULT_MIME_TYPE;
}

/**
 * Derives a safe local filename from a download URL. If the URL's path
 * has no usable filename/extension (common with dynamically-generated
 * portal download links), falls back to a timestamped name with a
 * reasonable default extension.
 */
export function deriveFilenameFromUrl(url) {
  try {
    const { pathname } = new URL(url);
    const lastSegment = decodeURIComponent(pathname.split('/').filter(Boolean).pop() || '');
    if (lastSegment && getExtension(lastSegment)) {
      return sanitizeFilename(lastSegment);
    }
  } catch (e) {
    // fall through to the default below
  }
  return `download_${Date.now()}.${DEFAULT_EXTENSION}`;
}