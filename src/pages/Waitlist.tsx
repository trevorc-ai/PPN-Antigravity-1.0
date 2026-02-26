import React, { FC, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Activity, Rocket, Diamond, Settings2, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const PRACTITIONER_TYPES = [
    { value: '', label: 'Select your practitioner type...' },
    { value: 'Licensed Clinician (MD, DO, NP, PA)', label: 'Licensed Clinician (MD, DO, NP, PA)' },
    { value: 'Psychologist / Therapist (PhD, PsyD, LCSW, LMFT)', label: 'Psychologist / Therapist (PhD, PsyD, LCSW, LMFT)' },
    { value: 'Ketamine / Psilocybin Clinic Operator', label: 'Ketamine / Psilocybin Clinic Operator' },
    { value: 'Independent Facilitator / Guide', label: 'Independent Facilitator / Guide' },
    { value: 'Integration Specialist / Coach', label: 'Integration Specialist / Coach' },
    { value: 'Researcher / Academic', label: 'Researcher / Academic' },
    { value: 'Other', label: 'Other' },
];

export const Waitlist: FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ firstName: '', email: '', practitionerType: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.firstName.trim() || !form.email.trim() || !form.practitionerType) return;
        setStatus('loading');
        try {
            const { error } = await supabase.from('log_waitlist').insert({
                first_name: form.firstName.trim(),
                email: form.email.trim().toLowerCase(),
                practitioner_type: form.practitionerType,
                source: 'ppn_portal_main',
            });
            if (error) {
                if (error.code === '23505') { setStatus('duplicate'); }
                else { throw error; }
            } else {
                setStatus('success');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-[#05070a] relative overflow-x-hidden flex flex-col font-sans text-slate-300 selection:bg-indigo-500/30">
            <title>Join the Waitlist — PPN Portal</title>

            {/* Background orbs */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-indigo-900/15 rounded-full blur-[140px] opacity-50" />
                <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-indigo-900/10 rounded-full blur-[140px] opacity-35" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-900/8 rounded-full blur-[100px] opacity-20" />
            </div>

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-[#0a1628]/95 backdrop-blur-md border-b border-indigo-500/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <Activity className="text-indigo-500 w-6 h-6" />
                    <span className="text-sm font-black tracking-tight text-slate-300 uppercase">
                        PPN <span className="text-indigo-400">Portal</span>
                    </span>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">close</span>
                    Close
                </button>
            </nav>

            <main className="flex-1 relative z-10 w-full max-w-4xl mx-auto px-6 pt-16 pb-24 flex flex-col items-center">
                {/* Hero Section */}
                <div className="text-center mb-12 max-w-2xl">
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-200 mb-4 leading-tight">
                        Join the Waitlist for <br />
                        <span className="text-indigo-500">PPN Portal</span>
                    </h1>
                    <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-xl mx-auto">
                        Clinical infrastructure for psychedelic therapy practitioners. Request early access and join the founding cohort.
                    </p>
                </div>

                {/* Value Props */}
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mb-16 w-full max-w-3xl">
                    <div className="bg-[#1c222d]/50 border border-indigo-500/20 rounded-2xl p-5 flex items-center gap-4 flex-1 min-w-[280px] backdrop-blur-sm">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Rocket className="w-5 h-5 text-blue-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-300 leading-snug">Priority access when the pilot opens (targeted early spring 2026)</p>
                    </div>
                    <div className="bg-[#1c222d]/50 border border-indigo-500/20 rounded-2xl p-5 flex items-center gap-4 flex-1 min-w-[280px] backdrop-blur-sm">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Diamond className="w-5 h-5 text-purple-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-300 leading-snug">Founding practitioner pricing (locked rate for early adopters)</p>
                    </div>
                    <div className="bg-[#1c222d]/50 border border-indigo-500/20 rounded-2xl p-5 flex items-center gap-4 flex-1 min-w-[280px] backdrop-blur-sm">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Settings2 className="w-5 h-5 text-emerald-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-300 leading-snug">Direct input on the clinical platform roadmap</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="w-full max-w-xl relative">
                    {/* Glow ring like login */}
                    <div className="absolute -inset-0.5 bg-indigo-500/10 blur-xl opacity-80 rounded-[2.5rem]" />

                    <div className="relative bg-[#1c222d]/70 border border-slate-700/60 rounded-[2rem] p-8 sm:p-10 backdrop-blur-xl shadow-2xl">
                        {status === 'success' ? (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 text-center animate-in fade-in duration-500">
                                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-black text-emerald-400 mb-2">You're on the list.</h2>

                                <div className="text-left bg-[#0c0f14]/50 border border-slate-700/50 rounded-2xl p-5 mb-8 mt-6">
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">What happens next:</p>
                                    <ul className="space-y-3 text-sm font-medium text-slate-300">
                                        <li className="flex gap-2 items-start"><span className="text-indigo-400">•</span> You'll receive an email confirmation shortly.</li>
                                        <li className="flex gap-2 items-start"><span className="text-indigo-400">•</span> We'll notify you when the pilot opens.</li>
                                        <li className="flex gap-2 items-start"><span className="text-indigo-400">•</span> Priority onboarding + direct access to our team.</li>
                                    </ul>
                                </div>

                                <button
                                    onClick={() => navigate('/partner-demo')}
                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black rounded-xl uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-indigo-900/50"
                                >
                                    Watch the Demo →
                                </button>
                            </div>
                        ) : status === 'duplicate' ? (
                            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-3xl p-8 text-center animate-in fade-in duration-500">
                                <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Activity className="w-8 h-8 text-cyan-400" />
                                </div>
                                <h2 className="text-2xl font-black text-cyan-400 mb-2">You're already on the list.</h2>
                                <p className="text-slate-400 font-medium mb-8">We'll be in touch. Watch your inbox.</p>

                                <button
                                    onClick={() => navigate('/partner-demo')}
                                    className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-sm font-black rounded-xl uppercase tracking-widest transition-all active:scale-95 border border-cyan-500/30"
                                >
                                    Watch the Demo →
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {status === 'error' && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-400">Something went wrong. Please try again or email us.</p>
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="first-name" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">First Name</label>
                                    <input
                                        id="first-name"
                                        type="text"
                                        required
                                        placeholder="Your first name"
                                        value={form.firstName}
                                        onChange={(e) => setForm(f => ({ ...f, firstName: e.target.value }))}
                                        className="w-full px-5 py-3.5 bg-[#0c0f14] border border-slate-700/50 rounded-xl text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        placeholder="you@yourpractice.com"
                                        value={form.email}
                                        onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                                        className="w-full px-5 py-3.5 bg-[#0c0f14] border border-slate-700/50 rounded-xl text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="practitioner-type" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Practitioner Type</label>
                                    <select
                                        id="practitioner-type"
                                        required
                                        value={form.practitionerType}
                                        onChange={(e) => setForm(f => ({ ...f, practitionerType: e.target.value }))}
                                        className="w-full px-5 py-3.5 bg-[#0c0f14] border border-slate-700/50 rounded-xl text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium appearance-none"
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                                    >
                                        {PRACTITIONER_TYPES.map((t) => (
                                            <option key={t.value} value={t.value} disabled={t.value === ''} className="bg-[#0c0f14] text-slate-300">
                                                {t.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>



                                <button
                                    type="submit"
                                    disabled={status === 'loading' || !form.firstName.trim() || !form.email.trim() || !form.practitionerType}
                                    className="w-full py-4 mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-sm font-black rounded-xl uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-indigo-900/30 flex items-center justify-center gap-2"
                                >
                                    {status === 'loading' ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                                    ) : (
                                        'Join the Waitlist'
                                    )}
                                </button>

                                <p className="text-xs font-bold text-slate-500 text-center tracking-wide mt-2">
                                    No spam. No payments. Just early access.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Waitlist;
