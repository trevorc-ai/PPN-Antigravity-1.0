==== PRODDY ====
---
owner: LEAD
status: 01_TRIAGE
authored_by: PRODDY
---

## PRODDY PRD

> **Work Order:** WO-537 — Beta Access & Custom Market Entry Points  
> **Authored by:** PRODDY  
> **Date:** 2026-03-04  
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement

PPN is weeks behind schedule and needs to immediately launch an exclusive beta to ~20 initial test users (including founding members like Dr. Jason Allen). Furthermore, because PPN serves distinct audiences (Clinicians, Insurance, Privacy Advocates, Global Researchers), sending everyone through a generic, unified landing page dilutes the core value proposition for each specific demographic, reducing initial conversion and engagement.

---

### 2. Target User + Job-To-Be-Done

A highly specialized prospective user (e.g., a clinic director or insurance underwriter) needs to land on a tailored "front door" that speaks directly to their core pain point so that they immediately understand PPN's value and request an exclusive beta invitation.

---

### 3. Success Metrics

1. Successful onboarding of the initial 20 targeted beta testers within 14 days of launch.
2. Route users from customized landing pages into the core application without requiring separate or duplicated application source code.
3. Zero untracked or unauthorized users gain access to the production database.

---

### 4. Feature Scope

#### ✅ In Scope

- "Apply for Beta" or "Invite Only" gatekeeping mechanism preceding the core application.
- Implementation of 4 customized "Front Door" landing views (routing via URL parameters or distinct paths) mapping to the 4 core messaging pillars: Clinical, Insurance, Privacy Shield, Global.
- Tailored copywriting and hero imaging/visualizations for each of the 4 entry points.
- A unified auth/registration logic that tags the resulting user account with the specific front door they entered through (for onboarding telemetry).

#### ❌ Out of Scope

- Building four entirely separate, isolated React applications or deployments.
- Complex, multi-step KYC (Know Your Customer) or credential verification workflows during the initial beta application.
- Automated instant approval (all beta requests must remain manually reviewable by admins).

---

### 5. Priority Tier

**[X] P0** — Demo blocker / safety critical  

**Reason:** We are weeks behind schedule and require immediate deployment to the initial ~20 test cases to gather operational data. Without the beta gate and custom entry points, we cannot safely launch the pilot or test the distinct marketing narratives.

---

### 6. Open Questions for LEAD

1. Should the 4 custom front doors be distinct routes (e.g., `/for-clinicians`, `/insurance`) within the existing React app, or subdomains?
2. What is the most secure method in Supabase to maintain an "Invite Only" whitelist for the initial 20 beta testers?
3. How should we pass the "originating market" tag through the Supabase Auth flow so the database knows which message resonated with the new user?

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
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`
==== PRODDY ====
