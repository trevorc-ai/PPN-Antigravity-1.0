---
id: WO-666
title: "Extract Shared Export UI Components — ExportCard, FormatBadge, ComplianceFooter"
owner: LEAD
status: 00_INBOX
authored_by: PRODDY (fast-track)
priority: P2
created: 2026-03-23
fast_track: false
origin: "GO-660 audit finding — duplicate UI patterns rendering 2-3x across DownloadCenter, SessionExportCenter, DataExport"
linked_go: GO-660
admin_visibility: no
admin_section: ""
parked_context: "Must be executed BEFORE or in parallel with WO-665b/665c to avoid duplicating fixes across both files"
files:
  - src/pages/DownloadCenter.tsx
  - src/pages/SessionExportCenter.tsx
  - src/pages/DataExport.tsx
  - src/components/exports/ (new directory)
database_changes: no
active_sprint: false
---

## Request

The GO-660 audit identified three UI patterns that are duplicated 2–3 times across the export/download screens with slightly different implementations. Extract these into shared components to fix duplication at the code level (not just the UX level) and prevent future drift between screens.

---

## LEAD Architecture

**This is a pure component extraction WO — zero logic changes, zero schema changes, zero new features.** BUILDER moves existing JSX into shared components and replaces inline implementations with imports. Risk is low if done in isolation before WO-665 screen rebuilds.

**Execution order:** This WO should complete BEFORE or concurrently with WO-665b (DownloadCenter) and WO-665c (SessionExportCenter) to avoid both tickets touching the same card JSX independently and creating merge conflicts.

**New directory to create:** `src/components/exports/`

---

## Components to Extract

### 1. `<ExportCard />` — `src/components/exports/ExportCard.tsx`

**Currently duplicated in:** `DownloadCenter.tsx` (lines 235–301) AND `SessionExportCenter.tsx` (lines 500–581)

**Props interface (BUILDER to implement):**
```typescript
interface ExportCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  format: 'pdf' | 'csv' | 'zip' | 'json' | 'txt';
  badge?: string;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  includes?: string[];          // Optional — shown in SessionExportCenter but not DownloadCenter
  actionType: 'route' | 'function' | 'new-tab' | 'download';
  actionLabel?: string;          // Defaults to "Download" or "Open Tool" based on actionType
  onAction: () => void;
  isDownloading?: boolean;
  isDone?: boolean;
  isDisabled?: boolean;
}
```

**Visual contract:** Card must match the existing visual exactly — no style changes allowed in this WO. This is a structural extraction only.

---

### 2. `<FormatBadge />` — `src/components/exports/FormatBadge.tsx`

**Currently duplicated in:** `DownloadCenter.tsx` (line 267), `SessionExportCenter.tsx` (line 543), `DataExport.tsx` (lines 137–142)

**Props interface:**
```typescript
interface FormatBadgeProps {
  format: 'pdf' | 'csv' | 'zip' | 'json' | 'txt';
  size?: 'sm' | 'xs';    // default 'xs' for card footers
}
```

**Color mapping (must match existing):**
- `pdf` → amber (`text-amber-400 bg-amber-500/10 border-amber-500/20`)
- `csv` → emerald (`text-emerald-400 bg-emerald-500/10 border-emerald-500/20`)
- `json` → indigo (`text-indigo-400 bg-indigo-500/10 border-indigo-500/20`)
- `zip` → blue (`text-blue-400 bg-blue-500/10 border-blue-500/20`)
- `txt` → slate (`text-slate-400 bg-slate-500/10 border-slate-500/20`)

> **Note to BUILDER:** The current DataExport.tsx uses `'pdf' → amber` for its format badge — align all three screens to this mapping.

---

### 3. `<ComplianceFooter />` — `src/components/exports/ComplianceFooter.tsx`

**Currently duplicated in:** `SessionExportCenter.tsx` (lines 654–675) AND `DataExport.tsx` (lines 430–444)

**Props interface:**
```typescript
interface ComplianceFooterProps {
  showCopyright?: boolean;    // DataExport shows copyright line; SessionExport does not
  showTimestamp?: boolean;    // SessionExport shows "All exports logged with timestamp"; DataExport does not
}
```

**Visual contract:** Two-column flex row with HIPAA Compliant + FDA 21 CFR Part 11 items separated by a `h-3 w-px bg-slate-800` divider. Existing styling preserved exactly.

---

## Acceptance Criteria

- [ ] `src/components/exports/` directory created with 3 new files
- [ ] All three components are TypeScript with full prop type definitions
- [ ] `DownloadCenter.tsx` no longer contains inline export card JSX — uses `<ExportCard />`
- [ ] `SessionExportCenter.tsx` no longer contains inline export card JSX — uses `<ExportCard />`
- [ ] `DataExport.tsx` format badge uses `<FormatBadge />`
- [ ] Both `SessionExportCenter.tsx` and `DataExport.tsx` compliance footers use `<ComplianceFooter />`
- [ ] Zero visual regressions — INSPECTOR confirms visual parity via browser screenshots
- [ ] TypeScript compiles with zero new errors (`npm run build` passes)
- [ ] No logic changes, no data changes, no layout changes — structural extraction only

## Open Questions

- [ ] Should `ExportCard` include the `includes` bullet list (currently only in SessionExportCenter)? Recommend: yes, as an optional prop defaulting to hidden.
- [ ] DataExport's format picker (lines 254–268) uses a different card layout than the format badge — confirm whether `FormatBadge` should be used there or kept as a separate pattern.
