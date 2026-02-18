import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface Tab2MedicationsProps {
    selectedMedications: number[];
    onChange: (medications: number[]) => void;
}

interface Medication {
    medication_id: number;
    medication_name: string;
    brand_name?: string;
    category?: string;
    is_common?: boolean;
}

export const Tab2_Medications: React.FC<Tab2MedicationsProps> = ({
    selectedMedications,
    onChange,
}) => {
    const [medications, setMedications] = useState<Medication[]>([]);
    const [showMoreMedications, setShowMoreMedications] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    useEffect(() => {
        loadMedications();
    }, []);

    const loadMedications = async () => {
        const { data } = await supabase
            .from('ref_medications')
            .select('*')
            .order('is_common', { ascending: false })
            .order('medication_name');

        if (data) setMedications(data);
    };

    const toggleMedication = (medicationId: number) => {
        if (selectedMedications.includes(medicationId)) {
            onChange(selectedMedications.filter((id) => id !== medicationId));
        } else {
            onChange([...selectedMedications, medicationId]);
        }
    };

    const toggleCategory = (category: string) => {
        if (expandedCategories.includes(category)) {
            setExpandedCategories(expandedCategories.filter(c => c !== category));
        } else {
            setExpandedCategories([...expandedCategories, category]);
        }
    };

    const getSelectedMedicationNames = () => {
        return medications.filter((med) => selectedMedications.includes(med.medication_id));
    };

    const commonMedications = medications.filter(m => m.is_common).slice(0, 12);
    const otherMedications = medications.filter(m => !m.is_common);

    // Group by category
    const medicationsByCategory = otherMedications.reduce((acc, med) => {
        const category = med.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(med);
        return acc;
    }, {} as Record<string, Medication[]>);

    return (
        <div>
            {/* Selected Medications Pills */}
            {selectedMedications.length > 0 && (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-[#94a3b8] mb-2">
                        Selected ({selectedMedications.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {getSelectedMedicationNames().map((med) => (
                            <div
                                key={med.medication_id}
                                className="bg-[#14b8a6] border border-[#0d9488] rounded-full px-4 py-2 flex items-center gap-2"
                            >
                                <span className="text-sm text-slate-300 font-medium">
                                    {med.medication_name}
                                </span>
                                <button
                                    onClick={() => toggleMedication(med.medication_id)}
                                    className="text-slate-300 hover:text-[#f8fafc] transition-colors"
                                    aria-label={`Remove ${med.medication_name}`}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Most Common Medications (12 buttons) */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-[#94a3b8] mb-2">
                    Most Common
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {commonMedications.map((med) => {
                        const isSelected = selectedMedications.includes(med.medication_id);
                        return (
                            <button
                                key={med.medication_id}
                                onClick={() => toggleMedication(med.medication_id)}
                                className={`
                                    relative px-4 py-3 rounded-lg font-medium text-sm transition-all
                                    ${isSelected
                                        ? 'bg-[#14b8a6] text-slate-300 border-2 border-[#0d9488] shadow-lg shadow-[#14b8a6]/20'
                                        : 'bg-[#374151] text-slate-300 border border-[#4b5563] hover:bg-[#4b5563] hover:scale-105'
                                    }
                                `}
                                aria-pressed={isSelected}
                            >
                                {isSelected && (
                                    <Check className="absolute top-2 right-2 w-4 h-4 text-slate-300" />
                                )}
                                <div className="font-semibold">{med.medication_name}</div>
                                {med.brand_name && (
                                    <div className="text-xs opacity-70 mt-0.5">({med.brand_name})</div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* More Medications (Expandable Dropdown) */}
            <div className="mb-4">
                <button
                    onClick={() => setShowMoreMedications(!showMoreMedications)}
                    className="flex items-center gap-2 text-[#14b8a6] hover:text-[#0d9488] font-medium transition-colors"
                >
                    {showMoreMedications ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    <span>More Medications</span>
                </button>

                {showMoreMedications && (
                    <div className="mt-3 space-y-2">
                        {Object.entries(medicationsByCategory).map(([category, meds]) => (
                            <div key={category} className="border border-slate-700 rounded-lg overflow-hidden">
                                {/* Category Header */}
                                <button
                                    onClick={() => toggleCategory(category)}
                                    className="w-full flex items-center justify-between px-4 py-2 bg-slate-800 hover:bg-slate-700 transition-colors"
                                >
                                    <span className="text-sm font-medium text-slate-300">{category}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-300">{meds.length} medications</span>
                                        {expandedCategories.includes(category) ? (
                                            <ChevronUp className="w-4 h-4 text-slate-300" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-slate-300" />
                                        )}
                                    </div>
                                </button>

                                {/* Category Medications */}
                                {expandedCategories.includes(category) && (
                                    <div className="p-2 bg-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {meds.map((med) => {
                                            const isSelected = selectedMedications.includes(med.medication_id);
                                            return (
                                                <button
                                                    key={med.medication_id}
                                                    onClick={() => toggleMedication(med.medication_id)}
                                                    className={`
                                                        relative px-3 py-2 rounded text-left text-sm transition-all
                                                        ${isSelected
                                                            ? 'bg-[#14b8a6] text-slate-300'
                                                            : 'bg-[#374151] text-slate-300 hover:bg-[#4b5563]'
                                                        }
                                                    `}
                                                    aria-pressed={isSelected}
                                                >
                                                    {isSelected && (
                                                        <Check className="absolute top-2 right-2 w-3 h-3 text-slate-300" />
                                                    )}
                                                    <div className="font-medium">{med.medication_name}</div>
                                                    {med.brand_name && (
                                                        <div className="text-xs opacity-70">({med.brand_name})</div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Helper Text */}
            <p className="text-sm text-[#64748b] mt-4">
                Select all medications the patient is currently taking. This helps identify potential drug interactions.
            </p>
        </div>
    );
};
