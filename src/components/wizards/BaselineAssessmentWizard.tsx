import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Save, CheckCircle, ChevronLeft, ChevronRight, LogOut, Info } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';
import { generateBaselineNarrative, NarrativeInput } from '../../services/narrativeGenerator';
import { NarrativeViewer } from '../narrative/NarrativeViewer';

interface BaselineAssessmentWizardProps {
    patientId: string;
    onComplete?: (data: WizardData) => void;
    onExit?: () => void;
    onBack?: () => void;
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

/** Styled number input for physiological readings (HRV, BP) — numeric keypad on tablet */
function PhysioInput({
    id, label, value, onChange, placeholder,
}: {
    id: string; label: string; value: number | null;
    onChange: (v: number | null) => void; placeholder: string;
}) {
    return (
        <div>
            <label htmlFor={id} className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                {label}
            </label>
            <input
                id={id}
                type="number"
                inputMode="numeric"
                placeholder={placeholder}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-300 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
        </div>
    );
}

/** Styled number input for wide-range scores (PCL-5 0–80) */
function ScoreInputLarge({
    id, label, value, onChange, max,
}: {
    id: string; label: string; value: number | null;
    onChange: (v: number | null) => void; max: number;
}) {
    return (
        <div>
            <label htmlFor={id} className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                {label}
            </label>
            <input
                id={id}
                type="number"
                inputMode="numeric"
                placeholder={`0–${max}`}
                min={0}
                max={max}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value === '' ? null : parseInt(e.target.value, 10))}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-300 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
        </div>
    );
}

/** Range dropdown for psychometric scores (PHQ-9 / GAD-7 / ACE / PCL-5) */
function ScoreSelect({
    id, label, value, onChange, min, max,
}: {
    id: string; label: string; value: number | null;
    onChange: (v: number | null) => void; min: number; max: number;
}) {
    const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);
    return (
        <div>
            <label htmlFor={id} className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                {label}
            </label>
            <select
                id={id}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value === '' ? null : parseInt(e.target.value, 10))}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-300 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            >
                <option value="">0–{max}</option>
                {options.map(v => (
                    <option key={v} value={v}>{v}</option>
                ))}
            </select>
        </div>
    );
}

