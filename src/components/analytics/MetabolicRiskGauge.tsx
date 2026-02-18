import React, { useState, useMemo } from 'react';
import {
    RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, Layer
} from 'recharts';
import {
    Dna, AlertTriangle, CheckCircle2, Zap,
    Activity, Pill, ArrowRight, Gauge
} from 'lucide-react';

// --- MOCK PHARMACOGENOMIC RULES ---
// In production, this comes from 'ref_metabolic_rules' table
interface MetabolicRule {
    substance: string;
    status: 'Poor' | 'Intermediate' | 'Normal' | 'Rapid' | 'Ultra-Rapid';
    riskLevel: 'High' | 'Moderate' | 'Low';
    score: number; // 0-100 for gauge position (0=Safe, 100=Toxic)
    color: string;
    recommendation: string;
    mechanism: string;
}

const METABOLIC_RULES: MetabolicRule[] = [
    // MDMA (CYP2D6 Substrate)
    { substance: 'MDMA', status: 'Poor', riskLevel: 'High', score: 90, color: '#f43f5e', recommendation: 'CONTRAINDICATED: Risk of Serotonin Syndrome. Reduce dose by 75% or avoid.', mechanism: 'CYP2D6 deficiency prevents clearance.' },
    { substance: 'MDMA', status: 'Intermediate', riskLevel: 'Moderate', score: 65, color: '#f59e0b', recommendation: 'CAUTION: Extend observation period. Reduce dose by 25%.', mechanism: 'Reduced clearance rate.' },
    { substance: 'MDMA', status: 'Normal', riskLevel: 'Low', score: 10, color: '#10b981', recommendation: 'Standard Protocol.', mechanism: 'Normal metabolism.' },
    { substance: 'MDMA', status: 'Ultra-Rapid', riskLevel: 'Moderate', score: 40, color: '#f59e0b', recommendation: 'Low Efficacy risk. Consider split-dosing strategy.', mechanism: 'Rapid clearance reduces peak effect.' },

    // Psilocybin (Glucuronidation - Less CYP dependent)
    { substance: 'Psilocybin', status: 'Poor', riskLevel: 'Low', score: 15, color: '#10b981', recommendation: 'Standard Protocol. Minor duration increase possible.', mechanism: 'Primary clearance via Glucuronidation (UGT).' },
    { substance: 'Psilocybin', status: 'Normal', riskLevel: 'Low', score: 5, color: '#10b981', recommendation: 'Standard Protocol.', mechanism: 'Normal metabolism.' },

    // Ketamine (CYP3A4/2B6)
    { substance: 'Ketamine', status: 'Poor', riskLevel: 'Moderate', score: 60, color: '#f59e0b', recommendation: 'Monitor sedation depth. Expect prolonged dissociation.', mechanism: 'CYP3A4/2B6 competition.' },
    { substance: 'Ketamine', status: 'Normal', riskLevel: 'Low', score: 10, color: '#10b981', recommendation: 'Standard Protocol.', mechanism: 'Normal metabolism.' },
];

export default function MetabolicRiskGauge() {
    const [selectedSubstance, setSelectedSubstance] = useState('MDMA');
    const [selectedStatus, setSelectedStatus] = useState('Normal');

    // Find matching rule
    const activeRule = useMemo(() => {
        return METABOLIC_RULES.find(r => r.substance === selectedSubstance && r.status === selectedStatus) ||
            { substance: selectedSubstance, status: selectedStatus, riskLevel: 'Unknown', score: 0, color: '#64748b', recommendation: 'No data available.', mechanism: 'Unknown pathway.' };
    }, [selectedSubstance, selectedStatus]);

    // Data for Radial Chart
    const chartData = [{ name: 'Risk', value: activeRule.score, fill: activeRule.color }];

    return (
        <div className="w-full bg-[#0f1218] p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6 h-full relative overflow-y-auto custom-scrollbar">

            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-10 transition-colors duration-700 pointer-events-none`}
                style={{ backgroundColor: activeRule.color }}></div>

            {/* HEADER */}
            <div className="relative z-10" title="Assessing toxicity risk interactions using patient CYP450 genomic markers">
                <h2 className="text-xl font-black text-slate-300 tracking-tighter flex items-center gap-2">
                    <Gauge className="text-indigo-500" />
                    Metabolic Risk Gauge
                </h2>
                <p className="text-sm text-slate-300 font-medium mt-1">
                    CYP450 Genomic Safety Check.
                </p>
            </div>

            {/* CONTROLS */}
            <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Protocol Substance</label>
                    <div className="relative">
                        <select
                            value={selectedSubstance}
                            onChange={(e) => setSelectedSubstance(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs font-bold text-slate-300 appearance-none focus:ring-1 focus:ring-indigo-500 outline-none"
                        >
                            <option value="MDMA">MDMA (Midomafetamine)</option>
                            <option value="Psilocybin">Psilocybin (COMP360)</option>
                            <option value="Ketamine">Ketamine (Racemic)</option>
                        </select>
                        <Pill className="absolute right-3 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Genomic Status</label>
                    <div className="relative">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs font-bold text-slate-300 appearance-none focus:ring-1 focus:ring-indigo-500 outline-none"
                            title="Select patient's metabolizer status (from genetic test)"
                        >
                            <option value="Poor">Poor Metabolizer (PM)</option>
                            <option value="Intermediate">Intermediate (IM)</option>
                            <option value="Normal">Normal (EM)</option>
                            <option value="Rapid">Rapid Metabolizer (RM)</option>
                            <option value="Ultra-Rapid">Ultra-Rapid (UM)</option>
                        </select>
                        <Dna className="absolute right-3 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* GAUGE & RESULT */}
            <div className="flex-1 flex flex-col items-center justify-center relative min-h-[200px]">
                {/* Chart Layer */}
                <div className="absolute inset-0 z-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            innerRadius="70%"
                            outerRadius="100%"
                            barSize={20}
                            data={chartData}
                            startAngle={180}
                            endAngle={0}
                        >
                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                            <RadialBar background={{ fill: '#1e293b' }} dataKey="value" cornerRadius={10} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                </div>

                {/* Center Content */}
                <div className="relative z-10 text-center -mt-10">
                    <div className={`text-4xl font-black tracking-tighter transition-colors duration-500`} style={{ color: activeRule.color }}>
                        {activeRule.riskLevel}
                    </div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Toxicity Risk
                    </div>
                </div>
            </div>

            {/* ACTION CARD */}
            <div className={`p-4 rounded-xl border relative z-10 transition-all duration-500 ${activeRule.riskLevel === 'High' ? 'bg-rose-500/10 border-rose-500/30' :
                activeRule.riskLevel === 'Moderate' ? 'bg-amber-500/10 border-amber-500/30' :
                    'bg-emerald-500/10 border-emerald-500/30'
                }`}>
                <div className="flex items-start gap-3" title="Clinical action required based on genomic risk">
                    {activeRule.riskLevel === 'High' ? <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" /> :
                        activeRule.riskLevel === 'Moderate' ? <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" /> :
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}

                    <div>
                        <h4 className={`text-xs font-black uppercase tracking-widest mb-1 ${activeRule.riskLevel === 'High' ? 'text-rose-400' :
                            activeRule.riskLevel === 'Moderate' ? 'text-amber-400' :
                                'text-emerald-400'
                            }`}>
                            Clinical Guidance
                        </h4>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed">
                            {activeRule.recommendation}
                        </p>
                        <p className="text-sm text-slate-500 mt-2 font-mono">
                            Mechanism: {activeRule.mechanism}
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
