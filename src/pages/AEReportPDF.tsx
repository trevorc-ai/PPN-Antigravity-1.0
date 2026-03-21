/**
 * AEReportPDF.tsx — WO-643-B
 * Adverse Event (AE) Incident Report — PDF Export
 *
 * Route: /ae-report-pdf?aeId=&sessionId=
 *
 * ppn-ui-standards Rule 5:
 * - US Letter (8.5in x 11in)
 * - White background, no dark fills
 * - Table headers: #ede9ff fill + #3730a3 text
 * - Inter font, Roboto Mono for IDs
 * - Min 9pt body, 7pt captions
 * - All status indicators paired with text labels
 *
 * Zero PHI: only Subject_ID used. No names, DOB, or contact info.
 */

import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle, AlertOctagon, CheckCircle, Printer, ShieldAlert, ClipboardList } from 'lucide-react';
import { PDFPageShell, PDF_PRINT_CSS } from '../components/pdf/PDFPageShell';
import { PDFSectionTitle } from '../components/pdf/PDFSectionTitle';
import { PDFMetricCell } from '../components/pdf/PDFMetricCell';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AEReportData {
    reportId: string;
    sessionId: string;
    sessionDate: string;
    substance: string;
    dose: string;
    siteName: string;
    clinicianId: string;
    exportDate: string;
    isPreview: boolean;

    // Incident
    eventType: string;
    ctcaeGrade: 1 | 2 | 3 | 4 | 5;
    ctcaeCategory: string;
    onsetTime: string;
    resolutionTime: string;
    durationMinutes: number;
    description: string;

    // Interventions
    interventions: Array<{
        time: string;
        action: string;
        clinician: string;
        outcome: string;
    }>;

    // Resolution
    resolved: boolean;
    resolutionNotes: string;

    // Regulatory
    requiresReport: boolean;
    reportableReason: string;
    notifiedParties: string[];
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

const DEMO: AEReportData = {
    reportId:          'AE-20260319-B7F3',
    sessionId:         'SES-20260319-B2A4',
    sessionDate:       'March 19, 2026',
    substance:         'Psilocybin',
    dose:              '25mg',
    siteName:          'PPN Portal',
    clinicianId:       'CLN-0042',
    exportDate:        'March 20, 2026',
    isPreview:         true,

    eventType:         'Cardiovascular',
    ctcaeGrade:        2,
    ctcaeCategory:     'Hypertension',
    onsetTime:         '12:35',
    resolutionTime:    '13:05',
    durationMinutes:   30,
    description:       'Patient reported a sudden onset of pressure in chest at T+02:47 post-dose. BP measured at 158/96 mmHg. Heart rate elevated at 112 bpm. Patient displayed flushing and mild agitation. Clinical team initiated intervention protocol per standing order.',

    interventions: [
        { time: '12:35', action: 'Vital check initiated — BP 158/96, HR 112', clinician: 'CLN-0042', outcome: 'Monitored' },
        { time: '12:41', action: 'Patient moved to recovery position, reassurance provided', clinician: 'CLN-0042', outcome: 'Calming effect' },
        { time: '12:50', action: 'BP recheck: 146/88 mmHg, HR 98 bpm', clinician: 'CLN-0042', outcome: 'Improving' },
        { time: '13:05', action: 'BP normalized: 128/82 mmHg, HR 88 bpm', clinician: 'CLN-0042', outcome: 'Resolved' },
    ],

    resolved:          true,
    resolutionNotes:   'Blood pressure normalized spontaneously within 30 minutes following repositioning and reassurance. No chemical rescue required. Session continued under enhanced monitoring per protocol.',

    requiresReport:    false,
    reportableReason:  'Grade 2 event — monitoring only; does not meet Grade 3+ regulatory threshold',
    notifiedParties:   ['Site Medical Director', 'Supervising Clinician'],
};

// ─── Grade Badge ──────────────────────────────────────────────────────────────

const GradeBadge: React.FC<{ grade: 1 | 2 | 3 | 4 | 5 }> = ({ grade }) => {
    const config = {
        1: { bg: '#f0fdf4', text: '#065f46', icon: <CheckCircle size={13} />, label: 'Grade 1 — Mild' },
        2: { bg: '#fef3c7', text: '#92400e', icon: <AlertTriangle size={13} />, label: 'Grade 2 — Moderate' },
        3: { bg: '#fff7ed', text: '#c2410c', icon: <AlertOctagon size={13} />, label: 'Grade 3 — Severe' },
        4: { bg: '#fee2e2', text: '#991b1b', icon: <AlertOctagon size={13} />, label: 'Grade 4 — Life-Threatening' },
        5: { bg: '#fef2f2', text: '#7f1d1d', icon: <AlertOctagon size={13} />, label: 'Grade 5 — Fatal' },
    }[grade];
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            backgroundColor: config.bg, color: config.text,
            padding: '4px 10px', borderRadius: '20px',
            fontSize: '12px', fontWeight: 700,
            border: `1px solid ${config.text}22`,
        }}>
            {config.icon}
            {config.label}
        </span>
    );
};

