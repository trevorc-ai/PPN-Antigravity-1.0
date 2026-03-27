---
name: inspector-qa-script
description: "Mandatory testing and validation checklist for all PPN work orders. Covers pre-build review (Phase 0 / 02.5_PRE-BUILD_REVIEW), platform code QA (Phases 1-3.5), outreach asset audit (Phase 4), accessibility (Phase 5), print/PDF (Phase 6), and joint user visual confirmation (Phase 5.5)."
---

# INSPECTOR QA Script

Mandatory testing and validation checklist for all code commits. INSPECTOR owns the commit gate.

## PHASE 0: PRE-BUILD REVIEW (`02.5_PRE-BUILD_REVIEW` stage)

**Run this phase BEFORE the ticket enters `03_BUILD`. This is INSPECTOR's job at the `02.5_PRE-BUILD_REVIEW` stage.**

### Fast-Pass Rule
If the WO has `database_changes: no` in frontmatter AND no files matching `migrations/`, `supabase/`, or `*.sql` in its `files:` list — INSPECTOR appends the following and moves to `03_BUILD` immediately:
```
## INSPECTOR 02.5 CLEARANCE: FAST-PASS
No DB impact detected. Cleared for build.
Signed: INSPECTOR | Date: YYYY-MM-DD
```

### Full DB + Backend Review (when `database_changes: yes` or SQL files present)

#### Schema Compatibility
- [ ] All FK targets confirmed to exist in live schema (run `node .agent/scripts/inspect-table.js <table_name>`)
- [ ] All new tables are additive — no DROP, ALTER TYPE, RENAME, or TRUNCATE
- [ ] All CREATE TABLE/INDEX use `IF NOT EXISTS`; all CREATE POLICY preceded by `DROP POLICY IF EXISTS`
- [ ] RLS enabled on all new `log_*` tables with SELECT + INSERT policies

#### Index Efficiency Review
For each new index or query pattern in the WO, INSPECTOR recommends the appropriate index type:

| Pattern | Recommended Index |
|---|---|
| Equality lookup on a single column (e.g. `WHERE user_id = ?`) | **B-tree** (default, most queries) |
| Equality-only, never range (e.g. hash lookups, UUIDs) | **Hash** (faster equality, no range) |
| Multi-column WHERE or ORDER BY (e.g. `WHERE site_id = ? AND created_at > ?`) | **Composite** (B-tree multi-column) |
| Queries that read many columns — avoid table scan | **Covering** (include all SELECT columns in index) |
| Low-cardinality flags/booleans (e.g. `is_active`, `phase` with 3 values) | **Bitmap** (Postgres implicitly via bitmap scan; partial index in PG) |
| Large text search (e.g. session notes, clinical records) | **Full-Text** (`tsvector` + GIN index) |

INSPECTOR MUST note the chosen index type for each new index in the `## INSPECTOR 02.5 CLEARANCE` block.

#### Backend Efficiency
- [ ] No N+1 queries introduced (batch fetches or joins instead of loops)
- [ ] New queries use indexed columns in WHERE/JOIN clauses
- [ ] No unbounded queries (confirm LIMIT or pagination where result set could be large)

### UI Standards Pre-Build Gate

**Trigger:** Run this check if the WO's `files:` list contains any `.tsx`, `.css`, `.html`, or any path inside `public/outreach/`. Skip for pure DB-only or migration-only tickets.

> [!IMPORTANT]
> **Run grep on the ACTUAL FILES, not just the WO spec.** This is the earliest catch point. Violations found here are logged in the clearance block so BUILDER knows about them before writing a single line of code.

For each file in the WO's `files:` list that is `.tsx`, `.css`, or `.html`, run:

```bash
# CHECK 1: Bare text-xs without responsive upgrade (Rule 2 violation)
grep -n 'text-xs\b' <file> | grep -v 'md:text-sm\|sm:text-sm\|print:\|/\*\|<!--'

# CHECK 2: Near-invisible low-contrast text (Rule 6 violation)
grep -n 'text-slate-700\|text-gray-[1-4]00\|text-slate-800' <file> | grep -v 'border\|bg-\|/\*'

# CHECK 3: Native <details>/<summary> elements (auto-close violation)
grep -n '<details\|<summary' <file> | grep -v '/\*\|<!--'

# CHECK 4: Em dashes in rendered UI text (Rule 4 violation)
grep -n '—' <file> | grep -v '/\*\|<!--\|//\|Changelog\|changelog'

# CHECK 5: Banned fonts (Rule 2b violation)
grep -n 'JetBrains\|Courier New\|font-serif' <file> | grep -v '/\*\|<!--'
```

