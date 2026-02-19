import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { Target, Shield, TrendingUp, ArrowRight, Lock, CheckCircle } from 'lucide-react';
import { AdvancedTooltip } from '../components/ui/AdvancedTooltip';
import { PhaseIndicator } from '../components/wellness-journey/PhaseIndicator';
import { PreparationPhase } from '../components/wellness-journey/PreparationPhase';
import { TreatmentPhase } from '../components/wellness-journey/DosingSessionPhase';
import { IntegrationPhase } from '../components/wellness-journey/IntegrationPhase';
import { SlideOutPanel } from '../components/wellness-journey/SlideOutPanel';
import { QuickActionsMenu } from '../components/wellness-journey/QuickActionsMenu';
import { WellnessFormRouter, type WellnessFormId } from '../components/wellness-journey/WellnessFormRouter';
import { ReadinessScore, RequirementsList } from '../components/benchmark';
import { useBenchmarkReadiness } from '../hooks/useBenchmarkReadiness';
import { RiskIndicators } from '../components/risk';
import { useRiskDetection } from '../hooks/useRiskDetection';
import { SafetyTimeline, type SafetyEvent } from '../components/safety';
import { ArcOfCareOnboarding } from '../components/arc-of-care';
import { Phase1Tour, Phase2Tour, Phase3Tour, CompassTourButton } from '../components/arc-of-care/PhaseTours';
import { ExportReportButton } from '../components/export/ExportReportButton';
import { downloadReport } from '../services/reportGenerator';

/**
 * Wellness Journey: Complete Patient Journey Dashboard
 * 
 * Complete 6-month patient journey visualization with phase-based navigation
 * 
 * Features:
 * - Phase-based tabbed interface (Phase 1: Preparation, Phase 2: Dosing Session, Phase 3: Integration)
 * - Progressive disclosure (one phase visible at a time)
 * - Responsive design (tabs on desktop, dropdown on mobile)
 * - All fonts ≥12px (WCAG AAA compliance)
 * - Patient selection screen (New vs Existing patient)
 * 
 * This is the primary clinician interface for tracking patient progress across all 3 phases
 */

interface PatientJourney {
    patientId: string;
    sessionDate: string;
    daysPostSession: number;

    baseline: {
        phq9: number;
        gad7: number;
        aceScore: number;
        expectancy: number;
    };

    session: {
        substance: string;
        dosage: string;
        sessionNumber: number;
        meq30Score: number | null;
        ediScore: number | null;
        ceqScore: number | null;
        safetyEvents: number;
        chemicalRescueUsed: boolean;
    };

    integration: {
        currentPhq9: number;
        pulseCheckCompliance: number;
        phq9Compliance: number;
        integrationSessionsAttended: number;
        integrationSessionsScheduled: number;
        behavioralChanges: string[];
    };

    benchmark: {
        hasBaselineAssessment: boolean;
        baselineAssessmentDate?: string;
        hasFollowUpAssessment: boolean;
        followUpAssessmentDate?: string;
        hasDosingProtocol: boolean;
        dosingProtocolDate?: string;
        hasSetAndSetting: boolean;
        setAndSettingDate?: string;
        hasSafetyCheck: boolean;
        safetyCheckDate?: string;
    };

    risk: {
        baseline: {
            phq9: number;
            gad7: number;
            pcl5?: number;
            ace: number;
        };
        vitals?: {
            heartRate: number;
            baselineHeartRate?: number;
            bloodPressureSystolic: number;
            bloodPressureDiastolic: number;
            spo2?: number;
            temperature?: number;
        };
        progressTrends?: Array<{
            metric: string;
            values: number[];
            baseline: number;
        }>;
    };

    safety: {
        events: SafetyEvent[];
    };
}

const PHASE_STORAGE_KEY = 'ppn_wellness_completed_phases';

