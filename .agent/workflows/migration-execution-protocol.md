---
description: MANDATORY Docker-first protocol for all database migrations. No exceptions. No shortcuts.
---

# 🚨 MIGRATION EXECUTION PROTOCOL — DOCKER-FIRST (NON-NEGOTIABLE) 🚨

## WHY THIS EXISTS

> **Historical note:** A previous agent (SOOP, now retired) wrote a catastrophic destructive migration that passed INSPECTOR review. The USER caught it moments before execution. The downstream effects would have destroyed live clinical data, patient records, and the business. SOOP has been removed from the system. This protocol exists because of that event and is permanent.

---

## THE RULE — NO EXCEPTIONS

```
WRITE → TEST IN DOCKER → INSPECTOR REVIEWS DOCKER RESULT → USER APPROVES → PROMOTE TO CLOUD
```

No migration file may be run against the **live Supabase cloud database** until it has been:
1. ✅ Run successfully against the **local Docker Supabase instance**
2. ✅ Verified by INSPECTOR (grep-based, not trust-based)
3. ✅ Explicitly approved by USER with the words "approved for cloud"

**Bypassing Docker = automatic FAIL. INSPECTOR must reject any ticket that skips this gate.**

---

## STEP-BY-STEP PROTOCOL

### Phase 1 — Write
- INSPECTOR or BUILDER (per WO assignment) writes SQL migration file to `migrations/NNN_description.sql`
- All statements must be: `IF NOT EXISTS`, `ON CONFLICT DO NOTHING`, `DROP POLICY IF EXISTS`
- No DROP TABLE, DROP COLUMN, RENAME, ALTER TYPE, TRUNCATE, DELETE FROM
- INSPECTOR validates file statically (grep checks) before any execution

### Phase 2 — Docker Test (USER executes)

**Start Docker Desktop first:**
1. Open Docker.app from Applications
2. Wait for whale icon in menu bar to stop animating

**Start local Supabase:**
```bash
supabase start
```
Wait for: `Started supabase local development setup.`

**Run the migration against local DB:**
```bash
supabase db execute --file migrations/NNN_description.sql
```
Or open the local Studio at http://localhost:54323 → SQL Editor → paste and run.

**Verify locally:**
```sql
-- Example verification after table creation:
SELECT COUNT(*) FROM table_name;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'table_name';
```

### Phase 3 — INSPECTOR Review

INSPECTOR must confirm:
- [ ] Migration ran without errors in Docker (USER confirms)
- [ ] Verification query returned expected results
- [ ] No destructive operations exist in the file
- [ ] RLS is enabled on all new tables

### Phase 4 — Cloud Promotion (USER executes manually)

Only after INSPECTOR issues written approval:
1. Go to supabase.com/dashboard → project → SQL Editor
2. Paste migration file contents
3. Run
4. Paste result back for INSPECTOR confirmation

---

## AGENTS — MANDATORY READING

- ❌ NEVER tell the USER to skip Docker and run directly on cloud
- ❌ NEVER suggest Docker is "optional" or "adds complexity without benefit"
- ❌ NEVER execute SQL yourself — your job ends at writing the file
- ✅ Always wait for USER confirmation that Docker test passed before issuing PASS
- ✅ If Docker is not running, help the USER start it — do not route around it

## DOCKER QUICK REFERENCE

| Command | Purpose |
|---|---|
| `supabase start` | Start local Supabase (requires Docker running) |
| `supabase stop` | Stop local Supabase |
| `supabase status` | Check if local Supabase is running + get connection URLs |
| `supabase db execute --file migrations/NNN.sql` | Run a migration file locally |
| `supabase db reset` | ⚠️ DANGEROUS — resets local DB only, never cloud |

Local Studio URL: **http://localhost:54323**
Local DB port: **54322**
Local API port: **54321**
