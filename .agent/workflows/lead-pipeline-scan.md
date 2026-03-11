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
- `owner: BUILDER` - Correct, leave it
- `owner: SOOP` - Correct (SOOP works from 03_BUILD), but flag if stalled > 1 session
- `owner: MARKETER` - Wrong. Move to `02_TRIAGE/`
- `owner: ANALYST` - Wrong. Move to `02_TRIAGE/`
- `owner: DESIGNER` - Wrong. Move to `01_DESIGN/`
- `owner: PRODDY` - Wrong. Move to `02_TRIAGE/`
- `owner: USER` - Wrong. Move to `05_USER_REVIEW/`
- `owner: LEAD` (reference docs, no build work) - Wrong. Move to `02_TRIAGE/`

**FIFO check:** List all files in 03_BUILD. Confirm they are numbered sequentially. If a WO with a higher number exists alongside a lower number, flag it for LEAD: the higher-numbered WO needs a `skip_approved_by:` entry or must be returned to `02_TRIAGE`.

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
- Strategy / Market Research / Product Roadmap - `owner: PRODDY` | `02_TRIAGE/`
- UI/UX / Layouts / CSS / Design - `owner: DESIGNER` | `01_DESIGN/`
- React / Python / Core App Logic - `owner: BUILDER` | `03_BUILD/`
- Database / SQL / Schema - `owner: SOOP` | `03_BUILD/`
- SEO / Copywriting / Pricing - `owner: MARKETER` | `03_BUILD/`
- Tracking / Metrics - `owner: ANALYST` | `03_BUILD/`

## Step 4: Check 04_QA for stuck rejections
// turbo
```bash
ls /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/04_QA/
grep -l "failure_count: [1-9]" /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/04_QA/*.md 2>/dev/null
```

Any ticket with `failure_count: 1` that has been in 04_QA more than one session → LEAD must read the rejection, fix it directly if it's a simple issue (< 30 min), or re-route to the correct agent.

## Step 5: Audit 98_HOLD — unblock or escalate
// turbo
```bash
ls /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/98_HOLD/
```

For every WO in 98_HOLD, read its `hold_reason:` frontmatter field.
- If the blocker is now resolved, move back to the appropriate queue and update `status:` and clear `hold_reason:`.
- If the blocker is pending user input, surface it to the user immediately in Step 6.
- If the WO has been in 98_HOLD for more than one full session, it becomes P0 to resolve.

## Step 6: Verify 02_TRIAGE for completed PRODDY work
// turbo
```bash
grep -l "COMPLETE\|APPROVED\|owner: LEAD" /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/02_TRIAGE/*.md 2>/dev/null
```

Any PRODDY ticket marked COMPLETE with `owner: LEAD` - LEAD must create follow-on work orders and route them.

## Step 7: Report pipeline state (on request only)

Only produce a pipeline state report if the user explicitly asks for one (e.g. "show me the pipeline", "what's in the queues?"). Do NOT auto-generate a report after every scan.

If requested, report using this format:

| Queue | Count | Action Taken |
|-------|-------|-------------|
| 00_INBOX | N | Routed X tickets |
| 01_DESIGN | N | N DESIGNER tickets |
| 02_TRIAGE | N | N PRODDY pending, N awaiting LEAD |
| 03_BUILD | N | N BUILDER + N SOOP. Next WO: [lowest #] |
| 04_QA | N | N pending INSPECTOR, N rejections resolved |
| 04_REVIEW | N | Awaiting LEAD review |
| 05_USER_REVIEW | N | Awaiting user |
| 097_BACKLOG | N | [List blockers] |
| 98_HOLD | N | [List hold reasons - escalate if > 1 session] |

**LEAD does not stop until every queue is clean.**
