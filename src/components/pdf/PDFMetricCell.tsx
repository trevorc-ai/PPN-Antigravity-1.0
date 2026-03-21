/**
 * PDFMetricCell.tsx
 * KPI tile for PPN PDF exports.
 * #f8fafc background, colored large value, uppercase label.
 */

import React from 'react';

interface PDFMetricCellProps {
    label: string;
    value: string | number;
    sub?: string;
    accent?: string;
}

export const PDFMetricCell: React.FC<PDFMetricCellProps> = ({
    label, value, sub, accent = '#1e3a5f',
}) => (
    <div style={{
        padding: '12px 14px', backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'center',
    }}>
        <div style={{
            fontSize: '22px', fontWeight: 900, color: accent, lineHeight: 1,
            fontFamily: "'Inter', ui-sans-serif, sans-serif",
        }}>{value}</div>
        <div style={{
            fontSize: '9px', fontWeight: 700, color: '#475569',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px',
        }}>{label}</div>
        {sub && <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px' }}>{sub}</div>}
    </div>
);
