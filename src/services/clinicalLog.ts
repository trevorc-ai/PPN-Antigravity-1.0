/**
 * clinicalLog.ts — WO-206 Service Layer Isolation
 *
 * Responsible for: ALL log_ table writes (one function per form).
 * Every function wraps in try/catch — never throws to the caller.
 * Uses identity.ts for patient/site context.
 */

import { supabase } from '../supabaseClient';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface BaselineAssessmentData {
    patient_id: string;          // VARCHAR(10) — matches log_baseline_assessments.patient_id
    site_id: string;             // UUID — matches log_baseline_assessments.site_id
    expectancy_scale?: number;   // 1-100
    ace_score?: number;          // 0-10
    gad7_score?: number;         // 0-21
    phq9_score?: number;         // 0-27
    observation_ids?: number[];  // FK to ref_clinical_observations (PHI-safe)
}

export interface SessionEventData {
    session_id: string;             // UUID — log_clinical_records.id
    event_type: string;             // VARCHAR — matches log_safety_events.event_type
    meddra_code_id?: number;        // FK to ref_safety_events
    intervention_type_id?: number;
    severity_grade_id?: string;     // TEXT — matches log_safety_events.severity_grade_id
    is_resolved?: boolean;
}

export interface PulseCheckData {
    patient_id: string;          // VARCHAR(10) NOT NULL
    session_id?: string;         // UUID — optional FK to log_clinical_records.id
    check_date?: string;         // 'YYYY-MM-DD' — schema has DEFAULT CURRENT_DATE
    connection_level: number;    // 1-5
    sleep_quality: number;       // 1-5
    mood_level?: number;         // 1-5
    anxiety_level?: number;      // 1-5
}

export interface SessionVitalData {
    session_id: string;
    heart_rate?: number;
    hrv?: number;
    bp_systolic?: number;
    bp_diastolic?: number;
    oxygen_saturation?: number;
    respiratory_rate?: number;
    temperature?: number;
    diaphoresis_score?: number;      // 0-3
    level_of_consciousness?: string; // AVPU
    source?: string;
    device_id?: string;
    recorded_at?: string;
}

export interface TimelineEventData {
    session_id: string;
    event_timestamp: string;
    // Must match log_session_timeline_events.event_type CHECK constraint
    event_type?: 'dose_admin' | 'vital_check' | 'patient_observation' | 'clinical_decision' | 'music_change' | 'touch_consent' | 'safety_event' | 'other';
    event_type_id?: number;
    performed_by?: string;
    metadata?: Record<string, unknown>;
}


export interface IntegrationSessionData {
    patient_id: string;
    dosing_session_id?: string;
    integration_session_number: number;
    session_date: string;
    session_duration_minutes?: number;
    therapist_user_id?: string;
    attended?: boolean;
    insight_integration_rating?: number;
    emotional_processing_rating?: number;
    behavioral_application_rating?: number;
    engagement_level_rating?: number;
    session_focus_ids?: number[];
    homework_assigned_ids?: number[];
    therapist_observation_ids?: number[];
}

export interface BehavioralChangeData {
    patient_id: string;
    session_id?: string;
    change_date: string;
    // change_category removed — requires ref_behavioral_categories FK (ID only, no free text)
    change_type_ids?: number[];  // FK array to ref_behavioral_change_types
    // impact_on_wellbeing removed — requires ref_wellbeing_impact FK
    confidence_sustaining?: number;
    // related_to_dosing removed — requires ref table FK
    is_positive?: boolean;       // boolean — derived from UX selection, not free text
}

export interface LongitudinalAssessmentData {
    patient_id: string;
    session_id?: string;
    assessment_date: string;
    days_post_session?: number;
    phq9_score?: number;
    gad7_score?: number;
    whoqol_score?: number;
    psqi_score?: number;
    cssrs_score?: number;
}

export interface ConsentData {
    site_id: string;
    type: string;
    verified: boolean;
    verified_at?: string;
}

// ============================================================================
// SESSION CREATION
// ============================================================================

