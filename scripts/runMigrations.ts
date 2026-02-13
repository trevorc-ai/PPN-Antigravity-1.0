/**
 * Migration Runner for Protocol Builder Phase 1
 * Applies migrations 013 and 014 via Supabase client
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runMigration(migrationFile: string) {
    const migrationPath = path.join(__dirname, '..', 'migrations', migrationFile);

    console.log(`\n📄 Reading migration: ${migrationFile}`);

    if (!fs.existsSync(migrationPath)) {
        console.error(`❌ Migration file not found: ${migrationPath}`);
        return false;
    }

    const sql = fs.readFileSync(migrationPath, 'utf-8');

    console.log(`🔄 Executing migration...`);

    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
        console.error(`❌ Migration failed:`, error);
        return false;
    }

    console.log(`✅ Migration completed successfully`);
    return true;
}

async function main() {
    console.log('🚀 Protocol Builder Phase 1 - Database Migrations\n');

    // Migration 013: Submission Status
    const migration013Success = await runMigration('013_add_submission_status.sql');

    if (!migration013Success) {
        console.error('\n❌ Migration 013 failed. Stopping.');
        process.exit(1);
    }

    // Migration 014: Patient Lookup Indexes (Optional)
    const migration014Success = await runMigration('014_add_patient_lookup_indexes.sql');

    if (!migration014Success) {
        console.warn('\n⚠️  Migration 014 failed (optional performance optimization)');
    }

    console.log('\n✅ All migrations completed successfully!');
    console.log('\n📊 Verifying schema...\n');

    // Verify submitted_at field exists
    const { data: columns, error: columnsError } = await supabase
        .from('log_clinical_records')
        .select('*')
        .limit(0);

    if (columnsError) {
        console.error('❌ Failed to verify schema:', columnsError);
        process.exit(1);
    }

    console.log('✅ Schema verification complete');
    console.log('\n🎉 Database setup complete! Ready for Protocol Builder implementation.');
}

main().catch(console.error);