**Log all findings in the clearance block.** BUILDER is not blocked by pre-existing violations, but MUST fix any violations in lines they modify. INSPECTOR will verify at Phase 2.

Then verify the WO spec itself against:

- [ ] **Font floor:** No `text-xs`, `JetBrains Mono`, or `Courier New` specified in design notes or code snippets
- [ ] **Em dash:** No em dash (—) or hyphen-as-em-dash (` - `) in any body text within the WO spec or copy blocks
- [ ] **Color alone:** Every color-coded state in the spec includes a paired icon or text label, not color alone
- [ ] **Phase palette:** Only indigo (Phase 1), amber (Phase 2), teal (Phase 3) used for phase indicators — no ad hoc colors
- [ ] **Background (screen):** Deep Slate `#020408` / `bg-slate-950` specified — no flat black
- [ ] **Background (print/PDF):** White `#ffffff` or near-white `#f8f9fc` — no dark fills _(skip if no print/PDF in scope)_
- [ ] **Branding:** PPN Portal wordmark required in header for any outreach or PDF file _(skip if platform-only React)_
- [ ] **Mobile-first layout:** Grid, flex, and container classes in the spec use mobile-first patterns (`grid-cols-1 md:grid-cols-N`, `flex-col md:flex-row`). No bare `grid-cols-2+` or `w-1/2` on flex children without responsive prefix. Any interactive element (button, input, card tap) has a minimum touch target of `h-12` (48px).

If ANY spec check fails → **return ticket to `02_TRIAGE`** with `hold_reason: ppn-ui-standards violation — [specific failing check]`. Do NOT sign the clearance block.

If ALL checks pass → add `- [ ] UI Standards Pre-Build Gate: PASS` to the clearance block below.

---

### INSPECTOR 02.5 CLEARANCE Block (paste into ticket)
```
## INSPECTOR 02.5 CLEARANCE
- [ ] Fast-pass (no DB impact) OR full DB review completed
- [ ] Schema compatibility: PASS
- [ ] Index types reviewed: [list each index + type chosen]
- [ ] RLS completeness: PASS
- [ ] Backend efficiency: PASS
- [ ] UI Standards Pre-Build Gate: PASS (or N/A — no visible files)
Signed: INSPECTOR | Date: YYYY-MM-DD
```

**Output:** Move ticket from `02.5_PRE-BUILD_REVIEW` → `03_BUILD`. If any check fails, return to `02_TRIAGE` with hold_reason.

---

### Analytics Data Source Gate (Phase 0 — Mandatory)

**Trigger:** Run this check if the WO's `files:` list contains any path matching:
- `src/components/analytics/*`
- `src/pages/*` that renders charts, statistics, or outcome summaries
- Any file that imports from `src/constants/analyticsData.ts`

**Check:** For each flagged file, does the component read from a `v_` or `mv_` SQL view, or does it import from `src/constants/analyticsData.ts` / any `MOCK_*` constant?

| Result | Action |
|--------|--------|
| Component reads from `v_`/`mv_` SQL view | ✅ PASS |
| Component uses mock data BUT no `mv_` view exists yet | ⚠️ PASS with note — BUILDER must add a `// TODO: migrate to mv_[name] when view is live` comment |
| Component uses mock data AND the corresponding `mv_` view already exists | 🔴 FAIL — return to `02_TRIAGE`: `hold_reason: Analytics Data Source Gate — [component] imports MOCK_* data but [mv_view] exists. Component must be migrated before this WO can ship.` |

**Current mock-data migration queue** (reference for gate decisions):

| Component | Mock Constant | Target `mv_` | Gate Status |
|-----------|--------------|-------------|------------|
| `SafetyRiskMatrix.tsx` | `MOCK_RISK_DATA` | `mv_open_risk_queue` | 🔴 FAIL when `mv_open_risk_queue` exists |
| `PatientJourneySnapshot.tsx` | `MOCK_JOURNEY_DATA` | `mv_patient_latest_status` | 🔴 FAIL when `mv_patient_latest_status` exists |
| `PatientFlowSankey.tsx` | `MOCK_FLOW_DATA` | `mv_site_monthly_quality` | 🔴 FAIL when `mv_site_monthly_quality` exists |
| `ConfidenceCone.tsx` | `MOCK_TRAJECTORY_DATA` | `mv_benchmark_by_subgroup` | 🔴 FAIL when `mv_benchmark_by_subgroup` exists |

