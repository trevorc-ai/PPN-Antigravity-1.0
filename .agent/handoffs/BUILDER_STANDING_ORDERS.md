# BUILDER STANDING ORDERS
**Issued by:** INSPECTOR on behalf of USER  
**Date:** 2026-02-17T23:04:00-08:00  
**Authority:** PERMANENT — supersedes all previous handoff notes  
**Status:** 🔴 MANDATORY — BUILDER must read this before every session

---

## 🚨 THE CORE RULE: DO NOT STOP

**The USER's complaint:** BUILDER stops after every task and waits for approval before proceeding.

**The fix:** BUILDER must work through the ENTIRE `03_BUILD` queue autonomously, task by task, without stopping to ask for permission between tickets.

---

## ✅ PRE-AUTHORIZED DECISIONS (No Approval Needed)

BUILDER is **pre-authorized** to make the following decisions without stopping:

### Component Location
- Phase 1 forms → `src/components/wellness-journey/`
- Phase 2 forms → `src/components/wellness-journey/`
- Phase 3 forms → `src/components/wellness-journey/`
- Safety components → `src/components/safety/`
- Arc of Care components → `src/components/arc-of-care/`
- Utility/shared → `src/components/ui/`
- **Forms Showcase = `src/pages/ComponentShowcase.tsx`** — add new forms to the relevant section

### Dependency Handling
- If a ticket says "depends on WO-XXX" and WO-XXX is in `06_COMPLETE` or `05_USER_REVIEW` → **treat as complete, proceed**
- If a ticket depends on a SOOP migration that hasn't run yet → **use mock data hooks from `src/lib/mockData/`**, build the UI, leave a `// TODO: swap to real Supabase query` comment
- If a component already exists and the ticket asks to create it → **reuse the existing component**, note it in implementation notes

### Minor Architectural Choices
- Folder structure within existing patterns → **follow existing patterns, don't ask**
- Import paths → **use `@/` alias**
- State management → **useState/useEffect for local, no new libraries**
- Styling → **follow `frontend-best-practices` SKILL.md**

### Quick Wins (< 2 hours each) — Execute Immediately
- Text/label changes
- Sort order fixes (alphabetical dropdowns)
- Color/spacing corrections
- Adding missing fields to existing forms
- Fixing broken imports

---

## 🔄 BUILDER WORKFLOW (Execute This Loop)

```
WHILE 03_BUILD queue is not empty:
  1. Pick the highest-priority ticket (P0 first, then P1, then P2)
  2. Read the ticket fully
  3. Check if BLOCKED (needs SOOP migration that hasn't run)
     → YES: Use mock data, build UI anyway, mark TODO
     → NO: Implement immediately
  4. Write the code
  5. Update ticket frontmatter: status → 04_QA, owner → INSPECTOR
  6. Move ticket: mv 03_BUILD/WO-XXX.md 04_QA/WO-XXX.md
  7. Append implementation notes to ticket
  8. IMMEDIATELY pick up the next ticket — DO NOT STOP
```

---

## 📋 CURRENT 03_BUILD PRIORITY ORDER — UPDATED 2026-02-17T23:22 PST

Execute in this exact order. **Non-BUILDER tickets are clearly marked — skip them.**

### 🔴 IMMEDIATE (Quick Wins — Do First)

1. **WO-087** — Wellness Journey Page Bug Fixes & URL Rename
   - Fix unresponsive form, button color accessibility, tooltip font size violations
   - Rename page URL to "Wellness Journey"
   - **No dependencies, no blockers — ship it**

### 🟠 HIGH PRIORITY

2. **WO-085** — Add Missing Vital Signs to SessionVitalsForm
   - SOOP migration may not have run yet → **use mock data**
   - Add: respiratory_rate, temperature, skin_conductance fields to `SessionVitalsForm.tsx`
   - Component location: `src/components/wellness-journey/`

3. **WO-086** — Session Timeline Tracking
   - Create `SessionTimelineForm.tsx` in `src/components/wellness-journey/`
   - Use `useSessionTimeline()` mock hook
   - Clone pattern from `SessionVitalsForm.tsx`

4. **WO-074** — Phase 1 Baseline Assessment Wizard
   - Location: `src/components/wellness-journey/`

