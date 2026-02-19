/**
 * Wellness Journey API Service
 *
 * Handles all database operations for the Wellness Journey clinical pipeline.
 * Fixed by WO-118 after live schema audit on 2026-02-18:
 *   - subject_id → patient_id (VARCHAR(10) per live schema)
 *   - site_id: number → string (UUID per live schema)
 *   - sessionId: number → string (UUID per log_clinical_records.id)
 *   - PulseCheckData corrected (removed 'notes', mapped check_in_date → check_date)
 *   - createSessionEvent fixed (ae_id TEXT PK required, event_type not event_type_id)
 *   - getCurrentSiteId() utility added
 *   - New API functions for all form types added
 */

import { supabase } from '../supabaseClient';

// ============================================================================
// AUTH UTILITIES
// ============================================================================

/**
 * Get the site_id UUID for the currently authenticated user.
 * Fetches from log_user_sites where user_id = auth.uid().
 * Returns null if user has no active site assignment.
 */
export async function getCurrentSiteId(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // NOTE: Do NOT filter by is_active — the PostgREST schema cache may not
    // include columns added after the initial schema load, causing HTTP 404.
    const { data, error } = await supabase
        .from('log_user_sites')
        .select('site_id')
        .eq('user_id', user.id)
        .limit(1);

    if (error) {
        console.error('[getCurrentSiteId] Failed to resolve site_id:', error);
        return null;
    }
    if (!data || data.length === 0) {
        console.warn('[getCurrentSiteId] No site membership found for user:', user.id);
        return null;
    }
    return data[0].site_id as string;
}


// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface BaselineAssessmentData {
    patient_id: string;       // VARCHAR(10) — matches log_baseline_assessments.patient_id
    site_id: string;          // UUID — matches log_baseline_assessments.site_id
    expectancy_scale?: number; // 1-100
    ace_score?: number;        // 0-10
    gad7_score?: number;       // 0-21
    phq9_score?: number;       // 0-27
    observation_ids?: number[]; // FK to ref_clinical_observations (PHI-safe)
}

export interface SessionEventData {
    session_id: string;         // UUID — log_clinical_records.id
    event_type: string;         // VARCHAR — matches log_safety_events.event_type
    meddra_code_id?: number;    // FK to ref_safety_events
    intervention_type_id?: number; // FK to ref intervention types
    severity_grade_id?: string; // TEXT — matches log_safety_events.severity_grade_id
    is_resolved?: boolean;
}

export interface PulseCheckData {
    patient_id: string;         // VARCHAR(10) NOT NULL — matches log_pulse_checks.patient_id
    session_id?: string;        // UUID — optional FK to log_clinical_records.id
    check_date?: string;        // DATE string 'YYYY-MM-DD' — schema has DEFAULT CURRENT_DATE
    connection_level: number;   // 1-5
    sleep_quality: number;      // 1-5
    mood_level?: number;        // 1-5
    anxiety_level?: number;     // 1-5
}

export interface SessionVitalData {
    session_id: string;           // UUID
    heart_rate?: number;
    hrv?: number;
    bp_systolic?: number;
    bp_diastolic?: number;
    oxygen_saturation?: number;   // maps to spo2 from the form
    respiratory_rate?: number;    // NEW — migration 054
    temperature?: number;         // NEW — migration 054
    diaphoresis_score?: number;   // NEW — migration 054 (0-3)
    level_of_consciousness?: string; // NEW — migration 054 (AVPU)
    source?: string;
    device_id?: string;
    recorded_at?: string;         // ISO timestamp
}

export interface TimelineEventData {
    session_id: string;           // UUID
    event_timestamp: string;      // ISO 8601
    event_type: string;           // constrained vocabulary
    event_type_id?: number;
    performed_by?: string;        // UUID of clinician
    metadata?: Record<string, unknown>;
}

export interface IntegrationSessionData {
    patient_id: string;                      // VARCHAR(10)
    dosing_session_id?: string;              // UUID
    integration_session_number: number;
    session_date: string;                    // 'YYYY-MM-DD'
    session_duration_minutes?: number;
    therapist_user_id?: string;              // UUID
    attended?: boolean;
    insight_integration_rating?: number;     // 1-5
    emotional_processing_rating?: number;    // 1-5
    behavioral_application_rating?: number;  // 1-5
    engagement_level_rating?: number;        // 1-5
    session_focus_ids?: number[];
    homework_assigned_ids?: number[];
    therapist_observation_ids?: number[];
}

