/**
 * ActiveSessionsContext — Singleton poll for active dosing sessions.
 *
 * WHY: Without this, both TopHeader and ActiveSessionsWidget ran independent
 * 30/60-second polls against log_clinical_records, each also calling
 * supabase.auth.getUser() on every tick (a network auth call). This context
 * provides a single source of truth: one 60-second poll, zero auth network calls
 * (uses user from AuthContext), shared by all consumers.
 *
 * NOTE: Supabase Realtime is not yet enabled on this project. When it is,
 * replace the setInterval block with a postgres_changes subscription on
 * log_clinical_records filtered to created_by=eq.{user.id}.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

export interface ActiveSession {
    id: string;
    sessionLabel: string;
    substanceName: string;
    patientSex: string;
    patientAge: number | null;
    startedAt: string;
    patientLinkCodeHash: string;
}

interface ActiveSessionsContextType {
    sessions: ActiveSession[];
    loading: boolean;
    refresh: () => Promise<void>;
}

const ActiveSessionsContext = createContext<ActiveSessionsContextType>({
    sessions: [],
    loading: false,
    refresh: async () => {},
});

const POLL_INTERVAL_MS = 120_000; // 120-second poll (halved from 60s) — replace with Realtime when available

export const ActiveSessionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<ActiveSession[]>([]);
    const [loading, setLoading] = useState(false);
    const inFlightRef = useRef(false);

    const fetchActiveSessions = useCallback(async () => {
        // user comes from AuthContext — no network call needed
        if (!user) {
            setSessions([]);
            return;
        }
        if (inFlightRef.current) return; // deduplicate concurrent calls
        inFlightRef.current = true;

        try {
            setLoading(true);

            // Dead-session guard (Track 5 / stabilisation sprint): exclude sessions with no
            // session_ended_at that are older than 48 hours. These can only accumulate when
            // endDosingSession() fails silently (network error, FK issue). Without this filter
            // they persist forever in the active list and can never self-clear.
            // Strategy: require dose_administered_at to be within the last 48 hours OR
            // session_ended_at to be non-null (the latter is filtered out above by .is(null),
            // so we only need the age filter on the IS NULL branch).
            const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

            const { data, error: queryError } = await supabase
                .from('log_clinical_records')
                .select(`
                    id,
                    patient_sex_id,
                    patient_age_years,
                    dose_administered_at,
                    created_at,
                    patient_link_code_hash,
                    substance_id,
                    ref_substances ( substance_name ),
                    ref_sex ( sex_label )
                `)
                .is('session_ended_at', null)
                .gte('dose_administered_at', cutoff)   // dead-session guard: ignore sessions > 48h old
                .eq('created_by', user.id)
                .not('patient_link_code_hash', 'is', null)
                .order('dose_administered_at', { ascending: true, nullsFirst: false })
                .order('created_at', { ascending: true });

            if (queryError) {
                console.warn('[ActiveSessionsContext] Query failed:', queryError.message);
                return;
            }

            if (!data) return;

            const mapped: ActiveSession[] = data.map((row: any, index: number) => {
                const substanceName = row.ref_substances?.substance_name ?? 'Unknown Substance';
                const rawSex: string = row.ref_sex?.sex_label ?? '—';
                const patientSex =
                    rawSex === 'Male' ? 'M' :
                    rawSex === 'Female' ? 'F' :
                    rawSex === 'Intersex' ? 'I' :
                    rawSex === 'Unknown' ? '?' :
                    rawSex;

                return {
                    id: row.id,
                    sessionLabel: `Session ${index + 1}`,
                    substanceName,
                    patientSex,
                    patientAge: row.patient_age_years ?? null,
                    startedAt: row.dose_administered_at ?? row.created_at,
                    patientLinkCodeHash: row.patient_link_code_hash,
                };
            });

            setSessions(mapped);
        } catch (err) {
            console.warn('[ActiveSessionsContext] Unexpected error:', err);
        } finally {
            setLoading(false);
            inFlightRef.current = false;
        }
    }, [user]);

    // Initial fetch on auth state change
    useEffect(() => {
        fetchActiveSessions();
    }, [fetchActiveSessions]);

    // Single 60-second poll — all consumers share this one interval
    useEffect(() => {
        if (!user) return;
        const interval = setInterval(fetchActiveSessions, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [user, fetchActiveSessions]);

    return (
        <ActiveSessionsContext.Provider value={{ sessions, loading, refresh: fetchActiveSessions }}>
            {children}
        </ActiveSessionsContext.Provider>
    );
};

export const useActiveSessionsContext = () => useContext(ActiveSessionsContext);
