---
id: WO-642
title: Admin Dashboard — Three-Domain Progress Tracker (Platform Health Enhancement)
owner: BUILDER
authored_by: INSPECTOR
routed_to: LEAD → BUILDER
status: 097_BACKLOG
priority: P2
created: 2026-03-14
depends_on: WO-612, WO-639
---

## Context

The PPN Portal Three-Domain Strategy (see `knowledge/strategy/PPN_Three_Domain_Strategy.md`) defines three sequential phases of the platform's growth:

- **Phase 1 (Now):** ppnportal.net — clinical tool active, SaaS revenue
- **Phase 2 (Q2 2026):** ppnportal.com — practitioner network launches
- **Phase 3 (Q3 2026):** ppnportal.org — research/public layer, Wisdom Trust activation

This WO adds a **Three-Domain Progress section** to the Platform Health tab, giving the admin a single view of where the platform stands against each phase's key milestones.

---

## Files to Modify

| File | Action |
|---|---|
| `src/pages/admin/AdminDashboard.tsx` | [MODIFY] PlatformHealth component — add ThreeDomainProgress section below the stat tiles |

---

## Component Spec

```tsx
interface DomainMilestone {
  label: string;
  current: number;
  target: number;
  unit: string;
  reached: boolean;
}

interface DomainStatus {
  domain: string;
  tld: '.net' | '.com' | '.org';
  tagline: string;
  color: 'blue' | 'green' | 'amber';
  status: 'active' | 'building' | 'planned';
  milestones: DomainMilestone[];
}
```

**Three domain cards — stacked or side-by-side at lg+:**

---

### Domain Card: ppnportal.net (blue — active)

```
🔵 ppnportal.net — The Clinical Tool          [ACTIVE]
──────────────────────────────────────────────
Active Sites:      [██████░░░░] 3 / 50
Sessions Logged:   [█░░░░░░░░░] 12 / 1,000
Active This Week:  [██░░░░░░░░] 2 / 20
```

Milestones pulled from live Supabase counts.

---

### Domain Card: ppnportal.com (green — building)

```
🟢 ppnportal.com — The Practitioner Network   [BUILDING]
──────────────────────────────────────────────
Advisory Board:    [░░░░░░░░░░] 0 / 7 seats
Directory Previews:[░░░░░░░░░░] 0 / 10 practitioners
"Coming Soon" page:[░░░░░░░░░░] Not yet deployed
```

Milestones: static targets, with manually-editable current values stored in a Supabase config table (`ref_platform_config`) or hardcoded as admin-editable in the dashboard.

---

### Domain Card: ppnportal.org (amber — planned)

```
🟠 ppnportal.org — The Research Layer         [PLANNED]
──────────────────────────────────────────────
Sessions toward 1st report: [█░░░░░░░░░] 12 / 1,000
k-Anon floor (5+ subjects): Not yet checkable
Advisory Board Review:      Pending Phase 2
```

Milestones: the 1,000-session threshold is pulled live; others are static status labels.

---

## Progress Bar Component

```tsx
const MilestoneBar: React.FC<{ label: string; current: number; target: number; unit: string }> = ({
  label, current, target, unit
}) => {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-400 font-bold">
        <span>{label}</span>
        <span>{current.toLocaleString()} / {target.toLocaleString()} {unit}</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500/60 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
```

---

## Config Table (for Phase 2 manually-tracked milestones)

The following milestones cannot be auto-computed yet and should be manually updatable by the admin. Store in a new application-layer table or as a simple hardcoded object the admin can update via a small edit form in the dashboard:

| Milestone | Initial Value |
|---|---|
| Advisory board seats filled | 0 |
| Directory preview practitioners opted in | 0 |
| ppnportal.com "Coming Soon" page deployed | false |

> NOTE: Do not create a migration file. Ask INSPECTOR to output the SQL for USER to run if a new table is needed. For MVP, hardcoded editable state in localStorage is acceptable.

---

## Acceptance Criteria

- [ ] Three domain cards render below the existing stat tiles in Platform Health
- [ ] ppnportal.net milestones pull live from Supabase (active sites, sessions, active this week)
- [ ] ppnportal.com milestones show manual-entry values with an edit pencil icon
- [ ] ppnportal.org session count mirrors the "Total Sessions" tile count
- [ ] Progress bars animate on load
- [ ] Cards are clearly color-coded: blue (.net), green (.com), amber (.org)
- [ ] Status badges: ACTIVE / BUILDING / PLANNED
- [ ] `npm run build` clean
