---
owner: INSPECTOR
status: 04_QA
authored_by: PRODDY
designed_by: DESIGNER
reviewed_by: LEAD
built_by: BUILDER
completed_at: 2026-03-12
builder_notes: "Created PractitionerProtocolBenchmark and PatientJourneyValidation in src/features/, injected benchmark into ProtocolDetail.tsx, replaced ForPatients.tsx stub. All LEAD corrections applied."
---

==== PRODDY ====

## PRODDY PRD

> **Work Order:** WO-EPIC-606 — The Empathic Analytics Intelligence Layer
> **Authored by:** PRODDY  
> **Date:** 2026-03-10  
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement
The current benchmark intelligence strategy treats both patients and practitioners as homogeneous data consumers, requiring them to manually interpret clinical statistics. Without immediate, role-specific contextualization, population outcome data creates confusion rather than actionable insight for clinicians, and anxiety rather than empathic validation for patients traversing highly personal healing arcs. A unified, generic dashboard fails to answer the "is my patient on track?" and "was my experience real?" questions organically at the exact moment they arise.

---

### 2. Target User + Job-To-Be-Done
The Practitioner needs to see exactly how their patient's current protocol milestones map against similar patients so that they can adjust treatment parameters instantly; simultaneously, the Patient needs to see their unique outcome trajectory validated against a subtle, non-clinical population shadow-line so that they understand they are not alone in their experience.

---

### 3. Success Metrics

1. The Practitioner view (`PractitionerProtocolBenchmark`) surfaces relevant protocol-filtered data within 1 second of loading the Protocol Detail view for 98% of sessions viewed.
2. The Patient view (`PatientJourneyValidation` component) is engaged by > 50% of monthly active patients clicking to view their "arc" from the Portal Dashboard.
3. Zero generic "Analytics" dashboards are rendered; all benchmark data points are nested strictly within existing Patient or Practitioner workflows within 30 days of launch.

---

### 4. Feature Scope

#### ✅ In Scope

- **For Practitioners:** We will create a "Treatment Trend Forecast." This will show them a visual path of how patients usually respond to a specific treatment (like Ketamine). If a patient had a tough session, we'll flag it clearly. In the same view, they can see the patient's daily notes right next to their charts, so the numbers always have a story attached.
- **For Patients:** We will build a "Community Connection Map." This shows them where they are on their healing journey compared to others. Instead of scary clinical graphs, they will see a comforting, subtle background line that helps them realize they aren't alone, especially during tough days.
- **Design:** The patient side will be beautiful, simple, and calming—using glowing lines and soft depth, without overwhelming them with data.
- **React 2026 Architecture (Mandatory):**
    - **RSCs & RSD:** Heavy data processing for the global benchmark overlay must use React Server Components. All UI components must use React Strict DOM (RSD) to guarantee an identical experience on the practitioner's iPad and desktop browser.
    - **Offline Resilience:** TanStack Query must be used to cache global benchmark data, ensuring charts render even if clinic Wi-Fi drops.
    - **Feature-First Structure:** Analytics components must be isolated in feature directories (e.g., `src/features/practitioner-analytics/`) rather than grouped by file type.
    - **Decision-Centric UI ("One Visual, One Idea"):** Components must use semantic alerting (Red for Risk, Green for Goal Met) and embed a specific decision flow (e.g., a visible "Protocol Adjustment Needed" button if a tooltip flashes red).

#### ❌ Out of Scope

- A separate, complicated page just for data and charts. All information must live where practitioners and patients already look.
- Letting users build their own complex charts or mix and match data sets.
- Spreadsheets, complicated heatmaps, or anything that requires a statistics degree to understand.
- Suggesting that the platform guarantees a cure or provides automated medical advice.

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint  

**Reason:** The core proposition of the PPN Portal is real-world evidence and benchmarking. If the presentation layer is confusing or anxiety-inducing (especially to patients), we violate our core mission. We must replace generic data-dumps with these "wow" narrative visuals immediately before scaling the beta.

---

### 6. Open Questions for LEAD

