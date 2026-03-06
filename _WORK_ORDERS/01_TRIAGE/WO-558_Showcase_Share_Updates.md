==== PRODDY ====
---
owner: LEAD
status: 01_TRIAGE
authored_by: PRODDY
priority: P1
created: 2026-03-06
---

## PRODDY PRD

> **Work Order:** WO-558 — Showcase Page Share Features  
> **Authored by:** PRODDY  
> **Date:** 2026-03-06  
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement
The existing Founder Showcase page (`trevor-showcase.html`) is highly effective for live demonstrations, but it lacks native, frictionless ways to distribute platform links immediately during or after a pitch. Currently, sharing relies on manual instructions like telling prospects to screenshot a QR code or manually typing URLs. This introduces unnecessary friction at the point of highest excitement, risking lost leads and slowing down network acquisition.

---

### 2. Target User + Job-To-Be-Done
The founder needs 1-click native sharing capabilities integrated directly into the showcase page so that they can instantly text, email, or Airdrop platform links to prospects without breaking conversation flow.

---

### 3. Success Metrics

1. 100% of key promotional links on the showcase page are equipped with a 1-click Native Share or Copy-to-Clipboard action.
2. The time required to distribute a platform link during a demo is reduced to < 3 seconds.
3. Zero visual regressions or broken layouts on mobile viewports after adding the new share elements.

---

### 4. Feature Scope

#### ✅ In Scope

- Integration of the Native Web Share API (`navigator.share()`) on `trevor-showcase.html`.
- Implementation of share buttons for the core assets: Main Platform, Partner Preview, Phantom Shield, and the Trial Checkout link.
- Fallback JS logic for "Copy to Clipboard" on browsers that do not support the Web Share API.
- Pre-populated sharing payloads (title, short descriptive text, and URL) optimized for SMS and email.
- UI styling for the share buttons that matches the existing clinical-grade glassmorphism aesthetic.

#### ❌ Out of Scope

- Building any new React components or a centralized dashboard sharing library (this is purely an enhancement of the static HTML asset).
- Adding complex analytics or link-tracking parameters.
- Changing the layout or flow of the existing 6 demo steps.
- Updating other HTML assets (`jason-demo.html`, etc.) — this is scoped only to Trevor's showcase piece for now.

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint  

**Reason:** The founder is actively using this page to pitch. Eliminating the friction of sharing links at the climax of the demo is the highest-leverage way to convert those pitches into active user trials right now.

---

### 6. Open Questions for LEAD

1. Should the share buttons be placed inline with the current "Quick Links" at the top, or consolidated in a sticky action bar at the bottom?
2. Are there specific pre-populated text snippets you want used for the shares, or should BUILDER use standard professional copy ("Check out the PPN Portal...")?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 01_TRIAGE`
- [x] Response wrapped in `==== PRODDY ====`

==== PRODDY ====
