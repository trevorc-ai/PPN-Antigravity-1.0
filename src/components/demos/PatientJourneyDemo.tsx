import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

// Simplified Patient Journey Demo for Landing Page
// Mirrors the actual PatientJourneyPage timeline component

const PatientJourneyDemo: React.FC = () => {
    // Demo data: PHQ-9 scores over 12 weeks (higher score = worse depression)
    const journeyData = [
        { week: 0, phq9: 21, session: true, label: 'Session 1' },
        { week: 1, phq9: 19, session: false },
        { week: 2, phq9: 17, session: false },
        { week: 3, phq9: 15, session: false },
        { week: 4, phq9: 14, session: true, label: 'Session 2' },
        { week: 5, phq9: 13, session: false },
        { week: 6, phq9: 12, session: false },
        { week: 7, phq9: 11, session: false },
        { week: 8, phq9: 10, session: true, label: 'Session 3' },
        { week: 9, phq9: 9, session: false },
        { week: 10, phq9: 8, session: false },
        { week: 11, phq9: 8, session: false },
        { week: 12, phq9: 8, session: true, label: 'Session 4' },
    ];

    return (
        <div className="w-full h-full bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-xs font-bold text-slate-3000 uppercase tracking-widest">Patient Progress Timeline</p>
                    <p className="text-[10px] text-slate-600 font-medium mt-1">PHQ-9 Depression Score (Lower is Better)</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-[10px] font-bold text-slate-300">PHQ-9 Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                        <span className="text-[10px] font-bold text-slate-300">Dosing Session</span>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
                <LineChart data={journeyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                        dataKey="week"
                        label={{ value: 'Week', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                        tick={{ fill: '#64748b', fontSize: 10 }}
                        stroke="#475569"
                    />
                    <YAxis
                        label={{ value: 'PHQ-9 Score', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                        tick={{ fill: '#64748b', fontSize: 10 }}
                        stroke="#475569"
                        domain={[0, 27]}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0f172a',
                            border: '1px solid #334155',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 600,
                        }}
                        labelStyle={{ color: '#94a3b8', fontWeight: 700 }}
                    />

                    {/* Severity reference lines */}
                    <ReferenceLine y={20} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Severe', fill: '#ef4444', fontSize: 9, position: 'right' }} />
                    <ReferenceLine y={15} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Moderate', fill: '#f59e0b', fontSize: 9, position: 'right' }} />
                    <ReferenceLine y={10} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Mild', fill: '#10b981', fontSize: 9, position: 'right' }} />

                    <Line
                        type="monotone"
                        dataKey="phq9"
                        stroke="#2b74f3"
                        strokeWidth={3}
                        dot={(props: any) => {
                            const { cx, cy, payload } = props;
                            if (payload.session) {
                                return (
                                    <circle
                                        cx={cx}
                                        cy={cy}
                                        r={6}
                                        fill="#10b981"
                                        stroke="#fff"
                                        strokeWidth={2}
                                    />
                                );
                            }
                            return <circle cx={cx} cy={cy} r={3} fill="#2b74f3" />;
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 pt-4 border-t border-slate-800/50 grid grid-cols-3 gap-4">
                <div>
                    <p className="text-[10px] font-bold text-slate-3000 uppercase tracking-widest">Baseline</p>
                    <p className="text-lg font-black text-red-400">21 (Severe)</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-3000 uppercase tracking-widest">Current</p>
                    <p className="text-lg font-black text-emerald-400">8 (Mild)</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-3000 uppercase tracking-widest">Improvement</p>
                    <p className="text-lg font-black text-primary">-62%</p>
                </div>
            </div>
        </div>
    );
};

export default PatientJourneyDemo;
