---
id: WO-691
title: "Medications entered in Phase 1 are not displayed anywhere in Phase 2 dosing session"
owner: LEAD
status: 00_INBOX
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-24
fast_track: true
origin: "User fast-track request"
admin_visibility: no
admin_section: ""
parked_context: ""
files: []
---

## Request
Medications entered during Phase 1 (concomitant medications) are not visible anywhere in Phase 2. Practitioners need to see the active medication list prominently during the dosing session for safety monitoring — not buried or hidden.

## LEAD Architecture
Phase 1 medication data is entered via a form and stored (likely in `log_concomitant_medications` or localStorage). Phase 2 (`DosingSessionPhase.tsx`) does not currently read or display this data. The fix requires:
1. Reading the persisted medication list when Phase 2 mounts (by `sessionId`)
2. Surfacing the medications in a visible location in Phase 2 — likely in the patient context bar or as a medications summary card within `DosingSessionPhase`

Likely files:
- `src/components/wellness-journey/DosingSessionPhase.tsx` — add medication display
- `src/components/wellness-journey/SessionHUD.tsx` — possible display location
- DB query: `log_concomitant_medications` filtered by `session_id`

## Open Questions
- [ ] Where should medications appear in Phase 2? (Patient context bar? Dedicated panel? Safety chip strip?)
- [ ] Are medications stored in localStorage or DB only?

---

## INSPECTOR 02.5 PRE-BUILD REVIEW

### 🔴 HOLD — FREEZE VIOLATION

**Status: BLOCKED — CANNOT PROCEED TO BUILD**

The following files are frozen per `FREEZE.md` (Phase 2 — frozen 2026-03-11):

| File | Freeze Status |
|---|---|
| `src/components/wellness-journey/DosingSessionPhase.tsx` | ❌ FROZEN |

**INSPECTOR cannot sign clearance for a WO that requires modifying frozen files.**

### Additional Findings (for when freeze is lifted)

- **Data source confirmed:** Medications are in DB (`log_phase1_safety_screen.concomitant_med_ids`) as integer FK array. `WellnessJourney.tsx` (line 549) already queries this field at Phase 1 clearance time. The medication IDs resolve against `ref_medications`.
- **LEAD Open Question answered:** Medications are stored in DB only — not localStorage. `SessionHUD.tsx` is NOT frozen and could be used as a display location if LEAD prefers to avoid touching `DosingSessionPhase.tsx`. However, the LEAD architecture calls for `DosingSessionPhase.tsx` which is frozen.
- **Alternative path for USER consideration:** If `DosingSessionPhase.tsx` stays frozen, medications could be displayed in a new component rendered by `WellnessJourney.tsx` (not frozen) — but this would require LEAD to amend the architecture spec.
- No new DB tables. No schema changes. Fast-pass eligible once freeze is lifted.

### Required Action

**USER must explicitly unfreeze** `DosingSessionPhase.tsx` from `FREEZE.md`, **OR** LEAD must amend the architecture to use `WellnessJourney.tsx` as the display container instead.

```
hold_reason: FREEZE VIOLATION — DosingSessionPhase.tsx frozen 2026-03-11
```

Signed: INSPECTOR | Date: 2026-03-25
