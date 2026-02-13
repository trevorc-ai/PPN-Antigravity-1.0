# 🛠️ FULL STABILIZATION PLAN
**Date:** 2026-02-09 19:47 PST  
**Status:** READY TO EXECUTE  
**Total Time:** 19 hours  
**Timeline:** 1 week

---

## 📋 **ROLE ASSIGNMENTS**

### **DESIGNER Tasks** (Frontend/UI)
- Fix broken navigation
- Update components to use Supabase
- Replace mock data with real queries
- **Total:** 12 hours

### **BUILDER Tasks** (Database/Backend)
- Create missing tables
- Write migrations
- Seed reference data
- **Total:** 7 hours

---

# 🎯 WEEK 1: CRITICAL BLOCKERS

## **DAY 1: HEADER NAVIGATION FIX** (3 hours)

### **DESIGNER: Fix Broken Header Icons**
**File:** `src/components/TopHeader.tsx`  
**Time:** 3 hours  
**Priority:** 🔴 CRITICAL

#### **Step 1: Disable Non-Functional Icons** (30 min)

**Location:** Lines 137-178

**Current Code:**
```tsx
<NavIconButton
  icon="search"
  label="Search Registry"
  tooltip="Global Search"
  onClick={() => navigate('/advanced-search')}  // ❌ Page doesn't exist
/>
```

**Replace With:**
```tsx
{/* SEARCH - Temporarily disabled until page exists */}
<div id="tour-search-node" className="contents">
  <NavIconButton
    icon="search"
    label="Search Registry"
    tooltip="Coming Soon"
    onClick={() => {
      // Temporary: redirect to existing search
      navigate('/search-portal');
    }}
  />
</div>

{/* NOTIFICATIONS - Temporarily disabled */}
<div id="tour-notifications" className="contents">
  <NavIconButton
    icon="notifications"
    label="Notifications"
    tooltip="Coming Soon"
    badge={false}  // Remove badge until functional
    onClick={() => {
      alert('Notifications feature coming soon!');
    }}
  />
</div>

{/* HELP - Temporarily disabled */}
<div id="tour-help-node" className="contents">
  <NavIconButton
    icon="help"
    label="Help & Support"
    tooltip="Coming Soon"
    onClick={() => {
      alert('Help center coming soon! Contact support@ppn-research.org');
    }}
  />
</div>
```

**Testing Checklist:**
- [ ] Click search icon → redirects to `/search-portal`
- [ ] Click notifications → shows "coming soon" alert
- [ ] Click help → shows "coming soon" alert with email
- [ ] No 404 errors
- [ ] Tooltips show "Coming Soon"

---

#### **Step 2: Create Placeholder Pages** (2.5 hours)

**Option A: Simple Placeholder (Recommended for now)**

Create three new files:

**File 1:** `src/pages/AdvancedSearch.tsx`
```tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';

const AdvancedSearch: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <PageContainer width="wide" className="py-20">
        <Section spacing="spacious">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center size-24 rounded-3xl bg-primary/10 border-2 border-primary/20 mb-6">
              <span className="material-symbols-outlined text-5xl text-primary">search</span>
            </div>
            
            <h1 className="text-5xl font-black tracking-tighter">Advanced Search</h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Advanced search functionality is currently in development. Use the{' '}
              <button 
                onClick={() => navigate('/search-portal')}
                className="text-primary hover:underline font-bold"
              >
                Research Portal
              </button>
              {' '}for basic search capabilities.
            </p>
            
            <div className="pt-8">
              <button
                onClick={() => navigate('/search-portal')}
                className="px-8 py-4 bg-primary hover:bg-blue-600 text-white text-sm font-black rounded-2xl uppercase tracking-widest transition-all shadow-2xl shadow-primary/20"
              >
                Go to Research Portal
              </button>
            </div>
          </div>
        </Section>
      </PageContainer>
    </div>
  );
};

export default AdvancedSearch;
```

**File 2:** `src/pages/Notifications.tsx`
```tsx
import React from 'react';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';

const Notifications: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <PageContainer width="wide" className="py-20">
        <Section spacing="spacious">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center size-24 rounded-3xl bg-indigo-500/10 border-2 border-indigo-500/20 mb-6">
              <span className="material-symbols-outlined text-5xl text-indigo-400">notifications</span>
            </div>
            
            <h1 className="text-5xl font-black tracking-tighter">Notifications</h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Real-time notification system is currently in development. You'll receive alerts for:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
              <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl">
                <span className="material-symbols-outlined text-3xl text-primary mb-3 block">security</span>
                <h3 className="text-lg font-black mb-2">Safety Alerts</h3>
                <p className="text-sm text-slate-400">Network-wide adverse event patterns</p>
              </div>
              
              <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl">
                <span className="material-symbols-outlined text-3xl text-clinical-green mb-3 block">update</span>
                <h3 className="text-lg font-black mb-2">Protocol Updates</h3>
                <p className="text-sm text-slate-400">Changes to your active protocols</p>
              </div>
              
              <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl">
                <span className="material-symbols-outlined text-3xl text-accent-amber mb-3 block">gavel</span>
                <h3 className="text-lg font-black mb-2">Regulatory News</h3>
                <p className="text-sm text-slate-400">FDA updates and compliance changes</p>
              </div>
            </div>
          </div>
        </Section>
      </PageContainer>
    </div>
  );
};

export default Notifications;
```

