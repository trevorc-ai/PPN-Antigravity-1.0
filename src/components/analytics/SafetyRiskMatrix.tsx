import React from 'react';
import { supabase } from '../../supabaseClient';
import { useDataCache } from '../../hooks/useDataCache';
import { ShieldAlert, Info, BarChart2 } from 'lucide-react';
import { ChartSkeleton } from './ChartSkeleton';

/**
 * WO-678 — SafetyRiskMatrix (Live Data)
 *
 * Matrix: AE Type (Y axis) × CTCAE Grade (X axis).
 * Cell value = count of log_safety_events for this site matching that type + grade.
 * Bubble size scales with count. Minimum-n guard: < 10 AEs → suppressed state.
 *
 * Data source: log_safety_events joined with ref_safety_events for event type names.
 */

const MINIMUM_AE_THRESHOLD = 10;

interface AERow {
    ae_grade: number;       // ctcae_grade (1–5) — may be null, bucketed as 0 = Unknown
    event_type: string;     // safety_event_name from ref_safety_events (or "Unknown")
    count: number;
}

interface MatrixData {
    suppressed: boolean;
    totalAEs: number;
    rows: AERow[];
    aeTypes: string[];      // unique event type labels (Y axis)
}

function useRiskMatrixData(): MatrixData & { loading: boolean; error: string | null } {
    const { data, loading, error } = useDataCache(
        'safety-risk-matrix',
        async () => {
            try {
                // Resolve user → site_id
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return { data: null, error: 'Not authenticated' };

                const { data: userSite, error: siteError } = await supabase
                    .from('log_user_sites')
                    .select('site_id')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (siteError) throw siteError;
                if (!userSite) return { data: { suppressed: true, totalAEs: 0, rows: [], aeTypes: [] }, error: null };

                // Fetch safety events for this site with event type name via FK join
                const { data: events, error: eventsError } = await supabase
                    .from('log_safety_events')
                    .select('ctcae_grade, safety_event_type_id, ref_safety_events(safety_event_name)')
                    .eq('site_id', userSite.site_id);

                if (eventsError) throw eventsError;

                const rows = events || [];
                const totalAEs = rows.length;

                if (totalAEs < MINIMUM_AE_THRESHOLD) {
                    return { data: { suppressed: true, totalAEs, rows: [], aeTypes: [] }, error: null };
                }

                // Aggregate: AE type × CTCAE grade → count
                const countMap = new Map<string, number>();

                for (const row of rows) {
                    const grade: number = (row.ctcae_grade != null && row.ctcae_grade >= 1 && row.ctcae_grade <= 5)
                        ? row.ctcae_grade
                        : 0; // 0 = Grade unknown
                    const eventTypeRaw = (row as { ref_safety_events?: { safety_event_name?: string } }).ref_safety_events;
                    const eventType: string = eventTypeRaw?.safety_event_name ?? 'Unknown';
                    const key = `${eventType}||${grade}`;
                    countMap.set(key, (countMap.get(key) ?? 0) + 1);
                }

                const aggregated: AERow[] = [];
                const aeTypeSet = new Set<string>();

                countMap.forEach((count, key) => {
                    const [eventType, gradeStr] = key.split('||');
                    aeTypeSet.add(eventType);
                    aggregated.push({ ae_grade: Number(gradeStr), event_type: eventType, count });
                });

                // Sort AE types alphabetically for consistent axis ordering
                const aeTypes = Array.from(aeTypeSet).sort();

                return {
                    data: { suppressed: false, totalAEs, rows: aggregated, aeTypes },
                    error: null,
                };
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to load risk matrix';
                console.error('[SafetyRiskMatrix] query failed:', message); // allow-console
                return { data: { suppressed: true, totalAEs: 0, rows: [], aeTypes: [] }, error: message };
            }
        },
        { ttl: 5 * 60 * 1000 }
    );

    return {
        suppressed: data?.suppressed ?? true,
        totalAEs: data?.totalAEs ?? 0,
        rows: data?.rows ?? [],
        aeTypes: data?.aeTypes ?? [],
        loading,
        error: error ? String(error) : null,
    };
}

