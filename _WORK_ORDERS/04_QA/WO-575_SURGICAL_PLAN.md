# WO-575 — SURGICAL PLAN
## Landing Page Full Mobile Optimization Sprint

**Owner:** BUILDER  
**Authored by:** LEAD  
**Date:** 2026-03-06  
**Target file:** `src/pages/Landing.tsx` (primary), `src/components/StarField.tsx` (read-only guard)  
**Status:** Approved for build — all PRODDY open questions resolved (see below)

---

## LEAD Design Decisions (Resolved — Non-Negotiable)

| # | Question | Decision |
|---|---|---|
| 1 | StarField on mobile | **Fully disabled on mobile — replace with static CSS gradient** |
| 2 | `React.lazy` for 3 demo charts | **Yes — use `React.lazy` + `Suspense`** |
| 3 | SURGICAL_PLAN format | **One combined doc (this file)** |

---

## Fix 1 — Lazy-Load the 3 Demo Chart Components

**File:** `src/pages/Landing.tsx`  
**Current lines 29–31:**
```tsx
import SafetyRiskMatrixDemo from '../components/demos/SafetyRiskMatrixDemo';
import ClinicRadarDemo from '../components/demos/ClinicRadarDemo';
import PatientJourneyDemo from '../components/demos/PatientJourneyDemo';
```

**Replace with:**
```tsx
import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
// … (add Suspense + lazy to the existing React import on line 1)

const SafetyRiskMatrixDemo = lazy(() => import('../components/demos/SafetyRiskMatrixDemo'));
const ClinicRadarDemo = lazy(() => import('../components/demos/ClinicRadarDemo'));
const PatientJourneyDemo = lazy(() => import('../components/demos/PatientJourneyDemo'));
```

**Note:** Remove the 3 eager static imports (lines 29–31). Add `Suspense` and `lazy` to the existing React import on line 1. Do NOT add a second React import line.

**Wrap each demo usage site** (lines ~709, ~781, ~816) with a `<Suspense>` boundary:
```tsx
<Suspense fallback={
  <div className="w-full h-48 rounded-2xl bg-slate-800/60 animate-pulse" />
}>
  <SafetyRiskMatrixDemo />
</Suspense>
```
Apply the same `Suspense` wrapper to `ClinicRadarDemo` and `PatientJourneyDemo`. The pulse skeleton must use the same container dimensions as the existing `min-w-[500px]` wrapper div already present at each site.

---

## Fix 2 — Disable StarField on Mobile (Static CSS Gradient Replacement)

**File:** `src/pages/Landing.tsx`  
**Current line 138:**
```tsx
<StarField scrollY={scrollY} />
```

**Replace with:**
```tsx
{/* StarField: desktop-only — replaced with static CSS gradient on mobile for performance */}
<div className="hidden lg:block">
  <StarField scrollY={scrollY} />
</div>
{/* Mobile static sky — no canvas, no SMIL, zero battery drain */}
<div
  className="fixed inset-0 pointer-events-none overflow-hidden z-0 lg:hidden"
  aria-hidden="true"
  style={{
    background:
      'radial-gradient(ellipse 80% 60% at 50% 20%, #0f1f3d 0%, #07101e 60%, #040c18 100%)',
  }}
/>
```

**Do NOT modify `StarField.tsx`** — this fix is 100% in `Landing.tsx` via Tailwind responsive visibility. The `scrollY` state and `handleScroll` listener on lines 52 and 70–76 may remain — they are lightweight and used by other elements.

---

## Fix 3 — Frankenstein Stack: Disable Sticky + Parallax on Mobile

**File:** `src/pages/Landing.tsx`  
**Current line ~520:**
```tsx
<motion.div style={{ y: cardParallaxY }} className="relative sticky top-32 lg:top-48 z-10 pt-4 pb-12">
```

**Replace with:**
```tsx
<motion.div
  style={{ y: cardParallaxY }}
  className="relative lg:sticky lg:top-48 z-10 pt-4 pb-12"
>
```

