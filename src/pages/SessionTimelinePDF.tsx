/**
 * SessionTimelinePDF.tsx — WO-643-C
 * Session Timeline PDF Export — Chronological Event Record
 *
 * Route: /session-timeline-pdf?sessionId=
 *
 * ppn-ui-standards Rule 5 compliant. Zero PHI.
 */

import React, { useEffect } from 'react';
import { AlertTriangle, Printer, Clock, Activity, Zap, FileText } from 'lucide-react';
import { PDFPageShell, PDF_PRINT_CSS } from '../components/pdf/PDFPageShell';
import { PDFSectionTitle } from '../components/pdf/PDFSectionTitle';

// ─── Types ─────────────────────────────────────────────────────────────────────

type EventType = 'intake_completed' | 'dose_admin' | 'patient_observation' | 'vital_check' | 'safety_event' | 'clinical_decision' | 'general_note' | 'session_completed';

interface SessionEvent {
    time: string;
    type: EventType;
    description: string;
    flagged?: boolean;
}

interface VitalReading { time: string; hr: number; sbp: number; dbp: number; }

interface SessionTimelineData {
    reportId: string; sessionId: string; sessionDate: string;
    substance: string; dose: string; doseAdminTime: string;
    clinicianId: string; exportDate: string; isPreview: boolean;
    events: SessionEvent[];
    vitals: VitalReading[];
    sessionDurationHours: number;
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

const DEMO: SessionTimelineData = {
    reportId: 'STL-20260319-A1B2', sessionId: 'SES-20260319-B2A4',
    sessionDate: 'March 19, 2026', substance: 'Psilocybin', dose: '25mg',
    doseAdminTime: '09:48', clinicianId: 'CLN-0042',
    exportDate: 'March 20, 2026', isPreview: true,
    sessionDurationHours: 7,
    events: [
        { time: '09:00', type: 'intake_completed', description: 'Pre-session intake completed. Vitals baseline recorded. Consent confirmed.' },
        { time: '09:48', type: 'dose_admin', description: 'Psilocybin 25mg administered orally. Patient comfortable, ambient music initiated.' },
        { time: '10:35', type: 'patient_observation', description: 'Patient reports onset of visual softening and mild warmth. Affect open and receptive.' },
        { time: '11:12', type: 'vital_check', description: 'HR 108 bpm, BP 144/86 mmHg. Within pre-specified monitoring range. No intervention.' },
        { time: '11:50', type: 'patient_observation', description: 'Peak phase. Patient reports intense emotional processing related to childhood experience. Clinician in verbal contact.' },
        { time: '12:35', type: 'safety_event', description: 'AE: Hypertension Grade 2, BP 158/96 mmHg, HR 112 bpm. Intervention protocol initiated.', flagged: true },
        { time: '13:05', type: 'vital_check', description: 'BP normalized: 128/82 mmHg. Patient repositioned and reassured. AE resolved.' },
        { time: '13:40', type: 'clinical_decision', description: 'Extended session monitoring by 30 min per protocol. Patient stable and processing positive material.' },
        { time: '14:45', type: 'patient_observation', description: 'Descent phase. Patient reports sense of clarity and peace. Verbally engaged with integration themes.' },
        { time: '15:45', type: 'general_note', description: 'Patient oriented x3, affect bright and stable. Gait unassisted. Hunger and thirst returned.' },
        { time: '16:30', type: 'vital_check', description: 'Final vitals: HR 74 bpm, BP 122/78 mmHg. Within normal range. Transport checklist complete.' },
        { time: '16:45', type: 'session_completed', description: 'Session closed. Escort present. Post-session care instructions reviewed. Follow-up scheduled.' },
    ],
    vitals: [
        { time: '09:00', hr: 72, sbp: 126, dbp: 80 },
        { time: '10:30', hr: 96, sbp: 138, dbp: 84 },
        { time: '11:12', hr: 108, sbp: 144, dbp: 86 },
        { time: '12:00', hr: 112, sbp: 152, dbp: 92 },
        { time: '12:35', hr: 112, sbp: 158, dbp: 96 },
        { time: '13:05', hr: 96, sbp: 128, dbp: 82 },
        { time: '14:00', hr: 88, sbp: 124, dbp: 80 },
        { time: '15:00', hr: 80, sbp: 122, dbp: 78 },
        { time: '16:30', hr: 74, sbp: 122, dbp: 78 },
    ],
};

// ─── Event Type Config ────────────────────────────────────────────────────────

const eventConfig: Record<EventType, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
    intake_completed:  { label: 'Intake Completed', bg: '#ede9ff', text: '#3730a3', icon: <FileText size={11} /> },
    dose_admin:        { label: 'Dose Admin', bg: '#ede9ff', text: '#3730a3', icon: <Zap size={11} /> },
    patient_observation: { label: 'Observation', bg: '#eff6ff', text: '#1e40af', icon: <Activity size={11} /> },
    vital_check:       { label: 'Vital Check', bg: '#eff6ff', text: '#1e40af', icon: <Activity size={11} /> },
    safety_event:      { label: 'Safety Event', bg: '#fef3c7', text: '#92400e', icon: <AlertTriangle size={11} /> },
    clinical_decision: { label: 'Clinical Decision', bg: '#f0fdf4', text: '#065f46', icon: <FileText size={11} /> },
    general_note:      { label: 'General Note', bg: '#f8fafc', text: '#475569', icon: <FileText size={11} /> },
    session_completed: { label: 'Session Closed', bg: '#f0fdf4', text: '#065f46', icon: <Clock size={11} /> },
};

