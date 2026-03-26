---
name: frontend-best-practices
description: |-
  MANDATORY read before writing ANY React component or CSS.
  Defines the PPN design system: typography classes, color tokens,
  phase palette, and component patterns. Violations are QA failures.
---

# PPN Frontend Design System — BUILDER Reference

> **This skill is the single source of truth for all UI consistency.**
> If you are writing a component and reaching for `text-xl font-bold` or `text-2xl font-black` directly in Tailwind — STOP. Use the CSS classes below instead.

---

## 🚨 RULE ZERO — PRE-CODE CHECKLIST

Before writing a single JSX element, answer YES to all of the below:

- [ ] I have read the **Typography** section and know which `.ppn-*` class to use
- [ ] I know the **phase color** for this component (indigo/amber/teal — see Color System)
- [ ] I have NOT used `text-[8px]`, `text-[9px]`, `text-[10px]`, or `text-[11px]` anywhere
- [ ] I have NOT used red for anything other than a warning/adverse event
- [ ] I have NOT used `bg-emerald-500` or `bg-emerald-600` as a solid button background
- [ ] **Every dropdown, select, or option list that mirrors a `ref_*` table is fetched from the database — NOT hardcoded in the component.** If the data lives in a DB table, the UI reads from it. No exceptions.

If any answer is NO — fix it before handing off.

---

## 1. TYPOGRAPHY — THE LAW

All typography uses CSS classes defined in `src/index.css`. **Use these, not ad-hoc Tailwind sizes.**

| Class | Element | Size | Use for |
|---|---|---|---|
| `.ppn-page-title` | `<h1>` | 36px / `text-4xl` | Page-level titles (Dashboard, page headers) |
| `.ppn-section-title` | `<h2>` | 24px / `text-2xl` | Major section headings within a page |
| `.ppn-card-title` | `<h3>` | 18px / `text-lg` | Card titles, panel headings, form section titles |
| `.ppn-label` | `<h4>`, `<label>` | 14px / `text-sm` | Form group labels, field headings (uppercase) |
| `.ppn-body` | `<p>`, `<li>`, `<td>` | 15px | All body text, descriptions, table content |
| `.ppn-meta` | `<span>`, `<time>`, `<small>` | 12px / `text-xs` | Badges, timestamps, metadata **only** |
| `.ppn-caption` | `<small>` in charts | 11px | **Chart legends ONLY. Never for UI labels.** |

### Usage Examples

```tsx
// ✅ CORRECT
<h1 className="ppn-page-title">Patient Dashboard</h1>
<h2 className="ppn-section-title">Clinical Timeline</h2>
<h3 className="ppn-card-title">Session Preparation</h3>
<label className="ppn-label">Monitoring Date</label>
<p className="ppn-body">Document patient consent before any clinical activity begins.</p>
<span className="ppn-meta">Step 1 of 5</span>

// ❌ WRONG — ad-hoc sizes, will be rejected by INSPECTOR
<h1 className="text-2xl font-bold text-slate-200">Patient Dashboard</h1>
<p className="text-xs text-slate-300">Some description</p>
<span className="text-[10px] text-slate-500">Step 1</span>
```

### Tailwind Size Override Rules (when you MUST use Tailwind directly)
Only acceptable when combining a `.ppn-*` class would create conflicts.
- Minimum body: `text-sm` (14px)
- Minimum metadata: `text-xs` (12px)
- **NEVER**: `text-[8px]`, `text-[9px]`, `text-[10px]`, `text-[11px]`

---

## 2. COLOR SYSTEM — THE LAW

### Phase Colors (locked — do not deviate)

```
Phase 1 — Preparation = INDIGO
  CSS var:  --phase1-primary (#6366f1)
  Tailwind: indigo-500 / indigo-900 / indigo-950

Phase 2 — Dosing = AMBER
  CSS var:  --phase2-primary (#f59e0b)
  Tailwind: amber-500 / amber-900 / amber-950

Phase 3 — Integration = TEAL
  CSS var:  --phase3-primary (#14b8a6)
  Tailwind: teal-500 / teal-900 / teal-950
```

### Semantic Colors (locked)

```
RED     → Warnings, adverse events, safety flags ONLY
          Never use red for a standard UI action or status
AMBER   → Phase 2 active state, moderate warnings
TEAL    → Completed/success states, Phase 3
INDIGO  → Phase 1, info, primary CTA buttons
SLATE   → Neutral text, borders, backgrounds
```

### Prohibited Color Uses

```tsx
// ❌ NEVER — bright solid background buttons
<button className="bg-emerald-500 ...">Start</button>
<button className="bg-emerald-600 ...">Submit</button>

// ❌ NEVER — red for non-clinical states
<div className="bg-red-500/60 ...">Phase 1 Card</div>
<span className="text-red-400">Completed</span>

// ✅ CORRECT — phase-appropriate button
<button className="bg-indigo-700/50 hover:bg-indigo-600/60 border border-indigo-500/50 text-indigo-100 ...">
  Continue
</button>
```

### Text Brightness Cap (protected — do not remove)
`text-white` renders as `color: rgb(226 232 240)` (slate-200) site-wide via `index.css`. This is intentional — pure white causes eye strain. **Do not override.**

---

## 3. COMPONENT PATTERNS

### Card (standard)
```tsx
<div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
  <h3 className="ppn-card-title mb-4">Card Heading</h3>
  <p className="ppn-body">Body content here.</p>
</div>
```

### Form Field (standard)
```tsx
<div className="space-y-2">
  <label className="ppn-label" htmlFor="field-id">Field Label</label>
  <input
    id="field-id"
    className="form-input"
    type="text"
  />
</div>
```
> `form-input` and `form-label` are defined in `src/index.css`. Use them.

