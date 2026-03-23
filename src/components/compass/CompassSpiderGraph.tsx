import React, { useState, useCallback } from 'react';
import { SubstanceCategory } from '../../hooks/useCompassSession';
import { CompassTimelineEvent } from '../../hooks/useCompassTimeline';

// ─── Axis definitions  ────────────────────────────────────────────────────────
const AXES = ['Sensory Alteration', 'Ego Dissolution', 'Emotional Intensity', 'Physical Sensation', 'Time Distortion', 'Mystical Quality'];

// Experience-mode labels for each axis
const EXPERIENCE_LABELS: Record<number, string> = {
    0: 'Sensory Alteration',
    1: 'Ego Dissolution',
    2: 'Emotional Intensity',
    3: 'Physical Sensation',
    4: 'Time Distortion',
    5: 'Mystical Quality',
};

// Science-mode labels (receptor affinity language)
const SCIENCE_LABELS: Record<number, string> = {
    0: '5-HT2A',
    1: 'D2 / Sigma-1',
    2: 'SERT / NET',
    3: 'κ-Opioid',
    4: 'mGluR5',
    5: 'Sigma-1 / TRP',
};

// Population-average predicted shapes per substance (0–1 scale, 6 axes)
const PREDICTED_SHAPES: Record<SubstanceCategory, number[]> = {
    psilocybin: [0.82, 0.75, 0.70, 0.50, 0.80, 0.85],
    ketamine: [0.65, 0.80, 0.55, 0.40, 0.85, 0.45],
    mdma: [0.50, 0.45, 0.92, 0.70, 0.40, 0.65],
    ayahuasca: [0.88, 0.90, 0.85, 0.78, 0.75, 0.95],
    unknown: [0.60, 0.60, 0.60, 0.60, 0.60, 0.60],
};

// Map timeline event types → axes (0–5)
function mapEventsToAxes(events: CompassTimelineEvent[]): number[] {
    const axisScores = [0, 0, 0, 0, 0, 0];
    const axisCount = [0, 0, 0, 0, 0, 0];

    events.forEach(e => {
        const t = e.eventType.toLowerCase();
        const intensity = e.intensity ? e.intensity / 10 : 0.6;

        if (t.includes('visual') || t.includes('sensory') || t.includes('colour') || t.includes('sound')) {
            axisScores[0] += intensity; axisCount[0]++;
        }
        if (t.includes('ego') || t.includes('dis') || t.includes('self') || t.includes('boundary')) {
            axisScores[1] += intensity; axisCount[1]++;
        }
        if (t.includes('emotion') || t.includes('feeling') || t.includes('joy') || t.includes('grief') || t.includes('love') || t.includes('fear')) {
            axisScores[2] += intensity; axisCount[2]++;
        }
        if (t.includes('body') || t.includes('breath') || t.includes('nausea') || t.includes('physical') || t.includes('purge')) {
            axisScores[3] += intensity; axisCount[3]++;
        }
        if (t.includes('time') || t.includes('slow') || t.includes('eternal') || t.includes('loop')) {
            axisScores[4] += intensity; axisCount[4]++;
        }
        if (t.includes('mystical') || t.includes('sacred') || t.includes('divine') || t.includes('unity') || t.includes('awe') || t.includes('insight')) {
            axisScores[5] += intensity; axisCount[5]++;
        }
        // Companion_tap counts as emotional
        if (t.includes('companion')) {
            axisScores[2] += intensity * 0.5; axisCount[2]++;
        }
        // General feeling → emotional
        if (t === 'feeling') {
            axisScores[2] += intensity; axisCount[2]++;
        }
    });

    return axisScores.map((s, i) =>
        axisCount[i] > 0 ? Math.min(1, s / axisCount[i]) : null as any
    );
}

// ─── Polygon helpers  ─────────────────────────────────────────────────────────
function polarPoint(cx: number, cy: number, r: number, angleRad: number) {
    return { x: cx + r * Math.sin(angleRad), y: cy - r * Math.cos(angleRad) };
}

function shapeToPath(values: number[], cx: number, cy: number, maxR: number): string {
    const n = values.length;
    const pts = values.map((v, i) => {
        const angle = (2 * Math.PI * i) / n;
        const r = (v ?? 0) * maxR;
        return polarPoint(cx, cy, r, angle);
    });
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ') + 'Z';
}

// ─── Props ────────────────────────────────────────────────────────────────────
export interface CompassSpiderGraphProps {
    substanceCategory: SubstanceCategory;
    accentColor: string;
    timelineEvents: CompassTimelineEvent[];
    sessionId?: string;
}

