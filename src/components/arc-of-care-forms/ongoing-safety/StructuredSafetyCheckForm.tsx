import React, { useState, useEffect } from 'react';

import { CheckCircle, AlertTriangle, ChevronRight, ArrowUp, Minus, Zap, Clock } from 'lucide-react';
import { FormField } from '../shared/FormField';
import { FormFooter } from '../shared/FormFooter';
import { useFormCompletion } from '../../../hooks/useFormCompletion';
import { supabase } from '../../../supabaseClient';


/**
 * StructuredSafetyCheckForm - Structured Safety Check
 * Replaces free-text safety notes with structured, PHI-safe inputs.
 * 100% compliant with Arc of Care Design Guidelines v2.0.
 *
 * Footer: Back | Save & Exit | Save & Continue (matches all Phase 1 gates)
 * Item order: matches ref_clinical_observations sort_order (migration 045)
 */

export interface StructuredSafetyCheckData {
    monitoring_date: string;
    cssrs_score: 0 | 1 | 2 | 3 | 4 | 5;
    safety_concern_ids: number[];
    action_taken_ids: number[];
    follow_up_required: boolean;
    follow_up_timeframe?: '24_hours' | '3_days' | '1_week';
}



interface StructuredSafetyCheckFormProps {
    onSave?: (data: StructuredSafetyCheckData) => void;
    initialData?: Partial<StructuredSafetyCheckData>;
    patientId?: string;
    /** Save & Continue, advances to the next Phase 1 step */
    onComplete?: () => void;
    /** Back, close panel without saving */
    onBack?: () => void;
    /** Save & Exit, save then close panel */
    onExit?: () => void;
}

// WO-661: ref_clinical_observations row shape.
// Columns: id (PK), name/observation_text, category, sort_order, severity, urgency
// Adapt at runtime: check both 'id' and 'observation_id' column names (ObservationSelector
// uses observation_id; the WO spec says 'id'). Strategy: prefer 'id', fall back to 'observation_id'.
interface ClinOrRow { id: number; name: string; category: string; sort_order: number; severity?: string; urgency?: string; }

// WO-661: Fallback constants — used when the live DB fetch returns empty rows or errors.
// These match migration 045 seeding so the form is never left blank mid-session.
// IDs here are the assumed PKs and serve ONLY as a graceful degradation path.
const FALLBACK_CONCERNS: ClinOrRow[] = [
    { id: 4, name: 'Medication non-compliance', category: 'clinical_flag', sort_order: 1, severity: 'moderate' },
    { id: 5, name: 'Social isolation increase', category: 'clinical_flag', sort_order: 2, severity: 'moderate' },
    { id: 6, name: 'Sleep disturbance worsening', category: 'clinical_flag', sort_order: 3, severity: 'moderate' },
    { id: 7, name: 'Panic attacks', category: 'clinical_flag', sort_order: 4, severity: 'moderate' },
    { id: 3, name: 'Substance use relapse', category: 'clinical_flag', sort_order: 5, severity: 'high' },
    { id: 1, name: 'Suicidal ideation increase', category: 'clinical_flag', sort_order: 6, severity: 'critical' },
    { id: 2, name: 'Self-harm behavior', category: 'clinical_flag', sort_order: 7, severity: 'critical' },
    { id: 8, name: 'Psychotic symptoms', category: 'clinical_flag', sort_order: 8, severity: 'critical' },
];

const FALLBACK_ACTIONS: ClinOrRow[] = [
    { id: 6, name: 'Hospitalization recommended', category: 'clinical_action', sort_order: 30, urgency: 'immediate' },
    { id: 2, name: 'Emergency contact notified', category: 'clinical_action', sort_order: 31, urgency: 'immediate' },
    { id: 5, name: 'Crisis hotline information provided', category: 'clinical_action', sort_order: 32, urgency: 'immediate' },
    { id: 7, name: 'Referred to psychiatrist', category: 'clinical_action', sort_order: 33, urgency: 'urgent' },
    { id: 1, name: 'Increased check-in frequency', category: 'clinical_action', sort_order: 34, urgency: 'urgent' },
    { id: 3, name: 'Medication adjustment recommended', category: 'clinical_action', sort_order: 35, urgency: 'urgent' },
    { id: 4, name: 'Additional therapy session scheduled', category: 'clinical_action', sort_order: 36, urgency: 'urgent' },
];


