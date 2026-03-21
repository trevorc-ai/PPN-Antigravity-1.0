/**
 * InsuranceReportPDF.tsx — WO-643-G
 * Letter of Medical Necessity — Insurance Coverage Documentation PDF
 *
 * Route: /insurance-report-pdf?sessionId=&patientId=
 *
 * ppn-ui-standards Rule 5 compliant. Zero PHI.
 */

import React, { useEffect } from 'react';
import { CheckCircle, Printer, FileText } from 'lucide-react';
import { PDFPageShell, PDF_PRINT_CSS } from '../components/pdf/PDFPageShell';
import { PDFSectionTitle } from '../components/pdf/PDFSectionTitle';
import { PDFMetricCell } from '../components/pdf/PDFMetricCell';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PHQPoint { label: string; value: number; }

interface InsuranceReportData {
    reportId: string; exportDate: string; isPreview: boolean;
    patientId: string; payerReference: string; date: string; clinicianId: string;
    primaryDiagnosis: string; icdCode: string;
    baselinePHQ9: number; baselineGAD7: number;
    priorTreatmentsFailed: string; treatmentRationale: string;
    substance: string; dose: string; sessionsCompleted: string;
    supervisionRatio: string; protocol: string;
    phq9Journey: PHQPoint[];
    responseAchieved: boolean; remissionAchieved: boolean;
    totalAEs: number; grade3Plus: number; chemicalRescue: number;
    clinicianAttestation: string;
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

const DEMO: InsuranceReportData = {
    reportId: 'INS-20260319-0042', exportDate: 'March 20, 2026', isPreview: true,
    patientId: 'SUB-20260319', payerReference: 'INS-POL-774420',
    date: 'March 19, 2026', clinicianId: 'CLN-0042',
    primaryDiagnosis: 'Major Depressive Disorder (MDD), Severe, Recurrent', icdCode: 'F33.2',
    baselinePHQ9: 22, baselineGAD7: 18,
    priorTreatmentsFailed: '3 prior antidepressant trials (SSRI x2, SNRI x1) without adequate response. Therapy-resistant presentation per treating clinician.',
    treatmentRationale: 'Patient meets criteria for treatment-resistant MDD per established guidelines. Psychedelic-assisted therapy with psilocybin indicated under evidence-based protocol. Supervisory framework and safety infrastructure are in place.',
    substance: 'Psilocybin', dose: '25mg',
    sessionsCompleted: '1 dosing session + 5 integration sessions',
    supervisionRatio: '1:1 (clinician:patient)', protocol: 'PPN Standard Protocol v2.2',
    phq9Journey: [
        { label: 'Baseline', value: 22 }, { label: '30 days', value: 18 },
        { label: '45 days', value: 10 }, { label: '90 days', value: 6 },
    ],
    responseAchieved: true, remissionAchieved: true,
    totalAEs: 1, grade3Plus: 0, chemicalRescue: 0,
    clinicianAttestation: 'I certify that the above information is accurate, complete, and that the described treatment was medically necessary for this patient based on clinical assessment, documented treatment history, and evidence-based guidelines.',
};

// ─── PHQ-9 Line Chart ─────────────────────────────────────────────────────────

const PHQ9Chart: React.FC<{ points: PHQPoint[] }> = ({ points }) => {
    const W = 400, H = 100, padL = 30, padR = 10, padT = 15, padB = 20;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;
    const maxVal = 27;
    const toX = (i: number) => padL + (i / (points.length - 1)) * chartW;
    const toY = (v: number) => padT + (1 - v / maxVal) * chartH;
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(p.value)}`).join(' ');
    const areaD = `${pathD} L ${toX(points.length - 1)} ${padT + chartH} L ${padL} ${padT + chartH} Z`;
    return (
        <svg viewBox={`0 0 ${W} ${H + 10}`} width="100%">
            {/* Severity zones */}
            {[{ from: 0, to: 4, color: 'rgba(16,185,129,0.06)', label: 'Remission' }, { from: 5, to: 9, color: 'rgba(59,130,246,0.06)', label: 'Mild' }, { from: 10, to: 14, color: 'rgba(245,158,11,0.06)', label: 'Moderate' }].map(z => (
                <rect key={z.label} x={padL} y={toY(z.to)} width={chartW} height={toY(z.from) - toY(z.to)} fill={z.color} />
            ))}
            {/* Area */}
            <path d={areaD} fill="rgba(59,130,246,0.08)" />
            {/* Line */}
            <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth={2} strokeLinejoin="round" />
            {/* Points + labels */}
            {points.map((p, i) => (
                <g key={i}>
                    <circle cx={toX(i)} cy={toY(p.value)} r={4} fill="#3b82f6" stroke="white" strokeWidth={1.5} />
                    <text x={toX(i)} y={toY(p.value) - 7} textAnchor="middle" fontSize="9" fill="#1e3a5f" fontWeight="700" fontFamily="Inter, sans-serif">{p.value}</text>
                    <text x={toX(i)} y={H + 6} textAnchor="middle" fontSize="8" fill="#94a3b8" fontFamily="Inter, sans-serif">{p.label}</text>
                </g>
            ))}
            {/* Y-axis */}
            <line x1={padL} y1={padT} x2={padL} y2={padT + chartH} stroke="#e2e8f0" strokeWidth={1} />
            {[0, 5, 10, 15, 20, 27].map(v => (
                <text key={v} x={padL - 4} y={toY(v) + 3} textAnchor="end" fontSize="7" fill="#94a3b8" fontFamily="Inter, sans-serif">{v}</text>
            ))}
            <text x={padL - 20} y={padT + chartH / 2} textAnchor="middle" fontSize="8" fill="#94a3b8" fontFamily="Inter, sans-serif" transform={`rotate(-90, ${padL - 20}, ${padT + chartH / 2})`}>PHQ-9</text>
        </svg>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const InsuranceReportPDF: React.FC = () => {
    const d = DEMO;
    const TABLE_TH: React.CSSProperties = { backgroundColor: '#ede9ff', color: '#3730a3', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '7px 10px', textAlign: 'left' };
    const TABLE_TD: React.CSSProperties = { fontSize: '12px', padding: '7px 10px', color: '#1e293b', verticalAlign: 'top', borderBottom: '1px solid #f1f5f9' };

    useEffect(() => { document.title = `Insurance Report — ${d.reportId} — PPN Portal`; }, [d.reportId]);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: PDF_PRINT_CSS }} />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet" />
            <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileText size={18} color="#6366f1" />
                    <span style={{ color: '#f8fafc', fontSize: '14px', fontWeight: 700 }}>Insurance Report — {d.reportId}</span>
                    {d.isPreview && <span style={{ backgroundColor: '#f59e0b', color: '#1e293b', fontSize: '10px', fontWeight: 900, padding: '2px 8px', borderRadius: '4px' }}>PREVIEW DATA</span>}
                </div>
                <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }} aria-label="Download PDF">
                    <Printer size={15} /> Download PDF
                </button>
            </div>

            <div style={{ backgroundColor: '#e2e8f0', padding: '32px 24px', minHeight: '100vh', fontFamily: "'Inter', ui-sans-serif, sans-serif" }}>
                {/* Page 1 */}
                <PDFPageShell reportType="Letter of Medical Necessity" reportId={d.reportId} pageNum={1} total={2} exportDate={d.exportDate}>
                    <div style={{ borderLeft: '5px solid #1e3a5f', paddingLeft: '14px', marginBottom: '16px' }}>
                        <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#1e3a5f', margin: '0 0 4px' }}>LETTER OF MEDICAL NECESSITY</h1>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Psychedelic-Assisted Therapy · Coverage Documentation</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '4px' }}>
                        {[['Patient ID', d.patientId], ['Payer Reference', d.payerReference], ['Date', d.date], ['Clinician', d.clinicianId]].map(([k, v]) => (
                            <div key={k}><div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div><div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', marginTop: '2px', fontFamily: (k === 'Patient ID' || k === 'Clinician') ? "'Roboto Mono', monospace" : undefined }}>{v}</div></div>
                        ))}
                    </div>

                    <PDFSectionTitle accent="#3b82f6">Diagnosis and Treatment Justification</PDFSectionTitle>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
                        <thead><tr><th style={{ ...TABLE_TH, width: '35%' }}>Field</th><th style={TABLE_TH}>Details</th></tr></thead>
                        <tbody>
                            {[
                                ['Primary Diagnosis', `${d.primaryDiagnosis} (ICD-10: ${d.icdCode})`],
                                ['Baseline PHQ-9', `${d.baselinePHQ9} — Severe (range 20-27)`],
                                ['Baseline GAD-7', `${d.baselineGAD7} — Severe (range 15-21)`],
                                ['Prior Treatments Failed', d.priorTreatmentsFailed],
                            ].map(([k, v], i) => (
                                <tr key={k as string} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                                    <td style={{ ...TABLE_TD, fontWeight: 600, color: '#475569' }}>{k}</td>
                                    <td style={TABLE_TD}>{v}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px', marginBottom: '10px' }}>
                        <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Treatment Rationale</div>
                        <div style={{ fontSize: '12px', color: '#1e293b', lineHeight: 1.6, fontStyle: 'italic' }}>{d.treatmentRationale}</div>
                    </div>

                    <PDFSectionTitle accent="#10b981">Protocol Description</PDFSectionTitle>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr><th style={{ ...TABLE_TH, width: '35%' }}>Field</th><th style={TABLE_TH}>Details</th></tr></thead>
                        <tbody>
                            {[['Substance', d.substance], ['Dose', d.dose], ['Sessions Completed', d.sessionsCompleted], ['Supervision Ratio', d.supervisionRatio], ['Protocol', d.protocol]].map(([k, v], i) => (
                                <tr key={k as string} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                                    <td style={{ ...TABLE_TD, fontWeight: 600, color: '#475569' }}>{k}</td>
                                    <td style={TABLE_TD}>{v}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </PDFPageShell>

                {/* Page 2 */}
                <PDFPageShell reportType="Letter of Medical Necessity" reportId={d.reportId} pageNum={2} total={2} exportDate={d.exportDate}>
                    <PDFSectionTitle accent="#6366f1" marginTop={0}>Outcome Evidence</PDFSectionTitle>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', backgroundColor: '#ffffff', marginBottom: '12px' }}>
                        <PHQ9Chart points={d.phq9Journey} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {[
                            { label: 'Response Achieved', sub: '>= 50% reduction in PHQ-9', met: d.responseAchieved },
                            { label: 'Remission Achieved', sub: 'PHQ-9 < 5', met: d.remissionAchieved },
                        ].map(badge => (
                            <div key={badge.label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: badge.met ? '#f0fdf4' : '#f8fafc', border: `1px solid ${badge.met ? '#bbf7d0' : '#e2e8f0'}`, borderRadius: '8px', padding: '10px 14px' }}>
                                <CheckCircle size={18} color={badge.met ? '#10b981' : '#94a3b8'} />
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: 700, color: badge.met ? '#065f46' : '#64748b' }}>{badge.label}</div>
                                    <div style={{ fontSize: '10px', color: '#64748b' }}>{badge.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <PDFSectionTitle accent="#ef4444">Safety Profile</PDFSectionTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        <PDFMetricCell label="Total AEs" value={d.totalAEs} accent={d.totalAEs > 3 ? '#f59e0b' : '#10b981'} />
                        <PDFMetricCell label="Grade 3+" value={d.grade3Plus} accent={d.grade3Plus > 0 ? '#ef4444' : '#10b981'} sub="no life-threatening events" />
                        <PDFMetricCell label="Chemical Rescue" value={d.chemicalRescue} accent={d.chemicalRescue > 0 ? '#f59e0b' : '#10b981'} sub="not required" />
                    </div>

                    <PDFSectionTitle accent="#1e3a5f">Clinician Attestation</PDFSectionTitle>
                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                        <p style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic', margin: '0 0 14px', lineHeight: 1.6 }}>{d.clinicianAttestation}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                            {[['Clinician ID', d.clinicianId], ['Credentials', '(Please print)']].map(([k, v]) => (
                                <div key={k}>
                                    <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
                                    <div style={{ borderBottom: '1px solid #94a3b8', marginTop: '4px', height: '24px', display: 'flex', alignItems: 'flex-end', paddingBottom: '2px' }}>
                                        <span style={{ fontSize: '11px', color: '#1e293b', fontFamily: k === 'Clinician ID' ? "'Roboto Mono', monospace" : undefined }}>{k === 'Clinician ID' ? v : ''}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '32px' }}>
                            <div style={{ flex: 1 }}><div style={{ borderBottom: '1px solid #94a3b8', height: '32px' }} /><div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px' }}>Clinician Signature</div></div>
                            <div style={{ width: '140px' }}><div style={{ borderBottom: '1px solid #94a3b8', height: '32px' }} /><div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px' }}>Date</div></div>
                        </div>
                    </div>
                </PDFPageShell>
            </div>
        </>
    );
};

export default InsuranceReportPDF;
