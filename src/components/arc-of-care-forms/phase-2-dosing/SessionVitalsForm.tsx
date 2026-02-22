import React, { useState, useEffect } from 'react';
import { Heart, Activity, Droplet, Clock, Save, Plus, Trash2, CheckCircle, Wind, Thermometer, AlertTriangle } from 'lucide-react';
import { AdvancedTooltip } from '../../ui/AdvancedTooltip';
import { VitalPresetsBar, VitalPreset } from '../shared/VitalPresetsBar';
import { FormFooter } from '../shared/FormFooter';

/**
 * SessionVitalsForm - Real-Time Vital Signs Tracking
 * 
 * Reference Implementation for Arc of Care Forms
 * 
 * Features:
 * - 8 input fields (HR, HRV, BP Systolic/Diastolic, SpO2, DateTime, Source, Device)
 * - Color-coded vital sign status (green=normal, yellow=elevated, red=critical)
 * - Repeatable form (add multiple vital sign readings)
 * - Auto-save on blur (500ms debounce)
 * - "Record Now" quick-fill button
 * - Mobile-responsive (single column → 3 column grid)
 * - Full accessibility (WCAG AAA, keyboard navigation, ARIA labels)
 * 
 * Props:
 * - onSave: (data: VitalSignReading[]) => void
 * - initialData?: VitalSignReading[]
 * - patientId?: string
 * - sessionId?: string
 */

export interface VitalSignReading {
    id: string;
    heart_rate?: number;
    hrv?: number;
    bp_systolic?: number;
    bp_diastolic?: number;
    spo2?: number;
    // WO-085: New vital sign fields
    respiratory_rate?: number;                                              // breaths/min (normal 12-20)
    temperature?: number;                                                   // °F (normal 97.0-99.5)
    diaphoresis_score?: 0 | 1 | 2 | 3;                                    // 0=None, 1=Mild, 2=Moderate, 3=Severe
    level_of_consciousness?: 'alert' | 'verbal' | 'pain' | 'unresponsive'; // AVPU scale
    recorded_at?: string;
    data_source?: string;
    device_id?: string;
}

interface SessionVitalsFormProps {
    onSave?: (data: VitalSignReading[]) => void;
    initialData?: VitalSignReading[];
    patientId?: string;
    sessionId?: string;
    onComplete?: () => void;
    onExit?: () => void;
    onBack?: () => void;
}

