---
owner: MARKETER
status: 00_BACKLOG
authored_by: PRODDY
priority: P0
created: 2026-03-22
epic_type: Video_Script
target_audience: Clinic administrators, compliance officers, insurance coordinators, and institutional buyers; secondarily existing practitioners who have not yet generated reports
notebook_source: N/A
prototype_reference: docs/projects/ppn-video-production-series.md
denver_deadline: 2026-04-04
---

## Brief

Script 3 of the PPN Video Production Series. A 2-2.5 minute HERO compliance and reporting video. Demonstrates the full report suite: Clinical Outcomes Report (with PHQ-9/GAD-7 baseline, Pharmacokinetic Flight Plan, QT Interval table, MEQ-30), Integration Compass, Session Export, and Patient Report. Framing is entirely outcome-first: "what do you hand a payer?" is the core question this video answers.

This is the video most likely to close an institutional buyer who does not care about the software but does care about audit readiness and compliance documentation. Must be published with QR code by April 4, 2026.

## MARKETER Task List

1. Read `.agent/skills/ppn-ui-standards/SKILL.md` Rules 1, 4, 6, and 7 before producing any output
2. Produce a `CONTENT_MATRIX.md` for this GO using the SEO/AIO block below
3. Review narration in approved script (`docs/projects/ppn-video-scripts-all.md`, Script 3) -- every sentence must be intelligible to a compliance officer or insurance coordinator, not just a practitioner
4. Confirm MEQ-30 and QT Interval sections are rendering in the PDF (WO-600 open question) before approving Scene 8 for production
5. Confirm no em dashes in any on-screen text or chapter title
6. Run the Section 3b accessibility pre-check on all exhibits
7. Self-certify and submit CONTENT_MATRIX for user review

## SEO and AIO Requirements (MARKETER -- Complete in CONTENT_MATRIX)

```yaml
target_keyword: "psychedelic therapy clinical report compliance documentation"
seo_title: "Clinical Reports for Psychedelic Therapy | PPN Portal"
seo_meta_description: "Generate compliance-ready clinical reports for psychedelic therapy sessions -- QT intervals, MEQ-30, PHQ-9, pharmacokinetics, and audit logs. One click."
aio_schema_type: "Product"
aio_schema_description: "PPN Portal generates structured clinical documentation for psychedelic therapy practitioners including pharmacokinetic flight plans, QT interval monitoring, MEQ-30 outcomes, and session audit logs formatted for institutional and insurance review."
internal_links:
  - anchor_text: "View the clinical report"
    target_url: "/clinical-report-pdf"
  - anchor_text: "See how session data is captured"
    target_url: "/wellness-journey"
```

> MARKETER note: The primary buyer for this video is not the practitioner -- it is the clinic administrator, compliance officer, or payer. All associated copy must speak to defensibility, audit readiness, and institutional credibility. The practitioner angle is secondary. Lead with "what you hand them," not "what the platform does."

## Reference Assets

- Script: `/brain/ppn-video-scripts-all.md` -- Script 3 section
- PROJECT_BRIEF: `docs/projects/ppn-video-production-series.md`
- Screenshots available (Marketing): `Dosing Protocol Log.webp`, `Mental Health Screening.webp`, `Protocol Detail Session Vitals.webp`, `QT Interval Tracking.webp`, `Integration Progress Tracker.webp`, `Outcome Profiles - Clinical and Plain-English.webp`, `Clinical Record Audit Logs.webp`
- Screenshot NEEDED: Clinical Report PDF full render using DEMO-2026-001 synthetic patient. This is the most important scene. Capture from ppnportal.net/clinical-report-pdf. Confirm MEQ-30 and QT Interval sections are complete before shoot.
- Style guide: Deep Black #020408, Clinical Green #53d22d, Amber #f59e0b

## Fast-Lane Flag

No DESIGNER mockup pass required. USER produces in Descript. However: confirm Clinical Report PDF completeness (WO-600 open questions) BEFORE scheduling the production shoot for this video.

## Audience-Specific Exclusions

- Do not mention pricing, subscription tiers, or billing
- Do not reference beta status or incomplete features
- Do not show real patient data or PHI -- use the DEMO-2026-001 synthetic patient only
- Do not describe the platform as a medical device or claim FDA clearance
