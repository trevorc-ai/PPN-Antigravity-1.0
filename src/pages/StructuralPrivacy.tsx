import React from 'react';
import { Link } from 'react-router-dom';

// WO-561: Structural Privacy / Zero-PHI Front Door
const ACCENT = '#2dd4bf';
const ACCENT_BG = 'rgba(45,212,191,0.08)';
const ACCENT_BORDER = 'rgba(45,212,191,0.25)';

const ARCH_STEPS = [
    { step: '01', title: 'Patient Arrives', body: 'A non-reversible Subject ID is assigned. No name, DOB, or contact info ever enters PPN.' },
    { step: '02', title: 'Session Documented', body: 'Every clinical selection is a foreign-key integer pointing to a reference table. No free text. Structurally impossible.' },
    { step: '03', title: 'Data Enters Network', body: 'Only anonymized schema-stable records reach the benchmark layer. A full DB export reveals zero patient identities.' },
    { step: '04', title: 'Practitioner Controls', body: 'The Subject ID mapping lives locally with the practitioner. PPN cannot de-anonymize — this is a one-way constraint.' },
];

const FEATURES = [
    {
        title: 'Policy vs. Structural Protection',
        body: 'HIPAA is a policy. Zero-PHI is an architectural constraint. PHI cannot enter our tables — they only accept foreign-key IDs.',
    },
    {
        title: 'Non-Reversible Subject IDs',
        body: 'Even if PPN is subpoenaed, we cannot produce patient names — we were architecturally prevented from storing them.',
    },
    {
        title: 'HIPAA Safe Harbor Compliant',
        body: 'All 18 HIPAA Safe Harbor identifiers excluded by schema design. No demographic inference pathways.',
    },
    {
        title: 'No Free Text, Ever',
        body: 'Every input resolves to a pre-validated categorical option. Free-text injection of PII is architecturally blocked.',
    },
    {
        title: 'Row-Level Security (RLS)',
        body: 'Supabase RLS ensures practitioners only access their own session records. Cross-site data leakage blocked at the DB layer.',
    },
    {
        title: 'Immutable Audit Trail',
        body: 'Every write is a permanent, timestamped, append-only record. Nothing edited in place. Nothing deleted.',
    },
];

export default function StructuralPrivacy() {
    return (
        <div className="min-h-screen bg-[#0a1628] text-slate-300">
            <title>Zero-PHI Structural Privacy | PPN</title>
            <meta name="description" content="PPN Zero-PHI architecture. Privacy built into the database schema, not just policy. HIPAA Safe Harbor compliant by design." />

            {/* Nav */}
            <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
                <Link to="/landing" className="flex items-center gap-2 group" aria-label="PPN Home">
                    <span className="text-sm font-black tracking-widest uppercase text-slate-200 group-hover:text-white transition-colors">PPN</span>
                    <span className="ppn-meta text-slate-500">/ Privacy</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link to="/data-policy" className="ppn-meta text-slate-400 hover:text-slate-200 transition-colors hidden sm:block">Data Policy</Link>
                    <a href="/waitlist?source=privacy&segment=privacy"
                        className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                        style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, color: ACCENT }}>
                        Request Whitepaper
                    </a>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative overflow-hidden px-6 pt-16 pb-28 text-center">
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% -10%, ${ACCENT}18 0%, transparent 65%)` }} />
                <div className="relative z-10 max-w-3xl mx-auto">
                    <span className="inline-block px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-6"
                        style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, color: ACCENT }}>
                        Structural Privacy
                    </span>
                    <h1 className="ppn-page-title mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.15 }}>
                        Zero-PHI<br /><span style={{ color: ACCENT }}>by Architecture, Not Policy</span>
                    </h1>
                    <p className="ppn-body text-slate-400 max-w-xl mx-auto mb-10" style={{ lineHeight: 1.7 }}>
                        Privacy is not a promise we make. It is a constraint we build into the database. No patient names, no free text, no PII — because the schema makes it impossible.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {['Zero-PHI Architecture', 'No PII Storage', 'HIPAA Safe Harbor', 'Immutable Records', 'Row Level Security'].map(p => (
                            <span key={p} className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>{p}</span>
                        ))}
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href="/waitlist?source=privacy&segment=privacy"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all active:scale-95"
                            style={{ background: ACCENT, boxShadow: `0 0 50px ${ACCENT}40`, minHeight: 56, color: '#0a1628' }}
                            aria-label="Request Architecture Whitepaper">
                            Request Whitepaper →
                        </a>
                        <Link to="/data-policy"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-slate-300 text-base transition-all active:scale-95"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', minHeight: 56 }}>
                            Read Data Policy
                        </Link>
                    </div>
                </div>
            </section>

            {/* Architecture Walkthrough */}
            <section className="border-y border-slate-800/60 bg-slate-900/30 px-6 py-20">
                <div className="max-w-5xl mx-auto">
                    <h2 className="ppn-section-title text-center mb-4">How Zero-PHI Works in Practice</h2>
                    <p className="ppn-body text-slate-500 text-center mb-14 max-w-lg mx-auto">A session flows through PPN without a single piece of patient identity touching the database.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {ARCH_STEPS.map(s => (
                            <div key={s.step} className="rounded-2xl p-6"
                                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                <div className="text-5xl font-black mb-4 leading-none" style={{ color: ACCENT, opacity: 0.35 }}>{s.step}</div>
                                <h3 className="ppn-card-title mb-2 text-slate-200">{s.title}</h3>
                                <p className="ppn-body text-slate-500">{s.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="max-w-6xl mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="ppn-section-title mb-3">Every Layer of the Privacy Stack</h2>
                    <p className="ppn-body text-slate-500 max-w-lg mx-auto">From schema design to Row Level Security, no gap in the protection model.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map(f => (
                        <div key={f.title} className="rounded-2xl p-6 hover:border-teal-500/30 transition-all duration-300"
                            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                            <h3 className="ppn-card-title mb-2 text-slate-200" style={{ color: ACCENT }}>{f.title}</h3>
                            <p className="ppn-body text-slate-500">{f.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="text-center px-6 py-28 border-t border-slate-800/60" style={{ background: 'rgba(45,212,191,0.03)' }}>
                <h2 className="ppn-section-title mb-4">Endorse a platform built for privacy advocates.</h2>
                <p className="ppn-body text-slate-500 mb-10 max-w-md mx-auto">Request our architecture whitepaper or schedule a technical briefing with your privacy or legal team.</p>
                <a href="/waitlist?source=privacy&segment=privacy"
                    className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl font-bold text-base transition-all active:scale-95"
                    style={{ background: ACCENT, boxShadow: `0 0 60px ${ACCENT}40`, minHeight: 60, color: '#0a1628' }}>
                    Request Architecture Whitepaper →
                </a>
                <p className="ppn-meta text-slate-600 mt-6">
                    Psychedelic Practitioner Network &middot;{' '}
                    <a href="/" className="text-slate-500 hover:text-slate-300 transition-colors">ppnportal.net</a>
                </p>
            </section>
        </div>
    );
}
