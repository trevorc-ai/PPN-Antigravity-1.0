---
description: LEAD mandatory pipeline scan — audit all queues for misrouted tickets and unblock stalled agents
---

# LEAD Pipeline Scan Protocol

Run this at the START of every LEAD session, before doing anything else.
This is the fix for the "tickets sitting in wrong queue" problem.

## Step 1: Audit 03_BUILD for non-BUILDER tickets
// turbo
```bash
cd /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/03_BUILD && grep -l "^owner:" *.md | xargs -I{} sh -c 'echo "--- {} ---"; grep "^owner:" {}'
```

**Routing rules for 03_BUILD:**
- `owner: BUILDER` → ✅ Correct, leave it
- `owner: SOOP` → ✅ Correct (SOOP works from 03_BUILD), but flag if stalled > 1 session
- `owner: MARKETER` → ❌ Move to `01_TRIAGE/`
- `owner: ANALYST` → ❌ Move to `01_TRIAGE/`
- `owner: DESIGNER` → ❌ Move to `02_DESIGN/`
- `owner: PRODDY` → ❌ Move to `01_TRIAGE/`
- `owner: USER` → ❌ Move to `05_USER_REVIEW/`
- `owner: LEAD` (reference docs, no build work) → ❌ Move to `01_TRIAGE/`

## Step 2: Move all misrouted tickets immediately
// turbo
```bash
# Example — adapt to what Step 1 found:
# mv /path/to/03_BUILD/WO-XXX_MARKETER.md /path/to/01_TRIAGE/
```

## Step 3: Audit 00_INBOX — route everything waiting
// turbo
```bash
ls /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/00_INBOX/
```

Every ticket in 00_INBOX must be routed. If it already has `## LEAD ARCHITECTURE` appended, move it immediately per the routing table. If not, read it, append architecture, then move.

**Routing table:**
- Strategy / Market Research / Product Roadmap → `owner: PRODDY` | `01_TRIAGE/`
- UI/UX / Layouts / CSS / Design → `owner: DESIGNER` | `02_DESIGN/`
- React / Python / Core App Logic → `owner: BUILDER` | `03_BUILD/`
- Database / SQL / Schema → `owner: SOOP` | `03_BUILD/`
- SEO / Copywriting / Pricing → `owner: MARKETER` | `03_BUILD/`
- Tracking / Metrics → `owner: ANALYST` | `03_BUILD/`

## Step 4: Check 04_QA for stuck rejections
// turbo
```bash
ls /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/04_QA/
grep -l "failure_count: [1-9]" /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/04_QA/*.md 2>/dev/null
```

Any ticket with `failure_count: 1` that has been in 04_QA more than one session → LEAD must read the rejection, fix it directly if it's a simple issue (< 30 min), or re-route to the correct agent.

## Step 5: Verify 01_TRIAGE for completed PRODDY work
// turbo
```bash
grep -l "COMPLETE\|APPROVED\|owner: LEAD" /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/01_TRIAGE/*.md 2>/dev/null
```

Any PRODDY ticket marked COMPLETE with `owner: LEAD` → LEAD must create follow-on work orders and route them.

## Step 6: Report pipeline state

After completing all moves, report:

| Queue | Count | Action Taken |
|-------|-------|-------------|
| 00_INBOX | N | Routed X tickets |
| 01_TRIAGE | N | N PRODDY pending, N awaiting LEAD |
| 02_DESIGN | N | N DESIGNER tickets |
| 03_BUILD | N | N BUILDER + N SOOP (all verified correct) |
| 04_QA | N | N pending INSPECTOR, N rejections resolved |
| 05_USER_REVIEW | N | Awaiting user |

**LEAD does not stop until every queue is clean.**
