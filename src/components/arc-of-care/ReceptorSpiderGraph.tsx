/**
 * ReceptorSpiderGraph — Dual-Mode Radar Chart
 *
 * Mode A (patient-facing): axes labeled in plain-English receptor functions
 *   e.g. "Regulates Mood", "Manages Fear", "Rebuilds Connection"
 *
 * Mode B (clinician-facing): axes labeled with clinical metric names
 *   e.g. "PHQ-9 ↓", "GAD-7 ↓", "MEQ-30"
 *
 * Two polygons: patient outcome vs peer network benchmark.
 * Toggle between modes with inline switch.
 */
import React, { useState } from 'react';
import { Gauge, FlaskConical } from 'lucide-react';

// ─── Axis definitions ─────────────────────────────────────────────────────────

interface Axis {
    labelA: string;   // Mode A: receptor / plain-English
    labelB: string;   // Mode B: clinical metric
    subA: string;     // short biological mechanism (shown in Mode A tooltip)
    patient: number;  // 0–100
    network: number;  // 0–100 average
}

const DEFAULT_AXES: Axis[] = [
    {
        labelA: 'Regulates Mood',
        labelB: 'PHQ-9 ↓',
        subA: '5-HT2A serotonin signalling',
        patient: 88,
        network: 72,
    },
    {
        labelA: 'Manages Fear',
        labelB: 'GAD-7 ↓',
        subA: 'AMPA / glutamate receptor activity',
        patient: 80,
        network: 68,
    },
    {
        labelA: 'Rebuilds Connection',
        labelB: 'PCL-5 ↓',
        subA: 'Oxytocin & BDNF release',
        patient: 85,
        network: 71,
    },
    {
        labelA: 'Reduces Rumination',
        labelB: 'Integration Sessions',
        subA: 'Default Mode Network suppression',
        patient: 76,
        network: 63,
    },
    {
        labelA: 'Processes Trauma',
        labelB: 'MEQ-30',
        subA: 'Hippocampal neuroplasticity window',
        patient: 82,
        network: 66,
    },
    {
        labelA: 'Improves Sleep',
        labelB: 'Pulse Check Rate',
        subA: '5-HT1A slow-wave sleep modulation',
        patient: 91,
        network: 74,
    },
];

// ─── Maths ────────────────────────────────────────────────────────────────────

const cx = 130; const cy = 130; const R = 100;
const N = DEFAULT_AXES.length;
const angle = (i: number) => (Math.PI * 2 * i) / N - Math.PI / 2;
const pt = (val: number, i: number) => {
    const a = angle(i); const ratio = val / 100;
    return { x: cx + R * ratio * Math.cos(a), y: cy + R * ratio * Math.sin(a) };
};
const axisEnd = (i: number) => ({
    x: cx + R * Math.cos(angle(i)),
    y: cy + R * Math.sin(angle(i)),
});
const labelPos = (i: number) => {
    const offset = 22;
    return {
        x: cx + (R + offset) * Math.cos(angle(i)),
        y: cy + (R + offset) * Math.sin(angle(i)),
    };
};

// ─── Component ────────────────────────────────────────────────────────────────

interface ReceptorSpiderGraphProps {
    axes?: Axis[];
    /** Initial mode: 'A' = receptor labels, 'B' = clinical labels */
    defaultMode?: 'A' | 'B';
    /** Whether to show the mode toggle */
    showToggle?: boolean;
    /** Compact = smaller card, no sub-labels — for embedding in PDFs */
    compact?: boolean;
}

