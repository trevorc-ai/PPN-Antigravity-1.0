import React from 'react';

interface DateInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    label?: string;
}

/**
 * DateInput Component with Calendar Picker
 * Uses native HTML5 date input with calendar dropdown
 * Format: YYYY-MM-DD (converted to MM/DD/YYYY for display if needed)
 */
export const DateInput: React.FC<DateInputProps> = ({
    value,
    onChange,
    placeholder = 'Select date',
    className = '',
    label
}) => {
    // Convert MM/DD/YYYY to YYYY-MM-DD for HTML5 input
    const toInputFormat = (dateStr: string): string => {
        if (!dateStr) return '';
        if (dateStr.includes('-')) return dateStr; // Already in YYYY-MM-DD

        // Convert MM/DD/YYYY to YYYY-MM-DD
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
        }
        return '';
    };

    // Convert YYYY-MM-DD to MM/DD/YYYY for state
    const toDisplayFormat = (dateStr: string): string => {
        if (!dateStr) return '';
        if (dateStr.includes('/')) return dateStr; // Already in MM/DD/YYYY

        // Convert YYYY-MM-DD to MM/DD/YYYY
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return `${parts[1]}/${parts[2]}/${parts[0]}`;
        }
        return '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value; // YYYY-MM-DD from HTML5 input
        const displayValue = toDisplayFormat(inputValue); // Convert to MM/DD/YYYY
        onChange(displayValue);
    };

    return (
        <div className="w-full">
            {label && (
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2 block">
                    {label}
                </label>
            )}
            <input
                type="date"
                value={toInputFormat(value)}
                onChange={handleChange}
                placeholder={placeholder}
                className={`w-full bg-[#0a0c10] border border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-primary transition-colors placeholder:text-slate-600 cursor-pointer ${className}`}
                style={{
                    colorScheme: 'dark' // Makes calendar dropdown dark themed
                }}
            />
        </div>
    );
};
