---
status: "06_COMPLETE"
owner: "BUILDER"
failure_count: 0
---
# WO-315: Asymmetric Infinite Alliance Wall (Landing Page Polish)

## User Prompt
"Because you are AI and you are awesome, I'm going to challenge you to really showcase what you can do. You made some great updates to the landing page, but I know you can do even better. If you want real gold for the narrative, check out _Podcast Transcripts... "

## LEAD ARCHITECTURE
The user requested we push the PPN landing page all the way to a "digital masterpiece," drawing inspiration from high-end web development tutorials utilizing Framer Motion, 60fps physics, and infinite scroll masking. In combination with the new Podcast Transcripts, the directive is to build an animated, highly engaging "Alliance Wall."

**Objective**: 
Implement the "Asymmetric Infinite Alliance Wall"—a 3-column, glassmorphism quote container powered by Framer Motion. This acts as profound social proof and story-telling directly from practitioners about the "bottleneck of the delivery system" and the need to "make the miraculous boring enough to be scalable."

**Technical Approach**:
1. **Framer Motion Engine**: Create `src/components/landing/AllianceWall.tsx`. Connect `framer-motion` for `translateY` animations looping infinitely via `repeat: Infinity, ease: 'linear'`.
2. **Reverse Async Scrolling**: Column 1 & 3 will scroll upwards slowly. Column 2 will scroll downwards.
3. **Linear Masking**: Wrap all 3 columns in a relative container with `mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)` to elegantly fade the cards into the background without jarring cuts.
4. **Copy & Narrative**: Seed the arrays with powerful direct quotes from the Voice of the Customer / Podcast transcript highlighting "the click-clack of the keyboard," "the background radiation of the industry," and "CPT code optimization."
5. **Integration**: Plumb this `<AllianceWall />` into `src/pages/Landing.tsx` right after the Frankenstein Stack section to provide visceral context to *why* PPN is building this infrastructure. Let's make it look mesmerizing and deeply premium. 
