import React from 'react';

export interface CompassSliderProps {
    id: string;
    label: string;
    emoji: string;
    value: number;      // 1–10
    onChange: (v: number) => void;
    minLabel?: string;
    maxLabel?: string;
    disabled?: boolean;
}

export const CompassSlider: React.FC<CompassSliderProps> = ({
    id,
    label,
    emoji,
    value,
    onChange,
    minLabel = 'Low',
    maxLabel = 'High',
    disabled = false,
}) => {
    const pct = `${((value - 1) / 9) * 100}%`;

    return (
        <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>
                    {emoji} {label}
                </span>
                <span style={{ fontSize: 15, fontWeight: 900, color: '#2dd4bf', minWidth: 28, textAlign: 'right' }}>
                    {value > 0 ? value : '—'}
                </span>
            </div>
            <input
                id={id}
                type="range"
                min={1}
                max={10}
                value={value || 5}
                disabled={disabled}
                onChange={e => onChange(Number(e.target.value))}
                className="compass-slider"
                style={{ '--pct': pct } as React.CSSProperties}
                aria-label={label}
                aria-valuenow={value}
                aria-valuemin={1}
                aria-valuemax={10}
            />
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 12, color: '#64748b', marginTop: 6, fontWeight: 500,
            }}>
                <span>{minLabel}</span>
                <span>{maxLabel}</span>
            </div>
        </div>
    );
};

export default CompassSlider;
