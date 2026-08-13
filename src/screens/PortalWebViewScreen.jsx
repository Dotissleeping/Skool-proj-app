// src/screens/PortalWebViewScreen.jsx
//
// In-app WebView for a portal. Real WebView + cookies/error handling
// wired in Phase 8. Shell just confirms which portal was tapped.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import AppHeader from '../components/AppHeader';
import { getPortalById } from '../config/portals';

export default function PortalWebViewScreen({ navigation, route }) {
  const { theme } = useTheme();
  const portal = getPortalById(route?.params?.portalId);

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <AppHeader title={portal ? portal.name : 'Portal'} onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
          WebView for {portal ? portal.url : 'this portal'} will load here.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flex: 1, padding: 20 },
});