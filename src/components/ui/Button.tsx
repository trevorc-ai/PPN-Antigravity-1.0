import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    children: React.ReactNode;
}

/**
 * Unified Button Component
 * 
 * Consolidates all button patterns across the PPN Portal:
 * - Primary actions (bg-primary)
 * - Secondary actions (bg-slate-900)
 * - Danger actions (bg-red-500)
 * - Ghost buttons (transparent)
 * - Outline buttons (border only)
 * 
 * Features:
 * - Consistent hover/active states
 * - Loading states with spinner
 * - Icon support (left or right)
 * - Accessibility (disabled, aria-busy)
 * - Responsive sizing
 * 
 * Usage:
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Save Protocol
 * </Button>
 * 
 * <Button variant="danger" loading={isDeleting} icon={<Trash />}>
 *   Delete
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'right',
    fullWidth = false,
    disabled,
    className = '',
    children,
    ...props
}) => {
    // Base styles (always applied)
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-black uppercase tracking-[0.2em] transition-all rounded-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

    // Variant styles
    const variantStyles: Record<ButtonVariant, string> = {
        primary: 'bg-primary hover:bg-blue-600 text-slate-300 shadow-lg shadow-primary/20',
        secondary: 'bg-slate-900/80 border-2 border-slate-700 hover:border-primary text-slate-300 hover:text-slate-300 hover:bg-slate-800',
        danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20',
        ghost: 'bg-transparent text-slate-300 hover:text-slate-300 hover:bg-slate-800/50',
        outline: 'bg-transparent border-2 border-slate-700 text-slate-300 hover:border-primary hover:text-slate-300'
    };

    // Size styles
    const sizeStyles: Record<ButtonSize, string> = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-8 py-3 text-[13px]',
        lg: 'px-10 py-4 text-[14px]'
    };

    // Width style
    const widthStyle = fullWidth ? 'w-full' : '';

    // Combine all styles
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`.trim();

    // Icon rendering
    const renderIcon = () => {
        if (loading) {
            return <Loader2 className="w-4 h-4 animate-spin" />;
        }
        return icon;
    };

    return (
        <button
            className={combinedClassName}
            disabled={disabled || loading}
            aria-busy={loading}
            {...props}
        >
            {iconPosition === 'left' && renderIcon()}
            <span>{children}</span>
            {iconPosition === 'right' && renderIcon()}
        </button>
    );
};

// Export convenience components for common patterns
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
    <Button variant="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
    <Button variant="secondary" {...props} />
);

export const DangerButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
    <Button variant="danger" {...props} />
);

export const GhostButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
    <Button variant="ghost" {...props} />
);

export const OutlineButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
    <Button variant="outline" {...props} />
);
