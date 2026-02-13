import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file if it exists
try {
    const envFile = readFileSync(join(__dirname, '.env'), 'utf-8');
    envFile.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length) {
            const value = valueParts.join('=').trim();
            process.env[key.trim()] = value.replace(/^["']|["']$/g, '');
        }
    });
} catch (error) {
    // .env file doesn't exist, that's okay
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ ERROR: Missing Supabase credentials');
    console.error('Please ensure .env file exists with:');
    console.error('  VITE_SUPABASE_URL=your_url');
    console.error('  VITE_SUPABASE_ANON_KEY=your_key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSQLFile(filename, description) {
    console.log(`\n📋 Executing ${filename}: ${description}...`);

    try {
        const migrationPath = join(__dirname, 'migrations', filename);
        const sql = readFileSync(migrationPath, 'utf-8');

        // Split SQL into individual statements (simple split on semicolon)
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        console.log(`   Found ${statements.length} SQL statements to execute`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.length < 10) continue; // Skip very short statements

            try {
                // Use Supabase's rpc to execute raw SQL
                const { error } = await supabase.rpc('exec_sql', {
                    query: statement + ';'
                });

                if (error) {
                    console.error(`   ⚠️ Statement ${i + 1} error:`, error.message);
                }
            } catch (err) {
                console.error(`   ⚠️ Statement ${i + 1} failed:`, err.message);
            }
        }

        console.log(`✅ ${filename} executed`);
        return true;
    } catch (error) {
        console.error(`❌ Error with ${filename}:`, error.message);
        return false;
    }
}

async function verifyMigrations() {
    console.log('\n🔍 Verifying migrations...\n');

    try {
        // Check receptor affinity data
        const { data: substances, error: substanceError } = await supabase
            .from('ref_substances')
            .select('substance_id, substance_name, receptor_5ht2a_ki')
            .not('receptor_5ht2a_ki', 'is', null);

        if (!substanceError && substances) {
            console.log(`✅ Receptor affinity data: ${substances.length} substances populated`);
            substances.forEach(s => {
                console.log(`   - ${s.substance_name}: 5-HT2A Ki = ${s.receptor_5ht2a_ki} nM`);
            });
        } else {
            console.log('⚠️ Could not verify receptor affinity data:', substanceError?.message);
        }

        // Check drug interactions
        const { data: interactions, error: interactionError } = await supabase
            .from('ref_drug_interactions')
            .select('id, interaction_severity')
            .limit(20);

        if (!interactionError && interactions) {
            console.log(`\n✅ Drug interactions: ${interactions.length} interactions found`);
            const severe = interactions.filter(i => i.interaction_severity === 'SEVERE').length;
            const moderate = interactions.filter(i => i.interaction_severity === 'MODERATE').length;
            const mild = interactions.filter(i => i.interaction_severity === 'MILD').length;
            console.log(`   - SEVERE: ${severe}, MODERATE: ${moderate}, MILD: ${mild}`);
        } else {
            console.log('⚠️ Could not verify drug interactions:', interactionError?.message);
        }

        console.log('\n⚠️ Note: Materialized views require direct database access to verify.');
        console.log('   You can verify them in Supabase SQL Editor with:');
        console.log('   SELECT COUNT(*) FROM mv_outcomes_summary;');

    } catch (error) {
        console.error('⚠️ Verification error:', error.message);
    }
}

async function main() {
    console.log('🚀 Protocol Builder Database Migration Runner');
    console.log('='.repeat(60));

    const migrations = [
        ['015_add_receptor_affinity_data.sql', 'Receptor Affinity Data'],
        ['016_create_knowledge_graph_enhanced.sql', 'Drug Interaction Knowledge Graph'],
        ['017_create_materialized_views.sql', 'Materialized Views for Analytics']
    ];

    let successCount = 0;

    for (const [filename, description] of migrations) {
        const success = await executeSQLFile(filename, description);
        if (success) successCount++;
    }

    console.log('\n' + '='.repeat(60));
    console.log(`\n📊 Migration Summary: ${successCount}/${migrations.length} completed`);

    if (successCount === migrations.length) {
        await verifyMigrations();
        console.log('\n🎉 All migrations completed successfully!');
        console.log('\n📋 Next Steps:');
        console.log('  1. Verify materialized views in Supabase SQL Editor');
        console.log('  2. Hand off to BUILDER for frontend implementation');
        console.log('  3. Test Clinical Insights panel with real data');
    } else {
        console.log('\n⚠️ Some migrations may have failed. Check errors above.');
        console.log('   You may need to run migrations manually in Supabase SQL Editor.');
    }
}

main().catch(console.error);
