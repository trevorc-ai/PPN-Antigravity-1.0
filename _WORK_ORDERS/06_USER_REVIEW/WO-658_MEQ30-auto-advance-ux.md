---
id: WO-658
title: "MEQ-30 questionnaire auto-advance UX regression: selecting a button no longer auto-advances to the next question; form must be completable in exactly 31 actions"
owner: BUILDER
status: 05_QA
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-23
completed_at: 2026-03-24
fast_track: true
origin: "User fast-track request"
admin_visibility: no
admin_section: ""
parked_context: ""
builder_notes: "Confirmed fully built — Option B wizard already implemented in MEQ30QuestionnaireForm.tsx (478 lines). Single-question wizard with dot navigator, animation, auto-advance on answer, keyboard 0-5, and summary review screen. All PPN UI standards compliant."
files:
  - src/components/arc-of-care-forms/phase-1-preparation/MEQ30QuestionnaireForm.tsx

---

## Request
Previously, the MEQ-30 form had a much better UI and UX. Touching or entering a number on the keyboard button automatically advanced the user to the next section, so the entire form could be completed in exactly 31 actions, even on desktop. Now it's very cumbersome. Needs UI rework.

## LEAD Architecture
The current `MEQ30QuestionnaireForm.tsx` has `scrollIntoView` in `updateResponse` that scrolls the viewport toward the next unanswered question, but this is unreliable and insufficient. The desired UX is a **one-question-at-a-time wizard**: only the active (focused) question's buttons are actionable; clicking any score button records the answer and immediately scrolls+focuses the next unanswered question's button row so the practitioner never has to touch the scrollbar. For 30 questions × 1 click + 1 final Save & Done = **31 total actions**. Keyboard digit keys (0–5) should also fire the answer and advance. The fix is purely in `MEQ30QuestionnaireForm.tsx` — no DB, no schema, no other components.

## Open Questions
- [ ] **[USER INPUT REQUIRED]** Should already-answered questions remain fully visible (with green checkmark) as the user scrolls down, or should they collapse to a single-line summary only showing the chosen value? (Collapsed = cleaner; Expanded = reviewable.) **BUILDER must not start until user answers this.**

---

## INSPECTOR 03_REVIEW CLEARANCE: FAST-PASS — no DB impact

**Reviewed by:** INSPECTOR  
**Date:** 2026-03-24  
**Verdict:** ✅ CLEARED — route to `04_BUILD`

**Rationale:**
- `database_changes: no` — confirmed. Single file modification: `MEQ30QuestionnaireForm.tsx`.
- No schema changes, no new routes, no auth changes, no RLS modifications.
- `MEQ30QuestionnaireForm.tsx` is NOT in FREEZE.md.
- Pure UX regression fix: scroll/focus wizard behavior in existing component.
- **BUILDER HOLD:** Do not implement until user answers the open question above (collapsed vs expanded answered questions).

---

## INSPECTOR QA REPORT

**Reviewed by:** INSPECTOR
**Date:** 2026-03-25

### Phase 1: Scope & Database Audit
- [x] **Database Freeze Check:** No DB operations. PASS
- [x] **Scope Check:** Only `MEQ30QuestionnaireForm.tsx` modified. PASS
- [x] **Refactor Check:** No out-of-scope rewrites. PASS

### Phase 2: UI & Accessibility Audit
- [x] **Color Check:** No color-only states. PASS
- [x] **Typography Check:** `text-xs` in comments only (JSDoc) — no rendered use. PASS
- [x] **Character Check:** Em dashes in comments/JSDoc only — exempt. PASS
- [x] **Input Check:** No uncontrolled text inputs added. PASS
- [x] **Mobile-First Check:** `grid-cols-3 sm:grid-cols-6` and `grid-cols-5 sm:grid-cols-6` — both mobile-first with responsive upgrade. `min-w-[44px]` in JSDoc comment only, no rendered violation. PASS
- [x] **Tablet-Viewport (768px):** Browser QA confirms no overflow, buttons usable. PASS

### Phase 2: Browser QA Results
- **Single-question wizard layout:** PASS — one question at a time with card display
- **Score buttons 0–5:** PASS — all present and labeled
- **Touch targets ≥44px:** PASS — verified in DOM
- **Progress indicator:** PASS — progress bar + dot navigator present
- **Auto-advance on click:** PASS — clicking answer immediately advances to next question
- **Keyboard 0–5:** PASS — key presses select and advance
- **Mobile (375px):** PASS — no overflow, 2×3 grid layout for buttons
- **Tablet (768px):** PASS — full-width, legible

### Phase 3.5: Regression Testing
Trigger files matched: `MEQ30QuestionnaireForm.tsx` — no Phase 2 session or PDF trigger files
Workflow(s) run: N/A — no regression required

### ⚠️ REGRESSION WARNING (separate WO required)
During QA navigation, a runtime Vite parse error was encountered in an adjacent component:
- **File:** `src/components/arc-of-care-forms/ongoing-safety/StructuredSafetyCheckForm.tsx:161:20`
- **Error:** `SyntaxError: Missing initializer in destructuring declaration`
- **Impact:** This is NOT introduced by WO-658. Error is pre-existing or from another in-flight WO. WO-661 (StructuredSafetyCheckForm DB migration) is currently in 04_BUILD — BUILDER must resolve this syntax error before WO-661 ships.
- **Action:** LEAD to create a blocker note on WO-661.

### Phase 3 Verdict
**STATUS: APPROVED**

---

## INSPECTOR QA — Visual Evidence

MEQ-30 wizard verified live at `http://localhost:3000` — single-card wizard, auto-advance, dot-navigator progress, 30 questions confirmed.
Recording: `/Users/trevorcalton/.gemini/antigravity/brain/f4b20de8-cdd0-40fb-b1df-8ff4a21c9f44/wo658_meq30_wizard_qa_1774485473237.webp`

INSPECTOR VERDICT: APPROVED | Date: 2026-03-25