### 🟡 STANDARD PRIORITY

5. **WO-063** — Integrate Symptom Trajectory Chart
   - Use `useLongitudinalAssessments()` mock hook
   - Integrate `SymptomDecayCurve.tsx` into Wellness Journey Phase 3

6. **WO-065** — Integrate Session Monitoring Dashboard
   - Use `useSessionTimeline()` mock hook
   - Integrate `SessionMonitoringDashboard.tsx` into Phase 2

7. **WO-066** — Integrate Safety Event Documentation
   - Use mock data for `log_interventions` and `log_safety_alerts`
   - Integrate `RescueProtocolChecklist.tsx` and `RedAlertPanel.tsx`

### 🔵 PHANTOM SHIELD (After above complete)
8. **WO-059** — Potency Normalizer
9. **WO-060** — Crisis Logger

### ℹ️ NON-BUILDER TICKETS IN 03_BUILD — SKIP, DO NOT TOUCH
These belong to other agents. BUILDER must not open or modify these:
- `WO_027_*_MARKETER.md` → MARKETER
- `WO_028_*_MARKETER.md` → MARKETER
- `WO_BRAND_*_MARKETER.md` → MARKETER
- `WO-086a_*_MARKETER.md` → MARKETER
- `WO-084_Session_Tracking_*` → ANALYST
- `WO-062_GREY_MARKET_PHANTOM_SHIELD_ARCHITECTURE.md` → LEAD reference doc only

---

## 🚫 THE ONLY VALID REASONS TO STOP

BUILDER may ONLY stop and write a handoff note if:

1. **TWO-STRIKE RULE triggered** — A fix has failed twice. Stop, revert with `git restore`, write handoff to LEAD.
2. **Missing file that should exist** — A ticket references a component that doesn't exist and can't be inferred. Write a 1-line question in the ticket and move to the NEXT ticket immediately.
3. **Security/PHI violation risk** — Something would require storing patient free-text. Stop and flag to LEAD.
4. **Build is broken** — `npm run dev` throws errors that block all work. Fix the build first.

**Everything else → make a reasonable decision and proceed.**

---

## ❌ THINGS THAT ARE NOT VALID REASONS TO STOP

- "Awaiting user approval" — **Do not wait. Proceed.**
- "Awaiting LEAD guidance" — **Use the pre-authorized decisions above.**
- "Should I use Option A or Option B?" — **Pick the better one and document why.**
- "Is this the right folder?" — **Follow the component location rules above.**
- "Is WO-XXX complete?" — **Check 06_COMPLETE. If it's there, yes. If not, use mock data.**
- "Should I move to QA?" — **Yes. Always. After every completed ticket.**

---

## 📝 TICKET COMPLETION PROTOCOL

After completing each ticket, append this block to the ticket file:

```markdown
## BUILDER IMPLEMENTATION NOTES (2026-02-17)

### Files Modified/Created:
- `src/components/...` — [description]

### Implementation Decisions:
- [Any non-obvious choices made]

### Mock Data Used:
- [List any mock hooks used, with TODO comment locations]

### Known Gaps:
- [Anything left for SOOP or future work]

### Status: ✅ COMPLETE — Moving to 04_QA
```

Then run:
```bash
mv _WORK_ORDERS/03_BUILD/WO-XXX.md _WORK_ORDERS/04_QA/WO-XXX.md
```

Then **immediately start the next ticket.**

---

## 🎯 DEFINITION OF DONE FOR BUILDER

A ticket is done when:
1. ✅ Code is written and compiles without errors
2. ✅ Component renders without console errors
3. ✅ Fonts ≥ 12px (check all new text)
4. ✅ No color-only meaning (icon + text for all states)
5. ✅ Implementation notes appended to ticket
6. ✅ Ticket moved to `04_QA/`
7. ✅ **Next ticket already started**

---

**INSPECTOR AUTHORITY:** These standing orders are issued with USER authority and override any previous instructions to "await approval" or "await LEAD guidance" for routine build decisions.

**Issued:** 2026-02-17T23:04:00-08:00  
**Signature:** INSPECTOR

==== INSPECTOR ====
