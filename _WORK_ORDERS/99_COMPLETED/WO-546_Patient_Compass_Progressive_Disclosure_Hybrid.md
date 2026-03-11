---
id: WO-546
title: Patient Compass — Progressive Disclosure Hybrid (Mobile)
owner: BUILDER
status: 99_COMPLETED
routed_by: LEAD
date_routed: 2026-03-09
priority: P1
files:
  - src/pages/IntegrationCompass.tsx
  - src/components/compass/CompassSpiderGraph.tsx
  - src/components/compass/EmotionalWaveform.tsx
---

# WO-546 SURGICAL PLAN

## Pre-flight Constraints (Builder MUST read before touching code)

- DO NOT alter any Supabase calls, data hooks, or business logic.
- DO NOT modify `DosingSessionPhase.tsx` or any Phase 2 files.
- ALL changes are surgical Tailwind/inline-style/CSS additions only.
- If any fix fails twice, STOP and flag to LEAD.

---

## FIX 1 — Slider Thumb Touch Target (CSS, `IntegrationCompass.tsx`)

**File:** `src/pages/IntegrationCompass.tsx`  
**Location:** `COMPASS_CSS` constant, lines 109–126 (webkit/moz range thumb rules)  
**Problem:** Slider thumbs are `22px × 22px` — below the required 48px minimum touch target.  
**Fix:** Increase thumb to `48px × 48px` with a transparent border trick to preserve visual size while expanding the hit area.

```css
/* BEFORE (lines 109-126): */
.compass-slider::-webkit-slider-thumb {
  width: 22px; height: 22px; border-radius: 50%;
  ...
}
.compass-slider::-moz-range-thumb {
  width: 22px; height: 22px; border-radius: 50%;
  ...
}

/* AFTER: */
.compass-slider::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 48px; height: 48px; border-radius: 50%;
  background: #2dd4bf; cursor: pointer;
  border: 13px solid transparent;
  background-clip: padding-box;
  box-shadow: 0 0 0 3px rgba(45,212,191,0.2), 0 0 14px rgba(45,212,191,0.5);
  transition: box-shadow 0.15s, transform 0.1s;
}
.compass-slider::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 6px rgba(45,212,191,0.25), 0 0 22px rgba(45,212,191,0.7);
  transform: scale(1.1);
}
.compass-slider::-moz-range-thumb {
  width: 48px; height: 48px; border-radius: 50%;
  background: #2dd4bf; cursor: pointer;
  border: 13px solid transparent;
  background-clip: padding-box;
  box-shadow: 0 0 0 3px rgba(45,212,191,0.2), 0 0 14px rgba(45,212,191,0.5);
}
```

---

## FIX 2 — SpiderGraph font sizes below 14px (`CompassSpiderGraph.tsx`)

**File:** `src/components/compass/CompassSpiderGraph.tsx`  
**Problem:** Radar axis labels and legend text use `fontSize={9}` — illegible on mobile.  
**Lines:** 238, 258, 269, 273  
**Fix:** Change all four `fontSize={9}` values to `fontSize={14}`.  

Also at line 139: `fontSize: 12` → `fontSize: 14` (the axis-label style object).

```
Line 139:  fontSize: 12  →  fontSize: 14
Line 238:  fontSize={9}  →  fontSize={14}
Line 258:  fontSize={9}  →  fontSize={14}
Line 269:  fontSize={9}  →  fontSize={14}
Line 273:  fontSize={9}  →  fontSize={14}
```

---

## FIX 3 — EmotionalWaveform font size (`EmotionalWaveform.tsx`)

**File:** `src/components/compass/EmotionalWaveform.tsx`  
**Problem:** Line 191 has `fontSize: 12` — below 14px minimum.  
**Fix:** Change to `fontSize: 14`.

```
Line 191:  fontSize: 12  →  fontSize: 14
```

Lines 160 and 170 are already `fontSize={14}` — leave them untouched.

---

## FIX 4 — Progressive Disclosure Accordion for Charts on mobile (`IntegrationCompass.tsx`)

**File:** `src/pages/IntegrationCompass.tsx`  
**Problem:** `CompassSpiderGraph` and `EmotionalWaveform` render immediately on mobile with no collapse — overwhelming on a 375px viewport.  
**Fix:** Wrap each chart render in an accordion that is **collapsed by default on mobile** and **always open on ≥768px**.

