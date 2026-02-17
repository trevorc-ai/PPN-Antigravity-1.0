import React, { useState } from 'react';
import { X, Save, Watch } from 'lucide-react';
import { FormField } from './FormField';

/**
 * DeviceRegistrationModal - Register New Wearable Device
 * 
 * Allows clinicians to register new wearable devices for vital signs tracking
 */

export interface DeviceData {
    device_type: string;
    device_model: string;
    serial_number: string;
    firmware_version?: string;
}

interface DeviceRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (device: DeviceData) => Promise<void>;
}

const DEVICE_TYPES = [
    'Apple Watch',
    'Fitbit',
    'Oura Ring',
    'Garmin',
    'Whoop',
    'Manual'
];

export const DeviceRegistrationModal: React.FC<DeviceRegistrationModalProps> = ({
    isOpen,
    onClose,
    onSave
}) => {
    const [data, setData] = useState<DeviceData>({
        device_type: '',
        device_model: '',
        serial_number: '',
        firmware_version: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    const updateField = (field: keyof DeviceData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!data.device_type || !data.device_model || !data.serial_number) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSaving(true);
        try {
            await onSave(data);
            // Reset form
            setData({
                device_type: '',
                device_model: '',
                serial_number: '',
                firmware_version: ''
            });
            onClose();
        } catch (error) {
            console.error('Failed to save device:', error);
            alert('Failed to save device. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-labelledby="device-modal-title"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Watch className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h2 id="device-modal-title" className="text-xl font-black text-slate-300">
                                Register New Device
                            </h2>
                            <p className="text-xs text-slate-300">
                                Add a new wearable device for vital signs tracking
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5 text-slate-300" />
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    {/* Device Type */}
                    <FormField label="Device Type" required>
                        <select
                            value={data.device_type}
                            onChange={(e) => updateField('device_type', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select device type...</option>
                            {DEVICE_TYPES.map(type => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    {/* Device Model */}
                    <FormField label="Device Model" required>
                        <input
                            type="text"
                            value={data.device_model}
                            onChange={(e) => updateField('device_model', e.target.value)}
                            maxLength={100}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Series 9, Charge 6, Gen 3"
                        />
                    </FormField>

                    {/* Serial Number */}
                    <FormField label="Serial Number" required>
                        <input
                            type="text"
                            value={data.serial_number}
                            onChange={(e) => updateField('serial_number', e.target.value)}
                            maxLength={100}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., ABCD1234EFGH5678"
                        />
                    </FormField>

                    {/* Firmware Version (Optional) */}
                    <FormField label="Firmware Version" tooltip="Optional - for troubleshooting purposes">
                        <input
                            type="text"
                            value={data.firmware_version ?? ''}
                            onChange={(e) => updateField('firmware_version', e.target.value)}
                            maxLength={50}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 10.2.1"
                        />
                    </FormField>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-700/50">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <Save className="w-4 h-4 animate-pulse" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Device
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
