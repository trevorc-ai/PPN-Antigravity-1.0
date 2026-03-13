import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Loader2, Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [validToken, setValidToken] = useState(false);

    useEffect(() => {
        // ── Manual Token Exchange ─────────────────────────────────────────────
        // PPN uses HashRouter, so `detectSessionInUrl` is set to `false` in
        // supabaseClient.ts (Supabase would otherwise conflict with hash routing).
        // This means we MUST manually parse the URL and exchange the token here.
        //
        // Two token formats are handled:
        //   1. PKCE flow (new): URL contains `?code=xxx` — exchangeCodeForSession()
        //   2. Legacy implicit (old reset emails): URL contains `#access_token=xxx`
        // ─────────────────────────────────────────────────────────────────────────

        const doTokenExchange = async () => {
            // Check for PKCE authorization code in the URL query string
            const searchParams = new URLSearchParams(window.location.search);
            const code = searchParams.get('code');

            // Check for legacy implicit token in the URL hash
            // The hash format is: /#/reset-password#access_token=xxx&refresh_token=yyy
            // Or: /#access_token=xxx (when Supabase uses hash routing)
            const fullHash = window.location.hash;
            // Strip the route prefix (#/reset-password) to get only the params portion
            const hashParamStr = fullHash.includes('access_token')
                ? fullHash.substring(fullHash.indexOf('access_token') - 0)
                : '';
            const hashParams = new URLSearchParams(hashParamStr);
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');

            if (code) {
                // PKCE flow — exchange authorization code for session
                const { data, error } = await supabase.auth.exchangeCodeForSession(code);
                if (error) {
                    setError('Invalid or expired recovery link. Please request a new one.');
                } else if (data.session) {
                    setValidToken(true);
                    // Clean the code from the URL to prevent re-use on refresh
                    window.history.replaceState(null, '', window.location.pathname + '#/reset-password');
                }
            } else if (accessToken && refreshToken) {
                // Legacy implicit flow — set session directly from token pair
                const { data, error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                });
                if (error) {
                    setError('Invalid or expired recovery link. Please request a new one.');
                } else if (data.session) {
                    setValidToken(true);
                    window.history.replaceState(null, '', window.location.pathname + '#/reset-password');
                }
            } else {
                // No token in URL — check if user already has a valid session
                // (handles page refresh after a successful token exchange)
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    setValidToken(true);
                } else {
                    setError('No recovery token found. Please request a new password reset link.');
                }
            }
        };

        doTokenExchange();

        // Backup listener: catches PASSWORD_RECOVERY event if AuthContext
        // triggers a redirect here after detecting the event.
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                // PASSWORD_RECOVERY: explicit recovery event — always valid
                if (event === 'PASSWORD_RECOVERY' && session) {
                    setValidToken(true);
                }
                // NOTE: SIGNED_IN is NOT treated as valid here.
                // Normal logins never land on this page (AuthContext no longer
                // redirects SIGNED_IN events unless last_sign_in_at is null).
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const validatePassword = (pwd: string): string | null => {
        if (pwd.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/[A-Z]/.test(pwd)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/[a-z]/.test(pwd)) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!/[0-9]/.test(pwd)) {
            return 'Password must contain at least one number';
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const passwordError = validatePassword(password);
        if (passwordError) { setError(passwordError); return; }
        if (password !== confirmPassword) { setError('Passwords do not match'); return; }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;

            // Detect invited users by presence of invite metadata
            const { data: { user } } = await supabase.auth.getUser();
            const meta = user?.user_metadata ?? {};
            const isInvited = !!meta.invited_first_name;

            setSuccess(true);

            if (isInvited) {
                // ── VIP Invite path ─────────────────────────────────────────
                // User already has a Supabase account (created by the Edge Fn).
                // Provision their profile + solo workspace here, then go straight
                // to the dashboard — no signup wizard, no second email/password.
                const firstName = (meta.invited_first_name as string) || '';
                const lastName  = (meta.invited_last_name  as string) || '';

                await supabase.from('log_user_profiles').upsert({
                    user_id:         user!.id,
                    user_first_name: firstName,
                    user_last_name:  lastName,
                });

                const { data: site } = await supabase
                    .from('log_sites')
                    .insert([{ site_name: `${firstName}'s Workspace`, is_active: true }])
                    .select('site_id')
                    .single();

                if (site) {
                    await supabase.from('log_user_sites').insert({
                        user_id:   user!.id,
                        site_id:   site.site_id,
                        role:      'clinician',
                        is_active: true,
                    });
                }

                setTimeout(() => navigate('/dashboard'), 2000);
            } else {
                // Standard password reset — return to login
                setTimeout(() => navigate('/login'), 2500);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (pwd: string): { strength: string; color: string; width: string } => {
        if (pwd.length === 0) return { strength: '', color: '', width: '0%' };

        let score = 0;
        if (pwd.length >= 8) score++;
        if (pwd.length >= 12) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[a-z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;

        if (score <= 2) return { strength: 'Weak', color: 'bg-red-500', width: '33%' };
        if (score <= 4) return { strength: 'Medium', color: 'bg-amber-500', width: '66%' };
        return { strength: 'Strong', color: 'bg-emerald-500', width: '100%' };
    };

    const passwordStrength = getPasswordStrength(password);

    if (!validToken && error) {
        return (
            <div className="min-h-screen bg-[#0c1220] flex items-center justify-center p-6">
                <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-100 mb-3">
                        Invalid Recovery Link
                    </h2>
                    <p className="text-slate-400 text-sm font-medium mb-6">
                        {error}
                    </p>
                    <button
                        onClick={() => navigate('/forgot-password')}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all"
                    >
                        Request New Link
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0c1220] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background gradient effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-transparent to-purple-900/10"></div>
            <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-700/15 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl"></div>

            {/* Main card */}
            <div className="relative w-full max-w-md">
                <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl shadow-2xl">
                    {!success ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 mb-4">
                                    <Lock className="w-8 h-8 text-indigo-400" />
                                </div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-100 mb-2">
                                    Create Your Password
                                </h1>
                                <p className="text-slate-400 text-sm font-medium">
                                    Choose a strong password. You'll use this to log in from any device.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Error message */}
                                {error && (
                                    <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-400 font-medium">{error}</p>
                                    </div>
                                )}

                                {/* New password field */}
                                <div className="space-y-2">
                                    <label htmlFor="password" className="block text-xs font-bold text-slate-300 uppercase tracking-widest">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter new password"
                                            required
                                            className="w-full px-4 py-3 pr-12 bg-slate-800 border border-slate-600 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    {/* Password strength indicator */}
                                    {password && (
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-500 font-medium">Password Strength:</span>
                                                <span className={`font-bold ${passwordStrength.strength === 'Weak' ? 'text-red-400' :
                                                    passwordStrength.strength === 'Medium' ? 'text-amber-400' :
                                                        'text-emerald-400'
                                                    }`}>
                                                    {passwordStrength.strength}
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                                    style={{ width: passwordStrength.width }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Password requirements */}
                                    <div className="space-y-1 text-xs">
                                        <p className={password.length >= 8 ? 'text-emerald-400' : 'text-slate-500'}>
                                            • At least 8 characters
                                        </p>
                                        <p className={/[A-Z]/.test(password) ? 'text-emerald-400' : 'text-slate-500'}>
                                            • One uppercase letter
                                        </p>
                                        <p className={/[a-z]/.test(password) ? 'text-emerald-400' : 'text-slate-500'}>
                                            • One lowercase letter
                                        </p>
                                        <p className={/[0-9]/.test(password) ? 'text-emerald-400' : 'text-slate-500'}>
                                            • One number
                                        </p>
                                    </div>
                                </div>

                                {/* Confirm password field */}
                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-300 uppercase tracking-widest">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                            required
                                            className="w-full px-4 py-3 pr-12 bg-slate-800 border border-slate-600 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {confirmPassword && password !== confirmPassword && (
                                        <p className="text-sm text-red-400 font-medium">Passwords do not match</p>
                                    )}
                                </div>

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                                    className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-500 hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-slate-300 font-black text-sm uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Setting Password...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4" />
                                            Set My Password
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            {/* Success state */}
                            <div className="text-center py-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-black tracking-tight text-slate-100 mb-3">
                                    You're in.
                                </h2>
                                <p className="text-slate-400 text-sm font-medium mb-6">
                                    Password saved. Setting up your workspace...
                                </p>
                                <div className="inline-flex items-center gap-2 text-xs text-slate-400 font-medium">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Entering the portal...
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Security notice */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500 font-medium">
                        🔒 HIPAA-compliant · End-to-end encrypted
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
