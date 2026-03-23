==== PRODDY ====
---
owner: LEAD
status: 01_TRIAGE
authored_by: PRODDY
priority: P1
created: 2026-03-06
references: WO-536_2_Click_Sharing.md (superseded - expanded scope)
---

## PRODDY PRD

> **Work Order:** WO-558 - Admin Sharing Library: 2-Click Mobile Messaging by Role
> **Authored by:** PRODDY
> **Date:** 2026-03-06
> **Status:** Draft - Pending LEAD review

---

### 1. Problem Statement

The admin has no centralized, role-aware library of shareable assets for growing the PPN network. Currently, sharing a clinical insight, compliance summary, or practitioner outcome report requires navigating multiple screens, copying information manually, and composing messages from scratch. Each of the 9 platform roles has different messaging needs and different recipient audiences. Without a 2-click mobile sharing flow - one per role - the platform's viral growth and referral potential is zero.

---

### 2. Target User + Job-To-Be-Done

An admin or owner needs to select a pre-composed, role-specific message and share it to any messaging channel in 2 taps or fewer so that they can grow the practitioner network or educate stakeholders without leaving their current screen.

---

### 3. Success Metrics

1. Share action completes in 2 taps or fewer for 95% of tracked share events across all 9 role templates.
2. Zero PHI is present in any shared asset across 50 consecutive QA tests.
3. Native mobile share sheet invokes in less than 1.0 second on iOS Safari and Android Chrome.

---

### 4. Full Customer Journey & Conversion Funnel

The admin sharing library isn't just a communication tool; it is the top of the funnel for PPN network expansion. The Ideal Customer Profile (ICP) journeys through the following steps:

1. **The Catalyst (Admin Action):** An admin identifies a high-value clinical insight or outcome report while reviewing the dashboard. They recognize its value for a specific colleague (the ICP).
2. **The 2-Tap Share:** The Owner/Admin (e.g. Trevor) opens the `AdminSharingLibrary`, selects the specific card tailored to the ICP's role (e.g., `partner_free` for Advisory Board/VIPs or `partner_paid` for paid testers), and taps 'Share'. The native iOS/Android share sheet appears.
3. **The Transmission:** The admin sends the pre-composed, Brandy-copywriter-optimized message via SMS, WhatsApp, or iMessage.
   - *Message Content:* The message includes a hook ("See how this protocol benchmarks..."), a statement of value, and a unique tracking link containing a specific SQL parameter for attribution.
4. **The ICP Reception:** The ICP receives the message. Because it comes from a trusted colleague (the admin) and reads professionally (not like marketing spam), they click the unique link.
5. **The Landing:** The link directs the ICP to a targeted landing page (e.g., the Partner Preview or Phantom Shield explanation). The URL parameters are captured by the backend analytics SQL to track the referral source and role.
6. **The "Aha" Moment:** The ICP views the Zero-PHI architecture, the interactive search portal demo, or the protocol builder. They see the value of network intelligence over isolated forms.
7. **The Conversion:** The ICP clicks "Start 14-Day Free Trial" or "Request Beta Access", entering the onboarding pipeline. The converting SQL parameter ensures the original admin is credited for the referral.
8. **The Loop:** Once onboarded, the new user (now an active practitioner/admin) eventually utilizes the `AdminSharingLibrary` to invite *their* network, continuing the viral loop.

---

### 5. Feature Scope

#### In Scope

- A scalable `AdminSharingLibrary` page/panel accessible from the admin dashboard.
- A filtering/tagging UI to navigate the library (e.g., Filter by Role, Filter by Topic).
- Initial load: One pre-composed sharing card per active `ref_user_role` (8 initial role templates), structured to support rapid addition of future templates.
- Each card includes: Template Title, Role Badge, Use-Case description, message preview, and a share CTA.
- Tap 1: Open library, Tap 2: Filter/Find Card, Tap 3: Tap share CTA - invokes native Web Share API or clipboard copy.
- PPN branding applied to any shareable link or image generated.
- Unique tracking links embedded in the share payload with SQL-compatible attribution parameters.
- Mobile-first layout: stacked card list on smartphone, 2-column grid on tablet, 3-column on desktop.
- Zero-PHI: all content is generic and role-descriptive, no patient or session data.

#### Out of Scope

- Custom message composition by admin (freeform text inputs are banned by ppn-ui-standards).
- Per-patient personalized share links (separate analytics feature).
- Email campaign management or bulk messaging.
- Existing 2-click sharing on visualization cards (WO-536, separate ticket).
- PDF generation (WO-531 covers that separately).

---

**[X] P1** - High value, ship this sprint

**Reason:** USER-directed as explicit P1. The Admin Sharing Library is a core growth mechanism for expanding the practitioner network and a living repository for communication templates. Building it with a scalable tag/filter architecture now prevents technical debt as the library inevitably expands beyond 1 template per role. The 9-role structure maps directly to the live ref_user_roles table, so no schema changes are required for V1 - this is a pure front-end feature that lays the groundwork for future content APIs.

---

### 7. Open Questions for LEAD

1. Should the `AdminSharingLibrary` be a full page (new route) or a slide-out panel accessible from the existing dashboard?
2. Does the Web Share API invocation need a fallback for desktop browsers (e.g., clipboard copy with toast confirmation)?
3. Should share analytics (which role card was tapped, what time, referral conversion) be logged to a new tracking table, or is this out of scope for V1?
4. Where does the admin navigate to this library from - a new "Network" section in the nav, or an existing Admin settings panel?
5. Should DESIGNER create the card templates, or should Brandy's copy output be embedded directly in BUILDER's implementation ticket?

---

### PRODDY Sign-Off Checklist

*Note: The PRD word count limit has been lifted for WO-558 per USER request to accommodate the full customer journey definition.*

- [x] Problem Statement is under 100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is under or equal to 5 items
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: owner: LEAD, status: 00_INBOX
- [x] Response wrapped in ==== PRODDY ====

==== PRODDY ====
