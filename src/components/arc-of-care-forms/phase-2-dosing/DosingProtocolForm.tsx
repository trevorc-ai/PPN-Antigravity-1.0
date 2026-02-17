import React, { useState, useEffect } from 'react';
import { Pill, Save, CheckCircle } from 'lucide-react';
import { FormField } from '../shared/FormField';
import { NumberInput } from '../shared/NumberInput';
import { UserPicker, UserOption } from '../shared/UserPicker';

/**
 * DosingProtocolForm - Substance Administration Details
 * 
 * Fields: Substance, Dosage, Route, Batch Number, Session Guide
 * Layout: 2-column grid
 * Features: Substance dropdown with dosage hints, barcode scanner icon
 */

export interface DosingProtocolData {
    substance_id?: string;
    dosage_mg?: number;
    route_of_administration?: string;
    batch_lot_number?: string;
    session_guide_id?: string;
}

interface DosingProtocolFormProps {
    onSave?: (data: DosingProtocolData) => void;
    initialData?: DosingProtocolData;
    patientId?: string;
    sessionId?: string;
}

// Mock data - in production, fetch from ref_substances
const SUBSTANCES = [
    { id: 'psilocybin', name: 'Psilocybin', typical_range: '20-30 mg' },
    { id: 'mdma', name: 'MDMA', typical_range: '80-120 mg' },
    { id: 'lsd', name: 'LSD', typical_range: '100-200 μg' },
    { id: 'ketamine', name: 'Ketamine', typical_range: '0.5-1.0 mg/kg' },
    { id: 'ayahuasca', name: 'Ayahuasca', typical_range: '50-150 ml' }
];

const ROUTES = [
    'Oral',
    'Sublingual',
    'Intramuscular (IM)',
    'Intravenous (IV)',
    'Insufflated',
    'Vaporized'
];

// Mock clinicians
const MOCK_CLINICIANS: UserOption[] = [
    { id: '1', name: 'Dr. Sarah Chen', email: 'schen@ppn.org', role: 'clinician' },
    { id: '2', name: 'Dr. Michael Torres', email: 'mtorres@ppn.org', role: 'clinician' },
    { id: '3', name: 'Dr. Emily Rodriguez', email: 'erodriguez@ppn.org', role: 'clinician' }
];

const DosingProtocolForm: React.FC<DosingProtocolFormProps> = ({
    onSave,
    initialData = {},
    patientId,
    sessionId
}) => {
    const [data, setData] = useState<DosingProtocolData>(initialData);
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

    const updateField = (field: keyof DosingProtocolData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const selectedSubstance = SUBSTANCES.find(s => s.id === data.substance_id);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-200 flex items-center gap-3">
                            <Pill className="w-7 h-7 text-pink-400" />
                            Dosing Protocol
                        </h2>
                        <p className="text-slate-400 text-sm mt-2">
                            Document substance administration details for regulatory compliance and safety tracking.
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

            {/* Form Grid */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Substance */}
                    <FormField
                        label="Substance"
                        tooltip="Select the psychedelic substance being administered"
                        required
                    >
                        <select
                            value={data.substance_id ?? ''}
                            onChange={(e) => updateField('substance_id', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                            <option value="">Select substance...</option>
                            {SUBSTANCES.map(substance => (
                                <option key={substance.id} value={substance.id}>
                                    {substance.name}
                                </option>
                            ))}
                        </select>
                        {selectedSubstance && (
                            <p className="text-xs text-slate-500 mt-2">
                                Typical range: {selectedSubstance.typical_range}
                            </p>
                        )}
                    </FormField>

                    {/* Dosage */}
                    <FormField
                        label="Dosage"
                        tooltip="Enter dosage in milligrams (mg)"
                        required
                    >
                        <NumberInput
                            value={data.dosage_mg}
                            onChange={(val) => updateField('dosage_mg', val)}
                            min={0}
                            max={1000}
                            step={0.1}
                            unit="mg"
                            placeholder="25.0"
                        />
                    </FormField>

                    {/* Route of Administration */}
                    <FormField
                        label="Route of Administration"
                        tooltip="How the substance is administered"
                        required
                    >
                        <select
                            value={data.route_of_administration ?? ''}
                            onChange={(e) => updateField('route_of_administration', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                            <option value="">Select route...</option>
                            {ROUTES.map(route => (
                                <option key={route} value={route}>
                                    {route}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    {/* Batch/Lot Number */}
                    <FormField
                        label="Batch/Lot Number"
                        tooltip="Batch or lot number for traceability (optional)"
                    >
                        <div className="relative">
                            <input
                                type="text"
                                value={data.batch_lot_number ?? ''}
                                onChange={(e) => updateField('batch_lot_number', e.target.value)}
                                maxLength={50}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="e.g., PSI-2024-001"
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-slate-400 transition-colors"
                                title="Scan barcode (future feature)"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                            </button>
                        </div>
                    </FormField>

                    {/* Session Guide */}
                    <div className="md:col-span-2">
                        <FormField
                            label="Session Guide"
                            tooltip="Primary clinician facilitating the session"
                            required
                        >
                            <UserPicker
                                value={data.session_guide_id}
                                onChange={(userId) => updateField('session_guide_id', userId)}
                                users={MOCK_CLINICIANS}
                                roleFilter="clinician"
                                placeholder="Select session guide..."
                            />
                        </FormField>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DosingProtocolForm;
