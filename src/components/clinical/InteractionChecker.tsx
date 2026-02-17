import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';
import { tooltips } from '../../content/tooltips';

interface Interaction {
    substance_id: number;
    medication_id: number;
    interaction_severity: 'SEVERE' | 'MODERATE' | 'MILD';
    risk_description: string;
    clinical_recommendation: string;
    mechanism: string;
    pubmed_reference?: string;
    substance_name?: string;
    medication_name?: string;
}

interface InteractionCheckerProps {
    substanceId: number | null;
    medicationIds: number[];
    onInteractionFound?: (interactions: Interaction[]) => void;
    onAcknowledgmentChange?: (acknowledged: boolean) => void;
}

export const InteractionChecker: React.FC<InteractionCheckerProps> = ({
    substanceId,
    medicationIds,
    onInteractionFound,
    onAcknowledgmentChange
}) => {
    const [interactions, setInteractions] = useState<Interaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [acknowledged, setAcknowledged] = useState(false);

    useEffect(() => {
        const checkInteractions = async () => {
            if (!substanceId || medicationIds.length === 0) {
                setInteractions([]);
                setAcknowledged(false);
                return;
            }

            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('ref_drug_interactions')
                    .select(`
            *,
            substance:ref_substances!substance_id(substance_name),
            medication:ref_medications!medication_id(medication_name)
          `)
                    .eq('substance_id', substanceId)
                    .in('medication_id', medicationIds);

                if (error) throw error;

                const enrichedData = (data || []).map(interaction => ({
                    ...interaction,
                    substance_name: interaction.substance?.substance_name,
                    medication_name: interaction.medication?.medication_name
                }));

                setInteractions(enrichedData);
                onInteractionFound?.(enrichedData);

                // Reset acknowledgment when interactions change
                setAcknowledged(false);
            } catch (error) {
                console.error('Error checking interactions:', error);
            } finally {
                setLoading(false);
            }
        };

        checkInteractions();
    }, [substanceId, medicationIds, onInteractionFound]);

    if (loading) {
        return (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-400">
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Checking for drug interactions...</span>
                </div>
            </div>
        );
    }

    if (interactions.length === 0) {
        return null;
    }

    const severeInteractions = interactions.filter(i => i.interaction_severity === 'SEVERE');
    const moderateInteractions = interactions.filter(i => i.interaction_severity === 'MODERATE');
    const mildInteractions = interactions.filter(i => i.interaction_severity === 'MILD');

    // Handle acknowledgment change
    const handleAcknowledgmentChange = (checked: boolean) => {
        setAcknowledged(checked);
        onAcknowledgmentChange?.(checked);
    };

    return (
        <div className="space-y-3" role="alert" aria-live="assertive">
            {/* Medical Disclaimer */}
            <div className="bg-amber-500/10 border-l-4 border-amber-500 rounded-lg p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-400 text-xl flex-shrink-0" aria-hidden="true">
                    warning
                </span>
                <div>
                    <p className="text-xs font-black text-amber-400 uppercase tracking-widest mb-1">
                        Medical Disclaimer
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        This is for informational purposes only. For medical advice or diagnosis, consult a professional.
                    </p>
                </div>
            </div>

            {/* Severe Interactions */}
            {severeInteractions.map((interaction, index) => (
                <div
                    key={`severe-${index}`}
                    className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4"
                >
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <AdvancedTooltip content={tooltips.safetyShield.severityScore}>
                                    <span className="text-xs font-black text-red-500 uppercase tracking-wider">
                                        Contraindicated
                                    </span>
                                </AdvancedTooltip>
                                <span className="text-sm text-slate-300">
                                    {interaction.substance_name} + {interaction.medication_name}
                                </span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                <strong>Risk:</strong> {interaction.risk_description}
                            </p>
                            <AdvancedTooltip content={tooltips.safetyShield.mechanism}>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    <strong>Mechanism:</strong> {interaction.mechanism}
                                </p>
                            </AdvancedTooltip>
                            <p className="text-sm text-red-400 font-medium leading-relaxed">
                                <strong>Recommendation:</strong> {interaction.clinical_recommendation}
                            </p>
                            {interaction.pubmed_reference && (
                                <a
                                    href={interaction.pubmed_reference}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-400 hover:text-blue-300 underline"
                                >
                                    View Research →
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Safety Acknowledgment for SEVERE Interactions */}
            {severeInteractions.length > 0 && (
                <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4 mt-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={acknowledged}
                            onChange={(e) => handleAcknowledgmentChange(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded border-red-500 text-red-500 focus:ring-red-500 focus:ring-offset-0 focus:ring-2 bg-slate-900 cursor-pointer"
                            aria-required="true"
                            aria-label="Acknowledge contraindication risks"
                        />
                        <span className="text-sm text-slate-300 leading-relaxed">
                            <strong className="text-red-400">I understand the risks</strong> and choose to proceed with this protocol despite the contraindication(s) listed above.
                        </span>
                    </label>
                </div>
            )}

            {/* Moderate Interactions */}
            {moderateInteractions.map((interaction, index) => (
                <div
                    key={`moderate-${index}`}
                    className="bg-yellow-500/10 border-2 border-yellow-500 rounded-lg p-4"
                >
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <AdvancedTooltip content={tooltips.safetyShield.severityScore}>
                                    <span className="text-xs font-black text-yellow-500 uppercase tracking-wider">
                                        Caution
                                    </span>
                                </AdvancedTooltip>
                                <span className="text-sm text-slate-300">
                                    {interaction.substance_name} + {interaction.medication_name}
                                </span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                <strong>Risk:</strong> {interaction.risk_description}
                            </p>
                            <AdvancedTooltip content={tooltips.safetyShield.mechanism}>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    <strong>Mechanism:</strong> {interaction.mechanism}
                                </p>
                            </AdvancedTooltip>
                            <p className="text-sm text-yellow-400 font-medium leading-relaxed">
                                <strong>Recommendation:</strong> {interaction.clinical_recommendation}
                            </p>
                            {interaction.pubmed_reference && (
                                <a
                                    href={interaction.pubmed_reference}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-400 hover:text-blue-300 underline"
                                >
                                    View Research →
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Mild Interactions */}
            {mildInteractions.map((interaction, index) => (
                <div
                    key={`mild-${index}`}
                    className="bg-blue-500/10 border border-blue-500 rounded-lg p-4"
                >
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-blue-500 uppercase tracking-wider">
                                    Monitor
                                </span>
                                <span className="text-sm text-slate-300">
                                    {interaction.substance_name} + {interaction.medication_name}
                                </span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                <strong>Risk:</strong> {interaction.risk_description}
                            </p>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                <strong>Mechanism:</strong> {interaction.mechanism}
                            </p>
                            <p className="text-sm text-blue-400 font-medium leading-relaxed">
                                <strong>Recommendation:</strong> {interaction.clinical_recommendation}
                            </p>
                            {interaction.pubmed_reference && (
                                <a
                                    href={interaction.pubmed_reference}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-400 hover:text-blue-300 underline"
                                >
                                    View Research →
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
