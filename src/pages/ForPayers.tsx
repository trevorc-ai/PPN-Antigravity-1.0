import React from 'react';
import { Link } from 'react-router-dom';

// WO-560: Insurance / Payers Front Door
const ACCENT = '#0ea5e9';
const ACCENT_BG = 'rgba(14,165,233,0.08)';
const ACCENT_BORDER = 'rgba(14,165,233,0.25)';

const STATS = [
    { value: '10,000+', label: 'Patient-Sessions in Database' },
    { value: '10+', label: 'Landmark Open Cohorts' },
    { value: '<2s', label: 'Adverse Event Flagging' },
    { value: '0', label: 'PHI in Any Record' },
];

const FEATURES = [
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
            </svg>
        ),
        title: 'Outcome Validation',
        body: 'Every treatment record is structured, schema-stable, and benchmarked against published cohort studies. Outcomes data you can actuarially model — not anecdote.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        title: 'Continuous Safety Surveillance',
        body: 'Adverse event tracking, grade classification, and chemical rescue logs — with real-time signal extraction giving actuaries the clarity they need.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
            </svg>
        ),
        title: 'Actuarial Benchmarks',
        body: 'Compare intervention efficacy across patient segments, substance protocols, and clinical settings. Segment-level risk modeling for coverage decision-making.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" />
                <path d="M16 13H8M16 17H8M10 9H8" />
            </svg>
        ),
        title: 'Audit-Ready Data Exports',
        body: 'PDF reports, CSV summaries, and structured JSON exports for IRB, regulatory, and institutional review. Every record is timestamped and immutable.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 12h16M4 18h7" />
            </svg>
        ),
        title: 'Protocol Validation Layer',
        body: 'Validate whether a practitioner\'s documented protocol adheres to published safety standards — before coverage decisions are made.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
        ),
        title: 'Global Network Intelligence',
        body: 'Aggregate outcomes from practitioners across 40+ countries. Identify geographic and protocol-level variance in safety and efficacy at scale.',
    },
];

const PROOF_ITEMS = [
    { label: 'Session Records', value: 'Structured Schema', sub: 'Foreign-key IDs only — no free text, no PHI' },
    { label: 'Data Latency', value: '<5 seconds', sub: 'From practitioner entry to benchmark update' },
    { label: 'Adverse Events', value: 'Grade 1–4 logged', sub: 'WHO toxicity grading classification built-in' },
];

export default function ForPayers() {
    return (
        <div className="min-h-screen bg-[#0a1628] text-slate-300">
            <title>For Payers &amp; Insurance | PPN</title>
            <meta name="description" content="Structured psychedelic therapy outcome data for payers, underwriters, and actuarial teams. Safety surveillance, outcome validation, and actuarial benchmarks." />

            {/* ── Nav ──────────────────────────────────────────────── */}
            <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
                <Link to="/landing" className="flex items-center gap-2 group" aria-label="PPN Home">
                    <span className="text-sm font-black tracking-widest uppercase text-slate-200 group-hover:text-white transition-colors">PPN</span>
                    <span className="ppn-meta text-slate-500">/ Payers</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="ppn-meta text-slate-400 hover:text-slate-200 transition-colors hidden sm:block">Sign In</Link>
                    <a
                        href="/waitlist?source=insurance&segment=insurance&type=consultation"
                        className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                        style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, color: ACCENT }}
                    >
                        Schedule Briefing
                    </a>
                </div>
            </nav>

            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="relative overflow-hidden px-6 pt-16 pb-28 text-center">
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% -10%, ${ACCENT}1a 0%, transparent 65%)` }} />

                <div className="relative z-10 max-w-3xl mx-auto">
                    <span
                        className="inline-block px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-6"
                        style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, color: ACCENT }}
                    >
                        For Payers &amp; Underwriters
                    </span>

                    <h1 className="ppn-page-title mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.15 }}>
                        The Actuarial Intelligence<br />
                        <span style={{ color: ACCENT }}>Layer for Psychedelic Therapy</span>
                    </h1>

                    <p className="ppn-body text-slate-400 max-w-xl mx-auto mb-10" style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
                        Structured outcome data — not anecdote — for risk modeling, safety surveillance, and coverage decision intelligence in psychedelic-assisted therapy.
                    </p>

                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {['Structured Outcomes', 'Safety Matrix', 'Actuarial Database', 'Protocol Validation', 'Real-Time Benchmarks'].map(p => (
                            <span key={p} className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                {p}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="/waitlist?source=insurance&segment=insurance&type=consultation"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
                            style={{ background: ACCENT, boxShadow: `0 0 50px ${ACCENT}40`, minHeight: 56 }}
                            aria-label="Schedule a Briefing"
                        >
                            Schedule Briefing →
                        </a>
                        <Link
                            to="/partner-demo"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-slate-300 text-base transition-all active:scale-95"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', minHeight: 56 }}
                        >
                            Request Data Sample
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Stats Bar ────────────────────────────────────────── */}
            <section className="border-y border-slate-800/60 bg-slate-900/30">
                <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {STATS.map(s => (
                        <div key={s.label}>
                            <div className="text-3xl font-black mb-1" style={{ color: ACCENT }}>{s.value}</div>
                            <div className="ppn-meta text-slate-500">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features Grid ────────────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="ppn-section-title mb-3">Actuarial Intelligence at Every Layer</h2>
                    <p className="ppn-body text-slate-500 max-w-lg mx-auto">From individual session records to population-level risk modeling: PPN is the data infrastructure that psychedelic therapy coverage decisions require.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map(f => (
                        <div key={f.title} className="rounded-2xl p-6 hover:border-sky-500/30 transition-all duration-300"
                            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                                style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, color: ACCENT }}>
                                {f.icon}
                            </div>
                            <h3 className="ppn-card-title mb-2 text-slate-200">{f.title}</h3>
                            <p className="ppn-body text-slate-500">{f.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Data Spec Panel ──────────────────────────────────── */}
            <section className="border-t border-slate-800/60 px-6 py-24" style={{ background: 'rgba(14,165,233,0.04)' }}>
                <div className="max-w-4xl mx-auto">
                    <h2 className="ppn-section-title text-center mb-12">Data Quality Specifications</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {PROOF_ITEMS.map((item) => (
                            <div key={item.label} className="rounded-2xl p-6 text-center"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                <div className="ppn-meta text-slate-500 uppercase tracking-widest mb-2">{item.label}</div>
                                <div className="text-2xl font-black mb-2" style={{ color: ACCENT }}>{item.value}</div>
                                <p className="ppn-meta text-slate-500">{item.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Bottom CTA ───────────────────────────────────────── */}
            <section className="text-center px-6 py-28">
                <h2 className="ppn-section-title mb-4">The data layer the industry has been waiting for.</h2>
                <p className="ppn-body text-slate-500 mb-10 max-w-md mx-auto">Schedule a private briefing with the PPN team. We'll walk you through our data architecture and benchmark methodology.</p>
                <a
                    href="/waitlist?source=insurance&segment=insurance&type=consultation"
                    className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
                    style={{ background: ACCENT, boxShadow: `0 0 60px ${ACCENT}40`, minHeight: 60 }}
                >
                    Schedule Briefing →
                </a>
                <p className="ppn-meta text-slate-600 mt-6">
                    Psychedelic Practitioner Network &middot;{' '}
                    <a href="/" className="text-slate-500 hover:text-slate-300 transition-colors">ppnportal.net</a>
                </p>
            </section>
        </div>
    );
}
