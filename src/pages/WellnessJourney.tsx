import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { Target, Shield, TrendingUp, ArrowRight, Lock, CheckCircle, Brain, Info, Heart, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { AdvancedTooltip } from '../components/ui/AdvancedTooltip';
import { PhaseIndicator } from '../components/wellness-journey/PhaseIndicator';
import { PreparationPhase } from '../components/wellness-journey/PreparationPhase';
import { TreatmentPhase, Phase2ErrorBoundary } from '../components/wellness-journey/DosingSessionPhase';
import { MobileCockpit } from '../components/wellness-journey/MobileCockpit';
import { IntegrationPhase } from '../components/wellness-journey/IntegrationPhase';
import { SlideOutPanel } from '../components/wellness-journey/SlideOutPanel';
import { WorkflowActionCard } from '../components/wellness-journey/WorkflowCards';
import { QuickActionsMenu } from '../components/wellness-journey/QuickActionsMenu';
import { WellnessFormRouter, type WellnessFormId } from '../components/wellness-journey/WellnessFormRouter';
import { Phase1StepGuide, PHASE1_STEPS } from '../components/wellness-journey/Phase1StepGuide';
import { ReadinessScore, RequirementsList } from '../components/benchmark';
import { useBenchmarkReadiness } from '../hooks/useBenchmarkReadiness';
import { RiskIndicators } from '../components/risk';
import { useRiskDetection } from '../hooks/useRiskDetection';
import { SafetyTimeline, type SafetyEvent } from '../components/safety';
import { Phase1Tour, Phase2Tour, Phase3Tour, CompassTourButton } from '../components/arc-of-care/PhaseTours';
import { ExportReportButton } from '../components/export/ExportReportButton';
import { downloadReport, type PatientReportData } from '../services/reportGenerator';
import { PatientSelectModal } from '../components/wellness-journey/PatientSelectModal';
import { getCurrentSiteId } from '../services/identity'; // WO-206: canonical import
import { supabase } from '../supabaseClient'; // WO-430: medication hydration on patient select
import { createClinicalSession, createPatientProfile, createPatientIndication, closeOutSession } from '../services/clinicalLog';
import { ProtocolProvider, useProtocol } from '../contexts/ProtocolContext';
import { ProtocolConfiguratorModal, type PatientIntakeData } from '../components/wellness-journey/ProtocolConfiguratorModal';


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
    /** Canonical patient UUID from log_patient_site_links; use for any table that expects patient_uuid. */
    patientUuid?: string;
    /** UUID, maps to log_clinical_records.id for the active session */
    sessionId?: string;
    /** Non-PII clinical characteristics, used for quick verification at session start */
    demographics?: {
        age?: number;        // e.g. 34
        gender?: string;     // 'M' | 'F' | 'NB' | 'X', set by provider
        weightKg?: number;   // for dosage calculation
    };
    /** Condition being treated, drives assessment form pre-selection */
    condition?: string;
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
const ACTIVE_SESSION_KEY = 'ppn_active_session';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours — one clinical shift

/** Read and validate a stored session. Returns null if expired or missing. */
function readStoredSession(): { patientId: string; sessionId: string; patientUuid?: string; activePhase: 1 | 2 | 3; savedAt: number } | null {
    try {
        const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed?.patientId || !parsed?.sessionId) return null;
        if (Date.now() - (parsed.savedAt ?? 0) > SESSION_TTL_MS) {
            localStorage.removeItem(ACTIVE_SESSION_KEY);
            return null;
        }
        return parsed;
    } catch { return null; }
}

