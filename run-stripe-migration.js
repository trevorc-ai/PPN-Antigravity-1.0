#!/usr/bin/env node

/**
 * Run Stripe subscription migration
 * Creates user_subscriptions table in Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
import dotenv from 'dotenv';
dotenv.config({ path: join(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ ERROR: Missing Supabase credentials');
    console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runStripeMigration() {
    console.log('🚀 Running Stripe subscription migration...\n');

    try {
        const migrationPath = join(__dirname, 'migrations', '019_create_user_subscriptions.sql');
        const sql = readFileSync(migrationPath, 'utf-8');

        console.log('📋 Executing migration: 019_create_user_subscriptions.sql');

        // Split SQL into individual statements
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        for (const statement of statements) {
            const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });

            if (error) {
                console.error(`❌ Migration failed:`, error);
                throw error;
            }
        }

        console.log('✅ Migration complete!\n');
        console.log('📊 Created:');
        console.log('  - user_subscriptions table');
        console.log('  - RLS policies for subscription access');
        console.log('  - Indexes for performance');
        console.log('  - Triggers for updated_at');
        console.log('\n🎉 Database is ready for Stripe integration!');

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        console.error('\n💡 Alternative: Run the migration manually in Supabase SQL Editor');
        console.error('   File: migrations/019_create_user_subscriptions.sql');
        process.exit(1);
    }
}

runStripeMigration();
