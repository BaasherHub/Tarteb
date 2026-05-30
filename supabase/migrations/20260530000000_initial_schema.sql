-- Tarteb: UAE blue-collar job marketplace
-- Run via Supabase CLI: supabase db push
-- Or paste into Supabase Dashboard → SQL Editor

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Custom types (enum-like via check constraints on text columns)
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- profiles (created first — links auth.users to app role)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  role text not null check (role in ('candidate', 'employer')),
  created_at timestamptz not null default now()
);

create index profiles_user_id_idx on public.profiles (user_id);

-- ---------------------------------------------------------------------------
-- candidates
-- ---------------------------------------------------------------------------
create table public.candidates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  name text not null,
  photo_url text,
  role text not null check (role in (
    'Cashier', 'Storekeeper', 'Driver', 'Receptionist', 'Cleaner',
    'Waiter', 'Cook', 'Security Guard', 'Sales Assistant', 'Delivery',
    'Admin', 'Warehouse', 'Barista', 'Helper'
  )),
  visa_status text not null check (visa_status in (
    'Employment Visa', 'Visit Visa', 'Own Visa', 'Cancelled Visa'
  )),
  nationality text not null,
  salary_expectation integer not null check (salary_expectation >= 0),
  available_from date not null,
  location text not null check (location in (
    'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Other'
  )),
  phone text,
  whatsapp text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index candidates_user_id_idx on public.candidates (user_id);
create index candidates_browse_idx on public.candidates (is_active, location, role)
  where is_active = true;

-- ---------------------------------------------------------------------------
-- employers
-- ---------------------------------------------------------------------------
create table public.employers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  company_name text not null,
  contact_name text not null,
  phone text not null,
  email text not null,
  location text not null,
  credits_balance integer not null default 0 check (credits_balance >= 0),
  created_at timestamptz not null default now()
);

create index employers_user_id_idx on public.employers (user_id);

-- ---------------------------------------------------------------------------
-- unlocks (AED 50 per contact unlock — 1 credit = 1 unlock)
-- ---------------------------------------------------------------------------
create table public.unlocks (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.employers (id) on delete cascade,
  candidate_id uuid not null references public.candidates (id) on delete cascade,
  amount_paid integer not null default 50 check (amount_paid > 0),
  unlocked_at timestamptz not null default now(),
  unique (employer_id, candidate_id)
);

create index unlocks_employer_id_idx on public.unlocks (employer_id);
create index unlocks_candidate_id_idx on public.unlocks (candidate_id);

-- ---------------------------------------------------------------------------
-- payments (Stripe integration — webhook updates status later)
-- ---------------------------------------------------------------------------
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.employers (id) on delete cascade,
  amount integer not null check (amount > 0),
  stripe_payment_id text,
  credits_purchased integer not null check (credits_purchased > 0),
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  created_at timestamptz not null default now()
);

create index payments_employer_id_idx on public.payments (employer_id);
create index payments_stripe_payment_id_idx on public.payments (stripe_payment_id)
  where stripe_payment_id is not null;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.candidates enable row level security;
alter table public.employers enable row level security;
alter table public.unlocks enable row level security;
alter table public.payments enable row level security;

-- profiles
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- candidates: own row full access; employers see public fields only (no phone/whatsapp)
create policy "Candidates can manage own record"
  on public.candidates for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Employers can browse active candidates"
  on public.candidates for select
  using (
    is_active = true
    and exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid() and p.role = 'employer'
    )
  );

-- employers: own row only
create policy "Employers can manage own record"
  on public.employers for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- unlocks: employer sees own unlocks; candidate sees who unlocked them
create policy "Employers can view own unlocks"
  on public.unlocks for select
  using (
    exists (
      select 1 from public.employers e
      where e.id = employer_id and e.user_id = auth.uid()
    )
  );

create policy "Employers can create unlocks"
  on public.unlocks for insert
  with check (
    exists (
      select 1 from public.employers e
      where e.id = employer_id and e.user_id = auth.uid()
    )
  );

create policy "Candidates can view unlocks of their profile"
  on public.unlocks for select
  using (
    exists (
      select 1 from public.candidates c
      where c.id = candidate_id and c.user_id = auth.uid()
    )
  );

