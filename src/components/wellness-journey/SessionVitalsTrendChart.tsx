import React, { FC, useMemo, useState } from 'react';
import {
    ComposedChart, Line, Scatter, ReferenceLine, ReferenceDot,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { HeartPulse } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface VitalsSnapshot {
    id: string;
    /** Elapsed seconds from session start (T+0) */
    elapsedSec: number;
    /** undefined when not recorded — Recharts skips undefined as a gap */
    heartRate?: number;
    bpSystolic?: number;
    temperatureF?: number;
}

/** A session event to plot as a dot inside the vitals chart */
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
    onThresholdViolation: (vital: string, value: number) => void;
    data?: VitalsSnapshot[];
    events?: SessionEventPin[];
    /** Total elapsed seconds — drives the growing X-axis domain */
    sessionDurationSec?: number;
}

// ── Thresholds ────────────────────────────────────────────────────────────────

const VITAL_THRESHOLDS = {
    hrHigh: 130, hrLow: 45,
    bpSystolicHigh: 140, bpSystolicLow: 85,
    tempHigh: 100.4,
};

/**
 * Clinical severity band map — Y position within the chart for each event type.
 * Gradient: TOP (Y≈165) = most serious adverse/crisis → BOTTOM (Y≈56) = pleasant/rescue.
 * Events are plotted as colored dots in these bands — no overlap with vitals lines.
 *
 * RED/Top    ── adverse events, safety crises
 * ORANGE     ── clinical decisions during difficult moments
 * AMBER      ── patient observations (concern)
 * NEUTRAL    ── general notes, session updates
 * TEAL       ── vital checks, routine monitoring
 * BLUE       ── dose administration
 * GREEN/Bot  ── rescue protocol, music/grounding, pleasant
 */
const EVENT_Y_BAND: Record<string, number> = {
    // ── TOP — adverse / crisis (red) ──────────────────────────────────
    'safety-and-adverse-event': 165,
    'safety_event': 165,
    'SAFETY': 165,
    // ── UPPER — clinical decision (orange) ────────────────────────────
    'clinical_decision': 150,
    // ── UPPER-MID — patient observation (amber) ───────────────────────
    'patient_observation': 135,
    'OBSERVATION': 135,
    // ── MID — general / session update (neutral) ─────────────────────
    'general_note': 118,
    'session_update': 108,
    'UPDATE': 108,
    // ── LOWER-MID — vital check (teal) ────────────────────────────────
    'vital_check': 92,
    // ── LOWER — dose administration (blue/emerald) ────────────────────
    'dose_admin': 76,
    'DOSE': 76,
    // ── BOTTOM — rescue / music / grounding (green) ───────────────────
    'rescue-protocol': 58,
    'rescue': 58,
    'music_change': 62,
};

/** Returns the Y band for a given event type, defaulting to the neutral mid-row. */
function getEventDotY(type: string): number {
    return EVENT_Y_BAND[type] ?? 108;
}

