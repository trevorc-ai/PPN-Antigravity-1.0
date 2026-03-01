---
name: google-ai-prompting
description: >
  Advanced prompt engineering skill for the full Google AI product suite.
  Covers NotebookLM (slides, audio overview, study guides), Google Flow
  (AI filmmaking, Scenebuilder, storyboards), Veo 2/3 (text-to-video,
  image-to-video), Google AI Studio / Gemini (system prompts, structured
  output), and Imagen (image generation). Use this skill whenever
  generating prompts for materials to be built outside of Antigravity.
---

# Google AI Prompting — Advanced Skill Guide

This skill defines exact prompt patterns, required elements, and quality
rules for each Google AI product. Read the relevant section before writing
any prompt. All prompts produced using this skill should be ready to
copy-paste directly into the target product with no editing required.

---

## 🔵 PRODUCT 1: NotebookLM

### What NotebookLM Does
NotebookLM is a source-grounded AI research and creation tool. Every
response is anchored to user-uploaded sources (PDFs, Docs, URLs, YouTube).
It will NOT hallucinate facts beyond those sources — this is the core
safety feature.

### Output Types Available
| Output | Description |
|---|---|
| **Presentation Slides** | Structured slide deck (exportable as .pptx). Choose detailed or presenter-only. |
| **Audio Overview** | Podcast-style Deep Dive, Brief, Critique, or Debate between two AI hosts |
| **Study Guide** | FAQ, key concepts, timeline |
| **Mind Map** | Visual concept map from sources |
| **Briefing Doc** | Narrative summary with citations |
| **Custom Chat** | Open-ended Q&A grounded in sources |

### Prompt Formula for Presentations
```
You are a [ROLE, e.g. "senior partner at a strategy consulting firm"].

Using ONLY the uploaded sources, create a [LENGTH, e.g. "15-slide"] 
presentation for [AUDIENCE, e.g. "a group of founding partners at a 
healthcare startup"] with the following structure:

Slide 1: [Title slide description]
Slide 2: [Executive summary / hook]
Slide 3–N: [Section names and what each should cover]
Final slide: [Call-to-action or next steps]

Tone: [e.g. "authoritative but accessible, no jargon"]
Format: [e.g. "presenter slides with short bullet points only, no paragraphs"]
Constraint: [e.g. "Do not include any statistics not present in the source documents"]
```

### Prompt Formula for Audio Overviews
```
Create a [FORMAT: Deep Dive / Brief / Critique / Debate] audio overview 
on the topic of [SPECIFIC TOPIC] from the uploaded sources.

Audience: [e.g. "potential investor with no healthcare background"]
Length: [e.g. "approximately 8 minutes"]
Focus: [e.g. "emphasize the competitive moat and revenue model"]
Tone: [e.g. "conversational but credible — not academic"]
Avoid: [e.g. "do not discuss [X topic] — it is out of scope for this audience"]
```

### NotebookLM Quality Rules
- Upload the source document FIRST — prompts without sources use web data
- Be explicit about audience: NotebookLM will match the complexity level
- Use role assignment ("You are a...") — it significantly improves output quality
- For slides: specify exact slide count and name each section explicitly
- For audio: choose format type explicitly (Deep Dive ≠ Brief ≠ Critique)
- Individual slide revision: click a slide → type a specific revision prompt

---

## 🔴 PRODUCT 2: Google Veo (2 / 3 / 3.1)

### What Veo Does
Veo generates short video clips (4–8 seconds, 720p–4K) from text or image
prompts. Veo 3 and above also generate synchronized audio (dialogue, SFX,
ambient). Each clip is independent — plan for post-assembly in Flow or an
editor.

### The 6-Element Prompt Formula (ALWAYS USE ALL 6)
```
[SUBJECT]: [Who or what is the focus — be very specific]
[ACTION]: [What the subject is doing — use active, strong verbs]
[SETTING]: [Environment, location, time of day, lighting condition]
[STYLE]: [Visual aesthetic, color palette, era, genre reference]
[CAMERA]: [Shot type + camera angle + camera movement]
[AUDIO (Veo 3+ only)]: [Ambient sound, SFX, dialogue, music mood]
```

