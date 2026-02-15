# Execute Migration 028: MHQ Score

## What This Adds
- **`ref_mhq_scores`** - Reference table with 5 MHQ score ranges
- **`baseline_mhq_score`** - MHQ score before treatment
- **`mhq_post`** - MHQ score after treatment
- **`mhq_score_id`** - Foreign key for categorization

## MHQ Score Ranges
- Very Poor: -100 to -1 (Very Severe)
- Poor: 0 to 49 (Severe)
- Fair: 50 to 99 (Moderate)
- Good: 100 to 149 (Mild)
- Very Good: 150 to 200 (Minimal)

## Quick Execution
1. Copy `migrations/028_add_mhq_score.sql`
2. Paste in Supabase SQL Editor
3. Click "Run"

## Expected Output
```
✅ Migration 028: MHQ Score Reference Table Created
   - ref_mhq_scores table: 5 score ranges
   - Added baseline_mhq_score to log_clinical_records
   - Added mhq_post to log_clinical_records
   - Added mhq_score_id foreign key
   - RLS enabled with authenticated read access
```

## Next Steps
- BUILDER will need to add MHQ score dropdown to Protocol Builder UI
- Analytics Dashboard can now track MHQ score changes
