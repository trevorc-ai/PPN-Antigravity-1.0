import React from 'react';
import { Pill, Zap, CheckCircle } from 'lucide-react';

/**
 * VisualTimeline - SVG-based Horizontal Timeline Visualization
 * 
 * Displays session milestones (Dose, Onset, Peak, End) with elapsed time indicators
 */

export interface VisualTimelineProps {
    doseTime?: Date;
    onsetTime?: Date;
    peakTime?: Date;
    endTime?: Date;
    showElapsed?: boolean;
}

export const VisualTimeline: React.FC<VisualTimelineProps> = ({
    doseTime,
    onsetTime,
    peakTime,
    endTime,
    showElapsed = true
}) => {
    const milestones = [
        {
            id: 'dose',
            label: 'Dose',
            time: doseTime,
            icon: Pill,
            color: 'text-pink-400',
            bgColor: 'bg-pink-400/10',
            borderColor: 'border-pink-400',
            position: 0
        },
        {
            id: 'onset',
            label: 'Onset',
            time: onsetTime,
            icon: Zap,
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-400/10',
            borderColor: 'border-yellow-400',
            position: 33.33
        },
        {
            id: 'peak',
            label: 'Peak',
            time: peakTime,
            icon: Zap,
            color: 'text-orange-400',
            bgColor: 'bg-orange-400/10',
            borderColor: 'border-orange-400',
            position: 66.66
        },
        {
            id: 'end',
            label: 'End',
            time: endTime,
            icon: CheckCircle,
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-400/10',
            borderColor: 'border-emerald-400',
            position: 100
        }
    ];

    const calculateElapsed = (from?: Date, to?: Date): string => {
        if (!from || !to) return '--';
        const diff = to.getTime() - from.getTime();
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);

        if (hours === 0 && minutes === 0) return 'T+0m';
        if (hours === 0) return `T+${minutes}m`;
        if (minutes === 0) return `T+${hours}h`;
        return `T+${hours}h ${minutes}m`;
    };

    const getProgressPercentage = (): number => {
        const completedMilestones = milestones.filter(m => m.time).length;
        return (completedMilestones / milestones.length) * 100;
    };

    const getTimelineState = (): string => {
        const completed = milestones.filter(m => m.time).length;
        const labels = milestones.filter(m => m.time).map(m => m.label).join(', ');
        return `Session timeline: ${completed} of ${milestones.length} milestones complete${labels ? ` (${labels})` : ''}`;
    };

    return (
        <div
            className="w-full p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl"
            role="region"
            aria-label="Session timeline visualization"
        >
            {/* Timeline SVG */}
            <div className="relative w-full h-32">
                <svg
                    className="w-full h-full"
                    viewBox="0 0 800 120"
                    preserveAspectRatio="xMidYMid meet"
                    role="img"
                    aria-label={getTimelineState()}
                >
                    {/* Background line */}
                    <line
                        x1="60"
                        y1="40"
                        x2="740"
                        y2="40"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-slate-700"
                    />

                    {/* Progress line */}
                    {getProgressPercentage() > 0 && (
                        <line
                            x1="60"
                            y1="40"
                            x2={60 + (680 * getProgressPercentage() / 100)}
                            y2="40"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="text-blue-400"
                        />
                    )}
                </svg>

                {/* Milestone Markers */}
                {milestones.map((milestone) => {
                    const Icon = milestone.icon;
                    const xPosition = 60 + (680 * milestone.position / 100);
                    const hasValue = !!milestone.time;

                    return (
                        <div
                            key={milestone.id}
                            className="absolute top-0"
                            style={{ left: `${(xPosition / 800) * 100}%`, transform: 'translateX(-50%)' }}
                        >
                            {/* Marker Circle */}
                            <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${hasValue
                                        ? `${milestone.bgColor} ${milestone.borderColor} ${milestone.color}`
                                        : 'bg-slate-800 border-slate-700 text-slate-400'
                                    }`}
                                role="status"
                                aria-label={`${milestone.label}: ${hasValue ? milestone.time?.toLocaleTimeString() : 'not set'}`}
                            >
                                <Icon className="w-7 h-7" />
                            </div>

                            {/* Label */}
                            <div className="mt-2 text-center">
                                <p className={`text-sm font-bold ${hasValue ? milestone.color : 'text-slate-400'}`}>
                                    {milestone.label}
                                </p>
                                {milestone.time && (
                                    <p className="text-sm text-slate-300 mt-1">
                                        {milestone.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                )}
                                {showElapsed && milestone.time && doseTime && (
                                    <p className="text-sm text-slate-400 font-mono mt-0.5">
                                        {calculateElapsed(doseTime, milestone.time)}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Text Alternative for Screen Readers */}
            <div className="sr-only">
                <p>{getTimelineState()}</p>
                {milestones.map(m => m.time && (
                    <p key={m.id}>
                        {m.label}: {m.time.toLocaleTimeString()}
                        {showElapsed && doseTime && ` (${calculateElapsed(doseTime, m.time)})`}
                    </p>
                ))}
            </div>
        </div>
    );
};
