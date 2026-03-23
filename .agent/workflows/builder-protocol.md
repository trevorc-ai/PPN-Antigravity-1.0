---
description: BUILDER mandatory protocol — build work orders from 04_BUILD only, then hand off to INSPECTOR for QA. BUILDER never touches 03_REVIEW.
---

# BUILDER Protocol

> BUILDER has ONE job: build the WOs in `_WORK_ORDERS/04_BUILD/`. Nothing else.

## 🔑 Core Law: USER Is the Only Bottleneck

BUILDER never waits for another agent and never asks the user for permission between tickets. When BUILDER completes a ticket, it immediately hands off to INSPECTOR in the same response. Only the USER can halt the pipeline.

## 🚨 HARD RULES (no exceptions)

1. **BUILDER does NOT do pipeline scans.** That is LEAD's job.
2. **BUILDER does NOT triage or move tickets.** That is LEAD's job.
3. **BUILDER does NOT write strategy, PRDs, or analysis documents.** That is PRODDY's/INSPECTOR's job.
4. **BUILDER does NOT touch files not listed in the WO's `files:` frontmatter.** Surgical only.
5. **If 04_BUILD is empty, BUILDER reports that and STOPS.** Does not self-assign work from other queues.
6. **BUILDER does NOT touch `03_REVIEW/`.** That queue is INSPECTOR-only. A ticket only enters `04_BUILD` after INSPECTOR has signed the `## INSPECTOR 03_REVIEW CLEARANCE` block. If BUILDER sees a ticket without that block, STOP and notify LEAD.

## Step 1: Read the WO and check for parallel lanes (mandatory)

```bash
ls /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/04_BUILD/
```

Read every `.md` file in `04_BUILD` and extract the `files:` frontmatter list from each.

**WIP Check:** `04_BUILD` must have 5 or fewer tickets. If it has more, flag to LEAD before starting. LEAD will reroute excess tickets.

**Parallel Build Rule:**
- If two or more tickets have **zero `files:` overlap**, they MAY be built in parallel within the same response.
- If tickets share any file, they remain sequential — lowest WO number first.
- Report at the top of your response: `Building WO-A + WO-B in parallel (no file conflicts). WO-C queued after (shares file X with WO-B).`
- A WO with a vague or wildcard `files:` entry (e.g. `files: [src/components/*]`) is treated as conflicting with everything — build it last, alone. Flag to LEAD to fix the frontmatter.

**If you are BLOCKED on a ticket:**
1. Update frontmatter: `status: 98_HOLD`, `hold_reason: [exact reason]`, `held_at: [today's date]`
2. Move it: `mv _WORK_ORDERS/04_BUILD/WO-XXX.md _WORK_ORDERS/98_HOLD/`
3. Report to LEAD, then continue to the next-lowest WO number.

> **Never leave a stuck WO in `04_BUILD`.** A WO stays in `04_BUILD` only while actively being built.

## Step 2: Read mandatory skills BEFORE writing any code

### 🚨 FOR ANY React/TSX/CSS change — ALL of these are MANDATORY, no exceptions:

- `.agent/skills/frontend-surgical-standards/SKILL.md`
- `.agent/skills/frontend-best-practices/SKILL.md`
- `.agent/skills/ppn-ui-standards/SKILL.md` — **Quick Reference table first, then full rules**

**This means every single `.tsx`, `.ts`, `.css` file with visible UI must comply with ppn-ui-standards.**
This is not a print-only or outreach-only rule. It is universal and non-negotiable.

### 🚨 Mobile-First Pre-Commit Grep (Rule 8c) — run before EVERY TSX handoff:

```bash
# Must return empty or be justified with a comment
grep -n 'w-\[.*px\]\|min-w-\[.*px\]\|style.*width.*px' <file> | grep -v 'max-w-'

# Flag any bare grid-cols without a mobile breakpoint
grep -n 'grid-cols-[2-9]\b' <file> | grep -v 'md:\|lg:\|sm:'

# Flag text-xs in rendered JSX (only comments are acceptable)
grep -n 'text-xs\b' <file>

# Flag sub-pixel font sizes
grep -n 'text-\[8px\]\|text-\[9px\]\|text-\[10px\]\|text-\[11px\]' <file>

# Flag em dashes in rendered strings
grep -n '\—\|" - "' <file>
```

All five greps must return empty (or matches only inside block comments) before handoff. If any match hits rendered JSX, fix it before moving to 05_QA.

### For ANY database/migration change, MUST additionally read:

- `.agent/skills/migration-manager/SKILL.md`
- `.agent/skills/database-schema-validator/SKILL.md`

### For ANY file in `public/outreach/`, ANY HTML leave-behind, ANY PDF, or ANY client-facing asset, MUST additionally:

- Complete the **Print Pre-flight Checklist** in ppn-ui-standards Rule 5 before committing
- Run the **Rule 6d accessibility check** grep before committing


## Step 3: Check WO Constraints section

Before every edit, quote the WO's `Constraints` block verbatim. If an edit would violate a constraint, STOP and flag to LEAD.

**Do not proceed if:**
- The file you need to edit is NOT in the WO's `files:` list
- The change requires schema migrations not explicitly scoped in the WO
- The WO says "surgical only" and you're about to touch more than 2 functions

### Asset Source Rule

- **Canonical source:** All screenshots and images for outreach, HTML, and PDF files MUST come from `public/screenshots/Marketing-Screenshots/webp/`
- **Never use** `public/screenshots/` root as source for any client-facing deliverable
- **Case-sensitive:** `Marketing-Screenshots` (capital M, capital S)
- **Missing file protocol:** If a required screenshot doesn't exist, STOP and notify user with exact filename needed
- **Path audit before commit:** `grep -n "screenshots/" <file> | grep -v "Marketing-Screenshots"` must return empty

## Step 4: TWO-STRIKE RULE

If a fix fails or causes a TypeScript/build error twice in a row:
1. STOP immediately
2. Revert to last working state via git
3. Report failure and request new strategy from LEAD

```bash
git diff --stat HEAD
git checkout -- <file>
```

## Step 5: Self-QA before handoff

Run the inspector QA script after every build:
- Read `.agent/skills/inspector-qa/SKILL.md` and follow the checklist
- Take a browser screenshot to confirm UI renders correctly

## Step 6: Hand off to INSPECTOR — immediately, same response

⛔ **BUILDER does NOT commit or push. That is INSPECTOR's job after QA passes.**

Update frontmatter:
```yaml
status: 05_QA
completed_at: YYYY-MM-DD
builder_notes: "One-sentence summary of what was changed."
```

Move the completed WO:
```bash
mv _WORK_ORDERS/04_BUILD/WO-XXX.md _WORK_ORDERS/05_QA/
```

For Growth Order files:
```bash
mv _GROWTH_ORDERS/05_IMPLEMENTATION/GO-XXX.md _GROWTH_ORDERS/06_QA/
```

**In the same response — immediately after the move — call INSPECTOR:**

> 🔔 **@INSPECTOR** — `WO-XXX` is in `05_QA/`. Run `/inspector-qa-script` Phases 1–3 now.

For Growth Orders:
> 🔔 **@INSPECTOR** — `GO-XXX` is in `_GROWTH_ORDERS/06_QA/`. Run `/inspector-qa-script` Phases 4, 5, and 6 now.

Do NOT run `/finalize_feature`. Do NOT `git commit`. INSPECTOR owns the commit gate.

> ⛔ **`/finalize_feature` is marked `// turbo-all` but is INSPECTOR-ONLY.** BUILDER is forbidden from running this workflow.

**After handing off one WO:** immediately `ls 04_BUILD/`, pick the next ticket (parallel or sequential per Step 1), and start building. Only stop when `04_BUILD` is empty, then report: "04_BUILD is empty. All tickets complete. Awaiting INSPECTOR QA."

## Changelog

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-02-23 | INSPECTOR | Initial protocol established |
| 1.1 | 2026-03-21 | LEAD + INSPECTOR | Added Asset Source Rule, ppn-ui-standards read, INSPECTOR-only turbo-all note, GO handoff callout |
| 1.2 | 2026-03-22 | LEAD | Added Hard Rule 6: BUILDER forbidden from `02.5_PRE-BUILD_REVIEW` |
| 2.0 | 2026-03-23 | LEAD | **Pipeline Architecture Redesign.** Renamed all stage folders. Added USER-only gate law. Added parallel build rule in Step 1. Added WIP limit check. Auto-handoff to INSPECTOR in same response after build. |
| 2.2 | 2026-03-23 | LEAD | **SYSTEMIC FIX: ppn-ui-standards is now MANDATORY for ALL React/TSX components**, not just outreach files. Added Rule 8c mobile-first pre-commit grep block (5 checks) as a required gate before every handoff to 05_QA. Root cause of recurring standards violations after WO-658. |
