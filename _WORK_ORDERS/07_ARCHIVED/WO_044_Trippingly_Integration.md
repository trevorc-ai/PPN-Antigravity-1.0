---
work_order_id: WO_044
title: Trippingly Integration - Curated Playlist Library
type: BUILD
category: Strategic Partnership
priority: MEDIUM
status: ASSIGNED
created: 2026-02-15T04:05:00-08:00
requested_by: PPN Admin
assigned_to: BUILDER
assigned_date: 2026-02-15T04:22:09-08:00
estimated_complexity: 7/10
failure_count: 0
depends_on: WO_026
---

# Work Order: Trippingly Integration - Curated Playlist Library

## 🎯 THE GOAL

Integrate Trippingly's curated psychedelic therapy playlist catalog into the Music Logger, enabling practitioners to select from vetted, evidence-based playlists instead of manually pasting URLs.

**Strategic Partnership:** Trippingly is owned by a strategic partner, creating opportunities for data sharing, co-marketing, and revenue sharing.

---

## 📋 FEATURES

### 1. Pre-Loaded Playlist Catalog
- Fetch Trippingly's playlist library via API
- Display curated playlists organized by session phase
- Show metadata: BPM, duration, mood tags, description

### 2. Three-Tier Selection UX
**Option 1: Trippingly Curated (Featured)**
- Dropdown of partner playlists
- Organized by phase: Onset, Peak, Comedown, Integration
- One-click selection

**Option 2: My Saved Playlists**
- Practitioner's personal favorites
- Previously used playlists

**Option 3: Custom URL**
- Text input for Spotify/Apple Music links
- Fallback for non-Trippingly playlists

### 3. Data Sharing (Anonymized)
- Track which playlists are most effective
- Aggregate anonymized usage analytics
- Share insights back to Trippingly (with user consent)

---

## 🗄️ DATABASE SCHEMA

### New Table: `ref_curated_playlists`
```sql
CREATE TABLE ref_curated_playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  source TEXT DEFAULT 'trippingly', -- 'trippingly', 'user', 'ppn'
  trippingly_playlist_id TEXT, -- External ID for API sync
  playlist_url TEXT NOT NULL,
  phase TEXT CHECK (phase IN ('onset', 'peak', 'comedown', 'integration', 'any')),
  avg_bpm INTEGER,
  duration_minutes INTEGER,
  mood_tags TEXT[], -- ['calming', 'uplifting', 'grounding']
  genre TEXT,
  is_verified BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast phase filtering
CREATE INDEX idx_curated_playlists_phase ON ref_curated_playlists(phase);
CREATE INDEX idx_curated_playlists_source ON ref_curated_playlists(source);
```

### Updated Table: `log_music`
```sql
CREATE TABLE log_music (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  curated_playlist_id UUID REFERENCES ref_curated_playlists(id), -- if using curated
  custom_playlist_url TEXT, -- if pasting custom URL
  phase TEXT CHECK (phase IN ('onset', 'peak', 'comedown', 'integration')),
  notes TEXT, -- Optional practitioner notes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint: Must have either curated OR custom, not both
  CONSTRAINT music_source_check CHECK (
    (curated_playlist_id IS NOT NULL AND custom_playlist_url IS NULL) OR
    (curated_playlist_id IS NULL AND custom_playlist_url IS NOT NULL)
  )
);

-- Trigger to increment usage_count
CREATE OR REPLACE FUNCTION increment_playlist_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.curated_playlist_id IS NOT NULL THEN
    UPDATE ref_curated_playlists
    SET usage_count = usage_count + 1
    WHERE id = NEW.curated_playlist_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_music_log_insert
AFTER INSERT ON log_music
FOR EACH ROW
EXECUTE FUNCTION increment_playlist_usage();
```

---

## 🔌 API INTEGRATION

### Trippingly API Endpoints (Hypothetical)

**GET /api/playlists**
- Fetch all curated playlists
- Filter by phase, BPM range, duration

**GET /api/playlists/:id**
- Get detailed metadata for specific playlist

**POST /api/analytics**
- Send anonymized usage data back to Trippingly
- Payload: `{ playlist_id, phase, session_outcome, timestamp }`

