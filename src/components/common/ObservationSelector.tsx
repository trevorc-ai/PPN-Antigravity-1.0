import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface ObservationSelectorProps {
    category: 'baseline' | 'session' | 'integration' | 'safety';
    selectedIds: number[];
    onChange: (ids: number[]) => void;
    onRequestNew: () => void;
    label?: string;
    className?: string;
}

interface ClinicalObservation {
    observation_id: number;
    observation_code: string;
    observation_text: string;
    category: string;
}

/**
 * ObservationSelector Component
 * 
 * Allows users to select from predefined clinical observations
 * instead of entering free-text notes (PHI risk elimination)
 * 
 * Part of WO_042 PHI compliance fixes
 */
export const ObservationSelector: React.FC<ObservationSelectorProps> = ({
    category,
    selectedIds,
    onChange,
    onRequestNew,
    label = 'Clinical Observations',
    className = ''
}) => {
    const [observations, setObservations] = useState<ClinicalObservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchObservations();
    }, [category]);

    const fetchObservations = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('ref_clinical_observations')
                .select('*')
                .eq('category', category)
                .eq('is_active', true)
                .order('observation_text');

            // Table may not exist yet — treat as empty, not an error
            if (error) {
                console.warn('[ObservationSelector] ref_clinical_observations not available:', error.message);
                setObservations([]);
            } else {
                setObservations(data || []);
            }
        } catch (err) {
            console.error('Error fetching observations:', err);
            setObservations([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleObservation = (id: number) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter(i => i !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    if (loading) {
        return (
            <div className={`space-y-4 ${className}`}>
                <label className="text-slate-300 text-sm font-medium">{label}</label>
                <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                    <p className="text-slate-300 text-sm">Loading observations...</p>
                </div>
            </div>
        );
    }


    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <label className="text-slate-300 text-sm font-medium">
                    {label}
                </label>
                <button
                    onClick={onRequestNew}
                    className="text-emerald-400 text-sm hover:text-emerald-300 flex items-center gap-1 transition-colors"
                >
                    <Plus className="w-3 h-3" />
                    Request New Option
                </button>
            </div>

            {/* Observation List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
                {observations.length === 0 ? (
                    <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                        <p className="text-slate-300 text-sm">No observations available for this category.</p>
                    </div>
                ) : (
                    observations.map(obs => (
                        <label
                            key={obs.observation_id}
                            className="flex items-start gap-3 p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors group"
                        >
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(obs.observation_id)}
                                onChange={() => toggleObservation(obs.observation_id)}
                                className="mt-0.5 w-4 h-4 text-emerald-500 bg-slate-700 border-slate-600 rounded"
                            />
                            <span className="text-slate-300 text-sm flex-1 group-hover:text-slate-300 transition-colors">
                                {obs.observation_text}
                            </span>
                        </label>
                    ))
                )}
            </div>

            {/* Selection Summary */}
            {selectedIds.length > 0 && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <p className="text-emerald-300 text-sm font-medium">
                        ✓ {selectedIds.length} observation{selectedIds.length !== 1 ? 's' : ''} selected
                    </p>
                </div>
            )}
        </div>
    );
};

export default ObservationSelector;
