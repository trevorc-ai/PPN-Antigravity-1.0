---
id: WO-121
title: "SEO & AIO Blog Content Strategy"
status: 01_TRIAGE
owner: PRODDY
failure_count: 0
created: 2026-02-20
priority: high
tags: [SEO, AIO, blog, content-marketing, organic-growth, NotebookLM, Descript]
---

# WO-121: SEO & AIO Blog Content Strategy

## USER REQUEST (VERBATIM)
> "The more I think about it, the more I think we're going to need a blog page for SEO purposes. Did you ever get my SEO & AIO strategy request?"
> "It was from the previous batch. I had to delete like 200 work orders when we had a breakdown in the workflow."
> "Also, if you're looking for some really great content, check the Descript folder."

---

## CONTEXT

This ticket was originally created before the workflow reset and lost. It is being rebuilt fresh.

The user has an existing content asset that dramatically changes the scope of this work:

**8 NotebookLM Deep Dive transcripts** are stored at:
```
/public/admin_uploads/Descript/
```

These are AI-generated podcast episode scripts produced by Google NotebookLM analyzing PPN's internal strategy documents. Each is a fully-voiced, research-accurate, ~20–45 page dialogue script. They are **the primary content source** for the blog strategy — do NOT start from scratch.

---

## LEAD ARCHITECTURE

**Strategic decision:** This is not a "write blog posts" task. It is a **content repurposing and blog infrastructure** task.

The Descript transcripts are the asset. The blog is the distribution channel.

Route as follows:
- **PRODDY** → Content strategy, SEO keyword mapping, publishing sequence, blog IA
- **MARKETER** → Editorial reformatting of transcripts into articles, SEO optimization, meta copy
- **BUILDER** → Blog page build (route, layout, CMS or static MDX)
- **DESIGNER** → Blog page design and article layout template

---

## PRODDY STRATEGY BRIEF

### The Asset: 8 Descript Transcripts

| File | Working Title | Target Audience | Primary Keyword Theme |
|------|--------------|----------------|----------------------|
| `Building_the_Operating_System_for_Psychedelic_Practice.md` | "We Built the Operating System for Psychedelic Practice" | Investors, operators | psychedelic practice management software |
| `The_Trojan_Horse_of_Psychedelic_Data.md` | "The Trojan Horse: How a Clinical Tool Becomes the World's Most Important Psychedelic Dataset" | Investors, policy audience | psychedelic data registry, real-world evidence psychedelics |
| `Why_Psychedelics_Must_Become_Boring_To_Survive.md` | "Why Psychedelics Must Become Boring to Survive" | Clinical converts, operators | psychedelic clinic compliance, ketamine clinic documentation |
| `Scaling_Psychedelic_Medicine_With_Anonymous_Data.md` | "Scaling Psychedelic Medicine Without Patient Names" | Licensed clinicians, privacy-conscious practitioners | HIPAA psychedelic therapy, de-identified psychedelic data |
| `Scaling_Psychedelic_Therapy_Without_Patient_Names.md` | "How We Built a Clinical Platform That Knows Nothing About Your Patients" | Independent practitioners | psychedelic therapy documentation, zero PHI |
| `The_Boring_Logistics_of_Psychedelic_Breakthroughs.md` | "The Boring Logistics of Psychedelic Breakthroughs" | Clinic operators, business owners | ketamine clinic operations, psychedelic clinic workflow |
| `Why_Psychedelic_Software_Refuses_Patient_Records.md` | "Why Our Software Refuses to Store Patient Records" | All practitioners | psychedelic EHR alternative, practitioner privacy |
| `The_Trojan_Horse_of_Psychedelic_Data-1.md` | *(Second edit — compare against v1, use best version)* | — | — |

---

### SEO Strategy: Two-Layer Approach

**Layer 1 — Practitioner Search (Bottom of Funnel, High Intent)**  
These are searches from people actively looking for a tool. They convert.

