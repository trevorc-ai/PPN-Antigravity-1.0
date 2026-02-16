---
id: WO-054
status: 02_DESIGN
priority: P1 (Critical)
category: Feature / Data Visualization / Backend
owner: DESIGNER
failure_count: 0
created_date: 2026-02-16T10:51:44-08:00
estimated_complexity: 10/10
estimated_timeline: 6-10 weeks
---

# User Request

Build a comprehensive pharmacology visualization system that displays receptor target interactions, time-course profiles, and mechanism maps for psychedelic compounds with rigorous data integrity, citation tracking, and uncertainty labeling.

## Project Goal

Design and build a web UI and supporting backend that visualizes pharmacology target interactions for these compounds:

* 5-MeO-DMT
* DMT (N,N-Dimethyltryptamine)
* Esketamine
* Ibogaine
* Ketamine
* LSD-25
* MDMA
* Mescaline
* Psilocybin (and psilocin as active metabolite)

### Target Audiences

1. **Therapist view** - Clinical education and decision support cues (NOT medical advice)
2. **Patient view** - Simplified education and expectations

### Core Visualizations Required

1. **Target fingerprint** - Heatmap or ranked bars showing receptor interactions
2. **Time course timeline** - Onset, peak, duration, metabolites
3. **Mechanism map** - Serotonergic psychedelics vs dissociatives vs entactogens
4. **Signaling/functional bias panel** (optional advanced) - With strong uncertainty labeling

---

## THE BLAST RADIUS (Authorized Target Area)

### New Files to Create

**Backend (Python/FastAPI):**
- `backend/api/main.py` - FastAPI application
- `backend/api/endpoints/substances.py`
- `backend/api/endpoints/targets.py`
- `backend/api/endpoints/interactions.py`
- `backend/api/endpoints/citations.py`
- `backend/models/substance.py`
- `backend/models/target.py`
- `backend/models/interaction.py`
- `backend/models/citation.py`
- `backend/utils/unit_conversion.py`
- `backend/utils/normalization.py`
- `backend/utils/validation.py`
- `backend/data/substances.json`
- `backend/data/targets.json`
- `backend/data/interactions.json`
- `backend/data/citations.json`
- `backend/data/time_courses.json`

**Frontend (React + Tailwind):**
- `src/pages/PharmacologyExplore.tsx`
- `src/pages/SubstanceDetail.tsx`
- `src/pages/PharmacologyCompare.tsx`
- `src/pages/PharmacologyMethodology.tsx`
- `src/components/pharmacology/SubstanceSelector.tsx`
- `src/components/pharmacology/TargetFingerprintHeatmap.tsx`
- `src/components/pharmacology/RankedTargetsBarChart.tsx`
- `src/components/pharmacology/TimeCourseTimeline.tsx`
- `src/components/pharmacology/MechanismMap.tsx`
- `src/components/pharmacology/EvidenceDrawer.tsx`
- `src/components/pharmacology/CompareView.tsx`
- `src/types/pharmacology.ts`

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

### Prohibited Actions

**DO NOT:**
- Provide dosing guidance
- Provide contraindication rules beyond neutral education
- Claim therapeutic efficacy for any indication
- Imply that receptor binding predicts individual outcomes
- Label any interaction as "beneficial" or "harmful"
- Claim receptor X "causes" outcome Y (use "is associated with" or "is believed to contribute to")
- Allow user-entered dosing
- Collect personal medical info in this module
- Use color alone to imply clinical "good" or "bad"
- Show missing data as zero (must show as "no data")
- Blend Ki and EC50 values without clear labeling
- Create charts without citation traceability

### Required Guardrails

**Every UI must include:**
- "Educational content only. Not medical advice."
- "Receptor binding does not predict outcomes for an individual."
- "Evidence quality varies. Check citations and confidence."
- "Time ranges vary by person, dose, and route."

---

## 📊 DATA MODEL SPECIFICATION

### 1) Substance Entity

