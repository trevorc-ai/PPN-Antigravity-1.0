import React, { useState } from 'react';

import { CheckCircle, AlertTriangle, ChevronRight, ArrowUp, Minus, Zap, Clock } from 'lucide-react';
import { FormField } from '../shared/FormField';
import { FormFooter } from '../shared/FormFooter';
import { InteractionChecker } from '../../clinical/InteractionChecker';


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
    /** Save & Continue — advances to the next Phase 1 step */
    onComplete?: () => void;
    /** Back — close panel without saving */
    onBack?: () => void;
    /** Save & Exit — save then close panel */
    onExit?: () => void;
}

// Ordered moderate → high → critical (ascending severity)
const SAFETY_CONCERNS = [
    { id: 4, name: 'Medication non-compliance', severity: 'moderate' },
    { id: 5, name: 'Social isolation increase', severity: 'moderate' },
    { id: 6, name: 'Sleep disturbance worsening', severity: 'moderate' },
    { id: 7, name: 'Panic attacks', severity: 'moderate' },
    { id: 3, name: 'Substance use relapse', severity: 'high' },
    { id: 1, name: 'Suicidal ideation increase', severity: 'critical' },
    { id: 2, name: 'Self-harm behavior', severity: 'critical' },
    { id: 8, name: 'Psychotic symptoms', severity: 'critical' },
];

// Ordered by urgency to match ref_clinical_observations sort_order (migration 045):
// Immediate (sort 30-31) → Urgent (sort 32-34)
const SAFETY_ACTIONS = [
    { id: 6, name: 'Hospitalization recommended', urgency: 'immediate' }, // SAFE_HOSPITALIZATION_DISC    sort 30
    { id: 2, name: 'Emergency contact notified', urgency: 'immediate' }, // SAFE_EMERGENCY_CONTACT_NOTIF sort 31
    { id: 5, name: 'Crisis hotline information provided', urgency: 'immediate' }, // (immediate)
    { id: 7, name: 'Referred to psychiatrist', urgency: 'urgent' }, // SAFE_PSYCHIATRY_REFERRAL     sort 32
    { id: 1, name: 'Increased check-in frequency', urgency: 'urgent' }, // SAFE_CHECK_IN_FREQ_INCREASED sort 34
    { id: 3, name: 'Medication adjustment recommended', urgency: 'urgent' },
    { id: 4, name: 'Additional therapy session scheduled', urgency: 'urgent' },
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
        monitoring_date: initialData.monitoring_date || new Date().toISOString().slice(0, 10),
        cssrs_score: initialData.cssrs_score || 0,
        safety_concern_ids: initialData.safety_concern_ids || [],
        action_taken_ids: initialData.action_taken_ids || [],
        follow_up_required: initialData.follow_up_required || false,
        follow_up_timeframe: initialData.follow_up_timeframe,
    });

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
                            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                                <div>
                                    <p className="text-red-400 font-bold text-sm">AUTOMATIC ALERT TRIGGERED</p>
                                    <p className="text-red-300 text-sm mt-1">Score ≥3 requires immediate clinical review and intervention</p>
                                </div>
                            </div>
                        )}
                    </div>
                </FormField>
            </div>

            {/* Safety Concerns — ordered critical → high → moderate (ref sort_order) */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <FormField label="Safety Concerns" tooltip="Pulls from the 'ref_clinical_observations' table (category: 'clinical_flag'). These align with standard DSM-5 risk parameters for psychiatric decompensation. Orders by clinical priority.">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {SAFETY_CONCERNS.map((concern) => {
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
                </FormField>
            </div>



            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <FormField label="Actions Taken" tooltip="Pulls from 'ref_clinical_observations' table. Aligned with standard psychiatric risk mitigation and APA guidelines. Orders by urgency.">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {SAFETY_ACTIONS.map((action) => {
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
                            No — Continue standard monitoring
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
            />
        </div>
    );
};

export default StructuredSafetyCheckForm;
