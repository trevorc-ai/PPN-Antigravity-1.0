# WO-556 — Interaction Checker: Surgical Refinements

**Page:** `src/pages/InteractionChecker.tsx`
**Priority:** Medium
**Assigned to:** LEAD (for triage)
**Status:** 01_TRIAGE
**Created:** 2026-03-06

---

## Scope

### 1. EXTEND "Primary Agent" dropdown to include Psilocybin
**Observed:** Screenshot shows Psilocybin IS visible in dropdown (it appears after "Other / Investigational" when scrolling), but is cut off at the bottom. The ref_substances query (line 60) pulls from DB — the issue is likely the dropdown list height is not scrollable.

**Fix:** Add `overflow-y: auto` / `max-h` to the dropdown options list container so all substances including Psilocybin are reachable without clipping.

**File:** `src/pages/InteractionChecker.tsx` — Primary Agent combobox (around line 328)

---

### 2. FORMAT (Mobile): "Contraindicated" text cut off on right
**Observed:** The result status label ("Contraindicated") overflows the card container on mobile.

**Root cause:** Result card has `overflow-hidden` (line 375). The heading text is large, bold, and unconstrained.

**Fix:** Allow the heading to wrap (`break-words` or `whitespace-normal`) or reduce font size at mobile breakpoints (`text-2xl sm:text-4xl`).

**File:** `src/pages/InteractionChecker.tsx` — result card heading (around line 375–385)

---

### 3. DELETE Filler text: "Protocol Sync Status / CI-6 // SECURE_NODE_0x7"
**Observed:** Bottom of result card shows a "Protocol Sync Status: ACTIVE" block and "Institutional Reference: CI-6 // SECURE_NODE_0x7" — placeholder/debug text that is not clinically meaningful.

**Fix:** Delete the entire section block containing these two items.

**File:** `src/pages/InteractionChecker.tsx` — lines 438–443 (approx)

---

### 4. RENAME "Print / Save Results" → "Export" + Refine PDF report
**Current:** Button label is "Print / Save Results" (line 396–397). PDF output uses raw browser print.

**Fix:**
- Rename button label to "Export"
- Before `window.print()`, set `document.title` to `PPN Interaction Report [yyyy-mm-dd]` and restore `afterprint`
- Review print styles (already in `<style>` block at line 260) — ensure result card renders cleanly on white background for print

**File:** `src/pages/InteractionChecker.tsx` — `handlePrint()` line 216, button lines 395–398

---

## Files
| File | Lines |
|------|-------|
| `src/pages/InteractionChecker.tsx` | ~216, ~328, ~375–385, ~396–398, ~438–443 |

## Verification
- Psilocybin visible and selectable without clipping
- "Contraindicated" fully visible on mobile (no overflow)
- Filler text section gone
- Button reads "Export", PDF filename matches `PPN Interaction Report [date]`
