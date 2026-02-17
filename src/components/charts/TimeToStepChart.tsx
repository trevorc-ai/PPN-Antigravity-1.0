import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { GlobalFilters } from '../analytics/GlobalFilterBar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface TimeToStepChartProps {
    filters: GlobalFilters;
    className?: string;
}

interface TransitionData {
    transition: string;
    medianDays: number;
    p75Days: number;
    nPatients: number;
    fromStage: number;
    toStage: number;
}

const TimeToStepChart: React.FC<TimeToStepChartProps> = ({ filters, className = '' }) => {
    const [data, setData] = useState<TransitionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTimeData();
    }, [filters]);

    const loadTimeData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Build query for v_flow_time_to_next_step
            let query = supabase
                .from('v_flow_time_to_next_step')
                .select('from_event_label, to_event_label, from_stage, to_stage, median_days, p75_days, n_patients');

            // Apply site filter
            if (filters.siteIds.length > 0) {
                query = query.in('site_id', filters.siteIds);
            }

            const { data: viewData, error: viewError } = await query.order('from_stage');

            if (viewError) throw viewError;

            if (!viewData || viewData.length === 0) {
                // No data from view - might be due to small-cell suppression or no data
                setData([]);
                return;
            }

            // Transform data for chart
            const transitions: TransitionData[] = viewData.map((row: any) => ({
                transition: `${row.from_event_label.split(' ')[0]} → ${row.to_event_label.split(' ')[0]}`,
                medianDays: Math.round(row.median_days * 10) / 10,
                p75Days: Math.round(row.p75_days * 10) / 10,
                nPatients: row.n_patients,
                fromStage: row.from_stage,
                toStage: row.to_stage
            }));

            setData(transitions);

        } catch (err: any) {
            console.error('Error loading time-to-step data:', err);
            setError(err.message || 'Failed to load time-to-step data');
        } finally {
            setLoading(false);
        }
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-[#0c0f16] border border-white/10 rounded-xl p-4 shadow-2xl">
                    <p className="text-sm font-black text-slate-300 mb-2">{data.transition}</p>
                    <div className="space-y-1">
                        <p className="text-xs text-slate-300">
                            <span className="font-bold text-primary">Median: {data.medianDays} days</span>
                        </p>
                        <p className="text-xs text-slate-300">
                            <span className="font-bold text-emerald-400">75th percentile: {data.p75Days} days</span>
                        </p>
                        <p className="text-xs text-slate-300">
                            Based on {data.nPatients} patient{data.nPatients !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Color based on speed (faster = green, slower = amber)
    const getBarColor = (days: number) => {
        if (days <= 3) return '#10b981'; // emerald-500 (fast)
        if (days <= 7) return '#3b82f6'; // blue-500 (normal)
        if (days <= 14) return '#f59e0b'; // amber-500 (slow)
        return '#ef4444'; // red-500 (very slow)
    };

    if (loading) {
        return (
            <div className={`card-glass rounded-3xl p-8 h-[500px] flex items-center justify-center ${className}`}>
                <div className="text-center space-y-4">
                    <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                    <p className="text-sm font-medium text-slate-300">Loading time-to-step data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`card-glass rounded-3xl p-8 h-[500px] flex items-center justify-center ${className}`}>
                <div className="text-center space-y-4">
                    <span className="material-symbols-outlined text-4xl text-red-400">error</span>
                    <div>
                        <p className="text-sm font-bold text-red-400 mb-1">Error Loading Data</p>
                        <p className="text-xs text-slate-300">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className={`card-glass rounded-3xl p-8 h-[500px] flex items-center justify-center ${className}`}>
                <div className="text-center space-y-4">
                    <span className="material-symbols-outlined text-6xl text-slate-600">schedule</span>
                    <div>
                        <p className="text-lg font-black text-slate-300 mb-2">No Data Available</p>
                        <p className="text-sm text-slate-300 max-w-md">
                            {filters.siteIds.length > 0
                                ? 'No transitions found for selected filters. Try adjusting your filters or note that small-cell suppression hides transitions with fewer than 10 patients.'
                                : 'No patient transitions found. This view requires at least 10 patients per transition.'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate average time across all transitions
    const avgMedianDays = data.reduce((sum, t) => sum + t.medianDays, 0) / data.length;

    return (
        <div className={`card-glass rounded-3xl p-8 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-3xl text-primary">schedule</span>
                    <div>
                        <h3 className="text-xl font-black text-slate-300">Time to Next Step</h3>
                        <p className="text-xs text-slate-300 font-medium">Median days between treatment stages</p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-[11px] font-black text-slate-3000 tracking-widest uppercase">Avg Median</p>
                    <p className="text-2xl font-black text-primary">{Math.round(avgMedianDays * 10) / 10} days</p>
                </div>
            </div>

            {/* Info Banner */}
            <div className="mb-4 px-4 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-indigo-400 text-xl">info</span>
                <div>
                    <p className="text-xs font-bold text-indigo-400 mb-1">Small-Cell Suppression Active</p>
                    <p className="text-xs text-slate-300">
                        Only showing transitions with ≥10 patients. Some transitions may be hidden to protect privacy.
                    </p>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 60, left: 5, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis
                            type="number"
                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                            label={{ value: 'Days', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                        />
                        <YAxis
                            type="category"
                            dataKey="transition"
                            width={150}
                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(43, 116, 243, 0.1)' }} />
                        <Bar dataKey="medianDays" radius={[0, 8, 8, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.medianDays)} />
                            ))}
                            <LabelList
                                dataKey="medianDays"
                                position="right"
                                formatter={(value: number) => `${value}d`}
                                style={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="mt-6 pt-6 border-t border-slate-800">
                <p className="text-[10px] font-black text-slate-3000 tracking-widest uppercase mb-3">Speed Indicators</p>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-emerald-500"></div>
                        <span className="text-xs text-slate-300 font-medium">≤3 days (Fast)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-slate-300 font-medium">4-7 days (Normal)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-amber-500"></div>
                        <span className="text-xs text-slate-300 font-medium">8-14 days (Slow)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-red-500"></div>
                        <span className="text-xs text-slate-300 font-medium">&gt;14 days (Very Slow)</span>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.map((transition) => (
                    <div key={`${transition.fromStage}-${transition.toStage}`} className="text-center p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                        <p className="text-[10px] font-black text-slate-3000 tracking-widest uppercase mb-1">
                            {transition.transition}
                        </p>
                        <p className="text-lg font-black text-slate-300">{transition.medianDays}d</p>
                        <p className="text-[10px] text-slate-300 font-medium">
                            P75: {transition.p75Days}d
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimeToStepChart;
