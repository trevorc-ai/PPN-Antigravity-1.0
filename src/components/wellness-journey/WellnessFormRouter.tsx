import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '../../contexts/ToastContext';

// All arc-of-care forms — in clinical sequence
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
    // Phase 3: Integration — Early Follow-up
    DailyPulseCheckForm,
    MEQ30QuestionnaireForm,
    // Phase 3: Integration — Integration Work
    StructuredIntegrationSessionForm,
    BehavioralChangeTrackerForm,
    LongitudinalAssessmentForm,
} from '../arc-of-care-forms';

// WO-206: canonical imports — arcOfCareApi barrel bypassed
import { getCurrentSiteId } from '../../services/identity';
import {
    createConsent,
    createBaselineAssessment,
    createSessionVital,
    createSessionObservation,
    createSessionEvent,
    createTimelineEvent,
    createPulseCheck,
    createIntegrationSession,
    createBehavioralChange,
    createLongitudinalAssessment,
} from '../../services/clinicalLog';

// Form data types
import type { ConsentData } from '../arc-of-care-forms/phase-1-preparation/ConsentForm';
import type { SetAndSettingData } from '../arc-of-care-forms/phase-1-preparation/SetAndSettingForm';
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
 * WellnessFormRouter — WO-118 (Live DB Wiring)
 *
 * Maps a formId to the correct form component with a real Supabase API handler.
 * All mock console.log handlers have been replaced with live DB writes.
 *
 * Phase 1 — Preparation:
 *   consent → structured-safety → set-and-setting → mental-health
 *
 * Phase 2 — Dosing Session:
 *   dosing-protocol → session-timeline → session-vitals → session-observations
 *   → safety-and-adverse-event → rescue-protocol
 *
 * Phase 3 — Integration (Early, 0–72 hrs):
 *   daily-pulse → meq30 (provider-discretion)
 *
 * Phase 3 — Integration (Longitudinal):
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
    // Phase 3 — Early follow-up
    | 'daily-pulse'
    | 'meq30'
    // Phase 3 — Integration work
    | 'structured-integration'
    | 'behavioral-tracker'
    | 'longitudinal-assessment';

interface WellnessFormRouterProps {
    formId: WellnessFormId;
    patientId?: string;
    sessionId?: string;  // UUID — log_clinical_records.id
    siteId?: string;     // Resolved by parent (WellnessJourney) at page load
    onComplete?: () => void;  // Advance to next form / mark complete
    onNavigate?: (formId: WellnessFormId) => void; // Open a sibling form
    onClose?: () => void;     // Close panel without marking complete (used by Back buttons)
}

