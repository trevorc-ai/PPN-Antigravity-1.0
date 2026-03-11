---
id: WO-535
title: Phase 3 Magic Link Modal for Patient Journey
owner: BUILDER
status: 99_COMPLETED
filed_by: LEAD
date: 2026-03-04
lead_triaged: 2026-03-09
priority: P2
parent_epic: WO-EPIC-572
files:
  - src/components/wellness-journey/IntegrationPhase.tsx
---

> **LEAD Triage Note (2026-03-09):** This ticket is unblocked. Per WO-EPIC-572 sprint sequence, WO-535 (Magic Link Modal UI) has no prerequisites and should be built immediately. Focus on UI only — simulate the backend link generation with a `Math.random()` token. No schema changes in scope.

## Feature Request

> **Work Order:** WO-535 — Phase 3 Magic Link Modal
> **Filed by:** LEAD

### Problem Statement

Practitioners need a way to easily share a customized, patient-facing view of the wellness journey outcomes ("Zero-Knowledge Safety" link) without exposing PHI.

### Requirements

1. Create a `MagicLinkModal` component based on the provided Clinical Sci-Fi design.
2. The modal should allow toggling `neurobiology`, `flightPlan`, and `pems` visibility.
3. The modal should generate a secure link using simulated backend functionality and copy it to the clipboard.
4. Integrate the modal trigger button into `IntegrationPhase.tsx`, specifically in the "Actions" section near the "Generate Progress Summary" button.
5. Add state and handlers to trigger the modal.

---
## INSPECTOR QA Sign-off
**Date:** 2026-03-11
**Verdict:** APPROVED. Code fixes verified on main branch.
