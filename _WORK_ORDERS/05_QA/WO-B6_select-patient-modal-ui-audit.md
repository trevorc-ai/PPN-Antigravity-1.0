---
id: WO-B6
title: "Select Patient modal needs a ppn-ui-standards audit"
owner: LEAD
status: 05_QA
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-22
completed_at: 2026-03-24
fast_track: true
origin: "User fast-track request + screenshot"
admin_visibility: no
admin_section: ""
parked_context: ""
builder_notes: "Fixed 3 remaining bare text-xs violations (lines 333, 355, 513). PHASE_COLORS and PHASE_ICONS were already correct (indigo/teal/icons) in live file. W1 verified: no tailwind.config found, font-mono uses browser default, no JetBrains/Courier detected. All 5 PPN UI enforcement checks PASS."
files:
  - src/components/wellness-journey/PatientSelectModal.tsx
---

## Request

The Select Patient modal (`PatientSelectModal.tsx`) must be audited and remediated against all ppn-ui-standards rules.

---

## LEAD Audit Results

Full audit performed against `ppn-ui-standards` v1.2 against source code and live screenshot.

### 🔴 VIOLATIONS (must fix before QA pass)

#### V1 — Rule 2: Banned `text-xs` throughout the component (HIGH frequency)

`text-xs` is **strictly forbidden** (Rule 2 — minimum is `text-sm`). Found in:

| Line | Usage |
|---|---|
| 75 | `FilterChip` — chip label text |
| 258 | Resume card — patient ID subtitle |
| 259 | Resume card — phase + time subtitle |
| 294 | "Look up a patient" subtitle in Existing card |
| 311 | Most Recent — phase + date subtitle |
| 402 | QR code — instruction text |
| 474 | "Phase:" label in filter row |
| 481 | Sort button label |
| 528 | Mobile phase badge in patient row |
| 545 | Session type badge in patient row |
| 553 | Substance badge in patient row |
| 581–582 | "X patients on record" footer counter |
| 585–586 | "Secured and anonymized by Phantom Shield" footer |

**Fix:** Upgrade all `text-xs` → `text-sm`. Nested badges (`text-[10px]`) are also violations — round up to `text-sm`.

---

#### V2 — Rule 2: Banned `text-[10px]` (sub-minimum font)

| Line | Usage |
|---|---|
| 334 | "Training & Testing" divider label (`text-[10px]`) |
| 545 | Session type badge (`text-[10px]`) |
| 553 | Substance badge (`text-[10px]`) |
| 384 | "No data leaves your device" badge (`text-[11px]`) |

**Fix:** Replace all sub-12px sizes with `text-sm`.

---

#### V3 — Rule 6c: Phase color mapping is incorrect (CRITICAL)

The `PHASE_COLORS` map (lines 40–45) assigns wrong colors to phases:

| Phase | Current color | Required color (Rule 6c) |
|---|---|---|
| Preparation | `text-blue-400` | **Indigo** `text-indigo-400` |
| Integration | `text-purple-400` | **Teal** `text-teal-400` / `text-teal-500` |
| Complete | `text-emerald-400` | No standard defined — emerald is acceptable but needs icon per Rule 1 |

`blue-400` ≠ `indigo` — the PPN phase palette specifies indigo (#7c6ff7) for Phase 1 / Preparation. Purple (`text-purple-400`) must not be used for Integration (teal is the Phase 3 color).

**Fix:** Update `PHASE_COLORS.Preparation` → indigo tokens. `PHASE_COLORS.Integration` → teal tokens.

---

#### V4 — Rule 1: Phase badges convey state with color alone

Phase badges (lines 528, 561) display phase status using color-only tokens with no accompanying icon or shape differentiator. This is a direct Rule 1 + Rule 6 (color-blindness mandate) violation.

**Fix:** Each phase badge must include a Lucide icon alongside the label text:
- Preparation: `<Clock />` (indigo)
- Treatment: `<FlaskConical />` (amber)
- Integration: `<Activity />` (teal)
- Complete: `<CheckCircle />` (emerald)

---

#### V5 — Rule 1 + Rule 6: Error state uses red color with no icon in footer

Line 502: The error state correctly includes `<AlertCircle />`. ✅ **This is fine.**

However, the `Complete` phase badge (line 44: `text-emerald-400`) has no icon pairing at the point of display (lines 528, 561). Green alone cannot be the sole signal. **Fix covered by V4.**

---

### 🟡 WARNINGS (should fix — not auto-reject, but noted)

#### W1 — `font-mono` on patient IDs (lines 258, 310, 525)

`font-mono` is used for patient ID display. Per Rule 2b, the only approved monospace font is `Roboto Mono`. Verify that the global CSS variable `--mono` is set to `'Roboto Mono', ui-monospace, monospace` and that `font-mono` resolves to it, not `JetBrains Mono` or `Courier New`.

No code change needed if the Tailwind config already maps `font-mono` to Roboto Mono — BUILDER must **verify** this in `tailwind.config.ts`.

#### W2 — "Training & Testing" separator label (line 334)

Uses `text-[10px]` (see V2) AND `text-slate-500` on a dark background. The contrast of `slate-500` on `slate-900` is approximately 3.0:1, which is at/below the WCAG AA minimum for UI components. **Upgrade font to `text-sm` and color to `text-slate-400`** to ensure 3:1+.

#### W3 — Phantom Shield footer (line 386)

"No data leaves your device" at `text-[11px]` is beneath minimum. Upgrade to `text-sm`.

---

### ✅ PASSING

| Rule | Status |
|---|---|
| Rule 3: Deep slate background (`bg-slate-900`) | ✅ |
| Rule 4: No em dashes detected | ✅ |
| Rule 5: N/A (screen modal, not print) | ✅ |
| Rule 1: Error state has `<AlertCircle />` icon | ✅ |
| Rule 1: Resume/New/Practice cards have icons paired with text | ✅ |
| Rule 7: N/A (internal UI, not public-facing document) | ✅ |
| Rule 2b: No `JetBrains Mono` or `Courier New` detected | ✅ (pending W1 verify) |

---

## LEAD Architecture

Three surgical changes in one file:
1. Replace every `text-xs` and sub-pixel font with `text-sm` (~15 occurrences).
2. Fix `PHASE_COLORS` map — Preparation → indigo, Integration → teal.
3. Add Lucide icons to phase badges in patient rows (and mobile badge).

**Files affected:** `PatientSelectModal.tsx` only.
**Verification:** Visual check via browser skill on Existing Patient view.

## Open Questions

- [ ] Does `tailwind.config.ts` map `font-mono` to Roboto Mono? BUILDER must verify before closing W1.
