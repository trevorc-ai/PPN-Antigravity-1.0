/**
 * PatientReportPDF - Phase 3 Patient Wellness Report
 * 3-page, jargon-free summary of the patient's wellness journey.
 * Accessible via secure QR code link or direct Protocol Detail link.
 * Page 1: Your Wellness Journey (Emotional Arc summary)
 * Page 2: How You've Changed (Spider graph, before/after in lay terms)
 * Page 3: What Comes Next (integration summary, follow-up window)
 *
 * PPN UI Standards: WO-663 overhaul applied 2026-03-23
 * - Page size: US Letter (8.5x11in), 0.6in margins
 * - All text: 12px minimum for print, 14px for screen
 * - Color-blindness: all red/green states paired with text labels
 * - PPN Portal wordmark in every page header
 * - Full legal footer on every page
 * - Back navigation: Option B (protocolId param or history.back())
 */
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// ─── Print CSS ────────────────────────────────────────────────────────────────
const PRINT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Roboto+Mono:wght@400;700&display=swap');

@media print {
  /* -- Page setup -- */
  @page { size: letter; margin: 0.6in; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  /* -- Outer wrapper: kill dark bg, padding, and shadows on screen containers -- */
  .pdf-wrapper {
    background: #ffffff !important;
    padding: 0 !important;
    min-height: unset !important;
  }

  /* -- Page shell: remove screen-only decorations, let content flow naturally -- */
  .pdf-page {
    width: 100% !important;
    min-height: unset !important;
    max-width: unset !important;
    box-shadow: none !important;
    margin-bottom: 0 !important;
    border-radius: 0 !important;
    /* Do NOT add break-inside: avoid here — it causes blank pages */
  }

  /* -- Explicit page break between logical pages: only via the separator div -- */
  .pdf-page-break {
    page-break-after: always;
    break-after: page;
    display: block;
    height: 0;
  }
  .pdf-page-break:last-of-type {
    page-break-after: auto;
    break-after: auto;
  }

  /* -- Section chunks: the unit of page-break prevention -- */
  .print-chunk,
  .pdf-grid,
  .pdf-table-wrapper {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* Hide toolbar and screen chrome */
  .no-print { display: none !important; }

  /* Remove the accent top bar (decorative only) */
  .pdf-accent-bar { display: none !important; }
}
`;

// ─── QR Code (placeholder canvas-based) ──────────────────────────────────────
const QRCodePlaceholder: React.FC<{ url: string }> = ({ url }) => {
    // Static SVG QR-style placeholder; replace with real QR library when patient portal URL is confirmed.
    const cells = 7;
    const size = 112;
    const cell = size / cells;
    const hash = url.split('').reduce((acc, c) => ((acc << 5) - acc + c.charCodeAt(0)) | 0, 0);
    const pattern: boolean[][] = Array.from({ length: cells }, (_, r) =>
        Array.from({ length: cells }, (_, c) => {
            if ((r < 2 && c < 2) || (r < 2 && c >= cells - 2) || (r >= cells - 2 && c < 2)) return true;
            return ((hash * (r + 1) * (c + 1)) % 3) === 0;
        })
    );
    return (
        <div style={{ textAlign: 'center' }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
                style={{ border: '4px solid white', display: 'block', margin: '0 auto', borderRadius: '8px' }}>
                <rect width={size} height={size} fill="white" />
                {pattern.flatMap((row, r) =>
                    row.map((filled, c) =>
                        filled ? (
                            <rect key={`${r}-${c}`}
                                x={c * cell + 1} y={r * cell + 1}
                                width={cell - 2} height={cell - 2}
                                fill="#1e3a5f" rx={1} />
                        ) : null
                    )
                )}
            </svg>
            {/* V-08 fix: Roboto Mono stack replaces generic monospace (Courier New ban) */}
            {/* V-03 fix: raised from 8px to 12px */}
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '6px', fontFamily: "'Roboto Mono', ui-monospace, monospace", wordBreak: 'break-all', maxWidth: size }}>
                {url}
            </div>
        </div>
    );
};

// ─── Radar chart (inline SVG, jargon-free) ────────────────────────────────────
// VIZ-03 fix: directional legend text added below chart
const WellnessRadar: React.FC = () => {
    const cx = 110; const cy = 110; const r = 85;
    const axes = [
        { label: 'Mood', patient: 88, start: 32 },
        { label: 'Calm', patient: 80, start: 62 },
        { label: 'Connection', patient: 85, start: 48 },
        { label: 'Focus', patient: 76, start: 40 },
        { label: 'Hope', patient: 82, start: 35 },
        { label: 'Sleep', patient: 91, start: 55 },
    ];
    const n = axes.length;
    const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
    const pt = (val: number, i: number) => {
        const a = angle(i); const ratio = val / 100;
        return { x: cx + r * ratio * Math.cos(a), y: cy + r * ratio * Math.sin(a) };
    };
    const startPts = axes.map((a, i) => pt(a.start, i));
    const nowPts   = axes.map((a, i) => pt(a.patient, i));
    const poly = (pts: { x: number; y: number }[]) =>
        pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    return (
        <svg width="220" height="220" viewBox="0 0 220 220"
            aria-label="Wellness radar chart showing before and after scores across six wellness dimensions">
            {/* VIZ-04 fix: SVG title for screen readers */}
            <title>Wellness profile: before treatment (dashed red outline) vs. now (solid green area). Larger green area means more improvement.</title>
            {[25, 50, 75, 100].map(pct => {
                const rPts = axes.map((_, i) => {
                    const a = angle(i); const ratio = pct / 100;
                    return `${(cx + r * ratio * Math.cos(a)).toFixed(1)},${(cy + r * ratio * Math.sin(a)).toFixed(1)}`;
                });
                return <polygon key={pct} points={rPts.join(' ')} fill="none" stroke="#e2e8f0" strokeWidth={1} />;
            })}
            {axes.map((_, i) => {
                const end = pt(100, i);
                return <line key={i} x1={cx} y1={cy} x2={end.x.toFixed(1)} y2={end.y.toFixed(1)} stroke="#e2e8f0" strokeWidth={1} />;
            })}
            <polygon points={poly(startPts)} fill="rgba(239,68,68,0.12)" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 3" />
            <polygon points={poly(nowPts)} fill="rgba(16,185,129,0.18)" stroke="#10b981" strokeWidth={2} />
            {axes.map((a, i) => {
                const offset = 16;
                const ang = angle(i);
                const lx = cx + (r + offset) * Math.cos(ang);
                const ly = cy + (r + offset) * Math.sin(ang);
                return (
                    // V-03 fix: raised from 9px to 12px
                    <text key={i} x={lx.toFixed(1)} y={ly.toFixed(1)}
                        textAnchor="middle" dominantBaseline="middle"
                        fill="#1e3a5f" fontSize={12} fontWeight={700}>{a.label}</text>
                );
            })}
        </svg>
    );
};

// ─── Waveform Summary (simplified single-line pulse) ─────────────────────────
const WaveformSummary: React.FC = () => {
    const W = 500; const H = 80; const pad = { l: 10, r: 10, t: 10, b: 24 };
    const cW = W - pad.l - pad.r; const cH = H - pad.t - pad.b;
    const pts = Array.from({ length: 90 }, (_, i) => {
        const t = i / 89;
        const v = 1.5 + t * 3.2 + Math.sin(i * 0.4) * 0.4;
        const x = (i / 89) * cW + pad.l;
        const y = H - pad.b - ((Math.min(5, Math.max(1, v)) - 1) / 4) * cH;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const pathD = 'M ' + pts.join(' L ');
    const areaD = pathD + ` L ${(cW + pad.l).toFixed(1)},${H - pad.b} L ${pad.l},${H - pad.b} Z`;
    return (
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}
            aria-label="Line chart showing mood scores rising over 90 days">
            {/* VIZ-04 fix: SVG title for screen readers */}
            <title>Your mood scores over 90 days. A rising line means improving wellbeing.</title>
            <defs>
                <linearGradient id="pr-wave-grad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                </linearGradient>
            </defs>
            <path d={areaD} fill="url(#pr-wave-grad)" />
            <path d={pathD} fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round" />
            {['Day 1', 'Month 1', 'Month 2', 'Month 3'].map((label, i, arr) => {
                const x = (i / (arr.length - 1)) * cW + pad.l;
                return (
                    // V-03 + VIZ-02 fix: raised from 8px to 12px
                    <text key={label} x={x} y={H - 2}
                        textAnchor="middle" fill="#94a3b8" fontSize={12}>{label}</text>
                );
            })}
        </svg>
    );
};

// ─── Page Shell ───────────────────────────────────────────────────────────────
// V-06 fix: PPN Portal wordmark in header (uses img tag, with text fallback)
// V-07 fix: full legal footer on every page
// V-03 fix: all sub-12px font sizes raised
// Print fix: removed fixed minHeight (was causing blank pages); natural content flow
const PageShell: React.FC<{ children: React.ReactNode; pageNum: number; total: number; reportDate: string; isLast?: boolean }> = ({ children, pageNum, total, reportDate, isLast = false }) => (
    <>
    <div className="pdf-page" style={{
        width: '210mm', backgroundColor: '#ffffff',
        fontFamily: "'Inter','Helvetica Neue',sans-serif", color: '#1e293b',
        boxShadow: '0 4px 32px rgba(0,0,0,0.18)', marginBottom: '24px',
        display: 'flex', flexDirection: 'column',
    }}>
        {/* Top accent bar */}
        <div style={{ height: '6px', background: 'linear-gradient(90deg,#7c6ff7 0%,#5b52d4 50%,#4338ca 100%)' }} />

        {/* Page header — V-06 fix: wordmark + V-03 font sizes */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 28px 10px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8f9fc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* V-06 fix: PPN Portal wordmark replaces gradient "P" square */}
                <img
                    src="/assets/ppn_portal_wordmark.png"
                    alt="PPN Portal"
                    style={{ height: '28px', objectFit: 'contain' }}
                    onError={(e) => {
                        // Fallback if wordmark asset not present
                        const el = e.currentTarget;
                        el.style.display = 'none';
                        const sibling = el.nextElementSibling as HTMLElement;
                        if (sibling) sibling.style.display = 'flex';
                    }}
                />
                {/* Fallback wordmark text — hidden unless img fails */}
                <div style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'linear-gradient(135deg,#7c6ff7,#4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'white', fontSize: '13px', fontWeight: 900 }}>P</span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 900, color: '#1e293b', letterSpacing: '-0.01em' }}>PPN Portal</span>
                </div>
                <div>
                    {/* V-03 fix: raised from 10px/8px to 12px */}
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', letterSpacing: '0.04em' }}>Personal Wellness Report</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Confidential</div>
                </div>
            </div>
            {/* V-03 fix: raised from 9px to 12px */}
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Page {pageNum} of {total}</div>
        </div>

        <div style={{ padding: '24px 28px' }}>{children}</div>

        {/* V-07 fix: full legal footer */}
        <div style={{ borderTop: '1px solid #e2e8f0', padding: '8px 28px', backgroundColor: '#f8f9fc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* V-03 fix: raised from 8px to 12px */}
            <span style={{ fontSize: '12px', color: '#6b7280' }}>Personal Wellness Report · {reportDate}</span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                {`© ${new Date().getFullYear()} PPN Portal · ppnportal.net · Confidential`}
            </span>
        </div>
    </div>
    {/* Explicit page break separator — only triggers in @media print via .pdf-page-break */}
    {!isLast && <div className="pdf-page-break" />}
    </>
);

// ─── Section Heading ──────────────────────────────────────────────────────────
const Heading: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = '#4338ca' }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', marginTop: '20px' }}>
        <div style={{ width: '3px', height: '18px', backgroundColor: color, borderRadius: '2px', flexShrink: 0 }} />
        {/* V-03 fix: raised from 12px to 14px (screen heading) */}
        <h2 style={{ fontSize: '14px', fontWeight: 900, color, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{children}</h2>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
    </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const PatientReportPDF: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const sessionId = searchParams.get('sessionId') ?? 'PREVIEW';
    const protocolId = searchParams.get('protocolId') ?? null;

    useEffect(() => {
        const prev = document.title;
        const shortId = sessionId.slice(0, 8).toUpperCase();
        document.title = `PPN-Patient-Wellness-Report-${shortId}`;
        return () => { document.title = prev; };
    }, [sessionId]);

    // F-01 fix: Option B back navigation
    const handleBack = () => {
        if (protocolId) {
            navigate(`/protocol/${protocolId}`);
        } else if (window.history.length > 1) {
            navigate(-1);
        } else {
            window.close();
        }
    };

    const backLabel = protocolId ? '← Back to Protocol' : window.history.length > 1 ? '← Back' : 'Close Window';

    const TOTAL = 3;
    const reportDate = new Date().toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
    const QR_URL = `https://ppnportal.net/patient/${sessionId}`;

    // TODO: Replace with live data hook when patient data pipeline is wired (useMemo wrapping needed)
    const outcomes = { before: { mood: 7, sleep: 6, connection: 5, calm: 4, hope: 5, focus: 4 }, after: { mood: 2, sleep: 2, connection: 2, calm: 1, hope: 2, focus: 3 } };
    const phq9Before = 21; const phq9After = 8;
    const pctImprovement = Math.round(((phq9Before - phq9After) / phq9Before) * 100);

    return (
        // V-09 fix: pdf-wrapper class clears dark bg to #ffffff in @media print
        <div className="pdf-wrapper" style={{ backgroundColor: '#0a1628', minHeight: '100vh', padding: '32px 24px' }}>
            <style>{PRINT_CSS}</style>

            {/* Toolbar — no-print — F-01 + F-02 + F-03 fixes */}
            <div className="no-print" style={{ maxWidth: '210mm', margin: '0 auto 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* F-01 fix: back navigation button */}
                        <button
                            onClick={handleBack}
                            style={{
                                padding: '10px 18px', background: 'rgba(255,255,255,0.08)',
                                color: '#94a3b8', border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                                cursor: 'pointer', fontFamily: "'Inter','Helvetica Neue',sans-serif",
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                        >
                            {backLabel}
                        </button>
                        <div>
                            <h1 style={{ color: '#a78bfa', fontSize: '22px', fontWeight: 900, margin: 0 }}>Patient Wellness Report</h1>
                            {/* F-02 fix: page count indicator */}
                            <p style={{ color: '#6b7280', fontSize: '14px', margin: '4px 0 0' }}>
                                Jargon-free personal summary · Session {sessionId.slice(0, 8).toUpperCase()}
                                <span style={{ marginLeft: '12px', padding: '2px 8px', backgroundColor: 'rgba(124,111,247,0.2)', color: '#a78bfa', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
                                    3-page report
                                </span>
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                        <button onClick={() => window.print()} style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                            background: 'linear-gradient(135deg,#4338ca,#7c6ff7)', color: 'white',
                            border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 900,
                            cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase',
                            boxShadow: '0 4px 20px rgba(124,111,247,0.4)',
                            fontFamily: "'Inter','Helvetica Neue',sans-serif",
                        }}>↓ Download PDF</button>
                        {/* F-03 fix: print dialog hint */}
                        <span style={{ fontSize: '12px', color: '#475569' }}>Select "Save as PDF" in the print dialog</span>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '210mm', margin: '0 auto' }}>

                {/* ════════ PAGE 1: YOUR WELLNESS JOURNEY ════════ */}
                <PageShell pageNum={1} total={TOTAL} reportDate={reportDate}>
                    {/* Hero */}
                    {/* V-05 fix: accent bar color switched to indigo; dark table-header fill removed from hero */}
                    <div className="pdf-grid" style={{ background: 'linear-gradient(135deg,#4338ca 0%,#7c6ff7 60%,#a78bfa 100%)', borderRadius: '12px', padding: '24px 28px', color: 'white', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)' }} />
                        {/* V-03 fix: raised from 9px to 12px */}
                        <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Your Personal Report</div>
                        <h1 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 6px' }}>Your Wellness Journey</h1>
                        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>3 months of healing, captured in plain language</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                            {[
                                { l: 'Treatment', v: 'MDMA-Assisted Therapy' },
                                { l: 'Journey Start', v: 'Aug 3, 2025' },
                                { l: 'Report Date', v: reportDate },
                            ].map((item, i) => (
                                <div key={i}>
                                    {/* V-03 fix: raised from 8px to 12px */}
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{item.l}</div>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginTop: '2px' }}>{item.v}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Heading color="#4338ca">How You've Been Feeling, Day by Day</Heading>
                    {/* V-03 fix: raised from 10px to 14px */}
                    <p style={{ fontSize: '14px', color: '#475569', margin: '-8px 0 10px', lineHeight: 1.6 }}>
                        This chart shows your mood over the 3 months following your session. Each point is based on your daily check-ins.
                        The arc rising upward means you've been feeling better over time.
                    </p>
                    <div className="pdf-grid" style={{ backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                        <WaveformSummary />
                    </div>

                    <Heading color="#4338ca">Your Numbers, in Plain Language</Heading>
                    {/* V-16 fix: pdf-grid class for break-inside: avoid */}
                    <div className="pdf-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '16px' }}>
                        {[
                            { label: 'Mood improved', value: `${pctImprovement}%`, sub: 'vs. before treatment', color: '#4338ca' },
                            { label: 'Daily check-ins', value: '82%', sub: '74 of 90 days', color: '#7c3aed' },
                            { label: 'Integration sessions', value: '8 / 10', sub: 'Attended', color: '#0d9488' },
                        ].map((m, i) => (
                            <div key={i} style={{ padding: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '22px', fontWeight: 900, color: m.color }}>{m.value}</div>
                                {/* V-03 fix: raised from 9px to 12px */}
                                <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '3px' }}>{m.label}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{m.sub}</div>
                            </div>
                        ))}
                    </div>

                    <div className="pdf-grid" style={{ backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '8px', padding: '14px 18px' }}>
                        {/* V-03 fix: raised from 11px to 14px */}
                        <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#3730a3', margin: 0 }}>
                            <strong>What this means:</strong> Before treatment, everyday feelings of heaviness, worry, and disconnection were
                            scoring <strong>{phq9Before}/27</strong> on a standard mental health scale. After three months of healing work,
                            that same score is now <strong>{phq9After}/27</strong>, a <strong>{pctImprovement}% improvement</strong>.
                            This is a meaningful, sustained change.
                        </p>
                    </div>
                </PageShell>

                {/* ════════ PAGE 2: HOW YOU'VE CHANGED ════════ */}
                <PageShell pageNum={2} total={TOTAL} reportDate={reportDate}>
                    <Heading color="#4338ca">How You've Changed</Heading>
                    {/* V-03 fix: raised from 10px to 14px */}
                    <p style={{ fontSize: '14px', color: '#475569', margin: '-8px 0 16px', lineHeight: 1.6 }}>
                        The green area shows where you are now. The red dashed outline shows where you started.
                        A larger green area means bigger improvements across all six areas.
                    </p>

                    <div className="pdf-grid" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginBottom: '20px' }}>
                        <div style={{ flexShrink: 0 }}>
                            <WellnessRadar />
                            {/* V-04 + VIZ-03 fix: legend with directional text, not color-only */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '20px', height: '3px', backgroundColor: '#10b981', borderRadius: '2px', flexShrink: 0 }} />
                                    {/* V-03 fix: raised from 9px to 12px */}
                                    <span style={{ fontSize: '12px', color: '#475569' }}>Now (larger area = better)</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '20px', height: '2px', border: '1.5px dashed #ef4444', borderRadius: '2px', flexShrink: 0 }} />
                                    <span style={{ fontSize: '12px', color: '#475569' }}>Before (starting point)</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ flex: 1 }}>
                            {/* V-05 + V-16 fix: table dark header replaced with light indigo tint, break-inside: avoid */}
                            <div className="pdf-table-wrapper">
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                    <thead>
                                        {/* V-05 fix: was backgroundColor: '#065f46' (dark green) — now light indigo tint */}
                                        <tr style={{ backgroundColor: '#ede9ff', color: '#3730a3' }}>
                                            {/* V-03 fix: raised from 8px to 12px */}
                                            {['How you feel about…', 'Before (start)', 'Now (current)', 'Change'].map(h => (
                                                <th key={h} style={{ padding: '8px 9px', textAlign: h === 'How you feel about…' ? 'left' : 'center', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#3730a3' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { label: 'Your mood', before: phq9Before, after: phq9After, scale: 'PHQ-9', lowerIsBetter: true },
                                            { label: 'Your worry level', before: 18, after: 7, scale: 'GAD-7', lowerIsBetter: true },
                                            { label: 'Processing past trauma', before: 52, after: 19, scale: 'PCL-5', lowerIsBetter: true },
                                            { label: 'Feeling connected', before: 2, after: 4.2, scale: '/5 avg.', lowerIsBetter: false },
                                            { label: 'Sleep quality', before: 2.1, after: 3.8, scale: '/5 avg.', lowerIsBetter: false },
                                        ].map((row, i) => {
                                            const isImproved = row.lowerIsBetter ? row.after < row.before : row.after > row.before;
                                            const delta = Math.abs(row.after - row.before);
                                            return (
                                                <tr key={row.label} style={{ backgroundColor: i % 2 === 0 ? '#f5f3ff' : 'white', borderBottom: '1px solid #e2e8f0' }}>
                                                    <td style={{ padding: '7px 9px', fontWeight: 600, color: '#1e293b', fontSize: '13px' }}>{row.label}</td>
                                                    {/*
                                                     * V-04 fix: "Before" column uses amber-dark (#92400e) instead of pure red (#ef4444).
                                                     * Pure red alone = deuteranopia failure. Amber-dark is distinguishable for all types.
                                                     * Text label "(higher = more distress)" added as title attribute.
                                                     */}
                                                    <td style={{ padding: '7px 9px', textAlign: 'center', color: '#92400e', fontWeight: 700, fontSize: '13px' }}
                                                        title={row.lowerIsBetter ? 'Before: higher score = more distress' : 'Before: lower score = less wellbeing'}>
                                                        {row.before}
                                                    </td>
                                                    {/*
                                                     * V-04 fix: "Now" column uses teal (#0d9488) instead of pure green (#10b981).
                                                     * Teal passes contrast on white and is not in the red-green banned pair.
                                                     */}
                                                    <td style={{ padding: '7px 9px', textAlign: 'center', color: '#0d9488', fontWeight: 700, fontSize: '13px' }}
                                                        title={row.lowerIsBetter ? 'Now: lower score = less distress' : 'Now: higher score = more wellbeing'}>
                                                        {row.after}
                                                    </td>
                                                    <td style={{ padding: '7px 9px', textAlign: 'center' }}>
                                                        {/* V-03 + V-04 fix: badge at 12px; icon+text differentiates direction, not color alone */}
                                                        <span style={{ padding: '3px 7px', borderRadius: '4px', fontSize: '12px', fontWeight: 700,
                                                            backgroundColor: isImproved ? '#ede9ff' : '#fef3c7',
                                                            color: isImproved ? '#4338ca' : '#92400e' }}>
                                                            {isImproved ? '▼ ' : '▲ '}{delta.toFixed(1)} {isImproved ? 'Improved' : 'Watching'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* V-03 fix: raised from 10px to 14px */}
                            <div style={{ marginTop: '14px', padding: '12px', backgroundColor: '#ede9ff', border: '1px solid #c4b5fd', borderRadius: '8px' }}>
                                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#3730a3', margin: 0 }}>
                                    <strong>Remember:</strong> For mood and worry scales, <em>lower numbers are better</em>.
                                    For connection and sleep, <em>higher numbers are better</em>.
                                    The "Change" column shows how much each score moved.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Heading color="#7c3aed">Your Depth of Experience Score (MEQ-30)</Heading>
                    <div className="pdf-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ padding: '16px', backgroundColor: '#faf5ff', border: '1px solid #ddd6fe', borderRadius: '8px' }}>
                            <div style={{ fontSize: '28px', fontWeight: 900, color: '#7c3aed' }}>72/150</div>
                            {/* V-03 fix: raised from 9px to 12px */}
                            <div style={{ fontSize: '12px', color: '#6d28d9', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '3px' }}>Experience Depth Score</div>
                            <p style={{ fontSize: '13px', color: '#475569', margin: '8px 0 0', lineHeight: 1.6 }}>
                                This captures the depth and meaning of your session experience. Scores above 50% often predict
                                the strongest long-term outcomes.
                            </p>
                        </div>
                        <div style={{ padding: '16px', backgroundColor: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: '8px' }}>
                            <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#3730a3', margin: 0 }}>
                                Research shows that people who feel a deep sense of meaning or connection during their session
                                tend to have the most lasting improvements, regardless of what the experience looked like to them in the moment.
                            </p>
                        </div>
                    </div>
                </PageShell>

                {/* ════════ PAGE 3: WHAT COMES NEXT ════════ */}
                <PageShell pageNum={3} total={TOTAL} reportDate={reportDate} isLast={true}>
                    <Heading color="#4338ca">What Comes Next</Heading>

                    {/* V-16 fix: pdf-grid for break-inside: avoid */}
                    <div className="pdf-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        {[
                            { icon: '🧠', title: 'Your neuroplasticity window', body: 'For 2 to 4 weeks after a session, your brain is unusually open to new patterns. This is the best time to practise new behaviours, journal, and attend integration sessions.', color: '#ede9ff', border: '#c4b5fd', text: '#3730a3' },
                            { icon: '🌱', title: 'Integration is the real work', body: 'The session opens a door. Integration sessions, daily check-ins, and peer support help you walk through it. The more you engage, the more lasting your changes tend to be.', color: '#f0fdf4', border: '#a7f3d0', text: '#065f46' },
                            { icon: '📅', title: 'Your upcoming check-ins', body: 'Your next PHQ-9 assessment is scheduled for Feb 28. Your next integration session is Mar 4. You can reschedule via your practitioner\'s booking link.', color: '#faf5ff', border: '#ddd6fe', text: '#6d28d9' },
                            { icon: '🆘', title: 'If you need immediate support', body: 'Call or text 988 (Suicide and Crisis Lifeline) anytime. Your practitioner is also available via the portal for urgent messages. You are not alone.', color: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
                        ].map((card, i) => (
                            <div key={i} style={{ padding: '16px', backgroundColor: card.color, border: `1px solid ${card.border}`, borderRadius: '8px' }}>
                                <div style={{ fontSize: '20px', marginBottom: '6px' }}>{card.icon}</div>
                                {/* V-03 fix: raised from 10px to 13px */}
                                <div style={{ fontSize: '13px', fontWeight: 900, color: card.text, marginBottom: '6px' }}>{card.title}</div>
                                {/* V-03 fix: raised from 9px to 12px */}
                                <p style={{ fontSize: '12px', lineHeight: 1.65, color: card.text, margin: 0, opacity: 0.9 }}>{card.body}</p>
                            </div>
                        ))}
                    </div>

                    <Heading color="#4338ca">Access This Report Anytime</Heading>
                    <div className="pdf-grid" style={{ display: 'flex', gap: '20px', alignItems: 'center', padding: '16px', backgroundColor: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: '8px' }}>
                        <QRCodePlaceholder url={QR_URL} />
                        <div>
                            {/* V-03 fix: raised from 11px to 14px */}
                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#3730a3', margin: '0 0 8px' }}>Scan to view your report on any device</p>
                            {/* V-03 fix: raised from 9px to 12px */}
                            <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 8px', lineHeight: 1.6 }}>
                                This QR code links to your personal, password-protected wellness report.
                                No one else can access it without your credentials.
                            </p>
                            {/* V-08 fix: Roboto Mono stack; V-03 raised from 8px to 12px */}
                            <div style={{ padding: '6px 10px', backgroundColor: '#ede9ff', borderRadius: '6px', display: 'inline-block' }}>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: '#4338ca', fontFamily: "'Roboto Mono', ui-monospace, monospace" }}>{QR_URL}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pdf-grid" style={{ marginTop: '16px', padding: '14px 16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '16px', flexShrink: 0 }}>🔒</span>
                        {/* V-03 fix: raised from 9px to 12px */}
                        <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                            <strong>Your privacy:</strong> This report uses only a Session ID as your identifier. Your name, date of birth, and any personal information
                            are never included. This report is generated under HIPAA Safe Harbor de-identification standards.
                            Report ID: {`RPT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${sessionId.slice(0, 8).toUpperCase()}`}
                        </p>
                    </div>
                </PageShell>
            </div>
        </div>
    );
};

export default PatientReportPDF;
