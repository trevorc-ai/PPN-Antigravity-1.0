---
id: WO-537
title: "Dashboard Hide Network Activity & Welcome Screen Link"
status: 00_INBOX
owner: PENDING
created: 2026-03-01T11:29:02-08:00
failure_count: 0
priority: NORMAL
---

## User Request (Verbatim)

> "Dashboard: Hide 'Network Activity' container until the data is ready (instead of displaying it with 'Coming Soon')"
> "Welcome screen is not accessible by link once the user leaves that screen"

## CUE Summary

Two surgical UI fixes are required on the Dashboard. The 'Network Activity' container should be hidden entirely instead of showing a 'Coming Soon' placeholder. Additionally, the Welcome/onboarding screen should be made navigable via a persistent link so practitioners can return to it after initially leaving.

## Open Questions

- Should the Welcome screen be accessible via the sidebar navigation, a help menu, or another entry point?
- Should 'Network Activity' be fully removed from the DOM, or conditionally rendered (hidden but present for future activation)?

## Out of Scope

- Any changes to the actual Network Activity data pipeline or content.
- Any changes to the Welcome screen's content or design.
