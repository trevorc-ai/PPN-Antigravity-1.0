---
id: WO-658
title: "Extract handlePatientSelect into usePatientSession custom hook"
owner: LEAD
authored_by: PRODDY
routed_by: ""
status: 00_INBOX
priority: P2
created: 2026-03-23
routed_at: ""
active_sprint: false
depends_on: "none"
skip_approved_by: ""
stage_waived_by: ""
hold_reason: ""
held_at: ""
failure_count: 0
completed_at: ""
builder_notes: ""
skills:
  - ".agent/skills/frontend-surgical-standards/SKILL.md"
database_changes: no
files:
  - src/pages/WellnessJourney.tsx
  - src/hooks/usePatientSession.ts
affects:
  - src/pages/WellnessJourney.tsx
admin_visibility: no
admin_section: ""
growth_order_ref: ""
defer_until: "After PsyCon Denver — April 7, 2026"
---

## PRODDY PRD

### 1. Problem Statement

`WellnessJourney.tsx` is 1,689 lines. The dominant contributor is `handlePatientSelect` (~270 lines, current location ~lines 500–770), a single callback that conflates session creation, patient resume, medication fetch, demographics fetch, localStorage hygiene, phase promotion, and toast dispatch. As the file grows, this function is increasingly difficult to test in isolation, and new contributors cannot understand the session lifecycle without reading the entire page. This is a maintainability and testability problem — not a user-facing bug — but it creates escalating risk as Phase 3 work continues.

### 2. Target User + Job-To-Be-Done

A BUILDER agent needs to modify session-resumption logic so that they can make changes to patient selection behaviour without reading 1,700 lines of unrelated UI code.

### 3. Success Metrics

1. `WellnessJourney.tsx` line count drops from ~1,689 to ≤ 1,450 after extraction
2. `usePatientSession.ts` hook passes a complete `/phase2-session-regression` run (all 4 scenarios PASS) with zero functional changes
3. `npm run build` clean with no TypeScript errors after extraction

### 4. Feature Scope

#### In Scope:
- Extract `handlePatientSelect` callback into `src/hooks/usePatientSession.ts`
- Move `journey` useState and its initializer into the hook
- Move `handleResume` callback into the hook
- Move the "persist active session to localStorage" `useEffect` into the hook
- The hook returns exactly what the page consumes (destructured at call site)

#### Out of Scope:
- Any logic changes — this is a pure extraction, zero behaviour change
- Moving deep-link `useEffect` (it depends on `location.search` — stays on the page)
- Moving `completedForms` or any Phase 3 form state (UI state, stays on the page)
- Moving the DB hydration `useEffect` added in `c9f5d51` (stays on the page)
- Any refactor of `handlePatientSelect` internals
- CSS, layout, or design changes of any kind

### 5. Priority Tier

**P2 — Deferrable.** No user-facing bug. No demo blocker. Deferred until after PsyCon Denver (April 7, 2026). Do not start before then.

### 6. Open Questions for LEAD

1. Should `journey` useState move fully into the hook, or should the hook return `[journey, setJourney]` and the page own the declaration? (Recommended: hook owns it — but LEAD decides.)
2. Does the `storedActiveSession` state also belong in the hook, or is it navigation-state that belongs on the page?
3. Is there a risk that moving `journey` into the hook creates a stale-closure issue with the deep-link `useEffect` that reads `location.search`? LEAD should verify before BUILDER starts.

---

## PRODDY Sign-Off Checklist

- [x] Problem Statement ≤ 100 words
- [x] Success Metrics are measurable (line count, test pass, build clean)
- [x] Out of Scope section is explicit
- [x] PRD total under 600 words
- [x] Open Questions ≤ 5 items
- [x] No code, SQL, or schema authored in this document
- [x] `database_changes: no` — INSPECTOR fast-pass eligible
- [x] Files list is exact — no wildcards
