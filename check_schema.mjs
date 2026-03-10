import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nmdhhlwytxmedipgugkx.supabase.co';
const supabaseKey = 'sb_publishable_2A3spH5SIj4JPFtXhGKl1A_u0FftASr'; // from .env.local
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("--- log_users ---");
    const { data: users, error: errU } = await supabase.from('log_users').select('*').limit(1);
    if (errU) console.log("Error querying log_users:", errU);
    else console.log(users);

    console.log("--- log_sites ---");
    const { data: sites, error: errS } = await supabase.from('log_sites').select('*').limit(1);
    if (errS) console.log("Error querying log_sites:", errS);
    else console.log(sites);

    console.log("--- log_user_sites ---");
    const { data: user_sites, error: errUS } = await supabase.from('log_user_sites').select('*').limit(1);
    if (errUS) console.log("Error querying log_user_sites:", errUS);
    else console.log(user_sites);
}

check();
