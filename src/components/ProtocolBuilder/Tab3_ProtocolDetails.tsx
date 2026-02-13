import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { AlertCircle } from 'lucide-react';

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
    const [dosageWarning, setDosageWarning] = useState<string | null>(null);

    useEffect(() => {
        loadReferenceData();
    }, []);

    useEffect(() => {
        checkDosageRange();
    }, [formData.dosage_mg, patientWeight]);

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

    const checkDosageRange = () => {
        if (!formData.dosage_mg || !patientWeight) {
            setDosageWarning(null);
            return;
        }

        const weightRanges: Record<string, { min: number; max: number }> = {
            '40-50kg': { min: 15, max: 20 },
            '51-60kg': { min: 18, max: 25 },
            '61-70kg': { min: 20, max: 28 },
            '71-80kg': { min: 20, max: 30 },
            '81-90kg': { min: 25, max: 35 },
            '91-100kg': { min: 28, max: 40 },
            '101+kg': { min: 30, max: 45 },
        };

        const range = weightRanges[patientWeight];
        if (range) {
            if (formData.dosage_mg < range.min || formData.dosage_mg > range.max) {
                setDosageWarning(
                    `Dosage outside safe range (${range.min}-${range.max}mg) for ${patientWeight}. Please verify.`
                );
            } else {
                setDosageWarning(null);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Primary Indication */}
            <div>
                <label className="block text-sm font-medium text-[#f8fafc] mb-2">
                    Primary Indication <span className="text-[#ef4444]">*</span>
                </label>
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
                <label className="block text-sm font-medium text-[#f8fafc] mb-2">
                    Substance <span className="text-[#ef4444]">*</span>
                </label>
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

            {/* Dosage */}
            <div>
                <label className="block text-sm font-medium text-[#f8fafc] mb-2">
                    Dosage <span className="text-[#ef4444]">*</span>
                </label>
                <div className="flex gap-3">
                    <input
                        type="number"
                        value={formData.dosage_mg || ''}
                        onChange={(e) => onChange('dosage_mg', parseFloat(e.target.value))}
                        placeholder="25"
                        className="flex-1 bg-[#020408] border border-[#1e293b] rounded-lg px-4 py-3 text-[#f8fafc] focus:border-[#14b8a6] focus:outline-none"
                    />
                    <select
                        value={formData.dosage_unit}
                        onChange={(e) => onChange('dosage_unit', e.target.value)}
                        className="w-24 bg-[#020408] border border-[#1e293b] rounded-lg px-4 py-3 text-[#f8fafc] focus:border-[#14b8a6] focus:outline-none"
                    >
                        <option value="mg">mg</option>
                        <option value="μg">μg</option>
                        <option value="mL">mL</option>
                    </select>
                </div>

                {dosageWarning && (
                    <div className="mt-2 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg p-3 flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-[#f59e0b]">{dosageWarning}</p>
                    </div>
                )}
            </div>

            {/* Administration Route */}
            <div>
                <label className="block text-sm font-medium text-[#f8fafc] mb-2">
                    Administration Route <span className="text-[#ef4444]">*</span>
                </label>
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

            {/* Session Number */}
            <div>
                <label className="block text-sm font-medium text-[#f8fafc] mb-2">
                    Session Number
                </label>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onChange('session_number', Math.max(1, formData.session_number - 1))}
                        className="w-10 h-10 bg-[#020408] border border-[#1e293b] rounded-lg text-[#f8fafc] hover:border-[#14b8a6] transition-colors"
                    >
                        −
                    </button>
                    <input
                        type="number"
                        value={formData.session_number}
                        onChange={(e) => onChange('session_number', parseInt(e.target.value) || 1)}
                        className="w-20 bg-[#020408] border border-[#1e293b] rounded-lg px-4 py-2 text-center text-[#f8fafc] focus:border-[#14b8a6] focus:outline-none"
                    />
                    <button
                        onClick={() => onChange('session_number', formData.session_number + 1)}
                        className="w-10 h-10 bg-[#020408] border border-[#1e293b] rounded-lg text-[#f8fafc] hover:border-[#14b8a6] transition-colors"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Session Date */}
            <div>
                <label className="block text-sm font-medium text-[#f8fafc] mb-2">
                    Session Date <span className="text-[#ef4444]">*</span>
                </label>
                <div className="flex gap-3">
                    <input
                        type="date"
                        value={formData.session_date}
                        onChange={(e) => onChange('session_date', e.target.value)}
                        className="flex-1 bg-[#020408] border border-[#1e293b] rounded-lg px-4 py-3 text-[#f8fafc] focus:border-[#14b8a6] focus:outline-none"
                    />
                    <button
                        onClick={() => onChange('session_date', new Date().toISOString().split('T')[0])}
                        className="px-4 py-3 bg-[#020408] border border-[#1e293b] rounded-lg text-[#94a3b8] hover:text-[#f8fafc] hover:border-[#14b8a6] transition-colors"
                    >
                        Today
                    </button>
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
