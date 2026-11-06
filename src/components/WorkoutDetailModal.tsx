import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Flame, 
  Dumbbell, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';
import { WorkoutRoutine } from '../types/workout';
import { CATEGORY_INFO } from '../data/workoutData';

interface WorkoutDetailModalProps {
  routine: WorkoutRoutine;
  onClose: () => void;
  onStart: (routine: WorkoutRoutine) => void;
}

export const WorkoutDetailModal: React.FC<WorkoutDetailModalProps> = ({
  routine,
  onClose,
  onStart
}) => {
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedExerciseId((prev) => (prev === id ? null : id));
  };

  const categoryMeta = CATEGORY_INFO[routine.category];

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-slate-950 text-slate-100 overflow-y-auto select-none animate-in slide-in-from-bottom-4 duration-200">
      {/* Top Navigation */}
      <div className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 backdrop-blur-md">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <span className="text-sm font-semibold text-slate-300 truncate max-w-[200px]">
          Routine Overview
        </span>

        <div className="w-10" /> {/* Spacer for optical center */}
      </div>

      {/* Routine Hero Presentation */}
      <div className="mx-auto w-full max-w-xl p-4 pb-28">
        <div className="relative overflow-hidden rounded-3xl border border-orange-500/30 p-6 shadow-2xl">
          {/* Background Workout Photography */}
          <img
            src={routine.imageUrl || categoryMeta.imageUrl}
            alt={routine.title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.38] contrast-[1.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />

          <div className="relative z-10 flex items-center gap-2">
            <span className="rounded-lg bg-orange-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
              {routine.level}
            </span>
            <span className="rounded-lg bg-black/60 px-2.5 py-1 text-xs text-slate-300 font-semibold border border-white/10">
              {categoryMeta.label}
            </span>
          </div>

          <h1 className="relative z-10 mt-3 text-2xl md:text-3xl font-black text-white font-display drop-shadow-md">
            {routine.title}
          </h1>

          <p className="relative z-10 mt-2 text-xs md:text-sm text-slate-200 leading-relaxed drop-shadow">
            {routine.subtitle}
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-5 grid grid-cols-3 gap-2.5 pt-4 border-t border-slate-800/80">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-950/60 p-2.5 border border-slate-800/60">
              <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                <Clock className="h-3.5 w-3.5 text-orange-400" />
                <span>Duration</span>
              </div>
              <span className="mt-0.5 text-base font-bold text-white tabular-nums">
                ~{routine.estimatedDurationMin}m
              </span>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-950/60 p-2.5 border border-slate-800/60">
              <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                <Flame className="h-3.5 w-3.5 text-rose-400" />
                <span>Burn</span>
              </div>
              <span className="mt-0.5 text-base font-bold text-white tabular-nums">
                ~{routine.estimatedCalories} kcal
              </span>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-950/60 p-2.5 border border-slate-800/60">
              <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                <Dumbbell className="h-3.5 w-3.5 text-cyan-400" />
                <span>Exercises</span>
              </div>
              <span className="mt-0.5 text-base font-bold text-white tabular-nums">
                {routine.exercises.length} moves
              </span>
            </div>
          </div>
        </div>

        {/* Exercises List Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-base font-bold text-white font-display">
              Exercises Sequence
            </h2>
            <span className="text-xs text-slate-400">
              {routine.defaultRestSeconds}s rest between sets
            </span>
          </div>

          <div className="space-y-2.5">
            {routine.exercises.map((exercise, index) => {
              const isExpanded = expandedExerciseId === `${exercise.id}-${index}`;

              return (
                <div
                  key={`${exercise.id}-${index}`}
                  className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 transition-all hover:border-slate-700"
                >
                  <div
                    onClick={() => toggleExpand(`${exercise.id}-${index}`)}
                    className="flex items-center justify-between p-3.5 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      {/* Exercise 3D Thumbnail / Index Slot */}
                      {exercise.thumbnailUrl ? (
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-sm">
                          <img
                            src={exercise.thumbnailUrl}
                            alt={exercise.name}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute bottom-0 right-0 rounded-tl bg-black/80 px-1 text-[8px] font-mono text-orange-400">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-xs font-bold font-mono text-orange-400 border border-slate-700/60 shadow-inner">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                      )}

                      <div>
                        <div className="text-sm font-semibold text-white">
                          {exercise.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {exercise.repsText || `${exercise.durationSeconds}s`} · {exercise.targetMuscles.join(', ')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-orange-400/90 font-mono">
                        {exercise.durationSeconds}s
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded instructions & tips */}
                  {isExpanded && (
                    <div className="border-t border-slate-800/80 bg-slate-950/50 p-4 text-xs text-slate-300 animate-in fade-in duration-150">
                      <div className="font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Execution Guide:</span>
                      </div>
                      <ol className="list-decimal pl-4 space-y-1 text-slate-300">
                        {exercise.instructions.map((inst, i) => (
                          <li key={i}>{inst}</li>
                        ))}
                      </ol>

                      <div className="mt-3 rounded-xl bg-orange-950/30 p-2.5 border border-orange-900/40 text-[11px] text-orange-200 flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Coach's Pro Tip: </span>
                          {exercise.proTips}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar with Start Button */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-800 bg-slate-950/90 p-4 backdrop-blur-md">
        <div className="mx-auto max-w-xl">
          <button
            onClick={() => onStart(routine)}
            className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] font-bold text-base text-white shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2.5"
          >
            <Play className="h-5 w-5 fill-white" />
            <span>Start Workout Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
