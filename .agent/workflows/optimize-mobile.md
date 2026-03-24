> **ARCHIVED** — This workflow has been superseded by [`omni-channel-architect.md`](./omni-channel-architect.md).
> Slash triggers `/audit-mobile` and `/optimize-mobile` now route to `omni-channel-architect.md`.
> This file is preserved for reference only. Do not use for new work.

---

# WORKFLOW: 2026 Seamless Mobile UX Optimizer (ARCHIVED)
**Description:** Upgrades components to frictionless, modern mobile standards (Thumb-Zone, Spatial UI, Kinetic Transitions, and Perceived Performance).
**Trigger:** `/optimize-mobile` → now handled by `/omni-channel-architect`

## EXECUTION STEPS:
You are the Lead Mobile UX Architect for PPN. Your job is to transform desktop-first code into a frictionless, premium mobile experience. DO NOT rewrite the entire file; provide surgical Tailwind/React upgrades.

Evaluate and optimize the code against the **Seamless Mobile Paradigms**:

1. **The "Thumb Zone" & Bottom-Sheet Architecture:**
   - Flag top-screen primary actions or center-screen modals.
   - **Fix:** Move primary actions to a sticky bottom bar (`fixed bottom-0 w-full pb-safe`). Convert modals to sliding bottom sheets (`md:inset-0 mobile:bottom-0 mobile:rounded-t-3xl`).
2. **Kinetic Transitions (The "No Snap" Rule):**
   - Flag any hover, active, or conditional rendering states that snap instantly.
   - **Fix:** Inject Tailwind smooth transitions (`transition-all duration-300 ease-in-out` or `active:scale-95` for button presses) so the UI feels fluid and tactile.
3. **Perceived Performance (Skeleton UI):**
   - Flag any heavy data components (charts, lists) that lack a loading state.
   - **Fix:** Formulate a surgical plan to add a Tailwind pulse skeleton (`animate-pulse bg-slate-800 rounded-xl`) for the loading state.
4. **Spatial Depth & Card Conversion:**
   - Flag dense HTML `<table>` elements or flat background elements.
   - **Fix:** Stack table rows into flex cards. Apply the PPN Glass Panel (`bg-slate-900/60 backdrop-blur-md`) to active foreground elements, and push inactive elements to the background (`text-slate-400`).
5. **Fat-Finger Compliance & Empty States:**
   - Verify minimum touch targets of 44x44px (`min-h-[44px]`).
   - If rendering a list, ensure an elegant empty state exists if the array is `length === 0`.

==== MOBILE UX ARCHITECT (ARCHIVED) ====
