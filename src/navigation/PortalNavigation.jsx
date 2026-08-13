// src/navigation/PortalNavigation.jsx
//
// Stack for the Portals tab: Portals list -> Portal WebView -> Downloads.
// Downloads is reached from the Portals screen, not from the bottom nav
// (per spec section 24).

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PortalsScreen from '../screens/PortalsScreen';
import PortalWebViewScreen from '../screens/PortalWebViewScreen';
import DownloadsScreen from '../screens/DownloadsScreen';

const Stack = createNativeStackNavigator();

export default function PortalNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PortalsMain" component={PortalsScreen} />
      <Stack.Screen name="PortalWebView" component={PortalWebViewScreen} />
      <Stack.Screen name="Downloads" component={DownloadsScreen} />
    </Stack.Navigator>
  );
}