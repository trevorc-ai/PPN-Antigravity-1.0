---
id: WO-123
title: "PPN Academy — Course Waitlist Landing Page"
status: 02_DESIGN
owner: DESIGNER
failure_count: 0
created: 2026-02-20
priority: high
tags: [landing-page, waitlist, academy, email-capture, phase-1, conversion]
---

# WO-123: PPN Academy — Course Waitlist Landing Page

## USER REQUEST (VERBATIM)
> "We should create a landing page for the course with a waitlist. Then we can launch the course once we have enough people on the waitlist."

---

## STRATEGIC CONTEXT

This is a **demand validation play**. Build the landing page now during Phase 1. Launch the actual course (WO-122) only after the waitlist hits a meaningful threshold (suggest: 50 signups = green light). This is the classic "build the audience before the product" GTM move.

**Why smart:**
- Zero wasted build time if demand isn't there
- Creates urgency and exclusivity ("be the first")
- Gives Trevor an email list of pre-qualified practitioners to market to at launch
- Validates price sensitivity before committal to LMS infrastructure

---

## LEAD ARCHITECTURE

**Route:** DESIGNER → BUILDER → INSPECTOR → USER_REVIEW  
**Tech:** New React route `/academy` — standalone page (no auth required, public-facing)  
**Data:** Supabase `academy_waitlist` table (email + name + practitioner_type + created_at)  
**No payment:** Waitlist only — no checkout flow needed yet

---

## DESIGNER BRIEF: Page Layout & Design

### Page Identity
- **URL:** `/academy` (public, no login required)
- **Title:** PPN Practitioner Academy — Join the Waitlist
- **Tone:** Premium, aspirational, clinical authority. Not "hype course" energy — "professional certification" energy.
- **Design aesthetic:** Full "Clinical Sci-Fi" dark theme — consistent with the rest of the portal

---

### Page Sections (in order)

**1. HERO SECTION**

Headline (large, bold):
> "Master the Documentation Standard for Psychedelic-Assisted Therapy"

Subhead:
> "The first practitioner training built around real-world evidence, zero-PHI documentation, and audit-ready clinical records. Launching soon — join the waitlist."

- Badge: `"COMING SOON — PHASE 2"` in an amber/gold pill badge
- CTA button (primary): **"Join the Waitlist — It's Free"** → scrolls to form
- Background: subtle particle animation or gradient consistent with the portal aesthetic

---

**2. SOCIAL PROOF / CREDIBILITY BAR**
A thin bar below the hero with 3–4 trust signals:
- `"Built by practitioners, for practitioners"`
- `"Structured around Arc of Care — PPN's clinical framework"`
- `"CEU credit hours (pending state approval)"`
- `"Zero PHI documentation standard"`

---

**3. COURSE OVERVIEW SECTION**
Headline: `"What You'll Learn"`

6 module cards (icon + title + 1-line description):

| Icon | Module | Description |
|------|--------|-------------|
| 🛡️ | Why Documentation Is Your Best Defense | Turn record-keeping from a liability into your strongest legal protection |
| 🏥 | The Arc of Care Framework | The 3-phase clinical framework used by PPN practitioners |
| 📋 | Using the Clinical Forms | Live walkthrough of all 15 Arc of Care forms |
| ⚗️ | Drug Interaction Screening | Screen for dangerous interactions before every session |
| 🚨 | Safety Events & Crisis Response | Real-time incident documentation under pressure |
| 📊 | Exporting Audit-Ready Reports | Generate insurance-submission-ready clinical reports |

---

**4. WHO THIS IS FOR SECTION**
Headline: `"Built for Every Practitioner in the Field"`

4 audience cards (icon + title + 2–3 lines):
- **Licensed Clinicians** — Psychiatrists, Psychologists, LCSWs, LMFTs navigating liability in an emerging field
- **Clinic Operators** — Ketamine and psilocybin clinic owners building audit-ready operations
- **Independent Practitioners** — Operating in complex legal territory who need defensible documentation
- **Integration Specialists** — Bodyworkers, coaches, and facilitators who need a documentation framework

---

**5. INSTRUCTOR / AUTHORITY SECTION**
Headline: `"Built by PPN Research Portal"`

Short paragraph on the platform's credibility — grounded in VoC research, Zero-PHI architecture, real practitioner feedback. Keep it modest and evidence-based, not self-promotional.

