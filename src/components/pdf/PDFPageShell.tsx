/**
 * PDFPageShell.tsx
 * Shared page wrapper for all PPN Portal PDF exports.
 *
 * ppn-ui-standards Rule 5 compliant:
 * - US Letter (8.5in x 11in)
 * - White background (#ffffff)
 * - Light gray (#f8fafc) header/footer bands
 * - Thin 6px gradient accent bar (no dark fills)
 * - Inter font, Roboto Mono for IDs
 * - Min 9pt body copy, 7pt captions/footers
 */

import React from 'react';

// ─── Print CSS ─────────────────────────────────────────────────────────────────
export const PDF_PRINT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Roboto+Mono:wght@400;700&display=swap');

@media print {
  @page { size: letter; margin: 0; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .pdf-page {
    page-break-after: always;
    break-after: page;
    break-inside: avoid;
    box-shadow: none !important;
    margin-bottom: 0 !important;
    width: 100% !important;
  }
  .pdf-page:last-child { page-break-after: auto; break-after: auto; }
  .no-print { display: none !important; }
}
`;

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface PDFPageShellProps {
    children: React.ReactNode;
    reportType: string;       // e.g. "Adverse Event Incident Report"
    reportId: string;         // e.g. "AE-20260320-B7F3"
    pageNum: number;
    total: number;
    exportDate: string;       // e.g. "March 20, 2026"
    hipaaLine?: string;       // custom HIPAA footer text
}

// ─── Component ─────────────────────────────────────────────────────────────────

export const PDFPageShell: React.FC<PDFPageShellProps> = ({
    children, reportType, reportId, pageNum, total, exportDate,
    hipaaLine = 'HIPAA Compliant · 21 CFR Part 11 · All exports logged · PPN Portal v2.2',
}) => (
    <div className="pdf-page" style={{
        width: '8.5in', backgroundColor: '#ffffff',
        fontFamily: "'Inter', ui-sans-serif, sans-serif", color: '#1e293b',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 4px 32px rgba(0,0,0,0.18)', marginBottom: '24px',
        display: 'flex', flexDirection: 'column',
    }}>
        {/* 6px gradient accent bar */}
        <div style={{ height: '6px', background: 'linear-gradient(90deg,#1e3a5f 0%,#3b82f6 50%,#10b981 100%)', flexShrink: 0 }} />

        {/* Header */}
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 0.6in 12px', borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc', flexShrink: 0,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: 'linear-gradient(135deg,#1e3a5f,#3b82f6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                    <span style={{ color: 'white', fontSize: '14px', fontWeight: 900 }}>P</span>
                </div>
                <div>
                    <div style={{
                        fontSize: '11px', fontWeight: 900, color: '#1e3a5f',
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                    }}>PPN Portal</div>
                    <div style={{ fontSize: '9px', color: '#64748b', letterSpacing: '0.04em' }}>
                        {reportType}, CONFIDENTIAL
                    </div>
                </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '9px', color: '#94a3b8' }}>
                <div style={{
                    fontWeight: 700, color: '#64748b',
                    fontFamily: "'Roboto Mono', ui-monospace, monospace",
                    fontSize: '9px',
                }}>{reportId}</div>
                <div>Page {pageNum} of {total}</div>
            </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '24px 0.6in 20px' }}>{children}</div>

        {/* Footer */}
        <div style={{
            borderTop: '1px solid #e2e8f0', padding: '8px 0.6in',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            backgroundColor: '#f8fafc', flexShrink: 0,
        }}>
            <span style={{ fontSize: '7pt', color: '#94a3b8' }}>{hipaaLine}</span>
            <span style={{ fontSize: '7pt', color: '#94a3b8' }}>Generated: {exportDate}</span>
        </div>
    </div>
);
