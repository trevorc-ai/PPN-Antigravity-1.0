/**
 * PatientReport.tsx — Integration Compass
 *
 * Patient-facing, publicly shareable. No auth required.
 * Layout: 5 Zones stacked vertically on a full dark canvas.
 *
 * WO-567: Visual Identity Ground-Up Rebuild
 *   - Branded hero with SVG compass rose + animated star field + PPN pill
 *   - Consistent zone badges (teal ring, dark bg, white numeral) across all 5 zones
 *   - accentColor drives title text ONLY — not the badge
 *   - Custom teal sliders with glow thumb, no browser defaults
 *   - Ghost feeling pills lifted to 75% opacity with hover effect
 *   - Domain color semantics: teal=Physical, violet=Emotional, gold=Spiritual, rose=Safety only
 *   - Share buttons: teal gradient CTA + gold-outline secondary
 *   - PPN crosshair brand mark in footer
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Info } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { AdvancedTooltip } from '../components/ui/AdvancedTooltip';

// ─── Design Tokens ────────────────────────────────────────────────────────────
// WO-523: Replaced teal (#2dd4bf) with PPN brand blue across all brand/identity
// contexts. Semantic domain colors (gold, violet, rose) retained as correct.
const C = {
    bg: '#050c1a',
    card: 'rgba(10,20,42,0.90)',
    border: 'rgba(96,165,250,0.12)',   // blue-400 tint
    blue: '#60a5fa',                   // PPN brand blue-400
    blueDeep: '#1e40af',               // PPN brand blue-800
    indigo: '#818cf8',                 // indigo-400 — slider/form accents
    gold: '#f59e0b',
    violet: '#a78bfa',
    rose: '#fb7185',
    text: '#e2e8f0',
    muted: '#64748b',
} as const;

// ─── Global CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  .compass-root {
    font-family: 'Outfit', sans-serif;
    background: #050c1a;
    min-height: 100vh;
    color: #e2e8f0;
  }

  /* ─── Star field animation ──────────────────────────────────────────────── */
  @keyframes star-drift {
    0%   { transform: translateY(0px) scale(1);    opacity: 0.4; }
    50%  { transform: translateY(-6px) scale(1.2); opacity: 0.9; }
    100% { transform: translateY(0px) scale(1);    opacity: 0.4; }
  }
  .star {
    position: absolute;
    border-radius: 50%;
    background: #e2e8f0;
    animation: star-drift var(--dur, 6s) ease-in-out infinite;
    animation-delay: var(--delay, 0s);
    pointer-events: none;
  }

  /* ─── Compass rose spin ─────────────────────────────────────────────────── */
  @keyframes compass-slow-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .compass-rose-ring {
    animation: compass-slow-spin 60s linear infinite;
    transform-origin: center;
  }

  /* ─── Brand pill ────────────────────────────────────────────────────────── */
  .ppn-brand-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 5px 14px 5px 8px;
    border-radius: 9999px;
    background: rgba(96,165,250,0.08);
    border: 1px solid rgba(96,165,250,0.25);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #60a5fa;
  }
  .ppn-brand-pill-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #60a5fa;
    box-shadow: 0 0 8px rgba(96,165,250,0.8);
  }

  /* ─── Feeling pill hover ────────────────────────────────────────────────── */
  .feeling-pill {
    transition: opacity 0.2s, border-color 0.2s, transform 0.2s;
  }
  .feeling-pill:hover {
    opacity: 1 !important;
    transform: translateY(-1px);
  }

  /* ─── Zone card hover ───────────────────────────────────────────────────── */
  .zone-card {
    transition: box-shadow 0.3s;
  }
  .zone-card:hover {
    box-shadow: 0 0 60px rgba(96,165,250,0.07) !important;
  }

  @media print {
    @page { size: A4; margin: 16mm 14mm; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .no-print { display: none !important; }
    .compass-root { background: #fdf8f0 !important; color: #1e293b !important; }
    .star, .compass-rose-ring { display: none !important; }
  }

  @media (max-width: 480px) {
    .stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }

  /* ─── WO-546: Slider thumb touch targets (48x48px minimum) ──────────────── */
  input[type='range'] { cursor: pointer; }
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 24px; height: 48px;
    min-width: 24px; min-height: 48px;
    border-radius: 6px;
    background: #60a5fa;
    box-shadow: 0 0 10px rgba(96,165,250,0.6);
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.1s;
  }
  input[type='range']::-webkit-slider-thumb:hover {
    transform: scaleX(1.15);
    box-shadow: 0 0 16px rgba(96,165,250,0.8);
  }
  input[type='range']::-moz-range-thumb {
    width: 24px; height: 48px;
    border-radius: 6px;
    background: #60a5fa;
    box-shadow: 0 0 10px rgba(96,165,250,0.6);
    cursor: pointer;
    border: none;
  }
`;

// ─── Ghost Feeling Pills (shown before real data) ────────────────────────────
const GHOST_FEELINGS = [
    'Gratitude', 'Wonder', 'Peace', 'Clarity', 'Awe',
    'Connection', 'Release', 'Openness', 'Tenderness', 'Stillness',
];

// ─── Slider Field ─────────────────────────────────────────────────────────────
const SLIDER_CONFIG: Record<string, { low: string; high: string }> = {
    mood: { low: 'Low', high: 'Elevated' },
    sleep: { low: 'Poor', high: 'Restful' },
    connection: { low: 'Alone', high: 'Connected' },
    anxiety: { low: 'Calm', high: 'Anxious' },
};

const SliderField: React.FC<{
    label: string;
    fieldKey: string;
    value: number;
    onChange: (v: number) => void;
    readOnly?: boolean;
}> = ({ label, fieldKey, value, onChange, readOnly }) => {
    const pct = ((value - 1) / 9) * 100;
    const cfg = SLIDER_CONFIG[fieldKey] ?? { low: '1', high: '10' };
    return (
        <div style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.indigo }}>{value}</span>
            </div>
            {/* WO-523: Use ppn-range class from index.css — matches Phase 1 slideout sliders exactly */}
            <input
                type="range" min={1} max={10} step={1}
                value={value}
                readOnly={readOnly}
                onChange={e => !readOnly && onChange(Number(e.target.value))}
                className="ppn-range"
                style={{
                    width: '100%',
                    background: `linear-gradient(to right, #818cf8 ${pct}%, rgba(100,116,139,0.25) ${pct}%)`,
                } as React.CSSProperties}
                aria-label={label}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{cfg.low}</span>
                <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{cfg.high}</span>
            </div>
        </div>
    );
};

// ─── Color → RGBA helper (avoids TS literal comparison errors) ───────────────
const COLOR_RGBA: Record<string, string> = {
    '#a78bfa': '167,139,250',  // violet
    '#f59e0b': '245,158,11',   // gold
    '#fb7185': '251,113,133',  // rose
    '#60a5fa': '96,165,250',   // blue (default)
};
const toRgba = (hex: string) => COLOR_RGBA[hex] ?? '96,165,250';

