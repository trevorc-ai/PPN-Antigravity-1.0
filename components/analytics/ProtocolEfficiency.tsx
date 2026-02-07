import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LabelList } from 'recharts';
import { Clock, TrendingUp, DollarSign, BrainCircuit } from 'lucide-react';

const data = [
    { x: 90, y: 12, name: 'IM Ketamine', color: '#06b6d4', outcome: '-12 pts' }, // Cyan
    { x: 120, y: 8, name: 'Spravato', color: '#3b82f6', outcome: '-8 pts' }, // Blue
    { x: 360, y: 22, name: 'Psilocybin (25mg)', color: '#8b5cf6', outcome: '-22 pts' }, // Purple
    { x: 480, y: 24, name: 'MDMA-AT', color: '#ec4899', outcome: '-24 pts' }, // Pink
];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const d = payload[0].payload;
        const efficiency = (d.y / d.x).toFixed(3);
        const hours = (d.x / 60).toFixed(1);

        return (
            <div className="bg-[#0f172a] border border-slate-700 rounded-lg p-3 shadow-2xl z-50">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700/50">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                    <span className="text-xs font-black text-slate-200 uppercase tracking-wider">{d.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block">Yield (PHQ-9)</span>
                        <span className="text-sm font-bold text-emerald-400">{d.outcome}</span>
                    </div>
                    <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block">Duration</span>
                        <span className="text-sm font-bold text-slate-300">{hours} hrs</span>
                    </div>
                    <div className="col-span-2 pt-1 mt-1 border-t border-slate-700/50">
                        <span className="text-[9px] font-mono text-slate-500 uppercase block mb-0.5">Efficiency Score</span>
                        <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-indigo-400" />
                            <span className="text-xs font-mono font-bold text-indigo-400">{efficiency} pts/min</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const CustomizedLabel = (props: any) => {
    const { x, y, value } = props;
    return (
        <text x={x} y={y} dy={-10} dx={0} fill="#94a3b8" fontSize={9} fontWeight={700} textAnchor="middle">
            {value}
        </text>
    );
};

export default function ProtocolEfficiency() {
    return (
        <div className="bg-[#0f1218] border border-slate-800 rounded-3xl p-6 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest">Protocol Efficiency</h3>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/50 rounded border border-slate-700/50">
                    <DollarSign className="w-3 h-3 text-emerald-500" />
                    <span className="text-[9px] font-mono text-emerald-500 font-bold uppercase">ROI Analysis</span>
                </div>
            </div>

            <p className="text-xs text-slate-500 font-medium mb-6 max-w-lg">
                Correlating <span className="text-emerald-400">Therapeutic Yield (Y)</span> with <span className="text-purple-400">Chair Time (X)</span>.
            </p>

            {/* Chart */}
            <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis
                            type="number"
                            dataKey="x"
                            name="Duration"
                            unit=" min"
                            domain={[0, 600]}
                            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                            tickLine={false}
                            axisLine={{ stroke: '#334155' }}
                        />
                        <YAxis
                            type="number"
                            dataKey="y"
                            name="Outcome Delta"
                            domain={[0, 30]}
                            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                            tickLine={false}
                            axisLine={{ stroke: '#334155' }}
                            label={{ value: 'Improvement (pts)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 9, fontWeight: 700 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1' }} />

                        {/* Efficiency Baseline Reference */}
                        <ReferenceLine
                            segment={[{ x: 0, y: 0 }, { x: 600, y: 30 }]}
                            stroke="#475569"
                            strokeDasharray="4 4"
                            strokeOpacity={0.5}
                            label={{ value: 'Efficiency Baseline', position: 'insideTopRight', fill: '#475569', fontSize: 9, dy: 10 }}
                        />

                        <Scatter name="Protocols" data={data}>
                            {data.map((entry, index) => (
                                <cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            <LabelList dataKey="name" content={<CustomizedLabel />} />
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            {/* Footer Insight */}
            <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-start gap-3">
                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    <strong className="text-slate-300">Resource Optimization:</strong> Correlating therapeutic yield with chair time allows for smarter financial modeling and protocol selection.
                </p>
            </div>
        </div>
    );
}
