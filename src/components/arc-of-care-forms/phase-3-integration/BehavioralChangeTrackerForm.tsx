import React, { useState } from 'react';
import { TrendingUp, Save, CheckCircle, Star } from 'lucide-react';
import { FormField } from '../shared/FormField';

/**
 * BehavioralChangeTrackerForm - Behavioral Change Tracker (NEW DESIGN)
 * Replaces free-text insights with structured behavioral change tracking
 * 100% compliant with Arc of Care Design Guidelines v2.0
 */

export interface BehavioralChangeData {
    change_date: string;
    change_category: 'relationship' | 'substance_use' | 'exercise' | 'work' | 'hobby' | 'self_care';
    change_type_ids: number[];
    impact_on_wellbeing: 'highly_positive' | 'moderately_positive' | 'neutral' | 'moderately_negative' | 'highly_negative';
    confidence_sustaining: 1 | 2 | 3 | 4 | 5;
    related_to_dosing: 'direct_insight' | 'indirect_influence' | 'unrelated';
}

interface BehavioralChangeTrackerFormProps {
    onSave?: (data: BehavioralChangeData) => void;
    initialData?: Partial<BehavioralChangeData>;
    patientId?: string;
}

const CHANGE_TYPES = [
    { id: 1, name: 'Set new boundaries', category: 'relationship' },
    { id: 2, name: 'Started new practice/habit', category: 'self_care' },
    { id: 3, name: 'Ended unhealthy pattern', category: 'substance_use' },
    { id: 4, name: 'Reached out to someone', category: 'relationship' },
    { id: 5, name: 'Made career change', category: 'work' },
    { id: 6, name: 'Improved communication', category: 'relationship' },
    { id: 7, name: 'Increased self-compassion', category: 'self_care' },
    { id: 8, name: 'Released resentment/anger', category: 'relationship' }
];

const StarRating: React.FC<{ value: number; onChange: (value: number) => void; label: string }> = ({ value, onChange, label }) => {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">{label}</label>
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star as 1 | 2 | 3 | 4 | 5)}
                        className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    >
                        <Star
                            className={`w-8 h-8 transition-all ${star <= value
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-600 hover:text-slate-500'
                                }`}
                        />
                    </button>
                ))}
                <span className="ml-2 text-sm text-slate-300">({value}/5)</span>
            </div>
        </div>
    );
};

