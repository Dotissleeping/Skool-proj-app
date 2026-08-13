// src/screens/DownloadsScreen.jsx
//
// Downloads shell. Real download list + open/share/delete wired in
// Phase 10. Shows the EmptyState for now since there's no data yet.

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import AppHeader from '../components/AppHeader';
import EmptyState from '../components/EmptyState';

export default function DownloadsScreen({ navigation }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <AppHeader title="Downloads" onBack={() => navigation.goBack()} />
      <EmptyState
        icon="document-text-outline"
        title="No downloads yet"
        description="Files you download from a portal will show up here."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});