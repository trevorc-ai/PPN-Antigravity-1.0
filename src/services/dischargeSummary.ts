/**
 * dischargeSummary.ts
 * ==================
 * WO-DISCHARGE-PDF: Upgrade TXT export to formatted PDF.
 *
 * generateDischargeSummaryText()  — kept for server-side / email fallback
 * generateDischargeSummaryPDF()   — new: jsPDF A4 portrait clinical document
 * downloadDischargeSummary()      — calls PDF generator; falls back to TXT on error
 */

import { jsPDF } from 'jspdf';

export interface DischargeSummaryData {
    patientId: string;
    siteId: string;
    clinicianId: string;
    treatmentStart: string;
    treatmentEnd: string;
    dosingSessionsCount: number;
    integrationSessionsCount: number;
    diagnosis: string;
    substanceName: string;
    substanceDose: string;
    protocolName: string;
    baseline?: {
        phq9: number | null;
        gad7: number | null;
        caps5: number | null;
    };
    final?: {
        phq9: number | null;
        gad7: number | null;
        caps5: number | null;
    };
    clinicalMetricsEnabled?: boolean;
    vitalsEnabled?: boolean;
    meq30Peak: number | null;
    responseAchieved: 'YES (>=50% reduction)' | 'PARTIAL' | 'NO';
    remissionAchieved: 'YES' | 'NO';
    adverseEventsCount: number;
    grade3EventsCount: number;
    chemicalRescueUsed: 'YES' | 'NO';
    ongoingVulnerabilities: string;
    referralName: string;
    followUpWeeks: number;
    emergencyPlanSummary: string;
    selfCareSummary: string;
    clinicianStatement: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pct(baseline: number, final: number): string {
    if (baseline === 0) return 'N/A';
    return `${Math.round(((final - baseline) / baseline) * 100)}%`;
}

function delta(baseline: number, final: number): string {
    const diff = final - baseline;
    return diff > 0 ? `+${diff}` : `${diff}`;
}

function nr(val: number | null | undefined): string {
    return val != null ? String(val) : 'Not recorded';
}

// ─── Plain Text (kept for fallback / server-side use) ─────────────────────────

export function generateDischargeSummaryText(data: DischargeSummaryData): string {
    const lines = [
        'CLINICAL DISCHARGE SUMMARY',
        '────────────────────────────────────────────────────────────',
        `Patient ID:           ${data.patientId}`,
        `Site:                 ${data.siteId}`,
        `Treatment Dates:      ${data.treatmentStart} to ${data.treatmentEnd}`,
        `Total Sessions:       ${data.dosingSessionsCount} dosing sessions + ${data.integrationSessionsCount} integration sessions`,
        '',
        'PRESENTING DIAGNOSIS',
        data.diagnosis,
        '',
        'TREATMENT RECEIVED',
        `Substance:   ${data.substanceName} ${data.substanceDose}`,
        `Protocol:    ${data.protocolName}`,
        `Sessions:    ${data.dosingSessionsCount + data.integrationSessionsCount}`,
        '',
        'OUTCOME METRICS',
        data.clinicalMetricsEnabled === false || !data.baseline || !data.final
            ? '  Clinical outcome tracking (PHQ-9/GAD-7/CAPS-5) not utilized under this session protocol.'
            : [
                '                    Baseline    Final       Change',
                data.baseline.phq9 != null && data.final.phq9 != null
                    ? `PHQ-9               ${String(data.baseline.phq9).padEnd(12)}${String(data.final.phq9).padEnd(12)}${delta(data.baseline.phq9, data.final.phq9)} pts (${pct(data.baseline.phq9, data.final.phq9)})`
                    : 'PHQ-9               Not recorded',
                data.baseline.gad7 != null && data.final.gad7 != null
                    ? `GAD-7               ${String(data.baseline.gad7).padEnd(12)}${String(data.final.gad7).padEnd(12)}${delta(data.baseline.gad7, data.final.gad7)} pts (${pct(data.baseline.gad7, data.final.gad7)})`
                    : 'GAD-7               Not recorded',
                data.baseline.caps5 != null && data.final.caps5 != null
                    ? `CAPS-5              ${String(data.baseline.caps5).padEnd(12)}${String(data.final.caps5).padEnd(12)}${delta(data.baseline.caps5, data.final.caps5)} pts (${pct(data.baseline.caps5, data.final.caps5)})`
                    : 'CAPS-5              Not recorded',
            ].join('\n'),
        `MEQ-30 (Peak)       —           ${data.meq30Peak ? `${data.meq30Peak}/100` : '—'}         —`,
        '',
        `Response achieved:   ${data.responseAchieved}`,
        `Remission achieved:  ${data.remissionAchieved}`,
        '',
        'SAFETY SUMMARY',
        `Adverse events logged:    ${data.adverseEventsCount}`,
        `Grade 3+ events:          ${data.grade3EventsCount}`,
        `Chemical rescue used:     ${data.chemicalRescueUsed}`,
        '',
        'ONGOING VULNERABILITIES',
        data.ongoingVulnerabilities,
        '',
        'POST-SESSION RISK FACTORS',
        `[x] Continue integration therapy with: ${data.referralName}`,
        `[x] Follow-up psychiatric assessment in ${data.followUpWeeks} weeks`,
        `[x] Emergency plan: ${data.emergencyPlanSummary}`,
        `[x] Self-care instructions: ${data.selfCareSummary}`,
        '',
        'CLINICIAN STATEMENT',
        data.clinicianStatement,
        '',
        '────────────────────────────────────────────────────────────',
        `Clinician: ${data.clinicianId}        Date: ${new Date().toLocaleDateString('en-US')}`,
        'Signature: _______________'
    ];
    return lines.join('\n');
}

// ─── PDF Generator ────────────────────────────────────────────────────────────

export function generateDischargeSummaryPDF(data: DischargeSummaryData): jsPDF {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'in', format: 'letter' });

    // ── Color palette (print-safe, ppn-ui-standards Rule 5) ────────────────────
    const SLATE_800      = [30, 41, 59]   as const; // dark text on white
    const SLATE_600      = [71, 85, 105]  as const; // secondary text
    const SLATE_400      = [148, 163, 184] as const; // muted / footer
    const SLATE_100      = [241, 245, 249] as const; // light bg
    const INDIGO_HEADER  = [237, 233, 255] as const; // #ede9ff table header fill
    const INDIGO_TEXT    = [55, 48, 163]   as const; // #3730a3 table header text
    const INDIGO_ACCENT  = [55, 48, 163]   as const; // #3730a3 section accent
    const TEAL           = [20, 184, 166]  as const;
    const AMBER          = [245, 158, 11]  as const;
    const RED            = [239, 68, 68]   as const;
    const WHITE          = [255, 255, 255] as const;
    const NEAR_WHITE     = [248, 250, 252] as const; // #f8fafc

    const PAGE_W   = 8.5;  // inches
    const PAGE_H   = 11;   // inches
    const MARGIN   = 0.6;  // inches
    const CONTENT_W = PAGE_W - MARGIN * 2;
    let y = 0;

    // ── Gradient accent bar (6pt = 0.083in) ───────────────────────────────────
    // jsPDF cannot do linear gradients; approximate with 3 adjacent rects
    const BAR_H = 0.083;
    const third = PAGE_W / 3;
    doc.setFillColor(30, 58, 95);     // #1e3a5f navy
    doc.rect(0, 0, third, BAR_H, 'F');
    doc.setFillColor(59, 130, 246);   // #3b82f6 blue
    doc.rect(third, 0, third, BAR_H, 'F');
    doc.setFillColor(16, 185, 129);   // #10b981 teal
    doc.rect(third * 2, 0, third, BAR_H, 'F');

    // ── Header band (#f8fafc) ─────────────────────────────────────────────────
    const HDR_H = 0.55;
    doc.setFillColor(...NEAR_WHITE);
    doc.rect(0, BAR_H, PAGE_W, HDR_H, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.005);
    doc.line(0, BAR_H + HDR_H, PAGE_W, BAR_H + HDR_H);

    // Logo mark
    doc.setFillColor(30, 58, 95);
    doc.roundedRect(MARGIN, BAR_H + 0.1, 0.28, 0.28, 0.04, 0.04, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...WHITE);
    doc.text('P', MARGIN + 0.14, BAR_H + 0.27, { align: 'center' });

    // Branding
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...INDIGO_ACCENT);
    doc.text('PPN PORTAL', MARGIN + 0.38, BAR_H + 0.22);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...SLATE_400);
    doc.text('Clinical Discharge Summary, CONFIDENTIAL', MARGIN + 0.38, BAR_H + 0.35);

    // Right-side metadata
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...SLATE_600);
    doc.text(`Date: ${today}`, PAGE_W - MARGIN, BAR_H + 0.22, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...SLATE_400);
    doc.text(`Patient ID: ${data.patientId}`, PAGE_W - MARGIN, BAR_H + 0.35, { align: 'right' });
    doc.text(`Site: ${data.siteId}`, PAGE_W - MARGIN, BAR_H + 0.46, { align: 'right' });

    y = BAR_H + HDR_H + 0.35;

    // ── Helper: Section header ─────────────────────────────────────────────────
    function sectionHeader(title: string, color: readonly [number, number, number] = INDIGO_ACCENT) {
        if (y > PAGE_H - 1.5) { doc.addPage(); y = 0.8; }
        // Left accent bar
        doc.setFillColor(color[0], color[1], color[2]);
        doc.rect(MARGIN, y - 0.08, 0.03, 0.16, 'F');
        // Header text
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(title.toUpperCase(), MARGIN + 0.08, y + 0.06);
        // Rule
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.005);
        doc.line(MARGIN + 0.08 + doc.getTextWidth(title.toUpperCase()) + 0.08, y + 0.02, PAGE_W - MARGIN, y + 0.02);
        y += 0.25;
    }

    // ── Helper: Key-value row ──────────────────────────────────────────────────
    function kv(label: string, value: string, indent = 0) {
        if (y > PAGE_H - 0.5) { doc.addPage(); y = 0.8; }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...SLATE_600);
        doc.text(label, MARGIN + indent, y);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...SLATE_800);
        const lines = doc.splitTextToSize(value, CONTENT_W - 1.5 - indent);
        doc.text(lines, MARGIN + 1.5 + indent, y);
        y += Math.max(0.15, lines.length * 0.14);
    }

    function spacer(h = 0.12) { y += h; }
    function hrule() {
        if (y > PAGE_H - 0.5) { doc.addPage(); y = 0.8; }
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.005);
        doc.line(MARGIN, y, PAGE_W - MARGIN, y);
        y += 0.1;
    }

    // ── Badge helper ───────────────────────────────────────────────────────────
    function badge(text: string, color: readonly [number, number, number], x: number, by: number) {
        const badgeW = 0.9;
        doc.setFillColor(...INDIGO_HEADER);
        doc.roundedRect(x, by - 0.1, badgeW, 0.2, 0.03, 0.03, 'F');
        doc.setDrawColor(color[0], color[1], color[2]);
        doc.setLineWidth(0.005);
        doc.roundedRect(x, by - 0.1, badgeW, 0.2, 0.03, 0.03, 'S');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(text, x + badgeW / 2, by + 0.04, { align: 'center' });
    }

    // ── Section 1: Patient & Treatment Summary ─────────────────────────────────
    sectionHeader('1 — Patient & Treatment Summary', INDIGO_ACCENT);
    kv('Clinician ID', data.clinicianId);
    kv('Treatment Dates', `${data.treatmentStart || 'Not recorded'} to ${data.treatmentEnd || 'Not recorded'}`);
    kv('Dosing Sessions', String(data.dosingSessionsCount));
    kv('Integration Sessions', String(data.integrationSessionsCount));
    kv('Substance & Dose', `${data.substanceName} ${data.substanceDose}`);
    kv('Protocol', data.protocolName);
    kv('Diagnosis', data.diagnosis);
    spacer();

    // ── Section 2: Outcome Metrics ─────────────────────────────────────────────
    sectionHeader('2 — Outcome Metrics', TEAL);

    if (data.clinicalMetricsEnabled === false || !data.baseline || !data.final) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(...SLATE_400);
        doc.text('Clinical outcome tracking not utilized under this session protocol.', MARGIN, y);
        y += 0.2;
    } else {
        // Table header row — ppn-ui-standards compliant: #ede9ff fill + #3730a3 text
        doc.setFillColor(...INDIGO_HEADER);
        doc.rect(MARGIN, y - 0.08, CONTENT_W, 0.22, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...INDIGO_TEXT);
        doc.text('MEASURE', MARGIN + 0.08, y + 0.08);
        doc.text('BASELINE', MARGIN + 1.6, y + 0.08);
        doc.text('FINAL', MARGIN + 2.5, y + 0.08);
        doc.text('CHANGE', MARGIN + 3.5, y + 0.08);
        y += 0.28;

        const metrics: Array<{ label: string; b: number | null; f: number | null }> = [
            { label: 'PHQ-9', b: data.baseline.phq9, f: data.final.phq9 },
            { label: 'GAD-7', b: data.baseline.gad7, f: data.final.gad7 },
            { label: 'CAPS-5', b: data.baseline.caps5, f: data.final.caps5 },
        ];

        metrics.forEach((m, i) => {
            if (y > PAGE_H - 0.5) { doc.addPage(); y = 0.8; }
            doc.setFillColor(i % 2 === 0 ? 248 : 255, i % 2 === 0 ? 250 : 255, i % 2 === 0 ? 252 : 255);
            doc.rect(MARGIN, y - 0.06, CONTENT_W, 0.18, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(...SLATE_800);
            doc.text(m.label, MARGIN + 0.08, y + 0.06);
            doc.setFont('helvetica', 'normal');
            doc.text(nr(m.b), MARGIN + 1.6, y + 0.06);
            doc.text(nr(m.f), MARGIN + 2.5, y + 0.06);
            if (m.b != null && m.f != null) {
                const chg = delta(m.b, m.f);
                const color = m.f < m.b ? TEAL : m.f > m.b ? RED : SLATE_600;
                doc.setTextColor(color[0], color[1], color[2]);
                doc.text(`${chg} (${pct(m.b, m.f)})`, MARGIN + 3.5, y + 0.06);
                doc.setTextColor(...SLATE_800);
            } else {
                doc.text('Not recorded', MARGIN + 3.5, y + 0.06);
            }
            y += 0.2;
        });

        kv('MEQ-30 Peak', data.meq30Peak != null ? `${data.meq30Peak}/100` : 'Not recorded');
        spacer(0.1);

        // Response/Remission badges
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...SLATE_600);
        doc.text('RESPONSE ACHIEVED', MARGIN, y);
        doc.text('REMISSION ACHIEVED', MARGIN + 2.2, y);
        y += 0.14;
        badge(
            data.responseAchieved === 'YES (>=50% reduction)' ? 'YES >=50%' : data.responseAchieved,
            data.responseAchieved.startsWith('YES') ? TEAL : AMBER, MARGIN, y
        );
        badge(data.remissionAchieved, data.remissionAchieved === 'YES' ? TEAL : AMBER, MARGIN + 2.2, y);
        y += 0.3;
    }

    spacer();

    // ── Section 3: Safety Summary ──────────────────────────────────────────────
    sectionHeader('3 — Safety Summary', AMBER);
    kv('Adverse Events Logged', String(data.adverseEventsCount));
    kv('Grade 3+ Events', String(data.grade3EventsCount));
    kv('Chemical Rescue Used', data.chemicalRescueUsed);
    spacer();

    // ── Section 4: Ongoing Care Plan ──────────────────────────────────────────
    sectionHeader('4 — Ongoing Care Plan', INDIGO_ACCENT);
    kv('Ongoing Vulnerabilities', data.ongoingVulnerabilities || 'Not recorded');
    kv('Referral', data.referralName || 'Pending');
    kv('Follow-up Schedule', `${data.followUpWeeks} weeks`);
    kv('Emergency Plan', data.emergencyPlanSummary || 'Not recorded');
    kv('Self-care Instructions', data.selfCareSummary || 'Not recorded');
    spacer();

    // ── Section 5: Clinician Sign-Off ─────────────────────────────────────────
    sectionHeader('5 — Clinician Sign-Off', SLATE_600);
    if (y > PAGE_H - 1.8) { doc.addPage(); y = 0.8; }

    doc.setFillColor(...SLATE_100);
    doc.roundedRect(MARGIN, y, CONTENT_W, 0.7, 0.06, 0.06, 'F');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(...SLATE_800);
    const claimLines = doc.splitTextToSize(data.clinicianStatement || 'Clinician statement pending.', CONTENT_W - 0.25);
    doc.text(claimLines, MARGIN + 0.12, y + 0.2);
    y += 0.8;

    kv('Clinician ID', data.clinicianId);
    kv('Date Printed', today);
    spacer(0.2);

    // Signature line
    doc.setDrawColor(...SLATE_600);
    doc.setLineWidth(0.01);
    doc.line(MARGIN, y, MARGIN + 2.5, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...SLATE_400);
    doc.text('Signature', MARGIN, y + 0.12);
    spacer(0.35);

    // Disclaimer
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(...SLATE_400);
    doc.text(
        'Auto-generated by PPN Portal. Clinician review required before patient distribution.',
        MARGIN, y, { maxWidth: CONTENT_W }
    );

    // ── Footer on every page ────────────────────────────────────────────────────
    const totalPages = (doc.internal as any).pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFillColor(...NEAR_WHITE);
        doc.rect(0, PAGE_H - 0.3, PAGE_W, 0.3, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.005);
        doc.line(0, PAGE_H - 0.3, PAGE_W, PAGE_H - 0.3);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(...SLATE_400);
        doc.text(`PPN PORTAL  ·  CONFIDENTIAL  ·  Patient: ${data.patientId}`, MARGIN, PAGE_H - 0.1);
        doc.text(`Page ${i} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 0.1, { align: 'right' });
    }

    return doc;
}

// ─── Download Function ────────────────────────────────────────────────────────

export function downloadDischargeSummary(data: DischargeSummaryData): void {
    const filename = `discharge_summary_${data.patientId}_${new Date().toISOString().slice(0, 10)}.pdf`;
    try {
        const doc = generateDischargeSummaryPDF(data);
        doc.save(filename);
    } catch (err) {
        // Fallback: download as TXT if jsPDF fails (e.g., module not available)
        console.error('[dischargeSummary] PDF generation failed, falling back to TXT:', err);
        const text = generateDischargeSummaryText(data);
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.replace('.pdf', '.txt');
        a.click();
        URL.revokeObjectURL(url);
    }
}
