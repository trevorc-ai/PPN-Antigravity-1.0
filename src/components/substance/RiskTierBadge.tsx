import React from 'react';
import type { RiskTier } from '../../types';

interface RiskTierBadgeProps {
    tier?: RiskTier;
    size?: 'sm' | 'md';
    className?: string;
}

const TIER_CONFIG: Record<RiskTier, { icon: string; label: string; classes: string }> = {
    'CARDIAC RISK': {
        icon: 'monitor_heart',
        label: 'CARDIAC RISK',
        classes: 'bg-red-500/10 text-red-400 border-red-500/30',
    },
    'MAOI INTERACTION RISK': {
        icon: 'warning',
        label: 'MAOI INTERACTION RISK',
        classes: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    },
    'DISSOCIATIVE PROTOCOL': {
        icon: 'psychology_alt',
        label: 'DISSOCIATIVE PROTOCOL',
        classes: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    },
    'FDA APPROVED · REMS': {
        icon: 'verified',
        label: 'FDA APPROVED · REMS',
        classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    'STANDARD MONITORING': {
        icon: 'health_and_safety',
        label: 'STANDARD MONITORING',
        classes: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    },
};

/**
 * RiskTierBadge — reusable risk classification chip.
 * Used on SubstanceCard (catalog) and MonographHero (detail page).
 * Never uses color alone — always pairs icon + label for accessibility.
 */
const RiskTierBadge: React.FC<RiskTierBadgeProps> = ({
    tier = 'STANDARD MONITORING',
    size = 'sm',
    className = '',
}) => {
    const config = TIER_CONFIG[tier];
    const textSize = size === 'sm' ? 'text-[11px]' : 'text-xs';
    const iconSize = size === 'sm' ? 'text-[13px]' : 'text-sm';
    const padding = size === 'sm' ? 'px-2.5 py-1' : 'px-3 py-1.5';

    return (
        <span
            className={`inline-flex items-center gap-1.5 ${padding} rounded-full border font-black uppercase tracking-widest ${textSize} ${config.classes} ${className}`}
            aria-label={`Risk tier: ${config.label}`}
        >
            <span className={`material-symbols-outlined ${iconSize}`} aria-hidden="true">
                {config.icon}
            </span>
            {config.label}
        </span>
    );
};

export default RiskTierBadge;
