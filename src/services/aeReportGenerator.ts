/**
 * aeReportGenerator.ts — WO-309 Deliverable 3
 * Adverse Event Auto-Report Generator (CTCAE v5.0 format)
 *
 * TRIGGER: Called automatically by SafetyAndAdverseEventForm → onComplete.
 * OUTPUT: Formatted text report exported as .txt download.
 *         report_pdf_url stored to log_safety_events in DB.
 *
 * PRIVACY: Patient is referenced by Subject_ID only. No PHI in output.
 * CTCAE: Common Terminology Criteria for Adverse Events v5.0 (NCI, 2017).
 */

import { supabase } from '../supabaseClient';

// ============================================================================
// TYPES
// ============================================================================

export type CTCAEGrade = 1 | 2 | 3 | 4 | 5;

export interface AEReportData {
    // Patient & session identifiers — Subject_ID only, no PHI
    patientLinkCode: string;   // Subject_ID
    siteId: string;
    safetyEventId: string;     // log_safety_events.id (for DB update)
    sessionDate: string;       // ISO date
    substance: string;
    doseMg?: number;
    reportAuthorId: string;    // auth.users.id

    // Incident details
    eventType: string;         // e.g. 'Physiological', 'Psychological', 'Behavioral'
    eventDescription: string;  // Provider's free-text description
    ctcaeGrade: CTCAEGrade;
    onsetTimeMinutesPostDose?: number;
    durationMinutes?: number;
    outcome: 'Resolved' | 'Ongoing' | 'Referred to Emergency Services' | 'Hospitalized' | 'Unknown';

    // Interventions
    interventions: AEIntervention[];

    // Resolution
    resolutionNote?: string;
}

export interface AEIntervention {
    timeMinutesPostDose: number;
    description: string;                    // e.g. 'Verbal grounding technique applied'
    pharmacological?: {
        drugName: string;
        doseMg: number;
        route: string;                         // e.g. 'oral', 'IM'
    };
}

// ============================================================================
// CTCAE GRADE DEFINITIONS (v5.0)
// ============================================================================

const CTCAE_GRADE_LABELS: Record<CTCAEGrade, { label: string; description: string }> = {
    1: { label: 'Grade 1 — Mild', description: 'Asymptomatic or mild symptoms; no intervention indicated.' },
    2: { label: 'Grade 2 — Moderate', description: 'Minimal intervention indicated; limiting age-appropriate daily activity.' },
    3: { label: 'Grade 3 — Severe', description: 'Medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated.' },
    4: { label: 'Grade 4 — Life-threatening', description: 'Life-threatening consequences; urgent intervention indicated.' },
    5: { label: 'Grade 5 — Death', description: 'Death related to adverse event.' },
};

// ============================================================================
// REPORT GENERATION (Text Format)
// ============================================================================

function formatTime(minutesPostDose?: number): string {
    if (minutesPostDose === undefined) return '[time not recorded]';
    if (minutesPostDose < 60) return `T+${minutesPostDose}min`;
    const h = Math.floor(minutesPostDose / 60);
    const m = minutesPostDose % 60;
    return `T+${h}h${m > 0 ? `${m}min` : ''}`;
}