```typescript
interface Substance {
  id: string;                    // slug, e.g., "lsd_25"
  display_name: string;
  aliases: string[];
  class: 'serotonergic_psychedelic' | 'dissociative' | 'entactogen' | 'mixed' | 'other';
  duration_profile: TimeCourse;
  notes_short: string;           // plain language, no claims
  primary_mechanism_summary: string; // cautious phrasing
}
```

### 2) ActiveMetabolite Entity

```typescript
interface ActiveMetabolite {
  id: string;
  parent_substance_id: string;
  display_name: string;
  notes_short: string;
}
```

### 3) Target Entity

```typescript
interface Target {
  id: string;                    // e.g., "5ht2a", "nmdar", "sert"
  display_name: string;          // e.g., "5-HT2A", "NMDA receptor"
  type: 'receptor' | 'transporter' | 'ion_channel' | 'other';
  system: 'serotonin' | 'dopamine' | 'norepinephrine' | 'glutamate' | 'opioid' | 'sigma' | 'adrenergic' | 'other';
  family?: string;
  patient_friendly_label: string;
  patient_friendly_explainer: string; // 1-2 sentences
}
```

### 4) InteractionEvidence Entity (CORE TABLE)

```typescript
interface InteractionEvidence {
  id: string;
  substance_id: string;
  target_id: string;
  measurement_kind: 'Ki' | 'IC50' | 'EC50' | 'Emax' | 'qualitative' | 'unknown';
  value?: number;
  unit?: string;                 // e.g., "nM"
  direction: 'agonist' | 'partial_agonist' | 'antagonist' | 'inverse_agonist' | 
             'inhibitor' | 'releasing_agent' | 'modulator' | 'unknown';
  assay_type: 'binding' | 'functional' | 'in_vivo' | 'review_summary';
  species?: string;
  tissue_or_cell_line?: string;
  citation: Citation;
  confidence: 'high' | 'medium' | 'low';
  uncertainty_notes: string;
  tags: string[];                // e.g., "primary_target_candidate", "controversial"
}
```

### 5) Citation Entity

```typescript
interface Citation {
  id: string;
  title: string;
  authors?: string;
  year?: number;
  source_type: 'peer_reviewed' | 'label' | 'textbook' | 'database' | 'review';
  url?: string;
  doi?: string;
  quote_snippet?: string;        // short, avoid large quotes
}
```

### 6) TimeCourse Entity

```typescript
interface TimeCourse {
  substance_id: string;
  route: 'unspecified' | 'oral' | 'intranasal' | 'iv_im' | 'inhaled';
  onset_min_minutes?: number;
  peak_min_minutes?: number;
  duration_min_hours?: number;
  duration_max_hours?: number;
  half_life_hours?: number;
  active_metabolites: string[];  // metabolite ids
  confidence: 'high' | 'medium' | 'low';
  citation: Citation;
  notes: string;
}
```

---

## 🔧 BACKEND (PYTHON/FASTAPI) REQUIREMENTS

### API Endpoints

```python
# 1. GET /api/substances
# Returns list with id, display_name, class

# 2. GET /api/substances/{id}
# Returns full substance profile including time course summaries

# 3. GET /api/targets
# Returns all targets with grouping metadata

# 4. GET /api/interactions?substance_id=...&measurement_kind=Ki
# Returns evidence records for the selected measurement kind

# 5. GET /api/compare?substance_ids=...&measurement_kind=Ki
# Returns merged dataset for comparison view

# 6. GET /api/citations/{id}
# Returns citation metadata
```

### Backend Responsibilities

1. **Serve curated dataset**
2. **Convert units** where possible (e.g., µM to nM)
3. **Precompute normalized display values:**
   - `normalized_intensity` for heatmap
   - `rank` within system (serotonin, dopamine, etc.)
4. **Provide confidence mapping metadata** (frontend stays dumb)

### Validation (Run on startup or CI)

```python
# Assert every interaction has:
- valid substance_id and target_id
- confidence and citation
- recognized units if value is present
# Log warnings for qualitative-only entries
```

### Versioning

- Add `dataset_version` field to API responses
- Store changelog for evidence edits
- Prevents silent shifts in visuals

---

## 🎨 FRONTEND (REACT + TAILWIND) COMPONENT SPECIFICATION

### Global Layout

