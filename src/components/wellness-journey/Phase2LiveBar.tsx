/**
 * Phase2LiveBar — sticky bottom quick-action strip for active dosing sessions
 *
 * Visible ONLY when:
 *   - Phase 2 is active (sessionMode === 'live')
 *   - Viewport is < md (mobile / tablet)
 *
 * Mirrors the keyboard shortcuts already wired in TreatmentPhase:
 *   V → vitals   A → safety event   U → session update panel
 *
 * Also surfaces the 2 most-common LiveSessionTimeline quick actions
 * (Patient Spoke, Music Change) so they're one thumb-tap away without
 * opening the full timeline card.
 *
 * Dispatches the same CustomEvent ('ppn:session-event') that
 * LiveSessionTimeline uses, so DosingSessionPhase chart listeners
 * continue to work with zero prop changes.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Shield, ClipboardList, Mic, Music, ChevronUp, ChevronDown } from 'lucide-react';

interface Phase2LiveBarProps {
    sessionId: string | undefined;
    elapsedTime: string;         // HH:MM:SS from TreatmentPhase
    onOpenVitals: () => void;
    onOpenSafety: () => void;
    onOpenUpdate: () => void;    // toggle the session update panel
}

const SPRING = { type: 'spring', stiffness: 380, damping: 28 } as const;

// The two quick-log actions that don't require a form open
const INSTANT_ACTIONS = [
    {
        id: 'patient_observation',
        label: 'Spoke',
        ariaLabel: 'Log patient spoke event',
        icon: Mic,
        color: 'text-amber-300 border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20',
        desc: 'Patient spoke / verbalized',
    },
    {
        id: 'music_change',
        label: 'Music',
        ariaLabel: 'Log music change event',
        icon: Music,
        color: 'text-violet-300 border-violet-500/40 bg-violet-500/10 hover:bg-violet-500/20',
        desc: 'Playlist / music changed',
    },
];

export const Phase2LiveBar: React.FC<Phase2LiveBarProps> = ({
    sessionId,
    elapsedTime,
    onOpenVitals,
    onOpenSafety,
    onOpenUpdate,
}) => {
    const [busy, setBusy] = useState<string | null>(null);

    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    const fireInstant = async (action: typeof INSTANT_ACTIONS[number]) => {
        if (busy) return;
        setBusy(action.id);

        const desc = `${action.desc} at T+${elapsedTime}`;

        // Dispatch to chart listener (zero prop drilling)
        window.dispatchEvent(new CustomEvent('ppn:session-event', {
            detail: { type: action.id, label: desc, timestamp: new Date().toISOString() }
        }));

        // Timeline: patient_observation / music_change have no ref_flow_event_types code; skip DB write to avoid unsupported codes.

        setBusy(null);
    };

    return (
        // Sits above the MobileBottomNav (z-40 beats bottom nav's z-50 — bottom nav has its own bar)
        // Bottom offset: 64px = MobileBottomNav height so this bar doesn't overlap it
        <div
            className="fixed bottom-16 left-0 right-0 z-40 md:hidden px-3 pb-1"
            role="toolbar"
            aria-label="Session quick actions"
        >
            <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                transition={SPRING}
                className="bg-[#0a1628]/95 backdrop-blur-xl border border-amber-500/20 rounded-2xl shadow-[0_0_24px_rgba(245,158,11,0.12)] p-2"
            >
                {/* Live session badge */}
                <div className="flex items-center justify-between mb-2 px-1">
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                        </span>
                        <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest">
                            Live · T+{elapsedTime}
                        </span>
                    </div>
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Quick Log</span>
                </div>

                {/* Action grid — flex so items wrap on very narrow viewports */}
                <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>

                    {/* Vitals */}
                    <ActionButton
                        label="Vitals"
                        ariaLabel="Log vitals"
                        icon={<Activity className="w-4 h-4" />}
                        color="text-blue-300 border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20"
                        onClick={onOpenVitals}
                    />

                    {/* Instant: Patient Spoke + Music */}
                    {INSTANT_ACTIONS.map(action => (
                        <ActionButton
                            key={action.id}
                            label={action.label}
                            ariaLabel={action.ariaLabel}
                            icon={<action.icon className="w-4 h-4" />}
                            color={action.color}
                            loading={busy === action.id}
                            onClick={() => fireInstant(action)}
                        />
                    ))}

                    {/* Safety */}
                    <ActionButton
                        label="Safety"
                        ariaLabel="Log safety event"
                        icon={<Shield className="w-4 h-4" />}
                        color="text-red-300 border-red-500/40 bg-red-500/10 hover:bg-red-500/20"
                        onClick={onOpenSafety}
                    />

                    {/* Session Update */}
                    <ActionButton
                        label="Update"
                        ariaLabel="Open session update panel"
                        icon={<ClipboardList className="w-4 h-4" />}
                        color="text-slate-300 border-slate-600/50 bg-slate-700/20 hover:bg-slate-700/40"
                        onClick={onOpenUpdate}
                    />

                </div>
            </motion.div>
        </div>
    );
};

/** Compact icon + label tap target */
const ActionButton: React.FC<{
    label: string;
    ariaLabel: string;
    icon: React.ReactNode;
    color: string;
    onClick: () => void;
    loading?: boolean;
}> = ({ label, ariaLabel, icon, color, onClick, loading }) => (
    <motion.button
        whileTap={{ scale: 0.88 }}
        transition={SPRING}
        onClick={onClick}
        disabled={loading}
        aria-label={ariaLabel}
        className={[
            'flex flex-col items-center justify-center gap-0.5',
            'min-h-[52px] rounded-xl border',
            'text-[10px] font-bold tracking-wide',
            'transition-colors active:scale-95',
            color,
            loading ? 'opacity-50' : '',
        ].join(' ')}
    >
        {loading
            ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            : icon
        }
        <span>{label}</span>
    </motion.button>
);

export default Phase2LiveBar;
