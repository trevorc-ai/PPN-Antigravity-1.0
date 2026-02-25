import React from 'react';
import { Check } from 'lucide-react';
import { useReferenceData } from '../../hooks/useReferenceData';

interface ButtonGroupOption {
    value: string;
    label: string;
}

interface ButtonGroupProps {
    label: string;
    options: ButtonGroupOption[];
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ label, options, value, onChange, required }) => {
    const handleKeyDown = (e: React.KeyboardEvent, optionValue: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onChange(optionValue);
        }
    };

    const isIncomplete = required && !value;

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-[#f8fafc] mb-3 flex items-center gap-2">
                {label}
                {required && (
                    <span className={`text-[#ef4444] ${isIncomplete ? 'animate-pulse' : ''}`}>
                        *
                    </span>
                )}
                {value && (
                    <span className="text-[#10b981] text-xs flex items-center gap-1 font-semibold">
                        <Check className="w-3.5 h-3.5" /> Complete
                    </span>
                )}
            </label>
            <div className={`
                grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 
                p-3 rounded-lg transition-all duration-300
                ${isIncomplete ? 'bg-[#ef4444]/5 border border-[#ef4444]/20' : 'bg-transparent border border-transparent'}
            `}>
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        onKeyDown={(e) => handleKeyDown(e, option.value)}
                        className={`
              px-4 py-3 rounded-lg font-medium transition-all duration-200 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:ring-offset-2 focus:ring-offset-[#020408]
              ${value === option.value
                                ? 'bg-[#14b8a6] text-slate-300 border-2 border-[#14b8a6] shadow-lg shadow-[#14b8a6]/20 scale-105'
                                : 'bg-[#020408] text-[#94a3b8] border-2 border-[#1e293b] hover:border-[#14b8a6]/50 hover:scale-105'
                            }
            `}
                        aria-pressed={value === option.value}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

interface Tab1PatientInfoProps {
    formData: {
        patient_age: string;
        patient_sex: string;
        patient_weight_range: string;
        smoking_status: string;
        prior_experience: string;
    };
    onChange: (field: string, value: string) => void;
    isPreFilled?: boolean;
    preFillDate?: string;
}

// Fallback list used while the DB table loads or if migration 065 hasn't run yet
const WEIGHT_FALLBACK: ButtonGroupOption[] = [
    { value: '< 50 kg', label: '< 50 kg' },
    { value: '50-60 kg', label: '50-60 kg' },
    { value: '60-70 kg', label: '60-70 kg' },
    { value: '70-80 kg', label: '70-80 kg' },
    { value: '80-90 kg', label: '80-90 kg' },
    { value: '90-100 kg', label: '90-100 kg' },
    { value: '> 100 kg', label: '> 100 kg' },
];

export const Tab1_PatientInfo: React.FC<Tab1PatientInfoProps> = ({
    formData,
    onChange,
    isPreFilled,
    preFillDate,
}) => {
    const { weightRanges, loading: refLoading } = useReferenceData();
    const ageOptions: ButtonGroupOption[] = [
        { value: '18-25', label: '18-25' },
        { value: '26-35', label: '26-35' },
        { value: '36-45', label: '36-45' },
        { value: '46-55', label: '46-55' },
        { value: '56-65', label: '56-65' },
        { value: '66+', label: '66+' },
    ];

    const sexOptions: ButtonGroupOption[] = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Intersex', label: 'Intersex' },
        { value: 'Unknown', label: 'Unknown' },
    ];

    // Derive weight options from live ref_weight_ranges; fall back if loading
    const weightOptions: ButtonGroupOption[] =
        !refLoading && weightRanges.length > 0
            ? weightRanges
                .filter((r: any) => r.is_active !== false)
                .map((r: any) => ({ value: r.range_label, label: r.range_label }))
            : WEIGHT_FALLBACK;

    const smokingOptions: ButtonGroupOption[] = [
        { value: 'Current Daily', label: 'Current Daily' },
        { value: 'Current Occasional', label: 'Occasional' },
        { value: 'Former', label: 'Former' },
        { value: 'Non-Smoker', label: 'Non-Smoker' },
    ];

    const experienceOptions: ButtonGroupOption[] = [
        { value: 'None', label: 'None' },
        { value: '1-5', label: '1-5' },
        { value: '6-10', label: '6-10' },
        { value: '11+', label: '11+' },
    ];

    return (
        <div>
            {isPreFilled && preFillDate && (
                <div className="mb-6 bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg p-4">
                    <p className="text-sm text-[#10b981] flex items-center gap-2">
                        <span className="text-lg">✓</span>
                        Pre-filled from previous session • {new Date(preFillDate).toLocaleDateString()}
                    </p>
                </div>
            )}

            <ButtonGroup
                label="Age Range"
                options={ageOptions}
                value={formData.patient_age}
                onChange={(value) => onChange('patient_age', value)}
                required
            />

            <ButtonGroup
                label="Biological Sex"
                options={sexOptions}
                value={formData.patient_sex}
                onChange={(value) => onChange('patient_sex', value)}
                required
            />

            <ButtonGroup
                label="Weight Range"
                options={weightOptions}
                value={formData.patient_weight_range}
                onChange={(value) => onChange('patient_weight_range', value)}
                required
            />

            <ButtonGroup
                label="Smoking Status"
                options={smokingOptions}
                value={formData.smoking_status}
                onChange={(value) => onChange('smoking_status', value)}
            />

            <ButtonGroup
                label="Prior Psychedelic Experience"
                options={experienceOptions}
                value={formData.prior_experience}
                onChange={(value) => onChange('prior_experience', value)}
            />
        </div>
    );
};