### Implementation
```typescript
// services/trippingly.ts
export async function fetchCuratedPlaylists(phase?: string) {
  const response = await fetch(`${TRIPPINGLY_API_URL}/playlists?phase=${phase}`);
  const playlists = await response.json();
  
  // Sync to local database
  await syncPlaylistsToDatabase(playlists);
  
  return playlists;
}

export async function trackPlaylistUsage(playlistId: string, sessionData: any) {
  // Send anonymized analytics to Trippingly
  await fetch(`${TRIPPINGLY_API_URL}/analytics`, {
    method: 'POST',
    body: JSON.stringify({
      playlist_id: playlistId,
      phase: sessionData.phase,
      session_outcome: sessionData.outcome, // anonymized
      timestamp: new Date().toISOString()
    })
  });
}
```

---

## 🎨 UX MOCKUP UPDATE

### Music Logger Component (Updated)

```tsx
<div className="glass-card p-6 space-y-4">
  <h3 className="text-xl font-black text-slate-200">Music Logger</h3>
  
  {/* Tab Selection */}
  <div className="flex gap-2 border-b border-white/10">
    <button className="px-4 py-2 border-b-2 border-primary text-primary">
      Trippingly Curated
    </button>
    <button className="px-4 py-2 text-slate-400 hover:text-slate-200">
      My Playlists
    </button>
    <button className="px-4 py-2 text-slate-400 hover:text-slate-200">
      Custom URL
    </button>
  </div>
  
  {/* Trippingly Curated Tab */}
  <div className="space-y-3">
    <label className="text-sm font-bold text-slate-300">Session Phase</label>
    <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3">
      <option>Onset (Calm, 60 BPM)</option>
      <option>Peak (Journey, 80 BPM)</option>
      <option>Comedown (Grounding, 50 BPM)</option>
    </select>
    
    <label className="text-sm font-bold text-slate-300">Select Playlist</label>
    <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3">
      <option>Gentle Onset - Ambient Soundscapes (45 min)</option>
      <option>Peak Journey - Classical & World (90 min)</option>
      <option>Soft Landing - Calming Music (60 min)</option>
    </select>
    
    <div className="flex items-center gap-2 text-xs text-slate-400">
      <span className="material-symbols-outlined text-sm">verified</span>
      Curated by Trippingly
    </div>
  </div>
  
  <button className="w-full py-3 bg-primary hover:bg-blue-600 text-slate-200 rounded-lg font-bold">
    Add to Session Log
  </button>
</div>
```

---

## 📊 SEED DATA

```sql
-- Sample Trippingly playlists
INSERT INTO ref_curated_playlists (name, description, source, trippingly_playlist_id, playlist_url, phase, avg_bpm, duration_minutes, mood_tags) VALUES
('Gentle Onset', 'Ambient soundscapes for initial dosing', 'trippingly', 'trip_001', 'https://open.spotify.com/playlist/xyz', 'onset', 60, 45, ARRAY['calming', 'ambient']),
('Peak Journey', 'Classical and world music for peak experience', 'trippingly', 'trip_002', 'https://open.spotify.com/playlist/abc', 'peak', 80, 90, ARRAY['uplifting', 'classical']),
('Soft Landing', 'Calming music for comedown phase', 'trippingly', 'trip_003', 'https://open.spotify.com/playlist/def', 'comedown', 50, 60, ARRAY['grounding', 'peaceful']);
```

---

## ✅ ACCEPTANCE CRITERIA

1. **Playlist Catalog:** Fetch and display Trippingly playlists organized by phase
2. **Three-Tier UX:** Curated, Saved, Custom URL options
3. **Database Sync:** Store playlists in `ref_curated_playlists`
4. **Usage Tracking:** Increment `usage_count` when playlist is used
5. **Analytics:** Send anonymized data back to Trippingly (with consent)
6. **RLS:** Ensure proper row-level security on `log_music`

---

## 🧪 TESTING CHECKLIST

- [ ] API integration fetches playlists successfully
- [ ] Playlists display correctly in dropdown
- [ ] Selection saves to `log_music` with correct `curated_playlist_id`
- [ ] Usage count increments correctly
- [ ] Custom URL fallback works
- [ ] Analytics payload sends correctly
- [ ] RLS policies prevent cross-site data leakage

---

## 🚀 ADVANCED FEATURES

### 4. Heart Rate Correlation Chart
**Purpose:** Overlay patient heart rate on music BPM to show correlation

