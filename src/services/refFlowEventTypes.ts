/**
 * refFlowEventTypes.ts
 *
 * Provides FlowEventTypeCode type and getEventTypeIdByCode utility.
 * Resolves event_type_code → integer id via a live ref_flow_event_types lookup.
 * Results are cached in-memory for the session lifetime to avoid repeated DB hits.
 */

import { supabase } from '../supabaseClient';

// All 19 codes verified from ref_flow_event_types (staging 2026-03-10)
export type FlowEventTypeCode =
    | 'intake_started'
    | 'intake_completed'
    | 'consent_verified'
    | 'baseline_assessment_completed'
    | 'session_completed'
    | 'followup_assessment_completed'
    | 'integration_visit_completed'
    | 'treatment_paused'
    | 'treatment_discontinued'
    | 'dose_admin'
    | 'additional_dose'
    | 'vital_check'
    | 'patient_observation'
    | 'music_change'
    | 'clinical_decision'
    | 'general_note'
    | 'safety_event'
    | 'touch_consent'
    | 'session_update';

/** Runtime array of all valid flow event type codes — use with `new Set(FLOW_EVENT_TYPE_CODES)` for O(1) validation. */
export const FLOW_EVENT_TYPE_CODES: readonly FlowEventTypeCode[] = [
    'intake_started',
    'intake_completed',
    'consent_verified',
    'baseline_assessment_completed',
    'session_completed',
    'followup_assessment_completed',
    'integration_visit_completed',
    'treatment_paused',
    'treatment_discontinued',
    'dose_admin',
    'additional_dose',
    'vital_check',
    'patient_observation',
    'music_change',
    'clinical_decision',
    'general_note',
    'safety_event',
    'touch_consent',
    'session_update',
] as const;

// Session-lifetime cache: code → integer id
const codeToIdCache = new Map<string, number>();

/**
 * Resolves a flow event type code to its integer id in ref_flow_event_types.
 * Returns null if the code is not found — never guesses, never throws.
 */
export async function getEventTypeIdByCode(code: FlowEventTypeCode): Promise<number | null> {
    if (codeToIdCache.has(code)) return codeToIdCache.get(code)!;

    const { data, error } = await supabase
        .from('ref_flow_event_types')
        .select('id, event_type_code')
        .eq('event_type_code', code)
        .maybeSingle();

    if (error || !data) {
        console.warn('[refFlowEventTypes] getEventTypeIdByCode: no match for code', code);
        return null;
    }

    codeToIdCache.set(code, data.id);
    return data.id;
}
