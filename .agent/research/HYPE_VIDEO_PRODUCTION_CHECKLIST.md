# PPN Research Portal — Hype Video Production Checklist
## 3-Layer Approach | February 2026
**Prepared by:** PRODDY  
**Estimated total production time:** 2–4 hours (for a 60–90 second final cut)  
**Target video length:** 60–90 seconds (optimal for demo + social)  
**Target audience:** Practitioners, clinic operators, business partners

---

## PRE-PRODUCTION DECISIONS (Do Before Any Recording)

- [ ] **Decide on video purpose** — Pick ONE primary goal:
  - [ ] Business partner demo (share before a meeting)
  - [ ] Social media hype (LinkedIn, Twitter/X)
  - [ ] Landing page hero video (replace or supplement static images)
  - [ ] All three (slightly different edits of same footage)

- [ ] **Decide on music vibe** — Pick your tone before you record (it affects pacing):
  - [ ] Clinical/Sci-Fi tension (Hans Zimmer-style, Artlist.io or Epidemic Sound)
  - [ ] Confident/Corporate (clean electronic, no vocals)
  - [ ] High Energy (urgent tempo for social)

- [ ] **Pick your screen recording tool:**
  - [ ] **Loom** (easiest, good for narrated version)
  - [ ] **QuickTime** (Mac built-in, no watermark, highest quality)
  - [ ] **ScreenStudio** (Mac app — adds beautiful animations and device frames automatically, highly recommended for a polished look)
  - [ ] **Screen.studio** — same as above

- [ ] **Set browser window to 1440px wide** (Cmd+Option+I → responsive → set to 1440)

- [ ] **Clear browser cache and notifications** (nothing should pop up mid-recording)

- [ ] **Use demo data** (not real patient data — confirm mock data is loaded)

- [ ] **Log in fresh** so the session feels new and clean

---

## LAYER 1: SCREEN RECORDINGS (The Hero Footage)
*These are your highest-value clips. Real UI = real credibility.*

### Setup
- [ ] App running at `http://localhost:3000`
- [ ] Browser fullscreen or 90% zoom (hide bookmarks bar)
- [ ] Dark mode confirmed (your "Clinical Sci-Fi" aesthetic)
- [ ] Mouse cursor hidden or set to a clean style (if using ScreenStudio)
- [ ] Screen recorder armed and tested

---

### Shot List — Capture Each Clip Separately

**CLIP 1 — The Hook (Landing Page → Login)**
- [ ] Start on the landing page hero
- [ ] Slow scroll down through the hero section (show headline + subtitle)
- [ ] Click "Sign In" button
- [ ] Land on Dashboard
- *Duration target: 8–10 seconds*

---

**CLIP 2 — The Command Center (Dashboard)**
- [ ] Dashboard loads — let the metrics cards animate in
- [ ] Slowly pan/scroll down through the page
- [ ] Hover over the Safety Risk Matrix (shows interactivity)
- [ ] Click a Quick Action button
- *Duration target: 8–10 seconds*

---

**CLIP 3 — The Core Value Prop (Wellness Journey)**
- [ ] Navigate to Wellness Journey
- [ ] Show the three phase panels (Preparation, Dosing, Integration)
- [ ] Click to expand Phase 1 panel
- [ ] Click to open a form in the Slide-Out Panel
- [ ] Show the form (structured inputs, no free text)
- [ ] Close the panel
- *Duration target: 12–15 seconds — this is your MONEY SHOT*

---

**CLIP 4 — The Safety Moment (Interaction Checker)**
- [ ] Navigate to Interaction Checker
- [ ] Select a psychedelic (e.g., Psilocybin)
- [ ] Add an interacting medication (e.g., SSRI)
- [ ] Click Check Interactions
- [ ] Watch the results load — severity labels appear
- [ ] Hover over a severity label to trigger the tooltip
- *Duration target: 10–12 seconds — this is your "wow, it actually does something" moment*

---

**CLIP 5 — The Intelligence (Substance Catalog → Monograph)**
- [ ] Navigate to Substance Catalog
- [ ] Show the grid of substances (scan across it)
- [ ] Click on Psilocybin
- [ ] Show the Monograph page loading — scroll through it slowly
- *Duration target: 8 seconds*

---

**CLIP 6 — The Proof (Analytics)**
- [ ] Navigate to Analytics
- [ ] Let the charts animate in
- [ ] Slowly scroll through — show 2–3 visualizations
- [ ] Optionally: navigate to one Deep Dive (e.g., Patient Flow Sankey)
- *Duration target: 8–10 seconds*

