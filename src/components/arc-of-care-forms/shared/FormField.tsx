import React from 'react';
import { AdvancedTooltip } from '../../ui/AdvancedTooltip';

/**
 * FormField - Reusable Field Wrapper
 * 
 * Provides consistent layout for all form inputs:
 * - Label with optional tooltip
 * - Error message display
 * - Required indicator
 * - Help text
 */

interface FormFieldProps {
    label: string;
    htmlFor?: string;
    required?: boolean;
    error?: string;
    helpText?: string;
    tooltip?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    htmlFor,
    required = false,
    error,
    helpText,
    tooltip,
    icon,
    children
}) => {
    return (
        <div className="space-y-2">
            <label
                htmlFor={htmlFor}
                className="flex items-center gap-2 text-base font-bold text-slate-300"
            >
                {icon && <span className="w-4 h-4">{icon}</span>}
                {label}
                {required && <span className="text-red-400">*</span>}
                {tooltip && (
                    <AdvancedTooltip content={tooltip} tier="micro">
                        <span className="text-slate-400 cursor-help">ⓘ</span>
                    </AdvancedTooltip>
                )}
            </label>
            {children}
            {error && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                    <span>⚠️</span>
                    {error}
                </p>
            )}
            {helpText && !error && (
                <p className="text-slate-400 text-sm">{helpText}</p>
            )}
        </div>
    );
};
