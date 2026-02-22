import React, { useState, useRef } from 'react';
import { CheckCircle, ChevronRight, X } from 'lucide-react';
import { FormFooter } from '../shared/FormFooter';

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
    observations?: string[];
}

interface SetAndSettingFormProps {
    onSave?: (data: SetAndSettingData) => void;
    initialData?: SetAndSettingData;
    patientId?: string;
    onComplete?: () => void;
    onExit?: () => void;
    onBack?: () => void;
}

// ── Clinical Observation options ──────────────────────────────────────────────
const OBSERVATION_CATEGORIES = {
    'Motivation & Engagement': [
        { id: 'BASELINE_MOTIVATED', label: 'Motivated' },
        { id: 'BASELINE_ANXIOUS', label: 'Anxious' },
        { id: 'BASELINE_CALM', label: 'Calm' },
        { id: 'BASELINE_SKEPTICAL', label: 'Skeptical' },
        { id: 'BASELINE_HOPEFUL', label: 'Hopeful' },
    ],
    'Support System': [
        { id: 'BASELINE_SUPPORT_STRONG', label: 'Strong Support System' },
        { id: 'BASELINE_SUPPORT_LIMITED', label: 'Limited Support' },
    ],
    'Experience Level': [
        { id: 'BASELINE_MEDITATION_EXP', label: 'Meditation Experience' },
        { id: 'BASELINE_PSYCHEDELIC_NAIVE', label: 'Psychedelic Naive' },
        { id: 'BASELINE_PSYCHEDELIC_EXP', label: 'Psychedelic Experienced' },
    ],
} as const;

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
    const [expectancy, setExpectancy] = useState<number>(
        initialData.treatment_expectancy ?? 50,
    );
    const [observations, setObservations] = useState<string[]>(
        initialData.observations ?? [],
    );
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [saving, setSaving] = useState(false);
    const savedRef = useRef(false);

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

    const toggleObservation = (id: string) => {
        setObservations(prev =>
            prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id],
        );
    };

    const toggleCategory = (category: keyof typeof OBSERVATION_CATEGORIES) => {
        const ids = OBSERVATION_CATEGORIES[category].map(o => o.id);
        const allSelected = ids.every(id => observations.includes(id));
        setObservations(prev =>
            allSelected
                ? prev.filter(o => !ids.includes(o as never))
                : [...new Set([...prev, ...ids])],
        );
    };

    const getObservationLabel = (id: string): string => {
        for (const cat of Object.values(OBSERVATION_CATEGORIES)) {
            const match = (cat as ReadonlyArray<{ id: string; label: string }>).find(o => o.id === id);
            if (match) return match.label;
        }
        return id;
    };

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
                            onChange={(e) => setExpectancy(parseInt(e.target.value))}
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
            <section className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 space-y-4">
                <h3 className="text-base font-bold text-slate-500">
                    Clinical Observations
                    <span className="text-slate-600 font-normal text-sm ml-2">optional</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(Object.entries(OBSERVATION_CATEGORIES) as [keyof typeof OBSERVATION_CATEGORIES, typeof OBSERVATION_CATEGORIES[keyof typeof OBSERVATION_CATEGORIES]][]).map(([category, opts]) => {
                        const ids = opts.map(o => o.id);
                        const allSelected = ids.every(id => observations.includes(id));
                        return (
                            <div key={category} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                        {category}
                                    </span>
                                    <button
                                        onClick={() => toggleCategory(category)}
                                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                                    >
                                        {allSelected ? 'Clear' : 'All'}
                                    </button>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    {opts.map((obs) => {
                                        const isSelected = observations.includes(obs.id);
                                        return (
                                            <button
                                                key={obs.id}
                                                type="button"
                                                onClick={() => toggleObservation(obs.id)}
                                                className={`w-full px-3 py-2 rounded-xl text-sm font-semibold text-left transition-all active:scale-95 ${isSelected
                                                    ? 'bg-indigo-600/80 text-slate-200 border border-indigo-500'
                                                    : 'bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:border-slate-500 hover:text-slate-300'
                                                    }`}
                                            >
                                                {obs.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Selected tags */}
                {observations.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-700/40">
                        {observations.map((id) => (
                            <span
                                key={id}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg text-xs font-semibold"
                            >
                                {getObservationLabel(id)}
                                <button
                                    onClick={() => toggleObservation(id)}
                                    className="hover:text-indigo-200 transition-colors"
                                    aria-label={`Remove ${getObservationLabel(id)}`}
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
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