const BehavioralChangeTrackerForm: React.FC<BehavioralChangeTrackerFormProps> = ({
    onSave,
    initialData = {},
    patientId
}) => {
    const [data, setData] = useState<BehavioralChangeData>({
        change_date: initialData.change_date || new Date().toISOString().slice(0, 10),
        change_category: initialData.change_category || 'relationship',
        change_type_ids: initialData.change_type_ids || [],
        impact_on_wellbeing: initialData.impact_on_wellbeing || 'moderately_positive',
        confidence_sustaining: initialData.confidence_sustaining || 3,
        related_to_dosing: initialData.related_to_dosing || 'direct_insight'
    });

    const updateField = <K extends keyof BehavioralChangeData>(
        field: K,
        value: BehavioralChangeData[K]
    ) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const toggleChangeType = (id: number) => {
        setData(prev => ({
            ...prev,
            change_type_ids: prev.change_type_ids.includes(id)
                ? prev.change_type_ids.filter(i => i !== id)
                : [...prev.change_type_ids, id]
        }));
    };

    const handleSave = () => {
        onSave?.(data);
    };

    const setToday = () => {
        updateField('change_date', new Date().toISOString().slice(0, 10));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-300 flex items-center gap-3">
                            <TrendingUp className="w-7 h-7 text-emerald-400" />
                            Behavioral Change Tracker
                        </h2>
                        <p className="text-slate-300 text-sm mt-2">
                            Track meaningful behavioral changes with structured, PHI-safe inputs
                        </p>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-1">
                        <span className="text-xs font-bold text-emerald-400">✓ 100% COMPLIANT</span>
                    </div>
                </div>
            </div>

            {/* Change Date */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <FormField label="Change Date">
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={data.change_date}
                            onChange={(e) => updateField('change_date', e.target.value)}
                            className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300"
                        />
                        <button
                            type="button"
                            onClick={setToday}
                            className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-slate-300 rounded-lg font-medium transition-colors"
                        >
                            Today
                        </button>
                    </div>
                </FormField>
            </div>

            {/* Change Category */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <FormField label="Change Type">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {[
                            { value: 'relationship', label: 'Relationship', icon: '💝' },
                            { value: 'substance_use', label: 'Substance Use', icon: '🚭' },
                            { value: 'exercise', label: 'Exercise', icon: '🏃' },
                            { value: 'work', label: 'Work/Career', icon: '💼' },
                            { value: 'hobby', label: 'Hobby/Creative', icon: '🎨' },
                            { value: 'self_care', label: 'Self-Care', icon: '🧘' }
                        ].map(({ value, label, icon }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => updateField('change_category', value as any)}
                                className={`px-4 py-3 rounded-lg font-medium transition-all ${data.change_category === value
                                    ? 'bg-emerald-600 text-slate-300'
                                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span>{icon}</span>
                                    <span>{label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </FormField>
            </div>

            {/* What Changed */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <FormField label="What Changed?" tooltip="Select all that apply">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {CHANGE_TYPES.map((type) => (
                            <button
                                key={type.id}
                                type="button"
                                onClick={() => toggleChangeType(type.id)}
                                className={`px-4 py-3 rounded-lg text-left font-medium transition-all ${data.change_type_ids.includes(type.id)
                                    ? 'bg-emerald-600 text-slate-300'
                                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle className={`w-4 h-4 ${data.change_type_ids.includes(type.id) ? 'opacity-100' : 'opacity-0'}`} />
                                    {type.name}
                                </div>
                            </button>
                        ))}
                    </div>
                </FormField>
            </div>

            {/* Impact on Well-Being */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <FormField label="Impact on Well-Being">
                    <div className="grid grid-cols-1 gap-2">
                        {[
                            { value: 'highly_positive', label: '😊 Highly Positive', color: 'emerald' },
                            { value: 'moderately_positive', label: '🙂 Moderately Positive', color: 'green' },
                            { value: 'neutral', label: '😐 Neutral', color: 'slate' },
                            { value: 'moderately_negative', label: '😕 Moderately Negative', color: 'yellow' },
                            { value: 'highly_negative', label: '😞 Highly Negative', color: 'red' }
                        ].map(({ value, label, color }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => updateField('impact_on_wellbeing', value as any)}
                                className={`px-4 py-3 rounded-lg font-medium transition-all ${data.impact_on_wellbeing === value
                                    ? `bg-${color}-500 text-slate-300`
                                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </FormField>
            </div>

            {/* Confidence in Sustaining Change */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <StarRating
                    label="Confidence in Sustaining Change"
                    value={data.confidence_sustaining}
                    onChange={(value) => updateField('confidence_sustaining', value)}
                />
            </div>

            {/* Related to Dosing Session */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <FormField label="Related to Dosing Session?">
                    <div className="grid grid-cols-1 gap-2">
                        {[
                            { value: 'direct_insight', label: '✨ Yes - Direct insight from session' },
                            { value: 'indirect_influence', label: '🌟 Yes - Indirectly influenced' },
                            { value: 'unrelated', label: '○ No - Unrelated to treatment' }
                        ].map(({ value, label }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => updateField('related_to_dosing', value as any)}
                                className={`px-4 py-3 rounded-lg font-medium transition-all ${data.related_to_dosing === value
                                    ? 'bg-blue-500 text-slate-300'
                                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </FormField>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-slate-300 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                    <Save className="w-5 h-5" />
                    Log Change
                </button>
            </div>
        </div>
    );
};

export default BehavioralChangeTrackerForm;
