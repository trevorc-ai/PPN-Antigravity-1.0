import React, { useState, useCallback } from 'react';
import { Calendar, Clock, CheckSquare, Star, BookOpen, ChevronDown } from 'lucide-react';
import { createIntegrationSession } from '../../services/clinicalLog';

interface StructuredIntegrationSessionProps {
    patientId: string;
    sessionId?: number;
    onSave?: (data: IntegrationSessionData) => void;
}

interface IntegrationSessionData {
    integration_session_number: number;
    session_date: string;
    session_duration_minutes: number;
    attendance_status: 'attended' | 'cancelled' | 'no_show';
    cancellation_reason_id: number | null;
    focus_areas: string[];
    insight_integration_score: number;
    emotional_processing_score: number;
    behavioral_application_score: number;
    engagement_level_score: number;
    homework_assigned: string[];
    next_session_date: string;
}

const DURATION_OPTIONS = [
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '60 min', value: 60 },
    { label: '90 min', value: 90 },
];

const FOCUS_AREAS = [
    'Processing Dosing Experience',
    'Relationship Insights',
    'Career / Purpose Exploration',
    'Grief / Loss Processing',
    'Trauma Integration',
    'Spiritual / Meaning-Making',
    'Family Dynamics',
    'Somatic Awareness',
];

const HOMEWORK_OPTIONS = [
    'Daily Journaling (10 min/day)',
    'Meditation Practice (10 min/day)',
    'Gratitude List (3 items/day)',
    'Nature Walk (30 min)',
    'Creative Expression',
    'Breathwork Practice',
    'Body Scan Exercise',
    'Reach Out to Support Person',
];

const CANCELLATION_REASONS = [
    { id: 1, label: 'Patient Illness' },
    { id: 2, label: 'Scheduling Conflict' },
    { id: 3, label: 'Transportation Issue' },
    { id: 4, label: 'Financial Barrier' },
    { id: 5, label: 'Emotional Readiness' },
    { id: 6, label: 'Other' },
];

const PROGRESS_INDICATORS = [
    { key: 'insight_integration_score', label: 'Insight Integration' },
    { key: 'emotional_processing_score', label: 'Emotional Processing' },
    { key: 'behavioral_application_score', label: 'Behavioral Application' },
    { key: 'engagement_level_score', label: 'Engagement Level' },
] as const;

