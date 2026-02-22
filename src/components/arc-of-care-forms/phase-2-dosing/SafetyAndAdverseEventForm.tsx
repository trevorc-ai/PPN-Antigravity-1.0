import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Save, CheckCircle, Clock, Plus, Trash2, FileText } from 'lucide-react';
import { FormField } from '../shared/FormField';
import { useToast } from '../../../contexts/ToastContext';
import { generateAEReport, type AEReportData, type CTCAEGrade } from '../../../services/aeReportGenerator';
import { NowButton, RelativeTimeDisplay } from '../shared/NowButton';
import { FormFooter } from '../shared/FormFooter';

/**
 * SafetyAndAdverseEventForm — Phase 2: Dosing Session
 *
 * Section 1: Time-series safety observation log
 *   - Select observation buttons → hit "Log Entry" → stamped snapshot appended to log
 *   - Multiple entries accumulate chronologically during the session
 *
 * Section 2: Formal adverse event report (collapsible)
 *   - Event type, severity grade, MedDRA, intervention, timestamps, follow-up plan
 *
 * Replaces: AdverseEventForm + SafetyEventObservationsForm
 */

// ── Types ────────────────────────────────────────────────────────────────────

export interface ObservationLogEntry {
    id: string;
    timestamp: string;           // ISO string
    observations: string[];
    note?: string;
}

export interface SafetyAndAdverseEventData {
    observation_log: ObservationLogEntry[];

    // Adverse Event — only populated when an event occurs
    event_type?: string;
    severity_grade?: number;
    meddra_code?: string;
    intervention_type?: string;
    occurred_at?: string;
    resolved: boolean;
    resolved_at?: string;
    follow_up_plan?: string;
}

interface SafetyAndAdverseEventFormProps {
    initialData?: Partial<SafetyAndAdverseEventData>;
    patientId?: string;
    sessionId?: string;
    doseTime?: Date;
    onComplete?: () => void;
    onExit?: () => void;
    onBack?: () => void;
}

// ── Constants ────────────────────────────────────────────────────────────────

const OBSERVATION_CATEGORIES: Record<string, Array<{ id: string; label: string }>> = {
    'Vital Status': [
        { id: 'OBS_STABLE', label: 'Vitals Stable' },
        { id: 'OBS_HR_ELEVATED', label: 'HR Elevated' },
        { id: 'OBS_BP_ELEVATED', label: 'BP Elevated' },
        { id: 'OBS_SPO2_LOW', label: 'SpO₂ Low' },
    ],
    'Distress': [
        { id: 'OBS_CALM', label: 'Calm / Settled' },
        { id: 'OBS_DISTRESS_MILD', label: 'Mild Distress' },
        { id: 'OBS_DISTRESS_MOD', label: 'Moderate Distress' },
        { id: 'OBS_DISTRESS_SEV', label: 'Severe Distress' },
    ],
    'Interventions': [
        { id: 'INT_VERBAL', label: 'Verbal Reassurance' },
        { id: 'INT_BREATHING', label: 'Guided Breathing' },
        { id: 'INT_TOUCH', label: 'Physical Touch' },
        { id: 'INT_ENV', label: 'Env. Adjusted' },
        { id: 'INT_CHEMICAL', label: 'Chemical Rx' },
        { id: 'INT_MEDICAL', label: 'Medical Consult' },
    ],
    'Status': [
        { id: 'RES_RESOLVED', label: 'Resolved' },
        { id: 'RES_ONGOING', label: 'Still Monitoring' },
        { id: 'RES_FOLLOWUP', label: 'Follow-up Needed' },
    ],
};

const QUICK_PRESETS = [
    { label: 'All Stable', observations: ['OBS_STABLE', 'OBS_CALM', 'RES_RESOLVED'] },
    { label: 'Elev. Vitals', observations: ['OBS_HR_ELEVATED', 'OBS_BP_ELEVATED', 'INT_VERBAL', 'RES_ONGOING'] },
    { label: 'Acute Distress', observations: ['OBS_DISTRESS_SEV', 'INT_VERBAL', 'INT_BREATHING', 'RES_ONGOING'] },
];

const ALL_OBS_MAP: Record<string, string> = Object.values(OBSERVATION_CATEGORIES)
    .flat()
    .reduce((acc, o) => ({ ...acc, [o.id]: o.label }), {});

const EVENT_TYPES = [
    'Nausea / Vomiting', 'Panic Attack', 'Hypertension', 'Tachycardia',
    'Dizziness / Syncope', 'Severe Anxiety', 'Psychotic Episode',
    'Cardiac Event', 'Respiratory Distress', 'Headache', 'Other',
];

