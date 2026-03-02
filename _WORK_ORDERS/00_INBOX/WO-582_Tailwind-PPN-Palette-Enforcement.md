---
id: WO-582
title: "Tailwind Config — Restrict palette to PPN tokens only"
status: 00_INBOX
priority: P0
owner: LEAD
created: 2026-03-02
author: LEAD
tags: [design-system, tailwind, css, enforcement, mobile]
---

## Problem Statement

There is no `tailwind.config.js` (or `.ts`) in this repository. Tailwind is
running with its **full default palette** (every `slate-*`, `gray-*`, `zinc-*`,
`blue-*`, `green-*`, `red-*` variant). This is why builders consistently produce
components with arbitrary colors that deviate from the PPN design system —
ALL of those colors exist and work. There is no mechanism to prevent it.
Until this is fixed, every code review is a manual color hunt with no enforcement.

---

## Job-To-Be-Done

A BUILDER needs to write a component and have it be **impossible** to use a
color, font size, or spacing token that isn't in the PPN design system — not
because of a rule they might forget, but because the wrong class simply doesn't
exist in the build.

---

## Success Metrics

1. `tailwind.config.ts` exists with a restricted `theme.colors` that contains
   only PPN-named tokens — no default Tailwind color names remain.
2. After config is live, `className="bg-slate-900"` produces **no style output**
   (class is unknown, falls through silently).
3. Every component in `src/` passes a one-line audit: `grep -r "bg-slate\|bg-gray\|bg-zinc\|text-slate\|text-gray\|text-zinc" src/` returns zero results.

---

## Token Specification

The following are the **only** color tokens that must exist after migration.
All are derived from `src/index.css` defined values.

### Background tokens
| Tailwind class        | Hex value   | Usage                          |
|-----------------------|-------------|--------------------------------|
| `bg-ppn-base`         | `#0a1628`   | Page background (body)         |
| `bg-ppn-surface`      | `#0f1a2e`   | Card / panel surface           |
| `bg-ppn-elevated`     | `#162032`   | Elevated card, modal           |
| `bg-ppn-border`       | `#1e2d45`   | Borders, dividers              |
| `bg-ppn-hover`        | `#1a2740`   | Hover state backgrounds        |

### Text tokens
| Tailwind class        | Hex value   | Usage                          |
|-----------------------|-------------|--------------------------------|
| `text-ppn-primary`    | `#A8B5D1`   | Default body text              |
| `text-ppn-strong`     | `#cbd5e1`   | Card titles, emphasis          |
| `text-ppn-white`      | `#ffffff`   | Highest contrast               |
| `text-ppn-muted`      | `#94a3b8`   | Labels, secondary info         |
| `text-ppn-subtle`     | `#64748b`   | Timestamps, metadata (use sparingly — low contrast on dark) |

### Phase tokens (border + background variants)
| Tailwind class             | Hex / value           | Usage                    |
|----------------------------|-----------------------|--------------------------|
| `bg-phase1` / `text-phase1` / `border-phase1` | `#6366f1` | Phase 1 Preparation     |
| `bg-phase2` / `text-phase2` / `border-phase2` | `#f59e0b` | Phase 2 Dosing          |
| `bg-phase3` / `text-phase3` / `border-phase3` | `#14b8a6` | Phase 3 Integration     |

### Semantic tokens
| Tailwind class        | Hex value   | Usage                          |
|-----------------------|-------------|--------------------------------|
| `text-ppn-danger`     | `#ef4444`   | Adverse events, errors         |
| `text-ppn-warning`    | `#f59e0b`   | Caution states                 |
| `text-ppn-success`    | `#14b8a6`   | Completed, safe states         |
| `text-ppn-info`       | `#6366f1`   | Informational                  |
| `bg-ppn-focus`        | `#1e40af`   | Focus ring color               |

---

## Implementation — 3 Phases (DO NOT SKIP)

### Phase 1 — Create config (non-breaking, additive)
Create `tailwind.config.ts` that **extends** the default theme with PPN tokens.
At this stage default Tailwind colors still work — this is intentional.
Goal: make PPN tokens available. Run Vercel deploy. Verify nothing breaks.

### Phase 2 — Migrate all components
Run: `grep -rn "bg-slate\|bg-gray\|text-slate\|text-gray\|bg-zinc\|text-zinc\|bg-indigo\|bg-amber\|bg-teal\|bg-red\|bg-blue" src/ --include="*.tsx" -l`

For each file in the output, replace default Tailwind color classes with PPN
equivalents per the token table above. This is mechanical substitution —
no design decisions required. The mapping is 1:1.

**Key mappings BUILDER must follow:**

| Old class               | New class               |
|-------------------------|-------------------------|
| `bg-slate-900`          | `bg-ppn-surface`        |
| `bg-slate-800`          | `bg-ppn-elevated`       |
| `bg-[#0a1628]`          | `bg-ppn-base`           |
| `text-slate-400`        | `text-ppn-muted`        |
| `text-slate-300`        | `text-ppn-strong`       |
| `text-slate-500`        | `text-ppn-subtle`       |
| `text-white`            | `text-ppn-white`        |
| `border-slate-700`      | `border-ppn-border`     |
| `bg-indigo-600`         | `bg-phase1`             |
| `bg-amber-500`          | `bg-phase2`             |
| `bg-teal-500`           | `bg-phase3`             |

### Phase 3 — Remove defaults (enforcing)
In `tailwind.config.ts`, set `theme: { colors: { ...ppnTokens } }` (replace,
not extend). From this point, `bg-slate-900` produces no output.
Run full build, fix any remaining violations, deploy.

---

## Out of Scope

- SVG fill/stroke attributes (not Tailwind classes)
- CSS variables in `index.css` (already PPN-defined)
- Third-party component library colors (Recharts, etc.)
- Adding new color tokens not already in `index.css`

---

## Risk

**HIGH** — Phase 3 is the risky step. A missed class produces invisible text
or missing backgrounds. Non-negotiable: Phase 2 audit must achieve zero
grep results before Phase 3 executes. Two-strike rule applies.

---

## Priority Tier

**[x] P0** — This is the root cause of every repeated design system violation.
Every WO that corrects a color error is rework caused by this missing config.
This ticket stops the cycle permanently.

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated
- [x] Priority tier has a named reason
- [x] Open Questions list ≤5 items
- [x] No ambiguous instructions — Phase 1/2/3 sequence is explicit
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
