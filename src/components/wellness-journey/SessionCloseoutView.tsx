/**
 * SessionCloseoutView — Phase 2 post-session closeout presenter.
 *
 * Extracted from DosingSessionPhase.tsx (lines 866-1046) as part of the
 * Stabilisation Sprint Track 2 component split. This is a pure presentational
 * component: it owns no state and makes no DB calls. All data arrives via props
 * from the TreatmentPhase orchestrator.
 *
 * @see DosingSessionPhase.tsx (orchestrator)
 */

import React from 'react';
import {
    Activity, CheckSquare, Lock, ChevronUp, ChevronDown, AlertTriangle, X,
} from 'lucide-react';
import AdaptiveAssessmentPage from '../../pages/AdaptiveAssessmentPage';
import { LiveSessionTimeline } from './LiveSessionTimeline';
import { SessionVitalsTrendChart, VitalsSnapshot, SessionEventPin } from './SessionVitalsTrendChart';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SessionCloseoutViewProps {
    /** The session journey object from WellnessJourney */
    journey: any;
    /** Whether the post-session assessment battery has been completed */
    assessmentCompleted: boolean;
    /** Scores returned from AdaptiveAssessmentPage on completion */
    assessmentScores: { meq: number; edi: number; ceq: number } | null;
    /** True if any distress/safety event was logged during the session */
    hasSafetyEvents: boolean;
    /** Controls the assessment modal open/close state */
    showAssessmentModal: boolean;
    /** Controls the accordion for the collapsible session timeline */
    showPostSessionTimeline: boolean;
    /** Vitals data points for the read-only chart in the accordion */
    vitalsChartData: VitalsSnapshot[];
    /** Event pins for the chart overlay strip */
    eventLog: SessionEventPin[];
    /** Session duration in seconds, drives chart x-axis domain */
    sessionDurationSec: number;
    /** Visibility filter state synced with the live cockpit filter toggles */
    chartVisible: { hr: boolean; bp: boolean; temp: boolean; events: boolean };
    /** Milliseconds timestamp of the session start, for T+ display in timeline */
    sessionStartMs: number | undefined;
    /** Protocol feature flags */
    config: { enabledFeatures: string[] };
    /** Open or close the assessment modal */
    setShowAssessmentModal: (v: boolean) => void;
    /** Toggle the post-session timeline accordion */
    setShowPostSessionTimeline: (v: boolean) => void;
    /** Mark assessment as complete after AdaptiveAssessmentPage calls onComplete */
    setAssessmentCompleted: (v: boolean) => void;
    /** Store assessment scores returned from AdaptiveAssessmentPage */
    setAssessmentScores: (v: { meq: number; edi: number; ceq: number } | null) => void;
    /** Advance the phase after the practitioner clicks Submit & Close */
    onCompletePhase: () => void;
    /** Persist session close + assessment scores to the DB ledger */
    onSubmitAndClose: () => Promise<void>;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const SessionCloseoutView: React.FC<SessionCloseoutViewProps> = ({
    journey,
    assessmentCompleted,
    assessmentScores,
    hasSafetyEvents,
    showAssessmentModal,
    showPostSessionTimeline,
    vitalsChartData,
    eventLog,
    sessionDurationSec,
    chartVisible,
    sessionStartMs,
    config,
    setShowAssessmentModal,
    setShowPostSessionTimeline,
    setAssessmentCompleted,
    setAssessmentScores,
    onCompletePhase,
    onSubmitAndClose,
}) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">

        {/* ── Collapsible accordion: session chart + ledger during closeout ── */}
        <div className="bg-slate-900/40 border border-slate-700/40 rounded-2xl overflow-hidden">
            <button
                onClick={() => setShowPostSessionTimeline(!showPostSessionTimeline)}
                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-800/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                aria-expanded={showPostSessionTimeline}
                aria-controls="post-session-timeline-panel"
            >
                <div className="flex items-center gap-2.5">
                    <Activity className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest">View Session Timeline &amp; Ledger</span>
                </div>
                {showPostSessionTimeline
                    ? <ChevronUp className="w-4 h-4 text-slate-500" />
                    : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>
            {showPostSessionTimeline && (
                <div id="post-session-timeline-panel" className="px-5 pb-5 pt-2 space-y-5 border-t border-slate-700/40 animate-in slide-in-from-top-2 duration-200">
                    {/* WO-707 Fix 1: Removed session-vitals feature flag guard.
                     *  The flag gates the live vitals form, not the read-only post-session chart.
                     *  Chart renders whenever a real sessionId is present and the accordion is open.
                     */}
                    <SessionVitalsTrendChart
                        sessionId={journey.sessionId || journey.session?.sessionNumber?.toString() || '1'}
                        substance={journey.session?.substance}
                        onThresholdViolation={() => { }}
                        data={vitalsChartData}
                        events={eventLog}
                        sessionDurationSec={sessionDurationSec}
                        onVisibilityChange={() => { }}
                    />
                    {/* WO-708 Fix 2: visible always all-true in post-session.
                     *  The live chartVisible filter state should not hide event categories
                     *  in the read-only post-session record. Show everything.
                     */}
                    <LiveSessionTimeline
                        sessionId={journey.sessionId || journey.session?.sessionNumber?.toString() || '1'}
                        active={false}
                        visible={{ hr: true, bp: true, temp: true, events: true }}
                        sessionStartMs={sessionStartMs}
                    />
                </div>
            )}
        </div>

        {/* ── Closeout checklist card ── */}
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
                {/* Session End Time — auto-recorded row */}
                <div className="p-5 bg-emerald-900/10 border border-emerald-900/30 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                            <CheckSquare className="w-5 h-5" />
                        </div>
                        <span className="text-[#A8B5D1] font-bold line-through decoration-emerald-500/50 decoration-2">Session End Time Recorded</span>
                    </div>
                    <span className="text-xs font-mono text-emerald-600 font-bold px-2 py-1 bg-emerald-500/10 rounded">AUTO</span>
                </div>

                {/* Post-session assessments row */}
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

                {/* Safety events review row — WO-B3: interactive when events exist */}
                {hasSafetyEvents ? (
                    <button
                        onClick={() => setShowPostSessionTimeline(true)}
                        className="w-full p-5 bg-amber-900/10 border border-amber-700/40 hover:border-amber-500/50 hover:bg-amber-900/20 rounded-2xl flex items-center justify-between transition-all group"
                        aria-label="Review safety events — opens session timeline"
                        aria-controls="post-session-timeline-panel"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full border-2 border-amber-500 bg-amber-500/10 flex items-center justify-center">
                                <CheckSquare className="w-5 h-5 text-amber-400" />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="font-bold text-amber-300">Review Safety Events</span>
                                <span className="text-xs text-amber-500/70">Click to expand session timeline</span>
                            </div>
                        </div>
                        <span className="text-xs font-bold border px-2 py-1 rounded text-amber-400 border-amber-700/40 bg-amber-500/10">
                            REVIEW
                        </span>
                    </button>
                ) : (
                    <div className="p-5 bg-slate-800/40 border border-slate-700 opacity-50 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full border-2 border-slate-600 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-slate-600" />
                            </div>
                            <span className="font-bold text-slate-400">Review Safety Events (0)</span>
                        </div>
                        <span className="text-xs font-bold border px-2 py-1 rounded text-slate-600 border-slate-700">
                            NO EVENTS
                        </span>
                    </div>
                )}
            </div>

            {/* Submit & Close button */}
            <div className="flex flex-col items-center pt-8 border-t border-slate-800">
                <button
                    disabled={!assessmentCompleted}
                    onClick={onSubmitAndClose}
                    className={`w-full md:w-2/3 py-5 rounded-2xl font-black text-xl tracking-wide shadow-lg transition-all flex items-center justify-center gap-4 ${assessmentCompleted
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-900/40 cursor-pointer hover:scale-[1.01] active:scale-[0.99]'
                        : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                        }`}
                    aria-disabled={!assessmentCompleted}
                >
                    <Lock className="w-5 h-5" />
                    SUBMIT &amp; CLOSE SESSION
                </button>
                {!assessmentCompleted && (
                    <div className="flex items-center gap-2 mt-4 text-red-400/80 bg-red-950/20 px-3 py-1 rounded-full border border-red-900/30">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-xs font-bold">Pending: Post-Session Assessments</span>
                    </div>
                )}
            </div>
        </div>

        {/* ── Assessment modal ── */}
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
                                // WO-545: persist so Phase 3 Session Snapshot can read across render boundary
                                try {
                                    const sessionKey = journey.session?.sessionId ?? journey.sessionId ?? 'demo';
                                    localStorage.setItem(
                                        `ppn_phase2_assessment_${sessionKey}`,
                                        JSON.stringify(scores)
                                    );
                                } catch { /* quota exceeded, non-critical */ }
                            }}
                            onClose={() => setShowAssessmentModal(false)}
                        />
                    </div>
                </div>
            </div>
        )}
    </div>
);
