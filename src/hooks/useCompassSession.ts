import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// ─── Substance accent colors (WO-570 visual spec) ────────────────────────────
export type SubstanceCategory = 'psilocybin' | 'ketamine' | 'mdma' | 'ayahuasca' | 'unknown';

export const SUBSTANCE_ACCENT: Record<SubstanceCategory, string> = {
    psilocybin: '#2dd4bf', // teal
    ketamine: '#a78bfa', // violet
    mdma: '#fb7185', // rose
    ayahuasca: '#f59e0b', // gold
    unknown: '#2dd4bf', // teal default
};

export function getSubstanceCategory(name: string | null | undefined): SubstanceCategory {
    if (!name) return 'unknown';
    const n = name.toLowerCase();
    if (n.includes('psilocybin') || n.includes('mushroom') || n.includes('psilocybe')) return 'psilocybin';
    if (n.includes('ketamine') || n.includes('esketamine') || n.includes('spravato')) return 'ketamine';
    if (n.includes('mdma') || n.includes('3,4-methylenedioxymethamphetamine')) return 'mdma';
    if (n.includes('ayahuasca') || n.includes('dmt') || n.includes('harmaline')) return 'ayahuasca';
    return 'unknown';
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CompassSessionData {
    sessionId: string | undefined;
    sessionDate: string | null;       // ISO date string
    daysPostSession: number;           // 0 = day of session, 10 = ten days later
    substanceName: string | null;
    substanceCategory: SubstanceCategory;
    accentColor: string;
    doseMg: number | null;
    doseMgPerKg: number | null;
    patientUuid: string | null;
    indicationId: string | null;
    substanceId: string | null;
    isLoading: boolean;
    error: string | null;
}

export function useCompassSession(sessionId: string | undefined): CompassSessionData {
    const [state, setState] = useState<CompassSessionData>({
        sessionId,
        sessionDate: null,
        daysPostSession: 0,
        substanceName: null,
        substanceCategory: 'unknown',
        accentColor: SUBSTANCE_ACCENT.unknown,
        doseMg: null,
        doseMgPerKg: null,
        patientUuid: null,
        indicationId: null,
        substanceId: null,
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        if (!sessionId) {
            setState(s => ({ ...s, isLoading: false }));
            return;
        }

        let cancelled = false;
        const fetch = async () => {
            try {
                // Fetch session record
                const { data: session, error: sessErr } = await supabase
                    .from('log_clinical_records')
                    .select('session_date, patient_uuid, indication_id, created_at')
                    .eq('id', sessionId)
                    .single();

                if (sessErr) throw sessErr;

                // Fetch first dose event for this session
                const { data: doseRows } = await supabase
                    .from('log_dose_events')
                    .select('substance_id, dose_mg, dose_mg_per_kg')
                    .eq('session_id', sessionId)
                    .order('occurred_at', { ascending: true })
                    .limit(1);

                const dose = doseRows?.[0] ?? null;

                // Fetch substance name
                let substanceName: string | null = null;
                if (dose?.substance_id) {
                    const { data: sub } = await supabase
                        .from('ref_substances')
                        .select('name')
                        .eq('id', dose.substance_id)
                        .single();
                    substanceName = sub?.name ?? null;
                }

                const category = getSubstanceCategory(substanceName);
                const rawDate = session?.session_date ?? session?.created_at ?? null;
                const daysPostSession = rawDate
                    ? Math.max(0, Math.floor((Date.now() - new Date(rawDate).getTime()) / 86_400_000))
                    : 0;

                if (!cancelled) {
                    setState({
                        sessionId,
                        sessionDate: rawDate,
                        daysPostSession,
                        substanceName,
                        substanceCategory: category,
                        accentColor: SUBSTANCE_ACCENT[category],
                        doseMg: dose?.dose_mg ?? null,
                        doseMgPerKg: dose?.dose_mg_per_kg ?? null,
                        patientUuid: session?.patient_uuid ?? null,
                        indicationId: session?.indication_id ?? null,
                        substanceId: dose?.substance_id ?? null,
                        isLoading: false,
                        error: null,
                    });
                }
            } catch (err: any) {
                if (!cancelled) {
                    setState(s => ({ ...s, isLoading: false, error: err?.message ?? 'Load error' }));
                }
            }
        };

        fetch();
        return () => { cancelled = true; };
    }, [sessionId]);

    return state;
}