**Pages:**
1. `/explore` (default)
2. `/substance/:id`
3. `/compare`
4. `/about-methodology`

**Global UI Elements:**
- Top nav: "Explore", "Compare", "Methodology"
- View mode toggle: **Therapist** | **Patient**
- Measurement toggle: **Binding** | **Functional**
- Confidence legend and "How to read this" link

### Core Components

#### 1) SubstanceSelector

**Responsibilities:**
- Search and pick substance
- Show class tag and short mechanism summary
- Provide "Compare" add button

**UI Details:**
- Patient view: simplified names + 1 sentence
- Therapist view: aliases, class, citations badge

#### 2) TargetFingerprintHeatmap

**Responsibilities:**
- Render targets grouped by system (serotonin, dopamine, glutamate, etc.)
- Each target tile shows:
  - `intensity` = normalized interaction strength
  - `confidence` overlay (icon or border style)
  - `direction` icon/label (agonist, antagonist, etc.)
- On click: open **EvidenceDrawer**

**Interaction Rules:**
- Sorting: by system, by strongest interaction, by confidence
- Filters: high confidence only, primary targets only, transporters only

**Accessibility:**
- Readable without color alone
- Text labels + tooltip with numeric value

#### 3) RankedTargetsBarChart

**Responsibilities:**
- Ranked list of top N targets with bars
- Used in **patient view** by default (simpler than heatmap)

**Rules:**
- Limit to 8-12 targets in patient view
- Show "what this means" microcopy

#### 4) TimeCourseTimeline

**Responsibilities:**
- Render onset, peak, duration window
- Support route selector when available
- Show active metabolites if known

**UI Details:**
- Horizontal timeline with:
  - Onset marker
  - Peak range
  - Duration band
  - "After effects window" (optional, only if sourced)

**Guardrail Copy:**
- "Time ranges vary by person, dose, and route."
- "This chart is educational, not medical advice."

#### 5) MechanismMap

**Responsibilities:**
- Show 3 lanes with simplified cause chain:
  1. Primary target class
  2. Network-level description (high-level, cautious)
  3. Typical experience domains (plain language)
  4. Common monitoring concerns (non-alarmist)

**Design Requirement:**
- Visually separate:
  - Measured pharmacology (data-driven)
  - Interpretive mapping (author-curated)

#### 6) EvidenceDrawer (Modal or Side Panel)

**Responsibilities:**
- Show evidence list for selected substance-target pair
- Support multiple evidence rows if multiple sources exist
- Display:
  - `measurement_kind`, `value`, `unit`
  - `assay_type`
  - `direction`
  - `confidence` and `uncertainty_notes`
  - `citation` details and link
- Include "Why this may not generalize" section

#### 7) CompareView

**Responsibilities:**
- Compare up to 4 substances
- Support:
  - Heatmap comparison by target
  - Bar chart comparison for top targets
  - Time course comparison stacked

**Rules:**
- Maintain consistent target ordering across substances
- If data missing, show blank state (NOT implied zero)

#### 8) MethodologyPage

**Responsibilities:**
- Explain data sources approach
- Define Ki, IC50, Emax in plain language
- Explain normalization and confidence scoring
- Explain limitations and "do not use for decisions" disclaimers

**Purpose:** Reduces legal and reputational risk

---

## 🎨 TAILWIND DESIGN SYSTEM REQUIREMENTS

### Layout and Typography

- Consistent spacing scale: 4, 8, 12, 16
- Cards for each visualization section
- Clear headings and short paragraphs

### Color and Meaning

**CRITICAL RULE:** Color cannot imply clinical "good" or "bad"

- Use **intensity** for "strength of interaction"
- Use **separate styling** for confidence:
  - High: solid border
  - Medium: dashed border
  - Low: dotted border
- Use **icons or labels** for direction

### States

- **Loading:** Skeletons for charts
- **Empty data:** "No sourced data available for this target"
- **Error:** "Data failed to load, retry"

---

## 📐 DATA PROCESSING RULES (CRITICAL)

### Rule 1: Separate Binding from Functional Data

- Ki ≠ EC50
- Never blend without labeling

