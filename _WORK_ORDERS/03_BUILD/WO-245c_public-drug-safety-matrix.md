---
status: 03_BUILD
owner: BUILDER
failure_count: 0
priority: HIGH
created: 2026-02-20
sprint: 3
blocked_by: none (can run parallel to WO-245a)
---

# WO-245c: Public Drug Safety Matrix — `/safety` Route

## Context
The `INTERACTION_RULES` array in `constants.ts` (line 282) contains 10+ drug interaction rules, each with severity, mechanism, and cited sources. This is pure frontend data — zero database queries, zero external API calls. Build the public `/safety` page around it and add a teaser widget to the landing page.

## Architecture
```
Data source: INTERACTION_RULES from constants.ts (already complete, ~4KB)
No Supabase. No external API. Pure React state.
Layout: <PublicPageLayout> (from WO-245a)
Route: /safety (public, no auth required)
```

## Tasks

### 1. Create `src/pages/DrugSafetyMatrix.tsx`
**Two dropdowns:**
- Dropdown 1: "Select substance" — populate from `SUBSTANCES.map(s => s.name)` sorted alphabetically
- Dropdown 2: "Select medication/substance" — unique list of `INTERACTION_RULES.map(r => r.interactor)` + a sensible curated list

**Result lookup (instant, no async):**
```typescript
const result = INTERACTION_RULES.find(
  r =>
    r.substance.toLowerCase() === selectedSubstance.toLowerCase() &&
    r.interactor.toLowerCase() === selectedMedication.toLowerCase()
);
```

**Result card (shows when result found):**
- Severity badge: text label + icon (NOT color-only): "⚠️ High", "🔴 Life-Threatening", "🟡 Moderate"
- Risk level bar (numeric, 1-10)
- Description paragraph (existing `result.description`)
- Mechanism note (existing `result.mechanism`)
- Source citation with link (existing `result.source`, `result.sourceUrl`)
- Medical disclaimer: "For clinical reference only. Not a substitute for clinical judgment. Consult prescribing information."

**No result state:**
"No interaction data available for this combination. Absence of data is not evidence of safety. Always consult current prescribing information."

**CTA below results:**
"Access evidence-based clinical intelligence for every patient session. [Join PPN →]"

### 2. Add Route to `App.tsx`
```tsx
<Route path="/safety" element={<DrugSafetyMatrix />} />
```
In the public routes array (no auth guard).

### 3. Add SEO Meta Tags
```html
<title>Drug Interaction Checker — PPN Psychedelic Practice Network</title>
<meta name="description" content="Check interactions between psychedelic medicines and common medications. Free clinical reference tool for practitioners." />
```

### 4. Add Teaser Widget to Landing Page
Small banner section near the footer:
- Headline: "Check Drug Interactions Instantly"
- Subtitle: "Lithium + Psilocybin? SSRIs + MDMA? Get the answer in seconds."
- One dropdown: "Select a substance →" — on select, routes to `/safety?substance={name}`
- CTA button: "Check Safety →" routes to `/safety`
- **Do NOT** show results on the landing page. The `/safety` route owns that experience.

## Design Spec
- Consistent with `<PublicPageLayout>` dark aesthetic
- Result card uses `bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-[1.5rem]`
- Severity colors must ALSO use text labels (accessibility rule — no color-only state)
- Min font size: 14px everywhere
- Smooth fade-in animation on result render

## Acceptance Criteria
```
[ ] 1. /safety route loads without auth
[ ] 2. grep -n "DrugSafetyMatrix\|/safety" src/App.tsx → returns public route
[ ] 3. Selecting "Psilocybin" + "Lithium" shows severity "Life-Threatening" result
[ ] 4. Selecting combination with no rule shows "No interaction data" message
[ ] 5. Result card shows: severity, description, mechanism, source with link
[ ] 6. Medical disclaimer text present at bottom of result
[ ] 7. CTA "Join PPN →" present below result
[ ] 8. Landing page teaser widget links to /safety
[ ] 9. No Supabase query anywhere in DrugSafetyMatrix.tsx
[ ] 10. No font below 14px
[ ] 11. No color-only severity indicator (text label paired with every color)
[ ] 12. git log shows (HEAD -> main, origin/main)
```

## Do NOT
- Query Supabase for anything on this page
- Show partial results or loading spinners (data is instant)
- Gate this page behind auth
- Add interaction rules beyond what's already in INTERACTION_RULES (out of scope)