---

**CLIP 7 — The Export (Data Export / Clinical Report)**
- [ ] Navigate to Export Center
- [ ] Click Generate Report
- [ ] Show the PDF preview loading
- *Duration target: 5–6 seconds — this is your "they mean business" closer*

---

**CLIP 8 — The Partner Demo Hub (Optional — great for a meta moment)**
- [ ] Navigate to `/demo` or `/partner-demo-hub`
- [ ] Show the full feature grid — "38 Features, 14 Deep Dives, 3 Tiers"
- [ ] Quickly scroll through the categories
- *Duration target: 6–8 seconds*

---

### Recording Tips for Better Footage
- [ ] Move your mouse **slowly and deliberately** — rushed mouse = amateur footage
- [ ] Pause for 1–2 seconds after each click so animations complete
- [ ] Record each clip as its own file (easier to edit)
- [ ] Capture at **2x or Retina resolution** if your Mac supports it
- [ ] Record at least **2 takes of each clip** — pick the better one
- [ ] **No narration during Layer 1 recording** — add voiceover in post if needed

---

## LAYER 2: AI B-ROLL (Google Veo 3.1)
*Atmospheric footage that makes the product feel "real-world."*
*Use these clips as transitions, cutaways, and intros.*

### Setup
- [ ] Access Google Veo 3.1 via VideoFX or Gemini API
- [ ] Keep clips to **8–10 seconds each** (Veo's native sweet spot)
- [ ] Generate each clip at **720p** initially — upscale if you want 4K for hero

---

### Prompt Checklist — Generate These Clips

**VEO CLIP A — The Practitioner (Opening or Transition)**
```
Prompt: A focused clinician in a modern, minimal clinic setting sits at a well-lit desk, reviewing data on a dark-themed monitor. Soft blue ambient lighting. Calm, intentional body language. No text visible on screen. Cinematic, slow push-in camera move. 4K, photorealistic, 8 seconds.
```
- [ ] Generated and reviewed

---

**VEO CLIP B — The Clinic Space (Context Shot)**
```
Prompt: A serene, modern therapy room with soft warm lighting, a comfortable reclining chair, and calming abstract art on the wall. A tablet or device visible on a minimal side table. No people. Slow cinematic dolly shot moving through the room. 8 seconds.
```
- [ ] Generated and reviewed

---

**VEO CLIP C — The Data Network (Abstract "Intelligence" Shot)**
```
Prompt: Abstract visualization of glowing data nodes connecting across a dark navy background, forming a network constellation. Smooth, slow animation. No text. Futuristic but clinical. Deep blue and white color palette. 8–10 seconds.
```
- [ ] Generated and reviewed

---

**VEO CLIP D — The Science (Molecular/Chemical Abstract)**
```
Prompt: Close-up macro shot of abstract molecular structures slowly rotating in dark space. Soft indigo and teal bioluminescent glow. No labels or text. Cinematic depth of field. 8 seconds.
```
- [ ] Generated and reviewed

---

**VEO CLIP E — The Human Moment (Optional Emotional Beat)**
```
Prompt: A person sitting in a sunlit chair, eyes closed, expression of calm and resolution. No clinical equipment visible. Warm natural light. Slow motion, shallow depth of field. 6 seconds.
```
- [ ] Generated and reviewed

---

### Veo Tips
- [ ] If a clip doesn't work in 1 try, adjust one detail in the prompt and regenerate — don't rewrite the whole thing
- [ ] Save every generated clip — even "failed" ones sometimes have useful frames
- [ ] Veo's camera language works best when you name the shot type (dolly, push-in, static, etc.)

---

## LAYER 3: NARRATIVE ARC OPTIONS (Choose One)

*Pick your story before you start editing to know which clips to prioritize.*

### Option A — "The Problem / The Solution" (Recommended for Business Partners)
```
Structure:
[VEO B-roll: Clinic atmosphere]
→ [Screen: Dashboard — the command center]
→ [Screen: Wellness Journey — the workflow]
→ [Screen: Interaction Checker — the safety net]
→ [Screen: Analytics — the intelligence]
→ [Screen: Export — the proof]
→ [VEO: Data network abstract]

Voiceover Theme: "Psychedelic therapy is advancing faster than the tools to document it. PPN Research Portal changes that."
```

### Option B — "A Day in the Life" (Best for Social / Emotional Appeal)
```
Structure:
[VEO: Practitioner arriving at clinic]
→ [VEO: Therapy room]
→ [Screen: Interaction Checker — quick check]
→ [Screen: Wellness Journey — logging the session]
→ [VEO: Human moment — patient calm]
→ [Screen: Analytics — reviewing outcomes]
→ [Screen: Export — sending the report]

Voiceover Theme: "For practitioners who take their work as seriously as their patients do."
```

### Option C — "The Feature Flythrough" (Best for Demo / Partner Intro)
```
Structure:
[Screen: Partner Demo Hub — "38 Features"]
→ [Screen: Wellness Journey]
→ [Screen: Interaction Checker]
→ [Screen: Substance Catalog]
→ [Screen: Analytics Deep Dive]
→ [Screen: Export Center]
→ [VEO: Network constellation]

No voiceover — text cards only. Fast cuts. Music-forward.
```

---

## POST-PRODUCTION CHECKLIST

### Editing
- [ ] **Tool selected:**
  - [ ] iMovie (free, sufficient for basic cut)
  - [ ] DaVinci Resolve (free, professional quality — recommended)
  - [ ] CapCut (fast, great for social formats)
  - [ ] Final Cut Pro (if you have it)

- [ ] Layer your clips in order: B-roll intro → screen recordings → B-roll transitions → screen closer
- [ ] Add **cross-dissolve transitions** (0.5–1 second) between clips
- [ ] Add **music track** (set at -12dB so it doesn't overpower)
- [ ] Add **text cards** for key feature names (use white text, dark semi-transparent pill background — matches your brand)
- [ ] Add **fade to black** at the end with logo + tagline

### Text Cards to Include
- [ ] `"Clinical Intelligence for Psychedelic Therapy Practitioners"`
- [ ] `"Wellness Journey — Complete Arc of Care Tracking"`
- [ ] `"Drug Interaction Checker — Built-in Safety Screening"`
- [ ] `"Network Benchmarking — Powered by De-identified Data"`
- [ ] `"Zero PHI. Audit-Ready. Evidence-Grade."`
- [ ] `"ppnportal.com"` (or your live URL)

### Final Quality Check
- [ ] Watch the full video without sound — does the visual story make sense?
- [ ] Watch with sound only — does the music/VO fit the pace?
- [ ] Watch at 0.5x speed — are there any UI glitches or embarrassing moments?
- [ ] Watch on your phone — is text readable at mobile size?
- [ ] Total runtime is under 90 seconds?

### Export Settings
- [ ] **Resolution:** 1920×1080 minimum (export at 2x/4K if source allows)
- [ ] **Format:** MP4, H.264 codec (universal compatibility)
- [ ] **For web/landing page:** MP4 + WebM (for browser autoplay)
- [ ] **For LinkedIn:** Under 5GB, MP4, square or 16:9
- [ ] **For Twitter/X:** Under 2 minutes 20 seconds, MP4

---

## NICE-TO-HAVE (If Time Allows)

- [ ] **30-second cut** — Edit down to 30 seconds for paid/social ads
- [ ] **Silent version** — Export without music (for accessibility, LinkedIn autoplay)
- [ ] **Captioned version** — Add captions for accessibility (required for some platforms)
- [ ] **Landscape + Square + Vertical** — Three aspect ratio exports for different platforms

---

## FILE ORGANIZATION

```
/Video Production/
├── Layer 1 — Screen Recordings/
│   ├── clip1_landing_login.mov
│   ├── clip2_dashboard.mov
│   ├── clip3_wellness_journey.mov   ← PRIORITY
│   ├── clip4_interaction_checker.mov ← PRIORITY
│   ├── clip5_substance_catalog.mov
│   ├── clip6_analytics.mov
│   ├── clip7_export.mov
│   └── clip8_demo_hub.mov (optional)
├── Layer 2 — AI B-Roll/
│   ├── veo_a_practitioner.mp4
│   ├── veo_b_clinic_space.mp4
│   ├── veo_c_data_network.mp4
│   ├── veo_d_molecular.mp4
│   └── veo_e_human_moment.mp4 (optional)
├── Music/
│   └── track_name.mp3
└── Exports/
    ├── ppn_hype_video_v1_90sec.mp4
    ├── ppn_hype_video_v1_30sec.mp4
    └── ppn_hype_video_v1_square.mp4
```

---

*Prepared by PRODDY | PPN DreamTeam | February 2026*  
*File: `.agent/research/HYPE_VIDEO_PRODUCTION_CHECKLIST.md`*

==== PRODDY ====
