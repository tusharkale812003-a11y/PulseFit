import React, { useState } from 'react';
import { X, Plus, Trash2, Check, Dumbbell, Sparkles } from 'lucide-react';
import { WorkoutRoutine, WorkoutCategory, DifficultyLevel, Exercise } from '../types/workout';
import { MASTER_EXERCISES } from '../data/workoutData';

interface CustomWorkoutBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (routine: WorkoutRoutine) => void;
}

export const CustomWorkoutBuilderModal: React.FC<CustomWorkoutBuilderModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<WorkoutCategory>('fullbody');
  const [level, setLevel] = useState<DifficultyLevel>('Beginner');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([
    MASTER_EXERCISES.jumping_jacks,
    MASTER_EXERCISES.squats,
    MASTER_EXERCISES.pushups,
    MASTER_EXERCISES.plank
  ]);
  const [restSeconds, setRestSeconds] = useState(20);

  if (!isOpen) return null;

  const handleAddExercise = (exerciseId: string) => {
    const ex = MASTER_EXERCISES[exerciseId];
    if (ex) {
      setSelectedExercises((prev) => [...prev, ex]);
    }
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a routine title');
      return;
    }
    if (selectedExercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    const totalDurationSeconds = selectedExercises.reduce(
      (acc, ex) => acc + ex.durationSeconds + restSeconds,
      0
    );
    const estimatedMinutes = Math.max(1, Math.round(totalDurationSeconds / 60));
    const estimatedCalories = Math.round(
      selectedExercises.reduce((acc, ex) => acc + ex.caloriesPerMinute * (ex.durationSeconds / 60), 0)
    );

    const newRoutine: WorkoutRoutine = {
      id: `custom-routine-${Date.now()}`,
      title: title.trim(),
      subtitle: `Custom user workout (${level} · ${selectedExercises.length} exercises)`,
      category,
      level,
      estimatedDurationMin: estimatedMinutes,
      estimatedCalories,
      exercises: selectedExercises,
      defaultRestSeconds: restSeconds,
      isCustom: true
    };

    onSave(newRoutine);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Create Custom Workout
              </h2>
              <p className="text-xs text-slate-400">
                Design your own offline routine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Routine Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Routine Title
            </label>
            <input
              type="text"
              placeholder="e.g., Morning Power Blitz"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Category & Level */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WorkoutCategory)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="fullbody">Full Body</option>
                <option value="abs">Abs & Core</option>
                <option value="cardio">Cardio HIIT</option>
                <option value="pushpull">Push & Pull</option>
                <option value="lowerbody">Lower Body</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Difficulty
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as DifficultyLevel)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Rest Interval */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Rest Between Exercises: <span className="text-orange-400 font-mono">{restSeconds}s</span>
            </label>
            <div className="flex gap-2">
              {[15, 20, 30, 45].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setRestSeconds(sec)}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors ${
                    restSeconds === sec
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* Selected Exercises List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Routine Exercises ({selectedExercises.length})
              </label>
            </div>

            <div className="space-y-1.5 mb-3">
              {selectedExercises.map((ex, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl bg-slate-950 p-2.5 border border-slate-800/80"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-orange-400 w-5">
                      {idx + 1}.
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {ex.name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ({ex.durationSeconds}s)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(idx)}
                    className="p-1 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Add from Master Library */}
            <div className="border-t border-slate-800 pt-3">
              <span className="text-xs font-medium text-slate-400 block mb-2">
                Tap to Add from Exercise Library:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Object.values(MASTER_EXERCISES).map((ex) => (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => handleAddExercise(ex.id)}
                    className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-xs text-slate-200 border border-slate-700/60"
                  >
                    <Plus className="h-3 w-3 text-orange-400" />
                    <span>{ex.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition-all"
          >
            <Check className="h-4 w-4" />
            <span>Save Custom Routine</span>
          </button>
        </div>
      </div>
    </div>
  );
};
