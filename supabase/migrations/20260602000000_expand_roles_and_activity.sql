-- Expand job roles, open up location field, add candidate activity tracking.

-- Drop the hardcoded role check constraint so new categories are accepted.
alter table public.candidates drop constraint if exists candidates_role_check;

-- Drop the limited location check constraint — location is now free-text (emirate + area).
alter table public.candidates drop constraint if exists candidates_location_check;

-- Track when a candidate was last active in the app.
alter table public.candidates
  add column if not exists last_active_at timestamptz;

-- Backfill existing rows.
update public.candidates
  set last_active_at = created_at
  where last_active_at is null;

-- Index for ordering browse results by freshness.
create index if not exists candidates_last_active_idx
  on public.candidates (last_active_at desc)
  where is_active = true;

-- Rebuild candidate_browse view to expose last_active_at and order by freshness.
drop view if exists public.candidate_browse;

create or replace view public.candidate_browse
with (security_invoker = true)
as
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
  c.last_active_at,
  c.years_experience,
  c.languages,
  c.uae_experience,
  c.previous_employer,
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
