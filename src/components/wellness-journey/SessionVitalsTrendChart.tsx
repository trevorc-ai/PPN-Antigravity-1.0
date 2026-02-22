import React, { FC, useMemo, useState, useEffect, useCallback } from 'react';
import {
    ComposedChart, Line, ReferenceLine, ReferenceDot,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { HeartPulse, Download, FileText } from 'lucide-react';

export interface VitalsSnapshot {
    id: string;
    recordedAt: Date;
    heartRate: number;
    bpSystolic: number;
    temperatureF: number;
}

interface SessionVitalsTrendChartProps {
    sessionId: string;
    substance: string;
    onThresholdViolation: (vital: string, value: number) => void;
}

const VITAL_THRESHOLDS = {
    hrHigh: 130,
    hrLow: 45,
    bpSystolicHigh: 140,
    bpSystolicLow: 85,
    tempHigh: 100.4,
};

// Tooltip matching the 6-element spec from advanced-chart-engineering
const VitalsTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    const hr = payload.find((p: any) => p.dataKey === 'heartRate')?.value;
    const bp = payload.find((p: any) => p.dataKey === 'bpSystolic')?.value;
    const temp = payload.find((p: any) => p.dataKey === 'temperatureF')?.value;

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-xl text-sm min-w-[220px]">
            <p className="font-bold text-white mb-2 pb-1 border-b border-slate-700">{label}</p>

            {hr !== undefined && (
                <div className="flex justify-between items-center mb-1">
                    <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span> HR (bpm)
                    </span>
                    <span className={`font-bold ${hr > VITAL_THRESHOLDS.hrHigh || hr < VITAL_THRESHOLDS.hrLow ? 'text-rose-500 bg-rose-500/10 px-1.5' : 'text-white'}`}>
                        {hr}
                    </span>
                </div>
            )}

            {bp !== undefined && (
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sky-400 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-sky-500 rounded-sm"></span> BP Sys (mmHg)
                    </span>
                    <span className={`font-bold ${bp > VITAL_THRESHOLDS.bpSystolicHigh || bp < VITAL_THRESHOLDS.bpSystolicLow ? 'text-amber-500 bg-amber-500/10 px-1.5' : 'text-white'}`}>
                        {bp}
                    </span>
                </div>
            )}

            {temp !== undefined && (
                <div className="flex justify-between items-center mb-1">
                    <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-amber-500 rotate-45"></span> Temp (°F)
                    </span>
                    <span className={`font-bold ${temp > VITAL_THRESHOLDS.tempHigh ? 'text-amber-500 bg-amber-500/10 px-1.5' : 'text-white'}`}>
                        {temp.toFixed(1)}
                    </span>
                </div>
            )}
        </div>
    );
};

const LegendItem: FC<{ color: string; solid?: boolean; dashed?: boolean; label: string }> = ({ color, solid, label }) => (
    <div className="flex items-center gap-1.5" aria-label={`Legend: ${label}`}>
        <svg width="24" height="12">
            <line
                x1="0" y1="6" x2="24" y2="6"
                stroke={color}
                strokeWidth={solid ? 2.5 : 1.5}
                strokeDasharray={solid ? undefined : '5 3'}
            />
        </svg>
        <span className="text-xs text-slate-400 font-medium tracking-wide">{label}</span>
    </div>
);

