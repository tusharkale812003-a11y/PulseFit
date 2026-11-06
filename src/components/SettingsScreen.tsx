import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Moon, 
  Sun, 
  Clock, 
  ShieldCheck, 
  Download, 
  Upload, 
  RotateCcw, 
  Smartphone, 
  Info,
  Check
} from 'lucide-react';
import { UserSettings } from '../types/workout';
import { saveUserSettings, exportBackupJSON, importBackupJSON, clearAllLocalData } from '../utils/storage';
import { soundManager } from '../utils/audio';

interface SettingsScreenProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onRefreshData: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onRefreshData
}) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if running standalone
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    // Capture beforeinstallprompt for PWA install trigger
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggle = (key: keyof UserSettings) => {
    const updated = {
      ...localSettings,
      [key]: !localSettings[key]
    };
    setLocalSettings(updated);
    saveUserSettings(updated);
    onUpdateSettings(updated);

    if (key === 'soundBeeps' || key === 'voiceGuidance') {
      soundManager.setSoundSettings(updated.soundBeeps, updated.voiceGuidance);
      if (updated.soundBeeps) {
        soundManager.playCountdownBeep();
      }
    }
  };

  const handleThemeChange = (theme: 'dark' | 'light') => {
    const updated: UserSettings = { ...localSettings, theme };
    setLocalSettings(updated);
    saveUserSettings(updated);
    onUpdateSettings(updated);

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleTestSound = () => {
    soundManager.setSoundSettings(localSettings.soundBeeps, localSettings.voiceGuidance);
    soundManager.playStartWhistle();
    if (localSettings.voiceGuidance) {
      setTimeout(() => {
        soundManager.speak('Audio cue test successful. You are ready to train!');
      }, 350);
    }
  };

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
      }
    } else {
      setShowIOSGuide(true);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-4 pb-28 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-xl animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Screen Title */}
      <div className="mb-5">
        <h1 className="text-2xl font-black text-white font-display">
          Settings & Audio
        </h1>
        <p className="text-xs text-slate-400">
          Personalize timer cues, appearance, and offline storage
        </p>
      </div>

      <div className="space-y-4">
        {/* Audio & Voice Guidance Section */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Audio Cues & Voice
            </span>
            <button
              onClick={handleTestSound}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
            >
              Test Sound
            </button>
          </div>

          <div className="space-y-3">
            {/* Synthesizer Beeps Toggle */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-orange-400">
                  {localSettings.soundBeeps ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5 text-slate-500" />}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    Sound Effects & Beeps
                  </div>
                  <div className="text-xs text-slate-400">
                    Countdown pips, start whistle & victory chimes
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleToggle('soundBeeps')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.soundBeeps ? 'bg-orange-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.soundBeeps ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Voice Guidance Toggle */}
            <div className="flex items-center justify-between py-1 border-t border-slate-800/80 pt-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-orange-400">
                  {localSettings.voiceGuidance ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5 text-slate-500" />}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    Coach Voice Guidance
                  </div>
                  <div className="text-xs text-slate-400">
                    Speaks exercise names, halfway alert & rest cues
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleToggle('voiceGuidance')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.voiceGuidance ? 'bg-orange-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.voiceGuidance ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Timer Defaults */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block mb-3">
            Workout Timers
          </span>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span>Preparation Countdown:</span>
                <span className="font-mono text-orange-400 font-bold">{localSettings.prepDurationSeconds} seconds</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[3, 5, 10].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => {
                      const updated = { ...localSettings, prepDurationSeconds: sec };
                      setLocalSettings(updated);
                      saveUserSettings(updated);
                      onUpdateSettings(updated);
                    }}
                    className={`rounded-xl py-2 text-xs font-semibold transition-all ${
                      localSettings.prepDurationSeconds === sec
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {sec}s Prep
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-3">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span>Default Rest Between Moves:</span>
                <span className="font-mono text-orange-400 font-bold">{localSettings.defaultRestSeconds} seconds</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[15, 20, 30].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => {
                      const updated = { ...localSettings, defaultRestSeconds: sec };
                      setLocalSettings(updated);
                      saveUserSettings(updated);
                      onUpdateSettings(updated);
                    }}
                    className={`rounded-xl py-2 text-xs font-semibold transition-all ${
                      localSettings.defaultRestSeconds === sec
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {sec}s Rest
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Appearance & Theme */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block mb-3">
            Display Theme
          </span>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex items-center justify-center gap-2 rounded-xl p-3 border text-xs font-semibold transition-all ${
                localSettings.theme === 'dark'
                  ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="h-4 w-4" />
              <span>Athletic Dark</span>
            </button>

            <button
              onClick={() => handleThemeChange('light')}
              className={`flex items-center justify-center gap-2 rounded-xl p-3 border text-xs font-semibold transition-all ${
                localSettings.theme === 'light'
                  ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="h-4 w-4" />
              <span>Daylight Clean</span>
            </button>
          </div>
        </div>

        {/* Offline & App Installation */}
        <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-emerald-950/30 to-slate-900 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              100% Offline & Private
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            PulseFit runs entirely on your device with zero server tracking or external database calls. Your workout streak, calories, and logs are preserved in your browser's private local storage.
          </p>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              {isStandalone ? 'Installed as App' : 'Web & Mobile Ready'}
            </div>

            {!isStandalone && (
              <button
                onClick={handleInstallApp}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 text-xs font-bold text-slate-950 transition-colors"
              >
                <Smartphone className="h-4 w-4" />
                <span>Install on Device</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white font-display">
              Install PulseFit on iPhone / iPad
            </h3>
            <div className="mt-3 space-y-2 text-xs text-slate-300">
              <p>1. Tap the <span className="font-semibold text-white">Share</span> button at the bottom of Safari.</p>
              <p>2. Scroll down and select <span className="font-semibold text-white">"Add to Home Screen"</span>.</p>
              <p>3. Tap <span className="font-semibold text-orange-400">"Add"</span> in the top right.</p>
              <p className="text-slate-400 pt-1">PulseFit will launch in full-screen standalone mode with 100% offline access!</p>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 font-semibold text-xs text-white"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
