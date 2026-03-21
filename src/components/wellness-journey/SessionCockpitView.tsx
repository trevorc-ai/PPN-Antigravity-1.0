/**
 * SessionCockpitView — Phase 2 live session cockpit presenter.
 *
 * Extracted from DosingSessionPhase.tsx (lines 1552-1827 + companion overlay
 * lines 1917-1944) as part of the Stabilisation Sprint Track 2 component split.
 * Renders:
 *   - Panel A: Session Vitals Trend chart (collapsible)
 *   - Panel B: Live Session Timeline with filter toggles (collapsible)
 *   - Panel C: Session Update form — affect / responsiveness / comfort /
 *              vitals / structured note + Save button (collapsible)
 *   - Quick-action chip row (P.Spoke · Music · Decision + Companion + End Session)
 *   - Companion overlay (full-screen patient-facing ambient video + feeling grid)
 *
 * Also contains the CompanionButtonGrid and CompanionVideo sub-components that
 * were previously defined at file-level in DosingSessionPhase.tsx.
 *
 * This component owns no state. All data and callbacks arrive via props from
 * the TreatmentPhase orchestrator.
 *
 * @see DosingSessionPhase.tsx   (orchestrator)
 * @see SessionPrepView.tsx      (pre-session + action grid)
 */

import React, { useRef } from 'react';
import {
    Activity, Clock, ChevronDown, X, Save, ClipboardList, Sparkles, ArrowRight, Pill,
} from 'lucide-react';
import { LiveSessionTimeline, QUICK_ACTIONS } from './LiveSessionTimeline';
import { SessionVitalsTrendChart, VitalsSnapshot, SessionEventPin } from './SessionVitalsTrendChart';
import { WellnessFormId } from './WellnessFormRouter';
import { createTimelineEvent } from '../../services/clinicalLog';

// ── Companion sub-components (previously file-level in DosingSessionPhase.tsx) ─

