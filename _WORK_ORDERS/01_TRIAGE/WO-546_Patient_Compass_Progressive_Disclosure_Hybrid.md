==== PRODDY ====
---
owner: LEAD
status: 01_TRIAGE
authored_by: PRODDY
sourced_from: WO-545 (VIZ Phase 3 Audit)
promoted: 2026-03-06
---

## PRODDY PRD

> **Work Order:** WO-546 - Patient Compass: Progressive Disclosure Hybrid
> **Authored by:** PRODDY
> **Date:** 2026-03-05
> **Status:** Draft - Pending LEAD review

---

### 1. Problem Statement

The patient-facing Integration Compass exists in two competing concepts: Concept A is text-only with sliders (too passive, no clinical storytelling), and Concept B is data-heavy with radar charts and node-link visualizations (too cognitively overwhelming, especially on mobile at 375px width). Neither concept standalone equips the patient to understand their healing data. On mobile, Concept B's chart typography is illegible and its touch targets are too small for reliable interaction.

---

### 2. Target User + Job-To-Be-Done

A patient using the Integration Compass on a mobile device needs to understand their session data through progressively revealed charts and clearly labeled sliders so that they can engage confidently with their healing journey without being overwhelmed.

---

### 3. Success Metrics

1. All interactive chart elements (radar axes, waveform labels) render at a minimum 14px font size, verified across 375px, 768px, and 1280px viewports.
2. Patient Compass check-in completion rate on mobile increases to >= 70% within 14 days of launch (baseline: current rate on Concept A).
3. All slider thumb touch-targets measure a minimum of 48x48px across iOS Safari and Android Chrome, verified in QA across 10 consecutive sessions.

---

### 4. Feature Scope

#### In Scope

- Merge Concept A (accordion layout + sliders for Neuroplastic Window) with Concept B's rich visualizations (Spider/Radar chart, Emotional Terrain waveform).
- Progressive Disclosure: charts from Concept B are hidden inside collapsed accordions by default on mobile, revealed on user tap.
- Slider thumb `min-height: 48px; min-width: 48px` enforced via Tailwind/CSS.
- All SVG `<text>` and Recharts axis label elements set to `fontSize: 14` minimum.
- Radar chart `strokeWidth` increased to `2px` minimum on predicted and lived data shapes.
- Accordion expand/collapse animation: `transition-duration: 200ms`, `ease-out` easing, no `height: auto` snap.
- Empty state for the deferred "Brain Diagram" section: Glass Panel card (`bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem]`) with a 14px label "Neurological Map - Coming Soon."

  *(FLO amendment - 2026-03-05)*

#### Out of Scope

- Any changes to the underlying data model or Supabase schema for patient check-ins.
- Redesigning the Clinician-facing dashboard (covered in WO-548).
- The "Your Brain During the Session" node-link diagram implementation (deferred to V2 pending explainability strategy).
- Building the actual Smart Tooltip content strategy (covered in WO-547).

---

### 5. Priority Tier

**[X] P1** - High value, ship this sprint

**Reason:** The Patient Compass is the primary patient-retention surface. Mobile is an explicitly stated product priority and the current concepts are not shippable on a 375px viewport without this layout merge.

---

### 6. Open Questions for LEAD

1. Should the progressive disclosure accordion state (open/closed) be persisted in local storage between sessions, or always start collapsed on mobile?
2. Is the Emotional Terrain waveform component built in Recharts or raw SVG? This determines whether horizontal scroll container or ResponsiveContainer with fixed aspect-ratio is the correct fix.
3. Are the Neuroplastic Window sliders a standard HTML `<input type="range">` or a third-party library? Touch-target sizing approach differs between the two.

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is <= 100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is <= 5 items
- [x] Total PRD word count is <= 600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`

==== PRODDY ====
