-- 01_rls_audit.sql
-- Purpose: find risky RLS policy overlaps and broad write paths.

-- A) Full policy list (quick visibility)
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
order by tablename, cmd, policyname;

-- B) Policies that allow INSERT with very broad checks
select schemaname, tablename, policyname, roles, cmd, with_check
from pg_policies
where schemaname = 'public'
  and cmd = 'INSERT'
  and (
    with_check is null
    or btrim(with_check) = ''
    or lower(with_check) = 'true'
  )
order by tablename, policyname;

-- C) Tables that have both broad and scoped INSERT policies
with insert_policies as (
  select
    tablename,
    policyname,
    cmd,
    coalesce(with_check, '') as with_check,
    case
      when lower(coalesce(with_check, '')) = 'true' or btrim(coalesce(with_check, '')) = '' then 'broad'
      when with_check ilike '%app_has_site_access%'
        or with_check ilike '%app_has_patient_access%'
        or with_check ilike '%site_id in ( select%'
        or with_check ilike '%patient_uuid in ( select%'
        then 'scoped'
      else 'other'
    end as policy_shape
  from pg_policies
  where schemaname = 'public'
    and cmd = 'INSERT'
)
select
  tablename,
  count(*) filter (where policy_shape = 'broad') as broad_insert_policies,
  count(*) filter (where policy_shape = 'scoped') as scoped_insert_policies
from insert_policies
group by tablename
having count(*) filter (where policy_shape = 'broad') > 0
   and count(*) filter (where policy_shape = 'scoped') > 0
order by tablename;

-- D) Focus check for high-risk governed tables
select schemaname, tablename, policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in (
    'log_clinical_records',
    'log_safety_events',
    'log_clinical_observations',
    'log_wearable_telemetry',
    'log_nlp_semantic_biomarkers',
    'log_environmental_telemetry',
    'log_therapeutic_alliance'
  )
order by tablename, cmd, policyname;
