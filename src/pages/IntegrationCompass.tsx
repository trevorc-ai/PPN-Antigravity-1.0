import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// ─── Data Hooks ───────────────────────────────────────────────────────────────
import { useCompassSession } from '../hooks/useCompassSession';
import { useCompassTimeline } from '../hooks/useCompassTimeline';
import { useCompassEMA } from '../hooks/useCompassEMA';
import { useCompassOutcomes } from '../hooks/useCompassOutcomes';
import { useCompassMode } from '../hooks/useCompassMode';

// ─── Group A — Wonder Layer ────────────────────────────────────────────────────
import { CompassSpiderGraph } from '../components/compass/CompassSpiderGraph';
import { FlightPlanChart } from '../components/compass/FlightPlanChart';
import { BrainNetworkMap } from '../components/compass/BrainNetworkMap';
import { EmotionalWaveform } from '../components/compass/EmotionalWaveform';

// ─── Group B — Integration Layer ──────────────────────────────────────────────
import { CompassEMAGraph } from '../components/compass/CompassEMAGraph';
import { CompassZone } from '../components/compass/CompassZone';
import { FeelingWave } from '../components/compass/FeelingWave';

// ─── Group C — Daily Ritual Layer ─────────────────────────────────────────────
import { DailyCheckInCard } from '../components/compass/DailyCheckInCard';
import { DayAwarenessHeader } from '../components/compass/DayAwarenessHeader';

// ─── Group D — Clinical Intelligence ──────────────────────────────────────────
import { IntegrationStoryChart } from '../components/compass/IntegrationStoryChart';
import { NetworkBenchmarkBlock } from '../components/compass/NetworkBenchmarkBlock';

// ─── Group E — Practitioner Gate ──────────────────────────────────────────────
import {
    CompassCustomizePanel,
    loadZones,
    ZoneVisibility,
} from '../components/compass/CompassCustomizePanel';

// ─── PEMS model prompts (static) ──────────────────────────────────────────────
const PEMS_PROMPTS: Record<string, string[]> = {
    Physical: [
        'How is your body carrying the memory of this experience?',
        'What does rest look like for you right now?',
    ],
    Emotional: [
        'What feeling from your session most wants your attention?',
        'What are you allowing yourself to feel that you didn\'t before?',
    ],
    Mental: [
        'What belief about yourself has shifted?',
        'What would it mean to act from this new understanding?',
    ],
    Spiritual: [
        'What felt larger than yourself during your experience?',
        'How are you tending to that connection in daily life?',
    ],
};

