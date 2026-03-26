import React, { useState, useCallback } from 'react';
import { AlertTriangle, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { FormField } from '../shared/FormField';
import { NumberInput } from '../shared/NumberInput';
import { FormFooter } from '../shared/FormFooter';
import { useFormCompletion } from '../../../hooks/useFormCompletion';

/**
 * IbogaineCerebellarAssessmentForm — WO-669
 *
 * Opt-in assessment cards for 3 cerebellar/vestibular instruments administered
 * before, during, and after Ibogaine sessions:
 *   - SARA  (Scale for the Assessment and Rating of Ataxia)
 *   - FTN   (Finger-to-Nose Test)
 *   - HKS   (Heel-Knee-Shin Test)
 *
 * The 'timing' prop distinguishes Phase 1 baseline (pre), Phase 2 monitoring (mid),
 * and Phase 3 re-assessment (post). All instruments are advisory, non-blocking.
 *
 * Data stored in: log_ibogaine_cerebellar_assessments (migration 084)
 */

// ─── Types ───────────────────────────────────────────────────────────────────
export type CerebellarTimingType = 'pre' | 'mid' | 'post';
export type HKSResult = 'normal' | 'mild' | 'moderate' | 'severe' | 'unable' | null;

/** SARA 8-item scores */
export interface SARAItems {
    gait: number;               // 0–8
    stance: number;             // 0–6
    sitting: number;            // 0–4
    speechDisturbance: number;  // 0–6
    fingerChase: number;        // 0–4
    noseFingerTest: number;     // 0–4
    fastAlternating: number;    // 0–4
    heelSlide: number;          // 0–4
}

export interface IbogaineCerebellarData {
    timing: CerebellarTimingType;

    // Card enable flags (all opt-in)
    saraEnabled: boolean;
    ftnEnabled: boolean;
    hksEnabled: boolean;

    // SARA
    saraItems: SARAItems;

    // FTN per side
    ftnLeftScore: number;       // 0–5
    ftnRightScore: number;      // 0–5
    ftnLeftAttempts: number | undefined;
    ftnRightAttempts: number | undefined;
    ftnLeftPasses: number | undefined;
    ftnRightPasses: number | undefined;

    // HKS per side (categorical)
    hksLeftResult: HKSResult;
    hksRightResult: HKSResult;
}

interface IbogaineCerebellarAssessmentFormProps {
    timing?: CerebellarTimingType;
    onSave?: (data: IbogaineCerebellarData) => void;
    initialData?: Partial<IbogaineCerebellarData>;
    sessionId?: string;
    onComplete?: () => void;
    onBack?: () => void;
}

// ─── SARA item definitions ────────────────────────────────────────────────────
const SARA_ITEMS: Array<{
    field: keyof SARAItems;
    label: string;
    max: number;
    description: string;
}> = [
    { field: 'gait',             label: 'Gait',                      max: 8, description: '0 = Normal; 8 = Unable to walk' },
    { field: 'stance',           label: 'Stance',                    max: 6, description: '0 = Normal; 6 = Unable to stand' },
    { field: 'sitting',          label: 'Sitting',                   max: 4, description: '0 = Normal; 4 = Unable to sit without support' },
    { field: 'speechDisturbance', label: 'Speech Disturbance',       max: 6, description: '0 = Normal; 6 = Anarthria' },
    { field: 'fingerChase',      label: 'Finger Chase',              max: 4, description: '0 = Normal; 4 = No response' },
    { field: 'noseFingerTest',   label: 'Nose-Finger Test',          max: 4, description: '0 = Normal; 4 = Severe dysmetria' },
    { field: 'fastAlternating',  label: 'Fast Alternating Movements', max: 4, description: '0 = Normal; 4 = Unable to perform' },
    { field: 'heelSlide',        label: 'Heel-Shin Slide',           max: 4, description: '0 = Normal; 4 = Severe dysmetria' },
];

/** SARA total score and severity interpretation */
const DEFAULT_SARA: SARAItems = {
    gait: 0, stance: 0, sitting: 0, speechDisturbance: 0,
    fingerChase: 0, noseFingerTest: 0, fastAlternating: 0, heelSlide: 0,
};

function calcSaraTotal(items: SARAItems): number {
    return Object.values(items).reduce((sum, v) => sum + (v || 0), 0);
}

function saraSeverityLabel(score: number): { label: string; colorClass: string } {
    if (score <= 8) return { label: 'Mild', colorClass: 'text-teal-300' };
    if (score <= 20) return { label: 'Moderate', colorClass: 'text-amber-300' };
    return { label: 'Severe', colorClass: 'text-red-300' };
}

const HKS_OPTIONS: Array<{ value: HKSResult; label: string }> = [
    { value: null, label: 'Select result...' },
    { value: 'normal', label: 'Normal: smooth, accurate movement' },
    { value: 'mild', label: 'Mild: slight dysmetria, minimal tremor' },
    { value: 'moderate', label: 'Moderate: notable decomposition or tremor' },
    { value: 'severe', label: 'Severe: unable to maintain contact or gross ataxia' },
    { value: 'unable', label: 'Unable: patient unable to complete test' },
];

const TIMING_LABELS: Record<CerebellarTimingType, string> = {
    pre: 'Phase 1 Baseline',
    mid: 'Phase 2 Mid-Session',
    post: 'Phase 3 Post-Session',
};

// ─── Component ───────────────────────────────────────────────────────────────
const IbogaineCerebellarAssessmentForm: React.FC<IbogaineCerebellarAssessmentFormProps> = ({
    timing = 'pre',
    onSave,
    initialData = {},
    sessionId,
    onComplete,
    onBack,
}) => {
    const [isSaving, setIsSaving] = useState(false);

    const [data, setData] = useState<IbogaineCerebellarData>({
        timing,
        saraEnabled: false,
        ftnEnabled: false,
        hksEnabled: false,
        saraItems: { ...DEFAULT_SARA },
        ftnLeftScore: 0,
        ftnRightScore: 0,
        ftnLeftAttempts: undefined,
        ftnRightAttempts: undefined,
        ftnLeftPasses: undefined,
        ftnRightPasses: undefined,
        hksLeftResult: null,
        hksRightResult: null,
        ...initialData,
    });

    const toggleCard = useCallback((card: 'sara' | 'ftn' | 'hks') => {
        setData(prev => ({
            ...prev,
            [`${card}Enabled`]: !prev[`${card}Enabled` as keyof IbogaineCerebellarData],
        }));
    }, []);

    const updateSaraItem = useCallback((field: keyof SARAItems, value: number) => {
        setData(prev => ({ ...prev, saraItems: { ...prev.saraItems, [field]: value } }));
    }, []);

    const saraTotal = calcSaraTotal(data.saraItems);
    const saraSeverity = saraSeverityLabel(saraTotal);

    const hasAnyData =
        (data.saraEnabled && saraTotal > 0) ||
        (data.ftnEnabled && (data.ftnLeftScore > 0 || data.ftnRightScore > 0)) ||
        (data.hksEnabled && (data.hksLeftResult !== null || data.hksRightResult !== null));

    const handleSaveAndContinue = () => {
        setIsSaving(true);
        onSave?.(data);
        setTimeout(() => { setIsSaving(false); onComplete?.(); }, 400);
    };

    const { ctaRef, showEnterToast } = useFormCompletion(hasAnyData, handleSaveAndContinue, {
        storageKey: `ppn_ibogaine_cerebellar_${timing}_${sessionId ?? 'default'}`,
        draftValue: data,
    });

    const cardHeaderCls = 'flex items-center gap-4 p-5 cursor-pointer select-none rounded-2xl transition-all w-full';

    return (
        <div className="max-w-5xl mx-auto space-y-4">

            {/* Timing badge */}
            <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-slate-800/60 border border-slate-700/50 rounded-lg ppn-meta text-slate-400">
                    Assessment timing:
                </span>
                <span className="px-3 py-1 bg-indigo-900/30 border border-indigo-500/30 rounded-lg ppn-meta font-semibold text-indigo-300">
                    {TIMING_LABELS[data.timing]}
                </span>
            </div>

            {/* Advisory banner */}
            <div className="flex items-start gap-3 px-4 py-3 bg-amber-950/30 border border-amber-500/30 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="ppn-meta text-amber-300">
                    All cerebellum assessment cards are <strong>optional</strong> and practitioner-selected.
                    Activate those clinically appropriate for this patient and session phase.
                    No assessment is required to proceed.
                </p>
            </div>

            {/* ── SARA Card ─────────────────────────────────────────────────── */}
            <div className={`bg-slate-900/60 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all ${data.saraEnabled ? 'border-indigo-500/40' : 'border-slate-700/40'}`}>
                <button
                    type="button"
                    className={`${cardHeaderCls} ${data.saraEnabled ? 'bg-indigo-900/20 hover:bg-indigo-900/30' : 'hover:bg-slate-800/40'}`}
                    onClick={() => toggleCard('sara')}
                    aria-expanded={data.saraEnabled}
                    aria-controls="sara-panel"
                >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${data.saraEnabled ? 'bg-indigo-500/20 border-indigo-500/40' : 'bg-slate-800/60 border-slate-700/50'}`}>
                        <span className={`material-symbols-outlined text-lg ${data.saraEnabled ? 'text-indigo-400' : 'text-slate-500'}`} aria-hidden="true">directions_walk</span>
                    </div>
                    <div className="flex-1 text-left">
                        <p className="ppn-card-title text-slate-200">SARA: Scale for the Assessment and Rating of Ataxia</p>
                        <p className="ppn-meta text-slate-500 mt-0.5">8-item clinician-rated ataxia scale · Total 0–40</p>
                    </div>
                    {data.saraEnabled && saraTotal > 0 && (
                        <span className={`ppn-meta font-black mr-2 ${saraSeverity.colorClass}`}>{saraTotal}/40 · {saraSeverity.label}</span>
                    )}
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${data.saraEnabled ? 'bg-indigo-500 border-indigo-400' : 'border-slate-600'}`} aria-hidden="true">
                        {data.saraEnabled && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    {data.saraEnabled ? <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden="true" /> : <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" aria-hidden="true" />}
                </button>

                {data.saraEnabled && (
                    <div id="sara-panel" className="px-5 pb-5 border-t border-slate-800/60 pt-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {SARA_ITEMS.map(item => (
                                <FormField key={item.field} label={`${item.label} (0–${item.max})`} tooltip={item.description}>
                                    <NumberInput
                                        value={data.saraItems[item.field]}
                                        onChange={v => updateSaraItem(item.field, v ?? 0)}
                                        min={0}
                                        max={item.max}
                                        step={1}
                                        placeholder="0"
                                    />
                                </FormField>
                            ))}
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl">
                            <span className="ppn-meta text-slate-400">SARA Total Score</span>
                            <div className="flex items-center gap-3">
                                <span className={`text-xl font-black font-mono ${saraSeverity.colorClass}`}>{saraTotal} / 40</span>
                                <span className={`px-2 py-0.5 rounded border ppn-meta font-semibold ${saraSeverity.colorClass} bg-slate-900/60`}>{saraSeverity.label}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── FTN Card ──────────────────────────────────────────────────── */}
            <div className={`bg-slate-900/60 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all ${data.ftnEnabled ? 'border-violet-500/40' : 'border-slate-700/40'}`}>
                <button
                    type="button"
                    className={`${cardHeaderCls} ${data.ftnEnabled ? 'bg-violet-900/20 hover:bg-violet-900/30' : 'hover:bg-slate-800/40'}`}
                    onClick={() => toggleCard('ftn')}
                    aria-expanded={data.ftnEnabled}
                    aria-controls="ftn-panel"
                >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${data.ftnEnabled ? 'bg-violet-500/20 border-violet-500/40' : 'bg-slate-800/60 border-slate-700/50'}`}>
                        <span className={`material-symbols-outlined text-lg ${data.ftnEnabled ? 'text-violet-400' : 'text-slate-500'}`} aria-hidden="true">back_hand</span>
                    </div>
                    <div className="flex-1 text-left">
                        <p className="ppn-card-title text-slate-200">FTN: Finger-to-Nose Test</p>
                        <p className="ppn-meta text-slate-500 mt-0.5">Dysmetria severity per side · 0–5 each</p>
                    </div>
                    {data.ftnEnabled && (
                        <span className="ppn-meta font-black text-violet-300 mr-2">L: {data.ftnLeftScore}/5 · R: {data.ftnRightScore}/5</span>
                    )}
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${data.ftnEnabled ? 'bg-violet-500 border-violet-400' : 'border-slate-600'}`} aria-hidden="true">
                        {data.ftnEnabled && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    {data.ftnEnabled ? <ChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true" /> : <ChevronRight className="w-4 h-4 text-slate-600" aria-hidden="true" />}
                </button>

                {data.ftnEnabled && (
                    <div id="ftn-panel" className="px-5 pb-5 border-t border-slate-800/60 pt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left side */}
                            <div className="space-y-3">
                                <p className="ppn-meta text-slate-400 font-semibold uppercase tracking-wide">Left Side</p>
                                <FormField label="Dysmetria Severity (0–5)" tooltip="0 = absent, 5 = severe dysmetria">
                                    <NumberInput value={data.ftnLeftScore} onChange={v => setData(prev => ({ ...prev, ftnLeftScore: v ?? 0 }))} min={0} max={5} step={1} placeholder="0" />
                                </FormField>
                                <FormField label="Attempts (optional)" tooltip="Number of trials conducted per side">
                                    <NumberInput value={data.ftnLeftAttempts} onChange={v => setData(prev => ({ ...prev, ftnLeftAttempts: v }))} min={0} max={10} step={1} placeholder="—" hideControls />
                                </FormField>
                                <FormField label="Successes (optional)" tooltip="Accurate contacts within normal range">
                                    <NumberInput value={data.ftnLeftPasses} onChange={v => setData(prev => ({ ...prev, ftnLeftPasses: v }))} min={0} max={10} step={1} placeholder="—" hideControls />
                                </FormField>
                            </div>
                            {/* Right side */}
                            <div className="space-y-3">
                                <p className="ppn-meta text-slate-400 font-semibold uppercase tracking-wide">Right Side</p>
                                <FormField label="Dysmetria Severity (0–5)" tooltip="0 = absent, 5 = severe dysmetria">
                                    <NumberInput value={data.ftnRightScore} onChange={v => setData(prev => ({ ...prev, ftnRightScore: v ?? 0 }))} min={0} max={5} step={1} placeholder="0" />
                                </FormField>
                                <FormField label="Attempts (optional)" tooltip="Number of trials conducted per side">
                                    <NumberInput value={data.ftnRightAttempts} onChange={v => setData(prev => ({ ...prev, ftnRightAttempts: v }))} min={0} max={10} step={1} placeholder="—" hideControls />
                                </FormField>
                                <FormField label="Successes (optional)" tooltip="Accurate contacts within normal range">
                                    <NumberInput value={data.ftnRightPasses} onChange={v => setData(prev => ({ ...prev, ftnRightPasses: v }))} min={0} max={10} step={1} placeholder="—" hideControls />
                                </FormField>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── HKS Card ──────────────────────────────────────────────────── */}
            <div className={`bg-slate-900/60 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all ${data.hksEnabled ? 'border-emerald-500/40' : 'border-slate-700/40'}`}>
                <button
                    type="button"
                    className={`${cardHeaderCls} ${data.hksEnabled ? 'bg-emerald-900/15 hover:bg-emerald-900/25' : 'hover:bg-slate-800/40'}`}
                    onClick={() => toggleCard('hks')}
                    aria-expanded={data.hksEnabled}
                    aria-controls="hks-panel"
                >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${data.hksEnabled ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-slate-800/60 border-slate-700/50'}`}>
                        <span className={`material-symbols-outlined text-lg ${data.hksEnabled ? 'text-emerald-400' : 'text-slate-500'}`} aria-hidden="true">accessibility</span>
                    </div>
                    <div className="flex-1 text-left">
                        <p className="ppn-card-title text-slate-200">HKS: Heel-Knee-Shin Test</p>
                        <p className="ppn-meta text-slate-500 mt-0.5">Categorical result per side</p>
                    </div>
                    {data.hksEnabled && (
                        <span className="ppn-meta font-black text-emerald-300 mr-2">
                            {data.hksLeftResult ?? '—'} · {data.hksRightResult ?? '—'}
                        </span>
                    )}
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${data.hksEnabled ? 'bg-emerald-500 border-emerald-400' : 'border-slate-600'}`} aria-hidden="true">
                        {data.hksEnabled && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    {data.hksEnabled ? <ChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true" /> : <ChevronRight className="w-4 h-4 text-slate-600" aria-hidden="true" />}
                </button>

                {data.hksEnabled && (
                    <div id="hks-panel" className="px-5 pb-5 border-t border-slate-800/60 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField label="Left Side Result" tooltip="Patient's ability to slide heel from knee down the shin accurately with left leg.">
                                <select
                                    value={data.hksLeftResult ?? ''}
                                    onChange={e => setData(prev => ({ ...prev, hksLeftResult: (e.target.value as HKSResult) || null }))}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                    aria-label="HKS left side result"
                                >
                                    {HKS_OPTIONS.map(opt => (
                                        <option key={String(opt.value)} value={opt.value ?? ''}>{opt.label}</option>
                                    ))}
                                </select>
                            </FormField>
                            <FormField label="Right Side Result" tooltip="Patient's ability to slide heel from knee down the shin accurately with right leg.">
                                <select
                                    value={data.hksRightResult ?? ''}
                                    onChange={e => setData(prev => ({ ...prev, hksRightResult: (e.target.value as HKSResult) || null }))}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                    aria-label="HKS right side result"
                                >
                                    {HKS_OPTIONS.map(opt => (
                                        <option key={String(opt.value)} value={opt.value ?? ''}>{opt.label}</option>
                                    ))}
                                </select>
                            </FormField>
                        </div>
                    </div>
                )}
            </div>

            <FormFooter
                onBack={onBack}
                onSaveAndContinue={handleSaveAndContinue}
                isSaving={isSaving}
                hasChanges={hasAnyData}
                isValid={true}
                ctaRef={ctaRef}
                showEnterToast={showEnterToast}
                saveAndContinueLabel={hasAnyData ? 'Save Assessments' : 'Skip Assessments'}
            />
        </div>
    );
};

export default IbogaineCerebellarAssessmentForm;
