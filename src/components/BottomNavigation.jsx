// src/components/BottomNavigation.jsx
//
// Maps each bottom-tab route name to an Ionicons name (filled when
// focused, outline when not). Kept as a small pure function rather than
// a custom tab bar component — @react-navigation/bottom-tabs already
// renders a lightweight bar, we just theme it (see AppNavigation.jsx)
// and supply icons from here.

export function getTabIconName(routeName, focused) {
  switch (routeName) {
    case 'Home':
      return focused ? 'home' : 'home-outline';
    case 'Schedule':
      return focused ? 'calendar' : 'calendar-outline';
    case 'Portals':
      return focused ? 'globe' : 'globe-outline';
    case 'Settings':
      return focused ? 'settings' : 'settings-outline';
    default:
      return 'ellipse-outline';
  }
}