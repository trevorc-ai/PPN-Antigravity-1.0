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
}

// Step 5 (Consent) removed — handled by the dedicated ConsentForm in Phase 1
const STEPS = [
    { id: 1, title: 'Mental Health Screening', subtitle: 'PHQ-9, GAD-7, ACE, PCL-5' },
    { id: 2, title: 'Set & Setting', subtitle: 'Treatment Expectancy' },
    { id: 3, title: 'Baseline Physiology', subtitle: 'HRV, Blood Pressure' },
    { id: 4, title: 'Clinical Observations', subtitle: 'Motivation, Support, Experience' },
];

const STORAGE_KEY = (patientId: string) => `ppn_wizard_baseline_${patientId}`;

const DEFAULT_DATA: WizardData = {
    mentalHealth: { phq9: null, gad7: null, ace: null, pcl5: null },
    setSetting: { treatment_expectancy: 50 },
    physiology: { hrv_ms: null, bp_systolic: null, bp_diastolic: null },
    observations: { motivation_level: '', support_system: '', prior_experience: '' },
};

const MOTIVATION_OPTIONS = ['Low', 'Moderate', 'High', 'Very High'];
const SUPPORT_OPTIONS = ['None identified', 'Minimal', 'Moderate', 'Strong'];
const EXPERIENCE_OPTIONS = ['None', 'Minimal (1-2 times)', 'Some (3-5 times)', 'Experienced (6+ times)'];

/** Inline validation for a numeric field — returns an error string or null */
function validateRange(value: number | null, min: number, max: number, label: string): string | null {
    if (value === null) return null; // empty = no error (field not touched)
    if (isNaN(value)) return `${label} must be a number`;
    if (value < min) return `${label} must be ≥ ${min}`;
    if (value > max) return `${label} must be ≤ ${max}`;
    return null;
}

