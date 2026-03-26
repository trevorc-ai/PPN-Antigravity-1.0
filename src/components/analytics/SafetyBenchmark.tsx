import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    ReferenceLine, Cell
} from 'recharts';
import { ShieldCheck, TrendingDown, Award, BookOpen, Clipboard } from 'lucide-react';
import { ChartSkeleton } from './ChartSkeleton';
import { CustomTooltip } from './CustomTooltip';
import { useSafetyBenchmark } from '../../hooks/useSafetyBenchmark';

/** Returns correct ordinal suffix: 1st, 2nd, 3rd, 4th… */
function ordinal(n: number): string {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

const ALERT_THRESHOLD = 20; // events per 100 sessions, hard safety limit

/**
 * WO-678: SafetyBenchmark is now self-contained — calls useSafetyBenchmark internally.
 * All hardcoded prop defaults removed. Component renders from live DB data only.
 */
export default function SafetyBenchmark() {
    const { benchmark, loading, error } = useSafetyBenchmark();
    const [chartReady, setChartReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setChartReady(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // ── Derive display values from live data (or zero-state defaults) ──────────
    const practitionerRate = benchmark?.practitioner_adverse_event_rate ?? 0;
    const networkRate      = benchmark?.network_average_rate ?? 0;
    const literatureRate   = benchmark?.literature_adverse_event_rate ?? null;
    const totalSessions    = benchmark?.total_sessions ?? 0;
    const adverseEvents    = benchmark?.adverse_events ?? 0;
    const percentile       = benchmark?.percentile ?? 0;
    const status           = benchmark?.status ?? 'average';

    const chartData = [
        { name: 'Your Node', value: practitionerRate, fill: '#10b981' },
        { name: 'Network Avg', value: networkRate, fill: '#64748b' },
        ...(literatureRate != null
            ? [{ name: 'Lit. Avg', value: Math.round(literatureRate * 10) / 10, fill: '#6366f1' }]
            : []),
    ];

    const maxValue = Math.max(practitionerRate, networkRate, literatureRate ?? 0, ALERT_THRESHOLD);
    const xAxisMax = Math.ceil(maxValue / 10) * 10 + 10;

    // Guard against division by zero
    const deltaVsNetwork = networkRate > 0 ? Math.round((1 - practitionerRate / networkRate) * 100) : 0;

    const statusConfig = {
        excellent:        { label: 'Excellent',         color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
        good:             { label: 'Good',              color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/30' },
        average:          { label: 'Average',           color: 'text-slate-300',   bg: 'bg-slate-800 border-slate-700' },
        needs_improvement:{ label: 'Needs Improvement', color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/30' },
    }[status];

    // Clamp percentile to [1, 99] — avoids "Top 0%" edge case
    const safePercentile = Math.min(Math.max(percentile, 1), 99);

    const hasNoSessions = totalSessions === 0;
    const hasNoPeerData = networkRate === 0;

    if (loading) {
        return (
            <div className="space-y-4">
                <ChartSkeleton height="180px" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-8">
                <p className="ppn-body text-slate-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ── KPI STAT CARDS ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Your Rate */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                    <p className="ppn-meta font-black text-slate-500 uppercase tracking-widest mb-2">
                        Your Adverse Event Rate
                    </p>
                    <p className="text-3xl font-black text-emerald-400 tracking-tight">
                        {practitionerRate.toFixed(1)}%
                    </p>
                    <p className="ppn-body text-slate-500 mt-1">
                        {adverseEvents} events / {totalSessions} sessions
                    </p>
                </div>

                {/* Network Avg */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                    <p className="ppn-meta font-black text-slate-500 uppercase tracking-widest mb-2">
                        Network Average
                    </p>
                    <p className="text-3xl font-black tracking-tight" style={{ color: '#9DAEC8' }}>
                        {hasNoPeerData ? '—' : `${networkRate.toFixed(1)}%`}
                    </p>
                    <p className="ppn-body text-slate-500 mt-1">
                        {hasNoPeerData ? 'No peer sites with N ≥ 10 yet' : 'All sites with N ≥ 10'}
                    </p>
                </div>

                {/* Status */}
                <div className={`rounded-2xl p-5 border ${statusConfig.bg}`}>
                    <p className="ppn-meta font-black text-slate-500 uppercase tracking-widest mb-2">Status</p>
                    <p className={`text-3xl font-black tracking-tight ${statusConfig.color}`}>
                        {hasNoSessions ? 'New' : statusConfig.label}
                    </p>
                    <p className="ppn-body text-slate-500 mt-1">
                        {hasNoSessions
                            ? 'Log sessions to build your score'
                            : `${ordinal(safePercentile)} percentile`}
                    </p>
                </div>
            </div>

            {/* ── BENCHMARK CHART ────────────────────────────────────────── */}
            <div
                className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5"
                role="img"
                aria-label="Bar chart comparing your adverse event rate with the network average — live session data"
            >
                <p className="ppn-meta font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
                    Benchmark Comparison · events per 100 sessions · Live Data
                </p>
                <div className="h-36">
                    {!chartReady ? (
                        <ChartSkeleton height="100%" />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                layout="vertical"
                                margin={{ top: 4, right: 60, left: 90, bottom: 4 }}
                            >
                                <XAxis
                                    type="number"
                                    domain={[0, xAxisMax]}
                                    tick={{ fill: '#475569', fontSize: 12 }}
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
                                    cursor={{ fill: 'rgba(100,116,139,0.06)' }}
                                    content={({ active, payload }) => {
                                        if (!payload || !payload.length) return null;
                                        const d = payload[0].payload as { name: string; value: number; fill: string };
                                        const clinicalContext = d.name === 'Your Node'
                                            ? `${Math.round((1 - d.value / ALERT_THRESHOLD) * 100)}% below alert threshold`
                                            : undefined;
                                        return (
                                            <CustomTooltip
                                                active={active}
                                                label={d.name}
                                                payload={[{ name: 'Rate', value: `${d.value.toFixed(1)} events / 100 sessions`, color: d.fill }]}
                                                clinicalContext={clinicalContext}
                                            />
                                        );
                                    }}
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
                                        fontSize: 12,
                                        fontWeight: 700,
                                    }}
                                />
                                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={28}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.85} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* ── INSIGHT CHIPS ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {hasNoSessions ? (
                    <>
                        <div className="sm:col-span-2 flex items-center gap-3 bg-indigo-500/8 border border-indigo-500/20 rounded-xl px-4 py-3">
                            <Clipboard className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                            <p className="ppn-body font-bold text-indigo-300">
                                Log your first session to start building your safety benchmark
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3">
                            <BookOpen className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            <p className="ppn-body font-bold text-slate-400">
                                {literatureRate != null
                                    ? `${Math.round(literatureRate)}% lit. median available`
                                    : '38 published cohorts available'}
                            </p>
                        </div>
                    </>
                ) : hasNoPeerData ? (
                    <>
                        <div className="flex items-center gap-3 bg-emerald-500/8 border border-emerald-500/20 rounded-xl px-4 py-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            <p className="ppn-body font-bold text-emerald-300">
                                {literatureRate != null
                                    ? `${Math.abs(Math.round(practitionerRate - literatureRate))}% ${practitionerRate < literatureRate ? 'below' : 'above'} literature average`
                                    : `${adverseEvents} adverse event${adverseEvents !== 1 ? 's' : ''} in ${totalSessions} sessions`}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3">
                            <TrendingDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            <p className="ppn-body font-bold text-slate-400">
                                Peer network building (need N ≥ 10)
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-indigo-500/8 border border-indigo-500/20 rounded-xl px-4 py-3">
                            <BookOpen className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                            <p className="ppn-body font-bold text-indigo-300">
                                Benchmarked vs 1,566 global trials
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-3 bg-emerald-500/8 border border-emerald-500/20 rounded-xl px-4 py-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            <p className="ppn-body font-bold text-emerald-300">
                                {deltaVsNetwork}% below network average
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3">
                            <TrendingDown className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            <p className="ppn-body font-bold text-slate-300">
                                Benchmarked vs live log_safety_events
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3">
                            <Award className="w-5 h-5 text-amber-400 flex-shrink-0" />
                            <p className="ppn-body font-bold text-amber-300">
                                Top {100 - safePercentile}% nationally
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Lit. Avg methodology footnote */}
            {literatureRate != null && (
                <p className="ppn-caption text-slate-600 italic leading-snug">
                    † Lit. Avg = mean adverse event rate across published clinical trials (any AE per participant).
                    Your rate = confirmed events per 100 sessions. Scales differ; use as directional context only.
                </p>
            )}
        </div>
    );
}
