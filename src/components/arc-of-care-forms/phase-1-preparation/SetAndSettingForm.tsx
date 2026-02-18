import React, { useState, useEffect } from 'react';
import { Sparkles, Save, CheckCircle } from 'lucide-react';
import { FormField } from '../shared/FormField';

/**
 * SetAndSettingForm - Treatment Expectancy Assessment
 * 
 * Fields: Treatment Expectancy (1-100 slider)
 * Layout: Single field, full width
 * Features: Visual gradient slider, interpretation text
 */

export interface SetAndSettingData {
    treatment_expectancy?: number;
}

interface SetAndSettingFormProps {
    onSave?: (data: SetAndSettingData) => void;
    initialData?: SetAndSettingData;
    patientId?: string;
}

const SetAndSettingForm: React.FC<SetAndSettingFormProps> = ({
    onSave,
    initialData = {},
    patientId
}) => {
    const [data, setData] = useState<SetAndSettingData>(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Auto-save with debounce
    useEffect(() => {
        if (onSave && data.treatment_expectancy !== undefined) {
            setIsSaving(true);
            const timer = setTimeout(() => {
                onSave(data);
                setIsSaving(false);
                setLastSaved(new Date());
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [data, onSave]);

    const getInterpretation = (score: number): { label: string; color: string } => {
        if (score < 33) return { label: 'Low Belief in Treatment', color: 'text-red-400' };
        if (score < 67) return { label: 'Moderate Expectancy', color: 'text-yellow-400' };
        return { label: 'High Belief in Treatment', color: 'text-emerald-400' };
    };

    const interpretation = data.treatment_expectancy !== undefined
        ? getInterpretation(data.treatment_expectancy)
        : null;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-300 flex items-center gap-3">
                            <Sparkles className="w-7 h-7 text-cyan-400" />
                            Set & Setting
                        </h2>
                        <p className="text-slate-300 text-sm mt-2">
                            Assess patient's mindset and belief in treatment efficacy before the session.
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

            {/* Treatment Expectancy Slider */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 space-y-6">
                <FormField
                    label="Treatment Expectancy"
                    tooltip="How much does the patient believe this treatment will help them? (1-100)"
                    required
                >
                    <div className="space-y-4">
                        {/* Slider */}
                        <div className="relative">
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={data.treatment_expectancy ?? 50}
                                onChange={(e) => setData({ treatment_expectancy: parseInt(e.target.value) })}
                                className="w-full h-4 rounded-lg appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, 
                                        #ef4444 0%, 
                                        #f59e0b 33%, 
                                        #10b981 66%, 
                                        #10b981 100%)`
                                }}
                            />
                        </div>

                        {/* Value Display */}
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-sm">Low (1)</span>
                            <div className="text-center">
                                <p className="text-5xl font-black text-slate-300">
                                    {data.treatment_expectancy ?? 50}
                                </p>
                                <p className="text-sm text-slate-400 mt-1">out of 100</p>
                            </div>
                            <span className="text-slate-400 text-sm">High (100)</span>
                        </div>

                        {/* Interpretation */}
                        {interpretation && (
                            <div className={`p-4 rounded-lg bg-slate-800/50 border ${interpretation.color} border-current/20 text-center`}>
                                <p className={`text-lg font-bold ${interpretation.color}`}>
                                    {interpretation.label}
                                </p>
                                <p className="text-slate-300 text-sm mt-1">
                                    {data.treatment_expectancy! < 33 && 'Patient may benefit from additional psychoeducation and rapport building.'}
                                    {data.treatment_expectancy! >= 33 && data.treatment_expectancy! < 67 && 'Patient has moderate confidence in treatment. Continue building therapeutic alliance.'}
                                    {data.treatment_expectancy! >= 67 && 'Patient has strong belief in treatment efficacy. Positive prognostic indicator.'}
                                </p>
                            </div>
                        )}
                    </div>
                </FormField>
            </div>
        </div>
    );
};

export default SetAndSettingForm;
