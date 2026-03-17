/**
 * DataPolicyPDF — PPN Zero-PHI Architecture Explanation
 * 2-page print-ready document explaining what data is collected,
 * what is stripped before export, how de-identification works,
 * and guidance for IRB/research submission.
 * Always accompanies the Research Data Export.
 */
import React, { useEffect } from 'react';

const PRINT_CSS = `
@media print {
  @page { size: A4; margin: 0; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .pdf-page { page-break-after: always; page-break-inside: avoid; }
  .pdf-page:last-child { page-break-after: auto; }
  .no-print { display: none !important; }
}
`;

const PageShell: React.FC<{ children: React.ReactNode; pageNum: number; total: number }> = ({ children, pageNum, total }) => (
    <div className="pdf-page" style={{
        width: '210mm', minHeight: '297mm', backgroundColor: '#ffffff',
        fontFamily: "'Inter','Helvetica Neue',sans-serif", color: '#1e293b',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 4px 32px rgba(0,0,0,0.18)', marginBottom: '24px',
        display: 'flex', flexDirection: 'column',
    }}>
        <div style={{ height: '6px', background: 'linear-gradient(90deg,#1e3a5f 0%,#3b82f6 50%,#6d28d9 100%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 28px 10px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg,#1e3a5f,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'white', fontSize: '13px', fontWeight: 900 }}>P</span>
                </div>
                <div>
                    <div style={{ fontSize: '10px', fontWeight: 900, color: '#1e3a5f', letterSpacing: '0.08em', textTransform: 'uppercase' }}>PPN Portal</div>
                    <div style={{ fontSize: '8px', color: '#64748b' }}>Data Policy · Zero-PHI Architecture</div>
                </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '9px', color: '#94a3b8' }}>
                <div style={{ fontWeight: 700, color: '#64748b' }}>DATA-POLICY-v2.2</div>
                <div>Page {pageNum} of {total}</div>
            </div>
        </div>
        <div style={{ flex: 1, padding: '24px 28px' }}>{children}</div>
        <div style={{ borderTop: '1px solid #e2e8f0', padding: '8px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
            <span style={{ fontSize: '8px', color: '#94a3b8' }}>HIPAA Safe Harbor · 21 CFR Part 11 · PPN Portal v2.2</span>
            <span style={{ fontSize: '8px', color: '#94a3b8' }}>Generated: {new Date().toLocaleDateString()}</span>
        </div>
    </div>
);

const SectionTitle: React.FC<{ children: React.ReactNode; accent?: string }> = ({ children, accent = '#3b82f6' }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', marginTop: '20px' }}>
        <div style={{ width: '3px', height: '18px', backgroundColor: accent, borderRadius: '2px', flexShrink: 0 }} />
        <h2 style={{ fontSize: '12px', fontWeight: 900, color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{children}</h2>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
    </div>
);

const TwoColTable: React.FC<{ rows: [string, string][]; headerLeft?: string; headerRight?: string; accent?: string }> = ({
    rows, headerLeft = 'Category', headerRight = 'Detail', accent = '#1e3a5f',
}) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', marginBottom: '14px' }}>
        <thead>
            <tr style={{ backgroundColor: accent, color: 'white' }}>
                {[headerLeft, headerRight].map(h => (
                    <th key={h} style={{ padding: '7px 10px', textAlign: 'left', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {rows.map(([left, right], i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#f8fafc' : 'white', borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '7px 10px', fontWeight: 600, color: '#1e293b', width: '38%', verticalAlign: 'top' }}>{left}</td>
                    <td style={{ padding: '7px 10px', color: '#475569', lineHeight: 1.5 }}>{right}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

const DataPolicyPDF: React.FC = () => {
    // Set a unique document title so the PDF saves with a descriptive filename
    useEffect(() => {
        const prev = document.title;
        document.title = 'PPN-Data-Policy-Zero-PHI-Architecture-v2.2';
        return () => { document.title = prev; };
    }, []);

    return (
        <div style={{ backgroundColor: '#0a1628', minHeight: '100vh', padding: '32px 24px' }}>
            <style>{PRINT_CSS}</style>

            {/* Toolbar */}
            <div className="no-print" style={{ maxWidth: '210mm', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ color: '#8BA5D3', fontSize: '22px', fontWeight: 900, margin: 0 }}>Data Policy</h1>
                    <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0' }}>Zero-PHI Architecture · Research Export Companion Document</p>
                </div>
                <button onClick={() => window.print()} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                    background: 'linear-gradient(135deg,#1e3a5f,#3b82f6)', color: 'white',
                    border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: 900,
                    cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase',
                    boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
                }}>↓ Download PDF</button>
            </div>

            <div style={{ maxWidth: '210mm', margin: '0 auto' }}>

                {/* ════════ PAGE 1 ════════ */}
                <PageShell pageNum={1} total={2}>
                    {/* Cover block */}
                    <div style={{ background: 'linear-gradient(135deg,#1e3a5f 0%,#1e40af 60%,#4f46e5 100%)', borderRadius: '12px', padding: '24px 28px', color: 'white', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.2)' }} />
                        <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Research Data Export · Companion Document</div>
                        <h1 style={{ fontSize: '22px', fontWeight: 900, margin: '0 0 6px' }}>Data Policy</h1>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', marginBottom: '16px' }}>Zero-PHI Architecture · PPN Portal v2.2</div>
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>
                            This document explains how PPN Portal collects, de-identifies, stores, and exports clinical data.
                            It is designed to accompany every research-grade CSV export and to satisfy IRB disclosure requirements.
                        </p>
                    </div>

                    <SectionTitle>What is Zero-PHI Architecture?</SectionTitle>
                    <p style={{ fontSize: '10px', color: '#475569', lineHeight: 1.7, marginBottom: '14px' }}>
                        PPN Portal is designed so that Protected Health Information (PHI) — as defined under 45 CFR §164.514(b) — is
                        <strong style={{ color: '#1e293b' }}> structurally impossible to include</strong> in any research export.
                        This is achieved not by post-hoc scrubbing, but by the schema itself:
                        clinical records never store the 18 HIPAA Safe Harbor identifiers in any exportable table.
                        Patient names, dates of birth, addresses, and all direct identifiers exist only in access-control layers
                        that are never joined to outcome data.
                    </p>

                    <SectionTitle accent="#10b981">Fields Included in Research Exports</SectionTitle>
                    <TwoColTable accent="#065f46" headerLeft="Field" headerRight="What it contains (and why it is safe)" rows={[
                        ['subject_id', 'A randomly generated UUID assigned at enrollment. Contains no derivable information about the individual. Consistent across a patient\'s records to enable longitudinal analysis.'],
                        ['age_group', 'Coarse band only (e.g., "35–44"). Never exact date of birth. Prevents age-based re-identification.'],
                        ['substance', 'Substance class or molecule (e.g., "MDMA", "Psilocybin"). No lot number, prescriber ID, or pharmacy data.'],
                        ['dose_mg', 'Administered dose in milligrams. No prescriber name or DEA number.'],
                        ['route', 'Route of administration (e.g., "Oral"). Standard controlled-vocabulary term.'],
                        ['session_date', 'YYYY-MM-DD only. No time. Time is stripped to prevent cross-referencing with facility schedules.'],
                        ['meq30_total', 'Mystical Experience Questionnaire total score (0–150). No item-level responses.'],
                        ['phq9_baseline / phq9_followup', 'PHQ-9 scores (0–27). No free-text responses. No dates beyond "Baseline" / "Follow-up" labels.'],
                        ['gad7_baseline / gad7_followup', 'GAD-7 scores (0–21). Same rules as PHQ-9.'],
                        ['pcl5_baseline / pcl5_followup', 'PCL-5 scores (0–80). PTSD symptom severity.'],
                        ['pulse_check_adherence_pct', 'Percentage of scheduled pulse checks submitted. No individual daily values.'],
                        ['integration_sessions_attended', 'Integer count only. No session dates or therapist identifiers.'],
                    ]} />

                    <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '16px', flexShrink: 0 }}>⚠️</span>
                        <p style={{ fontSize: '9px', color: '#92400e', margin: 0, lineHeight: 1.6 }}>
                            <strong>IRB Notice:</strong> Even though these exports are de-identified to Safe Harbor standards, researchers are responsible
                            for compliance with their institution's IRB policies. The use of this data set in publications must cite
                            the PPN Portal data governance framework and include a statement confirming that no re-identification was attempted.
                        </p>
                    </div>
                </PageShell>

                {/* ════════ PAGE 2 ════════ */}
                <PageShell pageNum={2} total={2}>
                    <SectionTitle accent="#8b5cf6">Adverse Event Coding (MedDRA-Structured)</SectionTitle>
                    <p style={{ fontSize: '10px', color: '#475569', lineHeight: 1.7, marginBottom: '12px' }}>
                        All adverse events in research exports are coded using the Medical Dictionary for Regulatory Activities (MedDRA)
                        three-level hierarchy. Codes are sourced from the MedDRA version current at the time of patient enrollment.
                    </p>
                    <TwoColTable accent="#6d28d9" headerLeft="Column" headerRight="Description" rows={[
                        ['ae_meddra_soc', 'System Organ Class (SOC) — highest level of the MedDRA hierarchy. E.g., "Psychiatric disorders" (SOC 10037175).'],
                        ['ae_meddra_pt', 'Preferred Term (PT) — standardised term for the adverse event. E.g., "Anxiety" (PT 10002855).'],
                        ['ae_meddra_llt', 'Lowest Level Term (LLT) — most granular term, closest to verbatim report. E.g., "Feeling anxious" (LLT 10016524).'],
                        ['ae_severity', 'CTCAE Grade 1–5 (Mild → Death). Assigned by the supervising clinician at time of recording.'],
                        ['ae_relatedness', 'Relationship to investigational substance: "Definite", "Probable", "Possible", "Unlikely", "Not related".'],
                        ['ae_outcome', 'Outcome at last follow-up: "Resolved", "Resolving", "Persisting", "Unknown".'],
                    ]} />

                    <SectionTitle accent="#ef4444">What Is Never Included</SectionTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                        {[
                            ['Names', 'First, last, maiden, or any other name form'],
                            ['Dates of birth', 'Replaced with coarse age group band'],
                            ['Geographic identifiers', 'All sub-state geographies (city, ZIP, county) stripped'],
                            ['Contact details', 'Phone, email, fax, address — never stored in outcome tables'],
                            ['SSN / NPI', 'Social Security and National Provider Identifier numbers'],
                            ['Device / IP identifiers', 'No browser fingerprints, IP addresses, or device IDs in exports'],
                            ['Photographs or biometrics', 'No images, facial geometry, or biometric templates'],
                            ['Free-text clinical notes', 'All narrative fields are excluded; only structured scored fields exported'],
                            ['Prescriber identity', 'Clinician IDs are hashed and excluded from research exports'],
                            ['Specific session times', 'Only date (YYYY-MM-DD); never time-of-day or facility identifiers'],
                        ].map(([id, desc], i) => (
                            <div key={i} style={{ display: 'flex', gap: '8px', padding: '8px 10px', backgroundColor: i % 2 === 0 ? '#fef2f2' : '#fafafa', border: '1px solid #fecaca', borderRadius: '6px' }}>
                                <span style={{ fontSize: '11px', flexShrink: 0 }}>✗</span>
                                <div>
                                    <div style={{ fontSize: '9px', fontWeight: 700, color: '#991b1b' }}>{id}</div>
                                    <div style={{ fontSize: '8px', color: '#6b7280', marginTop: '1px' }}>{desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <SectionTitle accent="#1e3a5f">Audit Trail & Access Controls</SectionTitle>
                    <p style={{ fontSize: '10px', color: '#475569', lineHeight: 1.7, marginBottom: '12px' }}>
                        Every research export event is logged immutably under 21 CFR Part 11 audit trail requirements.
                        The log entry captures: exporting user ID (hashed), export type, record count, timestamp (UTC), and session token.
                        Logs are append-only and cannot be modified or deleted by any user, including administrators.
                    </p>

                    <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '14px 18px', marginBottom: '16px' }}>
                        <div style={{ fontSize: '10px', fontWeight: 900, color: '#1e3a5f', marginBottom: '6px' }}>Citation for Research Publications</div>
                        <p style={{ fontSize: '9px', color: '#1e40af', margin: 0, lineHeight: 1.7, fontStyle: 'italic' }}>
                            "Clinical outcome data used in this analysis was sourced from PPN Portal (v2.2), a HIPAA Safe Harbor
                            de-identified electronic health record platform designed for psychedelic-assisted therapy research.
                            All records were exported in compliance with 45 CFR §164.514(b) Safe Harbor de-identification standards.
                            No re-identification of records was attempted or performed."
                        </p>
                    </div>

                    <div style={{ padding: '10px 14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px' }}>🔒</span>
                        <p style={{ fontSize: '9px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                            Questions about data governance, IRB submissions, or re-use agreements:
                            contact <strong>data@ppnportal.net</strong> · Data Policy version: 2.2 · Effective: 2025-01-01
                        </p>
                    </div>
                </PageShell>
            </div>
        </div>
    );
};

export default DataPolicyPDF;
