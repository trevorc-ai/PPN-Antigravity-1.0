/**
 * SessionPrepView — Phase 2 pre-session preparation + live action grid presenter.
 *
 * Extracted from DosingSessionPhase.tsx (lines 1079-1916) as part of the
 * Stabilisation Sprint Track 2 component split. Renders:
 *   - Emergency force-close panel (stuck session recovery)
 *   - Section label + progress bar
 *   - Step cards (full cards pre-session, compact pills when live)
 *   - Contraindication alert (absolute / relative / all-clear)
 *   - Action button grid (Session Update, Additional Dose, Rescue, Adverse Event)
 *   - Keyboard shortcut hint bar
 *
 * This component owns no state. All data and callbacks arrive via props from
 * the TreatmentPhase orchestrator.
 *
 * @see DosingSessionPhase.tsx (orchestrator)
 */

import React from 'react';
import {
    AlertCircle, AlertTriangle, Play, Lock, Edit3, CheckCircle2,
    Pill, ShieldAlert, ClipboardList, Save,
} from 'lucide-react';
import { WellnessFormId } from './WellnessFormRouter';

// ── Re-exported constants (previously file-level in DosingSessionPhase.tsx) ───

/** Regulatory source link map for contraindication citations */
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

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase2Step = { id: WellnessFormId | '__start__'; label: string; icon: string; isComplete: boolean };

export interface SessionPrepViewProps {
    journey: any;
    isLive: boolean;
    isStuckInPre: boolean;
    forceCloseConfirm: boolean;
    resolvedSessionId: string | undefined;
    PHASE2_STEPS: Phase2Step[];
    currentStepIdx: number;
    canStartSession: boolean;
    contraindicationResults: any;
    patientMeds: string[];
    isLiveRedoseRef: React.MutableRefObject<boolean>;
    onOpenForm: (formId: WellnessFormId) => void;
    onStartSession: () => void;
    onRestoreSession: () => void;
    onForceClose: () => Promise<void>;
    setForceCloseConfirm: (v: boolean) => void;
    onClearSubstance: () => void;
    openAndScrollToUpdatePanel: () => void;
    getElapsedSec: () => number;
    setEventLog: React.Dispatch<React.SetStateAction<any[]>>;
    elapsedTime: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const SessionPrepView: React.FC<SessionPrepViewProps> = ({
    journey,
    isLive,
    isStuckInPre,
    forceCloseConfirm,
    resolvedSessionId,
    PHASE2_STEPS,
    currentStepIdx,
    canStartSession,
    contraindicationResults,
    patientMeds,
    isLiveRedoseRef,
    onOpenForm,
    onStartSession,
    onRestoreSession,
    onForceClose,
    setForceCloseConfirm,
    onClearSubstance,
    openAndScrollToUpdatePanel,
    getElapsedSec,
    setEventLog,
    elapsedTime,
}) => (
    <>
        {/* ── Emergency Force-Close Panel ─────────────────────────────────────── */}
        {isStuckInPre && !isLive && (
            <div
                role="alert"
                aria-live="assertive"
                className="rounded-2xl border border-red-700/60 bg-red-950/40 px-5 py-4 space-y-3"
            >
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-red-300 tracking-wide">Session Timer Running — No Active UI</p>
                        <p className="text-xs text-red-400/80 mt-1 leading-relaxed">
                            This session ({String(resolvedSessionId).slice(0, 8).toUpperCase()}…) is still open in the database
                            but the preparation UI lost its state — likely due to a page refresh or re-login.
                            Use <strong>Restore Session</strong> to resume in live mode, or <strong>Force Close</strong>
                            to stop the timer and proceed to closeout.
                        </p>
                    </div>
                </div>

                {forceCloseConfirm ? (
                    <div className="flex items-center gap-3 pt-1">
                        <p className="text-xs text-red-300 font-bold flex-1">Confirm: this will end the dosing phase and cannot be undone.</p>
                        <button
                            onClick={() => setForceCloseConfirm(false)}
                            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-600 text-slate-400 hover:text-slate-300 hover:border-slate-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onForceClose}
                            className="px-3 py-1.5 text-xs font-black rounded-lg bg-red-700 hover:bg-red-600 text-white transition-colors"
                        >
                            Force Close
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 pt-1">
                        <button
                            onClick={onRestoreSession}
                            className="px-4 py-1.5 text-xs font-black rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors"
                        >
                            Restore Session
                        </button>
                        <button
                            onClick={() => setForceCloseConfirm(true)}
                            className="px-4 py-1.5 text-xs font-bold rounded-lg border border-red-700/60 text-red-400 hover:text-red-300 hover:border-red-600/80 transition-colors"
                        >
                            Force Close Session
                        </button>
                    </div>
                )}
            </div>
        )}

        {/* Section label + progress — hidden in live mode */}
        {!isLive && (
            <div className="flex items-center justify-between px-1">
                <h2 className="ppn-label" style={{ color: '#FBBF24' }}>
                    Session Preparation · {PHASE2_STEPS.length} Steps
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
        )}

