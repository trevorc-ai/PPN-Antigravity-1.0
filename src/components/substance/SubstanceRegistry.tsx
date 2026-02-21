import React from 'react';
import type { Substance } from '../../types';

interface SubstanceRegistryProps {
    substance: Substance;
}

/**
 * SubstanceRegistry — pharmacological identity panel.
 * Slot 1 of the Monograph left column.
 * Displays CAS, formula, PK data (substance-specific), drug class, schedule.
 */
const SubstanceRegistry: React.FC<SubstanceRegistryProps> = ({ substance: sub }) => {
    const pk = sub.pkData;

    const fields = [
        { label: 'CAS Registry', val: sub.cas, icon: 'tag' },
        { label: 'Mol. Weight', val: sub.molecularWeight, icon: 'weight' },
        { label: 'Formula', val: sub.formula, icon: 'science' },
        { label: 'Drug Class', val: sub.class, icon: 'category' },
        { label: 'DEA Schedule', val: sub.schedule, icon: 'gavel' },
        { label: 'Bioavailability', val: pk?.bioavailability ?? '—', icon: 'speed' },
        { label: 'Half-Life', val: pk?.halfLife ?? '—', icon: 'timer' },
        { label: 'Tmax', val: pk?.tmax ?? '—', icon: 'schedule' },
        { label: 'Primary Route', val: pk?.primaryRoute ?? '—', icon: 'route' },
    ];

    return (
        <section
            className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 backdrop-blur-3xl shadow-2xl"
            aria-labelledby="registry-heading"
        >
            <div className="flex items-center justify-between mb-5">
                <h3
                    id="registry-heading"
                    className="text-[13px] font-black tracking-[0.2em] uppercase flex items-center gap-3"
                    style={{ color: '#A8B5D1' }}
                >
                    <div
                        className="size-8 rounded-lg flex items-center justify-center border"
                        style={{
                            background: `${sub.color}15`,
                            borderColor: `${sub.color}30`,
                            color: sub.color,
                        }}
                    >
                        <span className="material-symbols-outlined text-lg" aria-hidden="true">biotech</span>
                    </div>
                    Chemical Registry
                </h3>
                <span className="text-xs font-mono text-slate-600 font-black tracking-widest">
                    {sub.id}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {fields.map((item) => (
                    <div
                        key={item.label}
                        className="p-3 bg-black/30 border border-white/5 rounded-xl hover:border-white/10 hover:bg-black/40 transition-all duration-200"
                    >
                        <div className="flex items-center gap-1.5 mb-1">
                            <span
                                className="material-symbols-outlined text-[12px] text-slate-600"
                                aria-hidden="true"
                            >
                                {item.icon}
                            </span>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                {item.label}
                            </span>
                        </div>
                        <span className="text-sm font-mono font-bold text-slate-300 block leading-snug">
                            {item.val}
                        </span>
                    </div>
                ))}
            </div>

            {/* Sources note */}
            <p className="mt-4 text-[10px] text-slate-600 font-medium leading-relaxed">
                PK data sourced from peer-reviewed pharmacokinetic studies. Values represent
                typical clinical ranges; individual variation applies.
            </p>
        </section>
    );
};

export default SubstanceRegistry;
