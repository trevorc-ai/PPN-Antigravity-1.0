# 🎯 Protocol Builder V1 - Complete Implementation Specification

**Status:** APPROVED FOR IMPLEMENTATION  
**Timeline:** 24 hours to demo  
**Target:** Clinical Command Center UI  
**Approved By:** CEO (2026-02-10 02:02 AM)

---

## 📋 **EXECUTIVE SUMMARY**

### **What We're Building:**
A 2-column "Clinical Command Center" interface that reduces protocol creation from 5-7 minutes to 30-60 seconds through:
- Smart auto-fill (network intelligence)
- Live preview panel
- Progressive disclosure
- Glassmorphic design

### **Key Changes Approved:**
1. ✅ Subject Birth Reference → Auto-generated Subject ID
2. ✅ Concomitant Medications → Searchable multi-select dropdown
3. ✅ 5 accordions → 3 glassmorphic cards
4. ✅ Add live preview panel (right side)
5. ✅ Add progress indicator

---

## 🏗️ **ARCHITECTURE OVERVIEW**

### **File Structure:**

```
src/
├── components/
│   ├── ProtocolBuilder/
│   │   ├── ProtocolBuilderModal.tsx (MODIFY - Main container)
│   │   ├── InputPanel.tsx (NEW - Left side)
│   │   ├── PreviewPanel.tsx (NEW - Right side)
│   │   ├── ProgressBar.tsx (NEW - Top indicator)
│   │   ├── Section1_Indication.tsx (NEW - What are you treating?)
│   │   ├── Section2_Treatment.tsx (NEW - Auto-filled treatment)
│   │   ├── Section3_Context.tsx (NEW - Patient context)
│   │   ├── NetworkIntelligence.tsx (NEW - Stats display)
│   │   └── SuccessAnimation.tsx (NEW - Celebration)
│   └── ui/
│       ├── SearchableDropdown.tsx (NEW - Indication selector)
│       └── GlassmorphicCard.tsx (NEW - Reusable card)
├── services/
│   └── protocolIntelligence.ts (NEW - Smart defaults logic)
└── utils/
    └── subjectIdGenerator.ts (NEW - SUBJ-XXXXXXXX)
```

---

## 🎨 **DESIGN TOKENS**

### **Colors (Glassmorphism):**

```typescript
// src/styles/protocolBuilder.ts
export const PROTOCOL_BUILDER_TOKENS = {
  colors: {
    card_bg: 'rgba(45, 36, 56, 0.6)',
    card_border: 'rgba(255, 255, 255, 0.1)',
    card_hover_glow: 'rgba(139, 92, 246, 0.2)',
    
    primary_purple: '#8b5cf6',
    accent_green: '#10b981',
    accent_amber: '#f59e0b',
    accent_red: '#ef4444',
    
    text_primary: '#f8f9fa',
    text_secondary: '#c4b5fd',
    text_muted: 'rgba(255, 255, 255, 0.7)',
  },
  
  spacing: {
    section_gap: '32px',
    field_gap: '16px',
    card_padding: '24px',
    modal_padding: '40px',
    mobile_padding: '20px',
  },
  
  typography: {
    modal_title: {
      fontSize: 'clamp(24px, 3vw, 32px)',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    section_header: {
      fontSize: 'clamp(18px, 2vw, 22px)',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    field_label: {
      fontSize: '13px',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.02em',
    },
    field_value: {
      fontSize: '15px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
  },
  
  animations: {
    card_hover: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    preview_update: '200ms ease-out',
    section_expand: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
    success: '600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  
  shadows: {
    card: '0 8px 32px rgba(0, 0, 0, 0.3)',
    card_hover: '0 12px 48px rgba(139, 92, 246, 0.2)',
    glow: '0 0 20px rgba(139, 92, 246, 0.3)',
  },
};
```

---

## 🔧 **COMPONENT SPECIFICATIONS**

### **1. ProtocolBuilderModal.tsx (MODIFY EXISTING)**

**Purpose:** Main container with 2-column grid layout

**Layout:**

