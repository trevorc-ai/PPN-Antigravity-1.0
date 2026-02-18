import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Save, CheckCircle, Zap, ChevronDown, ChevronUp, Pill, AlertTriangle, RotateCcw } from 'lucide-react';
import { FormField } from '../shared/FormField';
import { VisualTimeline } from '../shared/VisualTimeline';
import { supabase } from '../../../supabaseClient';

/**
 * SessionTimelineForm - Session Event Timeline
 *
 * Phase 2: Dosing Session — Milestone Tracker
 *
 * Fields:
 *   - dose_administered_at  (datetime-local) — when substance was given
 *   - onset_reported_at     (datetime-local) — patient-reported onset
 *   - peak_intensity_at     (datetime-local) — peak effect observed
 *   - session_ended_at      (datetime-local) — session formally closed
 *
 * Features:
 *   - One-tap "Mark Now" quick-action buttons (primary workflow)
 *   - Collapsible manual datetime override panel
 *   - VisualTimeline SVG showing progress + elapsed T+ times
 *   - "Quick Fill Typical" for demo / training scenarios
 *   - Reset individual milestone or all milestones
 *   - Supabase persistence via session_timeline_events table
 *   - Auto-save with 500ms debounce
 *   - WCAG AAA compliant (min 12px fonts, no color-only meaning)
 *
 * PHI Safety: No free-text inputs. All data is structured timestamps.
 */

export interface SessionTimelineData {
    dose_administered_at?: string;
    onset_reported_at?: string;
    peak_intensity_at?: string;
    session_ended_at?: string;
}

interface SessionTimelineFormProps {
    onSave?: (data: SessionTimelineData) => void;
    initialData?: SessionTimelineData;
    patientId?: string;
    sessionId?: string;
}

