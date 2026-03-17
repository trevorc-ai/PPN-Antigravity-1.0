/**
 * PatientReportPDF — Phase 3 Patient Wellness Report
 * 3-page, jargon-free summary of the patient's wellness journey.
 * Accessible via secure QR code link.
 * Page 1: Your Wellness Journey (Emotional Arc summary)
 * Page 2: How You've Changed (Spider graph, before/after in lay terms)
 * Page 3: What Comes Next (integration summary, follow-up window)
 */
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// ─── Print CSS ────────────────────────────────────────────────────────────────
const PRINT_CSS = `
@media print {
  @page { size: A4; margin: 0; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .pdf-page { page-break-after: always; page-break-inside: avoid; }
  .pdf-page:last-child { page-break-after: auto; }
  .no-print { display: none !important; }
}
`;

// ─── QR Code (placeholder canvas-based) ──────────────────────────────────────
const QRCodePlaceholder: React.FC<{ url: string }> = ({ url }) => {
    // Static SVG QR-style placeholder; replace with real QR library when patient portal URL is confirmed.
    // Pattern deliberately looks like a QR to communicate the intent accurately.
    const cells = 7;
    const size = 112;
    const cell = size / cells;
    // Simple deterministic "QR-like" pattern from URL hash
    const hash = url.split('').reduce((acc, c) => ((acc << 5) - acc + c.charCodeAt(0)) | 0, 0);
    const pattern: boolean[][] = Array.from({ length: cells }, (_, r) =>
        Array.from({ length: cells }, (_, c) => {
            // Always fill finder pattern corners
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
            <div style={{ fontSize: '8px', color: '#94a3b8', marginTop: '6px', fontFamily: 'monospace', wordBreak: 'break-all', maxWidth: size }}>
                {url}
            </div>
        </div>
    );
};

// ─── Radar chart (inline SVG, jargon-free) ────────────────────────────────────
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
        <svg width="220" height="220" viewBox="0 0 220 220">
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
                const offset = 14;
                const ang = angle(i);
                const lx = cx + (r + offset) * Math.cos(ang);
                const ly = cy + (r + offset) * Math.sin(ang);
                return (
                    <text key={i} x={lx.toFixed(1)} y={ly.toFixed(1)}
                        textAnchor="middle" dominantBaseline="middle"
                        fill="#1e3a5f" fontSize={9} fontWeight={700}>{a.label}</text>
                );
            })}
        </svg>
    );
};

// ─── Waveform Summary (simplified single-line pulse) ─────────────────────────
const WaveformSummary: React.FC = () => {
    const W = 500; const H = 80; const pad = { l: 10, r: 10, t: 10, b: 20 };
    const cW = W - pad.l - pad.r; const cH = H - pad.t - pad.b;
    // Deterministic mood arc for the 3-month integration period
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
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
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
                    <text key={label} x={x} y={H - 2}
                        textAnchor="middle" fill="#94a3b8" fontSize={8}>{label}</text>
                );
            })}
        </svg>
    );
};

