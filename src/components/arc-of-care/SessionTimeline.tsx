import React from 'react';
import { Clock, AlertCircle, Activity, Siren, CheckCircle } from 'lucide-react';

interface SessionEvent {
    id: number;
    timestamp: Date;
    eventType: 'safety_event' | 'intervention' | 'milestone';
    description: string;
    severity?: 'mild' | 'moderate' | 'severe';
}

interface SessionTimelineProps {
    events: SessionEvent[];
}

/**
 * SessionTimeline - Chronological event visualization
 * 
 * Displays all session events in chronological order:
 * - Safety events (nausea, anxiety, panic)
 * - Interventions (verbal reassurance, breathing, chemical rescue)
 * - Milestones (onset, peak, resolution)
 * 
 * Auto-scrolls to latest event
 */
const SessionTimeline: React.FC<SessionTimelineProps> = ({ events }) => {
    const getEventIcon = (event: SessionEvent) => {
        switch (event.eventType) {
            case 'safety_event':
                return AlertCircle;
            case 'intervention':
                return Activity;
            case 'milestone':
                return CheckCircle;
            default:
                return Clock;
        }
    };

    const getEventColor = (event: SessionEvent) => {
        if (event.eventType === 'safety_event') {
            switch (event.severity) {
                case 'severe':
                    return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: 'text-red-400' };
                case 'moderate':
                    return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: 'text-amber-400' };
                case 'mild':
                    return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: 'text-blue-400' };
                default:
                    return { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-300', icon: 'text-slate-300' };
            }
        }
        if (event.eventType === 'intervention') {
            return { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: 'text-purple-400' };
        }
        return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: 'text-emerald-400' };
    };

    if (events.length === 0) {
        return (
            <div className="text-center py-12">
                <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-300 text-sm">No events logged yet</p>
                <p className="text-slate-500 text-xs mt-1">Events will appear here as they occur</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {events.map((event, index) => {
                const Icon = getEventIcon(event);
                const colors = getEventColor(event);
                const isFirst = index === 0;

                return (
                    <div key={event.id} className="relative">
                        {/* Timeline connector */}
                        {!isFirst && (
                            <div className="absolute left-[19px] -top-3 w-0.5 h-3 bg-slate-700"></div>
                        )}

                        {/* Event card */}
                        <div className={`flex gap-3 p-4 rounded-xl border ${colors.bg} ${colors.border}`}>
                            {/* Icon */}
                            <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                                <Icon className={`w-5 h-5 ${colors.icon}`} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-semibold uppercase tracking-wider ${colors.text}`}>
                                            {event.eventType.replace('_', ' ')}
                                        </span>
                                        {event.severity && (
                                            <span className={`text-xs px-2 py-0.5 rounded ${colors.bg} ${colors.border} border ${colors.text}`}>
                                                {event.severity}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-slate-500 flex-shrink-0">
                                        {event.timestamp.toLocaleTimeString()}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {event.description}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SessionTimeline;
