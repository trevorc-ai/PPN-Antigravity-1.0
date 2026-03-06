==== FLO ====
---
owner: CUE
status: 00_INBOX
authored_by: FLO
---

## WORK ORDER: WO-543

> **Work Order:** WO-543 — Enforce "Cockpit Mode" Strict Styling
> **Authored by:** FLO  
> **Date:** 2026-03-04  
> **Status:** Pending CUE review  
> **Priority:** P1

### Objective
Standardize the "Cockpit Mode" visual aesthetic for all active session screens (e.g., Crisis Logger, Vital Overrides), ensuring practitioners' night vision is preserved and interact-ability is infallible under stress.

### Context & Requirements
- The UI audit revealed that the CSS infrastructure (`[data-theme="cockpit"]`, massive `80px` buttons) exists but is not globally or consistently applied.
- The background must switch to True Black (`#000000`).
- Text MUST use Amber (`#FFB300`) or Red (`#FF5252`).
- All interactive targets must satisfy the Zero-Friction Motor Control limit (min-h: 80px).

### Tasks
- [ ] Identify all components utilized exclusively during active "In-Session" views.
- [ ] Wrap these components in the established `Cockpit` theme container class.
- [ ] Refactor buttons within these views to assert the 80px minimum height rule.
- [ ] Remove any conflicting styling that prevents True Black/Amber/Red overrides.

### Sign-Off Checklist
- [x] Clear Objective defined
- [x] Context & Requirements provided
- [x] Actionable tasks identified
- [x] Priority tagged as P1
- [x] Routed to `00_INBOX` for CUE review
==== FLO ====