export const CompassSpiderGraph: React.FC<CompassSpiderGraphProps> = ({
    substanceCategory,
    accentColor,
    timelineEvents,
}) => {
    const [mode, setMode] = useState<'experience' | 'science'>('experience');

    const predicted = PREDICTED_SHAPES[substanceCategory];

    // Derive lived values from timeline events
    const livedRaw = mapEventsToAxes(timelineEvents);
    // Fall back to null per axis when no event mapped, blank axes rendered at 0
    const lived: (number | null)[] = livedRaw.map(v => (v === null || v === (null as any) ? null : v));
    const hasLivedData = timelineEvents.length > 0;

    const cx = 160; const cy = 160; const maxR = 100;
    const n = AXES.length;

    const labels = mode === 'science' ? SCIENCE_LABELS : EXPERIENCE_LABELS;
    const predictedPath = shapeToPath(predicted, cx, cy, maxR);
    const livedPath = hasLivedData
        ? shapeToPath(lived.map(v => v ?? 0), cx, cy, maxR)
        : null;

    // Gap fill path (union area between predicted and lived, gold tint)
    const toggleMode = useCallback(() => {
        setMode(m => m === 'experience' ? 'science' : 'experience');
    }, []);

    return (
        <div>
            {/* Top bar: legend (left) + toggle (right) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                {/* Legend — moved above SVG to avoid collision with Sensory Alteration axis label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <svg width={20} height={6} aria-hidden="true">
                            <line x1={0} y1={3} x2={20} y2={3} stroke="rgba(100,116,139,0.7)" strokeWidth={1.5} strokeDasharray="4 3" />
                        </svg>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(100,116,139,0.85)' }}>Predicted</span>
                    </div>
                    {hasLivedData && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg width={20} height={6} aria-hidden="true">
                                <line x1={0} y1={3} x2={20} y2={3} stroke={accentColor} strokeWidth={2} />
                            </svg>
                            <span style={{ fontSize: 12, fontWeight: 600, color: accentColor }}>Your Experience</span>
                        </div>
                    )}
                </div>
                {/* Toggle */}
                <button
                    onClick={toggleMode}
                    aria-label={`Switch to ${mode === 'experience' ? 'science' : 'experience'} mode`}
                    style={{
                        fontSize: 14, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
                        padding: '5px 14px', borderRadius: 9999, cursor: 'pointer',
                        background: 'rgba(45,212,191,0.08)',
                        border: '1px solid rgba(45,212,191,0.30)',
                        color: '#2dd4bf',
                        transition: 'all 0.2s',
                    }}
                >
                    {mode === 'experience' ? '🔬 Science View' : '🌿 Experience View'}
                </button>
            </div>

            <svg
                viewBox={`0 0 320 330`}
                width="100%"
                style={{ overflow: 'visible', maxHeight: 380 }}
                aria-label="Predicted vs. lived experience radar chart"
                role="img"
            >
                <defs>
                    <filter id="spider-glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="spider-glow-soft">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* Grid rings */}
                {[0.25, 0.5, 0.75, 1.0].map(factor => {
                    const r = maxR * factor;
                    const pts = Array.from({ length: n }).map((_, i) => {
                        const angle = (2 * Math.PI * i) / n;
                        return polarPoint(cx, cy, r, angle);
                    });
                    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + 'Z';
                    return (
                        <path
                            key={factor}
                            d={d}
                            fill="none"
                            stroke="rgba(255,255,255,0.07)"
                            strokeWidth={1}
                        />
                    );
                })}

                {/* Axis spokes */}
                {Array.from({ length: n }).map((_, i) => {
                    const angle = (2 * Math.PI * i) / n;
                    const tip = polarPoint(cx, cy, maxR, angle);
                    return (
                        <line
                            key={i}
                            x1={cx} y1={cy}
                            x2={tip.x} y2={tip.y}
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth={1}
                        />
                    );
                })}

                {/* Gold gap fill (if lived data) */}
                {hasLivedData && livedPath && (
                    <path
                        d={predictedPath}
                        fill="rgba(245,158,11,0.10)"
                        stroke="none"
                    />
                )}

                {/* Predicted shape */}
                <path
                    d={predictedPath}
                    fill="rgba(100,116,139,0.12)"
                    stroke="rgba(100,116,139,0.45)"
                    strokeWidth={1.5}
                    strokeDasharray="5 3"
                />

                {/* Lived shape (glow) */}
                {hasLivedData && livedPath && (
                    <path
                        d={livedPath}
                        fill={`${accentColor}20`}
                        stroke={accentColor}
                        strokeWidth={2}
                        filter="url(#spider-glow-soft)"
                    />
                )}

                {/* Gap label — positioned well below the Physical Sensation axis label */}
                {hasLivedData && (
                    <text
                        x={cx} y={cy + maxR + 46}
                        textAnchor="middle"
                        fill="rgba(245,158,11,0.75)"
                        fontSize={13}
                        fontWeight={700}
                        letterSpacing="0.08em"
                    >
                        ✦ Where your journey was uniquely yours
                    </text>
                )}

                {/* Axis labels */}
                {Array.from({ length: n }).map((_, i) => {
                    const angle = (2 * Math.PI * i) / n;
                    const labelR = maxR + 24;
                    const p = polarPoint(cx, cy, labelR, angle);
                    return (
                        <text
                            key={i}
                            x={p.x} y={p.y + 4}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="rgba(226,232,240,0.65)"
                            fontSize={14}
                            fontWeight={600}
                        >
                            {labels[i]}
                        </text>
                    );
                })}

                {/* Legend removed from SVG — now rendered above the chart as a flex row */}
            </svg>

            {/* Empty state copy */}
            {!hasLivedData && (
                <p className="ppn-meta" style={{ textAlign: 'center', marginTop: 8 }}>
                    Your session data will overlay here once your practitioner has logged your session events.
                </p>
            )}

            {/* Substance label */}
            <p className="ppn-meta" style={{ textAlign: 'center', marginTop: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {substanceCategory !== 'unknown' ? `${substanceCategory} · population average shown` : 'Predicted shape shown'}
            </p>
        </div>
    );
};

export default CompassSpiderGraph;
