---
id: WO-654-C
title: "Hero Video Embed in Waitlist Left Column"
parent: WO-654
owner: BUILDER
status: 98_HOLD
authored_by: LEAD
routed_by: LEAD
priority: P1
created: 2026-03-22
growth_order_ref: "GO-651"
hold_reason: "Awaiting GO-651 04_VISUAL_REVIEW approval — public-facing UI change per proddy-protocol v1.2"
held_at: "2026-03-22"
depends_on: "WO-636 (confirmed in 04_QA — cleared)"
admin_visibility: "no"
parked_context: "Route this to 03_BUILD immediately upon GO-651 reaching 04_VISUAL_REVIEW and user approving."
target_ship: "2026-04-01"
skills:
  - ".agent/skills/frontend-best-practices/SKILL.md"
  - ".agent/skills/ppn-ui-standards/SKILL.md"
  - ".agent/skills/frontend-surgical-standards/SKILL.md"
failure_count: 0
---

# WO-654-C — Hero Video Embed in Waitlist Left Column

## 🚫 HOLD — DO NOT BUILD

**HOLD REASON:** This ticket modifies the public-facing `/waitlist` page UI. Per `proddy-protocol` v1.2, GO-651 must complete `04_VISUAL_REVIEW` before BUILDER proceeds. This ticket releases to `03_BUILD` when GO-651 is approved.

---

## Context

Sub-ticket C of WO-654: embed the branded 2-minute explainer video into the **left column** of `src/pages/Waitlist.tsx`, positioned above the value-props grid and below the headline/subheadline.

---

## Acceptance Criteria

- [ ] `src/pages/Waitlist.tsx` left column contains a `<video>` element rendering `public/video/PPN Portal - Navigating the Psychedelic Frontier HB.mp4`
- [ ] Video attributes: `autoPlay muted loop playsInline` plus a `poster` fallback (BUILDER to use a frame grab or a dark placeholder image as poster)
- [ ] Video positioned **below the headline/subheadline, above the value-props grid** in the left column
- [ ] Video sizing: `max-h-[280px] w-full object-cover rounded-xl` on desktop; full-width on mobile (responsive, no horizontal scroll)
- [ ] Controls appear on hover (`className="..."` — use CSS hover group pattern or `controls` attribute, per Go-651 MARKETER approval)
- [ ] No sound — `muted` is mandatory
- [ ] Existing two-column split layout preserved — no structural changes to the outer grid
- [ ] Zero regression on success/duplicate/error states

---

## Files

| File | Action | FREEZE status |
|---|---|---|
| `src/pages/Waitlist.tsx` | **[MODIFY]** Add `<video>` element in left column | Not frozen |

---

## Do NOT Touch

- The right column (form side)
- Success, duplicate, or error state JSX
- Any global CSS or index.css
- WaitlistModal.tsx

---

## INSPECTOR QA

- [ ] Video renders in left column on desktop (1440px) and mobile (375px)
- [ ] Video autoplays muted — no audio fires on load
- [ ] Existing two-column layout intact
- [ ] Form submission flow unchanged (success/duplicate/error states)
- [ ] `npm run build` passes — zero TypeScript errors
