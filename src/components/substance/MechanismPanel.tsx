import React from 'react';
import type { Substance } from '../../types';

interface MechanismPanelProps {
    substance: Substance;
}

/**
 * MechanismPanel — mechanism of action + therapeutic hypothesis + critical safety note.
 * Slot 3 of the Monograph left column.
 *
 * The critical safety note gets special visual treatment — red-bordered callout box.
 * Never uses color alone: pairs icon + text for all severity signals.
 */
const MechanismPanel: React.FC<MechanismPanelProps> = ({ substance: sub }) => {
    if (!sub.mechanismText && !sub.therapeuticHypothesis && !sub.criticalSafetyNote) {
        return null;
    }

    return (
        <section
            className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 backdrop-blur-3xl shadow-2xl space-y-5"
            aria-labelledby="mechanism-heading"
        >
            <div className="flex items-center gap-3 mb-1">
                <div
                    className="size-8 rounded-lg flex items-center justify-center border shrink-0"
                    style={{
                        background: `${sub.color}15`,
                        borderColor: `${sub.color}30`,
                        color: sub.color,
                    }}
                >
                    <span className="material-symbols-outlined text-lg" aria-hidden="true">psychology</span>
                </div>
                <h3
                    id="mechanism-heading"
                    className="text-[13px] font-black tracking-[0.2em] uppercase"
                    style={{ color: '#A8B5D1' }}
                >
                    Mechanism of Action
                </h3>
            </div>

            {/* Primary mechanism */}
            {sub.mechanismText && (
                <div>
                    <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2">
                        Pharmacological Mechanism
                    </p>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">
                        {sub.mechanismText}
                    </p>
                </div>
            )}

            {/* Therapeutic hypothesis */}
            {sub.therapeuticHypothesis && (
                <div className="pt-4 border-t border-white/5">
                    <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2">
                        Therapeutic Hypothesis
                    </p>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        {sub.therapeuticHypothesis}
                    </p>
                </div>
            )}

            {/* Critical safety note — always visually prominent */}
            {sub.criticalSafetyNote && (
                <div
                    className="rounded-xl border p-4 mt-1"
                    style={{
                        background: 'rgba(239,68,68,0.05)',
                        borderColor: 'rgba(239,68,68,0.2)',
                    }}
                    role="alert"
                    aria-atomic="true"
                >
                    <div className="flex items-start gap-2.5">
                        <span
                            className="material-symbols-outlined text-red-400 text-lg shrink-0 mt-0.5"
                            aria-hidden="true"
                        >
                            emergency
                        </span>
                        <div>
                            <p className="text-[11px] font-black text-red-400 uppercase tracking-widest mb-1.5">
                                Critical Safety Note
                            </p>
                            <p className="text-sm text-red-300/80 leading-relaxed font-medium">
                                {sub.criticalSafetyNote}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MechanismPanel;