// ── Grade label map ────────────────────────────────────────────────────────────
const GRADE_LABELS: Record<number, { label: string; shortLabel: string; color: string }> = {
    0: { label: 'Unknown', shortLabel: '?',  color: 'bg-slate-700/60 border-slate-600 text-slate-500' },
    1: { label: 'Grade 1 — Mild',       shortLabel: 'G1', color: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' },
    2: { label: 'Grade 2 — Moderate',   shortLabel: 'G2', color: 'bg-amber-500/10 border-amber-500/30 text-amber-300' },
    3: { label: 'Grade 3 — Severe',     shortLabel: 'G3', color: 'bg-orange-500/15 border-orange-500/40 text-orange-300' },
    4: { label: 'Grade 4 — Life-Threatening', shortLabel: 'G4', color: 'bg-red-500/15 border-red-500/40 text-red-400' },
    5: { label: 'Grade 5 — Fatal',      shortLabel: 'G5', color: 'bg-red-700/20 border-red-600/60 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.15)]' },
};

const GRADE_COLUMNS = [1, 2, 3, 4, 5, 0]; // display order

const SafetyRiskMatrix: React.FC = () => {
    const { suppressed, totalAEs, rows, aeTypes, loading, error } = useRiskMatrixData();

    if (loading) {
        return (
            <div className="bg-[#0a0c10] border border-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-xl flex flex-col h-full">
                <ChartSkeleton height="280px" />
            </div>
        );
    }

    return (
        <div className="bg-[#0a0c10] border border-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-xl flex flex-col h-full relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                            <ShieldAlert size={18} />
                        </div>
                        <h3 className="ppn-card-title text-slate-300">Adverse Event Matrix</h3>
                    </div>
                    <p className="ppn-meta font-bold text-slate-500 uppercase tracking-widest ml-1">
                        Event Type × CTCAE Grade · Live Data
                    </p>
                </div>

                <div className="group/info relative">
                    <Info size={16} className="text-slate-600 hover:text-slate-300 transition-colors cursor-help" />
                    <div className="absolute right-0 top-6 w-60 p-3 bg-slate-900 border border-slate-700 rounded-xl ppn-meta text-slate-300 opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                        Matrix shows counts of logged adverse events by type and CTCAE severity grade
                        for your site. Requires ≥{MINIMUM_AE_THRESHOLD} AEs to display.
                    </div>
                </div>
            </div>

            {/* Suppressed / zero-state */}
            {(suppressed || error) && (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
                        <BarChart2 className="w-6 h-6 text-slate-500" />
                    </div>
                    {error ? (
                        <>
                            <h3 className="ppn-card-title text-slate-300 text-center">Unable to load data</h3>
                            <p className="ppn-body text-slate-500 text-center max-w-xs">{error}</p>
                        </>
                    ) : (
                        <>
                            <h3 className="ppn-card-title text-slate-300 text-center">
                                Insufficient adverse event data
                            </h3>
                            <p className="ppn-body text-slate-500 text-center max-w-xs">
                                Need {MINIMUM_AE_THRESHOLD} adverse events to render the risk matrix.
                                {totalAEs > 0 && (
                                    <> You currently have <strong className="text-slate-300">{totalAEs}</strong> logged.</>
                                )}
                            </p>
                        </>
                    )}
                </div>
            )}

            {/* Live matrix */}
            {!suppressed && !error && aeTypes.length > 0 && (
                <>
                    <div className="flex-1 w-full min-h-0 overflow-auto">
                        <div
                            className="grid gap-2"
                            style={{ gridTemplateColumns: `minmax(120px,1fr) repeat(${GRADE_COLUMNS.length}, minmax(44px,1fr))` }}
                        >
                            {/* Header row */}
                            <div className="flex items-end pb-1">
                                <span className="ppn-meta font-black text-slate-600 uppercase tracking-widest">
                                    AE Type
                                </span>
                            </div>
                            {GRADE_COLUMNS.map(grade => (
                                <div key={grade} className="flex items-end justify-center pb-1">
                                    <span
                                        className="ppn-meta font-black uppercase tracking-widest text-slate-500"
                                        title={GRADE_LABELS[grade].label}
                                    >
                                        {GRADE_LABELS[grade].shortLabel}
                                    </span>
                                </div>
                            ))}

                            {/* Data rows */}
                            {aeTypes.map(aeType => (
                                <React.Fragment key={aeType}>
                                    <div className="flex items-center pr-2">
                                        <span className="ppn-meta font-bold text-slate-400 truncate" title={aeType}>
                                            {aeType}
                                        </span>
                                    </div>
                                    {GRADE_COLUMNS.map(grade => {
                                        const cell = rows.find(r => r.event_type === aeType && r.ae_grade === grade);
                                        const count = cell?.count ?? 0;
                                        const gradeStyle = GRADE_LABELS[grade].color;
                                        return (
                                            <div key={grade} className="group/cell relative aspect-square">
                                                <div
                                                    className={`w-full h-full rounded-xl border flex items-center justify-center transition-all duration-200 ${
                                                        count > 0
                                                            ? gradeStyle + ' cursor-default'
                                                            : 'bg-slate-900/40 border-slate-800 text-slate-700'
                                                    }`}
                                                >
                                                    <span className="ppn-meta font-black">
                                                        {count > 0 ? count : '–'}
                                                    </span>
                                                </div>
                                                {count > 0 && (
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-3 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl opacity-0 group-hover/cell:opacity-100 transition-opacity pointer-events-none z-50">
                                                        <div className="flex items-center gap-2 mb-2 border-b border-slate-700/50 pb-2">
                                                            <div className={`size-1.5 rounded-full ${grade >= 4 ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
                                                            <span className="ppn-meta font-black text-slate-300 uppercase tracking-widest">
                                                                {aeType}
                                                            </span>
                                                        </div>
                                                        <p className="ppn-meta text-slate-400">
                                                            {count} event{count !== 1 ? 's' : ''} · {GRADE_LABELS[grade].label}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Legend footer */}
                    <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap justify-center gap-4">
                        {([5, 4, 3, 2, 1] as const).map(g => (
                            <div key={g} className="flex items-center gap-2">
                                <div className={`size-2 rounded-full border ${GRADE_LABELS[g].color.split(' ').filter(c => c.startsWith('bg-') || c.startsWith('border-'))[0] ?? ''}`} />
                                <span className="ppn-meta font-black text-slate-500 uppercase tracking-widest">
                                    {GRADE_LABELS[g].shortLabel} — {GRADE_LABELS[g].label.split(' — ')[1]}
                                </span>
                            </div>
                        ))}
                    </div>

                    <p className="ppn-meta text-slate-700 text-center mt-2">
                        Based on {totalAEs} adverse event{totalAEs !== 1 ? 's' : ''} · Live data
                    </p>
                </>
            )}
        </div>
    );
};

export default SafetyRiskMatrix;
