import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export interface CompassTimelineEvent {
    occurredAt: string;        // ISO timestamp
    eventType: string;         // 'feeling' | 'companion_tap' | 'peak' | 'valley' | etc.
    label: string;
    intensity: number | null;  // 0–10 if provided
    minutesFromStart: number;  // computed relative to first event
}

export interface CompassTimelineData {
    events: CompassTimelineEvent[];
    sessionStartTime: string | null;
    sessionDurationMinutes: number;
    hasData: boolean;
    isLoading: boolean;
    error: string | null;
}

export function useCompassTimeline(sessionId: string | undefined): CompassTimelineData {
    const [state, setState] = useState<CompassTimelineData>({
        events: [],
        sessionStartTime: null,
        sessionDurationMinutes: 0,
        hasData: false,
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
                const { data: rows, error } = await supabase
                    .from('log_session_timeline_events')
                    .select('occurred_at, event_type, label, intensity')
                    .eq('session_id', sessionId)
                    .order('occurred_at', { ascending: true });

                if (error) throw error;

                const hasData = !!(rows && rows.length > 0);
                const startTime = hasData ? rows![0].occurred_at : null;
                const startMs = startTime ? new Date(startTime).getTime() : 0;

                const events: CompassTimelineEvent[] = hasData
                    ? rows!.map(r => ({
                        occurredAt: r.occurred_at,
                        eventType: r.event_type ?? 'event',
                        label: r.label ?? r.event_type ?? 'Event',
                        intensity: r.intensity ?? null,
                        minutesFromStart: Math.round((new Date(r.occurred_at).getTime() - startMs) / 60_000),
                    }))
                    : [];

                const lastMs = hasData ? new Date(rows![rows!.length - 1].occurred_at).getTime() : 0;
                const durationMinutes = hasData ? Math.round((lastMs - startMs) / 60_000) : 0;

                if (!cancelled) {
                    setState({
                        events,
                        sessionStartTime: startTime,
                        sessionDurationMinutes: Math.max(durationMinutes, 1),
                        hasData,
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
