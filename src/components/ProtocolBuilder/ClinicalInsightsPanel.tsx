import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { BarChart3, Activity, AlertTriangle, Users, Gauge, FileText } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, RadialBarChart, RadialBar } from 'recharts';

interface ClinicalInsightsPanelProps {
    isVisible: boolean;
    substanceId: number | null;
    medicationIds: number[];
    indicationId: number | null;
    patientAge: string;
    patientSex: string;
    patientWeight: string;
    dosageMg: number | null;
}

interface ReceptorData {
    receptor: string;
    affinity: number;
}

interface DrugInteraction {
    id: number;
    interaction_severity: 'SEVERE' | 'MODERATE' | 'MILD';
    risk_description: string;
    clinical_recommendation: string;
    medication: { medication_name: string };
}

interface OutcomesData {
    remission_rate: number;
    response_rate: number;
    unique_patients: number;
    confidence_level: number;
}

export const ClinicalInsightsPanel: React.FC<ClinicalInsightsPanelProps> = ({
    isVisible,
    substanceId,
    medicationIds,
    indicationId,
    patientAge,
    patientSex,
    patientWeight,
    dosageMg,
}) => {
    const [receptorData, setReceptorData] = useState<ReceptorData[]>([]);
    const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
    const [outcomesData, setOutcomesData] = useState<OutcomesData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isVisible || !substanceId) return;

        const fetchData = async () => {
            setLoading(true);

            // 1. Fetch Receptor Affinity Data
            const { data: substance } = await supabase
                .from('ref_substances')
                .select('receptor_5ht2a_ki, receptor_5ht1a_ki, receptor_5ht2c_ki, receptor_d2_ki, receptor_sert_ki, receptor_nmda_ki, primary_mechanism')
                .eq('substance_id', substanceId)
                .single();

            if (substance) {
                const radarData: ReceptorData[] = [
                    { receptor: '5-HT2A', affinity: substance.receptor_5ht2a_ki ? (1 / substance.receptor_5ht2a_ki) * 1000 : 0 },
                    { receptor: '5-HT1A', affinity: substance.receptor_5ht1a_ki ? (1 / substance.receptor_5ht1a_ki) * 1000 : 0 },
                    { receptor: '5-HT2C', affinity: substance.receptor_5ht2c_ki ? (1 / substance.receptor_5ht2c_ki) * 1000 : 0 },
                    { receptor: 'D2', affinity: substance.receptor_d2_ki ? (1 / substance.receptor_d2_ki) * 1000 : 0 },
                    { receptor: 'SERT', affinity: substance.receptor_sert_ki ? (1 / substance.receptor_sert_ki) * 1000 : 0 },
                    { receptor: 'NMDA', affinity: substance.receptor_nmda_ki ? (1 / substance.receptor_nmda_ki) * 1000 : 0 },
                ];
                setReceptorData(radarData);
            }

            // 2. Fetch Drug Interactions
            if (medicationIds.length > 0) {
                const { data: interactionsData } = await supabase
                    .from('ref_drug_interactions')
                    .select('*, medication:ref_medications(medication_name)')
                    .eq('substance_id', substanceId)
                    .in('medication_id', medicationIds)
                    .eq('is_active', true);

                if (interactionsData) {
                    setInteractions(interactionsData as DrugInteraction[]);
                }
            }

            // 3. Fetch Expected Outcomes
            if (indicationId && patientAge && patientSex && patientWeight) {
                const { data: outcomes } = await supabase
                    .from('mv_outcomes_summary')
                    .select('*')
                    .eq('indication_id', indicationId)
                    .eq('substance_id', substanceId)
                    .eq('age_range', patientAge)
                    .eq('biological_sex', patientSex)
                    .eq('weight_range', patientWeight)
                    .single();

                if (outcomes) {
                    setOutcomesData(outcomes);
                }
            }

            setLoading(false);
        };

        fetchData();
    }, [isVisible, substanceId, medicationIds, indicationId, patientAge, patientSex, patientWeight]);

    if (!isVisible) {
        return (
            <div className="bg-[#0f1218] border border-[#1e293b] rounded-xl p-8 text-center">
                <Activity className="w-12 h-12 text-[#94a3b8] mx-auto mb-4" />
                <p className="text-[#94a3b8]">
                    Complete patient information and protocol details to view clinical insights
                </p>
            </div>
        );
    }

    const severityColors = {
        SEVERE: '#ef4444',
        MODERATE: '#f59e0b',
        MILD: '#eab308',
    };

    const severityIcons = {
        SEVERE: '🔴',
        MODERATE: '🟡',
        MILD: '🟢',
    };

    return (
        <div className="bg-[#0a1628]/90 backdrop-blur-sm border-2 border-[#1e293b]/50 rounded-2xl p-8 shadow-2xl shadow-black/20 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <Activity className="w-7 h-7 text-[#14b8a6]" />
                <h3 className="text-2xl font-black bg-gradient-to-r from-[#f8fafc] to-[#cbd5e1] bg-clip-text text-transparent">
                    Clinical Insights
                </h3>
            </div>

            {loading ? (
                <div className="text-center py-8">
                    <Activity className="w-8 h-8 text-[#14b8a6] mx-auto mb-2 animate-spin" />
                    <p className="text-sm text-[#94a3b8]">Loading insights...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Section 1: Receptor Affinity Profile */}
                    {receptorData.length > 0 && (
                        <div className="bg-[#020408] border border-[#1e293b] rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Activity className="w-5 h-5 text-[#14b8a6]" />
                                <h4 className="font-medium text-[#f8fafc]">Receptor Affinity Profile</h4>
                            </div>
                            <ResponsiveContainer width="100%" height={200}>
                                <RadarChart data={receptorData}>
                                    <PolarGrid stroke="#1e293b" />
                                    <PolarAngleAxis dataKey="receptor" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                    <Radar name="Affinity" dataKey="affinity" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.3} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Section 2: Expected Outcomes */}
                    {outcomesData && (
                        <div className="bg-[#020408] border border-[#1e293b] rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <BarChart3 className="w-5 h-5 text-[#14b8a6]" />
                                <h4 className="font-medium text-[#f8fafc]">Expected Outcomes</h4>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-[#94a3b8]">Remission Rate</span>
                                        <span className="text-[#14b8a6] font-semibold">{(outcomesData.remission_rate * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-[#1e293b] rounded-full h-2">
                                        <div className="bg-[#14b8a6] h-2 rounded-full" style={{ width: `${outcomesData.remission_rate * 100}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-[#94a3b8]">Response Rate</span>
                                        <span className="text-[#10b981] font-semibold">{(outcomesData.response_rate * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-[#1e293b] rounded-full h-2">
                                        <div className="bg-[#10b981] h-2 rounded-full" style={{ width: `${outcomesData.response_rate * 100}%` }}></div>
                                    </div>
                                </div>
                                <p className="text-sm text-[#64748b] mt-2">
                                    Based on {outcomesData.unique_patients} similar patients ({(outcomesData.confidence_level * 100).toFixed(0)}% confidence)
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Section 3: Drug Interactions */}
                    <div className="bg-[#020408] border border-[#1e293b] rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />
                            <h4 className="font-medium text-[#f8fafc]">Drug Interactions</h4>
                        </div>
                        {interactions.length > 0 ? (
                            <div className="space-y-2">
                                {interactions.map((interaction) => (
                                    <div key={interaction.id} className="border border-[#1e293b] rounded p-2">
                                        <div className="flex items-start gap-2">
                                            <span className="text-lg">{severityIcons[interaction.interaction_severity]}</span>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-[#f8fafc]">{interaction.medication.medication_name}</p>
                                                <p className="text-sm text-[#94a3b8] mt-1">{interaction.risk_description}</p>
                                                <p className="text-sm text-[#14b8a6] mt-1">→ {interaction.clinical_recommendation}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-[#94a3b8]">No known interactions with selected medications</p>
                        )}
                    </div>

                    {/* Section 4: Genomic Safety (Placeholder) */}
                    <div className="bg-[#020408] border border-[#1e293b] rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Gauge className="w-5 h-5 text-[#14b8a6]" />
                            <h4 className="font-medium text-[#f8fafc]">Genomic Safety</h4>
                        </div>
                        <p className="text-sm text-[#94a3b8]">
                            Genetic screening data not available. Recommend CYP2D6 testing for personalized dosing.
                        </p>
                    </div>

                    {/* Section 5: Therapeutic Envelope */}
                    {dosageMg && patientWeight && (
                        <div className="bg-[#020408] border border-[#1e293b] rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-5 h-5 text-[#14b8a6]" />
                                <h4 className="font-medium text-[#f8fafc]">Therapeutic Envelope</h4>
                            </div>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[#94a3b8]">Current Dosage:</span>
                                    <span className="text-[#14b8a6] font-semibold">{dosageMg}mg</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#94a3b8]">Therapeutic Range:</span>
                                    <span className="text-[#f8fafc]">20-30mg</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#94a3b8]">Patient Weight:</span>
                                    <span className="text-[#f8fafc]">{patientWeight}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 6: Cohort Matches */}
                    {outcomesData && (
                        <div className="bg-[#020408] border border-[#1e293b] rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="w-5 h-5 text-[#14b8a6]" />
                                <h4 className="font-medium text-[#f8fafc]">Similar Patients</h4>
                            </div>
                            <p className="text-sm text-[#f8fafc] mb-2">
                                <span className="text-[#14b8a6] font-semibold">{outcomesData.unique_patients}</span> patients with similar profile
                            </p>
                            <div className="text-xs text-[#94a3b8] space-y-1">
                                <div>Age: {patientAge}</div>
                                <div>Sex: {patientSex}</div>
                                <div>Weight: {patientWeight}</div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
