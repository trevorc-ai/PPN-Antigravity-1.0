---
id: WO-641
title: "ClinicianDirectory — Replace Misleading Listing Modal with Compliant Interest Request"
owner: BUILDER
authored_by: PRODDY
routed_by: LEAD
status: 04_BUILD
priority: P1
created: 2026-03-17
routed_at: 2026-03-17
depends_on: none
skip_approved_by: ""
hold_reason: ""
held_at: ""
failure_count: 0
completed_at: ""
builder_notes: ""
files:
  - src/pages/ClinicianDirectory.tsx
skills:
  - ".agent/skills/frontend-surgical-standards/SKILL.md"
  - ".agent/skills/frontend-best-practices/SKILL.md"
---

## Context

`src/pages/ClinicianDirectory.tsx` contains a "List Your Practice" modal that collects free-text
fields (display name, email, role, city, country, website) but silently discards all of them —
only `user_id` is written to `log_feature_requests`. This is misleading to the user.

Per the governance operating model (Section 10: Free-Text Policy), free-text fields are not
permitted in clinical or operational log tables without an explicit governance exception. This
form violates that policy and creates a trust problem: the user believes they submitted data
that was never stored.

The fix replaces the multi-field form with a single-action intent signal.

---

## Acceptance Criteria

- [ ] The "List Your Practice" modal no longer contains free-text input fields
- [ ] A single button click writes `{ user_id }` to `log_feature_requests` with no other fields
- [ ] The modal body copy reads: "Apply to join the practitioner directory. We review applications
      manually and will contact you directly." with a "Submit Interest" button
- [ ] Success state reads: "Application received. We'll be in touch."
- [ ] No form validation required (single button, no inputs)
- [ ] `npm run build` clean

---

## Files to Modify

| File | Action |
|---|---|
| `src/pages/ClinicianDirectory.tsx` | MODIFY — replace `listingForm` state, form JSX, and `handleListingSubmit` with single-button implementation |

---

## Constraints

- Surgical only. Touch nothing outside the listing modal and its state.
- Do not add new fields to `log_feature_requests`. Write `user_id` only.
- Do not change the modal trigger button ("+ List Practice") or its styling.
- Do not modify `PractitionerCard`, `MessageDrawer`, or any filter/search logic.

---

## LEAD Architecture

**Routing Decision:** Small, surgical BUILDER task. ~30 minutes. No schema changes needed.
`log_feature_requests` already supports a `user_id`-only insert. Target complete: March 31, 2026.
