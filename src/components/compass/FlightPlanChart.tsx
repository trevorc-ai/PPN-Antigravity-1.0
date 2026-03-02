import React, { useState } from 'react';
import { SubstanceCategory } from '../../hooks/useCompassSession';
import { CompassTimelineEvent } from '../../hooks/useCompassTimeline';

// ─── Substance PK profiles ────────────────────────────────────────────────────
// Each curve: array of [minutesFromAdmin, intensity 0-10]
const PK_CURVES: Record<SubstanceCategory, [number, number][]> = {
    psilocybin: [
        [0, 0], [20, 1.5], [45, 4.0], [75, 7.0], [105, 9.2], [135, 9.8],
        [165, 9.5], [210, 8.5], [270, 7.0], [330, 5.0], [390, 3.0], [450, 1.5], [480, 0.5],
    ],
    ketamine: [
        [0, 0], [5, 4.5], [10, 8.5], [20, 9.8], [30, 9.5], [45, 8.0],
        [60, 6.0], [90, 4.0], [120, 2.5], [150, 1.0], [180, 0.2],
    ],
    mdma: [
        [0, 0], [30, 2.0], [60, 5.5], [90, 8.5], [120, 9.8], [150, 9.5],
        [180, 9.0], [240, 8.0], [300, 6.0], [360, 4.0], [420, 2.0], [480, 0.5],
    ],
    ayahuasca: [
        [0, 0], [20, 1.5], [40, 4.5], [60, 7.5], [80, 9.0], [100, 9.5],
        [130, 8.5], [160, 8.0], [200, 7.0], [260, 5.0], [320, 3.5], [380, 2.0], [450, 0.5],
    ],
    unknown: [
        [0, 0], [30, 2], [90, 7], [150, 9.5], [210, 9], [270, 7], [330, 4], [390, 1.5], [420, 0],
    ],
};

// Phase bands (minute ranges and human labels)
const PHASE_BANDS: Record<SubstanceCategory, { onset: [number, number]; peak: [number, number]; integration: [number, number]; afterglow: [number, number] }> = {
    psilocybin: { onset: [0, 75], peak: [75, 210], integration: [210, 360], afterglow: [360, 480] },
    ketamine: { onset: [0, 15], peak: [15, 60], integration: [60, 120], afterglow: [120, 180] },
    mdma: { onset: [0, 90], peak: [90, 270], integration: [270, 420], afterglow: [420, 480] },
    ayahuasca: { onset: [0, 60], peak: [60, 160], integration: [160, 320], afterglow: [320, 450] },
    unknown: { onset: [0, 60], peak: [60, 210], integration: [210, 360], afterglow: [360, 420] },
};

const PHASE_COLORS: Record<string, string> = {
    onset: 'rgba(167,139,250,0.07)',
    peak: 'rgba(45,212,191,0.08)',
    integration: 'rgba(245,158,11,0.07)',
    afterglow: 'rgba(251,113,133,0.06)',
};

const PHASE_LABELS: Record<string, string> = {
    onset: 'ONSET',
    peak: 'PEAK',
    integration: 'INTEGRATION',
    afterglow: 'AFTERGLOW',
};

const PHASE_TIPS: Record<string, string> = {
    onset: 'Physical sensations are common here — not a sign of danger.',
    peak: 'The deepest part of your journey. Surrender, don\'t steer.',
    integration: 'The experience begins to integrate. New perspectives emerge.',
    afterglow: 'A time of clarity, gratitude, and gentle re-entry.',
};

// Color for event type dots
function eventColor(type: string, accentColor: string): string {
    const t = type.toLowerCase();
    if (t.includes('emotion') || t.includes('feeling') || t.includes('companion')) return '#fb7185';
    if (t.includes('insight') || t.includes('mystical') || t.includes('sacred')) return '#f59e0b';
    if (t.includes('difficult') || t.includes('fear') || t.includes('hard')) return '#a78bfa';
    if (t.includes('peak') || t.includes('joy')) return accentColor;
    return accentColor;
}

