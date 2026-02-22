import React, { useState, useMemo } from 'react';
import { Calendar, Brain, TrendingUp, Shield, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, FileText, ArrowRight, Lock } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';
import { WellnessFormId } from './WellnessFormRouter';
import { RiskEligibilityReport } from './RiskEligibilityReport';
import { runContraindicationEngine, type IntakeScreeningData } from '../../services/contraindicationEngine';
import { downloadReport } from '../../services/reportGenerator';

interface PreparationPhaseProps {
    journey: any;
    onOpenForm: (formId: WellnessFormId) => void;
    /** Medication list from baseline observations — normalized lowercase strings */
    medications?: string[];
    onProceedToPhase2?: () => void;
}

export const PreparationPhase: React.FC<PreparationPhaseProps> = ({ journey, onOpenForm, medications = [], onProceedToPhase2 }) => {
    const [showAI, setShowAI] = useState(false);
    const [showBenchmarks, setShowBenchmarks] = useState(false);
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

    // Helper: Get severity label and emoji (kept from original)
    const getSeverityInfo = (score: number, type: 'phq9' | 'gad7') => {
        if (type === 'phq9') {
            if (score >= 20) return { label: 'Severe Depression', emoji: '😰', color: 'text-red-400' };
            if (score >= 15) return { label: 'Moderately Severe Depression', emoji: '😔', color: 'text-orange-400' };
            if (score >= 10) return { label: 'Moderate Depression', emoji: '😟', color: 'text-amber-400' };
            if (score >= 5) return { label: 'Mild Depression', emoji: '😕', color: 'text-yellow-400' };
            return { label: 'Minimal Depression', emoji: '😊', color: 'text-emerald-400' };
        } else {
            if (score >= 15) return { label: 'Severe Anxiety', emoji: '😰', color: 'text-red-400' };
            if (score >= 10) return { label: 'Moderate Anxiety', emoji: '😟', color: 'text-amber-400' };
            if (score >= 5) return { label: 'Mild Anxiety', emoji: '😕', color: 'text-yellow-400' };
            return { label: 'Minimal Anxiety', emoji: '😊', color: 'text-emerald-400' };
        }
    };

    const phq9Info = getSeverityInfo(journey.baseline.phq9, 'phq9');
    const gad7Info = getSeverityInfo(journey.baseline.gad7, 'gad7');

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

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
                            <button
                                key={key}
                                onClick={gate.action}
                                className={`relative flex flex-col p-3 rounded-xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98]
                                    ${gate.isComplete
                                        ? 'bg-emerald-900/10 border-emerald-500/30 hover:bg-emerald-900/20'
                                        : 'bg-slate-800/40 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/60'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${gate.isComplete ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                                        }`}>
                                        {gate.isComplete ? <CheckCircle className="w-3.5 h-3.5" /> : <div className="w-2 h-2 rounded-full bg-slate-500" />}
                                    </div>
                                    {gate.isComplete && <span className="text-xs font-mono text-emerald-500/70">{gate.date}</span>}
                                </div>
                                <div>
                                    <h3 className={`font-bold text-sm ${gate.isComplete ? 'text-emerald-100' : 'text-[#A8B5D1]'}`}>{gate.label}</h3>
                                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{gate.description}</p>
                                </div>
                                {!gate.isComplete && (
                                    <div className="mt-2 flex items-center gap-1 text-xs font-bold text-blue-400">
                                        COMPLETE <ArrowRight className="w-2.5 h-2.5" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. BASELINE METRICS (Preserved & Compacted) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Brain className="w-6 h-6 text-slate-400" />
                        <h3 className="text-xl font-bold text-[#A8B5D1]">Baseline Clinical Profile</h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {/* PHQ-9 */}
                        <div className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl text-center">
                            <div className={`text-xl font-black mb-0.5 ${phq9Info.color}`}>{journey.baseline.phq9}</div>
                            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">PHQ-9</div>
                            <div className="text-xs text-slate-500 mt-0.5 truncate">{phq9Info.label}</div>
                        </div>
                        {/* GAD-7 */}
                        <div className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl text-center">
                            <div className={`text-xl font-black mb-0.5 ${gad7Info.color}`}>{journey.baseline.gad7}</div>
                            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">GAD-7</div>
                            <div className="text-xs text-slate-500 mt-0.5 truncate">{gad7Info.label}</div>
                        </div>
                        {/* ACE */}
                        <div className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl text-center">
                            <div className="text-xl font-black text-amber-400 mb-0.5">{journey.baseline.aceScore}</div>
                            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">ACE Score</div>
                            <div className="text-xs text-slate-500 mt-0.5">Trauma Hist.</div>
                        </div>
                        {/* Expectancy */}
                        <div className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl text-center">
                            <div className="text-xl font-black text-emerald-400 mb-0.5">{journey.baseline.expectancy}</div>
                            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Expectancy</div>
                            <div className="text-xs text-slate-500 mt-0.5">High Belief</div>
                        </div>
                    </div>
                </div>

                {/* 3. PREDICTIONS (Preserved) */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-6 h-6 text-emerald-400" />
                        <h3 className="text-xl font-bold text-[#A8B5D1]">Forecast</h3>
                    </div>
                    <div className="space-y-3 flex-1">
                        <div className="flex justify-between items-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                            <span className="text-sm text-slate-300 font-medium">Success Probability</span>
                            <span className="text-xl font-black text-emerald-400">72%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                            <span className="text-sm text-slate-300 font-medium">Challenge Risk</span>
                            <span className="text-xl font-black text-amber-400">45%</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAI(!showAI)}
                        className="mt-4 w-full py-2 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors flex items-center justify-center gap-1"
                    >
                        AI Insights {showAI ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                </div>
            </div>

            {/* AI Insights Panel (Collapsible) */}
            {showAI && (
                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 animate-in slide-in-from-top duration-300">
                    <p className="text-slate-400 text-sm leading-relaxed">
                        <strong className="text-slate-300">Analysis:</strong> Patient profile (High ACE, Severe TRD) matches cluster B2. Historical data suggests slower initial response but durable remission if integration protocol is strictly followed. Strict adherence to 3+ integration sessions historically correlates with sustained outcomes.
                    </p>
                </div>
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