### Pillar Classification Gate (Phase 0)

- [ ] WO frontmatter contains `pillar_supported:` field with at least one value (or `none` escalated to USER)
- [ ] WO frontmatter contains `task_type:` field with a valid type
- [ ] `/request-triage` verdict block is present in the WO body and verdict = `PROCEED` *(required for all non-trivial WOs; waived only for pure bug fixes with no architectural surface area)*

**If pillar fields are missing → return to `02_TRIAGE`** with `hold_reason: Missing pillar_supported or task_type in frontmatter. Required per GLOBAL_CONSTITUTION §6.`
**If `/request-triage` block is missing on a non-trivial WO → return to `02_TRIAGE`** with `hold_reason: /request-triage verdict required per GLOBAL_CONSTITUTION §6.`

Update clearance block to include:
```
- [ ] Analytics Data Source Gate: PASS | PASS with note | N/A (no analytics files)
- [ ] Pillar Classification Gate: PASS | [pillar(s) stated]
- [ ] /request-triage verdict: PROCEED | N/A (bug fix — waived)
- [ ] /analysis-first gate: Pre-conditions = YES | N/A (not a sql-view or schema task_type)
- [ ] Data Completeness Gate: PASS | N/A (no analytical output)
- [ ] Network Benchmark Gate: PASS | N/A (no site-vs-network surface)
```

---

### Data Completeness Gate (Phase 0 — Mandatory for analytical components)

**Trigger:** Run this check if the WO produces any component that reads from a `v_*` or `mv_*`
view and renders its output to a practitioner, admin, or patient-facing surface.

**Check:** For each flagged component, answer:

1. **Zero-row handling:** If the component's source MV returns 0 rows, does the component render
   a graceful empty state (e.g. `"No data yet"`, `"Awaiting first session"`) rather than a blank
   panel, error state, or misleading zero values?

2. **Suppression threshold:** If the component applies minimum-n suppression, is the threshold
   documented in a code comment AND is the suppression label visible to the user?
   - **Beta threshold:** n \< 5 with label `"Early data — results will strengthen"`
   - **Production threshold:** n \< 20 with label `"Minimum data threshold not yet met"`

3. **Clinical disclaimer:** If the component renders any classification that implies clinical
   conclusions (response, remission, trajectory label, risk score), it MUST display:
   `"Algorithm-derived — verify with clinical judgment"` in `ppn-meta` styling, always visible.

| Result | Action |
|--------|--------|
| Zero-state handled + threshold documented | ✅ PASS |
| Zero-state crashes or shows empty panel | 🔴 FAIL — return to `02_TRIAGE`: `hold_reason: Data Completeness Gate — zero-row case unhandled` |
| Clinical classification without disclaimer | 🔴 FAIL — return to `02_TRIAGE`: `hold_reason: Data Completeness Gate — clinical disclaimer missing` |

---

### Network Benchmark Gate (Phase 0 — Mandatory for any site-vs-network surface)

**Trigger:** Run this check if the WO renders any `v_site_outcome_benchmark_compare`,
`mv_network_outcome_benchmarks`, or any surface that compares a site's metrics against a
"network average" or "peer benchmark."

**Check:** Is the network comparison feature-flagged off until `COUNT(DISTINCT site_id) >= 10`
in `mv_network_outcome_benchmarks` (or equivalent cross-site view)?

| Result | Action |
|--------|--------|
| Feature-flagged with n ≥ 10 guard | ✅ PASS |
| Renders network comparison without density guard | 🔴 FAIL — `hold_reason: Network Benchmark Gate — site-vs-network surface must be feature-flagged until n≥10 contributing sites` |

You must evaluate BUILDER's output against this exact checklist. Paste this checklist into the chat with PASS/FAIL for each item.

## PHASE 1: SCOPE & DATABASE AUDIT
- [ ] **Database Freeze Check:** Does this code attempt to `CREATE`, `DROP`, or `ALTER` a database table? (If YES -> FAIL. DB is frozen).
- [ ] **Scope Check:** Did BUILDER modify any file not explicitly listed in LEAD's `work_orders/CURRENT_PLAN.md`? (If YES -> FAIL).
- [ ] **Refactor Check:** Did BUILDER reorganize or rewrite code outside the targeted line numbers? (If YES -> FAIL).

