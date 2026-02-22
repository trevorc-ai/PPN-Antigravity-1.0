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
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Performance Benchmarking</p>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-xs font-bold text-slate-300">Your Clinic</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                        <span className="text-xs font-bold text-slate-300">Network Avg</span>
                    </div>
                </div>
            </div>

            <div className="relative">
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData} outerRadius="75%">
                        <PolarGrid stroke="#334155" strokeWidth={1} polarRadius={[20, 40, 60, 80, 100]} gridType="polygon" />

                        {/* Dark pulsing background shadow for depth */}
                        <Radar
                            name="Depth"
                            dataKey={() => 100}
                            stroke="transparent"
                            fill="#0f172a"
                            fillOpacity={0.8}
                            isAnimationActive={false}
                        />

                        <PolarAngleAxis
                            dataKey="metric"
                            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                            stroke="#475569"
                            axisLine={{ stroke: '#475569', strokeDasharray: '2 4' }}
                        />

                        {/* Invisible boundary radar to draw the 100% outer border/spokes without filling */}
                        <Radar
                            name="Boundary"
                            dataKey={() => 100}
                            stroke="#334155"
                            fill="none"
                            strokeWidth={1}
                            isAnimationActive={false}
                        />

                        <PolarRadiusAxis
                            angle={90}
                            domain={[0, 100]}
                            tick={{ fill: '#475569', fontSize: 10 }}
                            stroke="#475569"
                            axisLine={false}
                            tickCount={6}
                        />

                        <Radar
                            name="Network Average"
                            dataKey="networkAvg"
                            stroke="#475569"
                            fill="#475569"
                            fillOpacity={0.1}
                            strokeWidth={2}
                            animationDuration={1500}
                        />
                        <Radar
                            name="Your Clinic"
                            dataKey="yourClinic"
                            stroke="#2b74f3"
                            fill="url(#colorClinic)"
                            fillOpacity={1}
                            strokeWidth={3}
                            animationBegin={500}
                            animationDuration={2000}
                            animationEasing="ease-out"
                        />

                        <defs>
                            <linearGradient id="colorClinic" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2b74f3" stopOpacity={0.6} />
                                <stop offset="95%" stopColor="#2b74f3" stopOpacity={0.1} />
                            </linearGradient>

                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                    </RadarChart>
                </ResponsiveContainer>

                {/* Persistent Tooltip over "Safety Score" (Top Spoke) */}
                <div className="absolute top-[18%] left-1/2 -translate-x-1/2 -translate-y-full z-10 pointer-events-none animate-in fade-in zoom-in duration-1000 delay-700 fill-mode-both">
                    <div className="bg-[#0f1218] border border-indigo-500/30 shadow-2xl shadow-indigo-500/20 rounded-xl p-3 min-w-[130px] flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Safety Score</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-indigo-400">92</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">/ 100</span>
                        </div>
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0f1218] border-b border-r border-indigo-500/30 rotate-45"></div>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/50">
                <p className="text-sm text-slate-500 font-medium">
                    Your clinic outperforms the network average across all key metrics.
                </p>
            </div>
        </div>
    );
};

export default ClinicRadarDemo;
