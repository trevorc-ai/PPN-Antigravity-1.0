---
description: Mandatory safety checkpoint before any destructive or high-risk operation. Run BEFORE database migrations, shared component rewrites, or any operation that could cause data loss.
---

# Pre-Commit Safety Workflow

This workflow MUST be run before:
- Any Supabase database migration
- Rewriting or deleting a shared component (used by 2+ pages)
- Any `git reset`, `git rebase`, or `git restore`
- Any operation touching `supabase/migrations/`

## Steps

// turbo
1. Check git status to see what is currently uncommitted:
```
git -C /Users/trevorcalton/Desktop/PPN-Antigravity-1.0 status --short
```

// turbo
2. Stage and commit ALL current work with a descriptive message (checkpoint before risky op):
```
git -C /Users/trevorcalton/Desktop/PPN-Antigravity-1.0 add -A && git commit -m "chore(safety): checkpoint before [DESCRIBE_OPERATION_HERE]"
```

// turbo
3. Push to remote immediately so the checkpoint survives any local failure:
```
git -C /Users/trevorcalton/Desktop/PPN-Antigravity-1.0 push origin main
```

4. If the operation involves a SHARED COMPONENT, run a dependency check:
```
grep -r "COMPONENT_NAME" /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src --include="*.tsx" -l
```
List every file that imports the component. Review each one before editing.

5. If the operation involves a DATABASE MIGRATION:
- SOOP writes the `.sql` file only — never executes it
- Paste the migration content to the USER for review
- USER runs it in the Supabase dashboard
- SOOP verifies the live schema AFTER execution with a SELECT query

6. After the risky operation completes successfully, commit again:
```
git -C /Users/trevorcalton/Desktop/PPN-Antigravity-1.0 add -A && git commit -m "feat/fix: [DESCRIBE_WHAT_WAS_DONE]" && git push origin main
```

## Definition of "Risky Operation"
| Operation | Risk Level | Requires This Workflow |
|-----------|-----------|----------------------|
| New feature in isolated file | Low | No |
| Editing a shared component (2+ importers) | HIGH | YES |
| Database migration | CRITICAL | YES |
| Deleting/renaming files | HIGH | YES |
| Rewriting a component from scratch | HIGH | YES |
| Copy/text change only | Low | No |
| CSS/styling change only | Low | No |
