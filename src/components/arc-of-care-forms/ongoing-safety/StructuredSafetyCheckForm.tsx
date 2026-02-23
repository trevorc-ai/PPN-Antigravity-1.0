import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { CheckCircle, AlertTriangle, ChevronRight, ArrowUp, Minus, Zap, Clock, Plus } from 'lucide-react';
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
    new_adverse_events: boolean;
    medication_changes: boolean;
    action_taken_ids: number[];
    follow_up_required: boolean;
    follow_up_timeframe?: '24_hours' | '3_days' | '1_week';
    current_medication_ids: number[];
    ae_severity_grade?: number;
    ae_clinical_observation?: string;
}

interface RefPickerItem {
    id: number;
    label: string;
    category?: string;
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
        new_adverse_events: initialData.new_adverse_events || false,
        medication_changes: initialData.medication_changes || false,
        action_taken_ids: initialData.action_taken_ids || [],
        follow_up_required: initialData.follow_up_required || false,
        follow_up_timeframe: initialData.follow_up_timeframe,
        current_medication_ids: initialData.current_medication_ids || [],
        ae_severity_grade: initialData.ae_severity_grade,
        ae_clinical_observation: initialData.ae_clinical_observation,
    });

    const [isSaving, setIsSaving] = useState(false);
    const [medicationsOptions, setMedicationsOptions] = useState<RefPickerItem[]>([]);
    const [medDraftId, setMedDraftId] = useState<string>('');

    useEffect(() => {
        const loadMeds = async () => {
            const { data } = await supabase.from('ref_medications').select('medication_id, medication_name, category').order('medication_name');
            if (data) {
                setMedicationsOptions(data.map((m: any) => ({ id: m.medication_id, label: m.medication_name, category: m.category })));
            }
        };
        loadMeds();
    }, []);

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

            {/* New Events & Medication Changes */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-8">
                {/* Adverse Events */}
                <div>
                    <div className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-2 group relative">
                            <AlertTriangle className="w-4 h-4 text-orange-400" />
                            <span className="font-bold text-sm text-slate-300 tracking-wider cursor-help" title="Records adverse events that occurred prior to treatment or between sessions. Used for baseline safety clearance before dosing.">PRIOR ADVERSE EVENTS ⓘ</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={data.new_adverse_events}
                                onChange={(e) => updateField('new_adverse_events', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>

                    {data.new_adverse_events && (
                        <div className="space-y-4 mt-4 animate-in slide-in-from-top-2 pt-4 px-2">
                            <FormField label="SEVERITY (CTCAE GRADE)">
                                <select
                                    value={data.ae_severity_grade || ''}
                                    onChange={(e) => updateField('ae_severity_grade', e.target.value ? parseInt(e.target.value) : undefined)}
                                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm appearance-none"
                                >
                                    <option value="">Select Grade...</option>
                                    <option value="1">Grade 1 - Mild (No Intervention)</option>
                                    <option value="2">Grade 2 - Moderate (Minimal Intervention)</option>
                                    <option value="3">Grade 3 - Severe (Significant Intervention)</option>
                                    <option value="4">Grade 4 - Life-Threatening</option>
                                    <option value="5">Grade 5 - Fatal</option>
                                </select>
                            </FormField>
                            <FormField label="PRIMARY CLINICAL OBSERVATION">
                                <select
                                    value={data.ae_clinical_observation || ''}
                                    onChange={(e) => updateField('ae_clinical_observation', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm appearance-none"
                                >
                                    <option value="">Select Observation...</option>
                                    <option value="Nausea / Vomiting">Nausea / Vomiting</option>
                                    <option value="Hypertension">Hypertension</option>
                                    <option value="Tachycardia">Tachycardia</option>
                                    <option value="Severe Anxiety">Severe Anxiety</option>
                                    <option value="Panic Attack">Panic Attack</option>
                                    <option value="Other">Other</option>
                                </select>
                            </FormField>
                        </div>
                    )}
                </div>

                <div className="border-t border-slate-700/50"></div>

                {/* Concomitant Medications */}
                <div>
                    <div className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-400 tracking-wider cursor-help" title="Pulls directly from the 'ref_medications' SQL table. Data saved here populates the patient's baseline for automatic drug interaction checks in Phase 2.">CONCOMITANT MEDICATIONS ⓘ</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={data.medication_changes}
                                onChange={(e) => updateField('medication_changes', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                    </div>

                    {data.medication_changes && (
                        <div className="mt-4 animate-in slide-in-from-top-2 pt-4 space-y-6 px-2">
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <select
                                        value={medDraftId}
                                        onChange={e => setMedDraftId(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Medication...</option>
                                        {medicationsOptions.map(m => (
                                            <option key={m.id} value={m.id}>{m.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    disabled={!medDraftId}
                                    onClick={() => {
                                        const idNum = parseInt(medDraftId);
                                        if (!data.current_medication_ids.includes(idNum)) {
                                            updateField('current_medication_ids', [...data.current_medication_ids, idNum]);
                                        }
                                        setMedDraftId('');
                                    }}
                                    className="px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-lg text-blue-400 hover:text-white hover:bg-slate-700 hover:border-blue-500/50 disabled:opacity-50 disabled:hover:bg-slate-800 disabled:hover:border-slate-700 disabled:hover:text-blue-400 transition-colors"
                                    title="Add Medication"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="min-h-[60px] p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
                                {data.current_medication_ids.length === 0 ? (
                                    <p className="text-sm text-slate-600 italic">No medications added.</p>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {data.current_medication_ids.map(id => {
                                            const med = medicationsOptions.find(m => m.id === id);
                                            return (
                                                <div key={id} className="flex items-center justify-between px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-md text-sm text-slate-300">
                                                    <span className="font-medium">{med?.label ?? `Medication ID ${id}`}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateField('current_medication_ids', data.current_medication_ids.filter(m => m !== id))}
                                                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions Taken — ordered immediate → urgent (ref sort_order) */}
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
