import React from 'react';

interface SectionProps {
    children: React.ReactNode;
    spacing?: 'tight' | 'default' | 'spacious';
    className?: string;
    id?: string;
}

export const Section = ({
    children,
    spacing = 'default',
    className = '',
    id
}: SectionProps) => {
    const spacingClasses = {
        tight: 'space-y-6',
        default: 'space-y-8',
        spacious: 'space-y-12'
    };

    return (
        <div id={id} className={`${spacingClasses[spacing]} ${className}`}>
            {children}
        </div>
    );
};
