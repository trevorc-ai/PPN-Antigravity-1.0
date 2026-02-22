import React, { FC, useMemo, useState, useEffect } from 'react';
import {
    ComposedChart, Line, Area, ReferenceLine,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { ArrowRight, CheckCircle2, AlertTriangle, User } from 'lucide-react';
import { getPatientOutcomeData, type PatientOutcomeData, type PatientTimepoint } from '../../services/patientOutcomes';

interface PatientOutcomePanelProps {
    patientId: string;
    sessionId: string;
    onOpenDosingProtocol?: () => void;
    onGenerateDischarge?: () => void;
}

// Custom tooltip as required by the chart engineering skill
const OutcomeTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const patientScore = payload.find((p: any) => p.dataKey === 'patientScore')?.value;
    const trialMin = payload.find((p: any) => p.dataKey === 'trialMin')?.value;
    const trialMax = payload.find((p: any) => p.dataKey === 'trialMax')?.value;

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl text-sm min-w-[200px]">
            <p className="font-bold text-white mb-2 pb-1 border-b border-slate-700">{label}</p>
            {patientScore !== undefined && (
                <div className="flex justify-between items-center mb-1">
                    <span className="text-violet-300 font-semibold">Patient Score:</span>
                    <span className="text-white font-bold">{patientScore}</span>
                </div>
            )}
            {trialMin !== undefined && trialMax !== undefined && (
                <div className="flex justify-between items-center text-slate-400 text-xs">
                    <span>Phase 3 Cohort Range:</span>
                    <span>{trialMin} – {trialMax}</span>
                </div>
            )}
        </div>
    );
};

// Legend item component
const LegendItem: FC<{ color: string; solid?: boolean; dashed?: boolean; label: string }> = ({ color, solid, label }) => (
    <div className="flex items-center gap-1.5" aria-label={`Legend: ${label}`}>
        <svg width="24" height="12">
            <line
                x1="0" y1="6" x2="24" y2="6"
                stroke={color}
                strokeWidth={solid ? 2.5 : 1.5}
                strokeDasharray={solid ? undefined : '5 3'}
            />
        </svg>
        <span className="text-xs text-slate-400 font-medium tracking-wide">{label}</span>
    </div>
);

