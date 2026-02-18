import React, { useState } from 'react';
import { useArcOfCareApi } from '../hooks/useArcOfCareApi';
import PulseCheckWidget from '../components/arc-of-care/PulseCheckWidget';
import SymptomDecayCurveChart from '../components/arc-of-care/SymptomDecayCurveChart';
import RedAlertPanel from '../components/arc-of-care/RedAlertPanel';
import { Calendar, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * Wellness Journey Demo - Phase 3: Integration Tracker
 * 
 * Longitudinal care tracking post-session
 * Part of WO_042
 */
const ArcOfCarePhase3Demo: React.FC = () => {
    const { submitPulseCheck, fetchSymptomTrajectory, loading, error } = useArcOfCareApi();

    // Pulse check state
    const [pulseCheckSubmitted, setPulseCheckSubmitted] = useState(false);
    const [lastPulseCheck, setLastPulseCheck] = useState<any>(null);

    // Mock symptom trajectory data (PHQ-9 scores over 6 months)
    const trajectoryData = [
        { date: '2025-08-16', score: 24, severity: 'severe' },
        { date: '2025-09-01', score: 21, severity: 'severe' },
        { date: '2025-09-15', score: 18, severity: 'moderately-severe' },
        { date: '2025-10-01', score: 14, severity: 'moderate' },
        { date: '2025-10-15', score: 11, severity: 'moderate' },
        { date: '2025-11-01', score: 8, severity: 'mild' },
        { date: '2025-11-15', score: 6, severity: 'mild' },
        { date: '2025-12-01', score: 4, severity: 'minimal' },
        { date: '2025-12-15', score: 3, severity: 'minimal' },
        { date: '2026-01-01', score: 2, severity: 'minimal' },
        { date: '2026-01-15', score: 2, severity: 'minimal' },
        { date: '2026-02-01', score: 1, severity: 'minimal' },
        { date: '2026-02-16', score: 1, severity: 'minimal' }
    ];

    // Mock red alerts
    const [alerts, setAlerts] = useState([
        {
            id: 1,
            type: 'suicidal-ideation',
            severity: 'critical',
            message: 'Patient reported passive suicidal ideation on C-SSRS',
            timestamp: '2026-02-14 10:30 AM',
            acknowledged: false,
            resolved: false
        },
        {
            id: 2,
            type: 'missed-sessions',
            severity: 'high',
            message: 'Patient missed 2 consecutive integration sessions',
            timestamp: '2026-02-10 3:00 PM',
            acknowledged: true,
            resolved: false
        }
    ]);

    const handlePulseCheckSubmit = async (data: any) => {
        setPulseCheckSubmitted(true);
        setLastPulseCheck(data);

        // In real app, would call API
        // await submitPulseCheck(data);
    };

    const handleAcknowledgeAlert = (alertId: number) => {
        setAlerts(prev => prev.map(alert =>
            alert.id === alertId ? { ...alert, acknowledged: true } : alert
        ));
    };

    const handleResolveAlert = (alertId: number) => {
        setAlerts(prev => prev.map(alert =>
            alert.id === alertId ? { ...alert, resolved: true } : alert
        ));
    };

    return (
        <div className="min-h-screen bg-[#0a1628] p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-black text-slate-300 tracking-tight">
                        Wellness Journey - Phase 3
                    </h1>
                    <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                        Integration Tracker: Longitudinal Care & Symptom Monitoring
                    </p>
                </div>

                {/* Instructions */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                    <h3 className="text-blue-300 font-semibold mb-2">Demo Instructions</h3>
                    <p className="text-blue-200 text-sm leading-relaxed">
                        Submit a daily pulse check to track connection and sleep quality. View the symptom decay curve showing PHQ-9
                        scores over 6 months post-session. Manage red alerts for critical patient safety issues.
                    </p>
                </div>

                {/* Red Alerts - Top Priority */}
                {alerts.some(a => !a.resolved) && (
                    <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                            <div>
                                <h3 className="text-red-300 text-xl font-bold">Red Alerts</h3>
                                <p className="text-red-200 text-sm">Critical patient safety issues requiring immediate attention</p>
                            </div>
                        </div>
                        <RedAlertPanel
                            alerts={alerts}
                            onAcknowledge={handleAcknowledgeAlert}
                            onResolve={handleResolveAlert}
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Daily Pulse Check */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-6 h-6 text-emerald-400" />
                            <div>
                                <h2 className="text-2xl font-bold text-slate-300">Daily Pulse Check</h2>
                                <p className="text-slate-300 text-sm">Quick daily check-in (30 seconds)</p>
                            </div>
                        </div>

                        <PulseCheckWidget onSubmit={handlePulseCheckSubmit} />

                        {pulseCheckSubmitted && lastPulseCheck && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-emerald-300 text-sm font-medium">Pulse Check Submitted</p>
                                    <p className="text-emerald-200 text-sm mt-1">
                                        Connection: {lastPulseCheck.connectionLevel}/5 • Sleep: {lastPulseCheck.sleepQuality}/5
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                        <h3 className="text-slate-300 text-lg font-semibold mb-4">Integration Progress</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-800/50 rounded-lg p-4">
                                <p className="text-slate-300 text-sm mb-1">Days Post-Session</p>
                                <p className="text-3xl font-bold text-emerald-400">183</p>
                                <p className="text-slate-300 text-sm mt-1">~6 months</p>
                            </div>

                            <div className="bg-slate-800/50 rounded-lg p-4">
                                <p className="text-slate-300 text-sm mb-1">PHQ-9 Improvement</p>
                                <p className="text-3xl font-bold text-blue-400">96%</p>
                                <p className="text-slate-300 text-sm mt-1">24 → 1</p>
                            </div>

                            <div className="bg-slate-800/50 rounded-lg p-4">
                                <p className="text-slate-300 text-sm mb-1">Pulse Checks</p>
                                <p className="text-3xl font-bold text-purple-400">156</p>
                                <p className="text-slate-300 text-sm mt-1">85% adherence</p>
                            </div>

                            <div className="bg-slate-800/50 rounded-lg p-4">
                                <p className="text-slate-300 text-sm mb-1">Integration Sessions</p>
                                <p className="text-3xl font-bold text-amber-400">12</p>
                                <p className="text-slate-300 text-sm mt-1">Completed</p>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                            <p className="text-emerald-300 text-sm font-medium mb-1">Sustained Remission</p>
                            <p className="text-emerald-200 text-sm leading-relaxed">
                                Patient has maintained minimal depression symptoms (PHQ-9 ≤ 4) for 90+ consecutive days.
                                Excellent long-term outcome.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Symptom Decay Curve */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <TrendingDown className="w-6 h-6 text-blue-400" />
                        <div>
                            <h2 className="text-2xl font-bold text-slate-300">Symptom Trajectory</h2>
                            <p className="text-slate-300 text-sm">PHQ-9 scores over 6 months post-session</p>
                        </div>
                    </div>

                    <SymptomDecayCurveChart data={trajectoryData} />

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                        <p className="text-blue-300 text-sm font-medium mb-2">Clinical Interpretation</p>
                        <p className="text-blue-200 text-sm leading-relaxed">
                            The symptom decay curve shows a rapid initial improvement (first 2 months) followed by sustained remission.
                            This pattern is consistent with successful psychedelic-assisted therapy outcomes. The patient moved from
                            <span className="font-semibold"> severe depression (PHQ-9: 24)</span> to
                            <span className="font-semibold"> minimal symptoms (PHQ-9: 1)</span> over 6 months.
                        </p>
                    </div>
                </div>

                {/* Longitudinal Assessments */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-slate-300 text-lg font-semibold mb-4">Scheduled Assessments</h3>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                            <div>
                                <p className="text-slate-300 text-sm font-medium">PHQ-9 (Depression)</p>
                                <p className="text-slate-300 text-sm">Every 2 weeks</p>
                            </div>
                            <div className="text-right">
                                <p className="text-emerald-400 text-sm font-semibold">Next: Feb 28</p>
                                <p className="text-slate-300 text-sm">12 days</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                            <div>
                                <p className="text-slate-300 text-sm font-medium">C-SSRS (Suicide Risk)</p>
                                <p className="text-slate-300 text-sm">Weekly</p>
                            </div>
                            <div className="text-right">
                                <p className="text-amber-400 text-sm font-semibold">Next: Feb 21</p>
                                <p className="text-slate-300 text-sm">5 days</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                            <div>
                                <p className="text-slate-300 text-sm font-medium">PSQI (Sleep Quality)</p>
                                <p className="text-slate-300 text-sm">Monthly</p>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-400 text-sm font-semibold">Next: Mar 1</p>
                                <p className="text-slate-300 text-sm">14 days</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArcOfCarePhase3Demo;
