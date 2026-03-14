/**
 * Data Export Service
 * 
 * Handles exporting data from Supabase tables
 */

import { supabase } from '../supabaseClient';
import { exportMultipleTablesToCSV, type ExportData } from '../utils/csvExporter';

/**
 * List of all log tables to export
 */
// Live table names — verified against REBUILT_Schema_3-14-26.md
// Rule: always use log_* prefix for patient/clinical data tables
// SCHEMA FIX: log_user_profiles does not exist in rebuilt schema — replaced with log_patient_profiles
const LOG_TABLES = [
    'log_patient_profiles',     // FIXED: was 'log_user_profiles' (phantom table)
    'log_baseline_assessments',
    'log_clinical_records',
    'log_safety_events',
    'log_session_vitals',
    'log_longitudinal_assessments',
    'log_pulse_checks',
    'log_system_events',
];

/**
 * Export all data from all log tables
 */
export const exportAllData = async (): Promise<void> => {
    try {
        const exports: ExportData[] = [];

        // Fetch data from each table
        for (const tableName of LOG_TABLES) {
            try {
                const { data, error } = await supabase
                    .from(tableName)
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error(`Error fetching ${tableName}:`, error);
                    continue;
                }

                if (data && data.length > 0) {
                    exports.push({
                        tableName,
                        data
                    });
                }
            } catch (err) {
                console.error(`Error processing ${tableName}:`, err);
            }
        }

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const filename = `ppn_data_export_${timestamp}.csv`;

        // Export to CSV
        exportMultipleTablesToCSV(exports, filename);

        // Log export action
        await logExportAction('full_export', exports.length);

        return;
    } catch (error) {
        console.error('Error exporting data:', error);
        throw new Error('Failed to export data. Please try again.');
    }
};

/**
 * Export data for a specific patient
 */
export const exportPatientData = async (patientId: string): Promise<void> => {
    try {
        const exports: ExportData[] = [];

        // Patient demographics profile — SCHEMA FIX: table is log_patient_profiles (not log_user_profiles)
        // FK column is patient_uuid (not patient_id) — all rebuilt log_* tables use patient_uuid
        const { data: patient } = await supabase
            .from('log_patient_profiles')
            .select('*')
            .eq('patient_uuid', patientId)   // FIXED: was .eq('patient_id',...)
            .maybeSingle();

        if (patient) {
            exports.push({ tableName: 'log_patient_profiles', data: [patient] });
        }

        // Baseline assessments — FK column is patient_uuid, not patient_id
        const { data: baselines } = await supabase
            .from('log_baseline_assessments')
            .select('*')
            .eq('patient_uuid', patientId);  // FIXED: was .eq('patient_id',...)

        if (baselines && baselines.length > 0) {
            exports.push({ tableName: 'log_baseline_assessments', data: baselines });
        }

        // Clinical session records — FK column is patient_uuid, not patient_id
        const { data: sessions } = await supabase
            .from('log_clinical_records')
            .select('*')
            .eq('patient_uuid', patientId);  // FIXED: was .eq('patient_id',...)

        if (sessions && sessions.length > 0) {
            exports.push({ tableName: 'log_clinical_records', data: sessions });
        }

        // Safety events — no patient_id column exists; filter via session_id join or omit patient filter
        // For export purposes, fetch all safety events for sessions belonging to this patient
        const sessionIds = (sessions ?? []).map((s: { id: string }) => s.id);
        if (sessionIds.length > 0) {
            const { data: safety } = await supabase
                .from('log_safety_events')
                .select('*')
                .in('session_id', sessionIds); // FIXED: log_safety_events has no patient_id/patient_uuid column

            if (safety && safety.length > 0) {
                exports.push({ tableName: 'log_safety_events', data: safety });
            }
        }

        const filename = `patient_${patientId}_export_${new Date().toISOString().split('T')[0]}.csv`;
        exportMultipleTablesToCSV(exports, filename);

        await logExportAction('patient_export', exports.length, patientId);
    } catch (error) {
        console.error('Error exporting patient data:', error);
        throw new Error('Failed to export patient data. Please try again.');
    }
};

/**
 * Log export action to audit log
 * Architecture: action_type_id is an INTEGER FK to ref_system_action_types.
 * No string literals for action type. No patient_id in payload (PHI).
 */
const logExportAction = async (
    exportType: string,
    tableCount: number,
    _patientId?: string   // deliberately ignored — no PHI in log payloads
): Promise<void> => {
    try {
        // Map exportType to ref_system_action_types.action_code
        const actionCodeMap: Record<string, string> = {
            full_export: 'data_export',
            patient_export: 'patient_export',
            session_export: 'session_export',
        };
        const actionCode = actionCodeMap[exportType] ?? 'data_export';

        // Resolve INTEGER FK from controlled vocabulary
        const { data: refRow } = await supabase
            .from('ref_system_action_types')
            .select('id')
            .eq('action_code', actionCode)
            .single();

        await supabase.from('log_system_events').insert({
            action_type_id: refRow?.id ?? null,     // INTEGER FK ✅
            details: {
                export_type: actionCode,             // action code only — no free text
                table_count: tableCount,
                // patient_id intentionally omitted — PHI must not enter log payloads
                timestamp: new Date().toISOString(),
            }
        });
    } catch (error) {
        console.error('Error logging export action:', error);
    }
};

/**
 * Get export statistics
 */
export const getExportStats = async (): Promise<{
    totalRecords: number;
    tableStats: { tableName: string; count: number }[];
}> => {
    const tableStats: { tableName: string; count: number }[] = [];
    let totalRecords = 0;

    for (const tableName of LOG_TABLES) {
        try {
            const { count } = await supabase
                .from(tableName)
                .select('*', { count: 'exact', head: true });

            if (count !== null) {
                tableStats.push({ tableName, count });
                totalRecords += count;
            }
        } catch (err) {
            console.error(`Error getting count for ${tableName}:`, err);
        }
    }

    return { totalRecords, tableStats };
};
