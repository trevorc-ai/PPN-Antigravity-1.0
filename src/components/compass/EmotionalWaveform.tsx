import React, { useState } from 'react';
import { CompassTimelineEvent } from '../../hooks/useCompassTimeline';

// Event-type → color mapping (consistent with FlightPlanChart)
function getEventColor(type: string): string {
    const t = type.toLowerCase();
    if (t.includes('insight') || t.includes('sacred') || t.includes('mystical') || t.includes('awe')) return '#f59e0b'; // gold
    if (t.includes('difficult') || t.includes('fear') || t.includes('grief') || t.includes('hard')) return '#fb7185'; // rose (difficulty)
    if (t.includes('joy') || t.includes('love') || t.includes('bliss') || t.includes('peace')) return '#2dd4bf';     // teal (joy)
    if (t.includes('companion')) return '#fb7185';
    if (t === 'feeling' || t.includes('emotion')) return '#2dd4bf';
    return '#a78bfa'; // violet default
}

// Ghost peaks for empty state
const GHOST_EVENTS = [
    { minutesFromStart: 30, eventType: 'joy', label: 'Peaceful', intensity: 6 },
    { minutesFromStart: 80, eventType: 'insight', label: 'Insight', intensity: 8 },
    { minutesFromStart: 130, eventType: 'difficult', label: 'Challenge', intensity: 5 },
    { minutesFromStart: 175, eventType: 'joy', label: 'Released', intensity: 8.5 },
    { minutesFromStart: 230, eventType: 'mystical', label: 'Wonder', intensity: 9 },
    { minutesFromStart: 290, eventType: 'joy', label: 'Gratitude', intensity: 7 },
    { minutesFromStart: 340, eventType: 'insight', label: 'Connected', intensity: 6 },
];

export interface EmotionalWaveformProps {
    timelineEvents: CompassTimelineEvent[];
    sessionDurationMinutes: number;
    printMode?: boolean;
}

