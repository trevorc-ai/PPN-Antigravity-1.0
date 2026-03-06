---
id: WO-545
title: "Site-Wide Heading Standardization — Enforce ppn-* Typography Classes"
status: 01_TRIAGE
priority: P2
created: 2026-03-05
owner: BUILDER
triggered_by: WO-531 (DataPolicy page heading audit)
---

## Problem Statement

The PPN Portal design system defines a complete typography hierarchy in `src/index.css` (lines 80–149) via `.ppn-page-title`, `.ppn-section-title`, `.ppn-card-title`, `.ppn-body`, `.ppn-label`, `.ppn-meta`, and `.ppn-caption`. These classes are the single source of truth for all heading and body text sizing, weight, and color.

However, many pages were built before this system was formalized and use raw ad-hoc Tailwind classes (`text-4xl font-black`, `text-2xl font-bold`, `text-xl font-black`, etc.) instead. This creates visual inconsistency across the site and makes future design system updates (e.g. changing the H1 size) require changes in every file rather than just `index.css`.

The `/#/data-policy` page (WO-531) was built correctly using the `ppn-*` classes and its headings were confirmed by Trevor as the site standard on 2026-03-05.

## Target User + Job-To-Be-Done

Internal: BUILDER, future contributors, and the design system.
Goal: Any developer writing a heading on any page should use `ppn-page-title` / `ppn-section-title` automatically, with zero ambiguity.

## Success Metrics

- [ ] All public-facing pages use `ppn-page-title` for H1, `ppn-section-title` for H2, `ppn-card-title` for H3
- [ ] Zero instances of ad-hoc `text-4xl font-black`, `text-3xl font-black`, `text-2xl font-bold`, `text-xl font-black` on heading elements in the pages listed below
- [ ] No visual regressions — headings should look identical after the swap (classes produce the same output as the ad-hoc Tailwind they replace)
- [ ] `frontend-best-practices` SKILL.md updated to note DataPolicy as the canonical reference

## Feature Scope

### Pages to Audit & Update (Priority Order)

| Page | File | Known Issues |
|---|---|---|
| Privacy & Anonymity Policy | `src/pages/PrivacyPolicy.tsx` | Uses `text-4xl font-black`, `text-xl font-black` directly |
| Terms of Service | `src/pages/TermsOfService.tsx` | Likely same pattern as PrivacyPolicy |
| Settings | `src/pages/Settings.tsx` | Mixed — some ppn-* already, some ad-hoc |
| Landing | `src/pages/Landing.tsx` | Marketing headings may be intentionally custom (BUILDER to flag if so) |
| Help / FAQ | `src/pages/HelpFAQ.tsx` | Likely ad-hoc |
| Checkout / Pricing | `src/pages/Checkout.tsx`, `src/pages/Pricing.tsx` | Audit |

> **BUILDER note:** If a heading is intentionally styled differently for marketing/branding reasons (e.g., hero gradient text on Landing), flag it rather than blindly swapping the class. Do not change gradient text headings without LEAD approval.

### Skill Update

Update `frontend-best-practices` SKILL.md to add:
- Note that `/#/data-policy` (`DataPolicy.tsx`) is the canonical reference implementation for public page heading conformance
- Add explicit example of the correct H1/H2/H3 pattern using `ppn-*` classes

## Reference Implementation

`src/pages/DataPolicy.tsx` (WO-531) — confirmed correct by Trevor 2026-03-05:

```tsx
<h1 className="ppn-page-title text-[#A8B5D1]">What We Collect</h1>
<h2 className="ppn-section-title text-[#A8B5D1] tracking-tight">{title}</h2>
<h3 className="ppn-card-title">{title}</h3>
<p className="ppn-body text-slate-400">{body}</p>
```

## CSS Definitions (Source of Truth)

`src/index.css` lines 80–149:

```css
.ppn-page-title    { font-size: 2.75rem; font-weight: 900; color: #A8B5D1; letter-spacing: -0.02em; }
.ppn-section-title { font-size: 1.875rem; font-weight: 900; color: #A8B5D1; letter-spacing: -0.01em; }
.ppn-card-title    { font-size: 1.25rem; font-weight: 800; color: #cbd5e1; }
.ppn-body          { font-size: 0.9375rem; font-weight: 400; line-height: 1.65; color: #A8B5D1; }
```

## Verification Plan

### Automated
```bash
# Grep for ad-hoc heading patterns after fix — should return zero results in page files:
grep -rn "text-4xl font-black\|text-3xl font-black\|text-2xl font-bold\|text-xl font-black" src/pages/
```

### Visual QA
- Browser tool: screenshot each updated page and confirm headings match `/#/data-policy` visual standard
- No font-size regressions (use browser DevTools to confirm computed size matches CSS definitions)
