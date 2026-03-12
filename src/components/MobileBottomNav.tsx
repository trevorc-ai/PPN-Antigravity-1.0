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
    // center slot — rendered separately as raised pill
    { label: 'Analytics', path: '/analytics', icon: 'insights' },
    { label: 'Protocols', path: '/protocols', icon: 'assignment' },
];

const SPRING = { type: 'spring', stiffness: 360, damping: 28 } as const;

// Shared active colours — aligned with mockup primary (#2b6cee)
const ACTIVE_ICON = 'text-primary';
const ACTIVE_LABEL = 'text-primary';
const IDLE_ICON = 'text-slate-500';
const IDLE_LABEL = 'text-slate-500';

export const MobileBottomNav: React.FC = () => {
    const location = useLocation();
    const wellnessActive = location.pathname.startsWith('/wellness-journey');

    return (
        <nav
            aria-label="Primary mobile navigation"
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        >
            {/* Glass bar */}
            <div className="relative bg-[#0a1628]/92 backdrop-blur-xl border-t border-slate-800/80 flex items-end justify-around min-h-[56px] pb-[env(safe-area-inset-bottom,0px)]">

                {/* Left two items: Search + Dashboard */}
                {NAV_ITEMS.slice(0, 2).map((item) => (
                    <NavItem key={item.path} item={item} />
                ))}

                {/* Center: Wellness Journey — flat, aligned with other tabs */}
                <NavLink
                    to="/wellness-journey"
                    aria-label="Wellness Journey"
                    className="flex flex-col items-center gap-0.5 pt-2 pb-1 px-4 min-w-[56px] relative"
                >
                    {wellnessActive && (
                        <motion.div
                            layoutId="mobile-nav-dot"
                            transition={SPRING}
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-primary"
                        />
                    )}
                    <motion.div
                        whileTap={{ scale: 0.82 }}
                        transition={SPRING}
                        className={[
                            'w-10 h-10 rounded-full flex items-center justify-center',
                            'border transition-colors',
                            wellnessActive
                                ? 'bg-primary/15 border-primary/50'
                                : 'bg-transparent border-transparent',
                        ].join(' ')}
                    >
                        <span
                            className={`material-symbols-outlined text-2xl transition-colors ${wellnessActive ? 'text-primary' : 'text-slate-500'}`}
                            aria-hidden="true"
                        >
                            spa
                        </span>
                    </motion.div>
                    <span
                        className={`text-xs font-bold tracking-wide transition-colors ${wellnessActive ? 'text-primary' : 'text-slate-500'}`}
                    >
                        Wellness
                    </span>
                </NavLink>

                {/* Right two items: Analytics + Protocols */}
                {NAV_ITEMS.slice(2).map((item) => (
                    <NavItem key={item.path} item={item} />
                ))}
            </div>
        </nav>
    );
};

/** Individual nav tab — icon + label + spring active dot */
const NavItem: React.FC<{ item: NavItem }> = ({ item }) => (
    <NavLink
        to={item.path}
        aria-label={item.label}
        className="flex flex-col items-center gap-0.5 pt-2 pb-1 px-4 min-w-[56px] relative"
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
                    className={`text-xs font-bold tracking-wide transition-colors ${isActive ? ACTIVE_LABEL : IDLE_LABEL
                        }`}
                >
                    {item.label}
                </span>
            </>
        )}
    </NavLink>
);

export default MobileBottomNav;
