import React from 'react';
import { Layers, Wand2, Sparkles, Download, HelpCircle, Coffee, Shirt } from 'lucide-react';

interface HeaderProps {
  activeTab: 'studio' | 'editor' | 'pro';
  setActiveTab: (tab: 'studio' | 'editor' | 'pro') => void;
  onExport?: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onExport,
  onOpenHelp,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('studio')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <div className="flex items-center -space-x-1">
                <Coffee className="w-4 h-4 text-amber-400" />
                <Shirt className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                MockupCraft
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                AI Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Logo Mockup Placer & AI Generator</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'studio'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Mockup Placer</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'editor'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Wand2 className="w-4 h-4 text-violet-300" />
            <div className="text-left flex items-center gap-1.5">
              <span>AI Create & Edit</span>
              <span className="hidden md:inline-block text-[9px] font-mono px-1 py-0.2 bg-violet-950/70 border border-violet-700/50 rounded text-violet-300">
                Flash
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('pro')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'pro'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <div className="text-left flex items-center gap-1.5">
              <span>Pro HD Generator</span>
              <span className="hidden md:inline-block text-[9px] font-mono px-1 py-0.2 bg-amber-950/70 border border-amber-700/50 rounded text-amber-300">
                1K-4K
              </span>
            </div>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {activeTab === 'studio' && onExport && (
            <button
              onClick={onExport}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export PNG</span>
            </button>
          )}

          <button
            onClick={onOpenHelp}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Help & Guides"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
