import React, { Component, useState, useEffect, useMemo } from 'react';
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
import { SessionVitalsTrendChart } from './SessionVitalsTrendChart';
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

// Emotional states for companion overlay
const COMPANION_FEELINGS = [
    { id: 'blissful', label: 'Blissful', color: 'bg-emerald-500/20 border-emerald-400/50 hover:bg-emerald-500/40 text-emerald-100' },
    { id: 'peaceful', label: 'Peaceful', color: 'bg-teal-500/20 border-teal-400/50 hover:bg-teal-500/40 text-teal-100' },
    { id: 'grounded', label: 'Grounded / Safe', color: 'bg-cyan-500/20 border-cyan-400/50 hover:bg-cyan-500/40 text-cyan-100' },
    { id: 'connected', label: 'Connected', color: 'bg-sky-500/20 border-sky-400/50 hover:bg-sky-500/40 text-sky-100' },
    { id: 'euphoric', label: 'Euphoric', color: 'bg-violet-500/20 border-violet-400/50 hover:bg-violet-500/40 text-violet-100' },
    { id: 'drifting', label: 'Drifting / Floating', color: 'bg-indigo-500/20 border-indigo-400/50 hover:bg-indigo-500/40 text-indigo-100' },
    { id: 'curious', label: 'Curious', color: 'bg-purple-500/20 border-purple-400/50 hover:bg-purple-500/40 text-purple-100' },
    { id: 'open', label: 'Open / Surrendered', color: 'bg-fuchsia-500/20 border-fuchsia-400/50 hover:bg-fuchsia-500/40 text-fuchsia-100' },
    { id: 'emotional', label: 'Emotional / Crying', color: 'bg-blue-500/20 border-blue-400/50 hover:bg-blue-500/40 text-blue-100' },
    { id: 'confused', label: 'Confused', color: 'bg-slate-500/20 border-slate-400/50 hover:bg-slate-500/40 text-slate-100' },
    { id: 'anxious', label: 'Anxious', color: 'bg-amber-500/20 border-amber-400/50 hover:bg-amber-500/40 text-amber-100' },
    { id: 'overwhelmed', label: 'Overwhelmed', color: 'bg-orange-500/20 border-orange-400/50 hover:bg-orange-500/40 text-orange-100' },
    { id: 'tense', label: 'Tense / Resistance', color: 'bg-rose-500/20 border-rose-400/50 hover:bg-rose-500/40 text-rose-100' },
    { id: 'fearful', label: 'Fearful', color: 'bg-red-600/20 border-red-500/50 hover:bg-red-600/40 text-red-100' },
    { id: 'nauseous', label: 'Nauseous', color: 'bg-yellow-700/20 border-yellow-600/50 hover:bg-yellow-700/40 text-yellow-100' },
    { id: 'need_support', label: 'Need Support', color: 'bg-pink-600/30 border-pink-400/60 hover:bg-pink-600/50 text-pink-100 ring-1 ring-pink-400/40' },
];