// ─── PK Chart SVG ─────────────────────────────────────────────────────────────

const PKFlightPlan: React.FC<{ totalHours: number }> = ({ totalHours }) => {
    const W = 620, H = 120;
    const phases = [
        { label: 'ONSET', start: 0, end: 1, color: 'rgba(167,139,250,0.12)', textColor: '#5b21b6' },
        { label: 'PEAK', start: 1, end: 3.5, color: 'rgba(251,191,36,0.12)', textColor: '#92400e' },
        { label: 'INTEGRATION', start: 3.5, end: 5.5, color: 'rgba(20,184,166,0.12)', textColor: '#134e4a' },
        { label: 'AFTERGLOW', start: 5.5, end: totalHours, color: 'rgba(251,113,133,0.12)', textColor: '#881337' },
    ];
    // Psilocybin PK curve approximation
    const curve = [
        [0, 0], [0.75, 15], [1.5, 55], [2, 80], [2.5, 95],
        [3, 92], [3.5, 75], [4.5, 50], [5.5, 28], [6.5, 12], [7, 5],
    ];
    const toX = (h: number) => (h / totalHours) * W;
    const toY = (v: number) => H - 10 - (v / 100) * (H - 25);
    const pathD = curve.map(([h, v], i) => `${i === 0 ? 'M' : 'L'} ${toX(h)} ${toY(v)}`).join(' ');
    return (
        <svg viewBox={`0 0 ${W} ${H + 20}`} width="100%" style={{ display: 'block' }}>
            {/* Phase backgrounds */}
            {phases.map(p => (
                <rect key={p.label} x={toX(p.start)} y={0} width={toX(p.end - p.start)} height={H} fill={p.color} />
            ))}
            {/* Phase labels */}
            {phases.map(p => (
                <text key={p.label} x={toX((p.start + p.end) / 2)} y={14} textAnchor="middle"
                    fill={p.textColor} fontSize="9" fontWeight="700" fontFamily="Inter, sans-serif">{p.label}</text>
            ))}
            {/* Axes */}
            <line x1={0} y1={H} x2={W} y2={H} stroke="#e2e8f0" strokeWidth={1} />
            <line x1={0} y1={0} x2={0} y2={H} stroke="#e2e8f0" strokeWidth={1} />
            {/* Hour ticks */}
            {Array.from({ length: totalHours + 1 }, (_, i) => (
                <g key={i}>
                    <line x1={toX(i)} y1={H} x2={toX(i)} y2={H + 4} stroke="#94a3b8" strokeWidth={0.5} />
                    <text x={toX(i)} y={H + 14} textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="Inter, sans-serif">{i}h</text>
                </g>
            ))}
            {/* Y-axis label */}
            <text x={-5} y={H / 2} textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="Inter, sans-serif"
                transform={`rotate(-90, -5, ${H / 2})`}>Intensity %</text>
            {/* Filled area */}
            <path d={`${pathD} L ${toX(7)} ${toY(0)} L ${toX(0)} ${toY(0)} Z`}
                fill="rgba(59,130,246,0.08)" />
            {/* Curve */}
            <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth={2} strokeLinejoin="round" />
            {/* Safety event dot */}
            <circle cx={toX(2.78)} cy={toY(88)} r={5} fill="#fbbf24" stroke="#92400e" strokeWidth={1.5} />
            <text x={toX(2.78)} y={toY(88) - 9} textAnchor="middle" fill="#92400e" fontSize="8" fontWeight="700" fontFamily="Inter, sans-serif">AE</text>
        </svg>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const SessionTimelinePDF: React.FC = () => {
    const d = DEMO;
    const TABLE_TH: React.CSSProperties = { backgroundColor: '#ede9ff', color: '#3730a3', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '7px 10px', textAlign: 'left' };
    const TABLE_TD: React.CSSProperties = { fontSize: '12px', padding: '7px 10px', color: '#1e293b', verticalAlign: 'top', borderBottom: '1px solid #f1f5f9' };

    useEffect(() => { document.title = `Session Timeline — ${d.reportId} — PPN Portal`; }, [d.reportId]);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: PDF_PRINT_CSS }} />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet" />
            <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Clock size={18} color="#3b82f6" />
                    <span style={{ color: '#f8fafc', fontSize: '14px', fontWeight: 700 }}>Session Timeline — {d.reportId}</span>
                    {d.isPreview && <span style={{ backgroundColor: '#f59e0b', color: '#1e293b', fontSize: '10px', fontWeight: 900, padding: '2px 8px', borderRadius: '4px' }}>PREVIEW DATA</span>}
                </div>
                <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }} aria-label="Download PDF">
                    <Printer size={15} /> Download PDF
                </button>
            </div>

            <div style={{ backgroundColor: '#e2e8f0', padding: '32px 24px', minHeight: '100vh', fontFamily: "'Inter', ui-sans-serif, sans-serif" }}>
                {/* Page 1 — PK Chart */}
                <PDFPageShell reportType="Session Timeline" reportId={d.reportId} pageNum={1} total={2} exportDate={d.exportDate}>
                    <div style={{ borderLeft: '5px solid #1e3a5f', paddingLeft: '14px', marginBottom: '16px' }}>
                        <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#1e3a5f', margin: '0 0 4px' }}>SESSION TIMELINE</h1>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Live Dosing Session — Chronological Event Record</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '4px' }}>
                        {[['Patient ID', d.sessionId.replace('SES', 'SUB')], ['Session Date', d.sessionDate], ['Substance / Dose', `${d.substance} ${d.dose}`]].map(([k, v]) => (
                            <div key={k}><div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div><div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{v}</div></div>
                        ))}
                    </div>
                    <PDFSectionTitle accent="#3b82f6">Pharmacokinetic Flight Plan</PDFSectionTitle>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', backgroundColor: '#ffffff' }}>
                        <PKFlightPlan totalHours={d.sessionDurationHours} />
                    </div>
                    {/* Vitals Snapshot */}
                    <PDFSectionTitle accent="#10b981">Vitals Snapshot</PDFSectionTitle>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr>
                            {['Time', 'HR (bpm)', 'BP Systolic', 'BP Diastolic', 'Status'].map(h => <th key={h} style={TABLE_TH}>{h}</th>)}
                        </tr></thead>
                        <tbody>
                            {d.vitals.map((v, i) => {
                                const flagged = v.sbp >= 158 || v.hr >= 110;
                                return (
                                    <tr key={i} style={{ backgroundColor: flagged ? '#fff7ed' : i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                                        <td style={{ ...TABLE_TD, fontFamily: "'Roboto Mono', monospace", fontSize: '11px' }}>{v.time}</td>
                                        <td style={{ ...TABLE_TD, fontWeight: flagged ? 700 : 400, color: v.hr >= 110 ? '#c2410c' : '#1e293b' }}>{v.hr}</td>
                                        <td style={{ ...TABLE_TD, fontWeight: flagged ? 700 : 400, color: v.sbp >= 158 ? '#c2410c' : '#1e293b' }}>{v.sbp}</td>
                                        <td style={TABLE_TD}>{v.dbp}</td>
                                        <td style={TABLE_TD}>
                                            {flagged
                                                ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 700 }}><AlertTriangle size={10} /> ELEVATED</span>
                                                : <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#f0fdf4', color: '#065f46', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 700 }}>Normal</span>
                                            }
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </PDFPageShell>

                {/* Page 2 — Event Ledger */}
                <PDFPageShell reportType="Session Timeline" reportId={d.reportId} pageNum={2} total={2} exportDate={d.exportDate}>
                    <PDFSectionTitle accent="#f59e0b" marginTop={0}>Event Ledger</PDFSectionTitle>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr>
                            {['Time', 'Event Type', 'Description'].map(h => <th key={h} style={TABLE_TH}>{h}</th>)}
                        </tr></thead>
                        <tbody>
                            {d.events.map((ev, i) => {
                                const cfg = eventConfig[ev.type];
                                return (
                                    <tr key={i} style={{ backgroundColor: ev.flagged ? '#fff7ed' : i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                                        <td style={{ ...TABLE_TD, fontFamily: "'Roboto Mono', monospace", fontSize: '11px', width: '60px', whiteSpace: 'nowrap' }}>{ev.time}</td>
                                        <td style={{ ...TABLE_TD, width: '130px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: cfg.bg, color: cfg.text, padding: '3px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 700 }}>
                                                {cfg.icon} {cfg.label}
                                            </span>
                                        </td>
                                        <td style={{ ...TABLE_TD, fontSize: '11px', lineHeight: 1.5 }}>{ev.description}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </PDFPageShell>
            </div>
        </>
    );
};

export default SessionTimelinePDF;