// ─── Global CSS injection ─────────────────────────────────────────────────────
const COMPASS_CSS = `
  .compass-root {
    font-family: 'Outfit', 'Inter', sans-serif;
    background: #050c1a;
    min-height: 100vh;
    color: #e2e8f0;
  }

  @keyframes star-drift {
    0%   { transform: translateY(0px) scale(1);    opacity: 0.4; }
    50%  { transform: translateY(-6px) scale(1.2); opacity: 0.9; }
    100% { transform: translateY(0px) scale(1);    opacity: 0.4; }
  }
  .compass-star {
    position: absolute;
    border-radius: 50%;
    background: #e2e8f0;
    animation: star-drift var(--dur, 6s) ease-in-out infinite;
    animation-delay: var(--delay, 0s);
    pointer-events: none;
  }
  @keyframes compass-slow-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .compass-rose-ring {
    animation: compass-slow-spin 60s linear infinite;
    transform-origin: center;
  }
  .ppn-brand-pill {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 5px 14px 5px 8px; border-radius: 9999px;
    background: rgba(45,212,191,0.08);
    border: 1px solid rgba(45,212,191,0.25);
    font-size: 11px; font-weight: 800; letter-spacing: 0.18em;
    text-transform: uppercase; color: #2dd4bf;
  }
  .ppn-brand-pill-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #2dd4bf; box-shadow: 0 0 8px rgba(45,212,191,0.8);
  }
  .compass-slider {
    -webkit-appearance: none; appearance: none;
    width: 100%; height: 6px; border-radius: 9999px;
    outline: none; cursor: pointer; border: none;
    background: linear-gradient(
      to right,
      #2dd4bf var(--pct, 50%),
      rgba(100,116,139,0.25) var(--pct, 50%)
    );
  }
  .compass-slider::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    width: 22px; height: 22px; border-radius: 50%;
    background: #2dd4bf; cursor: pointer;
    border: 2px solid rgba(255,255,255,0.15);
    box-shadow: 0 0 0 3px rgba(45,212,191,0.2), 0 0 14px rgba(45,212,191,0.5);
    transition: box-shadow 0.15s, transform 0.1s;
  }
  .compass-slider::-webkit-slider-thumb:hover {
    box-shadow: 0 0 0 6px rgba(45,212,191,0.25), 0 0 22px rgba(45,212,191,0.7);
    transform: scale(1.1);
  }
  .compass-slider::-moz-range-thumb {
    width: 22px; height: 22px; border-radius: 50%;
    background: #2dd4bf; cursor: pointer;
    border: 2px solid rgba(255,255,255,0.15);
    box-shadow: 0 0 0 3px rgba(45,212,191,0.2), 0 0 14px rgba(45,212,191,0.5);
  }
  .compass-slider::-webkit-slider-runnable-track {
    height: 6px; border-radius: 9999px; background: transparent;
  }
  .compass-slider::-moz-range-track {
    height: 6px; border-radius: 9999px; background: rgba(100,116,139,0.25);
  }
  .compass-slider::-moz-range-progress {
    height: 6px; border-radius: 9999px; background: #2dd4bf;
  }
  .feeling-pill {
    transition: opacity 0.2s, border-color 0.2s, transform 0.2s;
  }
  .feeling-pill:hover { opacity: 1 !important; transform: translateY(-1px); }
  .zone-card-inner { transition: box-shadow 0.3s; }
  .zone-card-inner:hover { box-shadow: 0 0 60px rgba(45,212,191,0.07) !important; }

  @media print {
    @page { size: A4; margin: 16mm 14mm; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .no-print { display: none !important; }
    .compass-root { background: #fdf8f0 !important; color: #1e293b !important; }
    .zone-card-inner {
      background: #fffdf7 !important;
      border-color: #e8d5a3 !important;
      box-shadow: none !important;
    }
    .compass-star, .compass-rose-ring { display: none !important; }
  }
  @media (max-width: 480px) {
    .stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
`;

