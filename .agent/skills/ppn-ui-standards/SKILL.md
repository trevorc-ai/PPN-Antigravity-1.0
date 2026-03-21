---
name: ppn-ui-standards
description: MANDATORY CSS, Tailwind, and Accessibility rules for the PPN Portal platform.
---

# PPN UI Standards

> **MANDATORY** - Read every rule before writing any UI code. These rules protect our color-blind lead designer and clinical users.

---

## Brand Name Reference

| Term | Usage |
|---|---|
| **PPN Portal** | The company and product name. Use this everywhere. |
| Psychedelic Practitioner Network | The peer-network feature set - planned for a future phase. **Do not use as the company name.** |
| PPN | Acceptable shorthand in informal or space-constrained contexts. |

---

## Rule 1: Color-Blindness Mandate

**Never use color alone to convey meaning.**

Every color indicator MUST be paired with either a Lucide React icon OR explicit text.

| OK | NOT OK |
|---|---|
| `<AlertTriangle /> text-red-500` | `text-red-500` alone |
| `<CheckCircle /> text-green-500` | `bg-green-500` alone |

---

## Rule 2: Minimum Font Size

**The smallest allowed font size is `text-sm` (14px on desktop; 12px on mobile).**

- `text-xs` is strictly forbidden throughout the entire application.


---

## Rule 2b: Typography — Banned Fonts

**No serif fonts allowed anywhere in the platform or documents.**

| Font | Status |
|---|---|
| `Inter` | ✓ Required — primary typeface |
| `Roboto Mono` | ✓ Approved — only monospace font allowed |
| `JetBrains Mono` | ✗ Banned |
| `Courier New` | ✗ Banned (serif monospace) |
| Any other serif | ✗ Banned |

- `--mono` variable must be: `'Roboto Mono', ui-monospace, monospace`

---

## Rule 3: Clinical Aesthetic

| Element | Required style |
|---|---|
| **Backgrounds** | Deep Slate only: `#020408` or `bg-slate-950`. Never flat black. |
| **Panels / containers** | `bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-6` |
| **Form inputs** | No free-text `<textarea>` inputs. Use structured selects or defined fields. |

---

## Rule 4: Em Dash Ban

**The em dash character (—) is forbidden. A hyphen acting as an em dash (` - `) is equally forbidden in body text.**

- **In body text:** replace with comma+space `, ` only.
- **In headings or labels:** a standard hyphen `-` is acceptable.

| Context | Wrong | Correct |
|---|---|---|
| Body text | `operate and document - without fear` | `operate and document, without fear` |
| Body text | `a liability gap - and most` | `a liability gap, and most` |
| Heading/label | `Zero-Knowledge by Design` | `Zero-Knowledge by Design` (fine) |

---

## Rule 5: Print & PDF Context

**Rules 1-4 apply to screen/application UI. For any printable or PDF-exported document, apply these overrides:**

| Element | Required style |
|---|---|
| **Page size** | `letter` (US Letter, 8.5x11in). Never A4. Landscape: `letter landscape`. |
| **Margins** | `@page { size: letter; margin: 0.6in; }` + `@media screen { body { padding: 0.6in; } }` |
| **Backgrounds** | White (`#ffffff`) or near-white (`#f8f9fc`) only. No solid dark fills on the page. |
| **Table headers** | Light accent tint (`#ede9ff`) with indigo text (`#3730a3`). No dark fills. |
| **Font size** | Minimum 9pt body copy. Minimum 7pt captions/footers. |
| **Page breaks** | Add `break-inside: avoid` to any multi-column flex or grid block to prevent splits. |
| **Color indicators** | Rule 1 still applies: icon or text label required alongside any color. |