**File 3:** `src/pages/Help.tsx`
```tsx
import React from 'react';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';

const Help: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <PageContainer width="wide" className="py-20">
        <Section spacing="spacious">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center size-24 rounded-3xl bg-clinical-green/10 border-2 border-clinical-green/20 mb-6">
              <span className="material-symbols-outlined text-5xl text-clinical-green">support_agent</span>
            </div>
            
            <h1 className="text-5xl font-black tracking-tighter">Help & Support</h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Need assistance? Our support team is here to help.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-8">
              <div className="p-8 bg-slate-900/40 border border-white/5 rounded-2xl text-left">
                <span className="material-symbols-outlined text-3xl text-primary mb-4 block">mail</span>
                <h3 className="text-lg font-black mb-2">Email Support</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Get help via email within 24 hours
                </p>
                <a 
                  href="mailto:support@ppn-research.org"
                  className="text-primary hover:underline font-bold text-sm"
                >
                  support@ppn-research.org
                </a>
              </div>
              
              <div className="p-8 bg-slate-900/40 border border-white/5 rounded-2xl text-left">
                <span className="material-symbols-outlined text-3xl text-clinical-green mb-4 block">menu_book</span>
                <h3 className="text-lg font-black mb-2">Documentation</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Comprehensive guides and tutorials
                </p>
                <p className="text-sm text-slate-500">Coming soon</p>
              </div>
            </div>
          </div>
        </Section>
      </PageContainer>
    </div>
  );
};

export default Help;
```

**Step 3: Register Routes**

**File:** `src/App.tsx`

Add these imports:
```tsx
import AdvancedSearch from './pages/AdvancedSearch';
import Notifications from './pages/Notifications';
import Help from './pages/Help';
```

Add these routes (find the `<Routes>` section):
```tsx
<Route path="/advanced-search" element={<AdvancedSearch />} />
<Route path="/notifications" element={<Notifications />} />
<Route path="/help" element={<Help />} />
```

**Testing Checklist:**
- [ ] All three pages load without errors
- [ ] Navigation from header works
- [ ] Pages show "coming soon" messaging
- [ ] No console errors
- [ ] Responsive on mobile

---

## **DAY 2: PROTOCOL BUILDER DATABASE** (2 hours)

### **BUILDER: Create Protocols Table**
**Time:** 2 hours  
**Priority:** 🔴 CRITICAL

#### **Step 1: Create Migration File** (30 min)

**File:** `migrations/004_create_protocols_table.sql`

```sql
-- ============================================================================
-- PROTOCOLS TABLE - MIGRATION 004
-- ============================================================================
-- Purpose: Create protocols table for Protocol Builder form submissions
-- Date: 2026-02-09
-- Safe to run: YES (Add-only, non-destructive)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- SECTION 1: CREATE PROTOCOLS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.protocols (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  
  -- User reference (from Supabase auth)
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Protocol metadata
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'discontinued')),
  
  -- Substance & Dosing
  substance TEXT NOT NULL,
  indication TEXT,
  dosage TEXT NOT NULL,
  dosage_unit TEXT NOT NULL,
  frequency TEXT NOT NULL,
  route TEXT NOT NULL,
  
  -- Demographics (de-identified)
  subject_age TEXT,
  sex TEXT,
  race TEXT,
  weight_range TEXT,
  smoking_status TEXT,
  
  -- Clinical Context
  setting TEXT,
  prep_hours NUMERIC,
  integration_hours NUMERIC,
  modalities TEXT[], -- Array of support modality names
  concomitant_meds TEXT[], -- Array of medication names
  
  -- Outcomes
  phq9_score INTEGER CHECK (phq9_score BETWEEN 0 AND 27),
  difficulty_score INTEGER CHECK (difficulty_score BETWEEN 1 AND 10),
  
  -- Safety
  has_safety_event BOOLEAN DEFAULT FALSE,
  safety_event_description TEXT,
  severity TEXT,
  resolution TEXT,
  
  -- Consent
  consent_verified BOOLEAN NOT NULL DEFAULT FALSE,
  consent_timestamp TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECTION 2: CREATE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_protocols_user_id ON public.protocols(user_id);
CREATE INDEX IF NOT EXISTS idx_protocols_substance ON public.protocols(substance);
CREATE INDEX IF NOT EXISTS idx_protocols_status ON public.protocols(status);
CREATE INDEX IF NOT EXISTS idx_protocols_created_at ON public.protocols(created_at DESC);

-- ============================================================================
-- SECTION 3: ENABLE RLS
-- ============================================================================

ALTER TABLE public.protocols ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own protocols
CREATE POLICY "protocols_user_select"
ON public.protocols FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy: Users can only insert their own protocols
CREATE POLICY "protocols_user_insert"
ON public.protocols FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy: Users can only update their own protocols
CREATE POLICY "protocols_user_update"
ON public.protocols FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy: Users can only delete their own protocols
CREATE POLICY "protocols_user_delete"
ON public.protocols FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- ============================================================================
-- SECTION 4: CREATE UPDATED_AT TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_protocols_updated_at
BEFORE UPDATE ON public.protocols
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SECTION 5: VERIFICATION
-- ============================================================================

-- Verify table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'protocols'
    ) THEN
        RAISE NOTICE '✅ protocols table created successfully';
    ELSE
        RAISE EXCEPTION '❌ protocols table creation failed';
    END IF;
END $$;

-- ============================================================================
-- ROLLBACK SCRIPT (if needed)
-- ============================================================================

-- To rollback this migration, run:
-- DROP TRIGGER IF EXISTS update_protocols_updated_at ON public.protocols;
-- DROP FUNCTION IF EXISTS update_updated_at_column();
-- DROP TABLE IF EXISTS public.protocols CASCADE;
```

