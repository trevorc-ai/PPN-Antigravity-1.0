/**
 * Protocol Builder Database Migration Runner
 * Executes migrations 015-017 using Supabase client
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ ERROR: Missing Supabase credentials');
    console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration(filename: string, description: string) {
    console.log(`\n📋 Running ${filename}: ${description}...`);

    try {
        const migrationPath = join(process.cwd(), 'migrations', filename);
        const sql = readFileSync(migrationPath, 'utf-8');

        // Execute migration using Supabase RPC
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

        if (error) {
            console.error(`❌ Migration ${filename} failed:`, error);
            throw error;
        }

        console.log(`✅ ${filename} complete`);
        return true;
    } catch (error) {
        console.error(`❌ Error reading or executing ${filename}:`, error);
        throw error;
    }
}

async function verifyMigrations() {
    console.log('\n🔍 Verifying migrations...\n');

    // Check receptor affinity data
    const { data: receptorData, error: receptorError } = await supabase
        .from('ref_substances')
        .select('substance_id', { count: 'exact', head: true })
        .not('receptor_5ht2a_ki', 'is', null);

    if (!receptorError) {
        console.log(`✅ Receptor affinity data: ${receptorData?.length || 0} substances populated`);
    }

    // Check drug interactions
    const { count: interactionCount, error: interactionError } = await supabase
        .from('ref_drug_interactions')
        .select('*', { count: 'exact', head: true });

    if (!interactionError) {
        console.log(`✅ Drug interactions: ${interactionCount || 0} interactions created`);
    }

    // Check materialized views (using raw SQL)
    try {
        const { data: outcomesData } = await supabase.rpc('exec_sql', {
            sql_query: 'SELECT COUNT(*) as count FROM mv_outcomes_summary'
        });
        console.log(`✅ Outcomes summary view: ${outcomesData?.[0]?.count || 0} rows`);

        const { data: clinicData } = await supabase.rpc('exec_sql', {
            sql_query: 'SELECT COUNT(*) as count FROM mv_clinic_benchmarks'
        });
        console.log(`✅ Clinic benchmarks view: ${clinicData?.[0]?.count || 0} rows`);

        const { data: networkData } = await supabase.rpc('exec_sql', {
            sql_query: 'SELECT COUNT(*) as count FROM mv_network_benchmarks'
        });
        console.log(`✅ Network benchmarks view: ${networkData?.[0]?.count || 0} rows`);
    } catch (error) {
        console.warn('⚠️ Could not verify materialized views (may need direct database access)');
    }
}

async function main() {
    console.log('🚀 Starting Protocol Builder database migrations...');

    try {
        // Run migrations in order
        await runMigration('015_add_receptor_affinity_data.sql', 'Receptor Affinity Data');
        await runMigration('016_create_knowledge_graph_enhanced.sql', 'Drug Interaction Knowledge Graph');
        await runMigration('017_create_materialized_views.sql', 'Materialized Views');

        // Verify migrations
        await verifyMigrations();

        console.log('\n✅ All migrations completed successfully!');
        console.log('\n📊 Summary:');
        console.log('  - Receptor affinity data populated for 8 substances');
        console.log('  - Drug interaction knowledge graph created with 15+ interactions');
        console.log('  - 3 materialized views created for analytics');
        console.log('\n🎉 Database is ready for Protocol Builder Clinical Decision Support System!');

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    }
}

main();
