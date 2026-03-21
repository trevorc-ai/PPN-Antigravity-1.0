/**
 * ResearchReportPDF.tsx — WO-643-F
 * Research Outcomes Export — De-Identified Aggregate Data, IRB-Ready
 *
 * Route: /research-report-pdf
 *
 * ppn-ui-standards Rule 5 compliant.
 * Zero PHI — aggregated cohort data only. No patient-level records.
 */

import React, { useEffect } from 'react';
import { Printer, BarChart2, Globe } from 'lucide-react';
import { PDFPageShell, PDF_PRINT_CSS } from '../components/pdf/PDFPageShell';
import { PDFSectionTitle } from '../components/pdf/PDFSectionTitle';
import { PDFMetricCell } from '../components/pdf/PDFMetricCell';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface OutcomeMetric { measure: string; baseline: number; final: number; responderRate: string; }
interface AgeGroup { label: string; count: number; }
interface DiagGroup { label: string; count: number; }
interface RadarAxis { name: string; cohort: number; network: number; }

interface ResearchReportData {
    reportId: string; exportDate: string; isPreview: boolean;
    cohortSize: number; dateRange: string; substanceFilter: string;
    exportAuditId: string;
    ageDistribution: AgeGroup[];
    diagnosisDistribution: DiagGroup[];
    outcomeMetrics: OutcomeMetric[];
    radarAxes: RadarAxis[];
    totalAEs: number; grade3Plus: number; chemicalRescue: number;
    schemaVersion: string; collectionStart: string; collectionEnd: string;
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

const DEMO: ResearchReportData = {
    reportId: 'RES-2026Q1-PSIL', exportDate: 'March 20, 2026', isPreview: true,
    cohortSize: 42, dateRange: 'Jan-Mar 2026', substanceFilter: 'Psilocybin',
    exportAuditId: 'EXP-20260320-IRB-001',
    ageDistribution: [
        { label: '18-29', count: 6 }, { label: '30-39', count: 14 }, { label: '40-49', count: 12 },
        { label: '50-59', count: 7 }, { label: '60+', count: 3 },
    ],
    diagnosisDistribution: [
        { label: 'MDD', count: 18 }, { label: 'PTSD', count: 12 }, { label: 'Anxiety', count: 8 }, { label: 'Other', count: 4 },
    ],
    outcomeMetrics: [
        { measure: 'PHQ-9', baseline: 18.4, final: 9.2, responderRate: '71%' },
        { measure: 'GAD-7', baseline: 15.1, final: 7.8, responderRate: '68%' },
        { measure: 'CAPS-5', baseline: 52.3, final: 31.4, responderRate: '58%' },
    ],
    radarAxes: [
        { name: 'Safety', cohort: 88, network: 82 },
        { name: 'Retention', cohort: 94, network: 85 },
        { name: 'Efficacy', cohort: 79, network: 71 },
        { name: 'Adherence', cohort: 91, network: 80 },
        { name: 'Data Quality', cohort: 96, network: 89 },
        { name: 'Compliance', cohort: 100, network: 94 },
    ],
    totalAEs: 7, grade3Plus: 1, chemicalRescue: 2,
    schemaVersion: 'PPN Portal v2.2', collectionStart: 'January 2, 2026', collectionEnd: 'March 15, 2026',
};

// ─── Bar Chart SVG ────────────────────────────────────────────────────────────

const BarChartSVG: React.FC<{ data: { label: string; count: number }[]; title: string; color: string }> = ({ data, title, color }) => {
    const maxVal = Math.max(...data.map(d => d.count));
    const W = 240, H = 80, barW = (W - 20) / data.length - 6;
    return (
        <div style={{ flex: 1 }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{title}</div>
            <svg viewBox={`0 0 ${W} ${H + 20}`} width="100%">
                {data.map((d, i) => {
                    const h = (d.count / maxVal) * H;
                    const x = 10 + i * (barW + 6);
                    const y = H - h;
                    return (
                        <g key={d.label}>
                            <rect x={x} y={y} width={barW} height={h} fill={color} rx={2} />
                            <text x={x + barW / 2} y={y - 3} textAnchor="middle" fontSize="8" fill="#475569" fontFamily="Inter, sans-serif" fontWeight="700">{d.count}</text>
                            <text x={x + barW / 2} y={H + 12} textAnchor="middle" fontSize="7" fill="#94a3b8" fontFamily="Inter, sans-serif">{d.label}</text>
                        </g>
                    );
                })}
                <line x1={10} y1={H} x2={W - 10} y2={H} stroke="#e2e8f0" strokeWidth={1} />
            </svg>
        </div>
    );
};

// ─── Radar Chart SVG ─────────────────────────────────────────────────────────

const RadarChartSVG: React.FC<{ axes: RadarAxis[] }> = ({ axes }) => {
    const N = axes.length, CX = 140, CY = 120, R = 90;
    const toXY = (val: number, idx: number) => {
        const angle = (Math.PI * 2 * idx) / N - Math.PI / 2;
        const r = (val / 100) * R;
        return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
    };
    const labelXY = (idx: number) => {
        const angle = (Math.PI * 2 * idx) / N - Math.PI / 2;
        const r = R + 16;
        return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
    };
    const cohortPath = axes.map((a, i) => { const p = toXY(a.cohort, i); return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`; }).join(' ') + ' Z';
    const networkPath = axes.map((a, i) => { const p = toXY(a.network, i); return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`; }).join(' ') + ' Z';
    const gridLevels = [25, 50, 75, 100];
    return (
        <svg viewBox="0 0 280 260" width="280">
            {/* Grid rings */}
            {gridLevels.map(level => (
                <polygon key={level} fill="none" stroke="#f1f5f9" strokeWidth={1}
                    points={axes.map((_, i) => { const p = toXY(level, i); return `${p.x},${p.y}`; }).join(' ')} />
            ))}
            {/* Spokes */}
            {axes.map((_, i) => { const p = toXY(100, i); return <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="#f1f5f9" strokeWidth={1} />; })}
            {/* Network */}
            <path d={networkPath} fill="rgba(148,163,184,0.15)" stroke="#94a3b8" strokeWidth={1.5} />
            {/* Cohort */}
            <path d={cohortPath} fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth={2} />
            {/* Axis labels */}
            {axes.map((a, i) => {
                const { x, y } = labelXY(i);
                return <text key={i} x={x} y={y + 4} textAnchor="middle" fontSize="9" fill="#475569" fontWeight="700" fontFamily="Inter, sans-serif">{a.name}</text>;
            })}
            {/* Legend */}
            <rect x={8} y={228} width={10} height={10} fill="rgba(59,130,246,0.3)" stroke="#3b82f6" strokeWidth={1} rx={2} />
            <text x={22} y={237} fontSize="9" fill="#475569" fontFamily="Inter, sans-serif">This Cohort</text>
            <rect x={90} y={228} width={10} height={10} fill="rgba(148,163,184,0.3)" stroke="#94a3b8" strokeWidth={1} rx={2} />
            <text x={104} y={237} fontSize="9" fill="#475569" fontFamily="Inter, sans-serif">Network Avg</text>
        </svg>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ResearchReportPDF: React.FC = () => {
    const d = DEMO;
    const TABLE_TH: React.CSSProperties = { backgroundColor: '#ede9ff', color: '#3730a3', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '7px 10px', textAlign: 'left' };
    const TABLE_TD: React.CSSProperties = { fontSize: '12px', padding: '7px 10px', color: '#1e293b', verticalAlign: 'top', borderBottom: '1px solid #f1f5f9' };

    useEffect(() => { document.title = `Research Export — ${d.reportId} — PPN Portal`; }, [d.reportId]);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: PDF_PRINT_CSS }} />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet" />
            <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <BarChart2 size={18} color="#6366f1" />
                    <span style={{ color: '#f8fafc', fontSize: '14px', fontWeight: 700 }}>Research Outcomes Export — {d.reportId}</span>
                    {d.isPreview && <span style={{ backgroundColor: '#f59e0b', color: '#1e293b', fontSize: '10px', fontWeight: 900, padding: '2px 8px', borderRadius: '4px' }}>PREVIEW DATA</span>}
                </div>
                <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }} aria-label="Download PDF">
                    <Printer size={15} /> Download PDF
                </button>
            </div>