const WellnessJourneyInternal: React.FC = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();

    // Phase navigation state
    const [activePhase, setActivePhase] = useState<1 | 2 | 3>(1);

    // Completed phases, persisted to localStorage
    const [completedPhases, setCompletedPhases] = useState<number[]>(() => {
        try {
            const stored = localStorage.getItem(PHASE_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    });

    const { config } = useProtocol();

    // Tour state
    const [showTour1, setShowTour1] = useState(false);
    const [showTour2, setShowTour2] = useState(false);
    const [showTour3, setShowTour3] = useState(false);

    // Patient selection gate — skipped automatically if a valid in-progress session exists
    const _initialStoredSession = readStoredSession();
    const [showPatientModal, setShowPatientModal] = useState(true); // WO-577: always show modal; stored session surfaces as Resume card inside
    // Stored session used to show the Resume card in PatientSelectModal
    const [storedActiveSession, setStoredActiveSession] = useState(_initialStoredSession);
    // Controls which view the modal opens to: 'choose' (Phase 1) or 'existing' (Phase 2/3)
    const [patientModalView, setPatientModalView] = useState<'choose' | 'existing'>('choose');

    // Protocol Configurator Gate (wo-363)
    const [showProtocolConfigurator, setShowProtocolConfigurator] = useState(false);

    const PHASE_TAB_MAP: Record<string, 1 | 2 | 3> = {
        'Preparation': 1,
        'Treatment': 2,
        'Integration': 3,
        'Complete': 3,
    };

    // If a stored session existed on mount, restore state immediately without
    // going through the patient selection modal.
    useEffect(() => {
        const stored = readStoredSession();
        if (!stored) return;
        setJourney(prev => ({ ...prev, patientId: stored.patientId, sessionId: stored.sessionId, patientUuid: stored.patientUuid }));
        setActivePhase(stored.activePhase);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run once on mount only

    const handlePatientSelect = useCallback(async (patientId: string, isNew: boolean, phase: string) => {
        // ── STEP 0: Clear previous patient's session data from localStorage ──────
        // Without this, stale substance/medication/dosage data from the previous
        // patient bleeds into the new session causing phantom contraindication
        // warnings and incorrect form pre-population.
        const SESSION_CACHE_KEYS = [
            'ppn_dosing_protocol',
            'mock_patient_medications_names',
            'ppn_latest_vitals',
        ];
        SESSION_CACHE_KEYS.forEach(k => { try { localStorage.removeItem(k); } catch (_) { } });

        // Create a REAL log_clinical_records row in the DB so that all Phase 2 form
        // writes (vitals, observations, timeline) satisfy the FK constraint:
        //   log_session_vitals.session_id → log_clinical_records.id
        // We do this for BOTH new and existing patients because every Wellness Journey
        // visit starts a new session record.
        const resolvedSiteId = await getCurrentSiteId();
        let sessionId: string | undefined;

        // TEST mode: skip all DB writes, use a local-only session UUID
        const isTestSession = patientId.startsWith('TEST-');

        let patientUuid: string | undefined;
        if (!isTestSession && resolvedSiteId) {
            const result = await createClinicalSession(patientId, resolvedSiteId);
            if (result.success && result.sessionId) {
                sessionId = result.sessionId;
                patientUuid = result.patientUuid;
            } else {
                console.error('[WellnessJourney] ❌ createClinicalSession FAILED, patient will NOT persist to DB.', result.error);
                sessionId = crypto.randomUUID();
            }
        } else if (!isTestSession) {
            console.error('[WellnessJourney] ❌ No siteId resolved, session will NOT persist to DB. Check log_user_sites.');
            sessionId = crypto.randomUUID();
        } else {
            // TEST session, ephemeral local ID only; no canonical patient_uuid
            sessionId = crypto.randomUUID();
            console.log('[WellnessJourney] 🧪 TEST session started, no DB writes will occur. Patient ID:', patientId);
        }

        // ── STEP 1: Load medications for existing patients from Supabase ─────────
        // Query their most recent StructuredSafetyCheck / intake record for
        // the medication name list and write it to localStorage so that:
        //   a) DosingProtocolForm contraindication engine has real meds
        //   b) DosingSessionPhase medication pills + engine both show real data
        if (!isNew) {
            try {
                const { data: intakeData } = await supabase
                    .from('log_patient_intake')
                    .select('medications_text, medication_ids')
                    // SCHEMA FIX: patient_link_code → patient_link_code_hash (per schema convention)
                    .eq('patient_link_code_hash', patientId)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (intakeData?.medications_text && Array.isArray(intakeData.medications_text) && intakeData.medications_text.length > 0) {
                    // medications_text column: array of free-text medication names entered by practitioner
                    localStorage.setItem('mock_patient_medications_names', JSON.stringify(intakeData.medications_text));
                    console.log('[WellnessJourney] Patient medications loaded from intake record:', intakeData.medications_text);
                } else if (intakeData?.medication_ids && Array.isArray(intakeData.medication_ids) && intakeData.medication_ids.length > 0) {
                    // Resolve medication IDs → names via ref_medications
                    const { data: medRows } = await supabase
                        .from('ref_medications')
                        .select('medication_name')
                        .in('medication_id', intakeData.medication_ids);
                    if (medRows && medRows.length > 0) {
                        const names = medRows.map((m: any) => m.medication_name);
                        localStorage.setItem('mock_patient_medications_names', JSON.stringify(names));
                        console.log('[WellnessJourney] Patient medications resolved from IDs:', names);
                    }
                } else {
                    console.log('[WellnessJourney] No medication data found for patient, medication list will be empty.');
                }
            } catch (err) {
                console.warn('[WellnessJourney] Could not load patient medications, engine will use empty list.', err);
            }
        }

        setJourney(prev => ({
            ...prev,
            patientId,
            patientUuid,
            sessionId,
            demographics: isNew ? undefined : prev.demographics,
        }));
        setShowPatientModal(false);
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
            if (patientId.startsWith('TEST-')) {
                addToast({
                    title: '🧪 Practice Mode Active',
                    message: 'No data will be saved. Explore freely.',
                    type: 'info',
                });
            } else {
                addToast({
                    title: 'New Patient Created',
                    message: `Session started for ${patientId}, Phase 1: Preparation`,
                    type: 'success',
                });
            }
            setShowProtocolConfigurator(true);
        } else {
            const phaseLabel = targetPhase === 1 ? 'Preparation' : targetPhase === 2 ? 'Treatment' : 'Integration';
            addToast({
                title: 'Patient Loaded',
                message: `${patientId}, continuing Phase ${targetPhase}: ${phaseLabel}`,
                type: 'info',
            });
        }
    }, [addToast, navigate]);

    // If the user clicks Back on ProtocolConfiguratorModal Step 1, we need to
    // reopen PatientSelectModal so they can change their patient selection.
    // The patient ID was already set by handlePatientSelect, so we reset it
    // to the placeholder and show the modal again.
    const handleProtocolBack = useCallback(() => {
        setShowProtocolConfigurator(false);
        setShowPatientModal(true);
    }, []);


    // Resume: called when clinician taps the Resume card on PatientSelectModal
    const handleResume = useCallback(() => {
        const stored = readStoredSession();
        if (!stored) return;
        setJourney(prev => ({ ...prev, patientId: stored.patientId, sessionId: stored.sessionId, patientUuid: stored.patientUuid }));
        setActivePhase(stored.activePhase);
        setShowPatientModal(false);
    }, []);

    // Stable callback for closing the patient modal, navigates to the user's
    // previous page (whatever they were on before clicking Wellness Journey).
    // Clears stored session on intentional exit.
    const handleClosePatientModal = useCallback(() => {
        try { localStorage.removeItem(ACTIVE_SESSION_KEY); } catch { /* ignore */ }
        setStoredActiveSession(null);
        navigate(-1);
    }, [navigate]);

    // WO-113: SlideOut form panel state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [activeFormId, setActiveFormId] = useState<WellnessFormId | null>(null);
    const [activeFormTitle, setActiveFormTitle] = useState('Clinical Form');
    const [activeFormSubtitle, setActiveFormSubtitle] = useState<string | undefined>(undefined);

    // ── Phase 1 guided flow: tracks which forms have been saved ──────────────
    const [completedForms, setCompletedForms] = useState<Set<string>>(() => new Set());

    // ── Mobile patient bar: auto-collapse when Phase 2 session is live ────────
    // A simple one-time check when entering Phase 2; the provider can also
    // manually collapse/expand via the toggle. No polling — avoids re-render loops.
    const [patientBarCollapsed, setPatientBarCollapsed] = useState(false);
    useEffect(() => {
        if (activePhase !== 2) {
            setPatientBarCollapsed(false);
            return;
        }
        const checkLive = () => {
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const k = localStorage.key(i);
                    if (k?.startsWith('ppn_session_mode_') && localStorage.getItem(k) === 'live') {
                        setPatientBarCollapsed(true);
                        return;
                    }
                }
            } catch { /* ignore */ }
        };
        // ppn:session-live fires in the same tab from setAndPersistMode('live').
        // The storage event only fires cross-tab, so this covers same-tab sessions.
        const handleSessionLive = () => setPatientBarCollapsed(true);
        checkLive();
        window.addEventListener('storage', checkLive);
        window.addEventListener('ppn:session-live', handleSessionLive);
        return () => {
            window.removeEventListener('storage', checkLive);
            window.removeEventListener('ppn:session-live', handleSessionLive);
        };
    }, [activePhase]);

    // ── Clinician site ID, resolved ONCE at page load, passed to all forms ──
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
        'structured-safety': 'Safety Check - Conditions Prior to Treatment',
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
        'meq30': 'Mystical Experience Questionnaire, 30-item retrospective assessment.',
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
            if (!exit) {
                const currentIndex = PHASE1_STEPS.findIndex(s => s.id === formId);
                const next = PHASE1_STEPS[currentIndex + 1];
                nextId = next ? next.id : null;
            }

            if (!nextId && !exit) {
                isLastPhase1Form = true;
            } else if (!nextId && exit) {
                const allDone = PHASE1_STEPS.every(s => (completedForms.has(s.id) || s.id === formId));
                if (allDone) isLastPhase1Form = true;
            }

            if (isLastPhase1Form) {
                setCompletedPhases(prevPhases => {
                    const newPhases = [...new Set([...prevPhases, 1 as number])];
                    localStorage.setItem(PHASE_STORAGE_KEY, JSON.stringify(newPhases));
                    return newPhases;
                });
            }

            // Use functional form to ensure the state update doesn't drop anything
            // while preserving our synchronously computed next steps above
            setCompletedForms(prev => {
                const updated = new Set([...prev, formId]);
                return updated;
            });
        }

        // ── Phase 2: track form completions so step cards illuminate correctly ──
        if (formId && activePhase === 2) {
            setCompletedForms(prev => new Set([...prev, formId]));
        }

        if (nextId) {
            setActiveFormId(nextId);
            setActiveFormTitle(FORM_LABELS[nextId] ?? 'Clinical Form');
            setActiveFormSubtitle(FORM_SUBTITLES[nextId]);
        } else {
            setIsFormOpen(false);
            setTimeout(() => setActiveFormId(null), 320);

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
    }, [activePhase, addToast]);



    const handleQuickAction = useCallback((formId: string) => {
        handleOpenForm(formId as WellnessFormId);
    }, [handleOpenForm]);

    // Phase locking: only allow switching to unlocked phases
    const isPhaseUnlocked = useCallback((phase: number) => {
        if (phase === 1) return true;
        if (phase === 2) return completedPhases.includes(1);
        if (phase === 3) return completedPhases.includes(2);
        return false;
    }, [completedPhases]);

    const handlePhaseChange = useCallback((phase: 1 | 2 | 3) => {
        if (isPhaseUnlocked(phase)) {
            setActivePhase(phase);
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
        }
    }, [isPhaseUnlocked]);

    // Mark current phase complete and advance
    const completeCurrentPhase = useCallback(() => {
        // WO-577: Phase 3 final closeout — mark session submitted + clear ACTIVE_SESSION_KEY
        // Read sessionId from localStorage (avoids forward-reference to journey useState)
        if (activePhase === 3) {
            const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            try {
                const stored = readStoredSession();
                if (stored?.sessionId && UUID_RE.test(stored.sessionId)) {
                    closeOutSession(stored.sessionId).catch(err =>
                        console.warn('[WO-577] closeOutSession failed (non-fatal):', err)
                    );
                }
                localStorage.removeItem(ACTIVE_SESSION_KEY);
            } catch { /* ignore */ }
        }
        const updated = [...new Set([...completedPhases, activePhase])];
        setCompletedPhases(updated);
        localStorage.setItem(PHASE_STORAGE_KEY, JSON.stringify(updated));
        if (activePhase < 3) {
            setActivePhase((activePhase + 1) as 1 | 2 | 3);
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
        }
    }, [completedPhases, activePhase]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.altKey && e.key === '1') { e.preventDefault(); handlePhaseChange(1); }
            else if (e.altKey && e.key === '2') { e.preventDefault(); handlePhaseChange(2); }
            else if (e.altKey && e.key === '3') { e.preventDefault(); handlePhaseChange(3); }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handlePhaseChange]);

    // Mock data
    const [journey, setJourney] = useState<PatientJourney>(() => {
        // Rehydrate demographics from the last intake modal save so Age/Gender/Weight
        // survive page refreshes without re-entering the protocol configurator.
        let savedDemographics: PatientJourney['demographics'] | undefined;
        let savedCondition: string | undefined;
        try {
            const raw = localStorage.getItem('ppn_patient_intake');
            if (raw) {
                const intake = JSON.parse(raw);
                savedCondition = intake.condition || undefined;
                savedDemographics = {
                    age: intake.age ? parseInt(intake.age, 10) : undefined,
                    gender: intake.gender || undefined,
                    weightKg: intake.weight ? parseFloat(intake.weight) : undefined,
                };
            }
        } catch (_) { }

        return {
            patientId: 'PT-RISK9W2P',
            sessionDate: '2025-10-15',
            daysPostSession: 0,
            condition: savedCondition,
            // Demographics start empty, populated after patient selection or intake form.
            // Hardcoded values caused stale data to appear for every new patient (WO-406 fix).
            demographics: savedDemographics,

            // WO-558: All baseline/session/risk values start null/empty.
            // These are populated by real form submissions (Phase 1 baseline assessments,
            // Phase 2 dosing protocol, etc.), no dummy data.
            baseline: {
                phq9: 0,
                gad7: 0,
                aceScore: 0,
                expectancy: 0
            },

            session: {
                substance: null,
                dosage: null,
                sessionNumber: 1,
                meq30Score: null,
                ediScore: null,
                ceqScore: null,
                safetyEvents: 0,
                chemicalRescueUsed: false
            },

            integration: {
                currentPhq9: 0,
                pulseCheckCompliance: 0,
                phq9Compliance: 0,
                integrationSessionsAttended: 0,
                integrationSessionsScheduled: 0,
                behavioralChanges: []
            },

            benchmark: {
                hasBaselineAssessment: false,
                baselineAssessmentDate: undefined,
                hasFollowUpAssessment: false,
                followUpAssessmentDate: undefined,
                hasDosingProtocol: false,
                dosingProtocolDate: undefined,
                hasSetAndSetting: false,
                setAndSettingDate: undefined,
                hasSafetyCheck: false,
                safetyCheckDate: undefined,
                hasConsent: false,
                consentDate: undefined
            },

            risk: {
                baseline: {
                    phq9: 0,
                    gad7: 0,
                    pcl5: 0,
                    ace: 0
                },
                vitals: {
                    heartRate: 0,
                    baselineHeartRate: 0,
                    bloodPressureSystolic: 0,
                    bloodPressureDiastolic: 0,
                    spo2: 0,
                    temperature: 0
                },
                progressTrends: []
            },

            safety: {
                events: []
            }
        };
    });

    // ── Persist active session to localStorage so navigation-away → back restores state ──
    // This effect is placed AFTER the journey useState to avoid "used before declaration" errors.
    useEffect(() => {
        if (!journey.patientId || journey.patientId === 'PT-RISK9W2P') return; // placeholder, not a real session
        if (!journey.sessionId) return;
        // WO-599: Practice sessions (TEST- prefix) are ephemeral — do NOT persist to localStorage.
        // Persisting them caused the "Resume Session" card to show a TEST patient on the
        // next real session start, making practitioners think TEST mode is the default.
        if (journey.patientId.startsWith('TEST-')) return;
        const payload = {
            patientId: journey.patientId,
            sessionId: journey.sessionId,
            patientUuid: journey.patientUuid,
            activePhase,
            savedAt: Date.now(),
        };
        try { localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(payload)); } catch { /* ignore quota errors */ }
        setStoredActiveSession(payload);
    }, [journey.patientId, journey.sessionId, journey.patientUuid, activePhase]);

    // WO-558: patientCharacteristics removed, was hardcoded dummy data, never displayed from real source.

    // WO-558: totalImprovement only meaningful when baseline was actually recorded.
    // Show null (→ 'Not recorded') when baseline PHQ-9 is 0 (unset).
    const hasBaselinePHQ9 = journey.baseline.phq9 > 0;
    const totalImprovement = hasBaselinePHQ9
        ? journey.baseline.phq9 - journey.integration.currentPhq9
        : null;
    const isRemission = (journey.integration.currentPhq9 > 0) && journey.integration.currentPhq9 < 5;

    // Benchmark readiness
    const { result, nextSteps, isLoading } = useBenchmarkReadiness(journey.benchmark);

    // Risk detection
    const riskDetection = useRiskDetection(journey.risk);

    // Mock patient data for export formatted as PatientReportData
    const exportPatientData: PatientReportData = {
        patientId: journey.patientId,
        treatmentPeriod: {
            start: journey.sessionDate,
            end: new Date(new Date(journey.sessionDate).getTime() + (journey.daysPostSession * 24 * 60 * 60 * 1000)).toISOString()
        },
        baseline: {
            phq9: journey.baseline.phq9,
            gad7: journey.baseline.gad7,
            ace: journey.baseline.aceScore,
            pcl5: journey.risk.baseline.pcl5,
        },
        dosingSession: {
            date: journey.sessionDate,
            substance: journey.session.substance || undefined,
            doseMg: journey.session.dosage ? parseInt(journey.session.dosage) : undefined,
            meq30Score: journey.session.meq30Score || undefined,
            adverseEvents: journey.session.safetyEvents,
        },
        integration: {
            sessionsAttended: journey.integration.integrationSessionsAttended,
            sessionsScheduled: journey.integration.integrationSessionsScheduled,
            behavioralChanges: journey.integration.behavioralChanges.length,
            pulseCheckTotal: journey.integration.pulseCheckCompliance,
            phq9Followup: journey.integration.currentPhq9,
        },
        benchmarkReadiness: result?.score ?? 0,
    };

    return (
        <div className="min-h-screen bg-[#0a1628] px-4 py-4 sm:px-8 sm:py-6 lg:px-16 lg:py-8 xl:px-24">
            {/* Patient Selection Gate */}
            {showPatientModal && (
                <PatientSelectModal
                    onSelect={handlePatientSelect}
                    onClose={handleClosePatientModal}
                    onNavigateBack={handleClosePatientModal}
                    initialView={patientModalView}
                    activeSession={storedActiveSession}
                    onResume={handleResume}
                />
            )}

            {/* Protocol Configurator Gate */}
            {showProtocolConfigurator && (
                <ProtocolConfiguratorModal
                    onClose={() => setShowProtocolConfigurator(false)}
                    onBack={handleProtocolBack}
                    onIntakeComplete={async (intake: PatientIntakeData) => {
                        // Read patientUuid + sessionId from journey state before the async setJourney
                        // (they were set during handlePatientSelect when createClinicalSession ran)
                        let latestPatientUuid: string | undefined;
                        let latestSessionId: string | undefined;
                        setJourney(curr => {
                            latestPatientUuid = curr.patientUuid;
                            latestSessionId = curr.sessionId;
                            return {
                                ...curr,
                                condition: intake.condition || undefined,
                                demographics: {
                                    ...curr.demographics,
                                    age: intake.age ? parseInt(intake.age, 10) : undefined,
                                    gender: intake.gender || undefined,
                                    weightKg: intake.weight ? parseFloat(intake.weight) : undefined,
                                },
                            };
                        });

                        // Write patient profile + indication to DB (fire-and-forget, non-blocking to UI)
                        const resolvedSite = await getCurrentSiteId();
                        if (latestPatientUuid && resolvedSite) {
                            // Patient demographics -> log_patient_profiles
                            createPatientProfile({
                                patient_uuid: latestPatientUuid,
                                site_id: resolvedSite,
                                session_id: latestSessionId,
                                sex_label: intake.gender || undefined,
                                age_at_intake: intake.age ? parseInt(intake.age, 10) : undefined,
                                weight_kg: intake.weight ? parseFloat(intake.weight) : undefined,
                                smoking_label: intake.smoking || undefined,
                            }).catch(err => console.warn('[WellnessJourney] createPatientProfile failed (non-fatal):', err));

                            // Clinical indication -> log_patient_indications
                            if (intake.condition) {
                                createPatientIndication({
                                    patient_uuid: latestPatientUuid,
                                    session_id: latestSessionId,
                                    indication_label: intake.condition,
                                }).catch(err => console.warn('[WellnessJourney] createPatientIndication failed (non-fatal):', err));
                            }
                        }
                    }}
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
                        patientUuid={journey.patientUuid}
                        sessionId={journey.sessionId}
                        siteId={clinicianSiteId}
                        onComplete={() => handleFormComplete(activeFormId)}
                        onExit={() => handleFormComplete(activeFormId, true)}
                        onClose={() => handleFormComplete(null)}
                        onNavigate={handleOpenForm}
                    />
                )}
            </SlideOutPanel>

            {/* WO-604: pb-20 ensures bottom nav (mobile) cannot overlay the last row of buttons */}
            <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 pb-20 md:pb-4">

                {/* ─── Page Heading ─── */}
                <div className="px-1">
                    <h1 className="ppn-page-title">Wellness Journey</h1>
                    {/* Subtitle hidden on mobile — Phase2LiveBar/MobilePhaseBar show context */}
                    <p className="ppn-body mt-1 hidden sm:block" style={{ color: '#8B9DC3' }}>
                        {activePhase === 1 && 'Phase 1 — Preparation: Complete all baseline assessments before the dosing session.'}
                        {activePhase === 2 && 'Phase 2 — Dosing Session: Live documentation during the active session.'}
                        {activePhase === 3 && 'Phase 3 — Integration: Post-session monitoring and outcome tracking.'}
                    </p>
                    {/* Mobile: one-line phase indicator instead of full subtitle */}
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 sm:hidden">
                        {activePhase === 1 && 'Phase 1 · Preparation'}
                        {activePhase === 2 && 'Phase 2 · Dosing Session'}
                        {activePhase === 3 && 'Phase 3 · Integration'}
                    </p>
                </div>

                {/* ─── Patient Context Bar ─── */}
                {/* Mobile: compact single-row horizontal scroll strip + live-session collapse */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-3 sm:px-6 py-3 sm:py-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl">

                    {/* Mobile collapsed state: just shows phase badge + expand button */}
                    {patientBarCollapsed && (
                        <div className="flex items-center justify-between sm:hidden">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                                </span>
                                <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest">Session Live</span>
                                <span className="text-[10px] text-slate-500 font-semibold ml-1">{journey.patientId}</span>
                            </div>
                            <button
                                onClick={() => setPatientBarCollapsed(false)}
                                className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-700/40 border border-slate-600/40 text-[12px] sm:text-[14px] font-bold text-slate-400 uppercase tracking-wide"
                                aria-label="Expand patient context bar"
                            >
                                <ChevronDown className="w-4 h-4" /> Patient
                            </button>
                        </div>
                    )}

                    {/* Full patient bar: always shown on sm+, shown on mobile only when not collapsed */}
                    <div className={`${patientBarCollapsed ? 'hidden sm:flex' : 'flex'} flex-col sm:flex-row sm:items-center justify-between gap-4 w-full`}>

                        {/* Left: Patient identity + demographics pills */}
                        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-0.5 sm:pb-0">
                            <CompassTourButton phase={activePhase} onClick={() => {
                                if (activePhase === 1) setShowTour1(true);
                                if (activePhase === 2) setShowTour2(true);
                                if (activePhase === 3) setShowTour3(true);
                            }} />
                            <div className="flex items-center gap-2 flex-nowrap shrink-0">
                                {/* Patient ID */}
                                <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide shrink-0">Patient</span>
                                <span className="text-sm sm:text-2xl font-bold sm:font-black text-white font-mono tracking-wide shrink-0">{journey.patientId}</span>
                                {/* TEST MODE badge */}
                                {journey.patientId.startsWith('TEST-') && (
                                    <span className="inline-flex min-h-[36px] items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-xs sm:text-sm font-semibold text-amber-400 tracking-wide uppercase shrink-0">
                                        🧪 TEST MODE
                                    </span>
                                )}
                                {/* Demographics pills — hidden on xs, shown sm+ */}
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
                                        className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-600/50 text-[13px] sm:text-sm font-semibold shadow-sm shrink-0"
                                    >
                                        <span className="text-slate-400 font-normal">{title}</span>
                                        <span className="text-white font-bold">{label}</span>
                                    </span>
                                ))}
                                {/* Condition pill */}
                                {journey.condition && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-[11px] sm:text-sm font-semibold shadow-sm shrink-0">
                                        <span className="text-indigo-400 font-normal">Treating</span>
                                        <span className="text-indigo-200 font-bold">{journey.condition}</span>
                                    </span>
                                )}
                                {/* Edit Config / Switch Patient — ensure mobile reachability and 44px min height */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (activePhase === 1) {
                                            setShowProtocolConfigurator(true);
                                        } else {
                                            setPatientModalView('existing');
                                            setShowPatientModal(true);
                                        }
                                    }}
                                    className="inline-flex min-h-[44px] items-center gap-1.5 px-3 py-2 bg-slate-800/50 rounded-xl border border-slate-600/50 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-700/50 transition-all shadow-sm shrink-0"
                                    aria-label={activePhase === 1 ? 'Edit demographics config' : 'Lookup existing patient'}
                                >
                                    {activePhase === 1 ? 'Edit Config' : 'Lookup'}
                                </button>
                                {/* QA Fast-Forward Button (DEV ONLY) — hidden on mobile */}
                                {import.meta.env.DEV && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const allForms = [
                                                'consent', 'structured-safety', 'set-and-setting', 'mental-health', 'dosing-protocol',
                                                'session-vitals', 'session-observations', 'safety-and-adverse-event', 'rescue-protocol'
                                            ];
                                            setCompletedForms(new Set(allForms));
                                            setCompletedPhases([1, 2]);
                                            setActivePhase(3);
                                            addToast({
                                                title: 'QA Fast-Forward',
                                                message: 'Injected Phase 1 & 2 mock data. Jumping to Phase 3 Analytics.',
                                                type: 'success'
                                            });
                                        }}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-fuchsia-500/20 rounded-lg border border-fuchsia-500/50 text-[12px] sm:text-sm font-bold text-fuchsia-300 hover:text-white hover:border-fuchsia-400 hover:bg-fuchsia-600/40 transition-all shadow-sm group shrink-0"
                                        title="QA Tool: Auto-complete Phase 1 & 2 forms and jump to Phase 3"
                                    >
                                        <span className="material-symbols-outlined text-sm group-hover:animate-pulse">fast_forward</span>
                                        QA Skip to Ph3
                                    </button>
                                )}
                            </div>
                            <p className="text-xs sm:text-sm mt-0 sm:mt-0.5 shrink-0 hidden sm:block" style={{ color: '#8B9DC3' }}>
                                {activePhase === 1 && 'Pre-treatment preparation, complete baseline assessments before session'}
                                {activePhase === 2 && `Dosing session in progress · ${journey.sessionDate} · Session #${journey.session.sessionNumber}`}
                                {activePhase === 3 && `Integration phase · ${journey.daysPostSession} days post-session · Monitoring recovery`}
                            </p>
                        </div>

                        {/* Right: Phase-aware primary action + export */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            {/* Phase 1 & 2: no competing CTA, phase navigators handle it */}

                            {activePhase === 3 && config.enabledFeatures.includes('daily-pulse') && (
                                <button
                                    onClick={() => handleOpenForm('daily-pulse')}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl transition-all active:scale-95 text-sm"
                                    aria-label="Open Daily Pulse Check form"
                                >
                                    <span className="material-symbols-outlined text-base" aria-hidden="true">favorite</span>
                                    Daily Pulse
                                </button>
                            )}
                            {/* MEQ-30 removed from banner — accessible in Phase 3 Integration where it belongs clinically */}
                        </div>

                        {/* Mobile: collapse button when bar is expanded during a live session */}
                        {patientBarCollapsed === false && activePhase === 2 && (
                            <button
                                onClick={() => setPatientBarCollapsed(true)}
                                className="flex sm:hidden min-h-[44px] min-w-[44px] items-center justify-center gap-2 mt-2 mx-auto px-4 py-2 rounded-xl bg-slate-700/30 border border-slate-700/40 text-xs font-bold text-slate-400 uppercase tracking-wide w-full"
                                aria-label="Collapse patient context bar"
                            >
                                <ChevronUp className="w-4 h-4" /> Collapse Context
                            </button>
                        )}

                    </div>{/* end full patient bar */}
                </div>

                {/* ── Phase Panel, one glowing border per phase ───────────────── */}
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
                            {/* Global Phase Tabs */}
                            <PhaseIndicator
                                currentPhase={activePhase}
                                completedPhases={completedPhases}
                                onPhaseChange={handlePhaseChange}
                            />
                            {/* Phase content, border on left/right/bottom only, active tab connects at top */}
                            <div
                                className={`rounded-b-2xl border-2 ${phasePalette.border} ${phasePalette.bg} p-3 sm:p-6 space-y-4 sm:space-y-6`}
                                style={{ boxShadow: phasePalette.shadow }}
                            >
                                {/* Phase Content, WO-113: Each phase has CTA buttons to open forms */}
                                <div className="animate-in fade-in duration-300 space-y-6">
                                    {activePhase === 1 && (
                                        // Phase1StepGuide is the SOLE navigator, no competing cards.
                                        // The hero card shows exactly one next action with a large white CTA.
                                        <Phase1StepGuide
                                            completedFormIds={completedForms}
                                            onStartStep={handleOpenForm}
                                            onCompletePhase={completeCurrentPhase}
                                            patientId={journey.patientId}
                                        />
                                    )}
                                    {activePhase === 2 && (
                                        <Phase2ErrorBoundary onReset={() => setActivePhase(2)}>
                                            {/* Mobile Cockpit: renders on viewports < 768px. DosingSessionPhase unchanged on desktop. */}
                                            <div className="block md:hidden">
                                                <MobileCockpit journey={journey} completedForms={completedForms} onOpenForm={handleOpenForm} onCompletePhase={completeCurrentPhase} />
                                            </div>
                                            <div className="hidden md:block">
                                                <TreatmentPhase journey={journey} completedForms={completedForms} onOpenForm={handleOpenForm} onCompletePhase={completeCurrentPhase} />
                                            </div>
                                        </Phase2ErrorBoundary>
                                    )}

                                    {activePhase === 3 && (
                                        <Phase2ErrorBoundary onReset={() => setActivePhase(3)}>
                                            <>
                                                <IntegrationPhase
                                                    journey={journey}
                                                    onOpenForm={handleOpenForm}
                                                    completedForms={completedForms}
                                                />
                                                {/* Phase 3, Early Follow-up (0–72 hrs) */}
                                                <div className="mt-8">
                                                    <p className="text-base font-bold font-manrope text-slate-300 mb-3 px-1">Early Follow-Up · 0–72 hrs</p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {config.enabledFeatures.includes('structured-safety') && (
                                                            /* WO-550 Defect #26: Phase 3 label + description is
                                                               distinct from Phase 1 pre-treatment safety check */
                                                            <WorkflowActionCard
                                                                phase={3}
                                                                status="active"
                                                                title="Early Follow-Up Safety Check · Day 1–3"
                                                                description="Confirm post-session patient stability and safety. This is not the pre-treatment Phase 1 screen."
                                                                icon={<Shield className="w-5 h-5 text-emerald-400" />}
                                                                onClick={() => handleOpenForm('structured-safety')}
                                                            />
                                                        )}
                                                        {config.enabledFeatures.includes('daily-pulse') && (
                                                            <WorkflowActionCard
                                                                phase={3}
                                                                status="active"
                                                                title="Daily Pulse Check"
                                                                description="Log basic mood and sleep metrics."
                                                                icon={<Heart className="w-5 h-5 text-emerald-400" />}
                                                                onClick={() => handleOpenForm('daily-pulse')}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                {/* WO-602B: Removed redundant "Integration Work" WorkflowActionCard grid.
                                                    IntegrationPhase above (steps 3-5) already renders
                                                    structured-integration, behavioral-tracker, and longitudinal-assessment. */}
                                            </>
                                        </Phase2ErrorBoundary>
                                    )}
                                </div>



                                {/* WO-602E (LEAD): Export Report only in Phase 3 (not Phase 1). */}
                                {activePhase === 3 && (
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 pb-1 border-t border-slate-700/30 mt-4 sm:mt-8">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                                            {/* Disclaimer — icon+title only on mobile, full text on sm+ */}
                                            <div className="flex gap-2 items-center sm:items-start sm:gap-3 max-w-xl bg-slate-900/60 border border-slate-700/50 px-3 py-2 sm:p-4 rounded-xl shadow-inner">
                                                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0 mt-0 sm:mt-0.5" />
                                                <div>
                                                    <h4 className="text-xs sm:text-base font-bold text-slate-300 uppercase tracking-wider">Clinical Decision Support Disclaimer</h4>
                                                    {/* Full disclaimer text — hidden on mobile */}
                                                    <p className="hidden sm:block text-sm text-slate-400 leading-relaxed mt-1">
                                                        This system provides statistical data and historical patterns for informational purposes only. It does not provide medical advice, diagnosis, or treatment recommendations. All clinical decisions remain the sole responsibility of the licensed healthcare provider.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Phase lock notice inline */}
                                            {!isPhaseUnlocked(activePhase + 1 as 1 | 2 | 3) && activePhase < 3 && (
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/40 border border-slate-700/40 rounded-lg shadow-sm">
                                                    <Lock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                                    <span className="text-xs sm:text-sm text-slate-400 font-medium">
                                                        Phase {activePhase + 1} unlocks after Phase {activePhase}.
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Export Report */}
                                        <ExportReportButton data={exportPatientData} />
                                    </div>
                                )}
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

const WellnessJourney = () => (
    <ProtocolProvider>
        <WellnessJourneyInternal />
    </ProtocolProvider>
);

export default WellnessJourney;

