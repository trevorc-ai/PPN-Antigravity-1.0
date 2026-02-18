import React, { useState } from 'react';
import { Star } from 'lucide-react';

/**
 * StarRating - 1-5 Star Rating Input
 * 
 * Features:
 * - Interactive hover states
 * - Emoji feedback (😔 → 😊)
 * - Large touch targets (mobile-friendly)
 * - Keyboard accessible
 */

interface StarRatingProps {
    value?: number;
    onChange: (value: number) => void;
    max?: number;
    showEmoji?: boolean;
    disabled?: boolean;
}

const emojiMap: Record<number, string> = {
    1: '😔',
    2: '😕',
    3: '😐',
    4: '🙂',
    5: '😊'
};

export const StarRating: React.FC<StarRatingProps> = ({
    value,
    onChange,
    max = 5,
    showEmoji = true,
    disabled = false
}) => {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const displayValue = hoverValue ?? value ?? 0;

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
                {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => !disabled && onChange(star)}
                        onMouseEnter={() => !disabled && setHoverValue(star)}
                        onMouseLeave={() => setHoverValue(null)}
                        disabled={disabled}
                        className="group transition-transform hover:scale-110 active:scale-95 disabled:cursor-not-allowed"
                        aria-label={`Rate ${star} out of ${max}`}
                    >
                        <Star
                            className={`w-8 h-8 transition-all ${star <= displayValue
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-transparent text-slate-400 group-hover:text-slate-400'
                                }`}
                        />
                    </button>
                ))}
            </div>

            {showEmoji && displayValue > 0 && (
                <div className="text-3xl animate-in fade-in zoom-in duration-200">
                    {emojiMap[displayValue] || emojiMap[5]}
                </div>
            )}

            {value && (
                <span className="text-slate-300 text-sm font-medium">
                    {value}/{max}
                </span>
            )}
        </div>
    );
};