#### **Step 2: Apply Migration** (10 min)

1. Open Supabase Dashboard → SQL Editor
2. Copy the entire migration file
3. Click "Run"
4. Verify success message: "✅ protocols table created successfully"

#### **Step 3: Verify Table Structure** (10 min)

Run this query to verify:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'protocols'
ORDER BY ordinal_position;
```

Expected output: 30+ columns including `id`, `user_id`, `substance`, `dosage`, etc.

---

### **DESIGNER: Update Protocol Builder to Use New Table**
**File:** `src/pages/ProtocolBuilder.tsx`  
**Time:** 1 hour  
**Priority:** 🔴 CRITICAL

#### **Step 1: Fix Field Mapping Bug** (15 min)

**Location:** Line 685

**BEFORE (BROKEN):**
```tsx
safety_criteria: formData.hasSafetyEvent ? {
  event: formData.safetyEventDescription,
  severity: formData.severity,
  resolution: formData.resolution  // ❌ WRONG - field doesn't exist
} : null
```

**AFTER (FIXED):**
```tsx
// Remove the JSONB object, use flat fields instead
has_safety_event: formData.hasSafetyEvent,
safety_event_description: formData.safetyEventDescription || null,
severity: formData.severity || null,
resolution: formData.resolutionStatus || null,  // ✅ CORRECT field name
```

#### **Step 2: Update Payload Structure** (45 min)

**Location:** Lines 670-711

**Replace entire `protocolPayload` with:**
```tsx
const protocolPayload = {
  user_id: user?.id,
  name: `${formData.substance} Protocol - ${formData.subjectId}`,
  substance: formData.substance,
  indication: formData.indication || null,
  status: 'active',
  
  // Dosing (flat fields, not JSONB)
  dosage: formData.dosage,
  dosage_unit: formData.dosageUnit,
  frequency: formData.frequency,
  route: formData.route,
  
  // Demographics (flat fields)
  subject_age: formData.subjectAge,
  sex: formData.sex,
  race: formData.race,
  weight_range: formData.weightRange,
  smoking_status: formData.smokingStatus,
  
  // Context (flat fields + arrays)
  setting: formData.setting,
  prep_hours: formData.prepHours ? parseFloat(formData.prepHours) : null,
  integration_hours: formData.integrationHours ? parseFloat(formData.integrationHours) : null,
  modalities: formData.modalities || [],
  concomitant_meds: formData.concomitantMeds 
    ? formData.concomitantMeds.split(',').map(m => m.trim()).filter(m => m)
    : [],
  
  // Outcomes
  phq9_score: formData.phq9Score ? parseInt(formData.phq9Score) : null,
  difficulty_score: formData.difficultyScore ? parseInt(formData.difficultyScore) : null,
  
  // Safety
  has_safety_event: formData.hasSafetyEvent || false,
  safety_event_description: formData.safetyEventDescription || null,
  severity: formData.severity || null,
  resolution: formData.resolutionStatus || null,
  
  // Consent
  consent_verified: formData.consentVerified,
  consent_timestamp: formData.consentVerified ? new Date().toISOString() : null
};
```

**Testing Checklist:**
- [ ] Form submits without errors
- [ ] Data appears in `protocols` table
- [ ] All fields save correctly
- [ ] Arrays (modalities, meds) save as PostgreSQL arrays
- [ ] User can only see their own protocols

---

## **DAY 3: LOGOUT FIX** (3 hours)

### **DESIGNER: Implement Proper Logout**
**File:** `src/components/TopHeader.tsx`  
**Time:** 3 hours  
**Priority:** 🔴 CRITICAL

#### **Step 1: Create Logout Handler** (1 hour)

**Location:** After line 82 (after `handleAuthAction`)

**Add this new function:**
```tsx
const handleLogout = async () => {
  try {
    // 1. Sign out from Supabase (invalidates session)
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
      alert('Error signing out. Please try again.');
      return;
    }
    
    // 2. Clear all local storage
    localStorage.clear();
    
    // 3. Clear session storage
    sessionStorage.clear();
    
    // 4. Close user menu
    setIsMenuOpen(false);
    
    // 5. Call parent logout handler (if exists)
    if (onLogout) {
      onLogout();
    }
    
    // 6. Redirect to landing page
    navigate('/');
    
    // 7. Optional: Show success message
    console.log('✅ Logged out successfully');
    
  } catch (err) {
    console.error('Unexpected logout error:', err);
    alert('An unexpected error occurred. Please refresh the page.');
  }
};
```

#### **Step 2: Update Logout Button** (15 min)

**Location:** Line 227-233

**BEFORE:**
```tsx
<button
  onClick={() => { onLogout(); setIsMenuOpen(false); }}
  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-all text-xs font-bold"
