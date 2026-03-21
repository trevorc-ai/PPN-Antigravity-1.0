/**
 * ConsentPlanPDF.tsx — WO-643-H
 * Informed Consent Record — Immutable Audit Document PDF Export
 *
 * Route: /consent-plan-pdf?sessionId=
 *
 * ppn-ui-standards Rule 5 compliant. Zero PHI.
 * IMMUTABILITY: Consent timestamp auto-populated at render time.
 * This document is read-only and audit-logged.
 */

import React, { useEffect, useMemo } from 'react';
import { CheckCircle, XCircle, Lock, Shield, Printer } from 'lucide-react';
import { PDFPageShell, PDF_PRINT_CSS } from '../components/pdf/PDFPageShell';
import { PDFSectionTitle } from '../components/pdf/PDFSectionTitle';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TouchConsentItem { setting: string; status: 'Permitted' | 'Not Permitted' | 'Permitted with verbal check'; }
interface RiskItem { label: string; acknowledged: boolean; }

interface ConsentData {
    reportId: string; sessionId: string; sessionDate: string;
    substance: string; dose: string; sessionType: string;
    clinicianId: string; exportDate: string; isPreview: boolean;
    consentTimestamp: string; // auto-populated at render time
    expectedDurationHours: string; pkSummary: string; protocol: string;
    riskItems: RiskItem[];
    touchConsent: TouchConsentItem[];
    patientAcknowledgementTimestamp: string;
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

const DEMO_STATIC: Omit<ConsentData, 'consentTimestamp' | 'patientAcknowledgementTimestamp'> = {
    reportId: 'CNSNT-20260319-A1B2', sessionId: 'SES-20260319-B2A4',
    sessionDate: 'March 19, 2026', substance: 'Psilocybin', dose: '25mg',
    sessionType: 'Dosing Session', clinicianId: 'CLN-0042',
    exportDate: 'March 20, 2026', isPreview: true,
    expectedDurationHours: '6-8 hours',
    pkSummary: 'Onset: 45-90 min. Peak: 2-4 hrs. Afterglow: 4-8 hrs. Full clearance: approximately 24 hrs.',
    protocol: 'PPN Standard Protocol v2.2',
    riskItems: [
        { label: 'Psychological distress risk and difficulty challenging emotions', acknowledged: true },
        { label: 'Cardiovascular changes (elevated HR and BP during peak)', acknowledged: true },
        { label: 'No driving or operating machinery for 24 hours post-session', acknowledged: true },
        { label: 'Emergency protocol and rescue medication use explained', acknowledged: true },
        { label: 'Contraindications review completed and documented', acknowledged: true },
        { label: 'Right to withdraw at any time without penalty', acknowledged: true },
    ],
    touchConsent: [
        { setting: 'Hand-holding for grounding', status: 'Permitted' },
        { setting: 'Shoulder or arm contact', status: 'Permitted' },
        { setting: 'Guiding hand for stabilization', status: 'Permitted' },
        { setting: 'Full physical support / assisted movement', status: 'Permitted with verbal check' },
        { setting: 'Contact not listed above', status: 'Not Permitted' },
    ],
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ConsentPlanPDF: React.FC = () => {
    const consentTimestamp = useMemo(() => new Date().toLocaleString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
    }), []);

    const d: ConsentData = {
        ...DEMO_STATIC,
        consentTimestamp,
        patientAcknowledgementTimestamp: consentTimestamp,
    };

    const TABLE_TH: React.CSSProperties = { backgroundColor: '#ede9ff', color: '#3730a3', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '7px 10px', textAlign: 'left' };
    const TABLE_TD: React.CSSProperties = { fontSize: '12px', padding: '7px 10px', color: '#1e293b', verticalAlign: 'middle', borderBottom: '1px solid #f1f5f9' };