```tsx
// Desktop: 60% input / 40% preview
// Mobile: Single column, stacked

<div className="protocol-builder-modal">
  <ProgressBar progress={completionPercentage} />
  
  <div className="grid-layout">
    <InputPanel 
      onIndicationSelect={handleIndicationSelect}
      protocol={protocol}
      onProtocolChange={handleProtocolChange}
    />
    
    <PreviewPanel 
      protocol={protocol}
      networkStats={networkStats}
      timeSaved={timeSaved}
      onSave={handleSave}
    />
  </div>
  
  {showSuccess && <SuccessAnimation />}
</div>
```

**CSS Grid:**

```css
.protocol-builder-modal {
  display: grid;
  grid-template-rows: auto 1fr;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  gap: 24px;
}

.grid-layout {
  display: grid;
  grid-template-columns: 1.5fr 1fr; /* 60% / 40% */
  gap: 32px;
}

@media (max-width: 768px) {
  .protocol-builder-modal {
    padding: 20px;
  }
  
  .grid-layout {
    grid-template-columns: 1fr;
  }
}
```

**State Management:**

```typescript
interface ProtocolBuilderState {
  // Core data
  indication_id: number | null;
  protocol: {
    subject_id: string; // Auto-generated
    substance_id: number | null;
    route_id: number | null;
    dosage: number | null;
    session_number: number;
    session_date: Date;
    setting_id: number | null;
    prep_hours: number | null;
    integration_hours: number | null;
    support_modality_ids: number[];
    concomitant_med_ids: number[]; // NEW: Array of IDs
    // ... other fields
  };
  
  // UI state
  ui: {
    section2_expanded: boolean;
    section3_expanded: boolean;
    auto_filled: boolean;
    loading: boolean;
    error: string | null;
  };
  
  // Network intelligence
  network: {
    similar_protocols: number;
    remission_rate: number;
    confidence: number;
  };
  
  // Metrics
  metrics: {
    start_time: Date;
    time_saved_seconds: number;
    completion_percentage: number;
  };
}
```

---

### **2. ProgressBar.tsx (NEW)**

**Purpose:** Visual indicator of completion

```tsx
interface ProgressBarProps {
  progress: number; // 0-100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="progress-container" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-label">
        {Math.round(progress)}% Complete
      </div>
      <div className="progress-track">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
```

**CSS:**

```css
.progress-container {
  width: 100%;
}

.progress-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
  text-align: right;
}

.progress-track {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #a78bfa);
  transition: width 300ms ease-out;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
}
```

**Calculation Logic:**

```typescript
const calculateProgress = (protocol: Protocol): number => {
  const requiredFields = [
    'indication_id',
    'substance_id',
    'route_id',
    'session_number',
    'session_date',
  ];
  
  const completed = requiredFields.filter(field => protocol[field] !== null).length;
  return (completed / requiredFields.length) * 100;
};
```

---

### **3. GlassmorphicCard.tsx (NEW - Reusable)**

**Purpose:** Consistent card styling across sections

```tsx
interface GlassmorphicCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({ 
  children, 
  className = '', 
  hoverable = true 
}) => {
  return (
    <div className={`glassmorphic-card ${hoverable ? 'hoverable' : ''} ${className}`}>
      {children}
    </div>
  );
};
```

**CSS:**

```css
.glassmorphic-card {
  background: rgba(45, 36, 56, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.glassmorphic-card.hoverable {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.glassmorphic-card.hoverable:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 48px rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.3);
}
```

---

### **4. Section1_Indication.tsx (NEW)**

**Purpose:** Primary question - "What are you treating?"

```tsx
interface Section1Props {
  onSelect: (indication_id: number) => void;
  selectedId: number | null;
}

export const Section1_Indication: React.FC<Section1Props> = ({ onSelect, selectedId }) => {
  const [indications, setIndications] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchIndications();
  }, []);
  
  const fetchIndications = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('ref_indications')
      .select('*')
      .eq('is_active', true)
      .order('indication_name');
    setIndications(data || []);
    setLoading(false);
  };
  
  return (
    <GlassmorphicCard>
      <div className="section-header">
        <span className="section-number">1️⃣</span>
        <h3>What are you treating?</h3>
      </div>
      
      <SearchableDropdown
        options={indications}
        value={selectedId}
        onChange={onSelect}
        placeholder="🔍 Search conditions..."
        labelKey="indication_name"
        valueKey="indication_id"
        loading={loading}
      />
      
      {selectedId && (
        <div className="selection-confirmation">
          ✓ Selected: {indications.find(i => i.indication_id === selectedId)?.indication_name}
        </div>
      )}
    </GlassmorphicCard>
  );
};
```

