import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

interface DosageCalculatorProps {
    sessionId: string;
    /** Synthetic Subject_ID (e.g. "XK7P2M") — never a real patient name */
    patientId: string;
    /** Patient body weight in kg — used for mg/kg calculation */
    patientWeightKg: number;
    onConfirm?: () => void;
}

interface Substance {
    id: number;
    name: string;
    default_potency_factor: number;
    safety_tier: string;
}

export const DosageCalculator: React.FC<DosageCalculatorProps> = ({
    sessionId,
    patientId,
    patientWeightKg,
    onConfirm,
}) => {
    const [substances, setSubstances] = useState<Substance[]>([]);
    const [selectedSubstanceId, setSelectedSubstanceId] = useState<number | null>(null);
    const [weightGrams, setWeightGrams] = useState<string>('');
    const [potencyModifier, setPotencyModifier] = useState<number>(1.0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch substances on mount
    useEffect(() => {
        const fetchSubstances = async () => {
            try {
                const { data, error } = await supabase
                    .from('ref_substances')
                    .select('*')
                    .order('substance_name');

                if (error) throw error;
                setSubstances(data || []);
            } catch (err) {
                console.error('Error fetching substances:', err);
                setError('Failed to load substances. Please try again.');
            }
        };

        fetchSubstances();
    }, []);

    // Calculate effective dose
    const selectedSubstance = substances.find(s => s.id === selectedSubstanceId);
    const weight = parseFloat(weightGrams) || 0;
    const effectiveDoseMg = weight * 1000 * potencyModifier * (selectedSubstance?.default_potency_factor || 1);
    const showWarning = effectiveDoseMg > 5000; // 5g = 5000mg

    const handleConfirm = async () => {
        if (!selectedSubstanceId || weight <= 0) {
            setError('Please select a substance and enter a valid weight.');
            return;
        }
        if (!patientId || patientWeightKg <= 0) {
            setError('Patient ID and weight required to log dose. Contact your session coordinator.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Determine event_type: first row for this session_id = 'initial', subsequent = 'booster'
            const { count } = await supabase
                .from('log_dose_events')
                .select('id', { count: 'exact', head: true })
                .eq('session_id', sessionId);

            const eventType = (count ?? 0) === 0 ? 'initial' : 'booster';

            // Fetch cumulative totals for this session so far
            const { data: priorEvents } = await supabase
                .from('log_dose_events')
                .select('dose_mg')
                .eq('session_id', sessionId);

            const priorCumulativeMg = (priorEvents ?? []).reduce(
                (sum, row) => sum + (row.dose_mg ?? 0),
                0
            );
            const cumulativeMg = priorCumulativeMg + effectiveDoseMg;

            const { error: insertError } = await supabase
                .from('log_dose_events')
                .insert({
                    session_id: sessionId,
                    patient_id: patientId,          // synthetic Subject_ID — never PII
                    substance_id: selectedSubstanceId,
                    dose_mg: effectiveDoseMg,
                    weight_kg: patientWeightKg,
                    dose_mg_per_kg: effectiveDoseMg / patientWeightKg,
                    cumulative_mg: cumulativeMg,
                    cumulative_mg_per_kg: cumulativeMg / patientWeightKg,
                    event_type: eventType,
                    administered_at: new Date().toISOString(),
                });

            if (insertError) throw insertError;

            // Reset form on success
            setSelectedSubstanceId(null);
            setWeightGrams('');
            setPotencyModifier(1.0);

            if (onConfirm) onConfirm();
        } catch (err) {
            console.error('[DosageCalculator] Error persisting to log_dose_events:', err);
            setError('Failed to save dose. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            backgroundColor: '#000000',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            <h2 style={{ color: '#f1f5f9', marginBottom: '24px', fontSize: '24px' }}>
                Substance Calibration
            </h2>

            {/* Substance Dropdown */}
            <div style={{ marginBottom: '20px' }}>
                <label
                    htmlFor="substance-select"
                    style={{
                        display: 'block',
                        color: '#f1f5f9',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    Substance
                </label>
                <select
                    id="substance-select"
                    value={selectedSubstanceId || ''}
                    onChange={(e) => setSelectedSubstanceId(Number(e.target.value))}
                    style={{
                        width: '100%',
                        minHeight: '44px',
                        padding: '12px',
                        backgroundColor: '#1a1a1a',
                        color: '#f1f5f9',
                        border: '1px solid #2a2a2a',
                        borderRadius: '4px',
                        fontSize: '16px'
                    }}
                >
                    <option value="">Select a substance...</option>
                    {substances.map(substance => (
                        <option key={substance.id} value={substance.id}>
                            {substance.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Weight Input */}
            <div style={{ marginBottom: '20px' }}>
                <label
                    htmlFor="weight-input"
                    style={{
                        display: 'block',
                        color: '#f1f5f9',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    Weight (grams)
                </label>
                <input
                    id="weight-input"
                    type="text" inputMode="numeric" pattern="[0-9]*\.\?[0-9]*"
                    min="0"
                    step="0.01"
                    value={weightGrams}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || parseFloat(value) >= 0) {
                            setWeightGrams(value);
                        }
                    }}
                    style={{
                        width: '100%',
                        minHeight: '44px',
                        padding: '12px',
                        backgroundColor: '#1a1a1a',
                        color: '#f1f5f9',
                        border: '1px solid #2a2a2a',
                        borderRadius: '4px',
                        fontSize: '16px'
                    }}
                    placeholder="0.00"
                />
            </div>

            {/* Potency Slider */}
            <div style={{ marginBottom: '20px' }}>
                <label
                    htmlFor="potency-slider"
                    style={{
                        display: 'block',
                        color: '#f1f5f9',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    Potency Modifier: {potencyModifier.toFixed(1)}x
                </label>
                <input
                    id="potency-slider"
                    type="range"
                    min="0.5"
                    max="3.0"
                    step="0.1"
                    value={potencyModifier}
                    onChange={(e) => setPotencyModifier(parseFloat(e.target.value))}
                    style={{
                        width: '100%',
                        minHeight: '44px',
                        accentColor: '#3b82f6'
                    }}
                />
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#94a3b8',
                    fontSize: '12px',
                    marginTop: '4px'
                }}>
                    <span>0.5x</span>
                    <span>1.0x</span>
                    <span>3.0x</span>
                </div>
            </div>

            {/* Effective Dose Display */}
            <div style={{
                backgroundColor: '#1a1a1a',
                padding: '16px',
                borderRadius: '4px',
                marginBottom: '20px',
                border: '1px solid #2a2a2a'
            }}>
                <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>
                    EFFECTIVE DOSE
                </div>
                <div style={{ color: '#f1f5f9', fontSize: '28px', fontWeight: 'bold' }}>
                    {effectiveDoseMg.toFixed(2)} mg
                </div>
            </div>

            {/* High Dose Warning */}
            {showWarning && (
                <div style={{
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    padding: '16px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    fontWeight: '600',
                    fontSize: '14px'
                }}>
                    ⚠️ HIGH DOSE WARNING: Effective dose exceeds 5g
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div style={{
                    backgroundColor: '#7f1d1d',
                    color: '#fecaca',
                    padding: '12px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    fontSize: '14px'
                }}>
                    {error}
                </div>
            )}

            {/* Confirm Button */}
            <button
                onClick={handleConfirm}
                disabled={loading || !selectedSubstanceId || weight <= 0}
                style={{
                    width: '100%',
                    minHeight: '44px',
                    padding: '12px',
                    backgroundColor: loading || !selectedSubstanceId || weight <= 0 ? '#2a2a2a' : '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading || !selectedSubstanceId || weight <= 0 ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s'
                }}
            >
                {loading ? 'Saving...' : 'Confirm Dosage'}
            </button>
        </div>
    );
};
