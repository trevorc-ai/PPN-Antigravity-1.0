---
id: WO-533
title: Companion App — Spherecules Video Not Playing (Black Screen)
owner: LEAD
status: 01_TRIAGE
filed_by: INSPECTOR
date: 2026-03-03
priority: P1
files:
  - src/components/wellness-journey/DosingSessionPhase.tsx
  - public/admin_uploads/spherecules.mp4
---

## INSPECTOR Audit Finding

> **Work Order:** WO-533 — Companion App: Spherecules Video Black Screen
> **Filed by:** INSPECTOR (sourced from live QA session, 2026-03-03)
> **Priority:** P1

---

### Problem Statement

When the practitioner opens the Companion overlay during a live Phase 2 dosing session, the video area above the feeling tap buttons displays a **black screen only** — the spherecules ambient video does not play.

The feeling tap buttons below the video are functional (BUG-529-06 fix now persists taps to the ledger), but the intended ambient visual experience for the patient is broken.

---

### Root Cause (Suspected)

The `CompanionVideo` component in `DosingSessionPhase.tsx` references `/admin_uploads/spherecules.mp4`. Possible causes:

1. **File not present at the expected path** — `public/admin_uploads/spherecules.mp4` may not exist or may not be committed to the repo.
2. **Browser autoplay policy** — modern browsers block autoplay on video elements unless the user has interacted with the page. The `muted` + `playsInline` attributes are present, which should permit autoplay, but the browser may still block it.
3. **Path mismatch** — the file exists but at a different path than `src="/admin_uploads/spherecules.mp4"`.

---

### BUILDER Pre-Build Checks

1. Verify `public/admin_uploads/spherecules.mp4` exists on disk and is committed to the repo.
2. If missing: confirm with USER where the file should be sourced from.
3. If present: add a `console.error` listener to the `<video>` element's `onerror` event to confirm what error the browser reports.
4. Check browser console for `MEDIA_ELEMENT_ERROR` or `NotSupportedError` during QA.

---

### Success Metrics

1. Opening the Companion overlay in a live Phase 2 session shows the spherecules ambient video playing (looped, muted, full-screen) — confirmed by INSPECTOR browser test.
2. No browser console errors related to the video element.

---

### Constraints

- Do not change the feeling tap button grid or its behavior
- Do not change the overlay layout or dark-room color scheme
- If the video file is missing from the repo, flag to USER before adding any placeholder