---

### **5. Section2_Treatment.tsx (NEW)**

**Purpose:** Auto-filled treatment plan with customize option

```tsx
interface Section2Props {
  protocol: Protocol;
  onChange: (field: string, value: any) => void;
  autoFilled: boolean;
}

export const Section2_Treatment: React.FC<Section2Props> = ({ 
  protocol, 
  onChange, 
  autoFilled 
}) => {
  const [expanded, setExpanded] = useState(false);
  const [substances, setSubstances] = useState([]);
  const [routes, setRoutes] = useState([]);
  
  useEffect(() => {
    fetchReferenceData();
  }, []);
  
  return (
    <GlassmorphicCard>
      <div className="section-header">
        <span className="section-number">2️⃣</span>
        <h3>Treatment Plan</h3>
        {autoFilled && <span className="auto-fill-badge">✨ Auto-filled</span>}
      </div>
      
      {!expanded ? (
        <div className="auto-filled-summary">
          <div className="summary-item">
            <span className="label">Substance:</span>
            <span className="value">{getSubstanceName(protocol.substance_id)}</span>
          </div>
          <div className="summary-item">
            <span className="label">Route:</span>
            <span className="value">{getRouteName(protocol.route_id)}</span>
          </div>
          <div className="summary-item">
            <span className="label">Session:</span>
            <span className="value">{protocol.session_number} (Baseline)</span>
          </div>
          
          <button 
            className="customize-button"
            onClick={() => setExpanded(true)}
          >
            ✏️ Customize
          </button>
        </div>
      ) : (
        <div className="expanded-fields">
          <div className="field-group">
            <label>Substance 🔴</label>
            <select 
              value={protocol.substance_id || ''}
              onChange={(e) => onChange('substance_id', parseInt(e.target.value))}
            >
              <option value="">Select substance...</option>
              {substances.map(s => (
                <option key={s.substance_id} value={s.substance_id}>
                  {s.substance_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="field-group">
            <label>Route 🔴</label>
            <select 
              value={protocol.route_id || ''}
              onChange={(e) => onChange('route_id', parseInt(e.target.value))}
            >
              <option value="">Select route...</option>
              {routes.map(r => (
                <option key={r.route_id} value={r.route_id}>
                  {r.route_name}
                </option>
              ))}
            </select>
          </div>
          
          {/* ... other fields */}
          
          <button 
            className="collapse-button"
            onClick={() => setExpanded(false)}
          >
            ✓ Done Customizing
          </button>
        </div>
      )}
    </GlassmorphicCard>
  );
};
```

---

### **6. PreviewPanel.tsx (NEW)**

**Purpose:** Live preview of protocol being created

```tsx
interface PreviewPanelProps {
  protocol: Protocol;
  networkStats: NetworkStats;
  timeSaved: number;
  onSave: () => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ 
  protocol, 
  networkStats, 
  timeSaved, 
  onSave 
}) => {
  return (
    <div className="preview-panel-sticky">
      <GlassmorphicCard hoverable={false}>
        <h3 className="preview-title">📋 Protocol Preview</h3>
        
        <div className="preview-content">
          <PreviewField 
            label="Subject ID" 
            value={protocol.subject_id} 
            icon="🆔"
          />
          <PreviewField 
            label="Indication" 
            value={getIndicationName(protocol.indication_id)} 
            icon="🎯"
          />
          <PreviewField 
            label="Substance" 
            value={getSubstanceName(protocol.substance_id)} 
            icon="💊"
          />
          <PreviewField 
            label="Route" 
            value={getRouteName(protocol.route_id)} 
            icon="📍"
          />
          <PreviewField 
            label="Session" 
            value={`${protocol.session_number} (Baseline)`} 
            icon="📅"
          />
          <PreviewField 
            label="Date" 
            value={formatDate(protocol.session_date)} 
            icon="🗓️"
          />
        </div>
        
        <NetworkIntelligence stats={networkStats} />
        
        <div className="time-saved-metric">
          <span className="metric-icon">⏱️</span>
          <div>
            <div className="metric-value">{formatTime(timeSaved)}</div>
            <div className="metric-label">Time Saved</div>
          </div>
        </div>
        
        <button 
          className="save-button-primary magnetic-cursor"
          onClick={onSave}
          disabled={!isValid(protocol)}
        >
          ✓ Save Protocol
        </button>
        
        <button 
          className="advanced-mode-button"
          onClick={() => {/* Toggle advanced mode */}}
        >
          ✏️ Advanced Mode
        </button>
      </GlassmorphicCard>
    </div>
  );
};
```

