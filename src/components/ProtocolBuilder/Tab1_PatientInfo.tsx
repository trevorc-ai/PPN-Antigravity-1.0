import React from 'react';

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
    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-[#f8fafc] mb-3">
                {label} {required && <span className="text-[#ef4444]">*</span>}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={`
              px-4 py-3 rounded-lg font-medium transition-all text-sm
              ${value === option.value
                                ? 'bg-[#14b8a6] text-white border-2 border-[#14b8a6]'
                                : 'bg-[#020408] text-[#94a3b8] border-2 border-[#1e293b] hover:border-[#14b8a6]/50'
                            }
            `}
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

export const Tab1_PatientInfo: React.FC<Tab1PatientInfoProps> = ({
    formData,
    onChange,
    isPreFilled,
    preFillDate,
}) => {
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

    const weightOptions: ButtonGroupOption[] = [
        { value: '40-50kg', label: '40-50kg' },
        { value: '51-60kg', label: '51-60kg' },
        { value: '61-70kg', label: '61-70kg' },
        { value: '71-80kg', label: '71-80kg' },
        { value: '81-90kg', label: '81-90kg' },
        { value: '91-100kg', label: '91-100kg' },
        { value: '101+kg', label: '101+kg' },
    ];

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
