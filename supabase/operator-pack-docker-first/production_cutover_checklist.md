# Production Cutover Checklist (Plain English)

Use this only after staging fully passes.

## Pre-cutover

- [ ] Confirm approved change window
- [ ] Confirm rollback file is ready: `sql/06_rollback.sql`
- [ ] Confirm owner-on-call is assigned
- [ ] Confirm read-only comms plan for incident response

## Production run order

- [ ] Run `sql/01_rls_audit.sql` (capture baseline)
- [ ] Run `sql/02_rls_remediation.sql`
- [ ] Re-run `sql/01_rls_audit.sql` (confirm expected change only)
- [ ] Run `sql/03_append_only_verification.sql`
- [ ] Run `sql/04_view_contract_assertions.sql`
- [ ] Run `sql/05_perf_explain_checks.sql` (targeted smoke check)

## Immediate post-deploy checks

- [ ] Confirm normal app login and role-based access
- [ ] Confirm protocol detail pages can load expected data
- [ ] Confirm no surge in authorization errors
- [ ] Confirm no latency spike on key view-backed reads

## Rollback triggers

Rollback immediately if any occur:

- [ ] Unintended cross-site access
- [ ] Governed append-only write protections fail
- [ ] Required protocol-detail view contract breaks
- [ ] Severe performance regression

## Post-cutover evidence

- [ ] Archive SQL outputs and logs
- [ ] Save before/after policy snapshots
- [ ] Save explain plans
- [ ] Record final sign-off (owner, date, outcome)