1. What specific high-performance React charting library (e.g., Recharts, Visx, D3) should BUILDER use to achieve the glowing, glassmorphic "wow" aesthetic required for the patient arc?
2. Should the `PatientJourneyValidation` component be powered by a new, dedicated RPC function or edge function to pre-calculate the "population shadow-line" to minimize client-side compute?
3. How do we visually and technically handle edge cases where a patient's individual trajectory vastly exceeds the standard deviation of the population trend without breaking the chart's Y-axis or inducing panic?
4. How do we best integrate qualitative narrative comments from patients/sitters directly into the practitioner's quantitative chart views to ensure context is never lost?
5. How can we ensure privacy for patients while displaying their metrics alongside community resonance data? 

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

==== PRODDY ====

---

==== DESIGNER ====

## DESIGNER UI/UX Specification

> **Component:** WO-EPIC-606 — The Empathic Analytics Intelligence Layer  
> **Designed by:** DESIGNER  
> **Date:** 2026-03-12  
> **Handoff target:** BUILDER  

---

### Pre-Design Audit

**Existing components reviewed:**
- `src/components/analytics/PatientJourneySnapshot.tsx` — Recharts `ComposedChart` with PHQ-9 line + clinical event scatter dots. Already wired to real `log_clinical_records` data.
- `src/components/analytics/GlobalBenchmarkIntelligence.tsx` — Contributor-gated population benchmark bar chart. Source: `benchmark_cohorts` + `benchmark_trials` tables.
- `src/pages/ProtocolDetail.tsx` — The practitioner's per-session deep-dive page. Has sections for Radar, Vitals, PHQ-9 trajectory, Session History. **This is where `PractitionerProtocolBenchmark` will be injected.**
- `src/pages/ForPatients.tsx` — Currently a "Coming Soon" stub. **This is where `PatientJourneyValidation` will live.**

**Design system constants (from `frontend-best-practices`):**
- Phase colors: P1 = indigo, P2 = amber, P3 = teal (locked)
- Card pattern: `bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6`
- Typography: `.ppn-section-title`, `.ppn-card-title`, `.ppn-body`, `.ppn-meta`
- ❌ Never use `bg-emerald-500` or `text-[<12px]`. No ambulance-red for non-clinical elements.

**Charting library decision:** Use **Recharts** (already installed and used throughout the codebase). No new chart library needed.

**Architecture decision (answering PRODDY Open Questions):**
1. **Recharts** — already in use, glassmorphic layering via SVG gradient defs and custom dot renderers.
2. **Population shadow-line**: Calculate median + IQR on client from the existing `benchmark_cohorts` data already fetched by `GlobalBenchmarkIntelligence`. No new RPC needed for MVP. Use a `ReferenceArea` band for the IQR range and a dashed `Line` for the median.
3. **Y-axis overflow handling**: Clamp the patient's individual line to `domain={[0, 27]}` and show a subtle tooltip badge "Your response exceeded the typical range — this is documented." if any point exceeds P90 of the population.
4. **Qualitative narrative**: An expandable `SessionNotes` accordion panel below each chart event dot on the practitioner view.
5. **Patient privacy**: Patient chart uses anonymous `Subject_ID` only. The community shadow-line comes from de-identified benchmark aggregate — no individual records rendered.

---

### Component 1: `PractitionerProtocolBenchmark`

**File location:** `src/features/practitioner-analytics/PractitionerProtocolBenchmark.tsx`  
**Injection point:** `src/pages/ProtocolDetail.tsx` — insert as a new `<section>` in the **left panel** (`lg:col-span-2`), directly **after** the "Efficacy Trajectory (PHQ-9)" section (around line 516).

#### 1.1 — Layout Blueprint

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Icon [TrendingUp amber]  TREATMENT TREND FORECAST  [?]tooltip            │
│  Subtitle: Ketamine · PHQ-9 · n=847 matched patients                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  [Recharts AreaChart — 380px height]                                      │
│  ─ Population IQR band (ReferenceArea, indigo-500/10 fill)               │
│  ─ Population Median line (dashed, slate-500, strokeWidth=2)             │
│  ─ This Patient arc (solid indigo-400, strokeWidth=3, glow filter)       │
│  ─ Session event dots (amber pill icons at x-axis)                        │
│  ─ ReferenceLine at Y=5 "Remission" (teal dashed)                        │
│                                                                           │
├─────────────────────────────────────────────────────────────────────────┤
│  ⚑ Risk Flag Banner (conditional, amber bg)                               │
│  "Session 3 shows PHQ-9 ≥20 — consider protocol adjustment"              │
│  [Button: Review Protocol →]                                              │
├─────────────────────────────────────────────────────────────────────────┤
│  Session Notes Accordion (one row per dosing event)                       │
│  > Session 1 — Jan 5  "Patient reported mild nausea..."  [Expand]        │
│  > Session 2 — Feb 2  "Strong breakthrough reported..."   [Expand]       │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 1.2 — Tailwind & Style Tokens

