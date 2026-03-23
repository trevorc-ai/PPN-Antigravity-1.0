---
description: /fast-track — One-sentence entry point for any request. LEAD classifies, creates the ticket, and routes automatically. No pipeline knowledge required from the user.
---

# `/fast-track` — User Fast-Lane Protocol

> Use this when you have an urgent request and don't want to think about which pipeline applies.
> Type: `/fast-track [one sentence describing what you want]`

## Step 1: Classify the request (LEAD only — automatic, no user input needed)

Read the user's sentence and classify it into exactly one category:

| If the request is about... | Classification | Destination |
|---|---|---|
| A new feature, bug fix, routing, database, React component, or platform behavior | **ENGINEERING** | `_WORK_ORDERS/00_INBOX/` as a WO |
| Marketing copy, outreach, a leave-behind, PDF, landing page, email, or public-facing document | **GROWTH** | `_GROWTH_ORDERS/00_BACKLOG/` as a GO |
| A process question, pipeline question, or "how do I..." | **ADVISORY** | Answer directly. No ticket needed. |
| Ambiguous — could be either | Ask ONE clarifying question: "Is this primarily a content deliverable or a platform feature?" |

## Step 2: Create the ticket (LEAD — no user input needed)

### For ENGINEERING (WO):
```bash
# Determine next WO number
find _WORK_ORDERS -name "WO-*.md" | sort | tail -1
```

Create `_WORK_ORDERS/00_INBOX/WO-[ID]_[3-word-slug].md` with this minimal frontmatter:

```yaml
---
id: WO-[ID]
title: "[User's exact sentence]"
owner: LEAD
status: 00_INBOX
authored_by: LEAD (fast-track)
priority: P1
created: [today's date]
fast_track: true
origin: "User fast-track request"
admin_visibility: no          # yes = BUILDER must wire into Admin Dashboard before QA
admin_section: ""             # Reports / Analytics / Session Management / Settings / N/A
parked_context: ""            # Fill if this WO was parked and is being resumed
files: []
---
## Request
[User's exact sentence]

## LEAD Architecture
[2-3 sentences: what needs to change and which files are likely affected]

## Open Questions
- [ ] [Any clarification needed before routing to BUILDER?]
```

Then move immediately to triage and route — auto-handoff, no user prompt needed:
```bash
mv _WORK_ORDERS/00_INBOX/WO-[ID].md _WORK_ORDERS/02_TRIAGE/
```
LEAD then immediately reads the WO, appends `## LEAD Architecture`, and routes to the appropriate next stage in the same response.

### For GROWTH (GO):
```bash
# Determine next GO number
find _GROWTH_ORDERS -name "GO-*.md" | sort | tail -1
```

Create `_GROWTH_ORDERS/00_BACKLOG/GO-[ID]_[3-word-slug].md` with this minimal frontmatter:

```yaml
---
id: GO-[ID]
title: "[User's exact sentence]"
owner: MARKETER
status: 00_BACKLOG
authored_by: LEAD (fast-track)
priority: P1
created: [today's date]
fast_track: true
target_audience: [inferred from request — confirm with user if unclear]
notebook_source: N/A
prototype_reference: None
---
## Request
[User's exact sentence]

## Brief
[1 paragraph describing the deliverable based on the request]

## MARKETER Task List
- [ ] Draft CONTENT_MATRIX.md for this deliverable
- [ ] Confirm target audience with user if ambiguous

## Reference Assets
- Screenshots: `public/screenshots/Marketing-Screenshots/webp/`
```

## Step 3: Confirm and hand off (LEAD — one message to user)

Post exactly this and nothing more:

> ✅ **Fast-tracked as [WO-ID / GO-ID]** — classified as [Engineering/Growth].
> Routed to [02_TRIAGE / _GROWTH_ORDERS/00_BACKLOG/]. Next agent: [BUILDER/MARKETER].
> Reply `go` to proceed immediately, or `hold` to review the ticket first.

## Step 4: If user replies `go`

- **WO:** Move from `02_TRIAGE` to `03_REVIEW` immediately. INSPECTOR clears in same response, then LEAD moves to `04_BUILD`. BUILDER starts immediately.
- **GO:** Move from `00_BACKLOG` to `01_DRAFTING`. MARKETER starts CONTENT_MATRIX immediately in same response.

## Step 5: If user replies `hold`

Surface the ticket for user review. Wait for explicit approval before moving.

---

> [!NOTE]
> Fast-track tickets bypass the full PRODDY PRD and MARKETER content matrix drafting stages. They are designed for speed. If the deliverable turns out to be complex, LEAD will flag it and ask if the user wants to promote it to a full WO or GO with a proper brief.

## Changelog

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-02-23 | INSPECTOR | Initial protocol established |
| 2.0 | 2026-03-23 | LEAD | **Pipeline Architecture Redesign.** Updated `03_BUILD` → `04_BUILD`. Added auto-handoff chain on ENGINEERING fast-tracks. |
