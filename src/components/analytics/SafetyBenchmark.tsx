import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    ReferenceLine, LabelList, Cell
} from 'recharts';
import { ShieldCheck, TrendingDown, Award } from 'lucide-react';

interface SafetyBenchmarkProps {
    /** Adverse event rate for this practitioner (%). Defaults to live mock. */
    practitionerRate?: number;
    /** Network average rate (%). */
    networkRate?: number;
    /** Total sessions logged. */
    totalSessions?: number;
    /** Raw adverse events count. */
    adverseEvents?: number;
    /** Percentile rank vs network (0–100). */
    percentile?: number;
    /** Overall status label. */
    status?: 'excellent' | 'good' | 'average' | 'needs_improvement';
}

const ALERT_THRESHOLD = 20; // events per 100 sessions — hard safety limit

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const d = payload[0].payload;
        return (
            <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 shadow-2xl">
                <p className="text-sm font-black text-slate-300 mb-1">{d.name}</p>
                <p className="text-sm text-slate-400">{d.value.toFixed(1)} events / 100 sessions</p>
                {d.name === 'Your Node' && (
                    <p className="text-xs text-emerald-400 mt-1 font-bold">
                        {Math.round((1 - d.value / ALERT_THRESHOLD) * 100)}% below alert threshold
                    </p>
                )}
            </div>
        );
    }
    return null;
};

export default function SafetyBenchmark({
    practitionerRate = 4.2,
    networkRate = 12.8,
    totalSessions = 72,
    adverseEvents = 3,
    percentile = 91,
    status = 'excellent',
}: SafetyBenchmarkProps) {
    const chartData = [
        { name: 'Your Node', value: practitionerRate, fill: '#10b981' },
        { name: 'Network Avg', value: networkRate, fill: '#64748b' },
    ];

    const deltaVsNetwork = Math.round((1 - practitionerRate / networkRate) * 100);

    const statusConfig = {
        excellent: { label: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
        good: { label: 'Good', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
        average: { label: 'Average', color: 'text-slate-300', bg: 'bg-slate-800 border-slate-700' },
        needs_improvement: { label: 'Needs Improvement', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
    }[status];

    return (
        <div className="space-y-6">
            {/* ── KPI STAT CARDS ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Your Rate */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                        Your Adverse Event Rate
                    </p>
                    <p className="text-3xl font-black text-emerald-400 tracking-tight">
                        {practitionerRate.toFixed(1)}%
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                        {adverseEvents} events / {totalSessions} sessions
                    </p>
                </div>

                {/* Network Avg */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                        Network Average
                    </p>
                    <p className="text-3xl font-black tracking-tight" style={{ color: '#9DAEC8' }}>
                        {networkRate.toFixed(1)}%
                    </p>
                    <p className="text-sm text-slate-500 mt-1">All sites with N ≥ 10</p>
                </div>

                {/* Status */}
                <div className={`rounded-2xl p-5 border ${statusConfig.bg}`}>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Status</p>
                    <p className={`text-3xl font-black tracking-tight ${statusConfig.color}`}>
                        {statusConfig.label}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">{percentile}th percentile</p>
                </div>
            </div>

            {/* ── BENCHMARK CHART ────────────────────────────────────────── */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
                <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
                    Benchmark Comparison — events per 100 sessions
                </p>
                <div className="h-36">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 4, right: 60, left: 90, bottom: 4 }}
                        >
                            <XAxis
                                type="number"
                                domain={[0, 25]}
                                tick={{ fill: '#475569', fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                                axisLine={false}
                                tickLine={false}
                                width={82}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: 'rgba(100,116,139,0.06)' }}
                            />
                            <ReferenceLine
                                x={ALERT_THRESHOLD}
                                stroke="#f43f5e"
                                strokeDasharray="4 3"
                                strokeWidth={1.5}
                                label={{
                                    value: `Alert: ${ALERT_THRESHOLD}`,
                                    position: 'insideTopRight',
                                    fill: '#f43f5e',
                                    fontSize: 11,
                                    fontWeight: 700,
                                }}
                            />
                            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={28}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.85} />
                                ))}
                                <LabelList
                                    dataKey="value"
                                    position="right"
                                    formatter={(v: number) => `${v.toFixed(1)}`}
                                    style={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── INSIGHT CARDS ──────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 bg-emerald-500/8 border border-emerald-500/20 rounded-xl px-4 py-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <p className="text-sm font-bold text-emerald-300">
                        {deltaVsNetwork}% below network average
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3">
                    <TrendingDown className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <p className="text-sm font-bold text-slate-300">
                        Trending ↓ vs last 90 days
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3">
                    <Award className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <p className="text-sm font-bold text-amber-300">
                        Top {100 - percentile + 1}% nationally
                    </p>
                </div>
            </div>
        </div>
    );
}