## PHASE 2: UI & ACCESSIBILITY AUDIT
- [ ] **Color Check:** Are there any states (Success, Warning, Error) indicated *only* by color without an accompanying icon or text label? (If YES -> FAIL)
- [ ] **Typography Check:** Are there any font sizes implemented that are smaller than 9pt / 12px? (If YES -> FAIL)
- [ ] **Character Check:** Does the new code or UI text contain an em dash character? (If YES -> FAIL)
- [ ] **Input Check:** Were any uncontrolled free-text `textarea` inputs added for clinical data? (If YES -> FAIL)
- [ ] **Mobile-First Check:** Run `grep -n 'grid-cols-[2-9]\b' <file> | grep -v 'md:\|lg:\|sm:'` — any match that cannot be manually justified as intentionally mobile-only = FAIL. Run `grep -n 'w-\[.*px\]\|min-w-\[.*px\]' <file> | grep -v 'max-w-'` — any match = FAIL. All tappable elements must be `h-12` or larger.
- [ ] **Tablet-Viewport Screenshot:** Capture a screenshot at **768px viewport width** (iPad Mini equivalent, `md:` breakpoint) using the browser subagent. Verify: layout switches to at least `md:grid-cols-2`, top/side navigation is visible (no bottom-sheet nav), no horizontal overflow, touch targets still 44px+. Any failure = FAIL.

## PHASE 3: VERDICT (for React / TSX / platform code only)

### ❌ REJECTED (any FAIL)
Reply with `STATUS: REJECTED`. Cite the exact failing check(s). Instruct BUILDER to:
```bash
git restore <file>   # revert the failing file(s)
```
Then re-flag the WO back to `03_BUILD` and notify BUILDER to fix and resubmit.

### ✅ APPROVED (all PASS)
Reply with `STATUS: APPROVED`. Then proceed to **Phase 3.5** before running `/finalize_feature`.

> ⛔ INSPECTOR is the ONLY agent that runs `/finalize_feature`. BUILDER never commits. No exceptions.

> ⏸ **PUSH REQUIRES USER CONFIRMATION.** `/finalize_feature` stages and commits automatically, then posts a push/hold prompt to the user. **Do NOT push until the user replies `push`.** This is the final human gate before production deployment. Wait for it.

---

## PHASE 3.5: MANDATORY REGRESSION TESTING GATE

> ⚠️ **THIS PHASE IS NOT OPTIONAL.** `/finalize_feature` must NOT run until all required regression workflows PASS. Skipping regression testing and committing is a QA protocol violation, regardless of how clean the code looks.

Check the WO's `affects:` field. For each matching file trigger below, you MUST run the corresponding regression workflow **in the browser against production (ppnportal.net)** before committing. If no file triggers match, document `N/A — no regression required`.

### Trigger Table

| If any affected file matches... | Run this workflow |
|---|---|
| `DosingSessionPhase.tsx`, `ActiveSessionsContext.tsx`, `SessionPillCard.tsx`, `LiveSessionTimeline.tsx`, any `ppn_session_mode_*` or `ppn_session_start_*` localStorage key | `/phase2-session-regression` (4 browser scenarios) |
| `StructuredIntegrationSession.tsx`, `StructuredIntegrationSessionForm.tsx`, `WellnessJourney.tsx`, `ProtocolDetail.tsx`, any `log_integration_sessions`, `log_longitudinal_assessments`, or `ppn_phase3_*` localStorage key | `/phase3-integration-regression` (4 browser scenarios) |
| Any file in `src/pages/*PDF.tsx` or `src/services/dischargeSummary.ts`, `pdfGenerator.ts`, `reportGenerator.ts` | PDF print preview audit per WO-644 checklist |

### How to Run

1. Start the dev server locally (`npm run dev`), OR use the **browser subagent against ppnportal.net** if the local dev server is unavailable.
2. Execute every scenario in the matching workflow(s).
3. Document results as `Scenario N: PASS / FAIL / CANNOT_TEST (reason)`.
4. **ALL scenarios must PASS** before running `/finalize_feature`.
5. If ANY scenario FAILS: **STOP**. Flag the specific failure to the user, revert if instructed, and create a follow-up WO before committing.

