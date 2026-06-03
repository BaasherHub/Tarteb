-- Tiered employer subscriptions.
-- starter  = AED 79.9 / month — 5 unlocks / month
-- business = AED 199  / month — 25 unlocks / month
-- agency   = AED 499  / month — unlimited

alter table public.employers
  add column if not exists subscription_tier text
  default 'starter'
  check (subscription_tier in ('starter', 'business', 'agency'));

-- Track monthly unlock counts per employer.
create table if not exists public.monthly_unlocks (
  employer_id uuid not null references public.employers(id) on delete cascade,
  month       date not null,  -- always first day of month
  count       integer not null default 0 check (count >= 0),
  primary key (employer_id, month)
);

alter table public.monthly_unlocks enable row level security;

create policy "Employers view own monthly unlocks"
  on public.monthly_unlocks for select
  using (
    exists (
      select 1 from public.employers e
      where e.id = employer_id and e.user_id = auth.uid()
    )
  );

-- Replace unlock_candidate: enforce monthly tier limits.
create or replace function public.unlock_candidate(p_candidate_id uuid)
returns public.unlocks
language plpgsql
security definer
set search_path = public
as $$
declare
  v_employer    public.employers;
  v_unlock      public.unlocks;
  v_month       date := date_trunc('month', now())::date;
  v_used        integer;
  v_limit       integer;
begin
  select * into v_employer
  from public.employers
  where user_id = auth.uid()
  for update;

  if not found then
    raise exception 'Employer profile not found';
  end if;

  -- Already unlocked — idempotent
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

  -- Determine monthly limit by tier
  v_limit := case v_employer.subscription_tier
    when 'agency'   then null   -- null = unlimited
    when 'business' then 25
    else                  5     -- starter
  end;

  if v_limit is not null then
    select coalesce(count, 0) into v_used
    from public.monthly_unlocks
    where employer_id = v_employer.id and month = v_month;

    if coalesce(v_used, 0) >= v_limit then
      raise exception 'Monthly unlock limit reached. Upgrade your plan to unlock more.';
    end if;
  end if;

  -- Insert unlock
  insert into public.unlocks (employer_id, candidate_id, amount_paid)
  values (v_employer.id, p_candidate_id, 0)
  returning * into v_unlock;

  -- Increment monthly counter
  insert into public.monthly_unlocks (employer_id, month, count)
  values (v_employer.id, v_month, 1)
  on conflict (employer_id, month)
  do update set count = public.monthly_unlocks.count + 1;

  return v_unlock;
end;
$$;

grant execute on function public.unlock_candidate(uuid) to authenticated;

-- Admin: activate subscription with tier
create or replace function public.activate_employer_subscription(
  p_employer_id uuid,
  p_months integer default 1,
  p_tier text default 'starter'
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
  if p_tier not in ('starter', 'business', 'agency') then
    raise exception 'Invalid tier';
  end if;

  select * into v_employer
  from public.employers
  where id = p_employer_id
  for update;

  if not found then
    raise exception 'Employer not found';
  end if;

  v_base := greatest(coalesce(v_employer.subscription_ends_at, now()), now());

  update public.employers
  set
    subscription_ends_at = v_base + (p_months || ' months')::interval,
    subscription_tier = p_tier
  where id = p_employer_id
  returning * into v_employer;

  return v_employer;
end;
$$;
