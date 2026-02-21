import React from 'react';
import {
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    Radar, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { Substance } from '../../types';

interface AffinityRadarProps {
    substance: Substance;
}

// Logarithmic normalization: lower Ki (higher affinity) → higher score
// Ki range: 1 nM (score 100) to >10000 nM (score 0)
function normalizeKi(ki: number): number {
    if (ki >= 10000) return 4;
    if (ki <= 1) return 100;
    // log10 scale: 1 nM = 100, 10 nM = 75, 100 nM = 50, 1000 nM = 25, 10000 nM = 4
    return Math.round(100 - (Math.log10(ki) / Math.log10(10000)) * 96);
}

const AXIS_LABELS: Record<string, string> = {
    '5-HT2A': '5-HT2A',
    '5-HT1A': '5-HT1A',
    '5-HT2C': '5-HT2C',
    'D2': 'D2',
    'SERT': 'SERT',
    'NMDA': 'NMDA',
};

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    if (!d) return null;
    return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 shadow-xl">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{d.subject}</p>
            <p className="text-sm font-bold text-slate-200 mt-0.5">Score: {d.score}</p>
            <p className="text-[11px] text-slate-500 font-mono">Ki ≈ {d.rawKi >= 10000 ? '>10,000 nM' : `${d.rawKi} nM`}</p>
        </div>
    );
};

/**
 * AffinityRadar — receptor binding affinity radar chart.
 * Slot 2 of the Monograph right column.
 *
 * Uses per-substance kiProfile from constants.ts (Sprint 1 static).
 * Sprint 2 will swap to live Supabase query.
 *
 * Lower Ki (stronger binding) → higher radar score via log10 normalization.
 */
const AffinityRadar: React.FC<AffinityRadarProps> = ({ substance: sub }) => {
    const ki = sub.kiProfile;

    if (!ki) {
        return (
            <section className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 flex items-center justify-center h-64">
                <p className="text-slate-600 text-sm">No affinity data available.</p>
            </section>
        );
    }

    const data = [
        { subject: '5-HT2A', score: normalizeKi(ki.ht2a), rawKi: ki.ht2a },
        { subject: '5-HT1A', score: normalizeKi(ki.ht1a), rawKi: ki.ht1a },
        { subject: '5-HT2C', score: normalizeKi(ki.ht2c), rawKi: ki.ht2c },
        { subject: 'D2', score: normalizeKi(ki.d2), rawKi: ki.d2 },
        { subject: 'SERT', score: normalizeKi(ki.sert), rawKi: ki.sert },
        { subject: 'NMDA', score: normalizeKi(ki.nmda), rawKi: ki.nmda },
    ];

    const isAyahuasca = sub.name === 'Ayahuasca';

    return (
        <section
            className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 backdrop-blur-3xl shadow-2xl flex flex-col"
            aria-labelledby="affinity-heading"
            style={{ minHeight: '380px' }}
        >
            <div className="flex items-center justify-between mb-4">
                <h3
                    id="affinity-heading"
                    className="text-[13px] font-black tracking-[0.2em] uppercase flex items-center gap-3"
                    style={{ color: '#A8B5D1' }}
                >
                    <div
                        className="size-8 rounded-lg flex items-center justify-center border"
                        style={{
                            background: `${sub.color}15`,
                            borderColor: `${sub.color}30`,
                            color: sub.color,
                        }}
                    >
                        <span className="material-symbols-outlined text-lg" aria-hidden="true">hexagon</span>
                    </div>
                    Receptor Affinity
                </h3>
                <span
                    className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border"
                    style={{
                        background: `${sub.color}10`,
                        borderColor: `${sub.color}25`,
                        color: sub.color,
                    }}
                >
                    Ki Profile
                </span>
            </div>

            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height={280}>
                    <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
                        <PolarGrid stroke="#1e293b" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={false}
                            axisLine={false}
                        />
                        <Radar
                            name={sub.name}
                            dataKey="score"
                            stroke={sub.color ?? '#6366f1'}
                            fill={sub.color ?? '#6366f1'}
                            fillOpacity={0.25}
                            strokeWidth={2}
                        />
                        <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <p className="mt-3 text-[10px] text-slate-600 font-medium leading-relaxed">
                Higher score = stronger binding affinity (lower Ki). Log₁₀ normalized.
                Sources: Nichols 2016, Rickli et al. 2016, PDSP Ki Database.
                {isAyahuasca && ' Values represent DMT component only; β-carboline MAO-A inhibition not shown.'}
            </p>
        </section>
    );
};

export default AffinityRadar;
