import React, { useEffect, useMemo, useRef } from 'react';
import { ChevronDown, ChevronUp, Edit3, CheckCircle2, HeartPulse, ClipboardCheck, FileText, Pill, ArrowRight } from 'lucide-react';
import type { WellnessFormId } from './WellnessFormRouter';
import { useProtocol } from '../../contexts/ProtocolContext';

// ── PHASE 1 COLOR: INDIGO ─────────────────────────────────────────────────────
// Red = warnings/adverse events ONLY.

export interface Phase1Step {
    id: WellnessFormId;
    label: string;
    description: string;
    required: boolean;
    icon: string;
}

export const PHASE1_STEPS: Phase1Step[] = [
    {
        id: 'consent',
        label: 'Informed Consent',
        description: 'Document patient consent before any clinical activity begins.',
        required: true,
        icon: 'check_circle',
    },
    {
        id: 'structured-safety',
        label: 'Safety Check',
        description: 'Screen for contraindications and treatment eligibility.',
        required: true,
        icon: 'shield',
    },
    {
        id: 'mental-health',
        label: 'Mental Health',
        description: 'PHQ-9, GAD-7, and baseline psychological assessment.',
        required: true,
        icon: 'psychology',
    },
    {
        id: 'set-and-setting',
        label: 'Set & Setting',
        description: 'Treatment expectancy, clinical observations, and pre-session mindset.',
        required: true,
        icon: 'home_health',
    },
];

// ── Phase 1 Data HUD ──────────────────────────────────────────────────────────
// Compact read-back strip surfacing form entry values. Phase-1 indigo palette.
// Renders as soon as at least 1 step is complete. Read-only, no form triggers.

