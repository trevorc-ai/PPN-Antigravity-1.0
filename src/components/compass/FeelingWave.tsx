import React from 'react';
import { CompassTimelineEvent } from '../../hooks/useCompassTimeline';

const GHOST_FEELINGS = ['Peaceful', 'Curious', 'Open', 'Released', 'Connected', 'Grateful'];

function pillColor(type: string): { bg: string; border: string; text: string } {
    const t = type.toLowerCase();
    if (t.includes('insight') || t.includes('sacred') || t.includes('mystical'))
        return { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.30)', text: '#f59e0b' };
    if (t.includes('difficult') || t.includes('fear') || t.includes('grief'))
        return { bg: 'rgba(251,113,133,0.12)', border: 'rgba(251,113,133,0.30)', text: '#fb7185' };
    if (t.includes('joy') || t.includes('love') || t.includes('peace') || t.includes('bliss'))
        return { bg: 'rgba(45,212,191,0.12)', border: 'rgba(45,212,191,0.30)', text: '#2dd4bf' };
    // Default: alternate teal/violet
    return { bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.30)', text: '#a78bfa' };
}

export interface FeelingWaveProps {
    events: CompassTimelineEvent[];
}

export const FeelingWave: React.FC<FeelingWaveProps> = ({ events }) => {
    const feelings = events.filter(
        e => e.eventType === 'feeling' || e.eventType === 'companion_tap' || e.eventType.includes('emotion')
    );

    if (feelings.length === 0) {
        return (
            <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 14 }}>
                    {GHOST_FEELINGS.map((label, i) => (
                        <span
                            key={i}
                            className="feeling-pill"
                            style={{
                                padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                                background: i % 2 === 0 ? 'rgba(45,212,191,0.10)' : 'rgba(167,139,250,0.10)',
                                border: `1px solid ${i % 2 === 0 ? 'rgba(45,212,191,0.30)' : 'rgba(167,139,250,0.30)'}`,
                                color: i % 2 === 0 ? 'rgba(45,212,191,0.75)' : 'rgba(167,139,250,0.75)',
                                opacity: 0.75,
                                userSelect: 'none' as const,
                            }}
                        >
                            {label}
                        </span>
                    ))}
                </div>
                <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
                    Your feeling map will appear here after your session. These are example emotional landmarks from other journeys.
                </p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {feelings.map((f, i) => {
                const { bg, border, text } = pillColor(f.eventType);
                return (
                    <span
                        key={i}
                        className="feeling-pill"
                        title={`${f.label} — ${new Date(f.occurredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                        style={{
                            padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                            background: bg, border: `1px solid ${border}`, color: text,
                            cursor: 'default',
                        }}
                    >
                        {f.label}
                    </span>
                );
            })}
        </div>
    );
};

export default FeelingWave;
