---
id: WO-516
title: "Interaction Checker — Remove Search Box Inside Medication Dropdown"
status: 00_INBOX
owner: PENDING
priority: P0
failure_count: 0
created: 2026-02-27
reporter: USER
---

## User Request (verbatim)

> "Interaction Checker has a search box inside the dropdown that needs to be removed"

## Problem Statement

The `MedDropdown` component at the top of `src/pages/InteractionChecker.tsx` (lines 32–153) renders a `<input type="text">` search field **inside** the dropdown panel (within the `{open && (...)}` block, lines 101–112). This was added for filtering but the user explicitly wants it removed.

The component also has associated logic that must be cleaned up alongside the search input:
- `const [search, setSearch] = useState('')` — state variable for the search term
- `const searchRef = useRef<HTMLInputElement>(null)` — ref for the search input
- The `useEffect` that auto-focuses `searchRef.current` when the dropdown opens (lines 63–68)
- All `setSearch('')` and `setSearch(e.target.value)` calls
- The `filtered` variable (`const filtered = search.trim() ? ... : medications`) — once search is removed, it always shows all medications and can be simplified
- The `{!search && (...)}` conditional wrapping the "clear/placeholder" option (line 119) — once search is gone, this condition should just render the clear option always

## Acceptance Criteria

1. **No `<input>` element** exists inside the `MedDropdown` dropdown panel.
2. All `search` state, `searchRef` ref, and search-related `useEffect` are **fully removed** — no dead code left.
3. The dropdown still opens/closes correctly on button click and closes on outside click and `Escape` key.
4. The full list of medications is always shown when the dropdown is open (no filtering).
5. The "clear/placeholder" option (first item in the list) is always visible — not gated behind `!search`.
6. The `filtered` variable is replaced by direct use of `medications` in the list render, or renamed `items` for clarity.
7. No other behavior of the `MedDropdown` or `InteractionChecker` page changes.

## Files in Scope

- `src/pages/InteractionChecker.tsx` — **only this file** (the `MedDropdown` component lives inline at the top)

## Out of Scope

- Do NOT touch `src/components/clinical/InteractionChecker.tsx` (different file — the embedded sub-component).
- Do NOT add any replacement search or filter mechanism.
- Do NOT change the substance dropdown (native `<select>` for psychedelics — that is untouched).
- Do NOT modify any other file.
