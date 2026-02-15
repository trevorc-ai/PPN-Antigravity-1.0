---
work_order_id: WO_026
title: Implement Audio-Analgesia Metadata Logging
type: FEATURE
category: Feature
priority: LOW
status: INBOX
created: 2026-02-14T23:41:45-08:00
requested_by: Trevor Calton
assigned_to: BUILDER
estimated_complexity: 5/10
failure_count: 0
owner: BUILDER
status: 03_BUILD
---

# Work Order: Implement Audio-Analgesia Metadata Logging

## 🎯 THE GOAL

Track the musical context of a session to correlate "Set & Setting" with outcomes.

### PRE-FLIGHT CHECK

- Check for existing Spotify/Apple Music SDK keys in env

### Directives

1. **UI:** Add a "Music Context" field to the Active Session logger
   - Option A: Manual Link Paste (MVP)
   - Option B: "Now Playing" detection (Stretch)

2. **Logic:** Extract metadata (BPM, Key, Genre) if possible, or just store the Playlist ID

3. **Correlation:** In the Analytics view, overlay the "Playlist Phase" (e.g., Peak vs. Comedown) against the "Heart Rate" or "Intervention" graph

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

- `src/components/session/MusicLogger.tsx` (New)
- `src/types/session.ts`

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Auto-play music
- Store copyrighted audio files

**MUST:**
- Passive logging only
- Store only metadata/links

---

## ✅ Acceptance Criteria

### Pre-Flight Verification
- [ ] Check for Spotify/Apple Music SDK keys in env

### UI Implementation
- [ ] "Music Context" field added to Active Session logger
- [ ] Manual link paste (MVP)
- [ ] "Now Playing" detection (Stretch)

### Metadata Extraction
- [ ] Extract BPM, Key, Genre (if possible)
- [ ] Store Playlist ID
- [ ] No audio file storage

### Analytics Correlation
- [ ] Overlay "Playlist Phase" on Analytics view
- [ ] Correlate with Heart Rate graph
- [ ] Correlate with Intervention graph

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- **Ensure controls are labeled**

---

## 🚦 Status

**INBOX** - Awaiting LEAD architectural review

---

## Dependencies

- Spotify/Apple Music SDK (optional for metadata extraction)

## LEAD ARCHITECTURE

**Technical Strategy:**
Create music context logging to correlate "Set & Setting" with session outcomes.

**Files to Touch:**
- `src/components/session/MusicLogger.tsx` - NEW: Music context field
- `src/types/session.ts` - Add music metadata types
- `src/pages/Analytics.tsx` - Add playlist phase overlay

**Constraints:**
- MUST NOT auto-play music
- MUST NOT store copyrighted audio files
- Passive logging ONLY
- Store metadata/links only

**Recommended Approach:**
1. Add "Music Context" field to Active Session logger
2. MVP: Manual link paste (Spotify/Apple Music URL)
3. Extract metadata (BPM, Key, Genre) if possible
4. Store Playlist ID in session log
5. Stretch: "Now Playing" detection via SDK
6. Analytics: Overlay "Playlist Phase" on Heart Rate/Intervention graphs

**Risk Mitigation:**
- No audio file storage (copyright)
- Passive logging only (no playback)
- Clear labeling for accessibility
