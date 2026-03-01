---
id: WO-526
title: "Interaction Checker — Search Box Font Size + Result Flash Bug"
owner: LEAD
status: 00_INBOX
authored_by: CUE
priority: P1
created: 2026-02-28
failure_count: 0
related: WO-524
tags: [interaction-checker, bug, ux, font-size, flash]
---

# WO-526: Interaction Checker — Search Box Font Size + Result Flash Bug

## Source
Direct user work order delivered to CUE, 2026-02-28. Addendum to WO-524 (Unified Combobox).

---

## ⚠️ Dependency Note

WO-524 (Unified Combobox — currently in `05_USER_REVIEW`) replaces both selector components in `InteractionChecker.tsx`. LEAD must determine whether to:
- **Option A:** Apply these fixes to the *current* selectors (pre-WO-524 implementation)
- **Option B:** Carry these requirements forward into the WO-524 `ComboSelect` implementation and fix both at once

CUE recommends **Option B** to avoid double-touching the same file, but LEAD decides.

---

## User-Reported Issues (verbatim)

1. **Font size** — "Increase font size of text inside the search boxes"
2. **Result flash** — "Search results flash a different result before displaying actual results"

---

## Issue 1: Search Box Font Size

### Current State
The text inside both selector inputs in `InteractionChecker.tsx` is styled at a small size (likely `text-xs` or `text-sm`, approximately 12–13px). Substance names like "Psilocybin" and medication names appear too small relative to the large `h-16` input container.

### Desired State
Input text (both the placeholder and the selected value label) should be:
- Minimum `text-base` (16px) or `text-lg` (18px) — legible at arm's length
- Applied consistently to both the left (Primary Agent) and right (Secondary Agent) selectors
- Placeholder text should be `text-slate-500` at the same size
- Per `frontend-best-practices` SKILL: no text below `text-sm`. `text-base` preferred for interactive inputs.

### Files to Edit
- `src/pages/InteractionChecker.tsx` (current selectors, pre-WO-524)
- If WO-524 is live: `src/components/ui/ComboSelect.tsx`

---

## Issue 2: Search Result Flash Bug

### Current State
When a user selects an option from either dropdown in the Interaction Checker, the results panel briefly displays incorrect or stale data before rendering the correct interaction results. The flash appears to show a previous result set or a loading state that resolves within ~200–500ms.

### Root Cause Hypothesis
Likely a React state race condition: the interaction lookup is triggered on selection, but one of the two selected values (`primaryAgent` / `secondaryAgent`) may not yet be committed to state at the point the query fires. This causes the query to run with partial/stale state, rendering a wrong result momentarily before re-rendering with the correct values.

### Desired State
- Results panel must not render any result until **both** `primaryAgent` and `secondaryAgent` are selected and the query has completed
- If either value is null/empty, show the empty "Select both agents" placeholder — not a flash of a partial result
- Loading state (spinner or skeleton) should be shown between the moment of selection and the moment results return

### Files to Edit
- `src/pages/InteractionChecker.tsx` — interaction lookup `useEffect` or event handler
- Possibly `src/hooks/useInteractionLookup.ts` or equivalent hook if one exists

### QA Verification Steps
1. Select a primary agent
2. Select a secondary agent
3. Observe: results should go `empty → loading → final result` with no intermediate wrong result flash
4. Repeat 5 times with different agent pairs — zero flashes in all 5

---

## Acceptance Criteria

- [ ] Both selector input boxes display text at `text-base` (16px) minimum
- [ ] Placeholder text matches size and is `text-slate-500`
- [ ] No incorrect result flash occurs between agent selection and result render
- [ ] Results panel shows a loading state (spinner or skeleton) while query is in flight
- [ ] Results panel shows the empty/prompt state when fewer than 2 agents are selected
- [ ] Verified across 5 QA interaction pairs with zero flashes
- [ ] INSPECTOR sign-off required before LEAD closes ticket
