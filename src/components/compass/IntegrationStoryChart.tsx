import React, { useState } from 'react';
import { CompassOutcomePoint } from '../../hooks/useCompassOutcomes';

// Static population trajectory (reference band — PHQ-9 average improvement)
const POP_TRAJECTORY: [number, number][] = [
    [0, 14], [7, 13.5], [14, 12.5], [30, 11], [60, 9], [90, 8], [120, 7], [180, 6],
];

export interface IntegrationStoryChartProps {
    points: CompassOutcomePoint[];
    baselinePhq9: number | null;
    sessionDate: string | null;
    accentColor: string;
}

export const IntegrationStoryChart: React.FC<IntegrationStoryChartProps> = ({
    points,
    baselinePhq9,
    sessionDate,
    accentColor,
}) => {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    const W = 540; const H = 140;
    const pad = { t: 20, r: 20, b: 32, l: 40 };
    const cW = W - pad.l - pad.r;
    const cH = H - pad.t - pad.b;

    const hasData = points.length > 0;

    // Use baseline as day-0 if available
    const allPoints = baselinePhq9 != null
        ? [{ daysPostSession: 0, phq9Score: baselinePhq9, gad7Score: null, phq2Score: null, gad2Score: null }, ...points]
        : points;

    const maxDay = Math.max(
        ...allPoints.map(p => p.daysPostSession),
        ...POP_TRAJECTORY.map(([d]) => d),
        10
    );
    const maxScore = Math.max(
        ...(baselinePhq9 ? [baselinePhq9] : []),
        ...points.map(p => p.phq9Score ?? 0),
        POP_TRAJECTORY[0][1],
        10
    );

    const toX = (day: number) => (day / maxDay) * cW;
    const toY = (score: number) => cH - (score / maxScore) * cH;

    // Population band
    const popPath = POP_TRAJECTORY.map(([d, s], i) =>
        `${i === 0 ? 'M' : 'L'}${toX(d).toFixed(1)},${toY(s).toFixed(1)}`
    ).join(' ');

    // Patient path (PHQ-9 only)
    const ptData = allPoints.filter(p => p.phq9Score !== null);
    const patientPath = ptData.map((p, i) =>
        `${i === 0 ? 'M' : 'L'}${toX(p.daysPostSession).toFixed(1)},${toY(p.phq9Score!).toFixed(1)}`
    ).join(' ');

    const patientAreaPath = ptData.length >= 2
        ? patientPath +
        ` L${toX(ptData[ptData.length - 1].daysPostSession).toFixed(1)},${cH}` +
        ` L${toX(ptData[0].daysPostSession).toFixed(1)},${cH} Z`
        : '';

    if (!hasData && baselinePhq9 === null) {
        return (
            <div style={{
                background: 'rgba(45,212,191,0.04)',
                border: '1px solid rgba(45,212,191,0.12)',
                borderRadius: 12, padding: '18px 20px',
                display: 'flex', alignItems: 'center', gap: 14,
            }}>
                <span style={{ fontSize: 24, opacity: 0.4 }}>📈</span>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.6 }}>
                    Your healing trajectory will appear here once your practitioner records follow-up assessments.
                </p>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative' }}>
            <svg
                viewBox={`0 0 ${W} ${H}`}
                width="100%"
                style={{ overflow: 'visible' }}
                aria-label="Integration story chart — PHQ-9 scores over time"
                role="img"
            >
                <defs>
                    <linearGradient id="story-fill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={accentColor} stopOpacity="0.25" />
                        <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
                    </linearGradient>
                    <filter id="story-glow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                <g transform={`translate(${pad.l},${pad.t})`}>
                    {/* Grid */}
                    {[5, 10, 15].map(v => (
                        v <= maxScore && (
                            <line key={v}
                                x1={0} y1={toY(v)} x2={cW} y2={toY(v)}
                                stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
                        )
                    ))}

                    {/* Population band */}
                    <path
                        d={popPath + ` L${toX(POP_TRAJECTORY[POP_TRAJECTORY.length - 1][0])},${cH} L0,${cH} Z`}
                        fill="rgba(100,116,139,0.06)"
                    />
                    <path d={popPath} fill="none" stroke="rgba(100,116,139,0.35)" strokeWidth={1.5} strokeDasharray="5 4" />
                    <text
                        x={toX(180)} y={toY(POP_TRAJECTORY[POP_TRAJECTORY.length - 1][1]) - 8}
                        textAnchor="end"
                        fill="rgba(100,116,139,0.5)"
                        fontSize={8}
                        fontWeight={600}
                    >
                        Network average
                    </text>

                    {/* Patient area */}
                    {patientAreaPath && (
                        <path d={patientAreaPath} fill="url(#story-fill)" />
                    )}

                    {/* Patient line */}
                    {ptData.length >= 2 && (
                        <path
                            d={patientPath}
                            fill="none"
                            stroke={accentColor}
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            filter="url(#story-glow)"
                        />
                    )}

                    {/* Session marker */}
                    <line x1={toX(0)} y1={0} x2={toX(0)} y2={cH}
                        stroke={accentColor} strokeWidth={2} strokeDasharray="4 3" opacity={0.6} />
                    <text x={toX(0) + 4} y={12} fill={accentColor} fontSize={8} fontWeight={800}>Session</text>

                    {/* Data points */}
                    {ptData.map((p, i) => {
                        const x = toX(p.daysPostSession);
                        const y = toY(p.phq9Score!);
                        const isHovered = hoveredIdx === i;
                        return (
                            <g key={i}
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={() => setHoveredIdx(i)}
                                onMouseLeave={() => setHoveredIdx(null)}
                            >
                                <circle cx={x} cy={y} r={isHovered ? 6 : 4}
                                    fill={accentColor} stroke="#050c1a" strokeWidth={1.5}
                                    style={{ transition: 'r 0.15s' }} />
                                {isHovered && (
                                    <>
                                        <rect
                                            x={x - 28} y={y - 30}
                                            width={56} height={20}
                                            rx={5}
                                            fill="rgba(5,12,26,0.9)"
                                            stroke={`${accentColor}40`}
                                            strokeWidth={1}
                                        />
                                        <text x={x} y={y - 16}
                                            textAnchor="middle"
                                            fill="#e2e8f0"
                                            fontSize={10}
                                            fontWeight={700}
                                        >
                                            Day {p.daysPostSession}: {p.phq9Score}
                                        </text>
                                    </>
                                )}
                            </g>
                        );
                    })}

                    {/* Axes */}
                    <line x1={0} y1={cH} x2={cW} y2={cH} stroke="rgba(255,255,255,0.10)" strokeWidth={1} />
                    {[5, 10, 15].map(v => (
                        v <= maxScore && (
                            <text key={v} x={-8} y={toY(v) + 4}
                                textAnchor="end" fill="rgba(100,116,139,0.6)" fontSize={8}>{v}</text>
                        )
                    ))}
                    {[0, 30, 60, 90, 120, 180].map(d => (
                        d <= maxDay && (
                            <text key={d} x={toX(d)} y={cH + 14}
                                textAnchor="middle" fill="rgba(100,116,139,0.5)" fontSize={8}>
                                Day {d}
                            </text>
                        )
                    ))}
                </g>
            </svg>

            <p style={{ fontSize: 11, color: '#475569', textAlign: 'center', marginTop: 6 }}>
                The line going down is your healing. The line is you.
            </p>
        </div>
    );
};

export default IntegrationStoryChart;
