import React, { useState, useRef, useEffect } from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';

/**
 * Symptom Decay Curve Component (Responsive)
 * 
 * Visualizes PHQ-9 scores over 6-month integration period
 * 
 * Features:
 * - Fully responsive (fits container)
 * - Color-coded severity zones (Severe → Minimal)
 * - Afterglow period highlight (Days 0-14)
 * - Milestone markers (Day 7, 14, 30, 60, 90, 180)
 * - Smooth curve with data points
 * - Annotations (story-telling)
 * - Trend indicators
 * - Interactive tooltips
 */

interface DataPoint {
    day: number;
    phq9: number;
    label?: string;
}

interface SymptomDecayCurveProps {
    baselinePhq9: number;
    dataPoints: DataPoint[];
}

const SymptomDecayCurve: React.FC<SymptomDecayCurveProps> = ({
    baselinePhq9,
    dataPoints
}) => {
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 300 });

    // Update dimensions on mount and resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                const height = Math.min(300, Math.max(200, width * 0.4)); // Responsive height
                setDimensions({ width, height });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const { width, height } = dimensions;

    // Chart dimensions
    const padding = { top: 30, right: 30, bottom: 50, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Scales
    const maxDay = 180;
    const maxPhq9 = 27;
    const xScale = (day: number) => (day / maxDay) * chartWidth;
    const yScale = (phq9: number) => chartHeight - (phq9 / maxPhq9) * chartHeight;

    // Severity zones
    const zones = [
        { name: 'Severe', min: 20, max: 27, color: 'rgba(239, 68, 68, 0.1)' },
        { name: 'Moderately Severe', min: 15, max: 20, color: 'rgba(249, 115, 22, 0.1)' },
        { name: 'Moderate', min: 10, max: 15, color: 'rgba(245, 158, 11, 0.1)' },
        { name: 'Mild', min: 5, max: 10, color: 'rgba(234, 179, 8, 0.1)' },
        { name: 'Minimal', min: 0, max: 5, color: 'rgba(34, 197, 94, 0.1)' }
    ];

    // Milestones
    const milestones = [
        { day: 0, label: 'Session' },
        { day: 7, label: 'Week 1' },
        { day: 14, label: 'Week 2' },
        { day: 30, label: 'Month 1' },
        { day: 60, label: 'Month 2' },
        { day: 90, label: 'Month 3' },
        { day: 180, label: 'Month 6' }
    ];

    // Generate smooth curve path
    const generateCurvePath = () => {
        if (dataPoints.length === 0) return '';

        // Add baseline point at day 0
        const allPoints = [{ day: 0, phq9: baselinePhq9 }, ...dataPoints];

        // Start path
        let path = `M ${xScale(allPoints[0].day)} ${yScale(allPoints[0].phq9)}`;

        // Create smooth curve using quadratic bezier curves
        for (let i = 1; i < allPoints.length; i++) {
            const prev = allPoints[i - 1];
            const curr = allPoints[i];

            // Control point for smooth curve
            const cpX = xScale(prev.day) + (xScale(curr.day) - xScale(prev.day)) / 2;
            const cpY = yScale(prev.phq9);

            path += ` Q ${cpX} ${cpY}, ${xScale(curr.day)} ${yScale(curr.phq9)}`;
        }

        return path;
    };

    // Get severity info
    const getSeverityInfo = (phq9: number) => {
        if (phq9 >= 20) return { label: 'Severe', color: '#ef4444' };
        if (phq9 >= 15) return { label: 'Moderately Severe', color: '#f97316' };
        if (phq9 >= 10) return { label: 'Moderate', color: '#f59e0b' };
        if (phq9 >= 5) return { label: 'Mild', color: '#eab308' };
        return { label: 'Minimal', color: '#22c55e' };
    };

    // Calculate trend
    const getTrend = () => {
        if (dataPoints.length < 2) return null;
        const recent = dataPoints.slice(-2);
        const change = recent[1].phq9 - recent[0].phq9;

        if (change < -2) return { icon: TrendingDown, label: 'Improving', color: 'text-emerald-400' };
        if (change > 2) return { icon: TrendingUp, label: 'Regressing', color: 'text-red-400' };
        return { icon: Minus, label: 'Stable', color: 'text-slate-300' };
    };

    const trend = getTrend();
    const currentPhq9 = dataPoints.length > 0 ? dataPoints[dataPoints.length - 1].phq9 : baselinePhq9;
    const currentSeverity = getSeverityInfo(currentPhq9);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-slate-300 text-sm font-bold">Symptom Decay Curve</h3>
                    <p className="text-slate-300 text-sm">PHQ-9 scores over 6 months</p>
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 ${trend.color}`}>
                        <trend.icon className="w-4 h-4" />
                        <span className="text-xs font-semibold">{trend.label}</span>
                    </div>
                )}
            </div>

            {/* Current Status */}
            <div className="flex items-center gap-4 p-3 bg-slate-900/40 rounded-lg">
                <div>
                    <p className="text-sm text-slate-300">Current PHQ-9</p>
                    <p className="text-2xl font-black" style={{ color: currentSeverity.color }}>
                        {currentPhq9}
                    </p>
                </div>
                <div className="flex-1">
                    <p className="text-sm text-slate-300 mb-1">{currentSeverity.label}</p>
                    <div className="h-2 bg-slate-900/60 rounded-full overflow-hidden">
                        <div
                            className="h-full transition-all duration-500"
                            style={{
                                width: `${(currentPhq9 / 27) * 100}%`,
                                backgroundColor: currentSeverity.color
                            }}
                        />
                    </div>
                </div>
                <div>
                    <p className="text-sm text-slate-300">Improvement</p>
                    <p className="text-xl font-black text-emerald-400">
                        -{baselinePhq9 - currentPhq9}
                    </p>
                </div>
            </div>

            {/* Chart */}
            <div ref={containerRef} className="relative bg-slate-900/40 rounded-lg p-3 w-full">
                <svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${width} ${height}`}
                    preserveAspectRatio="xMidYMid meet"
                    className="overflow-visible"
                >
                    <defs>
                        {/* Gradient for afterglow period */}
                        <linearGradient id="afterglowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
                            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                        </linearGradient>
                    </defs>

                    <g transform={`translate(${padding.left}, ${padding.top})`}>
                        {/* Severity zones (background) */}
                        {zones.map((zone, i) => (
                            <rect
                                key={i}
                                x={0}
                                y={yScale(zone.max)}
                                width={chartWidth}
                                height={yScale(zone.min) - yScale(zone.max)}
                                fill={zone.color}
                            />
                        ))}

                        {/* Afterglow period highlight (Days 0-14) */}
                        <rect
                            x={0}
                            y={0}
                            width={xScale(14)}
                            height={chartHeight}
                            fill="url(#afterglowGradient)"
                        />

                        {/* Grid lines (horizontal) */}
                        {[0, 5, 10, 15, 20, 27].map((value) => (
                            <g key={value}>
                                <line
                                    x1={0}
                                    y1={yScale(value)}
                                    x2={chartWidth}
                                    y2={yScale(value)}
                                    stroke="rgba(148, 163, 184, 0.1)"
                                    strokeWidth={1}
                                />
                                <text
                                    x={-10}
                                    y={yScale(value)}
                                    textAnchor="end"
                                    dominantBaseline="middle"
                                    className="text-xs fill-slate-400"
                                >
                                    {value}
                                </text>
                            </g>
                        ))}

                        {/* Milestone markers (vertical) */}
                        {milestones.map((milestone) => (
                            <g key={milestone.day}>
                                <line
                                    x1={xScale(milestone.day)}
                                    y1={0}
                                    x2={xScale(milestone.day)}
                                    y2={chartHeight}
                                    stroke="rgba(148, 163, 184, 0.2)"
                                    strokeWidth={milestone.day === 0 || milestone.day === 14 ? 2 : 1}
                                    strokeDasharray={milestone.day === 14 ? "4 4" : "none"}
                                />
                                <text
                                    x={xScale(milestone.day)}
                                    y={chartHeight + 20}
                                    textAnchor="middle"
                                    className="text-xs fill-slate-300"
                                >
                                    {milestone.label}
                                </text>
                            </g>
                        ))}

                        {/* Curve path */}
                        <path
                            d={generateCurvePath()}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Data points */}
                        {[{ day: 0, phq9: baselinePhq9 }, ...dataPoints].map((point, i) => {
                            const severity = getSeverityInfo(point.phq9);
                            return (
                                <g key={i}>
                                    <circle
                                        cx={xScale(point.day)}
                                        cy={yScale(point.phq9)}
                                        r={hoveredPoint === i ? 8 : 6}
                                        fill={severity.color}
                                        stroke="#0f172a"
                                        strokeWidth={2}
                                        className="cursor-pointer transition-all"
                                        onMouseEnter={() => setHoveredPoint(i)}
                                        onMouseLeave={() => setHoveredPoint(null)}
                                    />
                                    {/* Tooltip on hover */}
                                    {hoveredPoint === i && (
                                        <g>
                                            <rect
                                                x={xScale(point.day) - 60}
                                                y={yScale(point.phq9) - 50}
                                                width={120}
                                                height={40}
                                                rx={8}
                                                fill="#0f172a"
                                                stroke={severity.color}
                                                strokeWidth={2}
                                            />
                                            <text
                                                x={xScale(point.day)}
                                                y={yScale(point.phq9) - 35}
                                                textAnchor="middle"
                                                className="text-xs fill-slate-300 font-semibold"
                                            >
                                                Day {point.day}
                                            </text>
                                            <text
                                                x={xScale(point.day)}
                                                y={yScale(point.phq9) - 20}
                                                textAnchor="middle"
                                                className="text-sm font-bold"
                                                fill={severity.color}
                                            >
                                                PHQ-9: {point.phq9}
                                            </text>
                                        </g>
                                    )}
                                </g>
                            );
                        })}

                        {/* Annotations */}
                        {/* Afterglow annotation */}
                        <text
                            x={xScale(7)}
                            y={-10}
                            textAnchor="middle"
                            className="text-xs fill-blue-400 font-semibold"
                        >
                            Afterglow Period
                        </text>

                        {/* Remission line (PHQ-9 < 5) */}
                        <line
                            x1={0}
                            y1={yScale(5)}
                            x2={chartWidth}
                            y2={yScale(5)}
                            stroke="#22c55e"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                        />
                        <text
                            x={chartWidth - 5}
                            y={yScale(5) - 5}
                            textAnchor="end"
                            className="text-xs fill-emerald-400 font-semibold"
                        >
                            Remission (PHQ-9 &lt; 5)
                        </text>

                        {/* Axes */}
                        <line
                            x1={0}
                            y1={chartHeight}
                            x2={chartWidth}
                            y2={chartHeight}
                            stroke="rgba(148, 163, 184, 0.3)"
                            strokeWidth={2}
                        />
                        <line
                            x1={0}
                            y1={0}
                            x2={0}
                            y2={chartHeight}
                            stroke="rgba(148, 163, 184, 0.3)"
                            strokeWidth={2}
                        />

                        {/* Axis labels */}
                        <text
                            x={chartWidth / 2}
                            y={chartHeight + 45}
                            textAnchor="middle"
                            className="text-sm fill-slate-300 font-semibold"
                        >
                            Days Post-Session
                        </text>
                        <text
                            x={-chartHeight / 2}
                            y={-45}
                            textAnchor="middle"
                            transform={`rotate(-90, -${chartHeight / 2}, -45)`}
                            className="text-sm fill-slate-300 font-semibold"
                        >
                            PHQ-9 Score
                        </text>
                    </g>
                </svg>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-slate-300">Symptom Trajectory</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500/20" />
                    <span className="text-slate-300">Afterglow Period</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-1 bg-emerald-400" style={{ borderTop: '2px dashed' }} />
                    <span className="text-slate-300">Remission Threshold</span>
                </div>
            </div>
        </div>
    );
};

export default SymptomDecayCurve;
