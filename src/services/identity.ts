/**
 * identity.ts — WO-206 Service Layer Isolation
 *
 * Responsible for: user/site identity resolution ONLY.
 * No other service may bypass this module for patient/site context.
 */

import { supabase } from '../supabaseClient';

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