function NumericInput({
    label, value, onChange, min, max, placeholder, id, error,
}: {
    label: string;
    value: number | null;
    onChange: (v: number | null) => void;
    min?: number;
    max?: number;
    placeholder?: string;
    id: string;
    error?: string | null;
}) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">
                {label}
            </label>
            <input
                id={id}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*\.?\[0-9]*"
                min={min}
                max={max}
                placeholder={placeholder}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                className={`w-full bg-slate-800/60 border rounded-xl px-4 py-3.5 text-slate-300 text-sm font-bold focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${error ? 'border-red-500/70 focus:ring-red-500' : 'border-slate-700'
                    }`}
            />
            {error ? (
                <p className="text-sm text-red-400 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {error}
                </p>
            ) : (
                min !== undefined && max !== undefined && (
                    <p className="text-sm text-slate-500 mt-1">Range: {min}–{max}</p>
                )
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
    const [saveExitFlash, setSaveExitFlash] = useState(false);
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
        // Flash confirmation for 800ms then exit
        setSaveExitFlash(true);
        setTimeout(() => {
            setSaveExitFlash(false);
            onExit?.();
        }, 800);
    }, [data, patientId, onExit]);

    const handleSubmitAll = useCallback(() => {
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
            consent: { consent_type: undefined, consent_obtained: false },
        };
        const gen = generateBaselineNarrative(input);
        setNarrative(gen);
        setCompleted(true);
        try { localStorage.removeItem(STORAGE_KEY(patientId)); } catch { /* ignore */ }
        onComplete?.(data);
    }, [data, patientId, onComplete]);

    useFormKeyboardShortcuts({
        onSave: handleSaveAndExit,
        onSubmit: step === STEPS.length ? handleSubmitAll : () => setStep((s) => Math.min(s + 1, STEPS.length)),
        onCancel: handleSaveAndExit,
        onStepChange: (s) => setStep(s),
    });

    const updateData = <K extends keyof WizardData>(section: K, updates: Partial<WizardData[K]>) => {
        setData((d) => ({ ...d, [section]: { ...d[section], ...updates } }));
    };

    // ── Step 1 completeness: all 4 scores entered ─────────────────────────────
    const step1Complete =
        data.mentalHealth.phq9 !== null &&
        data.mentalHealth.gad7 !== null &&
        data.mentalHealth.ace !== null &&
        data.mentalHealth.pcl5 !== null;

    // ── Step 3 validation errors ──────────────────────────────────────────────
    const hrvError = validateRange(data.physiology.hrv_ms, 10, 200, 'HRV');
    const bpSysError = validateRange(data.physiology.bp_systolic, 70, 200, 'BP Systolic');
    const bpDiaError = validateRange(data.physiology.bp_diastolic, 40, 130, 'BP Diastolic');
    const step3HasErrors = !!(hrvError || bpSysError || bpDiaError);

    // ── Step 4 completeness: all three observations selected ─────────────────
    const step4Complete =
        !!data.observations.motivation_level &&
        !!data.observations.support_system &&
        !!data.observations.prior_experience;

    // Next is disabled only for steps with mandatory gating
    const nextDisabled =
        (step === 1 && !step1Complete) ||
        (step === 3 && step3HasErrors) ||
        (step === 4 && !step4Complete);

    // ── Completed state: Review & Save ────────────────────────────────────────
    if (completed && narrative) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* Review & Save header */}
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                    <CheckCircle className="w-7 h-7 text-emerald-400 flex-shrink-0" />
                    <div>
                        <p className="text-xl font-black text-emerald-300">Review & Save</p>
                        <p className="text-sm text-emerald-300/70">All 4 sections complete. Review the narrative below, then save to your clinical record.</p>
                    </div>
                </div>

                <NarrativeViewer narrative={narrative} onClose={onExit} />
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
                        <span className="text-xs text-slate-500">
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
                        <p className="text-sm text-slate-400">Enter patient scores below. All 4 fields are required to proceed.</p>
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
                        {!step1Complete && (
                            <p className="text-sm text-slate-500 italic">Complete all 4 scores to unlock Next →</p>
                        )}
                    </>
                )}

                {/* Step 2: Set & Setting */}
                {step === 2 && (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="expectancy" className="block text-sm font-black text-slate-300 uppercase tracking-widest mb-3">
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
                                className="assessment-slider w-full"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>Low confidence</span>
                                <span>High confidence</span>
                            </div>
                        </div>
                        <div className={`p-3 rounded-xl border text-base font-semibold ${data.setSetting.treatment_expectancy >= 70
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

                {/* Step 3: Physiology — with range validation */}
                {step === 3 && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <NumericInput
                                id="hrv"
                                label="Resting HRV (ms)"
                                value={data.physiology.hrv_ms}
                                onChange={(v) => updateData('physiology', { hrv_ms: v })}
                                min={10} max={200}
                                placeholder="e.g. 50"
                                error={hrvError}
                            />
                        </div>
                        <NumericInput
                            id="bp-sys"
                            label="BP Systolic (mmHg)"
                            value={data.physiology.bp_systolic}
                            onChange={(v) => updateData('physiology', { bp_systolic: v })}
                            min={70} max={200}
                            placeholder="e.g. 120"
                            error={bpSysError}
                        />
                        <NumericInput
                            id="bp-dia"
                            label="BP Diastolic (mmHg)"
                            value={data.physiology.bp_diastolic}
                            onChange={(v) => updateData('physiology', { bp_diastolic: v })}
                            min={40} max={130}
                            placeholder="e.g. 80"
                            error={bpDiaError}
                        />
                        {step3HasErrors && (
                            <div className="col-span-2 flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-300">Correct the values above before proceeding.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 4: Observations */}
                {step === 4 && (
                    <div className="space-y-5">
                        {([
                            { key: 'motivation_level', label: 'Motivation Level', options: MOTIVATION_OPTIONS, id: 'motivation' },
                            { key: 'support_system', label: 'Support System', options: SUPPORT_OPTIONS, id: 'support' },
                            { key: 'prior_experience', label: 'Prior Psychedelic Experience', options: EXPERIENCE_OPTIONS, id: 'experience' },
                        ] as const).map(({ key, label, options }) => (
                            <div key={key}>
                                <p className="text-sm font-black text-slate-300 uppercase tracking-widest mb-2">{label}</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {options.map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => updateData('observations', { [key]: opt } as Partial<WizardData['observations']>)}
                                            aria-pressed={data.observations[key] === opt}
                                            className={`py-2.5 px-3 rounded-xl border text-sm font-bold transition-all ${data.observations[key] === opt
                                                ? 'bg-primary/20 border-primary text-primary'
                                                : 'bg-slate-800/40 border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white'
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {!step4Complete && (
                            <p className="text-sm text-slate-500 italic">Select an option in each category to proceed.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation Footer */}
            <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-900/40">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setStep((s) => Math.max(s - 1, 1))}
                        disabled={step === 1}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-700 text-slate-300 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:border-slate-500 hover:text-white transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>

                    <button
                        onClick={handleSaveAndExit}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${saveExitFlash
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                            : 'border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
                            }`}
                    >
                        {saveExitFlash ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {saveExitFlash ? 'Saved!' : 'Save & Exit'}
                    </button>

                    <button
                        onClick={step === STEPS.length ? handleSubmitAll : () => setStep((s) => Math.min(s + 1, STEPS.length))}
                        disabled={nextDisabled}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ml-auto ${nextDisabled
                            ? 'bg-slate-800/40 border border-slate-700 text-slate-600 cursor-not-allowed'
                            : step === STEPS.length
                                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
                                : 'bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30'
                            }`}
                    >
                        {step === STEPS.length ? (
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

                <p className="text-sm text-slate-500 mt-2 text-center">
                    Keyboard: <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-400">Cmd+S</kbd> Save &amp; Exit &nbsp;·&nbsp;
                    <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-400">Cmd+Enter</kbd> Next &nbsp;·&nbsp;
                    <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-400">Alt+1–4</kbd> Jump to step
                </p>
            </div>
        </div>
    );
};

export default BaselineAssessmentWizard;
