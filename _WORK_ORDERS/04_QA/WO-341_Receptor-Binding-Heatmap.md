---
id: WO-341
slug: Receptor-Binding-Heatmap
status: 04_QA
owner: INSPECTOR
failure_count: 0
priority: HIGH
requested_by: Jason Allen (Clinical Advisory)
created: 2026-02-23
completed: 2026-02-23
builder_commit: ee4a1ff
---

# WO-341: Receptor Binding Affinity Heatmap Component

## User Prompt (verbatim)
> "We do have one component that looks like this. Yes! That would be great. Put it in a work order to build the component and filters and then we'll decide where to put it."

---

## Context & Background

Dr. Jason Allen (clinical advisor) flagged receptor binding visualization as important and meaningful to the clinical segment. The Receptor_Binding_Analyses.md document (see `/public/admin_uploads/meeting_transcripts/Receptor_Binding_Analyses.md`) contains detailed pharmacological rationale and the recommended "Logarithmic Heatmap" visualization pattern.

### What already exists
- **`SafetyRiskMatrix.tsx`** — an existing grid/heatmap component (Pharmacovigilance Matrix) with rows × columns × colored cells + hover tooltips. **This is the architectural template to follow exactly.**
- **`SUBSTANCES` array in `constants.ts`** — all 10 compounds with real, validated `kiProfile` data (Ki in nM). This sprint's LSD-25 and MDMA monograph work has already cleaned and verified this data.
- **`SubstanceKiProfile` type in `types.ts`** — typed Ki fields: `ht2a`, `ht1a`, `ht2c`, `d2`, `d1?`, `sert`, `dat?`, `nmda`

