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
import { supabase } from '../supabaseClient';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
    bg: '#050c1a',
    card: 'rgba(10,20,42,0.90)',
    border: 'rgba(45,212,191,0.12)',
    teal: '#2dd4bf',
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
    background: rgba(45,212,191,0.08);
    border: 1px solid rgba(45,212,191,0.25);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #2dd4bf;
  }
  .ppn-brand-pill-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #2dd4bf;
    box-shadow: 0 0 8px rgba(45,212,191,0.8);
  }

  /* ─── Custom slider ─────────────────────────────────────────────────────── */
  .compass-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 6px;
    border-radius: 9999px;
    outline: none;
    cursor: pointer;
    border: none;
    background: linear-gradient(
      to right,
      #2dd4bf var(--pct, 50%),
      rgba(100,116,139,0.25) var(--pct, 50%)
    );
  }
  .compass-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 22px; height: 22px;
    border-radius: 50%;
    background: #2dd4bf;
    cursor: pointer;
    border: 2px solid rgba(255,255,255,0.15);
    box-shadow: 0 0 0 3px rgba(45,212,191,0.2), 0 0 14px rgba(45,212,191,0.5);
    transition: box-shadow 0.15s, transform 0.1s;
  }
  .compass-slider::-webkit-slider-thumb:hover {
    box-shadow: 0 0 0 6px rgba(45,212,191,0.25), 0 0 22px rgba(45,212,191,0.7);
    transform: scale(1.1);
  }
  .compass-slider::-moz-range-thumb {
    width: 22px; height: 22px;
    border-radius: 50%;
    background: #2dd4bf;
    cursor: pointer;
    border: 2px solid rgba(255,255,255,0.15);
    box-shadow: 0 0 0 3px rgba(45,212,191,0.2), 0 0 14px rgba(45,212,191,0.5);
  }
  .compass-slider::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: 9999px;
    background: transparent;
  }
  .compass-slider::-moz-range-track {
    height: 6px;
    border-radius: 9999px;
    background: rgba(100,116,139,0.25);
  }
  .compass-slider::-moz-range-progress {
    height: 6px;
    border-radius: 9999px;
    background: #2dd4bf;
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
    box-shadow: 0 0 60px rgba(45,212,191,0.07) !important;
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
                <span style={{ fontSize: 13, fontWeight: 800, color: C.teal }}>{value}</span>
            </div>
            <input
                type="range" min={1} max={10} step={1}
                value={value}
                readOnly={readOnly}
                onChange={e => !readOnly && onChange(Number(e.target.value))}
                className="compass-slider"
                style={{ '--pct': `${pct}%` } as React.CSSProperties}
                aria-label={label}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{cfg.low}</span>
                <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{cfg.high}</span>
            </div>
        </div>
    );
};

