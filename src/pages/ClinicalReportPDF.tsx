import React, { useRef } from 'react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const REPORT = {
    patientId: 'SUB-2024-0842',
    ageGroup: '35–44',
    treatmentStart: 'July 14, 2025',
    treatmentEnd: 'January 18, 2026',
    substance: 'MDMA-Assisted Therapy',
    clinician: 'Dr. Sarah Chen, LCSW',
    site: 'Pacific Healing Institute',
    exportDate: 'February 18, 2026',
    reportId: 'RPT-2026-0218-0842',
    baseline: { phq9: 21, gad7: 18, ace: 6, pcl5: 52, hrv: 34 },
    followup: { phq9: 8, gad7: 7, pcl5: 19, hrv: 58 },
    sessions: [
        { id: 1, date: 'Aug 3, 2025', dose: '125mg oral', duration: '7h 30m', vitals: 14, meq30: 72, ae: 1 },
        { id: 2, date: 'Sep 14, 2025', dose: '125mg oral', duration: '7h 12m', vitals: 12, meq30: 78, ae: 0 },
        { id: 3, date: 'Nov 2, 2025', dose: '100mg oral', duration: '6h 48m', vitals: 11, meq30: 81, ae: 0 },
    ],
    integration: { attended: 8, scheduled: 10, pulseCheckDays: 82, pulseTotal: 90, behavioralChanges: 6 },
    benchmarkPercentile: 91,
    phq9Trajectory: [
        { label: 'Baseline', day: 0, score: 21 },
        { label: 'Session 1', day: 14, score: 16 },
        { label: 'Week 6', day: 42, score: 13 },
        { label: 'Session 2', day: 63, score: 11 },
        { label: 'Month 3', day: 90, score: 9 },
        { label: 'Session 3', day: 112, score: 9 },
        { label: '6-Month', day: 188, score: 8 },
    ],
    vitalsSession1: [
        { t: '0:00', hr: 68, bp_s: 122, bp_d: 78 },
        { t: '1:00', hr: 88, bp_s: 128, bp_d: 82 },
        { t: '2:00', hr: 104, bp_s: 138, bp_d: 88 },
        { t: '3:00', hr: 112, bp_s: 142, bp_d: 90 },
        { t: '4:00', hr: 108, bp_s: 140, bp_d: 88 },
        { t: '5:00', hr: 98, bp_s: 132, bp_d: 84 },
        { t: '6:00', hr: 86, bp_s: 126, bp_d: 80 },
        { t: '7:30', hr: 74, bp_s: 120, bp_d: 76 },
    ],
};

// ─── Print Styles (injected into <head> on mount) ────────────────────────────
const PRINT_CSS = `
@media print {
  @page { size: A4; margin: 0; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .pdf-page { page-break-after: always; page-break-inside: avoid; }
  .pdf-page:last-child { page-break-after: auto; }
  .no-print { display: none !important; }
}
`;

