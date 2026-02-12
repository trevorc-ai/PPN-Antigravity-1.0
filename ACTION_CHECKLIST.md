# PPN Research Portal - Immediate Action Checklist
**Generated:** February 8, 2026  
**Based on:** Full Site Audit

---

## 🔴 CRITICAL - Do Today

- [ ] **Install Dependencies**
  ```bash
  npm install
  ```
  **Status:** node_modules missing, app won't run
  **Location:** Project root
  **Time:** 2-3 minutes

- [ ] **Test Dev Server**
  ```bash
  npm run dev
  ```
  **Expected:** Server starts on http://localhost:3000
  **If fails:** Check console errors

- [ ] **Review ProtocolBuilder Free-Text Fields**
  **File:** `src/pages/ProtocolBuilder.tsx`
  **Lines:** 632-642 (concurrent medications)
  **Issue:** Violates NO FREE-TEXT rule
  **Action:** Plan replacement with ref_medications dropdown

---

## 🟡 HIGH PRIORITY - This Week

### Database Schema

- [ ] **Create ref_substances Table**
  **Reason:** ProtocolBuilder substance dropdown needs this
  **Columns:** substance_id, substance_name, rxnorm_cui
  **Reference:** SCHEMA_ANALYSIS.md line 34

- [ ] **Create sites Table**
  **Reason:** Required for site isolation
  **Columns:** site_id, site_name, region, status
  **Reference:** User rules - site isolation requirement

- [ ] **Create user_sites Table**
  **Reason:** Required for role-based access
  **Columns:** user_id, site_id, role
  **Reference:** User rules - role management

- [ ] **Create log_clinical_records Table**
  **Reason:** ProtocolBuilder needs somewhere to save data
  **Reference:** SCHEMA_ANALYSIS.md lines 87-99

### Authentication

- [x] **Build Password Recovery Flow** ✅ COMPLETE
  **Files:** `src/pages/ForgotPassword.tsx`, `src/pages/ResetPassword.tsx`
  **Features:** 
  - Email submission with Supabase integration
  - Token validation and security checks
  - Password strength indicator
  - Show/hide password toggles
  - Success states with auto-redirect
  - "Forgot Password?" link added to Login page
  **Routes:** `/forgot-password`, `/reset-password` added to App.tsx
  **Design:** Matches PPN design system (glassmorphism, dark theme)
  **Completed:** 2026-02-09

### Frontend Fixes

- [x] **Fix Analytics.tsx Container**
  **File:** `src/pages/Analytics.tsx`
  **Change:** Add `max-w-7xl` container
  **Reference:** DESIGN_SYSTEM.md line 108

- [x] **Fix ProtocolDetail.tsx Width**
  **File:** `src/pages/ProtocolDetail.tsx`
  **Change:** Reduce from `max-w-[1800px]` to `max-w-[1600px]`
  **Reference:** DESIGN_SYSTEM.md line 113

- [x] **Fix Notifications.tsx Width**
  **File:** `src/pages/Notifications.tsx`
  **Change:** Change from `max-w-[1400px]` to `max-w-7xl`
  **Reference:** DESIGN_SYSTEM.md line 115

- [x] **Fix InteractionChecker.tsx Width**
  **File:** `src/pages/InteractionChecker.tsx`
  **Change:** Increase from `max-w-[1200px]` to `max-w-[1600px]`
  **Reference:** DESIGN_SYSTEM.md line 114

- [x] **Fix SubstanceCatalog.tsx Container**
  **File:** `src/pages/SubstanceCatalog.tsx`
  **Change:** Add `max-w-7xl` container
  **Reference:** DESIGN_SYSTEM.md line 118

---

## 🟢 MEDIUM PRIORITY - Next 2 Weeks (Simplified Plan)

### Week 1: Core Utilities & Authentication

- [ ] **Build Data Export Manager** 🎯 PRIORITY 1
  **File:** Create `src/pages/DataExport.tsx`
  **Features:** 
  - Date range + substance + indication filters
  - CSV/JSON export generation
  - Export history table with download links
  - Automatic PII scrubbing + audit logging
  **Time:** 1 day
  **Reference:** Mockup analysis 2026-02-09 (Mockup 7)

