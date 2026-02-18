import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Loader2, AlertCircle, Activity, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        navigate('/dashboard');
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
        redirectTo: `${window.location.origin}/reset-password`,
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
    <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] opacity-30"></div>
      </div>

      <div className="w-full max-w-md relative z-10">

        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-slate-300 hover:text-slate-300 transition-colors group"
        >
          <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="text-sm font-bold">Back to Home</span>
        </button>

        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Activity className="text-slate-300 w-7 h-7" />
            </div>
            <h1 className="text-3xl font-black text-slate-300 tracking-tight">PPN Portal</h1>
          </div>
          <p className="text-slate-300 text-sm">Secure clinical intelligence network</p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleLogin} className="space-y-6">

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="your@email.com"
                required
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-300 font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
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

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-slate-800">
              <p className="text-sm text-slate-300">
                Don't have an account?{' '}
                <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>HIPAA Compliant • End-to-End Encrypted</span>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => {
                setShowResetModal(false);
                setResetEmail('');
                setError(null);
                setResetSuccess(false);
              }}
              className="absolute top-4 right-4 text-slate-300 hover:text-slate-300 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h2 className="text-2xl font-black text-slate-300 mb-2">Reset Password</h2>
            <p className="text-sm text-slate-300 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {resetSuccess ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-green-400 font-bold">Check your email!</p>
                  <p className="text-sm text-green-400/80 mt-1">
                    We've sent password reset instructions to {resetEmail}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="your@email.com"
                    required
                    disabled={resetLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-300 font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
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
      )}
    </div>
  );
};

export default Login;
