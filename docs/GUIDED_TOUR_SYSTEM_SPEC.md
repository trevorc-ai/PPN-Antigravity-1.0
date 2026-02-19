# 🧭 GUIDED TOUR SYSTEM SPEC
## PPN Research Portal — Site-Wide Mini Tours & UX Standardization

**Author:** DESIGNER Agent  
**Date:** 2026-02-18  
**Work Order:** WO-111  
**Status:** ✅ COMPLETE — Ready for BUILDER  

---

## 1. SYSTEM OVERVIEW

The PPN Guided Tour System is a **two-tier onboarding architecture** designed to reduce cognitive overload while giving every user the right information at exactly the right moment.

```
TIER 1: "View from Space" — Global Welcome Tour (auto-triggered, first login only)
TIER 2: "True Guided Tours" — Page-Specific Mini Tours (compass icon or first visit)
```

**Core Design Principle:** "Reduce friction before it becomes abandonment."

Users should never feel lost. They should always know that help is one click away — the Compass Icon is that constant, unobtrusive signal.

---

## 2. UX PATTERN SPECIFICATIONS

### 2A. TIER 1 — "View from Space" (Global Welcome Modal)

**Purpose:** Orient the user to the application's overall structure without overwhelming with details.

**Trigger:** Auto-launches on first login. Tracked via `localStorage.setItem('globalTourSeen', 'true')`.

**Visual Design:**
- **Container:** Centered modal, dark glass background (`bg-[#0a1628]/95 backdrop-blur-xl`)
- **Width:** `max-w-lg` (512px) on desktop, `w-[calc(100vw-32px)]` on mobile
- **Border:** `border border-slate-700/60`
- **Border Radius:** `rounded-3xl`
- **Backdrop:** `bg-black/70` full-screen overlay, no click-to-dismiss
- **Drop Shadow:** `shadow-[0_0_60px_rgba(43,116,243,0.15),0_40px_80px_rgba(0,0,0,0.6)]`

**Content Structure:**
```tsx
// Centered icon/illustration (pulse animation)
<div className="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-500/30 
                flex items-center justify-center mx-auto mb-6 
                animate-pulse">
  <Compass className="w-8 h-8 text-blue-400" />
</div>

// Title (max ~40 chars)
<h2 className="text-2xl font-black text-slate-200 text-center mb-3">
  Welcome to the Research Frontline
</h2>

// Subtitle
<p className="text-sm text-slate-400 text-center leading-relaxed mb-8">
  {stepDescription}
</p>
```

**Controls:**
- `Skip Tour` — Top right, `text-xs text-slate-500 hover:text-slate-300 font-bold uppercase tracking-widest`
- `Next` / `Finish` — Bottom right, `bg-primary text-slate-200 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest`
- Step indicator: `Step {n} of {total}` text label, top left, `text-xs font-bold text-primary uppercase tracking-[0.2em]`

**Step Count:** 3 steps maximum (keep it under 90 seconds total reading time)

**Step Content:**
| Step | Title | Description |
|------|-------|-------------|
| 1 | Welcome to the Research Frontline | "This is your clinical intelligence hub. We track outcomes, flag drug interactions, and help you prove that your protocols get results — all without touching a single piece of patient-identifying data." |
| 2 | Your Layout at a Glance | "The sidebar is your command panel. Dashboard shows your live metrics. The Wellness Journey tracks your patients' full arc of care. The Catalog and Interaction Checker are your safety tools." |
| 3 | Look for the Compass Icon 🧭 | "On every page, you'll find a Compass Icon next to the page title. Click it anytime to take a guided tour of exactly what that page does and how to use it. You can never get lost." |

---

### 2B. TIER 2 — "True Guided Tour" (Page-Specific Mini Tours)

**Purpose:** Teach the user how to use a specific complex page by highlighting individual elements in sequence.

**Trigger:** 
- **Automatic:** On first visit to a page with a mini tour (tracked per-page in localStorage)
- **Manual:** Clicking the Compass Icon next to any page title

**localStorage Key Pattern:** `{pageName}TourSeen` — e.g., `dashboardTourSeen`, `wellnessJourneyTourSeen`

