/**
 * clinicalLog.ts — WO-206 Service Layer Isolation
 *
 * Responsible for: ALL log_ table writes (one function per form).
 * Every function wraps in try/catch — never throws to the caller.
 * Uses identity.ts for patient/site context and canonical patient_uuid resolution.
 */

import { supabase } from '../supabaseClient';
import { getOrCreateCanonicalPatientUuid } from './identity';
import { getEventTypeIdByCode, type FlowEventTypeCode } from './refFlowEventTypes';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/** Returns true only if s looks like a canonical UUID (8-4-4-4-12 hex). */
function isCanonicalUUID(s: string | null | undefined): boolean {
    if (s == null || typeof s !== 'string') return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s.trim());
}

export interface BaselineAssessmentData {
    patient_id: string;          // canonical patient_uuid (uuid)
    site_id: string;             // UUID — matches log_baseline_assessments.site_id
    expectancy_scale?: number;   // CHECK 1–100
    ace_score?: number;          // CHECK 0–10
    gad7_score?: number;         // CHECK 0–21
    phq9_score?: number;         // CHECK 0–27
    pcl5_score?: number;         // CHECK 0–80
    // observation_ids removed — log_baseline_observations deleted in rebuild
}

export interface SessionEventData {
    session_id: string;               // UUID — log_clinical_records.id
    site_id?: string;                 // UUID — log_safety_events.site_id
    event_type?: string;              // Display label — resolved to safety_event_type_id via live ref lookup
    safety_event_type_id?: number;    // FK → ref_safety_events.safety_event_id
    meddra_code_id?: number;          // FK → ref_meddra_codes
    intervention_type_id?: number;    // FK → ref_intervention_types
    severity_grade_id?: string;       // Grade label/number — resolved → severity_grade_id_fk (bigint) via live ref
    ctcae_grade?: number;             // CHECK 1–5
    causality_code?: string;          // ENUM: certain|probable|possible|unlikely|conditional|unclassifiable
    is_resolved?: boolean;
    resolved_at?: string;             // ISO timestamptz
    logged_by_user_id?: string;       // UUID — defaults to authed user if omitted
}

export interface PulseCheckData {
    patient_id: string;          // canonical patient_uuid (uuid) — log_pulse_checks.patient_uuid
    session_id?: string;         // UUID — optional FK to log_clinical_records.id
    check_date?: string;         // 'YYYY-MM-DD'
    connection_level: number;    // 1-5
    sleep_quality: number;       // 1-5
    mood_level?: number;         // 1-5
    anxiety_level?: number;      // 1-5
}

export interface SessionVitalData {
    session_id: string;
    heart_rate?: number;           // CHECK 40–200
    hrv?: number;
    bp_systolic?: number;          // CHECK 60–250
    bp_diastolic?: number;         // CHECK 40–150
    oxygen_saturation?: number;    // CHECK 70–100
    respiratory_rate?: number;     // CHECK 0–60
    temperature?: number;          // CHECK 85–115°F
    diaphoresis_score?: number;    // CHECK 0–3
    consciousness_level_code?: string;  // code → resolved to consciousness_level_id (int FK)
    data_source_code?: string;          // code → resolved to data_source_id (bigint FK)
    device_id?: string;
    recorded_at?: string;
}

export interface TimelineEventData {
    session_id: string;
    event_timestamp: string;
    /** Stable event_type_code from ref_flow_event_types; resolved to event_type_id at insert. Prefer over event_type_id. */
    event_type_code?: FlowEventTypeCode;
    /** When provided (e.g. from ref lookup), used directly. Otherwise event_type_code is resolved via ref_flow_event_types. */
    event_type_id?: number;
    performed_by?: string;
    metadata?: Record<string, unknown>;
}

export interface IntegrationSessionData {
    patient_id: string;              // canonical patient_uuid (uuid)
    dosing_session_id?: string;
    integration_session_number: number;
    session_date: string;
    session_duration_minutes?: number;
    therapist_user_id?: string;
    attendance_status_id?: number;        // FK → ref_attendance_statuses.id (integer)
    attendance_status_code?: string;      // Code resolved → attendance_status_id via live ref lookup
    insight_integration_rating?: number;  // CHECK 1–5
    emotional_processing_rating?: number; // CHECK 1–5
    behavioral_application_rating?: number; // CHECK 1–5
    engagement_level_rating?: number;     // CHECK 1–5
    session_focus_ids?: number[];         // FK array → ref_session_focus_areas, cardinality ≤ 10
    homework_assigned_ids?: number[];     // FK array → ref_homework_types, cardinality ≤ 10
    therapist_observation_ids?: number[]; // FK array → ref_therapist_observations, cardinality ≤ 10
}

export interface BehavioralChangeData {
    patient_id: string;              // canonical patient_uuid (uuid) — log_behavioral_changes.patient_uuid
    session_id?: string;
    change_date: string;
    change_type_ids?: number[];  // FK array → ref_behavioral_change_types
    confidence_sustaining?: number;
    is_positive?: boolean;
}

export interface LongitudinalAssessmentData {
    patient_id: string;
    session_id?: string;
    assessment_date: string;
    days_post_session?: number;
    phq9_score?: number;     // CHECK 0–27
    gad7_score?: number;     // CHECK 0–21
    cssrs_score?: number;    // CHECK 0–5
}

interface MEQ30ScoreData {
    patient_uuid: string;
    session_id: string;
    meq30_score: number;  // CHECK 0–150 (log_phase3_meq30); update log_clinical_records CHECK 0–100
}

