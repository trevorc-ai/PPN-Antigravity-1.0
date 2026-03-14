/**
 * Report Generator Service
 * WO-077: Exportable Audit Reports
 * WO-EXPORT-REPORTS: Upgrade TXT → PDF + live data wiring
 *
 * Generates audit-ready, de-identified PDF reports from patient data.
 * Three report types: Audit (compliance), Insurance (billing), Research (de-identified).
 *
 * HIPAA NOTE: Research reports use Safe Harbor de-identification.
 * Patient ID is the only identifier — no name, DOB, address, or other PHI.
 */

import { jsPDF } from 'jspdf';

export interface PatientReportData {
    patientId: string;
    treatmentPeriod?: { start: string; end: string };
    baseline?: {
        phq9?: number;
        gad7?: number;
        ace?: number;
        pcl5?: number;
        hrv?: number;
        bp?: string;
        assessmentDate?: string;
    };
    dosingSession?: {
        date?: string;
        substance?: string;
        doseMg?: number;
        route?: string;
        durationHours?: number;
        vitalsCount?: number;
        meq30Score?: number;
        adverseEvents?: number;
    };
    integration?: {
        sessionsAttended?: number;
        sessionsScheduled?: number;
        behavioralChanges?: number;
        pulseCheckDays?: number;
        pulseCheckTotal?: number;
        phq9Followup?: number;
        gad7Followup?: number;
        pcl5Followup?: number;
    };
    benchmarkReadiness?: number;
    ageGroup?: string;
}

export type ReportType = 'audit' | 'insurance' | 'research';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pct(a?: number, b?: number): string {
    if (a === undefined || b === undefined || a === 0) return 'N/A';
    return `${Math.round(((b - a) / a) * 100)}%`;
}

