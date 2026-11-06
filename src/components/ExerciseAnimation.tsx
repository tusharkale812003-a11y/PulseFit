import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Video, Activity, Sparkles, Layers } from 'lucide-react';
import { AnimationType } from '../types/workout';

interface ExerciseAnimationProps {
  type: AnimationType;
  isActive?: boolean;
  videoUrl?: string;
  thumbnailUrl?: string;
}

// Background images mapping per exercise category style
const EXERCISE_BG_MAP: Record<string, string> = {
  jumping_jacks: '/src/assets/images/category_fullbody_hiit_1793895261888.jpg',
  pushups: '/src/assets/images/category_pushpull_calisthenics_1793895262530.jpg',
  plank: '/src/assets/images/category_abs_core_1793895261367.jpg',
  squats: '/src/assets/images/category_lowerbody_squats_1793895262517.jpg',
  crunches: '/src/assets/images/category_abs_core_1793895261367.jpg',
  lunges: '/src/assets/images/category_lowerbody_squats_1793895262517.jpg',
  mountain_climbers: '/src/assets/images/category_fullbody_hiit_1793895261888.jpg',
  high_knees: '/src/assets/images/category_fullbody_hiit_1793895261888.jpg',
  bicycle_crunches: '/src/assets/images/category_abs_core_1793895261367.jpg',
  russian_twists: '/src/assets/images/category_abs_core_1793895261367.jpg',
  leg_raises: '/src/assets/images/category_abs_core_1793895261367.jpg',
  burpees: '/src/assets/images/category_fullbody_hiit_1793895261888.jpg',
  tricep_dips: '/src/assets/images/category_pushpull_calisthenics_1793895262530.jpg',
  superman: '/src/assets/images/category_pushpull_calisthenics_1793895262530.jpg',
  glute_bridges: '/src/assets/images/category_lowerbody_squats_1793895262517.jpg',
  wall_sit: '/src/assets/images/category_lowerbody_squats_1793895262517.jpg',
};

