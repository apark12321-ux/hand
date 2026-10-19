import React from 'react';
import { Download } from 'lucide-react';

interface TopBarProps {
  activeTab: 'simulator' | 'architecture' | 'android' | 'backend' | 'database';
  setActiveTab: (tab: 'simulator' | 'architecture' | 'android' | 'backend' | 'database') => void;
  onExportAll: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ activeTab, setActiveTab, onExportAll }) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark */}
      <div 
        onClick={() => setActiveTab('simulator')}
        className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
      >
        <span className="text-amber-400 font-extrabold tracking-wider">손금사주</span>
        <span className="text-xs text-slate-400 font-normal border-l border-slate-700 pl-2">Palm & Saju Architecture</span>
      </div>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
            activeTab === 'simulator' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
          }`}
        >
          모바일 시뮬레이터
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
            activeTab === 'architecture' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
          }`}
        >
          아키텍처 설계도
        </button>
        <button
          onClick={() => setActiveTab('android')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
            activeTab === 'android' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
          }`}
        >
          안드로이드 코드
        </button>
        <button
          onClick={() => setActiveTab('backend')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
            activeTab === 'backend' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
          }`}
        >
          파이썬 백엔드
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
            activeTab === 'database' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
          }`}
        >
          보안 & DB
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onExportAll}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-amber-400/20 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>전체 소스코드 다운로드</span>
        </button>
      </div>
    </header>
  );
};