const WellnessJourney: React.FC = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();

    // Phase navigation state
    const [activePhase, setActivePhase] = useState<1 | 2 | 3>(1);

    // Completed phases — persisted to localStorage
    const [completedPhases, setCompletedPhases] = useState<number[]>(() => {
        try {
            const stored = localStorage.getItem(PHASE_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    });

    // Tour state
    const [showTour1, setShowTour1] = useState(false);
    const [showTour2, setShowTour2] = useState(false);
    const [showTour3, setShowTour3] = useState(false);

    // Onboarding state
    const [showOnboarding, setShowOnboarding] = useState(false);

    // WO-113: SlideOut form panel state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [activeFormId, setActiveFormId] = useState<WellnessFormId | null>(null);
    const [activeFormTitle, setActiveFormTitle] = useState('Clinical Form');

    const FORM_LABELS: Record<WellnessFormId, string> = {
        'mental-health': 'Mental Health Screening',
        'set-and-setting': 'Set & Setting',
        'baseline-physiology': 'Baseline Physiology',
        'baseline-observations': 'Clinical Observations',
        'consent': 'Informed Consent',
        'dosing-protocol': 'Dosing Protocol',
        'session-vitals': 'Session Vitals',
        'session-timeline': 'Session Timeline',
        'session-observations': 'Session Observations',
        'post-session-assessments': 'Post-Session Assessments',
        'meq30': 'MEQ-30 Questionnaire',
        'adverse-event': 'Adverse Event Log',
        'safety-observations': 'Safety Observations',
        'rescue-protocol': 'Rescue Protocol',
        'daily-pulse': 'Daily Pulse Check',
        'longitudinal-assessment': 'Longitudinal Assessment',
        'structured-integration': 'Integration Session',
        'behavioral-tracker': 'Behavioral Change Tracker',
        'structured-safety': 'Safety Check',
    };

    const handleOpenForm = useCallback((formId: WellnessFormId) => {
        setActiveFormId(formId);
        setActiveFormTitle(FORM_LABELS[formId] ?? 'Clinical Form');
        setIsFormOpen(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCloseForm = useCallback(() => {
        setIsFormOpen(false);
        setTimeout(() => setActiveFormId(null), 350);
    }, []);

    const handleQuickAction = useCallback((formId: string) => {
        handleOpenForm(formId as WellnessFormId);
    }, [handleOpenForm]);

    // Check if user has seen onboarding
    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem('arcOfCareOnboardingSeen');
        if (!hasSeenOnboarding) {
            setShowOnboarding(true);
        }
    }, []);

    // Phase locking: only allow switching to unlocked phases
    const isPhaseUnlocked = useCallback((phase: number) => {
        if (phase === 1) return true;
        if (phase === 2) return completedPhases.includes(1);
        if (phase === 3) return completedPhases.includes(2);
        return false;
    }, [completedPhases]);

    const handlePhaseChange = useCallback((phase: 1 | 2 | 3) => {
        if (isPhaseUnlocked(phase)) setActivePhase(phase);
    }, [isPhaseUnlocked]);

    // Mark current phase complete and advance
    const completeCurrentPhase = useCallback(() => {
        const updated = [...new Set([...completedPhases, activePhase])];
        setCompletedPhases(updated);
        localStorage.setItem(PHASE_STORAGE_KEY, JSON.stringify(updated));
        if (activePhase < 3) setActivePhase((activePhase + 1) as 1 | 2 | 3);
    }, [completedPhases, activePhase]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.altKey && e.key === '1') { e.preventDefault(); handlePhaseChange(1); }
            else if (e.altKey && e.key === '2') { e.preventDefault(); handlePhaseChange(2); }
            else if (e.altKey && e.key === '3') { e.preventDefault(); handlePhaseChange(3); }
            else if (e.altKey && e.key === 'h') { e.preventDefault(); setShowOnboarding(true); }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handlePhaseChange]);

    // Mock data
    const [journey] = useState<PatientJourney>({
        patientId: 'PT-RISK9W2P',
        sessionDate: '2025-10-15',
        daysPostSession: 0,

        baseline: {
            phq9: 22, // Severe Depression
            gad7: 18, // Severe Anxiety
            aceScore: 6, // High Trauma
            expectancy: 40 // Low Expectancy
        },

        session: {
            substance: 'Psilocybin',
            dosage: '25mg (Oral)',
            sessionNumber: 1,
            meq30Score: null,
            ediScore: null,
            ceqScore: null,
            safetyEvents: 1,
            chemicalRescueUsed: false
        },

        integration: {
            currentPhq9: 20,
            pulseCheckCompliance: 0,
            phq9Compliance: 0,
            integrationSessionsAttended: 0,
            integrationSessionsScheduled: 0,
            behavioralChanges: []
        },

        benchmark: {
            hasBaselineAssessment: true,
            baselineAssessmentDate: '2025-10-01',
            hasFollowUpAssessment: false,
            followUpAssessmentDate: undefined,
            hasDosingProtocol: true,
            dosingProtocolDate: '2025-10-15',
            hasSetAndSetting: true,
            setAndSettingDate: '2025-10-15',
            hasSafetyCheck: false
        },

        risk: {
            baseline: {
                phq9: 22,
                gad7: 18,
                pcl5: 55, // Critical PTSD
                ace: 6
            },
            vitals: {
                heartRate: 115, // Tachycardia
                baselineHeartRate: 72,
                bloodPressureSystolic: 155, // Hypertension
                bloodPressureDiastolic: 95,
                spo2: 94, // Hypoxia risk
                temperature: 99.1
            },
            progressTrends: [
                {
                    metric: 'PHQ-9',
                    values: [22, 23], // Worsening
                    baseline: 22
                }
            ]
        },

        safety: {
            events: [
                {
                    id: 'evt-1',
                    date: '2025-10-01',
                    cssrsScore: 4, // Suicidality Check
                    actionsTaken: ['Safety Plan Created']
                }
            ]
        }
    });

    const patientCharacteristics = {
        gender: 'Male',
        age: 34,
        weight: '78kg',
        ethnicity: 'Caucasian',
        medications: ['Sertraline (tapering)', 'Lisinopril'],
        treatment: 'TRD (Treatment Resistant Depression)'
    };

    // Calculate metrics for status bar
    const totalImprovement = journey.baseline.phq9 - journey.integration.currentPhq9;
    const isRemission = journey.integration.currentPhq9 < 5;

    // Benchmark readiness
    const { result, nextSteps, isLoading } = useBenchmarkReadiness(journey.benchmark);

    // Risk detection
    const riskDetection = useRiskDetection(journey.risk);

    // Mock patient data for export
    const exportPatientData = {
        patientId: journey.patientId,
        sessionDate: journey.sessionDate,
        substance: journey.session.substance,
        dosage: journey.session.dosage,
        baselinePHQ9: journey.baseline.phq9,
        currentPHQ9: journey.integration.currentPhq9,
        completedPhases,
    };

    return (
        <div className="min-h-screen bg-[#0a1628] px-4 py-4 sm:px-8 sm:py-6 lg:px-16 lg:py-8 xl:px-24">
            {/* Onboarding Modal */}
            {showOnboarding && (
                <ArcOfCareOnboarding
                    onClose={() => setShowOnboarding(false)}
                    onGetStarted={() => { setShowOnboarding(false); setActivePhase(1); }}
                />
            )}

            {/* Phase Tours */}
            {showTour1 && <Phase1Tour onClose={() => setShowTour1(false)} />}
            {showTour2 && <Phase2Tour onClose={() => setShowTour2(false)} />}
            {showTour3 && <Phase3Tour onClose={() => setShowTour3(false)} />}

            {/* WO-113: SlideOut Clinical Form Panel */}
            <SlideOutPanel
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                title={activeFormTitle}
                width="45%"
            >
                {activeFormId && (
                    <WellnessFormRouter
                        formId={activeFormId}
                        patientId={journey.patientId}
                        sessionId={1}
                        onComplete={handleCloseForm}
                    />
                )}
            </SlideOutPanel>

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Export Report - Secondary Position (Top Right) */}
                <div className="flex justify-end">
                    <ExportReportButton patientData={exportPatientData} />
                </div>

                {/* Hero Section */}
                <div className="bg-gradient-to-br from-blue-600/10 to-emerald-600/10 border border-slate-700/50 rounded-2xl p-8 lg:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Left: Title & Description */}
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-4 flex items-center gap-4" style={{ color: '#8BA5D3' }}>
                                Wellness Journey
                                <CompassTourButton phase={activePhase} onClick={() => {
                                    if (activePhase === 1) setShowTour1(true);
                                    if (activePhase === 2) setShowTour2(true);
                                    if (activePhase === 3) setShowTour3(true);
                                }} />
                            </h1>
                            <p className="text-lg mb-2" style={{ color: '#8B9DC3' }}>
                                Patient: <span className="font-bold">{journey.patientId}</span>
                            </p>
                            <p className="text-base mb-6" style={{ color: '#8B9DC3' }}>
                                Track complete patient progress across 3 phases of psychedelic-assisted therapy
                            </p>

                            {/* Primary CTA — accessible: icon + text label, focus ring, aria-label */}
                            <button
                                onClick={() => {
                                    setActivePhase(1);
                                    addToast({ title: 'Phase 1 Started', message: 'Preparation Phase activated.', type: 'success' });
                                }}
                                className="inline-flex items-center gap-2 px-6 py-4 bg-slate-700 hover:bg-slate-600 border-2 border-emerald-500 text-slate-300 font-bold rounded-lg transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
                                tabIndex={1}
                                aria-label="Begin Phase 1: Preparation"
                            >
                                <span className="material-symbols-outlined text-emerald-400 text-lg" aria-hidden="true">play_arrow</span>
                                <span>Start with Phase 1 — Preparation</span>
                                <ArrowRight className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                            </button>

                            {/* Keyboard Shortcut Hint */}

                        </div>

                        {/* Right: Key Benefits */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                                    <Target className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-300 mb-1">
                                        Predict Outcomes
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        Algorithm-based predictions for integration needs
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                <div className="p-2 bg-emerald-500/20 rounded-lg flex-shrink-0">
                                    <Shield className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-300 mb-1">
                                        Ensure Safety
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        Real-time vitals and rescue protocol tracking
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                <div className="p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
                                    <TrendingUp className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-300 mb-1">
                                        Prove Value
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        Longitudinal data for insurance and research
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Phase Indicator (Tabbed Navigation) with Compass Tour Buttons */}
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <PhaseIndicator
                            currentPhase={activePhase}
                            completedPhases={completedPhases}
                            onPhaseChange={handlePhaseChange}
                        />
                    </div>

                </div>

                {/* Phase Lock Status */}
                {!isPhaseUnlocked(activePhase + 1 as 1 | 2 | 3) && activePhase < 3 && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-xl">
                        <Lock className="w-4 h-4 text-slate-500 flex-shrink-0" aria-hidden="true" />
                        <p className="text-sm text-slate-400">
                            Phase {activePhase + 1} unlocks when you complete Phase {activePhase}.
                        </p>
                        <button
                            data-tour="complete-phase-1"
                            onClick={completeCurrentPhase}
                            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg hover:bg-emerald-500/20 transition-all"
                            aria-label={`Mark Phase ${activePhase} complete and unlock Phase ${activePhase + 1}`}
                        >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Mark Phase {activePhase} Complete
                        </button>
                    </div>
                )}

                {/* Benchmark Readiness Section */}
                {!isLoading && result && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Readiness Score Widget */}
                        <div data-tour="baseline-metrics">
                            <ReadinessScore
                                result={result}
                                onViewBenchmarks={() => console.log('View benchmarks clicked')}
                            />
                        </div>

                        {/* Algorithm predictions placeholder */}
                        <div data-tour="algorithm-predictions" className="hidden" aria-hidden="true" />

                        {/* Requirements List (full width) */}
                        <div data-tour="schedule-integration" className={result.isBenchmarkReady ? 'lg:col-span-2' : 'lg:col-span-2'}>
                            <RequirementsList
                                result={result}
                                onCompleteRequirement={(name) => {
                                    addToast({ title: 'Opening Requirement', message: `Navigating to ${name}...`, type: 'info' });
                                    if (name.toLowerCase().includes('safety')) {
                                        setTimeout(() => navigate('/assessment'), 500);
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Risk Indicators Section */}
                <div data-tour="risk-flags">
                    <RiskIndicators
                        overallRiskLevel={riskDetection.overallRiskLevel}
                        patientId={journey.patientId}
                        patientCharacteristics={patientCharacteristics}
                        baselineFlags={riskDetection.baselineFlags}
                        vitalFlags={riskDetection.vitalFlags}
                        progressFlags={riskDetection.progressFlags}
                        sessionTime="2h 15min"
                    />
                </div>

                {/* Safety Timeline Section */}
                <SafetyTimeline
                    events={journey.safety.events}
                    patientId={journey.patientId}
                    onExport={() => downloadReport({
                        patientId: journey.patientId,
                        baseline: {
                            phq9: journey.baseline?.phq9Score,
                            gad7: journey.baseline?.gad7Score,
                        }
                    }, 'audit')}
                />

                {/* Phase Content — WO-113: Each phase has CTA buttons to open forms */}
                <div className="animate-in fade-in duration-300 space-y-6">
                    {activePhase === 1 && (
                        <>
                            <PreparationPhase journey={journey} />
                            <div className="flex flex-wrap gap-3 pt-2">
                                <button onClick={() => handleOpenForm('mental-health')} className="flex items-center gap-2 px-5 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold rounded-xl transition-all active:scale-95 text-sm">
                                    <span className="material-symbols-outlined text-base">psychology</span>Mental Health Screening
                                </button>
                                <button onClick={() => handleOpenForm('baseline-physiology')} className="flex items-center gap-2 px-5 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold rounded-xl transition-all active:scale-95 text-sm">
                                    <span className="material-symbols-outlined text-base">monitor_heart</span>Baseline Physiology
                                </button>
                                <button onClick={() => handleOpenForm('set-and-setting')} className="flex items-center gap-2 px-5 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold rounded-xl transition-all active:scale-95 text-sm">
                                    <span className="material-symbols-outlined text-base">home_health</span>Set &amp; Setting
                                </button>
                                <button onClick={() => handleOpenForm('consent')} className="flex items-center gap-2 px-5 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl transition-all active:scale-95 text-sm">
                                    <span className="material-symbols-outlined text-base">check_circle</span>Informed Consent
                                </button>
                            </div>
                        </>
                    )}
                    {activePhase === 2 && (
                        <>
                            <TreatmentPhase journey={journey} />
                            <div className="flex flex-wrap gap-3 pt-2">
                                <button onClick={() => handleOpenForm('dosing-protocol')} className="flex items-center gap-2 px-5 py-3 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 font-bold rounded-xl transition-all active:scale-95 text-sm">
                                    <span className="material-symbols-outlined text-base">medication</span>Dosing Protocol
                                </button>
                                <button onClick={() => handleOpenForm('session-vitals')} className="flex items-center gap-2 px-5 py-3 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 font-bold rounded-xl transition-all active:scale-95 text-sm">
                                    <span className="material-symbols-outlined text-base">ecg_heart</span>Record Vitals
                                </button>
                                <button onClick={() => handleOpenForm('meq30')} className="flex items-center gap-2 px-5 py-3 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 font-bold rounded-xl transition-all active:scale-95 text-sm">
                                    <span className="material-symbols-outlined text-base">self_improvement</span>MEQ-30 Assessment
                                </button>
                                <button onClick={() => handleOpenForm('adverse-event')} className="flex items-center gap-2 px-5 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 font-bold rounded-xl transition-all active:scale-95 text-sm">
                                    <span className="material-symbols-outlined text-base">warning</span>Log Adverse Event
                                </button>
                            </div>
                        </>
                    )}
                    {activePhase === 3 && (
                        <>
                            <IntegrationPhase journey={journey} />
                            <div className="flex flex-wrap gap-3 pt-2">
                                <button onClick={() => handleOpenForm('daily-pulse')} className="flex items-center gap-2 px-5 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl transition-all active:scale-95 text-sm">
                                    <span className="material-symbols-outlined text-base">favorite</span>Daily Pulse Check
                                </button>
                                <button onClick={() => handleOpenForm('structured-integration')} className="flex items-center gap-2 px-5 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl transition-all active:scale-95 text-sm">
                                    <span className="material-symbols-outlined text-base">edit_note</span>Integration Session
                                </button>
                                <button onClick={() => handleOpenForm('behavioral-tracker')} className="flex items-center gap-2 px-5 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl transition-all active:scale-95 text-sm">
                                    <span className="material-symbols-outlined text-base">trending_up</span>Behavioral Change
                                </button>
                                <button onClick={() => handleOpenForm('structured-safety')} className="flex items-center gap-2 px-5 py-3 bg-slate-700/60 hover:bg-slate-700/80 border border-slate-600/40 text-slate-300 font-bold rounded-xl transition-all active:scale-95 text-sm">
                                    <span className="material-symbols-outlined text-base">shield</span>Safety Check
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Bottom Status Bar (Always Visible) */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex flex-wrap gap-8 items-start">

                        {/* Total Improvement */}
                        <div className="min-w-[180px] max-w-[240px]">
                            <p className="text-lg font-bold mb-2" style={{ color: '#8B9DC3' }}>Total Improvement</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-emerald-400">-{totalImprovement}</span>
                                <span className="text-sm" style={{ color: '#8B9DC3' }}>points</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-sm flex-wrap">
                                <span className="text-red-400">Baseline: {journey.baseline.phq9}</span>
                                <span className="text-slate-500">→</span>
                                <span className="text-emerald-400">Today: {journey.integration.currentPhq9}</span>
                            </div>
                            <p className="text-emerald-300 text-sm font-semibold mt-2">
                                {isRemission ? '✓ REMISSION' : '↗ IMPROVING'}
                            </p>
                        </div>

                        <div className="w-px bg-slate-700/50 self-stretch hidden sm:block" />

                        {/* MEQ-30 Correlation */}
                        <div className="min-w-[180px] max-w-[240px]">
                            <p className="text-lg font-bold mb-2" style={{ color: '#8B9DC3' }}>MEQ-30 Score</p>
                            <div className="text-3xl font-black text-emerald-400">
                                {journey.session.meq30Score !== null ? `${journey.session.meq30Score}/100` : <span className="text-slate-500 text-lg">Not recorded</span>}
                            </div>
                            {journey.session.meq30Score !== null && (
                                <p className="text-emerald-300 text-sm mt-2">High mystical experience → Sustained benefit ✓</p>
                            )}
                        </div>

                        <div className="w-px bg-slate-700/50 self-stretch hidden sm:block" />

                        {/* Risk Level — wired to live riskDetection data */}
                        <div className="min-w-[180px] max-w-[240px]">
                            <p className="text-lg font-bold mb-2" style={{ color: '#8B9DC3' }}>Risk Level</p>
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${riskDetection.overallRiskLevel === 'high' ? 'bg-red-500/20' :
                                    riskDetection.overallRiskLevel === 'moderate' ? 'bg-amber-500/20' :
                                        'bg-emerald-500/20'
                                    }`} aria-hidden="true">
                                    <svg className={`w-5 h-5 ${riskDetection.overallRiskLevel === 'high' ? 'text-red-400' :
                                        riskDetection.overallRiskLevel === 'moderate' ? 'text-amber-400' :
                                            'text-emerald-400'
                                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {riskDetection.overallRiskLevel === 'high' ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                        ) : riskDetection.overallRiskLevel === 'moderate' ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        )}
                                    </svg>
                                </div>
                                <div>
                                    <span className={`text-2xl font-black ${riskDetection.overallRiskLevel === 'high' ? 'text-red-400' :
                                        riskDetection.overallRiskLevel === 'moderate' ? 'text-amber-400' :
                                            'text-emerald-400'
                                        }`} aria-label={`Risk level: ${riskDetection.overallRiskLevel}`}>
                                        {riskDetection.overallRiskLevel.toUpperCase()}
                                    </span>
                                    <span className={`ml-2 text-xs font-bold uppercase tracking-widest ${riskDetection.overallRiskLevel === 'high' ? 'text-red-400' :
                                        riskDetection.overallRiskLevel === 'moderate' ? 'text-amber-400' :
                                            'text-emerald-400'
                                        }`}>[STATUS: {riskDetection.overallRiskLevel.toUpperCase()} RISK]</span>
                                </div>
                            </div>
                            <p className="text-sm mt-2" style={{ color: '#8B9DC3' }}>
                                {riskDetection.overallRiskLevel === 'high' ? 'Immediate review required' :
                                    riskDetection.overallRiskLevel === 'moderate' ? 'Monitor closely' :
                                        'Excellent compliance'}
                            </p>
                        </div>

                    </div>
                </div>

                {/* Global Disclaimer */}
                <AdvancedTooltip
                    content="This system provides statistical data and historical patterns for informational purposes only. It does not provide medical advice, diagnosis, or treatment recommendations. All clinical decisions remain the sole responsibility of the licensed healthcare provider."
                    tier="standard"
                    type="warning"
                    title="Legal Disclaimer"
                    width="w-96"
                >
                    <div className="bg-slate-900/40 border border-slate-700/30 rounded-lg p-4 cursor-help hover:bg-slate-900/60 transition-colors">
                        <p className="text-slate-500 text-sm text-center">
                            <strong style={{ color: '#8B9DC3' }}>⚠️ Clinical Decision Support:</strong> This dashboard is for clinical research purposes only. Not for diagnostic use. All data is encrypted and HIPAA-compliant.
                        </p>
                    </div>
                </AdvancedTooltip>
            </div>

            {/* WO-113: Quick Actions FAB */}
            <QuickActionsMenu
                currentPhase={activePhase === 1 ? 'phase1' : activePhase === 2 ? 'phase2' : 'phase3'}
                onActionSelect={handleQuickAction}
            />
        </div>
    );
};

export default WellnessJourney;
