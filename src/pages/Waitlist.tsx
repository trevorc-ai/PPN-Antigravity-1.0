import React, { FC, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import {
    Activity, Rocket, Diamond, Settings2,
    CheckCircle2, Loader2, AlertCircle, ArrowRight,
    ShieldCheck, Users, LineChart
} from 'lucide-react';

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

const VALUE_PROPS = [
    {
        icon: Rocket,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        title: 'Priority Access',
        body: 'First in line when the pilot opens — targeted early spring 2026.',
    },
    {
        icon: Diamond,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        title: 'Founding Pricing',
        body: 'Locked rate for founding practitioners — communicated at pilot launch.',
    },
    {
        icon: LineChart,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        title: 'Roadmap Input',
        body: 'Direct influence over what gets built and prioritized next.',
    },
    {
        icon: ShieldCheck,
        color: 'text-sky-400',
        bg: 'bg-sky-500/10',
        title: 'Clinical-Grade Infrastructure',
        body: 'Built for psychedelic-assisted therapy — documentation, analytics, safety.',
    },
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

    const isSubmittable = form.firstName.trim() && form.email.trim() && form.practitionerType;

    return (
        <div className="min-h-screen bg-[#070b14] relative overflow-x-hidden flex flex-col font-sans text-slate-300 selection:bg-indigo-500/30">
            <title>Join the Waitlist — PPN Research Portal</title>

            {/* Rich background treatment */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Left panel warm glow */}
                <div className="absolute top-0 left-0 w-[900px] h-full bg-gradient-to-r from-indigo-950/60 to-transparent" />
                {/* Radial center accent */}
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-800/12 rounded-full blur-[150px]" />
                {/* Top right subtle */}
                <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-blue-900/10 rounded-full blur-[120px]" />
                {/* Bottom left accent */}
                <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-indigo-900/15 rounded-full blur-[100px]" />
                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-[#070b14]/90 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
                    <Activity className="text-indigo-500 w-5 h-5" />
                    <span className="text-sm font-black tracking-wider text-slate-300 uppercase">
                        PPN <span className="text-indigo-400">Portal</span>
                    </span>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-base">close</span>
                    Close
                </button>
            </nav>

            {/* Main — two-column split layout */}
            <main className="flex-1 relative z-10 flex flex-col lg:flex-row">

                {/* ── LEFT COLUMN — Copy & Value Props ─────────────────── */}
                <div className="flex-1 flex flex-col justify-center px-10 xl:px-20 py-16 lg:py-24 max-w-2xl mx-auto lg:mx-0 lg:max-w-none">

                    {/* Eyebrow */}
                    <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8 self-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Limited Beta — Founding Cohort</span>
                    </div>

                    <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-black tracking-tight text-slate-100 mb-6 leading-[1.1]">
                        Clinical infrastructure<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                            for psychedelic therapy.
                        </span>
                    </h1>

                    <p className="text-lg xl:text-xl text-slate-400 font-medium leading-relaxed mb-14 max-w-lg">
                        Join the founding cohort of practitioners helping shape the platform — documentation, analytics, drug safety, and more.
                    </p>

                    {/* Value props grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {VALUE_PROPS.map(({ icon: Icon, color, bg, title, body }) => (
                            <div key={title} className="flex items-start gap-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.05] transition-colors">
                                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                    <Icon className={`w-5 h-5 ${color}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-200 mb-1">{title}</p>
                                    <p className="text-sm text-slate-400 leading-snug">{body}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Social proof line */}
                    <div className="flex items-center gap-3 mt-10">
                        <div className="flex -space-x-2">
                            {['JA', 'TC', 'KM'].map((initials) => (
                                <div key={initials} className="w-8 h-8 rounded-full bg-indigo-700/50 border border-indigo-500/40 flex items-center justify-center text-[10px] font-black text-indigo-300">
                                    {initials}
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-slate-500 font-medium">
                            <span className="text-slate-300 font-bold">Founding practitioners</span> already on the list
                        </p>
                    </div>
                </div>

                {/* ── RIGHT COLUMN — Form ───────────────────────────────── */}
                <div className="w-full lg:w-[520px] xl:w-[580px] flex-shrink-0 flex items-center justify-center px-8 py-16 lg:py-24 bg-white/[0.015] lg:border-l border-white/5">
                    <div className="w-full max-w-md">

                        {status === 'success' ? (
                            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="w-20 h-20 bg-emerald-500/15 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-100 mb-2">You're on the list.</h2>
                                <p className="text-slate-400 font-medium mb-10">We'll be in touch when the pilot opens.</p>

                                <div className="text-left bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 mb-8">
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">What happens next</p>
                                    <ul className="space-y-3">
                                        {[
                                            "You'll receive an email confirmation shortly.",
                                            "We'll notify you when the pilot opens.",
                                            'Priority onboarding + direct access to our team.',
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-300">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    onClick={() => navigate('/partner-demo')}
                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black rounded-xl uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-2"
                                >
                                    Watch the 2-min Demo <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        ) : status === 'duplicate' ? (
                            <div className="text-center animate-in fade-in duration-500">
                                <div className="w-20 h-20 bg-sky-500/15 border border-sky-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-sky-400" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-100 mb-2">You're already on the list.</h2>
                                <p className="text-slate-400 font-medium mb-8">We'll be in touch. Watch your inbox.</p>
                                <button
                                    onClick={() => navigate('/partner-demo')}
                                    className="w-full py-4 bg-slate-800 hover:bg-slate-700 border border-sky-500/30 text-sky-400 text-sm font-black rounded-xl uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Watch the Demo <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-8">
                                    <h2 className="text-2xl font-black text-slate-100 mb-1">Request Founding Access</h2>
                                    <p className="text-sm text-slate-500 font-medium">No payment required — early access only.</p>
                                </div>

                                {status === 'error' && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3 mb-6 animate-in fade-in duration-300">
                                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-400 font-medium">
                                            Something went wrong. Please try again or email{' '}
                                            <a href="mailto:info@ppnportal.net" className="underline">info@ppnportal.net</a>
                                        </p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* First Name */}
                                    <div>
                                        <label htmlFor="first-name" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                            First Name
                                        </label>
                                        <input
                                            id="first-name"
                                            type="text"
                                            required
                                            placeholder="Your first name"
                                            value={form.firstName}
                                            onChange={(e) => setForm(f => ({ ...f, firstName: e.target.value }))}
                                            className="w-full px-5 py-3.5 bg-white/[0.04] border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium text-base"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            placeholder="you@yourpractice.com"
                                            value={form.email}
                                            onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                                            className="w-full px-5 py-3.5 bg-white/[0.04] border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium text-base"
                                        />
                                    </div>

                                    {/* Practitioner Type */}
                                    <div>
                                        <label htmlFor="practitioner-type" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                            Practitioner Type
                                        </label>
                                        <select
                                            id="practitioner-type"
                                            required
                                            value={form.practitionerType}
                                            onChange={(e) => setForm(f => ({ ...f, practitionerType: e.target.value }))}
                                            className="w-full px-5 py-3.5 bg-white/[0.04] border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium text-base appearance-none"
                                            style={{
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'right 1rem center',
                                                backgroundSize: '1.2em',
                                            }}
                                        >
                                            {PRACTITIONER_TYPES.map((t) => (
                                                <option key={t.value} value={t.value} disabled={t.value === ''} className="bg-[#0d1117] text-slate-300">
                                                    {t.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={status === 'loading' || !isSubmittable}
                                        className="w-full py-4 mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-sm font-black rounded-xl uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-indigo-900/30 flex items-center justify-center gap-2"
                                    >
                                        {status === 'loading' ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                                        ) : (
                                            <>Join the Waitlist <ArrowRight className="w-4 h-4" /></>
                                        )}
                                    </button>

                                    {/* Reassurance */}
                                    <div className="flex items-center justify-center gap-2 pt-1">
                                        <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                                        <p className="text-xs font-bold text-slate-600 tracking-wide">
                                            No spam. No payments. Just early access.
                                        </p>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Waitlist;
