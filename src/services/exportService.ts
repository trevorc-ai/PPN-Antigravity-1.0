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
// Live table names — verified against Supabase DB 2026-02-17
// Rule: always use log_* prefix for patient/clinical data tables
const LOG_TABLES = [
    'log_user_profiles',        // was: 'patients'
    'log_baseline_assessments', // was: 'baseline_assessments'
    'log_clinical_records',     // was: 'dosing_sessions'
    'log_safety_events',        // was: 'safety_events'
    'log_session_vitals',
    'log_longitudinal_assessments',
    'log_pulse_checks',
    'log_system_events',        // was: 'audit_logs'
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

        // Patient info (log_user_profiles is the live table)
        const { data: patient } = await supabase
            .from('log_user_profiles')
            .select('*')
            .eq('patient_id', patientId)
            .single();

        if (patient) {
            exports.push({ tableName: 'patient_info', data: [patient] });
        }

        // Baseline assessments
        const { data: baselines } = await supabase
            .from('log_baseline_assessments')
            .select('*')
            .eq('patient_id', patientId);

        if (baselines && baselines.length > 0) {
            exports.push({ tableName: 'log_baseline_assessments', data: baselines });
        }

        // Dosing sessions (log_clinical_records is the live table)
        const { data: sessions } = await supabase
            .from('log_clinical_records')
            .select('*')
            .eq('patient_id', patientId);

        if (sessions && sessions.length > 0) {
            exports.push({ tableName: 'log_clinical_records', data: sessions });
        }

        // Safety events
        const { data: safety } = await supabase
            .from('log_safety_events')
            .select('*')
            .eq('patient_id', patientId);

        if (safety && safety.length > 0) {
            exports.push({ tableName: 'log_safety_events', data: safety });
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
 */
const logExportAction = async (
    exportType: string,
    tableCount: number,
    patientId?: string
): Promise<void> => {
    try {
        await supabase.from('log_system_events').insert({
            action: 'data_export',
            details: {
                export_type: exportType,
                table_count: tableCount,
                patient_id: patientId,
                timestamp: new Date().toISOString()
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
