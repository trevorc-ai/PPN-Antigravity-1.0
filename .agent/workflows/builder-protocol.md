---
description: BUILDER mandatory protocol — build work orders from 03_BUILD only, then hand off to INSPECTOR for QA
---

# BUILDER Protocol

> BUILDER has ONE job: build the WOs in `_WORK_ORDERS/03_BUILD/`. Nothing else.

## 🚨 HARD RULES (no exceptions)

1. **BUILDER does NOT do pipeline scans.** That is LEAD's job.
2. **BUILDER does NOT triage or move tickets.** That is LEAD's job.
3. **BUILDER does NOT write strategy, PRDs, or analysis documents.** That is PRODDY's/INSPECTORS's job.
4. **BUILDER does NOT touch files not listed in the WO's `files:` frontmatter.** Surgical only.
5. **If 03_BUILD is empty, BUILDER reports that and STOPS.** Does not self-assign work from other queues.

## Step 1: Read the WO (mandatory)

```bash
ls /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/03_BUILD/
```

Read every `.md` file in `03_BUILD`. **Sort by WO number ascending. Build the lowest-numbered WO first, always.** Priority (P0/P1/P2) is a tiebreaker only when two WOs share the same number prefix. You may NOT skip to a higher-numbered WO unless LEAD or INSPECTOR has explicitly approved it in writing via a `skip_approved_by:` field in that WO's frontmatter.

**If you are BLOCKED on the lowest WO** (build error, missing dependency, out-of-scope change):
1. Update frontmatter: `status: 98_HOLD`, `hold_reason: [exact reason]`, `held_at: [today's date]`
2. Move it: `mv _WORK_ORDERS/03_BUILD/WO-XXX.md _WORK_ORDERS/98_HOLD/`
3. Report to LEAD, then continue to the next-lowest WO number.

> **Never leave a stuck WO in `03_BUILD`.** A WO stays in `03_BUILD` only while it is actively being built.

## Step 2: Read mandatory skills BEFORE writing any code

For ANY React/TSX/CSS change, MUST read:
- `.agent/skills/frontend-surgical-standards/SKILL.md`
- `.agent/skills/frontend-best-practices/SKILL.md`

For ANY database/migration change, MUST read:
- `.agent/skills/migration-manager/SKILL.md`
- `.agent/skills/database-schema-validator/SKILL.md`

## Step 3: Check the WO Constraints section

Before every edit, quote the WO's `Constraints` or `Constraints` block verbatim.
If an edit would violate a constraint, STOP and flag to LEAD.

**Do not proceed if:**
- The file you need to edit is NOT in the WO's `files:` list
- The change requires schema migrations not explicitly scoped in the WO
- The WO says "surgical only" and you're about to touch more than 2 functions

## Step 4: TWO-STRIKE RULE

If a fix fails or causes a TypeScript/build error twice in a row:
1. STOP immediately
2. Revert to last working state via git
3. Report the failure and request new strategy from LEAD

```bash
git diff --stat HEAD  # check what changed
git checkout -- <file>  # revert a specific file if needed
```

## Step 5: QA before marking done

Run the inspector QA script after every build:
- Read `.agent/skills/inspector-qa/SKILL.md` and follow the checklist
- Take a browser screenshot to confirm the UI renders correctly

## Step 6: Hand off to INSPECTOR — do NOT commit yet

⛔ **BUILDER does NOT commit or push after a build. That is INSPECTOR's job after QA passes.**

Before moving the WO, update ALL of the following frontmatter fields:

```yaml
status: 04_QA
completed_at: YYYY-MM-DD
builder_notes: "One-sentence summary of what was changed."
```

Then move the completed WO to `04_QA`:

```bash
mv _WORK_ORDERS/03_BUILD/WO-XXX.md _WORK_ORDERS/04_QA/
```

Then **immediately call INSPECTOR for QA** by posting:

> 🔔 **@INSPECTOR** — `WO-XXX` is ready for QA in `04_QA/`. Please run `/inspector-qa-script` and report results.

Do NOT run `/finalize_feature`. Do NOT `git commit`. INSPECTOR owns the commit gate.

**What happens after INSPECTOR approves:** INSPECTOR runs `/finalize_feature`, which is `// turbo-all` — it stages, commits, and pushes automatically with no user approval gate. The WO then moves to `99_COMPLETED/`. The entire chain from BUILDER handoff to live deployment is fully automated.

> **Auto-continue rule:** A ticket in `03_BUILD` is pre-approved. No user confirmation is needed between tickets. After handing off one WO, immediately `ls 03_BUILD/`, pick the next highest-priority file, and start building it. Only stop when `03_BUILD` is empty, then report: "03_BUILD is empty. All tickets complete. Awaiting INSPECTOR QA."


