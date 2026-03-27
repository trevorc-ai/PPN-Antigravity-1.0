/**
 * DosingSessionPhase.tsx — Phase 2 orchestrator.
 *
 * Stabilisation Sprint Track 2 — Component Split.
 *
 * This file is now a THIN ORCHESTRATOR. It owns all React state and side-effect
 * hooks for the Phase 2 dosing session and delegates rendering to four
 * presentational child components:
 *
 *   SessionCloseoutView  — post-session closeout (mode === 'post')
 *   SessionHUD           — sticky timer + vitals strip (pre + live)
 *   SessionPrepView      — step cards, contraindication alerts, action grid
 *   SessionCockpitView   — 3-panel live cockpit + companion overlay
 *
 * RULE: Never add render JSX to this file. All UI lives in the child components.
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Heart } from 'lucide-react';
import { runContraindicationEngine } from '../../services/contraindicationEngine';
import { WellnessFormId } from './WellnessFormRouter';
import { SessionVitalsTrendChart, VitalsSnapshot, SessionEventPin } from './SessionVitalsTrendChart';
import { useToast } from '../../contexts/ToastContext';
import { useActiveSessionsContext } from '../../contexts/ActiveSessionsContext';
import { useProtocol } from '../../contexts/ProtocolContext';
import { createSessionVital, createTimelineEvent, endDosingSession, getSessionVitals } from '../../services/clinicalLog';
import { SessionCloseoutView } from './SessionCloseoutView';
import { SessionHUD } from './SessionHUD';
import { SessionPrepView } from './SessionPrepView';
import { SessionCockpitView } from './SessionCockpitView';


// ── Error Boundary: catches render crashes in Phase 2 sub-trees ────────────────
// Prevents the entire WellnessJourney page from going blank on a sub-component error.
interface EBProps { onReset: () => void; children: React.ReactNode; }
interface EBState { hasError: boolean; error: string; }
export class Phase2ErrorBoundary extends React.Component<EBProps, EBState> {
    public state: EBState = { hasError: false, error: '' };

    constructor(props: EBProps) {
        super(props);
        this.handleReset = this.handleReset.bind(this);
    }

    public static getDerivedStateFromError(err: Error): EBState {
        return { hasError: true, error: err?.message ?? 'Unknown error' };
    }
    public componentDidCatch(err: Error, info: React.ErrorInfo) {
        console.error('[Phase2ErrorBoundary]', err, info);
    }
    public handleReset() {
        this.setState({ hasError: false, error: '' });
        this.props.onReset();
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="rounded-2xl border border-red-800/50 bg-red-950/20 p-8 text-center space-y-4">
                    <p className="text-lg font-black text-red-300">Session view error, the session data was preserved.</p>
                    <p className="text-sm text-slate-400 font-mono">{this.state.error}</p>
                    <button
                        onClick={this.handleReset}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors"
                    >
                        Reload Phase 2 View
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}


interface TreatmentPhaseProps {
    journey: any;
    completedForms: Set<string>;
    onOpenForm: (formId: WellnessFormId) => void;
    onCompletePhase: () => void;
}

type SessionMode = 'pre' | 'live' | 'post';

// ── Source URL mapping for regulatory citations ───────────────────────────────
const SOURCE_LINKS: Array<{ pattern: RegExp; label: string; url: string }> = [
    {
        pattern: /OHA OAR 333-333/i,
        label: 'OHA OAR 333-333 (Oregon Psilocybin Rules)',
        url: 'https://www.oregon.gov/oha/ph/preventionwellness/substanceuse/psilocybinservices/pages/rules.aspx',
    },
    {
        pattern: /MAPS Protocol S2/i,
        label: 'MAPS Phase 3 Protocol Manual (§8)',
        url: 'https://maps.org/wp-content/uploads/2023/01/MAPP2_Protocol_v15_FINAL.pdf',
    },
    {
        pattern: /AHA Hypertension/i,
        label: 'AHA Hypertension Guidelines 2023',
        url: 'https://www.ahajournals.org/doi/10.1161/HYP.0000000000000065',
    },
    {
        pattern: /FDA Drug Interaction/i,
        label: 'FDA Drug Interaction Guidance',
        url: 'https://www.fda.gov/drugs/drug-interactions-labeling/drug-development-and-drug-interactions-table-substrates-inhibitors-and-inducers',
    },
    {
        pattern: /Joint Commission/i,
        label: 'Joint Commission NPSG 15.01.01 (Suicide Risk)',
        url: 'https://www.jointcommission.org/standards/national-patient-safety-goals/',
    },
    {
        pattern: /Oregon Ballot Measure 109/i,
        label: 'Oregon Ballot Measure 109 (Psilocybin Services Act)',
        url: 'https://www.oregon.gov/oha/ph/preventionwellness/substanceuse/psilocybinservices/pages/index.aspx',
    },
    {
        pattern: /DSM-5/i,
        label: 'DSM-5 Diagnostic Criteria (APA)',
        url: 'https://www.psychiatry.org/psychiatrists/practice/dsm',
    },
    {
        pattern: /Kroenke.*2001/i,
        label: 'Kroenke & Spitzer (2001), PHQ-9',
        url: 'https://pubmed.ncbi.nlm.nih.gov/11556941/',
    },
    {
        pattern: /Spitzer.*2006/i,
        label: 'Spitzer et al. (2006), GAD-7',
        url: 'https://pubmed.ncbi.nlm.nih.gov/16717171/',
    },
    {
        pattern: /Weathers.*2013/i,
        label: 'Weathers et al. (2013), PCL-5 / CAPS-5',
        url: 'https://www.ptsd.va.gov/professional/assessment/adult-sr/ptsd-checklist.asp',
    },
];

/** Parse a regulatoryBasis string into clickable {label, url} pairs */
function getRegulatoryLinks(basis: string): Array<{ label: string; url: string }> {
    const links: Array<{ label: string; url: string }> = [];
    const seen = new Set<string>();
    for (const entry of SOURCE_LINKS) {
        if (entry.pattern.test(basis) && !seen.has(entry.url)) {
            links.push({ label: entry.label, url: entry.url });
            seen.add(entry.url);
        }
    }
    return links;
}

// Emotional states, dark-room safe palette (matches PatientCompanionPage)
// rest: dim ~15% opacity bg + muted *-300/80 text (eye-safe, WCAG AA on black)
// glow: ~60% opacity fill, bright enough to confirm tap without harshness
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

/**
 * CompanionButtonGrid, dark-room 4×4 feeling grid with instant-on / slow-fade glow.
 * Instant-on: litId set on click → transition-none snaps to glow.
 * Slow fade: litId cleared after 160ms → CSS duration-[1800ms] fades back.
 */
