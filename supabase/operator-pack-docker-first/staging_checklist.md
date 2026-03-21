# Staging Validation Checklist (Plain English)

Use this after local Docker checks pass.

## Before running

- [ ] Confirm staging backup/snapshot exists
- [ ] Confirm low-risk deployment window
- [ ] Confirm `DATABASE_URL` points to staging (not prod)

## Run order

- [ ] Run `sql/01_rls_audit.sql`
- [ ] Run `sql/02_rls_remediation.sql`
- [ ] Re-run `sql/01_rls_audit.sql` and compare
- [ ] Run `sql/03_append_only_verification.sql`
- [ ] Run `sql/04_view_contract_assertions.sql`
- [ ] Run `sql/05_perf_explain_checks.sql`

## Pass/Fail gates

Pass only if all are true:

- [ ] No risky broad+scoped overlap remains for governed insert paths
- [ ] Append-only checks show no unsafe write path
- [ ] All required `vw_protocol_detail_*` view columns exist
- [ ] Explain output shows acceptable timing and no major regressions

## Stop conditions

Stop and do not promote if any occur:

- [ ] Cross-site access appears open when it should be blocked
- [ ] `UPDATE`/`DELETE` appears possible on governed append-only tables
- [ ] Any required view contract check fails
- [ ] Query plan regressions are unacceptable

## Evidence to capture

- [ ] Save SQL outputs/logs
- [ ] Save explain plans
- [ ] Save policy diff before/after
- [ ] Record go/no-go decision with timestamp and owner
