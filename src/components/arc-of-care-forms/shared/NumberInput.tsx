import React from 'react';
import { Plus, Minus } from 'lucide-react';

/**
 * NumberInput - Number Input with Steppers
 * 
 * Features:
 * - +/- stepper buttons
 * - Keyboard input support
 * - Min/max validation
 * - Unit display
 * - Color-coded status
 */

interface NumberInputProps {
    value?: number;
    onChange: (value: number | undefined) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    placeholder?: string;
    status?: 'normal' | 'elevated' | 'critical';
    disabled?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
    value,
    onChange,
    min,
    max,
    step = 1,
    unit,
    placeholder,
    status = 'normal',
    disabled = false
}) => {
    const handleIncrement = () => {
        const newValue = (value ?? 0) + step;
        if (max === undefined || newValue <= max) {
            onChange(newValue);
        }
    };

    const handleDecrement = () => {
        const newValue = (value ?? 0) - step;
        if (min === undefined || newValue >= min) {
            onChange(newValue);
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'normal':
                return 'border-slate-700/50';
            case 'elevated':
                return 'border-yellow-500/50 bg-yellow-500/5';
            case 'critical':
                return 'border-red-500/50 bg-red-500/5';
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={handleDecrement}
                disabled={disabled || (min !== undefined && (value ?? 0) <= min)}
                className="w-10 h-10 flex items-center justify-center bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg text-slate-300 hover:text-slate-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <Minus className="w-4 h-4" />
            </button>

            <div className="relative flex-1">
                <input
                    type="number"
                    value={value ?? ''}
                    onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    min={min}
                    max={max}
                    step={step}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-300 text-center font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${getStatusColor()}`}
                />
                {unit && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                        {unit}
                    </span>
                )}
            </div>

            <button
                type="button"
                onClick={handleIncrement}
                disabled={disabled || (max !== undefined && (value ?? 0) >= max)}
                className="w-10 h-10 flex items-center justify-center bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg text-slate-300 hover:text-slate-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>
    );
};
