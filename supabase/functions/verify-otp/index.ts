import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { phone, code } = await req.json();

    const decodedPhone = decodeURIComponent(phone ?? '');
    if (!/^\+[1-9]\d{6,14}$/.test(decodedPhone)) {
      return new Response(
        JSON.stringify({ approved: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }
    if (!/^\d{6}$/.test(String(code ?? ''))) {
      return new Response(
        JSON.stringify({ approved: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')?.trim();
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')?.trim();
    const verifySid = Deno.env.get('TWILIO_VERIFY_SID')?.trim();
    const twilioConfigured = Boolean(accountSid && authToken && verifySid);

    // Bypass only allowed when Twilio is not configured (dev/test environments).
    if (Deno.env.get('OTP_BYPASS_ENABLED') === 'true' && !twilioConfigured) {
      return new Response(
        JSON.stringify({ approved: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (!twilioConfigured) {
      return new Response(
        JSON.stringify({ approved: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${verifySid}/VerificationChecks`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `To=${encodeURIComponent(decodedPhone)}&Code=${code}`,
      }
    );

    const data = await response.json();
    const approved = data.status === 'approved';

    // Always 200 so the client can read `approved` (Supabase invoke treats 4xx as error).
    return new Response(
      JSON.stringify({ approved }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (_error) {
    return new Response(
      JSON.stringify({ approved: false }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
