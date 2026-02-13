import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface Tab2MedicationsProps {
    selectedMedications: number[];
    onChange: (medications: number[]) => void;
}

export const Tab2_Medications: React.FC<Tab2MedicationsProps> = ({
    selectedMedications,
    onChange,
}) => {
    const [medications, setMedications] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMedications, setFilteredMedications] = useState<any[]>([]);

    useEffect(() => {
        loadMedications();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = medications.filter((med) =>
                med.medication_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredMedications(filtered.slice(0, 20));
        } else {
            setFilteredMedications([]);
        }
    }, [searchTerm, medications]);

    const loadMedications = async () => {
        const { data } = await supabase
            .from('ref_medications')
            .select('*')
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

    const getSelectedMedicationNames = () => {
        return medications.filter((med) => selectedMedications.includes(med.medication_id));
    };

    return (
        <div>
            <div className="mb-6">
                <label className="block text-sm font-medium text-[#f8fafc] mb-3">
                    Concomitant Medications
                </label>

                {/* Search Dropdown */}
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search medications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#020408] border border-[#1e293b] rounded-lg px-4 py-3 text-[#f8fafc] focus:border-[#14b8a6] focus:outline-none"
                    />

                    {/* Dropdown Results */}
                    {filteredMedications.length > 0 && (
                        <div className="absolute z-10 w-full mt-2 bg-[#0f1218] border border-[#1e293b] rounded-lg max-h-60 overflow-y-auto">
                            {filteredMedications.map((med) => (
                                <button
                                    key={med.medication_id}
                                    onClick={() => {
                                        toggleMedication(med.medication_id);
                                        setSearchTerm('');
                                    }}
                                    className="w-full text-left px-4 py-2.5 hover:bg-[#14b8a6]/10 text-[#f8fafc] transition-colors"
                                >
                                    {med.medication_name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Selected Medications Pills */}
                {selectedMedications.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {getSelectedMedicationNames().map((med) => (
                            <div
                                key={med.medication_id}
                                className="bg-[#14b8a6]/20 border border-[#14b8a6]/30 rounded-full px-4 py-2 flex items-center gap-2"
                            >
                                <span className="text-sm text-[#14b8a6] font-medium">
                                    {med.medication_name}
                                </span>
                                <button
                                    onClick={() => toggleMedication(med.medication_id)}
                                    className="text-[#14b8a6] hover:text-[#10b981] transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Common Medications Grid (Phase 2) */}
                <div className="mt-6">
                    <p className="text-sm text-[#94a3b8] mb-3">Or select from common medications:</p>
                    <div className="bg-[#020408]/50 border border-[#1e293b] rounded-lg p-4 text-center">
                        <p className="text-sm text-[#94a3b8]">
                            Common medications grid coming in Phase 2
                        </p>
                    </div>
                </div>
            </div>

            {/* Drug Interaction Alerts Placeholder */}
            {selectedMedications.length > 0 && (
                <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg p-4">
                    <p className="text-sm text-[#f59e0b] font-medium mb-2">
                        ⚠️ Drug Interaction Alerts
                    </p>
                    <p className="text-xs text-[#94a3b8]">
                        Drug interaction detection coming in Phase 2
                    </p>
                </div>
            )}
        </div>
    );
};