const StarRating: React.FC<{
    value: number;
    onChange: (v: number) => void;
    label: string;
}> = ({ value, onChange, label }) => (
    <div className="flex items-center justify-between py-2">
        <span className="text-sm text-slate-300">{label}</span>
        <div className="flex items-center gap-1" role="group" aria-label={`${label} rating`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    aria-label={`${star} out of 5`}
                    aria-pressed={value >= star}
                    className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                >
                    <Star
                        className={`w-5 h-5 ${value >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                    />
                </button>
            ))}
            <span className="ml-2 text-xs text-slate-500 w-8">{value}/5</span>
        </div>
    </div>
);

export const StructuredIntegrationSession: React.FC<StructuredIntegrationSessionProps> = ({
    patientId,
    sessionId,
    onSave,
}) => {
    const today = new Date().toISOString().slice(0, 10);
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const [form, setForm] = useState<IntegrationSessionData>({
        integration_session_number: 1,
        session_date: today,
        session_duration_minutes: 45,
        attendance_status: 'attended',
        cancellation_reason_id: null,
        focus_areas: [],
        insight_integration_score: 0,
        emotional_processing_score: 0,
        behavioral_application_score: 0,
        engagement_level_score: 0,
        homework_assigned: [],
        next_session_date: nextWeek,
    });

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    const toggleArrayItem = (arr: string[], item: string): string[] =>
        arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

    const handleSave = useCallback(async () => {
        setSaveStatus('saving');
        try {
            // WO-213: Routed through clinicalLog service layer (not direct Supabase)
            // ARCH NOTE: session_notes JSON blob removed — violates no-free-text rule.
            // TODO (WO-214): Replace focus_areas string[] and homework_assigned string[]
            //   with session_focus_ids integer[] and homework_assigned_ids integer[]
            //   once RefPicker component provides FK IDs from ref_ tables.
            const result = await createIntegrationSession({
                patient_id: patientId,
                dosing_session_id: sessionId !== undefined ? String(sessionId) : undefined,
                integration_session_number: form.integration_session_number,
                session_date: form.session_date,
                session_duration_minutes: form.session_duration_minutes,
                attended: form.attendance_status === 'attended',
                insight_integration_rating: form.insight_integration_score,
                emotional_processing_rating: form.emotional_processing_score,
                behavioral_application_rating: form.behavioral_application_score,
                engagement_level_rating: form.engagement_level_score,
                // session_focus_ids and homework_assigned_ids pending RefPicker (WO-214)
            });
            if (!result.success) throw result.error;
            setSaveStatus('saved');
            onSave?.(form);
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    }, [form, patientId, sessionId, onSave]);

    const isAttended = form.attendance_status === 'attended';

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-300">Integration Session</h3>
                    <p className="text-sm text-slate-500 uppercase tracking-widest">Phase 3 — Structured Record</p>
                </div>
            </div>

            {/* Row 1: Session Number + Date */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="session-number" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        Session #
                    </label>
                    <input
                        id="session-number"
                        type="number"
                        min={1}
                        max={99}
                        value={form.integration_session_number}
                        onChange={(e) => setForm((f) => ({ ...f, integration_session_number: parseInt(e.target.value) || 1 }))}
                        className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 text-sm font-bold focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    />
                </div>
                <div>
                    <label htmlFor="session-date" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        Session Date
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        <input
                            id="session-date"
                            type="date"
                            value={form.session_date}
                            max={today}
                            onChange={(e) => setForm((f) => ({ ...f, session_date: e.target.value }))}
                            className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-300 text-sm font-bold focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Duration */}
            <div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">
                    <Clock className="inline w-3.5 h-3.5 mr-1.5 -mt-0.5" />
                    Session Duration
                </p>
                <div className="grid grid-cols-4 gap-2">
                    {DURATION_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, session_duration_minutes: opt.value }))}
                            aria-pressed={form.session_duration_minutes === opt.value}
                            className={`py-2.5 rounded-xl text-sm font-bold transition-all border ${form.session_duration_minutes === opt.value
                                ? 'bg-primary/20 border-primary text-primary'
                                : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Attendance */}
            <div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Attendance</p>
                <div className="grid grid-cols-3 gap-2">
                    {(['attended', 'cancelled', 'no_show'] as const).map((status) => (
                        <button
                            key={status}
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, attendance_status: status, cancellation_reason_id: null }))}
                            aria-pressed={form.attendance_status === status}
                            className={`py-2.5 rounded-xl text-sm font-bold transition-all border capitalize ${form.attendance_status === status
                                ? status === 'attended'
                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                    : 'bg-red-500/20 border-red-500 text-red-400'
                                : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600'
                                }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {/* Cancellation Reason — only shown if not attended */}
                {!isAttended && (
                    <div className="mt-3 relative">
                        <label htmlFor="cancel-reason" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                            Reason
                        </label>
                        <div className="relative">
                            <select
                                id="cancel-reason"
                                value={form.cancellation_reason_id ?? ''}
                                onChange={(e) => setForm((f) => ({ ...f, cancellation_reason_id: parseInt(e.target.value) || null }))}
                                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 text-sm font-bold appearance-none focus:ring-2 focus:ring-primary outline-none transition-all"
                            >
                                <option value="">Select reason...</option>
                                {CANCELLATION_REASONS.map((r) => (
                                    <option key={r.id} value={r.id}>{r.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                    </div>
                )}
            </div>

            {/* Focus Areas — only if attended */}
            {isAttended && (
                <>
                    <div>
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">
                            <CheckSquare className="inline w-3.5 h-3.5 mr-1.5 -mt-0.5" />
                            Session Focus Areas
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                            {FOCUS_AREAS.map((area) => {
                                const checked = form.focus_areas.includes(area);
                                return (
                                    <label
                                        key={area}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${checked
                                            ? 'bg-primary/10 border-primary/40 text-slate-300'
                                            : 'bg-slate-800/30 border-slate-700/50 text-slate-400 hover:border-slate-600'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => setForm((f) => ({ ...f, focus_areas: toggleArrayItem(f.focus_areas, area) }))}
                                            className="w-4 h-4 rounded accent-primary"
                                        />
                                        <span className="text-sm font-medium">{area}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Progress Indicators */}
                    <div>
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Patient Progress Indicators</p>
                        <div className="bg-slate-800/30 rounded-2xl px-4 py-2 divide-y divide-slate-700/50">
                            {PROGRESS_INDICATORS.map(({ key, label }) => (
                                <StarRating
                                    key={key}
                                    label={label}
                                    value={form[key]}
                                    onChange={(v) => setForm((f) => ({ ...f, [key]: v }))}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Homework */}
                    <div>
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Homework Assigned</p>
                        <div className="grid grid-cols-1 gap-2">
                            {HOMEWORK_OPTIONS.map((hw) => {
                                const checked = form.homework_assigned.includes(hw);
                                return (
                                    <label
                                        key={hw}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${checked
                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-300'
                                            : 'bg-slate-800/30 border-slate-700/50 text-slate-400 hover:border-slate-600'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => setForm((f) => ({ ...f, homework_assigned: toggleArrayItem(f.homework_assigned, hw) }))}
                                            className="w-4 h-4 rounded accent-emerald-500"
                                        />
                                        <span className="text-sm font-medium">{hw}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}

            {/* Next Session Date */}
            <div>
                <label htmlFor="next-session-date" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    Next Session Scheduled
                </label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input
                        id="next-session-date"
                        type="date"
                        value={form.next_session_date}
                        min={today}
                        onChange={(e) => setForm((f) => ({ ...f, next_session_date: e.target.value }))}
                        className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-300 text-sm font-bold focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    />
                </div>
            </div>

            {/* Save Button */}
            <button
                type="button"
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className={`w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${saveStatus === 'saved'
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                    : saveStatus === 'error'
                        ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                        : 'bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 active:scale-[0.98]'
                    }`}
            >
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? '✓ Session Recorded' : saveStatus === 'error' ? '✗ Save Failed' : 'Save Integration Session'}
            </button>
        </div>
    );
};

export default StructuredIntegrationSession;