// ─── Zone Shell ───────────────────────────────────────────────────────────────
// WO-523: Badge ring uses domain accentColor. Title = Title Case, #A8B5D1, no uppercase.
const Zone: React.FC<{
    number: number;
    title: string;
    accentColor?: string;
    tooltip?: React.ReactNode;  // WO-539: optional explainer
    children: React.ReactNode;
}> = ({ number, title, accentColor = C.blue, tooltip, children }) => (
    <div className="zone-card" style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        padding: '28px 32px',
        marginBottom: 24,
        backdropFilter: 'blur(24px)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(96,165,250,0.04)',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            {/* WO-523: Badge uses domain accentColor ring */}
            <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: `rgba(${toRgba(accentColor)},0.08)`,
                border: `1.5px solid rgba(${toRgba(accentColor)},0.35)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 900, color: '#e2e8f0',
            }}>{number}</div>
            {/* WO-523: Title — Title Case, pale blue site color, no uppercase */}
            <h2 style={{
                margin: 0, fontSize: 15, fontWeight: 800, color: '#A8B5D1',
                lineHeight: 1.2, flex: 1,
            }}>{title}</h2>
            {/* WO-539: Zone explainer tooltip */}
            {tooltip && (
                <AdvancedTooltip content={tooltip} side="left" width="w-72" type="info">
                    <Info size={15} className="text-slate-600 hover:text-blue-400 cursor-help transition-colors print:hidden" />
                </AdvancedTooltip>
            )}
        </div>
        {children}
    </div>
);

// ─── Accordion ───────────────────────────────────────────────────────────────
const Accordion: React.FC<{
    label: string;
    defaultOpen?: boolean;
    accentColor?: string;
    children: React.ReactNode;
}> = ({ label, defaultOpen = false, accentColor = C.blue, children }) => {
    const [open, setOpen] = React.useState(defaultOpen);
    const rgba = toRgba(accentColor);
    return (
        <div style={{ marginBottom: 16 }}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
                style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '10px 14px', borderRadius: 10,
                    background: `rgba(${rgba},0.06)`,
                    border: `1px solid rgba(${rgba},0.18)`,
                    cursor: 'pointer', transition: 'background 0.2s',
                }}
            >
                <span style={{ fontSize: 12, fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span aria-hidden="true" style={{ fontSize: 14, fontWeight: 900, lineHeight: 1, width: 14, textAlign: 'center', flexShrink: 0 }}>{open ? '−' : '+'}</span>
                    {label}
                </span>
                <svg
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s', flexShrink: 0 }}
                >
                    <path d="M2 5l5 5 5-5" stroke={accentColor} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            {open && (
                <div style={{ marginTop: 10 }}>
                    {children}
                </div>
            )}
        </div>
    );
};

// ─── Feeling Wave ─────────────────────────────────────────────────────────────
const FeelingWave: React.FC<{
    events: { label: string; eventType: string; occurredAt: string }[];
}> = ({ events }) => {
    const feelings = events
        ? events.filter(e => e.eventType === 'feeling' || e.eventType === 'companion_tap')
        : [];

    if (!events || feelings.length === 0) return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 14 }}>
                {GHOST_FEELINGS.map((label, i) => (
                    <span key={i} className="feeling-pill" style={{
                        padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                        background: `rgba(${i % 2 === 0 ? '96,165,250' : '167,139,250'},0.10)`,
                        border: `1px solid rgba(${i % 2 === 0 ? '96,165,250' : '167,139,250'},0.30)`,
                        color: i % 2 === 0 ? 'rgba(96,165,250,0.75)' : 'rgba(167,139,250,0.75)',
                        opacity: 0.75, userSelect: 'none',
                    }}>{label}</span>
                ))}
            </div>
            <p style={{ fontSize: 12, color: C.muted, textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
                Your feeling map will appear here after your session. These are example emotional landmarks.
            </p>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {feelings.map((f, i) => (
                <span key={i} className="feeling-pill" style={{
                    padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                    background: `rgba(${i % 2 === 0 ? '96,165,250' : '167,139,250'},0.12)`,
                    border: `1px solid rgba(${i % 2 === 0 ? '96,165,250' : '167,139,250'},0.28)`,
                    color: i % 2 === 0 ? C.blue : C.violet,
                }}>{f.label}</span>
            ))}
        </div>
    );
};

// ─── Dual-Mode Spider Chart ──────────────────────────────────────────────────
const SPIDER_MODES = {
    biological: [
        { axis: '5-HT2A Activity', value: 8.5, tip: 'Serotonin receptors that produce the psychedelic effect. High activity here explains vivid visuals and feelings of connection.' },
        { axis: 'D2 Modulation', value: 5.0, tip: 'A brain receptor that normally filters information. Lower activity during your session is why you noticed things you usually ignore.' },
        { axis: 'BDNF Surge', value: 9.0, tip: 'A brain protein that helps neurons form new connections. It peaks in the days after your session — the biological basis for lasting change.' },
        { axis: 'DMN Quieting', value: 7.5, tip: 'The Default Mode Network runs your inner monologue. When it quiets, the inner critic softens and broader thinking opens up.' },
        { axis: 'Neuroplasticity', value: 8.0, tip: 'How open your brain is to learning and change. Highest in the 2–4 weeks after your session — this is exactly why integration matters.' },
    ],
    experiential: [
        { axis: 'Ego Dissolution', value: 7.0, tip: 'The sense that the edge between "you" and the world softened. Many people describe this as the most meaningful part of their experience.' },
        { axis: 'Sensory Alteration', value: 8.0, tip: 'Changes in how things look, sound, or feel. These are a normal sign the medicine is working — not something to be afraid of.' },
        { axis: 'Emotional Depth', value: 9.0, tip: 'The intensity and range of feelings during the session. Higher depth often brings the most lasting insights.' },
        { axis: 'Time Distortion', value: 6.5, tip: 'The feeling that time slowed, sped up, or disappeared. Completely normal — caused by changes in how the brain processes moments.' },
        { axis: 'Mystical Quality', value: 7.5, tip: 'A sense of awe, unity, or sacred meaning. Research shows sessions with higher mystical quality tend to produce stronger long-term benefits.' },
    ],
} as const;

type SpiderMode = 'biological' | 'experiential';

const DualModeSpiderChart: React.FC<{
    biological?: typeof SPIDER_MODES.biological;
    experiential?: typeof SPIDER_MODES.experiential;
}> = ({ biological = SPIDER_MODES.biological, experiential = SPIDER_MODES.experiential }) => {
    const [mode, setMode] = React.useState<SpiderMode>('experiential');
    const [tip, setTip] = React.useState<{ text: string; px: number; py: number } | null>(null);

    const data: { axis: string; value: number; tip: string }[] =
        (mode === 'biological'
            ? (biological as unknown as { axis: string; value: number; tip: string }[])
            : (experiential as unknown as { axis: string; value: number; tip: string }[]));

    const N = data.length;
    const W = 330; const H = 310;
    const cx = W / 2; const cy = H / 2 + 4;
    const R = 104;

    const angle = (i: number) => -Math.PI / 2 + (i / N) * 2 * Math.PI;
    const toR = (v: number) => (v / 10) * R;

    const axisOuter = data.map((_, i) => ({
        x: cx + R * Math.cos(angle(i)),
        y: cy + R * Math.sin(angle(i)),
    }));
    const polyPoints = data.map((d, i) => ({
        x: cx + toR(d.value) * Math.cos(angle(i)),
        y: cy + toR(d.value) * Math.sin(angle(i)),
    }));
    const polyPath = polyPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';
    const gridPath = (level: number) => {
        const r = level * R;
        return data.map((_, i) => {
            const x = cx + r * Math.cos(angle(i));
            const y = cy + r * Math.sin(angle(i));
            return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ') + ' Z';
    };

    return (
        <div>
            {/* Mode toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, justifyContent: 'center' }}>
                {(['biological', 'experiential'] as const).map(m => (
                    <button
                        key={m}
                        type="button"
                        onClick={() => { setMode(m); setTip(null); }}
                        aria-pressed={mode === m}
                        style={{
                            padding: '6px 16px', borderRadius: 9999, fontSize: 11,
                            fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                            cursor: 'pointer', transition: 'all 0.2s',
                            background: mode === m ? 'rgba(96,165,250,0.15)' : 'transparent',
                            border: mode === m ? '1px solid rgba(96,165,250,0.45)' : '1px solid rgba(100,116,139,0.25)',
                            color: mode === m ? '#60a5fa' : '#64748b',
                        }}
                    >
                        {m === 'biological' ? '🧬 Biological' : '✨ Experiential'}
                    </button>
                ))}
            </div>

            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    width="100%"
                    style={{ maxWidth: 360, overflow: 'visible' }}
                    aria-label={`Experience profile — ${mode} mode`}
                    role="img"
                    onMouseLeave={() => setTip(null)}
                >
                    {/* Grid webs */}
                    {[0.25, 0.5, 0.75, 1.0].map(level => (
                        <path
                            key={level}
                            d={gridPath(level)}
                            fill="none"
                            stroke="rgba(100,116,139,0.15)"
                            strokeWidth={level === 1 ? 0.75 : 0.5}
                        />
                    ))}

                    {/* Axis spokes */}
                    {axisOuter.map((pt, i) => (
                        <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y}
                            stroke="rgba(100,116,139,0.18)" strokeWidth={0.75} />
                    ))}

                    {/* Data polygon — dashed stroke for colorblind safety */}
                    <path
                        d={polyPath}
                        fill="rgba(96,165,250,0.10)"
                        stroke="#60a5fa"
                        strokeWidth={2}
                        strokeDasharray="6 3"
                        strokeLinejoin="round"
                    />

                    {/* Vertex dots with hit area + numeric label */}
                    {polyPoints.map((pt, i) => (
                        <g
                            key={i}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setTip(tip?.text === data[i].tip ? null : { text: data[i].tip, px: pt.x, py: pt.y })}
                        >
                            <circle cx={pt.x} cy={pt.y} r={14} fill="transparent" />
                            <circle cx={pt.x} cy={pt.y} r={5}
                                fill="#60a5fa" stroke="rgba(5,12,26,0.9)" strokeWidth={1.5} />
                            <text x={pt.x} y={pt.y} textAnchor="middle" dominantBaseline="central"
                                fill="rgba(5,12,26,0.85)" fontSize={8} fontWeight={900}
                                style={{ pointerEvents: 'none' }}
                            >{Math.round(data[i].value)}</text>
                        </g>
                    ))}

                    {/* Axis labels */}
                    {axisOuter.map((pt, i) => {
                        const labelR = R + 22;
                        const lx = cx + labelR * Math.cos(angle(i));
                        const ly = cy + labelR * Math.sin(angle(i));
                        const anchor = lx < cx - 8 ? 'end' : lx > cx + 8 ? 'start' : 'middle';
                        return (
                            <text key={i} x={lx} y={ly} textAnchor={anchor}
                                fill="#94a3b8" fontSize={10} fontWeight={600}
                                style={{ pointerEvents: 'none' }}
                            >{data[i].axis}</text>
                        );
                    })}

                    {/* Center icon */}
                    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
                        fill="rgba(96,165,250,0.35)" fontSize={20}>◈</text>

                    {/* Tooltip */}
                    {tip && (
                        <foreignObject
                            x={Math.min(Math.max(tip.px - 95, 0), W - 190)}
                            y={tip.py + 10}
                            width={190} height={1}
                            style={{ overflow: 'visible', pointerEvents: 'none' }}
                        >
                            <div style={{
                                background: 'rgba(10,20,42,0.96)',
                                border: '1px solid rgba(96,165,250,0.28)',
                                borderRadius: 8, padding: '8px 12px',
                                fontSize: 12, color: '#A8B5D1', lineHeight: 1.5,
                            }}>
                                {tip.text}
                            </div>
                        </foreignObject>
                    )}
                </svg>
            </div>

            <p style={{ fontSize: 12, color: '#475569', textAlign: 'center', marginTop: 8, lineHeight: 1.5 }}>
                Tap any point for a plain-language explanation. Values reflect typical patterns for your substance and dose class.
            </p>
        </div>
    );
};

// ─── Patient Flight Plan Chart ─────────────────────────────────────────────────
const PATIENT_PK: Record<string, [number, number][]> = {
    psilocybin: [[0, 0], [20, 1.5], [45, 4], [75, 7], [105, 9.2], [135, 9.8], [165, 9.5], [210, 8.5], [270, 7], [330, 5], [390, 3], [450, 1.5], [480, 0.5]],
    ketamine: [[0, 0], [5, 4.5], [10, 8.5], [20, 9.8], [30, 9.5], [45, 8], [60, 6], [90, 4], [120, 2.5], [150, 1], [180, 0.2]],
    mdma: [[0, 0], [30, 2], [60, 5.5], [90, 8.5], [120, 9.8], [150, 9.5], [180, 9], [240, 8], [300, 6], [360, 4], [420, 2], [480, 0.5]],
    ayahuasca: [[0, 0], [20, 1.5], [40, 4.5], [60, 7.5], [80, 9], [100, 9.5], [130, 8.5], [160, 8], [200, 7], [260, 5], [320, 3.5], [380, 2], [450, 0.5]],
};
const PATIENT_PHASES: Record<string, Record<string, [number, number]>> = {
    psilocybin: { onset: [0, 75], peak: [75, 210], integration: [210, 360], afterglow: [360, 480] },
    ketamine: { onset: [0, 15], peak: [15, 60], integration: [60, 120], afterglow: [120, 180] },
    mdma: { onset: [0, 90], peak: [90, 270], integration: [270, 420], afterglow: [420, 480] },
    ayahuasca: { onset: [0, 60], peak: [60, 160], integration: [160, 320], afterglow: [320, 450] },
};
const PHASE_BG: Record<string, string> = {
    onset: 'rgba(167,139,250,0.07)',
    peak: 'rgba(96,165,250,0.09)',
    integration: 'rgba(245,158,11,0.07)',
    afterglow: 'rgba(251,113,133,0.05)',
};
const PHASE_TIPS_PATIENT: Record<string, string> = {
    onset: 'Physical sensations often begin here — warmth, nausea, or tingling. This is your body adjusting. It usually passes within 20–30 minutes.',
    peak: 'The most intense part of your experience. If it feels overwhelming, focus on your breath. You are safe. It will pass.',
    integration: 'The medicine gradually releases. New perspectives and emotions surface here. This is where much of the deep healing happens.',
    afterglow: 'A quieter, clear-headed return. Many people feel deep peace or gratitude. Rest and avoid stimulation — this window is medicine too.',
};
const SOMATIC_ZONES = [
    { label: 'CHEST', icon: '❤', range: [6, 10] as [number, number], color: 'rgba(251,113,133,0.09)' },
    { label: 'HEAD', icon: '○', range: [3, 6] as [number, number], color: 'rgba(167,139,250,0.07)' },
    { label: 'GUT', icon: '~', range: [0, 3] as [number, number], color: 'rgba(245,158,11,0.07)' },
] as const;

function getPKKey(name?: string): string {
    if (!name) return 'psilocybin';
    const n = name.toLowerCase();
    if (n.includes('psilocyb') || n.includes('mushroom')) return 'psilocybin';
    if (n.includes('ketamine') || n.includes('ket')) return 'ketamine';
    if (n.includes('mdma') || n.includes('ecstasy')) return 'mdma';
    if (n.includes('ayahuasca') || n.includes('dmt')) return 'ayahuasca';
    return 'psilocybin';
}

const PatientFlightPlanChart: React.FC<{ substanceName?: string }> = ({ substanceName }) => {
    const [hoverPhase, setHoverPhase] = React.useState<string | null>(null);

    const key = getPKKey(substanceName);
    const curve = PATIENT_PK[key];
    const phases = PATIENT_PHASES[key];

    // WO-579 Fix 4: chart height increased to 320px (was 200px), meets ≥300px requirement
    const W = 560; const H = 320;
    const pad = { t: 32, r: 20, b: 52, l: 60 };
    const cW = W - pad.l - pad.r;
    const cH = H - pad.t - pad.b;
    const totalMin = curve[curve.length - 1][0];
    const toX = (m: number) => (m / totalMin) * cW;
    const toYv = (v: number) => cH - (v / 10) * cH;

    const linePts = curve.map(([m, v]) => ({ x: toX(m), y: toYv(v) }));
    const linePath = linePts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const areaPath = linePath + ` L${toX(totalMin).toFixed(1)},${cH.toFixed(1)} L0,${cH.toFixed(1)} Z`;

    const phaseEntries = Object.entries(phases) as [string, [number, number]][];

    return (
        <div style={{ position: 'relative' }}>
            <svg
                viewBox={`0 0 ${W} ${H}`}
                width="100%"
                style={{ overflow: 'visible' }}
                aria-label="Pharmacokinetic flight plan — your session timeline"
                role="img"
                onMouseLeave={() => setHoverPhase(null)}
            >
                <defs>
                    <linearGradient id="pfp-fill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.0" />
                    </linearGradient>
                </defs>

                <g transform={`translate(${pad.l},${pad.t})`}>
                    {/* Somatic stripes in left margin */}
                    {SOMATIC_ZONES.map(z => {
                        const yTop = toYv(z.range[1]);
                        const yBot = toYv(z.range[0]);
                        return (
                            <g key={z.label}>
                                <rect x={-pad.l + 2} y={yTop} width={pad.l - 6} height={yBot - yTop}
                                    fill={z.color} rx={2} />
                                {/* WO-579 Fix 4: fontSize boosted from 7 → 14px (was below 14px minimum) */}
                                <text
                                    x={-(pad.l / 2) + 1} y={(yTop + yBot) / 2}
                                    textAnchor="middle" dominantBaseline="central"
                                    fill="rgba(226,232,240,0.40)" fontSize={9} fontWeight={800}
                                    letterSpacing="0.04em"
                                >{z.label}</text>
                            </g>
                        );
                    })}

                    {/* Phase background bands */}
                    {phaseEntries.map(([phase, [start, end]]) => (
                        <rect
                            key={phase}
                            x={toX(start)} y={0}
                            width={toX(end) - toX(start)} height={cH}
                            fill={PHASE_BG[phase]}
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={() => setHoverPhase(phase)}
                        />
                    ))}

                    {/* Phase top labels */}
                    {/* WO-579 Fix 4: phase label fontSize boosted from 8 → 10px (chart context) */}
                    {phaseEntries.map(([phase, [start, end]]) => (
                        <text key={`lbl-${phase}`}
                            x={(toX(start) + toX(end)) / 2} y={10}
                            textAnchor="middle"
                            fill={hoverPhase === phase ? 'rgba(226,232,240,0.65)' : 'rgba(226,232,240,0.30)'}
                            fontSize={10} fontWeight={800} letterSpacing="0.10em"
                            style={{ transition: 'fill 0.2s' }}
                        >{phase.toUpperCase()}</text>
                    ))}

                    {/* Grid lines */}
                    {[2, 5, 8].map(v => (
                        <line key={v} x1={0} y1={toYv(v)} x2={cW} y2={toYv(v)}
                            stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
                    ))}
                    <line x1={0} y1={cH} x2={cW} y2={cH} stroke="rgba(255,255,255,0.10)" strokeWidth={1} />

                    {/* Area + line */}
                    <path d={areaPath} fill="url(#pfp-fill)" />
                    <path d={linePath} fill="none" stroke="#60a5fa" strokeWidth={2.5}
                        strokeLinecap="round" strokeLinejoin="round" />

                    {/* WO-579 Fix 4: Data point dots plotted on the concentration curve */}
                    {linePts.filter((_, i) => i % Math.ceil(linePts.length / 8) === 0 || i === linePts.length - 1).map((pt, i) => (
                        <circle key={i} cx={pt.x} cy={pt.y} r={3.5}
                            fill="#60a5fa" stroke="rgba(5,12,26,0.85)" strokeWidth={1.5} />
                    ))}

                    {/* X-axis label: "Hours post-dose" */}
                    <text
                        x={cW / 2} y={cH + 44}
                        textAnchor="middle" fill="rgba(100,116,139,0.60)"
                        fontSize={14} fontWeight={600}
                    >Hours post-dose</text>

                    {/* X-axis tick labels — boosted from fontSize 8 → 14 (WO-579 Fix 4) */}
                    {curve.filter((_, i) => i % Math.ceil(curve.length / 5) === 0).map(([m]) => (
                        <text key={m} x={toX(m)} y={cH + 18}
                            textAnchor="middle" fill="rgba(100,116,139,0.60)" fontSize={14}
                        >{m < 60 ? `${m}m` : `${Math.round(m / 60)}h`}</text>
                    ))}

                    {/* WO-579 Fix 4: Y-axis label fontSize boosted from 7 → 14px (was below 14px minimum) */}
                    <text
                        x={-42} y={cH / 2}
                        textAnchor="middle" dominantBaseline="central"
                        fill="rgba(100,116,139,0.55)" fontSize={14} fontWeight={700}
                        letterSpacing="0.06em"
                        transform={`rotate(-90, -42, ${cH / 2})`}
                    >Relative Concentration</text>
                </g>

                {/* Phase tooltip */}
                {hoverPhase && (() => {
                    const [start, end] = phases[hoverPhase] as [number, number];
                    const tipX = pad.l + (toX(start) + toX(end)) / 2;
                    return (
                        <foreignObject
                            x={Math.min(Math.max(tipX - 95, 0), W - 190)}
                            y={pad.t - 54}
                            width={190} height={1}
                            style={{ overflow: 'visible', pointerEvents: 'none' }}
                        >
                            <div style={{
                                background: 'rgba(10,20,42,0.96)',
                                border: '1px solid rgba(96,165,250,0.22)',
                                borderRadius: 8, padding: '8px 12px',
                                fontSize: 12, color: '#A8B5D1', lineHeight: 1.5,
                            }}>
                                <div style={{
                                    fontWeight: 800, color: '#60a5fa', fontSize: 10,
                                    letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 4
                                }}>
                                    {hoverPhase}
                                </div>
                                {PHASE_TIPS_PATIENT[hoverPhase]}
                            </div>
                        </foreignObject>
                    );
                })()}
            </svg>

            <p style={{ fontSize: 12, color: '#475569', textAlign: 'center', marginTop: 6, lineHeight: 1.5 }}>
                Hover each phase for a plain-language guide. Curve shows population averages — your experience may vary.
            </p>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const PatientReport: React.FC = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session') ?? undefined;
    // WO-601: also extract magic link params (/journey/auth?token=xxx&id=PT-yyy)
    const magicToken = searchParams.get('token') ?? undefined;
    const patientHash = searchParams.get('id') ?? undefined;
    // Resolve session from patient_hash when no explicit session param (magic link flow)
    const [resolvedSessionId, setResolvedSessionId] = React.useState<string | undefined>(sessionId);
    React.useEffect(() => {
        if (sessionId) { setResolvedSessionId(sessionId); return; }
        if (!patientHash) return;
        // Look up most recent session for this patient hash via patient hash → canonical patient → session
        (async () => {
            try {
                const { data: linkRow } = await supabase
                    .from('log_patient_site_links')
                    .select('canonical_patient_uuid')
                    .eq('patient_hash', patientHash)
                    .maybeSingle();
                if (!linkRow?.canonical_patient_uuid) return;
                const { data: sessionRow } = await supabase
                    .from('log_clinical_records')
                    .select('id')
                    .eq('patient_uuid', linkRow.canonical_patient_uuid)
                    .order('session_date', { ascending: false })
                    .limit(1)
                    .maybeSingle();
                if (sessionRow?.id) setResolvedSessionId(sessionRow.id);
            } catch (_) { /* silent — degrades to empty state */ }
        })();
    }, [sessionId, patientHash]);

    // Check-in slider state
    const [mood, setMood] = useState(6);
    const [sleep, setSleep] = useState(7);
    const [connection, setConnection] = useState(5);
    const [anxiety, setAnxiety] = useState(4);
    const [submitted, setSubmitted] = useState(false);
    // WO-579 Fix 2: finalized is a separate lock — patient must explicitly choose to lock
    const [finalized, setFinalized] = useState(false);
    // WO-579 Fix 1: Zone 2 — selectable emotional terrain chips
    const [selectedFeelings, setSelectedFeelings] = useState<Set<string>>(new Set());
    const toggleFeeling = (label: string) => {
        setSelectedFeelings(prev => {
            const next = new Set(prev);
            next.has(label) ? next.delete(label) : next.add(label);
            return next;
        });
    };

    // Data from Supabase (best-effort; degrades to empty state)
    const [data, setData] = useState<{
        sessionEvents?: { label: string; eventType: string; occurredAt: string }[];
        substanceName?: string;
        sessionDate?: string;
        phq9Change?: number | null;
        integrationSessionsAttended?: number | null;
        integrationSessionsScheduled?: number | null;
        redFlags?: string[];
        safetyNote?: string | null;
    }>({});

    useEffect(() => {
        if (!resolvedSessionId) return;
        (async () => {
            try {
                const { data: row } = await supabase
                    .from('wellness_sessions')
                    .select('session_date, substance_name, session_events, red_flags, safety_note, integration_sessions_attended, integration_sessions_scheduled')
                    .eq('id', resolvedSessionId)
                    .maybeSingle();
                if (row) setData({
                    sessionDate: row.session_date,
                    substanceName: row.substance_name,
                    sessionEvents: row.session_events ?? [],
                    redFlags: row.red_flags ?? [],
                    safetyNote: row.safety_note,
                    integrationSessionsAttended: row.integration_sessions_attended,
                    integrationSessionsScheduled: row.integration_sessions_scheduled,
                });
            } catch (_) { /* silent — UI degrades gracefully */ }
        })();
    }, [resolvedSessionId]);

    const handleSubmit = useCallback(async () => {
        setSubmitted(true);
        if (!resolvedSessionId) return;
        try {
            await supabase.from('patient_checkins').insert({
                session_id: resolvedSessionId,
                mood, sleep, connection, anxiety,
                submitted_at: new Date().toISOString(),
            });
        } catch (_) { /* best effort */ }
    }, [resolvedSessionId, mood, sleep, connection, anxiety]);

    const sharePractitioner = useCallback(() => {
        const url = `${window.location.origin}${window.location.pathname}?session=${resolvedSessionId ?? 'preview'}`;
        if (navigator.share) {
            navigator.share({ title: 'My Integration Compass', url }).catch(() => { });
        } else {
            navigator.clipboard.writeText(url).catch(() => { });
            alert('Link copied!');
        }
    }, [resolvedSessionId]);

    const shareFriend = useCallback(() => {
        const url = `${window.location.origin}${window.location.pathname}?session=${resolvedSessionId ?? 'preview'}`;
        if (navigator.share) {
            navigator.share({ title: 'My Integration Compass', url }).catch(() => {
                navigator.clipboard.writeText(url).catch(() => { });
            });
        } else {
            navigator.clipboard.writeText(url).catch(() => { });
            alert('Link copied!');
        }
    }, [resolvedSessionId]);

    const zones = {
        z1: true,
        z2: true,
        z3: true,
        z4: !!(data.redFlags?.length || data.safetyNote),
        z5: true,
    };

    return (
        <div className="compass-root" style={{ background: C.bg, minHeight: '100vh' }}>
            <style>{GLOBAL_CSS}</style>

            {/* ── Hero ─────────────────────────────────────────────────────────── */}
            <div style={{
                background: 'linear-gradient(160deg, #040d1e 0%, #071528 40%, #0a1a30 70%, #060e1c 100%)',
                padding: '56px 24px 48px',
                textAlign: 'center',
                borderBottom: `1px solid rgba(96,165,250,0.10)`,
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Animated stars */}
                {([
                    { top: '12%', left: '8%', size: 2, dur: '7s', delay: '0s' },
                    { top: '28%', left: '18%', size: 1.5, dur: '9s', delay: '1.2s' },
                    { top: '55%', left: '5%', size: 1, dur: '11s', delay: '0.5s' },
                    { top: '75%', left: '14%', size: 2.5, dur: '8s', delay: '3s' },
                    { top: '10%', left: '88%', size: 2, dur: '6s', delay: '2s' },
                    { top: '38%', left: '92%', size: 1.5, dur: '10s', delay: '0.8s' },
                    { top: '65%', left: '85%', size: 1, dur: '7.5s', delay: '4s' },
                    { top: '85%', left: '90%', size: 2, dur: '9s', delay: '1.5s' },
                    { top: '20%', left: '45%', size: 1, dur: '13s', delay: '6s' },
                    { top: '80%', left: '52%', size: 1.5, dur: '8.5s', delay: '2.5s' },
                ] as const).map((s, i) => (
                    <div key={i} className="star" style={{
                        top: s.top, left: s.left,
                        width: s.size, height: s.size,
                        ['--dur' as string]: s.dur,
                        ['--delay' as string]: s.delay,
                    }} />
                ))}

                {/* Ambient radial glow */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 380, height: 380, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', top: -80, right: '10%', width: 260, height: 260,
                    borderRadius: '50%', background: 'rgba(245,158,11,0.04)',
                    filter: 'blur(70px)', pointerEvents: 'none',
                }} />

                {/* SVG Compass Rose — WO-523: blue stroke */}
                <div className="no-print" style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 320, height: 320, opacity: 0.06, pointerEvents: 'none',
                }}>
                    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
                        className="compass-rose-ring" style={{ width: '100%', height: '100%' }}>
                        <circle cx="100" cy="100" r="96" stroke={C.blue} strokeWidth="0.75" strokeDasharray="4 8" />
                        <circle cx="100" cy="100" r="80" stroke={C.blue} strokeWidth="0.5" />
                        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
                            const rad = (deg * Math.PI) / 180;
                            const x1 = 100 + 82 * Math.sin(rad); const y1 = 100 - 82 * Math.cos(rad);
                            const x2 = 100 + 96 * Math.sin(rad); const y2 = 100 - 96 * Math.cos(rad);
                            return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.blue} strokeWidth="0.75" />;
                        })}
                        {[0, 90, 180, 270].map(deg => {
                            const rad = (deg * Math.PI) / 180;
                            const tipX = 100 + 74 * Math.sin(rad); const tipY = 100 - 74 * Math.cos(rad);
                            const lX = 100 + 8 * Math.sin(rad + Math.PI / 2); const lY = 100 - 8 * Math.cos(rad + Math.PI / 2);
                            const rX = 100 + 8 * Math.sin(rad - Math.PI / 2); const rY = 100 - 8 * Math.cos(rad - Math.PI / 2);
                            return <polygon key={deg} points={`${tipX},${tipY} ${lX},${lY} ${rX},${rY}`} fill={C.blue} opacity="0.9" />;
                        })}
                        <circle cx="100" cy="100" r="5" fill={C.blue} />
                    </svg>
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Brand pill — WO-523: blue accent */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                        <div className="ppn-brand-pill" style={{ color: C.blue, background: 'rgba(96,165,250,0.08)', borderColor: 'rgba(96,165,250,0.25)' }}>
                            <div className="ppn-brand-pill-dot" style={{ background: C.blue, boxShadow: '0 0 8px rgba(96,165,250,0.8)' }} />
                            PPN · Integration Compass
                        </div>
                    </div>

                    {/* WO-522: "Journey" gets PPN brand blue gradient; "Your" stays solid slate-200 */}
                    <h1 style={{
                        fontSize: 44, fontWeight: 900, margin: '0 0 10px', lineHeight: 1.05,
                        letterSpacing: '-0.01em',
                    }}>
                        <span style={{ color: '#e2e8f0' }}>Your </span>
                        <span className="text-gradient-primary">Journey</span>
                    </h1>

                    <p style={{ color: C.muted, fontSize: 14, margin: '0 0 20px', letterSpacing: '0.01em' }}>
                        A living record of your healing, updated by you.
                    </p>

                    {/* Phase / status strip */}
                    <div style={{
                        display: 'inline-flex', gap: 20, alignItems: 'center',
                        padding: '8px 20px', borderRadius: 9999,
                        background: 'rgba(96,165,250,0.05)',
                        border: '1px solid rgba(96,165,250,0.15)',
                    }}>
                        <span style={{ fontSize: 12, color: '#475569', fontWeight: 600, letterSpacing: '0.06em' }}>
                            PHASE 3 · INTEGRATION
                        </span>
                        <div style={{ width: 1, height: 12, background: 'rgba(96,165,250,0.2)' }} />
                        <span style={{ fontSize: 12, color: C.blue, fontWeight: 700, letterSpacing: '0.06em' }}>
                            HEALING IN PROGRESS
                        </span>
                    </div>

                    {/* Session metadata */}
                    {(data.sessionDate || data.substanceName) && (
                        <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', gap: 16 }}>
                            {data.sessionDate && (
                                <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>
                                    Session: {new Date(data.sessionDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            )}
                            {data.substanceName && (
                                <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>
                                    · {data.substanceName}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Content wrapper ───────────────────────────────────────────────── */}
            <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px 48px' }}>

                {/* ── ZONE 1: The Start of the Path ────────────────────────────── */}
                {zones.z1 && (
                    <Zone number={1} title="The Start of the Path" accentColor={C.violet}
                        tooltip="This zone shows where your healing journey began. It includes your pre-session emotional baseline and any clinician-set reference points used to measure your progress over time."
                    >
                        {/* PHQ-9 change stat — always visible */}
                        {data.phq9Change != null && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 16,
                                background: `${C.blue}08`, border: `1px solid ${C.blue}20`,
                                borderRadius: 14, padding: '16px 20px', marginBottom: 16,
                            }}>
                                <div style={{ textAlign: 'center', minWidth: 52 }}>
                                    <div style={{ fontSize: 28, fontWeight: 900, color: C.blue }}>
                                        {data.phq9Change > 0 ? `+${data.phq9Change}` : data.phq9Change}
                                    </div>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: '0.08em' }}>PHQ-9</div>
                                </div>
                                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                                    {data.phq9Change < 0
                                        ? `Your depression score improved by ${Math.abs(data.phq9Change)} points since baseline. That is real, measurable change.`
                                        : data.phq9Change === 0
                                            ? 'Your score is holding steady. Integration is non-linear; stability is progress.'
                                            : 'Scores can fluctuate. This moment is data, not your identity. Keep going.'}
                                </p>
                            </div>
                        )}

                        {/* Reflection text — collapsible */}
                        <Accordion label="About Your Baseline" accentColor={C.violet}>
                            <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 16, lineHeight: 1.75 }}>
                                Every journey begins with a baseline. Before your session, you were here.
                                This is your starting point - not a judgment, but a map coordinate.
                            </p>
                            <div style={{
                                background: `${C.violet}08`, border: `1px solid ${C.violet}20`,
                                borderRadius: 12, padding: '14px 18px',
                            }}>
                                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                                    "The wound is the place where the light enters you." - Rumi
                                </p>
                            </div>
                        </Accordion>
                    </Zone>
                )}

                {/* ── ZONE 2: The Emotional Terrain ────────────────────────────── */}
                {/* WO-579 Fix 1: chips are now interactive — tap to select/deselect */}
                {zones.z2 && (
                    <Zone number={2} title="The Emotional Terrain" accentColor={C.violet}
                        tooltip="A map of the feelings that arose during your session. These are not symptoms to manage — they are waypoints on your journey. Tap any chip to highlight it as especially resonant."
                    >
                        {/* Selectable feeling pills */}
                        <div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 14 }}>
                                {(data.sessionEvents && data.sessionEvents.filter(e => e.eventType === 'feeling' || e.eventType === 'companion_tap').length > 0
                                    ? data.sessionEvents.filter(e => e.eventType === 'feeling' || e.eventType === 'companion_tap').map(e => e.label)
                                    : GHOST_FEELINGS
                                ).map((label, i) => {
                                    const isSelected = selectedFeelings.has(label);
                                    return (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => toggleFeeling(label)}
                                            aria-pressed={isSelected}
                                            className="feeling-pill"
                                            style={{
                                                padding: '7px 16px', borderRadius: 20,
                                                fontSize: 14, fontWeight: 600,
                                                cursor: 'pointer',
                                                background: isSelected
                                                    ? `rgba(${i % 2 === 0 ? '96,165,250' : '167,139,250'},0.22)`
                                                    : `rgba(${i % 2 === 0 ? '96,165,250' : '167,139,250'},0.08)`,
                                                border: isSelected
                                                    ? `1.5px solid rgba(${i % 2 === 0 ? '96,165,250' : '167,139,250'},0.65)`
                                                    : `1px solid rgba(${i % 2 === 0 ? '96,165,250' : '167,139,250'},0.28)`,
                                                color: isSelected
                                                    ? (i % 2 === 0 ? C.blue : C.violet)
                                                    : `rgba(${i % 2 === 0 ? '96,165,250' : '167,139,250'},0.60)`,
                                                transform: isSelected ? 'translateY(-1px)' : undefined,
                                                boxShadow: isSelected
                                                    ? `0 0 12px rgba(${i % 2 === 0 ? '96,165,250' : '167,139,250'},0.25)`
                                                    : 'none',
                                                transition: 'all 0.18s',
                                            }}
                                        >{label}</button>
                                    );
                                })}
                            </div>
                            {selectedFeelings.size === 0 && (
                                <p style={{ fontSize: 13, color: C.muted, textAlign: 'center', margin: 0 }}>
                                    Tap any feeling to mark it as especially resonant.
                                </p>
                            )}
                        </div>

                        {/* Context text — collapsible */}
                        <Accordion label="What These Feelings Mean" accentColor={C.violet}>
                            <div style={{
                                background: `${C.blue}08`, border: `1px solid ${C.blue}20`,
                                borderRadius: 12, padding: '14px 18px',
                            }}>
                                <p style={{ fontSize: 14, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                                    These feelings arose during your session. They are not symptoms — they are signals.
                                    Each one was part of your journey.
                                </p>
                            </div>
                        </Accordion>
                    </Zone>
                )}

                {/* ── ZONE 3: The Neuroplastic Window ──────────────────────────── */}
                {zones.z3 && (
                    <Zone number={3} title="The Neuroplastic Window" accentColor={C.blue}
                        tooltip="Research shows your brain is most open to new patterns in the 2–4 weeks after a psychedelic session. This is called the neuroplastic window. Your daily check-ins here feed that science."
                    >
                        <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 24, lineHeight: 1.75 }}>
                            {submitted
                                ? 'Check-in recorded. Thank you for showing up for yourself today.'
                                : 'Your brain is most receptive to change in the days and weeks following your session. How are you feeling right now?'}
                        </p>

                        {!submitted ? (
                            <>
                                <SliderField label="Mood" fieldKey="mood" value={mood} onChange={setMood} />
                                <SliderField label="Sleep Quality" fieldKey="sleep" value={sleep} onChange={setSleep} />
                                <SliderField label="Connection" fieldKey="connection" value={connection} onChange={setConnection} />
                                <SliderField label="Anxiety Level" fieldKey="anxiety" value={anxiety} onChange={setAnxiety} />

                                {/* WO-523: CTA uses indigo gradient — Phase 1 brand color */}
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="no-print"
                                    style={{
                                        width: '100%', marginTop: 8, padding: '16px',
                                        borderRadius: 14, fontSize: 14, fontWeight: 700,
                                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                        border: 'none', color: '#ffffff', cursor: 'pointer',
                                        boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
                                        transition: 'box-shadow 0.2s',
                                        letterSpacing: '0.04em',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(99,102,241,0.5)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.3)'; }}
                                >
                                    Record Today's Check-In
                                </button>
                            </>
                        ) : (
                            // WO-579 Fix 2: Sliders re-editable after submit until patient explicitly finalizes
                            <>
                                <p style={{
                                    fontSize: 14, color: '#60a5fa', marginBottom: 16, lineHeight: 1.6,
                                    background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.18)',
                                    borderRadius: 10, padding: '10px 14px'
                                }}>
                                    ✓ Check-in recorded. You can continue adjusting your responses until you are ready to finalize them.
                                </p>
                                {!finalized ? (
                                    <>
                                        <SliderField label="Mood" fieldKey="mood" value={mood} onChange={setMood} />
                                        <SliderField label="Sleep Quality" fieldKey="sleep" value={sleep} onChange={setSleep} />
                                        <SliderField label="Connection" fieldKey="connection" value={connection} onChange={setConnection} />
                                        <SliderField label="Anxiety Level" fieldKey="anxiety" value={anxiety} onChange={setAnxiety} />
                                        <button
                                            type="button"
                                            onClick={() => setFinalized(true)}
                                            className="no-print"
                                            style={{
                                                width: '100%', marginTop: 8, padding: '13px',
                                                borderRadius: 12, fontSize: 14, fontWeight: 700,
                                                background: 'rgba(96,165,250,0.08)',
                                                border: '1.5px solid rgba(96,165,250,0.3)',
                                                color: C.blue, cursor: 'pointer', letterSpacing: '0.04em',
                                                transition: 'background 0.2s',
                                            }}
                                        >
                                            Finalize My Responses
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <SliderField label="Mood" fieldKey="mood" value={mood} onChange={() => { }} readOnly />
                                        <SliderField label="Sleep Quality" fieldKey="sleep" value={sleep} onChange={() => { }} readOnly />
                                        <SliderField label="Connection" fieldKey="connection" value={connection} onChange={() => { }} readOnly />
                                        <SliderField label="Anxiety Level" fieldKey="anxiety" value={anxiety} onChange={() => { }} readOnly />
                                        <div style={{
                                            marginTop: 16, padding: '12px 16px', borderRadius: 12,
                                            background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.18)',
                                            display: 'flex', gap: 10, alignItems: 'center',
                                        }}>
                                            <span style={{ fontSize: 18, color: C.blue }}>✓</span>
                                            <p style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>Responses finalized and locked.</p>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </Zone>
                )}

                {/* WO-579 Fix 3: Zone reorder — Zone 5 (Practical Planning) before Zone 4 (Safety) */}
                {/* ── ZONE 5: What Comes Next ───────────────────────────────────── */}
                {zones.z5 && (
                    <Zone number={5} title="What Comes Next" accentColor={C.gold}
                        tooltip="Integration is where healing becomes real. The PEMS framework (Physical, Emotional, Mental, Spiritual) is a research-backed map for the weeks after your session. Each dimension matters equally."
                    >
                        {/* PEMS model — always visible */}
                        <div className="stat-grid" style={{
                            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16,
                        }}>
                            {[
                                {
                                    letter: 'P', label: 'Physical', desc: 'Move your body daily. Walk, stretch, swim. Your nervous system heals through motion.', color: C.blue,
                                    tip: 'Physical movement after a session helps your nervous system process and anchor the experience. Even a 10-minute walk counts.'
                                },
                                {
                                    letter: 'E', label: 'Emotional', desc: 'Let feelings surface without judgment. Journal, cry, rest. This is not weakness, it is the work.', color: C.violet,
                                    tip: 'Emotions that arise post-session are part of the integration process. They are not a sign something went wrong — they are the medicine continuing to work.'
                                },
                                {
                                    letter: 'M', label: 'Mental', desc: 'Notice the new patterns of thought emerging. Write them down before they fade.', color: '#818cf8',
                                    tip: 'New insights and perspectives are most vivid and accessible in the first 2 weeks. Journaling or voice-noting them lets you revisit them months later.'
                                },
                                {
                                    letter: 'S', label: 'Spiritual', desc: 'Whatever connection means to you, tend to it. Nature, community, stillness, creation.', color: C.gold,
                                    tip: 'Spiritual connection — whether through nature, community, or stillness — has been linked to stronger long-term outcomes in psychedelic therapy research.'
                                },
                            ].map(item => (
                                <div key={item.letter} style={{
                                    background: `${item.color}08`,
                                    border: `1px solid ${item.color}20`, borderRadius: 14, padding: '14px 16px',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                        <span style={{ fontSize: 18, fontWeight: 900, color: item.color }}>{item.letter}</span>
                                        <span style={{ fontSize: 14, fontWeight: 700, color: '#cbd5e1', flex: 1 }}>{item.label}</span>
                                        <AdvancedTooltip content={item.tip} side="top" type="science" width="w-64">
                                            <Info size={13} className="text-slate-600 hover:text-purple-400 cursor-help transition-colors print:hidden" />
                                        </AdvancedTooltip>
                                    </div>
                                    <p style={{ fontSize: 14, color: '#64748b', margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Journaling prompts — collapsible */}
                        <Accordion label="Integration Journal Prompts" accentColor={C.gold}>
                            <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 20px' }}>
                                {[
                                    'What from your session is still asking for your attention?',
                                    'What has shifted in how you see yourself or your story?',
                                    'What is one small, concrete thing you can do today to honor what you experienced?',
                                ].map((prompt, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < 2 ? 14 : 0 }}>
                                        <span style={{ fontSize: 16, flexShrink: 0, color: C.gold }}>✦</span>
                                        <p style={{ fontSize: 14, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>{prompt}</p>
                                    </div>
                                ))}
                            </div>
                        </Accordion>

                        {/* Integration roadmap context — collapsible */}
                        <Accordion label="Your Integration Roadmap" accentColor={C.gold}>
                            <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 0, lineHeight: 1.75 }}>
                                Integration is where the real healing happens. The weeks following your session are the most important.
                                The PEMS framework above tracks Physical, Emotional, Mental, and Spiritual dimensions of recovery.
                                Move daily, journal often, and stay connected with your practitioner.
                            </p>
                        </Accordion>

                        {/* Integration attendance — always visible */}
                        {data.integrationSessionsAttended != null && data.integrationSessionsAttended > 0 && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
                                background: `${C.violet}08`, border: `1px solid ${C.violet}20`,
                                borderRadius: 12, padding: '12px 16px',
                            }}>
                                <span style={{ fontSize: 22 }}>📅</span>
                                <p style={{ fontSize: 14, color: '#cbd5e1', margin: 0 }}>
                                    You have attended{' '}
                                    <strong style={{ color: C.violet }}>{data.integrationSessionsAttended}</strong>
                                    {data.integrationSessionsScheduled
                                        ? ` of ${data.integrationSessionsScheduled} scheduled`
                                        : ''}{' '}
                                    integration sessions. Keep showing up.
                                </p>
                            </div>
                        )}
                    </Zone>
                )}

                {/* ── ZONE 4: Safety — only rendered if flagged ────────────────── */}
                {zones.z4 && (
                    <Zone number={4} title="Safety & Support" accentColor={C.rose}
                        tooltip="This section only appears when your practitioner has flagged something important. It includes crisis resources, safety notes, and areas to monitor during your integration."
                    >
                        {/* 988 crisis line — always visible */}
                        <div style={{
                            marginBottom: 12, padding: '14px 18px',
                            background: `${C.rose}06`, border: `1px solid ${C.rose}15`, borderRadius: 12,
                        }}>
                            <p style={{ fontSize: 14, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                                If you are in crisis right now, please contact the{' '}
                                <strong style={{ color: C.rose }}>988 Suicide & Crisis Lifeline</strong>{' '}
                                (call or text 988) or go to your nearest emergency room.
                            </p>
                        </div>

                        {/* Practitioner note + red flags — collapsible */}
                        {(data.safetyNote || (data.redFlags && data.redFlags.length > 0)) && (
                            <Accordion label="Practitioner Notes & Areas to Monitor" defaultOpen={true} accentColor={C.rose}>
                                {data.safetyNote && (
                                    <div style={{
                                        padding: '14px 18px',
                                        background: `${C.rose}08`, border: `1px solid ${C.rose}20`, borderRadius: 12,
                                        marginBottom: 12,
                                    }}>
                                        <p style={{ fontSize: 14, fontWeight: 700, color: C.rose, margin: '0 0 4px' }}>
                                            A note from your practitioner
                                        </p>
                                        <p style={{ fontSize: 14, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                                            {data.safetyNote}
                                        </p>
                                    </div>
                                )}
                                {data.redFlags && data.redFlags.length > 0 && (
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 700, color: C.rose, marginBottom: 10 }}>
                                            Areas to monitor
                                        </p>
                                        {data.redFlags.map((flag, i) => (
                                            <div key={i} style={{
                                                display: 'flex', gap: 10, marginBottom: 8,
                                                padding: '10px 14px', borderRadius: 10,
                                                background: `${C.rose}06`, border: `1px solid ${C.rose}15`,
                                            }}>
                                                <span style={{ color: C.rose, fontSize: 14 }}>⚠</span>
                                                <p style={{ fontSize: 14, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>{flag}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Accordion>
                        )}
                    </Zone>
                )}

                {/* ── ZONE 6: Your Journey Map ─────────────────────────────────── */}
                <Zone number={6} title="Your Journey Map" accentColor={C.blue}
                    tooltip="Two visual perspectives on what happened during your session. The Experience Profile maps the intensity of key biological and subjective dimensions. The Flight Plan shows how your medicine metabolized across time."
                >
                    <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20, lineHeight: 1.75 }}>
                        Two views of what happened in your body and mind. These are biological and experiential patterns, not a diagnosis or medical record.
                    </p>

                    {/* Spider chart — progressive disclosure on mobile */}
                    <div style={{ marginBottom: 28 }}>
                        <p style={{
                            fontSize: 11, fontWeight: 800, color: '#475569',
                            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12
                        }}
                        >Experience Profile</p>
                        <Accordion
                            label="View Experience Profile Chart"
                            defaultOpen={typeof window !== 'undefined' && window.innerWidth >= 768}
                            accentColor={C.blue}
                        >
                            <DualModeSpiderChart />
                        </Accordion>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(96,165,250,0.10)', margin: '4px 0 28px' }} />

                    {/* Flight plan — progressive disclosure on mobile */}
                    <div>
                        <p style={{
                            fontSize: 11, fontWeight: 800, color: '#475569',
                            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12
                        }}
                        >Pharmacokinetic Flight Plan{data.substanceName ? ` · ${data.substanceName}` : ''}</p>
                        <Accordion
                            label="View Flight Plan Chart"
                            defaultOpen={typeof window !== 'undefined' && window.innerWidth >= 768}
                            accentColor={C.blue}
                        >
                            <PatientFlightPlanChart substanceName={data.substanceName} />
                        </Accordion>
                    </div>

                    {/* Coming Soon: Neurological Map — deferred per WO-546 Out of Scope */}
                    <div style={{ marginTop: 28 }}>
                        <AdvancedTooltip
                            content="The Neurological Map will visualize brain network activity patterns correlated with your session data. Currently in development."
                            side="top" type="science" width="w-72"
                        >
                            <div className="no-print" style={{
                                background: 'rgba(15,23,42,0.60)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                borderRadius: '2rem',
                                padding: '28px 24px',
                                textAlign: 'center',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                                cursor: 'help',
                            }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                                    aria-hidden="true" style={{ opacity: 0.35 }}>
                                    <rect x="3" y="11" width="18" height="11" rx="2"
                                        stroke="#60a5fa" strokeWidth="1.5" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"
                                        stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
                                    <circle cx="12" cy="16" r="1.5" fill="#60a5fa" />
                                </svg>
                                <p style={{
                                    fontSize: 14, fontWeight: 700, color: '#475569',
                                    letterSpacing: '0.06em', margin: 0
                                }}>Neurological Map</p>
                                <p style={{ fontSize: 12, color: '#334155', margin: 0 }}>Coming Soon: In Development</p>
                            </div>
                        </AdvancedTooltip>
                    </div>
                </Zone>

                {/* ── Share buttons ─────────────────────────────────────────────── */}
                <div className="no-print" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
                    <button
                        onClick={sharePractitioner}
                        aria-label="Share this Compass with your practitioner"
                        style={{
                            padding: '17px 14px', borderRadius: 14, fontSize: 14, fontWeight: 700,
                            background: `linear-gradient(135deg, ${C.blue} 0%, #4f46e5 100%)`,
                            border: `1px solid rgba(96,165,250,0.4)`,
                            color: '#050c1a', cursor: 'pointer',
                            boxShadow: '0 4px 20px rgba(96,165,250,0.25)',
                            transition: 'box-shadow 0.2s, opacity 0.2s', lineHeight: 1.3,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(96,165,250,0.35)'; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(96,165,250,0.25)'; }}
                    >
                        Share with Your Practitioner
                    </button>
                    <button
                        onClick={shareFriend}
                        aria-label="Share this Compass with a friend"
                        style={{
                            padding: '17px 14px', borderRadius: 14, fontSize: 14, fontWeight: 700,
                            background: 'rgba(15,23,42,0.4)',
                            border: `1px solid rgba(245,158,11,0.35)`,
                            color: C.gold, cursor: 'pointer',
                            transition: 'background 0.2s, border-color 0.2s', lineHeight: 1.3,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.06)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.55)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(15,23,42,0.4)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.35)'; }}
                    >
                        Share with a Friend
                    </button>
                </div>

                {/* ── Footer ────────────────────────────────────────────────────── */}
                <div style={{
                    marginTop: 48, paddingTop: 24,
                    borderTop: `1px solid rgba(96,165,250,0.08)`,
                    textAlign: 'center',
                }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12, opacity: 0.5 }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="8" cy="8" r="7" stroke={C.blue} strokeWidth="1" />
                            <line x1="8" y1="1" x2="8" y2="15" stroke={C.blue} strokeWidth="0.75" />
                            <line x1="1" y1="8" x2="15" y2="8" stroke={C.blue} strokeWidth="0.75" />
                            <circle cx="8" cy="8" r="1.5" fill={C.blue} />
                        </svg>
                        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.blue }}>
                            PPN Portal
                        </span>
                    </div>
                    <p style={{ fontSize: 11, color: '#334155', lineHeight: 1.6, margin: '0 0 4px' }}>
                        Zero PHI · Patient ID: {sessionId?.slice(0, 8).toUpperCase() ?? 'PREVIEW'}
                    </p>
                    <p style={{ fontSize: 11, color: '#334155', marginTop: 4 }}>
                        Data reflects population averages and personal reflections. This is not medical advice.
                        Always consult your practitioner.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PatientReport;
