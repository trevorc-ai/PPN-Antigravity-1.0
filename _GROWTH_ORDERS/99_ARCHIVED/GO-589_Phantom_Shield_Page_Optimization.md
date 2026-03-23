==== PRODDY ====
---
owner: MARKETER
status: 00_BACKLOG
authored_by: PRODDY
priority: P1
created: 2026-03-09
epic_type: Growth_Marketing
target_audience: Independent Practitioners / Grey-Market Facilitators
notebook_source: WO-588_Phantom_Shield_Mobile_Optimization.md
---

## PRODDY GROWTH EPIC

> **Epic Work Order:** GO-589 — Phantom Shield Page: Mobile Optimization + Cognitive Load Reduction
> **Epic Type:** Partner Asset Optimization (Single Page, Two-Track)

---

### 1. Unified Problem & Strategy

`/public/phantom-shield.html` is the primary share artifact for the Phantom Shield partner acquisition funnel. It is being delivered directly via the trevor-showcase.html share tool and opens on mobile by default (confirmed: 500px viewport, 5,864px scroll depth — 11x scroll). The page fails on two dimensions: (1) desktop-only grid layouts cause horizontal overflow and cramped text at mobile widths, and (2) the page delivers wall-to-wall dense prose across every section with zero visual relief, causing cognitive overload that prevents practitioners from absorbing the value proposition. This is a conversion-critical asset being used in active outreach right now.

---

### 2. Global Success Metrics

1. Page renders without horizontal scroll or overflow at 375px viewport (iPhone SE baseline) — verified via browser devtools device emulation.
2. A cold reviewer on mobile can identify all 7 Phantom Shield protection layers within 60 seconds — validated by internal 3-person usability test.
3. All 6 inline visual break graphics render correctly at both 375px and 1024px viewports with no layout breakage.

---

### 3. Deliverables (Serial Processing Required)

*MARKETER RULE: Process SERIALLY. Deliver Variation 1 content matrix first, request USER review, then proceed to Variation 2.*

- **Track A: Mobile Responsiveness Audit + Fix**
    - Goal: Zero horizontal overflow at 375px. All grids collapse correctly. Touch targets ≥ 44px. Protection Matrix table converts to card-stack on mobile.
    - Deliverable: MARKETER produces a full markup and CSS specification for the `@media (max-width: 640px)` override block. BUILDER implements.
    - Status: `00_BACKLOG`

- **Track B: Inline Visual Breaks (6 SVG Mini-Graphics)**
    - Goal: Strategic visual chunking at 6 key locations to reduce cognitive load and increase scroll momentum.
    - Deliverable: MARKETER produces copy brief and design intent for each graphic placement. BUILDER authors inline SVGs using existing CSS color tokens.
    - Status: `00_BACKLOG`

    | # | Placement | Graphic Concept |
    |---|---|---|
    | 1 | Between Problem Options → Features header | 3-paths branching outcome strip (A/B/C) |
    | 2 | Before Zero-PHI card | Data vault diagram: name → Subject_ID |
    | 3 | Before Blind Vetting card | Hash flow: phone → hash → check → ✓/✗ |
    | 4 | Before Potency Normalizer card | Dose math equation panel |
    | 5 | Before Crisis Logger card | Timestamp log mini-UI mockup |
    | 6 | Above Protection Matrix table | Concentric shield-layers diagram (7 labels) |

---

### 4. Implementation Fast-Lane Flags

- [ ] Pure Content (Fast-Lane): Bypasses visual design phases. Route from 02_USER_REVIEW directly to 05_IMPLEMENTATION.
- [x] New Layout/Component: Track B (inline SVGs) requires 03_MOCKUP_SANDBOX and 04_VISUAL_REVIEW before implementation. Track A (mobile CSS) may fast-lane from 02_USER_REVIEW to 05_IMPLEMENTATION once content matrix is approved.

---

### 5. Open Questions for MARKETER

1. Should the 6 SVG visual breaks carry short 1-line caption text beneath them, or remain purely visual (aria-hidden)?
2. Is there a maximum file-size budget for the page (KB) given it is shared as a direct file link, not a CDN asset?

---

### PRODDY Sign-Off Checklist

- [x] Epic strategy is clearly defined.
- [x] Deliverables are listed as distinct, serially-processed tracks.
- [x] Source work order (WO-588) is linked in notebook_source.
- [x] Frontmatter updated: `owner: MARKETER`, `status: 00_BACKLOG`.
- [x] Fast-Lane flag correctly set (Track A fast-lane eligible; Track B requires visual review).
- [x] No code, SQL, or schema written in this document.

==== PRODDY ====
