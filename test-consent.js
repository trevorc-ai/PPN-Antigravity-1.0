import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const now = new Date().toISOString();
  console.log('Testing insert to log_consent...');
  const { data, error } = await supabase.from('log_consent').insert([{
    verified: true,
    verified_at: now,
    // Just minimal fields to see what fails
  }]);
  console.log('Result:', { data, error });
}
test();
