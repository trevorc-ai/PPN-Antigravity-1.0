import React, { useState, useEffect, useRef } from 'react';
import { useProtocol, type ProtocolArchetype } from '../../contexts/ProtocolContext';
import { Activity, Shield, Sparkles, X, Settings2, Info, CheckCircle, SlidersHorizontal, HelpCircle, User, ArrowLeft } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';

interface ProtocolConfiguratorModalProps {
    onClose: () => void;
    /** Called when the user clicks Back on Step 1, parent reopens PatientSelectModal */
    onBack?: () => void;
    /** Called with intake data when the practitioner clicks Save */
    onIntakeComplete?: (intake: PatientIntakeData) => void;
}

export interface PatientIntakeData {
    condition: string;
    age: string;
    /** FK id from ref_weight_ranges — written directly to log_patient_profiles.weight_range_id */
    weight_range_id: number | null;
    /** Dual-unit range label, e.g. "80-85 kg (176-187 lbs)" — used for UI display, not storage */
    weight_label: string;
    gender: string;
    smoking: string;
}

const CONDITIONS: { label: string; tooltip: string }[] = [
    {
        label: 'PTSD',
        tooltip: 'Post-Traumatic Stress Disorder (PTSD) — ICD-10: F43.1. A trauma-related psychiatric disorder characterised by intrusive re-experiencing, avoidance, negative cognitions, and hyperarousal following exposure to a life-threatening or severely distressing event.'
    },
    {
        label: 'Depression',
        tooltip: 'Major Depressive Disorder (MDD) — ICD-10: F32/F33. A mood disorder characterised by persistent low mood, anhedonia, cognitive impairment, and neurovegetative changes. Includes treatment-resistant depression (TRD) where two or more adequate antidepressant trials have failed.'
    },
    {
        label: 'Anxiety / GAD',
        tooltip: 'Generalised Anxiety Disorder (GAD) — ICD-10: F41.1. Chronic, excessive, and difficult-to-control worry across multiple domains (health, work, relationships). Accompanied by physical symptoms: muscle tension, fatigue, sleep disruption, and irritability. Also covers panic disorder (F41.0) and social anxiety disorder (F40.10).'
    },
    {
        label: 'Addiction / SUD',
        tooltip: 'Substance Use Disorder (SUD) — ICD-10: F10–F19. A pattern of compulsive substance use creating clinically significant impairment, including alcohol use disorder (AUD), opioid use disorder (OUD), stimulant use disorder, and tobacco dependence. Psilocybin-assisted therapy has active trial evidence for AUD and tobacco cessation.'
    },
    {
        label: 'End-of-Life Distress',
        tooltip: 'Existential and Psychological Distress (EOL) — ICD-10: F43.8 / Z51.5. Anxiety, depression, and demoralisation arising in the context of a terminal or life-limiting diagnosis. Commonly includes death anxiety, loss of meaning, and anticipatory grief. FDA has granted Breakthrough Therapy designation for psilocybin-assisted therapy in this indication.'
    },
    {
        label: 'Spiritual / Ceremonial',
        tooltip: 'Non-clinical / Ceremonial Use. Intentional, facilitated entheogenic experience for spiritual growth, meaning-making, or personal development. Not associated with a DSM-5 or ICD-10 diagnosis. Documented traditional use spans indigenous cultures globally. Oregon Measure 109 explicitly includes this category within licensed facilitation services.'
    },
    {
        label: 'Chronic Pain',
        tooltip: 'Chronic Pain Condition — ICD-10: G89.2x / F45.41. Persistent pain lasting ≥3 months that significantly impacts function and quality of life. Includes fibromyalgia, complex regional pain syndrome (CRPS), and central sensitisation syndromes. Emerging evidence suggests psychedelic-assisted therapy may modulate pain-related affect and catastrophising.'
    },
    {
        label: 'Other',
        tooltip: 'Other or undifferentiated presenting concern not covered by the listed categories. Log free-text clinical context in the Session Notes field after session start.'
    },
];

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const SMOKING_STATUSES = ['Non-smoker', 'Ex-smoker', 'Current smoker', 'Prefer not to say'];

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

