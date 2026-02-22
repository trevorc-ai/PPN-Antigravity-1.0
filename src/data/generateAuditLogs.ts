// Generate 200 diverse audit log records with variety for visuals
// This script creates realistic audit logs spanning 30 days with multiple actors, actions, and statuses

import { AuditLog } from '../types';

const ACTORS = [
    'Dr. Sarah Jenkins',
    'Dr. Marcus Thorne',
    'Elena Rodriguez',
    'Dr. James Wilson',
    'Dr. Aris Thorne',
    'Dr. Chen Wei',
    'Nurse Patel',
    'Dr. Maria Garcia',
    'System',
    'Admin Portal'
];

const SITES = ['NODE-01', 'NODE-02', 'NODE-04', 'NODE-07', 'NODE-09', 'NODE-12', 'GLOBAL'];

const ACTION_TYPES = [
    { action: 'SAFETY_CHECK', category: 'Security', riskLevel: 'High' },
    { action: 'PROTOCOL_VIEW', category: 'Clinical', riskLevel: 'Low' },
    { action: 'PROTOCOL_UPDATE', category: 'Clinical', riskLevel: 'Medium' },
    { action: 'SEARCH_QUERY', category: 'Clinical', riskLevel: 'Low' },
    { action: 'LOGIN_SUCCESS', category: 'Security', riskLevel: 'Low' },
    { action: 'LOGIN_FAILURE', category: 'Security', riskLevel: 'High' },
    { action: 'DATA_EXPORT', category: 'Clinical', riskLevel: 'High' },
    { action: 'LEDGER_SYNC', category: 'System', riskLevel: 'Low' },
    { action: 'AUTH_2FA_VERIFY', category: 'Security', riskLevel: 'Medium' },
    { action: 'CONSENT_VERIFIED', category: 'Clinical', riskLevel: 'Medium' },
    { action: 'ADVERSE_EVENT_LOG', category: 'Security', riskLevel: 'Critical' },
    { action: 'DOSE_ADMINISTRATION', category: 'Clinical', riskLevel: 'High' },
    { action: 'VITAL_SIGNS_RECORDED', category: 'Clinical', riskLevel: 'Low' },
    { action: 'SESSION_COMPLETE', category: 'Clinical', riskLevel: 'Low' },
    { action: 'INTEGRATION_SESSION', category: 'Clinical', riskLevel: 'Low' },
    { action: 'CONTRAINDICATION_ALERT', category: 'Security', riskLevel: 'Critical' },
    { action: 'PROTOCOL_APPROVED', category: 'Clinical', riskLevel: 'Medium' },
    { action: 'BACKUP_COMPLETE', category: 'System', riskLevel: 'Low' },
    { action: 'SECURITY_SCAN', category: 'Security', riskLevel: 'Medium' },
    { action: 'USER_CREATED', category: 'Security', riskLevel: 'Medium' }
];

const STATUSES = ['AUTHORIZED', 'VERIFIED', 'EXECUTED', 'ALERT_TRIGGERED', 'FAILED', 'PENDING'];

const SUBSTANCES = ['Psilocybin', 'MDMA', 'Ketamine', 'LSD-25', '5-MeO-DMT', 'Ibogaine'];
const MEDICATIONS = ['Lithium', 'SSRIs', 'MAOIs', 'Benzodiazepines', 'None'];

const DETAILS_TEMPLATES = [
    (substance: string, med: string) => `Interaction Analysis: ${substance} + ${med}`,
    (id: string, substance: string) => `Accessed Dossier: ${id} (${substance} Protocol)`,
    (term: string) => `Query Term: "${term}"`,
    (count: number) => `Daily Node Synchronization (${count} New Records)`,
    (ip: string) => `Login from IP: ${ip}`,
    (reason: string) => `Authentication Failed: ${reason}`,
    (format: string, count: number) => `Exported ${count} records as ${format}`,
    (id: string) => `Patient ${id} consent verified`,
    (event: string, severity: number) => `Adverse Event: ${event} (Severity ${severity}/5)`,
    (substance: string, dose: string) => `${substance} ${dose} administered`,
    (hr: number, bp: string) => `HR: ${hr} bpm, BP: ${bp} mmHg`,
    (id: string) => `Session ${id} completed successfully`,
    (substance: string, med: string) => `CRITICAL: ${substance} contraindicated with ${med}`,
    (id: string) => `Protocol ${id} approved by ethics board`,
    (size: string) => `Backup completed: ${size}`,
    (threats: number) => `Security scan: ${threats} threats detected`,
    (role: string, site: string) => `New ${role} account created for ${site}`
];