**Implementation:**
```tsx
<div className="glass-card p-6">
  <h4 className="text-lg font-black text-slate-200 mb-4">Heart Rate vs. Music BPM</h4>
  
  <ResponsiveContainer width="100%" height={200}>
    <LineChart data={sessionData}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
      <XAxis 
        dataKey="timestamp" 
        stroke="#94a3b8"
        tick={{ fontSize: 12 }}
      />
      <YAxis 
        stroke="#94a3b8"
        tick={{ fontSize: 12 }}
        label={{ value: 'BPM', angle: -90, position: 'insideLeft' }}
      />
      <Tooltip 
        contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.2)' }}
      />
      <Legend />
      
      {/* Patient Heart Rate */}
      <Line 
        type="monotone" 
        dataKey="heartRate" 
        stroke="#ef4444" 
        strokeWidth={2}
        name="Heart Rate"
        dot={false}
      />
      
      {/* Music BPM */}
      <Line 
        type="stepAfter" 
        dataKey="musicBPM" 
        stroke="#3b82f6" 
        strokeWidth={2}
        name="Music BPM"
        dot={false}
      />
    </LineChart>
  </ResponsiveContainer>
  
  {/* Correlation Indicator */}
  <div className="mt-4 flex items-center gap-2">
    <span className="text-xs text-slate-400">Correlation:</span>
    <span className="text-sm font-black text-clinical-green">
      {correlationScore > 0.7 ? 'Strong' : correlationScore > 0.4 ? 'Moderate' : 'Weak'}
    </span>
    <span className="text-xs text-slate-500">({(correlationScore * 100).toFixed(0)}%)</span>
  </div>
</div>
```

**Database Addition:**
```sql
ALTER TABLE log_music ADD COLUMN hr_bpm_correlation DECIMAL(3,2); -- 0.00-1.00
```

---

### 5. Smart Phase Recommendations
**Purpose:** AI suggests playlists based on patient data and historical outcomes

**Logic:**
```typescript
async function getSmartRecommendations(patientProfile: PatientProfile, phase: string) {
  // Fetch similar patients
  const similarPatients = await db.query(`
    SELECT lm.curated_playlist_id, COUNT(*) as usage_count, AVG(s.outcome_score) as avg_outcome
    FROM log_music lm
    JOIN sessions s ON lm.session_id = s.id
    WHERE s.age_range = $1 
      AND s.primary_indication = $2
      AND lm.phase = $3
    GROUP BY lm.curated_playlist_id
    ORDER BY avg_outcome DESC, usage_count DESC
    LIMIT 3
  `, [patientProfile.ageRange, patientProfile.indication, phase]);
  
  return similarPatients.map(p => ({
    ...p,
    reason: `Patients similar to yours responded well (${p.avg_outcome.toFixed(1)}/10 avg outcome)`
  }));
}
```

**UI Display:**
```tsx
<div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 mb-4">
  <div className="flex items-center gap-2 mb-2">
    <span className="material-symbols-outlined text-indigo-400">psychology</span>
    <span className="text-sm font-black text-indigo-300">Smart Recommendation</span>
  </div>
  <p className="text-sm text-slate-300 mb-2">
    Based on 47 similar patients with {indication}
  </p>
  <div className="space-y-2">
    {recommendations.map(rec => (
      <button 
        key={rec.id}
        className="w-full text-left p-3 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-700"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-200">{rec.name}</span>
          <span className="text-xs text-clinical-green">{rec.avg_outcome}/10 avg</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">{rec.reason}</p>
      </button>
    ))}
  </div>
</div>
```

---

### 6. Community Ratings & Effectiveness
**Purpose:** Practitioners rate playlist effectiveness, see aggregate ratings

**Database Schema:**
```sql
CREATE TABLE playlist_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curated_playlist_id UUID REFERENCES ref_curated_playlists(id),
  user_id UUID REFERENCES auth.users(id),
  session_id UUID REFERENCES sessions(id),
  effectiveness_score INTEGER CHECK (effectiveness_score BETWEEN 1 AND 5),
  helped_with TEXT[], -- ['anxiety_reduction', 'emotional_processing', 'grounding']
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Materialized view for aggregate ratings
CREATE MATERIALIZED VIEW playlist_effectiveness_stats AS
SELECT 
  curated_playlist_id,
  COUNT(*) as total_ratings,
  AVG(effectiveness_score) as avg_rating,
  STDDEV(effectiveness_score) as rating_stddev,
  COUNT(DISTINCT user_id) as unique_practitioners
FROM playlist_ratings
GROUP BY curated_playlist_id;

-- Refresh trigger
CREATE OR REPLACE FUNCTION refresh_playlist_stats()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY playlist_effectiveness_stats;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_playlist_rating
AFTER INSERT OR UPDATE ON playlist_ratings
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_playlist_stats();
```

