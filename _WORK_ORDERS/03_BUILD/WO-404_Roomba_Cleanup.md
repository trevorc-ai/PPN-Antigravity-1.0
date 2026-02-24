---
id: WO-404
title: "Roomba Cleanup Sprint — Dead Routes, Dead Calls, UI-ONLY Comments"
status: 03_BUILD
owner: BUILDER
created: 2026-02-23
created_by: LEAD
failure_count: 0
priority: P2
tags: [cleanup, dead-routes, phi-safety, roomba]
user_prompt: |
  "I came across a random buried link somewhere that took me to the search portal."
  Roomba audit (2026-02-23) confirmed /search is orphaned and /vibe-check is a dead navigate() call.
---

# WO-404: Roomba Cleanup Sprint

## LEAD ARCHITECTURE

Based on the first Roomba audit (`_WORK_ORDERS/ROOMBA_AUDIT_2026-02-23.md`), these are the items BUILDER must address. All are surgical, low-risk changes.

---

## TASK 1: Remove Dead Routes from App.tsx

Remove these routes from `src/App.tsx` — they are orphaned with no linking path and no planned use:

| Route | Reason |
|-------|--------|
| `/search` | Being replaced by command palette (WO-403) |
| `/billing` | Invoices removed from sidebar; this page is unreachable |
| `/forms-showcase` | Dev-only scaffold, should not be in production router |
| `/arc-of-care-god-view` | Legacy debug view, superseded by Wellness Journey |

**Preserve** these orphaned routes (they are intentionally unlisted / flow-only):
- `/companion/:sessionId` — entered via session start flow
- `/arc-of-care-phase2`, `/arc-of-care-phase3` — legacy flow routes (keep until verified unused)
- `/monograph/:id` — entered from Substance Library cards
- `/deep-dives/*` — accessible from Analytics nav
- `/patient-form/:formId` — entered from inside Wellness Journey

---

## TASK 2: Fix Dead navigate() Calls

| File | Line | Dead Path | Fix |
|------|------|-----------|-----|
| `src/components/TopHeader.tsx` | 271 | `/vibe-check` | Remove the navigate call and the button/trigger that calls it |
| `src/components/Footer.tsx` | 14 | `/#membership-tiers` | Update to `/#pricing` or remove if section doesn't exist |
| `src/pages/About.tsx` | 161 | `/#secure-access-node` | Update to `/login` or remove |
| `src/pages/ContributionModel.tsx` | 76, 178, 184 | `/#secure-access-node`, `/#membership-tiers` | Update to `/login` and `/pricing` respectively |

---

## TASK 3: Add UI-ONLY Comments to Patient-Form Text Inputs

For each file flagged by the Roomba, BUILDER must:
1. Verify the input is NOT persisted to Supabase (trace onChange → state → submit)
2. If confirmed UI-only: add `{/* UI-ONLY: not persisted — never wire to Supabase */}` immediately above the input
3. If it IS being persisted: **STOP. Do not add comment. Escalate to LEAD immediately.**

Files to review:
- `src/components/arc-of-care-forms/phase-2-dosing/SafetyAndAdverseEventForm.tsx` line 490 — MedDRA code field (likely OK — external identifier)
- `src/components/arc-of-care-forms/shared/BatchRegistrationModal.tsx` lines 137, 172 — batch/device registration fields
- `src/components/arc-of-care-forms/shared/DeviceRegistrationModal.tsx` lines 134, 146, 158 — device registration fields
- `src/components/arc-of-care-forms/shared/NumberInput.tsx` line 96 — `type="text" inputMode="numeric"` (already safe — just needs comment)
- `src/components/arc-of-care-forms/shared/UserPicker.tsx` line 86 — search filter (UI-only by design)
- `src/components/wellness-journey/PatientSelectModal.tsx` line 329 — search filter (UI-only by design)
- `src/components/wellness-journey/RiskEligibilityReport.tsx` line 240 — override justification textarea (UI-only — confirmed in prior audit)

---

## ACCEPTANCE CRITERIA
- [ ] `/search`, `/billing`, `/forms-showcase`, `/arc-of-care-god-view` removed from App.tsx router
- [ ] No remaining `navigate('/vibe-check')` calls in src/
- [ ] Footer and About/Contribution hash links updated to valid targets
- [ ] All 10 patient-form inputs either have `{/* UI-ONLY */}` comment or have been escalated
- [ ] Run Roomba after: `node scripts/roomba.cjs` — orphaned routes count drops, free-text violations drop to 0 or all have comments
- [ ] No TypeScript errors introduced
- [ ] No existing routes that ARE linked have been removed

## ROUTING
BUILDER → INSPECTOR → 05_USER_REVIEW
