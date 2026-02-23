import React, { FC, useState, useEffect, useCallback } from 'react';
import { Pill, Activity, Mountain, Shield, CheckCircle, Diamond, Download, Clock, Mic, Music, AlertTriangle, Send } from 'lucide-react';
import { getTimelineEvents, createTimelineEvent } from '../../services/clinicalLog';

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
}

const EVENT_CONFIG: Record<string, { icon: React.ReactNode, color: string, symbol: string, label: string }> = {
    DOSE: { icon: <Pill className="w-4 h-4" />, color: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30', symbol: '●', label: '[DOSE]' },
    dose_admin: { icon: <Pill className="w-4 h-4" />, color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30', symbol: '●', label: '[DOSE]' },
    vital_check: { icon: <Activity className="w-4 h-4" />, color: 'text-blue-400 bg-blue-500/20 border-blue-500/30', symbol: '○', label: '[VITALS]' },
    patient_observation: { icon: <Activity className="w-4 h-4" />, color: 'text-amber-400 bg-amber-500/20 border-amber-500/30', symbol: '○', label: '[OBSERVATION]' },
    music_change: { icon: <Diamond className="w-4 h-4 text-violet-400 fill-violet-400" />, color: 'text-violet-400 bg-violet-500/20 border-violet-500/30', symbol: '◆', label: '[MUSIC]' },
    clinical_decision: { icon: <Mountain className="w-4 h-4" />, color: 'text-orange-400 bg-orange-500/20 border-orange-500/30', symbol: '△', label: '[DECISION]' },
    safety_event: { icon: <Shield className="w-4 h-4" />, color: 'text-red-400 bg-red-500/20 border-red-500/30', symbol: '⚠', label: '[SAFETY]' },
    touch_consent: { icon: <CheckCircle className="w-4 h-4" />, color: 'text-pink-400 bg-pink-500/20 border-pink-500/30', symbol: '✓', label: '[CONSENT]' },
    general_note: { icon: <Activity className="w-4 h-4" />, color: 'text-slate-400 bg-slate-500/20 border-slate-500/30', symbol: '-', label: '[NOTE]' },
    OBSERVATION: { icon: <Activity className="w-4 h-4" />, color: 'text-sky-400 bg-sky-500/20 border-sky-500/30', symbol: '○', label: '[OBSERVATION]' },
    PEAK: { icon: <Diamond className="w-4 h-4 text-fuchsia-400 fill-fuchsia-400" />, color: 'text-fuchsia-400 bg-fuchsia-500/20 border-fuchsia-500/30', symbol: '◆', label: '[PEAK]' },
    INTERVENTION: { icon: <Mountain className="w-4 h-4" />, color: 'text-amber-400 bg-amber-500/20 border-amber-500/30', symbol: '△', label: '[INTERVENTION]' },
    SAFETY: { icon: <Shield className="w-4 h-4" />, color: 'text-rose-400 bg-rose-500/20 border-rose-500/30', symbol: '⚠', label: '[SAFETY]' },
    CLOSE: { icon: <CheckCircle className="w-4 h-4" />, color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30', symbol: '✓', label: '[CLOSE]' },
};

const QUICK_ACTIONS = [
    { label: 'Patient Spoke', type: 'patient_observation', icon: Mic, color: 'text-amber-400 bg-amber-500/20 border-amber-500/30 hover:bg-amber-500/30', desc: 'Patient reported: ' },
    { label: 'Music Change', type: 'music_change', icon: Music, color: 'text-violet-400 bg-violet-500/20 border-violet-500/30 hover:bg-violet-500/30', desc: 'Playlist changed to: ' },
    { label: 'Decision', type: 'clinical_decision', icon: AlertTriangle, color: 'text-orange-400 bg-orange-500/20 border-orange-500/30 hover:bg-orange-500/30', desc: 'Decision made: ' },
    { label: 'Admin Dose', type: 'dose_admin', icon: Pill, color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30 hover:bg-emerald-500/30', desc: 'Administered additional dose.' },
];

function formatTimeAMPM(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export const LiveSessionTimeline: FC<LiveSessionTimelineProps> = ({ sessionId, active }) => {
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [draftNote, setDraftNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddNote = async (e?: React.FormEvent, presetType?: string, presetDesc?: string) => {
        if (e) e.preventDefault();

        const type = presetType || 'general_note';
        const description = presetDesc || draftNote.trim();

        if (!description) return;

        setIsSubmitting(true);
        const eventData = {
            session_id: sessionId,
            event_timestamp: new Date().toISOString(),
            event_type: type,
            performed_by: 'Current Clinician',
            metadata: { event_description: description }
        };

        await createTimelineEvent(eventData);
        if (!presetDesc) setDraftNote('');
        setIsSubmitting(false);
        fetchLocalEvents();
    };

    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    const fetchLocalEvents = useCallback(async () => {
        // Guard: only query if sessionId is a real UUID — prevents session_id=eq.undefined
        // or session_id=eq.1 errors when the component mounts before session creation resolves.
        if (!sessionId || !UUID_RE.test(sessionId)) return;

        const result = await getTimelineEvents(sessionId);
        if (result.success && result.data) {
            const mappedEvents: TimelineEvent[] = result.data.map((row: any) => ({
                id: row.id,
                type: row.event_type || 'general_note',
                timestamp: new Date(row.event_timestamp),
                description: row.metadata?.event_description || 'No description provided',
                notes: row.metadata?.notes,
                author: row.performed_by || 'Unknown Clinician'
            }));

            // Overwrite with real data if it exists, else keep mock
            if (mappedEvents.length > 0) {
                // Reverse it so chronological matches the timeline approach
                setEvents(mappedEvents.reverse());
            } else {
                // Keep the mock events for visual demonstration
                setEvents([
                    { id: '1', type: 'DOSE', timestamp: new Date('2025-10-18T09:14:00'), description: 'Psilocybin 25mg oral administered', notes: 'Patient calm, set and setting confirmed', author: 'Dr. Jane Smith' },
                    { id: '2', type: 'OBSERVATION', timestamp: new Date('2025-10-18T10:02:00'), description: 'First onset effects reported', notes: 'Patient reported warmth, mild visuals', author: 'Dr. Jane Smith' },
                    { id: '3', type: 'SAFETY', timestamp: new Date('2025-10-18T10:45:00'), description: 'Patient experiencing slight nausea', notes: 'Provided ginger tea, nausea resolved after 15 minutes', author: 'Dr. Jane Smith' },
                ]);
            }
        }
    }, [sessionId]);

    useEffect(() => {
        fetchLocalEvents();

        if (!active) return;

        // Fetch periodically or subscribe
        const interval = setInterval(() => {
            fetchLocalEvents();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchLocalEvents, active]);

    const handleExportLog = () => {
        const lines = [
            'SESSION TIMELINE                                [Export Log]',
            '──────────────────────────────────────────────────────────'
        ];

        events.forEach(e => {
            const time = formatTimeAMPM(e.timestamp);
            const conf = EVENT_CONFIG[e.type];
            lines.push(`${time}  ${conf.symbol}  ${conf.label} ${e.description}`);
            if (e.notes) {
                lines.push(`              Notes: ${e.notes}`);
            }
            lines.push('');
        });

        lines.push('──────────────────────────────────────────────────────────');

        const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `session_timeline_${sessionId}_${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl flex flex-col overflow-hidden shadow-xl">
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
                <button
                    onClick={handleExportLog}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-bold text-slate-300 transition-colors"
                    aria-label="Export session timeline log as text"
                >
                    <Download className="w-3.5 h-3.5" />
                    Export Log
                </button>
            </div>




            <div className="p-6 max-h-[400px] overflow-y-auto space-y-6">
                {events.length === 0 ? (
                    <div className="text-center text-slate-500 py-8 text-sm italic">
                        Session timeline is empty. Record events below to begin building the timeline.
                    </div>
                ) : (
                    events.map((event, index) => {
                        const conf = EVENT_CONFIG[event.type] || EVENT_CONFIG['general_note'];
                        const isLast = index === events.length - 1;

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
                                        {event.description}
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
        </div>
    );
};
