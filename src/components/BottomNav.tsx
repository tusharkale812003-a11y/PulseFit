import React from 'react';
import { Dumbbell, Compass, TrendingUp, Sliders } from 'lucide-react';

export type TabType = 'home' | 'explore' | 'progress' | 'settings';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Workouts', icon: Dumbbell },
    { id: 'explore' as TabType, label: 'Explore', icon: Compass },
    { id: 'progress' as TabType, label: 'Progress', icon: TrendingUp },
    { id: 'settings' as TabType, label: 'Settings', icon: Sliders },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-800/90 bg-slate-950/95 backdrop-blur-md pb-safe select-none">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex min-h-[48px] min-w-[56px] flex-col items-center justify-center rounded-xl transition-all ${
                isActive ? 'text-orange-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label={tab.label}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-orange-400" />
                )}
              </div>
              <span className="mt-1 text-[10px] tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
