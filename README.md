# Skool

Skool is a lightweight, offline-first Android app for students to manage
their class schedule and access their school's web portals — all in one
simple, fast app. No school account needed to use the schedule; portals
and downloads use the internet only when you actually open them.

---

## Features

### Home Dashboard
- Personalized welcome with your name (set once in Settings)
- Today's classes, sorted chronologically, pulled straight from your saved schedule
- Current class or next class card — auto-updates as time passes, shows "Starts in X min"
- "No more classes today" once your last class ends
- Subject count for today at a glance
- Quick action buttons to jump into Schedule or Portals

### Schedule
- Automatic timetable grid — time column on the left, Monday–Saturday columns, classes drawn as positioned, tinted blocks
- Grid range defaults to 07:00 AM–05:00 PM and **expands automatically** if a class falls outside it — never hardcoded
- Add classes with subject name, multiple day selection, and start/end time (lightweight built-in time picker, no extra dependency)
- Edit or delete a class by tapping its block
- Conflict detection — warns you if a new/edited class overlaps an existing one on the same day, with an option to add anyway
- Export Schedule — saves your classes to a `.json` file and opens the native Share sheet (send via Drive, WhatsApp, Bluetooth, etc.)
- Import Schedule — pick a received schedule file, automatically skips any class that time-conflicts with what you already have, and reports how many were added vs. skipped

### Portals
- Two fixed school portals (Student Portal, Learning Portal), opened in an in-app WebView — no need to leave Skool
- Cookies and login sessions persist across visits
- Back navigation (including the Android hardware back button), refresh, loading indicator, and a friendly retry screen if the connection drops
- Navigation is restricted to each portal's own domain — this stays a scoped portal viewer, not a general browser
- File downloads (PDF, DOCX, etc.) are detected automatically and saved into the app

### Downloads
- Every downloaded file listed with type and date
- Open (via the OS share/open sheet), Share, or Delete, each with confirmation on delete
- Friendly error instead of a crash if no compatible app can open a file
- Files are stored locally only — never uploaded anywhere automatically

### Settings
- Appearance: Light / Dark / System Default, persists across restarts
- Student name, editable anytime
- Save Portal Login toggle — stores portal username/password in the OS's secure keystore (never in the regular database), with a Clear Saved Login option
- Clear All Schedule and Clear Downloads, each with a confirmation prompt
- About section with app version and info

---

## Tech Stack

