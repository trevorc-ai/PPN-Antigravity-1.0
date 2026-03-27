---
id: WO-715
title: "Backfill practitioner test records as network dummy data — activate benchmarking pre-Denver"
owner: PRODDY
status: 02_TRIAGE
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-27
fast_track: true
origin: "User fast-track request — pre-Denver activation"
admin_visibility: yes
admin_section: "Analytics / Settings"
pillar_supported: "Comparative Intelligence | Benchmarking | Research"
task_type: schema | sql-view
files: []
parked_context: "User has 33 existing test records. Wants these treated as the 'network' for analytics benchmarking until after Denver launch when real multi-site data exists."
---

## Request

Backfill my test records and use that as dummy data for the network, for now, until after Denver.

## LEAD Architecture

**Current state:** Materialized views (`mv_site_safety_benchmarks`, `mv_site_outcome_benchmarks`, `mv_site_dashboard_summary`) are scoped per `site_id`. Network benchmarks require multiple sites contributing data. With only 1 site, all network comparison cells return NULL → "No data" everywhere.

**Proposed approach for pre-Denver dummy network:**

**Option A — Multi-site_id seeding (preferred):** Create 2-4 synthetic `site_id` UUIDs that point to the practitioner's existing `log_clinical_records` with duplicated/slightly modified copies. The MVs will then aggregate across N "sites" and the practitioner's real site gets a meaningful benchmark. All synthetic records use `Subject_ID` synthetic values (ZERO-PHI compliant). This is the cleanest approach.

**Option B — MV override with hardcoded network baseline:** Add a `mv_network_baseline_static` view with hardcoded network averages (safety rate, documentation rate, followup rate) derived from published psychedelic therapy literature. Components that read "network avg" fall back to this view when zero real network sites exist.

**Option C — Duplicate site-scoped records under a "NETWORK_POOL" site_id:** All 33 existing records get a sibling copy stamped `site_id = NETWORK_POOL_UUID`. MVs are already summing by site, so these show up as a second contributing site.

**PRODDY must define:**
1. Which option to implement (recommend A or C for speed)
2. Exact `Subject_ID` naming convention for synthetic/duplicated records
3. Whether synthetic records are flagged `is_dummy = true` (recommend yes, so they can be filtered post-Denver)
4. A removal/deprecation plan post-Denver (when real network data arrives, dummy records are excluded via `WHERE NOT is_dummy`)

**Zero-PHI compliance:** All synthetic records must use `Subject_ID` format only. No real patient names, DOBs, or contact data.

**Additive-only schema:** If `is_dummy` column is needed, it must be `ALTER TABLE log_clinical_records ADD COLUMN is_dummy boolean DEFAULT false` — no column renames, no type changes.

## Acceptance Criteria (to be refined by PRODDY)

- [ ] At least 2 "sites" contributing data to network MVs
- [ ] Performance Radar shows real benchmark comparison vs network
- [ ] Analytics KPI cards show "vs network" trend values
- [ ] All synthetic records flagged `is_dummy = true`
- [ ] Removal plan documented before Denver launch
- [ ] Zero-PHI: only synthetic `Subject_ID` values in dummy records

## Blocker

PRODDY must produce a plan before BUILDER or migration can proceed. This touches `log_clinical_records` (additive-only) and all `mv_*` benchmark views.

---
- **Data from:** Practitioner's existing 33 `log_clinical_records` rows; `log_session_vitals`; `log_safety_events` (if to be duplicated)
- **Data to:** `log_clinical_records` (new dummy rows via INSERT, `is_dummy = true`); `mv_site_safety_benchmarks`, `mv_site_outcome_benchmarks`, `mv_site_dashboard_summary` (refresh after INSERT to pick up new site data)
- **Theme:** No UI changes in phase 1 — SQL seeding only; admin flag for is_dummy filter in future analytics UI
