---
id: WO-589
title: Wire MARKETER Agent and _GROWTH_ORDERS Pipeline into agent.yaml
owner: LEAD
status: 01_TRIAGE
authored_by: PRODDY
priority: P1
created: 2026-03-09
type: SYSTEM_CONFIG
---

## PRODDY PRD

> **Work Order:** WO-589 - Wire MARKETER Agent and _GROWTH_ORDERS Pipeline into agent.yaml
> **Authored by:** PRODDY
> **Date:** 2026-03-09
> **Status:** Draft - Pending LEAD review

---

### 1. Problem Statement
The `_GROWTH_ORDERS` pipeline has six defined workflows and skills (marketer-protocol, brandy-copywriter, seo-aio-specialist, ui-ux-auditor, proddy-review, marketing-qa-checklist) but none are wired into `agent.yaml`. MARKETER does not exist as a named agent. No agent is instructed to monitor `_GROWTH_ORDERS/` folders. The result: the entire growth pipeline is invisible to the swarm and requires manual orchestration on every ticket, causing rework and pipeline stalls.

---

### 2. Target User + Job-To-Be-Done
LEAD needs to route growth order tickets through the correct pipeline stages automatically so that Trevor does not have to manually invoke workflows on every marketing asset.

---

### 3. Success Metrics
1. After implementation, a ticket placed in `_GROWTH_ORDERS/00_BACKLOG/` is picked up and processed by MARKETER without any manual `/workflow` invocation by Trevor.
2. LEAD's pipeline scan (`/lead-pipeline-scan`) reports `_GROWTH_ORDERS` stage counts alongside `_WORK_ORDERS` counts in a single unified view.
3. Zero `WO-` prefixed tickets appear in any `_GROWTH_ORDERS/` folder after the one-time cleanup is applied.

---

### 4. Feature Scope

#### In Scope:
- Add MARKETER as a named agent in `agent.yaml` with pickup queue `_GROWTH_ORDERS/00_BACKLOG`, output staging `_GROWTH_ORDERS/01_DRAFTING`, and mandatory skill `marketer-protocol`
- Add routing instructions to LEAD's `agent.yaml` block: check `_GROWTH_ORDERS/` as a parallel Kanban alongside `_WORK_ORDERS/`; route growth tickets using the `GO-` prefix convention
- Wire the 6 growth workflows/skills into the correct stages via YAML frontmatter conventions on growth order tickets:
  - Stage 01: marketer-protocol SKILL
  - Stage 02: (user gate - no agent action)
  - Stage 03: ui-ux-auditor + brandy-copywriter + seo-aio-specialist (parallel)
  - Stage 04: (user gate - no agent action)
  - Stage 05: builder-protocol + frontend-best-practices
  - Stage 06: marketing-qa-checklist SKILL (INSPECTOR)
- Add a stage exit contract rule: no ticket exits `03_MOCKUP_SANDBOX` without a rendered `.html` file as output
- One-time cleanup: audit `_GROWTH_ORDERS/` for any `WO-` prefixed files and move or re-prefix to `GO-` as appropriate

#### Out of Scope:
- Modifying the `_WORK_ORDERS` pipeline or any existing `WO-` agent routing
- Adding new agents beyond MARKETER
- Automated filesystem scanning or live Kanban dashboard (that is GO-590)
- Any database schema changes

---

### 5. Priority Tier

**[x] P1** - High value, ship this sprint

**Reason:** The `_GROWTH_ORDERS` pipeline currently requires full manual orchestration on every ticket. Without this wiring, all six defined growth workflows are dead letters and every new marketing asset is subject to rework. GO-590 (the sandbox) depends on the pipeline functioning correctly to be useful.

---

### 6. Open Questions for LEAD
1. `agent.yaml` is marked as a system file - does LEAD have authority to modify it for operational wiring, or does this require Trevor to approve the specific diff before execution?
2. Should MARKETER be set to `temperature: 0.7` (matching PRODDY/brand creativity) or `temperature: 0` (matching BUILDER/INSPECTOR for consistency)?
3. Should LEAD's pipeline scan workflow (`/lead-pipeline-scan`) be updated in the same ticket to include `_GROWTH_ORDERS` stage counts, or is that a separate WO?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is <=100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason
- [x] Open Questions list is <=5 items
- [x] Total PRD word count is <=600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`

✅ WO-589 placed in 00_INBOX. LEAD action needed: review Open Questions (esp. Q1 re: agent.yaml authority) and route.

---

## LEAD ARCHITECTURE

**Routed by:** LEAD
**Route date:** 2026-03-09
**Owner:** LEAD (Trevor diff-approval required before any agent touches agent.yaml)

### Open Question Resolutions:
1. **agent.yaml authority:** LEAD will draft the exact proposed diff in this ticket. Trevor must explicitly type "Approved" before any change is written to `agent.yaml`. This is non-negotiable given the SYSTEM FILES rule.
2. **MARKETER temperature:** `temperature: 0.7` - MARKETER produces brand creative copy. Aligns with PRODDY. `temperature: 0` is for deterministic code/QA agents only.
3. **lead-pipeline-scan update:** In-scope for this ticket. The workflow `.agent/workflows/lead-pipeline-scan.md` will be updated to include `_GROWTH_ORDERS` stage counts in the Step 6 report table.

### Implementation Plan (LEAD will execute after Trevor approval):
1. Draft exact `agent.yaml` diff in this ticket for Trevor review
2. Add MARKETER agent block to `agent.yaml` (after Trevor approval)
3. Add `_GROWTH_ORDERS` routing note to LEAD's `agent.yaml` instructions (after Trevor approval)
4. Update `.agent/workflows/lead-pipeline-scan.md` to include `_GROWTH_ORDERS` scan steps
5. Run one-time `_GROWTH_ORDERS/` cleanup: verify all files carry `GO-` prefix
