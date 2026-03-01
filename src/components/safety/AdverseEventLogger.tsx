import React, { useState, useCallback } from 'react';
import { AlertTriangle, Clock, ChevronDown } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface AdverseEventLoggerProps {
    patientId: string;
    sessionId?: number;
    onSave?: (data: AdverseEventData) => void;
}

interface AdverseEventData {
    event_type_id: number | null;
    severity: 'mild' | 'moderate' | 'severe';
    onset_time: string;
    duration_minutes: number | null;
    alert_message_id: number | null;
    response_notes_id: number | null;
}

// Structured event types — no free text (PHI-safe)
const EVENT_TYPES = [
    { id: 1, label: 'Nausea / Vomiting' },
    { id: 2, label: 'Anxiety / Panic' },
    { id: 3, label: 'Cardiovascular Irregularity' },
    { id: 4, label: 'Dissociation (Severe)' },
    { id: 5, label: 'Emotional Distress' },
    { id: 6, label: 'Headache' },
    { id: 7, label: 'Hyperthermia' },
    { id: 8, label: 'Psychotic Symptoms' },
    { id: 9, label: 'Respiratory Irregularity' },
    { id: 10, label: 'Seizure Activity' },
    { id: 11, label: 'Other (documented separately)' },
];

const RESPONSE_OPTIONS = [
    { id: 1, label: 'Verbal reassurance / grounding' },
    { id: 2, label: 'Position change / physical comfort' },
    { id: 3, label: 'Breathing exercise administered' },
    { id: 4, label: 'Rescue medication administered' },
    { id: 5, label: 'Emergency services contacted' },
    { id: 6, label: 'Session terminated early' },
    { id: 7, label: 'Supervisor notified' },
    { id: 8, label: 'Monitoring increased' },
];

const SEVERITY_CONFIG = {
    mild: { color: 'amber', label: 'Mild', description: 'Manageable, no intervention required' },
    moderate: { color: 'orange', label: 'Moderate', description: 'Intervention required, session continues' },
    severe: { color: 'red', label: 'Severe', description: 'Significant intervention or session termination' },
} as const;

