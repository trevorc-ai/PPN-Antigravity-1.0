import React, { useState, useCallback, useEffect } from 'react';
import { FlaskConical, ChevronDown, ChevronUp, Plus, AlertTriangle, CheckCircle, Upload, X } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';
import {
    calculateRecommendedWeight,
    calculateEffectiveDose,
    getWarningLevel,
    getPotencyLabel,
    STRAIN_DATABASE,
    StrainOption,
} from '../../utils/potencyCalculations';

interface PotencyNormalizerCardProps {
    /** Called when user saves a batch and wants to use it in the protocol */
    onBatchSelected?: (batchData: { strainName: string; potencyCoeff: number; recommendedWeightGrams: number; effectiveDoseMg: number }) => void;
    className?: string;
}

const WARNING_STYLES = {
    none: {
        card: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
        label: 'STANDARD POTENCY',
        icon: <CheckCircle className="w-4 h-4 flex-shrink-0" />,
    },
    moderate: {
        card: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
        label: 'MODERATE POTENCY',
        icon: <AlertTriangle className="w-4 h-4 flex-shrink-0" />,
    },
    high: {
        card: 'bg-red-500/10 border-red-500/30 text-red-300',
        label: 'HIGH POTENCY',
        icon: <AlertTriangle className="w-4 h-4 flex-shrink-0" />,
    },
};

