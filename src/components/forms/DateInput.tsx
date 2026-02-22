import React, { useState } from 'react';

interface DateInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    label?: string;
}

/**
 * Custom DateInput Component
 * Replaces native <input type="date"> with clean, structured date input
 * Format: MM/DD/YYYY
 * No number spinners, clean UX
 */
export const DateInput: React.FC<DateInputProps> = ({
    value,
    onChange,
    placeholder = 'MM/DD/YYYY',
    className = '',
    label
}) => {
    const [displayValue, setDisplayValue] = useState(value || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let input = e.target.value.replace(/\D/g, ''); // Remove non-digits

        // Auto-format with slashes
        if (input.length >= 2) {
            input = input.slice(0, 2) + '/' + input.slice(2);
        }
        if (input.length >= 5) {
            input = input.slice(0, 5) + '/' + input.slice(5, 9);
        }

        setDisplayValue(input);

        // Only call onChange if we have a complete date or empty
        if (input.length === 10) {
            // Validate format MM/DD/YYYY
            const parts = input.split('/');
            const month = parseInt(parts[0]);
            const day = parseInt(parts[1]);
            const year = parseInt(parts[2]);

            if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1900 && year <= 2100) {
                onChange(input);
            }
        } else if (input.length === 0) {
            onChange('');
        }
    };

    return (
        <div className="w-full">
            {label && (
                <label className="text-sm font-black text-slate-300 uppercase tracking-widest mb-2 block">
                    {label}
                </label>
            )}
            <input
                type="text"
                value={displayValue}
                onChange={handleChange}
                placeholder={placeholder}
                maxLength={10}
                className={`w-full bg-[#0a0c10] border border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-[#A8B5D1] transition-colors placeholder:text-slate-500 ${className}`}
            />
        </div>
    );
};