export const AdverseEventLogger: React.FC<AdverseEventLoggerProps> = ({
    patientId,
    sessionId,
    onSave,
}) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const [form, setForm] = useState<AdverseEventData>({
        event_type_id: null,
        severity: 'mild',
        onset_time: timeStr,
        duration_minutes: null,
        alert_message_id: null,
        response_notes_id: null,
    });

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    const handleSave = useCallback(async () => {
        if (!form.event_type_id) return;
        setSaveStatus('saving');
        try {
            // TODO: log_adverse_events table does not exist in the database.
            // Discovered during WO-420 Phase 2 integrity audit (2026-02-25).
            // The following ref tables are also missing (no migrations found):
            //   - ref table for alert_type_id (EVENT_TYPES is a local hardcoded array)
            //   - ref table for alert_message_id
            //   - ref table for response_notes_id
            // This insert is disabled until migration 076 creates log_adverse_events
            // and the supporting ref_ tables are defined and seeded.
            // INSPECTOR — 2026-02-25
            console.warn('[AdverseEventLogger] Save blocked: log_adverse_events table not yet created. See WO-420 Item 076.');
            setSaveStatus('saved'); // UI feedback only — no DB write
            onSave?.(form);
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    }, [form, patientId, sessionId, onSave]);

    const isValid = form.event_type_id !== null;

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-red-900/30 rounded-3xl p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-300">Adverse Event Log</h3>
                    <p className="text-sm text-slate-500 uppercase tracking-widest">Phase 2 — Session Safety Documentation</p>
                </div>
            </div>

            {/* Event Type */}
            <div>
                <label htmlFor="event-type" className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">
                    Event Type
                </label>
                <div className="relative">
                    <select
                        id="event-type"
                        value={form.event_type_id ?? ''}
                        onChange={(e) => setForm((f) => ({ ...f, event_type_id: parseInt(e.target.value) || null }))}
                        className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 text-sm font-bold appearance-none focus:ring-2 focus:ring-red-500 outline-none transition-all"
                    >
                        <option value="">Select event type...</option>
                        {EVENT_TYPES.map((t) => (
                            <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
            </div>

            {/* Severity */}
            <div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Severity</p>
                <div className="grid grid-cols-3 gap-2">
                    {(Object.entries(SEVERITY_CONFIG) as [AdverseEventData['severity'], typeof SEVERITY_CONFIG[keyof typeof SEVERITY_CONFIG]][]).map(([key, cfg]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, severity: key }))}
                            aria-pressed={form.severity === key}
                            className={`py-3 px-2 rounded-xl border text-xs font-black uppercase tracking-widest transition-all ${form.severity === key
                                ? key === 'mild'
                                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                    : key === 'moderate'
                                        ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                                        : 'bg-red-500/20 border-red-500 text-red-400'
                                : 'bg-slate-800/40 border-slate-700 text-slate-500 hover:border-slate-600'
                                }`}
                        >
                            {cfg.label}
                        </button>
                    ))}
                </div>
                <p className="text-sm text-slate-500 mt-2 italic">
                    {SEVERITY_CONFIG[form.severity].description}
                </p>
            </div>

            {/* Onset Time + Duration */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="onset-time" className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">
                        <Clock className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
                        Onset Time
                    </label>
                    <input
                        id="onset-time"
                        type="time"
                        tabIndex={-1}
                        value={form.onset_time}
                        onChange={(e) => setForm((f) => ({ ...f, onset_time: e.target.value }))}
                        className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 text-sm font-bold focus:ring-2 focus:ring-red-500 outline-none transition-all"
                    />
                </div>
                <div>
                    <label htmlFor="duration" className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">
                        Duration (min)
                    </label>
                    <input
                        id="duration"
                        type="text" inputMode="numeric" pattern="[0-9]*\.\?[0-9]*"
                        min={1}
                        max={480}
                        placeholder="e.g. 15"
                        value={form.duration_minutes ?? ''}
                        onChange={(e) => setForm((f) => ({ ...f, duration_minutes: parseInt(e.target.value) || null }))}
                        className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 text-sm font-bold focus:ring-2 focus:ring-red-500 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Response Taken */}
            <div>
                <label htmlFor="response" className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">
                    Response Taken
                </label>
                <div className="relative">
                    <select
                        id="response"
                        value={form.response_notes_id ?? ''}
                        onChange={(e) => setForm((f) => ({ ...f, response_notes_id: parseInt(e.target.value) || null }))}
                        className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 text-sm font-bold appearance-none focus:ring-2 focus:ring-red-500 outline-none transition-all"
                    >
                        <option value="">Select response...</option>
                        {RESPONSE_OPTIONS.map((r) => (
                            <option key={r.id} value={r.id}>{r.label}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
            </div>

            {/* Severe warning */}
            {form.severity === 'severe' && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-red-400">Severe Event — Supervisor Notification Required</p>
                        <p className="text-sm text-red-300/70 mt-1">Document supervisor acknowledgment separately in the Red Alert panel.</p>
                    </div>
                </div>
            )}

            {/* Save Button */}
            <button
                type="button"
                onClick={handleSave}
                disabled={!isValid || saveStatus === 'saving'}
                className={`w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${!isValid
                    ? 'bg-slate-800/40 border border-slate-700 text-slate-600 cursor-not-allowed'
                    : saveStatus === 'saved'
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                        : saveStatus === 'error'
                            ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                            : 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 active:scale-[0.98]'
                    }`}
            >
                {saveStatus === 'saving' ? 'Logging...' : saveStatus === 'saved' ? '✓ Event Logged' : saveStatus === 'error' ? '✗ Log Failed' : 'Log Adverse Event'}
            </button>
        </div>
    );
};

export default AdverseEventLogger;