function HUDChip({
    icon,
    label,
    value,
    colorClass = 'text-indigo-300',
    ariaLabel,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number | null | undefined;
    colorClass?: string;
    ariaLabel?: string;
}) {
    const displayValue = (value !== null && value !== undefined && value !== '') ? String(value) : '\u2014';
    const isEmpty = displayValue === '\u2014';
    return (
        <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border w-full ${isEmpty
                ? 'bg-slate-800/30 border-slate-700/40'
                : 'bg-indigo-950/40 border-indigo-700/40'
                } min-w-0`}
            aria-label={ariaLabel ?? `${label}: ${displayValue}`}
        >
            <span className={`flex-shrink-0 ${isEmpty ? 'text-slate-600' : 'text-indigo-400'}`} aria-hidden="true">
                {icon}
            </span>
            <div className="min-w-0">
                <p className="ppn-meta text-slate-500 font-bold uppercase tracking-widest leading-none mb-0.5">{label}</p>
                <p className={`text-sm font-black leading-none truncate ${isEmpty ? 'text-slate-600' : colorClass}`}>
                    {displayValue}
                </p>
            </div>
        </div>
    );
}

interface Phase1HUDProps {
    completedFormIds: Set<string>;
    completedCount: number;
    totalCount: number;
    patientId?: string;
}

const Phase1HUD: React.FC<Phase1HUDProps> = ({ completedFormIds, completedCount, totalCount, patientId = '' }) => {
    // Dosing protocol (substance/dosage) is a Phase 2 concern — not shown in Phase 1 HUD.

    // Read PHQ-9 / GAD-7 from localStorage.
    // Stored by BaselineAssessmentWizard under key ppn_wizard_baseline_${patientId}.
    // Data shape: { mentalHealth: { phq9: number|null, gad7: number|null, ... } }
    const mentalHealth = useMemo(() => {
        try {
            const raw = localStorage.getItem(`ppn_wizard_baseline_${patientId}`);
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    }, [completedFormIds, patientId]);

    const phq9 = mentalHealth?.mentalHealth?.phq9 ?? null;
    const gad7 = mentalHealth?.mentalHealth?.gad7 ?? null;

    // Read consent data from localStorage.
    // Stored by WellnessFormRouter under key ppn_consent_${patientId} (or ppn_consent fallback).
    // Data shape: { consent_types: string[], ... }, no consent_date field.
    const consentData = useMemo(() => {
        try {
            const raw = localStorage.getItem(patientId ? `ppn_consent_${patientId}` : 'ppn_consent');
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    }, [completedFormIds, patientId]);
    // Show "Signed" if consent_types array is non-empty, or completedFormIds confirms it was completed.
    const consentDisplay = (consentData?.consent_types?.length > 0 || completedFormIds.has('consent'))
        ? 'Signed'
        : null;

    const setAndSetting = completedFormIds.has('set-and-setting') ? 'Complete' : null;

    // Read medications from localStorage (populated by StructuredSafetyCheckForm in Phase 1)
    // Same key used by Phase 2 so medications are consistent across all phases.
    const patientMeds = useMemo(() => {
        try {
            const cached = localStorage.getItem('mock_patient_medications_names');
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length) return parsed as string[];
            }
        } catch { }
        return [];
    }, [completedFormIds]);

    return (
        <section
            aria-label="Phase 1 documentation summary"
            className="relative rounded-2xl border border-indigo-700/40 bg-indigo-950/20 backdrop-blur-sm p-4 overflow-hidden animate-in fade-in duration-500"
        >
            {/* Header row */}
            <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" aria-hidden="true" />
                    <h4 className="ppn-label text-indigo-300 uppercase tracking-widest">
                        Preparation Summary
                    </h4>
                </div>
                <span
                    className={`ppn-meta font-bold px-2.5 py-1 rounded-full border uppercase tracking-widest flex-shrink-0 ${completedCount === totalCount
                        ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
                        }`}
                    aria-label={`${completedCount} of ${totalCount} steps complete`}
                >
                    {completedCount}/{totalCount} steps
                </span>
            </div>

            {/* Chips row, equal-width grid so all 6 chips spread across the full width */}
            <div
                className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                role="list"
                aria-label="Documented values from preparation forms"
            >
                <div role="listitem">
                    <HUDChip
                        icon={<FileText className="w-3.5 h-3.5" />}
                        label="Consent"
                        value={consentDisplay}
                        colorClass="text-teal-300"
                        ariaLabel={`Consent: ${consentDisplay ?? 'Not yet signed'}`}
                    />
                </div>
                <div role="listitem">
                    <HUDChip
                        icon={<HeartPulse className="w-3.5 h-3.5" />}
                        label="PHQ-9"
                        value={phq9 !== null ? String(phq9) : null}
                        colorClass="text-amber-300"
                        ariaLabel={`PHQ-9 baseline score: ${phq9 ?? 'Not yet entered'}`}
                    />
                </div>
                <div role="listitem">
                    <HUDChip
                        icon={<HeartPulse className="w-3.5 h-3.5" />}
                        label="GAD-7"
                        value={gad7 !== null ? String(gad7) : null}
                        colorClass="text-amber-300"
                        ariaLabel={`GAD-7 baseline score: ${gad7 ?? 'Not yet entered'}`}
                    />
                </div>
                <div role="listitem">
                    <HUDChip
                        icon={<ClipboardCheck className="w-3.5 h-3.5" />}
                        label="Set & Setting"
                        value={setAndSetting}
                        colorClass="text-indigo-300"
                        ariaLabel={`Set and Setting: ${setAndSetting ?? 'Not yet entered'}`}
                    />
                </div>

            </div>

            {/* Medications strip, shows as soon as meds are entered in Phase 1 Safety Check */}
            {patientMeds.length > 0 && (
                <div className="mt-3 pt-3 border-t border-indigo-800/30">
                    <p className="ppn-meta text-slate-500 font-bold uppercase tracking-widest mb-1.5">Current Medications</p>
                    <div className="flex flex-wrap gap-1.5" role="list" aria-label="Current patient medications">
                        {patientMeds.map((med, i) => (
                            <span
                                key={i}
                                role="listitem"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-sm font-semibold"
                            >
                                <Pill className="w-3 h-3 text-slate-500" aria-hidden="true" />
                                {med}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};




// ── Phase1StepGuide ───────────────────────────────────────────────────────────
interface Phase1StepGuideProps {
    completedFormIds: Set<string>;
    onStartStep: (formId: WellnessFormId) => void;
    onCompletePhase?: () => void;
    bottomStatusBar?: React.ReactNode;
    patientId?: string;
}

export const Phase1StepGuide: React.FC<Phase1StepGuideProps> = ({
    completedFormIds,
    onStartStep,
    onCompletePhase,
    bottomStatusBar,
    patientId = '',
}) => {
    const heroRef = useRef<HTMLDivElement>(null);
    const { config } = useProtocol();

    const activeSteps = PHASE1_STEPS.filter(step => config.enabledFeatures.includes(step.id));

    const currentStepIndex = activeSteps.findIndex(
        (step) => !completedFormIds.has(step.id)
    );
    const allComplete = currentStepIndex === -1;
    const completedCount = activeSteps.filter(step => completedFormIds.has(step.id)).length;

    useEffect(() => {
        if (heroRef.current) {
            heroRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [currentStepIndex]);

    return (
        <div className="space-y-4">

            {/* ── Phase sub-header ──────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-1">
                {/* Section label using site-standard ppn-label class */}
                <h2 className="ppn-label" style={{ color: '#818CF8' }}>
                    Preparation · {activeSteps.length} Steps
                </h2>
                <div className="flex items-center gap-3">
                    <div className="flex-1 max-w-[112px] h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-700 to-indigo-400 rounded-full transition-all duration-700"
                            style={{ width: `${(completedCount / Math.max(1, activeSteps.length)) * 100}%` }}
                            role="progressbar"
                            aria-valuenow={completedCount}
                            aria-valuemax={activeSteps.length}
                            aria-label="Preparation progress"
                        />
                    </div>
                    <span className="text-sm font-semibold text-slate-400">
                        {completedCount}/{activeSteps.length}
                    </span>
                </div>
            </div>

            {/* ── 4-Step card grid ──────────────────────────────────────────────
                Font sizing follows site standard:
                  Step label (H3-equiv): text-sm font-bold uppercase , 14px
                  Card title:            text-base font-black         , 16px
                  Description:           text-sm                      , 14px
                  Button text:           text-sm font-semibold+       , 14px
                  Badge / metadata:      text-sm                      , 12px (acceptable for tags)

                Design: no individual card borders, background fills only.
                Active = indigo fill · Completed = teal tint · Upcoming = slate/dimmed
            ──────────────────────────────────────────────────────────────────── */}
            {/* ── MOBILE: compact horizontal list rows ──────────────────────────────────────── */}
            <div className="sm:hidden flex flex-col gap-2">
                {activeSteps.map((step, index) => {
                    const isComplete = completedFormIds.has(step.id);
                    const isCurrent = index === currentStepIndex;
                    return (
                        <div
                            key={step.id}
                            className={[
                                'flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all min-h-[68px]',
                                isComplete
                                    ? 'bg-teal-900/20 border-teal-700/40'
                                    : isCurrent
                                        ? 'bg-indigo-900/40 border-indigo-600/50 shadow-md shadow-indigo-950/40'
                                        : 'bg-slate-800/20 border-slate-700/30',
                            ].join(' ')}
                        >
                            {/* Step number badge */}
                            <div className={[
                                'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm',
                                isComplete ? 'bg-teal-800/60 text-teal-300' : isCurrent ? 'bg-indigo-700/60 text-indigo-100' : 'bg-slate-700/40 text-slate-500',
                            ].join(' ')} aria-hidden="true">
                                {isComplete ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                            </div>
                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-black leading-tight ${isComplete ? 'text-teal-200' : isCurrent ? 'text-slate-100' : 'text-slate-400'}`}>{step.label}</p>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    {isComplete ? 'Completed' : isCurrent ? 'In progress - tap to continue' : 'Required'}
                                </p>
                            </div>
                            {/* CTA button */}
                            <button
                                onClick={() => onStartStep(step.id)}
                                aria-label={`${isComplete ? 'Amend' : isCurrent ? 'Continue' : 'Open'} ${step.label}`}
                                className={[
                                    'flex-shrink-0 px-3 py-2 rounded-xl text-sm font-black transition-all active:scale-95',
                                    isComplete
                                        ? 'bg-slate-700/50 text-slate-400 hover:text-slate-200'
                                        : isCurrent
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50'
                                            : 'bg-slate-700/40 text-slate-500 hover:text-slate-300',
                                ].join(' ')}
                            >
                                {isComplete ? 'Edit' : isCurrent ? 'Continue' : 'Open'}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* ── DESKTOP: tall card grid (original) ────────────────────────────────────── */}
            <div className={`hidden sm:grid sm:grid-cols-${Math.min(activeSteps.length, 4)} gap-2`}>
                {activeSteps.map((step, index) => {
                    const isComplete = completedFormIds.has(step.id);
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div
                            key={step.id}
                            ref={isCurrent ? heroRef : undefined}
                            className={[
                                'relative flex flex-col rounded-xl transition-all duration-300 overflow-hidden',
                                isComplete
                                    ? 'bg-teal-900/20'
                                    : isCurrent
                                        ? 'bg-indigo-900/50 shadow-lg shadow-indigo-950/60'
                                        : 'bg-slate-800/20 hover:bg-slate-800/35',
                            ].join(' ')}
                        >
                            {/* Top accent stripe */}
                            <div className={[
                                'h-0.5 w-full',
                                isComplete ? 'bg-teal-600/60' : isCurrent ? 'bg-indigo-400' : 'bg-slate-700/40',
                            ].join(' ')} aria-hidden="true" />

                            <div className="flex flex-col flex-1 p-4 gap-3">

                                {/* Step number label + decorative icon badge (top-right) */}
                                <div className="flex items-center justify-between gap-1">
                                    <span className={`font-['Manrope',sans-serif] text-xl font-extrabold tracking-tight leading-none ${isComplete ? 'text-teal-300/80' : isCurrent ? 'text-indigo-200/90' : 'text-slate-400/80'
                                        }`}>
                                        Step {index + 1}
                                    </span>
                                    {isComplete ? (
                                        <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" aria-label="Complete" />
                                    ) : (
                                        <div className={[
                                            'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
                                            isCurrent ? 'bg-indigo-500/25' : 'bg-slate-700/30',
                                        ].join(' ')} aria-hidden="true">
                                            <span className={`material-symbols-outlined text-[16px] ${isCurrent ? 'text-indigo-300' : 'text-slate-500'}`}>
                                                {step.icon}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Card title — left-justified, larger */}
                                <h4
                                    className={`text-xl font-black leading-snug ${isComplete ? 'text-teal-200' : isCurrent ? 'text-[#A8B5D1]' : 'text-slate-400'
                                        }`}
                                    title={step.label}
                                >
                                    {step.label}
                                </h4>

                                {/* Description, only on the active step for space; text-sm */}
                                {isCurrent && (
                                    <p className="text-sm md:text-base leading-relaxed text-indigo-300/70">
                                        {step.description}
                                    </p>
                                )}

                                {/* CTA buttons, text-sm minimum */}
                                <div className="mt-auto pt-2">
                                    {isComplete ? (
                                        <div className="flex flex-col items-center gap-1 mt-2">
                                            <span className="flex items-center gap-1.5 text-sm md:text-base font-black uppercase tracking-widest text-teal-400">
                                                <CheckCircle2 className="w-4 h-4" />
                                                COMPLETED
                                            </span>
                                            <button
                                                onClick={() => onStartStep(step.id)}
                                                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm md:text-base font-medium text-slate-400 hover:text-teal-300 transition-all"
                                                aria-label={`Amend ${step.label}`}
                                            >
                                                <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                                                Amend
                                            </button>
                                        </div>
                                    ) : isCurrent ? (
                                        <button
                                            id={`phase1-step-${index + 1}-start`}
                                            onClick={() => onStartStep(step.id)}
                                            aria-label={`Continue to ${step.label}`}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600/40 hover:bg-indigo-600/60 text-indigo-100 font-black text-sm md:text-base rounded-xl transition-all active:scale-95 shadow-md shadow-indigo-950/50 group"
                                        >
                                            Continue
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onStartStep(step.id)}
                                            aria-label={`Open ${step.label}`}
                                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700/50 bg-slate-800/30 text-sm md:text-base font-semibold text-slate-500 hover:text-slate-300 hover:bg-slate-700/40 hover:border-slate-600/50 transition-all"
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

            {/* ── Phase 1 Data HUD (WO-527) ────────────────────────────────────
                 Shows as soon as any step is completed. Provides a real-time
                 read-back of key documented values from the preparation forms.
            ────────────────────────────────────────────────────────────────── */}
            {completedCount > 0 && (
                <Phase1HUD
                    completedFormIds={completedFormIds}
                    completedCount={completedCount}
                    totalCount={activeSteps.length}
                    patientId={patientId}
                />
            )}

            {/* ── All complete state */}
            {allComplete && (
                <div className="space-y-6 pt-4 border-t border-slate-700/50 mt-8">
                    {/* Optional: Simple Benchmark Compliance Banner */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-emerald-900/10 border border-emerald-500/20 rounded-xl">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-emerald-200">
                            Data Quality: <strong className="text-emerald-400">100% Benchmark Compliant</strong>
                        </span>
                    </div>


                    {bottomStatusBar && (
                        <div className="mt-8">
                            {bottomStatusBar}
                        </div>
                    )}

                    {/* Proceed to Phase 2 — unlocks when all 4 steps are complete.
                        Contraindications are clinical intelligence / advisory only;
                        they are never a hard gate on Phase 2 access. */}
                    <div className="mt-8 pt-6 border-t border-slate-700/50">
                        <button
                            id="phase1-proceed-phase2"
                            onClick={onCompletePhase}
                            className="w-full py-4 rounded-2xl text-base sm:text-lg font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40 hover:-translate-y-1 active:scale-[0.98]"
                        >
                            <CheckCircle2 className="w-6 h-6" />
                            Proceed to Phase 2 Dosing
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