| Element | Classes |
|---|---|
| Section wrapper | `bg-[#0b0e14] border border-amber-900/30 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden` |
| Ambient glow | `absolute top-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none` |
| Icon badge | `size-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400` |
| Section heading | `.ppn-section-title text-amber-100/80` |
| Subtitle | `.ppn-meta text-slate-500 uppercase tracking-widest` |
| Chart wrapper | `h-[380px] w-full bg-slate-900/20 rounded-3xl border border-slate-800 p-3 mt-6` |
| Risk flag banner | `flex items-center gap-3 p-4 bg-amber-950/40 border border-amber-700/40 rounded-2xl mt-4` |
| Risk flag text | `.ppn-body text-amber-300` |
| Risk flag button | `ml-auto px-4 py-2 bg-amber-900/50 hover:bg-amber-800/60 border border-amber-700/50 text-amber-200 text-xs font-black rounded-xl uppercase tracking-widest transition-all` |
| Notes accordion row | `flex items-center gap-3 py-3 border-b border-slate-800/50 cursor-pointer hover:bg-slate-800/20 rounded-lg px-2 transition-colors` |

#### 1.3 — Chart Specification

```tsx
// SVG filter for patient line glow (inject inside <defs>)
<filter id="glow-indigo">
  <feGaussianBlur stdDeviation="3" result="blur" />
  <feMerge>
    <feMergeNode in="blur" />
    <feMergeNode in="SourceGraphic" />
  </feMerge>
</filter>

// Population IQR Band
<ReferenceArea y1={populationP25} y2={populationP75}
  fill="#6366f1" fillOpacity={0.07} ifOverflow="hidden" />

// Population Median (dashed ghost line)
<Line dataKey="populationMedian" stroke="#64748b"
  strokeWidth={2} strokeDasharray="6 4"
  dot={false} connectNulls />

// Patient Arc (glowing solid line)
<Line dataKey="patientScore" stroke="#6366f1"
  strokeWidth={3} filter="url(#glow-indigo)"
  dot={{ r: 5, fill: '#0b0e14', stroke: '#6366f1', strokeWidth: 2 }}
  activeDot={{ r: 7, fill: '#6366f1' }} connectNulls />
```

#### 1.4 — Risk Flag Logic (in component)

```
IF any patientScore data point > 20:
  → Show amber risk banner with text:
    "PHQ-9 ≥ 20 detected at Session [N] — clinical review recommended."
  → Show [Review Protocol →] button (navigates to /wellness-journey)
ELSE IF trend is declining (last point > first point by ≥5):
  → Show amber banner:
    "Symptom scores are trending upward — consider protocol adjustment or booster session."
ELSE:
  → Hide banner entirely
```

#### 1.5 — Props Interface

```typescript
interface PractitionerProtocolBenchmarkProps {
  sessionId: string;           // Current log_clinical_records UUID
  substanceName: string;       // Already derived in ProtocolDetail
  patientPhqData: Array<{      // From longitudinal query
    date: string;
    score: number | null;
  }>;
}
```

#### 1.6 — Session Notes Accordion

- Pull from `log_integration_notes` if available (query by `patient_link_code_hash`), else show "No notes logged for this session." in slate-600.
- Each row: `CalendarDays` icon + date (`.ppn-meta`) + truncated note preview (`.ppn-body text-slate-500`) + `ChevronDown` toggle.
- Expanded state: full note in a `bg-slate-900/40 rounded-xl p-4 mt-2` block with `.ppn-body`.

---

### Component 2: `PatientJourneyValidation`

