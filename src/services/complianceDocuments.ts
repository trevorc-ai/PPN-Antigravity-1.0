export interface SafetyPlanData {
    patientId: string;
    siteId: string;
    clinicianId: string;
    emergencyContacts: Array<{ name: string; relationship: string; phone: string }>;
    copingStrategies: string[];
    warningSigns: string[];
    crisisResources: {
        national: string;
        local: string;
        clinician: string;
    };
    safetyCommitment: string;
}

export interface TransportationPlanData {
    patientId: string;
    sessionDate: string;
    driverName: string;
    driverPhone: string;
    pickupLocation: string;
    dropoffLocation: string;
    estimatedArrival: string;
    clinicianId: string;
}

export interface ConsentFormData {
    patientId: string;
    substanceName: string;
    doseRange: string;
    clinicianId: string;
}

export function generateSafetyPlan(data: SafetyPlanData): string {
    const lines: string[] = [
        'CLIENT SAFETY & SUPPORT PLAN',
        '────────────────────────────────────────────────',
        `Patient ID:         ${data.patientId}`,
        `Site:               ${data.siteId}`,
        `Date:               ${new Date().toLocaleDateString('en-US')}`,
        `Clinician:          ${data.clinicianId}`,
        '',
        'EMERGENCY CONTACTS',
    ];

    data.emergencyContacts.forEach((c, i) => {
        lines.push(`${i + 1}. ${c.name} / ${c.relationship} / ${c.phone}`);
    });

    lines.push('');
    lines.push('COPING STRATEGIES (in order of effectiveness)');
    data.copingStrategies.forEach((s, i) => {
        lines.push(`${i + 1}. ${s}`);
    });

    lines.push('');
    lines.push('WARNING SIGNS TO MONITOR');
    data.warningSigns.forEach(s => {
        lines.push(`• ${s}`);
    });

    lines.push('');
    lines.push('CRISIS RESOURCES');
    lines.push(`National Crisis Line: ${data.crisisResources.national}`);
    lines.push(`Local ER:             ${data.crisisResources.local}`);
    lines.push(`Clinician Contact:    ${data.crisisResources.clinician}`);

    lines.push('');
    lines.push('SAFETY COMMITMENTS');
    lines.push(`Patient: "${data.safetyCommitment}"`);

    lines.push('');
    lines.push('────────────────────────────────────────────────');
    lines.push('Clinician signature: ____________  Date: ________');
    lines.push('Patient signature:   ____________  Date: ________');

    return lines.join('\n');
}

export function generateTransportationPlan(data: TransportationPlanData): string {
    const lines: string[] = [
        'TRANSPORTATION PLAN',
        '────────────────────────────────────────────────',
        `Patient ID:    ${data.patientId}`,
        `Session Date:  ${data.sessionDate}`,
        '',
        `Confirmed Driver:   ${data.driverName}`,
        `Driver Phone:       ${data.driverPhone}`,
        `Pickup Location:    ${data.pickupLocation}`,
        `Dropoff Location:   ${data.dropoffLocation}`,
        `Estimated Arrival:  ${data.estimatedArrival}`,
        '',
        'AGREEMENT',
        'Patient confirms they will NOT operate any motor',
        'vehicle for 24 hours following session.',
        '',
        'Clinician: _______________ Date: ________'
    ];
    return lines.join('\n');
}

export function generateInformedConsent(data: ConsentFormData): string {
    const lines: string[] = [
        'INFORMED CONSENT FOR TREATMENT',
        '────────────────────────────────────────────────',
        `Patient ID:    ${data.patientId}`,
        `Substance:     ${data.substanceName}`,
        `Target Dose:   ${data.doseRange}`,
        `Date:          ${new Date().toLocaleDateString('en-US')}`,
        '',
        '1. DESCRIPTION OF TREATMENT',
        `[Initials: _____ ] I understand that ${data.substanceName} will be administered in a clinical setting.`,
        '',
        '2. RISKS & SIDE EFFECTS',
        '[Initials: _____ ] I understand the psychological and physiological risks involved.',
        '',
        '3. ALTERNATIVES TO TREATMENT',
        '[Initials: _____ ] I have been informed of alternative treatments for my condition.',
        '',
        '4. CONFIDENTIALITY',
        '[Initials: _____ ] My records will be kept private per HIPAA requirements.',
        '',
        '5. RIGHT TO WITHDRAW',
        '[Initials: _____ ] I may revoke this consent at any time prior to administration.',
        '',
        '────────────────────────────────────────────────',
        `Clinician: ${data.clinicianId}`,
        'Clinician signature: ____________  Date: ________',
        'Patient signature:   ____________  Date: ________'
    ];
    return lines.join('\n');
}

export function downloadComplianceDocument(type: 'safety' | 'transport' | 'consent', text: string, patientId: string): void {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_plan_${patientId}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}