// ─── Inline SVG: PHQ-9 Line Chart ────────────────────────────────────────────
const PHQ9Chart: React.FC = () => {
    const W = 560; const H = 160;
    const pad = { t: 20, r: 20, b: 40, l: 44 };
    const cW = W - pad.l - pad.r;
    const cH = H - pad.t - pad.b;
    const maxDay = 188; const maxScore = 27;
    const sx = (d: number) => (d / maxDay) * cW;
    const sy = (s: number) => cH - (s / maxScore) * cH;
    const pts = REPORT.phq9Trajectory;

    const pathD = pts.map((p, i) =>
        (i === 0 ? `M` : `L`) + ` ${sx(p.day).toFixed(1)} ${sy(p.score).toFixed(1)}`
    ).join(' ');

    const areaD = `${pathD} L ${sx(pts[pts.length - 1].day).toFixed(1)} ${cH} L ${sx(pts[0].day).toFixed(1)} ${cH} Z`;

    // Severity zone colours (very light for print)
    const zones = [
        { min: 20, max: 27, color: '#fee2e2' },
        { min: 15, max: 20, color: '#fef3c7' },
        { min: 10, max: 15, color: '#fefce8' },
        { min: 5, max: 10, color: '#f0fdf4' },
        { min: 0, max: 5, color: '#dcfce7' },
    ];

    return (
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
            <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
                <clipPath id="chartClip">
                    <rect x="0" y="0" width={cW} height={cH} />
                </clipPath>
            </defs>

            <g transform={`translate(${pad.l},${pad.t})`}>
                {/* Severity zones */}
                {zones.map((z, i) => (
                    <rect key={i} x={0} y={sy(z.max)} width={cW}
                        height={sy(z.min) - sy(z.max)} fill={z.color} />
                ))}

                {/* Remission threshold */}
                <line x1={0} y1={sy(5)} x2={cW} y2={sy(5)}
                    stroke="#22c55e" strokeWidth={1} strokeDasharray="4 3" />
                <text x={cW - 2} y={sy(5) - 4} textAnchor="end"
                    fill="#16a34a" fontSize={8} fontWeight="600">Remission (&lt;5)</text>

                {/* Grid lines */}
                {[0, 5, 10, 15, 20, 27].map(v => (
                    <g key={v}>
                        <line x1={0} y1={sy(v)} x2={cW} y2={sy(v)}
                            stroke="#e2e8f0" strokeWidth={1} />
                        <text x={-6} y={sy(v)} textAnchor="end" dominantBaseline="middle"
                            fill="#64748b" fontSize={8}>{v}</text>
                    </g>
                ))}

                {/* Area fill */}
                <path d={areaD} fill="url(#areaGrad)" clipPath="url(#chartClip)" />

                {/* Line */}
                <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth={2.5}
                    strokeLinecap="round" strokeLinejoin="round" />

                {/* Data points */}
                {pts.map((p, i) => (
                    <g key={i}>
                        <circle cx={sx(p.day)} cy={sy(p.score)} r={4}
                            fill={i === pts.length - 1 ? '#10b981' : '#3b82f6'}
                            stroke="white" strokeWidth={1.5} />
                        <text x={sx(p.day)} y={sy(p.score) - 8} textAnchor="middle"
                            fill="#1e3a5f" fontSize={8} fontWeight="700">{p.score}</text>
                    </g>
                ))}

                {/* X-axis labels */}
                {pts.map((p, i) => (
                    <text key={i} x={sx(p.day)} y={cH + 14} textAnchor="middle"
                        fill="#475569" fontSize={7.5}>{p.label}</text>
                ))}

                {/* Axes */}
                <line x1={0} y1={cH} x2={cW} y2={cH} stroke="#cbd5e1" strokeWidth={1.5} />
                <line x1={0} y1={0} x2={0} y2={cH} stroke="#cbd5e1" strokeWidth={1.5} />
            </g>
        </svg>
    );
};

// ─── Inline SVG: Vitals Chart ─────────────────────────────────────────────────
const VitalsChart: React.FC = () => {
    const W = 520; const H = 130;
    const pad = { t: 16, r: 16, b: 32, l: 44 };
    const cW = W - pad.l - pad.r; const cH = H - pad.t - pad.b;
    const vs = REPORT.vitalsSession1;
    const maxT = vs.length - 1;
    const sx = (i: number) => (i / maxT) * cW;

    // HR: 0-160 scale
    const syHR = (v: number) => cH - (v / 160) * cH;
    // Systolic: 80-180 scale
    const syBP = (v: number) => cH - ((v - 80) / 100) * cH;

    const hrPath = vs.map((v, i) => `${i === 0 ? 'M' : 'L'} ${sx(i).toFixed(1)} ${syHR(v.hr).toFixed(1)}`).join(' ');
    const bpPath = vs.map((v, i) => `${i === 0 ? 'M' : 'L'} ${sx(i).toFixed(1)} ${syBP(v.bp_s).toFixed(1)}`).join(' ');

    return (
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
            <g transform={`translate(${pad.l},${pad.t})`}>
                {[0, 40, 80, 120, 160].map(v => (
                    <g key={v}>
                        <line x1={0} y1={syHR(v)} x2={cW} y2={syHR(v)} stroke="#f1f5f9" strokeWidth={1} />
                        <text x={-6} y={syHR(v)} textAnchor="end" dominantBaseline="middle" fill="#94a3b8" fontSize={8}>{v}</text>
                    </g>
                ))}
                <path d={hrPath} fill="none" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" />
                <path d={bpPath} fill="none" stroke="#8b5cf6" strokeWidth={2} strokeLinecap="round" strokeDasharray="5 3" />
                {vs.map((v, i) => (
                    <text key={i} x={sx(i)} y={cH + 12} textAnchor="middle" fill="#64748b" fontSize={7.5}>{v.t}</text>
                ))}
                <line x1={0} y1={cH} x2={cW} y2={cH} stroke="#cbd5e1" strokeWidth={1.5} />
                <line x1={0} y1={0} x2={0} y2={cH} stroke="#cbd5e1" strokeWidth={1.5} />
            </g>
        </svg>
    );
};

