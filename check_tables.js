import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
    console.log('Checking existing tables in Supabase...');

    // Query the information_schema to list tables
    const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

    // If direct access to information_schema is blocked (common with RLS/permissions),
    // we can try a lighter check or just list known ones if we had them.
    // However, Supabase-js client doesn't have a specific "list tables" method for the public API 
    // without admin rights usually. 
    // ALTERNATIVE: Try to fetch 1 row from 'regulatory_states' to see if it exists.

    // Let's try to just SELECT * FROM regulatory_states LIMIT 1
    const { data: regData, error: regError } = await supabase
        .from('regulatory_states')
        .select('*')
        .limit(1);

    if (regError) {
        console.log("Table 'regulatory_states' check:", regError.message);
    } else {
        console.log("Table 'regulatory_states' exists.");
    }

    // Also check for 'news' or 'profiles' potentially?
    const { data: newsData, error: newsError } = await supabase.from('news').select('*').limit(1);
    if (!newsError) console.log("Table 'news' exists.");

    const { data: profilesData, error: profilesError } = await supabase.from('profiles').select('*').limit(1);
    if (!profilesError) console.log("Table 'profiles' exists.");
}

checkTables();
