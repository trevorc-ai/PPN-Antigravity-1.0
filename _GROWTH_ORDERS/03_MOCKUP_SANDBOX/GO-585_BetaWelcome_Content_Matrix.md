---
target_keyword: psychedelic therapy practitioner platform founding member
seo_title: PPN Portal - Founding Member Access
seo_meta_description: You have been selected for early access to the PPN Portal - 1,500+ real clinical outcome records, zero-PHI by design, built for psychedelic therapy practitioners.
aio_schema_type: MedicalOrganization
aio_schema_description: The Psychedelic Practitioner Network (PPN) Portal is the first clinical documentation and network intelligence platform built for psychedelic therapy practitioners, enabling secure, zero-PHI outcome tracking and real-time global benchmarking.
internal_links:
  - anchor_text: "Enter the Network"
    target_url: "/analytics"
---

# CONTENT MATRIX: Beta Welcome Screen (WO-585)
**MARKETER | GROWTH Pipeline | 01_DRAFTING**
**Date:** 2026-03-09

---

## VIOLATION AUDIT (Reason for Rewrite)

The following violations were identified in the current `BetaWelcome.tsx` by PRODDY + MARKETER review:

| Line | Violation | Rule |
|------|-----------|------|
| 49 | `text-xs` used on badge | ppn-ui-standards §2 - banned below 14px |
| 88 | Em dash in body copy | ppn-ui-standards §4 - em dash is banned |
| 76 | Em dash in body copy | ppn-ui-standards §4 - em dash is banned |
| 95 | `ppn-meta` (12px) for social proof paragraph | ppn-ui-standards §2 - 14px minimum |
| 112 | `ppn-meta` on footer note | ppn-ui-standards §2 - 14px minimum |
| 118 | `ppn-meta` on PPN wordmark | ppn-ui-standards §2 - 14px minimum |
| 56 | Glass card uses wrong border/radius pattern | ppn-ui-standards §3 - mandated glass pattern |
| All | Passive, weak copy voice | marketer-protocol §3 - clinical, forward-looking |
| - | No SEO meta, no JSON-LD schema | marketing-qa-checklist §1 |
| - | Not in ASSET_LEDGER.md | marketing-qa-checklist §4 |

---

## PAGE COPY (All Text Content for BUILDER)

### HTML Title Tag
```
PPN Portal - Founding Member Access
```

### Meta Description
```
You have been selected for early access to the PPN Portal. 1,500+ real clinical outcome records, zero-PHI by design, built for psychedelic therapy practitioners.
```

### Badge Text (top of card)
```
Founding Member Access
```

### Greeting (when ?name= is present)
```
Welcome back,
[FirstName].
```

### Greeting (when no ?name= param)
```
Welcome.
```

### Orientation Paragraph (below greeting)
```
You are seeing the PPN Portal before anyone else. This is the first clinical documentation and network intelligence platform built for psychedelic therapy practitioners - and the data you are about to see is real.
```

### Benchmark Stat Block

**Number:**
```
1,500+
```

**Supporting line:**
```
anonymized clinical outcome records, live in the network now.
```

### Social Proof Line
```
You are among the first practitioners to see the network.
```

### Primary CTA Button
```
Enter the Network
```

### Footer Access Confirmation
```
Your access is active. No setup required.
```

### PPN Wordmark (bottom of page)
```
Psychedelic Practitioner Network
```

---

## DESIGN DIRECTION FOR BUILDER

The following are copy and structural intent notes. BUILDER must implement using the correct ppn-ui-standards classes. These are NOT code instructions.

- **Badge:** "Founding Member Access" with a Shield icon. Must use `ppn-body` minimum (not `ppn-meta`). Pill shape, indigo accent.
- **Glass card:** Must use the mandated glass pattern: `bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-6`
- **All instances of `ppn-meta`** currently in the component must be upgraded to `ppn-body` minimum.
- **No em dashes anywhere.** Use commas or colons. The comma after "records" in the benchmark block is deliberate.
- **Typography hierarchy:** Single `h1` on the page (the greeting). All other text body or label level.
- **SEO:** A `<Helmet>` or equivalent title/meta must be injected at the component level. BUILDER to use the existing pattern in ForClinicians.tsx or equivalent.
- **JSON-LD Schema:** A `MedicalOrganization` schema block in the page head. See ForClinicians.tsx for the implementation pattern.

---

## PRODDY SIGN-OFF

Before BUILDER touches a line of code, this content matrix must be reviewed and approved by USER.

Copy has been rewritten to:
- Remove all em dashes (replaced with commas/colons)
- Eliminate passive voice ("You've been given" -> "You are seeing")
- Strengthen the hook ("the data you are about to see is real")
- Comply with PPN brand voice: professional, clinical, forward-looking

MARKETER CONTENT_MATRIX.md - 01_DRAFTING
Awaiting USER review before proceeding to 02_USER_REVIEW.
