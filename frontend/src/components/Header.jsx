import React from 'react';
import { Wifi, WifiOff, Sun, Moon, ChevronDown } from 'lucide-react';

export default function Header({ apiConnected, theme, setTheme }) {
  const isLight = theme === 'light';

  return (
    <header className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b transition-colors ${
      isLight ? 'border-slate-200' : 'border-purple-500/10'
    }`}>
      <div>
        <h1 className={`text-2xl font-extrabold font-['Outfit'] tracking-tight flex items-center gap-2 ${
          isLight ? 'text-slate-900' : 'text-white'
        }`}>
          AI Product Recommendation{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500">
            System
          </span>
        </h1>
        <p className={`text-xs max-w-2xl mt-1 leading-relaxed ${
          isLight ? 'text-slate-600' : 'text-slate-400'
        }`}>
          Personalized product suggestions based on real customer interaction behavior from the RetailRocket e-commerce dataset.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Light / Dark Theme Toggle Button */}
        <button
          onClick={() => setTheme(isLight ? 'dark' : 'light')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
            isLight
              ? 'bg-white border-slate-300 text-slate-700 shadow-sm hover:bg-slate-50'
              : 'bg-[#0a1630] border-purple-500/30 text-purple-300 hover:bg-purple-950/40'
          }`}
          title="Toggle Light / Dark Mode"
        >
          {isLight ? (
            <>
              <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-purple-400 fill-purple-400" />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        {/* API Connected Indicator */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
          apiConnected
            ? isLight
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
              : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
            : isLight
              ? 'bg-rose-50 border-rose-300 text-rose-700'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
        }`}>
          <span className="relative flex h-2 w-2">
            {apiConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${apiConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          </span>
          <span className="text-[11px] font-semibold">
            {apiConnected ? 'API Connected' : 'API Offline'}
          </span>
        </div>

        {/* Visitor Profile */}
        <div className={`flex items-center gap-2.5 pl-3 border-l ${
          isLight ? 'border-slate-300' : 'border-slate-800'
        }`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
            JD
          </div>
          <div className="hidden sm:block text-left">
            <div className={`text-xs font-semibold leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              John Doe
            </div>
            <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Visitor Profile
            </div>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
        </div>
      </div>
    </header>
  );
}
