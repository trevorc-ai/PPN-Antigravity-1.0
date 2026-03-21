-- 06_rollback.sql
-- Purpose: rollback key RLS remediation changes from 02_rls_remediation.sql
-- Run only if you need to back out quickly.

begin;

-- Recreate broad policies only if your environment previously required them.
-- WARNING: these are broad and can reduce strictness.

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'log_clinical_records'
      and policyname = 'Enable insert for authenticated users only'
  ) then
    create policy "Enable insert for authenticated users only"
      on public.log_clinical_records
      for insert
      to authenticated
      with check (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'log_safety_events'
      and policyname = 'Enable insert for authenticated users only'
  ) then
    create policy "Enable insert for authenticated users only"
      on public.log_safety_events
      for insert
      to authenticated
      with check (true);
  end if;
end $$;

commit;

-- Post-rollback validation:
-- rerun sql/01_rls_audit.sql and compare with your baseline report.
