import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity, Database, Server } from 'lucide-react';

const data = [
    {
        subject: 'Efficacy',
        A: 120, // My Clinic
        B: 90,  // Network Avg
        fullMark: 150,
    },
    {
        subject: 'Protocol Adherence',
        A: 98,
        B: 85,
        fullMark: 150,
    },
    {
        subject: 'Safety',
        A: 130,
        B: 100,
        fullMark: 150,
    },
    {
        subject: 'Patient Retention',
        A: 95,
        B: 70,
        fullMark: 150,
    },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#0f172a] border border-slate-700 rounded p-2 text-[10px] shadow-xl">
                <p className="font-bold text-slate-200 mb-1">{label}</p>
                <div className="flex flex-col gap-0.5">
                    <span className="text-emerald-400">My Clinic: {payload[0].value}</span>
                    <span className="text-slate-400">Network Avg: {payload[1].value}</span>
                </div>
            </div>
        );
    }
    return null;
};

export default function ClinicPerformanceRadar() {
    return (
        <div className="bg-[#0f1218] border border-slate-800 rounded-3xl p-6 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-emerald-500" />
                <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest">
                    Clinic Performance vs. Network Benchmarks
                </h3>
            </div>

            {/* Insight Panel */}
            <div className="mb-4 bg-slate-800/20 border border-slate-800 rounded-xl p-3">
                <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                    <strong className="text-emerald-400">Insight:</strong> Benchmarking reveals operational gaps. Is the higher efficacy due to 'Inhaled' vs 'IV' intake?
                </p>
            </div>

            {/* Chart */}
            <div className="flex-1 w-full min-h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />

                        <Radar
                            name="My Clinic"
                            dataKey="A"
                            stroke="#10b981"
                            strokeWidth={2}
                            fill="#10b981"
                            fillOpacity={0.6}
                        />
                        <Radar
                            name="Network Avg"
                            dataKey="B"
                            stroke="#475569"
                            strokeWidth={2}
                            fill="#475569"
                            fillOpacity={0.2}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* SQL Context Footer */}
            <div className="mt-4 pt-3 border-t border-slate-800/50 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Database className="w-3 h-3 text-slate-500" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Aggregation Logic</span>
                </div>
                <div className="bg-[#0a0c10] rounded-lg p-2 border border-slate-800 flex items-center gap-2">
                    <Server className="w-3 h-3 text-indigo-500/50" />
                    <code className="font-mono text-[9px] text-slate-400">
                        GROUP BY Site_ID vs. SELECT AVG(Score) FROM All_Sites
                    </code>
                </div>
            </div>
        </div>
    );
}
