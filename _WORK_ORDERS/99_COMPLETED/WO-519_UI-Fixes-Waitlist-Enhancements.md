---
id: WO-519
title: "UI Fixes + Waitlist Form Enhancements (from WO-518 Open Questions)"
status: 00_INBOX
owner: LEAD
created: 2026-03-03
source: WO-518 approved resolutions
---

# WO-519 — UI Fixes + Waitlist Form Enhancements

> **Source:** WO-518 open question resolutions, approved by Trevor 2026-03-03  
> **Authored by:** CUE  
> **Status:** Inbox → 01_TRIAGE  

---

## Summary

Four discrete, surgical changes stemming from Jason's QA punchlist (WO-518) and Trevor's answers to the open questions. No schema-breaking changes. One additive DB migration required for the `last_name` column.

---

## Change Scope

### 1. Landing Page — Remove "Watch Demo (2 min)" Button

**File:** `src/pages/Landing.tsx`  
**Location:** Hero section CTA row (~line 196–201)  
**Action:** Delete the secondary CTA button labeled "Watch Demo (2 min)" that navigates to `/partner-demo`. The primary "Join the Waitlist" button remains. The flex row container should collapse gracefully with only one button.

---

### 2. Dashboard — Remove "Network Report" + "Log Session+" Header Buttons

**File:** `src/pages/Dashboard.tsx`  
**Location:** Header top-right button group (~lines 280–296)  
**Action:** Delete both buttons and their enclosing `<div className="flex items-center gap-3">` container. Clean up any now-unused imports (`BarChart3`, `Plus`) if no longer referenced elsewhere in the file.

---

### 3. Waitlist Form — Add `last_name` Field

**Files:** `src/pages/Waitlist.tsx`, `src/components/modals/WaitlistModal.tsx`  
**Action:**
- Add `lastName` to form state (alongside existing `firstName`, `practitionerType`)
- Add a "Last Name" input field in the UI (place after First Name, before Email)
- Include `last_name: form.lastName.trim()` in the Supabase `log_waitlist` insert payload
- Add `lastName` to the `isSubmittable` / disabled guard
- **Keep** `first_name` and `practitioner_type` — do NOT remove them

**Required DB Migration:**

```sql
-- Migration: add last_name to log_waitlist
ALTER TABLE public.log_waitlist
  ADD COLUMN IF NOT EXISTS last_name TEXT;
```

> [!IMPORTANT]
> BUILDER must run this migration via the `/migration-execution-protocol` workflow BEFORE deploying the frontend changes. The column is nullable (no `NOT NULL`) to preserve existing rows.

---

### 4. Waitlist Auto-Response Email — PRODDY PRD

> New work order to follow once items 1–3 are deployed. PRODDY to author a PRD for a branded Resend-triggered auto-response email on `log_waitlist` insert, covering: subject line, body copy, tone, visual template requirements, and trigger mechanism.

---

## PRODDY PRD

> **Work Order:** WO-519  
> **Authored by:** CUE  
> **Date:** 2026-03-03  
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement

Three separate UI surfaces (Landing page, Dashboard, Waitlist forms) contain elements that either confuse new users or are missing data we need (practitioner last name). The "Watch Demo" and two Dashboard header buttons create navigational noise Jason flagged as confusing. The waitlist form lacks last name, reducing the quality of our foundational cohort records.

### 2. Target User + Job-To-Be-Done

A first-time visitor and a returning authenticated practitioner need a clean, unambiguous interface — so that every CTA leads somewhere meaningful and every waitlist record captures enough identity to personalize outreach.

### 3. Success Metrics

1. Landing page hero section has exactly ONE primary CTA ("Join the Waitlist") — verified by Jason in retest.
2. Dashboard header area renders with zero orphan buttons — verified by Jason in retest.
3. `log_waitlist` rows inserted after deploy contain a non-null `last_name` for all new submissions — verified by querying Supabase directly.

### 4. Feature Scope

#### ✅ In Scope
- Remove "Watch Demo (2 min)" CTA from Landing hero
- Remove "Network Report" and "Log Session+" from Dashboard header
- Add `last_name` field to `Waitlist.tsx` and `WaitlistModal.tsx` forms + insert
- Additive `ALTER TABLE` migration for `log_waitlist.last_name` column

#### ❌ Out of Scope
- Changing or removing `first_name` or `practitioner_type` from any form
- `Academy.tsx` waitlist form (separate surface, not in scope)
- Auto-response email (separate WO to follow)
- PartnerDemoHub changes

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** Landing and Dashboard changes are Jason-identified UX blockers. Waitlist `last_name` is a data completeness issue that degrades outreach quality for every new signup from this point forward.

### 6. Open Questions for LEAD

1. Should `last_name` be `NOT NULL` for future rows, or remain nullable to avoid breaking existing inserts?
2. Confirm: `WaitlistModal.tsx` is triggered from the Landing page — should the modal version match the full-page `Waitlist.tsx` form exactly?

### PRODDY Sign-Off Checklist

- [x] Problem Statement ≤100 words, no solution ideas
- [x] Job-To-Be-Done single sentence, correct format
- [x] All 3 metrics are measurable/observable
- [x] Out of Scope populated
- [x] Priority tier has named reason
- [x] Open Questions ≤5 items
- [x] No code or SQL written in PRD section (migration is in the Change Scope section above, not the PRD)
- [x] `owner: LEAD`, `status: 00_INBOX`
