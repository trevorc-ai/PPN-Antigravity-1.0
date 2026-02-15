import React from 'react';
import { PageContainer } from '../layouts/PageContainer';

interface MonographHeroProps {
    substance: {
        id: string;
        name: string;
        chemicalName: string;
        phase: string;
        schedule: string;
        imageUrl: string;
        formula: string;
        efficacy: number;
    };
}

export const MonographHero: React.FC<MonographHeroProps> = ({ substance }) => {
    return (
        <div className="relative w-full overflow-hidden border-b border-white/5 bg-[#05070a]">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
                <div className="absolute -top-48 -left-48 size-[800px] bg-primary/10 rounded-full blur-[160px] animate-pulse"></div>
                <div className="absolute -bottom-48 -right-48 size-[800px] bg-indigo-500/5 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <PageContainer className="relative z-10 py-12 sm:py-20 flex flex-col lg:flex-row items-center lg:items-center justify-between gap-12 lg:gap-16">
                <div className="space-y-6 text-center lg:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                        <span className="px-4 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/10">
                            {substance.phase}
                        </span>
                        <span className="px-4 py-1.5 bg-slate-900/80 text-slate-400 border border-slate-800 rounded-full text-sm font-black uppercase tracking-[0.2em]">
                            {substance.schedule}
                        </span>
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-clinical-green/10 text-clinical-green border border-clinical-green/20 rounded-full text-sm font-black uppercase tracking-[0.2em]">
                            <span className="size-2 bg-clinical-green rounded-full animate-pulse"></span>
                            Clinical Dossier
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-[0.85] transition-all duration-700 hover:tracking-normal cursor-default">
                            {substance.name}
                        </h1>
                        <p className="text-lg sm:text-2xl font-bold text-slate-500 font-mono tracking-tight leading-relaxed max-w-3xl mx-auto lg:mx-0">
                            {substance.chemicalName}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2">
                        <div className="flex flex-row items-center gap-4">
                            <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em]">Registry Access</p>
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="size-10 rounded-full bg-slate-900 border-2 border-[#05070a] flex items-center justify-center shadow-xl">
                                        <span className="material-symbols-outlined text-slate-500 text-sm">shield_with_heart</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="h-10 w-px bg-white/5 hidden sm:block"></div>
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest leading-tight">
                            <span className="text-white">Live Search Enriched</span><br />Institutional Research Node
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center lg:items-end gap-8 shrink-0">
                    {/* Floating Molecule on Black Space */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-primary/20 rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="relative size-64 sm:size-80 bg-black rounded-[3rem] p-8 shadow-2xl flex items-center justify-center overflow-hidden transition-transform duration-700 group-hover:scale-[1.02]">
                            <img
                                src={substance.imageUrl}
                                alt={`${substance.name} Structure`}
                                className="w-full h-full object-contain mix-blend-screen opacity-90 group-hover:opacity-100 transition-opacity duration-700 transform group-hover:scale-110"
                            />

                            {/* Micro-labels for the molecule */}
                            <div className="absolute top-6 left-6 flex flex-col gap-0.5">
                                <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest leading-none">Structural</span>
                                <span className="text-[11px] font-black text-primary uppercase tracking-widest leading-none">0x{substance.id?.slice(-4)}</span>
                            </div>
                            <div className="absolute bottom-6 right-6 flex flex-col items-end gap-0.5">
                                <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest leading-none">Verified</span>
                                <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest leading-none">{substance.formula}</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-80 bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Aggregate Efficacy</p>
                            <span className="text-sm font-mono text-clinical-green font-black">NODE_SIGMA</span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-5xl font-black text-white tracking-tighter">{(substance.efficacy * 100).toFixed(1)}</span>
                            <span className="text-2xl font-black text-clinical-green tracking-tighter">%</span>
                        </div>
                        <div className="w-full bg-slate-800/50 h-2 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-clinical-green shadow-[0_0_12px_#53d22d] transition-all duration-1000 ease-out"
                                style={{ width: `${substance.efficacy * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </PageContainer>
        </div>
    );
};
