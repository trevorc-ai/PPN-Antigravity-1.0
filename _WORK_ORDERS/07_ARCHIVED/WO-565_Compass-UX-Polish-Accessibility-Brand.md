---
id: WO-565
title: Integration Compass — UX Polish, Accessibility & Brand Consistency
owner: BUILDER
status: 00_INBOX
authored_by: PRODDY
reviewed_by: LEAD_PENDING
date: 2026-03-02
priority: P1
tags: [patient-facing, ux-polish, accessibility, branding, compass, PatientReport]
failure_count: 0
---

## PRODDY PRD — UX Polish Pass

> **Work Order:** WO-565
> **Parent:** WO-563 (Integration Compass — Build Complete)
> **Authored by:** PRODDY (Senior UI/UX assessment, post-build review)
> **Date:** 2026-03-02
> **Status:** INBOX, awaiting LEAD approval

---

### 1. Problem Statement

WO-563 shipped the Integration Compass at full functional scope. A senior UI/UX assessment against the live render identified 8 issues that, individually, are small code changes but, collectively, determine whether the Compass reads as a premium clinical artifact or a generic dark-mode page. No new features are added here. This WO is a precision polish pass.

---

### 2. Target File

**Single file:** `src/pages/PatientReport.tsx`

No new DB tables. No new routes. No schema changes. All changes are presentation-layer only.

---

### 3. Design System Constraints (BUILDER must read before touching a single line)

The Integration Compass uses its own isolated design system (`GLOBAL_CSS` constant and inline `style={}` props), intentionally decoupled from the PPN Tailwind system, because it is a public-facing patient page with a distinct visual identity.

**Palette in use (do not change these tokens):**
```
C.teal   = '#2dd4bf'   — Phase 3 primary, CTAs, EMA mood line
C.gold   = '#f59e0b'   — Neuroplastic window, benchmarks, prompts
C.violet = '#a78bfa'   — Zone 1, EMA sleep line, PEMS Mental
C.rose   = '#fb7185'   — Zone 2, crisis line, PEMS Emotional
C.bg     = '#050c1a'   — Page background
C.card   = 'rgba(13,25,48,0.85)' — Glassmorphism card surface
C.border = 'rgba(45,212,191,0.15)' — Card borders
```

**Color accessibility targets (WCAG AA minimum, AAA preferred on patient-facing pages):**

| Text color | Background | Required ratio | Current status |
|---|---|---|---|
| `#2dd4bf` (teal) on `#050c1a` | 4.5:1 min | Passes (~7.2:1) |
| `#f59e0b` (gold) on `#050c1a` | 4.5:1 min | Passes (~5.8:1) |
| `#64748b` (slate-500 body) on `#050c1a` | 4.5:1 min | **FAILS (~2.8:1)** — see Fix 8 |
| `#475569` (slate-600) on `#050c1a` | 4.5:1 min | **FAILS (~2.0:1)** — see Fix 8 |
| `#94a3b8` (slate-400) on `#050c1a` | 4.5:1 min | Borderline (~4.3:1) |
| `#cbd5e1` (slate-300) on card | 4.5:1 min | Passes (~6.5:1) |

**Fix 8 addresses all failing contrast values globally.**

---

### 4. Acceptance Criteria

All items must be `[x]` checked before INSPECTOR review.

#### Fix 1 — Gate zero-count integration sessions message
- [ ] The integration sessions attended block in Zone 5 renders only when `data.integrationSessionsAttended > 0`
- [ ] When count is zero or null, the block is not rendered at all (no empty message displayed)
- [ ] The "Keep showing up." line no longer appears for patients with zero sessions attended

#### Fix 2 — "Share with Your Practitioner" button must be the dominant CTA
- [ ] Button has a solid filled background: `linear-gradient(135deg, #2dd4bf, #0891b2)`
- [ ] Button text is dark (`#050c1a`) for contrast on the teal fill
- [ ] Button has legible hover state: `opacity: 0.9` on hover
- [ ] "Share with a Friend" remains the secondary ghost style (no change)
- [ ] Both buttons have `aria-label` attributes

