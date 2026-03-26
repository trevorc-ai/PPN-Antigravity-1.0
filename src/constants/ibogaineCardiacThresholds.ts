/**
 * ibogaineCardiacThresholds.ts
 *
 * Advisory QTc alert tier thresholds for Ibogaine sessions (WO-672).
 * Per Dr. Allen (600+ sessions, paper under preparation): no adverse events
 * have occurred at QTc levels that standard references flag as dangerous.
 * The system must ALERT and MONITOR, but NEVER block the practitioner.
 *
 * Source: WO-672 Feature Scope §4, LEAD Architecture notes (2026-03-24)
 * Authored by: BUILDER (2026-03-25)
 */

// ─── 4-Tier QTc Alert System ─────────────────────────────────────────────────
// These thresholds define the alert tier boundaries displayed in the live
// Phase 2 monitoring view for Ibogaine HCL and TPA sessions only.
// All tiers are advisory. Practitioner retains full clinical decision authority.
//
// Tier:   GREEN   < 490ms   — nominal, no action required
// Tier:   AMBER   ≥ 490ms   — elevated, monitor closely
// Tier:   ORANGE  ≥ 500ms   — significant elevation, clinical assessment required
// Tier:   RED     ≥ 550ms   — or concurrent symptoms, consider intervention protocol

export const IBOGAINE_QTC_TIERS = {
    /** Green: QTc below this value — nominal. */
    AMBER_THRESHOLD_MS: 490,
    /** Amber: QTc at or above this value — elevated, monitor closely. */
    ORANGE_THRESHOLD_MS: 500,
    /** Orange: QTc at or above this value — significant elevation. */
    RED_THRESHOLD_MS: 550,
} as const;

// ─── Tier derived types ───────────────────────────────────────────────────────
export type IbogaineQtcTier = 'green' | 'amber' | 'orange' | 'red' | 'unknown';

/**
 * Derives the advisory QTc tier for a given millisecond value.
 * Returns 'unknown' if the value is not a valid positive integer.
 *
 * @param qtcMs - QTc reading in milliseconds (integer)
 * @param hasConcurrentSymptoms - true if practitioner has flagged concurrent
 *   clinical symptoms (diaphoresis, HR irregularity, altered cognition) —
 *   per Dr. Allen's protocol, concurrent symptoms elevate any reading to RED tier.
 */
export function getIbogaineQtcTier(
    qtcMs: number | null | undefined,
    hasConcurrentSymptoms = false
): IbogaineQtcTier {
    if (qtcMs == null || isNaN(qtcMs) || qtcMs <= 0) return 'unknown';

    // Concurrent symptoms → escalate to RED regardless of raw QTc value,
    // per Dr. Allen's "ACLS on-call" protocol trigger.
    if (hasConcurrentSymptoms) return 'red';

    if (qtcMs >= IBOGAINE_QTC_TIERS.RED_THRESHOLD_MS) return 'red';
    if (qtcMs >= IBOGAINE_QTC_TIERS.ORANGE_THRESHOLD_MS) return 'orange';
    if (qtcMs >= IBOGAINE_QTC_TIERS.AMBER_THRESHOLD_MS) return 'amber';
    return 'green';
}

// ─── Tier display metadata ────────────────────────────────────────────────────
// Used by UI components to derive color classes and labels without embedding
// business logic directly in JSX.
export const IBOGAINE_QTC_TIER_META: Record<
    Exclude<IbogaineQtcTier, 'unknown'>,
    {
        label: string;
        sublabel: string;
        borderClass: string;
        bgClass: string;
        textClass: string;
        badgeClass: string;
    }
> = {
    green: {
        label: 'GREEN',
        sublabel: `QTc <${IBOGAINE_QTC_TIERS.AMBER_THRESHOLD_MS}ms — nominal`,
        borderClass: 'border-teal-500/40',
        bgClass: 'bg-teal-950/20',
        textClass: 'text-teal-300',
        badgeClass: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    },
    amber: {
        label: 'AMBER',
        sublabel: `QTc ≥${IBOGAINE_QTC_TIERS.AMBER_THRESHOLD_MS}ms — monitor closely`,
        borderClass: 'border-amber-500/50',
        bgClass: 'bg-amber-950/15',
        textClass: 'text-amber-300',
        badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    },
    orange: {
        label: 'ORANGE',
        sublabel: `QTc ≥${IBOGAINE_QTC_TIERS.ORANGE_THRESHOLD_MS}ms — assess HR, RR, diaphoresis, cognition`,
        borderClass: 'border-orange-500/60',
        bgClass: 'bg-orange-950/20',
        textClass: 'text-orange-300',
        badgeClass: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    },
    red: {
        label: 'RED',
        sublabel: `QTc ≥${IBOGAINE_QTC_TIERS.RED_THRESHOLD_MS}ms or symptoms — consider IV Fluids, Mg, Esmolol; ACLS on-call`,
        borderClass: 'border-red-500/70',
        bgClass: 'bg-red-950/25',
        textClass: 'text-red-300',
        badgeClass: 'bg-red-500/20 text-red-200 border-red-500/40',
    },
};

// ─── Baseline QTc field name contract ────────────────────────────────────────
// Phase 1 baseline QTc is stored in log_clinical_records.qtc_baseline_ms
// (migration 082). This constant ensures UI and DB layers use the same name.
export const BASELINE_QTC_FIELD = 'qtc_baseline_ms' as const;
