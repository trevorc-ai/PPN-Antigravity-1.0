==== PRODDY ====
---
owner: BUILDER
status: 01_TRIAGE
authored_by: PRODDY
architected_by: LEAD
priority: P1
created: 2026-03-09
references:
  - WO-558 (ARCHIVED — superseded by this ticket, scoped correctly)
  - WO-585 (Beta Welcome Screen — destination of links generated here)
  - WO-586 (Beta Account Provisioning — source of magic links used here)
  - WO-536 (2-Click Intelligence Sharing — sibling feature, post-entry)
---

## LEAD Architecture Decisions

**Q1 — Route type:** Standalone full-page route at `/admin/invite`. Reason: a panel inside an existing page creates unnecessary DOM nesting and makes mobile layout harder. Keep it simple.

**Q2 — Magic link placeholder:** **Option (b)** — Trevor enters the magic link into a text input field on the tool before sharing. Each card has a single `<input type="url" placeholder="Paste magic link here">` field. When Trevor taps Share, the Web Share API composes the message body by injecting the entered URL into the pre-written template. This is the correct balance: zero freeform composition (message is fixed), but a single structured URL input is required.

**Q3 — Web Share API payload:** Use the `{ title, text, url }` structure where `text` contains the full pre-composed message and `url` contains the magic link. The `MagicLinkModal.tsx` already implements this exact pattern with `navigator.share()` + `navigator.clipboard.writeText()` fallback — **BUILDER reuses this pattern verbatim.**

**Q4 — Role visibility:** Route protected by `isAdmin` check only (role === `'admin'`). The `owner` role is not currently in the AuthContext type definition — do NOT add it in this ticket. Trevor is `admin`.

**Dependency:** WO-585 (`/beta-welcome` route) must be deployed before WO-587 is used in production, since the invite links point to that route. Build order: WO-585 first, WO-587 second.

**BUILDER implementation notes:**
- New file: `src/pages/AdminInvitePage.tsx`
- New route in `App.tsx`: `<Route path="/admin/invite" element={user && userRole === 'admin' ? <AdminInvitePage /> : <Navigate to="/login" replace />} />`
- Three card components, statically defined. No DB queries.
- Reuse `navigator.share()` + clipboard fallback from `MagicLinkModal.tsx`
- Mobile-first: single column on `< md`, 3-column grid on `md+`

---

## PRODDY PRD

> **Work Order:** WO-587 — VIP Invite Tool (2-Tap Admin Send)
> **Authored by:** PRODDY
> **Date:** 2026-03-09
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

The admin (Trevor) has no fast, mobile-first way to send a personalized, professionally framed invitation to a specific person. Today, sending an invite requires manually composing a message, navigating to a magic link, and assembling everything by hand — a multi-step process that creates friction on the sender side. At 10 invitees this is manageable; at 50 it becomes a bottleneck. Without a repeatable sender-side tool, the VIP invite process cannot scale beyond this first cohort.

---

### 2. Target User + Job-To-Be-Done

Trevor needs to select a pre-composed, role-tailored invitation card and share it via iOS/Android native share sheet in 2 taps or fewer so that he can send a professional, personalized invitation to any invitee from his phone in under 60 seconds.

---

### 3. Success Metrics

1. Full invite send (card selected → share sheet invoked → message sent) completes in ≤ 2 taps and ≤ 60 seconds for 100% of test invites across 10 QA sessions.
2. Native Web Share API share sheet invokes in < 1.0 second on iOS Safari and Android Chrome.
3. Zero PHI or credentials appear in any shared message payload across 20 consecutive QA tests.

---

### 4. Feature Scope

#### ✅ In Scope

- A new admin-only route: `/admin/invite` — protected by existing admin role auth.
- Three static share cards, one per audience segment:
  - **Partner / Advisor** — Benchmark data angle ("First look at 1,500+ real clinical records")
  - **Clinician** — Clinical workflow angle ("Built for sessions like yours")
  - **Privacy / Compliance** — Phantom Shield angle ("Zero-PHI by design")
- Each card displays: Role label, message preview, and a single **"Share"** CTA button.
- Tapping Share invokes the native Web Share API with a pre-composed message body containing a `[MAGIC_LINK]` placeholder and a `[FirstName]` placeholder.
- Fallback for desktop/unsupported browsers: Copy to Clipboard with toast confirmation.
- Mobile-first layout: single-column card stack on phone, 3-column grid on desktop.
- PPN glassmorphism design system, consistent with platform aesthetic.

#### ❌ Out of Scope

- Automated magic link generation from within this tool (links come from Supabase dashboard per WO-586 — Trevor pastes them in manually or they are pre-filled via a future enhancement).
- Freeform message composition (banned by ppn-ui-standards — no free-text inputs).
- Attribution SQL tracking or referral analytics (future enhancement, not V1).
- Email campaign tooling or bulk sending.
- Filter/tag UI or expandable card library (this was what killed WO-558 — start with 3 cards, expand later).
- Any card for non-beta audience segments (9-role library is out of scope for V1).

---

### 5. Priority Tier

**[X] P1** — High value, ship this sprint

**Reason:** Beta invitations go out within hours of benchmark data verification. Without this tool, Trevor manually composes 10 individual messages — which works at 10 but sets a bad precedent. This is the piece that makes the entire invite system repeatable for cohort 2, 3, and beyond. Builds directly on WO-585 (destination) and WO-586 (auth layer) which are already in the queue.

---

### 6. Open Questions for LEAD

1. Should `/admin/invite` be a standalone full-page route or a panel accessible from the existing admin section of the dashboard?
2. Should the `[MAGIC_LINK]` placeholder be: (a) manually replaced by Trevor before sharing, (b) entered into a text field on the tool before sharing, or (c) always a fixed beta entry URL (`/beta-welcome`) without a unique token at this stage?
3. Does the Web Share API need a data payload (title, text, url separately) or a single composed string? BUILDER to confirm browser compatibility matrix.
4. Should this tool be visible in navigation to `owner` role as well as `admin`, given Trevor's co-founder context?

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
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`

==== PRODDY ====
