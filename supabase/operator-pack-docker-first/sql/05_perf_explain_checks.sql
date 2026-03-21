-- 05_perf_explain_checks.sql
-- Purpose: capture baseline query plans for key views.
-- Replace UUID literals with real values from your local/staging dataset.

-- 1) Protocol treatment results over time
explain (analyze, buffers, format text)
select *
from public.vw_protocol_detail_treatment_results_over_time
where patient_uuid = coalesce(
  (select patient_uuid from public.log_clinical_records where patient_uuid is not null limit 1),
  '00000000-0000-0000-0000-000000000000'::uuid
)
order by observation_timestamp desc
limit 100;

-- 2) Prior protocol summary
explain (analyze, buffers, format text)
select *
from public.vw_protocol_detail_prior_protocol_summary
where current_session_id = coalesce(
  (select id from public.log_clinical_records limit 1),
  '00000000-0000-0000-0000-000000000000'::uuid
)
limit 1;

-- 3) Outstanding safety flags
explain (analyze, buffers, format text)
select *
from public.vw_protocol_detail_outstanding_safety_flags
where patient_uuid = coalesce(
  (select patient_uuid from public.log_clinical_records where patient_uuid is not null limit 1),
  '00000000-0000-0000-0000-000000000000'::uuid
)
order by flag_timestamp desc
limit 100;

-- 4) Network outcome benchmark view
explain (analyze, buffers, format text)
select *
from public.vw_network_outcome_benchmarks
order by observation_count desc nulls last
limit 100;

-- 5) Network safety benchmark view
explain (analyze, buffers, format text)
select *
from public.vw_network_safety_benchmarks
order by event_count desc nulls last
limit 100;
