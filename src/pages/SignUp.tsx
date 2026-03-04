import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Lock, Mail, Stethoscope, ArrowRight, Loader2, AlertCircle, User, Building2, Plus } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface SiteOption {
    site_id: string;
    name: string;
}

const SignUp = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // New State for Sites
    const [sitesList, setSitesList] = useState<SiteOption[]>([]);

    // Form Data
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        site_id: '',
        new_site_name: '' // Only used if site_id === 'new'
    });

    useEffect(() => {
        const fetchSites = async () => {
            const { data, error } = await supabase
                .from('log_sites')
                .select('site_id, name')
                .eq('is_active', true)
                .order('name');

            if (error) {
                console.error("Error fetching sites for registration:", error);
            } else if (data) {
                setSitesList(data as SiteOption[]);
            }
        };
        fetchSites();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // STEP 1: Handle New Site Creation IF they selected "new"
            let finalSiteId = formData.site_id;
            let assignedRole = 'clinician';

            if (formData.site_id === 'new') {
                if (!formData.new_site_name.trim()) {
                    throw new Error("Please provide a name for the new clinical site.");
                }

                // Create the site
                const { data: newSite, error: siteErr } = await supabase
                    .from('log_sites')
                    .insert([{ name: formData.new_site_name.trim(), is_active: true }])
                    .select('site_id')
                    .single();

                if (siteErr) throw new Error("Failed to create new clinical site: " + siteErr.message);
                if (!newSite) throw new Error("Failed to create new clinical site.");

                finalSiteId = newSite.site_id;
                assignedRole = 'site_admin'; // Creator of new site is automatically admin
            } else if (!formData.site_id) {
                throw new Error("Please select an existing clinical site or create a new one.");
            }

            // STEP 2: Sign Up User
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.first_name,
                        last_name: formData.last_name
                    }
                }
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("Registration failed. No user returned.");

            const userId = authData.user.id;

            // STEP 3: Bind Profile Data
            const displayName = `${formData.first_name.trim()} ${formData.last_name.trim()}`;
            const { error: profileErr } = await supabase
                .from('log_user_profiles')
                .upsert({
                    user_id: userId,
                    display_name: displayName,
                    first_name: formData.first_name.trim(),
                    last_name: formData.last_name.trim()
                });

            if (profileErr) console.error("Profile creation warning:", profileErr);

            // STEP 4: Bind User to Site
            const { error: bindErr } = await supabase
                .from('log_user_sites')
                .insert({
                    user_id: userId,
                    site_id: finalSiteId,
                    role: assignedRole,
                    is_active: true
                });

            if (bindErr) console.error("Site binding warning:", bindErr);

            // 5. Success / Redirection
            if (authData.session) {
                addToast({ title: 'Welcome aboard', message: 'You have been successfully registered.', type: 'success' });
                navigate('/');
            } else {
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
        <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center p-4 relative overflow-hidden py-12">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0B0E14] to-[#0B0E14]"></div>

            <div className="w-full max-w-lg bg-[#151921] border border-slate-800 rounded-2xl shadow-2xl relative z-10 overflow-hidden">
                <div className="p-8 text-center border-b border-slate-800/50">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                        <Stethoscope className="w-6 h-6 text-slate-300" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-300 tracking-tight mb-2">Join the Alliance</h1>
                    <p className="text-slate-300 text-sm font-medium uppercase tracking-widest">
                        Practitioner Registration
                    </p>
                </div>

                <form onSubmit={handleSignUp} className="p-8 space-y-5">
                    {error && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-3 text-rose-400 text-xs font-bold">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">First Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <input
                                        name="first_name"
                                        type="text"
                                        required
                                        className="w-full bg-slate-900/50 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block pl-10 p-2.5 placeholder-slate-600 transition-colors"
                                        placeholder="Jane"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Last Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <input
                                        name="last_name"
                                        type="text"
                                        required
                                        className="w-full bg-slate-900/50 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block pl-10 p-2.5 placeholder-slate-600 transition-colors"
                                        placeholder="Smith"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block pl-10 p-2.5 placeholder-slate-600 transition-colors"
                                    placeholder="name@clinic.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="w-full bg-slate-900/50 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block pl-10 p-2.5 placeholder-slate-600 transition-colors"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Site Selection */}
                        <div className="space-y-1 pt-2 border-t border-slate-800/50 mt-4">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Clinical Site Affiliation</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building2 className="h-4 w-4 text-slate-500" />
                                </div>
                                <select
                                    name="site_id"
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block pl-10 p-2.5 bg-[length:20px] transition-colors"
                                    value={formData.site_id}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select a Clinic or Site...</option>
                                    {sitesList.map(site => (
                                        <option key={site.site_id} value={site.site_id}>
                                            {site.name}
                                        </option>
                                    ))}
                                    <option value="new" className="font-bold text-indigo-400">
                                        + Create New Clinical Site
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Conditional New Site Input */}
                        {formData.site_id === 'new' && (
                            <div className="space-y-1 animate-in slide-in-from-top-2 fade-in duration-200">
                                <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                                    <Plus className="w-3 h-3" />
                                    New Clinic Name
                                </label>
                                <input
                                    name="new_site_name"
                                    type="text"
                                    required
                                    className="w-full bg-indigo-900/10 border border-indigo-500/30 text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 placeholder-slate-600 transition-colors"
                                    placeholder="e.g. Allen Wellness Center"
                                    value={formData.new_site_name}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 text-slate-300 bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-bold rounded-xl text-sm px-5 py-3.5 mr-2 mb-2 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
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

            <div className="absolute bottom-6 text-center w-full">
                <p className="text-sm text-slate-600 font-bold uppercase tracking-[0.2em]">
                    HIPAA-compliant · End-to-end encrypted
                </p>
            </div>
        </div>
    );
};

export default SignUp;