const CompanionButtonGrid: React.FC<{ sessionId: string }> = ({ sessionId }) => {
    const [litId, setLitId] = useState<string | null>(null);
    const litTimer = useRef<NodeJS.Timeout | null>(null);

    const handleTap = (id: string) => {
        const key = `companion_logs_${sessionId}`;
        const feeling = COMPANION_FEELINGS.find(f => f.id === id)?.label ?? id;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push({ timestamp: new Date().toISOString(), feeling: id });
        localStorage.setItem(key, JSON.stringify(existing));

        // Timeline: patient_observation has no ref_flow_event_types code; skip DB write.

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

/**
 * CompanionVideo, full-screen ambient video for tablet/mobile.
 *
 * The landscape 16:9 video is rotated -90° to display as portrait.
 * ResizeObserver measures the container and swaps width↔height on the
 * video element before rotating, so the full video frame is always visible
 * with no cropping and no letterboxing.
 *
 * Fallback (before first measurement): object-contain, no rotation.
 */
const CompanionVideo: React.FC = () => (
    <div
        className="relative flex-1 overflow-hidden pointer-events-none"
        aria-hidden="true"
    >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 z-10" />
        <div className="absolute top-5 left-0 right-0 text-center z-20">
            <p className="text-white/20 text-xs md:text-sm tracking-[0.2em]">
                Tap to quietly log your state
            </p>
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

export const TreatmentPhase: React.FC<TreatmentPhaseProps> = ({ journey, completedForms, onOpenForm, onCompletePhase }) => {

    const { addToast } = useToast();
    const { config } = useProtocol();
    const { refresh: refreshActiveSessions, sessions: activeSessions } = useActiveSessionsContext();

    // WO-QA: Force-close confirmation state for stuck sessions
    const [forceCloseConfirm, setForceCloseConfirm] = useState(false);
    const SESSION_KEY = `ppn_session_mode_${journey.session?.sessionId ?? journey.sessionId ?? 'demo'}`;
    const SESSION_START_KEY = `ppn_session_start_${journey.session?.sessionId ?? journey.sessionId ?? 'demo'}`;

    // Bump this counter whenever we want to force a contraindication re-evaluation
    const [contraindicationKey, setContraindicationKey] = useState(0);

    // WO-528: declare eventLog + getElapsedSec BEFORE any useEffect that references them
    const [eventLog, setEventLog] = useState<SessionEventPin[]>([]);

    // WO-576 Sub-task E: chart series visibility state — lifted here so LiveSessionTimeline
    // receives the same state and filters its ledger entries to match the chart.
    const [chartVisible, setChartVisible] = useState<{ hr: boolean; bp: boolean; temp: boolean; events: boolean }>({
        hr: true, bp: true, temp: true, events: true,
    });

    // Derive sessionStartMs from localStorage for T+ timer in LiveSessionTimeline
    const sessionStartMs = useMemo(() => {
        try {
            const raw = localStorage.getItem(SESSION_START_KEY);
            return raw ? Number(raw) : undefined;
        } catch { return undefined; }
    }, [SESSION_START_KEY]);

    // Helper: returns elapsed seconds since session start. Safe to call at any time.
    const getElapsedSec = useCallback((): number => {
        try {
            const raw = localStorage.getItem(SESSION_START_KEY);
            if (!raw) return 0;
            return Math.round((Date.now() - Number(raw)) / 1000);
        } catch { return 0; }
    }, [SESSION_START_KEY]);

    // WO-559: Ref flag set true when practitioner taps "Additional Dose" during a live session.
    // handleDosingUpdated reads this to emit additional_dose instead of dose_admin.
    const isLiveRedoseRef = useRef(false);

    // WO-641: Ref for the Session Update panel — used to scroll into view when a chip is tapped
    const sessionUpdatePanelRef = useRef<HTMLDivElement>(null);

    // WO-641: Helper — expand Panel C and scroll it into view smoothly
    const openAndScrollToUpdatePanel = useCallback(() => {
        setActivePanel('update');
        // One tick delay so the panel expands before we scroll to it
        setTimeout(() => {
            sessionUpdatePanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
    }, []);

    // Re-evaluate contraindications when any dosing field changes
    useEffect(() => {
        const bump = () => setContraindicationKey(k => k + 1);
        const handleStorage = (e: StorageEvent) => {
            // BUG FIX (Bug 1.4): 'ppn_patient_medications_names' is the authoritative key
            // written by Phase 1 StructuredSafetyCheckForm (WO-638). It was absent from
            // this watch list, so Phase 2's medication header never refreshed after Phase 1
            // safety screen was saved. Adding it here triggers a contraindication re-eval
            // and a patientMeds useMemo recompute whenever Phase 1 meds change.
            if (e.key === 'ppn_dosing_protocol'
                || e.key === 'mock_patient_medications_names'
                || e.key === 'ppn_patient_medications_names'  // FIXED: was missing
            ) bump();
        };

        // ppn:dosing-updated → fires on every field change in updateField().
        // Purpose: re-evaluate contraindication warnings only. Never stamp an event pin
        // here — the pin fires from ppn:dosing-saved (commit event) below.
        const handleDosingUpdated = () => bump();

        // ppn:safety-updated → fires from WellnessFormRouter when Phase 1
        // StructuredSafetyCheckForm saves. window.storage doesn't fire same-tab,
        // so we use a custom event to trigger immediate medication header refresh.
        // This is the fix for Bug 1.4 (medications not appearing in Phase 2 header).
        const handleSafetyUpdated = () => bump();

        // ppn:dosing-saved → fires ONCE when the practitioner clicks Save & Continue / Save & Exit.
        // This is the correct moment to stamp the chart pin and timeline entry.
        const handleDosingSaved = () => {
            bump();
            const isRedose = isLiveRedoseRef.current;
            isLiveRedoseRef.current = false; // clear flag regardless
            const elSec = getElapsedSec();
            const eventType = isRedose ? 'additional_dose' : 'dose_admin';
            const eventLabel = isRedose ? 'Additional Dose' : 'Dose Admin';

            // 1. Stamp chart event pin
            setEventLog(prev => [
                ...prev,
                {
                    id: `dose-${Date.now()}`,
                    elapsedSec: elSec,
                    type: eventType,
                    label: eventLabel,
                } satisfies SessionEventPin,
            ]);

            // 2. Notify LiveSessionTimeline via ppn:dose-registered so it can add an
            //    optimistic entry immediately (before the next 30-sec DB poll).
            //    WO-694 BUG-04: pass dosingDesc (rich detail string) as label for additional dose,
            //    not the bare 'Additional Dose' eventLabel that showed no details in the timeline.
            const dispatchLabel = isRedose
                // dosingDesc is built below — capture it first (lazy build via closure).
                // For initial dose_admin, keep eventLabel (detail already in handleStartSession).
                ? undefined  // placeholder — set after dosingDesc is computed below
                : eventLabel;
            window.dispatchEvent(new CustomEvent('ppn:dose-registered', {
                detail: { sessionId: journey.sessionId ?? journey.session?.sessionId, type: eventType, label: dispatchLabel ?? eventLabel, elapsedSec: elSec }
            }));

            // 3. Persist to log_session_timeline_events if we have a real session UUID
            if (isRedose) {
                const UUID_RE_D = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                const sid = (journey.sessionId ?? journey.session?.sessionId) as string | undefined;
                if (sid && UUID_RE_D.test(sid)) {
                    const eH = Math.floor(elSec / 3600).toString().padStart(2, '0');
                    const eM = Math.floor((elSec % 3600) / 60).toString().padStart(2, '0');
                    const eS = Math.floor(elSec % 60).toString().padStart(2, '0');

                    // P2 Ledger Gap Fix: read substance/dosage from ppn_dosing_protocol localStorage
                    // (written by DosingProtocolForm at save time, always fresh at this point).
                    let dosingDesc = `Additional dose administered at T+${eH}:${eM}:${eS}`;
                    try {
                        const cached = JSON.parse(localStorage.getItem('ppn_dosing_protocol') || '{}');
                        const parts: string[] = ['Additional Dose'];
                        if (cached.dosage_amount && cached.dosage_unit)
                            parts.push(`${cached.dosage_amount}${cached.dosage_unit}`);
                        else if (cached.dosage_amount)
                            parts.push(`${cached.dosage_amount}`);
                        if (cached.substance_name) parts.push(cached.substance_name);
                        if (cached.route_of_administration) parts.push(cached.route_of_administration);
                        parts.push(`T+${eH}:${eM}:${eS}`);
                        if (parts.length > 1) dosingDesc = parts.join(' · ');
                    } catch { /* localStorage unavailable, keep default */ }

                    // WO-694 BUG-04: re-dispatch with the rich dosingDesc label now that we have it.
                    // The earlier dispatch above used a placeholder — update the timeline entry.
                    window.dispatchEvent(new CustomEvent('ppn:dose-registered', {
                        detail: { sessionId: sid, type: eventType, label: dosingDesc, elapsedSec: elSec }
                    }));

                    createTimelineEvent({
                        session_id: sid,
                        event_timestamp: new Date().toISOString(),
                        event_type_code: 'additional_dose' as any,
                        metadata: { event_description: dosingDesc },
                    }).catch(err => console.warn('[WO-559] additional_dose timeline write failed:', err));
                }
            }
        };

        window.addEventListener('storage', handleStorage);
        window.addEventListener('ppn:dosing-updated', handleDosingUpdated);
        window.addEventListener('ppn:safety-updated', handleSafetyUpdated); // Bug 1.4 fix
        window.addEventListener('ppn:dosing-saved', handleDosingSaved);
        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('ppn:dosing-updated', handleDosingUpdated);
            window.removeEventListener('ppn:safety-updated', handleSafetyUpdated); // Bug 1.4 fix
            window.removeEventListener('ppn:dosing-saved', handleDosingSaved);
        };
        // getElapsedSec is stable (useCallback), safe to include
    }, [getElapsedSec, journey]);


    // Mirror every LiveSessionTimeline quick-action onto the chart as an event pin
    useEffect(() => {
        const handleSessionEvent = (e: Event) => {
            const { type, label } = (e as CustomEvent).detail ?? {};
            if (!type) return;
            setEventLog(prev => [
                ...prev,
                {
                    id: `tl-${Date.now()}`,
                    elapsedSec: getElapsedSec(),
                    type,
                    label: label ?? type,
                } satisfies SessionEventPin,
            ]);
        };
        window.addEventListener('ppn:session-event', handleSessionEvent);
        return () => window.removeEventListener('ppn:session-event', handleSessionEvent);
    }, [getElapsedSec]);

    // Restore mode from localStorage on mount (survives companion-page navigation).
    // BUG-1 guard: if localStorage says 'live' but SESSION_START_KEY is absent, the
    // key was resolved from a stale or colliding 'demo' entry — treat as 'pre'.
    const [mode, setMode] = useState<SessionMode>(() => {
        try {
            const stored = localStorage.getItem(SESSION_KEY) as SessionMode | null;
            if (stored === 'live' && !localStorage.getItem(SESSION_START_KEY)) return 'pre';
            return stored ?? 'pre';
        } catch { return 'pre'; }
    });

    // SESSION_KEY HYDRATION FIX (BUG-3): When journey.sessionId is undefined on the
    // first render, SESSION_KEY is 'ppn_session_mode_demo' and the lazy initializer
    // above reads the wrong localStorage slot → mode defaults to 'pre' even if the
    // session is live. This effect re-syncs mode from localStorage the first time
    // SESSION_KEY resolves to a real UUID.
    //
    // Covers the "patient-selection modal re-entry" path (Regression Scenarios 1+3):
    //   1. Patient A starts session → mode='live', ppn_session_mode_<uuidA>='live'
    //   2. User opens Patient B via modal → component unmounts
    //   3. User returns to Patient A → component remounts, but if sessionId hydrates
    //      one render late, the lazy initializer reads 'demo' key → mode='pre'
    //   4. This effect fires when SESSION_KEY updates to the real UUID, reads 'live',
    //      and calls setMode('live') to correct the in-memory state.
    const UUID_RE_H = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    useEffect(() => {
        // Only act when we have a real UUID in the key (not 'demo')
        const keyUUID = SESSION_KEY.replace('ppn_session_mode_', '');
        if (!UUID_RE_H.test(keyUUID)) return;
        try {
            const stored = localStorage.getItem(SESSION_KEY) as SessionMode | null;
            if (!stored) return; // Nothing stored — leave mode as-is
            const startKeyPresent = !!localStorage.getItem(SESSION_START_KEY);
            const correctedMode: SessionMode =
                stored === 'live' && !startKeyPresent ? 'pre' : stored;
            setMode(prev => {
                if (prev !== correctedMode) {
                    console.debug('[BUG-3] SESSION_KEY resolved — correcting mode from', prev, '→', correctedMode);
                    return correctedMode;
                }
                return prev;
            });
        } catch { /* quota exceeded */ }
    // SESSION_KEY changes whenever journey.sessionId hydrates — that's the trigger we want.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SESSION_KEY]);


    // Recovery guard — if localStorage was cleared (logout/hard-refresh) but
    // the DB session is still open (session_ended_at IS NULL), restore 'live' mode.
    //
    // BUG-2 FIX: The guard must distinguish two legitimate 'pre' states:
    //   A) Genuine recovery  — SESSION_START_KEY is absent (localStorage was wiped)
    //   B) Normal navigation — SESSION_START_KEY is present but practitioner hasn't
    //      tapped Start yet (e.g., arrived via header timer chip deep-link).
    // Previously only case A should auto-restore, but both were treated identically,
    // causing the timer to flip to 'live' the moment activeSessions updated on
    // any navigation into Phase 2. We now gate restoration on case A only.
    useEffect(() => {
        const resolvedId = journey.sessionId ?? journey.session?.sessionId;
        const UUID_RE_R = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!resolvedId || !UUID_RE_R.test(resolvedId)) return;
        const isConfirmedActive = activeSessions.some(s => s.id === resolvedId);
        if (isConfirmedActive && mode === 'pre') {
            // BUG-2 guard: if a start key already exists, the session is not stuck —
            // the practitioner simply navigated in before tapping Start. Do not restore.
            const hasLocalStartKey = !!localStorage.getItem(SESSION_START_KEY);
            if (hasLocalStartKey) return;
            // No start key + DB session open = genuine hard-refresh recovery. Restore.
            console.warn('[WO-QA] Session', resolvedId, 'is open in DB, no local start key — genuine recovery to live');
            setMode('live');
            try {
                localStorage.setItem(SESSION_KEY, 'live');
                const activeSession = activeSessions.find(s => s.id === resolvedId);
                if (activeSession?.startedAt) {
                    localStorage.setItem(SESSION_START_KEY, String(new Date(activeSession.startedAt).getTime()));
                }
            } catch { /* quota exceeded */ }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSessions, journey]);

    const setAndPersistMode = (nextMode: SessionMode) => {
        setMode(nextMode);
        // BUG-1 guard: if session ID resolved to 'demo' (race condition during mount),
        // writing to localStorage would share the key across all demo/un-hydrated sessions,
        // causing timer carry-over. We still update in-memory mode (setMode above) but
        // skip localStorage persistence until a real UUID is confirmed.
        const resolvedId = journey.session?.sessionId ?? journey.sessionId;
        const UUID_RE_P = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!resolvedId || !UUID_RE_P.test(resolvedId)) return;
        try {
            localStorage.setItem(SESSION_KEY, nextMode);
            if (nextMode === 'live') {
                // Always stamp a fresh start time. removeItem first prevents any stale
                // value from the same key surviving across hard-refresh sequences.
                localStorage.removeItem(SESSION_START_KEY);
                localStorage.setItem(SESSION_START_KEY, String(Date.now()));
            } else if (nextMode === 'pre') {
                localStorage.removeItem(SESSION_START_KEY);
            }
        } catch { /* quota exceeded */ }
    };

    // Timer, calculated from wall-clock start time so it survives rerenders
    const [elapsedTime, setElapsedTime] = useState('00:00:00');
    useEffect(() => {
        if (mode !== 'live') {
            if (mode === 'pre') setElapsedTime('00:00:00');
            return;
        }
        const tick = () => {
            try {
                const raw = localStorage.getItem(SESSION_START_KEY);
                const startMs = raw ? Number(raw) : Date.now();
                const diff = Date.now() - startMs;
                const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
                const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
                const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
                setElapsedTime(`${h}:${m}:${s}`);
            } catch { setElapsedTime('00:00:00'); }
        };
        tick(); // immediate first tick
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [mode]);

    // Derived from completedForms prop
    const isDosingProtocolComplete = completedForms.has('dosing-protocol');
    const isVitalsComplete = !config.enabledFeatures.includes('session-vitals') || completedForms.has('session-vitals');
    const canStartSession = isDosingProtocolComplete && isVitalsComplete;
    const isLive = mode === 'live';

    // Keyboard Shortcuts (live mode only)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (mode !== 'live') return;
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            switch (e.key.toLowerCase()) {
                case 'u': setActivePanel(p => p === 'update' ? 'graph' : 'update'); break;
                case 'v': {
                    // Stamp a vital_check pin on the chart when practitioner opens vitals form
                    setEventLog(prev => [...prev, {
                        id: `vitals-${Date.now()}`,
                        elapsedSec: getElapsedSec(),
                        type: 'vital_check',
                        label: 'Vitals Recorded',
                    } satisfies SessionEventPin]);
                    // SAVS GAP #2 fix: persist the vitals shortcut activation to the DB ledger
                    const _sidV = journey.sessionId ?? journey.session?.sessionId;
                    if (_sidV && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(_sidV)) {
                        // Timeline: no ref_flow_event_types code for vital_check; skip DB write.
                    }
                    onOpenForm('session-vitals');
                    break;
                }
                case 'a': {
                    // WO-535-B: Stamp adverse event pin on the chart at key-press time,
                    // matching the button path (lines ~1367-1382). Without this, Quick Key A
                    // opened the form but never emitted a graph event pin or ledger entry.
                    setEventLog(prev => [...prev, {
                        id: `adverse-key-${Date.now()}`,
                        elapsedSec: getElapsedSec(),
                        type: 'safety-and-adverse-event',
                        label: 'Adverse Event',
                    } satisfies SessionEventPin]);
                    onOpenForm('safety-and-adverse-event');
                    break;
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mode, onOpenForm]);

    // Post-session assessment state, WO-547: restored from localStorage on mount
    // so navigating away and returning preserves completed state.
    // WO-557 Fix A: assessmentKey may resolve as 'demo' initially if sessionId isn't
    // hydrated yet. useEffect re-reads whenever the key stabilises to the real UUID,
    // preventing the stale-key bug that caused the ✅ badge to stay blank on return.
    const assessmentKey = `ppn_phase2_assessment_${journey.session?.sessionId ?? journey.sessionId ?? 'demo'}`;
    const [showAssessmentModal, setShowAssessmentModal] = useState(false);
    // WO-548: Collapsed accordion to access session chart/ledger from post-session view
    const [showPostSessionTimeline, setShowPostSessionTimeline] = useState(false);
    const [assessmentCompleted, setAssessmentCompleted] = useState<boolean>(() => {
        try { return !!localStorage.getItem(assessmentKey); } catch { return false; }
    });
    const [assessmentScores, setAssessmentScores] = useState<{ meq: number; edi: number; ceq: number } | null>(() => {
        try {
            const raw = localStorage.getItem(assessmentKey);
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    });
    // WO-557: Re-read from localStorage whenever assessmentKey settles to the real UUID.
    // This covers the case where the component mounts with key='demo', data is written
    // under the real UUID key, then the component remounts, the lazy useState initialiser
    // runs only once so it misses the update. useEffect catches the drift.
    useEffect(() => {
        try {
            const raw = localStorage.getItem(assessmentKey);
            if (raw) {
                setAssessmentCompleted(true);
                setAssessmentScores(JSON.parse(raw));
            } else {
                // Don't reset to false if already true from in-session completion
                setAssessmentCompleted(prev => prev || false);
            }
        } catch { /* non-critical */ }
    }, [assessmentKey]);

    // WO-547 / WO-557: Derive safety event status from companion logs + live event log.
    // WO-557 Fix B: expanded check covers all distress feelings (not just need_support)
    // and catches safety_event type from both companion dispatch (WO-556) and Phase 2
    // direct form submissions. Auto-completes vacuously when zero events logged.
    const DISTRESS_FEELINGS = new Set([
        'need_support', 'anxious', 'overwhelmed', 'fearful', 'tense', 'nauseous'
    ]);
    const hasSafetyEvents = useMemo(() => {
        // 1. Check companion_logs localStorage for any distress feeling
        try {
            const sessionKey = journey.session?.sessionId ?? journey.sessionId ?? 'demo';
            const key = `companion_logs_${sessionKey}`;
            const raw = localStorage.getItem(key);
            if (raw) {
                const logs: Array<{ timestamp: string; feeling: string }> = JSON.parse(raw);
                if (logs.some(l => DISTRESS_FEELINGS.has(l.feeling))) return true;
            }
        } catch { /* non-critical */ }
        // 2. Check live eventLog for safety_event pins (covers both companion dispatch
        //    via WO-556 CustomEvent and Phase 2's safety-and-adverse-event form)
        return eventLog.some(e =>
            e.type === 'safety_event' ||
            e.type === 'safety-and-adverse-event' ||
            e.type === 'rescue-protocol'
        );
    }, [eventLog, journey]);

    // Live Vitals (mock)
    const [liveVitals] = useState({ hr: 82, bp: '125/82', spo2: 98, hrv: 45 });

    // ── Active cockpit panel: only one of graph / timeline / update is open at once ──
    // Default: graph open (State A)
    const [activePanel, setActivePanel] = useState<'graph' | 'timeline' | 'update'>('graph');
    const [updateAffect, setUpdateAffect] = useState('');
    const [updateResponsiveness, setUpdateResponsiveness] = useState('');
    const [updateComfort, setUpdateComfort] = useState('');
    const [updateNote, setUpdateNote] = useState('');
    const [updateHR, setUpdateHR] = useState('');
    const [updateBPSys, setUpdateBPSys] = useState('');
    const [updateBPDia, setUpdateBPDia] = useState('');
    // Companion overlay, open/close without affecting session timer
    const [showCompanion, setShowCompanion] = useState(false);
    interface SessionUpdateEntry {
        timestamp: string;
        elapsed: string;
        affect: string;
        responsiveness: string;
        comfort: string;
        note: string;
        hr: string;
        bp: string;
        elapsedSec?: number; // WO-528: stamp elapsed seconds for chart X-axis
        tempF?: number; // reserved for future temperature field
    }
    const [updateLog, setUpdateLog] = useState<SessionUpdateEntry[]>([]);
    // WO-B0c: tracks whether the async DB vitals hydration on mount is still in-flight.
    // Starts true so the chart shows a loading skeleton instead of the empty-state placeholder.
    // Flips to false once the useEffect resolves (success or failure).
    const [vitalsLoading, setVitalsLoading] = useState<boolean>(true);

    // WO-A2: Hydrate vitalsChartData from DB on mount (page refresh recovery).
    // Without this, vitalsChartData is built from in-memory updateLog only — blank
    // after a refresh even if vitals were logged to log_session_vitals during this session.
    // Guard: only runs when we have a real UUID sessionId AND updateLog is empty.
    const UUID_RE_V = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    useEffect(() => {
        const sessionId = journey.sessionId || journey.session?.sessionNumber?.toString();
        if (!sessionId || !UUID_RE_V.test(sessionId)) return;
        // WO-694 BUG-07: changed threshold from > 0 to > 1.
        // WO-B6b baseline seeder adds 1 synthetic entry ([baseline]) to updateLog.
        // The old guard `> 0` would prevent DB hydration in post mode (remount after session end),
        // leaving only the baseline entry in the chart instead of the full session vitals.
        // With > 1: hydration runs when only the synthetic baseline is present.
        if (updateLog.length > 1) return; // Don't overwrite 2+ live session entries

        (async () => {
            try {
                const result = await getSessionVitals(sessionId);
                if (!result.success || !result.data || result.data.length === 0) {
                    setVitalsLoading(false); // WO-B0c: no data, stop loading
                    return;
                }

                // Map log_session_vitals rows → SessionUpdateEntry so vitalsChartData
                // useMemo picks them up without any schema changes.
                const hydrated: SessionUpdateEntry[] = result.data.map((row: any, i: number) => {
                    const hrVal = row.heart_rate != null ? String(row.heart_rate) : '';
                    const sys = row.bp_systolic != null ? String(row.bp_systolic) : '';
                    const dia = row.bp_diastolic != null ? String(row.bp_diastolic) : '';
                    const bpStr = (sys || dia) ? `${sys || '?'}/${dia || '?'}` : '';
                    const ts = row.recorded_at ? new Date(row.recorded_at) : new Date();
                    return {
                        timestamp: ts.toLocaleTimeString(),
                        elapsed: 'N/A',
                        elapsedSec: i * 60, // fallback spacing; real elapsed unknown on refresh
                        affect: '',
                        responsiveness: '',
                        comfort: '',
                        note: '',
                        hr: hrVal,
                        bp: bpStr,
                        tempF: undefined,
                    };
                });

                setUpdateLog(hydrated);
                console.debug(`[WO-A2] Hydrated ${hydrated.length} vitals entries from DB.`);
            } catch (err) {
                console.warn('[WO-A2] Vitals hydration failed (non-blocking):', err);
            } finally {
                setVitalsLoading(false); // WO-B0c: always clear loading flag
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [journey.sessionId]);

    // WO-B6b: Seed baseline vitals from ppn_dosing_protocol into the chart at T+0.
    // Runs once after DB hydration completes (vitalsLoading=false) when the cockpit
    // is live but updateLog is still empty (no session updates saved yet).
    // Client-only display transformation — NO DB write.
    useEffect(() => {
        if (vitalsLoading) return;          // wait for WO-A2 hydration to finish
        if (mode !== 'live') return;        // only seed during an active live session
        if (updateLog.length > 0) return;   // real vitals already present — don't overwrite

        try {
            const cached = JSON.parse(localStorage.getItem('ppn_dosing_protocol') || '{}');
            const hr  = cached.heart_rate    != null ? String(cached.heart_rate)    : '';
            const sys = cached.bp_systolic   != null ? String(cached.bp_systolic)   : '';
            const dia = cached.bp_diastolic  != null ? String(cached.bp_diastolic)  : '';
            const bp  = (sys || dia) ? `${sys || '?'}/${dia || '?'}` : '';

            if (!hr && !bp) return; // no baseline vitals available — nothing to seed

            const baseline = {
                timestamp: new Date().toLocaleTimeString(),
                elapsed: 'T+00:00',
                elapsedSec: 0,
                affect: '',
                responsiveness: '',
                comfort: '',
                note: 'Baseline vitals (pre-session)',
                hr,
                bp,
                tempF: undefined,
            };
            setUpdateLog([baseline]);
            console.debug('[WO-B6b] Seeded baseline vitals at T+0 from ppn_dosing_protocol:', { hr, bp });

            // Also emit to LiveSessionTimeline so a T+00:00 entry appears there too
            const labelParts: string[] = [];
            if (hr)  labelParts.push(`HR ${hr}`);
            if (sys) labelParts.push(`BP ${sys}/${dia || '?'}`);
            window.dispatchEvent(new CustomEvent('ppn:dose-registered', {
                detail: {
                    sessionId: journey.session?.sessionId ?? journey.sessionId,
                    type: 'vital_check',
                    label: `Baseline Vitals · ${labelParts.join(' · ')}`,
                },
            }));
        } catch { /* localStorage unavailable — non-blocking */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vitalsLoading, mode]);


    // WO-559 Issue B, Vitals pre-population helper.
    // Called when the Session Update panel opens. Finds the most recent log entry
    // that has at least one vital recorded and pre-fills the form fields.
    // If no prior entry exists, fields remain blank (true first entry behavior).
    const prefillVitalsFromLastEntry = useCallback((log: SessionUpdateEntry[]) => {
        const lastWithVitals = log.find(e => e.hr || e.bp);
        if (!lastWithVitals) return;
        if (lastWithVitals.hr) setUpdateHR(lastWithVitals.hr);
        if (lastWithVitals.bp) {
            const parts = lastWithVitals.bp.split('/');
            if (parts[0] && parts[0] !== '?') setUpdateBPSys(parts[0]);
            if (parts[1] && parts[1] !== '?') setUpdateBPDia(parts[1]);
        }
    }, []);

    // WO-528: derive VitalsSnapshot[] from updateLog entries that contain HR or BP data.
    // Each entry is mapped to an elapsed-time X value so the chart uses a consistent timeline.
    const vitalsChartData: VitalsSnapshot[] = useMemo(() => {
        return updateLog
            .filter(e => e.hr || e.bp)
            .map((e, i) => ({
                id: `upd-${i}`,
                elapsedSec: e.elapsedSec ?? 0,
                // Use undefined for unrecorded fields, Recharts treats undefined as a gap,
                // so no line is drawn toward zero when a field was not entered.
                heartRate: e.hr ? parseInt(e.hr, 10) : undefined,
                bpSystolic: e.bp ? parseInt(e.bp.split('/')[0], 10) : undefined,
                temperatureF: e.tempF ?? undefined, // no default, only plot when explicitly recorded
            }))
            .sort((a, b) => a.elapsedSec - b.elapsedSec);
    }, [updateLog]);

    // WO-528: parse elapsedTime HH:MM:SS string to seconds to drive the chart x-axis domain.
    // The chart uses this to grow the domain even when no new vitals are logged.
    const sessionDurationSec = useMemo(() => {
        const parts = elapsedTime.split(':').map(Number);
        if (parts.length !== 3) return 0;
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }, [elapsedTime]);

    const handleSaveUpdate = async () => {
        const bpStr = (updateBPSys || updateBPDia) ? `${updateBPSys || '?'}/${updateBPDia || '?'}` : '';
        const elapsedSec = getElapsedSec();
        const entry: SessionUpdateEntry = {
            timestamp: new Date().toLocaleTimeString(),
            elapsed: elapsedTime,
            elapsedSec,         // WO-528: stamp elapsed seconds for chart X-axis
            affect: updateAffect,
            responsiveness: updateResponsiveness,
            comfort: updateComfort,
            note: updateNote.trim(),
            hr: updateHR,
            bp: bpStr,
            tempF: undefined,   // reserved for future temperature field
        };
        setUpdateLog(prev => [entry, ...prev]);

        // WO-528: push a SESSION_UPDATE event pin for the chart overlay strip
        // regardless of whether vitals were entered, qualitative updates still appear
        setEventLog(prev => [
            ...prev,
            {
                id: `upd-pin-${Date.now()}`,
                elapsedSec,
                type: 'session_update',
                label: updateAffect ? `Update: ${updateAffect}` : 'Session Update',
            } satisfies SessionEventPin,
        ]);

        const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const resolvedSessionId = journey.sessionId ?? journey.session?.sessionId;

        // Ledger Gap Fix — P1: build a rich description from ALL qualitative fields.
        // Previously only the free-text note was stamped; Affect, Responsiveness, and Comfort
        // were saved to local state only and never appeared in the timeline ledger.
        const descParts: string[] = [];
        if (updateAffect)          descParts.push(`Affect: ${updateAffect}`);
        if (updateResponsiveness)  descParts.push(`Responsiveness: ${updateResponsiveness}`);
        if (updateComfort)         descParts.push(`Comfort: ${updateComfort}`);
        // WO-B0b: include vitals in ledger description so the timeline entry shows HR/BP
        if (updateHR)              descParts.push(`HR: ${updateHR} bpm`);
        if (updateBPSys && updateBPDia) descParts.push(`BP: ${updateBPSys}/${updateBPDia}`);
        else if (updateBPSys)      descParts.push(`BP Sys: ${updateBPSys}`);
        if (updateNote.trim())     descParts.push(updateNote.trim());
        const sessionUpdateDesc = descParts.join(' · ') || 'Session update logged';

        if (resolvedSessionId && UUID_RE.test(resolvedSessionId)) {
            createTimelineEvent({
                session_id: resolvedSessionId,
                event_timestamp: new Date().toISOString(),
                event_type_code: 'session_update' as any,
                metadata: { event_description: sessionUpdateDesc },
            }).catch(err => console.warn('[WO-576] Session Update note timeline write failed:', err));
        }

        // Emit vitals to log_session_vitals table
        if ((updateHR || updateBPSys || updateBPDia) && resolvedSessionId && UUID_RE.test(resolvedSessionId ?? '')) {
            try {
                await createSessionVital({
                    session_id: resolvedSessionId,
                    heart_rate: updateHR ? parseInt(updateHR, 10) : undefined,
                    bp_systolic: updateBPSys ? parseInt(updateBPSys, 10) : undefined,
                    bp_diastolic: updateBPDia ? parseInt(updateBPDia, 10) : undefined,
                    // source removed — not in SessionVitalData interface
                });
            } catch (err) {
                console.warn('[Session Update] Failed to sync clinical vital:', err);
            }
        }

        // WO-B0b: dispatch ppn:session-event so LiveSessionTimeline updates immediately
        // without waiting for the 60-sec DB poll (fixes Session Update real-time gap).
        window.dispatchEvent(new CustomEvent('ppn:session-event', {
            detail: {
                sessionId: resolvedSessionId,
                type: 'session_update',
                label: sessionUpdateDesc,
                timestamp: new Date().toISOString(),
            },
        }));

        // Reset fields
        setUpdateAffect(''); setUpdateResponsiveness(''); setUpdateComfort('');
        setUpdateNote(''); setUpdateHR(''); setUpdateBPSys(''); setUpdateBPDia('');
        setActivePanel('graph'); // Close update panel after save
        addToast({ title: 'Session Update Saved', message: `Logged at T+${elapsedTime}`, type: 'success' });
    };

    // WO-559 Issue B: Pre-populate vitals each time the update panel is opened.
    // Runs only when activePanel transitions TO 'update'.
    const prevActivePanel = useRef<'graph' | 'timeline' | 'update'>('graph');
    useEffect(() => {
        if (activePanel === 'update' && prevActivePanel.current !== 'update') {
            prefillVitalsFromLastEntry(updateLog);
        }
        prevActivePanel.current = activePanel;
    }, [activePanel, updateLog, prefillVitalsFromLastEntry]);

    // ── Contraindication checker, MUST stay above early returns (Rules of Hooks) ──
    // GUARD: Only run after the practitioner has actually completed the Dosing Protocol form.
    // Without this, stale localStorage from a previous session would trigger warnings
    // before the user has entered anything in the current session.
    const contraindicationResults = useMemo(() => {
        try {
            let substanceName = '';
            try {
                const cachedProtocol = localStorage.getItem('ppn_dosing_protocol');
                if (cachedProtocol) {
                    const parsed = JSON.parse(cachedProtocol);
                    substanceName = parsed.substance_name || parsed.substance || '';
                }
            } catch (_) { }
            if (!substanceName && journey.session?.substance) {
                substanceName = journey.session.substance;
            }
            // Guard: no substance selected yet — nothing to evaluate against.
            // This is sufficient to prevent phantom warnings from stale localStorage.
            if (!substanceName) return null;
            let medications: string[] = [];
            try {
                // ppn_patient_medications_names: authoritative key (written by Phase 1 Safety Check)
                // mock_patient_medications_names: legacy fallback (DB-hydrated on patient select)
                const medsRaw =
                    localStorage.getItem('ppn_patient_medications_names') ||
                    localStorage.getItem('mock_patient_medications_names');
                if (medsRaw) {
                    const parsed = JSON.parse(medsRaw);
                    if (Array.isArray(parsed) && parsed.length) medications = parsed;
                }
            } catch (_) { }
            const engineInput: import('../../services/contraindicationEngine').IntakeScreeningData = {
                patientId: 'demo',
                sessionSubstance: substanceName.toLowerCase(),
                medications: medications.map(m => m.toLowerCase()),
                psychiatricHistory: [],
                familyHistory: [],
            };
            return runContraindicationEngine(engineInput);
        } catch (_) { return null; }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contraindicationKey, journey]);

    // Current meds list for display — reads ppn_patient_medications_names first (saved from
    // StructuredSafetyCheckForm per WO-638), then falls back to mock_patient_medications_names
    // (Supabase-hydrated on patient select in WellnessJourney.handlePatientSelect).
    const patientMeds = useMemo(() => {
        try {
            // Prefer the key written by StructuredSafetyCheckForm (WO-638)
            const fromSafety = localStorage.getItem('ppn_patient_medications_names');
            if (fromSafety) {
                const parsed = JSON.parse(fromSafety);
                if (Array.isArray(parsed) && parsed.length) return parsed as string[];
            }
            // Fallback: DB-hydrated on patient select
            const cached = localStorage.getItem('mock_patient_medications_names');
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length) return parsed as string[];
            }
        } catch (_) { }
        return [];
    }, [contraindicationKey]);

    // ── Substance clear / change handler ─────────────────────────────────────────
    // Pre-session: silently wipes the substance from localStorage so the practitioner
    // can re-select without any record of the wrong click.
    // Live session: re-opens the Dosing Protocol form, the amendment is then
    // captured as a timestamped entry by the form's save handler.
    const handleClearSubstance = () => {
        if (isLive) {
            // Post-start: open form so change is recorded as a timestamped event
            onOpenForm('dosing-protocol');
        } else {
            // Pre-start: silent clear, no clinical record needed
            try {
                const raw = localStorage.getItem('ppn_dosing_protocol');
                if (raw) {
                    const protocol = JSON.parse(raw);
                    delete protocol.substance_name;
                    delete protocol.substance;
                    localStorage.setItem('ppn_dosing_protocol', JSON.stringify(protocol));
                }
            } catch { }
            setContraindicationKey(k => k + 1);
            window.dispatchEvent(new Event('ppn:dosing-updated'));
        }
    };


    // ── Resolve session ID for downstream calls ────────────────────────────────
    const resolvedSessionId = journey.sessionId ?? journey.session?.sessionId;
    const UUID_RE_CHECK = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const hasRealUUID = !!(resolvedSessionId && UUID_RE_CHECK.test(resolvedSessionId));

    // ── Force-close: end session without completing the Pre steps ─────────────
    // Used to recover from stuck sessions (timer running, UI lost).
    const handleForceClose = async () => {
        if (!hasRealUUID) return;
        try {
            await endDosingSession(resolvedSessionId);
            localStorage.removeItem(SESSION_KEY);
            localStorage.removeItem(SESSION_START_KEY);
            setMode('post');
            setForceCloseConfirm(false);
            addToast({ title: 'Session Closed', message: 'Session was force-closed and saved.', type: 'info' });
        } catch (err) {
            addToast({ title: 'Force Close Failed', message: String(err), type: 'error' });
        }
    };

    // ── Restore stuck session in live mode ────────────────────────────────────
    const handleRestoreSession = () => {
        setMode('live');
        if (hasRealUUID) {
            localStorage.setItem(SESSION_KEY, 'live');
            const activeSession = activeSessions.find(s => s.id === resolvedSessionId);
            if (activeSession?.startedAt) {
                localStorage.setItem(SESSION_START_KEY, String(new Date(activeSession.startedAt).getTime()));
            }
        }
    };

    // ── isStuckInPre: timer running in DB, but UI mode is 'pre' with no start key
    const isStuckInPre = mode === 'pre'
        && hasRealUUID
        && activeSessions.some(s => s.id === resolvedSessionId)
        && !localStorage.getItem(SESSION_START_KEY);

    // ── End session handler ────────────────────────────────────────────────────
    const handleEndSession = async () => {
        if (!hasRealUUID) { setAndPersistMode('post'); return; }
        try {
            await endDosingSession(resolvedSessionId);
            setAndPersistMode('post');
            refreshActiveSessions();
            addToast({ title: 'Dosing Session Ended', message: 'Session data saved. Proceed to closeout.', type: 'success' });
        } catch (err) {
            addToast({ title: 'Error ending session', message: String(err), type: 'error' });
        }
    };

    // ── Start session handler ──────────────────────────────────────────────────
    const handleStartSession = async () => {
        setAndPersistMode('live');

        // Build a rich initial-dose description from the Dosing Protocol cache
        // (same pattern as additional_dose in handleDosingSaved above)
        let dosingDesc = 'Initial dose administered — Session started';
        try {
            const cached = JSON.parse(localStorage.getItem('ppn_dosing_protocol') || '{}');
            const parts: string[] = ['Initial Dose'];
            if (cached.dosage_amount && cached.dosage_unit)
                parts.push(`${cached.dosage_amount}${cached.dosage_unit}`);
            else if (cached.dosage_amount)
                parts.push(`${cached.dosage_amount}`);
            if (cached.substance_name) parts.push(cached.substance_name);
            if (cached.route_of_administration) parts.push(cached.route_of_administration);
            parts.push('T+00:00:00');
            if (parts.length > 1) dosingDesc = parts.join(' · ');
        } catch { /* localStorage unavailable, keep default */ }

        // Stamp a chart event pin at T=0 so the vitals chart shows the dose marker
        setEventLog(prev => [
            ...prev,
            {
                id: `dose-start-${Date.now()}`,
                elapsedSec: 0,
                type: 'dose_admin',
                label: dosingDesc,
            } satisfies SessionEventPin,
        ]);

        // Fire ppn:dose-registered → LiveSessionTimeline adds an optimistic entry
        // immediately (before the 60-sec DB poll) so the ledger is never blank at start
        window.dispatchEvent(new CustomEvent('ppn:dose-registered', {
            detail: { sessionId: resolvedSessionId, type: 'dose_admin', label: dosingDesc, elapsedSec: 0 }
        }));

        if (hasRealUUID) {
            // Write dose_admin (valid ref_flow_event_types code) — NOT 'session_started'
            // which does not exist in ref_flow_event_types and causes a silent FK failure.
            createTimelineEvent({
                session_id: resolvedSessionId,
                event_timestamp: new Date().toISOString(),
                event_type_code: 'dose_admin',
                metadata: { event_description: dosingDesc },
            }).then(() => refreshActiveSessions())
              .catch(err => console.warn('[DosingSessionPhase] dose_admin timeline write failed:', err));
        }
    };
    // ── Phase 2 prep steps (derived from completedForms) ──────────────────────
    type Phase2Step = { id: WellnessFormId | '__start__'; label: string; icon: string; isComplete: boolean };
    const PHASE2_STEPS: Phase2Step[] = [
        { id: 'dosing-protocol', label: 'Dosing Protocol', icon: 'medication', isComplete: completedForms.has('dosing-protocol') },
        ...(config.enabledFeatures.includes('session-vitals')
            ? [{ id: 'session-vitals' as WellnessFormId, label: 'Baseline Vitals', icon: 'monitor_heart', isComplete: completedForms.has('session-vitals') }]
            : []),
        { id: '__start__', label: 'Launch Session', icon: 'play_circle', isComplete: isLive },
    ];
    const currentStepIdx = PHASE2_STEPS.findIndex(s => !s.isComplete);

    // ═══════════════════════════════════════════════════════════════════════════
    // ── POST MODE: delegates to SessionCloseoutView ────────────────────────────
    if (mode === 'post') {
        const handleSubmitAndClose = async () => {
            if (hasRealUUID) {
                await createTimelineEvent({
                    session_id: resolvedSessionId,
                    event_timestamp: new Date().toISOString(),
                    event_type_code: 'session_completed' as any,
                    metadata: {
                        event_description: `Session submitted and closed. Post-session assessment scores — MEQ: ${assessmentScores?.meq ?? '—'}, EDI: ${assessmentScores?.edi ?? '—'}, CEQ: ${assessmentScores?.ceq ?? '—'}.`,
                    },
                }).catch(err => console.warn('[SAVS-GAP4] Session close DB write failed:', err));
            }
            onCompletePhase();
        };
        return (
            <Phase2ErrorBoundary onReset={() => setMode('pre')}>
                <SessionCloseoutView
                    journey={journey}
                    assessmentCompleted={assessmentCompleted}
                    assessmentScores={assessmentScores}
                    hasSafetyEvents={hasSafetyEvents}
                    showAssessmentModal={showAssessmentModal}
                    setShowAssessmentModal={setShowAssessmentModal}
                    showPostSessionTimeline={showPostSessionTimeline}
                    setShowPostSessionTimeline={setShowPostSessionTimeline}
                    sessionStartMs={sessionStartMs}
                    chartVisible={chartVisible}
                    vitalsChartData={vitalsChartData}
                    eventLog={eventLog}
                    sessionDurationSec={sessionDurationSec}
                    config={config}
                    setAssessmentCompleted={setAssessmentCompleted}
                    setAssessmentScores={setAssessmentScores}
                    onCompletePhase={onCompletePhase}
                    onSubmitAndClose={handleSubmitAndClose}
                />
            </Phase2ErrorBoundary>
        );
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ── PRE + LIVE MODES: delegates to SessionHUD, SessionPrepView, SessionCockpitView
    return (
        <Phase2ErrorBoundary onReset={() => setAndPersistMode('pre')}>
            <div className="space-y-4">

                {/* 1. Session HUD — sticky timer + live vitals strip */}
                <SessionHUD
                    isLive={isLive}
                    elapsedTime={elapsedTime}
                    updateLog={updateLog}
                    liveVitals={liveVitals}
                />

                {/* 2. Live cockpit — graph, timeline, chip row (visible in live mode only, ABOVE action grid) */}
                {isLive && (
                    <SessionCockpitView
                        journey={journey}
                        elapsedTime={elapsedTime}
                        activePanel={activePanel}
                        setActivePanel={setActivePanel}
                        sessionUpdatePanelRef={sessionUpdatePanelRef}
                        updateLog={updateLog}
                        vitalsChartData={vitalsChartData}
                        eventLog={eventLog}
                        sessionDurationSec={sessionDurationSec}
                        vitalsLoading={vitalsLoading}
                        chartVisible={chartVisible}
                        setChartVisible={setChartVisible}
                        showCompanion={showCompanion}
                        setShowCompanion={setShowCompanion}
                        updateAffect={updateAffect}
                        setUpdateAffect={setUpdateAffect}
                        updateResponsiveness={updateResponsiveness}
                        setUpdateResponsiveness={setUpdateResponsiveness}
                        updateComfort={updateComfort}
                        setUpdateComfort={setUpdateComfort}
                        updateNote={updateNote}
                        setUpdateNote={setUpdateNote}
                        updateHR={updateHR}
                        setUpdateHR={setUpdateHR}
                        updateBPSys={updateBPSys}
                        setUpdateBPSys={setUpdateBPSys}
                        updateBPDia={updateBPDia}
                        setUpdateBPDia={setUpdateBPDia}
                        liveVitals={liveVitals}
                        sessionStartMs={sessionStartMs}
                        config={config}
                        onOpenForm={onOpenForm}
                        onSaveUpdate={handleSaveUpdate}
                        onEndSession={handleEndSession}
                        openAndScrollToUpdatePanel={openAndScrollToUpdatePanel}
                    />
                )}



                {/* 3. Prep steps (pre-session only) + medications + action grid + quick keys */}
                <SessionPrepView
                    journey={journey}
                    isLive={isLive}
                    isStuckInPre={isStuckInPre}
                    forceCloseConfirm={forceCloseConfirm}
                    resolvedSessionId={resolvedSessionId}
                    PHASE2_STEPS={PHASE2_STEPS}
                    currentStepIdx={currentStepIdx}
                    canStartSession={canStartSession}
                    contraindicationResults={contraindicationResults}
                    patientMeds={patientMeds}
                    isLiveRedoseRef={isLiveRedoseRef}
                    onOpenForm={onOpenForm}
                    onStartSession={handleStartSession}
                    onRestoreSession={handleRestoreSession}
                    onForceClose={handleForceClose}
                    setForceCloseConfirm={setForceCloseConfirm}
                    onClearSubstance={handleClearSubstance}
                    openAndScrollToUpdatePanel={openAndScrollToUpdatePanel}
                    getElapsedSec={getElapsedSec}
                    setEventLog={setEventLog}
                    elapsedTime={elapsedTime}
                />
            </div>
        </Phase2ErrorBoundary>
    );
};