/**
 * Creates a stub log_clinical_records row at session start.
 * Returns the DB-generated UUID which must be used as sessionId for all
 * subsequent Phase 2 form writes (FK: log_session_vitals.session_id → log_clinical_records.id).
 *
 * We use patient_link_code for PHI-safe patient identification.
 * Substance, dosage etc. are filled in by the Dosing Protocol form.
 */
export async function createClinicalSession(
    patientId: string,
    siteId: string,
): Promise<{ success: boolean; sessionId?: string; error?: unknown }> {
    try {
        // Resolve the authenticated practitioner's UUID — required (NOT NULL) on log_clinical_records
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (!user) {
            console.error('[clinicalLog] createClinicalSession: no authenticated user', authError);
            return { success: false, error: authError ?? 'Not authenticated — cannot create session without practitioner UUID' };
        }

        const { data, error } = await supabase
            .from('log_clinical_records')
            .insert([{
                patient_link_code: patientId,
                site_id: siteId,
                practitioner_id: user.id,          // UUID FK — authenticated user ✅
                session_date: new Date().toISOString().split('T')[0],
                session_type: 'preparation',        // NOT NULL — set at creation; updated as session progresses
            }])
            .select('id')
            .single();

        if (error) throw error;
        return { success: true, sessionId: data?.id as string };
    } catch (error) {
        console.error('[clinicalLog] createClinicalSession:', error);
        return { success: false, error };
    }
}

// ============================================================================
// PHASE 1: PREPARATION
// ============================================================================

/** Creates a new baseline assessment for a patient. Maps to log_baseline_assessments. */
export async function createBaselineAssessment(data: BaselineAssessmentData) {
    try {
        const { data: result, error } = await supabase
            .from('log_baseline_assessments')
            .insert([{
                patient_id: data.patient_id,
                site_id: data.site_id,
                expectancy_scale: data.expectancy_scale,
                ace_score: data.ace_score,
                gad7_score: data.gad7_score,
                phq9_score: data.phq9_score,
                assessment_date: new Date().toISOString(),
            }])
            .select()
            .single();

        if (error) throw error;

        if (data.observation_ids && data.observation_ids.length > 0 && result) {
            const observations = data.observation_ids.map(obs_id => ({
                baseline_assessment_id: result.baseline_assessment_id,
                observation_id: obs_id,
            }));
            const { error: obsError } = await supabase
                .from('log_baseline_observations')
                .insert(observations);
            if (obsError) console.error('[clinicalLog] observation link (non-fatal):', obsError);
        }

        return { success: true, data: result };
    } catch (error) {
        console.error('[clinicalLog] createBaselineAssessment:', error);
        return { success: false, error };
    }
}

/**
 * Records consent verification. Inserts one row per consent event.
 * NOTE: consent type string removed — requires ref_consent_types table with numeric IDs.
 * Until that table exists, only verification timestamp and site are recorded.
 */
export async function createConsent(
    consentTypes: string[], // param kept for caller compatibility; count used for multi-insert
    siteId: string,
): Promise<{ success: boolean; error?: unknown }> {
    try {
        const now = new Date().toISOString();
        // One row per consent event — type field omitted until ref_consent_types FK exists
        const rows = consentTypes.map(() => ({
            verified: true,
            verified_at: now,
            site_id: siteId,
        }));
        const { error } = await supabase.from('log_consent').insert(rows);
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('[clinicalLog] createConsent:', error);
        return { success: false, error };
    }
}

// ============================================================================
// PHASE 2: SESSION LOGGER
// ============================================================================

/** Logs a safety/adverse event. Maps to log_safety_events. */
export async function createSessionEvent(data: SessionEventData) {
    try {
        const { data: result, error } = await supabase
            .from('log_safety_events')
            .insert([{
                ae_id: crypto.randomUUID(),
                session_id: data.session_id,
                // event_type (free text) removed — use meddra_code_id FK instead
                meddra_code_id: data.meddra_code_id,
                intervention_type_id: data.intervention_type_id,
                severity_grade_id: data.severity_grade_id,
                is_resolved: data.is_resolved ?? false,
            }])
            .select()
            .single();
        if (error) throw error;
        return { success: true, data: result };
    } catch (error) {
        console.error('[clinicalLog] createSessionEvent:', error);
        return { success: false, error };
    }
}

