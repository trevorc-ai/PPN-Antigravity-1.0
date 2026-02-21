import React, { useState, useRef } from 'react';
import { CheckCircle, ChevronRight, X } from 'lucide-react';

/**
 * BaselineObservationsForm - Clinical Observations at Baseline
 *
 * Fields: Multi-select checkboxes (categorized)
 * Layout: Grouped checkboxes in 3 columns
 * Features: Category grouping, select/deselect all, tag display
 * Save: Explicit Save & Continue button only (no auto-save)
 */

export interface BaselineObservationsData {
    observations: string[];
}

interface BaselineObservationsFormProps {
    onSave?: (data: BaselineObservationsData) => void;
    initialData?: BaselineObservationsData;
    patientId?: string;
    /** Called after Save & Continue — advances to the next Phase 1 step */
    onComplete?: () => void;
}

// In production, fetch from ref_clinical_observations WHERE category='baseline'
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
};

const BaselineObservationsForm: React.FC<BaselineObservationsFormProps> = ({
    onSave,
    initialData = { observations: [] },
    patientId,
    onComplete,
}) => {
    const [data, setData] = useState<BaselineObservationsData>(initialData);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [saving, setSaving] = useState(false);
    const savedRef = useRef(false);

    const handleSaveAndContinue = () => {
        if (savedRef.current) return;
        savedRef.current = true;
        setSaving(true);
        onSave?.(data);
        setLastSaved(new Date());
        setTimeout(() => {
            setSaving(false);
            onComplete?.();
        }, 500);
    };

    const toggleObservation = (id: string) => {
        setData(prev => ({
            observations: prev.observations.includes(id)
                ? prev.observations.filter(o => o !== id)
                : [...prev.observations, id],
        }));
    };

    const toggleCategory = (category: string) => {
        const categoryIds = OBSERVATION_CATEGORIES[category as keyof typeof OBSERVATION_CATEGORIES].map(o => o.id);
        const allSelected = categoryIds.every(id => data.observations.includes(id));
        setData(prev => ({
            observations: allSelected
                ? prev.observations.filter(o => !categoryIds.includes(o))
                : [...new Set([...prev.observations, ...categoryIds])],
        }));
    };

    const removeObservation = (id: string) => {
        setData(prev => ({
            observations: prev.observations.filter(o => o !== id),
        }));
    };

    const getObservationLabel = (id: string): string => {
        for (const category of Object.values(OBSERVATION_CATEGORIES)) {
            const obs = category.find(o => o.id === id);
            if (obs) return obs.label;
        }
        return id;
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            {/* Observation Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(OBSERVATION_CATEGORIES).map(([category, observations]) => {
                    const categoryIds = observations.map(o => o.id);
                    const allSelected = categoryIds.every(id => data.observations.includes(id));

                    return (
                        <div key={category} className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-700/50 gap-2">
                                <h3 className="text-sm font-bold text-slate-300 truncate min-w-0">{category}</h3>
                                <button
                                    onClick={() => toggleCategory(category)}
                                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex-shrink-0"
                                >
                                    {allSelected ? 'Deselect All' : 'Select All'}
                                </button>
                            </div>

                            <div className="flex flex-col gap-2">
                                {observations.map((obs) => {
                                    const isSelected = data.observations.includes(obs.id);
                                    return (
                                        <button
                                            key={obs.id}
                                            type="button"
                                            onClick={() => toggleObservation(obs.id)}
                                            className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all active:scale-95 ${isSelected
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500'
                                                : 'bg-slate-800/60 text-slate-300 border border-slate-700/50 hover:border-slate-500 hover:text-white'
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

            {/* Selected Observations Tags */}
            {data.observations.length > 0 && (
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-slate-300 mb-4">
                        Selected Observations ({data.observations.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {data.observations.map((obsId) => (
                            <span
                                key={obsId}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-lg text-sm"
                            >
                                {getObservationLabel(obsId)}
                                <button
                                    onClick={() => removeObservation(obsId)}
                                    className="hover:text-blue-200 transition-colors"
                                    aria-label={`Remove ${getObservationLabel(obsId)}`}
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer: save status + Save & Continue */}
            <div className="flex items-center justify-between gap-4 pt-2 mr-16">
                <span className="text-sm text-emerald-400 font-medium">
                    {lastSaved ? `Saved at ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                </span>
                <button
                    onClick={handleSaveAndContinue}
                    disabled={saving}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${saving
                        ? 'bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30'
                        }`}
                >
                    {saving ? <CheckCircle className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    {saving ? 'Saved!' : 'Save & Continue'}
                </button>
            </div>
        </div>
    );
};

export default BaselineObservationsForm;