const COMPANION_FEELINGS = [
    { id: 'blissful', label: 'Blissful', rest: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300/80', glow: 'bg-emerald-500/60 border-emerald-400/70 text-emerald-200' },
    { id: 'peaceful', label: 'Peaceful', rest: 'bg-teal-500/15 border-teal-500/30 text-teal-300/80', glow: 'bg-teal-500/60 border-teal-400/70 text-teal-200' },
    { id: 'grounded', label: 'Grounded / Safe', rest: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300/80', glow: 'bg-cyan-500/60 border-cyan-400/70 text-cyan-200' },
    { id: 'connected', label: 'Connected', rest: 'bg-sky-500/15 border-sky-500/30 text-sky-300/80', glow: 'bg-sky-500/60 border-sky-400/70 text-sky-200' },
    { id: 'euphoric', label: 'Euphoric', rest: 'bg-violet-500/15 border-violet-500/30 text-violet-300/80', glow: 'bg-violet-500/60 border-violet-400/70 text-violet-200' },
    { id: 'drifting', label: 'Drifting / Floating', rest: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300/80', glow: 'bg-indigo-500/60 border-indigo-400/70 text-indigo-200' },
    { id: 'curious', label: 'Curious', rest: 'bg-purple-500/15 border-purple-500/30 text-purple-300/80', glow: 'bg-purple-500/60 border-purple-400/70 text-purple-200' },
    { id: 'open', label: 'Open / Surrendered', rest: 'bg-fuchsia-500/15 border-fuchsia-500/30 text-fuchsia-300/80', glow: 'bg-fuchsia-500/60 border-fuchsia-400/70 text-fuchsia-200' },
    { id: 'emotional', label: 'Emotional / Crying', rest: 'bg-blue-500/15 border-blue-500/30 text-blue-300/80', glow: 'bg-blue-500/60 border-blue-400/70 text-blue-200' },
    { id: 'confused', label: 'Confused', rest: 'bg-slate-500/15 border-slate-500/30 text-slate-300/80', glow: 'bg-slate-500/60 border-slate-400/70 text-slate-200' },
    { id: 'anxious', label: 'Anxious', rest: 'bg-amber-500/15 border-amber-500/30 text-amber-300/80', glow: 'bg-amber-500/60 border-amber-400/70 text-amber-200' },
    { id: 'overwhelmed', label: 'Overwhelmed', rest: 'bg-orange-500/15 border-orange-500/30 text-orange-300/80', glow: 'bg-orange-500/60 border-orange-400/70 text-orange-200' },
    { id: 'tense', label: 'Tense / Resistance', rest: 'bg-rose-500/15 border-rose-500/30 text-rose-300/80', glow: 'bg-rose-500/60 border-rose-400/70 text-rose-200' },
    { id: 'fearful', label: 'Fearful', rest: 'bg-red-600/15 border-red-600/30 text-red-300/80', glow: 'bg-red-600/60 border-red-500/70 text-red-200' },
    { id: 'nauseous', label: 'Nauseous', rest: 'bg-yellow-700/15 border-yellow-700/30 text-yellow-300/80', glow: 'bg-yellow-600/60 border-yellow-500/70 text-yellow-200' },
    { id: 'need_support', label: 'Need Support', rest: 'bg-pink-600/20 border-pink-500/40 text-pink-300/80 ring-1 ring-pink-500/20', glow: 'bg-pink-500/65 border-pink-400/70 text-pink-200 ring-1 ring-pink-400/50' },
];

const CompanionButtonGrid: React.FC<{ sessionId: string }> = ({ sessionId }) => {
    const [litId, setLitId] = React.useState<string | null>(null);
    const litTimer = useRef<NodeJS.Timeout | null>(null);

    const handleTap = (id: string) => {
        const key = `companion_logs_${sessionId}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push({ timestamp: new Date().toISOString(), feeling: id });
        localStorage.setItem(key, JSON.stringify(existing));

        if (litTimer.current) clearTimeout(litTimer.current);
        setLitId(id);
        litTimer.current = setTimeout(() => setLitId(null), 160);
    };

    return (
        <div className="relative z-20 shrink-0 w-full border-t border-white/8 bg-black/50 backdrop-blur-sm px-2 pb-3 pt-2">
            <div className="grid grid-cols-4 gap-1 w-full">
                {COMPANION_FEELINGS.map(f => {
                    const isLit = litId === f.id;
                    return (
                        <button
                            key={f.id}
                            onClick={() => handleTap(f.id)}
                            className={[
                                'backdrop-blur-md border rounded-lg',
                                'px-1 py-1.5',
                                'min-h-[36px]',
                                'font-semibold tracking-wide text-center leading-tight',
                                'shadow-sm select-none',
                                isLit
                                    ? `${f.glow} transition-none scale-[1.04] shadow-lg`
                                    : `${f.rest} transition-[background-color,border-color,box-shadow] duration-[1800ms] ease-out active:scale-95`,
                            ].join(' ')}
                            style={{ fontSize: 'clamp(8px, 2.2vw, 11px)' }}
                            aria-label={`Log feeling: ${f.label}`}
                        >
                            {f.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const CompanionVideo: React.FC = () => (
    <div className="relative flex-1 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 z-10" />
        <div className="absolute top-5 left-0 right-0 text-center z-20">
            <p className="text-white/20 text-xs tracking-[0.2em]">Tap to quietly log your state</p>
        </div>
        <video
            src="/internal/admin_uploads/video/spherecules.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-contain opacity-90"
        />
    </div>
);

// ── Types ─────────────────────────────────────────────────────────────────────

interface SessionUpdateEntry {
    timestamp: string;
    elapsed: string;
    affect: string;
    responsiveness: string;
    comfort: string;
    note: string;
    hr: string;
    bp: string;
    elapsedSec?: number;
    tempF?: number;
}

export interface SessionCockpitViewProps {
    journey: any;
    elapsedTime: string;
    activePanel: 'graph' | 'timeline' | 'update';
    setActivePanel: React.Dispatch<React.SetStateAction<'graph' | 'timeline' | 'update'>>;
    sessionUpdatePanelRef: React.RefObject<HTMLDivElement>;
    updateLog: SessionUpdateEntry[];
    vitalsChartData: VitalsSnapshot[];
    eventLog: SessionEventPin[];
    sessionDurationSec: number;
    chartVisible: { hr: boolean; bp: boolean; temp: boolean; events: boolean };
    setChartVisible: React.Dispatch<React.SetStateAction<{ hr: boolean; bp: boolean; temp: boolean; events: boolean }>>;
    showCompanion: boolean;
    setShowCompanion: (v: boolean) => void;
    updateAffect: string;
    setUpdateAffect: (v: string) => void;
    updateResponsiveness: string;
    setUpdateResponsiveness: (v: string) => void;
    updateComfort: string;
    setUpdateComfort: (v: string) => void;
    updateNote: string;
    setUpdateNote: (v: string) => void;
    updateHR: string;
    setUpdateHR: (v: string) => void;
    updateBPSys: string;
    setUpdateBPSys: (v: string) => void;
    updateBPDia: string;
    setUpdateBPDia: (v: string) => void;
    liveVitals: { hr: number; bp: string; spo2: number; hrv: number };
    sessionStartMs: number | undefined;
    config: { enabledFeatures: string[] };
    patientMeds?: string[];
    onOpenForm: (formId: WellnessFormId) => void;
    onSaveUpdate: () => Promise<void>;
    onEndSession: () => Promise<void>;
    openAndScrollToUpdatePanel: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

// Derive the most recent timeline/update entry for collapsed preview
function getLastEventPreview(
    updateLog: SessionUpdateEntry[],
    eventLog: SessionEventPin[],
): string | null {
    const lastUpdate = updateLog[updateLog.length - 1];
    const lastEvent = eventLog[eventLog.length - 1];
    if (!lastUpdate && !lastEvent) return null;
    const updateElapsed = lastUpdate?.elapsedSec ?? -1;
    const eventElapsed = lastEvent?.elapsedSec ?? -1;
    if (eventElapsed >= updateElapsed && lastEvent) {
        const mins = Math.floor(eventElapsed / 60).toString().padStart(2, '0');
        const secs = (eventElapsed % 60).toString().padStart(2, '0');
        return `T+${mins}:${secs} · ${lastEvent.label}`;
    }
    if (lastUpdate) {
        const parts = [lastUpdate.elapsed, lastUpdate.affect, lastUpdate.note]
            .filter(Boolean).join(' · ');
        return parts || null;
    }
    return null;
}

export const SessionCockpitView: React.FC<SessionCockpitViewProps> = ({
    journey,
    elapsedTime,
    activePanel,
    setActivePanel,
    sessionUpdatePanelRef,
    updateLog,
    vitalsChartData,
    eventLog,
    sessionDurationSec,
    chartVisible,
    setChartVisible,
    showCompanion,
    setShowCompanion,
    updateAffect, setUpdateAffect,
    updateResponsiveness, setUpdateResponsiveness,
    updateComfort, setUpdateComfort,
    updateNote, setUpdateNote,
    updateHR, setUpdateHR,
    updateBPSys, setUpdateBPSys,
    updateBPDia, setUpdateBPDia,
    sessionStartMs,
    config,
    patientMeds,
    onOpenForm,
    onSaveUpdate,
    onEndSession,
    openAndScrollToUpdatePanel,
}) => {
    const lastEventPreview = getLastEventPreview(updateLog, eventLog);

    return (
    <>
        {/* ══ THREE-PANEL COCKPIT ══════════════════════════════════════════════ */}
        <div className="space-y-1">

            {/* ── Medications slim strip ── */}
            {patientMeds && patientMeds.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap px-4 py-3 rounded-2xl bg-slate-900/50 border border-slate-700/40">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 shrink-0">Medications</span>
                    {patientMeds.map((med, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs font-semibold">
                            <Pill className="w-3 h-3 text-slate-500" /> {med}
                        </span>
                    ))}
                </div>
            )}

            {/* ── Panel A: Session Vitals Graph ── */}
            <div className="rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-900/60">
                <button
                    onClick={() => setActivePanel(p => (p === 'graph' ? 'timeline' : 'graph') as 'graph' | 'timeline' | 'update')}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/30 transition-colors"
                    aria-expanded={activePanel === 'graph'}
                    aria-controls="cockpit-graph"
                >
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                        <span className="text-sm font-bold text-[#A8B5D1] uppercase tracking-widest">Session Vitals Trend</span>
                    </div>
                    <ChevronDown
                        className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${activePanel === 'graph' ? '' : '-rotate-90'}`}
                        aria-hidden="true"
                    />
                </button>
                {/* Animated expand — fixed height matches Panel C so action buttons never move */}
                <div
                    id="cockpit-graph"
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        activePanel === 'graph' ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="border-t border-slate-700/40 h-[380px] overflow-y-auto">
                        {config.enabledFeatures.includes('session-vitals') ? (
                            <div className="h-full">
                                <SessionVitalsTrendChart
                                    sessionId={journey.sessionId || journey.session?.sessionNumber?.toString() || '1'}
                                    substance={journey.session?.substance}
                                    onThresholdViolation={(vital, value) => {
                                        console.warn(`[SessionCockpit] Vitals threshold: ${vital}=${value}`);
                                    }}
                                    data={vitalsChartData}
                                    events={eventLog}
                                    sessionDurationSec={sessionDurationSec}
                                    onVisibilityChange={v => setChartVisible(v as { hr: boolean; bp: boolean; temp: boolean; events: boolean })}
                                    hideHeader={true}
                                    hideLegend={true}
                                />
                            </div>
                        ) : (
                            <p className="text-center text-slate-600 text-sm py-6">Vitals chart not enabled.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Panel B: Live Session Timeline ── */}
            <div className="rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-900/60">
                <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setActivePanel(p => (p === 'timeline' ? 'graph' : 'timeline') as 'graph' | 'timeline' | 'update')}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActivePanel(p => (p === 'timeline' ? 'graph' : 'timeline') as 'graph' | 'timeline' | 'update'); } }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/30 transition-colors cursor-pointer select-none"
                    aria-expanded={activePanel === 'timeline'}
                    aria-controls="cockpit-timeline"
                >
                    <div className="flex items-center gap-2 min-w-0">
                        <Clock className="w-4 h-4 text-indigo-400 shrink-0" aria-hidden="true" />
                        <span className="text-sm font-bold text-[#A8B5D1] uppercase tracking-widest shrink-0">Live Session Timeline</span>
                        <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        {/* Last-event preview when collapsed */}
                        {activePanel !== 'timeline' && lastEventPreview && (
                            <span className="text-[11px] text-slate-500 truncate ml-1 hidden sm:block" aria-label="Most recent event">
                                {lastEventPreview}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {(['hr', 'bp', 'temp', 'events'] as const).map(key => (
                            <button
                                key={key}
                                onClick={e => { e.stopPropagation(); setChartVisible(prev => ({ ...prev, [key]: !prev[key] })); }}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors border ${chartVisible[key]
                                    ? key === 'hr' ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                                        : key === 'bp' ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                                            : key === 'temp' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                                : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                                    : 'bg-slate-800/40 border-slate-700/40 text-slate-600 line-through'
                                    }`}
                                aria-pressed={chartVisible[key]}
                                aria-label={`Toggle ${key} entries`}
                            >{key}</button>
                        ))}
                        <ChevronDown
                            className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${activePanel === 'timeline' ? '' : '-rotate-90'}`}
                            aria-hidden="true"
                        />
                    </div>
                </div>
                {/* Animated expand — fixed height matches Panel C so action buttons never move */}
                <div
                    id="cockpit-timeline"
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        activePanel === 'timeline' ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="border-t border-slate-700/40 h-[380px]">
                        <LiveSessionTimeline
                            sessionId={journey.sessionId || journey.session?.sessionNumber?.toString() || '1'}
                            active={true}
                            visible={chartVisible}
                            sessionStartMs={sessionStartMs}
                            hideHeader={true}
                            hideActions={true}
                            scrollToBottom={true}
                        />
                    </div>
                </div>
            </div>

            {/* ── Panel C: Session Update ── */}
            <div ref={sessionUpdatePanelRef} className="rounded-2xl overflow-hidden border border-emerald-900/40 bg-slate-900/60">
                <button
                    onClick={() => setActivePanel(p => (p === 'update' ? 'graph' : 'update') as 'graph' | 'timeline' | 'update')}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-emerald-950/20 transition-colors"
                    aria-expanded={activePanel === 'update'}
                    aria-controls="cockpit-update"
                >
                    <div className="flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                        <span className="text-sm font-bold text-emerald-300/80 uppercase tracking-widest">Session Update</span>
                        {activePanel === 'update' && (
                            <span className="text-[10px] text-slate-500">T+{elapsedTime} · {new Date().toLocaleTimeString()}</span>
                        )}
                    </div>
                    <ChevronDown
                        className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${activePanel === 'update' ? '' : '-rotate-90'}`}
                        aria-hidden="true"
                    />
                </button>
                {/* Animated expand */}
                <div
                    id="cockpit-update"
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        activePanel === 'update' ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                <div className="border-t border-emerald-900/30 p-4 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Patient Affect</label>
                                <select value={updateAffect} onChange={e => setUpdateAffect(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-200 text-sm focus:outline-none transition-all">
                                    <option value="">— Select —</option>
                                    <option>Calm</option><option>Anxious</option><option>Euphoric</option>
                                    <option>Dissociative</option><option>Tearful</option><option>Processing (internal)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Responsiveness</label>
                                <select value={updateResponsiveness} onChange={e => setUpdateResponsiveness(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-200 text-sm focus:outline-none transition-all">
                                    <option value="">— Select —</option>
                                    <option>Fully responsive</option><option>Partially responsive</option>
                                    <option>Eyes closed, calm</option><option>Eyes closed, distressed</option>
                                    <option>Unresponsive (monitor)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Physical Comfort</label>
                                <select value={updateComfort} onChange={e => setUpdateComfort(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-200 text-sm focus:outline-none transition-all">
                                    <option value="">— Select —</option>
                                    <option>Normal, no complaints</option><option>Restless</option>
                                    <option>Nausea reported</option><option>Requesting blanket</option>
                                    <option>Position adjusted</option><option>Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">HR (bpm), optional</label>
                                <input type="number" min="30" max="220" placeholder="e.g. 88" value={updateHR}
                                    onChange={e => { const raw = e.target.value; if (raw === '') { setUpdateHR(''); return; } const v = parseInt(raw, 10); if (!isNaN(v) && v > 220) return; setUpdateHR(raw); }}
                                    onBlur={e => { const v = parseInt(e.target.value, 10); if (!isNaN(v) && v < 30) setUpdateHR('30'); }}
                                    className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-200 text-sm placeholder-slate-600 focus:outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Systolic, optional</label>
                                <input type="number" min="60" max="250" placeholder="e.g. 120" value={updateBPSys}
                                    onChange={e => { const raw = e.target.value; if (raw === '') { setUpdateBPSys(''); return; } const v = parseInt(raw, 10); if (!isNaN(v) && v > 250) return; setUpdateBPSys(raw); }}
                                    onBlur={e => { const v = parseInt(e.target.value, 10); if (!isNaN(v) && v < 60) setUpdateBPSys('60'); }}
                                    className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-200 text-sm placeholder-slate-600 focus:outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Diastolic, optional</label>
                                <input type="number" min="40" max="150" placeholder="e.g. 80" value={updateBPDia}
                                    onChange={e => { const raw = e.target.value; if (raw === '') { setUpdateBPDia(''); return; } const v = parseInt(raw, 10); if (!isNaN(v) && v > 150) return; setUpdateBPDia(raw); }}
                                    onBlur={e => { const v = parseInt(e.target.value, 10); if (!isNaN(v) && v < 40) setUpdateBPDia('40'); }}
                                    className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-200 text-sm placeholder-slate-600 focus:outline-none transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Session Note, optional</label>
                            {/* ZERO-PHI POLICY: Free-text is not permitted. Use structured pre-approved notes only. */}
                            <select
                                value={updateNote}
                                onChange={e => setUpdateNote(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-200 text-sm focus:outline-none transition-all appearance-none"
                            >
                                <option value="">Select a note (optional)…</option>
                                <option value="Patient appears calm and stable">Patient appears calm and stable</option>
                                <option value="Patient requested brief pause">Patient requested brief pause in session</option>
                                <option value="Monitoring closely, no intervention required">Monitoring closely, no intervention required</option>
                                <option value="Verbal grounding administered">Verbal grounding administered</option>
                                <option value="Music adjusted per patient preference">Music adjusted per patient preference</option>
                                <option value="Position change offered">Position change offered</option>
                                <option value="Environmental factors adjusted">Environmental factors adjusted</option>
                                <option value="Consulting with presiding physician">Consulting with presiding physician</option>
                                <option value="Symptoms escalating, increased monitoring">Symptoms escalating, increased monitoring</option>
                                <option value="Post-dose observation, no concerns">Post-dose observation, no concerns</option>
                            </select>
                            <p className="text-xs text-slate-600 mt-1 italic">Affect, responsiveness, and vitals are persisted to the clinical record.</p>
                        </div>
                        <button
                            onClick={onSaveUpdate}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition-all active:scale-95"
                        >
                            <Save className="w-4 h-4" /> Save Update
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Quick-action chip row ── */}
            <div className="flex items-center justify-between gap-2 pt-1 sticky bottom-0 bg-[#0a1628] z-10 pb-2">
                {/* Left: event chips */}
                <div className="flex items-center gap-2 flex-wrap">
                {QUICK_ACTIONS.map(action => {
                    const IconComp = action.icon;
                    return (
                        <button
                            key={action.type}
                            onClick={() => {
                                const sid = journey.sessionId ?? journey.session?.sessionId;
                                if (sid) {
                                    createTimelineEvent({
                                        session_id: sid,
                                        event_timestamp: new Date().toISOString(),
                                        event_type_code: action.type as import('../../services/refFlowEventTypes').FlowEventTypeCode,
                                        metadata: { event_description: action.desc },
                                    }).catch(err => console.warn('[chips] write failed:', err));
                                }
                                openAndScrollToUpdatePanel();
                            }}
                            aria-label={`Log: ${action.label}`}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold min-h-[36px] transition-colors active:scale-95 ${action.color}`}
                        >
                            <IconComp className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            {action.label}
                        </button>
                    );
                })}
                </div>
                {/* Right: End session — visually separated */}
                <button
                    onClick={onEndSession}
                    className="px-5 py-2 bg-[#0A1F24] hover:bg-[#0E292E] text-[#6E9CA8] hover:text-[#A3C7D2] font-semibold rounded-xl border border-[#14343B] transition-colors uppercase tracking-[0.15em] text-xs flex items-center gap-2 group shrink-0"
                >
                    End Dosing Session
                    <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>
        </div>

        {/* ── Companion Overlay: fixed layer, timer stays running ──────────── */}
        {showCompanion && (
            <div className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden selection:bg-transparent">
                <button
                    onClick={() => setShowCompanion(false)}
                    className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/8 border border-white/15 text-white/35 hover:bg-white/15 hover:text-white/60 backdrop-blur-md transition-all"
                    aria-label="Return to session"
                >
                    <X className="w-4 h-4" />
                </button>
                <div className="absolute top-4 right-16 z-50 flex items-center h-10">
                    <span className="text-[10px] font-bold tracking-widest text-white/25 uppercase">Return to session</span>
                </div>
                <div className="flex flex-col flex-1 min-h-0 pt-14">
                    <CompanionVideo />
                    <CompanionButtonGrid sessionId={journey.sessionId || 'demo-1'} />
                </div>
            </div>
        )}
    </>
    );
};
