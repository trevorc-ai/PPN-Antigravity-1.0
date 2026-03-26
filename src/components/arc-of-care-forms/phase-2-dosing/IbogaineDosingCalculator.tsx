import React, { useState, useCallback } from 'react';
import { AlertTriangle, Plus, Trash2, Calculator } from 'lucide-react';
import { FormField } from '../shared/FormField';
import { NumberInput } from '../shared/NumberInput';
import { FormFooter } from '../shared/FormFooter';
import { useFormCompletion } from '../../../hooks/useFormCompletion';

/**
 * IbogaineDosingCalculator — WO-671
 *
 * Multi-dose log with real-time cumulative mg/kg running total.
 * For Ibogaine HCL and Total Plant Alkaloid (TPA) sessions.
 *
 * Per Dr. Allen's protocol: Test dose → Dose 2 → Dose 3 (optional supplemental).
 * Incidental IV medications (Metoclopramide, MgCl) log here as secondary entries.
 *
 * Persists to: log_dose_events (migration 085 adds cumulative_mg_kg,
 * session_weight_kg, dose_sequence). substance_type already exists (migration 077).
 */

// ─── Types ───────────────────────────────────────────────────────────────────

/** WO-671 primary substance enum — structured, no free-text */
export type IbogaineSubstanceType = 'ibogaine_hcl' | 'ibogaine_tpa';

/** Incidental / intervention medication enum */
export type IncidentalSubstanceType =
    | 'iv_metoclopramide'
    | 'iv_magnesium_chloride'
    | 'iv_ondansetron'
    | 'po_lorazepam'
    | 'iv_diphenhydramine'
    | 'other_protocol';

export type RouteType = 'oral' | 'sublingual' | 'im' | 'iv';
export type DoseCategory = 'primary' | 'incidental';

export interface DoseRow {
    id: string;
    sequence: number;
    category: DoseCategory;
    ibogaineSubstance: IbogaineSubstanceType | null;
    incidentalSubstance: IncidentalSubstanceType | null;
    doseMg: number | undefined;
    route: RouteType | '';
    timestamp: string;
    /** Cumulative mg/kg at time of this dose (auto-calculated from primary doses only) */
    cumulativeMgKg: number | null;
}

export interface IbogaineDosingData {
    patientWeightKg: number | undefined;
    doses: DoseRow[];
}

interface IbogaineDosingCalculatorProps {
    /** Phase 1 pre-confirmed weight in kg (from intake record). Pre-fills weight field. */
    intakeWeightKg?: number;
    onSave?: (data: IbogaineDosingData) => void;
    initialData?: Partial<IbogaineDosingData>;
    sessionId?: string;
    onComplete?: () => void;
    onBack?: () => void;
}

// ─── Reference data ───────────────────────────────────────────────────────────
const IBOGAINE_SUBSTANCE_OPTIONS: Array<{ value: IbogaineSubstanceType; label: string }> = [
    { value: 'ibogaine_hcl', label: 'Ibogaine HCL' },
    { value: 'ibogaine_tpa', label: 'Ibogaine TPA (Total Plant Alkaloid)' },
];

const INCIDENTAL_OPTIONS: Array<{ value: IncidentalSubstanceType; label: string }> = [
    { value: 'iv_metoclopramide', label: 'IV Metoclopramide (anti-emetic)' },
    { value: 'iv_magnesium_chloride', label: 'IV Magnesium Chloride' },
    { value: 'iv_ondansetron', label: 'IV Ondansetron (anti-emetic)' },
    { value: 'po_lorazepam', label: 'PO Lorazepam (anxiolytic)' },
    { value: 'iv_diphenhydramine', label: 'IV Diphenhydramine (anti-histamine)' },
    { value: 'other_protocol', label: 'Other protocol medication' },
];

const ROUTE_OPTIONS: Array<{ value: RouteType; label: string }> = [
    { value: 'oral', label: 'Oral (PO)' },
    { value: 'sublingual', label: 'Sublingual (SL)' },
    { value: 'im', label: 'Intramuscular (IM)' },
    { value: 'iv', label: 'Intravenous (IV)' },
];