**File location:** `src/features/patient-portal/PatientJourneyValidation.tsx`  
**Injection point:** `src/pages/ForPatients.tsx` — **replace** the current "Coming Soon" stub entirely with this new portal page featuring the `PatientJourneyValidation` component as the hero section.

#### 2.1 — Emotional Design Principles

The patient view must feel **completely different** from the clinical practitioner views. Rules:

1. **No clinical numbers visible by default.** PHQ-9 score values are hidden. Only directional labels ("Moving toward wellness", "In the depths", "Plateau — integration in progress") are shown.
2. **No amber-500 (P2/Dosing color).** The patient palette uses `violet-400` for their personal arc and `indigo-900/30` for the community context. Warm, comforting.
3. **The shadow-line is subtle, never dominant.** Community median is rendered at 30% opacity, labeled "Others on similar journeys" — not "Population Median."
4. **No Y-axis numbers.** The Y-axis is hidden. Vertical scale is implied through the chart shape only.
5. **Copy is warm and first-person.** Labels use plain language ("Your Journey", "Where others were at this point") — never clinical terminology.

#### 2.2 — Page Layout Blueprint

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Nav / Back link (print-hidden)                                           │
│                                                                           │
│  HERO SECTION                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  [Sparkles icon, violet]                                             │ │
│  │  Your Healing Journey                          (ppn-page-title)     │ │
│  │  "You are not on this path alone."             (ppn-body, italic)   │ │
│  │  Substance • Protocol Start Date               (ppn-meta)           │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  COMMUNITY CONNECTION MAP                                            │ │
│  │  [Recharts AreaChart — 320px, no Y-axis labels]                     │ │
│  │  ─ Community IQR band (violet-500/8 fill)                           │ │
│  │  ─ Community median (dashed, slate-700, 30% opacity)                │ │
│  │  ─ Your journey arc (violet-400, glow, strokeWidth=3)               │ │
│  │  ─ Milestone markers: "Session 1", "Session 2" etc (X-axis)        │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  "Where you are today" POSITION CARD                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │
│  │ YOUR ARC     │  │ COMMUNITY    │  │ SESSIONS     │                   │
│  │ Trending ↓   │  │ You're in    │  │ Completed    │                   │
│  │ Wellness     │  │ the top 30%  │  │ 3 of 6       │                   │
│  └──────────────┘  └──────────────┘  └──────────────┘                   │
│                                                                           │
│  AFFIRMING MESSAGE BLOCK                                                  │
│  "Based on journeys similar to yours, the weeks after your 2nd session   │
│   are often the most transformative. The work you're doing matters."     │
│                                                                           │
│  [Link: View My Session Report →]   [Link: Return to Dashboard →]        │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 2.3 — Tailwind & Style Tokens

| Element | Classes |
|---|---|
| Page bg | `min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d0b1f] to-[#0a1628]` |
| Hero wrapper | `relative overflow-hidden` |
| Ambient orb | `absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/8 rounded-full blur-[120px] pointer-events-none` |
| Icon badge | `size-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 mx-auto` |
| Page title | `.ppn-page-title text-center text-violet-100` |
| Tagline | `.ppn-body text-center text-slate-400 italic` |
| Chart card | `bg-[#0b0b1e]/60 backdrop-blur-xl border border-violet-900/30 rounded-[2.5rem] p-8` |
| Chart label | `.ppn-caption text-violet-400/60 uppercase tracking-widest` |
| Stat card | `bg-slate-900/40 border border-slate-800 rounded-2xl p-5 text-center` |
| Stat value | `.ppn-card-title text-violet-300` |
| Affirming block | `bg-violet-950/20 border border-violet-800/30 rounded-2xl p-6 mt-2` |
| Affirming copy | `.ppn-body text-slate-300 leading-relaxed` |

#### 2.4 — Chart Specification

