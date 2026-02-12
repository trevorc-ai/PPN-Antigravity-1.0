import React, { useState } from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, ReferenceArea, ReferenceLine
} from 'recharts';
import {
    Users, Search, Lightbulb, X, Activity,
    Calendar, Pill, ArrowRight, BrainCircuit, Info, FileText
} from 'lucide-react';

// --- SCHEMA-READY MOCK DATA ---
// This structure mimics the future Supabase response interface
interface PatientNode {
    x: number; // Resistance Score (0-100)
    y: number; // Symptom Severity (PHQ-9)
    id: string;
    outcome: string;
    protocol: string;
    cluster: 'cohort' | 'responder' | 'current';
    details: {
        age: number;
        sex: string;
        diagnosis: string;
        medications: string[];
        sessions: number;
        timeline: { week: number; score: number }[];
        clinician_notes: string;
    };
}

const MOCK_DATA: PatientNode[] = [
    // Current Patient (The Anchor)
    {
        x: 75,
        y: 18,
        id: 'PT-8832 (Current)',
        outcome: 'Active',
        protocol: 'Pending',
        cluster: 'current',
        details: {
            age: 34,
            sex: 'M',
            diagnosis: 'TRD',
            medications: ['Lexapro'],
            sessions: 0,
            timeline: [],
            clinician_notes: 'High resistance profile. Evaluating options.'
        }
    },
    // The "Responders" (Success Stories)
    {
        x: 72,
        y: 16,
        id: 'ANON-9921',
        outcome: 'Remission',
        protocol: 'IM Ketamine (60mg)',
        cluster: 'responder',
        details: {
            age: 31,
            sex: 'F',
            diagnosis: 'TRD',
            medications: ['Prozac', 'Wellbutrin'],
            sessions: 6,
            timeline: [{ week: 0, score: 22 }, { week: 2, score: 14 }, { week: 4, score: 9 }, { week: 6, score: 6 }],
            clinician_notes: 'Rapid response after Session 2. Maintenance scheduled.'
        }
    },
    {
        x: 78,
        y: 19,
        id: 'ANON-9922',
        outcome: 'Remission',
        protocol: 'IM Ketamine + IFS',
        cluster: 'responder',
        details: {
            age: 40,
            sex: 'M',
            diagnosis: 'C-PTSD',
            medications: ['Lamictal'],
            sessions: 8,
            timeline: [{ week: 0, score: 24 }, { week: 4, score: 15 }, { week: 8, score: 5 }],
            clinician_notes: 'IFS integration was key to unlocking trauma blocks.'
        }
    },
    // The "Cohort" (Context)
    {
        x: 45,
        y: 22,
        id: 'ANON-103',
        outcome: 'Non-Responder',
        protocol: 'Oral Ketamine',
        cluster: 'cohort',
        details: {
            age: 29,
            sex: 'F',
            diagnosis: 'PTSD',
            medications: [],
            sessions: 6,
            timeline: [{ week: 0, score: 24 }, { week: 6, score: 22 }],
            clinician_notes: 'Dissociation limited therapeutic depth.'
        }
    },
    {
        x: 20,
        y: 10,
        id: 'ANON-101',
        outcome: 'Partial',
        protocol: 'Psilocybin (25mg)',
        cluster: 'cohort',
        details: {
            age: 55,
            sex: 'M',
            diagnosis: 'MDD',
            medications: ['Zoloft'],
            sessions: 2,
            timeline: [{ week: 0, score: 18 }, { week: 4, score: 12 }],
            clinician_notes: 'Moderate improvement. Considering dose increase.'
        }
    },
    // Add more dots for density
    {
        x: 68,
        y: 17,
        id: 'ANON-9924',
        outcome: 'Remission',
        protocol: 'IM Ketamine',
        cluster: 'responder',
        details: { age: 35, sex: 'F', diagnosis: 'TRD', medications: [], sessions: 6, timeline: [], clinician_notes: '' }
    },
    {
        x: 82,
        y: 20,
        id: 'ANON-9926',
        outcome: 'Significant Drop',
        protocol: 'IM Ketamine + EMDR',
        cluster: 'responder',
        details: { age: 39, sex: 'M', diagnosis: 'PTSD', medications: [], sessions: 6, timeline: [], clinician_notes: '' }
    },
    {
        x: 30,
        y: 15,
        id: 'ANON-102',
        outcome: 'Partial',
        protocol: 'MDMA-AT',
        cluster: 'cohort',
        details: { age: 28, sex: 'F', diagnosis: 'PTSD', medications: [], sessions: 3, timeline: [], clinician_notes: '' }
    },
];

