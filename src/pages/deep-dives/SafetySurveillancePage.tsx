import React, { useState } from 'react';
import { PageContainer } from '../../components/layouts/PageContainer';
import { Section } from '../../components/layouts/Section';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { AlertTriangle, Shield, TrendingDown, Activity } from 'lucide-react';

const SafetySurveillancePage: React.FC = () => {
    // Demo data: Heatmap (Frequency × Severity)
    const severityGrades = ['G1\nMild', 'G2\nModerate', 'G3\nSevere', 'G4\nLife-\nThreatening', 'G5\nDeath'];
    const frequencyLevels = ['Very Common\n(>10%)', 'Common\n(1-10%)', 'Uncommon\n(0.1-1%)', 'Rare\n(0.01-0.1%)', 'Very Rare\n(<0.01%)'];

    // Heatmap data: [frequency][severity] = count
    const heatmapData = [
        [145, 82, 18, 4, 0],  // Very Common
        [92, 26, 6, 1, 0],    // Common
        [12, 8, 2, 0, 0],     // Uncommon
        [7, 3, 1, 0, 0],      // Rare
        [0, 0, 0, 0, 0]       // Very Rare
    ];

    // Severity distribution for donut chart
    const severityDistribution = [
        { name: 'Mild (G1)', value: 256, color: '#10b981' },
        { name: 'Moderate (G2)', value: 119, color: '#3b82f6' },
        { name: 'Severe (G3)', value: 27, color: '#f59e0b' },
        { name: 'Life-Threatening (G4)', value: 5, color: '#ef4444' },
        { name: 'Death (G5)', value: 0, color: '#7f1d1d' },
    ];

    // Recent safety events
    const recentEvents = [
        { id: 'SAE-2024-089', type: 'Nausea', severity: 'G2', substance: 'Psilocybin', date: '2024-02-08', resolved: true },
        { id: 'SAE-2024-088', type: 'Anxiety Spike', severity: 'G2', substance: 'MDMA', date: '2024-02-07', resolved: true },
        { id: 'SAE-2024-087', type: 'Tachycardia', severity: 'G3', substance: 'Ketamine', date: '2024-02-06', resolved: false },
        { id: 'SAE-2024-086', type: 'Headache', severity: 'G1', substance: 'LSD', date: '2024-02-05', resolved: true },
    ];

    const getCellColor = (freq: number, sev: number) => {
        const count = heatmapData[freq][sev];
        if (count === 0) return 'bg-slate-900/40 border-slate-800/50';
        if (sev <= 1) return 'bg-emerald-500/20 border-emerald-500/30'; // Mild/Moderate
        if (sev === 2) return 'bg-amber-500/20 border-amber-500/30';    // Severe
        return 'bg-red-500/20 border-red-500/30';                       // Life-threatening/Death
    };

    const getCellTextColor = (freq: number, sev: number) => {
        const count = heatmapData[freq][sev];
        if (count === 0) return 'text-slate-600';
        if (sev <= 1) return 'text-emerald-400';
        if (sev === 2) return 'text-amber-400';
        return 'text-red-400';
    };

    const getSeverityBadgeColor = (severity: string) => {
        switch (severity) {
            case 'G1': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
            case 'G2': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
            case 'G3': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
            case 'G4': return 'bg-red-500/10 border-red-500/20 text-red-400';
            default: return 'bg-slate-500/10 border-slate-500/20 text-slate-300';
        }
    };

    return (
        <PageContainer className="min-h-screen bg-[#0a1628] text-slate-300">
            {/* Header */}
            <Section spacing="tight" className="border-b border-slate-800 pb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                        <Shield className="w-6 h-6 text-red-400" />
                    </div>
                    <span className="text-[11px] font-black text-red-400 uppercase tracking-widest">Safety Intelligence</span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter">
                    <span className="text-gradient-primary">Safety</span> Surveillance Matrix
                </h1>
                <p className="text-slate-300 text-lg font-medium mt-2 max-w-3xl">
                    Real-time detection of adverse events and contraindication spikes across the network.
                </p>
            </Section>

            {/* Top Metrics */}
            <Section spacing="default">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="card-glass p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                            <Activity className="w-5 h-5 text-emerald-400" />
                            <p className="text-xs font-bold text-slate-3000 uppercase tracking-widest">Active Protocols</p>
                        </div>
                        <p className="text-4xl font-black text-slate-300">42</p>
                        <p className="text-xs text-slate-600 font-medium mt-1">Currently monitored</p>
                    </div>

                    <div className="card-glass p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                            <Shield className="w-5 h-5 text-primary" />
                            <p className="text-xs font-bold text-slate-3000 uppercase tracking-widest">Risk Index</p>
                        </div>
                        <p className="text-4xl font-black text-emerald-400">0.4%</p>
                        <p className="text-xs text-slate-600 font-medium mt-1">Current Low Risk</p>
                    </div>

                    <div className="card-glass p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                            <p className="text-xs font-bold text-slate-3000 uppercase tracking-widest">Total Events</p>
                        </div>
                        <p className="text-4xl font-black text-slate-300">407</p>
                        <p className="text-xs text-slate-600 font-medium mt-1">Last 90 days</p>
                    </div>

                    <div className="card-glass p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                            <TrendingDown className="w-5 h-5 text-red-400" />
                            <p className="text-xs font-bold text-slate-3000 uppercase tracking-widest">Serious Events (SAE)</p>
                        </div>
                        <p className="text-4xl font-black text-slate-300">0</p>
                        <p className="text-xs text-slate-600 font-medium mt-1">No G4/G5 events</p>
                    </div>
                </div>
            </Section>

            {/* Main Content: Heatmap + Donut Chart */}
            <Section spacing="default">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Heatmap (2/3 width) */}
                    <div className="lg:col-span-2 card-glass p-8 rounded-3xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-slate-300 tracking-tight">Risk Heatmap</h2>
                                <p className="text-sm text-slate-3000 font-medium mt-1">Frequency × Severity Matrix</p>
                            </div>
                            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-black text-emerald-400 uppercase">
                                Live Data
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <div className="inline-block min-w-full">
                                {/* Header Row */}
                                <div className="flex items-center mb-3">
                                    <div className="w-32 shrink-0"></div>
                                    {severityGrades.map((grade, i) => (
                                        <div key={i} className="flex-1 min-w-[80px] text-center">
                                            <p className="text-[10px] font-black text-slate-3000 uppercase tracking-wider whitespace-pre-line leading-tight">
                                                {grade}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Data Rows */}
                                {frequencyLevels.map((freq, freqIdx) => (
                                    <div key={freqIdx} className="flex items-center mb-2">
                                        <div className="w-32 shrink-0 pr-3">
                                            <p className="text-[10px] font-black text-slate-3000 uppercase tracking-wider text-right whitespace-pre-line leading-tight">
                                                {freq}
                                            </p>
                                        </div>
                                        {severityGrades.map((_, sevIdx) => {
                                            const count = heatmapData[freqIdx][sevIdx];
                                            return (
                                                <div key={sevIdx} className="flex-1 min-w-[80px] px-1">
                                                    <div className={`aspect-square rounded-xl border ${getCellColor(freqIdx, sevIdx)} flex items-center justify-center transition-all hover:scale-105 cursor-pointer group`}>
                                                        {count > 0 && (
                                                            <span className={`text-lg font-black ${getCellTextColor(freqIdx, sevIdx)} group-hover:scale-110 transition-transform`}>
                                                                {count}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-800/50">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/30"></div>
                                <span className="text-xs font-bold text-slate-3000 uppercase">Mild/Moderate</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/30"></div>
                                <span className="text-xs font-bold text-slate-3000 uppercase">Severe</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/30"></div>
                                <span className="text-xs font-bold text-slate-3000 uppercase">Critical</span>
                            </div>
                        </div>
                    </div>

                    {/* Donut Chart (1/3 width) */}
                    <div className="card-glass p-8 rounded-3xl">
                        <h2 className="text-xl font-black text-slate-300 tracking-tight mb-2">Severity Distribution</h2>
                        <p className="text-sm text-slate-3000 font-medium mb-6">Event breakdown by grade</p>

                        <div role="img" aria-label="Donut chart showing safety event severity distribution: 245 Grade 1 Mild events, 120 Grade 2 Moderate events, 38 Grade 3 Severe events, 4 Grade 4 Life-threatening events, and 0 Grade 5 Fatal events">
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={severityDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {severityDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#0f172a',
                                            border: '1px solid #334155',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="space-y-2 mt-4">
                            {severityDistribution.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-xs font-bold text-slate-300">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-300">{item.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-800/50 text-center">
                            <p className="text-xs font-bold text-slate-3000 uppercase tracking-widest mb-1">Safety Score</p>
                            <p className="text-3xl font-black text-emerald-400">93%</p>
                            <p className="text-xs text-slate-600 font-medium mt-1">Mild/Moderate events</p>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Recent Safety Events Table */}
            <Section spacing="default">
                <div className="card-glass p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-slate-300 tracking-tight">Recent Safety Events</h2>
                            <p className="text-sm text-slate-3000 font-medium mt-1">Last 7 days</p>
                        </div>
                        <button className="px-4 py-2 bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary text-xs font-black rounded-xl uppercase tracking-widest transition-all">
                            View All Events
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="text-left py-3 px-4 text-xs font-black text-slate-3000 uppercase tracking-widest">Event ID</th>
                                    <th className="text-left py-3 px-4 text-xs font-black text-slate-3000 uppercase tracking-widest">Type</th>
                                    <th className="text-left py-3 px-4 text-xs font-black text-slate-3000 uppercase tracking-widest">Severity</th>
                                    <th className="text-left py-3 px-4 text-xs font-black text-slate-3000 uppercase tracking-widest">Substance</th>
                                    <th className="text-left py-3 px-4 text-xs font-black text-slate-3000 uppercase tracking-widest">Date</th>
                                    <th className="text-left py-3 px-4 text-xs font-black text-slate-3000 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentEvents.map((event, i) => (
                                    <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-900/40 transition-colors">
                                        <td className="py-4 px-4">
                                            <span className="text-sm font-bold text-primary font-mono">{event.id}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm font-medium text-slate-300">{event.type}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${getSeverityBadgeColor(event.severity)}`}>
                                                {event.severity}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm font-medium text-slate-300">{event.substance}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm font-medium text-slate-3000">{event.date}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            {event.resolved ? (
                                                <span className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                                    Resolved
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                                                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                                                    Monitoring
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Section>
        </PageContainer>
    );
};

export default SafetySurveillancePage;
