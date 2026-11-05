import React from 'react';
import { Mic, MicOff, Volume2, User, Bot, Sparkles, Truck, Headphones, Laptop, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VoiceAssistant({ 
  voiceState, 
  transcript, 
  spokenResponse, 
  startListening, 
  stopListening, 
  playResponse,
  processTextCommand,
  theme 
}) {
  const isLight = theme === 'light';
  const isListening = voiceState === 'LISTENING';
  const isProcessing = voiceState === 'PROCESSING';

  const quickPrompts = [
    { label: 'Top recommendations for me', icon: Sparkles },
    { label: 'Show audio & headphones', icon: Headphones },
    { label: 'Recommend laptops & computing', icon: Laptop },
    { label: 'Check delivery & cash on delivery', icon: Truck },
  ];

  const handlePromptClick = (text) => {
    if (processTextCommand) {
      processTextCommand(text);
    }
  };

  return (
    <div className={`border rounded-2xl p-5 shadow-md flex flex-col justify-between h-full min-h-[580px] relative overflow-hidden transition-colors ${
      isLight
        ? 'bg-white border-slate-200'
        : 'bg-[#0a1630]/90 backdrop-blur-xl border-purple-500/20 shadow-2xl'
    }`}>
      <div>
        {/* Header */}
        <div className={`flex items-center justify-between mb-4 pb-3 border-b ${
          isLight ? 'border-slate-200' : 'border-slate-800/60'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isLight ? 'bg-purple-100 text-purple-600' : 'bg-purple-600/20 text-purple-400'
            }`}>
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-sm font-bold font-['Outfit'] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                AI Voice Shopping Assistant
              </h3>
              <p className="text-[10px] text-purple-500 font-semibold">Voice Recommendations & Delivery Tracking</p>
            </div>
          </div>

          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
            isListening
              ? isLight ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-purple-950/60 border-purple-500/40 text-purple-300'
              : isProcessing
              ? isLight ? 'bg-cyan-50 border-cyan-200 text-cyan-700' : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
              : isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              isListening ? 'bg-purple-500 animate-ping' : isProcessing ? 'bg-cyan-500 animate-spin' : 'bg-slate-400'
            }`} />
            {isListening ? 'Listening...' : isProcessing ? 'Analyzing AI...' : 'Ready'}
          </span>
        </div>

        {/* Quick Voice Prompt Suggestions */}
        <div className="space-y-1.5 mb-4">
          <span className={`text-[10px] font-semibold uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Ask or Click a Question:
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {quickPrompts.map((q, idx) => {
              const Icon = q.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePromptClick(q.label)}
                  className={`p-2 rounded-xl border text-[11px] font-medium text-left flex items-center gap-1.5 transition-all ${
                    isLight
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-purple-600'
                      : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span className="line-clamp-1">{q.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Circular Microphone Visualizer */}
        <div className="flex flex-col items-center justify-center my-3">
          <div className="relative flex items-center justify-center w-28 h-28">
            {/* Concentric Pulsing Rings */}
            {isListening && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0.1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full border border-purple-500/40 bg-purple-600/10 pointer-events-none"
                />
                <motion.div
                  animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full border border-indigo-500/30 bg-indigo-600/10 pointer-events-none"
                />
              </>
            )}

            {/* Mic Center Button */}
            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 relative z-10 ${
                isListening
                  ? 'bg-gradient-to-tr from-purple-600 to-rose-600 text-white shadow-purple-600/40 scale-105'
                  : 'bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30'
              }`}
            >
              {isListening ? (
                <MicOff className="w-7 h-7 animate-bounce text-white" />
              ) : (
                <Mic className="w-7 h-7 text-white" />
              )}
            </button>
          </div>

          {/* Waveform graphic */}
          <div className="flex items-center gap-1 h-5 my-2.5">
            {[40, 70, 30, 90, 50, 80, 40, 100, 60, 30, 80, 50, 90, 40].map((height, idx) => (
              <motion.span
                key={idx}
                animate={{
                  height: isListening ? [`${height * 0.2}%`, `${height}%`, `${height * 0.2}%`] : '15%'
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8,
                  delay: idx * 0.05
                }}
                className="w-1 bg-gradient-to-t from-purple-600 to-indigo-500 rounded-full"
              />
            ))}
          </div>

          <p className={`text-[11px] italic text-center ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {isListening ? '"Listening to your query..."' : '"Click mic or prompt to ask AI"'}
          </p>

          <button
            onClick={isListening ? stopListening : startListening}
            className={`mt-3 w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              isListening
                ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-purple-500/30 shadow-md'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-3.5 h-3.5" /> Stop Listening
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" /> Speak with Assistant
              </>
            )}
          </button>
        </div>

        {/* Chat Transcript Panel */}
        <div className={`space-y-2.5 pt-3 border-t text-xs ${isLight ? 'border-slate-200' : 'border-slate-800/60'}`}>
          {/* User Bubble */}
          <div className="flex items-start gap-2.5">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
              isLight ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-600/30 text-blue-400'
            }`}>
              <User className="w-3.5 h-3.5" />
            </div>
            <div className={`border rounded-xl p-2.5 w-full ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#020817] border-blue-500/20 text-slate-300'
            }`}>
              <div className="text-[10px] font-semibold text-indigo-600 mb-0.5">Customer Query</div>
              <p>{transcript || "What products do you recommend for me?"}</p>
            </div>
          </div>

          {/* AI Response Bubble */}
          <div className="flex items-start gap-2.5">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
              isLight ? 'bg-purple-100 text-purple-600' : 'bg-purple-600/30 text-purple-400'
            }`}>
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className={`border rounded-xl p-2.5 w-full ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#020817] border-purple-500/20 text-slate-300'
            }`}>
              <div className="text-[10px] font-semibold text-purple-600 mb-0.5">AI Recommendation Voice</div>
              <p className="leading-relaxed text-[11px]">
                {spokenResponse || "Based on your browsing activity, I recommend items matched to your interaction score. Free delivery and Cash on Delivery are available on all items."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Play Response Action */}
      {spokenResponse && (
        <button
          onClick={playResponse}
          className={`w-full mt-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            isLight
              ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
              : 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border-purple-500/30'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Replay Spoken Voice</span>
        </button>
      )}
    </div>
  );
}
