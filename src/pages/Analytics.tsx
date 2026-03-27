import React, { useState, useEffect, useMemo } from 'react';
import {
    ShieldCheck,
    Printer,
    Activity,
    TrendingUp,
    AlertTriangle,
    Download,
    ChevronDown
} from 'lucide-react';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import ClinicPerformanceRadar from '../components/analytics/ClinicPerformanceRadar';
import PatientConstellation from '../components/analytics/PatientConstellation';
import { MobileAccordion } from '../components/ui/MobileAccordion';

import { GlassmorphicCard } from '../components/ui/GlassmorphicCard';
import { supabase } from '../supabaseClient';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import SafetyBenchmark from '../components/analytics/SafetyBenchmark';


import InsightFeedPanel from '../components/analytics/InsightFeedPanel';

const Analytics = () => {
    const [userEmail, setUserEmail] = useState<string>('');
    const [selectedSubstance, setSelectedSubstance] = useState<string>('all');
    const [selectedDateRange, setSelectedDateRange] = useState<string>('30');
    // WO-675 FIX: hook is now self-contained — no siteId prop needed
    const analytics = useAnalyticsData();


    // Filter data based on selections (Placeholder for when real array data is added)
    const filteredData = useMemo(() => {
        // Since analytics endpoint returns KPI scalars right now, this is a no-op that passes undefined
        // to tell child components to use their internal mock data.
        return undefined;
    }, [analytics, selectedSubstance, selectedDateRange]);

    // Lightweight: fetch only userEmail for print header
    useEffect(() => {
        const fetchEmail = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserEmail(user.email ?? '');
        };
        fetchEmail();
    }, []);

    const handlePrint = () => {
        const prev = document.title;
        document.title = `PPN Clinic Report ${new Date().toISOString().slice(0, 10)}`;
        window.print();
        window.addEventListener('afterprint', () => { document.title = prev; }, { once: true });
    };

    const kpiStats = [
        {
            label: 'Active Protocols',
            value: analytics.loading ? '...' : analytics.activeProtocols.toString(),
            // Only show trend when there are actual protocols to trend on
            trend: (!analytics.loading && analytics.activeProtocols > 0) ? '+12%' : '—',
            icon: Activity,
            color: 'text-blue-400 print:text-blue-700'
        },
        {
            label: 'Patient Alerts',
            value: analytics.loading ? '...' : analytics.patientAlerts.toString(),
            trend: analytics.patientAlerts > 0 ? `${analytics.patientAlerts} active` : '—',
            icon: AlertTriangle,
            color: 'text-amber-400 print:text-amber-700'
        },
        {
            label: 'Network Efficiency',
            value: analytics.loading ? '...' : `${analytics.networkEfficiency}%`,
            // Only show trend when efficiency has real data
            trend: (!analytics.loading && analytics.networkEfficiency > 0) ? '+0.8%' : '—',
            icon: TrendingUp,
            color: 'text-emerald-400 print:text-emerald-700'
        },
        {
            label: 'Risk Score',
            value: analytics.loading ? '...' : analytics.riskScore,
            trend: analytics.riskScore === 'Unknown' ? 'No sessions yet' : 'Stable',
            icon: ShieldCheck,
            color: analytics.riskScore === 'Low' ? 'text-emerald-400 print:text-emerald-700' : analytics.riskScore === 'Medium' ? 'text-amber-400 print:text-amber-700' : 'text-red-400 print:text-red-700'
        }
    ];

    return (
        <PageContainer className="!max-w-7xl space-y-8 animate-in fade-in duration-700 pb-20 pt-8 print:p-0 print:space-y-4 print:bg-white">

            {/* HEADER - Hide on Print */}
            <Section spacing="tight" className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 print:hidden">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl sm:text-5xl font-black tracking-tighter" style={{ color: '#8BA5D3' }}>
                            Clinical Intelligence
                        </h1>
                    </div>
                    <p className="text-xl sm:text-2xl font-medium max-w-4xl leading-relaxed mt-4" style={{ color: '#8B9DC3' }}>
                        Real-time network insights and safety metrics.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={analytics.refetch}
                        disabled={analytics.loading}
                        title={analytics.lastFetchedAt ? `Last updated: ${analytics.lastFetchedAt.toLocaleTimeString()}` : 'Not loaded'}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(56,139,253,0.2)',
                            color: '#6b7a8d',
                            fontSize: 12,
                            padding: '4px 10px',
                            borderRadius: 6,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                        }}
                        className="hover:bg-slate-800/50 transition-colors mr-2"
                    >
                        {analytics.loading ? '...' : '↻ Refresh'}
                    </button>
                </div>
            </Section>

            {/* PRINT HEADER - Visible ONLY on Print */}
            <div className="hidden print:block mb-8 border-b-2 border-black pb-4">
                <h1 className="text-4xl font-black text-black mb-2">Clinical Intelligence Report</h1>
                <div className="flex justify-between text-sm text-slate-600 font-mono">
                    <span>Generated: {new Date().toLocaleDateString()}</span>
                    <span>{userEmail || 'PPN Portal User'}</span>
                </div>
            </div>

            {/* ERROR STATE */}
            {analytics.error && (
                <Section spacing="tight">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-red-400 font-bold">Failed to load analytics</p>
                            <p className="text-red-400/80 text-sm mt-1">{analytics.error}</p>
                        </div>
                    </div>
                </Section>
            )}

            {/* ── KPI RIBBON + SAFETY PERFORMANCE, Unified section ─────────── */}
            <Section spacing="tight" className="space-y-0">

                {/* KPI CARDS — 2x2 grid on mobile, 4-up on lg+ */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 print:grid-cols-4 print:gap-2 mb-0">
                    {kpiStats.map((stat, i) => (
                        <div key={i} className="bg-[#0a0c12]/50 border border-slate-800/50 p-4 rounded-2xl flex flex-col justify-between print:bg-white print:border-gray-200 print:shadow-none" style={{ minHeight: '100px' }}>
                            <div className="flex items-center gap-2 mb-2">
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                <div className="text-xs font-black text-slate-500 uppercase tracking-widest print:text-slate-500">{stat.label}</div>
                            </div>
                            <div className="flex items-baseline gap-2 flex-wrap">
                                <div className={`text-3xl font-black ${stat.color} tracking-tight`}>{stat.value}</div>
                                <div className="text-xs font-bold bg-slate-900/50 px-2 py-0.5 rounded border border-slate-800 print:bg-gray-100 print:text-slate-600 print:border-gray-200" style={{ color: '#8B9DC3' }}>{stat.trend}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* SAFETY PERFORMANCE, Full-width integrated panel */}
                <div className="bg-[#0a0c12]/50 border border-slate-800/50 rounded-2xl p-6 print:bg-white print:border-gray-200 print:shadow-none">
                    {/* Section header inside the panel */}
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-lg font-black tracking-tight" style={{ color: '#A8B5D1' }}>Safety Performance</h2>
                            <p className="text-sm mt-0.5" style={{ color: '#8B9DC3' }}>Your adverse event rate vs. network average · Live Data</p>
                        </div>
                    </div>
                    {/* WO-678: SafetyBenchmark is now self-contained — calls useSafetyBenchmark internally */}
                    <SafetyBenchmark />
                </div>
            </Section>

            {/* ── CLINICAL INTELLIGENCE FEED ─────────────────────────────────────── */}
            <Section spacing="tight" className="print:hidden">
                <MobileAccordion title="Clinical Intelligence Feed" subtitle="AI-prioritized action items" defaultOpen={false}>
                    <div className="bg-[#0a0c12]/50 border border-indigo-500/10 rounded-2xl p-6">
                        <InsightFeedPanel siteId={analytics.siteId} />
                    </div>
                </MobileAccordion>
            </Section>

            {/* FILTER CONTROLS, positioned above charts, hide on print */}
            <Section spacing="tight" className="print:hidden">
                <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center bg-[#0a0c12]/80 border border-slate-800/80 p-3 rounded-2xl backdrop-blur-xl shadow-2xl">
                    <div className="flex items-center gap-2 px-2">
                        <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                            <span className="material-symbols-outlined text-indigo-400 text-lg">tune</span>
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest hidden md:block" style={{ color: '#8B9DC3' }}>Chart Filters</span>
                    </div>

                    <div className="h-6 w-px bg-slate-800 hidden xl:block"></div>

                    <div className="flex-1 flex flex-col md:flex-row gap-2">
                        <select
                            className="bg-black/40 border border-slate-700/50 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:border-indigo-500/50 uppercase tracking-wider"
                            style={{ color: '#8B9DC3' }}
                            value={selectedSubstance}
                            onChange={(e) => setSelectedSubstance(e.target.value)}
                        >
                            <option value="all">All Molecules</option>
                            <option value="psilocybin">Psilocybin</option>
                            <option value="mdma">MDMA</option>
                            <option value="ketamine">Ketamine</option>
                        </select>
                        <select
                            className="bg-black/40 border border-slate-700/50 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:border-indigo-500/50 uppercase tracking-wider"
                            style={{ color: '#8B9DC3' }}
                            value={selectedDateRange}
                            onChange={(e) => setSelectedDateRange(e.target.value)}
                        >
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last 30 Days</option>
                            <option value="90">Last 90 Days</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>
                </div>
            </Section>

            {/* ── DEEP-DIVE INTELLIGENCE INDEX (WO-721) ───────────────────── */}
            <Section spacing="default" className="space-y-8 print:space-y-8">

                {/* Performance Radar — collapsed accordion; deep-dive card links to full page */}
                <MobileAccordion title="Performance Radar" subtitle="Clinic metrics vs Network Average" defaultOpen={false}>
                    <div className="print:break-inside-avoid">
                        <div className="relative overflow-hidden print:shadow-none print:border-gray-200 print:bg-white flex flex-col" style={{ minHeight: '360px' }}>
                            <div className="flex-1 min-h-0 w-full overflow-y-hidden pb-6 md:overflow-x-auto md:overflow-y-hidden md:touch-pan-x md:scrollbar-hide" style={{ minHeight: '300px' }}>
                                <div className="w-full h-full md:min-w-[600px]">
                                    {/* WO-677: ClinicPerformanceRadar is now self-contained -- no data prop */}
                                    <ClinicPerformanceRadar />
                                </div>
                            </div>
                        </div>
                    </div>
                </MobileAccordion>

                {/* Deep-Dive Intelligence Grid */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-base font-black uppercase tracking-widest" style={{ color: '#A8B5D1' }}>
                            Deep-Dive Intelligence
                        </h2>
                        <div className="flex-1 h-px bg-slate-800" />
                        <span className="ppn-meta font-bold text-slate-600 uppercase tracking-widest">11 modules</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {([
                            { path: '/deep-dives/risk-matrix',             icon: '🛡', title: 'Safety Risk Matrix',        desc: 'AE type × CTCAE grade heatmap',          live: true  },
                            { path: '/deep-dives/patient-constellation',   icon: '🌌', title: 'Patient Galaxy',            desc: 'Outcomes clustering by substance',        live: true  },
                            { path: '/deep-dives/patient-flow',            icon: '🔀', title: 'Patient Flow Sankey',       desc: 'Entry-to-exit pathway analysis',         live: true  },
                            { path: '/deep-dives/clinic-performance',      icon: '📡', title: 'Clinic Performance Radar',  desc: 'Benchmarks vs network average',          live: true  },
                            { path: '/deep-dives/safety-surveillance',     icon: '🔭', title: 'Safety Surveillance',       desc: 'Longitudinal AE monitoring',             live: true  },
                            { path: '/deep-dives/protocol-efficiency',     icon: '⏱', title: 'Protocol Efficiency',       desc: 'Session ROI and completion rates',       live: false },
                            { path: '/deep-dives/patient-journey',         icon: '🗺', title: 'Patient Journey',           desc: 'PHQ-9 decay & event timeline',           live: false },
                            { path: '/deep-dives/comparative-efficacy',    icon: '⚖', title: 'Comparative Efficacy',      desc: 'Cross-protocol outcome comparison',      live: false },
                            { path: '/deep-dives/patient-retention',       icon: '🔁', title: 'Patient Retention',         desc: 'Session return rate & drop-off',        live: false },
                            { path: '/deep-dives/molecular-pharmacology',  icon: '🧬', title: 'Molecular Pharmacology',    desc: 'Receptor binding & metabolic risk',      live: false },
                            { path: '/deep-dives/workflow-chaos',          icon: '🌀', title: 'Workflow Chaos Index',      desc: 'Documentation delay & session gaps',     live: false },
                        ] as const).map(({ path, icon, title, desc, live }) => (
                            <a
                                key={path}
                                href={`#${path}`}
                                id={`deep-dive-${path.split('/').pop()}`}
                                className="group flex flex-col gap-3 p-4 bg-[#0a0c10] border border-slate-800 rounded-2xl hover:border-slate-600 hover:bg-slate-800/30 transition-all duration-200 no-underline"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl" aria-hidden="true">{icon}</span>
                                        <span className="ppn-meta font-black text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">
                                            {title}
                                        </span>
                                    </div>
                                    <span className={`shrink-0 ppn-meta font-bold uppercase tracking-widest px-2 py-0.5 rounded-md text-[10px] ${
                                        live
                                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                            : 'bg-slate-800 border border-slate-700 text-slate-500'
                                    }`}>
                                        {live ? 'Live' : 'Sample'}
                                    </span>
                                </div>
                                <p className="ppn-meta text-slate-500 leading-relaxed">{desc}</p>
                            </a>
                        ))}
                    </div>
                </div>

            </Section>



            {/* ── EXPORT REPORT, Bottom of page, prominently placed ─────────── */}
            <Section spacing="tight" className="print:hidden">
                <div className="bg-[#0a0c12]/80 border border-slate-800/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-base font-black" style={{ color: '#A8B5D1' }}>Export Clinical Intelligence Report</h3>
                        <p className="text-sm mt-1" style={{ color: '#8B9DC3' }}>
                            Generate a PDF report of all current analytics, safety metrics, performance benchmarks, and network comparisons.
                        </p>
                    </div>
                    <button
                        onClick={handlePrint}
                        id="export-report-btn"
                        className="flex items-center gap-3 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 font-bold text-sm uppercase tracking-widest whitespace-nowrap shrink-0"
                    >
                        <Printer className="w-5 h-5" />
                        Export PDF Report
                    </button>
                </div>
            </Section>

            {/* PRINT FOOTER */}
            <div className="hidden print:block text-center text-xs text-slate-400 pt-8 border-t border-gray-200 mt-8">
                <p>CONFIDENTIAL: For Clinical Use Only. Generated by PPN Portal.</p>
            </div>

            {/* GLOBAL PRINT STYLES */}
            <style>{`
                @media print {
                    @page {
                        margin: 1.5cm;
                        size: A4 portrait;
                    }
                    body {
                        background: white !important;
                        color: #1e293b !important;
                        font-family: 'Inter', 'Helvetica Neue', sans-serif !important;
                    }
                    /* Force charts to print background colors if needed */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    /* Hide non-essential chrome on print */
                    nav, aside, header.site-header, .print\\:hidden {
                        display: none !important;
                    }
                    /* Override dark backgrounds */
                    .bg-\\[\\#0a0c12\\]\\/50,
                    .bg-\\[\\#0f1218\\] {
                        background: #f8fafc !important;
                        border-color: #e2e8f0 !important;
                    }
                    /* Override dark text colors */
                    .text-slate-500 { color: #475569 !important; }
                    .text-slate-300 { color: #1e293b !important; }
                    /* Make charts visible on white */
                    .recharts-surface { background: transparent; }
                }
            `}</style>
        </PageContainer>
    );
};

export default Analytics;