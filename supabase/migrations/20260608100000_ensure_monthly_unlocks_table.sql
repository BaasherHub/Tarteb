-- Repair: monthly_unlocks may be missing on remote despite tiered_pricing migration history.
create table if not exists public.monthly_unlocks (
  employer_id uuid not null references public.employers(id) on delete cascade,
  month       date not null,
  count       integer not null default 0 check (count >= 0),
  primary key (employer_id, month)
);

alter table public.monthly_unlocks enable row level security;

drop policy if exists "Employers view own monthly unlocks" on public.monthly_unlocks;
create policy "Employers view own monthly unlocks"
  on public.monthly_unlocks for select
  using (
    exists (
      select 1 from public.employers e
      where e.id = employer_id and e.user_id = auth.uid()
    )
  );