// ─── Page Shell ───────────────────────────────────────────────────────────────
const PageShell: React.FC<{ children: React.ReactNode; pageNum: number; total: number }> = ({ children, pageNum, total }) => (
    <div className="pdf-page" style={{
        width: '210mm', minHeight: '297mm', backgroundColor: '#ffffff',
        fontFamily: "'Inter','Helvetica Neue',sans-serif", color: '#1e293b',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 4px 32px rgba(0,0,0,0.18)', marginBottom: '24px',
        display: 'flex', flexDirection: 'column',
    }}>
        <div style={{ height: '6px', background: 'linear-gradient(90deg,#10b981 0%,#3b82f6 50%,#8b5cf6 100%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 28px 10px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f0fdf4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg,#10b981,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'white', fontSize: '13px', fontWeight: 900 }}>P</span>
                </div>
                <div>
                    <div style={{ fontSize: '10px', fontWeight: 900, color: '#065f46', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Your Wellness Journey</div>
                    <div style={{ fontSize: '8px', color: '#6b7280' }}>Personal Report · Confidential</div>
                </div>
            </div>
            <div style={{ fontSize: '9px', color: '#94a3b8' }}>Page {pageNum} of {total}</div>
        </div>
        <div style={{ flex: 1, padding: '24px 28px' }}>{children}</div>
        <div style={{ borderTop: '1px solid #e2e8f0', padding: '8px 28px', backgroundColor: '#f0fdf4', fontSize: '8px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
            <span>PPN Portal · Personal Wellness Report</span>
            <span>Generated: {new Date().toLocaleDateString()}</span>
        </div>
    </div>
);

const Heading: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = '#065f46' }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', marginTop: '20px' }}>
        <div style={{ width: '3px', height: '18px', backgroundColor: color, borderRadius: '2px', flexShrink: 0 }} />
        <h2 style={{ fontSize: '12px', fontWeight: 900, color, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{children}</h2>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
    </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const PatientReportPDF: React.FC = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('sessionId') ?? 'PREVIEW';

    // Set a unique document title so the PDF saves with a descriptive filename
    useEffect(() => {
        const prev = document.title;
        const shortId = sessionId.slice(0, 8).toUpperCase();
        document.title = `PPN-Patient-Wellness-Report-${shortId}`;
        return () => { document.title = prev; };
    }, [sessionId]);

    const TOTAL = 3;
    const reportDate = new Date().toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
    const QR_URL = `https://ppnportal.net/patient/${sessionId}`;

    // Demo outcomes (replace with live data hook when wired)
    const outcomes = { before: { mood: 7, sleep: 6, connection: 5, calm: 4, hope: 5, focus: 4 }, after: { mood: 2, sleep: 2, connection: 2, calm: 1, hope: 2, focus: 3 } };
    const phq9Before = 21; const phq9After = 8;
    const pctImprovement = Math.round(((phq9Before - phq9After) / phq9Before) * 100);

    return (
        <div style={{ backgroundColor: '#0a1628', minHeight: '100vh', padding: '32px 24px' }}>
            <style>{PRINT_CSS}</style>

            {/* Toolbar */}
            <div className="no-print" style={{ maxWidth: '210mm', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ color: '#34d399', fontSize: '22px', fontWeight: 900, margin: 0 }}>Patient Wellness Report</h1>
                    <p style={{ color: '#6b7280', fontSize: '13px', margin: '4px 0 0' }}>Jargon-free personal summary · Session {sessionId.slice(0, 8).toUpperCase()}</p>
                </div>
                <button onClick={() => window.print()} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                    background: 'linear-gradient(135deg,#065f46,#10b981)', color: 'white',
                    border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: 900,
                    cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase',
                    boxShadow: '0 4px 20px rgba(16,185,129,0.4)',
                }}>↓ Download PDF</button>
            </div>

            <div style={{ maxWidth: '210mm', margin: '0 auto' }}>

                {/* ════════ PAGE 1: YOUR WELLNESS JOURNEY ════════ */}
                <PageShell pageNum={1} total={TOTAL}>
                    {/* Hero */}
                    <div style={{ background: 'linear-gradient(135deg,#065f46 0%,#10b981 60%,#34d399 100%)', borderRadius: '12px', padding: '24px 28px', color: 'white', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)' }} />
                        <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Your Personal Report</div>
                        <h1 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 6px' }}>Your Wellness Journey</h1>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>3 months of healing, captured in plain language</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                            {[
                                { l: 'Treatment', v: 'MDMA-Assisted Therapy' },
                                { l: 'Journey Start', v: 'Aug 3, 2025' },
                                { l: 'Report Date', v: reportDate },
                            ].map((item, i) => (
                                <div key={i}>
                                    <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{item.l}</div>
                                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'white', marginTop: '2px' }}>{item.v}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Heading>How You've Been Feeling, Day by Day</Heading>
                    <p style={{ fontSize: '10px', color: '#475569', margin: '-8px 0 10px', lineHeight: 1.6 }}>
                        This chart shows your mood over the 3 months following your session. Each point is based on your daily check-ins.
                        The arc rising upward means you've been feeling better over time.
                    </p>
                    <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                        <WaveformSummary />
                    </div>

                    <Heading color="#1d4ed8">Your Numbers, in Plain Language</Heading>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '16px' }}>
                        {[
                            { label: 'Mood improved', value: `${pctImprovement}%`, sub: 'vs. before treatment', color: '#10b981' },
                            { label: 'Daily check-ins', value: '82%', sub: '74 of 90 days', color: '#3b82f6' },
                            { label: 'Integration sessions', value: '8 / 10', sub: 'Attended', color: '#8b5cf6' },
                        ].map((m, i) => (
                            <div key={i} style={{ padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '22px', fontWeight: 900, color: m.color }}>{m.value}</div>
                                <div style={{ fontSize: '9px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '3px' }}>{m.label}</div>
                                <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px' }}>{m.sub}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #6ee7b7', borderRadius: '8px', padding: '14px 18px' }}>
                        <p style={{ fontSize: '11px', lineHeight: 1.8, color: '#065f46', margin: 0 }}>
                            <strong>What this means:</strong> Before treatment, everyday feelings of heaviness, worry, and disconnection were
                            scoring <strong>{phq9Before}/27</strong> on a standard mental health scale. After three months of healing work,
                            that same score is now <strong>{phq9After}/27</strong> — a <strong>{pctImprovement}% improvement</strong>.
                            This is a meaningful, sustained change.
                        </p>
                    </div>
                </PageShell>

                {/* ════════ PAGE 2: HOW YOU'VE CHANGED ════════ */}
                <PageShell pageNum={2} total={TOTAL}>
                    <Heading>How You've Changed</Heading>
                    <p style={{ fontSize: '10px', color: '#475569', margin: '-8px 0 16px', lineHeight: 1.6 }}>
                        The green area shows where you are now. The red dashed outline shows where you started.
                        Larger green area = bigger improvements.
                    </p>

                    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginBottom: '20px' }}>
                        <div style={{ flexShrink: 0 }}>
                            <WellnessRadar />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9px', color: '#475569' }}>
                                    <div style={{ width: '20px', height: '3px', backgroundColor: '#10b981', borderRadius: '2px' }} />
                                    How you feel now
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9px', color: '#475569' }}>
                                    <div style={{ width: '20px', height: '2px', border: '1.5px dashed #ef4444', borderRadius: '2px' }} />
                                    How you felt before
                                </div>
                            </div>
                        </div>

                        <div style={{ flex: 1 }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#065f46', color: 'white' }}>
                                        {['How you feel about…', 'Before', 'Now', 'Change'].map(h => (
                                            <th key={h} style={{ padding: '7px 9px', textAlign: h === 'How you feel about…' ? 'left' : 'center', fontSize: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { label: 'Your mood', before: phq9Before, after: phq9After, scale: 'PHQ-9' },
                                        { label: 'Your worry level', before: 18, after: 7, scale: 'GAD-7' },
                                        { label: 'Processing past trauma', before: 52, after: 19, scale: 'PCL-5' },
                                        { label: 'Feeling connected', before: 2, after: 4.2, scale: '/5 avg.' },
                                        { label: 'Sleep quality', before: 2.1, after: 3.8, scale: '/5 avg.' },
                                    ].map((row, i) => {
                                        const isImproved = row.after < row.before;
                                        const delta = row.after - row.before;
                                        return (
                                            <tr key={row.label} style={{ backgroundColor: i % 2 === 0 ? '#f0fdf4' : 'white', borderBottom: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '7px 9px', fontWeight: 600, color: '#1e293b' }}>{row.label}</td>
                                                <td style={{ padding: '7px 9px', textAlign: 'center', color: '#ef4444', fontWeight: 700 }}>{row.before}</td>
                                                <td style={{ padding: '7px 9px', textAlign: 'center', color: '#10b981', fontWeight: 700 }}>{row.after}</td>
                                                <td style={{ padding: '7px 9px', textAlign: 'center' }}>
                                                    <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 700,
                                                        backgroundColor: isImproved ? '#dcfce7' : '#fef3c7',
                                                        color: isImproved ? '#16a34a' : '#92400e' }}>
                                                        {isImproved ? '▼' : '▲'} {Math.abs(delta).toFixed(1)}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            <div style={{ marginTop: '14px', padding: '12px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px' }}>
                                <p style={{ fontSize: '10px', lineHeight: 1.7, color: '#1e40af', margin: 0 }}>
                                    <strong>Remember:</strong> For mood and worry scales, <em>lower numbers are better</em>.
                                    For connection and sleep, <em>higher numbers are better</em>.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Heading color="#7c3aed">Your Depth of Experience Score (MEQ-30)</Heading>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ padding: '14px', backgroundColor: '#faf5ff', border: '1px solid #ddd6fe', borderRadius: '8px' }}>
                            <div style={{ fontSize: '28px', fontWeight: 900, color: '#7c3aed' }}>72/150</div>
                            <div style={{ fontSize: '9px', color: '#6d28d9', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '3px' }}>Experience Depth Score</div>
                            <p style={{ fontSize: '9px', color: '#475569', margin: '6px 0 0', lineHeight: 1.5 }}>
                                This captures the depth and meaning of your session experience. Scores above 50% often predict
                                the strongest long-term outcomes.
                            </p>
                        </div>
                        <div style={{ padding: '14px', backgroundColor: '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: '8px' }}>
                            <p style={{ fontSize: '10px', lineHeight: 1.7, color: '#065f46', margin: 0 }}>
                                Research shows that people who feel a deep sense of meaning or connection during their session
                                tend to have the most lasting improvements — regardless of what the experience "looked like" to them in the moment.
                            </p>
                        </div>
                    </div>
                </PageShell>

                {/* ════════ PAGE 3: WHAT COMES NEXT ════════ */}
                <PageShell pageNum={3} total={TOTAL}>
                    <Heading>What Comes Next</Heading>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        {[
                            { icon: '🧠', title: 'Your neuroplasticity window', body: 'For 2–4 weeks after a session, your brain is unusually open to new patterns. This is the best time to practise new behaviours, journal, and attend integration sessions.', color: '#eff6ff', border: '#bfdbfe', text: '#1e40af' },
                            { icon: '🌱', title: 'Integration is the real work', body: 'The session opens a door. Integration sessions, daily check-ins, and peer support help you walk through it. The more you engage, the more lasting your changes tend to be.', color: '#f0fdf4', border: '#a7f3d0', text: '#065f46' },
                            { icon: '📅', title: 'Your upcoming check-ins', body: 'Your next PHQ-9 assessment is scheduled for Feb 28. Your next integration session is Mar 4. You can reschedule via your practitioner\'s booking link.', color: '#faf5ff', border: '#ddd6fe', text: '#6d28d9' },
                            { icon: '🆘', title: 'If you need immediate support', body: 'Call or text 988 (Suicide & Crisis Lifeline) anytime. Your practitioner is also available via the portal for urgent messages. You are not alone.', color: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
                        ].map((card, i) => (
                            <div key={i} style={{ padding: '14px', backgroundColor: card.color, border: `1px solid ${card.border}`, borderRadius: '8px' }}>
                                <div style={{ fontSize: '20px', marginBottom: '6px' }}>{card.icon}</div>
                                <div style={{ fontSize: '10px', fontWeight: 900, color: card.text, marginBottom: '6px' }}>{card.title}</div>
                                <p style={{ fontSize: '9px', lineHeight: 1.6, color: card.text, margin: 0, opacity: 0.85 }}>{card.body}</p>
                            </div>
                        ))}
                    </div>

                    <Heading color="#065f46">Access This Report Anytime</Heading>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', padding: '16px', backgroundColor: '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: '8px' }}>
                        <QRCodePlaceholder url={QR_URL} />
                        <div>
                            <p style={{ fontSize: '11px', fontWeight: 700, color: '#065f46', margin: '0 0 8px' }}>Scan to view your report on any device</p>
                            <p style={{ fontSize: '9px', color: '#475569', margin: '0 0 8px', lineHeight: 1.6 }}>
                                This QR code links to your personal, password-protected wellness report.
                                No one else can access it without your credentials.
                            </p>
                            <div style={{ padding: '6px 10px', backgroundColor: '#dcfce7', borderRadius: '6px', display: 'inline-block' }}>
                                <span style={{ fontSize: '8px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>{QR_URL}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '16px', padding: '12px 16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '16px', flexShrink: 0 }}>🔒</span>
                        <p style={{ fontSize: '9px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
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
