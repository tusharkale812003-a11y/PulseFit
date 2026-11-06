import { UserStats, WorkoutLog, UserSettings, WorkoutRoutine } from '../types/workout';

const STATS_KEY = 'pulsefit_stats';
const LOGS_KEY = 'pulsefit_logs';
const CUSTOM_ROUTINES_KEY = 'pulsefit_custom_routines';
const SETTINGS_KEY = 'pulsefit_settings';

export const DEFAULT_STATS: UserStats = {
  currentStreak: 0,
  longestStreak: 0,
  totalWorkouts: 0,
  totalMinutes: 0,
  totalCalories: 0,
  lastWorkoutDate: null,
  completedDates: []
};

export const DEFAULT_SETTINGS: UserSettings = {
  soundBeeps: true,
  voiceGuidance: true,
  prepDurationSeconds: 5,
  defaultRestSeconds: 20,
  theme: 'dark'
};

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATS, ...parsed };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save stats', err);
  }
}

export function loadWorkoutLogs(): WorkoutLog[] {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveWorkoutLogs(logs: WorkoutLog[]): void {
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save logs', err);
  }
}

export function loadCustomRoutines(): WorkoutRoutine[] {
  try {
    const raw = localStorage.getItem(CUSTOM_ROUTINES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomRoutines(routines: WorkoutRoutine[]): void {
  try {
    localStorage.setItem(CUSTOM_ROUTINES_KEY, JSON.stringify(routines));
  } catch (err) {
    console.error('Failed to save custom routines', err);
  }
}

export function loadUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveUserSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
}

/**
 * Record a workout finish, update logs, and recalculate daily streaks
 */
export function recordWorkoutCompletion(log: WorkoutLog): { updatedStats: UserStats; isNewStreakDay: boolean } {
  const currentLogs = loadWorkoutLogs();
  const updatedLogs = [log, ...currentLogs];
  saveWorkoutLogs(updatedLogs);

  const prevStats = loadUserStats();
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  let newCurrentStreak = prevStats.currentStreak;
  let isNewStreakDay = false;

  const alreadyWorkedOutToday = prevStats.completedDates.includes(today);

  if (alreadyWorkedOutToday) {
    // Already maintained today's streak
    newCurrentStreak = Math.max(1, prevStats.currentStreak);
  } else {
    isNewStreakDay = true;
    if (prevStats.lastWorkoutDate === yesterday) {
      // Consecutive streak continued!
      newCurrentStreak = prevStats.currentStreak + 1;
    } else {
      // First workout or streak broken
      newCurrentStreak = 1;
    }
  }

  const newLongestStreak = Math.max(prevStats.longestStreak, newCurrentStreak);
  const newCompletedDates = alreadyWorkedOutToday 
    ? prevStats.completedDates 
    : [...prevStats.completedDates, today];

  const addedMinutes = Math.max(1, Math.round(log.durationSeconds / 60));

  const updatedStats: UserStats = {
    currentStreak: newCurrentStreak,
    longestStreak: newLongestStreak,
    totalWorkouts: prevStats.totalWorkouts + 1,
    totalMinutes: prevStats.totalMinutes + addedMinutes,
    totalCalories: prevStats.totalCalories + log.caloriesBurned,
    lastWorkoutDate: today,
    completedDates: newCompletedDates
  };

  saveUserStats(updatedStats);
  return { updatedStats, isNewStreakDay };
}

export function deleteWorkoutLog(logId: string): WorkoutLog[] {
  const currentLogs = loadWorkoutLogs();
  const filtered = currentLogs.filter(l => l.id !== logId);
  saveWorkoutLogs(filtered);
  return filtered;
}

export function clearAllLocalData(): void {
  localStorage.removeItem(STATS_KEY);
  localStorage.removeItem(LOGS_KEY);
  localStorage.removeItem(CUSTOM_ROUTINES_KEY);
  localStorage.removeItem(SETTINGS_KEY);
}

export function exportBackupJSON(): string {
  const data = {
    exportedAt: new Date().toISOString(),
    stats: loadUserStats(),
    logs: loadWorkoutLogs(),
    customRoutines: loadCustomRoutines(),
    settings: loadUserSettings()
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupJSON(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.stats) saveUserStats(data.stats);
    if (data.logs) saveWorkoutLogs(data.logs);
    if (data.customRoutines) saveCustomRoutines(data.customRoutines);
    if (data.settings) saveUserSettings(data.settings);
    return true;
  } catch {
    return false;
  }
}