- [ ] **Expand Documentation Hub**
  **File:** Enhance `src/pages/HelpFAQ.tsx`
  **Add:**
  - Clinical coding reference (SNOMED-CT, RxNorm glossary)
  - Quick reference sidebar
  - Search functionality (⌘K shortcut)
  - Popular topics section
  **Time:** 1-2 days
  **Reference:** Mockup analysis 2026-02-09 (Mockup 2)

- [ ] **Enhance Notifications Page**
  **File:** `src/pages/Notifications.tsx`
  **Add:**
  - Priority categorization (Safety/Clinical/System)
  - Color-coded borders (red/blue/gray)
  - Action buttons per notification type
  - Badge counts per category
  **Time:** 1 day
  **Reference:** Mockup analysis 2026-02-09 (Mockup 3)

### Week 2: Safety & Compliance

- [ ] **Build Safety Surveillance Matrix** 🎯 PRIORITY 2
  **File:** Enhance `src/pages/deep-dives/SafetySurveillancePage.tsx`
  **Add:**
  - Risk heatmap (Frequency × Severity)
  - Severity distribution donut chart
  - Recent safety events table
  - Top metrics cards (Active Protocols, Risk Index, SAE count)
  **Time:** 2 days
  **Reference:** Mockup analysis 2026-02-09 (Mockup 9)

- [ ] **Create Safety Event Detail Page**
  **File:** Create `src/pages/SafetyEventDetail.tsx`
  **Features:**
  - Event header (ID, type, severity grade)
  - Intervention context (substance, dose, protocol)
  - Subject attributes (de-identified)
  - Clinical assessment (causality, outcome, action taken)
  - Network context comparison
  **Time:** 1-2 days
  **Reference:** Mockup analysis 2026-02-09 (Mockup 8)

- [ ] **Add Basic Range Validation to ProtocolBuilder**
  **File:** `src/pages/ProtocolBuilder.tsx`
  **Add:**
  - Client-side range validation for dosages
  - Warning alerts for out-of-range values
  - Log validation warnings to audit table
  **Time:** 1 day
  **Note:** Simplified alternative to complex override workflow

### Security & Compliance

- [ ] **Implement RLS Policies**
  **Tables:** sites, user_sites, log_clinical_records
  **Policies:** Site isolation, role-based access
  **Reference:** User rules - RLS expectations

- [ ] **Add Subject Identity Validation**
  **File:** `src/pages/ProtocolBuilder.tsx`
  **Function:** `handleIdentityChange` (line 574)
  **Add:** Regex validation to reject common PHI patterns
  **Patterns to block:** Email, phone, SSN, name patterns

- [ ] **Create .env.example**
  **File:** `.env.example`
  **Content:**
  ```
  VITE_SUPABASE_URL=your_supabase_url_here
  VITE_SUPABASE_ANON_KEY=your_anon_key_here
  ```

### Documentation

- [ ] **Expand README.md**
  **Add:**
  - Project overview and goals
  - Architecture diagram
  - Database setup instructions
  - Development workflow
  - Deployment process

- [ ] **Review WORKSPACE_RULES.md**
  **Ensure:** All team members understand zero-deletion policy

---

## 📊 METRICS TO TRACK

### Code Quality
- [ ] TypeScript coverage: **100%** ✅
- [ ] Test coverage: **0%** ❌ (add Vitest)
- [ ] Accessibility score: **Strong** ✅
- [ ] Design system compliance: **13/20 pages** 🟡

### Database
- [ ] Schema completion: **8/18 tables** (44%) 🟡
- [ ] RLS policies: **4/18 tables** (22%) 🟡
- [ ] FHIR alignment: **0%** ❌

### Security
- [ ] PHI/PII protection: **Partial** 🟡
- [ ] Free-text inputs: **1 found** ❌
- [ ] Auth implementation: **Partial** 🟡
- [ ] Role-based access: **Not implemented** ❌

---

## 🎯 SUCCESS CRITERIA

