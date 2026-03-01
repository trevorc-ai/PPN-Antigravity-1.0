import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Save, CheckCircle, ChevronLeft, ChevronRight, LogOut, Info, AlertTriangle, X, ChevronDown } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';
import { generateBaselineNarrative, NarrativeInput } from '../../services/narrativeGenerator';
import { FormFooter } from '../arc-of-care-forms/shared/FormFooter';

interface BaselineAssessmentWizardProps {
    patientId: string;
    onComplete?: (data: WizardData) => void;
    onExit?: () => void;
    onBack?: () => void;
}

interface WizardData {
    mentalHealth: {
        phq9: number | null;
        gad7: number | null;
        ace: number | null;
        pcl5: number | null;
    };
    setSetting: {
        treatment_expectancy: number;
    };
    physiology: {
        hrv_ms: number | null;
        bp_systolic: number | null;
        bp_diastolic: number | null;
    };
    observations: {
        motivation_level: string;
        support_system: string;
        prior_experience: string;
    };
    // WO-527: Adverse Events & Medications (moved from Safety Check slideout)
    adverseEvents: {
        new_adverse_events: boolean;
        ae_clinical_observation?: string;
        ae_severity_grade?: number;
    };
    medications: {
        medication_changes: boolean;
        current_medication_ids: number[];
    };
}

interface RefPickerItem {
    id: number;
    label: string;
    category?: string;
}

const STORAGE_KEY = (patientId: string) => `ppn_wizard_baseline_${patientId}`;

const DEFAULT_DATA: WizardData = {
    mentalHealth: { phq9: null, gad7: null, ace: null, pcl5: null },
    setSetting: { treatment_expectancy: 50 },
    physiology: { hrv_ms: null, bp_systolic: null, bp_diastolic: null },
    observations: { motivation_level: '', support_system: '', prior_experience: '' },
    adverseEvents: { new_adverse_events: false, ae_clinical_observation: undefined, ae_severity_grade: undefined },
    medications: { medication_changes: false, current_medication_ids: [] },
};

const ADVERSE_OBSERVATION_OPTIONS = [
    'Nausea / Vomiting', 'Hypertension', 'Tachycardia',
    'Severe Anxiety', 'Panic Attack', 'Other',
];

const MOTIVATION_OPTIONS = ['Low', 'Moderate', 'High', 'Very High'];
const SUPPORT_OPTIONS = ['None identified', 'Minimal', 'Moderate', 'Strong'];
const EXPERIENCE_OPTIONS = ['None', 'Minimal (1-2 times)', 'Some (3-5 times)', 'Experienced (6+)'];

/** Styled number input for physiological readings (HRV, BP) — numeric keypad on tablet */
function PhysioInput({
    id, label, value, onChange, placeholder,
}: {
    id: string; label: string; value: number | null;
    onChange: (v: number | null) => void; placeholder: string;
}) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-1.5">
                {label}
            </label>
            <input
                id={id}
                type="number"
                inputMode="numeric"
                placeholder={placeholder}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-300 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
        </div>
    );
}

/** Styled number input for wide-range scores (PCL-5 0–80) */
function ScoreInputLarge({
    id, label, value, onChange, max,
}: {
    id: string; label: string; value: number | null;
    onChange: (v: number | null) => void; max: number;
}) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-1.5">
                {label}
            </label>
            <input
                id={id}
                type="number"
                inputMode="numeric"
                placeholder={`0–${max}`}
                min={0}
                max={max}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value === '' ? null : parseInt(e.target.value, 10))}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-300 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
        </div>
    );
}

/** Range dropdown for psychometric scores (PHQ-9 / GAD-7 / ACE / PCL-5) */
function ScoreSelect({
    id, label, value, onChange, min, max,
}: {
    id: string; label: string; value: number | null;
    onChange: (v: number | null) => void; min: number; max: number;
}) {
    const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-1.5">
                {label}
            </label>
            <select
                id={id}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value === '' ? null : parseInt(e.target.value, 10))}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-300 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            >
                <option value="">0–{max}</option>
                {options.map(v => (
                    <option key={v} value={v}>{v}</option>
                ))}
            </select>
        </div>
    );
}