/** Slider for wide-range numeric scores (PCL-5 0–80, step=5) */
function ScoreSlider({
    id, label, value, onChange, min, max, step,
}: {
    id: string; label: string; value: number | null;
    onChange: (v: number) => void; min: number; max: number; step: number;
}) {
    const sliderVal = value !== null ? value : min;
    const pct = ((sliderVal - min) / (max - min)) * 100;
    return (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <label htmlFor={id} className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    {label}
                </label>
                <span className="text-xl font-black text-slate-300">
                    {value !== null ? value : '—'}
                </span>
            </div>
            <input
                id={id}
                type="range"
                min={min} max={max} step={step}
                value={sliderVal}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="ppn-range w-full cursor-pointer"
                style={{ background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${pct}%, #334155 ${pct}%, #334155 100%)` }}
            />
            <div className="flex justify-between text-xs text-slate-600 mt-0.5">
                <span>{min}</span><span>{max}</span>
            </div>
        </div>
    );
}

export const BaselineAssessmentWizard: React.FC<BaselineAssessmentWizardProps> = ({
    patientId,
    onComplete,
    onExit,
    onBack,
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

    // Auto-save every 30s
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

        setSaveContFlash(true);
        setTimeout(() => {
            setSaveContFlash(false);
            onComplete?.(data);
        }, 700);
    }, [data, patientId, onComplete]);

    const updateData = <K extends keyof WizardData>(section: K, updates: Partial<WizardData[K]>) => {
        setData((d) => ({ ...d, [section]: { ...d[section], ...updates } }));
    };

    // ── Validation ─────────────────────────────────────────────────────────────────────────
    // At least one psychometric score is required to save
    const atLeastOneScore =
        data.mentalHealth.phq9 !== null ||
        data.mentalHealth.gad7 !== null ||
        data.mentalHealth.ace !== null ||
        data.mentalHealth.pcl5 !== null;

    const canSubmit = atLeastOneScore;

    const expectancyLabel =
        data.setSetting.treatment_expectancy >= 70
            ? { text: 'High expectancy — positive prognostic indicator', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
            : data.setSetting.treatment_expectancy >= 40
                ? { text: 'Moderate expectancy — discuss realistic outcomes', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
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
        <div className="space-y-3 pb-4">

            {/* ── Section 1: Psychometric Scores ───────────────────────── */}
            <section className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-1.5 text-base font-bold text-slate-500">
                        Psychometric Scores
                        <AdvancedTooltip content="Total composite scores from standardized assessments. PHQ-9 screens for depression severity (0–27), GAD-7 for anxiety (0–21), ACE for adverse childhood experiences (0–10), PCL-5 for PTSD symptom severity (0–80). At least one score is required to save." tier="standard" side="bottom">
                            <Info className="w-3.5 h-3.5 text-slate-500 cursor-help hover:text-slate-400 transition-colors" aria-label="About psychometric scores" />
                        </AdvancedTooltip>
                        <span className="text-slate-600 font-normal text-sm ml-0.5">at least one required</span>
                    </h3>
                    {lastSaved && (
                        <span className="text-xs text-slate-500">
                            Saved {lastSaved.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </span>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <ScoreSelect id="phq9" label="PHQ-9 (0–27)" value={data.mentalHealth.phq9} onChange={(v) => updateData('mentalHealth', { phq9: v })} min={0} max={27} />
                    <ScoreSelect id="gad7" label="GAD-7 (0–21)" value={data.mentalHealth.gad7} onChange={(v) => updateData('mentalHealth', { gad7: v })} min={0} max={21} />
                    <ScoreSelect id="ace" label="ACE (0–10)" value={data.mentalHealth.ace} onChange={(v) => updateData('mentalHealth', { ace: v })} min={0} max={10} />
                    <ScoreInputLarge id="pcl5" label="PCL-5 (0–80)" value={data.mentalHealth.pcl5} onChange={(v) => updateData('mentalHealth', { pcl5: v })} max={80} />
                </div>
            </section>

            {/* ── Section 2: Treatment Expectancy ──────────────────────── */}
            <section className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4 space-y-3">
                <h3 className="flex items-center gap-1.5 text-base font-bold text-slate-500">
                    Treatment Expectancy
                    <AdvancedTooltip content="The patient's belief that this treatment will be effective. Higher expectancy is a positive prognostic factor — research shows it independently improves outcomes. Scores ≥70 indicate high confidence. Scores below 40 suggest discussing realistic expectations and addressing ambivalence before proceeding." tier="standard">
                        <Info className="w-3.5 h-3.5 text-slate-500 cursor-help hover:text-slate-400 transition-colors" aria-label="About treatment expectancy" />
                    </AdvancedTooltip>
                </h3>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label htmlFor="expectancy" className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            Belief in Treatment
                        </label>
                        <span className="text-2xl font-black text-slate-400">{data.setSetting.treatment_expectancy}</span>
                    </div>
                    <input
                        id="expectancy"
                        type="range"
                        min={0} max={100} step={5}
                        value={data.setSetting.treatment_expectancy}
                        onChange={(e) => updateData('setSetting', { treatment_expectancy: parseInt(e.target.value) })}
                        className="ppn-range w-full cursor-pointer"
                        style={{ background: `linear-gradient(to right, #ef4444 0%, #f59e0b 40%, #10b981 70%, #10b981 100%)` }}
                    />
                    <div className="flex justify-between text-xs text-slate-600">
                        <span>Low (0)</span><span>High (100)</span>
                    </div>
                    <div className={`px-4 py-2.5 rounded-xl border text-sm font-semibold ${expectancyLabel.color}`}>
                        {expectancyLabel.text}
                    </div>
                </div>
            </section>

            {/* ── Section 3: Baseline Physiology (optional, 3-col) ─────── */}
            <section className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4 space-y-3">
                <h3 className="flex items-center gap-1.5 text-base font-bold text-slate-500">
                    Baseline Physiology
                    <AdvancedTooltip content="Optional pre-session physiological readings. Heart Rate Variability (HRV in ms) reflects autonomic nervous system state — higher values indicate parasympathetic dominance and readiness. Systolic and diastolic blood pressure document baseline cardiovascular status. These measurements are not required to save." tier="standard">
                        <Info className="w-3.5 h-3.5 text-slate-500 cursor-help hover:text-slate-400 transition-colors" aria-label="About baseline physiology" />
                    </AdvancedTooltip>
                    <span className="text-slate-600 font-normal text-sm ml-0.5">optional</span>
                </h3>
                {/* Number inputs — tablet opens numeric keypad, no scroll, precise entry */}
                <div className="grid grid-cols-3 gap-3">
                    <PhysioInput id="hrv" label="HRV (ms)" value={data.physiology.hrv_ms} onChange={(v) => updateData('physiology', { hrv_ms: v })} placeholder="e.g. 55" />
                    <PhysioInput id="bp-sys" label="Systolic" value={data.physiology.bp_systolic} onChange={(v) => updateData('physiology', { bp_systolic: v })} placeholder="e.g. 120" />
                    <PhysioInput id="bp-dia" label="Diastolic" value={data.physiology.bp_diastolic} onChange={(v) => updateData('physiology', { bp_diastolic: v })} placeholder="e.g. 80" />
                </div>
            </section>

            {/* ── Section 4: Clinical Observations (optional) ──────────── */}
            <section className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4 space-y-4">
                <h3 className="flex items-center gap-1.5 text-base font-bold text-slate-500">
                    Clinical Observations
                    <AdvancedTooltip content="Clinician-rated impressions of the patient at this session. These observations supplement standardised scale scores and inform session readiness decisions. Motivation, support system strength, and prior experience with psychedelics are key predictors of treatment outcomes." tier="standard">
                        <Info className="w-3.5 h-3.5 text-slate-500 cursor-help hover:text-slate-400 transition-colors" aria-label="About clinical observations" />
                    </AdvancedTooltip>
                    <span className="text-slate-600 font-normal text-sm ml-0.5">optional</span>
                </h3>

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
                                            ? 'bg-indigo-700/30 border-indigo-500/60 text-indigo-300'
                                            : 'bg-slate-800/40 border-slate-700 text-slate-300 hover:border-slate-500'
                                            }`}
                                    >
                                        <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'opacity-100 text-indigo-400' : 'opacity-0'}`} aria-hidden="true" />
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </section>

            {/* ── Footer: Back | Save & Exit | Save & Continue ─────────── */}
            <div className="flex items-center justify-between gap-3 pt-1">
                {/* Back */}
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-700 text-sm font-bold text-slate-400 hover:border-slate-500 hover:text-slate-300 transition-all"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </button>

                <div className="flex items-center gap-3">
                    {/* Save & Exit */}
                    <button
                        type="button"
                        onClick={handleSaveAndExit}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${saveExitFlash
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                            : 'border-slate-700 text-slate-300 hover:border-slate-500 hover:text-slate-200'
                            }`}
                    >
                        {saveExitFlash ? <CheckCircle className="w-4 h-4" /> : <LogOut className="w-4 h-4" />}
                        {saveExitFlash ? 'Saved!' : 'Save & Exit'}
                    </button>

                    {/* Save & Continue */}
                    <button
                        type="button"
                        onClick={handleSubmitAll}
                        disabled={!canSubmit || saveContFlash}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${saveContFlash
                            ? 'bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 cursor-not-allowed'
                            : !canSubmit
                                ? 'bg-slate-800/40 border border-slate-700 text-slate-600 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-slate-200 shadow-lg shadow-indigo-900/30'
                            }`}
                    >
                        {saveContFlash ? <CheckCircle className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        {saveContFlash ? 'Saved!' : 'Save & Continue'}
                    </button>
                </div>
            </div>

            {/* Hint if scores missing */}
            {!canSubmit && (
                <p className="text-xs text-slate-500 text-right">
                    Enter at least one psychometric score to continue
                </p>
            )}
        </div>
    );
};

export default BaselineAssessmentWizard;
