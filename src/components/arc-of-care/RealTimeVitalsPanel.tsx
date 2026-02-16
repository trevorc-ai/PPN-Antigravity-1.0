import React from 'react';
import { Heart, Activity, Droplet } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';

interface VitalsData {
    heartRate: number;
    hrv: number;
    bloodPressure: string;
    timestamp: Date;
}

interface RealTimeVitalsPanelProps {
    vitals: VitalsData | null;
}

/**
 * RealTimeVitalsPanel - Live biometric monitoring
 * 
 * Displays real-time vital signs:
 * - Heart Rate (60-100 bpm normal, alert >120)
 * - HRV (Heart Rate Variability)
 * - Blood Pressure (alert >140/90)
 * 
 * Updates every 30 seconds from wearable API
 */
const RealTimeVitalsPanel: React.FC<RealTimeVitalsPanelProps> = ({ vitals }) => {
    if (!vitals) {
        return (
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="text-center text-slate-400">
                    <Activity className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                    <p className="text-sm">Waiting for vitals data...</p>
                </div>
            </div>
        );
    }

    // Determine heart rate status
    const getHeartRateStatus = (hr: number) => {
        if (hr > 120) return { color: 'red', label: 'Elevated', severity: 'critical' };
        if (hr > 100) return { color: 'amber', label: 'High', severity: 'warning' };
        if (hr >= 60) return { color: 'emerald', label: 'Normal', severity: 'normal' };
        return { color: 'blue', label: 'Low', severity: 'info' };
    };

    // Determine HRV status
    const getHRVStatus = (hrv: number) => {
        if (hrv > 70) return { color: 'emerald', label: 'Relaxed', severity: 'good' };
        if (hrv >= 50) return { color: 'blue', label: 'Normal', severity: 'normal' };
        if (hrv >= 30) return { color: 'amber', label: 'Stressed', severity: 'warning' };
        return { color: 'red', label: 'High Stress', severity: 'critical' };
    };

    // Determine BP status
    const getBPStatus = (bp: string) => {
        const [systolic] = bp.split('/').map(Number);
        if (systolic > 140) return { color: 'red', label: 'Hypertension', severity: 'critical' };
        if (systolic > 130) return { color: 'amber', label: 'Elevated', severity: 'warning' };
        return { color: 'emerald', label: 'Normal', severity: 'normal' };
    };

    const hrStatus = getHeartRateStatus(vitals.heartRate);
    const hrvStatus = getHRVStatus(vitals.hrv);
    const bpStatus = getBPStatus(vitals.bloodPressure);

    const colorClasses = {
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        red: 'text-red-400 bg-red-500/10 border-red-500/30',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    };

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-purple-400" />
                <h3 className="text-slate-200 font-semibold">Live Vitals</h3>
                <div className="ml-auto">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-slate-400">Live</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {/* Heart Rate */}
                <AdvancedTooltip
                    content="Normal range: 60-100 bpm. Elevated heart rate is common during peak intensity. Alert triggers at >120 bpm sustained for >5 minutes."
                    type="info"
                    tier="detailed"
                    title="Heart Rate Monitoring"
                    side="right"
                >
                    <div className={`p-4 rounded-xl border ${colorClasses[hrStatus.color]} cursor-help`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Heart className={`w-5 h-5 ${hrStatus.color === 'emerald' ? 'text-emerald-400' : hrStatus.color === 'amber' ? 'text-amber-400' : hrStatus.color === 'red' ? 'text-red-400' : 'text-blue-400'}`} />
                                <span className="text-sm text-slate-300 font-medium">Heart Rate</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${colorClasses[hrStatus.color]}`}>
                                {hrStatus.label}
                            </span>
                        </div>
                        <div className={`text-3xl font-bold ${hrStatus.color === 'emerald' ? 'text-emerald-400' : hrStatus.color === 'amber' ? 'text-amber-400' : hrStatus.color === 'red' ? 'text-red-400' : 'text-blue-400'}`}>
                            {vitals.heartRate}
                            <span className="text-lg text-slate-400 ml-1">bpm</span>
                        </div>
                    </div>
                </AdvancedTooltip>

                {/* HRV */}
                <AdvancedTooltip
                    content="Higher HRV indicates relaxation. Lower HRV indicates stress/anxiety. Useful for detecting distress without verbal interruption."
                    type="info"
                    tier="detailed"
                    title="Heart Rate Variability"
                    side="right"
                >
                    <div className={`p-4 rounded-xl border ${colorClasses[hrvStatus.color]} cursor-help`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Activity className={`w-5 h-5 ${hrvStatus.color === 'emerald' ? 'text-emerald-400' : hrvStatus.color === 'amber' ? 'text-amber-400' : hrvStatus.color === 'red' ? 'text-red-400' : 'text-blue-400'}`} />
                                <span className="text-sm text-slate-300 font-medium">HRV</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${colorClasses[hrvStatus.color]}`}>
                                {hrvStatus.label}
                            </span>
                        </div>
                        <div className={`text-3xl font-bold ${hrvStatus.color === 'emerald' ? 'text-emerald-400' : hrvStatus.color === 'amber' ? 'text-amber-400' : hrvStatus.color === 'red' ? 'text-red-400' : 'text-blue-400'}`}>
                            {vitals.hrv}
                            <span className="text-lg text-slate-400 ml-1">ms</span>
                        </div>
                    </div>
                </AdvancedTooltip>

                {/* Blood Pressure */}
                <AdvancedTooltip
                    content="Monitor every 30 minutes. Alert triggers at >140/90 (hypertension). May indicate anxiety or adverse reaction."
                    type="info"
                    tier="detailed"
                    title="Blood Pressure"
                    side="right"
                >
                    <div className={`p-4 rounded-xl border ${colorClasses[bpStatus.color]} cursor-help`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Droplet className={`w-5 h-5 ${bpStatus.color === 'emerald' ? 'text-emerald-400' : bpStatus.color === 'amber' ? 'text-amber-400' : bpStatus.color === 'red' ? 'text-red-400' : 'text-blue-400'}`} />
                                <span className="text-sm text-slate-300 font-medium">Blood Pressure</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${colorClasses[bpStatus.color]}`}>
                                {bpStatus.label}
                            </span>
                        </div>
                        <div className={`text-3xl font-bold ${bpStatus.color === 'emerald' ? 'text-emerald-400' : bpStatus.color === 'amber' ? 'text-amber-400' : bpStatus.color === 'red' ? 'text-red-400' : 'text-blue-400'}`}>
                            {vitals.bloodPressure}
                            <span className="text-lg text-slate-400 ml-1">mmHg</span>
                        </div>
                    </div>
                </AdvancedTooltip>

                {/* Last Updated */}
                <div className="text-xs text-slate-500 text-center">
                    Last updated: {vitals.timestamp.toLocaleTimeString()}
                </div>
            </div>
        </div>
    );
};

export default RealTimeVitalsPanel;
