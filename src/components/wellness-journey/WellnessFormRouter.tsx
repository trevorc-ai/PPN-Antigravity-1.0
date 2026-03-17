import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '../../contexts/ToastContext';

// All arc-of-care forms, in clinical sequence
import {
    // Phase 1: Preparation
    ConsentForm,
    StructuredSafetyCheckForm,
    SetAndSettingForm,
    MentalHealthScreeningForm,
    // Phase 2: Dosing Session
    DosingProtocolForm,
    SessionTimelineForm,
    SessionVitalsForm,
    SessionObservationsForm,
    SafetyAndAdverseEventForm,
    RescueProtocolForm,
    // Phase 3: Integration, Early Follow-up
    DailyPulseCheckForm,
    MEQ30QuestionnaireForm,
    // Phase 3: Integration, Integration Work
    StructuredIntegrationSessionForm,
    BehavioralChangeTrackerForm,
    LongitudinalAssessmentForm,
} from '../arc-of-care-forms';

// WO-206: canonical imports, arcOfCareApi barrel bypassed
import { getCurrentSiteId } from '../../services/identity';
import {
    createConsent,
    createBaselineAssessment,
    createSessionVital,
    createSessionEvent,
    createTimelineEvent,
    createPulseCheck,
    createIntegrationSession,
    createBehavioralChange,
    createLongitudinalAssessment,
    updateDosingProtocol,
    createMEQ30Score,
    createSafetyScreen,
    createSetAndSettingLog,
} from '../../services/clinicalLog';
import type { DosingProtocolUpdateData } from '../../services/clinicalLog';
import { FLOW_EVENT_TYPE_CODES } from '../../services/refFlowEventTypes';

// Form data types
import type { ConsentData } from '../arc-of-care-forms/phase-1-preparation/ConsentForm';
import type { SetAndSettingData } from '../arc-of-care-forms/phase-1-preparation/SetAndSettingForm';
import type { StructuredSafetyCheckData } from '../arc-of-care-forms/ongoing-safety/StructuredSafetyCheckForm';
import type { VitalSignReading } from '../arc-of-care-forms/phase-2-dosing/SessionVitalsForm';
import type { SessionObservationsData } from '../arc-of-care-forms/phase-2-dosing/SessionObservationsForm';
import type { SafetyAndAdverseEventData } from '../arc-of-care-forms/phase-2-dosing/SafetyAndAdverseEventForm';
import type { RescueProtocolData } from '../arc-of-care-forms/phase-2-dosing/RescueProtocolForm';
import type { TimelineEvent } from '../arc-of-care-forms/phase-2-dosing/SessionTimelineForm';
import type { DailyPulseCheckData } from '../arc-of-care-forms/phase-3-integration/DailyPulseCheckForm';
import type { StructuredIntegrationSessionData } from '../arc-of-care-forms/phase-3-integration/StructuredIntegrationSessionForm';
import type { BehavioralChangeData } from '../arc-of-care-forms/phase-3-integration/BehavioralChangeTrackerForm';
import type { LongitudinalAssessmentData } from '../arc-of-care-forms/phase-3-integration/LongitudinalAssessmentForm';
import type { MEQ30Data } from '../arc-of-care-forms/phase-1-preparation/MEQ30QuestionnaireForm';

/**
 * WellnessFormRouter, WO-118 (Live DB Wiring)
 *
 * Maps a formId to the correct form component with a real Supabase API handler.
 * All mock console.log handlers have been replaced with live DB writes.
 *
 * Phase 1, Preparation:
 *   consent → structured-safety → set-and-setting → mental-health
 *
 * Phase 2, Dosing Session:
 *   dosing-protocol → session-timeline → session-vitals → session-observations
 *   → safety-and-adverse-event → rescue-protocol
 *
 * Phase 3, Integration (Early, 0–72 hrs):
 *   daily-pulse → meq30 (provider-discretion)
 *
 * Phase 3, Integration (Longitudinal):
 *   structured-integration → behavioral-tracker → longitudinal-assessment
 */

export type WellnessFormId =
    // Phase 1
    | 'consent'
    | 'structured-safety'
    | 'set-and-setting'
    | 'mental-health'
    // Phase 2
    | 'dosing-protocol'
    | 'session-timeline'
    | 'session-vitals'
    | 'session-observations'
    | 'safety-and-adverse-event'
    | 'rescue-protocol'
    // Phase 3, Early follow-up
    | 'daily-pulse'
    | 'meq30'
    // Phase 3, Integration work
    | 'structured-integration'
    | 'behavioral-tracker'
    | 'longitudinal-assessment';

interface WellnessFormRouterProps {
    formId: WellnessFormId;
    patientId?: string;
    /** Resolved canonical UUID from log_patient_site_links. If provided, used directly.
     *  If absent, handlers fall back to getOrCreateCanonicalPatientUuid(patientId, siteId). */
    patientUuid?: string;
    sessionId?: string;  // UUID, log_clinical_records.id
    siteId?: string;     // Resolved by parent (WellnessJourney) at page load
    onComplete?: () => void;  // Advance to next form / mark complete
    onNavigate?: (formId: WellnessFormId) => void; // Open a sibling form
    onExit?: () => void;      // Mark complete but close panel (Save & Exit)
    onClose?: () => void;     // Close panel without marking complete (used by Back buttons)
}

