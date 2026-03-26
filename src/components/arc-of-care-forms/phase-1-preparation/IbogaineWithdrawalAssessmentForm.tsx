import React, { useState, useCallback } from 'react';
import { AlertTriangle, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { FormField } from '../shared/FormField';
import { NumberInput } from '../shared/NumberInput';
import { FormFooter } from '../shared/FormFooter';
import { useFormCompletion } from '../../../hooks/useFormCompletion';

/**
 * IbogaineWithdrawalAssessmentForm — WO-668
 *
 * Opt-in assessment cards for COWS, SOWS, BAWS, and ASI instruments.
 * All cards are elective — no card is a hard gate on Phase 2 entry.
 * Per Dr. Allen: practitioners activate whichever instruments apply
 * for the individual patient presentation.
 *
 * Data stored in: log_ibogaine_withdrawal_assessments (migration 083)
 * timing: 'pre' (Phase 1) | 'post' (Phase 3 re-administration, future WO)
 */

// ─── Types ───────────────────────────────────────────────────────────────────

/** COWS item scores — 11 items per clinical instrument spec */
export interface COWSItems {
    restingPulseRate: number;      // 0–4
    sweating: number;              // 0–4
    restlessness: number;          // 0–5
    pupilSize: number;             // 0–5
    boneJointAches: number;        // 0–4
    runnyNose: number;             // 0–4
    giUpset: number;               // 0–5
    tremor: number;                // 0–4
    yawning: number;               // 0–4
    anxietyIrritability: number;   // 0–4
    goosefleshSkin: number;        // 0–5
}

/** ASI 7-domain scores */
export interface ASIDomainScores {
    medical: number;         // 0–40
    employment: number;      // 0–40
    alcohol: number;         // 0–40
    drug: number;            // 0–40
    legal: number;           // 0–40
    familySocial: number;    // 0–40
    psychiatric: number;     // 0–40
}

export interface IbogaineWithdrawalData {
    // Which cards are active (practitioner-selected)
    cowsEnabled: boolean;
    sowsEnabled: boolean;
    bawsEnabled: boolean;
    asiEnabled: boolean;

    // COWS — 11 items + auto-calculated total
    cowsItems: COWSItems;

    // SOWS — aggregate score only (0–64)
    sowsTotalScore: number | null;

    // BAWS — aggregate score only (0–19)
    bawsTotalScore: number | null;

    // ASI — 7-domain scores + composite
    asiDomains: ASIDomainScores;
}

interface IbogaineWithdrawalAssessmentFormProps {
    onSave?: (data: IbogaineWithdrawalData) => void;
    initialData?: Partial<IbogaineWithdrawalData>;
    sessionId?: string;
    onComplete?: () => void;
    onBack?: () => void;
}

// ─── COWS item definitions ────────────────────────────────────────────────────
// Each item: { field, label, max, description, options[] }
const COWS_ITEMS: Array<{
    field: keyof COWSItems;
    label: string;
    max: number;
    options: Array<{ value: number; label: string }>;
}> = [
    {
        field: 'restingPulseRate',
        label: 'Resting Pulse Rate (bpm)',
        max: 4,
        options: [
            { value: 0, label: '0 — ≤80 bpm' },
            { value: 1, label: '1 — 81–100 bpm' },
            { value: 2, label: '2 — 101–120 bpm' },
            { value: 4, label: '4 — >120 bpm' },
        ],
    },
    {
        field: 'sweating',
        label: 'Sweating',
        max: 4,
        options: [
            { value: 0, label: '0 — No report of chills/flushing' },
            { value: 1, label: '1 — Subjective complaint, no flush' },
            { value: 2, label: '2 — Flushed or moist forehead' },
            { value: 3, label: '3 — Beads of sweat on forehead' },
            { value: 4, label: '4 — Sweat streaming from face' },
        ],
    },
    {
        field: 'restlessness',
        label: 'Restlessness',
        max: 5,
        options: [
            { value: 0, label: '0 — Able to sit still' },
            { value: 1, label: '1 — Reports difficulty sitting still' },
            { value: 3, label: '3 — Frequent shifting / leg movements' },
            { value: 5, label: '5 — Unable to sit still >a few seconds' },
        ],
    },
    {
        field: 'pupilSize',
        label: 'Pupil Size',
        max: 5,
        options: [
            { value: 0, label: '0 — No dilation; constricted if opioid use' },
            { value: 1, label: '1 — Possibly larger than normal' },
            { value: 2, label: '2 — Moderately dilated' },
            { value: 5, label: '5 — Maximally dilated; ≥5mm rim of iris' },
        ],
    },
    {
        field: 'boneJointAches',
        label: 'Bone or Joint Aches',
        max: 4,
        options: [
            { value: 0, label: '0 — Not present' },
            { value: 1, label: '1 — Mild diffuse discomfort' },
            { value: 2, label: '2 — Patient reports severe aches' },
            { value: 4, label: '4 — Patient rubbing joints / muscles' },
        ],
    },
    {
        field: 'runnyNose',
        label: 'Runny Nose or Tearing',
        max: 4,
        options: [
            { value: 0, label: '0 — Not present' },
            { value: 1, label: '1 — Nasal stuffiness or moist eyes' },
            { value: 2, label: '2 — Nose dripping or tearing' },
            { value: 4, label: '4 — Nose constantly dripping or tears streaming' },
        ],
    },
    {
        field: 'giUpset',
        label: 'GI Upset',
        max: 5,
        options: [
            { value: 0, label: '0 — None' },
            { value: 1, label: '1 — Stomach cramps' },
            { value: 2, label: '2 — Nausea or loose stool' },
            { value: 3, label: '3 — Vomiting or diarrhea' },
            { value: 5, label: '5 — Multiple episodes of vomiting or diarrhea' },
        ],
    },
    {
        field: 'tremor',
        label: 'Tremor',
        max: 4,
        options: [
            { value: 0, label: '0 — No tremor' },
            { value: 1, label: '1 — Can be felt but not observed' },
            { value: 2, label: '2 — Slight tremor observable' },
            { value: 4, label: '4 — Gross tremor or muscle twitching' },
        ],
    },
    {
        field: 'yawning',
        label: 'Yawning',
        max: 4,
        options: [
            { value: 0, label: '0 — No yawning' },
            { value: 1, label: '1 — Yawning once or twice in observation' },
            { value: 2, label: '2 — Yawning 3 or more times' },
            { value: 4, label: '4 — Yawning multiple times per minute' },
        ],
    },
    {
        field: 'anxietyIrritability',
        label: 'Anxiety or Irritability',
        max: 4,
        options: [
            { value: 0, label: '0 — None' },
            { value: 1, label: '1 — Patient reports irritability or anxiousness' },
            { value: 2, label: '2 — Visibly irritable or anxious' },
            { value: 4, label: '4 — Patient so irritable or anxious that participation is difficult' },
        ],
    },
    {
        field: 'goosefleshSkin',
        label: 'Gooseflesh Skin',
        max: 5,
        options: [
            { value: 0, label: '0 — Skin smooth' },
            { value: 3, label: '3 — Piloerection of skin can be felt' },
            { value: 5, label: '5 — Prominent piloerection' },
        ],
    },
];

/** Calculate COWS total score from items */
function calcCowsTotal(items: COWSItems): number {
    return Object.values(items).reduce((sum, v) => sum + (v || 0), 0);
}

/** COWS severity interpretation */
function cowsSeverityLabel(score: number): { label: string; colorClass: string } {
    if (score <= 12) return { label: 'Mild', colorClass: 'text-teal-300' };
    if (score <= 24) return { label: 'Moderate', colorClass: 'text-amber-300' };
    if (score <= 36) return { label: 'Moderately Severe', colorClass: 'text-orange-300' };
    return { label: 'Severe', colorClass: 'text-red-300' };
}

/** Calculate ASI composite */
function calcAsiComposite(domains: ASIDomainScores): number {
    return Object.values(domains).reduce((sum, v) => sum + (v || 0), 0);
}

// ─── Default data factory ─────────────────────────────────────────────────────
const DEFAULT_COWS_ITEMS: COWSItems = {
    restingPulseRate: 0,
    sweating: 0,
    restlessness: 0,
    pupilSize: 0,
    boneJointAches: 0,
    runnyNose: 0,
    giUpset: 0,
    tremor: 0,
    yawning: 0,
    anxietyIrritability: 0,
    goosefleshSkin: 0,
};

const DEFAULT_ASI: ASIDomainScores = {
    medical: 0,
    employment: 0,
    alcohol: 0,
    drug: 0,
    legal: 0,
    familySocial: 0,
    psychiatric: 0,
};

// ─── Component ───────────────────────────────────────────────────────────────
const IbogaineWithdrawalAssessmentForm: React.FC<IbogaineWithdrawalAssessmentFormProps> = ({
    onSave,
    initialData = {},
    sessionId,
    onComplete,
    onBack,
}) => {
    const [isSaving, setIsSaving] = useState(false);

    const [data, setData] = useState<IbogaineWithdrawalData>({
        cowsEnabled: false,
        sowsEnabled: false,
        bawsEnabled: false,
        asiEnabled: false,
        cowsItems: initialData.cowsItems ?? { ...DEFAULT_COWS_ITEMS },
        sowsTotalScore: initialData.sowsTotalScore ?? null,
        bawsTotalScore: initialData.bawsTotalScore ?? null,
        asiDomains: initialData.asiDomains ?? { ...DEFAULT_ASI },
        ...initialData,
    });

    // Expanded state for each card (starts collapsed, toggled by practitioner)
    const [expanded, setExpanded] = useState({
        cows: false,
        sows: false,
        baws: false,
        asi: false,
    });

    const toggleCard = useCallback((card: 'cows' | 'sows' | 'baws' | 'asi') => {
        setData(prev => ({
            ...prev,
            [`${card}Enabled`]: !prev[`${card}Enabled` as keyof IbogaineWithdrawalData],
        }));
        setExpanded(prev => ({ ...prev, [card]: !prev[card] }));
    }, []);

    const updateCowsItem = useCallback((field: keyof COWSItems, value: number) => {
        setData(prev => ({
            ...prev,
            cowsItems: { ...prev.cowsItems, [field]: value },
        }));
    }, []);

    const updateAsiDomain = useCallback((domain: keyof ASIDomainScores, value: number) => {
        setData(prev => ({
            ...prev,
            asiDomains: { ...prev.asiDomains, [domain]: value },
        }));
    }, []);

    const cowsTotal = calcCowsTotal(data.cowsItems);
    const cowsSeverity = cowsSeverityLabel(cowsTotal);
    const asiComposite = calcAsiComposite(data.asiDomains);

    // At least one card must be enabled and have a score to be considered complete
    const hasAnyData =
        (data.cowsEnabled && cowsTotal > 0) ||
        (data.sowsEnabled && data.sowsTotalScore !== null) ||
        (data.bawsEnabled && data.bawsTotalScore !== null) ||
        (data.asiEnabled && asiComposite > 0);

    const handleSaveAndContinue = () => {
        setIsSaving(true);
        onSave?.(data);
        setTimeout(() => {
            setIsSaving(false);
            onComplete?.();
        }, 400);
    };

    const { ctaRef, showEnterToast } = useFormCompletion(hasAnyData, handleSaveAndContinue, {
        storageKey: `ppn_ibogaine_withdrawal_${sessionId ?? 'default'}`,
        draftValue: data,
    });

    // ── Card header shared styles ─────────────────────────────────────────────
    const cardHeaderCls = 'flex items-center gap-4 p-5 cursor-pointer select-none rounded-2xl transition-all';

    return (
        <div className="max-w-5xl mx-auto space-y-4">

            {/* Advisory banner */}
            <div className="flex items-start gap-3 px-4 py-3 bg-amber-950/30 border border-amber-500/30 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="ppn-meta text-amber-300">
                    All assessment cards are <strong>optional</strong> and practitioner-selected.
                    Activate those that are clinically appropriate for this patient.
                    No assessment is a required gate for Phase 2 entry.
                </p>
            </div>

            {/* ── COWS Card ─────────────────────────────────────────────────── */}
            <div className={`bg-slate-900/60 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all ${data.cowsEnabled ? 'border-indigo-500/40' : 'border-slate-700/40'}`}>
                <button
                    type="button"
                    className={`${cardHeaderCls} w-full ${data.cowsEnabled ? 'bg-indigo-900/20 hover:bg-indigo-900/30' : 'hover:bg-slate-800/40'}`}
                    onClick={() => toggleCard('cows')}
                    aria-expanded={data.cowsEnabled}
                    aria-controls="cows-panel"
                >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${data.cowsEnabled ? 'bg-indigo-500/20 border-indigo-500/40' : 'bg-slate-800/60 border-slate-700/50'}`}>
                        <span className={`material-symbols-outlined text-lg ${data.cowsEnabled ? 'text-indigo-400' : 'text-slate-500'}`} aria-hidden="true">monitor_heart</span>
                    </div>
                    <div className="flex-1 text-left">
                        <p className="ppn-card-title text-slate-200">COWS — Clinical Opiate Withdrawal Scale</p>
                        <p className="ppn-meta text-slate-500 mt-0.5">11-item clinician-rated scale · Total 0–55</p>
                    </div>
                    {data.cowsEnabled && cowsTotal > 0 && (
                        <span className={`ppn-meta font-black mr-2 ${cowsSeverity.colorClass}`}>
                            {cowsTotal}/55 — {cowsSeverity.label}
                        </span>
                    )}
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${data.cowsEnabled ? 'bg-indigo-500 border-indigo-400' : 'border-slate-600'}`} aria-hidden="true">
                        {data.cowsEnabled && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    {data.cowsEnabled ? <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden="true" /> : <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" aria-hidden="true" />}
                </button>

                {data.cowsEnabled && (
                    <div id="cows-panel" className="px-5 pb-5 space-y-3 border-t border-slate-800/60 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {COWS_ITEMS.map(item => (
                                <FormField key={item.field} label={item.label} tooltip={`COWS item: max ${item.max} points`}>
                                    <select
                                        value={data.cowsItems[item.field]}
                                        onChange={e => updateCowsItem(item.field, parseInt(e.target.value, 10))}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                        aria-label={`COWS ${item.label} score`}
                                    >
                                        {item.options.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </FormField>
                            ))}
                        </div>
                        {/* Auto-calculated total */}
                        <div className="flex items-center justify-between px-4 py-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl mt-2">
                            <span className="ppn-meta text-slate-400">COWS Total Score</span>
                            <div className="flex items-center gap-3">
                                <span className={`text-xl font-black font-mono ${cowsSeverity.colorClass}`}>
                                    {cowsTotal} / 55
                                </span>
                                <span className={`px-2 py-0.5 rounded border ppn-meta font-semibold ${cowsSeverity.colorClass} bg-slate-900/60`}>
                                    {cowsSeverity.label}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── SOWS Card ─────────────────────────────────────────────────── */}
            <div className={`bg-slate-900/60 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all ${data.sowsEnabled ? 'border-violet-500/40' : 'border-slate-700/40'}`}>
                <button
                    type="button"
                    className={`${cardHeaderCls} w-full ${data.sowsEnabled ? 'bg-violet-900/20 hover:bg-violet-900/30' : 'hover:bg-slate-800/40'}`}
                    onClick={() => toggleCard('sows')}
                    aria-expanded={data.sowsEnabled}
                    aria-controls="sows-panel"
                >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${data.sowsEnabled ? 'bg-violet-500/20 border-violet-500/40' : 'bg-slate-800/60 border-slate-700/50'}`}>
                        <span className={`material-symbols-outlined text-lg ${data.sowsEnabled ? 'text-violet-400' : 'text-slate-500'}`} aria-hidden="true">self_improvement</span>
                    </div>
                    <div className="flex-1 text-left">
                        <p className="ppn-card-title text-slate-200">SOWS — Subjective Opiate Withdrawal Scale</p>
                        <p className="ppn-meta text-slate-500 mt-0.5">Patient-rated · Total 0–64</p>
                    </div>
                    {data.sowsEnabled && data.sowsTotalScore !== null && (
                        <span className="ppn-meta font-black text-violet-300 mr-2">{data.sowsTotalScore} / 64</span>
                    )}
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${data.sowsEnabled ? 'bg-violet-500 border-violet-400' : 'border-slate-600'}`} aria-hidden="true">
                        {data.sowsEnabled && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    {data.sowsEnabled ? <ChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true" /> : <ChevronRight className="w-4 h-4 text-slate-600" aria-hidden="true" />}
                </button>

                {data.sowsEnabled && (
                    <div id="sows-panel" className="px-5 pb-5 border-t border-slate-800/60 pt-4">
                        <FormField
                            label="SOWS Total Score (0–64)"
                            tooltip="Patient-reported score. Administer the 16-item SOWS checklist to the patient and enter the total."
                        >
                            <NumberInput
                                value={data.sowsTotalScore ?? undefined}
                                onChange={v => setData(prev => ({ ...prev, sowsTotalScore: v ?? null }))}
                                min={0}
                                max={64}
                                step={1}
                                placeholder="0"
                            />
                        </FormField>
                    </div>
                )}
            </div>

            {/* ── BAWS Card ─────────────────────────────────────────────────── */}
            <div className={`bg-slate-900/60 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all ${data.bawsEnabled ? 'border-amber-500/40' : 'border-slate-700/40'}`}>
                <button
                    type="button"
                    className={`${cardHeaderCls} w-full ${data.bawsEnabled ? 'bg-amber-900/20 hover:bg-amber-900/30' : 'hover:bg-slate-800/40'}`}
                    onClick={() => toggleCard('baws')}
                    aria-expanded={data.bawsEnabled}
                    aria-controls="baws-panel"
                >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${data.bawsEnabled ? 'bg-amber-500/20 border-amber-500/40' : 'bg-slate-800/60 border-slate-700/50'}`}>
                        <span className={`material-symbols-outlined text-lg ${data.bawsEnabled ? 'text-amber-400' : 'text-slate-500'}`} aria-hidden="true">liquor</span>
                    </div>
                    <div className="flex-1 text-left">
                        <p className="ppn-card-title text-slate-200">BAWS — Brief Alcohol Withdrawal Scale</p>
                        <p className="ppn-meta text-slate-500 mt-0.5">AUD withdrawal severity · Total 0–19</p>
                    </div>
                    {data.bawsEnabled && data.bawsTotalScore !== null && (
                        <span className="ppn-meta font-black text-amber-300 mr-2">{data.bawsTotalScore} / 19</span>
                    )}
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${data.bawsEnabled ? 'bg-amber-500 border-amber-400' : 'border-slate-600'}`} aria-hidden="true">
                        {data.bawsEnabled && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    {data.bawsEnabled ? <ChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true" /> : <ChevronRight className="w-4 h-4 text-slate-600" aria-hidden="true" />}
                </button>

                {data.bawsEnabled && (
                    <div id="baws-panel" className="px-5 pb-5 border-t border-slate-800/60 pt-4">
                        <FormField
                            label="BAWS Total Score (0–19)"
                            tooltip="Administer the Brief Alcohol Withdrawal Scale and enter the total score. Score ≥10 indicates severe withdrawal requiring medical management."
                        >
                            <NumberInput
                                value={data.bawsTotalScore ?? undefined}
                                onChange={v => setData(prev => ({ ...prev, bawsTotalScore: v ?? null }))}
                                min={0}
                                max={19}
                                step={1}
                                placeholder="0"
                            />
                        </FormField>
                    </div>
                )}
            </div>

            {/* ── ASI Card ──────────────────────────────────────────────────── */}
            <div className={`bg-slate-900/60 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all ${data.asiEnabled ? 'border-emerald-500/40' : 'border-slate-700/40'}`}>
                <button
                    type="button"
                    className={`${cardHeaderCls} w-full ${data.asiEnabled ? 'bg-emerald-900/15 hover:bg-emerald-900/25' : 'hover:bg-slate-800/40'}`}
                    onClick={() => toggleCard('asi')}
                    aria-expanded={data.asiEnabled}
                    aria-controls="asi-panel"
                >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${data.asiEnabled ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-slate-800/60 border-slate-700/50'}`}>
                        <span className={`material-symbols-outlined text-lg ${data.asiEnabled ? 'text-emerald-400' : 'text-slate-500'}`} aria-hidden="true">assignment</span>
                    </div>
                    <div className="flex-1 text-left">
                        <p className="ppn-card-title text-slate-200">ASI — Addiction Severity Index</p>
                        <p className="ppn-meta text-slate-500 mt-0.5">7-domain structured intake · Composite 0–280</p>
                    </div>
                    {data.asiEnabled && asiComposite > 0 && (
                        <span className="ppn-meta font-black text-emerald-300 mr-2">{asiComposite} / 280</span>
                    )}
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${data.asiEnabled ? 'bg-emerald-500 border-emerald-400' : 'border-slate-600'}`} aria-hidden="true">
                        {data.asiEnabled && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    {data.asiEnabled ? <ChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true" /> : <ChevronRight className="w-4 h-4 text-slate-600" aria-hidden="true" />}
                </button>

                {data.asiEnabled && (
                    <div id="asi-panel" className="px-5 pb-5 border-t border-slate-800/60 pt-4 space-y-3">
                        <p className="ppn-meta text-slate-500">Enter domain severity scores (0 = no problem, 40 = extreme severity).</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(Object.keys(DEFAULT_ASI) as Array<keyof ASIDomainScores>).map(domain => (
                                <FormField
                                    key={domain}
                                    label={`${domain.charAt(0).toUpperCase() + domain.slice(1).replace(/([A-Z])/g, ' $1')} (0–40)`}
                                    tooltip={`ASI ${domain} domain severity score`}
                                >
                                    <NumberInput
                                        value={data.asiDomains[domain]}
                                        onChange={v => updateAsiDomain(domain, v ?? 0)}
                                        min={0}
                                        max={40}
                                        step={1}
                                        placeholder="0"
                                    />
                                </FormField>
                            ))}
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl">
                            <span className="ppn-meta text-slate-400">ASI Composite Score</span>
                            <span className="text-xl font-black font-mono text-emerald-300">{asiComposite} / 280</span>
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

export default IbogaineWithdrawalAssessmentForm;