### Shot Type Reference (Always Specify One)
| Shot Type | Use For |
|---|---|
| Wide Shot (WS) | Establishing scene, showing environment scale |
| Medium Shot (MS) | Conversation, body language |
| Close-Up (CU) | Emotion, detail, tension |
| Extreme Close-Up (ECU) | Single detail — eye, hand, object texture |
| Over-the-Shoulder (OTS) | POV reference, conversation |
| Bird's-Eye View | Scale, geography, surveillance feel |

### Camera Movement Reference (Always Specify One)
| Movement | Effect |
|---|---|
| Dolly in/out | Intimacy / reveal |
| Tracking shot | Follows subject — energy and momentum |
| Pan | Reveals environment laterally |
| Steadicam | Smooth, cinematic follow |
| Handheld | Documentary, urgency, realism |
| Static | Stillness, tension, formality |

### Example Veo Prompt (Product Demo Style)
```
A sleek, modern medical tablet displaying a real-time cardiac monitoring 
dashboard with glowing teal waveforms. The device sits on a stainless 
steel tray in a softly lit clinical room. Close-up shot, camera slowly 
dollying in toward the screen. Cinematic style, desaturated blues and 
teals, shallow focus, shallow depth of field. Ambient sound: quiet 
hospital beep, subtle electronic hum.
```

### Veo Quality Rules
- Keep action descriptions to one natural motion per clip (<30 words for action)
- Re-state character wardrobe and physical traits in every clip (no memory between clips)
- Use negative prompts as a comma-separated list at the end: `Negative: walls, clutter, text overlays`
- Aspect ratio: always specify `16:9` (landscape) or `9:16` (portrait/mobile)
- For dialogue: write exact spoken words in quotes within the audio element

---

## 🟢 PRODUCT 3: Google Flow

### What Flow Does
Flow is the AI filmmaking studio that orchestrates Veo + Imagen + Gemini
into a coherent narrative. It has:
- **Text to Video** — simple single-clip generation
- **Frames to Video** — guided motion between defined start/end states
- **Ingredients to Video** — upload reference images for character/object consistency
- **Scenebuilder** — storyboard assembler, clip sequencer, transition editor
- **Jump To** — seamless location change preserving character appearance
- **Extend** — continues existing clip action

### Storyboard Prompt Formula (Scene-by-Scene)
For each scene, provide a structured brief in this format:
```
SCENE [N]: [Scene title]
DURATION: [e.g. "6 seconds"]
CLIP MODE: [Text to Video / Frames to Video / Ingredients to Video]

VEO PROMPT:
[Full 6-element Veo prompt as defined above]

CONTINUITY NOTES:
- Character: [Repeat exact wardrobe, hair, physical traits]
- Props: [List key props to preserve]
- Color grade: [Consistent palette reference]

TRANSITION TO NEXT SCENE: [Cut / Dissolve / Jump To / Extend]
```

### Full Storyboard Document Structure
```
PROJECT: [Name]
TONE: [e.g. "clinical authority, warm, modern"]
COLOR PALETTE: [e.g. "deep navy, teal, warm white — never red or harsh contrasts"]
MUSIC MOOD: [e.g. "understated ambient electronic, no percussion"]

SCENE 1: ...
SCENE 2: ...
[Repeat for all scenes]

ASSEMBLY NOTES:
- Total target length: [e.g. "90 seconds"]
- Export format: [16:9 MP4 for web / 9:16 for social]
- Text overlays: [Yes/No — if yes, describe placement and font style]
```

### Flow Quality Rules
- Plan in clips: 8–15 clips for a 60–90 second video
- Ingredients to Video = best for brand consistency (upload logo, product, character)
- Use Gemini within Flow to expand prompt ideas before generating
- Extend before generating new clip — extend is far more consistent than regenerating

---

## 🟡 PRODUCT 4: Google AI Studio / Gemini

### What AI Studio Is
Google AI Studio is the direct API interface to all Gemini model variants
(Flash, Pro, 2.5 Pro, etc.). Use for: complex document generation,
structured data output, system-role-based content creation, multi-turn
dialogue scripting.

### System Prompt Formula (The GOLDEN Structure)
```
G — GOAL: [One sentence: what this session produces]
O — OUTPUT: [Exact format: JSON / markdown / numbered list / prose]
L — LIMITS: [Word count, forbidden topics, tone constraints]
D — DATA: [Reference documents, context, definitions to use]
E — EVALUATION: [How to judge a good response — give an example if possible]
N — NEXT: [What happens after — helps model understand the downstream use]
```

