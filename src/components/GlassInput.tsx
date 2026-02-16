import React, { InputHTMLAttributes } from 'react';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

/**
 * GlassInput Component
 * Implements GLASSMORPHISM effect from Antigravity Physics Dictionary
 * - backdrop-filter: blur(12px)
 * - Semi-transparent background
 * - High-contrast border for accessibility (Deuteranopia)
 */
export const GlassInput: React.FC<GlassInputProps> = ({
    label,
    error,
    helperText,
    className = '',
    ...props
}) => {
    return (
        <div className="glass-input-wrapper">
            {label && (
                <label className="block text-sm font-bold text-slate-200 mb-2">
                    {label}
                </label>
            )}

            <div className="relative">
                {/* GLASSMORPHISM - The 'Material' Effect */}
                <input
                    {...props}
                    className={`
            w-full px-4 py-3 
            backdrop-blur-[12px]
            bg-white/5
            border-2 border-white/20
            rounded-xl
            text-slate-300 placeholder-slate-400
            focus:outline-none 
            focus:border-indigo-400/60
            focus:bg-white/8
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-400/60 bg-red-500/5' : ''}
            ${className}
          `}
                    style={{
                        // Ensure glassmorphism works
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                    }}
                />

                {/* Focus ring for accessibility */}
                <div className="absolute inset-0 rounded-xl pointer-events-none ring-2 ring-transparent focus-within:ring-indigo-400/30 transition-all" />
            </div>

            {/* Error or Helper Text */}
            {error && (
                <p className="mt-2 text-sm text-red-400 font-medium">
                    {error}
                </p>
            )}

            {helperText && !error && (
                <p className="mt-2 text-xs text-slate-400">
                    {helperText}
                </p>
            )}

            <style jsx>{`
        .glass-input-wrapper input::placeholder {
          color: rgba(148, 163, 184, 0.6);
        }
        
        /* Ensure high contrast for color blindness */
        .glass-input-wrapper input:focus {
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        
        /* Respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .glass-input-wrapper input {
            transition: none;
          }
        }
      `}</style>
        </div>
    );
};
