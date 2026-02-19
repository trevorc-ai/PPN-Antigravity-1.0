import React from 'react';
import { CheckCircle, Circle, Lock, ArrowRight, ChevronRight } from 'lucide-react';
import type { WellnessFormId } from './WellnessFormRouter';

/**
 * Phase1StepGuide
 *
 * A persistent step-by-step guide for Phase 1: Preparation.
 * Replaces the scattered button row with a clear, numbered sequence
 * that always tells the clinician exactly what to do next.
 *
 * UX rules:
 *  - The CURRENT (next incomplete) step has a pulsing CTA and is above the fold
 *  - Completed steps show a green checkmark and are dimmed
 *  - Future steps are locked and muted until the current step is done
 *  - No step is required before the next (clinical discretion), but the
 *    guide strongly signals the recommended order
 */

export interface Phase1Step {
    id: WellnessFormId;
    label: string;
    description: string;
    required: boolean;        // true = marked as mandatory in clinical protocol
    icon: string;             // Material Symbols ligature name
}

export const PHASE1_STEPS: Phase1Step[] = [
    {
        id: 'consent',
        label: 'Informed Consent',
        description: 'Document patient consent before any clinical activity.',
        required: true,
        icon: 'check_circle',
    },
    {
        id: 'structured-safety',
        label: 'Safety Screen & Eligibility',
        description: 'Screen for contraindications, suicidality risk, and eligibility.',
        required: true,
        icon: 'shield',
    },
    {
        id: 'mental-health',
        label: 'Mental Health Screening',
        description: 'Administer PHQ-9, GAD-7, and baseline psychological assessment.',
        required: true,
        icon: 'psychology',
    },
    {
        id: 'set-and-setting',
        label: 'Set & Setting',
        description: 'Document therapeutic environment, set expectations, and integration plan.',
        required: true,
        icon: 'home_health',
    },
    {
        id: 'baseline-observations',
        label: 'Baseline Observations',
        description: 'Record pre-treatment clinical observations and vital notes.',
        required: false,
        icon: 'visibility',
    },
];

interface Phase1StepGuideProps {
    completedFormIds: Set<string>;
    onStartStep: (formId: WellnessFormId) => void;
}

export const Phase1StepGuide: React.FC<Phase1StepGuideProps> = ({
    completedFormIds,
    onStartStep,
}) => {
    // Find the index of the first incomplete step
    const currentStepIndex = PHASE1_STEPS.findIndex(
        (step) => !completedFormIds.has(step.id)
    );
    const allComplete = currentStepIndex === -1;

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">

            {/* ── Header ───────────────────────────────────────────────────── */}
            <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
                <div>
                    <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-400 text-lg">
                            route
                        </span>
                        Phase 1 — Preparation Checklist
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Complete each step before the treatment session
                    </p>
                </div>
                {allComplete && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 text-xs font-bold">Phase 1 Complete</span>
                    </div>
                )}
                {!allComplete && (
                    <span className="text-xs text-slate-500 font-medium">
                        {completedFormIds.size} / {PHASE1_STEPS.length} complete
                    </span>
                )}
            </div>

            {/* ── Step list ────────────────────────────────────────────────── */}
            <div className="divide-y divide-slate-800/60">
                {PHASE1_STEPS.map((step, index) => {
                    const isComplete = completedFormIds.has(step.id);
                    const isCurrent = index === currentStepIndex;
                    const isLocked = !isComplete && index > currentStepIndex;

                    return (
                        <div
                            key={step.id}
                            className={`flex items-center gap-4 px-6 py-4 transition-all ${isCurrent
                                    ? 'bg-blue-500/5 border-l-2 border-blue-500'
                                    : isComplete
                                        ? 'opacity-60'
                                        : 'opacity-40'
                                }`}
                        >
                            {/* Step number / status icon */}
                            <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${isComplete
                                    ? 'bg-emerald-500/15 text-emerald-400'
                                    : isCurrent
                                        ? 'bg-blue-500/20 text-blue-400 ring-2 ring-blue-500/40 animate-pulse'
                                        : 'bg-slate-800/60 text-slate-600'
                                }`}>
                                {isComplete ? (
                                    <CheckCircle className="w-5 h-5" />
                                ) : isLocked ? (
                                    <Lock className="w-4 h-4" />
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>

                            {/* Step info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className={`font-bold text-sm ${isComplete ? 'text-emerald-400 line-through decoration-emerald-600/40' :
                                            isCurrent ? 'text-slate-100' :
                                                'text-slate-500'
                                        }`}>
                                        {step.label}
                                    </span>
                                    {step.required && !isComplete && (
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400/70 border border-amber-400/20 px-1.5 py-0.5 rounded">
                                            Required
                                        </span>
                                    )}
                                </div>
                                <p className={`text-xs mt-0.5 ${isCurrent ? 'text-slate-400' : 'text-slate-600'
                                    }`}>
                                    {step.description}
                                </p>
                            </div>

                            {/* Action CTA */}
                            {isComplete && (
                                <button
                                    type="button"
                                    onClick={() => onStartStep(step.id)}
                                    aria-label={`Re-open ${step.label}`}
                                    className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-300 border border-slate-700/50 hover:border-slate-600 rounded-lg transition-all"
                                >
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                    Amend
                                </button>
                            )}

                            {isCurrent && (
                                <button
                                    id={`phase1-step-${index + 1}-start`}
                                    type="button"
                                    onClick={() => onStartStep(step.id)}
                                    aria-label={`Start ${step.label}`}
                                    className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/30"
                                >
                                    Start
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            )}

                            {isLocked && (
                                <span className="flex-shrink-0 text-xs text-slate-700 font-medium flex items-center gap-1">
                                    <ChevronRight className="w-3.5 h-3.5" />
                                    Unlock next
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── Progress bar ─────────────────────────────────────────────── */}
            <div className="px-6 pb-5 pt-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>Preparation progress</span>
                    <span className="font-bold text-slate-400">
                        {Math.round((completedFormIds.size / PHASE1_STEPS.length) * 100)}%
                    </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-700"
                        style={{ width: `${(completedFormIds.size / PHASE1_STEPS.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
