# PROJECT_BRIEF: PPN Video Production Series
**Created:** 2026-03-22 | **Status:** Active
**Owner:** PRODDY | **LEAD contact:** LEAD

---

## One-Sentence Goal

Produce a series of value demonstration videos that make clinical practitioners and institutional buyers feel the transformative power of the PPN platform's outputs -- without ever having to open the app themselves.

## Audience

**Primary:** Licensed clinical practitioners already onboarded -- deepen feature adoption.
**Secondary:** Clinic directors, researchers, and institutional buyers evaluating the platform -- close the deal.
**Delivery context:** Descript-hosted public links, QR codes on leave-behinds at PsyCon Denver (April 7, 2026), embedded via `learnMoreUrl` in platform tooltips (WO-600), and standalone sales assets.

---

## Strategic Frame

> "Clinicians do not care about the software. They care about the outputs."

Every script must lead with the clinical insight or record, not the feature that produced it. The software is the vehicle. The output is the destination.

**Narrative arc for every video:** Before PPN / what the practitioner now knows / what they can prove.

---

## Script Series -- Full Scope

| # | Title | Type | Hero Output | Denver Priority |
|---|---|---|---|---|
| 0 | Platform Overview -- The 5-Min Arc | Sales + Onboarding | Full platform tour | P0 -- Must ship by April 4 |
| 1 | The Dosing Cockpit -- Real-Time Clinical Intelligence | HERO Sales | Vitals Trend During Dosing | P0 -- Must ship by April 4 |
| 2 | The Global Benchmark -- You Are Not Practicing Alone | HERO Sales | Network Intelligence comparison | Post-Denver |
| 3 | The Report Suite -- Your Compliance Stack | HERO Sales | Full report suite (clinical PDF, session export, patient report) | P0 -- Must ship by April 4 |
| 4 | The Wellness Journey -- A Patient's Full Arc (Phase 1-3) | Onboarding | Phase walkthrough | Post-Denver |
| 5 | The Interaction Checker -- Safety Before You Begin | Onboarding + Safety | Drug interaction screening | Post-Denver |

> **Denver cut:** Scripts 0, 1, and 3 must be complete and published before April 4 to allow 3 days for QR code printing and integration into the leave-behind PDF.

---

## Production Pipeline -- 5 Phases

### Phase 1 -- Script Writing

Scripts are complete. See `docs/projects/ppn-video-scripts-all.md`.

---

### Phase 2 -- Asset Capture and AI Deconstruction

#### Screenshot Sources
- Existing assets: `public/screenshots/Marketing-Screenshots/webp/` and `public/screenshots/Other-Screenshots/`
- New captures needed: 4 scenes flagged as `[CAPTURE NEEDED]` in the scripts doc -- capture from `ppnportal.net` production

#### AI Deconstruction (Nano Banana 2 / Gemini)
- Clean plate: background without data (for layered compositing)
- Data layer: chart or table only, transparent background
- Highlight mask: active element isolated for glow treatment

---

### Phase 3 -- AI Visual Generation

#### Style Guide (All AI Prompts Must Use)
```
Background:     Deep Black #020408
Primary accent: Clinical Green #53d22d
Warning accent: Amber #f59e0b
Text:           White #ffffff
Aesthetic:      Dark clinical, precision medical, cinematic
Font:           Inter / sans-serif
```

#### Veo B-Roll Prompt Library

| Scene trigger | Veo Prompt |
|---|---|
| Vitals trend | "Cinematic macro of a glowing rose-red cardiac waveform on a deep black background, soft pulse animation, medical precision aesthetic" |
| Global network | "Aerial view of glowing network nodes connecting across a dark globe, Clinical Green #53d22d light trails, smooth zoom out" |
| Compliance / reports | "Overhead shot of a sealed clinical document with a glowing green checkmark embossed, dramatic directional lighting on black" |
| Contraindication alert | "Cinematic macro of a glowing amber warning indicator, soft bokeh background, medical device aesthetic" |
| Session begins | "Time-lapse of a dawn breaking through clinical white curtains, peaceful and scientific" |

