---
status: 00_INBOX
owner: LEAD
failure_count: 0
priority: P0
created: 2026-02-25T16:49:59-08:00
authored_by: PRODDY
sprint: Dr. Allen Pilot — Feb 26–28 2026
---

# WO-423 — Dr. Allen Pilot Launch Plan

**Verbatim User Request:** "We are going to be providing Dr. Allen an opportunity to test the PPN Portal tomorrow and pilot the application in a live environment on Friday. He wants a link today. Please provide a proposed plan so I can review it and forward it to the other agents for input. I need handholding on this process."

---

## PRODDY PRD

> **Work Order:** WO-423 — Dr. Allen Pilot Launch Plan
> **Authored by:** PRODDY
> **Date:** 2026-02-25
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

Dr. Allen expects a working link to the PPN Portal today and a live clinical pilot on Friday. The team has no structured plan governing the sequencing of deployment, account creation, access delivery, pre-pilot QA, standby protocol, or post-pilot debrief. Without this plan, the team risks sending broken credentials, deploying last-minute code that destabilizes the app, losing critical clinical feedback, or exposing real patient data without RLS verification. The founding team (Trevor + Jason) are the affected users.

---

### 2. Target User + Job-To-Be-Done

The founding team needs to execute a sequenced, zero-surprise pilot handoff to Dr. Allen so that he receives verified access tonight and encounters no blocking issues during Friday's live clinical session.

---

### 3. Success Metrics

1. Dr. Allen receives a working production URL + login credentials and successfully authenticates by **11 PM PST Wednesday 2026-02-25**.
2. Zero unrecoverable screen crashes occur during the Friday live pilot session — defined as no error requiring a full page reload to continue clinical work.
3. A structured post-pilot debrief ticket is created in `00_INBOX` within **2 hours of the Friday session ending**, containing: what worked, what broke, and one named priority action for the next sprint.

---

### 4. Feature Scope

#### ✅ In Scope
- Merge WO-413 feature branch (`feature/benchmark-confidencecone-live-data`) → `main` and confirm Vercel production deploy
- Create Dr. Allen's dedicated Supabase Auth account (clinic email + temporary password)
- Deliver production URL + credentials to Dr. Allen tonight
- INSPECTOR pre-pilot QA checklist — PPN-specific, not generic
- Named standby contact on call during Friday's live session
- Post-pilot Supabase data pull + integrity verification
- Post-pilot PRODDY debrief ticket intake

#### ❌ Out of Scope
- Any new feature builds (those live in WO-413 and sub-tickets)
- A separate staging environment or second Supabase project
- Automated test tooling or CI/CD pipeline changes
- UI changes in response to Thursday feedback — those become new P0 sub-tickets only if confirmed blockers

---

### 5. Priority Tier

**[X] P0** — Demo blocker / safety critical

**Reason:** Dr. Allen expects a link today. Friday is a live clinical session with potential real patients. Any miss on this sequencing plan is both a relationship risk and a patient safety risk. WO-413 features (Dose Calculator, QT Tracker) are confirmed P0 clinical requirements for Ibogaine monitoring.

---

### 6. Open Questions for LEAD

1. Which email should Dr. Allen's Supabase account use — his clinic email, or a dedicated `drallen.pilot@ppn.com`? Must be confirmed with Trevor before account creation.
2. Should Dr. Allen's account be created before or after the WO-413 merge? (Account creation is independent, but the URL sent must reflect the merged codebase.)
3. Who is the designated standby contact during Friday's live session — Trevor or Jason? One human must be named and reachable by phone throughout.
4. Is point-in-time recovery enabled on the production Supabase project? If not, session data loss during a live pilot has no recovery path.
5. What substance is Dr. Allen planning to use on Friday (Ibogaine or other)? This determines which components INSPECTOR should prioritize in the pre-pilot checklist.

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX` (awaiting USER approval before routing)
- [x] Response wrapped in `==== PRODDY ====`

---

## Execution Sequence (For LEAD Routing)

*This is the ordered task queue LEAD should use to route sub-tasks to agents. Each step gates the next.*

| # | Action | Owner | Deadline | Gates Next? |
|---|---|---|---|---|
| 1 | Wait for BUILDER to push WO-413 final commit | BUILDER | Now | ✅ Yes |
| 2 | INSPECTOR final QA pass on WO-413 acceptance checklist | INSPECTOR | Tonight | ✅ Yes |
| 3 | USER approves merge command | **USER** | Tonight | ✅ Yes |
| 4 | Merge feature branch → `main`, push to origin | LEAD/BUILDER | Tonight | ✅ Yes |
| 5 | USER confirms Vercel production URL loads after deploy | **USER** | Tonight | ✅ Yes |
| 6 | USER creates Dr. Allen's Supabase Auth account | **USER** | Tonight | No |
| 7 | USER sends Dr. Allen production URL + credentials | **USER** | By 11 PM PST | — |
| 8 | USER monitors Supabase for Dr. Allen activity Thursday | **USER** | Thursday | — |
| 9 | PRODDY intakes Dr. Allen's Thursday feedback as new P0 sub-tickets if needed | PRODDY | Thursday EOD | — |
| 10 | LEAD triages Thursday sub-tickets → P0 vs Backlog | LEAD | Thursday evening | — |
| 11 | BUILDER implements any confirmed P0 Thursday fixes | BUILDER | Thursday night | If needed |
| 12 | **HARD CODE FREEZE — no deploys after 9 AM Friday** | ALL AGENTS | Friday 9 AM | Hard rule |
| 13 | INSPECTOR runs PPN-specific pre-pilot checklist (below) | INSPECTOR | Friday morning | ✅ Yes |
| 14 | USER + Jason on standby (phone) during Friday pilot | **USER** | Friday all day | — |
| 15 | INSPECTOR pulls Supabase data post-pilot, verifies integrity | INSPECTOR | Friday EOD | — |
| 16 | PRODDY creates post-pilot debrief ticket in `00_INBOX` | PRODDY | Friday EOD | — |
| 17 | BUILDER runs `/finalize_feature` — push final state to remote | BUILDER | Friday EOD | — |

---

## INSPECTOR Pre-Pilot Checklist (Execute Friday Morning)

INSPECTOR must verify all items ✅ before clearing the live pilot:

- [ ] App loads at production Vercel URL without console errors
- [ ] App loads on Safari/iPad at 1024×768 viewport (Dr. Allen's confirmed device)
- [ ] Dr. Allen's Supabase account authenticates successfully
- [ ] Creating a new patient generates a synthetic Subject_ID — no real names
- [ ] Dose Calculator renders with HCl / TPA selector and both dose columns (`Administered mg` + `Active Ibogaine mg`)
- [ ] Adding a booster dose persists a row to `log_dose_events` in Supabase (`substance_type` populated)
- [ ] QT Interval Tracker renders with `Philips IntelliVue` / `Schiller ETM` device labels
- [ ] QTc ≥ 500ms triggers `[STATUS: DANGER]` banner on the affected device row
- [ ] QTc 475–499ms triggers `[STATUS: CAUTION]` banner on the affected device row
- [ ] Dr. Allen's account **cannot** see Trevor/Jason's patient records (RLS isolation)
- [ ] Session timer persists after page refresh — does not reset to zero
- [ ] Material Symbols icons render on first Safari load — no raw fallback text (e.g., `arrow_back`)
- [ ] Supabase point-in-time recovery confirmed enabled on production project

---

*PRODDY sign-off complete — 2026-02-25T16:51 PST. Ticket placed in 00_INBOX. Awaiting USER review and LEAD routing.*