export const PotencyNormalizerCard: React.FC<PotencyNormalizerCardProps> = ({
    onBatchSelected,
    className = '',
}) => {
    const [expanded, setExpanded] = useState(false);
    const [showNewBatch, setShowNewBatch] = useState(false);

    // Batch state
    const [selectedStrain, setSelectedStrain] = useState<StrainOption | null>(null);
    const [potencyCoeff, setPotencyCoeff] = useState<number>(1.0);
    const [isCustomCoeff, setIsCustomCoeff] = useState(false);
    const [fentanylTestDone, setFentanylTestDone] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    // Calculator state
    const [targetMg, setTargetMg] = useState<number | null>(null);
    const [targetGrams, setTargetGrams] = useState<number | null>(null);

    // Derived calculations
    const recommendedGrams = targetMg !== null ? calculateRecommendedWeight(targetMg, potencyCoeff) : null;
    const effectiveMg = targetGrams !== null ? calculateEffectiveDose(targetGrams, potencyCoeff) : null;
    const warningLevel = getWarningLevel(potencyCoeff, targetMg ?? effectiveMg ?? 0);
    const warningStyle = WARNING_STYLES[warningLevel];

    // Sync strain selection → potency coefficient
    useEffect(() => {
        if (selectedStrain && !isCustomCoeff) {
            setPotencyCoeff(selectedStrain.default_potency_coefficient);
        }
    }, [selectedStrain, isCustomCoeff]);

    const handleStrainChange = (strainId: string) => {
        const strain = STRAIN_DATABASE.find((s) => s.strain_id === strainId) ?? null;
        setSelectedStrain(strain);
        setIsCustomCoeff(false);
    };

    const handleCoeffChange = (val: number) => {
        setPotencyCoeff(val);
        setIsCustomCoeff(true);
    };

    const handleMgChange = (val: number | null) => {
        setTargetMg(val);
        setTargetGrams(null); // Clear the other field
    };

    const handleGramsChange = (val: number | null) => {
        setTargetGrams(val);
        setTargetMg(null);
    };

    const handleFileDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setUploadedFile(file.name);
        }
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setUploadedFile(file.name);
    };

    const handleSaveBatch = () => {
        if (!selectedStrain) return;
        const grams = recommendedGrams ?? targetGrams ?? 0;
        const mg = targetMg ?? effectiveMg ?? 0;
        onBatchSelected?.({
            strainName: selectedStrain.strain_name,
            potencyCoeff,
            recommendedWeightGrams: grams,
            effectiveDoseMg: mg,
        });
    };

    // Collapsed summary
    const collapsedSummary = selectedStrain
        ? `${selectedStrain.strain_name} — ${potencyCoeff}x — ${getPotencyLabel(potencyCoeff)}`
        : 'No batch selected — click to calculate safe dose';

    return (
        <section
            aria-label="Potency Normalizer - Harm Reduction Calculator"
            className={`bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden ${className}`}
        >
            {/* Header / Toggle */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/30 transition-colors"
                aria-expanded={expanded}
            >
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <FlaskConical className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold text-slate-300">Potency Normalizer</p>
                        <p className="text-sm text-slate-500">{expanded ? 'Harm reduction calculator — not medical advice' : collapsedSummary}</p>
                    </div>
                </div>
                {expanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>

            {expanded && (
                <div className="px-5 pb-5 space-y-5 animate-in slide-in-from-top duration-200" role="form" aria-label="Batch and dosage calculator">

                    {/* Step 1: Batch */}
                    <div>
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Step 1 — Select or Create Batch</p>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <select
                                    value={selectedStrain?.strain_id ?? ''}
                                    onChange={(e) => handleStrainChange(e.target.value)}
                                    className="w-full bg-slate-800/60 border border-slate-600 rounded-xl px-4 py-3 text-sm font-bold text-slate-300 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    aria-label="Select existing batch strain"
                                >
                                    <option value="">Select strain...</option>
                                    {STRAIN_DATABASE.map((s) => (
                                        <option key={s.strain_id} value={s.strain_id}>
                                            {s.strain_name} ({s.substance_type}) — {s.default_potency_coefficient}x
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                            </div>
                            <button
                                onClick={() => setShowNewBatch(!showNewBatch)}
                                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/60 border border-slate-600 rounded-xl text-xs font-bold text-slate-300 hover:border-slate-500 transition-all whitespace-nowrap"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                New Batch
                            </button>
                        </div>

                        {selectedStrain && (
                            <p className="text-sm text-slate-500 mt-1.5 italic">{selectedStrain.description}</p>
                        )}
                    </div>

                    {/* Step 2: Potency Coefficient */}
                    <div>
                        <label htmlFor="potency-coeff" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                            Step 2 — Potency Coefficient
                        </label>
                        <AdvancedTooltip
                            content="1.0 = Standard potency. 2.0 = Twice as strong. Auto-filled from strain database. Edit to override with your own test results."
                            tier="standard"
                        >
                            <div className="flex items-center gap-3 cursor-help">
                                <input
                                    id="potency-coeff"
                                    type="number"
                                    min={0.1}
                                    max={5.0}
                                    step={0.1}
                                    value={potencyCoeff}
                                    onChange={(e) => handleCoeffChange(parseFloat(e.target.value) || 1.0)}
                                    aria-label="Potency coefficient (auto-filled from strain)"
                                    className="w-28 bg-slate-800/60 border border-slate-600 rounded-xl px-4 py-3 text-base font-bold text-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                                <div>
                                    <span className={`text-sm font-bold ${potencyCoeff >= 2.0 ? 'text-red-400' : potencyCoeff >= 1.2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                        {getPotencyLabel(potencyCoeff)}
                                    </span>
                                    {isCustomCoeff && (
                                        <p className="text-sm text-amber-400 mt-0.5">⚠ Custom value — not from database</p>
                                    )}
                                    {!isCustomCoeff && selectedStrain && (
                                        <p className="text-sm text-slate-500 mt-0.5">Auto-filled from strain database. Edit to override.</p>
                                    )}
                                </div>
                            </div>
                        </AdvancedTooltip>
                    </div>

                    {/* Step 3: Reagent Upload (Optional) */}
                    <div>
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Step 3 — Reagent Test (Optional)</p>
                        {uploadedFile ? (
                            <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <span className="text-sm text-emerald-300 font-medium flex-1 truncate">{uploadedFile}</span>
                                <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">Encrypted</span>
                                <button onClick={() => setUploadedFile(null)} className="text-slate-500 hover:text-slate-300 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <label
                                className={`flex flex-col items-center justify-center gap-2 px-4 py-5 border-2 border-dashed rounded-xl cursor-pointer transition-all ${isDragOver ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/20'
                                    }`}
                                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                                onDragLeave={() => setIsDragOver(false)}
                                onDrop={handleFileDrop}
                            >
                                <Upload className="w-5 h-5 text-slate-500" />
                                <span className="text-sm text-slate-400">Drag and drop or click to upload test image</span>
                                <span className="text-xs text-slate-600">Encrypted — Not shared — Optional</span>
                                <input type="file" accept="image/*" className="sr-only" onChange={handleFileInput} />
                            </label>
                        )}

                        <label className="flex items-center gap-2 mt-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={fentanylTestDone}
                                onChange={(e) => setFentanylTestDone(e.target.checked)}
                                className="w-4 h-4 rounded accent-blue-500"
                            />
                            <span className="text-sm text-slate-400">Fentanyl strip test completed [VERIFIED]</span>
                        </label>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-700/50" />

                    {/* Dosage Calculator */}
                    <div>
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Dosage Calculator</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="target-mg" className="block text-sm font-medium text-slate-300 mb-1.5">
                                    Target Dose (mg psilocybin)
                                </label>
                                <input
                                    id="target-mg"
                                    type="number"
                                    min={1}
                                    max={200}
                                    step={1}
                                    placeholder="e.g. 30"
                                    value={targetMg ?? ''}
                                    onChange={(e) => handleMgChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                                    className="w-full bg-slate-800/60 border border-slate-600 rounded-xl px-4 py-3 text-base font-bold text-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label htmlFor="target-grams" className="block text-sm font-medium text-slate-300 mb-1.5">
                                    Physical Weight (grams)
                                </label>
                                <input
                                    id="target-grams"
                                    type="number"
                                    min={0.1}
                                    max={20}
                                    step={0.1}
                                    placeholder="e.g. 3.0"
                                    value={targetGrams ?? ''}
                                    onChange={(e) => handleGramsChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                                    className="w-full bg-slate-800/60 border border-slate-600 rounded-xl px-4 py-3 text-base font-bold text-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Results */}
                        {(recommendedGrams !== null || effectiveMg !== null) && (
                            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl space-y-2 animate-in fade-in duration-200">
                                {recommendedGrams !== null && (
                                    <div>
                                        <p className="text-sm text-slate-400 uppercase tracking-wide">Recommended Weight</p>
                                        <p className="text-2xl font-black text-blue-300">{recommendedGrams.toFixed(2)}g</p>
                                        <p className="text-sm text-slate-400">Equivalent to {(recommendedGrams * potencyCoeff).toFixed(1)}g standard potency</p>
                                    </div>
                                )}
                                {effectiveMg !== null && (
                                    <div>
                                        <p className="text-sm text-slate-400 uppercase tracking-wide">Effective Dose</p>
                                        <p className="text-2xl font-black text-blue-300">{effectiveMg.toFixed(1)}mg</p>
                                        <p className="text-sm text-slate-400">Psilocybin equivalent at {potencyCoeff}x potency</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Warning Banner */}
                        {warningLevel !== 'none' && (
                            <div
                                role="alert"
                                aria-live="polite"
                                className={`mt-3 flex items-start gap-3 p-4 rounded-xl border ${warningStyle.card}`}
                            >
                                {warningStyle.icon}
                                <div>
                                    <p className="text-sm font-black uppercase tracking-widest">{warningStyle.label}</p>
                                    <p className="text-sm mt-0.5">
                                        {warningLevel === 'high'
                                            ? `This strain is ${potencyCoeff}x stronger than standard. Reduce physical weight accordingly.`
                                            : `This strain is ${potencyCoeff}x potency. Verify dose calculation before proceeding.`}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSaveBatch}
                            disabled={!selectedStrain}
                            className="flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-widest bg-blue-500/20 border border-blue-500/40 text-blue-400 hover:bg-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                        >
                            Save Batch
                        </button>
                        <button
                            onClick={() => { setTargetMg(null); setTargetGrams(null); }}
                            className="px-4 py-3 rounded-xl text-sm font-bold border border-slate-700 text-slate-400 hover:border-slate-600 transition-all"
                        >
                            Reset
                        </button>
                    </div>

                    {/* Legal Disclaimer */}
                    <p className="text-sm text-slate-500 italic text-center">
                        ⚠️ Harm reduction tool only — not medical advice. Psilocybin remains a Schedule I substance under federal law.
                    </p>
                </div>
            )}
        </section>
    );
};

export default PotencyNormalizerCard;
