import React from 'react';
import { Activity, Heart, Droplet } from 'lucide-react';

/**
 * VitalPresetsBar - Quick-Entry Presets for Session Vitals
 * 
 * Reduces vital sign entry from 15-20 touches to 2-3 touches.
 * 
 * Presets:
 * - Baseline: HR=72, HRV=45, SpO2=98, BP=120/80
 * - Peak: HR=95, HRV=30, SpO2=96, BP=135/85
 * - Recovery: HR=78, HRV=42, SpO2=98, BP=125/82
 */

export interface VitalPreset {
    heart_rate: number;
    hrv: number;
    spo2: number;
    bp_systolic: number;
    bp_diastolic: number;
}

export const VITAL_PRESETS: Record<string, VitalPreset> = {
    baseline: {
        heart_rate: 72,
        hrv: 45,
        spo2: 98,
        bp_systolic: 120,
        bp_diastolic: 80
    },
    peak: {
        heart_rate: 95,
        hrv: 30,
        spo2: 96,
        bp_systolic: 135,
        bp_diastolic: 85
    },
    recovery: {
        heart_rate: 78,
        hrv: 42,
        spo2: 98,
        bp_systolic: 125,
        bp_diastolic: 82
    }
};

interface VitalPresetsBarProps {
    onPresetSelect: (preset: VitalPreset) => void;
}

export const VitalPresetsBar: React.FC<VitalPresetsBarProps> = ({ onPresetSelect }) => {
    const presets = [
        { id: 'baseline', label: 'Baseline', icon: Activity, color: 'blue' },
        { id: 'peak', label: 'Peak', icon: Heart, color: 'red' },
        { id: 'recovery', label: 'Recovery', icon: Droplet, color: 'emerald' }
    ];

    return (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Quick Entry Presets
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {presets.map((preset) => {
                    const Icon = preset.icon;
                    const values = VITAL_PRESETS[preset.id];

                    return (
                        <button
                            key={preset.id}
                            onClick={() => onPresetSelect(values)}
                            className={`flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all
                         bg-${preset.color}-500/10 border-${preset.color}-500/30 
                         hover:bg-${preset.color}-500/20 hover:border-${preset.color}-500/50
                         focus:outline-none focus:ring-2 focus:ring-${preset.color}-500`}
                        >
                            <div className="flex items-center gap-2 w-full">
                                <Icon className={`w-5 h-5 text-${preset.color}-400`} />
                                <span className="text-sm font-bold text-slate-300">{preset.label}</span>
                            </div>
                            <div className="text-xs text-slate-300 space-y-0.5 w-full">
                                <div className="flex justify-between">
                                    <span>HR:</span>
                                    <span className="font-mono">{values.heart_rate} bpm</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>HRV:</span>
                                    <span className="font-mono">{values.hrv} ms</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>SpO₂:</span>
                                    <span className="font-mono">{values.spo2}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>BP:</span>
                                    <span className="font-mono">{values.bp_systolic}/{values.bp_diastolic}</span>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
            <p className="text-xs text-slate-500 mt-3">
                💡 Click a preset to auto-fill all vital signs. You can fine-tune values after.
            </p>
        </div>
    );
};