### Example AI Studio System Prompt (Presentation Content)
```
GOAL: Generate a 20-slide partner presentation for a healthcare SaaS startup 
focused on psychedelic therapy documentation.

OUTPUT: A numbered markdown document. Each slide labeled SLIDE [N]: [TITLE] 
followed by 3–5 bullet points. Each bullet ≤ 15 words. Speaker notes section 
after bullets in italics.

LIMITS: No medical statistics not explicitly stated in the context. No 
mention of specific drug brand names. Tone: authoritative, data-driven, 
optimistic but grounded. No hyperbole.

DATA: [Paste the strategy document / source content here]

EVALUATION: A good slide has one clear idea, a measurable claim or vivid 
analogy, and speaker notes that give the presenter confidence without 
reading off the slide verbatim.

NEXT: This output will be uploaded to NotebookLM to generate a presentation 
deck and audio overview series.
```

### Temperature Guide for AI Studio
| Task | Temperature Setting |
|---|---|
| Structured output (JSON, tables) | 0.2–0.4 |
| Business writing, presentations | 0.4–0.6 |
| Marketing copy, landing pages | 0.6–0.8 |
| Creative video scripts, storytelling | 0.7–0.9 |

### AI Studio Quality Rules
- Always set a system role — never start with a blank system instruction
- Use XML-style delimiters for long prompts: `<context>`, `<instructions>`, `<output_format>`
- For structured output: enable the "Structured output" toggle in the right panel
- Few-shot examples dramatically improve output — include 1–2 before the task
- Validate output is factually grounded before use — AI Studio has broader web access than NotebookLM

---

## 🟣 PRODUCT 5: Imagen (via AI Studio or Vertex AI)

### What Imagen Does
Imagen generates high-quality still images from text prompts. Use for:
product mockups, brand imagery, presentation hero images, social media
visuals, landing page hero graphics.

### Imagen Prompt Formula
```
[SUBJECT]: [Detailed description of the main visual element]
[STYLE]: [Photography / illustration / 3D render / etc.]
[LIGHTING]: [e.g. "soft studio lighting, warm key light from left"]
[COMPOSITION]: [e.g. "centered, rule of thirds, negative space on right"]
[MOOD]: [e.g. "clinical authority, clean, trustworthy, modern"]
[PALETTE]: [e.g. "deep navy and teal, minimal color, no red"]
[DETAIL LEVEL]: [e.g. "photorealistic, 4K, macro detail"]
[AVOID]: [e.g. "no text, no people, no generic stock-photo feel"]
```

### Imagen Quality Rules
- Shorter prompts often produce cleaner results — try 30–50 words first
- "Photorealistic" vs "illustration" is the single highest-impact style choice
- For UI mockups: describe the device + screen content + environment separately
- Always specify what NOT to include — Imagen responds well to exclusions

---

## 🏗 CROSS-PRODUCT WORKFLOW: Strategy Doc → Full Media Package

For campaigns like PPN Portal (partner presentation + promo video + landing
page imagery), use this production pipeline:

```
STEP 1: AI Studio
→ Generate master content document (strategy, slide copy, landing page copy)
→ Temperature: 0.5
→ Output: structured markdown with labeled sections

STEP 2: NotebookLM
→ Upload master content doc as source
→ Generate: Presentation slides (partner meeting)
→ Generate: Audio overview — Deep Dive (for team alignment)
→ Generate: Briefing doc (for one-page executive summary)

STEP 3: Imagen
→ Generate hero imagery for landing page and presentation
→ Use palette and brand style from PPN Portal design system

STEP 4: Flow / Veo
→ Use master content doc to write scene-by-scene storyboard
→ Generate clips via Flow (Ingredients to Video for brand consistency)
→ Assemble in Scenebuilder
→ Export: 16:9 for web, 9:16 for social
```

---

## PRODDY Usage Rule

When PRODDY is asked to generate prompts for external Google AI tools:
1. Read the relevant section(s) of this skill
2. Generate the complete, copy-pasteable prompt — no placeholders
3. Label each prompt with the target product and the exact feature/mode
4. Include a "What to expect" note: what the output should look like
5. If the prompt requires source documents to be uploaded first, say so explicitly

*Skill version: 1.0 — established 2026-03-01 by PRODDY*
