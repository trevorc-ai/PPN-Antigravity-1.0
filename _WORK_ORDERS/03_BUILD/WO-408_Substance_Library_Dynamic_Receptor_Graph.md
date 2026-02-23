---
id: WO-408
status: 03_BUILD
owner: BUILDER
priority: HIGH
failure_count: 0
created: 2026-02-23
source: Jason/Trevor Demo Debrief 2/23/26
demo_deadline: Dr. Allen demo (target Wednesday 2/25/26)
---

# WO-408 — Fix Substance Library Receptor Affinity Spider Graph (Dynamic Per Substance)

## USER STORY (verbatim from demo)
> "Select something different. The affinity profile should be changing and I don't think it is."
> — Jason, 01:16:21–01:17:24

> "Each receptor is different. I put that in my notes — each one has to be mapped properly. LSD is different, psilocybin is different, MDMA is different. All these receptor points, what they bind to, are different per substance, and we need to update those."
> — Jason, 01:18:11

> "If I'm after D2 receptor — what's the best thing for that? D2 receptor is for mood enhancing. NMDA receptor makes you calm. This is how Dr. Allen works — he knows the chemicals and receptors he's after and then targets it with his treatments."
> — Jason, 01:19:06–01:20:43

## LEAD ARCHITECTURE

### The Bug
The receptor affinity spider/radar graph on the Substance Library page is rendering **static data** — the shape of the graph does not change when the user switches between substances (e.g., from Psilocybin → MDMA → Ketamine → LSD). This makes the graph scientifically meaningless for comparison.

### Root Cause (suspected)
The graph is likely pulling from a hardcoded data object or a single static dataset instead of dynamically binding to the currently-selected substance object. The substance selector may be updating UI elements but not re-feeding the chart's data prop.

### The Fix

#### Step 1 — Verify/Build Receptor Binding Data Per Substance

Each substance needs its own receptor affinity profile. Use the following **scientifically grounded baseline values** (0–10 scale, where 10 = highest known affinity for that receptor):

| Receptor | Psilocybin | MDMA | Ketamine | LSD | Ayahuasca (DMT) | MDMA |
|----------|-----------|------|----------|-----|---------|------|
| 5-HT2A   | 9 | 4 | 1 | 10 | 8 | 4 |
| 5-HT1A   | 5 | 3 | 1 | 6 | 5 | 3 |
| D2       | 2 | 3 | 1 | 5 | 2 | 3 |
| NMDA     | 1 | 1 | 10 | 1 | 2 | 1 |
| SERT     | 1 | 9 | 1 | 3 | 2 | 9 |
| DAT      | 1 | 6 | 1 | 2 | 1 | 6 |
| NET      | 1 | 7 | 1 | 2 | 1 | 7 |
| Sigma-1  | 2 | 2 | 3 | 2 | 5 | 2 |

> **Note to BUILDER:** If a `ref_substances` table already exists in Supabase with partial receptor data, check it first before hardcoding. If the data is there but not being read dynamically, wire the chart to the live data. If data is absent, seed these baseline values into the constants or a local data file — DO NOT fabricate values, use the above table which is derived from peer-reviewed pharmacology.

Add a `tooltip` annotation per receptor axis that one-liner explains what that receptor does:
- 5-HT2A: *"Psychedelic & mood effects"*
- 5-HT1A: *"Anxiolytic & antidepressant"*  
- D2: *"Dopamine — reward & mood"*
- NMDA: *"Dissociative — memory gating"*
- SERT: *"Serotonin reuptake — empathy/mood"*
- DAT: *"Dopamine reuptake — energy/focus"*
- NET: *"Norepinephrine reuptake — alertness"*
- Sigma-1: *"Neuroprotection & neuroplasticity"*

#### Step 2 — Wire the Chart to the Substance Selector
- When the user selects a different substance from the dropdown/tabs, the chart's data array must update reactively.
- Ensure the chart re-renders with an animation transition (e.g., morph the polygon shape) so the change is visually obvious — this is the "wow" moment for Dr. Allen.
- The selected substance name should appear as the chart title or legend.

#### Step 3 — Receptor Comparison Mode (if time permits — STRETCH GOAL)
Trevor mentioned a receptor comparison feature is already built. If accessible:
- Add a "Compare" toggle that allows selecting 2 substances and overlaying both profiles on the same spider graph (different colors, labeled).
- This is the feature Jason highlighted as "the stuff where practitioners start getting their minds blown."

---

## ACCEPTANCE CRITERIA
- [ ] Spider/radar graph updates dynamically when a different substance is selected
- [ ] Each substance has distinct, scientifically grounded receptor profile data
- [ ] Axis labels include tooltips explaining what each receptor does
- [ ] Chart animates/morphs on substance change (no jarring snap)
- [ ] STRETCH: 2-substance overlay comparison mode

## FILES LIKELY AFFECTED
- `src/components/SubstanceLibrary/` or equivalent
- Constants / data file for substance receptor profiles
- The Recharts or D3 radar chart component

## HANDOFF
When done: update `status: 04_QA`, `owner: INSPECTOR`, move to `_WORK_ORDERS/04_QA/`.
