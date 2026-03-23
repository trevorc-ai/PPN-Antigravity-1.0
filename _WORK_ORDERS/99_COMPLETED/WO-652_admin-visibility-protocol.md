---
id: WO-652
title: "Add admin_visibility frontmatter field to WO template and BUILDER completion protocol"
owner: BUILDER
status: 00_INBOX
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-21
fast_track: true
origin: "Solo-founder simplification — auto-wire components to admin dashboard"
admin_visibility: no
files:
  - ".agent/templates/PLAN_TEMPLATE.md"
  - ".agent/workflows/builder-protocol.md"
  - ".agent/skills/inspector-qa/SKILL.md"
---

## Request
Add a standard `admin_visibility:` frontmatter field to every Work Order and PLAN_TEMPLATE so that when a new component or page is built, BUILDER automatically wires it into the admin dashboard without the user having to ask.

## What Changes

### 1. `.agent/templates/PLAN_TEMPLATE.md`
Add to frontmatter block:
```yaml
admin_visibility: yes/no       # Should this appear in the Admin Dashboard?
admin_section: ""              # Reports / Analytics / Session Management / Settings / N/A
```

### 2. `.agent/workflows/builder-protocol.md`
Add to Step 5 (completion checklist) before moving to 04_QA:
```
- IF `admin_visibility: yes` in WO frontmatter:
  MUST wire component into Admin Dashboard under the specified `admin_section`.
  Add a navigation link, card, or entry point as appropriate.
  Document the wiring in `builder_notes:` frontmatter field.
```

### 3. `.agent/skills/inspector-qa/SKILL.md`
Add to Phase 1 (Process QA):
```
- IF `admin_visibility: yes`: Confirm wiring is documented in `builder_notes:`.
  Spot-check that the component is reachable from the Admin Dashboard.
  Reject if not wired.
```

## Success Criteria
- [ ] New WOs created via fast-track include `admin_visibility:` field by default
- [ ] BUILDER wires any `admin_visibility: yes` component before moving to QA
- [ ] INSPECTOR rejects if `admin_visibility: yes` and wiring is missing
- [ ] PLAN_TEMPLATE updated to include the field with a default of `no`
