---
id: WO-717
title: "P1 Bug — Phase 3 Close Session button never writes is_submitted to DB, causing auto-redirect loop"
owner: INSPECTOR
status: 06_USER_REVIEW
authored_by: INSPECTOR (user-reported regression)
priority: P1
created: 2026-03-27
fast_track: true
origin: "User reported: clicking Close Phase 3 button puts them in a loop — session stays OPEN"
admin_visibility: no
pillar_supported: "1 — Safety Surveillance, 3 — QA and Governance"
task_type: "bug-fix"
files:
  - src/pages/WellnessJourney.tsx
database_changes: no
---

## Root Cause

The "CLOSE SESSION — VIEW PROTOCOL RECORD" button in Phase 3 only cleared
`localStorage` and called `navigate()` — it **never called `closeOutSession()`**
to write `is_submitted = true` to `log_clinical_records`.

Result: every time the practitioner re-opened the patient, the DB query found
the session still `OPEN` → `derivedPhase = 3` (by design) → Phase 3 auto-redirect
loop. The practitioner was stuck in Phase 3 indefinitely.

## Fix Applied

`onClick` converted to `async`. Added `await closeOutSession(sid)` before
localStorage clear and navigation. `closeOutSession()` was already imported
in `WellnessJourney.tsx` — it just was never called.

Error handling is non-blocking: if the DB write fails it logs to console but
still clears localStorage and navigates so the practitioner is never stuck.

## INSPECTOR QA
- [x] `closeOutSession` already imported at line 30 — no new import needed
- [x] DB write happens BEFORE localStorage clear and navigate (correct order)
- [x] Non-blocking error path preserves UX if write fails
- [x] No DB schema changes — `is_submitted` and `submitted_at` columns exist
- [x] Session re-opened after close → should now derive `hasEnded=true → Phase 3 complete` (correct)

VERDICT: ✅ APPROVED — user confirmation required (re-test Close Phase 3)

---
- **Data from:** No new data sources
- **Data to:** `log_clinical_records` — writes `is_submitted=true, submitted_at=now()`
- **Theme:** WellnessJourney.tsx Phase 3 CTA button
