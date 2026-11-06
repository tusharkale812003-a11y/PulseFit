import React, { useState, useEffect } from 'react';
import { X, Play, ShieldCheck, Zap } from 'lucide-react';

interface InterstitialAdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InterstitialAdModal: React.FC<InterstitialAdModalProps> = ({ isOpen, onClose }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(5);
      setCanSkip(false);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        if (prev <= 3) {
          setCanSkip(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl">
        {/* Header bar with countdown and skip */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/30">
              Ad Simulation
            </span>
            <span className="text-xs text-slate-400">
              {secondsRemaining > 0 ? `Reward in ${secondsRemaining}s` : 'Reward Unlocked'}
            </span>
          </div>

          {canSkip ? (
            <button
              onClick={onClose}
              className="flex items-center gap-1 rounded-full bg-slate-800 hover:bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-200 transition-colors"
            >
              <span>Skip Ad</span>
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <div className="text-xs font-mono text-slate-500">
              Skip in {Math.max(0, secondsRemaining - 2)}s
            </div>
          )}
        </div>

        {/* Ad creative body */}
        <div className="p-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-800 to-orange-950/50 border border-slate-700/60 flex flex-col items-center justify-center p-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/30 mb-3">
              <Zap className="h-8 w-8" />
            </div>
            <div className="text-lg font-bold text-white font-display">
              Titan Kinetic Grip™
            </div>
            <p className="mt-1 text-xs text-slate-300 max-w-xs">
              Next-generation workout mats & ergonomic pushup bars engineered for zero slip and joint protection.
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="h-3 w-3" />
                Rated 4.9/5 by 12,000+ Athletes
              </span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-[11px] text-slate-400">
              Simulated Interstitial: Triggers when workouts complete in wrapped hybrid/native releases.
            </p>
          </div>

          {/* Action button */}
          <div className="mt-5 flex flex-col gap-2">
            <button
              onClick={onClose}
              className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] font-semibold text-sm text-white shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Continue to Workout Summary</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
