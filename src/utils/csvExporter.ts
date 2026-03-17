/**
 * CSV Exporter Utility
 * 
 * Converts data to CSV format and triggers download
 */

export interface ExportData {
    tableName: string;
    data: any[];
}

/**
 * Convert array of objects to CSV string
 */
export const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return '';

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create header row
    const headerRow = headers.join(',');

    // Create data rows
    const dataRows = data.map(row => {
        return headers.map(header => {
            const value = row[header];

            // Handle null/undefined
            if (value === null || value === undefined) return '';

            // Handle dates
            if (value instanceof Date) return value.toISOString();

            // Handle strings with commas or quotes
            if (typeof value === 'string') {
                if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }

            // Handle objects/arrays
            if (typeof value === 'object') {
                return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            }

            return String(value);
        }).join(',');
    });

    return [headerRow, ...dataRows].join('\n');
};

/**
 * Download CSV file
 */
export const downloadCSV = (filename: string, csvContent: string): void => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};

/**
 * Export multiple tables to a single CSV with table separators
 */
export const exportMultipleTablesToCSV = (exports: ExportData[], filename: string): void => {
    const csvSections = exports.map(({ tableName, data }) => {
        const csv = convertToCSV(data);
        return `\n\n=== ${tableName.toUpperCase()} ===\n\n${csv}`;
    });

    const fullCSV = csvSections.join('\n');
    downloadCSV(filename, fullCSV);
};

/**
 * Export single table to CSV
 */
