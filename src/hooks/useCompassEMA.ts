import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export interface CompassEMAPoint {
    date: string;              // ISO date
    dayLabel: string;          // e.g. "Day 3"
    dayNumber: number;         // days post session
    moodLevel: number;         // 1–10
    sleepQuality: number;      // 1–10
    anxietyLevel: number;      // 1–10 (inverted on chart: lower is better)
    connectionLevel: number;   // 1–10
}

export interface CompassEMAData {
    points: CompassEMAPoint[];
    hasData: boolean;
    streak: number;            // consecutive days with a check-in
    isLoading: boolean;
    error: string | null;
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function useCompassEMA(
    sessionId: string | undefined,
    patientUuid: string | null | undefined,
    sessionDate: string | null | undefined
): CompassEMAData {
    const [state, setState] = useState<CompassEMAData>({
        points: [],
        hasData: false,
        streak: 0,
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
                    .from('log_pulse_checks')
                    .select('check_date, mood_level, sleep_quality, anxiety_level, connection_level, completed_at')
                    .eq('session_id', sessionId)
                    .order('check_date', { ascending: true });

                if (error) throw error;

                const hasData = !!(rows && rows.length > 0);
                const sessionMs = sessionDate ? new Date(sessionDate).getTime() : Date.now();

                const points: CompassEMAPoint[] = hasData
                    ? rows!.map(r => {
                        const dayMs = new Date(r.check_date).getTime();
                        const dayNumber = Math.max(0, Math.round((dayMs - sessionMs) / 86_400_000));
                        const d = new Date(r.check_date);
                        return {
                            date: r.check_date,
                            dayLabel: `Day ${dayNumber}`,
                            dayNumber,
                            moodLevel: r.mood_level ?? 5,
                            sleepQuality: r.sleep_quality ?? 5,
                            anxietyLevel: r.anxiety_level ?? 5,
                            connectionLevel: r.connection_level ?? 5,
                        };
                    })
                    : [];

                // Compute streak (consecutive days with check-ins ending today/yesterday)
                let streak = 0;
                if (hasData && rows) {
                    const today = new Date().toISOString().slice(0, 10);
                    const sortedDates = [...rows].map(r => r.check_date).sort().reverse();
                    let cursor = new Date(today);
                    for (const d of sortedDates) {
                        const dateStr = new Date(d).toISOString().slice(0, 10);
                        const expectedStr = cursor.toISOString().slice(0, 10);
                        if (dateStr === expectedStr) {
                            streak++;
                            cursor.setDate(cursor.getDate() - 1);
                        } else {
                            break;
                        }
                    }
                }

                if (!cancelled) {
                    setState({ points, hasData, streak, isLoading: false, error: null });
                }
            } catch (err: any) {
                if (!cancelled) {
                    setState(s => ({ ...s, isLoading: false, error: err?.message ?? 'Load error' }));
                }
            }
        };

        fetch();
        return () => { cancelled = true; };
    }, [sessionId, patientUuid, sessionDate]);

    return state;
}
