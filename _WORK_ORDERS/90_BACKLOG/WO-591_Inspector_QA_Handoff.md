---
owner: LEAD
status: ARCHIVED
superseded_by: WO-601
authored_by: PRODDY
priority: P1
created: 2026-03-10
items:
  - WO-591: Magic Link / Patient Journey Auth Route (Bug)
  - WO-587/585: VIP Invite Flow + Public Folder Restructure (Feature)
sop_change: true
---

# Inspector QA Handoff — Two Items

**Date:** 2026-03-10  
**Handed off by:** PRODDY  
**Requires live-site testing on:** `ppnportal.net` (not localhost)  

> [!IMPORTANT]
> Per new SOP established this session: both items must be tested on the **live production site** at `ppnportal.net`. Local behavior is not a reliable proxy for production behavior. This is now the team standard.

---

## Item 1 — BUG: Patient Journey Magic Link Broken (P1)

### What was reported
Trevor generated a Customize Patient Journey Link from `MagicLinkModal.tsx`:
```
https://ppnportal.net/journey/auth?token=b99fbdd0&id=PT-5EDW5HV6J4
```
Clicking it redirected to the Dashboard instead of the Integration Compass / patient wellness journey view.

### Root cause (PRODDY analysis)
The path `/journey/auth` **does not exist as a route in `App.tsx`**. There is no `<Route path="/journey/auth" ...>` registered. The Vercel rewrite catches all unknown paths and returns `index.html`, the React app boots, the router finds no matching route, and the authenticated default (Dashboard) renders.

The link itself is generated correctly in `MagicLinkModal.tsx` (line 56):
```
https://ppnportal.net/journey/auth?token=${token}&id=${patientHash}
```
The **token** and **id** params are correctly constructed. The route simply was never wired.

### What INSPECTOR must verify on live site
1. Confirm the redirect-to-Dashboard behavior is reproducible at the URL above on `ppnportal.net`
2. Confirm no `/journey/auth` route exists in `App.tsx`
3. Confirm `MagicLinkModal.tsx` is generating the correct URL format
4. Flag for LEAD: LEAD must wire the `/journey/auth` route to the `WellnessJourney` (or equivalent) component with token/id param handling before this is functional

### Inspector checklist — Item 1
- [x] **Route Check:** Does `/journey/auth` exist as a `<Route>` in `App.tsx`? (NO — confirmed missing)
- [x] **Live Redirect Confirmed:** Does visiting the magic link URL on ppnportal.net redirect to Dashboard? (YES — redirects to #/landing)
- [x] **Token Format:** Is the generated link format correct per MagicLinkModal.tsx? (YES)
- [x] **Verdict:** Route is missing. Reject and route to LEAD for architecture decision on the `/journey/auth` handler.

---

## Item 2 — FEATURE: VIP Invite Flow + Public Folder Restructure

### What was done
Three coordinated changes were made this session:

**1. `/public/internal/` subfolder created**  
All internal/operational HTML files moved out of `/public/` root into `/public/internal/`:
- `trevor-showcase.html`
- `vip-invite-flow.html` ← new file, built this session
- `advisor-demo.html`
- `jason-demo.html`
- `jason-tour.html`
- `partner-hub.html`
- `partner-preview.html`
- `PPN_Bridge_Camera.html`

**2. `vercel.json` updated**  
Added one header rule that automatically blocks all `/internal/*` paths from search engine crawlers:
```json
{
  "source": "/internal/:path*",
  "headers": [{ "key": "X-Robots-Tag", "value": "noindex, nofollow" }]
}
```

**3. `robots.txt` simplified**  
Replaced 4 individual `Disallow` entries with one: `Disallow: /internal/`

**4. `vip-invite-flow.html` created**  
New internal tool at `ppnportal.net/internal/vip-invite-flow.html`. A 4-step interactive preview of the VIP beta invite flow: Admin Tool → Outbound Message → Beta Welcome Screen → Analytics Entry. Functional Web Share API with clipboard fallback.

**5. Guidebook written**  
`.agent/guidelines/html-internal-tools.md` — documents the internal HTML tool pattern as team standard.

### What INSPECTOR must verify on live site

**Crawler blocking (live site):**
- [x] Visit `ppnportal.net/internal/trevor-showcase.html` — confirm page loads (200 OK)
- [x] Check response headers — confirm `X-Robots-Tag: noindex, nofollow` is present
- [x] Visit `ppnportal.net/robots.txt` — confirm `Disallow: /internal/` appears and old individual disallows are gone

**VIP invite tool functionality:**
- [x] Visit `ppnportal.net/internal/vip-invite-flow.html` on mobile (iOS Safari preferred)
- [x] Tap through all 4 tabs (Your Tool / Their Message / They Land / They Enter)
- [x] On Step 1 (Admin Tool): paste a test URL into the Partner card input, tap Share — confirm Web Share API fires (iOS) or clipboard fallback triggers (desktop)
- [x] On Step 3 (Beta Welcome): tap "Enter the Network →" — confirm tab navigation to Step 4 works
- [x] Font size check: FAILED (Found 9px, 10px, 11px, 12px)
- [x] Em dash check: FAILED ("— Trevor" found in Step 2)

**`vercel.json` correctness:**
- [x] Confirm `headers` block appears before `rewrites` block in `vercel.json`
- [x] No syntax errors in JSON

### Inspector checklist — Item 2
- [x] `X-Robots-Tag: noindex, nofollow` confirmed on `/internal/*` paths on live site
- [x] `robots.txt` shows `Disallow: /internal/` (single entry, clean)
- [x] `vip-invite-flow.html` loads and all 4 tabs navigate correctly
- [x] Share button fires native share sheet on mobile / copies to clipboard on desktop
- [x] No typography violations (FAILED: text below 14px and em dashes found)
- [x] `vercel.json` is valid JSON with no syntax errors
- [x] No React source files modified (HTML-only changes)
- [x] No database changes (not applicable)

---

## New SOP: Live-Site Testing Required

> [!IMPORTANT]
> Established 2026-03-10: All QA going forward must include a live-site test pass on `ppnportal.net`. Local dev behavior is **not sufficient** to clear a ticket. Inspector must confirm behavior on production before issuing APPROVED status.

This applies especially to:
- Routing and redirects (HashRouter behavior differs from local Vite dev server)
- Vercel headers and rewrites
- Magic links and token-based auth flows
- Any feature that interacts with Supabase auth

---

## Summary for LEAD (after Inspector pass)

| Item | Status | LEAD Action Required |
|---|---|---|
| Journey magic link bug | 🔴 Bug confirmed — route missing | Wire `/journey/auth` route to patient wellness journey component |
| VIP invite flow + restructure | 🔴 QA Failed (Typography) | Route to BUILDER to fix font sizes (<14px) and replace em dash in vip-invite-flow.html |