export interface FlightPlanChartProps {
    substanceCategory: SubstanceCategory;
    accentColor: string;
    timelineEvents: CompassTimelineEvent[];
    sessionStartTime: string | null;
}

export const FlightPlanChart: React.FC<FlightPlanChartProps> = ({
    substanceCategory,
    accentColor,
    timelineEvents,
    sessionStartTime,
}) => {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string; phase?: string } | null>(null);
    const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);

    const W = 560; const H = 180;
    const pad = { t: 24, r: 20, b: 40, l: 36 };
    const cW = W - pad.l - pad.r;
    const cH = H - pad.t - pad.b;

    const curve = PK_CURVES[substanceCategory];
    const totalMinutes = curve[curve.length - 1][0];
    const phases = PHASE_BANDS[substanceCategory];

    const toX = (min: number) => (min / totalMinutes) * cW;
    const toY = (intensity: number) => cH - (intensity / 10) * cH;

    // Build SVG path for the PK curve
    const curvePts = curve.map(([m, i]) => ({ x: toX(m), y: toY(i) }));
    const linePath = curvePts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const areaPath = linePath + ` L${toX(totalMinutes).toFixed(1)},${cH} L0,${cH} Z`;

    // Patient event dots
    const startMs = sessionStartTime ? new Date(sessionStartTime).getTime() : null;
    const patientDots = startMs
        ? timelineEvents.map(e => ({
            event: e,
            x: toX(Math.min(e.minutesFromStart, totalMinutes)),
            y: (() => {
                const min = e.minutesFromStart;
                // Interpolate PK curve to get Y
                for (let i = 0; i < curve.length - 1; i++) {
                    if (min >= curve[i][0] && min <= curve[i + 1][0]) {
                        const t = (min - curve[i][0]) / (curve[i + 1][0] - curve[i][0]);
                        const intensity = curve[i][1] + t * (curve[i + 1][1] - curve[i][1]);
                        return toY(intensity);
                    }
                }
                return cH / 2;
            })(),
        }))
        : [];

    // "You are here" marker at the largest gap between events
    let youAreHereX: number | null = null;
    if (patientDots.length >= 2) {
        let maxGap = 0;
        let gapCenter = 0;
        for (let i = 0; i < patientDots.length - 1; i++) {
            const gap = patientDots[i + 1].x - patientDots[i].x;
            if (gap > maxGap) { maxGap = gap; gapCenter = (patientDots[i].x + patientDots[i + 1].x) / 2; }
        }
        youAreHereX = gapCenter;
    }

    const phaseEntries = Object.entries(phases) as [string, [number, number]][];

    return (
        <div style={{ position: 'relative' }}>
            <svg
                viewBox={`0 0 ${W} ${H}`}
                width="100%"
                style={{ overflow: 'visible' }}
                aria-label="Pharmacokinetic flight plan chart"
                role="img"
                onMouseLeave={() => setTooltip(null)}
            >
                <defs>
                    <linearGradient id="fp-fill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={accentColor} stopOpacity="0.35" />
                        <stop offset="100%" stopColor={accentColor} stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="dot-glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="curve-glow">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                <g transform={`translate(${pad.l},${pad.t})`}>
                    {/* Phase background bands */}
                    {phaseEntries.map(([phase, [start, end]]) => (
                        <rect
                            key={phase}
                            x={toX(start)} y={0}
                            width={toX(end) - toX(start)} height={cH}
                            fill={PHASE_COLORS[phase]}
                            rx={0}
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={(e) => {
                                setTooltip({ x: toX((start + end) / 2), y: -16, text: PHASE_TIPS[phase], phase });
                            }}
                        />
                    ))}

                    {/* Phase labels */}
                    {phaseEntries.map(([phase, [start, end]]) => (
                        <text
                            key={`lbl-${phase}`}
                            x={(toX(start) + toX(end)) / 2} y={8}
                            textAnchor="middle"
                            fill="rgba(226,232,240,0.30)"
                            fontSize={8}
                            fontWeight={800}
                            letterSpacing="0.12em"
                        >
                            {PHASE_LABELS[phase]}
                        </text>
                    ))}

                    {/* Area fill */}
                    <path d={areaPath} fill="url(#fp-fill)" />

                    {/* Curve line */}
                    <path
                        d={linePath}
                        fill="none"
                        stroke={accentColor}
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#curve-glow)"
                    />

                    {/* Y-axis grid lines */}
                    {[2, 5, 8].map(v => (
                        <line
                            key={v}
                            x1={-6} y1={toY(v)} x2={cW} y2={toY(v)}
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth={1}
                        />
                    ))}

                    {/* Y-axis labels */}
                    {[2, 5, 8].map(v => (
                        <text
                            key={`y-${v}`}
                            x={-10} y={toY(v) + 4}
                            textAnchor="end"
                            fill="rgba(100,116,139,0.7)"
                            fontSize={8}
                        >{v}</text>
                    ))}

                    {/* X-axis */}
                    <line x1={0} y1={cH} x2={cW} y2={cH} stroke="rgba(255,255,255,0.10)" strokeWidth={1} />

                    {/* Patient event dots */}
                    {patientDots.map((d, i) => (
                        <g key={i}
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={() => { setHoveredEvent(i); setTooltip({ x: d.x, y: d.y - 14, text: d.event.label }); }}
                            onMouseLeave={() => { setHoveredEvent(null); setTooltip(null); }}>
                            <circle cx={d.x} cy={d.y} r={hoveredEvent === i ? 8 : 5.5}
                                fill={eventColor(d.event.eventType, accentColor)}
                                stroke="#0a1628" strokeWidth={1.5}
                                filter="url(#dot-glow)"
                                style={{ transition: 'r 0.15s' }}
                            />
                        </g>
                    ))}

                    {/* "You are here" animated marker */}
                    {youAreHereX !== null && (
                        <g>
                            <line
                                x1={youAreHereX} y1={0}
                                x2={youAreHereX} y2={cH}
                                stroke="rgba(245,158,11,0.5)"
                                strokeWidth={1.5}
                                strokeDasharray="4 3"
                            />
                            <text
                                x={youAreHereX + 4} y={12}
                                fill="rgba(245,158,11,0.75)"
                                fontSize={8}
                                fontWeight={800}
                                letterSpacing="0.08em"
                            >
                                ← You
                            </text>
                        </g>
                    )}

                    {/* X-axis time labels */}
                    {curve.filter((_, i) => i % Math.ceil(curve.length / 5) === 0).map(([m], _i) => (
                        <text
                            key={m}
                            x={toX(m)} y={cH + 14}
                            textAnchor="middle"
                            fill="rgba(100,116,139,0.6)"
                            fontSize={8}
                        >
                            {m < 60 ? `${m}m` : `${Math.round(m / 60)}h`}
                        </text>
                    ))}
                </g>

                {/* Tooltip */}
                {tooltip && (
                    <foreignObject
                        x={pad.l + tooltip.x - 60}
                        y={pad.t + tooltip.y - 28}
                        width={130}
                        height={40}
                        style={{ pointerEvents: 'none', overflow: 'visible' }}
                    >
                        <div style={{
                            background: 'rgba(10,22,40,0.92)',
                            border: '1px solid rgba(45,212,191,0.25)',
                            borderRadius: 8,
                            padding: '5px 10px',
                            fontSize: 12,
                            color: '#A8B5D1',
                            lineHeight: 1.4,
                            whiteSpace: 'normal',
                        }}>
                            {tooltip.phase && (
                                <div style={{ fontWeight: 800, color: '#2dd4bf', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>
                                    {tooltip.phase}
                                </div>
                            )}
                            {tooltip.text}
                        </div>
                    </foreignObject>
                )}
            </svg>

            {/* Disclaimer */}
            <p className="ppn-meta" style={{ textAlign: 'center', marginTop: 8 }}>
                Curve represents population averages for this substance class. Individual timelines vary with metabolism and dose.
            </p>
        </div>
    );
};

export default FlightPlanChart;
