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

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const EXPO_BATCH_SIZE = 100;

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

  // Batch-fetch candidates AND their push tokens in a single JOIN query.
  let tokens: string[] = [];

  if (job === 'still_looking') {
    const { data } = await supabase
      .from('candidates')
      .select('profiles!inner(push_token)')
      .eq('is_active', true)
      .eq('availability_status', 'looking')
      .not('profiles.push_token', 'is', null);

    tokens = (data ?? [])
      .map((r: { profiles: { push_token: string | null } }) => r.profiles?.push_token ?? '')
      .filter(Boolean);

  } else if (job === 'no_views') {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: allActive } = await supabase
      .from('candidates')
      .select('id, profiles!inner(push_token)')
      .eq('is_active', true)
      .eq('availability_status', 'looking')
      .lt('created_at', cutoff)
      .not('profiles.push_token', 'is', null);

    if (!allActive?.length) {
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: recentUnlocks } = await supabase
      .from('unlocks')
      .select('candidate_id')
      .gte('unlocked_at', cutoff);

    const recentSet = new Set(
      (recentUnlocks ?? []).map((u: { candidate_id: string }) => u.candidate_id),
    );

    tokens = (allActive as { id: string; profiles: { push_token: string | null } }[])
      .filter((c) => !recentSet.has(c.id))
      .map((c) => c.profiles?.push_token ?? '')
      .filter(Boolean);
  }

  if (!tokens.length) {
    return new Response(JSON.stringify({ sent: 0, job }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Send in batches of 100 using Expo's bulk push API.
  let sent = 0;
  for (let i = 0; i < tokens.length; i += EXPO_BATCH_SIZE) {
    const batch = tokens.slice(i, i + EXPO_BATCH_SIZE).map((to) => ({
      to,
      title: msg.title,
      body: msg.body,
      sound: 'default',
      data: { job },
    }));

    await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(batch),
    });

    sent += batch.length;
  }

  return new Response(JSON.stringify({ sent, job, total: tokens.length }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