**CSS (Sticky Positioning):**

```css
.preview-panel-sticky {
  position: sticky;
  top: 40px;
  height: fit-content;
}

@media (max-width: 768px) {
  .preview-panel-sticky {
    position: static;
  }
}
```

---

### **7. NetworkIntelligence.tsx (NEW)**

**Purpose:** Display network stats (not advice!)

```tsx
interface NetworkIntelligenceProps {
  stats: {
    similar_protocols: number;
    remission_rate: number;
    confidence: number;
  };
}

export const NetworkIntelligence: React.FC<NetworkIntelligenceProps> = ({ stats }) => {
  if (!stats.similar_protocols) return null;
  
  return (
    <div className="network-intelligence">
      <h4>📊 Network Intelligence</h4>
      <div className="stat-item">
        <span className="stat-value">{stats.similar_protocols}</span>
        <span className="stat-label">similar protocols in network</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">{stats.remission_rate}%</span>
        <span className="stat-label">remission rate observed</span>
      </div>
      <div className="confidence-indicator">
        <span className="confidence-label">Confidence:</span>
        <div className="confidence-bar">
          <div 
            className="confidence-fill" 
            style={{ width: `${stats.confidence}%` }}
          />
        </div>
      </div>
      <div className="disclaimer">
        ℹ️ Observational data only. Clinical decisions remain with practitioner.
      </div>
    </div>
  );
};
```

---

### **8. subjectIdGenerator.ts (NEW)**

**Purpose:** Generate unique Subject IDs

```typescript
/**
 * Generates a unique Subject ID in format: SUBJ-XXXXXXXXXX
 * Uses alphanumeric characters excluding confusing ones (0, O, 1, I, l)
 * 
 * @returns {string} Subject ID (e.g., "SUBJ-K7M3P9R2A4")
 */
export const generateSubjectID = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No 0, O, 1, I
  let id = '';
  
  for (let i = 0; i < 10; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `SUBJ-${id}`;
};

/**
 * Validates Subject ID format
 */
export const isValidSubjectID = (id: string): boolean => {
  const pattern = /^SUBJ-[A-Z2-9]{10}$/;
  return pattern.test(id);
};
```

---

### **9. protocolIntelligence.ts (NEW)**

**Purpose:** Smart defaults logic

