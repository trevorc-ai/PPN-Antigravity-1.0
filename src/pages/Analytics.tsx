import React, { useState, useEffect, useMemo } from 'react';
import {
    ShieldCheck,
    Printer,
    Download,
    Share2,
    Activity,
    TrendingUp,
    Users,
    AlertTriangle
} from 'lucide-react';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import ClinicPerformanceRadar from '../components/analytics/ClinicPerformanceRadar';
import PatientConstellation from '../components/analytics/PatientConstellation';

import { GlassmorphicCard } from '../components/ui/GlassmorphicCard';
import { supabase } from '../supabaseClient';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import SafetyBenchmark from '../components/analytics/SafetyBenchmark';
import { useSafetyBenchmark } from '../hooks/useSafetyBenchmark';
import GlobalBenchmarkIntelligence from '../components/analytics/GlobalBenchmarkIntelligence';
import InsightFeedPanel from '../components/analytics/InsightFeedPanel';

const Analytics = () => {
    const [siteId, setSiteId] = useState<number | null>(null);
    const [userEmail, setUserEmail] = useState<string>('');
    const [selectedSubstance, setSelectedSubstance] = useState<string>('all');
    const [selectedDateRange, setSelectedDateRange] = useState<string>('30');
    const analytics = useAnalyticsData(siteId);
    const { benchmark, loading: benchmarkLoading } = useSafetyBenchmark();

    // Filter data based on selections (Placeholder for when real array data is added)
    const filteredData = useMemo(() => {
        // Since analytics endpoint returns KPI scalars right now, this is a no-op that passes undefined
        // to tell child components to use their internal mock data.
        return undefined;
    }, [analytics, selectedSubstance, selectedDateRange]);

    useEffect(() => {
        const fetchUserSite = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUserEmail(user.email ?? '');

            const { data: userSite } = await supabase
                .from('log_user_sites')
                .select('site_id')
                .eq('user_id', user.id)
                .limit(1)
                .single();

            if (userSite) setSiteId(userSite.site_id);
        };

        fetchUserSite();
    }, []);
    const handlePrint = () => {
        window.print();
    };

    return (
        <PageContainer className="!max-w-7xl space-y-8 animate-in fade-in duration-700 pb-20 pt-8 print:p-0 print:space-y-4 print:bg-white">

            {/* HEADER - Hide on Print (except limits) */}
            <Section spacing="tight" className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 print:hidden">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-5xl font-black tracking-tighter" style={{ color: '#8BA5D3' }}>
                            Clinical Intelligence
                        </h1>
                    </div>
                    <p className="text-xl sm:text-2xl font-medium max-w-4xl leading-relaxed mt-4" style={{ color: '#8B9DC3' }}>
                        Real-time network insights and safety metrics.
                    </p>
                </div>

                <div className="flex items-center gap-4">
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
                    <button
                        onClick={handlePrint}
                        className="hidden md:flex p-3 bg-indigo-600 hover:bg-indigo-500 text-slate-300 rounded-xl items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        <Printer className="w-5 h-5" />
                        <span className="font-bold">Export Report</span>
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



            {/* KPI RIBBON */}
            <Section spacing="tight" className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2">
                {[
                    {
                        label: 'Active Protocols',
                        value: analytics.loading ? '...' : analytics.activeProtocols.toString(),
                        trend: '+12%',
                        icon: Activity,
                        color: 'text-blue-400 print:text-blue-700'
                    },
                    {
                        label: 'Patient Alerts',
                        value: analytics.loading ? '...' : analytics.patientAlerts.toString(),
                        trend: analytics.patientAlerts > 0 ? `${analytics.patientAlerts}` : '0',
                        icon: AlertTriangle,
                        color: 'text-amber-400 print:text-amber-700'
                    },
                    {
                        label: 'Network Efficiency',
                        value: analytics.loading ? '...' : `${analytics.networkEfficiency}%`,
                        trend: '+0.8%',
                        icon: TrendingUp,
                        color: 'text-emerald-400 print:text-emerald-700'
                    },
                    {
                        label: 'Risk Score',
                        value: analytics.loading ? '...' : analytics.riskScore,
                        trend: 'Stable',
                        icon: ShieldCheck,
                        color: analytics.riskScore === 'Low' ? 'text-emerald-400 print:text-emerald-700' : analytics.riskScore === 'Medium' ? 'text-amber-400 print:text-amber-700' : 'text-red-400 print:text-red-700'
                    }
                ].map((stat, i) => (
                    <div key={i} className="bg-[#0a0c12]/50 border border-slate-800/50 p-4 rounded-2xl h-full flex flex-col justify-between print:bg-white print:border-gray-200 print:shadow-none">
                        <div className="flex items-center gap-2 mb-2">
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            <div className="text-xs font-black text-slate-500 uppercase tracking-widest print:text-slate-500">{stat.label}</div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className={`text-3xl font-black ${stat.color} tracking-tight`}>{stat.value}</div>
                            <div className="text-xs font-bold bg-slate-900/50 px-2 py-0.5 rounded border border-slate-800 print:bg-gray-100 print:text-slate-600 print:border-gray-200" style={{ color: '#8B9DC3' }}>{stat.trend}</div>
                        </div>
                    </div>
                ))}
            </Section>

            {/* SAFETY PERFORMANCE BENCHMARK */}
            <Section spacing="tight">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight" style={{ color: '#A8B5D1' }}>Safety Performance</h2>
                        <p className="text-sm mt-1" style={{ color: '#8B9DC3' }}>Your adverse event rate vs. network average</p>
                    </div>
                    {!benchmark && !benchmarkLoading && (
                        <span className="text-xs font-black px-3 py-1.5 rounded-full border bg-indigo-500/10 border-indigo-500/30 text-indigo-400 uppercase tracking-widest">
                            Preview — sample data
                        </span>
                    )}
                </div>

                <div className="bg-[#0a0c12]/50 border border-slate-800/50 rounded-2xl p-6">
                    {benchmarkLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-4"></div>
                                <p className="text-sm" style={{ color: '#8B9DC3' }}>Loading safety benchmark...</p>
                            </div>
                        </div>
                    ) : benchmark ? (
                        <SafetyBenchmark
                            practitionerRate={benchmark.practitioner_adverse_event_rate}
                            networkRate={benchmark.network_average_rate}
                            totalSessions={benchmark.total_sessions}
                            adverseEvents={benchmark.adverse_events}
                            percentile={benchmark.percentile}
                            status={benchmark.status}
                        />
                    ) : (
                        /* No data yet — show sample / preview state */
                        <SafetyBenchmark />
                    )}
                </div>
            </Section>


            {/* GLOBAL BENCHMARK INTELLIGENCE — Live data from ref_benchmark_cohorts + ref_benchmark_trials */}
            <Section spacing="tight" className="print:break-inside-avoid">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight" style={{ color: '#A8B5D1' }}>Global Benchmark Intelligence</h2>
                        <p className="text-sm mt-1" style={{ color: '#8B9DC3' }}>Your outcomes grounded in worldwide published clinical evidence</p>
                    </div>
                    <span className="text-xs font-black px-3 py-1.5 rounded-full border bg-emerald-500/10 border-emerald-500/30 text-emerald-400 uppercase tracking-widest">
                        Live Data
                    </span>
                </div>
                <div className="bg-[#0a0c12]/50 border border-slate-800/50 rounded-2xl p-6">
                    <GlobalBenchmarkIntelligence alwaysShow={true} />
                </div>
            </Section>

            {/* ── CLINICAL INTELLIGENCE FEED ─────────────────────────────────────── */}
            <Section spacing="tight" className="print:hidden">
                <div className="bg-[#0a0c12]/50 border border-indigo-500/10 rounded-2xl p-6">
                    <InsightFeedPanel siteId={siteId} />
                </div>
            </Section>

            {/* FILTER CONTROLS — positioned above charts, hide on print */}
            <Section spacing="tight" className="print:hidden">
                <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center bg-[#0a0c12]/80 border border-slate-800/80 p-3 rounded-2xl backdrop-blur-xl shadow-2xl">
                    <div className="flex items-center gap-2 px-2">
                        <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                            <span className="material-symbols-outlined text-indigo-400 text-lg">tune</span>
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest hidden md:block" style={{ color: '#8B9DC3' }}>Filters</span>
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

            {/* ── COMPONENT GRID ──────────────────────────────────────────────── */}
            <Section spacing="default" className="space-y-8 print:space-y-8">

                {/* ROW 1: Performance Radar — full width, 3-col internal grid */}
                <div className="print:break-inside-avoid">
                    <GlassmorphicCard className="min-h-[520px] h-auto lg:h-[520px] relative overflow-hidden print:h-[420px] print:shadow-none print:border-gray-200 print:bg-white">
                        <div className="absolute top-6 left-6 z-10">
                            <h3 className="text-lg font-black print:text-black" style={{ color: '#A8B5D1' }}>Performance Radar</h3>
                            <p className="text-sm print:text-slate-500" style={{ color: '#8B9DC3' }}>Clinic metrics vs Network Average</p>
                        </div>
                        <ClinicPerformanceRadar data={filteredData} />
                    </GlassmorphicCard>
                </div>

                {/* ROW 2: Patient Galaxy — full width, large scatter + filter controls */}
                <div className="print:break-inside-avoid">
                    <GlassmorphicCard className="min-h-[580px] h-auto lg:h-[580px] relative overflow-hidden print:h-[480px] print:shadow-none print:border-gray-200 print:bg-white">
                        <div className="absolute top-6 left-6 z-10" aria-hidden="true">
                            <p className="text-lg font-black print:text-black" style={{ color: '#A8B5D1' }}>Patient Galaxy</p>
                            <p className="text-sm print:text-slate-500" style={{ color: '#8B9DC3' }}>Outcomes clustering analysis</p>
                        </div>
                        <PatientConstellation data={filteredData} />
                    </GlassmorphicCard>
                </div>



            </Section>

            {/* MOBILE-ONLY: Export button at bottom — easier to reach on phone */}
            <div className="md:hidden flex justify-center pb-4 print:hidden">
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-slate-300 rounded-xl transition-colors shadow-lg shadow-indigo-500/20 font-bold"
                >
                    <Printer className="w-5 h-5" />
                    Export Report
                </button>
            </div>

            {/* PRINT FOOTER */}
            <div className="hidden print:block text-center text-xs text-slate-400 pt-8 border-t border-gray-200 mt-8">
                <p>CONFIDENTIAL: For Clinical Use Only. Generated by PPN Portal.</p>
            </div>

            {/* GLOBAL PRINT STYLES */}
            <style jsx global>{`
                @media print {
                    @page {
                        margin: 1cm;
                        size: portrait;
                    }
                    body {
                        background: white !important;
                        color: black !important;
                    }
                    /* Force charts to print background colors if needed */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}</style>
        </PageContainer>
    );
};

export default Analytics;