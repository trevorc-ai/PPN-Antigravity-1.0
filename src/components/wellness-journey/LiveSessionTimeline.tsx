import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
import { Pill, Activity, Mountain, Shield, CheckCircle, Diamond, Download, Clock, Mic, Music, AlertTriangle, Send } from 'lucide-react';
import { getTimelineEvents, createTimelineEvent } from '../../services/clinicalLog';
import { getEventTypeIdByCode, type FlowEventTypeCode } from '../../services/refFlowEventTypes';

export interface TimelineEvent {
    id: string;
    type: string;
    timestamp: Date;
    description: string;
    notes?: string;
    author: string;
}

interface LiveSessionTimelineProps {
    sessionId: string;
    active: boolean; // Controls whether refetching happens
    /** Hides the internal header row (title, syncing badge, export button).
     *  Use when the parent renders its own accordion wrapper. */
    hideHeader?: boolean;
    /** Hides the quick-action strip (P.Spoke / Music / Decision / Dose + free-text note).
     *  Use when those buttons are lifted to a different part of the layout. */
    hideActions?: boolean;
    /**
     * WO-576 Sub-task E: series visibility state lifted from SessionVitalsTrendChart.
     * When provided, ledger entries are filtered to match the chart's visible series:
     *   hr/bp/temp=false → hide vital_check entries
     *   events=false     → hide all non-vital entries
     * When omitted, no filtering is applied (all entries shown).
     */
    visible?: { hr: boolean; bp: boolean; temp: boolean; events: boolean };
    /** Timestamp (ms since epoch) when the dosing session started. Used to compute T+ header. */
    sessionStartMs?: number;
    /**
     * WO-A4: When true, the events list auto-scrolls to the bottom whenever events change
     * (new entry added) and on initial load. Newest entries are always visible without
     * the practitioner needing to manually scroll. Used by the cockpit panel (Panel B).
     */
    scrollToBottom?: boolean;
}

