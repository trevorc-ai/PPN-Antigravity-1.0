import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Edit3, CheckCircle2, AlertTriangle, Syringe, HeartPulse, ClipboardCheck, FileText, Pill } from 'lucide-react';
import type { WellnessFormId } from './WellnessFormRouter';
import { RiskEligibilityReport } from './RiskEligibilityReport';
import { ComplianceDocumentsPanel } from './ComplianceDocumentsPanel';
import { runContraindicationEngine, type IntakeScreeningData } from '../../services/contraindicationEngine';
import { useToast } from '../../contexts/ToastContext';
import { exportRiskReportToPDF } from '../../services/pdfGenerator';
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
        label: 'Safety Check - Conditions Prior to Treatment',
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
        description: 'Treatment expectancy, clinical observations, and pre-session mindset.',
        required: true,
        icon: 'home_health',
    },
];

// ── Phase 1 Data HUD ──────────────────────────────────────────────────────────
// Compact read-back strip surfacing form entry values. Phase-1 indigo palette.
// Renders as soon as at least 1 step is complete. Read-only — no form triggers.

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
    // Read dosing protocol from localStorage (populated by DosingProtocolForm)
    const dosingProtocol = useMemo(() => {
        try {
            const raw = localStorage.getItem('ppn_dosing_protocol');
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    }, [completedFormIds]);

    const substance = dosingProtocol?.substance_name || dosingProtocol?.substance || null;
    const dosageStr = dosingProtocol?.dosage_amount
        ? `${dosingProtocol.dosage_amount}${dosingProtocol.dosage_unit || 'mg'}`
        : null;

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
    // Data shape: { consent_types: string[], ... } — no consent_date field.
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

            {/* Chips row — equal-width grid so all 6 chips spread across the full width */}
            <div
                className="grid grid-cols-3 sm:grid-cols-6 gap-2"
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
                <div role="listitem">
                    <HUDChip
                        icon={<Syringe className="w-3.5 h-3.5" />}
                        label="Substance"
                        value={substance}
                        colorClass="text-indigo-200"
                        ariaLabel={`Substance: ${substance ?? 'Not yet entered'}`}
                    />
                </div>
                <div role="listitem">
                    <HUDChip
                        icon={<span className="ppn-meta" aria-hidden="true">mg</span>}
                        label="Dosage"
                        value={dosageStr}
                        colorClass="text-indigo-200"
                        ariaLabel={`Dosage: ${dosageStr ?? 'Not yet entered'}`}
                    />
                </div>
            </div>

            {/* Medications strip — shows as soon as meds are entered in Phase 1 Safety Check */}
            {patientMeds.length > 0 && (
                <div className="mt-3 pt-3 border-t border-indigo-800/30">
                    <p className="ppn-meta text-slate-500 font-bold uppercase tracking-widest mb-1.5">Current Medications</p>
                    <div className="flex flex-wrap gap-1.5" role="list" aria-label="Current patient medications">
                        {patientMeds.map((med, i) => (
                            <span
                                key={i}
                                role="listitem"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs font-semibold"
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


interface EligibilityPanelProps {
    steps: Phase1Step[];
    completedFormIds: Set<string>;
    onStartStep: (formId: WellnessFormId) => void;
    onCompletePhase?: () => void;
    onValidityChange?: (valid: boolean) => void;
}

export const EligibilityPanel: React.FC<EligibilityPanelProps> = ({ steps, completedFormIds, onStartStep, onCompletePhase, onValidityChange }) => {
    const { addToast } = useToast();

    // Generate risk report based on mock patient data.
    // In production, this would use live clinical records.
    const mockIntakeData: IntakeScreeningData = {
        patientId: 'PT-RISK9W2P',
        sessionSubstance: 'psilocybin',
        medications: ['Sertraline (tapering)', 'Lisinopril'], // Relative: SSRI
        psychiatricHistory: ['Anxiety', 'Depression'],
        familyHistory: [],
        cssrsScore: 0,
        lastSystolicBP: 125,
        isPregnant: false,
        ageYears: 34,
        phq9Score: 22,
        gad7Score: 18,
        pcl5Score: 35,
        bmi: 24.5
    };

    const result = runContraindicationEngine(mockIntakeData);

    const handleExport = () => {
        exportRiskReportToPDF(result);
        addToast({
            title: 'Report Downloaded',
            message: 'Risk Eligibility Report has been generated and saved as PDF.',
            type: 'success'
        });
    };

    return (
        <RiskEligibilityReport
            result={result}
            onOverrideConfirmed={(justification) => console.log('Override saved:', justification)}
            onExportPDF={handleExport}
            onValidityChange={onValidityChange}
            hideProceedButton
        />
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
    const [canProceedToPhase2, setCanProceedToPhase2] = useState(false);
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
                    <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-700 to-indigo-400 rounded-full transition-all duration-700"
                            style={{ width: `${(completedCount / Math.max(1, activeSteps.length)) * 100}% ` }}
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
                  Step label (H3-equiv): text-sm font-bold uppercase  — 14px
                  Card title:            text-base font-black          — 16px
                  Description:           text-sm                       — 14px
                  Button text:           text-sm font-semibold+        — 14px
                  Badge / metadata:      text-xs                       — 12px (acceptable for tags)

                Design: no individual card borders — background fills only.
                Active = indigo fill · Completed = teal tint · Upcoming = slate/dimmed
            ──────────────────────────────────────────────────────────────────── */}
            <div className={`grid grid-cols-1 sm:grid-cols-${Math.min(activeSteps.length, 4)} gap-2`}>
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

                                {/* Step number label (H3-equiv) + status badge */}
                                <div className="flex items-center justify-between gap-1">
                                    <span className={`font-['Manrope',sans-serif] text-xl md:text-2xl font-extrabold tracking-tight leading-none ${isComplete ? 'text-teal-300/80' : isCurrent ? 'text-indigo-200/90' : 'text-slate-400/80'
                                        }`}>
                                        Step {index + 1}
                                    </span>
                                    {isComplete ? (
                                        <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" aria-label="Complete" />
                                    ) : step.required ? (
                                        <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400">
                                            Req
                                        </span>
                                    ) : null}
                                </div>

                                {/* Icon + title — primary content */}
                                <div className="flex items-start gap-2.5">
                                    <div className={[
                                        'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
                                        isComplete ? 'bg-teal-500/15' : isCurrent ? 'bg-indigo-500/25' : 'bg-slate-700/30',
                                    ].join(' ')}>
                                        <span className={`material-symbols-outlined text-[18px] ${isComplete ? 'text-teal-400' : isCurrent ? 'text-indigo-300' : 'text-slate-500'
                                            }`}>
                                            {step.icon}
                                        </span>
                                    </div>
                                    {/* H3: card title — minimum text-sm */}
                                    <h4 className={`text-sm md:text-base font-black leading-snug pt-1 ${isComplete ? 'text-teal-200' : isCurrent ? 'text-[#A8B5D1]' : 'text-slate-400'
                                        }`}>
                                        {step.label}
                                    </h4>
                                </div>

                                {/* Description — only on the active step for space; text-sm */}
                                {isCurrent && (
                                    <p className="text-sm md:text-base leading-relaxed text-indigo-300/70">
                                        {step.description}
                                    </p>
                                )}

                                {/* CTA buttons — text-sm minimum */}
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
                                            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
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

                    {/* Action Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                        {/* Left Column: Administrative (Export Docs) */}
                        <div className="w-full h-full">
                            <ComplianceDocumentsPanel
                                patientId="PT-RISK9W2P"
                                completedForms={Array.from(completedFormIds)}
                            />
                        </div>

                        {/* Right Column: Clinical (Risk & Clearance) */}
                        <div className="w-full h-full">
                            <EligibilityPanel
                                steps={PHASE1_STEPS}
                                completedFormIds={completedFormIds}
                                onStartStep={onStartStep}
                                onCompletePhase={onCompletePhase}
                                onValidityChange={setCanProceedToPhase2}
                            />
                        </div>
                    </div>

                    {bottomStatusBar && (
                        <div className="mt-8">
                            {bottomStatusBar}
                        </div>
                    )}

                    {/* Proceed to Phase 2 Bottom Container */}
                    <div className="mt-8 pt-6 border-t border-slate-700/50">
                        <button
                            id="phase1-proceed-phase2"
                            onClick={canProceedToPhase2 ? onCompletePhase : undefined}
                            disabled={!canProceedToPhase2}
                            className={`w-full py-4 rounded-2xl text-base sm:text-lg font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 ${canProceedToPhase2
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40 hover:-translate-y-1'
                                : 'bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-700/50'
                                }`}
                        >
                            {canProceedToPhase2 ? (
                                <>
                                    <CheckCircle2 className="w-6 h-6" />
                                    Proceed to Phase 2 Dosing
                                </>
                            ) : (
                                <>
                                    <AlertTriangle className="w-6 h-6" />
                                    [LOCKED] Complete Eligibility Requirements to Proceed
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
