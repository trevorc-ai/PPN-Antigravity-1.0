---
id: WO-559-563-EPIC
title: "Five Audience Front Door Landing Pages (Clinician, Insurance, Privacy, Global, Patient)"
owner: BUILDER
status: 03_BUILD
routed_by: LEAD
date_routed: 2026-03-09
priority: P0
child_wos: [WO-559, WO-560, WO-561, WO-562, WO-563]
files:
  - src/pages/ForClinicians.tsx          [NEW]
  - src/pages/ForPayers.tsx              [NEW]
  - src/pages/StructuralPrivacy.tsx      [NEW]
  - src/pages/GlobalNetwork.tsx          [NEW]
  - src/pages/ForPatients.tsx            [NEW]
  - src/App.tsx                          [MODIFY — add 5 new routes]
---

# WO-559–563 CONSOLIDATED BUILD PLAN: Five Front Door Landing Pages

## Constraints
- Five isolated new page files — one per audience segment.
- Each page shares the SAME component template (described below), customized per audience with different copy, accent color, and hero tagline.
- All pages use existing design system classes: `ppn-page-title`, `ppn-body`, `ppn-label`, `ppn-card-title`.
- All CTAs must pass a `segment` query param (`?source=clinical`, `?source=insurance`, etc.) to the registration/waitlist flow.
- NO new auth logic. CTA buttons link to `/signup?source=[segment]` or `/waitlist?source=[segment]`.
- Mobile-first: all pages must be fully functional at 375px with `min-h-[44px]` touch targets on all buttons.

---

## LEAD Decisions (resolving PRODDY open questions)

| WO | Question | LEAD Decision |
|---|---|---|
| WO-559 | Route in React app or static? | React app — route `/for-clinicians` |
| WO-559 | Hero image? | Screenshot/mock of the WellnessJourney dashboard (use a dark glassmorphism placeholder card if screenshot unavailable) |
| WO-560 | CTA routes to consultation form or standard auth? | Custom link: `/waitlist?source=insurance&type=consultation` |
| WO-561 | PDF whitepaper as lead magnet? | Yes — CTA says "Request Architecture Whitepaper" → `/waitlist?source=privacy` |
| WO-562 | StarField hero? | Yes — reuse existing `<StarField />` component as hero background |
| WO-562 | Research access queue? | Route to `/waitlist?source=global&type=research` |
| WO-563 | Patient flow: limited app or waitlist? | Waitlist — route to `/waitlist?source=patient` |
| WO-563 | Patient messaging emphasis? | "Track Your Healing" + "Compare to Global Benchmark" both featured |

---

## Page Template (all five pages follow this structure)

```tsx
// Template: src/pages/[PageName].tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PAGE_CONFIG = {
  route: '/for-clinicians',
  segment: 'clinical',
  accentColor: '#6366f1',     // indigo for clinical
  headline: 'The Clinical Layer',
  subheadline: 'Replace your spreadsheets with a Zero-PHI, structured documentation platform built for psychedelic therapy.',
  heroTag: 'FOR CLINICIANS & PRACTITIONERS',
  ctaLabel: 'Request Beta Invite',
  ctaHref: '/signup?source=clinical',
  pills: ['Zero-PHI Architecture', 'Structured Protocol Builder', 'Drug Interaction Checker', 'HIPAA Safe Harbor'],
  features: [
    { icon: '🩺', title: 'Clinical Workflow', body: 'Document every session phase — from intake to integration — in a structured, immutable record.' },
    { icon: '🔒', title: 'Liability Shield', body: 'Subject IDs, not names. Foreign-key IDs, not free text. Structural protection, not just policy.' },
    { icon: '📊', title: 'Network Benchmarks', body: 'See how your outcomes compare to 10+ landmark cohort studies in real time.' },
  ],
};
```

---

## Per-Page Configuration