| Target Keyword | Monthly Volume (Est.) | Competition | Priority |
|---------------|----------------------|-------------|----------|
| ketamine clinic documentation software | Low | Low | P0 |
| psychedelic therapy EMR | Low | Low | P0 |
| HIPAA compliant psychedelic documentation | Low | Low | P0 |
| drug interaction checker psychedelics | Low-Med | Low | P0 |
| psilocybin therapy outcomes tracking | Low | Low | P0 |
| psychedelic adverse event documentation | Very Low | Very Low | P0 |
| Oregon psilocybin service center software | Very Low | Very Low | P0 |
| ketamine clinic outcomes measurement | Low | Low | P1 |

> Note: Search volumes are low because this is an emerging market. Low competition = high ranking potential. Being #1 in a niche category is the goal.

**Layer 2 — Thought Leadership (Top of Funnel, High Share)**  
These are searches from people exploring the space — future practitioners, investors, journalists. They build brand authority and backlinks.

| Target Keyword | Monthly Volume (Est.) | Competition | Priority |
|---------------|----------------------|-------------|----------|
| psychedelic therapy business | Med | Med | P1 |
| ketamine clinic compliance | Low-Med | Low | P1 |
| psychedelic data research | Med | Med | P1 |
| real world evidence psychedelics | Low | Low | P1 |
| psychedelic integration therapy documentation | Very Low | Very Low | P1 |
| RFRA psychedelic clinic legal | Very Low | Very Low | P2 |

---

### AIO Strategy (AI-Optimized Content — for ChatGPT, Perplexity, Claude Citations)

In 2026, a significant portion of practitioner research happens via AI assistants. This content must be optimized to be **cited by AI**, not just ranked by Google.

**AIO rules for MARKETER to apply:**
1. **Answer the question in the first 2 sentences** — AI summarizers quote the lede
2. **Use structured headers** (H2, H3) — AI models parse headers as topic signals
3. **Include specific, citable facts** — numbers, statistics, named protocols (PHQ-9, MEQ-30, GAD-7)
4. **Define terms clearly** — AI models surface definitional content heavily
5. **Avoid fluffy intros** — cut any paragraph that doesn't add information
6. **Include a TL;DR or Key Takeaways block** at the top of every article — this is what AI summarizes

**AIO target queries (things practitioners ask AI assistants):**
- "What's the best way to document a psychedelic therapy session?"
- "Is ketamine therapy HIPAA compliant?"
- "What EHR works for psychedelic therapy?"
- "How do I check drug interactions for psilocybin?"
- "What is real-world evidence in psychedelic research?"
- "How do I document ketamine sessions for insurance?"

---

### Publishing Sequence (Recommended)

Launch with the most defensible content first. Build credibility before publishing the more provocative pieces.

| Order | Article | Launch Timing | Why This Order |
|-------|---------|--------------|----------------|
| 1 | "Why Our Software Refuses to Store Patient Records" | Week 1 | Trust-builder. Answers the #1 fear. Safe for all audiences. |
| 2 | "Why Psychedelics Must Become Boring to Survive" | Week 2 | High shareability. The "boring is scalable" hook is quotable. |
| 3 | "The Boring Logistics of Psychedelic Breakthroughs" | Week 3 | Direct practitioner pain point. Drives conversions. |
| 4 | "Scaling Psychedelic Medicine Without Patient Names" | Week 4 | Establishes technical credibility. Targets clinicians. |
| 5 | "How We Built a Clinical Platform That Knows Nothing About Your Patients" | Week 5 | Independent practitioner targeting. Phantom Shield story. |
| 6 | "We Built the Operating System for Psychedelic Practice" | Week 6 | Broader market positioning. Investor/partner audience. |
| 7 | "The Trojan Horse: How a Clinical Tool Becomes the World's Most Important Psychedelic Dataset" | Week 8 | Save the biggest, most provocative piece for when there's an audience |

---

### Blog Infrastructure Requirements

