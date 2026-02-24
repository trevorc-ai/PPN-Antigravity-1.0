---
id: WO-243
title: "Trusted Resources Hub + Live Intelligence Feed Panel"
status: 01_TRIAGE
owner: LEAD
created: 2026-02-20
created_by: ANALYST
failure_count: 0
priority: MEDIUM
tags: [trusted-resources, rss, external-links, harm-reduction, practitioner-tools, knowledge-hub]
---

# WO-243: Trusted Resources Hub + Live Intelligence Feed

## Origin
USER prompt: "I like that proposal. Outline it in detail and circulate it for review. Also recommend RSS feeds."

ANALYST proposed this in conversation as a safe, legally clean alternative to ingesting content from Drugs.com, Rollsafe.org, and TripSafe.org. Research confirmed:
- **Drugs.com:** Hard legal prohibition on data extraction. Skip.
- **Rollsafe.org:** CC BY-SA 4.0. Link out — do not copy into DB.
- **TripSafe.org:** CC BY-SA 4.0. Link out — do not copy into DB.
- **RSS Feeds:** Multiple high-quality, legally clean feeds available.

---

## WHAT WE'RE BUILDING

Two interconnected features that live inside PPN Portal, visible to authenticated practitioners:

### Feature 1: Trusted Resources Hub
A curated, categorized directory of vetted external resources — the practitioner's "reading list" maintained by PPN. Organized into 5 categories with deep linking to specific high-value pages (not just homepages).

### Feature 2: Live Intelligence Feed
An in-app RSS aggregator panel that surfaces the latest psychedelic therapy research, FDA alerts, and policy news — **automatically refreshed**, no manual curation needed. Powered by 7 live RSS feeds that are legally clean and institutionally credible.

---

## PART 1: TRUSTED RESOURCES HUB — FULL SPEC

### Location
New tab/section within the existing `HelpFAQ.tsx` page **OR** standalone route at `#/resources` (DESIGNER decides based on nav capacity). ANALYST recommends dedicated route since the content is substantive enough to merit its own page.

### Layout
- Filterable card grid with 5 category tabs at the top
- Each card: icon, source name, description (2 lines max), specific page linked (not homepage), "Open →" button
- Tag system: `[Clinical]` `[Harm Reduction]` `[Policy]` `[Research]` `[Patient Education]`
- No authentication required to see the list, but only logged-in practitioners can see it in the portal context

### 5 Categories + Full Resource List

---

#### CATEGORY 1: Clinical Research & Evidence
*Peer-reviewed sources practitioners can cite in their own documentation*

