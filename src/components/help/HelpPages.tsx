import React from 'react';

const MockContentBlocks = ({ type }: { type: 'interaction' | 'wellness' | 'scanner' }) => {
    switch (type) {
        case 'interaction':
            return (
                <div className="space-y-6">
                    <h2 className="text-3xl font-black text-slate-200 tracking-tight">Using the Interaction Checker</h2>
                    <p className="text-slate-400 text-base leading-relaxed max-w-3xl">
                        The Interaction Checker validates clinical combinations securely against a 13-point matrix. This guide shows how to input multiple substances and interpret the risk severity score.
                    </p>
                    <div className="mt-8 bg-slate-900/60 p-2 rounded-2xl border border-slate-700 shadow-xl overflow-hidden aspect-[4/3] relative group flex items-center justify-center">
                        {/* Placeholder Block with requested styling */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 z-0" />
                        <div className="flex flex-col items-center justify-center opacity-60 z-10 gap-3">
                            <span className="material-symbols-outlined text-4xl text-indigo-400/50">photo_library</span>
                            <span className="text-sm font-black uppercase tracking-widest text-slate-500">Awaiting Screenshot: Interaction Checker Results</span>
                        </div>
                    </div>
                </div>
            );
        case 'wellness':
            return (
                <div className="space-y-6">
                    <h2 className="text-3xl font-black text-slate-200 tracking-tight">Navigating Wellness Journey Logs</h2>
                    <p className="text-slate-400 text-base leading-relaxed max-w-3xl">
                        View historical trajectory maps across domains with overlaid medication interventions to deduce outcome velocity. This data relies directly on Patient Mobile Submissions.
                    </p>
                    <div className="mt-8 bg-slate-900/60 p-2 rounded-2xl border border-slate-700 shadow-xl overflow-hidden aspect-[16/9] relative group flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 z-0" />
                        <div className="flex flex-col items-center justify-center opacity-60 z-10 gap-3">
                            <span className="material-symbols-outlined text-4xl text-indigo-400/50">photo_library</span>
                            <span className="text-sm font-black uppercase tracking-widest text-slate-500">Awaiting Screenshot: Wellness Graph Overlay</span>
                        </div>
                    </div>
                </div>
            );
        case 'scanner':
            return (
                <div className="space-y-6">
                    <h2 className="text-3xl font-black text-slate-200 tracking-tight">Patient Bridge Scanner Pipeline</h2>
                    <p className="text-slate-400 text-base leading-relaxed max-w-3xl">
                        The Patient Bridge leverages OCR logic via Mobile camera access to rapidly ingest paperwork and physical questionnaires directly into the secure environment.
                    </p>
                    <div className="mt-8 bg-slate-900/60 p-2 rounded-2xl border border-slate-700 shadow-xl overflow-hidden aspect-[3/4] max-w-md mx-auto relative group flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 z-0" />
                        <div className="flex flex-col items-center justify-center opacity-60 z-10 gap-3">
                            <span className="material-symbols-outlined text-4xl text-indigo-400/50">photo_library</span>
                            <span className="text-sm font-black uppercase tracking-widest text-slate-500">Awaiting Screenshot: Mobile Scanner Interface</span>
                        </div>
                    </div>
                </div>
            );
        default: return null;
    }
}

export const HelpInteractionChecker = () => <MockContentBlocks type="interaction" />;
export const HelpWellnessJourney = () => <MockContentBlocks type="wellness" />;
export const HelpScanner = () => <MockContentBlocks type="scanner" />;
