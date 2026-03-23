==== PRODDY ====
---
owner: MARKETER
status: 00_BACKLOG
authored_by: PRODDY
priority: P1
created: 2026-03-06
epic_type: Growth_Marketing
target_audience: Multi-Segment
notebook_source: 
---

## PRODDY GROWTH EPIC

> **Epic Work Order:** WO-559 — Front Door Landing Page Suite
> **Epic Type:** Landing Page Variations

---

### 1. Unified Problem & Strategy
The PPN platform has a highly technical internal dashboard but lacks a clear, public-facing entry point ("Front Door") that communicates the value of the platform. Instead of building 5 totally distinct pages (which burns engineering tokens), we are building ONE highly optimized React component layout and using MARKETER to generate 5 distinct copy variations targeted at different audiences.

---

### 2. Global Success Metrics
1. Reduce token bloat by using a single React Blueprint layout for all 5 variations.
2. All 5 variations pass the `marketing-qa-checklist` (SEO + JSON-LD).
3. Increase verified practitioner signups via optimized CTAs.

---

### 3. Variations (Content Matrix Requirements)

> **⚠️ STRATEGY AUDIT 2026-03-22:** Variations 2, 3, 4, and 5 are **CANCELLED** per the Denver launch strategy review. Only Variation 1 (Clinical) survives as the enterprise ICP. Files for Variations 2–5 moved to `_GROWTH_ORDERS/07_ARCHIVED/`. Do not regenerate them.

*   **Variation 1: Clinical Audience (Practitioners / Therapists)** ✅ **KEEP — BUILT**
    *   Goal: Emphasize zero-PHI, peer benchmarking, and clinical UX. Drive "Join Network" clicks.
    *   Status: `IMPLEMENTED` — `src/pages/ForClinicians.tsx`
    *   Strategy note: *"This is your core ICP. The messaging is sharp and aligns perfectly with the $3,000 enterprise pitch."*
*   **Variation 2: Insurance / Payor Audience** ~~`00_BACKLOG`~~ **CANCELLED — Defer to Wave 2**
*   **Variation 3: Privacy Shield Audience** ~~`00_BACKLOG`~~ **CANCELLED — Grey-market targeting is brand risk**
*   **Variation 4: Global Intelligence Audience (Researchers)** ~~`00_BACKLOG`~~ **CANCELLED — Academic buyers are Wave 2**
*   **Variation 5: Curious Patient (Self-Reporter)** ~~`00_BACKLOG`~~ **CANCELLED — B2C self-report pollutes clinical database**

---

### 4. Implementation Fast-Lane Flags
- [ ] Pure Content (Fast-Lane): Bypasses visual design phases. Route from 02_USER_REVIEW directly to 05_IMPLEMENTATION.
- [x] New Layout/Component: Requires 03_MOCKUP_SANDBOX and 04_VISUAL_REVIEW before core integration. (Only needed for the first variation. Variations 2-5 will reuse the blueprint.)

---

### PRODDY Sign-Off Checklist
- [x] Epic strategy is clearly defined.
- [x] Variations are listed as distinct deliverables.
- [x] NotebookLM sources (if any) are linked.
- [x] Frontmatter updated correctly.

==== PRODDY ====
