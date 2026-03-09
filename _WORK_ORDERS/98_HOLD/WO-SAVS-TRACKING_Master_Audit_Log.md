---
id: WO-SAVS-TRACKING
title: "SAVS Audit Master Tracker — Phases 1, 2, 3 (All Gaps)"
status: ACTIVE_REFERENCE
owner: LEAD
priority: reference
phase: All Phases
---

# SAVS Audit Master Tracker

> State-Action Verification System — every button click and form save across the Wellness Journey must write to `log_session_timeline_events` and/or the appropriate log table. This tracker records every gap found and its resolution status.

**Audit completed:** 2026-03-06  
**Source files audited:** `DosingSessionPhase.tsx`, `LiveSessionTimeline.tsx`, `WellnessFormRouter.tsx`, `IntegrationPhase.tsx`, `BaselineAssessmentWizard.tsx`

---

## Phase 2 Dosing Session

| Gap | Action | Fix Status | File Modified |
|---|---|---|---|
| GAP #1 | `Start Session` button — no DB write | ✅ **FIXED** | `DosingSessionPhase.tsx` |
| GAP #2 | Keyboard `V` shortcut — no DB write | ✅ **FIXED** | `DosingSessionPhase.tsx` |
| GAP #3 | `End Session` button — no DB write | ✅ **FIXED** | `DosingSessionPhase.tsx` |
| GAP #4 | `SUBMIT & CLOSE SESSION` — no DB write, scores not persisted | ✅ **FIXED** | `DosingSessionPhase.tsx` |

---

## Phase 1 Preparation

| Gap | Form | Fix Status | File Modified |
|---|---|---|---|
| P1-A | Safety Check save — localStorage only, no DB write | ✅ **FIXED** | `WellnessFormRouter.tsx` |
| P1-B | Mental Health Screening — no `onSave` prop wired | ✅ **FIXED** | `WellnessFormRouter.tsx` |
| P1-C | Phase 1 completion — no DB timestamp on phase advance | ✅ **FIXED** | `WellnessFormRouter.tsx` |

---

## Phase 3 Integration

| Gap | Issue | Fix Status | File Modified |
|---|---|---|---|
| P3-A | Step 1 & 2 action cards have no `onOpen` prop (dead buttons) | ✅ **FIXED** | `IntegrationPhase.tsx` |
| P3-B | MEQ-30 save is a stub no-op | ✅ **FIXED** | `WellnessFormRouter.tsx` |
| P3-C | `PulseCheckWidget.onSubmit` is `console.log` only | ✅ **FIXED** | `IntegrationPhase.tsx` |
| P3-D | Discharge Summary not timestamped in DB | ✅ **FIXED** | `IntegrationPhase.tsx` |
| D1–D10 | Discharge Summary had 10 hardcoded dummy values | ✅ **FIXED** | `IntegrationPhase.tsx` |

---

## Misc Changes Completed

| Change | Status |
|---|---|
| MEQ-30 banner button removed from top context bar (`WellnessJourney.tsx`) | ✅ Done |

---

## Not Yet Audited

- [ ] **Compass (patient-facing):** All 16 feeling taps, session entry/exit
- [ ] **Pre-Phase-1 Modals:** ProtocolConfiguratorModal, PatientSelectModal — actions before entering Phase 1
- [ ] **PCL-5 score column:** Not in `BaselineAssessmentData` schema — needs migration before wiring
- [ ] **MEQ-30 dedicated DB column:** MEQ-30 score written to `metadata` until `meq30_score` column is available on `log_clinical_records`

---

## Key Principles Established

1. **DB writes fire only on explicit Save/Submit button clicks** — never on `onChange`
2. All writes are UUID-guarded: check `session_id` matches `/^[0-9a-f]{8}-...-[0-9a-f]{12}$/i` before calling DB
3. All DB calls use `.catch()` — never block UI on DB write failures
4. Live graph pin (chart) and DB ledger are separate writes — a pin alone is NOT a DB record
