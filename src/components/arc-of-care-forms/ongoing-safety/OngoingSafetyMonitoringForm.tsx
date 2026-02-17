import React, { useState, useEffect } from 'react';
import { Shield, Save, CheckCircle, AlertTriangle } from 'lucide-react';
import { FormField } from '../shared/FormField';
import { NumberInput } from '../shared/NumberInput';

/**
 * OngoingSafetyMonitoringForm - Continuous Safety Tracking
 * C-SSRS, adverse events, medication changes
 */

export interface OngoingSafetyMonitoringData {
    cssrs_score?: number;
    new_adverse_events: boolean;
    medication_changes: boolean;
    monitoring_date?: string;
    notes?: string;
}

interface OngoingSafetyMonitoringFormProps {
    onSave?: (data: OngoingSafetyMonitoringData) => void;
    initialData?: OngoingSafetyMonitoringData;
    patientId?: string;
}

const OngoingSafetyMonitoringForm: React.FC<OngoingSafetyMonitoringFormProps> = ({
    onSave,
    initialData = { new_adverse_events: false, medication_changes: false },
    patientId
}) => {
    const [data, setData] = useState<OngoingSafetyMonitoringData>({
        ...initialData,
        monitoring_date: initialData.monitoring_date || new Date().toISOString().slice(0, 10)
    });
    const [isSaving, setIsSaving] = useState(false);
    const [showCSSRSAlert, setShowCSSRSAlert] = useState(false);

    useEffect(() => {
        if (onSave && data.cssrs_score !== undefined) {
            setIsSaving(true);
            const timer = setTimeout(() => {
                onSave(data);
                setIsSaving(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [data, onSave]);

    useEffect(() => {
        if (data.cssrs_score && data.cssrs_score >= 3) {
            setShowCSSRSAlert(true);
        } else {
            setShowCSSRSAlert(false);
        }
    }, [data.cssrs_score]);

    const updateField = (field: keyof OngoingSafetyMonitoringData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-2xl font-black text-slate-200 flex items-center gap-3">
                    <Shield className="w-7 h-7 text-green-400" />
                    Ongoing Safety Monitoring
                </h2>
                <p className="text-slate-400 text-sm mt-2">
                    Continuous safety tracking throughout the treatment journey.
                </p>
            </div>

            {showCSSRSAlert && (
                <div className="bg-red-500/10 border-2 border-red-500 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-red-400 font-black text-lg mb-2">🚨 CRITICAL: High C-SSRS Score</h3>
                            <p className="text-red-300 text-sm">
                                C-SSRS score ≥3 indicates active suicidal ideation. Immediate clinical intervention required. Contact supervising physician and implement safety protocol.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-6">
                <FormField label="Monitoring Date">
                    <input
                        type="date"
                        value={data.monitoring_date ?? ''}
                        onChange={(e) => updateField('monitoring_date', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200"
                    />
                </FormField>

                <FormField
                    label="C-SSRS Score"
                    tooltip="Columbia-Suicide Severity Rating Scale (0-5). Score ≥3 requires immediate intervention."
                    required
                >
                    <NumberInput
                        value={data.cssrs_score}
                        onChange={(val) => updateField('cssrs_score', val)}
                        min={0}
                        max={5}
                        status={data.cssrs_score && data.cssrs_score >= 3 ? 'critical' : 'normal'}
                    />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${data.new_adverse_events
                            ? 'bg-red-500/10 border-2 border-red-500/50'
                            : 'bg-slate-800/30 border border-slate-700/50'
                        }`}>
                        <input
                            type="checkbox"
                            checked={data.new_adverse_events}
                            onChange={(e) => updateField('new_adverse_events', e.target.checked)}
                            className="w-5 h-5 rounded border-slate-600 bg-slate-800/50 text-red-500"
                        />
                        <span className="text-slate-200 font-medium">New Adverse Events</span>
                    </label>

                    <label className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${data.medication_changes
                            ? 'bg-yellow-500/10 border-2 border-yellow-500/50'
                            : 'bg-slate-800/30 border border-slate-700/50'
                        }`}>
                        <input
                            type="checkbox"
                            checked={data.medication_changes}
                            onChange={(e) => updateField('medication_changes', e.target.checked)}
                            className="w-5 h-5 rounded border-slate-600 bg-slate-800/50 text-yellow-500"
                        />
                        <span className="text-slate-200 font-medium">Medication Changes</span>
                    </label>
                </div>

                <FormField label="Safety Notes">
                    <textarea
                        value={data.notes ?? ''}
                        onChange={(e) => updateField('notes', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Document any safety concerns, interventions, or follow-up actions..."
                    />
                </FormField>
            </div>
        </div>
    );
};

export default OngoingSafetyMonitoringForm;