export const TreatmentPhase: React.FC<TreatmentPhaseProps> = ({ journey, completedForms, onOpenForm, onCompletePhase }) => {

    const { addToast } = useToast();
    const { config } = useProtocol();
    const SESSION_KEY = `ppn_session_mode_${journey.session?.sessionId ?? journey.sessionId ?? 'demo'}`;
    const SESSION_START_KEY = `ppn_session_start_${journey.session?.sessionId ?? journey.sessionId ?? 'demo'}`;

    // Bump this counter whenever we want to force a contraindication re-evaluation
    const [contraindicationKey, setContraindicationKey] = useState(0);

    // Re-evaluate contraindications when dosing protocol or medications are updated
    // in localStorage (DosingProtocolForm and StructuredSafetyCheckForm write these keys)
    useEffect(() => {
        const bump = () => setContraindicationKey(k => k + 1);
        // storage event = cross-tab writes; ppn:dosing-updated = same-tab writes
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'ppn_dosing_protocol' || e.key === 'mock_patient_medications_names') bump();
        };
        window.addEventListener('storage', handleStorage);
        window.addEventListener('ppn:dosing-updated', bump);
        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('ppn:dosing-updated', bump);
        };
    }, []);

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
                case 'v': onOpenForm('session-vitals'); break;
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
    }
    const [updateLog, setUpdateLog] = useState<SessionUpdateEntry[]>([]);

    const handleSaveUpdate = async () => {
        const bpStr = (updateBPSys || updateBPDia) ? `${updateBPSys || '?'}/${updateBPDia || '?'}` : '';
        const entry: SessionUpdateEntry = {
            timestamp: new Date().toLocaleTimeString(),
            elapsed: elapsedTime,
            affect: updateAffect,
            responsiveness: updateResponsiveness,
            comfort: updateComfort,
            note: updateNote.trim(),
            hr: updateHR,
            bp: bpStr,
        };
        setUpdateLog(prev => [entry, ...prev]);

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
            const DEMO_MEDS = ['Lithium', 'Sertraline (tapering)', 'Lisinopril'];
            let medications: string[] = [];
            try {
                const cachedMeds = localStorage.getItem('mock_patient_medications_names');
                if (cachedMeds) {
                    const parsed = JSON.parse(cachedMeds);
                    medications = Array.isArray(parsed) && parsed.length ? parsed : DEMO_MEDS;
                } else {
                    medications = DEMO_MEDS;
                }
            } catch (_) {
                medications = DEMO_MEDS;
            }
            if (!substanceName || !medications.length) return null;
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
        return ['Lithium', 'Sertraline (tapering)', 'Lisinopril'];
    }, []);

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
                    <h2 className="ppn-label" style={{ color: '#34D399' }}>
                        {isLive ? 'Session Active' : 'Session Preparation'} · {PHASE2_STEPS.length} Steps
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-700 to-emerald-400 rounded-full transition-all duration-700"
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
                                        ? 'bg-teal-900/20'
                                        : isCurrent
                                            ? 'bg-emerald-900/40 shadow-lg shadow-emerald-950/60'
                                            : 'bg-slate-800/20 hover:bg-slate-800/35',
                                ].join(' ')}
                            >
                                {/* Top accent stripe */}
                                <div className={[
                                    'h-0.5 w-full',
                                    step.isComplete ? 'bg-teal-600/60' : isCurrent ? 'bg-emerald-400' : 'bg-slate-700/40',
                                ].join(' ')} aria-hidden="true" />

                                <div className="flex flex-col flex-1 p-4 gap-3">
                                    {/* Step label + status badge */}
                                    <div className="flex items-center justify-between gap-1">
                                        <span className={`text-xs md:text-sm font-bold uppercase tracking-widest ${step.isComplete ? 'text-teal-500' : isCurrent ? 'text-emerald-400' : 'text-slate-500'}`}>
                                            Step {index + 1}
                                        </span>
                                        {step.isComplete ? (
                                            <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" aria-label="Complete" />
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
                                            step.isComplete ? 'bg-teal-500/15' : isCurrent ? 'bg-emerald-500/25' : 'bg-slate-700/30',
                                        ].join(' ')}>
                                            <span className={`material-symbols-outlined text-[18px] ${step.isComplete ? 'text-teal-400' : isCurrent ? 'text-emerald-300' : 'text-slate-500'}`}>
                                                {step.icon}
                                            </span>
                                        </div>
                                        <h4 className={`text-sm md:text-base font-black leading-snug pt-1 ${step.isComplete ? 'text-teal-200' : isCurrent ? 'text-[#A8B5D1]' : 'text-slate-400'}`}>
                                            {step.label}
                                        </h4>
                                    </div>

                                    {/* CTA area */}
                                    <div className="mt-auto pt-2">
                                        {step.isComplete ? (
                                            <div className="flex flex-col items-center gap-1 mt-2">
                                                <span className="flex items-center gap-1.5 text-sm font-black uppercase tracking-widest text-teal-400">
                                                    <CheckCircle2 className="w-4 h-4" /> COMPLETED
                                                </span>
                                                {!isStart && (
                                                    <button
                                                        onClick={() => onOpenForm(step.id)}
                                                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-teal-300 transition-all"
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
                                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/50'
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
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600/40 hover:bg-emerald-600/60 text-emerald-100 font-black text-sm rounded-xl transition-all active:scale-95 shadow-md shadow-emerald-950/50"
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
                            {/* Drug pair callout: show all meds that are in the MEDICATION category flags */}
                            <div className="flex items-center justify-center gap-4 flex-wrap">
                                {patientMeds.map((med, i) => (
                                    <span key={i} className="px-4 py-2 bg-red-900/60 border border-red-400/60 rounded-xl text-red-200 font-black text-base">
                                        {med}
                                    </span>
                                ))}
                                <span className="text-red-400 font-black text-2xl">✕</span>
                                <span className="px-4 py-2 bg-red-900/60 border border-red-400/60 rounded-xl text-red-200 font-black text-base">
                                    {journey.session?.substance || 'Selected Substance'}
                                </span>
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

                {/* ── Timer Bar (sticky when live) ──────────────────────────────────── */}
                <div className={`rounded-2xl border transition-all duration-500 ${isLive ? 'sticky top-2 z-30 bg-[#061115]/95 border-emerald-900/40 shadow-lg shadow-emerald-950/30 backdrop-blur-xl'
                    : 'bg-slate-900/30 border-slate-800/40 opacity-50 select-none'
                    }`}>
                    <div className="flex items-center justify-between px-5 py-4 gap-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-600/80 font-bold mb-0.5">
                                {isLive ? 'Session Active' : 'Session Timer'}
                            </p>
                            <p className="text-3xl font-black text-emerald-50/90 font-mono tracking-tight leading-none tabular-nums">
                                {elapsedTime}
                            </p>
                        </div>

                        {/* Live vitals ticker */}
                        {isLive && config.enabledFeatures.includes('session-vitals') && (
                            <div className="flex items-center gap-5 bg-[#040C0E]/60 px-4 py-3 rounded-xl border border-[#14343B]/40">
                                <div className="text-right">
                                    <p className="text-[10px] uppercase tracking-widest text-[#507882] font-semibold mb-0.5">HR</p>
                                    <div className="flex items-center gap-1 justify-end">
                                        <Heart className="w-3 h-3 text-rose-500/80 fill-rose-500/30 animate-pulse" />
                                        <p className="text-lg font-bold text-emerald-100 leading-none">{liveVitals.hr}</p>
                                    </div>
                                </div>
                                <div className="w-px h-6 bg-[#14343B]/50" />
                                <div className="text-right">
                                    <p className="text-[10px] uppercase tracking-widest text-[#507882] font-semibold mb-0.5">BP</p>
                                    <p className="text-lg font-bold text-emerald-100 leading-none">{liveVitals.bp}</p>
                                </div>
                                <div className="w-px h-6 bg-[#14343B]/50" />
                                <div className="text-right">
                                    <p className="text-[10px] uppercase tracking-widest text-[#507882] font-semibold mb-0.5">SpO2</p>
                                    <p className={`text-lg font-bold leading-none ${liveVitals.spo2 < 95 ? 'text-amber-400' : 'text-emerald-100'}`}>{liveVitals.spo2}%</p>
                                </div>
                            </div>
                        )}

                        {/* End session button — only when live */}
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
                    <button onClick={isLive ? () => onOpenForm('rescue-protocol') : undefined} disabled={!isLive}
                        className={`flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-2xl font-black text-sm tracking-wide transition-all active:scale-95 border ${isLive ? 'bg-gradient-to-br from-purple-900/60 to-fuchsia-900/40 hover:from-purple-800/70 border-purple-500/40 hover:border-purple-400/60 text-purple-100 shadow-lg shadow-purple-950/40' : 'bg-slate-800/20 border-slate-700/30 text-slate-600 cursor-not-allowed'}`}
                        aria-label="Log rescue protocol">
                        <span className={`material-symbols-outlined text-[20px] ${isLive ? 'text-purple-300' : 'text-slate-600'}`}>emergency</span>
                        <span>Rescue Protocol</span>
                    </button>
                    <button onClick={isLive ? () => onOpenForm('safety-and-adverse-event') : undefined} disabled={!isLive}
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

                {/* ── Update Log ──────────────────────────────────────────────────── */}
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

                {/* Keyboard shortcuts hint — live only */}
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

                {/* ── Cockpit Real Estate (live session outputs) ───────────────────── */}
                {isLive && (
                    <div className="space-y-6">
                        {config.enabledFeatures.includes('session-vitals') && (
                            <SessionVitalsTrendChart
                                sessionId={journey.session?.sessionNumber?.toString() || '1'}
                                substance={journey.session?.substance}
                                onThresholdViolation={(vital, value) => {
                                    addToast({
                                        title: `[ALERT] ${vital} threshold exceeded`,
                                        message: `${vital}: ${value} — review immediately`,
                                        type: 'error',
                                        persistent: true
                                    });
                                }}
                            />
                        )}
                        <LiveSessionTimeline
                            sessionId={journey.session?.sessionNumber?.toString() || '1'}
                            active={true}
                        />
                    </div>
                )}
            </div>

            {/* ── Companion Overlay: fixed layer, timer stays running ─────────── */}
            {
                showCompanion && (
                    <div className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden selection:bg-transparent">
                        {/* Spherecules video */}
                        <div className="absolute inset-0 z-0 pointer-events-none">
                            <video
                                src="/admin_uploads/spherecules.mp4"
                                autoPlay loop muted playsInline
                                className="w-full h-full object-cover opacity-90 mix-blend-screen"
                            />
                        </div>
                        {/* Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 z-10 pointer-events-none" />

                        {/* Close button — top-right, instant exit */}
                        <button
                            onClick={() => setShowCompanion(false)}
                            className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 hover:text-white backdrop-blur-md transition-all"
                            aria-label="Return to session"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="absolute top-4 right-16 z-50">
                            <span className="text-[11px] font-bold tracking-widest text-white/40 uppercase">Return to session</span>
                        </div>

                        {/* Prompt */}
                        <div className="relative z-20 pt-5 text-center pointer-events-none">
                            <p className="text-white/40 text-sm font-semibold tracking-[0.2em] uppercase">Tap to quietly log your state</p>
                        </div>

                        {/* Spacer — lets video breathe above buttons */}
                        <div className="flex-1" />

                        {/* Button grid — solid dark block BELOW video */}
                        <div className="relative z-20 w-full bg-black/70 backdrop-blur-md border-t border-white/10 px-4 py-5">
                            <div className="grid grid-cols-4 gap-2 max-w-5xl mx-auto">
                                {COMPANION_FEELINGS.map(f => (
                                    <button
                                        key={f.id}
                                        onClick={() => {
                                            const key = `companion_logs_${journey.sessionId || 'demo-1'}`;
                                            const existing = JSON.parse(localStorage.getItem(key) || '[]');
                                            existing.push({ timestamp: new Date().toISOString(), feeling: f.id });
                                            localStorage.setItem(key, JSON.stringify(existing));
                                        }}
                                        className={`${f.color} backdrop-blur-lg border rounded-xl px-2 py-3 text-xs font-bold tracking-wide uppercase text-center transition-all duration-200 active:scale-95 active:brightness-150 shadow-lg`}
                                        aria-label={`Log feeling: ${f.label}`}
                                    >{f.label}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
        </>
    );
};