// Y-axis domain — expanded to 172 so top-band event dots sit above the BP/HR alert lines
const Y_DOMAIN: [number, number] = [50, 172];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtElapsed(sec: number): string {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `T+${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function generateTicks(domainMaxSec: number): number[] {
    const candidateIntervalsMins = [5, 10, 15, 20, 30, 45, 60];
    const targetTicks = 7;
    const domainMins = domainMaxSec / 60;
    const interval = candidateIntervalsMins.find(i => domainMins / i <= targetTicks) ?? 60;
    const ticks: number[] = [];
    for (let sec = 0; sec <= domainMaxSec; sec += interval * 60) ticks.push(sec);
    if (ticks[ticks.length - 1] < domainMaxSec) ticks.push(domainMaxSec);
    return ticks;
}

// ── Event pin colour map ──────────────────────────────────────────────────────

const PIN_COLORS: Record<string, { fill: string; stroke: string; emoji: string; label: string }> = {
    DOSE: { fill: '#6366f1', stroke: '#818cf8', emoji: '💊', label: 'Dose' },
    dose_admin: { fill: '#10b981', stroke: '#34d399', emoji: '💊', label: 'Dose Admin' },
    SAFETY: { fill: '#ef4444', stroke: '#f87171', emoji: '⚠', label: 'Safety' },
    safety_event: { fill: '#ef4444', stroke: '#f87171', emoji: '⚠', label: 'Safety Event' },
    'safety-and-adverse-event': { fill: '#f97316', stroke: '#fb923c', emoji: '⚠', label: 'Adverse Event' },
    'rescue-protocol': { fill: '#f43f5e', stroke: '#fb7185', emoji: '🛟', label: 'Rescue Protocol' },
    rescue: { fill: '#f43f5e', stroke: '#fb7185', emoji: '🛟', label: 'Rescue' },
    session_update: { fill: '#0ea5e9', stroke: '#38bdf8', emoji: '📋', label: 'Session Update' },
    UPDATE: { fill: '#0ea5e9', stroke: '#38bdf8', emoji: '📋', label: 'Update' },
    vital_check: { fill: '#3b82f6', stroke: '#60a5fa', emoji: '❤', label: 'Vital Check' },
    patient_observation: { fill: '#f59e0b', stroke: '#fbbf24', emoji: '👁', label: 'Observation' },
    OBSERVATION: { fill: '#f59e0b', stroke: '#fbbf24', emoji: '👁', label: 'Observation' },
    general_note: { fill: '#64748b', stroke: '#94a3b8', emoji: '📝', label: 'Note' },
};

function getPinStyle(type: string) {
    return PIN_COLORS[type] ?? { fill: '#475569', stroke: '#64748b', emoji: '·', label: type };
}

// ── Series toggle config ──────────────────────────────────────────────────────

const SERIES = [
    { key: 'hr', label: 'HR (bpm)', color: '#f43f5e' },
    { key: 'bp', label: 'BP Sys (mmHg)', color: '#0ea5e9' },
    { key: 'temp', label: 'Temp (°F)', color: '#d97706' },
    { key: 'events', label: 'Events', color: '#38bdf8' },
] as const;
type SeriesKey = typeof SERIES[number]['key'];

// ── Custom event dot — renders inside the chart at its severity-band Y ──────

const EventDot = (props: any) => {
    const { cx, cy, payload } = props;
    const p = getPinStyle(payload?.type ?? '');
    const [hovered, setHovered] = useState(false);
    if (!cx || !cy) return null;
    return (
        <g>
            {/* Outer glow ring on hover */}
            {hovered && (
                <circle cx={cx} cy={cy} r={12} fill={p.fill} fillOpacity={0.2} stroke={p.stroke} strokeWidth={1} />
            )}
            {/* Main dot */}
            <circle
                cx={cx} cy={cy} r={7}
                fill={p.fill} stroke={p.stroke} strokeWidth={1.5}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            />
            {/* Emoji glyph inside dot */}
            <text
                x={cx} y={cy + 4}
                textAnchor="middle"
                fontSize={8}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
                {p.emoji}
            </text>
        </g>
    );
};

// ── Combined Tooltip — handles both vitals and event dots ─────────────────────

const ChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    // Check if this is an event dot (payload from Scatter uses `payload.payload`)
    const eventPayload = payload.find((p: any) => p.name === 'events');
    if (eventPayload) {
        const ev: SessionEventPin = eventPayload.payload;
        const p = getPinStyle(ev.type);
        return (
            <div className="bg-slate-800 border border-slate-600 rounded-xl p-3 shadow-xl text-sm min-w-[180px]">
                <p className="font-bold text-white mb-1">{p.emoji} {p.label}</p>
                <p className="text-slate-400 text-xs font-mono">{fmtElapsed(ev.elapsedSec)}</p>
                {ev.label && ev.label !== p.label && (
                    <p className="text-slate-300 text-xs mt-1">{ev.label}</p>
                )}
            </div>
        );
    }

    // Vitals tooltip
    const hr = payload.find((p: any) => p.dataKey === 'heartRate')?.value;
    const bp = payload.find((p: any) => p.dataKey === 'bpSystolic')?.value;
    const temp = payload.find((p: any) => p.dataKey === 'temperatureF')?.value;
    if (!hr && !bp && !temp) return null;

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-xl text-sm min-w-[200px]">
            <p className="font-bold text-white mb-2 pb-1 border-b border-slate-700">
                {fmtElapsed(typeof label === 'number' ? label : 0)}
            </p>
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
    sessionDurationSec = 0,
}) => {
    const [visible, setVisible] = useState<Record<SeriesKey, boolean>>({
        hr: true, bp: true, temp: true, events: true,
    });
    const toggle = (key: SeriesKey) => setVisible(v => ({ ...v, [key]: !v[key] }));

    // X-axis domain always ends at current session time (minimum 10 min)
    const domainMaxSec = useMemo(() => {
        const allElapsed = [
            ...data.map(d => d.elapsedSec),
            ...events.map(e => e.elapsedSec),
            sessionDurationSec,
            600,
        ];
        return Math.max(...allElapsed);
    }, [data, events, sessionDurationSec]);

    const xTicks = useMemo(() => generateTicks(domainMaxSec), [domainMaxSec]);

    // Vitals line data — sorted ascending
    const chartData = useMemo(() =>
        [...data]
            .sort((a, b) => a.elapsedSec - b.elapsedSec)
            .map(v => ({
                ...v,
                isBpViolation: v.bpSystolic > VITAL_THRESHOLDS.bpSystolicHigh,
                isHrViolation: v.heartRate > VITAL_THRESHOLDS.hrHigh,
            })),
        [data]);

    // Event scatter data — fixed Y so all dots sit in a row along the bottom
    const eventScatterData = useMemo(() =>
        events.map(ev => ({ ...ev, y: getEventDotY(ev.type) })),
        [events]);

    const hasData = chartData.length > 0;

    return (
        <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl flex flex-col gap-4">

            {/* ── Header ─────────────────────────────────────────────────── */}
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

                {/* ── Series toggles ─────────────────────────────────────── */}
                <div className="flex flex-wrap gap-2">
                    {SERIES.map(s => (
                        <button
                            key={s.key}
                            onClick={() => toggle(s.key)}
                            aria-pressed={visible[s.key]}
                            aria-label={`${visible[s.key] ? 'Hide' : 'Show'} ${s.label}`}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold uppercase tracking-wide transition-all ${visible[s.key]
                                ? 'border-opacity-60 shadow-sm'
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

            {/* ── Chart ──────────────────────────────────────────────────── */}
            <div className="h-[300px] w-full">
                {(hasData || events.length > 0) ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart margin={{ top: 10, right: 20, bottom: 24, left: -10 }}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(148,163,184,0.07)"
                                vertical={false}
                            />

                            {/*
                             * Numeric X-axis — domain grows with session time.
                             * All vitals dots and event pins sit at their exact
                             * elapsedSec offsets. Older entries slide left as
                             * new ones are logged to the right.
                             */}
                            <XAxis
                                type="number"
                                dataKey="elapsedSec"
                                domain={[0, domainMaxSec]}
                                ticks={xTicks}
                                tickFormatter={fmtElapsed}
                                stroke="#374151"
                                tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 600 }}
                                axisLine={{ stroke: '#374151' }}
                                tickLine={false}
                                dy={8}
                                label={{
                                    value: 'Elapsed Session Time →',
                                    position: 'insideBottom',
                                    offset: -14,
                                    fill: '#4b5563',
                                    fontSize: 9,
                                    fontWeight: 'bold',
                                    letterSpacing: '0.08em',
                                }}
                            />
                            <YAxis
                                stroke="#374151"
                                tick={{ fill: '#6b7280', fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                dx={-8}
                                domain={Y_DOMAIN}
                                allowDataOverflow={false}
                            />

                            <Tooltip content={<ChartTooltip />} />

                            {/* ── Threshold reference lines ─────────────── */}
                            <ReferenceLine
                                y={VITAL_THRESHOLDS.bpSystolicHigh}
                                stroke="#f59e0b" strokeWidth={1} strokeDasharray="6 4"
                                label={{ value: `BP Alert (${VITAL_THRESHOLDS.bpSystolicHigh})`, position: 'insideTopLeft', fill: '#f59e0b', fontSize: 10 }}
                            />
                            <ReferenceLine
                                y={VITAL_THRESHOLDS.hrHigh}
                                stroke="#f43f5e" strokeWidth={1} strokeDasharray="6 4"
                                label={{ value: `HR Alert (${VITAL_THRESHOLDS.hrHigh})`, position: 'insideTopLeft', fill: '#f43f5e', fontSize: 10 }}
                            />

                            {/* ── Vitals lines ──────────────────────────── */}
                            {visible.temp && (
                                <Line
                                    data={chartData}
                                    type="monotone" dataKey="temperatureF"
                                    stroke="#d97706" strokeWidth={1.5} strokeDasharray="4 3"
                                    dot={{ fill: '#d97706', r: 3, strokeWidth: 0 }}
                                    activeDot={{ r: 5, fill: '#fbbf24' }}
                                    isAnimationActive={false}
                                />
                            )}
                            {visible.hr && (
                                <Line
                                    data={chartData}
                                    type="monotone" dataKey="heartRate"
                                    stroke="#f43f5e" strokeWidth={2}
                                    dot={{ fill: '#f43f5e', r: 4, strokeWidth: 0 }}
                                    activeDot={{ r: 6, fill: '#fb7185' }}
                                    isAnimationActive={false}
                                />
                            )}
                            {visible.bp && (
                                <Line
                                    data={chartData}
                                    type="monotone" dataKey="bpSystolic"
                                    stroke="#0ea5e9" strokeWidth={2.5}
                                    dot={{ fill: '#0ea5e9', r: 4, strokeWidth: 0 }}
                                    activeDot={{ r: 6, fill: '#38bdf8' }}
                                    isAnimationActive={false}
                                />
                            )}

                            {/* ── Violation markers ─────────────────────── */}
                            {chartData.map((entry, i) => entry.isBpViolation && (
                                <ReferenceDot key={`bpv-${i}`} x={entry.elapsedSec} y={entry.bpSystolic}
                                    r={6} fill="#ef4444" stroke="#7f1d1d" strokeWidth={2}
                                    label={{ value: 'BP↑', position: 'top', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                            ))}
                            {chartData.map((entry, i) => entry.isHrViolation && (
                                <ReferenceDot key={`hrv-${i}`} x={entry.elapsedSec} y={entry.heartRate}
                                    r={6} fill="#ef4444" stroke="#7f1d1d" strokeWidth={2}
                                    label={{ value: 'HR↑', position: 'bottom', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                            ))}

                            {/*
                             * ── Event dots — plotted at their clinical severity band Y ──
                             * Each event type maps to a fixed Y row on the severity gradient:
                             * RED/top (Y≈165) = adverse/crisis → GREEN/bottom (Y≈58) = rescue/pleasant.
                             * Dots are styled by type and reveal details on hover.
                             */}
                            {visible.events && (
                                <Scatter
                                    name="events"
                                    data={eventScatterData}
                                    dataKey="y"
                                    shape={<EventDot />}
                                    isAnimationActive={false}
                                />
                            )}
                        </ComposedChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-3 border border-dashed border-slate-700/40 rounded-xl bg-slate-900/20">
                        <HeartPulse className="w-7 h-7 text-slate-600" />
                        <p className="text-sm text-slate-500 font-semibold">No data recorded yet</p>
                        <p className="text-xs text-slate-600 text-center leading-relaxed max-w-72">
                            Log a Session Update (HR / BP) or trigger an event to start plotting
                        </p>
                    </div>
                )}
            </div>

            {/* ── Legend ──────────────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-4 justify-center">
                {SERIES.map(s => (
                    <div key={s.key} className={`flex items-center gap-1.5 transition-opacity ${visible[s.key] ? 'opacity-100' : 'opacity-25'}`}>
                        {s.key !== 'events' ? (
                            <svg width="24" height="10">
                                <line x1="0" y1="5" x2="24" y2="5"
                                    stroke={s.color}
                                    strokeWidth={s.key === 'bp' ? 2.5 : 2}
                                    strokeDasharray={s.key === 'temp' ? '5 3' : undefined}
                                />
                            </svg>
                        ) : (
                            <svg width="14" height="14">
                                <circle cx="7" cy="7" r="6" fill={`${s.color}40`} stroke={s.color} strokeWidth="1.5" />
                            </svg>
                        )}
                        <span className="text-xs text-slate-400 font-medium tracking-wide">{s.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