interface SafetyScreenData {
    patient_uuid: string;
    session_id?: string;
    site_id: string;
    contraindication_verdict_id?: number;  // FK → ref_contraindication_verdicts.verdict_id
    ekg_rhythm_id?: number;                // FK → ref_ekg_rhythms.id
    concomitant_med_ids?: number[];        // NOT NULL DEFAULT '{}'
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

const TABLE_LOG_CLINICAL_RECORDS = 'log_clinical_records';

/**
 * Creates a stub log_clinical_records row at session start.
 * Resolves canonical patient_uuid via log_patient_site_links first, then inserts session with
 * practitioner_id, site_id, patient_link_code_hash, patient_uuid, session_date.
 * Returns sessionId and patientUuid for downstream use.
 */
export async function createClinicalSession(
    patientId: string,
    siteId: string,
): Promise<{ success: boolean; sessionId?: string; patientUuid?: string; error?: unknown }> {
    try {
        if (siteId == null || String(siteId).trim() === '') {
            const err = new Error('createClinicalSession: site_id is required — missing, null, or empty. Resolve site via getCurrentSiteId / log_user_sites before insert.');
            console.error('[clinicalLog]', err.message);
            return { success: false, error: err };
        }

        const patientUuid = await getOrCreateCanonicalPatientUuid(patientId, siteId);
        if (!patientUuid) {
            const err = new Error('createClinicalSession: could not resolve or create canonical patient_uuid for (patient_link_code, site_id). Check log_patient_site_links.');
            console.error('[clinicalLog]', err.message);
            return { success: false, error: err };
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (!user) {
            console.error('[clinicalLog] createClinicalSession: no authenticated user', authError);
            return { success: false, error: authError ?? 'Not authenticated — cannot create session without practitioner UUID' };
        }

        const payload: Record<string, unknown> = {
            practitioner_id: user.id,
            site_id: siteId,
            patient_link_code_hash: patientId || null,
            patient_uuid: patientUuid,
            session_date: new Date().toISOString().split('T')[0],
        };

        console.log('[clinicalLog] createClinicalSession insert:', {
            table: TABLE_LOG_CLINICAL_RECORDS,
            payload: { ...payload, patient_uuid: payload.patient_uuid },
        });

        const { data, error } = await supabase
            .from(TABLE_LOG_CLINICAL_RECORDS)
            .insert([payload])
            .select('id')
            .single();

        if (error) {
            const errShape = {
                table: TABLE_LOG_CLINICAL_RECORDS,
                message: (error as { message?: string }).message,
                code: (error as { code?: string }).code,
                details: (error as { details?: string }).details,
                hint: (error as { hint?: string }).hint,
                status: (error as { status?: number }).status,
                statusCode: (error as { statusCode?: number }).statusCode,
                fullError: error,
            };
            console.error('[clinicalLog] createClinicalSession Supabase error:', errShape);
            throw error;
        }
        return { success: true, sessionId: data?.id as string, patientUuid };
    } catch (error) {
        console.error('[clinicalLog] createClinicalSession:', error);
        return { success: false, error };
    }
}

// ─── Route normalisation map (LEAD WO-534) ───────────────────────────────────
const ROUTE_NORMALISE: Record<string, string | null> = {
    'Oral': 'Oral',
    'Sublingual': 'Sublingual',
    'Intramuscular (IM)': 'Intramuscular',
    'Intravenous (IV)': 'Intravenous',
    'Intranasal': 'Intranasal',
    'Insufflated': null,
    'Vaporized': null,
};

/**
 * WO-534: Parameter type for updateDosingProtocol — mirrors DosingProtocolData
 * from DosingProtocolForm without importing from the component layer.
 */
export interface DosingProtocolUpdateData {
    substance_id?: string;
    dosage_amount?: number;
    dosage_unit?: string;
    route_of_administration?: string;
}

/**
 * WO-534: Updates the existing stub log_clinical_records row with substance,
 * dosage, and route — data supplied by the Dosing Protocol form (Phase 2).
 *
 * Called by WellnessFormRouter on DosingProtocolForm save. Always use UPDATE
 * (not upsert) because createClinicalSession() always creates the stub first.
 *
 * @param sessionId  UUID of the existing log_clinical_records row
 * @param data       DosingProtocolData from the form
 */
export async function updateDosingProtocol(
    sessionId: string,
    data: {
        substance_id?: string;
        dosage_amount?: number;
        dosage_unit?: string;
        route_of_administration?: string;
    },
): Promise<{ success: boolean; error?: unknown }> {
    try {
        // A3: substance_id is integer in log_clinical_records. parseInt() returns a JS number;
        // Supabase sends it as a JSON number and Postgres accepts it for both integer and bigint columns.
        const substanceId = data.substance_id
            ? parseInt(data.substance_id, 10) || null
            : null;

        let routeId: number | null = null;
        const normalisedRoute = data.route_of_administration
            ? (ROUTE_NORMALISE[data.route_of_administration] ?? null)
            : null;

        if (normalisedRoute) {
            const { data: routeRow } = await supabase
                .from('ref_routes')
                .select('route_id')
                .eq('route_name', normalisedRoute)
                .single();
            routeId = routeRow?.route_id ?? null;
        }

        // Schema columns: substance_id, dosage_mg, route_id — rebuilt schema uses dosage_mg (not dosage_amount)
        // WO-592: Promote stub to 'active' the moment a substance is selected.
        // 'active' rows are counted by analytics; 'draft' rows are invisible to all reporting.
        const { error } = await supabase
            .from('log_clinical_records')
            .update({
                substance_id: substanceId,
                dosage_mg: data.dosage_amount ?? null,   // rebuilt schema: dosage_mg (was dosage_amount in old schema)
                route_id: routeId,
                session_status: 'active',                // WO-592: gate — stub becomes a real session
            })
            .eq('id', sessionId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('[clinicalLog] updateDosingProtocol:', error);
        return { success: false, error };
    }
}

// ============================================================================
// PHASE 1: PREPARATION
// ============================================================================

const TABLE_LOG_BASELINE_ASSESSMENTS = 'log_baseline_assessments';

/**
 * Creates a new baseline assessment. Maps to log_baseline_assessments.
 * Schema: patient_uuid (uuid), site_id (uuid), assessment_date, phq9_score, gad7_score, ace_score, expectancy_scale, etc.
 * No text column for patient link code exists; patient_uuid receives only real UUIDs. Link codes are never sent to UUID columns.
 */
export async function createBaselineAssessment(data: BaselineAssessmentData) {
    try {
        if (!isCanonicalUUID(data.site_id)) {
            const err = new Error('createBaselineAssessment: site_id must be a valid UUID. Got: ' + (data.site_id ?? 'missing'));
            console.error('[clinicalLog]', err.message);
            return { success: false, error: err };
        }

        if (!isCanonicalUUID(data.patient_id)) {
            const err = new Error(
                'Baseline save blocked: patient_uuid could not be resolved. log_baseline_assessments requires a canonical patient UUID; the current Wellness Journey identity model supplies only a patient link code (e.g. PT-XXXXXXXXXX). Unlinked baseline rows are not acceptable for data integrity.'
            );
            console.error('[clinicalLog] createBaselineAssessment:', err.message);
            return { success: false, error: err };
        }

        // Resolve authenticated user for created_by / completed_by_user_id
        const { data: { user } } = await supabase.auth.getUser();

        const payload: Record<string, unknown> = {
            site_id: data.site_id,
            patient_uuid: data.patient_id,
            assessment_date: new Date().toISOString(),
            expectancy_scale: data.expectancy_scale ?? null,
            ace_score: data.ace_score ?? null,           // CHECK 0–10
            gad7_score: data.gad7_score ?? null,         // CHECK 0–21
            phq9_score: data.phq9_score ?? null,         // CHECK 0–27
            pcl5_score: data.pcl5_score ?? null,         // CHECK 0–80
            completed_by_user_id: user?.id ?? null,      // FK → auth.users.id
            created_by: user?.id ?? null,
        };

        // NOTE: log_baseline_observations was deleted in schema rebuild — DO NOT write to it.

        console.log('[clinicalLog] createBaselineAssessment insert:', { table: TABLE_LOG_BASELINE_ASSESSMENTS, payload });

        const { data: result, error } = await supabase
            .from(TABLE_LOG_BASELINE_ASSESSMENTS)
            .insert([payload])
            .select()
            .single();

        if (error) {
            const errShape = {
                table: TABLE_LOG_BASELINE_ASSESSMENTS,
                message: (error as { message?: string }).message,
                code: (error as { code?: string }).code,
                details: (error as { details?: string }).details,
                hint: (error as { hint?: string }).hint,
                status: (error as { status?: number }).status,
                statusCode: (error as { statusCode?: number }).statusCode,
                fullError: error,
            };
            console.error('[clinicalLog] createBaselineAssessment Supabase error:', errShape);
            throw error;
        }

        return { success: true, data: result };
    } catch (error) {
        console.error('[clinicalLog] createBaselineAssessment:', error);
        return { success: false, error };
    }
}

/**
 * Records consent verification.
 * A2 FIX: Rewired from deleted 'log_consent' table → 'log_phase1_consent' (staging rebuild).
 *
 * Schema (log_phase1_consent):
 *   id bigint NOT NULL (no sequence — supplied via Date.now()),
 *   patient_uuid uuid NOT NULL,
 *   session_id uuid (optional),
 *   site_id uuid NOT NULL,
 *   consent_type_ids integer[] NOT NULL DEFAULT '{}',
 *   consented_at timestamptz NOT NULL DEFAULT now(),
 *   consented_by uuid
 *
 * Maps form string codes → ref_consent_types integer IDs (live DB confirmed).
 */
const CONSENT_TYPE_ID_MAP: Record<string, number> = {
    informed_consent: 1,
    data_use: 2,
    photography_recording: 3, // alias
    photo_video: 3,           // PHOTO_VIDEO in ref_consent_types
    research_participation: 4,
    emergency_contact: 5,
    hipaa_authorization: 6,
};

export async function createConsent(
    consentTypes: string[],
    siteId: string,
    patientUuid: string,
    sessionId?: string,
): Promise<{ success: boolean; error?: unknown }> {
    try {
        // Resolve authenticated user for consented_by
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (!user) {
            console.error('[clinicalLog] createConsent: no authenticated user', authError);
            return { success: false, error: authError ?? 'Not authenticated' };
        }

        // Map string codes → integer IDs, collect into one array
        const consentTypeIds: number[] = consentTypes
            .map(code => CONSENT_TYPE_ID_MAP[code.toLowerCase()])
            .filter((id): id is number => !!id);

        if (consentTypeIds.length === 0) {
            console.warn('[clinicalLog] createConsent: no valid consent type codes mapped — defaulting to [1] (INFORMED_CONSENT)');
            consentTypeIds.push(1);
        }

        // log_phase1_consent.id: GENERATED ALWAYS AS IDENTITY — do NOT supply a value.
        // Supplying id causes Postgres error 428C9 (cannot insert into GENERATED ALWAYS column).
        const payload = {
            patient_uuid: patientUuid,
            session_id: sessionId ?? null,
            site_id: siteId,
            consent_type_ids: consentTypeIds,
            consented_by: user.id,
        };

        console.log('[clinicalLog] createConsent insert:', { table: 'log_phase1_consent', payload: { ...payload, patient_uuid: '[redacted]' } });

        const { error } = await supabase.from('log_phase1_consent').insert([payload]);
        if (error) {
            console.error('[clinicalLog] createConsent DB error:', {
                message: (error as { message?: string }).message,
                code: (error as { code?: string }).code,
                details: (error as { details?: string }).details,
                hint: (error as { hint?: string }).hint,
                payload: { ...payload, patient_uuid: '[redacted]', consented_by: '[redacted]' },
            });
            throw error;
        }
        return { success: true };
    } catch (error) {
        console.error('[clinicalLog] createConsent:', error);
        return { success: false, error };
    }
}

// ============================================================================
// PHASE 2: SESSION LOGGER
// ============================================================================

/**
 * Resolves safety_event_type_id from label string via live ref_safety_events lookup.
 * Falls back to null if not found — never guesses.
 */
async function resolveSafetyEventTypeId(label: string): Promise<number | null> {
    const { data, error } = await supabase
        .from('ref_safety_events')
        .select('safety_event_id')
        .ilike('safety_event_name', label)
        .maybeSingle();
    if (error || !data) {
        console.warn('[clinicalLog] resolveSafetyEventTypeId: no match for', label);
        return null;
    }
    return data.safety_event_id;
}

/**
 * Resolves severity_grade_id_fk (bigint) from grade string via ref_severity_grade.
 * E.g. 'Grade 2' or '2' → bigint PK.
 */
async function resolveSeverityGradeId(grade: string | undefined): Promise<number | null> {
    if (!grade) return null;
    // Try numeric string first
    const numeric = parseInt(grade.replace(/\D/g, ''), 10);
    if (!isNaN(numeric)) {
        const { data } = await supabase
            .from('ref_severity_grade')
            .select('severity_grade_id')
            .eq('grade_number', numeric)
            .maybeSingle();
        if (data) return data.severity_grade_id;
    }
    // Fallback: label match
    const { data } = await supabase
        .from('ref_severity_grade')
        .select('severity_grade_id')
        .ilike('grade_label', `%${grade}%`)
        .maybeSingle();
    return data?.severity_grade_id ?? null;
}

/** Logs a safety/adverse event. Maps to log_safety_events. */
export async function createSessionEvent(data: SessionEventData) {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        // Resolve safety_event_type_id: prefer explicit ID, then live label lookup
        let safety_event_type_id: number | null = data.safety_event_type_id ?? null;
        if (!safety_event_type_id && data.event_type) {
            safety_event_type_id = await resolveSafetyEventTypeId(data.event_type);
        }

        // Resolve severity_grade_id_fk via live ref lookup (NOT hardcoded)
        const severity_grade_id_fk = await resolveSeverityGradeId(data.severity_grade_id);

        // log_safety_events columns (live schema verified 2026-03-08):
        // ae_id (text PK, NOT NULL), session_id, site_id, meddra_code_id, intervention_type_id,
        // severity_grade_id_fk (bigint), safety_event_type_id (bigint),
        // ctcae_grade (smallint CHECK 1–5), causality_code (ENUM), is_resolved, resolved_at,
        // logged_by_user_id, created_by
        // PHANTOM COLUMNS REMOVED: severity_grade_id, occurred_at
        const { data: result, error } = await supabase
            .from('log_safety_events')
            .insert([{
                ae_id: crypto.randomUUID(),
                session_id: data.session_id,
                site_id: data.site_id ?? null,
                safety_event_type_id,
                meddra_code_id: data.meddra_code_id ?? null,
                intervention_type_id: data.intervention_type_id ?? null,
                severity_grade_id_fk,                                      // bigint FK, NOT severity_grade_id
                ctcae_grade: data.ctcae_grade ?? null,                      // CHECK 1–5
                causality_code: data.causality_code ?? null,                // ENUM
                is_resolved: data.is_resolved ?? false,
                resolved_at: data.resolved_at ?? null,
                logged_by_user_id: data.logged_by_user_id ?? user?.id ?? null,
                created_by: user?.id ?? null,
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

/**
 * Resolves consciousness_level_id (int) from a code string via ref_consciousness_levels.
 * FK: log_session_vitals.consciousness_level_id → ref_consciousness_levels.id
 */
async function resolveConsciousnessLevelId(code: string): Promise<number | null> {
    const { data, error } = await supabase
        .from('ref_consciousness_levels')
        .select('id')
        .eq('code', code)
        .maybeSingle();
    if (error || !data) {
        console.warn('[clinicalLog] resolveConsciousnessLevelId: no match for code', code);
        return null;
    }
    return data.id;
}

/**
 * Resolves data_source_id (bigint) from a code string via ref_data_sources.
 * FK: log_session_vitals.data_source_id → ref_data_sources.data_source_id
 */
async function resolveDataSourceId(code: string): Promise<number | null> {
    const { data, error } = await supabase
        .from('ref_data_sources')
        .select('data_source_id')
        .eq('code', code)
        .maybeSingle();
    if (error || !data) {
        console.warn('[clinicalLog] resolveDataSourceId: no match for code', code);
        return null;
    }
    return data.data_source_id;
}

/**
 * Records a vital sign reading. Maps to log_session_vitals.
 *
 * Live schema (verified 2026-03-08):
 * - consciousness_level_id: integer FK → ref_consciousness_levels.id
 * - data_source_id: bigint FK → ref_data_sources.data_source_id
 * - PHANTOM COLUMNS REMOVED: level_of_consciousness, source
 * - Check constraints: heart_rate 40–200, bp_systolic 60–250, bp_diastolic 40–150,
 *   oxygen_saturation 70–100, respiratory_rate 0–60, temperature 85–115°F, diaphoresis_score 0–3
 */
export async function createSessionVital(data: SessionVitalData) {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        // Resolve FK IDs via live ref lookups
        const consciousness_level_id = data.consciousness_level_code
            ? await resolveConsciousnessLevelId(data.consciousness_level_code)
            : null;
        const data_source_id = data.data_source_code
            ? await resolveDataSourceId(data.data_source_code)
            : null;

        const { data: result, error } = await supabase
            .from('log_session_vitals')
            .insert([{
                session_id: data.session_id,
                recorded_at: data.recorded_at ?? new Date().toISOString(),
                heart_rate: data.heart_rate ?? null,
                hrv: data.hrv ?? null,
                bp_systolic: data.bp_systolic ?? null,
                bp_diastolic: data.bp_diastolic ?? null,
                oxygen_saturation: data.oxygen_saturation ?? null,
                respiratory_rate: data.respiratory_rate ?? null,
                temperature: data.temperature ?? null,
                diaphoresis_score: data.diaphoresis_score ?? null,
                consciousness_level_id,   // int FK via resolveConsciousnessLevelId()
                data_source_id,           // bigint FK via resolveDataSourceId()
                device_id: data.device_id ?? null,
                created_by: user?.id ?? null,
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

// createSessionObservation() REMOVED — log_session_observations table deleted in schema rebuild (2026-03-08).
// Any callers must be updated to remove this call.

/** Schema: log_session_timeline_events has event_type_id (integer). FK to ref_flow_event_types(id). No event_type column. */
const TABLE_LOG_SESSION_TIMELINE_EVENTS = 'log_session_timeline_events';

/**
 * Resolve event_type_id from TimelineEventData: use event_type_id if valid; else resolve event_type_code via ref_flow_event_types.
 * Fails (returns null) if event_type_code is provided but not found in ref — no guessing, no fallback.
 */
async function resolveTimelineEventTypeId(data: TimelineEventData): Promise<number | null> {
    if (data.event_type_id != null && Number.isInteger(data.event_type_id)) return data.event_type_id;
    if (data.event_type_code) return await getEventTypeIdByCode(data.event_type_code);
    return null;
}

/** Records a timeline event. Uses event_type_code -> ref_flow_event_types lookup. Fails safely if code not found. */
export async function createTimelineEvent(data: TimelineEventData) {
    try {
        const eventTypeId = await resolveTimelineEventTypeId(data);
        if (eventTypeId == null) {
            const msg = data.event_type_code
                ? `event_type_code '${data.event_type_code}' not found in ref_flow_event_types. Cannot insert timeline event.`
                : 'Timeline event requires event_type_code or event_type_id.';
            console.error('[clinicalLog] createTimelineEvent:', msg);
            return { success: false, error: new Error(msg) };
        }

        const payload: Record<string, unknown> = {
            session_id: data.session_id,
            event_timestamp: data.event_timestamp,
            event_type_id: eventTypeId,
            performed_by: data.performed_by ?? null,
            metadata: data.metadata ?? null,
        };

        console.log('[clinicalLog] createTimelineEvent insert:', { table: TABLE_LOG_SESSION_TIMELINE_EVENTS, payload });

        const { data: result, error } = await supabase
            .from(TABLE_LOG_SESSION_TIMELINE_EVENTS)
            .insert([payload])
            .select()
            .single();

        if (error) {
            const errShape = {
                table: TABLE_LOG_SESSION_TIMELINE_EVENTS,
                message: (error as { message?: string }).message,
                code: (error as { code?: string }).code,
                details: (error as { details?: string }).details,
                hint: (error as { hint?: string }).hint,
                status: (error as { status?: number }).status,
                statusCode: (error as { statusCode?: number }).statusCode,
                fullError: error,
            };
            console.error('[clinicalLog] createTimelineEvent Supabase error:', errShape);
            throw error;
        }
        return { success: true, data: result };
    } catch (error) {
        console.error('[clinicalLog] createTimelineEvent:', error);
        return { success: false, error };
    }
}

/** Retrieves historical timeline events for a given session. Maps to log_session_timeline_events.
 *  WO-584 fix: JOIN ref_flow_event_types to return event_type_code alongside each row,
 *  so LiveSessionTimeline can use it for color-coding. The event_type TEXT column was
 *  dropped in migration 079, leaving only event_type_id (integer FK).
 */
export async function getTimelineEvents(sessionId: string) {
    try {
        const { data, error } = await supabase
            .from('log_session_timeline_events')
            .select('*, ref_flow_event_types(event_type_code)')
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
        // Schema: patient_uuid (uuid), session_id, check_date, connection_level, sleep_quality, mood_level, anxiety_level
        // A4 FIX: patient_link_code_hash column removed in rebuild — now uses patient_uuid
        const { data: result, error } = await supabase
            .from('log_pulse_checks')
            .insert([{
                patient_uuid: data.patient_id,
                session_id: data.session_id ?? null,
                check_date: data.check_date ?? new Date().toISOString().split('T')[0],
                connection_level: data.connection_level,
                sleep_quality: data.sleep_quality,
                mood_level: data.mood_level ?? null,
                anxiety_level: data.anxiety_level ?? null,
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

/**
 * Resolves attendance_status_id (int) via live ref_attendance_statuses lookup.
 * FK: log_integration_sessions.attendance_status_id → ref_attendance_statuses.id
 */
async function resolveAttendanceStatusId(statusCode: string): Promise<number | null> {
    const { data, error } = await supabase
        .from('ref_attendance_statuses')
        .select('id')
        .eq('code', statusCode)
        .maybeSingle();
    if (error || !data) {
        console.warn('[clinicalLog] resolveAttendanceStatusId: no match for code', statusCode);
        return null;
    }
    return data.id;
}

/**
 * Creates an integration session record. Maps to log_integration_sessions.
 *
 * Live schema (verified 2026-03-08):
 * - attendance_status_id: integer FK → ref_attendance_statuses.id (replaces deleted 'attended' boolean)
 * - therapist_user_id: uuid FK → auth.users.id
 * - Array cardinality constraints: session_focus_ids ≤ 10, homework_assigned_ids ≤ 10,
 *   therapist_observation_ids ≤ 10
 * - Rating CHECK constraints: all rating fields 1–5
 */
export async function createIntegrationSession(data: IntegrationSessionData) {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        // Resolve attendance_status_id via live ref lookup
        let attendance_status_id: number | null = data.attendance_status_id ?? null;
        if (!attendance_status_id && data.attendance_status_code) {
            attendance_status_id = await resolveAttendanceStatusId(data.attendance_status_code);
        }

        // Enforce cardinality limits before insert (CHECK constraints in DB)
        const session_focus_ids = (data.session_focus_ids ?? []).slice(0, 10);
        const homework_assigned_ids = (data.homework_assigned_ids ?? []).slice(0, 10);
        const therapist_observation_ids = (data.therapist_observation_ids ?? []).slice(0, 10);

        const { data: result, error } = await supabase
            .from('log_integration_sessions')
            .insert([{
                patient_uuid: data.patient_id,
                dosing_session_id: data.dosing_session_id ?? null,
                integration_session_number: data.integration_session_number,
                session_date: data.session_date,
                session_duration_minutes: data.session_duration_minutes ?? null,
                therapist_user_id: data.therapist_user_id ?? user?.id ?? null,
                attendance_status_id,  // FK → ref_attendance_statuses.id
                insight_integration_rating: data.insight_integration_rating ?? null,
                emotional_processing_rating: data.emotional_processing_rating ?? null,
                behavioral_application_rating: data.behavioral_application_rating ?? null,
                engagement_level_rating: data.engagement_level_rating ?? null,
                session_focus_ids,
                homework_assigned_ids,
                therapist_observation_ids,
                created_by: user?.id ?? null,
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
    const is_positive = data.is_positive ?? true;

    try {
        // log_behavioral_changes (rebuilt schema):
        // patient_uuid (uuid), session_id, change_date, change_type_ids (ARRAY), confidence_sustaining, is_positive
        // A4 FIX: patient_link_code_hash → patient_uuid
        const { data: result, error } = await supabase
            .from('log_behavioral_changes')
            .insert([{
                patient_uuid: data.patient_id,
                session_id: data.session_id ?? null,
                change_date: data.change_date,
                change_type_ids: data.change_type_ids ?? null, // integer[] FK → ref_behavioral_change_types
                confidence_sustaining: data.confidence_sustaining ?? null,
                is_positive,
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

/**
 * Creates a longitudinal assessment record. Maps to log_longitudinal_assessments.
 *
 * Live schema (verified 2026-03-08):
 * - phq9_score CHECK 0–27, gad7_score CHECK 0–21, cssrs_score CHECK 0–5
 * - session_id FK → log_clinical_records.id, patient_uuid FK → log_patient_site_links.patient_uuid
 */
export async function createLongitudinalAssessment(data: LongitudinalAssessmentData) {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data: result, error } = await supabase
            .from('log_longitudinal_assessments')
            .insert([{
                patient_uuid: data.patient_id,
                session_id: data.session_id ?? null,
                assessment_date: data.assessment_date,
                days_post_session: data.days_post_session ?? null,
                phq9_score: data.phq9_score ?? null,     // CHECK 0–27
                gad7_score: data.gad7_score ?? null,     // CHECK 0–21
                cssrs_score: data.cssrs_score ?? null,   // CHECK 0–5
                created_by: user?.id ?? null,
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

// ============================================================================
// PHASE 3: NEW CLINICAL LOG FUNCTIONS
// ============================================================================

/**
 * Creates a MEQ-30 score record. Maps to log_phase3_meq30.
 *
 * Live schema (verified 2026-03-08):
 * - id: bigint NOT NULL, no sequence — supply Date.now()
 * - meq30_score: integer NOT NULL, CHECK 0–150
 * - Also updates denormalized log_clinical_records.meq30_score (CHECK 0–100 — clamp before update)
 * - patient_uuid FK → log_patient_site_links.patient_uuid
 * - session_id FK → log_clinical_records.id
 */
export async function createMEQ30Score(data: MEQ30ScoreData) {
    try {
        // Insert into authoritative log_phase3_meq30
        const { error: insertError } = await supabase
            .from('log_phase3_meq30')
            .insert([{
                id: Date.now(),                    // bigint NOT NULL — no sequence
                patient_uuid: data.patient_uuid,
                session_id: data.session_id,
                meq30_score: data.meq30_score,    // CHECK 0–150
            }]);
        if (insertError) throw insertError;

        // Update denormalized score on log_clinical_records (CHECK 0–100 — clamp)
        const denormalizedScore = Math.min(data.meq30_score, 100);
        const { error: updateError } = await supabase
            .from('log_clinical_records')
            .update({ meq30_score: denormalizedScore })
            .eq('id', data.session_id);
        if (updateError) {
            console.warn('[clinicalLog] createMEQ30Score: denormalized update failed (non-fatal)', updateError);
        }

        return { success: true };
    } catch (error) {
        console.error('[clinicalLog] createMEQ30Score:', error);
        return { success: false, error };
    }
}

/**
 * Creates a safety screen record. Maps to log_phase1_safety_screen.
 *
 * Live schema (verified 2026-03-08):
 * - id: bigint NOT NULL, no sequence — supply Date.now()
 * - patient_uuid, site_id: NOT NULL
 * - concomitant_med_ids: NOT NULL DEFAULT '{}'
 * - contraindication_verdict_id FK → ref_contraindication_verdicts.verdict_id
 * - ekg_rhythm_id FK → ref_ekg_rhythms.id
 * - session_id FK → log_clinical_records.id
 */
export async function createSafetyScreen(data: SafetyScreenData) {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase
            .from('log_phase1_safety_screen')
            .insert([{
                // id: GENERATED ALWAYS AS IDENTITY at DB level — do NOT supply
                patient_uuid: data.patient_uuid,
                session_id: data.session_id ?? null,
                site_id: data.site_id,
                contraindication_verdict_id: data.contraindication_verdict_id ?? null,
                ekg_rhythm_id: data.ekg_rhythm_id ?? null,
                concomitant_med_ids: data.concomitant_med_ids ?? [],
                screened_by: user?.id ?? null,
            }]);
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('[clinicalLog] createSafetyScreen:', error);
        return { success: false, error };
    }
}

// ============================================================================
// PATIENT PROFILE & INDICATION — new tables from schema rebuild (2026-03-08)
// ============================================================================

export interface PatientProfileData {
    patient_uuid: string;
    site_id: string;
    session_id?: string;
    /** Display label — resolved to sex_id FK via ref_sex */
    sex_label?: string;
    /** Age in years at intake */
    age_at_intake?: number;
    /** Display label — resolved to weight_range_id FK via ref_weight_ranges */
    weight_label?: string;
    /** Numeric weight in kg — used to resolve weight_range_id if no label match */
    weight_kg?: number;
    /** Display label — resolved to smoking_status_id FK via ref_smoking_status */
    smoking_label?: string;
    /** Protocol archetype: 'clinical' | 'ceremonial' | 'custom' */
    protocol_archetype?: string;
}

/**
 * Resolves sex_id (bigint) from a display label via ref_sex.
 * Labels expected: 'Male', 'Female', 'Non-binary', 'Prefer not to say'
 */
async function resolveSexId(label: string): Promise<number | null> {
    const { data, error } = await supabase
        .from('ref_sex')
        .select('sex_id')
        .ilike('sex_label', label.trim())
        .maybeSingle();
    if (error || !data) {
        console.warn('[clinicalLog] resolveSexId: no match for', label);
        return null;
    }
    return data.sex_id;
}

/**
 * Resolves smoking_status_id (bigint) from a display label via ref_smoking_status.
 * Labels expected: 'Non-smoker', 'Ex-smoker', 'Current smoker', 'Prefer not to say'
 */
async function resolveSmokingStatusId(label: string): Promise<number | null> {
    // ref_smoking_status uses 'status_name' (verified from REBUILT_Schema_STAGING_3-8-26.md line 687)
    const { data, error } = await supabase
        .from('ref_smoking_status')
        .select('smoking_status_id')
        .ilike('status_name', label.trim())
        .maybeSingle();
    if (error || !data) {
        console.warn('[clinicalLog] resolveSmokingStatusId: no match for', label, error?.message);
        return null;
    }
    return data.smoking_status_id;
}

/**
 * Resolves weight_range_id (bigint) from a numeric weight in kg via ref_weight_ranges.
 * Falls back to label match if kg lookup fails.
 */
async function resolveWeightRangeId(weightKg?: number, label?: string): Promise<number | null> {
    if (weightKg != null) {
        // ref_weight_ranges uses 'kg_low' and 'kg_high' (verified from REBUILT_Schema_STAGING_3-8-26.md lines 723-724)
        const { data, error } = await supabase
            .from('ref_weight_ranges')
            .select('id')
            .lte('kg_low', weightKg)
            .gte('kg_high', weightKg)
            .maybeSingle();
        if (!error && data) return data.id;
        console.warn('[clinicalLog] resolveWeightRangeId: range lookup failed for', weightKg, error?.message);
    }
    if (label) {
        const { data, error } = await supabase
            .from('ref_weight_ranges')
            .select('id')
            .ilike('range_label', `%${label.trim()}%`)
            .maybeSingle();
        if (!error && data) return data.id;
    }
    return null;
}

/**
 * Resolves protocol_archetype_id (bigint) via ref_protocol_archetypes.
 * Expected values: 'clinical', 'ceremonial', 'custom'
 */
async function resolveProtocolArchetypeId(archetype: string): Promise<number | null> {
    const { data, error } = await supabase
        .from('ref_protocol_archetypes')
        .select('id')
        .ilike('archetype_code', archetype.trim())
        .maybeSingle();
    if (error || !data) {
        console.warn('[clinicalLog] resolveProtocolArchetypeId: no match for', archetype);
        return null;
    }
    return data.id;
}

/**
 * Creates a patient demographic profile row. Maps to log_patient_profiles.
 * Called after createClinicalSession succeeds — patient_uuid is available at that point.
 *
 * All display labels are resolved to FK IDs via live ref lookups.
 * If a ref lookup returns null, the FK column is stored as null (not blocked).
 */
export async function createPatientProfile(
    data: PatientProfileData,
): Promise<{ success: boolean; error?: unknown }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        // Resolve FKs in parallel
        const [sex_id, smoking_status_id, weight_range_id, protocol_archetype_id] = await Promise.all([
            data.sex_label ? resolveSexId(data.sex_label) : Promise.resolve(null),
            data.smoking_label ? resolveSmokingStatusId(data.smoking_label) : Promise.resolve(null),
            resolveWeightRangeId(data.weight_kg, data.weight_label),
            data.protocol_archetype ? resolveProtocolArchetypeId(data.protocol_archetype) : Promise.resolve(null),
        ]);

        const payload = {
            patient_uuid: data.patient_uuid,
            site_id: data.site_id,
            // session_id: NOT a column in log_patient_profiles (verified from REBUILT_Schema_STAGING_3-8-26.md)
            sex_id,
            age_at_intake: data.age_at_intake ?? null,
            weight_range_id,
            smoking_status_id,
            protocol_archetype_id,
            created_by: user?.id ?? null,
        };

        console.log('[clinicalLog] createPatientProfile insert:', { table: 'log_patient_profiles', payload: { ...payload, patient_uuid: '[redacted]' } });

        const { error } = await supabase.from('log_patient_profiles').insert([payload]);
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('[clinicalLog] createPatientProfile:', error);
        return { success: false, error };
    }
}

export interface PatientIndicationData {
    patient_uuid: string;
    session_id?: string;
    /** Display label — resolved to indication_id FK via ref_indications */
    indication_label: string;
}

/**
 * Creates a patient indication row. Maps to log_patient_indications.
 * Called with the condition selected in ProtocolConfiguratorModal (Step 1).
 */
export async function createPatientIndication(
    data: PatientIndicationData,
): Promise<{ success: boolean; error?: unknown }> {
    try {
        // Resolve indication_id via ref_indications using a label/name match
        const { data: refRow, error: refError } = await supabase
            .from('ref_indications')
            .select('indication_id')
            .ilike('indication_name', `%${data.indication_label.trim()}%`)
            .maybeSingle();

        if (refError) {
            console.warn('[clinicalLog] createPatientIndication: ref lookup error', refError);
        }

        const indication_id = refRow?.indication_id ?? null;
        if (!indication_id) {
            console.warn('[clinicalLog] createPatientIndication: no ref match for label', data.indication_label, '— skipping insert to avoid null FK violation');
            return { success: false, error: `No indication_id found for: ${data.indication_label}` };
        }

        const { error } = await supabase.from('log_patient_indications').insert([{
            // id: GENERATED ALWAYS AS IDENTITY — do NOT supply (428C9 error if supplied)
            patient_uuid: data.patient_uuid,
            indication_id,
            is_primary: true,
        }]);
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('[clinicalLog] createPatientIndication:', error);
        return { success: false, error };
    }
}

export interface SetAndSettingLogData {
    patient_uuid: string;
    session_id: string;
    site_id: string;
    /** Resolved to mindset_type_id FK via ref_mindset_types (optional — UI may not capture yet) */
    mindset_type_label?: string;
    /** Resolved to session_setting_id FK via ref_session_settings (optional) */
    session_setting_label?: string;
    /** Resolved to intention_theme_ids int[] via ref_intention_themes */
    intention_theme_labels?: string[];
    /** Treatment expectancy score 1–100 (numeric, not a FK) */
    treatment_expectancy?: number;
}

/**
 * Creates a set-and-setting log row. Maps to log_phase1_set_and_setting.
 * Called on SetAndSettingForm save.
 *
 * Note: Current SetAndSettingForm captures treatment_expectancy (scalar) and
 * observations (free-text selections). The form does NOT yet expose mindset/setting
 * dropdown FKs. Those will be wired when the form is updated. For now this
 * function stores what's available (session linkage + expectancy in metadata).
 */
export async function createSetAndSettingLog(
    data: SetAndSettingLogData,
): Promise<{ success: boolean; error?: unknown }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        // Resolve optional FKs
        let mindset_type_id: number | null = null;
        let session_setting_id: number | null = null;
        let intention_theme_ids: number[] = [];

        if (data.mindset_type_label) {
            const { data: row } = await supabase
                .from('ref_mindset_types')
                .select('id')
                .ilike('type_label', data.mindset_type_label.trim())
                .maybeSingle();
            mindset_type_id = row?.id ?? null;
        }

        if (data.session_setting_label) {
            const { data: row } = await supabase
                .from('ref_session_settings')
                .select('id')
                .ilike('setting_label', data.session_setting_label.trim())
                .maybeSingle();
            session_setting_id = row?.id ?? null;
        }

        if (data.intention_theme_labels?.length) {
            const { data: rows } = await supabase
                .from('ref_intention_themes')
                .select('id')
                .in('theme_label', data.intention_theme_labels);
            intention_theme_ids = (rows ?? []).map((r: { id: number }) => r.id);
        }

        const { error } = await supabase.from('log_phase1_set_and_setting').insert([{
            // id: GENERATED ALWAYS AS IDENTITY — do NOT supply (428C9 error if supplied)
            patient_uuid: data.patient_uuid,
            session_id: data.session_id,
            site_id: data.site_id,
            mindset_type_id,
            session_setting_id,
            intention_theme_ids,
            // DB check constraint: treatment_expectancy >= 0 AND <= 10
            // SetAndSettingForm slider is 1-100, so scale it down to 0-10
            treatment_expectancy: data.treatment_expectancy != null
                ? Math.round(data.treatment_expectancy / 10)
                : null,
        }]);
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('[clinicalLog] createSetAndSettingLog:', error);
        return { success: false, error };
    }
}

// ============================================================================
// WO-577: Session State — End vs. Close-Out
// ============================================================================

/**
 * Marks the dosing phase as ended by writing session_ended_at = now().
 * Called when practitioner clicks "End Dosing Session" in Phase 2.
 * The Wellness Journey stays open — this is NOT the final closeout.
 */
export async function endDosingSession(sessionId: string): Promise<{ success: boolean; error?: unknown }> {
    try {
        const { error } = await supabase
            .from('log_clinical_records')
            .update({ session_ended_at: new Date().toISOString() })
            .eq('id', sessionId);
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('[clinicalLog] endDosingSession:', error);
        return { success: false, error };
    }
}

/**
 * Marks the full session as submitted/closed by writing is_submitted = true
 * and submitted_at = now(). Called from Phase 3 "Close Out Session".
 * After this call the caller should clear ACTIVE_SESSION_KEY from localStorage.
 */
export async function closeOutSession(sessionId: string): Promise<{ success: boolean; error?: unknown }> {
    try {
        const { error } = await supabase
            .from('log_clinical_records')
            .update({ is_submitted: true, submitted_at: new Date().toISOString() })
            .eq('id', sessionId);
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('[clinicalLog] closeOutSession:', error);
        return { success: false, error };
    }
}

// ============================================================================
// WO-578: Substance Context Fix
// ============================================================================

/**
 * Writes substance_id to log_clinical_records so Phase 2 HUD can resolve the
 * substance name on mount even after a page reload.
 */
export async function updateSessionSubstance(
    sessionId: string,
    substanceId: number | string,
): Promise<{ success: boolean; error?: unknown }> {
    try {
        const { error } = await supabase
            .from('log_clinical_records')
            .update({ substance_id: substanceId })
            .eq('id', sessionId);
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('[clinicalLog] updateSessionSubstance:', error);
        return { success: false, error };
    }
}
