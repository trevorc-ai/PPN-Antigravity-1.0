import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    spacing?: 'tight' | 'default' | 'spacious';
    className?: string;
}

export const Section = ({
    children,
    spacing = 'default',
    className = '',
    ...rest
}: SectionProps) => {
    const spacingClasses = {
        tight: 'space-y-6',
        default: 'space-y-8',
        spacious: 'space-y-12'
    };

    return (
        <div className={`${spacingClasses[spacing]} ${className}`} {...rest}>
            {children}
        </div>
    );
};