export const exportTableToCSV = (tableName: string, data: any[]): void => {
    const csv = convertToCSV(data);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${tableName}_${timestamp}.csv`;
    downloadCSV(filename, csv);
};

// ─── MedDRA Adverse Event Lookup ─────────────────────────────────────────────
// Structure mirrors MedDRA hierarchy: SOC → PT → LLT
// Codes sourced from MedDRA v26.1. Update when a new version is licensed.

interface MedDRAEntry {
    soc_code: string;
    soc_term: string;
    pt_code: string;
    pt_term: string;
    llt_code: string;
    llt_term: string;
}

// Maps PPN's internal adverse_event_type enum to MedDRA terms (use DB codes as-is)
const MEDDRA_MAP: Record<string, MedDRAEntry> = {
    anxiety:           { soc_code: '10037175', soc_term: 'Psychiatric disorders',      pt_code: '10002855', pt_term: 'Anxiety',              llt_code: '10016524', llt_term: 'Feeling anxious' },
    nausea:            { soc_code: '10017947', soc_term: 'Gastrointestinal disorders',  pt_code: '10028813', pt_term: 'Nausea',               llt_code: '10028817', llt_term: 'Nausea' },
    vomiting:          { soc_code: '10017947', soc_term: 'Gastrointestinal disorders',  pt_code: '10047700', pt_term: 'Vomiting',             llt_code: '10047698', llt_term: 'Vomiting' },
    hypertension:      { soc_code: '10007541', soc_term: 'Cardiac disorders',           pt_code: '10020772', pt_term: 'Hypertension',         llt_code: '10020773', llt_term: 'Hypertension' },
    tachycardia:       { soc_code: '10007541', soc_term: 'Cardiac disorders',           pt_code: '10043071', pt_term: 'Tachycardia',          llt_code: '10043073', llt_term: 'Tachycardia' },
    headache:          { soc_code: '10029205', soc_term: 'Nervous system disorders',    pt_code: '10019211', pt_term: 'Headache',             llt_code: '10019212', llt_term: 'Headache' },
    dizziness:         { soc_code: '10029205', soc_term: 'Nervous system disorders',    pt_code: '10013573', pt_term: 'Dizziness',            llt_code: '10013574', llt_term: 'Dizziness' },
    difficult_content: { soc_code: '10037175', soc_term: 'Psychiatric disorders',      pt_code: '10012218', pt_term: 'Disturbance in attention', llt_code: '10012759', llt_term: 'Emotional distress' },
    dissociation:      { soc_code: '10037175', soc_term: 'Psychiatric disorders',      pt_code: '10013226', pt_term: 'Dissociation',         llt_code: '10013227', llt_term: 'Dissociation' },
    paranoia:          { soc_code: '10037175', soc_term: 'Psychiatric disorders',      pt_code: '10033906', pt_term: 'Paranoia',             llt_code: '10033907', llt_term: 'Paranoid ideation' },
    myalgia:           { soc_code: '10028395', soc_term: 'Musculoskeletal and connective tissue disorders', pt_code: '10028411', pt_term: 'Myalgia', llt_code: '10028412', llt_term: 'Muscle ache' },
    fatigue:           { soc_code: '10022891', soc_term: 'General disorders',           pt_code: '10016256', pt_term: 'Fatigue',              llt_code: '10016258', llt_term: 'Fatigue' },
    insomnia:          { soc_code: '10037175', soc_term: 'Psychiatric disorders',      pt_code: '10022437', pt_term: 'Insomnia',             llt_code: '10022438', llt_term: 'Insomnia' },
    other:             { soc_code: '10037196', soc_term: 'Investigations',              pt_code: '10065420', pt_term: 'Adverse event of interest', llt_code: '10065421', llt_term: 'Adverse event not otherwise specified' },
};

/**
 * Looks up MedDRA codes for a PPN adverse event type string.
 * Falls back to 'other' entry if the type is unrecognised.
 */
export function getMedDRACodes(adverseEventType: string): MedDRAEntry {
    const key = adverseEventType.toLowerCase().replace(/[\s-]/g, '_');
    return MEDDRA_MAP[key] ?? MEDDRA_MAP['other'];
}

// ─── Research CSV Export (MedDRA-structured) ─────────────────────────────────

export interface ResearchRecord {
    subject_id: string;
    age_group: string;
    substance: string;
    dose_mg: number | null;
    route: string;
    session_date: string;
    meq30_total: number | null;
    phq9_baseline: number | null;
    phq9_followup: number | null;
    gad7_baseline: number | null;
    gad7_followup: number | null;
    pcl5_baseline: number | null;
    pcl5_followup: number | null;
    pulse_check_adherence_pct: number | null;
    integration_sessions_attended: number | null;
    adverse_events: Array<{
        type: string;
        severity: string;
        relatedness: string;
        outcome: string;
    }>;
}

/**
 * Exports de-identified research data with MedDRA-coded adverse event columns.
 * Produces one row per adverse event (flat). Sessions with no AEs produce one row with AE fields blank.
 * Always downloads as .csv (not .txt).
 */
export const exportResearchCSV = (records: ResearchRecord[]): void => {
    const rows: string[] = [];

    // Headers
    const headers = [
        'subject_id', 'age_group', 'substance', 'dose_mg', 'route', 'session_date',
        'meq30_total', 'phq9_baseline', 'phq9_followup', 'gad7_baseline', 'gad7_followup',
        'pcl5_baseline', 'pcl5_followup', 'pulse_check_adherence_pct', 'integration_sessions_attended',
        // MedDRA adverse event columns
        'ae_meddra_soc_code', 'ae_meddra_soc_term',
        'ae_meddra_pt_code', 'ae_meddra_pt_term',
        'ae_meddra_llt_code', 'ae_meddra_llt_term',
        'ae_ctcae_grade', 'ae_relatedness', 'ae_outcome',
    ];
    rows.push(headers.join(','));

    for (const rec of records) {
        const base = [
            rec.subject_id,
            rec.age_group,
            rec.substance,
            rec.dose_mg ?? '',
            rec.route,
            rec.session_date,
            rec.meq30_total ?? '',
            rec.phq9_baseline ?? '',
            rec.phq9_followup ?? '',
            rec.gad7_baseline ?? '',
            rec.gad7_followup ?? '',
            rec.pcl5_baseline ?? '',
            rec.pcl5_followup ?? '',
            rec.pulse_check_adherence_pct ?? '',
            rec.integration_sessions_attended ?? '',
        ];

        if (rec.adverse_events.length === 0) {
            // One row with empty AE columns
            rows.push([...base, '', '', '', '', '', '', '', '', ''].join(','));
        } else {
            for (const ae of rec.adverse_events) {
                const meddra = getMedDRACodes(ae.type);
                const aeRow = [
                    meddra.soc_code, `"${meddra.soc_term}"`,
                    meddra.pt_code,  `"${meddra.pt_term}"`,
                    meddra.llt_code, `"${meddra.llt_term}"`,
                    ae.severity,
                    ae.relatedness,
                    ae.outcome,
                ];
                rows.push([...base, ...aeRow].join(','));
            }
        }
    }

    const csv = rows.join('\n');
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(`ppn-research-export-meddra-${timestamp}.csv`, csv);
};

