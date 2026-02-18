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
