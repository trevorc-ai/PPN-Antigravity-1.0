import React, { Component, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
    Activity, Sparkles, CheckCircle, ChevronRight, X, Info, Clock, Download,
    Heart, Play, AlertTriangle, FileText, Lock, CheckSquare, ArrowRight,
    CheckCircle2, Edit3, AlertCircle, Pill, ShieldAlert, ClipboardList, Save
} from 'lucide-react';
import { runContraindicationEngine } from '../../services/contraindicationEngine';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';
import { WorkflowActionCard } from './WorkflowCards';
import AdaptiveAssessmentPage from '../../pages/AdaptiveAssessmentPage';
import { WellnessFormId } from './WellnessFormRouter';
import { LiveSessionTimeline } from './LiveSessionTimeline';
import { SessionVitalsTrendChart, VitalsSnapshot, SessionEventPin } from './SessionVitalsTrendChart';
import { useToast } from '../../contexts/ToastContext';
import { useProtocol } from '../../contexts/ProtocolContext';
import { createSessionVital } from '../../services/clinicalLog';

// ── Error Boundary: catches render crashes in Phase 2 sub-trees ────────────────
// Prevents the entire WellnessJourney page from going blank on a sub-component error.
interface EBProps { onReset: () => void; children: React.ReactNode; }
interface EBState { hasError: boolean; error: string; }
export class Phase2ErrorBoundary extends React.Component<EBProps, EBState> {
    public state: EBState = { hasError: false, error: '' };

    public static getDerivedStateFromError(err: Error): EBState {
        return { hasError: true, error: err?.message ?? 'Unknown error' };
    }
    public componentDidCatch(err: Error, info: React.ErrorInfo) {
        console.error('[Phase2ErrorBoundary]', err, info);
    }
    private handleReset = () => {
        this.setState({ hasError: false, error: '' });
        this.props.onReset();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="rounded-2xl border border-red-800/50 bg-red-950/20 p-8 text-center space-y-4">
                    <p className="text-lg font-black text-red-300">Session view error — the session data was preserved.</p>
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
        label: 'Kroenke & Spitzer (2001) — PHQ-9',
        url: 'https://pubmed.ncbi.nlm.nih.gov/11556941/',
    },
    {
        pattern: /Spitzer.*2006/i,
        label: 'Spitzer et al. (2006) — GAD-7',
        url: 'https://pubmed.ncbi.nlm.nih.gov/16717171/',
    },
    {
        pattern: /Weathers.*2013/i,
        label: 'Weathers et al. (2013) — PCL-5 / CAPS-5',
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

// Emotional states — dark-room safe palette (matches PatientCompanionPage)
// rest: dim ~15% opacity bg + muted *-300/80 text (eye-safe, WCAG AA on black)
// glow: ~60% opacity fill — bright enough to confirm tap without harshness
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
 * CompanionButtonGrid — dark-room 4×4 feeling grid with instant-on / slow-fade glow.
 * Instant-on: litId set on click → transition-none snaps to glow.
 * Slow fade: litId cleared after 160ms → CSS duration-[1800ms] fades back.
 */
const CompanionButtonGrid: React.FC<{ sessionId: string }> = ({ sessionId }) => {
    const [litId, setLitId] = useState<string | null>(null);
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

/**
 * CompanionVideo — full-screen ambient video for tablet/mobile.
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
            <p className="text-white/20 text-xs tracking-[0.2em]">
                Tap to quietly log your state
            </p>
        </div>
        <video
            src="/admin_uploads/spherecules.mp4"
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
    const SESSION_KEY = `ppn_session_mode_${journey.session?.sessionId ?? journey.sessionId ?? 'demo'}`;
    const SESSION_START_KEY = `ppn_session_start_${journey.session?.sessionId ?? journey.sessionId ?? 'demo'}`;

    // Bump this counter whenever we want to force a contraindication re-evaluation
    const [contraindicationKey, setContraindicationKey] = useState(0);

    // WO-528: declare eventLog + getElapsedSec BEFORE any useEffect that references them
    const [eventLog, setEventLog] = useState<SessionEventPin[]>([]);

    // Helper: returns elapsed seconds since session start. Safe to call at any time.
    const getElapsedSec = useCallback((): number => {
        try {
            const raw = localStorage.getItem(SESSION_START_KEY);
            if (!raw) return 0;
            return Math.round((Date.now() - Number(raw)) / 1000);
        } catch { return 0; }
    }, [SESSION_START_KEY]);

    // Re-evaluate contraindications + stamp DOSE event pin when dosing protocol saved
    useEffect(() => {
        const bump = () => setContraindicationKey(k => k + 1);
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'ppn_dosing_protocol' || e.key === 'mock_patient_medications_names') bump();
        };
        // When dosing protocol is saved while live, push a dose_admin event pin
        const handleDosingUpdated = () => {
            bump();
            setEventLog(prev => [
                ...prev,
                {
                    id: `dose-${Date.now()}`,
                    elapsedSec: getElapsedSec(),
                    type: 'dose_admin',
                    label: 'Dose Admin',
                } satisfies SessionEventPin,
            ]);
        };
        window.addEventListener('storage', handleStorage);
        window.addEventListener('ppn:dosing-updated', handleDosingUpdated);
        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('ppn:dosing-updated', handleDosingUpdated);
        };
        // getElapsedSec is stable (useCallback), safe to include
    }, [getElapsedSec]);

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

    // Restore mode from localStorage on mount (survives companion-page navigation)
    const [mode, setMode] = useState<SessionMode>(() => {
        try { return (localStorage.getItem(SESSION_KEY) as SessionMode) ?? 'pre'; } catch { return 'pre'; }
    });

    const setAndPersistMode = (nextMode: SessionMode) => {
        setMode(nextMode);
        try {
            localStorage.setItem(SESSION_KEY, nextMode);
            if (nextMode === 'live') {
                // Only write start time once — don't overwrite if already set
                if (!localStorage.getItem(SESSION_START_KEY)) {
                    localStorage.setItem(SESSION_START_KEY, String(Date.now()));
                }
            } else if (nextMode === 'pre') {
                localStorage.removeItem(SESSION_START_KEY);
            }
        } catch { /* quota exceeded */ }
    };