export interface BehavioralChangeData {
    patient_id: string;                // VARCHAR(10)
    session_id?: string;               // UUID
    change_date: string;               // 'YYYY-MM-DD'
    change_category?: string;          // NEW structured column (migration 054)
    change_type_ids?: number[];        // NEW structured column (migration 054)
    impact_on_wellbeing?: string;      // NEW structured column (migration 054)
    confidence_sustaining?: number;    // NEW 1-5 (migration 054)
    related_to_dosing?: string;        // NEW (migration 054)
    // Legacy columns (kept for backward compat — BUILDER writes structured cols only)
    change_type?: string;              // VARCHAR NOT NULL — set to 'structured'
    change_description?: string;       // TEXT NOT NULL — set to JSON of change_type_ids
    is_positive?: boolean;             // BOOLEAN NOT NULL — derived from impact_on_wellbeing
}

export interface LongitudinalAssessmentData {
    patient_id: string;          // VARCHAR(10)
    session_id?: string;         // UUID
    assessment_date: string;     // 'YYYY-MM-DD'
    days_post_session?: number;
    phq9_score?: number;
    gad7_score?: number;
    whoqol_score?: number;
    psqi_score?: number;
    cssrs_score?: number;
}

export interface ConsentData {
    site_id: string;             // UUID
    type: string;                // one consent type per row
    verified: boolean;
    verified_at?: string;        // ISO timestamp
}

// ============================================================================
// PHASE 1: PREPARATION APIs
// ============================================================================

/**
 * Creates a new baseline assessment for a patient.
 * Maps to log_baseline_assessments.
 */
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

        // Link observation IDs if provided (PHI-safe controlled vocabulary)
        if (data.observation_ids && data.observation_ids.length > 0 && result) {
            const observations = data.observation_ids.map(obs_id => ({
                baseline_assessment_id: result.baseline_assessment_id,
                observation_id: obs_id,
            }));

            const { error: obsError } = await supabase
                .from('log_baseline_observations')
                .insert(observations);

            if (obsError) {
                console.error('Error linking observations (non-fatal):', obsError);
            }
        }

        return { success: true, data: result };
    } catch (error) {
        console.error('Error creating baseline assessment:', error);
        return { success: false, error };
    }
}

/**
 * Records one or more consent entries for a patient.
 * Inserts one row per consent type (log_consent.type).
 */
export async function createConsent(consentTypes: string[], siteId: string): Promise<{ success: boolean; error?: unknown }> {
    try {
        const now = new Date().toISOString();
        // log_consent.id is GENERATED ALWAYS AS IDENTITY — Postgres auto-generates it.
        // Do NOT provide id in the insert or it will throw a conflict error.
        const rows = consentTypes.map((type) => ({
            type,
            verified: true,
            verified_at: now,
            site_id: siteId,
        }));

        const { error } = await supabase
            .from('log_consent')
            .insert(rows);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error recording consent:', error);
        return { success: false, error };
    }
}

/**
 * Retrieves augmented intelligence predictions for a patient.
 * Calculates predicted integration needs based on baseline scores.
 */
export async function getAugmentedIntelligence(patientId: string) {
    try {
        const { data: baseline, error } = await supabase
            .from('log_baseline_assessments')
            .select('*')
            .eq('patient_id', patientId)
            .order('assessment_date', { ascending: false })
            .limit(1)
            .single();

        if (error) throw error;
        if (!baseline) {
            return { success: false, error: 'No baseline assessment found' };
        }

        const prediction = calculateIntegrationNeeds(baseline);
        return { success: true, data: prediction };
    } catch (error) {
        console.error('Error fetching augmented intelligence:', error);
        return { success: false, error };
    }
}

// ============================================================================
// PHASE 2: SESSION LOGGER APIs
// ============================================================================

/**
 * Logs a safety/adverse event for a session.
 * Maps to log_safety_events (ae_id TEXT PK — must be provided).
 */
export async function createSessionEvent(data: SessionEventData) {
    try {
        const { data: result, error } = await supabase
            .from('log_safety_events')
            .insert([{
                ae_id: crypto.randomUUID(),       // TEXT PK — no default in schema
                session_id: data.session_id,      // UUID
                event_type: data.event_type,      // VARCHAR (not event_type_id)
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
        console.error('Error creating session event:', error);
        return { success: false, error };
    }
}

/**
 * Records a vital sign reading for a session.
 * Maps to log_session_vitals (including WO-085 / migration 054 new columns).
 */
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
        console.error('Error creating session vital:', error);
        return { success: false, error };
    }
}

/**
 * Retrieves all vitals for a session.
 */
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
        console.error('Error fetching session vitals:', error);
        return { success: false, error };
    }
}

