import React, { useState, useEffect } from 'react';
import { Eye, Save, CheckCircle, X } from 'lucide-react';

/**
 * BaselineObservationsForm - Clinical Observations at Baseline
 * 
 * Fields: Multi-select checkboxes (categorized)
 * Layout: Grouped checkboxes in 3 columns
 * Features: Category grouping, select/deselect all, tag display
 */

export interface BaselineObservationsData {
    observations: string[];
}

interface BaselineObservationsFormProps {
    onSave?: (data: BaselineObservationsData) => void;
    initialData?: BaselineObservationsData;
    patientId?: string;
}

// Mock data - in production, fetch from ref_clinical_observations WHERE category='baseline'
const OBSERVATION_CATEGORIES = {
    'Motivation & Engagement': [
        { id: 'BASELINE_MOTIVATED', label: 'Motivated' },
        { id: 'BASELINE_ANXIOUS', label: 'Anxious' },
        { id: 'BASELINE_CALM', label: 'Calm' },
        { id: 'BASELINE_SKEPTICAL', label: 'Skeptical' },
        { id: 'BASELINE_HOPEFUL', label: 'Hopeful' }
    ],
    'Support System': [
        { id: 'BASELINE_SUPPORT_STRONG', label: 'Strong Support System' },
        { id: 'BASELINE_SUPPORT_LIMITED', label: 'Limited Support' }
    ],
    'Experience Level': [
        { id: 'BASELINE_MEDITATION_EXP', label: 'Meditation Experience' },
        { id: 'BASELINE_PSYCHEDELIC_NAIVE', label: 'Psychedelic Naive' },
        { id: 'BASELINE_PSYCHEDELIC_EXP', label: 'Psychedelic Experienced' }
    ]
};

const BaselineObservationsForm: React.FC<BaselineObservationsFormProps> = ({
    onSave,
    initialData = { observations: [] },
    patientId
}) => {
    const [data, setData] = useState<BaselineObservationsData>(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Auto-save with debounce
    useEffect(() => {
        if (onSave && data.observations.length > 0) {
            setIsSaving(true);
            const timer = setTimeout(() => {
                onSave(data);
                setIsSaving(false);
                setLastSaved(new Date());
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [data, onSave]);

    const toggleObservation = (id: string) => {
        setData(prev => ({
            observations: prev.observations.includes(id)
                ? prev.observations.filter(o => o !== id)
                : [...prev.observations, id]
        }));
    };

    const toggleCategory = (category: string) => {
        const categoryIds = OBSERVATION_CATEGORIES[category as keyof typeof OBSERVATION_CATEGORIES].map(o => o.id);
        const allSelected = categoryIds.every(id => data.observations.includes(id));

        setData(prev => ({
            observations: allSelected
                ? prev.observations.filter(o => !categoryIds.includes(o))
                : [...new Set([...prev.observations, ...categoryIds])]
        }));
    };

    const removeObservation = (id: string) => {
        setData(prev => ({
            observations: prev.observations.filter(o => o !== id)
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
            {/* Header */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-300 flex items-center gap-3">
                            <Eye className="w-7 h-7 text-indigo-400" />
                            Baseline Clinical Observations
                        </h2>
                        <p className="text-slate-300 text-sm mt-2">
                            Document clinical observations about the patient's presentation, mindset, and readiness before treatment.
                        </p>
                    </div>
                    {isSaving && (
                        <div className="flex items-center gap-2 text-blue-400 text-xs">
                            <Save className="w-4 h-4 animate-pulse" />
                            <span>Saving...</span>
                        </div>
                    )}
                    {lastSaved && !isSaving && (
                        <div className="flex items-center gap-2 text-emerald-400 text-xs">
                            <CheckCircle className="w-4 h-4" />
                            <span>Saved {lastSaved.toLocaleTimeString()}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Observation Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(OBSERVATION_CATEGORIES).map(([category, observations]) => {
                    const categoryIds = observations.map(o => o.id);
                    const allSelected = categoryIds.every(id => data.observations.includes(id));
                    const someSelected = categoryIds.some(id => data.observations.includes(id));

                    return (
                        <div key={category} className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                            {/* Category Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
                                <h3 className="text-sm font-bold text-slate-300">{category}</h3>
                                <button
                                    onClick={() => toggleCategory(category)}
                                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    {allSelected ? 'Deselect All' : 'Select All'}
                                </button>
                            </div>

                            {/* Checkboxes */}
                            <div className="space-y-3">
                                {observations.map((obs) => {
                                    const isChecked = data.observations.includes(obs.id);
                                    return (
                                        <label
                                            key={obs.id}
                                            className="flex items-center gap-3 cursor-pointer group"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => toggleObservation(obs.id)}
                                                className="w-5 h-5 rounded border-slate-600 bg-slate-800/50 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                                            />
                                            <span className={`text-sm transition-colors ${isChecked ? 'text-slate-300 font-medium' : 'text-slate-300 group-hover:text-slate-300'
                                                }`}>
                                                {obs.label}
                                            </span>
                                        </label>
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
                                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-sm"
                            >
                                {getObservationLabel(obsId)}
                                <button
                                    onClick={() => removeObservation(obsId)}
                                    className="hover:text-blue-300 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BaselineObservationsForm;
