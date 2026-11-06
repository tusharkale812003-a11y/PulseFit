import React, { useState } from 'react';
import { Sparkles, X, ExternalLink } from 'lucide-react';

interface BannerAdPlaceholderProps {
  className?: string;
}

export const BannerAdPlaceholder: React.FC<BannerAdPlaceholderProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={`w-full overflow-hidden rounded-xl border border-dashed border-slate-700/80 bg-slate-900/60 p-3 shadow-sm transition-all ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">Ad</span>
          <span>Sponsored Partner</span>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          title="Dismiss banner"
          aria-label="Dismiss banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200">
              HydroPulse Electrolife™
            </div>
            <div className="text-[11px] text-slate-400 line-clamp-1">
              Zero-sugar recovery electrolyte packs for high-intensity athletes.
            </div>
          </div>
        </div>

        <button 
          onClick={() => {
            alert('Simulated ad click: In a native app wrapper, this opens the sponsor link.');
          }}
          className="shrink-0 flex items-center gap-1 rounded-lg bg-orange-500/20 px-2.5 py-1.5 text-xs font-semibold text-orange-400 border border-orange-500/30 hover:bg-orange-500/30 transition-colors"
        >
          <span>Get 20%</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};
