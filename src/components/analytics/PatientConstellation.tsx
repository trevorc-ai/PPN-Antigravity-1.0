import React, { useState, useEffect } from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell
} from 'recharts';
import { Users, Lightbulb, Info, BarChart2 } from 'lucide-react';
import { ChartSkeleton } from './ChartSkeleton';
import {
    usePatientFlow, PATIENT_MIN_N,
    type ConstellationBubble,
} from '../../hooks/usePatientFlow';

/**
 * WO-679: PatientConstellation — Live Data
 *
 * Scatter plot: X = session count, Y = substance bucket index (jittered).
 * Each point = one de-identified patient UUID.
 * Color by substance. Min-5 patients guard.
 */

// Substance colour palette — extended as needed
const SUBSTANCE_PALETTE = [
    '#6366f1', // indigo
    '#10b981', // emerald
    '#f59e0b', // amber
    '#3b82f6', // blue
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
    '#a855f7', // purple
];

const STATUS_COLOR_MAP: Record<string, string> = {
    complete:    '#10b981',
    completed:   '#10b981',
    integration: '#6366f1',
    dosing:      '#f59e0b',
    preparation: '#3b82f6',
    active:      '#94a3b8',
};

// ── Zero State ───────────────────────────────────────────────────────────────
const ZeroState = ({ totalPatients, error }: { totalPatients: number; error: string | null }) => (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
            <Users className="w-6 h-6 text-slate-500" />
        </div>
        {error ? (
            <p className="ppn-body text-slate-500 text-center max-w-xs">{error}</p>
        ) : (
            <>
                <h3 className="ppn-card-title text-slate-300 text-center">
                    Insufficient patient data
                </h3>
                <p className="ppn-body text-slate-500 text-center max-w-xs">
                    Need {PATIENT_MIN_N} patients to render the constellation.
                    {totalPatients > 0 && (
                        <> You have <strong className="text-slate-300">{totalPatients}</strong> so far.</>
                    )}
                </p>
            </>
        )}
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
export default function PatientConstellation({ hideHeader: _hideHeader }: { data?: unknown; hideHeader?: boolean }) {
    const { constellationSuppressed, totalPatients, bubbles, loading, error } = usePatientFlow();
    const [showGuide, setShowGuide] = useState(false);
    const [chartReady, setChartReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setChartReady(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Build substance → colour map
    const substanceNames = Array.from(new Set(bubbles.map(b => b.substanceName)));
    const substanceColorMap = Object.fromEntries(
        substanceNames.map((name, i) => [name, SUBSTANCE_PALETTE[i % SUBSTANCE_PALETTE.length]])
    );

    // scatter data: {x: sessionCount, y: substanceIndex + jitter}
    const chartData = bubbles.map(b => ({
        ...b,
        x: b.sessionCount,
        y: b.substanceIndex + (Math.random() * 0.6 - 0.3), // deterministic-ish jitter based on id
        color: substanceColorMap[b.substanceName] ?? '#94a3b8',
    }));

    const yMax = Math.max(substanceNames.length, 1);
    const xMax = Math.max(...bubbles.map(b => b.sessionCount), 10);

    const tickFormatterY = (idx: number) => {
        const name = substanceNames[Math.round(idx)];
        return name ? (name.length > 10 ? name.slice(0, 9) + '…' : name) : '';
    };

    return (
        <div className="w-full bg-[#0f1218] p-3 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl relative h-[400px] sm:h-[500px] flex flex-col">
            {/* Info button */}
            <div className="flex items-center justify-end mb-4 z-10 relative shrink-0">
                <button
                    onClick={() => setShowGuide(!showGuide)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
                    title="How to read this chart"
                    aria-expanded={showGuide}
                >
                    <Info className="w-5 h-5" />
                </button>
            </div>

            {/* Guide popover */}
            {showGuide && (
                <div className="absolute top-16 right-6 w-72 bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl z-20 animate-in fade-in slide-in-from-top-2">
                    <h4 className="ppn-meta font-black text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Lightbulb className="w-3 h-3 text-amber-400" /> Reading the Galaxy
                    </h4>
                    <ul className="space-y-2 ppn-meta text-slate-300 leading-relaxed">
                        <li><strong className="text-slate-300">X-Axis:</strong> Number of sessions logged per patient.</li>
                        <li><strong className="text-slate-300">Y-Axis:</strong> Substance used (one row per substance type).</li>
                        <li><strong className="text-slate-300">Each dot:</strong> One de-identified patient UUID.</li>
                    </ul>
                </div>
            )}

            {/* Loading */}
            {loading && <ChartSkeleton height="100%" />}

            {/* Suppressed / Error */}
            {!loading && (constellationSuppressed || error) && (
                <ZeroState totalPatients={totalPatients} error={error} />
            )}

            {/* Live chart */}
            {!loading && !constellationSuppressed && !error && chartReady && (
                <>
                    <div
                        className="flex-1 w-full min-h-0 relative z-0"
                        role="img"
                        aria-label="Scatter plot of de-identified patient UUIDs grouped by substance and session count - live data"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                                <XAxis
                                    type="number"
                                    dataKey="x"
                                    name="Sessions"
                                    domain={[0, xMax + 1]}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    label={{ value: 'Sessions logged per patient', position: 'insideBottom', offset: -15, fill: '#475569', fontSize: 12, fontWeight: 700 }}
                                />
                                <YAxis
                                    type="number"
                                    dataKey="y"
                                    name="Substance"
                                    domain={[-0.5, yMax - 0.5]}
                                    tickCount={yMax}
                                    tickFormatter={tickFormatterY}
                                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                                    width={90}
                                />
                                <Tooltip
                                    cursor={{ strokeDasharray: '3 3' }}
                                    content={({ active, payload }) => {
                                        if (!active || !payload?.length) return null;
                                        const d = payload[0].payload as ConstellationBubble & { color: string };
                                        return (
                                            <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-xl">
                                                <p className="ppn-meta font-black text-slate-400 uppercase mb-1">Patient {d.patientId}</p>
                                                <p className="ppn-meta text-slate-300">{d.substanceName} · {d.sessionCount} session{d.sessionCount !== 1 ? 's' : ''}</p>
                                                <p className="ppn-meta text-slate-500 mt-1">Status: {d.latestStatus}</p>
                                            </div>
                                        );
                                    }}
                                />
                                <Scatter name="Patients" data={chartData} fill="#818cf8">
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Substance legend */}
                    <div className="flex flex-wrap gap-3 mt-2 shrink-0">
                        {substanceNames.map(name => (
                            <div key={name} className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ background: substanceColorMap[name] }} />
                                <span className="ppn-meta text-slate-500">{name}</span>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-2 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-start gap-3 shrink-0">
                        <BarChart2 className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                        <p className="ppn-meta text-indigo-100/70">
                            <strong className="text-indigo-400">{totalPatients} unique patients</strong> across {substanceNames.length} substance{substanceNames.length !== 1 ? 's' : ''} · Live data
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