export const SessionVitalsTrendChart: FC<SessionVitalsTrendChartProps> = ({ sessionId, substance, onThresholdViolation }) => {
    const [data, setData] = useState<VitalsSnapshot[]>([]);

    // Simulate real-time data loading
    useEffect(() => {
        // Base starting time
        const baseTime = new Date();
        baseTime.setHours(9, 0, 0, 0);

        const mockVitals: VitalsSnapshot[] = [
            { id: 'v1', recordedAt: new Date(baseTime.getTime() + 0 * 60000), heartRate: 72, bpSystolic: 118, temperatureF: 98.6 },
            { id: 'v2', recordedAt: new Date(baseTime.getTime() + 60 * 60000), heartRate: 85, bpSystolic: 125, temperatureF: 98.8 },
            { id: 'v3', recordedAt: new Date(baseTime.getTime() + 120 * 60000), heartRate: 115, bpSystolic: 135, temperatureF: 99.1 },
            { id: 'v4', recordedAt: new Date(baseTime.getTime() + 165 * 60000), heartRate: 132, bpSystolic: 145, temperatureF: 99.8 }, // Violation!
            { id: 'v5', recordedAt: new Date(baseTime.getTime() + 240 * 60000), heartRate: 95, bpSystolic: 128, temperatureF: 99.2 },
        ];

        setData(mockVitals);

        // Fire toasts for violations in mock data
        mockVitals.forEach(v => {
            if (v.bpSystolic > VITAL_THRESHOLDS.bpSystolicHigh) {
                onThresholdViolation('BP Systolic', v.bpSystolic);
            }
            if (v.heartRate > VITAL_THRESHOLDS.hrHigh) {
                onThresholdViolation('Heart Rate', v.heartRate);
            }
        });

    }, [sessionId, onThresholdViolation]);

    // Format for Recharts
    const chartData = useMemo(() => {
        return data.map(v => ({
            ...v,
            timeLabel: v.recordedAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            isBpViolation: v.bpSystolic > VITAL_THRESHOLDS.bpSystolicHigh,
            isHrViolation: v.heartRate > VITAL_THRESHOLDS.hrHigh,
            isTempViolation: v.temperatureF > VITAL_THRESHOLDS.tempHigh,
        }));
    }, [data]);

    return (
        <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl flex flex-col">

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                        <HeartPulse className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white leading-tight">Session Vitals Trend</h2>
                        <p className="text-xs tracking-widest uppercase font-bold text-slate-500 mt-0.5">
                            Real-time Physiological Monitoring
                        </p>
                    </div>
                </div>
            </div>

            <div className="h-[320px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 10, right: 30, bottom: 20, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                        <XAxis
                            dataKey="timeLabel"
                            stroke="#475569"
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#475569"
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            dx={-10}
                            domain={[60, 160]}
                        />
                        <Tooltip content={<VitalsTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />

                        {/* --- Reference Lines (Context, rendered first) --- */}
                        {/* BP High Threshold */}
                        <ReferenceLine
                            y={VITAL_THRESHOLDS.bpSystolicHigh}
                            stroke="#f59e0b"
                            strokeWidth={1}
                            strokeDasharray="5 5"
                            label={{ value: `BP Alert Threshold (${VITAL_THRESHOLDS.bpSystolicHigh})`, position: 'insideTopLeft', fill: '#f59e0b', fontSize: 10 }}
                            animationBegin={200}
                        />

                        {/* HR High Threshold */}
                        <ReferenceLine
                            y={VITAL_THRESHOLDS.hrHigh}
                            stroke="#f43f5e"
                            strokeWidth={1}
                            strokeDasharray="5 5"
                            label={{ value: `HR Alert Threshold (${VITAL_THRESHOLDS.hrHigh})`, position: 'insideTopLeft', fill: '#f43f5e', fontSize: 10 }}
                            animationBegin={300}
                        />

                        {/* --- Patient Vitals --- */}
                        {/* Temperature (scaled for Y-axis fitting if needed, but 90-100 fits in 60-160) */}
                        <Line
                            type="monotone"
                            dataKey="temperatureF"
                            stroke="#d97706"
                            strokeWidth={1.5}
                            strokeDasharray="3 3"
                            dot={{ fill: '#d97706', r: 3, strokeWidth: 0 }}
                            activeDot={{ r: 5, fill: '#fbbf24' }}
                            animationBegin={500}
                            animationDuration={800}
                        />

                        {/* Heart Rate */}
                        <Line
                            type="monotone"
                            dataKey="heartRate"
                            stroke="#f43f5e"
                            strokeWidth={2}
                            dot={{ fill: '#f43f5e', r: 4, strokeWidth: 0 }}
                            activeDot={{ r: 6, fill: '#fb7185' }}
                            animationBegin={700}
                            animationDuration={800}
                        />

                        {/* Blood Pressure Systolic */}
                        <Line
                            type="monotone"
                            dataKey="bpSystolic"
                            stroke="#0ea5e9"
                            strokeWidth={2.5}
                            dot={{ fill: '#0ea5e9', r: 4, strokeWidth: 0, shape: 'square' }}
                            activeDot={{ r: 6, fill: '#38bdf8' }}
                            animationBegin={900}
                            animationDuration={800}
                        />

                        {/* --- Violation Markers --- */}
                        {chartData.map((entry, index) => {
                            if (entry.isBpViolation) {
                                return (
                                    <ReferenceDot
                                        key={`bp-viol-${index}`}
                                        x={entry.timeLabel}
                                        y={entry.bpSystolic}
                                        r={6}
                                        fill="#ef4444"
                                        stroke="#7f1d1d"
                                        strokeWidth={2}
                                        label={{ value: `BP Exceeded`, position: 'top', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }}
                                    />
                                );
                            }
                            return null;
                        })}

                        {chartData.map((entry, index) => {
                            if (entry.isHrViolation) {
                                return (
                                    <ReferenceDot
                                        key={`hr-viol-${index}`}
                                        x={entry.timeLabel}
                                        y={entry.heartRate}
                                        r={6}
                                        fill="#ef4444"
                                        stroke="#7f1d1d"
                                        strokeWidth={2}
                                        label={{ value: `HR Exceeded`, position: 'bottom', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }}
                                    />
                                );
                            }
                            return null;
                        })}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap gap-5 mt-2 justify-center">
                <LegendItem color="#f43f5e" solid label="Heart Rate (bpm)" />
                <LegendItem color="#0ea5e9" solid label="BP Systolic (mmHg)" />
                <LegendItem color="#d97706" dashed label="Temp (°F)" />
            </div>
            <div className="text-center mt-3">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                    Higher values = Action Required
                </span>
            </div>
        </div>
    );
};
