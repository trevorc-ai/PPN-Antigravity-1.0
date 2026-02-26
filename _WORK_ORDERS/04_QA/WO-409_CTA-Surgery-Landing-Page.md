---
id: WO-409
status: 04_QA
owner: INSPECTOR
cue_verified: true
cue_note: "Ticket complete. Route to BUILDER. No blockers — spec is fully defined."
priority: P1
failure_count: 1
created: 2026-02-24
parent_ticket: WO-408
sprint: Sprint 2
tags: [landing-page, cta, builder]
---

## LEAD ARCHITECTURE
- **Routing:** Route to 03_BUILD for `owner: BUILDER`.
- **Strategy:** All CTA surgery details are precisely defined in the PRD. Implement the changes in `src/pages/Landing.tsx`. Pay close attention to making sure NO fabricated numbers are used per the constitution update.

# WO-409: CTA Surgery — Landing Page (`Landing.tsx`)

## User Prompt (verbatim)
"We currently have various CTAs that are pointing in different directions from the landing page."

## Context
Derived from WO-408 strategic audit. The landing page has 6 CTAs pointing at broken or misaligned destinations. Three require immediate fixing. Decisions have been made by CEO (2026-02-24).

## Decisions Already Made
- Primary CTA copy: **"Join the Waitlist"** (not "Request Access", not "Start Free Trial")
- Primary CTA destination: **`/waitlist`** (new dedicated page — being built in WO-410)
- Subscriber count near CTA: **Remove entirely** — per GLOBAL_CONSTITUTION Section 5 (no fabrication), no count may appear until real data exists
- Phase: Demo Phase — no billing language anywhere on the landing page

## Exact Changes Required in `src/pages/Landing.tsx`

### Change 1 — Hero Primary Button (Line ~188-192)
**BEFORE:**
```tsx
<button
  onClick={() => navigate('/checkout')}
  className="... bg-indigo-600 ..."
>
  Start Free Trial
</button>
```
**AFTER:**
```tsx
<button
  onClick={() => navigate('/waitlist')}
  className="... bg-indigo-600 ..."
>
  Join the Waitlist
</button>
```

### Change 2 — Benchmarking "View Live Demo" Button (Line ~750-756)
**BEFORE:** `onClick={() => navigate('/analytics')}` — auth-gated, bounces unauthenticated users to login
**AFTER:** `onClick={() => navigate('/partner-demo')}` — routes to the live PartnerDemoHub

### Change 3 — Veterans "Join the Mission" Button (Line ~1035)
**BEFORE:** `onClick={() => window.location.href = 'mailto:info@ppnportal.net'}`
**AFTER:** `onClick={() => navigate('/waitlist')}`

### Change 4 — Early Access Badge (Line ~229-235)
The badge currently reads "Purpose-Built Infrastructure" which is fine. However, if it contains any invented numbers or implied user counts, remove them. Do not add fabricated counts.

### Change 5 — Global Alliance section (Line ~403)
The text reads: `"Early access open to licensed practitioners — apply at ppnportal.net"`
Update to: `"Join the waitlist for founding practitioner access"` with the CTA linking to `/waitlist`

## Acceptance Criteria
- [ ] "Start Free Trial" no longer appears anywhere on the landing page
- [ ] "Join the Waitlist" is the primary hero CTA, routes to `/waitlist`
- [ ] Benchmarking "View Live Demo" routes to `/partner-demo` (not `/analytics`)
- [ ] Veterans "Join the Mission" routes to `/waitlist` (not mailto)
- [ ] Zero fabricated numbers or counts anywhere on the page
- [ ] All 6 CTA destinations resolve to live routes (no 404s, no auth-gated bounces)
- [ ] QA: click every CTA while logged out — all should land cleanly

---

## 🛑 [STATUS: FAIL] — INSPECTOR REJECTION
**Rejected by:** INSPECTOR
**Date:** 2026-02-25T15:36 PST
**failure_count:** 1

**Reason:**
- [ ] AC item "Primary hero CTA routes to `/waitlist`" — FAIL. Hero button (line 190) calls `setIsWaitlistModalOpen(true)` instead of `navigate('/waitlist')`. The spec explicitly says `navigate('/waitlist')`.
- [ ] AC item "Veterans 'Join the Mission' routes to `/waitlist` (not mailto)" — PARTIAL PASS on the mailto removal, but the button (line 1037) calls `setIsWaitlistModalOpen(true)` not `navigate('/waitlist')`. The spec says `navigate('/waitlist')`.

**What passed:**
- ✅ "Start Free Trial" no longer found anywhere on the page
- ✅ Benchmarking "View Live Demo" routes to `navigate('/partner-demo')` (line 753)
- ✅ Veterans section opens waitlist flow (modal, not mailto — improvement confirmed)

**Required before resubmission:**
1. In `Landing.tsx` line 190: change `onClick={() => setIsWaitlistModalOpen(true)}` to `onClick={() => navigate('/waitlist')}` for the hero primary button
2. In `Landing.tsx` line 1037: change `onClick={() => setIsWaitlistModalOpen(true)}` to `onClick={() => navigate('/waitlist')}` for the Veterans "Join the Mission" button
3. Add a `## BUILDER IMPLEMENTATION COMPLETE` section to the ticket documenting what was changed

**Note for BUILDER:** The modal UX is not wrong — but the spec contract specifies the standalone `/waitlist` route. The modal can be retained for secondary entry points (e.g., Global Alliance section line 405). Only the two ACs above need the route change.
