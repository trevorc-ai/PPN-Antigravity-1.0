/**
 * PDFSectionTitle.tsx
 * Reusable section header for PPN PDF exports.
 * Left 3px colored accent bar, uppercase bold heading, full-width rule.
 */

import React from 'react';

interface PDFSectionTitleProps {
    children: React.ReactNode;
    accent?: string;
    marginTop?: string | number;
}

export const PDFSectionTitle: React.FC<PDFSectionTitleProps> = ({
    children,
    accent = '#3b82f6',
    marginTop = '22px',
}) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', marginTop }}>
        <div style={{
            width: '3px', height: '18px', backgroundColor: accent,
            borderRadius: '2px', flexShrink: 0,
        }} />
        <h2 style={{
            fontSize: '12px', fontWeight: 900, color: '#1e3a5f',
            textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0,
            fontFamily: "'Inter', ui-sans-serif, sans-serif",
        }}>{children}</h2>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
    </div>
);
