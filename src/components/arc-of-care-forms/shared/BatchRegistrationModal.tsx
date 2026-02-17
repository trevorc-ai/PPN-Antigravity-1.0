import React, { useState } from 'react';
import { X, Save, Package } from 'lucide-react';
import { FormField } from './FormField';
import { NumberInput } from './NumberInput';

/**
 * BatchRegistrationModal - Register New Substance Batch
 * 
 * Allows clinicians to register new substance batches for traceability
 */

export interface BatchData {
    substance_id: string;
    batch_number: string;
    expiration_date: string;
    potency_mg: number;
    manufacturer: string;
}

interface BatchRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (batch: BatchData) => Promise<void>;
}

const SUBSTANCES = [
    { id: 'psilocybin', name: 'Psilocybin' },
    { id: 'mdma', name: 'MDMA' },
    { id: 'lsd', name: 'LSD' },
    { id: 'ketamine', name: 'Ketamine' },
    { id: 'ayahuasca', name: 'Ayahuasca' }
];

export const BatchRegistrationModal: React.FC<BatchRegistrationModalProps> = ({
    isOpen,
    onClose,
    onSave
}) => {
    const [data, setData] = useState<BatchData>({
        substance_id: '',
        batch_number: '',
        expiration_date: '',
        potency_mg: 0,
        manufacturer: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    const updateField = (field: keyof BatchData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!data.substance_id || !data.batch_number || !data.expiration_date || !data.potency_mg) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSaving(true);
        try {
            await onSave(data);
            // Reset form
            setData({
                substance_id: '',
                batch_number: '',
                expiration_date: '',
                potency_mg: 0,
                manufacturer: ''
            });
            onClose();
        } catch (error) {
            console.error('Failed to save batch:', error);
            alert('Failed to save batch. Please try again.');
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
                aria-labelledby="batch-modal-title"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-500/10 rounded-lg">
                            <Package className="w-6 h-6 text-pink-400" />
                        </div>
                        <div>
                            <h2 id="batch-modal-title" className="text-xl font-black text-slate-300">
                                Register New Batch
                            </h2>
                            <p className="text-xs text-slate-300">
                                Add a new substance batch for traceability
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
                    {/* Substance */}
                    <FormField label="Substance" required>
                        <select
                            value={data.substance_id}
                            onChange={(e) => updateField('substance_id', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select substance...</option>
                            {SUBSTANCES.map(substance => (
                                <option key={substance.id} value={substance.id}>
                                    {substance.name}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    {/* Batch Number */}
                    <FormField label="Batch Number" required>
                        <input
                            type="text"
                            value={data.batch_number}
                            onChange={(e) => updateField('batch_number', e.target.value)}
                            maxLength={50}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., PSI-2024-001"
                        />
                    </FormField>

                    {/* Expiration Date */}
                    <FormField label="Expiration Date" required>
                        <input
                            type="date"
                            value={data.expiration_date}
                            onChange={(e) => updateField('expiration_date', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </FormField>

                    {/* Potency */}
                    <FormField label="Potency" required>
                        <NumberInput
                            value={data.potency_mg}
                            onChange={(val) => updateField('potency_mg', val ?? 0)}
                            min={0}
                            max={1000}
                            step={0.1}
                            unit="mg"
                            placeholder="25.0"
                        />
                    </FormField>

                    {/* Manufacturer */}
                    <FormField label="Manufacturer" required>
                        <input
                            type="text"
                            value={data.manufacturer}
                            onChange={(e) => updateField('manufacturer', e.target.value)}
                            maxLength={100}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Compass Pathways"
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
                        className="flex-1 px-4 py-3 bg-pink-600 hover:bg-pink-700 disabled:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <Save className="w-4 h-4 animate-pulse" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Batch
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
