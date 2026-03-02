import React from 'react';

interface DayCopy {
    greeting: string;
    sub: string;
}

function getDayCopy(daysPostSession: number): DayCopy {
    if (daysPostSession <= 3) return {
        greeting: 'You are in the first days.',
        sub: 'Rest is integration too. Allow what needs to surface.',
    };
    if (daysPostSession <= 7) return {
        greeting: `Day ${daysPostSession} of your integration window.`,
        sub: 'The ripple effect is still moving through you.',
    };
    if (daysPostSession <= 14) return {
        greeting: `Day ${daysPostSession}. The window is still open.`,
        sub: 'Neuroplasticity peaks in the first two weeks. You are in it.',
    };
    if (daysPostSession <= 21) return {
        greeting: `Day ${daysPostSession}. Growth continues.`,
        sub: 'The most meaningful changes often emerge quietly, over time.',
    };
    if (daysPostSession <= 28) return {
        greeting: `Day ${daysPostSession}. Still becoming.`,
        sub: 'Integration is a practice, not an event.',
    };
    return {
        greeting: `${daysPostSession} days since your session.`,
        sub: 'Healing doesn\'t end. It deepens.',
    };
}

export interface DayAwarenessHeaderProps {
    daysPostSession: number;
    accentColor: string;
    substanceName?: string | null;
}

export const DayAwarenessHeader: React.FC<DayAwarenessHeaderProps> = ({
    daysPostSession,
    accentColor,
    substanceName,
}) => {
    const { greeting, sub } = getDayCopy(daysPostSession);

    return (
        <div style={{ marginBottom: 24. }}>
            <h2
                className="ppn-section-title"
                style={{ color: accentColor, marginBottom: 6 }}
            >
                {greeting}
            </h2>
            <p className="ppn-body" style={{ color: '#94a3b8', margin: 0 }}>
                {sub}
                {substanceName && daysPostSession < 28 && (
                    <span style={{ color: 'rgba(226,232,240,0.35)', marginLeft: 6 }}>
                        · {substanceName} session
                    </span>
                )}
            </p>
        </div>
    );
};

export default DayAwarenessHeader;
