# RELEASE_STATUS.md

> **SINGLE SOURCE OF OPERATIONAL TRUTH**: Read this immediately after `MASTER_PLAN.md`.
> This document captures current beta state, active testers, and sprint priorities.
> LEAD updates this at the end of every session where a ticket reaches `05_USER_REVIEW` or `99_COMPLETED`.

**Version:** Beta 0.2  
**Last Updated:** 2026-02-26T15:40 PST  
**Sprint Theme:** Partner Beta Launch, First-Login Onboarding, UX Polish — Full Speed Build

---

## Current Beta Phase

We are in a **soft launch / controlled partner beta**. Invites are going out manually via Supabase magic link. No public signup. The waitlist page exists at `/waitlist` but is not being actively promoted yet.

---

## Active Beta Testers

| Role | Status | Notes |
|---|---|---|
| `admin` | Active | Trevor (co-founder, builder) |
| `owner` | Invite sent, testing | Jason (co-founder, Dr. Allen pilot) — invite link was resolved and re-sent |
| `partner_free` | Pending invite pool | Up to 10 additional testers being prepared |

> NOTE: Tester identity is kept at role-label level in this document to avoid PII in the repo. Specific names are known to Trevor and LEAD contextually.

---

## Last 5 Completed Work Orders

| WO | Title | Shipped |
|---|---|---|
| WO-511 | Global Feedback Widget (FeedbackCard + TopHeader + migration) | 2026-02-26 |
| WO-510 | Search Portal Restore — `/search` as post-login home | 2026-02-26 |
| WO-509 | RELEASE_STATUS.md Living Document | 2026-02-26 |
| WO-508 | First-Login Auto-Tour Trigger (App.tsx localStorage gate) | 2026-02-26 |
| WO-504 | Benchmark Cohorts Seeder (Production) | 2026-02-26 |

---

## Currently Active Sprint Tickets

| WO | Title | Status | Owner |
|---|---|---|---|
| WO-505 | Batch UI Refinements | 00_INBOX | PENDING LEAD triage |
| WO-500 | Partner Beta Testing Infrastructure | 01_TRIAGE | Pending USER sign-off |
| WO-430 | Data Hydration — Patient/Session Connect | 03_BUILD | BUILDER |
| WO-411 | Resend Email Automation Setup | 03_BUILD | BUILDER |
| WO-412 | Email Design and Copy | 03_BUILD | BUILDER |
| WO-246 | Substance Catalog Monograph Content Plan | 03_BUILD | BUILDER |

---

## Known UX Gaps (Active)

1. **No first-login welcome moment** - New users land on the Dashboard with no context or orientation. Being addressed by WO-507 (hero banner) and WO-508 (auto-tour trigger).
2. **Dashboard shows static/placeholder metric numbers** - Clinic Performance cards show hardcoded values. Real data hydration from Supabase is not yet wired for this section.
3. **Mobile sidebar UX** - On mobile, the sidebar is hidden and no guidance exists for how to navigate. The guided tour helps but requires the user to manually trigger it (WO-508 addresses auto-trigger).

---

## Key System State (as of this update)

- **Auth:** Supabase email invite flow is live and working. Site URL set to `https://ppnportal.net`. Magic links tested and confirmed.
- **Database:** `ref_user_roles` expanded to 8-tier role model. `ref_benchmark_cohorts` seeded with 11 production rows.
- **Email:** Branded Supabase invite email designed and deployed.
- **Schema:** Migrations 001-012 applied. Additive-only policy enforced.
- **RLS:** Active on all public tables. `partner` role scoped to own data.

---

## Upcoming (Next Invite Wave)

- Prepare 2-3 mock patient records per partner tester (WO-502, not yet created)
- Expand `is_test` column on patients table (WO-501, not yet created)
- PRODDY Feature Gate Matrix approved — pending USER sign-off on `partner_free` restrictions

---

## How to Update This Document

**LEAD updates RELEASE_STATUS.md when:**
1. A ticket moves to `05_USER_REVIEW` or `99_COMPLETED` — add it to Last 5 Completed and remove from Active Sprint
2. A new beta tester is invited — update the Active Beta Testers table (role label only, no names)
3. A known UX gap is resolved — remove from Known UX Gaps
4. The sprint theme changes — update the header and Sprint Tickets table

**Format rule:** This is always a current-state snapshot. Do NOT convert to a dated log. Overwrite stale values in-place.
