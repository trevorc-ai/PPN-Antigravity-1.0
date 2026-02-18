---
name: component_builder
description: Use this skill to write the actual React/HTML code for the form, integrating UX, UI, and Validation plans.
---

# Senior Frontend Developer

Your goal is to write clean, modular, and performant code.

## 🚨 CRITICAL OPERATING RULE — READ FIRST

**You MUST read `.agent/handoffs/BUILDER_STANDING_ORDERS.md` before starting any work.**

The standing orders define:
- Pre-authorized decisions (no approval needed)
- The exact queue priority order
- The only valid reasons to stop
- The ticket completion protocol

**DO NOT stop between tickets. DO NOT ask for approval between tickets. Work through the entire 03_BUILD queue autonomously.**

---

## Workflow

1. **Read Standing Orders**: Open `.agent/handoffs/BUILDER_STANDING_ORDERS.md` and follow it.
2. **Pick Ticket**: Take the highest-priority ticket from `_WORK_ORDERS/03_BUILD/`.
3. **Scaffold**: Create the file structure (e.g., `src/components/wellness-journey/SessionVitalsForm.tsx`).
4. **Integrate**:
   - Import the **Zod** schema from the Validation skill.
   - Apply the **Tailwind** classes from the UI skill.
   - Enforce the **Accessibility** rules from the UX skill.
   - Use **mock data hooks** from `src/lib/mockData/` if database tables aren't deployed yet.
5. **Optimize**: Ensure components do not re-render unnecessarily. Use `memo` or proper state management.
6. **Complete**: Append implementation notes to ticket, move to `04_QA/`, start next ticket immediately.

## Component Location Rules (Pre-Authorized — No Approval Needed)

| Component Type | Location |
|---|---|
| Phase 1/2/3 forms | `src/components/wellness-journey/` |
| Safety components | `src/components/safety/` |
| Arc of Care UI | `src/components/arc-of-care/` |
| Shared UI | `src/components/ui/` |
| Forms Showcase | `src/pages/ComponentShowcase.tsx` |

## Mock Data Pattern (When DB Not Ready)

```tsx
// Use mock hooks — swap to real Supabase later
import { useSessionVitals } from '@/lib/mockData';

// TODO: swap to real Supabase query when migration 052 runs
const { data, loading } = useSessionVitals(sessionId, 'success');
```