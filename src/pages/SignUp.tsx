import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Lock, Mail, Stethoscope, ArrowRight, ArrowLeft, Loader2, AlertCircle, User, Building2, Plus, Users, Search, MapPin, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface SiteOption {
    site_id: string;
    site_name: string;
    region?: string;
}

const SignUp = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmEmail, setConfirmEmail] = useState<string | null>(null); // Fix 5: email confirm screen

    // Wizard State
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [sitesList, setSitesList] = useState<SiteOption[]>([]);

    // Core Form State
    const [formData, setFormData] = useState({
        // Step 1: Identity
        first_name: '',
        last_name: '',
        display_name: '', // Pseudonym/Handle
        email: '',
        password: '',
        is_profile_public: false,
        npi_number: '',

        // Step 2: Routing Setup
        affiliation_route: '' as 'invite' | 'existing' | 'solo' | 'new',
        invite_code: '', // If 'invite'
        selected_site_id: '', // If 'existing'

        // Step 3: Strict Creation
        new_site_name: '',
        address_line1: '',
        city: '',
        state_province: '',
        postal_code: ''
    });

    // Handle generic field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    // Auto-fill display name hint
    useEffect(() => {
        if (!formData.display_name && formData.first_name && formData.last_name) {
            setFormData(prev => ({ ...prev, display_name: `Dr. ${prev.last_name}` }));
        }
    }, [formData.first_name, formData.last_name]);

    // Pre-fetch public sites for the routing step
    useEffect(() => {
        const fetchSites = async () => {
            const { data, error } = await supabase
                .from('log_sites')
                .select('site_id, site_name, region')
                .eq('is_active', true) // Fix 1: removed non-existent is_discoverable column
                .order('site_name');

            if (!error && data) {
                setSitesList(data as SiteOption[]);
            }
        };
        fetchSites();
    }, []);

    // Form Navigation
    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (step === 1) {
            if (!formData.email || !formData.password || !formData.first_name || !formData.last_name) {
                setError("Please fill out all required core identity fields.");
                return;
            }
            if (formData.password.length < 6) {
                setError("Password must be at least 6 characters.");
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!formData.affiliation_route) {
                setError("Please select how you are joining PPN.");
                return;
            }

            if (formData.affiliation_route === 'invite') {
                if (!formData.invite_code) return setError("Please enter your invite code.");
                submitRegistration(); // Route A Finish
            } else if (formData.affiliation_route === 'existing') {
                if (!formData.selected_site_id) return setError("Please select your clinic from the list.");
                submitRegistration(); // Route B Finish
            } else if (formData.affiliation_route === 'solo') {
                submitRegistration(); // Route C Finish
            } else if (formData.affiliation_route === 'new') {
                setStep(3); // Route D -> Go to Address Collection
            }
        } else if (step === 3) {
            if (!formData.new_site_name || !formData.address_line1 || !formData.city || !formData.state_province || !formData.postal_code) {
                setError("Please complete all structured clinic details.");
                return;
            }
            submitRegistration(); // Route D Finish
        }
    };

    const handleBack = () => {
        setError(null);
        setStep((prev) => Math.max(1, prev - 1) as 1 | 2 | 3);
    };

    // Core Registration Engine
    const submitRegistration = async () => {
        setLoading(true);
        setError(null);

        try {
            let finalSiteId = formData.selected_site_id;
            let expectedRole = 'clinician';
            let finalIsActive = false; // By default, joining existing = pending approval

            // 1. Pre-flight routing logic
            if (formData.affiliation_route === 'solo') {
                // Stealth/Solo Track: Create a hidden site
                const { data: newSite, error: siteErr } = await supabase.from('log_sites').insert([{
                    site_name: `${formData.display_name || formData.first_name}'s Workspace`,
                    is_active: true
                    // Fix 2: removed non-existent is_discoverable column
                }]).select('site_id').single();
                if (siteErr) throw new Error("Could not initialize secure workspace.");
                finalSiteId = newSite.site_id;
                expectedRole = 'clinician'; // Fix 4: solopreneur is not a valid role constraint value
                finalIsActive = true; // Solo users approve themselves
            }
            else if (formData.affiliation_route === 'new') {
                // Strict Clinic Creation Track
                // Check Duplicates First
                const { data: dupCheck } = await supabase.from('log_sites')
                    .select('site_id')
                    .ilike('name', `%${formData.new_site_name}%`)
                    .eq('postal_code', formData.postal_code);

                if (dupCheck && dupCheck.length > 0) {
                    throw new Error(`A clinic matching that name and ZIP code already exists. Please return to Step 2 and find it in the public directory.`);
                }

                const { data: newSite, error: siteErr } = await supabase.from('log_sites').insert([{
                    site_name: formData.new_site_name.trim(),
                    is_active: true
                    // Fix 3: removed non-existent columns (is_discoverable, address_line1, city, state_province, postal_code)
                    // These columns don't exist in log_sites schema. Address data not currently captured here.
                }]).select('site_id').single();
                if (siteErr) throw new Error("Failed to register new clinic: " + siteErr.message);
                finalSiteId = newSite.site_id;
                expectedRole = 'site_admin';
                finalIsActive = true; // Clinic creators approve themselves
            }
            else if (formData.affiliation_route === 'invite') {
                // Simple invite routing map here
                throw new Error("Invite codes are not configured globally yet. Please select an existing clinic manually.");
            }

            // 2. Auth Creation
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
            if (!authData.user) throw new Error("Registration engine failure. Please contact an admin.");

            const userId = authData.user.id;

            // 3. Upsert Progressive Profile (only columns that exist in live schema)
            await supabase.from('log_user_profiles').upsert({
                user_id: userId,
                user_first_name: formData.first_name.trim(),
                user_last_name: formData.last_name.trim()
            });

            // 4. Bind Affiliation
            await supabase.from('log_user_sites').insert({
                user_id: userId,
                site_id: finalSiteId,
                role: expectedRole,
                is_active: finalIsActive
            });

            // 5. Success Routing
            if (authData.session) {
                if (!finalIsActive) {
                    addToast({ title: 'Application Received', message: 'Your request has been routed to the Clinic Admin. You will receive an email once approved.', type: 'success' });
                    navigate('/login');
                } else {
                    addToast({ title: 'Welcome to PPN', message: 'Your secure environment is ready.', type: 'success' });
                    navigate('/');
                }
            } else {
                // Fix 5: Show in-page confirmation screen instead of bouncing to /login blindly
                setConfirmEmail(formData.email);
            }

        } catch (err: any) {
            setError(err.message || 'The registration request was interrupted.');
        } finally {
            setLoading(false);
        }
    };

    // --- Email Confirmation Screen (Fix 5) ---
    if (confirmEmail) {
        return (
            <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center p-4">
                <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#0B0E14] to-[#0B0E14] pointer-events-none" />
                <div className="w-full max-w-md bg-[#151921] border border-slate-800 rounded-2xl shadow-2xl p-10 text-center relative z-10">
                    <div className="w-14 h-14 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(79,70,229,0.2)]">
                        <Mail className="w-7 h-7 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-black text-slate-200 tracking-tight mb-2">Check Your Email</h2>
                    <p className="text-sm text-slate-400 font-medium mb-4 leading-relaxed">
                        We sent a confirmation link to:
                    </p>
                    <p className="text-sm font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-4 py-2 mb-6 break-all">{confirmEmail}</p>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Click the link in that email to activate your secure workspace. Check your spam folder if you don't see it within a few minutes.
                    </p>
                    <div className="mt-8 pt-6 border-t border-slate-800">
                        <Link to="/login" className="text-xs text-slate-500 hover:text-indigo-400 font-black uppercase tracking-widest transition-colors">
                            Already confirmed? Sign In →
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center p-4 relative overflow-y-auto py-12">
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#0B0E14] to-[#0B0E14] pointer-events-none"></div>

            {/* Stepper HUD */}
            <div className="w-full max-w-2xl mb-8 flex items-center justify-center gap-4 relative z-10 px-4">
                {[1, 2, 3].map((num) => (
                    <React.Fragment key={num}>
                        <div className={`size-8 rounded-full flex items-center justify-center text-xs font-black shadow-lg transition-colors duration-500
                            ${step >= num ? 'bg-indigo-600 border-indigo-400 text-white border' : 'bg-slate-900 border-slate-800 text-slate-500 border'}`}>
                            {num}
                        </div>
                        {num !== 3 && (
                            <div className={`h-[2px] w-12 sm:w-24 rounded-full transition-colors duration-500
                                ${step > num ? 'bg-indigo-600/50' : 'bg-slate-800'}`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="w-full max-w-2xl bg-[#151921] border border-slate-800 rounded-2xl shadow-2xl relative z-10 overflow-hidden">
                <div className="p-8 text-center border-b border-slate-800/50 relative">
                    {step > 1 && (
                        <button onClick={handleBack} disabled={loading} className="absolute left-6 top-8 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                    )}
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                        <Stethoscope className="w-6 h-6 text-slate-300" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-300 tracking-tight mb-2">
                        {step === 1 ? "Identity & Privacy Boundaries" : step === 2 ? "Determine Network Affiliation" : "Establish New Clinical Hub"}
                    </h1>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                        {step === 1 ? "Step 1 of 3" : step === 2 ? "Step 2 of 3" : "Step 3 of 3"}
                    </p>
                </div>

                <form className="p-8 space-y-6">
                    {error && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-rose-400 text-sm font-bold shadow-lg animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    {/* ================= STEP 1: IDENTITY ================= */}
                    <div className={step === 1 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Legal First Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
                                    <input name="first_name" type="text" className="w-full bg-slate-900/50 border border-slate-700 text-slate-300 text-sm rounded-xl pl-10 p-3 placeholder-slate-600 transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="Jane" value={formData.first_name} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Legal Last Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
                                    <input name="last_name" type="text" className="w-full bg-slate-900/50 border border-slate-700 text-slate-300 text-sm rounded-xl pl-10 p-3 placeholder-slate-600 transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="Smith" value={formData.last_name} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1 mb-5">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Display Handle (Pseudonym)</label>
                                <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 bg-indigo-500/10 px-2 rounded-full py-0.5 border border-indigo-500/20">Privacy Guard On</span>
                            </div>
                            <div className="relative">
                                <EyeOff className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
                                <input name="display_name" type="text" className="w-full bg-slate-900/50 border border-slate-700 text-slate-300 text-sm rounded-xl pl-10 p-3 placeholder-slate-600 transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="How should we refer to you?" value={formData.display_name} onChange={handleChange} />
                            </div>
                            <p className="text-xs text-slate-600 font-medium">Your real name is cryptographically sealed. This handle represents you until you formally verify your medical credentials.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 pt-4 border-t border-slate-800/50">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Secure Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
                                    <input name="email" type="email" className="w-full bg-slate-900/50 border border-slate-700 text-slate-300 text-sm rounded-xl pl-10 p-3 placeholder-slate-600 transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="secure@email.com" value={formData.email} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Master Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
                                    <input name="password" type="password" className="w-full bg-slate-900/50 border border-slate-700 text-slate-300 text-sm rounded-xl pl-10 p-3 placeholder-slate-600 transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl flex items-start gap-4">
                            <input name="is_profile_public" type="checkbox" id="public_toggle" className="mt-1 size-5 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0 shrink-0" checked={formData.is_profile_public} onChange={handleChange} />
                            <div>
                                <label htmlFor="public_toggle" className="text-sm font-bold text-slate-300 cursor-pointer mb-1 block">List me in the Global Practitioner Directory</label>
                                <p className="text-xs text-slate-500">By checking this, verified network members can search for you to coordinate care and analyze blind protocols. Most solo practitioners leave this unchecked initially.</p>
                            </div>
                        </div>
                    </div>


                    {/* ================= STEP 2: AFFILIATION ROUTER ================= */}
                    <div className={step === 2 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                            {/* Option: Solo / Stealth */}
                            <label className={`relative flex flex-col p-5 cursor-pointer rounded-2xl border-2 transition-all ${formData.affiliation_route === 'solo' ? 'bg-indigo-900/10 border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.1)]' : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'}`}>
                                <input type="radio" name="affiliation_route" value="solo" className="sr-only" checked={formData.affiliation_route === 'solo'} onChange={handleChange} />
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-lg ${formData.affiliation_route === 'solo' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}><User className="w-5 h-5" /></div>
                                    <h3 className="text-sm font-bold text-slate-200">Independent Route</h3>
                                </div>
                                <p className="text-xs text-slate-500 font-medium">Create a private vault for my solo practice. Not discoverable by others.</p>
                            </label>

                            {/* Option: Join Existing */}
                            <label className={`relative flex flex-col p-5 cursor-pointer rounded-2xl border-2 transition-all ${formData.affiliation_route === 'existing' ? 'bg-indigo-900/10 border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.1)]' : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'}`}>
                                <input type="radio" name="affiliation_route" value="existing" className="sr-only" checked={formData.affiliation_route === 'existing'} onChange={handleChange} />
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-lg ${formData.affiliation_route === 'existing' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}><Users className="w-5 h-5" /></div>
                                    <h3 className="text-sm font-bold text-slate-200">Join Established Clinic</h3>
                                </div>
                                <p className="text-xs text-slate-500 font-medium">Search the directory to link your profile to a registered clinical group.</p>
                            </label>

                            {/* Option: Invite Code */}
                            <label className={`relative flex flex-col p-5 cursor-pointer rounded-2xl border-2 transition-all ${formData.affiliation_route === 'invite' ? 'bg-indigo-900/10 border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.1)]' : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'}`}>
                                <input type="radio" name="affiliation_route" value="invite" className="sr-only" checked={formData.affiliation_route === 'invite'} onChange={handleChange} />
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-lg ${formData.affiliation_route === 'invite' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}><Mail className="w-5 h-5" /></div>
                                    <h3 className="text-sm font-bold text-slate-200">I have an Invite</h3>
                                    <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">Soon</span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium">Use an encrypted token provided by your site administrator.</p>
                            </label>

                            {/* Option: Create New Structured Clinic */}
                            <label className={`relative flex flex-col p-5 cursor-pointer rounded-2xl border-2 transition-all ${formData.affiliation_route === 'new' ? 'bg-indigo-900/10 border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.1)]' : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'}`}>
                                <input type="radio" name="affiliation_route" value="new" className="sr-only" checked={formData.affiliation_route === 'new'} onChange={handleChange} />
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-lg ${formData.affiliation_route === 'new' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}><Building2 className="w-5 h-5" /></div>
                                    <h3 className="text-sm font-bold text-slate-200">Establish Clinic HQ</h3>
                                </div>
                                <p className="text-xs text-slate-500 font-medium">Register a large institutional presence for multiple practitioners.</p>
                            </label>
                        </div>

                        {/* Dynamics Inputs based on routing */}
                        <div className="h-[72px]">
                            {formData.affiliation_route === 'existing' && (
                                <div className="relative animate-in fade-in slide-in-from-top-2">
                                    <Search className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                                    <select name="selected_site_id" className="w-full bg-indigo-900/20 border border-indigo-500/50 text-indigo-100 text-sm font-bold rounded-xl pl-11 p-3 transition-colors outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner" value={formData.selected_site_id} onChange={handleChange}>
                                        <option value="" disabled>Search Public Directory...</option>
                                        {sitesList.map(s => (
                                            <option key={s.site_id} value={s.site_id}>
                                                {s.site_name} {s.region ? `(${s.region})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {formData.affiliation_route === 'invite' && (
                                <div className="relative animate-in fade-in slide-in-from-top-2">
                                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-indigo-400" />
                                    <input name="invite_code" type="text" className="w-full bg-indigo-900/20 border border-indigo-500/50 text-indigo-100 placeholder-indigo-300/50 text-sm font-mono font-bold tracking-widest uppercase rounded-xl pl-10 p-3 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. AUTH-XXXX" value={formData.invite_code} onChange={handleChange} />
                                </div>
                            )}
                        </div>
                    </div>


                    {/* ================= STEP 3: STRICT USPS REGISTRATION ================= */}
                    <div className={step === 3 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}>
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3 mb-6">
                            <AlertCircle className="w-5 h-5 shrink-0 text-amber-500" />
                            <p className="text-xs text-amber-500/80 font-bold leading-relaxed">Global Deduplication Active: To prevent fragmented networks and data silos, you must register a verifiable physical anchor point. We aggressively block duplicate clinics.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Formal Entity Name</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
                                    <input name="new_site_name" type="text" required={step === 3} className="w-full bg-slate-900/50 border border-slate-700 text-slate-300 text-sm rounded-xl pl-10 p-3 placeholder-slate-600 transition-colors focus:border-indigo-500 outline-none" placeholder="e.g., Mount Sinai Center for Psychedelic Healing" value={formData.new_site_name} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Street Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
                                    <input name="address_line1" type="text" required={step === 3} className="w-full bg-slate-900/50 border border-slate-700 text-slate-300 text-sm rounded-xl pl-10 p-3 placeholder-slate-600 transition-colors focus:border-indigo-500 outline-none" placeholder="123 Wellness Blvd, Ste 400" value={formData.address_line1} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="grid grid-cols-6 gap-3">
                                <div className="col-span-3 space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">City</label>
                                    <input name="city" type="text" required={step === 3} className="w-full bg-slate-900/50 border border-slate-700 text-slate-300 text-sm rounded-xl p-3 placeholder-slate-600 outline-none focus:border-indigo-500" placeholder="New York" value={formData.city} onChange={handleChange} />
                                </div>
                                <div className="col-span-1 space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">State</label>
                                    <input name="state_province" type="text" required={step === 3} maxLength={2} className="w-full bg-slate-900/50 border border-slate-700 text-slate-300 text-sm font-mono uppercase text-center rounded-xl p-3 placeholder-slate-600 outline-none focus:border-indigo-500" placeholder="NY" value={formData.state_province} onChange={handleChange} />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Zip Code</label>
                                    <input name="postal_code" type="text" required={step === 3} maxLength={10} className="w-full bg-slate-900/50 border border-slate-700 text-slate-300 text-sm font-mono text-center rounded-xl p-3 placeholder-slate-600 outline-none focus:border-indigo-500" placeholder="10001" value={formData.postal_code} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Action Footers */}
                    <div className="pt-6">
                        <button
                            onClick={handleNext}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 text-slate-200 bg-indigo-600 hover:bg-indigo-500 font-black tracking-widest uppercase rounded-xl text-sm px-5 py-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(79,70,229,0.2)] active:scale-[0.98]"
                        >
                            {loading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Provisioning Data Vault...</>
                            ) : (
                                <>{(step === 1 || (step === 2 && formData.affiliation_route === 'new')) ? 'Proceed Forward' : 'Initialize Vault'} <ArrowRight className="w-4 h-4 ml-1" /></>
                            )}
                        </button>

                        <div className="text-center mt-6">
                            <Link to="/login" className="text-xs text-slate-500 hover:text-indigo-400 font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1">
                                Already inside the network?<ArrowRight className="w-3 h-3" /> Sign In
                            </Link>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default SignUp;