/** Records a vital sign reading. Maps to log_session_vitals. */
export async function createSessionVital(data: SessionVitalData) {
    try {
        const { data: result, error } = await supabase
            .from('log_session_vitals')
            .insert([{
                session_id: data.session_id,
                recorded_at: data.recorded_at ?? new Date().toISOString(),
                heart_rate: data.heart_rate,
                hrv: data.hrv,
                bp_systolic: data.bp_systolic,
                bp_diastolic: data.bp_diastolic,
                oxygen_saturation: data.oxygen_saturation,
                respiratory_rate: data.respiratory_rate,
                temperature: data.temperature,
                diaphoresis_score: data.diaphoresis_score,
                level_of_consciousness: data.level_of_consciousness,
                source: data.source,
                device_id: data.device_id,
            }])
            .select()
            .single();
        if (error) throw error;
        return { success: true, data: result };
    } catch (error) {
        console.error('[clinicalLog] createSessionVital:', error);
        return { success: false, error };
    }
}

/** Retrieves all vitals for a session. */
export async function getSessionVitals(sessionId: string) {
    try {
        const { data, error } = await supabase
            .from('log_session_vitals')
            .select('*')
            .eq('session_id', sessionId)
            .order('recorded_at', { ascending: false });
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('[clinicalLog] getSessionVitals:', error);
        return { success: false, error };
    }
}

/** Records a session observation from controlled vocabulary. Maps to log_session_observations. */
export async function createSessionObservation(sessionId: string, observationId: number) {
    try {
        const { data: result, error } = await supabase
            .from('log_session_observations')
            .insert([{ session_id: sessionId, observation_id: observationId }])
            .select()
            .single();
        if (error) throw error;
        return { success: true, data: result };
    } catch (error) {
        console.error('[clinicalLog] createSessionObservation:', error);
        return { success: false, error };
    }
}

// Valid values for log_session_timeline_events.event_type CHECK constraint
const VALID_TIMELINE_EVENT_TYPES = new Set([
    'dose_admin', 'vital_check', 'patient_observation',
    'clinical_decision', 'music_change', 'touch_consent',
    'safety_event', 'other',
]);

/** Records a timeline event. Maps to log_session_timeline_events. */
export async function createTimelineEvent(data: TimelineEventData) {
    // Resolve event_type string — must satisfy CHECK constraint in live schema.
    // Falls back to 'other' for any unrecognized value. event_type is NOT NULL.
    const resolvedEventType = (
        data.event_type && VALID_TIMELINE_EVENT_TYPES.has(data.event_type)
            ? data.event_type
            : 'other'
    );

    try {
        const { data: result, error } = await supabase
            .from('log_session_timeline_events')
            .insert([{
                session_id: data.session_id,
                event_timestamp: data.event_timestamp,
                event_type: resolvedEventType,               // NOT NULL CHECK ✅ — migration 066 DEFAULT 'other'
                event_type_id: data.event_type_id ?? null,  // INTEGER FK → ref_flow_event_types (optional)
                performed_by: data.performed_by ?? null,     // UUID FK → auth.users
                // metadata: intentionally omitted — no free-text JSON blobs in log tables
            }])
            .select()
            .single();
        if (error) throw error;
        return { success: true, data: result };
    } catch (error) {
        console.error('[clinicalLog] createTimelineEvent:', error);
        return { success: false, error };
    }
}

/** Retrieves historical timeline events for a given session. Maps to log_session_timeline_events. */
export async function getTimelineEvents(sessionId: string) {
    try {
        const { data, error } = await supabase
            .from('log_session_timeline_events')
            .select('*')
            .eq('session_id', sessionId)
            .order('event_timestamp', { ascending: false });
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('[clinicalLog] getTimelineEvents:', error);
        return { success: false, error };
    }
}

