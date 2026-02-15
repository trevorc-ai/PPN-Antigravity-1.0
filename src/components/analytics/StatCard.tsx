import React from 'react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend }) => {
    return (
        <div style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: '8px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        }}>
            {/* Icon and Trend */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                {icon && (
                    <div style={{ color: '#3b82f6', fontSize: '24px' }}>
                        {icon}
                    </div>
                )}
                {trend && (
                    <div style={{
                        color: trend === 'up' ? '#22c55e' : trend === 'down' ? '#ef4444' : '#94a3b8',
                        fontSize: '20px'
                    }}>
                        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
                    </div>
                )}
            </div>

            {/* Value */}
            <div style={{
                color: '#f1f5f9',
                fontSize: '32px',
                fontWeight: 'bold',
                lineHeight: '1'
            }}>
                {value}
            </div>

            {/* Label */}
            <div style={{
                color: '#94a3b8',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: '500'
            }}>
                {label}
            </div>
        </div>
    );
};
