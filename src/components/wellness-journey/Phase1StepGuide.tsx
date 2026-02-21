import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Edit3, Compass, CheckCircle2 } from 'lucide-react';
import type { WellnessFormId } from './WellnessFormRouter';

export interface Phase1Step {
    id: WellnessFormId;
    label: string;
    description: string;
    required: boolean;
    icon: string;
}

// All Phase 1 steps share the SAME red color family — the phase owns the palette.
// Per-step rainbow colors are intentionally removed.
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
        label: 'Safety Screen & Eligibility',
        description: 'Screen for contraindications and treatment eligibility.',
        required: true,
        icon: 'shield',
    },
    {
        id: 'mental-health',
        label: 'Mental Health Screening',
        description: 'PHQ-9, GAD-7, and baseline psychological assessment.',
        required: true,
        icon: 'psychology',
    },
    {
        id: 'set-and-setting',
        label: 'Set & Setting',
        description: 'Document environment, expectations, and integration plan.',
        required: true,
        icon: 'home_health',
    },
    {
        id: 'baseline-observations',
        label: 'Baseline Observations',
        description: 'Pre-treatment clinical observations and vital notes.',
        required: false,
        icon: 'visibility',
    },
];

// ── AllCompletePanel ─────────────────────────────────────────────────────────
interface AllCompletePanelProps {
    steps: Phase1Step[];
    completedFormIds: Set<string>;
    onStartStep: (formId: WellnessFormId) => void;
    onCompletePhase?: () => void;
}

