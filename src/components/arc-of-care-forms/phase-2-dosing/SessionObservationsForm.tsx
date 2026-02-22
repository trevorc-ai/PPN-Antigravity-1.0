import React, { useState } from 'react';
import { Eye, Save, CheckCircle, X } from 'lucide-react';
import { FormFooter } from '../shared/FormFooter';

/**
 * SessionObservationsForm - Clinical Observations During Session
 * 
 * Fields: Multi-select observations (categorized)
 * Layout: Grouped checkboxes in 4 columns
 * Features: Quick-select buttons, color-coded tags, category grouping
 */

export interface SessionObservationsData {
    observations: string[];
}

interface SessionObservationsFormProps {
    onSave?: (data: SessionObservationsData) => void;
    initialData?: SessionObservationsData;
    patientId?: string;
    sessionId?: string;
    onComplete?: () => void;
    onExit?: () => void;
    onBack?: () => void;
}

// Mock data - in production, fetch from ref_clinical_observations WHERE category='session'
const OBSERVATION_CATEGORIES = {
    'Session Quality': [
        { id: 'SESSION_SMOOTH', label: 'Smooth Session' },
        { id: 'SESSION_CHALLENGING', label: 'Challenging Session' },
        { id: 'SESSION_BREAKTHROUGH', label: 'Breakthrough Experience' },
        { id: 'SESSION_MYSTICAL', label: 'Mystical Experience' }
    ],
    'Physical Symptoms': [
        { id: 'SESSION_NAUSEA_MILD', label: 'Nausea (Mild)' },
        { id: 'SESSION_NAUSEA_SEVERE', label: 'Nausea (Severe)' }
    ],
    'Emotional State': [
        { id: 'SESSION_ANXIETY_PEAK', label: 'Anxiety at Peak' },
        { id: 'SESSION_ANXIETY_RESOLVED', label: 'Anxiety Resolved' },
        { id: 'SESSION_CRYING', label: 'Crying' },
        { id: 'SESSION_LAUGHING', label: 'Laughing' }
    ],
    'Engagement': [
        { id: 'SESSION_QUIET', label: 'Quiet/Introspective' },
        { id: 'SESSION_VERBAL', label: 'Verbal/Communicative' }
    ]
};

const QUICK_SELECT_PRESETS = [
    {
        label: 'Smooth Session',
        observations: ['SESSION_SMOOTH', 'SESSION_QUIET']
    },
    {
        label: 'Challenging Session',
        observations: ['SESSION_CHALLENGING', 'SESSION_ANXIETY_PEAK']
    },
    {
        label: 'Mystical Experience',
        observations: ['SESSION_MYSTICAL', 'SESSION_BREAKTHROUGH']
    }
];

const SessionObservationsForm: React.FC<SessionObservationsFormProps> = ({
    onSave,
    initialData = { observations: [] },
    patientId,
    sessionId,
    onComplete,
    onExit,
    onBack
}) => {
    const [data, setData] = useState<SessionObservationsData>(initialData);
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveAndExit = () => {
        if (onSave) {
            setIsSaving(true);
            onSave(data);
            setTimeout(() => {
                setIsSaving(false);
                if (onExit) onExit();
            }, 300);
        } else if (onExit) {
            onExit();
        }
    };

    const handleSaveAndContinue = () => {
        if (onSave) {
            setIsSaving(true);
            onSave(data);
            setTimeout(() => {
                setIsSaving(false);
                if (onComplete) onComplete();
            }, 300);
        } else if (onComplete) {
            onComplete();
        }
    };

    const toggleObservation = (id: string) => {
        setData(prev => ({
            observations: prev.observations.includes(id)
                ? prev.observations.filter(o => o !== id)
                : [...prev.observations, id]
        }));
    };

    const applyPreset = (observations: string[]) => {
        setData({ observations });
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

    const getCategoryColor = (category: string): string => {
        switch (category) {
            case 'Session Quality':
                return 'border-blue-500/20 bg-blue-500/5';
            case 'Physical Symptoms':
                return 'border-red-500/20 bg-red-500/5';
            case 'Emotional State':
                return 'border-purple-500/20 bg-purple-500/5';
            case 'Engagement':
                return 'border-cyan-500/20 bg-cyan-500/5';
            default:
                return 'border-slate-700/50 bg-slate-900/60';
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-300 flex items-center gap-3">
                            <Eye className="w-7 h-7 text-indigo-400" />
                            Session Observations
                        </h2>
                        <p className="text-slate-300 text-sm mt-2">
                            Document clinical observations during the dosing session to track session quality and patient experience.
                        </p>
                    </div>
                </div>

                {/* Quick Select Buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-xs text-slate-400 self-center mr-2">Quick Select:</span>
                    {QUICK_SELECT_PRESETS.map((preset) => (
                        <button
                            key={preset.label}
                            onClick={() => applyPreset(preset.observations)}
                            className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-medium transition-all"
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Observation Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(OBSERVATION_CATEGORIES).map(([category, observations]) => (
                    <div
                        key={category}
                        className={`backdrop-blur-xl border rounded-2xl p-5 space-y-4 ${getCategoryColor(category)}`}
                    >
                        <h3 className="text-sm font-bold text-slate-300 pb-2 border-b border-current/20">
                            {category}
                        </h3>

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
                                            : 'bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:border-slate-500 hover:text-slate-200'
                                            }`}
                                    >
                                        {obs.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
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
                                className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-sm"
                            >
                                {getObservationLabel(obsId)}
                                <button
                                    onClick={() => removeObservation(obsId)}
                                    className="hover:text-indigo-300 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <FormFooter
                onBack={onBack}
                onSaveAndExit={handleSaveAndExit}
                onSaveAndContinue={handleSaveAndContinue}
                isSaving={isSaving}
                hasChanges={data.observations.length > 0}
            />
        </div >
    );
};

export default SessionObservationsForm;
