import React, { useState, useEffect } from 'react';
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
import ProtocolEfficiency from '../components/analytics/ProtocolEfficiency';
import MolecularPharmacology from '../components/analytics/MolecularPharmacology';
import MetabolicRiskGauge from '../components/analytics/MetabolicRiskGauge';
import { GlassmorphicCard } from '../components/ui/GlassmorphicCard';
import { supabase } from '../supabaseClient';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import SafetyBenchmark from '../components/analytics/SafetyBenchmark';
import { useSafetyBenchmark } from '../hooks/useSafetyBenchmark';

const Analytics = () => {
    const [siteId, setSiteId] = useState<number | null>(null);
    const [userEmail, setUserEmail] = useState<string>('');
    const analytics = useAnalyticsData(siteId);
    const { benchmark, loading: benchmarkLoading } = useSafetyBenchmark();

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
                        <div className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-xs font-mono text-indigo-400 tracking-widest font-black">
                            LIVE_NODE_07
                        </div>
                    </div>
                    <p className="text-xl sm:text-2xl font-medium max-w-4xl leading-relaxed mt-4" style={{ color: '#8B9DC3' }}>
                        Real-time network insights and safety metrics.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handlePrint}
                        className="p-3 bg-indigo-600 hover:bg-indigo-500 text-slate-300 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        <Printer className="w-5 h-5" />
                        <span className="font-bold">Print Report</span>
                    </button>
                </div>
            </Section>

            {/* PRINT HEADER - Visible ONLY on Print */}
            <div className="hidden print:block mb-8 border-b-2 border-black pb-4">
                <h1 className="text-4xl font-black text-black mb-2">Clinical Intelligence Report</h1>
                <div className="flex justify-between text-sm text-slate-600 font-mono">
                    <span>Generated: {new Date().toLocaleDateString()}</span>
                    <span>Node: LIVE_NODE_07</span>
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

            {/* EMPTY STATE */}
            {!analytics.loading && !analytics.error && analytics.activeProtocols === 0 && (
                <Section spacing="tight">
                    {/* Demo-aware empty state — explains the model, doesn't look broken */}
                    <div className="relative overflow-hidden bg-[#0a0c12]/60 border border-indigo-500/20 rounded-[2rem] p-10">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/40 via-blue-400/60 to-indigo-500/40" />
                        <div className="flex flex-col md:flex-row items-start gap-8">
                            <div className="shrink-0 w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                <Activity className="w-8 h-8 text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Network Intelligence — Give-to-Get Model</p>
                                <h3 className="text-2xl font-black tracking-tighter mb-3" style={{ color: '#A8B5D1' }}>
                                    Analytics unlock after 10+ sessions
                                </h3>
                                <p className="text-base mb-6" style={{ color: '#8B9DC3' }}>
                                    Once your clinic logs sessions via the Wellness Journey, this dashboard populates with real-time outcome benchmarks, safety performance scores, and network-wide comparative data.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { label: 'Performance Radar', desc: 'Your outcomes vs network avg across 6 dimensions' },
                                        { label: 'Safety Benchmark', desc: 'Adverse event rate percentile — all active sites' },
                                        { label: 'Patient Galaxy', desc: 'Outcome scatter across substance + indication' },
                                    ].map((item) => (
                                        <div key={item.label} className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
                </div>

                {benchmarkLoading ? (
                    <div className="bg-[#0a0c12]/50 border border-slate-800/50 rounded-2xl p-12 flex items-center justify-center">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-4"></div>
                            <p className="text-sm" style={{ color: '#8B9DC3' }}>Loading safety benchmark...</p>
                        </div>
                    </div>
                ) : benchmark ? (
                    <div className="bg-[#0a0c12]/50 border border-slate-800/50 rounded-2xl p-6">
                        <SafetyBenchmark />

                        {/* Interpretation */}
                        <div className="mt-6 pt-6 border-t border-slate-800">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                                    <p className="text-2xl font-black" style={{ color: '#9DAEC8' }}>{benchmark.practitioner_adverse_event_rate.toFixed(2)}%</p>
                                    <p className="text-sm text-slate-500 mt-1">{benchmark.adverse_events} events / {benchmark.total_sessions} sessions</p>
                                </div>
                                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                                    <p className="text-2xl font-black" style={{ color: '#9DAEC8' }}>{benchmark.network_average_rate.toFixed(2)}%</p>
                                    <p className="text-sm text-slate-500 mt-1">All sites with N ≥ 10</p>
                                </div>
                                <div className={`rounded-xl p-4 border ${benchmark.status === 'excellent' ? 'bg-emerald-500/10 border-emerald-500/20' :
                                    benchmark.status === 'good' ? 'bg-blue-500/10 border-blue-500/20' :
                                        benchmark.status === 'average' ? 'bg-slate-900/50 border-slate-800' :
                                            'bg-amber-500/10 border-amber-500/20'
                                    }`}>
                                    <p className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-2">Status</p>
                                    <p className={`text-2xl font-black ${benchmark.status === 'excellent' ? 'text-emerald-400' :
                                        benchmark.status === 'good' ? 'text-blue-400' :
                                            benchmark.status === 'average' ? 'text-slate-300' :
                                                'text-amber-400'
                                        }`}>
                                        {benchmark.status === 'excellent' ? 'Excellent' :
                                            benchmark.status === 'good' ? 'Good' :
                                                benchmark.status === 'average' ? 'Average' :
                                                    'Needs Improvement'}
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1">{benchmark.percentile}th percentile</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-[#0a0c12]/50 border border-slate-800/50 rounded-2xl p-12 text-center">
                        <ShieldCheck className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <p className="mb-2" style={{ color: '#8B9DC3' }}>Insufficient data for safety benchmark</p>
                        <p className="text-sm text-slate-500">Log at least 10 protocols to see your safety performance</p>
                    </div>
                )}
            </Section>

            {/* FILTER CONTROLS - Hide on Print */}
            <Section spacing="tight" className="sticky top-4 z-40 print:hidden">
                <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center bg-[#0a0c12]/80 border border-slate-800/80 p-2 rounded-2xl backdrop-blur-xl shadow-2xl">
                    <div className="flex items-center gap-2 px-2">
                        <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                            <span className="material-symbols-outlined text-indigo-400 text-lg">tune</span>
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest hidden md:block" style={{ color: '#8B9DC3' }}>Filters</span>
                    </div>

                    <div className="h-6 w-px bg-slate-800 hidden xl:block"></div>

                    <div className="flex-1 flex flex-col md:flex-row gap-2">
                        <select className="bg-black/40 border border-slate-700/50 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:border-indigo-500/50 uppercase tracking-wider" style={{ color: '#8B9DC3' }}>
                            <option>All Molecules</option>
                            <option>Psilocybin</option>
                            <option>MDMA</option>
                            <option>Ketamine</option>
                        </select>
                        <select className="bg-black/40 border border-slate-700/50 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:border-indigo-500/50 uppercase tracking-wider" style={{ color: '#8B9DC3' }}>
                            <option>Last 30 Days</option>
                            <option>Last Quarter</option>
                            <option>YTD</option>
                        </select>
                    </div>
                </div>
            </Section>

            {/* COMPONENT GRID */}
            <Section spacing="default" className="grid grid-cols-1 xl:grid-cols-2 gap-8 print:block print:space-y-8">

                {/* CHART 1: PERFORMANCE RADAR */}
                <div className="xl:col-span-2 print:break-inside-avoid print:mb-8">
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden print:h-[400px] print:shadow-none print:border-gray-200 print:bg-white">
                        <div className="absolute top-6 left-6 z-10">
                            <h3 className="text-lg font-black print:text-black" style={{ color: '#A8B5D1' }}>Performance Radar</h3>
                            <p className="text-sm print:text-slate-500" style={{ color: '#8B9DC3' }}>Clinic metrics vs Network Average</p>
                        </div>
                        <ClinicPerformanceRadar />
                    </GlassmorphicCard>
                </div>

                {/* CHART 2: PATIENT GALAXY */}
                <div className="xl:col-span-2 print:break-inside-avoid print:mb-8">
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden print:h-[400px] print:shadow-none print:border-gray-200 print:bg-white">
                        <div className="absolute top-6 left-6 z-10">
                            <h3 className="text-lg font-black print:text-black" style={{ color: '#A8B5D1' }}>Patient Galaxy</h3>
                            <p className="text-sm print:text-slate-500" style={{ color: '#8B9DC3' }}>Outcomes clustering analysis</p>
                        </div>
                        <PatientConstellation />
                    </GlassmorphicCard>
                </div>

                {/* CHART 3: MOLECULAR */}
                <div className="print:break-inside-avoid print:mb-8">
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden print:h-[400px] print:shadow-none print:border-gray-200 print:bg-white">
                        <div className="absolute top-6 left-6 z-10">
                            <h3 className="text-lg font-black print:text-black" style={{ color: '#A8B5D1' }}>Molecular Bridge</h3>
                            <p className="text-sm print:text-slate-500" style={{ color: '#8B9DC3' }}>Receptor affinity profiles</p>
                        </div>
                        <MolecularPharmacology />
                    </GlassmorphicCard>
                </div>

                {/* CHART 4: GENOMIC RISK */}
                <div className="print:break-inside-avoid print:mb-8">
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden print:h-[400px] print:shadow-none print:border-gray-200 print:bg-white">
                        <div className="absolute top-6 left-6 z-10">
                            <h3 className="text-lg font-black print:text-black" style={{ color: '#A8B5D1' }}>Genomic Safety</h3>
                            <p className="text-sm print:text-slate-500" style={{ color: '#8B9DC3' }}>CYP450 metabolic risk analysis</p>
                        </div>
                        <MetabolicRiskGauge />
                    </GlassmorphicCard>
                </div>

                {/* CHART 5: ROI */}
                <div className="xl:col-span-2 print:break-inside-avoid print:mb-8">
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden print:h-[400px] print:shadow-none print:border-gray-200 print:bg-white">
                        <div className="absolute top-6 left-6 z-10">
                            <h3 className="text-lg font-black print:text-black" style={{ color: '#A8B5D1' }}>Protocol ROI</h3>
                            <p className="text-sm print:text-slate-500" style={{ color: '#8B9DC3' }}>Financial efficiency modeling</p>
                        </div>
                        <ProtocolEfficiency />
                    </GlassmorphicCard>
                </div>

            </Section>

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