# GO — Internal PAT Research Library
**Status:** BACKLOG
**Priority:** P2 — Platform Intelligence
**Filed by:** PRODDY
**Date:** 2026-03-24
**Category:** Product Intelligence / Neural Engine Depth

---

## Strategic Brief

PPN has accumulated a significant body of primary clinical research across ibogaine, MDMA, psilocybin, ketamine, and combination therapy modalities. This research currently lives in flat files in `admin_uploads/research/` and is not queryable, searchable, or surfaced to any of PPN's intelligence features.

A **PAT-specific internal Research Library** would convert this static document corpus into a live, queryable knowledge base that deepens three existing PPN systems:

1. **Interaction Checker** — when `ref_clinical_interactions` has no row for a substance+medication pair, the Neural Copilot can fall back to the library and surface relevant citations, instead of returning a generic "no rule found" response.

2. **NeuralCopilot / Floating AI** — currently responds generically. A curated PAT corpus gives the AI clinically specific, PPN-validated responses for the substances, dosing protocols, and instruments PPN actually handles.

3. **Download Center / Practitioner Resources** — the library surfaces as a curated reading list for practitioners — organized by substance, indication, and instrument — downloadable as a reference PDF alongside the session PDF reports.

---

## Current Research Assets (Known)

| Document | Substance | Source | Format |
|---|---|---|---|
| Hazards and Benefits of Psychedelic Medicine v5.8 | MDMA, Psilocybin, Ibogaine | Dr. Fernando Vega, MD (WA Medical Board) | .md |
| Ibogaine Research SaaS FRD | Ibogaine | Clinical FRD / Dr. Vega | .md |
| Ibogaine SaaS Layout UX Brief | Ibogaine | Dr. Vega / UX | .md |
| Interaction Checker source rules | Multi-substance | admin_uploads/research/Interactions | TBD |
| Session transcripts | Multi-substance | admin_uploads/research/sessions | TBD |
| Strategy docs | General | admin_uploads/research/strategy | TBD |
| Denver 2026 materials | TBD | admin_uploads/research/denver-2026 | TBD |

---

## Proposed Architecture

### Phase 1 — Corpus Organization (No UI)
- Standardize all research documents to a consistent Markdown schema with YAML frontmatter:
  ```yaml
  ---
  title: "Hazards and Benefits of Psychedelic Medicine"
  author: "Fernando Vega, MD"
  date: 2025
  substances: [ibogaine, mdma, psilocybin]
  indications: [OUD, PTSD, TBI, Parkinson's]
  instrument_references: [COWS, QTc, SARA]
  evidence_level: clinical_observation
  session_count: 600
  ---
  ```
- Store in `public/internal/admin_uploads/research/library/` (structured)
- Enable CI validation: any new document must include valid frontmatter before merge

### Phase 2 — Search Integration
- Extend the existing Search bar (`/catalog` and SimpleSearch.tsx) to query library document metadata
- Surface: document title, author, substance tags, indication tags — link to PDF or rendered view
- "Literature match" section alongside catalog results

### Phase 3 — Neural Engine Depth
- Feed library corpus into NeuralCopilot context for Ibogaine and substance-specific queries
- Interaction Checker: when `ref_clinical_interactions` returns null, NeuralCopilot queries the library and returns a citation-grounded narrative (not a data row)
- Tag responses with: "Based on: [Dr. Vega 2025] — Level: Clinical Observation"

### Phase 4 — Practitioner-Facing Resource Center
- New page: `/resources` or tab in Download Center ("Reference Library")
- Sortable by: substance, indication, evidence level, date
- Direct PDF download of source documents (where licensing permits)
- Practitioner-submitted case notes integration (future)

---

## Why Now

- Dr. Vega's materials are already uploaded and represent 600+ documented sessions
- The Ibogaine research initiative will produce additional structured documents (COWS, SARA specs, ASI scope)
- Every dollar invested in corpus organization now multiplies the intelligence of every search, every neural engine response, and every export that references published evidence
- This positions PPN as the **only clinical documentation platform with a built-in PAT research library** — a direct differentiator vs. generic EHR tools

---

## Estimated Effort

| Phase | Effort | Dependency |
|---|---|---|
| Phase 1: Corpus organization | 1–2 days (PRODDY/MARKETER) | Document schema decision |
| Phase 2: Search integration | 3–5 days (BUILDER) | Phase 1 complete |
| Phase 3: Neural engine | 5–8 days (BUILDER + AI integration) | Phase 2 + NeuralCopilot refactor |
| Phase 4: Resource page | 3–5 days (DESIGNER + BUILDER) | Phase 2 complete |

---

## Success Metrics
- Interaction Checker "no rule found" rate ↓ (library fallback fills gaps)
- NeuralCopilot citation accuracy ↑ (substance-specific responses with source attribution)
- Practitioner session-start time ↓ (pre-session references accessible without leaving PPN)
- Platform positioning: first PAT documentation platform with integrated clinical research library

---

*Filed by PRODDY | 2026-03-24*
