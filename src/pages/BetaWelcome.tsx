import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Network, Shield, BarChart3, Users } from 'lucide-react';

// WO-585 / GO-585: Beta Welcome Screen
// Public route: /beta-welcome?name=FirstName
// No auth required. Routes to /analytics on CTA.
// LEAD Q1: hardcoded "1,500+" benchmark count.
// GROWTH: All ppn-ui-standards violations corrected per GO-585_BetaWelcome_Content_Matrix.md

const BENCHMARK_COUNT = '1,500+';

// JSON-LD schema for Google AI Overview extraction (marketing-qa-checklist §1)
const JSON_LD = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: 'Psychedelic Practitioner Network',
    url: 'https://ppnportal.net',
    description:
        'The Psychedelic Practitioner Network (PPN) Portal is the first clinical documentation and network intelligence platform built for psychedelic therapy practitioners, enabling secure, zero-PHI outcome tracking and real-time global benchmarking.',
});

const BetaWelcome: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const name = searchParams.get('name') || '';

    const [visible, setVisible] = useState(false);

    // Entrance animation
    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(timer);
    }, []);

    // SEO: set document title on mount (pattern per ForClinicians.tsx)
    useEffect(() => {
        const prev = document.title;
        document.title = 'PPN Portal - Founding Member Access';
        return () => { document.title = prev; };
    }, []);

    const handleEnter = () => {
        navigate('/analytics');
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] px-4 py-12 relative overflow-hidden">

            {/* SEO meta (marketing-qa-checklist §1) */}
            <meta
                name="description"
                content="You have been selected for early access to the PPN Portal. 1,500+ real clinical outcome records, zero-PHI by design, built for psychedelic therapy practitioners."
            />

            {/* JSON-LD MedicalOrganization schema (marketing-qa-checklist §1) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON_LD }}
            />

            {/* Ambient background glows */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-indigo-600/10 blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[300px] rounded-full bg-teal-500/6 blur-[100px]" />
                <div className="absolute top-1/3 left-0 w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[80px]" />
            </div>

            {/* Main card wrapper */}
            <div
                className="relative z-10 w-full max-w-lg transition-all duration-700 ease-out"
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(16px)',
                }}
            >
                {/* FIX 1: Badge - ppn-body min (was text-xs, banned by ppn-ui-standards §2) */}
                <div className="flex justify-center mb-8">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 ppn-body font-bold tracking-widest uppercase">
                        <Shield className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        Founding Member Access
                    </span>
                </div>

                {/* FIX 7: Glass card - mandated pattern (was rounded-3xl/border-slate-700/50) */}
                <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 shadow-2xl shadow-black/40">

                    {/* PPN logomark */}
                    <div className="flex justify-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-900/40 border border-indigo-500/30 flex items-center justify-center">
                            <Network className="w-7 h-7 text-indigo-400" aria-hidden="true" />
                        </div>
                    </div>

                    {/* Greeting - single h1 on page (marketing-qa-checklist §1) */}
                    <div className="text-center mb-8">
                        {name ? (
                            <>
                                {/* FIX 8: Active voice (was "You've been given") */}
                                <p className="ppn-body text-slate-400 mb-2">Welcome back,</p>
                                <h1 className="ppn-page-title text-slate-100 mb-4">{name}.</h1>
                            </>
                        ) : (
                            <h1 className="ppn-page-title text-slate-100 mb-4">Welcome.</h1>
                        )}
                        {/* FIX 2+3: em dashes removed, replaced with commas (ppn-ui-standards §4) */}
                        <p className="ppn-body text-slate-400 leading-relaxed">
                            You are seeing the PPN Portal before anyone else. This is the first clinical
                            documentation and network intelligence platform built for psychedelic therapy
                            practitioners, and the data you are about to see is real.
                        </p>
                    </div>

                    {/* Benchmark stat callout */}
                    <div className="mb-8 p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-center">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <BarChart3 className="w-5 h-5 text-indigo-400 shrink-0" aria-hidden="true" />
                            <span className="ppn-section-title text-slate-100 tracking-tight">{BENCHMARK_COUNT}</span>
                        </div>
                        {/* FIX 2: em dash in "records — live" removed, replaced with comma */}
                        <p className="ppn-body text-indigo-300/90">
                            anonymized clinical outcome records, live in the network now.
                        </p>
                    </div>

                    {/* FIX 4: Social proof - ppn-body (was ppn-meta, 12px, banned) */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <Users className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                        <p className="ppn-body text-slate-500">
                            You are among the first practitioners to see the network.
                        </p>
                    </div>

                    {/* Primary CTA - internal link to /analytics (marketing-qa-checklist §2) */}
                    <button
                        id="beta-welcome-enter-btn"
                        onClick={handleEnter}
                        className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-indigo-700/60 hover:bg-indigo-600/70 border border-indigo-500/50 hover:border-indigo-400/60 text-indigo-100 font-black text-base uppercase tracking-widest shadow-lg shadow-indigo-900/30 transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                        aria-label="Enter the PPN Network"
                    >
                        Enter the Network
                        <ArrowRight className="w-5 h-5" aria-hidden="true" />
                    </button>

                    {/* FIX 5: ppn-body min (was ppn-meta, 12px, banned) */}
                    <p className="ppn-body text-center text-slate-600 mt-6">
                        Your access is active. No setup required.
                    </p>
                </div>

                {/* FIX 6: ppn-body min (was ppn-meta, 12px, banned) */}
                <p className="ppn-body text-center text-slate-600 mt-8 tracking-widest uppercase">
                    Psychedelic Practitioner Network
                </p>
            </div>
        </div>
    );
};

export default BetaWelcome;
