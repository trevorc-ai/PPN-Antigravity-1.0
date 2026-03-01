import React, { useState, useEffect } from 'react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import {
    Download, Calendar, TrendingUp, AlertCircle,
    CheckCircle2, FileText, Share2
} from 'lucide-react';
import { ChartSkeleton } from './ChartSkeleton';
import { CustomTooltip } from './CustomTooltip';

// --- MOCK DATA ---
const DATA_QUARTER = [
    { subject: 'Efficacy', A: 120, B: 110, fullMark: 150 },
    { subject: 'Safety', A: 98, B: 130, fullMark: 150 },
    { subject: 'Retention', A: 86, B: 130, fullMark: 150 },
    { subject: 'Speed', A: 99, B: 100, fullMark: 150 },
    { subject: 'Revenue', A: 85, B: 90, fullMark: 150 },
    { subject: 'Compliance', A: 65, B: 85, fullMark: 150 },
];

const DATA_YEAR = [
    { subject: 'Efficacy', A: 110, B: 115, fullMark: 150 },
    { subject: 'Safety', A: 125, B: 125, fullMark: 150 },
    { subject: 'Retention', A: 110, B: 120, fullMark: 150 },
    { subject: 'Speed', A: 105, B: 100, fullMark: 150 },
    { subject: 'Revenue', A: 100, B: 95, fullMark: 150 },
    { subject: 'Compliance', A: 95, B: 90, fullMark: 150 },
];

const METRIC_INSIGHTS = {
    quarter: [
        { label: 'Safety Score', value: '98/150', status: 'warning', text: 'Below network average due to 2 adverse events in Jan.' },
        { label: 'Efficacy Yield', value: '120/150', status: 'success', text: 'Outperforming network in Depression outcomes (+12%).' },
        { label: 'Compliance', value: '65/150', status: 'danger', text: 'Missing documentation for 3 recent sessions.' }
    ],
    year: [
        { label: 'Safety Score', value: '125/150', status: 'success', text: 'Consistent safety record over 12 months.' },
        { label: 'Efficacy Yield', value: '110/150', status: 'neutral', text: 'Matches national benchmarks.' },
        { label: 'Compliance', value: '95/150', status: 'success', text: 'Audit readiness remains high.' }
    ]
};

const METRIC_DEFINITIONS: Record<string, string> = {
    'Efficacy': 'Response Rate (≥50% PHQ-9 Reduction)',
    'Safety': 'Inverse Risk Score (AEs per 1000 Sessions)',
    'Retention': '% Patients Completing Full Protocol',
    'Speed': 'Time to Remission (Weeks to <10 PHQ-9)',
    'Revenue': 'Net Margin per Clinical Hour',
    'Compliance': 'Documentation Completeness (Audit Score)'
};

// Replaced by CustomTooltip component

export default function ClinicPerformanceRadar({ data }: { data?: any[] }) {
    const [timeRange, setTimeRange] = useState<'quarter' | 'year'>('quarter');
    const [chartReady, setChartReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setChartReady(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const currentData = data || (timeRange === 'quarter' ? DATA_QUARTER : DATA_YEAR);
    const insights = METRIC_INSIGHTS[timeRange];

    return (
        <div className="w-full h-full flex flex-col p-6 print:p-0 print:bg-white">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
                <div className="flex-1">
                    {/* Title removed here as it is handled by the parent card */}
                </div>
                <div className="flex items-center gap-2 print:hidden z-10 shrink-0">
                    <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                        <button
                            onClick={() => setTimeRange('quarter')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all min-h-[44px] min-w-[80px] ${timeRange === 'quarter' ? 'bg-indigo-600 text-slate-300 shadow-lg' : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            Q1 2026
                        </button>
                        <button
                            onClick={() => setTimeRange('year')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all min-h-[44px] min-w-[80px] ${timeRange === 'year' ? 'bg-indigo-600 text-slate-300 shadow-lg' : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            Last 12 Mo
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
                {/* Radar Chart Section - Added min-h-0 to prevent flex item overflow */}
                <div className="lg:col-span-2 relative min-h-[300px]" role="img" aria-label="Radar chart showing clinic performance vs network average across safety, efficacy, retention, speed, revenue, and compliance.">
                    {!chartReady ? (
                        <ChartSkeleton height="100%" />
                    ) : (
                        <div className="relative w-full h-full min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={currentData}>
                                    <PolarGrid gridType="polygon" stroke="#334155" strokeOpacity={0.5} />
                                    <PolarAngleAxis
                                        dataKey="subject"
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                                    />
                                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />

                                    <Radar
                                        name="My Clinic"
                                        dataKey="A"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        fill="#6366f1"
                                        fillOpacity={0.4}
                                    />
                                    <Radar
                                        name="Network Avg"
                                        dataKey="B"
                                        stroke="#94a3b8"
                                        strokeWidth={2}
                                        fill="#94a3b8"
                                        fillOpacity={0.15}
                                        strokeDasharray="5 3"
                                    />
                                    <Tooltip
                                        content={({ active, payload, label }) => (
                                            <CustomTooltip
                                                active={active}
                                                payload={payload}
                                                label={label}
                                                clinicalContext={METRIC_DEFINITIONS[label as string]}
                                            />
                                        )}
                                    />
                                    <Legend
                                        wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }}
                                        iconType="circle"
                                    />
                                </RadarChart>
                            </ResponsiveContainer>

                            {/* Persistent Tooltip over "Efficacy" (Top Spoke) */}
                            <div className="absolute top-[18%] left-1/2 -translate-x-1/2 -translate-y-full z-10 pointer-events-none hidden sm:block animate-in fade-in zoom-in duration-1000 delay-700 fill-mode-both">
                                <div className="bg-[#0f1218] border border-indigo-500/30 shadow-2xl shadow-indigo-500/20 rounded-xl p-3 min-w-[150px] flex flex-col">
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5 border-b border-slate-800 pb-1">Efficacy Insight</span>

                                    <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                            <span className="text-xs font-bold text-slate-300">My Clinic</span>
                                        </div>
                                        <span className="text-xs font-black text-indigo-400">{currentData[0].A}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                            <span className="text-xs font-bold text-slate-300">Network Avg</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-400">{currentData[0].B}</span>
                                    </div>

                                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0f1218] border-b border-r border-indigo-500/30 rotate-45"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Insights Panel - Scrollable if content overflows */}
                <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
                    <div className="flex items-center gap-2 mb-2 sticky top-0 bg-[#0f1218]/90 backdrop-blur pb-2 z-10 print:bg-white">
                        <FileText className="w-4 h-4 text-slate-300" />
                        <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest print:text-black">
                            {timeRange === 'quarter' ? 'Quarterly' : 'Annual'} Analysis
                        </h3>
                    </div>
                    {insights.map((insight, idx) => (
                        <div key={idx} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors group print:bg-gray-50 print:border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{insight.label}</span>
                                {insight.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                {insight.status === 'warning' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                                {insight.status === 'danger' && <AlertCircle className="w-4 h-4 text-red-500" />}
                            </div>
                            <div className="flex items-end gap-2 mb-1">
                                <span className="text-xl font-mono font-bold text-slate-300 print:text-black">{insight.value}</span>
                            </div>
                            <p className="text-sm text-slate-300 leading-snug group-hover:text-slate-300 transition-colors print:text-slate-600">
                                {insight.text}
                            </p>
                        </div>
                    ))}

                    <div className="mt-auto pt-4 border-t border-slate-800 text-center print:border-gray-200">
                        <p className="text-sm text-slate-600 font-mono">
                            Node ID: 8821-X
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
