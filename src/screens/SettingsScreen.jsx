// src/screens/SettingsScreen.jsx
//
// Settings shell. Real theme switcher, student name, login settings,
// clear-data actions wired in Phase 11.

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import AppHeader from '../components/AppHeader';

export default function SettingsScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <AppHeader title="Settings" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
          Theme, student name, saved login, and clear-data options go here.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20 },
});