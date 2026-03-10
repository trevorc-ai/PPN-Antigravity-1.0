# GO-585 Beta Welcome Screen - Design Spec
**Stage:** 03_MOCKUP_SANDBOX
**Pipeline:** _GROWTH_ORDERS

## Layout (Mobile-First, Max-Width 440px Card)

```
┌─────────────────────────────┐
│  [STAGING BANNER if env]    │
├─────────────────────────────┤
│                             │
│   [Shield] FOUNDING MEMBER  │  ← ppn-body, indigo pill badge, NOT text-xs
│          ACCESS             │
│                             │
│  ┌───────────────────────┐  │
│  │  bg-slate-900/60       │  │  ← MANDATED GLASS: backdrop-blur-md
│  │  backdrop-blur-md      │  │    border border-white/10 rounded-[2rem] p-6
│  │  border border-white/10│  │
│  │  rounded-[2rem]        │  │
│  │                        │  │
│  │   [Network icon box]   │  │
│  │                        │  │
│  │   Welcome,             │  │  ← ppn-body (14px)
│  │   Trevor.              │  │  ← ppn-page-title (h1, 36px)
│  │                        │  │
│  │   [Orientation para]   │  │  ← ppn-body text-slate-400
│  │                        │  │
│  │  ┌─────────────────┐  │  │
│  │  │  [BarChart3]    │  │  │  ← indigo-950/40 border-indigo-500/20 block
│  │  │   1,500+        │  │  │  ← ppn-section-title (h2 semantic weight)
│  │  │   anonymized... │  │  │  ← ppn-body (NO em dash)
│  │  └─────────────────┘  │  │
│  │                        │  │
│  │  [Users] social proof  │  │  ← ppn-body min (NOT ppn-meta)
│  │                        │  │
│  │  [ENTER THE NETWORK →] │  │  ← Full-width indigo CTA button
│  │                        │  │
│  │  Your access is active │  │  ← ppn-body (NOT ppn-meta)
│  └───────────────────────┘  │
│                             │
│   Psychedelic Practitioner  │  ← ppn-body text-slate-600 (NOT ppn-meta)
│   Network                   │
│                             │
└─────────────────────────────┘
```

## Violation Fix List

1. Badge: text-xs → ppn-body minimum (render as text-sm at least)
2. L88: em dash → comma
3. L76: em dash → comma  
4. L95: ppn-meta → ppn-body
5. L112: ppn-meta → ppn-body
6. L118: ppn-meta → ppn-body
7. Glass card: rounded-3xl + border-slate-700/50 → rounded-[2rem] + border-white/10
8. Copy: passive voice → active, forward-looking (per CONTENT_MATRIX)
9. Add inline title + meta tags (per ForClinicians.tsx pattern)
10. JSON-LD MedicalOrganization schema in script tag
