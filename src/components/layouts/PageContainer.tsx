import React from 'react';

interface PageContainerProps {
    children: React.ReactNode;
    width?: 'default' | 'wide' | 'narrow' | 'full';
    padding?: 'default' | 'compact' | 'spacious';
    className?: string;
}

export const PageContainer = ({
    children,
    width = 'default',
    padding = 'default',
    className = ''
}: PageContainerProps) => {
    const widthClasses = {
        default: 'w-full max-w-7xl 2xl:max-w-[1440px]', // Dynamically wider on large screens (27" monitor ready)
        wide: 'w-full max-w-[1600px] 2xl:max-w-[1920px]', // Extra wide for dashboards/maps
        narrow: 'w-full max-w-4xl',
        full: 'w-full max-w-none'
    };

    const paddingClasses = {
        compact: 'px-4 sm:px-6',
        default: 'px-6 sm:px-8 xl:px-10',
        spacious: 'px-8 sm:px-12 xl:px-16'
    };

    return (
        <div className={`${widthClasses[width]} ${paddingClasses[padding]} mx-auto ${className}`}>
            {children}
        </div>
    );
};
