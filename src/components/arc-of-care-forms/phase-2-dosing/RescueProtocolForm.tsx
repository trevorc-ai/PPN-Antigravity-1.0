import React, { useState, useEffect } from 'react';
import { Siren, Save, CheckCircle, Clock } from 'lucide-react';
import { FormField } from '../shared/FormField';

/**
 * RescueProtocolForm - Rescue Protocol/Intervention Tracking
 * Tracks intervention timeline with start/end times and duration calculation
 */

export interface RescueProtocolData {
    intervention_type?: string;
    start_time?: string;
    end_time?: string;
    duration_minutes?: number;
}

interface RescueProtocolFormProps {
    onSave?: (data: RescueProtocolData) => void;
    initialData?: RescueProtocolData;
    patientId?: string;
    sessionId?: string;
}

const INTERVENTION_TYPES = [
    'Verbal Reassurance',
    'Guided Breathing',
    'Physical Touch',
    'Environment Adjustment',
    'Chemical Rescue (Benzo)',
    'Chemical Rescue (Propranolol)'
];

const RescueProtocolForm: React.FC<RescueProtocolFormProps> = ({
    onSave,
    initialData = {},
    patientId,
    sessionId
}) => {
    const [data, setData] = useState<RescueProtocolData>(initialData);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (onSave && data.intervention_type) {
            setIsSaving(true);
            const timer = setTimeout(() => {
                onSave(data);
                setIsSaving(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [data, onSave]);

    const updateField = (field: keyof RescueProtocolData, value: any) => {
        const updated = { ...data, [field]: value };

        // Auto-calculate duration
        if (updated.start_time && updated.end_time) {
            const start = new Date(updated.start_time);
            const end = new Date(updated.end_time);
            updated.duration_minutes = Math.round((end.getTime() - start.getTime()) / 60000);
        }

        setData(updated);
    };

    const startIntervention = () => {
        updateField('start_time', new Date().toISOString().slice(0, 16));
    };

    const endIntervention = () => {
        updateField('end_time', new Date().toISOString().slice(0, 16));
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-6">
                <h2 className="text-2xl font-black text-orange-400 flex items-center gap-3">
                    <Siren className="w-7 h-7" />
                    Rescue Protocol
                </h2>
                <p className="text-orange-300/80 text-sm mt-2">
                    Document rescue interventions administered during challenging experiences.
                </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-6">
                <FormField label="Intervention Type" required>
                    <select
                        value={data.intervention_type ?? ''}
                        onChange={(e) => updateField('intervention_type', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select intervention...</option>
                        {INTERVENTION_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Start Time">
                        <div className="flex gap-2">
                            <input
                                type="datetime-local"
                                value={data.start_time ?? ''}
                                onChange={(e) => updateField('start_time', e.target.value)}
                                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300"
                            />
                            <button
                                onClick={startIntervention}
                                className="px-4 py-3 bg-orange-600 hover:bg-orange-700 text-slate-300 rounded-lg font-medium"
                            >
                                Start
                            </button>
                        </div>
                    </FormField>

                    <FormField label="End Time">
                        <div className="flex gap-2">
                            <input
                                type="datetime-local"
                                value={data.end_time ?? ''}
                                onChange={(e) => updateField('end_time', e.target.value)}
                                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300"
                            />
                            <button
                                onClick={endIntervention}
                                className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-slate-300 rounded-lg font-medium"
                            >
                                End
                            </button>
                        </div>
                    </FormField>
                </div>

                {/* Active Intervention Indicator */}
                {data.start_time && !data.end_time && (
                    <div className="p-6 bg-orange-500/10 border-2 border-orange-500/30 rounded-xl">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <Siren className="w-8 h-8 text-orange-400 animate-pulse" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <h3 className="text-lg font-black text-orange-400">
                                    🚨 INTERVENTION IN PROGRESS
                                </h3>
                                <p className="text-sm text-slate-300">
                                    Type: <span className="font-bold text-orange-300">{data.intervention_type}</span>
                                </p>
                                <p className="text-sm text-slate-300">
                                    Started: {new Date(data.start_time).toLocaleTimeString()}
                                </p>
                                <button
                                    onClick={endIntervention}
                                    className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-slate-300 rounded-lg font-medium transition-all"
                                >
                                    End Intervention
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {data.duration_minutes !== undefined && data.duration_minutes >= 0 && (
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-emerald-300 font-semibold flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Intervention Duration
                            </span>
                            <span className="text-2xl font-black text-emerald-400">
                                {data.duration_minutes} minutes
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RescueProtocolForm;
