# WO-600 — CI Build Failure: TypeScript Type Errors (10 Errors)

**Status:** 03_BUILD
**Priority:** P0 — BLOCKER (CI is red, no deploy possible)
**Author:** INSPECTOR
**Date:** 2026-03-10
**Source:** GitHub Actions CI run #527, commit `3226083`, `npx tsc --noEmit` step

---

## Summary

The `CI / Build & Type Check` job is failing with 10 TypeScript errors across 4 files. These are pre-existing errors not introduced by the WO-595–599 HEAD commit. The CI was already red from an earlier commit. **No new code can be deployed until these are fixed.**

Lint Checks passed (19 seconds). Only Build & Type Check failed.

---

## Fix 1 — `src/components/MobileSidebar.tsx` (3 errors: lines 172, 224, 226)

### Error
```
Property 'external' does not exist on type '{ label: string; icon: string; path: string; }'.
Property 'badge' does not exist on type '{ label: string; icon: string; path: string; }'.
```

### Root Cause
The `sections` array on line 66 defines nav items as `{ label, icon, path }`. The template at lines 172 and 224–226 accesses `item.external` and `item.badge`, which are not part of that type.

### Fix
Add optional fields to item type. The `sections` array should be typed with an inline interface or type annotation:

```typescript
// BEFORE (implicit type, no optional fields)
const sections = [
    {
        items: [
            { label: 'Search', icon: 'search', path: '/search' },
        ]
    },
];

// AFTER: add optional fields to suppress TS errors (items already access them)
type NavItem = { label: string; icon: string; path: string; badge?: number; external?: boolean };
type NavSection = { title: string; items: NavItem[] };

const sections: NavSection[] = [
    // ... (no changes to values, only add the type annotation above)
];
```

**Files to modify:** `src/components/MobileSidebar.tsx`
- Line 66: add `const sections: NavSection[] = [` (add type annotation after declaring `NavSection` above it)
- Add `type NavItem = { label: string; icon: string; path: string; badge?: number; external?: boolean };` before the `sections` constant.
- Add `type NavSection = { title: string; items: NavItem[] };` before the `sections` constant.

**Do NOT change any JSX or logic.** Type-only change.

---

## Fix 2 — `src/components/wellness-journey/DosingSessionPhase.tsx:618` (1 error)

### Error
```
Object literal may only specify known properties, and 'source' does not exist in type 'SessionVitalData'.
```

### Root Cause
Line 618 passes `source: 'Session Update Panel'` to `createSessionVital()`. The `SessionVitalData` interface in `clinicalLog.ts` does not have a `source` field (it was removed in the schema rebuild — `data_source_code` replaced it, but no source data is needed here).

### Fix
**Remove line 618 only:**
```typescript
// REMOVE this line:
source: 'Session Update Panel',
```

The `createSessionVital()` call at lines 613–619 should be:
```typescript
await createSessionVital({
    session_id: resolvedSessionId,
    heart_rate: updateHR ? parseInt(updateHR, 10) : undefined,
    bp_systolic: updateBPSys ? parseInt(updateBPSys, 10) : undefined,
    bp_diastolic: updateBPDia ? parseInt(updateBPDia, 10) : undefined,
    // source removed — not in SessionVitalData interface
});
```

**Files to modify:** `src/components/wellness-journey/DosingSessionPhase.tsx`
- Remove line 618: `source: 'Session Update Panel',`

---

## Fix 3 — `src/components/wellness-journey/DosingSessionPhase.tsx:32-51` (2 errors)

### Error
```
Property 'props' does not exist on type 'Phase2ErrorBoundary'. (lines 33, 51)
Property 'setState' does not exist on type 'Phase2ErrorBoundary'. (line 32)
```

### Root Cause
TypeScript is not correctly resolving class member inheritance. The issue is that `handleReset` is declared as a private arrow function (`private handleReset = () => { ... }`), and TypeScript strict mode sometimes errors on `this.setState` and `this.props` inside class property initialisers when the base class typing is not inferred precisely.

### Fix
Change the private arrow function to be declared with an explicit type that tells TS the scope. Use a bound method via `constructor` or keep as arrow but explicitly type the `this`:

```typescript
// CURRENT (line 31-34):
private handleReset = () => {
    this.setState({ hasError: false, error: '' });
    this.props.onReset();
};

// REPLACE WITH (remove 'private', use public, helps TS resolve parent types):
public handleReset = () => {
    this.setState({ hasError: false, error: '' });
    this.props.onReset();
};
```

**Files to modify:** `src/components/wellness-journey/DosingSessionPhase.tsx`  
- Line 31: Change `private handleReset` → `public handleReset`

---

## Fix 4 — `src/components/wellness-journey/BehavioralChangeTracker.tsx:117` (1 error)

### Error
```
Object literal may only specify known properties, but 'change_type' does not exist in type 'BehavioralChangeData'. Did you mean to write 'change_date'?
```

### Root Cause
Line 117 passes `change_type: form.change_type` to `createBehavioralChange()`. The `BehavioralChangeData` interface in `clinicalLog.ts` does not have a `change_type` field — only `change_type_ids: number[]`. Line 118 already passes `change_type_ids` correctly.

### Fix
**Remove line 117 only:**
```typescript
// REMOVE this line:
change_type: form.change_type,
```

The `createBehavioralChange()` call should pass only fields in `BehavioralChangeData`. `change_type_ids` on the next line is sufficient.

**Files to modify:** `src/components/wellness-journey/BehavioralChangeTracker.tsx`
- Remove line 117: `change_type: form.change_type,`

---

## Fix 5 — `src/components/analytics/ReceptorBindingHeatmap.tsx:178` (1 error)

### Error
```
Conversion of type 'SubstanceKiProfile' to type 'Record<string, number>' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
```

### Root Cause
Line 178 casts a `SubstanceKiProfile` object directly to `Record<string, number>`, but TypeScript cannot verify overlap without an intermediate `unknown` cast.

### Fix
Add the intermediate `unknown` cast:

```typescript
// CURRENT (line 178):
} as Record<string, number>

// REPLACE WITH:
} as unknown as Record<string, number>
```

**Files to modify:** `src/components/analytics/ReceptorBindingHeatmap.tsx`
- Line 178: Change `} as Record<string, number>` → `} as unknown as Record<string, number>`

---

## Do NOT Touch

- `clinicalLog.ts` (type interfaces are correct — callers are wrong)
- `SafetyAndAdverseEventForm.tsx` (correct)
- `WellnessFormRouter.tsx` (correct)
- Any migration or database file
- Any file not listed above

---

## Acceptance Criteria

- [ ] `npx tsc --noEmit` exits 0 (no type errors)
- [ ] `npm run build` completes without errors
- [ ] CI `Build & Type Check` job passes green
- [ ] Lint Checks job continues to pass (currently passing)
- [ ] No changes to component logic, only type-level fixes
