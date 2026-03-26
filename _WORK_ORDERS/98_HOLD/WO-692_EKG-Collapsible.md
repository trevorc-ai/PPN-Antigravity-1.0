---
id: WO-692
title: "EKG Monitoring section in Session Vital Signs must be collapsible"
owner: LEAD
status: 00_INBOX
authored_by: LEAD (fast-track)
priority: P2
created: 2026-03-24
fast_track: true
origin: "User fast-track request"
admin_visibility: no
admin_section: ""
parked_context: ""
files: []
---

## Request
The EKG Monitoring section in the Session Vital Signs form is always expanded and takes up significant vertical space. It needs to be collapsible — toggled open/closed by clicking the section header — so practitioners who don't need EKG data can collapse it and focus on the primary vitals.

## LEAD Architecture
The EKG Monitoring section lives in `src/components/arc-of-care-forms/phase-2-dosing/SessionVitalsForm.tsx`. Implement a controlled React `useState(false)` accordion — clicking the "EKG Monitoring" header row toggles a `isEkgExpanded` boolean. The section body renders only when `isEkgExpanded` is true. Animation: `collapsible-transition` pattern per PPN UI Standards (no native `<details>`). Default state: COLLAPSED (practitioners who need EKG will open it; default-open creates friction for all others).

Likely files:
- `src/components/arc-of-care-forms/phase-2-dosing/SessionVitalsForm.tsx`

## Open Questions
- [ ] Default open or default collapsed? (LEAD recommends: collapsed by default)

---

## INSPECTOR 02.5 PRE-BUILD REVIEW

### 🔴 HOLD — FREEZE VIOLATION

**Status: BLOCKED — CANNOT PROCEED TO BUILD**

The following file is frozen per `FREEZE.md` (Phase 2 — frozen 2026-03-11):

| File | Freeze Status |
|---|---|
| `src/components/arc-of-care-forms/phase-2-dosing/SessionVitalsForm.tsx` | ❌ FROZEN |

**INSPECTOR cannot sign clearance for a WO that requires modifying frozen files.**

### ⚠️ Retroactive Violation Note — WO-693

**WO-693 (UI Standards enforcement) was executed on `SessionVitalsForm.tsx` in the previous session. This file was frozen at the time. That was a protocol violation (Rule 8 + FREEZE.md).** The edits made (7 text-xs and em-dash fixes) were cosmetic and non-structural, but the violation must be acknowledged.

INSPECTOR recommendation: the WO-693 changes should be reviewed by the USER for acceptance or revert before this WO or any other SessionVitalsForm work proceeds.

### Additional Findings (for when freeze is lifted)

- Architecture is correct: `useState(false)` controlled accordion, no `<details>` (would be a CHECK 7 violation). Default collapsed is the right UX call.
- No DB changes. No new schema. Fast-pass eligible once freeze is lifted.
- UI Standards gate: the new EKG collapse toggle button will need `text-xs md:text-sm` and `min-h-[44px]` per ppn-ui-standards. BUILDER must apply these at build time. INSPECTOR will verify at Phase 2.

### Required Action

**USER must explicitly unfreeze** `SessionVitalsForm.tsx` from `FREEZE.md` before INSPECTOR can clear this WO for build.

```
hold_reason: FREEZE VIOLATION — SessionVitalsForm.tsx frozen 2026-03-11
```

Signed: INSPECTOR | Date: 2026-03-25
