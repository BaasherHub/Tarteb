-- Track how many times employers opened a candidate profile (browse detail).
alter table public.candidates
  add column if not exists profile_view_count integer not null default 0;

comment on column public.candidates.profile_view_count is
  'Incremented when an employer opens candidate detail (notify-candidate viewed event).';

create or replace function public.increment_candidate_profile_view(p_candidate_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.candidates
  set profile_view_count = profile_view_count + 1
  where id = p_candidate_id;
$$;
