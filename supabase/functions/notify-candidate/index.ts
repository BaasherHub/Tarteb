import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type NotifyPayload = {
  candidate_id: string;
  event: 'viewed' | 'unlocked';
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { candidate_id, event } = await req.json() as NotifyPayload;

    if (!candidate_id || !['viewed', 'unlocked'].includes(event)) {
      return new Response(
        JSON.stringify({ error: 'Invalid payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Get the candidate's user_id.
    const { data: candidate } = await supabase
      .from('candidates')
      .select('user_id')
      .eq('id', candidate_id)
      .single();

    if (!candidate) {
      return new Response(JSON.stringify({ sent: false, reason: 'candidate not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get their push token.
    const { data: profile } = await supabase
      .from('profiles')
      .select('push_token')
      .eq('user_id', candidate.user_id)
      .single();

    if (!profile?.push_token) {
      return new Response(JSON.stringify({ sent: false, reason: 'no push token' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const messages: Record<string, string> = {
      viewed: 'A business viewed your profile 👀',
      unlocked: 'A business unlocked your contact — expect a call! 😉',
    };

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: profile.push_token,
        title: 'Tarteb',
        body: messages[event],
        sound: 'default',
        data: { event, candidate_id },
      }),
    });

    const result = await response.json();

    return new Response(JSON.stringify({ sent: true, result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ sent: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