        {/* Step cards: full cards pre-session only; hidden in live mode */}
        {!isLive && (
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
                            <div className={['h-0.5 w-full', step.isComplete ? 'bg-amber-600/60' : isCurrent ? 'bg-amber-400' : 'bg-slate-700/40'].join(' ')} aria-hidden="true" />

                            <div className="flex flex-col flex-1 p-4 gap-3">
                                <div className="flex items-center justify-between gap-1">
                                    <span className={`font-['Manrope',sans-serif] text-xl font-extrabold tracking-tight leading-none ${step.isComplete ? 'text-amber-300/80' : isCurrent ? 'text-amber-200/90' : 'text-slate-400/80'}`}>
                                        Step {index + 1}
                                    </span>
                                    {step.isComplete ? (
                                        <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" aria-label="Complete" />
                                    ) : (
                                        <div className={['w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', isCurrent ? 'bg-amber-500/25' : 'bg-slate-700/30'].join(' ')} aria-hidden="true">
                                            <span className={`material-symbols-outlined text-[16px] ${isCurrent ? 'text-amber-300' : 'text-slate-500'}`}>
                                                {step.icon}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <h4 className={`text-xl font-black leading-snug ${step.isComplete ? 'text-amber-200' : isCurrent ? 'text-[#A8B5D1]' : 'text-slate-400'}`}>
                                    {step.label}
                                </h4>

                                <div className="mt-auto pt-2">
                                    {step.isComplete ? (
                                        <div className="flex flex-col items-center gap-1 mt-2">
                                            {/* Dosage HUD for dosing-protocol step */}
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
                                                    onClick={() => onOpenForm(step.id as WellnessFormId)}
                                                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-amber-300 transition-all"
                                                    aria-label={`Amend ${step.label}`}
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" aria-hidden="true" /> Amend
                                                </button>
                                            )}
                                        </div>
                                    ) : isStart ? (
                                        <button
                                            onClick={canStartSession ? onStartSession : undefined}
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
                                            onClick={() => onOpenForm(step.id as WellnessFormId)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600/40 hover:bg-amber-600/60 text-amber-100 font-black text-sm rounded-xl transition-all active:scale-95 shadow-md shadow-amber-950/50"
                                        >
                                            Open
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onOpenForm(step.id as WellnessFormId)}
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
        )}

        {/* Contraindication alert + medications — hidden in live mode (shown in cockpit instead) */}
        {!isLive && (
            <>
        {contraindicationResults && contraindicationResults.absoluteFlags.length > 0 ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.35)] animate-pulse-border">
                <div className="absolute inset-0 bg-gradient-to-br from-red-950/80 via-red-900/60 to-red-950/80 pointer-events-none" />
                <div className="relative bg-red-600 px-5 py-3 flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-white flex-shrink-0 animate-bounce" />
                    <span className="text-white font-black text-lg uppercase tracking-[0.2em]">⚠ ABSOLUTE CONTRAINDICATION — DO NOT ADMINISTER</span>
                </div>
                <div className="relative p-5 space-y-4">
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        {patientMeds.map((med, i) => (
                            <span key={i} className="px-4 py-2 bg-red-900/60 border border-red-400/60 rounded-xl text-red-200 font-black text-base">{med}</span>
                        ))}
                        <span className="text-red-400 font-black text-2xl" aria-hidden="true">✕</span>
                        <div className="flex items-center gap-1 px-4 py-2 bg-red-900/60 border border-red-400/60 rounded-xl">
                            <span className="text-red-200 font-black text-base">{journey.session?.substance || 'Selected Substance'}</span>
                            <button
                                onClick={onClearSubstance}
                                aria-label={isLive ? 'Change substance (opens form, change will be timestamped)' : 'Clear substance selection'}
                                className="ml-2 w-5 h-5 flex items-center justify-center rounded-full bg-red-700/60 hover:bg-red-600 border border-red-500/60 hover:border-red-400 text-red-200 hover:text-white transition-all flex-shrink-0"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {contraindicationResults.absoluteFlags.map((flag: any, i: number) => {
                            const sourceLinks = flag.regulatoryBasis ? getRegulatoryLinks(flag.regulatoryBasis) : [];
                            return (
                                <div key={i} className="flex items-start gap-3 p-3 bg-red-950/50 rounded-xl border border-red-800/50">
                                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-red-200 font-black text-sm uppercase tracking-wide">{flag.headline || 'Contraindicated Combination'}</p>
                                        <p className="text-red-300/80 text-sm mt-0.5 leading-relaxed">{flag.detail || 'This combination carries serious risk of adverse events. Session must not proceed.'}</p>
                                        {sourceLinks.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {sourceLinks.map((link, li) => (
                                                    <a key={li} href={link.url} target="_blank" rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-900/50 border border-red-600/40 text-red-300 hover:text-white hover:bg-red-800/60 hover:border-red-500/60 transition-colors text-xs font-semibold"
                                                        aria-label={`Read source: ${link.label}`}>
                                                        <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                                                        {link.label}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                        {sourceLinks.length === 0 && flag.regulatoryBasis && (
                                            <p className="text-red-500/60 text-xs mt-1 font-mono">{flag.regulatoryBasis}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
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
                                                <a key={li} href={link.url} target="_blank" rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-900/50 border border-amber-600/40 text-amber-300 hover:text-white hover:bg-amber-800/60 hover:border-amber-500/60 transition-colors text-xs font-semibold"
                                                    aria-label={`Read source: ${link.label}`}>
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
                {contraindicationResults && (
                    <div className="flex-shrink-0">
                        <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-600/40 text-emerald-300 text-sm font-black uppercase tracking-wider">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ALL CLEAR — No Contraindications
                        </span>
                    </div>
                )}
            </div>
        )}
            </>
        )}

        {/* ── Action Button Grid (locked when pre-session, active when live) ── */}
        <div className="grid grid-cols-2 gap-3">
            <button
                onClick={isLive ? openAndScrollToUpdatePanel : undefined}
                disabled={!isLive}
                className={`flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-2xl font-black text-sm tracking-wide transition-all active:scale-95 border shadow-lg ${isLive
                    ? 'bg-gradient-to-br from-emerald-900/60 to-teal-900/40 hover:from-emerald-800/70 border-emerald-500/40 hover:border-emerald-400/60 text-emerald-100'
                    : 'bg-slate-800/20 border-slate-700/30 text-slate-600 cursor-not-allowed'
                    }`}
                aria-label="Log session update"
            >
                <ClipboardList className={`w-5 h-5 ${isLive ? 'text-emerald-300' : 'text-slate-600'}`} />
                <span>Session Update</span>
            </button>

            {/* WO-559: Additional Dose */}
            <button
                onClick={isLive ? () => {
                    isLiveRedoseRef.current = true;
                    onOpenForm('dosing-protocol');
                } : undefined}
                disabled={!isLive}
                className={`flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-2xl font-black text-sm tracking-wide transition-all active:scale-95 border ${isLive
                    ? 'bg-gradient-to-br from-orange-900/60 to-amber-900/40 hover:from-orange-800/70 border-orange-500/40 hover:border-orange-400/60 text-orange-100 shadow-lg shadow-orange-950/30'
                    : 'bg-slate-800/20 border-slate-700/30 text-slate-600 cursor-not-allowed'
                    }`}
                aria-label="Log additional dose"
            >
                <Pill className={`w-5 h-5 ${isLive ? 'text-orange-300' : 'text-slate-600'}`} />
                <span>Additional Dose</span>
            </button>

            {/* Rescue Protocol */}
            <button
                onClick={isLive ? async () => {
                    const elapsedNow = getElapsedSec();
                    setEventLog(prev => [...prev, {
                        id: `rescue-${Date.now()}`,
                        elapsedSec: elapsedNow,
                        type: 'rescue-protocol',
                        label: 'Rescue Protocol',
                    }]);
                    // WO-B0: dispatch ppn:dose-registered so LiveSessionTimeline adds
                    // an optimistic entry immediately (fixes FAIL 4 — rescue not in timeline).
                    window.dispatchEvent(new CustomEvent('ppn:dose-registered', {
                        detail: {
                            type: 'rescue-protocol',
                            label: 'Rescue Protocol initiated',
                            elapsedSec: elapsedNow,
                        },
                    }));
                    onOpenForm('rescue-protocol');
                } : undefined}
                disabled={!isLive}
                className={`flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-2xl font-black text-sm tracking-wide transition-all active:scale-95 border ${isLive
                    ? 'bg-gradient-to-br from-purple-900/60 to-fuchsia-900/40 hover:from-purple-800/70 border-purple-500/40 hover:border-purple-400/60 text-purple-100 shadow-lg shadow-purple-950/40'
                    : 'bg-slate-800/20 border-slate-700/30 text-slate-600 cursor-not-allowed'
                    }`}
                aria-label="Log rescue protocol"
            >
                <span className={`material-symbols-outlined text-[20px] ${isLive ? 'text-purple-300' : 'text-slate-600'}`}>emergency</span>
                <span>Rescue Protocol</span>
            </button>

            {/* Adverse Event */}
            <button
                onClick={isLive ? async () => {
                    const elapsedNow2 = getElapsedSec();
                    setEventLog(prev => [...prev, {
                        id: `adverse-${Date.now()}`,
                        elapsedSec: elapsedNow2,
                        type: 'safety-and-adverse-event',
                        label: 'Adverse Event',
                    }]);
                    onOpenForm('safety-and-adverse-event');
                } : undefined}
                disabled={!isLive}
                className={`flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-2xl font-black text-sm tracking-wide transition-all active:scale-95 border ${isLive
                    ? 'bg-gradient-to-br from-red-900/60 to-rose-900/40 hover:from-red-800/70 border-red-500/40 hover:border-red-400/60 text-red-100 shadow-lg shadow-red-950/40'
                    : 'bg-slate-800/20 border-slate-700/30 text-slate-600 cursor-not-allowed'
                    }`}
                aria-label="Log adverse reaction"
            >
                <AlertTriangle className={`w-5 h-5 ${isLive ? 'text-red-300' : 'text-slate-600'}`} />
                <span>Adverse Event</span>
            </button>
        </div>

        {/* ── Keyboard shortcuts hint ── */}
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
    </>
);