            <div style={{ backgroundColor: '#e2e8f0', padding: '32px 24px', minHeight: '100vh', fontFamily: "'Inter', ui-sans-serif, sans-serif" }}>
                {/* Page 1 */}
                <PDFPageShell reportType="Research Outcomes Export" reportId={d.reportId} pageNum={1} total={2} exportDate={d.exportDate}
                    hipaaLine="De-identified per 21 CFR Part 11 · IRB-ready export · PPN Portal v2.2">
                    <div style={{ borderLeft: '5px solid #1e3a5f', paddingLeft: '14px', marginBottom: '16px' }}>
                        <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#1e3a5f', margin: '0 0 4px' }}>RESEARCH OUTCOMES EXPORT</h1>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>De-Identified Aggregate Data · {d.substanceFilter} Cohort · {d.dateRange}</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '4px' }}>
                        <PDFMetricCell label="Cohort Size" value={d.cohortSize} accent="#3b82f6" sub="subjects" />
                        <PDFMetricCell label="Date Range" value={d.dateRange} accent="#6366f1" />
                        <PDFMetricCell label="Substance" value={d.substanceFilter} accent="#10b981" />
                    </div>

                    <PDFSectionTitle accent="#3b82f6">Demographic Summary</PDFSectionTitle>
                    <div style={{ display: 'flex', gap: '24px', padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                        <BarChartSVG data={d.ageDistribution} title="Age Distribution" color="#93c5fd" />
                        <div style={{ width: '1px', backgroundColor: '#e2e8f0' }} />
                        <BarChartSVG data={d.diagnosisDistribution} title="Diagnosis Distribution" color="#5eead4" />
                    </div>

                    <PDFSectionTitle accent="#10b981">Outcome Metrics</PDFSectionTitle>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr>
                            {['Measure', 'Baseline Mean', 'Final Mean', 'Avg Change', 'Responder Rate'].map(h => <th key={h} style={TABLE_TH}>{h}</th>)}
                        </tr></thead>
                        <tbody>
                            {d.outcomeMetrics.map((m, i) => {
                                const change = m.final - m.baseline;
                                return (
                                    <tr key={m.measure} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                                        <td style={{ ...TABLE_TD, fontWeight: 700 }}>{m.measure}</td>
                                        <td style={TABLE_TD}>{m.baseline.toFixed(1)}</td>
                                        <td style={TABLE_TD}>{m.final.toFixed(1)}</td>
                                        <td style={{ ...TABLE_TD, color: change < 0 ? '#065f46' : '#991b1b', fontWeight: 700 }}>
                                            {change > 0 ? '+' : ''}{change.toFixed(1)} ({Math.round((change / m.baseline) * 100)}%)
                                        </td>
                                        <td style={{ ...TABLE_TD, fontWeight: 700, color: '#3b82f6' }}>{m.responderRate}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </PDFPageShell>

                {/* Page 2 */}
                <PDFPageShell reportType="Research Outcomes Export" reportId={d.reportId} pageNum={2} total={2} exportDate={d.exportDate}
                    hipaaLine="De-identified per 21 CFR Part 11 · IRB-ready export · PPN Portal v2.2">
                    <PDFSectionTitle accent="#6366f1" marginTop={0}>Network Benchmark</PDFSectionTitle>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                        <RadarChartSVG axes={d.radarAxes} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Cohort vs Network</div>
                            {d.radarAxes.map(a => (
                                <div key={a.name} style={{ marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                        <span style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>{a.name}</span>
                                        <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 700 }}>{a.cohort} <span style={{ color: '#94a3b8', fontWeight: 400 }}>vs {a.network}</span></span>
                                    </div>
                                    <div style={{ height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}>
                                        <div style={{ height: '100%', width: `${a.cohort}%`, backgroundColor: '#3b82f6', borderRadius: '2px' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <PDFSectionTitle accent="#ef4444">Adverse Event Summary</PDFSectionTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        <PDFMetricCell label="Total AEs" value={d.totalAEs} accent="#f59e0b" />
                        <PDFMetricCell label="Grade 3+" value={d.grade3Plus} accent="#ef4444" sub="regulatory threshold" />
                        <PDFMetricCell label="Chemical Rescue" value={d.chemicalRescue} accent="#6366f1" />
                    </div>

                    <PDFSectionTitle accent="#94a3b8">Data Provenance</PDFSectionTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {[
                            ['Collection Start', d.collectionStart], ['Collection End', d.collectionEnd],
                            ['Schema Version', d.schemaVersion], ['Export Audit ID', d.exportAuditId],
                        ].map(([k, v]) => (
                            <div key={k} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 10px' }}>
                                <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
                                <div style={{ fontSize: '11px', color: '#1e293b', marginTop: '3px', fontFamily: (k as string).includes('ID') ? "'Roboto Mono', monospace" : undefined }}>{v}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '14px', padding: '10px 12px', backgroundColor: '#eff6ff', borderRadius: '6px', border: '1px solid #bfdbfe', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Globe size={14} color="#1e40af" />
                        <span style={{ fontSize: '10px', color: '#1e40af' }}>
                            All data de-identified per HIPAA Safe Harbor. No patient-level records included. IRB-ready export. Zero PHI.
                        </span>
                    </div>
                </PDFPageShell>
            </div>
        </>
    );
};

export default ResearchReportPDF;
