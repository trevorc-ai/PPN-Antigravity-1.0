---
id: WO-413
status: 06_COMPLETE
owner: USER
cue_verified: true
cue_note: "Decision log ticket. LEAD to read first — answers all open questions from WO-408 and provides routing instructions for WO-409 through WO-412."
priority: P1
failure_count: 0
created: 2026-02-24
parent_ticket: WO-408
sprint: Sprint 2
tags: [admin, lead, routing, decisions]
---

# WO-413: CEO Decision Log — WO-408 Open Questions Resolved

## Purpose
This ticket documents the CEO's final decisions on all 5 open questions from WO-408 (`Waitlist_CTA_Launch_Strategy`). LEAD should use this to unblock all sub-tickets and confirm routing.

---

## Decisions Made (2026-02-24)

| Question | Decision |
|---|---|
| **Q1: Email tooling** | **Resend** confirmed. Step-by-step setup defined in WO-411. |
| **Q2: Routing — new page or reuse /academy?** | **Option A: New `/waitlist` page** — separate from Academy. Defined in WO-410. |
| **Q3: CTA copy** | **"Join the Waitlist"** — not "Request Access", not "Start Free Trial" |
| **Q4: Subscriber count display** | **Removed entirely.** Constitutional prohibition (GLOBAL_CONSTITUTION §5 added 2026-02-24): no counts or stats may appear unless real, verified data exists. |
| **Q5: Phase 2 (Pilot) entry criteria** | **Product readiness defines the timeline.** Targeted externally as "early spring 2026." Not a hard date. Not headcount-gated. LEAD confirms when product is ready. |

## Additional CEO Directives (verbatim)
- "No false statements, fabrications, or exaggerations, ever; they are strictly forbidden. Trust is our most important currency." → **Added to GLOBAL_CONSTITUTION §5** ✅
- "Beautifully designed, simple, minimal-text emails." → **Defined in WO-412** ✅
- "No dead ends; we should always be guiding the user toward their next step." → **Incorporated into WO-410 post-submit state design** ✅
- "Stripe is already set up and active." → **WO-411 updated: no Stripe setup needed; focus is email automation only** ✅

## LEAD Action Required
1. Confirm WO-409 routes to BUILDER (CTA surgery — low complexity, ready to start)
2. Confirm WO-410 routes to DESIGNER first (waitlist page design brief), then BUILDER
3. Confirm WO-411 routes to BUILDER (Resend wiring) — pending domain verification by Trevor
4. Confirm WO-412 routes to MARKETER (copy review) then DESIGNER (HTML email design) then BUILDER (swap into Edge Function)
5. Decide Email 2/3 delivery method: Resend Broadcasts (manual) or Supabase cron (automated) — document decision in WO-411

## Dependency Order
```
WO-410 (waitlist page) ──► WO-409 (CTA surgery, routes to /waitlist)
WO-411 (Resend wiring)
WO-412 (email copy + design) ──► WO-411 (swap placeholder HTML)
```
WO-409, WO-411, and WO-412 can start in parallel.
WO-409 final QA should happen after WO-410 is deployed (so `/waitlist` exists to route to).
