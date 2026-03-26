import React, { useEffect, useState } from 'react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, Tooltip,
} from 'recharts';
import { AlertCircle, BarChart2, Info, RefreshCw } from 'lucide-react';
import { ChartSkeleton } from './ChartSkeleton';
import { useClinicBenchmarks, MINIMUM_SESSION_THRESHOLD, type ClinicSpoke } from '../../hooks/useClinicBenchmarks';

// ─── Spoke Tooltip ─────────────────────────────────────────────────────────────
// Shows the spoke definition + derivation when hovering a data point.
// Per WO-677: "every spoke value must display its definition on hover."
const RadarTooltipContent = ({
    active,
    payload,
}: {
    active?: boolean;
    payload?: Array<{ payload: ClinicSpoke & { A: number } }>;
}) => {
    const spoke = payload?.[0]?.payload as (ClinicSpoke & { A: number }) | undefined;

    return (
        <div
            className={`bg-[#0a0c12]/95 border rounded-xl p-3 min-w-[220px] max-w-[260px] transition-opacity duration-150 ${
                active && spoke
                    ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/10 opacity-100'
                    : 'border-slate-800/60 opacity-60'
            }`}
        >
            <span className="ppn-meta font-black uppercase tracking-widest text-slate-500 block mb-2">
                {spoke?.subject ?? 'Hover a point'}
            </span>
            {spoke && !spoke.suppressed ? (
                <>
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            <span className="text-xs font-bold text-slate-300">My Clinic</span>
                        </div>
                        <span className="text-xs font-black text-indigo-400">{spoke.A}%</span>
                    </div>
                    <p className="ppn-meta text-slate-400 leading-snug border-t border-slate-800 pt-2 mb-1">
                        {spoke.definition}
                    </p>
                    <p className="ppn-meta text-slate-500 leading-snug italic">
                        {spoke.derivation}
                    </p>
                </>
            ) : spoke?.suppressed ? (
                <p className="ppn-meta text-slate-500 italic">
                    {spoke.definition}
                </p>
            ) : (
                <p className="ppn-meta text-slate-600 italic">Move over a data point</p>
            )}
        </div>
    );
};

// ─── Zero State ────────────────────────────────────────────────────────────────
const InsufficientDataState = ({
    totalSessions,
    error,
}: {
    totalSessions: number;
    error: string | null;
}) => (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
            <BarChart2 className="w-6 h-6 text-slate-500" />
        </div>
        {error ? (
            <>
                <h3 className="ppn-card-title text-slate-300 text-center">Unable to load benchmarks</h3>
                <p className="ppn-body text-slate-500 text-center max-w-xs">{error}</p>
            </>
        ) : (
            <>
                <h3 className="ppn-card-title text-slate-300 text-center">
                    Minimum data threshold not yet met
                </h3>
                <p className="ppn-body text-slate-500 text-center max-w-xs">
                    Need {MINIMUM_SESSION_THRESHOLD} sessions to render this chart.
                    {totalSessions > 0 && (
                        <> You currently have <strong className="text-slate-300">{totalSessions}</strong> non-draft session{totalSessions !== 1 ? 's' : ''}.</>
                    )}
                </p>
                <div className="flex items-center gap-2 bg-indigo-950/40 border border-indigo-800/40 rounded-xl px-4 py-3">
                    <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                    <p className="ppn-meta text-indigo-300">
                        {MINIMUM_SESSION_THRESHOLD - totalSessions} more session{MINIMUM_SESSION_THRESHOLD - totalSessions !== 1 ? 's' : ''} needed
                    </p>
                </div>
            </>
        )}
    </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ClinicPerformanceRadar() {
    const { suppressed, totalSessions, spokes, loading, error, refetch } = useClinicBenchmarks();
    const [chartReady, setChartReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setChartReady(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Build radar data — suppress spokes that haven't been wired yet
    // Suppressed spokes show 0 but with a tooltip explaining why
    const radarData = spokes.map(spoke => ({
        ...spoke,
        A: spoke.suppressed ? 0 : spoke.value,
    }));

    const isReady = !loading && chartReady;

    return (
        <div className="w-full h-full flex flex-col p-6 print:p-0 print:bg-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 mt-12 md:mt-0">
                <div className="flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-indigo-400" />
                    <h3 className="ppn-card-title text-slate-200">Clinic Performance</h3>
                </div>
                <button
                    onClick={refetch}
                    aria-label="Refresh clinic performance data"
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors print:hidden"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex-1">
                    <ChartSkeleton height="100%" />
                </div>
            )}

            {/* Error / Suppressed zero-state */}
            {!loading && (suppressed || error) && (
                <InsufficientDataState totalSessions={totalSessions} error={error} />
            )}

            {/* Live chart */}
            {isReady && !suppressed && !error && radarData.length > 0 && (
                <div className="flex-1 flex flex-col gap-4 min-h-0">
                    {/* Alert for suppressed spokes */}
                    {spokes.some(s => s.suppressed) && (
                        <div className="flex items-start gap-2 bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 py-3 print:hidden">
                            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <p className="ppn-meta text-slate-400">
                                Efficacy &amp; Adherence spokes are suppressed — awaiting assessment score pipeline.
                            </p>
                        </div>
                    )}

                    <div
                        className="flex-1 min-h-[300px]"
                        role="img"
                        aria-label="Radar chart showing clinic performance across Safety, Completion, Data Quality, and Consent — derived from live session data."
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                                <PolarGrid gridType="polygon" stroke="#334155" strokeOpacity={0.5} />
                                <PolarAngleAxis
                                    dataKey="subject"
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                                />
                                {/* Domain 0–100: spoke values are percentages */}
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

                                <Radar
                                    name="My Clinic"
                                    dataKey="A"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fill="#6366f1"
                                    fillOpacity={0.4}
                                    dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
                                    activeDot={{ r: 6, fill: '#818cf8', strokeWidth: 2, stroke: '#fff' }}
                                />

                                {/* Pinned tooltip — position fixes it top-left; content updates on hover */}
                                <Tooltip
                                    position={{ x: 8, y: 8 }}
                                    cursor={false}
                                    content={<RadarTooltipContent />}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Data provenance footer */}
                    <p className="ppn-meta text-slate-600 text-center print:text-gray-400">
                        Based on {totalSessions} session{totalSessions !== 1 ? 's' : ''} · Live data
                    </p>
                </div>
            )}
        </div>
    );
}
