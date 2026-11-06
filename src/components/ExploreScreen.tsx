import React, { useState } from 'react';
import { 
  Search, 
  Dumbbell, 
  Flame, 
  Clock, 
  ChevronRight, 
  Plus, 
  Sparkles, 
  Layers,
  BookOpen,
  Info
} from 'lucide-react';
import { WorkoutRoutine, WorkoutCategory, DifficultyLevel, Exercise } from '../types/workout';
import { BUILTIN_ROUTINES, CATEGORY_INFO, MASTER_EXERCISES } from '../data/workoutData';
import { ExerciseAnimation } from './ExerciseAnimation';

interface ExploreScreenProps {
  customRoutines: WorkoutRoutine[];
  onSelectRoutine: (routine: WorkoutRoutine) => void;
  onOpenCustomBuilder: () => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  customRoutines,
  onSelectRoutine,
  onOpenCustomBuilder
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [activeSubTab, setActiveSubTab] = useState<'routines' | 'exercises'>('routines');
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState<Exercise | null>(null);

  const allRoutines = [...customRoutines, ...BUILTIN_ROUTINES];

  // Filtering routines
  const filteredRoutines = allRoutines.filter((r) => {
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || r.level === selectedLevel;
    const matchesSearch = searchQuery === '' || 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.exercises.some(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesLevel && matchesSearch;
  });

  // Master exercises list
  const masterExerciseList = Object.values(MASTER_EXERCISES).filter((ex) => {
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.targetMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-4 pb-28 select-none">
      {/* Screen Title & Sub-tabs */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-2xl font-black text-white font-display">
            Explore & Discover
          </h1>
          <p className="text-xs text-slate-400">
            Workouts, target muscle categories & exercises
          </p>
        </div>

        <button
          onClick={onOpenCustomBuilder}
          className="flex items-center gap-1 rounded-xl bg-orange-500 hover:bg-orange-600 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Workout</span>
        </button>
      </div>

      {/* Sub-Tabs: Routines vs Exercise Encyclopedia */}
      <div className="mb-4 flex rounded-xl bg-slate-900 p-1 border border-slate-800">
        <button
          onClick={() => setActiveSubTab('routines')}
          className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
            activeSubTab === 'routines'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Workout Routines ({allRoutines.length})
        </button>
        <button
          onClick={() => setActiveSubTab('exercises')}
          className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
            activeSubTab === 'exercises'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Exercise Library ({Object.keys(MASTER_EXERCISES).length})
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-3.5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder={activeSubTab === 'routines' ? 'Search routines (e.g. Abs, Cardio, Push)...' : 'Search moves (e.g. Plank, Squats)...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills Scroller */}
      <div className="mb-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`whitespace-nowrap shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
            selectedCategory === 'all'
              ? 'bg-slate-200 text-slate-950'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Categories
        </button>
        {(['abs', 'fullbody', 'cardio', 'pushpull', 'lowerbody'] as WorkoutCategory[]).map((cat) => {
          const meta = CATEGORY_INFO[cat];
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-slate-200 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Routines View */}
      {activeSubTab === 'routines' && (
        <div>
          {/* Level Filter */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] text-slate-400">Level:</span>
            {['all', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  selectedLevel === lvl
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl === 'all' ? 'Any' : lvl}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {filteredRoutines.map((routine) => {
              const meta = CATEGORY_INFO[routine.category];
              const routineImg = routine.imageUrl || meta.imageUrl;

              return (
                <div
                  key={routine.id}
                  onClick={() => onSelectRoutine(routine)}
                  className="flex items-center gap-3.5 rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 transition-all hover:border-slate-700 hover:bg-slate-900 cursor-pointer shadow-sm group"
                >
                  <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl bg-slate-950 border border-slate-800">
                    <img
                      src={routineImg}
                      alt={routine.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-1 left-1.5 rounded bg-black/80 px-1 py-0.5 text-[9px] font-bold uppercase text-orange-400">
                      {routine.level}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                        {meta.label}
                      </span>
                    </div>

                    <h3 className="mt-0.5 text-base font-bold text-white font-display truncate group-hover:text-orange-400 transition-colors">
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
        </div>
      )}

      {/* Exercises Encyclopedia View */}
      {activeSubTab === 'exercises' && (
        <div className="space-y-2.5">
          {masterExerciseList.map((exercise) => (
            <div
              key={exercise.id}
              onClick={() => setSelectedExerciseForModal(exercise)}
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 transition-all hover:border-slate-700 hover:bg-slate-900 cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-orange-400 border border-slate-700/60">
                  <Dumbbell className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    {exercise.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {exercise.targetMuscles.join(', ')} · <span className="text-orange-400 font-mono">{exercise.repsText || `${exercise.durationSeconds}s`}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 font-mono">
                  {exercise.caloriesPerMinute} kcal/m
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Exercise Detail Modal (if tapped in Encyclopedia) */}
      {selectedExerciseForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="rounded-lg bg-orange-500/20 px-2 py-0.5 text-[11px] font-bold text-orange-400 uppercase">
                {selectedExerciseForModal.category}
              </span>
              <button
                onClick={() => setSelectedExerciseForModal(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Kinetic Animation Guide */}
            <ExerciseAnimation type={selectedExerciseForModal.animationType} isActive={true} />

            <h3 className="mt-4 text-xl font-black text-white font-display">
              {selectedExerciseForModal.name}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-orange-400 font-mono">{selectedExerciseForModal.repsText || `${selectedExerciseForModal.durationSeconds}s`}</span>
              <span>·</span>
              <span>Target: {selectedExerciseForModal.targetMuscles.join(', ')}</span>
            </div>

            <div className="mt-4 space-y-2 border-t border-slate-800 pt-3 text-xs text-slate-300">
              <div className="font-bold text-slate-200">Execution Instructions:</div>
              <ol className="list-decimal pl-4 space-y-1 text-slate-300">
                {selectedExerciseForModal.instructions.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>

              <div className="mt-3 rounded-xl bg-orange-950/40 p-3 border border-orange-900/40 text-[11px] text-orange-200">
                <span className="font-bold">Pro Form Tip: </span>
                {selectedExerciseForModal.proTips}
              </div>
            </div>

            <button
              onClick={() => setSelectedExerciseForModal(null)}
              className="mt-5 w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-xs text-white"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
