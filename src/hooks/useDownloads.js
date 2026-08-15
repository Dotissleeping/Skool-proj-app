// src/hooks/useDownloads.js
//
// Exposes the downloads list + open/share/delete actions to screens,
// backed by downloadsRepository (metadata) and fileService (actual
// file I/O). Screens should use this instead of touching the repository
// or FileSystem directly.

import { useCallback, useEffect, useState } from 'react';
import {
  getAllDownloads,
  deleteDownload,
  clearAllDownloadRecords,
} from '../database/downloadsRepository';
import { openFile, shareFile, deleteFileFromDisk } from '../services/fileService';
import { downloadFile } from '../services/downloadService';

export function useDownloads() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    try {
      setDownloads(getAllDownloads());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /**
   * Downloads a file from a portal URL and adds it to the list.
   */
  async function addFromUrl(url, sourcePortal, onProgress) {
    const record = await downloadFile({ url, sourcePortal, onProgress });
    refresh();
    return record;
  }

  async function open(item) {
    return openFile(item.file_path, item.mime_type);
  }

  async function share(item) {
    return shareFile(item.file_path, item.mime_type);
  }

  async function remove(item) {
    await deleteFileFromDisk(item.file_path);
    deleteDownload(item.id);
    refresh();
  }

  async function clearAll() {
    for (const item of downloads) {
      await deleteFileFromDisk(item.file_path);
    }
    clearAllDownloadRecords();
    refresh();
  }

  return { downloads, loading, refresh, addFromUrl, open, share, remove, clearAll };
}