### MVP Ready Checklist
- [ ] All dependencies installed
- [ ] Dev server runs without errors
- [ ] No free-text inputs in ProtocolBuilder
- [ ] ref_substances table created and populated
- [ ] sites and user_sites tables created
- [ ] RLS policies implemented for site isolation
- [ ] ProtocolBuilder saves to log_clinical_records
- [ ] All 7 design system inconsistencies fixed
- [ ] README.md expanded with setup instructions
- [ ] .env.example created

### Production Ready Checklist (Future)
- [ ] All analytics wired to real data
- [ ] Testing framework added (Vitest)
- [ ] Error boundary implemented
- [ ] Code splitting for performance
- [ ] FHIR resource alignment
- [ ] OMOP CDM mappings
- [ ] CI/CD pipeline
- [ ] Security audit completed
- [ ] Penetration testing
- [ ] HIPAA compliance review

---

## 📞 QUESTIONS TO RESOLVE

1. **Google GenAI Dependency**
   - Is @google/genai being used? (NeuralCopilot component)
   - If not, remove from package.json

2. **Auth Bypass**
   - When should dev bypass be removed?
   - What's the production auth flow?

3. **Analytics Data**
   - Should analytics use real data now or wait for schema completion?
   - What's the priority order for wiring components?

4. **Testing Strategy**
   - What test coverage target? (80%? 90%?)
   - E2E testing needed before production?

5. **Deployment**
   - Where will this be deployed? (Vercel, Netlify, custom?)
   - What's the deployment pipeline?

---

## 📁 FILES TO REVIEW

### Critical Files
1. `src/pages/ProtocolBuilder.tsx` - 65,968 bytes, needs storage wiring
2. `src/lib/supabase.ts` - Supabase client config
3. `src/contexts/AuthContext.tsx` - Auth implementation
4. `schema.sql` - Current database schema
5. `SCHEMA_ANALYSIS.md` - Gap analysis and recommendations

### Documentation Files
1. `DESIGN_SYSTEM.md` - Design standards (726 lines)
2. `WORKSPACE_RULES.md` - Development constraints (43 lines)
3. `README.md` - Needs expansion (21 lines)
4. `SITE_AUDIT_2026-02-08.md` - Full audit report

---

## 🚀 QUICK WINS (< 1 Hour Each)

1. ✅ Run `npm install`
2. ✅ Test dev server
3. ✅ Create .env.example
4. ✅ Fix Analytics.tsx container width
5. ✅ Fix Notifications.tsx container width
6. ✅ Fix SubstanceCatalog.tsx container width

---

## 🔵 DEFERRED TO PHASE 2 (Post-MVP)

### Complex Features - Defer Until Network Established

- [ ] **Data Quality Override Workflow**
  **Reason:** High complexity (validation engine, approval workflows, audit integration)
  **Alternative:** Basic range validation warnings in ProtocolBuilder
  **Reference:** Mockup analysis 2026-02-09 (Mockup 6)

- [ ] **Protocol Consensus Development Platform**
  **Reason:** Very high complexity (versioning, multi-phase workflow, community voting)
  **Requires:** Established network with multiple active sites
  **Reference:** Mockup analysis 2026-02-09 (Mockup 1)

- [ ] **Clinical Dictionary Management UI**
  **Reason:** Medium complexity, can manage via database admin initially
  **Alternative:** Direct database updates to ref_substances table
  **Future:** Add mapping UI after MVP stable
  **Reference:** Mockup analysis 2026-02-09 (Mockup 10)

- [ ] **Multi-Site Clinic Comparison Dashboard**
  **Reason:** Requires multiple active sites with sufficient data
  **Minimum:** 3+ sites with 6+ months of data
  **Reference:** Mockup analysis 2026-02-09 (Mockup 5)

- [ ] **Network Benchmarking Features**
  **Reason:** Requires aggregated network data
  **Enhancement:** Add to Analytics.tsx after network data available
  **Reference:** Mockup analysis 2026-02-09 (Mockup 4)

---

**Next Review:** After completing CRITICAL and HIGH PRIORITY items  
**Estimated Time to MVP:** 2-3 weeks  
**Estimated Time to Production:** 4-6 weeks

