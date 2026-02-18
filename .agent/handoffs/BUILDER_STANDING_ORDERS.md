# BUILDER STANDING ORDERS
**Issued by:** LEAD (Pipeline Audit 2026-02-18T14:40 PST)
**Authority:** PERMANENT — supersedes all previous versions
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
  6. Move ticket: mv _WORK_ORDERS/03_BUILD/WO-XXX.md _WORK_ORDERS/04_QA/WO-XXX.md
  7. Append implementation notes to ticket
  8. IMMEDIATELY pick up the next ticket — DO NOT STOP
```

---

## 📋 CURRENT 03_BUILD PRIORITY ORDER — UPDATED 2026-02-18T14:40 PST

Execute in this exact order. **Non-BUILDER tickets are clearly marked — skip them.**

### 🔴 IMMEDIATE (P0 — Do First)

1. **WO-113_Wire_Up_Wellness_Journey_Forms** — Wire up all Wellness Journey form components to the page
   - Connect existing components from `src/components/wellness-journey/` to the Wellness Journey page
   - **No blockers — all components exist**

2. **WO-115_New_Existing_Patient_Workflow** — New/Existing patient selection flow
   - Build the intake decision gate (new vs returning patient)
   - **No blockers**

3. **WO-076_Auto_Generated_Narratives** — Auto-generated clinical narrative summaries
   - Use mock data if Supabase not connected

4. **WO-077_Exportable_Audit_Reports** — PDF/export of audit reports
   - Wire existing export service to the Wellness Journey export button

### 🟠 HIGH PRIORITY (P1)

5. **WO-073_Wellness_Journey_Form_Integration_Foundation** — Foundation wiring for all forms
   - Confirm this isn't already done by WO-113; if so, skip and move to 04_QA as duplicate

6. **WO-074_Phase1_Baseline_Assessment_Wizard** — Phase 1 baseline wizard
   - Location: `src/components/wellness-journey/`

7. **WO-075_Smart_PreFill_System** — Smart pre-fill from prior session data
   - Use mock data if needed

8. **WO-081_Informed_Consent_Generator** — Informed consent document generator
   - Location: `src/components/wellness-journey/`

9. **WO-063_Integrate_Symptom_Trajectory_Chart** — Integrate SymptomDecayCurve into Phase 3
   - `failure_count: 1` — read existing inspector notes carefully before starting
   - Use `useLongitudinalAssessments()` mock hook

10. **WO-065_Integrate_Session_Monitoring_Dashboard** — Integrate SessionMonitoringDashboard into Phase 2
    - Use `useSessionTimeline()` mock hook

11. **WO-066_Integrate_Safety_Event_Documentation** — Integrate RescueProtocolChecklist + RedAlertPanel
    - Use mock data for `log_interventions` and `log_safety_alerts`

12. **WO-085_Main_Guided_Tour_UX_Fix** — Fix the main guided tour UX
    - Fix highlight/overlay behavior

13. **WO-114_Patient_View_Form_Options** — Patient view and send form options
    - Add "view as patient" and "send to patient" buttons to forms

14. **WO-103_Give_to_Get_Logic** — Feature gating: Give-to-Get data model
    - Backend RLS logic for benchmark access

15. **WO-092_Batch_Processor_Bulk_Patient_ID_Generator** — Bulk patient ID generator
    - Evaluation ticket — read carefully, implement if feasible

### 🟡 STANDARD PRIORITY (P2)

16. **WO-095_Alphabetical_Sort_Form_Dropdowns** — Sort all dropdowns alphabetically
    - Fix `InteractionChecker.tsx` lines 197 & 222: add `.slice().sort()`

17. **WO-052_Phase3_Forms_Redesign** — Phase 3 forms redesign
    - Location: `src/components/wellness-journey/`

18. **WO-076_Keyboard_Shortcuts_Micro_Interactions** — Keyboard shortcuts
    - Low risk, polish feature

19. **WO-116_Help_Documentation_Report_Samples** — Help docs and sample reports
    - Content creation — write inline help text and sample report PDFs

20. **WO-004_Regulatory_Map_Consolidation** — Consolidate regulatory map components
    - Design/refactoring task

21. **WO_011_Guided_Tour_Revamp** — Rebuild guided tour (currently broken)
    - Depends on WO-085 being done first

### 🔵 PHANTOM SHIELD (After above complete)
22. **WO-059_Potency_Normalizer** — Build potency normalizer UI
23. **WO-060_Crisis_Logger** — Build crisis logger UI
24. **WO-061_Cockpit_Mode_UI** — Build cockpit mode UI
25. **WO-064_Deep_Blue_Background_REWORK** — Rework deep blue background (failure_count: 1 — read inspector notes)

### ℹ️ NON-BUILDER TICKETS IN 03_BUILD — SKIP, DO NOT TOUCH
These belong to other agents. BUILDER must not open or modify these:
- `WO_027_*_MARKETER.md` → MARKETER
- `WO_028_*_MARKETER.md` → MARKETER
- `WO_BRAND_*_MARKETER.md` → MARKETER
- `WO-086_Landing_Page_Copy_Concepts_v2.md` → MARKETER
- `WO-086a_*_MARKETER.md` → MARKETER
- `WO-098_GTM_Launch_Coordination.md` → MARKETER
- `WO-105_Lead_Magnet_Strategy.md` → MARKETER
- `WO-081a_User_Guide_Quick_Start_Documentation.md` → MARKETER
- `WO-082_Data_Visualization_Component_Audit.md` → ANALYST
- `WO-084_Session_Tracking_Data_Architecture_Analysis.md` → ANALYST
- `WO-085_Add_Missing_Vital_Signs_to_SessionVitalsForm.md` → SOOP (migration first)
- `WO-086_Implement_Session_Timeline_Tracking.md` → SOOP (migration first)
- `WO-088_Duress_Mode_Fake_PIN.md` → SOOP (evaluation)
- `WO-090_Clients_Table_Ghost_Record.md` → SOOP (evaluation)
- `WO-091_Sessions_Table_Audit_Defense_Columns.md` → SOOP (evaluation)
- `WO-096_Migrate_InteractionChecker_to_ref_tables.md` → SOOP (migration)
- `WO-062_GREY_MARKET_PHANTOM_SHIELD_ARCHITECTURE.md` → LEAD reference doc only
- `WO_012_Receptor_Affinity_UI.md` → DESIGNER (needs design spec first)

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
## BUILDER IMPLEMENTATION NOTES (2026-02-18)

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

**LEAD AUTHORITY:** These standing orders are issued with USER authority and override any previous instructions to "await approval" or "await LEAD guidance" for routine build decisions.

**Issued:** 2026-02-18T14:40:00-08:00
**Signature:** LEAD

==== LEAD ====
