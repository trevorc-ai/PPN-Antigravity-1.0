---
status: 01_TRIAGE
owner: LEAD
failure_count: 0
priority: MEDIUM
created: 2026-02-19
---

# WO-225: Landing Footer — Dead Legal Links

## Problem
The Landing page footer contains three legal/compliance links that are non-functional plain text:
- **Terms of Service** — no page exists
- **De-identification Policy** — no page exists
- **Registry Consensus** — no page exists

These appear as clickable `<li>` elements with `cursor-pointer` styling but navigate nowhere. A first-time visitor clicking them gets no feedback — it looks broken.

**Location:** `src/pages/Landing.tsx` lines 840–845

## LEAD Decision Needed
Choose from:

### Option A — Create stub pages (Recommended)
- 3 simple legal text pages at `/terms`, `/privacy`, `/consensus`
- Can be placeholder text initially, with real legal copy to follow
- Links updated to `<a href="/#/terms">` etc.

### Option B — Single Legal/Privacy page
- One consolidated page covering all three topics
- Cleaner routing, less maintenance

### Option C — External Links
- Link to Google Docs or a legal platform (e.g., Termly, Iubenda)
- Faster to ship, less control

## BUILDER Notes
Once strategy is chosen:
- Update `<li>` tags in Landing footer to `<a>` or `<Link>` tags
- Ensure all 3 navigation targets exist and are routed in `App.tsx`
- Also affects SecureGate.tsx footer if it has any legal links

## Priority Note
These links are visible to every landing page visitor. It looks unprofessional and potentially raises compliance red flags for clinical partners reviewing the site.
