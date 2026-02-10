import React from 'react';

interface GlassmorphicCardProps {
    children: React.ReactNode;
    className?: string;
    hoverable?: boolean;
}

export const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
    children,
    className = '',
    hoverable = true
}) => {
    return (
        <div className={`glassmorphic-card ${hoverable ? 'hoverable' : ''} ${className}`}>
            {children}
            <style jsx>{`
        .glassmorphic-card {
          background: rgba(45, 36, 56, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glassmorphic-card.hoverable:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 48px rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.3);
        }
      `}</style>
        </div>
    );
};
