import React from 'react';
import { Mic, MicOff, Volume2, User, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VoiceAssistant({ 
  voiceState, 
  transcript, 
  spokenResponse, 
  startListening, 
  stopListening, 
  playResponse,
  theme 
}) {
  const isLight = theme === 'light';
  const isListening = voiceState === 'LISTENING';
  const isProcessing = voiceState === 'PROCESSING';

  return (
    <div className={`border rounded-2xl p-5 shadow-md flex flex-col justify-between h-full min-h-[580px] relative overflow-hidden transition-colors ${
      isLight
        ? 'bg-white border-slate-200'
        : 'bg-[#0a1630]/90 backdrop-blur-xl border-purple-500/20 shadow-2xl'
    }`}>
      <div>
        {/* Header */}
        <div className={`flex items-center justify-between mb-6 pb-3 border-b ${
          isLight ? 'border-slate-200' : 'border-slate-800/60'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isLight ? 'bg-purple-100 text-purple-600' : 'bg-purple-600/20 text-purple-400'
            }`}>
              <Mic className="w-4 h-4" />
            </div>
            <h3 className={`text-sm font-bold font-['Outfit'] ${isLight ? 'text-slate-900' : 'text-white'}`}>
              AI Voice Assistant
            </h3>
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
            {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Idle'}
          </span>
        </div>

        {/* Circular Microphone Visualizer */}
        <div className="flex flex-col items-center justify-center my-6">
          <div className="relative flex items-center justify-center w-36 h-36">
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
              className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 relative z-10 ${
                isListening
                  ? 'bg-gradient-to-tr from-purple-600 to-rose-600 text-white shadow-purple-600/40 scale-105'
                  : 'bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30'
              }`}
            >
              {isListening ? (
                <MicOff className="w-9 h-9 animate-bounce text-white" />
              ) : (
                <Mic className="w-9 h-9 text-white" />
              )}
            </button>
          </div>

          {/* Waveform graphic */}
          <div className="flex items-center gap-1 h-6 my-4">
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

          <p className={`text-xs italic text-center ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {isListening ? '"Listening to your query..."' : '"What products should I buy?"'}
          </p>

          <button
            onClick={isListening ? stopListening : startListening}
            className={`mt-4 w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              isListening
                ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-purple-500/30'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-3.5 h-3.5" /> Stop Listening
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" /> Start Listening
              </>
            )}
          </button>
        </div>

        {/* Chat Transcript Panel */}
        <div className={`space-y-3 pt-3 border-t text-xs ${isLight ? 'border-slate-200' : 'border-slate-800/60'}`}>
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
              <div className="text-[10px] font-semibold text-indigo-600 mb-0.5">You</div>
              <p>{transcript || "What products should I buy?"}</p>
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
              <div className="text-[10px] font-semibold text-purple-600 mb-0.5">AI Assistant</div>
              <p className="leading-relaxed">
                {spokenResponse || "Based on your previous shopping activity, I recommend items generated specifically for your interaction pattern."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Play Response Action */}
      {spokenResponse && (
        <button
          onClick={playResponse}
          className={`w-full mt-4 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            isLight
              ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
              : 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border-purple-500/30'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Play Response</span>
        </button>
      )}
    </div>
  );
}
