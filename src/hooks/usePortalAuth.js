// src/hooks/usePortalAuth.js
//
// Exposes "Save Portal Login" state + saved credentials to the Settings
// screen (built in Phase 11). Combines the SQLite-backed toggle
// (settingsRepository) with the SecureStore-backed credentials
// (secureStorageService) so the screen only needs one hook.
//
// Turning the toggle OFF clears any saved credentials immediately —
// the user must explicitly re-enable and re-save to store them again
// (spec section 22).

import { useCallback, useEffect, useState } from 'react';
import { getSaveLoginEnabled, setSaveLoginEnabled } from '../database/settingsRepository';
import {
  savePortalCredentials,
  getPortalCredentials,
  clearPortalCredentials,
} from '../services/secureStorageService';

export function usePortalAuth() {
  const [saveLoginEnabled, setSaveLoginEnabledState] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const enabled = getSaveLoginEnabled();
    setSaveLoginEnabledState(enabled);

    if (enabled) {
      const saved = await getPortalCredentials();
      setCredentials(saved);
    } else {
      setCredentials(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /**
   * Turns "Save Portal Login" on/off. Turning it off wipes any saved
   * credentials right away.
   */
  async function toggleSaveLogin(enabled) {
    setSaveLoginEnabled(enabled);
    setSaveLoginEnabledState(enabled);

    if (!enabled) {
      await clearPortalCredentials();
      setCredentials(null);
    }
  }

  /**
   * Saves credentials. Only meaningful while saveLoginEnabled is true —
   * the Settings screen should keep the fields disabled otherwise.
   */
  async function saveCredentials(username, password) {
    await savePortalCredentials({ username, password });
    setCredentials({ username, password });
  }

  /**
   * Clears saved credentials without touching the toggle itself
   * (spec's "Clear Saved Login" action).
   */
  async function clearCredentials() {
    await clearPortalCredentials();
    setCredentials(null);
  }

  return {
    saveLoginEnabled,
    credentials,
    loading,
    toggleSaveLogin,
    saveCredentials,
    clearCredentials,
    refresh,
  };
}