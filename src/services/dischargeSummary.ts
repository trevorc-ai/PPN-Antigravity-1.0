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
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // ── Color palette ──────────────────────────────────────────────────────────
    const SLATE_900 = [15, 23, 42] as const;
    const SLATE_700 = [51, 65, 85] as const;
    const SLATE_500 = [100, 116, 139] as const;
    const SLATE_300 = [148, 163, 184] as const;
    const INDIGO    = [99, 102, 241] as const;
    const TEAL      = [20, 184, 166] as const;
    const AMBER     = [245, 158, 11] as const;
    const WHITE     = [255, 255, 255] as const;

    const PAGE_W = 210;
    const PAGE_H = 297;
    const MARGIN = 16;
    const CONTENT_W = PAGE_W - MARGIN * 2;
    let y = 0;

    // ── Header band ────────────────────────────────────────────────────────────
    doc.setFillColor(...SLATE_900);
    doc.rect(0, 0, PAGE_W, 36, 'F');

    // Accent bar
    doc.setFillColor(...INDIGO);
    doc.rect(0, 0, 4, 36, 'F');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...WHITE);
    doc.text('CLINICAL DISCHARGE SUMMARY', MARGIN + 4, 12);

    // Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...SLATE_300);
    doc.text('PSYCHEDELIC PRACTITIONER NETWORK  ·  CONFIDENTIAL CLINICAL RECORD', MARGIN + 4, 18);

    // Right-side metadata
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...SLATE_300);
    doc.text(`Date: ${today}`, PAGE_W - MARGIN, 12, { align: 'right' });
    doc.text(`Patient ID: ${data.patientId}`, PAGE_W - MARGIN, 18, { align: 'right' });
    doc.text(`Site: ${data.siteId}`, PAGE_W - MARGIN, 23, { align: 'right' });

    // Divider
    doc.setDrawColor(...INDIGO);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, 30, PAGE_W - MARGIN, 30);

    y = 44;

    // ── Helper: Section header ─────────────────────────────────────────────────
    function sectionHeader(title: string, color: readonly [number, number, number] = INDIGO) {
        if (y > PAGE_H - 40) { doc.addPage(); y = 20; }
        doc.setFillColor(...color, 0.12);
        doc.setFillColor(color[0], color[1], color[2]);
        // Tinted background pill
        doc.setFillColor(color[0], color[1], color[2]);
        doc.roundedRect(MARGIN, y - 4, CONTENT_W, 10, 2, 2, 'F');
        // Make it very subtle
        doc.setGState(doc.GState({ opacity: 0.12 }));
        doc.setFillColor(color[0], color[1], color[2]);
        doc.roundedRect(MARGIN, y - 4, CONTENT_W, 10, 2, 2, 'F');
        doc.setGState(doc.GState({ opacity: 1 }));

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(title.toUpperCase(), MARGIN + 4, y + 3);
        y += 12;
    }

    // ── Helper: Key-value row ──────────────────────────────────────────────────
    function kv(label: string, value: string, indent = 0) {
        if (y > PAGE_H - 20) { doc.addPage(); y = 20; }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...SLATE_500);
        doc.text(label, MARGIN + indent, y);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59); // slate-800 for readability on white
        const lines = doc.splitTextToSize(value, CONTENT_W - 50 - indent);
        doc.text(lines, MARGIN + 55 + indent, y);
        y += Math.max(6, lines.length * 5);
    }

    function spacer(h = 4) { y += h; }
    function hrule(color: readonly [number, number, number] = SLATE_700) {
        if (y > PAGE_H - 20) { doc.addPage(); y = 20; }
        doc.setDrawColor(...color);
        doc.setLineWidth(0.2);
        doc.line(MARGIN, y, PAGE_W - MARGIN, y);
        y += 4;
    }

    // ── Badge helper ───────────────────────────────────────────────────────────
    function badge(text: string, color: readonly [number, number, number], x: number, by: number) {
        doc.setFillColor(color[0], color[1], color[2]);
        doc.setGState(doc.GState({ opacity: 0.15 }));
        doc.roundedRect(x, by - 4, 28, 7, 1.5, 1.5, 'F');
        doc.setGState(doc.GState({ opacity: 1 }));
        doc.setDrawColor(color[0], color[1], color[2]);
        doc.setLineWidth(0.4);
        doc.roundedRect(x, by - 4, 28, 7, 1.5, 1.5, 'S');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(text, x + 14, by + 0.5, { align: 'center' });
    }

    // ── Section 1: Patient & Treatment Summary ─────────────────────────────────
    sectionHeader('1 — Patient & Treatment Summary', INDIGO);
    kv('Clinician ID', data.clinicianId);
    kv('Treatment Dates', `${data.treatmentStart || 'Not recorded'} → ${data.treatmentEnd || 'Not recorded'}`);
    kv('Dosing Sessions', String(data.dosingSessionsCount));
    kv('Integration Sessions', String(data.integrationSessionsCount));
    kv('Substance & Dose', `${data.substanceName} ${data.substanceDose}`);
    kv('Protocol', data.protocolName);
    kv('Diagnosis', data.diagnosis);
    spacer(4);

    // ── Section 2: Outcome Metrics ─────────────────────────────────────────────
    sectionHeader('2 — Outcome Metrics', TEAL);

    if (data.clinicalMetricsEnabled === false || !data.baseline || !data.final) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(...SLATE_500);
        doc.text('Clinical outcome tracking not utilized under this session protocol.', MARGIN, y);
        y += 8;
    } else {
        // Table header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...SLATE_500);
        doc.text('MEASURE', MARGIN, y);
        doc.text('BASELINE', MARGIN + 55, y);
        doc.text('FINAL', MARGIN + 90, y);
        doc.text('CHANGE', MARGIN + 130, y);
        hrule(SLATE_700);

        const metrics: Array<{ label: string; b: number | null; f: number | null }> = [
            { label: 'PHQ-9', b: data.baseline.phq9, f: data.final.phq9 },
            { label: 'GAD-7', b: data.baseline.gad7, f: data.final.gad7 },
            { label: 'CAPS-5', b: data.baseline.caps5, f: data.final.caps5 },
        ];

        for (const m of metrics) {
            if (y > PAGE_H - 20) { doc.addPage(); y = 20; }
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(30, 41, 59);
            doc.text(m.label, MARGIN, y);

            doc.setFont('helvetica', 'normal');
            doc.text(nr(m.b), MARGIN + 55, y);
            doc.text(nr(m.f), MARGIN + 90, y);
            if (m.b != null && m.f != null) {
                const chg = delta(m.b, m.f);
                const color = m.f < m.b ? TEAL : m.f > m.b ? [239, 68, 68] as const : SLATE_500;
                doc.setTextColor(color[0], color[1], color[2]);
                doc.text(`${chg} (${pct(m.b, m.f)})`, MARGIN + 130, y);
                doc.setTextColor(30, 41, 59);
            } else {
                doc.text('Not recorded', MARGIN + 130, y);
            }
            y += 7;
        }

        // MEQ-30
        kv('MEQ-30 Peak', data.meq30Peak != null ? `${data.meq30Peak}/100` : 'Not recorded');
        spacer(2);

        // Response/Remission badges
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...SLATE_500);
        doc.text('RESPONSE ACHIEVED', MARGIN, y);
        doc.text('REMISSION ACHIEVED', MARGIN + 80, y);
        y += 5;
        badge(data.responseAchieved === 'YES (>=50% reduction)' ? 'YES ≥50%' : data.responseAchieved, data.responseAchieved.startsWith('YES') ? TEAL : AMBER, MARGIN, y);
        badge(data.remissionAchieved, data.remissionAchieved === 'YES' ? TEAL : AMBER, MARGIN + 80, y);
        y += 10;
    }

    spacer(4);

    // ── Section 3: Safety Summary ──────────────────────────────────────────────
    sectionHeader('3 — Safety Summary', AMBER);
    kv('Adverse Events Logged', String(data.adverseEventsCount));
    kv('Grade 3+ Events', String(data.grade3EventsCount));
    kv('Chemical Rescue Used', data.chemicalRescueUsed);
    spacer(4);

    // ── Section 4: Ongoing Care Plan ──────────────────────────────────────────
    sectionHeader('4 — Ongoing Care Plan', INDIGO);
    kv('Ongoing Vulnerabilities', data.ongoingVulnerabilities || 'Not recorded');
    kv('Referral', data.referralName || 'Pending');
    kv('Follow-up Schedule', `${data.followUpWeeks} weeks`);
    kv('Emergency Plan', data.emergencyPlanSummary || 'Not recorded');
    kv('Self-care Instructions', data.selfCareSummary || 'Not recorded');
    spacer(4);

    // ── Section 5: Clinician Sign-Off ─────────────────────────────────────────
    sectionHeader('5 — Clinician Sign-Off', SLATE_700);
    if (y > PAGE_H - 55) { doc.addPage(); y = 20; }

    // Clinician statement box
    doc.setFillColor(241, 245, 249); // slate-100
    doc.roundedRect(MARGIN, y, CONTENT_W, 20, 2, 2, 'F');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    const claimLines = doc.splitTextToSize(data.clinicianStatement || 'Clinician statement pending.', CONTENT_W - 8);
    doc.text(claimLines, MARGIN + 4, y + 6);
    y += 24;

    kv('Clinician ID', data.clinicianId);
    kv('Date Printed', today);
    spacer(6);

    // Signature line
    doc.setDrawColor(...SLATE_700);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y, MARGIN + 80, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...SLATE_500);
    doc.text('Signature', MARGIN, y + 4);
    spacer(10);

    // Disclaimer
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(...SLATE_500);
    doc.text(
        'Auto-generated by PPN Portal. Clinician review required before patient distribution.',
        MARGIN, y, { maxWidth: CONTENT_W }
    );

    // ── Footer on every page ────────────────────────────────────────────────────
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFillColor(...SLATE_900);
        doc.rect(0, PAGE_H - 10, PAGE_W, 10, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(...SLATE_500);
        doc.text(`PPN PORTAL  ·  CONFIDENTIAL  ·  Patient: ${data.patientId}`, MARGIN, PAGE_H - 3.5);
        doc.text(`Page ${i} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 3.5, { align: 'right' });
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
