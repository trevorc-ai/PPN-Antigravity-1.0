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

function pct(baseline: number, final: number): string {
    if (baseline === 0) return 'N/A';
    return `${Math.round(((final - baseline) / baseline) * 100)}%`;
}

function delta(baseline: number, final: number): string {
    const diff = final - baseline;
    return diff > 0 ? `+${diff}` : `${diff}`;
}

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

export function downloadDischargeSummary(data: DischargeSummaryData): void {
    const text = generateDischargeSummaryText(data);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discharge_summary_${data.patientId}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}
