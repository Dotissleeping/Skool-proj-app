// src/screens/PortalsScreen.jsx
//
// Lists the two fixed school portals + a link to Downloads.
// WebView wiring happens in Phase 8; this just lays out the cards/nav.

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import AppHeader from '../components/AppHeader';
import { PORTALS } from '../config/portals';

export default function PortalsScreen({ navigation }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <AppHeader title="Portals" />
      <ScrollView contentContainerStyle={styles.content}>
        {PORTALS.map((portal) => (
          <View
            key={portal.id}
            style={[
              styles.card,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
            ]}
          >
            <Text style={[theme.typography.subtitle, { color: theme.colors.textPrimary }]}>
              {portal.name}
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.accent }]}
              onPress={() => navigation.navigate('PortalWebView', { portalId: portal.id })}
            >
              <Text style={styles.buttonText}>OPEN PORTAL</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.downloadsRow}
          onPress={() => navigation.navigate('Downloads')}
        >
          <Ionicons name="download-outline" size={20} color={theme.colors.accent} />
          <Text style={[theme.typography.subtitle, { color: theme.colors.accentText, marginLeft: 8 }]}>
            Downloads
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20 },
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 14,
  },
  button: {
    marginTop: 12,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.3,
  },
  downloadsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 10,
  },
});