export type NoteFormat = 'SOAP' | 'DAP' | 'BIRP';

export interface StructuredIntegrationSessionData {
    patientNarrative: string;
    functionalStatus: string;
    clinicianObservations: string;
    behavioralIndicators: string;
    engagementLevel: string;
    themes: string;
    progressRating: number;
    riskAtDischarge: string;
    nextSessionDate: string;
    homeworkAssigned: string;
    referrals: string;
    medicationChanges?: string;
    duration: string;
    clinicianCredentials: string;
}

export function generateProgressNote(
    session: StructuredIntegrationSessionData,
    format: NoteFormat,
    patientId: string,
    clinicianId: string,
    sessionNumber: number
): string {
    const today = new Date().toLocaleDateString('en-US');

    if (format === 'SOAP') {
        const lines = [
            'PROGRESS NOTE — SOAP FORMAT',
            `Patient ID: ${patientId}       Date: ${today}`,
            `Session #: ${sessionNumber}                 Duration: ${session.duration}`,
            '',
            'SUBJECTIVE',
            'Patient-reported experience this session:',
            `"${session.patientNarrative}"`,
            `Current functioning: ${session.functionalStatus}`,
            '',
            'OBJECTIVE',
            `Clinician observations: ${session.clinicianObservations}`,
            `Behavioral indicators noted: ${session.behavioralIndicators}`,
            `Session engagement level: ${session.engagementLevel}`,
            '',
            'ASSESSMENT',
            `Integration themes identified: ${session.themes}`,
            `Progress toward goals: ${session.progressRating}/10`,
            `Risk level at discharge: ${session.riskAtDischarge}`,
            '',
            'PLAN',
            `Next session scheduled: ${session.nextSessionDate}`,
            `Between-session assignments: ${session.homeworkAssigned}`,
            `Referrals made: ${session.referrals}`,
            `Medication changes: ${session.medicationChanges ?? 'None'}`,
            '',
            '────────────────────────────────',
            `Clinician: ${clinicianId}`,
            `Credentials: ${session.clinicianCredentials}`,
            'Signature: _______________ Date: ________'
        ];
        return lines.join('\n');
    }

    if (format === 'DAP') {
        const lines = [
            'PROGRESS NOTE — DAP FORMAT',
            `Patient ID: ${patientId}       Date: ${today}`,
            `Session #: ${sessionNumber}                 Duration: ${session.duration}`,
            '',
            'DATA',
            `Patient reported: "${session.patientNarrative}"`,
            `Clinician observations: ${session.clinicianObservations}`,
            `Behavioral indicators: ${session.behavioralIndicators}`,
            `Engagement: ${session.engagementLevel}`,
            '',
            'ASSESSMENT',
            `Themes: ${session.themes}`,
            `Functional Status: ${session.functionalStatus}`,
            `Progress Rating: ${session.progressRating}/10`,
            `Risk Status: ${session.riskAtDischarge}`,
            '',
            'PLAN',
            `Next steps: ${session.nextSessionDate}`,
            `Homework: ${session.homeworkAssigned}`,
            `Referrals: ${session.referrals}`,
            `Meds: ${session.medicationChanges ?? 'None'}`,
            '',
            '────────────────────────────────',
            `Clinician: ${clinicianId}`,
            `Credentials: ${session.clinicianCredentials}`,
            'Signature: _______________ Date: ________'
        ];
        return lines.join('\n');
    }

    if (format === 'BIRP') {
        const lines = [
            'PROGRESS NOTE — BIRP FORMAT',
            `Patient ID: ${patientId}       Date: ${today}`,
            `Session #: ${sessionNumber}                 Duration: ${session.duration}`,
            '',
            'BEHAVIOR',
            `Patient behavior presentation: ${session.behavioralIndicators}`,
            `Clinician observations: ${session.clinicianObservations}`,
            `Engagement level: ${session.engagementLevel}`,
            '',
            'INTERVENTION',
            `Integration themes worked on: ${session.themes}`,
            `Clinical interventions applied to narrative: "${session.patientNarrative}"`,
            '',
            'RESPONSE',
            `Patient functional response: ${session.functionalStatus}`,
            `Progress indicator: ${session.progressRating}/10`,
            '',
            'PLAN',
            `Safety / Risk state: ${session.riskAtDischarge}`,
            `Homework given: ${session.homeworkAssigned}`,
            `Follow-up / Referrals: ${session.referrals}`,
            `Next Appt: ${session.nextSessionDate}`,
            '',
            '────────────────────────────────',
            `Clinician: ${clinicianId}`,
            `Credentials: ${session.clinicianCredentials}`,
            'Signature: _______________ Date: ________'
        ];
        return lines.join('\n');
    }

    return '';
}
