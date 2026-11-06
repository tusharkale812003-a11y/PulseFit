import React from 'react';
import { Flame, ShieldCheck, Moon, Sun, Zap } from 'lucide-react';
import { UserStats } from '../types/workout';

interface TopBarProps {
  stats: UserStats;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  stats,
  theme,
  onToggleTheme
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/90 px-4 backdrop-blur-md">
      {/* Brand Wordmark Zone */}
      <div className="flex items-center gap-2 select-none">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md shadow-orange-500/20">
          <Zap className="h-4 w-4 fill-white" />
        </div>
        <span className="font-display text-lg font-black tracking-tight text-white">
          PulseFit
        </span>
        <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
          Offline
        </span>
      </div>

      {/* Right Actions: Streak Flame & Theme Toggle */}
      <div className="flex items-center gap-2">
        {/* Streak badge */}
        <div className="flex items-center gap-1 rounded-xl bg-orange-500/15 border border-orange-500/30 px-2.5 py-1 text-xs font-bold text-orange-400">
          <Flame className="h-4 w-4 fill-orange-400" />
          <span className="font-mono tabular-nums">{stats.currentStreak}d</span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-400" />}
        </button>
      </div>
    </header>
  );
};