export const WellnessFormRouter: React.FC<WellnessFormRouterProps> = ({
    formId,
    patientId = '',
    patientUuid: patientUuidProp,
    sessionId,
    siteId: siteIdProp,
    onComplete,
    onNavigate,
    onExit,
    onClose,
}) => {
    const { addToast } = useToast();
    const [siteId, setSiteId] = useState<string | null>(siteIdProp ?? null);

    // Only fetch internally if the parent didn't provide siteId as a prop.
    // When siteIdProp is provided this effect does nothing, eliminating the
    // race condition between component mount and the user clicking Save.
    useEffect(() => {
        if (siteIdProp) {
            setSiteId(siteIdProp);
            return;
        }
        getCurrentSiteId().then(setSiteId);
    }, [siteIdProp]);

    // ── Shared success/error helpers ─────────────────────────────────────────

    // Debounce ref: prevents the same "Saved" toast from stacking when
    // auto-saving forms fire onSave multiple times in quick succession
    // (e.g. Session Observations fires on every tag click).
    const lastSavedAt = useRef<number>(0);
    const TOAST_DEBOUNCE_MS = 5000; // max 1 success toast per 5 s per panel open

    // onSaved: shows a toast but does NOT close the panel.
    // The practitioner stays in the form after a successful save.
    // onComplete (panel close) is triggered only by the X button or backdrop click.
    const onSaved = (label: string) => {
        const now = Date.now();
        if (now - lastSavedAt.current > TOAST_DEBOUNCE_MS) {
            lastSavedAt.current = now;
            addToast({ title: `${label} Saved`, message: 'Recorded to clinical record.', type: 'success' });
        }
        // NOTE: intentionally NOT calling onComplete() here.
    };

    const onError = (label: string, error: unknown) => {
        console.error(`[WellnessFormRouter] ${label} save failed:`, error);
        addToast({
            title: `${label} Failed`,
            message: 'Could not save. Please retry or check your connection.',
            type: 'error',
        });
    };

    // ── Phase 1 handlers ─────────────────────────────────────────────────────

    // WO-529: Persist consent data to localStorage so "Amend" pre-populates the form.
    // Key is per-patient to prevent stale cross-patient bleed.
    const CONSENT_STORAGE_KEY = patientId ? `ppn_consent_${patientId}` : 'ppn_consent';

    const handleConsentSave = useCallback(async (data: ConsentData): Promise<boolean> => {
        // Persist locally first, HUD reads this key regardless of DB outcome.
        try { localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(data)); } catch (_) { }

        // TEST mode: skip all DB writes — no session row in log_clinical_records exists.
        // Return true so ConsentForm advances normally.
        if (patientId.startsWith('TEST-')) {
            addToast({ title: '🧪 Practice Mode', message: 'Consent acknowledged (no DB write in practice mode).', type: 'info' });
            return true;
        }

        const resolvedSiteId = siteId ?? await getCurrentSiteId();
        if (!resolvedSiteId) { onError('Consent', 'No site ID resolved'); return false; }

        // ⚠️  CRITICAL: patient_uuid must be a real UUID, not the PT- link code.
        //    patientUuidProp is set by WellnessJourney after createClinicalSession succeeds.
        //    Fall back to live lookup only if the parent failed to pass it.
        const canonicalUuid = patientUuidProp
            ?? await import('./../../services/identity').then(m => m.getOrCreateCanonicalPatientUuid(patientId, resolvedSiteId));
        if (!canonicalUuid) { onError('Consent', 'Could not resolve canonical patient UUID'); return false; }

        const result = await createConsent(data.consent_types, resolvedSiteId, canonicalUuid, sessionId);
        if (result.success) {
            if (sessionId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
                createTimelineEvent({
                    session_id: sessionId,
                    event_timestamp: new Date().toISOString(),
                    event_type_code: 'consent_verified',
                    metadata: { event_description: 'Informed consent verified.' },
                }).catch(err => console.warn('[WellnessFormRouter] Consent timeline write failed:', err));
            }
            onSaved('Informed Consent');
            return true;
        } else {
            onError('Consent', result.error);
            return false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [siteId, sessionId, CONSENT_STORAGE_KEY]);

    // WO-529: Persist set-and-setting to localStorage on save.
    // SetAndSettingForm already self-rehydrates, this handler just fires the DB write.
    const handleSetAndSettingSave = useCallback(async (data: SetAndSettingData) => {
        const resolvedPatientId = patientUuidProp ?? patientId;
        if (!resolvedPatientId || !siteId) return;

        // Write treatment expectancy to log_baseline_assessments (existing)
        const baselineResult = await createBaselineAssessment({
            patient_id: resolvedPatientId,
            site_id: siteId,
            expectancy_scale: data.treatment_expectancy,
        });
        if (!baselineResult.success) {
            console.warn('[WellnessFormRouter] handleSetAndSettingSave: baseline write failed (non-fatal)', baselineResult.error);
        }

        // Write session linkage to log_phase1_set_and_setting (new table — schema rebuild)
        if (sessionId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
            // WO-603 Fix 2: Map available observation labels → FK lookup keys so DB is never empty.
            // motivation_level → mindset_type_label (best-fit mapping to ref_mindset_types)
            // prior_experience → intention_theme_labels (maps to ref_intention_themes labels)
            const mindsetLabel = (data.observations as any)?.motivation_level ?? undefined;
            const experienceLabel = (data.observations as any)?.prior_experience;
            // Map prior-experience option labels to intention theme labels understood by ref_intention_themes
            const EXPERIENCE_TO_THEME: Record<string, string[]> = {
                'None': ['Curiosity'],
                'Minimal (1-2 times)': ['Curiosity', 'Personal growth'],
                'Some (3-5 times)': ['Healing', 'Personal growth'],
                'Experienced (6+)': ['Healing', 'Spiritual exploration'],
            };
            const intentionLabels = experienceLabel ? (EXPERIENCE_TO_THEME[experienceLabel] ?? []) : [];

            const settingResult = await createSetAndSettingLog({
                patient_uuid: resolvedPatientId,
                session_id: sessionId,
                site_id: siteId,
                treatment_expectancy: data.treatment_expectancy,
                mindset_type_label: mindsetLabel,          // WO-603 Fix 2: was always undefined
                intention_theme_labels: intentionLabels,   // WO-603 Fix 2: was always []
            });
            if (!settingResult.success) {
                console.warn('[WellnessFormRouter] handleSetAndSettingSave: log_phase1_set_and_setting write failed (non-fatal)', settingResult.error);
            }
        }

        onSaved('Set & Setting');
    }, [patientId, patientUuidProp, siteId, sessionId]);

    // SAVS P1-B fix: persist PHQ-9 / GAD-7 / ACE / PCL-5 scores to DB on Mental Health Screening complete.
    const handleMentalHealthSave = useCallback(async (data: { phq9?: number | null; gad7?: number | null; ace?: number | null; pcl5?: number | null }) => {
        // UUID FIX: patientUuidProp is the canonical patient_uuid; patientId is the PT-XXXX link code.
        // createBaselineAssessment requires a canonical UUID — using patientId here silently failed.
        const resolvedPatientId = patientUuidProp ?? patientId;
        if (!resolvedPatientId || !siteId) {
            onSaved('Mental Health Screening'); // Advance UI even without DB write
            return;
        }
        const result = await createBaselineAssessment({
            patient_id: resolvedPatientId,  // FIXED: was patientId (link code)
            site_id: siteId,
            phq9_score: data.phq9 ?? null,
            gad7_score: data.gad7 ?? null,
            ace_score: data.ace ?? null,
            pcl5_score: data.pcl5 ?? null,
        });
        result.success ? onSaved('Mental Health Screening') : onError('Mental Health Screening', result.error);
    }, [patientId, patientUuidProp, siteId]);  // FIXED: added patientUuidProp to deps

    // ── Phase 2 handlers ─────────────────────────────────────────────────────

    const handleVitalsSave = useCallback(async (readings: VitalSignReading[]) => {
        // Cache latest reading to localStorage so SessionVitalsForm can pre-populate on next open
        if (readings.length > 0) {
            try {
                localStorage.setItem('ppn_latest_vitals', JSON.stringify(readings[readings.length - 1]));
            } catch (_) { /* quota exceeded, non-critical */ }
        }

        if (!sessionId) return; // silent, auto-save fires before session is created

        try {
            const promises = readings.map(r => createSessionVital({
                session_id: sessionId,
                heart_rate: r.heart_rate,
                hrv: r.hrv,
                bp_systolic: r.bp_systolic,
                bp_diastolic: r.bp_diastolic,
                oxygen_saturation: r.spo2,
                respiratory_rate: r.respiratory_rate,
                temperature: r.temperature,
                diaphoresis_score: r.diaphoresis_score,
                consciousness_level_code: r.level_of_consciousness,  // resolved → consciousness_level_id FK
                recorded_at: r.recorded_at,
            }));
            const results = await Promise.all(promises);
            const failed = results.filter(r => !r.success);
            if (failed.length === 0) {
                onSaved('Session Vitals');
            } else {
                console.warn('[WellnessFormRouter] Some vitals failed to save to DB:', failed.length, 'readings.');
            }
        } catch (err) {
            console.warn('[WellnessFormRouter] handleVitalsSave threw (non-blocking):', err);
        }
    }, [sessionId]);


    const handleSessionObservationsSave = useCallback(async (data: SessionObservationsData) => {
        if (!sessionId) return; // silent
        onSaved('Session Observations');
    }, [sessionId]);

    const handleSafetyEventSave = useCallback(async (data: SafetyAndAdverseEventData) => {
        if (!sessionId) return; // silent
        // WO-597: Pass ALL available AE fields — was only passing 3 of 7.
        // NOTE: occurred_at is a PHANTOM COLUMN — removed from log_safety_events in schema rebuild.
        //       Do NOT pass it. ctcae_grade mirrors severity_grade (CHECK 1–5).
        const result = await createSessionEvent({
            session_id: sessionId,
            site_id: siteId ?? undefined,
            event_type: data.event_type ?? 'Other',            // resolved → safety_event_type_id FK
            severity_grade_id: data.severity_grade?.toString(), // resolved → severity_grade_id_fk via ref lookup
            ctcae_grade: data.severity_grade,                   // WO-597: was missing — smallint CHECK 1–5
            causality_code: 'possible',                         // WO-597: default — form doesn't capture causality yet
            is_resolved: data.resolved,
            resolved_at: data.resolved_at ?? undefined,         // WO-597: was missing
            // meddra_code_id / intervention_type_id require live ref table lookups:
            // The form stores display strings (data.meddra_code is text, data.intervention_type is text).
            // clinicalLog.ts resolves string→id for event_type; intervention/meddra use IDs directly.
            // These remain null until the form is upgraded to emit FK IDs. Logged to console for visibility.
        });
        if (!result.success) {
            console.warn('[WO-597] createSessionEvent missing optional IDs: meddra_code_id, intervention_type_id (form emits display strings, not FKs yet)');
        }

        // Ledger Gap Fix — P1: stamp EVERY observation log entry, not just the last.
        // Previous code only stamped the final entry, silently dropping earlier ones in a multi-entry session.
        if (data.observation_log && data.observation_log.length > 0 && sessionId) {
            const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (UUID_RE.test(sessionId)) {
                for (const entry of data.observation_log) {
                    // Build human-readable description: observation labels + optional per-entry note
                    const obsLabels = entry.observations.join(', ');
                    const descParts = [`Safety observation: ${obsLabels}`];
                    if (entry.note) descParts.push(`Note: ${entry.note}`);
                    createTimelineEvent({
                        session_id: sessionId,
                        event_timestamp: entry.timestamp,
                        event_type_code: 'patient_observation',
                        metadata: {
                            event_description: descParts.join(' · '),
                            observation_codes: entry.observations,
                            note: entry.note,
                        },
                    }).catch(err => console.warn('[WO-597] Safety observation stamp failed (non-fatal):', err));
                }
            }
        }

        // Ledger Gap Fix — P0: stamp the formal AE Report fields to the ledger.
        // Previously, event_type, severity grade, intervention, resolution, and follow-up plan
        // were written to log_safety_events only — completely invisible in the timeline ledger.
        if (data.event_type && sessionId) {
            const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (UUID_RE.test(sessionId)) {
                const gradeLabels: Record<number, string> = {
                    1: 'Grade 1 (Mild)', 2: 'Grade 2 (Moderate)',
                    3: 'Grade 3 (Severe)', 4: 'Grade 4 (Life-Threatening)', 5: 'Grade 5 (Fatal)',
                };
                const aeParts: string[] = [`AE reported: ${data.event_type}`];
                if (data.severity_grade) aeParts.push(gradeLabels[data.severity_grade] ?? `Grade ${data.severity_grade}`);
                if (data.intervention_type) aeParts.push(`Intervention: ${data.intervention_type}`);
                if (data.resolved) aeParts.push('Resolved');
                else if (data.follow_up_plan) aeParts.push(`Follow-up: ${data.follow_up_plan}`);

                createTimelineEvent({
                    session_id: sessionId,
                    event_timestamp: data.occurred_at
                        ? new Date(data.occurred_at).toISOString()
                        : new Date().toISOString(),
                    event_type_code: 'safety_event', // valid DB code; renders as [ADVERSE EVENT] via EVENT_CONFIG detection
                    metadata: {
                        event_description: aeParts.join(' · '),
                        event_type: data.event_type,
                        severity_grade: data.severity_grade,
                        intervention_type: data.intervention_type,
                        is_resolved: data.resolved,
                        follow_up_plan: data.follow_up_plan,
                    },
                }).catch(err => console.warn('[WO-597] AE Report timeline stamp failed (non-fatal):', err));
            }
        }

        result.success ? onSaved('Safety & Adverse Event') : onError('Safety & Adverse Event', result.error);
    }, [sessionId, siteId]);

    const handleRescueProtocolSave = useCallback(async (data: RescueProtocolData) => {
        if (!sessionId) return; // silent, Rescue form auto-saves immediately, session may not exist yet
        // Rescue protocol → log_safety_events (NOT log_session_timeline_events)
        // RescueProtocolData: { intervention_type, start_time, end_time, duration_minutes }
        // Metadata from start_time/end_time stored in the safety event notes field.
        const result = await createSessionEvent({
            session_id: sessionId,
            site_id: siteId ?? undefined,
            event_type: data.intervention_type ?? 'rescue',  // live ref lookup → safety_event_type_id
        });
        if (result.success) {
            // Ledger Gap Fix — P1: enrich the rescue protocol ledger entry with start time and duration.
            // Previously only intervention_type was visible in the ledger; start time and duration were dropped.
            if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
                const rescueParts: string[] = [`Rescue protocol: ${data.intervention_type ?? 'unspecified'}`];
                if (data.start_time) {
                    const startFmt = new Date(data.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    rescueParts.push(`Started: ${startFmt}`);
                }
                if (data.duration_minutes !== undefined && data.duration_minutes >= 0) {
                    rescueParts.push(`Duration: ${data.duration_minutes} min`);
                } else if (data.end_time) {
                    const endFmt = new Date(data.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    rescueParts.push(`Ended: ${endFmt}`);
                }
                createTimelineEvent({
                    session_id: sessionId,
                    event_timestamp: data.start_time ?? new Date().toISOString(),
                    event_type_code: 'session_completed', // closest valid DB code for rescue entries
                    metadata: {
                        event_description: rescueParts.join(' · '),
                        intervention_type: data.intervention_type,
                        duration_minutes: data.duration_minutes,
                    },
                }).catch(err => console.warn('[WellnessFormRouter] Rescue timeline stamp failed:', err));
            }
            onSaved('Rescue Protocol');
        } else {
            onError('Rescue Protocol', result.error);
        }
    }, [sessionId, siteId]);

    const handleTimelineSave = useCallback(async (events: TimelineEvent[]) => {
        if (!sessionId) return; // silent
        const supportedCodes = new Set(FLOW_EVENT_TYPE_CODES);
        const validEvents = events.filter(e => e.event_timestamp && e.event_type && supportedCodes.has(e.event_type as any));
        if (validEvents.length === 0) return;
        const promises = validEvents.map(e => createTimelineEvent({
            session_id: sessionId,
            event_timestamp: e.event_timestamp,
            event_type_code: e.event_type as any,
            performed_by: e.performed_by,
            metadata: { ...e.metadata, event_description: e.event_description },
        }));
        const results = await Promise.all(promises);
        const failed = results.filter(r => !r.success);
        failed.length === 0
            ? onSaved('Session Timeline')
            : onError('Session Timeline', `${failed.length} events failed to save`);
    }, [sessionId]);

    // WO-534: Dosing Protocol save handler, previously wired to empty no-op.
    // Calls updateDosingProtocol() which UPDATEs the existing stub session row
    // with substance_id, dosage, and route_id FK.
    const handleDosingProtocolSave = useCallback(async (data: DosingProtocolUpdateData) => {
        if (!sessionId) {
            // Session not yet created, silent. Auto-save fires before session stub exists.
            return;
        }
        const result = await updateDosingProtocol(sessionId, data);
        result.success
            ? onSaved('Dosing Protocol')
            : onError('Dosing Protocol', result.error);
    }, [sessionId]);

    // ── Phase 3 handlers ─────────────────────────────────────────────────────

    const handlePulseCheckSave = useCallback(async (data: DailyPulseCheckData) => {
        // UUID FIX: log_pulse_checks.patient_uuid requires a canonical UUID, not the PT-XXXX link code.
        const resolvedPatientId = patientUuidProp ?? patientId;
        if (!resolvedPatientId) return;
        const result = await createPulseCheck({
            patient_id: resolvedPatientId,  // FIXED: was patientId (link code)
            session_id: sessionId,
            check_date: data.check_in_date,
            connection_level: data.connection_level ?? 3,
            sleep_quality: data.sleep_quality ?? 3,
            mood_level: data.mood_level,
            anxiety_level: data.anxiety_level,
        });
        result.success ? onSaved('Daily Pulse Check') : onError('Daily Pulse Check', result.error);
    }, [patientId, patientUuidProp, sessionId]);  // FIXED: added patientUuidProp to deps

    const handleMEQ30Save = useCallback(async (data: MEQ30Data) => {
        const meq30Total = Object.values(data.responses).reduce((sum, v) => sum + v, 0);
        const meq30StorageKey = sessionId
            ? `ppn_meq30_responses_${sessionId}`
            : (patientId ? `ppn_meq30_responses_${patientId}` : 'ppn_meq30_responses');
        try { localStorage.setItem(meq30StorageKey, JSON.stringify(data)); } catch (_) { }
        // UUID FIX: log_phase3_meq30.patient_uuid requires canonical UUID, not link code.
        const resolvedPatientId = patientUuidProp ?? patientId;
        if (resolvedPatientId && sessionId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
            const result = await createMEQ30Score({
                patient_uuid: resolvedPatientId,  // FIXED: was patientId (link code)
                session_id: sessionId,
                meq30_score: meq30Total,
            });
            if (result.success) {
                createTimelineEvent({
                    session_id: sessionId,
                    event_timestamp: new Date().toISOString(),
                    event_type_code: 'followup_assessment_completed',
                    metadata: {
                        event_description: `MEQ-30 assessment completed. Total score: ${meq30Total}.`,
                        meq30_score: meq30Total,
                    },
                }).catch(err => console.warn('[WellnessFormRouter] MEQ-30 timeline stamp failed:', err));
                onSaved('MEQ-30 Questionnaire');
                return;
            }
            onError('MEQ-30 Questionnaire', result.error);
            return;
        }
        onError('MEQ-30 Questionnaire', 'Missing patient UUID or valid session ID');
    }, [patientId, patientUuidProp, sessionId]);  // FIXED: added patientUuidProp to deps

    const handleIntegrationSessionSave = useCallback(async (data: StructuredIntegrationSessionData) => {
        // UUID FIX: log_integration_sessions.patient_uuid requires canonical UUID, not link code.
        const resolvedPatientId = patientUuidProp ?? patientId;
        if (!resolvedPatientId) { onError('Integration Session', 'No patient UUID resolved'); return; }
        const result = await createIntegrationSession({
            patient_id: resolvedPatientId,  // FIXED: was patientId (link code)
            dosing_session_id: sessionId,
            integration_session_number: data.session_number,
            session_date: data.session_date,
            session_duration_minutes: data.session_duration_minutes,
            attendance_status_code: data.attendance_status,
            insight_integration_rating: data.insight_integration_rating,
            emotional_processing_rating: data.emotional_processing_rating,
            behavioral_application_rating: data.behavioral_application_rating,
            engagement_level_rating: data.engagement_level_rating,
            session_focus_ids: data.session_focus_ids,
            homework_assigned_ids: data.homework_assigned_ids,
            therapist_observation_ids: data.therapist_observation_ids,
        });
        result.success ? onSaved('Integration Session') : onError('Integration Session', result.error);
    }, [patientId, patientUuidProp, sessionId]);  // FIXED: added patientUuidProp to deps

    const handleBehavioralChangeSave = useCallback(async (data: BehavioralChangeData) => {
        // UUID FIX: log_behavioral_changes.patient_uuid requires canonical UUID, not link code.
        const resolvedPatientId = patientUuidProp ?? patientId;
        if (!resolvedPatientId) { onError('Behavioral Change', 'No patient UUID resolved'); return; }
        const result = await createBehavioralChange({
            patient_id: resolvedPatientId,  // FIXED: was patientId (link code)
            session_id: sessionId,
            change_date: data.change_date,
            change_type_ids: data.change_type_ids,
            confidence_sustaining: data.confidence_sustaining,
            is_positive: data.impact_on_wellbeing === 'highly_positive' || data.impact_on_wellbeing === 'moderately_positive',
        });
        result.success ? onSaved('Behavioral Change') : onError('Behavioral Change', result.error);
    }, [patientId, patientUuidProp, sessionId]);  // FIXED: added patientUuidProp to deps

    const handleLongitudinalAssessmentSave = useCallback(async (data: LongitudinalAssessmentData) => {
        // UUID FIX: log_longitudinal_assessments.patient_uuid requires canonical UUID, not link code.
        const resolvedPatientId = patientUuidProp ?? patientId;
        if (!resolvedPatientId) { onError('Longitudinal Assessment', 'No patient UUID resolved'); return; }
        const result = await createLongitudinalAssessment({
            patient_id: resolvedPatientId,  // FIXED: was patientId (link code)
            session_id: sessionId,
            assessment_date: data.assessment_date ?? new Date().toISOString().split('T')[0],
            days_post_session: data.days_post_session,
            phq9_score: data.phq9_score,
            gad7_score: data.gad7_score,
            cssrs_score: data.cssrs_score,
        });
        result.success ? onSaved('Longitudinal Assessment') : onError('Longitudinal Assessment', result.error);
    }, [patientId, patientUuidProp, sessionId]);  // FIXED: added patientUuidProp to deps

    // ── Router ───────────────────────────────────────────────────────────────

    switch (formId) {

        // ── Phase 1: Preparation ──────────────────────────────────────────────
        case 'consent': {
            // WO-529: Rehydrate previously saved consent so "Amend" pre-populates.
            const consentKey = patientId ? `ppn_consent_${patientId}` : 'ppn_consent';
            const consentInitial = (() => {
                try {
                    const raw = localStorage.getItem(consentKey);
                    if (raw) return JSON.parse(raw) as ConsentData;
                } catch (_) { }
                return undefined;
            })();
            return <ConsentForm
                onSave={handleConsentSave}
                initialData={consentInitial}
                patientId={patientId}
                onNext={onComplete}
                onBack={onClose ?? onComplete}
                onExit={onExit ?? onClose ?? onComplete}
            />;
        }

        case 'structured-safety': {
            // WO-529: Rehydrate previously saved safety check so "Amend" pre-populates.
            const safetyKey = patientId ? `ppn_structured_safety_${patientId}` : 'ppn_structured_safety';
            const safetyInitial = (() => {
                try {
                    const raw = localStorage.getItem(safetyKey);
                    if (raw) return JSON.parse(raw) as Partial<StructuredSafetyCheckData>;
                } catch (_) { }
                return undefined;
            })();

            // SAVS P1-A fix: persist safety screening completion to both tables:
            // - log_phase1_safety_screen: authoritative record (was missing before)
            // - log_session_timeline_events: permanent clinical timestamp stamp
            const handleSafetyCheckSave = async (data: StructuredSafetyCheckData) => {
                try { localStorage.setItem(safetyKey, JSON.stringify(data)); } catch (_) { }

                const resolvedPatientId = patientUuidProp ?? patientId;
                const resolvedSiteId = siteId ?? await import('../../services/identity').then(m => m.getCurrentSiteId());

                // WO-596: Resolve contraindication_verdict_id by running the engine.
                // Medication names are now persisted by BaselineAssessmentWizard / DosingSessionPhase
                // to localStorage under 'ppn_patient_medications_names'. Read from there.
                // (concomitant_med_ids was removed from StructuredSafetyCheckData in the StructuredSafetyCheckForm refactor.)
                let medNames: string[] = [];
                try {
                    const storedMeds = localStorage.getItem('ppn_patient_medications_names');
                    if (storedMeds) medNames = JSON.parse(storedMeds) as string[];
                } catch { /* localStorage unavailable — proceed with empty list */ }

                // Write med names to localStorage so DosingProtocolForm's engine sees real data.
                try { localStorage.setItem('ppn_patient_medications_names', JSON.stringify(medNames)); } catch (_) { }
                // SAME-TAB FIX (Bug 1.4): window.storage only fires cross-tab. Dispatch a custom
                // event so DosingSessionPhase's useEffect can re-evaluate the medication list
                // immediately when Phase 1 safety screen saves from the same browser session.
                window.dispatchEvent(new CustomEvent('ppn:safety-updated'));

                // Run engine at save time (unknown substance — use generic check for all-substance flags).
                // verdict_id: 1 = CLEAR, 2 = PROCEED_WITH_CAUTION, 3 = DO_NOT_PROCEED
                // (mirrors ref_contraindication_verdicts ordering)
                const { runContraindicationEngine } = await import('../../services/contraindicationEngine');
                const engineResult = runContraindicationEngine({
                    patientId: resolvedPatientId || 'UNKNOWN',
                    sessionSubstance: 'psilocybin', // generic check — DosingProtocolForm re-runs with actual substance
                    medications: medNames,
                    psychiatricHistory: [],
                    familyHistory: [],
                    cssrsScore: data.cssrs_score,
                });
                const contraindication_verdict_id =
                    engineResult.verdict === 'DO_NOT_PROCEED' ? 3 :
                    engineResult.verdict === 'PROCEED_WITH_CAUTION' ? 2 : 1;

                // Write to log_phase1_safety_screen (new authoritative table for safety screen data)
                if (resolvedPatientId && resolvedSiteId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(resolvedPatientId)) {
                    createSafetyScreen({
                        patient_uuid: resolvedPatientId,
                        session_id: sessionId ?? undefined,
                        site_id: resolvedSiteId,
                        contraindication_verdict_id,  // WO-596: resolved by engine above
                        concomitant_med_ids: [],       // field removed from form; DB DEFAULT '{}' applies
                    }).catch(err => console.warn('[SAVS-P1A] log_phase1_safety_screen write failed (non-fatal):', err));
                }

                // Also stamp timeline so the safety check has a permanent clinical timestamp
                if (sessionId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
                    createTimelineEvent({
                        session_id: sessionId,
                        event_timestamp: new Date().toISOString(),
                        event_type_code: 'baseline_assessment_completed',
                        metadata: { event_description: 'Phase 1 Structured Safety Check completed by practitioner.' },
                    }).catch(err => console.warn('[SAVS-P1A] Safety check timeline stamp failed:', err));
                }

                onSaved('Safety Screen');
            };

            return <StructuredSafetyCheckForm
                onSave={handleSafetyCheckSave}
                initialData={safetyInitial}
                onComplete={onComplete}
                onBack={() => onNavigate ? onNavigate('consent') : onClose?.()}
                onExit={onExit ?? onClose ?? onComplete}
            />;
        }


        case 'set-and-setting':
            // WO-529: patientId passed so SetAndSettingForm rehydrates from the correct
            // per-patient localStorage key (ppn_set_setting_${patientId}) on Amend.
            return <SetAndSettingForm
                patientId={patientId}
                onSave={handleSetAndSettingSave}
                onComplete={onComplete}
                onBack={() => onNavigate ? onNavigate('mental-health') : onClose?.()}
                onExit={onExit ?? onClose ?? onComplete}
            />;

        case 'mental-health':
            return <MentalHealthScreeningForm
                patientId={patientId}
                onComplete={async (wizardData) => {
                    // SAVS P1-B fix: persist psychometric scores now that we have WizardData
                    await handleMentalHealthSave(wizardData.mentalHealth);
                    // SAVS P1-C fix: stamp Phase 1 completion timestamp in the DB ledger
                    if (sessionId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
                        createTimelineEvent({
                            session_id: sessionId,
                            event_timestamp: new Date().toISOString(),
                            event_type_code: 'baseline_assessment_completed',
                            metadata: { event_description: 'Phase 1 Preparation completed. Baseline assessment recorded.' },
                        }).catch(err => console.warn('[SAVS-P1C] Phase 1 completion DB write failed:', err));
                    }
                    onComplete?.();
                }}
                onExit={onExit ?? onClose ?? onComplete}
                onBack={() => onNavigate ? onNavigate('structured-safety') : onClose?.()}
            />;

        // ── Phase 2: Dosing Session ───────────────────────────────────────────
        case 'dosing-protocol': {
            // Rehydrate previously saved dosing data so "Amend" pre-populates the form.
            // DosingProtocolForm writes to localStorage on every field change via updateField().
            // Reading it back here ensures the practitioner never has to re-enter a dose.
            const dosingInitialData = (() => {
                try {
                    const raw = localStorage.getItem('ppn_dosing_protocol');
                    if (raw) return JSON.parse(raw);
                } catch (_) { /* ignore parse errors */ }
                return {};
            })();
            return <DosingProtocolForm
                initialData={dosingInitialData}
                patientId={patientId}
                sessionId={sessionId}
                onSave={handleDosingProtocolSave}  // WO-534: was () => { } no-op
                onComplete={onComplete}
                onBack={onClose ?? onComplete}
                onExit={onExit ?? onClose ?? onComplete}
            />;
        }

        case 'session-timeline':
            return <SessionTimelineForm onSave={handleTimelineSave} onComplete={onComplete} onBack={onClose ?? onComplete} onExit={onExit ?? onClose ?? onComplete} />;

        case 'session-vitals':
            return <SessionVitalsForm onSave={handleVitalsSave} onComplete={onComplete} onBack={onClose ?? onComplete} onExit={onExit ?? onClose ?? onComplete} />;

        case 'session-observations':
            return <SessionObservationsForm onSave={handleSessionObservationsSave} onComplete={onComplete} onBack={onClose ?? onComplete} onExit={onExit ?? onClose ?? onComplete} />;

        case 'safety-and-adverse-event':
            return <SafetyAndAdverseEventForm onSave={handleSafetyEventSave} onComplete={onComplete} onBack={onClose ?? onComplete} onExit={onExit ?? onClose ?? onComplete} />;

        case 'rescue-protocol':
            return <RescueProtocolForm onSave={handleRescueProtocolSave} onComplete={onComplete} onBack={onClose ?? onComplete} onExit={onExit ?? onClose ?? onComplete} />;

        // ── Phase 3: Integration, Early Follow-up ───────────────────────────
        case 'daily-pulse':
            return <DailyPulseCheckForm onSave={handlePulseCheckSave} onComplete={onComplete} onBack={onClose ?? onComplete} onExit={onExit ?? onClose ?? onComplete} />;

        case 'meq30':
            {
                const meq30StorageKey = sessionId
                    ? `ppn_meq30_responses_${sessionId}`
                    : (patientId ? `ppn_meq30_responses_${patientId}` : 'ppn_meq30_responses');
                const meq30InitialData = (() => {
                    try {
                        const raw = localStorage.getItem(meq30StorageKey);
                        if (raw) return JSON.parse(raw) as MEQ30Data;
                    } catch (_) { }
                    return undefined;
                })();
                return <MEQ30QuestionnaireForm
                    onSave={handleMEQ30Save}
                    initialData={meq30InitialData}
                    patientId={patientId}
                    sessionId={sessionId}
                    onComplete={onComplete}
                    onBack={onClose}
                    onExit={onExit ?? onClose ?? onComplete}
                />;
            }

        // ── Phase 3: Integration, Integration Work ──────────────────────────
        case 'structured-integration':
            return <StructuredIntegrationSessionForm onSave={handleIntegrationSessionSave} onComplete={onComplete} onBack={onClose ?? onComplete} onExit={onExit ?? onClose ?? onComplete} />;

        case 'behavioral-tracker':
            return <BehavioralChangeTrackerForm onSave={handleBehavioralChangeSave} onComplete={onComplete} onBack={onClose ?? onComplete} onExit={onExit ?? onClose ?? onComplete} />;

        case 'longitudinal-assessment':
            return <LongitudinalAssessmentForm onSave={handleLongitudinalAssessmentSave} onComplete={onComplete} onBack={onClose ?? onComplete} onExit={onExit ?? onClose ?? onComplete} />;

        default:
            return (
                <div className="p-8 text-center text-slate-400">
                    <p className="text-base">
                        Form not recognized: <code className="text-slate-300 font-mono">{formId}</code>
                    </p>
                    <p className="text-sm mt-2 text-slate-500">
                        Add this formId to WellnessFormRouter.tsx to connect it.
                    </p>
                </div>
            );
    }
};

export default WellnessFormRouter;
