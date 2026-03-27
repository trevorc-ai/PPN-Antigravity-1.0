---
description: LEAD mandatory pipeline scan — route every ticket, activate agents, and notify the user when blocked. Keep the pipeline moving.
---

## ⚡ LEAD's Two Distinct Jobs

LEAD operates in two modes during every scan. Both are mandatory:

### 1. TRIAGE (routing decisions)
When a ticket is in `00_INBOX` or `02_TRIAGE`, LEAD's job is to **decide which folder it moves to next** and move it there immediately.

- Classify the ticket type and priority
- Pick the correct next stage: `01_DESIGN`, `03_REVIEW`, `04_BUILD`, `98_HOLD`, or `_GROWTH_ORDERS/`
- `mv` it. Update frontmatter. Continue to the next ticket.
- `02_TRIAGE` must be empty after every scan. No ticket stays in triage because LEAD is unsure.

### 2. LEAD (pipeline momentum)
When a ticket is past triage — already in `03_REVIEW`, `04_BUILD`, `05_QA`, etc. — LEAD's job is to **keep it moving**:

- `03_REVIEW` with no INSPECTOR clearance → INSPECTOR runs the fast-pass NOW, in this response
- `04_BUILD` ready → Notify BUILDER to start on the lowest-numbered WO
- `05_QA` stuck → INSPECTOR runs QA NOW, in this response
- `98_HOLD` with a resolvable blocker → Resolve it or notify the USER directly with the exact question
- `06_USER_REVIEW` waiting → Surface to USER — this is the only permitted stop point for user-facing work

**LEAD never waits silently.** If something is stuck, LEAD either fixes it or immediately tells the user what decision is needed.

---

## ⚡ RULE 0 — FULL CHAIN EXECUTION

LEAD must complete the entire agent chain for every actionable ticket in a single response. All of the following happen inline, without stopping:

**_WORK_ORDERS chain:**
- LEAD triages → INSPECTOR fast-passes or rejects → ticket reaches `04_BUILD` or `98_HOLD`
- BUILDER notified → INSPECTOR QAs → ticket reaches `06_USER_REVIEW`

**_GROWTH_ORDERS chain:**
- GO lands in `00_BACKLOG` → MARKETER produces CONTENT_MATRIX immediately → GO moves to `02_USER_REVIEW` *(USER gate — stop here)*
- After USER approves copy → DESIGNER produces mockup → GO moves to `04_VISUAL_REVIEW` *(USER gate — stop here)*
- After USER approves design → BUILDER implements → INSPECTOR QAs → GO moves to `99_PUBLISHED`

**The only 3 permitted stop points:**
1. **`06_USER_REVIEW`** — USER visual sign-off before commit
2. **`_GROWTH_ORDERS/02_USER_REVIEW`** and **`_GROWTH_ORDERS/04_VISUAL_REVIEW`** — USER copy/design gates
3. **BUILDER writing actual code** — signals BUILDER to start; does not wait inline

Everything else is automated and must happen in the same response.

---

## 🔑 Core Law: USER Is the Only Bottleneck

**Agents do not wait for each other.** Every agent-to-agent handoff is automatic and immediate. The pipeline halts only at designated USER stages.

**USER gate stages (only permitted stop points):**
- `_WORK_ORDERS/06_USER_REVIEW/` — final visual sign-off before commit
- `_GROWTH_ORDERS/02_USER_REVIEW/` — copy approval
- `_GROWTH_ORDERS/04_VISUAL_REVIEW/` — design approval

At all other transitions, LEAD performs the next handoff action immediately in the same response.

---


## Step 0: Audit `_GROWTH_ORDERS` pipeline
// turbo
```bash
find /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_GROWTH_ORDERS -name "GO-*.md" ! -path "*/99_PUBLISHED/*" | sort
```

For every GO ticket found:
- Confirm the file is in the folder matching its `status:` frontmatter. If misrouted, `mv` it.
- Any GO stuck in `01_DRAFTING` without a `CONTENT_MATRIX.md` alongside it: MARKETER must produce one immediately in the same response (no user prompt — USER is not the bottleneck here).
- Any GO in `02_USER_REVIEW` without user response: surface it to the user. This is a USER gate — the only legitimate stop.
- Any GO in `05_IMPLEMENTATION` without a deliverable file committed: LEAD moves to `04_BUILD`, BUILDER starts immediately.
- Any GO in `06_QA`: INSPECTOR must be running. If not, call INSPECTOR now in this same response.

---

## Step 0.5: FREEZE Check (run before routing any ticket)
// turbo
```bash
cat /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/FREEZE.md 2>/dev/null || echo "FREEZE.md not found — no frozen files"
```

