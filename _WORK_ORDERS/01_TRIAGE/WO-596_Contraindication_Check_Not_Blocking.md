# WO-596 — Contraindication Check Not Blocking Incompatible Substances

**Status:** 01_TRIAGE
**Priority:** P0 — CRITICAL SAFETY (clinical data integrity)
**Author:** INSPECTOR
**Date:** 2026-03-10
**Source:** QA Session 03-10, screenshots-phase2-second-turn-03-10 (4.35.47 PM)

---

## Problem

User selected **Lithium** as a current medication in Phase 1 Safety Screen, then selected **Psilocybin** as the session substance in Phase 2 Dosing Protocol. No warning was shown and no block was triggered.

Lithium is a known serotonergic drug with a clinically significant contraindication for psilocybin. This is a safety-critical failure.

## Steps to Reproduce

1. Phase 1 → Safety Screen → add Lithium to current medications
2. Phase 2 → Dosing Protocol → select Psilocybin as substance
3. Expected: warning modal or hard block
4. Actual: no warning, proceeds silently

## What Needs to Happen

- [ ] At substance selection time in Phase 2, cross-reference the selected substance against the patient's current medications in `log_phase1_safety_screen.concomitant_med_ids`
- [ ] If a contraindication match is found, display a warning (ideally a hard block requiring acknowledgment)
- [ ] The contraindication data should come from `ref_substances` or a new `ref_contraindications` table

## Notes

- `log_phase1_safety_screen.contraindication_verdict_id` and `ekg_rhythm_id` are NULL in DB — the safety screen form may not be writing this data at all (confirmed in DB screenshots)
- Check whether `log_phase1_safety_screen.contraindications_confirmed` is being populated

## Acceptance Criteria

- [ ] Selecting a substance that conflicts with a recorded medication triggers a visible warning
- [ ] Safety screen data is correctly written to `log_phase1_safety_screen`
- [ ] `contraindication_verdict_id` is populated after safety screen completion
