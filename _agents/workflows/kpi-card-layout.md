---
description: Apply the standard KPI Card (Stat Card) two-row layout to any metric card component
---

# KPI Card Layout Standard

## Background

The KPI Card layout is the approved design pattern for all stat/metric/performance cards across the PPN platform. It was established during Dashboard polish on 2026-03-18 and replaces any layout that places the decorative icon alone in the top-left corner (which creates unnecessary whitespace and layout conflicts).

**Reference implementation:** `src/pages/Dashboard.tsx` → `ClinicPerformanceCard` component.

---

## Layout Structure

Every KPI Card has exactly two rows:

```
┌─────────────────────────────────────────┐
│  CARD LABEL (left)      [ICON BADGE]    │  ← Row 1: flex justify-between
│                                         │
│  Primary Metric (left)    +12% pill     │  ← Row 2: flex items-end justify-between
└─────────────────────────────────────────┘
```

### Row 1 — Header Row
- **Left:** Card label — `text-sm font-bold text-slate-500 uppercase tracking-widest leading-snug`
- **Right:** Decorative icon badge — `flex-shrink-0 p-2.5 rounded-2xl` with tinted background and border

### Row 2 — Value Row
- **Left:** Primary metric — `text-3xl md:text-4xl font-black tracking-tighter` in the card's accent color
- **Right:** Delta pill — `font-bold px-2.5 py-1 rounded-lg text-sm` with `bg-emerald-500/15 text-emerald-400 border border-emerald-500/25` for positive, or `bg-slate-800 text-slate-300 border border-slate-700/50` for neutral/negative

---

## Step-by-Step Implementation

### 1. Identify the target component
Find the card component that needs updating. It will typically be a `<div>` with a `rounded-3xl` container and some existing icon + title + value layout.

### 2. Replace the card's inner JSX with the two-row pattern

```tsx
return (
  <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 md:p-5 transition-all group ...">
    {/* Optional: hover glow */}
    <div className={`absolute -top-10 -right-10 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${colorBg}`} />

    {/* Row 1: Card Label (left) + Icon Badge (right) */}
    <div className="flex items-start justify-between mb-3 md:mb-4 relative z-10">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-snug pr-2">
        {title}
      </h3>
      <div className={`flex-shrink-0 p-2.5 rounded-2xl ${colorGlow} border border-slate-700/50`}>
        <Icon className={`w-5 h-5 md:w-6 md:h-6 ${colorText}`} />
      </div>
    </div>

    {/* Row 2: Primary Metric (left) + Delta Pill (right) */}
    <div className="flex items-end justify-between relative z-10">
      <div className={`text-3xl md:text-4xl font-black tracking-tighter ${colorText}`}>
        {value}
      </div>
      <span className={`flex-shrink-0 font-bold px-2.5 py-1 rounded-lg text-sm ${
        change.startsWith('+')
          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
          : 'bg-slate-800 text-slate-300 border border-slate-700/50'
      }`}>
        {change}
      </span>
    </div>
  </div>
);
```

### 3. Map color tokens to the card's accent color

| Color | `colorText` | `colorGlow` | `colorBg` |
|--|--|--|--|
| indigo | `text-indigo-400` | `bg-indigo-500/20` | `bg-indigo-500` |
| emerald | `text-emerald-400` | `bg-emerald-500/20` | `bg-emerald-500` |
| amber | `text-amber-400` | `bg-amber-500/20` | `bg-amber-500` |
| blue | `text-blue-400` | `bg-blue-500/20` | `bg-blue-500` |

### 4. Remove any old secondary text

The old pattern often included `"vs last month"` text and a `comparison` subtitle below the delta badge. **Remove these** — the two-row layout is self-sufficient.

### 5. Verify at mobile breakpoints

- At `sm` (375px): Card label should not wrap into icon badge territory (`pr-2` prevents this)
- Primary metric `text-3xl` and delta pill should sit on the same baseline
- Icon badge must be `flex-shrink-0` so it never collapses

---

## What NOT to Do

- ❌ Do not put the icon in the top-left. The icon always lives in the **top-right**.
- ❌ Do not stack icon → title → value → badge vertically as a single column.
- ❌ Do not add secondary comparison text below the delta pill (clutters the card).
- ❌ Do not use different border-radius — always `rounded-3xl` for outer, `rounded-2xl` for icon badge.
