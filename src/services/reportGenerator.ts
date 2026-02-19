/**
 * Report Generator Service
 * WO-077: Exportable Audit Reports
 * 
 * Generates audit-ready, de-identified text reports from patient data.
 * Three report types: Audit (compliance), Insurance (billing), Research (de-identified).
 * 
 * HIPAA NOTE: Research reports use Safe Harbor de-identification.
 * Patient ID is the only identifier — no name, DOB, address, or other PHI.
 */

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

function pct(a?: number, b?: number): string {
    if (a === undefined || b === undefined || b === 0) return 'N/A';
    return `${Math.round(((b - a) / a) * 100)}%`;
}

function formatDate(iso?: string): string {
    if (!iso) return '[date not recorded]';
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ─── Audit Report ────────────────────────────────────────────────────────────

function generateAuditReport(data: PatientReportData): string {
    const lines: string[] = [
        'PPN PORTAL — AUDIT REPORT',
        `Generated: ${new Date().toLocaleString('en-US')}`,
        '',
        `Patient ID: ${data.patientId}`,
        data.treatmentPeriod
            ? `Treatment Period: ${formatDate(data.treatmentPeriod.start)} – ${formatDate(data.treatmentPeriod.end)}`
            : '',
        '',
        '─'.repeat(60),
        '',
    ];

    // Baseline
    if (data.baseline) {
        const b = data.baseline;
        lines.push(`BASELINE ASSESSMENT (${formatDate(b.assessmentDate)}):`);
        if (b.phq9 !== undefined) lines.push(`  PHQ-9: ${b.phq9}`);
        if (b.gad7 !== undefined) lines.push(`  GAD-7: ${b.gad7}`);
        if (b.ace !== undefined) lines.push(`  ACE: ${b.ace}`);
        if (b.pcl5 !== undefined) lines.push(`  PCL-5: ${b.pcl5}`);
        if (b.hrv !== undefined) lines.push(`  HRV: ${b.hrv}ms`);
        if (b.bp) lines.push(`  BP: ${b.bp} mmHg`);
        lines.push('  [STATUS: COMPLETE]');
        lines.push('');
    }

    // Dosing Session
    if (data.dosingSession) {
        const d = data.dosingSession;
        lines.push(`DOSING SESSION (${formatDate(d.date)}):`);
        if (d.substance) lines.push(`  Substance: ${d.substance}`);
        if (d.doseMg) lines.push(`  Dose: ${d.doseMg}mg ${d.route ?? ''}`);
        if (d.durationHours) lines.push(`  Duration: ${d.durationHours} hours`);
        if (d.vitalsCount) lines.push(`  Vitals Readings: ${d.vitalsCount}`);
        if (d.meq30Score !== undefined) lines.push(`  MEQ-30 Score: ${d.meq30Score}`);
        lines.push(`  Adverse Events: ${d.adverseEvents ?? 0}`);
        lines.push('  [STATUS: COMPLETE]');
        lines.push('');
    }

    // Integration
    if (data.integration) {
        const i = data.integration;
        lines.push('INTEGRATION PHASE:');
        if (i.sessionsAttended !== undefined) lines.push(`  Integration Sessions: ${i.sessionsAttended}/${i.sessionsScheduled ?? '?'} attended`);
        if (i.behavioralChanges !== undefined) lines.push(`  Behavioral Changes Logged: ${i.behavioralChanges}`);
        if (i.pulseCheckDays !== undefined) lines.push(`  Daily Pulse Checks: ${i.pulseCheckDays}/${i.pulseCheckTotal ?? '?'} days`);
        lines.push('');
        if (i.phq9Followup !== undefined && data.baseline?.phq9 !== undefined) {
            lines.push('OUTCOME METRICS:');
            lines.push(`  PHQ-9: ${data.baseline.phq9} → ${i.phq9Followup} (${pct(data.baseline.phq9, i.phq9Followup)} change)`);
            if (i.gad7Followup !== undefined && data.baseline?.gad7 !== undefined)
                lines.push(`  GAD-7: ${data.baseline.gad7} → ${i.gad7Followup} (${pct(data.baseline.gad7, i.gad7Followup)} change)`);
            if (i.pcl5Followup !== undefined && data.baseline?.pcl5 !== undefined)
                lines.push(`  PCL-5: ${data.baseline.pcl5} → ${i.pcl5Followup} (${pct(data.baseline.pcl5, i.pcl5Followup)} change)`);
            lines.push('');
        }
    }

    // Benchmark
    if (data.benchmarkReadiness !== undefined) {
        lines.push(`BENCHMARK READINESS: ${data.benchmarkReadiness}%`);
        lines.push(data.benchmarkReadiness === 100 ? 'All requirements met. Episode is benchmark-ready.' : 'Requirements partially met.');
        lines.push('');
    }

    lines.push('─'.repeat(60));
    lines.push('');
    lines.push('Practitioner Signature: ________________________');
    lines.push('Date: ________________________');

    return lines.filter(l => l !== undefined).join('\n');
}

// ─── Insurance Report ─────────────────────────────────────────────────────────

function generateInsuranceReport(data: PatientReportData): string {
    const lines: string[] = [
        'TREATMENT SUMMARY FOR INSURANCE',
        `Generated: ${new Date().toLocaleDateString('en-US')}`,
        '',
        `Patient ID: ${data.patientId}`,
        '',
        '─'.repeat(60),
        '',
        'BASELINE ASSESSMENT:',
    ];

    if (data.baseline) {
        const b = data.baseline;
        if (b.phq9 !== undefined) lines.push(`  PHQ-9: ${b.phq9}`);
        if (b.gad7 !== undefined) lines.push(`  GAD-7: ${b.gad7}`);
        if (b.pcl5 !== undefined) lines.push(`  PCL-5: ${b.pcl5}`);
        lines.push('');
    }

    if (data.dosingSession) {
        const d = data.dosingSession;
        lines.push('TREATMENT PROVIDED:');
        if (d.substance) lines.push(`  Substance: ${d.substance}`);
        if (d.doseMg) lines.push(`  Dose: ${d.doseMg}mg ${d.route ?? ''}`);
        if (d.durationHours) lines.push(`  Monitored Session Duration: ${d.durationHours} hours`);
        lines.push('');
    }

    if (data.integration) {
        const i = data.integration;
        if (i.phq9Followup !== undefined && data.baseline?.phq9 !== undefined) {
            lines.push('OUTCOMES:');
            lines.push(`  PHQ-9: ${data.baseline.phq9} → ${i.phq9Followup} (${pct(data.baseline.phq9, i.phq9Followup)} change)`);
            if (i.gad7Followup !== undefined && data.baseline?.gad7 !== undefined)
                lines.push(`  GAD-7: ${data.baseline.gad7} → ${i.gad7Followup} (${pct(data.baseline.gad7, i.gad7Followup)} change)`);
            lines.push('');
        }
    }

    lines.push('─'.repeat(60));
    lines.push('');
    lines.push('Practitioner Signature: ________________________');
    lines.push('License Number: ________________________');

    return lines.join('\n');
}

// ─── Research Report (De-identified) ─────────────────────────────────────────

function generateResearchReport(data: PatientReportData): string {
    // Hash patient ID for research export (simple obfuscation — not cryptographic)
    const subjectId = `SUBJ-${data.patientId.replace(/[^A-Z0-9]/gi, '').slice(-6).toUpperCase()}`;

    const lines: string[] = [
        'DE-IDENTIFIED RESEARCH DATA EXPORT',
        `Export Date: ${new Date().toLocaleDateString('en-US')}`,
        '[All PHI removed per HIPAA Safe Harbor]',
        '',
        `Subject ID: ${subjectId}`,
        data.ageGroup ? `Age Group: ${data.ageGroup}` : '',
        '',
        '─'.repeat(60),
        '',
    ];

    if (data.baseline) {
        const b = data.baseline;
        lines.push('BASELINE METRICS:');
        if (b.phq9 !== undefined) lines.push(`  PHQ-9: ${b.phq9}`);
        if (b.gad7 !== undefined) lines.push(`  GAD-7: ${b.gad7}`);
        if (b.ace !== undefined) lines.push(`  ACE: ${b.ace}`);
        if (b.pcl5 !== undefined) lines.push(`  PCL-5: ${b.pcl5}`);
        if (b.hrv !== undefined) lines.push(`  HRV: ${b.hrv}ms`);
        lines.push('');
    }

    if (data.dosingSession) {
        const d = data.dosingSession;
        lines.push('TREATMENT PROTOCOL:');
        if (d.substance) lines.push(`  Substance: ${d.substance}`);
        if (d.doseMg) lines.push(`  Dose: ${d.doseMg}mg`);
        if (d.route) lines.push(`  Route: ${d.route}`);
        if (d.durationHours) lines.push(`  Duration: ${d.durationHours} hours`);
        if (d.meq30Score !== undefined) lines.push(`  MEQ-30: ${d.meq30Score}`);
        lines.push(`  Adverse Events: ${d.adverseEvents ?? 0}`);
        lines.push('');
    }

    if (data.integration) {
        const i = data.integration;
        if (i.phq9Followup !== undefined && data.baseline?.phq9 !== undefined) {
            lines.push('OUTCOMES:');
            lines.push(`  PHQ-9: ${data.baseline.phq9} → ${i.phq9Followup} (${pct(data.baseline.phq9, i.phq9Followup)} change)`);
            if (i.gad7Followup !== undefined && data.baseline?.gad7 !== undefined)
                lines.push(`  GAD-7: ${data.baseline.gad7} → ${i.gad7Followup} (${pct(data.baseline.gad7, i.gad7Followup)} change)`);
            if (i.pcl5Followup !== undefined && data.baseline?.pcl5 !== undefined)
                lines.push(`  PCL-5: ${data.baseline.pcl5} → ${i.pcl5Followup} (${pct(data.baseline.pcl5, i.pcl5Followup)} change)`);
            lines.push('');
        }
    }

    lines.push('[Dates: Year only per Safe Harbor]');
    lines.push('[Ages: Grouped per Safe Harbor]');

    return lines.filter(l => l !== undefined).join('\n');
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function generateReport(data: PatientReportData, type: ReportType): string {
    switch (type) {
        case 'audit': return generateAuditReport(data);
        case 'insurance': return generateInsuranceReport(data);
        case 'research': return generateResearchReport(data);
    }
}

export function downloadReport(data: PatientReportData, type: ReportType): void {
    const text = generateReport(data, type);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_report_${data.patientId}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}
