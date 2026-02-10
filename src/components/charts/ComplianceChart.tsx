import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { GlobalFilters } from '../analytics/GlobalFilterBar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';

interface ComplianceChartProps {
    filters: GlobalFilters;
    className?: string;
}

interface ComplianceData {
    month: string;
    monthLabel: string;
    totalSessions: number;
    sessionsWithFollowup: number;
    complianceRate: number;
}

const ComplianceChart: React.FC<ComplianceChartProps> = ({ filters, className = '' }) => {
    const [data, setData] = useState<ComplianceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [overallCompliance, setOverallCompliance] = useState(0);

    useEffect(() => {
        loadComplianceData();
    }, [filters]);

    const loadComplianceData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Build query for v_followup_compliance
            let query = supabase
                .from('v_followup_compliance')
                .select('site_id, month_bucket, total_sessions, sessions_with_followup, pct_completed');

            // Apply site filter
            if (filters.siteIds.length > 0) {
                query = query.in('site_id', filters.siteIds);
            }

            const { data: viewData, error: viewError } = await query.order('month_bucket');

            if (viewError) throw viewError;

            if (!viewData || viewData.length === 0) {
                setData([]);
                setOverallCompliance(0);
                return;
            }

            // Aggregate by month (sum across sites if multiple)
            const monthMap = new Map<string, { sessions: number; withFollowup: number }>();

            viewData.forEach((row: any) => {
                const month = row.month_bucket;
                if (!monthMap.has(month)) {
                    monthMap.set(month, { sessions: 0, withFollowup: 0 });
                }
                const monthData = monthMap.get(month)!;
                monthData.sessions += row.total_sessions;
                monthData.withFollowup += row.sessions_with_followup;
            });

            // Apply date range filter (client-side since view doesn't support it directly)
            let months = Array.from(monthMap.entries());

            if (filters.dateRange.start) {
                months = months.filter(([month]) => month >= filters.dateRange.start);
            }

            if (filters.dateRange.end) {
                months = months.filter(([month]) => month <= filters.dateRange.end);
            }

            // Transform to chart data
            const chartData: ComplianceData[] = months.map(([month, data]) => {
                const rate = data.sessions > 0 ? (data.withFollowup / data.sessions) * 100 : 0;
                return {
                    month,
                    monthLabel: formatMonthLabel(month),
                    totalSessions: data.sessions,
                    sessionsWithFollowup: data.withFollowup,
                    complianceRate: Math.round(rate * 10) / 10
                };
            });

            setData(chartData);

            // Calculate overall compliance
            const totalSessions = chartData.reduce((sum, d) => sum + d.totalSessions, 0);
            const totalWithFollowup = chartData.reduce((sum, d) => sum + d.sessionsWithFollowup, 0);
            const overall = totalSessions > 0 ? (totalWithFollowup / totalSessions) * 100 : 0;
            setOverallCompliance(Math.round(overall * 10) / 10);

        } catch (err: any) {
            console.error('Error loading compliance data:', err);
            setError(err.message || 'Failed to load compliance data');
        } finally {
            setLoading(false);
        }
    };

    const formatMonthLabel = (monthStr: string) => {
        const date = new Date(monthStr);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-[#0c0f16] border border-white/10 rounded-xl p-4 shadow-2xl">
                    <p className="text-sm font-black text-white mb-2">{data.monthLabel}</p>
                    <div className="space-y-1">
                        <p className="text-xs text-slate-300">
                            <span className="font-bold text-primary">{data.complianceRate}%</span> compliance rate
                        </p>
                        <p className="text-xs text-slate-300">
                            <span className="font-bold text-emerald-400">{data.sessionsWithFollowup}</span> with follow-up
                        </p>
                        <p className="text-xs text-slate-400">
                            out of {data.totalSessions} total sessions
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Get compliance color based on rate
    const getComplianceColor = (rate: number) => {
        if (rate >= 80) return '#10b981'; // emerald-500 (excellent)
        if (rate >= 60) return '#3b82f6'; // blue-500 (good)
        if (rate >= 40) return '#f59e0b'; // amber-500 (fair)
        return '#ef4444'; // red-500 (poor)
    };

    if (loading) {
        return (
            <div className={`card-glass rounded-3xl p-8 h-[500px] flex items-center justify-center ${className}`}>
                <div className="text-center space-y-4">
                    <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                    <p className="text-sm font-medium text-slate-400">Loading compliance data...</p>
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
                    <span className="material-symbols-outlined text-6xl text-slate-600">show_chart</span>
                    <div>
                        <p className="text-lg font-black text-white mb-2">No Data Available</p>
                        <p className="text-sm text-slate-400 max-w-md">
                            {filters.siteIds.length > 0 || filters.dateRange.start
                                ? 'No compliance data found for selected filters. Try adjusting your filters or note that small-cell suppression hides months with fewer than 10 sessions.'
                                : 'No follow-up compliance data found. This view requires at least 10 sessions per month.'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate trend (comparing first and last month)
    const firstRate = data[0]?.complianceRate || 0;
    const lastRate = data[data.length - 1]?.complianceRate || 0;
    const trend = lastRate - firstRate;
    const trendDirection = trend > 0 ? 'up' : trend < 0 ? 'down' : 'stable';

    return (
        <div className={`card-glass rounded-3xl p-8 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-3xl text-primary">show_chart</span>
                    <div>
                        <h3 className="text-xl font-black text-white">Follow-up Compliance</h3>
                        <p className="text-xs text-slate-400 font-medium">Completion rates over time</p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-[11px] font-black text-slate-500 tracking-widest uppercase">Overall Rate</p>
                    <div className="flex items-center gap-2">
                        <p className="text-2xl font-black" style={{ color: getComplianceColor(overallCompliance) }}>
                            {overallCompliance}%
                        </p>
                        {trend !== 0 && (
                            <span className={`material-symbols-outlined text-xl ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {trend > 0 ? 'trending_up' : 'trending_down'}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            <div className="mb-4 px-4 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-indigo-400 text-xl">info</span>
                <div>
                    <p className="text-xs font-bold text-indigo-400 mb-1">Small-Cell Suppression Active</p>
                    <p className="text-xs text-slate-300">
                        Only showing months with ≥10 sessions. Some months may be hidden to protect privacy.
                    </p>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="complianceGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2b74f3" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#2b74f3" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis
                            dataKey="monthLabel"
                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis
                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                            label={{ value: 'Compliance Rate (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                            domain={[0, 100]}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="complianceRate"
                            stroke="#2b74f3"
                            strokeWidth={3}
                            fill="url(#complianceGradient)"
                            dot={{ fill: '#2b74f3', r: 5 }}
                            activeDot={{ r: 7, fill: '#2b74f3', stroke: '#fff', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Benchmark Lines */}
            <div className="mt-6 pt-6 border-t border-slate-800">
                <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-3">Performance Benchmarks</p>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-emerald-500"></div>
                        <span className="text-xs text-slate-400 font-medium">≥80% (Excellent)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-slate-400 font-medium">60-79% (Good)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-amber-500"></div>
                        <span className="text-xs text-slate-400 font-medium">40-59% (Fair)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-red-500"></div>
                        <span className="text-xs text-slate-400 font-medium">&lt;40% (Needs Improvement)</span>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                    <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-1">Months Tracked</p>
                    <p className="text-lg font-black text-white">{data.length}</p>
                </div>
                <div className="text-center p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                    <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-1">Total Sessions</p>
                    <p className="text-lg font-black text-white">{data.reduce((sum, d) => sum + d.totalSessions, 0)}</p>
                </div>
                <div className="text-center p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                    <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-1">With Follow-up</p>
                    <p className="text-lg font-black text-white">{data.reduce((sum, d) => sum + d.sessionsWithFollowup, 0)}</p>
                </div>
                <div className="text-center p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                    <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-1">Trend</p>
                    <div className="flex items-center justify-center gap-1">
                        <p className={`text-lg font-black ${trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                            {trend > 0 ? '+' : ''}{Math.round(trend * 10) / 10}%
                        </p>
                        <span className={`material-symbols-outlined text-sm ${trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                            {trend > 0 ? 'arrow_upward' : trend < 0 ? 'arrow_downward' : 'remove'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplianceChart;
