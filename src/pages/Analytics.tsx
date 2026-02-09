import React from 'react';
import {
    ShieldCheck
} from 'lucide-react';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import ClinicPerformanceRadar from '../components/analytics/ClinicPerformanceRadar';
import PatientConstellation from '../components/analytics/PatientConstellation';
import ProtocolEfficiency from '../components/analytics/ProtocolEfficiency';
import MolecularPharmacology from '../components/analytics/MolecularPharmacology';
import MetabolicRiskGauge from '../components/analytics/MetabolicRiskGauge';



const Analytics = () => {
    return (
        <PageContainer className="space-y-8 animate-in fade-in duration-700 pb-20 pt-8">

            {/* HEADER */}
            <Section spacing="tight" className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-5xl font-black tracking-tighter text-white">
                            Clinical Intelligence
                        </h1>
                        <div className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-xs font-mono text-indigo-400 tracking-widest font-black" title="Current Active Node ID">
                            LIVE_NODE_07
                        </div>
                    </div>
                    <p className="text-slate-400 text-xl sm:text-2xl font-medium max-w-4xl leading-relaxed mt-4">
                        This dashboard provides real-time insights into clinical outcomes and safety metrics. It aggregates data from across the network to help you make informed treatment decisions.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3" title="Current Node Compliance Audit Status">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <div>
                            <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Compliance Status</div>
                            <div className="text-sm font-bold text-white">Audit Ready (Grade A)</div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* KPI RIBBON (Layer 1) */}
            <Section spacing="tight" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Active Protocols', value: '124', trend: '+12%', color: 'text-blue-400' },
                    { label: 'Patient Alerts', value: '3', trend: '-2', color: 'text-amber-400' },
                    { label: 'Network Efficiency', value: '94.2%', trend: '+0.8%', color: 'text-emerald-400' },
                    { label: 'Global Risk Score', value: 'Low', trend: 'Stable', color: 'text-slate-400' }
                ].map((stat, i) => (
                    <div key={i} className="bg-[#0a0c12]/50 border border-slate-800/50 p-4 rounded-2xl h-full flex flex-col justify-between">
                        <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</div>
                        <div className="flex items-baseline gap-2">
                            <div className={`text-3xl font-black ${stat.color} tracking-tight`}>{stat.value}</div>
                            <div className="text-xs font-bold text-slate-400 bg-slate-900/50 px-2 py-0.5 rounded border border-slate-800">{stat.trend}</div>
                        </div>
                    </div>
                ))}
            </Section>

            {/* FILTER CONTROLS (Layer 2) */}
            <Section spacing="tight" className="sticky top-4 z-40">
                <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center bg-[#0a0c12]/80 border border-slate-800/80 p-2 rounded-2xl backdrop-blur-xl shadow-2xl">
                    <div className="flex items-center gap-2 px-2">
                        <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                            <span className="material-symbols-outlined text-indigo-400 text-lg">tune</span>
                        </div>
                        <span className="text-xs font-black text-white uppercase tracking-widest hidden md:block">Filters</span>
                    </div>

                    <div className="h-6 w-px bg-slate-800 hidden xl:block"></div>

                    <div className="flex-1 flex flex-col md:flex-row gap-2">
                        <select className="bg-black/40 border border-slate-700/50 text-xs font-bold text-white rounded-lg px-3 py-2 outline-none focus:border-indigo-500/50 uppercase tracking-wider">
                            <option>All Molecules</option>
                            <option>Psilocybin</option>
                            <option>MDMA</option>
                            <option>Ketamine</option>
                        </select>
                        <select className="bg-black/40 border border-slate-700/50 text-xs font-bold text-white rounded-lg px-3 py-2 outline-none focus:border-indigo-500/50 uppercase tracking-wider">
                            <option>Last 30 Days</option>
                            <option>Last Quarter</option>
                            <option>YTD</option>
                        </select>
                        <div className="relative flex-1">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
                            <input
                                type="text"
                                placeholder="Filter by protocol ID..."
                                className="w-full bg-black/40 border border-slate-700/50 text-xs font-bold text-white rounded-lg pl-9 pr-3 py-2 outline-none focus:border-indigo-500/50 placeholder:text-slate-600 uppercase tracking-wider"
                            />
                        </div>
                    </div>
                </div>
            </Section>

            {/* COMPONENT GRID */}
            <Section spacing="default" className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* ROW 1: CLINIC PERFORMANCE (Overview) */}
                <div className="space-y-3 xl:col-span-2">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-400 tracking-tight ml-1" title="Real-time clinic performance metrics across key indicators vs. Network Average">
                            Performance Radar
                        </h3>
                        <div className="h-px bg-slate-800 flex-1"></div>
                    </div>
                    <div className="h-[500px] overflow-hidden rounded-2xl bg-[#0a0c12]/50 border border-slate-800/50 relative">
                        <ClinicPerformanceRadar />
                    </div>
                </div>

                {/* ROW 2: PATIENT GALAXY (Deep Dive) */}
                <div className="space-y-3 xl:col-span-2">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-400 tracking-tight ml-1" title="Cluster analysis of patient outcomes based on treatment resistance and symptom severity">
                            Patient Galaxy
                        </h3>
                        <div className="h-px bg-slate-800 flex-1"></div>
                    </div>
                    <div className="h-[500px] overflow-hidden rounded-2xl bg-[#0a0c12]/50 border border-slate-800/50 relative">
                        <PatientConstellation />
                    </div>
                </div>

                {/* ROW 3: MOLECULAR & GENOMIC (Mechanism) */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-400 tracking-tight ml-1" title="Receptor binding profiles and molecular affinity data">
                            Molecular Bridge
                        </h3>
                        <div className="h-px bg-slate-800 flex-1"></div>
                    </div>
                    <div className="h-[500px] overflow-hidden rounded-2xl bg-[#0a0c12]/50 border border-slate-800/50 relative">
                        <MolecularPharmacology />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-400 tracking-tight ml-1" title="Patient metabolic risk analysis based on CYP450 genomic markers">
                            Genomic Safety
                        </h3>
                        <div className="h-px bg-slate-800 flex-1"></div>
                    </div>
                    <div className="h-[500px] overflow-hidden rounded-2xl bg-[#0a0c12]/50 border border-slate-800/50 relative">
                        <MetabolicRiskGauge />
                    </div>
                </div>

                {/* ROW 4: ROI (Financial) */}
                <div className="space-y-3 xl:col-span-2">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-400 tracking-tight ml-1" title="Financial efficiency modeling and protocol margin analysis">
                            Protocol ROI
                        </h3>
                        <div className="h-px bg-slate-800 flex-1"></div>
                    </div>
                    <div className="h-[500px] overflow-hidden rounded-2xl bg-[#0a0c12]/50 border border-slate-800/50 relative">
                        <ProtocolEfficiency />
                    </div>
                </div>

            </Section>
        </PageContainer>
    );
};

export default Analytics;