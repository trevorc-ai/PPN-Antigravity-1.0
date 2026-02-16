import React from 'react';

interface ButtonGroupOption {
    value: string;
    label: string;
}

interface ButtonGroupProps {
    label?: string;
    options: ButtonGroupOption[];
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
    label,
    options,
    value,
    onChange,
    required = false,
    className = ''
}) => {
    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-slate-200">
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}
            <div className="flex gap-2">
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={`
              flex-1 px-4 py-2 rounded-lg border transition-all duration-200
              ${value === option.value
                                ? 'bg-indigo-500 border-indigo-500 text-slate-300 font-semibold'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:border-indigo-500 hover:text-slate-200'
                            }
            `}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
