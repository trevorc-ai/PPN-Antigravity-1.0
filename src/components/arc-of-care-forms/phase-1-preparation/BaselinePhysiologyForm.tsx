import React, { useState, useEffect } from 'react';
import { Heart, Save, CheckCircle } from 'lucide-react';
import { FormField } from '../shared/FormField';
import { NumberInput } from '../shared/NumberInput';

/**
 * BaselinePhysiologyForm - Baseline Vital Signs
 * 
 * Fields: Resting HRV, BP Systolic, BP Diastolic
 * Layout: 3-column grid (desktop), 1 column (mobile)
 * Features: Combined BP display, color-coded status
 */

export interface BaselinePhysiologyData {
    resting_hrv?: number;
    resting_bp_systolic?: number;
    resting_bp_diastolic?: number;
}

interface BaselinePhysiologyFormProps {
    onSave?: (data: BaselinePhysiologyData) => void;
    initialData?: BaselinePhysiologyData;
    patientId?: string;
}

const BaselinePhysiologyForm: React.FC<BaselinePhysiologyFormProps> = ({
    onSave,
    initialData = {},
    patientId
}) => {
    const [data, setData] = useState<BaselinePhysiologyData>(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Auto-save with debounce
    useEffect(() => {
        if (onSave && Object.keys(data).length > 0) {
            setIsSaving(true);
            const timer = setTimeout(() => {
                onSave(data);
                setIsSaving(false);
                setLastSaved(new Date());
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [data, onSave]);

    const updateField = (field: keyof BaselinePhysiologyData, value: number | undefined) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const getBPStatus = (): { label: string; color: string } | null => {
        if (!data.resting_bp_systolic || !data.resting_bp_diastolic) return null;

        const sys = data.resting_bp_systolic;
        const dia = data.resting_bp_diastolic;

        if (sys < 120 && dia < 80) return { label: 'Normal', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
        if (sys < 130 && dia < 80) return { label: 'Elevated', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' };
        if (sys < 140 || dia < 90) return { label: 'Stage 1 Hypertension', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
        if (sys >= 140 || dia >= 90) return { label: 'Stage 2 Hypertension', color: 'text-red-400 bg-red-500/10 border-red-500/20' };
        if (sys >= 180 || dia >= 120) return { label: 'Hypertensive Crisis', color: 'text-red-500 bg-red-500/20 border-red-500/50' };

        return null;
    };

    const bpStatus = getBPStatus();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-200 flex items-center gap-3">
                            <Heart className="w-7 h-7 text-red-400" />
                            Baseline Physiology
                        </h2>
                        <p className="text-slate-400 text-sm mt-2">
                            Record resting vital signs before treatment to establish baseline cardiovascular health.
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

            {/* Vitals Grid */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Resting HRV */}
                    <FormField
                        label="Resting HRV"
                        tooltip="Heart Rate Variability at rest (milliseconds)"
                        required
                    >
                        <div className="relative">
                            <input
                                type="number"
                                step="0.01"
                                value={data.resting_hrv ?? ''}
                                onChange={(e) => updateField('resting_hrv', e.target.value ? parseFloat(e.target.value) : undefined)}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="50.00"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                                ms
                            </span>
                        </div>
                    </FormField>

                    {/* BP Systolic */}
                    <FormField
                        label="BP (Systolic)"
                        tooltip="Systolic blood pressure (60-250 mmHg)"
                        required
                    >
                        <NumberInput
                            value={data.resting_bp_systolic}
                            onChange={(val) => updateField('resting_bp_systolic', val)}
                            min={60}
                            max={250}
                            unit="mmHg"
                            placeholder="120"
                        />
                    </FormField>

                    {/* BP Diastolic */}
                    <FormField
                        label="BP (Diastolic)"
                        tooltip="Diastolic blood pressure (40-150 mmHg)"
                        required
                    >
                        <NumberInput
                            value={data.resting_bp_diastolic}
                            onChange={(val) => updateField('resting_bp_diastolic', val)}
                            min={40}
                            max={150}
                            unit="mmHg"
                            placeholder="80"
                        />
                    </FormField>
                </div>

                {/* Combined BP Display */}
                {bpStatus && (
                    <div className={`mt-6 p-6 rounded-lg border ${bpStatus.color}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Combined Blood Pressure</p>
                                <p className="text-4xl font-black text-slate-200">
                                    {data.resting_bp_systolic} / {data.resting_bp_diastolic}
                                    <span className="text-lg text-slate-500 ml-2">mmHg</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className={`text-lg font-bold ${bpStatus.color.split(' ')[0]}`}>
                                    {bpStatus.label}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {bpStatus.label === 'Normal' && '✓ Within normal range'}
                                    {bpStatus.label === 'Elevated' && '⚠️ Monitor closely'}
                                    {bpStatus.label.includes('Hypertension') && '⚠️ Consult physician'}
                                    {bpStatus.label === 'Hypertensive Crisis' && '🚨 Immediate medical attention'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BaselinePhysiologyForm;
