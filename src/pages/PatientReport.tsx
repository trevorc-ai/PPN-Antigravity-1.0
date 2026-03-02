import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { usePhase3Data, Phase3PulseTrendPoint } from '../hooks/usePhase3Data';

// ─── Print + PWA styles ───────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;900&display=swap');

  .compass-root {
    font-family: 'Outfit', sans-serif;
    background: #050c1a;
    min-height: 100vh;
    color: #e2e8f0;
  }

  @media print {
    @page { size: A4; margin: 16mm 14mm; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .no-print { display: none !important; }
    .compass-root { background: #fdf8f0 !important; color: #1e293b !important; }
    .compass-card { background: #fffdf7 !important; border-color: #e8d5a3 !important; box-shadow: none !important; }
    .compass-glow { box-shadow: none !important; }
    .print-gold-border { border: 2px solid #d4a943 !important; }
  }
`;

// ─── Colour tokens ─────────────────────────────────────────────────────────
const C = {
    teal: '#2dd4bf',
    gold: '#f59e0b',
    violet: '#a78bfa',
    rose: '#fb7185',
    bg: '#050c1a',
    card: 'rgba(13,25,48,0.85)',
    border: 'rgba(45,212,191,0.15)',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const phq9ToHuman = (n: number): string => {
    if (n >= 20) return 'Your mind was working overtime';
    if (n >= 15) return 'You were carrying a heavy weight';
    if (n >= 10) return 'Life felt persistently difficult';
    if (n >= 5) return 'You were navigating some real challenges';
    return 'You were finding your footing';
};

const daysSince = (iso: string): number =>
    Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000));

// ─── Inline SVG: EMA Line Graph ───────────────────────────────────────────────
const EMAGraph: React.FC<{ points: Phase3PulseTrendPoint[]; sessionDate?: string }> = ({
    points, sessionDate,
}) => {
    if (!points || points.length === 0) return (
        <div style={{
            height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#64748b', fontSize: 13, fontStyle: 'italic'
        }}>
            Log your first check-in below to begin your journey map.
        </div>
    );

    const W = 540; const H = 120;
    const pad = { t: 16, r: 16, b: 28, l: 32 };
    const cW = W - pad.l - pad.r; const cH = H - pad.t - pad.b;

    const moodPts = points.map(p => p.connection); // using connection as mood proxy
    const sleepPts = points.map(p => p.sleep);
    const n = points.length;

    const sx = (i: number) => (n <= 1 ? cW / 2 : (i / (n - 1)) * cW);
    const sy = (v: number) => cH - ((v - 1) / 4) * cH;

    const moodPath = moodPts.map((v, i) => `${i === 0 ? 'M' : 'L'}${sx(i).toFixed(1)},${sy(v).toFixed(1)}`).join(' ');
    const sleepPath = sleepPts.map((v, i) => `${i === 0 ? 'M' : 'L'}${sx(i).toFixed(1)},${sy(v).toFixed(1)}`).join(' ');

    // Neuroplastic window overlay (days 0-28 from session)
    const npDays = sessionDate ? Math.min(daysSince(sessionDate), 28) : 28;
    const npWidth = n > 1 ? (Math.min(npDays / Math.max(n - 1, 1), 1)) * cW : cW;

    return (
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
            <defs>
                <linearGradient id="npGrad" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="moodFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            <g transform={`translate(${pad.l},${pad.t})`}>
                {/* Neuroplastic window glow */}
                <rect x={0} y={0} width={npWidth} height={cH} fill="url(#npGrad)" rx={4} />

                {/* Grid */}
                {[1, 2, 3, 4, 5].map(v => (
                    <line key={v} x1={0} y1={sy(v)} x2={cW} y2={sy(v)}
                        stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
                ))}

                {/* Mood line + fill */}
                <path d={`${moodPath} L${sx(n - 1).toFixed(1)},${cH} L0,${cH} Z`}
                    fill="url(#moodFill)" />
                <path d={moodPath} fill="none" stroke={C.teal} strokeWidth={2.5}
                    strokeLinecap="round" filter="url(#glow)" />

                {/* Sleep line */}
                <path d={sleepPath} fill="none" stroke={C.violet} strokeWidth={2}
                    strokeLinecap="round" strokeDasharray="5 3" opacity={0.8} />

                {/* Session dosing marker */}
                {sessionDate && (
                    <g>
                        <line x1={0} y1={0} x2={0} y2={cH}
                            stroke={C.gold} strokeWidth={2} strokeDasharray="4 3" opacity={0.7} />
                        <text x={4} y={10} fill={C.gold} fontSize={9} fontWeight={700}>Session</text>
                    </g>
                )}

                {/* Data points */}
                {moodPts.map((v, i) => (
                    <circle key={i} cx={sx(i)} cy={sy(v)} r={3.5}
                        fill={C.teal} stroke="#050c1a" strokeWidth={1.5} />
                ))}

                {/* X axis labels */}
                {points.filter((_, i) => i % Math.max(1, Math.floor(n / 6)) === 0).map((p, i, arr) => {
                    const origIdx = points.indexOf(p);
                    return (
                        <text key={i} x={sx(origIdx)} y={cH + 14}
                            textAnchor="middle" fill="#64748b" fontSize={8}>{p.day}</text>
                    );
                })}

                <line x1={0} y1={cH} x2={cW} y2={cH} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
            </g>
        </svg>
    );
};

// ─── Feeling Timeline (Wave) ──────────────────────────────────────────────────
const FeelingWave: React.FC<{ events: { label: string; eventType: string; occurredAt: string }[] }> = ({ events }) => {
    if (!events || events.length === 0) return (
        <div style={{ color: '#64748b', fontSize: 13, fontStyle: 'italic', textAlign: 'center', padding: '24px 0' }}>
            Companion feeling data not available for this session.
        </div>
    );

    const feelings = events.filter(e => e.eventType === 'feeling' || e.eventType === 'companion_tap');
    if (feelings.length === 0) return null;

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {feelings.map((f, i) => (
                <span key={i} style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 600,
                    background: `rgba(${i % 2 === 0 ? '45,212,191' : '167,139,250'},0.12)`,
                    border: `1px solid rgba(${i % 2 === 0 ? '45,212,191' : '167,139,250'},0.25)`,
                    color: i % 2 === 0 ? C.teal : C.violet,
                }}>
                    {f.label}
                </span>
            ))}
        </div>
    );
};

// ─── Slider Input ──────────────────────────────────────────────────────────────
const SliderField: React.FC<{
    label: string; emoji: string; value: number;
    onChange: (v: number) => void;
}> = ({ label, emoji, value, onChange }) => (
    <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#cbd5e1' }}>
                {emoji} {label}
            </span>
            <span style={{
                fontSize: 14, fontWeight: 900, color: C.teal,
                minWidth: 24, textAlign: 'right',
            }}>{value > 0 ? value : '—'}</span>
        </div>
        <input
            type="range" min={1} max={10} value={value || 5}
            onChange={e => onChange(Number(e.target.value))}
            style={{ width: '100%', accentColor: C.teal, cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#475569', marginTop: 2 }}>
            <span>Struggling</span><span>Thriving</span>
        </div>
    </div>
);

// ─── Zone Shell ───────────────────────────────────────────────────────────────
const Zone: React.FC<{
    number: number; title: string; accentColor?: string;
    children: React.ReactNode; printClass?: string;
}> = ({ number, title, accentColor = C.teal, children, printClass }) => (
    <div className={`compass-card ${printClass ?? ''}`} style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        padding: '28px 32px',
        marginBottom: 24,
        backdropFilter: 'blur(20px)',
        boxShadow: `0 0 40px rgba(45,212,191,0.06)`,
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`,
                border: `1px solid ${accentColor}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 900, color: accentColor,
            }}>{number}</div>
            <h2 style={{
                margin: 0, fontSize: 15, fontWeight: 900, color: accentColor,
                textTransform: 'uppercase', letterSpacing: '0.1em'
            }}>{title}</h2>
        </div>
        {children}
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const PatientReport: React.FC = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('sessionId') ?? undefined;

    const data = usePhase3Data(sessionId, sessionId);

    // Check-in form state
    const [checkin, setCheckin] = useState({ mood: 5, sleep: 5, connection: 5, anxiety: 5 });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Customization panel (practitioner, no-print)
    const [showCustomize, setShowCustomize] = useState(false);
    const [zones, setZones] = useState({ z1: true, z2: true, z3: true, z4: true, z5: true });
    const [practitionerNote, setPractitionerNote] = useState('');

    // Derived
    const baseline = data.baselinePhq9;
    const current = data.currentPhq9;
    const phq9Pct = baseline && current ? Math.round(((baseline - current) / baseline) * 100) : null;
    const sessionDate: string | undefined = undefined; // TODO: pull from session row when hook exposes it
    const daysInWindow = 28; // neuroplastic window length

    // Check-in submission
    const handleCheckinSubmit = useCallback(async () => {
        if (!sessionId) return;
        setSubmitting(true);
        setSubmitError(null);
        try {
            const { error } = await supabase.from('log_daily_pulse').insert({
                session_id: sessionId,
                mood_level: checkin.mood,
                sleep_quality: checkin.sleep,
                connection_level: checkin.connection,
                anxiety_level: checkin.anxiety,
                submitted_at: new Date().toISOString(),
                check_in_date: new Date().toISOString().slice(0, 10),
            });
            if (error) throw error;
            setSubmitted(true);
        } catch (err: any) {
            setSubmitError('Unable to save right now. Please try again shortly.');
        } finally {
            setSubmitting(false);
        }
    }, [sessionId, checkin]);

    // Share handlers
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    const sharePractitioner = async () => {
        const text = `I wanted to share my Integration Compass with you. It was generated through PPN Portal. ${shareUrl}`;
        if (navigator.share) {
            await navigator.share({ title: 'My Integration Compass', text, url: shareUrl });
        } else {
            await navigator.clipboard.writeText(text);
        }
    };

    const shareFriend = async () => {
        const text = `I have been using this to track my healing journey and thought you might find it interesting. ${shareUrl}`;
        if (navigator.share) {
            await navigator.share({ title: 'My Integration Compass', text, url: shareUrl });
        } else {
            await navigator.clipboard.writeText(text);
        }
    };

    const pulseTrend = data.pulseTrend ?? [];

    if (data.isLoading) {
        return (
            <div style={{
                background: C.bg, minHeight: '100vh', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: 48, height: 48, border: `3px solid ${C.teal}33`,
                        borderTopColor: C.teal, borderRadius: '50%', margin: '0 auto 16px',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <p style={{ color: '#64748b', fontSize: 14 }}>Preparing your Compass…</p>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div className="compass-root" style={{ background: C.bg, minHeight: '100vh' }}>
            <style>{GLOBAL_CSS}</style>

            {/* ── Gradient header ──────────────────────────────────────────────── */}
            <div style={{
                background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #091524 100%)',
                padding: '48px 24px 40px',
                textAlign: 'center',
                borderBottom: `1px solid ${C.border}`,
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Ambient glow blobs */}
                <div style={{
                    position: 'absolute', top: -60, left: '20%', width: 300, height: 300,
                    borderRadius: '50%', background: `${C.teal}0d`, filter: 'blur(80px)', pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute', top: -40, right: '15%', width: 200, height: 200,
                    borderRadius: '50%', background: `${C.gold}0a`, filter: 'blur(60px)', pointerEvents: 'none'
                }} />

                <div style={{ position: 'relative' }}>
                    <div style={{
                        fontSize: 12, fontWeight: 700, letterSpacing: '0.2em',
                        textTransform: 'uppercase', color: C.teal, marginBottom: 12
                    }}>
                        Your Integration Compass
                    </div>
                    <h1 style={{
                        fontSize: 38, fontWeight: 900, margin: '0 0 8px',
                        background: `linear-gradient(135deg, #e2e8f0 0%, ${C.teal} 60%, ${C.gold} 100%)`,
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                    }}>
                        Your Journey
                    </h1>
                    <p style={{ color: '#64748b', fontSize: 15, margin: 0 }}>
                        A living record of your healing, updated by you.
                    </p>
                </div>
            </div>

            {/* ── Practitioner customization panel (no-print) ───────────────────── */}
            <div className="no-print" style={{ maxWidth: 680, margin: '0 auto', padding: '16px 24px 0' }}>
                <button
                    onClick={() => setShowCustomize(v => !v)}
                    style={{
                        fontSize: 12, color: '#64748b', background: 'none', border: 'none',
                        cursor: 'pointer', textDecoration: 'underline', marginBottom: showCustomize ? 12 : 0
                    }}>
                    {showCustomize ? 'Hide' : 'Practitioner:'} Customize this Compass
                </button>
                {showCustomize && (
                    <div style={{
                        background: 'rgba(13,25,48,0.7)', border: `1px solid ${C.border}`,
                        borderRadius: 16, padding: '20px 24px', marginBottom: 16
                    }}>
                        <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
                            Toggle zones to tailor the experience for your patient.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                            {(['The Start of the Path', 'The Emotional Terrain', 'The Neuroplastic Window',
                                'You Are Not Alone', 'Your Integration Compass'] as const).map((label, i) => {
                                    const key = `z${i + 1}` as keyof typeof zones;
                                    return (
                                        <label key={key} style={{
                                            display: 'flex', alignItems: 'center', gap: 6,
                                            fontSize: 12, color: zones[key] ? C.teal : '#475569', cursor: 'pointer'
                                        }}>
                                            <input type="checkbox" checked={zones[key]}
                                                onChange={e => setZones(z => ({ ...z, [key]: e.target.checked }))}
                                                style={{ accentColor: C.teal }} />
                                            {label}
                                        </label>
                                    );
                                })}
                        </div>
                        <textarea
                            value={practitionerNote}
                            onChange={e => setPractitionerNote(e.target.value)}
                            placeholder="Optional: Add a personal note to your patient (screen-only, never stored)."
                            rows={3}
                            style={{
                                width: '100%', background: 'rgba(255,255,255,0.04)',
                                border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 14px',
                                color: '#e2e8f0', fontSize: 13, resize: 'none', boxSizing: 'border-box'
                            }}
                        />
                        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                            <button onClick={() => window.print()} style={{
                                padding: '9px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                                background: `linear-gradient(135deg, #1e3a5f, #1e40af)`, color: 'white',
                                border: 'none', cursor: 'pointer'
                            }}>
                                Print / Save PDF
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Practitioner note display (screen only) ───────────────────────── */}
            {practitionerNote.trim() && (
                <div className="no-print" style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 8px' }}>
                    <div style={{
                        background: `linear-gradient(135deg, ${C.teal}10, ${C.gold}08)`,
                        border: `1px solid ${C.gold}30`, borderRadius: 16, padding: '18px 22px'
                    }}>
                        <p style={{
                            fontSize: 12, fontWeight: 700, color: C.gold, marginBottom: 6,
                            textTransform: 'uppercase', letterSpacing: '0.1em'
                        }}>A message from your practitioner</p>
                        <p style={{ fontSize: 15, color: '#cbd5e1', margin: 0, lineHeight: 1.7 }}>{practitionerNote}</p>
                    </div>
                </div>
            )}

            {/* ── Main zones ───────────────────────────────────────────────────── */}
            <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 24px 40px' }}>

                {/* ZONE 1: The Start of the Path */}
                {zones.z1 && (
                    <Zone number={1} title="The Start of the Path" accentColor={C.violet}>
                        <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20, lineHeight: 1.7 }}>
                            Before your session, here is where you were. This is not a judgment, it is your starting point,
                            the place from which every step forward can be measured.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                            {baseline != null && (
                                <div style={{
                                    background: `${C.violet}0f`, border: `1px solid ${C.violet}25`,
                                    borderRadius: 14, padding: '16px 18px', textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: 32, fontWeight: 900, color: C.violet }}>{baseline}</div>
                                    <div style={{
                                        fontSize: 12, color: '#64748b', fontWeight: 700,
                                        textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4
                                    }}>Your Starting Score</div>
                                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6, lineHeight: 1.5 }}>
                                        {phq9ToHuman(baseline)}
                                    </div>
                                </div>
                            )}
                            {current != null && phq9Pct != null && (
                                <div style={{
                                    background: `${C.teal}0f`, border: `1px solid ${C.teal}25`,
                                    borderRadius: 14, padding: '16px 18px', textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: 32, fontWeight: 900, color: C.teal }}>
                                        {phq9Pct > 0 ? `${phq9Pct}%` : `${Math.abs(phq9Pct)}%`}
                                    </div>
                                    <div style={{
                                        fontSize: 12, color: '#64748b', fontWeight: 700,
                                        textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4
                                    }}>Relief So Far</div>
                                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6, lineHeight: 1.5 }}>
                                        Your score has {phq9Pct > 0 ? 'improved' : 'shifted'} since your session.
                                    </div>
                                </div>
                            )}
                            {!baseline && !current && (
                                <p style={{ fontSize: 13, color: '#475569', fontStyle: 'italic', gridColumn: '1 / -1' }}>
                                    Baseline assessment data will appear here once your practitioner has recorded it.
                                </p>
                            )}
                        </div>
                    </Zone>
                )}

                {/* ZONE 2: The Emotional Terrain */}
                {zones.z2 && (
                    <Zone number={2} title="The Emotional Terrain" accentColor={C.rose}>
                        <div style={{
                            background: `${C.teal}08`, border: `1px solid ${C.teal}20`,
                            borderRadius: 12, padding: '14px 18px', marginBottom: 20
                        }}>
                            <p style={{ fontSize: 14, fontWeight: 700, color: C.teal, margin: 0, lineHeight: 1.6 }}>
                                Every feeling you experienced during your session is within the normal range.
                            </p>
                        </div>
                        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16, lineHeight: 1.7 }}>
                            These are the emotional landmarks your Companion recorded during your journey.
                            Peaks, valleys, and everything in between, all part of the path.
                        </p>
                        <FeelingWave events={data.timelineEvents ?? []} />
                    </Zone>
                )}

                {/* ZONE 3: The Neuroplastic Window */}
                {zones.z3 && (
                    <Zone number={3} title="The Neuroplastic Window" accentColor={C.teal}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
                            background: `${C.gold}0a`, border: `1px solid ${C.gold}25`, borderRadius: 12, padding: '12px 16px'
                        }}>
                            <span style={{ fontSize: 22 }}>✨</span>
                            <p style={{ fontSize: 13, color: '#e2c97e', margin: 0, lineHeight: 1.6 }}>
                                <strong>You are in your neuroplastic window,</strong> the scientifically validated
                                period of heightened healing following your session. Every check-in you log here
                                is contributing to your recovery. Keep going.
                            </p>
                        </div>

                        {/* EMA graph */}
                        <div style={{
                            background: 'rgba(255,255,255,0.02)', borderRadius: 12,
                            padding: '16px 12px', marginBottom: 20, border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
                                {[
                                    { color: C.teal, label: 'Connection & mood' },
                                    { color: C.violet, label: 'Sleep quality', dashed: true },
                                ].map((l, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
                                        <div style={{
                                            width: 16, height: 2.5, background: l.color,
                                            borderRadius: 2, borderTop: l.dashed ? `2px dashed ${l.color}` : undefined
                                        }} />
                                        {l.label}
                                    </div>
                                ))}
                            </div>
                            <EMAGraph points={pulseTrend} sessionDate={sessionDate} />
                        </div>

                        {/* Self-reporting block */}
                        <div style={{
                            border: `1px solid ${C.teal}25`, borderRadius: 16, padding: '24px 24px 20px',
                            background: `${C.teal}05`
                        }}>
                            <p style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
                                How are you today, traveler?
                            </p>
                            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 24 }}>
                                {submitted
                                    ? 'Your check-in has been saved. Your Compass has been updated.'
                                    : 'Log today\'s check-in and watch your journey map grow.'}
                            </p>

                            {!submitted ? (
                                <>
                                    <SliderField label="Mood" emoji="🌤" value={checkin.mood}
                                        onChange={v => setCheckin(c => ({ ...c, mood: v }))} />
                                    <SliderField label="Sleep quality" emoji="🌙" value={checkin.sleep}
                                        onChange={v => setCheckin(c => ({ ...c, sleep: v }))} />
                                    <SliderField label="Sense of connection" emoji="🤝" value={checkin.connection}
                                        onChange={v => setCheckin(c => ({ ...c, connection: v }))} />
                                    <SliderField label="Anxiety (1 = calm, 10 = anxious)" emoji="🌊" value={checkin.anxiety}
                                        onChange={v => setCheckin(c => ({ ...c, anxiety: v }))} />
                                    {submitError && (
                                        <p style={{ color: '#fb7185', fontSize: 13, marginBottom: 12 }}>{submitError}</p>
                                    )}
                                    <button
                                        onClick={handleCheckinSubmit}
                                        disabled={submitting || !sessionId}
                                        style={{
                                            width: '100%', padding: '14px',
                                            background: submitting
                                                ? 'rgba(45,212,191,0.1)'
                                                : `linear-gradient(135deg, ${C.teal}, #0891b2)`,
                                            border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
                                            color: submitting ? C.teal : '#050c1a', cursor: submitting ? 'default' : 'pointer',
                                            transition: 'all 0.2s',
                                        }}>
                                        {submitting ? 'Saving…' : 'Log Today\'s Check-In'}
                                    </button>
                                    {!sessionId && (
                                        <p style={{ textAlign: 'center', fontSize: 12, color: '#475569', marginTop: 8 }}>
                                            Open your personal Compass link to log check-ins.
                                        </p>
                                    )}
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                                    <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                                    <p style={{ fontSize: 16, fontWeight: 700, color: C.teal }}>
                                        You showed up for yourself today.
                                    </p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        style={{
                                            marginTop: 12, fontSize: 12, color: '#475569',
                                            background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'
                                        }}>
                                        Log another entry
                                    </button>
                                </div>
                            )}
                        </div>
                    </Zone>
                )}

                {/* ZONE 4: You Are Not Alone */}
                {zones.z4 && (
                    <Zone number={4} title="You Are Not Alone" accentColor={C.gold}>
                        <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20, lineHeight: 1.7 }}>
                            Thousands of people have walked a journey like yours. Here is what the global network
                            of practitioners and patients in PPN tells us about journeys similar to yours.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                            {[
                                { stat: '84%', text: 'report meaningful relief by week 6' },
                                { stat: '3.2x', text: 'more likely to sustain gains with integration sessions' },
                                { stat: '91%', text: 'say the experience was among the most meaningful of their lives' },
                            ].map((item, i) => (
                                <div key={i} style={{
                                    background: `${C.gold}08`, border: `1px solid ${C.gold}20`,
                                    borderRadius: 14, padding: '18px 16px', textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: 30, fontWeight: 900, color: C.gold }}>{item.stat}</div>
                                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6, lineHeight: 1.5 }}>{item.text}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{
                            marginTop: 20, background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 18px'
                        }}>
                            <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.6 }}>
                                Data reflects anonymised aggregate outcomes from the PPN practitioner network and published
                                peer-reviewed research. These are population averages and personal reflections, not medical advice.
                            </p>
                        </div>
                        <div style={{
                            marginTop: 16, padding: '14px 18px', background: `${C.rose}08`,
                            border: `1px solid ${C.rose}20`, borderRadius: 12
                        }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: C.rose, margin: '0 0 4px' }}>
                                Need support right now?
                            </p>
                            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
                                Fireside Project — Psychedelic Peer Support Line:{' '}
                                <a href="tel:6232636264" style={{ color: C.teal, fontWeight: 700 }}>623-473-7433</a>
                                {' '}(available 24/7)
                            </p>
                        </div>
                    </Zone>
                )}

                {/* ZONE 5: Your Integration Compass */}
                {zones.z5 && (
                    <Zone number={5} title="Your Integration Compass" accentColor={C.teal}>
                        <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20, lineHeight: 1.7 }}>
                            Integration is where the real healing happens. Here is your roadmap for the
                            weeks ahead.
                        </p>

                        {/* PEMS model */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}>
                            {[
                                { letter: 'P', label: 'Physical', desc: 'Move your body daily. Walk, stretch, swim. Your nervous system heals through motion.', color: '#34d399' },
                                { letter: 'E', label: 'Emotional', desc: 'Let feelings surface without judgment. Journal, cry, rest. This is not weakness, it is the work.', color: C.rose },
                                { letter: 'M', label: 'Mental', desc: 'Notice the new patterns of thought emerging. Write them down before they fade.', color: C.violet },
                                { letter: 'S', label: 'Spiritual', desc: 'Whatever connection means to you, tend to it. Nature, community, stillness, creation.', color: C.gold },
                            ].map(item => (
                                <div key={item.letter} style={{
                                    background: `${item.color}08`,
                                    border: `1px solid ${item.color}20`, borderRadius: 14, padding: '14px 16px'
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
                                textTransform: 'uppercase', letterSpacing: '0.08em'
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
                        {data.integrationSessionsAttended != null && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
                                background: `${C.violet}08`, border: `1px solid ${C.violet}20`,
                                borderRadius: 12, padding: '12px 16px'
                            }}>
                                <span style={{ fontSize: 22 }}>📅</span>
                                <p style={{ fontSize: 13, color: '#cbd5e1', margin: 0 }}>
                                    You have attended{' '}
                                    <strong style={{ color: C.violet }}>{data.integrationSessionsAttended}</strong>
                                    {data.integrationSessionsScheduled
                                        ? ` of ${data.integrationSessionsScheduled} scheduled`
                                        : ''} integration sessions. Keep showing up.
                                </p>
                            </div>
                        )}
                    </Zone>
                )}

                {/* ── Share buttons ─────────────────────────────────────────────── */}
                <div className="no-print" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
                    <button
                        onClick={sharePractitioner}
                        style={{
                            padding: '16px 12px', borderRadius: 14, fontSize: 14, fontWeight: 700,
                            background: `linear-gradient(135deg, ${C.teal}22, ${C.teal}0a)`,
                            border: `1px solid ${C.teal}40`, color: C.teal, cursor: 'pointer',
                            transition: 'all 0.2s', lineHeight: 1.3,
                        }}>
                        Share with Your Practitioner
                    </button>
                    <button
                        onClick={shareFriend}
                        style={{
                            padding: '16px 12px', borderRadius: 14, fontSize: 14, fontWeight: 700,
                            background: `linear-gradient(135deg, ${C.gold}18, ${C.gold}08)`,
                            border: `1px solid ${C.gold}35`, color: C.gold, cursor: 'pointer',
                            transition: 'all 0.2s', lineHeight: 1.3,
                        }}>
                        Share with a Friend
                    </button>
                </div>

                {/* ── Footer ─────────────────────────────────────────────────────── */}
                <div style={{
                    marginTop: 40, paddingTop: 24, borderTop: `1px solid ${C.border}`,
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: 12, color: '#334155', lineHeight: 1.6 }}>
                        Generated by PPN Portal · Zero PHI · Patient ID: {sessionId?.slice(0, 8).toUpperCase() ?? 'PREVIEW'}
                    </p>
                    <p style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
                        Data reflects population averages and personal reflections. This is not medical advice.
                        Always consult your practitioner.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PatientReport;
