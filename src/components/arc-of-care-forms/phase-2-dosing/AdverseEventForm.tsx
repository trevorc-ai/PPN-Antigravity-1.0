import React, { useState, useEffect } from 'react';
import { AlertTriangle, Save, CheckCircle } from 'lucide-react';
import { FormField } from '../shared/FormField';
import { NumberInput } from '../shared/NumberInput';
import { SegmentedControl } from '../shared/SegmentedControl';
import { NowButton, RelativeTimeDisplay } from '../shared/NowButton';

/**
 * AdverseEventForm - Adverse Event Reporting
 * 
 * Fields: Event Type, Severity, MedDRA Code, Intervention, Timestamps, Logged By
 * Layout: 2-column grid
 * Features: Color-coded severity, conditional intervention field, quick-log buttons
 */

export interface AdverseEventData {
    event_type?: string;
    severity_grade?: number;
    meddra_code?: string;
    intervention_type?: string;
    occurred_at?: string;
    resolved: boolean;
    resolved_at?: string;
}

interface AdverseEventFormProps {
    onSave?: (data: AdverseEventData) => void;
    initialData?: AdverseEventData;
    patientId?: string;
    sessionId?: string;
    doseTime?: Date; // Time when dose was administered (for relative time display)
}

const EVENT_TYPES = [
    'Nausea',
    'Panic Attack',
    'Hypertension',
    'Dizziness',
    'Anxiety',
    'Headache',
    'Other'
];

const INTERVENTION_TYPES = [
    'Verbal Reassurance',
    'Guided Breathing',
    'Physical Touch',
    'Environment Adjustment',
    'Chemical Rescue (Benzo)',
    'Chemical Rescue (Propranolol)',
    'Medical Consultation'
];

const SEVERITY_GRADES = [
    { value: 1, label: 'Mild' },
    { value: 2, label: 'Moderate' },
    { value: 3, label: 'Severe' },
    { value: 4, label: 'Life-Threatening' },
    { value: 5, label: 'Fatal' }
];

const AdverseEventForm: React.FC<AdverseEventFormProps> = ({
    onSave,
    initialData = { resolved: false },
    patientId,
    sessionId,
    doseTime
}) => {
    const [data, setData] = useState<AdverseEventData>(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Auto-save with debounce
    useEffect(() => {
        if (onSave && data.event_type) {
            setIsSaving(true);
            const timer = setTimeout(() => {
                onSave(data);
                setIsSaving(false);
                setLastSaved(new Date());
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [data, onSave]);

    const updateField = (field: keyof AdverseEventData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const quickLog = (eventType: string) => {
        const now = new Date().toISOString().slice(0, 16);
        setData(prev => ({
            ...prev,
            event_type: eventType,
            occurred_at: now,
            severity_grade: 2 // Default to moderate
        }));
    };

    const getSeverityColor = (grade?: number): string => {
        if (!grade) return '';
        if (grade === 1) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
        if (grade === 2) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
        if (grade >= 3) return 'text-red-400 bg-red-500/10 border-red-500/20';
        return '';
    };

    const requiresIntervention = (data.severity_grade ?? 0) >= 3;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-red-400 flex items-center gap-3">
                            <AlertTriangle className="w-7 h-7" />
                            Adverse Event Report
                        </h2>
                        <p className="text-red-300/80 text-sm mt-2">
                            Document any adverse events for safety monitoring and regulatory compliance.
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

                {/* Quick Log Buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-xs text-red-300/60 self-center mr-2">Quick Log:</span>
                    {['Nausea', 'Anxiety', 'Panic Attack'].map((eventType) => (
                        <button
                            key={eventType}
                            onClick={() => quickLog(eventType)}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg text-xs font-medium transition-all"
                        >
                            {eventType}
                        </button>
                    ))}
                </div>
            </div>

            {/* Form */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Event Type */}
                    <FormField label="Event Type" required>
                        <select
                            value={data.event_type ?? ''}
                            onChange={(e) => updateField('event_type', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                            <option value="">Select event type...</option>
                            {EVENT_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </FormField>

                    {/* Severity Grade */}
                    <FormField label="Severity Grade" required>
                        <div className="space-y-2">
                            {SEVERITY_GRADES.map((grade) => (
                                <label
                                    key={grade.value}
                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${data.severity_grade === grade.value
                                        ? getSeverityColor(grade.value)
                                        : 'bg-slate-800/30 border border-slate-700/50 hover:border-slate-600'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="severity"
                                        value={grade.value}
                                        checked={data.severity_grade === grade.value}
                                        onChange={(e) => updateField('severity_grade', parseInt(e.target.value))}
                                        className="w-4 h-4"
                                    />
                                    <span className="font-medium">{grade.value} - {grade.label}</span>
                                </label>
                            ))}
                        </div>
                    </FormField>

                    {/* Occurred At */}
                    <FormField label="Occurred At" required>
                        <div className="flex gap-2">
                            <input
                                type="datetime-local"
                                value={data.occurred_at ?? ''}
                                onChange={(e) => updateField('occurred_at', e.target.value)}
                                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                            <NowButton
                                onSetNow={(timestamp) => updateField('occurred_at', timestamp.toISOString().slice(0, 16))}
                            />
                        </div>
                        {doseTime && data.occurred_at && (
                            <RelativeTimeDisplay
                                referenceTime={doseTime}
                                currentTime={new Date(data.occurred_at)}
                                label="after dose"
                            />
                        )}
                    </FormField>

                    {/* Intervention Type (conditional) */}
                    {requiresIntervention && (
                        <FormField label="Intervention Type" required tooltip="Required for severity ≥3">
                            <select
                                value={data.intervention_type ?? ''}
                                onChange={(e) => updateField('intervention_type', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            >
                                <option value="">Select intervention...</option>
                                {INTERVENTION_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </FormField>
                    )}

                    {/* Resolved */}
                    <div className="md:col-span-2">
                        <label className="flex items-center gap-3 p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.resolved}
                                onChange={(e) => updateField('resolved', e.target.checked)}
                                className="w-5 h-5 rounded border-slate-600 bg-slate-800/50 text-emerald-500 focus:ring-2 focus:ring-emerald-500"
                            />
                            <span className="text-slate-300 font-medium">Event Resolved</span>
                        </label>
                    </div>

                    {/* Resolved At (conditional) */}
                    {data.resolved && (
                        <div className="md:col-span-2">
                            <FormField label="Resolved At" required>
                                <div className="flex gap-2">
                                    <input
                                        type="datetime-local"
                                        value={data.resolved_at ?? ''}
                                        onChange={(e) => updateField('resolved_at', e.target.value)}
                                        className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                    <button
                                        onClick={() => updateField('resolved_at', new Date().toISOString().slice(0, 16))}
                                        className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-slate-300 rounded-lg font-medium transition-all"
                                    >
                                        Now
                                    </button>
                                </div>
                            </FormField>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdverseEventForm;
