---
name: migration-manager
description: Manages Supabase database migrations with proper workflow
---

# Migration Manager

## Purpose
Execute database migrations safely using Supabase CLI.

## Commands

### Create New Migration
```bash
supabase migration new descriptive_name
```

### Apply Migrations (Local)
```bash
supabase db reset  # Reset local DB and apply all migrations
```

### Apply Migrations (Remote)
```bash
supabase db push  # Push to remote database
```

### Check Migration Status
```bash
supabase migration list
```

## Workflow
1. Create migration: `supabase migration new add_column_xyz`
2. Write SQL in `migrations/YYYYMMDDHHMMSS_add_column_xyz.sql`
3. Test locally: `supabase db reset`
4. Run verification queries (DATABASE_GOVERNANCE_RULES.md Section 3)
5. Push to remote: `supabase db push`

## Safety Checks
- ✅ All SQL is idempotent
- ✅ No banned commands
- ✅ RLS policies included
- ✅ Verification queries pass
