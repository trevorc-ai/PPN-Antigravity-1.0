import React, { useState, useEffect } from 'react';
import { FileCheck, Save, CheckCircle, AlertTriangle } from 'lucide-react';
import { FormField } from '../shared/FormField';
import { SegmentedControl } from '../shared/SegmentedControl';

/**
 * ConsentForm - Informed Consent Documentation
 * 
 * Fields: Consent Type, Consent Obtained (checkbox), Verification DateTime
 * Layout: Vertical stack
 * Features: Auto-timestamp on consent, required checkbox to enable save
 */

export interface ConsentData {
    consent_type?: string;
    consent_obtained: boolean;
    verification_datetime?: string;
}

interface ConsentFormProps {
    onSave?: (data: ConsentData) => void;
    initialData?: ConsentData;
    patientId?: string;
}

const CONSENT_TYPES = [
    { value: 'informed_consent', label: 'Informed Consent' },
    { value: 'hipaa_authorization', label: 'HIPAA Authorization' },
    { value: 'research_participation', label: 'Research Participation' },
    { value: 'photography_recording', label: 'Photography/Recording' }
];

const ConsentForm: React.FC<ConsentFormProps> = ({
    onSave,
    initialData = { consent_obtained: false },
    patientId
}) => {
    const [data, setData] = useState<ConsentData>(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Auto-save with debounce
    useEffect(() => {
        if (onSave && data.consent_obtained && data.consent_type) {
            setIsSaving(true);
            const timer = setTimeout(() => {
                onSave(data);
                setIsSaving(false);
                setLastSaved(new Date());
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [data, onSave]);

    const handleConsentToggle = (checked: boolean) => {
        const now = checked ? new Date().toISOString().slice(0, 16) : undefined;
        setData(prev => ({
            ...prev,
            consent_obtained: checked,
            verification_datetime: now
        }));
    };

    const canSave = data.consent_obtained && data.consent_type && data.verification_datetime;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-300 flex items-center gap-3">
                            <FileCheck className="w-7 h-7 text-green-400" />
                            Informed Consent
                        </h2>
                        <p className="text-slate-300 text-sm mt-2">
                            Document patient consent and authorization before proceeding with treatment.
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

            {/* Consent Form */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 space-y-8">
                {/* Consent Type */}
                <FormField
                    label="Consent Type"
                    tooltip="Select the type of consent being documented"
                    required
                >
                    <div className="space-y-3">
                        {CONSENT_TYPES.map((type) => (
                            <label
                                key={type.value}
                                className="flex items-center gap-3 p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg cursor-pointer hover:border-blue-500/50 transition-all"
                            >
                                <input
                                    type="radio"
                                    name="consent_type"
                                    value={type.value}
                                    checked={data.consent_type === type.value}
                                    onChange={(e) => setData(prev => ({ ...prev, consent_type: e.target.value }))}
                                    className="w-5 h-5 text-blue-500 border-slate-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                                />
                                <span className="text-slate-300 font-medium">{type.label}</span>
                            </label>
                        ))}
                    </div>
                </FormField>

                {/* Consent Obtained Checkbox */}
                <div className={`p-6 rounded-lg border-2 transition-all ${data.consent_obtained
                        ? 'bg-emerald-500/5 border-emerald-500/50'
                        : 'bg-slate-800/30 border-slate-700/50'
                    }`}>
                    <label className="flex items-start gap-4 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={data.consent_obtained}
                            onChange={(e) => handleConsentToggle(e.target.checked)}
                            className="mt-1 w-6 h-6 rounded border-slate-600 bg-slate-800/50 text-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                        />
                        <div className="flex-1">
                            <p className="text-lg font-bold text-slate-300 group-hover:text-slate-300 transition-colors">
                                I confirm that informed consent has been obtained from the patient
                            </p>
                            <p className="text-sm text-slate-300 mt-2">
                                By checking this box, you certify that the patient has been fully informed of the treatment, risks, benefits, and alternatives, and has voluntarily agreed to proceed.
                            </p>
                        </div>
                    </label>
                </div>

                {/* Verification DateTime */}
                {data.consent_obtained && (
                    <FormField
                        label="Verification Date & Time"
                        tooltip="Automatically filled when consent is obtained. Can be manually adjusted if needed."
                        required
                    >
                        <input
                            type="datetime-local"
                            value={data.verification_datetime ?? ''}
                            onChange={(e) => setData(prev => ({ ...prev, verification_datetime: e.target.value }))}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </FormField>
                )}

                {/* Warning if not consented */}
                {!data.consent_obtained && (
                    <div className="flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-yellow-400 font-semibold text-sm">Consent Required</p>
                            <p className="text-yellow-400/80 text-xs mt-1">
                                Patient consent must be obtained and documented before proceeding with treatment.
                            </p>
                        </div>
                    </div>
                )}

                {/* Save Status */}
                {canSave && (
                    <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <p className="text-emerald-400 font-semibold text-sm">
                            Consent documented and saved
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConsentForm;
