import React, { useState } from 'react';
import { useProtocol, type ProtocolArchetype } from '../../contexts/ProtocolContext';
import { Activity, Shield, Sparkles, X, Settings2, Info, CheckCircle, SlidersHorizontal, HelpCircle, User } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';

interface ProtocolConfiguratorModalProps {
    onClose: () => void;
    /** Called with intake data when the practitioner clicks Save */
    onIntakeComplete?: (intake: PatientIntakeData) => void;
}

export interface PatientIntakeData {
    condition: string;
    age: string;
    weight: string;
    gender: string;
}

const CONDITIONS = [
    'PTSD',
    'Depression',
    'Anxiety / GAD',
    'Addiction / SUD',
    'End-of-Life Distress',
    'Spiritual / Ceremonial',
    'Chronic Pain',
    'Other',
];

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

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
        color: 'amber',
        description: 'Lightweight flow. Focuses on setting, narrative timeline, and integration.',
        features: [
            'consent', 'set-and-setting', 'dosing-protocol', 'session-timeline',
            'daily-pulse', 'meq30', 'structured-integration', 'behavioral-tracker'
        ]
    },
    {
        id: 'custom' as ProtocolArchetype,
        title: 'Custom Framework',
        icon: SlidersHorizontal,
        color: 'teal',
        description: 'Build your own workflow. Hand-pick features across clinical and subjective domains.',
        features: [] // Dynamically managed via customFeatures
    }
];

const CUSTOM_DOMAINS = [
    {
        id: 'domain-a',
        title: 'Domain A: Medical & Physiological Gates',
        description: 'Vitals tracking, SpO2, and emergency protocols.',
        tooltipText: 'Crucial for clinical safety. These modules are predominantly active during Phase 2 (Dosing).',
        features: [
            { id: 'session-vitals', phase: 2, label: 'Vitals Tracking (HR, BP, SpO₂)' },
            { id: 'rescue-protocol', phase: 2, label: 'Rescue Protocol & Medical Tapering' },
            { id: 'safety-and-adverse-event', phase: 2, label: 'Adverse Event Logging' },
            { id: 'session-observations', phase: 2, label: 'Clinical Session Observations' },
        ]
    },
    {
        id: 'domain-b',
        title: 'Domain B: Clinical Symptom Tracking',
        description: 'Diagnoses, risk matrices, and baseline/follow-up scales.',
        tooltipText: 'Governs baseline clinical readiness in Phase 1 (Prep), and tracks longitudinal symptom reduction in Phase 3 (Integration).',
        features: [
            { id: 'structured-safety', phase: 1, label: 'Safety Screen & Eligibility (ECG, Medical Hx)' },
            { id: 'mental-health', phase: 1, label: 'Baseline Scales (PHQ-9, GAD-7)' },
            { id: 'longitudinal-assessment', phase: 3, label: 'Longitudinal Scales (CAPS-5, Post-Session)' },
        ]
    },
    {
        id: 'domain-c',
        title: 'Domain C: Subjective & Spiritual Experience',
        description: 'Phenomenological scales and meaning-making tools.',
        tooltipText: 'Combines intention setting from Phase 1 with meaning-making and subjective phenomenological evaluations in Phase 3.',
        features: [
            { id: 'set-and-setting', phase: 1, label: 'Intention Setting Planner' },
            { id: 'meq30', phase: 3, label: 'Mystical Experience Questionnaire (MEQ-30)' },
            { id: 'structured-integration', phase: 3, label: 'Narrative Integration Journaling' },
            { id: 'behavioral-tracker', phase: 3, label: 'Behavioral Breakthrough Tracker' },
            { id: 'daily-pulse', phase: 3, label: 'Daily Pulse Check' },
        ]
    },
    {
        id: 'domain-d',
        title: 'Domain D: Regulatory & Logistics',
        description: 'Consent, chain of custody, and timeline maps.',
        tooltipText: 'Handles mandatory regulatory forms in Phase 1 and temporal mapping of the active state in Phase 2.',
        features: [
            { id: 'consent', phase: 1, label: 'Dynamic Touch & Informed Consent' },
            { id: 'dosing-protocol', phase: 1, label: 'Chain of Custody / Medicine Log' },
            { id: 'session-timeline', phase: 2, label: 'Session Timeline / Wave Mapping' },
        ]
    }
];

