import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
    FlaskConical, Dna, Clock, Zap, Activity,
    ArrowRight, Microscope, Info
} from 'lucide-react';
import { ChartSkeleton } from './ChartSkeleton';
import { CustomTooltip } from './CustomTooltip';

// --- MOCK PHARMACOLOGY DATA ---
interface MoleculeData {
    id: string;
    name: string;
    class: string;
    formula: string;
    halfLife: string;
    mechanism: string;
    description: string;
    color: string;
    affinities: { receptor: string; value: number; role: string }[];
}

const MOLECULES: Record<string, MoleculeData> = {
    'Psilocybin': {
        id: 'PSIL', name: 'Psilocybin', class: 'Tryptamine',
        formula: 'C₁₂H₁₇N₂O₄P', halfLife: '2-3 Hours',
        mechanism: '5-HT2A Partial Agonist',
        color: '#10b981', // Emerald
        description: 'Prodrug for Psilocin. Structurally similar to Serotonin. Primary effects mediated via 5-HT2A activation in the Default Mode Network.',
        affinities: [
            { receptor: '5-HT2A', value: 95, role: 'Visuals / Plasticity' },
            { receptor: '5-HT1A', value: 60, role: 'Mood / Anxiety' },
            { receptor: 'D2', value: 10, role: 'Euphoria' },
            { receptor: 'Adrenergic', value: 20, role: 'Stimulation' }
        ]
    },
    'MDMA': {
        id: 'MDMA', name: 'MDMA', class: 'Amphetamine',
        formula: 'C₁₁H₁₅NO₂', halfLife: '6-7 Hours',
        mechanism: 'Serotonin Releasing Agent',
        color: '#f59e0b', // Amber
        description: 'Empathogen-entactogen. Causes massive release of presynaptic Serotonin, followed by Dopamine and Norepinephrine.',
        affinities: [
            { receptor: 'SERT', value: 100, role: 'Empathy / Mood' },
            { receptor: '5-HT2A', value: 30, role: 'Visuals' },
            { receptor: 'D2', value: 60, role: 'Reward' },
            { receptor: 'Adrenergic', value: 85, role: 'Energy / HR' }
        ]
    },
    'LSD': {
        id: 'LSD', name: 'LSD-25', class: 'Ergoline',
        formula: 'C₂₀H₂₅N₃O', halfLife: '3-4 Hours',
        mechanism: '5-HT2A Agonist (Promiscuous)',
        color: '#8b5cf6', // Violet
        description: 'Exceptionally potent agonist with complex binding kinetics ("The Lid"). High affinity for Dopaminergic pathways explains stimulating effects.',
        affinities: [
            { receptor: '5-HT2A', value: 98, role: 'Visuals / Plasticity' },
            { receptor: '5-HT1A', value: 75, role: 'Mood' },
            { receptor: 'D2', value: 80, role: 'Stimulation' },
            { receptor: 'Adrenergic', value: 65, role: 'Wakefulness' }
        ]
    },
    'Ketamine': {
        id: 'KET', name: 'Ketamine', class: 'Arylcyclohexylamine',
        formula: 'C₁₃H₁₆ClNO', halfLife: '2.5 Hours',
        mechanism: 'NMDA Antagonist',
        color: '#3b82f6', // Blue
        description: 'Dissociative anesthetic. Blocks NMDA receptors on GABA interneurons, leading to a "Glutamate Burst" and rapid synaptogenesis.',
        affinities: [
            { receptor: 'NMDA', value: 95, role: 'Dissociation' },
            { receptor: 'AMPA', value: 70, role: 'Plasticity' },
            { receptor: 'Mu-Opioid', value: 25, role: 'Analgesia' },
            { receptor: 'D2', value: 30, role: 'Euphoria' }
        ]
    }
};