>
  <span className="material-symbols-outlined text-lg">logout</span>
  Sign Out of Node
</button>
```

**AFTER:**
```tsx
<button
  onClick={handleLogout}
  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-all text-xs font-bold"
>
  <span className="material-symbols-outlined text-lg">logout</span>
  Sign Out of Node
</button>
```

#### **Step 3: Add Supabase Import** (5 min)

**Location:** Top of file (line 1-5)

**Add:**
```tsx
import { supabase } from '../lib/supabaseClient';
```

#### **Step 4: Test Logout Flow** (1 hour 40 min)

**Manual Testing:**
1. Log in to the app
2. Verify you can access protected pages
3. Click logout button
4. Verify:
   - [ ] Redirected to landing page
   - [ ] Can't access protected pages anymore
   - [ ] Local storage is cleared
   - [ ] Session storage is cleared
   - [ ] Supabase session is invalid
5. Try to navigate back to protected page
6. Verify you're redirected to login

**Automated Test (Optional):**
```tsx
// Add to test file
describe('Logout Flow', () => {
  it('should invalidate session and redirect', async () => {
    // Login
    await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password'
    });
    
    // Verify logged in
    const { data: { session } } = await supabase.auth.getSession();
    expect(session).not.toBeNull();
    
    // Logout
    await supabase.auth.signOut();
    
    // Verify logged out
    const { data: { session: newSession } } = await supabase.auth.getSession();
    expect(newSession).toBeNull();
  });
});
```

---

## **DAY 4: CREATE MISSING REF TABLES** (3 hours)

### **BUILDER: Create Reference Tables**
**Time:** 3 hours  
**Priority:** 🟡 HIGH

#### **Step 1: Create Migration File** (1 hour)

**File:** `migrations/005_create_missing_ref_tables.sql`

```sql
-- ============================================================================
-- MISSING REFERENCE TABLES - MIGRATION 005
-- ============================================================================
-- Purpose: Create missing ref tables for dropdowns and structured data
-- Date: 2026-02-09
-- Safe to run: YES (Add-only, non-destructive)
-- ============================================================================

