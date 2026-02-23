---
id: WO-405
title: "Pre-Demo Blocker Flag — WO-400 Fast-Forward Seeder Must Complete Before Singularism Demo"
status: 01_TRIAGE
owner: LEAD
created: 2026-02-23
created_by: PRODDY
failure_count: 0
priority: P0
tags: [demo-readiness, singularism, pre-demo, fast-forward-seeder, blocker]
depends_on: [WO-400]
---

# WO-405: Pre-Demo Blocker — Seeder Must Run Before Singularism Call

## WHY THIS TICKET EXISTS

PRODDY has flagged WO-400 (Phase 3 Fast-Forward Seeder) as a **hard dependency** for the Singularism founding partner demo. This ticket documents the reason and the specific risk so LEAD can prioritize WO-400 appropriately.

---

## THE PROBLEM

WO-402 spec'd a `[DEMO DATA]` badge — an amber `🟡 DEMO DATA` indicator that renders on every Phase 3 panel when the system is running on mock/fallback data (no real session records).

This badge is the right UX for a real clinic onboarding flow. It is the **wrong thing to show on a pitch call.**

If WO-400 is not executed before the Singularism demo, Jason will be presenting a Phase 3 integration screen covered in amber "DEMO DATA" labels to an organization that is being asked to pay $35,000 for the platform. This materially undermines the close.

---

## CONTEXT: WHY THIS DEMO MATTERS

Singularism (Provo, UT) is a close connection of Jason's (PPN co-founder). They have already seen an early concept demo and expressed interest in being beta testers. They are currently under active federal prosecution related to the physical seizure of their participant records — the exact problem PPN Portal is architecturally designed to prevent.

This is not a cold sales call. This is a conversion of a warm, inbound commitment into a $35,000 founding partner agreement. First impression on the live platform matters.

**Reference:** `_WORK_ORDERS/BUSINESS_DOCS/Jason_Singularism_Demo_Script_2026-02-23.md`

---

## WHAT NEEDS TO HAPPEN (SOOP → BUILDER)

**SOOP** must complete the SQL seeder script (`supabase/tests/seed_phase3_qa_patient.sql`) per WO-400 spec:
- Insert mock user, mock patient profile
- Populate `log_clinical_records`, `log_session_vitals`, `log_baseline_assessments`
- Include a baseline PHQ-9 score so the Symptom Decay chart renders

**BUILDER** then:
1. Execute the seeder script against the dev/staging environment (NOT production)
2. Load the Wellness Journey, navigate to Phase 3 for the seeded patient
3. Confirm: all `[DEMO DATA]` badges have disappeared from panels with seeded data
4. Document the patient Subject ID created by the seeder (Jason needs this to navigate directly to it on the demo call)

---

## ACCEPTANCE CRITERIA FOR DEMO READINESS

- [ ] Seeder SQL exists and executes without errors
- [ ] Phase 3 Integration view shows seeded data, not mock fallback
- [ ] Zero `[DEMO DATA]` badges visible on Phase 3 screens
- [ ] BUILDER documents the test patient Subject ID in a note appended to this ticket
- [ ] Smoke test: Jason (non-developer) can navigate to the seeded patient in under 60 seconds

## ROUTING

LEAD → SOOP (for SQL seeder) → BUILDER (for execution + verification) → PRODDY (to confirm demo-ready)

---

## ⚠️ DEMO GATE

**The Singularism demo call should not be scheduled until BUILDER marks this ticket complete.**

Jason should send the outreach message (`Jason_Singularism_Outreach_Message_2026-02-23.md`) to request a time, but should push for a date that gives the team at least 3–5 business days to complete WO-400 first.
