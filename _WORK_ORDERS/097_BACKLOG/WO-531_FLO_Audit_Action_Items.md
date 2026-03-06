---
id: WO-531
title: "FLO First Touch UI/UX Audit Fixes"
owner: PRODDY
status: 01_TRIAGE
priority: P1
failure_count: 1
---

## PRODDY PRD

> **Work Order:** WO-531 — FLO First Touch UI/UX Audit Fixes
> **Authored by:** CUE (Prepared for PRODDY)
> **Date:** 2026-03-04
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement
The first-touch endpoints (Login and Waitlist) violate the core 14px Accessibility Typography Mandate and deviate from the standard Glass Panel design system. This compromises the platform's commitment to readability under "Night-Vision" clinical conditions and introduces inconsistent visual aesthetics that reduce user trust.

---

### 2. Target User + Job-To-Be-Done
Both prospective users (Waitlist) and existing practitioners (Login) need to interact with highly legible, visually consistent authentication and signup forms so that they can access the platform without experiencing eye strain or navigation friction.

---

### 3. Success Metrics
1. 0 instances of `text-xs` utility classes on any form label, button, or link in `Login.tsx` and `Waitlist.tsx`.
2. Both authentication cards and waitlist forms strictly implement `bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem]`.
3. 100% of standard text inputs are replaced with a new globally reusable `<TextInput />` component that enforces `text-sm` labels.

---

### 4. Feature Scope

#### ✅ In Scope
- Refactoring typography in `Login.tsx` and `Waitlist.tsx` to `text-sm` (14px) minimum.
- Standardizing the card container styling to the Glass Panel standard across these two pages.
- Creating a shared `<TextInput />` component in `src/components/forms/TextInput.tsx` to enforce global styling and typography for text fields.

#### ❌ Out of Scope
- Refactoring inputs on any pages other than `Login.tsx` and `Waitlist.tsx` at this time.
- Changes to the backend authentication logic or Supabase `log_waitlist` table schema.

---

### 5. Priority Tier
**[x] P1** — High value, ship this sprint

**Reason:** Fixing accessibility violations on the very first screen a user sees (Login/Waitlist) is critical for setting the correct product expectation before Beta launch.

---

### 6. Open Questions for LEAD
1. Should the new `<TextInput />` component support "start" and "end" adornments (like icons)?
2. If bumping `text-xs` to `text-sm` causes horizontal overflow on mobile devices for the Login screen, should we adjust padding or stack the elements vertically?

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
- [x] Response wrapped in `==== PRODDY ====`

## 🛑 PRODDY PRD — INSPECTOR REJECTION
**failure_count:** 1

**Rejected checks:**
- [x] Missing mandatory inclusion of a full mobile and tablet view UI audit in the Feature Scope and Success Metrics. 

**Required fixes before resubmission:**
1. Update `Problem Statement` and `Job-To-Be-Done` to acknowledge the necessity of responsive layout integrity.
2. Add a `Success Metric` explicitly confirming zero overflow or overlapping elements in mobile and tablet viewports.
3. Explicitly list the mobile and tablet dimension audit in the `In Scope` section.

**Routing:** Owner → PRODDY. Status → 01_TRIAGE (no move needed, PRODDY revises in place).
