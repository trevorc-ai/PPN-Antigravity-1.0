import React, { useState, useEffect } from 'react';
import { Lightbulb, Save, CheckCircle } from 'lucide-react';
import { FormField } from '../shared/FormField';

/**
 * IntegrationInsightsForm - Patient-Reported Insights
 * Free-text insights and reflections from the patient
 */

export interface IntegrationInsightsData {
    insight_text?: string;
    insight_date?: string;
    insight_category?: string;
}

interface IntegrationInsightsFormProps {
    onSave?: (data: IntegrationInsightsData) => void;
    initialData?: IntegrationInsightsData;
    patientId?: string;
}

const INSIGHT_CATEGORIES = [
    'Personal Growth',
    'Relationship Insight',
    'Behavioral Pattern',
    'Emotional Breakthrough',
    'Spiritual Experience',
    'Life Purpose',
    'Self-Compassion'
];

const IntegrationInsightsForm: React.FC<IntegrationInsightsFormProps> = ({
    onSave,
    initialData = {},
    patientId
}) => {
    const [data, setData] = useState<IntegrationInsightsData>({
        ...initialData,
        insight_date: initialData.insight_date || new Date().toISOString().slice(0, 10)
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (onSave && data.insight_text) {
            setIsSaving(true);
            const timer = setTimeout(() => {
                onSave(data);
                setIsSaving(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [data, onSave]);

    const updateField = (field: keyof IntegrationInsightsData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6">
                <h2 className="text-2xl font-black text-yellow-400 flex items-center gap-3">
                    <Lightbulb className="w-7 h-7" />
                    Integration Insights
                </h2>
                <p className="text-yellow-300/80 text-sm mt-2">
                    Capture meaningful insights and reflections from your integration journey.
                </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Insight Date">
                        <input
                            type="date"
                            value={data.insight_date ?? ''}
                            onChange={(e) => updateField('insight_date', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200"
                        />
                    </FormField>

                    <FormField label="Category">
                        <select
                            value={data.insight_category ?? ''}
                            onChange={(e) => updateField('insight_category', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200"
                        >
                            <option value="">Select category...</option>
                            {INSIGHT_CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </FormField>
                </div>

                <FormField label="Your Insight" required tooltip="What did you learn or realize?">
                    <textarea
                        value={data.insight_text ?? ''}
                        onChange={(e) => updateField('insight_text', e.target.value)}
                        rows={8}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                        placeholder="Describe your insight, realization, or breakthrough moment..."
                    />
                    <p className="text-xs text-slate-500 mt-2">
                        {data.insight_text?.length || 0} characters
                    </p>
                </FormField>

                {data.insight_text && data.insight_text.length > 50 && (
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-center">
                        <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <p className="text-emerald-400 font-semibold">Insight captured! Keep reflecting.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IntegrationInsightsForm;