```typescript
import { supabase } from '../lib/supabaseClient';

interface SmartProtocol {
  protocol: Partial<Protocol>;
  metadata: {
    source: 'user_patterns' | 'network_data';
    confidence: number;
    similar_protocols: number;
  };
}

/**
 * Generates smart protocol defaults based on user patterns or network data
 */
export const generateSmartProtocol = async (
  indication_id: number,
  user_id: string
): Promise<SmartProtocol> => {
  // Step 1: Try user's historical patterns
  const userPatterns = await getUserPatterns(user_id, indication_id);
  
  if (userPatterns.length >= 5) {
    return buildFromUserPatterns(userPatterns, indication_id);
  }
  
  // Step 2: Fallback to network patterns
  const networkPatterns = await getNetworkPatterns(indication_id);
  return buildFromNetworkPatterns(networkPatterns, indication_id);
};

/**
 * Get user's historical patterns for this indication
 */
const getUserPatterns = async (user_id: string, indication_id: number) => {
  const { data } = await supabase
    .from('log_clinical_records')
    .select('*')
    .eq('created_by', user_id)
    .eq('indication_id', indication_id)
    .order('created_at', { ascending: false })
    .limit(20);
  
  return data || [];
};

/**
 * Get network patterns for this indication
 */
const getNetworkPatterns = async (indication_id: number) => {
  const { data } = await supabase
    .from('log_clinical_records')
    .select('*')
    .eq('indication_id', indication_id)
    .order('created_at', { ascending: false })
    .limit(1000);
  
  return data || [];
};

/**
 * Build protocol from user's patterns
 */
const buildFromUserPatterns = (patterns: any[], indication_id: number): SmartProtocol => {
  return {
    protocol: {
      subject_id: generateSubjectID(),
      indication_id,
      substance_id: mode(patterns.map(p => p.substance_id)),
      route_id: mode(patterns.map(p => p.route_id)),
      dosage: median(patterns.map(p => p.dosage)),
      session_number: 1,
      session_date: new Date(),
      setting_id: mode(patterns.map(p => p.setting_id)),
      prep_hours: median(patterns.map(p => p.prep_hours)),
      integration_hours: median(patterns.map(p => p.integration_hours)),
      support_modality_ids: mode(patterns.map(p => p.support_modality_ids)),
    },
    metadata: {
      source: 'user_patterns',
      confidence: 90,
      similar_protocols: patterns.length,
    },
  };
};

/**
 * Build protocol from network patterns
 */
const buildFromNetworkPatterns = (patterns: any[], indication_id: number): SmartProtocol => {
  return {
    protocol: {
      subject_id: generateSubjectID(),
      indication_id,
      substance_id: mode(patterns.map(p => p.substance_id)),
      route_id: mode(patterns.map(p => p.route_id)),
      dosage: median(patterns.map(p => p.dosage)),
      session_number: 1,
      session_date: new Date(),
      setting_id: mode(patterns.map(p => p.setting_id)),
      prep_hours: median(patterns.map(p => p.prep_hours)),
      integration_hours: median(patterns.map(p => p.integration_hours)),
      support_modality_ids: mode(patterns.map(p => p.support_modality_ids)),
    },
    metadata: {
      source: 'network_data',
      confidence: 75,
      similar_protocols: patterns.length,
    },
  };
};

/**
 * Statistical helpers
 */
const mode = (arr: any[]) => {
  const counts = arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
};

const median = (arr: number[]) => {
  const sorted = arr.filter(n => n !== null).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};
```

---

## 🗄️ **DATABASE CHANGES**

### **Migration Script:**

```sql
-- Add new columns to log_clinical_records
ALTER TABLE log_clinical_records
  ADD COLUMN IF NOT EXISTS auto_filled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS time_to_complete INTEGER, -- seconds
  ADD COLUMN IF NOT EXISTS copied_from_protocol_id BIGINT,
  ADD COLUMN IF NOT EXISTS concomitant_med_ids BIGINT[]; -- Array of medication IDs

-- Create ref_medications table (if not exists)
CREATE TABLE IF NOT EXISTS ref_medications (
  medication_id BIGSERIAL PRIMARY KEY,
  medication_name TEXT NOT NULL,
  rxnorm_cui BIGINT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed some common medications
INSERT INTO ref_medications (medication_name, rxnorm_cui) VALUES
  ('Sertraline (Zoloft)', 36437),
  ('Fluoxetine (Prozac)', 4493),
  ('Escitalopram (Lexapro)', 321988),
  ('Bupropion (Wellbutrin)', 42347),
  ('Venlafaxine (Effexor)', 39786),
  ('Duloxetine (Cymbalta)', 72625),
  ('Mirtazapine (Remeron)', 15996),
  ('Trazodone', 10737),
  ('Buspirone', 1827),
  ('Lorazepam (Ativan)', 6470),
  ('Clonazepam (Klonopin)', 2598),
  ('Alprazolam (Xanax)', 596),
  ('Zolpidem (Ambien)', 39993),
  ('Quetiapine (Seroquel)', 35636),
  ('Aripiprazole (Abilify)', 89013),
  ('Lamotrigine (Lamictal)', 17128),
  ('Lithium', 6448),
  ('Methylphenidate (Ritalin)', 6809),
  ('Amphetamine/Dextroamphetamine (Adderall)', 1191),
  ('Atomoxetine (Strattera)', 36437)
ON CONFLICT DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_medications_name ON ref_medications(medication_name);
```

---

## ✅ **TESTING CHECKLIST**

### **Functional Tests:**

- [ ] **Indication Selection**
  - [ ] Dropdown loads all active indications
  - [ ] Search filters correctly
  - [ ] Selection triggers auto-fill
  - [ ] Keyboard navigation works

- [ ] **Auto-Fill Logic**
  - [ ] Uses user patterns if ≥5 protocols exist
  - [ ] Falls back to network patterns if <5
  - [ ] Generates unique Subject ID
  - [ ] All fields populated correctly

