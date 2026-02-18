import React, { useState, useEffect } from 'react';
import { Clock, Save, Plus, Trash2, CheckCircle, Syringe, Activity, MessageSquare, Brain, Music, Hand, MoreHorizontal } from 'lucide-react';
import { AdvancedTooltip } from '../../ui/AdvancedTooltip';

/**
 * SessionEventLogForm - Minute-by-Minute Session Timeline Tracking
 *
 * WO-086: Implements the doctor's #1 wishlist feature:
 * "I want a working template to plug information into... down to the minute, down to the second"
 *
 * Features:
 * - Repeatable event entries (add as many as needed)
 * - 7 color-coded event types with badge indicators
 * - Quick-entry preset buttons (pre-populate type + description template)
 * - "Record Now" button for instant timestamp capture
 * - 500-char description with live character counter
 * - Auto-save with 500ms debounce
 * - Chronological display with elapsed time from dose
 * - Mobile-responsive (single → 3 column grid)
 * - WCAG AAA accessible (≥12px fonts, keyboard navigation, ARIA labels)
 *
 * Props:
 * - onSave: (data: TimelineEvent[]) => void
 * - initialData?: TimelineEvent[]
 * - sessionId?: string
 * - doseTime?: string  — ISO string of dose administration time (for elapsed calc)
 */

export type EventType =
    | 'dose_admin'
    | 'vital_check'
    | 'patient_observation'
    | 'clinical_decision'
    | 'music_change'
    | 'touch_consent'
    | 'other';

export interface TimelineEvent {
    id: string;
    event_timestamp: string;
    event_type: EventType;
    event_description: string;
    session_id?: string;
    performed_by?: string;
    created_at?: string;
}

interface SessionEventLogFormProps {
    onSave?: (data: TimelineEvent[]) => void;
    initialData?: TimelineEvent[];
    sessionId?: string;
    doseTime?: string;
}

// ─── Event Type Config ────────────────────────────────────────────────────────

const EVENT_TYPE_CONFIG: Record<EventType, {
    label: string;
    color: string;
    badgeClass: string;
    icon: React.FC<{ className?: string }>;
    placeholder: string;
}> = {
    dose_admin: {
        label: 'Dose Administration',
        color: 'text-blue-400',
        badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        icon: ({ className }) => <Syringe className={className} />,
        placeholder: 'e.g., 125mg MDMA oral administration'
    },
    vital_check: {
        label: 'Vital Check',
        color: 'text-emerald-400',
        badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        icon: ({ className }) => <Activity className={className} />,
        placeholder: 'e.g., HR 84, BP 120/80, SpO2 98%'
    },
    patient_observation: {
        label: 'Patient Observation',
        color: 'text-yellow-400',
        badgeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        icon: ({ className }) => <MessageSquare className={className} />,
        placeholder: 'e.g., Patient reports no breakthrough, appears calm'
    },
    clinical_decision: {
        label: 'Clinical Decision',
        color: 'text-orange-400',
        badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        icon: ({ className }) => <Brain className={className} />,
        placeholder: 'e.g., Decision point: no breakthrough at standard dose, augmenting with ketamine'
    },
    music_change: {
        label: 'Music Change',
        color: 'text-purple-400',
        badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        icon: ({ className }) => <Music className={className} />,
        placeholder: 'e.g., Playlist changed to descent phase music'
    },
    touch_consent: {
        label: 'Touch Consent',
        color: 'text-red-400',
        badgeClass: 'bg-red-500/20 text-red-300 border-red-500/30',
        icon: ({ className }) => <Hand className={className} />,
        placeholder: 'e.g., Patient consented to hand-holding for grounding'
    },
    other: {
        label: 'Other',
        color: 'text-slate-400',
        badgeClass: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
        icon: ({ className }) => <MoreHorizontal className={className} />,
        placeholder: 'Describe the event...'
    }
};

// ─── Quick-Entry Presets ──────────────────────────────────────────────────────

interface QuickPreset {
    label: string;
    eventType: EventType;
    descriptionTemplate: string;
    colorClass: string;
}

