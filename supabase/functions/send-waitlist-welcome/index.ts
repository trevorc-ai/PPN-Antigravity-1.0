import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const FROM_EMAIL = 'PPN Portal <welcome@ppnportal.net>';

serve(async (req) => {
    try {
        const payload = await req.json();

        // Supabase DB webhook sends { type, table, record, old_record }
        const record = payload.record;
        if (!record || !record.email) {
            return new Response('No record', { status: 400 });
        }

        const { first_name, email, practitioner_type, source } = record;

        // Only trigger for portal waitlist and academy waitlist
        const validSources = ['ppn_portal_main', 'academy_landing_page'];
        if (!validSources.includes(source)) {
            return new Response('Source not handled', { status: 200 });
        }

        // Email 1: Immediate confirmation
        const emailHtml = buildConfirmationEmail(first_name, source);

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: FROM_EMAIL,
                to: email,
                subject: "You're on the list — here's what happens next",
                html: emailHtml,
                reply_to: 'info@ppnportal.net',
            }),
        });

        if (!res.ok) {
            const error = await res.text();
            console.error('Resend error:', error);
            return new Response('Email failed', { status: 500 });
        }

        return new Response('OK', { status: 200 });
    } catch (err) {
        console.error('Edge function error:', err);
        return new Response('Internal error', { status: 500 });
    }
});

function buildConfirmationEmail(firstName: string, source: string): string {
    const isAcademy = source === 'academy_landing_page';
    const productName = isAcademy ? 'PPN Academy' : 'PPN Research Portal';
    const demoLink = 'https://app.ppnportal.net/#/partner-demo';

    // Email HTML is defined in WO-412 (MARKETER + DESIGNER)
    // BUILDER: insert the final HTML from WO-412 here
    return `
    <html>
      <body style="margin:0;padding:0;background:#0a1628;font-family:Inter,sans-serif;">
        <!-- WO-412 email template goes here -->
        <p style="color:#9fb0be;padding:40px;">
          Hi ${firstName}, you're on the waitlist for ${productName}. 
          We'll be in touch when founding access opens.
        </p>
        <p style="padding:0 40px;">
          <a href="${demoLink}" style="color:#388bfd;">Watch the 2-minute demo →</a>
        </p>
      </body>
    </html>
  `;
}
