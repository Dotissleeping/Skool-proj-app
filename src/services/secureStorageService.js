// src/services/secureStorageService.js
//
// Thin wrapper around expo-secure-store for portal login credentials.
// This is the ONLY place credentials touch disk, and they're encrypted
// by the OS keystore/keychain — never stored in SQLite, never logged.

import * as SecureStore from 'expo-secure-store';

const KEYS = {
  PORTAL_USERNAME: 'skool_portal_username',
  PORTAL_PASSWORD: 'skool_portal_password',
};

/**
 * Saves the user's portal username/password to secure storage.
 */
export async function savePortalCredentials({ username, password }) {
  await SecureStore.setItemAsync(KEYS.PORTAL_USERNAME, username ?? '');
  await SecureStore.setItemAsync(KEYS.PORTAL_PASSWORD, password ?? '');
}

/**
 * Returns { username, password } if credentials are saved, otherwise null.
 */
export async function getPortalCredentials() {
  const username = await SecureStore.getItemAsync(KEYS.PORTAL_USERNAME);
  const password = await SecureStore.getItemAsync(KEYS.PORTAL_PASSWORD);
  if (!username && !password) return null;
  return { username: username ?? '', password: password ?? '' };
}

/**
 * Removes any saved portal credentials.
 */
export async function clearPortalCredentials() {
  await SecureStore.deleteItemAsync(KEYS.PORTAL_USERNAME);
  await SecureStore.deleteItemAsync(KEYS.PORTAL_PASSWORD);
}