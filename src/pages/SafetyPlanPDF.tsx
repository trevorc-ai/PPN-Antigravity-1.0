/**
 * SafetyPlanPDF.tsx — WO-643-D
 * Safety Plan PDF Export
 *
 * Route: /safety-plan-pdf?sessionId=
 *
 * ppn-ui-standards Rule 5 compliant. Zero PHI.
 */

import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    AlertTriangle, AlertOctagon, CheckCircle, CheckSquare, Square,
    Printer, ShieldCheck, Phone, User
} from 'lucide-react';
import { PDFPageShell, PDF_PRINT_CSS } from '../components/pdf/PDFPageShell';
import { PDFSectionTitle } from '../components/pdf/PDFSectionTitle';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface RiskFlag { flag: string; severity: 'LOW' | 'MONITOR' | 'HIGH'; notes: string; }
interface Contact { role: string; ref: string; available: string; }
interface CheckItem { label: string; checked: boolean; }

interface SafetyPlanData {
    reportId: string; sessionId: string; sessionDate: string;
    substance: string; dose: string; sessionType: string;
    clinicianId: string; exportDate: string; isPreview: boolean;
    riskFlags: RiskFlag[];
    rescueMedication: string; rescueConditions: string; rescueAuthorization: string;
    emergencyContacts: Contact[];
    checklist: CheckItem[];
    clinicianAttestation: string;
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

const DEMO: SafetyPlanData = {
    reportId: 'SAF-20260319-C3D1', sessionId: 'SES-20260319-B2A4',
    sessionDate: 'March 19, 2026', substance: 'Psilocybin', dose: '25mg',
    sessionType: 'Dosing Session', clinicianId: 'CLN-0042',
    exportDate: 'March 20, 2026', isPreview: true,
    riskFlags: [
        { flag: 'Elevated baseline blood pressure', severity: 'MONITOR', notes: 'BP 142/88 at intake. Monitor every 30 min during peak phase.' },
        { flag: 'History of panic episodes', severity: 'MONITOR', notes: 'Prepared grounding protocol. Benzodiazepine rescue authorized if needed.' },
        { flag: 'No current medication interactions', severity: 'LOW', notes: 'SSRI washed out 6 weeks prior. Interaction check: clear.' },
        { flag: 'Cardiac monitoring indicated', severity: 'MONITOR', notes: 'Pulse oximeter on site. EMS contact pre-staged per protocol.' },
    ],
    rescueMedication: 'Lorazepam 0.5mg PO / Midazolam 2mg IM', rescueConditions: 'Sustained panic (>15 min), HR >130 bpm unresponsive to grounding, BP >180/110 mmHg.',
    rescueAuthorization: 'Authorized under Standing Order SO-2026-001. Supervising clinician CLN-0042 must be present.',
    emergencyContacts: [
        { role: 'Site Medical Director', ref: 'MD-PPN-001', available: '24/7 on-call' },
        { role: 'Supervising Clinician', ref: 'CLN-0042', available: 'On-site for session duration' },
        { role: 'Emergency Services', ref: '911', available: 'Pre-briefed — address on file' },
        { role: 'Escort / Companion', ref: 'ESC-4421', available: 'On-call from 14:00' },
    ],
    checklist: [
        { label: 'Emergency kit verified (rescue meds, O2, AED on-site)', checked: true },
        { label: 'Emergency contacts pre-notified of session', checked: true },
        { label: 'Patient oriented to safety protocol pre-session', checked: true },
        { label: 'Escape route and fire exits confirmed clear', checked: true },
        { label: 'Safe environment walk-through complete', checked: true },
        { label: 'EMS contact pre-staged with location', checked: true },
        { label: 'Post-session escort confirmed', checked: false },
    ],
    clinicianAttestation: 'I confirm this safety plan is current, appropriate, and has been reviewed with the patient prior to session commencement. All emergency protocols are in place and understood by all attending clinical staff.',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TABLE_TH: React.CSSProperties = { backgroundColor: '#ede9ff', color: '#3730a3', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '7px 10px', textAlign: 'left' };
const TABLE_TD: React.CSSProperties = { fontSize: '12px', padding: '7px 10px', color: '#1e293b', verticalAlign: 'top', borderBottom: '1px solid #f1f5f9' };

const SeverityBadge: React.FC<{ sev: RiskFlag['severity'] }> = ({ sev }) => {
    const c = sev === 'HIGH' ? { bg: '#fee2e2', text: '#991b1b', icon: <AlertOctagon size={11} />, label: 'HIGH RISK' }
        : sev === 'MONITOR' ? { bg: '#fef3c7', text: '#92400e', icon: <AlertTriangle size={11} />, label: 'MONITOR' }
        : { bg: '#f0fdf4', text: '#065f46', icon: <CheckCircle size={11} />, label: 'LOW RISK' };
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: c.bg, color: c.text, padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 700 }}>
            {c.icon} {c.label}
        </span>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const SafetyPlanPDF: React.FC = () => {
    const [params] = useSearchParams();
    const d = DEMO;

    useEffect(() => { document.title = `Safety Plan — ${d.reportId} — PPN Portal`; }, [d.reportId]);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: PDF_PRINT_CSS }} />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet" />

            {/* Toolbar */}
            <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ShieldCheck size={18} color="#10b981" />
                    <span style={{ color: '#f8fafc', fontSize: '14px', fontWeight: 700 }}>Safety Plan — {d.reportId}</span>
                    {d.isPreview && <span style={{ backgroundColor: '#f59e0b', color: '#1e293b', fontSize: '10px', fontWeight: 900, padding: '2px 8px', borderRadius: '4px' }}>PREVIEW DATA</span>}
                </div>
                <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }} aria-label="Download PDF">
                    <Printer size={15} /> Download PDF
                </button>
            </div>

            <div style={{ backgroundColor: '#e2e8f0', padding: '32px 24px', minHeight: '100vh', fontFamily: "'Inter', ui-sans-serif, sans-serif" }}>
                <PDFPageShell reportType="Safety Plan" reportId={d.reportId} pageNum={1} total={1} exportDate={d.exportDate}>
                    {/* Title */}
                    <div style={{ borderLeft: '5px solid #1e3a5f', paddingLeft: '14px', marginBottom: '16px' }}>
                        <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#1e3a5f', margin: '0 0 4px', fontFamily: "'Inter', ui-sans-serif, sans-serif" }}>SAFETY PLAN</h1>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Pre-Session Risk Assessment and Emergency Protocol</p>
                    </div>
                    {/* Metadata */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '4px' }}>
                        {[['Patient ID', d.sessionId.replace('SES', 'SUB')], ['Session Date', d.sessionDate], ['Substance / Dose', `${d.substance} ${d.dose}`], ['Session Type', d.sessionType]].map(([k, v]) => (
                            <div key={k}><div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div><div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{v}</div></div>
                        ))}
                    </div>

                    {/* Risk Flags */}
                    <PDFSectionTitle accent="#ef4444">Risk Flags</PDFSectionTitle>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr><th style={TABLE_TH}>Risk Flag</th><th style={{ ...TABLE_TH, width: '110px' }}>Severity</th><th style={TABLE_TH}>Clinical Notes</th></tr></thead>
                        <tbody>{d.riskFlags.map((r, i) => (
                            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                                <td style={{ ...TABLE_TD, fontWeight: 600 }}>{r.flag}</td>
                                <td style={TABLE_TD}><SeverityBadge sev={r.severity} /></td>
                                <td style={TABLE_TD}>{r.notes}</td>
                            </tr>
                        ))}</tbody>
                    </table>

                    {/* Emergency Protocol */}
                    <PDFSectionTitle accent="#f59e0b">Emergency Protocol</PDFSectionTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                        {[['Rescue Medication', d.rescueMedication], ['Rescue Conditions', d.rescueConditions], ['Authorization', d.rescueAuthorization, 'full']].map(([k, v, span]) => (
                            <div key={k as string} style={{ gridColumn: span === 'full' ? '1 / -1' : undefined, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
                                <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{k}</div>
                                <div style={{ fontSize: '12px', color: '#1e293b' }}>{v}</div>
                            </div>
                        ))}
                    </div>

                    {/* Emergency Contacts */}
                    <PDFSectionTitle accent="#6366f1">Emergency Contacts</PDFSectionTitle>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr><th style={TABLE_TH}>Role</th><th style={TABLE_TH}>Reference ID</th><th style={TABLE_TH}>Availability</th></tr></thead>
                        <tbody>{d.emergencyContacts.map((c, i) => (
                            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                                <td style={{ ...TABLE_TD, display: 'flex', alignItems: 'center', gap: '6px', border: 'none', borderBottom: '1px solid #f1f5f9' }}>
                                    <User size={12} color="#6366f1" />{c.role}
                                </td>
                                <td style={{ ...TABLE_TD, fontFamily: "'Roboto Mono', monospace", fontSize: '11px' }}>{c.ref}</td>
                                <td style={{ ...TABLE_TD, display: 'flex', alignItems: 'center', gap: '5px', border: 'none', borderBottom: '1px solid #f1f5f9' }}>
                                    <Phone size={11} color="#10b981" />{c.available}
                                </td>
                            </tr>
                        ))}</tbody>
                    </table>

                    {/* Checklist */}
                    <PDFSectionTitle accent="#10b981">Environmental Safety Checklist</PDFSectionTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                        {d.checklist.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                                {item.checked
                                    ? <CheckSquare size={14} color="#10b981" style={{ flexShrink: 0, marginTop: '1px' }} />
                                    : <Square size={14} color="#94a3b8" style={{ flexShrink: 0, marginTop: '1px' }} />
                                }
                                <span style={{ fontSize: '12px', color: item.checked ? '#1e293b' : '#64748b' }}>{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Attestation */}
                    <PDFSectionTitle accent="#1e3a5f">Provider Attestation</PDFSectionTitle>
                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                        <p style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic', margin: '0 0 14px', lineHeight: 1.6 }}>{d.clinicianAttestation}</p>
                        <div style={{ display: 'flex', gap: '32px' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ borderBottom: '1px solid #94a3b8', height: '32px' }} />
                                <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px' }}>Clinician Signature · ID: {d.clinicianId}</div>
                            </div>
                            <div style={{ width: '140px' }}>
                                <div style={{ borderBottom: '1px solid #94a3b8', height: '32px' }} />
                                <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px' }}>Date</div>
                            </div>
                        </div>
                    </div>
                </PDFPageShell>
            </div>
        </>
    );
};

export default SafetyPlanPDF;
