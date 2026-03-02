---
id: WO-508
slug: Landing-Page-Performance-Code-Splitting
status: 03_BUILD
owner: BUILDER
priority: CRITICAL
failure_count: 0
created: 2026-02-26
---

# WO-508: Landing Page Performance — Code Splitting & Bundle Optimization

## Problem
The landing page at `ppnportal.net` is extremely slow to load, particularly on mobile. Users (including beta testers) are experiencing near-blank screens before content appears.

## Root Cause (Diagnosed)

`src/App.tsx` imports **all 50+ route components at the top of the file** as static ES module imports. This means every visitor to the landing page — including users who have never logged in and will never see the dashboard — must download, parse, and execute the entire application bundle before React can render a single component.

Compounding factors in `src/pages/Landing.tsx`:
- `framer-motion` loaded eagerly (~150KB gzipped)
- `recharts` loaded eagerly (~70KB gzipped)
- `SafetyRiskMatrixDemo`, `ClinicRadarDemo`, `PatientJourneyDemo` — three heavy visualization components loaded at import time, before the user has scrolled anywhere near them
- `StarField` — canvas animation component running immediately on mount
- `AllianceWall` — loaded eagerly

`vite.config.ts` has no `rollupOptions`, no `manualChunks`, no compression plugin. The build outputs a single monolithic bundle.

---

## Solution: Three-Layer Fix

### Layer 1 — Code Splitting in App.tsx (HIGHEST IMPACT)

Convert all route imports from static to `React.lazy()`. This is the single change that will have the most dramatic effect on landing page load time.

**Before (current):**
```tsx
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import WellnessJourney from './pages/WellnessJourney';
// ... 47 more like this
```

**After:**
```tsx
import React, { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const WellnessJourney = lazy(() => import('./pages/WellnessJourney'));
// ... all others the same way
```

Wrap the `<Routes>` block in a `<Suspense>` fallback:
```tsx
<Suspense fallback={
  <div className="flex h-screen items-center justify-center bg-[#070b14]">
    <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
  </div>
}>
  <Routes>
    {/* all routes unchanged */}
  </Routes>
</Suspense>
```

**EXCEPTION — Do NOT lazy-load these (they must be in the initial bundle):**
- `Landing` — this IS the initial page, must be eager
- `Login` — second most common entry point, keep eager
- `AuthProvider`, `ToastProvider`, `ThemeProvider` — context wrappers, must be eager

All other 48+ route components should be lazy.

---

### Layer 2 — Vite Build Optimization in vite.config.ts

Add manual chunking to separate vendor libraries into their own long-cached files. When a user revisits after a deploy, they only re-download changed chunks, not vendor libs.

```ts
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react({
      jsxRuntime: 'automatic',
      babel: { plugins: [] }
    })],
    define: {},
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Core React runtime — never changes
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            // Supabase auth client
            'vendor-supabase': ['@supabase/supabase-js'],
            // Animation library
            'vendor-framer': ['framer-motion'],
            // Charting libraries
            'vendor-charts': ['recharts'],
            // Icon library
            'vendor-lucide': ['lucide-react'],
          }
        }
      },
      // Raise the chunk warning threshold — 500KB is reasonable for a clinical app
      chunkSizeWarningLimit: 600,
    }
  };
});
```

---

### Layer 3 — Lazy-Load Below-Fold Demo Components in Landing.tsx

The three demo visualization components only appear below the fold. They do not need to load at page paint time.

```tsx
// Change these three from static imports:
import SafetyRiskMatrixDemo from '../components/demos/SafetyRiskMatrixDemo';
import ClinicRadarDemo from '../components/demos/ClinicRadarDemo';
import PatientJourneyDemo from '../components/demos/PatientJourneyDemo';

// To lazy imports:
const SafetyRiskMatrixDemo = lazy(() => import('../components/demos/SafetyRiskMatrixDemo'));
const ClinicRadarDemo = lazy(() => import('../components/demos/ClinicRadarDemo'));
const PatientJourneyDemo = lazy(() => import('../components/demos/PatientJourneyDemo'));
```

Wrap their render sites in `<Suspense fallback={<div className="h-64 animate-pulse bg-slate-800/30 rounded-2xl" />}>` so the layout holds its space gracefully while loading.

---

## Acceptance Criteria

- [ ] `App.tsx`: All route components except `Landing` and `Login` use `React.lazy()`
- [ ] `App.tsx`: `<Routes>` wrapped in `<Suspense>` with a dark spinner fallback matching site aesthetic
- [ ] `vite.config.ts`: `manualChunks` configured with the 5 vendor groups listed above
- [ ] `Landing.tsx`: Three demo components converted to `React.lazy()` with skeleton fallbacks
- [ ] After build: Vite output shows multiple chunks, landing page chunk does NOT contain Dashboard/Analytics/etc. code
- [ ] Landing page first meaningful paint (FMP) target: under 2 seconds on a 4G mobile connection
- [ ] No regressions: authenticated users navigating between routes see no visual regressions; route transitions work normally

## Do Not
- Do not lazy-load `Landing.tsx` itself — it's the entry point
- Do not lazy-load `Login.tsx` — it's a critical path immediately after landing
- Do not lazy-load any Context providers
- Do not remove `framer-motion` from Landing — it's needed for animations; just ensure it's in its own vendor chunk
- Do not add a loading spinner visible to already-authenticated users navigating between routes — the `Suspense` fallback should be fast enough to be invisible in normal nav

## Expected Impact
Based on codebase analysis:
- Initial JS bundle for landing page: estimated ~3–5MB → target ~400–600KB after code splitting
- Time to Interactive on mobile 4G: estimated ~8–12s current → target ~2–3s
- Return visit load time (cached vendor chunks): near-instant

## Files to Modify
| File | Change |
|---|---|
| `src/App.tsx` | Convert 48+ imports to `React.lazy()`, add `<Suspense>` wrapper |
| `vite.config.ts` | Add `build.rollupOptions.output.manualChunks` |
| `src/pages/Landing.tsx` | Lazy-load 3 demo components with skeleton fallbacks |
