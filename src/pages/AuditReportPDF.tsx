/**
 * AuditReportPDF — PPN Audit & Compliance Export
 * Zero-PHI, legally defensible session record for regulators, sponsors, and medical boards.
 *
 * Sections:
 *   Header  — De-identified cryptographic IDs (Subject, Session, Practitioner)
 *   Sect 1  — Pre-Dosing Safety Clearance & Therapeutic Alliance
 *   Sect 2  — Multi-Axis Clinical Event Timeline (inline SVG)
 *   Sect 3  — Structured Administration Log (table)
 *   Sect 4  — Adverse Events & Interventions (table)
 *   Sect 5  — Post-Session Discharge + SHA-256 Cryptographic Seal
 *
 * Pattern: print-CSS + window.print() (same as PatientReportPDF.tsx)
 * No external PDF library required.
 */
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// ─── Print CSS ────────────────────────────────────────────────────────────────
const PRINT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap');

@media print {
  @page { size: LETTER; margin: 14mm 16mm; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: 'Inter', 'Helvetica Neue', sans-serif; }
  .pdf-page { page-break-after: always; page-break-inside: avoid; }
  .pdf-page:last-child { page-break-after: auto; }
  .no-print { display: none !important; }
  .page-header { position: running(header); }
}
`;

// ─── Mock Payload ─────────────────────────────────────────────────────────────
// Shape mirrors the blueprint JSON. Replace with live Supabase query when wired.
const MOCK_PAYLOAD = {
  documentMetadata: {
    reportType: 'PPN Audit & Compliance Export',
    version: '1.0',
    generatedAt: new Date().toISOString(),
  },
  header: {
    subjectId: 'UUID-8F92A-4B1C',
    sessionId: 'HASH-99X-21D',
    practitionerId: 'SYS-NPI-BLINDED-042',
    protocol: {
      snomedCode: '733989009',
      description: 'Psilocybin-assisted psychotherapy protocol',
    },
    sessionDate: 'Relative Day 45 of Protocol',
  },
  section1: {
    primaryIndication: { snomedCode: '370143000', description: 'Major depressive disorder' },
    safetyClearance: {
      contraindicationWashoutConfirmed: true,
      fastingRequirementsMet: true,
      baselineVitalsNormal: true,
    },
    therapeuticAlliance: {
      readinessAssessment: { loincCode: '89204-2', scaleName: 'States of Consciousness Questionnaire (Baseline)' },
      allianceScore: { loincCode: '89205-9', tool: 'Working Alliance Inventory (WAI)', score: 42, maxScore: 50, thresholdMet: true },
    },
  },
  section2: [
    { t: 'T-0:30', hr: 68, bpSys: 115, bpDia: 75, spo2: 99, events: [] },
    { t: 'T+0:00', hr: 70, bpSys: 118, bpDia: 78, spo2: 99, events: ['PRIMARY_DOSE'] },
    { t: 'T+0:30', hr: 78, bpSys: 122, bpDia: 80, spo2: 98, events: [] },
    { t: 'T+1:00', hr: 85, bpSys: 130, bpDia: 85, spo2: 98, events: [] },
    { t: 'T+1:30', hr: 90, bpSys: 135, bpDia: 88, spo2: 98, events: [] },
    { t: 'T+1:45', hr: 115, bpSys: 145, bpDia: 92, spo2: 97, events: ['AE_TACHYCARDIA'] },
    { t: 'T+1:55', hr: 110, bpSys: 140, bpDia: 90, spo2: 98, events: ['RESCUE_BREATHING'] },
    { t: 'T+2:10', hr: 120, bpSys: 150, bpDia: 95, spo2: 98, events: ['AE_ANXIETY', 'RESCUE_LORAZEPAM'] },
    { t: 'T+2:30', hr: 88, bpSys: 125, bpDia: 82, spo2: 98, events: ['AE_RESOLUTION'] },
    { t: 'T+4:00', hr: 72, bpSys: 118, bpDia: 76, spo2: 99, events: ['DISCHARGE_MET'] },
  ],
  section3: [
    {
      relativeTime: 'T+0:00',
      action: 'Primary Dose',
      agent: { rxNorm: '1306197', description: 'Psilocybin' },
      dose: 25, unit: 'mg',
      route: { snomedCode: '26643006', description: 'Oral route' },
    },
  ],
  section4: [
    {
      eventTime: 'T+1:45',
      medDra: { code: '10041144', term: 'Tachycardia' },
      severity: 'Moderate',
      intervention: { type: 'SNOMED', code: '226060000', description: 'Guided breathing — stress management' },
      resolutionTime: 'T+1:55',
    },
    {
      eventTime: 'T+2:10',
      medDra: { code: '10002855', term: 'Anxiety' },
      severity: 'Severe',
      intervention: { type: 'RxNorm', code: '6130', description: 'Lorazepam 1mg — PO' },
      resolutionTime: 'T+2:30',
    },
  ],
  section5: {
    dischargeCriteria: {
      hemodynamicsReturnedToBaseline: true,
      independentAmbulationConfirmed: true,
      escortOrDriverPresent: true,
    },
    postSessionPsychometrics: { loincCode: '89206-7', scaleName: 'Post-Session Integration Readiness' },
    digitalSignature: {
      status: 'Signed & Locked',
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
  },
};

// ─── Colour tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#ffffff',
  navy: '#0f172a',
  ink: '#1e293b',
  sub: '#475569',
  muted: '#94a3b8',
  border: '#e2e8f0',
  headerBg: '#f8fafc',
  accent: '#1d4ed8',
  green: '#15803d',
  greenBg: '#f0fdf4',
  greenBorder: '#bbf7d0',
  red: '#dc2626',
  redBg: '#fef2f2',
  redBorder: '#fecaca',
  blue: '#2563eb',
  blueBg: '#eff6ff',
  blueBorder: '#bfdbfe',
  amber: '#d97706',
  amberBg: '#fffbeb',
  mono: "'JetBrains Mono', 'Courier New', monospace",
  sans: "'Inter', 'Helvetica Neue', sans-serif",
};

// ─── Page Shell ───────────────────────────────────────────────────────────────
const PageShell: React.FC<{
  children: React.ReactNode;
  header: typeof MOCK_PAYLOAD['header'];
  meta: typeof MOCK_PAYLOAD['documentMetadata'];
  pageNum: number;
  totalPages: number;
}> = ({ children, header, meta, pageNum, totalPages }) => (
  <div className="pdf-page" style={{
    width: '216mm', minHeight: '279mm', backgroundColor: C.bg,
    fontFamily: C.sans, color: C.ink,
    position: 'relative',
    boxShadow: '0 4px 40px rgba(0,0,0,0.18)', marginBottom: '28px',
    display: 'flex', flexDirection: 'column',
    border: `1px solid ${C.border}`,
  }}>
    {/* Top accent bar */}
    <div style={{ height: '5px', background: 'linear-gradient(90deg,#1d4ed8 0%,#0ea5e9 50%,#7c3aed 100%)' }} />

    {/* Repeating document header */}
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 24px 9px', borderBottom: `1.5px solid ${C.navy}`,
      backgroundColor: C.navy,
    }}>
      <div>
        <div style={{ fontSize: '11px', fontWeight: 900, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {meta.reportType}
        </div>
        <div style={{ fontSize: '8px', color: '#94a3b8', marginTop: '1px', letterSpacing: '0.06em' }}>
          {header.protocol.description}
          <span style={{ marginLeft: '8px', color: '#64748b' }}>SNOMED: {header.protocol.snomedCode}</span>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '8px', color: '#94a3b8', fontFamily: C.mono }}>
          SUBJECT: <span style={{ color: '#e2e8f0', fontWeight: 700 }}>{header.subjectId}</span>
        </div>
        <div style={{ fontSize: '8px', color: '#94a3b8', fontFamily: C.mono }}>
          SESSION: <span style={{ color: '#e2e8f0', fontWeight: 700 }}>{header.sessionId}</span>
        </div>
        <div style={{ fontSize: '8px', color: '#64748b', marginTop: '1px' }}>
          {header.sessionDate} · Page {pageNum} of {totalPages}
        </div>
      </div>
    </div>

    {/* Content */}
    <div style={{ flex: 1, padding: '20px 24px' }}>{children}</div>

    {/* Footer */}
    <div style={{
      borderTop: `1px solid ${C.border}`, padding: '7px 24px',
      backgroundColor: C.headerBg,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span style={{ fontSize: '7.5px', color: C.muted }}>
        PPN Zero-PHI System v{meta.version} · Generated {meta.generatedAt}
      </span>
      <span style={{ fontSize: '7.5px', color: C.muted }}>
        PRACTITIONER: {header.practitionerId} · CONFIDENTIAL — NOT FOR PATIENT USE
      </span>
    </div>
  </div>
);

// ─── Section Heading ──────────────────────────────────────────────────────────
const SectionHeading: React.FC<{ num: string; title: string; color?: string }> = ({ num, title, color = C.accent }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
    <div style={{
      width: '26px', height: '26px', borderRadius: '6px',
      backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{ color: '#fff', fontSize: '11px', fontWeight: 900 }}>{num}</span>
    </div>
    <h2 style={{ fontSize: '11px', fontWeight: 900, color: C.ink, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
      {title}
    </h2>
    <div style={{ flex: 1, height: '1px', backgroundColor: C.border }} />
  </div>
);

// ─── Boolean Badge ────────────────────────────────────────────────────────────
const BoolBadge: React.FC<{ value: boolean; label: string }> = ({ value, label }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '5px 10px', borderRadius: '6px',
    backgroundColor: value ? C.greenBg : C.redBg,
    border: `1px solid ${value ? C.greenBorder : C.redBorder}`,
    marginBottom: '6px',
  }}>
    <div style={{
      width: '14px', height: '14px', borderRadius: '3px', flexShrink: 0,
      backgroundColor: value ? C.green : C.red,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ color: '#fff', fontSize: '9px', fontWeight: 900 }}>
        {value ? '✓' : '✗'}
      </span>
    </div>
    <span style={{ fontSize: '10px', color: C.ink, fontWeight: 600 }}>{label}</span>
    <span style={{
      marginLeft: 'auto', fontSize: '9px', fontWeight: 900,
      color: value ? C.green : C.red, textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>
      {value ? 'Confirmed' : 'Not Met'}
    </span>
  </div>
);


// ─── Clinical Event Timeline (Inline SVG + HTML key table) ────────────────────
const ClinicalTimelineChart: React.FC<{ data: typeof MOCK_PAYLOAD['section2'] }> = ({ data }) => {
  const W = 520;
  const H = 210;
  const pad = { l: 52, r: 32, t: 26, b: 38 };
  const chartW = W - pad.l - pad.r;
  const chartH = H - pad.t - pad.b;

  const hrMin = 40; const hrMax = 180;
  const bpMin = 60; const bpMax = 180;

  const xScale = (i: number) => pad.l + (i / (data.length - 1)) * chartW;
  const hrY = (v: number) => pad.t + chartH - ((v - hrMin) / (hrMax - hrMin)) * chartH;
  const bpY = (v: number) => pad.t + chartH - ((v - bpMin) / (bpMax - bpMin)) * chartH;

  const hrPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i).toFixed(1)},${hrY(d.hr).toFixed(1)}`).join(' ');
  const bpAreaTop = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i).toFixed(1)},${bpY(d.bpSys).toFixed(1)}`).join(' ');
  const bpAreaBot = [...data].reverse().map((d, i) => `L ${xScale(data.length - 1 - i).toFixed(1)},${bpY(d.bpDia).toFixed(1)}`).join(' ');
  const bpArea = bpAreaTop + ' ' + bpAreaBot + ' Z';
  const hemoTicks = [80, 100, 120, 140, 160];

  // Build ordered event list with callout numbers
  type EventEntry = { num: number; x: number; time: string; color: string; dashArray: string; label: string; };
  const allEvents: EventEntry[] = [];
  let calloutNum = 1;
  data.forEach((d, i) => {
    d.events.forEach((ev) => {
      let color = '#64748b'; let dashArray = '0'; let label = '';
      if (ev === 'PRIMARY_DOSE')         { color = '#15803d'; label = 'Primary Dose'; }
      else if (ev === 'AE_RESOLUTION')   { color = '#15803d'; label = 'AE Resolved'; }
      else if (ev === 'DISCHARGE_MET')   { color = '#15803d'; label = 'Discharge Criteria Met'; }
      else if (ev.startsWith('AE_'))     { color = '#dc2626'; dashArray = '4 3'; label = `AE: ${ev.replace('AE_', '')} `; }
      else if (ev.startsWith('RESCUE_')) { color = '#2563eb'; label = `Rescue: ${ev.replace('RESCUE_', '')}`; }
      if (label) { allEvents.push({ num: calloutNum++, x: xScale(i), time: d.t, color, dashArray, label }); }
    });
  });

  const baseY = pad.t + chartH;

  return (
    <div>
      {/* Chart SVG — 70% width, left-aligned */}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', width: '70%', overflow: 'visible' }}>
        <defs>
          <linearGradient id="hr-grad2" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {hemoTicks.map(tick => (
          <line key={tick} x1={pad.l} x2={pad.l + chartW}
            y1={hrY(tick)} y2={hrY(tick)}
            stroke="#e2e8f0" strokeWidth={0.8} strokeDasharray="3 3" />
        ))}

        {/* Y-axis labels */}
        {hemoTicks.map(tick => (
          <text key={tick} x={pad.l - 5} y={hrY(tick) + 3.5}
            textAnchor="end" fontSize={7} fill="#64748b">{tick}</text>
        ))}
        <text x={12} y={H / 2} textAnchor="middle" fontSize={7} fill="#64748b"
          transform={`rotate(-90,12,${H / 2})`}>bpm / mmHg</text>

        {/* BP systolic dashed line */}
        <path d={bpAreaTop} fill="none" stroke="#6366f1" strokeWidth={1} strokeDasharray="5 3" opacity={0.7} />
        {/* BP diastolic dashed line */}
        {(() => {
          const diaPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i).toFixed(1)},${bpY(d.bpDia).toFixed(1)}`).join(' ');
          return <path d={diaPath} fill="none" stroke="#6366f1" strokeWidth={1} strokeDasharray="2 4" opacity={0.5} />;
        })()}
        <path d={hrPath} fill="none" stroke="url(#hr-grad2)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => (
          <circle key={i} cx={xScale(i)} cy={hrY(d.hr)} r={2.5} fill="#ef4444" stroke="#fff" strokeWidth={0.8} />
        ))}

        {/* Event lines + numbered callout circles */}
        {allEvents.map((ev) => (
          <g key={ev.num}>
            <line x1={ev.x} x2={ev.x} y1={pad.t} y2={baseY}
              stroke={ev.color} strokeWidth={1.5} strokeDasharray={ev.dashArray} opacity={0.8} />
            {/* Callout circle at top of line */}
            <circle cx={ev.x} cy={pad.t - 8} r={7} fill={ev.color} />
            <text x={ev.x} y={pad.t - 4.5} textAnchor="middle"
              fontSize={7} fill="#fff" fontWeight={900} style={{ fontFamily: C.sans }}>
              {ev.num}
            </text>
          </g>
        ))}

        {/* X-axis */}
        {data.map((d, i) => {
          const x = xScale(i);
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={baseY} y2={baseY + 4} stroke="#94a3b8" strokeWidth={1} />
              <text x={x} y={baseY + 12} textAnchor="middle" fontSize={6.5} fill="#475569" fontWeight={600}>{d.t}</text>
            </g>
          );
        })}
        <line x1={pad.l} x2={pad.l} y1={pad.t} y2={baseY} stroke={C.ink} strokeWidth={1} />
        <line x1={pad.l} x2={pad.l + chartW} y1={baseY} y2={baseY} stroke={C.ink} strokeWidth={1} />

        {/* Series legend at bottom */}
        {[
          { color: '#ef4444', label: '── HR (bpm)', dash: '' },
          { color: '#6366f1', label: '▨ BP mmHg', dash: '' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${pad.l + i * 100}, ${H - 5})`}>
            <line x1={0} x2={14} y1={0} y2={0} stroke={item.color} strokeWidth={2} />
            <text x={17} y={3.5} fontSize={6.5} fill="#64748b">{item.label}</text>
          </g>
        ))}
      </svg>

      {/* Event key table — HTML, no length constraint */}
      <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '4px 20px' }}>
        {allEvents.map((ev) => (
          <div key={ev.num} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '8px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '15px', height: '15px', borderRadius: '50%',
              backgroundColor: ev.color, color: '#fff',
              fontWeight: 900, fontSize: '7px', flexShrink: 0,
              fontFamily: C.sans,
            }}>{ev.num}</span>
            <span style={{ color: ev.color, fontWeight: 700, fontFamily: C.sans }}>
              {ev.time}
            </span>
            <span style={{ color: C.ink, fontFamily: C.sans }}>{ev.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Table ────────────────────────────────────────────────────────────────────
const Table: React.FC<{
  headers: string[];
  rows: React.ReactNode[][];
  colWidths: string[];
  accentColor?: string;
}> = ({ headers, rows, colWidths, accentColor = C.navy }) => (
  <div style={{ width: '100%', borderRadius: '6px', overflow: 'hidden', border: `1px solid ${C.border}` }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5px' }}>
      <thead>
        <tr style={{ backgroundColor: accentColor }}>
          {headers.map((h, i) => (
            <th key={i} style={{
              padding: '7px 9px', textAlign: 'left',
              color: '#fff', fontWeight: 900, fontSize: '8px',
              textTransform: 'uppercase', letterSpacing: '0.07em',
              borderRight: i < headers.length - 1 ? '1px solid rgba(255,255,255,0.15)' : 'none',
              width: colWidths[i],
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} style={{ backgroundColor: ri % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: `1px solid ${C.border}` }}>
            {row.map((cell, ci) => (
              <td key={ci} style={{
                padding: '7px 9px', verticalAlign: 'top',
                borderRight: ci < row.length - 1 ? `1px solid ${C.border}` : 'none',
                color: C.ink, lineHeight: 1.5,
              }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Discharge Checkbox ───────────────────────────────────────────────────────
const DischargeCheck: React.FC<{ checked: boolean; label: string }> = ({ checked, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
    <div style={{
      width: '16px', height: '16px', borderRadius: '3px', flexShrink: 0,
      border: `2px solid ${C.navy}`,
      backgroundColor: checked ? C.navy : '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {checked && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 900, lineHeight: 1 }}>✓</span>}
    </div>
    <span style={{ fontSize: '10px', color: C.ink, fontWeight: checked ? 600 : 400 }}>{label}</span>
    {checked && (
      <span style={{
        marginLeft: 'auto', fontSize: '8px', fontWeight: 900,
        color: C.green, textTransform: 'uppercase', letterSpacing: '0.08em',
        padding: '2px 6px', backgroundColor: C.greenBg,
        border: `1px solid ${C.greenBorder}`, borderRadius: '4px',
      }}>VERIFIED</span>
    )}
  </div>
);

// ─── Code Cell ────────────────────────────────────────────────────────────────
const CodeCell: React.FC<{ term: string; code: string; prefix?: string }> = ({ term, code, prefix = 'Code' }) => (
  <div>
    <div style={{ fontWeight: 700, color: C.ink, fontSize: '9.5px' }}>{term}</div>
    <div style={{ fontSize: '7.5px', color: C.muted, fontFamily: C.mono, marginTop: '2px' }}>
      {prefix}: {code}
    </div>
  </div>
);

const SeverityBadge: React.FC<{ level: string }> = ({ level }) => {
  const bg = level === 'Severe' ? '#fef2f2' : level === 'Moderate' ? '#fff7ed' : '#f0fdf4';
  const txt = level === 'Severe' ? C.red : level === 'Moderate' ? '#c2410c' : C.green;
  const bdr = level === 'Severe' ? C.redBorder : level === 'Moderate' ? '#fed7aa' : C.greenBorder;
  return (
    <span style={{
      display: 'inline-block', padding: '2px 7px', borderRadius: '4px',
      fontSize: '8.5px', fontWeight: 900, color: txt,
      backgroundColor: bg, border: `1px solid ${bdr}`, textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>{level}</span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AuditReportPDF: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId') ?? 'PREVIEW';
  const p = MOCK_PAYLOAD;

  // Set a unique document title so the PDF saves with a descriptive filename
  useEffect(() => {
    const prev = document.title;
    const shortId = sessionId.slice(0, 8).toUpperCase();
    document.title = `PPN-Audit-Compliance-Report-${shortId}`;
    return () => { document.title = prev; };
  }, [sessionId]);
  const totalPages = 2;
  const generatedDate = new Date(p.documentMetadata.generatedAt).toLocaleString([], {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  });

  // Hash chunked into 8-char groups for display
  const hashChunked = p.section5.digitalSignature.sha256Hash.match(/.{1,8}/g)?.join(' ') ?? '';

  return (
    <div style={{ backgroundColor: '#0a1628', minHeight: '100vh', padding: '32px 24px', fontFamily: C.sans }}>
      <style>{PRINT_CSS}</style>

      {/* ── Toolbar (no-print) ────────────────────────────────────────────── */}
      <div className="no-print" style={{ maxWidth: '216mm', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ color: '#60a5fa', fontSize: '22px', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
            Audit & Compliance Export
          </h1>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0' }}>
            Zero-PHI · Session {sessionId.slice(0, 12).toUpperCase()}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ padding: '8px 14px', background: 'rgba(30,64,175,0.15)', border: '1px solid rgba(30,64,175,0.4)', borderRadius: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 900, color: '#93c5fd', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              🔒 HIPAA Safe Harbor
            </span>
          </div>
          <button
            onClick={() => window.print()}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
              background: 'linear-gradient(135deg,#1e3a8a,#2563eb)', color: 'white',
              border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: 900,
              cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase',
              boxShadow: '0 4px 20px rgba(37,99,235,0.45)',
            }}
            aria-label="Lock and Download PDF"
          >
            🔒 Lock & Download PDF
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '216mm', margin: '0 auto' }}>

        {/* ════════ PAGE 1 ════════ */}
        <PageShell header={p.header} meta={p.documentMetadata} pageNum={1} totalPages={totalPages}>

          {/* Cover identity block */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px',
            marginBottom: '20px', padding: '14px',
            backgroundColor: '#f1f5f9', borderRadius: '8px',
            border: `1px solid ${C.border}`,
          }}>
            {[
              { label: 'Subject ID', value: p.header.subjectId, mono: true },
              { label: 'Session ID', value: p.header.sessionId, mono: true },
              { label: 'Practitioner ID', value: p.header.practitionerId, mono: true },
              { label: 'Protocol (SNOMED)', value: `${p.header.protocol.description} [${p.header.protocol.snomedCode}]`, mono: false },
              { label: 'Session Date', value: p.header.sessionDate, mono: false },
              { label: 'Generated', value: generatedDate, mono: false },
            ].map((item, i) => (
              <div key={i} style={{ padding: '6px 0' }}>
                <div style={{ fontSize: '7px', fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>{item.label}</div>
                <div style={{ fontSize: '9px', fontWeight: 700, color: C.ink, fontFamily: item.mono ? C.mono : C.sans, wordBreak: 'break-all' }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* ── Section 1 ── */}
          <SectionHeading num="1" title="Pre-Dosing Safety Clearance & Therapeutic Alliance" color={C.accent} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
            {/* Safety clearance */}
            <div>
              <div style={{ fontSize: '9px', fontWeight: 900, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                Safety Clearance Data Points
              </div>
              <div style={{
                padding: '6px 10px 2px', marginBottom: '8px',
                backgroundColor: C.blueBg, border: `1px solid ${C.blueBorder}`, borderRadius: '6px',
              }}>
                <div style={{ fontSize: '7.5px', color: '#1d4ed8', fontWeight: 700, marginBottom: '4px' }}>
                  PRIMARY INDICATION · SNOMED CT
                </div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: C.ink }}>{p.section1.primaryIndication.description}</div>
                <div style={{ fontSize: '8px', color: C.sub, fontFamily: C.mono }}>Code: {p.section1.primaryIndication.snomedCode}</div>
              </div>

              <BoolBadge value={p.section1.safetyClearance.contraindicationWashoutConfirmed} label="Contraindication washout confirmed" />
              <BoolBadge value={p.section1.safetyClearance.fastingRequirementsMet} label="Fasting requirements met" />
              <BoolBadge value={p.section1.safetyClearance.baselineVitalsNormal} label="Baseline vitals within normal limits" />
            </div>

            {/* Therapeutic alliance */}
            <div>
              <div style={{ fontSize: '9px', fontWeight: 900, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                Therapeutic Alliance & Readiness (LOINC)
              </div>

              <div style={{
                padding: '8px 12px', marginBottom: '8px',
                backgroundColor: C.headerBg, border: `1px solid ${C.border}`, borderRadius: '6px',
              }}>
                <div style={{ fontSize: '7.5px', color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>
                  Readiness Assessment
                </div>
                <div style={{ fontSize: '9.5px', fontWeight: 700, color: C.ink }}>{p.section1.therapeuticAlliance.readinessAssessment.scaleName}</div>
                <div style={{ fontSize: '8px', color: C.muted, fontFamily: C.mono, marginTop: '2px' }}>
                  LOINC: {p.section1.therapeuticAlliance.readinessAssessment.loincCode}
                </div>
              </div>

              <div style={{
                padding: '8px 12px',
                backgroundColor: p.section1.therapeuticAlliance.allianceScore.thresholdMet ? C.greenBg : C.amberBg,
                border: `1px solid ${p.section1.therapeuticAlliance.allianceScore.thresholdMet ? C.greenBorder : '#fed7aa'}`,
                borderRadius: '6px',
              }}>
                <div style={{ fontSize: '7.5px', color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>
                  Alliance Score
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '22px', fontWeight: 900, color: p.section1.therapeuticAlliance.allianceScore.thresholdMet ? C.green : C.amber }}>
                    {p.section1.therapeuticAlliance.allianceScore.score}
                  </span>
                  <span style={{ fontSize: '11px', color: C.sub, fontWeight: 700 }}>
                    / {p.section1.therapeuticAlliance.allianceScore.maxScore}
                  </span>
                  <span style={{
                    marginLeft: 'auto', fontSize: '8.5px', fontWeight: 900,
                    color: p.section1.therapeuticAlliance.allianceScore.thresholdMet ? C.green : C.amber,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    {p.section1.therapeuticAlliance.allianceScore.thresholdMet ? '✓ Threshold Met' : '✗ Below Threshold'}
                  </span>
                </div>
                <div style={{ fontSize: '8px', color: C.sub }}>{p.section1.therapeuticAlliance.allianceScore.tool}</div>
                <div style={{ fontSize: '7.5px', color: C.muted, fontFamily: C.mono, marginTop: '2px' }}>
                  LOINC: {p.section1.therapeuticAlliance.allianceScore.loincCode}
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 2 ── */}
          <SectionHeading num="2" title="Core Visual — Clinical Dosing & Intervention Timeline" color="#7c3aed" />

          <div style={{
            backgroundColor: C.headerBg, border: `1px solid ${C.border}`, borderRadius: '8px',
            padding: '14px 10px 10px', marginBottom: '4px',
          }}>
            <ClinicalTimelineChart data={p.section2} />
          </div>
          <div style={{ fontSize: '7.5px', color: C.muted, textAlign: 'center', marginBottom: '0' }}>
            Hemodynamic data plotted on left Y-axis (HR bpm / BP mmHg) · SpO2 % displayed in legend · All times are relative to T+0:00 (Primary Administration)
          </div>

        </PageShell>

        {/* ════════ PAGE 2 ════════ */}
        <PageShell header={p.header} meta={p.documentMetadata} pageNum={2} totalPages={totalPages}>

          {/* ── Section 3 ── */}
          <SectionHeading num="3" title="Structured Administration Log" color="#0891b2" />
          <div style={{ marginBottom: '18px' }}>
            <Table
              accentColor="#0c4a6e"
              colWidths={['10%', '14%', '28%', '12%', '18%']}
              headers={['Time', 'Action', 'Agent (RxNorm)', 'Dose / Unit', 'Route (SNOMED)']}
              rows={p.section3.map(row => [
                <span style={{ fontFamily: C.mono, fontWeight: 700 }}>{row.relativeTime}</span>,
                <span style={{ fontWeight: 700 }}>{row.action}</span>,
                <CodeCell term={row.agent.description} code={row.agent.rxNorm} prefix="RxNorm" />,
                <span style={{ fontWeight: 700 }}>{row.dose} {row.unit}</span>,
                <CodeCell term={row.route.description} code={row.route.snomedCode} prefix="SNOMED" />,
              ])}
            />
          </div>

          {/* ── Section 4 ── */}
          <SectionHeading num="4" title="Adverse Events & Interventions Ledger" color={C.red} />
          <div style={{ marginBottom: '18px' }}>
            {p.section4.length === 0 ? (
              <div style={{
                padding: '14px 16px', backgroundColor: C.greenBg, border: `1px solid ${C.greenBorder}`,
                borderRadius: '6px', fontSize: '10px', color: C.green, fontWeight: 700,
              }}>
                ✓ No adverse events recorded for this session.
              </div>
            ) : (
              <Table
                accentColor="#7f1d1d"
                colWidths={['10%', '20%', '10%', '32%', '10%']}
                headers={['Time', 'Event (MedDRA)', 'Severity', 'Intervention (Code)', 'Resolution']}
                rows={p.section4.map(row => [
                  <span style={{ fontFamily: C.mono, fontWeight: 700, color: C.red }}>{row.eventTime}</span>,
                  <CodeCell term={row.medDra.term} code={row.medDra.code} prefix="MedDRA" />,
                  <SeverityBadge level={row.severity} />,
                  <CodeCell term={row.intervention.description} code={row.intervention.code} prefix={row.intervention.type} />,
                  <span style={{ fontFamily: C.mono, fontWeight: 700, color: C.green }}>{row.resolutionTime}</span>,
                ])}
              />
            )}
          </div>

          {/* ── Section 5 ── */}
          <SectionHeading num="5" title="Post-Session Discharge & Integration" color={C.green} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            {/* Discharge checklist */}
            <div>
              <div style={{ fontSize: '9px', fontWeight: 900, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                Discharge Criteria Checklist
              </div>
              <DischargeCheck
                checked={p.section5.dischargeCriteria.hemodynamicsReturnedToBaseline}
                label="Hemodynamics returned to baseline ±10%"
              />
              <DischargeCheck
                checked={p.section5.dischargeCriteria.independentAmbulationConfirmed}
                label="Independent ambulation confirmed without assistance"
              />
              <DischargeCheck
                checked={p.section5.dischargeCriteria.escortOrDriverPresent}
                label="Escort / driver verified and present for departure"
              />
            </div>

            {/* Post-session psychometrics */}
            <div>
              <div style={{ fontSize: '9px', fontWeight: 900, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                Post-Session State Assessment
              </div>
              <div style={{
                padding: '10px 14px', backgroundColor: C.blueBg,
                border: `1px solid ${C.blueBorder}`, borderRadius: '8px',
              }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: C.ink }}>{p.section5.postSessionPsychometrics.scaleName}</div>
                <div style={{ fontSize: '8px', color: C.muted, fontFamily: C.mono, marginTop: '4px' }}>
                  LOINC: {p.section5.postSessionPsychometrics.loincCode}
                </div>
              </div>
            </div>
          </div>

          {/* Cryptographic signature block */}
          <div style={{
            border: `2px solid ${C.navy}`, borderRadius: '10px',
            overflow: 'hidden', backgroundColor: '#f8fafc',
          }}>
            {/* Header */}
            <div style={{
              backgroundColor: C.navy, padding: '10px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  🔒 Cryptographic Non-Repudiation Seal
                </div>
                <div style={{ fontSize: '7.5px', color: '#94a3b8', marginTop: '2px' }}>
                  SHA-256 · Document integrity verified — record is immutable after lock
                </div>
              </div>
              <div style={{
                padding: '4px 10px', backgroundColor: C.green,
                borderRadius: '5px', fontSize: '9px', fontWeight: 900, color: '#fff',
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                {p.section5.digitalSignature.status}
              </div>
            </div>

            {/* Signature metadata */}
            <div style={{ padding: '12px 16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                {[
                  { label: 'Practitioner ID', value: p.header.practitionerId },
                  { label: 'Locked At (UTC)', value: generatedDate },
                  { label: 'Document Status', value: p.section5.digitalSignature.status },
                ].map((item, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '7px', fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>{item.label}</div>
                    <div style={{ fontSize: '9.5px', fontWeight: 700, color: C.ink }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Hash */}
              <div style={{
                backgroundColor: '#e2e8f0', borderRadius: '6px', padding: '10px 12px',
                border: `1px solid #cbd5e1`,
              }}>
                <div style={{ fontSize: '7px', fontWeight: 900, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                  SHA-256 Payload Hash
                </div>
                <div style={{
                  fontFamily: C.mono, fontSize: '9px', color: C.ink, fontWeight: 700,
                  letterSpacing: '0.12em', lineHeight: 1.8, wordBreak: 'break-all',
                }}>
                  {hashChunked}
                </div>
                <div style={{ fontSize: '7px', color: C.muted, marginTop: '6px' }}>
                  Verify this hash against the PPN system ledger to confirm this document has not been altered.
                </div>
              </div>
            </div>
          </div>

        </PageShell>

      </div>
    </div>
  );
};

export default AuditReportPDF;
