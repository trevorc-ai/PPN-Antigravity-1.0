import React from 'react';
import { Link } from 'react-router-dom';

// WO-563: Curious Patient Front Door
const ACCENT = '#fb7185';
const ACCENT_BG = 'rgba(251,113,133,0.08)';
const ACCENT_BORDER = 'rgba(251,113,133,0.25)';

const FEATURES = [
    {
        title: 'Personal Journey Tracker',
        body: 'Log your mood, sleep, and integration milestones over time. See your own recovery arc with a beautiful, clinical-grade visual timeline built for humans.',
    },
    {
        title: 'Phantom Shield Privacy',
        body: 'You are a hash code, not a name. Your documentation never contains your identity, only your outcomes. PPN cannot identify you even if asked to.',
    },
    {
        title: 'Compare to Global Average',
        body: 'Opt in to see how your healing trajectory compares to thousands of anonymized journeys. Science from your story, without surrendering your story.',
    },
    {
        title: 'Integration Support Tools',
        body: 'Guided reflection prompts, integration compass, and milestone tracking to help you make the most of the post-session window.',
    },
    {
        title: 'Your Data, Your Control',
        body: 'Export your full personal record at any time in PDF or CSV. Delete everything from your account with a single action. No retention, no lock-in.',
    },
    {
        title: 'Citizen Science Contribution',
        body: 'With your permission, your anonymized session outcomes contribute to the global benchmark, helping future patients and researchers worldwide.',
    },
];

const STEPS = [
    { step: '01', title: 'Create Your Account', body: 'Sign up with an email. No personal identifiers are required beyond email.' },
    { step: '02', title: 'Log Your Session', body: 'Answer guided questions about your experience, intentions, and early integration observations.' },
    { step: '03', title: 'Track Your Arc', body: 'Return over days and weeks to log your integration milestones and compare your trajectory.' },
    { step: '04', title: 'Your Insights', body: 'See your personal timeline, mood trends, and optionally compare to the anonymous global average.' },
];

export default function ForPatients() {
    return (
        <div className="min-h-screen bg-[#0a1628] text-slate-300">
            <title>For Patients | Track Your Healing Journey | PPN</title>
            <meta name="description" content="PPN patient tracking platform — private healing journal, global benchmark comparison, and Phantom Shield privacy for psychedelic therapy patients. Your data. Your control." />

            {/* Nav */}
            <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
                <Link to="/landing" className="flex items-center gap-2 group" aria-label="PPN Home">
                    <span className="text-sm font-black tracking-widest uppercase text-slate-200 group-hover:text-white transition-colors">PPN</span>
                    <span className="ppn-meta text-slate-500">/ Patients</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="ppn-meta text-slate-400 hover:text-slate-200 transition-colors hidden sm:block">Sign In</Link>
                    <a href="/waitlist?source=patient&segment=patient"
                        className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                        style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, color: ACCENT }}>
                        Join Patient Beta
                    </a>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative overflow-hidden px-6 pt-16 pb-28 text-center">
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% -10%, ${ACCENT}18 0%, transparent 65%)` }} />
                <div className="relative z-10 max-w-3xl mx-auto">
                    <span className="inline-block px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-6"
                        style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, color: ACCENT }}>
                        For Patients
                    </span>
                    <h1 className="ppn-page-title mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.15 }}>
                        Track Your Healing.<br /><span style={{ color: ACCENT }}>Own Your Story.</span>
                    </h1>
                    <p className="ppn-body text-slate-400 max-w-xl mx-auto mb-10" style={{ lineHeight: 1.7 }}>
                        Your experience belongs to you. PPN gives you a private, zero-PHI space to document your healing journey, with the option to compare your arc to thousands of anonymized others, privately.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {['Private Journaling', 'Phantom Shield Privacy', 'Citizen Science', 'Global Benchmark', 'Export Anytime'].map(p => (
                            <span key={p} className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>{p}</span>
                        ))}
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href="/waitlist?source=patient&segment=patient"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
                            style={{ background: ACCENT, boxShadow: `0 0 50px ${ACCENT}40`, minHeight: 56 }}
                            aria-label="Join the Patient Beta">
                            Join the Patient Beta →
                        </a>
                        <Link to="/structural-privacy"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-slate-300 text-base transition-all active:scale-95"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', minHeight: 56 }}>
                            How We Protect Your Data
                        </Link>
                    </div>
                </div>
            </section>

            {/* Privacy callout banner */}
            <div className="max-w-4xl mx-auto px-6 -mt-6 mb-0">
                <div className="rounded-2xl px-6 py-4 flex items-start gap-4"
                    style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}` }}>
                    <svg className="flex-shrink-0 mt-0.5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <div>
                        <span className="font-bold text-sm" style={{ color: ACCENT }}>Phantom Shield Active</span>
                        <p className="ppn-meta text-slate-400 mt-0.5">You are a Subject ID, not a name. PPN cannot identify you even under a court order. This is structural, not just policy.</p>
                    </div>
                </div>
            </div>

            {/* How it Works */}
            <section className="max-w-5xl mx-auto px-6 py-24">
                <div className="text-center mb-14">
                    <h2 className="ppn-section-title mb-3">How It Works</h2>
                    <p className="ppn-body text-slate-500 max-w-lg mx-auto">Four steps to start tracking your healing journey with clinical-grade structure and complete privacy.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {STEPS.map(s => (
                        <div key={s.step} className="rounded-2xl p-6"
                            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                            <div className="text-5xl font-black mb-4 leading-none" style={{ color: ACCENT, opacity: 0.35 }}>{s.step}</div>
                            <h3 className="ppn-card-title mb-2 text-slate-200">{s.title}</h3>
                            <p className="ppn-body text-slate-500">{s.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Grid */}
            <section className="border-t border-slate-800/60 px-6 py-24" style={{ background: 'rgba(251,113,133,0.03)' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="ppn-section-title mb-3">Everything You Need to Track Your Healing</h2>
                        <p className="ppn-body text-slate-500 max-w-lg mx-auto">Private, beautiful, and structured: PPN gives patients the same clinical-grade tools their practitioners use.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map(f => (
                            <div key={f.title} className="rounded-2xl p-6 hover:border-rose-500/30 transition-all duration-300"
                                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                <h3 className="ppn-card-title mb-2" style={{ color: ACCENT }}>{f.title}</h3>
                                <p className="ppn-body text-slate-500">{f.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="text-center px-6 py-28">
                <h2 className="ppn-section-title mb-4">Your healing journey deserves a home.</h2>
                <p className="ppn-body text-slate-500 mb-10 max-w-md mx-auto">Join the patient beta. Limited spots in the first cohort. No practitioner required to sign up.</p>
                <a href="/waitlist?source=patient&segment=patient"
                    className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
                    style={{ background: ACCENT, boxShadow: `0 0 60px ${ACCENT}40`, minHeight: 60 }}>
                    Join the Patient Beta →
                </a>
                <p className="ppn-meta text-slate-600 mt-6">
                    Psychedelic Practitioner Network &middot;{' '}
                    <a href="/" className="text-slate-500 hover:text-slate-300 transition-colors">ppnportal.net</a>
                </p>
            </section>
        </div>
    );
}
