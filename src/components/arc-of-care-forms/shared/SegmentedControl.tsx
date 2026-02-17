import React from 'react';

/**
 * SegmentedControl - Radio Button Group (Horizontal Pills)
 * 
 * Features:
 * - Horizontal pill layout
 * - Single selection (radio behavior)
 * - Smooth animations
 * - Keyboard accessible
 */

interface SegmentedControlOption {
    value: string | number;
    label: string;
    icon?: React.ReactNode;
}

interface SegmentedControlProps {
    options: SegmentedControlOption[];
    value?: string | number;
    onChange: (value: string | number) => void;
    disabled?: boolean;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
    options,
    value,
    onChange,
    disabled = false
}) => {
    return (
        <div className="inline-flex items-center gap-2 p-1 bg-slate-900/60 border border-slate-700/50 rounded-lg">
            {options.map((option) => {
                const isSelected = value === option.value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => !disabled && onChange(option.value)}
                        disabled={disabled}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${isSelected
                                ? 'bg-blue-500 text-slate-300 shadow-lg shadow-blue-500/20'
                                : 'text-slate-300 hover:text-slate-300 hover:bg-slate-800/50'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        aria-pressed={isSelected}
                    >
                        {option.icon && <span className="w-4 h-4">{option.icon}</span>}
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};
