# Phase 2 Mobile Surgery

Mobile UI/UX: Core Principles
1. Thumb Zone First
The bottom 40% of the screen is the natural resting zone for thumbs. Primary actions go there — which is exactly why Phase2LiveBar is sticky-bottom. Everything else is secondary and can require a stretch or scroll.

2. One Job Per Screen
At any moment, mobile should be trying to get the practitioner to do one thing. Before session: complete the prep checklist. During session: log or respond. Cramming the full desktop layout onto mobile creates cognitive overload — this is why we collapse the patient bar, hide demographic pills, kill MEQ-30, etc.

3. Fat Fingers, Low Fidelity
48px minimum touch target. 80px+ for anything critical during an active session (Cockpit Mode). Small text <14px is never acceptable for clinical data. Dense, small tap targets cause errors — which in a clinical context has real consequences.

4. Scroll is cheap, visibility is not
It's fine to scroll vertically. It's not fine to hide critical real-time data behind taps. Pre-session content → accordion ✅. Live telemetry → never accordion. This is the #1 rule from the Ibogaine spec.

5. Text weight ≠ hierarchy — contrast + size do
On a dark background, font-semibold at high contrast reads just as confidently as font-black at medium contrast — and takes up less visual space. Lightening weights gives you breathing room without losing legibility. This is the whole thesis of the pass we just did.

6. Reduce before you hide
The instinct is to hide things on mobile. Better instinct: reduce them (smaller text, tighter padding, shorter labels) and only hide what's genuinely irrelevant to the mobile context (Lookup, QA chip, keyboard shortcuts).

7. Ambient context, not ambient noise
Everything visible on mobile should either be actionable right now or critical to safety. If it's reference data (demographics, MEQ-30, session history), it gets collapsed or moved. The practitioner's attention is the scarcest resource in the room.

For clinical / Cockpit Mode specifically:

Dark = default (eye strain + room ambiance)
Color = status only (red = danger, amber = caution, green/blue = normal)
Glanceability at 3 feet — if it requires squinting, it fails
Confirmation patterns for high-risk actions (swipe-to-confirm or hold-3s for irreversible logs)