const STARS = [
    { top: '12%', left: '8%', size: 2, dur: '7s', delay: '0s' },
    { top: '28%', left: '18%', size: 1.5, dur: '9s', delay: '1.2s' },
    { top: '55%', left: '5%', size: 1, dur: '11s', delay: '0.5s' },
    { top: '75%', left: '14%', size: 2.5, dur: '8s', delay: '3s' },
    { top: '10%', left: '88%', size: 2, dur: '6s', delay: '2s' },
    { top: '38%', left: '92%', size: 1.5, dur: '10s', delay: '0.8s' },
    { top: '65%', left: '85%', size: 1, dur: '7.5s', delay: '4s' },
    { top: '85%', left: '90%', size: 2, dur: '9s', delay: '1.5s' },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────
const IntegrationCompass: React.FC = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('sessionId') ?? undefined;

    // ── Data layer
    const session = useCompassSession(sessionId);
    const timeline = useCompassTimeline(sessionId);
    const ema = useCompassEMA(sessionId, session.patientUuid, session.sessionDate);
    const outcomes = useCompassOutcomes(sessionId, session.patientUuid ?? undefined);
    const { mode, practitionerView } = useCompassMode(ema.points.length);

    // ── Practitioner customize state
    const [zones, setZones] = useState<ZoneVisibility>(() =>
        sessionId ? loadZones(sessionId) : { z1: true, z2: true, z3: true, z4: true, z5: true }
    );
    const [personalMessage, setPersonalMessage] = useState('');
    const [showCustomize, setShowCustomize] = useState(false);

    // Refresh EMA after check-in submitted
    const [emaVersion, setEmaVersion] = useState(0);
    const handleCheckInSubmitted = useCallback(() => setEmaVersion(v => v + 1), []);

    // ── Loading state
    if (session.isLoading || timeline.isLoading) {
        return (
            <div style={{
                background: '#050c1a', minHeight: '100vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <style>{COMPASS_CSS}</style>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: 48, height: 48,
                        border: `3px solid rgba(45,212,191,0.2)`,
                        borderTopColor: '#2dd4bf',
                        borderRadius: '50%',
                        margin: '0 auto 16px',
                        animation: 'compass-slow-spin 1s linear infinite',
                    }} />
                    <p style={{ color: '#64748b', fontSize: 14 }}>Preparing your Compass…</p>
                </div>
            </div>
        );
    }

    const { substanceCategory, accentColor, substanceName, daysPostSession } = session;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    // ── Daily Mode: check-in promoted to top
    const checkInCard = sessionId ? (
        <DailyCheckInCard
            sessionId={sessionId}
            patientUuid={session.patientUuid}
            emaPoints={ema.points}
            streak={ema.streak}
            onSubmitted={handleCheckInSubmitted}
        />
    ) : null;

    return (
        <div className="compass-root" style={{ background: '#050c1a', minHeight: '100vh' }}>
            <style>{COMPASS_CSS}</style>

            {/* ── Hero Header ─────────────────────────────────────────────────────── */}
            <div style={{
                background: 'linear-gradient(160deg, #040d1e 0%, #071528 40%, #0a1a30 70%, #060e1c 100%)',
                padding: mode === 'daily' ? '32px 24px 28px' : '56px 24px 48px',
                textAlign: 'center',
                borderBottom: '1px solid rgba(45,212,191,0.10)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Stars */}
                {STARS.map((s, i) => (
                    <div key={i} className="compass-star no-print" style={{
                        top: s.top, left: s.left, width: s.size, height: s.size,
                        ['--dur' as string]: s.dur, ['--delay' as string]: s.delay,
                    }} />
                ))}

                {/* Ambient glow */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)',
                    width: 380, height: 380, borderRadius: '50%',
                    background: `radial-gradient(circle, ${accentColor}09 0%, transparent 70%)`,
                    pointerEvents: 'none',
                }} />

                {/* SVG compass rose */}
                <div className="no-print" style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)',
                    width: 300, height: 300, opacity: 0.06, pointerEvents: 'none',
                }}>
                    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
                        className="compass-rose-ring" style={{ width: '100%', height: '100%' }}>
                        <circle cx="100" cy="100" r="96" stroke={accentColor} strokeWidth="0.75" strokeDasharray="4 8" />
                        <circle cx="100" cy="100" r="80" stroke={accentColor} strokeWidth="0.5" />
                        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
                            const rad = (deg * Math.PI) / 180;
                            return <line key={deg}
                                x1={100 + 82 * Math.sin(rad)} y1={100 - 82 * Math.cos(rad)}
                                x2={100 + 96 * Math.sin(rad)} y2={100 - 96 * Math.cos(rad)}
                                stroke={accentColor} strokeWidth="0.75" />;
                        })}
                        <circle cx="100" cy="100" r="5" fill={accentColor} />
                    </svg>
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Brand pill */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                        <div className="ppn-brand-pill">
                            <div className="ppn-brand-pill-dot" />
                            PPN · Integration Compass
                        </div>
                    </div>

                    {/* Daily mode: compact header */}
                    {mode === 'daily' ? (
                        <DayAwarenessHeader
                            daysPostSession={daysPostSession}
                            accentColor={accentColor}
                            substanceName={substanceName}
                        />
                    ) : (
                        <>
                            <h1 style={{
                                fontSize: 44, fontWeight: 900, margin: '0 0 10px', lineHeight: 1.05,
                                background: `linear-gradient(140deg, #e2e8f0 0%, #e2e8f0 30%, ${accentColor} 65%, #f59e0b 100%)`,
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                letterSpacing: '-0.01em',
                            }}>
                                Your Journey
                            </h1>
                            <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 20px', letterSpacing: '0.01em' }}>
                                A living record of your healing, updated by you.
                            </p>
                            <div style={{
                                display: 'inline-flex', gap: 20, alignItems: 'center',
                                padding: '8px 20px', borderRadius: 9999,
                                background: `${accentColor}08`,
                                border: `1px solid ${accentColor}25`,
                            }}>
                                <span style={{ fontSize: 12, color: '#475569', fontWeight: 600, letterSpacing: '0.06em' }}>
                                    PHASE 3 · INTEGRATION
                                </span>
                                <div style={{ width: 1, height: 12, background: `${accentColor}30` }} />
                                <span style={{ fontSize: 12, color: accentColor, fontWeight: 700, letterSpacing: '0.06em' }}>
                                    {substanceName ? substanceName.toUpperCase() : 'HEALING IN PROGRESS'}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ── Daily Mode: Check-in above fold ────────────────────────────────── */}
            {mode === 'daily' && (
                <div className="no-print" style={{ maxWidth: 680, margin: '24px auto 0', padding: '0 24px' }}>
                    {checkInCard}
                    <div style={{ textAlign: 'center', margin: '16px 0' }}>
                        <a
                            href="#zone-1"
                            style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                        >
                            See your full journey ↓
                        </a>
                    </div>
                </div>
            )}

            {/* ── Practitioner Customize Panel (gated) ───────────────────────────── */}
            {practitionerView && sessionId && (
                <div style={{ maxWidth: 680, margin: '16px auto 0', padding: '0 24px' }}>
                    <button
                        onClick={() => setShowCustomize(v => !v)}
                        aria-label="Toggle practitioner customization panel"
                        aria-expanded={showCustomize}
                        className="no-print"
                        style={{
                            fontSize: 13, cursor: 'pointer', marginBottom: showCustomize ? 12 : 0,
                            color: showCustomize ? '#2dd4bf' : '#94a3b8',
                            background: showCustomize ? 'rgba(45,212,191,0.08)' : 'transparent',
                            border: `1px solid ${showCustomize ? 'rgba(45,212,191,0.35)' : 'rgba(45,212,191,0.20)'}`,
                            borderRadius: 20, padding: '6px 14px',
                            transition: 'all 0.2s',
                        }}
                    >
                        ⚙ {showCustomize ? 'Hide Customize' : 'Customize this Compass'}
                    </button>

                    {showCustomize && (
                        <CompassCustomizePanel
                            sessionId={sessionId}
                            zones={zones}
                            onZonesChange={setZones}
                            personalMessage={personalMessage}
                            onPersonalMessageChange={setPersonalMessage}
                        />
                    )}
                </div>
            )}

            {/* ── Personal message display (screen-only) ──────────────────────────── */}
            {practitionerView && personalMessage.trim() && (
                <div className="no-print" style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 8px' }}>
                    <div style={{
                        background: `linear-gradient(135deg, ${accentColor}10, rgba(245,158,11,0.08))`,
                        border: '1px solid rgba(245,158,11,0.25)', borderRadius: 16, padding: '18px 22px',
                    }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            A message from your practitioner
                        </p>
                        <p style={{ fontSize: 15, color: '#cbd5e1', margin: 0, lineHeight: 1.7 }}>{personalMessage}</p>
                    </div>
                </div>
            )}

            {/* ── Main Zone Container ─────────────────────────────────────────────── */}
            <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 24px 60px' }}>

                {/* ZONE 1: Your Experience Map ─────────────────────────────────────── */}
                <div id="zone-1">
                    <CompassZone
                        number={1}
                        title="Your Experience Map"
                        accentColor={accentColor}
                        hidden={!zones.z1}
                    >
                        <p className="ppn-body" style={{ color: '#94a3b8', marginBottom: 20 }}>
                            Two shapes. The predicted shows what{' '}
                            <span style={{ color: accentColor, fontWeight: 600 }}>{substanceName ?? 'psychedelic therapy'}</span>
                            {' '}typically does to perception, emotion, and consciousness. Your shape shows what it actually did — to you.
                            The space between is your personal story.
                        </p>

                        <CompassSpiderGraph
                            substanceCategory={substanceCategory}
                            accentColor={accentColor}
                            timelineEvents={timeline.events}
                        />

                        <div style={{ marginTop: 28 }}>
                            <h3 className="ppn-card-title" style={{ color: accentColor, marginBottom: 16 }}>
                                Your Brain During the Session
                            </h3>
                            <BrainNetworkMap
                                substanceCategory={substanceCategory}
                                accentColor={accentColor}
                            />
                        </div>
                    </CompassZone>
                </div>

                {/* ZONE 2: Your Session Journey ────────────────────────────────────── */}
                <CompassZone
                    number={2}
                    title="Your Session Journey"
                    accentColor="#a78bfa"
                    hidden={!zones.z2}
                >
                    <p className="ppn-body" style={{ color: '#94a3b8', marginBottom: 20 }}>
                        The arc of your experience mapped against the pharmacokinetic curve for{' '}
                        <span style={{ color: accentColor, fontWeight: 600 }}>{substanceName ?? 'your substance'}</span>.
                        Glowing dots show the moments your Companion recorded.
                    </p>

                    <FlightPlanChart
                        substanceCategory={substanceCategory}
                        accentColor={accentColor}
                        timelineEvents={timeline.events}
                        sessionStartTime={timeline.sessionStartTime}
                    />

                    <div style={{ marginTop: 28 }}>
                        <h3 className="ppn-card-title" style={{ color: '#a78bfa', marginBottom: 12 }}>
                            Your Emotional Terrain
                        </h3>
                        <p className="ppn-body" style={{ color: '#94a3b8', marginBottom: 16 }}>
                            Every feeling you experienced during your session is within the normal range.
                            These are the emotional peaks and valleys your Companion recorded.
                        </p>
                        <EmotionalWaveform
                            timelineEvents={timeline.events}
                            sessionDurationMinutes={timeline.sessionDurationMinutes}
                        />
                        <div style={{ marginTop: 16 }}>
                            <FeelingWave events={timeline.events} />
                        </div>
                    </div>
                </CompassZone>

                {/* ZONE 3: Neuroplastic Window ─────────────────────────────────────── */}
                <CompassZone
                    number={3}
                    title="Your Neuroplastic Window"
                    accentColor="#2dd4bf"
                    hidden={!zones.z3}
                >
                    {/* Full Report Mode: Day awareness header inline */}
                    {mode === 'report' && (
                        <div style={{ marginBottom: 20 }}>
                            <DayAwarenessHeader
                                daysPostSession={daysPostSession}
                                accentColor={accentColor}
                                substanceName={substanceName}
                            />
                        </div>
                    )}

                    <CompassEMAGraph
                        points={ema.points}
                        sessionDate={session.sessionDate}
                        daysPostSession={daysPostSession}
                        accentColor={accentColor}
                    />

                    {/* Full Report Mode: Check-in card lives here */}
                    {mode === 'report' && (
                        <div className="no-print" style={{ marginTop: 24 }}>
                            <h3 className="ppn-card-title" style={{ color: '#2dd4bf', marginBottom: 12 }}>
                                Log Today's Check-In
                            </h3>
                            {checkInCard}
                        </div>
                    )}
                </CompassZone>

                {/* ZONE 4: You Are Not Alone ───────────────────────────────────────── */}
                <CompassZone
                    number={4}
                    title="You Are Not Alone"
                    accentColor="#f59e0b"
                    hidden={!zones.z4}
                >
                    <NetworkBenchmarkBlock
                        substanceCategory={substanceCategory}
                        accentColor={accentColor}
                    />
                </CompassZone>

                {/* ZONE 5: Your Path Forward ───────────────────────────────────────── */}
                <CompassZone
                    number={5}
                    title="Your Path Forward"
                    accentColor="#fb7185"
                    hidden={!zones.z5}
                >
                    {/* PEMS integration prompts */}
                    <div style={{ marginBottom: 28 }}>
                        <h3 className="ppn-card-title" style={{ color: '#fb7185', marginBottom: 16 }}>
                            Integration Journal Prompts
                        </h3>
                        <p className="ppn-body" style={{ color: '#94a3b8', marginBottom: 16 }}>
                            These questions meet you where you are. Choose one. Sit with it.
                            Write, speak, or simply hold it.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                            {Object.entries(PEMS_PROMPTS).map(([domain, prompts]) => (
                                <div key={domain} style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 12, padding: '14px 16px',
                                }}>
                                    <div style={{
                                        fontSize: 11, fontWeight: 800, color: '#64748b',
                                        textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10,
                                    }}>
                                        {domain}
                                    </div>
                                    {prompts.map((prompt, i) => (
                                        <p key={i} style={{
                                            fontSize: 13, color: '#94a3b8', lineHeight: 1.6,
                                            margin: i === 0 ? '0 0 8px' : '0',
                                        }}>
                                            — {prompt}
                                        </p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Integration Story Chart */}
                    <div style={{ marginBottom: 24 }}>
                        <h3 className="ppn-card-title" style={{ color: '#fb7185', marginBottom: 12 }}>
                            Your Healing in Motion
                        </h3>
                        <IntegrationStoryChart
                            points={outcomes.points}
                            baselinePhq9={outcomes.baselinePhq9}
                            sessionDate={session.sessionDate}
                            accentColor={accentColor}
                        />
                    </div>

                    {/* Practitioner personal message (if any) */}
                    {personalMessage.trim() && (
                        <div style={{
                            background: `linear-gradient(135deg, ${accentColor}10, rgba(245,158,11,0.08))`,
                            border: '1px solid rgba(245,158,11,0.25)',
                            borderRadius: 16, padding: '18px 22px', marginTop: 8,
                        }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                A message from your practitioner
                            </p>
                            <p style={{ fontSize: 15, color: '#cbd5e1', margin: 0, lineHeight: 1.7 }}>
                                {personalMessage}
                            </p>
                        </div>
                    )}
                </CompassZone>

                {/* ── Share Buttons ─────────────────────────────────────────────────── */}
                <div className="no-print" style={{
                    display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center',
                    marginTop: 8, marginBottom: 24,
                }}>
                    {[
                        { label: 'Share with Practitioner', emoji: '🩺' },
                        { label: 'Share with a Friend', emoji: '💙' },
                    ].map(({ label, emoji }) => (
                        <button
                            key={label}
                            aria-label={label}
                            onClick={async () => {
                                const text = `${label}: ${shareUrl}`;
                                if (navigator.share) {
                                    await navigator.share({ title: 'My Integration Compass', text, url: shareUrl });
                                } else {
                                    await navigator.clipboard.writeText(shareUrl);
                                }
                            }}
                            style={{
                                padding: '10px 22px', borderRadius: 9999, fontSize: 13, fontWeight: 700,
                                background: 'rgba(45,212,191,0.08)',
                                border: '1px solid rgba(45,212,191,0.25)',
                                color: '#2dd4bf', cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                        >
                            {emoji} {label}
                        </button>
                    ))}
                </div>

                {/* ── Footer ───────────────────────────────────────────────────────── */}
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <p style={{ fontSize: 11, color: '#1e293b', margin: 0 }}>
                        PPN Integration Compass · Practitioner Network Platform ·{' '}
                        <a
                            href="/"
                            style={{ color: '#334155', textDecoration: 'none' }}
                        >
                            ppnportal.com
                        </a>
                    </p>
                    <p style={{ fontSize: 11, color: '#1e293b', marginTop: 4 }}>
                        In crisis? Fireside Project:{' '}
                        <a href="tel:6234737433" style={{ color: '#fb7185', fontWeight: 700 }}>
                            623-473-7433
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default IntegrationCompass;