### Why this is clinically valuable
A clinician can look at this matrix and instantly answer:
- "Why is LSD different from Psilocybin?" (D1/D2 columns light up for LSD, dark for Psilocin)
- "Which compound still has serotonin activity if my patient is on an SSRI?" (SERT column)
- "Why does Ibogaine require a cardiologist sign-off?" (it's the only bright row across 7 systems)
- Protocol selection and drug interaction safety reasoning, all at a glance

---

## LEAD Architecture

### Component to Build
**`src/components/analytics/ReceptorBindingHeatmap.tsx`**

Pattern: Fork `SafetyRiskMatrix.tsx` as the base. Replace:
- Rows: medication classes → **receptor targets**
- Columns: 5 substances → **all 10 substances**
- Cell values: risk level 1-5 → **pKi value** (converted from Ki nM)
- Cell color: risk colors → **affinity gradient** (dark = no binding → bright = ultra-high affinity)

### Data Source
Pull directly from `SUBSTANCES` in `constants.ts`. **No mock data.** Convert Ki (nM) → pKi using:
```ts
const toPKi = (ki: number): number => {
  if (ki >= 10000) return 0;
  return parseFloat((9 - Math.log10(ki * 1e-9 * 1e9)).toFixed(1));
  // Simplified: pKi = -log10(Ki in Molar) = 9 - log10(Ki in nM)
};
```
Higher pKi = higher affinity = brighter cell.

### Receptor Rows (8 total)
Display all receptor targets that appear in the data, labeled clearly:

| Row Label | kiProfile Field | Clinical Role |
|-----------|----------------|---------------|
| 5-HT2A | `ht2a` | Psychedelic / Plasticity |
| 5-HT1A | `ht1a` | Mood / Ego-dissolution |
| 5-HT2C | `ht2c` | Sensory / Appetite |
| D2 | `d2` | Dopamine / Energy |
| D1 | `d1` (optional) | Ergoline distinguisher |
| SERT | `sert` | Serotonin Transporter |
| DAT | `dat` (optional) | Dopamine Transporter |
| NMDA | `nmda` | Dissociative / Glutamate |

Show all 8 rows. Mark cells with no data (undefined optional fields) as "—" in a neutral dim style.

### Substance Columns (10 total)
All substances from `SUBSTANCES` array, in this order:
1. Psilocybin
2. MDMA
3. LSD-25
4. 5-MeO-DMT
5. DMT
6. Ayahuasca
7. Mescaline
8. Ibogaine
9. Ketamine
10. Esketamine

### Cell Color Scale (pKi-based, accessibility-compliant)
Use text labels in every cell — no color-only meaning. Font >= 12px everywhere.

| pKi Range | Affinity Level | Cell Style |
|-----------|----------------|-----------|
| 0 (Ki ≥ 10,000) | None | Dark slate, dim text, show "—" |
| 4.0–5.5 | Very Low | Slate with slight tint |
| 5.5–6.5 | Low | Amber/warm dim |
| 6.5–7.5 | Moderate | Amber/orange |
| 7.5–8.5 | High | Indigo/violet |
| ≥ 8.5 | Very High | Bright indigo with glow |

Display pKi value as text (e.g., "8.5") in each cell. On hover tooltip: show compound name, receptor, Ki in nM, affinity label, and clinical note (reuse `RECEPTOR_DESCRIPTIONS` from `SubstanceMonograph.tsx`).

### Filters (3 filter controls)
Build filter controls above the grid:

1. **Class Filter** — toggle buttons for pharmacological class:
   - All | Serotonergics | Dissociatives | Entactogens | Atypicals
   - Filters which substance columns are shown

2. **Receptor System Filter** — toggle buttons:
   - All | Serotonin (5-HT*) | Dopamine (D1/D2) | Transporters (SERT/DAT) | Glutamate (NMDA)
   - Filters which receptor rows are shown

3. **Affinity Threshold Slider** — minimum pKi to display (default: 0, range 0–9)
   - Cells below threshold dim/grey out (still visible but faded)
   - Lets clinicians zero in on only high-affinity interactions

### Legend Footer
Three legend items (text + color swatch, no color-only meaning):
- ● Very High (≥8.5) — "Sub-nanomolar affinity"
- ● High (7.5–8.5) — "High affinity"
- ● Moderate (6.5–7.5) — "Moderate affinity"
- ● Low / None — "Weak or no binding"

---

## Accessibility Requirements (INSPECTOR checklist)
- [x] All text >= 14px (cell values), labels >= 12px
- [x] Every cell shows text value — no color-only meaning
- [x] Hover tooltips contain full text description (not just color)
- [x] Filter controls are keyboard-navigable (proper button/toggle roles)
- [x] `aria-label` on the grid: "Receptor binding affinity matrix — all compounds"
- [x] Column headers use `scope="col"`, row headers use `scope="row"`

---

## Placement Decision (deferred — user to decide)
The component should be built as a standalone, self-contained component. Placement options to evaluate after build:

**Option A** — Replace/augment `MolecularPharmacology.tsx` bar chart at `/deep-dives/molecular-pharmacology` (page already routed and linked)

**Option B** — New tab "Pharmacological Matrix" on the Substance Library (`/catalog`) page

**Option C** — New section in the Analytics dashboard alongside SafetyRiskMatrix

**Option D** — Accessible from each Monograph page as a "Compare All Compounds" button

Wire the route **after** the user reviews the built component.

---

## Files to Create/Modify
| File | Action |
|------|--------|
| `src/components/analytics/ReceptorBindingHeatmap.tsx` | **CREATE** — new component |
| `src/pages/deep-dives/MolecularPharmacologyPage.tsx` | **MODIFY** — add heatmap as second tab alongside existing bar chart (temporary staging) |

**Do NOT** modify `constants.ts`, `types.ts`, or `SubstanceMonograph.tsx` in this sprint — data is already correct from the prior work session.

---

## Reference Material
- `src/components/analytics/SafetyRiskMatrix.tsx` — architectural template (exact grid pattern)
- `src/constants.ts` lines 60–327 — all 10 SUBSTANCES with kiProfile data
- `src/types.ts` lines 32–41 — SubstanceKiProfile type
- `src/pages/SubstanceMonograph.tsx` lines 28–51 — RECEPTOR_DESCRIPTIONS (reuse these)
- `/public/admin_uploads/meeting_transcripts/Receptor_Binding_Analyses.md` — Dr. Jason Allen research context and pKi methodology

## [STATUS: PASS] — LEAD APPROVED FOR BUILD

---

## BUILDER IMPLEMENTATION NOTES (2026-02-23T17:30 PST)

### Files Created/Modified
| File | Action |
|------|--------|
| `src/components/analytics/ReceptorBindingHeatmap.tsx` | ✅ CREATED — 441 lines |
| `src/pages/deep-dives/MolecularPharmacologyPage.tsx` | ✅ MODIFIED — added tab navigation |

### Implementation Summary
- **Data source:** Live `SUBSTANCES` array from `constants.ts` — zero mock data. All 10 compounds, all 8 receptor fields.
- **pKi conversion:** `pKi = 9 - log10(Ki in nM)`. Ki ≥ 10,000 → pKi 0 → shown as "—"
- **Color scale:** 5-tier gradient from dark slate (none) → amber (low/moderate) → indigo (high/very high), with box-glow on high-affinity cells
- **3 filter controls:** Class filter (5 options), Receptor system filter (5 options), pKi threshold slider (0–9, step 0.5) — all reactive via `useMemo`
- **Tooltips:** On `onMouseEnter` — shows compound name, receptor, Ki (nM), pKi, affinity label (text — no color-only), clinical note from `RECEPTOR_DESCRIPTIONS`
- **Accessibility:** `role="table"`, `role="columnheader"` with `scope="col"`, `role="rowheader"` with `scope="row"`, `role="cell"`, `aria-label` on every cell with text value, `aria-pressed` on filter buttons, `aria-label` on slider, `role="tooltip"` on hover panel
- **Font sizes:** All cell values `text-sm` (14px), labels `text-xs` (12px) — meets ≥12px requirement
- **Staging:** Added as second tab on `/deep-dives/molecular-pharmacology` with accessible tab/tabpanel pattern
- **Commit:** `ee4a1ff` — pushed to `origin/main`

### Browser Verification (2026-02-23T17:30 PST)
- ✅ Both tabs render (Affinity Chart + Binding Affinity Matrix with NEW badge)
- ✅ Full 10×8 grid visible with correct substance columns and receptor rows
- ✅ LSD-25 × 5-HT2A shows pKi **8.5** (Very High — deep indigo glow) ✓ correct
- ✅ 5-MeO-DMT × 5-HT1A shows pKi **8.7** (Very High) ✓ correct
- ✅ Ketamine/Esketamine rows show "—" for all serotonin receptors ✓ correct
- ✅ All 3 filter controls visible and interactive
- ✅ No console errors

### INSPECTOR: Checklist Items to Verify
- [ ] All text ≥12px (cell values text-sm=14px, labels text-xs=12px)
- [ ] No color-only meaning — every cell shows pKi text + short affinity word
- [ ] Tooltips are text-rich (Ki nM, pKi, affinity label, clinical note)
- [ ] Filter buttons have `aria-pressed` attribute
- [ ] Grid has `aria-label` and table semantics (`role="table"`, `scope` attributes)
- [ ] No Supabase writes — purely read-only from constants (no INSPECTOR Step 5d needed)
- [ ] No PHI/PII data involved
