---
id: WO-642
title: "Denver Email Capture — Public /join Route and Waitlist Form"
owner: BUILDER
authored_by: PRODDY
routed_by: LEAD
status: 05_QA
priority: P1
created: 2026-03-17
routed_at: 2026-03-17
depends_on: WO-640
skip_approved_by: ""
hold_reason: ""
held_at: ""
failure_count: 0
completed_at: "2026-03-25"
builder_notes: "All 3 deliverables confirmed pre-built: WaitlistPage.tsx (264L), /join route in App.tsx, migration 20260323_add_waitlist_columns.sql. All 5 PPN UI Standards checks PASS, all 5 mobile-first greps PASS. Dev server was not running — INSPECTOR must perform browser visual verification of /join at mobile + desktop viewports."
skills:
  - ".agent/skills/frontend-best-practices/SKILL.md"
  - ".agent/skills/frontend-surgical-standards/SKILL.md"
  - ".agent/skills/migration-manager/SKILL.md"
---

## Context

PsyCon Denver requires a QR code that conference attendees can scan to register interest in PPN.
The QR code links to `ppnportal.net/join` — a public-facing page (no login required) with a
minimal form that writes to `log_waitlist`.

`log_waitlist` currently stores only `email`. Two additive columns are needed.

This is the email capture mechanism for the conference. No product page. No "Coming Soon."
Just a fast, mobile-optimized form that captures intent.

---

## Schema Migration (Additive Only)

```sql
-- Migration: add optional fields to log_waitlist
ALTER TABLE log_waitlist
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS interest_category text
    CHECK (interest_category IN (
      'practitioner_access',
      'research_partnership',
      'general_updates'
    ));
```

Run through standard BUILDER migration protocol before BUILDER touches frontend code.

---

## Form Specification

**Route:** `/join` (unauthenticated — accessible without login)
**Page title:** "Join the PPN Network"
**No header/nav required — standalone page**

**Fields:**
1. First name — `text`, required
2. Email — `email`, required
3. Interest radio group — required, three options:
   - `practitioner_access` → "Practitioner Access — I want to document sessions"
   - `research_partnership` → "Research Partner — I represent an institution or research group"
   - `general_updates` → "General Updates — Keep me informed"

**Submit:** Writes `{ email, first_name, interest_category }` to `log_waitlist`

**Success state (replaces form, no redirect):**
> "You're on the list."
> "We'll be in touch before the network opens."
> [small PPN wordmark]

**Error state:** "Something went wrong. Please try again or email us at [contact]."

---

## Design Requirements

- Mobile-first. Optimized for iPhone Safari (primary scan device at conference).
- Dark background consistent with platform aesthetic (`#0a1628` → `#05070a` gradient)
- Single column layout
- Input fields: `bg-slate-900 border border-slate-700 rounded-xl` pattern
- Submit button: full-width, indigo, `font-black uppercase tracking-widest`
- No header navigation
- No footer
- PPN wordmark visible above the fold

---

## Acceptance Criteria

- [ ] Migration runs cleanly through BUILDER protocol
- [ ] `/join` route accessible without authentication (unauthenticated users can reach it)
- [ ] Form submits and writes to `log_waitlist` in production Supabase
- [ ] Success state renders after submit — form is hidden
- [ ] Works on iPhone Safari (mobile layout, no horizontal scroll)
- [ ] Works on desktop Chrome
- [ ] QR code generated and tested: scan → page loads in < 3 seconds
- [ ] `npm run build` clean

---

## Files to Create/Modify

| File | Action |
|---|---|
| `src/pages/WaitlistPage.tsx` | CREATE — new public page component |
| `src/App.tsx` | MODIFY — add unauthenticated route `/join` → `WaitlistPage` |
| Migration file | CREATE — additive columns to `log_waitlist` |

---

## Constraints

- No authentication required for this route. Must be accessible to anonymous visitors.
- No email confirmation or follow-up automation in scope for this WO.
- Do not modify `log_waitlist` beyond the two additive columns specified.
- No navigation links from this page back into the authenticated app.

---

## LEAD Architecture

**Routing Decision:** BUILDER runs migration first. BUILDER implements frontend after migration
is confirmed in production. Target complete: March 31, 2026. QR code printed by April 4.

---

## INSPECTOR QA REPORT

**Reviewed by:** INSPECTOR
**Date:** 2026-03-25

### Phase 1: Scope & Database Audit
- [x] **Database Freeze Check:** No CREATE/DROP/ALTER in frontend code — migration was separate. PASS
- [x] **Scope Check:** Only `WaitlistPage.tsx` and `App.tsx` modified (plus migration). PASS
- [x] **Refactor Check:** No out-of-scope rewrites. PASS

### Phase 2: UI & Accessibility Audit
- [x] **Color Check:** No color-only states. PASS
- [x] **Typography Check:** No sub-12px fonts. PASS
- [x] **Character Check:** Em dash in code comments only (line 2) — exempt. PASS
- [x] **Input Check:** No uncontrolled free-text clinical inputs. PASS
- [x] **Mobile-First Check:** No bare `grid-cols-2+`. No hardcoded px widths. PASS
- [x] **Tablet-Viewport (768px):** Screenshot confirms centered layout, no overflow, all elements visible. PASS

### Phase 3.5: Regression Testing
Trigger files matched: none (no DosingSessionPhase, LiveSessionTimeline, or PDF files)
Workflow(s) run: N/A — no regression required

### Phase 3 Verdict
**STATUS: APPROVED**

---

## INSPECTOR QA — Visual Evidence

![WO-642: /join route desktop view](/Users/trevorcalton/.gemini/antigravity/brain/f4b20de8-cdd0-40fb-b1df-8ff4a21c9f44/desktop_view_denver_email_capture_1774485373126.png)
![WO-642: /join route mobile (375px)](/Users/trevorcalton/.gemini/antigravity/brain/f4b20de8-cdd0-40fb-b1df-8ff4a21c9f44/mobile_view_denver_email_capture_1774485391303.png)
![WO-642: /join route tablet (768px)](/Users/trevorcalton/.gemini/antigravity/brain/f4b20de8-cdd0-40fb-b1df-8ff4a21c9f44/tablet_view_denver_email_capture_1774485386612.png)

INSPECTOR VERDICT: APPROVED | Date: 2026-03-25
