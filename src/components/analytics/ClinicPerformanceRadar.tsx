import React, { useState } from 'react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import {
    Download, Calendar, TrendingUp, AlertCircle,
    CheckCircle2, FileText, Share2
} from 'lucide-react';

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

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/95 backdrop-blur-sm p-4 border border-slate-700 rounded-lg shadow-xl max-w-[250px]">
                <h4 className="text-slate-200 font-bold mb-1 text-xs uppercase tracking-wider">{label}</h4>
                <p className="text-xs text-slate-500 mb-3 italic">
                    {METRIC_DEFINITIONS[label] || 'Performance Metric'}
                </p>
                <div className="flex flex-col gap-2">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-4 text-xs">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-slate-300 font-medium">{entry.name}:</span>
                            </div>
                            <span className="text-white font-bold font-mono">{entry.dataKey === 'A' ? entry.payload.A : entry.payload.B}</span>
                        </div>
                    ))}
                </div>
            </div >
        );
    }
    return null;
};

export default function ClinicPerformanceRadar() {
    const [timeRange, setTimeRange] = useState<'quarter' | 'year'>('quarter');
    const currentData = timeRange === 'quarter' ? DATA_QUARTER : DATA_YEAR;
    const insights = METRIC_INSIGHTS[timeRange];

    const handleExport = () => {
        window.print();
    };

    return (
        <div className="w-full bg-[#0f1218] p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-white tracking-tighter flex items-center gap-2 print:text-black" title="Aggregated performance metrics comparing this node against the global network average">
                        <TrendingUp className="text-indigo-500" />
                        Clinic Performance Radar
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-1 print:text-slate-600">
                        Analyzing efficacy, safety, and operational metrics against N=14,200 Network Nodes.
                    </p>
                </div>
                <div className="flex items-center gap-2 print:hidden">
                    <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                        <button
                            onClick={() => setTimeRange('quarter')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${timeRange === 'quarter' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            Q1 2026
                        </button>
                        <button
                            onClick={() => setTimeRange('year')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${timeRange === 'year' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            Last 12 Mo
                        </button>
                    </div>
                    <button
                        onClick={handleExport}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                        title="Export Report"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Radar Chart Section */}
                <div className="lg:col-span-2 h-[350px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={currentData}>
                            <PolarGrid gridType="polygon" stroke="#334155" strokeOpacity={0.5} />
                            <PolarAngleAxis
                                dataKey="subject"
                                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
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
                                stroke="#475569"
                                strokeWidth={2}
                                fill="#475569"
                                fillOpacity={0.1}
                                strokeDasharray="4 4"
                            />
                            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
                            <Tooltip content={<CustomTooltip />} />
                        </RadarChart>
                    </ResponsiveContainer>

                    {/* Watermark for Print */}
                    <div className="hidden print:block absolute bottom-0 right-0 text-slate-200 text-4xl font-black opacity-10 uppercase transform -rotate-12">
                        Confidential
                    </div>
                </div>
                {/* Insights Panel */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">
                            {timeRange === 'quarter' ? 'Quarterly' : 'Annual'} Analysis
                        </h3>
                    </div>
                    {insights.map((insight, idx) => (
                        <div key={idx} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{insight.label}</span>
                                {insight.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                {insight.status === 'warning' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                                {insight.status === 'danger' && <AlertCircle className="w-4 h-4 text-red-500" />}
                            </div>
                            <div className="flex items-end gap-2 mb-1">
                                <span className="text-xl font-mono font-bold text-slate-200">{insight.value}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-snug group-hover:text-slate-300 transition-colors">
                                {insight.text}
                            </p>
                        </div>
                    ))}

                    <div className="mt-auto pt-4 border-t border-slate-800 text-center">
                        <p className="text-[9px] text-slate-600 font-mono">
                            Generated: {new Date().toLocaleDateString()} • Node ID: 8821-X
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
