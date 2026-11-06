import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  X, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Clock, 
  Info,
  RotateCcw
} from 'lucide-react';
import { WorkoutRoutine, WorkoutLog } from '../types/workout';
import { soundManager } from '../utils/audio';
import { ExerciseAnimation } from './ExerciseAnimation';

interface ActiveWorkoutPlayerProps {
  routine: WorkoutRoutine;
  onExit: () => void;
  onFinish: (log: WorkoutLog) => void;
  prepDuration?: number;
  defaultRestDuration?: number;
}

type PlayerState = 'prep' | 'work' | 'rest';

export const ActiveWorkoutPlayer: React.FC<ActiveWorkoutPlayerProps> = ({
  routine,
  onExit,
  onFinish,
  prepDuration = 5,
  defaultRestDuration = 15
}) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [playerState, setPlayerState] = useState<PlayerState>('prep');
  const [timeLeft, setTimeLeft] = useState<number>(prepDuration);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Cumulative workout metrics tracking
  const [totalWorkoutSeconds, setTotalWorkoutSeconds] = useState<number>(0);
  const [completedExercisesCount, setCompletedExercisesCount] = useState<number>(0);

  const currentExercise = routine.exercises[currentExerciseIndex];
  const nextExercise = routine.exercises[currentExerciseIndex + 1];
  const totalExercises = routine.exercises.length;

  const currentTotalTime = currentExercise 
    ? (playerState === 'prep' 
        ? prepDuration 
        : playerState === 'rest' 
          ? (routine.defaultRestSeconds || defaultRestDuration) 
          : currentExercise.durationSeconds) 
    : 30;

  // Ref to track if halfway has been called for this interval
  const halfwayPlayedRef = useRef<boolean>(false);

  // Initial announcement
  useEffect(() => {
    soundManager.setSoundSettings(!isMuted, !isMuted);
    soundManager.speak(`Get ready for ${currentExercise.name}`);
  }, []);

  // Main countdown tick interval
  useEffect(() => {
    if (isPaused || showExitConfirm) return;

    const interval = setInterval(() => {
      // Increment total active workout time
      if (playerState === 'work') {
        setTotalWorkoutSeconds((prev) => prev + 1);
      }

      setTimeLeft((prev) => {
        // Countdown beeps at 3, 2, 1
        if (prev <= 4 && prev > 1) {
          soundManager.playCountdownBeep();
        }

        // Halfway notification in work phase
        if (playerState === 'work' && !halfwayPlayedRef.current) {
          const half = Math.floor(currentExercise.durationSeconds / 2);
          if (prev === half) {
            soundManager.playHalfwayChime();
            soundManager.speak('Halfway there!');
            halfwayPlayedRef.current = true;
          }
        }

        // Interval finished
        if (prev <= 1) {
          handleIntervalCompletion();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [playerState, isPaused, currentExerciseIndex, showExitConfirm, currentExercise]);

  const handleIntervalCompletion = () => {
    halfwayPlayedRef.current = false;

    if (playerState === 'prep') {
      // Transition from prep to work
      soundManager.playStartWhistle();
      soundManager.speak(`Go! ${currentExercise.name}`);
      setPlayerState('work');
      setTimeLeft(currentExercise.durationSeconds);
    } else if (playerState === 'work') {
      // Finished an exercise!
      setCompletedExercisesCount((prev) => prev + 1);

      // Check if this was the last exercise
      if (currentExerciseIndex >= totalExercises - 1) {
        completeWorkout();
      } else {
        // Transition to rest
        soundManager.playRestChime();
        const next = routine.exercises[currentExerciseIndex + 1];
        soundManager.speak(`Take a rest. Next up: ${next.name}`);
        setPlayerState('rest');
        setTimeLeft(routine.defaultRestSeconds || defaultRestDuration);
      }
    } else if (playerState === 'rest') {
      // Transition from rest to next exercise work
      const nextIdx = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIdx);
      const nextEx = routine.exercises[nextIdx];
      soundManager.playStartWhistle();
      soundManager.speak(`Go! ${nextEx.name}`);
      setPlayerState('work');
      setTimeLeft(nextEx.durationSeconds);
    }
  };

  const completeWorkout = () => {
    soundManager.playVictoryFanfare();
    soundManager.speak('Workout Complete! Outstanding effort!');

    const totalSeconds = Math.max(30, totalWorkoutSeconds);
    // Calculate burned calories proportional to duration & routine level
    const estimatedBurn = Math.round(
      routine.exercises.reduce((acc, ex, idx) => {
        if (idx <= currentExerciseIndex) {
          return acc + (ex.caloriesPerMinute * (ex.durationSeconds / 60));
        }
        return acc;
      }, 0)
    );

    const log: WorkoutLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString(),
      routineId: routine.id,
      routineTitle: routine.title,
      category: routine.category,
      durationSeconds: totalSeconds,
      caloriesBurned: Math.max(20, estimatedBurn),
      exercisesCompleted: totalExercises,
      totalExercises: totalExercises
    };

    onFinish(log);
  };

  // Skip to next exercise
  const handleSkipNext = () => {
    halfwayPlayedRef.current = false;
    if (currentExerciseIndex >= totalExercises - 1) {
      completeWorkout();
    } else {
      const nextIdx = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIdx);
      setPlayerState('work');
      setTimeLeft(routine.exercises[nextIdx].durationSeconds);
      soundManager.speak(`Next: ${routine.exercises[nextIdx].name}`);
    }
  };

  // Back to previous exercise
  const handleSkipBack = () => {
    halfwayPlayedRef.current = false;
    if (currentExerciseIndex > 0) {
      const prevIdx = currentExerciseIndex - 1;
      setCurrentExerciseIndex(prevIdx);
      setPlayerState('work');
      setTimeLeft(routine.exercises[prevIdx].durationSeconds);
    } else {
      setTimeLeft(currentExercise.durationSeconds);
    }
  };

  // Add 10 seconds
  const handleAddTen = () => {
    setTimeLeft((prev) => prev + 10);
  };

  // Skip rest immediately
  const handleSkipRest = () => {
    if (playerState === 'rest') {
      handleIntervalCompletion();
    }
  };

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setSoundSettings(!nextMuted, !nextMuted);
  };

  // Calculate circular stroke percentage
  const progressRatio = currentTotalTime > 0 ? (currentTotalTime - timeLeft) / currentTotalTime : 0;
  const circumference = 2 * Math.PI * 88;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 overflow-y-auto select-none">
      {/* Top App Bar */}
      <div className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-slate-800/80 bg-slate-950/90 px-4 backdrop-blur-md">
        <button
          onClick={() => setShowExitConfirm(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          aria-label="Exit Workout"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-orange-400">
            {routine.title}
          </div>
          <div className="text-[11px] text-slate-400">
            Exercise {currentExerciseIndex + 1} of {totalExercises}
          </div>
        </div>

        <button
          onClick={toggleSound}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="h-5 w-5 text-rose-400" /> : <Volume2 className="h-5 w-5 text-orange-400" />}
        </button>
      </div>

      {/* Progress Bars for whole workout */}
      <div className="flex h-1 w-full gap-1 bg-slate-900 px-4">
        {routine.exercises.map((_, idx) => (
          <div
            key={idx}
            className={`h-full flex-1 rounded-full transition-colors ${
              idx < currentExerciseIndex
                ? 'bg-orange-500'
                : idx === currentExerciseIndex
                ? 'bg-amber-400 animate-pulse'
                : 'bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-4 justify-between">
        {/* State Banner: PREP / WORK / REST */}
        <div className="text-center mb-2">
          {playerState === 'prep' && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-4 py-1 text-xs font-bold uppercase tracking-wider text-amber-400 border border-amber-500/30">
              <Clock className="h-3.5 w-3.5" />
              <span>Get Ready</span>
            </div>
          )}
          {playerState === 'work' && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/20 px-4 py-1 text-xs font-bold uppercase tracking-wider text-orange-400 border border-orange-500/30">
              <Flame className="h-3.5 w-3.5 fill-orange-400" />
              <span>Active Work</span>
            </div>
          )}
          {playerState === 'rest' && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 px-4 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400 border border-cyan-500/30">
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Rest & Hydrate</span>
            </div>
          )}
        </div>

        {/* Big Countdown Timer with Circular Ring */}
        <div className="relative mx-auto my-1 flex h-52 w-52 items-center justify-center">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 200 200">
            {/* Background Track */}
            <circle
              cx="100"
              cy="100"
              r="88"
              className="stroke-slate-800 stroke-[10] fill-transparent"
            />
            {/* Animated Indicator */}
            <circle
              cx="100"
              cy="100"
              r="88"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-300 stroke-[12] fill-transparent ${
                playerState === 'prep'
                  ? 'stroke-amber-400'
                  : playerState === 'rest'
                  ? 'stroke-cyan-400'
                  : 'stroke-orange-500'
              }`}
            />
          </svg>

          {/* Central Digits Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-display text-6xl font-black tracking-tight tabular-nums text-white">
              {timeLeft}
            </span>
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold mt-1">
              {playerState === 'prep' ? 'Starting in' : playerState === 'rest' ? 'Rest Sec' : 'Seconds'}
            </span>
          </div>
        </div>

        {/* Active Exercise Card / Rest View */}
        {playerState === 'rest' ? (
          <div className="rounded-2xl border border-cyan-900/60 bg-gradient-to-b from-cyan-950/40 to-slate-900 p-4 text-center shadow-lg">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Catch Your Breath
            </div>
            <div className="mt-1 text-lg font-bold text-white font-display">
              Up Next: {nextExercise?.name || 'Final Stretch'}
            </div>
            <p className="mt-1 text-xs text-slate-300">
              {nextExercise?.repsText || 'Prepare for next interval'}
            </p>

            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => setTimeLeft((prev) => prev + 20)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 active:scale-95 transition-all"
              >
                +20s Rest
              </button>
              <button
                onClick={handleSkipRest}
                className="rounded-xl bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 active:scale-95 transition-all shadow-md shadow-cyan-500/20"
              >
                Skip Rest & Go
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Visual 4s Video / Kinetic Guide Animation */}
            <ExerciseAnimation 
              type={currentExercise.animationType} 
              isActive={!isPaused && playerState === 'work'}
              videoUrl={currentExercise.videoUrl}
              thumbnailUrl={currentExercise.thumbnailUrl}
            />

            {/* Exercise Title & Info */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">
                    {currentExercise.name}
                  </h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-orange-400">{currentExercise.repsText || `${currentExercise.durationSeconds}s`}</span>
                    <span>·</span>
                    <span>{currentExercise.targetMuscles.join(', ')}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowInstructions((prev) => !prev)}
                  className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                  <span>Tips</span>
                  {showInstructions ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
              </div>

              {/* Collapsible Form Coaching Details */}
              {showInstructions && (
                <div className="mt-3 border-t border-slate-800 pt-3 text-xs text-slate-300 animate-in fade-in duration-200">
                  <div className="font-semibold text-slate-200 mb-1">How to perform:</div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400">
                    {currentExercise.instructions.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                  <div className="mt-2.5 rounded-lg bg-orange-950/40 p-2.5 border border-orange-900/40 text-orange-200 text-[11px]">
                    <span className="font-bold">Form Tip: </span>
                    {currentExercise.proTips}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Up Next Preview Bar */}
        {nextExercise && playerState !== 'rest' && (
          <div className="flex items-center justify-between rounded-xl bg-slate-900/60 border border-slate-800/80 px-3.5 py-2 text-xs text-slate-400 mt-2">
            <span className="font-medium text-slate-400">Next Up:</span>
            <span className="font-semibold text-slate-200 truncate max-w-[200px]">
              {nextExercise.name} ({nextExercise.repsText || `${nextExercise.durationSeconds}s`})
            </span>
          </div>
        )}

        {/* Large Touch-Friendly Primary Workout Controls */}
        <div className="mt-4 flex items-center justify-center gap-4">
          {/* Back button */}
          <button
            onClick={handleSkipBack}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white active:scale-95 transition-all"
            aria-label="Previous Exercise"
          >
            <SkipBack className="h-5 w-5" />
          </button>

          {/* Time adjustment +10s */}
          <button
            onClick={handleAddTen}
            className="flex h-12 px-3.5 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white active:scale-95 transition-all"
          >
            +10s
          </button>

          {/* Primary Play / Pause button - Generous 72px touch target */}
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className={`flex h-18 w-18 items-center justify-center rounded-3xl text-white shadow-xl active:scale-95 transition-all ${
              isPaused
                ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25'
                : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/25'
            }`}
            aria-label={isPaused ? 'Resume Workout' : 'Pause Workout'}
          >
            {isPaused ? <Play className="h-8 w-8 fill-white ml-0.5" /> : <Pause className="h-8 w-8 fill-white" />}
          </button>

          {/* Next button */}
          <button
            onClick={handleSkipNext}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white active:scale-95 transition-all"
            aria-label="Skip to Next Exercise"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 mb-4 border border-rose-500/30">
              <X className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">
              Quit Workout?
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              You are currently on exercise {currentExerciseIndex + 1} of {totalExercises}. Quitting now won't record your completion streak.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 font-semibold text-sm text-white transition-colors"
              >
                Resume Workout
              </button>
              <button
                onClick={onExit}
                className="w-full h-11 rounded-xl bg-slate-800 hover:bg-slate-700 font-medium text-xs text-rose-300 transition-colors"
              >
                Quit & Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
