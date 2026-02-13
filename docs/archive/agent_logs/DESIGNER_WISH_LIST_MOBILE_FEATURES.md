# 🎨 DESIGNER WISH LIST: Dream Data Features for Mobile Experience

**From:** DESIGNER  
**To:** SOOP (Data/Database Subagent)  
**Date:** 2026-02-12 05:34 PST  
**Type:** Vision Document - "If We Could Build Anything..."

---

## 🌟 **VISION**

Create the most compelling, data-rich mobile experience for psychedelic therapy research that:
- **Wows clinicians** with instant insights
- **Drives engagement** through beautiful visualizations
- **Builds trust** through transparency and precision
- **Saves time** by surfacing the right data at the right moment
- **Inspires action** through clear, actionable intelligence

---

## 📱 **MOBILE DASHBOARD: "My Clinic at a Glance"**

### **WISH #1: Real-Time Performance Score**
**What I Want to Show:**
A single, compelling "Clinic Performance Score" (0-100) that updates in real-time

**Data Needed:**
```sql
-- Composite score calculation
CREATE VIEW v_clinic_performance_score AS
SELECT 
  site_id,
  -- Weighted composite of:
  (protocol_completion_rate * 0.3) +      -- 30% weight
  (data_quality_score * 0.25) +           -- 25% weight
  (safety_compliance_rate * 0.25) +       -- 25% weight
  (patient_outcome_score * 0.20)          -- 20% weight
  AS performance_score,
  
  -- Individual components for drill-down
  protocol_completion_rate,
  data_quality_score,
  safety_compliance_rate,
  patient_outcome_score,
  
  -- Comparison metrics
  network_avg_score,
  percentile_rank,
  trend_vs_last_month
FROM ...
```

**Mobile Design:**
- Large circular gauge showing 0-100 score
- Color gradient: Red (0-40), Amber (41-70), Green (71-100)
- Animated needle movement
- Tap to drill down into components
- Small sparkline showing 30-day trend

---

### **WISH #2: "Streak" Gamification**
**What I Want to Show:**
"🔥 23 Days Without Safety Events" - Build engagement through positive streaks

**Data Needed:**
```sql
-- Calculate current streak
CREATE VIEW v_clinic_streaks AS
SELECT 
  site_id,
  
  -- Safety streak (days without events)
  DATEDIFF(NOW(), MAX(safety_event_date)) as days_without_safety_events,
  
  -- Consistency streak (consecutive days with protocols logged)
  consecutive_days_with_protocols,
  
  -- Quality streak (consecutive protocols with complete data)
  consecutive_complete_protocols,
  
  -- Personal best records
  longest_safety_streak,
  longest_consistency_streak
FROM ...
```

**Mobile Design:**
- Fire emoji 🔥 with streak count
- Progress bar to next milestone (25, 50, 100 days)
- Celebration animation when hitting milestones
- "Share Achievement" button

---

### **WISH #3: Intelligent Alerts & Nudges**
**What I Want to Show:**
Smart, contextual notifications that drive action

**Data Needed:**
```sql
-- Actionable insights
CREATE VIEW v_clinic_action_items AS
SELECT 
  site_id,
  alert_type,
  priority,
  message,
  action_url,
  created_at
FROM (
  -- Incomplete protocols needing attention
  SELECT 'incomplete_protocol' as alert_type, ...
  
  -- Safety events needing follow-up
  UNION SELECT 'safety_followup' as alert_type, ...
  
  -- Data quality issues
  UNION SELECT 'data_quality' as alert_type, ...
  
  -- Positive achievements
  UNION SELECT 'achievement' as alert_type, ...
  
  -- Network benchmarking insights
  UNION SELECT 'benchmark_insight' as alert_type, ...
)
ORDER BY priority DESC, created_at DESC
LIMIT 5
```

**Mobile Design:**
- Notification badge on dashboard icon
- Swipeable alert cards
- Color-coded by priority (red, amber, green, blue)
- One-tap actions ("Review Now", "Dismiss", "Remind Later")

---

## 📊 **ANALYTICS: "Clinical Intelligence Platform"**

### **WISH #4: Predictive Outcome Modeling**
**What I Want to Show:**
"Based on 156 similar protocols, predicted success rate: 78% ±5%"

