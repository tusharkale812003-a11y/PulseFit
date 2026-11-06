/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WorkoutRoutine, WorkoutLog, UserStats, UserSettings } from './types/workout';
import { 
  loadUserStats, 
  loadWorkoutLogs, 
  loadCustomRoutines, 
  loadUserSettings, 
  saveCustomRoutines, 
  recordWorkoutCompletion,
  DEFAULT_STATS,
  DEFAULT_SETTINGS
} from './utils/storage';
import { soundManager } from './utils/audio';

import { TopBar } from './components/TopBar';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { WorkoutDetailModal } from './components/WorkoutDetailModal';
import { ActiveWorkoutPlayer } from './components/ActiveWorkoutPlayer';
import { WorkoutCelebrationScreen } from './components/WorkoutCelebrationScreen';
import { CustomWorkoutBuilderModal } from './components/CustomWorkoutBuilderModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [customRoutines, setCustomRoutines] = useState<WorkoutRoutine[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  // Flow State
  const [inspectRoutine, setInspectRoutine] = useState<WorkoutRoutine | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutRoutine | null>(null);
  const [finishedLog, setFinishedLog] = useState<WorkoutLog | null>(null);
  const [isNewStreakDay, setIsNewStreakDay] = useState<boolean>(false);
  const [isCustomBuilderOpen, setIsCustomBuilderOpen] = useState<boolean>(false);

  // Load initial data from localStorage
  const refreshLocalData = () => {
    const loadedStats = loadUserStats();
    const loadedLogs = loadWorkoutLogs();
    const loadedRoutines = loadCustomRoutines();
    const loadedSettings = loadUserSettings();

    setStats(loadedStats);
    setLogs(loadedLogs);
    setCustomRoutines(loadedRoutines);
    setSettings(loadedSettings);

    // Sync sound engine
    soundManager.setSoundSettings(loadedSettings.soundBeeps, loadedSettings.voiceGuidance);

    // Sync theme
    if (loadedSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    refreshLocalData();
  }, []);

  const handleToggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    const updated: UserSettings = { ...settings, theme: newTheme };
    setSettings(updated);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Start workout from detail modal
  const handleStartWorkout = (routine: WorkoutRoutine) => {
    setInspectRoutine(null);
    setActiveWorkout(routine);
  };

  // Quick start directly from home
  const handleQuickStart = (routine: WorkoutRoutine) => {
    setActiveWorkout(routine);
  };

  // Workout completed
  const handleWorkoutFinished = (log: WorkoutLog) => {
    const { updatedStats, isNewStreakDay: newDay } = recordWorkoutCompletion(log);
    setStats(updatedStats);
    setIsNewStreakDay(newDay);
    setLogs(loadWorkoutLogs());
    setActiveWorkout(null);
    setFinishedLog(log);
  };

  // Save new custom routine
  const handleSaveCustomRoutine = (newRoutine: WorkoutRoutine) => {
    const updated = [newRoutine, ...customRoutines];
    setCustomRoutines(updated);
    saveCustomRoutines(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      {/* Top Application Bar */}
      <TopBar 
        stats={stats} 
        theme={settings.theme} 
        onToggleTheme={handleToggleTheme} 
      />

      {/* Main Responsive Viewport Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col">
        {activeTab === 'home' && (
          <HomeScreen
            stats={stats}
            customRoutines={customRoutines}
            onSelectRoutine={(routine) => setInspectRoutine(routine)}
            onQuickStart={handleQuickStart}
            onOpenCustomBuilder={() => setIsCustomBuilderOpen(true)}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreScreen
            customRoutines={customRoutines}
            onSelectRoutine={(routine) => setInspectRoutine(routine)}
            onOpenCustomBuilder={() => setIsCustomBuilderOpen(true)}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressScreen
            stats={stats}
            logs={logs}
            onRefreshData={refreshLocalData}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={setSettings}
            onRefreshData={refreshLocalData}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNav 
        activeTab={activeTab} 
        onChangeTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />

      {/* Routine Detail Screen / Modal */}
      {inspectRoutine && (
        <WorkoutDetailModal
          routine={inspectRoutine}
          onClose={() => setInspectRoutine(null)}
          onStart={handleStartWorkout}
        />
      )}

      {/* Active Workout Player Screen */}
      {activeWorkout && (
        <ActiveWorkoutPlayer
          routine={activeWorkout}
          prepDuration={settings.prepDurationSeconds}
          defaultRestDuration={settings.defaultRestSeconds}
          onExit={() => setActiveWorkout(null)}
          onFinish={handleWorkoutFinished}
        />
      )}

      {/* Celebration & Completion Screen */}
      {finishedLog && (
        <WorkoutCelebrationScreen
          log={finishedLog}
          stats={stats}
          isNewStreakDay={isNewStreakDay}
          onDone={() => setFinishedLog(null)}
          onViewProgress={() => {
            setFinishedLog(null);
            setActiveTab('progress');
          }}
        />
      )}

      {/* Custom Workout Builder Modal */}
      <CustomWorkoutBuilderModal
        isOpen={isCustomBuilderOpen}
        onClose={() => setIsCustomBuilderOpen(false)}
        onSave={handleSaveCustomRoutine}
      />
    </div>
  );
}
