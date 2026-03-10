import React from 'react';
import { Link } from 'react-router-dom';

// WO-559: Clinical Front Door — For Clinicians & Practitioners
// Accent: Indigo (Phase 1 color per PPN design system)
const ACCENT = '#6366f1';
const ACCENT_BG = 'rgba(99,102,241,0.08)';
const ACCENT_BORDER = 'rgba(99,102,241,0.25)';

const STATS = [
    { value: '10+', label: 'Landmark Cohort Studies' },
    { value: '40+', label: 'Countries in Network' },
    { value: 'Zero', label: 'PHI Ever Stored' },
    { value: '100%', label: 'Schema-Stable Records' },
];

const FEATURES = [
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        title: 'Structured Protocol Builder',
        body: 'Every session phase — intake, set & setting, dosing, integration — documented in a clinically validated, schema-stable format. No free text. No ambiguity.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        title: 'Structural Liability Shield',
        body: 'Subject IDs, not names. Foreign-key IDs, not free text. Patient identity is architecturally impossible to store — this is not a policy, it is a constraint.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
            </svg>
        ),
        title: 'Real-Time Network Benchmarks',
        body: 'Compare your outcomes against 10+ landmark cohort studies and the global practitioner network in real time. Every session makes you a more informed clinician.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM2 20c0-4.4 4.5-8 10-8s10 3.6 10 8" />
                <path d="M16 11c2.5 1.3 4 3.4 4 5.5" />
            </svg>
        ),
        title: 'Drug Interaction Checker',
        body: 'Clinical-grade contraindication screening for psychedelic substances against common psychiatric medications. Flag risks before they become adverse events.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8m-4-4v4" />
            </svg>
        ),
        title: 'Live Session Dashboard',
        body: 'Monitor patient vitals, log real-time events, and track the dosing timeline during Phase 2. A clinical command center built for the 8-hour session.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
            </svg>
        ),
        title: 'Compliance-Ready Exports',
        body: 'Generate PDF clinical reports, CSV outcome summaries, and audit-ready logs for regulatory, research, and institutional review boards.',
    },
];

const PROOF_ITEMS = [
    '"Finally, a documentation system that thinks the way I do about clinical safety." — Beta Practitioner, Licensed Psychedelic Therapist',
    '"The interaction checker alone saved us from a dangerous combination I almost missed." — Clinical Director, Psilocybin Clinic',
    '"I used to spend 2 hours per session on notes. PPN cut that to 20 minutes with better data." — MDMA Therapist, Research Programme',
];

export default function ForClinicians() {
    return (
        <div className="min-h-screen bg-[#0a1628] text-slate-300">
            <title>For Clinicians & Practitioners | PPN</title>
            <meta name="description" content="PPN clinical documentation platform for psychedelic therapy practitioners. Zero-PHI, structured, HIPAA-safe. Replace your spreadsheets with a clinical intelligence layer." />

            {/* ── Nav ──────────────────────────────────────────────── */}
            <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
                <Link to="/landing" className="flex items-center gap-2 group" aria-label="PPN Home">
                    <span className="text-sm font-black tracking-widest uppercase text-slate-200 group-hover:text-white transition-colors">PPN</span>
                    <span className="ppn-meta text-slate-500">/ Clinicians</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="ppn-meta text-slate-400 hover:text-slate-200 transition-colors hidden sm:block">Sign In</Link>
                    <a
                        href="/signup?source=clinical&segment=clinical"
                        className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                        style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, color: ACCENT }}
                    >
                        Request Beta Invite
                    </a>
                </div>
            </nav>

            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="relative overflow-hidden px-6 pt-16 pb-28 text-center">
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% -10%, ${ACCENT}22 0%, transparent 65%)` }} />

                <div className="relative z-10 max-w-3xl mx-auto">
                    <span
                        className="inline-block px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-6"
                        style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, color: ACCENT }}
                    >
                        For Clinicians &amp; Practitioners
                    </span>

                    <h1 className="ppn-page-title mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.15 }}>
                        The Clinical Layer<br />
                        <span style={{ color: ACCENT }}>Psychedelic Therapy Deserves</span>
                    </h1>

                    <p className="ppn-body text-slate-400 max-w-xl mx-auto mb-10" style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
                        Replace your spreadsheets and sticky notes with a Zero-PHI, structured documentation platform built for every phase of the psychedelic therapy arc — from intake to integration.
                    </p>

                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {['Zero-PHI Architecture', 'Structured Protocol Builder', 'Drug Interaction Checker', 'HIPAA Safe Harbor', 'Live Session Tracking'].map(p => (
                            <span key={p} className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                {p}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="/signup?source=clinical&segment=clinical"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
                            style={{ background: ACCENT, boxShadow: `0 0 50px ${ACCENT}40`, minHeight: 56 }}
                            aria-label="Request Beta Invite"
                        >
                            Request Beta Invite →
                        </a>
                        <Link
                            to="/partner-demo"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-slate-300 text-base transition-all active:scale-95"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', minHeight: 56 }}
                        >
                            View Live Demo
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
                    <h2 className="ppn-section-title mb-3">Built for the Full Arc of Care</h2>
                    <p className="ppn-body text-slate-500 max-w-lg mx-auto">Every clinical tool you need, in one platform: from first consultation to final integration note.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map(f => (
                        <div key={f.title} className="rounded-2xl p-6 group hover:border-indigo-500/30 transition-all duration-300"
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

            {/* ── Trust / Proof ────────────────────────────────────── */}
            <section className="border-t border-slate-800/60 px-6 py-24" style={{ background: 'rgba(99,102,241,0.04)' }}>
                <div className="max-w-4xl mx-auto">
                    <h2 className="ppn-section-title text-center mb-12">From the Clinical Community</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {PROOF_ITEMS.map((q, i) => (
                            <blockquote key={i} className="rounded-2xl p-6"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                <p className="ppn-body text-slate-400 italic leading-relaxed">{q}</p>
                            </blockquote>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Bottom CTA ───────────────────────────────────────── */}
            <section className="text-center px-6 py-28">
                <h2 className="ppn-section-title mb-4">Ready to upgrade your clinical documentation?</h2>
                <p className="ppn-body text-slate-500 mb-10 max-w-md mx-auto">Join the exclusive beta. Limited spots for licensed practitioners in the first cohort.</p>
                <a
                    href="/signup?source=clinical&segment=clinical"
                    className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
                    style={{ background: ACCENT, boxShadow: `0 0 60px ${ACCENT}40`, minHeight: 60 }}
                >
                    Request Beta Invite →
                </a>
                <p className="ppn-meta text-slate-600 mt-6">
                    Psychedelic Practitioner Network &middot;{' '}
                    <a href="/" className="text-slate-500 hover:text-slate-300 transition-colors">ppnportal.net</a>
                </p>
            </section>
        </div>
    );
}
