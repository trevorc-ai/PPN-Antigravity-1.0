---
description: INSPECTOR PRD audit — review PRODDY deliverables before they reach LEAD. Run whenever a ticket in 02_TRIAGE has owner: LEAD and contains a PRODDY PRD section.
---

# INSPECTOR PRD Audit Workflow

Run this workflow whenever PRODDY has completed a PRD and routed a ticket to LEAD.
Trigger: ticket in `_WORK_ORDERS/02_TRIAGE/` with `## PRODDY PRD` section present.

---

## Step 1 — Identity Check

Read the ticket. Confirm:
- [ ] The PRODDY PRD section is signed with `## PRODDY PRD` header
- [ ] The original PRODDY response (if in chat) was wrapped in `==== PRODDY ====`

If either is missing → **FAIL. Rule Zero violation.** Reject immediately without reading further.

---

## Step 2 — Section Completeness Check

Confirm all 6 required sections exist with content (not just headers):

- [ ] `### 1. Problem Statement` — has content
- [ ] `### 2. Target User + Job-To-Be-Done` — has content
- [ ] `### 3. Success Metrics` — has ≥1 metric
- [ ] `### 4. Feature Scope` — has both In Scope and Out of Scope populated
- [ ] `### 5. Priority Tier` — one tier selected with a named reason
- [ ] `### 6. Open Questions for LEAD` — populated or explicitly states "None — spec is complete"

Any missing or empty section → **FAIL immediately.**

---

## Step 3 — Word and Item Limit Audit

Run a word count check:

```bash
# Count words in the PRD section of the ticket
# Manually count or use: wc -w on the PRD block
```

- [ ] Problem Statement: ≤100 words
- [ ] Full PRD: ≤600 words total
- [ ] Success Metrics: ≤3 items
- [ ] Open Questions: ≤5 items

Any limit exceeded → **FAIL. Note exact overage.**

---

## Step 4 — Quality Gate on Each Section

### Problem Statement
- [ ] Describes the pain/problem (NOT a solution)
- [ ] Names the specific user role affected
- [ ] Describes what happens without the feature

**Reject if:** The Problem Statement contains words like "We will build", "The feature should", "By implementing" — these are solution statements, not problem statements.

### Success Metrics
For each metric, ask: *"Can I look at a number in a dashboard 30 days after ship and know if this passed or failed?"*

- [ ] Metric 1: Contains a specific number, percentage, or observable event → ✅ / ❌
- [ ] Metric 2: Same check → ✅ / ❌
- [ ] Metric 3: Same check → ✅ / ❌

**Auto-reject words in metrics:** "improves", "increases engagement", "feels better", "more intuitive", "users like", "positive feedback"

### Out of Scope
- [ ] Not empty
- [ ] Contains at least one real exclusion (not just "future work TBD")

**Reject if:** Out of Scope is empty or says only "N/A".

### Priority Tier
- [ ] Exactly one tier selected (P0 / P1 / P2)
- [ ] Reason is specific — names a deadline, user, or risk. NOT "seems important" or "high priority"
- [ ] P0 requires evidence of a hard deadline or patient safety concern

**Reject if:** Priority is P0 with no named deadline or safety concern.

---

## Step 5 — Forbidden Content Scan

Scan the full PRD for PRODDY overreach:

```bash
# Check if PRODDY wrote any code in the ticket
grep -n "const \|function \|import \|export \|useState\|useEffect\|<div\|CREATE TABLE\|ALTER TABLE\|SELECT \|INSERT \|UPDATE " _WORK_ORDERS/02_TRIAGE/[ticket-name].md
```

- [ ] No TypeScript / JSX found
- [ ] No SQL statements found
- [ ] No database schema definitions found
- [ ] No CSS class definitions found

Any forbidden content → **FAIL. PRODDY overstepped its role.**

---

## Step 6 — Verdict

### [STATUS: PASS] — If all checks pass:

Append to the ticket:
```markdown
## ✅ PRODDY PRD — INSPECTOR APPROVED

**Reviewed by:** INSPECTOR  
**Date:** [YYYY-MM-DD]  
**Verdict:** [STATUS: PASS]

**Audit Evidence:**
- All 6 required sections present ✅
- Word limits respected ✅
- Success metrics are measurable ✅
- Out of Scope populated ✅
- No forbidden content (code/SQL) ✅
- Priority tier justified ✅

**Routing:** LEAD may proceed to architecture. No revision needed.
```

Leave ticket in `02_TRIAGE` with `owner: LEAD`. Do not move it — LEAD routes from here.

---

### [STATUS: FAIL] — If any check fails:

Append to the ticket:
```markdown
## 🛑 PRODDY PRD — INSPECTOR REJECTION
**failure_count:** [increment by 1]

**Rejected checks:**
- [ ] [Exact failing check and reason]
- [ ] [Second failing check if applicable]

**Required fixes before resubmission:**
1. [Specific actionable fix]
2. [Specific actionable fix]

**Routing:** Owner → PRODDY. Status → 02_TRIAGE (no move needed, PRODDY revises in place).
```

Update frontmatter: `owner: PRODDY`, `failure_count: [N]`

**Two-Strike Rule:** If `failure_count >= 2` → change `owner: LEAD`, alert user:  
"❌ TWO STRIKES on WO-[ID] PRD. PRODDY cannot fix this. LEAD must re-scope the ticket."

---

## Quick Reference — Auto-Reject Triggers

| Trigger | Action |
|---|---|
| Missing `==== PRODDY ====` wrapper | Reject — Rule Zero |
| Any required section missing | Reject — incomplete |
| Vague success metric (no number/event) | Reject — not measurable |
| Out of Scope is empty | Reject — scope undefined |
| P0 with no named deadline or safety risk | Reject — priority inflation |
| Code or SQL found in PRD | Reject — role violation |
| PRD > 600 words | Reject — too long to be actionable |
| PRODDY moved the ticket itself | Flag — process violation (LEAD moves tickets) |
