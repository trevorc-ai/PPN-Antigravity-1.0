import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export interface ActiveSession {
    id: string;                    // log_clinical_records PK (UUID)
    sessionLabel: string;          // "Session 1", "Session 2" — anonymous, ascending order
    substanceName: string;         // from ref_substances join
    patientSex: string;            // from ref_sex.sex_label
    patientAge: number | null;     // patient_age_years (INTEGER)
    startedAt: string;             // ISO timestamp — COALESCE(dose_administered_at, created_at)
    patientLinkCodeHash: string;   // For navigation only — never displayed
}

const POLL_INTERVAL_MS = 30_000; // 30-second refresh

export function useActiveSessions(isAuthenticated: boolean) {
    const [sessions, setSessions] = useState<ActiveSession[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchActiveSessions = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            setError(null);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Query: active dosing sessions owned by this practitioner
            // Active = session_ended_at IS NULL
            // Solo tier: created_by = auth.uid() only
            // Ordered by start time ASC → Session 1 = oldest
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
                .eq('created_by', user.id)
                .not('patient_link_code_hash', 'is', null)
                .order('dose_administered_at', { ascending: true, nullsFirst: false })
                .order('created_at', { ascending: true });

            if (queryError) {
                // Silently fail — active sessions are not critical path
                console.warn('[useActiveSessions] Query failed:', queryError.message);
                return;
            }

            if (!data) return;

            const mapped: ActiveSession[] = data.map((row: any, index: number) => {
                const substanceName =
                    row.ref_substances?.substance_name ??
                    'Unknown Substance';

                // ref_sex.sex_label — abbreviated for the pill card
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
                    // Server timestamp — timer is derived from this, never from client state
                    startedAt: row.dose_administered_at ?? row.created_at,
                    patientLinkCodeHash: row.patient_link_code_hash,
                };
            });

            setSessions(mapped);
        } catch (err) {
            console.warn('[useActiveSessions] Unexpected error:', err);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    // Initial fetch
    useEffect(() => {
        fetchActiveSessions();
    }, [fetchActiveSessions]);

    // 30-second poll to stay in sync with session ends from other tabs/devices
    useEffect(() => {
        if (!isAuthenticated) return;

        const interval = setInterval(fetchActiveSessions, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [isAuthenticated, fetchActiveSessions]);

    return { sessions, loading, error, refresh: fetchActiveSessions };
}
