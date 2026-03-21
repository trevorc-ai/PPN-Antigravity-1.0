-- 00_sanitized_seed.sql
-- Purpose: create a minimal, fake multi-site data setup for safe local testing.
-- Note: This script is optional. It only inserts when required parent rows exist.

begin;

-- 1) Create two fake user-site links if users already exist.
with existing_users as (
  select id as user_id
  from auth.users
  order by created_at asc
  limit 2
),
existing_sites as (
  select site_id
  from log_sites
  order by created_at asc
  limit 2
)
insert into log_user_sites (user_id, site_id, role, is_active)
select u.user_id, s.site_id,
       case when row_number() over () = 1 then 'site_admin' else 'clinician' end,
       true
from existing_users u
cross join existing_sites s
on conflict do nothing;

-- 2) Ensure at least one patient link row exists (fake/sanitized values).
insert into log_patient_site_links (patient_link_code, site_id, is_active, patient_uuid)
select
  'PT-LOCAL-' || substr(md5(random()::text), 1, 8),
  s.site_id,
  true,
  gen_random_uuid()
from log_sites s
limit 2
on conflict do nothing;

-- 3) Ensure at least one session row exists per site when possible.
insert into log_clinical_records (
  practitioner_id,
  site_id,
  patient_uuid,
  session_date,
  session_status,
  is_submitted,
  created_at
)
select
  coalesce((select user_id from log_user_sites lus where lus.site_id = lpsl.site_id limit 1), gen_random_uuid()),
  lpsl.site_id,
  lpsl.patient_uuid,
  current_date,
  'active',
  false,
  now()
from log_patient_site_links lpsl
left join log_clinical_records lcr
  on lcr.site_id = lpsl.site_id
 and lcr.patient_uuid = lpsl.patient_uuid
where lcr.id is null
limit 2;

commit;

-- Expected result:
-- Local environment has enough fake multi-site shape to test RLS rules.
