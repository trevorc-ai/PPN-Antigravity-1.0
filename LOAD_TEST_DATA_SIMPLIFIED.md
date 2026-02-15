# Load Simplified Test Data - Quick Guide

## ✅ Fixed Issue
The original test data migration (024) tried to create `user_profiles` which doesn't exist in your schema. This new version (026) works with your actual database structure.

## 📋 Quick Instructions

**Step 1:** Copy the SQL
- Open `migrations/026_load_test_data_simplified.sql`
- Copy the entire contents

**Step 2:** Execute in Supabase
- Go to Supabase → SQL Editor → New query
- Paste the SQL
- Click "Run"

**Step 3:** Verify Success
You should see:
```
✅ Test data created successfully!
   - Total records: ~30
   - Longitudinal patients: 5
   - Single-session patients: 14
   - User ID: [your-user-id]
   - Site ID: 9999
```

## 🎯 What This Creates

- **~30 clinical records** across multiple substances
- **5 longitudinal patients** with multiple sessions showing progression
- **14 single-session patients** with varied outcomes
- **No user_profiles dependency** - uses your existing authenticated user

## ✅ What Will Activate

Once loaded, you'll see:
- Analytics Dashboard charts populated
- Protocol Builder Clinical Insights panel (if data matches criteria)
- My Protocols page with records
- Materialized views with real data

## 🔧 Prerequisites

You must have:
- ✅ At least one authenticated user (sign up via UI first)
- ✅ Reference tables populated (`ref_substances`, etc.)
- ✅ Migration 017 executed (materialized views)

---

**Ready to execute!** This is safe and works with your actual schema.