Add this state at the top of `IntegrationCompass` (after existing `useState` declarations):
```tsx
const [spiderOpen, setSpiderOpen] = useState(false);
const [waveformOpen, setWaveformOpen] = useState(false);
```

**Zone 1 — wrap `CompassSpiderGraph` (lines 415–419):**
```tsx
{/* Mobile accordion for Experience Map chart */}
<div>
  <button
    onClick={() => setSpiderOpen(v => !v)}
    aria-expanded={spiderOpen}
    className="md:hidden w-full flex items-center justify-between px-4 py-3 mb-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm font-bold text-slate-300 transition-colors"
    style={{ minHeight: 48 }}
  >
    <span>Your Experience Map (Chart)</span>
    <span style={{ transition: 'transform 0.2s', transform: spiderOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
  </button>
  <div className={spiderOpen ? 'block' : 'hidden md:block'}>
    <CompassSpiderGraph
      substanceCategory={substanceCategory}
      accentColor={accentColor}
      timelineEvents={timeline.events}
    />
  </div>
</div>
```

**Zone 2 — wrap `EmotionalWaveform` (lines 461–464):**
```tsx
<div>
  <button
    onClick={() => setWaveformOpen(v => !v)}
    aria-expanded={waveformOpen}
    className="md:hidden w-full flex items-center justify-between px-4 py-3 mb-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm font-bold text-slate-300 transition-colors"
    style={{ minHeight: 48 }}
  >
    <span>Your Emotional Terrain (Chart)</span>
    <span style={{ transition: 'transform 0.2s', transform: waveformOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
  </button>
  <div className={waveformOpen ? 'block' : 'hidden md:block'}>
    <EmotionalWaveform
      timelineEvents={timeline.events}
      sessionDurationMinutes={timeline.sessionDurationMinutes}
    />
  </div>
</div>
```

---

## FIX 5 — "Coming Soon" card for BrainNetworkMap (`IntegrationCompass.tsx`)

**File:** `src/pages/IntegrationCompass.tsx`  
**Problem:** `BrainNetworkMap` (lines 425–428) renders in Zone 1 but the component is deferred per WO-546 scope.  
**Fix:** Replace the `<BrainNetworkMap />` render with a glass-panel "Coming Soon" card:

```tsx
{/* BEFORE (lines 421-429): */}
<div style={{ marginTop: 28 }}>
  <h3 className="ppn-card-title" style={{ color: accentColor, marginBottom: 16 }}>
    Your Brain During the Session
  </h3>
  <BrainNetworkMap
    substanceCategory={substanceCategory}
    accentColor={accentColor}
  />
</div>

{/* AFTER: */}
<div style={{ marginTop: 28 }}>
  <h3 className="ppn-card-title" style={{ color: accentColor, marginBottom: 16 }}>
    Your Brain During the Session
  </h3>
  <div style={{
    background: 'rgba(15,25,52,0.60)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 32,
    padding: '32px 24px',
    textAlign: 'center',
  }}>
    <p style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>
      Neurological Map · Coming Soon
    </p>
  </div>
</div>
```

> **Note:** The `BrainNetworkMap` import at line 14 can remain — it is deferred visually only.

---

## Execution Order

1. FIX 2 → `CompassSpiderGraph.tsx` (fontSize changes — safest, isolated file)
2. FIX 3 → `EmotionalWaveform.tsx` (one line change)
3. FIX 1 → `IntegrationCompass.tsx` CSS block (slider thumb sizes)
4. FIX 4 → `IntegrationCompass.tsx` accordion state + JSX wraps
5. FIX 5 → `IntegrationCompass.tsx` BrainNetworkMap → Coming Soon card

## QA Checklist

- [ ] Simulator/DevTools at 375px: spider and waveform charts hidden behind accordion toggles
- [ ] Accordion toggle buttons measure ≥ 44px touch targets
- [ ] At ≥ 768px: both charts render without accordion (no toggle visible)
- [ ] Slider thumb visually unchanged but registers touch at 48px hit area (verify in iOS Safari)
- [ ] All SpiderGraph axis labels readable at 375px (fontSize 14 minimum)
- [ ] "Neurological Map · Coming Soon" glass card renders in Zone 1 below the spider graph
- [ ] No TypeScript build errors (`npm run build`)

---
## INSPECTOR QA Sign-off
**Date:** 2026-03-11
**Verdict:** APPROVED. Code fixes verified on main branch.
