---
work_order_id: WO-021
title: Search Portal Page Redesign
type: DESIGN
category: Design / UX Strategy
priority: P2 (High)
status: 05_USER_REVIEW
created: 2026-02-17T17:58:00-08:00
requested_by: USER
assigned_to: BUILDER
owner: USER
estimated_complexity: 6/10
failure_count: 0
---

# Work Order: Search Portal Page Redesign

## 🎯 THE GOAL

Redesign the Search Portal page (`/search`) to be **simpler, cleaner, and less redundant** with the Dashboard. The current page is overly complex and duplicates functionality already available elsewhere.

### User's Direction

**"Designer should propose a new version of that page. Something not so complicated to factor. This page is somewhat redundant to the dashboard anyway."**

### Key Requirement

**The only element that MUST be preserved:** The **hero search bar** (the main search input at the top of the page)

Everything else is up for redesign/removal/simplification.

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

**DESIGNER Deliverables:**
- Layout mockup/wireframe for new Search Portal page
- Component breakdown (what stays, what goes, what's new)
- User flow diagram (how search works in new design)
- Recommendations for reducing redundancy with Dashboard

**Files to Consider (for reference only):**
- `src/pages/SearchPortal.tsx` (current 808-line implementation)
- `src/pages/Dashboard.tsx` (to identify redundancies)

---

## 🚨 DESIGNER HARD STOP - READ FIRST

**DESIGNER PRODUCES DESIGN PROPOSALS ONLY.**

### ❌ ABSOLUTELY FORBIDDEN:
- **DO NOT write any code** (no TSX, no CSS, no JS)
- **DO NOT edit any source files** (no `src/` files)
- **DO NOT run any terminal commands**
- **DO NOT modify any existing components**
- **DO NOT touch `SearchPortal.tsx` or any other file in the codebase**
- **DO NOT install any packages**

### ✅ DESIGNER DELIVERABLES ARE:
- Written design proposals (markdown text in this ticket)
- Layout descriptions (written, not coded)
- Component recommendations (what to keep/remove/add)
- User flow descriptions
- Wireframe sketches (ASCII or written descriptions)

**When complete:** Update ticket frontmatter `status: 03_BUILD`, `owner: BUILDER` and move to `_WORK_ORDERS/03_BUILD/`. BUILDER will write all code.

---

## 📋 DESIGNER DELIVERABLES

### 1. **Current State Analysis** (30 min)

Review the existing Search Portal page and identify:
- What features overlap with Dashboard?
- What features are unique and valuable?
- What features are rarely used or unnecessary?
- What makes the page "too complicated"?

**Document findings in ticket.**

---

### 2. **Proposed Redesign** (2-3 hours)

Create a **simplified layout proposal** that includes:

#### **Required Element:**
- ✅ **Hero Search Bar** (preserved from current design)
  - Prominent placement at top of page
  - Same functionality as current (search substances, patients, etc.)
  - Clean, minimal styling

#### **Optional Elements (Your Choice):**
- Recent searches (if valuable)
- Quick filters (if valuable)
- Search suggestions (if valuable)
- AI-powered insights (if valuable)
- Anything else that enhances search UX without complexity

#### **Elements to Consider Removing:**
- Bento Grid layout (too complex)
- Federated search results (redundant with Dashboard?)
- Vertical stacking animations (unnecessary complexity)
- Smart conditional filters (too complex)
- Anything else that duplicates Dashboard functionality

---

### 3. **Layout Options** (Provide 2-3 alternatives)

**Option A:** Minimal Search Page
- Hero search bar
- Recent searches
- Nothing else (ultra-simple)

**Option B:** Search + Quick Actions
- Hero search bar
- Quick filters (substance type, phase, etc.)
- Recent searches
- Search suggestions

**Option C:** Search Hub
- Hero search bar
- Categorized search (Substances, Patients, Trials)
- Quick stats (total substances, active trials, etc.)
- Recent activity feed

**Or propose your own options!**

---

### 4. **Component Breakdown**

For your recommended layout, specify:
- **Components to keep** (from current SearchPortal.tsx)
- **Components to remove** (redundant or too complex)
- **New components to create** (if any)
- **Estimated implementation complexity** (1-10 scale)

---

### 5. **User Flow Diagram**

Show how users will:
1. Land on Search Portal page
2. Enter search query
3. View results
4. Navigate to details

**Key question:** Where do search results display?
- On the same page?
- Navigate to Dashboard with filter applied?
- Navigate to dedicated results page?
- Something else?

---

## ✅ ACCEPTANCE CRITERIA

### Analysis Complete
- [ ] Current Search Portal reviewed and analyzed
- [ ] Redundancies with Dashboard identified
- [ ] Complexity issues documented

### Design Proposals Created
- [ ] 2-3 layout options provided
- [ ] Hero search bar preserved in all options
- [ ] Each option is significantly simpler than current design
- [ ] Redundancy with Dashboard reduced/eliminated

### Documentation Complete
- [ ] Component breakdown provided
- [ ] User flow diagram created
- [ ] Implementation complexity estimated
- [ ] Recommendation made (which option to build)

### Design Quality
- [ ] Matches Clinical Sci-Fi aesthetic
- [ ] Clean, minimal, professional
- [ ] Easy to implement (not overly complex)
- [ ] Responsive design considered

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- Minimum 12px fonts
- Hero search bar must be keyboard accessible
- Proper ARIA labels for search input
- Screen reader friendly

### UX PRINCIPLES
- **Simplicity over complexity**
- **Clarity over cleverness**
- **Functionality over decoration**
- **Easy to implement over impressive animations**

---

## 🚦 STATUS

**02_DESIGN** - Awaiting DESIGNER proposal

---

## 📋 CONTEXT & BACKGROUND

### Current Search Portal Issues

The current `SearchPortal.tsx` is **808 lines** and includes:
- Bento Grid layout
- Federated search across multiple categories
- Complex animations (staggered entry, collapse/expand)
- Smart conditional filters
- Custom skeleton loaders
- AI Insight bar
- Vertical stacking (Substance/Clinical/Network)

**User feedback:** "Too complicated to factor" and "somewhat redundant to the dashboard"

### What We're Looking For

A **simplified, clean Search Portal** that:
- Focuses on the core value: **search**
- Eliminates unnecessary complexity
- Reduces redundancy with Dashboard
- Is easy to implement and maintain
- Provides a great UX without over-engineering

---

## 🎨 DESIGN PRINCIPLES FOR THIS PROJECT

1. **Less is More** - Simplify aggressively
2. **Preserve Core Value** - Keep the hero search bar
3. **Avoid Redundancy** - Don't duplicate Dashboard features
4. **Easy to Build** - Prioritize simple implementations
5. **Clinical Sci-Fi** - Maintain brand aesthetic

---

## 📚 REFERENCE MATERIALS

**Current Search Portal:**
- File: `src/pages/SearchPortal.tsx` (808 lines)
- Route: `/search`

**Dashboard (for comparison):**
- File: `src/pages/Dashboard.tsx`
- Route: `/dashboard`

**Design System:**
- Glassmorphism cards
- Deep blue gradient backgrounds
- Primary blue accents
- Slate color palette
- 12px minimum fonts

---

## 🎯 SUCCESS METRICS

**DESIGNER Success:**
- Proposed design is **significantly simpler** than current (< 400 lines to implement)
- Redundancy with Dashboard **reduced by 50%+**
- Hero search bar **preserved and enhanced**
- User can **easily understand** the page purpose
- BUILDER can **implement in 1-2 days** (not 1 week)

---

## 💡 DESIGNER NOTES

**Key Questions to Answer:**

1. **What is the unique value of the Search Portal?**
   - If it's just search, maybe it should be ultra-minimal
   - If it's a search hub, what makes it different from Dashboard?

2. **Where should search results go?**
   - Stay on Search Portal page?
   - Redirect to Dashboard with filters applied?
   - Dedicated results page?

3. **What features are actually used?**
   - Hero search bar (definitely)
   - Filters (maybe?)
   - AI insights (maybe?)
   - Recent searches (maybe?)

4. **How can we make this page feel valuable without duplicating Dashboard?**

---

**DESIGNER:** Propose a simplified Search Portal redesign that preserves the hero search bar and eliminates unnecessary complexity. Provide 2-3 layout options with your recommendation.

**Estimated Time:** 3-4 hours (analysis + design proposals)

---

**Status:** ✅ DESIGNER COMPLETE — Routed to BUILDER

---

## 🔄 WORKFLOW

1. **DESIGNER** creates design proposals (this ticket)
2. **USER** reviews and selects preferred option
3. **LEAD** architects implementation strategy
4. **BUILDER** implements chosen design
5. **INSPECTOR** reviews for quality/accessibility
6. **USER** final approval

---

**Priority:** P2 (High) - Simplifying this page will reduce maintenance burden and improve UX

---

## 🎨 DESIGNER DELIVERABLE — COMPLETE DESIGN PROPOSAL

**Completed:** 2026-02-18T01:15:00-08:00

---

### 1. CURRENT STATE ANALYSIS

**What the current SearchPortal.tsx does (808 lines):**
- Full federated search across Patients, Substances, Clinicians
- AI-powered synthesis via Gemini (Neural Copilot)
- Advanced sidebar filters: Setting, Substance, Min Efficacy
- Category filter chips (All / Patients / Safety / Substances / Clinicians)
- Horizontal scroll card results + full-grid deep-dive mode
- URL-synced query params (`?q=` and `?category=`)

**Redundancies with Dashboard:**
- Dashboard already has a search bar that navigates to `/advanced-search`
- Dashboard shows Network Activity stats (protocols, sites, success rate)
- Dashboard has Quick Actions for all major destinations
- Dashboard has Safety Risk Assessment
- The Search Portal's "All" category overview is essentially a mini-dashboard

**What is UNIQUE and valuable in Search Portal:**
- The AI Neural Copilot synthesis (real-time Gemini grounding) — this is genuinely unique
- The hero search bar with live filtering
- The category-scoped deep-dive grid (full cards per category)
- The URL-synced search state (shareable search links)
- The Safety category filter (surfaces only patients with adverse events)

**What is unnecessary complexity:**
- The collapsible sidebar filter panel (3 filters don't need a full sidebar)
- The horizontal scroll bento-style "All" overview (redundant with Dashboard)
- The `isFilterOpen` state + mobile drawer logic (~80 lines)
- Separate compact vs full card variants (doubles component code)
- The `SETTING_OPTIONS` filter (rarely used, adds noise)

---

### 2. LAYOUT OPTIONS

---

#### **OPTION A: "Neural Search" — Minimal AI-First (RECOMMENDED ✅)**

**Philosophy:** The Search Portal's killer feature is the AI synthesis. Lean into it. Make this the "ask a clinical question" page, not a data browser.

**Layout (top to bottom):**
```
┌─────────────────────────────────────────────┐
│  [icon] PPN Neural Search                   │
│  "Ask a clinical question or search by ID"  │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ ✨ [Search input — full width]  [→] │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  [Patients] [Substances] [Clinicians] [⚠️]  │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ 🧠 Neural Copilot                   │    │
│  │ "Synthesizing..." / AI result here  │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Results Grid (3-col, full cards)           │
│  [Card] [Card] [Card]                       │
│  [Card] [Card] [Card]                       │
└─────────────────────────────────────────────┘
```

**What changes:**
- REMOVE: Sidebar filter panel entirely
- REMOVE: Horizontal scroll bento overview ("All" category)
- REMOVE: Setting filter (low value)
- KEEP: Hero search bar (enhanced)
- KEEP: Category chips (Patients / Substances / Clinicians / Safety)
- KEEP: AI Neural Copilot panel (elevated to primary position)
- KEEP: Full-grid results (always show full cards, no compact variant)
- ADD: Inline substance filter chip row (replaces sidebar dropdown)
- ADD: Result count badge per category chip

**Filter approach:** Replace sidebar with 2 inline filter rows:
- Row 1: Category chips (existing)
- Row 2 (conditional, only when Patients active): Efficacy filter pills (Any / >5pts / >10pts)

**Estimated implementation:** ~280 lines (vs current 811)

---

#### **OPTION B: "Command Palette" — Keyboard-First**

**Philosophy:** Power users want speed. Make this feel like a Spotlight/Raycast-style command center.

**Layout:**
```
┌─────────────────────────────────────────────┐
│                                             │
│         ┌──────────────────────────┐        │
│         │ ⌘ Search everything...   │        │
│         └──────────────────────────┘        │
│                                             │
│  Recent: [Ketamine] [P-001] [Dr. Chen]      │
│                                             │
│  ─── Results ─────────────────────────────  │
│  [icon] P-001 · TRD · Ketamine · Active     │
│  [icon] Ketamine · Dissociative · 78% Eff.  │
│  [icon] Dr. Sarah Chen · Psychiatrist       │
│  ─────────────────────────────────────────  │
│  [Load more]                                │
└─────────────────────────────────────────────┘
```

**Pros:** Extremely fast, minimal code (~150 lines), unique feel
**Cons:** Loses the rich card data, no AI synthesis, less visual impact
**Verdict:** Too minimal for a clinical tool where context matters

---

#### **OPTION C: "Search Hub" — Categorized Landing**

**Philosophy:** Preserve more of the current structure but clean it up.

**Layout:**
```
┌─────────────────────────────────────────────┐
│  [Hero Search Bar]                          │
│  [Category Chips]                           │
│                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ Patients │ │Substances│ │Clinicians│    │
│  │    23    │ │    12    │ │     8    │    │
│  └──────────┘ └──────────┘ └──────────┘    │
│                                             │
│  [AI Synthesis Panel]                       │
│  [Results Grid]                             │
└─────────────────────────────────────────────┘
```

**Pros:** Familiar, preserves more existing code
**Cons:** Still somewhat redundant with Dashboard, stat cards duplicate Dashboard metrics
**Verdict:** Incremental improvement, not a real simplification

---

### 3. RECOMMENDATION: OPTION A — "Neural Search"

**Rationale:**
1. The AI Neural Copilot is the page's unique value proposition — no other page has it
2. Removing the sidebar eliminates ~120 lines of drawer/toggle logic
3. Removing the compact card variant eliminates ~100 lines of duplicate JSX
4. Removing the "All" bento overview eliminates the Dashboard redundancy entirely
5. The result: a focused, fast, AI-powered search experience that complements (not duplicates) the Dashboard

**User flow:**
1. User lands on `/search` (or navigates from Dashboard search bar)
2. Hero search bar is auto-focused
3. User types query → AI synthesis appears above results
4. Category chips filter results in-place
5. User clicks a card → navigates to detail page
6. URL stays synced (`?q=ketamine&category=Substances`)

---

### 4. COMPONENT BREAKDOWN (Option A)

**Components to KEEP (from current SearchPortal.tsx):**
- `PatientCard` (full variant only — remove compact)
- `SubstanceCard` (full variant only — remove compact)
- `ClinicianCard` (full variant only — remove compact)
- `SectionHeader` (keep as-is)
- AI synthesis logic (`generateAiAnalysis`, `GoogleGenAI`)
- URL sync logic (`useSearchParams`)
- Filter logic (`useMemo` for patientResults, substanceResults, clinicianResults)

**Components to REMOVE:**
- Sidebar `<aside>` with filter drawer (~120 lines)
- `isFilterOpen` state + toggle button
- Compact card variants (all 3 cards, ~100 lines)
- Horizontal scroll bento "All" overview section (~80 lines)
- `SETTING_OPTIONS` and setting filter logic

**New elements to ADD:**
- Inline efficacy filter pills (3 buttons, ~20 lines) — shown only when `activeCategory === 'Patients'`
- Result count badges on category chips
- Auto-focus on search input on mount

**Estimated final size:** ~280-320 lines

---

### 5. USER FLOW DIAGRAM

```
[User arrives at /search]
        ↓
[Search input auto-focused]
        ↓
[User types query]
        ↓
    ┌───────────────────────────────┐
    │ Parallel execution:           │
    │ A) Filter results (instant)   │
    │ B) Trigger AI synthesis (600ms│
    │    debounce)                  │
    └───────────────────────────────┘
        ↓
[AI panel shows synthesis + grounding links]
[Results grid shows full cards]
        ↓
[User clicks category chip]
        ↓
[Results filter in-place, URL updates]
        ↓
[User clicks a card]
        ↓
[Navigate to /protocol/:id OR /monograph/:id OR /clinician/:id]
```

**Where do results display?** On the same page (inline), not redirected. The URL-synced state means users can bookmark/share searches.

---

### 6. VISUAL DESIGN SPEC

**Hero Section:**
- Background: `bg-gradient-to-b from-[#0a1628] to-[#0d1b2a]`
- Subtle dot grid overlay (existing, keep)
- Ambient glow blob behind search bar (existing, keep)
- Page title: `text-4xl font-black` in `#8BA5D3`
- Subtitle: `text-sm` in `#8B9DC3`

**Search Bar:**
- Height: `h-16` (reduce from `h-24` on desktop — less imposing)
- Border: `border-2 border-slate-700` → `focus:border-primary/50`
- Border radius: `rounded-[2.5rem]` (keep)
- Left icon: `auto_awesome` (keep)
- Right: search button only (remove filter toggle button)
- Font: `text-base font-bold` (reduce from `text-lg`)

**Category Chips:**
- Add result count badge: `[Patients 23]` format
- Active state: `bg-slate-800 border-slate-600 text-slate-300`
- Inactive: `bg-transparent border-transparent text-slate-500 hover:text-slate-300`
- Font: `text-[12px] font-bold` (ensure ≥ 12px ✅)

**Efficacy Filter Pills (Patients only):**
- Appear below category chips with `animate-in fade-in duration-200`
- Style: small pill buttons, same pattern as category chips
- Label: `text-[12px]` minimum ✅

**AI Neural Copilot Panel:**
- Elevated to top of results area (above cards)
- Background: `bg-indigo-600/10 border border-indigo-500/20 rounded-[2rem]`
- Keep existing design (it's good)
- Add: grounding source links (already implemented)

**Results Grid:**
- Always 3-col on desktop: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3`
- Full cards only (no compact variant)
- Empty state: centered icon + text + reset button (keep existing)

---

### 7. ACCESSIBILITY CHECKLIST

- [x] All text ≥ 12px (category chips: 12px, card text: 12px min)
- [x] Search input: `aria-label="Search protocols, substances, and patients"`
- [x] Category chips: `role="tab"` + `aria-selected`
- [x] AI panel: `aria-live="polite"` for dynamic content
- [x] No color-only meaning (active chip uses border + background, not just color)
- [x] Keyboard: Tab → search input → category chips → results
- [x] Search button: `aria-label="Search"`

---

### 8. HANDOFF NOTES FOR BUILDER

**Implementation strategy:**
1. Start with `SearchPortal.tsx` as the base
2. Delete the `<aside>` sidebar block (lines ~549-635)
3. Delete compact card variants from all 3 card components
4. Delete the `isFilterOpen` state and toggle button
5. Delete the `SETTING_OPTIONS` constant and setting filter
6. Delete the horizontal scroll "All" bento section (lines ~689-773)
7. In the results section: always render the full-grid (currently the "deep dive" path)
8. Add efficacy filter pills inline below category chips (conditional on `activeCategory === 'Patients'`)
9. Add `autoFocus` to the search input
10. Add result count to category chip labels

**Key files:**
- `src/pages/SearchPortal.tsx` — primary target
- No other files need changes

**Estimated BUILDER time:** 2-3 hours
**Target line count:** ≤ 320 lines

---

**DESIGNER SIGN-OFF:** ✅ Design complete. Routing to BUILDER.

---

## 🔨 BUILDER IMPLEMENTATION NOTES (2026-02-18 06:43 PST)

**Status:** ✅ COMPLETE — Option A "Neural Search" implemented

### What Changed
- **Removed:** Sidebar filter panel (~120 lines) — `isFilterOpen` state, `<aside>` block, `SETTING_OPTIONS`
- **Removed:** Compact card variants for all 3 card types (~100 lines)
- **Removed:** Horizontal scroll bento "All" overview (~80 lines)
- **Removed:** Filter toggle button from search bar
- **Added:** Inline efficacy filter pills (shown only when `activeCategory === 'Patients' | 'Safety'`)
- **Added:** Result count badges on every category chip
- **Added:** `autoFocus` via `useRef` on search input on mount
- **Preserved:** Hero search bar, AI Neural Copilot, URL sync, full-card grid, empty state

### Metrics
- **Before:** 811 lines | **After:** 459 lines (43% reduction)
- **Target was:** ≤320 lines — slightly over due to 3 full card variants being preserved (they are the core value)
- **TypeScript:** ✅ Zero errors

**Route to:** `04_QA` for INSPECTOR review
