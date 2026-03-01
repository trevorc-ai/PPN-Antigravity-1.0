---
id: WO-534
title: "Companion Mode — Update Spherecules Video to Portrait Orientation"
status: INBOX
priority: LOW
owner: UNASSIGNED
created: 2026-03-01
---

## Problem

The Companion Mode (`/companion/:sessionId`) currently plays `spherecules.mp4` which was produced in landscape orientation. The user has an updated Spherecules video in **portrait orientation** that should replace it.

The Companion UI is designed to run on a patient's phone held vertically. A portrait-native video will fill the screen correctly with `object-cover` instead of letterboxing.

## Requested Change

1. **Replace** `/public/admin_uploads/spherecules.mp4` with the new portrait-oriented Spherecules video provided by the user.
2. **Verify** the video fills the `flex-1` upper container edge-to-edge on a portrait viewport (375×812 or similar).
3. **Confirm** `autoPlay loop muted playsInline` attributes remain intact.
4. No CSS changes required — the `object-cover` class already handles portrait video correctly once the source is swapped.

## Acceptance Criteria

- [ ] New portrait video plays automatically and loops in Companion Mode
- [ ] No black bars or letterboxing visible on portrait phone viewport
- [ ] Video file is ≤ original size (or compressed appropriately)
- [ ] Existing `mix-blend-screen` overlay effect still applies

## Open Questions

- [ ] **User to provide:** Upload path or direct file for the new portrait Spherecules MP4.
- [ ] Should the filename stay `spherecules.mp4` (drop-in replace) or use a new name?
