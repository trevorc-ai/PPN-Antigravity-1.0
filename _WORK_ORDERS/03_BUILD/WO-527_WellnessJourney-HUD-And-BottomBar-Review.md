---
id: WO-527
title: "Wellness Journey HUD and Bottom Bar Review"
status: 03_BUILD
owner: BUILDER
created: 2026-03-01T00:17:46-08:00
failure_count: 0
priority: NORMAL
authored_by: CUE
---

## User Request (Verbatim)

> "Wellness Journey phase 1 needs a compact HUD below the cards, above the Documentation confirmation, reflecting the entries made in the slideouts. Wellness Journey all three phases have a 3-div wide container at the bottom with fake static data; Send to Proddy for recommendations on HUD to enhance UX, or deletion. Request Proddy provide suggestions for both, notify LEAD and USER; USER to confirm action plan before build."

## CUE Summary

Two distinct UX items are in scope for Phase 1–3 of the Wellness Journey. Item 1: a compact HUD strip (below workflow cards, above the proceed/confirmation button) in Phase 1 that surfaces slideout form entries as live read-back data. Item 2: all three phases contain a 3-column bottom container populated with fake/static data — PRODDY must recommend whether to keep (and upgrade with real data) or delete entirely. No build may begin until USER confirms PRODDY's recommended action plan.

## Open Questions

None — request was clear.

## Out of Scope

- Any changes to the slideout panel forms themselves
- Phase 2 Live Session HUD / session timer (separate feature)
- Analytics pages or any other non-Wellness-Journey screens

---

## LEAD Decisions (Pre-authorized for BUILDER)

**Item 1 — Phase 1 Compact HUD strip:**  
Build it. `Phase1HUD` is already wired in `PreparationPhase.tsx` reading from localStorage via `HUDChip` components. Builder should update chip content to show clinically-relevant fields: **Risk Level** (color-coded), **PHQ-9 severity label**, **Substance**, **Patient Age**. Follow the WO-533 chip design pattern already in place. No new architecture needed.

**Item 2 — 3-column bottom container (all phases):**  
Delete it. Confirmed 100% static/mock data in the audit (WO-531). The Phase 2 sticky session HUD and vitals chart already provide live observability. Static fake data erodes clinical trust. Remove the container from Phase 1, Phase 2, and Phase 3 — no replacement component required.
