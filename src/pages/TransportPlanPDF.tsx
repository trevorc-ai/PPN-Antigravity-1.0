/**
 * TransportPlanPDF.tsx — WO-643-E
 * Post-Session Transport Plan PDF Export
 *
 * Route: /transport-plan-pdf?sessionId=
 *
 * ppn-ui-standards Rule 5 compliant. Zero PHI.
 */

import React, { useEffect } from 'react';
import { CheckSquare, Square, CheckCircle, MapPin, Printer, Car } from 'lucide-react';
import { PDFPageShell, PDF_PRINT_CSS } from '../components/pdf/PDFPageShell';
import { PDFSectionTitle } from '../components/pdf/PDFSectionTitle';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TransportPlanData {
    reportId: string; sessionId: string; sessionDate: string;
    substance: string; dose: string; clinicianId: string;
    exportDate: string; isPreview: boolean;
    authorizedEscort: string; relationship: string; transportMode: string;
    expectedReleaseTime: string; escortPhone: string;
    pkPeakHour: number; pkSafeHour: number; doseAdminTime: string;
    releaseChecklist: Array<{ label: string; checked: boolean }>;
    clinicianStatement: string;
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

const DEMO: TransportPlanData = {
    reportId: 'TPL-20260319-D4E2', sessionId: 'SES-20260319-B2A4',
    sessionDate: 'March 19, 2026', substance: 'Psilocybin', dose: '25mg',
    clinicianId: 'CLN-0042', exportDate: 'March 20, 2026', isPreview: true,
    authorizedEscort: 'ESC-4421', relationship: 'Designated companion',
    transportMode: 'Personal vehicle', expectedReleaseTime: '16:30',
    escortPhone: 'On file — clinic registry',
    doseAdminTime: '09:48', pkPeakHour: 3, pkSafeHour: 6,
    releaseChecklist: [
        { label: 'Patient oriented to time, place, and person (x3)', checked: true },
        { label: 'Affect stable — no acute distress observed', checked: true },
        { label: 'Gait steady — unassisted ambulation confirmed', checked: true },
        { label: 'Post-session emergency plan reviewed with patient', checked: true },
        { label: 'Escort identity confirmed and present on site', checked: true },
        { label: 'No driving within 24 hours acknowledged by patient', checked: true },
        { label: 'Appointment reminders provided (integration schedule)', checked: false },
        { label: 'Clinician manual sign-off (below)', checked: false },
    ],
    clinicianStatement: 'I confirm this patient meets clinical release criteria and is safe for transport under escort supervision.',
};

// ─── PK Timeline Visual ───────────────────────────────────────────────────────

const PKTimeline: React.FC<{ doseTime: string; peakHour: number; safeHour: number }> = ({ doseTime, peakHour, safeHour }) => {
    const totalHours = 8;
    const phases = [
        { label: 'ONSET', hours: 1, color: '#ddd6fe', textColor: '#5b21b6' },
        { label: 'PEAK', hours: peakHour, color: '#fde68a', textColor: '#92400e' },
        { label: 'DESCENT', hours: safeHour - peakHour - 1, color: '#99f6e4', textColor: '#134e4a' },
        { label: 'SAFE TRANSPORT', hours: totalHours - safeHour, color: '#bbf7d0', textColor: '#065f46' },
    ];
    return (
        <div style={{ margin: '12px 0' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Pharmacokinetic Clearance Timeline — Dose administered {doseTime}
            </div>
            <div style={{ display: 'flex', borderRadius: '6px', overflow: 'hidden', height: '36px' }}>
                {phases.map((p) => (
                    <div key={p.label} style={{
                        flex: p.hours, backgroundColor: p.color, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span style={{ fontSize: '9px', fontWeight: 900, color: p.textColor, letterSpacing: '0.04em' }}>{p.label}</span>
                    </div>
                ))}
            </div>
            {/* Hour markers */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                {Array.from({ length: totalHours + 1 }, (_, i) => (
                    <span key={i} style={{ fontSize: '9px', color: '#94a3b8' }}>{i}h</span>
                ))}
            </div>
            {/* Safe release marker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', paddingLeft: `${(safeHour / totalHours) * 100 - 12}%` }}>
                <MapPin size={13} color="#10b981" />
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#10b981' }}>Earliest safe release (~{safeHour}h post-dose)</span>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const TransportPlanPDF: React.FC = () => {
    const d = DEMO;

    useEffect(() => { document.title = `Transport Plan — ${d.reportId} — PPN Portal`; }, [d.reportId]);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: PDF_PRINT_CSS }} />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet" />

            {/* Toolbar */}
            <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Car size={18} color="#10b981" />
                    <span style={{ color: '#f8fafc', fontSize: '14px', fontWeight: 700 }}>Transport Plan — {d.reportId}</span>
                    {d.isPreview && <span style={{ backgroundColor: '#f59e0b', color: '#1e293b', fontSize: '10px', fontWeight: 900, padding: '2px 8px', borderRadius: '4px' }}>PREVIEW DATA</span>}
                </div>
                <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }} aria-label="Download PDF">
                    <Printer size={15} /> Download PDF
                </button>
            </div>

            <div style={{ backgroundColor: '#e2e8f0', padding: '32px 24px', minHeight: '100vh', fontFamily: "'Inter', ui-sans-serif, sans-serif" }}>
                <PDFPageShell reportType="Transport Plan" reportId={d.reportId} pageNum={1} total={1} exportDate={d.exportDate}>
                    {/* Title */}
                    <div style={{ borderLeft: '5px solid #1e3a5f', paddingLeft: '14px', marginBottom: '16px' }}>
                        <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#1e3a5f', margin: '0 0 4px', fontFamily: "'Inter', ui-sans-serif, sans-serif" }}>TRANSPORT PLAN</h1>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Post-Session Release and Escort Protocol</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '4px' }}>
                        {[['Session ID', d.sessionId], ['Session Date', d.sessionDate], ['Substance / Dose', `${d.substance} ${d.dose}`], ['Expected Release', d.expectedReleaseTime]].map(([k, v]) => (
                            <div key={k}><div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div><div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginTop: '2px', fontFamily: k === 'Session ID' ? "'Roboto Mono', monospace" : undefined }}>{v}</div></div>
                        ))}
                    </div>

                    {/* Transport Authorization */}
                    <PDFSectionTitle accent="#3b82f6">Transport Authorization</PDFSectionTitle>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr>
                            <th style={{ backgroundColor: '#ede9ff', color: '#3730a3', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '7px 10px', textAlign: 'left' }}>Field</th>
                            <th style={{ backgroundColor: '#ede9ff', color: '#3730a3', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '7px 10px', textAlign: 'left' }}>Details</th>
                        </tr></thead>
                        <tbody>
                            {[
                                ['Authorized Escort ID', d.authorizedEscort], ['Relationship', d.relationship],
                                ['Transport Mode', d.transportMode], ['Expected Release Time', d.expectedReleaseTime],
                                ['Escort Contact', d.escortPhone], ['Supervising Clinician', d.clinicianId],
                            ].map(([k, v], i) => (
                                <tr key={k as string} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                                    <td style={{ fontSize: '12px', padding: '7px 10px', color: '#475569', fontWeight: 600, borderBottom: '1px solid #f1f5f9', width: '40%' }}>{k}</td>
                                    <td style={{ fontSize: '12px', padding: '7px 10px', color: '#1e293b', borderBottom: '1px solid #f1f5f9', fontFamily: (k as string).includes('ID') ? "'Roboto Mono', monospace" : undefined }}>{v}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* PK Timeline */}
                    <PDFSectionTitle accent="#10b981">Estimated Readiness Window</PDFSectionTitle>
                    <PKTimeline doseTime={d.doseAdminTime} peakHour={d.pkPeakHour} safeHour={d.pkSafeHour} />

                    {/* Release Checklist */}
                    <PDFSectionTitle accent="#f59e0b">Clinician Release Checklist</PDFSectionTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
                        {d.releaseChecklist.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '7px 8px', borderBottom: '1px solid #f1f5f9', backgroundColor: i % 4 < 2 ? '#ffffff' : '#f8fafc' }}>
                                {item.checked
                                    ? <CheckSquare size={14} color="#10b981" style={{ flexShrink: 0, marginTop: '1px' }} />
                                    : <Square size={14} color="#94a3b8" style={{ flexShrink: 0, marginTop: '1px' }} />
                                }
                                <span style={{ fontSize: '11px', color: item.checked ? '#1e293b' : '#64748b' }}>{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Sign-Off */}
                    <PDFSectionTitle accent="#1e3a5f">Provider Sign-Off</PDFSectionTitle>
                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <CheckCircle size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '1px' }} />
                            <p style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic', margin: 0 }}>{d.clinicianStatement}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '32px' }}>
                            <div style={{ flex: 1 }}><div style={{ borderBottom: '1px solid #94a3b8', height: '32px' }} /><div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px' }}>Clinician Signature · ID: {d.clinicianId}</div></div>
                            <div style={{ width: '140px' }}><div style={{ borderBottom: '1px solid #94a3b8', height: '32px' }} /><div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px' }}>Date &amp; Time</div></div>
                        </div>
                    </div>
                </PDFPageShell>
            </div>
        </>
    );
};

export default TransportPlanPDF;