**What this does:** Removes `sticky` and `top-32` on mobile viewports. The card becomes a normal `relative` block in the document flow — no scroll track dependency. On `lg+` it remains sticky as designed. The `cardParallaxY` motion value still applies on all viewports; if it causes layout jank on mobile we can null it, but start here first.

**Also:** Add `prefers-reduced-motion` guard to the `useScroll` parallax values. At the top of the `Landing` component (after existing state declarations), add:

```tsx
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const cardParallaxY = useTransform(
  frankProgress,
  [0, 1],
  prefersReducedMotion ? [0, 0] : [60, -60]
);
const glowParallaxY = useTransform(
  frankProgress,
  [0, 1],
  prefersReducedMotion ? [0, 0] : [30, -30]
);
```

This replaces the existing `cardParallaxY` and `glowParallaxY` declarations on lines 58–59. Delete those two lines and add the block above in their place.

---

## Fix 4 — Touch Targets: Hero CTAs + Nav Sign In Button

**File:** `src/pages/Landing.tsx`

### 4a — Nav Sign In button (line ~132)
Current: `className="px-5 py-2 bg-slate-800 ..."`  
`py-2` = 8px top + 8px bottom + font ≈ ~36px height. **Fails 44px minimum.**

**Change `py-2` → `py-2.5 min-h-[44px]`:**
```tsx
className="px-5 py-2.5 min-h-[44px] bg-slate-800 border border-slate-600 hover:border-indigo-500/60 hover:bg-slate-700 text-[#A8B5D1] text-sm font-bold rounded-xl transition-all"
```

### 4b — Hero CTA buttons (lines ~198, ~203)
Current: `py-4` ≈ 16px × 2 + font ≈ ~52px. **Already passes.** No change needed.

### 4c — "Already have an account?" Sign In link-button (line ~221)
This is a text `<button>` with no padding. Add `px-1 py-1 min-h-[44px] inline-flex items-center` to ensure it's tappable:
```tsx
className="text-primary hover:text-blue-400 font-bold underline underline-offset-2 transition-colors px-1 inline-flex items-center min-h-[44px]"
```

---

## Fix 5 — Marquee Pills: Add Transition to Snap-Instant States

**File:** `src/pages/Landing.tsx`  
**Current line ~370 (marquee pill items):**
```tsx
<div key={i} className="flex items-center gap-2 text-slate-500">
```

**Replace with:**
```tsx
<div key={i} className="flex items-center gap-2 text-slate-500 transition-all duration-300 ease-in-out">
```

This is a single-class addition. Touch only this line.

---

## Constraints (Absolute)

- **No changes to heading text, body copy, taglines, or CTAs** (text content is frozen)
- **No changes to chart data or demo component logic**
- **No changes to `StarField.tsx`** — all StarField work is done in `Landing.tsx` via Tailwind classes
- **No new sections, features, or analytics**
- **No changes to any other page**
- **Strictly surgical** — if you see something wrong outside these 5 fixes, note it in chat and file a new WO

---

## Success Criteria (INSPECTOR to verify post-build)

1. [ ] At 375px / 390px / 430px: StarField is not rendered — static gradient background visible
2. [ ] Chrome DevTools → Network → Slow 4G: the 3 demo charts appear as pulse skeletons until scrolled into view
3. [ ] Frankenstein Stack right panel renders as a standard block (not sticky) at mobile widths
4. [ ] Nav Sign In button min-height ≥ 44px at all breakpoints (DevTools element inspector)
5. [ ] Zero TypeScript compilation errors (`npm run build` clean)
6. [ ] No regression on desktop (lg+) — sticky parallax behavior intact
7. [ ] Lighthouse mobile performance score ≥ 80 on Vercel preview URL

---

## Files Touched

| File | Change |
|---|---|
| `src/pages/Landing.tsx` | All 5 fixes |
| `src/components/StarField.tsx` | **READ ONLY — do not modify** |
| `src/components/demos/SafetyRiskMatrixDemo.tsx` | **READ ONLY** |
| `src/components/demos/ClinicRadarDemo.tsx` | **READ ONLY** |
| `src/components/demos/PatientJourneyDemo.tsx` | **READ ONLY** |

**No schema changes. No new files. No new dependencies.**
