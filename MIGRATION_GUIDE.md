# Migration Guide - ProtocolBuilder Database Setup

## 🎯 Objective
Wire the ProtocolBuilder UI to the new database schema by running the required migrations.

## 📋 Prerequisites
- Supabase project created
- Access to Supabase SQL Editor

## 🚀 Step-by-Step Instructions

### 1. Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### 2. Run Migrations in Order

#### Migration 1: Core Tables (000)
**File:** `migrations/000_init_core_tables.sql`

**What it does:**
- Creates `sites`, `user_sites` tables
- Creates `log_clinical_records`, `log_outcomes`, `log_consent`, `log_interventions`, `log_safety_events`
- Enables RLS and basic policies

**To run:**
1. Copy the entire contents of `migrations/000_init_core_tables.sql`
2. Paste into Supabase SQL Editor
3. Click **RUN**
4. Verify: Should see "Success. No rows returned"

---

#### Migration 2: Reference Tables (003)
**File:** `migrations/003_protocolbuilder_reference_tables.sql`

**What it does:**
- Creates `ref_substances`, `ref_routes`, `ref_support_modality`
- Creates `ref_smoking_status`, `ref_severity_grade`, `ref_safety_events`, `ref_indications`
- **Seeds data** for all reference tables (Psilocybin, MDMA, Ketamine, etc.)

**To run:**
1. Copy the entire contents of `migrations/003_protocolbuilder_reference_tables.sql`
2. Paste into Supabase SQL Editor
3. Click **RUN**
4. Verify: Should see "Success. No rows returned"

---

#### Migration 3: Foreign Keys (006)
**File:** `migrations/006_finalize_relationships.sql`

**What it does:**
- Adds foreign key constraints to `log_clinical_records`
- Links `substance_id` → `ref_substances`
- Links `site_id` → `sites`
- Enables JOIN queries for the Protocol List view

**To run:**
1. Copy the entire contents of `migrations/006_finalize_relationships.sql`
2. Paste into Supabase SQL Editor
3. Click **RUN**
4. Verify: Should see "Success. No rows returned"

---

### 3. Verify Setup

Run this query in Supabase SQL Editor to verify data was seeded:

```sql
-- Check reference tables have data
SELECT 'ref_substances' as table_name, COUNT(*) as row_count FROM ref_substances
UNION ALL
SELECT 'ref_routes', COUNT(*) FROM ref_routes
UNION ALL
SELECT 'ref_smoking_status', COUNT(*) FROM ref_smoking_status
UNION ALL
SELECT 'ref_severity_grade', COUNT(*) FROM ref_severity_grade
UNION ALL
SELECT 'ref_safety_events', COUNT(*) FROM ref_safety_events;
```

**Expected Results:**
- `ref_substances`: 8+ rows
- `ref_routes`: 9+ rows
- `ref_smoking_status`: 4+ rows
- `ref_severity_grade`: 5 rows
- `ref_safety_events`: 13+ rows

---

### 4. Test ProtocolBuilder

1. Refresh the ProtocolBuilder page: http://localhost:3000/protocol-builder
2. Click **Create New Protocol**
3. Verify dropdowns are now populated:
   - ✅ **Substance Compound** should show: Psilocybin, MDMA, Ketamine, etc.
   - ✅ **Administration Route** should show: Oral, Intravenous, Sublingual, etc.
   - ✅ **Smoking Status** should show: Non-Smoker, Former Smoker, etc.

---

## 🐛 Troubleshooting

### Issue: "relation does not exist"
**Solution:** Run migrations in the correct order (000 → 003 → 006)

### Issue: Dropdowns still empty after migrations
**Solution:** Check RLS policies. Run this to allow public read access:

```sql
-- Allow anonymous read access to reference tables
CREATE POLICY "Public read ref_substances" ON ref_substances FOR SELECT USING (true);
CREATE POLICY "Public read ref_routes" ON ref_routes FOR SELECT USING (true);
CREATE POLICY "Public read ref_smoking_status" ON ref_smoking_status FOR SELECT USING (true);
CREATE POLICY "Public read ref_severity_grade" ON ref_severity_grade FOR SELECT USING (true);
CREATE POLICY "Public read ref_safety_events" ON ref_safety_events FOR SELECT USING (true);
```

### Issue: "No authenticated user" warnings
**Expected behavior** - These warnings are normal if you're not logged in. Reference tables should still be accessible via public RLS policies.

---

## ✅ Success Criteria

After running all migrations, you should be able to:
1. ✅ Open ProtocolBuilder without errors
2. ✅ See populated dropdowns in the Create Protocol form
3. ✅ Save a new protocol to `log_clinical_records`
4. ✅ View saved protocols in the Protocol List

---

## 📝 Notes

- **Migration 001** and **002** are optional (patient flow features)
- **Migration 004** and **005** enhance clinical records but aren't required for basic functionality
- Always run migrations in numerical order to avoid dependency issues
