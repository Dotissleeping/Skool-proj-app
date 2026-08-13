// src/navigation/AppNavigation.jsx
//
// Root navigation: bottom tabs (Home, Schedule, Portals, Settings).
// Schedule is its own stack (Schedule -> Add -> Edit).
// Portals is its own stack, defined in PortalNavigation.jsx
// (Portals -> PortalWebView -> Downloads).

import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../hooks/useTheme';
import { getTabIconName } from '../components/BottomNavigation';

import HomeScreen from '../screens/HomeScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import AddScheduleScreen from '../screens/AddScheduleScreen';
import EditScheduleScreen from '../screens/EditScheduleScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PortalNavigation from './PortalNavigation';

const Tab = createBottomTabNavigator();
const ScheduleStack = createNativeStackNavigator();

function ScheduleStackNavigator() {
  return (
    <ScheduleStack.Navigator screenOptions={{ headerShown: false }}>
      <ScheduleStack.Screen name="ScheduleMain" component={ScheduleScreen} />
      <ScheduleStack.Screen name="AddSchedule" component={AddScheduleScreen} />
      <ScheduleStack.Screen name="EditSchedule" component={EditScheduleScreen} />
    </ScheduleStack.Navigator>
  );
}

function TabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.tabActive,
        tabBarInactiveTintColor: theme.colors.tabInactive,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: theme.layout.bottomTabHeight,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name={getTabIconName(route.name, focused)} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Schedule" component={ScheduleStackNavigator} />
      <Tab.Screen name="Portals" component={PortalNavigation} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  const { theme } = useTheme();
  const navTheme = buildNavTheme(theme);

  return (
    <NavigationContainer theme={navTheme}>
      <TabNavigator />
    </NavigationContainer>
  );
}

function buildNavTheme(theme) {
  const base = theme.isDark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.textPrimary,
      border: theme.colors.border,
      primary: theme.colors.accent,
    },
  };
}