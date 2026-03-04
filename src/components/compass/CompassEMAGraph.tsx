import React from 'react';
import { CompassEMAPoint } from '../../hooks/useCompassEMA';

export interface CompassEMAGraphProps {
    points: CompassEMAPoint[];
    sessionDate?: string | null;
    daysPostSession: number;
    accentColor: string;
}

export const CompassEMAGraph: React.FC<CompassEMAGraphProps> = ({
    points,
    sessionDate,
    daysPostSession,
    accentColor,
}) => {
    const W = 540; const H = 130;
    const pad = { t: 18, r: 20, b: 30, l: 36 };
    const cW = W - pad.l - pad.r;
    const cH = H - pad.t - pad.b;

    const hasData = points.length > 0;

    if (!hasData) {
        return (
            <div>
                <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: 'visible' }}>
                    <defs>
                        <linearGradient id="npGradEmpty" x1="0" x2="1" y1="0" y2="0">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.12" />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <g transform={`translate(${pad.l},${pad.t})`}>
                        <rect x={0} y={0} width={cW * 0.75} height={cH} fill="url(#npGradEmpty)" rx={4} />
                        <line x1={0} y1={cH / 2} x2={cW} y2={cH / 2}
                            stroke={accentColor} strokeWidth={2} strokeDasharray="6 4" opacity={0.25} />
                        <text x={cW / 2} y={cH / 2 - 14} textAnchor="middle" fill="#64748b" fontSize={11}>
                            Your journey begins here
                        </text>
                        <line x1={0} y1={cH} x2={cW} y2={cH} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
                        {/* Day-21 label */}
                        <text x={cW * 0.75} y={12} textAnchor="middle" fill="rgba(245,158,11,0.5)" fontSize={8} fontWeight={700}>← Day 21</text>
                    </g>
                </svg>
                <p className="ppn-meta" style={{ textAlign: 'center', marginTop: 4 }}>
                    Log your first check-in below to begin your journey map.
                </p>
            </div>
        );
    }

    const n = points.length;
    const sx = (i: number) => n <= 1 ? cW / 2 : (i / (n - 1)) * cW;
    // Scale: mood 1-10 maps to cH
    const sy = (v: number) => cH - ((v - 1) / 9) * cH;

    const moodPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(i).toFixed(1)},${sy(p.moodLevel).toFixed(1)}`).join(' ');
    const sleepPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(i).toFixed(1)},${sy(p.sleepQuality).toFixed(1)}`).join(' ');
    // Anxiety inverted (lower anxiety = better = higher on chart)
    const anxPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(i).toFixed(1)},${sy(11 - p.anxietyLevel).toFixed(1)}`).join(' ');
    const moodAreaPath = moodPath + ` L${sx(n - 1).toFixed(1)},${cH} L0,${cH} Z`;

    // Neuroplastic window (days 0–21) width
    const maxDay = points[n - 1].dayNumber;
    const npDays = Math.min(21, maxDay);
    const npWidth = maxDay > 0 ? (npDays / maxDay) * cW : cW * 0.75;

    // Session marker (x=0 always since data starts at session)
    const sessionX = 0;

    return (
        <div>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: 'visible' }}>
                <defs>
                    <linearGradient id="npGrad" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="moodFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={accentColor} stopOpacity="0.30" />
                        <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
                    </linearGradient>
                    <filter id="ema-glow">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                <g transform={`translate(${pad.l},${pad.t})`}>
                    {/* Neuroplastic window glow */}
                    <rect x={0} y={0} width={npWidth} height={cH} fill="url(#npGrad)" rx={4} />
                    <text x={npWidth} y={10} textAnchor="end" fill="rgba(245,158,11,0.55)" fontSize={8} fontWeight={700}>← Day 21</text>

                    {/* Grid */}
                    {[3, 5, 7, 9].map(v => (
                        <line key={v} x1={0} y1={sy(v)} x2={cW} y2={sy(v)}
                            stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                    ))}

                    {/* Mood area fill */}
                    <path d={moodAreaPath} fill="url(#moodFill)" />

                    {/* Mood line */}
                    <path d={moodPath} fill="none" stroke={accentColor} strokeWidth={2.5}
                        strokeLinecap="round" filter="url(#ema-glow)" />

                    {/* Sleep line */}
                    <path d={sleepPath} fill="none" stroke="#a78bfa" strokeWidth={1.5}
                        strokeDasharray="5 3" opacity={0.7} strokeLinecap="round" />

                    {/* Anxiety line (inverted) */}
                    <path d={anxPath} fill="none" stroke="#fb7185" strokeWidth={1.5}
                        strokeDasharray="3 5" opacity={0.6} strokeLinecap="round" />

                    {/* Session dosing marker */}
                    <line x1={sessionX} y1={0} x2={sessionX} y2={cH}
                        stroke={accentColor} strokeWidth={2} strokeDasharray="4 3" opacity={0.6} />
                    <text x={sessionX + 4} y={12} fill={accentColor} fontSize={8} fontWeight={800}>Session</text>

                    {/* Data points */}
                    {points.map((p, i) => (
                        <circle key={i} cx={sx(i)} cy={sy(p.moodLevel)} r={3.5}
                            fill={accentColor} stroke="#0a1628" strokeWidth={1.5} />
                    ))}

                    {/* X-axis */}
                    <line x1={0} y1={cH} x2={cW} y2={cH} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

                    {/* X-axis labels */}
                    {points.filter((_, i) => i % Math.max(1, Math.floor(n / 7)) === 0).map((p, i) => {
                        const origIdx = points.indexOf(p);
                        return (
                            <text key={i} x={sx(origIdx)} y={cH + 14}
                                textAnchor="middle" fill="rgba(100,116,139,0.6)" fontSize={8}>{p.dayLabel}</text>
                        );
                    })}
                </g>
            </svg>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8, flexWrap: 'wrap' }}>
                {[
                    { label: 'Mood', color: accentColor, dash: false },
                    { label: 'Sleep', color: '#a78bfa', dash: true },
                    { label: 'Ease', color: '#fb7185', dash: true },
                ].map(({ label, color, dash }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <svg width={18} height={8}>
                            <line x1={0} y1={4} x2={18} y2={4}
                                stroke={color} strokeWidth={dash ? 1.5 : 2.5}
                                strokeDasharray={dash ? '4 3' : undefined}
                            />
                        </svg>
                        <span className="ppn-meta" style={{ fontWeight: 600 }}>{label}</span>
                    </div>
                ))}
            </div>

            {/* Day-aware sentence */}
            <p className="ppn-body" style={{ textAlign: 'center', marginTop: 10 }}>
                You are on{' '}
                <span style={{ color: accentColor, fontWeight: 700 }}>Day {daysPostSession}</span>
                {' '}of your integration window.
            </p>
        </div>
    );
};

export default CompassEMAGraph;
