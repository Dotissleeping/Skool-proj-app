// src/components/DownloadItem.jsx
//
// One row on the Downloads screen: filename, type/date, Open/Share/Delete.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { getExtension } from '../utils/fileUtils';

function formatDate(isoString) {
  try {
    return new Date(isoString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (e) {
    return '';
  }
}

export default function DownloadItem({ item, onOpen, onShare, onDelete }) {
  const { theme } = useTheme();
  const ext = (getExtension(item.filename) || 'file').toUpperCase();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.headerRow}>
        <Ionicons name="document-text-outline" size={18} color={theme.colors.accent} style={{ marginRight: 8 }} />
        <Text
          numberOfLines={1}
          style={[theme.typography.subtitle, { color: theme.colors.textPrimary, flex: 1 }]}
        >
          {item.filename}
        </Text>
      </View>
      <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginTop: 4, marginLeft: 26 }]}>
        {ext} • {formatDate(item.download_date)}
      </Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton} onPress={onOpen}>
          <Text style={[theme.typography.caption, { color: theme.colors.accentText, fontWeight: '700' }]}>
            OPEN
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
          <Text style={[theme.typography.caption, { color: theme.colors.accentText, fontWeight: '700' }]}>
            SHARE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
          <Text style={[theme.typography.caption, { color: theme.colors.danger, fontWeight: '700' }]}>
            DELETE
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 20,
  },
  actionButton: {
    paddingVertical: 4,
  },
});