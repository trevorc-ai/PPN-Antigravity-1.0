import React, { useMemo } from 'react';
import { CompassEMAPoint } from '../../hooks/useCompassEMA';

export interface CompassInsightLineProps {
    emaPoints: CompassEMAPoint[];
    streak: number;
}

export const CompassInsightLine: React.FC<CompassInsightLineProps> = ({
    emaPoints,
    streak,
}) => {
    const insight = useMemo(() => {
        if (streak >= 3) {
            return `You've shown up ${streak} days in a row. That\'s your healing.`;
        }

        if (emaPoints.length < 3) {
            if (streak >= 1) return `You showed up today. That matters.`;
            return null;
        }

        const last3 = emaPoints.slice(-3);
        const moodTrend = last3[2].moodLevel - last3[0].moodLevel;
        const sleepTrend = last3[2].sleepQuality - last3[0].sleepQuality;
        const anxTrend = last3[0].anxietyLevel - last3[2].anxietyLevel; // inverted (lower = better)

        if (moodTrend >= 2) return 'Your mood has been lifting over the last three days.';
        if (sleepTrend >= 2) return 'Your sleep quality is improving. Rest is part of healing.';
        if (anxTrend >= 2) return 'Your mind has been finding more ease. Keep going.';
        if (moodTrend <= -2) return 'Some waves this week. That\'s normal. Integration isn\'t linear.';
        return `${emaPoints.length} check-ins recorded. Each one is a thread of your story.`;
    }, [emaPoints, streak]);

    if (!insight) return null;

    return (
        <p className="ppn-body" style={{
            color: '#2dd4bf', fontStyle: 'italic',
            textAlign: 'center', marginTop: 16,
        }}>
            ✦ {insight}
        </p>
    );
};

export default CompassInsightLine;