#### VISUAL DESIGN — Core Tour Component

**Screen Masking (The Spotlight Effect):**
```
Full-screen dark overlay: bg-black/60 backdrop-blur-[2px]
Target element: EXCLUDED from overlay using mix-blend-mode / z-index cutout
Cutout glow: border-2 border-primary rounded-xl box-shadow glow ring
```

**Element Highlight Ring:**
```tsx
// Applied around the target element's getBoundingClientRect()
<div
  style={{
    top: targetRect.top - 8,
    left: targetRect.left - 8,
    width: targetRect.width + 16,
    height: targetRect.height + 16,
    boxShadow: '0 0 0 4000px rgba(0,0,0,0.6), 0 0 0 4px rgba(43,116,243,0.8), 0 0 30px rgba(43,116,243,0.5)',
    borderRadius: '12px',
  }}
/>
```
> ⚠️ KEY PATTERN: The `box-shadow` with a very large spread radius (`4000px`) IS the masking. This is far more performant than SVG overlays and eliminates the pointer-events layering problem.

**Tour Popover Card:**
- **Width:** `w-[340px]` desktop, `w-[calc(100vw-32px)]` mobile (fixed bottom: 16px)
- **Background:** `bg-[#0c1016]`
- **Border:** `border-2 border-primary/60`
- **Border Radius:** `rounded-[1.5rem]`
- **Shadow:** `shadow-[0_0_30px_rgba(43,116,243,0.3),0_20px_60px_rgba(0,0,0,0.5)]`
- **Padding:** `p-6`
- **Gap:** `flex flex-col gap-4`

**Popover Content Structure:**
```tsx
// Header row
<div className="flex items-center justify-between">
  <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">
    Step {n} / {total}
  </span>
  <button className="text-xs font-bold text-slate-500 hover:text-slate-300 
                     uppercase tracking-widest transition-all">
    Skip Tour
  </button>
</div>

// Step label (optional category badge)
<span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
  {stepCategory}
</span>

// Title
<h3 className="text-lg font-black text-slate-300 tracking-tight leading-tight">
  {step.title}
</h3>

// Description (9th-grade reading level, max 2 sentences)
<p className="text-sm text-slate-400 font-medium leading-relaxed">
  {step.description}
</p>

// Footer
<div className="flex items-center justify-between">
  {/* Progress dots */}
  {steps.map((_, i) => (
    <div className={`h-1.5 rounded-full transition-all duration-300 
      ${i === current ? 'w-6 bg-primary shadow-glow' 
        : i < current ? 'w-3 bg-primary/40' 
        : 'w-1.5 bg-slate-700'}`} />
  ))}
  
  {/* Navigation */}
  <div className="flex gap-2">
    {current > 0 && <BackButton />}
    <NextButton label={isLast ? 'Finish' : 'Next'} />
  </div>
</div>
```

**Popover Positioning Logic:**
- Preferred position declared per step: `'bottom' | 'right' | 'left' | 'top'`
- Smart collision detection: if card overflows viewport, flip to opposite side
- Screen boundary clamp: never within 10px of any edge
- Mobile fallback: always fixed bottom, full width

**Animation:**
- Enter: `animate-in fade-in zoom-in-95 duration-300`
- Exit: `animate-out fade-out zoom-out-95 duration-150`
- Highlight ring: CSS `highlight-pulse` keyframe (already defined in `index.css`)

**Accessibility:**
- `role="dialog" aria-modal="true" aria-label="Guided tour"`
- `aria-live="polite"` on card content
- Focus trap: first focusable element in card (Skip button) receives focus on step change
- `Escape` key → dismiss tour
- All buttons have descriptive `aria-label`
- Progress dots: `role="tablist"` with `aria-current="step"`
- Minimum font size: `text-sm` (14px) — never smaller

---

## 3. COMPASS ICON — THE CONSTANT ENTRY POINT

Every page with a mini tour MUST display a Compass Icon as the persistent re-entry point.

**Placement:** Immediately to the right of the page's primary `<h1>` heading.

