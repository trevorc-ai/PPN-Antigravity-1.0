/**
 * clinicalPhase.ts — Canonical patient phase derivation utility.
 *
 * Single source of truth for deriving a patient's current clinical phase
 * from log_clinical_records columns. All views (PatientSelectModal,
 * MyProtocols, ProtocolDetail, WellnessJourney) MUST use these exports
 * instead of maintaining their own derivation logic.
 *
 * Priority hierarchy (highest wins):
 *   Complete > Integration > Treatment > Preparation
 */

// ─── Types ────────────────────────────────────────────────────────────────────

/** Canonical 4-state phase type used across all views */
export type ClinicalPhase = 'Preparation' | 'Treatment' | 'Integration' | 'Complete';

// ─── Core derivation function ────────────────────────────────────────────────

/**
 * Derives the current ClinicalPhase from log_clinical_records columns.
 *
 * @param sessionTypeId   log_clinical_records.session_type_id  (1=Prep, 2=Dosing, 3=Integration)
 * @param sessionEndedAt  log_clinical_records.session_ended_at (ISO string or null)
 * @param isSubmitted     log_clinical_records.is_submitted
 */
export function deriveClinicalPhase(
    sessionTypeId: number | null,
    sessionEndedAt: string | null,
    isSubmitted: boolean,
): ClinicalPhase {
    if (isSubmitted)         return 'Complete';
    if (sessionEndedAt)      return 'Integration';
    if (sessionTypeId === 2) return 'Treatment';
    return 'Preparation';
}

// ─── Tab mapping ──────────────────────────────────────────────────────────────

/**
 * Maps a ClinicalPhase to its WellnessJourney tab number.
 * Complete patients land on Phase 3 (Integration tab).
 */
export const PHASE_TO_TAB: Record<ClinicalPhase, 1 | 2 | 3> = {
    Preparation: 1,
    Treatment:   2,
    Integration: 3,
    Complete:    3,
};

// ─── Display helpers ──────────────────────────────────────────────────────────

/**
 * Per-phase color classes used in PatientSelectModal and other list views.
 * Uses Tailwind utility classes consistent with PPN design system.
 */
export const PHASE_COLORS: Record<ClinicalPhase, string> = {
    Preparation: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    Treatment:   'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Integration: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    Complete:    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};
