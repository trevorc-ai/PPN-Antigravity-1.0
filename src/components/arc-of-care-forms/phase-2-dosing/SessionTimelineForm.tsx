import React, { useState, useEffect } from 'react';
import { Clock, Tag, Music, AlertTriangle, Plus, Trash2, CheckCircle, Play, Stethoscope, Mic, Pill } from 'lucide-react';
import { AdvancedTooltip } from '../../ui/AdvancedTooltip';

/**
 * SessionTimelineForm - Minute-by-Minute Session Tracking
 *
 * Implements WO-086 "Session Timeline Tracking"
 *
 * Features:
 * - "Action Deck" interface for quick-taps
 * - Event types: Dose Admin, Vital Check, Observation, Decision, Music, Safety
 * - Auto-timestamps ("Record Now")
 * - Repeatable event stream
 * - Integration with session_timeline_events table
 */

export interface TimelineEvent {
    id: string;
    session_id?: string;
    event_timestamp: string;           // ISO 8601 datetime
    event_type: 'dose_admin' | 'vital_check' | 'patient_observation' | 'clinical_decision' | 'music_change' | 'touch_consent' | 'safety_event' | 'other';
    event_description: string;         // max 500 chars
    performed_by?: string;             // user UUID
    metadata?: any;
    created_at?: string;
}

interface SessionTimelineFormProps {
    onSave?: (data: TimelineEvent[]) => void;
    initialData?: TimelineEvent[];
    sessionId?: string;
}

const SessionTimelineForm: React.FC<SessionTimelineFormProps> = ({
    onSave,
    initialData = [],
    sessionId
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

    function createEmptyEvent(): TimelineEvent {
        // Default to current time
        const now = new Date();
        // Adjust to local ISO string for input[type="datetime-local"]
        const localIso = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

        return {
            id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            event_timestamp: localIso,
            event_type: 'other',
            event_description: ''
        };
    }

    function hasData(event: TimelineEvent): boolean {
        return !!(event.event_description && event.event_description.trim().length > 0);
    }

    function updateEvent(index: number, field: keyof TimelineEvent, value: any) {
        setEvents(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    }

    function addEvent() {
        setEvents(prev => [createEmptyEvent(), ...prev]); // Add new to top
    }

    function removeEvent(index: number) {
        if (events.length > 1) {
            setEvents(prev => prev.filter((_, i) => i !== index));
        } else {
            // If only one, just clear it
            setEvents([createEmptyEvent()]);
        }
    }

    function recordNow(index: number) {
        const now = new Date();
        const localIso = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
        updateEvent(index, 'event_timestamp', localIso);
    }

    // Quick Action Templates
    const QUICK_ACTIONS = [
        { label: 'Dose Admin', type: 'dose_admin', icon: Pill, color: 'emerald', desc: 'Administered [Dose]mg of [Substance] via [Route].' },
        { label: 'Vital Check', type: 'vital_check', icon: Stethoscope, color: 'blue', desc: 'Vitals checked. HR:__, BP:__/__' },
        { label: 'Patient Spoke', type: 'patient_observation', icon: Mic, color: 'amber', desc: 'Patient reported: ' },
        { label: 'Music Change', type: 'music_change', icon: Music, color: 'violet', desc: 'Playlist changed to: ' },
        { label: 'Decision', type: 'clinical_decision', icon: AlertTriangle, color: 'orange', desc: 'Decision made: ' },
    ];

    function applyQuickAction(index: number, action: any) {
        updateEvent(index, 'event_type', action.type);
        // Only set description if empty to avoid overwriting user notes
        if (!events[index].event_description) {
            updateEvent(index, 'event_description', action.desc);
        }
        recordNow(index);
    }

    // Helper to get badge color
    function getTypeColor(type: string) {
        switch (type) {
            case 'dose_admin': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'vital_check': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'patient_observation': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'clinical_decision': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'music_change': return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
            case 'safety_event': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'touch_consent': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
            default: return 'bg-slate-700/50 text-slate-300 border-slate-600/50';
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-300 flex items-center gap-3">
                            <Clock className="w-7 h-7 text-blue-400" />
                            Session Timeline
                        </h2>
                        <p className="text-slate-300 text-sm mt-2">
                            Minute-by-minute log of all clinical actions, observations, and decisions.
                        </p>
                    </div>
                    {isSaving && (
                        <div className="flex items-center gap-2 text-blue-400 text-xs">
                            <Tag className="w-4 h-4 animate-pulse" />
                            <span>Syncing...</span>
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

            {/* Event Input Stream */}
            <div className="space-y-4">
                {/* "Add New" Button at top for reverse chronological feel */}
                <button
                    onClick={addEvent}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-300 rounded-2xl font-bold transition-all"
                >
                    <Plus className="w-5 h-5" />
                    + New Timeline Entry
                </button>

                {events.map((event, index) => (
                    <div
                        key={event.id}
                        className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 animate-in slide-in-from-top-4 duration-300"
                    >
                        {/* Quick Actions Bar (Only for new/empty events) */}
                        {!event.event_description && (
                            <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-slate-700/50">
                                {QUICK_ACTIONS.map(action => (
                                    <button
                                        key={action.type}
                                        onClick={() => applyQuickAction(index, action)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider hover:scale-105 transition-all ${event.event_type === action.type
                                                ? 'bg-slate-100 text-slate-900 border-white'
                                                : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200'
                                            }`}
                                    >
                                        <action.icon className="w-4 h-4" />
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            {/* Time & Type Column */}
                            <div className="md:col-span-4 space-y-3">
                                <div className="flex gap-2">
                                    <input
                                        type="datetime-local"
                                        value={event.event_timestamp}
                                        onChange={(e) => updateEvent(index, 'event_timestamp', e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={() => recordNow(index)}
                                        className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 transition-colors"
                                        title="Set to Now"
                                    >
                                        <Clock className="w-4 h-4" />
                                    </button>
                                </div>

                                <select
                                    value={event.event_type}
                                    onChange={(e) => updateEvent(index, 'event_type', e.target.value)}
                                    className={`w-full px-3 py-2 rounded-lg text-sm font-bold border appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${getTypeColor(event.event_type)}`}
                                >
                                    <option value="dose_admin">💊 Dose Administration</option>
                                    <option value="vital_check">🩺 Vital Sign Check</option>
                                    <option value="patient_observation">👁️ Patient Observation</option>
                                    <option value="clinical_decision">⚖️ Clinical Decision</option>
                                    <option value="music_change">🎵 Music Change</option>
                                    <option value="touch_consent">🤝 Touch Consent</option>
                                    <option value="safety_event">⚠️ Safety Event</option>
                                    <option value="other">📝 Other Note</option>
                                </select>
                            </div>

                            {/* Description Column */}
                            <div className="md:col-span-7">
                                <textarea
                                    value={event.event_description}
                                    onChange={(e) => updateEvent(index, 'event_description', e.target.value)}
                                    placeholder="Describe the event..."
                                    className="w-full h-full min-h-[80px] px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                />
                                <div className="flex justify-between items-center mt-1">
                                    <span className={`text-xs ${event.event_description.length > 450 ? 'text-red-400' : 'text-slate-500'}`}>
                                        {event.event_description.length}/500
                                    </span>
                                </div>
                            </div>

                            {/* Actions Column */}
                            <div className="md:col-span-1 flex items-start justify-end">
                                <button
                                    onClick={() => removeEvent(index)}
                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    title="Delete Entry"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SessionTimelineForm;
