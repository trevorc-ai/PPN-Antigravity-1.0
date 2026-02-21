import React, { useState, useEffect, useCallback } from 'react';
import { Save, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
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

function validateRange(value: number | null, min: number, max: number, label: string): string | null {
    if (value === null) return null;
    if (isNaN(value)) return `${label} must be a number`;
    if (value < min) return `${label} must be ≥ ${min}`;
    if (value > max) return `${label} must be ≤ ${max}`;
    return null;
}

/** Compact score input for the PHQ-9 / GAD-7 / ACE / PCL-5 row */
function ScoreInput({
    id, label, value, onChange, min, max,
}: {
    id: string; label: string; value: number | null;
    onChange: (v: number | null) => void; min: number; max: number;
}) {
    const error = validateRange(value, min, max, label);
    return (
        <div>
            <label htmlFor={id} className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                {label}
            </label>
            <input
                id={id}
                type="text"
                inputMode="numeric"
                placeholder={`0–${max}`}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                className={`w-full bg-slate-800/60 border rounded-xl px-3 py-2.5 text-slate-300 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${error ? 'border-red-500/70' : 'border-slate-700'
                    }`}
            />
            {error
                ? <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>
                : <p className="text-xs text-slate-600 mt-1">Range: {min}–{max}</p>
            }
        </div>
    );
}

/** Compact numeric field for physiology */
function PhysioInput({
    id, label, value, onChange, min, max, placeholder,
}: {
    id: string; label: string; value: number | null;
    onChange: (v: number | null) => void; min: number; max: number; placeholder: string;
}) {
    const error = validateRange(value, min, max, label);
    return (
        <div>
            <label htmlFor={id} className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                {label}
            </label>
            <input
                id={id}
                type="text"
                inputMode="numeric"
                placeholder={placeholder}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                className={`w-full bg-slate-800/60 border rounded-xl px-3 py-2.5 text-slate-300 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${error ? 'border-red-500/70' : 'border-slate-700'
                    }`}
            />
            {error
                ? <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>
                : <p className="text-xs text-slate-600 mt-1">Range: {min}–{max}</p>
            }
        </div>
    );
}

export const BaselineAssessmentWizard: React.FC<BaselineAssessmentWizardProps> = ({
    patientId,
    onComplete,
    onExit,
}) => {
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
    const [saveContFlash, setSaveContFlash] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [narrative, setNarrative] = useState<ReturnType<typeof generateBaselineNarrative> | null>(null);

    // Auto-save to localStorage every 30s (not to DB — only explicit Save triggers DB)
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

        // Flash then advance
        setSaveContFlash(true);
        setTimeout(() => {
            setSaveContFlash(false);
            onComplete?.(data);
        }, 700);
    }, [data, patientId, onComplete]);

    const updateData = <K extends keyof WizardData>(section: K, updates: Partial<WizardData[K]>) => {
        setData((d) => ({ ...d, [section]: { ...d[section], ...updates } }));
    };

    // ── Validation ────────────────────────────────────────────────────────────
    const allScoresEntered =
        data.mentalHealth.phq9 !== null &&
        data.mentalHealth.gad7 !== null &&
        data.mentalHealth.ace !== null &&
        data.mentalHealth.pcl5 !== null;

    const hrvError = validateRange(data.physiology.hrv_ms, 10, 200, 'HRV');
    const bpSysError = validateRange(data.physiology.bp_systolic, 70, 200, 'BP Systolic');
    const bpDiaError = validateRange(data.physiology.bp_diastolic, 40, 130, 'BP Diastolic');
    const hasPhysioError = !!(hrvError || bpSysError || bpDiaError);

    const allObservationsSelected =
        !!data.observations.motivation_level &&
        !!data.observations.support_system &&
        !!data.observations.prior_experience;

    const canSubmit = allScoresEntered && !hasPhysioError;

    const expectancyLabel =
        data.setSetting.treatment_expectancy >= 70 ? { text: 'High expectancy — positive prognostic indicator', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
            : data.setSetting.treatment_expectancy >= 40 ? { text: 'Moderate expectancy — discuss realistic outcomes', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
                : { text: 'Low expectancy — consider additional preparation', color: 'text-red-400 bg-red-500/10 border-red-500/20' };

    // ── Completed state ───────────────────────────────────────────────────────
    if (completed && narrative) {
        return (
            <div className="p-6">
                <NarrativeViewer narrative={narrative} onClose={onExit} />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-4">

            {/* ── Section 1: Psychometric Scores ───────────────────────────── */}
            <section className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">Psychometric Scores</h3>
                    {lastSaved && (
                        <span className="text-xs text-slate-500">
                            Saved {lastSaved.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </span>
                    )}
                </div>
                <p className="text-sm text-slate-500">Enter patient scores. PHQ-9, GAD-7, ACE, and PCL-5 are required to save.</p>
                <div className="grid grid-cols-2 gap-4">
                    <ScoreInput id="phq9" label="PHQ-9 Score" value={data.mentalHealth.phq9} onChange={(v) => updateData('mentalHealth', { phq9: v })} min={0} max={27} />
                    <ScoreInput id="gad7" label="GAD-7 Score" value={data.mentalHealth.gad7} onChange={(v) => updateData('mentalHealth', { gad7: v })} min={0} max={21} />
                    <ScoreInput id="ace" label="ACE Score" value={data.mentalHealth.ace} onChange={(v) => updateData('mentalHealth', { ace: v })} min={0} max={10} />
                    <ScoreInput id="pcl5" label="PCL-5 Score" value={data.mentalHealth.pcl5} onChange={(v) => updateData('mentalHealth', { pcl5: v })} min={0} max={80} />
                </div>
            </section>

            {/* ── Section 2: Treatment Expectancy ──────────────────────────── */}
            <section className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">Treatment Expectancy</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label htmlFor="expectancy" className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            Belief in Treatment
                        </label>
                        <span className="text-2xl font-black text-slate-200">{data.setSetting.treatment_expectancy}</span>
                    </div>
                    <input
                        id="expectancy"
                        type="range"
                        min={0} max={100} step={5}
                        value={data.setSetting.treatment_expectancy}
                        onChange={(e) => updateData('setSetting', { treatment_expectancy: parseInt(e.target.value) })}
                        className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right, #ef4444 0%, #f59e0b 33%, #10b981 66%, #10b981 100%)` }}
                    />
                    <div className="flex justify-between text-xs text-slate-600">
                        <span>Low (0)</span><span>High (100)</span>
                    </div>
                    <div className={`px-4 py-2.5 rounded-xl border text-sm font-semibold ${expectancyLabel.color}`}>
                        {expectancyLabel.text}
                    </div>
                </div>
            </section>

            {/* ── Section 3: Baseline Physiology ───────────────────────────── */}
            <section className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">Baseline Physiology <span className="text-slate-600 font-normal normal-case tracking-normal ml-1">(optional)</span></h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-3">
                        <PhysioInput id="hrv" label="Resting HRV (ms)" value={data.physiology.hrv_ms} onChange={(v) => updateData('physiology', { hrv_ms: v })} min={10} max={200} placeholder="e.g. 50" />
                    </div>
                    <div className="col-span-3 grid grid-cols-2 gap-4">
                        <PhysioInput id="bp-sys" label="BP Systolic (mmHg)" value={data.physiology.bp_systolic} onChange={(v) => updateData('physiology', { bp_systolic: v })} min={70} max={200} placeholder="e.g. 120" />
                        <PhysioInput id="bp-dia" label="BP Diastolic (mmHg)" value={data.physiology.bp_diastolic} onChange={(v) => updateData('physiology', { bp_diastolic: v })} min={40} max={130} placeholder="e.g. 80" />
                    </div>
                </div>
            </section>

            {/* ── Section 4: Clinical Observations ─────────────────────────── */}
            <section className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 space-y-5">
                <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">Clinical Observations <span className="text-slate-600 font-normal normal-case tracking-normal ml-1">(optional)</span></h3>

                {([
                    { key: 'motivation_level' as const, label: 'Motivation Level', options: MOTIVATION_OPTIONS },
                    { key: 'support_system' as const, label: 'Support System', options: SUPPORT_OPTIONS },
                    { key: 'prior_experience' as const, label: 'Prior Psychedelic Experience', options: EXPERIENCE_OPTIONS },
                ]).map(({ key, label, options }) => (
                    <div key={key}>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
                        <div className="grid grid-cols-2 gap-2">
                            {options.map((opt) => {
                                const isSelected = data.observations[key] === opt;
                                return (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => updateData('observations', { [key]: opt } as Partial<WizardData['observations']>)}
                                        aria-pressed={isSelected}
                                        className={`flex items-center gap-2 py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all active:scale-95 ${isSelected
                                                ? 'bg-blue-600/20 border-blue-500/60 text-blue-300'
                                                : 'bg-slate-800/40 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-slate-200'
                                            }`}
                                    >
                                        <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 transition-opacity ${isSelected ? 'opacity-100 text-blue-400' : 'opacity-0'}`} aria-hidden="true" />
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </section>

            {/* ── Footer: Save & Exit | Save & Continue ────────────────────── */}
            <div className="flex items-center justify-between gap-4 mr-16">
                <button
                    onClick={handleSaveAndExit}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${saveExitFlash
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                            : 'border-slate-700 text-slate-300 hover:border-slate-500 hover:text-slate-200'
                        }`}
                >
                    {saveExitFlash ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saveExitFlash ? 'Saved!' : 'Save & Exit'}
                </button>

                <button
                    onClick={handleSubmitAll}
                    disabled={!canSubmit || saveContFlash}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${saveContFlash
                            ? 'bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 cursor-not-allowed'
                            : !canSubmit
                                ? 'bg-slate-800/40 border border-slate-700 text-slate-600 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-500 text-slate-200 shadow-lg shadow-blue-900/30'
                        }`}
                >
                    {saveContFlash ? <CheckCircle className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    {saveContFlash ? 'Saved!' : 'Save & Continue'}
                </button>
            </div>

            {/* Hint if scores missing */}
            {!canSubmit && (
                <p className="text-xs text-slate-500 text-right mr-16">
                    {!allScoresEntered ? 'Enter all 4 psychometric scores to continue' : 'Fix physiology errors to continue'}
                </p>
            )}
        </div>
    );
};

export default BaselineAssessmentWizard;