// WO-528: exported so SessionVitalsTrendChart can reuse the same palette
export const EVENT_CONFIG: Record<string, { icon: React.ReactNode, color: string, symbol: string, label: string }> = {
    DOSE: { icon: <Pill className="w-4 h-4" />, color: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30', symbol: '●', label: '[DOSE]' },
    dose_admin: { icon: <Pill className="w-4 h-4" />, color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30', symbol: '●', label: '[DOSE]' },
    // WO-559: Additional / supplemental dose, orange to match chart pin (distinct from initial dose_admin)
    additional_dose: { icon: <Pill className="w-4 h-4" />, color: 'text-orange-400 bg-orange-500/20 border-orange-500/30', symbol: '➕', label: '[ADD DOSE]' },
    vital_check: { icon: <Activity className="w-4 h-4" />, color: 'text-blue-400 bg-blue-500/20 border-blue-500/30', symbol: '○', label: '[VITALS]' },
    patient_observation: { icon: <Activity className="w-4 h-4" />, color: 'text-amber-400 bg-amber-500/20 border-amber-500/30', symbol: '○', label: '[OBSERVATION]' },
    music_change: { icon: <Diamond className="w-4 h-4 text-violet-400 fill-violet-400" />, color: 'text-violet-400 bg-violet-500/20 border-violet-500/30', symbol: '◆', label: '[MUSIC]' },
    clinical_decision: { icon: <Mountain className="w-4 h-4" />, color: 'text-orange-400 bg-orange-500/20 border-orange-500/30', symbol: '△', label: '[DECISION]' },
    safety_event: { icon: <Shield className="w-4 h-4" />, color: 'text-red-400 bg-red-500/20 border-red-500/30', symbol: '⚠', label: '[SAFETY]' },
    touch_consent: { icon: <CheckCircle className="w-4 h-4" />, color: 'text-pink-400 bg-pink-500/20 border-pink-500/30', symbol: '✓', label: '[CONSENT]' },
    general_note: { icon: <Activity className="w-4 h-4" />, color: 'text-slate-400 bg-slate-500/20 border-slate-500/30', symbol: '-', label: '[NOTE]' },
    // UX Polish: Session Update button → emerald to match button color
    session_update: { icon: <Activity className="w-4 h-4" />, color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30', symbol: '✎', label: '[SESSION UPDATE]' },
    // UX Polish: Rescue Protocol button → purple to match button color
    'rescue-protocol': { icon: <Shield className="w-4 h-4" />, color: 'text-purple-400 bg-purple-500/20 border-purple-500/30', symbol: '*', label: '[RESCUE PROTOCOL]' },
    rescue_protocol: { icon: <Shield className="w-4 h-4" />, color: 'text-purple-400 bg-purple-500/20 border-purple-500/30', symbol: '*', label: '[RESCUE PROTOCOL]' },
    // session_completed is the DB code used by WellnessFormRouter for rescue entries
    session_completed: { icon: <Shield className="w-4 h-4" />, color: 'text-purple-400 bg-purple-500/20 border-purple-500/30', symbol: '*', label: '[RESCUE PROTOCOL]' },
    // UX Polish: Adverse Event button → red to match button color; description decoded separately
    'safety-and-adverse-event': { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-red-400 bg-red-500/20 border-red-500/30', symbol: '⚠', label: '[ADVERSE EVENT]' },
    OBSERVATION: { icon: <Activity className="w-4 h-4" />, color: 'text-sky-400 bg-sky-500/20 border-sky-500/30', symbol: '○', label: '[OBSERVATION]' },
    PEAK: { icon: <Diamond className="w-4 h-4 text-fuchsia-400 fill-fuchsia-400" />, color: 'text-fuchsia-400 bg-fuchsia-500/20 border-fuchsia-500/30', symbol: '◆', label: '[PEAK]' },
    INTERVENTION: { icon: <Mountain className="w-4 h-4" />, color: 'text-amber-400 bg-amber-500/20 border-amber-500/30', symbol: '△', label: '[INTERVENTION]' },
    SAFETY: { icon: <Shield className="w-4 h-4" />, color: 'text-rose-400 bg-rose-500/20 border-rose-500/30', symbol: '⚠', label: '[SAFETY]' },
    CLOSE: { icon: <CheckCircle className="w-4 h-4" />, color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30', symbol: '✓', label: '[CLOSE]' },
};

/**
 * Decodes raw observation/intervention/resolution codes from the Adverse Event form
 * into human-readable labels for display in the timeline ledger.
 */
const OBSERVATION_CODE_LABELS: Record<string, string> = {
    // Physiological observations
    OBS_STABLE:        'Vitals Stable',
    OBS_HR_ELEVATED:   'HR Elevated',
    OBS_BP_ELEVATED:   'BP Elevated',
    OBS_SPO2_LOW:      'SpO₂ Low',
    // Behavioural / emotional observations
    OBS_CALM:          'Calm / Settled',
    OBS_DISTRESS_MILD: 'Mild Distress',
    OBS_DISTRESS_MOD:  'Moderate Distress',
    OBS_DISTRESS_SEV:  'Severe Distress',
    // Interventions
    INT_VERBAL:        'Verbal Reassurance',
    INT_MOVEMENT:      'Repositioned',
    INT_BREATHING:     'Guided Breathing',
    INT_TOUCH:         'Physical Touch',
    // Resolution status
    RES_RESOLVED:      'Resolved',
    RES_ONGOING:       'Ongoing',
    RES_ESCALATED:     'Escalated',
};

/** Replaces all OBS_, INT_, and RES_ prefixed tokens in a description with human-readable labels. */
function decodeObservationCodes(description: string): string {
    return description.replace(/\b(OBS|INT|RES)_[A-Z_]+\b/g, (code) =>
        OBSERVATION_CODE_LABELS[code] ?? code
    );
}

// Exported so DosingSessionPhase can render these buttons alongside its own action grid
export const QUICK_ACTIONS = [
    { label: 'P. Spoke', type: 'patient_observation', icon: Mic, color: 'text-amber-400 bg-amber-500/20 border-amber-500/30 hover:bg-amber-500/30', desc: 'Patient reported: ' },
    { label: 'Music', type: 'music_change', icon: Music, color: 'text-violet-400 bg-violet-500/20 border-violet-500/30 hover:bg-violet-500/30', desc: 'Playlist changed to: ' },
    { label: 'Decision', type: 'clinical_decision', icon: AlertTriangle, color: 'text-orange-400 bg-orange-500/20 border-orange-500/30 hover:bg-orange-500/30', desc: 'Decision made: ' },
];

function formatTimeAMPM(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export const LiveSessionTimeline: FC<LiveSessionTimelineProps> = ({
    sessionId, active, hideHeader = false, hideActions = false, visible, sessionStartMs, scrollToBottom = false
}) => {
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [draftNote, setDraftNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // WO-A4 (fix 2): Scroll-to-bottom — uses direct scrollTop manipulation on the
    // scrollable container ref. scrollIntoView was causing the whole page to jump
    // because it propagates scroll to all ancestors, not just the container.
    const eventsListRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (scrollToBottom && eventsListRef.current) {
            eventsListRef.current.scrollTop = eventsListRef.current.scrollHeight;
        }
    }, [events, scrollToBottom]);

    // WO-576 Sub-task D: T+ elapsed timer
    const [tPlus, setTPlus] = useState<string | null>(null);
    useEffect(() => {
        if (!sessionStartMs) return;
        const tick = () => {
            const diff = Date.now() - sessionStartMs;
            const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
            const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
            setTPlus(`T+${h}:${m}`);
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [sessionStartMs]);

    const handleAddNote = async (e?: React.FormEvent, presetType?: string, presetDesc?: string) => {
        if (e) e.preventDefault();

        const type = presetType || 'general_note';
        const description = presetDesc || draftNote.trim();

        if (!description) return;

        // Optimistic update: add event to local state immediately so user sees it right away
        const optimisticEvent: TimelineEvent = {
            id: `optimistic-${Date.now()}`,
            type,
            timestamp: new Date(),
            description,
            author: 'Clinician',
        };
        setEvents(prev => [...prev, optimisticEvent]);

        setIsSubmitting(true);
        const eventTimestamp = new Date().toISOString();

        // WO-576 Sub-task A: async lookup replaces hardcoded FLOW_EVENT_TYPE_CODES.has() check
        // so chip events (patient_observation, music_change, clinical_decision, general_note)
        // persist to DB. If the code resolves to null, we log a warning but keep the
        // optimistic entry in local state so the practitioner's session is not disrupted.
        try {
            const eventTypeId = await getEventTypeIdByCode(type as FlowEventTypeCode);
            if (eventTypeId !== null) {
                await createTimelineEvent({
                    session_id: sessionId,
                    event_timestamp: eventTimestamp,
                    event_type_id: eventTypeId,
                    performed_by: 'Current Clinician',
                    metadata: { event_description: description },
                });
            } else {
                console.warn(`[LiveSessionTimeline] event_type_code '${type}' not found in ref_flow_event_types. Entry kept locally only.`);
            }
        } catch (err) {
            // TEST session (FK violation) or network error — optimistic event preserved, skip DB write
            console.warn('[LiveSessionTimeline] DB write skipped (TEST session or transient error):', err);
        }

        // Always fire these regardless of DB write outcome
        window.dispatchEvent(new CustomEvent('ppn:session-event', {
            detail: { type, label: description, timestamp: eventTimestamp }
        }));
        if (!presetDesc) setDraftNote('');
        setIsSubmitting(false);
        // Refetch to get server-side IDs and confirm persistence
        fetchLocalEvents();
    };

    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    const fetchLocalEvents = useCallback(async () => {
        // Guard: only query if sessionId is a real UUID, prevents session_id=eq.undefined
        // or session_id=eq.1 errors when the component mounts before session creation resolves.
        if (!sessionId || !UUID_RE.test(sessionId)) return;

        const result = await getTimelineEvents(sessionId);
        if (result.success && result.data) {
            const mappedEvents: TimelineEvent[] = result.data.map((row: any) => ({
                id: row.id ?? row.timeline_event_id,
                // WO-584 fix: event_type TEXT column was dropped in migration 079.
                // getTimelineEvents now JOINs ref_flow_event_types — read from there.
                type: row.ref_flow_event_types?.event_type_code || 'general_note',
                timestamp: new Date(row.event_timestamp),
                description: row.metadata?.event_description || 'No description provided',
                notes: row.metadata?.notes,
                author: row.performed_by || 'Unknown Clinician'
            }));

            // Show real events if we have them. For TEST sessions or first real sessions,
            // DB returns empty — don't wipe optimistic/local events already in state.
            if (mappedEvents.length > 0) {
                // DB returns newest-first; reverse to chronological (oldest top, newest bottom)
                // so the timeline reads naturally and scroll-to-bottom shows the latest entry.
                const reversed = mappedEvents.reverse();
                setEvents(prev => {
                    // BUG-03 fix: deduplicate DB rows against optimistic entries already in state.
                    // Without this, ppn:dose-registered adds an optimistic entry AND
                    // fetchLocalEvents (called after save) adds the same row from DB → duplicate.
                    const existingOptimisticIds = new Set(
                        prev.filter(e => e.id.startsWith('dose-reg-') || e.id.startsWith('optimistic-')).map(e => e.id)
                    );
                    // Keep all DB rows (authoritative) plus any optimistic entries whose IDs
                    // don't yet exist in the DB result set (still pending server confirmation).
                    const dbIds = new Set(reversed.map(e => e.id));
                    const stillPendingOptimistic = prev.filter(
                        e => (e.id.startsWith('dose-reg-') || e.id.startsWith('optimistic-') || e.id.startsWith('session-ev-'))
                            && !dbIds.has(e.id)
                    );
                    return [...reversed, ...stillPendingOptimistic];
                });
            }
            // Intentionally NOT calling setEvents([]) for empty result:
            // preserves optimistic events for TEST sessions and new sessions
            // with no DB records yet.
        }
    }, [sessionId]);

    useEffect(() => {
        fetchLocalEvents();

        // WO-A4 (fix 2): 60-second background poll removed. It was the trigger for the
        // scrollIntoView → page-level auto-scroll bug. Events load:
        //   1. On mount (above)
        //   2. After every save (fetchLocalEvents() called in handleAddNote)
        //   3. On ppn:session-event custom event (dose-registered listener below)
        // No background polling needed for a single-device session. The timer, vitals
        // chart, and timestamps are all device-based.
        if (!active) return;
        // (No interval — no cleanup needed)
    }, [fetchLocalEvents, active]);

    // WO-559: listen for dose-registered events from DosingSessionPhase so the
    // timeline shows the Additional Dose (and initial dose_admin) immediately
    // as an optimistic entry, without waiting for the 30-sec DB poll.
    useEffect(() => {
        const handleDoseRegistered = (e: Event) => {
            const { type, label } = (e as CustomEvent).detail ?? {};
            if (!type) return;
            const optimistic: TimelineEvent = {
                id: `dose-reg-${Date.now()}`,
                type,
                timestamp: new Date(),
                description: label ?? type,
                author: 'Clinician',
            };
            setEvents(prev => [...prev, optimistic]);
        };
        window.addEventListener('ppn:dose-registered', handleDoseRegistered);
        return () => window.removeEventListener('ppn:dose-registered', handleDoseRegistered);
    }, []);

    // WO-694 BUG-05/06: listen for ppn:session-event so Session Updates (handleSaveUpdate)
    // and Adverse Events (WellnessFormRouter) appear in the timeline immediately as
    // optimistic entries — without waiting for a DB refetch.
    // Root cause: DosingSessionPhase dispatches ppn:session-event but LiveSessionTimeline
    // previously had no listener for it (only ppn:dose-registered).
    useEffect(() => {
        const handleSessionEvent = (e: Event) => {
            const { type, label, timestamp } = (e as CustomEvent).detail ?? {};
            if (!type) return;
            const optimistic: TimelineEvent = {
                id: `session-ev-${Date.now()}`,
                type,
                timestamp: timestamp ? new Date(timestamp) : new Date(),
                description: label ?? type,
                author: 'Clinician',
            };
            setEvents(prev => [...prev, optimistic]);
        };
        window.addEventListener('ppn:session-event', handleSessionEvent);
        return () => window.removeEventListener('ppn:session-event', handleSessionEvent);
    }, []);




    const handleExportLog = () => {
        if (events.length === 0) {
            // Nothing to export yet — inform the clinician
            console.warn('[LiveSessionTimeline] Export Log: no events recorded yet. Start the session and log events before exporting.');
            window.dispatchEvent(new CustomEvent('ppn:toast', {
                detail: { title: 'Session Log Empty', message: 'No events have been recorded yet. Log vitals, observations, or actions first.', type: 'warning' }
            }));
            return;
        }

        const exportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const lines = [
            '══════════════════════════════════════════════════════════',
            'SESSION TIMELINE LOG',
            'PPN Research Portal — Confidential Clinical Document',
            '══════════════════════════════════════════════════════════',
            `Session ID:  ${sessionId}`,
            `Export Date: ${exportDate}`,
            `Events:      ${events.length}`,
            '──────────────────────────────────────────────────────────',
            '',
        ];

        events.forEach(e => {
            const time = formatTimeAMPM(e.timestamp);
            // NULL-SAFETY: unknown event types fall back to general_note config
            const conf = EVENT_CONFIG[e.type] ?? EVENT_CONFIG['general_note'];
            lines.push(`${time}  ${conf.symbol}  ${conf.label}  ${e.description}`);
            if (e.notes) {
                lines.push(`              Notes: ${e.notes}`);
            }
            lines.push('');
        });

        lines.push('──────────────────────────────────────────────────────────');
        lines.push(`Provider Signature: ______________________________   Date: _______________`);
        lines.push('══════════════════════════════════════════════════════════');

        const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `session_timeline_${sessionId}_${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // WO-576 Sub-task E: filter ledger entries based on chart visible-series state
    const filteredEvents = React.useMemo(() => {
        if (!visible) return events;
        const isVitalHidden = !visible.hr && !visible.bp && !visible.temp;
        const areEventsHidden = !visible.events;
        return events.filter(ev => {
            if (ev.type === 'vital_check' && isVitalHidden) return false;
            if (ev.type !== 'vital_check' && areEventsHidden) return false;
            return true;
        });
    }, [events, visible]);

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl flex flex-col overflow-hidden shadow-xl h-full">
            {!hideHeader && (
                <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/20">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-indigo-400" />
                        <div>
                            <h3 className="text-base font-bold text-[#A8B5D1] uppercase tracking-widest">Live Session Timeline</h3>
                            {active && (
                                <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    Syncing Live
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* WO-576 Sub-task D: T+ elapsed timer */}
                        {tPlus && (
                            <span className="text-xs font-mono font-black text-amber-400 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg"
                                aria-label="Elapsed session time">{tPlus}</span>
                        )}
                        <button
                            onClick={handleExportLog}
                            disabled={events.length === 0}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-bold text-slate-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Export session timeline log as text"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Export Log
                            {events.length > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 rounded bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-[10px] font-black">
                                    {events.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            )}

            <div ref={eventsListRef} className="p-3 flex-1 overflow-y-auto space-y-4 scroll-smooth">
                {filteredEvents.length === 0 ? (
                    <div className="text-center text-slate-500 py-4 text-sm italic">
                        {events.length > 0
                            ? 'All entries hidden by active filters. Adjust chart toggles to show entries.'
                            : 'Session timeline is empty. Record events below to begin building the timeline.'}
                    </div>
                ) : (
                    filteredEvents.map((event, index) => {
                        // UX Polish: two types of entries from the Adverse Event form should
                        // show [ADVERSE EVENT] in red:
                        // 1. patient_observation with "Safety observation:" prefix (observation log entries)
                        // 2. safety_event with "AE reported:" prefix (AE Report section entries from WellnessFormRouter)
                        const isAdverseObs =
                            (event.type === 'patient_observation' && event.description.startsWith('Safety observation')) ||
                            (event.type === 'safety_event' && event.description.startsWith('AE reported:'));

                        const conf = isAdverseObs
                            ? EVENT_CONFIG['safety-and-adverse-event']
                            : (EVENT_CONFIG[event.type] || EVENT_CONFIG['general_note']);

                        // Decode raw observation/intervention/resolution codes in the description
                        const displayDescription = decodeObservationCodes(event.description);

                        const isLast = index === filteredEvents.length - 1;

                        return (
                            <div key={event.id} className="relative flex gap-4 text-sm w-full">
                                {/* Timeline line */}
                                {!isLast && (
                                    <div className="absolute left-[83px] top-6 bottom-[-24px] w-px bg-slate-700/50"></div>
                                )}

                                {/* Time */}
                                <div className="text-xs font-mono font-bold text-slate-500 mt-1 whitespace-nowrap w-[54px] text-right shrink-0">
                                    {formatTimeAMPM(event.timestamp)}
                                </div>

                                {/* Icon / Symbol */}
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 z-10 ${conf.color}`}>
                                    {conf.icon}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-1">
                                    <p className="font-semibold text-slate-300">
                                        <span className={`mr-2 font-bold ${conf.color.split(' ')[0]}`}>{conf.label}</span>
                                        {displayDescription}
                                    </p>
                                    {event.notes && (
                                        <div className="mt-1.5 p-2 bg-slate-800/40 rounded border border-slate-700/30 text-slate-400 text-xs leading-relaxed">
                                            <span className="font-bold text-slate-500 mr-2 uppercase text-[10px] tracking-wider">Notes</span>
                                            {event.notes}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* ── Quick-Log action strip + freetext note form ─────────────────── */}
            {active && !hideActions && (
                <div className="border-t border-slate-700/50 bg-slate-800/10 p-3 space-y-2.5">

                    {/* One-tap quick actions — compact, 2-row layout on mobile */}
                    <div className="flex flex-wrap gap-1">
                        {QUICK_ACTIONS.map(action => (
                            <button
                                key={action.type}
                                onClick={() => handleAddNote(undefined, action.type, action.desc)}
                                disabled={isSubmitting}
                                aria-label={`Log: ${action.label}`}
                                className={[
                                    'flex items-center gap-1 px-2 py-1 rounded-lg border',
                                    'text-[10px] font-bold tracking-wide',
                                    'min-h-[32px] transition-colors active:scale-95',
                                    action.color,
                                    isSubmitting ? 'opacity-50 cursor-not-allowed' : '',
                                ].join(' ')}
                            >
                                <action.icon className="w-3 h-3 shrink-0" aria-hidden="true" />
                                {action.label}
                            </button>
                        ))}
                    </div>

                    {/* Freetext note input */}
                    <form
                        onSubmit={handleAddNote}
                        className="flex gap-2 items-center"
                        aria-label="Add custom session note"
                    >
                        <input
                            type="text"
                            value={draftNote}
                            onChange={e => setDraftNote(e.target.value)}
                            placeholder="Custom note…"
                            aria-label="Session note text"
                            className={[
                                'flex-1 bg-slate-900/60 border border-slate-700 rounded-xl',
                                'px-3 py-2 text-sm text-slate-200 placeholder-slate-600',
                                'focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500/40',
                                'min-h-[40px]',
                            ].join(' ')}
                        />
                        <button
                            type="submit"
                            disabled={!draftNote.trim() || isSubmitting}
                            aria-label="Submit note"
                            className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-95 flex-shrink-0"
                        >
                            <Send className="w-4 h-4" aria-hidden="true" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};
