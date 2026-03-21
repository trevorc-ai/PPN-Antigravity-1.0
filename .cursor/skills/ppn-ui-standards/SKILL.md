---
name: ppn-ui-standards
description: MANDATORY CSS, Tailwind, and Accessibility rules for the Psychedelic Practitioner Network.
---

# PPN UI Standards

> **MANDATORY** - Read every rule before writing any UI code. These rules protect our color-blind lead designer and clinical users.

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

**The smallest allowed font size is `text-sm` (14px).**

- `text-xs` is strictly forbidden throughout the entire application.
- No exceptions.

---

## Rule 3: Clinical Aesthetic

| Element | Required style |
|---|---|
| **Backgrounds** | Deep Slate only: `#020408` or `bg-slate-950`. Never flat black. |
| **Panels / containers** | `bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-6` |
| **Form inputs** | No free-text `<textarea>` inputs. Use structured selects or defined fields. |

---

## Rule 4: Em Dash Ban

**The em dash character (—) is forbidden.**

Use a hyphen `-` or colon `:` instead.