**Data Needed:**
```sql
-- Machine learning feature table
CREATE TABLE ml_outcome_predictions (
  prediction_id BIGSERIAL PRIMARY KEY,
  protocol_id BIGINT REFERENCES log_clinical_records,
  
  -- Input features
  substance_id BIGINT,
  dosage_mg DECIMAL,
  patient_age INT,
  indication_id BIGINT,
  prior_treatments INT,
  
  -- Predictions
  predicted_success_probability DECIMAL(5,2),
  confidence_interval_lower DECIMAL(5,2),
  confidence_interval_upper DECIMAL(5,2),
  
  -- Model metadata
  model_version VARCHAR(50),
  similar_protocols_count INT,
  prediction_date TIMESTAMP DEFAULT NOW()
);

-- View for mobile display
CREATE VIEW v_outcome_predictions AS
SELECT 
  p.*,
  -- Human-readable interpretation
  CASE 
    WHEN predicted_success_probability >= 0.75 THEN 'High likelihood of positive outcome'
    WHEN predicted_success_probability >= 0.50 THEN 'Moderate likelihood of positive outcome'
    ELSE 'Consider alternative approach'
  END as interpretation,
  
  -- Confidence level
  (confidence_interval_upper - confidence_interval_lower) as confidence_range
FROM ml_outcome_predictions p
```

**Mobile Design:**
- Probability gauge with confidence interval
- "Based on N similar protocols" context
- Tap to see similar protocol details
- Factors influencing prediction (dosage, age, etc.)

---

### **WISH #5: Comparative Effectiveness Visualization**
**What I Want to Show:**
Head-to-head comparison of substances for specific indications

**Data Needed:**
```sql
-- Comparative effectiveness table
CREATE VIEW v_comparative_effectiveness AS
SELECT 
  i.indication_name,
  s.substance_name,
  
  -- Efficacy metrics
  AVG(o.efficacy_score) as avg_efficacy,
  STDDEV(o.efficacy_score) as efficacy_stddev,
  
  -- Safety metrics
  COUNT(DISTINCT se.safety_event_id) * 100.0 / COUNT(DISTINCT cr.protocol_id) as adverse_event_rate,
  
  -- Dosage info
  AVG(int.dosage_mg) as avg_dosage,
  MIN(int.dosage_mg) as min_dosage,
  MAX(int.dosage_mg) as max_dosage,
  
  -- Sample size
  COUNT(DISTINCT cr.protocol_id) as n_protocols,
  
  -- Statistical significance
  -- (Would need more complex calculation for p-values)
  
FROM log_clinical_records cr
JOIN log_interventions int ON cr.protocol_id = int.protocol_id
JOIN ref_substances s ON int.substance_id = s.substance_id
JOIN ref_indications i ON cr.indication_id = i.indication_id
LEFT JOIN log_outcomes o ON cr.protocol_id = o.protocol_id
LEFT JOIN log_safety_events se ON cr.protocol_id = se.protocol_id
GROUP BY i.indication_id, s.substance_id
HAVING COUNT(DISTINCT cr.protocol_id) >= 10  -- Minimum sample size
```

**Mobile Design:**
- Horizontal bar chart comparing substances
- Error bars showing confidence intervals
- Color-coded by statistical significance
- Tap substance to see detailed breakdown
- Filter by indication

---

### **WISH #6: Time-to-Outcome Analysis**
**What I Want to Show:**
"Median time to therapeutic response: 14 days (range: 7-28 days)"

**Data Needed:**
```sql
-- Outcome timeline tracking
CREATE TABLE log_outcome_timeline (
  timeline_id BIGSERIAL PRIMARY KEY,
  protocol_id BIGINT REFERENCES log_clinical_records,
  
  -- Key milestones
  treatment_date DATE,
  first_assessment_date DATE,
  therapeutic_response_date DATE,
  sustained_response_date DATE,
  
  -- Calculated intervals
  days_to_first_assessment INT,
  days_to_therapeutic_response INT,
  days_to_sustained_response INT,
  
  -- Response quality
  response_magnitude DECIMAL(5,2),
  response_durability_days INT
);

-- Aggregate view
CREATE VIEW v_outcome_timeline_stats AS
SELECT 
  substance_id,
  indication_id,
  
  -- Time metrics
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY days_to_therapeutic_response) as median_days_to_response,
  PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY days_to_therapeutic_response) as q1_days,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY days_to_therapeutic_response) as q3_days,
  MIN(days_to_therapeutic_response) as min_days,
  MAX(days_to_therapeutic_response) as max_days,
  
  -- Response durability
  AVG(response_durability_days) as avg_durability_days
FROM log_outcome_timeline
GROUP BY substance_id, indication_id
```

