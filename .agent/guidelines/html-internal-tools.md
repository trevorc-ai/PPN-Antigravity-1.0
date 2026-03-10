# HTML Internal Tool Guidelines
**Established:** 2026-03-10  
**Pattern Source:** `vip-invite-flow.html`  
**Status:** Active standard — use this pattern for all new internal tools.

---

## The Pattern

When Trevor needs an operational tool — a demo guide, an invite flow, a checklist, a send script — build it as a **standalone HTML file in `/public/internal/`**.

Not a React page. Not a work order document. A real, functional, mobile-first HTML file he can open from his phone.

---

## Why This Works

- **Zero dependencies.** No auth, no npm, no build step. Opens instantly on any device.
- **Mobile first.** Trevor runs demos and sends invites from his phone. The tool has to work in portrait, with thumbs.
- **Self-contained.** The tool explains itself. Labels, instructions, and context are built into the UI — not in a separate doc.
- **Shareable by URL.** `ppnportal.net/internal/vip-invite-flow.html` — open it, bookmark it, done. No logins.
- **Never crawled.** The `vercel.json` header rule automatically blocks all of `/internal/*` from search engines. No maintenance required.

---

## File Structure

```
public/
├── phantom-shield.html        ← truly public, SEO-intended
├── phantom-shield-card.html   ← truly public, SEO-intended
├── robots.txt
└── internal/                  ← operational tools, never indexed
    ├── trevor-showcase.html   ← live demo guide
    ├── vip-invite-flow.html   ← VIP beta invite sender
    ├── advisor-demo.html
    └── [any new tool].html    ← drop it here, instantly protected
```

**Rule:** If a page is meant to be found by anyone searching Google, it goes in `/public/` root. If it's an internal tool used by Trevor or the team, it goes in `/public/internal/`.

---

## The Crawler Protection (Set Once, Never Touch Again)

`vercel.json` contains one rule that covers every file in `/internal/` automatically:

```json
{
  "headers": [
    {
      "source": "/internal/:path*",
      "headers": [
        { "key": "X-Robots-Tag", "value": "noindex, nofollow" }
      ]
    }
  ]
}
```

Drop a new file in `/internal/`. Done. No robots.txt edit. No meta tag to remember.

---

## What Goes in an Internal Tool (Design Checklist)

A good internal HTML tool has:

- [ ] **A single clear purpose** stated in the page header in one line
- [ ] **Mobile-first layout** — max-width ~500px, thumb-friendly tap targets (48px min height)
- [ ] **Step-by-step flow** — if actions are sequential, use tabs or numbered steps
- [ ] **Functional CTAs** — buttons that actually do something (Web Share API, clipboard copy, external link)
- [ ] **Contextual instructions** built into the UI — not in a separate doc
- [ ] **Info panels** below the phone mockup explaining *why* each step works
- [ ] **Toast feedback** on every action — never leave a tap unacknowledged
- [ ] **PPN dark design system** — `#0a1628` background, `#6366f1` indigo accent, glassmorphism cards, Inter font

---

## What an Internal Tool is NOT

- ❌ Not a markdown document
- ❌ Not a React page behind auth (use React for features users interact with; use HTML for tools Trevor operates)
- ❌ Not a mockup or wireframe — it must actually work
- ❌ Not a link list — every item should be a functional interaction

---

## Examples of Good Candidates for This Pattern

| Need | Build As |
|---|---|
| Pre-demo checklist with talking points | `demo-guide.html` |
| Beta invite send tool | `vip-invite-flow.html` ✅ |
| Conference share card | `conference-share.html` |
| Partnership deck send tool | `partner-send.html` |
| Internal feature walkthrough | `feature-preview.html` |

---

## Referencing This in Work Orders

When PRODDY writes a PRD for an internal operational tool, the Feature Scope should include:

> **Implementation format:** Standalone HTML file in `/public/internal/`. No React, no database, no auth. Functional in a browser with no build step.