**Page:** `/blog` route in the React app  
**Format:** Static MDX or JSON-driven (BUILDER to decide based on stack)  
**Features needed:**
- Article listing page with title, date, reading time, and excerpt
- Individual article page with:
  - Title, author, publish date
  - Tags (filterable)
  - Reading time estimate
  - Table of contents (auto-generated from headers)
  - "Key Takeaways" block at top
  - Related articles at bottom
  - CTA block: "Try PPN Research Portal" with link to signup/demo
- RSS feed (for SEO and podcast aggregators)
- Open Graph meta tags per article (for LinkedIn sharing)
- Canonical URL structure: `/blog/[slug]`

**Content format for MARKETER:**  
Each article should follow this template:
```
# [Title]
**Reading time:** X min | **Published:** [Date] | **Author:** PPN Admin, PPN Research Portal

## Key Takeaways
- [3-5 bullet points — written for AI summarization]

## [H2 Section]
...

## [H2 Section]
...

## The Bottom Line
[1-2 paragraph summary]

---
*[Author bio + CTA to try PPN]*
```

---

### Source Material Instructions for MARKETER

The 8 Descript files are **podcast transcripts** written as two-speaker dialogue. To convert each to an article:

1. **Read the whole transcript** first — understand the argument arc
2. **Identify the 3–5 strongest arguments/insights** — these become H2 sections
3. **Pull the most quotable lines** — package them as pull quotes or callout boxes
4. **Write the article in first person** (Admin's voice) or third person editorial — do NOT preserve the two-speaker dialogue format
5. **Add a Key Takeaways block** at the top (5 bullets max)
6. **Add SEO meta description** (155 characters max, include primary keyword)
7. **Add Open Graph title** (60 characters max for LinkedIn previews)
8. **Do NOT fabricate statistics** — only use numbers that appear in the source transcript or the VoC/strategy research
9. **Target 1,200–2,000 words** per article (sweet spot for SEO + AIO)

---

### Dual-Channel Distribution Strategy

Each blog article should also be distributed as:

**Podcast audio** (if Admin records):
- Scripts already exist (the Descript transcripts)
- Can be recorded as-is with a co-host, OR condensed into a solo narration
- Suggested podcast name: *"Clinical Intelligence" — The PPN Research Portal Podcast*
- Distribute on: Spotify, Apple Podcasts, Substack (for the written version)

**LinkedIn articles:**
- Publish a condensed version of each article natively on LinkedIn
- Tag relevant practitioners, researchers, and training programs

---

## HANDOFF ROUTING

After PRODDY strategy complete:
1. **MARKETER** → Edit transcripts into articles, write SEO meta, key takeaways → `04_QA`
2. **BUILDER** → Build `/blog` route and article template → `04_QA`
3. **DESIGNER** → Design blog listing and article page layout → `04_QA`
4. **INSPECTOR** → QA all three in sequence

---

## SUCCESS CRITERIA

- [ ] 7 blog articles drafted from Descript transcripts
- [ ] All articles have: Key Takeaways block, SEO meta description, Open Graph title, reading time, author bio + CTA
- [ ] `/blog` route live and accessible
- [ ] Article listing page shows: title, date, reading time, excerpt, tags
- [ ] Individual article pages have: table of contents, related articles, CTA block
- [ ] RSS feed live at `/blog/feed.xml`
- [ ] All articles pass INSPECTOR: 12px+ fonts, no color-only meaning, no PHI language

---

## NOTES

- Admin has keyword research available if MARKETER needs it — request via USER
- The Descript transcripts are the best raw material in the project for content marketing. Treat them as first drafts, not outlines.
- "Boring is scalable" and "Power flows to the platform" are genuine thought leadership hooks with viral potential in the practitioner community
- The "five companies in a trench coat" metaphor from the Trojan Horse piece is the most quotable line in any of the transcripts — use it prominently

---

*WO-121 created by PRODDY | February 2026*
