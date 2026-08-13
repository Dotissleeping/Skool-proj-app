# Skool

A lightweight, student-focused personal school companion app — dashboard,
personal class schedule, two fixed school web portals, downloaded school
documents, and settings, all in one simple app.

Built with React Native + Expo.

## Status: Phase 2 — Main UI ✅

- [x] Expo project scaffolded (SDK ~52)
- [x] Dependencies declared (SQLite, navigation, reanimated, gesture-handler,
      svg, webview, secure-store, file-system, sharing, vector-icons)
- [x] Full modular folder structure created (see below)
- [x] Centralized theme system (light/dark, muted school-red accent)
- [x] Root `App.jsx` wired with ThemeProvider + SafeAreaProvider + navigation
- [x] Bottom tab navigation (Home, Schedule, Portals, Settings) with icons
- [x] Schedule stack (Schedule -> Add -> Edit) and Portal stack
      (Portals -> WebView -> Downloads)
- [x] All 8 screen shells in place and reachable via navigation

Not yet built (coming in later phases): SQLite schema, schedule CRUD,
timetable grid, local time engine, portal WebViews, secure login,
downloads, settings actions.

## Getting started

```bash
npm install
npx expo start
```

Requires the Expo Go app (or a dev build) on your device, or an
Android/iOS simulator.

## Folder structure

Skool/
├── assets/
│ ├── images/ # skool-logo.png goes here (placeholder for now)
│ ├── icons/
│ └── fonts/
├── src/
│ ├── components/ # Reusable UI pieces
│ ├── screens/ # One file per screen
│ ├── navigation/ # Bottom tabs + stacks
│ ├── database/ # SQLite connection, migrations, repositories
│ ├── services/ # Business logic (time, schedule, portals, downloads...)
│ ├── hooks/ # React hooks wrapping services/repositories
│ ├── theme/ # colors, typography, spacing, combined theme
│ ├── utils/ # Pure helper functions
│ └── config/ # Fixed portal configuration
├── App.jsx
├── app.json
└── package.json


## Design principles

- Lightweight and fast — minimal dependencies, no unnecessary libraries.
- Offline-first schedule — only portals/downloads need internet.
- Uses the phone's actual local time/timezone — nothing hardcoded.
- Timetable blocks are always positioned automatically from
  `day` / `start_time` / `end_time` — never hardcoded.
- Credentials (if the user opts in to saved login) are stored with
  `expo-secure-store`, never in SQLite.