import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { Target, Shield, TrendingUp, ArrowRight, Lock, CheckCircle, Brain, Info } from 'lucide-react';
import { AdvancedTooltip } from '../components/ui/AdvancedTooltip';
import { PhaseIndicator } from '../components/wellness-journey/PhaseIndicator';
import { PreparationPhase } from '../components/wellness-journey/PreparationPhase';
import { TreatmentPhase } from '../components/wellness-journey/DosingSessionPhase';
import { IntegrationPhase } from '../components/wellness-journey/IntegrationPhase';
import { SlideOutPanel } from '../components/wellness-journey/SlideOutPanel';
import { QuickActionsMenu } from '../components/wellness-journey/QuickActionsMenu';
import { WellnessFormRouter, type WellnessFormId } from '../components/wellness-journey/WellnessFormRouter';
import { Phase1StepGuide, PHASE1_STEPS } from '../components/wellness-journey/Phase1StepGuide';
import { ReadinessScore, RequirementsList } from '../components/benchmark';
import { useBenchmarkReadiness } from '../hooks/useBenchmarkReadiness';
import { RiskIndicators } from '../components/risk';
import { useRiskDetection } from '../hooks/useRiskDetection';
import { SafetyTimeline, type SafetyEvent } from '../components/safety';
import { ArcOfCareOnboarding } from '../components/arc-of-care';
import { Phase1Tour, Phase2Tour, Phase3Tour, CompassTourButton } from '../components/arc-of-care/PhaseTours';
import { ExportReportButton } from '../components/export/ExportReportButton';
import { downloadReport } from '../services/reportGenerator';
import { PatientSelectModal } from '../components/wellness-journey/PatientSelectModal';
import { getCurrentSiteId } from '../services/identity'; // WO-206: canonical import
import { createClinicalSession } from '../services/clinicalLog';

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
    /** UUID — maps to log_clinical_records.id for the active session */
    sessionId?: string;
    /** Non-PII clinical characteristics — used for quick verification at session start */
    demographics?: {
        age?: number;        // e.g. 34
        gender?: string;     // 'M' | 'F' | 'NB' | 'X' — set by provider
        weightKg?: number;   // for dosage calculation
    };
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
        hasConsent: boolean;
        consentDate?: string;
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

    // Patient selection gate — blocks until provider chooses new or existing patient
    const [showPatientModal, setShowPatientModal] = useState(true);
    // Controls which view the modal opens to: 'choose' (Phase 1) or 'existing' (Phase 2/3)
    const [patientModalView, setPatientModalView] = useState<'choose' | 'existing'>('choose');

    const PHASE_TAB_MAP: Record<string, 1 | 2 | 3> = {
        'Preparation': 1,
        'Treatment': 2,
        'Integration': 3,
        'Complete': 3,
    };

    const handlePatientSelect = useCallback(async (patientId: string, isNew: boolean, phase: string) => {
        // Create a REAL log_clinical_records row in the DB so that all Phase 2 form
        // writes (vitals, observations, timeline) satisfy the FK constraint:
        //   log_session_vitals.session_id → log_clinical_records.id
        // We do this for BOTH new and existing patients because every Wellness Journey
        // visit starts a new session record.
        const resolvedSiteId = await getCurrentSiteId();
        let sessionId: string | undefined;

        if (resolvedSiteId) {
            const result = await createClinicalSession(patientId, resolvedSiteId);
            if (result.success && result.sessionId) {
                sessionId = result.sessionId;
            } else {
                // Non-fatal: fall back to client UUID. Phase 1 forms don't need the FK.
                // Phase 2 saves will fail until site is resolved — user will see error toasts.
                console.warn('[WellnessJourney] DB session creation failed; using local UUID fallback', result.error);
                sessionId = crypto.randomUUID();
            }
        } else {
            // siteId not yet resolved — use local UUID. Phase 2 forms will error gracefully.
            sessionId = crypto.randomUUID();
        }

        setJourney(prev => ({
            ...prev,
            patientId,
            sessionId,
            // Use stored demographics if known; otherwise keep whatever the previous patient had.
            // In production these come from the patient record lookup.
            demographics: prev.demographics ?? { age: 34, gender: 'M', weightKg: 78 },
        }));
        setShowPatientModal(false);
        // Next time the modal opens, start in the right view for the patient's phase
        setPatientModalView(isNew ? 'choose' : 'existing');
        const targetPhase = isNew ? 1 : (PHASE_TAB_MAP[phase] ?? 1);
        setActivePhase(targetPhase);

        // Ensure UI tabs are unlocked for existing patients already in later phases
        if (!isNew) {
            let previousPhases: number[] = [];
            if (targetPhase === 2) previousPhases = [1];
            if (targetPhase === 3) previousPhases = [1, 2];

            if (previousPhases.length > 0) {
                setCompletedPhases(previousPhases);
                localStorage.setItem(PHASE_STORAGE_KEY, JSON.stringify(previousPhases));
            }
        }

        if (isNew) {
            addToast({
                title: 'New Patient Created',
                message: `Session started for ${patientId} — Phase 1: Preparation`,
                type: 'success',
            });
            // Land on Phase 1 with all steps pending — practitioner chooses where to start
        } else {
            const phaseLabel = targetPhase === 1 ? 'Preparation' : targetPhase === 2 ? 'Treatment' : 'Integration';
            addToast({
                title: 'Patient Loaded',
                message: `${patientId} — continuing Phase ${targetPhase}: ${phaseLabel}`,
                type: 'info',
            });
        }
    }, [addToast, navigate]);

    // WO-113: SlideOut form panel state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [activeFormId, setActiveFormId] = useState<WellnessFormId | null>(null);
    const [activeFormTitle, setActiveFormTitle] = useState('Clinical Form');
    const [activeFormSubtitle, setActiveFormSubtitle] = useState<string | undefined>(undefined);

    // ── Phase 1 guided flow: tracks which forms have been saved ──────────────
    const [completedForms, setCompletedForms] = useState<Set<string>>(() => new Set());

    // ── Clinician site ID — resolved ONCE at page load, passed to all forms ──
    // Resolving here prevents the race condition where a form mounts and the
    // user clicks Save before the internal async fetch completes.
    const [clinicianSiteId, setClinicianSiteId] = useState<string | undefined>(undefined);
    useEffect(() => {
        getCurrentSiteId().then(id => {
            if (id) setClinicianSiteId(id);
            else console.warn('[WellnessJourney] Could not resolve siteId at page load');
        });
    }, []);

    const FORM_LABELS: Record<WellnessFormId, string> = {
        'meq30': 'MEQ-30 Questionnaire',
        'mental-health': 'Mental Health Screening',
        'set-and-setting': 'Set & Setting',
        'consent': 'Informed Consent',
        'dosing-protocol': 'Dosing Protocol',
        'session-vitals': '',
        'session-timeline': 'Session Timeline',
        'session-observations': 'Session Observations',
        'safety-and-adverse-event': 'Safety & Adverse Events',
        'rescue-protocol': 'Rescue Protocol',
        'daily-pulse': 'Daily Pulse Check',
        'longitudinal-assessment': 'Longitudinal Assessment',
        'structured-integration': 'Integration Session',
        'behavioral-tracker': 'Behavioral Change Tracker',
        'structured-safety': 'Safety Check',
    };

    // Per-form subtitle shown in the SlideOut panel header (replaces in-form heading cards)
    const FORM_SUBTITLES: Partial<Record<WellnessFormId, string>> = {
        'mental-health': 'Administer PHQ-9, GAD-7, ACE, and PCL-5 baseline psychological assessments.',
        'set-and-setting': "Treatment expectancy, clinical observations, and pre-session mindset assessment.",
        'consent': 'Record informed consent type and confirm documentation with the patient.',
        'structured-safety': 'Monitor patient safety with structured, PHI-safe inputs.',
        'dosing-protocol': 'Record the medication, dose, and administration details for this session.',
        'session-vitals': 'Log vital signs at regular intervals throughout the dosing session.',
        'session-timeline': 'Document key moments and transitions during the session.',
        'session-observations': 'Record clinical observations about the patient during the session.',
        'safety-and-adverse-event': 'Document any adverse events or safety concerns that arose.',
        'rescue-protocol': 'Record any rescue interventions administered during the session.',
        'daily-pulse': 'Brief daily check-in on mood, sleep, and integration progress.',
        'meq30': 'Mystical Experience Questionnaire — 30-item retrospective assessment.',
        'structured-integration': 'Document integration session themes, insights, and action steps.',
        'behavioral-tracker': 'Track behavioral changes and habit formation since last session.',
        'longitudinal-assessment': 'Longitudinal outcome assessment for ongoing progress monitoring.',
    };

    const handleOpenForm = useCallback((formId: WellnessFormId) => {
        setActiveFormId(formId);
        setActiveFormTitle(FORM_LABELS[formId] ?? 'Clinical Form');
        setActiveFormSubtitle(FORM_SUBTITLES[formId]);
        setIsFormOpen(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFormComplete = useCallback((formId: WellnessFormId | null, exit: boolean = false) => {
        let nextId: WellnessFormId | null = null;
        let isLastPhase1Form = false;

        if (formId && activePhase === 1) {
            const updatedForms = new Set([...completedForms, formId]);
            setCompletedForms(updatedForms);

            if (!exit) {
                const currentIndex = PHASE1_STEPS.findIndex(s => s.id === formId);
                const next = PHASE1_STEPS[currentIndex + 1];
                nextId = next ? next.id : null;
            }

            // If no next step — all Phase 1 forms saved, complete the phase
            if (!nextId && !exit) {
                isLastPhase1Form = true;
                const updatedPhases = [...new Set([...completedPhases, 1 as number])];
                setCompletedPhases(updatedPhases);
                localStorage.setItem(PHASE_STORAGE_KEY, JSON.stringify(updatedPhases));
            } else if (!nextId && exit) {
                // Even if we exit, check if all are done
                const allDone = PHASE1_STEPS.every(s => updatedForms.has(s.id));
                if (allDone && !completedPhases.includes(1)) {
                    isLastPhase1Form = true;
                    const updatedPhases = [...new Set([...completedPhases, 1 as number])];
                    setCompletedPhases(updatedPhases);
                    localStorage.setItem(PHASE_STORAGE_KEY, JSON.stringify(updatedPhases));
                }
            }
        }

        if (nextId) {
            // Same panel, swap content — no close/reopen flash
            setActiveFormId(nextId);
            setActiveFormTitle(FORM_LABELS[nextId] ?? 'Clinical Form');
            setActiveFormSubtitle(FORM_SUBTITLES[nextId]);
            // Panel stays open (isFormOpen remains true)
        } else {
            // No next form: close the panel
            setIsFormOpen(false);
            setTimeout(() => setActiveFormId(null), 320);

            // Phase 1 complete — show toast prompt; practitioner navigates to Phase 2 manually.
            // Auto-advance to Phase 2 will be wired once the Phase 1 report data-viz is in place.
            if (isLastPhase1Form) {
                setTimeout(() => {
                    addToast({
                        title: '✅ Phase 1 Complete',
                        message: 'All preparation steps done. Review your Phase 1 report, then advance to Dosing Session when ready.',
                        type: 'success',
                    });
                }, 400);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activePhase, completedForms, completedPhases]);



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
    const [journey, setJourney] = useState<PatientJourney>({
        patientId: 'PT-RISK9W2P',
        sessionDate: '2025-10-15',
        daysPostSession: 0,
        // Demo demographics — shown in the patient context bar
        demographics: { age: 34, gender: 'M', weightKg: 78 },

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
            setAndSettingDate: '2025-10-14',
            hasSafetyCheck: true,
            safetyCheckDate: '2025-10-15',
            hasConsent: true,
            consentDate: '2025-10-01'
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
            {/* Patient Selection Gate */}
            {showPatientModal && (
                <PatientSelectModal
                    onSelect={handlePatientSelect}
                    onClose={() => setShowPatientModal(false)}
                    initialView={patientModalView}
                />
            )}

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
                onClose={() => handleFormComplete(null)}
                title={activeFormTitle}
                subtitle={activeFormSubtitle}
                icon={
                    activeFormId === 'structured-safety'
                        ? <div className="w-9 h-9 rounded-xl bg-indigo-900/50 border border-indigo-500/40 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-5 h-5 text-indigo-300" aria-hidden="true" />
                        </div>
                        : activeFormId === 'mental-health'
                            ? <div className="w-9 h-9 rounded-xl bg-violet-900/50 border border-violet-500/40 flex items-center justify-center flex-shrink-0">
                                <Brain className="w-5 h-5 text-violet-300" aria-hidden="true" />
                            </div>
                            : undefined
                }
                width="45%"
            >
                {activeFormId && (
                    <WellnessFormRouter
                        formId={activeFormId}
                        patientId={journey.patientId}
                        sessionId={journey.sessionId}
                        siteId={clinicianSiteId}
                        onComplete={() => handleFormComplete(activeFormId)}
                        onExit={() => handleFormComplete(activeFormId, true)}
                        onClose={() => handleFormComplete(null)}
                        onNavigate={handleOpenForm}
                    />
                )}
            </SlideOutPanel>

            <div className="max-w-6xl mx-auto space-y-6">

                {/* ─── Page Heading ─── */}
                <div className="px-1">
                    <h1 className="ppn-page-title">Wellness Journey</h1>
                    <p className="ppn-body mt-1" style={{ color: '#8B9DC3' }}>
                        {activePhase === 1 && 'Phase 1 — Preparation: Complete all baseline assessments before the dosing session.'}
                        {activePhase === 2 && 'Phase 2 — Dosing Session: Live documentation during the active session.'}
                        {activePhase === 3 && 'Phase 3 — Integration: Post-session monitoring and outcome tracking.'}
                    </p>
                </div>

                {/* ─── Patient Context Bar ─── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl">
                    {/* Left: Patient identity + demographics pills */}
                    <div className="flex items-center gap-4">
                        <CompassTourButton phase={activePhase} onClick={() => {
                            if (activePhase === 1) setShowTour1(true);
                            if (activePhase === 2) setShowTour2(true);
                            if (activePhase === 3) setShowTour3(true);
                        }} />
                        <div>
                            {/* Patient ID — large + mono for quick visual verification */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-sm md:text-base font-black text-slate-400 uppercase tracking-widest">Patient</span>
                                <span className="text-xl md:text-2xl font-black text-white font-mono tracking-wide">{journey.patientId}</span>
                                {/* Verification Pills — Age / Gender / Weight */}
                                {[{
                                    label: journey.demographics?.age ? `${journey.demographics.age} yrs` : '— yrs',
                                    title: 'Age'
                                }, {
                                    label: journey.demographics?.gender ?? '—',
                                    title: 'Gender'
                                }, {
                                    label: journey.demographics?.weightKg ? `${journey.demographics.weightKg} kg` : '— kg',
                                    title: 'Weight'
                                }].map(({ label, title }) => (
                                    <span
                                        key={title}
                                        title={title}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-600/50 text-[13px] md:text-sm font-semibold shadow-sm"
                                    >
                                        <span className="text-slate-400 font-normal">{title}</span>
                                        <span className="text-white font-bold">{label}</span>
                                    </span>
                                ))}
                                {/* Change Patient — context-aware: Phase 1 → choose, Phase 2/3 → lookup */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPatientModalView(activePhase === 1 ? 'choose' : 'existing');
                                        setShowPatientModal(true);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800/50 rounded-lg border border-slate-600/50 text-[13px] md:text-sm font-semibold text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-700/50 transition-all shadow-sm"
                                    aria-label={activePhase === 1 ? 'Enter new or lookup patient' : 'Lookup existing patient'}
                                >
                                    {activePhase === 1 ? 'Change' : 'Lookup'}
                                </button>
                            </div>
                            <p className="text-sm md:text-base mt-0.5" style={{ color: '#8B9DC3' }}>
                                {activePhase === 1 && 'Pre-treatment preparation — complete baseline assessments before session'}
                                {activePhase === 2 && `Dosing session in progress · ${journey.sessionDate} · Session #${journey.session.sessionNumber}`}
                                {activePhase === 3 && `Integration phase · ${journey.daysPostSession} days post-session · Monitoring recovery`}
                            </p>
                        </div>
                    </div>

                    {/* Right: Phase-aware primary action + export */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Phase 1: no competing CTA — Phase1StepGuide is the navigator */}
                        {/* Phase 1 & 2: no competing CTA — phase navigators handle it */}

                        {activePhase === 3 && (
                            <button
                                onClick={() => handleOpenForm('daily-pulse')}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl transition-all active:scale-95 text-sm"
                                aria-label="Open Daily Pulse Check form"
                            >
                                <span className="material-symbols-outlined text-base" aria-hidden="true">favorite</span>
                                Daily Pulse
                            </button>
                        )}
                        {/* MEQ-30 — always available, provider-discretion instrument */}
                        <AdvancedTooltip
                            content="The Mystical Experience Questionnaire (30-item) is typically administered 24–48 hours post-session while the experience is still fresh. It measures depth of mystical experience across 4 subscales. Higher scores (≥60/100) correlate with sustained therapeutic benefit at 6-month follow-up."
                            title="MEQ-30 — Provider Discretion"
                            type="info"
                            tier="detailed"
                            side="bottom"
                            width="w-80"
                        >
                            <button
                                onClick={() => handleOpenForm('meq30')}
                                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 hover:border-purple-500/50 text-purple-300 font-bold rounded-xl transition-all active:scale-95 text-sm"
                                title="MEQ-30 available at any phase — timing per protocol"
                            >
                                <span className="material-symbols-outlined text-base">quiz</span>
                                MEQ-30
                            </button>
                        </AdvancedTooltip>
                    </div>
                </div>

                {/* ── Phase Panel — one glowing border per phase ───────────────── */}
                {/*
                  Phase 1 = red   · Phase 2 = amber   · Phase 3 = emerald
                  Everything inside shares the same color family so the phase
                  reads as one coherent unit, not a collection of fragments.
                */}
                {(() => {
                    const phasePalette = {
                        1: {
                            border: 'border-indigo-500/50',
                            shadow: '0 0 32px -4px rgba(99,102,241,0.20)',
                            bg: 'bg-indigo-950/15',
                        },
                        2: {
                            border: 'border-amber-500/50',
                            shadow: '0 0 32px -4px rgba(245,158,11,0.18)',
                            bg: 'bg-amber-950/15',
                        },
                        3: {
                            border: 'border-teal-500/50',
                            shadow: '0 0 32px -4px rgba(20,184,166,0.18)',
                            bg: 'bg-teal-950/15',
                        },
                    }[activePhase];

                    return (
                        <div>
                            {/* Phase tabs — sit ABOVE the content border, not inside it */}
                            <PhaseIndicator
                                currentPhase={activePhase}
                                completedPhases={completedPhases}
                                onPhaseChange={handlePhaseChange}
                            />
                            {/* Phase content — border on left/right/bottom only, active tab connects at top */}
                            <div
                                className={`rounded-b-2xl border-2 ${phasePalette.border} ${phasePalette.bg} p-4 sm:p-6 space-y-6`}
                                style={{ boxShadow: phasePalette.shadow }}
                            >
                                {/* Phase Content — WO-113: Each phase has CTA buttons to open forms */}
                                <div className="animate-in fade-in duration-300 space-y-6">
                                    {activePhase === 1 && (
                                        // Phase1StepGuide is the SOLE navigator — no competing cards.
                                        // The hero card shows exactly one next action with a large white CTA.
                                        <Phase1StepGuide
                                            completedFormIds={completedForms}
                                            onStartStep={handleOpenForm}
                                            onCompletePhase={completeCurrentPhase}
                                        />
                                    )}
                                    {activePhase === 2 && (
                                        <TreatmentPhase journey={journey} onOpenForm={handleOpenForm} onCompletePhase={completeCurrentPhase} />
                                    )}

                                    {activePhase === 3 && (
                                        <>
                                            <IntegrationPhase journey={journey} />
                                            {/* Phase 3 — Early Follow-up (0–72 hrs) */}
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Early Follow-up · 0–72 hrs</p>
                                                <div className="flex flex-wrap gap-3">
                                                    <button onClick={() => handleOpenForm('structured-safety')} className="flex items-center gap-2 px-5 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold rounded-xl transition-all active:scale-95 text-sm">
                                                        <span className="material-symbols-outlined text-base">shield</span>Structured Safety Check
                                                    </button>
                                                    <button onClick={() => handleOpenForm('daily-pulse')} className="flex items-center gap-2 px-5 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl transition-all active:scale-95 text-sm">
                                                        <span className="material-symbols-outlined text-base">favorite</span>Daily Pulse Check
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Phase 3 — Integration Work (days to weeks) */}
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Integration Work · Days to Weeks</p>
                                                <div className="flex flex-wrap gap-3">
                                                    <button onClick={() => handleOpenForm('structured-integration')} className="flex items-center gap-2 px-5 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl transition-all active:scale-95 text-sm">
                                                        <span className="material-symbols-outlined text-base">edit_note</span>Integration Session
                                                    </button>
                                                    <button onClick={() => handleOpenForm('behavioral-tracker')} className="flex items-center gap-2 px-5 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl transition-all active:scale-95 text-sm">
                                                        <span className="material-symbols-outlined text-base">trending_up</span>Behavioral Change Tracker
                                                    </button>
                                                    <button onClick={() => handleOpenForm('longitudinal-assessment')} className="flex items-center gap-2 px-5 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl transition-all active:scale-95 text-sm">
                                                        <span className="material-symbols-outlined text-base">timeline</span>Longitudinal Assessment
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Bottom Status Bar — hidden during Phase 1 early stages.
                     Showing mock PHQ/Risk data before any forms are complete
                     confuses clinicians about patient state.
                     Show once at least 3 Phase 1 forms are done (real data available). */}
                                {(activePhase !== 1 || completedForms.size >= 3) && (
                                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-700/50">

                                            {/* Total Improvement */}
                                            <div className="px-6 py-5">
                                                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#8B9DC3' }}>Total Improvement</p>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-3xl font-black text-emerald-400">-{totalImprovement}</span>
                                                    <span className="text-sm" style={{ color: '#8B9DC3' }}>pts (PHQ-9)</span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1.5 text-xs">
                                                    <span className="text-red-400">Baseline: {journey.baseline.phq9}</span>
                                                    <span className="text-slate-600">→</span>
                                                    <span className="text-emerald-400">Today: {journey.integration.currentPhq9}</span>
                                                </div>
                                                <p className="text-emerald-400 text-xs font-bold mt-2 uppercase tracking-widest">
                                                    {isRemission ? '✓ Remission' : '↗ Improving'}
                                                </p>
                                            </div>

                                            {/* MEQ-30 Correlation */}
                                            <div className="px-6 py-5">
                                                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#8B9DC3' }}>MEQ-30 Score</p>
                                                <div className="text-3xl font-black">
                                                    {journey.session.meq30Score !== null
                                                        ? <span className="text-emerald-400">{journey.session.meq30Score}/100</span>
                                                        : <span className="text-slate-500 text-base font-semibold">Not recorded</span>
                                                    }
                                                </div>
                                                {journey.session.meq30Score !== null && (
                                                    <p className="text-emerald-400 text-xs mt-2">High mystical experience → Sustained benefit ✓</p>
                                                )}
                                            </div>

                                            {/* Risk Level — wired to live riskDetection data */}
                                            <div className="px-6 py-5">
                                                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#8B9DC3' }}>Risk Level</p>
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${riskDetection.overallRiskLevel === 'high' ? 'bg-red-500/20' :
                                                        riskDetection.overallRiskLevel === 'moderate' ? 'bg-amber-500/20' :
                                                            'bg-emerald-500/20'
                                                        }`} aria-hidden="true">
                                                        <svg className={`w-4 h-4 ${riskDetection.overallRiskLevel === 'high' ? 'text-red-400' :
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
                                                        <span className={`text-3xl font-black ${riskDetection.overallRiskLevel === 'high' ? 'text-red-400' :
                                                            riskDetection.overallRiskLevel === 'moderate' ? 'text-amber-400' :
                                                                'text-emerald-400'
                                                            }`}>
                                                            {riskDetection.overallRiskLevel.toUpperCase()}
                                                        </span>
                                                        <span className="sr-only">Risk Status: {riskDetection.overallRiskLevel.toUpperCase()}</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs mt-2" style={{ color: '#8B9DC3' }}>
                                                    {riskDetection.overallRiskLevel === 'high' ? 'Immediate review required' :
                                                        riskDetection.overallRiskLevel === 'moderate' ? 'Monitor closely' :
                                                            'Excellent compliance'}
                                                </p>
                                            </div>

                                        </div>
                                    </div>
                                )}

                                {/* Bottom row: disclaimer label + info tooltip | Phase lock | Export Report button */}
                                <div className="flex items-center justify-between gap-4 pt-3 pb-1 border-t border-slate-700/30 mt-6 md:mt-8">
                                    <div className="flex items-center gap-6 flex-wrap">
                                        {/* Compact disclaimer with info-icon tooltip */}
                                        <AdvancedTooltip
                                            content="This system provides statistical data and historical patterns for informational purposes only. It does not provide medical advice, diagnosis, or treatment recommendations. All clinical decisions remain the sole responsibility of the licensed healthcare provider."
                                            tier="detailed"
                                            type="warning"
                                            title="Legal Disclaimer"
                                            side="top"
                                            width="w-96"
                                        >
                                            <span className="inline-flex items-center gap-1.5 text-sm text-slate-500 cursor-help hover:text-slate-400 transition-colors select-none">
                                                <span style={{ color: '#f59e0b', fontSize: '1.1em' }}>⚠️</span>
                                                <strong className="text-slate-400">Clinical Decision Support</strong>
                                                <Info className="w-4 h-4 text-slate-600 hover:text-slate-400" aria-label="Legal disclaimer info" />
                                            </span>
                                        </AdvancedTooltip>

                                        {/* Phase lock notice inline */}
                                        {!isPhaseUnlocked(activePhase + 1 as 1 | 2 | 3) && activePhase < 3 && (
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/40 border border-slate-700/40 rounded-lg shadow-sm">
                                                <Lock className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm text-slate-400 font-medium">
                                                    Phase {activePhase + 1} unlocks when you complete Phase {activePhase}.
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Export Report */}
                                    <ExportReportButton patientData={exportPatientData} />
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {/* WO-113: Quick Actions FAB */}
                <QuickActionsMenu
                    currentPhase={activePhase === 1 ? 'phase1' : activePhase === 2 ? 'phase2' : 'phase3'}
                    onActionSelect={handleQuickAction}
                />
            </div>
        </div>
    );
};

export default WellnessJourney;