| Field | WO-559 Clinical | WO-560 Insurance | WO-561 Privacy | WO-562 Global | WO-563 Patient |
|---|---|---|---|---|---|
| **Route** | `/for-clinicians` | `/for-payers` | `/structural-privacy` | `/global-network` | `/for-patients` |
| **File** | `ForClinicians.tsx` | `ForPayers.tsx` | `StructuralPrivacy.tsx` | `GlobalNetwork.tsx` | `ForPatients.tsx` |
| **Segment param** | `clinical` | `insurance` | `privacy` | `global` | `patient` |
| **Accent color** | `#6366f1` indigo | `#0ea5e9` sky | `#2dd4bf` teal | `#8b5cf6` violet | `#fb7185` rose |
| **Hero tag** | `FOR CLINICIANS` | `FOR PAYERS & UNDERWRITERS` | `STRUCTURAL PRIVACY` | `GLOBAL RESEARCH NETWORK` | `FOR PATIENTS` |
| **Headline** | The Clinical Layer | The Actuarial Intelligence Layer | Zero-PHI by Architecture | Planetary-Scale Intelligence | Track Your Healing |
| **CTA label** | Request Beta Invite | Schedule Briefing | Request Architecture Whitepaper | Apply for Research Access | Join the Patient Beta |
| **CTA href** | `/signup?source=clinical` | `/waitlist?source=insurance&type=consultation` | `/waitlist?source=privacy` | `/waitlist?source=global&type=research` | `/waitlist?source=patient` |
| **Feature 1** | Clinical Workflow docs | Outcome Validation | Policy vs. Structural Protection | Landmark Study Integration | Personal Journey Tracker |
| **Feature 2** | Liability / Zero-PHI | Safety Surveillance Layer | Cryptographic Patient Hashing | Protocol Harmonization | Phantom Shield Privacy |
| **Feature 3** | Network Benchmarks | Actuarial Benchmarks | Practitioner Endorsement | Citizen Science Contribution | Compare to Global Average |
| **Pills** | Zero-PHI, Protocol Builder, Drug Checker | Structured Outcomes, Safety Matrix, Actuarial DB | Zero-PHI Architecture, No PII, HIPAA Safe Harbor | 10+ Cohorts, 40+ Countries, Global Benchmark | Private Journaling, Phantom Shield, Citizen Science |

---

## `App.tsx` Routes to Add

Find the existing route definitions and add (inside the router):

```tsx
import ForClinicians from './pages/ForClinicians';
import ForPayers from './pages/ForPayers';
import StructuralPrivacy from './pages/StructuralPrivacy';
import GlobalNetwork from './pages/GlobalNetwork';
import ForPatients from './pages/ForPatients';

// Add these routes:
<Route path="/for-clinicians" element={<ForClinicians />} />
<Route path="/for-payers" element={<ForPayers />} />
<Route path="/structural-privacy" element={<StructuralPrivacy />} />
<Route path="/global-network" element={<GlobalNetwork />} />
<Route path="/for-patients" element={<ForPatients />} />
```

---

## Page JSX Structure (Builder: use this template for all 5, swap `PAGE_CONFIG` per page)

```tsx
export default function ForClinicians() {
  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Hero */}
      <div className="relative overflow-hidden px-6 py-24 text-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {/* StarField only on GlobalNetwork page */}
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-6"
            style={{ background: `${ACCENT}15`, border: `1px solid ${ACCENT}40`, color: ACCENT }}>
            {PAGE_CONFIG.heroTag}
          </span>
          <h1 className="ppn-page-title mb-4">{PAGE_CONFIG.headline}</h1>
          <p className="ppn-body text-slate-400 max-w-xl mx-auto mb-8">{PAGE_CONFIG.subheadline}</p>
          {/* Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {PAGE_CONFIG.pills.map(p => (
              <span key={p} className="px-3 py-1 rounded-full text-xs font-semibold text-slate-300"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>{p}</span>
            ))}
          </div>
          {/* Primary CTA */}
          <a href={PAGE_CONFIG.ctaHref}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
            style={{ background: ACCENT, boxShadow: `0 0 40px ${ACCENT}50`, minHeight: 56 }}
            aria-label={PAGE_CONFIG.ctaLabel}>
            {PAGE_CONFIG.ctaLabel} →
          </a>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {PAGE_CONFIG.features.map(f => (
          <div key={f.title} className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-3xl mb-4">{f.icon}</div>
            <h3 className="ppn-card-title mb-2" style={{ color: ACCENT }}>{f.title}</h3>
            <p className="ppn-body text-slate-400">{f.body}</p>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center pb-24 px-6">
        <a href={PAGE_CONFIG.ctaHref}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
          style={{ background: ACCENT, minHeight: 56 }}>
          {PAGE_CONFIG.ctaLabel} →
        </a>
        <p className="ppn-body text-slate-500 mt-4 text-sm">Psychedelic Practitioner Network · <a href="/" className="text-slate-400 hover:text-white">ppnportal.net</a></p>
      </div>
    </div>
  );
}
```

---

## Execution Order

1. Create `src/pages/ForClinicians.tsx` using the template + WO-559 config
2. Create `src/pages/ForPayers.tsx` using the template + WO-560 config
3. Create `src/pages/StructuralPrivacy.tsx` using the template + WO-561 config
4. Create `src/pages/GlobalNetwork.tsx` using the template + WO-562 config (add `<StarField />` to hero)
5. Create `src/pages/ForPatients.tsx` using the template + WO-563 config
6. Modify `src/App.tsx` to add the 5 routes

## QA Checklist

- [ ] All 5 routes load without console errors (`/for-clinicians`, `/for-payers`, `/structural-privacy`, `/global-network`, `/for-patients`)
- [ ] Each page has its distinct accent color, headline, and CTA copy
- [ ] CTA hrefs pass correct `?source=` param (verify in network tab)
- [ ] At 375px: hero, pills, features, and CTA all stack properly with no horizontal overflow
- [ ] All CTA buttons `min-height: 44px` or greater
- [ ] `npm run build` passes with zero TypeScript errors
