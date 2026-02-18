/**
 * Mock Data Hooks for Integration Batch Testing
 * 
 * These hooks mimic Supabase query patterns and can be swapped with real queries later.
 * Usage: Import from this file during development, swap to real Supabase hooks in production.
 */

import { useState, useEffect } from 'react';
import type {
    BaselineAssessment,
    SessionTimeline,
    VitalSignReading,
    LongitudinalAssessment,
    PulseCheck,
    PatientJourney
} from './types';
import { MOCK_JOURNEYS, generatePatientJourney } from './generators';

// ========== Configuration ==========

const USE_MOCK_DATA = true; // Set to false when real database is ready

// ========== WO-060: Baseline Assessment Hook ==========

export function useBaselineAssessment(sessionId: string) {
    const [data, setData] = useState<BaselineAssessment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (USE_MOCK_DATA) {
            // Simulate network delay
            setTimeout(() => {
                const journey = MOCK_JOURNEYS.success;
                setData(journey.baseline);
                setLoading(false);
            }, 300);
        } else {
            // TODO: Replace with real Supabase query
            // const { data, error } = await supabase
            //   .from('log_baseline_assessments')
            //   .select('*')
            //   .eq('session_id', sessionId)
            //   .single();
            setError(new Error('Real database not yet implemented'));
            setLoading(false);
        }
    }, [sessionId]);

    return { data, loading, error };
}

// ========== WO-061: Session Timeline Hook ==========

export function useSessionTimeline(sessionId: string) {
    const [data, setData] = useState<SessionTimeline | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (USE_MOCK_DATA) {
            setTimeout(() => {
                const journey = MOCK_JOURNEYS.success;
                setData(journey.timeline);
                setLoading(false);
            }, 300);
        } else {
            // TODO: Replace with real Supabase query
            // const { data, error } = await supabase
            //   .from('log_clinical_records')
            //   .select('*')
            //   .eq('session_id', sessionId)
            //   .single();
            setError(new Error('Real database not yet implemented'));
            setLoading(false);
        }
    }, [sessionId]);

    return { data, loading, error };
}

// ========== WO-062: Session Vitals Hook ==========

export function useSessionVitals(sessionId: string) {
    const [data, setData] = useState<VitalSignReading[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (USE_MOCK_DATA) {
            setTimeout(() => {
                const journey = MOCK_JOURNEYS.success;
                setData(journey.vitals);
                setLoading(false);
            }, 300);
        } else {
            // TODO: Replace with real Supabase query
            // const { data, error } = await supabase
            //   .from('log_session_vitals')
            //   .select('*')
            //   .eq('session_id', sessionId)
            //   .order('recorded_at', { ascending: true });
            setError(new Error('Real database not yet implemented'));
            setLoading(false);
        }
    }, [sessionId]);

    return { data, loading, error };
}

// ========== WO-063: Longitudinal Assessments Hook ==========

export function useLongitudinalAssessments(sessionId: string) {
    const [data, setData] = useState<LongitudinalAssessment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (USE_MOCK_DATA) {
            setTimeout(() => {
                const journey = MOCK_JOURNEYS.success;
                setData(journey.longitudinal);
                setLoading(false);
            }, 300);
        } else {
            // TODO: Replace with real Supabase query
            // const { data, error } = await supabase
            //   .from('log_longitudinal_assessments')
            //   .select('*')
            //   .eq('session_id', sessionId)
            //   .order('assessment_date', { ascending: true });
            setError(new Error('Real database not yet implemented'));
            setLoading(false);
        }
    }, [sessionId]);

    return { data, loading, error };
}

// ========== WO-064: Pulse Checks Hook ==========

export function usePulseChecks(sessionId: string, days: number = 30) {
    const [data, setData] = useState<PulseCheck[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (USE_MOCK_DATA) {
            setTimeout(() => {
                const journey = MOCK_JOURNEYS.success;
                // Filter to requested number of days
                const filtered = journey.pulseChecks.filter(
                    check => check.days_since_session <= days
                );
                setData(filtered);
                setLoading(false);
            }, 300);
        } else {
            // TODO: Replace with real Supabase query
            // const { data, error } = await supabase
            //   .from('log_pulse_checks')
            //   .select('*')
            //   .eq('session_id', sessionId)
            //   .lte('days_since_session', days)
            //   .order('check_date', { ascending: true });
            setError(new Error('Real database not yet implemented'));
            setLoading(false);
        }
    }, [sessionId, days]);

    return { data, loading, error };
}

// ========== Complete Patient Journey Hook ==========

export function usePatientJourney(
    patientId: string,
    sessionId: string,
    scenario: 'success' | 'moderate' | 'poor' | 'adverse-event' = 'success'
) {
    const [data, setData] = useState<PatientJourney | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (USE_MOCK_DATA) {
            setTimeout(() => {
                const journey = MOCK_JOURNEYS[scenario === 'adverse-event' ? 'adverseEvent' : scenario];
                setData(journey);
                setLoading(false);
            }, 500);
        } else {
            // TODO: Replace with real Supabase queries
            // Fetch all related data in parallel
            setError(new Error('Real database not yet implemented'));
            setLoading(false);
        }
    }, [patientId, sessionId, scenario]);

    return { data, loading, error };
}

// ========== Mutation Hooks (for saving data) ==========

export function useSaveBaselineAssessment() {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const save = async (assessment: Partial<BaselineAssessment>) => {
        setSaving(true);
        setError(null);

        if (USE_MOCK_DATA) {
            // Simulate save delay
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log('[MOCK] Saved baseline assessment:', assessment);
            setSaving(false);
            return { success: true };
        } else {
            // TODO: Replace with real Supabase mutation
            // const { error } = await supabase
            //   .from('log_baseline_assessments')
            //   .insert(assessment);
            setError(new Error('Real database not yet implemented'));
            setSaving(false);
            return { success: false, error };
        }
    };

    return { save, saving, error };
}

export function useSaveVitalSign() {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const save = async (vital: Partial<VitalSignReading>) => {
        setSaving(true);
        setError(null);

        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));
            console.log('[MOCK] Saved vital sign:', vital);
            setSaving(false);
            return { success: true };
        } else {
            // TODO: Replace with real Supabase mutation
            setError(new Error('Real database not yet implemented'));
            setSaving(false);
            return { success: false, error };
        }
    };

    return { save, saving, error };
}

export function useSavePulseCheck() {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const save = async (pulseCheck: Partial<PulseCheck>) => {
        setSaving(true);
        setError(null);

        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));
            console.log('[MOCK] Saved pulse check:', pulseCheck);
            setSaving(false);
            return { success: true };
        } else {
            // TODO: Replace with real Supabase mutation
            setError(new Error('Real database not yet implemented'));
            setSaving(false);
            return { success: false, error };
        }
    };

    return { save, saving, error };
}

// ========== Export Configuration ==========

export { USE_MOCK_DATA };
export { MOCK_JOURNEYS } from './generators';
