import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AlertTriangle, Clock, Shield } from 'lucide-react';
import { triggerHaptic } from '../../hooks/useKeyboardShortcuts';
import { supabase } from '../../supabaseClient';

interface CrisisLoggerProps {
    sessionId: string;
    practitionerId?: string;
    doseAdministeredAt?: Date;
    onEventLogged?: (eventType: string) => void;
}

type EventType =
    | 'DOSE_ADMINISTERED'
    | 'VITAL_SIGNS_NORMAL'
    | 'VITAL_SIGNS_ELEVATED'
    | 'VERBAL_DEESCALATION'
    | 'PHYSICAL_COMFORT'
    | 'MUSIC_ADJUSTMENT'
    | 'LIGHTING_ADJUSTMENT'
    | 'TRIP_KILLER_BENZO'
    | 'TRIP_KILLER_ANTIPSYCHOTIC'
    | 'HYDRATION_PROVIDED'
    | 'EMERGENCY_CONTACT_NOTIFIED'
    | 'EMERGENCY_SERVICES_CALLED'
    | 'SESSION_TERMINATED_EARLY';

interface LoggedEvent {
    event_type: EventType;
    logged_at: Date;
    seconds_since_ingestion: number | null;
}

const EVENT_BUTTONS: {
    type: EventType;
    label: string;
    icon: string;
    color: string;
}[] = [
        { type: 'VITAL_SIGNS_NORMAL', label: 'Vitals OK', icon: '🟢', color: 'emerald' },
        { type: 'VITAL_SIGNS_ELEVATED', label: 'Vitals Elevated', icon: '🟡', color: 'amber' },
        { type: 'VERBAL_DEESCALATION', label: 'Verbal De-escalation', icon: '💬', color: 'blue' },
        { type: 'PHYSICAL_COMFORT', label: 'Physical Comfort', icon: '🤝', color: 'blue' },
        { type: 'MUSIC_ADJUSTMENT', label: 'Music Adjusted', icon: '🎵', color: 'slate' },
        { type: 'LIGHTING_ADJUSTMENT', label: 'Lighting Adjusted', icon: '💡', color: 'slate' },
        { type: 'HYDRATION_PROVIDED', label: 'Hydration Provided', icon: '💧', color: 'blue' },
        { type: 'TRIP_KILLER_BENZO', label: 'Benzo Administered', icon: '💊', color: 'amber' },
        { type: 'TRIP_KILLER_ANTIPSYCHOTIC', label: 'Antipsychotic Given', icon: '💊', color: 'orange' },
        { type: 'EMERGENCY_CONTACT_NOTIFIED', label: 'Emergency Contact', icon: '📞', color: 'orange' },
        { type: 'EMERGENCY_SERVICES_CALLED', label: '911 Called', icon: '🚑', color: 'red' },
        { type: 'SESSION_TERMINATED_EARLY', label: 'Session Ended Early', icon: '⛔', color: 'red' },
    ];

const LONG_PRESS_MS = 600;

const COLOR_CLASSES: Record<string, string> = {
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 active:bg-emerald-500/20',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-300 active:bg-amber-500/20',
    orange: 'bg-orange-500/10 border-orange-500/30 text-orange-300 active:bg-orange-500/20',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-300 active:bg-blue-500/20',
    red: 'bg-red-500/10 border-red-500/30 text-red-300 active:bg-red-500/20',
    slate: 'bg-slate-800/50 border-slate-700 text-slate-300 active:bg-slate-700/50',
};

function formatRelativeTime(seconds: number | null): string {
    if (seconds === null) return '--:--';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `T+${h}h ${m}m`;
}

function formatAbsoluteTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export const CrisisLogger: React.FC<CrisisLoggerProps> = ({
    sessionId,
    practitionerId,
    doseAdministeredAt,
    onEventLogged,
}) => {
    const [events, setEvents] = useState<LoggedEvent[]>([]);
    const [pressing, setPressing] = useState<EventType | null>(null);
    const [pressProgress, setPressProgress] = useState(0);
    const [now, setNow] = useState(new Date());
    const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    // Live clock for relative time display
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 10000);
        return () => clearInterval(interval);
    }, []);

    const secondsSinceDose = doseAdministeredAt
        ? Math.floor((now.getTime() - doseAdministeredAt.getTime()) / 1000)
        : null;

    const logEvent = useCallback(
        async (eventType: EventType) => {
            const loggedAt = new Date();
            const seconds = doseAdministeredAt
                ? Math.floor((loggedAt.getTime() - doseAdministeredAt.getTime()) / 1000)
                : null;

            const newEvent: LoggedEvent = {
                event_type: eventType,
                logged_at: loggedAt,
                seconds_since_ingestion: seconds,
            };
            setEvents((prev) => [newEvent, ...prev].slice(0, 20));

            triggerHaptic('medium');
            onEventLogged?.(eventType);

            // Write to DB — never block the practitioner if it fails
            try {
                await supabase.from('log_adverse_events').insert({
                    patient_id: practitionerId ?? null,
                    session_id: sessionId,
                    alert_type: eventType,
                    alert_severity: ['EMERGENCY_SERVICES_CALLED', 'SESSION_TERMINATED_EARLY', 'TRIP_KILLER_BENZO', 'TRIP_KILLER_ANTIPSYCHOTIC'].includes(eventType)
                        ? 'severe'
                        : 'mild',
                    alert_triggered_at: loggedAt.toISOString(),
                    trigger_value: { seconds_since_ingestion: seconds },
                    is_acknowledged: false,
                    is_resolved: false,
                });
            } catch {
                // Silently continue — local state is the source of truth during crisis
            }
        },
        [sessionId, practitionerId, doseAdministeredAt, onEventLogged]
    );

    const handleLongPressStart = useCallback(
        (eventType: EventType) => {
            setPressing(eventType);
            setPressProgress(0);

            let elapsed = 0;
            progressTimer.current = setInterval(() => {
                elapsed += 50;
                setPressProgress(Math.min((elapsed / LONG_PRESS_MS) * 100, 100));
            }, 50);

            pressTimer.current = setTimeout(() => {
                logEvent(eventType);
                setPressing(null);
                setPressProgress(0);
                if (progressTimer.current) clearInterval(progressTimer.current);
            }, LONG_PRESS_MS);
        },
        [logEvent]
    );

    const handleLongPressEnd = useCallback(() => {
        if (pressTimer.current) clearTimeout(pressTimer.current);
        if (progressTimer.current) clearInterval(progressTimer.current);
        setPressing(null);
        setPressProgress(0);
    }, []);

    return (
        <div className="bg-black border border-slate-800 rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-amber-400 uppercase tracking-widest">Crisis Logger</h3>
                        <p className="text-xs text-amber-600">Hold button to log — auto-timestamped</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-sm font-bold text-amber-400 font-mono">
                        {secondsSinceDose !== null
                            ? formatRelativeTime(secondsSinceDose)
                            : formatAbsoluteTime(now)}
                    </span>
                </div>
            </div>

            {/* Event Buttons */}
            <div className="p-4 grid grid-cols-2 gap-2">
                {EVENT_BUTTONS.map((btn) => {
                    const isPressed = pressing === btn.type;
                    return (
                        <button
                            key={btn.type}
                            onMouseDown={() => handleLongPressStart(btn.type)}
                            onMouseUp={handleLongPressEnd}
                            onMouseLeave={handleLongPressEnd}
                            onTouchStart={() => handleLongPressStart(btn.type)}
                            onTouchEnd={handleLongPressEnd}
                            aria-label={`Log: ${btn.label}. Hold for ${LONG_PRESS_MS}ms to confirm.`}
                            className={`crisis-button relative h-20 flex flex-col items-center justify-center gap-1 rounded-2xl border-2 transition-all duration-150 overflow-hidden touch-manipulation select-none ${COLOR_CLASSES[btn.color]
                                } ${isPressed ? 'scale-95' : 'hover:scale-[1.02]'}`}
                        >
                            {/* Long-press progress bar */}
                            {isPressed && (
                                <div
                                    className="absolute bottom-0 left-0 h-1 bg-current opacity-60 transition-none"
                                    style={{ width: `${pressProgress}%` }}
                                />
                            )}
                            <span className="text-2xl">{btn.icon}</span>
                            <span className="text-xs font-black uppercase tracking-wide text-center leading-tight px-2">
                                {btn.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Dose Administered — full width, primary action */}
            <div className="px-4 pb-4">
                <button
                    onMouseDown={() => handleLongPressStart('DOSE_ADMINISTERED')}
                    onMouseUp={handleLongPressEnd}
                    onMouseLeave={handleLongPressEnd}
                    onTouchStart={() => handleLongPressStart('DOSE_ADMINISTERED')}
                    onTouchEnd={handleLongPressEnd}
                    aria-label="Log: Dose Administered. Hold to confirm."
                    className={`crisis-button relative w-full h-16 flex items-center justify-center gap-3 rounded-2xl border-2 bg-primary/10 border-primary/40 text-primary font-black uppercase tracking-widest text-sm overflow-hidden touch-manipulation select-none transition-all ${pressing === 'DOSE_ADMINISTERED' ? 'scale-[0.98]' : 'hover:bg-primary/20'
                        }`}
                >
                    {pressing === 'DOSE_ADMINISTERED' && (
                        <div
                            className="absolute bottom-0 left-0 h-1 bg-primary opacity-60"
                            style={{ width: `${pressProgress}%` }}
                        />
                    )}
                    <Shield className="w-5 h-5" />
                    Log Dose Administered
                </button>
            </div>

            {/* Timeline */}
            {events.length > 0 && (
                <div className="border-t border-slate-800 px-4 py-3">
                    <p className="text-xs font-black text-amber-600 uppercase tracking-widest mb-2">Timeline</p>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                        {events.map((evt, i) => {
                            const btn = EVENT_BUTTONS.find((b) => b.type === evt.event_type);
                            return (
                                <div key={i} className="flex items-center gap-2 text-xs">
                                    <span>{btn?.icon ?? '📌'}</span>
                                    <span className="font-mono text-amber-600 w-16 flex-shrink-0">
                                        {evt.seconds_since_ingestion !== null
                                            ? formatRelativeTime(evt.seconds_since_ingestion)
                                            : formatAbsoluteTime(evt.logged_at)}
                                    </span>
                                    <span className="text-amber-400 font-medium">{btn?.label ?? evt.event_type}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Disclaimer */}
            <div className="px-4 py-3 border-t border-slate-800">
                <p className="text-xs text-slate-600 italic text-center">
                    Documentation tool only — not medical advice. Hold any button to log.
                </p>
            </div>
        </div>
    );
};

export default CrisisLogger;
