import { supabase } from '../supabaseClient';
import { useDataCache } from './useDataCache';

/**
 * WO-681 — useProtocolEfficiencyData
 *
 * Derives protocol efficiency from live log_clinical_records and log_safety_events.
 *
 * Efficiency formula:
 *   sessions without any adverse event AND status = 'complete' / total non-draft sessions × 100
 *
 * Monthly trend: sessions grouped by YYYY-MM, each month gets its own efficiency %.
 * Minimum-n: < 5 total non-draft sessions → suppressed.
 */

export const EFFICIENCY_MIN_N = 5;

export interface MonthlyEfficiency {
    /** e.g. "Mar 2026" */
    month: string;
    /** YYYY-MM for sorting */
    monthKey: string;
    totalSessions: number;
    efficientSessions: number;
    /** 0–100 pct */
    efficiency: number;
}

export interface ProtocolEfficiencyData {
    suppressed: boolean;
    totalSessions: number;
    efficientSessions: number;
    /** Overall efficiency score 0–100 */
    overallEfficiency: number;
    /** Date range of data, "Jan 2025 – Mar 2026" */
    dateRange: string;
    /** Monthly trend, newest last */
    monthlyTrend: MonthlyEfficiency[];
}

export function useProtocolEfficiencyData(): ProtocolEfficiencyData & { loading: boolean; error: string | null } {
    const { data, loading, error } = useDataCache(
        'protocol-efficiency',
        async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return { data: null, error: 'Not authenticated' };

                const { data: userSite, error: siteError } = await supabase
                    .from('log_user_sites')
                    .select('site_id')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (siteError) throw siteError;
                if (!userSite) {
                    return { data: { suppressed: true, totalSessions: 0, efficientSessions: 0, overallEfficiency: 0, dateRange: '—', monthlyTrend: [] }, error: null };
                }

                // Fetch all non-draft sessions
                const { data: sessions, error: sessionsError } = await supabase
                    .from('log_clinical_records')
                    .select('id, session_status, session_date, created_at')
                    .eq('site_id', userSite.site_id)
                    .neq('session_status', 'draft')
                    .order('session_date', { ascending: true });

                if (sessionsError) throw sessionsError;

                const records = sessions || [];
                const totalSessions = records.length;

                if (totalSessions < EFFICIENCY_MIN_N) {
                    return { data: { suppressed: true, totalSessions, efficientSessions: 0, overallEfficiency: 0, dateRange: '—', monthlyTrend: [] }, error: null };
                }

                const sessionIds = records.map((r: { id: string }) => r.id);

                // Fetch all AE session_ids for this site
                const { data: aeRows, error: aeError } = await supabase
                    .from('log_safety_events')
                    .select('session_id')
                    .in('session_id', sessionIds);

                if (aeError) throw aeError;

                const sessionsWithAE = new Set(
                    (aeRows || []).map((r: { session_id: string }) => r.session_id)
                );

                // Efficient = completed + no AE
                const COMPLETE_STATUSES = new Set(['complete', 'completed', 'discharged']);
                const efficientSessions = records.filter((r: { id: string; session_status: string }) =>
                    COMPLETE_STATUSES.has(r.session_status.toLowerCase()) && !sessionsWithAE.has(r.id)
                ).length;

                const overallEfficiency = Math.round((efficientSessions / totalSessions) * 100);

                // Date range string
                const formatMonth = (dateStr: string) =>
                    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

                const firstDate = records[0].session_date ?? records[0].created_at;
                const lastDate = records[records.length - 1].session_date ?? records[records.length - 1].created_at;
                const dateRange = `${formatMonth(firstDate)} – ${formatMonth(lastDate)}`;

                // Monthly trend grouping
                const monthMap = new Map<string, { total: number; efficient: number }>();

                records.forEach((r: { id: string; session_status: string; session_date: string | null; created_at: string }) => {
                    const raw = r.session_date ?? r.created_at;
                    const key = raw.slice(0, 7); // YYYY-MM
                    const isEfficient = COMPLETE_STATUSES.has(r.session_status.toLowerCase()) && !sessionsWithAE.has(r.id);
                    const bucket = monthMap.get(key) ?? { total: 0, efficient: 0 };
                    bucket.total += 1;
                    if (isEfficient) bucket.efficient += 1;
                    monthMap.set(key, bucket);
                });

                const monthlyTrend: MonthlyEfficiency[] = Array.from(monthMap.entries())
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([key, { total, efficient }]) => ({
                        monthKey: key,
                        month: new Date(key + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                        totalSessions: total,
                        efficientSessions: efficient,
                        efficiency: Math.round((efficient / total) * 100),
                    }));

                return {
                    data: { suppressed: false, totalSessions, efficientSessions, overallEfficiency, dateRange, monthlyTrend },
                    error: null,
                };
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to load efficiency data';
                console.error('[useProtocolEfficiencyData] query failed:', message); // allow-console
                return { data: { suppressed: true, totalSessions: 0, efficientSessions: 0, overallEfficiency: 0, dateRange: '—', monthlyTrend: [] }, error: message };
            }
        },
        { ttl: 5 * 60 * 1000 }
    );

    return {
        suppressed: data?.suppressed ?? true,
        totalSessions: data?.totalSessions ?? 0,
        efficientSessions: data?.efficientSessions ?? 0,
        overallEfficiency: data?.overallEfficiency ?? 0,
        dateRange: data?.dateRange ?? '—',
        monthlyTrend: data?.monthlyTrend ?? [],
        loading,
        error: error ? String(error) : null,
    };
}