// ============================================================================
// PHASE 3: INTEGRATION TRACKER
// ============================================================================

/** Creates a daily pulse check entry. Maps to log_pulse_checks. */
export async function createPulseCheck(data: PulseCheckData) {
    try {
        const { data: result, error } = await supabase
            .from('log_pulse_checks')
            .insert([{
                patient_id: data.patient_id,
                session_id: data.session_id,
                check_date: data.check_date,
                connection_level: data.connection_level,
                sleep_quality: data.sleep_quality,
                mood_level: data.mood_level,
                anxiety_level: data.anxiety_level,
            }])
            .select()
            .single();
        if (error) throw error;
        return { success: true, data: result };
    } catch (error) {
        console.error('[clinicalLog] createPulseCheck:', error);
        return { success: false, error };
    }
}

/** Creates an integration session record. Maps to log_integration_sessions. */
export async function createIntegrationSession(data: IntegrationSessionData) {
    try {
        const { data: result, error } = await supabase
            .from('log_integration_sessions')
            .insert([{
                patient_id: data.patient_id,
                dosing_session_id: data.dosing_session_id,
                integration_session_number: data.integration_session_number,
                session_date: data.session_date,
                session_duration_minutes: data.session_duration_minutes,
                therapist_user_id: data.therapist_user_id,
                attended: data.attended ?? true,
                insight_integration_rating: data.insight_integration_rating,
                emotional_processing_rating: data.emotional_processing_rating,
                behavioral_application_rating: data.behavioral_application_rating,
                engagement_level_rating: data.engagement_level_rating,
                session_focus_ids: data.session_focus_ids,
                homework_assigned_ids: data.homework_assigned_ids,
                therapist_observation_ids: data.therapist_observation_ids,
            }])
            .select()
            .single();
        if (error) throw error;
        return { success: true, data: result };
    } catch (error) {
        console.error('[clinicalLog] createIntegrationSession:', error);
        return { success: false, error };
    }
}

/** Creates a behavioral change record. Maps to log_behavioral_changes. */
export async function createBehavioralChange(data: BehavioralChangeData) {
    // is_positive is a boolean derived from UI selection — acceptable
    const is_positive = data.is_positive ?? true;

    try {
        const { data: result, error } = await supabase
            .from('log_behavioral_changes')
            .insert([{
                patient_id: data.patient_id,
                session_id: data.session_id,
                change_date: data.change_date,
                // change_category removed — requires ref_behavioral_categories FK
                change_type_ids: data.change_type_ids, // FK array to ref_behavioral_change_types ✅
                // impact_on_wellbeing removed — requires ref_wellbeing_impact FK
                confidence_sustaining: data.confidence_sustaining, // numeric score ✅
                // related_to_dosing removed — requires ref table FK
                // change_type (legacy text) removed
                // change_description (legacy text) removed
                is_positive, // boolean ✅
            }])
            .select()
            .single();
        if (error) throw error;
        return { success: true, data: result };
    } catch (error) {
        console.error('[clinicalLog] createBehavioralChange:', error);
        return { success: false, error };
    }
}

/** Creates a longitudinal assessment record. Maps to log_longitudinal_assessments. */
export async function createLongitudinalAssessment(data: LongitudinalAssessmentData) {
    try {
        const { data: result, error } = await supabase
            .from('log_longitudinal_assessments')
            .insert([{
                patient_id: data.patient_id,
                session_id: data.session_id,
                assessment_date: data.assessment_date,
                days_post_session: data.days_post_session,
                phq9_score: data.phq9_score,
                gad7_score: data.gad7_score,
                whoqol_score: data.whoqol_score,
                psqi_score: data.psqi_score,
                cssrs_score: data.cssrs_score,
            }])
            .select()
            .single();
        if (error) throw error;
        return { success: true, data: result };
    } catch (error) {
        console.error('[clinicalLog] createLongitudinalAssessment:', error);
        return { success: false, error };
    }
}
