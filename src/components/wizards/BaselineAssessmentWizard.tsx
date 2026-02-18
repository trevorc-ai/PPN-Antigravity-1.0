import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { useFormKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { generateBaselineNarrative, NarrativeInput } from '../../services/narrativeGenerator';
import { NarrativeViewer } from '../narrative/NarrativeViewer';

interface BaselineAssessmentWizardProps {
    patientId: string;
    onComplete?: (data: WizardData) => void;
    onExit?: () => void;
}

interface WizardData {
    mentalHealth: {
        phq9: number | null;
        gad7: number | null;
        ace: number | null;
        pcl5: number | null;
    };
    setSetting: {
        treatment_expectancy: number;
    };
    physiology: {
        hrv_ms: number | null;
        bp_systolic: number | null;
        bp_diastolic: number | null;
    };
    observations: {
        motivation_level: string;
        support_system: string;
        prior_experience: string;
    };
    consent: {
        consent_type: string;
        consent_obtained: boolean;
    };
}

const STEPS = [
    { id: 1, title: 'Mental Health Screening', subtitle: 'PHQ-9, GAD-7, ACE, PCL-5' },
    { id: 2, title: 'Set & Setting', subtitle: 'Treatment Expectancy' },
    { id: 3, title: 'Baseline Physiology', subtitle: 'HRV, Blood Pressure' },
    { id: 4, title: 'Clinical Observations', subtitle: 'Motivation, Support, Experience' },
    { id: 5, title: 'Informed Consent', subtitle: 'Consent Documentation' },
];

const STORAGE_KEY = (patientId: string) => `ppn_wizard_baseline_${patientId}`;

const DEFAULT_DATA: WizardData = {
    mentalHealth: { phq9: null, gad7: null, ace: null, pcl5: null },
    setSetting: { treatment_expectancy: 50 },
    physiology: { hrv_ms: null, bp_systolic: null, bp_diastolic: null },
    observations: { motivation_level: '', support_system: '', prior_experience: '' },
    consent: { consent_type: '', consent_obtained: false },
};

const MOTIVATION_OPTIONS = ['Low', 'Moderate', 'High', 'Very High'];
const SUPPORT_OPTIONS = ['None identified', 'Minimal', 'Moderate', 'Strong'];
const EXPERIENCE_OPTIONS = ['None', 'Minimal (1-2 times)', 'Some (3-5 times)', 'Experienced (6+ times)'];
const CONSENT_TYPES = ['Full informed consent', 'Assent with guardian', 'Research consent', 'Verbal consent documented'];

function NumericInput({ label, value, onChange, min, max, placeholder, id }: {
    label: string; value: number | null; onChange: (v: number | null) => void;
    min?: number; max?: number; placeholder?: string; id: string;
}) {
    return (
        <div>
            <label htmlFor={id} className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                {label}
            </label>
            <input
                id={id}
                type="number"
                min={min}
                max={max}
                placeholder={placeholder}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3.5 text-slate-300 text-sm font-bold focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
            {min !== undefined && max !== undefined && (
                <p className="text-sm text-slate-600 mt-1">Range: {min}–{max}</p>
            )}
        </div>
    );
}

export const BaselineAssessmentWizard: React.FC<BaselineAssessmentWizardProps> = ({
    patientId,
    onComplete,
    onExit,
}) => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<WizardData>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY(patientId));
            return saved ? { ...DEFAULT_DATA, ...JSON.parse(saved) } : DEFAULT_DATA;
        } catch {
            return DEFAULT_DATA;
        }
    });
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [completed, setCompleted] = useState(false);
    const [narrative, setNarrative] = useState<ReturnType<typeof generateBaselineNarrative> | null>(null);

    // Auto-save every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            try {
                localStorage.setItem(STORAGE_KEY(patientId), JSON.stringify(data));
                setLastSaved(new Date());
            } catch { /* ignore */ }
        }, 30000);
        return () => clearInterval(interval);
    }, [data, patientId]);

    const handleSaveAndExit = useCallback(() => {
        try {
            localStorage.setItem(STORAGE_KEY(patientId), JSON.stringify(data));
            setLastSaved(new Date());
        } catch { /* ignore */ }
        onExit?.();
    }, [data, patientId, onExit]);

    const handleSubmitAll = useCallback(() => {
        // Generate narrative
        const input: NarrativeInput = {
            patientId,
            mentalHealth: {
                phq9: data.mentalHealth.phq9 ?? undefined,
                gad7: data.mentalHealth.gad7 ?? undefined,
                ace: data.mentalHealth.ace ?? undefined,
                pcl5: data.mentalHealth.pcl5 ?? undefined,
            },
            setSetting: { treatment_expectancy: data.setSetting.treatment_expectancy },
            physiology: {
                hrv_ms: data.physiology.hrv_ms ?? undefined,
                bp_systolic: data.physiology.bp_systolic ?? undefined,
                bp_diastolic: data.physiology.bp_diastolic ?? undefined,
            },
            observations: {
                motivation_level: data.observations.motivation_level || undefined,
                support_system: data.observations.support_system || undefined,
                prior_experience: data.observations.prior_experience || undefined,
            },
            consent: {
                consent_type: data.consent.consent_type || undefined,
                consent_obtained: data.consent.consent_obtained,
            },
        };
        const gen = generateBaselineNarrative(input);
        setNarrative(gen);
        setCompleted(true);
        // Clear auto-save
        try { localStorage.removeItem(STORAGE_KEY(patientId)); } catch { /* ignore */ }
        onComplete?.(data);
    }, [data, patientId, onComplete]);

    useFormKeyboardShortcuts({
        onSave: handleSaveAndExit,
        onSubmit: step === 5 ? handleSubmitAll : () => setStep((s) => Math.min(s + 1, 5)),
        onCancel: handleSaveAndExit,
        onStepChange: (s) => setStep(s),
    });

    const updateData = <K extends keyof WizardData>(section: K, updates: Partial<WizardData[K]>) => {
        setData((d) => ({ ...d, [section]: { ...d[section], ...updates } }));
    };

    if (completed && narrative) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                    <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-black text-emerald-400">Baseline Assessment Complete</p>
                        <p className="text-sm text-emerald-300/70">All 5 forms submitted. Clinical narrative generated below.</p>
                    </div>
                </div>
                <NarrativeViewer narrative={narrative} />
            </div>
        );
    }

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden">
            {/* Progress Header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-black text-slate-300">Baseline Assessment</h2>
                        <p className="text-sm text-slate-500 uppercase tracking-widest">
                            Step {step} of {STEPS.length}: {STEPS[step - 1].subtitle}
                        </p>
                    </div>
                    {lastSaved && (
                        <span className="text-xs text-slate-600">
                            Saved {lastSaved.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </span>
                    )}
                </div>

                {/* Progress dots */}
                <div className="flex items-center gap-2">
                    {STEPS.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => s.id < step && setStep(s.id)}
                            disabled={s.id > step}
                            aria-label={`Step ${s.id}: ${s.title}`}
                            className={`transition-all rounded-full ${s.id === step
                                    ? 'w-6 h-3 bg-primary'
                                    : s.id < step
                                        ? 'w-3 h-3 bg-emerald-500 cursor-pointer hover:bg-emerald-400'
                                        : 'w-3 h-3 bg-slate-700 cursor-not-allowed'
                                }`}
                        />
                    ))}
                    <span className="ml-2 text-xs text-slate-500">{STEPS[step - 1].title}</span>
                </div>
            </div>

            {/* Step Content */}
            <div className="p-6 space-y-5 min-h-[320px] animate-in fade-in duration-200">

                {/* Step 1: Mental Health */}
                {step === 1 && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <NumericInput id="phq9" label="PHQ-9 Score" value={data.mentalHealth.phq9} onChange={(v) => updateData('mentalHealth', { phq9: v })} min={0} max={27} placeholder="0–27" />
                            <NumericInput id="gad7" label="GAD-7 Score" value={data.mentalHealth.gad7} onChange={(v) => updateData('mentalHealth', { gad7: v })} min={0} max={21} placeholder="0–21" />
                            <NumericInput id="ace" label="ACE Score" value={data.mentalHealth.ace} onChange={(v) => updateData('mentalHealth', { ace: v })} min={0} max={10} placeholder="0–10" />
                            <NumericInput id="pcl5" label="PCL-5 Score" value={data.mentalHealth.pcl5} onChange={(v) => updateData('mentalHealth', { pcl5: v })} min={0} max={80} placeholder="0–80" />
                        </div>
                        {data.mentalHealth.pcl5 !== null && data.mentalHealth.pcl5 >= 33 && (
                            <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-amber-300">PCL-5 ≥ 33 — significant PTSD symptoms documented. Trauma-informed approach indicated.</p>
                            </div>
                        )}
                    </>
                )}

                {/* Step 2: Set & Setting */}
                {step === 2 && (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="expectancy" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                Treatment Expectancy: {data.setSetting.treatment_expectancy}/100
                            </label>
                            <input
                                id="expectancy"
                                type="range"
                                min={0}
                                max={100}
                                step={5}
                                value={data.setSetting.treatment_expectancy}
                                onChange={(e) => updateData('setSetting', { treatment_expectancy: parseInt(e.target.value) })}
                                className="w-full accent-primary"
                            />
                            <div className="flex justify-between text-xs text-slate-600 mt-1">
                                <span>Low confidence</span>
                                <span>High confidence</span>
                            </div>
                        </div>
                        <div className={`p-3 rounded-xl border text-xs font-medium ${data.setSetting.treatment_expectancy >= 70
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                                : data.setSetting.treatment_expectancy >= 40
                                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                                    : 'bg-red-500/10 border-red-500/20 text-red-300'
                            }`}>
                            {data.setSetting.treatment_expectancy >= 70 ? '✓ High expectancy — positive prognostic indicator'
                                : data.setSetting.treatment_expectancy >= 40 ? '⚠ Moderate expectancy — discuss realistic outcomes'
                                    : '⚠ Low expectancy — consider additional preparation sessions'}
                        </div>
                    </div>
                )}

                {/* Step 3: Physiology */}
                {step === 3 && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <NumericInput id="hrv" label="Resting HRV (ms)" value={data.physiology.hrv_ms} onChange={(v) => updateData('physiology', { hrv_ms: v })} min={10} max={200} placeholder="e.g. 50" />
                        </div>
                        <NumericInput id="bp-sys" label="BP Systolic (mmHg)" value={data.physiology.bp_systolic} onChange={(v) => updateData('physiology', { bp_systolic: v })} min={70} max={200} placeholder="e.g. 120" />
                        <NumericInput id="bp-dia" label="BP Diastolic (mmHg)" value={data.physiology.bp_diastolic} onChange={(v) => updateData('physiology', { bp_diastolic: v })} min={40} max={130} placeholder="e.g. 80" />
                    </div>
                )}

                {/* Step 4: Observations */}
                {step === 4 && (
                    <div className="space-y-5">
                        {([
                            { key: 'motivation_level', label: 'Motivation Level', options: MOTIVATION_OPTIONS, id: 'motivation' },
                            { key: 'support_system', label: 'Support System', options: SUPPORT_OPTIONS, id: 'support' },
                            { key: 'prior_experience', label: 'Prior Psychedelic Experience', options: EXPERIENCE_OPTIONS, id: 'experience' },
                        ] as const).map(({ key, label, options, id }) => (
                            <div key={key}>
                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {options.map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => updateData('observations', { [key]: opt } as Partial<WizardData['observations']>)}
                                            aria-pressed={data.observations[key] === opt}
                                            className={`py-2.5 px-3 rounded-xl border text-sm font-bold transition-all ${data.observations[key] === opt
                                                    ? 'bg-primary/20 border-primary text-primary'
                                                    : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600'
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Step 5: Consent */}
                {step === 5 && (
                    <div className="space-y-5">
                        <div>
                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Consent Type</p>
                            <div className="space-y-2">
                                {CONSENT_TYPES.map((type) => (
                                    <label
                                        key={type}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${data.consent.consent_type === type
                                                ? 'bg-primary/10 border-primary/40 text-slate-300'
                                                : 'bg-slate-800/30 border-slate-700/50 text-slate-400 hover:border-slate-600'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="consent_type"
                                            value={type}
                                            checked={data.consent.consent_type === type}
                                            onChange={() => updateData('consent', { consent_type: type })}
                                            className="w-4 h-4 accent-primary"
                                        />
                                        <span className="text-sm font-medium">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <label className={`flex items-center gap-3 px-4 py-4 rounded-2xl border cursor-pointer transition-all ${data.consent.consent_obtained
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                : 'bg-slate-800/30 border-slate-700/50 text-slate-400'
                            }`}>
                            <input
                                type="checkbox"
                                checked={data.consent.consent_obtained}
                                onChange={(e) => updateData('consent', { consent_obtained: e.target.checked })}
                                className="w-5 h-5 rounded accent-emerald-500"
                            />
                            <span className="text-sm font-bold">Informed consent obtained and documented</span>
                        </label>
                    </div>
                )}
            </div>

            {/* Navigation Footer */}
            <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-900/40">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setStep((s) => Math.max(s - 1, 1))}
                        disabled={step === 1}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-700 text-slate-400 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:border-slate-600 hover:text-slate-300 transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>

                    <button
                        onClick={handleSaveAndExit}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-700 text-slate-400 text-sm font-bold hover:border-slate-600 hover:text-slate-300 transition-all"
                    >
                        <Save className="w-4 h-4" />
                        Save & Exit
                    </button>

                    <button
                        onClick={step === 5 ? handleSubmitAll : () => setStep((s) => Math.min(s + 1, 5))}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ml-auto ${step === 5
                                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
                                : 'bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30'
                            }`}
                    >
                        {step === 5 ? (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                Submit All
                            </>
                        ) : (
                            <>
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>

                <p className="text-sm text-slate-600 mt-2 text-center">
                    Keyboard: <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-500">Cmd+S</kbd> Save &amp; Exit &nbsp;·&nbsp;
                    <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-500">Cmd+Enter</kbd> Next &nbsp;·&nbsp;
                    <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-500">Alt+1–5</kbd> Jump to step
                </p>
            </div>
        </div>
    );
};

export default BaselineAssessmentWizard;
