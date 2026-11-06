import React, { useState } from 'react';
import { 
  Flame, 
  Play, 
  Clock, 
  Zap, 
  Dumbbell, 
  ChevronRight, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Shield, 
  Activity
} from 'lucide-react';
import { WorkoutRoutine, WorkoutCategory, UserStats } from '../types/workout';
import { BUILTIN_ROUTINES, CATEGORY_INFO } from '../data/workoutData';
import { BannerAdPlaceholder } from './BannerAdPlaceholder';
import { getTodayDateString } from '../utils/storage';

interface HomeScreenProps {
  stats: UserStats;
  customRoutines: WorkoutRoutine[];
  onSelectRoutine: (routine: WorkoutRoutine) => void;
  onQuickStart: (routine: WorkoutRoutine) => void;
  onOpenCustomBuilder: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  customRoutines,
  onSelectRoutine,
  onQuickStart,
  onOpenCustomBuilder
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const todayStr = getTodayDateString();
  const hasWorkedOutToday = stats.completedDates.includes(todayStr);

  // All combined routines
  const allRoutines = [...customRoutines, ...BUILTIN_ROUTINES];

  // Daily pick routine for Quick Start
  const dailyPick = allRoutines[0] || BUILTIN_ROUTINES[0];

  // Filtered routines based on selected category tab
  const displayedRoutines = selectedCategory === 'all'
    ? allRoutines
    : allRoutines.filter((r) => r.category === selectedCategory);

