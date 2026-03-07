
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are missing. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

// ── Auth Configuration ─────────────────────────────────────────────────────────
// CRITICAL: PPN uses HashRouter, which owns window.location.hash for routing.
// Supabase's default implicit flow also puts tokens in the hash — they conflict.
//
// Fix: detectSessionInUrl: false — tells Supabase NOT to auto-parse the URL hash.
//      ResetPassword.tsx manually exchanges tokens via exchangeCodeForSession().
//
// flowType: 'pkce' — secure PKCE flow (no token in URL, uses authorization code).
// persistSession: true — sessions survive page refresh.
// storageKey: 'ppn_auth' — namespaced key prevents localStorage collisions.
// ─────────────────────────────────────────────────────────────────────────────────
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        flowType: 'pkce',
        detectSessionInUrl: false,
        persistSession: true,
        storageKey: 'ppn_auth',
    },
});
