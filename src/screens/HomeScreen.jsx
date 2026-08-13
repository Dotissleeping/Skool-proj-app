// src/screens/HomeScreen.jsx
//
// Dashboard shell. Real data (today's classes, current/next class,
// subject count) wired in Phase 7.

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import AppHeader from '../components/AppHeader';

export default function HomeScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <AppHeader title="Home" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[theme.typography.h2, { color: theme.colors.textPrimary }]}>
          Welcome, Student
        </Text>
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: 8 }]}>
          Today's classes, current/next class, and quick actions will appear here.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20 },
});