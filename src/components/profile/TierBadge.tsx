import React from 'react';
import { Star, Diamond, Gift } from 'lucide-react';

interface TierBadgeProps {
    tier: string;
    className?: string;
}

const getTierConfig = (tier: string) => {
    const normalizedTier = tier?.toLowerCase() || 'free';

    switch (normalizedTier) {
        case 'partner':
            return {
                label: 'Partner',
                bgColor: 'bg-purple-500/10',
                borderColor: 'border-purple-500/30',
                textColor: 'text-purple-400',
                icon: Star,
                iconColor: 'text-yellow-400'
            };
        case 'pro':
            return {
                label: 'Pro',
                bgColor: 'bg-blue-500/10',
                borderColor: 'border-blue-500/30',
                textColor: 'text-blue-400',
                icon: Diamond,
                iconColor: 'text-blue-300'
            };
        case 'free':
        default:
            return {
                label: 'Free',
                bgColor: 'bg-slate-900/50',
                borderColor: 'border-slate-700',
                textColor: 'text-slate-400',
                icon: Gift,
                iconColor: 'text-slate-500'
            };
    }
};

export const TierBadge: React.FC<TierBadgeProps> = ({ tier, className = '' }) => {
    const config = getTierConfig(tier);
    const Icon = config.icon;

    return (
        <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.bgColor} ${config.borderColor} ${className}`}
            role="status"
            aria-label={`${config.label} tier member`}
        >
            <Icon className={`w-4 h-4 ${config.iconColor}`} aria-hidden="true" />
            <span className={`text-xs font-black uppercase tracking-widest ${config.textColor}`}>
                {config.label}
            </span>
        </div>
    );
};

export default TierBadge;
