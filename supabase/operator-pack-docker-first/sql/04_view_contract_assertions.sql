-- 04_view_contract_assertions.sql
-- Purpose: confirm protocol-detail views exist with expected columns/types.

-- A) Ensure required views exist
select table_schema, table_name
from information_schema.views
where table_schema = 'public'
  and table_name in (
    'vw_protocol_detail_treatment_results_over_time',
    'vw_protocol_detail_prior_protocol_summary',
    'vw_protocol_detail_outstanding_safety_flags'
  )
order by table_name;

-- B) Treatment results view contract
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'vw_protocol_detail_treatment_results_over_time'
order by ordinal_position;

-- C) Prior protocol summary view contract
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'vw_protocol_detail_prior_protocol_summary'
order by ordinal_position;

-- D) Outstanding safety flags view contract
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'vw_protocol_detail_outstanding_safety_flags'
order by ordinal_position;

-- E) Quick missing-column detector for must-have fields
with required(view_name, column_name) as (
  values
    ('vw_protocol_detail_treatment_results_over_time', 'site_id'),
    ('vw_protocol_detail_treatment_results_over_time', 'patient_uuid'),
    ('vw_protocol_detail_treatment_results_over_time', 'session_id'),
    ('vw_protocol_detail_treatment_results_over_time', 'concept_code'),
    ('vw_protocol_detail_treatment_results_over_time', 'time_point_code'),
    ('vw_protocol_detail_treatment_results_over_time', 'value_as_number'),
    ('vw_protocol_detail_prior_protocol_summary', 'current_session_id'),
    ('vw_protocol_detail_prior_protocol_summary', 'prior_session_id'),
    ('vw_protocol_detail_prior_protocol_summary', 'prior_unresolved_safety_event_count'),
    ('vw_protocol_detail_outstanding_safety_flags', 'site_id'),
    ('vw_protocol_detail_outstanding_safety_flags', 'session_id'),
    ('vw_protocol_detail_outstanding_safety_flags', 'flag_type'),
    ('vw_protocol_detail_outstanding_safety_flags', 'flag_code'),
    ('vw_protocol_detail_outstanding_safety_flags', 'flag_label')
)
select r.view_name, r.column_name as missing_column
from required r
left join information_schema.columns c
  on c.table_schema = 'public'
 and c.table_name = r.view_name
 and c.column_name = r.column_name
where c.column_name is null
order by r.view_name, r.column_name;
