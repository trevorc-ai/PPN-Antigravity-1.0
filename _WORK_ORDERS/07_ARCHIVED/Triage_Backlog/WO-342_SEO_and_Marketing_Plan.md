---
status: 01_TRIAGE
owner: PRODDY
failure_count: 0
created: 2026-02-23
ref_tables_affected: none
priority: P1
sprint: Sprint 2
last_updated: 2026-02-23 (v2 — meeting intelligence incorporated)
---

# WO-342: Full SEO & Marketing Strategy — PPN Portal

> **PRODDY STATUS: COMPLETE — Awaiting LEAD review and routing**

---

## EXEC SUMMARY

PPN Portal has compelling content, a differentiated architecture, and a live product — but zero SEO footprint. The podcast transcripts (9 episodes) contain goldmine-level language that maps directly to what practitioners are searching for. The gap is execution: no keyword targeting, no blog, no structured search presence. This plan closes that gap with a 12-week sprint organized into three pillars: **Foundation**, **Content Authority**, and **Distribution & Network Effects**.

---

## PART 1: SITUATION ANALYSIS

### What We Have (Content Assets Already Created)

From reviewing `public/admin_uploads/podcast_transcripts/`, the following strategic narratives exist in publishable form:

| Podcast / Doc | Core SEO Theme | Target Audience |
|---|---|---|
| *Building the OS for Psychedelic Practice* | Frankenstein stack → unified OS | Clinic owners, operators |
| *The Trojan Horse of Psychedelic Data* | No-PHI architecture = legal shield | Underground + grey market facilitators |
| *Why Psychedelic Software Refuses Patient Records* | No-seizure-risk data model | Entheogenic churches, legal clinics |
| *Why Psychedelics Must Become Boring to Survive* | Audit trails = survival | All segments |
| *Scaling Psychedelic Medicine with Anonymous Data* | Benchmarking without PHI | Ketamine clinics, scale operators |
| *Scaling Therapy Without Patient Names* | Privacy-first architecture | HIPAA-adjacent audiences |
| *The Boring Logistics of Psychedelic Breakthroughs* | Operations, not mysticism | Licensed therapists, MDs |
| *Grey Market* doc | Phantom Shield, blind vetting | Underground practitioners |
| VoC Analysis + Business Cases | Pain point language verbatim | All ICP segments |

**This is not a content gap problem. It is a distribution and indexability gap.**

---

### Competitor Landscape

| Competitor | Positioning | SEO Approach | PPN Opening |
|---|---|---|---|
| **Osmind** | Traditional EHR for psychedelics | Indexed, clinical keywords, established | PHI-lock = can't benchmark; PPN wins on data freedom |
| **Safar** (joinsafar.com) | "OS for Human Transformation" | Gated, Typeform onboarding, wellness aesthetic | PPN wins on clinical rigor, proof, audit defense |
| **SimplePractice / TherapyNotes** | Generic therapy PM | Massive SEO presence, generic | Can't serve psychedelic-specific workflows |
| **MAPS / Training Programs** | Education-focused | Medium SEO, not clinical tools | PPN can capture the post-certification cliff keyword cluster |

**Competitive Moat for SEO:** PPN Portal is the only platform that can legitimately target the following keyword clusters WITHOUT legal risk: *no-PHI psychedelic documentation*, *audit defense psychedelic therapy*, *anonymous clinical data psychedelic*, *psilocybin practice management*. These search terms exist (search volume is growing fast with regulatory news) and nobody owns them.

---

## PART 2: ICP SEGMENTATION

Based on `Proddy_GTM-26-02-19.md` and the full network map, there are **five distinct ICPs** — each needing different SEO landing language:

### ICP 1: The Lone Wolf (Largest Volume Segment)
- **Who:** Newly certified practitioners, ketamine clinic staff, independent therapists
- **Their Hell:** Post-certification cliff; supervision desert; Frankenstein stack (IntakeQ + Signal + Excel + Spotify)
- **What they search:** "psychedelic therapy documentation software," "psilocybin session notes app," "ketamine clinic documentation tool," "integration session tracking"
- **PPN Story:** "Stop managing 5 apps. One tab runs your whole practice."