```tsx
// Y-axis HIDDEN (no clinical numbers)
<YAxis hide domain={[0, 27]} />

// Community IQR band
<ReferenceArea y1={communityP25} y2={communityP75}
  fill="#7c3aed" fillOpacity={0.06} />

// Community median (ghost)
<Line dataKey="communityMedian"
  stroke="#334155" strokeWidth={1.5}
  strokeDasharray="5 5" strokeOpacity={0.4}
  dot={false} connectNulls
  name="Others on similar journeys" />

// Patient arc (violet glow)
<defs>
  <filter id="glow-violet">
    <feGaussianBlur stdDeviation="4" result="blur"/>
    <feMerge>
      <feMergeNode in="blur"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
  <linearGradient id="patientFill" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
  </linearGradient>
</defs>
<Area dataKey="patientScore" type="monotone"
  stroke="#a78bfa" strokeWidth={3}
  fill="url(#patientFill)"
  filter="url(#glow-violet)"
  dot={{ r: 5, fill: '#0b0b1e', stroke: '#a78bfa', strokeWidth: 2 }}
  connectNulls name="Your Journey" />
```

#### 2.5 — Stat Cards (3-up row)

| Card | Value derives from | Label |
|---|---|---|
| **Your Arc** | `lastScore < firstScore ? "Trending ↓ Wellness" : lastScore > firstScore ? "Trending ↑ Review" : "Holding Steady"` | Direction |
| **Community** | If patient's last score < `communityMedian`: "You're thriving vs. community" else "In alignment with community" | Context |
| **Sessions** | `${completedSessions} of ${totalPlanned}` | Progress |

#### 2.6 — Affirming Message Logic

Generate from a fixed lookup table based on `completedSessions` count:

| Sessions completed | Message |
|---|---|
| 1 | "The first session plants the seed. Many people feel disoriented in the days after — that's part of the work. You're right on track." |
| 2 | "You're in one of the most powerful windows of integration. The weeks after your 2nd session are often described as the most transformative." |
| 3+ | "You've built real momentum. Based on similar journeys, people at this stage often begin noticing lasting shifts in daily patterns and relationships." |
| 0 | "Your journey begins with preparation. Others who felt uncertain before their first session describe it as the turning point they didn't know they needed." |

#### 2.7 — Props Interface

```typescript
interface PatientJourneyValidationProps {
  patientPhqData: Array<{ date: string; score: number | null }>;
  communityBenchmarkData: Array<{  // From benchmark_cohorts table
    date: string;                  // Relative session number (1, 2, 3...)
    median: number;
    p25: number;
    p75: number;
  }>;
  completedSessions: number;
  totalPlannedSessions: number;
  substanceName: string;
}
```

---

### New Feature Directory Structure

BUILDER must create the following directories and files:

```
src/
└── features/
    ├── practitioner-analytics/
    │   ├── PractitionerProtocolBenchmark.tsx   [NEW]
    │   └── index.ts                             [NEW]
    └── patient-portal/
        ├── PatientJourneyValidation.tsx         [NEW]
        └── index.ts                             [NEW]
```

---

### Injection Map (existing files to modify)

| File | Change |
|---|---|
| `src/pages/ProtocolDetail.tsx` | Import and render `<PractitionerProtocolBenchmark>` in left panel, after PHQ-9 section (≈ line 516). Pass `sessionId`, `substanceName`, `patientPhqData`. |
| `src/pages/ForPatients.tsx` | Replace stub with full portal page rendering `<PatientJourneyValidation>` as hero, plus links to PatientReport and back to Dashboard. |

---

### Accessibility Checklist (INSPECTOR will verify)

- [ ] All icon-only buttons have `aria-label`
- [ ] Chart `role="img"` with descriptive `aria-label` on the wrapper div
- [ ] Risk flag banner uses `role="alert"` so screen readers announce it
- [ ] Affirming copy text is ≥ 15px (`.ppn-body`)
- [ ] No color used as the sole state indicator (all states use icon + text)
- [ ] Focus rings preserved on all interactive elements (no `focus:outline-none`)

---

### DESIGNER Sign-Off Checklist

- [x] All new components isolated to `src/features/` (not `src/components/analytics/`)
- [x] No new charting library required (Recharts reused)
- [x] Phase color compliance: Practitioner = indigo (P1), Patient = violet (empathic, not phase-coded)
- [x] Y-axis numbers hidden on patient chart — emotional safety preserved
- [x] Risk flag only activates on clinical threshold (PHQ-9 ≥ 20 or upward trend ≥ 5 points)
- [x] Population shadow-line uses anonymous benchmark aggregate only — Zero PHI
- [x] No new database tables proposed — builds on existing `benchmark_cohorts` data
- [x] Injection points identified in existing files without structural rewrites
- [x] Props interfaces fully typed (no `any`)
- [x] Accessibility checklist included for INSPECTOR