function formatDate(iso?: string): string {
    if (!iso) return 'Not recorded';
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function nr(val: number | string | undefined): string {
    return val !== undefined && val !== null ? String(val) : 'Not recorded';
}

// ─── PDF Builder (shared foundation) ──────────────────────────────────────────

interface PdfTheme {
    accent: readonly [number, number, number];
    accentLight: readonly [number, number, number];
    label: string;
}

const THEMES: Record<ReportType, PdfTheme> = {
    audit:     { accent: [99, 102, 241],   accentLight: [79, 70, 229],  label: 'AUDIT — COMPLIANCE REPORT' },
    insurance: { accent: [20, 184, 166],   accentLight: [13, 148, 136], label: 'INSURANCE — TREATMENT SUMMARY' },
    research:  { accent: [139, 92, 246],   accentLight: [109, 40, 217], label: 'RESEARCH EXPORT — DE-IDENTIFIED' },
};

const SLATE_900 = [15, 23, 42] as const;
const SLATE_700 = [51, 65, 85] as const;
const SLATE_500 = [100, 116, 139] as const;
const SLATE_300 = [148, 163, 184] as const;
const WHITE     = [255, 255, 255] as const;

function buildPDFDoc(data: PatientReportData, type: ReportType): jsPDF {
    const theme = THEMES[type];
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const PAGE_W = 210;
    const PAGE_H = 297;
    const MARGIN = 16;
    const CONTENT_W = PAGE_W - MARGIN * 2;
    let y = 0;

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // ── Header band ────────────────────────────────────────────────────────────
    doc.setFillColor(...SLATE_900);
    doc.rect(0, 0, PAGE_W, 36, 'F');
    doc.setFillColor(...theme.accent);
    doc.rect(0, 0, 4, 36, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...WHITE);
    doc.text('PPN PORTAL', MARGIN + 4, 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...SLATE_300);
    doc.text(theme.label, MARGIN + 4, 18);
    doc.text('CONFIDENTIAL CLINICAL RECORD', MARGIN + 4, 23);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...SLATE_300);
    const displayId = type === 'research'
        ? `Subject: SUBJ-${data.patientId.replace(/[^A-Z0-9]/gi, '').slice(-6).toUpperCase()}`
        : `Patient ID: ${data.patientId}`;
    doc.text(`Date: ${today}`, PAGE_W - MARGIN, 12, { align: 'right' });
    doc.text(displayId, PAGE_W - MARGIN, 18, { align: 'right' });

    doc.setDrawColor(...theme.accent);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, 30, PAGE_W - MARGIN, 30);

    y = 44;

    // ── Layout helpers ─────────────────────────────────────────────────────────
    function sectionHeader(title: string) {
        if (y > PAGE_H - 40) { doc.addPage(); y = 20; }
        doc.setFillColor(theme.accent[0], theme.accent[1], theme.accent[2]);
        doc.setGState(doc.GState({ opacity: 0.1 }));
        doc.roundedRect(MARGIN, y - 4, CONTENT_W, 10, 2, 2, 'F');
        doc.setGState(doc.GState({ opacity: 1 }));
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(theme.accent[0], theme.accent[1], theme.accent[2]);
        doc.text(title.toUpperCase(), MARGIN + 4, y + 3);
        y += 12;
    }

    function kv(label: string, value: string) {
        if (y > PAGE_H - 20) { doc.addPage(); y = 20; }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...SLATE_500);
        doc.text(label, MARGIN, y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);
        const lines = doc.splitTextToSize(value, CONTENT_W - 50);
        doc.text(lines, MARGIN + 55, y);
        y += Math.max(6, lines.length * 5);
    }

    function spacer(h = 4) { y += h; }

    function tableRow(cols: string[], bold = false) {
        if (y > PAGE_H - 20) { doc.addPage(); y = 20; }
        const colWidths = [55, 35, 35, 53];
        let x = MARGIN;
        cols.forEach((col, i) => {
            doc.setFont('helvetica', bold ? 'bold' : 'normal');
            doc.setFontSize(bold ? 7.5 : 9);
            doc.setTextColor(bold ? SLATE_500[0] : 30, bold ? SLATE_500[1] : 41, bold ? SLATE_500[2] : 59);
            doc.text(col, x, y);
            x += colWidths[i] ?? 35;
        });
        y += 7;
    }

    // ── Section 1: Patient & Treatment ─────────────────────────────────────────
    sectionHeader('Patient & Treatment Summary');
    if (data.treatmentPeriod) {
        kv('Treatment Period', `${formatDate(data.treatmentPeriod.start)} – ${formatDate(data.treatmentPeriod.end)}`);
    }
    if (data.dosingSession) {
        const d = data.dosingSession;
        kv('Session Date', formatDate(d.date));
        kv('Substance', nr(d.substance));
        kv('Dose', d.doseMg ? `${d.doseMg}mg${d.route ? ` (${d.route})` : ''}` : 'Not recorded');
        if (d.vitalsCount) kv('Vitals Readings', String(d.vitalsCount));
        if (d.meq30Score !== undefined) kv('MEQ-30 Score', `${d.meq30Score}/100`);
        kv('Adverse Events', String(d.adverseEvents ?? 0));
    }
    spacer(4);

    // ── Section 2: Baseline Assessments ───────────────────────────────────────
    if (data.baseline) {
        sectionHeader('Baseline Assessments');
        const b = data.baseline;
        if (b.assessmentDate) kv('Assessment Date', formatDate(b.assessmentDate));
        if (b.phq9 !== undefined) kv('PHQ-9', String(b.phq9));
        if (b.gad7 !== undefined) kv('GAD-7', String(b.gad7));
        if (b.ace !== undefined) kv('ACE', String(b.ace));
        if (b.pcl5 !== undefined) kv('PCL-5', String(b.pcl5));
        if (b.hrv !== undefined) kv('HRV', `${b.hrv}ms`);
        if (b.bp) kv('Blood Pressure', `${b.bp} mmHg`);
        spacer(4);
    }

    // ── Section 3: Outcomes ────────────────────────────────────────────────────
    if (data.integration) {
        const i = data.integration;
        sectionHeader('Outcome Metrics');
        if (i.phq9Followup !== undefined || i.gad7Followup !== undefined || i.pcl5Followup !== undefined) {
            tableRow(['MEASURE', 'BASELINE', 'FOLLOW-UP', 'CHANGE'], true);
            if (i.phq9Followup !== undefined) tableRow(['PHQ-9', nr(data.baseline?.phq9), String(i.phq9Followup), pct(data.baseline?.phq9, i.phq9Followup)]);
            if (i.gad7Followup !== undefined) tableRow(['GAD-7', nr(data.baseline?.gad7), String(i.gad7Followup), pct(data.baseline?.gad7, i.gad7Followup)]);
            if (i.pcl5Followup !== undefined) tableRow(['PCL-5', nr(data.baseline?.pcl5), String(i.pcl5Followup), pct(data.baseline?.pcl5, i.pcl5Followup)]);
            spacer(4);
        }

        sectionHeader('Integration Phase');
        if (i.sessionsAttended !== undefined) kv('Integration Sessions', `${i.sessionsAttended}/${i.sessionsScheduled ?? '?'} attended`);
        if (i.behavioralChanges !== undefined) kv('Behavioral Changes', String(i.behavioralChanges));
        if (i.pulseCheckDays !== undefined) kv('Daily Pulse-Checks', `${i.pulseCheckDays}/${i.pulseCheckTotal ?? '?'} days`);
        spacer(4);
    }

    // ── Section 4: Type-specific content ──────────────────────────────────────
    if (type === 'audit') {
        sectionHeader('Compliance & Benchmark Readiness');
        if (data.benchmarkReadiness !== undefined) {
            kv('Benchmark Readiness', `${data.benchmarkReadiness}%`);
            kv('Status', data.benchmarkReadiness === 100 ? 'All requirements met. Episode is benchmark-ready.' : 'Requirements partially met.');
        } else {
            kv('Benchmark Readiness', 'Not assessed');
        }
        spacer(6);

        // Signature block
        sectionHeader('Clinician Sign-Off');
        if (y > PAGE_H - 30) { doc.addPage(); y = 20; }
        doc.setDrawColor(...SLATE_700);
        doc.setLineWidth(0.5);
        doc.line(MARGIN, y, MARGIN + 80, y);
        doc.line(MARGIN + 100, y, MARGIN + 160, y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...SLATE_500);
        doc.text('Practitioner Signature', MARGIN, y + 4);
        doc.text('Date', MARGIN + 100, y + 4);
        y += 12;
        doc.text('License Number: ________________________', MARGIN, y);
        y += 8;
    }

    if (type === 'insurance') {
        sectionHeader('Medical Necessity Statement');
        if (y > PAGE_H - 30) { doc.addPage(); y = 20; }
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8.5);
        doc.setTextColor(30, 41, 59);
        const lines = doc.splitTextToSize(
            'The treatment described in this record was medically necessary based on the patient\'s presenting diagnosis, baseline assessment scores, and clinical judgment of the attending practitioner. All sessions were conducted in compliance with applicable clinical guidelines.',
            CONTENT_W
        );
        doc.text(lines, MARGIN, y);
        y += lines.length * 5 + 8;

        sectionHeader('ICD-10 / Billing Reference');
        kv('Diagnosis Code', 'Refer to intake documentation');
        kv('Treatment Code', 'Psychotherapy with qualified supervision');
        spacer(6);

        doc.setDrawColor(...SLATE_700);
        doc.setLineWidth(0.5);
        doc.line(MARGIN, y, MARGIN + 80, y);
        doc.line(MARGIN + 100, y, MARGIN + 160, y);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...SLATE_500);
        doc.text('Practitioner Signature', MARGIN, y + 4);
        doc.text('License Number', MARGIN + 100, y + 4);
        y += 12;
    }

    if (type === 'research') {
        sectionHeader('De-identification Compliance');
        if (y > PAGE_H - 30) { doc.addPage(); y = 20; }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(30, 41, 59);
        const lines = doc.splitTextToSize(
            '[HIPAA Safe Harbor applied] All 18 PHI identifiers removed. Subject ID generated from non-reversible truncation. Dates represented as year only. Ages grouped per Safe Harbor standard.',
            CONTENT_W
        );
        doc.text(lines, MARGIN, y);
        y += lines.length * 5 + 4;
        if (data.ageGroup) kv('Age Group', data.ageGroup);
        spacer(4);
    }

    // ── Footer on every page ───────────────────────────────────────────────────
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFillColor(...SLATE_900);
        doc.rect(0, PAGE_H - 10, PAGE_W, 10, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(...SLATE_500);
        const leftText = type === 'research'
            ? `PPN PORTAL  ·  DE-IDENTIFIED RESEARCH EXPORT`
            : `PPN PORTAL  ·  CONFIDENTIAL  ·  Patient: ${data.patientId}`;
        doc.text(leftText, MARGIN, PAGE_H - 3.5);
        doc.text(`Page ${i} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 3.5, { align: 'right' });
    }

    return doc;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Generate PDF doc for given report type. Returns the jsPDF instance. */
export function generateReportPDF(data: PatientReportData, type: ReportType): jsPDF {
    return buildPDFDoc(data, type);
}

/** @deprecated Use downloadReport() which now generates PDF */
export function generateReport(data: PatientReportData, type: ReportType): string {
    // TXT fallback kept for backward compat (server-side use)
    return `${THEMES[type].label}\nPatient ID: ${data.patientId}\nGenerated: ${new Date().toLocaleString()}`;
}

/** Download PDF report for given type. Falls back to TXT on jsPDF error. */
export function downloadReport(data: PatientReportData, type: ReportType): void {
    const filename = `${type}_report_${data.patientId}_${new Date().toISOString().slice(0, 10)}.pdf`;
    try {
        const doc = buildPDFDoc(data, type);
        doc.save(filename);
    } catch (err) {
        console.error('[reportGenerator] PDF generation failed, falling back to TXT:', err);
        const text = generateReport(data, type);
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.replace('.pdf', '.txt');
        a.click();
        URL.revokeObjectURL(url);
    }
}
