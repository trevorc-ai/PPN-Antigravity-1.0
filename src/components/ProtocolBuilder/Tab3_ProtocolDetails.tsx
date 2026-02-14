import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { AlertCircle, Info } from 'lucide-react';
import { DosageSlider } from './DosageSlider';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';

interface Tab3ProtocolDetailsProps {
    formData: {
        indication_id: number | null;
        substance_id: number | null;
        dosage_mg: number | null;
        dosage_unit: string;
        route_id: number | null;
        session_number: number;
        session_date: string;
        consent_verified: boolean;
    };
    onChange: (field: string, value: any) => void;
    patientWeight?: string;
}

export const Tab3_ProtocolDetails: React.FC<Tab3ProtocolDetailsProps> = ({
    formData,
    onChange,
    patientWeight,
}) => {
    const [indications, setIndications] = useState<any[]>([]);
    const [substances, setSubstances] = useState<any[]>([]);
    const [routes, setRoutes] = useState<any[]>([]);

    useEffect(() => {
        loadReferenceData();
    }, []);

    const loadReferenceData = async () => {
        const [indicationsRes, substancesRes, routesRes] = await Promise.all([
            supabase.from('ref_indications').select('*').order('indication_name'),
            supabase.from('ref_substances').select('*').order('substance_name'),
            supabase.from('ref_routes').select('*').order('route_name'),
        ]);

        if (indicationsRes.data) setIndications(indicationsRes.data);
        if (substancesRes.data) setSubstances(substancesRes.data);
        if (routesRes.data) setRoutes(routesRes.data);
    };

    const getSubstanceName = () => {
        const substance = substances.find(s => s.substance_id === formData.substance_id);
        return substance?.substance_name || '';
    };

    return (
        <div className="space-y-6">
            {/* Primary Indication */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-[#f8fafc]">
                        Primary Indication <span className="text-[#ef4444]">*</span>
                    </label>
                    <AdvancedTooltip
                        content="Clinical definition and diagnostic criteria for this indication. Select the primary condition being treated in this session."
                        tier="standard"
                    >
                        <Info className="w-4 h-4 text-[#94a3b8] hover:text-[#f8fafc] cursor-help transition-colors" />
                    </AdvancedTooltip>
                </div>
                <select
                    value={formData.indication_id || ''}
                    onChange={(e) => onChange('indication_id', parseInt(e.target.value))}
                    className="w-full bg-[#020408] border border-[#1e293b] rounded-lg px-4 py-3 text-[#f8fafc] focus:border-[#14b8a6] focus:outline-none"
                >
                    <option value="">Select indication...</option>
                    {indications.map((ind) => (
                        <option key={ind.indication_id} value={ind.indication_id}>
                            {ind.indication_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Substance */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-[#f8fafc]">
                        Substance <span className="text-[#ef4444]">*</span>
                    </label>
                    <AdvancedTooltip
                        content="Mechanism of action, receptor affinity profile, and pharmacokinetics. Choose the psychedelic substance being administered."
                        tier="standard"
                    >
                        <Info className="w-4 h-4 text-[#94a3b8] hover:text-[#f8fafc] cursor-help transition-colors" />
                    </AdvancedTooltip>
                </div>
                <select
                    value={formData.substance_id || ''}
                    onChange={(e) => onChange('substance_id', parseInt(e.target.value))}
                    className="w-full bg-[#020408] border border-[#1e293b] rounded-lg px-4 py-3 text-[#f8fafc] focus:border-[#14b8a6] focus:outline-none"
                >
                    <option value="">Select substance...</option>
                    {substances.map((sub) => (
                        <option key={sub.substance_id} value={sub.substance_id}>
                            {sub.substance_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Dosage Slider */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <label className="block text-sm font-medium text-[#f8fafc]">
                        Dosage <span className="text-[#ef4444]">*</span>
                    </label>
                    <AdvancedTooltip
                        content="Therapeutic range: 20-30mg. High dose: 31-50mg. Dangerous: 51+mg. Adjust based on patient weight, prior experience, and clinical indication. Contraindications: cardiovascular disease, severe hypertension."
                        tier="standard"
                    >
                        <Info className="w-4 h-4 text-[#94a3b8] hover:text-[#f8fafc] cursor-help transition-colors" />
                    </AdvancedTooltip>
                </div>
                <DosageSlider
                    min={0}
                    max={100}
                    value={formData.dosage_mg || 25}
                    onChange={(value) => onChange('dosage_mg', value)}
                    unit={formData.dosage_unit}
                    substanceName={getSubstanceName()}
                    patientWeight={patientWeight}
                />
            </div>

            {/* Administration Route */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-[#f8fafc]">
                        Administration Route <span className="text-[#ef4444]">*</span>
                    </label>
                    <AdvancedTooltip
                        content="Onset time: 30-60min (oral). Peak: 2-3hrs. Duration: 4-6hrs. Bioavailability: 50-60% (oral). Choose route based on clinical protocol and patient preference."
                        tier="standard"
                    >
                        <Info className="w-4 h-4 text-[#94a3b8] hover:text-[#f8fafc] cursor-help transition-colors" />
                    </AdvancedTooltip>
                </div>
                <select
                    value={formData.route_id || ''}
                    onChange={(e) => onChange('route_id', parseInt(e.target.value))}
                    className="w-full bg-[#020408] border border-[#1e293b] rounded-lg px-4 py-3 text-[#f8fafc] focus:border-[#14b8a6] focus:outline-none"
                >
                    <option value="">Select route...</option>
                    {routes.map((route) => (
                        <option key={route.route_id} value={route.route_id}>
                            {route.route_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Session Number (Read-only Display) */}
            <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-2">
                    Session Number
                </label>
                <div className="bg-[#0f1218] border border-[#1e293b] rounded-lg px-4 py-3">
                    <span className="text-2xl font-bold text-[#f8fafc]">{formData.session_number}</span>
                    <span className="text-sm text-[#94a3b8] ml-2">(Auto-calculated)</span>
                </div>
            </div>

            {/* Consent Verification */}
            <div className="bg-[#0f1218] border border-[#1e293b] rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.consent_verified}
                        onChange={(e) => onChange('consent_verified', e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-[#1e293b] text-[#14b8a6] focus:ring-[#14b8a6] focus:ring-offset-0 bg-[#020408]"
                    />
                    <div>
                        <p className="text-sm font-medium text-[#f8fafc]">
                            I verify that informed consent has been obtained and is on file.
                        </p>
                        <p className="text-xs text-[#94a3b8] mt-1">
                            Required by IRB protocol
                        </p>
                    </div>
                </label>
            </div>
        </div>
    );
};