const SEQUENCE_LABELS: Record<number, string> = {
    1: 'Test Dose',
    2: 'Dose 2',
    3: 'Dose 3',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function makeLocalTimestamp(): string {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function nextPrimarySequence(doses: DoseRow[]): number {
    const primaryCount = doses.filter(d => d.category === 'primary').length;
    return primaryCount + 1;
}

/**
 * Recalculates cumulative mg/kg for every primary dose row.
 * Incidental doses do NOT contribute to the Ibogaine mg/kg total.
 */
function recalcCumulativeMgKg(doses: DoseRow[], weightKg: number | undefined): DoseRow[] {
    if (!weightKg || weightKg <= 0) {
        return doses.map(d => ({ ...d, cumulativeMgKg: null }));
    }
    let cumulative = 0;
    return doses.map(dose => {
        if (dose.category !== 'primary' || !dose.doseMg) {
            return { ...dose, cumulativeMgKg: dose.category === 'primary' ? null : dose.cumulativeMgKg };
        }
        cumulative += dose.doseMg;
        return {
            ...dose,
            cumulativeMgKg: parseFloat((cumulative / weightKg).toFixed(2)),
        };
    });
}

function makePrimaryDose(sequence: number): DoseRow {
    return {
        id: `dose-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        sequence,
        category: 'primary',
        ibogaineSubstance: 'ibogaine_hcl',
        incidentalSubstance: null,
        doseMg: undefined,
        route: 'oral',
        timestamp: makeLocalTimestamp(),
        cumulativeMgKg: null,
    };
}

function makeIncidentalDose(): DoseRow {
    return {
        id: `incidental-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        sequence: 0,
        category: 'incidental',
        ibogaineSubstance: null,
        incidentalSubstance: 'iv_metoclopramide',
        doseMg: undefined,
        route: 'iv',
        timestamp: makeLocalTimestamp(),
        cumulativeMgKg: null,
    };
}

// ─── Component ───────────────────────────────────────────────────────────────
const IbogaineDosingCalculator: React.FC<IbogaineDosingCalculatorProps> = ({
    intakeWeightKg,
    onSave,
    initialData = {},
    sessionId,
    onComplete,
    onBack,
}) => {
    const [isSaving, setIsSaving] = useState(false);

    const [patientWeightKg, setPatientWeightKg] = useState<number | undefined>(
        initialData.patientWeightKg ?? intakeWeightKg
    );

    const [doses, setDoses] = useState<DoseRow[]>(() => {
        const initial = initialData.doses?.length ? initialData.doses : [makePrimaryDose(1)];
        return recalcCumulativeMgKg(initial, patientWeightKg);
    });

    // Recalculate mg/kg on any dose change
    const updateDose = useCallback(<K extends keyof DoseRow>(id: string, field: K, value: DoseRow[K]) => {
        setDoses(prev => {
            const updated = prev.map(d => d.id === id ? { ...d, [field]: value } : d);
            return recalcCumulativeMgKg(updated, patientWeightKg);
        });
    }, [patientWeightKg]);

    const handleWeightChange = useCallback((v: number | undefined) => {
        setPatientWeightKg(v);
        setDoses(prev => recalcCumulativeMgKg(prev, v));
    }, []);

    const addPrimaryDose = useCallback(() => {
        setDoses(prev => {
            const seq = nextPrimarySequence(prev);
            const newDose = makePrimaryDose(seq);
            return recalcCumulativeMgKg([...prev, newDose], patientWeightKg);
        });
    }, [patientWeightKg]);

    const addIncidentalDose = useCallback(() => {
        setDoses(prev => [...prev, makeIncidentalDose()]);
    }, []);

    const removeDose = useCallback((id: string) => {
        setDoses(prev => {
            const filtered = prev.filter(d => d.id !== id);
            // Re-number primary doses after removal
            let seq = 0;
            const renumbered = filtered.map(d =>
                d.category === 'primary' ? { ...d, sequence: ++seq } : d
            );
            return recalcCumulativeMgKg(renumbered, patientWeightKg);
        });
    }, [patientWeightKg]);

    const totalCumMgKg = patientWeightKg
        ? doses
            .filter(d => d.category === 'primary' && d.doseMg)
            .reduce((sum, d) => sum + (d.doseMg ?? 0), 0) / patientWeightKg
        : null;

    const hasData = doses.some(d => d.doseMg != null);

    const handleSaveAndContinue = () => {
        setIsSaving(true);
        onSave?.({ patientWeightKg, doses });
        setTimeout(() => { setIsSaving(false); onComplete?.(); }, 400);
    };

    const { ctaRef, showEnterToast } = useFormCompletion(hasData && !!patientWeightKg, handleSaveAndContinue, {
        storageKey: `ppn_ibogaine_dosing_${sessionId ?? 'default'}`,
        draftValue: { patientWeightKg, doses },
    });

    return (
        <div className="max-w-5xl mx-auto space-y-5">

            {/* Advisory banner */}
            <div className="flex items-start gap-3 px-4 py-3 bg-amber-950/30 border border-amber-500/30 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="ppn-meta text-amber-300">
                    Cumulative mg/kg is advisory. Practitioner retains full clinical decision authority at every dose step. Values calculated from weight entered below.
                </p>
            </div>

            {/* Weight input panel */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/40 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                        <Calculator className="w-4 h-4 text-blue-400" aria-hidden="true" />
                    </div>
                    <div>
                        <p className="ppn-card-title text-slate-200">Patient Weight (kg)</p>
                        <p className="ppn-meta text-slate-500">Required for real-time cumulative mg/kg calculation</p>
                    </div>
                    {totalCumMgKg !== null && (
                        <div className="ml-auto text-right">
                            <p className="ppn-meta text-slate-500">Cumulative Total</p>
                            <p className="text-2xl font-black font-mono text-emerald-300">
                                {totalCumMgKg.toFixed(2)} mg/kg
                            </p>
                        </div>
                    )}
                </div>
                <div className="max-w-xs">
                    <FormField label="" tooltip="Locked for the session — must match Phase 1 intake or practitioner-confirmed weight at session start.">
                        <NumberInput
                            value={patientWeightKg}
                            onChange={handleWeightChange}
                            min={20}
                            max={400}
                            step={0.5}
                            unit="kg"
                            placeholder={intakeWeightKg ? `${intakeWeightKg} (Phase 1)` : 'Enter weight'}
                        />
                    </FormField>
                </div>
            </div>

            {/* Dose rows */}
            <div className="space-y-3">
                {doses.map((dose) => {
                    const isPrimary = dose.category === 'primary';
                    const sequenceLabel = isPrimary
                        ? (SEQUENCE_LABELS[dose.sequence] ?? `Dose ${dose.sequence}`)
                        : 'Incidental';

                    return (
                        <div
                            key={dose.id}
                            className={`bg-slate-900/60 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all ${
                                isPrimary ? 'border-emerald-500/30' : 'border-slate-700/40'
                            }`}
                        >
                            {/* Row header */}
                            <div className={`flex items-center gap-3 px-5 py-3 border-b ${isPrimary ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-slate-800/30 border-slate-700/40'}`}>
                                <span className={`ppn-meta font-black uppercase tracking-wide ${isPrimary ? 'text-emerald-300' : 'text-slate-400'}`}>
                                    {sequenceLabel}
                                </span>
                                {isPrimary && dose.cumulativeMgKg !== null && (
                                    <span className="ml-2 px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/25 ppn-meta text-emerald-300 font-black">
                                        Cumulative: {dose.cumulativeMgKg} mg/kg
                                    </span>
                                )}
                                {!patientWeightKg && isPrimary && dose.doseMg && (
                                    <span className="ml-2 ppn-meta text-amber-400 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                                        Add weight for mg/kg
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeDose(dose.id)}
                                    className="ml-auto p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    aria-label={`Remove ${sequenceLabel}`}
                                >
                                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                </button>
                            </div>

                            {/* Row fields */}
                            <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Substance selector */}
                                <FormField
                                    label={isPrimary ? 'Substance' : 'Medication'}
                                    tooltip={isPrimary ? 'Ibogaine HCL or TPA — required by Dr. Allen protocol' : 'Select from structured medication vocabulary only. Free-text disabled (Zero-PHI).'}
                                >
                                    {isPrimary ? (
                                        <select
                                            value={dose.ibogaineSubstance ?? ''}
                                            onChange={e => updateDose(dose.id, 'ibogaineSubstance', e.target.value as IbogaineSubstanceType)}
                                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                            aria-label={`${sequenceLabel} substance type`}
                                        >
                                            {IBOGAINE_SUBSTANCE_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <select
                                            value={dose.incidentalSubstance ?? ''}
                                            onChange={e => updateDose(dose.id, 'incidentalSubstance', e.target.value as IncidentalSubstanceType)}
                                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            aria-label={`${sequenceLabel} medication`}
                                        >
                                            {INCIDENTAL_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    )}
                                </FormField>

                                {/* Dose in mg */}
                                <FormField
                                    label="Dose (mg)"
                                    tooltip={isPrimary ? 'Enter administered mg amount. Combined with patient weight for cumulative mg/kg.' : 'Enter incidental medication dose in mg.'}
                                >
                                    <NumberInput
                                        value={dose.doseMg}
                                        onChange={v => updateDose(dose.id, 'doseMg', v)}
                                        min={0}
                                        max={10000}
                                        step={5}
                                        unit="mg"
                                        placeholder="0"
                                        status={
                                            isPrimary && dose.cumulativeMgKg !== null && dose.cumulativeMgKg > 30
                                                ? 'critical'
                                                : isPrimary && dose.cumulativeMgKg !== null && dose.cumulativeMgKg > 20
                                                    ? 'elevated'
                                                    : 'normal'
                                        }
                                    />
                                </FormField>

                                {/* Route */}
                                <FormField label="Route" tooltip="Route of administration">
                                    <select
                                        value={dose.route}
                                        onChange={e => updateDose(dose.id, 'route', e.target.value as RouteType)}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        aria-label={`${sequenceLabel} route`}
                                    >
                                        <option value="">Select route...</option>
                                        {ROUTE_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </FormField>
                            </div>

                            {/* Timestamp row */}
                            <div className="px-5 pb-4 flex items-center gap-3">
                                <span className="ppn-meta text-slate-500 flex-shrink-0">Administered at:</span>
                                <input
                                    type="datetime-local"
                                    value={dose.timestamp}
                                    onChange={e => updateDose(dose.id, 'timestamp', e.target.value)}
                                    className="px-3 py-2 bg-slate-800/40 border border-slate-700/40 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                    aria-label={`${sequenceLabel} administration time`}
                                />
                                <button
                                    type="button"
                                    onClick={() => updateDose(dose.id, 'timestamp', makeLocalTimestamp())}
                                    className="px-3 py-2 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 rounded-lg ppn-meta text-slate-400 hover:text-slate-200 transition-all"
                                    aria-label="Set current time"
                                >
                                    Now
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add dose buttons */}
            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={addPrimaryDose}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-900/20 hover:bg-emerald-900/30 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-300 hover:text-emerald-200 rounded-xl ppn-meta font-semibold transition-all active:scale-95"
                    aria-label="Add another Ibogaine dose"
                >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    Add Ibogaine Dose
                </button>
                <button
                    type="button"
                    onClick={addIncidentalDose}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-600/50 text-slate-400 hover:text-slate-300 rounded-xl ppn-meta font-semibold transition-all active:scale-95"
                    aria-label="Log an incidental IV or protocol medication"
                >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    Log Incidental / IV Medication
                </button>
            </div>

            {/* Totals summary */}
            {hasData && patientWeightKg && (
                <div className="flex items-center justify-between px-5 py-4 bg-emerald-950/30 border border-emerald-500/25 rounded-2xl">
                    <div className="space-y-1">
                        <p className="ppn-meta text-slate-500">Final Cumulative Ibogaine Dose</p>
                        <p className="text-3xl font-black font-mono text-emerald-300">
                            {totalCumMgKg !== null ? `${totalCumMgKg.toFixed(2)} mg/kg` : '—'}
                        </p>
                        <p className="ppn-meta text-slate-500">
                            {doses.filter(d => d.category === 'primary' && d.doseMg).reduce((s, d) => s + (d.doseMg ?? 0), 0)} mg
                            {' '}÷ {patientWeightKg}kg
                        </p>
                    </div>
                    <span className="ppn-meta text-slate-500">Advisory · DB persist pending migration 085</span>
                </div>
            )}

            <FormFooter
                onBack={onBack}
                onSaveAndContinue={handleSaveAndContinue}
                isSaving={isSaving}
                hasChanges={hasData}
                isValid={!!patientWeightKg}
                ctaRef={ctaRef}
                showEnterToast={showEnterToast}
                saveAndContinueLabel="Save Dosing Log"
            />
        </div>
    );
};

export default IbogaineDosingCalculator;
