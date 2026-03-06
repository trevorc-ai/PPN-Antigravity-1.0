
---
owner: CUE
status: 00_INBOX
authored_by: PRODDY
---

## WORK ORDER: WO-544

> **Work Order:** WO-544 — Smart Tooltips & Predictive Intelligence
> **Authored by:** FLO  
> **Date:** 2026-03-04  
> **Status:** Pending CUE review  
> **Priority:** P2

### Objective
Upgrade passive data visualization charts (Safety Surveillance, Wellness Journey) into actionable Clinical Intelligence tools by implementing contextual "Smart Tooltips."

### Context & Requirements
- Practitioners are currently required to mentally translate raw graph data into real-world insights, violating the "2-Click Challenge" cognitive load threshold.
- We must provide a "So What?" explanatory layer at a 9th-grade reading level.
- This layer transforms the chart from a descriptive view into an active safety and forensic logging asset.

### Tasks
- [ ] Identify all existing Recharts implementations and components.
- [ ] Enhance the standard Recharts `<Tooltip />` to utilize a custom component (e.g., `AdvancedTooltip.tsx`).
- [ ] Inject 9th-grade level explanatory text blocks that correlate raw metric spikes (e.g., G3 Severity Events) with historical probabilities (e.g., probability of protocol deviation).
- [ ] Verify styling (`bg-slate-900/90`, `border-white/10`) adheres to the Glass Panel standard.

### Sign-Off Checklist
- [x] Clear Objective defined
- [x] Context & Requirements provided
- [x] Actionable tasks identified
- [x] Priority tagged as P2
- [x] Routed to `00_INBOX` for CUE review