**Mobile Design:**
- Timeline visualization with key milestones
- Box plot showing distribution
- Survival curve for response durability
- Comparison to network averages

---

## 🧬 **SUBSTANCE LIBRARY: "Molecular Intelligence"**

### **WISH #7: Interactive Molecular Properties**
**What I Want to Show:**
Rich molecular data with interactive 3D viewer

**Data Needed:**
```sql
-- Extended substance metadata
CREATE TABLE ref_substance_properties (
  substance_id BIGINT PRIMARY KEY REFERENCES ref_substances,
  
  -- Chemical identifiers
  smiles_string TEXT,
  inchi_key VARCHAR(27),
  cas_number VARCHAR(12),
  pubchem_cid BIGINT,
  
  -- 3D structure data
  mol_file_3d TEXT,  -- MDL MOL format
  pdb_coordinates TEXT,
  
  -- Molecular properties
  molecular_weight DECIMAL(10,4),
  logp DECIMAL(5,2),  -- Lipophilicity
  tpsa DECIMAL(6,2),  -- Topological polar surface area
  hbd_count INT,      -- Hydrogen bond donors
  hba_count INT,      -- Hydrogen bond acceptors
  rotatable_bonds INT,
  
  -- Pharmacokinetics
  half_life_hours DECIMAL(6,2),
  bioavailability_percent DECIMAL(5,2),
  protein_binding_percent DECIMAL(5,2),
  
  -- Receptor binding
  primary_receptor VARCHAR(50),
  receptor_affinity_ki DECIMAL(10,4),
  
  -- Safety profile
  therapeutic_index DECIMAL(6,2),
  ld50_mg_kg DECIMAL(10,2),
  
  -- Metadata
  data_source VARCHAR(100),
  last_updated TIMESTAMP DEFAULT NOW()
);
```

**Mobile Design:**
- 3D molecule viewer (WebGL/Three.js)
- Swipeable property cards
- "Drug-likeness" score visualization
- Receptor binding heatmap
- Comparison to similar compounds

---

### **WISH #8: Substance Interaction Matrix**
**What I Want to Show:**
"⚠️ Moderate interaction with SSRIs - Monitor closely"

**Data Needed:**
```sql
-- Drug interaction database
CREATE TABLE ref_substance_interactions (
  interaction_id BIGSERIAL PRIMARY KEY,
  substance_a_id BIGINT REFERENCES ref_substances,
  substance_b_id BIGINT REFERENCES ref_substances,
  
  -- Interaction details
  interaction_severity VARCHAR(20),  -- 'none', 'minor', 'moderate', 'major', 'contraindicated'
  interaction_mechanism TEXT,
  clinical_significance TEXT,
  management_recommendation TEXT,
  
  -- Evidence
  evidence_level VARCHAR(20),  -- 'theoretical', 'case_report', 'clinical_study', 'established'
  reference_citations TEXT[],
  
  -- Metadata
  last_reviewed DATE,
  reviewer_notes TEXT
);

-- View for mobile display
CREATE VIEW v_substance_interactions_mobile AS
SELECT 
  s1.substance_name as substance,
  s2.substance_name as interacts_with,
  i.interaction_severity,
  i.clinical_significance,
  i.management_recommendation,
  
  -- Color coding
  CASE i.interaction_severity
    WHEN 'contraindicated' THEN '#ef4444'  -- Red
    WHEN 'major' THEN '#f59e0b'            -- Amber
    WHEN 'moderate' THEN '#eab308'         -- Yellow
    WHEN 'minor' THEN '#10b981'            -- Green
    ELSE '#6b7280'                         -- Gray
  END as severity_color
FROM ref_substance_interactions i
JOIN ref_substances s1 ON i.substance_a_id = s1.substance_id
JOIN ref_substances s2 ON i.substance_b_id = s2.substance_id
```