// ─── Milestone config (static, defined before component) ─────────────────────
const MILESTONES = [
    {
        field: 'dose_administered_at' as keyof SessionTimelineData,
        label: 'Dose Administered',
        shortLabel: 'Mark Dose',
        description: 'Record the exact time the substance was administered.',
        Icon: Pill,
        colorClass: 'text-pink-400',
        bgClass: 'bg-pink-500/10',
        hoverBgClass: 'hover:bg-pink-500/20',
        borderClass: 'border-pink-500/30',
        disabledBorderClass: 'disabled:border-slate-700',
    },
    {
        field: 'onset_reported_at' as keyof SessionTimelineData,
        label: 'Onset Reported',
        shortLabel: 'Mark Onset',
        description: 'Record when the patient first reports feeling effects.',
        Icon: Zap,
        colorClass: 'text-yellow-400',
        bgClass: 'bg-yellow-500/10',
        hoverBgClass: 'hover:bg-yellow-500/20',
        borderClass: 'border-yellow-500/30',
        disabledBorderClass: 'disabled:border-slate-700',
    },
    {
        field: 'peak_intensity_at' as keyof SessionTimelineData,
        label: 'Peak Intensity',
        shortLabel: 'Mark Peak',
        description: 'Record when peak effect intensity is observed.',
        Icon: Zap,
        colorClass: 'text-orange-400',
        bgClass: 'bg-orange-500/10',
        hoverBgClass: 'hover:bg-orange-500/20',
        borderClass: 'border-orange-500/30',
        disabledBorderClass: 'disabled:border-slate-700',
    },
    {
        field: 'session_ended_at' as keyof SessionTimelineData,
        label: 'Session Ended',
        shortLabel: 'End Session',
        description: 'Record when the formal dosing session is closed.',
        Icon: CheckCircle,
        colorClass: 'text-emerald-400',
        bgClass: 'bg-emerald-500/10',
        hoverBgClass: 'hover:bg-emerald-500/20',
        borderClass: 'border-emerald-500/30',
        disabledBorderClass: 'disabled:border-slate-700',
    },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toLocalISO(): string {
    // Returns datetime-local compatible string (no seconds, no Z)
    return new Date().toISOString().slice(0, 16);
}

function calculateElapsed(from?: string, to?: string): string {
    if (!from || !to) return '--';
    const diff = new Date(to).getTime() - new Date(from).getTime();
    if (diff < 0) return 'Invalid';
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
}

function formatTime(iso?: string): string {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── Component ────────────────────────────────────────────────────────────────
const SessionTimelineForm: React.FC<SessionTimelineFormProps> = ({
    onSave,
    initialData = {},
    patientId,
    sessionId,
}) => {
    const [data, setData] = useState<SessionTimelineData>(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [showManualEntry, setShowManualEntry] = useState(false);

    // ── Supabase persistence ──────────────────────────────────────────────────
    const persistToSupabase = useCallback(async (payload: SessionTimelineData) => {
        if (!sessionId) return; // No session context — skip DB write

        try {
            const { error } = await supabase
                .from('session_timeline_events')
                .upsert(
                    {
                        session_id: sessionId,
                        patient_id: patientId ?? null,
                        dose_administered_at: payload.dose_administered_at ?? null,
                        onset_reported_at: payload.onset_reported_at ?? null,
                        peak_intensity_at: payload.peak_intensity_at ?? null,
                        session_ended_at: payload.session_ended_at ?? null,
                        updated_at: new Date().toISOString(),
                    },
                    { onConflict: 'session_id' }
                );

            if (error) throw error;
        } catch (err) {
            console.error('[SessionTimelineForm] Supabase error:', err);
            setSaveError('Failed to save to database. Data is preserved locally.');
        }
    }, [sessionId, patientId]);

    // ── Auto-save with 500ms debounce ─────────────────────────────────────────
    useEffect(() => {
        const hasAnyData = Object.values(data).some(Boolean);
        if (!hasAnyData) return;

        setIsSaving(true);
        setSaveError(null);

        const timer = setTimeout(async () => {
            // 1. Call parent callback
            onSave?.(data);
            // 2. Persist to Supabase (non-blocking)
            await persistToSupabase(data);
            setIsSaving(false);
            setLastSaved(new Date());
        }, 500);

        return () => clearTimeout(timer);
    }, [data, onSave, persistToSupabase]);

    // ── Field updaters ────────────────────────────────────────────────────────
    const updateField = (field: keyof SessionTimelineData, value: string) => {
        setData(prev => ({ ...prev, [field]: value || undefined }));
    };

    const setNow = (field: keyof SessionTimelineData) => {
        updateField(field, toLocalISO());
    };

    const clearField = (field: keyof SessionTimelineData) => {
        setData(prev => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    // ── Quick Fill (demo/training only) ───────────────────────────────────────
    const quickFillTypical = () => {
        const now = new Date();
        setData({
            dose_administered_at: now.toISOString().slice(0, 16),
            onset_reported_at: new Date(now.getTime() + 30 * 60000).toISOString().slice(0, 16),
            peak_intensity_at: new Date(now.getTime() + 120 * 60000).toISOString().slice(0, 16),
            session_ended_at: new Date(now.getTime() + 360 * 60000).toISOString().slice(0, 16),
        });
    };

    const resetAll = () => {
        setData({});
        setLastSaved(null);
        setSaveError(null);
    };

    // ── Derived values ────────────────────────────────────────────────────────
    const totalDuration = calculateElapsed(data.dose_administered_at, data.session_ended_at);
    const sessionComplete = !!(data.dose_administered_at && data.session_ended_at);
    const completedCount = Object.values(data).filter(Boolean).length;

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="max-w-3xl mx-auto space-y-6" role="main" aria-label="Session Timeline Form">

            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h2 className="text-2xl font-black text-slate-300 flex items-center gap-3">
                            <Clock className="w-7 h-7 text-blue-400" aria-hidden="true" />
                            Session Timeline
                        </h2>
                        <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                            Track key milestones during the dosing session to monitor substance pharmacokinetics.
                            Tap a button below to record the current time instantly.
                        </p>
                    </div>

                    {/* Progress badge */}
                    <div
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg shrink-0"
                        aria-label={`${completedCount} of 4 milestones recorded`}
                    >
                        <span className="text-blue-400 text-xs font-black uppercase tracking-widest">
                            {completedCount} / 4
                        </span>
                        <span className="text-blue-300 text-xs font-medium">Milestones</span>
                    </div>
                </div>

                {/* Action row */}
                <div className="flex items-center gap-3 mt-4 flex-wrap">
                    <button
                        onClick={quickFillTypical}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-all"
                        aria-label="Quick fill with typical session timeline (demo use)"
                    >
                        Quick Fill Typical
                    </button>
                    <button
                        onClick={resetAll}
                        className="px-4 py-2 bg-slate-800 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/30 text-slate-400 hover:text-red-400 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                        aria-label="Reset all timeline milestones"
                    >
                        <RotateCcw className="w-4 h-4" aria-hidden="true" />
                        Reset All
                    </button>
                </div>

                {/* Save status */}
                <div className="mt-3 h-5" aria-live="polite" aria-atomic="true">
                    {isSaving && (
                        <div className="flex items-center gap-2 text-blue-400 text-xs">
                            <Save className="w-4 h-4 animate-pulse" aria-hidden="true" />
                            <span>[STATUS: SAVING]</span>
                        </div>
                    )}
                    {lastSaved && !isSaving && !saveError && (
                        <div className="flex items-center gap-2 text-emerald-400 text-xs">
                            <CheckCircle className="w-4 h-4" aria-hidden="true" />
                            <span>[STATUS: SAVED] {lastSaved.toLocaleTimeString()}</span>
                        </div>
                    )}
                    {saveError && (
                        <div className="flex items-center gap-2 text-amber-400 text-xs">
                            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                            <span>[STATUS: WARNING] {saveError}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Visual Timeline ──────────────────────────────────────────── */}
            <VisualTimeline
                doseTime={data.dose_administered_at ? new Date(data.dose_administered_at) : undefined}
                onsetTime={data.onset_reported_at ? new Date(data.onset_reported_at) : undefined}
                peakTime={data.peak_intensity_at ? new Date(data.peak_intensity_at) : undefined}
                endTime={data.session_ended_at ? new Date(data.session_ended_at) : undefined}
                showElapsed={true}
            />

            {/* ── Quick-Action Buttons ─────────────────────────────────────── */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-300 mb-1">Quick Actions</h3>
                <p className="text-sm text-slate-400 mb-5">
                    Tap to record the current time. Once set, use Manual Entry below to correct.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {MILESTONES.map((milestone) => {
                        const { field, shortLabel, description, Icon, colorClass, bgClass, hoverBgClass, borderClass } = milestone;
                        const isSet = !!data[field];

                        return (
                            <div key={field} className="relative">
                                <button
                                    onClick={() => setNow(field)}
                                    disabled={isSet}
                                    className={`
                                        w-full p-5 rounded-xl border-2 transition-all group text-left
                                        ${isSet
                                            ? 'bg-slate-800/60 border-slate-700 cursor-not-allowed'
                                            : `${bgClass} ${hoverBgClass} ${borderClass} cursor-pointer hover:scale-[1.01] active:scale-[0.99]`
                                        }
                                    `}
                                    aria-label={`${shortLabel}${isSet ? ` — recorded at ${formatTime(data[field])}` : ' — tap to record current time'}`}
                                    aria-pressed={isSet}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-lg transition-colors ${isSet ? 'bg-slate-700' : `${bgClass}`}`}>
                                            <Icon
                                                className={`w-7 h-7 transition-colors ${isSet ? 'text-slate-400' : colorClass}`}
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`text-base font-black transition-colors ${isSet ? 'text-slate-400' : colorClass}`}>
                                                {shortLabel}
                                            </h4>
                                            {isSet ? (
                                                <p className="text-sm text-slate-300 mt-0.5 font-mono">
                                                    {formatTime(data[field])}
                                                    <span className="text-slate-400 ml-2 text-xs font-sans">
                                                        (T+{calculateElapsed(data.dose_administered_at, data[field])})
                                                    </span>
                                                </p>
                                            ) : (
                                                <p className="text-sm text-slate-400 mt-0.5">{description}</p>
                                            )}
                                        </div>
                                        {isSet && (
                                            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
                                        )}
                                    </div>
                                </button>

                                {/* Clear button — only shown when set */}
                                {isSet && (
                                    <button
                                        onClick={() => clearField(field)}
                                        className="absolute top-2 right-2 p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                        aria-label={`Clear ${milestone.label} timestamp`}
                                        title="Clear this timestamp"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Total Duration Summary */}
                {sessionComplete && (
                    <div
                        className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl"
                        role="status"
                        aria-label={`Total session duration: ${totalDuration}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-emerald-300 font-semibold text-sm">Total Session Duration</p>
                                <p className="text-emerald-500 text-sm mt-0.5">Dose → Session End</p>
                            </div>
                            <span className="text-3xl font-black text-emerald-400 tabular-nums">
                                {totalDuration}
                            </span>
                        </div>
                    </div>
                )}

                {/* Elapsed time breakdown (when dose is set) */}
                {data.dose_administered_at && (
                    <div className="mt-4 grid grid-cols-3 gap-3">
                        {[
                            { label: 'Dose → Onset', from: data.dose_administered_at, to: data.onset_reported_at },
                            { label: 'Dose → Peak', from: data.dose_administered_at, to: data.peak_intensity_at },
                            { label: 'Onset → Peak', from: data.onset_reported_at, to: data.peak_intensity_at },
                        ].map(({ label, from, to }) => (
                            <div
                                key={label}
                                className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-lg text-center"
                            >
                                <p className="text-sm text-slate-400 font-medium mb-1">{label}</p>
                                <p className="text-sm font-black text-slate-300 tabular-nums">
                                    {calculateElapsed(from, to)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Manual Entry (Collapsible) ───────────────────────────────── */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <button
                    onClick={() => setShowManualEntry(!showManualEntry)}
                    className="w-full flex items-center justify-between text-left group"
                    aria-expanded={showManualEntry}
                    aria-controls="manual-entry-panel"
                >
                    <div>
                        <h3 className="text-lg font-bold text-slate-300 group-hover:text-slate-300 transition-colors">
                            Manual Entry
                        </h3>
                        <p className="text-sm text-slate-400 mt-0.5">
                            Override timestamps for corrections or retrospective entry
                        </p>
                    </div>
                    {showManualEntry ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" aria-hidden="true" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" aria-hidden="true" />
                    )}
                </button>

                {showManualEntry && (
                    <div id="manual-entry-panel" className="mt-6 space-y-5">
                        {MILESTONES.map((milestone) => {
                            const { field, label, Icon, colorClass } = milestone;
                            return (
                                <FormField
                                    key={field}
                                    label={label}
                                    htmlFor={`timeline-${field}`}
                                    icon={<Icon className={`w-4 h-4 ${colorClass}`} aria-hidden="true" />}
                                    helpText={data[field] ? `T+ from dose: ${calculateElapsed(data.dose_administered_at, data[field])}` : undefined}
                                >
                                    <div className="flex gap-2">
                                        <input
                                            id={`timeline-${field}`}
                                            type="datetime-local"
                                            value={data[field] ?? ''}
                                            onChange={(e) => updateField(field, e.target.value)}
                                            className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                            aria-label={`${label} — enter date and time`}
                                        />
                                        <button
                                            onClick={() => setNow(field)}
                                            className="px-4 py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-slate-300 rounded-lg font-bold text-sm transition-all whitespace-nowrap"
                                            aria-label={`Set ${label} to current time`}
                                        >
                                            Now
                                        </button>
                                        {data[field] && (
                                            <button
                                                onClick={() => clearField(field)}
                                                className="px-3 py-3 bg-slate-700 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-lg transition-all"
                                                aria-label={`Clear ${label}`}
                                            >
                                                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                                            </button>
                                        )}
                                    </div>
                                </FormField>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Accessibility: Screen Reader Summary ─────────────────────── */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
                {completedCount === 0 && 'No milestones recorded yet.'}
                {completedCount > 0 && (
                    <>
                        {MILESTONES.filter(m => data[m.field]).map(m => (
                            `${m.label}: ${formatTime(data[m.field])}`
                        )).join('. ')}
                        {sessionComplete && `. Total duration: ${totalDuration}.`}
                    </>
                )}
            </div>
        </div>
    );
};

export default SessionTimelineForm;