### Form Footer — 3 buttons (ALL Phase 1 forms)
```tsx
<div className="flex items-center gap-3 pt-2 pb-4">
  <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-slate-300 text-sm font-semibold">
    <ChevronLeft className="w-4 h-4" />
    Back
  </button>
  <div className="flex-1" />
  <button className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-600/50 bg-slate-800/60 text-slate-300 text-sm font-semibold">
    <LogOut className="w-4 h-4" />
    Save & Exit
  </button>
  <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-700/50 hover:bg-indigo-600/60 border border-indigo-500/50 text-indigo-100 text-sm font-black uppercase tracking-widest">
    <CheckCircle className="w-4 h-4" />
    Save & Continue
    <ChevronRight className="w-4 h-4" />
  </button>
</div>
```

### Phase Panel Outer Border
```tsx
// Pull from phasePalette in WellnessJourney.tsx — do not duplicate inline
// Phase 1: border-indigo-500/50 | shadow indigo | bg-indigo-950/15
// Phase 2: border-amber-500/50  | shadow amber  | bg-amber-950/15
// Phase 3: border-teal-500/50   | shadow teal   | bg-teal-950/15
```

---

## 4. ACCESSIBILITY (Non-Negotiable)

- Min font sizes already enforced by `index.css` global rules
- Color + icon + text for ALL state indicators (never color alone)
- Focus rings via `index.css` `:focus-visible` — don't override with `focus:outline-none`
- `aria-label` on all icon-only buttons
- `role="progressbar"` with `aria-valuenow`/`aria-valuemax` on progress elements

---

## 5. PRE-COMMIT CHECKLIST (INSPECTOR verifies all of these)

- [ ] All heading elements use `.ppn-page-title`, `.ppn-section-title`, or `.ppn-card-title`
- [ ] All body text uses `.ppn-body` or Tailwind `text-sm` minimum
- [ ] No `text-[8..11px]` anywhere in the component
- [ ] No `bg-emerald-500` / `bg-emerald-600` solid backgrounds
- [ ] No red used outside of warning/adverse-event contexts
- [ ] Phase color matches: P1=indigo, P2=amber, P3=teal
- [ ] Form footer uses Back | Save & Exit | Save & Continue pattern
- [ ] All icon-only buttons have `aria-label`
- [ ] TypeScript: no `any` types
- [ ] **No hardcoded option arrays that duplicate a `ref_*` table.** Any data that exists in the DB must be fetched from the DB. Hardcoding creates silent drift bugs when the DB grows.

---

## 6. DATABASE-DRIVEN DATA — THE LAW

The database is the **single source of truth** for all reference data. The frontend is a consumer — never a second copy.

### The Rule

| Data type | Source | NEVER |
|---|---|---|
| Substance list | `ref_substances` or derived from `ref_clinical_interactions` | Hardcoded array in component |
| Medication list | `ref_medications` | Hardcoded array |
| Safety concerns / actions | `ref_clinical_observations` | Hardcoded array with integer IDs |
| Session types | `ref_session_types` | Hardcoded string literals |
| Weight ranges | `ref_weight_ranges` | Hardcoded number ranges |
| Any other `ref_*` table | The `ref_*` table | A `const` array in the component |

### How to spot the violation

If you are writing any of the following in a component, STOP and confirm it should not come from the DB:

```tsx
// 🚨 RED FLAGS — likely violations:
const OPTIONS = [ { id: 1, name: 'Foo' }, { id: 2, name: 'Bar' } ];
const SUBSTANCES = ['Psilocybin', 'MDMA', 'Ketamine'];
const TYPES = ['preparation', 'dosing', 'integration'];
```

### The correct pattern

```tsx
// ✅ CORRECT — fetch from DB, let the DB own the list
const { data } = await supabase.from('ref_substances').select('*').order('substance_name');
// If you only want substances with seeded rules:
const { data } = await supabase.from('ref_clinical_interactions').select('substance_name');
const unique = [...new Set(data.map(r => r.substance_name))].sort();
```

### Exception (Temporary Scaffold — NOT a Permanent Feature)

`src/constants/analyticsData.ts` mock constants are a **temporary build scaffold only**. They exist because the required `v_`/`mv_` SQL views have not yet been built.

**Rules:**
1. Mock data (`MOCK_*` constants) must **not** be introduced into any new component.
2. Any component currently using mock data **must** be migrated to read from its target `v_` or `mv_` SQL view as soon as that view exists.
3. A WO that creates a new `mv_` view is **incomplete** until the consuming component is updated to read from it. INSPECTOR will reject at QA if this is not done.

**Current mock-data migration queue** *(do not close until migrated)*:

| Component | Mock Constant | Target `mv_` View | Pillar |
|-----------|--------------|------------------|--------|
| `SafetyRiskMatrix.tsx` | `MOCK_RISK_DATA` | `mv_open_risk_queue` | 1 — Safety |
| `PatientJourneySnapshot.tsx` | `MOCK_JOURNEY_DATA` | `mv_patient_latest_status` | 1 — Safety |
| `PatientFlowSankey.tsx` | `MOCK_FLOW_DATA` | `mv_site_monthly_quality` | 3 — QA |
| `ConfidenceCone.tsx` | `MOCK_TRAJECTORY_DATA` | `mv_benchmark_by_subgroup` | 2 — Comparative |

*Updated 2026-03-25 per INSPECTOR SQL-Layers alignment audit.*

---

**END OF FRONTEND BEST PRACTICES SKILL**
