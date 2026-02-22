import React from 'react';

const ScreenshotBlock = ({ src, alt, placeholder }: { src?: string; alt: string; placeholder: string }) => {
    return (
        <div className="mt-8 bg-slate-900/40 p-1.5 sm:p-2.5 rounded-3xl border border-slate-700/60 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden relative group flex items-center justify-center max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 z-0" />

            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="relative z-10 w-full rounded-2xl border border-slate-800 shadow-sm"
                />
            ) : (
                <div className="flex flex-col items-center justify-center opacity-60 z-10 gap-4 py-32 px-10 text-center w-full min-h-[400px]">
                    <span className="material-symbols-outlined text-5xl text-indigo-400/50">photo_library</span>
                    <span className="text-sm font-black uppercase tracking-widest text-slate-500">{placeholder}</span>
                </div>
            )}
        </div>
    );
};

const MockContentBlocks = ({ type }: { type: 'interaction' | 'wellness' | 'scanner' }) => {
    switch (type) {
        case 'interaction':
            return (
                <div className="space-y-6">
                    <h2 className="text-3xl font-black text-slate-200 tracking-tight">Using the Interaction Checker</h2>
                    <p className="text-slate-400 text-base leading-relaxed max-w-3xl">
                        The Interaction Checker validates clinical combinations securely against a 13-point matrix. This guide shows how to input multiple substances and interpret the risk severity score.
                    </p>
                    <ScreenshotBlock
                        alt="Interaction Checker Results"
                        placeholder="Awaiting Screenshot: Interaction Checker Results"
                    />
                </div>
            );
        case 'wellness':
            return (
                <div className="space-y-6">
                    <h2 className="text-3xl font-black text-slate-200 tracking-tight">Navigating Wellness Journey Logs</h2>
                    <p className="text-slate-400 text-base leading-relaxed max-w-3xl">
                        View historical trajectory maps across domains with overlaid medication interventions to deduce outcome velocity. This data relies directly on Patient Mobile Submissions.
                    </p>
                    <ScreenshotBlock
                        alt="Wellness Graph Overlay"
                        placeholder="Awaiting Screenshot: Wellness Graph Overlay"
                    />
                </div>
            );
        case 'scanner':
            return (
                <div className="space-y-6">
                    <h2 className="text-3xl font-black text-slate-200 tracking-tight">Patient Bridge Scanner Pipeline</h2>
                    <p className="text-slate-400 text-base leading-relaxed max-w-3xl">
                        The Patient Bridge leverages OCR logic via Mobile camera access to rapidly ingest paperwork and physical questionnaires directly into the secure environment.
                    </p>
                    <ScreenshotBlock
                        alt="Mobile Scanner Interface"
                        placeholder="Awaiting Screenshot: Mobile Scanner Interface"
                    />
                </div>
            );
        default: return null;
    }
}

export const HelpInteractionChecker = () => <MockContentBlocks type="interaction" />;
export const HelpWellnessJourney = () => <MockContentBlocks type="wellness" />;
export const HelpScanner = () => <MockContentBlocks type="scanner" />;
