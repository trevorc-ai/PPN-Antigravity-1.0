import React, { useState, useEffect } from 'react';
import { useArcOfCareApi } from '../hooks/useArcOfCareApi';
import SessionMonitoringDashboard from '../components/arc-of-care/SessionMonitoringDashboard';
import RealTimeVitalsPanel from '../components/arc-of-care/RealTimeVitalsPanel';
import SessionTimeline from '../components/arc-of-care/SessionTimeline';
import RescueProtocolChecklist from '../components/arc-of-care/RescueProtocolChecklist';
import { Play, Pause, StopCircle, AlertTriangle } from 'lucide-react';

/**
 * Arc of Care Demo - Phase 2: Session Logger
 * 
 * Real-time session monitoring during psychedelic-assisted therapy
 * Part of WO_042
 */
const ArcOfCarePhase2Demo: React.FC = () => {
    const { logSessionEvent, fetchSessionVitals, loading, error } = useArcOfCareApi();

    // Session state
    const [sessionId] = useState(1);
    const [sessionActive, setSessionActive] = useState(false);
    const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
    const [elapsedMinutes, setElapsedMinutes] = useState(0);

    // Mock vitals data (in real app, this would come from API)
    const [vitals, setVitals] = useState({
        heartRate: 72,
        hrv: 45,
        bloodPressureSystolic: 120,
        bloodPressureDiastolic: 80,
        respiratoryRate: 16,
        oxygenSaturation: 98
    });

    // Mock events (in real app, this would come from API)
    const [events, setEvents] = useState([
        {
            id: 1,
            timestamp: '10:00 AM',
            type: 'Session Start',
            severity: 'info',
            description: 'Baseline vitals recorded. Patient comfortable and ready.'
        }
    ]);

    // Timer for elapsed time
    useEffect(() => {
        if (!sessionActive) return;

        const interval = setInterval(() => {
            if (sessionStartTime) {
                const elapsed = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60);
                setElapsedMinutes(elapsed);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [sessionActive, sessionStartTime]);

    // Simulate vitals updates
    useEffect(() => {
        if (!sessionActive) return;

        const interval = setInterval(() => {
            setVitals(prev => ({
                heartRate: Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 4)),
                hrv: Math.max(30, Math.min(60, prev.hrv + (Math.random() - 0.5) * 3)),
                bloodPressureSystolic: Math.max(110, Math.min(140, prev.bloodPressureSystolic + (Math.random() - 0.5) * 2)),
                bloodPressureDiastolic: Math.max(70, Math.min(90, prev.bloodPressureDiastolic + (Math.random() - 0.5) * 2)),
                respiratoryRate: Math.max(12, Math.min(20, prev.respiratoryRate + (Math.random() - 0.5) * 1)),
                oxygenSaturation: Math.max(95, Math.min(100, prev.oxygenSaturation + (Math.random() - 0.5) * 0.5))
            }));
        }, 3000);

        return () => clearInterval(interval);
    }, [sessionActive]);

    const handleStartSession = () => {
        setSessionActive(true);
        setSessionStartTime(new Date());
        setElapsedMinutes(0);
        addEvent('Session Start', 'info', 'Session initiated. Monitoring vitals.');
    };

    const handlePauseSession = () => {
        setSessionActive(false);
        addEvent('Session Paused', 'warning', 'Session monitoring paused.');
    };

    const handleEndSession = () => {
        setSessionActive(false);
        setSessionStartTime(null);
        setElapsedMinutes(0);
        addEvent('Session End', 'info', 'Session completed. Final vitals recorded.');
    };

    const addEvent = (type: string, severity: string, description: string) => {
        const now = new Date();
        const timestamp = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        setEvents(prev => [{
            id: prev.length + 1,
            timestamp,
            type,
            severity,
            description
        }, ...prev]);
    };

    const handleRescueProtocol = (intervention: string) => {
        addEvent(`Rescue Protocol: ${intervention}`, 'critical', `Intervention administered: ${intervention}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-black text-slate-200 tracking-tight">
                        Arc of Care - Phase 2
                    </h1>
                    <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                        Session Logger: Real-Time Monitoring During Psychedelic-Assisted Therapy
                    </p>
                </div>

                {/* Instructions */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                    <h3 className="text-blue-300 font-semibold mb-2">Demo Instructions</h3>
                    <p className="text-blue-200 text-sm leading-relaxed">
                        Click "Start Session" to begin monitoring. Watch the vitals update in real-time. Use the rescue protocol checklist
                        to log interventions. The session timeline shows all events chronologically.
                    </p>
                </div>

                {/* Session Controls */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-200">Session Controls</h2>
                            <p className="text-slate-400 text-sm mt-1">
                                {sessionActive ? `Session in progress • ${elapsedMinutes} minutes elapsed` : 'Session not started'}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {!sessionActive && !sessionStartTime && (
                                <button
                                    onClick={handleStartSession}
                                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
                                >
                                    <Play className="w-5 h-5" />
                                    Start Session
                                </button>
                            )}

                            {sessionActive && (
                                <button
                                    onClick={handlePauseSession}
                                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
                                >
                                    <Pause className="w-5 h-5" />
                                    Pause
                                </button>
                            )}

                            {sessionStartTime && (
                                <button
                                    onClick={handleEndSession}
                                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
                                >
                                    <StopCircle className="w-5 h-5" />
                                    End Session
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Dashboard */}
                {sessionStartTime && (
                    <>
                        <SessionMonitoringDashboard
                            sessionId={sessionId}
                            elapsedMinutes={elapsedMinutes}
                            currentPhase={elapsedMinutes < 30 ? 'onset' : elapsedMinutes < 120 ? 'peak' : 'integration'}
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Real-Time Vitals */}
                            <RealTimeVitalsPanel
                                heartRate={Math.round(vitals.heartRate)}
                                hrv={Math.round(vitals.hrv)}
                                bloodPressure={`${Math.round(vitals.bloodPressureSystolic)}/${Math.round(vitals.bloodPressureDiastolic)}`}
                                respiratoryRate={Math.round(vitals.respiratoryRate)}
                                oxygenSaturation={Math.round(vitals.oxygenSaturation)}
                                lastUpdated={new Date().toLocaleTimeString()}
                            />

                            {/* Session Timeline */}
                            <SessionTimeline events={events} />
                        </div>

                        {/* Rescue Protocol */}
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <AlertTriangle className="w-6 h-6 text-red-400" />
                                <div>
                                    <h3 className="text-red-300 text-xl font-bold">Rescue Protocol</h3>
                                    <p className="text-red-200 text-sm">Emergency interventions for challenging experiences</p>
                                </div>
                            </div>
                            <RescueProtocolChecklist onInterventionUsed={handleRescueProtocol} />
                        </div>
                    </>
                )}

                {/* Placeholder when session not started */}
                {!sessionStartTime && (
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
                        <Play className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-slate-300 text-xl font-semibold mb-2">No Active Session</h3>
                        <p className="text-slate-400 text-sm">Click "Start Session" to begin monitoring</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArcOfCarePhase2Demo;