const INTERVENTION_TYPES = [
    'Verbal Reassurance', 'Guided Breathing', 'Physical Touch / Grounding',
    'Environment Adjustment', 'Chemical Rescue (Benzodiazepine)',
    'Chemical Rescue (Propranolol)', 'Medical Consultation', 'Emergency Services Called',
];

const SEVERITY_GRADES = [
    { value: 1, label: 'Grade 1 — Mild' },
    { value: 2, label: 'Grade 2 — Moderate' },
    { value: 3, label: 'Grade 3 — Severe' },
    { value: 4, label: 'Grade 4 — Life-Threatening' },
    { value: 5, label: 'Grade 5 — Fatal' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getSeverityColor(grade?: number): string {
    if (!grade) return 'bg-slate-800/30 border-slate-700/50 text-slate-400';
    if (grade === 1) return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300';
    if (grade === 2) return 'bg-orange-500/10 border-orange-500/30 text-orange-300';
    if (grade === 3) return 'bg-red-500/10 border-red-500/30 text-red-300';
    return 'bg-red-900/30 border-red-700/50 text-red-400';
}

function formatTime(iso: string): string {
    try {
        return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
        return iso;
    }
}

function uid(): string {
    return Math.random().toString(36).slice(2, 9);
}

// ── Component ────────────────────────────────────────────────────────────────

const SafetyAndAdverseEventForm: React.FC<SafetyAndAdverseEventFormProps> = ({
    onSave,
    initialData,
    doseTime,
    onComplete,
    onExit,
    onBack
}) => {
    const [data, setData] = useState<SafetyAndAdverseEventData>({
        observation_log: [],
        resolved: false,
        ...initialData,
    });

    const [activeObs, setActiveObs] = useState<string[]>([]);
    const [entryNote, setEntryNote] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showEventReport, setShowEventReport] = useState(!!initialData?.event_type);

    const { addToast } = useToast();

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

    const update = (field: keyof SafetyAndAdverseEventData, value: unknown) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    // Toggle an observation in the active selection panel
    const toggleObs = (id: string) => {
        setActiveObs(prev =>
            prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
        );
    };

    // Stamp the current selection as a log entry
    const logEntry = () => {
        if (activeObs.length === 0) return;
        const entry: ObservationLogEntry = {
            id: uid(),
            timestamp: new Date().toISOString(),
            observations: [...activeObs],
            note: entryNote.trim() || undefined,
        };
        setData(prev => ({
            ...prev,
            observation_log: [...prev.observation_log, entry],
        }));
        setEntryNote('');
        // Don't clear activeObs — clinician likely wants to adjust and log again
    };

    const removeEntry = (id: string) => {
        setData(prev => ({
            ...prev,
            observation_log: prev.observation_log.filter(e => e.id !== id),
        }));
    };

    const requiresIntervention = (data.severity_grade ?? 0) >= 3;

    const handleGenerateReport = async () => {
        if (!data.event_type || !data.severity_grade) {
            addToast({
                title: 'Missing Information',
                message: 'Please fill out Event Type and Severity Grade before generating a report.',
                type: 'error'
            });
            return;
        }

        setIsGenerating(true);

        try {
            // Mock data for the report generation since we don't have all the context here
            const reportData: AEReportData = {
                patientLinkCode: 'PT-RISK9W2P',
                siteId: 'SITE-001',
                safetyEventId: Math.random().toString(36).slice(2, 9),
                sessionDate: new Date().toISOString(),
                substance: 'Psilocybin',
                reportAuthorId: 'Provider-1',
                eventType: data.event_type,
                eventDescription: data.follow_up_plan ?? 'No description provided.',
                ctcaeGrade: data.severity_grade as CTCAEGrade,
                outcome: data.resolved ? 'Resolved' : 'Ongoing',
                interventions: data.intervention_type ? [{
                    timeMinutesPostDose: 0,
                    description: data.intervention_type
                }] : []
            };

            const { regulatoryNotificationRequired } = await generateAEReport(reportData);

            addToast({
                title: 'Incident Report Generated',
                message: regulatoryNotificationRequired
                    ? 'Report downloaded. [ACTION REQUIRED] Grade 3+ event must be reported to oversight board.'
                    : 'CTCAE Incident Report downloaded safely.',
                type: regulatoryNotificationRequired ? 'warning' : 'success'
            });
        } catch (error) {
            addToast({
                title: 'Error Generating Report',
                message: 'Could not generate the incident report.',
                type: 'error'
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* ── Header ───────────────────────────────────────────────────── */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-red-400" />
                        Safety &amp; Adverse Events
                    </h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                        Log observations at any point during the session. Each entry is timestamped.
                    </p>
                </div>
            </div>

            {/* ── Section 1: Observation Log ───────────────────────────────── */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">

                {/* Toggle panel */}
                <div className="p-6 space-y-4 border-b border-slate-800/60">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-[#A8B5D1] flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-400" />
                            Current Observations
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Quick set:</span>
                            {QUICK_PRESETS.map(preset => (
                                <button
                                    key={preset.label}
                                    onClick={() => setActiveObs(preset.observations)}
                                    className="px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-medium transition-all"
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(OBSERVATION_CATEGORIES).map(([category, items]) => (
                            <div key={category} className="space-y-1.5">
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{category}</p>
                                {items.map(obs => (
                                    <button
                                        key={obs.id}
                                        type="button"
                                        onClick={() => toggleObs(obs.id)}
                                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left transition-all active:scale-95 border ${activeObs.includes(obs.id)
                                            ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                                            : 'bg-slate-800/40 border-slate-700/40 text-slate-400 hover:border-slate-500 hover:text-[#A8B5D1]'
                                            }`}
                                    >
                                        {obs.label}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Optional note + Log Entry button */}
                    <div className="flex items-center gap-3 pt-1">
                        <input
                            type="text"
                            value={entryNote}
                            onChange={e => setEntryNote(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && logEntry()}
                            placeholder="Optional note…"
                            className="flex-1 px-3 py-2 bg-slate-800/40 border border-slate-700/40 rounded-lg text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <button
                            type="button"
                            onClick={logEntry}
                            disabled={activeObs.length === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-lg text-sm transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            Log Entry
                        </button>
                    </div>
                    {activeObs.length === 0 && (
                        <p className="text-xs text-slate-600">Select at least one observation to log an entry.</p>
                    )}
                </div>

                {/* Log timeline */}
                <div className="p-6">
                    <h3 className="text-sm font-bold text-slate-400 mb-3">
                        Session Log
                        {data.observation_log.length > 0 && (
                            <span className="ml-2 text-xs font-normal text-slate-600">
                                {data.observation_log.length} {data.observation_log.length === 1 ? 'entry' : 'entries'}
                            </span>
                        )}
                    </h3>

                    {data.observation_log.length === 0 ? (
                        <div className="flex items-center gap-3 py-6 text-center justify-center">
                            <Clock className="w-4 h-4 text-slate-700" />
                            <p className="text-sm text-slate-600">No entries yet. Select observations above and hit Log Entry.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {data.observation_log.map((entry, idx) => (
                                <div
                                    key={entry.id}
                                    className="flex items-start gap-3 px-4 py-3 bg-slate-800/30 border border-slate-700/40 rounded-xl group"
                                >
                                    {/* Timeline dot */}
                                    <div className="flex flex-col items-center pt-1 flex-shrink-0">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        {idx < data.observation_log.length - 1 && (
                                            <div className="w-px h-full bg-slate-700/50 mt-1" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-blue-400 font-mono tabular-nums">
                                                {formatTime(entry.timestamp)}
                                            </span>
                                            {doseTime && (
                                                <span className="text-xs text-slate-600">
                                                    T+{Math.round((new Date(entry.timestamp).getTime() - doseTime.getTime()) / 60000)}m
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                            {entry.observations.map(obsId => (
                                                <span
                                                    key={obsId}
                                                    className="px-2 py-0.5 bg-slate-700/60 text-slate-300 rounded-md text-xs font-medium"
                                                >
                                                    {ALL_OBS_MAP[obsId] ?? obsId}
                                                </span>
                                            ))}
                                        </div>
                                        {entry.note && (
                                            <p className="text-xs text-slate-500 mt-1 italic">{entry.note}</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => removeEntry(entry.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-600 hover:text-red-400 rounded-lg transition-all flex-shrink-0"
                                        title="Remove entry"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Section 2: Adverse Event Report ──────────────────────────── */}
            <div className="border border-red-500/20 rounded-2xl overflow-hidden">
                <button
                    type="button"
                    onClick={() => setShowEventReport(v => !v)}
                    className={`w-full flex items-center justify-between px-6 py-4 transition-all ${showEventReport ? 'bg-red-500/10' : 'bg-slate-900/60 hover:bg-red-500/5'
                        }`}
                >
                    <span className="flex items-center gap-2 text-base font-bold text-red-400">
                        <AlertTriangle className="w-4 h-4" />
                        Log Adverse Event
                    </span>
                    <span className="text-xs text-slate-500">
                        {showEventReport ? '▲ Collapse' : '▼ Expand — only if an adverse event occurred'}
                    </span>
                </button>

                {showEventReport && (
                    <div className="bg-slate-900/60 p-6 space-y-6 border-t border-red-500/10">

                        {/* Quick log */}
                        <div className="flex flex-wrap gap-2">
                            <span className="text-xs text-red-300/60 self-center">Quick log:</span>
                            {['Nausea / Vomiting', 'Severe Anxiety', 'Panic Attack', 'Hypertension'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        update('event_type', type);
                                        update('occurred_at', new Date().toISOString().slice(0, 16));
                                        update('severity_grade', 2);
                                    }}
                                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg text-xs font-medium transition-all"
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <FormField label="Event Type" required>
                                <select
                                    value={data.event_type ?? ''}
                                    onChange={e => update('event_type', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm"
                                >
                                    <option value="">Select event type…</option>
                                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </FormField>

                            <FormField label="MedDRA Code" tooltip="Optional — enter if known">
                                <input
                                    type="text"
                                    value={data.meddra_code ?? ''}
                                    onChange={e => update('meddra_code', e.target.value)}
                                    placeholder="e.g. 10047700"
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm font-mono"
                                />
                            </FormField>

                            <FormField label="Occurred At" required>
                                <div className="flex gap-2">
                                    <input
                                        type="datetime-local"
                                        value={data.occurred_at ?? ''}
                                        onChange={e => update('occurred_at', e.target.value)}
                                        className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm"
                                    />
                                    <NowButton onSetNow={ts => update('occurred_at', ts.toISOString().slice(0, 16))} />
                                </div>
                                {doseTime && data.occurred_at && (
                                    <RelativeTimeDisplay
                                        referenceTime={doseTime}
                                        currentTime={new Date(data.occurred_at)}
                                        label="after dose"
                                    />
                                )}
                            </FormField>

                            <FormField label="Severity Grade" required>
                                <div className="space-y-1.5">
                                    {SEVERITY_GRADES.map(grade => (
                                        <label
                                            key={grade.value}
                                            className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer border transition-all text-sm ${data.severity_grade === grade.value
                                                ? getSeverityColor(grade.value)
                                                : 'bg-slate-800/30 border-slate-700/50 text-slate-400 hover:border-slate-600'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="severity_grade"
                                                value={grade.value}
                                                checked={data.severity_grade === grade.value}
                                                onChange={e => update('severity_grade', parseInt(e.target.value))}
                                                className="w-4 h-4"
                                            />
                                            <span className="font-medium">{grade.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </FormField>

                            {requiresIntervention && (
                                <div className="md:col-span-2">
                                    <FormField label="Intervention Applied" required tooltip="Required for Grade 3 and above">
                                        <select
                                            value={data.intervention_type ?? ''}
                                            onChange={e => update('intervention_type', e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm"
                                        >
                                            <option value="">Select intervention…</option>
                                            {INTERVENTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </FormField>
                                </div>
                            )}

                            <div className="md:col-span-2">
                                <label className="flex items-center gap-3 p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.resolved}
                                        onChange={e => update('resolved', e.target.checked)}
                                        className="w-5 h-5 rounded border-slate-600 bg-slate-800/50 text-emerald-500 focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <span className="text-slate-300 font-medium text-sm">Event Resolved</span>
                                </label>
                            </div>

                            {data.resolved && (
                                <FormField label="Resolved At" required>
                                    <div className="flex gap-2">
                                        <input
                                            type="datetime-local"
                                            value={data.resolved_at ?? ''}
                                            onChange={e => update('resolved_at', e.target.value)}
                                            className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                                        />
                                        <NowButton onSetNow={ts => update('resolved_at', ts.toISOString().slice(0, 16))} />
                                    </div>
                                </FormField>
                            )}

                            <div className="md:col-span-2">
                                <FormField label="Follow-up Plan" tooltip="Required for Grade 3+ or unresolved events">
                                    <textarea
                                        value={data.follow_up_plan ?? ''}
                                        onChange={e => update('follow_up_plan', e.target.value)}
                                        rows={3}
                                        placeholder="Describe next steps, monitoring requirements, or referrals…"
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm resize-none"
                                    />
                                </FormField>
                            </div>

                            <div className="md:col-span-2 pt-4 border-t border-slate-700/50 mt-2">
                                <button
                                    type="button"
                                    onClick={handleGenerateReport}
                                    disabled={isGenerating || !data.event_type || !data.severity_grade}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 disabled:opacity-50 text-[#A8B5D1] font-bold text-sm rounded-xl transition-all shadow-lg active:scale-95"
                                >
                                    <FileText className="w-5 h-5 text-blue-400" />
                                    {isGenerating ? 'Generating...' : 'Finalize & Export CTCAE Incident Report'}
                                </button>
                                {requiresIntervention && (
                                    <p className="text-center text-xs text-amber-500 mt-3 font-medium">
                                        Grade 3+ events will automatically flag for regulatory notification in the generated report.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <FormFooter
                onBack={onBack}
                onSaveAndExit={handleSaveAndExit}
                onSaveAndContinue={handleSaveAndContinue}
                isSaving={isSaving}
                hasChanges={data.observation_log.length > 0 || !!data.event_type}
            />
        </div >
    );
};

export default SafetyAndAdverseEventForm;