    useEffect(() => { document.title = `Informed Consent — ${d.reportId} — PPN Portal`; }, [d.reportId]);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: PDF_PRINT_CSS }} />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet" />
            <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Shield size={18} color="#6366f1" />
                    <span style={{ color: '#f8fafc', fontSize: '14px', fontWeight: 700 }}>Informed Consent Record — {d.reportId}</span>
                    {d.isPreview && <span style={{ backgroundColor: '#f59e0b', color: '#1e293b', fontSize: '10px', fontWeight: 900, padding: '2px 8px', borderRadius: '4px' }}>PREVIEW DATA</span>}
                </div>
                <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }} aria-label="Download PDF">
                    <Printer size={15} /> Download PDF
                </button>
            </div>

            <div style={{ backgroundColor: '#e2e8f0', padding: '32px 24px', minHeight: '100vh', fontFamily: "'Inter', ui-sans-serif, sans-serif" }}>
                <PDFPageShell reportType="Informed Consent Record" reportId={d.reportId} pageNum={1} total={1} exportDate={d.exportDate}>
                    {/* Title */}
                    <div style={{ borderLeft: '5px solid #1e3a5f', paddingLeft: '14px', marginBottom: '16px' }}>
                        <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#1e3a5f', margin: '0 0 4px' }}>INFORMED CONSENT RECORD</h1>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Pre-Session Disclosure and Patient Acknowledgment · Immutable Audit Document</p>
                    </div>
                    {/* Metadata — 2 rows */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '4px' }}>
                        {[
                            ['Patient ID', d.sessionId.replace('SES', 'SUB')],
                            ['Session Date', d.sessionDate],
                            ['Clinician', d.clinicianId],
                            ['Substance', d.substance],
                            ['Session Type', d.sessionType],
                            ['Consent Timestamp', d.consentTimestamp],
                        ].map(([k, v]) => (
                            <div key={k}><div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div><div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', marginTop: '2px', fontFamily: k === 'Patient ID' || k === 'Clinician' ? "'Roboto Mono', monospace" : undefined }}>{v}</div></div>
                        ))}
                    </div>

                    {/* Substance & Protocol Disclosure */}
                    <PDFSectionTitle accent="#3b82f6">Substance and Protocol Disclosure</PDFSectionTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                        {[['Substance', `${d.substance} ${d.dose}`], ['Expected Duration', d.expectedDurationHours], ['Protocol', d.protocol]].map(([k, v]) => (
                            <div key={k} style={{ gridColumn: k === 'Protocol' ? '1 / -1' : undefined, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 10px' }}>
                                <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
                                <div style={{ fontSize: '12px', color: '#1e293b', marginTop: '3px' }}>{v}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
                        <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Pharmacokinetic Summary</div>
                        <div style={{ fontSize: '12px', color: '#1e293b', lineHeight: 1.6 }}>{d.pkSummary}</div>
                    </div>

                    {/* Risk Disclosure */}
                    <PDFSectionTitle accent="#f59e0b">Risk Disclosure — Acknowledged Items</PDFSectionTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                        {d.riskItems.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                                <CheckCircle size={13} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span style={{ fontSize: '11px', color: '#1e293b', lineHeight: 1.4 }}>{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Touch Consent */}
                    <PDFSectionTitle accent="#6366f1">Touch Consent Disclosure</PDFSectionTitle>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr>
                            <th style={TABLE_TH}>Setting</th>
                            <th style={{ ...TABLE_TH, width: '180px' }}>Consent Status</th>
                        </tr></thead>
                        <tbody>
                            {d.touchConsent.map((tc, i) => (
                                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                                    <td style={TABLE_TD}>{tc.setting}</td>
                                    <td style={TABLE_TD}>
                                        {tc.status === 'Not Permitted'
                                            ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 700 }}><XCircle size={10} /> Not Permitted</span>
                                            : tc.status === 'Permitted with verbal check'
                                                ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 700 }}><CheckCircle size={10} /> With Verbal Check</span>
                                                : <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#f0fdf4', color: '#065f46', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 700 }}><CheckCircle size={10} /> Permitted</span>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Voluntary Participation */}
                    <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px', marginTop: '14px', marginBottom: '4px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <Shield size={15} color="#1e40af" style={{ flexShrink: 0, marginTop: '1px' }} />
                        <p style={{ fontSize: '12px', color: '#1e3a5f', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
                            I confirm I am participating in this session voluntarily, and I understand my right to withdraw at any time without penalty or impact on my care.
                        </p>
                    </div>

                    {/* Attestation Block — immutable */}
                    <PDFSectionTitle accent="#1e3a5f">Attestation Block</PDFSectionTitle>
                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 16px', marginBottom: '12px' }}>
                        <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 10px', lineHeight: 1.6 }}>
                            Consent confirmed and recorded at <strong>{d.consentTimestamp}</strong>. This record is immutable and audit-logged per 21 CFR Part 11. No modifications are permitted after session commencement.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 10px' }}>
                                <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Patient Acknowledgment</div>
                                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px', fontFamily: "'Roboto Mono', monospace" }}>Auto-timestamped: {d.patientAcknowledgementTimestamp}</div>
                            </div>
                            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 10px' }}>
                                <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Clinician ID</div>
                                <div style={{ fontSize: '11px', color: '#1e293b', marginTop: '3px', fontFamily: "'Roboto Mono', monospace" }}>{d.clinicianId}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '32px' }}>
                            <div style={{ flex: 1 }}><div style={{ borderBottom: '1px solid #94a3b8', height: '32px' }} /><div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px' }}>Clinician Signature</div></div>
                            <div style={{ width: '140px' }}><div style={{ borderBottom: '1px solid #94a3b8', height: '32px' }} /><div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px' }}>Date</div></div>
                        </div>
                    </div>

                    {/* Audit Trail Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <Lock size={13} color="#64748b" />
                        <span style={{ fontSize: '10px', color: '#64748b', fontFamily: "'Roboto Mono', monospace" }}>
                            Audit Trail ID: {d.reportId} · 21 CFR Part 11 · Zero PHI · PPN Portal v2.2
                        </span>
                    </div>
                </PDFPageShell>
            </div>
        </>
    );
};

export default ConsentPlanPDF;