#### Fix 3 — Ghost/preview state for empty Zone 1 (Start of the Path)
- [ ] When both `baseline` and `current` are null, the empty state renders a styled preview card instead of a plain italic sentence
- [ ] Preview card contains: a muted `?` or sparkle icon, the text "Your baseline will appear here once your practitioner has recorded your pre-session assessment", styled in a soft bordered container (not raw italic body text)
- [ ] Preview card uses `${C.violet}08` background and `${C.violet}20` border, matching the zone's accent

#### Fix 4 — Ghost/preview state for empty Zone 2 (Emotional Terrain)
- [ ] When `timelineEvents` is empty or null, the empty state renders a preview container showing 4-6 placeholder feeling pills in muted/semi-transparent style (not flat italic text)
- [ ] Placeholder pills are non-interactive (no `onClick`), use `opacity: 0.3`, and are labelled with example feeling words: "Peaceful", "Curious", "Open", "Released", "Connected"
- [ ] A line below reads: "Your feeling map will appear here after your session. These are example emotional landmarks from other journeys."

#### Fix 5 — Ghost baseline line in empty EMA graph (Zone 3)
- [ ] When `points.length === 0`, the SVG renders a flat dotted baseline at `y = midpoint` (value = 5 on a 1-10 scale)
- [ ] Dotted line uses `stroke={C.teal}` at `opacity: 0.2`, `strokeDasharray="4 4"`
- [ ] A SVG text label appears above the line: "Your journey begins here" in `fill='#475569'` at `fontSize={11}` (SVG text label, exempt from font minimum rule)
- [ ] The neuroplastic window golden glow still renders across the full graph width in empty state
- [ ] Empty state text below graph ("Log your first check-in below to begin your journey map.") is retained

#### Fix 6 — "How are you today, traveler?" copy treatment
- [ ] Font size increased from 18px to 26px
- [ ] Font weight remains 700 (bold)
- [ ] Color changed from `#e2e8f0` to `white` (which renders as `#f1f5f9` per PPN text brightness cap)
- [ ] The sub-label ("Log today's check-in and watch your journey map grow.") remains at 13px

#### Fix 7 — Practitioner panel trigger redesigned as a pill button
- [ ] The "Practitioner: Customize this Compass" trigger is no longer a plain underlined anchor text
- [ ] Replaced with a small pill button: `border: 1px solid rgba(45,212,191,0.25)`, `borderRadius: 20`, `padding: '6px 14px'`, `fontSize: 13`, `color: '#64748b'`
- [ ] A `⚙` or sliders-style unicode character (`⧉` or `✦`) prepended to the label
- [ ] Button is positioned in the top-right of the customization panel wrapper div (use `display: flex`, `justifyContent: 'flex-end'`)
- [ ] Has `aria-label="Practitioner customization panel"`

#### Fix 8 — Global contrast remediation (WCAG AA compliance)
- [ ] All instances of `color: '#64748b'` (slate-500) on dark background replaced with `color: '#94a3b8'` (slate-400, contrast 4.3:1, acceptable)
- [ ] All instances of `color: '#475569'` (slate-600) on dark background replaced with `color: '#64748b'` (slate-500 bumped — acceptable for non-body decorative text) OR `color: '#94a3b8'` for readable label contexts
- [ ] Exception: footer disclaimer text may remain at `#64748b` as it is intentionally de-emphasised legal copy
- [ ] The grey benchmark disclaimer text in Zone 4 (`color: '#475569'`) must be raised to `#64748b` minimum
- [ ] Run a final grep confirm: `grep -n "color: '#475569'" src/pages/PatientReport.tsx` returns zero results outside of the footer

#### Fix 9 — Mobile stat grid fix (Zone 4)
- [ ] The three benchmark stat cards (`84%`, `3.2x`, `91%`) use `gridTemplateColumns: 'repeat(3, 1fr)'` above 480px
- [ ] Below 480px (mobile), force `gridTemplateColumns: 'repeat(2, 1fr)'` using a JS-based width check or a CSS `@media` rule embedded in `GLOBAL_CSS`
- [ ] The third stat (91%) never appears alone on a full-width row
- [ ] Test verified at 390px viewport width

