import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, ArrowRight, ChevronDown, ChevronUp, Edit3, Compass } from 'lucide-react';
import type { WellnessFormId } from './WellnessFormRouter';

export interface Phase1Step {
    id: WellnessFormId;
    label: string;
    description: string;
    required: boolean;
    icon: string;
    color: string;       // tailwind text color for the hero card accent
    bgColor: string;     // tailwind bg color for the hero card
    borderColor: string; // tailwind border color for the hero card
}

export const PHASE1_STEPS: Phase1Step[] = [
    {
        id: 'consent',
        label: 'Informed Consent',
        description: 'Document patient consent before any clinical activity begins.',
        required: true,
        icon: 'check_circle',
        color: 'text-blue-300',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/40',
    },
    {
        id: 'structured-safety',
        label: 'Safety Screen & Eligibility',
        description: 'Screen for contraindications, suicidality risk, and treatment eligibility.',
        required: true,
        icon: 'shield',
        color: 'text-amber-300',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/40',
    },
    {
        id: 'mental-health',
        label: 'Mental Health Screening',
        description: 'Administer PHQ-9, GAD-7, and baseline psychological assessment.',
        required: true,
        icon: 'psychology',
        color: 'text-purple-300',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/40',
    },
    {
        id: 'set-and-setting',
        label: 'Set & Setting',
        description: 'Document environment, expectations, and the integration plan.',
        required: true,
        icon: 'home_health',
        color: 'text-emerald-300',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/40',
    },
    {
        id: 'baseline-observations',
        label: 'Baseline Observations',
        description: 'Record pre-treatment clinical observations and vital notes.',
        required: false,
        icon: 'visibility',
        color: 'text-slate-300',
        bgColor: 'bg-slate-500/10',
        borderColor: 'border-slate-500/40',
    },
];

