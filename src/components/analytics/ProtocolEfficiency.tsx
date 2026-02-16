import React, { useState, useMemo } from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine, Cell
} from 'recharts';
import {
    DollarSign, Clock, TrendingUp, AlertCircle,
    Calculator, PieChart, ArrowUpRight, Filter
} from 'lucide-react';

// --- MOCK DATA ---
interface ProtocolData {
    id: string;
    name: string;
    revenue: number; // Total billing
    hours: number;   // Staff hours required
    satisfaction: number; // 1-10
    type: 'Ketamine' | 'Psilocybin' | 'MDMA' | 'Integration';
}

const PROTOCOLS: ProtocolData[] = [
    { id: 'K-IM-6', name: 'IM Ketamine (6-Pack)', revenue: 3200, hours: 9, satisfaction: 8.5, type: 'Ketamine' },
    { id: 'K-IV-6', name: 'IV Ketamine (6-Pack)', revenue: 4500, hours: 12, satisfaction: 8.2, type: 'Ketamine' },
    { id: 'K-KAP', name: 'KAP + Psychotherapy', revenue: 5800, hours: 18, satisfaction: 9.4, type: 'Ketamine' },
    { id: 'PSI-GRP', name: 'Psilocybin Group', revenue: 1500, hours: 6, satisfaction: 9.1, type: 'Psilocybin' },
    { id: 'PSI-IND', name: 'Psilocybin Individual', revenue: 2800, hours: 8, satisfaction: 9.6, type: 'Psilocybin' },
    { id: 'MDMA-PT', name: 'MDMA-AT (Full)', revenue: 12000, hours: 42, satisfaction: 9.8, type: 'MDMA' },
    { id: 'INT-COACH', name: 'Integration Coaching', revenue: 150, hours: 1, satisfaction: 7.5, type: 'Integration' },
];

const CustomTooltip = ({ active, payload, overhead }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const cost = data.hours * overhead;
        const profit = data.revenue - cost;
        const margin = ((profit / data.revenue) * 100).toFixed(1);

        return (
            <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl z-50 min-w-[200px]">
                <h4 className="font-black text-slate-300 text-sm mb-2">{data.name}</h4>
                <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                        <span className="text-slate-400">Revenue:</span>
                        <span className="font-mono text-emerald-400">${data.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Operational Load:</span>
                        <span className="font-mono text-slate-200">{data.hours} Staff Hrs</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Cost (@${overhead}/hr):</span>
                        <span className="font-mono text-rose-400">-${cost.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between font-bold">
                        <span className="text-slate-300">Net Profit:</span>
                        <span className={`font-mono ${profit > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                            ${profit.toLocaleString()} ({margin}%)
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export default function ProtocolEfficiency() {
    const [overhead, setOverhead] = useState(150); // Hourly cost

    // Dynamic Calculations
    const processedData = useMemo(() => {
        return PROTOCOLS.map(p => ({
            ...p,
            cost: p.hours * overhead,
            profit: p.revenue - (p.hours * overhead),
            roi: ((p.revenue - (p.hours * overhead)) / (p.hours * overhead)) * 100
        })).sort((a, b) => b.profit - a.profit);
    }, [overhead]);

    const totalPotentialProfit = processedData.reduce((acc, curr) => acc + (curr.profit > 0 ? curr.profit : 0), 0);

    return (
        <div className="w-full bg-[#0f1218] p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-8 h-full overflow-y-auto custom-scrollbar">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div title="Forecasting financial efficiency and margin analysis for selected protocols">
                    <h2 className="text-xl font-black text-slate-200 tracking-tighter flex items-center gap-2">
                        <Calculator className="text-indigo-500" />
                        Protocol ROI Engine
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                        Financial Efficiency & Margin Analysis.
                    </p>
                </div>
                {/* CONTROLS */}
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center gap-4 w-full md:w-auto">
                    <div className="p-2 bg-indigo-500/20 rounded-lg" title="Cost Calculator Settings">
                        <DollarSign className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs font-bold text-slate-3000 uppercase tracking-widest block mb-1" title="Adjust the estimated hourly operational cost to see impact on margin">
                            Est. Hourly Overhead: <span className="text-slate-300">${overhead}</span>
                        </label>
                        <input
                            type="range"
                            min="50" max="300" step="10"
                            value={overhead}
                            onChange={(e) => setOverhead(parseInt(e.target.value))}
                            className="w-full accent-indigo-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>

            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">

                {/* CHART AREA */}
                <div className="lg:col-span-2 bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 relative min-h-[350px] flex flex-col">
                    <div className="flex-1 w-full h-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                <XAxis
                                    type="number" dataKey="hours" name="Time" unit="hr"
                                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                                    label={{ value: 'Staff Hours Required', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 11 }}
                                />
                                <YAxis
                                    type="number" dataKey="revenue" name="Revenue" unit="$"
                                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                                    label={{ value: 'Revenue per Unit', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
                                />
                                <Tooltip content={<CustomTooltip overhead={overhead} />} />

                                <Scatter name="Protocols" data={processedData}>
                                    {processedData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.profit > 0 ? '#10b981' : '#f43f5e'}
                                            fillOpacity={0.6}
                                            stroke={entry.profit > 0 ? '#10b981' : '#f43f5e'}
                                            strokeWidth={2}
                                        />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Legend Overlay */}
                    <div className="absolute top-6 right-6 flex flex-col gap-2 text-xs font-bold uppercase tracking-widest bg-slate-900/80 p-2 rounded-lg border border-slate-800 z-10">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Profitable
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Loss / At Risk
                        </div>
                    </div>
                </div>

                {/* SIDEBAR: LEADERBOARD */}
                <div className="flex flex-col gap-4">
                    <div className="p-5 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl" title="Projected net profit if all protocols are run once">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-indigo-400" />
                            <h3 className="text-xs font-black text-indigo-300 uppercase tracking-widest">Efficiency Forecast</h3>
                        </div>
                        <p className="text-3xl font-black text-slate-300 tracking-tight">
                            ${totalPotentialProfit.toLocaleString()}
                        </p>
                        <p className="text-xs text-indigo-400/60 font-medium mt-1">
                            Total Net Profit (Single Run of All Protocols)
                        </p>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {processedData.map((p, i) => (
                            <div key={p.id} className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl flex justify-between items-center group hover:border-slate-700 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`text-xs font-black w-4 text-slate-600`}>#{i + 1}</div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-200">{p.name}</div>
                                        <div className="text-xs text-slate-3000">{p.hours} hrs • Margin: {((p.profit / p.revenue) * 100).toFixed(0)}%</div>
                                    </div>
                                </div>
                                <div className={`text-xs font-mono font-bold ${p.profit > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                                    {p.profit > 0 ? '+' : ''}${p.profit.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
}
