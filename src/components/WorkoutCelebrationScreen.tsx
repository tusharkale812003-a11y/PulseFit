import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Share2, 
  Home, 
  Sparkles, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { WorkoutLog, UserStats } from '../types/workout';
import { InterstitialAdModal } from './InterstitialAdModal';

interface WorkoutCelebrationScreenProps {
  log: WorkoutLog;
  stats: UserStats;
  isNewStreakDay: boolean;
  onDone: () => void;
  onViewProgress: () => void;
}

export const WorkoutCelebrationScreen: React.FC<WorkoutCelebrationScreenProps> = ({
  log,
  stats,
  isNewStreakDay,
  onDone,
  onViewProgress
}) => {
  const [showInterstitialAd, setShowInterstitialAd] = useState<boolean>(true);
  const [hasShared, setHasShared] = useState<boolean>(false);

  useEffect(() => {
    // Launch celebratory confetti fireworks
    try {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 60
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#f97316', '#fbbf24', '#ffffff']
      });
      fire(0.2, {
        spread: 60,
        colors: ['#06b6d4', '#10b981', '#f97316']
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        colors: ['#ec4899', '#8b5cf6']
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  const handleShare = async () => {
    const text = `I just finished the ${log.routineTitle} workout on PulseFit! Burned ~${log.caloriesBurned} kcal with a ${stats.currentStreak}-day streak! 🔥 100% offline daily fitness.`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PulseFit Workout Complete',
          text: text
        });
        setHasShared(true);
      } catch {
        // user cancelled share
      }
    } else {
      navigator.clipboard.writeText(text);
      setHasShared(true);
      setTimeout(() => setHasShared(false), 2500);
    }
  };

  const minutes = Math.floor(log.durationSeconds / 60);
  const seconds = log.durationSeconds % 60;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-slate-950 text-slate-100 overflow-y-auto select-none">
      {/* Simulated Interstitial Ad trigger on workout completion */}
      <InterstitialAdModal 
        isOpen={showInterstitialAd} 
        onClose={() => setShowInterstitialAd(false)} 
      />

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-between p-4 py-8">
        {/* Celebration Header */}
        <div className="text-center">
          <div className="relative mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-2xl shadow-orange-500/40">
            <Trophy className="h-12 w-12" />
            <div className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
            Crushed It!
          </span>
          <h1 className="mt-1 text-3xl font-black text-white font-display">
            Workout Complete
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            {log.routineTitle}
          </p>
        </div>

        {/* Streak Announcement Banner */}
        <div className="my-5 rounded-2xl border border-orange-500/40 bg-gradient-to-r from-orange-950/40 via-amber-950/30 to-orange-950/40 p-4 shadow-lg text-center">
          <div className="flex items-center justify-center gap-2 text-orange-400">
            <Flame className="h-6 w-6 fill-orange-400 animate-pulse" />
            <span className="font-display text-2xl font-black tabular-nums text-white">
              {stats.currentStreak}-Day Streak!
            </span>
          </div>
          <p className="mt-1 text-xs text-orange-200/90">
            {isNewStreakDay 
              ? 'Awesome! Today’s daily goal is unlocked. Keep the flame alive tomorrow!'
              : 'Consistent effort logged! You’ve trained today.'}
          </p>
        </div>

        {/* Workout Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 p-3.5 text-center">
            <Clock className="h-5 w-5 text-orange-400 mb-1" />
            <span className="text-lg font-bold font-display text-white tabular-nums">
              {minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`}
            </span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">
              Total Time
            </span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 p-3.5 text-center">
            <Flame className="h-5 w-5 text-rose-400 mb-1" />
            <span className="text-lg font-bold font-display text-white tabular-nums">
              {log.caloriesBurned}
            </span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">
              Est. Calories
            </span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 p-3.5 text-center">
            <Zap className="h-5 w-5 text-amber-400 mb-1" />
            <span className="text-lg font-bold font-display text-white tabular-nums">
              {log.exercisesCompleted}/{log.totalExercises}
            </span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">
              Exercises
            </span>
          </div>
        </div>

        {/* Offline local save confirmation note */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          <span>Saved directly to offline device storage</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={onViewProgress}
            className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] font-bold text-sm text-white shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>View Progress & History</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleShare}
              className="h-11 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 font-semibold text-xs text-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="h-4 w-4 text-orange-400" />
              <span>{hasShared ? 'Copied!' : 'Share Achievement'}</span>
            </button>

            <button
              onClick={onDone}
              className="h-11 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 font-semibold text-xs text-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4 text-slate-400" />
              <span>Return Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