/**
 * Records a session observation (selected from controlled vocabulary).
 * Maps to log_session_observations.
 */
export async function createSessionObservation(sessionId: string, observationId: number) {
    try {
        const { data: result, error } = await supabase
            .from('log_session_observations')
            .insert([{
                session_id: sessionId,
                observation_id: observationId,
            }])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data: result };
    } catch (error) {
        console.error('Error recording session observation:', error);
        return { success: false, error };
    }
}

/**
 * Records a timeline event for a session.
 * Maps to log_session_timeline_events (created in migration 054 Part 6).
 */
export async function createTimelineEvent(data: TimelineEventData) {
    try {
        const { data: result, error } = await supabase
            .from('log_session_timeline_events')
            .insert([{
                session_id: data.session_id,
                event_timestamp: data.event_timestamp,
                event_type: data.event_type,
                event_type_id: data.event_type_id,
                performed_by: data.performed_by,
                metadata: data.metadata,
            }])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data: result };
    } catch (error) {
        console.error('Error creating timeline event:', error);
        return { success: false, error };
    }
}

// ============================================================================
// PHASE 3: INTEGRATION TRACKER APIs
// ============================================================================

/**
 * Creates a daily pulse check entry.
 * Maps to log_pulse_checks.
 * Note: check_date has DEFAULT CURRENT_DATE (migration 054) — safe to omit.
 * Note: form sends 'check_in_date' — caller maps to 'check_date'.
 */
export async function createPulseCheck(data: PulseCheckData) {
    try {
        const { data: result, error } = await supabase
            .from('log_pulse_checks')
            .insert([{
                patient_id: data.patient_id,
                session_id: data.session_id,
                check_date: data.check_date,     // schema column name (form sends check_in_date)
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
        console.error('Error creating pulse check:', error);
        return { success: false, error };
    }
}

/**
 * Creates a structured integration session record.
 * Maps to log_integration_sessions including migration 054 rating + FK array columns.
 */
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
        console.error('Error creating integration session:', error);
        return { success: false, error };
    }
}

/**
 * Creates a behavioral change record.
 * Maps to log_behavioral_changes.
 * Writes to NEW structured columns (migration 054) + satisfies legacy NOT NULL constraints.
 */
export async function createBehavioralChange(data: BehavioralChangeData) {
    // Derive legacy boolean from structured impact field
    const is_positive = data.impact_on_wellbeing
        ? data.impact_on_wellbeing.includes('positive')
        : true;

    // Satisfy legacy NOT NULL change_description with structured IDs
    const change_description = data.change_type_ids?.length
        ? JSON.stringify(data.change_type_ids)
        : 'structured';

    try {
        const { data: result, error } = await supabase
            .from('log_behavioral_changes')
            .insert([{
                patient_id: data.patient_id,
                session_id: data.session_id,
                change_date: data.change_date,
                // NEW structured columns (migration 054):
                change_category: data.change_category,
                change_type_ids: data.change_type_ids,
                impact_on_wellbeing: data.impact_on_wellbeing,
                confidence_sustaining: data.confidence_sustaining,
                related_to_dosing: data.related_to_dosing,
                // Legacy NOT NULL columns (required by schema):
                change_type: data.change_type ?? 'structured',
                change_description,
                is_positive,
            }])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data: result };
    } catch (error) {
        console.error('Error creating behavioral change:', error);
        return { success: false, error };
    }
}

/**
 * Creates a longitudinal assessment record.
 * Maps to log_longitudinal_assessments.
 */
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
        console.error('Error creating longitudinal assessment:', error);
        return { success: false, error };
    }
}

/**
 * Retrieves PHQ-9 + GAD-7 trajectory for symptom decay curve.
 * Maps to log_longitudinal_assessments (no assessment_scale_id column in live schema).
 */
export async function getSymptomTrajectory(patientId: string, days: number = 180) {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const startDateStr = startDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'

        const { data, error } = await supabase
            .from('log_longitudinal_assessments')
            .select('assessment_date, days_post_session, phq9_score, gad7_score, whoqol_score')
            .eq('patient_id', patientId)
            .gte('assessment_date', startDateStr)
            .order('assessment_date', { ascending: true });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching symptom trajectory:', error);
        return { success: false, error };
    }
}

// ============================================================================
// REFERENCE TABLE LOADERS
// ============================================================================

