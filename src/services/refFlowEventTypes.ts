/**
 * refFlowEventTypes.ts — Resolve event_type_code to event_type_id from ref_flow_event_types.
 * Source of truth: public.ref_flow_event_types (id, event_type_code).
 * Used by timeline insert flow so the frontend uses stable codes, not hardcoded IDs.
 *
 * WO-584 fix:
 *  - Added 5-minute TTL to the module-level cache. Previously the cache was populated
 *    once at module load time and never invalidated, so tabs open before a DB migration
 *    would never see the new event type codes (e.g. patient_observation, music_change).
 *  - Added all session-level codes to FLOW_EVENT_TYPE_CODES so TypeScript accepts them.
 */

import { supabase } from '../supabaseClient';

const TABLE_REF = 'ref_flow_event_types';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let cache: Map<string, number> | null = null;
let cacheLoadedAt: number | null = null;

/**
 * Load ref_flow_event_types (id, event_type_code) and cache as code -> id.
 * Re-queries after CACHE_TTL_MS to pick up rows added by new DB migrations.
 */
async function loadRefFlowEventTypes(): Promise<Map<string, number>> {
    const now = Date.now();
    const isStale = cacheLoadedAt == null || now - cacheLoadedAt > CACHE_TTL_MS;

    if (cache && !isStale) return cache;

    const { data, error } = await supabase
        .from(TABLE_REF)
        .select('id, event_type_code')
        .eq('is_active', true);

    if (error) {
        console.error('[refFlowEventTypes] load error:', error.message, error.code);
        // On error: keep stale cache if we have one, otherwise return empty map.
        // Do NOT update cacheLoadedAt so we retry on next call.
        return cache ?? new Map();
    }

    const map = new Map<string, number>();
    for (const row of data ?? []) {
        const code = row.event_type_code;
        const id = row.id;
        if (code != null && id != null) map.set(String(code).trim(), Number(id));
    }
    cache = map;
    cacheLoadedAt = now;
    console.log('[refFlowEventTypes] loaded', map.size, 'event types:', [...map.keys()]);
    return map;
}

/**
 * Resolve event_type_code to event_type_id using ref_flow_event_types.
 * Returns null if the code is not found (caller should fail safely, not guess).
 */
export async function getEventTypeIdByCode(eventTypeCode: string): Promise<number | null> {
    if (!eventTypeCode || typeof eventTypeCode !== 'string') return null;
    const code = eventTypeCode.trim();
    const map = await loadRefFlowEventTypes();
    const id = map.get(code) ?? null;
    if (id == null) {
        console.warn(`[refFlowEventTypes] event_type_code '${code}' not found in ref_flow_event_types (${map.size} codes loaded).`);
    }
    return id;
}

/**
 * Force the cache to expire on next getEventTypeIdByCode call.
 * Call this after a DB seed/migration if you want immediate consistency without reload.
 */
export function invalidateRefFlowEventTypesCache(): void {
    cacheLoadedAt = null;
}

/** Canonical list of event_type_code values used in ref_flow_event_types. */
export const FLOW_EVENT_TYPE_CODES = [
    // Care funnel stage events
    'intake_started',
    'intake_completed',
    'consent_verified',
    'baseline_assessment_completed',
    'session_completed',
    'followup_assessment_completed',
    'integration_visit_completed',
    'treatment_paused',
    'treatment_discontinued',
    // Live session chip / logging events (seeded in migration 081)
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

export type FlowEventTypeCode = (typeof FLOW_EVENT_TYPE_CODES)[number];
