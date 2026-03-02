import React from 'react';

export interface CompassZoneProps {
    number: number;
    title: string;
    accentColor?: string;
    children: React.ReactNode;
    printClass?: string;
    hidden?: boolean;
}

export const CompassZone: React.FC<CompassZoneProps> = ({
    number,
    title,
    accentColor = '#2dd4bf',
    children,
    printClass,
    hidden = false,
}) => {
    if (hidden) return null;

    return (
        <div
            className={`zone-card-inner ${printClass ?? ''}`}
            style={{
                background: 'rgba(10,20,42,0.90)',
                border: '1px solid rgba(45,212,191,0.12)',
                borderRadius: 20,
                padding: '28px 32px',
                marginBottom: 24,
                backdropFilter: 'blur(24px)',
                boxShadow: '0 4px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(45,212,191,0.04)',
                transition: 'box-shadow 0.3s',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                {/* Badge: teal-ring / dark-bg / white numeral */}
                <div
                    aria-hidden="true"
                    style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: 'rgba(45,212,191,0.08)',
                        border: '1.5px solid rgba(45,212,191,0.35)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 15, fontWeight: 900, color: '#A8B5D1',
                        boxShadow: '0 0 12px rgba(45,212,191,0.12)'
                    }}
                >
                    {number}
                </div>
                {/* Title, domain accent color */}
                <h2 className="ppn-label" style={{ margin: 0, color: accentColor, letterSpacing: '0.14em' }}>
                    {title}
                </h2>
            </div>
            {children}
        </div>
    );
};

export default CompassZone;