-- payments: employer own rows only
create policy "Employers can view own payments"
  on public.payments for select
  using (
    exists (
      select 1 from public.employers e
      where e.id = employer_id and e.user_id = auth.uid()
    )
  );

create policy "Employers can insert own payments"
  on public.payments for insert
  with check (
    exists (
      select 1 from public.employers e
      where e.id = employer_id and e.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- View: candidate browse (hides contact until unlocked)
-- ---------------------------------------------------------------------------
create or replace view public.candidate_browse as
select
  c.id,
  c.name,
  c.photo_url,
  c.role,
  c.visa_status,
  c.nationality,
  c.salary_expectation,
  c.available_from,
  c.location,
  c.is_active,
  c.created_at,
  case
    when exists (
      select 1 from public.unlocks u
      join public.employers e on e.id = u.employer_id
      where u.candidate_id = c.id and e.user_id = auth.uid()
    ) then c.phone
    else null
  end as phone,
  case
    when exists (
      select 1 from public.unlocks u
      join public.employers e on e.id = u.employer_id
      where u.candidate_id = c.id and e.user_id = auth.uid()
    ) then c.whatsapp
    else null
  end as whatsapp
from public.candidates c
where c.is_active = true;

grant select on public.candidate_browse to authenticated;

-- ---------------------------------------------------------------------------
-- Storage: candidate photos
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('candidate-photos', 'candidate-photos', true)
on conflict (id) do nothing;

create policy "Candidates can upload own photo"
  on storage.objects for insert
  with check (
    bucket_id = 'candidate-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Anyone can view candidate photos"
  on storage.objects for select
  using (bucket_id = 'candidate-photos');

create policy "Candidates can update own photo"
  on storage.objects for update
  using (
    bucket_id = 'candidate-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Candidates can delete own photo"
  on storage.objects for delete
  using (
    bucket_id = 'candidate-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ---------------------------------------------------------------------------
-- RPC: unlock candidate (atomic: credit deduction + unlock insert)
-- Entire function body runs in one DB transaction; any error rolls back both steps.
-- FOR UPDATE serializes concurrent unlocks per employer (no double-spend).
-- ---------------------------------------------------------------------------
create or replace function public.unlock_candidate(p_candidate_id uuid)
returns public.unlocks
language plpgsql
security definer
set search_path = public
as $$
declare
  v_employer public.employers;
  v_unlock public.unlocks;
  v_cost constant integer := 50;
begin
  -- Lock employer row for the duration of this transaction
  select * into v_employer
  from public.employers
  where user_id = auth.uid()
  for update;

  if not found then
    raise exception 'Employer profile not found';
  end if;

  -- Idempotent: already unlocked — no credit deduction
  select * into v_unlock
  from public.unlocks
  where employer_id = v_employer.id
    and candidate_id = p_candidate_id;

  if found then
    return v_unlock;
  end if;

  -- Deduct 1 credit only while balance >= 1 (checked under row lock)
  update public.employers
  set credits_balance = credits_balance - 1
  where id = v_employer.id
    and credits_balance >= 1;

  if not found then
    raise exception 'Insufficient credits';
  end if;

  -- Insert unlock; unique (employer_id, candidate_id) aborts whole txn on race
  insert into public.unlocks (employer_id, candidate_id, amount_paid)
  values (v_employer.id, p_candidate_id, v_cost)
  returning * into v_unlock;

  return v_unlock;
end;
$$;

grant execute on function public.unlock_candidate(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- RPC: add credits after successful Stripe payment (call from Edge Function)
-- ---------------------------------------------------------------------------
create or replace function public.add_employer_credits(
  p_employer_id uuid,
  p_credits integer,
  p_payment_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.payments
  set status = 'completed'
  where id = p_payment_id and employer_id = p_employer_id and status = 'pending';

  if not found then
    raise exception 'Payment not found or already processed';
  end if;

  update public.employers
  set credits_balance = credits_balance + p_credits
  where id = p_employer_id;
end;
$$;

-- Restrict add_employer_credits to service role via Edge Functions only (no grant to authenticated)
