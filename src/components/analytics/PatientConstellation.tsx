import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Search, Lightbulb, Snowflake } from 'lucide-react';

const cohortData = [
    { x: 20, y: 10, id: 'ANON-101', outcome: 'No Change', protocol: 'Oral Psilocybin', type: 'cohort' },
    { x: 30, y: 15, id: 'ANON-102', outcome: 'Partial', protocol: 'MDMA-AT', type: 'cohort' },
    { x: 45, y: 22, id: 'ANON-103', outcome: 'Relapse', protocol: 'Ketamine Lozenges', type: 'cohort' },
    { x: 50, y: 12, id: 'ANON-104', outcome: 'No Change', protocol: 'Oral Psilocybin', type: 'cohort' },
    { x: 10, y: 5, id: 'ANON-105', outcome: 'Remission', protocol: 'IFS Only', type: 'cohort' },
    { x: 80, y: 25, id: 'ANON-106', outcome: 'Partial', protocol: 'Unknown', type: 'cohort' },
    { x: 60, y: 18, id: 'ANON-107', outcome: 'No Change', protocol: 'CBT', type: 'cohort' },
    { x: 55, y: 24, id: 'ANON-108', outcome: 'Relapse', protocol: 'SSRIs', type: 'cohort' },
    { x: 25, y: 8, id: 'ANON-109', outcome: 'Remission', protocol: 'MDMA-AT', type: 'cohort' },
    { x: 35, y: 20, id: 'ANON-110', outcome: 'Partial', protocol: 'Ketamine Lozenges', type: 'cohort' },
    { x: 90, y: 26, id: 'ANON-111', outcome: 'No Change', protocol: 'TMS', type: 'cohort' },
    { x: 15, y: 4, id: 'ANON-112', outcome: 'Remission', protocol: 'Psilocybin Micro', type: 'cohort' },
];

const responderData = [
    { x: 72, y: 16, id: 'ANON-9921', outcome: 'Remission (-14 pts)', protocol: 'IM Ketamine + IFS', type: 'responder' },
    { x: 78, y: 19, id: 'ANON-9922', outcome: 'Remission (-12 pts)', protocol: 'IM Ketamine + IFS', type: 'responder' },
    { x: 74, y: 15, id: 'ANON-9923', outcome: 'Remission (-15 pts)', protocol: 'IM Ketamine + Somatic', type: 'responder' },
    { x: 68, y: 17, id: 'ANON-9924', outcome: 'Remission (-10 pts)', protocol: 'IM Ketamine', type: 'responder' },
    { x: 76, y: 18, id: 'ANON-9925', outcome: 'Remission (-13 pts)', protocol: 'Spravato + IFS', type: 'responder' },
    { x: 82, y: 20, id: 'ANON-9926', outcome: 'Significant Drop', protocol: 'IM Ketamine + EMDR', type: 'responder' },
];

const currentPatientData = [
    { x: 75, y: 18, id: 'PT-8832', outcome: 'Active Treatment', protocol: 'Pending', type: 'current' },
];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-[#0f172a] border border-slate-700 rounded-lg p-3 shadow-2xl z-50">
                <div className="flex items-center gap-2 mb-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] font-mono font-bold text-slate-200">{data.id}</span>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between gap-4">
                        <span className="text-[10px] text-slate-500">Outcome:</span>
                        <span className={`text-[10px] font-bold ${data.type === 'responder' ? 'text-emerald-400' : 'text-slate-300'}`}>{data.outcome}</span>
                    </div>
                    {data.protocol !== 'Pending' && (
                        <div className="flex justify-between gap-4">
                            <span className="text-[10px] text-slate-500">Protocol:</span>
                            <span className="text-[10px] font-mono text-indigo-400">{data.protocol}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    return null;
};

const PulsingDot = (props: any) => {
    const { cx, cy } = props;
    return (
        <svg x={cx - 10} y={cy - 10} width={20} height={20} overflow="visible">
            <circle cx="10" cy="10" r="6" fill="#06b6d4" className="animate-ping opacity-75" />
            <circle cx="10" cy="10" r="6" fill="#22d3ee" stroke="white" strokeWidth="2" />
        </svg>
    );
};

export default function PatientConstellation() {
    return (
        <div className="bg-[#0f1218] border border-slate-800 rounded-3xl p-6 flex flex-col h-full relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest">Patient Constellation</h3>
                </div>
                <div className="flex items-center gap-3 text-[9px] font-mono uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-600 opacity-50"></span>
                        <span className="text-slate-500">Cohort</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-emerald-400">Responders</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 border border-white"></span>
                        <span className="text-cyan-400 font-bold">PT-8832</span>
                    </div>
                </div>
            </div>

            <p className="text-xs text-slate-500 font-medium mb-4 max-w-lg">
                Visualizing nearest neighbors based on Resistance Score (<span className="font-mono">x</span>) and Symptom Severity (<span className="font-mono">y</span>).
            </p>

            {/* Chart */}
            <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis
                            type="number"
                            dataKey="x"
                            name="Resistance Score"
                            domain={[0, 100]}
                            tick={{ fill: '#64748b', fontSize: 10 }}
                            tickLine={false}
                            axisLine={{ stroke: '#334155' }}
                        />
                        <YAxis
                            type="number"
                            dataKey="y"
                            name="PHQ-9 Severity"
                            domain={[0, 30]}
                            tick={{ fill: '#64748b', fontSize: 10 }}
                            tickLine={false}
                            axisLine={{ stroke: '#334155' }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1' }} />

                        {/* Network Cohort */}
                        <Scatter name="Cohort" data={cohortData} fill="#64748b" fillOpacity={0.4} />

                        {/* Responders */}
                        <Scatter name="Responders" data={responderData} fill="#10b981" />

                        {/* Current Patient */}
                        <Scatter name="Current Patient" data={currentPatientData} shape={<PulsingDot />} />

                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            {/* Insight Panel */}
            <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-start gap-3">
                <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    <strong className="text-emerald-400">Clinical Insight:</strong> 74% of nearest neighbors with this resistance profile responded to <span className="font-mono text-indigo-400 bg-indigo-500/10 px-1 py-0.5 rounded border border-indigo-500/20 text-[10px]">IM Ketamine</span>.
                </p>
            </div>

            {/* Background Data Decoration */}
            <div className="absolute bottom-4 right-4 pointer-events-none opacity-20">
                <Snowflake className="w-24 h-24 text-slate-700" />
            </div>
        </div>
    );
}
