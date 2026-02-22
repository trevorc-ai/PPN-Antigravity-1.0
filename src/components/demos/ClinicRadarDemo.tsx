import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

// Simplified Clinic Radar Demo for Landing Page
// Mirrors the actual ClinicPerformanceRadar component from Analytics

const ClinicRadarDemo: React.FC = () => {
    const radarData = [
        { metric: 'Safety Score', yourClinic: 88, networkAvg: 74 },
        { metric: 'Retention', yourClinic: 85, networkAvg: 68 },
        { metric: 'Efficacy', yourClinic: 92, networkAvg: 72 },
        { metric: 'Adherence', yourClinic: 90, networkAvg: 76 },
        { metric: 'Response Time', yourClinic: 82, networkAvg: 70 },
        { metric: 'Data Quality', yourClinic: 95, networkAvg: 80 },
    ];

    const [activeIndex, setActiveIndex] = useState(2);

    // Recharts height is 300, center is 150, outerRadius is 75% -> 112.5px
    const maxRadius = 112.5;
    const activeData = radarData[activeIndex] || radarData[2];
    const spokeLength = (activeData.yourClinic / 100) * maxRadius;
    const spokeAngle = -90 + (activeIndex * 60); // 0 corresponds to -90 (top), going clockwise


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

            <div className="relative cursor-crosshair">
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart
                        data={radarData}
                        outerRadius="75%"
                        onMouseMove={(e: any) => {
                            if (e && e.activeTooltipIndex !== undefined) {
                                setActiveIndex(e.activeTooltipIndex);
                            }
                        }}
                        onMouseLeave={() => setActiveIndex(2)}
                    >
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

                {/* Spoke overlay */}
                <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                    <div className="relative w-0 h-0">
                        {/* Center dot */}
                        <div className="absolute left-0 top-0 w-1.5 h-1.5 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(255,255,255,0.8)] z-20" />
                        {/* Dynamic Line */}
                        <div
                            className="absolute left-0 top-0 h-[1.5px] bg-white origin-left shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10 transition-all duration-300 ease-out"
                            style={{
                                width: `${spokeLength}px`,
                                transform: `rotate(${spokeAngle}deg)`
                            }}
                        />
                        {/* End dot */}
                        <div
                            className="absolute w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(255,255,255,1)] z-20 transition-all duration-300 ease-out"
                            style={{
                                left: `${spokeLength * Math.cos(spokeAngle * Math.PI / 180)}px`,
                                top: `${spokeLength * Math.sin(spokeAngle * Math.PI / 180)}px`
                            }}
                        />
                    </div>
                </div>

                {/* Persistent Tooltip over the bottom corner */}
                <div className="absolute bottom-[5%] right-0 md:right-[5%] z-10 pointer-events-none fill-mode-both">
                    <div className="bg-[#0f1218]/95 backdrop-blur-md border border-indigo-500/30 shadow-2xl shadow-indigo-500/20 rounded-2xl p-4 min-w-[150px] flex flex-col items-center relative overflow-hidden group transition-all duration-300">
                        <div className="absolute -inset-1 bg-indigo-500/5 blur-md pointer-events-none" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 relative z-10 text-center">{activeData.metric}</span>
                        <div className="flex items-baseline gap-1.5 relative z-10">
                            <span className="text-3xl font-black text-indigo-400">{activeData.yourClinic}</span>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">/ 100</span>
                        </div>
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
