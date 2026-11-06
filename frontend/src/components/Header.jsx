import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Sun, 
  Moon, 
  ChevronDown, 
  Database, 
  Cpu, 
  ShieldCheck, 
  User, 
  LogIn, 
  LogOut, 
  Award,
  Sparkles,
  ShoppingCart
} from 'lucide-react';

export default function Header({ 
  apiConnected, 
  theme, 
  setTheme, 
  currentUser, 
  onOpenAuthModal, 
  onLogout,
  cartCount = 0,
  onOpenCart
}) {
  const isLight = theme === 'light';
  const [menuOpen, setMenuOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'RR';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <header className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b transition-colors relative ${
      isLight ? 'border-slate-200' : 'border-purple-500/10'
    }`}>
      <div>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm">
            MERN Stack Production
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center gap-1">
            <Database className="w-3 h-3" /> MongoDB Connected
          </span>
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 items-center gap-1">
            <Cpu className="w-3 h-3" /> Truncated SVD AI
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> JWT Auth Active
          </span>
        </div>
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
          Personalized product suggestions based on customer interaction behavior from the RetailRocket e-commerce dataset.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Shopping Cart Button with Count Badge */}
        <button
          onClick={onOpenCart}
          className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
            cartCount > 0
              ? 'bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-purple-500/50 text-purple-400 hover:border-purple-500 shadow-sm'
              : isLight
              ? 'bg-white border-slate-300 text-slate-700 shadow-sm hover:bg-slate-50'
              : 'bg-[#0a1630] border-purple-500/30 text-purple-300 hover:bg-purple-950/40'
          }`}
          title="Open Shopping Cart"
        >
          <ShoppingCart className="w-4 h-4 text-purple-500" />
          <span className="hidden sm:inline">Cart</span>
          {cartCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[10px] font-extrabold shadow-sm animate-pulse">
              {cartCount}
            </span>
          )}
        </button>

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
            {apiConnected 
              ? (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'Server Active (:5000)' : 'Cloud API Active') 
              : 'Connecting API...'}
          </span>
        </div>

        {/* User Account / Auth Section */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl border transition-all ${
                isLight 
                  ? 'border-purple-200 bg-purple-50/50 hover:bg-purple-100/60' 
                  : 'border-purple-500/30 bg-[#0a1630] hover:bg-purple-950/40'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
                {getInitials(currentUser.name)}
              </div>
              <div className="hidden sm:block text-left">
                <div className={`text-xs font-semibold leading-tight flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <span>{currentUser.name}</span>
                  {currentUser.role === 'judge' && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-500 border border-amber-500/30 font-bold">
                      JUDGE
                    </span>
                  )}
                </div>
                <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Visitor #{currentUser.visitor_id || '1000294'}
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${menuOpen ? 'rotate-180' : ''} ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`} />
            </button>

            {/* Profile Dropdown */}
            {menuOpen && (
              <div className={`absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl border p-3 z-50 animate-in fade-in-50 zoom-in-95 ${
                isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0f172a] border-purple-500/30 text-white'
              }`}>
                <div className="pb-2 mb-2 border-b border-purple-500/10">
                  <p className="text-xs font-bold">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-purple-400 font-medium">
                    <Award className="w-3 h-3" />
                    <span>Role: {currentUser.role?.toUpperCase()} (ID: {currentUser.visitor_id})</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenAuthModal();
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
                      isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-purple-400" /> Switch Account / Demo Judge
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md hover:shadow-purple-500/25 transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </header>
  );
}