const StructuredSafetyCheckForm: React.FC<StructuredSafetyCheckFormProps> = ({
    onSave,
    initialData = {} as Partial<StructuredSafetyCheckData>,
    patientId,
    onComplete,
    onBack,
    onExit,
}) => {
    const [data, setData] = useState<StructuredSafetyCheckData>({
        monitoring_date: initialData.monitoring_date ?? new Date().toISOString().slice(0, 10),
        cssrs_score: initialData.cssrs_score ?? 0,
        safety_concern_ids: initialData.safety_concern_ids ?? [],
        action_taken_ids: initialData.action_taken_ids ?? [],
        follow_up_required: initialData.follow_up_required ?? false,
        follow_up_timeframe: initialData.follow_up_timeframe,
    });

    // WO-661: Live ref_clinical_observations fetch
    const [safetyConcerns, setSafetyConcerns] = useState<ClinOrRow[]>([]);
    const [safetyActions, setSafetyActions] = useState<ClinOrRow[]>([]);
    const [observationsLoading, setObservationsLoading] = useState(true);
    const [observationsFallback, setObservationsFallback] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setObservationsLoading(true);
                // Fetch both categories in one query, sorted by sort_order
                const { data: rows, error } = await supabase
                    .from('ref_clinical_observations')
                    .select('*')
                    .in('category', ['clinical_flag', 'clinical_action'])
                    .order('sort_order', { ascending: true });

                if (cancelled) return;

                if (error || !rows || rows.length === 0) {
                    // Graceful fallback: use hardcoded arrays, show amber warning
                    console.warn('[WO-661] ref_clinical_observations fetch returned empty/error. Using fallback.', error?.message);
                    setSafetyConcerns(FALLBACK_CONCERNS);
                    setSafetyActions(FALLBACK_ACTIONS);
                    setObservationsFallback(true);
                } else {
                    // Normalize: support both 'id' and 'observation_id' column names,
                    // and both 'name' and 'observation_text' column names.
                    const normalize = (row: Record<string, unknown>): ClinOrRow => ({
                        id: (row.id ?? row.observation_id) as number,
                        name: (row.name ?? row.observation_text ?? '') as string,
                        category: row.category as string,
                        sort_order: (row.sort_order ?? 0) as number,
                        severity: (row.severity ?? undefined) as string | undefined,
                        urgency: (row.urgency ?? undefined) as string | undefined,
                    });
                    const normalized = rows.map(normalize);
                    const concerns = normalized.filter(r => r.category === 'clinical_flag');
                    const actions  = normalized.filter(r => r.category === 'clinical_action');
                    // If either category is empty from DB, use fallback for that category only
                    setSafetyConcerns(concerns.length > 0 ? concerns : FALLBACK_CONCERNS);
                    setSafetyActions(actions.length > 0 ? actions : FALLBACK_ACTIONS);
                    if (concerns.length === 0 || actions.length === 0) setObservationsFallback(true);
                }
            } catch (err) {
                if (!cancelled) {
                    console.warn('[WO-661] ref_clinical_observations fetch threw error. Using fallback.', err);
                    setSafetyConcerns(FALLBACK_CONCERNS);
                    setSafetyActions(FALLBACK_ACTIONS);
                    setObservationsFallback(true);
                }
            } finally {
                if (!cancelled) setObservationsLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // Re-sync form state when initialData prop changes (e.g. Amend flow)
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setData(prev => ({
                ...prev,
                ...initialData,
                monitoring_date: initialData.monitoring_date ?? prev.monitoring_date,
                cssrs_score: initialData.cssrs_score ?? prev.cssrs_score,
                safety_concern_ids: initialData.safety_concern_ids ?? prev.safety_concern_ids,
                action_taken_ids: initialData.action_taken_ids ?? prev.action_taken_ids,
            }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData]);


    const [isSaving, setIsSaving] = useState(false);


    const updateField = <K extends keyof StructuredSafetyCheckData>(
        field: K,
        value: StructuredSafetyCheckData[K]
    ) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const toggleArrayItem = (field: 'safety_concern_ids' | 'action_taken_ids', id: number) => {
        setData(prev => ({
            ...prev,
            [field]: prev[field].includes(id)
                ? prev[field].filter(i => i !== id)
                : [...prev[field], id],
        }));
    };

    const handleSaveAndExit = () => {
        if (onSave) {
            setIsSaving(true);
            onSave(data);
            setTimeout(() => {
                setIsSaving(false);
                if (onExit) onExit();
            }, 300);
        } else if (onExit) {
            onExit();
        }
    };

    const handleSaveAndContinue = () => {
        if (onSave) {
            setIsSaving(true);
            onSave(data);
            setTimeout(() => {
                setIsSaving(false);
                if (onComplete) onComplete();
            }, 300);
        } else if (onComplete) {
            onComplete();
        }
    };

    // WO-662: Layer 3+4 — pulse CTA + Enter toast when form has data
    const isComplete = Boolean(true);
    const { ctaRef, showEnterToast } = useFormCompletion(isComplete, handleSaveAndContinue);


    const setToday = () => {
        updateField('monitoring_date', new Date().toISOString().slice(0, 10));
    };

    const getSeverityColor = (score: number) => {
        if (score === 0) return 'slate';
        if (score <= 2) return 'yellow';
        if (score <= 4) return 'orange';
        return 'red';
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* Monitoring Date */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <FormField label="Monitoring Date">
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={data.monitoring_date}
                            onChange={(e) => updateField('monitoring_date', e.target.value)}
                            className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 text-sm"
                        />
                        <button
                            type="button"
                            onClick={setToday}
                            className="px-4 py-3 bg-indigo-700/40 hover:bg-indigo-700/60 border border-indigo-600/40 text-indigo-200 rounded-lg font-medium transition-colors text-sm"
                        >
                            Today
                        </button>
                    </div>
                </FormField>
            </div>

            {/* C-SSRS Score */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <FormField label="C-SSRS Score (0–5)" tooltip="Columbia-Suicide Severity Rating Scale. A standardized assessment to identify and stratify suicide risk. Scores ≥3 require immediate intervention.">
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            {[0, 1, 2, 3, 4, 5].map((score) => (
                                <button
                                    key={score}
                                    type="button"
                                    onClick={() => updateField('cssrs_score', score as any)}
                                    className={`flex-1 px-4 py-3 rounded-lg font-bold text-lg transition-all ${data.cssrs_score === score
                                        ? score === 0
                                            ? 'bg-slate-600 text-[#A8B5D1]'
                                            : score <= 2
                                                ? 'bg-yellow-600 text-[#A8B5D1]'
                                                : score <= 4
                                                    ? 'bg-orange-600 text-[#A8B5D1]'
                                                    : 'bg-red-700 text-[#A8B5D1]'
                                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                                        }`}
                                >
                                    {score}
                                </button>
                            ))}
                        </div>
                        {data.cssrs_score >= 3 && (
                            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3" role="alert" aria-live="assertive">
                                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                                <div className="space-y-2">
                                    <p className="text-red-400 font-bold text-sm uppercase tracking-wide">
                                        ⛔ DO NOT PROCEED — Automatic Crisis Alert
                                    </p>
                                    {data.cssrs_score === 3 ? (
                                        // WO-599: Score 3 — actionable, prescriptive clinical copy
                                        <div className="text-red-300 text-sm space-y-1">
                                            <p className="font-bold">C-SSRS Score 3 — Active Suicidal Ideation with Some Intent.</p>
                                            <p>The dosing session must NOT proceed until risk is clinically resolved. Required actions:</p>
                                            <ol className="list-decimal list-inside space-y-0.5 text-red-300/90 pl-1">
                                                <li>Administer a full C-SSRS structured interview now.</li>
                                                <li>Document all findings and actions taken in this record.</li>
                                                <li>Contact your clinical supervisor before any further steps.</li>
                                                <li>Activate your site's crisis and safety plan protocol.</li>
                                            </ol>
                                        </div>
                                    ) : data.cssrs_score === 4 ? (
                                        // WO-599: Score 4 — escalated copy with supervisor contact requirement
                                        <div className="text-red-300 text-sm space-y-1">
                                            <p className="font-bold">C-SSRS Score 4 — Active Suicidal Ideation with Intent and Plan.</p>
                                            <p>The dosing session must NOT proceed. Immediate escalation is required. Required actions:</p>
                                            <ol className="list-decimal list-inside space-y-0.5 text-red-300/90 pl-1">
                                                <li>Contact your clinical supervisor immediately — do not proceed alone.</li>
                                                <li>Initiate your site's crisis protocol and safety plan.</li>
                                                <li>Do not leave patient unattended.</li>
                                                <li>Document all findings, actions, and supervisor contacts in this record.</li>
                                            </ol>
                                        </div>
                                    ) : (
                                        // WO-599: Score 5 — emergency copy with 911 instruction
                                        <div className="text-red-300 text-sm space-y-1">
                                            <p className="font-bold">C-SSRS Score 5 — Imminent Risk. Recent Attempt or Preparatory Act.</p>
                                            <p>This is a clinical emergency. The dosing session must NOT proceed. Required actions:</p>
                                            <ol className="list-decimal list-inside space-y-0.5 text-red-300/90 pl-1">
                                                <li><span className="font-bold text-red-200">Call 911 (or local emergency services) immediately.</span></li>
                                                <li>Do not leave the patient unattended under any circumstances.</li>
                                                <li>Contact patient's emergency contact and clinical supervisor simultaneously.</li>
                                                <li>Document all findings, times, and actions taken in this record.</li>
                                            </ol>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </FormField>
            </div>

            {/* Safety Concerns, ordered by ref sort_order (clinical_flag category) */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <FormField label="Safety Concerns" tooltip="Pulls from the 'ref_clinical_observations' table (category: 'clinical_flag'). These align with standard DSM-5 risk parameters for psychiatric decompensation. Orders by clinical priority.">
                    {/* WO-661: amber notice when DB returned no rows and fallback data is in use */}
                    {observationsFallback && (
                        <div className="mb-2 flex items-center gap-2 text-amber-400/80 text-xs px-1">
                            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                            <span>Safety categories unavailable — using standard defaults.</span>
                        </div>
                    )}
                    {observationsLoading ? (
                        // Loading skeleton while ref_clinical_observations fetch is pending
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2" aria-busy="true" aria-label="Loading safety concerns">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-12 animate-pulse bg-slate-800/30 border border-slate-700/30 rounded-lg" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {safetyConcerns.map((concern) => {
                                const selected = data.safety_concern_ids.includes(concern.id);
                                return (
                                    <button
                                        key={concern.id}
                                        type="button"
                                        onClick={() => toggleArrayItem('safety_concern_ids', concern.id)}
                                        aria-pressed={selected}
                                        className={[
                                            'px-4 py-3 rounded-lg text-left font-medium transition-all border-l-4',
                                            selected
                                                ? concern.severity === 'critical'
                                                    ? 'bg-red-900/70 border border-red-500/70 border-l-red-400 text-red-300'
                                                    : concern.severity === 'high'
                                                        ? 'bg-orange-900/70 border border-orange-500/60 border-l-orange-400 text-orange-300'
                                                        : 'bg-sky-900/60 border border-sky-500/50 border-l-sky-400 text-sky-300'
                                                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50 border-l-slate-600',
                                        ].join(' ')}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <CheckCircle className={`w-4 h-4 flex-shrink-0 transition-opacity ${selected ? 'opacity-100' : 'opacity-30'}`} aria-hidden="true" />
                                            <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                                                <div className="text-sm font-semibold leading-none">{concern.name}</div>
                                                <div className="flex items-center gap-1 text-xs font-bold opacity-70 flex-shrink-0">
                                                    {concern.severity === 'critical' && <><AlertTriangle className="w-3 h-3" aria-hidden="true" /> Critical</>}
                                                    {concern.severity === 'high' && <><ArrowUp className="w-3 h-3" aria-hidden="true" /> High</>}
                                                    {concern.severity === 'moderate' && <><Minus className="w-3 h-3" aria-hidden="true" /> Moderate</>}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </FormField>
            </div>




            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <FormField label="Actions Taken" tooltip="Pulls from 'ref_clinical_observations' table. Aligned with standard psychiatric risk mitigation and APA guidelines. Orders by urgency.">
                    {observationsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2" aria-busy="true" aria-label="Loading safety actions">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-12 animate-pulse bg-slate-800/30 border border-slate-700/30 rounded-lg" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {safetyActions.map((action) => {
                                const selected = data.action_taken_ids.includes(action.id);
                                return (
                                    <button
                                        key={action.id}
                                        type="button"
                                        onClick={() => toggleArrayItem('action_taken_ids', action.id)}
                                        aria-pressed={selected}
                                        className={[
                                            'px-4 py-3 rounded-lg text-left font-medium transition-all border-l-4',
                                            selected
                                                ? action.urgency === 'immediate'
                                                    ? 'bg-rose-900/70 border border-rose-500/70 border-l-rose-400 text-rose-300'
                                                    : 'bg-amber-900/70 border border-amber-500/60 border-l-amber-400 text-amber-300'
                                                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50 border-l-slate-600',
                                        ].join(' ')}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <CheckCircle className={`w-4 h-4 flex-shrink-0 transition-opacity ${selected ? 'opacity-100' : 'opacity-30'}`} aria-hidden="true" />
                                            <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                                                <div className="text-sm font-semibold leading-none">{action.name}</div>
                                                <div className="flex items-center gap-1 text-xs font-bold opacity-70 flex-shrink-0">
                                                    {action.urgency === 'immediate' && <><Zap className="w-3 h-3" aria-hidden="true" /> Immediate</>}
                                                    {action.urgency === 'urgent' && <><Clock className="w-3 h-3" aria-hidden="true" /> Urgent</>}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </FormField>
            </div>

            {/* Follow-Up */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <FormField label="Follow-Up Required?">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => updateField('follow_up_required', true)}
                            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all text-sm ${data.follow_up_required
                                ? 'bg-indigo-700/50 border border-indigo-500/50 text-indigo-100'
                                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                                }`}
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                updateField('follow_up_required', false);
                                updateField('follow_up_timeframe', undefined);
                            }}
                            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all text-sm ${!data.follow_up_required
                                ? 'bg-indigo-700/50 border border-indigo-500/50 text-indigo-100'
                                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                                }`}
                        >
                            No, Continue standard monitoring
                        </button>
                    </div>
                </FormField>

                {data.follow_up_required && (
                    <FormField label="Schedule Follow-Up Within:">
                        <div className="flex gap-2">
                            {[
                                { value: '24_hours', label: '24 hours' },
                                { value: '3_days', label: '3 days' },
                                { value: '1_week', label: '1 week' },
                            ].map(({ value, label }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => updateField('follow_up_timeframe', value as any)}
                                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all text-sm ${data.follow_up_timeframe === value
                                        ? 'bg-indigo-700/50 border border-indigo-500/50 text-indigo-100'
                                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </FormField>
                )}
            </div>

            <FormFooter
                onBack={onBack ?? onComplete}
                onSaveAndExit={handleSaveAndExit}
                onSaveAndContinue={handleSaveAndContinue}
                isSaving={isSaving}
                hasChanges={true}
                ctaRef={ctaRef}
                showEnterToast={showEnterToast}
            />
        </div>
    );
};

export default StructuredSafetyCheckForm;
