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
        // Check if we have a valid recovery token
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setValidToken(true);
            } else {
                setError('Invalid or expired recovery link. Please request a new one.');
            }
        };
        checkSession();
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

        // Validate password
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        // Check passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
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
            <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6">
                <div className="card-glass p-8 rounded-3xl border border-slate-800 max-w-md w-full text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-300 mb-3">
                        Invalid Recovery Link
                    </h2>
                    <p className="text-slate-300 text-sm font-medium mb-6">
                        {error}
                    </p>
                    <button
                        onClick={() => navigate('/forgot-password')}
                        className="px-6 py-3 bg-primary hover:bg-primary/90 text-slate-300 font-black text-sm uppercase tracking-widest rounded-xl transition-all"
                    >
                        Request New Link
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background gradient effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5"></div>
            <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

            {/* Main card */}
            <div className="relative w-full max-w-md">
                <div className="card-glass p-8 rounded-3xl border border-slate-800 shadow-2xl">
                    {!success ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                                    <Lock className="w-8 h-8 text-primary" />
                                </div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-300 mb-2">
                                    Set New Password
                                </h1>
                                <p className="text-slate-300 text-sm font-medium">
                                    Choose a strong password for your account
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
                                    <label htmlFor="password" className="block text-[10px] font-bold text-slate-3000 uppercase tracking-widest">
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
                                            className="w-full px-4 py-3 pr-12 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-3000 hover:text-slate-300 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    {/* Password strength indicator */}
                                    {password && (
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-3000 font-medium">Password Strength:</span>
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
                                        <p className={password.length >= 8 ? 'text-emerald-400' : 'text-slate-3000'}>
                                            • At least 8 characters
                                        </p>
                                        <p className={/[A-Z]/.test(password) ? 'text-emerald-400' : 'text-slate-3000'}>
                                            • One uppercase letter
                                        </p>
                                        <p className={/[a-z]/.test(password) ? 'text-emerald-400' : 'text-slate-3000'}>
                                            • One lowercase letter
                                        </p>
                                        <p className={/[0-9]/.test(password) ? 'text-emerald-400' : 'text-slate-3000'}>
                                            • One number
                                        </p>
                                    </div>
                                </div>

                                {/* Confirm password field */}
                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="block text-[10px] font-bold text-slate-3000 uppercase tracking-widest">
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
                                            className="w-full px-4 py-3 pr-12 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-3000 hover:text-slate-300 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {confirmPassword && password !== confirmPassword && (
                                        <p className="text-xs text-red-400 font-medium">Passwords do not match</p>
                                    )}
                                </div>

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                                    className="w-full px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-slate-300 font-black text-sm uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Resetting Password...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4" />
                                            Reset Password
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
                                <h2 className="text-2xl font-black tracking-tight text-slate-300 mb-3">
                                    Password Reset Successfully
                                </h2>
                                <p className="text-slate-300 text-sm font-medium mb-6">
                                    Your password has been updated. You can now sign in with your new password.
                                </p>
                                <div className="inline-flex items-center gap-2 text-xs text-slate-3000 font-medium">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Redirecting to login...
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Security notice */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-600 font-medium">
                        🔒 Secured by Supabase Auth v2
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
