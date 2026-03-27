---
id: WO-704
title: "Remove redundant bottom search bar visible on tablet view in Dashboard"
owner: LEAD
status: 00_INBOX
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-27
fast_track: true
origin: "User fast-track request"
admin_visibility: no
admin_section: ""
parked_context: ""
pillar_supported: "Safety"
task_type: bug-fix
files:
  - src/pages/Dashboard.tsx
---
## Request
Remove redundant bottom search bar on tablet view in Dashboard. On mobile it correctly appears at the bottom only; on tablet it appears at both top and bottom (redundant). Since it already fits at the top on tablet, the bottom bar should be tablet-hidden — mobile only.

## LEAD Architecture
The bottom sticky search bar container in `Dashboard.tsx` uses `lg:hidden`, meaning it is visible on both mobile (<768px) and tablet (768px–1023px). The desktop header search bar uses `hidden md:block`, making it correctly visible on tablet+. The fix is a single Tailwind class change on the bottom bar wrapper: `lg:hidden` → `md:hidden`, restricting the bottom bar to mobile only (<768px).

**Pillar:** Safety — cleaner practitioner UI reduces cognitive friction during clinical documentation sessions.

## Open Questions
- None. Root cause confirmed, single-line fix.
