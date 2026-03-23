---
id: WO-654-A
title: "Create PartnerDemoPage.tsx — Standalone Video Player at /partner-demo"
parent: WO-654
owner: BUILDER
status: 03_BUILD
authored_by: LEAD
routed_by: LEAD
priority: P0
created: 2026-03-22
growth_order_ref: "GO-651 (fast-lane P0 exception — see note below)"
depends_on: "WO-636 (confirmed in 04_QA — cleared to proceed)"
admin_visibility: "no"
parked_context: ""
target_ship: "2026-03-25"
skills:
  - ".agent/skills/frontend-best-practices/SKILL.md"
  - ".agent/skills/ppn-ui-standards/SKILL.md"
  - ".agent/skills/frontend-surgical-standards/SKILL.md"
failure_count: 0
---

# WO-654-A — Create PartnerDemoPage.tsx: Standalone Video Player at /partner-demo

## LEAD Architecture Note

> **P0 FAST-LANE EXCEPTION:** This sub-ticket carries `growth_order_ref: GO-651`, but GO-651 is in `00_BACKLOG` (has not completed `04_VISUAL_REVIEW`). The normal rule (proddy-protocol v1.2 §Public-Facing Engineering Gate) requires visual review before BUILD. However, the `/partner-demo` CTA in every waitlist confirmation email is already live and pointing to the wrong page — this is an active trust failure hitting every new signup today. LEAD is authorizing a P0 fast-lane: BUILDER may proceed with Sub-ticket A only. Sub-tickets C, D, E remain HOLD pending GO-651 visual review.

> **⚠️ FREEZE EXCEPTION REQUIRED — `src/App.tsx` is frozen per FREEZE.md.**
> Sub-ticket A requires ONE line change to `App.tsx`: replacing `PartnerDemoHub` with `PartnerDemoPage` on the existing `/partner-demo` route (line 422). This is a surgical 1-line swap — not a new route injection. BUILDER must confirm the user has approved this FREEZE exception before touching App.tsx. **Do not proceed with App.tsx until user explicitly approves in session.**

---

## Context

The waitlist confirmation email (`send-waitlist-welcome/index.ts`, line 164) contains:
```
<a href="https://ppnportal.net/#/partner-demo">Watch the 2-minute demo →</a>
```

The current `/partner-demo` route resolves to `PartnerDemoHub` — an authenticated internal feature gallery. The WO-654 PRD requires this route to serve a **new, unauthenticated, standalone 2-minute video player page** designed for Denver QR code visitors.

---

## Acceptance Criteria

- [ ] `src/pages/PartnerDemoPage.tsx` exists and renders
- [ ] Page: dark background `#070b14`, full-screen layout, no sidebar/nav
- [ ] Video: `public/video/PPN Portal - Navigating the Psychedelic Frontier HB.mp4`, autoplay muted, controls visible, responsive (full-width, max 16:9 ratio)
- [ ] Mobile-first: renders correctly on iPhone Safari (375px), no horizontal scroll
- [ ] PPN wordmark (`PPN Portal` text wordmark in top-left, `text-sm font-black text-primary uppercase tracking-widest` per ppn-ui-standards)
- [ ] "Join the Waitlist →" CTA button below video — routes to `/waitlist` (internal `<Link>`)
- [ ] Page is **NOT** wrapped in any auth guard — accessible with no login
- [ ] `console.log` verification: confirm route renders without AuthContext errors
- [ ] `App.tsx` line 422: replaces `<PartnerDemoHub />` with `<PartnerDemoPage />` (FREEZE exception, see above)
- [ ] Import added to `App.tsx` for `PartnerDemoPage` (lazy import, matching existing pattern)
- [ ] ZERO TypeScript compilation errors: `npm run build` passes clean

---

## Files

| File | Action | FREEZE status |
|---|---|---|
| `src/pages/PartnerDemoPage.tsx` | **[NEW]** Create | Not frozen |
| `src/App.tsx` | **[MODIFY]** Line 422: swap import + element | ⚠️ FROZEN — FREEZE exception required |

---

## Implementation

### Step 1 — Create `src/pages/PartnerDemoPage.tsx`

```tsx
// Design spec:
// - Background: #070b14 (not slate-950 — exact hex per WO-654)
// - No PageContainer, no Section, no sidebar
// - Full-viewport layout: flex flex-col items-center justify-center min-h-screen
// - Wordmark: top-left, absolute positioned
// - Video: max-w-5xl w-full rounded-xl, autoPlay muted controls playsInline
// - CTA: below video, "Join the Waitlist →" using Link to="/waitlist"
//   CTA style: px-6 py-3 bg-primary text-white font-black rounded-xl uppercase tracking-widest
// - DO NOT import PageContainer or Section
// - DO import Link from 'react-router-dom'
```

### Step 2 — Modify `src/App.tsx` (FREEZE exception — requires user sign-off)

At line 422 (confirmed via grep):
```tsx
// CURRENT:
<Route path="/partner-demo" element={<PartnerDemoHub />} />

// REPLACE WITH:
<Route path="/partner-demo" element={<PartnerDemoPage />} />
```

Also add/update lazy import at the top of App.tsx (match existing lazy import pattern):
```tsx
const PartnerDemoPage = lazy(() => import('./pages/PartnerDemoPage'));
```

**Surgical scope:** touch ONLY the import line and line 422. No other changes to App.tsx.

---

## Do NOT Touch

- `PartnerDemoHub.tsx` — leave in place (may still be linked from elsewhere, verify before removing)
- `send-waitlist-welcome/index.ts` — not in scope for Sub-ticket A
- Any auth guards or AuthContext — Sub-ticket A must work without touching frozen auth files
- Any CSS/Tailwind global styles — use inline style for `#070b14` background only

---

## INSPECTOR QA

- [ ] `https://ppnportal.net/#/partner-demo` → loads video player (no 404, no redirect to login)
- [ ] Video autoplays muted on desktop Chrome + mobile Safari
- [ ] "Join the Waitlist →" CTA routes to `/waitlist`
- [ ] PPN wordmark visible top-left
- [ ] No horizontal scroll on iPhone 375px
- [ ] `npm run build` passes — zero TypeScript errors
- [ ] `grep -n "PartnerDemoHub" src/App.tsx` → returns 0 results after swap
