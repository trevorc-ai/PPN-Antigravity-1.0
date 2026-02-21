import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Edit3, CheckCircle2 } from 'lucide-react';
import type { WellnessFormId } from './WellnessFormRouter';

// ── PHASE 1 COLOR: INDIGO ─────────────────────────────────────────────────────
// All Phase 1 UI uses the indigo family exclusively.
// Red = warnings/adverse only. Bright emerald = removed site-wide.

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

// ── AllCompletePanel ──────────────────────────────────────────────────────────
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
            <div className="rounded-2xl bg-teal-900/20 p-6">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-teal-500/15 flex items-center justify-center">
                        <CheckCircle2 className="w-7 h-7 text-teal-400" aria-hidden="true" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-xl font-black text-teal-200 leading-tight">All Preparation Steps Complete</h2>
                        <p className="text-sm text-slate-400 mt-1">Patient is cleared for Phase 2: Dosing Session.</p>
                    </div>
                    {onCompletePhase && (
                        <button
                            id="phase1-complete-unlock-phase2"
                            data-tour="complete-phase-1"
                            onClick={onCompletePhase}
                            className="flex-shrink-0 flex items-center gap-3 px-7 py-3.5 bg-teal-800/40 hover:bg-teal-700/50 border border-teal-600/40 text-teal-200 font-black text-base rounded-2xl transition-all active:scale-95 shadow-lg group whitespace-nowrap"
                            aria-label="Mark Phase 1 complete and unlock Phase 2"
                        >
                            Unlock Phase 2
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                        </button>
                    )}
                </div>
            </div>

            <div className="rounded-2xl bg-slate-800/30 overflow-hidden">
                <button
                    onClick={() => setReviewOpen(o => !o)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-800/50 transition-colors"
                    aria-expanded={reviewOpen}
                    aria-controls="phase1-review-panel"
                >
                    <span className="text-sm font-bold text-slate-400">
                        Review completed steps ({steps.length}/{steps.length})
                    </span>
                    {reviewOpen
                        ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
                </button>

                {reviewOpen && (
                    <div id="phase1-review-panel" className="divide-y divide-slate-700/30">
                        {steps.map((step) => (
                            <div key={step.id} className="flex items-center gap-4 px-5 py-3.5">
                                <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" aria-hidden="true" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-300 truncate">{step.label}</p>
                                </div>
                                <button
                                    onClick={() => onStartStep(step.id)}
                                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-300 transition-all"
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

// ── Phase1StepGuide ───────────────────────────────────────────────────────────
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

    useEffect(() => {
        if (heroRef.current) {
            heroRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [currentStepIndex]);

    return (
        <div className="space-y-3">

            {/* ── Progress header ────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-indigo-400/70">
                    Preparation · 5 Steps
                </span>
                <div className="flex items-center gap-3">
                    <div className="w-28 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-700 to-indigo-400 rounded-full transition-all duration-700"
                            style={{ width: `${(completedCount / PHASE1_STEPS.length) * 100}%` }}
                        />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                        {completedCount}/{PHASE1_STEPS.length}
                    </span>
                </div>
            </div>

            {/* ── 5-Step card sequence ────────────────────────────────────────
                Design rule: NO individual card borders. Use fill density only.
                - Current step  = solid indigo fill (stands out clearly)
                - Completed     = very subtle teal tint with checkmark
                - Upcoming      = barely-there slate fill — readable, not distracting
            ──────────────────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {PHASE1_STEPS.map((step, index) => {
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
                            {/* Top accent stripe — width indicates phase family */}
                            <div className={[
                                'h-0.5 w-full',
                                isComplete ? 'bg-teal-600/60' : isCurrent ? 'bg-indigo-400' : 'bg-slate-700/40',
                            ].join(' ')} aria-hidden="true" />

                            <div className="flex flex-col flex-1 p-4 gap-3">
                                {/* Step number + status */}
                                <div className="flex items-center justify-between">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isComplete ? 'text-teal-500' : isCurrent ? 'text-indigo-400' : 'text-slate-600'
                                        }`}>
                                        Step {index + 1}
                                    </span>
                                    {isComplete ? (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" aria-hidden="true" />
                                    ) : step.required && !isCurrent ? (
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            req
                                        </span>
                                    ) : null}
                                </div>

                                {/* Icon + label */}
                                <div className="flex items-start gap-2">
                                    <div className={[
                                        'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                                        isComplete ? 'bg-teal-500/10' : isCurrent ? 'bg-indigo-500/25' : 'bg-slate-700/30',
                                    ].join(' ')}>
                                        <span className={`material-symbols-outlined text-sm ${isComplete ? 'text-teal-400' : isCurrent ? 'text-indigo-300' : 'text-slate-500'
                                            }`}>
                                            {step.icon}
                                        </span>
                                    </div>
                                    <h3 className={`text-xs font-black leading-tight pt-1 ${isComplete ? 'text-teal-300' : isCurrent ? 'text-indigo-100' : 'text-slate-400'
                                        }`}>
                                        {step.label}
                                    </h3>
                                </div>

                                {/* Description — only on active step */}
                                {isCurrent && (
                                    <p className="text-xs leading-relaxed text-indigo-300/60">
                                        {step.description}
                                    </p>
                                )}

                                {/* CTA */}
                                <div className="mt-auto pt-1">
                                    {isComplete ? (
                                        <button
                                            onClick={() => onStartStep(step.id)}
                                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-teal-400 transition-all"
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
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600/40 hover:bg-indigo-600/60 text-indigo-100 font-black text-sm rounded-xl transition-all active:scale-95 shadow-md shadow-indigo-950/50 group"
                                        >
                                            Continue
                                            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onStartStep(step.id)}
                                            aria-label={`Open ${step.label}`}
                                            className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-400 transition-all"
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
