import React from 'react';

interface SectionProps {
    children: React.ReactNode;
    spacing?: 'tight' | 'default' | 'spacious';
    className?: string;
}

export const Section = ({
    children,
    spacing = 'default',
    className = ''
}: SectionProps) => {
    const spacingClasses = {
        tight: 'space-y-6',
        default: 'space-y-8',
        spacious: 'space-y-12'
    };

    return (
        <div className={`${spacingClasses[spacing]} ${className}`}>
            {children}
        </div>
    );
};
