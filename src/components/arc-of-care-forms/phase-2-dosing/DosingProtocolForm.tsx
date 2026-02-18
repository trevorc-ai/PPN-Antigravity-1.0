import React, { useState, useEffect } from 'react';
import { Pill, Save, CheckCircle, Plus } from 'lucide-react';
import { FormField } from '../shared/FormField';
import { NumberInput } from '../shared/NumberInput';
import { UserPicker, UserOption } from '../shared/UserPicker';
import { BatchRegistrationModal, BatchData } from '../shared/BatchRegistrationModal';
import { DeviceRegistrationModal, DeviceData } from '../shared/DeviceRegistrationModal';

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
    batch_id?: number; // Foreign key to ref_substance_batches
    device_id?: number; // Foreign key to ref_wearable_devices
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
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);

    // Mock batch data - in production, fetch from ref_substance_batches
    const [batches, setBatches] = useState([
        { id: 1, batch_number: 'PSI-2024-001', substance: 'Psilocybin', expiration: '2025-12-31' },
        { id: 2, batch_number: 'MDMA-2024-005', substance: 'MDMA', expiration: '2025-06-30' },
        { id: 3, batch_number: 'LSD-2024-003', substance: 'LSD', expiration: '2025-09-15' }
    ]);

    // Mock device data - in production, fetch from ref_wearable_devices
    const [devices, setDevices] = useState([
        { id: 1, device_type: 'Apple Watch', model: 'Series 9', serial: 'AW-001' },
        { id: 2, device_type: 'Fitbit', model: 'Charge 6', serial: 'FB-002' },
        { id: 3, device_type: 'Oura Ring', model: 'Gen 3', serial: 'OR-003' }
    ]);

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

    const handleBatchSave = async (batchData: BatchData) => {
        // In production, save to database and get ID
        const newBatch = {
            id: batches.length + 1,
            batch_number: batchData.batch_number,
            substance: batchData.substance_id,
            expiration: batchData.expiration_date
        };
        setBatches(prev => [...prev, newBatch]);
        setData(prev => ({ ...prev, batch_id: newBatch.id }));
    };

    const handleDeviceSave = async (deviceData: DeviceData) => {
        // In production, save to database and get ID
        const newDevice = {
            id: devices.length + 1,
            device_type: deviceData.device_type,
            model: deviceData.device_model,
            serial: deviceData.serial_number
        };
        setDevices(prev => [...prev, newDevice]);
        setData(prev => ({ ...prev, device_id: newDevice.id }));
    };

    const selectedSubstance = SUBSTANCES.find(s => s.id === data.substance_id);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-300 flex items-center gap-3">
                            <Pill className="w-7 h-7 text-pink-400" />
                            Dosing Protocol
                        </h2>
                        <p className="text-slate-300 text-sm mt-2">
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
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                            <option value="">Select substance...</option>
                            {SUBSTANCES.map(substance => (
                                <option key={substance.id} value={substance.id}>
                                    {substance.name}
                                </option>
                            ))}
                        </select>
                        {selectedSubstance && (
                            <p className="text-sm text-slate-400 mt-2">
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
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                            <option value="">Select route...</option>
                            {ROUTES.map(route => (
                                <option key={route} value={route}>
                                    {route}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    {/* Batch Selection */}
                    <FormField
                        label="Substance Batch"
                        tooltip="Select registered batch for traceability"
                        required
                    >
                        <div className="flex gap-2">
                            <select
                                value={data.batch_id ?? ''}
                                onChange={(e) => updateField('batch_id', e.target.value ? parseInt(e.target.value) : undefined)}
                                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            >
                                <option value="">Select batch...</option>
                                {batches.map(batch => (
                                    <option key={batch.id} value={batch.id}>
                                        {batch.batch_number} ({batch.substance}) - Exp: {batch.expiration}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => setIsBatchModalOpen(true)}
                                className="px-4 py-3 bg-pink-600 hover:bg-pink-700 text-slate-300 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                                title="Register new batch"
                            >
                                <Plus className="w-4 h-4" />
                                New
                            </button>
                        </div>
                    </FormField>

                    {/* Device Selection */}
                    <FormField
                        label="Wearable Device"
                        tooltip="Select device for vital signs tracking (optional)"
                    >
                        <div className="flex gap-2">
                            <select
                                value={data.device_id ?? ''}
                                onChange={(e) => updateField('device_id', e.target.value ? parseInt(e.target.value) : undefined)}
                                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            >
                                <option value="">Select device...</option>
                                {devices.map(device => (
                                    <option key={device.id} value={device.id}>
                                        {device.device_type} {device.model} ({device.serial})
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => setIsDeviceModalOpen(true)}
                                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-slate-300 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                                title="Register new device"
                            >
                                <Plus className="w-4 h-4" />
                                New
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

            {/* Modals */}
            <BatchRegistrationModal
                isOpen={isBatchModalOpen}
                onClose={() => setIsBatchModalOpen(false)}
                onSave={handleBatchSave}
            />
            <DeviceRegistrationModal
                isOpen={isDeviceModalOpen}
                onClose={() => setIsDeviceModalOpen(false)}
                onSave={handleDeviceSave}
            />
        </div>
    );
};

export default DosingProtocolForm;
