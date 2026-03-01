---
id: WO-518
title: Spherecules Video Container — Companion Page Re-Integration
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
priority: P1
created: 2026-02-28
---

## PRODDY PRD

> **Work Order:** WO-518 — Spherecules Video Container — Companion Page Re-Integration
> **Authored by:** PRODDY
> **Date:** 2026-02-28
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

The `spherecules.mp4` video in `public/admin_uploads/` has been reformatted by the practitioner (new file ready). The video was previously rendered full-screen via a raw `<video>` tag with `absolute inset-0` positioning in `PatientCompanionPage.tsx`. The reformatted file needs to be placed inside a proper layout-aware container and re-inserted into the Companion component. Currently the page shows an uncontained video; the practitioner wants a containerized presentation that does not collide with the 16-button emotional-state grid at the bottom of the screen.

---

### 2. Target User + Job-To-Be-Done

A session patient needs to see the Spherecules ambient video clearly within the Companion screen so that they have a calming visual anchor during their psychedelic session without the video overlapping the feeling-log buttons they need to tap.

---

### 3. Success Metrics

1. The Spherecules video renders and plays in the Companion page on both mobile and desktop in ≤ 2 seconds of page load for 100% of QA test runs.
2. The 16 feeling-log buttons (grid at the bottom of `PatientCompanionPage.tsx`) are fully visible and tappable with zero overlap from the video container across all tested viewport sizes (375px–1440px wide).
3. Zero regression in the hold-to-exit lock button functionality (top-right corner) across 5 consecutive QA sessions after the video container is introduced.

---

### 4. Feature Scope

#### ✅ In Scope

- Restructure `PatientCompanionPage.tsx` into **two explicit, separate containers** in the page layout:
  1. **Video container** — holds the `<video src="/admin_uploads/spherecules.mp4">` tag; occupies the upper region of the screen.
  2. **Button grid container** — holds the 16 feeling-log buttons; sits below the video container and is never overlapped by it.
- Both containers must be **independently mobile-responsive** — tested at 375px (iPhone SE), 430px (iPhone Pro Max), 768px (iPad), and 1024px+ (desktop).
- The video is **portrait-oriented** (pre-rotated by the user at the file level). The video container should use `object-fit: cover` on a portrait aspect ratio (e.g. 9:16) so it fills cleanly without stretching or letterboxing on mobile/tablet.
- The video container must be `pointer-events-none` so it cannot capture tap/click events.
- Maintain existing `autoPlay`, `loop`, `muted`, `playsInline` video attributes.
- Preserve the existing gradient overlay (`bg-gradient-to-b from-black/50 via-transparent to-black/60`) for legibility.
- Preserve the existing `mix-blend-screen` and opacity treatment on the video element.
- The hold-to-exit lock button (top-right, `z-50`) must remain above both containers and fully accessible.

#### ❌ Out of Scope

- Changes to any other page or component outside `PatientCompanionPage.tsx`.
- Adding new video controls (pause, scrub, volume) — this is ambient, always auto-playing.
- Replacing or re-encoding the `spherecules.mp4` file — the portrait-formatted file is already in place at `public/admin_uploads/spherecules.mp4`.
- Changes to the feeling-log button grid design, colors, or tap logic.
- Any database writes or schema changes.

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** Dr. Allen specifically praised this feature during the pilot demo debrief. The reformatted file is already available. This is a high-visibility, low-risk UI reinstatement that directly supports practitioner confidence in the platform.

---

### 6. Open Questions for LEAD

1. Should the video container use a fixed height (`calc(100vh - [button-grid-height])`), a flex `flex-1` grow pattern, or a viewport-percentage approach (e.g. `h-[65vh]`)? LEAD to decide the layout strategy.
2. Should the video container apply a black background behind the portrait video on wide (desktop) viewports where the portrait frame won't fill edge-to-edge, or let the ambient black page background show through?
3. Should the containerized two-panel layout apply universally, or revert to full-bleed on desktop viewports ≥1024px?

*No additional open questions at this time.*

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
