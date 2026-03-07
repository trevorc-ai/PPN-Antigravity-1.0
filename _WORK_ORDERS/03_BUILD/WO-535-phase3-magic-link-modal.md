---
id: WO-535
title: Phase 3 Magic Link Modal for Patient Journey
owner: BUILDER
status: 03_BUILD
filed_by: LEAD
designed_by: DESIGNER
date: 2026-03-06
priority: P2
files:
  - src/components/wellness-journey/MagicLinkModal.tsx
---

## Design Decision

> **WO-535 — Phase 3 Magic Link Modal**
> **Status:** Build-ready. Component exists and is wired. BUILDER must fix 4 QA violations.

---

### Context

A `MagicLinkModal` component **already exists** at `src/components/wellness-journey/MagicLinkModal.tsx` (225 lines).
It is already imported and wired in `IntegrationPhase.tsx`:
- Import: line 17
- State: `isMagicLinkModalOpen` (line 193)
- Trigger button: lines 769–775 (`"Share Patient Link"` button in the Actions row)
- Render: lines 793–798, receives `isOpen`, `onClose`, and `patientHash={journey.patientId}`

The component logic is complete: toggle state for `neurobiology`, `flightPlan`, `pems`; simulated link generation with `crypto.randomUUID()`; clipboard copy; Zero-Knowledge Safety badge.

**No new component scaffolding is needed.** BUILDER's job is to bring the existing component to INSPECTOR QA compliance.

---

### Acceptance Criteria

#### AC-1 — Typography: Replace all ad-hoc headings and body text with `.ppn-*` classes

The component uses raw Tailwind sizes (`text-xl font-bold`, `text-base font-semibold`, `text-sm`) — all are QA failures.

| Element | Current | Required |
|---|---|---|
| `"Customize Patient Journey Link"` (h2) | `text-xl font-bold text-slate-100` | `ppn-card-title` |
| `"Select which clinical modules…"` (p) | `text-sm text-slate-400` | `ppn-body text-slate-400` |
| `"Neurobiology & Brain Maps"` (h3) | `text-base font-semibold text-slate-200` | `ppn-label text-slate-200` |
| `"Pharmacokinetic Flight Plan"` (h3) | same | `ppn-label text-slate-200` |
| `"P.E.M.S. Integration Framework"` (h3) | same | `ppn-label text-slate-200` |
| Description `<p>` blocks within each option | `text-sm text-slate-400` | `ppn-body text-slate-400` |
| Zero-Knowledge disclaimer `<p>` | `text-sm text-amber-200/80` | `ppn-body text-amber-200/80` |
| Link input field (read-only, line 177) | `text-sm text-slate-300` | `ppn-body text-slate-300` |
| Copy / Cancel button labels | `text-sm font-medium` | `ppn-body` or `ppn-meta font-bold` acceptable |

#### AC-2 — Color: Replace `bg-emerald-*` (prohibited) with teal

Line 204: `'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25'` (the "copied" success state button).
Replace with: `'bg-teal-700 hover:bg-teal-600 shadow-teal-900/40 border border-teal-500/30'`

The `Check` icon next to "Copied" on line 187: `text-emerald-400` → `text-teal-400`

#### AC-3 — Accessibility: Add `aria-label` to all icon-only and toggle buttons

- **Close button** (line 85): add `aria-label="Close modal"`
- **Neurobiology toggle** (line 110): add `aria-label={toggles.neurobiology ? 'Disable Neurobiology & Brain Maps' : 'Enable Neurobiology & Brain Maps'}` and `role="switch"` + `aria-checked={toggles.neurobiology}`
- **Flight Plan toggle** (line 131): same pattern → `aria-label={toggles.flightPlan ? 'Disable Pharmacokinetic Flight Plan' : 'Enable Pharmacokinetic Flight Plan'}`, `role="switch"`, `aria-checked={toggles.flightPlan}`
- **P.E.M.S. toggle** (line 152): same pattern → `aria-label={toggles.pems ? 'Disable P.E.M.S. Framework' : 'Enable P.E.M.S. Framework'}`, `role="switch"`, `aria-checked={toggles.pems}`

#### AC-4 — Color: Fix Phase 3 accent color for the header icon

Line 77: `<LinkIcon className="text-indigo-400 ...">` — indigo is Phase 1's color. Phase 3 uses **teal**.
Replace: `text-indigo-400` → `text-teal-400`

The patient hash span on line 82: `text-emerald-400` → `text-teal-400`

---

### Out of Scope for This WO

- The simulated backend / `crypto.randomUUID()` logic is acceptable as-is. Real token persistence is a future WO.
- No route changes needed — the modal is triggered in-page.
- No schema migrations.
- Do NOT modify `IntegrationPhase.tsx` (already wired correctly).

---

### Constraints

- Follow `frontend-best-practices` SKILL exactly. No `text-[8..11px]` anywhere.
- Phase 3 = teal. No `emerald`, no `green` for brand actions.
- `focus:outline-none` on toggle buttons is acceptable only if paired with `focus-visible:ring-2 focus-visible:ring-teal-500`.

---

### Verification Steps

1. Open Phase 3 → scroll to bottom Action row → click **"Share Patient Link"**
2. Modal opens: 3 toggle rows visible, ZK Safety badge visible
3. Toggle each option — toggle pill animates, `aria-checked` flips in DevTools
4. Click **"Generate Magic Link"** → 1.2s simulated delay → link appears in the input → auto-copied
5. Success button state shows teal (not emerald)
6. Header icon is teal
7. INSPECTOR: run pre-commit checklist from `frontend-best-practices` SKILL — all items must pass