| | Library | Version |
|---|---|---|
| ![React Native](https://img.shields.io/badge/-React_Native-61DAFB?logo=react&logoColor=black&style=flat) | React Native + Expo | ~52.0.0 |
| ![SQLite](https://img.shields.io/badge/-SQLite-003B57?logo=sqlite&logoColor=white&style=flat) | expo-sqlite | ~15.1.4 |
| ![React Navigation](https://img.shields.io/badge/-React_Navigation-6B52AE?logo=react&logoColor=white&style=flat) | React Navigation (native, bottom-tabs, native-stack) | ^6 |
| ![Reanimated](https://img.shields.io/badge/-Reanimated-764ABC?logo=react&logoColor=white&style=flat) | react-native-reanimated | ~3.16.1 |
| ![Gesture Handler](https://img.shields.io/badge/-Gesture_Handler-FF6B6B?logo=react&logoColor=white&style=flat) | react-native-gesture-handler | ~2.20.2 |
| ![Expo](https://img.shields.io/badge/-WebView-000020?logo=expo&logoColor=white&style=flat) | react-native-webview | 13.12.5 |
| ![Expo](https://img.shields.io/badge/-Secure_Store-000020?logo=expo&logoColor=white&style=flat) | expo-secure-store | ~14.0.0 |
| ![Expo](https://img.shields.io/badge/-File_System-000020?logo=expo&logoColor=white&style=flat) | expo-file-system | ~18.0.0 |
| ![Expo](https://img.shields.io/badge/-Sharing-000020?logo=expo&logoColor=white&style=flat) | expo-sharing | ~13.0.1 |
| ![Expo](https://img.shields.io/badge/-Document_Picker-000020?logo=expo&logoColor=white&style=flat) | expo-document-picker | ~13.0.3 |
| ![SVG](https://img.shields.io/badge/-SVG-FF6B6B?logo=svg&logoColor=white&style=flat) | react-native-svg | 15.8.0 |
| ![Icons](https://img.shields.io/badge/-Vector_Icons-000020?logo=expo&logoColor=white&style=flat) | @expo/vector-icons (Ionicons) | ^14.0.0 |
| ![EAS](https://img.shields.io/badge/-EAS_Build-000020?logo=expo&logoColor=white&style=flat) | EAS Build | — |

No general-purpose browser, no unused camera/media libraries — kept
intentionally minimal for fast startup and a small install size.

---

## Folder Structure

```
Skool/
├── assets/
│   └── images/
│       └── skool-logo.png        # App icon / splash / About screen
├── src/
│   ├── components/
│   │   ├── AppHeader.jsx
│   │   ├── BottomNavigation.jsx  # Tab icon map
│   │   ├── ClassCard.jsx
│   │   ├── ScheduleBlock.jsx
│   │   ├── ScheduleGrid.jsx      # The automatic timetable grid
│   │   ├── DownloadItem.jsx
│   │   ├── QuickAction.jsx
│   │   ├── StatCard.jsx
│   │   ├── TimePicker.jsx        # Lightweight chip-based time picker
│   │   ├── LoadingView.jsx
│   │   └── EmptyState.jsx
│   ├── screens/
│   │   ├── HomeScreen.jsx
│   │   ├── ScheduleScreen.jsx
│   │   ├── AddScheduleScreen.jsx
│   │   ├── EditScheduleScreen.jsx
│   │   ├── PortalsScreen.jsx
│   │   ├── PortalWebViewScreen.jsx
│   │   ├── DownloadsScreen.jsx
│   │   └── SettingsScreen.jsx
│   ├── navigation/
│   │   ├── AppNavigation.jsx     # Bottom tabs + Schedule stack
│   │   └── PortalNavigation.jsx  # Portals -> WebView -> Downloads stack
│   ├── database/
│   │   ├── database.js           # SQLite connection
│   │   ├── migrations.js         # Schema + initDatabase()
│   │   ├── scheduleRepository.js
│   │   ├── settingsRepository.js
│   │   └── downloadsRepository.js
│   ├── services/
│   │   ├── timeService.js        # Device-local time, never hardcoded
│   │   ├── scheduleService.js    # Today's/current/next class logic
│   │   ├── portalService.js      # Allowed-domain checking
│   │   ├── secureStorageService.js
│   │   ├── downloadService.js
│   │   ├── fileService.js
│   │   └── scheduleFileService.js # Export/import schedule as JSON
│   ├── hooks/
│   │   ├── useTheme.js
│   │   ├── useSchedule.js
│   │   ├── useLocalTime.js
│   │   ├── useDownloads.js
│   │   └── usePortalAuth.js
│   ├── theme/
│   │   ├── colors.js             # Light + dark palettes
│   │   ├── typography.js
│   │   ├── spacing.js
│   │   └── theme.js
│   ├── utils/
│   │   ├── timeUtils.js          # Minutes-from-midnight helpers
│   │   ├── scheduleUtils.js
│   │   ├── fileUtils.js
│   │   └── validation.js
│   └── config/
│       └── portals.js            # Fixed portal URLs + allowed domains
├── App.jsx                       # Entry point: DB init, ThemeProvider, nav
├── app.json                      # Expo config
├── eas.json                      # EAS Build profiles
├── babel.config.js
├── package.json
├── .gitignore
└── README.md
```

---

## Running Locally

### Prerequisites
- Node.js **v20.x**
- EAS CLI: `npm install -g eas-cli`

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/Dotissleeping/Skool-proj-app.git
cd Skool-proj-app

# 2. Install dependencies
npm install

# 3. Start Expo dev
npx expo start
```

> **Note:** expo-sqlite, expo-secure-store, and the portal WebView require a
> development build — some features won't fully work inside standard Expo
> Go. Use EAS Build to generate a testable APK.

---

## Building the APK with EAS

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Log in to Expo
```bash
eas login
```

### 3. Build a preview APK (for testing, no Play Store needed)
```bash
eas build --platform android --profile preview
```

### 4. Build production APK
```bash
eas build --platform android --profile production
```

EAS builds in the cloud and provides a download link for the `.apk` when done.

---

## Known Issues & Fixes

| Problem | Fix |
|---|---|
| App wouldn't launch — `initDatabase` undefined | `App.jsx` called `initDatabase()` before it was actually defined/exported in `migrations.js`; added the real function |
| Crash — `groupSchedulesByGroupId` undefined | `useSchedule.js` imported it from `scheduleUtils.js` before it existed there; added it, grouping flat schedule rows into one entry per class by `group_id` |
| Crash — `sortByStartTime` undefined | Same issue in `scheduleService.js`; added `sortByStartTime()` to `scheduleUtils.js` |
| Portal WebView falsely showing "Unable to load portal" | `onError`/`onHttpError` fired on any failed sub-resource (e.g. a broken third-party image), not just the actual portal page; now only shows the error screen if the failing request's hostname matches the portal's own `allowedDomains` |
| Build failure risk from filename casing | A new file was saved as `Schedulefileservice.js` instead of `scheduleFileService.js`; Windows/VS Code is case-insensitive but Metro/EAS are case-sensitive — renamed to match exactly |
| "There was a problem parsing the package" on install | Usually a stale app with a different signing key, or a partial/corrupted APK download; fully uninstall the old app first and re-download the APK directly on-device |

---

## Database Schema

### `schedules`
One row per class **per selected day** — a class on Mon/Wed/Fri is 3 rows sharing a `group_id`.

| Column | Type |
|---|---|
| id | INTEGER PK |
| group_id | TEXT |
| subject_name | TEXT |
| day | TEXT |
| start_time | INTEGER (minutes from midnight) |
| end_time | INTEGER (minutes from midnight) |
| created_at | TEXT |
| updated_at | TEXT |

### `settings`
Generic key/value store — student name, theme mode, save-login toggle.

| Column | Type |
|---|---|
| key | TEXT PK |
| value | TEXT |

### `downloads`
Metadata only — the actual file bytes live in app file storage.

| Column | Type |
|---|---|
| id | INTEGER PK |
| filename | TEXT |
| file_path | TEXT |
| mime_type | TEXT |
| file_size | INTEGER |
| download_date | TEXT |
| source_portal | TEXT |

> Portal login credentials are **never** stored in SQLite — they live only
> in the OS-encrypted keystore via `expo-secure-store`.

---

## Design Notes

- All schedule times are stored as **minutes-from-midnight integers** (e.g. 08:00 AM = 480) for reliable comparisons and sorting.
- The timetable grid's visible range always fits every saved class automatically — nothing is ever hardcoded to a fixed set of hours.
- Portal WebViews are restricted to each portal's configured `allowedDomains` in `src/config/portals.js` — this is a scoped portal viewer, not a general browser.

---

## License

MIT — free to use and modify for your own school companion app.