export default function MolecularPharmacology() {
    const [activeMol, setActiveMol] = useState('Psilocybin');
    const [chartReady, setChartReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setChartReady(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const data = MOLECULES[activeMol];

    return (
        <div className="w-full bg-[#0f1218] p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-8 h-full overflow-y-auto custom-scrollbar">
            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div title="Visualizing receptor binding potential ($K_i$ affinity) across target sites">
                    <h2 className="text-xl font-black text-slate-300 tracking-tighter flex items-center gap-2">
                        <Dna className="text-indigo-500" />
                        Molecular Bridge
                    </h2>
                    <p className="text-sm text-slate-300 font-medium mt-1">
                        Receptor Binding Potential (Standardized $K_i$ Affinity).
                    </p>
                </div>
                <div className="w-full md:w-auto overflow-x-auto pb-1 no-scrollbar">
                    <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800 min-w-max">
                        {Object.keys(MOLECULES).map((key) => (
                            <button
                                key={key}
                                onClick={() => setActiveMol(key)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all min-h-[40px] ${activeMol === key
                                    ? 'bg-indigo-600 text-slate-300 shadow-lg'
                                    : 'text-slate-500 hover:text-slate-300'
                                    }`}
                                title={`Load pharmacology data for ${key}`}
                            >
                                {key}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">

                {/* LEFT: The Chart */}
                <div className="lg:col-span-2 bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 relative min-h-[300px] flex flex-col">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest absolute top-4 left-4 z-10">
                        Binding Strength (Relative Potency)
                    </h3>
                    <div className="flex-1 w-full h-full min-h-[250px]" role="img" aria-label={`Bar chart showing receptor binding affinities for ${data.name}`}>
                        {!chartReady ? (
                            <ChartSkeleton height="100%" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.affinities} layout="vertical" margin={{ top: 40, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.3} />
                                    <XAxis type="number" hide domain={[0, 100]} />
                                    <YAxis
                                        dataKey="receptor"
                                        type="category"
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                                        width={60}
                                        interval={0}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#ffffff', opacity: 0.05 }}
                                        content={({ active, payload, label }) => {
                                            if (!payload || !payload.length) return null;
                                            return (
                                                <CustomTooltip
                                                    active={active}
                                                    payload={[{ ...payload[0], name: 'Binding Affinity', value: `${payload[0].value}%` }]}
                                                    label={label as string}
                                                    clinicalContext={`Role: ${payload[0].payload.role}`}
                                                />
                                            );
                                        }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32} animationDuration={800}>
                                        {data.affinities.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={data.color} fillOpacity={0.8} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* RIGHT: Molecule Dossier */}
                <div className="flex flex-col gap-4">

                    {/* Formula Card */}
                    <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-700 rounded-2xl relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 transition-colors duration-500`} style={{ backgroundColor: data.color }}></div>

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 shadow-lg">
                                <FlaskConical className="w-6 h-6 text-slate-300" />
                            </div>
                            <span className="text-4xl font-black text-slate-800 select-none opacity-50 group-hover:text-slate-700 transition-colors">3D</span>
                        </div>

                        <h3 className="text-2xl font-black text-slate-300 tracking-tight mb-1 relative z-10">{data.name}</h3>
                        <p className="text-sm font-mono text-indigo-400 mb-4 relative z-10">{data.formula}</p>

                        <div className="space-y-3 relative z-10">
                            <div className="flex items-center justify-between p-2 bg-black/20 rounded-lg border border-white/5">
                                <span className="text-xs text-slate-500 font-bold uppercase">Class</span>
                                <span className="text-xs font-medium text-slate-300">{data.class}</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-black/20 rounded-lg border border-white/5">
                                <span className="text-xs text-slate-500 font-bold uppercase">Half-Life</span>
                                <span className="text-xs font-medium text-slate-300">{data.halfLife}</span>
                            </div>
                        </div>
                    </div>

                    {/* Mechanism Description */}
                    <div className="p-5 bg-slate-900/30 border border-slate-800 rounded-2xl flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                            <Microscope className="w-4 h-4 text-slate-300" />
                            <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">Mechanism of Action</h4>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed flex-1">
                            {data.description}
                        </p>

                        <div className="mt-4 pt-4 border-t border-slate-800">
                            <div className="flex items-start gap-2" title="Important clinical considerations">
                                <Info className="w-3 h-3 text-indigo-400 mt-0.5 shrink-0" />
                                <p className="text-sm text-slate-500 leading-tight">
                                    <strong className="text-slate-300">Clinical Note:</strong> {data.id === 'MDMA' ? 'Check cardiac history.' : data.id === 'KET' ? 'Monitor blood pressure.' : 'Screen for psychosis history.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
