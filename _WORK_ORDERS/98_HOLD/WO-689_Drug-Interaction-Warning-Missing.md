---
id: WO-689
title: "Psilocybin + Lithium drug interaction warning does not fire when entering Phase 2 dosing"
owner: LEAD
status: 00_INBOX
authored_by: LEAD (fast-track)
priority: P0
created: 2026-03-24
fast_track: true
origin: "User fast-track request"
admin_visibility: no
admin_section: ""
parked_context: ""
files: []
---

## Request
User entered Lithium as a concomitant medication in Phase 1. Upon entering Psilocybin as the dosing substance in Phase 2, no drug-interaction warning was displayed. This is a patient safety failure — Lithium is a known contraindication/interaction risk with serotonergic psychedelics (serotonin syndrome risk).

## LEAD Architecture
The contraindication/interaction engine must cross-reference the active medication list (stored from Phase 1) against the selected dosing substance in Phase 2. The warning should surface at substance selection time in Phase 2 (DosingProtocolForm or DosingSessionPhase) and block or prominently warn before proceeding. Likely files:
- `src/components/wellness-journey/DosingSessionPhase.tsx` — Phase 2 orchestrator
- `src/components/arc-of-care-forms/phase-2-dosing/DosingProtocolForm.tsx` — substance input
- `src/components/wellness-journey/Phase1StepGuide.tsx` — where medications are stored to localStorage/DB
- Any existing contraindication rule engine (WO-673 delivered `ibogaine` rules — check if a general interaction engine exists)

## Open Questions
- [ ] Where are Phase 1 medications persisted? (localStorage key or DB table `log_concomitant_medications`?)
- [ ] Does a general drug-interaction rule matrix exist, or only Ibogaine-specific rules from WO-673?
- [ ] Should the warning be a blocking modal or a prominent inline alert?

---

## INSPECTOR 02.5 PRE-BUILD REVIEW

### 🔴 HOLD — FREEZE VIOLATION

**Status: BLOCKED — CANNOT PROCEED TO BUILD**

The following files listed in LEAD Architecture are frozen per `FREEZE.md` (Phase 2 — frozen 2026-03-11):

| File | Freeze Status |
|---|---|
| `src/components/wellness-journey/DosingSessionPhase.tsx` | ❌ FROZEN |
| `src/components/arc-of-care-forms/phase-2-dosing/DosingProtocolForm.tsx` | ❌ FROZEN |

**INSPECTOR cannot sign clearance for a WO that requires modifying frozen files.**

### Additional Findings (for when freeze is lifted)

- `contraindicationEngine` is already imported in `DosingSessionPhase.tsx` (line 20) — the engine exists but the cross-reference with Phase 1 medication IDs is broken or incomplete. WO-689 fix is likely localized: read `concomitant_med_ids` from `log_phase1_safety_screen` and pass through the engine at substance-selection time.
- `concomitant_med_ids` is stored in DB table `log_phase1_safety_screen.concomitant_med_ids` (confirmed via `WellnessJourney.tsx` line 549). This is the correct data source.
- No new DB tables required — fast-pass eligible once freeze is lifted.
- No UI Standards violations in WO spec.

### Required Action

**USER must explicitly unfreeze** `DosingSessionPhase.tsx` and `DosingProtocolForm.tsx` from `FREEZE.md` before INSPECTOR can clear this WO for build.

```
hold_reason: FREEZE VIOLATION — DosingSessionPhase.tsx + DosingProtocolForm.tsx frozen 2026-03-11
```

Signed: INSPECTOR | Date: 2026-03-25
