import React, { useState } from 'react';
import { useProtocol, type ProtocolArchetype } from '../../contexts/ProtocolContext';
import { Activity, Shield, Sparkles, X, Settings2, Info, CheckCircle } from 'lucide-react';

interface ProtocolConfiguratorModalProps {
    onClose: () => void;
}

const ARCHETYPES = [
    {
        id: 'clinical' as ProtocolArchetype,
        title: 'Clinical Protocol',
        icon: Activity,
        color: 'indigo',
        description: 'Strict medical tracking. Auto-enables Vitals, Symptom Baselines, and Risk Engines.',
        features: [
            'consent', 'structured-safety', 'set-and-setting', 'mental-health',
            'dosing-protocol', 'session-timeline', 'session-vitals', 'session-observations',
            'safety-and-adverse-event', 'rescue-protocol', 'daily-pulse', 'meq30',
            'structured-integration', 'behavioral-tracker', 'longitudinal-assessment'
        ]
    },
    {
        id: 'ceremonial' as ProtocolArchetype,
        title: 'Ceremonial / Wellness',
        icon: Sparkles,
        color: 'emerald',
        description: 'Lightweight flow. Focuses on setting, narrative timeline, and integration.',
        features: [
            'consent', 'set-and-setting', 'dosing-protocol', 'session-timeline',
            'daily-pulse', 'meq30', 'structured-integration', 'behavioral-tracker'
        ]
    }
];

export const ProtocolConfiguratorModal: React.FC<ProtocolConfiguratorModalProps> = ({ onClose }) => {
    const { config, setConfig } = useProtocol();
    const [selectedId, setSelectedId] = useState<ProtocolArchetype>(config.protocolType);
    const [saveAsDefault, setSaveAsDefault] = useState(true);

    const handleSave = () => {
        const archetype = ARCHETYPES.find(a => a.id === selectedId);
        if (archetype) {
            setConfig({
                protocolType: selectedId,
                enabledFeatures: archetype.features
            });
            // If we had API wired up, we would save to user_profiles here if saveAsDefault is true
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-3xl bg-[#0a1628] rounded-3xl border border-slate-700/50 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/60 bg-slate-900/40">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                            <Settings2 className="w-6 h-6 text-violet-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white leading-tight mt-0.5">Customize Your Workspace</h2>
                            <p className="text-sm text-slate-400 mt-1">Select the tools you actually use to keep your interface clean and fast.</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8 space-y-6">
                    {/* Educational Callout */}
                    <div className="flex items-start gap-3 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                        <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-indigo-200 font-medium tracking-wide">Why are we asking this?</p>
                            <p className="text-sm text-indigo-300/80 mt-1 leading-relaxed">
                                We want to protect your focus. By setting your typical workflow now, we will hide any tools or forms you don't need, preventing "button fatigue" during sessions.
                                <strong className="text-indigo-200 font-medium"> Please don't over-select "just in case"</strong> — you can change these settings at any time!
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ARCHETYPES.map(arch => {
                            const Icon = arch.icon;
                            const isSelected = selectedId === arch.id;
                            return (
                                <button
                                    key={arch.id}
                                    onClick={() => setSelectedId(arch.id)}
                                    className={`relative flex flex-col p-6 rounded-2xl border-2 text-left transition-all duration-200 ${isSelected
                                        ? `border-${arch.color}-500 bg-slate-800/80 shadow-lg shadow-${arch.color}-500/10`
                                        : 'border-slate-800 bg-slate-900/40 hover:bg-slate-800 hover:border-slate-700'
                                        }`}
                                >
                                    {isSelected && (
                                        <div className={`absolute top-4 right-4 text-${arch.color}-400`}>
                                            <CheckCircle className="w-6 h-6" />
                                        </div>
                                    )}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isSelected ? `bg-${arch.color}-500/20 text-${arch.color}-400` : 'bg-slate-800 text-slate-400'
                                        }`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{arch.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed flex-1">
                                        {arch.description}
                                    </p>
                                    <div className="mt-6 space-y-1.5 border-t border-slate-800 pt-4 w-full">
                                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Included Modules:</div>
                                        {arch.id === 'clinical' && (
                                            <>
                                                <div className="text-xs text-slate-300 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-slate-500" /> Clinical Baselines (PHQ-9)</div>
                                                <div className="text-xs text-slate-300 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-slate-500" /> Vital Sign Tracking</div>
                                                <div className="text-xs text-slate-300 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-slate-500" /> Automated Risk Engine</div>
                                            </>
                                        )}
                                        {arch.id === 'ceremonial' && (
                                            <>
                                                <div className="text-xs text-slate-300 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-slate-500" /> Narrative Timeline Logging</div>
                                                <div className="text-xs text-slate-300 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-slate-500" /> MEQ-30 Assessment</div>
                                                <div className="text-xs text-slate-300 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-slate-500" /> Integration Worksheets</div>
                                            </>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center mt-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                        <input
                            type="checkbox"
                            id="saveDefault"
                            checked={saveAsDefault}
                            onChange={(e) => setSaveAsDefault(e.target.checked)}
                            className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900"
                        />
                        <label htmlFor="saveDefault" className="ml-3 text-sm text-slate-300 cursor-pointer">
                            Save this as my global default for all future sessions.
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-5 border-t border-slate-800/60 bg-slate-900/40">
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Start Session
                    </button>
                </div>
            </div>
        </div>
    );
};
