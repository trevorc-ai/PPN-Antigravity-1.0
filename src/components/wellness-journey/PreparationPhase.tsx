import React, { useState, useMemo } from 'react';
import { Brain, Shield, CheckCircle, AlertTriangle, FileText, ArrowRight, Lock, Syringe, ClipboardCheck, HeartPulse, User } from 'lucide-react';
import { runContraindicationEngine, type IntakeScreeningData, type ContraindicationResult } from '../../services/contraindicationEngine';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';
import { WorkflowActionCard } from './WorkflowCards';
import { WellnessFormId } from './WellnessFormRouter';
import { RiskEligibilityReport } from './RiskEligibilityReport';
import { downloadReport } from '../../services/reportGenerator';

// ─── Phase 1 Data HUD ───────────────────────────────────────────────────────
// Compact read-back strip surfacing form entry values. Phase-1 indigo palette.
// Read-only — no interactive elements, no form triggers.

interface GateEntry {
    isComplete: boolean;
    date?: string;
    label: string;
    action: () => void;
    description: string;
}

interface Phase1HUDProps {
    journey: any;
    gates: Record<string, GateEntry>;
    contraindicationResult?: ContraindicationResult | null;
}

// ─── HUDChip (base) ─────────────────────────────────────────────────────────
// Renders a single read-only chip with icon, meta-label, and value.
// Empty state: shows "Not recorded" instead of a bare dash.
function HUDChip({
    icon,
    label,
    value,
    colorClass = 'text-indigo-200',
    containerClass,
    ariaLabel,
    children,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | null | undefined;
    colorClass?: string;
    containerClass?: string;
    ariaLabel?: string;
    children?: React.ReactNode; // optional wrapper for tooltip
}) {
    const isEmpty = value === null || value === undefined || value === '';
    const valueNode = (
        <p
            className={`text-sm font-black leading-none truncate ${isEmpty ? 'ppn-meta text-slate-500' : colorClass
                }`}
        >
            {isEmpty ? 'Not recorded' : value}
        </p>
    );

    return (
        <div
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border min-w-0 flex-shrink-0 ${containerClass ??
                (isEmpty
                    ? 'bg-slate-800/20 border-slate-700/30'
                    : 'bg-indigo-950/40 border-indigo-700/40')
                }`}
            aria-label={ariaLabel ?? `${label}: ${isEmpty ? 'Not recorded' : value}`}
        >
            <span
                className={`flex-shrink-0 ${isEmpty ? 'text-slate-600' : 'text-indigo-400'
                    }`}
                aria-hidden="true"
            >
                {icon}
            </span>
            <div className="min-w-0">
                <p className="ppn-meta text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">
                    {label}
                </p>
                {children ?? valueNode}
            </div>
        </div>
    );
}

// ─── getSeverityInfo (module-level helper) ───────────────────────────────────
// Computes severity label and color for PHQ-9 / GAD-7 scores.
// NOTE: Also used inline in PreparationPhase for the Baseline Clinical Profile.
function getSeverityInfo(score: number, type: 'phq9' | 'gad7') {
    if (type === 'phq9') {
        if (score >= 20) return { label: 'Severe Depression', color: 'text-red-400' };
        if (score >= 15) return { label: 'Moderately Severe Depression', color: 'text-orange-400' };
        if (score >= 10) return { label: 'Moderate Depression', color: 'text-amber-400' };
        if (score >= 5) return { label: 'Mild Depression', color: 'text-yellow-400' };
        return { label: 'Minimal Depression', color: 'text-emerald-400' };
    } else {
        if (score >= 15) return { label: 'Severe Anxiety', color: 'text-red-400' };
        if (score >= 10) return { label: 'Moderate Anxiety', color: 'text-amber-400' };
        if (score >= 5) return { label: 'Mild Anxiety', color: 'text-yellow-400' };
        return { label: 'Minimal Anxiety', color: 'text-emerald-400' };
    }
}

// ─── riskChipProps ──────────────────────────────────────────────────────────
// Returns styling tokens for the Risk Level chip based on verdict.
function getRiskChipTokens(verdict: ContraindicationResult['verdict'] | null) {
    if (!verdict) {
        return {
            containerClass: 'bg-slate-800/20 border-slate-700/30',
            iconClass: 'text-slate-600',
            valueText: 'Pending gates',
            valueClass: 'ppn-meta text-slate-500',
        };
    }
    if (verdict === 'CLEAR') {
        return {
            containerClass: 'bg-emerald-900/20 border-emerald-700/30',
            iconClass: 'text-emerald-400',
            valueText: 'Clear',
            valueClass: 'text-sm font-black leading-none truncate text-emerald-400',
        };
    }
    if (verdict === 'PROCEED_WITH_CAUTION') {
        return {
            containerClass: 'bg-amber-900/20 border-amber-700/30',
            iconClass: 'text-amber-400',
            valueText: 'Caution',
            valueClass: 'text-sm font-black leading-none truncate text-amber-400',
        };
    }
    // DO_NOT_PROCEED
    return {
        containerClass: 'bg-red-900/20 border-red-700/30',
        iconClass: 'text-red-400',
        valueText: 'Do Not Proceed',
        valueClass: 'text-sm font-black leading-none truncate text-red-400',
    };
}

const Phase1HUD: React.FC<Phase1HUDProps> = ({ journey, gates, contraindicationResult }) => {
    // Read dosing protocol from localStorage (same source as Phase 2 HUD)
    const dosingProtocol = useMemo(() => {
        try {
            const raw = localStorage.getItem('ppn_dosing_protocol');
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    }, []);

    const substance = dosingProtocol?.substance_name || dosingProtocol?.substance || null;
    const dosageStr = dosingProtocol?.dosage_amount
        ? `${dosingProtocol.dosage_amount}${dosingProtocol.dosage_unit ?? 'mg'}`
        : null;

    // PHQ-9 / GAD-7 severity
    const phq9 = journey.baseline?.phq9 ?? null;
    const gad7 = journey.baseline?.gad7 ?? null;
    const phq9Info = phq9 !== null ? getSeverityInfo(phq9, 'phq9') : null;
    const gad7Info = gad7 !== null ? getSeverityInfo(gad7, 'gad7') : null;

    // Patient Age
    const patientAge = journey.demographics?.age != null
        ? `${journey.demographics.age} yrs`
        : null;

    // Risk Level chip
    const riskTokens = getRiskChipTokens(contraindicationResult?.verdict ?? null);

    // Gate progress
    const completedCount = (Object.values(gates) as GateEntry[]).filter(g => g.isComplete).length;
    const totalCount = Object.keys(gates).length;

    return (
        <section
            aria-label="Phase 1 preparation summary"
            className="relative rounded-2xl border border-indigo-700/30 bg-indigo-950/15 backdrop-blur-sm p-5 overflow-hidden"
        >
            {/* ── Header: title + STEPS pill ── */}
            <div className="flex items-center justify-between gap-3 mb-4">
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
                    {completedCount}/{totalCount} Steps
                </span>
            </div>

            {/* ── Two-group chip layout ── */}
            <div className="flex flex-col sm:flex-row gap-4">

                {/* GROUP A — PROTOCOL */}
                <div className="flex flex-col gap-2" style={{ flex: '0 0 auto', minWidth: 0 }}>
                    <p className="ppn-meta text-slate-600 font-bold uppercase tracking-widest leading-none">
                        Protocol
                    </p>
                    <div
                        role="list"
                        aria-label="Protocol values"
                        className="flex flex-row sm:flex-col gap-2"
                    >
                        {/* Substance */}
                        <div role="listitem">
                            <HUDChip
                                icon={<Syringe className="w-3.5 h-3.5" />}
                                label="Substance"
                                value={substance}
                                colorClass="text-indigo-200"
                                ariaLabel={`Substance: ${substance ?? 'Not recorded'}`}
                            />
                        </div>
                        {/* Dosage */}
                        <div role="listitem">
                            <HUDChip
                                icon={
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontSize: '14px' }}
                                        aria-hidden="true"
                                    >
                                        scale
                                    </span>
                                }
                                label="Dosage"
                                value={dosageStr}
                                colorClass="text-indigo-200"
                                ariaLabel={`Dosage: ${dosageStr ?? 'Not recorded'}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Vertical rule divider (desktop only) */}
                <div
                    className="hidden sm:block w-px self-stretch bg-slate-700/40 flex-shrink-0"
                    aria-hidden="true"
                />

                {/* GROUP B — PATIENT PROFILE */}
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                    <p className="ppn-meta text-slate-600 font-bold uppercase tracking-widest leading-none">
                        Patient Profile
                    </p>
                    <div
                        role="list"
                        aria-label="Patient profile clinical values"
                        className="flex flex-wrap gap-2"
                    >
                        {/* PHQ-9 Severity */}
                        <div role="listitem">
                            {phq9Info ? (
                                <AdvancedTooltip
                                    content={`${phq9Info.label} (PHQ-9: ${phq9})`}
                                    position="top"
                                >
                                    <HUDChip
                                        icon={<Brain className="w-3.5 h-3.5" />}
                                        label="PHQ-9 Severity"
                                        value={phq9Info.label}
                                        colorClass={phq9Info.color}
                                        ariaLabel={`PHQ-9 severity: ${phq9Info.label} (score ${phq9})`}
                                    />
                                </AdvancedTooltip>
                            ) : (
                                <HUDChip
                                    icon={<Brain className="w-3.5 h-3.5" />}
                                    label="PHQ-9 Severity"
                                    value={null}
                                    ariaLabel="PHQ-9 severity: Not recorded"
                                />
                            )}
                        </div>

                        {/* GAD-7 Severity */}
                        <div role="listitem">
                            {gad7Info ? (
                                <AdvancedTooltip
                                    content={`${gad7Info.label} (GAD-7: ${gad7})`}
                                    position="top"
                                >
                                    <HUDChip
                                        icon={<HeartPulse className="w-3.5 h-3.5" />}
                                        label="GAD-7 Severity"
                                        value={gad7Info.label}
                                        colorClass={gad7Info.color}
                                        ariaLabel={`GAD-7 severity: ${gad7Info.label} (score ${gad7})`}
                                    />
                                </AdvancedTooltip>
                            ) : (
                                <HUDChip
                                    icon={<HeartPulse className="w-3.5 h-3.5" />}
                                    label="GAD-7 Severity"
                                    value={null}
                                    ariaLabel="GAD-7 severity: Not recorded"
                                />
                            )}
                        </div>

                        {/* Risk Level */}
                        <div role="listitem">
                            <div
                                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border min-w-0 flex-shrink-0 ${riskTokens.containerClass}`}
                                aria-label={`Risk level: ${riskTokens.valueText}`}
                            >
                                <span className={`flex-shrink-0 ${riskTokens.iconClass}`} aria-hidden="true">
                                    <Shield className="w-3.5 h-3.5" />
                                </span>
                                <div className="min-w-0">
                                    <p className="ppn-meta text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">
                                        Risk Level
                                    </p>
                                    <p className={`leading-none truncate ${riskTokens.valueClass}`}>
                                        {riskTokens.valueText}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Patient Age */}
                        <div role="listitem">
                            <HUDChip
                                icon={<User className="w-3.5 h-3.5" />}
                                label="Patient Age"
                                value={patientAge}
                                colorClass="text-slate-300"
                                ariaLabel={`Patient age: ${patientAge ?? 'Not recorded'}`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ─── PreparationPhase ────────────────────────────────────────────────────────

interface PreparationPhaseProps {
    journey: any;
    onOpenForm: (formId: WellnessFormId) => void;
    /** Medication list from baseline observations — normalized lowercase strings */
    medications?: string[];
    onProceedToPhase2?: () => void;
}

export const PreparationPhase: React.FC<PreparationPhaseProps> = ({ journey, onOpenForm, medications = [], onProceedToPhase2 }) => {
    const [overrideJustification, setOverrideJustification] = useState('');
    const [canProceedToPhase2, setCanProceedToPhase2] = useState(false);

    // Gate Status Logic (Derived from journey data) — must be before useMemo
    const gates = {
        consent: {
            isComplete: journey.benchmark?.hasConsent,
            date: journey.benchmark?.consentDate,
            label: "Informed Consent",
            action: () => onOpenForm('consent'),
            description: "Verify patient understanding and signature."
        },
        assessment: {
            isComplete: journey.benchmark?.hasBaselineAssessment,
            date: journey.benchmark?.baselineAssessmentDate,
            label: "Baseline Assessments",
            action: () => onOpenForm('mental-health'),
            description: "PHQ-9, GAD-7, and vital signs."
        },
        observations: {
            isComplete: journey.benchmark?.hasSetAndSetting,
            date: journey.benchmark?.setAndSettingDate,
            label: "Set & Setting",
            action: () => onOpenForm('set-and-setting'),
            description: "Treatment expectancy & clinical observations."
        },
        protocol: {
            isComplete: journey.benchmark?.hasDosingProtocol,
            date: journey.benchmark?.dosingProtocolDate,
            label: "Dosing Protocol",
            action: () => onOpenForm('dosing-protocol'),
            description: "Substance, dosage, and guide assignment."
        }
    };

    const allGatesPassed = Object.values(gates).every(g => g.isComplete);

    // Run ContraindicationEngine once all 4 gates are complete
    const contraindicationResult = useMemo(() => {
        if (!allGatesPassed) return null;
        const screeningData: IntakeScreeningData = {
            patientId: journey.patientId,
            sessionSubstance: journey.session?.substance?.toLowerCase() ?? 'psilocybin',
            medications: medications.map(m => m.toLowerCase()),
            psychiatricHistory: [],
            familyHistory: [],
            cssrsScore: journey.safety?.events?.reduce((max: number, e: any) => Math.max(max, e.cssrsScore ?? 0), 0),
            lastSystolicBP: journey.risk?.vitals?.bloodPressureSystolic,
            phq9Score: journey.baseline?.phq9,
            gad7Score: journey.baseline?.gad7,
            pcl5Score: journey.risk?.baseline?.pcl5,
            ageYears: journey.demographics?.age,
            isPregnant: false,
        };
        return runContraindicationEngine(screeningData);
    }, [allGatesPassed, journey.patientId]); // eslint-disable-line react-hooks/exhaustive-deps

    // Severity info for Baseline Clinical Profile section (uses module-level getSeverityInfo)
    const phq9Info = getSeverityInfo(journey.baseline.phq9 ?? 0, 'phq9');
    const gad7Info = getSeverityInfo(journey.baseline.gad7 ?? 0, 'gad7');

    return (
        <div className="space-y-6 animate-in fade-in duration-500" role="main" aria-label="Phase 1: Preparation">

            {/* 1. SESSION GATES CARD */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Shield className="w-32 h-32 text-slate-400" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-[#A8B5D1]">Session Readiness</h2>
                            <p className="text-slate-400 mt-1">Complete all safety gates to unlock the dosing session.</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${allGatesPassed
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            }`}>
                            {allGatesPassed ? 'Ready to Start' : 'Action Required'}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(gates).map(([key, gate]) => (
                            <WorkflowActionCard
                                key={key}
                                phase={1}
                                status={gate.isComplete ? 'completed' : 'active'}
                                title={gate.label}
                                description={gate.description}
                                icon={<FileText className={`w-5 h-5 ${gate.isComplete ? 'text-emerald-500' : 'text-sky-400'}`} />}
                                date={gate.date}
                                onClick={gate.action}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. BASELINE METRICS (full-width — Forecast panel removed per WO-527) */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Brain className="w-6 h-6 text-slate-400" />
                    <h3 className="ppn-card-title">Baseline Clinical Profile</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* PHQ-9 */}
                    <div className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl text-center">
                        <div className={`text-xl font-black mb-0.5 ${phq9Info.color}`} aria-label={`PHQ-9 score ${journey.baseline.phq9}`}>{journey.baseline.phq9}</div>
                        <div className="ppn-meta text-slate-500 font-bold uppercase tracking-wider">PHQ-9</div>
                        <div className="ppn-meta text-slate-500 mt-0.5 truncate">{phq9Info.label}</div>
                    </div>
                    {/* GAD-7 */}
                    <div className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl text-center">
                        <div className={`text-xl font-black mb-0.5 ${gad7Info.color}`} aria-label={`GAD-7 score ${journey.baseline.gad7}`}>{journey.baseline.gad7}</div>
                        <div className="ppn-meta text-slate-500 font-bold uppercase tracking-wider">GAD-7</div>
                        <div className="ppn-meta text-slate-500 mt-0.5 truncate">{gad7Info.label}</div>
                    </div>
                    {/* ACE */}
                    <div className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl text-center">
                        <div className="text-xl font-black text-amber-400 mb-0.5" aria-label={`ACE score ${journey.baseline.aceScore}`}>{journey.baseline.aceScore}</div>
                        <div className="ppn-meta text-slate-500 font-bold uppercase tracking-wider">ACE Score</div>
                        <div className="ppn-meta text-slate-500 mt-0.5">Trauma Hist.</div>
                    </div>
                    {/* Expectancy */}
                    <div className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl text-center">
                        <div className="text-xl font-black text-indigo-400 mb-0.5" aria-label={`Expectancy score ${journey.baseline.expectancy}`}>{journey.baseline.expectancy}</div>
                        <div className="ppn-meta text-slate-500 font-bold uppercase tracking-wider">Expectancy</div>
                        <div className="ppn-meta text-slate-500 mt-0.5">High Belief</div>
                    </div>
                </div>
            </div>

            {/* ── PHASE 1 HUD STRIP (WO-527) ─────────────────────────────────────────
                 Compact read-back of all four gate form entries.
                 Renders only once at least one gate is complete.
                 Phase-1 color: indigo. Read-only — no interactive elements.
            ──────────────────────────────────────────────────────────────────────── */}
            {Object.values(gates).some(g => g.isComplete) && (
                <Phase1HUD
                    journey={journey}
                    gates={gates}
                    contraindicationResult={contraindicationResult}
                />
            )}

            {/* RISK ELIGIBILITY REPORT — renders only after all 4 gates complete */}
            {allGatesPassed && contraindicationResult && (
                <div className="space-y-6">
                    <RiskEligibilityReport
                        result={contraindicationResult}
                        onOverrideConfirmed={(justification) => {
                            setOverrideJustification(justification);
                        }}
                        onExportPDF={() => {
                            downloadReport(
                                { patientId: journey.patientId },
                                'audit'
                            );
                        }}
                        onValidityChange={setCanProceedToPhase2}
                        hideProceedButton
                    />

                    {/* Proceed to Phase 2 Bottom Container */}
                    <div className="mt-8 pt-6 border-t border-slate-700/50">
                        <button
                            id="preparation-proceed-phase2"
                            onClick={canProceedToPhase2 ? onProceedToPhase2 : undefined}
                            disabled={!canProceedToPhase2}
                            className={`w-full py-4 rounded-2xl text-base sm:text-lg font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 ${canProceedToPhase2
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40 hover:-translate-y-1'
                                : 'bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-700/50'
                                }`}
                        >
                            {canProceedToPhase2 ? (
                                <>
                                    <CheckCircle className="w-6 h-6" />
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
