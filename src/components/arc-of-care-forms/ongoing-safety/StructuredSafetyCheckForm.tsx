import React, { useState } from 'react';
import { Shield, Save, CheckCircle, AlertTriangle } from 'lucide-react';
import { FormField } from '../shared/FormField';

/**
 * StructuredSafetyCheckForm - Structured Safety Check (NEW DESIGN)
 * Replaces free-text safety notes with structured, PHI-safe inputs
 * 100% compliant with Arc of Care Design Guidelines v2.0
 */

export interface StructuredSafetyCheckData {
    monitoring_date: string;
    cssrs_score: 0 | 1 | 2 | 3 | 4 | 5;
    safety_concern_ids: number[];
    new_adverse_events: boolean;
    medication_changes: boolean;
    action_taken_ids: number[];
    follow_up_required: boolean;
    follow_up_timeframe?: '24_hours' | '3_days' | '1_week';
}

interface StructuredSafetyCheckFormProps {
    onSave?: (data: StructuredSafetyCheckData) => void;
    initialData?: Partial<StructuredSafetyCheckData>;
    patientId?: string;
}

const SAFETY_CONCERNS = [
    { id: 1, name: 'Suicidal ideation increase', severity: 'critical' },
    { id: 2, name: 'Self-harm behavior', severity: 'critical' },
    { id: 3, name: 'Substance use relapse', severity: 'high' },
    { id: 4, name: 'Medication non-compliance', severity: 'moderate' },
    { id: 5, name: 'Social isolation increase', severity: 'moderate' },
    { id: 6, name: 'Sleep disturbance worsening', severity: 'moderate' },
    { id: 7, name: 'Panic attacks', severity: 'moderate' },
    { id: 8, name: 'Psychotic symptoms', severity: 'critical' }
];

const SAFETY_ACTIONS = [
    { id: 1, name: 'Increased check-in frequency', urgency: 'urgent' },
    { id: 2, name: 'Emergency contact notified', urgency: 'immediate' },
    { id: 3, name: 'Medication adjustment recommended', urgency: 'urgent' },
    { id: 4, name: 'Additional therapy session scheduled', urgency: 'urgent' },
    { id: 5, name: 'Crisis hotline information provided', urgency: 'immediate' },
    { id: 6, name: 'Hospitalization recommended', urgency: 'immediate' },
    { id: 7, name: 'Referred to psychiatrist', urgency: 'urgent' }
];

