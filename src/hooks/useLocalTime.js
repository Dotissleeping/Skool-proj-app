// src/hooks/useLocalTime.js
//
// Exposes the current local time to screens, ticking on an interval
// rather than every second — the dashboard only needs minute-level
// accuracy, so this avoids re-rendering the whole timetable constantly
// (spec section 30: don't rerender everything every second).

import { useEffect, useState } from 'react';
import { getNow, getCurrentMinutes, getCurrentWeekday, getCurrentDateLabel } from '../services/timeService';

const TICK_INTERVAL_MS = 30000; // 30 seconds — plenty for minute-level UI

export function useLocalTime() {
  const [now, setNow] = useState(getNow());

  useEffect(() => {
    const id = setInterval(() => setNow(getNow()), TICK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return {
    now,
    currentMinutes: getCurrentMinutes(now),
    currentWeekday: getCurrentWeekday(now),
    dateLabel: getCurrentDateLabel(now),
  };
}