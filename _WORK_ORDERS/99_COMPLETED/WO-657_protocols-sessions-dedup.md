---
id: WO-657
title: "Fix duplicate patient rows on My Protocols + Add # Sessions column + Fix Select Patient phase labels"
owner: LEAD
status: 03_BUILD
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-22
fast_track: true
origin: "User fast-track request"
admin_visibility: no
admin_section: ""
parked_context: ""
database_changes: none
files:
  - src/pages/MyProtocols.tsx
  - src/components/wellness-journey/PatientSelectModal.tsx
---

## Request
1. My Protocols page shows duplicate patient rows — fix deduplication.
2. Add a "# Sessions" column showing total session count per patient (including open/incomplete).
3. Select Patient modal always shows "Preparation" phase badge for every patient — fix phase derivation.

## LEAD Architecture

### Bug 1 — MyProtocols.tsx: Wrong dedup key
Current code deduplicates by `patient_ref`. For patients without a `log_patient_site_links` row, the fallback is `SID-{record.id}` — unique per session, so dedup never fires. Fix: deduplicate by `patient_uuid` (always present). During the dedup pass, accumulate a `session_count` per patient and attach it to the surviving Protocol record. Add `# Sessions` as a new column.

### Bug 2 — PatientSelectModal.tsx: Incomplete phase derivation
The modal queries `session_type_id` and derives phase from it. But Integration phase is recorded via `session_ended_at` (not `session_type_id: 3`), and Complete via `is_submitted`. So patients who have completed dosing all show `session_type_id: 1` (their intake/prep record) → "Preparation". Fix: add `session_ended_at` and `is_submitted` to the query, then apply the same derivation hierarchy used in MyProtocols: `is_submitted → Complete; session_ended_at → Integration; session_type_id: 2 → Treatment; else → Preparation`.

## Regression Testing Checklist (for INSPECTOR)
- [ ] `/protocols` page — zero duplicate PT-XXXX rows
- [ ] `/protocols` page — `# Sessions` column shows correct count (1 for single-session, 2+ for multi-session)
- [ ] `/protocols` page — clicking "Open" on any row navigates to the correct Protocol Detail page
- [ ] Protocol Detail page — patient data renders correctly post-navigation
- [ ] Wellness Journey — Select Patient modal correctly shows Integration/Treatment/Complete phase badges (not always Preparation)
- [ ] Select Patient modal — patient count and session count unchanged
- [ ] Mobile card view (`/protocols`) — no duplicates, session count visible
- [ ] Cache: clicking Refresh re-fetches and renders correctly
