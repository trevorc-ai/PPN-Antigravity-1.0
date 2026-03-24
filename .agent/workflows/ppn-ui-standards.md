---
description: /ppn-ui-standards — Enforce PPN UI Standards on a target file. Audits, reports violations, and fixes them. This is an ENFORCEMENT workflow, not a reference doc.
---

# `/ppn-ui-standards` — UI Standards Enforcement Workflow

> **Usage:** `/ppn-ui-standards [filename]`
> If no filename is given, target the file currently open in the editor or the last file mentioned in the conversation.
> This workflow AUDITS and FIXES. It does not just present rules.

---

## Step 1: Identify the Target File

Confirm the target file with the user if ambiguous. State:
> "Running ppn-ui-standards enforcement on `[filename]`."

Read the full file before running any grep commands.

---

## Step 2: Run the Audit (all 8 checks — mandatory)

Run each grep command against the target file. Record every match as a violation.

```bash
# CHECK 1: Bare text-xs (must be paired with md:text-sm — standalone is a Rule 2 violation)
grep -n 'text-xs\b' <file> | grep -v 'md:text-sm\|sm:text-sm\|print:\|/\*\|<!--'

# CHECK 2: Sub-pixel font sizes (banned everywhere)
grep -n 'text-\[8px\]\|text-\[9px\]\|text-\[10px\]\|text-\[11px\]' <file>

# CHECK 3: Em dashes in rendered content (Rule 4)
grep -n '—\|" - "\| - ' <file> | grep -v '/\*\|<!--\|//\|changelog\|Changelog'

# CHECK 4: Near-invisible low-contrast text (Rule 6)
grep -n 'text-slate-700\|text-gray-[1-4]00\|text-slate-800' <file> | grep -v 'border\|bg-\|/\*'

# CHECK 5: Bare grid-cols without mobile-first breakpoint (Rule 8b)
grep -n 'grid-cols-[2-9]\b' <file> | grep -v 'md:\|lg:\|sm:'

# CHECK 6: Hardcoded pixel widths on layout containers (Rule 8a)
grep -n 'w-\[.*px\]\|min-w-\[.*px\]' <file> | grep -v 'max-w-\|/\*'

# CHECK 7: Native <details> elements (no controlled open state = no auto-close)
grep -n '<details\|<summary' <file> | grep -v '/\*\|<!--'

# CHECK 8: Banned fonts
grep -n 'JetBrains\|Courier New\|font-serif' <file> | grep -v '/\*\|<!--'
```

---

## Step 3: Report Violations

If violations are found, present a table before fixing anything:

| # | Line | Check | Violation | Required Fix |
|---|---|---|---|---|
| 1 | 42 | CHECK 1 | `text-xs text-slate-500` | Add `md:text-sm` |
| 2 | 64 | CHECK 4 | `text-slate-700` on dark bg | Upgrade to `text-slate-400` |

If no violations are found, post:
> "**Audit complete. Zero violations found.** `[filename]` passes all 8 ppn-ui-standards checks."
> Then STOP.

---

## Step 4: Fix Each Violation

Fix all violations in the target file. Apply fixes:

| Violation | Fix |
|---|---|
| Bare `text-xs` | Add `md:text-sm`: `text-xs md:text-sm` |
| Sub-pixel fonts | Replace with `text-sm` |
| Em dash `—` in body text | Replace with `, ` (comma + space) |
| `text-slate-700` on dark bg | Upgrade to `text-slate-500` or `text-slate-400` |
| `text-gray-[1-4]00` | Upgrade to nearest compliant token |
| Bare `grid-cols-N` | Add mobile-first prefix: `grid-cols-1 md:grid-cols-N` |
| `<details>/<summary>` | Replace with controlled React state accordion |
| Hardcoded px width | Replace with `max-w-*` or responsive pattern |
| Banned font | Replace with `Inter` / `Roboto Mono` |

> [!IMPORTANT]
> Per GLOBAL_CONSTITUTION: do NOT fix any file not explicitly opened for this command. If a violation exists in a different file, note it and stop.

---

## Step 5: Run TypeScript Check (TSX files only)

```bash
cd /Users/trevorcalton/Desktop/PPN-Antigravity-1.0 && npx tsc --noEmit 2>&1 | head -30
```

If errors are found, fix only the errors introduced by this session's changes.

---

## Step 6: Confirm and Close

Post to user:

> **ppn-ui-standards enforcement complete on `[filename]`.**
> Fixed N violations: [list each one with line number and what changed]
> TypeScript: [PASS / errors found — see above]

---

## Reference: Full Standards

The authoritative standards document is `.agent/skills/ppn-ui-standards/SKILL.md` (v1.4, 380 lines).
This workflow enforces the most common violations. For edge cases, read the skill file.

---

## Changelog

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-02-23 | INSPECTOR | Initial standards reference |
| 1.1–1.3 | 2026-03-21/22/23 | LEAD/PRODDY | Rules updated (reference doc era) |
| 2.0 | 2026-03-24 | ANTIGRAVITY | **ENFORCEMENT REWRITE.** Converted from passive reference doc to active enforcement workflow. Added 8 grep audit checks, violation table, per-violation fix instructions, TypeScript gate, and confirmation output. Root cause fix for standards violations persisting because agents read rules but had no enforcement step-by-step procedure. |