**UI Requirement:**
- Default view: binding (Ki) where available
- Toggle to functional effects (EC50, Emax) where available

### Rule 2: Normalize Only Within Measurement Kind

**For heatmaps, use log scale normalization:**

```python
# Example for Ki in nM:
1. Convert all values to nM
2. Transform: pKi = -log10(Ki in molar)
3. Clamp to reasonable range for display
4. Map to intensity 0 to 1
```

**If Ki missing:** show as "no data", NOT zero

### Rule 3: Confidence Gating

- **High:** multiple consistent sources OR strong primary source
- **Medium:** single decent source OR review summary
- **Low:** inconsistent, indirect, old, or unclear assay details

**UI must visually encode confidence separately from intensity**

### Rule 4: Citations Are First-Class

Every tile or bar must open evidence drawer showing:
- `measurement_kind`, `value`, `unit`
- `assay_type`
- `direction`
- `confidence` and `uncertainty_notes`
- `citation` link

---

## 🚀 IMPLEMENTATION PLAN (STEP-BY-STEP)

### Step 1: Confirm Data Contract

1. Create JSON schema files for all entities
2. Build minimal dataset for 2 substances (psilocybin + ketamine) to validate UI

**Acceptance Criteria:**
- API returns data with citations
- Heatmap renders without missing key fields

### Step 2: Build Backend Service

1. Create FastAPI app with all endpoints
2. Add unit conversion utilities
3. Add normalization functions per `measurement_kind`
4. Add validation script run in CI

**Acceptance Criteria:**
- `/api/substances` and `/api/interactions` work correctly
- Invalid records fail validation

### Step 3: Build Frontend Skeleton

1. Tailwind layout, routing, page shells
2. Substance selection and routing to substance page
3. Implement **EvidenceDrawer first** (forces correct data discipline)

**Acceptance Criteria:**
- Evidence is inspectable with citations before any chart is "pretty"

### Step 4: Build TargetFingerprint Visualization

1. Implement grouped heatmap with accessibility
2. Implement ranked bars for patient view
3. Add filters and sorters

**Acceptance Criteria:**
- Clicking any tile opens evidence with citation
- Confidence visible and not conflated with intensity

### Step 5: Build TimeCourseTimeline

1. Render bands and markers from TimeCourse
2. Add route selection if multiple profiles exist
3. Add compare timeline in CompareView

**Acceptance Criteria:**
- Timeline communicates ranges clearly
- Missing data yields explicit "unknown" states

### Step 6: Build MechanismMap

1. Build curated content blocks by class lane
2. Add connections to "what targets matter most" via chips
3. Ensure all interpretive text labeled as "educational summary"

**Acceptance Criteria:**
- Clear separation between measured data and curated interpretation

### Step 7: Compare Mode

1. Add compare tray (up to 4 substances)
2. Heatmap comparison with fixed target list
3. Timeline comparison

**Acceptance Criteria:**
- Comparable targets align across substances
- Missing data does not mislead

### Step 8: Methodology Page and Final QA

1. Add methodology content and glossary
2. Test with mixed datasets (qualitative only, conflicting evidence)

**Acceptance Criteria:**
- No runtime crashes
- UI never implies certainty where confidence is low

---

## ✅ ACCEPTANCE CRITERIA

### Data Integrity

- [ ] Every interaction has a citation
- [ ] Units are consistent or convertible
- [ ] Confidence present on all records
- [ ] No duplicates without explanation
- [ ] Validation script passes in CI

### UI Functionality

- [ ] Heatmap works with keyboard navigation
- [ ] Tooltips show numeric values in therapist view
- [ ] Patient view hides complexity by default
- [ ] Evidence drawer always reachable
- [ ] View mode toggle works (Therapist/Patient)
- [ ] Measurement toggle works (Binding/Functional)

### Safety and Compliance

- [ ] All required guardrail copy present
- [ ] No prohibited language used
- [ ] High intensity does not visually look like "good"
- [ ] Low confidence still displays as low confidence even if intensity high
- [ ] Missing data does not display as zero
- [ ] Citations accessible for every data point

### Export

