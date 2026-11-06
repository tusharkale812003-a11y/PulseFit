import React, { useState } from 'react';
import { 
  Flame, 
  Trophy, 
  Clock, 
  Calendar, 
  Trash2, 
  Download, 
  Upload, 
  CheckCircle2, 
  Award, 
  Zap, 
  ChevronRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { UserStats, WorkoutLog } from '../types/workout';
import { deleteWorkoutLog, clearAllLocalData, exportBackupJSON, importBackupJSON } from '../utils/storage';
import { CATEGORY_INFO } from '../data/workoutData';

interface ProgressScreenProps {
  stats: UserStats;
  logs: WorkoutLog[];
  onRefreshData: () => void;
  onSelectRoutineById?: (id: string) => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  stats,
  logs,
  onRefreshData
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showDataManagement, setShowDataManagement] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteLog = (id: string) => {
    if (confirm('Delete this workout record from your history?')) {
      deleteWorkoutLog(id);
      onRefreshData();
      showToast('Record deleted.');
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to reset all workout history, stats, and streaks? This cannot be undone.')) {
      clearAllLocalData();
      onRefreshData();
      showToast('All local workout data reset.');
    }
  };

  const handleExport = () => {
    const json = exportBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pulsefit_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup JSON exported successfully.');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importBackupJSON(content);
      if (success) {
        onRefreshData();
        showToast('Backup restored successfully!');
      } else {
        alert('Invalid backup file.');
      }
    };
    reader.readAsText(file);
  };

  // Generate last 7 days metrics
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const isoDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    const dayNumber = d.getDate();

    // calculate total minutes on this day
    const dayLogs = logs.filter(l => l.date.startsWith(isoDate));
    const totalMins = dayLogs.reduce((acc, l) => acc + Math.round(l.durationSeconds / 60), 0);
    const hasWorkedOut = stats.completedDates.includes(isoDate) || dayLogs.length > 0;

    return {
      isoDate,
      dayLabel,
      dayNumber,
      totalMins,
      hasWorkedOut
    };
  });

  const maxDailyMinutes = Math.max(25, ...last7Days.map(d => d.totalMins));

  // Filtered logs
  const filteredLogs = filterCategory === 'all' 
    ? logs 
    : logs.filter(l => l.category === filterCategory);

  // Milestones checklist
  const milestones = [
    { title: 'First Workout', desc: 'Complete your first session', achieved: stats.totalWorkouts >= 1, icon: Zap },
    { title: '3-Day Fire', desc: 'Reach a 3-day workout streak', achieved: stats.longestStreak >= 3, icon: Flame },
    { title: 'Weekly Champion', desc: 'Reach a 7-day workout streak', achieved: stats.longestStreak >= 7, icon: Trophy },
    { title: 'Century Club', desc: 'Accumulate 100+ minutes of training', achieved: stats.totalMinutes >= 100, icon: Clock },
    { title: 'Calorie Crusher', desc: 'Burn 1,000+ total estimated kcal', achieved: stats.totalCalories >= 1000, icon: Award },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-4 pb-28 select-none">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-xl animate-in fade-in">
          {notification}
        </div>
      )}

      {/* Screen Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black text-white font-display">
            Activity & Progress
          </h1>
          <p className="text-xs text-slate-400">
            100% offline personal workout history & analytics
          </p>
        </div>

        <button
          onClick={() => setShowDataManagement((prev) => !prev)}
          className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          {showDataManagement ? 'Close Tools' : 'Data Tools'}
        </button>
      </div>

      {/* Backup / Export / Import Tray */}
      {showDataManagement && (
        <div className="mb-5 rounded-2xl border border-slate-700 bg-slate-900/90 p-4 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Offline Storage Tools
            </span>
          </div>
          <p className="text-xs text-slate-300 mb-3">
            All your workouts stay purely on your device. You can download a JSON backup or transfer it to another browser.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Download className="h-4 w-4 text-orange-400" />
              <span>Export JSON Backup</span>
            </button>

            <label className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors cursor-pointer">
              <Upload className="h-4 w-4 text-cyan-400" />
              <span>Import Backup</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>

            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 rounded-xl bg-rose-950/60 border border-rose-800/60 hover:bg-rose-900/80 px-3 py-2 text-xs font-semibold text-rose-300 transition-colors"
            >
              <Trash2 className="h-4 w-4 text-rose-400" />
              <span>Reset History</span>
            </button>
          </div>
        </div>
      )}

      {/* Lifetime Stats Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-950/30 to-slate-900 p-3.5 shadow-sm">
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <Flame className="h-4 w-4 text-orange-400" />
            <span>Streak</span>
          </div>
          <div className="mt-1 font-display text-2xl font-black text-white tabular-nums">
            {stats.currentStreak} <span className="text-xs font-normal text-slate-400">days</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Best: {stats.longestStreak} days
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3.5 shadow-sm">
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <Trophy className="h-4 w-4 text-amber-400" />
            <span>Workouts</span>
          </div>
          <div className="mt-1 font-display text-2xl font-black text-white tabular-nums">
            {stats.totalWorkouts}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Sessions completed
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3.5 shadow-sm">
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <Clock className="h-4 w-4 text-cyan-400" />
            <span>Minutes</span>
          </div>
          <div className="mt-1 font-display text-2xl font-black text-white tabular-nums">
            {stats.totalMinutes}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Total active time
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3.5 shadow-sm">
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <Zap className="h-4 w-4 text-rose-400" />
            <span>Calories</span>
          </div>
          <div className="mt-1 font-display text-2xl font-black text-white tabular-nums">
            {stats.totalCalories}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Estimated kcal
          </div>
        </div>
      </div>

      {/* 7-Day Consistency Weekly Activity Bar Chart */}
      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-bold text-white font-display">
              Last 7 Days Training Activity
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {last7Days.filter(d => d.hasWorkedOut).length} of 7 days active
          </span>
        </div>

        {/* Bar chart columns */}
        <div className="grid grid-cols-7 gap-2 items-end h-28 pt-2">
          {last7Days.map((day, idx) => {
            const heightPercent = day.totalMins > 0 
              ? Math.max(18, Math.min(100, Math.round((day.totalMins / maxDailyMinutes) * 100))) 
              : 8;

            return (
              <div key={idx} className="flex flex-col items-center justify-end h-full gap-1.5">
                <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                  {day.totalMins > 0 ? `${day.totalMins}m` : '-'}
                </span>

                <div className="w-full max-w-[32px] h-full flex items-end">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      day.hasWorkedOut
                        ? 'bg-gradient-to-t from-orange-600 to-amber-400 shadow-md shadow-orange-500/20'
                        : 'bg-slate-800'
                    }`}
                  />
                </div>

                <span className="text-[11px] font-semibold text-slate-400">
                  {day.dayLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Award className="h-4 w-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white font-display">
            Milestones & Badges
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {milestones.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 rounded-xl p-2.5 border transition-all ${
                  m.achieved
                    ? 'border-amber-500/30 bg-amber-950/20 text-white'
                    : 'border-slate-800/80 bg-slate-950/40 text-slate-400 opacity-60'
                }`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  m.achieved ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                    <span>{m.title}</span>
                    {m.achieved && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">
                    {m.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History Log of Completed Workouts */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-orange-400" />
            <h2 className="text-base font-bold text-white font-display">
              Workout History ({logs.length})
            </h2>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-xs">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-2 py-1 rounded-md transition-colors ${
                filterCategory === 'all' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterCategory('abs')}
              className={`px-2 py-1 rounded-md transition-colors ${
                filterCategory === 'abs' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Abs
            </button>
            <button
              onClick={() => setFilterCategory('fullbody')}
              className={`px-2 py-1 rounded-md transition-colors ${
                filterCategory === 'fullbody' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Full
            </button>
            <button
              onClick={() => setFilterCategory('cardio')}
              className={`px-2 py-1 rounded-md transition-colors ${
                filterCategory === 'cardio' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              HIIT
            </button>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center">
            <Calendar className="mx-auto h-10 w-10 text-slate-400 mb-2" />
            <div className="text-sm font-semibold text-slate-300">
              No workout logs found
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Start your first workout from the Home screen to begin recording your offline fitness journey!
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredLogs.map((log) => {
              const dateObj = new Date(log.date);
              const formattedDate = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
              const formattedTime = dateObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              });

              const minutes = Math.floor(log.durationSeconds / 60);
              const seconds = log.durationSeconds % 60;
              const durationStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 shadow-sm hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                      <Flame className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="text-sm font-bold text-white">
                        {log.routineTitle}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>{formattedDate} · {formattedTime}</span>
                        <span>·</span>
                        <span className="capitalize text-slate-300">{log.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-bold text-orange-400 font-mono tabular-nums">
                        {log.caloriesBurned} kcal
                      </div>
                      <div className="text-xs text-slate-400 tabular-nums font-mono">
                        {durationStr}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
                      title="Delete log"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
