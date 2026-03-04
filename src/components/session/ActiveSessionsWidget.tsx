import React from 'react';
import { Activity } from 'lucide-react';
import { useActiveSessions } from '../../hooks/useActiveSessions';
import SessionPillCard from '../session/SessionPillCard';

interface ActiveSessionsWidgetProps {
    isAuthenticated: boolean;
}

const ActiveSessionsWidget: React.FC<ActiveSessionsWidgetProps> = ({ isAuthenticated }) => {
    const { sessions, loading } = useActiveSessions(isAuthenticated);

    // Loading skeleton
    if (loading && sessions.length === 0) {
        return (
            <div
                className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
                aria-label="Active sessions loading"
            >
                <div className="flex items-center gap-3 mb-4">
                    <Activity className="w-5 h-5 text-amber-400" aria-hidden="true" />
                    <h3 className="ppn-card-title">Active Sessions</h3>
                </div>
                <div className="space-y-3">
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className="h-[66px] rounded-2xl bg-slate-800/40 animate-pulse"
                            aria-hidden="true"
                        />
                    ))}
                </div>
            </div>
        );
    }

    // Empty state, quiet, no noise
    if (sessions.length === 0) {
        return (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Activity className="w-5 h-5 text-slate-500" aria-hidden="true" />
                    <h3 className="ppn-card-title text-slate-400">Active Sessions</h3>
                </div>
                <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="size-12 rounded-2xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center mb-3">
                        <span
                            className="material-symbols-outlined text-[22px] text-slate-600"
                            aria-hidden="true"
                        >
                            sensors_off
                        </span>
                    </div>
                    <p className="ppn-body text-slate-500">No active sessions</p>
                    <p className="ppn-meta text-slate-600 mt-1">
                        Start a session in the Wellness Journey
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
            aria-label={`${sessions.length} active dosing session${sessions.length !== 1 ? 's' : ''}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    {/* Pulsing indicator while sessions are live */}
                    <div className="relative" aria-hidden="true">
                        <Activity className="w-5 h-5 text-amber-400" />
                        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                        </span>
                    </div>
                    <h3 className="ppn-card-title">Active Sessions</h3>
                </div>

                <span
                    className="ppn-meta text-amber-400 font-bold"
                    aria-label={`${sessions.length} active`}
                >
                    {sessions.length} LIVE
                </span>
            </div>

            {/* Session cards, dashboard variant (larger) */}
            <div className="space-y-3" role="list" aria-label="Active dosing sessions">
                {sessions.map((session) => (
                    <div key={session.id} role="listitem">
                        <SessionPillCard session={session} variant="card" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActiveSessionsWidget;
