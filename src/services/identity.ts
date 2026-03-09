/**
 * identity.ts — WO-206 Service Layer Isolation
 * REWORK (failure_count: 1): Added generatePatientId() per INSPECTOR rejection.
 *
 * Responsible for: user/site identity resolution and canonical patient identity.
 * log_patient_site_links is the source of truth: (site_id, patient_link_code) -> patient_uuid.
 */

import { supabase } from '../supabaseClient';

const TABLE_PATIENT_SITE_LINKS = 'log_patient_site_links';

/**
 * Resolve or create the canonical patient UUID for a given (patient_link_code, site_id).
 * log_patient_site_links is the canonical bridge. If a row exists, returns its patient_uuid;
 * otherwise inserts a new row and returns the new patient_uuid.
 *
 * @param patientLinkCode - Readable PT- code (e.g. PT-XXXXXXXXXX)
 * @param siteId - UUID from getCurrentSiteId / practitioner site membership
 * @returns patient_uuid, or null if resolution/creation failed
 */
export async function getOrCreateCanonicalPatientUuid(
    patientLinkCode: string,
    siteId: string,
): Promise<string | null> {
    if (!patientLinkCode?.trim() || !siteId?.trim()) {
        console.warn('[identity] getOrCreateCanonicalPatientUuid: missing patient_link_code or site_id');
        return null;
    }
    const code = patientLinkCode.trim();

    console.log('[identity] getOrCreateCanonicalPatientUuid: resolving', { patient_link_code: code.substring(0, 14) + (code.length > 14 ? '…' : ''), site_id: siteId });

    const { data: existing, error: selectError } = await supabase
        .from(TABLE_PATIENT_SITE_LINKS)
        .select('patient_uuid')
        .eq('site_id', siteId)
        .eq('patient_link_code', code)
        .maybeSingle();

    if (selectError) {
        console.error('[identity] getOrCreateCanonicalPatientUuid select error:', {
            message: selectError.message,
            code: selectError.code,
            details: selectError.details,
        });
        return null;
    }

    if (existing?.patient_uuid) {
        console.log('[identity] getOrCreateCanonicalPatientUuid: found existing', { patient_uuid: existing.patient_uuid });
        return existing.patient_uuid as string;
    }

    const newPatientUuid = crypto.randomUUID();

    // Use upsert with ignoreDuplicates so a race condition or retry on the
    // same (site_id, patient_link_code) pair returns the existing row rather
    // than throwing. Requires the composite unique constraint
    // log_patient_site_links_site_patient_key (site_id, patient_link_code).
    const { data: inserted, error: insertError } = await supabase
        .from(TABLE_PATIENT_SITE_LINKS)
        .upsert(
            [{ patient_link_code: code, site_id: siteId, patient_uuid: newPatientUuid }],
            { onConflict: 'site_id,patient_link_code', ignoreDuplicates: true },
        )
        .select('patient_uuid')
        .single();

    if (insertError) {
        console.error('[identity] getOrCreateCanonicalPatientUuid upsert error:', {
            message: insertError.message,
            code: insertError.code,
            details: insertError.details,
            hint: (insertError as { hint?: string }).hint,
            remedy: 'Ensure log_patient_site_links has UNIQUE(site_id, patient_link_code) — apply 20260309020000_fix_patient_site_links_constraint.sql',
        });
        return null;
    }

    const resolved = (inserted?.patient_uuid ?? newPatientUuid) as string;
    console.log('[identity] getOrCreateCanonicalPatientUuid: created new', { patient_uuid: resolved });
    return resolved;
}

/**
 * Get the site_id UUID for the currently authenticated user.
 * Uses getSession() (local cache) rather than getUser() (network round-trip).
 * Returns null if user has no active site assignment.
 */
export async function getCurrentSiteId(): Promise<string | null> {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
        console.warn('[identity] No active session:', sessionError?.message);
        return null;
    }
    const userId = session.user.id;

    const { data, error } = await supabase
        .from('log_user_sites')
        .select('site_id')
        .eq('user_id', userId)
        .limit(1);

    if (error) {
        console.error('[identity] Failed to resolve site_id:', error);
        return null;
    }
    if (!data || data.length === 0) {
        console.warn('[identity] No site membership found for user:', userId);
        return null;
    }
    return data[0].site_id as string;
}

/**
 * Generate a new anonymous patient link code.
 * Format: PT-XXXXXXXXXX (10 chars from an unambiguous alphanumeric alphabet).
 * No PHI is embedded — this is a random anonymous identifier only.
 */
export function generatePatientId(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = 'PT-';
    for (let i = 0; i < 10; i++) id += chars[Math.floor(Math.random() * chars.length)];
    return id;
}
