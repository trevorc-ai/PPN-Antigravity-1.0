/**
 * EmotionalWaveformChart
 * Phase 3 Integration — Emotional state dimensions over time.
 * Plain-English tooltips only. No clinical jargon.
 * Data: dummy until live Pulse Check pipeline is wired.
 */
import React, { useState, useRef, useCallback } from 'react';
import { Heart, Moon, Smile, Wind, Zap } from 'lucide-react';

// ─── Dummy data (90-day post-session dummy until live Pulse Check feed) ────────
const DUMMY_DAYS = 90;

function seedRand(seed: number) {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

function generateDummyData() {
    const rand = seedRand(42);
    return Array.from({ length: DUMMY_DAYS }, (_, i) => {
        const t = i / DUMMY_DAYS;
        // Smooth decay toward better wellbeing with realistic noise
        const base = 1 - t * 0.6; // starts higher, ends lower (lower = calmer/better for anxiety)
        const noise = () => (rand() - 0.5) * 0.3;
        return {
            day: i + 1,
            connection: Math.min(5, Math.max(1, Math.round((1 + t * 3.5 + noise() * 1.5) * 10) / 10)),
            sleep:      Math.min(5, Math.max(1, Math.round((1.5 + t * 2.8 + noise() * 1.2) * 10) / 10)),
            openness:   Math.min(5, Math.max(1, Math.round((1.2 + t * 3.2 + noise() * 1.4) * 10) / 10)),
            anxiety:    Math.min(5, Math.max(1, Math.round((5 - t * 3.5 + noise() * 1) * 10) / 10)),
            clarity:    Math.min(5, Math.max(1, Math.round((1 + t * 3.8 + noise() * 1.2) * 10) / 10)),
        };
    });
}

const DATA = generateDummyData();

// Smooth path using cubic bezier via SVG smooth curve
function buildPath(pts: [number, number][]): string {
    if (pts.length === 0) return '';
    let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1];
        const [x1, y1] = pts[i];
        const cpx = (x0 + x1) / 2;
        d += ` C ${cpx.toFixed(1)} ${y0.toFixed(1)}, ${cpx.toFixed(1)} ${y1.toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    }
    return d;
}

// ─── Dimension config ─────────────────────────────────────────────────────────

type DimKey = 'connection' | 'sleep' | 'openness' | 'anxiety' | 'clarity';

interface Dimension {
    key: DimKey;
    label: string;           // plain-English
    tooltipLow: string;
    tooltipHigh: string;
    color: string;
    stroke: string;
    fill: string;
    Icon: React.ComponentType<{ className?: string }>;
    invertScale?: boolean;   // for anxiety: high score = bad
}

const DIMS: Dimension[] = [
    {
        key: 'connection',
        label: 'Feeling connected',
        tooltipLow: 'Feeling isolated or disconnected from others',
        tooltipHigh: 'Feeling deeply connected to self, others, and life',
        color: '#a78bfa',
        stroke: '#a78bfa',
        fill: 'rgba(167,139,250,0.12)',
        Icon: Heart,
    },
    {
        key: 'sleep',
        label: 'Sleeping well',
        tooltipLow: 'Disrupted or poor-quality sleep',
        tooltipHigh: 'Restful, restorative sleep',
        color: '#60a5fa',
        stroke: '#60a5fa',
        fill: 'rgba(96,165,250,0.10)',
        Icon: Moon,
    },
    {
        key: 'openness',
        label: 'Open to life',
        tooltipLow: 'Feeling closed off or guarded',
        tooltipHigh: 'Open, receptive, curious about experience',
        color: '#34d399',
        stroke: '#34d399',
        fill: 'rgba(52,211,153,0.10)',
        Icon: Smile,
    },
    {
        key: 'anxiety',
        label: 'Worry level',
        tooltipLow: 'Calm, minimal worry',
        tooltipHigh: 'High anxiety or persistent worry',
        color: '#fb923c',
        stroke: '#fb923c',
        fill: 'rgba(251,146,60,0.10)',
        Icon: Wind,
        invertScale: true,
    },
    {
        key: 'clarity',
        label: 'Mental clarity',
        tooltipLow: 'Foggy, unfocused, hard to think clearly',
        tooltipHigh: 'Clear, focused, sharp thinking',
        color: '#f9a8d4',
        stroke: '#f9a8d4',
        fill: 'rgba(249,168,212,0.10)',
        Icon: Zap,
    },
];

// ─── Chart ────────────────────────────────────────────────────────────────────

const W = 700; const H = 220;
const PAD = { t: 16, r: 20, b: 36, l: 36 };
const cW = W - PAD.l - PAD.r;
const cH = H - PAD.t - PAD.b;

const toX = (day: number) => ((day - 1) / (DUMMY_DAYS - 1)) * cW;
const toY = (v: number, invert = false) => {
    const norm = invert ? (5 - v) / 4 : (v - 1) / 4; // 0..1
    return cH - norm * cH;
};

interface TooltipState {
    x: number; y: number;
    day: number;
    values: Record<DimKey, number>;
}

interface EmotionalWaveformChartProps {
    /** Override dummy data with live records */
    data?: Array<{ day: number; connection: number; sleep: number; openness: number; anxiety: number; clarity: number }>;
}

const EmotionalWaveformChart: React.FC<EmotionalWaveformChartProps> = ({ data }) => {
    const rows = data ?? DATA;
    const [activeDims, setActiveDims] = useState<Set<DimKey>>(new Set(['connection', 'sleep', 'openness', 'anxiety', 'clarity']));
    const [tooltip, setTooltip] = useState<TooltipState | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const toggle = (key: DimKey) =>
        setActiveDims(prev => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });

    const handleMouseMove = useCallback((e: React.MouseEvent<SVGRectElement>) => {
        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return;
        const svgX = (e.clientX - rect.left) * (W / rect.width) - PAD.l;
        const rawDay = Math.round((svgX / cW) * (DUMMY_DAYS - 1)) + 1;
        const day = Math.max(1, Math.min(DUMMY_DAYS, rawDay));
        const row = rows[day - 1];
        if (!row) return;
        setTooltip({
            x: PAD.l + toX(day),
            y: H / 2,
            day,
            values: { connection: row.connection, sleep: row.sleep, openness: row.openness, anxiety: row.anxiety, clarity: row.clarity },
        });
    }, [rows]);

    // Build paths per dimension (thin data for performance — every other point)
    const paths: Record<DimKey, string> = {} as any;
    const areas: Record<DimKey, string> = {} as any;
    for (const dim of DIMS) {
        const pts: [number, number][] = rows
            .filter((_, i) => i % 2 === 0 || i === rows.length - 1)
            .map(r => [toX(r.day), toY((r as any)[dim.key], dim.invertScale)] as [number, number]);
        paths[dim.key] = buildPath(pts);
        // Closed area path
        areas[dim.key] = paths[dim.key]
            + ` L ${pts[pts.length - 1][0].toFixed(1)} ${cH} L 0 ${cH} Z`;
    }

    const gradIds: Record<DimKey, string> = {} as any;
    DIMS.forEach(d => { gradIds[d.key] = `ewf-grad-${d.key}`; });

    // Milestone bands
    const milestones = [
        { day: 14, label: 'Week 2', color: 'rgba(167,139,250,0.08)' },
        { day: 30, label: 'Month 1', color: 'rgba(52,211,153,0.07)' },
        { day: 60, label: '2 Months', color: 'rgba(96,165,250,0.07)' },
        { day: 90, label: '3 Months', color: 'rgba(249,168,212,0.07)' },
    ];

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
                <div>
                    <h3 className="text-slate-100 font-black text-lg">Emotional Waveform</h3>
                    <p className="text-slate-400 text-sm mt-0.5">How you've been feeling across five dimensions, day by day</p>
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 py-1 bg-slate-800/60 rounded-lg border border-slate-700/50">
                    90 days post-session
                </span>
            </div>

            {/* Legend / toggles */}
            <div className="flex flex-wrap gap-2 mb-4">
                {DIMS.map(dim => {
                    const active = activeDims.has(dim.key);
                    const Icon = dim.Icon;
                    return (
                        <button
                            key={dim.key}
                            onClick={() => toggle(dim.key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                                active
                                    ? 'border-current bg-slate-800/60'
                                    : 'border-slate-700/40 bg-slate-900/40 opacity-40'
                            }`}
                            style={{ color: dim.color, borderColor: active ? dim.color + '50' : undefined }}
                            aria-pressed={active}
                            aria-label={`Toggle ${dim.label}`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {dim.label}
                        </button>
                    );
                })}
            </div>

            {/* SVG Chart */}
            <div className="relative">
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${W} ${H}`}
                    width="100%"
                    className="overflow-visible"
                    aria-label="Emotional waveform chart showing five wellbeing dimensions over 90 days"
                    role="img"
                >
                    <defs>
                        {DIMS.map(dim => (
                            <linearGradient key={dim.key} id={gradIds[dim.key]} x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor={dim.color} stopOpacity="0.25" />
                                <stop offset="100%" stopColor={dim.color} stopOpacity="0.02" />
                            </linearGradient>
                        ))}
                    </defs>

                    <g transform={`translate(${PAD.l},${PAD.t})`}>
                        {/* Milestone bands */}
                        {milestones.map((m, i) => {
                            const prev = milestones[i - 1]?.day ?? 0;
                            const x0 = toX(prev + 1);
                            const x1 = toX(m.day);
                            return (
                                <rect key={m.day} x={x0} y={0} width={x1 - x0} height={cH}
                                    fill={m.color} />
                            );
                        })}

                        {/* Grid lines */}
                        {[1, 2, 3, 4, 5].map(v => (
                            <g key={v}>
                                <line x1={0} y1={toY(v)} x2={cW} y2={toY(v)}
                                    stroke="#1e2d45" strokeWidth={1} />
                                <text x={-6} y={toY(v) + 4} textAnchor="end" fill="#475569" fontSize={8}>{v}</text>
                            </g>
                        ))}

                        {/* Milestone labels */}
                        {milestones.map(m => (
                            <text key={`ml${m.day}`} x={toX(m.day)} y={-4}
                                textAnchor="middle" fill="#334155" fontSize={7} fontWeight={700}>
                                {m.label}
                            </text>
                        ))}

                        {/* Areas */}
                        {DIMS.filter(d => activeDims.has(d.key)).map(dim => (
                            <path key={`area-${dim.key}`} d={areas[dim.key]}
                                fill={`url(#${gradIds[dim.key]})`} />
                        ))}

                        {/* Lines */}
                        {DIMS.filter(d => activeDims.has(d.key)).map(dim => (
                            <path key={`line-${dim.key}`} d={paths[dim.key]}
                                fill="none" stroke={dim.color} strokeWidth={2}
                                strokeLinecap="round" strokeLinejoin="round" />
                        ))}

                        {/* Tooltip crosshair */}
                        {tooltip && (
                            <line
                                x1={tooltip.x - PAD.l} y1={0}
                                x2={tooltip.x - PAD.l} y2={cH}
                                stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
                        )}

                        {/* Axes */}
                        <line x1={0} y1={cH} x2={cW} y2={cH} stroke="#1e2d45" strokeWidth={1.5} />
                        <line x1={0} y1={0} x2={0} y2={cH} stroke="#1e2d45" strokeWidth={1.5} />

                        {/* X-axis labels */}
                        {[1, 14, 30, 60, 90].map(d => (
                            <text key={d} x={toX(d)} y={cH + 14}
                                textAnchor="middle" fill="#475569" fontSize={8}>
                                Day {d}
                            </text>
                        ))}

                        {/* Hover capture rect */}
                        <rect
                            x={0} y={0} width={cW} height={cH}
                            fill="transparent" style={{ cursor: 'crosshair' }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={() => setTooltip(null)}
                        />
                    </g>
                </svg>

                {/* Floating tooltip */}
                {tooltip && (
                    <div
                        className="absolute pointer-events-none bg-[#0c1929] border border-slate-700/60 rounded-xl p-3 shadow-2xl text-xs z-10 min-w-[180px]"
                        style={{
                            left: Math.min(tooltip.x / (W / 100), 65) + '%',
                            top: '10%',
                            transform: 'translateX(-50%)',
                        }}
                        role="tooltip"
                        aria-live="polite"
                    >
                        <div className="text-slate-400 font-bold mb-2 uppercase tracking-widest text-[10px]">
                            Day {tooltip.day}
                        </div>
                        {DIMS.filter(d => activeDims.has(d.key)).map(dim => {
                            const val = tooltip.values[dim.key];
                            const isHigh = val >= 4;
                            const tipText = dim.invertScale
                                ? (val <= 2 ? dim.tooltipLow : val >= 4 ? dim.tooltipHigh : dim.label)
                                : (isHigh ? dim.tooltipHigh : val <= 2 ? dim.tooltipLow : dim.label);
                            return (
                                <div key={dim.key} className="flex items-center justify-between gap-3 mb-1">
                                    <span className="font-bold" style={{ color: dim.color }}>{dim.label}</span>
                                    <div className="flex items-center gap-1">
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: i <= Math.round(val) ? dim.color : '#1e293b' }} />
                                            ))}
                                        </div>
                                        <span className="text-slate-300 font-mono text-[10px] ml-1">{val.toFixed(1)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer note */}
            <p className="text-slate-600 text-xs mt-3 italic">
                * Showing generated preview data. Live waveform populates automatically as Pulse Check submissions arrive.
            </p>
        </div>
    );
};

export default EmotionalWaveformChart;