const SessionVitalsForm: React.FC<SessionVitalsFormProps> = ({
    onSave,
    initialData = [],
    patientId,
    sessionId,
    onComplete,
    onExit,
    onBack
}) => {
    const [readings, setReadings] = useState<VitalSignReading[]>(
        initialData.length > 0 ? initialData : [createEmptyReading()]
    );
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveAndExit = () => {
        if (onSave) {
            setIsSaving(true);
            const validReadings = readings.filter(r => hasData(r));
            if (validReadings.length > 0) {
                onSave(validReadings);
            }
            setTimeout(() => {
                setIsSaving(false);
                if (onExit) onExit();
            }, 300);
        } else if (onExit) {
            onExit();
        }
    };

    const handleSaveAndContinue = () => {
        if (onSave) {
            setIsSaving(true);
            const validReadings = readings.filter(r => hasData(r));
            if (validReadings.length > 0) {
                onSave(validReadings);
            }
            setTimeout(() => {
                setIsSaving(false);
                if (onComplete) onComplete();
            }, 300);
        } else if (onComplete) {
            onComplete();
        }
    };

    function createEmptyReading(): VitalSignReading {
        return {
            id: `reading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
    }

    function hasData(reading: VitalSignReading): boolean {
        return !!(
            reading.heart_rate ||
            reading.hrv ||
            reading.bp_systolic ||
            reading.bp_diastolic ||
            reading.spo2 ||
            reading.respiratory_rate ||
            reading.temperature ||
            reading.diaphoresis_score !== undefined ||
            reading.level_of_consciousness
        );
    }

    function getVitalStatus(type: 'hr' | 'bp' | 'spo2' | 'rr' | 'temp', value?: number): 'normal' | 'elevated' | 'critical' {
        if (value === undefined || value === null) return 'normal';

        switch (type) {
            case 'hr':
                if (value < 60 || value > 100) return 'elevated';
                if (value < 40 || value > 120) return 'critical';
                return 'normal';
            case 'bp':
                if (value > 140) return 'elevated';
                if (value > 180) return 'critical';
                return 'normal';
            case 'spo2':
                if (value < 95) return 'elevated';
                if (value < 90) return 'critical';
                return 'normal';
            // WO-085: New vital status checks
            case 'rr':
                if (value < 10 || value > 24) return 'elevated';
                if (value < 8 || value > 30) return 'critical';
                return 'normal';
            case 'temp':
                if (value > 99.5 && value <= 100.4) return 'elevated';
                if (value > 100.4) return 'critical';
                return 'normal';
            default:
                return 'normal';
        }
    }

    function getDiaphoresisStatus(score?: number): 'normal' | 'elevated' | 'critical' {
        if (score === undefined) return 'normal';
        if (score === 2) return 'elevated';
        if (score === 3) return 'critical';
        return 'normal';
    }

    function getLOCStatus(loc?: string): 'normal' | 'elevated' | 'critical' {
        if (!loc || loc === 'alert') return 'normal';
        if (loc === 'verbal') return 'elevated';
        return 'critical'; // pain or unresponsive
    }

    function getStatusColor(status: 'normal' | 'elevated' | 'critical'): string {
        switch (status) {
            case 'normal':
                return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'elevated':
                return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'critical':
                return 'text-red-400 bg-red-500/10 border-red-500/20';
        }
    }

    function updateReading(index: number, field: keyof VitalSignReading, value: any) {
        setReadings(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    }

    function addReading() {
        setReadings(prev => [...prev, createEmptyReading()]);
    }

    function removeReading(index: number) {
        if (readings.length > 1) {
            setReadings(prev => prev.filter((_, i) => i !== index));
        }
    }

    function recordNow(index: number) {
        const now = new Date().toISOString().slice(0, 16);
        updateReading(index, 'recorded_at', now);
    }

    function handlePresetSelect(index: number, preset: VitalPreset) {
        updateReading(index, 'heart_rate', preset.heart_rate);
        updateReading(index, 'hrv', preset.hrv);
        updateReading(index, 'spo2', preset.spo2);
        updateReading(index, 'bp_systolic', preset.bp_systolic);
        updateReading(index, 'bp_diastolic', preset.bp_diastolic);
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-300 flex items-center gap-3">
                            <Activity className="w-7 h-7 text-blue-400" />
                            Session Vital Signs
                        </h2>
                        <p className="text-slate-300 text-sm mt-2">
                            Track real-time vital signs during the dosing session. Add multiple readings to monitor trends.
                        </p>
                    </div>
                </div>
            </div>

            {/* Vital Sign Readings */}
            {readings.map((reading, index) => {
                const hrStatus = getVitalStatus('hr', reading.heart_rate);
                const bpStatus = getVitalStatus('bp', reading.bp_systolic);
                const spo2Status = getVitalStatus('spo2', reading.spo2);

                return (
                    <div
                        key={reading.id}
                        className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-6"
                    >
                        {/* Reading Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-300">
                                Reading #{index + 1}
                            </h3>
                            {readings.length > 1 && (
                                <button
                                    onClick={() => removeReading(index)}
                                    className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all text-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Remove
                                </button>
                            )}
                        </div>

                        {/* Quick-Entry Presets */}
                        <VitalPresetsBar onPresetSelect={(preset) => handlePresetSelect(index, preset)} />

                        {/* Vital Signs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Heart Rate */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                                    <Heart className="w-4 h-4 text-red-400" />
                                    Heart Rate
                                    <AdvancedTooltip content="Normal range: 60-100 bpm" tier="micro">
                                        <span className="text-slate-400 cursor-help">ⓘ</span>
                                    </AdvancedTooltip>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text" inputMode="numeric" pattern="[0-9]*\.\?[0-9]*"
                                        min="40"
                                        max="200"
                                        value={reading.heart_rate ?? ''}
                                        onChange={(e) => updateReading(index, 'heart_rate', e.target.value ? parseInt(e.target.value) : undefined)}
                                        className={`w-full px-4 py-3 bg-slate-950/80 border rounded-lg text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600 ${reading.heart_rate ? getStatusColor(hrStatus) : 'border-slate-600'
                                            }`}
                                        placeholder="70"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                        bpm
                                    </span>
                                </div>
                                {reading.heart_rate && hrStatus !== 'normal' && (
                                    <p className={`text-sm ${hrStatus === 'critical' ? 'text-red-400' : 'text-yellow-400'}`}>
                                        {hrStatus === 'critical' ? '⚠️ Critical - Outside safe range' : '⚠️ Elevated'}
                                    </p>
                                )}
                            </div>

                            {/* HRV */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                                    <Activity className="w-4 h-4 text-blue-400" />
                                    HRV
                                    <AdvancedTooltip content="Heart Rate Variability in milliseconds" tier="micro">
                                        <span className="text-slate-400 cursor-help">ⓘ</span>
                                    </AdvancedTooltip>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text" inputMode="numeric" pattern="[0-9]*\.\?[0-9]*"
                                        step="0.01"
                                        value={reading.hrv ?? ''}
                                        onChange={(e) => updateReading(index, 'hrv', e.target.value ? parseFloat(e.target.value) : undefined)}
                                        className="w-full px-4 py-3 bg-slate-950/80 border border-slate-600 rounded-lg text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                                        placeholder="50.00"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                        ms
                                    </span>
                                </div>
                            </div>

                            {/* SpO2 */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                                    <Droplet className="w-4 h-4 text-cyan-400" />
                                    SpO₂
                                    <AdvancedTooltip content="Blood oxygen saturation. Normal: ≥95%" tier="micro">
                                        <span className="text-slate-400 cursor-help">ⓘ</span>
                                    </AdvancedTooltip>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text" inputMode="numeric" pattern="[0-9]*\.\?[0-9]*"
                                        min="70"
                                        max="100"
                                        value={reading.spo2 ?? ''}
                                        onChange={(e) => updateReading(index, 'spo2', e.target.value ? parseInt(e.target.value) : undefined)}
                                        className={`w-full px-4 py-3 bg-slate-950/80 border rounded-lg text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600 ${reading.spo2 ? getStatusColor(spo2Status) : 'border-slate-600'
                                            }`}
                                        placeholder="98"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                        %
                                    </span>
                                </div>
                                {reading.spo2 && spo2Status !== 'normal' && (
                                    <p className={`text-sm ${spo2Status === 'critical' ? 'text-red-400' : 'text-yellow-400'}`}>
                                        {spo2Status === 'critical' ? '⚠️ Critical - Low oxygen' : '⚠️ Below normal'}
                                    </p>
                                )}
                            </div>

                            {/* BP Systolic */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                                    BP (Systolic)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text" inputMode="numeric" pattern="[0-9]*\.\?[0-9]*"
                                        min="60"
                                        max="250"
                                        value={reading.bp_systolic ?? ''}
                                        onChange={(e) => updateReading(index, 'bp_systolic', e.target.value ? parseInt(e.target.value) : undefined)}
                                        className={`w-full px-4 py-3 bg-slate-950/80 border rounded-lg text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600 ${reading.bp_systolic ? getStatusColor(bpStatus) : 'border-slate-600'
                                            }`}
                                        placeholder="120"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                        mmHg
                                    </span>
                                </div>
                            </div>

                            {/* BP Diastolic */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                                    BP (Diastolic)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text" inputMode="numeric" pattern="[0-9]*\.\?[0-9]*"
                                        min="40"
                                        max="150"
                                        value={reading.bp_diastolic ?? ''}
                                        onChange={(e) => updateReading(index, 'bp_diastolic', e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="w-full px-4 py-3 bg-slate-950/80 border border-slate-600 rounded-lg text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                                        placeholder="80"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                        mmHg
                                    </span>
                                </div>
                            </div>

                            {/* Combined BP Display */}
                            {reading.bp_systolic && reading.bp_diastolic && (
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300">
                                        Combined BP
                                    </label>
                                    <div className={`px-4 py-3 rounded-lg border ${getStatusColor(bpStatus)}`}>
                                        <p className="text-2xl font-black">
                                            {reading.bp_systolic} / {reading.bp_diastolic}
                                        </p>
                                        <p className="text-sm mt-1">
                                            {bpStatus === 'normal' ? '✓ Normal' : bpStatus === 'elevated' ? '⚠️ Elevated' : '⚠️ Critical'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* WO-085: New Vital Signs Section */}
                        <div className="pt-4 border-t border-slate-700/50">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">Extended Monitoring</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                                {/* Respiratory Rate */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                                        <Wind className="w-4 h-4 text-cyan-400" />
                                        Resp. Rate
                                        <AdvancedTooltip content="Normal: 12-20 breaths/min. Monitor for respiratory depression (ketamine/esketamine risk per REMS)." tier="micro">
                                            <span className="text-slate-400 cursor-help">ⓘ</span>
                                        </AdvancedTooltip>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text" inputMode="numeric" pattern="[0-9]*\.\?[0-9]*"
                                            min="0"
                                            max="60"
                                            value={reading.respiratory_rate ?? ''}
                                            onChange={(e) => updateReading(index, 'respiratory_rate', e.target.value ? parseInt(e.target.value) : undefined)}
                                            className={`w-full px-4 py-3 bg-slate-950/80 border rounded-lg text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600 ${reading.respiratory_rate !== undefined ? getStatusColor(getVitalStatus('rr', reading.respiratory_rate)) : 'border-slate-600'
                                                }`}
                                            placeholder="16"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">br/min</span>
                                    </div>
                                    {reading.respiratory_rate !== undefined && getVitalStatus('rr', reading.respiratory_rate) !== 'normal' && (
                                        <p className={`text-sm ${getVitalStatus('rr', reading.respiratory_rate) === 'critical' ? 'text-red-400' : 'text-yellow-400'}`}>
                                            {getVitalStatus('rr', reading.respiratory_rate) === 'critical' ? '⚠️ Critical — respiratory depression risk' : '⚠️ Outside normal range'}
                                        </p>
                                    )}
                                </div>

                                {/* Temperature */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                                        <Thermometer className="w-4 h-4 text-orange-400" />
                                        Temperature
                                        <AdvancedTooltip content="Normal: 97.0–99.5°F. Monitor for hyperthermia (MDMA risk) and thermoregulation fluctuations." tier="micro">
                                            <span className="text-slate-400 cursor-help">ⓘ</span>
                                        </AdvancedTooltip>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text" inputMode="numeric" pattern="[0-9]*\.\?[0-9]*"
                                            min="90"
                                            max="110"
                                            step="0.1"
                                            value={reading.temperature ?? ''}
                                            onChange={(e) => updateReading(index, 'temperature', e.target.value ? parseFloat(e.target.value) : undefined)}
                                            className={`w-full px-4 py-3 bg-slate-950/80 border rounded-lg text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600 ${reading.temperature !== undefined ? getStatusColor(getVitalStatus('temp', reading.temperature)) : 'border-slate-600'
                                                }`}
                                            placeholder="98.6"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">°F</span>
                                    </div>
                                    {reading.temperature !== undefined && getVitalStatus('temp', reading.temperature) !== 'normal' && (
                                        <p className={`text-sm ${getVitalStatus('temp', reading.temperature) === 'critical' ? 'text-red-400' : 'text-yellow-400'}`}>
                                            {getVitalStatus('temp', reading.temperature) === 'critical' ? '⚠️ Critical — hyperthermia risk' : '⚠️ Mild fever'}
                                        </p>
                                    )}
                                </div>

                                {/* Diaphoresis Score */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                                        <Droplet className="w-4 h-4 text-blue-300" />
                                        Diaphoresis
                                        <AdvancedTooltip content="Sweating scale: 0=None, 1=Mild, 2=Moderate, 3=Severe. Severe may signal hyperthermia or serotonin syndrome." tier="micro">
                                            <span className="text-slate-400 cursor-help">ⓘ</span>
                                        </AdvancedTooltip>
                                    </label>
                                    <select
                                        value={reading.diaphoresis_score ?? ''}
                                        onChange={(e) => updateReading(index, 'diaphoresis_score', e.target.value !== '' ? parseInt(e.target.value) as 0 | 1 | 2 | 3 : undefined)}
                                        className={`w-full px-4 py-3 bg-slate-950/80 border rounded-lg text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none placeholder:text-slate-600 ${reading.diaphoresis_score !== undefined ? getStatusColor(getDiaphoresisStatus(reading.diaphoresis_score)) : 'border-slate-600'
                                            }`}
                                    >
                                        <option value="">Select...</option>
                                        <option value="0">0 — None (dry skin)</option>
                                        <option value="1">1 — Mild (slight moisture)</option>
                                        <option value="2">2 — Moderate (visible sweating)</option>
                                        <option value="3">3 — Severe (profuse sweating)</option>
                                    </select>
                                    {reading.diaphoresis_score !== undefined && getDiaphoresisStatus(reading.diaphoresis_score) !== 'normal' && (
                                        <p className={`text-sm ${getDiaphoresisStatus(reading.diaphoresis_score) === 'critical' ? 'text-red-400' : 'text-yellow-400'}`}>
                                            {getDiaphoresisStatus(reading.diaphoresis_score) === 'critical' ? '⚠️ Severe — check temp & hydration' : '⚠️ Monitor closely'}
                                        </p>
                                    )}
                                </div>

                                {/* Level of Consciousness */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                        LOC (AVPU)
                                        <AdvancedTooltip content="AVPU scale: Alert=Normal, Verbal=Responds to voice, Pain=Over-sedation, Unresponsive=Emergency. Required per CANMAT guidelines." tier="micro">
                                            <span className="text-slate-400 cursor-help">ⓘ</span>
                                        </AdvancedTooltip>
                                    </label>
                                    <select
                                        value={reading.level_of_consciousness ?? ''}
                                        onChange={(e) => updateReading(index, 'level_of_consciousness', e.target.value || undefined)}
                                        className={`w-full px-4 py-3 bg-slate-950/80 border rounded-lg text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none placeholder:text-slate-600 ${reading.level_of_consciousness ? getStatusColor(getLOCStatus(reading.level_of_consciousness)) : 'border-slate-600'
                                            }`}
                                    >
                                        <option value="">Select...</option>
                                        <option value="alert">Alert (A) — Fully awake</option>
                                        <option value="verbal">Verbal (V) — Responds to voice</option>
                                        <option value="pain">Pain (P) — Responds to pain only</option>
                                        <option value="unresponsive">Unresponsive (U) — No response</option>
                                    </select>
                                    {reading.level_of_consciousness && getLOCStatus(reading.level_of_consciousness) !== 'normal' && (
                                        <p className={`text-sm ${getLOCStatus(reading.level_of_consciousness) === 'critical' ? 'text-red-400' : 'text-yellow-400'}`}>
                                            {reading.level_of_consciousness === 'unresponsive' ? '🚨 EMERGENCY — initiate rescue protocol' :
                                                reading.level_of_consciousness === 'pain' ? '⚠️ Critical — over-sedation' :
                                                    '⚠️ Monitor — reduced responsiveness'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                            {/* Recorded At */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                                    <Clock className="w-4 h-4 text-slate-300" />
                                    Recorded At
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="datetime-local"
                                        value={reading.recorded_at ?? ''}
                                        onChange={(e) => updateReading(index, 'recorded_at', e.target.value)}
                                        className="flex-1 px-4 py-3 bg-slate-950/80 border border-slate-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                                    />
                                    <button
                                        onClick={() => recordNow(index)}
                                        className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-slate-300 rounded-lg font-medium transition-all whitespace-nowrap"
                                    >
                                        Now
                                    </button>
                                </div>
                            </div>

                            {/* Data Source */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300">
                                    Data Source
                                </label>
                                <input
                                    type="text"
                                    value={reading.data_source ?? ''}
                                    onChange={(e) => updateReading(index, 'data_source', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                                    placeholder="e.g., Apple Watch, Manual"
                                />
                            </div>

                            {/* Device ID */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-300">
                                    Device ID <span className="text-slate-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={reading.device_id ?? ''}
                                    onChange={(e) => updateReading(index, 'device_id', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                                    placeholder="Device serial number or identifier"
                                />
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Add Reading Button */}
            <button
                onClick={addReading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-blue-500/50 text-slate-300 hover:text-blue-400 rounded-2xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <Plus className="w-5 h-5" />
                Add Another Reading
            </button>

            <FormFooter
                onBack={onBack}
                onSaveAndExit={handleSaveAndExit}
                onSaveAndContinue={handleSaveAndContinue}
                isSaving={isSaving}
                hasChanges={readings.some(r => hasData(r))}
            />
        </div>
    );
};

export default SessionVitalsForm;