---

### Phase 4 -- Post-Production (Descript)

1. Paste narration, apply AI voice, review for mispronunciations
2. Drop in screenshot sequence per scene timestamps
3. Apply glow effects to active UI elements (drop shadow + outer glow, 2-4px, Clinical Green or Amber)
4. Layer in Veo B-roll clips at transitions
5. Add chapter markers (Practitioner / Buyer pivot points)
6. Export: MP4 for YouTube, publish as Descript shareable link

**Quality gate per video:**
- [ ] Narration synced to visuals (no dead air greater than 1.5 seconds)
- [ ] Every UI element mentioned in script is visible on screen when mentioned
- [ ] Glow / callout applied to every callout moment
- [ ] Chapter markers functional in Descript player
- [ ] Runtime: 90-180 seconds per hero video; 240-300 seconds for overview

---

### Phase 5 -- Publishing and QR Distribution

```
Descript Shareable Link (source of truth, easily updated)
        |
YouTube (unlisted) -- CDN for platform embeds
        |
Short.io short link -- one per video, QR code target
        |
QR code on Denver leave-behind PDF (WO-643)
        AND embedded as learnMoreUrl in AdvancedTooltip (WO-600)
```

**QR Code Spec -- Denver:**
- Short link format: ppn.link/platform, ppn.link/cockpit-demo, ppn.link/report-demo
- QR target: Descript shareable link (not YouTube -- cleaner player, no ads)

---

## Related Tickets

| Ticket | Stage | Status | Relationship |
|---|---|---|---|
| WO-600 | 02_TRIAGE | Awaiting script content | learnMoreUrl embed target -- videos slot into tooltip links |
| WO-643 | 02_TRIAGE | Awaiting QR codes | Denver leave-behind PDF -- QR codes from Phase 5 slot in here |
| GO-586 | 00_BACKLOG | Active | Script 0 Platform Overview -- P0 |
| GO-587 | 00_BACKLOG | Active | Script 1 Dosing Cockpit -- P0 |
| GO-588 | 00_BACKLOG | Active | Script 3 Report Suite -- P0 |

---

## Production Checklist

### Pre-Production
- [x] Write all 6 scripts
- [x] Map scripts to available screenshot assets
- [x] Lock style guide hex codes
- [x] Finalize Veo B-roll prompt library
- [ ] Capture 4 missing screenshots (see scripts doc capture list)

### AI Generation
- [ ] Generate clean plates (Nano Banana 2 / Gemini) for key screenshots
- [ ] Generate Veo B-roll clips (3-4 sec each, minimum 2 per script)

### Post-Production (Descript)
- [ ] Apply AI voice, review for mispronunciations
- [ ] Assemble timeline: screenshots per scene timestamp sequence
- [ ] Apply glow effects at every callout moment
- [ ] Place B-roll at transitions
- [ ] Add chapter markers
- [ ] Run Phase 4 quality gate before export

### Publishing and Distribution
- [ ] Publish each video as Descript shareable link
- [ ] Upload to YouTube (unlisted)
- [ ] Create Short.io short links
- [ ] Generate and test-scan QR codes
- [ ] Integrate QR codes into WO-643 Denver leave-behind PDF
- [ ] Wire video URLs into learnMoreUrl fields (WO-600)

---

## Open Questions
- [ ] Does the platform need a /resources page for embedded videos post-Denver?
- [ ] Should Script 2 (Global Benchmark) wait for real network data, or use synthetic counts?

---

## Parked Context

Scripts 0, 1, and 3 are hard-deadline Denver deliverables -- published with QR codes by April 4, 2026 (3 days before PsyCon Denver on April 7). GO-586, GO-587, GO-588 filed in _GROWTH_ORDERS/00_BACKLOG and awaiting MARKETER review. All 6 scripts are complete and approved at `docs/projects/ppn-video-scripts-all.md`. Four screenshots still need to be captured from ppnportal.net before production of Scripts 0, 1, and 3 can begin.
