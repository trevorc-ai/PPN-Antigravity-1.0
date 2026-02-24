---
id: WO-208
title: "Advisory Board PRD — Clinical Vocabulary Authority"
status: 01_TRIAGE
owner: LEAD
priority: HIGH
created: 2026-02-19
failure_count: 0
---

## Purpose

The PPN controlled vocabulary governs what concepts practitioners can log. As the network grows, gaps will emerge — practitioners will encounter clinical concepts that don't exist in any `ref_` table. The Advisory Board is the governance layer that decides which concepts get added to the canonical vocabulary.

This PRD defines the Advisory Board's scope, composition, workflow, and tooling requirements.

---

## PRODDY STRATEGY

### Problem

Every time a practitioner encounters a vocabulary gap, they lose data. They either:
1. Pick the closest available option (noise), or
2. Skip the field entirely (missing data)

Both degrade the research signal quality. The `log_vocabulary_requests` table (WO-202) captures these gaps, but someone needs to review them.

### Solution: Advisory Board as a Governance Product

The Advisory Board is not just an advisory committee — it's a **data product**. The board's decisions directly feed back into `ref_` tables, which immediately become available to all 14 sites.

### Composition (Recommended)

| Role | Count | Rationale |
|------|-------|-----------|
| Senior Clinician (MD/DO) | 2 | Medical safety & standard of care alignment |
| Licensed Therapist (LMFT/LPC) | 2 | Therapeutic framing & session terminology |
| Research Scientist | 1 | Psychometrics, measurement validity |
| Patient Advocate | 1 | Ensures practitioner-centric concepts are patient-intelligible |
| PPN Staff (Rotating Chair) | 1 | Quorum, tie-breaking, workflow management |

**Quorum**: 4 of 7 members required. Chair always participates.

### Approval Thresholds (Auto-escalation)

These match the `log_vocabulary_requests.request_count` logic:

| Unique Sites Requesting | Action |
|-------------------------|--------|
| ≥ 3 sites | Automatically added to Board agenda at next monthly meeting |
| ≥ 7 sites | Fast-track review (30-day SLA, async vote allowed) |
| ≥ 15 sites | Presumptive approval — added to staging environment within 7 days |

### The Monthly Board Workflow

1. **PPN Staff** runs the governance dashboard (filter: `status: pending`, ordered by `request_count DESC`)
2. **Board votes** on the top 10 vocabulary requests via a secure Slack thread or the in-app governance UI (future)
3. **Approved concepts** trigger:
   a. SOOP writes an additive migration adding the concept to the appropriate `ref_` table
   b. Application layer clears `proposed_label` and `clinical_rationale` from the approved request row
   c. Sets `converted_to_ref_id` on the request row (audit trail)
   d. All sites see the new option within 24h (vocabulary cache TTL)
4. **Rejected concepts** get `advisory_notes` explaining why, kept permanently for appeal logic

### Competitive Moat

Every request is a signal about where the field is headed. Over time:
- High-frequency rejected concepts indicate emerging areas the field hasn't standardized yet
- High-frequency approved concepts indicate where PPN's vocabulary is expanding
- Site-specific request patterns identify which sites are treating novel indications

This is a **network intelligence asset** that no single-site EHR can replicate.

---

## Feature Requirements

### Phase 1 (Now — WO-202 complete the foundation)
- [x] `log_vocabulary_requests` table exists with RLS
- [x] GIN index on `requesting_sites`
- [ ] Admin UI: simple table view of pending requests, ordered by `request_count DESC`
- [ ] Practitioner UI: "Missing a concept? Request it" link in form dropdowns

### Phase 2 (30 days)
- [ ] Email digest: weekly email to Board members listing new requests above threshold
- [ ] In-app voting: Board members approve/reject via the portal itself (no Slack dependency)
- [ ] Auto-migration: approved concepts create a Supabase migration draft for SOOP review

### Phase 3 (90 days)
- [ ] Public changelog: anonymized, aggregated vocabulary changelog visible to all practitioners
- [ ] Appeal mechanism: rejected concept can be appealed with new clinical evidence

---

## Acceptance Criteria (Phase 1 Feature Gate)

- [ ] Admin route `/governance/vocabulary-requests` shows pending requests
- [ ] Each request shows: `proposed_label`, `target_ref_table`, `request_count`, `requesting_sites` count
- [ ] Board member can click Approve → sets `status: approved`, prompts SOOP workflow
- [ ] Board member can click Reject → opens notes field → saves `advisory_notes`, sets `status: rejected`
- [ ] No PHI in the view — `proposed_label` contains concept names (e.g., "Somatic Grounding"), not patient data

---

## LEAD ARCHITECTURE NOTES

**Routing**: New route `/governance/vocabulary-requests` — protected to `admin` role only.
**Component**: `VocabularyRequestsTable.tsx` — simple data table using existing `card-glass` design tokens.
**Service**: Add `getVocabularyRequests()` and `updateVocabularyRequest()` to a new `governance.ts` service file.
**Migration dependency**: Requires `log_vocabulary_requests` table (WO-202) to exist in prod before building UI.

**Route to**: BUILDER after DESIGNER creates table layout spec.
**Status**: Ready for DESIGNER to spec the governance table UI.