function generateHash(): string {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 4; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    hash += '...';
    for (let i = 0; i < 3; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
}

function generateTimestamp(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    date.setSeconds(Math.floor(Math.random() * 60));

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function generateDetail(actionType: string): string {
    const substance = SUBSTANCES[Math.floor(Math.random() * SUBSTANCES.length)];
    const med = MEDICATIONS[Math.floor(Math.random() * MEDICATIONS.length)];
    const patientId = `EX-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;

    switch (actionType) {
        case 'SAFETY_CHECK':
        case 'CONTRAINDICATION_ALERT':
            return `Interaction Analysis: ${substance} + ${med}`;
        case 'PROTOCOL_VIEW':
            return `Accessed Dossier: ${patientId} (${substance} Protocol)`;
        case 'SEARCH_QUERY':
            const terms = ['Nausea', 'Headache', 'Anxiety', 'Dissociation', 'Efficacy', 'Safety'];
            return `Query Term: "${terms[Math.floor(Math.random() * terms.length)]}"`;
        case 'LEDGER_SYNC':
        case 'BACKUP_COMPLETE':
            return `Daily Node Synchronization (${Math.floor(Math.random() * 50) + 1} New Records)`;
        case 'LOGIN_SUCCESS':
            return `Login from IP: 192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        case 'LOGIN_FAILURE':
            const reasons = ['Invalid Credentials', 'Expired Session', '2FA Timeout', 'Account Locked'];
            return `Authentication Failed: ${reasons[Math.floor(Math.random() * reasons.length)]}`;
        case 'DATA_EXPORT':
            const formats = ['CSV', 'Parquet', 'JSON'];
            return `Exported ${Math.floor(Math.random() * 500) + 50} records as ${formats[Math.floor(Math.random() * formats.length)]}`;
        case 'CONSENT_VERIFIED':
            return `Patient ${patientId} consent verified`;
        case 'ADVERSE_EVENT_LOG':
            const events = ['Nausea', 'Headache', 'Tachycardia', 'Hypertension', 'Panic Attack'];
            return `Adverse Event: ${events[Math.floor(Math.random() * events.length)]} (Severity ${Math.floor(Math.random() * 3) + 1}/5)`;
        case 'DOSE_ADMINISTRATION':
            const doses = ['25mg', '50mg', '100mg', '120mg', '0.5mg/kg'];
            return `${substance} ${doses[Math.floor(Math.random() * doses.length)]} administered`;
        case 'VITAL_SIGNS_RECORDED':
            return `HR: ${Math.floor(Math.random() * 40) + 60} bpm, BP: ${Math.floor(Math.random() * 40) + 100}/${Math.floor(Math.random() * 30) + 60} mmHg`;
        case 'SESSION_COMPLETE':
            return `Session ${patientId} completed successfully`;
        case 'PROTOCOL_APPROVED':
            return `Protocol ${patientId} approved by ethics board`;
        case 'SECURITY_SCAN':
            return `Security scan: ${Math.floor(Math.random() * 5)} threats detected`;
        case 'USER_CREATED':
            const roles = ['Clinician', 'Researcher', 'Administrator'];
            return `New ${roles[Math.floor(Math.random() * roles.length)]} account created for ${SITES[Math.floor(Math.random() * SITES.length)]}`;
        default:
            return `System operation completed`;
    }
}

function generateStatus(actionType: string, riskLevel: string): string {
    if (actionType === 'CONTRAINDICATION_ALERT' || actionType === 'ADVERSE_EVENT_LOG') {
        return 'ALERT_TRIGGERED';
    }
    if (actionType === 'LOGIN_FAILURE') {
        return 'FAILED';
    }
    if (actionType === 'LEDGER_SYNC' || actionType === 'BACKUP_COMPLETE') {
        return 'VERIFIED';
    }
    if (riskLevel === 'Critical' || riskLevel === 'High') {
        return Math.random() > 0.8 ? 'ALERT_TRIGGERED' : 'AUTHORIZED';
    }

    const statuses = ['AUTHORIZED', 'VERIFIED', 'EXECUTED'];
    return statuses[Math.floor(Math.random() * statuses.length)];
}

function generateWeightRange(weight: number): string {
    if (weight < 60) return '< 60kg';
    if (weight < 70) return '60-69kg';
    if (weight < 80) return '70-79kg';
    if (weight < 90) return '80-89kg';
    if (weight < 100) return '90-99kg';
    return '≥ 100kg';
}

export function generateAuditLogs(): AuditLog[] {
    const logs: AuditLog[] = [];
    const genders = ['Male', 'Female', 'Non-Binary'];

    for (let i = 0; i < 800; i++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const actionType = ACTION_TYPES[Math.floor(Math.random() * ACTION_TYPES.length)];
        const actor = actionType.action.includes('LEDGER') || actionType.action.includes('BACKUP')
            ? 'System'
            : ACTORS[Math.floor(Math.random() * (ACTORS.length - 2))]; // Exclude System and Admin Portal for most actions
        const site = SITES[Math.floor(Math.random() * SITES.length)];
        const substance = SUBSTANCES[Math.floor(Math.random() * SUBSTANCES.length)];
        const gender = genders[Math.floor(Math.random() * genders.length)];
        const age = Math.floor(Math.random() * 50) + 20; // Age 20-70
        const weight = Math.floor(Math.random() * 60) + 50; // Weight 50-110kg

        logs.push({
            id: `LOG-${String(9000 - i).padStart(4, '0')}`,
            timestamp: generateTimestamp(daysAgo),
            actor,
            action: actionType.action,
            details: generateDetail(actionType.action),
            status: generateStatus(actionType.action, actionType.riskLevel),
            hash: generateHash(),
            site,
            category: actionType.category,
            riskLevel: actionType.riskLevel,
            gender,
            substance,
            age,
            weightRange: generateWeightRange(weight)
        });
    }

    // Sort by timestamp descending (most recent first)
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Export the generated logs
export const AUDIT_LOGS: AuditLog[] = generateAuditLogs();