-- ============================================================================
-- TABLE 1: ref_dosage_units
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ref_dosage_units (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  unit_name TEXT NOT NULL UNIQUE,
  unit_abbreviation TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO public.ref_dosage_units (unit_name, unit_abbreviation) VALUES
  ('milligrams', 'mg'),
  ('micrograms', 'mcg (µg)'),
  ('milligrams per kilogram', 'mg/kg'),
  ('milliliters', 'ml'),
  ('units', 'Units'),
  ('drops', 'Drops')
ON CONFLICT (unit_name) DO NOTHING;

-- ============================================================================
-- TABLE 2: ref_medications
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ref_medications (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  medication_name TEXT NOT NULL UNIQUE,
  medication_class TEXT,
  rxnorm_cui BIGINT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data (from constants.ts MEDICATIONS_LIST)
INSERT INTO public.ref_medications (medication_name, medication_class) VALUES
  -- SSRIs/SNRIs
  ('Fluoxetine (Prozac)', 'SSRI'),
  ('Sertraline (Zoloft)', 'SSRI'),
  ('Citalopram (Celexa)', 'SSRI'),
  ('Escitalopram (Lexapro)', 'SSRI'),
  ('Paroxetine (Paxil)', 'SSRI'),
  ('Venlafaxine (Effexor)', 'SNRI'),
  ('Duloxetine (Cymbalta)', 'SNRI'),
  -- MAOIs
  ('Phenelzine (Nardil)', 'MAOI'),
  ('Tranylcypromine (Parnate)', 'MAOI'),
  ('Selegiline (Emsam)', 'MAOI'),
  -- Mood Stabilizers
  ('Lithium', 'Mood Stabilizer'),
  ('Valproate (Depakote)', 'Mood Stabilizer'),
  ('Lamotrigine (Lamictal)', 'Mood Stabilizer'),
  ('Carbamazepine (Tegretol)', 'Mood Stabilizer'),
  -- Benzodiazepines
  ('Alprazolam (Xanax)', 'Benzodiazepine'),
  ('Clonazepam (Klonopin)', 'Benzodiazepine'),
  ('Diazepam (Valium)', 'Benzodiazepine'),
  ('Lorazepam (Ativan)', 'Benzodiazepine'),
  -- Antipsychotics
  ('Quetiapine (Seroquel)', 'Antipsychotic'),
  ('Olanzapine (Zyprexa)', 'Antipsychotic'),
  ('Risperidone (Risperdal)', 'Antipsychotic'),
  ('Aripiprazole (Abilify)', 'Antipsychotic'),
  -- Stimulants
  ('Amphetamine/Dextroamphetamine (Adderall)', 'Stimulant'),
  ('Methylphenidate (Ritalin)', 'Stimulant'),
  ('Lisdexamfetamine (Vyvanse)', 'Stimulant'),
  ('Modafinil (Provigil)', 'Stimulant'),
  -- Somatic
  ('Propranolol', 'Beta Blocker'),
  ('Atenolol', 'Beta Blocker'),
  ('Atorvastatin', 'Statin'),
  ('Simvastatin', 'Statin'),
  ('Levothyroxine', 'Thyroid Hormone'),
  ('Metformin', 'Antidiabetic'),
  ('Omeprazole', 'PPI'),
  ('Lisinopril', 'ACE Inhibitor'),
  -- Other Psych
  ('Bupropion (Wellbutrin)', 'Antidepressant'),
  ('Trazodone', 'Antidepressant'),
  ('Buspirone', 'Anxiolytic'),
  ('Gabapentin', 'Anticonvulsant'),
  ('Pregabalin (Lyrica)', 'Anticonvulsant')
ON CONFLICT (medication_name) DO NOTHING;

-- ============================================================================
-- TABLE 3: ref_settings
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ref_settings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  setting_name TEXT NOT NULL UNIQUE,
  setting_description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO public.ref_settings (setting_name, setting_description) VALUES
  ('Clinical (Medical)', 'Hospital or medical clinic setting with full medical support'),
  ('Clinical (Soft)', 'Clinical setting with therapeutic environment'),
  ('Home (Supervised)', 'Patient home with professional supervision'),
  ('Retreat Center', 'Dedicated retreat or therapeutic center'),
  ('Research Lab', 'Controlled research environment')
ON CONFLICT (setting_name) DO NOTHING;

-- ============================================================================
-- TABLE 4: ref_resolution_status
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ref_resolution_status (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  status_name TEXT NOT NULL UNIQUE,
  status_description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO public.ref_resolution_status (status_name, status_description) VALUES
  ('Resolved in Session', 'Issue resolved during the session'),
  ('Resolved Post-Session', 'Issue resolved after the session ended'),
  ('Unresolved/Lingering', 'Issue persists after session'),
  ('Requires Follow-up', 'Medical follow-up needed'),
  ('Not Applicable', 'No resolution needed')
ON CONFLICT (status_name) DO NOTHING;

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE public.ref_dosage_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_resolution_status ENABLE ROW LEVEL SECURITY;

-- Read-only policies for authenticated users
CREATE POLICY "ref_dosage_units_read" ON public.ref_dosage_units FOR SELECT TO authenticated USING (true);
CREATE POLICY "ref_medications_read" ON public.ref_medications FOR SELECT TO authenticated USING (true);
CREATE POLICY "ref_settings_read" ON public.ref_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "ref_resolution_status_read" ON public.ref_resolution_status FOR SELECT TO authenticated USING (true);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ ref_dosage_units: % rows', (SELECT COUNT(*) FROM public.ref_dosage_units);
    RAISE NOTICE '✅ ref_medications: % rows', (SELECT COUNT(*) FROM public.ref_medications);
    RAISE NOTICE '✅ ref_settings: % rows', (SELECT COUNT(*) FROM public.ref_settings);
    RAISE NOTICE '✅ ref_resolution_status: % rows', (SELECT COUNT(*) FROM public.ref_resolution_status);
END $$;
```

#### **Step 2: Apply Migration** (10 min)

1. Open Supabase Dashboard → SQL Editor
2. Copy the entire migration file
3. Click "Run"
4. Verify success messages showing row counts

#### **Step 3: Verify Tables** (10 min)

Run this query:
```sql
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count,
  (SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_name = t.table_name AND constraint_type = 'PRIMARY KEY') as has_pk
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name LIKE 'ref_%'
ORDER BY table_name;
```

---

# 🎯 WEEK 1: HIGH PRIORITY

## **DAY 5: SYNC CONSTANTS WITH SUPABASE** (4 hours)

### **DESIGNER: Update Components to Use Supabase**
**Time:** 4 hours  
**Priority:** 🟡 HIGH

#### **Task 1: Update Protocol Builder Dropdowns** (2 hours)

**File:** `src/pages/ProtocolBuilder.tsx`

**Step 1: Add State for Reference Data** (30 min)

**Location:** After line 220 (in main component)

**Add:**
```tsx
// Reference data from Supabase
const [refSubstances, setRefSubstances] = useState([]);
const [refRoutes, setRefRoutes] = useState([]);
const [refDosageUnits, setRefDosageUnits] = useState([]);
const [refSettings, setRefSettings] = useState([]);
const [refMedications, setRefMedications] = useState([]);
const [refResolutionStatuses, setRefResolutionStatuses] = useState([]);
```

**Step 2: Fetch Reference Data** (1 hour)

**Add this useEffect:**
```tsx
useEffect(() => {
  const fetchReferenceData = async () => {
    try {
      // Fetch all reference tables in parallel
      const [
        substancesRes,
        routesRes,
        dosageUnitsRes,
        settingsRes,
        medicationsRes,
        resolutionRes
      ] = await Promise.all([
        supabase.from('ref_substances').select('*').order('substance_name'),
        supabase.from('ref_routes').select('*').order('route_label'),
        supabase.from('ref_dosage_units').select('*').eq('is_active', true).order('unit_name'),
        supabase.from('ref_settings').select('*').eq('is_active', true).order('setting_name'),
        supabase.from('ref_medications').select('*').eq('is_active', true).order('medication_name'),
        supabase.from('ref_resolution_status').select('*').eq('is_active', true).order('status_name')
      ]);

      // Update state
      if (substancesRes.data) setRefSubstances(substancesRes.data);
      if (routesRes.data) setRefRoutes(routesRes.data);
      if (dosageUnitsRes.data) setRefDosageUnits(dosageUnitsRes.data);
      if (settingsRes.data) setRefSettings(settingsRes.data);
      if (medicationsRes.data) setRefMedications(medicationsRes.data);
      if (resolutionRes.data) setRefResolutionStatuses(resolutionRes.data);

    } catch (error) {
      console.error('Error fetching reference data:', error);
      // Fallback to constants if Supabase fails
      setRefSubstances(SUBSTANCES.map(s => ({ substance_name: s.name })));
    }
  };

  fetchReferenceData();
}, []);
```

**Step 3: Update Dropdown Options** (30 min)

**Find and replace hardcoded options:**

**BEFORE:**
```tsx
const SUBSTANCE_OPTIONS = ['Ketamine', 'MDMA', 'Psilocybin', 'LSD-25', '5-MeO-DMT', 'Ibogaine', 'Mescaline'];
```

**AFTER:**
```tsx
// Use Supabase data, fallback to constants
const SUBSTANCE_OPTIONS = refSubstances.length > 0 
  ? refSubstances.map(s => s.substance_name)
  : SUBSTANCES.map(s => s.name);

const ROUTE_OPTIONS = refRoutes.length > 0
  ? refRoutes.map(r => r.route_label)
  : ['Oral', 'Intravenous', 'Intramuscular', 'Sublingual', 'Intranasal'];

const DOSAGE_UNIT_OPTIONS = refDosageUnits.length > 0
  ? refDosageUnits.map(u => u.unit_abbreviation)
  : ['mg', 'mcg (µg)', 'mg/kg', 'ml', 'Units', 'Drops'];

const SETTING_OPTIONS = refSettings.length > 0
  ? refSettings.map(s => s.setting_name)
  : ['Clinical (Medical)', 'Clinical (Soft)', 'Home (Supervised)', 'Retreat Center'];

const MEDICATIONS_OPTIONS = refMedications.length > 0
  ? refMedications.map(m => m.medication_name)
  : MEDICATIONS_LIST;

const RESOLUTION_OPTIONS = refResolutionStatuses.length > 0
  ? refResolutionStatuses.map(r => r.status_name)
  : ['Resolved in Session', 'Resolved Post-Session', 'Unresolved/Lingering'];
```

---

#### **Task 2: Update Interaction Checker** (1 hour)

**File:** `src/pages/InteractionChecker.tsx`

**Step 1: Add State** (10 min)
```tsx
const [refMedications, setRefMedications] = useState([]);
const [refSubstances, setRefSubstances] = useState([]);
```

**Step 2: Fetch Data** (20 min)
```tsx
useEffect(() => {
  const fetchData = async () => {
    const [medsRes, subsRes] = await Promise.all([
      supabase.from('ref_medications').select('*').eq('is_active', true).order('medication_name'),
      supabase.from('ref_substances').select('*').order('substance_name')
    ]);
    
    if (medsRes.data) setRefMedications(medsRes.data);
    if (subsRes.data) setRefSubstances(subsRes.data);
  };
  
  fetchData();
}, []);
```

**Step 3: Update Dropdowns** (30 min)
```tsx
// Replace MEDICATIONS_LIST with:
const medicationOptions = refMedications.length > 0
  ? refMedications.map(m => m.medication_name)
  : MEDICATIONS_LIST;

// Replace SUBSTANCES with:
const substanceOptions = refSubstances.length > 0
  ? refSubstances.map(s => s.substance_name)
  : SUBSTANCES.map(s => s.name);
```

---

#### **Task 3: Update Substance Catalog** (1 hour)

**File:** `src/pages/SubstanceCatalog.tsx`

**Replace:**
```tsx
// BEFORE:
import { SUBSTANCES } from '../constants';

// AFTER:
import { SUBSTANCES } from '../constants'; // Keep as fallback
import { supabase } from '../lib/supabaseClient';

// Add state:
const [substances, setSubstances] = useState([]);
const [loading, setLoading] = useState(true);

// Fetch from Supabase:
useEffect(() => {
  const fetchSubstances = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ref_substances')
      .select('*')
      .order('substance_name');
    
    if (error) {
      console.error('Error fetching substances:', error);
      setSubstances(SUBSTANCES); // Fallback
    } else {
      setSubstances(data || SUBSTANCES);
    }
    setLoading(false);
  };
  
  fetchSubstances();
}, []);
```

---

## **DAY 6: FIX FIELD MAPPING BUGS** (4 hours)

### **DESIGNER: Complete Protocol Builder Integration**
**Time:** 4 hours  
**Priority:** 🟡 HIGH

#### **Task 1: Test All Form Fields** (2 hours)

**Create test protocol with ALL fields filled:**

1. Open Protocol Builder
2. Fill out every single field:
   - Subject ID (auto-generated)
   - Demographics (age, sex, race, weight, smoking)
   - Substance selection
   - Dosage, unit, frequency, route
   - Setting, prep hours, integration hours
   - Modalities (select multiple)
   - Concomitant meds (add several)
   - Safety event (toggle on, fill details)
   - Outcomes (PHQ-9, difficulty)
   - Consent (check box)
3. Submit form
4. Check Supabase `protocols` table
5. Verify ALL fields saved correctly

**Testing Checklist:**
- [ ] All text fields save
- [ ] All dropdowns save correct values
- [ ] Arrays (modalities, meds) save as PostgreSQL arrays
- [ ] Numbers save as numbers (not strings)
- [ ] Booleans save correctly
- [ ] Timestamps save correctly
- [ ] No data loss
- [ ] No console errors

#### **Task 2: Fix Any Remaining Bugs** (2 hours)

Common issues to watch for:

**Issue 1: Array fields not saving**
```tsx
// If modalities/meds don't save, check format:
modalities: formData.modalities || [],  // Should be array
concomitant_meds: formData.concomitantMeds 
  ? formData.concomitantMeds.split(',').map(m => m.trim()).filter(m => m)
  : [],
```

**Issue 2: Numbers saving as strings**
```tsx
// Use parseInt/parseFloat:
phq9_score: formData.phq9Score ? parseInt(formData.phq9Score) : null,
prep_hours: formData.prepHours ? parseFloat(formData.prepHours) : null,
```

**Issue 3: Null vs empty string**
```tsx
// Use null for optional fields:
indication: formData.indication || null,  // Not empty string
```

---

# 🎯 WEEK 1: MEDIUM PRIORITY

## **DAY 7: REPLACE MOCK DATA** (6 hours)

### **DESIGNER: Update All Components to Use Real Data**
**Time:** 6 hours  
**Priority:** 🟢 MEDIUM

#### **Task 1: Update TopHeader User Info** (2 hours)

**File:** `src/components/TopHeader.tsx`

**Replace line 49:**
```tsx
// BEFORE:
const currentUser = CLINICIANS[0]; // Dr. Sarah Jenkins

// AFTER:
const [currentUser, setCurrentUser] = useState(null);
const [userProfile, setUserProfile] = useState(null);

useEffect(() => {
  const fetchCurrentUser = async () => {
    try {
      // Get authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('No authenticated user');
        return;
      }
      
      // Get user profile from user_sites
      const { data: profile, error: profileError } = await supabase
        .from('user_sites')
        .select(`
          *,
          sites (
            site_name,
            site_code
          )
        `)
        .eq('user_id', user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // Fallback to basic user info
        setCurrentUser({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || 'User',
          role: 'Practitioner'
        });
      } else {
        setUserProfile(profile);
        setCurrentUser({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || 'User',
          role: profile.role || 'Practitioner',
          site: profile.sites?.site_name
        });
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };
  
  if (isAuthenticated) {
    fetchCurrentUser();
  }
}, [isAuthenticated]);
```

**Update display (line 193):**
```tsx
<p className="text-[12px] font-black text-white leading-none mb-1 group-hover:text-primary transition-colors">
  {currentUser?.name || 'Loading...'}
</p>
<div className="flex items-center gap-1">
  <span className="text-[11px] text-slate-500 font-bold tracking-widest leading-none">
    {currentUser?.role || 'User'}
  </span>
  {/* ... */}
</div>
```

**Update email (line 206):**
```tsx
<p className="text-xs font-bold text-white truncate">
  {currentUser?.email || 'user@ppn-research.org'}
</p>
```

---

#### **Task 2: Update Search Portal** (2 hours)

**File:** `src/pages/SearchPortal.tsx`

**Replace mock data imports:**
```tsx
// BEFORE:
import { SUBSTANCES, CLINICIANS, PATIENTS } from '../constants';

// AFTER:
import { SUBSTANCES, CLINICIANS, PATIENTS } from '../constants'; // Keep as fallback
import { supabase } from '../lib/supabaseClient';

// Add state:
const [substances, setSubstances] = useState([]);
const [protocols, setProtocols] = useState([]);
const [loading, setLoading] = useState(true);

// Fetch real data:
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    
    try {
      // Fetch substances
      const { data: subsData } = await supabase
        .from('ref_substances')
        .select('*')
        .order('substance_name');
      
      // Fetch user's protocols
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: protocolsData } = await supabase
          .from('protocols')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        setProtocols(protocolsData || []);
      }
      
      setSubstances(subsData || SUBSTANCES);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSubstances(SUBSTANCES);
      setProtocols(PATIENTS); // Fallback to mock
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

---

#### **Task 3: Update Substance Monograph** (2 hours)

**File:** `src/pages/SubstanceMonograph.tsx`

**Fetch substance by ID from Supabase:**
```tsx
const [substance, setSubstance] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchSubstance = async () => {
    if (!id) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('ref_substances')
        .select('*')
        .eq('substance_id', id)
        .single();
      
      if (error) throw error;
      
      setSubstance(data);
    } catch (error) {
      console.error('Error fetching substance:', error);
      // Fallback to constants
      const fallback = SUBSTANCES.find(s => s.id === id);
      setSubstance(fallback);
    } finally {
      setLoading(false);
    }
  };
  
  fetchSubstance();
}, [id]);

if (loading) {
  return <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
    <p className="text-white">Loading...</p>
  </div>;
}

if (!substance) {
  return <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
    <p className="text-white">Substance not found</p>
  </div>;
}
```

---

## 📊 **PROGRESS TRACKING**

### **Daily Checklist**

**Day 1: Header Navigation** ✅
- [ ] Broken icons disabled or redirected
- [ ] Three placeholder pages created
- [ ] Routes registered in App.tsx
- [ ] All navigation tested
- [ ] No 404 errors

**Day 2: Protocol Builder Database** ✅
- [ ] Migration file created
- [ ] Migration applied to Supabase
- [ ] Table structure verified
- [ ] Protocol Builder updated
- [ ] Form submission tested
- [ ] Data appears in database

**Day 3: Logout Fix** ✅
- [ ] Logout handler created
- [ ] Supabase signOut implemented
- [ ] Local/session storage cleared
- [ ] Logout button updated
- [ ] Logout flow tested
- [ ] Session invalidation verified

**Day 4: Reference Tables** ✅
- [ ] Migration file created
- [ ] Four ref tables created
- [ ] Seed data inserted
- [ ] RLS policies applied
- [ ] Tables verified in Supabase

**Day 5: Sync Constants** ✅
- [ ] Protocol Builder fetches from Supabase
- [ ] Interaction Checker fetches from Supabase
- [ ] Substance Catalog fetches from Supabase
- [ ] Fallbacks to constants work
- [ ] All dropdowns populated

**Day 6: Field Mapping** ✅
- [ ] All form fields tested
- [ ] Array fields save correctly
- [ ] Number fields save as numbers
- [ ] No data loss
- [ ] All bugs fixed

**Day 7: Replace Mock Data** ✅
- [ ] TopHeader shows real user
- [ ] Search Portal queries database
- [ ] Substance Monograph queries database
- [ ] No hardcoded user data
- [ ] All components use Supabase

---

## ✅ **FINAL VERIFICATION**

**Before marking stabilization complete, verify:**

1. **Navigation**
   - [ ] All header icons work (or show "coming soon")
   - [ ] No 404 errors anywhere
   - [ ] All routes registered

2. **Protocol Builder**
   - [ ] Form submits successfully
   - [ ] All fields save to database
   - [ ] User can view their protocols
   - [ ] No console errors

3. **Authentication**
   - [ ] Logout invalidates session
   - [ ] Can't access protected pages after logout
   - [ ] Login works correctly
   - [ ] User info displays correctly

4. **Data Sources**
   - [ ] All dropdowns pull from Supabase
   - [ ] Fallbacks to constants work
   - [ ] No hardcoded mock data in production code
   - [ ] Reference tables populated

5. **Security**
   - [ ] RLS policies working
   - [ ] Users only see their own data
   - [ ] Session management secure
   - [ ] No PHI/PII exposed

---

## 🎯 **SUCCESS CRITERIA**

**Stabilization is COMPLETE when:**
- ✅ All critical blockers fixed
- ✅ All header icons functional or disabled gracefully
- ✅ Protocol Builder saves to database
- ✅ Logout works properly
- ✅ All dropdowns use Supabase reference tables
- ✅ No mock data in user-facing components
- ✅ All tests passing
- ✅ No console errors
- ✅ Ready for polish phase

---

**Total Time:** 19 hours over 7 days  
**Next Phase:** Visual polish (Batches 1-5)  
**Launch Target:** Week of Feb 23rd