// ── AllCompletePanel ─────────────────────────────────────────────────────────
// Shown when all Phase 1 steps are done. Primary CTA (Unlock Phase 2) is
// immediately visible; step review is in a collapsible accordion below it.
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
                        <CheckCircle className="w-7 h-7 text-emerald-400" aria-hidden="true" />
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
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 overflow-hidden">
                <button
                    onClick={() => setReviewOpen(o => !o)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-800/40 transition-colors"
                    aria-expanded={reviewOpen}
                    aria-controls="phase1-review-panel"
                >
                    <span className="text-sm font-bold text-slate-300">
                        Review completed steps ({steps.length}/{steps.length})
                    </span>
                    {reviewOpen
                        ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
                </button>

                {reviewOpen && (
                    <div id="phase1-review-panel" className="border-t border-slate-700/50 divide-y divide-slate-700/30">
                        {steps.map((step) => (
                            <div key={step.id} className="flex items-center gap-4 px-5 py-3.5">
                                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-300 truncate">{step.label}</p>
                                    <p className="text-xs text-slate-500 truncate">{step.description}</p>
                                </div>
                                <button
                                    onClick={() => onStartStep(step.id)}
                                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs font-bold text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-all"
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
        <div className="space-y-3">

            {/* ── HERO: Current Step ─────────────────────────────────────────── */}
            {!allComplete && currentStep && (
                <div
                    ref={heroRef}
                    className={`relative overflow-hidden rounded-2xl border ${currentStep.borderColor} ${currentStep.bgColor} backdrop-blur-xl shadow-2xl`}
                >
                    {/* Subtle ambient glow behind the card */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.3) 0%, transparent 70%)' }}
                    />

                    <div className="relative z-10 p-6 sm:p-8">
                        <div className="flex flex-col gap-5">
                            {/* Top row: CTA LEFT + step identity RIGHT */}
                            <div className="flex flex-col sm:flex-row items-start gap-5">

                                {/* LEFT: Begin CTA */}
                                <div className="flex flex-col items-start gap-2 flex-shrink-0">
                                    <button
                                        id={`phase1-step-${currentStepIndex + 1}-start`}
                                        onClick={() => onStartStep(currentStep.id)}
                                        aria-label={`Continue to ${currentStep.label}`}
                                        className="flex items-center gap-4 px-10 py-5 bg-red-600/25 hover:bg-red-600/40 border-2 border-red-500/60 hover:border-red-400/80 text-red-100 font-black text-lg rounded-2xl transition-all active:scale-95 shadow-xl shadow-red-900/40 group"
                                    >
                                        Continue
                                        <ChevronDown className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
                                    </button>
                                    <span className="text-xs text-slate-500 font-medium pl-1">
                                        Opens clinical form
                                    </span>
                                </div>

                                {/* RIGHT: Step identity */}
                                <div className="flex-1">
                                    {/* Step counter */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                                            Step {currentStepIndex + 1} of {PHASE1_STEPS.length}
                                        </span>
                                        {currentStep.required && (
                                            <span className="px-2 py-0.5 text-xs font-black uppercase tracking-widest bg-amber-500/15 border border-amber-500/25 text-amber-400 rounded-md">
                                                Required
                                            </span>
                                        )}
                                    </div>

                                    {/* Icon + Title */}
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className={`w-12 h-12 rounded-2xl ${currentStep.bgColor} border ${currentStep.borderColor} flex items-center justify-center flex-shrink-0`}>
                                            <span className={`material-symbols-outlined text-2xl ${currentStep.color}`}>
                                                {currentStep.icon}
                                            </span>
                                        </div>
                                        <h2 className={`text-xl font-black ${currentStep.color} leading-tight`}>
                                            {currentStep.label}
                                        </h2>
                                    </div>

                                    {/* Description */}
                                    <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
                                        {currentStep.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── All complete state — compact hero + collapsible step review ──── */}
            {allComplete && (
                <AllCompletePanel
                    steps={PHASE1_STEPS}
                    completedFormIds={completedFormIds}
                    onStartStep={onStartStep}
                    onCompletePhase={onCompletePhase}
                />
            )}

            {/* ── Step rail — all 5 clearly labeled ───────────────────────── */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {PHASE1_STEPS.map((step, index) => {
                    const isComplete = completedFormIds.has(step.id);
                    const isCurrent = index === currentStepIndex;

                    return (
                        <button
                            key={step.id}
                            type="button"
                            onClick={() => onStartStep(step.id)}
                            aria-label={`${isComplete ? 'Amend' : 'Start'} step ${index + 1}: ${step.label}`}
                            className={[
                                'relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-center group cursor-pointer',
                                isComplete
                                    ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/18'
                                    : isCurrent
                                        ? `${step.bgColor} ${step.borderColor} ring-1 ring-offset-1 ring-offset-slate-900/80`
                                        // Upcoming: NO opacity fade — fully readable, just muted tones
                                        : 'bg-slate-800/30 border-slate-700/40 hover:bg-slate-800/50',
                            ].join(' ')}
                        >
                            {/* Step number badge */}
                            <span className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${isComplete ? 'text-emerald-500' : isCurrent ? step.color : 'text-slate-500'
                                }`}>
                                Step {index + 1}
                            </span>

                            {/* Status icon */}
                            <div className={[
                                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                                isComplete
                                    ? 'bg-emerald-500/20'
                                    : isCurrent
                                        ? `${step.bgColor} ring-2 ring-offset-1 ring-offset-slate-900`
                                        : 'bg-slate-700/40',
                            ].join(' ')}>
                                {isComplete ? (
                                    // Compass icon instead of check to match "guided tour" theme
                                    <Compass className="w-4 h-4 text-emerald-400" aria-label="complete" />
                                ) : (
                                    <span className={`material-symbols-outlined text-sm ${isCurrent ? step.color : 'text-slate-400'
                                        }`}>
                                        {step.icon}
                                    </span>
                                )}
                            </div>

                            {/* Step label — always fully readable */}
                            <span className={`text-xs font-semibold leading-tight text-center ${isComplete ? 'text-emerald-400' : isCurrent ? step.color : 'text-slate-300'
                                }`}>
                                {step.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* ── Progress bar ─────────────────────────────────────────────── */}
            <div className="flex items-center gap-3 px-1">
                <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-700"
                        style={{ width: `${(completedCount / PHASE1_STEPS.length) * 100}%` }}
                    />
                </div>
                <span className="text-xs font-bold text-slate-500 flex-shrink-0">
                    {completedCount}/{PHASE1_STEPS.length} complete
                </span>
            </div>
        </div>
    );
};