**Visual Spec:**
```tsx
<button
  onClick={() => setShowTour(true)}
  className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 
             border border-blue-500/20 hover:border-blue-500/40 
             rounded-lg transition-all group ml-2 flex-shrink-0"
  aria-label={`Take guided tour of ${pageName}`}
  title={`Take guided tour of ${pageName}`}
>
  <Compass className="w-4 h-4 text-blue-400/70 group-hover:text-blue-400 
                      group-hover:rotate-12 transition-all duration-300" />
</button>
```

**Color by page type:**
| Page Type | Compass Color | BG Color |
|-----------|--------------|----------|
| Clinical / Standard | `text-blue-400` | `bg-blue-500/10` |
| Wellness Journey Phase 1 | `text-emerald-400` | `bg-emerald-500/10` |
| Wellness Journey Phase 2 | `text-amber-400` | `bg-amber-500/10` |
| Wellness Journey Phase 3 | `text-blue-400` | `bg-blue-500/10` |
| Advanced Practitioner Tools | `text-purple-400` | `bg-purple-500/10` |

---

## 4. CONTENT GUIDELINES

### Writing Rules (Enforced for ALL tour content)

1. **9th-grade reading level** — Use the Flesch-Kincaid test as your guide
2. **Max 2 sentences per step description**
3. **Active voice** — "This shows..." not "Data is displayed here..."
4. **No jargon without definition** — If you must use a clinical term, define it inline
5. **Lead with the user's action or benefit**, not the feature name
6. **No color-only meaning** — All states must use text labels AND icons

### Tone Guide
- "These scores show how your patient is feeling right now." ✅
- "This component renders the PHQ-9 and GAD-7 baseline assessment data inputs." ❌

---

## 5. PAGE INVENTORY & TOUR STEPS

### 5.1 Dashboard Tour
**Tour Name:** "Your Command Center"  
**Trigger:** First visit to `/dashboard`  
**localStorage Key:** `dashboardTourSeen`  
**Step Count:** 5  
**Compass Color:** `text-blue-400`  
**data-tour selectors needed:** `dashboard-header`, `dashboard-safety-score`, `dashboard-protocols`, `dashboard-alerts`, `dashboard-quick-actions`

| Step | Title | Description | Selector | Position |
|------|-------|-------------|----------|----------|
| 1 | Your Command Center | "This dashboard shows your clinic's live performance. You can see safety scores, recent protocols, and alerts at a glance." | `[data-tour="dashboard-header"]` | bottom |
| 2 | Your Safety Score | "This number is your Safety Score — it goes from 0 to 100. Higher is better. It's calculated from your adverse event rate across all logged protocols." | `[data-tour="dashboard-safety-score"]` | right |
| 3 | Recent Protocols | "Every treatment you log appears here. Click any row to see the full details, edit it, or export it as a PDF." | `[data-tour="dashboard-protocols"]` | top |
| 4 | Alert Center | "If any patient needs immediate attention, you'll see an alert here. Red means act now. Yellow means check soon." | `[data-tour="dashboard-alerts"]` | bottom |
| 5 | Quick Actions | "Use these buttons to log a new protocol, check a drug interaction, or start a guided session. Everything is one click away." | `[data-tour="dashboard-quick-actions"]` | top |

---

### 5.2 Wellness Journey Tour
**Tour Name:** "The Arc of Care"  
**Trigger:** First visit to `/wellness-journey`  
**localStorage Key:** `wellnessJourneyTourSeen`  
**Step Count:** 4  
**Compass Color:** `text-emerald-400`  
**Note:** Phase-specific mini tours (Phase 1, 2, 3) are covered in WO-066 and use the same technical system.

| Step | Title | Description | Selector | Position |
|------|-------|-------------|----------|----------|
| 1 | The Arc of Care | "The Wellness Journey tracks your patient through three phases: Preparation, the Dosing Session, and Integration. Each phase unlocks when the previous one is complete." | `[data-tour="wellness-journey-header"]` | bottom |
| 2 | Phase Progress | "These three cards show where your patient is in their journey. Green means complete. Blue means active. Gray means not yet started." | `[data-tour="wellness-phase-progress"]` | bottom |
| 3 | Compass Icons | "You'll see a compass icon on each phase card. Click it for a detailed walkthrough of everything you need to do in that phase." | `[data-tour="wellness-phase-1"]` | right |
| 4 | Export & Reports | "When all three phases are complete, you can export a full clinical report in one click. This is what you send to the insurance company." | `[data-tour="wellness-export"]` | top |

