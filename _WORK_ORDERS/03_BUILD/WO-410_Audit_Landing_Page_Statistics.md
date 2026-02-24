---
id: WO-410
status: 03_BUILD
owner: BUILDER
priority: MEDIUM
failure_count: 0
created: 2026-02-23
source: Jason/Trevor Demo Debrief 2/23/26
demo_deadline: Before any public demo or VC meeting
---

# WO-410 — Audit & Remove Unverified Statistics from Landing Page

## USER STORY (verbatim from demo)
> "On the start page it says 15,000 practitioners. I really only found about 900 between Oregon licensed and Colorado facilitator training — not even licensed yet."
> — Jason, 00:29:41

> "Anything that you may have seen on there was probably just placeholder text — a lot of it was put in there by the AI. Anything that you spot like 'Hey, we need to verify this.' You'll notice I tried to put tooltips on everything that gives a citation. Anything like that where it's a statistic should have been taken out."
> — Trevor, 00:30:33

> "Principle: absolutely zero fabrication, embellishment, exaggeration or any falsities of any kind. We will never represent anything we haven't verified to be factually true. Credibility is everything."
> — Trevor, 00:29:41

## LEAD ARCHITECTURE

### The Problem
The landing page (and potentially other public-facing pages) contains AI-generated placeholder statistics that were never validated. These include figures like "15,000 practitioners" which Jason researched and found to be dramatically overstated. Before showing this to Dr. Allen or any investor, all unverified numbers must be removed or replaced with either:
1. **Verified data** with a citation, or
2. **Honest placeholder language** (e.g., "Join a growing network of licensed practitioners")

### Scope of Audit

The BUILDER must search the following locations for unverified quantitative claims:

#### Files to Audit
- `src/pages/LandingPage/` or equivalent landing page component(s)
- `src/components/` — any components used on the landing page (hero section, stats bar, alliance wall, testimonials, etc.)
- `src/constants.ts` — any hardcoded statistics
- Any `*.json` data files used to populate landing page content

#### What to Flag
Look for any **specific numbers, percentages, or statistics** including but not limited to:
- Practitioner counts (e.g., "15,000 practitioners")
- Patient counts
- Outcome percentages (e.g., "86% positive outcomes")
- Year figures for industry claims
- Study citation numbers
- Revenue or market size claims

#### What to Do with Each

| Type | Action |
|------|--------|
| Number with a verified citation/tooltip already present | ✅ Keep as-is |
| Number that is clearly dummy/AI-generated with no source | 🗑️ Remove or replace with non-quantitative language |
| Number that might be real but has no citation | ⚠️ Replace with non-quantitative language + add `// TODO: VERIFY` comment in code |
| Outcome % claims not sourced from real PPN data | 🗑️ Remove entirely |

### Approved Replacement Language Patterns
Instead of: *"15,000 licensed practitioners nationwide"*
Use: *"A growing network of licensed practitioners across regulated states"*

Instead of: *"86% positive outcomes"*
Use: *"Designed to support evidence-based outcome tracking"*

Instead of: *"Join 2,400 clinicians"*
Use: *"Be among the first clinicians to join the network"*

### What NOT to Touch
- Do NOT touch the actual database, schema, or any application pages beyond the public landing page.
- Do NOT remove design elements or copy that is factually neutral (descriptions of features, etc.).
- Do NOT touch statistics that appear inside the authenticated app (those are labelled as demo/dummy data).

---

## ACCEPTANCE CRITERIA
- [ ] Landing page contains zero unverified specific numeric claims
- [ ] All remaining statistics have a citation tooltip or inline source
- [ ] Non-quantitative replacement copy is grammatically clean and on-brand
- [ ] `// TODO: VERIFY` comments left wherever a number MIGHT be real but needs sourcing
- [ ] No design elements broken by copy changes

## HANDOFF
When done: update `status: 04_QA`, `owner: INSPECTOR`, move to `_WORK_ORDERS/04_QA/`.