// ─── Zone Shell ───────────────────────────────────────────────────────────────
// WO-567: Badge = teal ring + dark bg + white numeral across ALL zones.
// accentColor drives TITLE TEXT ONLY — not the badge.
const Zone: React.FC<{
    number: number;
    title: string;
    accentColor?: string;
    children: React.ReactNode;
}> = ({ number, title, accentColor = C.teal, children }) => (
    <div className="zone-card" style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        padding: '28px 32px',
        marginBottom: 24,
        backdropFilter: 'blur(24px)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(45,212,191,0.04)',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            {/* Badge: always teal‑ring / dark‑bg / white numeral */}
            <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'rgba(45,212,191,0.08)',
                border: '1.5px solid rgba(45,212,191,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 900, color: '#e2e8f0',
                boxShadow: '0 0 12px rgba(45,212,191,0.12)',
            }}>{number}</div>
            {/* Title uses semantic domain color */}
            <h2 style={{
                margin: 0, fontSize: 13, fontWeight: 800, color: accentColor,
                textTransform: 'uppercase', letterSpacing: '0.14em', lineHeight: 1.2,
            }}>{title}</h2>
        </div>
        {children}
    </div>
);

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
                        background: `rgba(${i % 2 === 0 ? '45,212,191' : '167,139,250'},0.10)`,
                        border: `1px solid rgba(${i % 2 === 0 ? '45,212,191' : '167,139,250'},0.30)`,
                        color: i % 2 === 0 ? 'rgba(45,212,191,0.75)' : 'rgba(167,139,250,0.75)',
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
                    background: `rgba(${i % 2 === 0 ? '45,212,191' : '167,139,250'},0.12)`,
                    border: `1px solid rgba(${i % 2 === 0 ? '45,212,191' : '167,139,250'},0.28)`,
                    color: i % 2 === 0 ? C.teal : C.violet,
                }}>{f.label}</span>
            ))}
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const PatientReport: React.FC = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session') ?? undefined;

    // Check‑in slider state
    const [mood, setMood] = useState(6);
    const [sleep, setSleep] = useState(7);
    const [connection, setConnection] = useState(5);
    const [anxiety, setAnxiety] = useState(4);
    const [submitted, setSubmitted] = useState(false);

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
        if (!sessionId) return;
        (async () => {
            try {
                const { data: row } = await supabase
                    .from('wellness_sessions')
                    .select('session_date, substance_name, session_events, red_flags, safety_note, integration_sessions_attended, integration_sessions_scheduled')
                    .eq('id', sessionId)
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
    }, [sessionId]);

    const handleSubmit = useCallback(async () => {
        setSubmitted(true);
        if (!sessionId) return;
        try {
            await supabase.from('patient_checkins').insert({
                session_id: sessionId,
                mood, sleep, connection, anxiety,
                submitted_at: new Date().toISOString(),
            });
        } catch (_) { /* best effort */ }
    }, [sessionId, mood, sleep, connection, anxiety]);

    const sharePractitioner = useCallback(() => {
        const url = `${window.location.origin}${window.location.pathname}?session=${sessionId ?? 'preview'}`;
        if (navigator.share) {
            navigator.share({ title: 'My Integration Compass', url }).catch(() => { });
        } else {
            navigator.clipboard.writeText(url).catch(() => { });
            alert('Link copied!');
        }
    }, [sessionId]);

    const shareFriend = useCallback(() => {
        const url = `${window.location.origin}${window.location.pathname}?session=${sessionId ?? 'preview'}`;
        navigator.clipboard.writeText(url).catch(() => { });
        alert('Link copied!');
    }, [sessionId]);

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
                borderBottom: `1px solid rgba(45,212,191,0.10)`,
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
                    background: 'radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', top: -80, right: '10%', width: 260, height: 260,
                    borderRadius: '50%', background: 'rgba(245,158,11,0.04)',
                    filter: 'blur(70px)', pointerEvents: 'none',
                }} />

                {/* SVG Compass Rose — slow-spinning, opaque watermark */}
                <div className="no-print" style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 320, height: 320, opacity: 0.06, pointerEvents: 'none',
                }}>
                    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
                        className="compass-rose-ring" style={{ width: '100%', height: '100%' }}>
                        <circle cx="100" cy="100" r="96" stroke="#2dd4bf" strokeWidth="0.75" strokeDasharray="4 8" />
                        <circle cx="100" cy="100" r="80" stroke="#2dd4bf" strokeWidth="0.5" />
                        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
                            const rad = (deg * Math.PI) / 180;
                            const x1 = 100 + 82 * Math.sin(rad); const y1 = 100 - 82 * Math.cos(rad);
                            const x2 = 100 + 96 * Math.sin(rad); const y2 = 100 - 96 * Math.cos(rad);
                            return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2dd4bf" strokeWidth="0.75" />;
                        })}
                        {[0, 90, 180, 270].map(deg => {
                            const rad = (deg * Math.PI) / 180;
                            const tipX = 100 + 74 * Math.sin(rad); const tipY = 100 - 74 * Math.cos(rad);
                            const lX = 100 + 8 * Math.sin(rad + Math.PI / 2); const lY = 100 - 8 * Math.cos(rad + Math.PI / 2);
                            const rX = 100 + 8 * Math.sin(rad - Math.PI / 2); const rY = 100 - 8 * Math.cos(rad - Math.PI / 2);
                            return <polygon key={deg} points={`${tipX},${tipY} ${lX},${lY} ${rX},${rY}`} fill="#2dd4bf" opacity="0.9" />;
                        })}
                        <circle cx="100" cy="100" r="5" fill="#2dd4bf" />
                    </svg>
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Brand pill */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                        <div className="ppn-brand-pill">
                            <div className="ppn-brand-pill-dot" />
                            PPN · Integration Compass
                        </div>
                    </div>

                    <h1 style={{
                        fontSize: 44, fontWeight: 900, margin: '0 0 10px', lineHeight: 1.05,
                        background: `linear-gradient(140deg, #e2e8f0 0%, #e2e8f0 30%, ${C.teal} 65%, ${C.gold} 100%)`,
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.01em',
                    }}>
                        Your Journey
                    </h1>

                    <p style={{ color: C.muted, fontSize: 14, margin: '0 0 20px', letterSpacing: '0.01em' }}>
                        A living record of your healing, updated by you.
                    </p>

                    {/* Phase / status strip */}
                    <div style={{
                        display: 'inline-flex', gap: 20, alignItems: 'center',
                        padding: '8px 20px', borderRadius: 9999,
                        background: 'rgba(45,212,191,0.05)',
                        border: '1px solid rgba(45,212,191,0.15)',
                    }}>
                        <span style={{ fontSize: 12, color: '#475569', fontWeight: 600, letterSpacing: '0.06em' }}>
                            PHASE 3 · INTEGRATION
                        </span>
                        <div style={{ width: 1, height: 12, background: 'rgba(45,212,191,0.2)' }} />
                        <span style={{ fontSize: 12, color: C.teal, fontWeight: 700, letterSpacing: '0.06em' }}>
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
                    <Zone number={1} title="The Start of the Path" accentColor={C.violet}>
                        <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20, lineHeight: 1.75 }}>
                            Every journey begins with a baseline. Before your session, you were here.
                            This is your starting point - not a judgment, but a map coordinate.
                        </p>

                        {/* PHQ-9 change stat */}
                        {data.phq9Change != null && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 16,
                                background: `${C.teal}08`, border: `1px solid ${C.teal}20`,
                                borderRadius: 14, padding: '16px 20px', marginBottom: 20,
                            }}>
                                <div style={{ textAlign: 'center', minWidth: 52 }}>
                                    <div style={{ fontSize: 28, fontWeight: 900, color: C.teal }}>
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

                        <div style={{
                            background: `${C.violet}08`, border: `1px solid ${C.violet}20`,
                            borderRadius: 12, padding: '14px 18px',
                        }}>
                            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                                "The wound is the place where the light enters you." - Rumi
                            </p>
                        </div>
                    </Zone>
                )}

                {/* ── ZONE 2: The Emotional Terrain ────────────────────────────── */}
                {zones.z2 && (
                    <Zone number={2} title="The Emotional Terrain" accentColor={C.violet}>
                        <div style={{
                            background: `${C.teal}08`, border: `1px solid ${C.teal}20`,
                            borderRadius: 12, padding: '14px 18px', marginBottom: 20,
                        }}>
                            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                                These feelings arose during your session. They are not symptoms - they are signals.
                                Each one was part of your journey.
                            </p>
                        </div>
                        <FeelingWave events={data.sessionEvents ?? []} />
                    </Zone>
                )}

                {/* ── ZONE 3: The Neuroplastic Window ──────────────────────────── */}
                {zones.z3 && (
                    <Zone number={3} title="The Neuroplastic Window" accentColor={C.teal}>
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

                                <button
                                    onClick={handleSubmit}
                                    className="no-print"
                                    style={{
                                        width: '100%', marginTop: 8, padding: '16px',
                                        borderRadius: 14, fontSize: 14, fontWeight: 700,
                                        background: `linear-gradient(135deg, ${C.teal} 0%, #0e9f8e 100%)`,
                                        border: 'none', color: '#050c1a', cursor: 'pointer',
                                        boxShadow: '0 4px 20px rgba(45,212,191,0.25)',
                                        transition: 'box-shadow 0.2s',
                                        letterSpacing: '0.04em',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(45,212,191,0.4)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(45,212,191,0.25)'; }}
                                >
                                    Record Today's Check-In
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
                                    background: `${C.teal}08`, border: `1px solid ${C.teal}20`,
                                    display: 'flex', gap: 10, alignItems: 'center',
                                }}>
                                    <span style={{ fontSize: 18, color: C.teal }}>✓</span>
                                    <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Check-in saved.</p>
                                </div>
                            </>
                        )}
                    </Zone>
                )}

                {/* ── ZONE 4: Safety — only rendered if flagged ────────────────── */}
                {zones.z4 && (
                    <Zone number={4} title="Safety & Support" accentColor={C.rose}>
                        {data.safetyNote && (
                            <div style={{
                                marginTop: 0, padding: '14px 18px',
                                background: `${C.rose}08`, border: `1px solid ${C.rose}20`, borderRadius: 12,
                                marginBottom: 16,
                            }}>
                                <p style={{ fontSize: 13, fontWeight: 700, color: C.rose, margin: '0 0 4px' }}>
                                    A note from your practitioner
                                </p>
                                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                                    {data.safetyNote}
                                </p>
                            </div>
                        )}
                        {data.redFlags && data.redFlags.length > 0 && (
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 700, color: C.rose, marginBottom: 10 }}>
                                    Areas to monitor
                                </p>
                                {data.redFlags.map((flag, i) => (
                                    <div key={i} style={{
                                        display: 'flex', gap: 10, marginBottom: 8,
                                        padding: '10px 14px', borderRadius: 10,
                                        background: `${C.rose}06`, border: `1px solid ${C.rose}15`,
                                    }}>
                                        <span style={{ color: C.rose, fontSize: 14 }}>⚠</span>
                                        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>{flag}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div style={{
                            marginTop: 16, padding: '14px 18px',
                            background: `${C.rose}06`, border: `1px solid ${C.rose}15`, borderRadius: 12,
                        }}>
                            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                                If you are in crisis right now, please contact the{' '}
                                <strong style={{ color: C.rose }}>988 Suicide & Crisis Lifeline</strong>{' '}
                                (call or text 988) or go to your nearest emergency room.
                            </p>
                        </div>
                    </Zone>
                )}

                {/* ── ZONE 5: What Comes Next ───────────────────────────────────── */}
                {zones.z5 && (
                    <Zone number={5} title="What Comes Next" accentColor={C.gold}>
                        <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20, lineHeight: 1.75 }}>
                            Integration is where the real healing happens. Here is your roadmap for the weeks ahead.
                        </p>

                        {/* PEMS model */}
                        <div className="stat-grid" style={{
                            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24,
                        }}>
                            {[
                                { letter: 'P', label: 'Physical', desc: 'Move your body daily. Walk, stretch, swim. Your nervous system heals through motion.', color: C.teal },
                                { letter: 'E', label: 'Emotional', desc: 'Let feelings surface without judgment. Journal, cry, rest. This is not weakness, it is the work.', color: C.violet },
                                { letter: 'M', label: 'Mental', desc: 'Notice the new patterns of thought emerging. Write them down before they fade.', color: '#818cf8' },
                                { letter: 'S', label: 'Spiritual', desc: 'Whatever connection means to you, tend to it. Nature, community, stillness, creation.', color: C.gold },
                            ].map(item => (
                                <div key={item.letter} style={{
                                    background: `${item.color}08`,
                                    border: `1px solid ${item.color}20`, borderRadius: 14, padding: '14px 16px',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                        <span style={{ fontSize: 18, fontWeight: 900, color: item.color }}>{item.letter}</span>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1' }}>{item.label}</span>
                                    </div>
                                    <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Journaling prompts */}
                        <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 20px', marginBottom: 20 }}>
                            <p style={{
                                fontSize: 13, fontWeight: 700, color: C.teal, marginBottom: 14,
                                textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px',
                            }}>Integration Journal Prompts</p>
                            {[
                                'What from your session is still asking for your attention?',
                                'What has shifted in how you see yourself or your story?',
                                'What is one small, concrete thing you can do today to honor what you experienced?',
                            ].map((prompt, i) => (
                                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < 2 ? 14 : 0 }}>
                                    <span style={{ fontSize: 16, flexShrink: 0, color: C.gold }}>✦</span>
                                    <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>{prompt}</p>
                                </div>
                            ))}
                        </div>

                        {/* Integration attendance */}
                        {data.integrationSessionsAttended != null && data.integrationSessionsAttended > 0 && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
                                background: `${C.violet}08`, border: `1px solid ${C.violet}20`,
                                borderRadius: 12, padding: '12px 16px',
                            }}>
                                <span style={{ fontSize: 22 }}>📅</span>
                                <p style={{ fontSize: 13, color: '#cbd5e1', margin: 0 }}>
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

                {/* ── Share buttons ─────────────────────────────────────────────── */}
                <div className="no-print" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
                    <button
                        onClick={sharePractitioner}
                        aria-label="Share this Compass with your practitioner"
                        style={{
                            padding: '17px 14px', borderRadius: 14, fontSize: 14, fontWeight: 700,
                            background: `linear-gradient(135deg, ${C.teal} 0%, #0e9f8e 100%)`,
                            border: `1px solid rgba(45,212,191,0.4)`,
                            color: '#050c1a', cursor: 'pointer',
                            boxShadow: '0 4px 20px rgba(45,212,191,0.25)',
                            transition: 'box-shadow 0.2s, opacity 0.2s', lineHeight: 1.3,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(45,212,191,0.35)'; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(45,212,191,0.25)'; }}
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
                    borderTop: `1px solid rgba(45,212,191,0.08)`,
                    textAlign: 'center',
                }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12, opacity: 0.5 }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="8" cy="8" r="7" stroke="#2dd4bf" strokeWidth="1" />
                            <line x1="8" y1="1" x2="8" y2="15" stroke="#2dd4bf" strokeWidth="0.75" />
                            <line x1="1" y1="8" x2="15" y2="8" stroke="#2dd4bf" strokeWidth="0.75" />
                            <circle cx="8" cy="8" r="1.5" fill="#2dd4bf" />
                        </svg>
                        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2dd4bf' }}>
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
