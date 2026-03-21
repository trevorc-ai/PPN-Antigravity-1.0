-- 02_rls_remediation.sql
-- Purpose: tighten broad write paths on key governed tables.
-- This file is intentionally conservative and idempotent.

begin;

-- 1) Remove broad insert policies that can bypass scoped checks.
drop policy if exists "Enable insert for authenticated users only" on public.log_clinical_records;
drop policy if exists "Enable insert for authenticated users only" on public.log_safety_events;

-- 2) Ensure scoped insert policies exist (site-based gate).
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'log_clinical_records'
      and policyname = 'log_clinical_records_insert_scoped'
  ) then
    create policy log_clinical_records_insert_scoped
      on public.log_clinical_records
      for insert
      to public
      with check (
        app_has_site_access(
          site_id,
          array['site_admin','clinician','network_admin']
        ) or auth.role() = 'service_role'
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'log_safety_events'
      and policyname = 'log_safety_events_insert_scoped'
  ) then
    create policy log_safety_events_insert_scoped
      on public.log_safety_events
      for insert
      to public
      with check (
        app_has_site_access(
          site_id,
          array['site_admin','clinician','network_admin']
        ) or auth.role() = 'service_role'
      );
  end if;
end $$;

-- 3) Keep select scope broad enough for read roles only (no change here),
-- but re-check post-commit with 01_rls_audit.sql.

commit;

-- Post-step: run 01_rls_audit.sql again and confirm no broad+scoped overlap
-- for INSERT on log_clinical_records and log_safety_events.
