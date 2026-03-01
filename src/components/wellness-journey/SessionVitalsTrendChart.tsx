import React, { FC, useMemo, useState } from 'react';
import {
    ComposedChart, Line, ReferenceLine, ReferenceDot,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { HeartPulse } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface VitalsSnapshot {
    id: string;
    /** Elapsed seconds from session start (T+0) */
    elapsedSec: number;
    heartRate: number;
    bpSystolic: number;
    temperatureF: number;
}

/** A session event to plot as an icon-pin beneath the vitals lines */
export interface SessionEventPin {
    id: string;
    /** Elapsed seconds from session start */
    elapsedSec: number;
    /** Matches keys in EVENT_CONFIG from LiveSessionTimeline */
    type: string;
    label?: string;
}

interface SessionVitalsTrendChartProps {
    sessionId: string;
    substance: string;
    /** Called when a reading crosses a clinical threshold */
    onThresholdViolation: (vital: string, value: number) => void;
    /** Live vitals data fed from DosingSessionPhase — empty array renders empty state */
    data?: VitalsSnapshot[];
    /** Session events (updates, doses, adverse events, rescue) fed from DosingSessionPhase */
    events?: SessionEventPin[];
    /** Elapsed session timer string (e.g. "01:23:45") — used for X-axis label formatting */
    sessionDuration?: number; // total seconds elapsed so far
}

// ── Thresholds ────────────────────────────────────────────────────────────────

const VITAL_THRESHOLDS = {
    hrHigh: 130, hrLow: 45,
    bpSystolicHigh: 140, bpSystolicLow: 85,
    tempHigh: 100.4,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Format elapsed seconds as "T+HH:MM" */
function fmtElapsed(sec: number): string {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `T+${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// ── Event pin colour map (subset — matches LiveSessionTimeline EVENT_CONFIG keys) ──
const PIN_COLORS: Record<string, { bg: string; border: string; text: string; emoji: string }> = {
    DOSE: { bg: 'bg-indigo-500/80', border: 'border-indigo-400', text: 'text-white', emoji: '💊' },
    dose_admin: { bg: 'bg-emerald-500/80', border: 'border-emerald-400', text: 'text-white', emoji: '💊' },
    SAFETY: { bg: 'bg-red-500/80', border: 'border-red-400', text: 'text-white', emoji: '⚠' },
    safety_event: { bg: 'bg-red-500/80', border: 'border-red-400', text: 'text-white', emoji: '⚠' },
    rescue: { bg: 'bg-rose-600/80', border: 'border-rose-400', text: 'text-white', emoji: '🛟' },
    'safety-and-adverse-event': { bg: 'bg-orange-500/80', border: 'border-orange-400', text: 'text-white', emoji: '⚠' },
    'rescue-protocol': { bg: 'bg-rose-600/80', border: 'border-rose-400', text: 'text-white', emoji: '🛟' },
    session_update: { bg: 'bg-sky-500/80', border: 'border-sky-400', text: 'text-white', emoji: '📋' },
    UPDATE: { bg: 'bg-sky-500/80', border: 'border-sky-400', text: 'text-white', emoji: '📋' },
    vital_check: { bg: 'bg-blue-500/80', border: 'border-blue-400', text: 'text-white', emoji: '❤' },
    patient_observation: { bg: 'bg-amber-500/80', border: 'border-amber-400', text: 'text-white', emoji: '👁' },
    OBSERVATION: { bg: 'bg-amber-500/80', border: 'border-amber-400', text: 'text-white', emoji: '👁' },
    general_note: { bg: 'bg-slate-500/80', border: 'border-slate-400', text: 'text-white', emoji: '📝' },
};

function getPinColors(type: string) {
    return PIN_COLORS[type] ?? { bg: 'bg-slate-600/80', border: 'border-slate-500', text: 'text-white', emoji: '·' };
}

// ── Series toggle config ──────────────────────────────────────────────────────

const SERIES = [
    { key: 'hr', label: 'HR (bpm)', color: '#f43f5e' },
    { key: 'bp', label: 'BP Sys (mmHg)', color: '#0ea5e9' },
    { key: 'temp', label: 'Temp (°F)', color: '#d97706' },
    { key: 'pins', label: 'Events', color: '#38bdf8' },
] as const;
type SeriesKey = typeof SERIES[number]['key'];

// ── Vitals Tooltip ────────────────────────────────────────────────────────────

const VitalsTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const hr = payload.find((p: any) => p.dataKey === 'heartRate')?.value;
    const bp = payload.find((p: any) => p.dataKey === 'bpSystolic')?.value;
    const temp = payload.find((p: any) => p.dataKey === 'temperatureF')?.value;
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-xl text-sm min-w-[220px]">
            <p className="font-bold text-white mb-2 pb-1 border-b border-slate-700">{label}</p>
            {hr !== undefined && (
                <div className="flex justify-between items-center mb-1">
                    <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" /> HR (bpm)
                    </span>
                    <span className={`font-bold ${hr > VITAL_THRESHOLDS.hrHigh || hr < VITAL_THRESHOLDS.hrLow ? 'text-rose-500' : 'text-white'}`}>{hr}</span>
                </div>
            )}
            {bp !== undefined && (
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sky-400 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-sky-500 rounded-sm" /> BP Sys (mmHg)
                    </span>
                    <span className={`font-bold ${bp > VITAL_THRESHOLDS.bpSystolicHigh || bp < VITAL_THRESHOLDS.bpSystolicLow ? 'text-amber-500' : 'text-white'}`}>{bp}</span>
                </div>
            )}
            {temp !== undefined && (
                <div className="flex justify-between items-center mb-1">
                    <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-amber-500 rotate-45" /> Temp (°F)
                    </span>
                    <span className={`font-bold ${temp > VITAL_THRESHOLDS.tempHigh ? 'text-amber-500' : 'text-white'}`}>{temp.toFixed(1)}</span>
                </div>
            )}
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────

export const SessionVitalsTrendChart: FC<SessionVitalsTrendChartProps> = ({
    sessionId,
    substance,
    onThresholdViolation,
    data = [],
    events = [],
}) => {
    // ── Series visibility toggles ─────────────────────────────────────────────
    const [visible, setVisible] = useState<Record<SeriesKey, boolean>>({
        hr: true, bp: true, temp: true, pins: true,
    });
    const toggle = (key: SeriesKey) => setVisible(v => ({ ...v, [key]: !v[key] }));

    // ── Chart data — elapsed-time X axis ──────────────────────────────────────
    const chartData = useMemo(() => {
        return data.map(v => ({
            ...v,
            timeLabel: fmtElapsed(v.elapsedSec),
            isBpViolation: v.bpSystolic > VITAL_THRESHOLDS.bpSystolicHigh,
            isHrViolation: v.heartRate > VITAL_THRESHOLDS.hrHigh,
            isTempViolation: v.temperatureF > VITAL_THRESHOLDS.tempHigh,
        }));
    }, [data]);

    // ── Empty state ───────────────────────────────────────────────────────────
    const hasData = chartData.length > 0;
    const hasEvents = events.length > 0;

    // ── Icon-pin X-positions — map elapsedSec to % of chart width ────────────
    // We compute bounds from data or events so pins land on the same timeline.
    const maxElapsed = useMemo(() => {
        const allTimes = [...data.map(d => d.elapsedSec), ...events.map(e => e.elapsedSec)];
        return allTimes.length > 0 ? Math.max(...allTimes) : 0;
    }, [data, events]);

    return (
        <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl flex flex-col gap-4">

            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                        <HeartPulse className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white leading-tight">Session Vitals Trend</h2>
                        <p className="text-xs tracking-widest uppercase font-bold text-slate-500 mt-0.5">
                            Real-time Physiological Monitoring · Elapsed Time
                        </p>
                    </div>
                </div>

                {/* ── Series toggle buttons ───────────────────────────────── */}
                <div className="flex flex-wrap gap-2">
                    {SERIES.map(s => (
                        <button
                            key={s.key}
                            onClick={() => toggle(s.key)}
                            aria-pressed={visible[s.key]}
                            aria-label={`${visible[s.key] ? 'Hide' : 'Show'} ${s.label}`}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold uppercase tracking-wide transition-all ${visible[s.key]
                                    ? 'border-opacity-60 text-white shadow-sm'
                                    : 'bg-slate-800/60 border-slate-700/40 text-slate-500'
                                }`}
                            style={visible[s.key] ? {
                                backgroundColor: `${s.color}25`,
                                borderColor: `${s.color}80`,
                                color: s.color,
                            } : {}}
                        >
                            <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: visible[s.key] ? s.color : '#475569' }}
                            />
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Vitals Chart ───────────────────────────────────────────── */}
            {hasData ? (
                <div className="h-[300px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData} margin={{ top: 10, right: 30, bottom: 20, left: -10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                            <XAxis
                                dataKey="timeLabel"
                                stroke="#475569"
                                tick={{ fill: '#94a3b8', fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                                label={{ value: 'Elapsed Session Time', position: 'insideBottom', offset: -10, fill: '#475569', fontSize: 10, fontWeight: 'bold' }}
                            />
                            <YAxis
                                stroke="#475569"
                                tick={{ fill: '#94a3b8', fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                dx={-10}
                                domain={[60, 160]}
                            />
                            <Tooltip content={<VitalsTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />

                            {/* Threshold reference lines */}
                            <ReferenceLine y={VITAL_THRESHOLDS.bpSystolicHigh} stroke="#f59e0b" strokeWidth={1} strokeDasharray="5 5"
                                label={{ value: `BP Alert (${VITAL_THRESHOLDS.bpSystolicHigh})`, position: 'insideTopLeft', fill: '#f59e0b', fontSize: 10 }} />
                            <ReferenceLine y={VITAL_THRESHOLDS.hrHigh} stroke="#f43f5e" strokeWidth={1} strokeDasharray="5 5"
                                label={{ value: `HR Alert (${VITAL_THRESHOLDS.hrHigh})`, position: 'insideTopLeft', fill: '#f43f5e', fontSize: 10 }} />

                            {/* Temperature */}
                            {visible.temp && (
                                <Line type="monotone" dataKey="temperatureF" stroke="#d97706" strokeWidth={1.5}
                                    strokeDasharray="3 3" dot={{ fill: '#d97706', r: 3, strokeWidth: 0 }}
                                    activeDot={{ r: 5, fill: '#fbbf24' }} animationBegin={200} animationDuration={600} />
                            )}
                            {/* Heart Rate */}
                            {visible.hr && (
                                <Line type="monotone" dataKey="heartRate" stroke="#f43f5e" strokeWidth={2}
                                    dot={{ fill: '#f43f5e', r: 4, strokeWidth: 0 }}
                                    activeDot={{ r: 6, fill: '#fb7185' }} animationBegin={400} animationDuration={600} />
                            )}
                            {/* BP Systolic */}
                            {visible.bp && (
                                <Line type="monotone" dataKey="bpSystolic" stroke="#0ea5e9" strokeWidth={2.5}
                                    dot={{ fill: '#0ea5e9', r: 4, strokeWidth: 0 }}
                                    activeDot={{ r: 6, fill: '#38bdf8' }} animationBegin={600} animationDuration={600} />
                            )}

                            {/* Violation markers */}
                            {chartData.map((entry, i) => entry.isBpViolation && (
                                <ReferenceDot key={`bp-viol-${i}`} x={entry.timeLabel} y={entry.bpSystolic}
                                    r={6} fill="#ef4444" stroke="#7f1d1d" strokeWidth={2}
                                    label={{ value: 'BP ↑', position: 'top', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                            ))}
                            {chartData.map((entry, i) => entry.isHrViolation && (
                                <ReferenceDot key={`hr-viol-${i}`} x={entry.timeLabel} y={entry.heartRate}
                                    r={6} fill="#ef4444" stroke="#7f1d1d" strokeWidth={2}
                                    label={{ value: 'HR ↑', position: 'bottom', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                            ))}
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-[200px] flex flex-col items-center justify-center gap-3 border border-dashed border-slate-700/50 rounded-xl">
                    <HeartPulse className="w-8 h-8 text-slate-600" />
                    <p className="text-sm text-slate-500 font-semibold">No vitals recorded yet</p>
                    <p className="text-xs text-slate-600">Log a Session Update with vitals or open Session Vitals form to begin plotting</p>
                </div>
            )}

            {/* ── Icon-Pin Event Strip ────────────────────────────────────── */}
            {(hasEvents || hasData) && visible.pins && (
                <div
                    className="relative h-10 border border-slate-700/30 rounded-xl bg-slate-900/40 overflow-hidden"
                    aria-label="Session event timeline strip"
                >
                    {/* Label */}
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-widest font-bold text-slate-600 pointer-events-none">
                        Events
                    </span>

                    {/* Baseline axis line */}
                    <div className="absolute left-10 right-2 top-1/2 h-px bg-slate-700/40" />

                    {/* Pins */}
                    {events.map(ev => {
                        const pct = maxElapsed > 0 ? (ev.elapsedSec / maxElapsed) * 100 : 50;
                        const c = getPinColors(ev.type);
                        return (
                            <div
                                key={ev.id}
                                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group"
                                style={{ left: `calc(2.5rem + ${pct}% * (100% - 2.5rem - 0.5rem) / 100)` }}
                                title={`${fmtElapsed(ev.elapsedSec)} · ${ev.label ?? ev.type}`}
                                aria-label={`Event at ${fmtElapsed(ev.elapsedSec)}: ${ev.label ?? ev.type}`}
                            >
                                <span
                                    className={`flex items-center justify-center w-6 h-6 rounded-full border text-[11px] select-none cursor-default
                                        shadow-md transition-transform group-hover:scale-125 ${c.bg} ${c.border} ${c.text}`}
                                >
                                    {c.emoji}
                                </span>
                                {/* Tooltip on hover */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col items-center pointer-events-none z-10">
                                    <div className="bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white whitespace-nowrap shadow-xl">
                                        <p className="font-bold">{c.emoji} {ev.label ?? ev.type}</p>
                                        <p className="text-slate-400">{fmtElapsed(ev.elapsedSec)}</p>
                                    </div>
                                    <div className="w-1.5 h-1.5 bg-slate-800 border-r border-b border-slate-600 rotate-45 -mt-0.5" />
                                </div>
                            </div>
                        );
                    })}

                    {/* Empty pins state */}
                    {events.length === 0 && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-600 italic">
                            No events logged yet
                        </span>
                    )}
                </div>
            )}

            {/* ── Legend row ──────────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-4 justify-center">
                {SERIES.filter(s => s.key !== 'pins').map(s => (
                    <div key={s.key} className={`flex items-center gap-1.5 transition-opacity ${visible[s.key] ? 'opacity-100' : 'opacity-30'}`}>
                        <svg width="24" height="12">
                            <line x1="0" y1="6" x2="24" y2="6" stroke={s.color} strokeWidth={s.key === 'bp' ? 2.5 : 2}
                                strokeDasharray={s.key === 'temp' ? '5 3' : undefined} />
                        </svg>
                        <span className="text-xs text-slate-400 font-medium tracking-wide">{s.label}</span>
                    </div>
                ))}
                <div className={`flex items-center gap-1.5 transition-opacity ${visible.pins ? 'opacity-100' : 'opacity-30'}`}>
                    <span className="text-sm">📋</span>
                    <span className="text-xs text-slate-400 font-medium tracking-wide">Events strip</span>
                </div>
            </div>

            <div className="text-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                    X-axis: Elapsed session time from T+00:00
                </span>
            </div>
        </div>
    );
};
