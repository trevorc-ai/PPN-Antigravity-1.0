# 🚀 PPN PORTAL — MVP SPRINT BRIEF
## Circulation Document: All Agents + Trevor + Jason Preview Prep
**Classification:** All-Agent Reference | Partner-Safe Summary
**Author:** LEAD
**Date:** 2026-02-20
**Status:** 🟡 ACTIVE — Awaiting Sprint Execution
**Source Audits:** INSPECTOR QA 2026-02-20 | ANALYST WO-231 Master Brief

---

## EXECUTIVE SUMMARY

The PPN Portal is live at [ppnportal.net](https://ppnportal.net). The production site is visually complete, public routes load cleanly, and auth gating works correctly. The INSPECTOR has cleared WO-206 (Service Layer Isolation) and confirmed no blank screens, no JS errors, and no broken layouts on the six audited public pages.

**Two sprint tracks stand between us and MVP:**

| Track | Priority | Gate |
|-------|----------|------|
| **Track A — Accessibility Sprint** | P0 (blocks all) | Font/mobile fixes before any external partner sees the app on their phone |
| **Track B — Benchmark Intelligence** | P1 (parallel) | WO-231 data pipeline: the competitive moat and Day 1 analytics value |

Both tracks are defined below with exact work orders, owners, and acceptance criteria.

---

## WHAT INSPECTOR FOUND — THE HONEST VIEW

### ✅ What's Working
- Production site live at ppnportal.net — all public pages load cleanly
- Auth gating correctly redirects to login for protected routes
- WO-206 Service Layer: `arcOfCareApi.ts` barrel deleted, canonical service imports confirmed
- k-anonymity guard (`requireKAnonymity()`) implemented in `analytics.ts`
- Git is fully synced: `HEAD → main, origin/main`

### ❌ What's Blocking MVP
1. **Three outright sub-12px font violations** in `Phase1StepGuide.tsx` (9px, 10px, 11px) — WCAG 1.4.4 failure
2. **Mobile navigation (`MobileSidebar.tsx`) has `<h1>` and `<h3>` at 12px** — primary mobile nav is at the accessibility floor
3. **Form labels across 8+ components** are `text-xs` (12px) — should be `text-sm` (14px) per team rules
4. **45 `console.log` statements** — 2 log patient-adjacent data (`patientId`, email notifications)

### ⚠️ Mobile/Tablet Context (Jason Preview Risk)
If Jason or a clinic partner opens ppnportal.net on their iPhone to show a colleague, they will hit the Wellness Journey with **9px hover labels** in Phase 1. That is the exact moment to lose credibility. The fix is targeted and fast — a 30–60 minute BUILDER task.

---

## TRACK A — ACCESSIBILITY SPRINT (WO-240 Family)

> Full detail in `_WORK_ORDERS/01_TRIAGE/WO-240_MVP_Accessibility_Sprint.md`

### Sprint Work Orders

| WO | Title | Owner | Priority | Est. Time |
|----|-------|-------|----------|-----------|
| **WO-241** | Phase1StepGuide — Remove 9/10/11px violations | BUILDER | 🔴 P0 | 10 min |
| **WO-242** | MobileSidebar — Upgrade nav heading font sizes | BUILDER | 🔴 P0 | 15 min |
| **WO-243** | Form Label Font Sweep (8 files) | BUILDER | 🔴 P0 | 30 min |
| **WO-244** | Settings Page Mobile Responsiveness | BUILDER | 🟡 P1 | 45 min |
| **WO-245** | ProtocolBuilder PreviewPanel Labels | BUILDER | 🟡 P1 | 20 min |
| **WO-246** | SymptomDecayCurve & ArcOfCare Labels | BUILDER | 🟡 P1 | 20 min |
| **WO-247** | ConsentForm & SafetyAndAdverseEventForm | BUILDER | 🟡 P1 | 20 min |
| **WO-248** | Console.log Cleanup (patientId + email logs) | BUILDER | 🟢 P2 | 15 min |
| **WO-249** | RefPicker Section Header Upgrade | BUILDER | 🟢 P2 | 15 min |

**Total estimated time:** ~3 hours for full sprint
**P0 items only:** ~1 hour. Ship these now.

### P0 Files — Exact Lines for BUILDER

```
Phase1StepGuide.tsx line 118 → text-[10px] → text-xs
Phase1StepGuide.tsx line 213 → text-[11px] → text-xs
Phase1StepGuide.tsx line 221 → text-[9px]  → remove or text-xs

MobileSidebar.tsx  line 135 → <h1> text-xs → text-sm
MobileSidebar.tsx  line 160 → <h3> text-xs → text-sm
MobileSidebar.tsx  line 279 → nav item text-xs → text-sm

DateInput.tsx      line 58  → <label> text-xs → text-sm
AdverseEventLogger.tsx lines 114, 164, 177, 195 → labels text-xs → text-sm
BaselineAssessmentWizard.tsx lines 68, 248 → labels text-xs → text-sm
Section2_Treatment.tsx lines 21, 28 → labels text-xs → text-sm
PotencyNormalizerCard.tsx line 183 → label text-xs → text-sm
```

### INSPECTOR Gate (Track A)

No Track A PASS without:
- `grep -rn 'text-\[9px\]\|text-\[10px\]\|text-\[11px\]' src/` → 0 results
- `grep -rn '<label.*text-xs' src/` → 0 results
- `grep -rn '<h[1-6].*text-xs' src/` → 0 results
- `grep -rn 'console.log.*patient' src/ -i` → 0 results

---

## TRACK B — GLOBAL BENCHMARK INTELLIGENCE (WO-231 Family)

> Full detail in `_WORK_ORDERS/01_TRIAGE/WO-231_public-data-seeding-global-benchmarks.md`
> ANALYST Master Brief in `.agent/research/WO-231_MASTER_BRIEF.md`

This is the **product moat**. When a clinic logs a MADRS score reduction of 14 points, PPN today has no answer to *"Is that good?"* WO-231 fixes this by seeding published clinical trial benchmarks — extracted from open-access, CC BY 4.0 licensed papers.

### Why This Matters for the Jason Meeting

"We don't just track your outcomes — we compare them against every major published psilocybin trial in the world, including MAPS Phase 3 and Johns Hopkins MDD. Day 1."

That sentence is only true once WO-231 ships.

### Sprint Work Orders

| WO | Title | Owner | Priority | Blocker |
|----|-------|-------|----------|---------|
| **WO-231a** | Migration 059 — Create 3 benchmark tables | SOOP | 🔴 P1 | USER must execute SQL in Supabase |
| **WO-231b** | ETL Scripts + TypeScript hooks | BUILDER | 🔴 P1 | Depends on WO-231a |
| **WO-216** | 5 Core Analytics Queries (k-anonymity) | ANALYST→BUILDER | 🟡 P1 | Depends on WO-231a |

### The Three New Tables

| Table | Contents | Source |
|-------|----------|--------|
| `benchmark_trials` | 300–800 trial records from ClinicalTrials.gov | Public Domain API |
| `benchmark_cohorts` | 10 landmark paper extracts (MAPS, Johns Hopkins, COMPASS, etc.) | CC BY 4.0 open access |
| `population_baselines` | _Structure created now, seeded in Phase 2_ | SAMHSA TEDS |

### The 10 Benchmark Cohorts (ANALYST's CSV — Ready to Seed)

| Study | Modality | Condition | N | Key Finding |
|-------|----------|-----------|---|-------------|
| MAPS MAPP1 Phase 3 (Mitchell 2021) | MDMA | PTSD | 90 | 67% response, Hedges' g = -1.17 |
| MAPS MAPP2 Phase 3 (Mitchell 2023) | MDMA | PTSD | 104 | 71.2% response, Hedges' g = -1.01 |
| COMPASS COMP360 Phase 2b (Goodwin 2022) | Psilocybin | TRD | 79 | 37% response, Hedges' g = -0.58 |
| Johns Hopkins MDD (Davis 2021) | Psilocybin | MDD | 24 | 75% response, Hedges' g = -2.2 |
| Carhart-Harris Imperial TRD (2021) | Psilocybin | TRD | 59 | 58% response, Hedges' g = -0.91 |
| Bogenschutz AUD (2022) | Psilocybin | AUD | 93 | Significant AUDIT-C reduction |
| Unlimited Sciences Naturalistic (2023) | Psilocybin | Mixed | 8,049 | 83% PHQ-9 response rate |
| Metapsy Pooled (meta-analysis) | Psilocybin | MDD | Pooled | Hedges' g = -0.91 |
| Murrough et al. Ketamine MDD (2013) | Ketamine | MDD | 73 | 64% response, Hedges' g = -0.94 |
| Feder et al. Ketamine PTSD (2014) | Ketamine | PTSD | 41 | CAPS significant reduction |

### USER Action Required (WO-231 unblocks here)

Before SOOP and BUILDER can complete WO-231, you need to answer one question:

> **Is `SUPABASE_SERVICE_ROLE_KEY` populated in `backend/.env`?**

Find it in: Supabase Dashboard → Settings → API → "service_role" (secret key).
This is required for the Python seed scripts to write to the DB.

---

## PIPELINE BOARD — FULL QUEUE SNAPSHOT

### 🔴 Needs Immediate Action (Blocking MVP)

| Ticket | What | Owner | Status |
|--------|------|-------|--------|
| WO-241 | P1 font violations (9/10/11px) | BUILDER | Ready to build |
| WO-242 | MobileSidebar nav font sizes | BUILDER | Ready to build |
| WO-243 | Form label font sweep | BUILDER | Ready to build |

### 🟡 This Session (Core MVP Features)

| Ticket | What | Owner | Status |
|--------|------|-------|--------|
| WO-231a | Benchmark DB migration | SOOP | Ready to write |
| WO-231b | ETL scripts + TS hooks | BUILDER | Awaits WO-231a |
| WO-216 | Core analytics queries → analytics.ts | BUILDER | Queries written by ANALYST |
| WO-220 | Surface OCR Patient Bridge in app | BUILDER | Ready to build |
| WO-118 | Practitioner Directory DB connection | BUILDER | Ready to build |

### 🟢 Next Session / Post-MVP

| Ticket | What | Owner |
|--------|------|-------|
| WO-119 | Reference Table Request System | BUILDER |
| WO-103 | Give-to-Get Feature Gating | BUILDER |
| WO-244 | Settings mobile responsiveness | BUILDER |
| WO-245..249 | Typography cleanup | BUILDER |
| WO-226 | Landing Page v2 Full Redesign | DESIGNER |
| WO-123 | Academy Waitlist Page | DESIGNER |

### ✅ Recently Cleared (05_USER_REVIEW)

| Ticket | What | Status |
|--------|------|--------|
| WO-206 | Service Layer Isolation | ✅ INSPECTOR PASS |
| WO-120 | User Manual Template | ✅ USER REVIEW |
| WO-124 | Phantom Shield Field Campaign | ✅ USER REVIEW |

---

## RECOMMENDED EXECUTION ORDER FOR TODAY

```
NOW (30 min):
  BUILDER → WO-241, 242, 243 [P0 font fixes — no design needed]
    ↓
PARALLEL:
  SOOP → WO-231a [benchmark migration SQL]
  BUILDER → WO-216 [add ANALYST's 5 queries to analytics.ts]
    ↓
AFTER WO-231a APPROVED:
  BUILDER → WO-231b [ETL scripts + benchmarks.ts TS hook]
    ↓
INSPECTOR → Full re-audit (Track A accessibility + Track B code review)
    ↓
USER → Execute migration 059 in Supabase → Run seed scripts
    ↓
USER → MVP sign-off
```

---

## PARTNER BRIEF ADDENDUM

*For Trevor's use when presenting to Jason:*

**What's live now:**
- Full clinical data capture pipeline (20-form Wellness Journey)
- Safety surveillance with adverse event logging
- Substance catalog, drug interaction checker
- Protocol builder with dose management
- Analytics dashboard with outcome tracking
- Privacy layer (Phantom Shield) — zero clinical data in transit
- Practitioner directory
- Pricing: Guild (free/contribute), Enterprise (per site), Researcher (custom)

**What's shipping this sprint (48–72 hours):**
- Global benchmark comparisons: "Your outcomes vs. Johns Hopkins Phase 2" — live in the analytics dashboard
- Mobile accessibility pass — every clinical form and nav element readable on any phone
- Patient Bridge (OCR scan → PPN ID) surfaced directly in the patient select modal

**The vision in one sentence:**
> *"Every practitioner who joins on Day 1 sees their patient outcomes compared to every major published psychedelic trial in the world — not an empty chart."*

---

**— LEAD, 2026-02-20T04:29:00-08:00**
