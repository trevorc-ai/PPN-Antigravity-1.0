---
work_order_id: WO_045
title: Session Ambiance Display - Animated Light Visualizations
type: BUILD
category: Session Experience
priority: MEDIUM
status: ASSIGNED
created: 2026-02-15T04:13:00-08:00
requested_by: PPN Admin
assigned_to: BUILDER
assigned_date: 2026-02-15T04:22:09-08:00
estimated_complexity: 6/10
failure_count: 0
depends_on: WO_026
---

# Work Order: Session Ambiance Display - Animated Light Visualizations

## 🎯 THE GOAL

Create a full-screen, distraction-free ambient visualization display for therapy sessions using 20 animated light trail patterns. Designed for practitioners to display during sessions to provide calming visual feedback and reduce patient anxiety.

**Source Material:** `public/166yhcigxevf1.mp4` (20 unique animated light patterns)

---

## 📋 FEATURES

### 1. Full-Screen Ambient Mode
- **Pure black background** (#000000) - zero distractions
- **Full-screen toggle** (F11 or button)
- **No UI elements** visible during session
- **Escape key** to exit
- **Mouse auto-hide** after 3 seconds of inactivity

### 2. 20 Unique Visual Patterns
Extract and implement all 20 animated light trail patterns from the video:
- Gentle spirals (calming)
- Complex orbits (journey)
- Radial bursts (breakthrough)
- Settling patterns (integration)
- Infinity loops
- Circular flows
- Cross patterns
- Petal formations

### 3. BPM-Reactive Animation
- Sync animation speed to music BPM
- Faster BPM = faster particle movement
- Color intensity shifts with tempo
- Smooth transitions between speeds

### 4. Session Phase Mapping
**Auto-select visual based on session phase:**
- **Onset:** Gentle spirals, slow orbits (calming)
- **Peak:** Complex patterns, radial bursts (journey)
- **Comedown:** Settling patterns, soft flows (grounding)
- **Integration:** Circular patterns, infinity loops (closure)

### 5. Manual Controls (Hidden)
- **Hover bottom edge** → Control bar appears
- **Pattern selector** (1-20)
- **Speed slider** (0.5x - 2x)
- **Color scheme** (warm/cool/neutral)
- **Intensity** (0-100%)

---

## 🎨 DESIGN SPECIFICATIONS

### Visual Characteristics
- **Colors:** Blue (#3b82f6) and Orange (#f59e0b) gradients
- **Glow effect:** Soft bloom around particles
- **Particle trails:** Smooth, continuous motion
- **Background:** Pure black (#000000)
- **No text, no UI** during session

### Animation Properties
```css
.ambiance-container {
  position: fixed;
  inset: 0;
  background: #000000;
  z-index: 9999;
  cursor: none; /* Hide cursor after 3s */
}

.light-particle {
  filter: blur(2px) brightness(1.5);
  mix-blend-mode: screen;
  animation: particle-trail 3s ease-in-out infinite;
}

@keyframes particle-trail {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}
```

### Responsive Behavior
- **Desktop:** Full 1920x1080 canvas
- **Tablet:** Scale to fit screen
- **Mobile:** Disable (not practical for sessions)

---

## 🗄️ DATABASE SCHEMA

### New Table: `log_session_ambiance`
```sql
CREATE TABLE log_session_ambiance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  visual_pattern TEXT, -- 'spiral_calm', 'orbit_complex', etc.
  bpm INTEGER, -- Synced music BPM
  duration_seconds INTEGER,
  phase TEXT CHECK (phase IN ('onset', 'peak', 'comedown', 'integration')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Reference Table: `ref_visual_patterns`
```sql
CREATE TABLE ref_visual_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  recommended_phase TEXT,
  recommended_bpm_range INT4RANGE, -- e.g., '[40,70]'
  video_asset_path TEXT, -- Path to animation file
  thumbnail_path TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO ref_visual_patterns (name, description, recommended_phase, recommended_bpm_range, video_asset_path) VALUES
('Spiral Calm', 'Gentle spiral pattern for onset', 'onset', '[40,70]', '/visuals/spiral_calm.mp4'),
('Orbit Complex', 'Complex orbital pattern for peak', 'peak', '[70,100]', '/visuals/orbit_complex.mp4'),
('Radial Burst', 'Radial burst for breakthrough moments', 'peak', '[80,120]', '/visuals/radial_burst.mp4'),
('Settling Flow', 'Calming flow for comedown', 'comedown', '[40,60]', '/visuals/settling_flow.mp4');
```

---

## 🔌 COMPONENT STRUCTURE

### Main Component: `SessionAmbiance.tsx`
```tsx
import { useState, useEffect } from 'react';

interface SessionAmbianceProps {
  sessionId: string;
  phase: 'onset' | 'peak' | 'comedown' | 'integration';
  bpm?: number;
  autoSelect?: boolean; // Auto-select visual based on phase
}

export function SessionAmbiance({ sessionId, phase, bpm = 60, autoSelect = true }: SessionAmbianceProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<string>('spiral_calm');
  const [showControls, setShowControls] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Auto-hide cursor after 3s
  useEffect(() => {
    const timer = setTimeout(() => setCursorVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-select pattern based on phase
  useEffect(() => {
    if (autoSelect) {
      const patternMap = {
        onset: 'spiral_calm',
        peak: 'orbit_complex',
        comedown: 'settling_flow',
        integration: 'infinity_loop'
      };
      setSelectedPattern(patternMap[phase]);
    }
  }, [phase, autoSelect]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black z-50"
      style={{ cursor: cursorVisible ? 'default' : 'none' }}
      onMouseMove={() => setCursorVisible(true)}
    >
      {/* Animated Light Pattern */}
      <AnimatedLightPattern 
        pattern={selectedPattern}
        bpm={bpm}
      />

      {/* Hidden Controls (appear on hover) */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-20 opacity-0 hover:opacity-100 transition-opacity duration-300"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {showControls && (
          <div className="glass-card p-4 m-4 flex items-center gap-4">
            <select 
              value={selectedPattern}
              onChange={(e) => setSelectedPattern(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
            >
              <option value="spiral_calm">Spiral Calm</option>
              <option value="orbit_complex">Orbit Complex</option>
              <option value="radial_burst">Radial Burst</option>
              {/* ... all 20 patterns */}
            </select>
            
            <button 
              onClick={toggleFullscreen}
              className="px-4 py-2 bg-primary hover:bg-blue-600 text-slate-200 rounded-lg"
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
          </div>
        )}
      </div>

      {/* Escape hint (fades after 5s) */}
      <div className="absolute top-4 right-4 text-slate-500 text-xs animate-fade-out">
        Press ESC to exit
      </div>
    </div>
  );
}
```

### Animation Component: `AnimatedLightPattern.tsx`
```tsx
interface AnimatedLightPatternProps {
  pattern: string;
  bpm: number;
}

export function AnimatedLightPattern({ pattern, bpm }: AnimatedLightPatternProps) {
  // Calculate animation speed based on BPM
  const animationDuration = 60 / bpm; // seconds per beat

  return (
    <div className="w-full h-full flex items-center justify-center">
      <video
        src={`/visuals/${pattern}.mp4`}
        autoPlay
        loop
        muted
        className="w-full h-full object-contain"
        style={{
          filter: 'brightness(1.2) contrast(1.1)',
          animationDuration: `${animationDuration}s`
        }}
      />
    </div>
  );
}
```

---

## ✅ ACCEPTANCE CRITERIA

1. **Full-screen mode** works on all browsers
2. **20 unique patterns** extracted from source video
3. **BPM sync** adjusts animation speed correctly
4. **Auto-select** chooses appropriate visual for session phase
5. **Hidden controls** appear on bottom hover
6. **Cursor auto-hide** after 3 seconds
7. **Escape key** exits full-screen
8. **Pure black background** (#000000)
9. **No UI elements** visible during session
10. **Session logging** tracks which visual was used

---

## 🧪 TESTING CHECKLIST

- [ ] Full-screen toggle works (F11 and button)
- [ ] All 20 patterns load and animate correctly
- [ ] BPM sync changes animation speed
- [ ] Auto-select chooses correct pattern for each phase
- [ ] Controls appear on bottom hover
- [ ] Cursor hides after 3 seconds
- [ ] Escape key exits full-screen
- [ ] No visual glitches or stuttering
- [ ] Works on Chrome, Firefox, Safari
- [ ] Session logs save correctly

---

## 🎯 PRIORITY

**MEDIUM** - Enhances session experience but not blocking MVP.

**Recommended Timeline:** Post-MVP (after core session logging is complete)

---

## 📚 ASSETS NEEDED

1. **Extract 20 patterns** from `public/166yhcigxevf1.mp4`
2. **Create individual video files** for each pattern
3. **Generate thumbnails** for pattern selector
4. **Optimize file sizes** (WebM format, <500KB each)

---

## 🚀 FUTURE ENHANCEMENTS

1. **Audio-reactive mode:** Sync to live microphone input
2. **Custom patterns:** Allow practitioners to upload their own
3. **Playlist integration:** Auto-sync with Trippingly playlists
4. **Multi-monitor support:** Display on second screen
5. **VR mode:** Immersive 360° visualizations