- [ ] **Preview Panel**
  - [ ] Updates in real-time as selections change
  - [ ] Network stats display correctly
  - [ ] Time saved calculates accurately
  - [ ] Sticky positioning works on desktop

- [ ] **Progress Indicator**
  - [ ] Shows 0% when empty
  - [ ] Updates as fields are filled
  - [ ] Shows 100% when all required fields complete
  - [ ] Accessible (aria-label)

- [ ] **Save Functionality**
  - [ ] Validates required fields
  - [ ] Saves to database correctly
  - [ ] Success animation plays
  - [ ] Modal closes after 2 seconds

- [ ] **Concomitant Medications**
  - [ ] Dropdown loads from ref_medications
  - [ ] Multi-select works
  - [ ] Stores as array of IDs
  - [ ] No free-text input possible

### **Visual Tests:**

- [ ] **Glassmorphism**
  - [ ] Backdrop blur renders correctly
  - [ ] Cards have proper transparency
  - [ ] Hover effects work smoothly

- [ ] **Responsive Design**
  - [ ] Desktop: 2-column layout
  - [ ] Tablet: Adjusts gracefully
  - [ ] Mobile: Single column, stacked
  - [ ] Preview panel not sticky on mobile

- [ ] **Accessibility**
  - [ ] All interactive elements keyboard accessible
  - [ ] Focus indicators visible
  - [ ] Screen reader announces changes
  - [ ] Icons paired with text labels
  - [ ] No color-only indicators

### **Performance Tests:**

- [ ] **Load Time**
  - [ ] Modal opens in <500ms
  - [ ] Reference data loads in <1s
  - [ ] Auto-fill completes in <200ms

- [ ] **Animations**
  - [ ] No jank (60fps)
  - [ ] Smooth transitions
  - [ ] Success animation feels premium

---

## 🚀 **DEPLOYMENT CHECKLIST**

### **Pre-Demo:**

- [ ] Run database migration
- [ ] Seed ref_medications table
- [ ] Test with 3 different indications
- [ ] Test on mobile device
- [ ] Test with screen reader
- [ ] Verify no console errors
- [ ] Check network tab (no failed requests)

### **Demo Script:**

1. **Opening:** "Let me show you how we've reduced protocol creation from 5 minutes to 30 seconds."

2. **Step 1:** Select "Treatment-Resistant Depression"
   - **Wow moment:** Watch auto-fill populate everything

3. **Step 2:** Show live preview updating
   - **Highlight:** "See how it shows network intelligence?"

4. **Step 3:** Click "Save Protocol"
   - **Wow moment:** Success animation

5. **Closing:** "That was 28 seconds. We just saved you 4 minutes and 32 seconds."

---

## 📊 **SUCCESS METRICS**

### **Quantitative:**

- ✅ Protocol creation time: <60 seconds (target: 30 sec)
- ✅ Required clicks: <10 (target: 5)
- ✅ Load time: <1 second
- ✅ Mobile responsive: 100%
- ✅ Accessibility score: WCAG 2.1 AA

### **Qualitative:**

- ✅ "Wow" reaction when auto-fill happens
- ✅ "This is so much faster!" feedback
- ✅ "I love the preview panel" comment
- ✅ Zero confusion about what to do next

---

## 📝 **BUILDER INSTRUCTIONS**

### **Implementation Order:**

**Day 1 (8 hours):**
1. Create utility functions (subjectIdGenerator, protocolIntelligence)
2. Create GlassmorphicCard component
3. Create ProgressBar component
4. Modify ProtocolBuilderModal layout (2-column grid)

**Day 2 (8 hours):**
5. Create Section1_Indication
6. Create Section2_Treatment
7. Create PreviewPanel
8. Create NetworkIntelligence

**Day 3 (4 hours):**
9. Create SuccessAnimation
10. Wire up all state management
11. Test and debug

**Day 4 (4 hours):**
12. Mobile responsive polish
13. Accessibility audit
14. Performance optimization
15. Demo rehearsal

---

## 🎯 **READY FOR BUILDER**

**Status:** ✅ APPROVED  
**Timeline:** 24 hours  
**Next:** Builder implements according to spec  

**Questions?** Ping Designer for clarification!

---

**Generated:** 2026-02-10 02:03 AM  
**Approved By:** CEO  
**Builder:** Ready to start!