For every WO in `00_INBOX` or `02_TRIAGE` being considered for routing to `04_BUILD`:
- Read the WO's `files:` frontmatter field
- Cross-reference each file against `FREEZE.md`
- If ANY file appears in `FREEZE.md`: set `status: 98_HOLD`, `hold_reason: frozen file — user must unfreeze first`, `mv` to `98_HOLD/`. Do NOT route to `04_BUILD`.

---

## Step 0.75: Growth Orders Gate

For every WO in `00_INBOX` or `02_TRIAGE` being considered for `04_BUILD`, check:

**Is this WO public-facing?** (landing page, marketing page, public route, outreach copy, PDF, email, visitor-facing UI)

- **If YES:** WO MUST have `growth_order_ref: GO-XXX` in frontmatter AND that GO must be at `05_IMPLEMENTATION` or later. If missing: `mv` to `98_HOLD/`, `hold_reason: public-facing WO missing growth_order_ref`. Notify user — this is a USER gate decision.
- **If NO:** Proceed to routing normally.

---

## Step 0.8: Full Agent Chain Conformance Check

Every PRODDY-originated WO must have passed through every mandatory agent in the chain. At routing time, LEAD verifies:

**WO chain:** PRODDY → LEAD (triage) → DESIGNER (`01_DESIGN`) → INSPECTOR (`03_REVIEW`) → BUILDER (`04_BUILD`) → INSPECTOR (`05_QA`) → USER (`06_USER_REVIEW`)

If a WO is attempting to skip `01_DESIGN` with no `stage_waived_by: USER` in frontmatter → send back to `01_DESIGN`. DESIGNER produces UX spec immediately in the same response.

---

## Step 0.9: 04_BUILD WIP Check
// turbo
```bash
ls /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/04_BUILD/ | grep -c ".md" || echo "0"
```

**WIP Limit: 5 tickets maximum in `04_BUILD`.**
If count >= 5: do NOT route more tickets in. Excess stays in `03_REVIEW` or `02_TRIAGE` until a slot opens.

---

## Step 1: Audit `03_REVIEW` queue
// turbo
```bash
ls /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/03_REVIEW/ 2>/dev/null || echo "(empty)"
```

For every ticket in `03_REVIEW`:
- If it has an `## INSPECTOR 03_REVIEW CLEARANCE` block signed by INSPECTOR → LEAD moves to `04_BUILD` **immediately in this same response**. No user prompt.
- If stuck here more than one session without INSPECTOR clearance → INSPECTOR must clear or reject **now, in this same response**.
- `database_changes: no` + pure UI ticket → INSPECTOR fast-passes: append `## INSPECTOR 03_REVIEW CLEARANCE: FAST-PASS — no DB impact` and LEAD moves to `04_BUILD` immediately.

---

## Step 2: Auto-handoff after any ticket move

Execute all `mv` commands immediately. No pre-move check. No user acknowledgment required before routing tickets between stages.

---

// turbo
```bash
# Example — adapt to what Step 1 found:
# mv /path/to/03_REVIEW/WO-XXX.md /path/to/04_BUILD/
```

**After every `mv`, perform the auto-handoff in the same response:**

| Stage ticket moves to | Immediate action in same response |
|---|---|
| `03_REVIEW/` | Call INSPECTOR to clear or reject |
| `04_BUILD/` | Notify BUILDER: ticket ready, start lowest-numbered WO |
| `05_QA/` | Call INSPECTOR: run QA phases 1–3 |
| `06_USER_REVIEW/` | Notify USER — STOP. Wait for human. |

---

## Step 3: Audit 00_INBOX and 02_TRIAGE — read every ticket and advance it
// turbo
```bash
ls /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/00_INBOX/
ls /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/02_TRIAGE/
```

**For every ticket found, LEAD must:**

1. **Read the ticket.** Not skim — read it. Understand the problem, the scope, the open questions.
2. **Determine what this specific ticket needs to move forward.** Ask: "What is the next action that unblocks this ticket?" The answer is always one of:
   - It needs a **UX/product spec** → `01_DESIGN/`, DESIGNER starts now
   - It needs **INSPECTOR pre-review** (DB changes, risk, scope questions) → `03_REVIEW/`, INSPECTOR clears it now
   - It needs **LEAD architecture** appended (no LEAD block yet) → write it inline, then route to `03_REVIEW/`
   - It is **ready to build** (INSPECTOR-clearable, files defined, no DB changes) → INSPECTOR fast-passes it, route to `04_BUILD/`
   - It needs a **USER decision** on an open question before any agent can act → `98_HOLD/` with exact question, notify USER at end of scan
   - It is **marketing/outreach** → move to `_GROWTH_ORDERS/00_BACKLOG/` as a GO, MARKETER starts now
