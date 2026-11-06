import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Award,
  ArrowRight
} from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, theme }) {
  if (!isOpen) return null;

  const isLight = theme === 'light';
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPersonaId, setSelectedPersonaId] = useState('1000294');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const demoCredentials = [
    {
      role: '⚖️ Judge / Evaluator (Creative Pro)',
      email: 'judge@retailrocket.ai',
      pass: 'judge123',
      visitor_id: '1000294'
    },
    {
      role: '🎧 Alex (Audio Enthusiast)',
      email: 'alex@retailrocket.ai',
      pass: 'audio123',
      visitor_id: '1000290'
    },
    {
      role: '💻 David (IT & Computing)',
      email: 'david@retailrocket.ai',
      pass: 'tech123',
      visitor_id: '1000291'
    }
  ];

  const handleDemoLogin = async (cred) => {
    setEmail(cred.email);
    setPassword(cred.pass);
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await loginUser(cred.email, cred.pass);
      if (onAuthSuccess) onAuthSuccess(res.user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await loginUser(email, password);
        if (onAuthSuccess) onAuthSuccess(res.user);
        onClose();
      } else {
        const res = await registerUser(name, email, password, selectedPersonaId);
        if (onAuthSuccess) onAuthSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`rounded-2xl max-w-md w-full shadow-2xl border overflow-hidden transition-all ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0a1630] border-purple-500/30 text-white'
      }`}>
        {/* Modal Header */}
        <div className={`flex items-center justify-between p-5 border-b ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-[#061126]'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-base font-bold font-['Outfit'] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {mode === 'login' ? 'Sign In to RetailRocket' : 'Create Customer Account'}
              </h3>
              <p className="text-[10px] text-purple-500 font-semibold">MERN User Authentication with JWT</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`text-slate-400 hover:text-white text-sm p-1.5 rounded-lg hover:bg-slate-800/40 transition-colors`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Tabs: Sign In / Create Account */}
          <div className={`grid grid-cols-2 p-1 rounded-xl border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-purple-500/20'
          }`}>
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Quick Demo Credentials Box for Judges */}
          {mode === 'login' && (
            <div className={`p-3.5 rounded-xl border space-y-2 ${
              isLight ? 'bg-purple-50/60 border-purple-200' : 'bg-purple-950/20 border-purple-500/30'
            }`}>
              <span className="text-[10px] uppercase font-bold text-purple-600 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> 1-Click Judge & Demo Credentials:
              </span>
              <div className="space-y-1.5">
                {demoCredentials.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDemoLogin(c)}
                    className={`w-full py-1.5 px-2.5 rounded-lg border text-left text-[11px] flex items-center justify-between transition-all ${
                      isLight 
                        ? 'bg-white hover:bg-purple-100/70 border-purple-200 text-slate-800' 
                        : 'bg-[#020817] hover:bg-purple-900/30 border-purple-500/30 text-slate-200'
                    }`}
                  >
                    <span className="font-medium">{c.role}</span>
                    <span className="font-mono text-purple-500 font-bold flex items-center gap-1">
                      Login <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="text-xs font-semibold block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#020817] border-slate-800 text-white'
                    }`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#020817] border-slate-800 text-white'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className={`w-full border rounded-xl pl-9 pr-9 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#020817] border-slate-800 text-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="text-xs font-semibold block mb-1">Shopper Interest Profile</label>
                <select
                  value={selectedPersonaId}
                  onChange={(e) => setSelectedPersonaId(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#020817] border-slate-800 text-white'
                  }`}
                >
                  <option value="1000294">Mac & Creative Pro (MacBook, Monitor, MX Master)</option>
                  <option value="1000290">Audiophile & Tech (Sony XM5, Bose, JBL)</option>
                  <option value="1000291">Workstation & IT Computing (Keychron, Logitech)</option>
                  <option value="1000292">Fitness & Lifestyle (Apple Watch, Nike Air Max)</option>
                  <option value="1000298">Photography & Travel (Canon EOS R6, Backpack)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-50 mt-2"
            >
              {loading 
                ? (mode === 'login' ? 'Signing in...' : 'Creating Account...') 
                : (mode === 'login' ? 'Sign In to Account' : 'Register Customer Account')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

