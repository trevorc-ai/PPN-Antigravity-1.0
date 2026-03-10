import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

// Inline star field — uses absolute (not fixed) so it clips inside the hero's overflow-hidden boundary.
// StarField component uses fixed inset-0 which overlaps all subsequent page sections.
function HeroStars() {
    const stars = useMemo(() => {
        let seed = 2718281;
        const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };
        return Array.from({ length: 160 }, (_, i) => {
            const brightness = Math.pow(rand(), 2.5);
            return { x: rand() * 100, y: rand() * 100, r: 0.3 + rand() * 1.6, op: 0.05 + brightness * 0.75, i };
        });
    }, []);
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="absolute inset-0 bg-[#07101e]" />
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {stars.map(s => (
                    <circle key={s.i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white">
                        <animate attributeName="opacity"
                            values={`${s.op.toFixed(3)};${(s.op * 0.12).toFixed(3)};${s.op.toFixed(3)}`}
                            dur={`${14 + (s.i % 23) * 1.3}s`} begin={`${(s.i % 19) * 1.1}s`}
                            repeatCount="indefinite" calcMode="spline"
                            keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
                    </circle>
                ))}
            </svg>
        </div>
    );
}

// WO-562: Global Research Network Front Door
const ACCENT = '#8b5cf6';
const ACCENT_BG = 'rgba(139,92,246,0.08)';
const ACCENT_BORDER = 'rgba(139,92,246,0.25)';

const STATS = [
    { value: '10+', label: 'Landmark Cohort Studies' },
    { value: '40+', label: 'Countries in Network' },
    { value: '5K+', label: 'Harmonized Data Points' },
    { value: '1', label: 'Shared Outcome Ontology' },
];

const COHORTS = [
    { name: 'MAPS Phase 3', substance: 'MDMA-AT', n: '90+', condition: 'PTSD' },
    { name: 'Imperial College London', substance: 'Psilocybin', n: '30+', condition: 'Depression' },
    { name: 'Johns Hopkins CMCP', substance: 'Psilocybin', n: '200+', condition: 'Multiple' },
    { name: 'NYU Langone', substance: 'Psilocybin', n: '29+', condition: 'AUD' },
    { name: 'Compass Pathways', substance: 'COMP360', n: '233+', condition: 'TRD' },
    { name: '+ 5 additional open cohorts', substance: 'Various', n: '—', condition: 'Various' },
];

const FEATURES = [
    {
        title: 'Landmark Study Integration',
        body: 'PPN harmonizes published outcome data from MAPS Phase 3 MDMA trials, Imperial College psilocybin cohorts, and 8+ other landmark datasets into a single queryable layer.',
    },
    {
        title: 'Protocol Harmonization',
        body: 'A shared ontology for substance, protocol, and outcome variables, enabling apples-to-apples comparison across institutions and national borders.',
    },
    {
        title: 'Citizen Science Contribution',
        body: 'Each anonymized session logged by a PPN practitioner enriches the global benchmark, turning clinical practice into real-world evidence that matters.',
    },
    {
        title: 'Policy Advocacy Intelligence',
        body: 'Aggregate outcome trends by regulatory jurisdiction. Support evidence-based advocacy with population-level safety and efficacy data.',
    },
    {
        title: 'Cross-Border Safety Signals',
        body: 'Adverse event detection across 40+ countries in real time. Identify rare safety signals that only appear at global scale.',
    },
    {
        title: 'Open Research Access',
        body: 'Qualified researchers can apply for anonymized aggregate data access. Accelerate the evidence base without exposing individual records.',
    },
];