/** Fetch session focus area options for StructuredIntegrationSessionForm */
export async function getSessionFocusAreas() {
    const { data, error } = await supabase
        .from('ref_session_focus_areas')
        .select('focus_area_id, focus_label')
        .eq('is_active', true)
        .order('focus_label');
    return error ? [] : data;
}

/** Fetch homework type options for StructuredIntegrationSessionForm */
export async function getHomeworkTypes() {
    const { data, error } = await supabase
        .from('ref_homework_types')
        .select('homework_type_id, homework_label')
        .eq('is_active', true)
        .order('homework_label');
    return error ? [] : data;
}

/** Fetch therapist observation options for StructuredIntegrationSessionForm */
export async function getTherapistObservations() {
    const { data, error } = await supabase
        .from('ref_therapist_observations')
        .select('observation_type_id, observation_label')
        .eq('is_active', true)
        .order('observation_label');
    return error ? [] : data;
}

/** Fetch behavioral change type options for BehavioralChangeTrackerForm */
export async function getBehavioralChangeTypes(category?: string) {
    let query = supabase
        .from('ref_behavioral_change_types')
        .select('change_type_id, change_type_label, category')
        .eq('is_active', true)
        .order('change_type_label');
    if (category) query = query.eq('category', category);
    const { data, error } = await query;
    return error ? [] : data;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate predicted integration needs based on baseline scores.
 * ACE (0-10) 30% weight, GAD-7 (0-21) 25%, Expectancy (1-100 inverted) 20%, PHQ-9 (0-27) 25%.
 */
function calculateIntegrationNeeds(baseline: Record<string, number>) {
    const { ace_score = 0, gad7_score = 0, expectancy_scale = 50, phq9_score = 0 } = baseline;

    const aceRisk = (ace_score / 10) * 30;
    const gad7Risk = (gad7_score / 21) * 25;
    const expectancyRisk = ((100 - expectancy_scale) / 100) * 20;
    const phq9Risk = (phq9_score / 27) * 25;
    const totalRisk = aceRisk + gad7Risk + expectancyRisk + phq9Risk;

    let sessionCount: number;
    let riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    let schedule: string;
    let rationale: string;

    if (totalRisk < 25) {
        sessionCount = 4; riskLevel = 'low';
        schedule = 'Weekly for 1 month';
        rationale = 'Low baseline risk. Standard integration protocol recommended.';
    } else if (totalRisk < 50) {
        sessionCount = 8; riskLevel = 'moderate';
        schedule = 'Twice weekly for 1 month, then weekly for 1 month';
        rationale = 'Moderate baseline risk. Enhanced integration support recommended.';
    } else if (totalRisk < 75) {
        sessionCount = 12; riskLevel = 'high';
        schedule = 'Twice weekly for 2 months, then weekly for 2 months';
        rationale = 'High baseline risk. Intensive integration protocol recommended.';
    } else {
        sessionCount = 16; riskLevel = 'critical';
        schedule = 'Three times weekly for 1 month, then twice weekly for 2 months';
        rationale = 'Critical baseline risk. Maximum integration support required.';
    }

    return {
        sessionCount, riskLevel, schedule, rationale,
        riskScore: Math.round(totalRisk),
        breakdown: {
            aceRisk: Math.round(aceRisk),
            gad7Risk: Math.round(gad7Risk),
            expectancyRisk: Math.round(expectancyRisk),
            phq9Risk: Math.round(phq9Risk),
        },
    };
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function validateBaselineAssessment(data: BaselineAssessmentData): string | null {
    if (!data.patient_id) return 'Patient ID is required';
    if (!data.site_id) return 'Site ID is required';
    if (data.expectancy_scale !== undefined && (data.expectancy_scale < 1 || data.expectancy_scale > 100))
        return 'Expectancy scale must be 1-100';
    if (data.ace_score !== undefined && (data.ace_score < 0 || data.ace_score > 10))
        return 'ACE score must be 0-10';
    if (data.gad7_score !== undefined && (data.gad7_score < 0 || data.gad7_score > 21))
        return 'GAD-7 score must be 0-21';
    if (data.phq9_score !== undefined && (data.phq9_score < 0 || data.phq9_score > 27))
        return 'PHQ-9 score must be 0-27';
    return null;
}

export function validatePulseCheck(data: PulseCheckData): string | null {
    if (!data.patient_id) return 'Patient ID is required';
    if (data.connection_level < 1 || data.connection_level > 5) return 'Connection level must be 1-5';
    if (data.sleep_quality < 1 || data.sleep_quality > 5) return 'Sleep quality must be 1-5';
    return null;
}
