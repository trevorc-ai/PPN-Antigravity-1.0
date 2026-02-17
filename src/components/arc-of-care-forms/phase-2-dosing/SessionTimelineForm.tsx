import React, { useState, useEffect } from 'react';
import { Clock, Save, CheckCircle, Zap } from 'lucide-react';
import { FormField } from '../shared/FormField';

/**
 * SessionTimelineForm - Session Event Timeline
 * 
 * Fields: Dose Administered, Onset, Peak, Session Ended (all DateTime)
 * Layout: Vertical timeline with visual indicators
 * Features: "Now" buttons, elapsed time calculation, quick-fill typical timeline
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

const SessionTimelineForm: React.FC<SessionTimelineFormProps> = ({
    onSave,
    initialData = {},
    patientId,
    sessionId
}) => {
    const [data, setData] = useState<SessionTimelineData>(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Auto-save with debounce
    useEffect(() => {
        if (onSave && Object.keys(data).length > 0) {
            setIsSaving(true);
            const timer = setTimeout(() => {
                onSave(data);
                setIsSaving(false);
                setLastSaved(new Date());
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [data, onSave]);

    const updateField = (field: keyof SessionTimelineData, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const setNow = (field: keyof SessionTimelineData) => {
        const now = new Date().toISOString().slice(0, 16);
        updateField(field, now);
    };

    const quickFillTypical = () => {
        const now = new Date();
        const doseTime = now.toISOString().slice(0, 16);
        const onsetTime = new Date(now.getTime() + 30 * 60000).toISOString().slice(0, 16); // +30 min
        const peakTime = new Date(now.getTime() + 120 * 60000).toISOString().slice(0, 16); // +2 hours
        const endTime = new Date(now.getTime() + 360 * 60000).toISOString().slice(0, 16); // +6 hours

        setData({
            dose_administered_at: doseTime,
            onset_reported_at: onsetTime,
            peak_intensity_at: peakTime,
            session_ended_at: endTime
        });
    };

    const calculateElapsed = (from?: string, to?: string): string => {
        if (!from || !to) return '--';
        const diff = new Date(to).getTime() - new Date(from).getTime();
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        return `${hours}h ${minutes}m`;
    };

    const timelineEvents = [
        {
            field: 'dose_administered_at' as keyof SessionTimelineData,
            label: 'Dose Administered',
            icon: Pill,
            color: 'text-pink-400',
            elapsed: null
        },
        {
            field: 'onset_reported_at' as keyof SessionTimelineData,
            label: 'Onset Reported',
            icon: Zap,
            color: 'text-yellow-400',
            elapsed: calculateElapsed(data.dose_administered_at, data.onset_reported_at)
        },
        {
            field: 'peak_intensity_at' as keyof SessionTimelineData,
            label: 'Peak Intensity',
            icon: Zap,
            color: 'text-orange-400',
            elapsed: calculateElapsed(data.dose_administered_at, data.peak_intensity_at)
        },
        {
            field: 'session_ended_at' as keyof SessionTimelineData,
            label: 'Session Ended',
            icon: CheckCircle,
            color: 'text-emerald-400',
            elapsed: calculateElapsed(data.dose_administered_at, data.session_ended_at)
        }
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-200 flex items-center gap-3">
                            <Clock className="w-7 h-7 text-blue-400" />
                            Session Timeline
                        </h2>
                        <p className="text-slate-400 text-sm mt-2">
                            Track key milestones during the dosing session to monitor substance pharmacokinetics.
                        </p>
                    </div>
                    <button
                        onClick={quickFillTypical}
                        className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-lg text-sm font-medium transition-all"
                    >
                        Quick Fill Typical
                    </button>
                </div>
                {isSaving && (
                    <div className="flex items-center gap-2 text-blue-400 text-xs mt-4">
                        <Save className="w-4 h-4 animate-pulse" />
                        <span>Saving...</span>
                    </div>
                )}
                {lastSaved && !isSaving && (
                    <div className="flex items-center gap-2 text-emerald-400 text-xs mt-4">
                        <CheckCircle className="w-4 h-4" />
                        <span>Saved {lastSaved.toLocaleTimeString()}</span>
                    </div>
                )}
            </div>

            {/* Timeline */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="relative space-y-8">
                    {/* Vertical Line */}
                    <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-700/50" />

                    {timelineEvents.map((event, index) => {
                        const Icon = event.icon;
                        const hasValue = !!data[event.field];

                        return (
                            <div key={event.field} className="relative">
                                {/* Timeline Dot */}
                                <div className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center ${hasValue ? `${event.color} bg-current/10 border-2 border-current` : 'bg-slate-800 border-2 border-slate-700'
                                    }`}>
                                    <Icon className={`w-6 h-6 ${hasValue ? event.color : 'text-slate-600'}`} />
                                </div>

                                {/* Event Content */}
                                <div className="ml-20 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-slate-200">{event.label}</h3>
                                        {event.elapsed && event.elapsed !== '--' && (
                                            <span className="text-xs text-slate-500 font-mono">
                                                T+{event.elapsed}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <input
                                            type="datetime-local"
                                            value={data[event.field] ?? ''}
                                            onChange={(e) => updateField(event.field, e.target.value)}
                                            className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                        <button
                                            onClick={() => setNow(event.field)}
                                            className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all whitespace-nowrap"
                                        >
                                            Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Total Duration */}
                {data.dose_administered_at && data.session_ended_at && (
                    <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-emerald-300 font-semibold">Total Session Duration</span>
                            <span className="text-2xl font-black text-emerald-400">
                                {calculateElapsed(data.dose_administered_at, data.session_ended_at)}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Import Pill icon
const Pill = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export default SessionTimelineForm;