export default function GlobalNetwork() {
    return (
        <div className="min-h-screen bg-[#0a1628] text-slate-300">
            <title>Global Research Network | PPN</title>
            <meta name="description" content="PPN Global Research Network: planetary-scale psychedelic therapy outcome intelligence. 10+ landmark cohorts, 40+ countries, one harmonized benchmark layer for researchers and policy advocates." />

            {/* Nav */}
            <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto relative z-20">
                <Link to="/landing" className="flex items-center gap-2 group" aria-label="PPN Home">
                    <span className="text-sm font-black tracking-widest uppercase text-slate-200 group-hover:text-white transition-colors">PPN</span>
                    <span className="ppn-meta text-slate-500">/ Global Network</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="ppn-meta text-slate-400 hover:text-slate-200 transition-colors hidden sm:block">Sign In</Link>
                    <a href="/waitlist?source=global&segment=global&type=research"
                        className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                        style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, color: ACCENT }}>
                        Apply for Access
                    </a>
                </div>
            </nav>

            {/* Hero with StarField */}
            <section className="relative overflow-hidden px-6 pt-16 pb-28 text-center">
                <HeroStars />
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${ACCENT}20 0%, transparent 65%)` }} />
                <div className="relative z-10 max-w-3xl mx-auto">
                    <span className="inline-block px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-6"
                        style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, color: ACCENT }}>
                        Global Research Network
                    </span>
                    <h1 className="ppn-page-title mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.15 }}>
                        Planetary-Scale<br /><span style={{ color: ACCENT }}>Clinical Intelligence</span>
                    </h1>
                    <p className="ppn-body text-slate-400 max-w-xl mx-auto mb-10" style={{ lineHeight: 1.7 }}>
                        The first schema-stable, cross-border psychedelic therapy outcome database. 10+ landmark cohorts. 40+ countries. One harmonized benchmark layer that turns every session into global evidence.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {['10+ Cohort Studies', '40+ Countries', 'Global Benchmark', 'Protocol Harmonization', 'Policy Intelligence'].map(p => (
                            <span key={p} className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>{p}</span>
                        ))}
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href="/waitlist?source=global&segment=global&type=research"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
                            style={{ background: ACCENT, boxShadow: `0 0 50px ${ACCENT}40`, minHeight: 56 }}
                            aria-label="Apply for Research Access">
                            Apply for Research Access →
                        </a>
                        <Link to="/partner-demo"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-slate-300 text-base transition-all active:scale-95"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', minHeight: 56 }}>
                            View Live Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
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

            {/* Cohort Table */}
            <section className="max-w-5xl mx-auto px-6 py-24">
                <div className="text-center mb-12">
                    <h2 className="ppn-section-title mb-3">Integrated Landmark Cohorts</h2>
                    <p className="ppn-body text-slate-500 max-w-lg mx-auto">PPN harmonizes published open-access outcome datasets into a single, queryable benchmark layer.</p>
                </div>
                <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="grid grid-cols-4 px-6 py-3 ppn-meta text-slate-500 uppercase tracking-widest"
                        style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <span>Study</span><span>Substance</span><span>N</span><span>Indication</span>
                    </div>
                    {COHORTS.map((c, i) => (
                        <div key={c.name} className="grid grid-cols-4 px-6 py-4 transition-colors hover:bg-white/[0.02]"
                            style={{ borderBottom: i < COHORTS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                            <span className="ppn-body text-slate-300 font-semibold">{c.name}</span>
                            <span className="ppn-body text-slate-400">{c.substance}</span>
                            <span className="ppn-body font-bold" style={{ color: ACCENT }}>{c.n}</span>
                            <span className="ppn-body text-slate-400">{c.condition}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="border-t border-slate-800/60 px-6 py-24" style={{ background: 'rgba(139,92,246,0.04)' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="ppn-section-title mb-3">Built for Researchers &amp; Policy Advocates</h2>
                        <p className="ppn-body text-slate-500 max-w-lg mx-auto">From individual session data to population-level intelligence: PPN bridges the clinical-research gap.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map(f => (
                            <div key={f.title} className="rounded-2xl p-6 hover:border-violet-500/30 transition-all duration-300"
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
                <h2 className="ppn-section-title mb-4">Apply to join the global research network.</h2>
                <p className="ppn-body text-slate-500 mb-10 max-w-md mx-auto">Qualified researchers and policy advocates can apply for aggregate data access during our beta programme.</p>
                <a href="/waitlist?source=global&segment=global&type=research"
                    className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
                    style={{ background: ACCENT, boxShadow: `0 0 60px ${ACCENT}40`, minHeight: 60 }}>
                    Apply for Research Access →
                </a>
                <p className="ppn-meta text-slate-600 mt-6">
                    Psychedelic Practitioner Network &middot;{' '}
                    <a href="/" className="text-slate-500 hover:text-slate-300 transition-colors">ppnportal.net</a>
                </p>
            </section>
        </div>
    );
}
