import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Loader2, AlertCircle, Activity, ShieldCheck, Info, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // If redirected here by RequireAuth, go back to the page they were trying to reach
  const from = (location.state as { from?: string })?.from || '/dashboard';
  const wasRedirected = !!(location.state as { from?: string })?.from;

  // Detect Supabase OTP / invite-link errors surfaced in the URL hash.
  // Supabase appends error params like: #error=access_denied&error_code=otp_expired
  // The HashRouter sees these as part of the hash and passes them through.
  const hashParams = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.hash.replace(/^#\/?[^?]*\?/, '') : ''
  );
  const otpError = hashParams.get('error') === 'access_denied' ||
    hashParams.get('error_code') === 'otp_expired' ||
    from.toLowerCase().includes('otp_expired') ||
    from.toLowerCase().includes('access_denied');

  // Human-readable page name — only shown when it's a real page redirect, not an error
  const redirectedPageName = !otpError
    ? from
        .replace('#/', '')
        .replace('/', '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()) || 'your page'
    : '';

  const [email, setEmail] = useState(() => {
    // BUG-518-12: Pre-populate email from localStorage on return visits.
    // Practitioner B2B context only — not patient PHI.
    return localStorage.getItem('ppn_last_email') || '';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        // BUG-518-12: Persist email for pre-population on next visit.
        localStorage.setItem('ppn_last_email', email);
        // Navigate to the originally requested page (or /search as fallback).
        // AuthContext.onAuthStateChange handles invite/recovery redirects.
        // For normal logins, this navigate() is the sole routing action.
        navigate(from, { replace: true });
      } else {
        // Session is null with no error — rare Supabase edge case
        setError('Login succeeded but no session was created. Please try again.');
        setLoading(false);
      }

    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/#/reset-password`,
      });

      if (error) throw error;

      setResetSuccess(true);
      setTimeout(() => {
        setShowResetModal(false);
        setResetSuccess(false);
        setResetEmail('');
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-start sm:justify-center py-8 px-4 relative overflow-x-hidden"
      style={{ paddingTop: 'max(2rem, env(safe-area-inset-top))', paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
    >

      {/* Background orbs — deeper, matching Pricing dark base */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-indigo-900/15 rounded-full blur-[140px] opacity-50" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-indigo-900/10 rounded-full blur-[140px] opacity-35" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-900/8 rounded-full blur-[100px] opacity-20" />
      </div>

      <div className="w-full max-w-md mx-auto relative z-10">

        {/* OTP / invite link expired error */}
        {otpError && (
          <div className="mb-5 flex items-start gap-3 px-4 py-3 bg-red-500/10 border border-red-500/25 rounded-2xl">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-300">Invite link expired</p>
              <p className="text-sm text-red-400/80 mt-0.5">
                This invite link is no longer valid. Please contact your PPN administrator for a new invitation.
              </p>
            </div>
          </div>
        )}

        {/* Redirect context banner — only shown for valid page redirects */}
        {wasRedirected && !otpError && (
          <div className="mb-5 flex items-start gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-300/90">
              Sign in to continue to <span className="font-bold">{redirectedPageName}</span>.
            </p>
          </div>
        )}

        {/* Back to Home */}
        <button
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors group"
        >
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="text-sm font-bold uppercase tracking-widest">Back to Home</span>
        </button>

        {/* Logo / Branding — Pricing style */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-4 mb-5">
            <div className="w-14 h-14 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-900/30">
              <Activity className="text-indigo-400 w-7 h-7" />
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-300">
            PPN <span className="text-primary">Portal</span>
          </h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">
            Secure Clinical Intelligence Network
          </p>
        </div>

        {/* Card — Pricing aesthetic: rounded-[2.5rem], glow ring */}
        <div className="relative">
          {/* Indigo glow ring */}
          <div className="absolute -inset-0.5 bg-indigo-500/10 blur-md opacity-60 rounded-[2.5rem]" />

          <div className="relative bg-[#1c222d]/50 border border-slate-800 rounded-[2.5rem] p-6 sm:p-10 backdrop-blur-sm">
            <form onSubmit={handleLogin} className="space-y-6">

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="login-email" className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 bg-[#0c0f14] border border-slate-700/50 rounded-xl text-slate-300 placeholder-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="login-password" className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-3.5 pr-12 bg-[#0c0f14] border border-slate-700/50 rounded-xl text-slate-300 placeholder-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-sm font-black rounded-2xl uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Forgot password — below Sign In, centered (better tab order) */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => { setShowResetModal(true); setError(null); }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
                >
                  Forgot Password?
                </button>
              </div>


              {/* Invitation-only notice — replaces dead Sign Up link (BUG-518-03) */}
              <div className="text-center pt-2 border-t border-slate-800/60">
                <p className="text-sm text-slate-500 font-medium">
                  PPN Portal is{' '}
                  <span className="text-slate-400 font-bold">invitation-only.</span>
                </p>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Access is granted by your PPN administrator via email invitation.
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-600 text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-black uppercase tracking-widest">HIPAA Compliant • End-to-End Encrypted</span>
        </div>
      </div >

      {/* Password Reset Modal — upgraded to match new card style */}
      {
        showResetModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-0.5 bg-indigo-500/10 blur-md opacity-60 rounded-[2.5rem]" />
              <div className="relative bg-[#1c222d]/80 border border-slate-800 rounded-[2.5rem] p-8 sm:p-10 backdrop-blur-sm">
                <button
                  onClick={() => {
                    setShowResetModal(false);
                    setResetEmail('');
                    setError(null);
                    setResetSuccess(false);
                  }}
                  className="absolute top-6 right-6 p-2 hover:bg-slate-800/60 rounded-xl text-slate-500 hover:text-slate-300 transition-all"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>

                <h2 className="text-3xl font-black tracking-tighter text-slate-300 mb-1">Reset Password</h2>
                <p className="text-sm text-slate-500 font-medium mb-8 uppercase tracking-widest">
                  We'll send a secure link to your email.
                </p>

                {resetSuccess ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-emerald-400 font-bold">Check your email!</p>
                      <p className="text-sm text-emerald-400/80 mt-1">
                        Password reset instructions sent to {resetEmail}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordReset} className="space-y-5">
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}

                    <div>
                      <label htmlFor="reset-email" className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                        Email Address
                      </label>
                      <input
                        id="reset-email"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full px-5 py-3.5 bg-[#0c0f14] border border-slate-700/50 rounded-xl text-slate-300 placeholder-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                        placeholder="your@email.com"
                        required
                        disabled={resetLoading}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-300 text-sm font-black rounded-2xl uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                    >
                      {resetLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Login;

