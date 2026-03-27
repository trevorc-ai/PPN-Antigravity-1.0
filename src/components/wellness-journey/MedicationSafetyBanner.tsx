import React, { useState, useEffect } from 'react';
import { Pill, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

/**
 * WO-691 / WO-724 — MedicationSafetyBanner
 *
 * Displays a collapsible amber banner in Phase 2 (Dosing Session) listing the
 * patient's active concomitant medications, as sourced from Phase 1 and stored
 * in localStorage.
 *
 * WO-724 FIX: reads ppn_patient_medications_names (authoritative — written by
 * Phase 1 StructuredSafetyCheckForm) first, then falls back to
 * mock_patient_medications_names (legacy DB-hydrated key).
 * Also listens to ppn:safety-updated (custom event for same-tab Phase 1 saves)
 * because window.storage does NOT fire within the same tab.
 *
 * Render contract:
 *   - No medications → renders null (silent, no empty state)
 *   - 1–3 medications → shows inline, no expand needed
 *   - 4+ medications → shows first 3 + "Show all N" expand toggle
 *
 * Phase 2 color = amber (per PPN frontend-best-practices)
 * Typography: ppn-meta / ppn-body (per PPN design system)
 * Accessibility: collapse toggle has aria-label + aria-expanded
 */

// WO-724: authoritative key (written by Phase 1 Safety Check)
const STORAGE_KEY_PRIMARY   = 'ppn_patient_medications_names';
// WO-724: legacy fallback (DB-hydrated on patient select)
const STORAGE_KEY_FALLBACK  = 'mock_patient_medications_names';

export const MedicationSafetyBanner: React.FC = () => {
    const [meds, setMeds] = useState<string[]>([]);
    const [expanded, setExpanded] = useState(false);

    // WO-724: Read both localStorage keys — authoritative key first, legacy fallback second.
    // Listens for:
    //   • window.storage — fires when ANOTHER tab writes either key
    //   • ppn:safety-updated — fires when Phase 1 Safety Check saves IN THE SAME TAB
    //     (window.storage does NOT fire for same-tab writes, so we need this custom event)
    useEffect(() => {
        const read = () => {
            try {
                const raw = localStorage.getItem(STORAGE_KEY_PRIMARY)
                          || localStorage.getItem(STORAGE_KEY_FALLBACK);
                if (!raw) { setMeds([]); return; }
                const parsed = JSON.parse(raw);
                setMeds(Array.isArray(parsed) ? parsed : []);
            } catch {
                setMeds([]);
            }
        };
        read();
        window.addEventListener('storage', read);
        // WO-724: same-tab Phase 1 save — WellnessFormRouter dispatches this custom event
        window.addEventListener('ppn:safety-updated', read);
        return () => {
            window.removeEventListener('storage', read);
            window.removeEventListener('ppn:safety-updated', read);
        };
    }, []);

    // Silent: no banner if no medications are recorded for this patient
    if (meds.length === 0) return null;

    const INLINE_LIMIT = 3;
    const hasOverflow = meds.length > INLINE_LIMIT;
    const visibleMeds = hasOverflow && !expanded ? meds.slice(0, INLINE_LIMIT) : meds;
    const hiddenCount = meds.length - INLINE_LIMIT;

    return (
        <div
            className="rounded-xl border border-amber-500/40 bg-amber-950/25 px-4 py-3"
            role="region"
            aria-label="Active medications during dosing session"
        >
            <div className="flex items-start gap-3">
                {/* Icon — amber per Phase 2 palette */}
                <div className="shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" aria-hidden="true" />
                </div>

                <div className="flex-1 min-w-0">
                    {/* Label row */}
                    <div className="flex items-center gap-2 mb-1">
                        <Pill className="w-3 h-3 text-amber-500 shrink-0" aria-hidden="true" />
                        <span className="ppn-meta font-black text-amber-300 uppercase tracking-widest">
                            Active Medications
                        </span>
                        <span className="ppn-meta text-amber-500 font-semibold">
                            ({meds.length})
                        </span>
                    </div>

                    {/* Medication list */}
                    <p className="ppn-body text-amber-100/80 leading-snug">
                        {visibleMeds.join(' · ')}
                        {hasOverflow && !expanded && (
                            <span className="text-amber-500 ml-1">
                                · +{hiddenCount} more
                            </span>
                        )}
                    </p>

                    {/* Provenance note */}
                    <p className="ppn-meta text-amber-600 mt-1 italic">
                        Entered in Phase 1 Safety Screen — verify before dosing
                    </p>
                </div>

                {/* Expand / collapse toggle — only when list overflows */}
                {hasOverflow && (
                    <button
                        onClick={() => setExpanded(prev => !prev)}
                        aria-label={expanded ? 'Collapse medication list' : `Show all ${meds.length} medications`}
                        aria-expanded={expanded}
                        className="shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-amber-500 hover:text-amber-300 hover:bg-amber-900/40 transition-colors"
                    >
                        {expanded
                            ? <ChevronUp className="w-4 h-4" aria-hidden="true" />
                            : <ChevronDown className="w-4 h-4" aria-hidden="true" />
                        }
                    </button>
                )}
            </div>
        </div>
    );
};

export default MedicationSafetyBanner;