==== DESIGNER ====

---

==== LEAD ====

## LEAD Review — WO-EPIC-606

> **Reviewed by:** LEAD  
> **Date:** 2026-03-12  
> **Verdict:** ✅ APPROVED WITH CORRECTIONS — proceed to BUILDER with the corrections below strictly applied  

---

### ✅ What DESIGNER Got Right

- Correct charting library choice (Recharts — zero new dependencies)
- Correct injection points (`ProtocolDetail.tsx` left panel, `ForPatients.tsx` stub replace)
- Phase color compliance: practitioner = indigo, patient = violet (non-phase empathic)
- Y-axis suppression on patient chart is the right call — approved
- Risk flag threshold (PHQ-9 ≥20 or +5 trend) is clinically reasonable
- Feature-first directory structure `src/features/` is correct — approved
- Route `/for-patients` is already wired in `App.tsx` — no routing changes needed
- `role="alert"` on risk banner is the correct accessibility pattern

---

### 🛑 CORRECTIONS — BUILDER MUST READ BEFORE WRITING A SINGLE LINE

#### CORRECTION 1: `log_integration_notes` DOES NOT EXIST

> **DESIGNER ERROR — Phantom table reference.**

The DESIGNER specified: *"Pull from `log_integration_notes` if available (query by `patient_link_code_hash`)"*

**Verified via full migration scan and grep of all `src/` code:** There is no `log_integration_notes` table in any migration file, no TypeScript type definition, no existing query referencing it. This table was hallucinated.

**BUILDER MUST:**
In the `PractitionerProtocolBenchmark` component, the Session Notes Accordion section must use `log_clinical_records` itself — specifically, any existing `notes` or free-text fields if they exist in the table schema. If no notes column is found on `log_clinical_records`, the accordion section must be **rendered as a static placeholder only**, with the message:

```
"Session notes will appear here once the integration note-taking feature is live."
```

Shown in a `bg-slate-900/30 border border-slate-800/50 rounded-xl p-6 text-slate-600` block. **Do not query a non-existent table. Do not create a migration. Do not invent a schema.** The accordion shell must exist for future wiring, but must gracefully show the placeholder for now.

---

#### CORRECTION 2: Table Name Is `ref_benchmark_cohorts` — Not `benchmark_cohorts`

> **DESIGNER ERROR — Wrong table name used throughout the spec.**

The DESIGNER wrote `benchmark_cohorts` in multiple places in the architecture decision section. This is wrong.

The correct and verified table name is: **`ref_benchmark_cohorts`**

All queries must go through the existing typed helper functions in `src/lib/benchmarks.ts`:
- Use `getPrimaryBenchmark(modality, condition, instrument)` to get the best cohort for the substance
- Use `getBenchmarkCohorts(modality, condition, instrument)` to get all matching cohorts

**BUILDER MUST NOT** query `supabase.from('benchmark_cohorts')` directly — always go through `benchmarks.ts` helpers.

---

#### CORRECTION 3: Community Shadow-Line — No Raw P25/P75 Available

> **DESIGNER ERROR — props interface mismatches the actual data shape.**

The DESIGNER's `PatientJourneyValidationProps` specified:
```typescript
communityBenchmarkData: Array<{
  date: string;   // ← WRONG — no time series exists
  median: number;
  p25: number;    // ← WRONG — not in BenchmarkCohort schema
  p75: number;    // ← WRONG — not in BenchmarkCohort schema
}>;
```

The actual `BenchmarkCohort` interface (from `src/lib/benchmarks.ts`) has:
- `baseline_mean`, `baseline_sd`, `endpoint_mean`, `endpoint_sd`, `n_participants`
- **No P25/P75. No time series.** Only a single aggregate before→after datapoint per cohort.

**BUILDER MUST implement the shadow-line as follows:**

