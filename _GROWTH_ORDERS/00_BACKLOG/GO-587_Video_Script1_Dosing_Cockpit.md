---
owner: MARKETER
status: 00_BACKLOG
authored_by: PRODDY
priority: P0
created: 2026-03-22
epic_type: Video_Script
target_audience: Clinic directors and institutional buyers evaluating PPN; existing practitioners deepening cockpit feature adoption
notebook_source: N/A
prototype_reference: docs/projects/ppn-video-production-series.md
denver_deadline: 2026-04-04
---

## Brief

Script 1 of the PPN Video Production Series. The primary HERO sales video. 90-150 seconds demonstrating the Dosing Cockpit's real-time vitals tracking -- heart rate, systolic blood pressure, and temperature plotted across session elapsed time, with clinical event pins, threshold alerts, and live timestamped logging.

Clinician-first framing: leads with the clinical question ("Do you know your patient's blood pressure right now?"), not the software feature. This is the video that makes a clinic director understand what PPN does before they have ever logged in.

Must be published with QR code by April 4, 2026 for PsyCon Denver.

## MARKETER Task List

1. Read `.agent/skills/ppn-ui-standards/SKILL.md` Rules 1, 4, 6, and 7 before producing any output
2. Produce a `CONTENT_MATRIX.md` for this GO using the SEO/AIO block below
3. Review narration in approved script (`docs/projects/ppn-video-scripts-all.md`, Script 1) -- verify threshold values (HR greater than 130, BP Sys greater than 140) match platform behavior
4. Flag any sentence that would lose a clinic director (no feature jargon without plain-language translation)
5. Confirm no em dashes in any on-screen text or chapter title
6. Run the Section 3b accessibility pre-check on all exhibits
7. Self-certify and submit CONTENT_MATRIX for user review

## SEO and AIO Requirements (MARKETER -- Complete in CONTENT_MATRIX)

```yaml
target_keyword: "real-time vitals monitoring psychedelic therapy session"
seo_title: "Dosing Cockpit -- Real-Time Clinical Intelligence | PPN"
seo_meta_description: "Monitor heart rate, blood pressure, and temperature in real time during psychedelic therapy sessions. Automated threshold alerts. Permanent clinical record."
aio_schema_type: "Product"
aio_schema_description: "The PPN Dosing Cockpit plots patient vitals in real time during psychedelic therapy sessions, flags threshold violations automatically, and creates a permanent timestamped clinical record of every event."
internal_links:
  - anchor_text: "Start a session"
    target_url: "/wellness-journey"
  - anchor_text: "See how session data becomes a clinical report"
    target_url: "/clinical-report-pdf"
```

> MARKETER note: The hook for this script leads with a direct clinical question. Preserve that framing in all associated copy. This video is the primary proof-of-value asset for the cockpit feature -- the copy must make a clinic director feel the gap before PPN, not just understand the feature.

## Reference Assets

- Script: `/brain/ppn-video-scripts-all.md` -- Script 1 section
- PROJECT_BRIEF: `docs/projects/ppn-video-production-series.md`
- Screenshots available: `public/screenshots/Other-Screenshots/Page-Phase2-Main.webp`, `Component-Phase2-Dosing1-Session-Trend.webp`, `Component-Phase2-Dosing2-Live-Session-Timeline.webp`, `Component-Phase2-Dosing3-Session-Updates-Input.webp`
- Screenshots available (Marketing): `Session Vital Signs.webp`, `Session Vitals Tracking.webp`, `Live Session Timeline.webp`, `Session Updates.webp`
- Screenshots NEEDED: Vitals Trend Chart with live HR + BP lines AND visible event pins (dose_admin, PEAK). Must capture from ppnportal.net with active or demo session.
- Style guide: Deep Black #020408, Clinical Green #53d22d, Amber #f59e0b, Rose #f43f5e

## Fast-Lane Flag

No DESIGNER mockup pass required. USER produces in Descript using existing and captured screenshots.

## Audience-Specific Exclusions

- Do not mention pricing, subscription tiers, or billing
- Do not reference beta status
- Do not show real patient data or PHI -- use the DEMO-2026-001 synthetic patient only
