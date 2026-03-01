---
id: WO-513
title: "Landing Page Performance — Route-Based Code Splitting & Lazy Loading"
status: 03_BUILD
owner: BUILDER
created: 2026-02-26
created_by: CUE
failure_count: 0
priority: P0
tags: [performance, bundle-size, code-splitting, lazy-loading, vite, react, landing-page, mobile]
---

# WO-513: Landing Page Performance — Route-Based Code Splitting

## User Report (Verbatim)

> "@LEAD incoming work order to speed up the landing page, I'm testing it on my tablet right now and it's not even loading. Apparently it's trying to download the entire application before it loads. 😂"

**Priority: P0 — The landing page is the front door for potential customers and beta testers. It must load instantly.**

---

## Root Cause Analysis (LEAD — Confirmed)

Diagnosed by inspecting `src/App.tsx` and `vite.config.ts`.

### The Problem: Monolithic Eager Bundle

`App.tsx` has **84 static `import` statements at the top of the file**. Every single page, component, and deep-dive is imported synchronously, causing Vite to bundle 100% of the application JavaScript into a **single chunk** that must be fully downloaded and parsed before React can render anything.

A visitor hitting `/landing` (the public marketing page, no auth required) is forced to download:
- All 30+ protected clinical tool pages (Dashboard, Analytics, WellnessJourney, etc.)
- All 8 Deep Dive pages
- All 8 Help Center articles
- All 3 ArcOfCare demo pages
- PDF generation components
- All chart libraries (Recharts, D3, etc.) used only in authenticated pages

**On a fast desktop:** ~2–3 second TTFB
**On a tablet / mobile data:** fails to load within a reasonable timeout window

### Vite Config Gap

`vite.config.ts` has zero `build.rollupOptions` — no manual chunk splitting, no vendor isolation. All node_modules are bundled into the same chunk as app code.

---

## LEAD Architecture

### Solution: Three-Layer Code Splitting Strategy

#### Layer 1 — React Route Lazy Loading (`src/App.tsx`)

Convert ALL page imports from static to dynamic using `React.lazy()`:

```tsx
// BEFORE (current — broken)
import Dashboard from './pages/Dashboard';
import WellnessJourney from './pages/WellnessJourney';
// ... 82 more static imports

// AFTER (correct)
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const WellnessJourney = React.lazy(() => import('./pages/WellnessJourney'));
```

Wrap all `<Routes>` in a single `<Suspense>` with a lightweight fallback spinner:

```tsx
<Suspense fallback={<AppLoadingSpinner />}>
  <Routes>
    ...
  </Routes>
</Suspense>
```

**Priority loading tiers:**
- **Tier 1 (critical path — preload hints):** `/landing`, `/login`, `/signup`, `/forgot-password`, `/reset-password`
- **Tier 2 (post-auth entry):** `/search`, `/dashboard`
- **Tier 3 (lazy on demand):** Everything else

#### Layer 2 — Vite Manual Chunk Splitting (`vite.config.ts`)

Add `build.rollupOptions.output.manualChunks` to isolate:
- `vendor-react` — react, react-dom, react-router-dom
- `vendor-charts` — recharts, d3 (only loaded when analytics pages load)
- `vendor-supabase` — @supabase/supabase-js
- `vendor-ui` — framer-motion, lucide-react
- `pages-public` — Landing, Login, SignUp, ForgotPassword (always tiny, always fast)
- `pages-deep-dives` — all /deep-dives/* in one chunk (loaded together when any deep dive loads)

#### Layer 3 — Preload Critical Route

Add `<link rel="modulepreload">` hints in `index.html` for Tier 1 routes so they are fetched in parallel with the initial bundle, eliminating the waterfall for immediate navigations.

---

## Implementation Spec for BUILDER

### File 1: `src/App.tsx`

1. Remove ALL static page imports (lines 4–84).
2. Add `import React, { Suspense, lazy }` to the top.
3. Re-declare all pages as `const PageName = lazy(() => import('./pages/PageName'))`.
4. Create a lightweight `<PageLoader />` fallback component (dark bg + centered spinner matching app theme — do NOT use a blank white screen).
5. Wrap only the `<Routes>` block in `<Suspense fallback={<PageLoader />}>`.
6. The `AuthProvider`, `ToastProvider`, `ThemeProvider` wrappers stay outside `<Suspense>` — they must initialize synchronously.

### File 2: `vite.config.ts`

Add manual chunk configuration:

```ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom', 'react-router-dom'],
        'vendor-supabase': ['@supabase/supabase-js'],
        'vendor-charts': ['recharts'],
        'vendor-motion': ['framer-motion'],
        'vendor-icons': ['lucide-react'],
      }
    }
  }
}
```

### File 3: `index.html`

Add modulepreload hints for the landing page JS chunk (BUILDER identifies the chunk name after build, or uses a preload plugin).

---

## Expected Impact

| Metric | Before | After (estimated) |
|--------|--------|-------------------|
| Initial JS bundle | ~2–4 MB (entire app) | ~80–150 KB (landing + react core only) |
| Landing page TTI (tablet/4G) | 8–15s (fails) | <2s |
| Login page TTI | 8–15s | <1.5s |
| First Contentful Paint | 5–10s | <0.8s |
| Authenticated app chunk | Loaded upfront | Loaded only after /login success |

---

## Acceptance Criteria

- [ ] `App.tsx` has zero static page imports — all pages use `React.lazy()`
- [ ] `<Suspense>` wraps `<Routes>` with a styled dark-theme fallback (not a white flash)
- [ ] `vite.config.ts` has manual chunk configuration with vendor separation
- [ ] Production build (`npm run build`) generates multiple JS chunks (not one monolithic file)
- [ ] Landing page loads in < 2s on a simulated 3G/tablet connection (Chrome DevTools throttle)
- [ ] No regression on authenticated routes (Dashboard, Analytics, etc. still load correctly)
- [ ] Auth flow (Login → Dashboard redirect) works without race conditions
- [ ] No TypeScript type errors introduced
- [ ] INSPECTOR sign-off

---

## LEAD Architecture Sign-Off

Routing: `BUILDER`
Status after routing: `03_BUILD`
Next folder: `_WORK_ORDERS/03_BUILD/`
