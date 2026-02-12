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
            <div className="bg-slate-900/95 backdrop-blur-sm p-4 border border-slate-700 rounded-lg shadow-xl max-w-[250px] z-50 print:bg-white print:border-gray-200 print:text-black">
                <h4 className="text-slate-200 font-bold mb-1 text-xs uppercase tracking-wider print:text-black">{label}</h4>
                <p className="text-xs text-slate-500 mb-3 italic print:text-gray-500">
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
                                <span className="text-slate-300 font-medium print:text-gray-700">{entry.name}:</span>
                            </div>
                            <span className="text-white font-bold font-mono print:text-black">{entry.dataKey === 'A' ? entry.payload.A : entry.payload.B}</span>
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

    return (
        <div className="w-full h-full flex flex-col p-6 print:p-0 print:bg-white">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex-1">
                    {/* Title removed here as it is handled by the parent card */}
                </div>
                <div className="flex items-center gap-2 print:hidden z-10">
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
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
                {/* Radar Chart Section - Added min-h-0 to prevent flex item overflow */}
                <div className="lg:col-span-2 relative min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={currentData}>
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
                </div>

                {/* Insights Panel - Scrollable if content overflows */}
                <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
                    <div className="flex items-center gap-2 mb-2 sticky top-0 bg-[#0f1218]/90 backdrop-blur pb-2 z-10 print:bg-white">
                        <FileText className="w-4 h-4 text-slate-400" />
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
                                <span className="text-xl font-mono font-bold text-slate-200 print:text-black">{insight.value}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-snug group-hover:text-slate-300 transition-colors print:text-gray-600">
                                {insight.text}
                            </p>
                        </div>
                    ))}

                    <div className="mt-auto pt-4 border-t border-slate-800 text-center print:border-gray-200">
                        <p className="text-[10px] text-slate-600 font-mono">
                            Node ID: 8821-X
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
