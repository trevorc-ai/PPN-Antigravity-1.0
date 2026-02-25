---
id: WO-403
title: "Global Command Palette (⌘K) — Design Spec"
status: 02_DESIGN
owner: DESIGNER
created: 2026-02-23
created_by: LEAD
failure_count: 0
priority: P2
tags: [search, command-palette, navigation, ux]
user_prompt: |
  "I love the command palette idea — that's exactly the suggestion I was searching for."
  Search intent examples from USER:
  - "ketamine treatments for PTSD"
  - "psychedelic therapy for chronic anxiety"
  - Clinical protocol discovery by substance + indication
---

# WO-403: Global Command Palette

## LEAD ARCHITECTURE

### What This Is
A floating overlay triggered by `⌘K` (Mac) / `Ctrl+K` (Windows/Linux) that opens from anywhere in the app. No dedicated page. No sidebar slot. It lives above the current view and dismisses with Escape or a click outside.

### What It Indexes (V1 scope — keep narrow)
1. **App routes** — page names + paths (Dashboard, Wellness Journey, Substance Library, Help, etc.)
2. **Substances** — from `ref_substances` (psilocybin, ketamine, MDMA, etc.) → navigates to `/monograph/:id`
3. **Help articles** — from the Help Library titles → navigates to `/help#section`

That's it for V1. Patient IDs stay in the Patient Select modal — they belong in the clinical flow, not a global search.

### What It Does NOT Do
- It does not search patient data (PHI risk)
- It does not query the database in real time
- It does not replace the Patient Select modal
- It is not a "search portal" page

### Technical Constraints for DESIGNER to note
- Keyboard: `⌘K` opens, `Escape` closes, `↑↓` navigates results, `Enter` selects
- Fuzzy match on substance names and route labels
- No Supabase query on keystroke — index is built at component mount from `ref_substances` cache (`vocabulary.ts`) and a static route manifest
- Accessible: `role="dialog"`, `aria-modal="true"`, focus trap inside overlay

---

## DESIGNER SPEC REQUIRED
1. Visual design: floating glass panel, centered, ~640px wide, appears with fade + scale animation
2. Input field at top: large, high contrast, placeholder "Search substances, pages, help..."
3. Results grouped by category: [Pages] [Substances] [Help]
4. Keyboard navigation highlight state (not color-only — also show `>` arrow or bold)
5. Empty state: "No results for [query]" with a subtle suggestion
6. Must meet WCAG 2.1 AA — all states text-labeled

## ROUTING
DESIGNER → BUILDER → INSPECTOR → 05_USER_REVIEW