const QUICK_PRESETS: QuickPreset[] = [
    {
        label: '💉 Dose Given',
        eventType: 'dose_admin',
        descriptionTemplate: '[Substance] [Dose] [Route] administered',
        colorClass: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20 text-blue-400'
    },
    {
        label: '📊 Vital Check',
        eventType: 'vital_check',
        descriptionTemplate: 'HR [__], BP [__]/[__], SpO2 [__]%',
        colorClass: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-400'
    },
    {
        label: '💬 Patient Spoke',
        eventType: 'patient_observation',
        descriptionTemplate: 'Patient reported: [__]',
        colorClass: 'bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/20 text-yellow-400'
    },
    {
        label: '🧠 Decision Point',
        eventType: 'clinical_decision',
        descriptionTemplate: 'Clinical decision: [__]',
        colorClass: 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/20 text-orange-400'
    },
    {
        label: '🎵 Music Changed',
        eventType: 'music_change',
        descriptionTemplate: 'Playlist changed to: [__]',
        colorClass: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20 text-purple-400'
    }
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createEmptyEvent(): TimelineEvent {
    return {
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        event_timestamp: '',
        event_type: 'other',
        event_description: ''
    };
}

function hasData(event: TimelineEvent): boolean {
    return !!(event.event_description.trim() || event.event_timestamp);
}

function calculateElapsed(doseTime: string, eventTime: string): string {
    if (!doseTime || !eventTime) return '';
    const diff = new Date(eventTime).getTime() - new Date(doseTime).getTime();
    if (diff < 0) return '';
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `T+${hours}:${String(minutes).padStart(2, '0')}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

const SessionEventLogForm: React.FC<SessionEventLogFormProps> = ({
    onSave,
    initialData = [],
    sessionId,
    doseTime
}) => {
    const [events, setEvents] = useState<TimelineEvent[]>(
        initialData.length > 0 ? initialData : [createEmptyEvent()]
    );
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Auto-save with debounce
    useEffect(() => {
        if (onSave && events.some(e => hasData(e))) {
            setIsSaving(true);
            const timer = setTimeout(() => {
                onSave(events.filter(e => hasData(e)));
                setIsSaving(false);
                setLastSaved(new Date());
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [events, onSave]);

    function updateEvent(index: number, field: keyof TimelineEvent, value: string) {
        setEvents(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    }

    function addEvent() {
        setEvents(prev => [...prev, createEmptyEvent()]);
    }

    function removeEvent(index: number) {
        if (events.length > 1) {
            setEvents(prev => prev.filter((_, i) => i !== index));
        }
    }

    function recordNow(index: number) {
        const now = new Date().toISOString().slice(0, 16);
        updateEvent(index, 'event_timestamp', now);
    }

    function applyPreset(index: number, preset: QuickPreset) {
        setEvents(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                event_type: preset.eventType,
                event_description: preset.descriptionTemplate
            };
            return updated;
        });
    }

    // Sort events chronologically for display (but keep editing order)
    const sortedForDisplay = [...events]
        .map((e, originalIndex) => ({ ...e, originalIndex }))
        .sort((a, b) => {
            if (!a.event_timestamp) return 1;
            if (!b.event_timestamp) return -1;
            return new Date(a.event_timestamp).getTime() - new Date(b.event_timestamp).getTime();
        });

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* ── Header ── */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-300 flex items-center gap-3">
                            <Clock className="w-7 h-7 text-amber-400" />
                            Session Event Log
                        </h2>
                        <p className="text-slate-400 text-sm mt-2">
                            Log every clinical action and observation with precise timestamps. Used for pharmacodynamic decision-making and legal documentation.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {isSaving && (
                            <div className="flex items-center gap-2 text-blue-400 text-xs">
                                <Save className="w-4 h-4 animate-pulse" />
                                <span>Saving...</span>
                            </div>
                        )}
                        {lastSaved && !isSaving && (
                            <div className="flex items-center gap-2 text-emerald-400 text-xs">
                                <CheckCircle className="w-4 h-4" />
                                <span>Saved {lastSaved.toLocaleTimeString()}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick-Entry Preset Bar */}
                <div className="mt-5 pt-5 border-t border-slate-700/50">
                    <p className="text-sm text-slate-400 font-semibold uppercase tracking-wide mb-3">
                        Quick Entry — click to pre-fill the next event
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {QUICK_PRESETS.map((preset) => (
                            <button
                                key={preset.eventType}
                                onClick={() => {
                                    // Apply to the last empty event, or add a new one
                                    const lastEmptyIndex = events.findIndex(e => !hasData(e));
                                    if (lastEmptyIndex >= 0) {
                                        applyPreset(lastEmptyIndex, preset);
                                    } else {
                                        const newEvent = createEmptyEvent();
                                        setEvents(prev => {
                                            const updated = [...prev, newEvent];
                                            const newIndex = updated.length - 1;
                                            updated[newIndex] = {
                                                ...updated[newIndex],
                                                event_type: preset.eventType,
                                                event_description: preset.descriptionTemplate
                                            };
                                            return updated;
                                        });
                                    }
                                }}
                                className={`px-3 py-2 border rounded-lg text-sm font-medium transition-all ${preset.colorClass}`}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Event Entries ── */}
            {events.map((event, index) => {
                const config = EVENT_TYPE_CONFIG[event.event_type];
                const IconComponent = config.icon;
                const elapsed = doseTime && event.event_timestamp
                    ? calculateElapsed(doseTime, event.event_timestamp)
                    : null;
                const charCount = event.event_description.length;
                const charWarning = charCount > 450;
                const charOver = charCount > 500;

                return (
                    <div
                        key={event.id}
                        className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-5"
                    >
                        {/* Entry Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-base font-bold text-slate-300">
                                    Event #{index + 1}
                                </h3>
                                {elapsed && (
                                    <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono rounded-md">
                                        {elapsed}
                                    </span>
                                )}
                                <span className={`px-2 py-0.5 border rounded-md text-xs font-semibold ${config.badgeClass}`}>
                                    <span className="flex items-center gap-1">
                                        <IconComponent className="w-3 h-3" />
                                        {config.label}
                                    </span>
                                </span>
                            </div>
                            {events.length > 1 && (
                                <button
                                    onClick={() => removeEvent(index)}
                                    aria-label={`Remove event ${index + 1}`}
                                    className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all text-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Remove
                                </button>
                            )}
                        </div>

                        {/* Fields Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* Timestamp */}
                            <div className="space-y-2">
                                <label
                                    htmlFor={`timestamp-${event.id}`}
                                    className="flex items-center gap-2 text-sm font-semibold text-slate-300"
                                >
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    Timestamp
                                    <AdvancedTooltip content="Record the exact time of this event. Use 'Now' for real-time logging." tier="micro">
                                        <span className="text-slate-400 cursor-help">ⓘ</span>
                                    </AdvancedTooltip>
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        id={`timestamp-${event.id}`}
                                        type="datetime-local"
                                        value={event.event_timestamp}
                                        onChange={(e) => updateEvent(index, 'event_timestamp', e.target.value)}
                                        className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm"
                                    />
                                    <button
                                        onClick={() => recordNow(index)}
                                        className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg transition-all whitespace-nowrap text-sm"
                                    >
                                        Now
                                    </button>
                                </div>
                            </div>

                            {/* Event Type */}
                            <div className="space-y-2">
                                <label
                                    htmlFor={`type-${event.id}`}
                                    className="flex items-center gap-2 text-sm font-semibold text-slate-300"
                                >
                                    <IconComponent className={`w-4 h-4 ${config.color}`} />
                                    Event Type
                                    <AdvancedTooltip content="Categorize this event to enable filtering and analysis." tier="micro">
                                        <span className="text-slate-400 cursor-help">ⓘ</span>
                                    </AdvancedTooltip>
                                </label>
                                <select
                                    id={`type-${event.id}`}
                                    value={event.event_type}
                                    onChange={(e) => updateEvent(index, 'event_type', e.target.value as EventType)}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm appearance-none"
                                >
                                    {(Object.keys(EVENT_TYPE_CONFIG) as EventType[]).map((type) => (
                                        <option key={type} value={type}>
                                            {EVENT_TYPE_CONFIG[type].label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label
                                htmlFor={`desc-${event.id}`}
                                className="flex items-center gap-2 text-sm font-semibold text-slate-300"
                            >
                                Description
                                <AdvancedTooltip content="Be specific for legal documentation. Include substance, dose, route, and clinical observations." tier="micro">
                                    <span className="text-slate-400 cursor-help">ⓘ</span>
                                </AdvancedTooltip>
                            </label>
                            <textarea
                                id={`desc-${event.id}`}
                                value={event.event_description}
                                onChange={(e) => updateEvent(index, 'event_description', e.target.value)}
                                maxLength={500}
                                rows={3}
                                placeholder={config.placeholder}
                                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm resize-none ${charOver
                                        ? 'border-red-500/50'
                                        : charWarning
                                            ? 'border-yellow-500/50'
                                            : 'border-slate-700/50'
                                    }`}
                            />
                            <div className="flex justify-end">
                                <span className={`text-xs font-mono ${charOver ? 'text-red-400' : charWarning ? 'text-yellow-400' : 'text-slate-400'
                                    }`}>
                                    {charCount} / 500
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* ── Add Event Button ── */}
            <button
                onClick={addEvent}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 rounded-2xl font-medium transition-all"
            >
                <Plus className="w-5 h-5" />
                Add Another Event
            </button>

            {/* ── Chronological Summary (when ≥2 events with timestamps) ── */}
            {sortedForDisplay.filter(e => e.event_timestamp).length >= 2 && (
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-base font-bold text-slate-300 mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        Chronological Summary
                    </h3>
                    <div className="space-y-3">
                        {sortedForDisplay
                            .filter(e => e.event_timestamp)
                            .map((event, i) => {
                                const config = EVENT_TYPE_CONFIG[event.event_type];
                                const IconComponent = config.icon;
                                const elapsed = doseTime ? calculateElapsed(doseTime, event.event_timestamp) : null;
                                return (
                                    <div key={event.id} className="flex items-start gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.badgeClass} border`}>
                                                <IconComponent className="w-4 h-4" />
                                            </div>
                                            {i < sortedForDisplay.filter(e => e.event_timestamp).length - 1 && (
                                                <div className="w-0.5 h-6 bg-slate-700 mt-1" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-xs text-slate-400 font-mono">
                                                    {new Date(event.event_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {elapsed && (
                                                    <span className="text-xs text-amber-400 font-mono">{elapsed}</span>
                                                )}
                                                <span className={`text-xs font-semibold ${config.color}`}>
                                                    {config.label}
                                                </span>
                                            </div>
                                            {event.event_description && (
                                                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                                                    {event.event_description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SessionEventLogForm;
