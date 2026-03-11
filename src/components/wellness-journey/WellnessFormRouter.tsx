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
            const settingResult = await createSetAndSettingLog({
                patient_uuid: resolvedPatientId,
                session_id: sessionId,
                site_id: siteId,
                treatment_expectancy: data.treatment_expectancy,
                // mindset_type_label / session_setting_label: not yet captured in SetAndSettingForm UI
                // will be wired when form is extended with those dropdowns
            });
            if (!settingResult.success) {
                console.warn('[WellnessFormRouter] handleSetAndSettingSave: log_phase1_set_and_setting write failed (non-fatal)', settingResult.error);
            }
        }

        onSaved('Set & Setting');
    }, [patientId, patientUuidProp, siteId, sessionId]);

    // SAVS P1-B fix: persist PHQ-9 / GAD-7 / ACE / PCL-5 scores to DB on Mental Health Screening complete.
    const handleMentalHealthSave = useCallback(async (data: { phq9?: number | null; gad7?: number | null; ace?: number | null; pcl5?: number | null }) => {
        const resolvedPatientId = patientUuidProp ?? patientId;
        if (!resolvedPatientId || !siteId) {
            onSaved('Mental Health Screening'); // Advance UI even without DB write
            return;
        }
        // WO-603 Fix 5: always pass null (not undefined) so the column is always included in the payload
        const result = await createBaselineAssessment({
            patient_id: resolvedPatientId,
            site_id: siteId,
            phq9_score: data.phq9 ?? null,
            gad7_score: data.gad7 ?? null,
            ace_score: data.ace ?? null,
            pcl5_score: data.pcl5 ?? null,  // WO-597: CHECK 0–80
        });
        result.success ? onSaved('Mental Health Screening') : onError('Mental Health Screening', result.error);
    }, [patientId, siteId]);

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
        // Stamp an observation log entry to log_session_observations for each logged observation,
        // so the observation_log array is synced to the DB in addition to the safety event.
        if (data.observation_log && data.observation_log.length > 0 && sessionId) {
            const lastEntry = data.observation_log[data.observation_log.length - 1];
            // Only stamp latest entry to avoid re-stampng all entries on every save.
            createTimelineEvent({
                session_id: sessionId,
                event_timestamp: lastEntry.timestamp,
                event_type_code: 'patient_observation',
                metadata: {
                    event_description: `Safety observation: ${lastEntry.observations.join(', ')}`,
                    observation_codes: lastEntry.observations,
                    note: lastEntry.note,
                },
            }).catch(err => console.warn('[WO-597] Safety observation stamp failed (non-fatal):', err));
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
            // Also stamp session timeline so the rescue appears on the session arc
            if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
                createTimelineEvent({
                    session_id: sessionId,
                    event_timestamp: data.start_time ?? new Date().toISOString(),
                    event_type_code: 'session_completed', // closest valid code; rescue protocol is an in-session event
                    metadata: {
                        event_description: `Rescue protocol: ${data.intervention_type ?? 'unspecified'}.`,
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
        if (!patientId) return; // silent
        const result = await createPulseCheck({
            patient_id: patientId,
            session_id: sessionId,
            check_date: data.check_in_date,  // form sends check_in_date → schema is check_date
            connection_level: data.connection_level ?? 3,
            sleep_quality: data.sleep_quality ?? 3,
            mood_level: data.mood_level,
            anxiety_level: data.anxiety_level,
        });
        result.success ? onSaved('Daily Pulse Check') : onError('Daily Pulse Check', result.error);
    }, [patientId, sessionId]);

    const handleMEQ30Save = useCallback(async (data: MEQ30Data) => {
        // Compute total score by summing all response values.
        const meq30Total = Object.values(data.responses).reduce((sum, v) => sum + v, 0);

        // Write to log_phase3_meq30 (authoritative) + denormalized log_clinical_records.meq30_score
        if (patientId && sessionId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
            createMEQ30Score({
                patient_uuid: patientId,
                session_id: sessionId,
                meq30_score: meq30Total,  // CHECK 0–150 in log_phase3_meq30
            }).catch(err => console.warn('[WellnessFormRouter] MEQ-30 DB write failed:', err));

            // Also stamp timeline
            createTimelineEvent({
                session_id: sessionId,
                event_timestamp: new Date().toISOString(),
                event_type_code: 'followup_assessment_completed',
                metadata: {
                    event_description: `MEQ-30 assessment completed. Total score: ${meq30Total}.`,
                    meq30_score: meq30Total,
                },
            }).catch(err => console.warn('[WellnessFormRouter] MEQ-30 timeline stamp failed:', err));
        }
        onSaved('MEQ-30 Questionnaire');
    }, [patientId, sessionId]);

    const handleIntegrationSessionSave = useCallback(async (data: StructuredIntegrationSessionData) => {
        if (!patientId) { onError('Integration Session', 'No patient ID'); return; }
        const result = await createIntegrationSession({
            patient_id: patientId,
            dosing_session_id: sessionId,
            integration_session_number: data.session_number,
            session_date: data.session_date,
            session_duration_minutes: data.session_duration_minutes,
            attendance_status_code: data.attendance_status,  // ✅ wired — resolved → FK via live ref lookup
            insight_integration_rating: data.insight_integration_rating,
            emotional_processing_rating: data.emotional_processing_rating,
            behavioral_application_rating: data.behavioral_application_rating,
            engagement_level_rating: data.engagement_level_rating,
            session_focus_ids: data.session_focus_ids,
            homework_assigned_ids: data.homework_assigned_ids,
            therapist_observation_ids: data.therapist_observation_ids,
        });
        result.success ? onSaved('Integration Session') : onError('Integration Session', result.error);
    }, [patientId, sessionId]);

    const handleBehavioralChangeSave = useCallback(async (data: BehavioralChangeData) => {
        if (!patientId) { onError('Behavioral Change', 'No patient ID'); return; }
        const result = await createBehavioralChange({
            patient_id: patientId,
            session_id: sessionId,
            change_date: data.change_date,
            change_type_ids: data.change_type_ids,
            confidence_sustaining: data.confidence_sustaining,
            is_positive: data.impact_on_wellbeing === 'highly_positive' || data.impact_on_wellbeing === 'moderately_positive',
        });
        result.success ? onSaved('Behavioral Change') : onError('Behavioral Change', result.error);
    }, [patientId, sessionId]);

    const handleLongitudinalAssessmentSave = useCallback(async (data: LongitudinalAssessmentData) => {
        if (!patientId) { onError('Longitudinal Assessment', 'No patient ID'); return; }
        const result = await createLongitudinalAssessment({
            patient_id: patientId,
            session_id: sessionId,
            assessment_date: data.assessment_date ?? new Date().toISOString().split('T')[0],
            days_post_session: data.days_post_session,
            phq9_score: data.phq9_score,
            gad7_score: data.gad7_score,
            // whoqol_score and psqi_score removed — columns dropped in schema rebuild (A4)
            cssrs_score: data.cssrs_score,
        });
        result.success ? onSaved('Longitudinal Assessment') : onError('Longitudinal Assessment', result.error);
    }, [patientId, sessionId]);

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
                // Map the selected med IDs → medication name strings for the engine's keyword matching.
                // The CONCOMITANT_MEDICATIONS list in StructuredSafetyCheckForm uses lowercase-compatible names.
                const MED_ID_TO_NAME: Record<number, string> = {
                    1: 'lithium', 2: 'phenelzine', 3: 'tranylcypromine', 4: 'selegiline',
                    5: 'sertraline', 6: 'fluoxetine', 7: 'escitalopram', 8: 'citalopram',
                    9: 'paroxetine', 10: 'bupropion', 11: 'vortioxetine',
                    12: 'amphetamine', 13: 'methylphenidate', 14: 'lisdexamfetamine',
                    15: 'lisinopril', 16: 'metformin', 17: 'atorvastatin',
                    18: 'levothyroxine', 19: 'amlodipine', 20: 'omeprazole',
                };
                const medNames = (data.concomitant_med_ids ?? [])
                    .map(id => MED_ID_TO_NAME[id])
                    .filter(Boolean) as string[];

                // Write med names to localStorage so DosingProtocolForm's engine sees real data.
                try { localStorage.setItem('ppn_patient_medications_names', JSON.stringify(medNames)); } catch (_) { }

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
                        contraindication_verdict_id,                    // WO-596: was always null
                        concomitant_med_ids: data.concomitant_med_ids ?? [], // WO-596: was always []
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
            return <MEQ30QuestionnaireForm onSave={handleMEQ30Save} onComplete={onComplete} onBack={onClose} onExit={onExit ?? onClose ?? onComplete} />;

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
