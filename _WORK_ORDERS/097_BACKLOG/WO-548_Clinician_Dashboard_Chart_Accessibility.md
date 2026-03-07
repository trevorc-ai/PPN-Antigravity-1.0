==== PRODDY ====
---
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
sourced_from: WO-545 (VIZ Phase 3 Audit)
---

## PRODDY PRD

> **Work Order:** WO-548 - Phase 3 Clinician Dashboard: Chart Accessibility & Empty State Skeletons
> **Authored by:** PRODDY
> **Date:** 2026-03-05
> **Status:** Draft - Pending LEAD review

---

### 1. Problem Statement

The Phase 3 Clinician Dashboard has two critical visualization problems. First, the "Symptom Decay Curve" and "Trajectory vs. Reference Cohort" chart slots display plain text placeholders ("Data will appear here"), giving the clinician no spatial sense of what will be tracked. Second, when these charts ARE populated, both data series (Patient vs. Cohort) will render as identically-styled solid colored lines, which is unreadable for a color-blind user and on bright tablet screens in clinical settings.

---

### 2. Target User + Job-To-Be-Done

A licensed practitioner reviewing a patient's Phase 3 integration progress on a tablet needs to immediately distinguish between the patient trajectory and the benchmark cohort line, and see a meaningful chart skeleton before data is available, so that they can quickly calibrate clinical expectations without confusion.

---

### 3. Success Metrics

1. Zero instances of color-as-sole-differentiator in any multiline Recharts chart: the Reference Cohort line uses `strokeDasharray="5 5"` and the Patient line uses a solid stroke, verified by FLO's next audit.
2. `<ChartSkeleton />` components replace all text-only empty states across the Phase 3 dashboard, verified by INSPECTOR in QA before handoff.
3. All secondary helper text in the Phase 3 dashboard uses `text-slate-400` (`#94a3b8`) or higher contrast, with zero instances of `text-slate-500` or `text-slate-600` remaining, verified by an automated Tailwind class scan.

---

### 4. Feature Scope

#### In Scope

- Build a reusable `<ChartSkeleton />` component that renders faint ghost-lines (`stroke="rgba(255,255,255,0.05)"`, `strokeDasharray="3 3"`) and a labeled axis frame, to be used in all empty-state chart containers.
- Apply `<ChartSkeleton />` to the "Symptom Decay Curve" and "Trajectory vs. Reference Cohort" slots.
- Apply `strokeDasharray="5 5"` to the Reference Cohort `<Line>` component wherever a benchmark comparison line appears.
- Apply solid stroke + `<ReferenceDot />` markers to the Patient trajectory `<Line>`.
- Audit and update all secondary text classes from `text-slate-500` / `text-slate-600` to `text-slate-400` in Phase 3 dashboard components only.
- `<ChartSkeleton />` must use an animated shimmer pulse: a `@keyframes` animation oscillating between `opacity: 0.04` and `opacity: 0.12` at a 2s interval. Static ghost-lines are invisible on a dark background.

  *(FLO amendment - 2026-03-05)*

> **V2 Debt Note (logged by PRODDY):** The `text-slate-500` to `text-slate-400` fix is scoped to Phase 3 only in this ticket, creating a contrast inconsistency with Phase 1/2. A follow-up global contrast sweep must be scheduled for V2 to maintain system-wide accessibility coherence.

#### Out of Scope

- Changes to chart data logic or Supabase queries powering the Symptom Decay and Trajectory charts.
- Global typography audit across the entire app (scoped separately in WO-542).
- Patient-facing compass chart changes (covered in WO-546 and WO-547).
- Any new chart types or data series not already planned for Phase 3.

---

### 5. Priority Tier

**[X] P1** - High value, ship this sprint

**Reason:** The color-only line differentiation is a direct violation of the Lead Designer's color-blindness accessibility mandate and is a Critical Violation per VIZ's audit. Both issues block a credible demo of the Phase 3 dashboard to clinical partners.

---

### 6. Open Questions for LEAD

1. Should `<ChartSkeleton />` be a generic reusable component placed in `src/components/ui/` or scoped specifically to Phase 3 components?
2. Which specific component files contain the "Symptom Decay Curve" and "Trajectory vs. Reference Cohort" chart instances - are they in `PatientConstellationPage.tsx` or a dedicated Phase 3 dashboard file?
3. Is there a shared Recharts config/theme object we can centralize the `strokeDasharray` and `fontSize` defaults in, to avoid per-chart repetition?

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