---

### 5.3 Substance Catalog Tour
**Tour Name:** "Your Safety Library"  
**Trigger:** First visit to `/catalog`  
**localStorage Key:** `substanceCatalogTourSeen`  
**Step Count:** 4  
**Compass Color:** `text-blue-400`  
**data-tour selectors needed:** `catalog-search`, `catalog-filters`, `catalog-substance-card`, `catalog-safety-rating`

| Step | Title | Description | Selector | Position |
|------|-------|-------------|----------|----------|
| 1 | Your Safety Library | "The Substance Catalog has evidence-based dosing guidelines for over 50 substances. Think of it as your clinical reference manual." | `[data-tour="catalog-search"]` | bottom |
| 2 | Search & Filter | "Type any substance name or use the filters to narrow results by type, route of administration, or risk level." | `[data-tour="catalog-filters"]` | bottom |
| 3 | Substance Cards | "Each card shows the substance name, typical dose range, and safety rating. Click any card to see the full monograph with contraindications." | `[data-tour="catalog-substance-card"]` | right |
| 4 | Safety Ratings | "The colored bar shows the overall safety profile. Green = low risk, yellow = moderate — always check contraindications before dosing." | `[data-tour="catalog-safety-rating"]` | top |

---

### 5.4 Interaction Checker Tour
**Tour Name:** "The Safety Net"  
**Trigger:** First visit to `/interactions`  
**localStorage Key:** `interactionCheckerTourSeen`  
**Step Count:** 4  
**Compass Color:** `text-blue-400`  
**data-tour selectors needed:** `interactions-search`, `interactions-add-medication`, `interactions-results`, `interactions-severity`

| Step | Title | Description | Selector | Position |
|------|-------|-------------|----------|----------|
| 1 | The Safety Net | "The Interaction Checker scans for dangerous combinations. Always run this check before any dosing session." | `[data-tour="interactions-search"]` | bottom |
| 2 | Add Medications | "Type in the substances and medications your patient is taking. Include supplements — St. John's Wort, for example, can cause Serotonin Syndrome." | `[data-tour="interactions-add-medication"]` | bottom |
| 3 | Review Results | "Each combination is rated by severity. Red = dangerous, do not proceed. Yellow = caution, consult first. Green = no known interaction." | `[data-tour="interactions-results"]` | top |
| 4 | Severity Levels | "Click any interaction card to read why it's dangerous and what to do if you must proceed. Never ignore a red flag." | `[data-tour="interactions-severity"]` | top |

---

### 5.5 Protocol Builder Tour
**Tour Name:** "Log Your First Protocol"  
**Trigger:** First visit to `/protocol-builder`  
**localStorage Key:** `protocolBuilderTourSeen`  
**Step Count:** 5  
**Compass Color:** `text-blue-400`  
**data-tour selectors needed:** `protocol-subject-info`, `protocol-intervention`, `protocol-outcomes`, `protocol-safety`, `protocol-submit`

| Step | Title | Description | Selector | Position |
|------|-------|-------------|----------|----------|
| 1 | Log a Protocol | "A Protocol is a record of one treatment session. You'll fill out four sections: the patient, the substance, the outcome, and any safety events." | `[data-tour="protocol-subject-info"]` | bottom |
| 2 | Subject Information | "We ask for age, sex, and general health info — but never your patient's name or date of birth. This protects their privacy and lets us benchmark your data against the network." | `[data-tour="protocol-subject-info"]` | right |
| 3 | Intervention Details | "Select the substance, dose, and how it was given. Be exact — this is what your safety score is calculated from." | `[data-tour="protocol-intervention"]` | right |
| 4 | Outcomes & Safety | "After the session, log how well it worked (0-10 scale) and any adverse events. Even mild nausea counts — it's better to over-report." | `[data-tour="protocol-outcomes"]` | top |
| 5 | Submit & Save | "Click Submit to save the protocol. Your safety score updates automatically. You can export this record as a PDF anytime." | `[data-tour="protocol-submit"]` | top |

