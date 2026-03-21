---
authored_by: INSPECTOR
created: 2026-03-21
status: ACTIVE — Reference before picking up any WO
---

# PPN Pipeline Triage — Stabilization Reorganization

**Date:** 2026-03-21  
**Context:** Stabilization Tracks A and B take absolute priority over all existing pipeline work. This document records the triage decision for every active WO and states whether it can proceed, must be parked behind stabilization, or must be paused and HOLDed.

---

## Triage Verdicts

| WO | Stage | Title | Verdict | Reason |
|---|---|---|---|---|
| **WO-640** | 02_TRIAGE | Denver Stability Audit (P0) | ✅ **PROCEED — runs parallel** | Audit-only, no code changes for the audit phase. Blocker B1 (concomitant_med_ids TS fix) is **required** before Track A starts — it's a CI gating issue that must be resolved first. |
| **WO-643** | 02_TRIAGE | Denver Demo Script | ✅ **PROCEED — PRODDY/docs only** | Documentation and demo environment seeding. Zero code changes. No conflict. |
| **WO-641** | 02_TRIAGE | ClinicianDirectory ListingModal Fix | ✅ **PROCEED after Track A** | Single-file, surgical fix to `ClinicianDirectory.tsx`. Completely isolated. No session/patient data model. Can proceed in parallel once Track A is committed. |
| **WO-642** | 02_TRIAGE | Waitlist Public Route | ✅ **PROCEED after Track A** | Public route only. Zero conflict with any stabilization work. |
| **WO-644** | 02_TRIAGE / 04_QA | Denver Demo Script / PDF QA | ✅ **PROCEED — PDF only** | PDF report QA work is isolated from session state and navigation. No conflict. |
| **WO-646** | 04_QA | PPN Digital Deliverables Portfolio | ✅ **PROCEED — marketing** | Growth order / marketing content. Zero code changes. |
| **WO-648** | 04_QA | PPN Researcher Digital Portfolio | ✅ **PROCEED — marketing** | Growth order / marketing content. Zero code changes. |
| **WO-634** | 04_QA | Resend SMTP Auth Emails | ✅ **PROCEED — infrastructure** | Auth email configuration only. Zero conflict. |
| **WO-636** | 04_QA | Waitlist Form Error Fix | ✅ **PROCEED** | Public-facing form. Zero conflict with session/patient logic. |
| **WO-586** | 05_USER_REVIEW | Beta Account Provisioning | ✅ **PROCEED** | Admin/account work. No conflict. |
| **WO-602** | 03_BUILD / 04_QA | FlightPlanChart PDF Embed | ⚠️ **HOLD — pending B3** | Embeds chart into PDF using session timeline events. Safe to build the component, but final wiring depends on session data integrity (Track A A3). BUILDER may build component in isolation; do NOT wire to live session data until A3 is complete. |
| **WO-DISCHARGE-PDF** | 04_QA | Discharge PDF Upgrade | ⚠️ **HOLD — pending A2** | Reads session vitals for PDF output. Vitals data integrity (A2) must be confirmed before PDF wiring is finalized. |
| **WO-EXPORT-REPORTS** | 04_QA | Export Reports Live Data Wiring | 🔴 **PARKED — behind B3** | Directly wires `IntegrationPhase.tsx` to `buildPatientReportData()` using session + phase3 context. This data pipeline is undefined until the treatment cycle model (B2/B3) is implemented. Proceeding will wire incorrect data. |
| **WO-630** | 04_QA | ProtocolDetail Clinical Enhancements | 🔴 **PARKED — behind B1** | Touches `ProtocolDetail.tsx` session series logic and PHQ-9/GAD-7 trajectory fetch. The `patient_uuid` join problem it documents is the same gap that Track B item B1 (`ActivePatientContext`) is solving. Proceeding will create duplicate, conflicting implementations. |
| **WO-EPIC-606** | 04_QA | Patient-Centric Analytics Interface | 🔴 **PARKED — behind B1/B5** | Touches `ProtocolDetail.tsx` and `Dashboard.tsx` with analytics components. The analytics wiring depends on the patient context layer (B1) and cycle model (B5) being in place. Current implementation would wire to the broken data model. |
| **WO-EPIC-572** | 02_TRIAGE | Patient Compass & Magic Link EPIC | 🔴 **PARKED — behind B2/B3** | The magic link share flow fires from `IntegrationPhase.tsx` and the patient-facing report reads integration session data. The integration boundary (B3) must exist before this report makes clinical sense. The EPIC's child WOs can be audited and revised but must not be built yet. |
| **WO-589** | 02_TRIAGE | Wire MARKETER Into Agent Pipeline | ⚠️ **LOW PRIORITY — park after conference** | Agent pipeline work. No code conflict, but should not consume bandwidth during stabilization. |
| **WO-600** | 02_TRIAGE | Help System Video Script | ⚠️ **LOW PRIORITY** | Content/documentation. No code conflict. Park until after conference. |

---

## The Two Lane System

Rather than a single numerical queue, the pipeline runs in **two lanes** during stabilization:

### Lane 1 — Stabilization (Highest Priority)
Work moves through this lane first. Agents pick up Lane 1 WOs before touching Lane 2.

```
A0 (prerequisite): WO-640 B1 concomitant_med_ids TS fix  ← START HERE
A2: WO-A2 Vitals Chart DB Hydration
A3: WO-A3 Session Timeline/State Bleeding
A4: WO-A4 Cosmetic UI Regressions
B1: ActivePatientContext + ?patientUuid= routing
B2a: Status model disambiguation (schema + service)
B2: Begin New Treatment Cycle action
B3: Close Integration / Open Next Cycle gate
B4: Sidebar navigation improvements
B5: Phase 3 visualization wiring
```

### Lane 2 — Parallel Safe (Can proceed alongside Lane 1)
These WOs touch entirely separate areas and carry no conflict risk.

```
WO-640 audit protocol (after blockers cleared)
WO-643 Denver Demo Script  
WO-641 ClinicianDirectory Fix (after Track A is committed)
WO-642 Waitlist Route
WO-644 / WO-646 / WO-648 PDF QA + Marketing
WO-634 Resend SMTP
WO-636 Waitlist Form Fix
WO-586 Beta Account Provisioning
```

### Lane 3 — Parked (Do not begin)
```
WO-630 ProtocolDetail Enhancements    → after B1
WO-EPIC-606 Analytics Interface       → after B1 + B5
WO-EXPORT-REPORTS Live Data Wiring    → after B3
WO-EPIC-572 Patient Compass EPIC      → after B2 + B3
WO-602 FlightPlanChart PDF (wiring)   → component safe; live wiring after A3
WO-DISCHARGE-PDF vitals wiring        → after A2
WO-589 MARKETER Pipeline              → after conference
WO-600 Help Videos                    → after conference
```

---

## The Prerequisite: WO-640 B1 (TypeScript CI Fix)

Before **any** Track A WO starts, the TypeScript CI failure from WO-640 B1 must be resolved. The `concomitant_med_ids` references in 4 files are causing build failures. If BUILDER starts WO-A2 with a broken CI build, we cannot validate the fix. This is a 15-minute surgical fix that unblocks everything.

**Files:**
- `src/components/wellness-journey/WellnessFormRouter.tsx`
- `src/pages/WellnessJourney.tsx`
- `src/pages/ProtocolDetail.tsx`
- `src/lib/clinicalLog.ts`

**Action:** Remove all references to `concomitant_med_ids`. Do not re-add.

---

*Last updated: 2026-03-21T07:36:57-07:00*