export const ProtocolConfiguratorModal: React.FC<ProtocolConfiguratorModalProps> = ({ onClose, onBack, onIntakeComplete }) => {
    const { config, setConfig } = useProtocol();
    const [selectedId, setSelectedId] = useState<ProtocolArchetype>(config.protocolType);
    const [saveAsDefault, setSaveAsDefault] = useState(true);
    const [customFeatures, setCustomFeatures] = useState<string[]>(
        config.protocolType === 'custom' ? config.enabledFeatures : ARCHETYPES[0].features
    );

    // ── Step 0: Patient Intake ──────────────────────────────────────────────
    const [condition, setCondition] = useState('');
    const [age, setAge] = useState('');
    // WO-655: weight is now a range FK + label from ref_weight_ranges (not a raw kg number)
    const [weightRangeId, setWeightRangeId] = useState<number | null>(null);
    const [weightLabel, setWeightLabel] = useState('');
    const [weightRanges, setWeightRanges] = useState<Array<{ id: number; range_label: string }>>([]);
    const [gender, setGender] = useState('');
    const [smoking, setSmoking] = useState('');

    // Fetch ref_weight_ranges on mount (Step 2 only — lazy to keep modal fast)
    useEffect(() => {
        import('../../supabaseClient').then(({ supabase }) => {
            supabase
                .from('ref_weight_ranges')
                .select('id, range_label')
                .eq('is_active', true)
                .order('id', { ascending: true })
                .then(({ data }) => {
                    if (data) setWeightRanges(data as Array<{ id: number; range_label: string }>);
                });
        });
    }, []);

    const [step, setStep] = useState<1 | 2>(1);

    // ── Completion state (used in step 2), hoisted to top level for hooks compliance ──
    const stepDone = {
        condition: !!condition,
        age: !!age && !isNaN(parseFloat(age)) && parseFloat(age) >= 18,
        // WO-655: weight step is complete when a range is selected (weightRangeId non-null)
        weight: weightRangeId !== null,
        gender: !!gender,
        smoking: !!smoking,
    };
    const allComplete = stepDone.condition && stepDone.age && stepDone.weight && stepDone.gender && stepDone.smoking;

    // Ref for the Start Session button, receives focus when allComplete flips true
    const startBtnRef = useRef<HTMLButtonElement>(null);
    // Ref for the age input, used for programmatic focus progression
    const ageInputRef = useRef<HTMLInputElement>(null);

    // Auto-focus the Start Session button the moment all 5 steps are complete
    useEffect(() => {
        if (step === 2 && allComplete && startBtnRef.current) {
            startBtnRef.current.focus();
        }
    }, [step, allComplete]);

    // Auto-focus the Age input once condition + gender + smoking are all selected
    // and the user hasn't entered an age yet. This saves a click before the numeric fields.
    useEffect(() => {
        if (step === 2 && condition && gender && smoking && !age) {
            ageInputRef.current?.focus();
        }
    }, [step, condition, gender, smoking, age]);

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

    const handleBack = () => setStep(1);

    const handleSave = () => {
        // WO-655: persist weight_range_id + weight_label (no raw kg) to localStorage
        try {
            localStorage.setItem('ppn_patient_intake', JSON.stringify({
                condition, age, weight_range_id: weightRangeId, weight_label: weightLabel, gender, smoking
            }));
        } catch (_) { }
        if (onIntakeComplete) {
            onIntakeComplete({ condition, age, weight_range_id: weightRangeId, weight_label: weightLabel, gender, smoking });
        }
        onClose();
    };

    if (step === 2) {

        return (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/80 backdrop-blur-sm transition-all duration-300">
                <div className="w-full max-w-2xl bg-[#0a1628] rounded-t-3xl sm:rounded-3xl border-t border-x sm:border border-slate-700/50 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300" style={{ maxHeight: '95dvh' }}>
                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/60 bg-slate-900/40">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                                <Settings2 className="w-6 h-6 text-violet-400" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight mt-0.5">New Patient Setup</h2>
                                <p className="text-base text-slate-400 mt-1">Complete all 5 steps, then start your session.</p>
                            </div>
                        </div>
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            aria-label="Close patient setup"
                            className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all flex-shrink-0 ml-4"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-5 space-y-2.5 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100dvh - 180px)' }}>

                        {/* Step 1, Condition */}
                        <div className={`rounded-2xl border p-4 transition-all duration-200 ${stepDone.condition ? 'border-indigo-500/50 bg-indigo-950/20' : 'border-slate-700/50 bg-slate-900/40'}`}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 border transition-all duration-200 ${stepDone.condition ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                                    {stepDone.condition ? <CheckCircle className="w-4 h-4" /> : '1'}
                                </div>
                                <label className="form-label" style={{ color: '#A8B5D1' }}>
                                    What are you primarily treating? <span className="text-indigo-400">*</span>
                                </label>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {CONDITIONS.map(c => (
                                    <div key={c.label} className="inline-flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setCondition(c.label)}
                                            className={`min-h-[44px] sm:min-h-0 px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-300 ease-in-out active:scale-95 ${condition === c.label
                                                ? 'bg-indigo-600 text-white border-indigo-500 shadow shadow-indigo-600/30'
                                                : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:border-slate-500 hover:text-slate-200'
                                                }`}
                                        >
                                            {c.label}
                                        </button>
                                        <AdvancedTooltip
                                            tier="guide"
                                            type="clinical"
                                            title={c.label}
                                            content={c.tooltip}
                                            side="bottom"
                                            width="w-[360px]"
                                        >
                                            <Info
                                                size={13}
                                                aria-label={`Learn more about ${c.label}`}
                                                className="text-slate-500 hover:text-indigo-400 cursor-help transition-colors print:hidden flex-shrink-0"
                                            />
                                        </AdvancedTooltip>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Steps 2 & 3, Gender + Smoking Status (combined row) */}
                        <div className={`rounded-2xl border p-4 transition-all duration-200 ${stepDone.gender && stepDone.smoking ? 'border-indigo-500/50 bg-indigo-950/20' : 'border-slate-700/50 bg-slate-900/40'}`}>
                            <div className="grid grid-cols-2 gap-6">
                                {/* Gender */}
                                <div>
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 border transition-all duration-200 ${stepDone.gender ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                                            {stepDone.gender ? <CheckCircle className="w-4 h-4" /> : '2'}
                                        </div>
                                        <label className="form-label" style={{ color: '#A8B5D1' }}>Gender</label>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {GENDERS.map(g => (
                                            <button
                                                key={g}
                                                type="button"
                                                onClick={() => setGender(g)}
                                                className={`min-h-[44px] sm:min-h-0 px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-300 ease-in-out active:scale-95 ${gender === g
                                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow shadow-indigo-600/30'
                                                    : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:border-slate-500 hover:text-slate-200'
                                                    }`}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* Smoking Status */}
                                <div>
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 border transition-all duration-200 ${stepDone.smoking ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                                            {stepDone.smoking ? <CheckCircle className="w-4 h-4" /> : '3'}
                                        </div>
                                        <label className="form-label" style={{ color: '#A8B5D1' }}>Smoking Status</label>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {SMOKING_STATUSES.map(s => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setSmoking(s)}
                                                className={`min-h-[44px] sm:min-h-0 px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-300 ease-in-out active:scale-95 ${smoking === s
                                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow shadow-indigo-600/30'
                                                    : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:border-slate-500 hover:text-slate-200'
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Steps 4 & 5, Age + Weight (combined row) */}
                        <div className={`rounded-2xl border p-4 transition-all duration-200 ${stepDone.age && stepDone.weight ? 'border-indigo-500/50 bg-indigo-950/20' : 'border-slate-700/50 bg-slate-900/40'}`}>
                            <div className="grid grid-cols-2 gap-6">
                                {/* Age */}
                                <div>
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 border transition-all duration-200 ${stepDone.age ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                                            {stepDone.age ? <CheckCircle className="w-4 h-4" /> : '4'}
                                        </div>
                                        <label htmlFor="intake-age" className="form-label" style={{ color: '#A8B5D1' }}>Age</label>
                                    </div>
                                    <input
                                        ref={ageInputRef}
                                        id="intake-age"
                                        type="number"
                                        min="18"
                                        max="99"
                                        placeholder="e.g. 42"
                                        value={age}
                                        onChange={e => setAge(e.target.value)}
                                        onFocus={e => e.target.select()}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' && stepDone.age) {
                                                e.preventDefault();
                                                // Focus the weight range dropdown (WO-655: no Text input ref needed)
                                                (document.getElementById('intake-weight') as HTMLSelectElement | null)?.focus();
                                            }
                                        }}
                                        className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/50 focus:border-indigo-500/60 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                                    />
                                </div>
                                {/* Weight */}
                                <div>
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 border transition-all duration-200 ${stepDone.weight ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                                            {stepDone.weight ? <CheckCircle className="w-4 h-4" /> : '5'}
                                        </div>
                                        <label htmlFor="intake-weight" className="form-label" style={{ color: '#A8B5D1' }}>
                                            Weight Range
                                        </label>
                                    </div>
                                    {/* WO-655: dropdown backed by ref_weight_ranges — no exact kg stored */}
                                    <select
                                        id="intake-weight"
                                        value={weightRangeId ?? ''}
                                        onChange={e => {
                                            const id = e.target.value ? Number(e.target.value) : null;
                                            setWeightRangeId(id);
                                            const found = weightRanges.find(r => r.id === id);
                                            setWeightLabel(found?.range_label ?? '');
                                            if (allComplete || id !== null) startBtnRef.current?.focus();
                                        }}
                                        className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/50 focus:border-indigo-500/60 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all appearance-none"
                                    >
                                        <option value="">Select range...</option>
                                        {weightRanges.map(r => (
                                            <option key={r.id} value={r.id}>{r.range_label}</option>
                                        ))}
                                    </select>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Footer, Back + Start Session */}
                    <div className="flex justify-between items-center gap-3 px-6 py-5 border-t border-slate-800/60 bg-slate-900/40">
                        <button
                            onClick={handleBack}
                            aria-label="Back to protocol selection"
                            className="flex items-center gap-2 px-5 py-3 text-base font-semibold rounded-xl border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 hover:border-slate-600 transition-all active:scale-95"
                        >
                            ← Back
                        </button>
                        <button
                            ref={startBtnRef}
                            onClick={handleSave}
                            disabled={!allComplete}
                            aria-label={allComplete ? 'Start session' : 'Complete all five steps to enable'}
                            className={`px-8 py-3 text-lg font-extrabold rounded-xl transition-all duration-300 border ${allComplete
                                ? 'bg-indigo-700/50 hover:bg-indigo-600/60 border-indigo-500/50 text-indigo-100 shadow-lg shadow-indigo-500/20 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900'
                                : 'bg-slate-800/40 border-slate-700/40 text-slate-500 cursor-not-allowed opacity-50'
                                }`}
                        >
                            Start Session →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/80 backdrop-blur-sm transition-all duration-300">
            <div className="w-full max-w-3xl bg-[#0a1628] rounded-t-3xl sm:rounded-3xl border-t border-x sm:border border-slate-700/50 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300" style={{ maxHeight: '95dvh' }}>
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
                    {/* X, on Step 1, goes back to PatientSelectModal (not forward into the journey) */}
                    <button
                        onClick={onBack ?? onClose}
                        aria-label="Back to patient selection"
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all flex-shrink-0 ml-4"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8 space-y-8 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100dvh - 180px)' }}>

                    {/* Educational Callout */}
                    <div className="flex items-start gap-3 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                        <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-base text-indigo-200 font-medium tracking-wide">Choose Your Workspace</p>
                            <p className="text-base text-indigo-300/80 mt-1.5 leading-relaxed">
                                Select the tools you actually use to keep your interface clean and fast.
                                <strong className="text-indigo-200 font-medium"> Please don't over-select "just in case"</strong>, you can change these settings at any time!
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
                                            <AdvancedTooltip content={domain.tooltipText} tier="standard" type="info" side={index % 2 === 1 ? 'bottom-left' : 'bottom'} width="w-[280px]" learnMoreUrl="/help/wellness-journey">
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
                                                    <label key={feat.id} className="flex items-start gap-3.5 cursor-pointer group min-h-[44px] sm:min-h-0 py-1 sm:py-0">
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

                {/* Footer, Back + Start Session */}
                <div className="flex justify-between items-center gap-3 px-6 py-5 border-t border-slate-800/60 bg-slate-900/40">
                    <button
                        onClick={onBack ?? onClose}
                        aria-label="Back to patient selection"
                        className="flex items-center gap-2 px-5 py-3 text-base font-semibold rounded-xl border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 hover:border-slate-600 transition-all active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
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