### INSPECTOR Sign-Off Block (paste into QA report)

```
## Phase 3.5 Regression Results
Trigger files matched: [list files or "none"]
Workflow(s) run: [workflow name(s) or "N/A — no regression required"]

Scenario 1 (...): PASS / FAIL / N/A
Scenario 2 (...): PASS / FAIL / N/A
Scenario 3 (...): PASS / FAIL / N/A
Scenario 4 (...): PASS / FAIL / N/A

Overall: ✅ REGRESSION CLEAR — proceeding to /finalize_feature
      OR ❌ REGRESSION FAIL — [scenario] failed, stopping commit
```

---

## PHASE 4: OUTREACH AND GROWTH ASSET AUDIT

**Run this phase for any file in `public/outreach/` or any GO ticket in `_GROWTH_ORDERS/06_QA/`. Skip for React/TSX platform code.**

> [!CAUTION]
> **The CEO/lead designer is colorblind and vision impaired.** Checks B and C below are personal accessibility requirements, not preferences. Any color-contrast or font-size failure means the user literally cannot read this deliverable. These must PASS before any other check proceeds.

### Step 0: Re-run MARKETER's 5 Accessibility Checks (automated)

For each HTML file in the GO, run these commands and report each result:

```bash
# CHECK A: Color-only state indicators (no paired icon/label)
grep -n 'text-red\|text-green\|bg-red\|bg-green\|color: red\|color: green' <file> | grep -v 'AlertTriangle\|CheckCircle\|icon\|label\|/\*'

# CHECK B: Low-contrast gray text (vision impairment)
grep -n 'text-gray-[1-4]00\|color: #[89a-f][0-9a-f]\{5\}\|text-slate-[2-4]00' <file> | grep -v '/\*\|<!--'

# CHECK C: Sub-minimum font sizes (vision impairment)
grep -nE 'font-size:\s*([0-9]|1[01])px\|text-\[8px\]\|text-\[9px\]\|text-\[10px\]\|text-\[11px\]' <file>

# CHECK D: Em dashes
grep -n '—\|&mdash;\|&#8212;' <file> | grep -v '/\*\|<!--'

# CHECK E: Screenshot source path
grep -n 'screenshots/' <file> | grep -v 'Marketing-Screenshots'
```

If ANY check returns matches: **STOP. Return ticket to `05_IMPLEMENTATION` with `hold_reason: accessibility violation — [check] — [line numbers]`**. Do NOT proceed to the manual checklist below.

### Step 1: Manual Inspection Checklist

- [ ] **Em Dash Check:** `grep -n "—\|&mdash;\|&#8212;" <file> | grep -v "/\*" | grep -v "<!--"` must return empty
- [ ] **Courier New Check:** `grep -n "Courier" <file> | grep -v "/\*"` must return empty
- [ ] **Font Size Floor Check:** `grep -nE "font-size:\s*([0-9]|1[01])px" <file> | grep -v "/\*"` must return empty
- [ ] **Screenshot Source Check:** `grep -n "screenshots/" <file> | grep -v "Marketing-Screenshots"` must return empty (all images must use `Marketing-Screenshots/webp/`)
- [ ] **Image 404 Check:** Open the file in a browser and confirm zero broken image icons. Any 404 = FAIL
- [ ] **Color-Alone Check:** Every badge, status indicator, and label must include an icon AND text — not color alone (Rule 1 / Rule 6)
- [ ] **Background Check:** Hero section and page background is white or near-white. No dark navy or dark-fill hero sections
- [ ] **CONTENT_MATRIX Traceability:** A corresponding `GO-XXX_CONTENT_MATRIX.md` exists in `_GROWTH_ORDERS/06_QA/` or `99_PUBLISHED/`
- [ ] **MARKETER Self-Certification:** The CONTENT_MATRIX.md contains the accessibility pre-check certification block at the end
- [ ] **Mobile-Viewport Screenshot:** INSPECTOR must capture a screenshot at 375px viewport width using the browser subagent (iPhone SE equivalent). Layout must stack correctly — no horizontal overflow, no truncated CTAs, no unusable touch targets. Any overflow or broken layout = FAIL.
- [ ] **Tablet-Viewport Screenshot:** INSPECTOR must capture a screenshot at **768px viewport width** (iPad Mini equivalent). Layout must show 2-column grid (`md:grid-cols-2`), top or side navigation (not bottom-sheet), and no horizontal overflow. Any failure = FAIL.

