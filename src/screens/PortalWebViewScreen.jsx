// src/screens/PortalWebViewScreen.jsx
//
// In-app WebView for a fixed school portal. Supports cookies/login
// sessions, back navigation (including Android hardware back), refresh,
// a loading indicator, an error state with retry, and file-download
// detection that saves into the app's Downloads (spec sections 21-23).
// Navigation outside the portal's allowedDomains is blocked.

import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import AppHeader from '../components/AppHeader';
import LoadingView from '../components/LoadingView';
import { getPortalById } from '../config/portals';
import { isUrlAllowed } from '../services/portalService';
import { downloadFile } from '../services/downloadService';

export default function PortalWebViewScreen({ navigation, route }) {
  const { theme } = useTheme();
  const portal = getPortalById(route?.params?.portalId);
  const webViewRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [downloading, setDownloading] = useState(false);

  async function handleFileDownload(downloadUrl) {
    setDownloading(true);
    try {
      const record = await downloadFile({ url: downloadUrl, sourcePortal: portal.name });
      Alert.alert('Download Complete', `${record.filename} was saved to Downloads.`, [
        { text: 'OK', style: 'cancel' },
        { text: 'View Downloads', onPress: () => navigation.navigate('Downloads') },
      ]);
    } catch (error) {
      Alert.alert('Download Failed', 'Please try again.');
    } finally {
      setDownloading(false);
    }
  }

  const handleBack = useCallback(() => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    navigation.goBack();
    return true;
  }, [canGoBack, navigation]);

  // Android hardware back button: navigate the WebView back first.
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', handleBack);
      return () => sub.remove();
    }, [handleBack])
  );

  function handleRetry() {
    setHasError(false);
    setLoading(true);
    setReloadKey((k) => k + 1);
  }

  function handleRefresh() {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  }

  function handleShouldStartLoad(request) {
    if (!portal) return true;
    return isUrlAllowed(request.url, portal.allowedDomains);
  }

  // onError/onHttpError fire for ANY resource on the page — not just the
  // main document. A single broken image, font, or analytics pixel from
  // a third-party CDN would otherwise trip the full "Unable to load
  // portal" error screen even though the portal page itself loaded fine.
  // Only treat it as a real failure if the failing request is actually
  // on the portal's own domain.
  function handleLoadFailure(failingUrl) {
    if (!portal) {
      setLoading(false);
      setHasError(true);
      return;
    }
    if (isUrlAllowed(failingUrl, portal.allowedDomains)) {
      setLoading(false);
      setHasError(true);
    }
    // else: sub-resource from an unrelated domain — ignore, let the page
    // keep loading.
  }

  if (!portal) {
    return (
      <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
        <AppHeader title="Portal" onBack={() => navigation.goBack()} />
        <View style={styles.center}>
          <Text style={{ color: theme.colors.textSecondary }}>This portal is not configured.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <AppHeader
        title={portal.name}
        onBack={handleBack}
        rightAction={
          <TouchableOpacity onPress={handleRefresh} hitSlop={12}>
            <Ionicons name="refresh" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        }
      />

      {hasError ? (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={40} color={theme.colors.textMuted} />
          <Text style={[theme.typography.subtitle, { color: theme.colors.textPrimary, marginTop: 14 }]}>
            Unable to load portal.
          </Text>
          <Text
            style={[
              theme.typography.bodySmall,
              { color: theme.colors.textSecondary, marginTop: 6, textAlign: 'center' },
            ]}
          >
            Please check your internet connection.
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.colors.accent }]}
            onPress={handleRetry}
          >
            <Text style={styles.retryButtonText}>TRY AGAIN</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.flex}>
          <WebView
            key={reloadKey}
            ref={webViewRef}
            source={{ uri: portal.url }}
            style={styles.flex}
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState={false}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={({ nativeEvent }) => handleLoadFailure(nativeEvent.url)}
            onHttpError={({ nativeEvent }) => handleLoadFailure(nativeEvent.url)}
            onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            onFileDownload={({ nativeEvent }) => handleFileDownload(nativeEvent.downloadUrl)}
          />
          {loading ? (
            <View style={[styles.loadingOverlay, { backgroundColor: theme.colors.background }]}>
              <LoadingView label={`Loading ${portal.name}...`} />
            </View>
          ) : null}
          {downloading ? (
            <View style={[styles.downloadBanner, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[theme.typography.bodySmall, { color: theme.colors.textPrimary }]}>
                Downloading file...
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButton: {
    marginTop: 18,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.4,
  },
  downloadBanner: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
});