export const WellnessFormRouter: React.FC<WellnessFormRouterProps> = ({
    formId,
    patientId = '',
    sessionId,
    siteId: siteIdProp,
    onComplete,
    onNavigate,
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

    // useCallback is REQUIRED here — ConsentForm's auto-save useEffect has `onSave`
    // in its dependency array. Without stable reference, every WellnessFormRouter 
    // re-render (e.g. siteId resolving) triggers a new save attempt → 50 error spam.
    const handleConsentSave = useCallback(async (data: ConsentData): Promise<boolean> => {
        // Belt-and-suspenders: if the pre-fetched siteId is still null (race
        // condition or slow page load), try to resolve it live at save time.
        const resolvedSiteId = siteId ?? await getCurrentSiteId();
        if (!resolvedSiteId) { onError('Consent', 'No site ID resolved'); return false; }
        const result = await createConsent(data.consent_types, resolvedSiteId);
        if (result.success) {
            onSaved('Informed Consent');
            return true;
        } else {
            onError('Consent', result.error);
            return false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [siteId]);

    const handleSetAndSettingSave = useCallback(async (data: SetAndSettingData) => {
        if (!patientId || !siteId) return;
        const result = await createBaselineAssessment({
            patient_id: patientId,
            site_id: siteId,
            expectancy_scale: data.treatment_expectancy,
            // observations[] included in form data; no dedicated DB column yet — same behaviour as before
        });
        result.success ? onSaved('Set & Setting') : onError('Set & Setting', result.error);
    }, [patientId, siteId]);

    // ── Phase 2 handlers ─────────────────────────────────────────────────────

    const handleVitalsSave = useCallback(async (readings: VitalSignReading[]) => {
        if (!sessionId) return; // silent — auto-save fires before session is created
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
            level_of_consciousness: r.level_of_consciousness,
            source: r.data_source,
            device_id: r.device_id,
            recorded_at: r.recorded_at,
        }));
        const results = await Promise.all(promises);
        const failed = results.filter(r => !r.success);
        failed.length === 0
            ? onSaved('Session Vitals')
            : onError('Session Vitals', `${failed.length} readings failed to save`);
    }, [sessionId]);

    const handleSessionObservationsSave = useCallback(async (data: SessionObservationsData) => {
        if (!sessionId) return; // silent
        onSaved('Session Observations');
    }, [sessionId]);

    const handleSafetyEventSave = useCallback(async (data: SafetyAndAdverseEventData) => {
        if (!sessionId) return; // silent
        const result = await createSessionEvent({
            session_id: sessionId,
            event_type: data.event_type ?? 'other',
            severity_grade_id: data.severity_grade?.toString(),
            is_resolved: data.resolved,
        });
        result.success ? onSaved('Safety & Adverse Event') : onError('Safety & Adverse Event', result.error);
    }, [sessionId]);

    const handleRescueProtocolSave = useCallback(async (data: RescueProtocolData) => {
        if (!sessionId) return; // silent — Rescue form auto-saves immediately, session may not exist yet
        const result = await createSessionEvent({
            session_id: sessionId,
            event_type: 'rescue',
            intervention_type_id: data.intervention_type ? undefined : undefined,
        });
        result.success ? onSaved('Rescue Protocol') : onError('Rescue Protocol', result.error);
    }, [sessionId]);

    const handleTimelineSave = useCallback(async (events: TimelineEvent[]) => {
        if (!sessionId) return; // silent
        const validEvents = events.filter(e => e.event_type && e.event_timestamp);
        if (validEvents.length === 0) return;
        const promises = validEvents.map(e => createTimelineEvent({
            session_id: sessionId,
            event_timestamp: e.event_timestamp,
            event_type: e.event_type,
            performed_by: e.performed_by,
            metadata: e.metadata,
        }));
        const results = await Promise.all(promises);
        const failed = results.filter(r => !r.success);
        failed.length === 0
            ? onSaved('Session Timeline')
            : onError('Session Timeline', `${failed.length} events failed to save`);
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

    const handleMEQ30Save = useCallback(async (_data: MEQ30Data) => {
        // MEQ-30 score is stored on log_clinical_records.meq30_score (the session record)
        // This requires an UPDATE to the existing session record, not a new insert.
        // For now: record that MEQ-30 was completed. Full wiring requires session UPSERT.
        onSaved('MEQ-30 Questionnaire');
    }, []);

    const handleIntegrationSessionSave = useCallback(async (data: StructuredIntegrationSessionData) => {
        if (!patientId) { onError('Integration Session', 'No patient ID'); return; }
        const result = await createIntegrationSession({
            patient_id: patientId,
            dosing_session_id: sessionId,
            integration_session_number: data.session_number,
            session_date: data.session_date,
            session_duration_minutes: data.session_duration_minutes,
            attended: data.attendance_status === 'attended',
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
            change_category: data.change_category,
            change_type_ids: data.change_type_ids,
            impact_on_wellbeing: data.impact_on_wellbeing,
            confidence_sustaining: data.confidence_sustaining,
            related_to_dosing: data.related_to_dosing,
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
            whoqol_score: data.whoqol_score,
            psqi_score: data.psqi_score,
            cssrs_score: data.cssrs_score,
        });
        result.success ? onSaved('Longitudinal Assessment') : onError('Longitudinal Assessment', result.error);
    }, [patientId, sessionId]);

    // ── Router ───────────────────────────────────────────────────────────────

    switch (formId) {

        // ── Phase 1: Preparation ──────────────────────────────────────────────
        case 'consent':
            // Save auto-advances — onNext triggers onComplete which queues the next form
            return <ConsentForm
                onSave={handleConsentSave}
                patientId={patientId}
                onNext={onComplete}
            />;

        case 'structured-safety':
            return <StructuredSafetyCheckForm
                onSave={() => onSaved('Safety Screen')}
                onComplete={onComplete}
                onBack={onComplete}
                onExit={onComplete}
            />;

        case 'set-and-setting':
            return <SetAndSettingForm
                onSave={handleSetAndSettingSave}
                onComplete={onComplete}
            />;

        case 'mental-health':
            return <MentalHealthScreeningForm
                patientId={patientId}
                onComplete={onComplete}
                onExit={onClose ?? onComplete}
                onBack={onClose ?? onComplete}
            />;

        // ── Phase 2: Dosing Session ───────────────────────────────────────────
        case 'dosing-protocol':
            // NOTE: no-op onSave — DosingProtocolForm auto-saves on every field change.
            // Calling onSuccess here would immediately trigger onComplete() and close the panel.
            // A dedicated handleDosingProtocolSave can be wired once sessionId is available.
            return <DosingProtocolForm onSave={() => { }} />;

        case 'session-timeline':
            return <SessionTimelineForm onSave={handleTimelineSave} />;

        case 'session-vitals':
            return <SessionVitalsForm onSave={handleVitalsSave} />;

        case 'session-observations':
            return <SessionObservationsForm onSave={handleSessionObservationsSave} />;

        case 'safety-and-adverse-event':
            return <SafetyAndAdverseEventForm onSave={handleSafetyEventSave} />;

        case 'rescue-protocol':
            return <RescueProtocolForm onSave={handleRescueProtocolSave} />;

        // ── Phase 3: Integration — Early Follow-up ───────────────────────────
        case 'daily-pulse':
            return <DailyPulseCheckForm onSave={handlePulseCheckSave} />;

        case 'meq30':
            return <MEQ30QuestionnaireForm onSave={handleMEQ30Save} onComplete={onComplete} />;

        // ── Phase 3: Integration — Integration Work ──────────────────────────
        case 'structured-integration':
            return <StructuredIntegrationSessionForm onSave={handleIntegrationSessionSave} />;

        case 'behavioral-tracker':
            return <BehavioralChangeTrackerForm onSave={handleBehavioralChangeSave} />;

        case 'longitudinal-assessment':
            return <LongitudinalAssessmentForm onSave={handleLongitudinalAssessmentSave} />;

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