export const EmotionalWaveform: React.FC<EmotionalWaveformProps> = ({
    timelineEvents,
    sessionDurationMinutes,
    printMode = false,
}) => {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; type: string } | null>(null);

    // Filter to events with intensity, or estimate
    const data = timelineEvents.length > 0
        ? timelineEvents.map(e => ({
            ...e,
            intensity: e.intensity ?? 6,
        }))
        : [];

    const isGhost = data.length === 0;
    const displayData = isGhost ? GHOST_EVENTS : data;

    const W = 560; const H = 120;
    const pad = { t: 16, r: 20, b: 28, l: 36 };
    const cW = W - pad.l - pad.r;
    const cH = H - pad.t - pad.b;

    const totalMin = sessionDurationMinutes > 0 ? sessionDurationMinutes : (
        displayData.length > 0 ? displayData[displayData.length - 1].minutesFromStart + 30 : 360
    );

    const toX = (m: number) => (m / totalMin) * cW;
    const toY = (intensity: number) => cH - (intensity / 10) * cH;

    // Build waveform peaks — each event is a gaussian curve
    const SVG_PTS = 280;
    const waveY = Array<number>(SVG_PTS).fill(cH); // baseline

    displayData.forEach(e => {
        const center = toX(e.minutesFromStart);
        const amplitude = (e.intensity / 10) * cH;
        const sigma = cW / displayData.length * 0.6;

        for (let px = 0; px < SVG_PTS; px++) {
            const x = (px / (SVG_PTS - 1)) * cW;
            const dist = x - center;
            const gaussian = amplitude * Math.exp(-(dist * dist) / (2 * sigma * sigma));
            waveY[px] = Math.min(waveY[px], cH - gaussian);
        }
    });

    const waveLinePath = waveY.map((y, i) => {
        const x = (i / (SVG_PTS - 1)) * cW;
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const waveAreaPath = waveLinePath + ` L${cW},${cH} L0,${cH} Z`;

    return (
        <div style={{ position: 'relative' }}>
            <svg
                viewBox={`0 0 ${W} ${H}`}
                width="100%"
                style={{ overflow: 'visible', opacity: isGhost ? 0.45 : 1 }}
                aria-label="Emotional waveform from session"
                role="img"
                onMouseLeave={() => setTooltip(null)}
            >
                <defs>
                    <linearGradient id="wave-fill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#2dd4bf" stopOpacity={isGhost ? '0.15' : '0.30'} />
                        <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
                    </linearGradient>
                    <filter id="wave-glow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                <g transform={`translate(${pad.l},${pad.t})`}>
                    {/* Grid lines */}
                    {[3, 6, 9].map(v => (
                        <line
                            key={v}
                            x1={-6} y1={toY(v)} x2={cW} y2={toY(v)}
                            stroke="rgba(255,255,255,0.04)"
                            strokeWidth={1}
                        />
                    ))}

                    {/* Area fill */}
                    <path d={waveAreaPath} fill="url(#wave-fill)" />

                    {/* Wave line */}
                    <path
                        d={waveLinePath}
                        fill="none"
                        stroke={isGhost ? 'rgba(45,212,191,0.35)' : '#2dd4bf'}
                        strokeWidth={2}
                        strokeLinecap="round"
                        filter={isGhost ? undefined : 'url(#wave-glow)'}
                    />

                    {/* Event peak markers */}
                    {!printMode && displayData.map((e, i) => {
                        const x = toX(e.minutesFromStart);
                        const y = toY(e.intensity);
                        const color = getEventColor(e.eventType);
                        return (
                            <g key={i}
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={() => setTooltip({ x, y, label: e.label, type: e.eventType })}
                                onMouseLeave={() => setTooltip(null)}
                            >
                                <circle
                                    cx={x} cy={y} r={4}
                                    fill={isGhost ? 'rgba(100,116,139,0.5)' : color}
                                    stroke="#0a1628" strokeWidth={1.5}
                                    filter="url(#wave-glow)"
                                />
                            </g>
                        );
                    })}

                    {/* Baseline axis */}
                    <line x1={0} y1={cH} x2={cW} y2={cH} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />

                    {/* Y-axis label */}
                    <text
                        x={-10} y={toY(5) + 4}
                        textAnchor="end"
                        fill="rgba(100,116,139,0.5)"
                        fontSize={8}
                    >5</text>

                    {/* X-axis time labels */}
                    {[0, Math.floor(totalMin * 0.25), Math.floor(totalMin * 0.5), Math.floor(totalMin * 0.75), totalMin].map(m => (
                        <text
                            key={m}
                            x={toX(m)} y={cH + 14}
                            textAnchor="middle"
                            fill="rgba(100,116,139,0.5)"
                            fontSize={8}
                        >
                            {m < 60 ? `${m}m` : `${Math.round(m / 60)}h`}
                        </text>
                    ))}
                </g>

                {/* Hover tooltip */}
                {tooltip && (
                    <foreignObject
                        x={pad.l + tooltip.x - 55}
                        y={pad.t + tooltip.y - 32}
                        width={120}
                        height={36}
                        style={{ pointerEvents: 'none', overflow: 'visible' }}
                    >
                        <div style={{
                            background: 'rgba(10,22,40,0.92)',
                            border: `1px solid ${getEventColor(tooltip.type)}40`,
                            borderRadius: 8,
                            padding: '4px 9px',
                            fontSize: 12,
                            color: '#A8B5D1',
                        }}>
                            <span style={{ color: getEventColor(tooltip.type), fontWeight: 800 }}>
                                {tooltip.label}
                            </span>
                        </div>
                    </foreignObject>
                )}
            </svg>

            {/* Empty state message */}
            {isGhost && (
                <p className="ppn-meta" style={{ textAlign: 'center', marginTop: 6 }}>
                    Your emotional terrain will appear here after your session events are logged.<br />
                    <span style={{ color: '#94a3b8' }}>These are example peaks from other journeys.</span>
                </p>
            )}
        </div>
    );
};

export default EmotionalWaveform;