**Mobile Design:**
- Matrix heatmap of interactions
- Color-coded severity
- Tap cell for detailed explanation
- Search/filter by drug class
- "Check My Medications" feature

---

## 🛡️ **SAFETY MONITORING: "Proactive Risk Management"**

### **WISH #9: Real-Time Safety Score**
**What I Want to Show:**
Dynamic safety score that updates with each protocol

**Data Needed:**
```sql
-- Safety scoring system
CREATE VIEW v_clinic_safety_score AS
SELECT 
  site_id,
  
  -- Overall safety score (0-100, higher is better)
  (
    (100 - adverse_event_rate * 10) * 0.4 +           -- 40% weight
    (resolution_rate) * 0.3 +                         -- 30% weight
    (reporting_compliance_rate) * 0.2 +               -- 20% weight
    (100 - severity_weighted_score) * 0.1             -- 10% weight
  ) as overall_safety_score,
  
  -- Component scores
  adverse_event_rate,  -- Events per 100 protocols
  resolution_rate,     -- % of events resolved
  reporting_compliance_rate,  -- % of protocols with safety assessment
  severity_weighted_score,    -- Weighted by severity
  
  -- Trend
  safety_score_trend_30d,  -- Change vs 30 days ago
  
  -- Benchmarking
  network_avg_safety_score,
  percentile_rank
FROM ...
```

**Mobile Design:**
- Large safety score gauge
- Trend indicator (improving/stable/declining)
- Breakdown of component scores
- Comparison to network average
- "Safety Champion" badge if top 10%

---

### **WISH #10: Predictive Safety Alerts**
**What I Want to Show:**
"⚠️ This protocol has 3 risk factors - Consider additional monitoring"

**Data Needed:**
```sql
-- Risk factor analysis
CREATE TABLE ml_safety_risk_predictions (
  prediction_id BIGSERIAL PRIMARY KEY,
  protocol_id BIGINT REFERENCES log_clinical_records,
  
  -- Risk score
  predicted_risk_score DECIMAL(5,2),  -- 0-100, higher is riskier
  risk_category VARCHAR(20),  -- 'low', 'moderate', 'high', 'very_high'
  
  -- Contributing risk factors
  risk_factors JSONB,  -- Array of identified risk factors
  /*
  Example:
  {
    "high_dosage": {"weight": 0.3, "value": "45mg (>40mg threshold)"},
    "polypharmacy": {"weight": 0.25, "value": "3 concomitant medications"},
    "age_risk": {"weight": 0.15, "value": "Age 68 (>65 threshold)"}
  }
  */
  
  -- Recommendations
  monitoring_recommendations TEXT[],
  contraindications TEXT[],
  
  -- Model metadata
  model_version VARCHAR(50),
  confidence_score DECIMAL(5,2),
  prediction_date TIMESTAMP DEFAULT NOW()
);
```

**Mobile Design:**
- Risk gauge (green/amber/red zones)
- List of risk factors with weights
- Actionable recommendations
- "Override" option with required justification
- Historical risk vs actual outcome tracking

---

## 📈 **NETWORK INSIGHTS: "Collective Intelligence"**

### **WISH #11: Live Network Activity Feed**
**What I Want to Show:**
Real-time, anonymized activity across the network

**Data Needed:**
```sql
-- Network activity stream
CREATE VIEW v_network_activity_feed AS
SELECT 
  -- Anonymized event
  CONCAT('Site ', SUBSTRING(MD5(site_id::TEXT), 1, 4)) as anonymous_site,
  event_type,
  event_description,
  event_timestamp,
  
  -- Aggregated context
  substance_name,
  indication_name,
  outcome_category
FROM (
  -- Protocol logged events
  SELECT 
    site_id,
    'protocol_logged' as event_type,
    'New protocol logged' as event_description,
    created_at as event_timestamp,
    s.substance_name,
    i.indication_name,
    NULL as outcome_category
  FROM log_clinical_records cr
  JOIN ref_substances s ON cr.substance_id = s.substance_id
  JOIN ref_indications i ON cr.indication_id = i.indication_id
  WHERE created_at >= NOW() - INTERVAL '24 hours'
  
  UNION ALL
  
  -- Positive outcome events
  SELECT 
    cr.site_id,
    'positive_outcome' as event_type,
    'Positive outcome reported' as event_description,
    o.assessment_date as event_timestamp,
    s.substance_name,
    i.indication_name,
    'positive' as outcome_category
  FROM log_outcomes o
  JOIN log_clinical_records cr ON o.protocol_id = cr.protocol_id
  JOIN ref_substances s ON cr.substance_id = s.substance_id
  JOIN ref_indications i ON cr.indication_id = i.indication_id
  WHERE o.efficacy_score >= 7.0  -- Threshold for "positive"
    AND o.assessment_date >= NOW() - INTERVAL '24 hours'
)
ORDER BY event_timestamp DESC
LIMIT 50
```

