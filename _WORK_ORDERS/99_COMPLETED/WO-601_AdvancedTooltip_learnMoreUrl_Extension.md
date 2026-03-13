---
owner: BUILDER
status: 03_BUILD
authored_by: LEAD
priority: P1
blocks: WO-600 (Tooltip -> Help Link Sweep)
created: 2026-03-12
---

# WO-601: Extend AdvancedTooltip with learnMoreUrl Prop

## LEAD Decision Summary

**Q1 (WO-600) is now answered.** Code inspection of `src/components/ui/AdvancedTooltip.tsx` confirms:

- The `AdvancedTooltipProps` interface does NOT include a `learnMoreUrl` prop.
- The component imports `ExternalLink` from Lucide React but **never uses it** - it was clearly stubbed for this exact purpose.
- The `guide` tier footer already has an extensible `{(glossaryTerm || type === 'critical') && (...)}` block. The `learnMoreUrl` button should slot into this footer row.
- WO-581 (Tooltip Sweep, COMPLETED 2026-03-11) explicitly scoped out "building or redesigning the AdvancedTooltip component" - confirming this prop has never been added.

This is a prerequisite for the WO-600 tooltip-to-help-link sweep. It must ship before the sweep begins.

---

## Specification

### Prop to add

```ts
learnMoreUrl?: string; // e.g. "/help/interaction-checker" or "/help/faq#benchmark-hidden"
```

Add to `AdvancedTooltipProps` interface at line 10 of `AdvancedTooltip.tsx`.

### Behavior

- Render only if `learnMoreUrl` is provided. Never render an empty link.
- Render in the **guide tier footer** (lines 246-261), alongside `glossaryTerm`.
- Render in the **standard tier tooltip** below the content block, as a small "Learn more" text link.
- On click: open the help article. Use `window.open(learnMoreUrl, '_blank', 'noreferrer')` for external URLs; use `useNavigate` from react-router-dom for internal `/help/...` paths. Internal paths are always preferred.
- Icon: use the already-imported `ExternalLink` (size 12) for external URLs. For internal `/help/...` routes use `BookOpen` (size 12, already imported).
- Accessibility: `aria-label="Learn more about [title]"` on the link element.
- The prop should work on all three tiers (micro, standard, guide), but rendering is simplified on micro: show only the icon, no text label.

### Files to modify

- `src/components/ui/AdvancedTooltip.tsx` - Add prop, update all 3 tier render branches.

### Files to NOT touch

- Any component that already uses `AdvancedTooltip` - the prop is optional with no default. Zero breaking changes guaranteed.

---

## Acceptance Criteria

1. `AdvancedTooltipProps` includes `learnMoreUrl?: string`.
2. When `learnMoreUrl` is set on a `guide` tier tooltip, a "Learn more" link with `BookOpen` icon appears in the tooltip footer.
3. When `learnMoreUrl` is set on a `standard` tier tooltip, a small "Learn more" link appears below the content block.
4. Clicking the link navigates to the help article without closing the app.
5. No existing tooltip instances are broken (prop is optional, no default behavior changes).
6. `ExternalLink` import is used (no unused imports).

---

## Verification

1. Add `learnMoreUrl="/help/interaction-checker"` to any existing `AdvancedTooltip` in the codebase (dev only, revert after test).
2. Hover or click the tooltip. Confirm the "Learn more" link appears with the `BookOpen` icon.
3. Click the link. Confirm it navigates to `/help/interaction-checker` without a full page reload.
4. Remove the test prop. Confirm the tooltip renders exactly as before.

**Route:** BUILDER -> INSPECTOR -> LEAD sign-off -> unblocks WO-600 tooltip sweep.
