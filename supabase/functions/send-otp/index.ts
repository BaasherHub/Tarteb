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
    const { phone } = await req.json();

    const decodedPhone = decodeURIComponent(phone ?? '');
    if (!/^\+[1-9]\d{6,14}$/.test(decodedPhone)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid phone number' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (Deno.env.get('OTP_BYPASS_ENABLED') === 'true') {
      return new Response(
        JSON.stringify({ success: true, status: 'pending', bypass: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')?.trim();
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')?.trim();
    const verifySid = Deno.env.get('TWILIO_VERIFY_SID')?.trim();

    const debugPhone = `To=${encodeURIComponent(decodedPhone)}&Channel=sms`;
    console.log('Send payload:', debugPhone);
    
    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${verifySid}/Verifications`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: debugPhone,
      }
    );
    
    const data = await response.json();
    
    return new Response(
      JSON.stringify({ success: response.ok, status: data.status }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
