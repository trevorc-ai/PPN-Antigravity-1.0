/**
 * MobileBottomNav — WO-551 thumb-zone navigation bar
 *
 * Shown only on mobile/tablet (< lg breakpoint).
 * Desktop uses the left Sidebar as normal.
 *
 * Layout (left → right):
 *   Search · Dashboard · [Wellness — raised center CTA] · Analytics · Protocols
 *
 * Design rules:
 * - All tap targets ≥ 44px (WCAG 2.5.5)
 * - Active route: indigo tint + indigo label (matches existing sidebar active style)
 * - Raised center pill: glass indigo tint + border (dim, not blinding solid fill)
 * - Glass background with border-top separation
 * - spring-animated active dot via framer-motion layoutId
 */

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavItem {
    label: string;
    path: string;
    icon: string;
    exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Search', path: '/search', icon: 'search' },
    { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { label: 'Wellness', path: '/wellness-journey', icon: 'spa' },
    { label: 'Analytics', path: '/analytics', icon: 'insights' },
    { label: 'Protocols', path: '/protocols', icon: 'assignment' },
];

const SPRING = { type: 'spring', stiffness: 360, damping: 28 } as const;

// Shared active colours matching the existing sidebar active style
const ACTIVE_ICON = 'text-indigo-400';
const ACTIVE_LABEL = 'text-indigo-300';
const IDLE_ICON = 'text-slate-500';
const IDLE_LABEL = 'text-slate-400';

export const MobileBottomNav: React.FC = () => {
    const location = useLocation();
    const wellnessActive = location.pathname.startsWith('/wellness-journey');

    return (
        <nav
            aria-label="Primary mobile navigation"
            className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
        >
            {/* Icon + label row — always exactly 60px, never clipped */}
            <div className="relative bg-[#0a1628]/92 backdrop-blur-xl border-t border-slate-800/80 h-[68px] flex items-center justify-around pb-2">

            {/* All 5 nav items rendered uniformly */}
                {NAV_ITEMS.map((item) => (
                    <NavItem key={item.path} item={item} />
                ))}
            </div>
            {/* Safe-area spacer — fills the home-indicator zone on notched devices */}
            <div className="bg-[#0a1628]/92" style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
        </nav>
    );
};

/** Individual nav tab — icon + label + spring active dot */
const NavItem: React.FC<{ item: NavItem }> = ({ item }) => (
    <NavLink
        to={item.path}
        aria-label={item.label}
        className="flex-1 flex flex-col items-center gap-0.5 pt-2 pb-1 px-1 min-w-0 relative"
    >
        {({ isActive }) => (
            <>
                {/* Active indicator dot */}
                {isActive && (
                    <motion.div
                        layoutId="mobile-nav-dot"
                        transition={SPRING}
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-indigo-500"
                    />
                )}

                <motion.span
                    whileTap={{ scale: 0.82 }}
                    transition={SPRING}
                    className={`material-symbols-outlined text-2xl transition-colors ${isActive ? ACTIVE_ICON : IDLE_ICON
                        }`}
                    aria-hidden="true"
                >
                    {item.icon}
                </motion.span>

                <span
                    className={`text-[10px] tracking-wide transition-colors truncate max-w-full text-center ${isActive ? ACTIVE_LABEL : IDLE_LABEL
                        }`}
                >
                    {item.label}
                </span>
            </>
        )}
    </NavLink>
);

export default MobileBottomNav;
