// src/screens/DownloadsScreen.jsx
//
// Lists downloaded files with Open/Share/Delete, backed by useDownloads.

import React from 'react';
import { View, FlatList, Alert, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useDownloads } from '../hooks/useDownloads';
import AppHeader from '../components/AppHeader';
import DownloadItem from '../components/DownloadItem';
import EmptyState from '../components/EmptyState';

export default function DownloadsScreen({ navigation }) {
  const { theme } = useTheme();
  const { downloads, refresh, open, share, remove } = useDownloads();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', refresh);
    return unsubscribe;
  }, [navigation, refresh]);

  async function handleOpen(item) {
    const result = await open(item);
    if (!result.ok) {
      Alert.alert('Unable to Open File', result.reason);
    }
  }

  async function handleShare(item) {
    const result = await share(item);
    if (!result.ok) {
      Alert.alert('Unable to Share File', result.reason);
    }
  }

  function handleDelete(item) {
    Alert.alert('Delete Download', `Delete ${item.filename}? This can't be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(item) },
    ]);
  }

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <AppHeader title="Downloads" onBack={() => navigation.goBack()} />
      {downloads.length === 0 ? (
        <EmptyState
          icon="document-text-outline"
          title="No downloads yet"
          description="Files you download from a portal will show up here."
        />
      ) : (
        <FlatList
          data={downloads}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <DownloadItem
              item={item}
              onOpen={() => handleOpen(item)}
              onShare={() => handleShare(item)}
              onDelete={() => handleDelete(item)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { padding: 20 },
});