| Source | Link | Why It's Here | Tag |
|--------|------|--------------|-----|
| **MAPS Clinical Research** | maps.org/research | Phase 2 + Phase 3 MDMA trial protocols, informed consent templates, Adverse Event reporting framework | `[Clinical]` |
| **COMPASS Pathways Pipeline** | compasspathways.com/our-research | COMP360 trial updates, TRD protocol documentation | `[Clinical]` |
| **ClinicalTrials.gov — Psychedelics Search** | clinicaltrials.gov/search?intr=psilocybin | Live search filtered to active psychedelic trials globally | `[Clinical]` [Research]` |
| **Metapsy Living Meta-Analysis** | metapsy.org | Pooled effect sizes across all depression interventions, updated as new studies publish | `[Research]` |
| **PubMed — Psychedelic Therapy** | pubmed.ncbi.nlm.nih.gov/?term=psychedelic+therapy+clinical | Direct PubMed search for peer-reviewed psychedelic therapy papers | `[Research]` |
| **Johns Hopkins Center for Psychedelic & Consciousness Research** | hopkinspsychedelic.org/research | Psilocybin MDD, cancer distress, addictions — full publications list | `[Clinical]` `[Research]` |
| **NYU Langone Psychedelic Medicine Program** | med.nyu.edu/research/centers-labs-programs/psychedelic-medicine-program | AUD + MDD psilocybin research | `[Clinical]` `[Research]` |

---

#### CATEGORY 2: Dosing, Safety & Harm Reduction
*Practitioner-grade reference resources for session safety protocols*

| Source | Link | Why It's Here | Tag |
|--------|------|--------------|-----|
| **RollSafe — MDMA Safer Use Guide** | rollsafe.org/how-to-take-mdma | Evidence-based MDMA preparation checklist, contraindications, supplement protocols. CC BY-SA — link only. | `[Harm Reduction]` |
| **RollSafe — MDMA Supplements** | rollsafe.org/mdma-supplements | Alpha Lipoic Acid, EGCG, Magnesium timing protocols — peer-reviewed sourced | `[Harm Reduction]` `[Clinical]` |
| **TripSafe — Psychedelic Trip Sitter Guide** | tripsafe.org/psychedelic-trip-sitter-guide | Structured guide for facilitators managing psilocybin/LSD sessions — maps to PPN's session monitoring role | `[Harm Reduction]` `[Clinical]` |
| **TripSafe — Managing Difficult Experiences** | tripsafe.org/how-to-help-someone-having-a-bad-trip-on-lsd-shrooms | Protocol for practitioners managing challenging sessions | `[Harm Reduction]` |
| **TripSit Drug Combinations Chart** | tripsit.me/tripsit-releases-the-new-and-improved-drug-combinations-chart | Visual chart of drug-drug interaction risk (CC BY-SA — already in our `ref_knowledge_graph`) | `[Harm Reduction]` `[Clinical]` |
| **DanceSafe Testing Kits & Protocols** | dancesafe.org/drug-checking | Adulterant testing resources for harm reduction context | `[Harm Reduction]` |
| **Zendo Project — Psychological Support** | zendoproject.org/training | MAPS-affiliated crisis support training for psychedelic experiences | `[Harm Reduction]` `[Clinical]` |

---

#### CATEGORY 3: Regulatory, Legal & Policy
*Keeping practitioners informed on the regulatory landscape in real time*

| Source | Link | Why It's Here | Tag |
|--------|------|--------------|-----|
| **MAPS Policy & Advocacy Hub** | maps.org/advocacy | Scheduling status tracker, state-by-state reform progress | `[Policy]` |
| **Oregon Psilocybin Services (OHA)** | oregon.gov/oha/PH/PREVENTIONWELLNESS/Pages/Psilocybin-Services.aspx | OPS licensing requirements, approved service center list | `[Policy]` `[Clinical]` |
| **Colorado Natural Medicine Health Act** | cdphe.colorado.gov/natural-medicine | Colorado Proposition 122 implementation tracker | `[Policy]` |
| **FDA Breakthrough Therapy Designations — Psychedelics** | fda.gov/patients/fast-track-breakthrough-therapy-accelerated-approval-priority-review/breakthrough-therapy | Current BTD holders for psychedelics (COMP360, Lykos, etc.) | `[Policy]` `[Clinical]` |
| **DEA Controlled Substances Scheduling** | dea.gov/drug-scheduling | Current schedule status across all psychedelic compounds | `[Policy]` |
| **Psychedelic Alpha Regulatory Tracker** | psychedelicalpha.com | Independent regulatory news tracker — fastest coverage of FDA/DEA decisions | `[Policy]` `[Research]` |

---

#### CATEGORY 4: Professional Training & Certification
*Resources practitioners can use to deepen their clinical competency*

| Source | Link | Why It's Here | Tag |
|--------|------|--------------|-----|
| **MAPS Therapist Training Program** | maps.org/mapp/training | Gold standard MDMA-assisted therapy training — Phase 3 protocol | `[Clinical]` |
| **California Institute of Integral Studies (CIIS) — Psychedelic Program** | ciis.edu/research-centers/center-for-psychedelic-therapies-and-research | Academic certificate in psychedelic therapies | `[Clinical]` |
| **Fluence Training** | fluencetraining.com | CE-accredited psychedelic-assisted therapy training | `[Clinical]` |
| **Numinus Practitioner Training** | numinus.com/training | Canadian-based practitioner certification — expanding to US | `[Clinical]` |
| **Chacruna Institute — Cultural & Ethical Training** | chacruna.net/programs | Indigenous plant medicine ethics, decolonization framework | `[Clinical]` `[Policy]` |

---

#### CATEGORY 5: Patient Education (Shareable With Clients)
*Resources practitioners can recommend directly to their patients before/after sessions*

| Source | Link | Why It's Here | Tag |
|--------|------|--------------|-----|
| **RollSafe — Start Here (Patient Version)** | rollsafe.org/start-here | Entry-level MDMA education for patients new to the therapy | `[Patient Education]` |
| **TripSafe — Shrooms Overview** | tripsafe.org/shrooms | Patient-readable psilocybin overview, what to expect | `[Patient Education]` |
| **Beckley Foundation — Patient Resources** | beckleyfoundation.org/psychedelic-research | Lay-accessible summaries of psychedelic research for patients curious about the science | `[Patient Education]` |
| **MAPS Patient Stories** | maps.org/patients/patient-stories | Vetted first-person accounts of MDMA-assisted therapy — for patient pre-session education | `[Patient Education]` |
| **Integration Circle — Community Support** | integrationcircle.com | Post-session integration community and peer support | `[Patient Education]` |

---

## PART 2: LIVE INTELLIGENCE FEED — RSS SPEC

### What This Is
A panel on the Resources page (or a widget on the Dashboard) that auto-fetches and displays the 5 most recent items from each of 7 RSS feeds. No curation required after setup. Backend fetches on a 6-hour cache interval to avoid hammering APIs.

### The 7 RSS Feeds — All Legally Clean

#### FEED 1: MAPS News
```
URL: https://maps.org/feed
Category: Advocacy & Research
Update frequency: ~2-4x/month
What it delivers: MAPS press releases, new partnerships, FDA/DEA responses, training program updates
Legal status: ✅ Public RSS — no restrictions on aggregation
Why practitioners want it: Direct signal from the leading MDMA therapy advocacy org
```

#### FEED 2: FDA MedWatch Safety Alerts
```
URL: https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/medwatch/rss.xml
Category: Safety & Regulatory
Update frequency: Weekly (variable)
What it delivers: FDA alerts for drugs/devices with newly identified adverse effects
Legal status: ✅ US Government — public domain
Why practitioners want it: Critical safety signal — if FDA issues a ketamine or esketamine alert, practitioners need to know immediately
```

#### FEED 3: FDA New Drug Approvals
```
URL: https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/new-drug-approvals/rss.xml
Category: Regulatory
Update frequency: Monthly (variable)
What it delivers: Every new FDA drug approval — practitioners will flag any psychedelic-adjacent approvals
Legal status: ✅ US Government — public domain
Why practitioners want it: esketamine (Spravato) updates, potential MDMA re-approval tracking
```

#### FEED 4: PubMed — Psilocybin Clinical Research
```
URL: https://pubmed.ncbi.nlm.nih.gov/rss/search/1PKHaovp0PnMWKLrL7D5y6MX_4vbYHHXCOPP1wWJotIvqJ8hH5/?limit=15&utm_campaign=pubmed-2&fc=20230101000000
Category: Research
Update frequency: Daily (whenever new papers publish)
What it delivers: New PubMed-indexed papers matching "psilocybin[MeSH] AND (clinical trial[pt] OR therapy[sh])"
Legal status: ✅ NLM/NIH — public domain RSS
Why practitioners want it: First to know about new psilocybin outcome data
Note for BUILDER: Use a custom PubMed search URL → RSS generation — the URL above is a template. BUILDER should generate via PubMed search API for query: psilocybin[tiab] AND (therapy OR treatment OR clinical trial)
```

#### FEED 5: PubMed — MDMA-Assisted Therapy
```
URL: [BUILDER to generate via PubMed RSS for: "MDMA"[tiab] AND (therapy OR treatment OR PTSD)]
Category: Research
Update frequency: Daily
What it delivers: New MDMA therapy papers
Legal status: ✅ NLM/NIH — public domain
```

#### FEED 6: ClinicalTrials.gov — New Psychedelic Trials
```
URL: https://clinicaltrials.gov/api/v2/studies?query.intr=psilocybin+OR+MDMA+OR+ibogaine&filter.overallStatus=RECRUITING&format=rss
Note: ClinicalTrials.gov v2 API supports RSS output via format=rss parameter
Category: Clinical
Update frequency: Weekly
What it delivers: Newly posted or recently recruiting psychedelic trials worldwide
Legal status: ✅ US Government — public domain
Why practitioners want it: Referral source — practitioners can refer eligible patients to active trials
```

#### FEED 7: Psychedelic Alpha News
```
URL: https://psychedelicalpha.com/feed (verify availability)
Category: Industry & Regulatory News
Update frequency: 3-5x/week
What it delivers: Fastest independent coverage of FDA decisions, DEA scheduling actions, state legislation, company announcements
Legal status: ✅ Standard RSS — news aggregation is legally supported
Why practitioners want it: Faster than MAPS, more curated than Google News
```

### RSS Feed Display Logic
Each feed item shown as a card containing:
- **Publication name** (colored icon by category)
- **Headline** (linked)
- **Published date** (relative: "2 days ago")
- **Category tag**
- **Brief excerpt** (first 120 chars of description)

**Filter controls:** Category filter (All / Research / Regulatory / Advocacy / Clinical) + modality filter (Psilocybin / MDMA / Ketamine / All) via keyword matching on headlines.

**Refresh cadence:** Backend serverless function (Supabase Edge Function) fetches all 7 feeds every 6 hours, caches parsed items in a `cache_rss_items` table. Frontend queries the cache — zero external API calls from the client.

---

## PART 3: DATABASE SCHEMA REQUIRED

SOOP will need to create one new table for RSS cache:

```sql
-- RSS feed item cache (prevents hammering external feeds)
CREATE TABLE IF NOT EXISTS public.cache_rss_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_name      TEXT NOT NULL,           -- 'MAPS News', 'FDA MedWatch', etc.
  feed_url       TEXT NOT NULL,
  category       TEXT NOT NULL,           -- 'Research', 'Regulatory', 'Advocacy', 'Clinical', 'Safety'
  headline       TEXT NOT NULL,
  link           TEXT NOT NULL,
  published_at   TIMESTAMPTZ,
  excerpt        TEXT,
  fetched_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(feed_name, link)                 -- deduplicate by source + URL
);

