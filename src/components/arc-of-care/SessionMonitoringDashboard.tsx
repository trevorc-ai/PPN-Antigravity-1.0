import React, { useState, useEffect } from 'react';
import { Clock, Activity, Heart, AlertTriangle, Plus, CheckCircle } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';
import RealTimeVitalsPanel from './RealTimeVitalsPanel.tsx';
import SessionTimeline from './SessionTimeline.tsx';
import RescueProtocolChecklist from './RescueProtocolChecklist.tsx';

interface SessionMonitoringDashboardProps {
    sessionId: number;
    patientId: string;
    doseAdministeredAt: Date;
    onLogEvent?: (event: SessionEvent) => void;
    onEndSession?: () => void;
}

interface SessionEvent {
    id: number;
    timestamp: Date;
    eventType: 'safety_event' | 'intervention' | 'milestone';
    description: string;
    severity?: 'mild' | 'moderate' | 'severe';
}

interface VitalsData {
    heartRate: number;
    hrv: number;
    bloodPressure: string;
    timestamp: Date;
}

interface Alert {
    id: number;
    type: 'heart_rate' | 'blood_pressure' | 'hrv';
    severity: 'warning' | 'critical';
    message: string;
}

/**
 * SessionMonitoringDashboard - Phase 2: Session Logger
 * 
 * Real-time monitoring dashboard for dosing sessions:
 * - Elapsed time counter
 * - Live vitals (HR, HRV, BP)
 * - Event timeline
 * - Active alerts
 * - Rescue protocol checklist
 * 
 * Part of Arc of Care system (WO_042)
 */
const SessionMonitoringDashboard: React.FC<SessionMonitoringDashboardProps> = ({
    sessionId,
    patientId,
    doseAdministeredAt,
    onLogEvent,
    onEndSession
}) => {
    const [elapsedTime, setElapsedTime] = useState('0:00:00');
    const [currentVitals, setCurrentVitals] = useState<VitalsData | null>(null);
    const [timeline, setTimeline] = useState<SessionEvent[]>([]);
    const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
    const [showEventModal, setShowEventModal] = useState(false);

    // Calculate elapsed time
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const diff = now.getTime() - doseAdministeredAt.getTime();
            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setElapsedTime(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [doseAdministeredAt]);

    // Simulate vitals updates (in production, this would come from wearable API)
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentVitals({
                heartRate: 70 + Math.floor(Math.random() * 30),
                hrv: 50 + Math.floor(Math.random() * 30),
                bloodPressure: `${110 + Math.floor(Math.random() * 20)}/${70 + Math.floor(Math.random() * 10)}`,
                timestamp: new Date()
            });
        }, 30000); // Update every 30 seconds

        // Initial vitals
        setCurrentVitals({
            heartRate: 75,
            hrv: 65,
            bloodPressure: '120/80',
            timestamp: new Date()
        });

        return () => clearInterval(interval);
    }, []);

    const handleLogEvent = (event: Omit<SessionEvent, 'id'>) => {
        const newEvent = {
            ...event,
            id: timeline.length + 1
        };
        setTimeline([...timeline, newEvent]);
        if (onLogEvent) {
            onLogEvent(newEvent);
        }
    };

    const handleInterventionUsed = (interventionCode: string) => {
        handleLogEvent({
            timestamp: new Date(),
            eventType: 'intervention',
            description: `Intervention used: ${interventionCode}`
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl">
                            <Activity className="w-8 h-8 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-200">Session Monitoring</h2>
                            <p className="text-slate-400 text-sm">Patient: {patientId} | Session: #{sessionId}</p>
                        </div>
                    </div>

                    {/* Elapsed Time */}
                    <div className="text-right">
                        <AdvancedTooltip
                            content="Time since dose was administered. Peak intensity typically occurs 1-3 hours post-dose for psilocybin."
                            type="info"
                            tier="standard"
                            side="left"
                        >
                            <div className="flex items-center gap-2 cursor-help">
                                <Clock className="w-5 h-5 text-slate-400" />
                                <div>
                                    <div className="text-3xl font-mono font-bold text-emerald-400">{elapsedTime}</div>
                                    <div className="text-xs text-slate-400">Elapsed Time</div>
                                </div>
                            </div>
                        </AdvancedTooltip>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Vitals & Alerts */}
                <div className="space-y-6">
                    {/* Real-Time Vitals */}
                    <RealTimeVitalsPanel vitals={currentVitals} />

                    {/* Active Alerts */}
                    {activeAlerts.length > 0 && (
                        <div className="bg-red-900/20 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-5 h-5 text-red-400" />
                                <h3 className="text-slate-200 font-semibold">Active Alerts</h3>
                            </div>
                            <div className="space-y-2">
                                {activeAlerts.map((alert) => (
                                    <div
                                        key={alert.id}
                                        className={`p-3 rounded-lg border ${alert.severity === 'critical'
                                                ? 'bg-red-500/10 border-red-500/30'
                                                : 'bg-amber-500/10 border-amber-500/30'
                                            }`}
                                    >
                                        <p className={`text-sm font-medium ${alert.severity === 'critical' ? 'text-red-300' : 'text-amber-300'
                                            }`}>
                                            {alert.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Rescue Protocol */}
                    <RescueProtocolChecklist
                        sessionId={sessionId}
                        onInterventionUsed={handleInterventionUsed}
                    />
                </div>

                {/* Right Column: Timeline */}
                <div className="lg:col-span-2">
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-200 font-semibold text-lg">Session Timeline</h3>
                            <button
                                onClick={() => setShowEventModal(true)}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Log Event
                            </button>
                        </div>

                        <SessionTimeline events={timeline} />
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>All systems monitoring</span>
                    </div>

                    {onEndSession && (
                        <button
                            onClick={onEndSession}
                            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
                        >
                            End Session
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SessionMonitoringDashboard;
