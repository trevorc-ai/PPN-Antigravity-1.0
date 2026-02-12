import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Lock, Mail, User, Stethoscope, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const SignUp = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        licenseType: '',
        organization: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Sign Up using Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        license_type: formData.licenseType,
                        organization: formData.organization,
                        role: 'practitioner' // Default role
                    }
                }
            });

            if (authError) throw authError;

            // 2. Redirect to Login or Dashboard (depending on email confirmation setting)
            // For now, we'll assume email confirmation might be required, so we show a success message or redirect.
            // If auto-confirm is on, we can log them in. 
            if (authData.session) {
                navigate('/');
            } else {
                // If no session, they probably need to confirm email.
                addToast({ title: 'Registration Successful', message: 'Please check your email to confirm your account.', type: 'success' });
                navigate('/login');
            }

        } catch (err: any) {
            console.error('Signup Error:', err);
            setError(err.message || 'Failed to create account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0B0E14] to-[#0B0E14]"></div>

            <div className="w-full max-w-md bg-[#151921] border border-slate-800 rounded-2xl shadow-2xl relative z-10 overflow-hidden">
                {/* Header */}
                <div className="p-8 text-center border-b border-slate-800/50">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                        <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight mb-2">Join the Network</h1>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
                        Practitioner Registration
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSignUp} className="p-8 space-y-5">

                    {error && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-3 text-rose-400 text-xs font-bold">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Full Name */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    name="fullName"
                                    type="text"
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5 placeholder-slate-600"
                                    placeholder="Dr. Jane Doe"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5 placeholder-slate-600"
                                    placeholder="name@clinic.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="w-full bg-slate-900/50 border border-slate-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5 placeholder-slate-600"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* License Type */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">License</label>
                                <select
                                    name="licenseType"
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                    value={formData.licenseType}
                                    onChange={handleChange}
                                >
                                    <option value="">Select...</option>
                                    <option value="MD">MD / DO</option>
                                    <option value="NP">Nurse Practitioner</option>
                                    <option value="PA">Physician Assistant</option>
                                    <option value="PhD">PhD / PsyD</option>
                                    <option value="LCSW">LCSW / LPC</option>
                                    <option value="RN">Registered Nurse</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Org / Clinic</label>
                                <input
                                    name="organization"
                                    type="text"
                                    className="w-full bg-slate-900/50 border border-slate-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 placeholder-slate-600"
                                    placeholder="Clinic Name"
                                    value={formData.organization}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-bold rounded-xl text-sm px-5 py-3.5 mr-2 mb-2 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating Profile...
                            </>
                        ) : (
                            <>
                                Create Account
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>

                    <div className="text-center pt-2">
                        <Link to="/login" className="text-xs text-slate-500 hover:text-indigo-400 font-bold uppercase tracking-widest transition-colors">
                            Already have an account? Sign In
                        </Link>
                    </div>

                </form>
            </div>

            {/* Footer / Copyright */}
            <div className="absolute bottom-6 text-center w-full">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
                    Secured by Supabase Auth v2
                </p>
            </div>

        </div>
    );
};

export default SignUp;