    // Timer — calculated from wall-clock start time so it survives rerenders
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
                case 'u': setShowUpdatePanel(p => !p); break;
                case 'v':
                    // Stamp a vital_check pin on the chart when practitioner opens vitals form
                    setEventLog(prev => [...prev, {
                        id: `vitals-${Date.now()}`,
                        elapsedSec: getElapsedSec(),
                        type: 'vital_check',
                        label: 'Vitals Recorded',
                    } satisfies SessionEventPin]);
                    onOpenForm('session-vitals');
                    break;
                case 'a': onOpenForm('safety-and-adverse-event'); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mode, onOpenForm]);

    // Post-session assessment state
    const [showAssessmentModal, setShowAssessmentModal] = useState(false);
    const [assessmentCompleted, setAssessmentCompleted] = useState(false);
    const [assessmentScores, setAssessmentScores] = useState<{ meq: number; edi: number; ceq: number } | null>(null);

    // Live Vitals (mock)
    const [liveVitals] = useState({ hr: 82, bp: '125/82', spo2: 98, hrv: 45 });

    // ── Session Update Panel state ────────────────────────────────────────
    const [showUpdatePanel, setShowUpdatePanel] = useState(false);
    const [updateAffect, setUpdateAffect] = useState('');
    const [updateResponsiveness, setUpdateResponsiveness] = useState('');
    const [updateComfort, setUpdateComfort] = useState('');
    const [updateNote, setUpdateNote] = useState('');
    const [updateHR, setUpdateHR] = useState('');
    const [updateBPSys, setUpdateBPSys] = useState('');
    const [updateBPDia, setUpdateBPDia] = useState('');
    // Companion overlay — open/close without affecting session timer
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

    // WO-528: derive VitalsSnapshot[] from updateLog entries that contain HR or BP data.
    // Each entry is mapped to an elapsed-time X value so the chart uses a consistent timeline.
    const vitalsChartData: VitalsSnapshot[] = useMemo(() => {
        return updateLog
            .filter(e => e.hr || e.bp)
            .map((e, i) => ({
                id: `upd-${i}`,
                elapsedSec: e.elapsedSec ?? 0,
                // Use undefined for unrecorded fields — Recharts treats undefined as a gap,
                // so no line is drawn toward zero when a field was not entered.
                heartRate: e.hr ? parseInt(e.hr, 10) : undefined,
                bpSystolic: e.bp ? parseInt(e.bp.split('/')[0], 10) : undefined,
                temperatureF: e.tempF ?? undefined, // no default — only plot when explicitly recorded
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
        // regardless of whether vitals were entered — qualitative updates still appear
        setEventLog(prev => [
            ...prev,
            {
                id: `upd-pin-${Date.now()}`,
                elapsedSec,
                type: 'session_update',
                label: updateAffect ? `Update: ${updateAffect}` : 'Session Update',
            } satisfies SessionEventPin,
        ]);

        // Emit to log_clinical_vitals table seamlessly
        if ((updateHR || updateBPSys || updateBPDia) && journey.session?.sessionNumber) {
            try {
                await createSessionVital({
                    session_id: journey.session.sessionNumber.toString(),
                    heart_rate: updateHR ? parseInt(updateHR, 10) : undefined,
                    bp_systolic: updateBPSys ? parseInt(updateBPSys, 10) : undefined,
                    bp_diastolic: updateBPDia ? parseInt(updateBPDia, 10) : undefined,
                    source: 'Session Update Panel',
                });
            } catch (err) {
                console.warn('[Session Update] Failed to sync clinical vital:', err);
            }
        }

        // Reset fields
        setUpdateAffect(''); setUpdateResponsiveness(''); setUpdateComfort('');
        setUpdateNote(''); setUpdateHR(''); setUpdateBPSys(''); setUpdateBPDia('');
        setShowUpdatePanel(false);
        addToast({ title: 'Session Update Saved', message: `Logged at T+${elapsedTime}`, type: 'success' });
    };

    // ── Contraindication checker — MUST stay above early returns (Rules of Hooks) ──
    // GUARD: Only run after the practitioner has actually completed the Dosing Protocol form.
    // Without this, stale localStorage from a previous session would trigger warnings
    // before the user has entered anything in the current session.
    const contraindicationResults = useMemo(() => {
        // Do not evaluate until the step is complete
        if (!isDosingProtocolComplete) return null;
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
            // Medications: use same source + same fallback as patientMeds display below.
            // The isDosingProtocolComplete guard (line 315) already prevents phantom
            // warnings from stale localStorage — the fallback is safe here.
            let medications: string[] = [];
            try {
                const cachedMeds = localStorage.getItem('mock_patient_medications_names');
                if (cachedMeds) {
                    const parsed = JSON.parse(cachedMeds);
                    if (Array.isArray(parsed) && parsed.length) medications = parsed;
                }
            } catch (_) { }
            if (!substanceName) return null;
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
    }, [isDosingProtocolComplete, contraindicationKey, journey]);

    // Current meds list for display — MUST stay above early returns (Rules of Hooks)
    const patientMeds = useMemo(() => {
        try {
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
    // Live session: re-opens the Dosing Protocol form — the amendment is then
    // captured as a timestamped entry by the form's save handler.
    const handleClearSubstance = () => {
        if (isLive) {
            // Post-start: open form so change is recorded as a timestamped event
            onOpenForm('dosing-protocol');
        } else {
            // Pre-start: silent clear — no clinical record needed
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

    // ── POST-SESSION VIEW ──────────────────────────────────────────────────────────
    if (mode === 'post') {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-[#A8B5D1]">Session Closeout</h2>
                            <p className="text-slate-400 mt-1">Complete mandatory post-session documentation.</p>
                        </div>
                        <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
                            Phase 2: Closeout
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="p-5 bg-emerald-900/10 border border-emerald-900/30 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                    <CheckSquare className="w-5 h-5" />
                                </div>
                                <span className="text-[#A8B5D1] font-bold line-through decoration-emerald-500/50 decoration-2">Session End Time Recorded</span>
                            </div>
                            <span className="text-xs font-mono text-emerald-600 font-bold px-2 py-1 bg-emerald-500/10 rounded">AUTO</span>
                        </div>

                        <button
                            onClick={() => setShowAssessmentModal(true)}
                            className="w-full p-5 bg-slate-800/40 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/60 rounded-2xl flex items-center justify-between transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                {assessmentCompleted ? (
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                        <CheckSquare className="w-5 h-5" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full border-2 border-slate-600 flex items-center justify-center group-hover:border-blue-400 transition-colors">
                                        <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-blue-400 transition-colors opacity-0 group-hover:opacity-100" />
                                    </div>
                                )}
                                <div className="flex flex-col items-start">
                                    <span className={assessmentCompleted ? 'text-[#A8B5D1] font-bold line-through opacity-50' : 'text-[#A8B5D1] font-bold'}>
                                        Post-Session Assessments
                                    </span>
                                    <span className="text-xs text-slate-400">MEQ-30, EDI, CEQ (Standard Battery)</span>
                                </div>
                            </div>
                            {assessmentCompleted && <span className="text-xs font-bold text-emerald-500 px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20">COMPLETED</span>}
                        </button>

                        <div className="p-5 bg-slate-800/40 border border-slate-700 rounded-2xl flex items-center justify-between opacity-50 cursor-not-allowed">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full border-2 border-slate-600 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-slate-600" />
                                </div>
                                <span className="text-slate-400 font-bold">Review Safety Events (0)</span>
                            </div>
                            <span className="text-xs text-slate-600 font-bold border border-slate-700 px-2 py-1 rounded">NO EVENTS</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center pt-8 border-t border-slate-800">
                        <button
                            disabled={!assessmentCompleted}
                            onClick={onCompletePhase}
                            className={`w-full md:w-2/3 py-5 rounded-2xl font-black text-xl tracking-wide shadow-lg transition-all flex items-center justify-center gap-4 ${assessmentCompleted
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-900/40 cursor-pointer hover:scale-[1.01] active:scale-[0.99]'
                                : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                                }`}
                        >
                            <Lock className="w-5 h-5" />
                            SUBMIT & CLOSE SESSION
                        </button>
                        {!assessmentCompleted && (
                            <div className="flex items-center gap-2 mt-4 text-red-400/80 bg-red-950/20 px-3 py-1 rounded-full border border-red-900/30">
                                <AlertTriangle className="w-3 h-3" />
                                <span className="text-xs font-bold">Pending: Post-Session Assessments</span>
                            </div>
                        )}
                    </div>
                </div>

                {showAssessmentModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0a1628] rounded-2xl shadow-2xl border border-slate-700">
                            <button
                                onClick={() => setShowAssessmentModal(false)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors border border-slate-700 hover:border-slate-500"
                            >
                                <X className="w-5 h-5 text-slate-300" />
                            </button>
                            <div className="p-6">
                                <AdaptiveAssessmentPage
                                    showBackButton={false}
                                    onComplete={(scores) => {
                                        setAssessmentScores(scores);
                                        setAssessmentCompleted(true);
                                    }}
                                    onClose={() => setShowAssessmentModal(false)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ── BUILD STEP CARDS (pre + live) ──────────────────────────────────────────────
    const PHASE2_STEPS: Array<{ id: WellnessFormId | '__start__'; label: string; icon: string; isComplete: boolean }> = [
        {
            id: 'dosing-protocol',
            label: 'Dosing Protocol',
            icon: 'medication',
            isComplete: isDosingProtocolComplete,
        },
        ...(config.enabledFeatures.includes('session-vitals') ? [{
            id: 'session-vitals' as WellnessFormId,
            label: 'Baseline Vitals',
            icon: 'monitor_heart',
            isComplete: isVitalsComplete,
        }] : []),
        {
            id: '__start__',
            label: 'Start Session',
            icon: 'play_arrow',
            isComplete: isLive,
        },
    ];


    const currentStepIdx = isLive ? -1 : PHASE2_STEPS.findIndex(s => !s.isComplete);

    return (
        <>
            <div className="space-y-4 animate-in fade-in duration-500">

                {/* ── Section Label + Progress ─────────────────────────────────────── */}
                <div className="flex items-center justify-between px-1">
                    <h2 className="ppn-label" style={{ color: '#FBBF24' }}>
                        {isLive ? 'Session Active' : 'Session Preparation'} · {PHASE2_STEPS.length} Steps
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-amber-700 to-amber-400 rounded-full transition-all duration-700"
                                style={{ width: `${(PHASE2_STEPS.filter(s => s.isComplete).length / PHASE2_STEPS.length) * 100}%` }}
                                role="progressbar"
                                aria-valuenow={PHASE2_STEPS.filter(s => s.isComplete).length}
                                aria-valuemax={PHASE2_STEPS.length}
                                aria-label="Session preparation progress"
                            />
                        </div>
                        <span className="text-sm font-semibold text-slate-400">
                            {PHASE2_STEPS.filter(s => s.isComplete).length}/{PHASE2_STEPS.length}
                        </span>
                    </div>
                </div>

                {/* ── Step Cards (3-up, matching Phase 1 anatomy exactly) ──────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {PHASE2_STEPS.map((step, index) => {
                        const isStart = step.id === '__start__';
                        const isCurrent = !isLive && index === currentStepIdx;

                        return (
                            <div
                                key={step.id}
                                className={[
                                    'relative flex flex-col rounded-xl transition-all duration-300 overflow-hidden',
                                    step.isComplete
                                        ? 'bg-amber-900/20'
                                        : isCurrent
                                            ? 'bg-amber-950/60 shadow-lg shadow-amber-950/60'
                                            : 'bg-slate-800/20 hover:bg-slate-800/35',
                                ].join(' ')}
                            >
                                {/* Top accent stripe */}
                                <div className={[
                                    'h-0.5 w-full',
                                    step.isComplete ? 'bg-amber-600/60' : isCurrent ? 'bg-amber-400' : 'bg-slate-700/40',
                                ].join(' ')} aria-hidden="true" />

                                <div className="flex flex-col flex-1 p-4 gap-3">
                                    {/* Step label + status badge */}
                                    <div className="flex items-center justify-between gap-1">
                                        <span className={`font-['Manrope',sans-serif] text-xl md:text-2xl font-extrabold tracking-tight leading-none ${step.isComplete ? 'text-amber-300/80' : isCurrent ? 'text-amber-200/90' : 'text-slate-400/80'}`}>
                                            Step {index + 1}
                                        </span>
                                        {step.isComplete ? (
                                            <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" aria-label="Complete" />
                                        ) : (
                                            <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400">
                                                {isStart ? 'Gate' : 'Req'}
                                            </span>
                                        )}
                                    </div>

                                    {/* Icon + title */}
                                    <div className="flex items-start gap-2.5">
                                        <div className={[
                                            'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
                                            step.isComplete ? 'bg-amber-500/15' : isCurrent ? 'bg-amber-500/25' : 'bg-slate-700/30',
                                        ].join(' ')}>
                                            <span className={`material-symbols-outlined text-[18px] ${step.isComplete ? 'text-amber-400' : isCurrent ? 'text-amber-300' : 'text-slate-500'}`}>
                                                {step.icon}
                                            </span>
                                        </div>
                                        <h4 className={`text-sm md:text-base font-black leading-snug pt-1 ${step.isComplete ? 'text-amber-200' : isCurrent ? 'text-[#A8B5D1]' : 'text-slate-400'}`}>
                                            {step.label}
                                        </h4>
                                    </div>

                                    {/* CTA area */}
                                    <div className="mt-auto pt-2">
                                        {step.isComplete ? (
                                            <div className="flex flex-col items-center gap-1 mt-2">
                                                {/* Dosage HUD — only for dosing-protocol step */}
                                                {step.id === 'dosing-protocol' && (() => {
                                                    try {
                                                        const raw = localStorage.getItem('ppn_dosing_protocol');
                                                        if (!raw) return null;
                                                        const p = JSON.parse(raw);
                                                        const name = p.substance_name || p.substance;
                                                        const dose = p.dosage_amount;
                                                        const unit = p.dosage_unit || 'mg';
                                                        const route = p.route_of_administration;
                                                        if (!name) return null;
                                                        return (
                                                            <div className="w-full mb-2 px-3 py-2 bg-amber-950/40 border border-amber-700/30 rounded-xl text-center">
                                                                <p className="text-base font-black text-amber-200 uppercase tracking-widest leading-tight">{name}</p>
                                                                <div className="flex items-center justify-center gap-3 mt-1 text-sm font-bold text-amber-300/80">
                                                                    {dose && <span>{dose}{unit}</span>}
                                                                    {dose && route && <span className="text-amber-700">·</span>}
                                                                    {route && <span>{route}</span>}
                                                                </div>
                                                            </div>
                                                        );
                                                    } catch { return null; }
                                                })()}
                                                <span className="flex items-center gap-1.5 text-sm font-black uppercase tracking-widest text-amber-400">
                                                    <CheckCircle2 className="w-4 h-4" /> COMPLETED
                                                </span>
                                                {!isStart && (
                                                    <button
                                                        onClick={() => onOpenForm(step.id)}
                                                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-amber-300 transition-all"
                                                        aria-label={`Amend ${step.label}`}
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" aria-hidden="true" /> Amend
                                                    </button>
                                                )}
                                            </div>
                                        ) : isStart ? (
                                            /* Start Session CTA */
                                            <button
                                                onClick={canStartSession ? () => setAndPersistMode('live') : undefined}
                                                disabled={!canStartSession}
                                                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 font-black text-sm rounded-xl transition-all active:scale-95 ${canStartSession
                                                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-950/50'
                                                    : 'bg-slate-800/30 text-slate-600 cursor-not-allowed border border-slate-700/50'
                                                    }`}
                                                aria-label="Start dosing session"
                                            >
                                                {canStartSession ? (
                                                    <><Play className="w-4 h-4 fill-white" aria-hidden="true" /> Start</>
                                                ) : (
                                                    <><Lock className="w-4 h-4" aria-hidden="true" /> Locked</>
                                                )}
                                            </button>
                                        ) : isCurrent ? (
                                            <button
                                                onClick={() => onOpenForm(step.id)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600/40 hover:bg-amber-600/60 text-amber-100 font-black text-sm rounded-xl transition-all active:scale-95 shadow-md shadow-amber-950/50"
                                            >
                                                Open
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => onOpenForm(step.id)}
                                                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700/50 bg-slate-800/30 text-sm font-semibold text-slate-500 hover:text-slate-300 hover:bg-slate-700/40 hover:border-slate-600/50 transition-all"
                                            >
                                                Open
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Contraindication Alert ─────────────────────────────────────── */}
                {contraindicationResults && contraindicationResults.absoluteFlags.length > 0 ? (
                    /* ══ ABSOLUTE CONTRAINDICATION — Full-width emergency alert ══ */
                    <div className="relative rounded-2xl overflow-hidden border-2 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.35)] animate-pulse-border">
                        {/* Pulsing background glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-950/80 via-red-900/60 to-red-950/80 pointer-events-none" />
                        {/* Animated top stripe */}
                        <div className="relative bg-red-600 px-5 py-3 flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-white flex-shrink-0 animate-bounce" />
                            <span className="text-white font-black text-lg uppercase tracking-[0.2em]">⚠ ABSOLUTE CONTRAINDICATION — DO NOT ADMINISTER</span>
                        </div>
                        <div className="relative p-5 space-y-4">
                            {/* Drug pair callout: meds ✕ substance with functional clear button */}
                            <div className="flex items-center justify-center gap-4 flex-wrap">
                                {patientMeds.map((med, i) => (
                                    <span key={i} className="px-4 py-2 bg-red-900/60 border border-red-400/60 rounded-xl text-red-200 font-black text-base">
                                        {med}
                                    </span>
                                ))}
                                <span className="text-red-400 font-black text-2xl" aria-hidden="true">✕</span>
                                {/* Substance pill with clear button */}
                                <div className="flex items-center gap-1 px-4 py-2 bg-red-900/60 border border-red-400/60 rounded-xl">
                                    <span className="text-red-200 font-black text-base">
                                        {journey.session?.substance || 'Selected Substance'}
                                    </span>
                                    <button
                                        onClick={handleClearSubstance}
                                        aria-label={isLive ? 'Change substance (opens form — change will be timestamped)' : 'Clear substance selection'}
                                        title={isLive ? 'Change substance — will log a timestamped amendment' : 'Clear — re-select substance'}
                                        className="ml-2 w-5 h-5 flex items-center justify-center rounded-full bg-red-700/60 hover:bg-red-600 border border-red-500/60 hover:border-red-400 text-red-200 hover:text-white transition-all flex-shrink-0"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                            {/* Flag details — uses ContraindicationFlag.headline + .detail */}
                            <div className="space-y-2">
                                {contraindicationResults.absoluteFlags.map((flag: any, i: number) => {
                                    const sourceLinks = flag.regulatoryBasis ? getRegulatoryLinks(flag.regulatoryBasis) : [];
                                    return (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-red-950/50 rounded-xl border border-red-800/50">
                                            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-red-200 font-black text-sm uppercase tracking-wide">{flag.headline || 'Contraindicated Combination'}</p>
                                                <p className="text-red-300/80 text-sm mt-0.5 leading-relaxed">{flag.detail || 'This combination carries serious risk of adverse events. Session must not proceed.'}</p>
                                                {/* Clickable source links */}
                                                {sourceLinks.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {sourceLinks.map((link, li) => (
                                                            <a
                                                                key={li}
                                                                href={link.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-900/50 border border-red-600/40 text-red-300 hover:text-white hover:bg-red-800/60 hover:border-red-500/60 transition-colors text-xs font-semibold"
                                                                aria-label={`Read source: ${link.label}`}
                                                            >
                                                                <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                                                                {link.label}
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                                {/* Fallback: raw citation if no URL matched */}
                                                {sourceLinks.length === 0 && flag.regulatoryBasis && (
                                                    <p className="text-red-500/60 text-xs mt-1 font-mono">{flag.regulatoryBasis}</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Current meds footer */}
                            <div className="pt-3 border-t border-red-800/40 flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-red-500">Patient Medications:</span>
                                {patientMeds.map((med, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-900/40 border border-red-700/40 text-red-300 text-xs font-semibold">
                                        <Pill className="w-3 h-3" />{med}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : contraindicationResults && contraindicationResults.relativeFlags.length > 0 ? (
                    /* ══ RELATIVE CONTRAINDICATION — Amber warning ══ */
                    <div className="rounded-2xl border-2 border-amber-500/70 bg-gradient-to-br from-amber-950/60 to-amber-900/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                        <div className="bg-amber-600/90 px-5 py-3 flex items-center gap-3 rounded-t-xl">
                            <AlertCircle className="w-5 h-5 text-white flex-shrink-0" />
                            <span className="text-white font-black text-base uppercase tracking-[0.15em]">⚠ RELATIVE CONTRAINDICATION — Proceed with Caution</span>
                        </div>
                        <div className="p-5 space-y-3">
                            {contraindicationResults.relativeFlags.map((flag: any, i: number) => {
                                const sourceLinks = flag.regulatoryBasis ? getRegulatoryLinks(flag.regulatoryBasis) : [];
                                return (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-amber-950/40 rounded-xl border border-amber-700/40">
                                        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-amber-200 font-black text-sm uppercase tracking-wide">{flag.headline || 'Caution Required'}</p>
                                            <p className="text-amber-300/80 text-sm mt-0.5 leading-relaxed">{flag.detail || 'Proceed only with senior clinical oversight and documented risk acknowledgement.'}</p>
                                            {sourceLinks.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {sourceLinks.map((link, li) => (
                                                        <a
                                                            key={li}
                                                            href={link.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-900/50 border border-amber-600/40 text-amber-300 hover:text-white hover:bg-amber-800/60 hover:border-amber-500/60 transition-colors text-xs font-semibold"
                                                            aria-label={`Read source: ${link.label}`}
                                                        >
                                                            <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                                                            {link.label}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                            {sourceLinks.length === 0 && flag.regulatoryBasis && (
                                                <p className="text-amber-500/60 text-xs mt-1 font-mono">{flag.regulatoryBasis}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="pt-2 border-t border-amber-800/40 flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-amber-500">Current Medications:</span>
                                {patientMeds.map((med, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-900/40 border border-amber-700/40 text-amber-300 text-xs font-semibold">
                                        <Pill className="w-3 h-3" />{med}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ══ ALL CLEAR or no substance yet — compact strip ══ */
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/40">
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">Current Medications</p>
                            <div className="flex flex-wrap gap-1.5">
                                {patientMeds.map((med, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs font-semibold">
                                        <Pill className="w-3 h-3 text-slate-500" />{med}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            {!contraindicationResults ? (
                                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                    <ShieldAlert className="w-4 h-4" /> No substance selected
                                </span>
                            ) : (
                                <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-600/40 text-emerald-300 text-sm font-black uppercase tracking-wider">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    ALL CLEAR — No Contraindications
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Session HUD (sticky when live) — shows timer + most recent vitals ── */}
                <div className={`rounded-2xl border transition-all duration-500 ${isLive ? 'sticky top-2 z-30 bg-[#061115]/95 border-emerald-900/40 shadow-lg shadow-emerald-950/30 backdrop-blur-xl'
                    : 'bg-slate-900/30 border-slate-800/40 opacity-50 select-none'
                    }`}>
                    <div className="flex items-center justify-between px-5 py-4 gap-4 flex-wrap">

                        {/* ── Left: Session status + elapsed timer ── */}
                        <div className="flex items-center gap-5">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-600/80 font-bold mb-0.5">
                                    {isLive ? 'Session Active' : 'Session Timer'}
                                </p>
                                <p className="text-2xl font-black text-emerald-50/90 font-mono tracking-tight leading-none tabular-nums">
                                    {elapsedTime}
                                </p>
                            </div>

                            {/* ── Most recently logged vitals from Session Updates ── */}
                            {isLive && (() => {
                                // Pull the most recent update entry that has vitals
                                const lastWithVitals = updateLog.find(e => e.hr || e.bp);
                                const latestHr = lastWithVitals?.hr || liveVitals.hr.toString();
                                const latestBp = lastWithVitals?.bp || liveVitals.bp;
                                const latestSpo2 = liveVitals.spo2;
                                const lastTime = lastWithVitals?.timestamp;
                                return (
                                    <div className="flex items-stretch gap-0 bg-[#040C0E]/60 rounded-xl border border-[#14343B]/40 overflow-hidden">
                                        <div className="px-4 py-2.5 text-center border-r border-[#14343B]/40">
                                            <p className="text-[10px] uppercase tracking-widest text-[#507882] font-semibold mb-1">HR</p>
                                            <div className="flex items-center gap-1 justify-center">
                                                <Heart className="w-3 h-3 text-rose-500/80 fill-rose-500/30 animate-pulse" />
                                                <p className="text-xl font-black text-emerald-100 leading-none tabular-nums">{latestHr}</p>
                                                <p className="text-[10px] text-slate-600 font-semibold self-end mb-0.5">bpm</p>
                                            </div>
                                        </div>
                                        <div className="px-4 py-2.5 text-center border-r border-[#14343B]/40">
                                            <p className="text-[10px] uppercase tracking-widest text-[#507882] font-semibold mb-1">BP</p>
                                            <p className="text-xl font-black text-emerald-100 leading-none tabular-nums">{latestBp}</p>
                                        </div>
                                        <div className="px-4 py-2.5 text-center border-r border-[#14343B]/40">
                                            <p className="text-[10px] uppercase tracking-widest text-[#507882] font-semibold mb-1">SpO2</p>
                                            <p className={`text-xl font-black leading-none tabular-nums ${latestSpo2 < 95 ? 'text-amber-400' : 'text-emerald-100'
                                                }`}>{latestSpo2}%</p>
                                        </div>
                                        <div className="px-3 py-2.5 flex flex-col justify-center">
                                            <p className="text-[9px] uppercase tracking-widest text-[#507882] font-semibold">Last logged</p>
                                            <p className="text-[11px] font-mono text-slate-500 leading-tight mt-0.5">
                                                {lastTime ?? '— not yet recorded'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* ── Right: Companion + End Session buttons (live only) ── */}
                        {isLive && (
                            <div className="flex items-center gap-3 ml-auto">
                                <button
                                    onClick={() => setShowCompanion(true)}
                                    className="px-4 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-semibold rounded-xl border border-indigo-500/30 transition-colors uppercase tracking-widest text-xs flex items-center gap-1.5"
                                    aria-label="Open patient companion view"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Companion
                                </button>
                                <button
                                    onClick={() => {
                                        try {
                                            setAndPersistMode('post');
                                        } catch (e) {
                                            console.error('[TreatmentPhase] mode transition failed, falling back to phase complete', e);
                                            onCompletePhase();
                                        }
                                    }}
                                    className="px-5 py-2.5 bg-[#0A1F24] hover:bg-[#0E292E] text-[#6E9CA8] hover:text-[#A3C7D2] font-semibold rounded-xl border border-[#14343B] transition-colors uppercase tracking-[0.15em] text-xs flex items-center gap-2 group"
                                >
                                    End Session
                                    <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Three Action Buttons ────────────────────────────────────────── */}
                <div className="grid grid-cols-3 gap-3">
                    <button onClick={isLive ? () => setShowUpdatePanel(p => !p) : undefined} disabled={!isLive}
                        className={`flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-2xl font-black text-sm tracking-wide transition-all active:scale-95 border ${isLive ? (showUpdatePanel ? 'bg-emerald-600/30 border-emerald-400/60 text-emerald-100' : 'bg-gradient-to-br from-emerald-900/60 to-teal-900/40 hover:from-emerald-800/70 border-emerald-500/40 hover:border-emerald-400/60 text-emerald-100') : 'bg-slate-800/20 border-slate-700/30 text-slate-600 cursor-not-allowed'} shadow-lg`}
                        aria-label="Log session update">
                        <ClipboardList className={`w-5 h-5 ${isLive ? 'text-emerald-300' : 'text-slate-600'}`} />
                        <span>Session Update</span>
                    </button>
                    <button onClick={isLive ? () => {
                        // WO-528: stamp rescue event pin on the chart immediately
                        setEventLog(prev => [...prev, {
                            id: `rescue-${Date.now()}`,
                            elapsedSec: getElapsedSec(),
                            type: 'rescue-protocol',
                            label: 'Rescue Protocol',
                        } satisfies SessionEventPin]);
                        onOpenForm('rescue-protocol');
                    } : undefined} disabled={!isLive}
                        className={`flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-2xl font-black text-sm tracking-wide transition-all active:scale-95 border ${isLive ? 'bg-gradient-to-br from-purple-900/60 to-fuchsia-900/40 hover:from-purple-800/70 border-purple-500/40 hover:border-purple-400/60 text-purple-100 shadow-lg shadow-purple-950/40' : 'bg-slate-800/20 border-slate-700/30 text-slate-600 cursor-not-allowed'}`}
                        aria-label="Log rescue protocol">
                        <span className={`material-symbols-outlined text-[20px] ${isLive ? 'text-purple-300' : 'text-slate-600'}`}>emergency</span>
                        <span>Rescue Protocol</span>
                    </button>
                    <button onClick={isLive ? () => {
                        // WO-528: stamp adverse event pin on the chart immediately
                        setEventLog(prev => [...prev, {
                            id: `adverse-${Date.now()}`,
                            elapsedSec: getElapsedSec(),
                            type: 'safety-and-adverse-event',
                            label: 'Adverse Event',
                        } satisfies SessionEventPin]);
                        onOpenForm('safety-and-adverse-event');
                    } : undefined} disabled={!isLive}
                        className={`flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-2xl font-black text-sm tracking-wide transition-all active:scale-95 border ${isLive ? 'bg-gradient-to-br from-red-900/60 to-rose-900/40 hover:from-red-800/70 border-red-500/40 hover:border-red-400/60 text-red-100 shadow-lg shadow-red-950/40' : 'bg-slate-800/20 border-slate-700/30 text-slate-600 cursor-not-allowed'}`}
                        aria-label="Log adverse reaction">
                        <AlertTriangle className={`w-5 h-5 ${isLive ? 'text-red-300' : 'text-slate-600'}`} />
                        <span>Adverse Event</span>
                    </button>
                </div>

                {/* ── Session Update Panel ───────────────────────────────────────────── */}
                {showUpdatePanel && isLive && (
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-black text-emerald-300 uppercase tracking-widest">Session Update</p>
                                <p className="text-xs text-slate-500 mt-0.5">T+{elapsedTime} · {new Date().toLocaleTimeString()}</p>
                            </div>
                            <button onClick={() => setShowUpdatePanel(false)} className="text-slate-500 hover:text-slate-300 transition-colors p-1"><X className="w-4 h-4" /></button>
                        </div>
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
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">HR (bpm) — optional</label>
                                <input type="number" min="30" max="220" placeholder="e.g. 88" value={updateHR} onChange={e => setUpdateHR(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-200 text-sm placeholder-slate-600 focus:outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Systolic — optional</label>
                                <input type="number" placeholder="e.g. 120" value={updateBPSys} onChange={e => setUpdateBPSys(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-200 text-sm placeholder-slate-600 focus:outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Diastolic — optional</label>
                                <input type="number" placeholder="e.g. 80" value={updateBPDia} onChange={e => setUpdateBPDia(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-200 text-sm placeholder-slate-600 focus:outline-none transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Session note — optional</label>
                            <textarea rows={2} placeholder="Brief observation (no PHI)…" value={updateNote} onChange={e => setUpdateNote(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-200 text-sm placeholder-slate-600 focus:outline-none transition-all resize-none" />
                            <p className="text-xs text-slate-600 mt-1 italic">Session-local only — exported with session summary. Not logged to the database.</p>
                        </div>
                        <button onClick={handleSaveUpdate}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition-all active:scale-95">
                            <Save className="w-4 h-4" /> Save Update
                        </button>
                    </div>
                )}

                {/* ── Cockpit Real Estate: always fixed between buttons and update log ── */}
                {isLive && (
                    <div className="space-y-6">
                        {config.enabledFeatures.includes('session-vitals') && (
                            <SessionVitalsTrendChart
                                sessionId={journey.sessionId || journey.session?.sessionNumber?.toString() || '1'}
                                substance={journey.session?.substance}
                                onThresholdViolation={(vital, value) => {
                                    addToast({
                                        title: `[ALERT] ${vital} threshold exceeded`,
                                        message: `${vital}: ${value} — review immediately`,
                                        type: 'error',
                                        persistent: true
                                    });
                                }}
                                data={vitalsChartData}
                                events={eventLog}
                                sessionDurationSec={sessionDurationSec}
                            />
                        )}
                        <LiveSessionTimeline
                            sessionId={journey.sessionId || journey.session?.sessionNumber?.toString() || '1'}
                            active={true}
                        />
                    </div>
                )}

                {/* ── Update Log — grows below the fixed chart ─────────────────────── */}
                {updateLog.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 px-1">Session Updates ({updateLog.length})</p>
                        {updateLog.map((entry, i) => (
                            <div key={i} className="flex gap-3 p-3 bg-slate-800/40 border border-slate-700/40 rounded-xl text-sm">
                                <div className="flex-shrink-0 text-right min-w-[56px]">
                                    <p className="font-mono text-xs font-bold text-emerald-400">T+{entry.elapsed}</p>
                                    <p className="text-[10px] text-slate-600">{entry.timestamp}</p>
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex flex-wrap gap-1.5">
                                        {entry.affect && <span className="px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-300 text-xs font-semibold">{entry.affect}</span>}
                                        {entry.responsiveness && <span className="px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-300 text-xs font-semibold">{entry.responsiveness}</span>}
                                        {entry.comfort && <span className="px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-300 text-xs font-semibold">{entry.comfort}</span>}
                                        {(entry.hr || entry.bp) && (
                                            <span className="px-2 py-0.5 rounded-md bg-emerald-900/40 border border-emerald-700/30 text-emerald-300 text-xs font-semibold">
                                                {entry.hr && `HR ${entry.hr}`}{entry.hr && entry.bp && ' · '}{entry.bp && `BP ${entry.bp}`}
                                            </span>
                                        )}
                                    </div>
                                    {entry.note && <p className="text-slate-400 text-xs italic">{entry.note}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Keyboard shortcuts hint */}
                {isLive && (
                    <div className="flex items-center justify-center gap-4 px-4 py-2.5 bg-slate-900/40 border border-slate-800/50 rounded-xl">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-600">Quick Keys:</p>
                        {[{ key: 'U', label: 'Update' }, { key: 'V', label: 'Vitals' }, { key: 'A', label: 'Adverse' }].map(({ key, label }) => (
                            <div key={key} className="flex items-center gap-1.5">
                                <kbd className="inline-flex items-center justify-center w-5 h-5 rounded bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-400">{key}</kbd>
                                <span className="text-xs text-slate-600">{label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Companion Overlay: fixed layer, timer stays running ─────────── */}
            {
                showCompanion && (
                    <div className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden selection:bg-transparent">

                        {/* Close — absolute top-right, above everything */}
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

                        {/* Full-screen flex-col: video fills top, buttons at bottom */}
                        <div className="flex flex-col flex-1 min-h-0 pt-14">
                            <CompanionVideo />
                            <CompanionButtonGrid
                                sessionId={journey.sessionId || 'demo-1'}
                            />
                        </div>

                    </div>
                )
            }
        </>
    );
};