// ─── Inline SVG: Radar / Spider Chart ────────────────────────────────────────
const RadarChart: React.FC = () => {
    const cx = 110; const cy = 110; const r = 85;
    const axes = [
        { label: 'Safety', clinic: 92, network: 74 },
        { label: 'Retention', clinic: 85, network: 68 },
        { label: 'Efficacy', clinic: 88, network: 72 },
        { label: 'Adherence', clinic: 94, network: 69 },
        { label: 'Data Quality', clinic: 96, network: 71 },
        { label: 'Compliance', clinic: 90, network: 65 },
    ];
    const n = axes.length;
    const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
    const pt = (val: number, i: number) => {
        const a = angle(i); const ratio = val / 100;
        return { x: cx + r * ratio * Math.cos(a), y: cy + r * ratio * Math.sin(a) };
    };
    const clinicPts = axes.map((a, i) => pt(a.clinic, i));
    const networkPts = axes.map((a, i) => pt(a.network, i));
    const toPath = (pts: { x: number; y: number }[]) =>
        pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + 'Z';

    return (
        <svg width="220" height="220" viewBox="0 0 220 220">
            {/* Grid rings */}
            {[25, 50, 75, 100].map(pct => {
                const ringPts = axes.map((_, i) => {
                    const a = angle(i); const ratio = pct / 100;
                    return `${cx + r * ratio * Math.cos(a)},${cy + r * ratio * Math.sin(a)}`;
                });
                return <polygon key={pct} points={ringPts.join(' ')} fill="none" stroke="#e2e8f0" strokeWidth={1} />;
            })}
            {/* Axis lines */}
            {axes.map((_, i) => {
                const a = angle(i);
                return <line key={i} x1={cx} y1={cy}
                    x2={(cx + r * Math.cos(a)).toFixed(1)} y2={(cy + r * Math.sin(a)).toFixed(1)}
                    stroke="#e2e8f0" strokeWidth={1} />;
            })}
            {/* Network polygon */}
            <polygon points={networkPts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
                fill="#94a3b8" fillOpacity={0.15} stroke="#94a3b8" strokeWidth={1.5} />
            {/* Clinic polygon */}
            <polygon points={clinicPts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
                fill="#3b82f6" fillOpacity={0.2} stroke="#3b82f6" strokeWidth={2} />
            {/* Labels */}
            {axes.map((a, i) => {
                const ang = angle(i); const offset = 14;
                const lx = cx + (r + offset) * Math.cos(ang);
                const ly = cy + (r + offset) * Math.sin(ang);
                return (
                    <text key={i} x={lx.toFixed(1)} y={ly.toFixed(1)}
                        textAnchor="middle" dominantBaseline="middle"
                        fill="#1e3a5f" fontSize={8} fontWeight="700">
                        {a.label}
                    </text>
                );
            })}
        </svg>
    );
};

// ─── Page Shell ───────────────────────────────────────────────────────────────
const PageShell: React.FC<{ children: React.ReactNode; pageNum: number; total: number }> = ({ children, pageNum, total }) => (
    <div
        className="pdf-page"
        style={{
            width: '210mm',
            minHeight: '297mm',
            backgroundColor: '#ffffff',
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            color: '#1e293b',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
        }}
    >
        {/* Top accent bar */}
        <div style={{ height: '6px', background: 'linear-gradient(90deg, #1e3a5f 0%, #3b82f6 50%, #10b981 100%)' }} />

        {/* Header strip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px 12px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #1e3a5f, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'white', fontSize: '14px', fontWeight: 900 }}>P</span>
                </div>
                <div>
                    <div style={{ fontSize: '11px', fontWeight: 900, color: '#1e3a5f', letterSpacing: '0.08em', textTransform: 'uppercase' }}>PPN Research Portal</div>
                    <div style={{ fontSize: '9px', color: '#64748b', letterSpacing: '0.04em' }}>Clinical Outcomes Report — CONFIDENTIAL</div>
                </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '9px', color: '#94a3b8' }}>
                <div style={{ fontWeight: 700, color: '#64748b', fontFamily: 'monospace' }}>{REPORT.reportId}</div>
                <div>Page {pageNum} of {total}</div>
            </div>
        </div>

        {/* Page body */}
        <div style={{ flex: 1, padding: '24px 28px' }}>{children}</div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #e2e8f0', padding: '8px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
            <span style={{ fontSize: '8px', color: '#94a3b8' }}>HIPAA Compliant · 21 CFR Part 11 · All exports logged · PPN Portal v2.2</span>
            <span style={{ fontSize: '8px', color: '#94a3b8' }}>Generated: {REPORT.exportDate}</span>
        </div>
    </div>
);

// ─── Metric Cell ──────────────────────────────────────────────────────────────
const MetricCell: React.FC<{ label: string; value: string | number; sub?: string; accent?: string }> = ({ label, value, sub, accent = '#1e3a5f' }) => (
    <div style={{ padding: '12px 14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'center' }}>
        <div style={{ fontSize: '22px', fontWeight: 900, color: accent, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '9px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>{label}</div>
        {sub && <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px' }}>{sub}</div>}
    </div>
);

// ─── Section Title ────────────────────────────────────────────────────────────
const SectionTitle: React.FC<{ children: React.ReactNode; accent?: string }> = ({ children, accent = '#3b82f6' }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', marginTop: '22px' }}>
        <div style={{ width: '3px', height: '18px', backgroundColor: accent, borderRadius: '2px', flexShrink: 0 }} />
        <h2 style={{ fontSize: '13px', fontWeight: 900, color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{children}</h2>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
    </div>
);

// ─── severity helper ──────────────────────────────────────────────────────────
const phq9Severity = (n: number) => n >= 20 ? 'Severe' : n >= 15 ? 'Mod. Severe' : n >= 10 ? 'Moderate' : n >= 5 ? 'Mild' : 'Minimal';

// ─── Main Report Component ────────────────────────────────────────────────────
const ClinicalReportPDF: React.FC = () => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => window.print();

    const phq9Pct = Math.round(((REPORT.baseline.phq9 - REPORT.followup.phq9) / REPORT.baseline.phq9) * 100);
    const gad7Pct = Math.round(((REPORT.baseline.gad7 - REPORT.followup.gad7) / REPORT.baseline.gad7) * 100);
    const pcl5Pct = Math.round(((REPORT.baseline.pcl5 - REPORT.followup.pcl5) / REPORT.baseline.pcl5) * 100);
    const integPct = Math.round((REPORT.integration.attended / REPORT.integration.scheduled) * 100);
    const pulsePct = Math.round((REPORT.integration.pulseCheckDays / REPORT.integration.pulseTotal) * 100);

    return (
        <div style={{ backgroundColor: '#0a1628', minHeight: '100vh', padding: '32px 24px' }}>
            {/* ── Toolbar (no-print) ───────────────────────────────────────── */}
            <div className="no-print" style={{ maxWidth: '210mm', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ color: '#8BA5D3', fontSize: '22px', fontWeight: 900, margin: 0 }}>Clinical Outcomes Report</h1>
                    <p style={{ color: '#8B9DC3', fontSize: '13px', margin: '4px 0 0' }}>Preview — {REPORT.patientId} · {REPORT.substance}</p>
                </div>
                <button
                    onClick={handlePrint}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #1e3a5f, #3b82f6)',
                        color: 'white', border: 'none', borderRadius: '12px',
                        fontSize: '13px', fontWeight: 900, cursor: 'pointer',
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
                    }}
                >
                    ↓ Download PDF
                </button>
            </div>

            {/* Print style injection */}
            <style>{PRINT_CSS}</style>

            {/* ── Report Pages ─────────────────────────────────────────────── */}
            <div ref={printRef} style={{ maxWidth: '210mm', margin: '0 auto' }}>

                {/* ══════════════════════════════════════════════════════════
                    PAGE 1 — COVER & EXECUTIVE SUMMARY
                ══════════════════════════════════════════════════════════ */}
                <PageShell pageNum={1} total={4}>

                    {/* Cover hero */}
                    <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 60%, #1d4ed8 100%)', borderRadius: '12px', padding: '28px 32px', marginBottom: '24px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: -20, right: -20, width: 140, height: 140, borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.15)' }} />
                        <div style={{ position: 'absolute', bottom: -30, right: 60, width: 90, height: 90, borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.12)' }} />
                        <div style={{ position: 'relative' }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Treatment Outcomes Report</div>
                            <h1 style={{ fontSize: '26px', fontWeight: 900, margin: '0 0 4px', letterSpacing: '-0.01em' }}>Clinical Summary</h1>
                            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginBottom: '20px' }}>{REPORT.substance}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                {[
                                    { l: 'Patient ID', v: REPORT.patientId },
                                    { l: 'Age Group', v: REPORT.ageGroup },
                                    { l: 'Site', v: REPORT.site },
                                    { l: 'Clinician', v: REPORT.clinician },
                                    { l: 'Start Date', v: REPORT.treatmentStart },
                                    { l: 'End Date', v: REPORT.treatmentEnd },
                                ].map((item, i) => (
                                    <div key={i}>
                                        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{item.l}</div>
                                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'white', marginTop: '2px' }}>{item.v}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Executive summary metrics */}
                    <SectionTitle>Executive Summary</SectionTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
                        <MetricCell label="PHQ-9 Improvement" value={`${phq9Pct}%`} sub={`${REPORT.baseline.phq9} → ${REPORT.followup.phq9}`} accent="#10b981" />
                        <MetricCell label="GAD-7 Improvement" value={`${gad7Pct}%`} sub={`${REPORT.baseline.gad7} → ${REPORT.followup.gad7}`} accent="#10b981" />
                        <MetricCell label="Dosing Sessions" value={REPORT.sessions.length} sub="Completed" accent="#3b82f6" />
                        <MetricCell label="Benchmark" value={`${REPORT.benchmarkPercentile}th`} sub="Percentile" accent="#8b5cf6" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                        <MetricCell label="Integration Compliance" value={`${integPct}%`} sub={`${REPORT.integration.attended}/${REPORT.integration.scheduled} sessions`} accent="#3b82f6" />
                        <MetricCell label="Pulse Check Rate" value={`${pulsePct}%`} sub={`${REPORT.integration.pulseCheckDays}/${REPORT.integration.pulseTotal} days`} accent="#f59e0b" />
                        <MetricCell label="Behavioral Changes" value={REPORT.integration.behavioralChanges} sub="Documented" accent="#1e3a5f" />
                    </div>

                    {/* Key findings narrative */}
                    <SectionTitle accent="#10b981">Key Clinical Findings</SectionTitle>
                    <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
                        <p style={{ fontSize: '11px', lineHeight: 1.7, color: '#14532d', margin: 0 }}>
                            Patient {REPORT.patientId} completed a full {REPORT.substance} treatment series across {REPORT.sessions.length} dosing sessions.
                            PHQ-9 scores declined from <strong>{REPORT.baseline.phq9} (Severe)</strong> at baseline to <strong>{REPORT.followup.phq9} (Mild)</strong> at 6-month follow-up,
                            representing a <strong>{phq9Pct}% reduction</strong>. GAD-7 similarly declined {gad7Pct}% ({REPORT.baseline.gad7} → {REPORT.followup.gad7}).
                            PCL-5 (trauma symptoms) reduced {pcl5Pct}% ({REPORT.baseline.pcl5} → {REPORT.followup.pcl5}).
                            No serious adverse events (Grade 4 or 5) were recorded across any session. Integration session attendance was {integPct}%.
                        </p>
                    </div>

                    {/* Compliance note */}
                    <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '16px', flexShrink: 0 }}>🔒</span>
                        <p style={{ fontSize: '10px', color: '#1e40af', margin: 0, lineHeight: 1.6 }}>
                            <strong>HIPAA Notice:</strong> This report is generated under HIPAA Safe Harbor de-identification standards. Patient ID is the sole identifier.
                            No name, date of birth, address, or other protected health information is included.
                            All data is stored in LOINC, SNOMED, and MedDRA coded fields. Re-identification is strictly prohibited.
                            Export logged under 21 CFR Part 11. Audit trail ID: {REPORT.reportId}.
                        </p>
                    </div>
                </PageShell>

                {/* ══════════════════════════════════════════════════════════
                    PAGE 2 — BASELINE + PHQ-9 TRAJECTORY
                ══════════════════════════════════════════════════════════ */}
                <PageShell pageNum={2} total={4}>
                    <SectionTitle>Baseline Clinical Profile</SectionTitle>
                    <p style={{ fontSize: '10px', color: '#64748b', marginBottom: '14px', marginTop: '-8px' }}>Assessment Date: {REPORT.treatmentStart}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '20px' }}>
                        {[
                            { label: 'PHQ-9', value: REPORT.baseline.phq9, severity: phq9Severity(REPORT.baseline.phq9), color: '#ef4444' },
                            { label: 'GAD-7', value: REPORT.baseline.gad7, severity: 'Severe', color: '#f97316' },
                            { label: 'PCL-5', value: REPORT.baseline.pcl5, severity: 'Significant', color: '#f59e0b' },
                            { label: 'ACE Score', value: REPORT.baseline.ace, severity: 'High Risk', color: '#8b5cf6' },
                            { label: 'HRV (ms)', value: REPORT.baseline.hrv, severity: 'Low', color: '#64748b' },
                        ].map((item, i) => (
                            <div key={i} style={{ padding: '12px', backgroundColor: '#fafafa', border: `2px solid ${item.color}30`, borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 900, color: item.color }}>{item.value}</div>
                                <div style={{ fontSize: '9px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '3px' }}>{item.label}</div>
                                <div style={{ fontSize: '9px', color: item.color, marginTop: '2px', fontWeight: 600 }}>{item.severity}</div>
                            </div>
                        ))}
                    </div>

                    {/* Comparison table */}
                    <SectionTitle>Outcomes: Baseline vs. 6-Month Follow-Up</SectionTitle>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginBottom: '20px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
                                {['Measure', 'Baseline', 'Severity', '6-Month', 'Severity', 'Change', 'Improvement'].map(h => (
                                    <th key={h} style={{ padding: '8px 10px', textAlign: 'center', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { measure: 'PHQ-9 (Depression)', baseline: REPORT.baseline.phq9, followup: REPORT.followup.phq9, baselineSev: phq9Severity(REPORT.baseline.phq9), followupSev: phq9Severity(REPORT.followup.phq9) },
                                { measure: 'GAD-7 (Anxiety)', baseline: REPORT.baseline.gad7, followup: REPORT.followup.gad7, baselineSev: 'Severe', followupSev: 'Minimal' },
                                { measure: 'PCL-5 (PTSD)', baseline: REPORT.baseline.pcl5, followup: REPORT.followup.pcl5, baselineSev: 'Significant', followupSev: 'Sub-threshold' },
                                { measure: 'HRV (ms)', baseline: REPORT.baseline.hrv, followup: REPORT.followup.hrv, baselineSev: 'Low', followupSev: 'Improved' },
                            ].map((row, i) => {
                                const chg = row.followup - row.baseline;
                                const pct = Math.abs(Math.round((chg / row.baseline) * 100));
                                const isImproved = chg < 0 || (row.measure.includes('HRV') && chg > 0);
                                return (
                                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#f8fafc' : 'white', borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '8px 10px', fontWeight: 600, color: '#1e293b' }}>{row.measure}</td>
                                        <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#ef4444' }}>{row.baseline}</td>
                                        <td style={{ padding: '8px 10px', textAlign: 'center', fontSize: '9px', color: '#64748b' }}>{row.baselineSev}</td>
                                        <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#10b981' }}>{row.followup}</td>
                                        <td style={{ padding: '8px 10px', textAlign: 'center', fontSize: '9px', color: '#64748b' }}>{row.followupSev}</td>
                                        <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: isImproved ? '#10b981' : '#ef4444' }}>{chg > 0 ? '+' : ''}{chg}</td>
                                        <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                                            <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, backgroundColor: isImproved ? '#dcfce7' : '#fee2e2', color: isImproved ? '#16a34a' : '#dc2626' }}>
                                                {isImproved ? '▼' : '▲'} {pct}%
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* PHQ-9 trajectory chart */}
                    <SectionTitle>PHQ-9 Symptom Trajectory</SectionTitle>
                    <p style={{ fontSize: '10px', color: '#64748b', margin: '-8px 0 10px' }}>PHQ-9 scores across 6-month treatment period. Green dashed line = remission threshold (&lt;5).</p>
                    <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', border: '1px solid #e2e8f0' }}>
                        <PHQ9Chart />
                    </div>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '8px', justifyContent: 'center' }}>
                        {[
                            { color: '#3b82f6', label: 'PHQ-9 Score', type: 'line' },
                            { color: '#10b981', label: 'Final score (8 — Mild)', type: 'dot' },
                            { color: '#22c55e', label: 'Remission threshold', type: 'dashed' },
                        ].map((l, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', color: '#475569' }}>
                                <div style={{ width: '16px', height: '3px', backgroundColor: l.color, borderRadius: '2px' }} />
                                {l.label}
                            </div>
                        ))}
                    </div>
                </PageShell>

                {/* ══════════════════════════════════════════════════════════
                    PAGE 3 — DOSING SESSIONS
                ══════════════════════════════════════════════════════════ */}
                <PageShell pageNum={3} total={4}>
                    <SectionTitle>Dosing Session Summary</SectionTitle>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginBottom: '24px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
                                {['#', 'Date', 'Substance & Dose', 'Duration', 'Vitals Logged', 'MEQ-30', 'Adverse Events'].map(h => (
                                    <th key={h} style={{ padding: '8px 10px', textAlign: 'center', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {REPORT.sessions.map((s, i) => (
                                <tr key={s.id} style={{ backgroundColor: i % 2 === 0 ? '#f8fafc' : 'white', borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '10px', textAlign: 'center', fontWeight: 900, color: '#3b82f6' }}>{s.id}</td>
                                    <td style={{ padding: '10px', textAlign: 'center', fontWeight: 600 }}>{s.date}</td>
                                    <td style={{ padding: '10px', textAlign: 'center', color: '#475569' }}>{s.dose}</td>
                                    <td style={{ padding: '10px', textAlign: 'center' }}>{s.duration}</td>
                                    <td style={{ padding: '10px', textAlign: 'center', fontWeight: 700 }}>{s.vitals}</td>
                                    <td style={{ padding: '10px', textAlign: 'center' }}>
                                        <span style={{ fontWeight: 900, color: s.meq30 >= 75 ? '#8b5cf6' : '#3b82f6' }}>{s.meq30}</span>
                                        <span style={{ fontSize: '9px', color: '#94a3b8' }}>/100</span>
                                    </td>
                                    <td style={{ padding: '10px', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: '4px', fontSize: '9px', fontWeight: 700,
                                            backgroundColor: s.ae > 0 ? '#fef3c7' : '#dcfce7',
                                            color: s.ae > 0 ? '#92400e' : '#166534'
                                        }}>
                                            {s.ae > 0 ? `${s.ae} · Mild (G1)` : 'None'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Vitals chart */}
                    <SectionTitle>Session 1 Vitals — Aug 3, 2025</SectionTitle>
                    <p style={{ fontSize: '10px', color: '#64748b', margin: '-8px 0 10px' }}>Heart rate (red) and systolic blood pressure (dashed purple) across 7.5-hour session.</p>
                    <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', border: '1px solid #e2e8f0', marginBottom: '10px' }}>
                        <VitalsChart />
                    </div>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', color: '#475569' }}>
                            <div style={{ width: '16px', height: '3px', backgroundColor: '#ef4444' }} />Heart Rate (bpm)
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', color: '#475569' }}>
                            <div style={{ width: '16px', height: '2px', backgroundColor: '#8b5cf6', borderTop: '2px dashed #8b5cf6' }} />Systolic BP (mmHg)
                        </div>
                    </div>

                    {/* MEQ-30 narrative */}
                    <SectionTitle accent="#8b5cf6">MEQ-30 Mystical Experience Scores</SectionTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {REPORT.sessions.map(s => (
                            <div key={s.id} style={{ padding: '14px', backgroundColor: '#faf5ff', border: '1px solid #ddd6fe', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '9px', color: '#7c3aed', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Session {s.id}</div>
                                <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '6px' }}>{s.date}</div>
                                <div style={{ fontSize: '32px', fontWeight: 900, color: '#7c3aed', lineHeight: 1 }}>{s.meq30}</div>
                                <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px' }}>/ 100</div>
                                <div style={{ marginTop: '8px', height: '4px', backgroundColor: '#ede9fe', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${s.meq30}%`, backgroundColor: s.meq30 >= 80 ? '#7c3aed' : '#a78bfa', borderRadius: '2px' }} />
                                </div>
                                <div style={{ fontSize: '9px', color: '#7c3aed', marginTop: '4px', fontWeight: 600 }}>
                                    {s.meq30 >= 80 ? 'Complete mystical experience' : s.meq30 >= 60 ? 'Moderate experience' : 'Partial experience'}
                                </div>
                            </div>
                        ))}
                    </div>
                </PageShell>

                {/* ══════════════════════════════════════════════════════════
                    PAGE 4 — INTEGRATION + BENCHMARKING
                ══════════════════════════════════════════════════════════ */}
                <PageShell pageNum={4} total={4}>
                    <SectionTitle>Integration Phase Overview</SectionTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
                        <MetricCell label="Sessions Attended" value={`${REPORT.integration.attended}/${REPORT.integration.scheduled}`} sub={`${integPct}% compliance`} accent="#3b82f6" />
                        <MetricCell label="Pulse Check Days" value={`${REPORT.integration.pulseCheckDays}`} sub={`of ${REPORT.integration.pulseTotal} days`} accent="#f59e0b" />
                        <MetricCell label="Behavioral Changes" value={REPORT.integration.behavioralChanges} sub="Documented" accent="#10b981" />
                        <MetricCell label="Overall Compliance" value={`${Math.round((integPct + pulsePct) / 2)}%`} sub="Avg across measures" accent="#8b5cf6" />
                    </div>

                    {/* Behavioral change categories */}
                    <SectionTitle accent="#10b981">Documented Behavioral Changes</SectionTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '20px' }}>
                        {[
                            { label: 'Sleep Quality', change: 'Significant Improvement', icon: '🌙' },
                            { label: 'Substance Use Reduction', change: 'Moderate Reduction', icon: '🔴' },
                            { label: 'Social Connection', change: 'Marked Improvement', icon: '👥' },
                            { label: 'Physical Activity', change: 'Moderate Increase', icon: '🏃' },
                            { label: 'Mindfulness Practice', change: 'Newly Established', icon: '🧘' },
                            { label: 'Emotional Regulation', change: 'Significant Improvement', icon: '💚' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px' }}>
                                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                                <div>
                                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#1e293b' }}>{item.label}</div>
                                    <div style={{ fontSize: '9px', color: '#16a34a' }}>{item.change}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Benchmarking */}
                    <SectionTitle accent="#3b82f6">Network Benchmarking</SectionTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px', marginBottom: '20px', alignItems: 'start' }}>
                        <div>
                            <RadarChart />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#475569' }}>
                                    <div style={{ width: '12px', height: '3px', backgroundColor: '#3b82f6', borderRadius: '2px' }} />This Practice
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#475569' }}>
                                    <div style={{ width: '12px', height: '3px', backgroundColor: '#94a3b8', borderRadius: '2px' }} />Network Average (840+ sites)
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {[
                                { label: 'Safety Score', clinic: 92, network: 74 },
                                { label: 'Retention Rate', clinic: 85, network: 68 },
                                { label: 'Efficacy Index', clinic: 88, network: 72 },
                                { label: 'Adherence', clinic: 94, network: 69 },
                                { label: 'Data Quality', clinic: 96, network: 71 },
                                { label: 'Protocol Compliance', clinic: 90, network: 65 },
                            ].map((item, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                        <span style={{ fontSize: '10px', fontWeight: 600, color: '#1e293b' }}>{item.label}</span>
                                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#3b82f6' }}>{item.clinic} <span style={{ color: '#94a3b8', fontWeight: 400 }}>vs {item.network} avg</span></span>
                                    </div>
                                    <div style={{ position: 'relative', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${item.network}%`, backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
                                        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${item.clinic}%`, backgroundColor: '#3b82f6', borderRadius: '4px', opacity: 0.8 }} />
                                    </div>
                                </div>
                            ))}
                            <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px' }}>
                                <div style={{ fontSize: '20px', fontWeight: 900, color: '#1d4ed8' }}>{REPORT.benchmarkPercentile}th</div>
                                <div style={{ fontSize: '9px', color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Network Percentile</div>
                                <div style={{ fontSize: '9px', color: '#64748b', marginTop: '3px' }}>Based on 840+ sites worldwide</div>
                            </div>
                        </div>
                    </div>

                    {/* Certification block */}
                    <div style={{ backgroundColor: '#1e3a5f', borderRadius: '8px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                        <div>
                            <div style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Report Certification</div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)' }}>
                                This report was generated by PPN Research Portal on {REPORT.exportDate}. All data has been verified against the source record.
                                Export logged under audit trail <span style={{ fontFamily: 'monospace', color: '#93c5fd' }}>{REPORT.reportId}</span>.
                            </div>
                        </div>
                        <div style={{ textAlign: 'center', flexShrink: 0, marginLeft: '20px' }}>
                            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Clinician of Record</div>
                            <div style={{ fontSize: '11px', fontWeight: 700 }}>{REPORT.clinician}</div>
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.3)', marginTop: '16px', paddingTop: '4px', fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>Signature on file</div>
                        </div>
                    </div>
                </PageShell>

            </div>
        </div>
    );
};

// ─── Print CSS constant (defined after component so it can reference REPORT) ──
const PRINT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
@media print {
  @page { size: A4; margin: 0; }
  body, html { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .pdf-page { page-break-after: always; page-break-inside: avoid; box-shadow: none !important; margin-bottom: 0 !important; }
  .pdf-page:last-child { page-break-after: auto; }
  .no-print { display: none !important; }
}
`;

export default ClinicalReportPDF;
