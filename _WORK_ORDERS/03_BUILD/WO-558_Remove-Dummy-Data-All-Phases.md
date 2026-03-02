---
id: WO-558
title: "P0 REPEAT: Remove Hardcoded Dummy Data from Phase 1, 2, and 3"
status: 03_BUILD
owner: BUILDER
created: 2026-03-01T19:54:27-08:00
failure_count: 0
priority: P0
authored_by: LEAD
source: "Phase2_3_Testing_Transcript.md lines 79-81, 213-215, 333-335"
escalation: "USER has requested this fix MULTIPLE times across multiple sessions. P0 — do not defer, do not bundle, do not block on other tickets. Ship this independently."
---

## LEAD ARCHITECTURE

### Context

⚠️ **REPEAT OFFENSE — P0 ESCALATION**

The user has requested removal of hardcoded dummy data across Phase 1, 2, and 3 in multiple prior sessions. It has never been shipped. This ticket exists only to fix this specific issue — nothing else belongs in this commit.

**The offending block appears on all 3 phase screens and contains:**
- "Total Improvement" — hardcoded percentage
- "MEQ-30 Score" — hardcoded number
- "Risk Level: High" — hardcoded string

These are not real-time calculated values. They are placeholder strings left from an early prototype. They are clinically misleading — a practitioner could misread "Risk Level: High" as a real system assessment.

### Architecture Decision

**Simple rule: find every instance and remove or replace.**

1. **Grep for the pattern.** Run: `grep -rn "Total Improvement\|MEQ-30 Score\|Risk Level.*High\|dummy\|placeholder" src/` to find all 3 instances across Phase 1, 2, 3 screens.

2. **Remove the hardcoded block entirely** if it contains no live data wiring. Do not replace with zeros or dashes — remove the container div and its children.

3. **Exception:** If any part of the block IS wired to live data (e.g., MEQ-30 score from a real query), keep that element but remove the hardcoded siblings. Document in BUILDER COMPLETE section what was wired vs. removed.

4. **If the container gives a meaningful section its structure**, replace the entire hardcoded stat block with a `PanelEmptyState` component (already in use in Phase 3) that says `"Outcome data will appear after the first completed Longitudinal Assessment."` This is honest and user-friendly.

5. **Do not redesign the surrounding layout.** Remove the dummy block in-place. The surrounding card/container can remain.

### Files Likely Touched

- `src/pages/WellnessJourney.tsx` — Phase 1 / Phase 2 / Phase 3 stat blocks
- `src/components/wellness-journey/DosingSessionPhase.tsx` — Phase 2 instance (if present)
- `src/components/wellness-journey/IntegrationPhase.tsx` — Phase 3 instance (if present)

Run the grep first — do not assume file locations.

---

## Acceptance Criteria

- [ ] `grep -rn "Total Improvement" src/` returns 0 results after this fix
- [ ] `grep -rn "Risk Level.*High\|risk.*level.*high" src/ -i` returns 0 results after this fix (case-insensitive)
- [ ] `grep -rn "MEQ-30 Score\|meq.*score" src/ -i` returns 0 hardcoded instances (live-wired instances are acceptable — must be documented)
- [ ] Phase 1 screen: no dummy stat block visible
- [ ] Phase 2 screen: no dummy stat block visible
- [ ] Phase 3 screen: no dummy stat block visible
- [ ] Any section that previously showed dummy data now shows either: (a) a labeled `PanelEmptyState` with honest placeholder text, or (b) nothing (container removed)
- [ ] No regressions — surrounding layout of each phase screen is intact
- [ ] TypeScript: `npx tsc --noEmit` = 0 errors
- [ ] BUILDER documents in BUILDER COMPLETE section: exact files changed, lines removed, whether any element was live-wired vs. hardcoded

---

## BUILDER IMPLEMENTATION COMPLETE

*(BUILDER to fill in this section when done)*

---

## INSPECTOR QA

*(To be completed in 04_QA after BUILDER handoff)*
