import React, { useState, useEffect } from 'react';
import { Pill, Save, CheckCircle, Plus } from 'lucide-react';
import { FormField } from '../shared/FormField';

import { BatchRegistrationModal, BatchData } from '../shared/BatchRegistrationModal';
import { FormFooter } from '../shared/FormFooter';
import { InteractionChecker } from '../../clinical/InteractionChecker';
import { useReferenceData } from '../../../hooks/useReferenceData';

/**
 * DosingProtocolForm - Substance Administration Details
 * 
 * Fields: Substance, Dosage, Route, Batch Number, Session Guide
 * Layout: 2-column grid
 * Features: Substance dropdown with dosage hints, barcode scanner icon
 */

export interface DosingProtocolData {
    substance_id?: string;
    dosage_amount?: number;
    dosage_unit?: string;
    route_of_administration?: string;
    batch_id?: number; // Foreign key to ref_substance_batches
}

interface DosingProtocolFormProps {
    onSave?: (data: DosingProtocolData) => void;
    initialData?: DosingProtocolData;
    patientId?: string;
    sessionId?: string;
    onComplete?: () => void;
    onExit?: () => void;
    onBack?: () => void;
}

// Real substances will be loaded from reference data hook

const ROUTES = [
    'Oral',
    'Sublingual',
    'Intramuscular (IM)',
    'Intravenous (IV)',
    'Insufflated',
    'Vaporized'
];

const DOSAGE_UNITS = [
    'mg',
    'g',
    'mcg',
    'mL',
    'drops'
];



const DosingProtocolForm: React.FC<DosingProtocolFormProps> = ({
    onSave,
    initialData = {},
    patientId,
    sessionId,
    onComplete,
    onExit,
    onBack
}) => {
    const [data, setData] = useState<DosingProtocolData>(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [mockPatientMeds, setMockPatientMeds] = useState<number[]>([]);

    useEffect(() => {
        // Read patient medications from local storage (mock for Phase 1 -> Phase 2 connection)
        try {
            const saved = localStorage.getItem('mock_patient_medications');
            if (saved) {
                setMockPatientMeds(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to parse patient medications', e);
        }
    }, []);

    // Reference Data
    const { substances } = useReferenceData();

    // Mock batch data - in production, fetch from ref_substance_batches
    const [batches, setBatches] = useState([
        { id: 1, batch_number: 'PSI-2024-001', substance: 'Psilocybin', expiration: '2025-12-31' },
        { id: 2, batch_number: 'MDMA-2024-005', substance: 'MDMA', expiration: '2025-06-30' },
        { id: 3, batch_number: 'LSD-2024-003', substance: 'LSD', expiration: '2025-09-15' }
    ]);



    const handleSaveAndExit = () => {
        if (onSave) {
            setIsSaving(true);
            onSave(data);
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
            onSave(data);
            setTimeout(() => {
                setIsSaving(false);
                if (onComplete) onComplete();
            }, 300);
        } else if (onComplete) {
            onComplete();
        }
    };

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

    const selectedSubstance = substances.find(s => s.substance_id === data.substance_id);

    const isValid = Boolean(
        data.substance_id &&
        data.dosage_amount !== undefined &&
        data.dosage_amount > 0 &&
        data.route_of_administration
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {data.substance_id && mockPatientMeds.length > 0 && (
                <div className="animate-in fade-in slide-in-from-top-2">
                    <InteractionChecker
                        substanceId={parseInt(data.substance_id)}
                        medicationIds={mockPatientMeds}
                    />
                </div>
            )}

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
                            {substances.map(substance => (
                                <option key={substance.substance_id} value={substance.substance_id}>
                                    {substance.substance_name}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    {/* Dosage */}
                    <FormField
                        label="Dosage"
                        tooltip="Enter numeric dosage and select the appropriate measurement unit"
                        required
                    >
                        <div className="flex rounded-lg overflow-hidden border border-slate-700/50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                            <input
                                type="number"
                                value={data.dosage_amount ?? ''}
                                onChange={(e) => updateField('dosage_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
                                min={0}
                                step="any"
                                placeholder="e.g. 25"
                                className="flex-1 px-4 py-3 bg-slate-800/50 text-slate-300 focus:outline-none placeholder:text-slate-600 appearance-none m-0"
                            />
                            <div className="w-px bg-slate-700/50" />
                            <select
                                value={data.dosage_unit ?? 'mg'}
                                onChange={(e) => updateField('dosage_unit', e.target.value)}
                                className="w-24 px-3 py-3 bg-slate-800/80 text-slate-300 focus:outline-none cursor-pointer appearance-none text-center"
                            >
                                {DOSAGE_UNITS.map(unit => (
                                    <option key={unit} value={unit}>{unit}</option>
                                ))}
                            </select>
                        </div>
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
                    >
                        <select
                            value={data.batch_id ?? ''}
                            disabled={true}
                            className="w-full px-4 py-3 bg-slate-800/20 border border-slate-700/30 rounded-lg text-slate-500 cursor-not-allowed transition-all"
                        >
                            <option value="">Inventory tracking disabled...</option>
                        </select>
                    </FormField>


                </div>
            </div>

            <FormFooter
                onBack={onBack}
                onSaveAndExit={handleSaveAndExit}
                onSaveAndContinue={handleSaveAndContinue}
                isSaving={isSaving}
                hasChanges={Object.keys(data).length > 0}
                isValid={isValid}
            />

            {/* Modals */}
            <BatchRegistrationModal
                isOpen={isBatchModalOpen}
                onClose={() => setIsBatchModalOpen(false)}
                onSave={handleBatchSave}
            />
        </div >
    );
};

export default DosingProtocolForm;