**Mobile Design:**
- Scrollable activity feed
- Real-time updates (WebSocket)
- Color-coded by event type
- "Celebrate" button for positive outcomes
- Filter by substance/indication

---

### **WISH #12: Network Benchmarking Dashboard**
**What I Want to Show:**
"You rank #3 out of 47 sites in protocol completion rate"

**Data Needed:**
```sql
-- Comprehensive benchmarking view
CREATE VIEW v_network_benchmarking AS
SELECT 
  site_id,
  site_name,
  
  -- Key metrics
  total_protocols,
  protocols_this_month,
  protocol_completion_rate,
  data_quality_score,
  safety_score,
  avg_outcome_score,
  
  -- Rankings (1 = best)
  RANK() OVER (ORDER BY total_protocols DESC) as rank_total_protocols,
  RANK() OVER (ORDER BY protocol_completion_rate DESC) as rank_completion_rate,
  RANK() OVER (ORDER BY data_quality_score DESC) as rank_data_quality,
  RANK() OVER (ORDER BY safety_score DESC) as rank_safety,
  RANK() OVER (ORDER BY avg_outcome_score DESC) as rank_outcomes,
  
  -- Percentiles
  PERCENT_RANK() OVER (ORDER BY total_protocols) as percentile_total_protocols,
  PERCENT_RANK() OVER (ORDER BY protocol_completion_rate) as percentile_completion_rate,
  
  -- Network totals for context
  SUM(total_protocols) OVER () as network_total_protocols,
  COUNT(*) OVER () as total_sites
FROM ...
```

**Mobile Design:**
- Leaderboard-style display
- Your site highlighted
- Swipe between different metrics
- Trend arrows (moving up/down)
- "Top Performer" badges

---

## 🎯 **PROTOCOL BUILDER: "Intelligent Form Experience"**

### **WISH #13: Smart Field Pre-Population**
**What I Want to Show:**
Auto-fill based on clinic patterns and previous protocols

**Data Needed:**
```sql
-- Clinic usage patterns
CREATE VIEW v_clinic_field_suggestions AS
SELECT 
  site_id,
  
  -- Most common selections
  MODE() WITHIN GROUP (ORDER BY substance_id) as most_common_substance,
  MODE() WITHIN GROUP (ORDER BY route_id) as most_common_route,
  MODE() WITHIN GROUP (ORDER BY indication_id) as most_common_indication,
  
  -- Typical dosages by substance
  substance_id,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY dosage_mg) as median_dosage,
  
  -- Typical session patterns
  AVG(session_number) as avg_session_number,
  
  -- Last used values (for "repeat last protocol" feature)
  LAST_VALUE(substance_id) OVER (PARTITION BY site_id ORDER BY created_at) as last_substance,
  LAST_VALUE(dosage_mg) OVER (PARTITION BY site_id ORDER BY created_at) as last_dosage
FROM log_clinical_records
GROUP BY site_id, substance_id
```

**Mobile Design:**
- "Use clinic defaults" button
- "Repeat last protocol" button
- Smart suggestions as you type
- Dosage calculator based on patient weight
- "Save as template" feature

---

### **WISH #14: Real-Time Validation & Guidance**
**What I Want to Show:**
Contextual help and validation as user fills form