- [ ] Export visualization as PNG or SVG
- [ ] (Optional) Export substance summary PDF

---

## 📝 MANDATORY COMPLIANCE

### Accessibility (WCAG AAA)

- Minimum 12px font size
- Keyboard accessible
- Screen reader friendly
- Sufficient color contrast
- ARIA labels where needed
- Must be readable without color alone

### Security & Privacy

- No PHI/PII collection
- No user-entered dosing
- No personal medical info fields

---

## 🚦 Status

**INBOX** - Awaiting LEAD architectural review and assignment to DESIGNER

---

## 📋 DELIVERABLES

1. **Running React app** with pages:
   - Explore
   - Substance detail
   - Compare
   - Methodology

2. **Python API service** serving dataset and computed fields

3. **Dataset starter pack** for all listed substances
   - Placeholders allowed only if labeled "unknown"
   - Excluded from charts by default

4. **Documentation:**
   - Data schema
   - Confidence scoring rubric
   - How to add new evidence record safely

---

## 🔬 QA CHECKLIST AND TESTS

### Data Integrity Tests

- [ ] Every interaction has citation
- [ ] Units consistent or convertible
- [ ] Confidence present
- [ ] No unexplained duplicates

### UI Tests

- [ ] Heatmap keyboard navigation
- [ ] Tooltips in therapist view
- [ ] Patient view simplification
- [ ] Evidence drawer reachable

### Misinterpretation Tests

- [ ] High intensity ≠ visually "good"
- [ ] Low confidence visible even with high intensity
- [ ] Missing data ≠ zero

---

## 📚 TECHNICAL STACK

**Backend:**
- Python 3.11+
- FastAPI
- Pydantic for validation
- JSON files for MVP (Postgres later)

**Frontend:**
- React 18+
- TypeScript
- Tailwind CSS
- React Router
- D3, Recharts, or Visx (pick one)
- SVG for export capability

