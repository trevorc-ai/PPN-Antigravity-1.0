import React from 'react';
import {
    ShieldCheck
} from 'lucide-react';
import ClinicPerformanceRadar from '../components/analytics/ClinicPerformanceRadar';
import PatientConstellation from '../components/analytics/PatientConstellation';
import ProtocolEfficiency from '../components/analytics/ProtocolEfficiency';
import MolecularPharmacology from '../components/analytics/MolecularPharmacology';
import MetabolicRiskGauge from '../components/analytics/MetabolicRiskGauge';



const Analytics = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-5xl font-black tracking-tighter text-white">
                            Clinical Intelligence
                        </h1>
                        <div className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-xs font-mono text-indigo-400 tracking-widest font-black">
                            LIVE_NODE_07
                        </div>
                    </div>
                    <p className="text-slate-500 text-xs font-black tracking-[0.3em]">
                        Real-world Evidence & Network Benchmarking
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <div>
                            <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Compliance Status</div>
                            <div className="text-sm font-bold text-white">Audit Ready (Grade A)</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* COMPONENT GRID */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* ROW 1: CLINIC PERFORMANCE (Promoted to Top) */}
                <div className="space-y-2 xl:col-span-2">
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest ml-1">A. Performance Radar</h3>
                    <div className="h-[500px]">
                        <ClinicPerformanceRadar />
                    </div>
                </div>

                {/* ROW 2: PATIENT CLUSTERS & MOLECULAR BRIDGE */}
                <div className="space-y-2">
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest ml-1">B. Patient Clusters</h3>
                    <div className="h-[500px]">
                        <PatientConstellation />
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest ml-1">C. Molecular Bridge</h3>
                    <div className="h-[500px]">
                        <MolecularPharmacology />
                    </div>
                </div>

                {/* ROW 3: ROI & GENOMIC SAFETY */}
                <div className="space-y-2">
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest ml-1">D. Protocol ROI</h3>
                    <div className="h-[500px]">
                        <ProtocolEfficiency />
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest ml-1">E. Genomic Safety</h3>
                    <div className="h-[500px]">
                        <MetabolicRiskGauge />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Analytics;