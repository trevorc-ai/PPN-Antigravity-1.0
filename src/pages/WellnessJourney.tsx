import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useActivePatient } from '../contexts/ActivePatientContext'; // WO-B1
import { useToast } from '../contexts/ToastContext';
import { Target, Shield, TrendingUp, ArrowRight, Lock, CheckCircle, Brain, Info, Heart, AlertTriangle, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { AdvancedTooltip } from '../components/ui/AdvancedTooltip';
import { PhaseIndicator } from '../components/wellness-journey/PhaseIndicator';
import { PreparationPhase } from '../components/wellness-journey/PreparationPhase';
import { TreatmentPhase, Phase2ErrorBoundary } from '../components/wellness-journey/DosingSessionPhase';
import { MobileCockpit } from '../components/wellness-journey/MobileCockpit';
import { MedicationSafetyBanner } from '../components/wellness-journey/MedicationSafetyBanner'; // WO-691
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

import { Phase1Tour, Phase2Tour, Phase3Tour } from '../components/arc-of-care/PhaseTours';
import { ExportReportButton } from '../components/export/ExportReportButton';
import { downloadReport, type PatientReportData } from '../services/reportGenerator';
import { PatientSelectModal } from '../components/wellness-journey/PatientSelectModal';
import { getCurrentSiteId, getOrCreateCanonicalPatientUuid } from '../services/identity'; // WO-206: canonical import
import { supabase } from '../supabaseClient'; // WO-430: medication hydration on patient select
import { PHASE_TO_TAB } from '../utils/clinicalPhase'; // canonical phase → tab mapping
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
    const location = useLocation();
    const { addToast } = useToast();
    // WO-B1: Active patient context — used to bypass modal when patientUuid is carried from another page
    const { activePatientUuid, setActivePatient: setGlobalActivePatient } = useActivePatient();

    // Phase navigation state
    const [activePhase, setActivePhase] = useState<1 | 2 | 3>(1);
    // WO-717: tracks whether the current session has been formally closed (is_submitted=true).
    // Suppresses the "CLOSE SESSION" CTA and shows the "Session Complete" panel instead.
    const [sessionIsSubmitted, setSessionIsSubmitted] = useState(false);

    // Completed phases, persisted to localStorage
    const [completedPhases, setCompletedPhases] = useState<number[]>(() => {
        try {
            const stored = localStorage.getItem(PHASE_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    });

    const { config } = useProtocol();

    // Tour state


    // Onboarding state


    // Patient selection gate — skipped automatically if a valid in-progress session exists
    // WO-B1: Also skipped if activePatientUuid is provided via ActivePatientContext (set by
    // Protocol Detail → "Open in Wellness Journey" navigation with ?patientUuid= param).
    const _initialStoredSession = readStoredSession();
    // Fix B Bug 1: Suppress modal synchronously on deep-link. Without this, the
    // Patient Selection modal renders for ~200–400ms while the async DB fetch runs,
    // and any accidental click breaks the deep-link flow.
    const [showPatientModal, setShowPatientModal] = useState<boolean>(() => {
        try {
            const hash = window.location.hash;
            const hashQuery = hash.includes('?') ? hash.split('?')[1] : window.location.search;
            const UUID_RE_LOCAL = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

            // WO-B1: Skip modal if patientUuid is in the URL (carried from ProtocolDetail)
            const patientUuidFromUrl = new URLSearchParams(hashQuery).get('patientUuid');
            if (patientUuidFromUrl && UUID_RE_LOCAL.test(patientUuidFromUrl)) return false;

            // WO-718: Skip modal if activePatientUuid is already set in context (sidebar / any in-app nav)
            // DB-first: the auto-load useEffect will resolve phase from DB — no modal needed.
            if (activePatientUuid && UUID_RE_LOCAL.test(activePatientUuid)) return false;

            // Hash router: URL is /#/wellness-journey?sessionId=...
            const search = window.location.hash.includes('?')
                ? window.location.hash.split('?')[1]
                : window.location.search;
            const sid = new URLSearchParams(search).get('sessionId');
            const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            return !(sid && UUID_RE.test(sid)); // false = hidden if valid deep-link present
        } catch { return true; }
    });
    // Stored session used to show the Resume card in PatientSelectModal
    const [storedActiveSession, setStoredActiveSession] = useState(_initialStoredSession);
    // Controls which view the modal opens to: 'choose' (Phase 1) or 'existing' (Phase 2/3)
    const [patientModalView, setPatientModalView] = useState<'choose' | 'existing'>('choose');

    // Protocol Configurator Gate (wo-363)
    const [showProtocolConfigurator, setShowProtocolConfigurator] = useState(false);

    // Part 3: pendingOpenFormId — stores a formId to auto-open via handleOpenForm
    // once the deep-link useEffect resolves phase state. Avoids a forward-reference
    // to handleOpenForm (declared later in the component after patient-select logic).
    const [pendingOpenFormId, setPendingOpenFormId] = useState<WellnessFormId | null>(null);

    // PHASE_TO_TAB imported from clinicalPhase.ts — canonical mapping shared with all views.

    // If a stored session existed on mount, restore state immediately without
    // going through the patient selection modal.
    useEffect(() => {
        const stored = readStoredSession();
        if (!stored) return;
        setJourney(prev => ({ ...prev, patientId: stored.patientId, sessionId: stored.sessionId, patientUuid: stored.patientUuid }));
        setActivePhase(stored.activePhase);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run once on mount only

    // WO-B1: Auto-load patient when patientUuid is carried from another page
    // (e.g. Protocol Detail → "Open in Wellness Journey" with ?patientUuid=<uuid>).
    // This runs once on mount when activePatientUuid is already set in context;
    // it resolves the patient's latest session and bypasses the selection modal.
    // If there is already a sessionId deep-link in the URL, that deep-link effect
    // takes priority. If there is a stored active session, that takes priority too.
    useEffect(() => {
        if (!activePatientUuid) return;
        // WO-718 DB-First Fix: removed stale localStorage early-exit.
        // Previously: `if (stored?.patientUuid === activePatientUuid) return` caused the DB
        // re-query to be skipped when localStorage had a stale entry for the same UUID,
        // resulting in wrong phase state on sidebar / back-button navigation paths.
        // DB is always authoritative — always re-query when activePatientUuid changes.
        const hash = window.location.hash;
        const hashQuery = hash.includes('?') ? hash.split('?')[1] : window.location.search;
        const sessionIdInUrl = new URLSearchParams(hashQuery).get('sessionId');
        if (sessionIdInUrl) return; // sessionId deep-link effect handles this

        let cancelled = false;
        (async () => {
            try {
                // WO-B2: Expanded select — include fields needed to derive phase and hydrate
                // TreatmentPhase localStorage keys for live sessions. Previously only ('id, patient_uuid')
                // was fetched, so active Phase 2 dosing sessions were never detected.
                const { data: latestSession } = await supabase
                    .from('log_clinical_records')
                    .select('id, patient_uuid, session_type_id, session_ended_at, is_submitted, created_at, dose_administered_at')
                    .eq('patient_uuid', activePatientUuid)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (cancelled) return;

                const sessionId = latestSession?.id ?? undefined;

                // WO-B2: Derive the correct phase from session state — mirrors deep-link effect logic.
                // Ended sessions → Phase 3, active dosing → Phase 2, else Phase 1.
                const sessionTypeId = latestSession?.session_type_id ?? 1;
                const hasEnded = !!(latestSession?.session_ended_at) || !!(latestSession?.is_submitted);
                // WO-717: surface is_submitted so the Phase 3 CTA can adapt appropriately.
                if (latestSession?.is_submitted) setSessionIsSubmitted(true);
                const derivedPhase: 1 | 2 | 3 = hasEnded
                    ? 3
                    : (sessionTypeId === 2 ? 2 : 1);

                // WO-B2: Unlock completed phase tabs so navigation is available after auto-load.
                const phasesToUnlock: number[] = derivedPhase === 3 ? [1, 2] : derivedPhase === 2 ? [1] : [];
                if (phasesToUnlock.length > 0) {
                    setCompletedPhases(phasesToUnlock);
                    try { localStorage.setItem(PHASE_STORAGE_KEY, JSON.stringify(phasesToUnlock)); } catch (_) {}
                }

                // WO-B2: Hydrate TreatmentPhase localStorage keys for active (live) Phase 2 sessions.
                // TreatmentPhase reads ppn_session_mode_<id> to determine 'pre' / 'live' / 'post'
                // and ppn_session_start_<id> to drive the in-page elapsed timer.
                // Without this, navigating from Sidebar 'Active Patient' to a live session always
                // shows the SessionPrepView (mode='pre') + 00:00:00 elapsed timer.
                if (sessionId && derivedPhase === 2 && !hasEnded) {
                    try {
                        const sessionModeKey = `ppn_session_mode_${sessionId}`;
                        const sessionStartKey = `ppn_session_start_${sessionId}`;
                        // Only write if genuinely missing — don't disturb a session already live on this device
                        if (!localStorage.getItem(sessionModeKey)) {
                            localStorage.setItem(sessionModeKey, 'live');
                        }
                        if (!localStorage.getItem(sessionStartKey)) {
                            // dose_administered_at ?? created_at — mirrors ActiveSessionsContext
                            const startIso = latestSession?.dose_administered_at ?? latestSession?.created_at;
                            if (startIso) {
                                const startMs = new Date(startIso).getTime();
                                if (!isNaN(startMs)) {
                                    localStorage.setItem(sessionStartKey, String(startMs));
                                }
                            }
                        }
                    } catch { /* localStorage unavailable */ }
                }

                // Resolve a display patientId from log_patient_site_links
                let patientId = `SID-${activePatientUuid.substring(0, 8).toUpperCase()}`;
                const { data: linkRow } = await supabase
                    .from('log_patient_site_links')
                    .select('patient_link_code')
                    .eq('patient_uuid', activePatientUuid)
                    .limit(1)
                    .maybeSingle();
                if (linkRow?.patient_link_code) patientId = linkRow.patient_link_code;

                if (cancelled) return;

                setJourney(prev => ({
                    ...prev,
                    patientId,
                    patientUuid: activePatientUuid,
                    sessionId,
                }));
                setActivePhase(derivedPhase);     // WO-B2: advance to correct phase (was always staying on Phase 1)
                setShowPatientModal(false);
                setPatientModalView('existing');

                addToast({
                    title: 'Patient Loaded',
                    message: `${patientId} — continuing from Protocol Detail`,
                    type: 'info',
                });
            } catch (err) {
                console.warn('[WellnessJourney] WO-B1/B2 patientUuid context auto-load failed (non-fatal):', err);
            }
        })();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activePatientUuid]); // run when context patientUuid changes


    // Deep link: allow opening a specific session directly from elsewhere (e.g., Protocol Detail, timer chips).
    // Example: /wellness-journey?sessionId=<uuid>&phase=2
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const sessionIdFromUrl = params.get('sessionId');
        if (!sessionIdFromUrl) return;
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionIdFromUrl)) {
            return;
        }

        // Optional explicit phase override from URL (e.g. &phase=2 from timer chip one-click flow)
        const phaseFromUrl = params.get('phase');
        const explicitPhase: 1 | 2 | 3 | null =
            phaseFromUrl === '2' ? 2 : phaseFromUrl === '3' ? 3 : phaseFromUrl === '1' ? 1 : null;

        let cancelled = false;
        (async () => {
            try {
                const { data: sessionRow, error: sErr } = await supabase
                    .from('log_clinical_records')
                    .select('id, patient_uuid, session_type_id, session_ended_at, is_submitted, created_at, dose_administered_at')
                    .eq('id', sessionIdFromUrl)
                    .maybeSingle();
                if (sErr || !sessionRow?.id || cancelled) return;

                const patientUuid = sessionRow.patient_uuid ?? undefined;
                let patientId = `SID-${sessionRow.id.substring(0, 8).toUpperCase()}`;

                if (patientUuid) {
                    const { data: linkRow } = await supabase
                        .from('log_patient_site_links')
                        .select('patient_link_code')
                        .eq('patient_uuid', patientUuid)
                        .limit(1)
                        .maybeSingle();
                    if (linkRow?.patient_link_code) patientId = linkRow.patient_link_code;
                }

                // Derive phase:
                // - Explicit ?phase= param wins (used by timer chip one-click flow).
                // - Otherwise: ended sessions → Phase 3, active dosing → Phase 2, else Phase 1.
                const sessionTypeId = sessionRow.session_type_id ?? 1;
                const hasEnded = !!sessionRow.session_ended_at || !!sessionRow.is_submitted;
                // WO-717: surface is_submitted so the Phase 3 CTA can adapt appropriately.
                if (sessionRow.is_submitted) setSessionIsSubmitted(true);
                const derivedPhase: 1 | 2 | 3 = explicitPhase ?? (hasEnded
                    ? 3
                    : (sessionTypeId === 2 ? 2 : 1));

                // Unlock phase tabs so the user can navigate once deep-linked into Phase 2/3
                const phasesToUnlock: number[] = derivedPhase === 3 ? [1, 2] : derivedPhase === 2 ? [1] : [];
                if (phasesToUnlock.length > 0) {
                    setCompletedPhases(phasesToUnlock);
                    localStorage.setItem(PHASE_STORAGE_KEY, JSON.stringify(phasesToUnlock));
                }

                // ── Hydrate TreatmentPhase localStorage keys for active sessions ──────────
                // TreatmentPhase reads ppn_session_mode_<sessionId> and ppn_session_start_<sessionId>
                // to determine whether the session is 'pre' / 'live' / 'post' and to drive the
                // in-page elapsed timer. When navigating via a timer chip these keys don't exist
                // in the current browser context, so the component always initialises as 'pre'
                // and shows 00:00:00. We stamp them here from the DB session's created_at so the
                // displayed timer picks up from the correct start time.
                if (derivedPhase === 2 && !hasEnded) {
                    try {
                        const sessionModeKey = `ppn_session_mode_${sessionRow.id}`;
                        const sessionStartKey = `ppn_session_start_${sessionRow.id}`;
                        // Only write if the key is genuinely missing — don't disturb a session
                        // the practitioner already started on this device.
                        if (!localStorage.getItem(sessionModeKey)) {
                            localStorage.setItem(sessionModeKey, 'live');
                        }
                        if (!localStorage.getItem(sessionStartKey)) {
                            // Use dose_administered_at ?? created_at — mirrors ActiveSessionsContext
                            // so the in-page timer shows the same elapsed time as the header chip.
                            const startIso = (sessionRow as any).dose_administered_at ?? sessionRow.created_at;
                            if (startIso) {
                                const startMs = new Date(startIso).getTime();
                                if (!isNaN(startMs)) {
                                    localStorage.setItem(sessionStartKey, String(startMs));
                                }
                            }
                        }
                    } catch { /* localStorage unavailable */ }
                }

                setJourney(prev => ({
                    ...prev,
                    patientId,
                    patientUuid,
                    sessionId: sessionRow.id,
                }));
                setActivePhase(derivedPhase);
                setShowPatientModal(false);
                setPatientModalView('existing');
                // WO-B1: Sync global context so Sidebar + other pages know the active patient
                if (patientUuid) setGlobalActivePatient(patientUuid, sessionRow.id);

                // Part 3 — Auto-open a Phase 3 form from ?openForm= URL param (deep-link from Protocol Detail)
                // We set pendingOpenFormId here; a secondary useEffect (below handleOpenForm declaration)
                // will call handleOpenForm once state settles to avoid the forward-reference issue.
                const openFormParam = params.get('openForm') as WellnessFormId | null;
                if (openFormParam && derivedPhase === 3) {
                    setPendingOpenFormId(openFormParam);
                }
            } catch (err) {
                console.warn('[WellnessJourney] Deep link session load failed (non-fatal):', err);
            }
        })();

        return () => { cancelled = true; };
    }, [location.search]);


    const handlePatientSelect = useCallback(async (patientId: string, isNew: boolean, phase: string) => {
        // ── STEP 0: Clear per-patient cache keys immediately ──────────────────
        // These contain data (meds, vitals, dosing cache) that belongs to one patient
        // and must not bleed into the new patient's session.
        const SESSION_CACHE_KEYS = [
            'ppn_dosing_protocol',
            'mock_patient_medications_names',
            'ppn_patient_medications_names',
            'ppn_latest_vitals',
        ];
        SESSION_CACHE_KEYS.forEach(k => { try { localStorage.removeItem(k); } catch (_) { } });
        // NOTE: ppn_session_mode_* and ppn_session_start_* are NOT cleared here.
        // They are cleared AFTER the incoming sessionId is known (below) so we can
        // preserve the new patient's live-session keys. Clearing them here would wipe
        // Patient A's 'live' flag when returning to them after visiting Patient B.
        // (BUG-3 fix — patient-selection modal re-entry regression).

        // Create or resume a session:
        // - New patient → always create a new log_clinical_records session row (unless TEST).
        // - Existing patient → DEFAULT to resuming the most recent session so clinicians can
        //   review/amend work. Starting a brand-new session should be an explicit UI action.
        const resolvedSiteId = await getCurrentSiteId();
        let sessionId: string | undefined;

        // TEST mode: skip all DB writes, use a local-only session UUID
        const isTestSession = patientId.startsWith('TEST-');

        let patientUuid: string | undefined;
        if (!isTestSession && resolvedSiteId) {
            if (isNew) {
                const result = await createClinicalSession(patientId, resolvedSiteId);
                if (result.success && result.sessionId) {
                    sessionId = result.sessionId;
                    patientUuid = result.patientUuid;
                } else {
                    console.error('[WellnessJourney] ❌ createClinicalSession FAILED, patient will NOT persist to DB.', result.error);
                    sessionId = crypto.randomUUID();
                    patientUuid = await getOrCreateCanonicalPatientUuid(patientId, resolvedSiteId) ?? undefined;
                    if (!patientUuid) {
                        console.warn('[WellnessJourney] ⚠️ patient_uuid resolution also failed. Phase 1 DB saves will be blocked by the UUID guard in createBaselineAssessment.');
                    }
                }
            } else {
                // Existing patient: resolve canonical UUID and resume latest session for this patient.
                patientUuid = await getOrCreateCanonicalPatientUuid(patientId, resolvedSiteId) ?? undefined;
                if (patientUuid) {
                    const { data: latestSession } = await supabase
                        .from('log_clinical_records')
                        .select('id, session_type_id')
                        .eq('patient_uuid', patientUuid)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .maybeSingle();
                    sessionId = latestSession?.id ?? undefined;
                }
                // Fallback: if no session found (should be rare), start a new one.
                if (!sessionId) {
                    const result = await createClinicalSession(patientId, resolvedSiteId);
                    if (result.success && result.sessionId) {
                        sessionId = result.sessionId;
                        patientUuid = result.patientUuid;
                    } else {
                        sessionId = crypto.randomUUID();
                    }
                }
            }
        } else if (!isTestSession) {
            console.error('[WellnessJourney] ❌ No siteId resolved, session will NOT persist to DB. Check log_user_sites.');
            sessionId = crypto.randomUUID();
        } else {
            sessionId = crypto.randomUUID();
            console.log('[WellnessJourney] 🧪 TEST session started, no DB writes will occur. Patient ID:', patientId);
        }

        // ── STEP 1: Load medications + demographics for existing patients from Supabase ──
        // Run both queries concurrently. Medications are needed by the contraindication
        // engine; demographics are needed by every phase header bar (age/gender/weight).
        let loadedDemographics: PatientJourney['demographics'] | undefined;

        if (!isNew) {
            await Promise.all([
                // ── 1a. Medications ──────────────────────────────────────────────────
                // P0 FIX: log_patient_intake is a phantom table — it does not exist in the
                // live schema. Real source: log_phase1_safety_screen.concomitant_med_ids
                // (integer[] FK → ref_medications). Filter by patient_uuid (live column),
                // NOT patient_link_code_hash (phantom column).
                (async () => {
                    try {
                        if (!patientUuid) return; // UUID not resolved — skip
                        const { data: safetyScreen } = await supabase
                            .from('log_phase1_safety_screen')
                            .select('concomitant_med_ids')
                            .eq('patient_uuid', patientUuid)
                            .order('screened_at', { ascending: false })
                            .limit(1)
                            .maybeSingle();

                        const medIds: number[] = Array.isArray(safetyScreen?.concomitant_med_ids)
                            ? safetyScreen.concomitant_med_ids
                            : [];

                        if (medIds.length > 0) {
                            const { data: medRows } = await supabase
                                .from('ref_medications')
                                .select('medication_name')
                                .in('medication_id', medIds);
                            if (medRows && medRows.length > 0) {
                                localStorage.setItem('mock_patient_medications_names', JSON.stringify(medRows.map((m: any) => m.medication_name)));
                            }
                        }
                    } catch (err) {
                        console.warn('[WellnessJourney] Could not load patient medications (non-fatal):', err);
                    }
                })(),

                // ── 1b. Demographics (age / sex / weight) ────────────────────────────
                // P0-B FIX: log_patient_profiles has no patient_link_code_hash, sex_label,
                // or weight_kg columns. Correct identity column is patient_uuid. Sex label
                // lives in ref_sex (FK via sex_id). Weight is ref_weight_ranges (FK via
                // weight_range_id); kg midpoint is used as a representative value.
                (async () => {
                    try {
                        if (!patientUuid) {
                            console.warn('[WellnessJourney] Skipping demographics load — patientUuid not yet resolved.');
                            return;
                        }
                        const { data: profile } = await supabase
                            .from('log_patient_profiles')
                            .select('age_at_intake, ref_sex ( sex_label ), ref_weight_ranges ( kg_low, kg_high )')
                            .eq('patient_uuid', patientUuid)
                            .order('created_at', { ascending: false })
                            .limit(1)
                            .maybeSingle();

                        if (profile) {
                            const sexData = (profile as any).ref_sex;
                            const weightData = (profile as any).ref_weight_ranges;
                            const kgLow = weightData?.kg_low != null ? parseFloat(String(weightData.kg_low)) : undefined;
                            const kgHigh = weightData?.kg_high != null ? parseFloat(String(weightData.kg_high)) : undefined;
                            loadedDemographics = {
                                age: profile.age_at_intake ?? undefined,
                                gender: sexData?.sex_label ?? undefined,
                                weightKg: (kgLow != null && kgHigh != null) ? (kgLow + kgHigh) / 2 : undefined,
                            };
                            console.log('[WellnessJourney] Demographics loaded from log_patient_profiles:', loadedDemographics);
                        } else {
                            // Fall back to ppn_patient_intake localStorage (covers the case where
                            // the profile row hasn't been committed yet but the form was completed)
                            try {
                                const raw = localStorage.getItem('ppn_patient_intake');
                                if (raw) {
                                    const intake = JSON.parse(raw);
                                    loadedDemographics = {
                                        age: intake.age ? parseInt(intake.age, 10) : undefined,
                                        gender: intake.gender || undefined,
                                        weightKg: intake.weight ? parseFloat(intake.weight) : undefined,
                                    };
                                }
                            } catch { /* ignore */ }
                        }
                    } catch (err) {
                        console.warn('[WellnessJourney] Could not load demographics from log_patient_profiles (non-fatal):', err);
                    }
                })(),
            ]);
        }

        setJourney(prev => ({
            ...prev,
            patientId,
            patientUuid,
            sessionId,
            demographics: isNew ? undefined : (loadedDemographics ?? prev.demographics),
        }));
        setShowPatientModal(false);
        // WO-B1: Sync global active patient context so Sidebar + cross-page links stay in sync
        if (patientUuid) setGlobalActivePatient(patientUuid, sessionId ?? null);

        // ── DEFERRED: Wipe stale session-mode keys ──────────────────────────
        // Clean up ppn_session_mode_* and ppn_session_start_* keys that contain
        // stale 'pre' or 'post' data from previous sessions. We must NOT wipe
        // 'live' session keys from any patient — doing so would cause Patient A's
        // session to be lost when the practitioner temporarily switches to Patient B.
        //
        // Rule: only remove a session_mode key if its value is 'pre' or 'post'
        //       AND it does not belong to the incoming session or deep-link session.
        //       Never remove a key whose value is 'live'.
        try {
            const deepLinkSearch = window.location.hash.includes('?')
                ? window.location.hash.split('?')[1]
                : window.location.search;
            const deepLinkedId = new URLSearchParams(deepLinkSearch).get('sessionId') ?? '';
            const idsToAlwaysPreserve = new Set([sessionId, deepLinkedId].filter(Boolean));
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (!k) continue;
                if (k.startsWith('ppn_session_mode_')) {
                    const suffix = k.replace('ppn_session_mode_', '');
                    if (idsToAlwaysPreserve.has(suffix)) continue; // always preserve incoming session
                    const val = localStorage.getItem(k);
                    if (val === 'live') continue; // NEVER wipe live sessions (multi-patient support)
                    keysToRemove.push(k);
                } else if (k.startsWith('ppn_session_start_')) {
                    const suffix = k.replace('ppn_session_start_', '');
                    if (idsToAlwaysPreserve.has(suffix)) continue; // always preserve incoming session
                    // Only remove the start key if the paired mode key is also not live
                    const pairedModeKey = `ppn_session_mode_${suffix}`;
                    const pairedModeVal = localStorage.getItem(pairedModeKey);
                    if (pairedModeVal === 'live') continue; // preserve start key for live sessions
                    keysToRemove.push(k);
                }
            }
            keysToRemove.forEach(k => localStorage.removeItem(k));
        } catch (_) { }
        setPatientModalView(isNew ? 'choose' : 'existing');

        // Auto-promote to Phase 2 if the incoming patient has an active live session in localStorage.
        // This handles the "modal re-entry" path: the modal's DB-derived phase string may say
        // 'Preparation' (if session_type_id doesn't map to a dosing session), but localStorage
        // already has ppn_session_mode_{sessionId}='live' from when the session was started.
        // We trust localStorage over the DB-derived phase string for the tab selection here,
        // because the DB write is async and may not have landed yet.
        let resolvedTargetPhase: 1 | 2 | 3 = isNew ? 1 : (PHASE_TO_TAB[phase as keyof typeof PHASE_TO_TAB] ?? 1);
        if (!isNew && sessionId) {
            try {
                const sessionModeKey = `ppn_session_mode_${sessionId}`;
                const liveMode = localStorage.getItem(sessionModeKey);
                if (liveMode === 'live') {
                    resolvedTargetPhase = 2;
                    console.debug('[WellnessJourney] Auto-promoted to Phase 2 — active session detected in localStorage for', sessionId);
                }
            } catch (_) { }
        }
        const targetPhase = resolvedTargetPhase;
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
    // Tracks which sessionId has already been hydrated from DB — prevents re-firing
    // the 6-query Phase 3 existence check every time activePhase flips back to 3.
    const phase3HydratedRef = useRef<string | null>(null);

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

        // Phase 1: advance through the guided step sequence but do NOT
        // implicitly mark the phase complete. Phase completion is now
        // an explicit clearance action in Phase1StepGuide.
        if (formId && activePhase === 1) {
            if (!exit) {
                const currentIndex = PHASE1_STEPS.findIndex(s => s.id === formId);
                const next = PHASE1_STEPS[currentIndex + 1];
                nextId = next ? next.id : null;
            }

            setCompletedForms(prev => {
                const updated = new Set([...prev, formId]);
                return updated;
            });
        }

        // ── Phase 2/3: track form completions so integration/treatment step cards illuminate correctly ──
        if (formId && (activePhase === 2 || activePhase === 3)) {
            setCompletedForms(prev => new Set([...prev, formId]));
        }

        if (nextId) {
            setActiveFormId(nextId);
            setActiveFormTitle(FORM_LABELS[nextId] ?? 'Clinical Form');
            setActiveFormSubtitle(FORM_SUBTITLES[nextId]);
        } else {
            setIsFormOpen(false);
            setTimeout(() => setActiveFormId(null), 320);

            // Part 4 — Return to Protocol Detail after form save when deep-linked from Protocol Detail
            // Condition: formId must be non-null (explicit save/completion — NOT a dismiss via X/ESC)
            // AND URL must have both sessionId AND openForm params (came from Protocol Detail action button)
            const search = location.search;
            const navParams = new URLSearchParams(search);
            const sessionIdFromUrl = navParams.get('sessionId');
            const openFormFromUrl = navParams.get('openForm');
            const cameFromProtocolDetail = !!(formId && sessionIdFromUrl && openFormFromUrl);
            if (cameFromProtocolDetail) {
                setTimeout(() => navigate(`/protocol/${sessionIdFromUrl}`), 340);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activePhase, addToast, location.search, navigate]);



    const handleQuickAction = useCallback((formId: string) => {
        handleOpenForm(formId as WellnessFormId);
    }, [handleOpenForm]);

    // Part 3 consumer: open pending form from deep-link ?openForm= param.
    // Fires after handleOpenForm is declared and stable, clears pendingOpenFormId after triggering.
    useEffect(() => {
        if (!pendingOpenFormId) return;
        const t = setTimeout(() => {
            handleOpenForm(pendingOpenFormId);
            setPendingOpenFormId(null);
        }, 200);
        return () => clearTimeout(t);
    }, [pendingOpenFormId, handleOpenForm]);



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
        if (activePhase === 1) {
            addToast({
                title: '✅ Phase 1 Clearance Recorded',
                message: 'Preparation, safety screening, and baseline assessments are marked complete. Phase 2 is now unlocked.',
                type: 'success',
            });
        }
        if (activePhase < 3) {
            setActivePhase((activePhase + 1) as 1 | 2 | 3);
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
        }
    }, [completedPhases, activePhase, addToast]);

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
                    // WO-655: display range label; weightKg no longer stored from intake
                    weightKg: undefined,
                };
            }
        } catch (_) { }

        return {
            patientId: 'PT-RISK9W2P',
            sessionDate: new Date().toISOString().slice(0, 10),  // FIX: was hardcoded '2025-10-15'
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

    // ── Live session: strip main's pb-28 and (mobile only) scroll to bottom so action buttons are immediately visible ──
    // WO-688: Desktop keeps action buttons above the fold — scrolling to bottom showed the footer. Guard with < 768px.
    useEffect(() => {
        const main = document.querySelector('main');
        if (!main) return;
        const isLive = activePhase === 2 && !!journey.sessionId;
        if (isLive) {
            main.classList.add('!pb-0');
            const isMobile = window.innerWidth < 768;
            const t = isMobile
                ? setTimeout(() => main.scrollTo({ top: main.scrollHeight, behavior: 'smooth' }), 150)
                : undefined;
            return () => {
                if (t !== undefined) clearTimeout(t);
                main.classList.remove('!pb-0');
            };
        } else {
            main.classList.remove('!pb-0');
        }
    }, [activePhase, journey.sessionId]);

    // ── Phase 3 DB hydration: restore completedForms after navigation-away → back ──
    // completedForms is in-memory only (new Set() on mount). This effect fires whenever
    // journey.sessionId or activePhase changes and we are on Phase 3. It checks each
    // Phase 3 form table for an existing row tied to this session and seeds the set.
    // Intentionally uses direct supabase calls (not a hook) per the approved plan.
    useEffect(() => {
        if (!journey.sessionId || activePhase !== 3) return;
        const sessionId = journey.sessionId;
        // Skip if we already hydrated for this sessionId in this page load.
        if (phase3HydratedRef.current === sessionId) return;
        phase3HydratedRef.current = sessionId;
        let cancelled = false;

        (async () => {
            try {
                const [
                    integration,
                    longitudinal,
                    behavioral,
                    pulse,
                    safety,
                    meq30,
                ] = await Promise.all([
                    supabase.from('log_integration_sessions').select('*').eq('dosing_session_id', sessionId).limit(1).maybeSingle(),
                    supabase.from('log_longitudinal_assessments').select('*').eq('session_id', sessionId).limit(1).maybeSingle(),
                    supabase.from('log_behavioral_changes').select('*').eq('session_id', sessionId).limit(1).maybeSingle(),
                    supabase.from('log_pulse_checks').select('*').eq('session_id', sessionId).limit(1).maybeSingle(),
                    supabase.from('log_phase1_safety_screen').select('*').eq('session_id', sessionId).limit(1).maybeSingle(),
                    supabase.from('log_phase3_meq30').select('*').eq('session_id', sessionId).limit(1).maybeSingle(),
                ]);

                if (cancelled) return;

                const hydrated = new Set<string>();
                if (integration.data) hydrated.add('structured-integration');
                if (longitudinal.data) hydrated.add('longitudinal-assessment');
                if (behavioral.data) hydrated.add('behavioral-tracker');
                if (pulse.data) hydrated.add('daily-pulse');
                if (safety.data) hydrated.add('structured-safety');
                // MEQ-30: prefer localStorage (score is cached there); fall back to DB row
                const meq30LocalKey = `ppn_meq30_responses_${sessionId}`;
                const hasMeq30Local = (() => {
                    try { return !!localStorage.getItem(meq30LocalKey); } catch { return false; }
                })();
                if (hasMeq30Local || meq30.data) hydrated.add('meq30');

                if (hydrated.size > 0) {
                    setCompletedForms(prev => new Set([...prev, ...hydrated]));
                    console.debug('[WellnessJourney] Phase 3 completedForms hydrated from DB:', [...hydrated]);
                }
            } catch (err) {
                console.warn('[WellnessJourney] Phase 3 completedForms hydration failed (non-fatal):', err);
            }
        })();

        return () => { cancelled = true; };
    }, [journey.sessionId, activePhase]);

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
                                    // WO-655: exact weightKg not stored; display shows weight_label from dropdown
                                    weightKg: undefined,
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
                                // WO-655: pass range label; resolveWeightRangeId in service layer resolves to FK
                                weight_label: intake.weight_label || undefined,
                                weight_kg: undefined,
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
            <div className={`max-w-6xl mx-auto space-y-4 sm:space-y-6 ${activePhase === 2 && !!journey.sessionId ? 'pb-2' : 'pb-20 md:pb-4'}`}>

                {/* ─── Page Heading — hidden during live dosing session ─── */}
                {!(activePhase === 2 && !!journey.sessionId) && (
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
                )}

                {/* ─── Patient Context Bar ─── */}
                {/* Part 1: Back to Protocol Record button — shown when deep-linked from Protocol Detail */}
                {(() => {
                    const sessionIdFromUrl = new URLSearchParams(location.search).get('sessionId');
                    return sessionIdFromUrl ? (
                        <button
                            type="button"
                            onClick={() => navigate(`/protocol/${sessionIdFromUrl}`)}
                            className="self-start flex items-center gap-2 text-slate-400 hover:text-white transition-colors group px-2 py-1 mb-2"
                            aria-label="Return to Protocol Record"
                        >
                            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                            <span className="text-xs font-bold uppercase tracking-widest">Protocol Record</span>
                        </button>
                    ) : null;
                })()}
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
                        <div className="flex flex-col items-start gap-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-2 flex-nowrap shrink-0">
                                {/* Patient ID */}
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
                            </div>
                            </div>
                            {/* Session status — own row, never truncated */}
                            <p className="text-xs sm:text-sm hidden sm:block" style={{ color: '#8B9DC3' }}>
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
                                        <>
                                            {/* WO-691: Active medication banner — reads from localStorage, renders null when no meds */}
                                            <MedicationSafetyBanner />
                                            <Phase2ErrorBoundary onReset={() => setActivePhase(2)}>
                                                {/* Mobile Cockpit: renders on viewports < 768px. DosingSessionPhase unchanged on desktop. */}
                                                <div className="block md:hidden">
                                                    <MobileCockpit journey={journey} completedForms={completedForms} onOpenForm={handleOpenForm} onCompletePhase={completeCurrentPhase} />
                                                </div>
                                                <div className="hidden md:block">
                                                    <TreatmentPhase journey={journey} completedForms={completedForms} onOpenForm={handleOpenForm} onCompletePhase={completeCurrentPhase} />
                                                </div>
                                            </Phase2ErrorBoundary>
                                        </>
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

                                                {/* Phase 3 primary CTA — matches Phase 1 (green) and Phase 2 (blue) wide button style */}
                                                <div className="flex flex-col items-center pt-6 mt-4 border-t border-teal-900/40">
                                                    {sessionIsSubmitted ? (
                                                        /* WO-717: Session already closed — replace CTA with completion panel */
                                                        <div className="w-full md:w-2/3 flex flex-col items-center gap-4 py-6 px-6 rounded-2xl bg-emerald-950/40 border border-emerald-600/30">
                                                            <div className="flex items-center gap-3">
                                                                <CheckCircle className="w-7 h-7 text-emerald-400 flex-shrink-0" />
                                                                <div>
                                                                    <p className="font-bold text-emerald-300 text-lg">Session Complete</p>
                                                                    <p className="text-sm text-slate-400">This session is closed and on record.</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    // WO-717 fix: Phase 1 Preparation is required before every new
                                                                    // dosing session. Clear the completed session state, reset phase
                                                                    // tracking, and route to Phase 1 — not Phase 2.
                                                                    try {
                                                                        localStorage.removeItem(ACTIVE_SESSION_KEY);
                                                                        localStorage.removeItem(PHASE_STORAGE_KEY);
                                                                        const keysToRemove: string[] = [];
                                                                        for (let i = 0; i < localStorage.length; i++) {
                                                                            const k = localStorage.key(i);
                                                                            if (k && (
                                                                                k.startsWith('ppn_session_mode_') ||
                                                                                k.startsWith('ppn_session_start_') ||
                                                                                k.startsWith('ppn_phase2_assessment_')
                                                                            )) keysToRemove.push(k);
                                                                        }
                                                                        keysToRemove.forEach(k => localStorage.removeItem(k));
                                                                    } catch { /* ignore */ }
                                                                    setJourney(prev => ({ ...prev, sessionId: undefined }));
                                                                    setCompletedPhases([]);
                                                                    setSessionIsSubmitted(false);
                                                                    setActivePhase(1);
                                                                }}
                                                                className="w-full py-3 rounded-xl font-bold text-base tracking-wide bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-900/40 shadow-lg cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3"
                                                                aria-label="Begin new preparation phase for this patient"
                                                            >
                                                                <Plus className="w-5 h-5" />
                                                                Begin New Preparation
                                                            </button>
                                                        </div>
                                                    ) : (
                                                    <>
                                                    <button
                                                        onClick={async () => {
                                                            // WO-717: Optimistically hide this button immediately so the UX
                                                            // doesn't appear stuck while the async DB write completes.
                                                            setSessionIsSubmitted(true);
                                                            // WO-717: Write is_submitted=true to log_clinical_records FIRST.
                                                            // The button previously only cleared localStorage and navigated —
                                                            // session stayed OPEN in DB, causing the Phase 3 auto-redirect loop
                                                            // every time the practitioner re-opened the patient.
                                                            const sid = journey.sessionId;
                                                            if (sid) {
                                                                const result = await closeOutSession(sid);
                                                                if (!result.success) {
                                                                    console.error('[WO-717] closeOutSession DB write failed:', result.error);
                                                                    // Non-blocking: still clear local state and navigate
                                                                    // so the practitioner isn't stuck. Error logged to console.
                                                                }
                                                            }
                                                            // Clear stale session storage for this patient so future sessions start clean.
                                                            try {
                                                                localStorage.removeItem(ACTIVE_SESSION_KEY);
                                                                localStorage.removeItem(PHASE_STORAGE_KEY);
                                                                const keysToRemove: string[] = [];
                                                                for (let i = 0; i < localStorage.length; i++) {
                                                                    const k = localStorage.key(i);
                                                                    if (k && (
                                                                        k.startsWith('ppn_session_mode_') ||
                                                                        k.startsWith('ppn_session_start_') ||
                                                                        k.startsWith('ppn_phase2_assessment_')
                                                                    )) keysToRemove.push(k);
                                                                }
                                                                keysToRemove.forEach(k => localStorage.removeItem(k));
                                                            } catch { /* ignore */ }
                                                            // Navigate to Protocol Detail to confirm the session was recorded correctly.
                                                            if (sid) {
                                                                navigate(`/protocol/${sid}`);
                                                            } else {
                                                                navigate('/protocols');
                                                            }
                                                        }}
                                                        className="w-full md:w-2/3 py-5 rounded-2xl font-black text-xl tracking-wide shadow-lg bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-teal-900/40 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-4"
                                                        aria-label="Close session and view protocol detail record"
                                                    >
                                                        <CheckCircle className="w-6 h-6" />
                                                        CLOSE SESSION — VIEW PROTOCOL RECORD
                                                    </button>
                                                    <p className="text-sm text-slate-500 mt-3 font-medium">Verify the session was correctly recorded in the patient's protocol</p>
                                                    </>
                                                    )}
                                                </div>
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

                {/* WO-113: Quick Actions FAB — hidden during live dosing session */}
                {!(activePhase === 2 && !!journey.sessionId) && (
                    <QuickActionsMenu
                        currentPhase={activePhase === 1 ? 'phase1' : activePhase === 2 ? 'phase2' : 'phase3'}
                        onActionSelect={handleQuickAction}
                    />
                )}
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

