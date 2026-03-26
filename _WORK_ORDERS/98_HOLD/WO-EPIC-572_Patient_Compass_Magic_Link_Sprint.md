---
id: WO-EPIC-572
title: "EPIC: Patient Compass & Magic Link — Full Patient-Facing Report Suite"
owner: LEAD
status: 01_TRIAGE
filed_by: INSPECTOR
date: 2026-03-06
priority: P1
type: EPIC
child_work_orders:
  - WO-535  # Magic Link Modal (practitioner share trigger)
  - WO-528  # Token-Gated Patient Hub (/patient/:token)
  - WO-539  # Phase 3 Patient Visualizations (Spider + Flight Plan)
  - WO-546  # Patient Compass Progressive Disclosure Hybrid (UX)
  - WO-547  # Mobile Chart Scroll + Smart Tooltips
  - WO-523  # PatientReport Color Correction + Colorblind A11y Audit
  - WO-536  # RLS Two-Tier Policy (infrastructure prerequisite)
related_download_center: true
---

# EPIC: Patient Compass & Magic Link — Full Patient-Facing Report Suite

## Overview

This EPIC tracks the complete patient-facing report and action plan system — the suite of tools that allows a practitioner to generate and share a customized, clinically-validated post-session deliverable directly with their patient via a secure Magic Link.

This is a **North Star feature**: it closes the practitioner-to-patient feedback loop, drives daily self-reporting (longitudinal data), and is the primary "wow moment" for the patient after a treatment session.

---

## The Full User Flow

```
[Phase 3 / IntegrationPhase.tsx]
  └── Practitioner taps "Share with Patient" (WO-535: Magic Link Modal)
        └── Selects which modules to activate (neurobiology, flightPlan, pems)
              └── Generates /patient/:token URL (WO-528: Token-Gated Hub)
                    ├── Pre-Session: Intake / Set & Setting summary
                    ├── During: PatientCompanionPage.tsx (existing)
                    └── Post-Session: PatientReport.tsx (WO-523 clean)
                          ├── Spider/Radar Chart (WO-539)
                          ├── Flight Plan Area Chart (WO-539)
                          ├── Progressive Disclosure UX (WO-546)
                          └── Mobile Chart Scroll + Tooltips (WO-547)
```

Also surfaced from: **Download Center → "Patient Deliverables"** category.

---

## Sprint Sequence (Recommended)

| Sprint Order | WO | Name | Blocker |
|---|---|---|---|
| 1 | **WO-536** | RLS Two-Tier Policy (anon inserts) | LEAD design decision required first |
| 2 | **WO-535** | Magic Link Modal UI | None — build immediately |
| 3 | **WO-528** | Token-Gated `/patient/:token` Hub | Needs WO-535 modal + LEAD schema decision |
| 4 | **WO-539** | Spider Graph + Flight Plan Charts | None — accepts mock prop data |
| 4 | **WO-546** | Progressive Disclosure UX | None — layout work |
| 4 | **WO-547** | Mobile Chart Scroll + Smart Tooltips | None — CSS/Recharts only |
| 5 | **WO-523** | PatientReport Color + A11y Audit | Needs Sprint 4 charts in place |

> **WO-536 LEAD Decision Required:** What is the companion app's session validation mechanism — (a) any valid `session_id`, (b) `is_active = true` sessions only, or (c) companion-specific access token? This is gating WO-528's schema.

---

## Download Center Integration

The "Patient Deliverables" card in `DownloadCenter.tsx` will surface:
- **Share Patient Compass** → triggers WO-535 Magic Link Modal
- **Patient Compass** → routes to `/patient-report`
- **Wellness Summary PDF** → triggers `reportGenerator.ts`

---

## Status Tracking

| WO | Status | Notes |
|---|---|---|
| WO-536 | `01_TRIAGE` | LEAD design Q open |
| WO-535 | `097_BACKLOG` | Unblocked — ready to build |
| WO-528 | `99_COMPLETED` (PRD only) | LEAD schema Q open re: new table vs JSONB |
| WO-539 | `01_TRIAGE` ✅ promoted 2026-03-06 | P1 |
| WO-546 | `01_TRIAGE` ✅ promoted 2026-03-06 | P1 |
| WO-547 | `01_TRIAGE` ✅ promoted 2026-03-06 | P1 |
| WO-523 | `01_TRIAGE` ✅ promoted 2026-03-06 | P1 — last in chain |


---

> 🔴 **PARKED — 2026-03-21:** This EPIC is parked behind Track B items B2 + B3. The magic link share flow and patient report read integration session data that is currently undefined. Child WOs may be audited and revised but must not be built until STABILIZATION_BRIEF.md B2 + B3 are complete. See PIPELINE_TRIAGE_2026-03-21.md.