const ReceptorSpiderGraph: React.FC<ReceptorSpiderGraphProps> = ({
    axes = DEFAULT_AXES,
    defaultMode = 'B',
    showToggle = true,
    compact = false,
}) => {
    const [mode, setMode] = useState<'A' | 'B'>(defaultMode);
    const [hovered, setHovered] = useState<number | null>(null);

    const patientPts = axes.map((a, i) => pt(a.patient, i));
    const networkPts = axes.map((a, i) => pt(a.network, i));

    const polyStr = (pts: { x: number; y: number }[]) =>
        pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

    return (
        <div className={`bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl ${compact ? 'p-4' : 'p-6'}`}>
            {/* Header */}
            {!compact && (
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-slate-100 font-black text-lg">Outcome Profile</h3>
                        <p className="text-slate-400 text-sm mt-0.5">
                            {mode === 'A'
                                ? 'How your biology is changing — compared to the peer network'
                                : 'Clinical metrics vs. peer network benchmark'}
                        </p>
                    </div>

                    {/* Mode toggle */}
                    {showToggle && (
                        <div className="flex items-center gap-1 p-1 bg-slate-800/60 rounded-xl border border-slate-700/50">
                            <button
                                onClick={() => setMode('A')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    mode === 'A'
                                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                        : 'text-slate-500 hover:text-slate-400'
                                }`}
                                aria-pressed={mode === 'A'}
                                title="Patient-friendly receptor labels"
                            >
                                <Gauge className="w-3.5 h-3.5" />
                                Plain English
                            </button>
                            <button
                                onClick={() => setMode('B')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    mode === 'B'
                                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                        : 'text-slate-500 hover:text-slate-400'
                                }`}
                                aria-pressed={mode === 'B'}
                                title="Clinical metric labels"
                            >
                                <FlaskConical className="w-3.5 h-3.5" />
                                Clinical
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className={`flex ${compact ? 'flex-col' : 'flex-col lg:flex-row'} items-center gap-6`}>
                {/* SVG Radar */}
                <svg
                    viewBox="0 0 260 260"
                    width={compact ? 220 : 260}
                    height={compact ? 220 : 260}
                    className="shrink-0"
                    aria-label={`Outcome radar chart, ${mode === 'A' ? 'receptor function' : 'clinical metrics'} mode`}
                    role="img"
                >
                    {/* Background rings */}
                    {[25, 50, 75, 100].map(pct => {
                        const ringPts = axes.map((_, i) => {
                            const a = angle(i); const ratio = pct / 100;
                            return `${(cx + R * ratio * Math.cos(a)).toFixed(1)},${(cy + R * ratio * Math.sin(a)).toFixed(1)}`;
                        });
                        return (
                            <polygon key={pct} points={ringPts.join(' ')}
                                fill="none" stroke="#1e2d45" strokeWidth={1} />
                        );
                    })}

                    {/* Ring labels */}
                    {[25, 50, 75].map(pct => (
                        <text key={pct}
                            x={cx + 4}
                            y={cy - (pct / 100) * R + 4}
                            fill="#334155" fontSize={7} fontWeight={600}>
                            {pct}
                        </text>
                    ))}

                    {/* Axis lines */}
                    {axes.map((_, i) => {
                        const end = axisEnd(i);
                        return (
                            <line key={i} x1={cx} y1={cy}
                                x2={end.x.toFixed(1)} y2={end.y.toFixed(1)}
                                stroke="#1e2d45" strokeWidth={1} />
                        );
                    })}

                    {/* Network polygon */}
                    <polygon points={polyStr(networkPts)}
                        fill="rgba(100,116,139,0.12)"
                        stroke="#475569"
                        strokeWidth={1.5}
                        strokeDasharray="5 3" />

                    {/* Patient polygon */}
                    <polygon points={polyStr(patientPts)}
                        fill="rgba(139,92,246,0.18)"
                        stroke="#8b5cf6"
                        strokeWidth={2} />

                    {/* Patient dots */}
                    {patientPts.map((p, i) => (
                        <circle key={i}
                            cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={5}
                            fill={hovered === i ? '#a78bfa' : '#8b5cf6'}
                            stroke="#0c1929" strokeWidth={2}
                            style={{ cursor: 'pointer', transition: 'fill 0.15s' }}
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                        />
                    ))}

                    {/* Axis labels */}
                    {axes.map((a, i) => {
                        const lp = labelPos(i);
                        const label = mode === 'A' ? a.labelA : a.labelB;
                        const isHovered = hovered === i;
                        const words = label.split(' ');
                        return (
                            <text key={i}
                                x={lp.x.toFixed(1)} y={lp.y.toFixed(1)}
                                textAnchor="middle" dominantBaseline="middle"
                                fill={isHovered ? '#c4b5fd' : '#94a3b8'}
                                fontSize={compact ? 7 : 8}
                                fontWeight={isHovered ? 800 : 700}
                                style={{ transition: 'fill 0.15s, font-weight 0.15s' }}>
                                {words.length > 2 ? (
                                    <>
                                        <tspan x={lp.x.toFixed(1)} dy={-6}>{words.slice(0, 2).join(' ')}</tspan>
                                        <tspan x={lp.x.toFixed(1)} dy={11}>{words.slice(2).join(' ')}</tspan>
                                    </>
                                ) : (
                                    label
                                )}
                            </text>
                        );
                    })}
                </svg>

                {/* Legend + axis detail */}
                <div className="flex-1 space-y-4 w-full">
                    {/* Legend */}
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-3 rounded-full bg-violet-500/30 border border-violet-500 border-dashed" />
                            <span className="text-slate-400 font-bold">You</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-3 rounded-full bg-slate-500/20 border border-slate-500 border-dashed" style={{ borderStyle: 'dashed' }} />
                            <span className="text-slate-500 font-bold">Peer average</span>
                        </div>
                    </div>

                    {/* Per-axis breakdown */}
                    <div className="space-y-2">
                        {axes.map((a, i) => {
                            const label = mode === 'A' ? a.labelA : a.labelB;
                            const delta = a.patient - a.network;
                            const isActive = hovered === i;
                            return (
                                <div
                                    key={i}
                                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                                        isActive ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-slate-800/30 border border-transparent'
                                    }`}
                                    onMouseEnter={() => setHovered(i)}
                                    onMouseLeave={() => setHovered(null)}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-xs font-bold truncate ${isActive ? 'text-violet-300' : 'text-slate-300'}`}>
                                                {label}
                                            </span>
                                            <div className="flex items-center gap-2 ml-2 shrink-0">
                                                <span className={`text-xs font-black ${delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {delta >= 0 ? '+' : ''}{delta}
                                                </span>
                                                <span className="text-xs text-violet-300 font-black">{a.patient}</span>
                                                <span className="text-xs text-slate-600">/ {a.network}</span>
                                            </div>
                                        </div>
                                        {/* Progress bar */}
                                        <div className="relative h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                                            <div className="absolute h-full bg-slate-600/50 rounded-full"
                                                style={{ width: `${a.network}%` }} />
                                            <div className="absolute h-full bg-violet-500 rounded-full transition-all duration-500"
                                                style={{ width: `${a.patient}%` }} />
                                        </div>
                                        {/* Mode A sub-label */}
                                        {mode === 'A' && isActive && (
                                            <p className="text-[10px] text-violet-400/70 mt-1 italic">{a.subA}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Footer note */}
            {!compact && (
                <p className="text-slate-600 text-xs mt-4 italic">
                    Percentile scores are relative to the anonymised peer network. Higher = stronger outcome in that dimension.
                </p>
            )}
        </div>
    );
};

export default ReceptorSpiderGraph;