Optional: Trevor Calton byline with a brief 2-sentence bio.

---

**6. WAITLIST FORM SECTION** *(The conversion point)*
Headline: `"Be Among the First"`
Subhead: `"Waitlist members get early access, founding member pricing, and input on the final curriculum."`

Form fields:
- First Name (text input)
- Email (email input, required)
- Practitioner Type (dropdown):
  - Licensed Clinician (MD, DO, NP, PA)
  - Psychologist / Therapist (PhD, PsyD, LCSW, LMFT)
  - Ketamine / Psilocybin Clinic Operator
  - Independent Facilitator / Guide
  - Integration Specialist / Coach
  - Researcher / Academic
  - Other

CTA button: **"Join the Waitlist"** (primary, full-width on mobile)

Below button (small text): `"No spam. No payment required. Just early access."`

Success state: Replace form with:
> ✅ **You're on the list.** We'll email you the moment enrollment opens. Expect founding member pricing and early access.

---

**7. FAQ SECTION** *(3–4 questions only)*

**Q: When does the course launch?**
A: We're building the waitlist first. Once we have enough founding members, we'll set an official launch date and notify you directly.

**Q: How much will it cost?**
A: Waitlist members will receive founding member pricing — substantially below the regular enrollment fee. We'll share exact pricing before launch.

**Q: Will this include CEU credits?**
A: We are pursuing CEU credit approval with relevant state boards. Waitlist members will be updated as approvals are confirmed.

**Q: Do I need a PPN portal account to enroll?**
A: No — the waitlist is open to all practitioners, regardless of whether you use the PPN Research Portal.

---

**8. FOOTER CTA BAR**
A thin bar at the bottom:
`"Already using PPN Research Portal?"` → Link to Dashboard  
`"Not a user yet?"` → Link to Sign Up / Landing page

---

## BUILDER BRIEF: Technical Spec

### Route
```
/academy → src/pages/Academy.tsx (new file)
```
Public route — no auth required. Add to router.

### Supabase Table
```sql
CREATE TABLE IF NOT EXISTS public.academy_waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  first_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  practitioner_type TEXT NOT NULL,
  source TEXT DEFAULT 'academy_landing_page'
);

ALTER TABLE public.academy_waitlist ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anonymous users (public form)
CREATE POLICY "allow_public_insert" ON public.academy_waitlist
  FOR INSERT WITH CHECK (true);

-- Only authenticated users (admins) can read
CREATE POLICY "allow_authenticated_read" ON public.academy_waitlist
  FOR SELECT USING (auth.role() = 'authenticated');
```

### Form Behavior
- Client-side validation: name required, email required + valid format, practitioner_type required
- On submit: INSERT to `academy_waitlist` table
- On success: swap form for success message (no page reload)
- On duplicate email: show friendly message — "You're already on the list! We'll be in touch."
- On error: show generic error + "Please try again or email us at trevor@ppnportal.com"

### SEO Meta Tags
```html
<title>PPN Practitioner Academy — Psychedelic Therapy Documentation Training</title>
<meta name="description" content="Join the waitlist for the first practitioner training built around Zero-PHI documentation, audit-ready clinical records, and real-world evidence for psychedelic-assisted therapy." />
<meta property="og:title" content="PPN Practitioner Academy — Join the Waitlist" />
<meta property="og:description" content="Master documentation standards for psychedelic-assisted therapy. Waitlist now open." />
```

### Analytics
- Fire a custom event on successful waitlist signup: `academy_waitlist_signup` with `practitioner_type` as a property
- Track scroll depth to form (standard analytics)

---

## SUCCESS CRITERIA

- [ ] `/academy` route live and accessible without login
- [ ] Form submits successfully to Supabase `academy_waitlist` table
- [ ] Duplicate email handled gracefully
- [ ] Success state shown after submission (no page reload)
- [ ] SEO meta tags correct
- [ ] All fonts ≥ 12px
- [ ] No color-only status indicators
- [ ] Mobile responsive (form usable on iPhone)
- [ ] Page loads in < 2 seconds

---

## LAUNCH THRESHOLD

Trevor to define: how many waitlist signups = green light to build the full academy (WO-122)?

Suggested threshold: **50 signups** from practitioners (not curious observers).

---

*WO-123 created by PRODDY | February 2026*
