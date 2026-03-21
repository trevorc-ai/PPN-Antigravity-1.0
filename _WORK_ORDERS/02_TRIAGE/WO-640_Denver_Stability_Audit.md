---
id: WO-640
title: "Denver Pre-Conference Stability Audit — Full Clinical Flow QA"
owner: INSPECTOR
authored_by: PRODDY
routed_by: LEAD
status: 02_TRIAGE
priority: P0
created: 2026-03-17
routed_at: 2026-03-17
depends_on: none
skip_approved_by: ""
hold_reason: ""
held_at: ""
failure_count: 0
completed_at: ""
builder_notes: ""
skills:
  - ".agent/skills/inspector-qa/SKILL.md"
  - ".agent/skills/browser/SKILL.md"
---

## Context

PsyCon Denver is April 7, 2026. `ppnportal.net` is the primary demo vehicle. The platform must
run flawlessly through a complete clinical session arc with zero errors. Multiple bugs have been
patched in recent sessions; a full end-to-end verification pass is required before conference.

This WO has two parts: (1) fix any remaining known blockers, (2) run the full audit protocol.

---

## Known Blockers to Clear First

### B1 — TypeScript CI Failure (P0)
The `concomitant_med_ids` field was removed from `StructuredSafetyCheckData` but references
remain in multiple files, causing CI build failures.

| File | Issue |
|---|---|
| `src/components/wellness-journey/WellnessFormRouter.tsx` | References removed field |
| `src/pages/WellnessJourney.tsx` | References removed field |
| `src/pages/ProtocolDetail.tsx` | References removed field |
| `src/lib/clinicalLog.ts` | References removed field |

**Fix:** Remove all references to `concomitant_med_ids` from these files. Do not re-add the field.

### B2 — Treatment Expectancy Slider Saves Null
`log_phase1_set_and_setting.treatment_expectancy` saves as `null` when slider is moved but not
explicitly released. Fix the onChange/onBlur save logic in the Set & Setting form step.

---

## Audit Protocol — Run in This Exact Order

After blockers are cleared, run the full end-to-end clinical flow:

```
1. Login → Dashboard (no errors, no spinner hang)

2. Protocol Builder
   ✓ Configure new protocol: substance, indication, schedule
   ✓ NetworkIntelligenceCard renders — count displayed, no error

3. Phase 1 — Preparation (new patient)
   ✓ Consent form: saves to log_phase1_consent
   ✓ Safety screen: contraindication fires, verdict saves
   ✓ Set & Setting: mindset, intentions, expectancy slider (must NOT save null)

4. Phase 2 — Facilitation
   ✓ Dose event logged (mg, route, timestamp)
   ✓ Vitals: HR, BP, SpO2 — timeline renders
   ✓ Red alert fires and dismisses cleanly

5. Phase 3 — Integration
   ✓ MEQ-30 completes and saves score
   ✓ PHQ-9 longitudinal entry saves
   ✓ Integration session creates

6. Close Session → Start New Patient
   ✓ State resets, no stale data carries over

7. SessionExportCenter
   ✓ Clinical Report PDF generates
   ✓ Audit & Compliance PDF generates
   ✓ CSV export downloads

8. Dashboard / Analytics
   ✓ Compass spider graph renders with session data
   ✓ No empty state errors
```

---

## Acceptance Criteria

- [ ] `npm run build` clean — zero TypeScript errors
- [ ] All 8 audit steps pass in Chrome with zero console errors
- [ ] All 8 audit steps pass in Safari with zero console errors
- [ ] Treatment expectancy saves a non-null integer value
- [ ] Both PDFs print-previewed and confirmed legible on white background
- [ ] Session close → new patient flow produces no stale state

---

## Files to Modify

| File | Action |
|---|---|
| `src/components/wellness-journey/WellnessFormRouter.tsx` | MODIFY — remove concomitant_med_ids ref |
| `src/pages/WellnessJourney.tsx` | MODIFY — remove concomitant_med_ids ref |
| `src/pages/ProtocolDetail.tsx` | MODIFY — remove concomitant_med_ids ref |
| `src/lib/clinicalLog.ts` | MODIFY — remove concomitant_med_ids ref |
| Set & Setting form step component | MODIFY — fix expectancy slider null save |

---

## Constraints

- No new features. Bug fixes and audit only.
- No schema changes.
- Do not refactor outside the exact scope of each fix.
- Demo environment must be tested offline (local `npm run dev`) as conference WiFi is unreliable.

---

## LEAD Architecture

**Routing Decision:** INSPECTOR owns this WO. Run blocker fixes first, then audit protocol.
Browser skill required for live visual verification. Target complete: March 24, 2026.
