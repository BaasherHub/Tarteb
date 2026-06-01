-- Monthly employer subscription (AED 39.99/mo) replaces per-unlock credits for new unlocks.
-- Manual activation via activate_employer_subscription() until Stripe is integrated.

alter table public.employers
  add column if not exists subscription_ends_at timestamptz;

comment on column public.employers.subscription_ends_at is
  'When set and in the future, employer may unlock candidates without per-CV credits.';

-- Allow subscription unlocks with amount_paid = 0 (legacy per-CV rows may still be 50).
alter table public.unlocks drop constraint if exists unlocks_amount_paid_check;
alter table public.unlocks
  add constraint unlocks_amount_paid_check check (amount_paid >= 0);

create or replace function public.employer_subscription_active(p_ends_at timestamptz)
returns boolean
language sql
stable
as $$
  select p_ends_at is not null and p_ends_at > now();
$$;

-- Replace unlock_candidate: requires active subscription instead of credits.
create or replace function public.unlock_candidate(p_candidate_id uuid)
returns public.unlocks
language plpgsql
security definer
set search_path = public
as $$
declare
  v_employer public.employers;
  v_unlock public.unlocks;
begin
  select * into v_employer
  from public.employers
  where user_id = auth.uid()
  for update;

  if not found then
    raise exception 'Employer profile not found';
  end if;

  select * into v_unlock
  from public.unlocks
  where employer_id = v_employer.id
    and candidate_id = p_candidate_id;

  if found then
    return v_unlock;
  end if;

  if not public.employer_subscription_active(v_employer.subscription_ends_at) then
    raise exception 'Subscription required';
  end if;

  insert into public.unlocks (employer_id, candidate_id, amount_paid)
  values (v_employer.id, p_candidate_id, 0)
  returning * into v_unlock;

  return v_unlock;
end;
$$;

grant execute on function public.unlock_candidate(uuid) to authenticated;

-- Admin / Edge Function: extend or start subscription (service role only).
create or replace function public.activate_employer_subscription(
  p_employer_id uuid,
  p_months integer default 1
)
returns public.employers
language plpgsql
security definer
set search_path = public
as $$
declare
  v_employer public.employers;
  v_base timestamptz;
begin
  if p_months is null or p_months < 1 then
    raise exception 'p_months must be at least 1';
  end if;

  select * into v_employer
  from public.employers
  where id = p_employer_id
  for update;

  if not found then
    raise exception 'Employer not found';
  end if;

  v_base := greatest(
    coalesce(v_employer.subscription_ends_at, now()),
    now()
  );

  update public.employers
  set subscription_ends_at = v_base + (p_months || ' months')::interval
  where id = p_employer_id
  returning * into v_employer;

  return v_employer;
end;
$$;

-- No grant to authenticated — call with service role from admin tooling only.
