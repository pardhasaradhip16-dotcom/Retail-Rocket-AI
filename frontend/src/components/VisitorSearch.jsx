import React from 'react';
import { User, Sparkles, Mic, RefreshCw } from 'lucide-react';

export default function VisitorSearch({ 
  visitorId, 
  setVisitorId, 
  onSearch, 
  onVoiceClick, 
  onGenerateNew, 
  loading,
  theme 
}) {
  const isLight = theme === 'light';

  const quickVisitors = [
    { id: '1000290', label: '1000290 (Tech Audio)' },
    { id: '1000291', label: '1000291 (Computing)' },
    { id: '1000292', label: '1000292 (Lifestyle)' },
    { id: '1000294', label: '1000294 (Mac & Desk)' },
    { id: '1000298', label: '1000298 (Photography)' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (visitorId && visitorId.trim()) {
      onSearch(visitorId.trim());
    }
  };

  const handleSelectQuick = (id) => {
    setVisitorId(id);
    onSearch(id);
  };

  return (
    <div className={`rounded-2xl p-4 md:p-5 my-6 shadow-md transition-colors ${
      isLight
        ? 'bg-white border border-slate-200'
        : 'bg-[#0a1630]/90 backdrop-blur-xl border border-purple-500/20 shadow-xl'
    }`}>
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Left: Input section */}
        <div className="flex-1 space-y-1.5">
          <label className={`text-xs font-semibold flex items-center gap-1.5 ${
            isLight ? 'text-slate-700' : 'text-slate-300'
          }`}>
            <User className="w-3.5 h-3.5 text-purple-600" /> Enter Visitor ID
          </label>
          <div className="relative">
            <input
              type="text"
              value={visitorId}
              onChange={(e) => setVisitorId(e.target.value)}
              placeholder="e.g. 1000290, 1000291, 1000294"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white'
                  : 'bg-[#020817] border-purple-500/30 text-white placeholder-slate-500'
              }`}
            />
          </div>

          {/* Quick Click Visitor Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Quick Select:</span>
            {quickVisitors.map(v => (
              <button
                key={v.id}
                type="button"
                onClick={() => handleSelectQuick(v.id)}
                className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-md border transition-all ${
                  visitorId === v.id
                    ? 'bg-purple-600 text-white border-purple-600'
                    : isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1 lg:pt-3">
          {/* Main Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-md shadow-purple-600/30 active:scale-98 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Fetching...' : 'Get Recommendations'}</span>
          </button>

          {/* Quick Actions */}
          <button
            type="button"
            onClick={onVoiceClick}
            className={`flex items-center gap-1.5 border text-xs font-semibold px-3.5 py-3 rounded-xl transition-all ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                : 'bg-[#0d1b3e] hover:bg-[#12234f] text-slate-300 hover:text-white border-purple-500/20'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-purple-600" />
            <span>Voice Assistant</span>
          </button>

          <button
            type="button"
            onClick={onGenerateNew}
            className={`flex items-center gap-1.5 border text-xs font-semibold px-3.5 py-3 rounded-xl transition-all ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                : 'bg-[#0d1b3e] hover:bg-[#12234f] text-slate-300 hover:text-white border-purple-500/20'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-600" />
            <span>Random Visitor</span>
          </button>
        </div>

      </form>
    </div>
  );
}