-- RLS: authenticated read, service_role write
ALTER TABLE public.cache_rss_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rss_items_authenticated_select"
  ON public.cache_rss_items FOR SELECT TO authenticated USING (true);

-- Index for feed filter UI
CREATE INDEX IF NOT EXISTS idx_rss_items_feed_name   ON public.cache_rss_items(feed_name);
CREATE INDEX IF NOT EXISTS idx_rss_items_category     ON public.cache_rss_items(category);
CREATE INDEX IF NOT EXISTS idx_rss_items_published_at ON public.cache_rss_items(published_at DESC);
```

---

## PART 4: COMPONENT ARCHITECTURE

### New Files Required

```
src/pages/Resources.tsx               — Main page: tabs for Resources | Intelligence Feed
src/components/resources/
  ResourceCard.tsx                    — Individual resource card with category tag
  ResourceGrid.tsx                    — Filterable grid of resource cards
  IntelligenceFeed.tsx                — RSS feed aggregator UI
  FeedItem.tsx                        — Individual RSS item card
src/lib/resources.ts                  — TS query functions for cache_rss_items
backend/scripts/fetch_rss_feeds.py    — Python script to fetch + cache all 7 feeds
migrations/060_rss_cache_table.sql    — SOOP migration
```

### New Route
```tsx
// Add to router:
{ path: '/resources', component: Resources }
```

### Static Resources Data
The 30 curated links above live as a TypeScript constant (not in DB — they don't change often enough to warrant DB storage). ANALYST will provide the full typed array in the handoff to BUILDER.

---

## PART 5: DESIGNER BRIEF

### Visual Direction
- **Page header:** "Intelligence Hub" — with two tabs: `Resources` and `Live Feed`
- **Resources tab:** 5 category pill filters at top (All, Clinical, Harm Reduction, Policy, Training, Patient). Card grid: 3 cols desktop, 1 col mobile.
- **Card design:** Glassmorphic. Source name large + bold. Description 2 lines. Category badge bottom-left. "Open →" with external link caret. Subtle flag icon for country of origin (US/CA/UK).
- **Live Feed tab:** Vertical feed of cards. Each card has a colored left border by category (blue=Research, amber=Regulatory, violet=Advocacy, teal=Clinical, red=Safety). Relative timestamp top-right. Filter chips above the feed.
- **Font sizes:** All ≥ 14px per accessibility rules. Card titles ≥ 16px.

### Accessibility Rules (no exceptions)
- No color-only meaning. Every colored left border also has a text label.
- All external links must have `rel="noopener noreferrer"` and `target="_blank"` with an `aria-label` indicating they open in a new tab.
- Font ≥ 14px minimum across the entire page.

---

## PART 6: ACCEPTANCE CRITERIA (INSPECTOR CHECKLIST)

```
RESOURCES HUB:
[ ] 30 curated links across 5 categories render correctly
[ ] Category filter works (clicking pill filters to matching cards only)
[ ] All external links open in new tab with rel="noopener noreferrer"
[ ] All fonts >= 14px
[ ] Mobile layout renders as 1-col grid
[ ] No color-only meaning — every status has a text label

