import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { GlobalFilters } from '../analytics/GlobalFilterBar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface FunnelChartProps {
    filters: GlobalFilters;
    className?: string;
}

interface StageData {
    stage: string;
    patients: number;
    events: number;
    dropoffRate: number;
    stageOrder: number;
}

const FunnelChart: React.FC<FunnelChartProps> = ({ filters, className = '' }) => {
    const [data, setData] = useState<StageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPatients, setTotalPatients] = useState(0);

    useEffect(() => {
        loadFunnelData();
    }, [filters]);

    const loadFunnelData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Step 1: Get all event types with stage orders
            const { data: eventTypes, error: eventTypesError } = await supabase
                .from('ref_flow_event_types')
                .select('id, event_type_code, event_type_label, stage_order')
                .not('stage_order', 'is', null)
                .eq('is_active', true)
                .order('stage_order');

            if (eventTypesError) {
                console.error('FunnelChart: Error loading event types:', eventTypesError);
                throw eventTypesError;
            }

            if (!eventTypes || eventTypes.length === 0) {
                setData([]);
                setTotalPatients(0);
                return;
            }

            // Step 2: Get all patient flow events
            let eventsQuery = supabase
                .from('log_patient_flow_events')
                .select('event_type_id, patient_link_code_hash, event_at');

            // Apply date range filters if provided
            if (filters.dateRange.start) {
                eventsQuery = eventsQuery.gte('event_at', filters.dateRange.start);
            }

            if (filters.dateRange.end) {
                eventsQuery = eventsQuery.lte('event_at', filters.dateRange.end);
            }

            const { data: events, error: eventsError } = await eventsQuery;

            if (eventsError) {
                console.error('FunnelChart: Error loading events:', eventsError);
                throw eventsError;
            }

            if (!events || events.length === 0) {
                setData([]);
                setTotalPatients(0);
                return;
            }

            // Step 3: Create a map of event_type_id to event type info
            const eventTypeMap = new Map(
                eventTypes.map(et => [et.id, {
                    code: et.event_type_code,
                    label: et.event_type_label,
                    stageOrder: et.stage_order
                }])
            );

            // Step 4: Aggregate events by stage
            const stageMap = new Map<number, { label: string; code: string; patients: Set<string>; events: number }>();

            events.forEach((event: any) => {
                const eventType = eventTypeMap.get(event.event_type_id);
                if (eventType && eventType.stageOrder !== null) {
                    const order = eventType.stageOrder;
                    if (!stageMap.has(order)) {
                        stageMap.set(order, {
                            label: eventType.label,
                            code: eventType.code,
                            patients: new Set(),
                            events: 0
                        });
                    }
                    const stage = stageMap.get(order)!;
                    stage.patients.add(event.patient_link_code_hash);
                    stage.events += 1;
                }
            });

            // Step 5: Build funnel data
            const stages: StageData[] = [];
            let previousPatients = 0;

            // Sort by stage order
            const sortedStages = Array.from(stageMap.entries()).sort((a, b) => a[0] - b[0]);

            sortedStages.forEach(([order, stageInfo], index) => {
                const patientCount = stageInfo.patients.size;
                const dropoffRate = index === 0 ? 0 : ((previousPatients - patientCount) / previousPatients) * 100;

                stages.push({
                    stage: stageInfo.label,
                    patients: patientCount,
                    events: stageInfo.events,
                    dropoffRate: Math.round(dropoffRate * 10) / 10,
                    stageOrder: order
                });

                previousPatients = patientCount;
            });

            setData(stages);
            setTotalPatients(stages[0]?.patients || 0);

        } catch (err: any) {
            console.error('FunnelChart: Error loading funnel data:', err);
            setError(err.message || 'Failed to load funnel data');
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
                    <p className="text-sm font-black text-white mb-2">{data.stage}</p>
                    <div className="space-y-1">
                        <p className="text-xs text-slate-300">
                            <span className="font-bold text-primary">{data.patients.toLocaleString()}</span> unique patients
                        </p>
                        <p className="text-xs text-slate-300">
                            <span className="font-bold text-emerald-400">{data.events.toLocaleString()}</span> total events
                        </p>
                        {data.dropoffRate > 0 && (
                            <p className="text-xs text-red-400">
                                <span className="font-bold">{data.dropoffRate}%</span> dropout from previous
                            </p>
                        )}
                        {totalPatients > 0 && (
                            <p className="text-xs text-slate-400">
                                {Math.round((data.patients / totalPatients) * 100)}% of initial cohort
                            </p>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    // Color gradient for funnel (darker as patients drop off)
    const getBarColor = (index: number, total: number) => {
        const colors = [
            '#2b74f3', // Primary blue
            '#3b82f6', // Lighter blue
            '#60a5fa', // Even lighter
            '#93c5fd', // Light blue
            '#bfdbfe'  // Very light blue
        ];
        return colors[Math.min(index, colors.length - 1)];
    };

    if (loading) {
        return (
            <div className={`card-glass rounded-3xl p-8 h-[500px] flex items-center justify-center ${className}`}>
                <div className="text-center space-y-4">
                    <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                    <p className="text-sm font-medium text-slate-400">Loading funnel data...</p>
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
                        <p className="text-xs text-slate-400">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className={`card-glass rounded-3xl p-8 h-[500px] flex items-center justify-center ${className}`}>
                <div className="text-center space-y-4">
                    <span className="material-symbols-outlined text-6xl text-slate-600">waterfall_chart</span>
                    <div>
                        <p className="text-lg font-black text-white mb-2">No Data Available</p>
                        <p className="text-sm text-slate-400">
                            {filters.siteIds.length > 0 || filters.dateRange.start || filters.substanceIds.length > 0
                                ? 'Try adjusting your filters'
                                : 'No patient flow events found'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Check for small-cell suppression
    const hasInsufficientData = data.some(stage => stage.patients < 10);

    return (
        <div className={`card-glass rounded-3xl p-8 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-3xl text-primary">waterfall_chart</span>
                    <div>
                        <h3 className="text-xl font-black text-white">Patient Flow Funnel</h3>
                        <p className="text-xs text-slate-400 font-medium">Progression through treatment stages</p>
                    </div>
                </div>

                {totalPatients > 0 && (
                    <div className="text-right">
                        <p className="text-[11px] font-black text-slate-500 tracking-widest uppercase">Starting Cohort</p>
                        <p className="text-2xl font-black text-primary">{totalPatients.toLocaleString()}</p>
                    </div>
                )}
            </div>

            {/* Small-cell warning */}
            {hasInsufficientData && (
                <div className="mb-4 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                    <span className="material-symbols-outlined text-amber-400 text-xl">warning</span>
                    <div>
                        <p className="text-xs font-bold text-amber-400 mb-1">Limited Data</p>
                        <p className="text-xs text-slate-300">
                            Some stages have fewer than 10 patients. Results may not be statistically significant.
                        </p>
                    </div>
                </div>
            )}

            {/* Chart */}
            <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis
                            dataKey="stage"
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                        />
                        <YAxis
                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                            label={{ value: 'Unique Patients', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(43, 116, 243, 0.1)' }} />
                        <Bar dataKey="patients" radius={[8, 8, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(index, data.length)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Summary Stats */}
            <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.map((stage, index) => (
                    <div key={stage.stageOrder} className="text-center">
                        <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-1">
                            {stage.stage.split(' ')[0]}
                        </p>
                        <p className="text-lg font-black text-white">{stage.patients}</p>
                        {index > 0 && stage.dropoffRate > 0 && (
                            <p className="text-[10px] text-red-400 font-bold">-{stage.dropoffRate}%</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FunnelChart;