**Data Needed:**
```sql
-- Validation rules and guidance
CREATE TABLE ref_field_validation_rules (
  rule_id BIGSERIAL PRIMARY KEY,
  field_name VARCHAR(100),
  
  -- Validation
  validation_type VARCHAR(50),  -- 'range', 'pattern', 'dependency', 'warning'
  validation_rule JSONB,
  error_message TEXT,
  
  -- Contextual guidance
  help_text TEXT,
  example_value TEXT,
  clinical_rationale TEXT,
  
  -- Conditional logic
  applies_when JSONB,  -- Conditions when this rule applies
  
  -- Severity
  severity VARCHAR(20)  -- 'error', 'warning', 'info'
);

-- Dosage safety ranges
CREATE TABLE ref_dosage_safety_ranges (
  range_id BIGSERIAL PRIMARY KEY,
  substance_id BIGINT REFERENCES ref_substances,
  indication_id BIGINT REFERENCES ref_indications,
  
  -- Safe ranges
  min_safe_dosage_mg DECIMAL(10,2),
  max_safe_dosage_mg DECIMAL(10,2),
  typical_dosage_mg DECIMAL(10,2),
  
  -- Warnings
  low_dose_warning_threshold DECIMAL(10,2),
  high_dose_warning_threshold DECIMAL(10,2),
  
  -- Context
  dosage_rationale TEXT,
  references TEXT[]
);
```

**Mobile Design:**
- Inline validation messages
- Color-coded field borders (green=valid, amber=warning, red=error)
- Expandable help tooltips
- Dosage range slider with safe zones
- "Why is this required?" explanations

---

## 🔮 **ADVANCED FEATURES: "The Dream List"**

### **WISH #15: Voice-to-Data Entry**
**What I Want to Show:**
"Tap mic, speak protocol details, auto-populate form"

**Data Needed:**
```sql
-- Voice transcription log
CREATE TABLE log_voice_entries (
  entry_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  protocol_id BIGINT,
  
  -- Audio data
  audio_file_url TEXT,
  transcription TEXT,
  
  -- Extracted entities
  extracted_data JSONB,
  /*
  Example:
  {
    "substance": "psilocybin",
    "dosage": "25mg",
    "route": "oral",
    "patient_age": "42"
  }
  */
  
  -- Confidence scores
  transcription_confidence DECIMAL(5,2),
  entity_extraction_confidence DECIMAL(5,2),
  
  -- Review status
  reviewed_by_user BOOLEAN DEFAULT FALSE,
  corrections_made JSONB,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Mobile Design:**
- Large microphone button
- Real-time transcription display
- Extracted fields highlighted
- "Confirm & Submit" review screen
- Edit capability before submission

---

### **WISH #16: Offline Mode with Sync**
**What I Want to Show:**
Work without internet, auto-sync when connected

**Data Needed:**
```sql
-- Offline queue management
CREATE TABLE log_offline_queue (
  queue_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  device_id VARCHAR(100),
  
  -- Queued action
  action_type VARCHAR(50),  -- 'create_protocol', 'update_protocol', 'log_event'
  action_payload JSONB,
  
  -- Sync status
  sync_status VARCHAR(20),  -- 'pending', 'syncing', 'synced', 'conflict', 'error'
  sync_attempts INT DEFAULT 0,
  last_sync_attempt TIMESTAMP,
  sync_error TEXT,
  
  -- Conflict resolution
  server_version JSONB,  -- If conflict detected
  resolution_strategy VARCHAR(50),  -- 'client_wins', 'server_wins', 'manual'
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  synced_at TIMESTAMP
);
```

**Mobile Design:**
- "Offline Mode" indicator
- Queue status badge (X items pending sync)
- Auto-sync when connection restored
- Conflict resolution UI
- "Force Sync" button

---

### **WISH #17: Collaborative Protocol Notes**
**What I Want to Show:**
Team members can add notes/observations to protocols

**Data Needed:**
```sql
-- Protocol collaboration
CREATE TABLE log_protocol_notes (
  note_id BIGSERIAL PRIMARY KEY,
  protocol_id BIGINT REFERENCES log_clinical_records,
  user_id BIGINT,
  
  -- Note content
  note_text TEXT,
  note_type VARCHAR(50),  -- 'observation', 'question', 'alert', 'update'
  
  -- Mentions/tags
  mentioned_user_ids BIGINT[],
  tags TEXT[],
  
  -- Attachments
  attachment_urls TEXT[],
  
  -- Threading
  parent_note_id BIGINT REFERENCES log_protocol_notes,
  
  -- Visibility
  visibility VARCHAR(20),  -- 'site_only', 'network_wide', 'private'
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP  -- Soft delete
);