**Charts Library:** Pick ONE and stick to it
- D3.js (most flexible)
- Recharts (easier, less control)
- Visx (Airbnb's D3 wrapper)

---

## 🎯 DESIGN PHILOSOPHY

**Core Principle:**

> "Every plotted value must be traceable to a source record with measurement type, assay context, citation, confidence score, and notes describing limitations."

**If you cannot cite it:**
- You can still show it ONLY if flagged as "hypothesis"
- Clearly separated from measured data

**Credibility over aesthetics:**
- Prioritize traceability and defensibility
- Predictable UI behavior
- Uncertainty labeling
- Citation accessibility

---

## 📖 NOTES

This is a **high-complexity, high-impact feature** that requires:

1. **Rigorous data discipline** - No shortcuts on citations or confidence
2. **Clear separation of concerns** - Measured vs interpreted data
3. **Accessibility first** - Color cannot be the only signal
4. **Legal/ethical guardrails** - No medical advice, no outcome predictions
5. **Iterative validation** - Start with 2 substances, validate, then scale

**The challenge is not charting—it's turning heterogeneous pharmacology evidence into a consistent, explainable, defensible representation.**

---

## Dependencies

**Prerequisites:**
- None - This is a new standalone module

**Future Integration:**
- May integrate with Protocol Builder for substance selection
- May integrate with Safety Matrix for interaction checking

---

## Estimated Timeline

- **Step 1-2 (Backend + Data):** 2-3 weeks
- **Step 3-4 (Frontend skeleton + Fingerprint):** 2-3 weeks
- **Step 5-6 (Timeline + Mechanism):** 1-2 weeks
- **Step 7-8 (Compare + QA):** 1-2 weeks

**Total:** 6-10 weeks for full implementation

---

## Risk Mitigation

**Risk:** Incomplete or low-quality pharmacology data
**Mitigation:** Start with 2 substances, validate data model, then scale

**Risk:** Misinterpretation of visualizations
**Mitigation:** Mandatory guardrail copy, confidence labeling, evidence drawer

**Risk:** Legal liability for medical advice
**Mitigation:** Explicit disclaimers, no dosing, no contraindications, educational only

**Risk:** Scope creep
**Mitigation:** Strict non-goals list, phased implementation plan

---

## 🏗️ LEAD ARCHITECTURE

### Strategic Overview

This is a **flagship feature** - the most complex work order in the system (10/10 complexity). This requires:
- Multi-agent coordination (DESIGNER → SOOP → BUILDER → INSPECTOR)
- 6-10 week timeline
- Rigorous data discipline
- Legal/ethical guardrails
- Phased implementation with validation gates

### Routing Decision

This ticket is **too large** to assign directly to BUILDER. We need **DESIGNER first** to create:
1. UI/UX design specs for all 4 core visualizations
2. Component architecture and interaction patterns
3. Visual design system for pharmacology module
4. Accessibility strategy (color-blind safe, WCAG AAA)

**DESIGNER's deliverables will become the blueprint for SOOP (data model) and BUILDER (implementation).**

### Phased Implementation Strategy

**Phase 1: Design & Architecture (DESIGNER)** ← **CURRENT PHASE**
- Create UI/UX specs for:
  - Target Fingerprint Heatmap
  - Ranked Targets Bar Chart
  - Time Course Timeline
  - Mechanism Map
  - Evidence Drawer
  - Compare View
- Define visual design system (colors, typography, spacing)
- Create accessibility strategy
- Design therapist vs patient view modes
- **Deliverable:** Design specs document + mockups

**Phase 2: Data Model & Backend (SOOP)**
- Design database schema for all entities
- Create FastAPI endpoints
- Build validation system
- Implement unit conversion utilities
- Create starter dataset for 2 substances (psilocybin + ketamine)
- **Deliverable:** Working API + migration scripts

**Phase 3: Frontend Implementation (BUILDER)**
- Build React components per DESIGNER specs
- Integrate with SOOP's API
- Implement all visualizations
- Build evidence drawer and citation system
- **Deliverable:** Working frontend

**Phase 4: QA & Compliance (INSPECTOR)**
- Accessibility audit (WCAG AAA)
- Legal/ethical compliance review
- Data integrity verification
- Performance testing
- **Deliverable:** Production approval

### Critical Architectural Decisions

**1. Design-First Approach**
This is NOT a "build and iterate" project. The visualizations must be:
- Scientifically rigorous
- Legally defensible
- Accessibility compliant
- Color-blind safe

**DESIGNER must create the blueprint before any code is written.**

**2. Data Integrity is Non-Negotiable**
Every data point must have:
- Citation
- Confidence score
- Measurement type
- Uncertainty notes

**SOOP must build validation that enforces this at the database level.**

**3. No Medical Advice**
Every UI must include disclaimers:
- "Educational content only. Not medical advice."
- "Receptor binding does not predict outcomes for an individual."
- "Evidence quality varies. Check citations and confidence."

**INSPECTOR must verify all guardrail copy before production.**

### Handoff to DESIGNER

**DESIGNER:** This is the most complex design task in the system. Your deliverables will guide the entire implementation.

**Your Task:**
1. Read the entire ticket (all 734 lines)
2. Create design specs for all 7 core components
3. Define visual design system for pharmacology module
4. Create accessibility strategy (color-blind safe, WCAG AAA)
5. Design therapist vs patient view modes
6. Create mockups/wireframes for all pages

**Key Design Constraints:**
- ✅ Color cannot imply clinical "good" or "bad"
- ✅ Confidence must be visually separate from intensity
- ✅ Missing data must show as "no data" (not zero)
- ✅ Every data point must be clickable to show evidence
- ✅ Must work without color alone (patterns, icons, labels)
- ✅ Minimum 12px font size everywhere

**Deliverable Format:**
Create a new section in this ticket titled `## DESIGNER DELIVERABLES` with:
1. Component design specs (all 7 components)
2. Visual design system (colors, typography, spacing)
3. Accessibility strategy
4. Therapist vs Patient view mode designs
5. Mockups/wireframes (can use generate_image tool)

**When complete:** Move ticket to `04_QA` for LEAD review before proceeding to Phase 2 (SOOP).

**Estimated Time:** 2-3 weeks

---

**LEAD STATUS:** ✅ Architecture complete. Routed to DESIGNER for Phase 1 (Design & Architecture).

