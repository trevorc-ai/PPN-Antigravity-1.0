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

## Step 1.5: Plan Gate — WO-as-Plan Rule

**The WO ticket satisfies Rule 8 (HARD PLAN GATE) when ALL of the following are true:**

1. The WO has a signed `## INSPECTOR 03_REVIEW CLEARANCE` block
2. The WO has a defined `files:` list in frontmatter (not empty, no wildcards)
3. `database_changes:` is `no` or absent

**When all 3 are true:** BUILDER skips writing `implementation_plan.md` entirely and starts coding immediately. The INSPECTOR-cleared WO IS the approved plan. No separate plan doc, no `notify_user` with `BlockedOnUser: true`, no waiting.

**When ANY of the following apply — a written plan is still REQUIRED before coding:**
- `database_changes: yes` — migration SQL must be written, reviewed, and explicitly approved
- WO touches a file within 1 level of FREEZE.md entries (e.g., same directory as a frozen file)
- WO has no `files:` list or uses wildcards (`src/components/*`)
- BUILDER discovers mid-build that the true scope exceeds what's in `files:` — STOP, write a scope amendment, wait for LEAD approval

> **The Two-Strike Rule (Step 4) still applies regardless of plan exemption.** A plan exemption is not a quality exemption.

**When a plan IS required — non-blocking submission:**
1. Write the plan and post it via `notify_user` (`BlockedOnUser: false` — user reviews async)
2. Tag the WO frontmatter `plan_status: pending_review`
3. **Immediately pick up the next ticket** in `04_BUILD` that has no dependency on this plan
4. When the user approves, implement the held ticket inline in that same response
5. If the user rejects the plan, move the ticket back to `03_REVIEW` with `hold_reason: plan rejected — [reason]`

> BUILDER does not sit idle waiting for plan approval. The next conflict-free ticket starts immediately.

## Step 2: Read mandatory skills BEFORE writing any code

### 🚨 FOR ANY React/TSX/CSS change — ALL of these are MANDATORY, no exceptions:

- `.agent/skills/frontend-surgical-standards/SKILL.md`
- `.agent/skills/frontend-best-practices/SKILL.md`
- `.agent/skills/ppn-ui-standards/SKILL.md` — **Quick Reference table first, then full rules**

**This means every single `.tsx`, `.ts`, `.css` file with visible UI must comply with ppn-ui-standards.**
This is not a print-only or outreach-only rule. It is universal and non-negotiable.

> 🗺️ **Omni-Channel Matrix (Rule 0) — cross-reference before writing ANY layout class.**
> Every component must be designed for all 4 states in a single pass:
> - **Mobile (default):** `flex-col`, 44px touch targets, `text-xs md:text-sm` floor
> - **Tablet (`md:`):** `md:grid-cols-2`, top/side nav restored, no bottom-sheet
> - **Desktop (`lg:`):** `lg:grid-cols-3+`, hover states, Deep Slate aesthetic
> - **Print (`print:`):** `print:bg-white print:text-slate-900 print:hidden` on nav
>
> Do NOT design for one context and add the others as patches. One pass, four states.

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

### 🚨 PPN UI Standards Automated Enforcement — run on EVERY modified file before handoff:

> This is NOT a manual read step. Run these commands. Report each result. Do not skip.

```bash
# CHECK 1: Bare text-xs without responsive upgrade (Rule 2 violation)
grep -n 'text-xs\b' <file> | grep -v 'md:text-sm\|sm:text-sm\|print:\|/\*\|<!--'

# CHECK 2: Near-invisible low-contrast text (Rule 6 violation)
grep -n 'text-slate-700\|text-gray-[1-4]00\|text-slate-800' <file> | grep -v 'border\|bg-\|/\*'

# CHECK 3: Native <details>/<summary> elements (no auto-close = UX violation)
grep -n '<details\|<summary' <file> | grep -v '/\*\|<!--'

# CHECK 4: Em dashes in rendered UI text (Rule 4 violation)
grep -n '—' <file> | grep -v '/\*\|<!--\|//\|Changelog\|changelog'

# CHECK 5: Banned fonts (Rule 2b violation)
grep -n 'JetBrains\|Courier New\|font-serif' <file> | grep -v '/\*\|<!--'
```

**Required output before any handoff:**
```
PPN UI Standards Enforcement — <filename>:
CHECK 1 (bare text-xs):   PASS / [N matches — fixed / justification]
CHECK 2 (low contrast):   PASS / [N matches — fixed / justification]
CHECK 3 (details/summary): PASS / [N matches — fixed]
CHECK 4 (em dash):        PASS / [N matches — fixed]
CHECK 5 (banned fonts):   PASS / [N matches — fixed]
```

Any FAIL that is not fixed = **do NOT move to 05_QA**. Fix first, then re-run.

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
| 2.3 | 2026-03-23 | LEAD | **Omni-Channel Matrix cross-reference added to Step 2.** BUILDER must check Rule 0 (Mobile/Tablet/Desktop/Print) before writing any layout class. Proactive fix prevents FLO from being the first agent to catch tablet layout and print: modifier violations. |
| 2.5 | 2026-03-25 | LEAD | **WO-as-Plan rule added (Step 1.5).** INSPECTOR-cleared WOs with defined files: list satisfy Rule 8 automatically — BUILDER skips implementation_plan.md and starts coding immediately. Exceptions: DB migrations, wildcards, frozen-adjacent files. |
| 2.4 | 2026-03-24 | ANTIGRAVITY | **PPN UI Standards Automated Enforcement gate added.** 5-check grep block (bare text-xs, low contrast, native details/summary, em dash, banned fonts) is now a mandatory pre-handoff step with required PASS/FAIL output. Root cause fix: standards were read but not verified, allowing violations to reach QA and production. |
