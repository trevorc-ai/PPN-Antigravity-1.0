import React, { useState } from 'react';

interface Protocol {
    _id: number;
}

interface Section1Props {
    selectedId: number | null;
    onSelect: (id: number) => void;
}

const INDICATIONS = [
    { id: 1, name: 'Major Depressive Disorder (MDD)', icon: '😔' },
    { id: 2, name: 'Post-Traumatic Stress Disorder (PTSD)', icon: '🛡️' },
    { id: 3, name: 'Generalized Anxiety Disorder', icon: '😰' }
];

export const Section1_Indication: React.FC<Section1Props> = ({ selectedId, onSelect }) => {
    return (
        <div className="section-container animate-in fade-in slide-in-from-left-4 duration-500">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-6">
                Select Primary Indication
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {INDICATIONS.map((ind) => (
                    <button
                        key={ind.id}
                        onClick={() => onSelect(ind.id)}
                        className={`
              p-6 rounded-2xl border transition-all duration-300 text-left group relative overflow-hidden
              ${selectedId === ind.id
                                ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-400/50 shadow-[0_0_20px_rgba(99,102,241,0.3)] scale-[1.02]'
                                : 'bg-slate-900/50 border-slate-800 hover:border-slate-600 hover:bg-slate-800'
                            }
            `}
                    >
                        <div className="text-3xl mb-3 transform transition-transform group-hover:scale-110 duration-300">{ind.icon}</div>
                        <div className={`font-bold transition-colors ${selectedId === ind.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                            {ind.name}
                        </div>
                        {selectedId === ind.id && (
                            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_currentColor]" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
