// WO-531: Print-optimized one-pager for "What We Collect" trust document
// Route: /data-policy/print (public, no auth required)
// Usage: Open in browser → Ctrl/Cmd+P → Save as PDF → No margins, A4/Letter

import React from 'react';
import { useNavigate } from 'react-router-dom';

const DataPolicyPrint: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            {/* Print styles */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=JetBrains+Mono:wght@500&display=swap');

        @media print {
          .no-print { display: none !important; }
          body { background: #ffffff !important; }
          @page { size: letter portrait; margin: 0.6in; }
        }

        .print-root {
          font-family: 'Inter', system-ui, sans-serif;
          background: #ffffff;
          color: #1e293b;
          min-height: 100vh;
        }

        /* Print document shell — Letter proportions */
        .print-doc {
          max-width: 816px;
          margin: 0 auto;
          background: #ffffff;
        }

        /* Header */
        .doc-header {
          background: #ffffff;
          padding: 20px 32px 16px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          border-bottom: 3px solid #6366f1;
        }

        .doc-header-left { display: flex; flex-direction: column; gap: 2px; }
        .doc-wordmark { font-size: 10px; font-weight: 900; letter-spacing: 0.3em; color: #6366f1; text-transform: uppercase; margin-bottom: 4px; }
        .doc-title { font-size: 24px; font-weight: 900; color: #0f172a; letter-spacing: -0.02em; line-height: 1.1; }
        .doc-subtitle { font-size: 11px; color: #64748b; margin-top: 3px; font-style: italic; }

        .doc-header-right { text-align: right; padding-bottom: 4px; }
        .doc-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #4f46e5; background: #eef2ff; border: 1px solid #c7d2fe; padding: 3px 8px; border-radius: 4px; }
        .doc-date { font-size: 9px; color: #94a3b8; margin-top: 4px; }

        /* Body */
        .doc-body { padding: 24px 32px; display: flex; flex-direction: column; gap: 20px; }

        /* Two-column row */
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

        /* Section titles */
        .sec-kicker { font-size: 8px; font-weight: 800; letter-spacing: 0.25em; text-transform: uppercase; color: #6366f1; margin-bottom: 4px; }
        .sec-title { font-size: 15px; font-weight: 900; color: #1e293b; letter-spacing: -0.01em; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 10px; }

        /* NO Boundary items */
        .no-item { display: flex; gap: 8px; align-items: flex-start; padding: 8px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #ef4444; border-radius: 6px; margin-bottom: 6px; }
        .no-icon { font-size: 13px; flex-shrink: 0; margin-top: 1px; }
        .no-label { font-size: 11px; font-weight: 700; color: #1e293b; }
        .no-detail { font-size: 10px; color: #64748b; margin-top: 1px; line-height: 1.4; }

        /* Anonymous ID box */
        .anon-box { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; margin-top: 8px; }
        .anon-label { font-size: 8px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: #64748b; margin-bottom: 4px; }
        .anon-body { font-size: 10px; color: #374151; line-height: 1.45; }
        .anon-code { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: #4f46e5; background: #eef2ff; padding: 1px 5px; border-radius: 3px; }

        /* Data subsections */
        .subsection { margin-bottom: 10px; }
        .subsec-header { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
        .subsec-num { width: 18px; height: 18px; border-radius: 4px; background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.3); display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 900; color: #4f46e5; flex-shrink: 0; }
        .subsec-title { font-size: 11px; font-weight: 800; color: #1e293b; }
        .subsec-desc { font-size: 9.5px; color: #64748b; font-style: italic; margin-bottom: 3px; }
        .data-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 2px; }
        .data-list li { font-size: 10px; color: #374151; position: relative; padding-left: 12px; line-height: 1.45; }
        .data-list li::before { content: "•"; color: #6366f1; font-size: 10px; position: absolute; left: 0; top: 0; }
        .data-list strong { font-weight: 700; color: #1e293b; }
        .data-detail { color: #64748b; }

        /* Part 3 — Protection cards row */
        .protection-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .protection-card { background: #f8fafc; border: 1px solid #e2e8f0; border-top: 3px solid #6366f1; border-radius: 6px; padding: 12px; }
        .prot-num { font-size: 20px; font-weight: 900; color: rgba(99,102,241,0.25); line-height: 1; margin-bottom: 4px; }
        .prot-title { font-size: 11px; font-weight: 800; color: #1e293b; margin-bottom: 4px; }
        .prot-body { font-size: 9.5px; color: #64748b; line-height: 1.45; }

        /* Callout box */
        .callout { background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 6px; padding: 10px 14px; }
        .callout-inner { font-size: 10.5px; color: #3730a3; line-height: 1.5; }

        /* Footer */
        .doc-footer { border-top: 1px solid #e2e8f0; padding: 12px 32px; display: flex; align-items: center; justify-content: space-between; }
        .footer-left { font-size: 8.5px; color: #94a3b8; }
        .footer-right { font-size: 8.5px; color: #94a3b8; font-weight: 600; }

        /* Print toolbar (hidden on print) */
        .print-toolbar { background: #07101e; padding: 10px 24px; display: flex; align-items: center; justify-between; gap: 12px; border-bottom: 1px solid #1e293b; }
      `}</style>

            {/* ── Browser-only print toolbar ── */}
            <div className="no-print print-toolbar" style={{ background: '#07101e', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                        onClick={() => navigate('/data-policy')}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 13, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden="true">arrow_back</span>
                        Back
                    </button>
                    <span style={{ color: '#334155', fontSize: 12 }}>|</span>
                    <span style={{ color: '#6366f1', fontSize: 12, fontWeight: 700 }}>Print Preview — What We Collect</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        onClick={() => window.print()}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#6366f1', color: '#ffffff', fontSize: 12, fontWeight: 900, borderRadius: 8, border: 'none', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase' }}
                        aria-label="Save as PDF via browser print"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden="true">download</span>
                        Save as PDF
                    </button>
                </div>
            </div>

            {/* ── Print Document ── */}
            <div className="print-root">
                <div className="print-doc">

                    {/* Header */}
                    <header className="doc-header">
                        <div className="doc-header-left">
                            <span className="doc-wordmark">PPN Portal</span>
                            <h1 className="doc-title">What We Collect</h1>
                            <p className="doc-subtitle">The Sterile Schema. What We Protect. Why It Matters.</p>
                        </div>
                        <div className="doc-header-right">
                            <span className="doc-tag">Architecture & Trust</span>
                            <p className="doc-date">v1.0 &nbsp;·&nbsp; 2026-03-05</p>
                        </div>
                    </header>

                    {/* Body */}
                    <div className="doc-body">

                        {/* Callout */}
                        <div className="callout">
                            <p className="callout-inner">
                                <strong>Zero-Knowledge, No-PHI Architecture.</strong>{' '}
                                By cryptographically separating the process of care from the identity of the patient, PPN Portal ensures your data acts as an immutable shield of clinical diligence, not a legal vulnerability. For psychedelic therapy practitioners, data is often viewed as a liability: evidence that could invite regulatory scrutiny or legal exposure. PPN Portal fundamentally changes this dynamic.
                            </p>
                        </div>

                        {/* Two-column */}
                        <div className="two-col">

                            {/* LEFT — Part 1 */}
                            <div>
                                <p className="sec-kicker">Part 1</p>
                                <h2 className="sec-title">The Hard Boundaries</h2>

                                <div className="no-item">
                                    <span className="no-icon">🚫</span>
                                    <div>
                                        <p className="no-label">NO Personally Identifiable Information (PII/PHI)</p>
                                        <p className="no-detail">We never ask for, or store, patient names, email addresses, street addresses, or Social Security Numbers.</p>
                                    </div>
                                </div>

                                <div className="no-item">
                                    <span className="no-icon">🚫</span>
                                    <div>
                                        <p className="no-label">NO Free-Text Clinical Notes</p>
                                        <p className="no-detail">All inputs are driven by standardized dropdowns, toggles, and sliders. No narrative disclosures.</p>
                                    </div>
                                </div>

                                <div className="anon-box">
                                    <p className="anon-label">How We Track Patients</p>
                                    <p className="anon-body">
                                        The system is <em>amnesiac</em> regarding patient identity, relying entirely on a Client-Side Random ID Generator. Example:{' '}
                                        <span className="anon-code">PT-KXMR9W2P</span>.{' '}
                                        You hold the key connecting that ID to your patient; PPN Portal only sees an anonymized string.
                                    </p>
                                </div>
                            </div>

                            {/* RIGHT — Part 2 */}
                            <div>
                                <p className="sec-kicker">Part 2</p>
                                <h2 className="sec-title">The Evidence of Care</h2>

                                {/* Subsection 1 */}
                                <div className="subsection">
                                    <div className="subsec-header">
                                        <span className="subsec-num">1</span>
                                        <span className="subsec-title">Subject Baseline & Demographics</span>
                                    </div>
                                    <p className="subsec-desc">Demographic signals for cross-site benchmarking without exposing identity.</p>
                                    <ul className="data-list">
                                        <li><strong>Biological Sex</strong></li>
                                        <li><strong>Age Group</strong><span className="data-detail">: generalized band (e.g., 36–45), per HIPAA Safe Harbor</span></li>
                                        <li><strong>Body Weight</strong><span className="data-detail">: for dosage safety threshold checks only</span></li>
                                        <li><strong>Primary Indication</strong><span className="data-detail">: e.g., Treatment-Resistant Depression, mapped to standard codes</span></li>
                                    </ul>
                                </div>

                                {/* Subsection 2 */}
                                <div className="subsection">
                                    <div className="subsec-header">
                                        <span className="subsec-num">2</span>
                                        <span className="subsec-title">Container Metrics (Set & Setting)</span>
                                    </div>
                                    <ul className="data-list">
                                        <li><strong>Setting Code</strong><span className="data-detail">: Clinic, Home (Supervised), or Retreat Center</span></li>
                                        <li><strong>Support Ratio</strong><span className="data-detail">: 1:1, 2:1 (Co-Therapy Pair), or Group</span></li>
                                        <li><strong>Prep & Integration Hours</strong><span className="data-detail">: Numeric time outside dosing session</span></li>
                                        <li><strong>Support Modalities</strong><span className="data-detail">: CBT, Somatic, IFS, Music presence</span></li>
                                    </ul>
                                </div>

                                {/* Subsection 3 */}
                                <div className="subsection">
                                    <div className="subsec-header">
                                        <span className="subsec-num">3</span>
                                        <span className="subsec-title">The Clinical Intervention</span>
                                    </div>
                                    <ul className="print-list">
                                        <li><strong>Substance</strong><span className="data-detail">: mapped to RxNorm Codes</span></li>
                                        <li><strong>Dosage & Route</strong><span className="data-detail">: mapped to UCUM Codes</span></li>
                                        <li><strong>Additional Medications</strong><span className="data-detail">: smart grid with interaction risk checks</span></li>
                                    </ul>
                                </div>

                                {/* Subsection 4 */}
                                <div className="subsection">
                                    <div className="subsec-header">
                                        <span className="subsec-num">4</span>
                                        <span className="subsec-title">Safety & Outcomes Tracking</span>
                                    </div>
                                    <ul className="data-list">
                                        <li><strong>Psychometric Scores</strong><span className="data-detail">: PHQ-9, GAD-7 mapped to LOINC codes</span></li>
                                        <li><strong>Adverse Events</strong><span className="data-detail">: MedDRA coded (e.g., Nausea, Mild Distress)</span></li>
                                        <li><strong>Session Experience</strong><span className="data-detail">: Intensity and Therapeutic challenge sliders</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Part 3 — Full width */}
                        <div>
                            <p className="sec-kicker">Part 3</p>
                            <h2 className="sec-title">Why This Architecture Protects You</h2>
                            <div className="protection-row">
                                <div className="protection-card">
                                    <div className="prot-num">1.</div>
                                    <p className="prot-title">Audit-Ready Documentation</p>
                                    <p className="prot-body">Export a forensic, timestamped log proving you checked for contraindications, monitored vitals, and followed a data-backed safety protocol. Ready for any medical board or insurer inquiry.</p>
                                </div>
                                <div className="protection-card">
                                    <div className="prot-num">2.</div>
                                    <p className="prot-title">Immunity to Subpoenas</p>
                                    <p className="prot-body">PPN Portal operates on a Zero-Knowledge framework. If law enforcement were to subpoena our data, we have nothing to surrender but a string of random numbers and coded selections.</p>
                                </div>
                                <div className="protection-card">
                                    <div className="prot-num">3.</div>
                                    <p className="prot-title">Network Benchmarking</p>
                                    <p className="prot-body">Because we do not store PHI, your anonymized clinical outcomes can be benchmarked in real-time against network averages, giving you the evidence to refine protocols and prove efficacy.</p>
                                </div>
                            </div>
                        </div>

                    </div>{/* end doc-body */}

                    {/* Footer */}
                    <footer className="doc-footer">
                        <span className="footer-left">© 2026 Precision Psychedelic Network (PPN) · All Rights Reserved · Document v1.0</span>
                        <span className="footer-right">Zero PHI Stored · This is not a medical record</span>
                    </footer>

                </div>{/* end print-doc */}
            </div>
        </>
    );
};

export default DataPolicyPrint;
