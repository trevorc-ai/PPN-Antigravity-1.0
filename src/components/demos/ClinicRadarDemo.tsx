import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

// Simplified Clinic Radar Demo for Landing Page
// Mirrors the actual ClinicPerformanceRadar component from Analytics

const ClinicRadarDemo: React.FC = () => {
    const radarData = [
        { metric: 'Safety Score', yourClinic: 92, networkAvg: 74 },
        { metric: 'Retention', yourClinic: 85, networkAvg: 68 },
        { metric: 'Efficacy', yourClinic: 88, networkAvg: 72 },
        { metric: 'Adherence', yourClinic: 90, networkAvg: 76 },
        { metric: 'Response Time', yourClinic: 82, networkAvg: 70 },
        { metric: 'Data Quality', yourClinic: 95, networkAvg: 80 },
    ];

    return (
        <div className="w-full h-full bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-slate-3000 uppercase tracking-widest">Performance Benchmarking</p>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-[10px] font-bold text-slate-400">Your Clinic</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                        <span className="text-[10px] font-bold text-slate-400">Network Avg</span>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                    <PolarGrid stroke="#334155" strokeWidth={1} />
                    <PolarAngleAxis
                        dataKey="metric"
                        tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                        stroke="#475569"
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{ fill: '#475569', fontSize: 10 }}
                        stroke="#475569"
                    />
                    <Radar
                        name="Network Average"
                        dataKey="networkAvg"
                        stroke="#475569"
                        fill="#475569"
                        fillOpacity={0.3}
                        strokeWidth={2}
                    />
                    <Radar
                        name="Your Clinic"
                        dataKey="yourClinic"
                        stroke="#2b74f3"
                        fill="#2b74f3"
                        fillOpacity={0.5}
                        strokeWidth={3}
                    />
                </RadarChart>
            </ResponsiveContainer>

            <div className="mt-4 pt-4 border-t border-slate-800/50">
                <p className="text-xs text-slate-3000 font-medium">
                    Your clinic outperforms the network average across all key metrics.
                </p>
            </div>
        </div>
    );
};

export default ClinicRadarDemo;