The "community arc" on both charts is a **synthetic 2-point line** derived from the best matching benchmark cohort (matched by `substanceName` → modality mapping, condition = `'MDD'`, instrument = `'PHQ-9'`):

```typescript
// Derive shadow-line endpoints from BenchmarkCohort aggregate
const communityArc = primaryBenchmark ? [
  { sessionLabel: 'Session 1',  communityScore: primaryBenchmark.baseline_mean },
  { sessionLabel: 'Last Session', communityScore: primaryBenchmark.endpoint_mean },
] : [];

// Approximate IQR band from SD (assuming normal distribution)
const sdBand = primaryBenchmark ? {
  y1: (primaryBenchmark.endpoint_mean ?? 0) - (primaryBenchmark.endpoint_sd ?? 2),
  y2: (primaryBenchmark.endpoint_mean ?? 0) + (primaryBenchmark.endpoint_sd ?? 2),
} : null;
```

This is honest — it shows where the community **started and ended** (baseline→endpoint), not a fabricated trajectory. The `ReferenceArea` uses the SD-derived band at the endpoint side only.

**Updated Props Interface for `PatientJourneyValidationProps`:**

```typescript
interface PatientJourneyValidationProps {
  patientPhqData: Array<{ sessionLabel: string; score: number | null }>;
  primaryBenchmark: BenchmarkCohort | null;  // From benchmarks.ts — null = no data
  completedSessions: number;
  totalPlannedSessions: number;
  substanceName: string;  // Used to map to modality for benchmark lookup
}
```

**Substance → Modality Mapping Table (hardcode in component):**

```typescript
const SUBSTANCE_TO_MODALITY: Record<string, string> = {
  'Ketamine': 'ketamine',
  'Esketamine': 'esketamine',
  'Psilocybin': 'psilocybin',
  'MDMA': 'mdma',
  'LSD': 'psilocybin', // proxy — closest available benchmark
};
```

---

#### CORRECTION 4: `PractitionerProtocolBenchmark` Props Must Match `ProtocolDetail` Data

The DESIGNER props specified `patientPhqData` as coming from a "longitudinal query". In the actual `ProtocolDetail.tsx`, the longitudinal query was **already skipped** (see migration 079 comment at line 198–201 — `patient_uuid` not available).

The `phqChartData` array is already built in `ProtocolDetail` from `baseline` + `longitudinal` arrays. **BUILDER MUST** pass this exact `phqChartData` array (already computed) directly to `PractitionerProtocolBenchmark`. No new query needed — reuse what's already there.

**Updated Props Interface for `PractitionerProtocolBenchmarkProps`:**

```typescript
interface PractitionerProtocolBenchmarkProps {
  sessionId: string;
  substanceName: string;
  phqChartData: Array<{ date: string; score: number | null }>; // Already computed in ProtocolDetail
  patientLinkCodeHash: string | null;  // For future notes wiring
}
```

---

#### CORRECTION 5: `section` Heading Uses `.ppn-section-title` — amber color is invalid

DESIGNER specified `.ppn-section-title text-amber-100/80` for the `PractitionerProtocolBenchmark` heading.

Per `frontend-best-practices`: **amber is the P2/Dosing phase color.** Using it for a section heading in `ProtocolDetail` (which can be any phase — Preparation, Dosing, or Integration) is a color-system violation.

**BUILDER MUST** use `.ppn-section-title` with the heading text in the default slate styling, with only the **icon badge** in amber (amber is appropriate for the "risk/alert" connotation of the Trend Forecast icon). Change the section heading to:

```tsx
<h2 className="ppn-section-title">Treatment Trend Forecast</h2>
```

No inline amber color override on the `h2`.

---

### 📋 LEAD Build Directives — BUILDER Execution Checklist

BUILDER must complete these tasks in order:

- [ ] **Step 1:** Create `src/features/` directory structure
  - `src/features/practitioner-analytics/PractitionerProtocolBenchmark.tsx`
  - `src/features/practitioner-analytics/index.ts`
  - `src/features/patient-portal/PatientJourneyValidation.tsx`
  - `src/features/patient-portal/index.ts`

