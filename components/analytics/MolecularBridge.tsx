import React, { useState } from 'react';
import { Hexagon, Zap, Info, Database, Dna, FlaskConical, Disc } from 'lucide-react';

export default function MolecularBridge() {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="bg-[#0f1218] border border-slate-800 rounded-3xl p-6 flex flex-col h-full relative overflow-hidden group">
            {/* Background Gradient Accents */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-50"></div>
            <div className="absolute -left-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header */}
            <div className="flex items-center justify-between mb-8 z-10">
                <div className="flex items-center gap-2">
                    <Dna className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest">Molecular Bridge</h3>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/50 rounded border border-slate-700/50">
                    <Database className="w-3 h-3 text-slate-500" />
                    <span className="text-[9px] font-mono text-slate-500 font-bold uppercase">NIMH-PDSP Database</span>
                </div>
            </div>

            {/* Main Molecular Interaction */}
            <div className="flex items-center justify-between flex-1 relative z-10">
                {/* Left Node: The Compound */}
                <div className="flex flex-col items-center gap-3 w-1/3 group/node">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-center relative overflow-hidden group-hover/node:border-indigo-500/50 transition-colors duration-500">
                            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover/node:opacity-100 transition-opacity duration-500"></div>
                            <Hexagon className="w-8 h-8 text-indigo-400 group-hover/node:scale-110 transition-transform duration-500 mb-0.5" strokeWidth={1.5} />
                            <FlaskConical className="w-3 h-3 text-indigo-300 absolute bottom-3 right-3 opacity-60" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full border border-[#0f1218]"></div>
                    </div>
                    <div className="text-center">
                        <h4 className="text-[11px] font-black text-white uppercase tracking-wider mb-0.5 group-hover/node:text-indigo-300 transition-colors">Psilocin</h4>
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">(4-OH-DMT)</span>
                        <span className="text-[9px] font-bold text-slate-600 bg-slate-800/50 px-1.5 py-0.5 rounded mt-1.5 inline-block border border-slate-800">Tryptamine</span>
                    </div>
                </div>

                {/* Center Bridge: The Metric */}
                <div className="flex-1 flex flex-col items-center justify-center px-2 relative -mt-4">
                    {/* Beam Connection */}
                    <div className="w-full h-[2px] bg-slate-800 relative mb-3">
                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-3/4 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-white rounded-full -translate-y-1/2 shadow-[0_0_10px_white] animate-pulse"></div>
                    </div>

                    {/* K_i Value Display */}
                    <div className="flex flex-col items-center bg-[#0a0c10] border border-indigo-500/30 rounded-lg px-4 py-2 shadow-2xl shadow-indigo-500/10 z-20">
                        <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-widest mb-0.5">Binding Affinity (Ki)</span>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-mono font-black text-white tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">107</span>
                            <span className="text-[10px] font-mono text-slate-400 font-bold">nM</span>
                        </div>
                        <div className="w-full h-0.5 bg-slate-800 mt-1 mb-1 relative overflow-hidden rounded-full">
                            <div className="h-full bg-emerald-500 w-[85%]"></div>
                        </div>
                        <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wide">Strong Agonist</span>
                    </div>
                </div>

                {/* Right Node: The Target */}
                <div className="flex flex-col items-center gap-3 w-1/3 group/target">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center relative overflow-hidden group-hover/target:border-purple-500/50 transition-colors duration-500">
                            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover/target:opacity-100 transition-opacity duration-500"></div>
                            <Disc className="w-8 h-8 text-purple-400 group-hover/target:rotate-90 transition-transform duration-700" strokeWidth={1.5} />
                            <Zap className="w-3 h-3 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/target:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-purple-500 rounded-full border border-[#0f1218] animate-ping opacity-75"></div>
                    </div>
                    <div className="text-center">
                        <h4 className="text-[11px] font-black text-white uppercase tracking-wider mb-0.5 group-hover/target:text-purple-300 transition-colors">5-HT2A</h4>
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Receptor</span>
                        <span className="text-[8px] font-bold text-slate-400 leading-tight mt-1.5 block max-w-[80px] mx-auto">Modulates Neuroplasticity</span>
                    </div>
                </div>
            </div>

            {/* Footer / Educational Tooltip */}
            <div className="mt-6 pt-3 border-t border-slate-800/50 flex items-center justify-between z-10">
                <div className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity cursor-help"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <Info className="w-3 h-3 text-indigo-400" />
                    <span className="text-[9px] font-mono text-slate-400">What is Ki?</span>
                </div>

                {/* Tooltip Popup */}
                <div className={`absolute bottom-12 left-6 right-6 bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl transition-all duration-300 ${showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                    <p className="text-[10px] text-slate-300 leading-relaxed font-medium">
                        Binding affinity (<span className="font-mono text-indigo-300">Ki</span>) measures how tightly a molecule binds.
                        <br />
                        <span className="text-emerald-400">Lower numbers = Stronger binding.</span>
                    </p>
                </div>

                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Bond</span>
                </div>
            </div>
        </div>
    );
}
