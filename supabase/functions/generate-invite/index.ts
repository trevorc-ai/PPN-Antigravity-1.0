// supabase/functions/generate-invite/index.ts
// Generates a Supabase invite link via the Admin API and returns the raw URL.
// Called by public/internal/vip-invite-flow.html — internal tool only.
//
// Deploy: supabase functions deploy generate-invite
// Secrets needed:
//   supabase secrets set SUPABASE_URL=https://<your-ref>.supabase.co
//   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
// (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are auto-injected in hosted projects)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

// Only Trevor's known IP origins should be able to call this.
// Set ALLOWED_ORIGIN in secrets if you want to lock it down further.
const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') ?? '*';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const { email, name, persona } = await req.json();

    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ error: 'email is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      console.error('[generate-invite] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      return new Response(JSON.stringify({ error: 'Server misconfiguration' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // inviteUserByEmail creates the user AND sends the branded "You're in." email
    // via the configured Resend SMTP. generateLink does NOT send email.
    const { data, error } = await adminClient.auth.admin.inviteUserByEmail(
      email.trim().toLowerCase(),
      {
        data: {
          invited_name: name ?? '',
          invited_persona: persona ?? 'partner',
          invited_by: 'trevor',
        },
        redirectTo: 'https://ppnportal.net/#/reset-password',
      }
    );

    if (error) {
      console.error('[generate-invite] inviteUserByEmail error:', error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[generate-invite] Invite sent for ${email} (persona: ${persona ?? 'partner'})`);

    return new Response(
      JSON.stringify({
        email: email.trim().toLowerCase(),
        name: name ?? '',
        persona: persona ?? 'partner',
        sent: true,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (e) {
    console.error('[generate-invite] Unexpected error:', e);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