---

### 5.6 Analytics & Reports Tour
**Tour Name:** "Reading Your Data"  
**Trigger:** First visit to `/analytics`  
**localStorage Key:** `analyticsTourSeen`  
**Step Count:** 4  
**Compass Color:** `text-blue-400`  
**data-tour selectors needed:** `analytics-overview`, `analytics-trend-chart`, `analytics-benchmarks`, `analytics-export`

| Step | Title | Description | Selector | Position |
|------|-------|-------------|----------|----------|
| 1 | Your Clinical Intelligence | "This page shows trends and patterns across all your logged protocols. It's how you prove your treatments are working over time." | `[data-tour="analytics-overview"]` | bottom |
| 2 | Trend Charts | "The main chart shows your safety score over time. A rising line means your practice is improving. Click any data point to drill into that period's protocols." | `[data-tour="analytics-trend-chart"]` | top |
| 3 | Network Benchmarks | "The gray shaded area shows how other practitioners in the PPN network compare. Are you above or below average? This is what you show insurance companies." | `[data-tour="analytics-benchmarks"]` | top |
| 4 | Export Reports | "Click 'Export Report' to download a PDF suitable for insurance reimbursement, state compliance filings, or sharing with a supervising physician." | `[data-tour="analytics-export"]` | top |

---

### 5.7 Search Portal Tour
**Tour Name:** "Find Anything Fast"  
**Trigger:** First visit to `/search`  
**localStorage Key:** `searchPortalTourSeen`  
**Step Count:** 3  
**Compass Color:** `text-blue-400`

| Step | Title | Description | Selector | Position |
|------|-------|-------------|----------|----------|
| 1 | Global Search | "Search across your entire portal from here — protocols, substances, patients, and clinical literature all in one place." | `[data-tour="search-input"]` | bottom |
| 2 | Filter by Type | "Use these tabs to narrow your search. 'Substances' searches the catalog. 'Protocols' searches your logs. 'Literature' searches the research library." | `[data-tour="search-filters"]` | bottom |
| 3 | Quick Results | "Results appear as you type. Click any result to jump straight to it. Use keyboard arrows to navigate, Enter to select." | `[data-tour="search-results"]` | top |

---

### 5.8 Settings & Privacy Tour
**Tour Name:** "Your Control Panel"  
**Trigger:** Manual only (compass icon)  
**localStorage Key:** `settingsTourSeen`  
**Step Count:** 3  
**Compass Color:** `text-blue-400`

| Step | Title | Description | Selector | Position |
|------|-------|-------------|----------|----------|
| 1 | Account Settings | "This is where you manage your profile, subscription, and notification preferences. Changes save automatically." | `[data-tour="settings-account"]` | bottom |
| 2 | Privacy Controls | "You control exactly what data leaves your device. Toggle 'Enhanced Privacy Mode' to activate zero-knowledge logging." | `[data-tour="settings-privacy"]` | right |
| 3 | Danger Zone | "If you ever need to export all your data or close your account, it's here. All exports are encrypted and download directly to your device." | `[data-tour="settings-danger"]` | top |

---

## 6. IMPLEMENTATION ARCHITECTURE

### Recommended Component Structure

```
src/components/
├── GuidedTour.tsx          ← EXISTING (Global "View from Space" tour + page mini tours)
├── TourButton.tsx          ← NEW: Compass icon button (reusable, passes tour name)
├── MiniTour.tsx            ← NEW: Wraps GuidedTour with page-specific step data
└── tours/
    ├── tourSteps.ts        ← NEW: Centralized step data for all pages
    ├── DashboardTour.ts    ← Tour steps for /dashboard
    ├── WellnessJourneyTour.ts
    ├── CatalogTour.ts
    ├── InteractionsTour.ts
    ├── ProtocolBuilderTour.ts
    ├── AnalyticsTour.ts
    ├── SearchPortalTour.ts
    └── SettingsTour.ts
```

