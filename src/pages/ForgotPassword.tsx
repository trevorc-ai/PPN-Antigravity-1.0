import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Loader2, Mail, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/#/reset-password`,
            });

            if (error) throw error;

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send recovery email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background gradient effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5"></div>
            <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

            {/* Main card */}
            <div className="relative w-full max-w-md">
                {/* Back button */}
                <button
                    onClick={() => navigate('/login')}
                    className="mb-6 flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm font-bold uppercase tracking-widest group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </button>

                <div className="card-glass p-8 rounded-3xl border border-slate-800 shadow-2xl">
                    {!success ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                                    <Mail className="w-8 h-8 text-primary" />
                                </div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-200 mb-2">
                                    Reset Your Password
                                </h1>
                                <p className="text-slate-400 text-sm font-medium">
                                    Enter your email address and we'll send you a link to reset your password.
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

                                {/* Email field */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-[10px] font-bold text-slate-3000 uppercase tracking-widest">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your.email@clinic.com"
                                        required
                                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-slate-300 font-black text-sm uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="w-4 h-4" />
                                            Send Recovery Email
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Footer */}
                            <div className="mt-6 text-center">
                                <p className="text-xs text-slate-3000 font-medium">
                                    Remember your password?{' '}
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="text-primary hover:text-primary/80 font-bold transition-colors"
                                    >
                                        Sign In
                                    </button>
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Success state */}
                            <div className="text-center py-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-black tracking-tight text-slate-200 mb-3">
                                    Check Your Email
                                </h2>
                                <p className="text-slate-400 text-sm font-medium mb-6 max-w-sm mx-auto">
                                    We've sent a password recovery link to <span className="text-slate-300 font-bold">{email}</span>
                                </p>
                                <div className="space-y-3 text-xs text-slate-3000 font-medium mb-8">
                                    <p>• Click the link in the email to reset your password</p>
                                    <p>• The link will expire in 1 hour</p>
                                    <p>• Check your spam folder if you don't see it</p>
                                </div>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-sm uppercase tracking-widest rounded-xl transition-all"
                                >
                                    Return to Login
                                </button>
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

export default ForgotPassword;
