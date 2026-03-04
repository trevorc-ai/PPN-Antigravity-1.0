---
id: WO-535
title: Phase 3 Magic Link Modal for Patient Journey
owner: LEAD
status: 01_TRIAGE
filed_by: LEAD
date: 2026-03-04
priority: P2
files:
  - src/components/wellness-journey/IntegrationPhase.tsx
---

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