### State Management Pattern

```tsx
// Per-page hook (encapsulates localStorage tracking)
const useMiniTour = (tourKey: string) => {
  const [showTour, setShowTour] = useState(false);
  
  useEffect(() => {
    if (!localStorage.getItem(tourKey)) {
      setShowTour(true);
      localStorage.setItem(tourKey, 'true');
    }
  }, [tourKey]);
  
  return { showTour, setShowTour };
};

// Usage in any page
const { showTour, setShowTour } = useMiniTour('dashboardTourSeen');
```

### data-tour Selector Strategy

Add `data-tour="[unique-id]"` attributes to target elements. Never use IDs or class names for tour targeting — they change. `data-tour` attributes are stable and semantically meaningful.

```tsx
// Example: Dashboard header
<div data-tour="dashboard-header" className="...">
  <h1>Dashboard</h1>
  <TourButton tourKey="dashboardTourSeen" pageName="Dashboard" />
</div>
```

---

## 7. TESTING CHECKLIST (for INSPECTOR)

### Functionality
- [ ] Global tour auto-launches on first login, not on subsequent logins
- [ ] All 8 page-specific tours launch via compass icon
- [ ] All 8 page-specific tours auto-trigger on first page visit
- [ ] localStorage keys correctly prevent re-triggering
- [ ] "Skip Tour" dismisses immediately — no animations blocking interaction
- [ ] Escape key dismisses any active tour
- [ ] "Finish" button on last step calls `onComplete()` and dismisses

### Visual
- [ ] Highlight ring correctly surrounds each target element
- [ ] Box-shadow masking darkens everything except the highlighted element
- [ ] Popover card never overflows viewport (test all 4 edges)
- [ ] Mobile: popover snaps to bottom of screen
- [ ] Progress dots update correctly (active = wide blue, past = narrow blue, future = gray)
- [ ] Compass icon appears next to every page title covered in this spec

### Accessibility
- [ ] `role="dialog"` and `aria-modal="true"` present on tour overlay
- [ ] `aria-live="polite"` on card content area
- [ ] Focus moves to "Skip Tour" button on each step change
- [ ] Tab order: Skip Tour → Back (if visible) → Next/Finish
- [ ] Escape key always dismisses
- [ ] All text ≥ 14px (`text-sm`)
- [ ] Contrast ratio ≥ 4.5:1 for all text (slate-400 on `#0c1016` = ✅)
- [ ] No color-only meaning — use text labels AND icons for all states

### Content
- [ ] All descriptions ≤ 2 sentences
- [ ] No jargon without definition
- [ ] 9th-grade reading level (run Flesch-Kincaid check)

---

## 8. DEPENDENCY MAP

| This spec depends on | Status |
|---------------------|--------|
| `GuidedTour.tsx` existing component | ✅ Exists |
| `AdvancedTooltip.tsx` component | ✅ Exists |
| `Compass` icon from `lucide-react` | ✅ Available |
| `highlight-pulse` CSS keyframe in `index.css` | Verify exists |
| Phase-specific mini tours (WO-066) | Must use same system |
| Enhanced Privacy Tour (WO-083) | Uses same system, different step data |

---

## 9. ROLLOUT SEQUENCE (Recommended for BUILDER)

1. **First:** Create `TourButton.tsx` reusable component
2. **Second:** Create `tours/tourSteps.ts` centralized data file
3. **Third:** Add compass icon + `data-tour` attributes to Dashboard (simplest page)
4. **Fourth:** Wire `MiniTour` with Dashboard steps — test end-to-end
5. **Fifth:** Replicate pattern for remaining 7 pages
6. **Sixth:** Connect KO-066 Phase mini tours to same system
7. **Seventh:** Connect WO-083 Advanced Practitioner Tools tour

---

**DESIGNER SIGN-OFF:** ✅ Spec complete. All patterns defined. All 8 page tours content-written. Hand off to BUILDER.

**Date:** 2026-02-18T14:57:00-08:00
