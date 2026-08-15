// src/screens/SettingsScreen.jsx
//
// Appearance (theme), Student Information, Portal Login, Schedule/Downloads
// clearing, and About — per spec section 26.

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useSchedule } from '../hooks/useSchedule';
import { useDownloads } from '../hooks/useDownloads';
import { usePortalAuth } from '../hooks/usePortalAuth';
import { getStudentName, setStudentName as persistStudentName } from '../database/settingsRepository';
import { THEME_MODES } from '../theme/theme';
import AppHeader from '../components/AppHeader';

const THEME_OPTIONS = [
  { mode: THEME_MODES.LIGHT, label: 'Light' },
  { mode: THEME_MODES.DARK, label: 'Dark' },
  { mode: THEME_MODES.SYSTEM, label: 'System Default' },
];

function SectionLabel({ children, theme }) {
  return (
    <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginTop: 26, marginBottom: 10 }]}>
      {children}
    </Text>
  );
}

export default function SettingsScreen({ navigation }) {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { clearAll: clearAllSchedule } = useSchedule();
  const { clearAll: clearAllDownloads } = useDownloads();
  const {
    saveLoginEnabled,
    credentials,
    toggleSaveLogin,
    saveCredentials,
    clearCredentials,
  } = usePortalAuth();

  const [studentName, setStudentNameState] = useState('');
  const [portalUsername, setPortalUsername] = useState('');
  const [portalPassword, setPortalPassword] = useState('');

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setStudentNameState(getStudentName());
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    if (credentials?.username) {
      setPortalUsername(credentials.username);
    }
  }, [credentials]);

  function handleStudentNameBlur() {
    persistStudentName(studentName.trim());
  }

  function handleSaveCredentials() {
    if (!portalUsername.trim() || !portalPassword) {
      Alert.alert('Missing Info', 'Enter both a username and password to save.');
      return;
    }
    saveCredentials(portalUsername.trim(), portalPassword);
    setPortalPassword('');
    Alert.alert('Saved', 'Portal login saved securely.');
  }

  function handleClearCredentials() {
    Alert.alert('Clear Saved Login', "This removes your saved portal username and password.", [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          clearCredentials();
          setPortalUsername('');
          setPortalPassword('');
        },
      },
    ]);
  }

  function handleClearSchedule() {
    Alert.alert('Clear All Schedule', "This deletes every class you've added. This can't be undone.", [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearAllSchedule },
    ]);
  }

  function handleClearDownloads() {
    Alert.alert('Clear Downloads', "This deletes every downloaded file. This can't be undone.", [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearAllDownloads },
    ]);
  }

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <AppHeader title="Settings" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Appearance */}
        <SectionLabel theme={theme}>Appearance</SectionLabel>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          {THEME_OPTIONS.map((option) => {
            const active = themeMode === option.mode;
            return (
              <TouchableOpacity
                key={option.mode}
                style={styles.optionRow}
                onPress={() => setThemeMode(option.mode)}
              >
                <Text style={[theme.typography.body, { color: theme.colors.textPrimary }]}>{option.label}</Text>
                <Ionicons
                  name={active ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={active ? theme.colors.accent : theme.colors.textMuted}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Student Information */}
        <SectionLabel theme={theme}>Student Information</SectionLabel>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: 6 }]}>
            Student Name
          </Text>
          <TextInput
            value={studentName}
            onChangeText={setStudentNameState}
            onEndEditing={handleStudentNameBlur}
            placeholder="Enter your name"
            placeholderTextColor={theme.colors.textMuted}
            style={[styles.input, { color: theme.colors.textPrimary, borderColor: theme.colors.border }]}
          />
        </View>

        {/* Portal Login */}
        <SectionLabel theme={theme}>Portal Login</SectionLabel>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.optionRow}>
            <Text style={[theme.typography.body, { color: theme.colors.textPrimary }]}>Save Portal Login</Text>
            <Switch
              value={saveLoginEnabled}
              onValueChange={toggleSaveLogin}
              trackColor={{ false: theme.colors.border, true: theme.colors.accentSoft }}
              thumbColor={saveLoginEnabled ? theme.colors.accent : undefined}
            />
          </View>

          {saveLoginEnabled ? (
            <View style={{ marginTop: 12 }}>
              <TextInput
                value={portalUsername}
                onChangeText={setPortalUsername}
                placeholder="Portal username"
                placeholderTextColor={theme.colors.textMuted}
                autoCapitalize="none"
                style={[styles.input, { color: theme.colors.textPrimary, borderColor: theme.colors.border, marginBottom: 10 }]}
              />
              <TextInput
                value={portalPassword}
                onChangeText={setPortalPassword}
                placeholder={credentials ? '•••••••• (enter to change)' : 'Portal password'}
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry
                style={[styles.input, { color: theme.colors.textPrimary, borderColor: theme.colors.border }]}
              />
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginTop: 8 }]}>
                {credentials ? 'A login is saved securely on this device.' : 'No login saved yet.'}
              </Text>

              <TouchableOpacity
                style={[styles.smallButton, { backgroundColor: theme.colors.accent, marginTop: 12 }]}
                onPress={handleSaveCredentials}
              >
                <Text style={styles.smallButtonText}>SAVE LOGIN</Text>
              </TouchableOpacity>

              {credentials ? (
                <TouchableOpacity style={styles.clearRow} onPress={handleClearCredentials}>
                  <Text style={[theme.typography.caption, { color: theme.colors.danger, fontWeight: '700' }]}>
                    CLEAR SAVED LOGIN
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
        </View>

        {/* Schedule */}
        <SectionLabel theme={theme}>Schedule</SectionLabel>
        <TouchableOpacity
          style={[styles.card, styles.dangerRow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          onPress={handleClearSchedule}
        >
          <Text style={[theme.typography.body, { color: theme.colors.danger }]}>Clear All Schedule</Text>
        </TouchableOpacity>

        {/* Downloads */}
        <SectionLabel theme={theme}>Downloads</SectionLabel>
        <TouchableOpacity
          style={[styles.card, styles.dangerRow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          onPress={handleClearDownloads}
        >
          <Text style={[theme.typography.body, { color: theme.colors.danger }]}>Clear Downloads</Text>
        </TouchableOpacity>

        {/* About */}
        <SectionLabel theme={theme}>About</SectionLabel>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[theme.typography.subtitle, { color: theme.colors.textPrimary }]}>Skool</Text>
          <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary, marginTop: 4 }]}>
            Version 1.0.0
          </Text>
          <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary, marginTop: 10 }]}>
            A lightweight personal school companion app.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  smallButton: {
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  smallButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.4,
  },
  clearRow: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 6,
  },
  dangerRow: {
    alignItems: 'center',
  },
});