export const ExerciseAnimation: React.FC<ExerciseAnimationProps> = ({ 
  type, 
  isActive = true,
  videoUrl,
  thumbnailUrl
}) => {
  const [videoTime, setVideoTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(isActive);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [viewMode, setViewMode] = useState<'video' | 'heatmap'>('video');

  const bgImage = thumbnailUrl || EXERCISE_BG_MAP[type] || '/src/assets/images/hero_workout_banner_1793895260531.jpg';

  // 4-second video loop interval (0.0 to 4.0 seconds)
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 50; // update every 50ms for smooth 60fps-like scrub
    const increment = (intervalTime / 1000) * playbackSpeed;

    const timer = setInterval(() => {
      setVideoTime((prev) => {
        const next = prev + increment;
        return next >= 4.0 ? 0.0 : next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  useEffect(() => {
    setIsPlaying(isActive);
  }, [isActive]);

  // Compute 4s rep progress (0% to 100%)
  const loopProgress = (videoTime / 4.0) * 100;

  // Determine current form phase in 4-second loop
  const getPhaseName = () => {
    if (videoTime < 1.0) return 'Phase 1: Setup & Alignment';
    if (videoTime < 2.2) return 'Phase 2: Eccentric Load (Down)';
    if (videoTime < 3.2) return 'Phase 3: Peak Contraction';
    return 'Phase 4: Return & Exhale';
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-950 shadow-2xl">
      {/* Background Studio Photography with Dark Vignette */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-900">
        <img
          src={bgImage}
          alt="Exercise demonstration background"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 filter blur-[1px]"
        />
        {/* Measured Contrast Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />

        {/* Video Camera Recording / Hud Overlays */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-slate-200 border border-slate-700/80">
            <span className={`h-2 w-2 rounded-full ${isPlaying ? 'bg-rose-500 animate-pulse' : 'bg-slate-500'}`} />
            <span>{videoUrl ? '3D Video Loop' : '4s Form Video'}</span>
          </div>
          <span className="rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-mono text-orange-400 border border-slate-800">
            HD 60FPS
          </span>
        </div>

        {/* View Mode Switcher (Video Loop / Muscle Heatmap) */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 rounded-xl bg-slate-900/80 backdrop-blur-md p-0.5 border border-slate-700/80">
          <button
            onClick={() => setViewMode('video')}
            className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold transition-all ${
              viewMode === 'video'
                ? 'bg-orange-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="h-3 w-3" />
            <span>Video</span>
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold transition-all ${
              viewMode === 'heatmap'
                ? 'bg-orange-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="h-3 w-3" />
            <span>Heatmap</span>
          </button>
        </div>

        {/* Real 3D Video / GIF Loop if provided */}
        {videoUrl && viewMode === 'video' ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
            {videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm') ? (
              <video
                src={videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={videoUrl}
                alt="3D Exercise Animation"
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 pointer-events-none" />
          </div>
        ) : (
          /* Animated Biomechanical Form Canvas Demonstration */
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="relative flex items-center justify-center transition-all duration-300">
              {/* Visual Rep Contraction Aura */}
              <div 
                style={{
                  transform: `scale(${1 + (Math.sin((videoTime / 4.0) * Math.PI * 2) * 0.08)})`,
                  opacity: viewMode === 'heatmap' ? 0.9 : 0.4
                }}
                className="absolute h-36 w-36 rounded-full bg-orange-500/20 blur-xl transition-transform"
              />

            {/* Exercise-Specific Vector Animation */}
            {type === 'jumping_jacks' && (
              <svg className="w-40 h-40 stroke-orange-400 fill-none stroke-[3.5] stroke-linecap-round stroke-linejoin-round filter drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]" viewBox="0 0 100 100">
                <circle cx="50" cy="22" r="8" className="fill-orange-500/30" />
                <line x1="50" y1="30" x2="50" y2="58" />
                {/* Dynamically expanding arms based on videoTime */}
                <line 
                  x1="50" 
                  y1="38" 
                  x2={50 - 30 * Math.sin((videoTime / 4.0) * Math.PI * 2)} 
                  y2={38 - 18 * Math.sin((videoTime / 4.0) * Math.PI * 2)} 
                  className={viewMode === 'heatmap' ? 'stroke-amber-300 stroke-[4.5]' : ''}
                />
                <line 
                  x1="50" 
                  y1="38" 
                  x2={50 + 30 * Math.sin((videoTime / 4.0) * Math.PI * 2)} 
                  y2={38 - 18 * Math.sin((videoTime / 4.0) * Math.PI * 2)} 
                  className={viewMode === 'heatmap' ? 'stroke-amber-300 stroke-[4.5]' : ''}
                />
                {/* Dynamically jumping legs */}
                <line 
                  x1="50" 
                  y1="58" 
                  x2={50 - 24 * Math.sin((videoTime / 4.0) * Math.PI * 2)} 
                  y2={86} 
                  className={viewMode === 'heatmap' ? 'stroke-rose-400 stroke-[4.5]' : ''}
                />
                <line 
                  x1="50" 
                  y1="58" 
                  x2={50 + 24 * Math.sin((videoTime / 4.0) * Math.PI * 2)} 
                  y2={86} 
                  className={viewMode === 'heatmap' ? 'stroke-rose-400 stroke-[4.5]' : ''}
                />
              </svg>
            )}

            {type === 'pushups' && (
              <svg className="w-44 h-40 stroke-orange-400 fill-none stroke-[3.5] stroke-linecap-round stroke-linejoin-round filter drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]" viewBox="0 0 100 100">
                <line x1="10" y1="80" x2="90" y2="80" className="stroke-slate-600 stroke-[2]" />
                {/* Pushing down and up curve */}
                {(() => {
                  const dip = Math.abs(Math.sin((videoTime / 4.0) * Math.PI)) * 14;
                  return (
                    <g transform={`translate(0, ${dip})`}>
                      <circle cx="28" cy="46" r="7" className="fill-orange-500/30" />
                      <line x1="33" y1="51" x2="82" y2="68" />
                      {/* Pectoral & Tricep active glow */}
                      <polyline 
                        points={`40,54 ${36 - dip*0.4},${68 + dip*0.2} 34,${80 - dip}`} 
                        className={viewMode === 'heatmap' ? 'stroke-amber-300 stroke-[5]' : ''}
                      />
                      <line x1="82" y1="68" x2="85" y2={80 - dip} />
                    </g>
                  );
                })()}
              </svg>
            )}

            {type === 'squats' && (
              <svg className="w-40 h-40 stroke-orange-400 fill-none stroke-[3.5] stroke-linecap-round stroke-linejoin-round filter drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]" viewBox="0 0 100 100">
                <line x1="15" y1="88" x2="85" y2="88" className="stroke-slate-600 stroke-[2]" />
                {(() => {
                  const squatDepth = Math.abs(Math.sin((videoTime / 4.0) * Math.PI)) * 16;
                  return (
                    <g transform={`translate(0, ${squatDepth})`}>
                      <circle cx="50" cy="26" r="7" className="fill-orange-500/30" />
                      <line x1="50" y1="33" x2="48" y2="54" />
                      <polyline points="50,38 66,38 74,36" />
                      {/* Quads and glutes active strain */}
                      <polyline 
                        points={`48,54 34,${60 + squatDepth * 0.4} 34,${88 - squatDepth}`} 
                        className={viewMode === 'heatmap' ? 'stroke-rose-400 stroke-[5]' : ''}
                      />
                      <polyline 
                        points={`48,54 62,${60 + squatDepth * 0.4} 62,${88 - squatDepth}`} 
                        className={viewMode === 'heatmap' ? 'stroke-rose-400 stroke-[5]' : ''}
                      />
                    </g>
                  );
                })()}
              </svg>
            )}

            {type === 'plank' && (
              <svg className="w-44 h-40 stroke-orange-400 fill-none stroke-[3.5] stroke-linecap-round stroke-linejoin-round filter drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]" viewBox="0 0 100 100">
                <line x1="10" y1="80" x2="90" y2="80" className="stroke-slate-600 stroke-[2]" />
                <circle cx="26" cy="52" r="7" className="fill-orange-500/30" />
                <line x1="32" y1="56" x2="82" y2="66" className={viewMode === 'heatmap' ? 'stroke-amber-300 stroke-[5]' : ''} />
                <polyline points="36,58 36,80 48,80" />
                <line x1="82" y1="66" x2="84" y2="80" />
                {/* Core tension heartbeat pulse */}
                <circle 
                  cx="56" 
                  cy="61" 
                  r={8 + (Math.sin((videoTime / 4.0) * Math.PI * 4) * 4)} 
                  className="stroke-amber-400 stroke-2 fill-orange-500/20" 
                />
              </svg>
            )}

            {/* General fallback athletic motion */}
            {!['jumping_jacks', 'pushups', 'squats', 'plank'].includes(type) && (
              <svg className="w-40 h-40 stroke-orange-400 fill-none stroke-[3.5] stroke-linecap-round stroke-linejoin-round filter drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]" viewBox="0 0 100 100">
                <line x1="15" y1="88" x2="85" y2="88" className="stroke-slate-600 stroke-[2]" />
                {(() => {
                  const motion = Math.abs(Math.sin((videoTime / 4.0) * Math.PI)) * 10;
                  return (
                    <g transform={`translate(0, ${motion})`}>
                      <circle cx="50" cy="26" r="8" className="fill-orange-500/30" />
                      <line x1="50" y1="34" x2="50" y2="62" className={viewMode === 'heatmap' ? 'stroke-amber-300 stroke-[4.5]' : ''} />
                      <polyline points={`28,45 50,${40 - motion * 0.5} 72,45`} />
                      <polyline points={`36,${88 - motion} 44,70 50,62 56,70 64,${88 - motion}`} className={viewMode === 'heatmap' ? 'stroke-rose-400 stroke-[4.5]' : ''} />
                    </g>
                  );
                })()}
              </svg>
            )}
          </div>
        </div>
        )}

        {/* Phase Subtitle & Coach Guidance */}
        <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-white font-medium bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/60">
            <Sparkles className="h-3.5 w-3.5 text-orange-400" />
            <span>{getPhaseName()}</span>
          </div>

          <div className="text-[11px] font-mono text-orange-400 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700/60 tabular-nums">
            00:0{Math.floor(videoTime)} / 00:04
          </div>
        </div>
      </div>

      {/* Video Loop Timeline Scrub Bar (00:00 to 00:04) */}
      <div className="relative h-1.5 w-full bg-slate-800">
        <div
          style={{ width: `${loopProgress}%` }}
          className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-75"
        />
        {/* Scrubber head indicator */}
        <div 
          style={{ left: `${loopProgress}%` }}
          className="absolute -top-1 h-3.5 w-1.5 rounded-full bg-white shadow-md -translate-x-1/2 transition-all duration-75"
        />
      </div>

      {/* Video Player Bottom Controls & Speed Toggles */}
      <div className="flex items-center justify-between bg-slate-950 px-4 py-2.5 text-xs border-t border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-slate-200 hover:text-white"
            title={isPlaying ? 'Pause video loop' : 'Play video loop'}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => setVideoTime(0)}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
            title="Restart 4s loop"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Loop</span>
          </button>
        </div>

        {/* Speed presets: 0.75x Slow-Mo or 1.0x Real-time */}
        <div className="flex items-center gap-1 text-[11px]">
          <span className="text-slate-400 mr-1">Speed:</span>
          {[0.75, 1.0].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`rounded px-1.5 py-0.5 font-mono font-semibold transition-colors ${
                playbackSpeed === spd
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
