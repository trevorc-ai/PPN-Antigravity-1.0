---
id: WO-683
title: "Replace RegulatoryMosaic and RegulatoryWeather hardcoded mockStateData with live or governed static source"
owner: BUILDER
status: 00_INBOX
priority: P2
created: 2026-03-24
origin: "Intelligence Gap Audit — Tier 2"
files:
  - src/components/analytics/RegulatoryMosaic.tsx
  - src/components/analytics/RegulatoryWeather.tsx
  - src/components/analytics/mockStateData.ts
---
## Problem
`RegulatoryMosaic` and `RegulatoryWeather` import from `mockStateData.ts` — a hardcoded file with 8 US states that has a comment `// ... Add more as needed`. This is presenting static, unverified regulatory data as live intelligence. This is legally and clinically irresponsible.

## Required Fix

### Option A (preferred): Move to a governed static JSON/DB table
- Create a `regulatory_status` table in Supabase OR a versioned JSON file in `src/data/regulatory/`
- Each state entry must include: `last_verified_at`, `source_url`, `verified_by`
- Cover all 50 US states + key international jurisdictions
- Add a visible footnote: "Regulatory data last verified [date]. Always consult legal counsel."

### Option B (if Option A is too large for pre-Denver): Display a "Regulatory data coming soon" placeholder
- Remove fake data from the components
- Render a clear "This section is under development" UI state
- Do NOT show only 8 states as if coverage is real

## Success Criteria
- No component renders regulatory data from `mockStateData.ts`
- Either real governed data is shown with verification dates, OR an honest placeholder is shown
- `mockStateData.ts` is either deleted or clearly marked as test fixture only

## INSPECTOR 03_REVIEW CLEARANCE: FAST-PASS
No DB impact detected. Cleared for build.
Signed: INSPECTOR | Date: 2026-03-24