## PHASE 5: COLOR BLINDNESS AND WCAG AA ACCESSIBILITY AUDIT

**Run this phase for ALL files — React, HTML, PDF, outreach.**

- [ ] **Contrast Ratio — Body Text:** All body text (< 18px) achieves minimum 4.5:1 contrast ratio against its background. Use WebAIM Contrast Checker for any non-standard color pair
- [ ] **Contrast Ratio — Large Text:** All text 18px+ or 14px bold achieves minimum 3:1 contrast ratio
- [ ] **Banned Pair Check:** No red vs. green pair used as the sole differentiator of a state. Verify icon or label accompanies both states
- [ ] **Banned Pair Check:** No teal vs. purple pair used as the sole differentiator
- [ ] **Low-Contrast Gray Check:** `grep -n "text-gray-[1-4]00\|color: #[89a-f]" <file>` — any match must be manually verified for 4.5:1 compliance
- [ ] **Phase Palette Check:** Phase 1 (indigo), Phase 2 (amber), Phase 3 (teal) are the only phase colors used. No ad hoc color additions
- [ ] **Icon Pairing Check:** Every error state has `<AlertTriangle />` or equivalent. Every success state has `<CheckCircle />` or equivalent

## PHASE 6: PRINT AND PDF READINESS AUDIT

**Run this phase for any file in `public/outreach/` or any document designed for print or PDF export.**

