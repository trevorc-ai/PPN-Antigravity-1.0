/**
 * vocabulary.ts — WO-206 Service Layer Isolation
 *
 * Responsible for: ALL ref_ table reads with sessionStorage caching.
 * Cache key format: ppn_ref_[table_name]
 * TTL: 24 hours
 *
 * Never queries log_ tables. Never writes. Pure reads with caching.
 */

import { supabase } from '../supabaseClient';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry<T> {
    data: T;
    cachedAt: number;
}

function readCache<T>(key: string): T | null {
    try {
        const raw = sessionStorage.getItem(key);
        if (!raw) return null;
        const entry: CacheEntry<T> = JSON.parse(raw);
        if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
            sessionStorage.removeItem(key);
            return null;
        }
        return entry.data;
    } catch {
        return null;
    }
}

function writeCache<T>(key: string, data: T): void {
    try {
        const entry: CacheEntry<T> = { data, cachedAt: Date.now() };
        sessionStorage.setItem(key, JSON.stringify(entry));
    } catch {
        // sessionStorage may be unavailable (SSR / private mode) — silent fallback
    }
}

// ── Ref table types ──────────────────────────────────────────────────────────

export interface SessionFocusArea {
    focus_area_id: number;
    focus_label: string;
}

export interface HomeworkType {
    homework_type_id: number;
    homework_label: string;
}

export interface TherapistObservation {
    observation_type_id: number;
    observation_label: string;
}

export interface BehavioralChangeType {
    change_type_id: number;
    change_type_label: string;
    category: string;
}

// ── Cached loaders ───────────────────────────────────────────────────────────

/** Session focus area options for StructuredIntegrationSessionForm. */
export async function getSessionFocusAreas(): Promise<SessionFocusArea[]> {
    const cacheKey = 'ppn_ref_session_focus_areas';
    const cached = readCache<SessionFocusArea[]>(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
        .from('ref_session_focus_areas')
        .select('focus_area_id, focus_label')
        .eq('is_active', true)
        .order('focus_label');

    if (error) {
        console.error('[vocabulary] getSessionFocusAreas:', error);
        return [];
    }
    writeCache(cacheKey, data ?? []);
    return data ?? [];
}

/** Homework type options for StructuredIntegrationSessionForm. */
export async function getHomeworkTypes(): Promise<HomeworkType[]> {
    const cacheKey = 'ppn_ref_homework_types';
    const cached = readCache<HomeworkType[]>(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
        .from('ref_homework_types')
        .select('homework_type_id, homework_label')
        .eq('is_active', true)
        .order('homework_label');

    if (error) {
        console.error('[vocabulary] getHomeworkTypes:', error);
        return [];
    }
    writeCache(cacheKey, data ?? []);
    return data ?? [];
}

/** Therapist observation options for StructuredIntegrationSessionForm. */
export async function getTherapistObservations(): Promise<TherapistObservation[]> {
    const cacheKey = 'ppn_ref_therapist_observations';
    const cached = readCache<TherapistObservation[]>(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
        .from('ref_therapist_observations')
        .select('observation_type_id, observation_label')
        .eq('is_active', true)
        .order('observation_label');

    if (error) {
        console.error('[vocabulary] getTherapistObservations:', error);
        return [];
    }
    writeCache(cacheKey, data ?? []);
    return data ?? [];
}

/** Behavioral change type options for BehavioralChangeTrackerForm. */
export async function getBehavioralChangeTypes(category?: string): Promise<BehavioralChangeType[]> {
    const cacheKey = `ppn_ref_behavioral_change_types${category ? `_${category}` : ''}`;
    const cached = readCache<BehavioralChangeType[]>(cacheKey);
    if (cached) return cached;

    let query = supabase
        .from('ref_behavioral_change_types')
        .select('change_type_id, change_type_label, category')
        .eq('is_active', true)
        .order('change_type_label');

    if (category) query = query.eq('category', category);

    const { data, error } = await query;
    if (error) {
        console.error('[vocabulary] getBehavioralChangeTypes:', error);
        return [];
    }
    writeCache(cacheKey, data ?? []);
    return data ?? [];
}

/** Invalidate all ref_ caches — call after seeding or schema changes. */
export function invalidateVocabularyCache(): void {
    const keys = [
        'ppn_ref_session_focus_areas',
        'ppn_ref_homework_types',
        'ppn_ref_therapist_observations',
        'ppn_ref_behavioral_change_types',
    ];
    keys.forEach(k => sessionStorage.removeItem(k));
}
