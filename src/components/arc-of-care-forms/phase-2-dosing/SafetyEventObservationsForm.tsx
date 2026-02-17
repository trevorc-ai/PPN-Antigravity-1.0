import React, { useState, useEffect } from 'react';
import { Shield, Save, CheckCircle, X } from 'lucide-react';

/**
 * SafetyEventObservationsForm - Safety Event Clinical Observations
 * Multi-select observations for safety events
 */

export interface SafetyEventObservationsData {
    observations: string[];
}

interface SafetyEventObservationsFormProps {
    onSave?: (data: SafetyEventObservationsData) => void;
    initialData?: SafetyEventObservationsData;
    patientId?: string;
    sessionId?: string;
}

const OBSERVATION_CATEGORIES = {
    'Vital Status': [
        { id: 'SAFETY_STABLE', label: 'Vitals Stable' },
        { id: 'SAFETY_HR_ELEVATED', label: 'Heart Rate Elevated' },
        { id: 'SAFETY_BP_ELEVATED', label: 'Blood Pressure Elevated' }
    ],
    'Distress Level': [
        { id: 'SAFETY_DISTRESS_MILD', label: 'Mild Distress' },
        { id: 'SAFETY_DISTRESS_SEVERE', label: 'Severe Distress' }
    ],
    'Interventions': [
        { id: 'SAFETY_INTERVENTION_VERBAL', label: 'Verbal Reassurance' },
        { id: 'SAFETY_INTERVENTION_BREATHING', label: 'Breathing Exercises' },
        { id: 'SAFETY_INTERVENTION_CHEMICAL', label: 'Chemical Intervention' }
    ],
    'Resolution': [
        { id: 'SAFETY_RESOLVED', label: 'Event Resolved' }
    ]
};

const QUICK_PRESETS = [
    { label: 'Stable', observations: ['SAFETY_STABLE', 'SAFETY_RESOLVED'] },
    { label: 'Elevated Vitals', observations: ['SAFETY_HR_ELEVATED', 'SAFETY_BP_ELEVATED'] },
    { label: 'Distress', observations: ['SAFETY_DISTRESS_SEVERE', 'SAFETY_INTERVENTION_VERBAL'] }
];

const SafetyEventObservationsForm: React.FC<SafetyEventObservationsFormProps> = ({
    onSave,
    initialData = { observations: [] },
    patientId,
    sessionId
}) => {
    const [data, setData] = useState<SafetyEventObservationsData>(initialData);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (onSave && data.observations.length > 0) {
            setIsSaving(true);
            const timer = setTimeout(() => {
                onSave(data);
                setIsSaving(false);
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

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-2xl font-black text-slate-300 flex items-center gap-3">
                    <Shield className="w-7 h-7 text-green-400" />
                    Safety Event Observations
                </h2>
                <div className="flex flex-wrap gap-2 mt-4">
                    {QUICK_PRESETS.map((preset) => (
                        <button
                            key={preset.label}
                            onClick={() => setData({ observations: preset.observations })}
                            className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 rounded-lg text-xs font-medium transition-all"
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(OBSERVATION_CATEGORIES).map(([category, observations]) => (
                    <div key={category} className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 space-y-4">
                        <h3 className="text-sm font-bold text-slate-300">{category}</h3>
                        <div className="space-y-3">
                            {observations.map((obs) => (
                                <label key={obs.id} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.observations.includes(obs.id)}
                                        onChange={() => toggleObservation(obs.id)}
                                        className="w-5 h-5 rounded border-slate-600 bg-slate-800/50 text-green-500"
                                    />
                                    <span className="text-sm text-slate-300">{obs.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SafetyEventObservationsForm;