- [ ] **Step 2:** Build `PractitionerProtocolBenchmark.tsx`
  - Props: `sessionId`, `substanceName`, `phqChartData`, `patientLinkCodeHash`
  - Data fetch: Use `getPrimaryBenchmark(modality, 'MDD', 'PHQ-9')` from `benchmarks.ts`
  - Shadow-line: 2-point synthetic arc (baseline_mean → endpoint_mean)
  - Risk flag: PHQ-9 ≥ 20 OR last > first by ≥ 5 → amber banner with `role="alert"`
  - Notes Accordion: Static placeholder shell (no DB query for notes — table doesn't exist)
  - Section heading: `.ppn-section-title` (no amber override)
  - Full accessibility: `aria-label` on all icon buttons, chart wrapper `role="img"`

- [ ] **Step 3:** Inject `<PractitionerProtocolBenchmark>` into `ProtocolDetail.tsx`
  - After the PHQ-9 trajectory section (after line 515)
  - Pass: `sessionId={session.id}`, `substanceName={substanceName}`, `phqChartData={phqChartData}`, `patientLinkCodeHash={session.patient_link_code_hash}`

- [ ] **Step 4:** Build `PatientJourneyValidation.tsx`
  - Props: `patientPhqData`, `primaryBenchmark`, `completedSessions`, `totalPlannedSessions`, `substanceName`
  - Shadow-line: 2-point community arc + SD band — see CORRECTION 3 above
  - Y-axis: hidden (`<YAxis hide />`)
  - All stat cards use directional language only — no clinical numbers
  - Affirming messages from the lookup table in DESIGNER §2.6
  - Violet palette throughout — no amber

- [ ] **Step 5:** Replace `ForPatients.tsx` stub
  - Fetch `primaryBenchmark` inside the page component using `getPrimaryBenchmark()`
  - Render `<PatientJourneyValidation>` as hero section
  - Add links to `PatientReport` and back to `Dashboard`
  - Note: Patient data (`patientPhqData`) is not directly accessible on this page without an authenticated link code — for MVP, render `PatientJourneyValidation` with **empty `patientPhqData={[]}`** and `primaryBenchmark` only. The patient arc line will render as absent, the community shadow-line will show. The affirming message will be based on `completedSessions={0}` unless a future work order passes link-code-based data.

- [ ] **Step 6:** TypeScript clean — no `any` types, all props typed
- [ ] **Step 7:** Run `npm run build` — zero new TS errors

---

### LEAD Architecture Decisions (Final)

| Question | Decision |
|---|---|
| Chart library | **Recharts** — already installed, no new deps |
| Population shadow-line data source | **`ref_benchmark_cohorts` via `getPrimaryBenchmark()`** — 2-point synthetic arc from baseline/endpoint means |
| P25/P75 bands | **Approximated from endpoint SD** — ±1 SD around endpoint_mean |
| Session notes | **Placeholder only** — no DB query, accordion shell for future wiring |
| Patient page data | **MVP: `patientPhqData=[]`, community shadow-line only** — patient data link-code wiring is a future WO |
| New database objects needed | **Zero** — no migrations, no new tables, no RPCs |
| RSC / TanStack Query | **Out of scope for MVP** — this codebase does not currently use TanStack Query; standard `useEffect` + `useState` pattern per existing codebase convention |

> **Note on RSC/TanStack from PRODDY PRD:** PRODDY requested TanStack Query and RSCs. These are aspirational architectural requirements that do not match the current codebase (Vite/CRA, no TanStack Query installed). LEAD is scoping them out of this work order. A separate architectural work order should be created to introduce TanStack Query if desired.

---

### LEAD Sign-Off

- [x] DESIGNER spec reviewed in full
- [x] All phantom table references corrected (no migrations needed)
- [x] Correct table name confirmed: `ref_benchmark_cohorts`
- [x] Shadow-line math corrected to use actual available data shape
- [x] Props interfaces corrected to match existing `ProtocolDetail` data flow
- [x] Color system violation corrected (amber heading → slate)
- [x] MVP patient data scope clarified — no blocking architecture needed
- [x] RSC/TanStack scoped out — matches actual codebase stack
- [x] Build directives written in step order for BUILDER
- [x] Zero new DB schema changes required

**Status: APPROVED. BUILDER may proceed.**

==== LEAD ====