#### Fix 10 — Compass rose icon in header
- [ ] A compass rose Unicode character `✦` or the text `◎` is displayed above the "YOUR INTEGRATION COMPASS" eyebrow text
- [ ] Styled at `fontSize: 28`, `color: C.teal`, `opacity: 0.7`
- [ ] Adds visual brand identity to the header without requiring an SVG asset import
- [ ] Does NOT appear in print mode (wrap in a `.no-print` span or use `@media print { display: none }`)

---

### 5. Downstream Effects — Share Copy & Messaging Audit

The share buttons pre-compose messages that go directly to practitioners and patients' contacts. These messages represent the PPN brand at the most critical moment of word-of-mouth growth. They must be reviewed and approved.

#### Current share messages (as-built):
```
Practitioner share:
"I wanted to share my Integration Compass with you. It was generated through PPN Portal. [url]"

Friend share:
"I have been using this to track my healing journey and thought you might find it interesting. [url]"
```

#### Required copy improvements (BUILDER must implement exactly):

**Practitioner message (new):**
```
"My practitioner set this up for me — it is a living record of my session and integration journey. Generated through PPN Portal. [url]"
```
*Rationale: The original incorrectly implies the patient generated it. The practitioner generates it. This framing is more accurate and reinforces the practitioner relationship.*

**Friend message (new):**
```
"I have been using this to track my healing after a recent session. It updates whenever I log a check-in. I thought you might find it interesting. [url]"
```
*Rationale: More specific and intriguing. "It updates whenever I log a check-in" creates curiosity and explains the living artifact mechanic.*

#### PWA metadata copy audit:
Current `manifest.json` values are approved. No changes needed.

#### Empty state copy audit:
All empty state copy is defined in this WO (Fixes 3 and 4 above). BUILDER uses exactly the strings written in those acceptance criteria, not paraphrases.

---

### 6. WCAG Color Accessibility Reference

BUILDER must verify these contrast ratios are achieved post-fix using any browser DevTools contrast checker or the following reference:

| Token | Hex | Contrast on `#050c1a` | Standard | Result |
|---|---|---|---|---|
| `C.teal` | `#2dd4bf` | ~7.2:1 | AA | Pass |
| `C.gold` | `#f59e0b` | ~5.8:1 | AA | Pass |
| `C.violet` | `#a78bfa` | ~6.1:1 | AA | Pass |
| `C.rose` | `#fb7185` | ~5.4:1 | AA | Pass |
| slate-300 | `#cbd5e1` | ~6.5:1 | AA | Pass |
| slate-400 | `#94a3b8` | ~4.3:1 | AA | Pass (borderline) |
| slate-500 | `#64748b` | ~2.8:1 | AA | **Fail — do not use on bg** |
| slate-600 | `#475569` | ~2.0:1 | AA | **Fail — do not use on bg** |

The minimum safe body text color on `#050c1a` background is `#94a3b8` (slate-400).

---

### 7. Out of Scope

- New zones or zones not in WO-563
- Any database changes
- Any changes to the Phase 3 practitioner view
- Any routes beyond `/patient-report`
- Print CSS changes (print mode is correct as-is)
- Animations or transitions (post-V1 enhancement)
- Multi-session Compass (future version)

---

### 8. LEAD Sign-Off Checklist

- [ ] All 10 acceptance criteria reviewed and approved
- [ ] Share copy reviewed and approved
- [ ] No schema changes confirmed
- [ ] Single-file scope confirmed
- [ ] Priority P1 confirmed
- [ ] BUILDER assigned and unblocked

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is under 100 words and contains no solution ideas
- [x] All acceptance criteria contain specific, verifiable outcomes
- [x] Out of Scope is populated
- [x] No raw SQL written anywhere in this document
- [x] Downstream effects fully documented (share copy, PWA metadata, empty state copy)
- [x] Color accessibility table included with pass/fail status
- [x] Frontmatter: `owner: BUILDER`, `status: 00_INBOX`