function buildAEReportText(data: AEReportData): string {
    const grade = CTCAE_GRADE_LABELS[data.ctcaeGrade];
    const regulatoryNotice = data.ctcaeGrade >= 3
        ? '[ACTION REQUIRED] Grade 3+ event — report to site oversight board and OHA within 72 hours per OAR 333-333-5000'
        : 'Regulatory notification not required (Grade 1–2).';

    const lines: string[] = [
        '══════════════════════════════════════════════════════════',
        'ADVERSE EVENT INCIDENT REPORT',
        'PPN Research Portal — Confidential Clinical Document',
        '══════════════════════════════════════════════════════════',
        '',
        `Patient ID:          ${data.patientLinkCode}`,
        `Site ID:             ${data.siteId}`,
        `Session Date:        ${new Date(data.sessionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        `Substance:           ${data.substance}${data.doseMg ? ` ${data.doseMg}mg` : ''}`,
        `Report Generated:    ${new Date().toLocaleString('en-US')}`,
        `Report Author:       ${data.reportAuthorId}`,
        '',
        '──────────────────────────────────────────────────────────',
        'INCIDENT DESCRIPTION',
        '──────────────────────────────────────────────────────────',
        '',
        `Category:            ${data.eventType}`,
        `Severity Grade:      ${grade.label}`,
        `                     ${grade.description}`,
        `Onset Time:          ${formatTime(data.onsetTimeMinutesPostDose)}`,
        `Duration:            ${data.durationMinutes ? `${data.durationMinutes} minutes` : '[not recorded]'}`,
        `Outcome:             ${data.outcome}`,
        '',
        'Description:',
        data.eventDescription,
        '',
        '──────────────────────────────────────────────────────────',
        'INTERVENTION LOG',
        '──────────────────────────────────────────────────────────',
        '',
    ];

    if (data.interventions.length === 0) {
        lines.push('No pharmacological or clinical interventions required.');
    } else {
        data.interventions.forEach((inv, i) => {
            lines.push(`[${formatTime(inv.timeMinutesPostDose)}] ${inv.description}`);
            if (inv.pharmacological) {
                const p = inv.pharmacological;
                lines.push(`            Pharmacological rescue: ${p.drugName} ${p.doseMg}mg ${p.route}`);
            }
            if (i < data.interventions.length - 1) lines.push('');
        });
    }

    lines.push('');
    lines.push('──────────────────────────────────────────────────────────');
    lines.push('RESOLUTION');
    lines.push('──────────────────────────────────────────────────────────');
    lines.push('');
    lines.push(data.resolutionNote ?? '[Resolution note not provided]');
    lines.push('');
    lines.push('──────────────────────────────────────────────────────────');
    lines.push('REGULATORY NOTIFICATION');
    lines.push('──────────────────────────────────────────────────────────');
    lines.push('');
    lines.push(regulatoryNotice);
    lines.push('');
    lines.push('──────────────────────────────────────────────────────────');
    lines.push('');
    lines.push(`Provider Signature:  ${'_'.repeat(30)}    Date: ${'_'.repeat(15)}`);
    lines.push('');
    lines.push('══════════════════════════════════════════════════════════');

    return lines.join('\n');
}

// ============================================================================
// DOWNLOAD (browser trigger)
// ============================================================================

function downloadReportAsText(text: string, filename: string): void {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============================================================================
// DB UPDATE — store report reference on log_safety_events
// ============================================================================

async function persistReportReference(
    safetyEventId: string,
    ctcaeGrade: CTCAEGrade,
    reportTimestamp: string
): Promise<void> {
    // We store a synthetic reference URL since report is client-generated text.
    // In a future sprint this can be replaced with a real Supabase Storage upload.
    const syntheticUrl = `client-generated://ae-report-${safetyEventId}-${reportTimestamp}`;

    const { error } = await supabase
        .from('log_safety_events')
        .update({
            report_pdf_url: syntheticUrl,
            report_generated_at: reportTimestamp,
            ctcae_grade: ctcaeGrade,
        })
        .eq('id', safetyEventId);

    if (error) {
        console.error('[aeReportGenerator] Failed to persist report reference:', error.message);
    }
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * generateAEReport
 * Primary entry point — called by SafetyAndAdverseEventForm onComplete.
 * 1. Builds report text.
 * 2. Triggers browser download.
 * 3. Persists report reference + ctcae_grade to log_safety_events.
 * 4. Returns whether regulatory notification is required (Grade 3+).
 */
export async function generateAEReport(data: AEReportData): Promise<{
    regulatoryNotificationRequired: boolean;
    reportText: string;
}> {
    const reportText = buildAEReportText(data);
    const timestamp = new Date().toISOString();
    const filename = `ae_report_${data.patientLinkCode}_${data.sessionDate}.txt`;

    // Download in browser
    downloadReportAsText(reportText, filename);

    // Persist reference to DB
    await persistReportReference(data.safetyEventId, data.ctcaeGrade, timestamp);

    const regulatoryNotificationRequired = data.ctcaeGrade >= 3;

    return { regulatoryNotificationRequired, reportText };
}

/**
 * isGrade3OrAbove
 * Convenience check — used by UI to show the regulatory action banner.
 */
export function isGrade3OrAbove(grade: CTCAEGrade): boolean {
    return grade >= 3;
}