**UI Display:**
```tsx
<div className="flex items-center gap-2 mt-2">
  {/* Star Rating */}
  <div className="flex items-center gap-1">
    {[1,2,3,4,5].map(star => (
      <span 
        key={star}
        className={`material-symbols-outlined text-sm ${
          star <= avgRating ? 'text-amber-400' : 'text-slate-700'
        }`}
      >
        star
      </span>
    ))}
  </div>
  
  {/* Rating Stats */}
  <span className="text-sm font-black text-slate-200">{avgRating.toFixed(1)}</span>
  <span className="text-xs text-slate-400">({totalRatings} sessions)</span>
  
  {/* Effectiveness Badge */}
  {avgRating >= 4.5 && (
    <span className="px-2 py-0.5 bg-clinical-green/10 text-clinical-green border border-clinical-green/20 rounded-full text-xs font-black">
      Highly Effective
    </span>
  )}
</div>

{/* Post-Session Rating Prompt */}
<div className="glass-card p-4 mt-4">
  <h5 className="text-sm font-black text-slate-200 mb-2">Rate this playlist</h5>
  <p className="text-xs text-slate-400 mb-3">How effective was this music for the session?</p>
  
  <div className="flex gap-2 mb-3">
    {[1,2,3,4,5].map(score => (
      <button
        key={score}
        onClick={() => submitRating(score)}
        className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-sm font-black text-slate-300 hover:text-slate-100"
      >
        {score}
      </button>
    ))}
  </div>
  
  <textarea
    placeholder="Optional notes (e.g., 'Helped with anxiety reduction')"
    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-300"
    rows={2}
  />
</div>
```

---

### 7. Real-Time BPM Visualization
**Purpose:** Live BPM meter showing current song tempo

**Implementation:**
```tsx
<div className="glass-card p-4">
  <div className="flex items-center justify-between mb-2">
    <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Current BPM</span>
    <span className="text-2xl font-black text-primary">{currentBPM}</span>
  </div>
  
  {/* BPM Meter */}
  <div className="relative h-2 bg-slate-900 rounded-full overflow-hidden">
    <div 
      className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300 ${
        currentBPM < 70 ? 'bg-clinical-green' : 
        currentBPM < 100 ? 'bg-amber-500' : 
        'bg-red-500'
      }`}
      style={{ width: `${Math.min((currentBPM / 150) * 100, 100)}%` }}
    />
  </div>
  
  {/* BPM Range Labels */}
  <div className="flex justify-between mt-1 text-xs text-slate-500">
    <span>Calm (&lt;70)</span>
    <span>Moderate (70-100)</span>
    <span>Energetic (&gt;100)</span>
  </div>
  
  {/* Pulse Animation */}
  <div 
    className="mt-3 w-12 h-12 mx-auto rounded-full bg-primary/20 border-2 border-primary"
    style={{
      animation: `pulse ${60 / currentBPM}s ease-in-out infinite`
    }}
  />
</div>
```

---

### 8. Playlist Preview
**Purpose:** 30-second audio preview and full tracklist before selecting

**Implementation:**
```tsx
<button 
  onClick={() => setShowPreview(true)}
  className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300"
>
  <span className="material-symbols-outlined text-sm">play_circle</span>
  Preview Playlist
</button>

{showPreview && (
  <div className="glass-elevated p-4 mt-2 space-y-3">
    {/* Audio Preview */}
    <audio 
      src={playlist.previewUrl} 
      controls 
      className="w-full"
    />
    
    {/* Tracklist */}
    <div className="space-y-2 max-h-40 overflow-y-auto">
      <h5 className="text-xs font-black text-slate-400 uppercase">Tracklist</h5>
      {playlist.tracks.map((track, i) => (
        <div key={i} className="flex items-center justify-between text-xs">
          <span className="text-slate-300">{i + 1}. {track.name}</span>
          <span className="text-slate-500">{track.bpm} BPM</span>
        </div>
      ))}
    </div>
  </div>
)}
```

---

## 🚀 FUTURE ENHANCEMENTS (Phase 2)

1. **Audio-Reactive Visuals:** Sync Session Ambiance (WO_045) with music
2. **Offline Mode:** Cache playlists for offline sessions
3. **Revenue Share:** Affiliate model for Trippingly subscriptions
4. **Multi-Language Support:** Translate playlist descriptions

---

## 📚 DEPENDENCIES

- **WO_026:** Music Metadata Logging (must be completed first)
- **Trippingly API:** Requires API credentials and documentation
- **Legal:** Data sharing agreement with Trippingly

---

## 🎯 PRIORITY

**MEDIUM** - Strategic partnership opportunity, but not blocking MVP launch.

**Recommended Timeline:** Post-MVP (after WO_026 is complete)