  // Calculate current week days (Mon to Sun)
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon...
  const distanceToMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - distanceToMonday);

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    const isCompleted = stats.completedDates.includes(dateStr);
    const isToday = dateStr === todayStr;

    return {
      dateStr,
      dayLabel,
      dayNumber: d.getDate(),
      isCompleted,
      isToday
    };
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-4 pb-28 select-none">
      {/* Daily Streak Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-950/70 via-slate-900 to-amber-950/40 border border-orange-500/30 p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/30">
              <Flame className="h-7 w-7 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-black text-white tabular-nums">
                  {stats.currentStreak} Day{stats.currentStreak === 1 ? '' : 's'}
                </span>
                {hasWorkedOutToday && (
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                    Active Today
                  </span>
                )}
              </div>
              <p className="text-xs text-orange-200/80">
                {hasWorkedOutToday 
                  ? 'Daily streak goal completed for today! Keep it rolling.'
                  : 'Start a workout today to extend your streak!'}
              </p>
            </div>
          </div>
        </div>

        {/* Weekly 7-Day Streak Tracker */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Weekly Consistency</span>
            <span className="font-mono text-orange-400 font-semibold">
              {weekDays.filter(d => d.isCompleted).length} / 7 Days
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {weekDays.map((day, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center rounded-xl py-2 px-1 text-center transition-all ${
                  day.isCompleted
                    ? 'bg-orange-500/20 border border-orange-500/40 text-orange-400 font-bold'
                    : day.isToday
                    ? 'bg-slate-800 border border-slate-700 text-white'
                    : 'bg-slate-900/60 text-slate-500'
                }`}
              >
                <span className="text-[10px] uppercase">{day.dayLabel}</span>
                <span className="text-xs font-mono font-bold mt-0.5">{day.dayNumber}</span>
                <div className="mt-1">
                  {day.isCompleted ? (
                    <CheckCircle2 className="h-3 w-3 text-orange-400" />
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Start Today's Pick Card with Cinematic Workout Photography */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Recommended For You
          </span>
          <span className="text-xs text-orange-400 font-medium">
            Daily Quick Start
          </span>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-orange-500/30 p-5 shadow-2xl text-white">
          {/* Real Generated Fitness Studio Background */}
          <img
            src="/src/assets/images/hero_workout_banner_1793895260531.jpg"
            alt="Workout hero banner"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.45] contrast-[1.1] transition-transform duration-500 hover:scale-105"
          />
          {/* Measured Dark Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          <div className="relative z-10 flex items-start justify-between">
            <div className="max-w-[70%]">
              <span className="rounded-lg bg-orange-500/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md shadow-orange-500/30">
                {dailyPick.level} · {dailyPick.category}
              </span>
              <h2 className="mt-2.5 text-2xl font-black font-display leading-tight drop-shadow-md">
                {dailyPick.title}
              </h2>
              <p className="mt-1 text-xs text-slate-200 line-clamp-1 drop-shadow">
                {dailyPick.subtitle}
              </p>
            </div>

            <div className="flex flex-col items-end text-right bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10">
              <span className="text-base font-black font-mono text-orange-400">
                ~{dailyPick.estimatedDurationMin}m
              </span>
              <span className="text-xs text-slate-300">
                {dailyPick.estimatedCalories} kcal
              </span>
            </div>
          </div>

          <div className="relative z-10 mt-5 flex items-center justify-between pt-3 border-t border-white/15">
            <span className="text-xs font-medium text-slate-300">
              {dailyPick.exercises.length} calibrated exercises
            </span>

            <button
              onClick={() => onQuickStart(dailyPick)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/30 transition-all"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Quick Start</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Category Showcase Strips */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-base font-bold text-white font-display">
            Workout Categories
          </h2>

          <button
            onClick={onOpenCustomBuilder}
            className="flex items-center gap-1 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Custom</span>
          </button>
        </div>

        {/* Category Photo Cards Carousel */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`whitespace-nowrap shrink-0 rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Routines ({allRoutines.length})
          </button>

          {(['abs', 'fullbody', 'cardio', 'pushpull', 'lowerbody'] as WorkoutCategory[]).map((cat) => {
            const meta = CATEGORY_INFO[cat];
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative overflow-hidden whitespace-nowrap shrink-0 rounded-2xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'border-orange-500 bg-orange-500/20 text-orange-400 shadow-md shadow-orange-500/20'
                    : 'border-slate-800 bg-slate-900/90 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="h-5 w-5 rounded-lg overflow-hidden shrink-0">
                  <img src={meta.imageUrl} alt={meta.label} className="h-full w-full object-cover" />
                </div>
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Routines Card Feed with Rich Photography Thumbnails */}
      <div className="mt-3 space-y-3">
        {displayedRoutines.map((routine) => {
          const categoryMeta = CATEGORY_INFO[routine.category];
          const routineImg = routine.imageUrl || categoryMeta.imageUrl;

          return (
            <div
              key={routine.id}
              onClick={() => onSelectRoutine(routine)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 transition-all hover:border-slate-700 hover:bg-slate-900 shadow-sm flex items-center gap-3.5"
            >
              {/* Routine Fitness Thumbnail Image */}
              <div className="relative h-20 w-20 sm:h-22 sm:w-22 shrink-0 overflow-hidden rounded-xl bg-slate-950 border border-slate-800">
                <img
                  src={routineImg}
                  alt={routine.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-1 left-1.5 rounded bg-black/70 px-1 py-0.5 text-[9px] font-bold uppercase text-orange-400">
                  {routine.level}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    {categoryMeta.label}
                  </span>
                  {routine.isCustom && (
                    <span className="rounded-md bg-cyan-500/20 px-1.5 py-0.2 text-[9px] font-semibold text-cyan-400">
                      Custom
                    </span>
                  )}
                </div>

                <h3 className="mt-1 text-base font-bold text-white font-display truncate group-hover:text-orange-400 transition-colors">
                  {routine.title}
                </h3>

                <p className="text-xs text-slate-400 truncate">
                  {routine.subtitle}
                </p>

                <div className="mt-2 flex items-center gap-3 text-xs text-slate-300">
                  <div className="flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3 text-orange-400" />
                    <span>~{routine.estimatedDurationMin}m</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1 font-mono">
                    <Flame className="h-3 w-3 text-rose-400" />
                    <span>~{routine.estimatedCalories} kcal</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Dumbbell className="h-3 w-3 text-cyan-400" />
                    <span>{routine.exercises.length} moves</span>
                  </div>
                </div>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Banner Ad Slot Placeholder at Bottom of Home Screen (As Requested) */}
      <div className="mt-6">
        <BannerAdPlaceholder />
      </div>
    </div>
  );
};