export const ProtocolConfiguratorModal: React.FC<ProtocolConfiguratorModalProps> = ({ onClose, onIntakeComplete }) => {
    const { config, setConfig } = useProtocol();
    const [selectedId, setSelectedId] = useState<ProtocolArchetype>(config.protocolType);
    const [saveAsDefault, setSaveAsDefault] = useState(true);
    const [customFeatures, setCustomFeatures] = useState<string[]>(
        config.protocolType === 'custom' ? config.enabledFeatures : ARCHETYPES[0].features
    );

    // ── Step 0: Patient Intake ──────────────────────────────────────────────
    const [condition, setCondition] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [gender, setGender] = useState('');

    const [step, setStep] = useState<1 | 2>(1);

    const toggleFeature = (id: string) => {
        setCustomFeatures(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };

    const handleNextStep = () => {
        const archetype = ARCHETYPES.find(a => a.id === selectedId);
        if (archetype) {
            setConfig({
                protocolType: selectedId,
                enabledFeatures: selectedId === 'custom' ? customFeatures : archetype.features
            });
        }
        setStep(2);
    };

    const handleSave = () => {
        // Surface intake data to parent (WellnessJourney will store in journey.demographics)
        if (onIntakeComplete) {
            onIntakeComplete({ condition, age, weight, gender });
        }
        onClose();
    };

    if (step === 2) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm">
                <div className="w-full max-w-2xl bg-[#0a1628] rounded-3xl border border-slate-700/50 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/60 bg-slate-900/40">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                                <Settings2 className="w-6 h-6 text-violet-400" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight mt-0.5">New Patient Setup</h2>
                                <p className="text-base text-slate-400 mt-1">Tell us about this patient, then choose your workflow.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[85vh] custom-scrollbar">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Patient Context</h3>
                                    <p className="text-sm text-slate-400">Non-identifying clinical context only. No names or PHI.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5 bg-slate-900/50 border border-slate-700/50 rounded-2xl">
                                <div className="sm:col-span-4">
                                    <label htmlFor="intake-condition" className="block text-sm font-semibold text-slate-300 mb-2">
                                        What are you treating? <span className="text-indigo-400">*</span>
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {CONDITIONS.map(c => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => setCondition(c)}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all active:scale-95 ${condition === c
                                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow shadow-indigo-600/30'
                                                    : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:border-slate-500 hover:text-slate-200'
                                                    }`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="intake-age" className="block text-sm font-semibold text-slate-300 mb-2">Age</label>
                                    <input
                                        id="intake-age"
                                        type="number"
                                        min="18"
                                        max="99"
                                        placeholder="e.g. 42"
                                        value={age}
                                        onChange={e => setAge(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/50 focus:border-indigo-500/60 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="intake-weight" className="block text-sm font-semibold text-slate-300 mb-2">
                                        Weight
                                        <AdvancedTooltip
                                            content="Enter weight in kilograms (kg). To convert from pounds: divide lbs by 2.205. Example: 150 lbs ÷ 2.205 = 68 kg. All mg/kg dosing calculations use this value."
                                            tier="standard"
                                            type="info"
                                            side="bottom"
                                        >
                                            <span className="ml-1.5 text-slate-500 cursor-help text-xs font-normal">(kg) ⓘ</span>
                                        </AdvancedTooltip>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="intake-weight"
                                            type="number"
                                            min="20"
                                            max="300"
                                            step="0.1"
                                            placeholder="e.g. 68"
                                            value={weight}
                                            onChange={e => setWeight(e.target.value)}
                                            className="w-full px-4 py-2.5 pr-10 bg-slate-800/60 border border-slate-700/50 focus:border-indigo-500/60 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">kg</span>
                                    </div>
                                    {/* Live lbs equivalent — prevents lbs/kg entry error */}
                                    {weight && !isNaN(parseFloat(weight)) && parseFloat(weight) > 0 && (
                                        <p className="mt-1 text-xs text-slate-500">
                                            ≈ {(parseFloat(weight) * 2.205).toFixed(1)} lbs
                                        </p>
                                    )}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Gender</label>
                                    <div className="flex flex-wrap gap-2">
                                        {GENDERS.map(g => (
                                            <button
                                                key={g}
                                                type="button"
                                                onClick={() => setGender(g)}
                                                className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-all active:scale-95 ${gender === g
                                                    ? 'bg-indigo-600 text-white border-indigo-500'
                                                    : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:border-slate-500 hover:text-slate-200'
                                                    }`}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-3 px-6 py-5 border-t border-slate-800/60 bg-slate-900/40">
                        <button
                            onClick={handleSave}
                            className="px-8 py-3 text-lg font-extrabold rounded-xl transition-all shadow-lg border active:scale-95 bg-indigo-700/50 hover:bg-indigo-600/60 border-indigo-500/50 text-indigo-100 shadow-indigo-500/10"
                        >
                            Start Session →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-3xl bg-[#0a1628] rounded-3xl border border-slate-700/50 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/60 bg-slate-900/40">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                            <Settings2 className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight mt-0.5">Workspace Configuration</h2>
                            <p className="text-base text-slate-400 mt-1">Configure your clinical interface layout.</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8 space-y-8 overflow-y-auto max-h-[85vh] custom-scrollbar">

                    {/* Educational Callout */}
                    <div className="flex items-start gap-3 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                        <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-base text-indigo-200 font-medium tracking-wide">Choose Your Workspace</p>
                            <p className="text-base text-indigo-300/80 mt-1.5 leading-relaxed">
                                Select the tools you actually use to keep your interface clean and fast.
                                <strong className="text-indigo-200 font-medium"> Please don't over-select "just in case"</strong> — you can change these settings at any time!
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                                    <h3 className="text-xl font-bold text-white mb-2">{arch.title}</h3>
                                    <p className="text-slate-400 text-base leading-relaxed flex-1">
                                        {arch.description}
                                    </p>
                                    <div className="mt-6 space-y-2 border-t border-slate-800 pt-4 w-full">
                                        <div className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Included Modules:</div>
                                        {arch.id === 'clinical' && (
                                            <div className="space-y-1.5">
                                                <div className="text-sm text-slate-300 flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-500" /> Clinical Baselines (PHQ-9)</div>
                                                <div className="text-sm text-slate-300 flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-500" /> Vital Sign Tracking</div>
                                                <div className="text-sm text-slate-300 flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-500" /> Automated Risk Engine</div>
                                            </div>
                                        )}
                                        {arch.id === 'ceremonial' && (
                                            <div className="space-y-1.5">
                                                <div className="text-sm text-slate-300 flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-500" /> Narrative Timeline Logging</div>
                                                <div className="text-sm text-slate-300 flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-500" /> MEQ-30 Assessment</div>
                                                <div className="text-sm text-slate-300 flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-500" /> Integration Worksheets</div>
                                            </div>
                                        )}
                                        {arch.id === 'custom' && (
                                            <div className="space-y-1.5">
                                                <div className="text-sm text-slate-300 flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-500 flex-shrink-0" /> Hand-picked modules</div>
                                                <div className="text-sm text-slate-300 flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-500 flex-shrink-0" /> Cross-domain flexibility</div>
                                                <div className="text-sm text-teal-400 flex items-center gap-2 mt-2 font-bold">{customFeatures.length} features selected</div>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Custom Domains UI */}
                    {selectedId === 'custom' && (
                        <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300 border-t border-slate-800/60 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-teal-500/10 rounded-lg border border-teal-500/20">
                                    <SlidersHorizontal className="w-5 h-5 text-teal-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white leading-tight">Custom Configuration</h3>
                                    <p className="text-base text-slate-400 mt-1">Select specific modules to include in your personalized workflow.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {CUSTOM_DOMAINS.map((domain, index) => (
                                    <div key={domain.id} className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-5 space-y-4 shadow-lg transition-colors hover:border-slate-600 relative">
                                        <div className="border-b border-slate-800/60 pb-3 flex items-start justify-between">
                                            <div className="pr-4">
                                                <h4 className="text-lg font-bold text-white mb-1.5 leading-tight">{domain.title}</h4>
                                                <p className="text-sm text-slate-400 leading-relaxed">{domain.description}</p>
                                            </div>
                                            <AdvancedTooltip content={domain.tooltipText} tier="standard" type="info" side={index % 2 === 1 ? 'bottom-left' : 'bottom'} width="w-[280px]">
                                                <HelpCircle className="w-5 h-5 text-slate-500 hover:text-indigo-400 transition-colors cursor-help mt-0.5 flex-shrink-0" />
                                            </AdvancedTooltip>
                                        </div>
                                        <div className="space-y-3.5">
                                            {domain.features.map(feat => {
                                                const isEnabled = customFeatures.includes(feat.id);
                                                const getPhaseTheme = () => {
                                                    if (!isEnabled) {
                                                        if (feat.phase === 1) return { box: 'bg-slate-800 border-slate-500 group-hover:bg-slate-800/80 group-hover:border-indigo-400', txt: 'text-slate-400 group-hover:text-indigo-200' };
                                                        if (feat.phase === 2) return { box: 'bg-slate-800 border-slate-500 group-hover:bg-slate-800/80 group-hover:border-amber-400', txt: 'text-slate-400 group-hover:text-amber-200' };
                                                        if (feat.phase === 3) return { box: 'bg-slate-800 border-slate-500 group-hover:bg-slate-800/80 group-hover:border-teal-400', txt: 'text-slate-400 group-hover:text-teal-200' };
                                                        return { box: '', txt: '' };
                                                    }
                                                    if (feat.phase === 1) return { box: 'bg-indigo-700/50 text-indigo-100 border-indigo-500/50 shadow-indigo-500/10 shadow-sm', txt: 'text-indigo-100 font-medium' };
                                                    if (feat.phase === 2) return { box: 'bg-amber-700/50 text-amber-100 border-amber-500/50 shadow-amber-500/10 shadow-sm', txt: 'text-amber-100 font-medium' };
                                                    if (feat.phase === 3) return { box: 'bg-teal-700/50 text-teal-100 border-teal-500/50 shadow-teal-500/10 shadow-sm', txt: 'text-teal-100 font-medium' };
                                                    return { box: '', txt: '' };
                                                };
                                                const theme = getPhaseTheme();

                                                return (
                                                    <label key={feat.id} className="flex items-start gap-3.5 cursor-pointer group">
                                                        <input type="checkbox" className="hidden" checked={isEnabled} onChange={() => toggleFeature(feat.id)} />
                                                        <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center transition-all flex-shrink-0 shadow-sm border ${theme.box}`}>
                                                            {isEnabled && <svg className="w-3.5 h-3.5 fill-current animate-in zoom-in duration-200" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z" /></svg>}
                                                        </div>
                                                        <span className={`text-base select-none leading-snug pt-[1px] ${theme.txt}`}>
                                                            {feat.label}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center mt-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                        <input
                            type="checkbox"
                            id="saveDefault"
                            checked={saveAsDefault}
                            onChange={(e) => setSaveAsDefault(e.target.checked)}
                            className="w-5 h-5 rounded border-slate-500 bg-slate-700 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900"
                        />
                        <label htmlFor="saveDefault" className="ml-3.5 text-base text-slate-300 cursor-pointer">
                            Save this as my global default for all future sessions.
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end items-center gap-3 px-6 py-5 border-t border-slate-800/60 bg-slate-900/40">
                    <button
                        onClick={handleNextStep}
                        className={`px-8 py-3 text-lg font-extrabold rounded-xl transition-all shadow-lg border active:scale-95 ${selectedId === 'clinical' ? 'bg-indigo-700/50 hover:bg-indigo-600/60 border-indigo-500/50 text-indigo-100 shadow-indigo-500/10' :
                            selectedId === 'ceremonial' ? 'bg-amber-700/50 hover:bg-amber-600/60 border-amber-500/50 text-amber-100 shadow-amber-500/10' :
                                selectedId === 'custom' ? 'bg-teal-700/50 hover:bg-teal-600/60 border-teal-500/50 text-teal-100 shadow-teal-500/10' :
                                    'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:bg-slate-700/60'
                            }`}
                    >
                        Start Session →
                    </button>
                </div>
            </div>
        </div >
    );
};