const DossierModal = ({ patient, onClose }: { patient: PatientNode; onClose: () => void }) => (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
        <div className="bg-[#0f1218] border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors z-10"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Modal Content Wrapper */}
            <div className="px-6 pt-6 pb-2">
                <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                    {patient.id}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                    {patient.details.age}y {patient.details.sex} • {patient.details.diagnosis}
                </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Protocol */}
                <div className="space-y-6">
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Protocol Used</span>
                        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                            <div className="flex items-center gap-2 mb-1">
                                <BrainCircuit className="w-4 h-4 text-indigo-400" />
                                <span className="font-bold text-indigo-300">{patient.protocol}</span>
                            </div>
                            <p className="text-xs text-indigo-200/60 mt-1">{patient.details.sessions} Sessions Completed</p>
                        </div>
                    </div>

                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Clinical Outcome</span>

                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="text-3xl font-black text-white">{patient.outcome}</div>
                                {patient.details.timeline.length > 0 && (
                                    <div className="text-xs font-mono text-emerald-400">
                                        {patient.details.timeline[0].score} &rarr; {patient.details.timeline[patient.details.timeline.length - 1].score} (PHQ-9)
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Right Column: Context */}
                <div className="space-y-6">
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Concomitant Meds</span>
                        <div className="flex flex-wrap gap-2">
                            {patient.details.medications.length > 0 ? (
                                patient.details.medications.map(med => (
                                    <span key={med} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs font-medium text-slate-300">
                                        {med}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-slate-600">None reported</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Clinician Notes</span>
                        <p className="text-xs text-slate-400 italic leading-relaxed border-l-2 border-slate-700 pl-3">
                            "{patient.details.clinician_notes}"
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-slate-900/30 border-t border-slate-800 text-center">
                <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center justify-center gap-2 group">
                    View Full Clinical Logs
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    </div>
);

export default function PatientConstellation() {
    const [selectedPatient, setSelectedPatient] = useState<PatientNode | null>(null);
    const [showGuide, setShowGuide] = useState(false);

    return (
        <div className="w-full bg-[#0f1218] p-3 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl relative min-h-[400px] sm:h-[500px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 z-10 relative shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Search className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div title="Scatter plot visualizing patient outcomes based on treatment resistance and symptom severity">
                        <h3 className="text-lg font-black text-white tracking-tight">Patient Galaxy Analysis</h3>
                        <p className="text-xs text-slate-400 font-medium">Clustering patient outcomes by resistance levels to identify optimal protocols.</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowGuide(!showGuide)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors"
                    title="How to read this chart"
                >
                    <Info className="w-5 h-5" />
                </button>
            </div>

            {/* Educational Guide Popover */}
            {showGuide && (
                <div className="absolute top-16 right-6 w-72 bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl z-20 animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Lightbulb className="w-3 h-3 text-amber-400" /> Interpreting the Galaxy
                    </h4>
                    <ul className="space-y-3 text-[11px] text-slate-400 leading-relaxed">
                        <li><strong className="text-slate-200">X-Axis (Resistance):</strong> Treatment Resistance Score (Count of prior failed trials).</li>
                        <li><strong className="text-slate-200">Y-Axis (Severity):</strong> Current Symptom Load (PHQ-9 / CAPS-5). Top = Severe.</li>
                        <li><strong className="text-emerald-400">Green Nodes:</strong> "Responder" Cohort (Remission Achieved). Click to analyze protocol & duration.</li>
                    </ul>
                </div>
            )}

            {/* Chart Area */}
            <div className="flex-1 w-full min-h-0 relative z-0">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                        <XAxis
                            type="number" dataKey="x" name="Resistance" domain={[0, 100]}
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            label={{ value: 'Treatment Resistance Score', position: 'insideBottom', offset: -10, fill: '#475569', fontSize: 11, fontWeight: 700 }}
                        />
                        <YAxis
                            type="number" dataKey="y" name="Severity" domain={[0, 30]}
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            label={{ value: 'Symptom Severity (PHQ-9)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 11, fontWeight: 700 }}
                        />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-slate-900/95 backdrop-blur border border-slate-700 p-3 rounded-lg shadow-xl z-50">
                                            <p className="text-white font-bold text-xs mb-1">{data.id}</p>
                                            <p className="text-xs text-slate-400">Diagnosis: <span className="text-slate-300">{data.details.diagnosis}</span></p>
                                            <p className="text-xs text-slate-400">Outcome: <span className={data.outcome === 'Remission' ? 'text-emerald-400' : 'text-slate-300'}>{data.outcome}</span></p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />

                        {/* Reference Zones */}
                        {/* @ts-ignore */}
                        <ReferenceArea x1={60} x2={100} y1={15} y2={30} fill="#6366f1" fillOpacity={0.05} />
                        <Scatter
                            name="Patients"
                            data={MOCK_DATA}
                            onClick={(node) => setSelectedPatient(node.payload)}
                            className="cursor-pointer"
                            fill="#818cf8"
                        >
                            {MOCK_DATA.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fillOpacity={entry.cluster === 'cohort' ? 0.8 : 1}
                                />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
                {/* Overlay Pulse for Current Patient */}
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center">
                    {/* Maps to where x=75, y=18 roughly is, purely visual for now if needed, but the cell is already there */}
                </div>
            </div>

            {/* Footer Insight */}
            <div className="mt-auto p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-start gap-3 shrink-0">
                <Activity className="w-4 h-4 text-emerald-500 mt-0.5" />
                <p className="text-[11px] text-emerald-100/70 leading-relaxed">
                    <strong className="text-emerald-400">Analysis:</strong> 74% of nearest neighbors (high resistance / high severity) achieved remission using <strong className="text-emerald-400">IM Ketamine + IFS</strong>.
                </p>
            </div>

            {/* Modal Render */}
            {selectedPatient && <DossierModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />}
        </div>
    );
}