3. **Take the action immediately.** `mv` the ticket. Update frontmatter. Do not stop or ask for permission.
4. **Continue to the next ticket.** One blocked ticket never halts the queue.

**After processing all tickets:** Report any that went to `98_HOLD` with the exact question needed from the USER. Surface these as a list at the end — never interrupt mid-scan.

**Exception logging rule:** For every ticket that does NOT route to `04_BUILD`, LEAD must write one line explaining why in the scan summary: `WO-XXX → [destination] — [one sentence reason]`. No explanation needed for tickets that reach `04_BUILD`.

**`02_TRIAGE` and `00_INBOX` must be empty after every scan.**

---



## Step 4: Check 05_QA for stuck rejections
// turbo
```bash
ls /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/05_QA/
grep -l "failure_count: [1-9]" /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/05_QA/*.md 2>/dev/null
```

Any ticket with `failure_count: 1` in `05_QA` more than one session → LEAD reads the rejection and fixes it directly or re-routes. No wait for user.

---

## Step 5: Audit 98_HOLD — unblock or escalate
// turbo
```bash
ls /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/98_HOLD/
```

For every WO in `98_HOLD`, read its `hold_reason:`:
- Blocker is now resolved → move back to appropriate queue immediately. No user prompt (unless it's a USER gate).
- Blocker pending user input → surface to user. This is a USER gate — the only legitimate stop.
- In `98_HOLD` more than one session → P0 to resolve this session.

---

## Step 6: Verify 02_TRIAGE for completed PRODDY work
// turbo
```bash
grep -l "COMPLETE\|APPROVED\|owner: LEAD" /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/02_TRIAGE/*.md 2>/dev/null
```

Any PRODDY ticket marked COMPLETE with `owner: LEAD` → LEAD creates follow-on work orders and routes them immediately.

---

## Step 7: Report pipeline state (on request only)

Only produce a pipeline state report if the user explicitly asks. Do NOT auto-generate after every scan.

| Queue | Count | Action Taken |
|-------|-------|-------------|
| 00_INBOX | N | Routed X tickets |
| 01_DESIGN | N | N DESIGNER tickets |
| 02_TRIAGE | N | N PRODDY pending, N awaiting LEAD |
| 03_REVIEW | N | N pending INSPECTOR clearance, N fast-passed |
| 04_BUILD | N | N BUILDER tickets (max 5). Next WO: [lowest #]. Parallel: [list] |
| 05_QA | N | N pending INSPECTOR, N rejections resolved |
| 06_USER_REVIEW | N | Awaiting user visual confirmation — PIPELINE PAUSED |
| 90_BACKLOG | N | [List blockers] |
| 98_HOLD | N | [List hold reasons — escalate if > 1 session] |

**LEAD does not stop until every agent-owned queue is actioned. Only USER-gate stages may remain pending.**

---

## Step 8: Session Handoff (end of session only)

Run `/session-handoff` to update `SESSION_HANDOFF.md`. This is LEAD's final action every session.

---

## Changelog

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-02-23 | INSPECTOR | Initial scan protocol established |
| 1.1 | 2026-03-21 | LEAD | Added Step 0 (`_GROWTH_ORDERS` audit), Step 0.5 (FREEZE check), Step 8 (session handoff) |
| 1.2 | 2026-03-22 | LEAD | Added Step 0.75 (Growth Orders Gate) |
| 1.3 | 2026-03-22 | LEAD | Added Step 1 `02.5_PRE-BUILD_REVIEW` queue audit. Removed `04_REVIEW` row. |
| 2.0 | 2026-03-23 | LEAD | **Pipeline Architecture Redesign.** All stage folders renamed to strict numerical order. Added USER-Only Gate Law. Added full agent chain conformance check (Step 0.8). Added WIP limit check (Step 0.9). Added auto-handoff table in Step 2. BUILDER parallel build rule. Renamed all folder references throughout. |
| 2.1 | 2026-03-24 | LEAD | Added Open-File Guard in Step 2: LEAD must check if a file is open in the user's active editor before executing `mv`. If open, surface as pending action and wait for acknowledgment. Prevents orphaned editor tabs during pipeline scans. |
| 2.2 | 2026-03-24 | LEAD | **Removed Open-File Guard.** The guard caused LEAD to pause on every ticket move since Agent Manager keeps files open constantly. All `mv` commands now execute immediately. No pre-move check. Only USER-gate stages are legitimate stop points. |
| 2.3 | 2026-03-25 | LEAD | Added Rule 0 — Full Chain Execution. LEAD must complete entire LEAD→INSPECTOR→DESIGNER chain in a single response. Only 3 permitted stops: BUILDER writing code, 06_USER_REVIEW, and Growth Order user gates. |