INTELLIGENCE FEED:
[ ] 7 feeds configured in fetch script
[ ] cache_rss_items table exists and has data (requires SOOP + BUILDER)
[ ] Feed items display with headline, source, date, excerpt, category tag
[ ] Category filter on feed works
[ ] "Last updated" timestamp shown to user
[ ] External links work + open in new tab
[ ] Empty state handled gracefully (if cache is empty or stale)

DATABASE:
[ ] Migration 060 exists at migrations/060_rss_cache_table.sql
[ ] RLS enabled on cache_rss_items
[ ] SELECT policy for authenticated exists
[ ] No INSERT/UPDATE/DELETE policies (service_role only)

LEGAL:
[ ] No Drugs.com content anywhere on the page
[ ] All Rollsafe/TripSafe references are outbound links ONLY — no copied text
[ ] Each external link opens the specific deep-linked page, not homepage
```

---

## ROUTING

### Child Tickets After LEAD Review
- **WO-243a** → SOOP: migration 060 (cache_rss_items table)
- **WO-243b** → DESIGNER: page layout + component visual spec
- **WO-243c** → BUILDER: React components + RSS fetch script + TS resource data
- **WO-243d** → MARKETER: review the 30 curated links for brand/position alignment

### Priority Recommendation (ANALYST)
**Medium priority** — this is high practitioner value but not a launch blocker. Schedule for the sprint after the Global Benchmark Intelligence section is confirmed working. Estimated BUILDER time: 4 hours (components are straightforward, no complex state).

---

*ANALYST WO-243 fully specified. Circulating to LEAD for architecture decision and child ticket creation.*