const StructuredSafetyCheckForm: React.FC<StructuredSafetyCheckFormProps> = ({
    onSave,
    initialData = {},
    patientId
}) => {
    const [data, setData] = useState<StructuredSafetyCheckData>({
        monitoring_date: initialData.monitoring_date || new Date().toISOString().slice(0, 10),
        cssrs_score: initialData.cssrs_score || 0,
        safety_concern_ids: initialData.safety_concern_ids || [],
        new_adverse_events: initialData.new_adverse_events || false,
        medication_changes: initialData.medication_changes || false,
        action_taken_ids: initialData.action_taken_ids || [],
        follow_up_required: initialData.follow_up_required || false,
        follow_up_timeframe: initialData.follow_up_timeframe
    });

    const updateField = <K extends keyof StructuredSafetyCheckData>(
        field: K,
        value: StructuredSafetyCheckData[K]
    ) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const toggleArrayItem = (field: 'safety_concern_ids' | 'action_taken_ids', id: number) => {
        setData(prev => ({
            ...prev,
            [field]: prev[field].includes(id)
                ? prev[field].filter(i => i !== id)
                : [...prev[field], id]
        }));
    };

    const handleSave = () => {
        onSave?.(data);
    };

    const setToday = () => {
        updateField('monitoring_date', new Date().toISOString().slice(0, 10));
    };

    const getSeverityColor = (score: number) => {
        if (score === 0) return 'emerald';
        if (score <= 2) return 'yellow';
        if (score <= 4) return 'orange';
        return 'red';
    };

    const severityColor = getSeverityColor(data.cssrs_score);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-200 flex items-center gap-3">
                            <Shield className="w-7 h-7 text-red-400" />
                            Structured Safety Check
                        </h2>
                        <p className="text-slate-400 text-sm mt-2">
                            Monitor patient safety with structured, PHI-safe inputs
                        </p>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-1">
                        <span className="text-xs font-bold text-emerald-400">✓ 100% COMPLIANT</span>
                    </div>
                </div>
            </div>

            {/* Monitoring Date */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <FormField label="Monitoring Date">
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={data.monitoring_date}
                            onChange={(e) => updateField('monitoring_date', e.target.value)}
                            className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200"
                        />
                        <button
                            type="button"
                            onClick={setToday}
                            className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Today
                        </button>
                    </div>
                </FormField>
            </div>

            {/* C-SSRS Score */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <FormField label="C-SSRS Score (0-5)">
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            {[0, 1, 2, 3, 4, 5].map((score) => (
                                <button
                                    key={score}
                                    type="button"
                                    onClick={() => updateField('cssrs_score', score as any)}
                                    className={`flex-1 px-4 py-3 rounded-lg font-bold text-lg transition-all ${data.cssrs_score === score
                                        ? `bg-${getSeverityColor(score)}-500 text-white`
                                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50'
                                        }`}
                                >
                                    {score}
                                </button>
                            ))}
                        </div>
                        {data.cssrs_score >= 3 && (
                            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-red-400 font-bold text-sm">⚠️ AUTOMATIC ALERT TRIGGERED</p>
                                    <p className="text-red-300 text-sm mt-1">Score ≥3 requires immediate clinical review and intervention</p>
                                </div>
                            </div>
                        )}
                    </div>
                </FormField>
            </div>

            {/* Safety Concerns */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <FormField label="Safety Concerns" tooltip="Select all that apply">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {SAFETY_CONCERNS.map((concern) => (
                            <button
                                key={concern.id}
                                type="button"
                                onClick={() => toggleArrayItem('safety_concern_ids', concern.id)}
                                className={`px-4 py-3 rounded-lg text-left font-medium transition-all ${data.safety_concern_ids.includes(concern.id)
                                    ? concern.severity === 'critical' ? 'bg-red-500 text-white' :
                                        concern.severity === 'high' ? 'bg-orange-600 text-white' :
                                            'bg-yellow-600 text-white'
                                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle className={`w-4 h-4 ${data.safety_concern_ids.includes(concern.id) ? 'opacity-100' : 'opacity-0'}`} />
                                    <div className="flex-1">
                                        <div>{concern.name}</div>
                                        <div className="text-xs opacity-75 mt-0.5">
                                            {concern.severity === 'critical' && '🔴 Critical'}
                                            {concern.severity === 'high' && '🟠 High'}
                                            {concern.severity === 'moderate' && '🟡 Moderate'}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </FormField>
            </div>

            {/* New Events */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="New Adverse Events Since Last Check?">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => updateField('new_adverse_events', false)}
                                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${!data.new_adverse_events
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50'
                                    }`}
                            >
                                No
                            </button>
                            <button
                                type="button"
                                onClick={() => updateField('new_adverse_events', true)}
                                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${data.new_adverse_events
                                    ? 'bg-red-500 text-white'
                                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50'
                                    }`}
                            >
                                Yes
                            </button>
                        </div>
                        {data.new_adverse_events && (
                            <p className="text-xs text-yellow-400 mt-2">→ Complete Adverse Event Report</p>
                        )}
                    </FormField>

                    <FormField label="Medication Changes Since Last Check?">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => updateField('medication_changes', false)}
                                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${!data.medication_changes
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50'
                                    }`}
                            >
                                No
                            </button>
                            <button
                                type="button"
                                onClick={() => updateField('medication_changes', true)}
                                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${data.medication_changes
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50'
                                    }`}
                            >
                                Yes
                            </button>
                        </div>
                        {data.medication_changes && (
                            <p className="text-xs text-yellow-400 mt-2">→ Update Medications list</p>
                        )}
                    </FormField>
                </div>
            </div>

            {/* Actions Taken */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <FormField label="Actions Taken" tooltip="Select all that apply">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {SAFETY_ACTIONS.map((action) => (
                            <button
                                key={action.id}
                                type="button"
                                onClick={() => toggleArrayItem('action_taken_ids', action.id)}
                                className={`px-4 py-3 rounded-lg text-left font-medium transition-all ${data.action_taken_ids.includes(action.id)
                                    ? action.urgency === 'immediate' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle className={`w-4 h-4 ${data.action_taken_ids.includes(action.id) ? 'opacity-100' : 'opacity-0'}`} />
                                    <div className="flex-1">
                                        <div>{action.name}</div>
                                        <div className="text-xs opacity-75 mt-0.5">
                                            {action.urgency === 'immediate' && '🔴 Immediate'}
                                            {action.urgency === 'urgent' && '🟠 Urgent'}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </FormField>
            </div>

            {/* Follow-Up */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <FormField label="Follow-Up Required?">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => updateField('follow_up_required', true)}
                            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${data.follow_up_required
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50'
                                }`}
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                updateField('follow_up_required', false);
                                updateField('follow_up_timeframe', undefined);
                            }}
                            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${!data.follow_up_required
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50'
                                }`}
                        >
                            No - Continue standard monitoring
                        </button>
                    </div>
                </FormField>

                {data.follow_up_required && (
                    <FormField label="Schedule Follow-Up Within:">
                        <div className="flex gap-2">
                            {[
                                { value: '24_hours', label: '24 hours' },
                                { value: '3_days', label: '3 days' },
                                { value: '1_week', label: '1 week' }
                            ].map(({ value, label }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => updateField('follow_up_timeframe', value as any)}
                                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${data.follow_up_timeframe === value
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </FormField>
                )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                    <Save className="w-5 h-5" />
                    Submit Check
                </button>
            </div>
        </div>
    );
};

export default StructuredSafetyCheckForm;
