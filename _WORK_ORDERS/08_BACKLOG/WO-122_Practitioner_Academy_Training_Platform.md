---
id: WO-122
title: "PPN Practitioner Academy — Training Course Platform"
status: 08_BACKLOG
owner: PENDING
failure_count: 0
created: 2026-02-20
priority: phase-2
tags: [training, LMS, courses, CEU, cohorts, phase-2, revenue-expansion]
---

# WO-122: PPN Practitioner Academy — Training Course Platform

## STATUS: PHASE 2 BACKLOG
> **Do not activate until Phase 1 (core portal) is stable and first paying cohort partners are identified.**

## USER CONTEXT
Confirmed by Trevor (2026-02-20): Training courses are a Phase 2 strategic initiative. Referenced in the roadmap as the "Adobe Strategy" — sell to training cohorts at $5–10K per cohort, onboard 30 new practitioners who are trained on PPN from day one.

---

## STRATEGIC CONTEXT (from Descript transcripts)

From `Building_the_Operating_System_for_Psychedelic_Practice.md`:
> "They want to sell to cohorts. Instead of selling to one doctor at a time, you sell to an entire training program... you sell to a program for five or ten thousand dollars a cohort. Suddenly you have 30 new practitioners who are trained on your software from day one. By the time they graduate, they already know how to use PPN. It's the Adobe strategy."

Target integration points identified in strategy docs:
- Colorado DORA training programs
- Oregon licensed psilocybin facilitator programs
- Independent training cohorts (MAPS, Synthesis, etc.)

---

## SCOPE (When Activated)

### Phase 2A — Lightweight Training Hub
- Course catalog page (`/training` or `/academy`)
- Video lesson embeds (Loom/YouTube/Vimeo)
- Module progress tracking (Supabase: `user_course_progress`)
- Completion certificates (reuse `ClinicalReportPDF` component)
- Gated behind Clinic Basic tier or above

### Phase 2B — Full LMS (Cohort Sales)
- Everything in 2A, plus:
- Cohort enrollment (Stripe group purchase → `cohorts` Supabase table)
- CEU credit hour tracking and exportable PDF transcripts
- Competency assessments with pass/fail thresholds
- Supervisor-assigned course paths
- Practitioner Academy branding

---

## FIRST COURSE CONCEPT (Ready to Build When Activated)

**"Documentation Standards for Psychedelic-Assisted Therapy"**
- Module 1: Why Documentation Matters (legal defense framing)
- Module 2: The Arc of Care — 3 Phases
- Module 3: Using the Wellness Journey Forms
- Module 4: Drug Interaction Screening
- Module 5: Safety Events and the Crisis Logger
- Module 6: Exporting Audit-Ready Reports

*Content source: existing Descript transcripts + portal walkthrough recordings*

---

## ACTIVATION TRIGGER
Activate when:
- [ ] Phase 1 portal is stable (post-beta)
- [ ] At least one training program cohort partner is identified
- [ ] Trevor confirms Phase 2 timeline

---

*Filed by PRODDY | February 2026*
