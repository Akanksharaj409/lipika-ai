import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, Building, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import KeycapOrb, { type Keycap } from '../components/ui/keycap-orb';

// User-specified keycap array with design-tool legends and finishes
const keys: Keycap[] = [
  { label: "Aa", finish: "lime", hotkey: "a" },
  { icon: "pen", finish: "ash" },
  { icon: "frame", finish: "ink" },
  { icon: "layers", finish: "ash" },
  { icon: "cursor", finish: "glass" },
  { icon: "star", finish: "cobalt" },
  { label: "Fx", finish: "ink", hotkey: "f" },
  { icon: "heart", finish: "glass" },
  { label: "⌘", finish: "ash" },
  { icon: "search", finish: "ink" },
  { label: "UI", finish: "cobalt", hotkey: "u" },
  { icon: "check", finish: "ash" },
  { icon: "none", finish: "ink" },
  { icon: "arrow", finish: "ash" },
  { icon: "cube", finish: "glass" },
  { label: "Px", finish: "ink", hotkey: "p" },
];

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [paletteMode, setPaletteMode] = useState<'warm' | 'mono'>('mono');
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [role, setRole] = useState('Epigraphical Researcher');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate authentication latency
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('lipika_auth_user', JSON.stringify({
        email: email || 'researcher@lipika.ai',
        name: fullName || 'Dr. K. Sharma',
        role: role,
        institution: institution || 'Archaeological Survey of India',
      }));
      navigate('/dashboard');
    }, 600);
  };

  const handleGuestAccess = () => {
    localStorage.setItem('lipika_auth_user', JSON.stringify({
      email: 'evaluator@hackathon.edu',
      name: 'Hackathon Evaluator',
      role: 'Project Judge / Peer Reviewer',
      institution: 'Independent Epigraphical Evaluation Board',
    }));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col lg:flex-row select-none">
      
      {/* LEFT PANEL: Interactive 3D Keycap Orb Studio */}
      <div className="relative w-full lg:w-1/2 min-h-[420px] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-zinc-900 bg-zinc-950/60 overflow-hidden">
        
        {/* Top Header info */}
        <div className="z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center font-serif text-lg font-bold text-white group-hover:border-zinc-500 transition-colors">
              𑀮
            </div>
            <div>
              <span className="font-semibold text-sm tracking-wide text-white block">
                LIPIKA AI
              </span>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 block -mt-0.5">
                WORKSPACE TERMINAL
              </span>
            </div>
          </Link>

          {/* Keycap Colorway Switcher (Warm Archeological Ember vs High-Contrast Monochrome) */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg border border-zinc-800 bg-zinc-900/80 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => setPaletteMode('mono')}
              className={`px-2 py-0.5 rounded transition-colors ${
                paletteMode === 'mono' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Monochrome
            </button>
            <button
              type="button"
              onClick={() => setPaletteMode('warm')}
              className={`px-2 py-0.5 rounded transition-colors ${
                paletteMode === 'warm' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Ember
            </button>
          </div>
        </div>

        {/* Central 3D Canvas */}
        <div className="relative w-full h-[320px] lg:h-[500px] flex items-center justify-center my-auto">
          {paletteMode === 'warm' ? (
            <KeycapOrb
              keys={keys}
              rings={11}
              background="#070302"
              glow="#ff5a1f"
              speed={-0.7}
              palette={{
                ink: { cap: "#201a17", legend: "#f1e4d3" },
                ash: { cap: "#e7dccb", legend: "#5a2a14" },
                cobalt: { cap: "#c4552b", legend: "#6e2208" },
                lime: { cap: "#f2b33d", legend: "#3b2205" },
                glass: { cap: "#ffd0b0", legend: "#ff6a2a" },
              }}
              className="w-full h-full"
            />
          ) : (
            <KeycapOrb
              keys={keys}
              rings={11}
              background="#050505"
              glow="#ffffff"
              speed={-0.6}
              palette={{
                ink: { cap: "#141416", legend: "#f4f4f5" },
                ash: { cap: "#27272a", legend: "#e4e4e7" },
                cobalt: { cap: "#3f3f46", legend: "#ffffff" },
                lime: { cap: "#52525b", legend: "#ffffff" },
                glass: { cap: "#71717a", legend: "#09090b" },
              }}
              className="w-full h-full"
            />
          )}

          {/* Interactive Hint */}
          <div className="absolute bottom-2 inset-x-0 text-center pointer-events-none">
            <span className="text-[11px] font-mono tracking-wider text-zinc-400 bg-black/60 px-3 py-1 rounded-full border border-zinc-800/80 backdrop-blur-md">
              [ Drag to spin sphere · Press any key on your keyboard to ripple ]
            </span>
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="z-10 grid grid-cols-3 gap-2 text-center text-[11px] font-mono text-zinc-400 border-t border-zinc-900 pt-3">
          <div className="p-2 rounded bg-zinc-900/40 border border-zinc-900">
            <span className="block text-white font-semibold">2,400+</span>
            <span>Brahmi Glyphs</span>
          </div>
          <div className="p-2 rounded bg-zinc-900/40 border border-zinc-900">
            <span className="block text-white font-semibold">FastAPI</span>
            <span>Neural Inference</span>
          </div>
          <div className="p-2 rounded bg-zinc-900/40 border border-zinc-900">
            <span className="block text-white font-semibold">TEI-XML</span>
            <span>Archival Standard</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Authentication Form Terminal */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 bg-black">
        <div className="w-full max-w-md space-y-6">
          
          {/* Form Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-zinc-800 bg-zinc-900 text-[10px] font-mono uppercase tracking-widest text-zinc-300">
              <ShieldCheck className="w-3 h-3 text-white" />
              Epigraphical Research Access
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              {mode === 'signin' ? 'Sign in to Research Lab' : 'Create Researcher Account'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              {mode === 'signin'
                ? 'Enter your institutional credentials or continue as evaluator.'
                : 'Join the scholarly transcription and transliteration repository.'}
            </p>
          </div>

          {/* Quick 1-Click Guest Access / Evaluator Demo */}
          <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Evaluator / Guest Access</span>
                <span className="text-[10px] font-mono text-zinc-400 block">Instant 1-click workspace demo</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGuestAccess}
              className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 text-xs font-semibold tracking-wide transition-all active:scale-[0.98] shadow-sm flex items-center gap-1 shrink-0"
            >
              Demo Mode
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-zinc-800 w-full" />
            <span className="bg-black px-3 text-[11px] font-mono uppercase tracking-widest text-zinc-400 absolute">
              or credentials
            </span>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`py-2 rounded-lg transition-all ${
                mode === 'signin' ? 'bg-white text-black font-semibold shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`py-2 rounded-lg transition-all ${
                mode === 'signup' ? 'bg-white text-black font-semibold shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                    Full Name & Title
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Dr. A. Cunningham"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 pl-9 text-xs sm:text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                      Institution / University
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="e.g. ASI / IIT / JNU"
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 pl-9 text-xs sm:text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                      Research Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs sm:text-sm text-white focus:border-white focus:outline-none transition-colors"
                    >
                      <option value="Epigraphical Researcher">Epigraphist</option>
                      <option value="Archaeologist">Archaeologist</option>
                      <option value="Historian / Philologist">Linguist / Philologist</option>
                      <option value="Machine Learning Specialist">ML Researcher</option>
                      <option value="Archival Student">Archival Student</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                Academic or Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@university.edu"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 pl-9 text-xs sm:text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to institutional email.')}
                    className="text-[11px] font-mono text-zinc-400 hover:text-white transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 pl-9 pr-9 text-xs sm:text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signin' && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-950 text-white focus:ring-0"
                />
                <label htmlFor="remember" className="text-xs text-zinc-400 cursor-pointer">
                  Keep active research session on this device
                </label>
              </div>
            )}

            {mode === 'signup' && (
              <div className="flex items-start gap-2 pt-1 text-[11px] text-zinc-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-300 shrink-0 mt-0.5" />
                <span>
                  I agree to scholarly data attribution and research ethics guidelines for digital epigraphy preservation.
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-white py-3 text-sm font-semibold text-black hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99] shadow-md shadow-white/5"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In to Workspace' : 'Register Research Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Institutional SSO & Archival Federation */}
          <div className="pt-2 border-t border-zinc-900 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 block text-center">
              Institutional Federation
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={handleGuestAccess}
                className="py-2 px-3 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 hover:text-white transition-colors text-center font-mono text-[11px]"
              >
                ORCID / Academic ID
              </button>
              <button
                type="button"
                onClick={handleGuestAccess}
                className="py-2 px-3 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 hover:text-white transition-colors text-center font-mono text-[11px]"
              >
                GitHub Developer
              </button>
            </div>
          </div>

          {/* Footer Navigation Link */}
          <div className="text-center pt-2">
            <Link
              to="/"
              className="text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              ← Back to Project Overview
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Auth;
