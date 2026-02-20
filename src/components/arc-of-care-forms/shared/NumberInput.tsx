import React from 'react';
import { Plus, Minus } from 'lucide-react';

/**
 * NumberInput — Direct text entry with optional ± nudge buttons.
 *
 * UX changes (global fix):
 *   - type="number" BANNED: spinner arrows are slow and cause float corruption
 *     (e.g. 0.1 + 0.2 = 0.30000000000000004).
 *   - type="text" + inputMode="numeric" opens the numeric keyboard on iOS/Android
 *     so the user types the value directly — fastest clinical input path.
 *   - ± buttons are kept as a convenience for small ±1 nudges only.
 *   - safeAdd() clamps float precision to the step's decimal places.
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

/** Returns the number of decimal places in a number. */
const decimalPlaces = (n: number): number => {
    const s = n.toString();
    const dot = s.indexOf('.');
    return dot === -1 ? 0 : s.length - dot - 1;
};

/** Precision-safe addition to avoid JS float drift. */
const safeAdd = (a: number, b: number): number => {
    const places = Math.max(decimalPlaces(a), decimalPlaces(b));
    return parseFloat((a + b).toFixed(places));
};

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
        const next = safeAdd(value ?? 0, step);
        if (max === undefined || next <= max) onChange(next);
    };

    const handleDecrement = () => {
        const next = safeAdd(value ?? 0, -step);
        if (min === undefined || next >= min) onChange(next);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        if (raw === '' || raw === '-') { onChange(undefined); return; }
        const parsed = parseFloat(raw);
        if (!isNaN(parsed)) onChange(parsed);
    };

    const getStatusColor = () => {
        switch (status) {
            case 'normal': return 'border-slate-700/50';
            case 'elevated': return 'border-yellow-500/50 bg-yellow-500/5';
            case 'critical': return 'border-red-500/50 bg-red-500/5';
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={handleDecrement}
                disabled={disabled || (min !== undefined && (value ?? 0) <= min)}
                className="w-10 h-10 flex items-center justify-center bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg text-slate-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Decrease value"
            >
                <Minus className="w-4 h-4" />
            </button>

            <div className="relative flex-1">
                {/* type="text" + inputMode="numeric": no spinner arrows, numeric keyboard on mobile */}
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*\.?[0-9]*"
                    value={value ?? ''}
                    onChange={handleTextChange}
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
                className="w-10 h-10 flex items-center justify-center bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg text-slate-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Increase value"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>
    );
};
