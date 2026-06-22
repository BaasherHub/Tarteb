/**
 * candidate-reengagement
 *
 * Handles two jobs — called by Supabase pg_cron or an HTTP trigger:
 *   ?job=still_looking  — monthly ping to all active candidates
 *   ?job=no_views       — ping candidates with 0 views in last 30 days
 *
 * Deploy: supabase functions deploy candidate-reengagement
 * Schedule via pg_cron (run once in SQL Editor after deploying):
 *
 *   select cron.schedule(
 *     'candidate-still-looking',
 *     '0 10 1 * *',   -- 1st of every month at 10am
 *     $$
 *       select net.http_post(
 *         url := 'https://<project-ref>.supabase.co/functions/v1/candidate-reengagement?job=still_looking',
 *         headers := '{"Authorization": "Bearer <service-role-key>"}'::jsonb
 *       );
 *     $$
 *   );
 *
 *   select cron.schedule(
 *     'candidate-no-views',
 *     '0 11 * * 1',   -- every Monday at 11am
 *     $$
 *       select net.http_post(
 *         url := 'https://<project-ref>.supabase.co/functions/v1/candidate-reengagement?job=no_views',
 *         headers := '{"Authorization": "Bearer <service-role-key>"}'::jsonb
 *       );
 *     $$
 *   );
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Only the service role (pg_cron) may trigger bulk notifications.
  const authHeader = req.headers.get('Authorization') ?? '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if (!serviceRoleKey || authHeader !== `Bearer ${serviceRoleKey}`) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  const url = new URL(req.url);
  const job = url.searchParams.get('job') ?? 'still_looking';

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  let candidates: { user_id: string; id: string }[] = [];

  if (job === 'still_looking') {
    // All active candidates who have a push token
    const { data } = await supabase
      .from('candidates')
      .select('user_id, id')
      .eq('is_active', true)
      .eq('availability_status', 'looking');

    candidates = data ?? [];
  } else if (job === 'no_views') {
    // Candidates active but with 0 employer unlocks in last 30 days
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: allActive } = await supabase
      .from('candidates')
      .select('user_id, id, created_at')
      .eq('is_active', true)
      .eq('availability_status', 'looking')
      .lt('created_at', cutoff); // only candidates older than 30 days

    if (!allActive?.length) {
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: recentUnlocks } = await supabase
      .from('unlocks')
      .select('candidate_id')
      .gte('unlocked_at', cutoff);

    const recentSet = new Set((recentUnlocks ?? []).map((u: { candidate_id: string }) => u.candidate_id));
    candidates = allActive.filter((c) => !recentSet.has(c.id));
  }

  const messages: Record<string, { title: string; body: string }> = {
    still_looking: {
      title: 'Still looking for work? 👋',
      body: 'Employers are browsing Tarteb right now. Keep your profile active to be found.',
    },
    no_views: {
      title: 'Boost your chances 💪',
      body: 'No views in 30 days? Try updating your profile — a fresh photo and current availability help.',
    },
  };

  const msg = messages[job] ?? messages.still_looking;
  let sent = 0;

  for (const candidate of candidates) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('push_token')
      .eq('user_id', candidate.user_id)
      .single();

    if (!profile?.push_token) continue;

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: profile.push_token,
        title: msg.title,
        body: msg.body,
        sound: 'default',
        data: { job, candidate_id: candidate.id },
      }),
    });

    sent++;
  }

  return new Response(JSON.stringify({ sent, job, total: candidates.length }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
