---
id: WO-581
title: Tooltip Sweep — Audit & Complete AdvancedTooltip Coverage Across Phase 1–3 Forms
owner: LEAD
status: 00_INBOX
priority: P2
created: 2026-03-09
source: Jason-Trevor Meeting 2026-03-09
---

## PRODDY PRD

> **Work Order:** WO-581 — Tooltip Sweep: AdvancedTooltip Coverage Audit  
> **Authored by:** INSPECTOR (expedited from meeting action items)  
> **Date:** 2026-03-09  
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement

The `AdvancedTooltip` component (`src/components/ui/AdvancedTooltip.tsx`) was implemented for Phase 2 vital signs fields and a subset of Phase 1 fields, but coverage is inconsistent. Many clinical fields across Phase 1–3 forms have no tooltip despite being non-obvious to practitioners (e.g., PCL-5 score interpretation, CADSS scale, contraindication codes). Missing tooltips increase call volume and reduce practitioner confidence at onboarding.

---

### 2. Target User + Job-To-Be-Done

The newly onboarded practitioner needs contextual, inline help text on every non-obvious clinical form field so they can complete documentation without leaving the form or consulting external references.

---

### 3. Success Metrics

1. Every field in Phase 1–3 forms that contains a clinical scale, score, or non-obvious term has an `AdvancedTooltip` — verified by a full-form audit checklist attached to this WO.
2. All tooltip content strings are ≤ 40 words and contain no em dashes (per WO-580 policy).
3. Zero tooltip components render with `content=""` (empty string) — caught by a grep scan pre-commit.

---

### 4. Feature Scope

#### ✅ In Scope

- Full audit of all form fields in: `phase-1-preparation/`, `phase-2-dosing/`, `phase-3-integration/`, and `arc-of-care-forms/shared/`.
- Add `AdvancedTooltip` (tier: `"micro"`) to every field lacking one that meets the tooltip criteria: clinical scale inputs, score fields, acronyms, unfamiliar clinical terminology.
- Verify existing tooltip content is accurate; flag any that contain em dashes for correction per WO-580.

#### ❌ Out of Scope

- Building or redesigning the `AdvancedTooltip` component itself
- Adding tooltips to admin or settings UI (Phase 4+)
- Tooltip translations (English only)

---

### 5. Priority Tier

**[x] P2** — Useful but deferrable  

**Reason:** Functional deficit, not blocking. Can ship after P0/P1 WOs in this sprint are cleared.

---

### 6. Open Questions for LEAD

1. Is there an approved clinical-copy reviewer who should sign off on tooltip content accuracy before merge?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated
- [x] Priority tier has a named reason
- [x] Open Questions list is ≤5 items
- [x] No code, SQL, or schema written anywhere in this document