export const PatientOutcomePanel: FC<PatientOutcomePanelProps> = ({
    patientId, sessionId, onOpenDosingProtocol, onGenerateDischarge
}) => {
    const [data, setData] = useState<PatientOutcomeData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getPatientOutcomeData(patientId, sessionId).then(res => {
            setData(res);
            setLoading(false);
        });
    }, [patientId, sessionId]);

    const chartData = useMemo(() => {
        if (!data) return [];

        // Mocking Phase 3 benchmark data matching the primary instrument
        return data.timepoints.map(t => {
            const score = t[data.primaryInstrument.toLowerCase().replace('-', '') as keyof PatientTimepoint] as number | null;

            // Synthetic benchmark data for demonstration
            let trialMin, trialMax, realWorldAvg;
            if (t.week === 0) { trialMin = 22; trialMax = 26; realWorldAvg = 24; }
            else if (t.week === 3) { trialMin = 12; trialMax = 18; realWorldAvg = 15; }
            else if (t.week === 6) { trialMin = 10; trialMax = 16; realWorldAvg = 13; }
            else if (t.week === 12) { trialMin = 9; trialMax = 15; realWorldAvg = 12; }

            return {
                week: t.week,
                label: t.label,
                patientScore: score,
                trialMin,
                trialMax,
                realWorldAvg
            };
        });
    }, [data]);

    if (loading) {
        return (
            <div className="w-full bg-slate-900/40 border border-slate-700/50 rounded-2xl p-6 animate-pulse">
                <div className="h-6 w-1/3 bg-slate-800 rounded mb-6"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-64 bg-slate-800/50 rounded-xl"></div>
                    <div className="h-64 bg-slate-800/50 rounded-xl"></div>
                </div>
            </div>
        );
    }

    if (!data || data.timepoints.length <= 1) {
        return (
            <div className="w-full bg-slate-900/40 border border-slate-700/50 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
                <User className="w-12 h-12 text-slate-600 mb-4" />
                <h3 className="text-lg font-bold text-slate-300 mb-2">Outcome tracking begins after the first post-session assessment.</h3>
                <p className="text-sm text-slate-500 max-w-md">
                    Complete a Longitudinal Assessment to unlock this panel. Baseline captured: {data?.primaryInstrument} = {data?.timepoints[0]?.[data.primaryInstrument.toLowerCase().replace('-', '') as keyof PatientTimepoint] ?? 'N/A'}.
                </p>
                <button className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors">
                    Open Longitudinal Assessment
                </button>
            </div>
        );
    }

    const baselineScore = chartData[0]?.patientScore ?? 0;
    const currentScore = chartData[chartData.length - 1]?.patientScore ?? 0;
    const pctChange = Math.round(((currentScore - baselineScore) / baselineScore) * 100);
    const responseThreshold = Math.floor(baselineScore * 0.5);
    const remissionLine = data.primaryInstrument === 'PHQ-9' ? 5 : data.primaryInstrument === 'CAPS-5' ? 20 : 5;

    const meq30 = data.experienceScores[0]?.meq30 ?? 0;
    const isHigherMeq = meq30 >= 80;
    const isMediumMeq = meq30 >= 50 && meq30 < 80;
    const isLowMeq = meq30 < 50;

    return (
        <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl flex flex-col">

            {/* Header / Insight */}
            <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-white leading-tight">
                        {data.primaryInstrument} dropped {Math.abs(pctChange)}% since baseline — {
                            data.responseAchieved ? 'Response threshold achieved' : 'Approaching response threshold'
                        }.
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Patient MEQ-30 score of {meq30} suggests {
                            isHigherMeq ? 'sustained benefit is highly expected based on clinical literature.' :
                                isMediumMeq ? 'moderate experiential depth; monitor integration closely.' :
                                    'limited psychedelic experience may explain slower response.'
                        }
                    </p>
                </div>
                {data.responseAchieved && (
                    <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                        Response Achieved
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">

                {/* CHART 1: Symptom Trajectory (Left 2/3) */}
                <div className="lg:col-span-2 flex flex-col relative">
                    <p className="text-xs font-bold text-slate-500 mb-2 tracking-wider uppercase flex justify-between">
                        <span>{data.primaryInstrument} Score Over Time</span>
                        <span>↓ Lower = Better</span>
                    </p>

                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData} margin={{ top: 10, right: 30, bottom: 0, left: -20 }}>
                                <defs>
                                    <linearGradient id="trialRibbon" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                                <XAxis dataKey="label" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} domain={[0, 'dataMax + 4']} />
                                <Tooltip content={<OutcomeTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />

                                {/* L1: Phase 3 trial range ribbon */}
                                <Area dataKey="trialMin" fill="transparent" stroke="transparent" animationBegin={200} animationDuration={600} />
                                <Area dataKey="trialMax" fill="url(#trialRibbon)" stroke="rgba(148,163,184,0.3)" strokeDasharray="5 3" animationBegin={200} animationDuration={600} name="Phase 3 Trial Range" />

                                {/* L2: Real-world average dashed line */}
                                <Line type="monotone" dataKey="realWorldAvg" stroke="#64748b" strokeWidth={1.5} strokeDasharray="6 4" dot={false} animationBegin={500} animationDuration={600} />

                                {/* L3: Reference Lines */}
                                <ReferenceLine y={responseThreshold} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3" label={{ value: 'Response Threshold', position: 'insideTopLeft', fill: '#f59e0b', fontSize: 10, opacity: 0.8 }} animationBegin={600} />
                                <ReferenceLine y={remissionLine} stroke="#10b981" strokeWidth={1} strokeDasharray="3 3" label={{ value: 'Remission Line', position: 'insideBottomLeft', fill: '#10b981', fontSize: 10, opacity: 0.8 }} animationBegin={700} />

                                {/* L4: Patient Score Line */}
                                <Line type="monotone" dataKey="patientScore" stroke="#a78bfa" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 5, strokeWidth: 2, stroke: '#1e1b4b' }} activeDot={{ r: 7, fill: '#c4b5fd' }} animationBegin={900} animationDuration={800} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 justify-center">
                        <LegendItem color="#a78bfa" solid label="This Patient" />
                        <LegendItem color="#94a3b8" dashed label="Phase 3 Trial Range" />
                        <LegendItem color="#64748b" dashed label="Real-World Average" />
                    </div>
                </div>

                {/* CHART 2: MEQ-30 Correlation (Right 1/3) */}
                <div className="flex flex-col border-l border-slate-700/50 pl-8 relative">
                    <p className="text-xs font-bold text-slate-500 mb-6 tracking-wider uppercase">
                        Experience Depth vs. Outcome
                    </p>

                    <div className="space-y-6 flex-1 relative flex flex-col justify-center pb-8">

                        {/* Vertical marker for patient MEQ */}
                        <div className="absolute top-0 bottom-8 left-[65%] w-px bg-violet-400/50 z-10 border-r border-dashed border-violet-400">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-500/20 text-violet-300 text-[10px] font-bold px-2 py-0.5 rounded border border-violet-500/30 whitespace-nowrap">
                                Pt MEQ: {meq30}
                            </div>
                        </div>

                        {/* High Bracket */}
                        <div className={`relative z-0 group ${isHigherMeq ? 'opacity-100' : 'opacity-40'}`}>
                            <div className="flex justify-between text-xs mb-1.5 font-semibold">
                                <span className={isHigherMeq ? 'text-white' : 'text-slate-400'}>High (80-100)</span>
                                <span className={isHigherMeq ? 'text-emerald-400' : 'text-slate-500'}>92% response</span>
                            </div>
                            <div className="h-6 w-full bg-slate-800 rounded-md overflow-hidden flex">
                                <div className={`h-full ${isHigherMeq ? 'bg-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-600'}`} style={{ width: '92%' }}></div>
                            </div>
                        </div>

                        {/* Medium Bracket */}
                        <div className={`relative z-0 group ${isMediumMeq ? 'opacity-100' : 'opacity-40'}`}>
                            <div className="flex justify-between text-xs mb-1.5 font-semibold">
                                <span className={isMediumMeq ? 'text-white' : 'text-slate-400'}>Medium (50-79)</span>
                                <span className={isMediumMeq ? 'text-amber-400' : 'text-slate-500'}>67% response</span>
                            </div>
                            <div className="h-6 w-full bg-slate-800 rounded-md overflow-hidden flex">
                                <div className={`h-full ${isMediumMeq ? 'bg-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-slate-600'}`} style={{ width: '67%' }}></div>
                            </div>
                        </div>

                        {/* Low Bracket */}
                        <div className={`relative z-0 group ${isLowMeq ? 'opacity-100' : 'opacity-40'}`}>
                            <div className="flex justify-between text-xs mb-1.5 font-semibold">
                                <span className={isLowMeq ? 'text-white' : 'text-slate-400'}>Low (&lt;50)</span>
                                <span className={isLowMeq ? 'text-red-400' : 'text-slate-500'}>34% response</span>
                            </div>
                            <div className="h-6 w-full bg-slate-800 rounded-md overflow-hidden flex">
                                <div className={`h-full ${isLowMeq ? 'bg-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-slate-600'}`} style={{ width: '34%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Action Prompts */}
            <div className="pt-4 border-t border-slate-700/50 flex justify-end">
                {(!data.responseAchieved && meq30 < 50) ? (
                    <div className="flex items-center gap-4 w-full justify-between bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
                        <div className="flex items-center gap-3 text-amber-300 text-sm font-medium">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <span>Low experience depth + limited response — consider dose escalation review.</span>
                        </div>
                        {onOpenDosingProtocol && (
                            <button onClick={onOpenDosingProtocol} className="whitespace-nowrap flex items-center gap-2 px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 font-bold text-sm rounded-lg transition-colors">
                                Open Dosing Protocol
                            </button>
                        )}
                    </div>
                ) : (data.responseAchieved && meq30 > 70) ? (
                    <div className="flex items-center gap-4 w-full justify-between bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                        <div className="flex items-center gap-3 text-emerald-300 text-sm font-medium">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            <span>Strong response sustained. Validated for discharge or standard integration.</span>
                        </div>
                        {onGenerateDischarge && (
                            <button onClick={onGenerateDischarge} className="whitespace-nowrap flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-lg transition-colors shadow-lg">
                                Generate Discharge Summary
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ) : null}
            </div>

        </div>
    );
};
