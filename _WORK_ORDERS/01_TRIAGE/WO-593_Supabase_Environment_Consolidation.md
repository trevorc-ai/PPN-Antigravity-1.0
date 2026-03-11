# WO-593 — Supabase Environment Consolidation

**Status:** 01_TRIAGE
**Author:** INSPECTOR
**Date:** 2026-03-10
**Priority:** HIGH — infrastructure clarity before new practitioners onboard

---

## Background

During the initial production database setup, two separate Supabase projects were created:

| Project Ref | Original Intent | Actual Current Role |
|---|---|---|
| `nmdhhlwytxmedipgugkx` | "Staging" | ✅ **LIVE PRODUCTION** — this is what ppnportal.net reads from |
| `rxwsthatjhnixqsthegf` | "Production" | ❌ Empty shell — schema partially applied, no working data |

The `.env.local` and the live Vercel deployment both point to the `nmdhhlwytxmedipgugkx` project.
The `.env` file (now gitignored and untracked) pointed to `rxwsthatjhnixqsthegf`.

This situation happened because the DB rebuild was chaotic and the staging project was the one that ended up working. This is now the **permanent production database** — and should be treated as such going forward.

---

## Decision: Consolidate to One Project

**Keep:** `nmdhhlwytxmedipgugkx` (currently called "ppn-staging" in Supabase dashboard — **rename this to "PPN Portal Production"**)

**Delete:** `rxwsthatjhnixqsthegf` (original production project — empty, broken, no real data)

---

## Pre-Deletion Audit Checklist

Before deleting `rxwsthatjhnixqsthegf`, verify each item:

- [ ] **Confirm zero real patient data** — run in that project's SQL editor:
  ```sql
  SELECT COUNT(*) FROM log_clinical_records;
  SELECT COUNT(*) FROM log_user_sites;
  SELECT COUNT(*) FROM auth.users;
  ```
  All three should return 0 or only test/demo rows.

- [ ] **Confirm live site is NOT using this project** — check that Vercel env vars point to `nmdhhlwytxmedipgugkx`
  - Go to: Vercel Dashboard → PPN Portal → Settings → Environment Variables
  - Confirm `VITE_SUPABASE_URL` = `https://nmdhhlwytxmedipgugkx.supabase.co`

- [ ] **Confirm `.env.local` points to the keeper project** *(already verified — it does)*

- [ ] **Confirm `.env` is gitignored and no longer tracked** *(already done in cleanup commit `9c5204c`)*

- [ ] **Back up the schema of `rxwsthatjhnixqsthegf`** just in case — download via:
  Supabase Dashboard → Project → Settings → Database → Schema Visualizer → Export

---

## After Deletion

- [ ] **Rename `nmdhhlwytxmedipgugkx`** in Supabase dashboard from "ppn-staging" → "PPN Portal Production"
- [ ] Update `.env.example` comment to say `VITE_SUPABASE_URL` → PPN Portal Production project
- [ ] Update `.env.local` header comment — change "STAGING Environment" → "Production Environment (local overrides)"

---

## Going Forward: How to Test Without a Second DB

**Recommended approach (no extra cost, no second Supabase project):**

Use the [Supabase CLI](https://supabase.com/docs/guides/local-development) to run a local database for development testing:

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Start a local Supabase instance (Docker required)
supabase start

# Local URL: http://localhost:54321
# Local anon key: printed on startup
```

Set `.env.local` to point to localhost when running `npm run dev` for local testing.
This gives you a disposable test environment without risking production data.

**Alternative (no Docker):** Use the production DB directly but prefix all test patients with `PT-TEST-` in the reference field — and add a cleanup SQL to periodically purge test rows. (Less clean but zero setup cost.)

---

## Acceptance Criteria

- [ ] Production Supabase project confirmed, renamed, and clearly documented
- [ ] Old broken project deleted
- [ ] All env files and documentation updated to reflect single-project reality
- [ ] No second project to maintain or confuse future agents

---

## Related

- WO-592 — Prevent Abandoned Sessions From Polluting Analytics
- Conversation: ea1b3fe5 (INSPECTOR audit, 2026-03-10)
- Cleanup commit: 9c5204c (untracked .env files)
