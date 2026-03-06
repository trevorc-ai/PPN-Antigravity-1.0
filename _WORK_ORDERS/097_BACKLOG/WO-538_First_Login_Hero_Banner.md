==== PRODDY ====
---
owner: LEAD
status: 01_TRIAGE
authored_by: PRODDY
---

## PRODDY PRD

> **Work Order:** WO-538 — First-Login Welcome Hero Banner
> **Authored by:** PRODDY  
> **Date:** 2026-03-04  
> **Status:** Draft → Pending LEAD review  

### 1. Problem Statement
When a new beta tester successfully navigates the Supabase authentication flow, they are dropped onto a complex, data-heavy dashboard without any immediate context or orientation. This cold-start experience causes confusion, increasing the likelihood of early churn and preventing users from understanding the immediate value of the platform.

### 2. Target User + Job-To-Be-Done
A newly invited partner needs to see a clear, welcoming orientation message immediately upon their first login so that they understand what to do next without feeling overwhelmed by the interface.

### 3. Success Metrics
1. 100% of newly authenticated users in the `partner` role are presented with the Welcome Hero Banner on their first login.
2. The auto-tour is initiated by at least 70% of new users via the Welcome Hero Banner's primary call-to-action.
3. The banner permanently dismisses after the first session and zero users see it on their second login (measured over 20 test accounts).

### 4. Feature Scope

#### ✅ In Scope
- A full-width, dismissible Welcome Hero Banner injected at the top of the main Dashboard view.
- Copywriting specifically tailored to the Partner Beta cohort, thanking them for participating.
- A primary Call-To-Action (CTA) button that triggers the existing product tour (WO-508).
- LocalStorage logic to track whether the user has seen and dismissed the banner.

#### ❌ Out of Scope
- Creating new product tour tooltips or modifying the existing WO-508 tour path.
- Server-side tracking of banner dismissal (LocalStorage is sufficient for MVP).
- Customizing the banner based on 4 different "Front Door" entry points (keep it general for Partners).

### 5. Priority Tier
**[X] P0** — Demo blocker / safety critical
**Reason:** Dropping VIP beta testers blindly into a blank or complex dashboard guarantees a poor first impression and high bounce rate. We cannot safely start the Partner Beta without orienting them.

### 6. Open Questions for LEAD
1. Should the Welcome Hero Banner completely obscure the dashboard content underneath, or sit inline at the top of the page grid?
2. If LocalStorage gets cleared, is it acceptable for the banner to reappear, or should we eventually move this setting to the `users` table preferences?

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
