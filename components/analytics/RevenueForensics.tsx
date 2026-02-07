import React from 'react';
import { DollarSign, Database, Scan } from 'lucide-react';

export default function RevenueForensics() {
    return (
        <div className="bg-[#0f1218] border border-slate-800 rounded-3xl p-6 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6">
                <Scan className="w-5 h-5 text-purple-500" />
                <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest">Revenue Forensics</h3>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-4">
                <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Potential Capture</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white tracking-tighter">$14,040</span>
                        <span className="text-[10px] font-bold text-emerald-500">+12.4%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">Derived from 312 billable hours</p>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-t border-slate-800/50">
                        <span className="text-[10px] font-bold text-slate-400">Code Applied</span>
                        <span className="font-mono text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">CPT III: 0820T</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-slate-800/50">
                        <span className="text-[10px] font-bold text-slate-400">Scan Target</span>
                        <span className="text-[10px] font-medium text-slate-300">Monitored Dosing</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/50">
                <div className="flex items-center gap-2 mb-1.5">
                    <Database className="w-3 h-3 text-slate-500" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Scan Query</span>
                </div>
                <div className="bg-[#0a0c10] rounded-lg p-2 border border-slate-800 font-mono text-[9px] text-slate-400 leading-relaxed overflow-x-auto">
                    SELECT * FROM clinical_logs WHERE duration &gt; 120
                </div>
            </div>
        </div>
    );
}
