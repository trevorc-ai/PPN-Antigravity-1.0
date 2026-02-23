import React, { useState, useRef } from 'react';
import { CheckCircle, ChevronRight, X, Info } from 'lucide-react';
import { FormFooter } from '../shared/FormFooter';
import { AdvancedTooltip } from '../../ui/AdvancedTooltip';

/**
 * SetAndSettingForm — Treatment Expectancy + Clinical Observations (combined)
 *
 * Previously split across two steps (Set & Setting + Baseline Observations).
 * Merged to reduce Phase 1 from 5 steps → 4 steps.
 *
 * Fields:
 *   - Treatment Expectancy slider (1–100)
 *   - Clinical Observations multi-select (3 categories)
 *
 * Save: Explicit Save & Continue only (no auto-save)
 */

export interface SetAndSettingData {
    treatment_expectancy?: number;
    observations?: {
        motivation_level?: string;
        support_system?: string;
        prior_experience?: string;
    };
}

interface SetAndSettingFormProps {
    onSave?: (data: SetAndSettingData) => void;
    initialData?: SetAndSettingData;
    patientId?: string;
    onComplete?: () => void;
    onExit?: () => void;
    onBack?: () => void;
}

const MOTIVATION_OPTIONS = ['Low', 'Moderate', 'High', 'Very High'];
const SUPPORT_OPTIONS = ['None identified', 'Minimal', 'Moderate', 'Strong'];
const EXPERIENCE_OPTIONS = ['None', 'Minimal (1-2 times)', 'Some (3-5 times)', 'Experienced (6+ times)'];

// ── Expectancy interpretation ─────────────────────────────────────────────────
const getInterpretation = (score: number) => {
    if (score < 33) return {
        label: 'Low Belief in Treatment',
        color: 'text-red-400 bg-red-500/10 border-red-500/20',
        desc: 'Patient may benefit from additional psychoeducation and rapport building.',
    };
    if (score < 67) return {
        label: 'Moderate Expectancy',
        color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
        desc: 'Patient has moderate confidence in treatment. Continue building therapeutic alliance.',
    };
    return {
        label: 'High Belief in Treatment',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        desc: 'Patient has strong belief in treatment efficacy — positive prognostic indicator.',
    };
};

// ── Component ─────────────────────────────────────────────────────────────────
const SetAndSettingForm: React.FC<SetAndSettingFormProps> = ({
    onSave,
    initialData = {} as SetAndSettingData,
    patientId,
    onComplete,
    onExit,
    onBack
}) => {
    const STORAGE_KEY = `ppn_set_setting_${patientId || 'default'}`;

    const [expectancy, setExpectancy] = useState<number>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return JSON.parse(saved).treatment_expectancy ?? initialData.treatment_expectancy ?? 50;
        } catch { }
        return initialData.treatment_expectancy ?? 50;
    });

    const [observations, setObservations] = useState(() => {
        const defaultObs = { motivation_level: '', support_system: '', prior_experience: '' };
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return { ...defaultObs, ...initialData.observations, ...JSON.parse(saved).observations };
        } catch { }
        return { ...defaultObs, ...initialData.observations as any };
    });

    const [saving, setSaving] = useState(false);
    const savedRef = useRef(false);

    const updateExpectancy = (val: number) => {
        setExpectancy(val);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ treatment_expectancy: val, observations })); } catch { }
    };

    const updateObservation = (key: string, val: string) => {
        setObservations((prev: any) => {
            const next = { ...prev, [key]: val };
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ treatment_expectancy: expectancy, observations: next })); } catch { }
            return next;
        });
    };

    const handleSaveAndExit = () => {
        if (savedRef.current) return;
        savedRef.current = true;
        setSaving(true);
        onSave?.({ treatment_expectancy: expectancy, observations });
        setTimeout(() => {
            setSaving(false);
            if (onExit) onExit();
        }, 500);
    };

    const handleSaveAndContinue = () => {
        if (savedRef.current) return;
        savedRef.current = true;
        setSaving(true);
        onSave?.({ treatment_expectancy: expectancy, observations });
        setTimeout(() => {
            setSaving(false);
            onComplete?.();
        }, 500);
    };

    // Removed previous array toggling logic

    const interpretation = getInterpretation(expectancy);
    const pct = ((expectancy - 1) / 99) * 100;

    return (
        <div className="max-w-3xl mx-auto space-y-5">

            {/* ── Section 1: Treatment Expectancy ──────────────────────── */}
            <section className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 space-y-4">
                <h3 className="text-base font-bold text-slate-500">Treatment Expectancy</h3>

                <div className="space-y-3">
                    {/* Slider + inline value */}
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500 w-10 text-right flex-shrink-0">Low</span>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={expectancy}
                            onChange={(e) => updateExpectancy(parseInt(e.target.value))}
                            className="ppn-range flex-1 cursor-pointer"
                            style={{
                                background: `linear-gradient(to right,
                                    #ef4444 0%,
                                    #f59e0b 33%,
                                    #10b981 66%,
                                    #10b981 100%)`,
                            }}
                            aria-label="Treatment expectancy score"
                        />
                        <span className="text-xs text-slate-500 w-10 flex-shrink-0">High</span>
                        <span className="text-3xl font-black text-slate-300 w-14 text-right flex-shrink-0 tabular-nums">
                            {expectancy}
                        </span>
                    </div>

                    {/* Interpretation pill */}
                    <div className={`px-4 py-2.5 rounded-xl border text-sm font-semibold ${interpretation.color}`}>
                        {interpretation.label} — {interpretation.desc}
                    </div>
                </div>
            </section>

            {/* ── Section 2: Clinical Observations ─────────────────────── */}
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
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {options.map((opt) => {
                                const isSelected = (observations as any)[key] === opt;
                                return (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => updateObservation(key, opt)}
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

            <FormFooter
                onBack={onBack ?? onComplete}
                onSaveAndExit={handleSaveAndExit}
                onSaveAndContinue={handleSaveAndContinue}
                isSaving={saving}
                hasChanges={true}
            />
        </div>
    );
};

export default SetAndSettingForm;
