import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ ERROR: Supabase credentials not found in .env.local');
    console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔄 Loading test data into Supabase...\n');

async function loadTestData() {
    try {
        // Read and execute the SQL migration file
        const fs = await import('fs/promises');
        const sqlContent = await fs.readFile(join(__dirname, '../migrations/024_load_comprehensive_test_data.sql'), 'utf-8');

        console.log('📊 Executing migration 024: Comprehensive Test Data');
        console.log('   This will create:');
        console.log('   - 10 longitudinal patients (multiple sessions)');
        console.log('   - 20 single-session patients');
        console.log('   - Mix of all substances and outcomes\n');

        // Execute the SQL
        const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });

        if (error) {
            // Try alternative approach: execute via REST API
            console.log('⚠️  RPC method not available, trying direct SQL execution...');

            const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                },
                body: JSON.stringify({ query: sqlContent })
            });

            if (!response.ok) {
                throw new Error(`Failed to execute SQL: ${response.statusText}`);
            }
        }

        console.log('✅ Test data loaded successfully!\n');
        console.log('📋 Verification:');

        // Verify data was loaded
        const { data: records, error: countError } = await supabase
            .from('log_clinical_records')
            .select('id', { count: 'exact', head: true });

        if (!countError) {
            console.log(`   ✓ Total clinical records: ${records?.length || 0}`);
        }

        console.log('\n🔑 Test Login Credentials:');
        console.log('   Email: demo@ppn-research.local');
        console.log('   Password: DemoPassword123!');

        console.log('\n🎯 Next Steps:');
        console.log('   1. Log in with test credentials');
        console.log('   2. Navigate to Analytics to see populated charts');
        console.log('   3. Try Protocol Builder to see Clinical Insights panel');

    } catch (error) {
        console.error('❌ Error loading test data:', error.message);
        console.error('\n💡 Alternative: Execute the SQL file manually in Supabase SQL Editor');
        console.error('   File: migrations/024_load_comprehensive_test_data.sql');
        process.exit(1);
    }
}

loadTestData();
