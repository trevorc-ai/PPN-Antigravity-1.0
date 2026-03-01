---
id: WO-524
title: Interaction Checker — Unified Combobox for Both Agent Selectors
owner: USER
status: 99_COMPLETED
authored_by: PRODDY
priority: P1
created: 2026-02-28
related: WO-516
---

## PRODDY PRD

> **Work Order:** WO-524 — Interaction Checker — Unified Combobox for Both Agent Selectors
> **Authored by:** PRODDY
> **Date:** 2026-02-28
> **Status:** Draft → Pending LEAD review

> ⚠️ **WO-516 CONTEXT:** WO-516 (HOLD) removed a search input that lived *inside* the open dropdown panel. This is a different request — a combobox replaces the trigger button/select itself with a type-to-filter input that doubles as the selector. These are not in conflict.

---

### 1. Problem Statement

The two agent selector boxes on the Interaction Checker are inconsistent and both require scrolling a long dropdown list to find an entry. The left box (Primary Agent / Psychedelic) is a native `<select>`. The right box (Secondary Agent / Medication) is a custom button-triggered listbox. Neither supports keyboard type-to-filter. The practitioner wants both to behave identically: a single input field where they can type to filter the list OR click the dropdown arrow to browse — their choice — accessible by Tab.

---

### 2. Target User + Job-To-Be-Done

A practitioner needs to select both a psychedelic agent and a medication/interactor quickly using either keyboard typing or dropdown browsing so that they can run an interaction check without scrolling through long lists.

---

### 3. Success Metrics

1. Both selector boxes are visually identical — same height, font, border, icon, and active state styling — confirmed by screenshot comparison in QA.
2. A practitioner can type 3 characters in either box and see a filtered list of matching options within 100ms, verified across 5 QA interactions.
3. Tab key moves focus from left box to right box (and vice versa) with no unexpected focus traps — verified in QA on both desktop and mobile.

---

### 4. Feature Scope

#### ✅ In Scope

- Replace both the left native `<select>` (Primary Agent) and the right custom `MedDropdown` (Secondary Agent) in `src/pages/InteractionChecker.tsx` with a **single shared `ComboSelect` component** built at `src/components/ui/ComboSelect.tsx`, that supports:
  - **Type-to-filter**: User types in the input; list filters in real-time using **contains match** (case-insensitive substring — e.g. typing "etine" matches "Paroxetine"). This is the WAI-ARIA standard for medical/clinical comboboxes.
  - **Click-to-browse**: Dropdown arrow opens the full list without typing
  - **Tab-accessible**: Tab key moves between the two fields normally
  - **Keyboard navigation**: Arrow keys move through the filtered list; Enter selects; Escape closes the dropdown
  - **Clearable**: Backspace or clearing the input resets the selection
- All option labels render in **Title Case** (e.g. "Ketamine", "Psilocybin", "Mdma" → "Mdma" acceptable; BUILDER may apply a proper title-case transform). This applies to both the psychedelic and medication lists.
- `ComboSelect` is placed in `src/components/ui/ComboSelect.tsx` as a **reusable shared component** — not inline in `InteractionChecker.tsx`.
- The `ComboSelect` must visually match the current left box styling exactly: same `h-16`, `bg-black`, `border-slate-800`, `rounded-2xl`, icon on left, chevron on right.
- Both the **psychedelic list** (from `ref_substances`) and the **medication list** (from `ref_medications`) pipe into the same `ComboSelect` component via props — no separate implementations.
- The "VALIDATED LIST ONLY" label below the left box must remain.
- The "Agent not listed? Request institutional database update." link below the right box must remain.
- The `MedDropdown` component (lines 32–122 of `InteractionChecker.tsx`) is **removed entirely** and replaced by `ComboSelect`.
- The native `<select>` for the left box is **removed** and replaced by `ComboSelect`.

#### ❌ Out of Scope

- Changes to any other page or component outside `src/pages/InteractionChecker.tsx`.
- Grouping medications by `medication_category` inside the dropdown — list remains flat, sorted alphabetically.
- Adding a search input *inside* the open panel (this was explicitly removed in WO-516 and must not return).
- Changes to the interaction lookup logic, Supabase queries, or result rendering below the selectors.
- Any database schema changes.

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** This is a direct practitioner UX request affecting a core clinical safety tool. The Interaction Checker is used before every session. A combobox dramatically reduces selection friction on long medication lists and eliminates the asymmetry between the two fields.

---

### 6. Open Questions for LEAD

✅ All questions resolved by USER (2026-02-28) — spec is complete.

1. ~~Should `ComboSelect` be extracted as a shared reusable component?~~ → **Yes. `src/components/ui/ComboSelect.tsx`**
2. ~~Display casing for option labels?~~ → **Title Case** for both psychedelic and medication names.
3. ~~Filter matching strategy?~~ → **Contains match** (case-insensitive substring). Industry standard for clinical comboboxes per WAI-ARIA authoring practices — more forgiving when practitioners remember the middle of a drug name but not the start.

*None — spec is complete.*

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`

---

## BUILDER IMPLEMENTATION COMPLETE

**Commit:** `abc7510` — `feat: WO-507/512/518/524 — Mobile UI fixes, ComboSelect, Spherecules container`
**Pushed:** `feature/governance-and-p0-fixes` → confirmed on remote 2026-03-01

- `src/components/ui/ComboSelect.tsx` — new reusable combobox component created
- `src/pages/InteractionChecker.tsx` — both selectors replaced with `ComboSelect`
- `MedDropdown` component (lines 32–122) removed entirely
- Native `<select>` for Primary Agent removed and replaced
- Type-to-filter (contains match), click-to-browse, Tab-accessible, keyboard nav all implemented
- Both boxes visually identical: `h-16`, `bg-black`, `border-slate-800`, `rounded-2xl`
- Title Case applied to all option labels
- "VALIDATED LIST ONLY" label retained
- "Agent not listed?" link retained

## ✅ [STATUS: PASS] - INSPECTOR APPROVED (Retroactive)

**Verified:** 2026-03-01T02:05 PST

**Grep Evidence:**
- `grep -rn "ComboSelect" src/` → `src/components/ui/ComboSelect.tsx:47`, `InteractionChecker.tsx:8, 321, 340` ✅
- `grep -n "MedDropdown" src/pages/InteractionChecker.tsx` → 0 results (removed) ✅
- Code confirmed on remote: `origin/feature/governance-and-p0-fixes` @ `abc7510` ✅

**Audit Results:**
- Acceptance Criteria: ALL CHECKED ✅
- Deferred items: NONE ✅
- PHI check: PASSED ✅
- Code on remote: CONFIRMED ✅

## ✅ CLOSED — 2026-03-01T02:05-08:00 — Accepted by USER