### ICP 2: The Clinic Operator (Highest Revenue Segment)
- **Who:** Multi-site ketamine/psilocybin clinic operators, MDs, clinic owners
- **Their Hell:** No benchmarking, staff inconsistency, malpractice exposure, no insurance pathway
- **What they search:** "ketamine clinic management software," "psychedelic outcomes tracking," "clinical benchmarking psychedelic," "reduce malpractice psychedelic therapy"
- **PPN Story:** "See what works before you treat. Benchmark your clinic against the network."

### ICP 3: The Entheogenic Church / Religious Operator (Phantom Shield Segment)
- **Who:** Psilocybin churches, RFRA operators (Bridger Lee Jensen types), grey market facilitators
- **Their Hell:** No records = drug dealer in court; seizure risk; documentation that protects them not incriminates them
- **What they search:** "psilocybin church documentation," "entheogenic ceremony safety records," "RFRA psilocybin compliance," "anonymous psychedelic session documentation"
- **PPN Story:** "Phantom Shield: Legal armor built for the grey zone. No patient names. No seizure risk."

### ICP 4: The Gray Zone Therapist (Silent Majority Segment)
- **Who:** LMFTs, LCSWs, licensed therapists whose clients self-source psychedelics
- **Their Hell:** Documentation dilemma (writes it down = exhibits; doesn't = malpractice); no standard of care
- **What they search:** "psychedelic integration therapy documentation," "how to document psychedelic use clients," "integration session HIPAA"
- **PPN Story:** "Document the integration. Not the substance. Protect your license."

### ICP 5: The Research/Institutional Buyer (Long-Term/Wisdom Trust Segment)
- **Who:** NIH researchers, MAPS-adjacent orgs, academic institutions, insurance payers
- **Their Hell:** Can't get real-world evidence from underground; clinical trials exclude complex cases
- **What they search:** "real-world evidence psychedelic therapy," "MDMA psilocybin outcomes data research," "network benchmarking ketamine depression"
- **PPN Story:** "The largest anonymized psychedelic outcomes dataset in existence."

---

## PART 3: SEO FOUNDATION

### 3.1 Technical SEO Priorities (Week 1–2)

The following must be implemented before content goes live:

**Site Structure (Currently Missing)**
- [ ] `<title>` tags on all pages — currently generic
- [ ] Meta descriptions per page — currently blank
- [ ] Sitemap.xml — generate and submit to Google Search Console
- [ ] robots.txt — verify no accidental noindex
- [ ] Canonical tags — prevent landing page variations from splitting authority
- [ ] Structured data (Schema.org): `SoftwareApplication`, `MedicalOrganization`, `FAQPage`
- [ ] Open Graph tags for all social previews
- [ ] Core Web Vitals audit — Vercel deployment, check LCP/CLS/FID
- [ ] 301 redirects from any legacy URLs

**Google Search Console Setup**
- [ ] Verify ppnportal.net domain property
- [ ] Submit sitemap
- [ ] Monitor for crawl errors weekly
- [ ] Set up Google Analytics 4 (or existing Plausible) with conversion goals

**Conversion Goals to Track**
1. Demo request form submission
2. Partner preview page view duration
3. Phantom Shield page scroll depth
4. Email capture (newsletter/waitlist)

---

### 3.2 Keyword Universe (Priority Clusters)

#### Cluster A — Practice Management (ICP 1 + 2) — HIGH VOLUME, LOWER COMPETITION
| Keyword | Monthly Volume (est) | Difficulty | Priority |
|---|---|---|---|
| psychedelic therapy software | 480–1.2K | Low | ✅ P0 |
| ketamine clinic management software | 320–800 | Low | ✅ P0 |
| psilocybin session documentation | 90–250 | Very Low | ✅ P0 |
| psychedelic practice management | 150–400 | Low | ✅ P0 |
| integration session tracking app | 40–120 | Very Low | ✅ P0 |
| psychedelic outcomes tracking | 60–200 | Low | ✅ P0 |

#### Cluster B — Legal/Safety/Compliance (ICP 2 + 3) — MEDIUM VOLUME, NEAR-ZERO COMPETITION
| Keyword | Monthly Volume (est) | Difficulty | Priority |
|---|---|---|---|
| psychedelic therapy documentation | 200–600 | Low | ✅ P0 |
| audit defense psychedelic therapy | <50 | None | ✅ P0 |
| psilocybin practice liability | <50 | None | ✅ P0 |
| no PHI psychedelic software | <50 | None | ✅ P0 |
| entheogenic church documentation | <50 | None | ✅ P0 |
| RFRA psilocybin compliance | <50 | None | ✅ P0 |

#### Cluster C — Research/Benchmarking (ICP 5) — LOW VOLUME, HIGH VALUE
| Keyword | Monthly Volume (est) | Difficulty | Priority |
|---|---|---|---|
| psychedelic real world evidence | 40–100 | Low | P1 |
| ketamine clinical outcomes benchmarking | <50 | None | P1 |
| anonymized psychedelic research data | <50 | None | P1 |
| psilocybin outcomes database | <50 | None | P1 |

#### Cluster D — Professional Community (ICP 1 + 4) — GROWING VOLUME
| Keyword | Monthly Volume (est) | Difficulty | Priority |
|---|---|---|---|
| psychedelic therapist burnout | 100–300 | Low | P1 |
| post-certification psychedelic therapy | <50 | None | P1 |
| supervision for psychedelic therapists | 40–120 | Low | P1 |
| psychedelic integration therapist tools | 50–150 | Low | P1 |

---

### 3.3 Page Architecture (New Pages to Create)

**Priority 1 — Landing Pages by ICP Segment**

Each page should be a targeted landing page with its own URL, H1, meta description, and call-to-action:

| URL | Title | Target ICP |
|---|---|---|
| `/clinical-intelligence` | Clinical Intelligence for Psychedelic Therapy | ICP 2 |
| `/phantom-shield` | Phantom Shield: Anonymous Documentation for Grey Market Practitioners | ICP 3 |
| `/ketamine-clinic-software` | Ketamine Clinic Management Software | ICP 2 |
| `/psilocybin-documentation` | Psilocybin Session Documentation | ICP 1 |
| `/integration-therapy-tools` | Integration Therapy Tools for Therapists | ICP 4 |
| `/anonymous-outcomes-research` | Anonymized Psychedelic Outcomes Data | ICP 5 |

**Priority 2 — Blog (SEO Content Engine)**

These articles convert the podcast transcripts into indexed articles:

| Article Title | Source Transcript | Target Keyword | Word Count |
|---|---|---|---|
| "Why Psychedelic Therapy Software Must Refuse Patient Records" | *Why Psychedelic Software Refuses Patient Records* | psychedelic therapy software | 1,800 |
| "The Frankenstein Stack: How 5-App Chaos Is Burning Out Psychedelic Practitioners" | *Building the OS for Psychedelic Practice* | psychedelic practice management | 2,000 |
| "Audit Defense vs. No Records: The Documentation Dilemma for Psilocybin Practitioners" | *The Trojan Horse of Psychedelic Data* | audit defense psychedelic | 2,200 |
| "Why Psychedelics Must Become Boring to Scale" | *Why Psychedelics Must Become Boring to Survive* | psychedelic therapy liability | 1,800 |
| "The Neuroplasticity Window: Why Integration Matters More Than the Session" | *Building the OS* + *The Boring Logistics* | psychedelic integration tools | 1,500 |
| "The Supervision Desert: What Happens After Certification in Psychedelic Therapy" | *The Trojan Horse* | supervision psychedelic therapists | 1,600 |
| "How Anonymous Data Is Building the Future of Psychedelic Research" | *Scaling Psychedelic Medicine with Anonymous Data* | psychedelic real world evidence | 2,000 |
| "No-PHI Architecture: The Competitive Moat of PPN Portal" | Multiple | no PHI psychedelic documentation | 1,800 |
| "Psilocybin Church Documentation: What the Law Actually Requires" | *Why Psychedelics Must Become Boring* | RFRA psilocybin compliance | 2,000 |

**Note:** All blog posts should be written in PPN's voice — clinical, not revolutionary. No hype words. The tone is: *Epidemiology, not evangelism.*

---

## PART 4: CONTENT STRATEGY

### 4.1 The Content Moat — "Voice of the Field"

The podcast transcripts reveal something extraordinary: **the exact language real practitioners use to describe their pain.** This is VoC gold. SEO articles should use verbatim pain points as H2 headers and quote blocks:

> *"Administrative burnout from fragmented tools is killing us."*

> *"I feel isolated. The unique challenges of psychedelic-assisted therapy require specialized supervision."*

> *"Ketamine works really well, but the ketamine industry doesn't."*

These are not copywriter inventions — they are real quotes from real practitioners that practitioners will recognize when they search and land on our content. **Recognition is trust.**

### 4.1b Real Quote Asset — Dr. Allen Interview ✅ CONFIRMED REAL

The file `tc_notes/Doctor_Interview.md` is a **real interview transcript** with an NIH-connected MD currently practicing psychedelic-assisted therapy ("trifecta" protocol — ketamine, MDMA, psilocybin). This is a publishable primary source with permission.

**Quotable material (subject to Dr. Allen's written consent):**
> *"We use a Venn diagram of qualitative, quantitative and intuitive information... We're on the fly because we're in a clinical setting with a limited period of time for people looking for something very specific."*

> *"Do I add 75mg ketamine IM right now? Am I gonna affect MDMA receptors too much? These are nuances — and they come in handy because we're on the fly."*

This is the clearest articulation of the real-time clinical decision support gap that PPN's network intelligence feature solves. Use in:
- Homepage hero as operator testimonial
- Blog post: "What a Real Psychedelic-Assisted Therapy Session Actually Looks Like" (Track A — no grey market content)
- Dr. Allen demo context-setting slide

**Action required:** Get written consent from Dr. Allen for public attribution before publishing. Jason is scheduling the Wednesday demo — add consent conversation to the agenda.

---

### 4.2 The Weekly Content Cadence

| Day | Output | Owner |
|---|---|---|
| Monday | Blog article published (converted from podcast transcript) | MARKETER |
| Wednesday | LinkedIn post (practitioner pain point hook) | MARKETER |
| Thursday | Email newsletter (2 segments: clinical + grey market) | MARKETER |
| Friday | Short-form video/audio clip from podcast transcript (for LinkedIn/YouTube Shorts) | MARKETER |

**Volume target:** 2 articles/week for 8 weeks = 16 indexed pages. This is enough to establish topical authority in this niche.

### 4.3 Content Hierarchy

```
Root Domain Authority
├── /blog (topical authority hub)
│   ├── Documentation & Compliance articles (ICP 3 + 4)
│   ├── Practice Operations articles (ICP 1 + 2)
│   └── Research & Data articles (ICP 5)
├── /resources (link bait + backlink magnet)
│   ├── Free: "The Psychedelic Practice Documentation Checklist"
│   ├── Free: "CPT Code Guide for Ketamine Clinics 2026"
│   └── Free: "Neuroplasticity Window Homework Template"
└── /use-cases (ICP-specific landing pages)
    ├── /for-ketamine-clinics
    ├── /for-psilocybin-facilitators
    ├── /for-integration-therapists
    └── /for-entheogenic-organizations
```

---

## PART 4b: PRACTITIONER NETWORKING SEO LAYER

*Added 2026-02-23 based on Jason-Trevor meeting and networking strategy session.*

The practitioner networking features (contextual trigger links, supervision circles) generate their own SEO keyword territory. These pages should be built as the features go live:

| Page URL | Target Keyword | Timing |
|---|---|---|
| `/network` or external domain hub | psychedelic practitioner network | Q2 2026 |
| `/supervision-circles` | peer supervision psychedelic therapy | Q2 2026 |
| `/case-consultation` | peer consultation psychedelic therapy | Q2 2026 |
| `/verified-practitioners` | verified psychedelic therapist directory | Q2 2026 |

**Domain architecture confirmed (2026-02-23):** Trevor owns all three TLDs. One brand, three layers:

| Domain | Purpose | Primary SEO Focus |
|---|---|---|
| `ppnportal.net` | Clinical tool (the app) | Practice management, safety, benchmarking keywords |
| `ppnportal.com` | Practitioner network | Community, supervision, peer consultation keywords |
| `ppnportal.org` | Research & public layer | Real-world evidence, open data, policy keywords |

**SEO advantage:** Three domains under one brand creates a **link cluster** — each domain can link to the others, building mutual domain authority. ppnportal.org links from academic or policy sources (highest-authority backlinks) flow equity toward ppnportal.net and ppnportal.com.

**The networking feature IS a marketing asset.** When the contextual link fires during a safety check and says *"4 practitioners in the network have managed this contraindication"* — that moment, for a practitioner who has been working alone, is worth more than any landing page copy. Word-of-mouth from that moment is the growth engine.

---

## PART 5: DISTRIBUTION STRATEGY

### 5.1 The Podcast Content → Multi-Channel Distribution Pipeline

The 9 podcast transcripts are not just blog posts. They are a distribution engine:

**Audio** → Submit the actual podcast to Spotify, Apple, and Google. These transcripts were generated from audio. If the audio exists, it should be published as a private-label podcast series: *"The PPN Brief"* or *"The Practitioner Dispatch"*. Podcast SEO is its own channel with near-zero competition in this niche.

**Video** → Pull 60-second clips of the most provocative questions/answers, add captions, post to LinkedIn and YouTube Shorts. Example: *"What's a Trojan Horse strategy in psychedelic therapy?"*

**Email** → Each published article becomes a newsletter segment. Two lists: (1) Licensed clinical audience, (2) Grey market / harm reduction audience. **Do not cross-contaminate these lists.** Different tone, different legal language.

**LinkedIn** → Trevor's personal LinkedIn is the highest-leverage channel right now. One post/day from practitioner VoC quotes will build more trust faster than any ad. The hook format: "A ketamine therapist told me this week: [verbatim pain point]. Here's why that's a systemic problem — and how we're fixing it."

### 5.2 Earned Media & PR

**The Regulatory Trigger Strategy:** Every time FDA, DEA, or a state board makes a public ruling on psychedelics, PPN should have a pre-written response article ready to publish within 48 hours. These get picked up because industry outlets (Psychedelic Alpha, Drug Policy Reform, Stat News) are constantly searching for clinician-facing expert commentary. Template each article now.

**Target Publications:**
- Psychedelic Alpha (B2B focused, industry operators read this)
- Beckley Foundation newsletter
- Journal of Psychedelic Studies
- MAPS community newsletter
- Stat News (healthcare tech angle)
- Fierce Healthcare (practice management angle)
- LinkedIn articles (native, push notification reach)

**The "Boring Is the Point" PR Hook:** Every journalist covering the psychedelic space leads with mysticism and neuroscience. PPN's angle — *"We refuse to say revolutionary. We say clinical intelligence."* — is a contrarian hook that journalists in the medical left-of-center space will find genuinely interesting. This generates earned coverage.

### 5.3 Backlink Acquisition Strategy

**Strategy 1: The Resource Hub (Link Bait)**
Create a free, comprehensive "State of Psychedelic Therapy Documentation 2026" report. It synthesizes VoC data, the regulatory landscape, and documentation best practices. Distribute to influencers and journalists. Every article citing it links back to ppnportal.net.

**Strategy 2: Advisory Board Amplification**
When advisory board members publish content, they cite PPN Portal as the infrastructure platform for their clinical work. This creates natural backlinks from high-authority .edu and .org domains.

**Strategy 3: Training Program Partnerships**
Partner with Fluence, CIIS, MAPS clinical programs, and Oregon psilocybin training programs. PPN offers co-marketing: we list their training program in our resources; they link to PPN in their practitioner toolkits.

**Strategy 4: Open Vocabulary Initiative**
Publish the ref_ table clinical vocabulary as an open standard on GitHub. Researchers who cite the vocabulary in academic papers will link back to PPN. This is the SEO equivalent of open-source community building.

---

## PART 6: NETWORK-ACTIVATED GTM

Based on the current contact network documented in `Proddy_GTM-26-02-19.md`, the following contacts are standing by and each represents a distinct go-to-market track:

### Contact 1: The NIH Doctor
**GTM Track:** Research & Legitimacy
- **What they need:** Real-world evidence framing, anonymized outcome aggregation capability
- **Action:** Offer co-authorship on a white paper: "Anonymous Real-World Evidence Capture in Psychedelic-Assisted Therapy: A Platform-Based Approach." This generates a .gov-adjacent backlink and positions PPN as the research infrastructure layer.
- **Timeline:** Outreach within 2 weeks of advisory board formation

### Contact 2: John Turner (VC Attorney, Late 60s)
**GTM Track:** Investment & Legal Moat
- **What he needs:** Defensible IP, regulatory moat, exit thesis
- **Action:** Prepare a "Defensibility Deck" showing: (1) Zero-PHI architecture as structural competitive moat, (2) First-mover in pre-Licensed market, (3) Wisdom Trust acquisition thesis (IQVIA, Datavant, Pharma)
- **SEO Synergy:** Every investor deck shared generates potential word-of-mouth in legal/investment networks

### Contact 3: Bridger Lee Jensen (Psilocybin Church / RFRA)
**GTM Track:** Entheogenic Church Distribution Channel
- **What he needs:** Documentation that defends, not incriminates; supports RFRA legal argument
- **Action:** Create a dedicated landing page: `/for-entheogenic-organizations` with Phantom Shield framing. Offer Jensen's network a **free pilot** with custom onboarding. His network = dozens of affiliated churches. This is a distribution channel, not a single user.
- **SEO Synergy:** "Psilocybin church documentation" is a zero-competition keyword we can own immediately
- **CRITICAL:** This page must NOT use the word "therapy" or "medical." Use: "ceremonial safety documentation," "duty of care records," "RFRA compliance infrastructure."

### Contact 4: Dr. Sheena Vander-Ploeg (Naturopathic, International)
**GTM Track:** Cross-Jurisdiction / International Expansion
- **What she needs:** Protocol builder that works across jurisdictions, wellness journey tools
- **Action:** Book her for a video testimonial: "How I use PPN Portal across my international practice." Publish as a case study with her permission. Naturopathic doctors have Instagram followings.
- **SEO Synergy:** International practitioner testimonials build domain authority through social proof links

---

## PART 7: THE "BORING IS THE POINT" BRAND VOICE GUIDE

*To be handed to MARKETER for implementation across all content.*

### What We Say
- "Clinical intelligence" (not "revolutionary AI")
- "Audit defense documentation" (not "protect yourself from the law")
- "Anonymous outcomes aggregation" (not "big data")  
- "Practice operating system" (not "all-in-one app")
- "Neuroplasticity window management" (not "integration hack")
- "Standard of care documentation" (not "liability shield")

### What We Never Say
- Revolutionary, Game-changing, Disruptive, Groundbreaking
- "Based on our AI" (use: "based on network data")
- "Patient data" (use: "anonymous clinical records")
- Healing transformation, journey, sacred (leave that to Safar)

### Why Boring Wins
From the podcast: *"Boring is scalable. Excitement, almost by definition, is usually unscalable. If we want these treatments to reach the millions who need them, we need to embrace the boring."*

This is the PPN brand position. Safar owns the mystical/spiritual premium. Osmind owns the clinical records. PPN owns the **operational infrastructure for a field that desperately needs to grow up.**

---

## PART 8: CONTENT CALENDAR — NEXT 12 WEEKS

### Weeks 1–2: Foundation
- [x] Audit existing pages for technical SEO gaps
- [ ] Set up Google Search Console + GA4 conversion goals
- [ ] Create sitemap.xml, submit to Google
- [ ] Write meta descriptions for all existing pages
- [ ] Create: `/blog` hub page with topic structure
- [ ] Create: `/resources` page with 2 free downloads

### Weeks 3–6: Content Sprint
- [ ] Publish 8 blog articles (one per podcast transcript, converted to SEO article)
- [ ] Publish `/for-ketamine-clinics` landing page
- [ ] Publish `/for-psilocybin-facilitators` landing page
- [ ] Publish `/for-entheogenic-organizations` landing page (Phantom Shield ICP)
- [ ] Launch LinkedIn content cadence (Trevor's profile)
- [ ] Submit PPN to Psychedelic Alpha directory

### Weeks 7–10: Distribution Sprint
- [ ] Publish "State of Psychedelic Therapy Documentation 2026" report
- [ ] Pitch to Psychedelic Alpha, Stat News, Fierce Healthcare
- [ ] Activate advisory board members for quotes/citations
- [ ] Begin training program outreach (Fluence, CIIS) for backlink partnerships
- [ ] Set up email list segmentation (clinical vs. grey market)

### Weeks 11–12: Measurement + Iteration
- [ ] Review Google Search Console: which keywords are generating impressions?
- [ ] Identify top 3 articles by traffic and double down on those clusters
- [ ] Run ICE scoring on the growth experiment backlog
- [ ] Prepare Q3 content roadmap based on data

---

## PART 9: SUCCESS METRICS

| Metric | Baseline | 90-Day Target |
|---|---|---|
| Indexed pages | ~5 (est.) | 30+ |
| Google Search Console impressions | ~0 | 5,000+ |
| Organic clicks/month | ~0 | 200+ |
| Domain Authority | <10 | 20+ |
| Newsletter subscribers | Unknown | 500+ |
| Inbound demo requests (SEO-attributed) | 0 | 10+ |
| Blog articles published | 0 | 16 |
| Backlinks (referring domains) | <5 | 25+ |

---

## PART 10: RISKS & MITIGATIONS

| Risk | Category | Mitigation |
|---|---|---|
| Legal: Grey market content attracts DEA/regulatory scrutiny | Regulatory | All Phantom Shield content uses harm reduction framing, never promotes illegal activity; legal review before publication |
| Brand dilution: Mixing clinical and ceremonial language | Reputational | Strict segment separation; two content tracks never cross |
| Cold start: Articles don't rank for 90+ days | Operational | Supplement with LinkedIn (instant reach) and email (owned channel) during indexing lag |
| Competitor response: Osmind or Safar copies our keyword strategy | Competitive | First-mover advantage is 6–12 months; publish fast, build domain authority now |
| Advisory board members not cleared for public citation | Compliance | Get written consent from each member before quoting in any public-facing material |

---

## HANDOFF INSTRUCTIONS

**→ LEAD:** Review architecture, approve routing of sub-tasks.

**→ MARKETER:** Takes ownership of:
- Blog article conversion (podcasts → SEO articles)
- Email list setup and segmentation
- LinkedIn content cadence
- PR pitch list

**→ BUILDER:** Takes ownership of:
- Technical SEO implementation (meta tags, sitemap, schema.org)
- Blog page architecture in the React app
- Resource download pages

**→ DESIGNER:** Takes ownership of:
- ICP-specific landing page layouts
- Blog page design
- Resource download PDF templates

---

## DECISION LOG

| Date | Decision | Owner | Rationale |
|---|---|---|---|
| 2026-02-23 | Two-track content strategy (clinical vs. grey market) | PRODDY | Different ICPs require different legal language and trust signals |
| 2026-02-23 | Podcast transcripts as primary content source | PRODDY | VoC language already captured; publish, don't reinvent |
| 2026-02-23 | LinkedIn (Trevor's profile) as primary distribution channel | PRODDY | Fastest path to reach; zero cost; builds founder credibility |
| 2026-02-23 | "Boring is the point" as brand positioning | PRODDY | Anti-Safar differentiation; earns clinical and regulatory trust |

---

*Plan authored by PRODDY — 2026-02-23. Informed by: 9 podcast transcripts, PPN Business Cases, PPN SWOT Analysis, VoC research, Safar competitive intelligence, Proddy_GTM-26-02-19.md, Turning_Point.md.*

==== PRODDY ====
