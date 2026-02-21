import React, { useState, useRef } from 'react';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { FormField } from '../shared/FormField';

/**
 * SetAndSettingForm - Treatment Expectancy Assessment
 *
 * Fields: Treatment Expectancy (1-100 slider)
 * Layout: Single field, full width
 * Features: Visual gradient slider, interpretation text
 * Save: Explicit Save & Continue button only (no auto-save)
 */

export interface SetAndSettingData {
    treatment_expectancy?: number;
}

interface SetAndSettingFormProps {
    onSave?: (data: SetAndSettingData) => void;
    initialData?: SetAndSettingData;
    patientId?: string;
    /** Called after Save & Continue — advances to the next Phase 1 step */
    onComplete?: () => void;
}

const SetAndSettingForm: React.FC<SetAndSettingFormProps> = ({
    onSave,
    initialData = {},
    patientId,
    onComplete,
}) => {
    const [data, setData] = useState<SetAndSettingData>({ treatment_expectancy: 50, ...initialData });
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [saving, setSaving] = useState(false);
    const savedRef = useRef(false);

    const handleSaveAndContinue = () => {
        if (savedRef.current) return;
        savedRef.current = true;
        setSaving(true);
        onSave?.(data);
        setLastSaved(new Date());
        // Flash confirmation then auto-advance
        setTimeout(() => {
            setSaving(false);
            onComplete?.();
        }, 500);
    };

    const getInterpretation = (score: number): { label: string; color: string; desc: string } => {
        if (score < 33) return {
            label: 'Low Belief in Treatment',
            color: 'text-red-400',
            desc: 'Patient may benefit from additional psychoeducation and rapport building.',
        };
        if (score < 67) return {
            label: 'Moderate Expectancy',
            color: 'text-yellow-400',
            desc: 'Patient has moderate confidence in treatment. Continue building therapeutic alliance.',
        };
        return {
            label: 'High Belief in Treatment',
            color: 'text-emerald-400',
            desc: 'Patient has strong belief in treatment efficacy. Positive prognostic indicator.',
        };
    };

    const interpretation = getInterpretation(data.treatment_expectancy ?? 50);

    return (
        <div className="max-w-3xl mx-auto space-y-6">

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
                                <p className="text-5xl font-black text-slate-200">
                                    {data.treatment_expectancy ?? 50}
                                </p>
                                <p className="text-sm text-slate-400 mt-1">out of 100</p>
                            </div>
                            <span className="text-slate-400 text-sm">High (100)</span>
                        </div>

                        {/* Interpretation */}
                        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 text-center">
                            <p className={`text-lg font-bold ${interpretation.color}`}>
                                {interpretation.label}
                            </p>
                            <p className="text-slate-300 text-sm mt-1">{interpretation.desc}</p>
                        </div>
                    </div>
                </FormField>
            </div>

            {/* Footer: save status + Save & Continue */}
            <div className="flex items-center justify-between gap-4 pt-2 mr-16">
                <span className="text-sm text-emerald-400 font-medium">
                    {lastSaved ? `Saved at ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                </span>
                <button
                    onClick={handleSaveAndContinue}
                    disabled={saving}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${saving
                            ? 'bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30'
                        }`}
                >
                    {saving ? <CheckCircle className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    {saving ? 'Saved!' : 'Save & Continue'}
                </button>
            </div>
        </div>
    );
};

export default SetAndSettingForm;
