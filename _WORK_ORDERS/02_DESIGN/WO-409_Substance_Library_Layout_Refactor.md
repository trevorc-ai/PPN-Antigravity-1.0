---
id: WO-409
status: 02_DESIGN
owner: DESIGNER
priority: MEDIUM
failure_count: 0
created: 2026-02-23
source: Jason/Trevor Demo Debrief 2/23/26
demo_deadline: Dr. Allen demo (target Wednesday 2/25/26)
---

# WO-409 — Substance Library Layout Refactor (Accordion + Horizontal Hero)

## USER STORY (verbatim from demo)
> "The hero, this main section, is taking up way too much real estate. I had them horizontal but I'll tighten up this hero section so things are laid out horizontally."
> — Trevor, 01:22:13

> "Accordion menus. Yeah, I would — that was one of my feedback — there's too much scrolling going on. And people can get overwhelmed if you're not a scientist. I don't need to see what the molecular weight is. So make that an option for the nerds that want to dig down. But we should be able to fit all this on one screen — especially on a phone."
> — Jason, 01:22:55–01:23:10

> "They just do that [accordion] because that'll be the consistent format we'll use. People will inherently know what to do with it and it will enable us to load more data."
> — Jason, 01:23:30

## LEAD ARCHITECTURE

### The Problem
The Substance Library page currently stacks content vertically, creating excessive scroll distance. On mobile, it becomes 12+ pages of content. For a non-scientist user (or a doctor doing a quick reference mid-session), this is unusable.

### Design Goals
1. **Above the fold:** The substance selector + spider graph + key clinical summary should be visible without scrolling on desktop and tablet.
2. **Progressive disclosure:** Scientific data should be hidden behind accordions. Show the headline, hide the detail.
3. **Mobile-first:** Everything should work cleanly on a tablet (primary device scenario during a session).

---

## DESIGN SPEC

### Layout Structure

#### Hero Section (above fold)
Use a **2-column horizontal grid** on desktop/tablet:
- **Left column (40%):** Substance selector (dropdown or tabs for: Psilocybin, MDMA, Ketamine, LSD, Ayahuasca, Cannabis, Other). Key stats below: primary use, onset, duration, dosage range.
- **Right column (60%):** Receptor Affinity Spider Graph (large, prominent, animated).

Mobile: stack vertically — selector on top, graph below. Both should fit on one screen on a standard tablet.

#### Below the Fold — Accordion Layout
Replace all stacked scientific content sections with accordion panels. Each panel has:
- A clear **section header** with an expand/collapse chevron
- A one-sentence teaser visible in the collapsed state

Suggested accordion sections:
| # | Section Title | Collapsed Teaser |
|---|---------------|-----------------|
| 1 | Mechanism of Action | "How this substance works in the brain" |
| 2 | Receptor Binding Profile | "Detailed binding affinities by receptor type" |
| 3 | Pharmacokinetics | "Onset, peak, duration, half-life" |
| 4 | Clinical Applications | "Conditions this substance is studied for" |
| 5 | Safety & Contraindications | "Known interactions and risk flags" |
| 6 | Scientific References | "Peer-reviewed sources for this data" |
| 7 | Technical Data (for nerds) | "Molecular weight, formula, CAS number, etc." |

Section 7 ("Technical Data") is the home for molecular weight and other data that non-scientists can safely ignore.

### Interaction Details
- Only one accordion open at a time (collapse others on open) — this is the default, but optionally allow "expand all."
- Accordion open/close should animate smoothly (CSS height transition, 200ms).
- Accordions should have a subtle left border in the phase color to indicate category type (e.g., blue for clinical, amber for safety).
- On mobile, tap anywhere on the header row to expand.

### Typography & Visual Rules
- Section headers: minimum 14px, font-weight 600
- Teaser text: minimum 12px, muted color
- No color-only status indicators — use text labels AND icons together
- All data tooltips: minimum 12px

---

## DELIVERABLE
A design brief / Tailwind spec (or CSS class spec if not using Tailwind) that BUILDER can implement directly. Include:
- Grid breakpoints for hero section
- Accordion component structure and states (collapsed / expanded / hover)
- Mobile stacking behavior
- Spacing tokens

## HANDOFF
When done: update `status: 03_BUILD`, `owner: BUILDER`, move ticket to `_WORK_ORDERS/03_BUILD/`.