/** Slider for wide-range numeric scores (PCL-5 0–80, step=5) */
function ScoreSlider({
    id, label, value, onChange, min, max, step,
}: {
    id: string; label: string; value: number | null;
    onChange: (v: number) => void; min: number; max: number; step: number;
}) {
    const sliderVal = value !== null ? value : min;
    const pct = ((sliderVal - min) / (max - min)) * 100;
    return (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <label htmlFor={id} className="text-sm font-black text-slate-400 uppercase tracking-widest">
                    {label}
                </label>
                <span className="text-xl font-black text-slate-300">
                    {value !== null ? value : '—'}
                </span>
            </div>
            <input
                id={id}
                type="range"
                min={min} max={max} step={step}
                value={sliderVal}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="ppn-range w-full cursor-pointer"
                style={{ background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${pct}%, #334155 ${pct}%, #334155 100%)` }}
            />
            <div className="flex justify-between text-xs text-slate-600 mt-0.5">
                <span>{min}</span><span>{max}</span>
            </div>
        </div>
    );
}

export const BaselineAssessmentWizard: React.FC<BaselineAssessmentWizardProps> = ({
    patientId,
    onComplete,
    onExit,
    onBack,
}) => {
    const [data, setData] = useState<WizardData>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY(patientId));
            return saved ? { ...DEFAULT_DATA, ...JSON.parse(saved) } : DEFAULT_DATA;
        } catch {
            return DEFAULT_DATA;
        }
    });
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [saveExitFlash, setSaveExitFlash] = useState(false);
    const [saveContFlash, setSaveContFlash] = useState(false);

    // WO-527: Medication picker state (moved from StructuredSafetyCheckForm)
    const [medicationOptions, setMedicationOptions] = useState<RefPickerItem[]>([]);
    useEffect(() => {
        supabase
            .from('ref_medications')
            .select('medication_id, medication_name, medication_category')
            .order('medication_name')
            .then(({ data: meds }) => {
                if (meds) {
                    setMedicationOptions(meds.map((m: any) => ({ id: m.medication_id, label: m.medication_name, category: m.medication_category })));
                }
            });
    }, []);

    // WO-527: Persist medication IDs + names to localStorage so DosingProtocolForm
    // and the contraindication engine can read them without a DB round-trip.
    useEffect(() => {
        const ids = data.medications.current_medication_ids;
        try { localStorage.setItem('mock_patient_medications', JSON.stringify(ids)); } catch (_) { }
        if (medicationOptions.length > 0) {
            const names = ids.map(id => medicationOptions.find(m => m.id === id)?.label ?? '').filter(Boolean);
            try { localStorage.setItem('mock_patient_medications_names', JSON.stringify(names)); } catch (_) { }
        }
    }, [data.medications.current_medication_ids, medicationOptions]);

    // Auto-save every 30s
    useEffect(() => {
        const interval = setInterval(() => {
            try {
                localStorage.setItem(STORAGE_KEY(patientId), JSON.stringify(data));
                setLastSaved(new Date());
            } catch { /* ignore */ }
        }, 30000);
        return () => clearInterval(interval);
    }, [data, patientId]);

    const handleSaveAndExit = useCallback(() => {
        try {
            localStorage.setItem(STORAGE_KEY(patientId), JSON.stringify(data));
            setLastSaved(new Date());
        } catch { /* ignore */ }
        setSaveExitFlash(true);
        setTimeout(() => {
            setSaveExitFlash(false);
            onExit?.();
        }, 800);
    }, [data, patientId, onExit]);

    const handleSubmitAll = useCallback(() => {
        const input: NarrativeInput = {
            patientId,
            mentalHealth: {
                phq9: data.mentalHealth.phq9 ?? undefined,
                gad7: data.mentalHealth.gad7 ?? undefined,
                ace: data.mentalHealth.ace ?? undefined,
                pcl5: data.mentalHealth.pcl5 ?? undefined,
            },
            setSetting: { treatment_expectancy: data.setSetting.treatment_expectancy },
            physiology: {
                hrv_ms: data.physiology.hrv_ms ?? undefined,
                bp_systolic: data.physiology.bp_systolic ?? undefined,
                bp_diastolic: data.physiology.bp_diastolic ?? undefined,
            },
            observations: {
                motivation_level: data.observations.motivation_level || undefined,
                support_system: data.observations.support_system || undefined,
                prior_experience: data.observations.prior_experience || undefined,
            },
            consent: { consent_type: undefined, consent_obtained: false },
        };
        const gen = generateBaselineNarrative(input);
        // Persist data during Phase 1 routing navigation
        try { localStorage.setItem(STORAGE_KEY(patientId), JSON.stringify(data)); } catch { /* ignore */ }

        setSaveContFlash(true);
        setTimeout(() => {
            setSaveContFlash(false);
            onComplete?.(data);
        }, 700);
    }, [data, patientId, onComplete]);

    const updateData = <K extends keyof WizardData>(section: K, updates: Partial<WizardData[K]>) => {
        setData((d) => ({ ...d, [section]: { ...d[section], ...updates } }));
    };

    // ── Validation ─────────────────────────────────────────────────────────────────────────
    // At least one psychometric score is required to save
    const atLeastOneScore =
        data.mentalHealth.phq9 !== null ||
        data.mentalHealth.gad7 !== null ||
        data.mentalHealth.ace !== null ||
        data.mentalHealth.pcl5 !== null;

    // TEMPORARY FOR TESTING: Allow submitting without psychometric scores
    const canSubmit = true; // was: atLeastOneScore;


    // ── Completed state ───────────────────────────────────────────────────────
    // Removed: NarrativeViewer was flashing right before advancing

    return (
        <div className="space-y-3 pb-4">

            {/* ── Section 1: Psychometric Scores ───────────────────────── */}
            <section className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-1.5 text-base font-bold text-slate-500">
                        Psychometric Scores
                        <AdvancedTooltip content="Total composite scores from standardized assessments. PHQ-9 screens for depression severity (0–27), GAD-7 for anxiety (0–21), ACE for adverse childhood experiences (0–10), PCL-5 for PTSD symptom severity (0–80). At least one score is required to save." tier="standard" side="bottom">
                            <Info className="w-3.5 h-3.5 text-slate-500 cursor-help hover:text-slate-400 transition-colors" aria-label="About psychometric scores" />
                        </AdvancedTooltip>
                        <span className="text-slate-600 font-normal text-sm ml-0.5">optional (for testing)</span>
                    </h3>
                    {lastSaved && (
                        <span className="text-xs text-slate-500">
                            Saved {lastSaved.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </span>
                    )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <ScoreSelect id="phq9" label="PHQ-9 (0–27)" value={data.mentalHealth.phq9} onChange={(v) => updateData('mentalHealth', { phq9: v })} min={0} max={27} />
                    <ScoreSelect id="gad7" label="GAD-7 (0–21)" value={data.mentalHealth.gad7} onChange={(v) => updateData('mentalHealth', { gad7: v })} min={0} max={21} />
                    <ScoreSelect id="ace" label="ACE (0–10)" value={data.mentalHealth.ace} onChange={(v) => updateData('mentalHealth', { ace: v })} min={0} max={10} />
                    <ScoreInputLarge id="pcl5" label="PCL-5 (0–80)" value={data.mentalHealth.pcl5} onChange={(v) => updateData('mentalHealth', { pcl5: v })} max={80} />
                </div>
            </section>


            {/* ── Section 3: Baseline Physiology (optional, 3-col) ─────── */}
            <section className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4 space-y-3">
                <h3 className="flex items-center gap-1.5 text-base font-bold text-slate-500">
                    Baseline Physiology
                    <AdvancedTooltip content="Optional pre-session physiological readings. Heart Rate Variability (HRV in ms) reflects autonomic nervous system state — higher values indicate parasympathetic dominance and readiness. Systolic and diastolic blood pressure document baseline cardiovascular status. These measurements are not required to save." tier="standard">
                        <Info className="w-3.5 h-3.5 text-slate-500 cursor-help hover:text-slate-400 transition-colors" aria-label="About baseline physiology" />
                    </AdvancedTooltip>
                    <span className="text-slate-600 font-normal text-sm ml-0.5">optional</span>
                </h3>
                {/* Number inputs — tablet opens numeric keypad, no scroll, precise entry */}
                <div className="grid grid-cols-3 gap-3">
                    <PhysioInput id="hrv" label="HRV (ms)" value={data.physiology.hrv_ms} onChange={(v) => updateData('physiology', { hrv_ms: v })} placeholder="e.g. 55" />
                    <PhysioInput id="bp-sys" label="Systolic" value={data.physiology.bp_systolic} onChange={(v) => updateData('physiology', { bp_systolic: v })} placeholder="e.g. 120" />
                    <PhysioInput id="bp-dia" label="Diastolic" value={data.physiology.bp_diastolic} onChange={(v) => updateData('physiology', { bp_diastolic: v })} placeholder="e.g. 80" />
                </div>
            </section>

            {/* ── WO-527: Prior Adverse Events + Concomitant Medications ── */}
            <section className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4 space-y-4" aria-label="Adverse events and medications">
                <h3 className="text-base font-bold text-slate-500">Safety &amp; Medications</h3>

                {/* Prior Adverse Events toggle */}
                <div>
                    <div className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-400" aria-hidden="true" />
                            <span className="font-bold text-sm text-slate-300 tracking-wider" title="Records adverse events that occurred prior to treatment or between sessions.">
                                PRIOR ADVERSE EVENTS ⓘ
                            </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={data.adverseEvents.new_adverse_events}
                                onChange={(e) => updateData('adverseEvents', { new_adverse_events: e.target.checked })}
                                aria-label="Toggle prior adverse events"
                            />
                            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500 peer-focus-visible:ring-2 peer-focus-visible:ring-orange-400 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-slate-900" />
                        </label>
                    </div>

                    {data.adverseEvents.new_adverse_events && (
                        <div className="space-y-3 mt-3 pt-3 px-2 border-t border-slate-700/50 animate-in slide-in-from-top-2">
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Primary Clinical Observation</p>
                                <select
                                    value={data.adverseEvents.ae_clinical_observation || ''}
                                    onChange={(e) => updateData('adverseEvents', { ae_clinical_observation: e.target.value || undefined })}
                                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm appearance-none"
                                    aria-label="Adverse event clinical observation"
                                >
                                    <option value="">Select Observation...</option>
                                    {ADVERSE_OBSERVATION_OPTIONS.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Severity (CTCAE Grade)</p>
                                <select
                                    value={data.adverseEvents.ae_severity_grade ?? ''}
                                    onChange={(e) => updateData('adverseEvents', { ae_severity_grade: e.target.value ? parseInt(e.target.value) : undefined })}
                                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm appearance-none"
                                    aria-label="Adverse event severity grade"
                                >
                                    <option value="">Select Grade...</option>
                                    <option value="1">Grade 1 — Mild (No Intervention)</option>
                                    <option value="2">Grade 2 — Moderate (Minimal Intervention)</option>
                                    <option value="3">Grade 3 — Severe (Significant Intervention)</option>
                                    <option value="4">Grade 4 — Life-Threatening</option>
                                    <option value="5">Grade 5 — Fatal</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t border-slate-700/50" />

                {/* Concomitant Medications toggle */}
                <div>
                    <div className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                        <span className="font-bold text-sm text-slate-400 tracking-wider" title="Pulls from ref_medications. Populates drug interaction checks in Phase 2.">
                            CONCOMITANT MEDICATIONS ⓘ
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={data.medications.medication_changes}
                                onChange={(e) => updateData('medications', { medication_changes: e.target.checked })}
                                aria-label="Toggle concomitant medications"
                            />
                            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-400 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-slate-900" />
                        </label>
                    </div>

                    {data.medications.medication_changes && (
                        <div className="mt-3 pt-3 px-2 border-t border-slate-700/50 space-y-3 animate-in slide-in-from-top-2">
                            <div className="relative">
                                <select
                                    value=""
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (!val) return;
                                        const idNum = parseInt(val);
                                        if (!data.medications.current_medication_ids.includes(idNum)) {
                                            updateData('medications', { current_medication_ids: [...data.medications.current_medication_ids, idNum] });
                                        }
                                    }}
                                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none cursor-pointer"
                                    aria-label="Add concomitant medication"
                                >
                                    <option value="">Select Medication to Add...</option>
                                    {medicationOptions.map(m => (
                                        <option key={m.id} value={m.id}>{m.label}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <ChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true" />
                                </div>
                            </div>
                            <div className="min-h-[48px] p-3 bg-slate-900/50 border border-slate-800/80 rounded-lg">
                                {data.medications.current_medication_ids.length === 0 ? (
                                    <p className="text-sm text-slate-500 italic">No medications added.</p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {data.medications.current_medication_ids.map(id => {
                                            const med = medicationOptions.find(m => m.id === id);
                                            return (
                                                <div key={id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/40 border border-blue-500/40 rounded-full text-sm text-blue-200 shadow-sm">
                                                    <span className="font-semibold leading-none">{med?.label ?? `Medication ${id}`}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateData('medications', { current_medication_ids: data.medications.current_medication_ids.filter(m => m !== id) })}
                                                        className="text-blue-400 hover:text-white hover:bg-blue-500/50 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ml-1"
                                                        aria-label={`Remove ${med?.label ?? 'medication'}`}
                                                    >
                                                        <X className="w-3.5 h-3.5" aria-hidden="true" />
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
            </section>

            {/* ── Footer ──────────────────────────────────────────────────────── */}
            <FormFooter
                onBack={onBack}
                onSaveAndExit={handleSaveAndExit}
                onSaveAndContinue={handleSubmitAll}
                isSaving={saveContFlash || saveExitFlash}
                hasChanges={canSubmit}
            />

            {/* Hint if scores missing (Disabled for testing) */}
            {/*
            {!canSubmit && (
                <p className="text-xs text-slate-500 text-right">
                    Enter at least one psychometric score to continue
                </p>
            )}
            */}
        </div>
    );
};

export default BaselineAssessmentWizard;