// ─── Table ────────────────────────────────────────────────────────────────────

const TABLE_TH: React.CSSProperties = {
    backgroundColor: '#ede9ff', color: '#3730a3',
    fontSize: '10px', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.06em',
    padding: '7px 10px', textAlign: 'left',
};

const TABLE_TD: React.CSSProperties = {
    fontSize: '12px', padding: '7px 10px',
    color: '#1e293b', verticalAlign: 'top',
    borderBottom: '1px solid #f1f5f9',
};

// ─── Main Component ───────────────────────────────────────────────────────────

const AEReportPDF: React.FC = () => {
    const [params] = useSearchParams();
    const aeId = params.get('aeId');

    // Use demo data when no aeId provided (preview mode)
    const d: AEReportData = DEMO; // Wire real data here via Supabase when aeId is present

    useEffect(() => {
        document.title = `AE Report — ${d.reportId} — PPN Portal`;
    }, [d.reportId]);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: PDF_PRINT_CSS }} />
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Roboto+Mono:wght@400;700&display=swap"
                rel="stylesheet"
            />

            {/* Toolbar */}
            <div className="no-print" style={{
                position: 'sticky', top: 0, zIndex: 50,
                backgroundColor: '#1e3a5f', display: 'flex',
                alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ShieldAlert size={18} color="#f59e0b" />
                    <span style={{ color: '#f8fafc', fontSize: '14px', fontWeight: 700 }}>
                        Adverse Event Report — {d.reportId}
                    </span>
                    {d.isPreview && (
                        <span style={{
                            backgroundColor: '#f59e0b', color: '#1e293b',
                            fontSize: '10px', fontWeight: 900, padding: '2px 8px',
                            borderRadius: '4px', letterSpacing: '0.08em',
                        }}>PREVIEW DATA</span>
                    )}
                </div>
                <button
                    onClick={() => window.print()}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        backgroundColor: '#3b82f6', color: 'white',
                        border: 'none', borderRadius: '8px',
                        padding: '8px 18px', fontSize: '13px', fontWeight: 700,
                        cursor: 'pointer',
                    }}
                    aria-label="Download PDF"
                >
                    <Printer size={15} />
                    Download PDF
                </button>
            </div>

            <div style={{
                backgroundColor: '#e2e8f0', padding: '32px 24px',
                minHeight: '100vh', fontFamily: "'Inter', ui-sans-serif, sans-serif",
            }}>
                {/* ── Page 1: Incident Report ── */}
                <PDFPageShell
                    reportType="Adverse Event Incident Report"
                    reportId={d.reportId}
                    pageNum={1}
                    total={2}
                    exportDate={d.exportDate}
                >
                    {/* Title */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{
                            borderLeft: '5px solid #1e3a5f', paddingLeft: '14px', marginBottom: '12px',
                        }}>
                            <h1 style={{
                                fontSize: '22px', fontWeight: 900, color: '#1e3a5f',
                                margin: '0 0 4px', fontFamily: "'Inter', ui-sans-serif, sans-serif",
                            }}>ADVERSE EVENT INCIDENT REPORT</h1>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                                Post-Session Safety Documentation · {d.ctcaeCategory}
                            </p>
                        </div>

                        {/* Metadata grid */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '8px', backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px',
                        }}>
                            {[
                                ['Session ID', d.sessionId],
                                ['Session Date', d.sessionDate],
                                ['Substance / Dose', `${d.substance} ${d.dose}`],
                                ['Clinician', d.clinicianId],
                            ].map(([k, v]) => (
                                <div key={k}>
                                    <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
                                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginTop: '2px', fontFamily: k === 'Session ID' || k === 'Clinician' ? "'Roboto Mono', monospace" : undefined }}>{v}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTCAE Grade */}
                    <PDFSectionTitle accent="#ef4444" marginTop={0}>Incident Summary</PDFSectionTitle>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
                        <GradeBadge grade={d.ctcaeGrade} />
                        <span style={{ fontSize: '12px', color: '#475569' }}>
                            <strong>Category:</strong> {d.ctcaeCategory} &nbsp;·&nbsp;
                            <strong>Onset:</strong> {d.onsetTime} &nbsp;·&nbsp;
                            <strong>Resolved:</strong> {d.resolutionTime} &nbsp;·&nbsp;
                            <strong>Duration:</strong> {d.durationMinutes} min
                        </span>
                    </div>
                    <div style={{
                        backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
                        borderRadius: '6px', padding: '12px', fontSize: '12px',
                        color: '#1e293b', lineHeight: 1.6, marginBottom: '8px',
                    }}>
                        {d.description}
                    </div>

                    {/* KPI row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '14px' }}>
                        <PDFMetricCell label="CTCAE Grade" value={d.ctcaeGrade} accent={d.ctcaeGrade >= 3 ? '#ef4444' : '#f59e0b'} />
                        <PDFMetricCell label="Duration" value={`${d.durationMinutes}m`} accent="#3b82f6" />
                        <PDFMetricCell label="Outcome" value={d.resolved ? 'Resolved' : 'Ongoing'} accent={d.resolved ? '#10b981' : '#ef4444'} />
                    </div>

                    {/* Intervention Log */}
                    <PDFSectionTitle accent="#f59e0b">Intervention Log</PDFSectionTitle>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                            <tr>
                                {['Time', 'Action', 'Clinician', 'Outcome'].map(h => (
                                    <th key={h} style={TABLE_TH}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {d.interventions.map((iv, i) => (
                                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                                    <td style={{ ...TABLE_TD, fontFamily: "'Roboto Mono', monospace", fontSize: '11px', width: '60px' }}>{iv.time}</td>
                                    <td style={TABLE_TD}>{iv.action}</td>
                                    <td style={{ ...TABLE_TD, fontFamily: "'Roboto Mono', monospace", fontSize: '11px', width: '80px' }}>{iv.clinician}</td>
                                    <td style={{ ...TABLE_TD, width: '90px' }}>
                                        <span style={{
                                            backgroundColor: iv.outcome === 'Resolved' ? '#f0fdf4' : '#f8fafc',
                                            color: iv.outcome === 'Resolved' ? '#065f46' : '#475569',
                                            padding: '2px 7px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                                        }}>
                                            {iv.outcome === 'Resolved' && <CheckCircle size={10} style={{ display: 'inline', marginRight: '3px' }} />}
                                            {iv.outcome}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Resolution */}
                    <PDFSectionTitle accent="#10b981">Resolution</PDFSectionTitle>
                    <div style={{
                        backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
                        borderRadius: '6px', padding: '12px', fontSize: '12px',
                        color: '#065f46', lineHeight: 1.6,
                        display: 'flex', gap: '10px',
                    }}>
                        <CheckCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            <strong>Event Resolved</strong>
                            <p style={{ margin: '4px 0 0', color: '#166534' }}>{d.resolutionNotes}</p>
                        </div>
                    </div>
                </PDFPageShell>

                {/* ── Page 2: Regulatory + Sign-Off ── */}
                <PDFPageShell
                    reportType="Adverse Event Incident Report"
                    reportId={d.reportId}
                    pageNum={2}
                    total={2}
                    exportDate={d.exportDate}
                >
                    {/* Regulatory */}
                    <PDFSectionTitle accent="#6366f1" marginTop={0}>Regulatory Notification</PDFSectionTitle>
                    <div style={{
                        backgroundColor: d.requiresReport ? '#fff7ed' : '#f0fdf4',
                        border: `1px solid ${d.requiresReport ? '#fed7aa' : '#bbf7d0'}`,
                        borderRadius: '6px', padding: '12px', marginBottom: '14px',
                        display: 'flex', gap: '10px', alignItems: 'flex-start',
                    }}>
                        {d.requiresReport
                            ? <AlertTriangle size={16} color="#c2410c" style={{ flexShrink: 0, marginTop: '1px' }} />
                            : <CheckCircle size={16} color="#065f46" style={{ flexShrink: 0, marginTop: '1px' }} />
                        }
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: d.requiresReport ? '#c2410c' : '#065f46' }}>
                                {d.requiresReport ? 'Regulatory Reporting Required' : 'No Regulatory Reporting Required'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>{d.reportableReason}</div>
                        </div>
                    </div>

                    {/* Notified parties */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                            Parties Notified
                        </div>
                        {d.notifiedParties.map((p, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '6px 0', borderBottom: '1px solid #f1f5f9',
                                fontSize: '12px', color: '#1e293b',
                            }}>
                                <CheckCircle size={13} color="#10b981" />
                                {p}
                            </div>
                        ))}
                    </div>

                    {/* Sign-Off */}
                    <PDFSectionTitle accent="#1e3a5f">Provider Sign-Off</PDFSectionTitle>
                    <div style={{
                        backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
                        borderRadius: '8px', padding: '16px',
                    }}>
                        <p style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic', margin: '0 0 16px' }}>
                            I confirm this adverse event record is accurate and complete to the best of my knowledge.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {[
                                ['Reporting Clinician ID', d.clinicianId],
                                ['Report Date', d.exportDate],
                                ['Session ID', d.sessionId],
                                ['Grade at Closure', `CTCAE Grade ${d.ctcaeGrade} — ${d.ctcaeCategory}`],
                            ].map(([k, v]) => (
                                <div key={k}>
                                    <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
                                    <div style={{ fontSize: '12px', color: '#1e293b', marginTop: '2px', fontFamily: k.includes('ID') || k.includes('Session') ? "'Roboto Mono', monospace" : undefined }}>{v}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '24px', display: 'flex', gap: '32px' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ borderBottom: '1px solid #94a3b8', height: '36px' }} />
                                <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px' }}>Clinician Signature</div>
                            </div>
                            <div style={{ width: '140px' }}>
                                <div style={{ borderBottom: '1px solid #94a3b8', height: '36px' }} />
                                <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px' }}>Date</div>
                            </div>
                        </div>
                    </div>

                    {/* Audit notice */}
                    <div style={{
                        marginTop: '20px', padding: '10px 12px',
                        backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0',
                        display: 'flex', gap: '8px', alignItems: 'center',
                    }}>
                        <ClipboardList size={14} color="#64748b" />
                        <span style={{ fontSize: '10px', color: '#64748b' }}>
                            Audit Trail ID: {d.reportId} · 21 CFR Part 11 · Zero PHI · Auto-logged by PPN Portal v2.2
                        </span>
                    </div>
                </PDFPageShell>
            </div>
        </>
    );
};

export default AEReportPDF;