const AllCompletePanel: React.FC<AllCompletePanelProps> = ({
    steps,
    completedFormIds,
    onStartStep,
    onCompletePhase,
}) => {
    const [reviewOpen, setReviewOpen] = useState(false);

    return (
        <div className="space-y-3">
            {/* Hero — Unlock CTA immediately visible */}
            <div className="rounded-2xl border-2 border-emerald-500/50 bg-emerald-500/10 p-6">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-7 h-7 text-emerald-400" aria-hidden="true" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-xl font-black text-emerald-300 leading-tight">All Preparation Steps Complete</h2>
                        <p className="text-sm text-slate-400 mt-1">Patient is cleared for Phase 2: Dosing Session.</p>
                    </div>
                    {onCompletePhase && (
                        <button
                            id="phase1-complete-unlock-phase2"
                            data-tour="complete-phase-1"
                            onClick={onCompletePhase}
                            className="flex-shrink-0 flex items-center gap-3 px-7 py-3.5 bg-emerald-500/25 hover:bg-emerald-500/40 border-2 border-emerald-500/60 hover:border-emerald-400/80 text-emerald-200 font-black text-base rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-900/30 group whitespace-nowrap"
                            aria-label="Mark Phase 1 complete and unlock Phase 2"
                        >
                            Unlock Phase 2
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                        </button>
                    )}
                </div>
            </div>

            {/* Accordion — Review completed steps */}
            <div className="rounded-2xl border border-red-700/30 bg-red-950/15 overflow-hidden">
                <button
                    onClick={() => setReviewOpen(o => !o)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-red-900/10 transition-colors"
                    aria-expanded={reviewOpen}
                    aria-controls="phase1-review-panel"
                >
                    <span className="text-sm font-bold text-red-300">
                        Review completed steps ({steps.length}/{steps.length})
                    </span>
                    {reviewOpen
                        ? <ChevronUp className="w-4 h-4 text-red-500 flex-shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-red-500 flex-shrink-0" />}
                </button>

                {reviewOpen && (
                    <div id="phase1-review-panel" className="border-t border-red-700/30 divide-y divide-red-900/30">
                        {steps.map((step) => (
                            <div key={step.id} className="flex items-center gap-4 px-5 py-3.5">
                                <Compass className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-red-200 truncate">{step.label}</p>
                                    <p className="text-xs text-slate-500 truncate">{step.description}</p>
                                </div>
                                <button
                                    onClick={() => onStartStep(step.id)}
                                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-700/40 text-xs font-bold text-red-400 hover:text-red-200 hover:border-red-500 transition-all"
                                    aria-label={`Amend ${step.label}`}
                                >
                                    <Edit3 className="w-3 h-3" aria-hidden="true" />
                                    Amend
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

interface Phase1StepGuideProps {
    completedFormIds: Set<string>;
    onStartStep: (formId: WellnessFormId) => void;
    onCompletePhase?: () => void;
}

export const Phase1StepGuide: React.FC<Phase1StepGuideProps> = ({
    completedFormIds,
    onStartStep,
    onCompletePhase,
}) => {
    const heroRef = useRef<HTMLDivElement>(null);

    const currentStepIndex = PHASE1_STEPS.findIndex(
        (step) => !completedFormIds.has(step.id)
    );
    const allComplete = currentStepIndex === -1;
    const currentStep = allComplete ? null : PHASE1_STEPS[currentStepIndex];
    const completedCount = completedFormIds.size;

    // Scroll the hero card into view whenever the step advances
    useEffect(() => {
        if (heroRef.current) {
            heroRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [currentStepIndex]);

    return (
        <div className="space-y-4">

            {/* ── Phase header ────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-red-400/70">
                        Phase 1 Sequence
                    </span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs font-semibold text-slate-500">
                        {completedCount}/{PHASE1_STEPS.length} complete
                    </span>
                </div>
                {/* Phase 1 progress bar */}
                <div className="w-32 h-1.5 bg-red-950/60 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-red-700 to-red-400 rounded-full transition-all duration-700"
                        style={{ width: `${(completedCount / PHASE1_STEPS.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* ── 5-Step card sequence — all steps always visible ─────────────── */}
            {/*   Current step = brighter card + Continue CTA                      */}
            {/*   Completed    = green check + compass icon                        */}
            {/*   Upcoming     = dimmed red, still readable, still clickable       */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {PHASE1_STEPS.map((step, index) => {
                    const isComplete = completedFormIds.has(step.id);
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div
                            key={step.id}
                            ref={isCurrent ? heroRef : undefined}
                            className={[
                                'relative flex flex-col rounded-2xl border-2 transition-all duration-300 overflow-hidden',
                                isComplete
                                    ? 'bg-emerald-950/20 border-emerald-600/40'
                                    : isCurrent
                                        ? 'bg-red-950/50 border-red-500/80 shadow-lg shadow-red-950/50'
                                        : 'bg-red-950/10 border-red-900/30 opacity-70 hover:opacity-90',
                            ].join(' ')}
                        >
                            {/* Color accent bar at top — red for all Phase 1 steps */}
                            <div className={[
                                'h-0.5 w-full',
                                isComplete ? 'bg-emerald-500' : isCurrent ? 'bg-red-400' : 'bg-red-900/60',
                            ].join(' ')} aria-hidden="true" />

                            <div className="flex flex-col flex-1 p-4 gap-3">
                                {/* Step number + required badge */}
                                <div className="flex items-center justify-between">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isComplete ? 'text-emerald-500' : isCurrent ? 'text-red-400' : 'text-red-800'
                                        }`}>
                                        Step {index + 1}
                                    </span>
                                    {step.required && !isComplete && (
                                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-900/40 text-red-400 border border-red-800/40">
                                            REQ
                                        </span>
                                    )}
                                    {isComplete && (
                                        <Compass className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" aria-hidden="true" />
                                    )}
                                </div>

                                {/* Icon + label */}
                                <div className="flex items-center gap-2">
                                    <div className={[
                                        'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0',
                                        isComplete ? 'bg-emerald-500/15' : isCurrent ? 'bg-red-500/20' : 'bg-red-900/20',
                                    ].join(' ')}>
                                        {isComplete ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        ) : (
                                            <span className={`material-symbols-outlined text-base ${isCurrent ? 'text-red-300' : 'text-red-700'
                                                }`}>
                                                {step.icon}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className={`text-xs font-black leading-tight ${isComplete ? 'text-emerald-300' : isCurrent ? 'text-red-100' : 'text-red-400'
                                        }`}>
                                        {step.label}
                                    </h3>
                                </div>

                                {/* Description — visible on current + completed */}
                                {(isCurrent || isComplete) && (
                                    <p className={`text-xs leading-relaxed ${isComplete ? 'text-slate-500' : 'text-red-300/70'
                                        }`}>
                                        {step.description}
                                    </p>
                                )}

                                {/* CTA — spacer + button at bottom of each card */}
                                <div className="mt-auto pt-2">
                                    {isComplete ? (
                                        <button
                                            onClick={() => onStartStep(step.id)}
                                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-700/40 text-xs font-bold text-emerald-500 hover:text-emerald-300 hover:border-emerald-500 transition-all"
                                            aria-label={`Amend ${step.label}`}
                                        >
                                            <Edit3 className="w-3 h-3" aria-hidden="true" />
                                            Amend
                                        </button>
                                    ) : isCurrent ? (
                                        <button
                                            id={`phase1-step-${index + 1}-start`}
                                            onClick={() => onStartStep(step.id)}
                                            aria-label={`Continue to ${step.label}`}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600/30 hover:bg-red-600/50 border-2 border-red-500/70 hover:border-red-400 text-red-100 font-black text-sm rounded-xl transition-all active:scale-95 shadow-md shadow-red-950/60 group"
                                        >
                                            Continue
                                            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onStartStep(step.id)}
                                            aria-label={`Open ${step.label}`}
                                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-red-900/40 text-xs font-semibold text-red-700 hover:text-red-400 hover:border-red-700 transition-all"
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

            {/* ── All complete state */}
            {allComplete && (
                <AllCompletePanel
                    steps={PHASE1_STEPS}
                    completedFormIds={completedFormIds}
                    onStartStep={onStartStep}
                    onCompletePhase={onCompletePhase}
                />
            )}
        </div>
    );
};