- [ ] **@page rule:** `@page { size: letter; margin: 0.6in; }` is present in the `<style>` block
- [ ] **Print media block:** `@media print` block exists and hides nav, sticky headers, and tab controls
- [ ] **Background:** `#ffffff` or `#f8f9fc` — no dark fill sections
- [ ] **Image bounds:** All images have explicit `max-height` to prevent overflow across page breaks
- [ ] **Page break safety:** `break-inside: avoid` applied to all exhibit cards, tables, multi-column grids
- [ ] **Wordmark:** PPN Portal wordmark is present in the document header
- [ ] **Footer:** Footer contains document title, date, and `© [year] PPN Portal · ppnportal.net · Confidential and Proprietary`
- [ ] **Fonts:** Google Fonts `@import` is at the top of the `<style>` block (not from app bundle which won't load in PDF)
- [ ] **Legal contact:** Footer contains `info@ppnportal.net` — no placeholder emails

### Phase 6 Verdict

#### ❌ REJECTED (any FAIL in Phases 4, 5, or 6)
Reply with `STATUS: REJECTED`. Cite the exact failing check(s). Move GO back to `_GROWTH_ORDERS/05_IMPLEMENTATION/` and notify BUILDER.

#### ✅ APPROVED (all PASS across Phases 4, 5, and 6)
Reply with `STATUS: APPROVED`. Update GO frontmatter `status: 99_PUBLISHED`. Move to `_GROWTH_ORDERS/99_PUBLISHED/`. No `git commit` required for pure HTML outreach files unless they are deployed via the app build.

---

## PHASE 5.5: JOINT USER VISUAL CONFIRMATION (`06_USER_REVIEW`)

> [!CAUTION]
> **THIS PHASE IS NON-NEGOTIABLE AND CANNOT BE SKIPPED.** Every ticket that reaches QA APPROVED must go through Phase 5.5 before the user is expected to do anything. Skipping Phase 5.5 is the #1 cause of backlog pileup — the user never sees completed work and cannot approve what they cannot see. If you skip Phase 5.5, you have not finished QA.

**Run this phase after QA APPROVED. Screenshots are mandatory — user reviews in Agent Manager without opening a browser.**

When INSPECTOR issues final QA APPROVED:

### Step A: Capture Screenshots (mandatory, no exceptions)


Use the browser subagent to navigate to every affected route and capture a screenshot. Minimum 1 screenshot per ticket. Multi-route tickets require one per affected view.

Append the following block directly to the WO ticket file **before** moving it:

```markdown
## INSPECTOR QA — Visual Evidence
![WO-XXX: [Feature Name] at [route]](absolute/path/to/screenshot.webp)
<!-- Add additional screenshots for each affected route -->
INSPECTOR VERDICT: APPROVED | Date: YYYY-MM-DD
```

- Use the absolute path to the screenshot file (stored in the artifacts dir or `.gemini/` cache)
- Caption format: `WO-XXX: [what the screenshot shows] at [URL or route]`
- If the browser subagent cannot reach the route (e.g. auth required), note `CANNOT_SCREENSHOT — [reason]` instead

### Step B: Move and Notify

1. Move WO to `06_USER_REVIEW/`
2. Post to user:

> 🔔 **@USER — `WO-XXX` has passed QA.** Screenshots embedded above. Please confirm before I push:
> - [ ] **Visual render:** Does it look correct? (Check the screenshots above — open browser only if needed)
> - [ ] **Data accuracy:** If this touches the DB, is data displaying correctly?
> - [ ] **No regressions:** Does anything adjacent look broken?
>
> Reply **`push`** to deploy · **`hold [reason]`** to send back

User replies `push` → INSPECTOR runs `/finalize_feature`.
User replies `hold [reason]` → INSPECTOR logs the issue, moves WO back to `04_BUILD`, creates follow-up note.

> ⛔ **No push until User replies `push`.** This is the final human gate before production.

---

## Changelog

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-02-23 | INSPECTOR | Initial QA checklist established |
| 1.1 | 2026-03-21 | LEAD + INSPECTOR | Added Phase 4 (Outreach/HTML audit), Phase 5 (Color Blindness / WCAG AA), Phase 6 (Print/PDF readiness), GO pipeline invocation note, Phase 3 renamed to clarify scope |
| 1.2 | 2026-03-21 | INSPECTOR | Added Phase 3.5 — Mandatory Regression Testing Gate. Trigger table maps affected files to required browser workflows (/phase2-session-regression, /phase3-integration-regression, PDF audit). Fixes protocol gap that allowed Track B WOs to commit without browser regression testing. |
| 1.3 | 2026-03-22 | LEAD | Added Phase 0 (02.5_PRE-BUILD_REVIEW pre-build checklist: fast-pass rule, DB schema compatibility, index type recommendations, backend efficiency). Added Phase 5.5 (joint User visual confirmation at 05_USER_REVIEW before push). Fixed frontmatter. |
| 1.4 | 2026-03-23 | LEAD | Phase 5.5 rewritten — mandatory browser screenshot block required before any ticket moves to 06_USER_REVIEW. Screenshots embedded directly in WO ticket file. Updated stage name to 06_USER_REVIEW. INSPECTOR must use browser subagent to capture and append evidence before posting @USER notification. |
| 1.5 | 2026-03-23 | LEAD | Added UI Standards Pre-Build Gate to Phase 0. Any WO with visible files (.tsx, .css, .html, public/outreach) must pass 7 ppn-ui-standards checks before INSPECTOR signs the 02.5 CLEARANCE block. Failure returns ticket to 02_TRIAGE. Updated clearance block template to include gate line. |
| 1.6 | 2026-03-23 | LEAD | **Added mobile-first enforcement gates.** Phase 0 pre-build checklist: added mobile-first layout check (8th item). Phase 2 UI audit: added Mobile-First Check with grep commands for bare grid-cols and hardcoded px widths. Phase 4 outreach audit: added mandatory 375px mobile-viewport screenshot requirement. Root cause fix for recurring desktop-first rework. |
| 1.7 | 2026-03-23 | LEAD | **Added 768px tablet viewport screenshot gate.** Phase 2 and Phase 4 now require both a 375px mobile screenshot AND a 768px tablet screenshot before INSPECTOR approval. Tablet check verifies: 2-column grid active, top/side nav restored, no bottom-sheet nav, 44px touch targets. Root cause fix for clinical tablet (point-of-care) rework loop. |
| 1.8 | 2026-03-24 | ANTIGRAVITY | **Phase 5.5 CAUTION gate added.** Skipping Phase 5.5 is now explicitly named as the #1 cause of backlog pileup and a protocol violation equal in severity to pushing without user approval. Root cause fix for completed work never surfacing for user review. |
| 1.9 | 2026-03-26 | INSPECTOR | **Added Data Completeness Gate and Network Benchmark Gate to Phase 0.** Data Completeness Gate requires zero-row handling, documented suppression thresholds (beta: n<5 / production: n<20 with labels), and clinical disclaimers on any response/remission/trajectory classification. Network Benchmark Gate requires feature-flag suppression of site-vs-network surfaces until ≥10 contributing sites. Clearance block updated to include both gates. |