-- Notification system
CREATE TABLE log_note_notifications (
  notification_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  note_id BIGINT REFERENCES log_protocol_notes,
  
  -- Notification details
  notification_type VARCHAR(50),  -- 'mention', 'reply', 'update'
  read_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Mobile Design:**
- Comment thread UI
- @mention autocomplete
- Push notifications for mentions
- Rich text editor
- Photo attachments
- "Mark as Important" flag

---

### **WISH #18: Smart Search & Filters**
**What I Want to Show:**
"Find all psilocybin protocols for depression with positive outcomes"

**Data Needed:**
```sql
-- Full-text search index
CREATE TABLE search_protocol_index (
  protocol_id BIGINT PRIMARY KEY,
  
  -- Searchable text
  search_vector tsvector,  -- PostgreSQL full-text search
  
  -- Faceted search fields
  substance_names TEXT[],
  indication_names TEXT[],
  outcome_categories TEXT[],
  safety_event_types TEXT[],
  
  -- Numeric filters
  dosage_mg DECIMAL(10,2),
  patient_age INT,
  efficacy_score DECIMAL(5,2),
  
  -- Date filters
  treatment_date DATE,
  outcome_date DATE,
  
  -- Boolean filters
  has_safety_events BOOLEAN,
  has_positive_outcome BOOLEAN,
  is_complete BOOLEAN,
  
  -- Metadata
  last_indexed TIMESTAMP DEFAULT NOW()
);

-- Search history for autocomplete
CREATE TABLE log_user_searches (
  search_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  search_query TEXT,
  search_filters JSONB,
  results_count INT,
  clicked_result_ids BIGINT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Mobile Design:**
- Search bar with autocomplete
- Recent searches
- Popular searches
- Filter chips (substance, indication, outcome)
- Sort options (date, relevance, efficacy)
- Save search as "Smart Collection"

---

### **WISH #19: Export & Reporting**
**What I Want to Show:**
"Generate PDF report of last month's protocols"

**Data Needed:**
```sql
-- Report templates
CREATE TABLE ref_report_templates (
  template_id BIGSERIAL PRIMARY KEY,
  template_name VARCHAR(100),
  template_description TEXT,
  
  -- Report configuration
  included_sections JSONB,
  /*
  Example:
  {
    "summary_stats": true,
    "protocol_list": true,
    "safety_events": true,
    "outcome_analysis": true,
    "charts": ["efficacy_trend", "substance_distribution"]
  }
  */
  
  -- Filters
  default_filters JSONB,
  
  -- Format options
  output_formats TEXT[],  -- ['pdf', 'excel', 'csv', 'json']
  
  -- Permissions
  available_to_roles TEXT[],
  
  created_by BIGINT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Report generation log
CREATE TABLE log_report_generations (
  generation_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  template_id BIGINT REFERENCES ref_report_templates,
  
  -- Generation details
  filters_applied JSONB,
  output_format VARCHAR(20),
  file_url TEXT,
  file_size_bytes BIGINT,
  
  -- Status
  generation_status VARCHAR(20),  -- 'queued', 'processing', 'completed', 'failed'
  error_message TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

**Mobile Design:**
- "Export" button on any data view
- Template selector
- Date range picker
- Format selector (PDF, Excel, CSV)
- Email/share options
- Download progress indicator

---

### **WISH #20: Personalized Dashboard Widgets**
**What I Want to Show:**
Users can customize their dashboard layout

**Data Needed:**
```sql
-- User dashboard preferences
CREATE TABLE user_dashboard_layouts (
  layout_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  
  -- Widget configuration
  widgets JSONB,
  /*
  Example:
  [
    {
      "widget_type": "performance_score",
      "position": 1,
      "size": "large",
      "config": {"show_trend": true}
    },
    {
      "widget_type": "recent_protocols",
      "position": 2,
      "size": "medium",
      "config": {"limit": 5}
    }
  ]
  */
  
  -- Layout metadata
  layout_name VARCHAR(100),
  is_default BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Available widgets catalog
CREATE TABLE ref_dashboard_widgets (
  widget_id BIGSERIAL PRIMARY KEY,
  widget_type VARCHAR(50) UNIQUE,
  widget_name VARCHAR(100),
  widget_description TEXT,
  
  -- Configuration
  available_sizes TEXT[],  -- ['small', 'medium', 'large']
  config_schema JSONB,  -- JSON schema for widget config
  
  -- Data requirements
  required_permissions TEXT[],
  data_query TEXT,  -- SQL query or view name
  
  -- Metadata
  category VARCHAR(50),  -- 'performance', 'safety', 'analytics', 'activity'
  icon_name VARCHAR(50),
  
  is_active BOOLEAN DEFAULT TRUE
);
```

**Mobile Design:**
- "Edit Dashboard" mode
- Drag-and-drop widget reordering
- Widget library/catalog
- Size options (small, medium, large)
- "Reset to Default" option
- Save multiple layouts

---

## 🎨 **DESIGN SYSTEM ENHANCEMENTS**

### **WISH #21: Dynamic Theming**
**What I Want to Show:**
Users can choose color themes (Dark, Light, High Contrast)

**Data Needed:**
```sql
-- User preferences
CREATE TABLE user_preferences (
  user_id BIGINT PRIMARY KEY,
  
  -- Theme
  theme VARCHAR(20) DEFAULT 'dark',  -- 'dark', 'light', 'high_contrast', 'auto'
  accent_color VARCHAR(7),  -- Hex color for personalization
  
  -- Accessibility
  font_size VARCHAR(20) DEFAULT 'medium',  -- 'small', 'medium', 'large', 'x-large'
  reduce_motion BOOLEAN DEFAULT FALSE,
  high_contrast_mode BOOLEAN DEFAULT FALSE,
  
  -- Notifications
  push_notifications_enabled BOOLEAN DEFAULT TRUE,
  email_notifications_enabled BOOLEAN DEFAULT TRUE,
  notification_frequency VARCHAR(20) DEFAULT 'real_time',  -- 'real_time', 'daily_digest', 'weekly_digest'
  
  -- Language
  preferred_language VARCHAR(10) DEFAULT 'en',
  
  -- Data display
  date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
  time_format VARCHAR(20) DEFAULT '12h',  -- '12h', '24h'
  measurement_units VARCHAR(20) DEFAULT 'metric',  -- 'metric', 'imperial'
  
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Mobile Design:**
- Theme switcher in settings
- Live preview of theme changes
- Custom accent color picker
- Accessibility options
- "Sync with system" option

---

## 📊 **SUMMARY: Priority Matrix**

### **Must-Have (P0) - Foundation:**
1. ✅ Real-Time Performance Score
2. ✅ Clinic Safety Score
3. ✅ Network Benchmarking
4. ✅ Smart Field Pre-Population
5. ✅ Real-Time Validation

### **Should-Have (P1) - Engagement:**
6. ✅ Streak Gamification
7. ✅ Intelligent Alerts
8. ✅ Live Network Activity Feed
9. ✅ Comparative Effectiveness
10. ✅ Interactive Molecular Properties

### **Nice-to-Have (P2) - Advanced:**
11. ✅ Predictive Outcome Modeling
12. ✅ Predictive Safety Alerts
13. ✅ Time-to-Outcome Analysis
14. ✅ Substance Interaction Matrix
15. ✅ Collaborative Notes

### **Future (P3) - Innovation:**
16. ✅ Voice-to-Data Entry
17. ✅ Offline Mode with Sync
18. ✅ Smart Search & Filters
19. ✅ Export & Reporting
20. ✅ Personalized Dashboards
21. ✅ Dynamic Theming

---

## 💬 **NEXT STEPS**

### **For SOOP:**
1. Review this wish list
2. Identify which features are feasible
3. Prioritize based on:
   - Data availability
   - Implementation complexity
   - User impact
   - Time to build
4. Create implementation plan for P0 features
5. Provide sample data for DESIGNER to create mockups

### **For DESIGNER:**
1. Await SOOP's feasibility assessment
2. Create detailed mockups for approved features
3. Design mobile UI for each feature
4. Create interaction prototypes
5. Document design patterns

---

**Wish List Submitted:** 2026-02-12 05:34 PST  
**Total Features:** 21  
**Estimated Design Impact:** 50+ mobile screens  
**Dream Big:** 🚀 Let's build the best clinical research platform in the world!
